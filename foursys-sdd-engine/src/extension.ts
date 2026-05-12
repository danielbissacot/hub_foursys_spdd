import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AIClient } from './ai-client';
import { loadPlaybook, detectTechnology, findAgentSkill, findCatalogPath, listAvailableSkills } from './catalog-loader';
import { FoursysSDDSidebarProvider } from './sidebar-provider';

// ============================================================
// Foursys SDD Engine V1.2.2 - O MAESTRO DA ENGENHARIA (Full Streaming)
// ============================================================

const DOC_FOLDER = 'doc_projeto';

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

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('Foursys SDD');
    outputChannel.appendLine('[Foursys SDD] Motor V1.2.2 Online!');

    const agentes = vscode.chat.createChatParticipant('foursys_sdd', async (request, chatContext, response, token) => {
        await executeSDDPhase(request.command || '', response, context, outputChannel);
    });

    agentes.iconPath = vscode.Uri.joinPath(context.extensionUri, 'resources', 'logo.png');
    context.subscriptions.push(agentes);

    context.subscriptions.push(vscode.commands.registerCommand('foursys.constitution', () => executeSDDPhase('constitution', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.specify', () => executeSDDPhase('specify', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.plan', () => executeSDDPhase('plan', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.tasks', () => executeSDDPhase('tasks', null, context, outputChannel)));
    
    context.subscriptions.push(vscode.commands.registerCommand('foursys.implement', () => {
        vscode.commands.executeCommand('workbench.action.chat.open', { 
            query: '@foursys_sdd /implement ' 
        });
    }));

    const sidebarProvider = new FoursysSDDSidebarProvider(context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(FoursysSDDSidebarProvider.viewType, sidebarProvider));
}

async function executeSDDPhase(command: string, chatResponse: vscode.ChatResponseStream | null, context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
    const rootPath = getWorkspaceRoot();
    if (!rootPath) {
        const msg = '❌ Nenhum workspace aberto.';
        if (chatResponse) { chatResponse.markdown(msg); }
        else { vscode.window.showErrorMessage(msg); }
        return;
    }

    const savedPath = context.globalState.get<string>('catalogPath');
    const catalogPath = findCatalogPath(rootPath, savedPath || '');

    outputChannel.show(true);
    outputChannel.appendLine(`\n[SDD] ▶ Iniciando: ${command}`);

    if (chatResponse) { chatResponse.markdown(`🔄 **Foursys SDD**: Iniciando fase **${command.toUpperCase()}**...\n\n`); }

    const needsCatalog = ['specify', 'plan', 'implement'];
    if (!catalogPath && needsCatalog.includes(command)) {
        const msg = '❌ Catálogo não encontrado. Configure o Hub primeiro.';
        if (chatResponse) { chatResponse.markdown(msg); }
        else { vscode.window.showErrorMessage(msg); }
        return;
    }

    const docPath = getDocPath(rootPath);
    let playbookPath = '';
    let outputPath = '';
    let contextFiles: string[] = [];
    let isDev = false;
    const builtinSDD = context.extensionUri.fsPath;

    // Feedback visual de carregamento
    if (chatResponse) { chatResponse.progress('Buscando Playbook e Regras...'); }

    switch (command) {
        case 'constitution':
            playbookPath = path.join(builtinSDD, 'catalog', 'sdd', 'foursys-constitution.md');
            outputPath = path.join(docPath, 'constitution.md');
            break;
        case 'specify':
            playbookPath = path.join(catalogPath || '', 'playbook', 'fase1_refinamento_negocio', 'FASE1_REFINAMENTO_NEGOCIO.md');
            outputPath = path.join(docPath, 'user_story.md');
            contextFiles = [path.join(docPath, 'constitution.md')];
            break;
        case 'plan':
            playbookPath = path.join(catalogPath || '', 'playbook', 'fase2_desenho_tecnico', 'FASE2_ESPECIFICACAO_TECNICA.md');
            outputPath = path.join(docPath, 'implementation_plan.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'user_story.md')];
            break;
        case 'tasks':
            playbookPath = path.join(builtinSDD, 'catalog', 'sdd', 'foursys-tasks.md');
            outputPath = path.join(docPath, 'task_list.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'implementation_plan.md')];
            break;
        case 'implement':
            outputPath = path.join(rootPath, 'output_desenvolvimento.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'implementation_plan.md'), path.join(docPath, 'task_list.md')];
            isDev = true;

            const storyPath = path.join(docPath, 'user_story.md');
            const tech = detectTechnology(storyPath);
            playbookPath = findAgentSkill(catalogPath || '', tech || '') || '';
            
            if (!playbookPath) {
                const msg = `⚠️ Tecnologia não detectada. No chat: "@foursys_sdd /implement use o Agente [Java/Angular/COBOL]"`;
                if (chatResponse) { chatResponse.markdown(msg); }
                return;
            }
            break;
    }

    if (command === 'specify') {
        const currentContent = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
        if (currentContent.trim() === '' || currentContent.includes('DESCREVA AQUI')) {
            const template = `# User Story\n\n**TECNOLOGIA:** [Angular / Spring Boot / COBOL]\n\n**NECESSIDADE:**\nDESCREVA AQUI o que você precisa construir...`;
            fs.writeFileSync(outputPath, template);
            await openFile(outputPath);
            if (chatResponse) { chatResponse.markdown('📝 Descreva sua necessidade no arquivo aberto e rode o comando novamente.'); }
            return;
        }
    }

    if (!playbookPath || !fs.existsSync(playbookPath)) {
        const msg = `❌ Playbook não encontrado.`;
        if (chatResponse) { chatResponse.markdown(msg); }
        return;
    }

    if (chatResponse) { chatResponse.progress('Preparando contexto para a IA...'); }

    try {
        const systemPrompt = loadPlaybook(playbookPath);
        let userContext = '';
        contextFiles.forEach(file => {
            if (fs.existsSync(file)) {
                userContext += `\n--- ARQUIVO: ${path.basename(file)} ---\n${fs.readFileSync(file, 'utf8')}\n`;
            }
        });

        let finalPrompt = '';
        if (command === 'specify') {
            finalPrompt = `Gere a User Story baseada nesta necessidade:\n\n${fs.readFileSync(outputPath, 'utf8')}\n\n${userContext}`;
        } else if (command === 'plan') {
            finalPrompt = `Gere o Plano de Implementação Técnica:\n\n${userContext}`;
        } else if (command === 'tasks') {
            finalPrompt = `Gere a lista de tarefas atômicas:\n\n${userContext}`;
        } else if (isDev) {
            finalPrompt = `DESENVOLVA O CÓDIGO COMPLETO:\n\n${userContext}`;
        } else {
            finalPrompt = `Execute a tarefa.\n\n${userContext || 'Inicie agora.'}`;
        }

        if (chatResponse) { chatResponse.progress('Aguardando resposta do modelo...'); }

        const fullText = await AIClient.sendPrompt(systemPrompt, finalPrompt, outputChannel, (chunk) => {
            if (chatResponse) {
                chatResponse.markdown(chunk); // STREAMING REAL PARA O CHAT
            }
        });

        if (isDev) {
            if (chatResponse) { chatResponse.progress('Extraindo arquivos gerados...'); }
            const filesCreated = extractAndSaveFiles(fullText, rootPath, outputChannel);
            const msg = `\n\n🚀 **Implementação Concluída!** ${filesCreated} arquivos gerados.`;
            if (chatResponse) { chatResponse.markdown(msg); }
            else { vscode.window.showInformationMessage(msg); }
        } else {
            fs.writeFileSync(outputPath, fullText);
            await openFile(outputPath);
            if (chatResponse) { chatResponse.markdown(`\n\n✅ **Artefato salvo**: ${path.basename(outputPath)}`); }
        }
    } catch (error: any) {
        if (chatResponse) { chatResponse.markdown(`❌ Erro: ${error.message}`); }
        else { vscode.window.showErrorMessage(`Erro: ${error.message}`); }
    }
}

function getWorkspaceRoot(): string | null {
    const folders = vscode.workspace.workspaceFolders;
    return folders ? folders[0].uri.fsPath : null;
}

function extractAndSaveFiles(response: string, rootPath: string, outputChannel: vscode.OutputChannel): number {
    const fileRegex = /\/\/\s*FILEPATH:\s*([^\s\n]+)\s*\n([\s\S]*?)(?=\/\/\s*FILEPATH:|$)/gi;
    let match;
    let count = 0;
    while ((match = fileRegex.exec(response)) !== null) {
        const filePath = match[1].trim();
        const code = match[2].trim().replace(/```[\w]*\s*$/, '').trim();
        const fullPath = path.isAbsolute(filePath) ? filePath : path.join(rootPath, filePath);
        const dir = path.dirname(fullPath);
        try {
            if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
            fs.writeFileSync(fullPath, code);
            outputChannel.appendLine(`[SAVE] ✅ ${filePath}`);
            count++;
        } catch (err: any) { outputChannel.appendLine(`[ERRO] ${filePath}: ${err.message}`); }
    }
    return count;
}

export function deactivate() {}
