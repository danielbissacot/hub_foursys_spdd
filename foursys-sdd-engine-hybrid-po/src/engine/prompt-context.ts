import * as fs from 'fs';
import * as path from 'path';
import { getStackConfig } from './stack-registry';
import { loadPlaybookForStack } from './catalog-loader';
import { isTechSpecUnfilled } from '../utils';

export const DOC_FOLDER = 'doc_projeto';
export const WORKSPACE_CONTEXT_MAX_FILES = 2;   // era 5 — reduz tokens de workspace em 60%
/** Quantos arquivos o walk chega a CONSIDERAR antes de ordenar por data e cortar em
 *  WORKSPACE_CONTEXT_MAX_FILES. Nao afeta token — so os MAX_FILES finais sao enviados —,
 *  serve para o "mais recente" ser o mais recente do projeto e nao dos primeiros encontrados. */
export const WORKSPACE_CONTEXT_MAX_CANDIDATES = 400;
export const WORKSPACE_CONTEXT_MAX_LINES = 80;  // era 300 — snippet curto de imports + assinaturas
export const CONTEXT_FILE_MAX_LINES = 200;      // era 800 — cabeçalho do doc é suficiente
/** Fases que propõem estrutura/nomes de código e por isso exigem a Etapa 0 do playbook.
 *  specify-tech e plan desenham pacotes; tasks lista arquivos impactados.
 *
 *  qa-test-cases entrou depois: o Gherkin cita classe e port em cada cenário
 *  (`# Referência técnica:`, `# Ports mockados:`) e sem o mapa ele inventa. No teste de
 *  13/08/2026 citou IngestaoBoletoController, BoletoRepositoryPort, RelogioPort e
 *  AuditoriaLogPort — nenhum existe no projeto. Como o .feature vai para o Xray, o nome
 *  inventado sai do Hub e chega na ferramenta de QA.
 *
 *  qa-coverage entrou em 14/08/2026 pelo motivo inverso: ele nao inventa o que nao existe, ele
 *  NEGA o que existe. Recebendo so os 2 arquivos de codigo, viu Service + Persistence e
 *  escreveu "C4 — Nao Entregue: nao encontrado controller/DTO/validacao" sobre um
 *  BoletoCobrancaController real, com @RestController e @Valid nos DTOs. O mapa custa ~700-900
 *  tokens e resolve a pergunta "isso existe?" sem precisar mandar o arquivo inteiro. */
export const PHASES_NEEDING_PROJECT_MAP = new Set(['specify', 'plan', 'tasks', 'qa-test-cases', 'qa-coverage']);

/** Teto de arquivos POR FASE, sobrepondo WORKSPACE_CONTEXT_MAX_FILES.
 *
 *  O 2 foi calibrado para as fases de DESENHO (plan), onde o codigo entra so como amostra de
 *  estilo e nomenclatura — 2 arquivos bastam e o resto e desperdicio. O qa-coverage tem outro
 *  trabalho: conferir se CADA criterio de aceite existe no codigo entregue. Uma feature normal
 *  sai com Controller + DTO + Mapper + Service + Port + Persistence + Entity; com 2 arquivos
 *  ele so podia reprovar.
 *
 *  Custo: 8 x WORKSPACE_CONTEXT_MAX_LINES = 640 linhas no pior caso, e so nesta fase. */
export const PHASE_WORKSPACE_MAX_FILES: Record<string, number> = {
    'qa-coverage': 8,
};

/** Teto de LINHAS por arquivo, por fase. Companheiro obrigatorio do teto acima: aumentar o
 *  numero de arquivos sem aumentar o corte so entrega mais comecos de arquivo.
 *
 *  Medido em 14/08/2026, ja com os 8 arquivos: o qa-coverage marcou C1/C2/C3 como
 *  "Parcialmente Entregue — o trecho fornecido nao mostra a linha de atualizacao/persistencia".
 *  O BoletoCobrancaService tem 162 linhas e o metodo executar() comeca na 55; com corte em 80 ele
 *  recebeu a assinatura e perdeu o corpo, que e exatamente onde vivem as regras de negocio que
 *  essa fase tem de conferir. 4 dos 13 arquivos da feature passavam de 80 linhas. */
export const PHASE_WORKSPACE_MAX_LINES: Record<string, number> = {
    'qa-coverage': 250,
};

export const PHASES_NEEDING_WORKSPACE = new Set([
    'plan',
    // qa-coverage: valida se cada critério de aceite foi de fato entregue no código real
    // (endpoint, regra, tela) — precisa ver a aplicação real, não só os Casos de Teste.
    'qa-coverage'
    // removido qa-test-cases/qa-test-plan (baseados na história, não em código real).
]);

export interface ResolvedPhasePaths {
    outputPath: string;
    contextFiles: string[];
}

/**
 * Mapeia cada comando de fase (constitution, specify, plan, tasks, qa-*, po-*) para o arquivo
 * de saída e os arquivos de contexto que devem ser lidos e injetados no prompt. resourcesPath
 * é a pasta resources/ do host (extensão VS Code ou plugin IntelliJ) — usada só pelos
 * templates HTML de qa-coverage/qa-report.
 */
