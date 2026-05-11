import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AIClient } from './ai-client';
import { loadPlaybook, detectTechnology, findAgentSkill, findCatalogPath } from './catalog-loader';
import { FoursysSDDSidebarProvider } from './sidebar-provider';

// ============================================================
// Foursys SDD Engine V1.2.0 - O MAESTRO DA ENGENHARIA
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
    outputChannel.appendLine('[Foursys SDD] Motor V1.2 inicializado!');

    const agentes = vscode.chat.createChatParticipant('foursys_sdd', async (request, chatContext, response, token) => {
        await executeSDDPhase(request.command || '', response, context, outputChannel);
    });

    agentes.iconPath = vscode.Uri.joinPath(context.extensionUri, 'resources', 'logo.png');
    context.subscriptions.push(agentes);

    context.subscriptions.push(vscode.commands.registerCommand('foursys.constitution', () => executeSDDPhase('constitution', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.specify', () => executeSDDPhase('specify', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.plan', () => executeSDDPhase('plan', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.tasks', () => executeSDDPhase('tasks', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.implement', () => executeSDDPhase('implement', null, context, outputChannel)));

    const sidebarProvider = new FoursysSDDSidebarProvider(context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(FoursysSDDSidebarProvider.viewType, sidebarProvider));
}

async function executeSDDPhase(command: string, chatResponse: any, context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
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

    const needsCatalog = ['specify', 'plan', 'implement'];
    if (!catalogPath && needsCatalog.includes(command)) {
        const msg = '❌ Catálogo não encontrado. Aponte para a pasta /catalog do seu Hub.';
        if (chatResponse) { chatResponse.markdown(msg); }
        else {
            const select = 'Selecionar Pasta';
            vscode.window.showErrorMessage(msg, select).then(selection => {
                if (selection === select) {
                    vscode.window.showOpenDialog({ canSelectFolders: true }).then(uris => {
                        if (uris && uris[0]) {
                            context.globalState.update('catalogPath', uris[0].fsPath);
                            vscode.window.showInformationMessage('✅ Catálogo configurado! Clique novamente na fase.');
                        }
                    });
                }
            });
        }
        return;
    }

    const docPath = getDocPath(rootPath);
    let playbookPath = '';
    let outputPath = '';
    let contextFiles: string[] = [];
    let taskName = '';
    let isDev = false;
    const builtinSDD = context.extensionUri.fsPath;

    switch (command) {
        case 'constitution':
            playbookPath = path.join(builtinSDD, 'catalog', 'sdd', 'foursys-constitution.md');
            outputPath = path.join(docPath, 'constitution.md');
            taskName = 'Constitution';
            break;
        case 'specify':
            playbookPath = path.join(catalogPath || '', 'playbook', 'fase1_refinamento_negocio', 'FASE1_REFINAMENTO_NEGOCIO.md');
            outputPath = path.join(docPath, 'user_story.md');
            contextFiles = [path.join(docPath, 'constitution.md')];
            taskName = 'Specify';
            break;
        case 'plan':
            playbookPath = path.join(catalogPath || '', 'playbook', 'fase2_desenho_tecnico', 'FASE2_ESPECIFICACAO_TECNICA.md');
            outputPath = path.join(docPath, 'implementation_plan.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'user_story.md')];
            taskName = 'Plan';
            break;
        case 'tasks':
            playbookPath = path.join(builtinSDD, 'catalog', 'sdd', 'foursys-tasks.md');
            outputPath = path.join(docPath, 'task_list.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'implementation_plan.md')];
            taskName = 'Tasks';
            break;
        case 'implement':
            outputPath = path.join(docPath, 'output_desenvolvimento.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'implementation_plan.md'), path.join(docPath, 'task_list.md')];
            taskName = 'Implement';
            isDev = true;
            break;
    }

    // Lógica especial para Specify (sem input superior)
    if (command === 'specify') {
        const currentContent = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
        if (currentContent.trim() === '' || currentContent.includes('DESCREVA AQUI')) {
            const template = `# User Story\n\n**TECNOLOGIA:** [Angular / Spring Boot / COBOL]\n\n**NECESSIDADE:**\nDESCREVA AQUI o que você precisa construir...`;
            fs.writeFileSync(outputPath, template);
            await openFile(outputPath);
            vscode.window.showInformationMessage('📝 Descreva sua necessidade no arquivo user_story.md e clique em Specify novamente.');
            return;
        }
    }

    // Lógica especial para Implement (Seleção de Agente)
    if (command === 'implement') {
        const storyPath = path.join(docPath, 'user_story.md');
        let tech = detectTechnology(storyPath);
        
        if (!tech) {
            const selection = await vscode.window.showQuickPick(['Angular', 'Spring Boot', 'COBOL'], {
                placeHolder: 'Qual tecnologia vamos implementar?'
            });
            if (!selection) return;
            tech = selection === 'Spring Boot' ? 'spring_boot' : selection.toLowerCase();
        }
        
        playbookPath = findAgentSkill(catalogPath || '', tech) || '';
        outputChannel.appendLine(`[SDD] 🤖 Usando Agente Especialista: ${tech.toUpperCase()}`);
    }

    if (!playbookPath || !fs.existsSync(playbookPath)) {
        const msg = `❌ Playbook não encontrado: ${playbookPath}`;
        if (chatResponse) { chatResponse.markdown(msg); }
        else { vscode.window.showErrorMessage(msg); }
        return;
    }

    if (chatResponse) { chatResponse.markdown(`🔄 **Foursys SDD**: Iniciando **${taskName}**...`); }

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Foursys SDD: ${taskName}...`,
        cancellable: false
    }, async () => {
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
                const req = fs.readFileSync(outputPath, 'utf8');
                finalPrompt = `Gere a User Story completa com critérios de aceite baseada nesta necessidade:\n\n${req}\n\n${userContext}`;
            } else if (command === 'plan') {
                finalPrompt = `Gere o Plano de Implementação Técnica:\n\n${userContext}`;
            } else if (command === 'tasks') {
                finalPrompt = `Gere a lista de tarefas atômicas:\n\n${userContext}`;
            } else if (isDev) {
                finalPrompt = `DESENVOLVA O CÓDIGO COMPLETO:\n\n${userContext}`;
            } else {
                finalPrompt = `Analise e gere o documento:\n\n${userContext || 'Inicie agora.'}`;
            }

            const fullText = await AIClient.sendPrompt(systemPrompt, finalPrompt, outputChannel);
            outputChannel.show(true);
            if (chatResponse) { chatResponse.markdown(fullText); }

            if (isDev) {
                const filesCreated = extractAndSaveFiles(fullText, rootPath, outputChannel);
                if (chatResponse) { chatResponse.markdown(`\n\n🚀 **SDD Implement Concluído!** ${filesCreated} arquivos gerados.`); }
                else { vscode.window.showInformationMessage(`🚀 SDD: ${filesCreated} arquivos gerados.`); }
            } else {
                fs.writeFileSync(outputPath, fullText);
                await openFile(outputPath);
                const msg = `✅ Artefato salvo e aberto: ${path.basename(outputPath)}`;
                if (chatResponse) { chatResponse.markdown(`\n\n${msg}`); }
                else { vscode.window.showInformationMessage(msg); }
            }
        } catch (error: any) {
            if (chatResponse) { chatResponse.markdown(`❌ Erro: ${error.message}`); }
            else { vscode.window.showErrorMessage(`Erro: ${error.message}`); }
        }
    });
}

function getWorkspaceRoot(): string | null {
    const folders = vscode.workspace.workspaceFolders;
    return folders ? folders[0].uri.fsPath : null;
}

function extractAndSaveFiles(response: string, rootPath: string, outputChannel: vscode.OutputChannel): number {
    outputChannel.appendLine('------------------------------------------------------------');
    outputChannel.appendLine('[SISTEMA] 📂 Iniciando extração física SDD...');
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
    outputChannel.appendLine(`[SISTEMA] 🚀 Finalizado: ${count} arquivo(s) atualizado(s).`);
    outputChannel.appendLine('------------------------------------------------------------');
    return count;
}

export function deactivate() {}
