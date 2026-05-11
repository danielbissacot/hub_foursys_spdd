import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AIClient } from './ai-client';
import { loadPlaybook, detectTechnology, findAgentSkill, findCatalogPath } from './catalog-loader';
import { FoursysSDDSidebarProvider } from './sidebar-provider';

// ============================================================
// Foursys SDD Engine V0.1.0 - O MAESTRO DA ENGENHARIA
// ============================================================

const DOC_FOLDER = 'doc_projeto';

function getDocPath(rootPath: string): string {
    const docPath = path.join(rootPath, DOC_FOLDER);
    if (!fs.existsSync(docPath)) {
        fs.mkdirSync(docPath, { recursive: true });
    }
    return docPath;
}

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('Foursys SDD');
    outputChannel.appendLine('[Foursys SDD] Motor inicializado com sucesso!');

    // REGISTRO DO CHAT PARTICIPANT
    const agentes = vscode.chat.createChatParticipant('foursys_sdd', async (request, chatContext, response, token) => {
        await executeSDDPhase(request.command || '', response, context, outputChannel);
    });

    agentes.iconPath = vscode.Uri.joinPath(context.extensionUri, 'resources', 'logo.png');
    context.subscriptions.push(agentes);

    // REGISTRO DE COMANDOS PARA SIDEBAR
    context.subscriptions.push(vscode.commands.registerCommand('foursys.constitution', () => executeSDDPhase('constitution', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.specify', () => executeSDDPhase('specify', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.plan', () => executeSDDPhase('plan', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.tasks', () => executeSDDPhase('tasks', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.implement', () => executeSDDPhase('implement', null, context, outputChannel)));

    // REGISTRO DA SIDEBAR
    const sidebarProvider = new FoursysSDDSidebarProvider(context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(FoursysSDDSidebarProvider.viewType, sidebarProvider));
}

async function executeSDDPhase(command: string, chatResponse: any, context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
    const rootPath = getWorkspaceRoot();
    if (!rootPath) {
        const msg = '❌ Nenhum workspace aberto. Abra uma pasta para iniciar o ciclo SDD.';
        if (chatResponse) chatResponse.markdown(msg);
        else vscode.window.showErrorMessage(msg);
        return;
    }

    const savedPath = context.globalState.get<string>('catalogPath');
    const catalogPath = findCatalogPath(rootPath, savedPath || '');

    // DIAGNÓSTICO — abre o Output e registra o estado atual
    outputChannel.show(true);
    outputChannel.appendLine(`\n[SDD] ▶ Fase: ${command}`);
    outputChannel.appendLine(`[SDD] 📁 Workspace: ${rootPath}`);
    outputChannel.appendLine(`[SDD] 💾 Catálogo salvo: ${savedPath || 'nenhum'}`);
    outputChannel.appendLine(`[SDD] 📂 Catálogo resolvido: ${catalogPath || 'NÃO ENCONTRADO'}`);

    if (!catalogPath) {
        const needsCatalog = ['specify', 'plan', 'implement'];
        outputChannel.appendLine(`[SDD] ⚠️ Catálogo externo não encontrado. Fases 'specify', 'plan' e 'implement' não estarão disponíveis.`);
        if (needsCatalog.includes(command)) {
            const msg = '❌ Catálogo não encontrado. Aponte para a pasta /catalog do seu Hub para usar esta fase.';
            outputChannel.appendLine(`[SDD] ❌ Caminhos testados:\n  - ${rootPath}\\catalog\n  - ${rootPath}\\agentes_foursys\\catalog`);
            if (chatResponse) chatResponse.markdown(msg);
            else {
                const select = 'Selecionar Pasta do Catálogo';
                vscode.window.showErrorMessage(msg, select).then(selection => {
                    if (selection === select) {
                        vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, openLabel: 'Selecionar Catálogo' }).then(uris => {
                            if (uris && uris[0]) {
                                context.globalState.update('catalogPath', uris[0].fsPath);
                                vscode.window.showInformationMessage(`✅ Catálogo salvo! Clique novamente no botão da fase.`);
                            }
                        });
                    }
                });
            }
            return;
        }
        // constitution e tasks continuam com playbooks embutidos
    }

    const docPath = getDocPath(rootPath);
    let playbookPath = '';
    let outputPath = '';
    let contextFiles: string[] = [];
    let taskName = '';
    let isDev = false;

    // Playbooks embutidos no plugin (sempre disponíveis)
    const builtinSDD = context.extensionUri.fsPath;

    switch (command) {
        case 'constitution':
            playbookPath = path.join(builtinSDD, 'catalog', 'sdd', 'foursys-constitution.md');
            outputPath = path.join(docPath, 'constitution.md');
            taskName = 'Criação da Constituição';
            break;
        case 'specify':
            if (catalogPath) playbookPath = path.join(catalogPath, 'playbook', 'fase1_refinamento_negocio', 'FASE1_REFINAMENTO_NEGOCIO.md');
            outputPath = path.join(docPath, 'user_story.md');
            contextFiles = [path.join(docPath, 'constitution.md')];
            taskName = 'Especificação (Specify)';
            break;
        case 'plan':
            if (catalogPath) playbookPath = path.join(catalogPath, 'playbook', 'fase2_desenho_tecnico', 'FASE2_ESPECIFICACAO_TECNICA.md');
            outputPath = path.join(docPath, 'implementation_plan.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'user_story.md')];
            taskName = 'Planejamento (Plan)';
            break;
        case 'tasks':
            playbookPath = path.join(builtinSDD, 'catalog', 'sdd', 'foursys-tasks.md');
            outputPath = path.join(docPath, 'task_list.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'implementation_plan.md')];
            taskName = 'Quebra de Tarefas (Tasks)';
            break;
        case 'implement':
            const storyPath = path.join(docPath, 'user_story.md');
            const tech = detectTechnology(storyPath);
            if (catalogPath) playbookPath = findAgentSkill(catalogPath, tech || '') || '';
            outputPath = path.join(docPath, 'output_desenvolvimento.md');
            contextFiles = [path.join(docPath, 'constitution.md'), path.join(docPath, 'implementation_plan.md'), path.join(docPath, 'task_list.md')];
            taskName = 'Implementação Física';
            isDev = true;
            break;
    }

    outputChannel.appendLine(`[SDD] 📄 Playbook: ${playbookPath}`);
    outputChannel.appendLine(`[SDD] ✅ Playbook existe: ${playbookPath ? fs.existsSync(playbookPath) : false}`);

    if (!playbookPath || !fs.existsSync(playbookPath)) {
        const msg = `❌ Playbook não encontrado: ${playbookPath || '(vazio)'}\n\nCrie a pasta catalog/playbook/sdd/ com os arquivos foursys-constitution.md e foursys-tasks.md.`;
        outputChannel.appendLine(`[SDD] ❌ ERRO: Playbook ausente.`);
        if (chatResponse) chatResponse.markdown(msg);
        else vscode.window.showErrorMessage(msg);
        return;
    }

    if (playbookPath && fs.existsSync(playbookPath)) {
        if (chatResponse) chatResponse.markdown(`🔄 **Foursys SDD**: Iniciando **${taskName}**...`);
        
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

                let finalPrompt = userContext || 'Inicie a tarefa agora.';
                if (isDev) {
                    finalPrompt = `DESENVOLVA O CÓDIGO SEGUINDO A LISTA DE TAREFAS E A CONSTITUIÇÃO.\n${userContext}`;
                }

                const fullText = await AIClient.sendPrompt(systemPrompt, finalPrompt, outputChannel);
                if (chatResponse) chatResponse.markdown(fullText);
                
                if (isDev) {
                    const filesCreated = extractAndSaveFiles(fullText, rootPath, outputChannel);
                    if (chatResponse) chatResponse.markdown(`\n\n🚀 **SDD Implement Concluído!** ${filesCreated} arquivos gerados.`);
                    else vscode.window.showInformationMessage(`🚀 SDD: ${filesCreated} arquivos gerados.`);
                } else {
                    fs.writeFileSync(outputPath, fullText);
                    const msg = `✅ Artefato salvo: doc_projeto/${path.basename(outputPath)}`;
                    if (chatResponse) chatResponse.markdown(`\n\n${msg}`);
                    else vscode.window.showInformationMessage(msg);
                }
            } catch (error: any) {
                if (chatResponse) chatResponse.markdown(`❌ Erro: ${error.message}`);
                else vscode.window.showErrorMessage(`Erro: ${error.message}`);
            }
        });
    }
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
        let filePath = match[1].trim();
        let code = match[2].trim().replace(/```[\w]*\s*$/, '').trim();
        const fullPath = path.isAbsolute(filePath) ? filePath : path.join(rootPath, filePath);
        const dir = path.dirname(fullPath);
        try {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
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