export function resolveOutputAndContextFiles(
    command: string,
    docPath: string,
    storyDocPath: string,
    resourcesPath: string
): ResolvedPhasePaths {
    let outputPath = '';
    let contextFiles: string[] = [];

    switch (command) {
        case 'constitution':
            outputPath = path.join(docPath, 'constitution.md');
            break;
        case 'specify':
            outputPath = path.join(storyDocPath, 'user_story.md');
            contextFiles = [
                path.join(docPath, 'constitution.md'),
                path.join(storyDocPath, 'user_story.md'),
            ];
            break;
        case 'plan':
            outputPath = path.join(storyDocPath, 'implementation_plan.md');
            contextFiles = [
                path.join(docPath, 'constitution.md'),
                path.join(storyDocPath, 'user_story.md'),
                path.join(storyDocPath, 'technical_spec.md'),
            ];
            break;
        case 'tasks':
            outputPath = path.join(storyDocPath, 'task_list.md');
            contextFiles = [
                path.join(docPath, 'constitution.md'),
                path.join(storyDocPath, 'implementation_plan.md'),
                path.join(storyDocPath, 'technical_spec.md'),
            ];
            break;
        case 'qa-test-plan':
            outputPath = path.join(storyDocPath, 'qa', 'plano_testes.md');
            // technical_spec.md fica de fora: seu conteúdo já foi absorvido pelo
            // implementation_plan.md na fase 'plan' — injetar os dois duplica contexto.
            contextFiles = [
                path.join(docPath, 'constitution.md'),
                path.join(storyDocPath, 'user_story.md'),
                path.join(storyDocPath, 'implementation_plan.md'),
            ];
            break;
        case 'qa-test-cases':
            outputPath = path.join(storyDocPath, 'qa', 'casos_teste.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(storyDocPath, 'qa', 'plano_testes.md')];
            break;
        case 'qa-coverage':
            outputPath = path.join(storyDocPath, 'qa', 'review_cobertura.md');
            // le user_story.md (criterios de aceite) e casos_teste.md (cenarios Gherkin
            // detalhados) — a validacao aqui e contra o codigo real entregue.
            contextFiles = [
                path.join(docPath, 'constitution.md'),
                path.join(storyDocPath, 'user_story.md'),
                path.join(storyDocPath, 'qa', 'casos_teste.md'),
                path.join(resourcesPath, 'qa-coverage-template.html'),
            ];
            break;
        case 'qa-report':
            outputPath = path.join(storyDocPath, 'qa', 'relatorio_qualidade.md');
            contextFiles = [
                path.join(docPath, 'constitution.md'),
                path.join(storyDocPath, 'qa', 'review_cobertura.md'),
                path.join(resourcesPath, 'qa-report-template.html'),
            ];
            break;
        case 'po-discovery':
            outputPath = path.join(docPath, 'discovery.md');
            contextFiles = [path.join(docPath, 'discovery-draft.md')];
            break;
        case 'po-prd':
            outputPath = path.join(docPath, 'prd.md');
            contextFiles = [path.join(docPath, 'discovery.md')];
            break;
        case 'po-stories':
            outputPath = path.join(docPath, 'user_stories.md');
            contextFiles = [path.join(docPath, 'discovery.md'), path.join(docPath, 'prd.md')];
            break;
    }

    // technical_spec.md so entra no contexto se a pessoa escreveu algo nele. Em branco (template
    // novo ou o antigo de versoes <= 1.2.5) ele e descartado: injetar template vazio gasta
    // contexto a toa e ainda oferece o texto de exemplo pra IA copiar como se fosse dado real
    // do projeto — a descoberta da estrutura real e trabalho da Etapa 0 do playbook.
    contextFiles = contextFiles.filter(file => {
        if (path.basename(file) !== 'technical_spec.md') { return true; }
        try {
            return !isTechSpecUnfilled(fs.readFileSync(file, 'utf8'));
        } catch {
            return false;
        }
    });

    return { outputPath, contextFiles };
}

export function getDocPath(rootPath: string): string {
    const docPath = path.join(rootPath, DOC_FOLDER);
    if (!fs.existsSync(docPath)) { fs.mkdirSync(docPath, { recursive: true }); }
    return docPath;
}

/**
 * Codigo de teste, nas duas convencoes que as stacks do Hub usam: pasta separada
 * (Maven/Gradle — src/test/java/..., src/androidTest/) ou vizinho do codigo
 * (Angular/Node — login.page.spec.ts). Nao serve para EXCLUIR arquivo, so para ordenar:
 * um projeto que so tem teste continua entregando o que tem.
 */
export function isTestFile(filePath: string): boolean {
    const norm = filePath.replace(/\\/g, '/');
    if (/\/src\/(test|androidTest)\//.test(norm)) { return true; }
    const base = path.basename(norm, path.extname(norm));
    return base.endsWith('.spec') || base.endsWith('.test')
        || base.endsWith('Test') || base.endsWith('Tests') || base.endsWith('IT');
}

export function readWorkspaceContext(
    rootPath: string,
    stackId: string,
    maxFiles: number = WORKSPACE_CONTEXT_MAX_FILES,
    maxLines: number = WORKSPACE_CONTEXT_MAX_LINES
): string {
    const config = getStackConfig(stackId);
    const srcPath = path.join(rootPath, 'src');
    if (!fs.existsSync(srcPath)) { return ''; }

    // Dois tetos aqui ja cegaram a funcao inteira:
    //
    // 1) `depth > 6` — num projeto Maven padrao os .java ficam em
    //    src/main/java/br/com/empresa/proj/camada/ (profundidade 8+). O walk morria no nivel 6
    //    e so alcancava src/main/resources/. O qa-coverage, que decide "pronto para
    //    homologacao", reprovava TODA entrega porque nunca via uma classe: no teste de
    //    13/08/2026 ele recebeu application.yml e global.properties e reprovou uma feature com
    //    25 arquivos e 100 testes passando. Mesmo bug ja corrigido em readProjectMap.
    //
    // 2) o teto de coleta parava a BUSCA nos 6 primeiros arquivos encontrados. Como o sort por
    //    mtime vem depois, ele escolhia "os 2 mais recentes entre 6 arbitrarios" (sempre os
    //    mesmos, na ordem alfabetica de pastas) em vez dos 2 mais recentes do projeto — que e
    //    justamente o que torna o snippet relevante.
    //
    // Corrigir os dois NAO aumenta token: WORKSPACE_CONTEXT_MAX_FILES continua 2 e so esses
    // 2 sao enviados. O que muda e QUAIS 2. O custo extra e varredura de disco.
    const collected: { filePath: string; mtime: number; isTest: boolean }[] = [];
    const walk = (dir: string, depth: number) => {
        if (depth > PROJECT_MAP_MAX_DEPTH || collected.length >= WORKSPACE_CONTEXT_MAX_CANDIDATES) { return; }
        let entries: fs.Dirent[];
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
        for (const entry of entries) {
            if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'out') { continue; }
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) { walk(full, depth + 1); }
            else if (config.fileExtensions.includes(path.extname(entry.name))) {
                try {
                    collected.push({ filePath: full, mtime: fs.statSync(full).mtimeMs, isTest: isTestFile(full) });
                } catch { /* ignorar */ }
            }
        }
    };
    walk(srcPath, 0);
    // Producao antes de teste, e SO DEPOIS por mtime. Ordenar so por mtime dava o pior
    // resultado possivel justamente onde mais importa: no Implement o ultimo arquivo escrito e
    // sempre o teste (a Task List manda escrever o teste junto da classe), entao o qa-coverage
    // recebia dois arquivos de teste e nenhuma classe de producao — e e ele quem decide "pronto
    // para homologacao". O proprio playbook dele diz que nao e auditoria de teste automatizado:
    // e conferir se a FUNCIONALIDADE existe no codigo. Sem ver o codigo, nao da para conferir.
    collected.sort((a, b) => Number(a.isTest) - Number(b.isTest) || b.mtime - a.mtime);
    const selected = collected.slice(0, maxFiles);
    if (selected.length === 0) { return ''; }

    let context = '\n--- CÓDIGO REAL DO WORKSPACE (use como referência para nomes e estrutura) ---\n';
    for (const { filePath } of selected) {
        try {
            const lines = fs.readFileSync(filePath, 'utf8').split('\n');
            const snippet = lines.slice(0, maxLines).join('\n');
            // Avisar o corte importa: sem isso a IA le o fim do trecho como fim do arquivo e
            // conclui "nao implementado" para o que ficou depois da linha de corte.
            const corte = lines.length > maxLines ? `\n... [truncado — arquivo tem ${lines.length} linhas]` : '';
            context += `\n--- ARQUIVO EXISTENTE: ${path.relative(rootPath, filePath)} ---\n${snippet}${corte}\n`;
        } catch { /* ignorar */ }
    }

    // Lista apenas os arquivos enviados à IA como zona protegida
    let protectedList = '\n⚠️ Existentes — não modificar sem Task List:\n';
    for (const { filePath } of selected) {
        protectedList += `  - ${path.relative(rootPath, filePath)}\n`;
    }
    context += protectedList;

    return context;
}

/** Identificador base real do projeto, lido do manifesto. No pom.xml o PRIMEIRO <groupId> quase
 *  sempre e do <parent> (org.springframework.boot) — por isso o bloco parent e removido antes. */
function readBaseIdentifier(rootPath: string, stackId: string): string {
    try {
        if (stackId === 'spring_boot') {
            const pom = path.join(rootPath, 'pom.xml');
            if (fs.existsSync(pom)) {
                const semParent = fs.readFileSync(pom, 'utf8').replace(/<parent>[\s\S]*?<\/parent>/, '');
                const g = semParent.match(/<groupId>([^<]+)<\/groupId>/);
                if (g) { return `groupId (pom.xml): ${g[1].trim()}`; }
            }
            const gradle = ['build.gradle', 'build.gradle.kts']
                .map(f => path.join(rootPath, f)).find(f => fs.existsSync(f));
            if (gradle) {
                const g = fs.readFileSync(gradle, 'utf8').match(/^\s*group\s*=?\s*['"]([^'"]+)['"]/m);
                if (g) { return `group (build.gradle): ${g[1].trim()}`; }
            }
        }
        if (stackId === 'angular' || stackId === 'node') {
            const pkg = path.join(rootPath, 'package.json');
            if (fs.existsSync(pkg)) {
                const nome = JSON.parse(fs.readFileSync(pkg, 'utf8')).name;
                if (nome) { return `name (package.json): ${nome}`; }
            }
        }
        if (stackId === 'android') {
            const gradle = path.join(rootPath, 'app', 'build.gradle.kts');
            if (fs.existsSync(gradle)) {
                const m = fs.readFileSync(gradle, 'utf8').match(/(?:namespace|applicationId)\s*=?\s*['"]([^'"]+)['"]/);
                if (m) { return `namespace (app/build.gradle.kts): ${m[1].trim()}`; }
            }
        }
    } catch { /* manifesto ilegivel — cai no fallback da arvore de pastas */ }
    return '';
}

const PROJECT_MAP_MAX_DIRS = 60;
const PROJECT_MAP_MAX_NAMES = 150;
/** Pacote Java come muita profundidade so em prefixo: src/main/java/br/com/empresa/proj/
 *  ja consome 7 niveis antes da primeira pasta de codigo. Com o limite antigo (8) o mapa
 *  parava exatamente em .../adapter e nunca chegava em .../adapter/exception/handler —
 *  a pasta nem aparecia no prompt, e a IA propunha criar handler que ja existia. */
const PROJECT_MAP_MAX_DEPTH = 20;

