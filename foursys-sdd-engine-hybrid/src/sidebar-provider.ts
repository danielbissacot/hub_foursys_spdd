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
            // Limpa estado "instalando" se Mend não está presente (desinstalado ou falhou)
            if (!mendInstalled) { this._context.workspaceState.update('mendInstalling', false); }
            const mendInstalling = !!this._context.workspaceState.get('mendInstalling');
            const storyHasContent = this._checkStoryHasContent(workspaceRoot);
            const qaScriptsReady = this._checkQaScriptsReady(workspaceRoot);
            webviewView.webview.html = this._getHtmlForWebview(isConnected, detection, mendInstalled, mendInstalling, storyHasContent, qaScriptsReady);
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
                case 'QaTestPlan':
                    vscode.commands.executeCommand('foursys.qaTestPlan');
                    break;
                case 'QaTestCases':
                    vscode.commands.executeCommand('foursys.qaTestCases');
                    break;
                case 'QaAutomation':
                    vscode.commands.executeCommand('foursys.qaAutomation');
                    break;
                case 'QaCoverage':
                    vscode.commands.executeCommand('foursys.qaCoverage');
                    break;
                case 'QaReport':
                    vscode.commands.executeCommand('foursys.qaReport');
                    break;
                case 'QaImplement':
                    vscode.commands.executeCommand('foursys.qaImplement');
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

    private _checkQaScriptsReady(workspaceRoot: string): boolean {
        if (!workspaceRoot) { return false; }
        return fs.existsSync(path.join(workspaceRoot, 'doc_projeto', 'qa', 'scripts_automacao.md'));
    }

    private _checkStoryHasContent(workspaceRoot: string): boolean {
        if (!workspaceRoot) { return false; }
        const storyPath = path.join(workspaceRoot, 'doc_projeto', 'user_story.md');
        if (!fs.existsSync(storyPath)) { return false; }
        const content = fs.readFileSync(storyPath, 'utf8');
        return content.trim().length > 50 && !content.includes('DESCREVA AQUI');
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
                    ? 'git fetch origin main && git reset --hard origin/main'
                    : 'git clone --filter=blob:none --no-checkout --depth 1 --branch main https://github.com/danielbissacot/hub_foursys_spdd.git agentes_foursys && cd agentes_foursys && git sparse-checkout init --cone && git sparse-checkout set catalog && git checkout main';

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

            const getMdFiles = (dir: string): string[] => {
                let result: string[] = [];
                for (const f of fs.readdirSync(dir)) {
                    const full = path.join(dir, f);
                    if (fs.statSync(full).isDirectory()) { result = result.concat(getMdFiles(full)); }
                    else if (f.endsWith('.md')) { result.push(full); }
                }
                return result;
            };

            const activeSkillsPath = path.join(catalogPath, config.skillsFolder);
            if (fs.existsSync(activeSkillsPath)) {
                for (const fullPath of getMdFiles(activeSkillsPath)) {
                    const skillName = path.basename(fullPath, '.md').toLowerCase().replace(/[^a-z0-9-]/g, '-');
                    fs.copyFileSync(fullPath, path.join(skillsDir, `${skillName}.md`));
                }
            }

            // 2b. Skills compartilhadas (agnósticas de stack: playwright, tdd, verificacao, code-review)
            const sharedSkillsPath = path.join(catalogPath, 'agents_skills', 'shared', 'skills');
            if (fs.existsSync(sharedSkillsPath)) {
                for (const fullPath of getMdFiles(sharedSkillsPath)) {
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

    private _getHtmlForWebview(isConnected: boolean, detection: StackDetectionResult, mendInstalled: boolean, mendInstalling: boolean = false, storyHasContent: boolean = false, qaScriptsReady: boolean = false) {
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

        .tabs {
            display: flex;
            gap: 4px;
            margin-bottom: 12px;
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 8px;
        }
        .tab-btn {
            flex: 1;
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--vscode-panel-border);
            color: var(--vscode-foreground);
            border-radius: 4px;
            padding: 6px 4px;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
            opacity: 0.6;
            transition: all 0.2s;
        }
        .tab-btn.active {
            background: var(--foursys-orange);
            border-color: var(--foursys-orange);
            color: white;
            opacity: 1;
        }
        .tab-btn:hover:not(.active) { opacity: 0.9; background: rgba(255,107,0,0.15); }

        .tab-content { display: none; }
        .tab-content.active { display: block; }

        .section-label {
            font-size: 9px;
            opacity: 0.5;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

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
        .btn-ready { border-left: 3px solid var(--foursys-orange); background: rgba(255,107,0,0.08); }
        .btn-implement-tests { background: rgba(76,175,80,0.15); border: 1px solid rgba(76,175,80,0.4); color: var(--vscode-foreground); }
        .disabled { opacity: 0.4; pointer-events: none; filter: grayscale(1); }
        .step-number {
            background: rgba(255,255,255,0.15);
            border-radius: 4px;
            width: 18px; height: 18px;
            display: inline-flex;
            align-items: center; justify-content: center;
            margin-right: 10px;
            font-weight: bold; font-size: 10px;
            flex-shrink: 0;
        }
        .step-label { display: flex; flex-direction: column; }
        .step-title { font-size: 12px; font-weight: bold; }
        .step-sub { font-size: 9px; opacity: 0.6; margin-top: 1px; }

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
        <span class="version">v1.0.0 HYBRID (multi-stack) — protótipo</span>
    </div>

    <div class="stack-badge">
        <div class="stack-info">
            <span class="stack-name">${stackName}</span>
            ${stackSource ? `<span class="stack-source">destacado: ${stackSource}</span>` : ''}
        </div>
        <button class="btn-trocar" onclick="sendAction('SelectStack')">Trocar Stack</button>
    </div>

    <div class="tabs">
        <button class="tab-btn active" data-tab="dev" onclick="switchTab('dev')">Dev</button>
        <button class="tab-btn" data-tab="qa" onclick="switchTab('qa')">QA Auto</button>
    </div>

    <!-- TAB DEV -->
    <div id="tab-dev" class="tab-content active">
        <div class="section-label">Workflow SDD</div>
        <div class="${isConnected ? '' : 'disabled'}">
            <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('Constitution')">
                <span class="step-number">0</span>
                <span class="step-label"><span class="step-title">🏛️ Constitution</span><span class="step-sub">Governança & padrões</span></span>
            </button>
            <button class="btn ${stackUnknown ? 'btn-alert' : storyHasContent ? 'btn-ready' : ''}" onclick="sendAction('Specify')">
                <span class="step-number">1</span>
                <span class="step-label">
                    <span class="step-title">${storyHasContent ? '🔍 Specify (analisar)' : '📝 Specify (criar)'}</span>
                    <span class="step-sub">${storyHasContent ? 'Story pronta — clique para analisar' : 'Criar User Story'}</span>
                </span>
            </button>
            <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('Plan')">
                <span class="step-number">2</span>
                <span class="step-label"><span class="step-title">📐 Plan (Técnico)</span><span class="step-sub">Especificação técnica</span></span>
            </button>
            <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('Tasks')">
                <span class="step-number">3</span>
                <span class="step-label"><span class="step-title">📋 Tasks (Checklist)</span><span class="step-sub">Decomposição em tarefas</span></span>
            </button>
            <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('Implement')">
                <span class="step-number">4</span>
                <span class="step-label"><span class="step-title">🚀 Implement (Copilot)</span><span class="step-sub">Codificação assistida</span></span>
            </button>
        </div>
    </div>

    <!-- TAB QA AUTO -->
    <div id="tab-qa" class="tab-content">
        <div class="section-label">Workflow SDD</div>
        <div class="${isConnected ? '' : 'disabled'}">
            <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('QaTestPlan')">
                <span class="step-number">1</span>
                <span class="step-label"><span class="step-title">📝 Plano de Testes</span><span class="step-sub">Estratégia de testes</span></span>
            </button>
            <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('QaTestCases')">
                <span class="step-number">2</span>
                <span class="step-label"><span class="step-title">📄 Casos de Teste</span><span class="step-sub">Cenários BDD / Gherkin</span></span>
            </button>
            <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('QaAutomation')">
                <span class="step-number">3</span>
                <span class="step-label"><span class="step-title">🤖 Scripts de Automação</span><span class="step-sub">Gerar código de teste</span></span>
            </button>
            <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('QaCoverage')">
                <span class="step-number">4</span>
                <span class="step-label"><span class="step-title">🔍 Review de Cobertura</span><span class="step-sub">Análise de cobertura</span></span>
            </button>
            <button class="btn ${stackUnknown ? 'btn-alert' : ''}" onclick="sendAction('QaReport')">
                <span class="step-number">5</span>
                <span class="step-label"><span class="step-title">📊 Relatório de Qualidade</span><span class="step-sub">Report final de qualidade</span></span>
            </button>
        </div>
        <button class="btn btn-implement-tests ${qaScriptsReady ? '' : 'disabled'}" onclick="sendAction('QaImplement')" style="margin-top:8px;">
            <span class="step-number">▶</span>
            <span class="step-label">
                <span class="step-title">🚀 Implementar Testes</span>
                <span class="step-sub">${qaScriptsReady ? 'Extrair e criar arquivos de teste' : 'Aguardando Scripts de Automação'}</span>
            </span>
        </button>
    </div>

    <div class="mend-section">
        <div class="mend-label">🔒 Segurança</div>
        ${mendInstalled
            ? `<div class="mend-status">🟢 Mend Advise: ativo</div>
               <button class="btn-mend" onclick="sendAction('RunMend')">🔍 Rodar Análise</button>`
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
        function switchTab(tab) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.querySelector('[data-tab="' + tab + '"]').classList.add('active');
            document.getElementById('tab-' + tab).classList.add('active');
        }
    </script>
</body>
</html>`;
    }
}
