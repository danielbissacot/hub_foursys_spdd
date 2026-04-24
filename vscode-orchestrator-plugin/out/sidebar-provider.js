"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubSidebarProvider = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
class HubSidebarProvider {
    _extensionUri;
    static viewType = 'hub-sidebar-view';
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const rootPath = workspaceFolders ? workspaceFolders[0].uri.fsPath : "";
        const isConnected = fs.existsSync(path.join(rootPath, "agentes_foursys"));
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview, isConnected);
        // Captura as mensagens vindas da Webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            if (!rootPath) {
                return;
            }
            switch (data.value) {
                case 'Connect': {
                    this._connectToHub(rootPath, webviewView);
                    break;
                }
                case 'Fase 0':
                case 'Fase 1':
                case 'Fase 2':
                case 'Fase 3':
                case 'Fase 4':
                case 'Fase 5': {
                    // Dispara a execução da pipeline real
                    vscode.commands.executeCommand('hub.runPipeline');
                    break;
                }
                case 'Spring':
                    this._openFile(rootPath, "catalog/agents_skills/spring_boot/AGENTE_SPRING_FOURSYS.md");
                    break;
                case 'Angular':
                    this._openFile(rootPath, "catalog/agents_skills/angular/AGENTE_ANGULAR_FOURSYS.md");
                    break;
                case 'Cobol':
                    this._openFile(rootPath, "catalog/agents_skills/cobol/AGENTE_COBOL_FOURSYS.md");
                    break;
                case 'Business':
                    this._openFile(rootPath, "catalog/agents_skills/business/AGENTE_NEGOCIO_FOURSYS.md");
                    break;
            }
        });
    }
    async _openFile(rootPath, filePath) {
        const pathsToTry = [
            path.join(rootPath, filePath),
            path.join(rootPath, "agentes_foursys", filePath)
        ];
        for (const fullPath of pathsToTry) {
            if (fs.existsSync(fullPath)) {
                const doc = await vscode.workspace.openTextDocument(fullPath);
                await vscode.window.showTextDocument(doc, { preview: false });
                return;
            }
        }
        vscode.window.showErrorMessage(`Arquivo não encontrado: ${filePath}`);
    }
    _connectToHub(rootPath, webviewView) {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Conectando ao AI Governance Hub...",
            cancellable: false
        }, async (progress) => {
            return new Promise((resolve, reject) => {
                const cmd = `git clone --branch hub-ia-arquitetura --depth 1 https://github.com/danielbissacot/ai-governance-hub.git agentes_foursys`;
                (0, child_process_1.exec)(cmd, { cwd: rootPath }, (error, stdout, stderr) => {
                    if (error) {
                        vscode.window.showErrorMessage(`Erro ao conectar: ${error.message}`);
                        reject(error);
                    }
                    else {
                        vscode.window.showInformationMessage("Hub Foursys conectado com sucesso! 🎉");
                        // Atualiza a UI para mostrar que está conectado
                        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview, true);
                        resolve(stdout);
                    }
                });
            });
        });
    }
    _getHtmlForWebview(webview, isConnected) {
        const statusBadge = isConnected
            ? '<span style="color: #4CAF50;">● Hub Ativo</span>'
            : '<span style="color: #f44336;">○ Desconectado</span>';
        const connectButton = isConnected
            ? ''
            : `<button class="btn-connect" onclick="sendAction('Connect')">⚡ CONECTAR AO HUB FOURSYS</button>`;
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 15px; color: var(--vscode-foreground); background-color: var(--vscode-sideBar-background); }
                    .header { border-bottom: 1px solid var(--vscode-panel-border); padding-bottom: 10px; margin-bottom: 20px; }
                    .status { font-size: 10px; margin-top: 5px; opacity: 0.8; font-weight: bold; text-transform: uppercase; }
                    .btn { 
                        background-color: var(--vscode-button-background); 
                        color: var(--vscode-button-foreground); 
                        border: none; padding: 10px 12px; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 8px; text-align: left;
                        font-size: 11px; transition: all 0.2s;
                        display: flex; align-items: center;
                    }
                    .btn:hover { filter: brightness(1.2); transform: translateX(4px); }
                    .btn-connect {
                        background-color: #e65100; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer; 
                        width: 100%; font-weight: bold; margin-bottom: 20px; font-size: 11px;
                    }
                    .btn-connect:hover { background-color: #ef6c00; }
                    h2 { font-size: 10px; text-transform: uppercase; margin-bottom: 12px; opacity: 0.6; letter-spacing: 1.5px; margin-top: 24px; font-weight: 800; }
                    .disabled { opacity: 0.3; pointer-events: none; filter: grayscale(1); }
                    .fase-icon { margin-right: 8px; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h3 style="margin:0; font-size: 16px;">🧠 Hub IA Foursys</h3>
                    <div class="status">${statusBadge}</div>
                </div>
                
                ${connectButton}

                <div class="${isConnected ? '' : 'disabled'}">
                    <h2>🚀 Ciclo de Vida (SDDE)</h2>
                    <button class="btn" onclick="sendAction('Fase 0')"><span class="fase-icon">🔍</span> Fase 0: Descoberta</button>
                    <button class="btn" onclick="sendAction('Fase 1')"><span class="fase-icon">📋</span> Fase 1: Refinamento</button>
                    <button class="btn" onclick="sendAction('Fase 2')"><span class="fase-icon">🏗️</span> Fase 2: Desenho Técnico</button>
                    <button class="btn" onclick="sendAction('Fase 3')"><span class="fase-icon">🛡️</span> Fase 3: Qualidade</button>
                    <button class="btn" onclick="sendAction('Fase 4')"><span class="fase-icon">📦</span> Fase 4: Entrega</button>
                    <button class="btn" onclick="sendAction('Fase 5')"><span class="fase-icon">♻️</span> Fase 5: Modernização</button>
                    
                    <h2>🛡️ Agentes Especialistas</h2>
                    <button class="btn" onclick="sendAction('Spring')">🍃 Agente Spring Boot</button>
                    <button class="btn" onclick="sendAction('Angular')">🅰️ Agente Angular</button>
                    <button class="btn" onclick="sendAction('Cobol')">🟦 Agente Reversa COBOL</button>
                    <button class="btn" onclick="sendAction('Business')">💼 Agente Business/PO</button>
                </div>

                <script>
                    const vscode = acquireVsCodeApi();
                    function sendAction(value) {
                        vscode.postMessage({ type: 'onAction', value: value });
                    }
                </script>
            </body>
            </html>`;
    }
}
exports.HubSidebarProvider = HubSidebarProvider;
//# sourceMappingURL=sidebar-provider.js.map