/**
 * Mapa barato do projeto: identificador base + arvore de pastas COM os nomes ja existentes
 * em cada uma (so nomes, sem conteudo de arquivo).
 *
 * A Etapa 0 dos playbooks exige "use o pacote real do projeto" e "liste o que ja existe", mas
 * readWorkspaceContext manda poucos arquivos de src/ — nunca o pom.xml (que fica na raiz) nem a
 * estrutura de pacotes. Sem estes dados a IA nao tem como cumprir a Etapa 0: ou trava pedindo
 * as informacoes, ou inventa o pacote (que foi o bug original).
 *
 * So a lista de pastas nao basta: no teste E2E o Tasks viu `adapter/exception/handler/` vazia
 * de nomes e propos criar um `GlobalExceptionHandler`, sem enxergar que o projeto ja tinha
 * `RestExceptionHandler` e `BusinessExceptionHandler` ali dentro. Por isso o mapa agora leva
 * tambem os nomes. Custa ~700-900 tokens num projeto medio, contra ~26k de injetar as skills.
 */
export function readProjectMap(rootPath: string, stackId: string): string {
    const srcPath = path.join(rootPath, 'src');
    if (!fs.existsSync(srcPath)) { return ''; }

    const config = getStackConfig(stackId);
    const arvore: { dir: string; nomes: string[] }[] = [];
    let totalNomes = 0;
    let nomesTruncados = false;

    const walk = (dir: string, depth: number) => {
        if (depth > PROJECT_MAP_MAX_DEPTH || arvore.length >= PROJECT_MAP_MAX_DIRS) { return; }
        let entries: fs.Dirent[];
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }

        // Nome sem extensao: Foo.java -> Foo. Em Angular isso colapsa o trio
        // foo.component.{ts,html,scss} num unico "foo.component" — dai o Set.
        const nomes = new Set<string>();
        const subdirs: string[] = [];
        for (const entry of entries) {
            if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'out') { continue; }
            if (entry.isDirectory()) { subdirs.push(path.join(dir, entry.name)); continue; }
            const ext = path.extname(entry.name);
            if (!config.fileExtensions.includes(ext)) { continue; }
            const base = path.basename(entry.name, ext);
            // Em Angular/Node o teste mora ao lado do codigo (login.page.spec.ts). Listar os
            // dois dobrava a lista e estourava o teto ANTES de chegar em shared/, que e
            // justamente onde moram os componentes reutilizaveis. O nome do teste e derivavel
            // do nome do arquivo, entao nao paga o token.
            if (base.endsWith('.spec') || base.endsWith('.test')) { continue; }
            nomes.add(base);
        }

        const selecionados: string[] = [];
        for (const nome of nomes) {
            if (totalNomes >= PROJECT_MAP_MAX_NAMES) { nomesTruncados = true; break; }
            selecionados.push(nome);
            totalNomes++;
        }
        // Pasta sem nome nenhum e so passagem (br/, com/, empresa/, src/main/java/...):
        // emitir uma linha para ela gastaria token sem informar nada. O caminho completo
        // continua visivel na linha da pasta folha que tem conteudo.
        if (selecionados.length > 0) {
            arvore.push({ dir: path.relative(rootPath, dir).replace(/\\/g, '/'), nomes: selecionados });
        }

        for (const sub of subdirs) { walk(sub, depth + 1); }
    };
    walk(srcPath, 0);
    if (arvore.length === 0) { return ''; }

    const identificador = readBaseIdentifier(rootPath, stackId);
    let mapa = '\n--- MAPA REAL DO PROJETO (para a Etapa 0 — use estes nomes, não invente) ---\n';
    if (identificador) { mapa += `${identificador}\n`; }
    mapa += 'Estrutura existente (pasta e, abaixo dela, os nomes que já existem lá):\n';
    for (const { dir, nomes } of arvore) {
        mapa += `  ${dir}\n      ${nomes.join(', ')}\n`;
    }
    if (arvore.length >= PROJECT_MAP_MAX_DIRS) { mapa += '  (pastas truncadas)\n'; }
    if (nomesTruncados) { mapa += '  (nomes truncados)\n'; }
    mapa += 'Siga esta estrutura e esta nomenclatura. Se a história pedir algo que não existe aqui, ' +
            'proponha o novo DENTRO desta estrutura, nunca em pacote inventado.\n';
    mapa += 'ANTES de propor um arquivo novo, procure nesta lista um nome que já cumpra o mesmo papel ' +
            '(ex.: um handler de exceções, um mapper, um config). Se existir, REUSE o existente e diga ' +
            'qual é — criar um segundo componente para a mesma responsabilidade é erro.\n';
    return mapa;
}

/** Escolhe se injeta o código real do workspace pra fase — centralizado aqui pra extension.ts
 *  (VS Code) e assembleFinalPrompt (IntelliJ/CLI) nunca divergirem na mesma decisão. */
export function readWorkspaceContextForPhase(command: string, rootPath: string, stackId: string): string {
    if (PHASES_NEEDING_WORKSPACE.has(command)) {
        return readWorkspaceContext(
            rootPath,
            stackId,
            PHASE_WORKSPACE_MAX_FILES[command] ?? WORKSPACE_CONTEXT_MAX_FILES,
            PHASE_WORKSPACE_MAX_LINES[command] ?? WORKSPACE_CONTEXT_MAX_LINES
        );
    }
    return '';
}

/**
 * Regra de precedencia, anexada ao bloco de stack real de TODAS as stacks.
 *
 * Vive junto com o dado de proposito: se estivesse escrita nos playbooks, seriam 7 arquivos de
 * constitution + 7 de plan para manter em sincronia, e ja erramos isso uma vez (a regra do
 * @pendente-po ficou 4 rodadas num playbook que a stack Java nem le). Aqui e um ponto so e chega
 * em toda fase que recebe o bloco.
 *
 * O caso que motivou: o technical_spec e escrito a mao pelo PO e pode pedir "MongoDB" ou "Java 21"
 * num projeto que e JPA e Java 17. Em 16/08/2026 a IA resolveu bem por conta propria (registrou
 * como suposicao S4 em vez de escolher em silencio), mas por interpretacao, nao por regra.
 */
const PRECEDENCIA_STACK =
    'PRECEDÊNCIA: este bloco foi lido do arquivo de build do projeto e descreve o que EXISTE. '
    + 'Se algum documento do contexto (technical_spec, História, Constituição) pedir tecnologia ou '
    + 'versão diferente do que está aqui, NÃO escolha em silêncio: implemente conforme este bloco e '
    + 'registre a divergência de forma visível — como suposição a confirmar no Specify, ou na tabela '
    + 'de decisão arquitetural no Plan. Quem pediu precisa saber que o projeto não suporta o pedido.\n';

/**
 * Le a versao real do Java e do Spring Boot do pom.xml.
 *
 * Ate 14/08/2026 readProjectStackInfo devolvia '' para tudo que nao fosse angular/node — nao por
 * decisao, mas porque ela so sabia ler package.json e ninguem escreveu o ramo do Maven. Efeito:
 * o playbook diz "Java 21" fixo e a Constituicao do Kit saiu declarando Java 21 num projeto com
 * <java.version>17</java.version>. Nao quebrou porque a IA nao usou nada exclusivo do 21 —
 * record (16), sealed (17) e var (10) compilam no 17. Mas pattern matching for switch, record
 * patterns e SequencedCollection sao 21: a primeira historia que levar a IA para la quebra o
 * build. E o aviso que o Angular ja recebe ("nao empurre a versao ideal do playbook por cima de
 * um projeto que ja funciona") e exatamente o que faltava aqui.
 */
