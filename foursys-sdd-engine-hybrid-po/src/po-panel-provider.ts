import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const DISCOVERY_TEMPLATE = `# Discovery — [Nome do Projeto / Epic]

> Preencha as seções abaixo e salve (Ctrl+S) para enviar ao PO Agent

## Demanda / Oportunidade de Negócio
<!-- Qual o problema ou oportunidade que originou este Epic? -->

## Personas Impactadas
<!-- Quem são os usuários ou áreas afetadas? -->

## Cenário Atual (AS-IS)
<!-- Como o processo funciona hoje? -->

## Cenário Desejado (TO-BE)
<!-- Como deveria funcionar após a solução? -->

## Restrições e Premissas
<!-- Regulatório, prazo, integrações obrigatórias, sistemas intocáveis -->

## Critérios de Sucesso
<!-- Como mediremos que funcionou? (ex: redução de X%, eliminação de Y etapas) -->

## Referências e Documentos de Apoio
<!-- Links, documentos, briefings, e-mails relevantes -->
`;

export class POPanelProvider {
    private static _panel: vscode.WebviewPanel | undefined;
    private static readonly _viewType = 'foursys.poPanel';

    static openOrReveal(context: vscode.ExtensionContext): void {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : vscode.ViewColumn.One;

        if (POPanelProvider._panel) {
            POPanelProvider._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            POPanelProvider._viewType,
            'Product Owner Agent',
            column ?? vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, 'resources'))
                ]
            }
        );

        panel.iconPath = vscode.Uri.file(
            path.join(context.extensionPath, 'resources', 'logo.svg')
        );

        POPanelProvider._panel = panel;
        panel.webview.html = POPanelProvider._getHtml(panel.webview, context);

        // Mesmo padrao da sidebar: switch em data.value
        panel.webview.onDidReceiveMessage(
            async (data) => {
                switch (data.value) {
                    case 'PODiscovery':
                    case 'POSelecionarDoc':
                        await POPanelProvider._abrirTemplateDiscovery(panel);
                        break;
                    case 'PORefinarPRD':
                        POPanelProvider._openChat(panel, data, 'po-prd');
                        break;
                    case 'POUserStories':
                        POPanelProvider._openChat(panel, data, 'po-stories');
                        break;
                    case 'POSkill':
                        vscode.commands.executeCommand('workbench.action.chat.open', {
                            query: '@foursys_sdd_po /skill ' + (data.skill ?? '')
                        });
                        break;
                    case 'PODispararFluxo':
                        POPanelProvider._openChat(panel, data, 'po-discovery');
                        break;
                    case 'PODefinirContexto':
                        vscode.window.showInformationMessage(
                            'PO Contexto: ' + (data.epic ?? '-') + ' | ' + (data.cc ?? '-') + ' | ' + (data.proj ?? '-')
                        );
                        break;
                }
            },
            undefined,
            context.subscriptions
        );

        panel.onDidDispose(() => {
            POPanelProvider._panel = undefined;
        }, null, context.subscriptions);
    }

    static async _abrirTemplateDiscovery(panel?: vscode.WebviewPanel): Promise<void> {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders || folders.length === 0) {
            vscode.window.showWarningMessage(
                'Abra uma pasta no VS Code primeiro (File → Open Folder) para criar o arquivo de Discovery.'
            );
            return;
        }
        const docFolder = path.join(folders[0].uri.fsPath, 'doc_projeto');
        if (!fs.existsSync(docFolder)) {
            fs.mkdirSync(docFolder, { recursive: true });
        }
        const draftPath = path.join(docFolder, 'discovery-draft.md');
        if (!fs.existsSync(draftPath)) {
            fs.writeFileSync(draftPath, DISCOVERY_TEMPLATE, 'utf-8');
        }
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(draftPath));
        await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
        vscode.window.showInformationMessage(
            '📝 Preencha o template de Discovery e salve (Ctrl+S) para enviar ao PO Agent.'
        );
        if (panel) {
            panel.webview.postMessage({ value: 'FaseIniciada', phase: 'discovery' });
        }
    }

    private static _openChat(
        panel: vscode.WebviewPanel,
        data: Record<string, string>,
        cmd: string
    ): void {
        const ctx = 'Epic: ' + (data.epic ?? '') + ' | CC: ' + (data.cc ?? '') + ' | Projeto: ' + (data.proj ?? '');
        vscode.commands.executeCommand('workbench.action.chat.open', {
            query: '@foursys_sdd_po /' + cmd + ' ' + ctx
        });
        panel.webview.postMessage({ value: 'FaseIniciada', phase: cmd });
    }

    private static _getHtml(webview: vscode.Webview, context: vscode.ExtensionContext): string {
        const nonce = getNonce();
        const logoUri = webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, 'resources', 'logo.svg'))
        ).toString();
        const cspSource = webview.cspSource;

        const htmlPath = path.join(context.extensionPath, 'resources', 'po-panel.html');
        let html = fs.readFileSync(htmlPath, 'utf-8');
        html = html.replace(/\{\{NONCE\}\}/g, nonce);
        html = html.replace(/\{\{LOGO_URI\}\}/g, logoUri);
        html = html.replace(/\{\{CSP_SOURCE\}\}/g, cspSource);
        return html;
    }
}


function getNonce(): string {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}