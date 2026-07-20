import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getDocPath, resolveOutputAndContextFiles } from './engine/prompt-context';
import { resolveStoryDocPath, getActiveStorySlug } from './utils';
import { getSessionsRootDir, runPhaseTurn } from './session-orchestrator';
import { listSessions, loadSession } from './engine/session-store';

/** Fases exibidas na Overview com status calculado a partir do arquivo real que cada uma
 *  produz — sem estado próprio a manter em sincronia (mesmo padrão que POPanelProvider já
 *  usa hoje para Discovery/PRD). 'specify' é tratado à parte por causa do placeholder
 *  "DESCREVA AQUI"; 'implement'/'qa-implement' não têm arquivo e não entram aqui. */
const OVERVIEW_PHASES = [
    'constitution', 'plan', 'tasks',
    'qa-test-plan', 'qa-test-cases', 'qa-automation', 'qa-coverage', 'qa-report',
    'po-discovery', 'po-prd', 'po-stories'
];

export class HubPanelProvider {
    private static _panel: vscode.WebviewPanel | undefined;
    private static readonly _viewType = 'foursys.hubPanel';

    static openOrReveal(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel): void {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : vscode.ViewColumn.One;

        if (HubPanelProvider._panel) {
            HubPanelProvider._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            HubPanelProvider._viewType,
            'Foursys Hub',
            column ?? vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'resources'))]
            }
        );

        panel.iconPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'logo.svg'));
        HubPanelProvider._panel = panel;
        panel.webview.html = HubPanelProvider._getHtml(panel.webview, context);

        let currentTokenSource: vscode.CancellationTokenSource | undefined;

        panel.webview.onDidReceiveMessage(async (data) => {
            switch (data.value) {
                case 'HubGetOverview':
                    HubPanelProvider._sendOverview(panel, context);
                    break;

                case 'HubListSessions':
                    HubPanelProvider._sendSessionsList(panel, data.storySlug);
                    break;

                case 'HubOpenSession': {
                    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
                    if (!rootPath) { return; }
                    const session = loadSession(getSessionsRootDir(rootPath), data.sessionId);
                    panel.webview.postMessage({ value: 'HubSessionOpened', session });
                    break;
                }

                case 'HubSendMessage': {
                    currentTokenSource?.cancel();
                    currentTokenSource = new vscode.CancellationTokenSource();
                    const token = currentTokenSource.token;
                    // Só sabemos o sessionId de verdade depois do primeiro evento de passo
                    // (sessão nova ainda não existe até runPhaseTurn criá-la) — os chunks de
                    // texto streamados chegam depois desse ponto, então capturar aqui basta.
                    let resolvedSessionId = data.sessionId as string | undefined;
                    try {
                        const result = await runPhaseTurn({
                            context, outputChannel, token,
                            sessionId: data.sessionId,
                            command: data.phase,
                            userMessage: data.message ?? '',
                            onStep: (evt) => {
                                resolvedSessionId = evt.sessionId;
                                panel.webview.postMessage({ value: 'HubTurnStep', ...evt });
                            },
                            onChunk: (chunk) => panel.webview.postMessage({ value: 'HubTurnChunk', sessionId: resolvedSessionId, chunk })
                        });
                        if (result.cancelled) {
                            panel.webview.postMessage({ value: 'HubTurnError', sessionId: result.session.id, message: 'Cancelado — arquivo existente preservado.' });
                        } else {
                            panel.webview.postMessage({ value: 'HubTurnComplete', sessionId: result.session.id, session: result.session });
                        }
                        HubPanelProvider._sendOverview(panel, context);
                    } catch (error: any) {
                        panel.webview.postMessage({ value: 'HubTurnError', sessionId: resolvedSessionId ?? '', message: error.message || String(error) });
                    }
                    break;
                }

                case 'HubListChanges': {
                    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
                    if (!rootPath) { return; }
                    const session = loadSession(getSessionsRootDir(rootPath), data.sessionId);
                    const files = (session?.outputFiles ?? []).map(rel => {
                        const full = path.join(rootPath, rel);
                        const exists = fs.existsSync(full);
                        return {
                            path: rel,
                            exists,
                            sizeBytes: exists ? fs.statSync(full).size : 0,
                            mtime: exists ? fs.statSync(full).mtimeMs : 0
                        };
                    });
                    panel.webview.postMessage({ value: 'HubChangesList', sessionId: data.sessionId, files });
                    break;
                }
            }
        }, undefined, context.subscriptions);

        panel.onDidDispose(() => {
            HubPanelProvider._panel = undefined;
            currentTokenSource?.cancel();
        }, null, context.subscriptions);
    }

    private static _sendSessionsList(panel: vscode.WebviewPanel, storySlug?: string): void {
        const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!rootPath) { panel.webview.postMessage({ value: 'HubSessionsList', sessions: [] }); return; }
        const sessions = listSessions(getSessionsRootDir(rootPath), storySlug ? { storySlug } : undefined);
        panel.webview.postMessage({ value: 'HubSessionsList', sessions });
    }

    private static _sendOverview(panel: vscode.WebviewPanel, context: vscode.ExtensionContext): void {
        const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!rootPath) { panel.webview.postMessage({ value: 'HubOverviewStatus', phases: {} }); return; }

        const docPath = getDocPath(rootPath);
        const storyDocPath = resolveStoryDocPath(rootPath, context);
        const activeStorySlug = getActiveStorySlug(context);
        const resourcesPath = path.join(context.extensionPath, 'resources');

        const phases: Record<string, boolean> = {};

        const userStoryPath = path.join(storyDocPath, 'user_story.md');
        const storyContent = fs.existsSync(userStoryPath) ? fs.readFileSync(userStoryPath, 'utf8') : '';
        phases['specify'] = storyContent.trim().length > 0 && !storyContent.includes('DESCREVA AQUI');

        for (const command of OVERVIEW_PHASES) {
            const { outputPath } = resolveOutputAndContextFiles(command, docPath, storyDocPath, resourcesPath);
            phases[command] = !!outputPath && fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0;
        }

        panel.webview.postMessage({ value: 'HubOverviewStatus', phases, activeStorySlug });
    }

    private static _getHtml(webview: vscode.Webview, context: vscode.ExtensionContext): string {
        const nonce = getNonce();
        const logoUri = webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, 'resources', 'logo.svg'))
        ).toString();
        const cspSource = webview.cspSource;

        const htmlPath = path.join(context.extensionPath, 'resources', 'hub-panel.html');
        let html = fs.readFileSync(htmlPath, 'utf-8');
        html = html.replace(/\{\{NONCE\}\}/g, nonce);
        html = html.replace(/\{\{LOGO_URI\}\}/g, logoUri);
        html = html.replace(/\{\{CSP_SOURCE\}\}/g, cspSource);
        html = html.replace(/\{\{VERSION\}\}/g, context.extension.packageJSON.version);
        return html;
    }
}

function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }
    return text;
}