function readMavenStackInfo(rootPath: string): string {
    const pomPath = path.join(rootPath, 'pom.xml');
    if (!fs.existsSync(pomPath)) { return ''; }
    try {
        const pom = fs.readFileSync(pomPath, 'utf-8');
        // <java.version> e a propriedade que o starter do Spring Boot usa; maven.compiler.release
        // cobre o pom que define a versao direto no plugin.
        const javaVersion = pom.match(/<java\.version>\s*([\d.]+)\s*<\/java\.version>/)?.[1]
            ?? pom.match(/<maven\.compiler\.release>\s*([\d.]+)\s*<\/maven\.compiler\.release>/)?.[1]
            ?? pom.match(/<maven\.compiler\.source>\s*(\d[\d.]*)\s*<\/maven\.compiler\.source>/)?.[1];
        // A versao do Boot vem do <parent>, entao pega o <version> que estiver logo depois dele.
        const bootVersion = pom.match(/spring-boot-starter-parent<\/artifactId>\s*<version>\s*([\d.]+[\w.-]*)\s*</)?.[1];
        if (!javaVersion && !bootVersion) { return ''; }

        let info = '\n--- STACK REAL DO PROJETO (detectado via pom.xml) ---\n';
        info += 'ATENÇÃO: calibre a Constituição/Plano ao que está instalado abaixo. NÃO empurre a versão "ideal" do playbook por cima de um projeto existente que já funciona — só proponha migração se o usuário pedir explicitamente.\n';
        info += PRECEDENCIA_STACK;
        if (javaVersion) {
            info += `Java configurado no pom.xml: ${javaVersion}\n`;
            // Só o major importa, e ele tem de sair de parse de INTEIRO. `Number('17.0.1')` é NaN, e
            // `NaN < 21` é false — com um pom de três dígitos o aviso simplesmente não saía. O
            // formato `1.8` do Java legado tambem cai aqui: major 1 → avisa, que é o correto.
            const major = parseInt(javaVersion, 10);
            if (Number.isFinite(major) && major < 21) {
                // Record é 16+, sealed é 17+: afirmar que valem em Java 8 ou 11 mandaria a IA gerar
                // código que não compila — o oposto do objetivo deste aviso.
                const permitidos = major >= 17
                    ? ' Record, sealed classes e var são válidos neste nível.'
                    : major >= 16
                        ? ' Record e var são válidos neste nível; sealed classes NÃO (exigem 17).'
                        : ' Também NÃO use record (exige 16) nem sealed classes (exigem 17).';
                info += `IMPORTANTE: este projeto compila em Java ${javaVersion}. NÃO gere código com recursos exclusivos do Java 21 (pattern matching for switch, record patterns, virtual threads, SequencedCollection/getFirst/getLast) — o build quebra.${permitidos}\n`;
            }
        }
        if (bootVersion) { info += `Spring Boot: ${bootVersion}\n`; }

        // Bibliotecas cuja AUSENCIA quebra codigo que a IA escreveria por habito. O caso medido
        // em 14/08/2026 foi Lombok: os exemplos da instruction e a regra de PII da Constituicao
        // usam @RequiredArgsConstructor, @Builder e @ToString.Exclude, e este Kit nao tem Lombok
        // nenhum. A IA escreveu 5 arquivos de teste com builder(), nao compilou, e resolveu
        // APAGANDO os testes e declarando a entrega pronta. Ela so descobriu a ausencia depois de
        // escrever. Saber antes e a diferenca entre escrever certo e escrever, quebrar e apagar.
        const libs: [string, string, string][] = [
            ['lombok', 'Lombok', 'NÃO use @Data/@Builder/@Getter/@Setter/@RequiredArgsConstructor/@ToString.Exclude. Escreva construtor, getters e equals/hashCode à mão, ou use record onde couber. Em teste, construa objetos pelo construtor real — builder() não existe aqui.'],
            ['mapstruct', 'MapStruct', 'NÃO anote mapper com @Mapper esperando geração automática; escreva a conversão à mão.'],
        ];
        const ausentes = libs.filter(([artefato]) => !new RegExp(`<artifactId>\\s*${artefato}`, 'i').test(pom));
        if (ausentes.length) {
            info += 'Bibliotecas NÃO disponíveis neste projeto — confira antes de escrever código ou teste:\n';
            for (const [, nome, instrucao] of ausentes) { info += `  ${nome}: ausente. ${instrucao}\n`; }
        }
        return info;
    } catch {
        return '';
    }
}

/**
 * Codigo que NENHUM humano escreveu: um processador de anotacao gerou durante o build.
 *
 * Sai da conta principal, e a razao e paridade com o Sonar — nao indulgencia.
 *
 * Conferido no Kit em 17/08/2026: o `ContaCorrenteMapperImpl` do MapStruct e gerado em
 * `target/generated-sources/annotations/`, o pom nao declara `sonar.sources` nem usa build-helper
 * para acrescentar essa pasta, e o default do Sonar e `src/main/java`. Ou seja: o Sonar NAO
 * analisa esse arquivo. O JaCoCo analisa, porque trabalha sobre `target/classes/*.class` e o
 * `.class` esta la.
 *
 * Consequencia da versao anterior desta funcao, que mantinha o gerado na conta: o Hub reportava
 * 88,0% de linha afirmando ser "o numero que o Sonar oficial vai ver", quando o Sonar veria 93,2%.
 * Reportar abaixo do real e tao ruim quanto reportar acima — manda escrever teste para arquivo que
 * nao existe no repositorio, exatamente a armadilha que a skill springboot-testing evita.
 *
 * Por isso tambem NAO adianta acrescentar `*MapperImpl.java` ao `sonar.coverage.exclusions` do pom:
 * nao ha o que excluir de uma analise que nunca incluiu.
 */
function ehCodigoGerado(classe: string): boolean {
    // `/^Q[A-Z]/` para QueryDSL foi retirado: casava com QRCodeService e QRCodeGenerator, classes
    // escritas a mao, e o rotulo "CÓDIGO GERADO, não escreva teste" mandaria deixar codigo real sem
    // teste. QueryDSL gera dentro de `com.querydsl` ou em pacote proprio, e nenhum projeto Foursys
    // usa hoje — o risco de marcar producao como gerada e maior que o ganho.
    return /MapperImpl$/.test(classe)        // MapStruct
        || /_$/.test(classe);                 // metamodelo JPA (Entidade_)
}

/** Minimos da Foursys: abaixo disso nao passa no Sonar oficial, mesmo em legado. */
export const COVERAGE_MIN_LINE = 95;
export const COVERAGE_MIN_BRANCH = 90;
/** Fases que decidem "pronto para homologacao" e por isso precisam do numero medido. */
export const PHASES_NEEDING_COVERAGE = new Set(['qa-coverage', 'qa-report']);

/** Fases que decidem OU escrevem componente de tela. `specify` fica de fora de proposito: ele
 *  trata de negocio, e encher o prompt dele com nome de classe CSS so gasta token. */
export const PHASES_NEEDING_DESIGN_SYSTEM = new Set(['plan', 'tasks', 'implement']);

/**
 * Injeta o Design System selecionado pelo usuario no contexto da fase.
 *
 * O DS ja era copiado para as customizacoes do Copilot (ver _injectCopilotCustomizations), o que
 * cobre o chat livre — mas as fases do SDD montam o proprio prompt e nunca o incluiam. Resultado
 * medido em 20/08/2026 no Projeto Hub, gerando um modal com o Liquid selecionado: a IA acertou
 * `brad-modal` e `brad-modal__content` por IMITACAO do codigo que ja existia no projeto, e
 * inventou o resto — saiu `brad-button brad-button--primary brad-button--lg` quando o Liquid
 * define `brad-btn brad-btn-primary` e nem tem tamanho `lg`; e `brad-modal__close`, que nao existe
 * no DS. Onde ha exemplo no projeto ela copia, onde nao ha ela inventa.
 *
 * Sem DS selecionado devolve string vazia — nenhuma fase muda de comportamento, e stack que nao
 * usa DS (Java) segue exatamente como hoje.
 */
export function readDesignSystem(
    catalogPaths: (string | null)[],
    activeDesignSystem: string | undefined
): string {
    if (!activeDesignSystem || activeDesignSystem === 'none') { return ''; }
    for (const base of catalogPaths) {
        if (!base) { continue; }
        const dsPath = path.join(base, 'design-systems', `${activeDesignSystem}.md`);
        if (!fs.existsSync(dsPath)) { continue; }
        try {
            const conteudo = fs.readFileSync(dsPath, 'utf-8');
            return '\n--- DESIGN SYSTEM DO PROJETO (obrigatorio) ---\n'
                + `Este projeto usa o Design System **${activeDesignSystem}**. Use EXATAMENTE os nomes de `
                + 'classe, a estrutura e as APIs definidos abaixo ao criar ou alterar componente de tela. '
                + 'NAO invente variacao de nome de classe nem tamanho que nao esteja aqui. '
                + 'Se precisar de um componente que o Design System nao cobre, diga isso explicitamente '
                + 'em vez de inventar a classe.\n\n'
                + conteudo + '\n';
        } catch { /* ilegivel — segue sem DS, como antes */ }
    }
    return '';
}

