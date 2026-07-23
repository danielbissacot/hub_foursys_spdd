import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { AIClient } from './ai-client';
import { loadPlaybookForStack, findCatalogPath, detectTechnology, resolveSkillMdFile } from './engine/catalog-loader';
import { FoursysSDDSidebarProvider } from './sidebar-provider';
import { POPanelProvider } from './po-panel-provider';
import { getStackConfig, getAllStacks, resolveStack } from './engine/stack-registry';
import {
    CONTEXT_FILE_MAX_LINES,
    PHASES_NEEDING_WORKSPACE,
    resolveOutputAndContextFiles,
    getDocPath,
    readWorkspaceContext,
    readProjectStackInfo,
    extractHtmlBlock
} from './engine/prompt-context';
import {
    getMcpConfigPath, checkFigmaMcpConfigured, resolveStoryDocPath, ensureNewStorySlug, getActiveStorySlug,
    parseUserStoryBlocks, importPoStory, createBlankUserStory
} from './utils';
import { trackEvent, optOutTelemetry, setTelemetryEmail } from './telemetry';
import { MEND_EXTENSION_ID, MEND_LICENSE_SECRET, MEND_API_TOKEN } from './mend-config';

async function ensureMendAdvise(
    context: vscode.ExtensionContext,
    outputChannel: vscode.OutputChannel
): Promise<void> {
    // Sem popup — instalação é via botão na sidebar
    if (!vscode.extensions.getExtension(MEND_EXTENSION_ID)) { return; }

    // Notifica o dev sobre a chave de licença apenas uma vez
    const notified = await context.secrets.get(MEND_LICENSE_SECRET);
    if (!notified) {
        await context.secrets.store(MEND_LICENSE_SECRET, MEND_API_TOKEN);
        outputChannel.appendLine('[Foursys] ✅ Mend Advise instalado.');
        outputChannel.appendLine('[Foursys] 📋 Para ativar: Ctrl+Shift+P → "mend: Activate Mend Advise"');
        outputChannel.appendLine(`[Foursys] 🔑 Chave de licença: ${MEND_API_TOKEN}`);
        const choice = await vscode.window.showInformationMessage(
            '✅ Mend Advise detectado! Execute "mend: Activate Mend Advise" no Command Palette para ativar.',
            'Copiar Chave de Licença'
        );
        if (choice === 'Copiar Chave de Licença') {
            await vscode.env.clipboard.writeText(MEND_API_TOKEN);
            vscode.window.showInformationMessage('🔑 Chave copiada! Cole no wizard de ativação do Mend.');
        }
    }
}

/** Monta a lista "a, b, c e d" dos arquivos que o Implement precisa ler: constitution.md fica em
 *  doc_projeto/ (nível de projeto), os demais na subpasta da história ativa (se houver uma). */
function buildImplementFileList(rootPath: string, context: vscode.ExtensionContext): string {
    const storyDocPath = resolveStoryDocPath(rootPath, context);
    const rel = (p: string) => path.relative(rootPath, p).replace(/\\/g, '/');
    const files = [
        rel(path.join(getDocPath(rootPath), 'constitution.md')),
        rel(path.join(storyDocPath, 'technical_spec.md')),
        rel(path.join(storyDocPath, 'implementation_plan.md')),
        rel(path.join(storyDocPath, 'task_list.md')),
    ];
    return `${files.slice(0, -1).join(', ')} e ${files[files.length - 1]}`;
}

async function openFile(filePath: string) {
    if (fs.existsSync(filePath)) {
        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc, { preview: false });
    }
}

