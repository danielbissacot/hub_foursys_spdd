import * as fs from 'fs';
import * as path from 'path';
import { getStackConfig } from './stack-registry';
import { loadPlaybookForStack } from './catalog-loader';
import { isTechSpecUnfilled } from '../utils';

export const DOC_FOLDER = 'doc_projeto';
export const WORKSPACE_CONTEXT_MAX_FILES = 2;   // era 5 — reduz tokens de workspace em 60%
export const WORKSPACE_CONTEXT_MAX_LINES = 80;  // era 300 — snippet curto de imports + assinaturas
export const CONTEXT_FILE_MAX_LINES = 200;      // era 800 — cabeçalho do doc é suficiente
/** Fases que propõem estrutura/nomes de código e por isso exigem a Etapa 0 do playbook.
 *  specify-tech e plan desenham pacotes; tasks lista arquivos impactados. */
export const PHASES_NEEDING_PROJECT_MAP = new Set(['specify', 'plan', 'tasks']);

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

export function readWorkspaceContext(rootPath: string, stackId: string): string {
    const config = getStackConfig(stackId);
    const srcPath = path.join(rootPath, 'src');
    if (!fs.existsSync(srcPath)) { return ''; }

    const collected: { filePath: string; mtime: number }[] = [];
    const walk = (dir: string, depth: number) => {
        if (depth > 6 || collected.length >= WORKSPACE_CONTEXT_MAX_FILES * 3) { return; }
        let entries: fs.Dirent[];
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
        for (const entry of entries) {
            if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'out') { continue; }
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) { walk(full, depth + 1); }
            else if (config.fileExtensions.includes(path.extname(entry.name))) {
                try { collected.push({ filePath: full, mtime: fs.statSync(full).mtimeMs }); } catch { /* ignorar */ }
            }
        }
    };
    walk(srcPath, 0);
    collected.sort((a, b) => b.mtime - a.mtime);
    const selected = collected.slice(0, WORKSPACE_CONTEXT_MAX_FILES);
    if (selected.length === 0) { return ''; }

    let context = '\n--- CÓDIGO REAL DO WORKSPACE (use como referência para nomes e estrutura) ---\n';
    for (const { filePath } of selected) {
        try {
            const lines = fs.readFileSync(filePath, 'utf8').split('\n');
            const snippet = lines.slice(0, WORKSPACE_CONTEXT_MAX_LINES).join('\n');
            context += `\n--- ARQUIVO EXISTENTE: ${path.relative(rootPath, filePath)} ---\n${snippet}\n`;
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
 * readWorkspaceContext manda so 2 arquivos de src/ — nunca o pom.xml (que fica na raiz) nem a
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
    if (PHASES_NEEDING_WORKSPACE.has(command)) { return readWorkspaceContext(rootPath, stackId); }
    return '';
}

export function readProjectStackInfo(rootPath: string, stackId: string): string {
    if (stackId !== 'angular' && stackId !== 'node') { return ''; }
    const pkgPath = path.join(rootPath, 'package.json');
    if (!fs.existsSync(pkgPath)) { return ''; }
    try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        const angularVersion: string | undefined = deps['@angular/core'];
        const usesVitest = !!deps['vitest'];
        const usesJasmine = !!deps['jasmine-core'] || fs.existsSync(path.join(rootPath, 'karma.conf.js'));

        let info = '\n--- STACK REAL DO PROJETO (detectado via package.json) ---\n';
        info += 'ATENÇÃO: calibre a Constituição/Plano à versão e ferramentas já instaladas abaixo. NÃO empurre a versão "ideal" do playbook (ex: migrar para Vitest, forçar Angular v20+) por cima de um projeto existente que já funciona — só proponha migração se o usuário pedir explicitamente.\n';
        if (angularVersion) { info += `Angular instalado: ${angularVersion}\n`; }
        if (usesVitest) { info += 'Framework de teste já configurado: Vitest\n'; }
        else if (usesJasmine) { info += 'Framework de teste já configurado: Jasmine/Karma — não sugerir npm install de Vitest para substituí-lo.\n'; }
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
            const capped = raw.split('\n').slice(0, CONTEXT_FILE_MAX_LINES).join('\n');
            userContext += `\n## ${path.basename(file)}\n${capped}\n`;
        }
    });
    userContext += readWorkspaceContextForPhase(command, workspaceRoot, stackId);
    if (PHASES_NEEDING_PROJECT_MAP.has(command)) {
        userContext += readProjectMap(workspaceRoot, stackId);
    }
    if (command === 'constitution' || command === 'plan' || command === 'tasks') {
        userContext += readProjectStackInfo(workspaceRoot, stackId);
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