/**
 * Le target/site/jacoco/jacoco.csv e injeta o percentual JA CALCULADO.
 *
 * Por que o Hub calcula em vez de pedir: a IA passou a rodar o Maven e ler o csv (isso funciona
 * desde 13/08), mas mostra a cobertura POR CLASSE e nunca soma. Em 14/08/2026 apresentou uma
 * tabela com cinco classes em 100%, declarou "IMPLEMENTACAO COMPLETA" e o total real era 81,7%
 * de linha e 66,7% de branch. Para fechar a tarefa justificou a classe pior coberta com
 * "excluida do gate de cobertura pela configuracao JaCoCo (domain/entity/*.java)" — falso em
 * tres frentes: a classe esta em adapter/output/.../database/entity/, a pasta domain/entity/ nao
 * existe no projeto, e nao ha <goal>check</goal> no pom, ou seja, nao existe gate local nenhum.
 *
 * Pedir com mais enfase nao resolve: a regra ja chega pela Constituicao (linha "95% linha / 90%
 * branch") e pelo criterio de conclusao da Task List, os dois canais que comprovadamente
 * funcionam. O que nao funciona e delegar a conta. Numero vindo do disco nao se negocia.
 */
/**
 * Traduz a lista <sonar.coverage.exclusions> do pom para casadores contra as colunas PACKAGE e
 * CLASS do jacoco.csv. Sem isso o total inclui o legado que o Sonar oficial ignora
 * (CORSConfig, ApiErroResponse, ServicoIndisponivelException...) e o relatorio manda escrever
 * teste justamente para as classes que a skill springboot-testing manda NAO testar.
 *
 * `src/main/java/**\/adapter/exception/handler/*.java` vira
 * { pacote termina em 'adapter.exception.handler', classe casa /^.*$/ }.
 */
function parseSonarExclusions(pomXml: string): { pkgRe: RegExp; classRe: RegExp }[] {
    const bloco = pomXml.match(/<sonar\.coverage\.exclusions>([\s\S]*?)<\/sonar\.coverage\.exclusions>/)?.[1];
    if (!bloco) { return []; }
    const escapar = (s: string) => s.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    // Um `*` casa UM segmento (pasta ou trecho de nome); `**` casa qualquer profundidade.
    // A primeira versao juntava os segmentos com ponto e comparava por endsWith — o `*` do meio
    // virava asterisco literal e `adapter.output.*.dto` nunca casava com pacote nenhum. Efeito:
    // os tres padroes desse formato no pom do Kit (adapter/input/*/dto/*DTO.java,
    // adapter/input/*/dto/mapper/*Mapper.java, adapter/output/*/dto/*.java) NAO eram excluidos, e
    // o Hub reportava cobertura menor que a do Sonar, apontando DTO e mapper como "falta teste".
    const regras: { pkgRe: RegExp; classRe: RegExp }[] = [];
    for (const bruto of bloco.split(',')) {
        const padrao = bruto.trim().replace(/^src\/main\/java\//, '').replace(/^\*\*\//, '');
        if (!padrao.endsWith('.java')) { continue; }
        const partes = padrao.split('/');
        const arquivo = partes.pop()!.replace(/\.java$/, '');
        const pacote = partes
            .filter(p => p !== '**')
            .map(p => p === '*' ? '[^.]+' : escapar(p).replace(/\*/g, '[^.]*'))
            .join('\\.');
        regras.push({
            // Sufixo de pacote: casa no fim, e so em fronteira de segmento.
            pkgRe: new RegExp(pacote ? `(^|\\.)${pacote}$` : '.*'),
            classRe: new RegExp('^' + escapar(arquivo).replace(/\*/g, '.*') + '(\\..+)?$')
        });
    }
    return regras;
}

/** Onde os runners de JS deixam cobertura. Nao existe um caminho unico como o jacoco.csv do
 *  Maven: Jest sem `coverageReporters` explicito escreve `coverage/lcov.info` +
 *  `coverage-final.json`; com o reporter `json-summary` escreve `coverage-summary.json`, que ja
 *  vem com os totais somados. Karma costuma aninhar tudo em `coverage/<nome-do-projeto>/`, e
 *  quando o karma.conf so pede `html`/`text-summary` NAO sobra arquivo legivel por maquina —
 *  esse caso cai no aviso, que e o comportamento honesto. */
function acharArquivoCobertura(rootPath: string, nome: string): string | null {
    const base = path.join(rootPath, 'coverage');
    const direto = path.join(base, nome);
    if (fs.existsSync(direto)) { return direto; }
    try {
        for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
            if (!entry.isDirectory()) { continue; }
            const aninhado = path.join(base, entry.name, nome);
            if (fs.existsSync(aninhado)) { return aninhado; }
        }
    } catch { /* sem pasta coverage — cai no aviso */ }
    return null;
}

/** Soma LF/LH (linhas) e BRF/BRH (branches) de todos os registros de um lcov.info. */
function somarLcov(conteudo: string): { lf: number; lh: number; brf: number; brh: number } {
    const total = { lf: 0, lh: 0, brf: 0, brh: 0 };
    for (const linha of conteudo.split('\n')) {
        const m = linha.match(/^(LF|LH|BRF|BRH):(\d+)/);
        if (!m) { continue; }
        const n = Number(m[2]);
        if (!Number.isFinite(n)) { continue; }
        if (m[1] === 'LF') { total.lf += n; }
        else if (m[1] === 'LH') { total.lh += n; }
        else if (m[1] === 'BRF') { total.brf += n; }
        else { total.brh += n; }
    }
    return total;
}

/** Equivalente JS do bloco de cobertura que o spring_boot ja recebia. Sem isto o Angular ficava
 *  com string vazia: nao chegava numero NEM o aviso de "nao invente percentual" — e o playbook
 *  de qa-coverage/qa-report (que e o generic, compartilhado) continuava cobrando cobertura. Em
 *  18/08/2026 o relatorio gerado no Angular trouxe uma tabela "Cobertura ESPERADA >= 90%" no
 *  lugar da linha obrigatoria "Cobertura medida", justamente por falta desta guarda. */
function lerCoberturaJs(rootPath: string): string {
    const CABECALHO = '\n--- COBERTURA MEDIDA PELO HUB ---\n';
    const AVISO_SEM_MEDICAO = CABECALHO
        + 'Nenhum relatorio de cobertura legivel foi encontrado em coverage/ '
        + '(procurados: coverage-summary.json e lcov.info): a suite nao foi executada neste '
        + 'workspace, ou o runner so gerou relatorio HTML. NAO afirme percentual de cobertura — '
        + 'registre que a medicao nao foi feita e qual comando precisa rodar '
        + '(`npm test -- --coverage`). Se o runner so emite html/text-summary, registre tambem '
        + 'que o reporter `json-summary` ou `lcov` precisa ser habilitado para haver medicao.\n';

    let linhasPct: number | null = null;
    let branchesPct: number | null = null;
    let fonte = '';

    // Degrau 1: coverage-summary.json ja traz os totais prontos.
    const summaryPath = acharArquivoCobertura(rootPath, 'coverage-summary.json');
    if (summaryPath) {
        try {
            const total = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'))?.total;
            const l = total?.lines?.pct;
            const b = total?.branches?.pct;
            if (typeof l === 'number') { linhasPct = l; }
            if (typeof b === 'number') { branchesPct = b; }
            if (linhasPct !== null) { fonte = path.relative(rootPath, summaryPath).replace(/\\/g, '/'); }
        } catch { /* json quebrado — tenta o lcov */ }
    }

    // Degrau 2: lcov.info e o que o Jest escreve por padrao quando ninguem configura reporter.
    if (linhasPct === null) {
        const lcovPath = acharArquivoCobertura(rootPath, 'lcov.info');
        if (lcovPath) {
            try {
                const t = somarLcov(fs.readFileSync(lcovPath, 'utf-8'));
                if (t.lf > 0) {
                    linhasPct = (t.lh / t.lf) * 100;
                    branchesPct = t.brf > 0 ? (t.brh / t.brf) * 100 : null;
                    fonte = path.relative(rootPath, lcovPath).replace(/\\/g, '/');
                }
            } catch { /* lcov ilegivel — cai no aviso */ }
        }
    }

    // Degrau 3: nada legivel. Mesmo tratamento que o spring_boot da quando falta o jacoco.csv.
    if (linhasPct === null) { return AVISO_SEM_MEDICAO; }

    // Relatorio mais velho que o codigo e relatorio de OUTRA entrega — mesma checagem que o
    // caminho do Maven faz, comparando com o fonte mais novo de src/.
    let fonteDesatualizada = '';
    try {
        const mtimeRelatorio = fs.statSync(path.join(rootPath, fonte)).mtimeMs;
        let maisNovo = 0;
        const varrer = (dir: string, nivel: number) => {
            if (nivel > PROJECT_MAP_MAX_DEPTH) { return; }
            let entries: fs.Dirent[];
            try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
            for (const e of entries) {
                if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'out') { continue; }
                const full = path.join(dir, e.name);
                if (e.isDirectory()) { varrer(full, nivel + 1); }
                else if (/\.(ts|html|scss)$/.test(e.name)) {
                    try { maisNovo = Math.max(maisNovo, fs.statSync(full).mtimeMs); } catch { /* ignora */ }
                }
            }
        };
        varrer(path.join(rootPath, 'src'), 0);
        if (maisNovo > mtimeRelatorio) {
            fonteDesatualizada = 'ATENCAO: ha arquivo em src/ mais novo que este relatorio — a '
                + 'medicao pode ser de uma entrega anterior. Rode a suite de novo antes de '
                + 'afirmar o numero.\n';
        }
    } catch { /* sem src/ ou stat falhou — segue sem o aviso de validade */ }

    const fmt = (n: number) => `${n.toFixed(2)}%`;
    return CABECALHO
        + `Linha: ${fmt(linhasPct)}\n`
        + `Branch: ${branchesPct === null ? 'nao reportado pelo runner' : fmt(branchesPct)}\n`
        + `Fonte: ${fonte}\n`
        + fonteDesatualizada
        + 'Este numero foi lido do disco pelo Hub. USE ELE no relatorio, nao recalcule nem estime. '
        + 'A linha obrigatoria do Relatorio de Implementacao deve ser preenchida com estes valores '
        + 'e com este caminho de arquivo como fonte.\n';
}

