import * as fs from 'fs';
import * as path from 'path';
import { getStackConfig } from './stack-registry';
import { loadPlaybookForStack } from './catalog-loader';

export const DOC_FOLDER = 'doc_projeto';
export const WORKSPACE_CONTEXT_MAX_FILES = 2;   // era 5 — reduz tokens de workspace em 60%
export const WORKSPACE_CONTEXT_MAX_LINES = 80;  // era 300 — snippet curto de imports + assinaturas
export const CONTEXT_FILE_MAX_LINES = 200;      // era 800 — cabeçalho do doc é suficiente
export const PHASES_NEEDING_WORKSPACE = new Set([
    'plan', 'qa-test-plan', 'qa-automation'  // removido qa-test-cases (não precisa de código)
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
            contextFiles = [
                path.join(docPath, 'constitution.md'),
                path.join(storyDocPath, 'user_story.md'),
                path.join(storyDocPath, 'implementation_plan.md'),
                path.join(storyDocPath, 'technical_spec.md'),
            ];
            break;
        case 'qa-test-cases':
            outputPath = path.join(storyDocPath, 'qa', 'casos_teste.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(storyDocPath, 'qa', 'plano_testes.md')];
            break;
        case 'qa-automation':
            outputPath = path.join(storyDocPath, 'qa', 'roteiros_teste.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(storyDocPath, 'qa', 'casos_teste.md')];
            break;
        case 'qa-coverage':
            outputPath = path.join(storyDocPath, 'qa', 'review_cobertura.md');
            contextFiles = [
                path.join(docPath, 'constitution.md'),
                path.join(storyDocPath, 'qa', 'roteiros_teste.md'),
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

const PHASE_TYPE: Record<string, 'light' | 'mini' | 'implement' | 'standard'> = {
    constitution:    'light',
    specify:         'mini',
    plan:            'light',
    tasks:           'light',
    implement:       'implement',
    'qa-automation': 'implement',
};

/** Categoria de custo/tamanho de contexto usada por AIClient.sendPrompt para escolher o
 *  modelo da fase (ver PHASE_MODELS em ai-client.ts). Compartilhado entre executeSDDPhase
 *  (fluxo de um tiro) e o orquestrador de sessões, para os dois nunca divergirem. */
export function getPhaseType(command: string): 'light' | 'mini' | 'implement' | 'standard' {
    return PHASE_TYPE[command] ?? 'standard';
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
    /** Subpasta real da história ativa (ex: doc_projeto/us-014). Quando omitido, mantém o
     *  comportamento antigo (storyDocPath = docPath) — usado hoje pelo cli.ts do IntelliJ,
     *  que ainda não tem gestão de história por subpasta. A extensão VS Code deve passar
     *  o valor de resolveStoryDocPath() (utils.ts) para respeitar a história ativa. */
    storyDocPath?: string;
}): AssembledPrompt {
    const { command, stackId, workspaceRoot, builtinCatalogPath, externalCatalogPath, resourcesPath } = params;
    const userInstruction = params.userInstruction ?? '';

    const stackConfig = getStackConfig(stackId);
    const docPath = getDocPath(workspaceRoot);
    const storyDocPath = params.storyDocPath ?? docPath;

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
    if (PHASES_NEEDING_WORKSPACE.has(command)) {
        userContext += readWorkspaceContext(workspaceRoot, stackId);
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

/** Extrai um único bloco ```html``` de uma resposta Markdown (usado por qa-report/qa-coverage
 *  para separar o relatório HTML executivo do corpo Markdown). Mesmo padrão de parsing em
 *  máquina de estados usado na extração de blocos ```gherkin``` do comando foursys.qaExportXray. */
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
