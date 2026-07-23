import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as vscode from 'vscode';

export function getMcpConfigPath(): string {
    if (process.platform === 'win32') {
        return path.join(process.env['APPDATA'] || path.join(os.homedir(), 'AppData', 'Roaming'), 'Code', 'User', 'mcp.json');
    }
    if (process.platform === 'darwin') {
        return path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User', 'mcp.json');
    }
    return path.join(os.homedir(), '.config', 'Code', 'User', 'mcp.json');
}

export function checkFigmaMcpConfigured(): boolean {
    try {
        const p = getMcpConfigPath();
        if (!fs.existsSync(p)) { return false; }
        const cfg = JSON.parse(fs.readFileSync(p, 'utf-8'));
        return !!cfg?.servers?.figmaRemoteMcp;
    } catch { return false; }
}

export async function pickAndReadDocumentFile(
    openLabel: string
): Promise<{ filePath: string; fileName: string; fileContent: string } | undefined> {
    const uris = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        openLabel,
        filters: {
            'Documentos': ['md', 'txt', 'docx', 'pdf', 'xlsx', 'csv', 'json'],
            'Todos os arquivos': ['*']
        }
    });
    if (!uris || uris.length === 0) { return undefined; }
    const filePath = uris[0].fsPath;
    const fileName = path.basename(filePath);
    const textExts = ['.md', '.txt', '.csv', '.json', '.yaml', '.yml'];
    let fileContent = '';
    if (textExts.includes(path.extname(filePath).toLowerCase())) {
        try { fileContent = fs.readFileSync(filePath, 'utf-8'); } catch { /* silencioso */ }
    }
    return { filePath, fileName, fileContent };
}

const ACTIVE_STORY_SLUG_KEY = 'activeStorySlug';
const DOC_FOLDER = 'doc_projeto';
const LEGACY_SUBFOLDERS = new Set(['qa', 'screens']);

const DIACRITICS_REGEX = new RegExp('[̀-ͯ]', 'g');

export function slugifyStoryName(name: string): string {
    const slug = name
        .normalize('NFD').replace(DIACRITICS_REGEX, '')
        .toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-+|-+$)/g, '');
    return slug || 'historia';
}

export function getActiveStorySlug(context: vscode.ExtensionContext): string | undefined {
    return context.workspaceState.get<string>(ACTIVE_STORY_SLUG_KEY);
}

export async function setActiveStorySlug(context: vscode.ExtensionContext, slug: string | undefined): Promise<void> {
    await context.workspaceState.update(ACTIVE_STORY_SLUG_KEY, slug);
}

export function listStoryFolders(rootPath: string): string[] {
    const docFolder = path.join(rootPath, DOC_FOLDER);
    if (!fs.existsSync(docFolder)) { return []; }
    return fs.readdirSync(docFolder, { withFileTypes: true })
        .filter(e => e.isDirectory() && !LEGACY_SUBFOLDERS.has(e.name))
        .map(e => e.name)
        .sort();
}

/** Caminho de arquivos ligados à história ativa. Sem slug definido ainda, cai em doc_projeto/
 *  direto — mesmo comportamento de sempre, preserva projetos que nunca adotaram subpastas. */
export function resolveStoryDocPath(rootPath: string, context: vscode.ExtensionContext): string {
    const slug = getActiveStorySlug(context);
    const docPath = slug ? path.join(rootPath, DOC_FOLDER, slug) : path.join(rootPath, DOC_FOLDER);
    if (!fs.existsSync(docPath)) { fs.mkdirSync(docPath, { recursive: true }); }
    return docPath;
}

/** Chamado nos pontos onde uma história nova começa (Specify em branco, importação do PO Agent,
 *  texto colado, seleção de arquivo). Define e retorna a subpasta da nova história ativa. */
export async function ensureNewStorySlug(
    rootPath: string,
    context: vscode.ExtensionContext,
    suggestedName?: string
): Promise<string> {
    let slug: string;
    if (suggestedName && suggestedName.trim()) {
        slug = slugifyStoryName(suggestedName);
    } else {
        const name = await vscode.window.showInputBox({
            title: 'Nome da História',
            prompt: 'Nome curto para esta história (vira o nome da subpasta em doc_projeto/)',
            placeHolder: 'ex: login, checkout, US-001'
        });
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 12);
        slug = name && name.trim() ? slugifyStoryName(name) : `historia-${timestamp}`;
    }
    await setActiveStorySlug(context, slug);
    const docPath = path.join(rootPath, DOC_FOLDER, slug);
    if (!fs.existsSync(docPath)) { fs.mkdirSync(docPath, { recursive: true }); }
    return docPath;
}

export interface UserStoryBlock {
    id: string;
    titulo: string;
    conteudo: string;
}