export function readCoverageReport(rootPath: string, stackId: string): string {
    if (stackId === 'angular' || stackId === 'node') { return lerCoberturaJs(rootPath); }
    if (stackId !== 'spring_boot') { return ''; }
    const csvPath = path.join(rootPath, 'target', 'site', 'jacoco', 'jacoco.csv');
    if (!fs.existsSync(csvPath)) {
        return '\n--- COBERTURA MEDIDA PELO HUB ---\n'
            + 'target/site/jacoco/jacoco.csv NÃO existe: a suíte não foi executada neste workspace. '
            + 'NÃO afirme percentual de cobertura — registre que a medição não foi feita e que `mvn -o clean test` precisa rodar.\n';
    }
    let pomXml = '';
    try { pomXml = fs.readFileSync(path.join(rootPath, 'pom.xml'), 'utf-8'); } catch { /* segue sem exclusoes */ }
    const exclusoes = parseSonarExclusions(pomXml);

    // Relatorio mais velho que o codigo e relatorio de OUTRA entrega. Sem esta checagem o Hub
    // injeta um numero da rodada passada com a mesma autoridade ("use ELE, não recalcule"), e a
    // fase de QA aprova ou reprova a entrega errada. Compara com o .java mais novo de src/.
    let fonteDesatualizada = '';
    try {
        const mtimeCsv = fs.statSync(csvPath).mtimeMs;
        let maisNovo = 0;
        const varrer = (dir: string, nivel: number) => {
            if (nivel > PROJECT_MAP_MAX_DEPTH) { return; }
            for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
                if (e.name.startsWith('.')) { continue; }
                const full = path.join(dir, e.name);
                if (e.isDirectory()) { varrer(full, nivel + 1); }
                else if (e.name.endsWith('.java')) {
                    const m = fs.statSync(full).mtimeMs;
                    if (m > maisNovo) { maisNovo = m; }
                }
            }
        };
        varrer(path.join(rootPath, 'src'), 0);
        if (maisNovo > mtimeCsv) {
            const min = Math.round((maisNovo - mtimeCsv) / 60000);
            fonteDesatualizada = `⚠️ MEDIÇÃO DESATUALIZADA: há código-fonte alterado ${min} minuto(s) DEPOIS deste relatório. `
                + 'Os números abaixo são da execução anterior e podem não refletir a entrega atual. '
                + 'Rode `mvn -o clean test` de novo antes de concluir qualquer coisa por cobertura.\n';
        }
    } catch { /* sem src/ ou sem permissao: segue sem o aviso */ }

    try {
        const linhas = fs.readFileSync(csvPath, 'utf-8').trim().split('\n').slice(1);
        let lm = 0, lc = 0, bm = 0, bc = 0, excluidas = 0;
        let geradas = 0, gerLm = 0;
        const piores: { classe: string; faltando: number; total: number }[] = [];
        for (const linha of linhas) {
            const c = linha.split(',');
            if (c.length < 9) { continue; }
            const [liM, liC, brM, brC] = [Number(c[7]), Number(c[8]), Number(c[5]), Number(c[6])];
            if ([liM, liC, brM, brC].some(Number.isNaN)) { continue; }
            if (ehCodigoGerado(c[2])) { geradas++; gerLm += liM; continue; }
            const fora = exclusoes.some(r => r.pkgRe.test(c[1]) && r.classRe.test(c[2]));
            if (fora) { excluidas++; continue; }
            lm += liM; lc += liC; bm += brM; bc += brC;
            if (liM > 0) { piores.push({ classe: c[2], faltando: liM, total: liM + liC }); }
        }
        if (lm + lc === 0) { return ''; }

        const pctLinha = (lc * 100) / (lm + lc);
        const pctBranch = bm + bc > 0 ? (bc * 100) / (bm + bc) : 100;
        const ok = pctLinha >= COVERAGE_MIN_LINE && pctBranch >= COVERAGE_MIN_BRANCH;

        let info = '\n--- COBERTURA MEDIDA PELO HUB (lida de target/site/jacoco/jacoco.csv) ---\n';
        info += fonteDesatualizada;
        info += 'Este número foi calculado pelo Hub a partir do arquivo em disco, já aplicando o '
             + '<sonar.coverage.exclusions> do pom. É o número que o Sonar oficial vai ver. Use ELE: '
             + 'não recalcule, não apresente cobertura por classe como se fosse o total, e não trate '
             + 'classe abaixo do mínimo como exceção aceitável — o que era exceção já saiu da conta.\n';
        info += `Linha:  ${lc}/${lm + lc} = ${pctLinha.toFixed(1)}% (mínimo ${COVERAGE_MIN_LINE}%)\n`;
        info += `Branch: ${bc}/${bm + bc} = ${pctBranch.toFixed(1)}% (mínimo ${COVERAGE_MIN_BRANCH}%)\n`;
        if (excluidas) { info += `Classes fora da conta pelas exclusões do Sonar: ${excluidas}\n`; }
        if (geradas) {
            info += `Classes de código GERADO fora da conta: ${geradas}`
                 + (gerLm ? ` (poupou ${gerLm} linhas descobertas)` : '')
                 + ' — MapStruct `*MapperImpl`, metamodelo JPA. Ficam em `target/generated-sources`, '
                 + 'que não está em `sonar.sources`: o Sonar também não as analisa. NÃO escreva teste para elas.\n';
        }
        info += `VEREDITO: ${ok ? 'ATINGE os mínimos.' : 'ABAIXO DO MÍNIMO — a entrega não pode ser declarada pronta por cobertura.'}\n`;

        if (piores.length) {
            info += 'Classes que CONTAM e estão com linha descoberta (maior déficit primeiro) — é aqui que falta teste:\n';
            for (const p of piores.sort((a, b) => b.faltando - a.faltando).slice(0, 10)) {
                info += `  ${p.classe}: faltam ${p.faltando} de ${p.total}\n`;
            }
        }

        // O <excludes> do plugin JaCoCo nao aplica nesta configuracao (exige uma tag por padrao,
        // casando caminho de .class). Por isso o Hub aplica a lista por conta propria acima — e
        // por isso o numero que o Maven imprime localmente e MENOR que o real.
        if (pomXml.includes('<exclude>${sonar.coverage.exclusions}</exclude>')) {
            info += 'NOTA: o <excludes> do jacoco-maven-plugin está como ${sonar.coverage.exclusions}, '
                 + 'que o JaCoCo não interpreta. O relatório local do Maven mostra cobertura MENOR que a real; '
                 + 'o número acima já corrige isso. Corrigir o pom (uma tag por padrão, caminho de classe) '
                 + 'é recomendação para o time — não invente que uma classe está excluída sem conferir a lista.\n';
        }

        return info;
    } catch {
        return '';
    }
}

/** Fases que escrevem caminho de arquivo de documentacao e por isso precisam saber a pasta real. */
export const PHASES_NEEDING_STORY_FOLDER = new Set(['plan', 'tasks', 'qa-test-plan', 'qa-test-cases']);

