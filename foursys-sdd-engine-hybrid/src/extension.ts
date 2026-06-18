import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AIClient } from './ai-client';
import { loadPlaybookForStack, findCatalogPath, detectTechnology } from './catalog-loader';
import { FoursysSDDSidebarProvider } from './sidebar-provider';
import { getStackConfig, getAllStacks, resolveStack } from './stack-registry';

const DOC_FOLDER = 'doc_projeto';
const WORKSPACE_CONTEXT_MAX_FILES = 2;   // era 5 — reduz tokens de workspace em 60%
const WORKSPACE_CONTEXT_MAX_LINES = 80;  // era 300 — snippet curto de imports + assinaturas
const CONTEXT_FILE_MAX_LINES = 200;      // era 800 — cabeçalho do doc é suficiente
const PHASES_NEEDING_WORKSPACE = new Set([
    'plan', 'qa-test-plan', 'qa-automation'  // removido qa-test-cases (não precisa de código)
]);

// Mend Advise — ID correto na marketplace VS Code (case-sensitive no getExtension)
const MEND_EXTENSION_ID   = 'mend.mend-advise';
const MEND_LICENSE_SECRET  = 'foursys.mendLicenseKey';
const MEND_API_TOKEN       = 'eyJ1cmwiOiJodHRwczovL2Rzcy1hcHBzZWMubWVuZC5pby9hcGkiLCJ0b2tlbiI6ImVmMTQ5YTMyLTEwMzgtNDBiMi05OTE3LTQzNmExMjY2ZWQxNyJ9';

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

function getDocPath(rootPath: string): string {
    const docPath = path.join(rootPath, DOC_FOLDER);
    if (!fs.existsSync(docPath)) { fs.mkdirSync(docPath, { recursive: true }); }
    return docPath;
}

async function openFile(filePath: string) {
    if (fs.existsSync(filePath)) {
        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc, { preview: false });
    }
}

