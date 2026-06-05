import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AIClient } from './ai-client';
import { loadPlaybookForStack, findCatalogPath, detectTechnology } from './catalog-loader';
import { FoursysSDDSidebarProvider } from './sidebar-provider';
import { getStackConfig, getAllStacks, resolveStack } from './stack-registry';

const DOC_FOLDER = 'doc_projeto';
const WORKSPACE_CONTEXT_MAX_FILES = 5;
const WORKSPACE_CONTEXT_MAX_LINES = 300;

// Mend Advise — ID correto na marketplace VS Code (case-sensitive no getExtension)
const MEND_EXTENSION_ID   = 'mend.mend-advise';
const MEND_LICENSE_SECRET  = 'foursys.mendLicenseKey';
const MEND_API_TOKEN       = 'ef149a32-1038-40b2-9917-436a1266ed17';

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

    // Lista completa de arquivos encontrados como zona protegida para a IA
    let protectedList = '\n--- ARQUIVOS EXISTENTES NO WORKSPACE (ZONA PROTEGIDA) ---\n';
    protectedList += 'INSTRUÇÃO OBRIGATÓRIA: Os arquivos abaixo já existem no projeto.\n';
    protectedList += 'NÃO modifique nenhum deles a menos que esteja EXPLICITAMENTE listado na Task List ativa.\n';
    for (const { filePath } of collected) {
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

    context.subscriptions.push(vscode.commands.registerCommand('foursys.qaImplement', async () => {
        const rootPath = getWorkspaceRoot();
        if (!rootPath) { return; }
        const scriptsPath = path.join(rootPath, DOC_FOLDER, 'qa', 'scripts_automacao.md');
        if (!fs.existsSync(scriptsPath)) {
            vscode.window.showWarningMessage('⚠️ Execute "Scripts de Automação" primeiro para gerar o arquivo de scripts.');
            return;
        }
        const stackId = getActiveStackId(context);
        const content = fs.readFileSync(scriptsPath, 'utf8');
        const blocks = extractCodeBlocks(content, rootPath, stackId);
        if (blocks.length === 0) {
            vscode.window.showWarningMessage('⚠️ Nenhum bloco de código extraível encontrado. Verifique se o arquivo scripts_automacao.md contém blocos ```gherkin, ```typescript ou ```java com <!-- file: ... --> ou Feature: / describe(...).');
            return;
        }
        const existing = blocks.filter(b => fs.existsSync(b.targetFile));
        if (existing.length > 0) {
            const choice = await vscode.window.showWarningMessage(
                `⚠️ ${existing.length} arquivo(s) já existem. Sobrescrever?`,
                { modal: true }, 'Sobrescrever', 'Cancelar'
            );
            if (choice !== 'Sobrescrever') { return; }
        }
        for (const block of blocks) {
            const dir = path.dirname(block.targetFile);
            if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
            fs.writeFileSync(block.targetFile, block.content);
            await openFile(block.targetFile);
        }
        vscode.window.showInformationMessage(`✅ ${blocks.length} arquivo(s) de teste criados com sucesso.`);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('foursys.implement', async () => {
        const stackId = getActiveStackId(context);
        const config = getStackConfig(stackId);
        vscode.commands.executeCommand('workbench.action.chat.open', {
            query: `Leia os arquivos doc_projeto/constitution.md, doc_projeto/implementation_plan.md e doc_projeto/task_list.md deste workspace. Inicie a codificação estritamente de acordo com as tarefas listadas e invoque a Skill: ${config.implementSkillTag}.`
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
            // Notifica a sidebar para atualizar o badge
            vscode.commands.executeCommand('foursys-sdd-sidebar-view.focus');
        }
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
        const choice = await vscode.window.showInformationMessage(
            '📝 História salva! Deseja analisar com o Foursys Specify agora?',
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
            contextFiles = [path.join(docPath, 'constitution.md')];
            break;
        case 'plan':
            outputPath = path.join(docPath, 'implementation_plan.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'user_story.md')];
            break;
        case 'tasks':
            outputPath = path.join(docPath, 'task_list.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'implementation_plan.md')];
            break;
        case 'qa-test-plan':
            outputPath = path.join(docPath, 'qa', 'plano_testes.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'user_story.md'), path.join(docPath, 'implementation_plan.md')];
            break;
        case 'qa-test-cases':
            outputPath = path.join(docPath, 'qa', 'casos_teste.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'qa', 'plano_testes.md')];
            break;
        case 'qa-automation':
            outputPath = path.join(docPath, 'qa', 'scripts_automacao.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'qa', 'casos_teste.md')];
            break;
        case 'qa-coverage':
            outputPath = path.join(docPath, 'qa', 'review_cobertura.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'qa', 'scripts_automacao.md')];
            break;
        case 'qa-report':
            outputPath = path.join(docPath, 'qa', 'relatorio_qualidade.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'qa', 'review_cobertura.md')];
            break;
    }

    if (command === 'specify' && userInstruction.trim() === '') {
        const content = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
        if (!content || content.trim() === '' || content.includes('DESCREVA AQUI')) {
            const template = `# User Story\n\n**TECNOLOGIA:** ${stackConfig.displayName}\n\n**NECESSIDADE:**\nDESCREVA AQUI o que você precisa construir...`;
            fs.writeFileSync(outputPath, template);
            await openFile(outputPath);
            if (chatResponse) { chatResponse.markdown('📝 Por favor, descreva sua necessidade no arquivo `user_story.md` e rode o comando novamente.'); }
            return;
        }
    }

    if (chatResponse) { chatResponse.progress('Buscando Playbook e Regras do Hub...'); }

    try {
        const systemPromptRaw = loadPlaybookForStack(command, stackId, builtinCatalogPath, catalogPath);
        const systemPrompt = `VOCÊ É O AGENTE DE ENGENHARIA FOURSYS SDD.
STACK ATIVA: ${stackConfig.displayName}
FOCO: GERAÇÃO DE DOCUMENTAÇÃO DE SOFTWARE.
REGRAS ESTRITAS:
1. IGNORE SAUDAÇÕES. NÃO faça perguntas desnecessárias.
2. GERE O DOCUMENTO MARKDOWN DIRETAMENTE, sem introduções.
3. Siga estritamente a CONSTITUIÇÃO e o PLAYBOOK fornecidos abaixo.
4. GERE APENAS O CONTEÚDO TÉCNICO SOLICITADO NO FORMATO ESPECIFICADO.

PLAYBOOK BASE:
${systemPromptRaw}`;

        let userContext = referencesContext;
        contextFiles.forEach(file => {
            if (fs.existsSync(file)) {
                userContext += `\n--- ARQUIVO DO PROJETO: ${path.basename(file)} ---\n${fs.readFileSync(file, 'utf8')}\n`;
            }
        });
        userContext += readWorkspaceContext(rootPath, stackId);

        const instruction = userInstruction.trim() !== '' ? `INSTRUÇÃO ADICIONAL: ${userInstruction}\n\n` : '';
        const contextSection = userContext.trim() !== ''
            ? `CONTEXTO DO PROJETO:\n${userContext}`
            : 'Não há contexto adicional. Gere o documento AGORA com base estritamente no PLAYBOOK acima. NÃO solicite contexto. NÃO faça perguntas.';
        const finalPrompt = `${instruction}GERE O ARQUIVO MD COMPLETO.\n\n${contextSection}`;

        if (chatResponse) { chatResponse.progress('IA gerando o documento SDD...'); }

        const fullText = await AIClient.sendPrompt(systemPrompt, finalPrompt, outputChannel, token, (chunk) => {
            if (chatResponse) { chatResponse.markdown(chunk); }
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

interface ExtractedBlock {
    language: string;
    content: string;
    targetFile: string;
}

function slugify(text: string): string {
    return text.trim().toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function resolveTargetFile(lang: string, content: string, hint: string | null, rootPath: string, stackId: string): string | null {
    if (hint) { return path.join(rootPath, hint); }

    if (lang === 'gherkin') {
        const m = content.match(/^Feature:\s*(.+)/m);
        if (!m) { return null; }
        const dir = stackId === 'spring_boot' ? 'src/test/resources/features' : 'test/features';
        return path.join(rootPath, dir, `${slugify(m[1])}.feature`);
    }
    if (lang === 'typescript') {
        const m = content.match(/describe\s*\(\s*['"`](.+?)['"`]/);
        if (!m) { return null; }
        return path.join(rootPath, 'test', 'steps', `${slugify(m[1])}.steps.ts`);
    }
    if (lang === 'java') {
        const m = content.match(/class\s+(\w+)/);
        if (!m) { return null; }
        return path.join(rootPath, 'src', 'test', 'java', 'steps', `${m[1]}.java`);
    }
    return null;
}

function extractCodeBlocks(markdownContent: string, rootPath: string, stackId: string): ExtractedBlock[] {
    const EXTRACTABLE = new Set(['gherkin', 'typescript', 'java']);
    const FILE_HINT_RE = /<!--\s*file:\s*(.+?)\s*-->/i;
    const lines = markdownContent.split('\n');
    const blocks: ExtractedBlock[] = [];
    let inBlock = false;
    let lang = '';
    let bodyLines: string[] = [];
    let pendingHint: string | null = null;

    for (const line of lines) {
        if (!inBlock) {
            const hintMatch = line.match(FILE_HINT_RE);
            if (hintMatch) { pendingHint = hintMatch[1].trim(); continue; }

            const openMatch = line.match(/^```(\w+)/);
            if (openMatch) {
                inBlock = true;
                lang = openMatch[1].toLowerCase();
                bodyLines = [];
                continue;
            }
            if (line.trim() && !hintMatch) { pendingHint = null; }
        } else {
            if (line.startsWith('```')) {
                const content = bodyLines.join('\n');
                if (EXTRACTABLE.has(lang)) {
                    const target = resolveTargetFile(lang, content, pendingHint, rootPath, stackId);
                    if (target) { blocks.push({ language: lang, content, targetFile: target }); }
                }
                inBlock = false;
                lang = '';
                bodyLines = [];
                pendingHint = null;
            } else {
                bodyLines.push(line);
            }
        }
    }
    return blocks;
}

export function deactivate() {}
