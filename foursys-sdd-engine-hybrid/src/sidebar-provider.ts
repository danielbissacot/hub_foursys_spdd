import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { resolveStack, getStackConfig, getAllStacks, StackDetectionResult } from './stack-registry';

const MEND_EXT_ID = 'mend.mend-advise';

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

        const updateWebview = () => {
            const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
            const isConnected = this._checkConnection(workspaceRoot);
            const detection = this._detectStack(workspaceRoot);
            const mendInstalled = !!vscode.extensions.getExtension(MEND_EXT_ID);
            const mendInstalling = !!this._context.workspaceState.get('mendInstalling');
            webviewView.webview.html = this._getHtmlForWebview(isConnected, detection, mendInstalled, mendInstalling);
        };

        updateWebview();

        webviewView.webview.onDidReceiveMessage(async data => {
            switch (data.value) {
                case 'Sync':
                    await this._syncHub(webviewView);
                    updateWebview();
                    break;
                case 'SelectStack':
                    await this._openStackPicker();
                    updateWebview();
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
                case 'InstallMend':
                    await this._installMend();
                    updateWebview();
                    break;
                case 'ReloadWindow':
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                    break;
                case 'RunMend':
                    vscode.commands.executeCommand('foursys.runMend');
                    break;
            }
        });
    }

    private async _installMend(): Promise<void> {
        await this._context.workspaceState.update('mendInstalling', true);
        try {
            await vscode.commands.executeCommand(
                'workbench.extensions.installExtension',
                MEND_EXT_ID
            );
            const choice = await vscode.window.showInformationMessage(
                '✅ Mend Advise instalado! Recarregue a janela para ativar.',
                'Recarregar Agora',
                'Copiar Chave de Licença'
            );
            if (choice === 'Recarregar Agora') {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            } else if (choice === 'Copiar Chave de Licença') {
                await vscode.env.clipboard.writeText('ef149a32-1038-40b2-9917-436a1266ed17');
                vscode.window.showInformationMessage('🔑 Chave copiada! Cole no wizard de ativação do Mend.');
            }
        } catch {
            await this._context.workspaceState.update('mendInstalling', false);
            const choice = await vscode.window.showWarningMessage(
                '⚠️ Não foi possível instalar o Mend Advise automaticamente. Instale manualmente pela marketplace.',
                'Abrir no Marketplace'
            );
            if (choice === 'Abrir no Marketplace') {
                vscode.commands.executeCommand('workbench.extensions.search', 'mend.mend-advise');
            }
        }
    }

    private _detectStack(workspaceRoot: string): StackDetectionResult {
        const savedStack = this._context.workspaceState.get<string>('activeStack');
        const docPath = workspaceRoot ? path.join(workspaceRoot, 'doc_projeto') : undefined;
        const userStoryPath = docPath ? path.join(docPath, 'user_story.md') : undefined;
        return resolveStack(workspaceRoot || undefined, userStoryPath, savedStack);
    }

    private async _openStackPicker() {
        const stacks = getAllStacks();
        const items = stacks.map(s => ({ label: s.displayName, description: s.id, stackId: s.id }));
        const picked = await vscode.window.showQuickPick(items, {
            placeHolder: 'Selecione a Stack do Projeto',
            title: 'Foursys SDD Hybrid — Stack Ativa'
        });
        if (picked) {
            await this._context.workspaceState.update('activeStack', picked.stackId);
            vscode.window.showInformationMessage(`✅ Stack ativa: ${picked.label}`);
        }
    }

    private _checkConnection(workspaceRoot: string): boolean {
        if (!workspaceRoot) { return false; }
        return fs.existsSync(path.join(workspaceRoot, 'agentes_foursys', 'catalog'))
            || fs.existsSync(path.join(workspaceRoot, 'catalog'));
    }

    private async _syncHub(webviewView: vscode.WebviewView) {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceRoot) {
            vscode.window.showErrorMessage('Abra uma pasta para sincronizar o Hub.');
            return;
        }

        const agentsPath = path.join(workspaceRoot, 'agentes_foursys');
        const exists = fs.existsSync(agentsPath);

        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: exists ? 'Atualizando Agentes do Hub...' : 'Baixando Agentes do Hub...',
            cancellable: false
        }, async () => {
            return new Promise<void>((resolve) => {
                const cmd = exists
                    ? 'git fetch origin hub-ia-arquitetura && git reset --hard origin/hub-ia-arquitetura'
                    : 'git clone --branch hub-ia-arquitetura --depth 1 https://github.com/danielbissacot/ai-governance-hub.git agentes_foursys';

                exec(cmd, { cwd: exists ? agentsPath : workspaceRoot }, (error) => {
                    if (error) {
                        vscode.window.showErrorMessage(`Erro na sincronização: ${error.message}`);
                        resolve();
                    } else {
                        const catalogPath = path.join(workspaceRoot, 'agentes_foursys', 'catalog');
                        this._context.globalState.update('catalogPath', catalogPath);
                        const detection = this._detectStack(workspaceRoot);
                        const stackId = detection.stackId === 'unknown' ? 'generic' : detection.stackId;
                        this._injectCopilotCustomizations(workspaceRoot, catalogPath, stackId);
                        vscode.window.showInformationMessage(
                            exists ? 'Agentes atualizados! (Copilot Skills Injetadas)' : 'Hub conectado com sucesso! (Copilot Skills Injetadas)'
                        );
                        resolve();
                    }
                });
            });
        });
    }

    private _injectCopilotCustomizations(workspaceRoot: string, catalogPath: string, stackId: string) {
        try {
            const config = getStackConfig(stackId);
            const githubDir = path.join(workspaceRoot, '.github');
            if (!fs.existsSync(githubDir)) { fs.mkdirSync(githubDir, { recursive: true }); }

            // 1. Inject copilot-instructions.md com a constitution da stack ativa
            const builtinConstitution = path.join(
                this._context.extensionUri.fsPath, 'catalog', 'sdd', config.playbookFolder, 'foursys-constitution.md'
            );
            const fallbackConstitution = path.join(
                this._context.extensionUri.fsPath, 'catalog', 'sdd', 'generic', 'foursys-constitution.md'
            );
            const constitutionSrc = fs.existsSync(builtinConstitution) ? builtinConstitution : fallbackConstitution;
            if (fs.existsSync(constitutionSrc)) {
                fs.copyFileSync(constitutionSrc, path.join(githubDir, 'copilot-instructions.md'));
            }

            // 2. Inject apenas as skills da stack ativa — isola o contexto do Copilot
            const skillsDir = path.join(githubDir, 'skills');
            if (!fs.existsSync(skillsDir)) { fs.mkdirSync(skillsDir, { recursive: true }); }
            // Limpa skills anteriores de outras stacks
            for (const f of fs.readdirSync(skillsDir)) { fs.rmSync(path.join(skillsDir, f)); }

            const activeSkillsPath = path.join(catalogPath, config.skillsFolder);
            if (fs.existsSync(activeSkillsPath)) {
                const getFiles = (dir: string): string[] => {
                    let result: string[] = [];
                    for (const f of fs.readdirSync(dir)) {
                        const full = path.join(dir, f);
                        if (fs.statSync(full).isDirectory()) { result = result.concat(getFiles(full)); }
                        else if (f.endsWith('.md')) { result.push(full); }
                    }
                    return result;
                };
                for (const fullPath of getFiles(activeSkillsPath)) {
                    const skillName = path.basename(fullPath, '.md').toLowerCase().replace(/[^a-z0-9-]/g, '-');
                    fs.copyFileSync(fullPath, path.join(skillsDir, `${skillName}.md`));
                }
            }

            // 3. Design systems (agnóstico de stack)
            const dsPath = path.join(catalogPath, 'design-systems');
            if (fs.existsSync(dsPath)) {
                for (const file of fs.readdirSync(dsPath)) {
                    if (file.endsWith('.md')) {
                        const skillName = path.basename(file, '.md').toLowerCase().replace(/[^a-z0-9-]/g, '-');
                        fs.copyFileSync(path.join(dsPath, file), path.join(skillsDir, `${skillName}.md`));
                    }
                }
            }
        } catch (e) {
            console.error('Erro ao injetar customizações do Copilot:', e);
        }
    }

    private _getHtmlForWebview(isConnected: boolean, detection: StackDetectionResult, mendInstalled: boolean, mendInstalling: boolean = false) {
        const stackId = detection.stackId === 'unknown' ? null : detection.stackId;
        const config = stackId ? getStackConfig(stackId) : null;
        const stackName = config ? config.displayName : 'Não detectada';
        const stackSource = stackId ? detection.source : '';
        const stackUnknown = !stackId;

        const stackBadgeStyle = stackUnknown
            ? 'background: #f44336;'
            : 'background: rgba(255,107,0,0.2); border: 1px solid rgba(255,107,0,0.5);';

        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <style>
        :root { --foursys-orange: #ff6b00; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 15px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-sideBar-background);
            line-height: 1.4;
        }
        .header {
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 12px;
            margin-bottom: 12px;
        }
        .title { font-size: 14px; font-weight: bold; color: var(--foursys-orange); margin: 0; }
        .version { font-size: 9px; opacity: 0.5; margin-top: 2px; }

        .stack-badge {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 10px;
            border-radius: 4px;
            margin-bottom: 12px;
            font-size: 11px;
            ${stackBadgeStyle}
        }
        .stack-info { display: flex; flex-direction: column; }
        .stack-name { font-weight: bold; font-size: 12px; }
        .stack-source { font-size: 9px; opacity: 0.7; }
        .btn-trocar {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: var(--vscode-foreground);
            border-radius: 3px;
            padding: 4px 8px;
            font-size: 10px;
            cursor: pointer;
            white-space: nowrap;
        }
        .btn-trocar:hover { background: rgba(255,255,255,0.2); }

        .btn {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 12px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            margin-bottom: 8px;
            text-align: left;
            font-size: 12px;
            display: flex;
            align-items: center;
            transition: all 0.2s ease;
        }
        .btn:hover { background-color: var(--vscode-button-hoverBackground); transform: translateX(2px); }
        .btn-sync {
            background-color: var(--foursys-orange);
            color: white;
            font-weight: bold;
            justify-content: center;
            margin-top: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .btn-alert { background-color: #f44336 !important; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.7; } }
        .disabled { opacity: 0.4; pointer-events: none; filter: grayscale(1); }
        .step-number {
            background: rgba(255,255,255,0.15);
            border-radius: 4px;
            width: 18px; height: 18px;
            display: inline-flex;
            align-items: center; justify-content: center;
            margin-right: 12px;
            font-weight: bold; font-size: 10px;
        }
        .mend-section {
            margin-top: 12px;
            padding: 10px;
            background: rgba(0,0,0,0.15);
            border-radius: 4px;
            border: 1px solid var(--vscode-panel-border);
        }
        .mend-label { font-size: 9px; opacity: 0.6; text-transform: uppercase; margin-bottom: 5px; }
        .mend-status { font-size: 11px; margin-bottom: 6px; }
        .btn-mend {
            background: ${mendInstalled ? '#1a6b1a' : mendInstalling ? '#7a6000' : 'rgba(255,107,0,0.8)'};
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            font-size: 11px;
            font-weight: bold;
            text-align: center;
            transition: opacity 0.2s;
        }
        .btn-mend:hover { opacity: 0.85; }
        .status-bar {
            margin-top: 20px; padding: 10px;
            background: rgba(0,0,0,0.2);
            border-radius: 4px; font-size: 10px;
            display: flex; align-items: center; gap: 8px;
        }
        .status-dot {
            width: 8px; height: 8px; border-radius: 50%;
            background: ${isConnected ? '#4caf50' : '#f44336'};
            box-shadow: 0 0 5px ${isConnected ? '#4caf50' : '#f44336'};
        }
    </style>
</head>
<body>
    <div class="header">
        <h3 class="title">🚀 Foursys SDD Hybrid</h3>
        <span class="version">v1.0.0 HYBRID (multi-stack)</span>
    </div>

    <div class="stack-badge">
        <div class="stack-info">
            <span class="stack-name">Stack: ${stackName}</span>
            ${stackSource ? `<span class="stack-source">${stackSource}</span>` : ''}
        </div>
        <button class="btn-trocar" onclick="sendAction('SelectStack')">Trocar Stack</button>
    </div>

    <div class="${isConnected ? '' : 'disabled'}">
        <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('Constitution')">
            <span class="step-number">0</span> 🏛️ Constitution
        </button>
        <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('Specify')">
            <span class="step-number">1</span> 📝 Specify (Story)
        </button>
        <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('Plan')">
            <span class="step-number">2</span> 📐 Plan (Técnico)
        </button>
        <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('Tasks')">
            <span class="step-number">3</span> 📋 Tasks (Checklist)
        </button>
        <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('Implement')">
            <span class="step-number">4</span> 🚀 Implement (Copilot)
        </button>
    </div>

    <div class="mend-section">
        <div class="mend-label">🔒 Segurança</div>
        ${mendInstalled
            ? `<div class="mend-status">🟢 Mend Advise: ativo</div>
               <button class="btn-mend" onclick="sendAction('RunMend')">🔍 Ver CVEs (Problems)</button>`
            : mendInstalling
            ? `<div class="mend-status">🟡 Mend instalando — recarregue a janela</div>
               <button class="btn-mend" onclick="sendAction('ReloadWindow')">🔄 Recarregar Janela</button>`
            : `<div class="mend-status">🔴 Mend Advise: não instalado</div>
               <button class="btn-mend" onclick="sendAction('InstallMend')">📦 Instalar Mend Advise</button>`
        }
    </div>

    <button class="btn btn-sync" onclick="sendAction('Sync')">
        ${isConnected ? '🔄 ATUALIZAR SKILLS' : '📥 CONECTAR AO HUB'}
    </button>

    <div class="status-bar">
        <div class="status-dot"></div>
        <span>Status: ${isConnected ? 'Hub Conectado' : 'Hub Desconectado'}</span>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        function sendAction(value) { vscode.postMessage({ value: value }); }
    </script>
</body>
</html>`;
    }
}