function readWorkspaceContext(rootPath: string, stackId: string): string {
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

function getActiveStackId(context: vscode.ExtensionContext): string {
    const rootPath = getWorkspaceRoot();
    const savedStack = context.workspaceState.get<string>('activeStack');
    const docPath = rootPath ? getDocPath(rootPath) : undefined;
    const userStoryPath = docPath ? path.join(docPath, 'user_story.md') : undefined;
    const result = resolveStack(rootPath ?? undefined, userStoryPath, savedStack);
    return result.stackId === 'unknown' ? 'generic' : result.stackId;
}

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('Foursys SDD Hybrid');
    outputChannel.appendLine('[Foursys SDD Hybrid] Motor V1.0.0 Hybrid Online!');

    // Garante Mend Advise instalado + licença configurada (fire-and-forget, não bloqueia activate)
    ensureMendAdvise(context, outputChannel).catch(e =>
        outputChannel.appendLine(`[Mend] Erro na configuração: ${e.message}`)
    );

    const agentes = vscode.chat.createChatParticipant('foursys_sdd', async (request, _chatContext, response, token) => {
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
    context.subscriptions.push(vscode.commands.registerCommand('foursys.qaCoverage',   () => executeSDDPhase('qa-coverage',   '', '', null, commandToken(), context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.qaReport',     () => executeSDDPhase('qa-report',     '', '', null, commandToken(), context, outputChannel)));

    context.subscriptions.push(vscode.commands.registerCommand('foursys.qaExportXray', async () => {
        const rootPath = getWorkspaceRoot();
        if (!rootPath) { return; }
        const casesPath = path.join(rootPath, DOC_FOLDER, 'qa', 'casos_teste.md');
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
            const exportPath = path.join(rootPath, DOC_FOLDER, 'qa', 'xray_export.feature');
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
        vscode.commands.executeCommand('workbench.action.chat.open', {
            query: `Leia os arquivos doc_projeto/constitution.md, doc_projeto/technical_spec.md, doc_projeto/implementation_plan.md e doc_projeto/task_list.md deste workspace. Inicie a codificação estritamente de acordo com as tarefas listadas e invoque a Skill: ${config.implementSkillTag}.`
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('foursys.implementSession1', async () => {
        vscode.commands.executeCommand('workbench.action.chat.open', {
            query: `Leia os arquivos doc_projeto/constitution.md, doc_projeto/technical_spec.md, doc_projeto/implementation_plan.md e doc_projeto/task_list.md deste workspace. Execute APENAS as tarefas da "Sessão 1 de Implementação — Domínio" do task_list.md. Ignore completamente as tarefas da Sessão 2 e de Teste.`
        });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('foursys.implementSession2', async () => {
        vscode.commands.executeCommand('workbench.action.chat.open', {
            query: `Leia os arquivos doc_projeto/constitution.md, doc_projeto/technical_spec.md, doc_projeto/implementation_plan.md e doc_projeto/task_list.md deste workspace. Execute APENAS as tarefas da "Sessão 2 de Implementação — Infraestrutura" do task_list.md. Ignore completamente as tarefas da Sessão 1 e de Teste.`
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
            vscode.commands.executeCommand('foursys-sdd-sidebar-view.focus');
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
        const screensDir = path.join(rootPath, DOC_FOLDER, 'screens');
        if (!fs.existsSync(screensDir)) { fs.mkdirSync(screensDir, { recursive: true }); }
        const destFile = path.join(screensDir, `mockup${ext}`);
        fs.copyFileSync(srcFile, destFile);
        await openFile(destFile);
        vscode.window.showInformationMessage('📸 Mockup salvo! Arraste o arquivo para o Copilot Chat como referência visual.');
    }));

    const sidebarProvider = new FoursysSDDSidebarProvider(context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(FoursysSDDSidebarProvider.viewType, sidebarProvider));

    // Notifica o usuário quando salva user_story.md com conteúdo real
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(async (doc) => {
        const rootPath = getWorkspaceRoot();
        if (!rootPath) { return; }
        const storyPath = path.join(rootPath, DOC_FOLDER, 'user_story.md');
        if (doc.uri.fsPath !== storyPath) { return; }
        const content = doc.getText();
        if (!content || content.includes('DESCREVA AQUI') || content.trim().length < 50) { return; }

        // Abre technical_spec.md ao lado para o dev preencher o detalhamento técnico
        const techSpecPath = path.join(rootPath, DOC_FOLDER, 'technical_spec.md');
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
                // Fallback: busca diretamente no hub catalog pelo nome da subpasta (slug = nome do diretório)
                if (!filePath) {
                    const hubAgentsPath = path.join(globalStoragePath, 'hub', 'catalog', 'agents_skills');
                    const searchSkillDir = (dir: string): string => {
                        if (!fs.existsSync(dir)) { return ''; }
                        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
                            if (!e.isDirectory()) { continue; }
                            const full = path.join(dir, e.name);
                            if (e.name === slug) {
                                const md = fs.readdirSync(full).find(f => f.endsWith('.md') && f !== 'README.md' && !fs.statSync(path.join(full, f)).isDirectory());
                                if (md) { return path.join(full, md); }
                            }
                            const found = searchSkillDir(full);
                            if (found) { return found; }
                        }
                        return '';
                    };
                    filePath = searchSkillDir(hubAgentsPath);
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
            await AIClient.sendPrompt(
                skillContent,
                skillExtra || 'Com base nesta skill, apresente brevemente o que você pode fazer e aguarde a próxima instrução do desenvolvedor.',
                outputChannel, token,
                (chunk) => { if (chatResponse) { chatResponse.markdown(chunk); } },
                'standard'
            );
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
            await AIClient.sendPrompt(
                pbContent,
                'Execute o fluxo de trabalho descrito neste playbook. Apresente os próximos passos de forma clara e objetiva.',
                outputChannel, token,
                (chunk) => { if (chatResponse) { chatResponse.markdown(chunk); } },
                'standard'
            );
        }
        return;
    }

    const rootPath = getWorkspaceRoot();
    if (!rootPath) { return; }

    const savedStack = context.workspaceState.get<string>('activeStack');
    const docPath = getDocPath(rootPath);
    const userStoryPath = path.join(docPath, 'user_story.md');
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

    const stackId = detection.stackId === 'unknown' ? 'generic' : detection.stackId;
    const stackConfig = getStackConfig(stackId);
    const builtinSDD = context.extensionUri.fsPath;
    const catalogPath = findCatalogPath(rootPath, context.globalState.get<string>('catalogPath') || '');
    const builtinCatalogPath = path.join(builtinSDD, 'catalog');

    outputChannel.show(true);
    outputChannel.appendLine(`\n[SDD] ▶ Fase: ${command} | Stack: ${stackConfig.displayName} (${detection.confidence})`);

    if (chatResponse) { chatResponse.markdown(`🔄 **Foursys SDD Hybrid**: Fase **${command.toUpperCase()}** | Stack: **${stackConfig.displayName}**\n\n`); }

    let outputPath = '';
    let contextFiles: string[] = [];

    switch (command) {
        case 'constitution':
            outputPath = path.join(docPath, 'constitution.md');
            break;
        case 'specify':
            outputPath = path.join(docPath, 'user_story.md');
            contextFiles = [
                path.join(docPath, 'constitution.md'),
                path.join(docPath, 'user_story.md'),
            ];
            break;
        case 'plan':
            outputPath = path.join(docPath, 'implementation_plan.md');
            contextFiles = [
                path.join(docPath, 'constitution.md'),
                path.join(docPath, 'user_story.md'),
                path.join(docPath, 'technical_spec.md'),
            ];
            break;
        case 'tasks':
            outputPath = path.join(docPath, 'task_list.md');
            contextFiles = [
                path.join(docPath, 'constitution.md'),
                path.join(docPath, 'implementation_plan.md'),
                path.join(docPath, 'technical_spec.md'),
            ];
            break;
        case 'qa-test-plan':
            outputPath = path.join(docPath, 'qa', 'plano_testes.md');
            contextFiles = [
                path.join(docPath, 'constitution.md'),
                path.join(docPath, 'user_story.md'),
                path.join(docPath, 'implementation_plan.md'),
                path.join(docPath, 'technical_spec.md'),
            ];
            break;
        case 'qa-test-cases':
            outputPath = path.join(docPath, 'qa', 'casos_teste.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'qa', 'plano_testes.md')];
            break;
        case 'qa-automation':
            outputPath = path.join(docPath, 'qa', 'roteiros_teste.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'qa', 'casos_teste.md')];
            break;
        case 'qa-coverage':
            outputPath = path.join(docPath, 'qa', 'review_cobertura.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'qa', 'roteiros_teste.md')];
            break;
        case 'qa-report':
            outputPath = path.join(docPath, 'qa', 'relatorio_qualidade.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'qa', 'review_cobertura.md')];
            break;
    }

    if (command === 'specify' && userInstruction.trim() === '') {
        const content = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
        if (!content || content.trim() === '' || content.includes('DESCREVA AQUI')) {
            const template = `# User Story\n\n**TECNOLOGIA:** ${stackConfig.displayName}\n\n## Necessidade de Negócio\nDESCREVA AQUI o que você precisa (quem/quer/para).\n\n## Regras de Negócio\n- Regra 1...\n\n## Critérios de Aceite\n- Dado... quando... então...`;
            fs.writeFileSync(outputPath, template);

            // Auto-cria technical_spec.md se ainda não existir
            const techSpecPath = path.join(docPath, 'technical_spec.md');
            if (!fs.existsSync(techSpecPath)) {
                const techTemplate = `# Technical Specification (opcional)\n\nCole aqui o detalhamento técnico: classes, endpoints, contratos de API,\nexemplos de código, yml, estrutura de pacotes, análise de impacto.\n\nEste arquivo é lido pela fase Plan. Mantenha apenas a história de negócio em user_story.md.\n`;
                fs.writeFileSync(techSpecPath, techTemplate);
            }

            outputChannel.appendLine('[SDD] 📝 user_story.md criado. Preencha com a história de NEGÓCIO.');
            outputChannel.appendLine('[SDD] 📋 Para detalhamento técnico, use doc_projeto/technical_spec.md (já criado).');
            await openFile(outputPath);
            if (chatResponse) { chatResponse.markdown('📝 Por favor, descreva sua necessidade no arquivo `user_story.md` e rode o comando novamente.\n\n> 💡 Detalhamento técnico (classes, endpoints, yml)? Use `doc_projeto/technical_spec.md`.'); }
            return;
        }
    }

    if (command === 'specify' && userInstruction.trim() !== '') {
        const pastedContent = userInstruction.trim();
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

        // Nota de mockup de tela (apenas para specify)
        if (command === 'specify') {
            const screensDir = path.join(docPath, 'screens');
            if (fs.existsSync(screensDir)) {
                const mockupFiles = fs.readdirSync(screensDir).filter(f => /\.(png|jpg|jpeg|svg|webp)$/i.test(f));
                if (mockupFiles.length > 0) {
                    userContext += `\nATENÇÃO: Existe um mockup de tela em doc_projeto/screens/ (${mockupFiles.join(', ')}). Use-o como referência visual para refinar os critérios de aceite e detalhar a User Story.\n`;
                }
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

        const fullText = await AIClient.sendPrompt(systemPrompt, finalPrompt, outputChannel, token, (chunk) => {
            if (chatResponse) { chatResponse.markdown(chunk); }
        }, phaseType);

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
            fs.writeFileSync(outputPath, fullText);
            await openFile(outputPath);
            if (chatResponse) { chatResponse.markdown(`\n\n✅ **Salvo em**: ${path.basename(outputPath)}`); }
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