/**
 * Injeta a pasta da historia ativa. O Hub SEMPRE soube esse nome — e ele quem grava os arquivos
 * la, via resolveStoryDocPath — mas nunca contava para a IA: em 14/08/2026 a string 'escri-19223'
 * nao aparecia em NENHUM dos arquivos que a fase Tasks recebe (constitution, implementation_plan,
 * technical_spec) nem no mapa do projeto, que varre so src/.
 *
 * Sem o dado, a IA preenche a lacuna com o mais provavel: em duas rodadas seguidas inventou nomes
 * diferentes a partir do titulo da historia (us_atualizacao_data_alteracao_boleto_ingestao e
 * refino_historia_boleto). O relatorio e as evidencias cairiam fora da pasta da historia, e o QA,
 * que le pelo storyDocPath correto, nao acharia nenhum dos dois.
 *
 * Mesmo remedio que ja matou os nomes de classe inventados (readProjectMap) e o percentual de
 * cobertura chutado (readCoverageReport): se o Hub sabe o valor, ele manda — nao pede para deduzir.
 */
export function readStoryFolderInfo(rootPath: string, storyDocPath: string): string {
    const rel = path.relative(rootPath, storyDocPath).replace(/\\/g, '/');
    if (!rel || rel.startsWith('..')) { return ''; }
    return `\n--- PASTA DA HISTÓRIA ATIVA ---\n${rel}/\n`
        + 'Use EXATAMENTE este caminho ao citar arquivos de documentação desta história '
        + '(relatório, evidências, artefatos de QA). NÃO derive nome de pasta do título da história '
        + 'e NÃO deixe placeholder do tipo `<pasta-da-história>` no documento gerado.\n';
}

export function readProjectStackInfo(rootPath: string, stackId: string): string {
    if (stackId === 'spring_boot') { return readMavenStackInfo(rootPath); }
    if (stackId !== 'angular' && stackId !== 'node') { return ''; }
    const pkgPath = path.join(rootPath, 'package.json');
    if (!fs.existsSync(pkgPath)) { return ''; }
    try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        const angularVersion: string | undefined = deps['@angular/core'];
        const usesVitest = !!deps['vitest'];
        const usesJasmine = !!deps['jasmine-core'] || fs.existsSync(path.join(rootPath, 'karma.conf.js'));
        // Jest faltava aqui. Em 19/08/2026, num projeto Angular com jest 29.7 + jest-preset-angular,
        // as duas flags acima davam falso, nenhuma linha de framework era injetada, e a Constituicao
        // caia no padrao do playbook ("Vitest preferido em v21+") — orientando a stack errada.
        const usesJest = !!deps['jest'] || !!deps['jest-preset-angular']
            || ['jest.config.js', 'jest.config.ts', 'jest.config.mjs']
                .some(f => fs.existsSync(path.join(rootPath, f)));

        // Arquitetura real. A versao do package.json NAO responde isto: um projeto pode estar em
        // Angular 21 e continuar sendo NgModule. Sem este fato a Constituicao afirmava
        // "app.config.ts / app.routes.ts" e "NgModule e legado" em projeto modular — e a instruction
        // sempre-ativa repetia "NgModule e proibido" em cima de codigo que e todo NgModule.
        const temAppModule = fs.existsSync(path.join(rootPath, 'src', 'app', 'app.module.ts'));
        const temAppConfig = fs.existsSync(path.join(rootPath, 'src', 'app', 'app.config.ts'));
        const temRoutes = fs.existsSync(path.join(rootPath, 'src', 'app', 'app.routes.ts'));
        const temDomains = fs.existsSync(path.join(rootPath, 'src', 'domains'))
            || fs.existsSync(path.join(rootPath, 'src', 'app', 'domains'));
        const arquivoDeRotas = fs.existsSync(path.join(rootPath, 'src', 'app', 'app.routing.module.ts'))
            ? 'src/app/app.routing.module.ts'
            : (temRoutes ? 'src/app/app.routes.ts' : null);

        // Onde fica configuracao de ambiente. `environment.ts` as vezes e so o stub do Angular CLI
        // (`{ production: false }`) e o endpoint real vive num JSON lido em runtime — comum em
        // micro-frontend. Mandar declarar endpoint no arquivo errado custa uma tarefa inteira.
        const envPath = path.join(rootPath, 'src', 'environments', 'environment.ts');
        let envEhStub = false;
        try {
            if (fs.existsSync(envPath)) {
                const env = fs.readFileSync(envPath, 'utf-8');
                envEhStub = !/https?:|\bapi\b|endpoint|baseUrl/i.test(env);
            }
        } catch { /* ilegivel — nao afirma nada */ }
        const configJson = ['src/assets/config/config.json', 'src/assets/config.json']
            .find(p => fs.existsSync(path.join(rootPath, ...p.split('/'))));

        let info = '\n--- STACK REAL DO PROJETO (detectado via package.json) ---\n';
        info += 'ATENÇÃO: calibre a Constituição/Plano à versão e ferramentas já instaladas abaixo. NÃO empurre a versão "ideal" do playbook (ex: migrar para Vitest, forçar Angular v20+) por cima de um projeto existente que já funciona — só proponha migração se o usuário pedir explicitamente.\n';
        info += PRECEDENCIA_STACK;
        if (angularVersion) { info += `Angular instalado: ${angularVersion}\n`; }
        if (usesJest) { info += 'Framework de teste já configurado: Jest — NÃO sugerir Vitest nem Karma. Mock com `jest.fn()`/`jest.spyOn()`, execução com `npm test -- --coverage`.\n'; }
        else if (usesVitest) { info += 'Framework de teste já configurado: Vitest\n'; }
        else if (usesJasmine) { info += 'Framework de teste já configurado: Jasmine/Karma — não sugerir npm install de Vitest para substituí-lo.\n'; }

        if (temAppModule) {
            info += 'Arquitetura real: **NgModule** — existe `src/app/app.module.ts` e NÃO existe `src/app/app.config.ts`. '
                + 'Esta é a arquitetura vigente e está correta: NÃO afirme que `NgModule` é legado ou proibido, '
                + 'NÃO mande validar/criar `app.config.ts` nem `app.routes.ts`, e NÃO proponha migrar para Standalone. '
                + 'Componente novo deve ser declarado no módulo da feature, no mesmo padrão dos vizinhos.\n';
        } else if (temAppConfig) {
            info += 'Arquitetura real: **Standalone** — existe `src/app/app.config.ts`. Providers globais vão nele.\n';
        }
        if (temDomains) {
            info += 'Arquitetura real: há pasta `domains/` — projeto organizado em **Vertical Slice (DUPE)**. Respeite a fronteira entre domínios.\n';
        }
        if (arquivoDeRotas) { info += `Arquivo de rotas real: \`${arquivoDeRotas}\` — registre rota nova nele, não em outro nome.\n`; }

        if (configJson) {
            info += `Configuração de ambiente: o endpoint real vive em \`${configJson}\``;
            info += envEhStub
                ? ' (o `environment.ts` é só o stub do Angular CLI, sem endpoint — NÃO declare endpoint nele).\n'
                : ' — confirme qual dos dois a feature deve usar antes de declarar endpoint.\n';
        } else if (envEhStub) {
            info += 'Atenção: `src/environments/environment.ts` não tem endpoint algum (parece stub do Angular CLI). '
                + 'Procure onde este projeto realmente guarda configuração antes de mandar declarar endpoint nele.\n';
        }
        return info;
    } catch {
        return '';
    }
}

export interface AssembledPrompt {
    systemPrompt: string;
    finalPrompt: string;
    outputPath: string;
}

/**
 * Monta o prompt completo (system + final) para uma fase, do mesmo jeito que a extensao
 * VS Code faz hoje dentro de executeSDDPhase em extension.ts — reunindo playbook, arquivos
 * de contexto, contexto de workspace e info real da stack do projeto. Usado tanto pela
 * extensao VS Code quanto pelo plugin IntelliJ (via cli.ts), para os dois nunca divergirem
 * na forma de montar o prompt.
 */