// Divide o user_stories.md (plural, gerado pelo /po-stories) em blocos individuais
// "## US-XXX: Titulo", parando antes da secao final "## Resumo do Backlog".
export function parseUserStoryBlocks(raw: string): UserStoryBlock[] {
    const lines = raw.split('\n');
    const headingRegex = /^##\s+(US-\d+):\s*(.*)$/;
    const stopRegex = /^##\s+Resumo do Backlog/i;
    const blocks: UserStoryBlock[] = [];
    let current: { id: string; titulo: string; startLine: number } | null = null;

    const flush = (endLine: number) => {
        if (current) {
            blocks.push({
                id: current.id,
                titulo: current.titulo,
                conteudo: lines.slice(current.startLine, endLine).join('\n').trim()
            });
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const headingMatch = line.match(headingRegex);
        if (headingMatch) {
            flush(i);
            current = { id: headingMatch[1], titulo: headingMatch[2].trim(), startLine: i };
            continue;
        }
        if (stopRegex.test(line)) {
            flush(i);
            current = null;
        }
    }
    flush(lines.length);
    return blocks;
}

/** Le doc_projeto/user_stories.md (se existir) e retorna os blocos ainda NAO individualizados
 *  (sem subpasta propria em doc_projeto/<ID>/) — usado pelo "Trocar Historia" pra oferecer as
 *  historias geradas pelo PO Agent que ainda nao viraram uma pasta de trabalho. */
export function listPendingPoStories(rootPath: string, existingFolders: string[]): UserStoryBlock[] {
    const userStoriesPath = path.join(rootPath, DOC_FOLDER, 'user_stories.md');
    if (!fs.existsSync(userStoriesPath)) { return []; }
    const raw = fs.readFileSync(userStoriesPath, 'utf8');
    if (raw.trim() === '') { return []; }
    return parseUserStoryBlocks(raw).filter(b => !existingFolders.includes(b.id));
}

/** Importa uma historia do PO Agent (bloco de user_stories.md) pra sua propria subpasta em
 *  doc_projeto/<ID>/user_story.md, pedindo confirmacao se ja houver conteudo real la.
 *  Retorna o caminho da subpasta, ou undefined se o usuario cancelar a sobrescrita. */
export async function importPoStory(
    rootPath: string,
    context: vscode.ExtensionContext,
    story: UserStoryBlock
): Promise<string | undefined> {
    const targetDocPath = await ensureNewStorySlug(rootPath, context, story.id);
    const outputPath = path.join(targetDocPath, 'user_story.md');
    if (fs.existsSync(outputPath)) {
        const existing = fs.readFileSync(outputPath, 'utf8').trim();
        if (existing.length > 100 && !existing.includes('DESCREVA AQUI')) {
            const confirm = await vscode.window.showWarningMessage(
                `⚠️ "user_story.md" já tem conteúdo.\nSobrescrever com "${story.id}"?`,
                { modal: true },
                'Sobrescrever',
                'Cancelar'
            );
            if (confirm !== 'Sobrescrever') { return undefined; }
        }
    }
    const importedContent = `> Origem: user_stories.md (PO Agent) — ${story.id}\n\n${story.conteudo}`;
    fs.writeFileSync(outputPath, importedContent);
    return targetDocPath;
}

/** Cria uma historia em branco (template padrao) numa subpasta de doc_projeto/, pedindo o nome
 *  ali mesmo (via ensureNewStorySlug) se ainda nao houver historia ativa — ou reaproveitando a
 *  pasta ja ativa. Usado pelo botao "Nova historia" e pelo Specify quando comeca do zero. */
export async function createBlankUserStory(
    rootPath: string,
    context: vscode.ExtensionContext,
    stackDisplayName: string
): Promise<string> {
    const targetDocPath = getActiveStorySlug(context)
        ? resolveStoryDocPath(rootPath, context)
        : await ensureNewStorySlug(rootPath, context);
    const outputPath = path.join(targetDocPath, 'user_story.md');
    const template = `# User Story\n\n**TECNOLOGIA:** ${stackDisplayName}\n\n## Necessidade de Negócio\nDESCREVA AQUI o que você precisa (quem/quer/para).\n\n## Regras de Negócio\n- Regra 1...\n\n## Critérios de Aceite\n- Dado... quando... então...`;
    fs.writeFileSync(outputPath, template);

    const techSpecPath = path.join(targetDocPath, 'technical_spec.md');
    if (!fs.existsSync(techSpecPath)) {
        const techTemplate = `# Technical Specification (opcional)\n\nCole aqui o detalhamento técnico: classes, endpoints, contratos de API,\nexemplos de código, yml, estrutura de pacotes, análise de impacto.\n\nEste arquivo é lido pela fase Plan. Mantenha apenas a história de negócio em user_story.md.\n`;
        fs.writeFileSync(techSpecPath, techTemplate);
    }
    return targetDocPath;
}
