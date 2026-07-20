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