export function assembleFinalPrompt(params: {
    command: string;
    stackId: string;
    workspaceRoot: string;
    builtinCatalogPath: string;
    externalCatalogPath: string | null;
    resourcesPath: string;
    userInstruction?: string;
}): AssembledPrompt {
    const { command, stackId, workspaceRoot, builtinCatalogPath, externalCatalogPath, resourcesPath } = params;
    const userInstruction = params.userInstruction ?? '';

    const stackConfig = getStackConfig(stackId);
    const docPath = getDocPath(workspaceRoot);
    const storyDocPath = docPath; // scaffold: sem gestao de subpasta por historia (ver utils.ts na extensao VS Code)

    const { outputPath, contextFiles } = resolveOutputAndContextFiles(command, docPath, storyDocPath, resourcesPath);

    const systemPromptRaw = loadPlaybookForStack(command, stackId, builtinCatalogPath, externalCatalogPath);
    const systemPrompt = `STACK: ${stackConfig.displayName}\n\n${systemPromptRaw}`;

    let userContext = '';
    contextFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const raw = fs.readFileSync(file, 'utf8');
            const linhas = raw.split('\n');
            const capped = linhas.slice(0, CONTEXT_FILE_MAX_LINES).join('\n');
            const corte = linhas.length > CONTEXT_FILE_MAX_LINES
                ? `\n... [truncado — ${path.basename(file)} tem ${linhas.length} linhas; leia o arquivo no workspace se precisar do resto]`
                : '';
            userContext += `\n## ${path.basename(file)}\n${capped}${corte}\n`;
        }
    });
    userContext += readWorkspaceContextForPhase(command, workspaceRoot, stackId);
    if (PHASES_NEEDING_PROJECT_MAP.has(command)) {
        userContext += readProjectMap(workspaceRoot, stackId);
    }
    if (command === 'constitution' || command === 'plan' || command === 'tasks') {
        userContext += readProjectStackInfo(workspaceRoot, stackId);
    }
    if (PHASES_NEEDING_COVERAGE.has(command)) {
        userContext += readCoverageReport(workspaceRoot, stackId);
    }

    const instruction = userInstruction.trim() !== '' ? `INSTRUÇÃO ADICIONAL: ${userInstruction}\n\n` : '';
    const contextSection = userContext.trim() !== ''
        ? `CONTEXTO DO PROJETO:\n${userContext}`
        : 'Não há contexto adicional. Gere o documento AGORA com base estritamente no PLAYBOOK acima. NÃO solicite contexto. NÃO faça perguntas.';
    const finalPrompt = `${instruction}GERE O ARQUIVO MD. Seja direto e conciso. Foque nos pontos essenciais sem exemplos redundantes.\n\n${contextSection}`;

    return { systemPrompt, finalPrompt, outputPath };
}

/** Extrai todos os blocos ```<lang>``` de um texto Markdown, na ordem em que aparecem. Usado
 *  pelo comando foursys.qaExportXray para extrair blocos ```gherkin``` de casos_teste.md. */
export function extractFencedBlocks(content: string, lang: string): string[] {
    const openRe = new RegExp(`^\`\`\`${lang}`, 'i');
    const blocks: string[] = [];
    let inBlock = false;
    let current: string[] = [];
    for (const line of content.split('\n')) {
        if (!inBlock) {
            if (openRe.test(line)) { inBlock = true; current = []; }
        } else if (line.startsWith('```')) {
            if (current.length > 0) { blocks.push(current.join('\n')); }
            inBlock = false;
        } else {
            current.push(line);
        }
    }
    return blocks;
}

/** Extrai um único bloco ```html``` de uma resposta Markdown (usado por qa-report/qa-coverage
 *  para separar o relatório HTML executivo do corpo Markdown). Mesmo padrão de parsing em
 *  máquina de estados usado em extractFencedBlocks, mas para no primeiro bloco fechado e
 *  preserva o restante do texto em `rest` — por isso não reaproveita a função acima. */
/**
 * Varre o documento gerado por placeholder que a IA nao resolveu. Ideia emprestada do
 * `/speckit.analyze` do github/spec-kit, que trata "unresolved placeholders (TODO, TKTK, ???,
 * <placeholder>)" como achado de ambiguidade.
 *
 * Vale a pena porque e deterministico: nao depende de a IA obedecer nada. Em 14/08/2026 a Task
 * List saiu com DOIS placeholders vivos — `<pasta-da-historia>` virou nome inventado e `Tarefa ZZ`
 * foi copiado literal. Placeholder que sobrevive no documento vira caminho errado no disco.
 *
 * Retorna string vazia quando esta tudo resolvido.
 */
export function detectarPlaceholders(conteudo: string, templateDoPlaybook = ''): string {
    // Padroes inequivocos: nao existe documento legitimo com "Tarefa ZZ" nem com "???".
    const padroes: [RegExp, string][] = [
        [/\bTarefa (ZZ|XX|NN)\b/g, 'numeração de tarefa não resolvida'],
        [/\?{3,}/g, 'interrogação de dúvida não resolvida'],
    ];
    // Candidatos entre < > ou [ ]: só acusados se aparecerem LITERALMENTE no playbook — ver abaixo.
    // Teto de 120 e nao 60: o placeholder `<PASTA DA HISTÓRIA ATIVA, copiada do bloco de mesmo nome
    // no contexto>` tem 67 caracteres e escapava do limite anterior.
    const candidatos: [RegExp, string][] = [
        [/<[^<>\n]{3,120}>/g, 'placeholder entre < >'],
        [/\[[^\]\n]{3,120}\](?!\()/g, 'texto de template não substituído'],
    ];
    // Trechos que aparecem no playbook como EXEMPLO do que a IA deve escrever, nao como lacuna a
    // preencher. Comparar com o template nao basta para separar os dois casos: o playbook do Specify
    // traz `[SUPOSIÇÃO S1]` e `[AJUSTADA]` como modelo, e o de Tasks usa `[!CAUTION]` (sintaxe de
    // alerta do GitHub). Esta lista e curta e fechada de proposito — se crescer, e sinal de que o
    // playbook esta usando colchete para conteudo e nao para lacuna.
    const exemplosLegitimos = [
        /^\[SUPOSIÇÃO S\d+\]$/i,
        /^\[(AJUSTADA|APROVADA|REPROVADA|PENDENTE|BLOQUEADA)\]$/i,
        /^\[![A-Z]+\]$/i,             // [!CAUTION], [!NOTE], [!IMPORTANT]
        /^\[[x ]\]$/i,                 // checkbox
    ];

    const achados = new Map<string, number>();
    const anotar = (rotulo: string, achado: string) => {
        const chave = `${rotulo}: ${achado}`;
        achados.set(chave, (achados.get(chave) ?? 0) + 1);
    };

    for (const [re, rotulo] of padroes) {
        for (const m of conteudo.matchAll(re)) { anotar(rotulo, m[0]); }
    }

    // Criterio para < > e [ ]: o trecho aparece IGUAL no texto do playbook que gerou o documento.
    //
    // Tentei antes o caminho inverso — acusar tudo entre colchetes e manter uma allowlist do que e
    // legitimo — e nao funciona. Colchete e usado para conteudo real nos nossos proprios documentos:
    // o playbook do Specify exige `[Nome da Regra] → [Condição] → [Ação]`, e no user_story de
    // 17/08/2026 isso virou `[Atualização por Operação Elegível]`, `[Operação Não Elegível]`,
    // `[Idempotência de Ingestão]` e `[Rastreabilidade]` — quatro alarmes falsos num documento
    // correto. Nenhuma allowlist cobre nome de regra de negocio, que e texto livre.
    //
    // Comparar com o playbook resolve por construcao: `[Título Curto]` e
    // `<PASTA DA HISTÓRIA ATIVA, ...>` estao escritos assim no template, entao sobreviver no
    // documento significa que nao foram substituidos. Nome de regra inventado pela IA nao esta no
    // template e nunca acusa. Tambem dispensa a lista de generics (`List<Boleto>`) e de alertas
    // (`[!CAUTION]`): nao aparecem no playbook, logo nao entram.
    if (templateDoPlaybook) {
        for (const [re, rotulo] of candidatos) {
            for (const m of conteudo.matchAll(re)) {
                if (!templateDoPlaybook.includes(m[0])) { continue; }
                if (exemplosLegitimos.some(ex => ex.test(m[0]))) { continue; }
                anotar(rotulo, m[0]);
            }
        }
    }
    if (achados.size === 0) { return ''; }
    let aviso = '⚠️ Placeholders não resolvidos no documento gerado:\n';
    for (const [chave, n] of [...achados].slice(0, 10)) { aviso += `   ${chave}${n > 1 ? ` (${n}x)` : ''}\n`; }
    return aviso;
}

export function extractHtmlBlock(content: string): { html: string | null; rest: string } {
    const lines = content.split('\n');
    const restLines: string[] = [];
    const htmlLines: string[] = [];
    let inBlock = false;
    let found = false;
    for (const line of lines) {
        if (!inBlock) {
            if (!found && /^```html\s*$/i.test(line)) {
                inBlock = true;
                continue;
            }
            restLines.push(line);
        } else if (line.startsWith('```')) {
            inBlock = false;
            found = true;
        } else {
            htmlLines.push(line);
        }
    }
    return { html: found ? htmlLines.join('\n') : null, rest: restLines.join('\n') };
}
