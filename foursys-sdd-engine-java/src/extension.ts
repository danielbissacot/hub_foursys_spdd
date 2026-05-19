import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AIClient } from './ai-client';
import { loadPlaybook, findCatalogPath, detectTechnology } from './catalog-loader';
import { FoursysSDDSidebarProvider } from './sidebar-provider';

const DOC_FOLDER = 'doc_projeto';
const WORKSPACE_CONTEXT_EXTS = ['.java', '.yml', '.yaml', '.xml', '.properties', '.cobol', '.cbl'];
const WORKSPACE_CONTEXT_MAX_FILES = 5;
const WORKSPACE_CONTEXT_MAX_LINES = 300;

function getDocPath(rootPath: string): string {
    const docPath = path.join(rootPath, DOC_FOLDER);
    if (!fs.existsSync(docPath)) {
        fs.mkdirSync(docPath, { recursive: true });
    }
    return docPath;
}

async function openFile(filePath: string) {
    if (fs.existsSync(filePath)) {
        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc);
    }
}

// Lê até WORKSPACE_CONTEXT_MAX_FILES arquivos reais do workspace para reduzir alucinações.
// A IA para de inventar quando vê o código existente.
function readWorkspaceContext(rootPath: string, technology: string | null): string {
    if (!technology) { return ''; }

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
            if (entry.isDirectory()) {
                walk(full, depth + 1);
            } else if (WORKSPACE_CONTEXT_EXTS.includes(path.extname(entry.name))) {
                try {
                    const stat = fs.statSync(full);
                    collected.push({ filePath: full, mtime: stat.mtimeMs });
                } catch { /* ignorar */ }
            }
        }
    };

    walk(srcPath, 0);

    // Ordena pelos mais recentemente modificados e pega os primeiros N
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
    return context;
}

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('Foursys SDD');
    outputChannel.appendLine('[Foursys SDD] Motor V2.0.1 Java Online!');

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

    context.subscriptions.push(vscode.commands.registerCommand('foursys.implement', () => {
        vscode.commands.executeCommand('workbench.action.chat.open', {
            query: 'Leia os arquivos doc_projeto/constitution.md, doc_projeto/implementation_plan.md e doc_projeto/task_list.md deste workspace. Inicie a codificação estritamente de acordo com as tarefas listadas e invoque a Skill Java: #agente-spring-foursys.'
        });
    }));

    const sidebarProvider = new FoursysSDDSidebarProvider(context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(FoursysSDDSidebarProvider.viewType, sidebarProvider));
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

    const savedPath = context.globalState.get<string>('catalogPath');
    const catalogPath = findCatalogPath(rootPath, savedPath || '');
    const docPath = getDocPath(rootPath);
    const builtinSDD = context.extensionUri.fsPath;

    outputChannel.show(true);
    outputChannel.appendLine(`\n[SDD] ▶ Iniciando fase: ${command}`);

    if (chatResponse) { chatResponse.markdown(`🔄 **Foursys SDD**: Iniciando fase **${command.toUpperCase()}**...\n\n`); }

    let playbookPath = '';
    let outputPath = '';
    let contextFiles: string[] = [];

    if (chatResponse) { chatResponse.progress('Buscando Playbook e Regras do Hub...'); }

    // Java plugin: builtin playbooks have priority — prevents Hub's Angular playbooks from overriding
    switch (command) {
        case 'constitution':
            playbookPath = path.join(builtinSDD, 'catalog', 'sdd', 'foursys-constitution.md');
            outputPath = path.join(docPath, 'constitution.md');
            break;

        case 'specify':
            playbookPath = path.join(builtinSDD, 'catalog', 'sdd', 'foursys-specify.md');
            outputPath = path.join(docPath, 'user_story.md');
            contextFiles = [path.join(docPath, 'constitution.md')];
            break;

        case 'plan':
            playbookPath = path.join(builtinSDD, 'catalog', 'sdd', 'foursys-plan.md');
            outputPath = path.join(docPath, 'implementation_plan.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'user_story.md')];
            break;

        case 'tasks':
            playbookPath = path.join(builtinSDD, 'catalog', 'sdd', 'foursys-tasks.md');
            outputPath = path.join(docPath, 'task_list.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'implementation_plan.md')];
            break;
    }

    if (command === 'specify' && userInstruction.trim() === '') {
        const fileExists = fs.existsSync(outputPath);
        const content = fileExists ? fs.readFileSync(outputPath, 'utf8') : '';
        if (!fileExists || content.trim() === '' || content.includes('DESCREVA AQUI')) {
            const template = `# User Story\n\n**TECNOLOGIA:** Spring Boot\n\n**NECESSIDADE:**\nDESCREVA AQUI o que você precisa construir...`;
            fs.writeFileSync(outputPath, template);
            await openFile(outputPath);
            if (chatResponse) { chatResponse.markdown('📝 Por favor, descreva sua necessidade no arquivo `user_story.md` e rode o comando novamente.'); }
            return;
        }
    }

    if (!playbookPath || !fs.existsSync(playbookPath)) {
        const msg = `⚠️ Playbook não encontrado: ${playbookPath}`;
        if (chatResponse) { chatResponse.markdown(msg); }
        outputChannel.appendLine(`[SDD] ${msg}`);
        return;
    }

    try {
        const playbookName = path.basename(playbookPath, '.md');
        outputChannel.appendLine(`[SDD] 🧠 Usando Playbook: ${playbookName}`);

        const systemPromptRaw = loadPlaybook(playbookPath);
        const systemPrompt = `VOCÊ É O AGENTE DE ENGENHARIA FOURSYS SDD.
FOCO: GERAÇÃO DE DOCUMENTAÇÃO DE SOFTWARE.
REGRAS ESTRITAS:
1. IGNORE SAUDAÇÕES. NÃO faça perguntas desnecessárias.
2. GERE O DOCUMENTO MARKDOWN DIRETAMENTE, sem introduções.
3. Siga estritamente a CONSTITUIÇÃO e o PLAYBOOK fornecidos abaixo.
4. GERE APENAS O CONTEÚDO TÉCNICO SOLICITADO NO FORMATO ESPECIFICADO.

PLAYBOOK BASE:
${systemPromptRaw}`;

        // Detecta tecnologia para injetar contexto real do workspace
        const userStoryPath = path.join(docPath, 'user_story.md');
        const technology = detectTechnology(userStoryPath);

        let userContext = referencesContext;
        contextFiles.forEach(file => {
            if (fs.existsSync(file)) {
                userContext += `\n--- ARQUIVO DO PROJETO: ${path.basename(file)} ---\n${fs.readFileSync(file, 'utf8')}\n`;
            }
        });

        // Injeta código real do workspace — principal redutor de alucinação
        userContext += readWorkspaceContext(rootPath, technology);

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
            fs.writeFileSync(outputPath, fullText);
            await openFile(outputPath);
            if (chatResponse) { chatResponse.markdown(`\n\n✅ **Salvo em**: ${path.basename(outputPath)}`); }
        }

    } catch (error: any) {
        if (chatResponse) { chatResponse.markdown(`❌ Erro: ${error.message}`); }
    }
}

function getWorkspaceRoot(): string | null {
    const folders = vscode.workspace.workspaceFolders;
    return folders ? folders[0].uri.fsPath : null;
}

export function deactivate() {}