function getActiveStackId(context: vscode.ExtensionContext): string {
    const rootPath = getWorkspaceRoot();
    const savedStack = context.workspaceState.get<string>('activeStack');
    const userStoryPath = rootPath ? path.join(resolveStoryDocPath(rootPath, context), 'user_story.md') : undefined;
    const result = resolveStack(rootPath ?? undefined, userStoryPath, savedStack);
    return result.stackId;
}

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('Foursys SDD Hybrid');
    outputChannel.appendLine(`[Foursys SDD Hybrid] Motor V${context.extension.packageJSON.version} Hybrid Online!`);

    // Garante Mend Advise instalado + licença configurada (fire-and-forget, não bloqueia activate)
    ensureMendAdvise(context, outputChannel).catch(e =>
        outputChannel.appendLine(`[Mend] Erro na configuração: ${e.message}`)
    );

    const agentes = vscode.chat.createChatParticipant('foursys_sdd_po', async (request, _chatContext, response, token) => {
        let referencesContext = '';
        for (const ref of request.references) {
            if (ref.value instanceof vscode.Uri) {
                try {
                    const doc = await vscode.workspace.openTextDocument(ref.value);
                    referencesContext += `\n--- REFERENCIA EXTERNA: ${path.basename(ref.value.fsPath)} ---\n${doc.getText()}\n`;
                } catch { /* ignorar */ }
            }
        }
        await executeSDDPhase(request.command || '', request.prompt, referencesContext, response, token, context, outputChannel);
    });

    agentes.iconPath = vscode.Uri.joinPath(context.extensionUri, 'resources', 'logo.png');
    context.subscriptions.push(agentes);

    const commandToken = () => new vscode.CancellationTokenSource().token;

    context.subscriptions.push(vscode.commands.registerCommand('foursys.constitution', () => executeSDDPhase('constitution', '', '', null, commandToken(), context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.specify',      () => executeSDDPhase('specify',      '', '', null, commandToken(), context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.plan',         () => executeSDDPhase('plan',         '', '', null, commandToken(), context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.tasks',        () => executeSDDPhase('tasks',        '', '', null, commandToken(), context, outputChannel)));

    context.subscriptions.push(vscode.commands.registerCommand('foursys.qaTestPlan',   () => executeSDDPhase('qa-test-plan',   '', '', null, commandToken(), context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.qaTestCases',  () => executeSDDPhase('qa-test-cases',  '', '', null, commandToken(), context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.qaAutomation', () => executeSDDPhase('qa-automation',  '', '', null, commandToken(), context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.qaImplement', async () => {
        const rootPath = getWorkspaceRoot();
        if (!rootPath) { return; }
        const stackId = getActiveStackId(context);
        const config = getStackConfig(stackId);
        const roteirosPath = path.relative(rootPath, path.join(resolveStoryDocPath(rootPath, context), 'qa', 'roteiros_teste.md')).replace(/\\/g, '/');
        vscode.commands.executeCommand('workbench.action.chat.open', {
            query: `Leia o arquivo ${roteirosPath} deste workspace. Crie cada arquivo de teste marcado com o comentário <!-- file: caminho --> exatamente no caminho indicado, criando diretórios quando necessário, com o conteúdo do bloco de código correspondente. Invoque a Skill: ${config.implementSkillTag}.`
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.qaCoverage',   () => executeSDDPhase('qa-coverage',   '', '', null, commandToken(), context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.qaReport',     () => executeSDDPhase('qa-report',     '', '', null, commandToken(), context, outputChannel)));

    context.subscriptions.push(vscode.commands.registerCommand('foursys.qaExportXray', async () => {
        const rootPath = getWorkspaceRoot();
        if (!rootPath) { return; }
        const casesPath = path.join(resolveStoryDocPath(rootPath, context), 'qa', 'casos_teste.md');
        if (!fs.existsSync(casesPath)) {
            vscode.window.showWarningMessage('⚠️ Execute "Casos de Teste" primeiro para gerar o arquivo BDD.');
            return;
        }

        const content = fs.readFileSync(casesPath, 'utf8');

        // Extrai todos os blocos gherkin
        const gherkinBlocks: string[] = [];
        const lines = content.split('\n');
        let inBlock = false;
        let blockLines: string[] = [];
        for (const line of lines) {
            if (!inBlock) {
                if (/^```gherkin/i.test(line)) { inBlock = true; blockLines = []; }
            } else {
                if (line.startsWith('```')) {
                    if (blockLines.length > 0) { gherkinBlocks.push(blockLines.join('\n')); }
                    inBlock = false;
                } else {
                    blockLines.push(line);
                }
            }
        }

        if (gherkinBlocks.length === 0) {
            vscode.window.showWarningMessage('⚠️ Nenhum bloco gherkin encontrado em casos_teste.md. Verifique se o arquivo contém blocos ```gherkin.');
            return;
        }

        // Avisa se encontrar keywords em português
        const ptKeywords = /^\s*(Dado|Quando|Então|E\s|Mas\s)/m;
        if (gherkinBlocks.some(b => ptKeywords.test(b))) {
            vscode.window.showWarningMessage('⚠️ Detectadas keywords em português (Dado/Quando/Então). O Xray requer Given/When/Then em inglês. Regere os Casos de Teste.');
            return;
        }

        const featureContent = gherkinBlocks.join('\n\n');

        // Verifica configurações Xray
        const cfg = vscode.workspace.getConfiguration('foursys');
        const jiraUrl = cfg.get<string>('xrayJiraUrl', '').trim();
        const projectKey = cfg.get<string>('xrayProjectKey', '').trim();
        const apiToken = await context.secrets.get('foursys.xrayApiToken');

        if (jiraUrl && projectKey && apiToken) {
            outputChannel.appendLine(`[Xray] Enviando ${gherkinBlocks.length} bloco(s) para ${jiraUrl} — projeto ${projectKey}...`);
            try {
                const https = require('https');
                const postData = Buffer.from(featureContent, 'utf8');
                const endpoint = new URL(`${jiraUrl}/rest/raven/1.0/import/feature?projectKey=${projectKey}`);
                const options = {
                    hostname: endpoint.hostname,
                    port: endpoint.port || 443,
                    path: endpoint.pathname + endpoint.search,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                        'Authorization': `Bearer ${apiToken}`,
                        'Content-Length': postData.length
                    }
                };
                const result = await new Promise<string>((resolve, reject) => {
                    const req = https.request(options, (res: any) => {
                        let data = '';
                        res.on('data', (chunk: any) => { data += chunk; });
                        res.on('end', () => resolve(data));
                    });
                    req.on('error', reject);
                    req.write(postData);
                    req.end();
                });
                outputChannel.appendLine(`[Xray] Resposta: ${result}`);
                vscode.window.showInformationMessage(`✅ Casos enviados para o Xray! Projeto: ${projectKey}`);
            } catch (error: any) {
                vscode.window.showErrorMessage(`❌ Erro ao enviar para o Xray: ${error.message}`);
                outputChannel.appendLine(`[Xray ERRO] ${error.message}`);
            }
        } else {
            // Exporta arquivo .feature localmente
            const exportPath = path.join(resolveStoryDocPath(rootPath, context), 'qa', 'xray_export.feature');
            const exportDir = path.dirname(exportPath);
            if (!fs.existsSync(exportDir)) { fs.mkdirSync(exportDir, { recursive: true }); }
            fs.writeFileSync(exportPath, featureContent);
            await openFile(exportPath);
            const hint = !jiraUrl
                ? 'Configure foursys.xrayJiraUrl e foursys.xrayProjectKey nas Settings para enviar direto ao Xray.'
                : !apiToken
                ? 'Configure o token com o comando "Foursys: Configurar Token Xray".'
                : '';
            vscode.window.showInformationMessage(`📤 Exportado: xray_export.feature. ${hint}`);
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('foursys.setXrayToken', async () => {
        const token = await vscode.window.showInputBox({
            title: 'Foursys — Token de API do Xray',
            prompt: 'Cole o Bearer token de API do Jira/Xray (será armazenado com segurança)',
            password: true,
            ignoreFocusOut: true
        });
        if (token && token.trim()) {
            await context.secrets.store('foursys.xrayApiToken', token.trim());
            vscode.window.showInformationMessage('✅ Token Xray salvo com segurança.');
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('foursys.implement', async () => {
        const stackId = getActiveStackId(context);
        const config = getStackConfig(stackId);
        const rootPath = getWorkspaceRoot();
        if (!rootPath) { return; }
        vscode.commands.executeCommand('workbench.action.chat.open', {
            query: `Leia os arquivos ${buildImplementFileList(rootPath, context)} deste workspace. Inicie a codificação estritamente de acordo com as tarefas listadas e invoque a Skill: ${config.implementSkillTag}.`
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('foursys.implementSession1', async () => {
        const rootPath = getWorkspaceRoot();
        if (!rootPath) { return; }
        vscode.commands.executeCommand('workbench.action.chat.open', {
            query: `Leia os arquivos ${buildImplementFileList(rootPath, context)} deste workspace. Execute APENAS as tarefas da "Sessão 1 de Implementação — Domínio" do task_list.md. Ignore completamente as tarefas da Sessão 2 e de Teste.`
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('foursys.implementSession2', async () => {
        const rootPath = getWorkspaceRoot();
        if (!rootPath) { return; }
        vscode.commands.executeCommand('workbench.action.chat.open', {
            query: `Leia os arquivos ${buildImplementFileList(rootPath, context)} deste workspace. Execute APENAS as tarefas da "Sessão 2 de Implementação — Infraestrutura" do task_list.md. Ignore completamente as tarefas da Sessão 1 e de Teste.`
        });
    }));

    // Mend Advise é passivo — escaneia automaticamente e exibe CVEs no painel Problems.
    // Abre o Problems panel como ação principal; tenta comandos de scan explícitos antes (versões futuras).
    context.subscriptions.push(vscode.commands.registerCommand('foursys.runMend', async () => {
        const scanCandidates = ['mend.scanWorkspace', 'mend.scan', 'mend.runScan'];
        for (const cmd of scanCandidates) {
            try {
                await vscode.commands.executeCommand(cmd);
                return;
            } catch { /* comando não existe nesta versão */ }
        }
        // Abre o painel Problems (Ctrl+Shift+M) onde o Mend exibe os CVEs automaticamente
        vscode.commands.executeCommand('workbench.panel.markers.view.focus').then(undefined, () => {
            vscode.commands.executeCommand('workbench.view.extension.mend-advise').then(undefined, () => {
                vscode.window.showInformationMessage(
                    '🔒 Mend Advise escaneia automaticamente. Abra o painel Problems (Ctrl+Shift+M) para ver os CVEs detectados.'
                );
            });
        });
    }));

    // Comando de troca manual de stack via QuickPick
    context.subscriptions.push(vscode.commands.registerCommand('foursys.selectStack', async () => {
        const stacks = getAllStacks();
        const items = stacks.map(s => ({ label: s.displayName, description: s.id, stackId: s.id }));
        const picked = await vscode.window.showQuickPick(items, {
            placeHolder: 'Selecione a Stack do Projeto',
            title: 'Foursys SDD Hybrid — Stack Ativa'
        });
        if (picked) {
            await context.workspaceState.update('activeStack', picked.stackId);
            vscode.window.showInformationMessage(`✅ Stack ativa: ${picked.label}`);
            vscode.commands.executeCommand('foursys-sdd-po-view.focus');
            await trackEvent(context, outputChannel, { event: 'stack_selected', stack: picked.stackId });
        }
    }));

    // Comando de seleção de Design System (usado pela sidebar Angular)
    context.subscriptions.push(vscode.commands.registerCommand('foursys.selectDesignSystem', async () => {
        const DS_OPTIONS = [
            { label: 'Bradesco Liquid (Foursys)', id: 'bradesco-liquid' },
            { label: 'Angular Material',          id: 'material'        },
            { label: 'PrimeNG',                   id: 'primeng'         },
            { label: 'Bootstrap',                 id: 'bootstrap'       },
            { label: 'Tailwind CSS',              id: 'tailwind'        },
            { label: 'Nenhum / Próprio',          id: 'none'            },
        ];
        const items = DS_OPTIONS.map(ds => ({ label: ds.label, description: ds.id, dsId: ds.id }));
        const picked = await vscode.window.showQuickPick(items, {
            placeHolder: 'Selecione o Design System do projeto Angular',
            title: 'Foursys SDD Hybrid — Design System Angular'
        });
        if (picked) {
            await context.workspaceState.update('activeDesignSystem', picked.dsId);
            vscode.window.showInformationMessage(`🎨 Design System: ${picked.label}`);
        }
    }));

    // Comando para adicionar/substituir mockup de tela em doc_projeto/screens/
    context.subscriptions.push(vscode.commands.registerCommand('foursys.addMockup', async () => {
        const rootPath = getWorkspaceRoot();
        if (!rootPath) { return; }
        const files = await vscode.window.showOpenDialog({
            canSelectMany: false,
            filters: { 'Imagens': ['png', 'jpg', 'jpeg', 'svg', 'webp'] },
            title: 'Selecione o mockup da tela'
        });
        if (!files || files.length === 0) { return; }
        const srcFile = files[0].fsPath;
        const ext = path.extname(srcFile);
        const screensDir = path.join(resolveStoryDocPath(rootPath, context), 'screens');
        if (!fs.existsSync(screensDir)) { fs.mkdirSync(screensDir, { recursive: true }); }
        const destFile = path.join(screensDir, `mockup${ext}`);
        fs.copyFileSync(srcFile, destFile);
        await openFile(destFile);
        vscode.window.showInformationMessage('📸 Mockup salvo! Arraste o arquivo para o Copilot Chat como referência visual.');
    }));

    // Configura o MCP do Figma automaticamente no mcp.json do VS Code (sem restart necessário)
    context.subscriptions.push(vscode.commands.registerCommand('foursys.setupFigmaMcp', async () => {
        const mcpPath = getMcpConfigPath();
        try {
            let cfg: Record<string, unknown> = { inputs: [], servers: {} };
            if (fs.existsSync(mcpPath)) {
                const raw = fs.readFileSync(mcpPath, 'utf-8').trim();
                if (raw.length > 0) {
                    try { cfg = JSON.parse(raw); } catch { /* arquivo corrompido — sobrescreve com config nova */ }
                }
            }
            if (!cfg.servers) { cfg.servers = {}; }
            (cfg.servers as Record<string, unknown>)['figmaRemoteMcp'] = {
                url: 'https://mcp.figma.com/mcp',
                type: 'http'
            };
            fs.mkdirSync(path.dirname(mcpPath), { recursive: true });
            fs.writeFileSync(mcpPath, JSON.stringify(cfg, null, 2), 'utf-8');
            await vscode.window.showTextDocument(vscode.Uri.file(mcpPath));
            vscode.window.showInformationMessage(
                '✅ MCP do Figma configurado! O VS Code vai detectar automaticamente e solicitar login no Figma em instantes.'
            );
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            vscode.window.showErrorMessage(`❌ Erro ao configurar MCP do Figma: ${msg}`);
        }
    }));

    // Abre Copilot Chat com prompt que usa o Figma MCP para analisar o design
    context.subscriptions.push(vscode.commands.registerCommand('foursys.importFromFigma', async () => {
        if (!checkFigmaMcpConfigured()) {
            vscode.window.showWarningMessage('MCP do Figma não configurado. Use o botão "⚙️ Figma MCP" na sidebar.');
            return;
        }
        const figmaUrl = await vscode.window.showInputBox({
            prompt: 'Cole a URL do frame ou arquivo do Figma',
            placeHolder: 'https://www.figma.com/design/...',
            validateInput: (v) => (v && v.includes('figma.com')) ? null : 'URL inválida: deve ser do figma.com'
        });
        if (!figmaUrl) { return; }

        const rootPath = getWorkspaceRoot();
        let userStoryRelPath = 'doc_projeto/user_story.md';
        let figmaRefRelPath = 'doc_projeto/screens/figma_ref.txt';
        if (rootPath) {
            const storyDocPath = resolveStoryDocPath(rootPath, context);
            const screensDir = path.join(storyDocPath, 'screens');
            if (!fs.existsSync(screensDir)) { fs.mkdirSync(screensDir, { recursive: true }); }
            fs.writeFileSync(path.join(screensDir, 'figma_ref.txt'), figmaUrl, 'utf-8');
            userStoryRelPath = path.relative(rootPath, path.join(storyDocPath, 'user_story.md')).replace(/\\/g, '/');
            figmaRefRelPath = path.relative(rootPath, path.join(screensDir, 'figma_ref.txt')).replace(/\\/g, '/');
        }

        const prompt = `Use o servidor MCP do Figma para analisar o design em: ${figmaUrl}

Por favor:
1. Acesse o frame no Figma e descreva os elementos visuais, layout, cores e componentes de UI
2. Identifique componentes do Liquid Design System / Design System Bradesco utilizados
3. Liste os estados visíveis na tela (loading, vazio, erro, sucesso, validação)
4. Gere critérios de aceite visuais para Angular (Angular Material / PrimeNG)

Este design é o mockup da User Story em ${userStoryRelPath}`;

        await vscode.commands.executeCommand('workbench.action.chat.open', { query: prompt });
        vscode.window.showInformationMessage(`🎨 URL do Figma salva em ${figmaRefRelPath}`);
    }));

    const sidebarProvider = new FoursysSDDSidebarProvider(context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(FoursysSDDSidebarProvider.viewType, sidebarProvider));

    // Notifica o usuário quando salva user_story.md com conteúdo real
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(async (doc) => {
        const rootPath = getWorkspaceRoot();
        if (!rootPath) { return; }
        const storyPath = path.join(resolveStoryDocPath(rootPath, context), 'user_story.md');
        if (doc.uri.fsPath !== storyPath) { return; }
        const content = doc.getText();
        if (!content || content.includes('DESCREVA AQUI') || content.trim().length < 50) { return; }

        // Abre technical_spec.md ao lado para o dev preencher o detalhamento técnico
        const techSpecPath = path.join(path.dirname(storyPath), 'technical_spec.md');
        if (fs.existsSync(techSpecPath)) {
            const techDoc = await vscode.workspace.openTextDocument(techSpecPath);
            await vscode.window.showTextDocument(techDoc, { viewColumn: vscode.ViewColumn.Two, preview: false });
        }

        const choice = await vscode.window.showInformationMessage(
            '📝 História salva! Detalhamento técnico → technical_spec.md (aberto ao lado). Deseja analisar com o Foursys Specify agora?',
            'Sim, Analisar',
            'Depois'
        );
        if (choice === 'Sim, Analisar') {
            vscode.commands.executeCommand('foursys.specify');
        }
    }));

    // Notifica quando salva discovery-draft.md e oferece enviar ao PO Agent
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(async (doc) => {
        if (!doc.uri.fsPath.endsWith('discovery-draft.md')) { return; }
        const content = doc.getText();
        if (!content || content.trim().length < 100) { return; }
        const choice = await vscode.window.showInformationMessage(
            '📝 Discovery draft salvo! Enviar ao PO Agent para análise?',
            'Sim, enviar',
            'Depois'
        );
        if (choice !== 'Sim, enviar') { return; }
        const snippet = content.length > 3000 ? content.slice(0, 3000) + '\n\n[...conteúdo truncado...]' : content;
        vscode.commands.executeCommand('workbench.action.chat.open', {
            query: `@foursys_sdd_po /po-discovery Analise este contexto de Discovery e conduza as perguntas de refinamento:\n\n${snippet}`
        });
    }));

    // Comando: Abrir PO Panel (WebviewPanel central)
    context.subscriptions.push(vscode.commands.registerCommand('foursys.openPOPanel', () =>
        POPanelProvider.openOrReveal(context)
    ));

    // Comando: Iniciar Discovery (abre template .md no editor)
    context.subscriptions.push(vscode.commands.registerCommand('foursys.poDiscovery', () =>
        POPanelProvider._abrirTemplateDiscovery()
    ));

    // Telemetria de uso (opt-in, ver PRIVACY.md)
    context.subscriptions.push(vscode.commands.registerCommand('foursys.telemetry.optOut', () => optOutTelemetry(context)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.telemetry.setEmail', () => setTelemetryEmail(context)));
}

async function executeSDDPhase(
    command: string,
    userInstruction: string,
    referencesContext: string,
    chatResponse: vscode.ChatResponseStream | null,
    token: vscode.CancellationToken,
    context: vscode.ExtensionContext,
    outputChannel: vscode.OutputChannel
) {
    await trackEvent(context, outputChannel, {
        event: 'command_executed',
        command,
        stack: getActiveStackId(context)
    });

    // skill e playbook não precisam de workspace nem de stack
    if (command === 'skill' || command === 'playbook') {
        const globalStoragePath = context.globalStorageUri.fsPath;
        const slug = userInstruction.trim().toLowerCase().split(/\s+/)[0].replace(/\.md$/, '');
        if (command === 'skill') {
            const skillsDir = path.join(globalStoragePath, 'skills');
            const customSkillsDir = path.join(globalStoragePath, 'custom-skills');
            let filePath = '';
            if (slug) {
                for (const dir of [skillsDir, customSkillsDir]) {
                    const candidate = path.join(dir, `${slug}.md`);
                    if (fs.existsSync(candidate)) { filePath = candidate; break; }
                }
                // Fallback: busca pelo nome da subpasta (slug = nome do diretório), primeiro no hub
                // sincronizado e depois no catálogo já embutido no pacote (funciona offline, sem
                // precisar de "CONECTAR AO HUB"). Suporta layout flat (SKILL.md direto) e versionado
                // (<skill>/<versao>/SKILL.md) via resolveSkillMdFile.
                if (!filePath) {
                    const searchSkillDir = (dir: string): string => {
                        if (!fs.existsSync(dir)) { return ''; }
                        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
                            if (!e.isDirectory()) { continue; }
                            const full = path.join(dir, e.name);
                            if (e.name === slug) {
                                const md = resolveSkillMdFile(full);
                                if (md) { return md; }
                            }
                            const found = searchSkillDir(full);
                            if (found) { return found; }
                        }
                        return '';
                    };
                    const searchRoots = [
                        path.join(globalStoragePath, 'hub', 'catalog', 'agents_skills'),
                        path.join(context.extensionUri.fsPath, 'catalog', 'agents_skills')
                    ];
                    for (const root of searchRoots) {
                        filePath = searchSkillDir(root);
                        if (filePath) { break; }
                    }
                }
            }
            if (!filePath) {
                const allFiles: { label: string; description: string; filepath: string }[] = [];
                if (fs.existsSync(skillsDir)) {
                    for (const f of fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'))) {
                        allFiles.push({ label: `📄 ${f}`, description: 'Hub Skill', filepath: path.join(skillsDir, f) });
                    }
                }
                if (fs.existsSync(customSkillsDir)) {
                    for (const f of fs.readdirSync(customSkillsDir).filter(f => f.endsWith('.md'))) {
                        allFiles.push({ label: `✏️ ${f}`, description: 'Custom Skill', filepath: path.join(customSkillsDir, f) });
                    }
                }
                if (allFiles.length === 0) {
                    chatResponse?.markdown('⚠️ Nenhuma skill encontrada. Execute **Sincronizar** na sidebar primeiro.');
                    return;
                }
                const picked = await vscode.window.showQuickPick(allFiles, {
                    title: 'Foursys SDD — Skills Disponíveis',
                    placeHolder: 'Selecione uma skill para carregar'
                });
                if (!picked) { return; }
                filePath = picked.filepath;
            }
            const skillName = path.basename(filePath, '.md');
            const skillContent = fs.readFileSync(filePath, 'utf8');
            chatResponse?.markdown(`📄 **Skill:** \`${skillName}\` — aplicando instruções...\n\n`);
            const skillExtra = userInstruction.replace(slug, '').trim();
            const skillResult = await AIClient.sendPrompt(
                skillContent,
                skillExtra || 'Com base nesta skill, apresente brevemente o que você pode fazer e aguarde a próxima instrução do desenvolvedor.',
                outputChannel, token,
                (chunk) => { if (chatResponse) { chatResponse.markdown(chunk); } },
                'standard'
            );
            await trackEvent(context, outputChannel, {
                event: 'skill_completed',
                command: skillName,
                stack: getActiveStackId(context),
                tokens: skillResult.totalTokens,
                credits: skillResult.credits ?? 0
            });
        } else {
            const playbookRoot = path.join(globalStoragePath, 'hub', 'catalog', 'playbook');
            if (!fs.existsSync(playbookRoot)) {
                chatResponse?.markdown('⚠️ Playbooks não encontrados. Execute **CONECTAR AO HUB** na sidebar primeiro.');
                return;
            }
            let filePath = '';
            if (slug) {
                const findBySlug = (dir: string): string => {
                    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                        const full = path.join(dir, entry.name);
                        if (entry.isDirectory()) { const found = findBySlug(full); if (found) { return found; } }
                        else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
                            const relPath = path.relative(playbookRoot, full).replace(/\\/g, '/').replace(/\.md$/i, '').toLowerCase();
                            if (relPath === slug || path.basename(entry.name, '.md').toLowerCase() === slug) { return full; }
                        }
                    }
                    return '';
                };
                filePath = findBySlug(playbookRoot);
            }
            if (!filePath) {
                const pbFiles: { label: string; description: string; filepath: string }[] = [];
                const collectMd = (dir: string, fase: string) => {
                    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                        const full = path.join(dir, entry.name);
                        if (entry.isDirectory()) { collectMd(full, fase); }
                        else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
                            pbFiles.push({ label: `📋 ${path.basename(entry.name, '.md')}`, description: fase, filepath: full });
                        }
                    }
                };
                for (const entry of fs.readdirSync(playbookRoot, { withFileTypes: true })) {
                    if (entry.isDirectory() && entry.name.startsWith('fase')) {
                        collectMd(path.join(playbookRoot, entry.name), entry.name);
                    }
                }
                if (pbFiles.length === 0) {
                    chatResponse?.markdown('⚠️ Nenhum playbook encontrado.');
                    return;
                }
                const picked = await vscode.window.showQuickPick(pbFiles, {
                    title: 'Foursys SDD — Playbooks',
                    placeHolder: 'Selecione um playbook para carregar'
                });
                if (!picked) { return; }
                filePath = picked.filepath;
            }
            const pbName = path.basename(filePath, '.md');
            const pbContent = fs.readFileSync(filePath, 'utf8');
            chatResponse?.markdown(`📋 **PlayBook:** \`${pbName}\` — iniciando...\n\n`);
            const playbookResult = await AIClient.sendPrompt(
                pbContent,
                'Execute o fluxo de trabalho descrito neste playbook. Apresente os próximos passos de forma clara e objetiva.',
                outputChannel, token,
                (chunk) => { if (chatResponse) { chatResponse.markdown(chunk); } },
                'standard'
            );
            await trackEvent(context, outputChannel, {
                event: 'playbook_completed',
                command: pbName,
                stack: getActiveStackId(context),
                tokens: playbookResult.totalTokens,
                credits: playbookResult.credits ?? 0
            });
        }
        return;
    }

    const rootPath = getWorkspaceRoot();
    if (!rootPath) { return; }

    const savedStack = context.workspaceState.get<string>('activeStack');
    const docPath = getDocPath(rootPath);
    const storyDocPath = resolveStoryDocPath(rootPath, context);
    const userStoryPath = path.join(storyDocPath, 'user_story.md');
    const detection = resolveStack(rootPath, userStoryPath, savedStack);

    // Stack desconhecida: força seleção antes de prosseguir
    if (detection.stackId === 'unknown' && command !== 'specify') {
        const stacks = getAllStacks();
        const items = stacks.map(s => ({ label: s.displayName, description: s.id, stackId: s.id }));
        const picked = await vscode.window.showQuickPick(items, {
            placeHolder: 'Stack não detectada. Selecione para continuar.',
            title: 'Foursys SDD Hybrid — Selecione a Stack'
        });
        if (!picked) { return; }
        await context.workspaceState.update('activeStack', picked.stackId);
        detection.stackId = picked.stackId;
        detection.confidence = 'manual';
    }

    const stackId = detection.stackId;
    const stackConfig = getStackConfig(stackId);
    const builtinSDD = context.extensionUri.fsPath;
    const catalogPath = findCatalogPath(rootPath, context.globalState.get<string>('catalogPath') || '');
    const builtinCatalogPath = path.join(builtinSDD, 'catalog');

    outputChannel.show(true);
    outputChannel.appendLine(`\n[SDD] ▶ Fase: ${command} | Stack: ${stackConfig.displayName} (${detection.confidence})`);

    if (chatResponse) { chatResponse.markdown(`🔄 **Foursys SDD Hybrid**: Fase **${command.toUpperCase()}** | Stack: **${stackConfig.displayName}**\n\n`); }

    const resourcesPath = path.join(context.extensionUri.fsPath, 'resources');
    let { outputPath, contextFiles } = resolveOutputAndContextFiles(command, docPath, storyDocPath, resourcesPath);

    if (command === 'specify' && userInstruction.trim() === '') {
        // Se o PO Agent já gerou user_stories.md, oferece a opção de importar uma história
        // de lá em vez de editar o template manual. Só ativa quando o arquivo existe e tem
        // pelo menos um bloco "## US-XXX" reconhecível; caso contrário, cai no fluxo de sempre.
        const userStoriesPath = path.join(docPath, 'user_stories.md');
        if (fs.existsSync(userStoriesPath)) {
            const rawStories = fs.readFileSync(userStoriesPath, 'utf8');
            const storyBlocks = rawStories.trim() !== '' ? parseUserStoryBlocks(rawStories) : [];
            if (storyBlocks.length > 0) {
                const modo = await vscode.window.showQuickPick(
                    [
                        { label: '📋 Usar história gerada pelo PO Agent', value: 'po' },
                        { label: '✏️ Editar manualmente (fluxo atual)', value: 'manual' }
                    ],
                    { placeHolder: 'Como deseja especificar a história?' }
                );
                if (modo?.value === 'po') {
                    const picked = await vscode.window.showQuickPick(
                        storyBlocks.map(s => ({ label: `${s.id}: ${s.titulo}`, story: s })),
                        { placeHolder: 'Selecione a história (US) para especificar' }
                    );
                    if (picked) {
                        // Cada história do PO Agent vira sua própria subpasta em doc_projeto/,
                        // nomeada pelo ID da US (ex: doc_projeto/US-001/).
                        const targetDocPath = await importPoStory(rootPath, context, picked.story);
                        if (!targetDocPath) {
                            if (chatResponse) { chatResponse.markdown('⛔ Cancelado. `user_story.md` preservado.'); }
                            return;
                        }
                        outputPath = path.join(targetDocPath, 'user_story.md');
                        outputChannel.appendLine(`[SDD] 📋 ${picked.story.id} importada de user_stories.md para user_story.md.`);
                    }
                    // Se "picked" ficar undefined (Quick Pick cancelado), cai no fluxo padrão abaixo.
                }
                // Se escolher "manual" ou cancelar o primeiro Quick Pick, segue para o fluxo padrão abaixo.
            }
        }

        const content = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
        if (!content || content.trim() === '' || content.includes('DESCREVA AQUI')) {
            // Começando uma história do zero: se ainda não há história ativa, pede um nome curto
            // pra nomear a subpasta em doc_projeto/. Se já houver uma ativa, continua nela.
            const targetDocPath = await createBlankUserStory(rootPath, context, stackConfig.displayName);
            outputPath = path.join(targetDocPath, 'user_story.md');
            const techSpecPath = path.join(targetDocPath, 'technical_spec.md');
            const techSpecRelPath = path.relative(rootPath, techSpecPath).replace(/\\/g, '/');
            outputChannel.appendLine('[SDD] 📝 user_story.md criado. Preencha com a história de NEGÓCIO.');
            outputChannel.appendLine(`[SDD] 📋 Para detalhamento técnico, use ${techSpecRelPath} (já criado).`);
            await openFile(outputPath);
            if (chatResponse) { chatResponse.markdown(`📝 Por favor, descreva sua necessidade no arquivo \`user_story.md\` e rode o comando novamente.\n\n> 💡 Detalhamento técnico (classes, endpoints, yml)? Use \`${techSpecRelPath}\`.`); }
            return;
        }
    }

    if (command === 'specify' && userInstruction.trim() !== '') {
        const pastedContent = userInstruction.trim();
        // Texto colado sem uma história ativa ainda: pede um nome curto pra nomear a subpasta.
        if (!getActiveStorySlug(context)) {
            const targetDocPath = await ensureNewStorySlug(rootPath, context);
            outputPath = path.join(targetDocPath, 'user_story.md');
        }
        let shouldWrite = true;
        if (fs.existsSync(outputPath)) {
            const existing = fs.readFileSync(outputPath, 'utf8').trim();
            if (existing.length > 100 && !existing.includes('DESCREVA AQUI')) {
                const choice = await vscode.window.showWarningMessage(
                    `⚠️ "user_story.md" já tem conteúdo.\nSobrescrever com o texto colado no chat?`,
                    { modal: true },
                    'Sobrescrever',
                    'Cancelar'
                );
                if (choice !== 'Sobrescrever') {
                    if (chatResponse) { chatResponse.markdown('⛔ Cancelado. `user_story.md` preservado.'); }
                    return;
                }
            }
        }
        if (shouldWrite) {
            const outputDir = path.dirname(outputPath);
            if (!fs.existsSync(outputDir)) { fs.mkdirSync(outputDir, { recursive: true }); }
            fs.writeFileSync(outputPath, pastedContent);
            outputChannel.appendLine('[SDD] 📋 Texto colado salvo em user_story.md para análise.');
        }
        userInstruction = '';
    }

    if (chatResponse) { chatResponse.progress('Buscando Playbook e Regras do Hub...'); }

    try {
        const systemPromptRaw = loadPlaybookForStack(command, stackId, builtinCatalogPath, catalogPath);
        const systemPrompt = `STACK: ${stackConfig.displayName}\n\n${systemPromptRaw}`;

        let userContext = referencesContext;
        contextFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const raw = fs.readFileSync(file, 'utf8');
                const capped = raw.split('\n').slice(0, CONTEXT_FILE_MAX_LINES).join('\n');
                userContext += `\n## ${path.basename(file)}\n${capped}\n`;
            }
        });
        if (PHASES_NEEDING_WORKSPACE.has(command)) {
            userContext += readWorkspaceContext(rootPath, stackId);
        }
        if (command === 'constitution' || command === 'plan' || command === 'tasks') {
            userContext += readProjectStackInfo(rootPath, stackId);
        }

        // Nota de mockup de tela (apenas para specify). Usa path.dirname(outputPath) em vez de
        // storyDocPath porque o slug da história pode ter acabado de ser criado/trocado acima.
        if (command === 'specify') {
            const activeStoryDir = path.dirname(outputPath);
            const screensDir = path.join(activeStoryDir, 'screens');
            const screensRelPath = path.relative(rootPath, screensDir).replace(/\\/g, '/');
            if (fs.existsSync(screensDir)) {
                const mockupFiles = fs.readdirSync(screensDir).filter(f => /\.(png|jpg|jpeg|svg|webp)$/i.test(f));
                if (mockupFiles.length > 0) {
                    userContext += `\nATENÇÃO: Existe um mockup de tela em ${screensRelPath}/ (${mockupFiles.join(', ')}). Use-o como referência visual para refinar os critérios de aceite e detalhar a User Story.\n`;
                }
            }
            const figmaRefPath = path.join(activeStoryDir, 'screens', 'figma_ref.txt');
            if (fs.existsSync(figmaRefPath)) {
                const figmaUrl = fs.readFileSync(figmaRefPath, 'utf-8').trim();
                userContext += `\nATENÇÃO: Referência de design no Figma: ${figmaUrl}. Use o MCP do Figma para obter detalhes visuais ao refinar os critérios de aceite.\n`;
            }
        }

        const instruction = userInstruction.trim() !== '' ? `INSTRUÇÃO ADICIONAL: ${userInstruction}\n\n` : '';
        const contextSection = userContext.trim() !== ''
            ? `CONTEXTO DO PROJETO:\n${userContext}`
            : 'Não há contexto adicional. Gere o documento AGORA com base estritamente no PLAYBOOK acima. NÃO solicite contexto. NÃO faça perguntas.';
        const finalPrompt = `${instruction}GERE O ARQUIVO MD. Seja direto e conciso. Foque nos pontos essenciais sem exemplos redundantes.\n\n${contextSection}`;

        if (chatResponse) { chatResponse.progress('IA gerando o documento SDD...'); }

        const PHASE_TYPE: Record<string, 'light' | 'implement' | 'standard' | 'mini'> = {
            constitution:    'light',
            specify:         'mini',
            plan:            'light',
            tasks:           'light',
            implement:       'implement',
            'qa-automation': 'implement',
        };
        const phaseType = PHASE_TYPE[command] ?? 'standard';

        const { text: fullText, totalTokens, credits } = await AIClient.sendPrompt(systemPrompt, finalPrompt, outputChannel, token, (chunk) => {
            if (chatResponse) { chatResponse.markdown(chunk); }
        }, phaseType);

        // qa-report/qa-coverage pedem ao playbook uma versão HTML executiva embutida num bloco
        // ```html``` — extrai esse bloco para um arquivo .html irmão e mantém o .md só com Markdown.
        let mdToSave = fullText;
        let htmlReportPath: string | null = null;
        let htmlReportContent: string | null = null;
        if (command === 'qa-report' || command === 'qa-coverage') {
            const { html, rest } = extractHtmlBlock(fullText);
            if (html) {
                mdToSave = rest.trim() + '\n';
                htmlReportPath = outputPath.replace(/\.md$/, '.html');
                htmlReportContent = html;
            }
        }

        await trackEvent(context, outputChannel, {
            event: 'phase_completed',
            command,
            stack: stackId,
            tokens: totalTokens,
            credits: credits ?? 0
        });

        if (outputPath) {
            const outputDir = path.dirname(outputPath);
            if (!fs.existsSync(outputDir)) { fs.mkdirSync(outputDir, { recursive: true }); }
            // Pede confirmação ao desenvolvedor antes de sobrescrever arquivo com conteúdo existente
            if (fs.existsSync(outputPath)) {
                const existing = fs.readFileSync(outputPath, 'utf8').trim();
                if (existing.length > 100 && !existing.includes('DESCREVA AQUI')) {
                    const choice = await vscode.window.showWarningMessage(
                        `⚠️ "${path.basename(outputPath)}" já existe com conteúdo.\nSobrescrever com a nova geração?`,
                        { modal: true },
                        'Sobrescrever',
                        'Cancelar'
                    );
                    if (choice !== 'Sobrescrever') {
                        if (chatResponse) {
                            chatResponse.markdown(`⛔ Cancelado. \`${path.basename(outputPath)}\` preservado sem alterações.`);
                        }
                        outputChannel.appendLine(`[SDD] ⛔ Sobrescrita cancelada pelo desenvolvedor: ${path.basename(outputPath)}`);
                        return;
                    }
                }
            }
            fs.writeFileSync(outputPath, mdToSave);
            await openFile(outputPath);
            if (chatResponse) { chatResponse.markdown(`\n\n✅ **Salvo em**: ${path.basename(outputPath)}`); }

            if (htmlReportPath && htmlReportContent) {
                fs.writeFileSync(htmlReportPath, htmlReportContent);
                if (chatResponse) { chatResponse.markdown(`\n\n📊 **Relatório HTML executivo salvo em**: ${path.basename(htmlReportPath)}`); }
                const htmlPathForClosure = htmlReportPath;
                vscode.window.showInformationMessage(
                    `📊 Relatório HTML executivo gerado: ${path.basename(htmlPathForClosure)}`,
                    'Abrir no Navegador'
                ).then(choice => {
                    if (choice === 'Abrir no Navegador') {
                        vscode.env.openExternal(vscode.Uri.file(htmlPathForClosure));
                    }
                });
            }
        }

    } catch (error: any) {
        if (chatResponse) { chatResponse.markdown(`❌ Erro: ${error.message}`); }
        outputChannel.appendLine(`[SDD ERRO] ${error.message}`);
    }
}

function getWorkspaceRoot(): string | null {
    const folders = vscode.workspace.workspaceFolders;
    return folders ? folders[0].uri.fsPath : null;
}


export function deactivate() {}
