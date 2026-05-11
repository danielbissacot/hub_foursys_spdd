import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

export class FoursysSDDSidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'foursys-sdd-sidebar-view';

    constructor(private readonly _context: vscode.ExtensionContext) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._context.extensionUri]
        };

        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        const isConnected = this._checkConnection(workspaceRoot);

        webviewView.webview.html = this._getHtmlForWebview(isConnected);

        webviewView.webview.onDidReceiveMessage(async data => {
            switch (data.value) {
                case 'Connect':
                    this._connectToHub(webviewView);
                    break;
                case 'Constitution':
                    vscode.commands.executeCommand('foursys.constitution');
                    break;
                case 'Specify':
                    vscode.commands.executeCommand('foursys.specify');
                    break;
                case 'Plan':
                    vscode.commands.executeCommand('foursys.plan');
                    break;
                case 'Tasks':
                    vscode.commands.executeCommand('foursys.tasks');
                    break;
                case 'Implement':
                    vscode.commands.executeCommand('foursys.implement');
                    break;
            }
        });
    }

    private _checkConnection(workspaceRoot: string): boolean {
        if (!workspaceRoot) return false;
        if (fs.existsSync(path.join(workspaceRoot, 'agentes_foursys', 'catalog'))) return true;
        if (fs.existsSync(path.join(workspaceRoot, 'catalog'))) return true;
        return false;
    }

    private _connectToHub(webviewView: vscode.WebviewView) {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceRoot) return;

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Conectando ao Foursys SDD Hub...",
            cancellable: false
        }, async () => {
            return new Promise<void>((resolve, reject) => {
                const cmd = `git clone --branch hub-ia-arquitetura --depth 1 https://github.com/danielbissacot/ai-governance-hub.git agentes_foursys`;
                exec(cmd, { cwd: workspaceRoot }, (error) => {
                    if (error) {
                        vscode.window.showErrorMessage(`Erro ao conectar: ${error.message}`);
                        reject(error);
                    } else {
                        const catalogPath = path.join(workspaceRoot, 'agentes_foursys', 'catalog');
                        this._context.globalState.update('catalogPath', catalogPath);
                        vscode.window.showInformationMessage("Foursys SDD Hub conectado!");
                        webviewView.webview.html = this._getHtmlForWebview(true);
                        resolve();
                    }
                });
            });
        });
    }

    private _getHtmlForWebview(isConnected: boolean) {
        return `<!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: sans-serif; padding: 15px; color: var(--vscode-foreground); background-color: var(--vscode-sideBar-background); }
                    .header { border-bottom: 1px solid var(--vscode-panel-border); padding-bottom: 10px; margin-bottom: 20px; }
                    .btn { background-color: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 10px; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 8px; text-align: left; font-size: 11px; display: flex; align-items: center; }
                    .btn:hover { filter: brightness(1.2); }
                    .btn-connect { background-color: #0046ad; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer; width: 100%; font-weight: bold; margin-bottom: 20px; }
                    .disabled { opacity: 0.3; pointer-events: none; }
                    .step-number { background: rgba(255,255,255,0.2); border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h3 style="margin:0;">🚀 Foursys SDD Engine</h3>
                    <div style="font-size: 9px; opacity: 0.6; margin-top: 4px;">v0.1.0 PREVIEW</div>
                </div>
                ${isConnected ? '' : '<button class="btn-connect" onclick="sendAction(\'Connect\')">CONECTAR AO HUB</button>'}
                <div class="${isConnected ? '' : 'disabled'}">
                    <button class="btn" onclick="sendAction('Constitution')"><span class="step-number">0</span> 🏛️ Constitution</button>
                    <button class="btn" onclick="sendAction('Specify')"><span class="step-number">1</span> 📝 Specify (Story)</button>
                    <button class="btn" onclick="sendAction('Plan')"><span class="step-number">2</span> 📐 Plan (Técnico)</button>
                    <button class="btn" onclick="sendAction('Tasks')"><span class="step-number">3</span> 📋 Tasks (Checklist)</button>
                    <button class="btn" onclick="sendAction('Implement')"><span class="step-number">4</span> 🚀 Implement (Motor)</button>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    function sendAction(value) { vscode.postMessage({ value: value }); }
                </script>
            </body>
            </html>`;
    }
}
