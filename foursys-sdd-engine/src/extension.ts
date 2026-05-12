import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AIClient } from './ai-client';
import { loadPlaybook, detectTechnology, findAgentSkill, findCatalogPath, getAvailableSkills, findSkillPlaybook } from './catalog-loader';
import { FoursysSDDSidebarProvider } from './sidebar-provider';

// ============================================================
// Foursys SDD Engine V1.2.7 - O MAESTRO DA ENGENHARIA (Dynamic Skills)
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
    outputChannel.appendLine('[Foursys SDD] Motor V1.2.7 Online!');

    const agentes = vscode.chat.createChatParticipant('foursys_sdd', async (request, chatContext, response, token) => {
        let referencesContext = '';
        for (const ref of request.references) {
            if (ref.value instanceof vscode.Uri) {
                try {
                    const doc = await vscode.workspace.openTextDocument(ref.value);
                    referencesContext += `\n--- REFERENCIA EXTERNA: ${path.basename(ref.value.fsPath)} ---\n${doc.getText()}\n`;
                } catch (e) {}
            }
        }
        await executeSDDPhase(request.command || '', request.prompt, referencesContext, response, context, outputChannel);
    });

    agentes.iconPath = vscode.Uri.joinPath(context.extensionUri, 'resources', 'logo.png');
    context.subscriptions.push(agentes);

    context.subscriptions.push(vscode.commands.registerCommand('foursys.constitution', () => executeSDDPhase('constitution', '', '', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.specify', () => executeSDDPhase('specify', '', '', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.plan', () => executeSDDPhase('plan', '', '', null, context, outputChannel)));
    context.subscriptions.push(vscode.commands.registerCommand('foursys.tasks', () => executeSDDPhase('tasks', '', '', null, context, outputChannel)));
    
    context.subscriptions.push(vscode.commands.registerCommand('foursys.implement', () => {
        vscode.commands.executeCommand('workbench.action.chat.open', { 
            query: '@foursys_sdd /implement ' 
        });
    }));

    const sidebarProvider = new FoursysSDDSidebarProvider(context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(FoursysSDDSidebarProvider.viewType, sidebarProvider));
}

async function executeSDDPhase(command: string, userInstruction: string, referencesContext: string, chatResponse: vscode.ChatResponseStream | null, context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
    const rootPath = getWorkspaceRoot();
    if (!rootPath) return;

    const savedPath = context.globalState.get<string>('catalogPath');
    const catalogPath = findCatalogPath(rootPath, savedPath || '');
    const docPath = getDocPath(rootPath);
    const builtinSDD = context.extensionUri.fsPath;

    outputChannel.show(true);
    outputChannel.appendLine(`\n[SDD] ▶ Iniciando: ${command}`);

    if (chatResponse) { chatResponse.markdown(`🔄 **Foursys SDD**: Iniciando fase **${command.toUpperCase()}**...\n\n`); }

    let playbookPath = '';
    let outputPath = '';
    let contextFiles: string[] = [];
    let isDev = false;

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

            // 1. Tenta encontrar se o usuário já especificou uma SKILL no prompt
            const skillMatch = userInstruction.match(/SKILL_[^\s]+/i);
            if (skillMatch) {
                playbookPath = findSkillPlaybook(catalogPath || '', skillMatch[0]) || '';
            }

            // 2. Se não achou Skill, tenta o Agente via Referência
            if (!playbookPath) {
                const agentMatch = referencesContext.match(/--- REFERENCIA EXTERNA: (AGENTE_[^\s]+)\.md ---/i);
                if (agentMatch) {
                    const agentName = agentMatch[1].toLowerCase().replace('agente_', '');
                    playbookPath = findAgentSkill(catalogPath || '', agentName) || '';
                }
            }

            // 3. Se ainda não achou, tenta detectar a tecnologia
            let tech = '';
            if (!playbookPath) {
                const storyPath = path.join(docPath, 'user_story.md');
                tech = detectTechnology(storyPath) || '';
                const lowerPrompt = userInstruction.toLowerCase();
                if (lowerPrompt.includes('java')) tech = 'spring_boot';
                if (lowerPrompt.includes('angular')) tech = 'angular';
                if (lowerPrompt.includes('cobol')) tech = 'cobol';
                
                // Se detectou a tech mas o usuário não deu ordens, mostra o Menu de Skills
                if (tech && userInstruction.trim() === '' && referencesContext === '') {
                    const skills = getAvailableSkills(catalogPath || '', tech);
                    if (chatResponse) {
                        const agentName = tech.toUpperCase().replace('_', ' ');
                        chatResponse.markdown(`Olá! Sou o **AGENTE_${tech.toUpperCase()}_FOURSYS**. Qual Skill ou Component Pattern do Hub você deseja que eu utilize para esta tarefa?\n\n`);
                        if (skills.length > 0) {
                            chatResponse.markdown(`**Skills disponíveis:**\n${skills.map(s => `* \`#${s}\``).join('\n')}`);
                        } else {
                            chatResponse.markdown(`*(Nenhuma skill específica encontrada, usarei o Agente base)*`);
                        }
                    }
                    return;
                }
                playbookPath = findAgentSkill(catalogPath || '', tech) || '';
            }

            // Se nada foi encontrado, pede ajuda
            if (!playbookPath) {
                if (chatResponse) {
                    chatResponse.markdown(`Sou seu **AGENTE_FOURSYS** de desenvolvimento, Qual Skill deseja usar **JAVA, ANGULAR ou COBOL**?\n\n`);
                    chatResponse.markdown(`🚀 digite o \`/implement\` e chame a skill que precisa e peça a ela o que precisa desenvolver.`);
                }
                return;
            }
            break;
    }

    if (command === 'specify' && userInstruction.trim() === '') {
        const fileExists = fs.existsSync(outputPath);
        const content = fileExists ? fs.readFileSync(outputPath, 'utf8') : '';
        if (!fileExists || content.trim() === '' || content.includes('DESCREVA AQUI')) {
            const template = `# User Story\n\n**TECNOLOGIA:** [Angular / Spring Boot / COBOL]\n\n**NECESSIDADE:**\nDESCREVA AQUI o que você precisa construir...`;
            fs.writeFileSync(outputPath, template);
            await openFile(outputPath);
            if (chatResponse) { chatResponse.markdown('📝 Por favor, descreva sua necessidade no arquivo `user_story.md` e rode o comando novamente.'); }
            return;
        }
    }

    if (!playbookPath || !fs.existsSync(playbookPath)) {
        if (chatResponse) { chatResponse.markdown(`⚠️ Agente ou Playbook não encontrado.`); }
        return;
    }

    try {
        const playbookName = path.basename(playbookPath, '.md');
        outputChannel.appendLine(`[SDD] 🧠 Usando Playbook: ${playbookName}`);

        const systemPromptRaw = loadPlaybook(playbookPath);
        // INJEÇÃO DE ADRENALINA: Instrução agressiva para evitar intros e conversas fiadas
        const systemPrompt = `VOCÊ É O MAESTRO DA ENGENHARIA FOURSYS. 
FOCO: EXECUÇÃO TÉCNICA PURA. 
REGRAS: 
1. IGNORE QUALQUER SAUDAÇÃO OU INTRODUÇÃO DO PLAYBOOK ABAIXO.
2. NÃO SE APRESENTE. NÃO DIGA "OLÁ" OU "ENTENDIDO".
3. VÁ DIRETO PARA A GERAÇÃO DOS ARQUIVOS USANDO O PADRÃO // FILEPATH: ...
4. ANTES DE CADA BLOCO DE CÓDIGO, ESCREVA UMA LINHA DIZENDO O QUE ESTÁ FAZENDO (Ex: "Implementando Service de Usuários...").

PLAYBOOK BASE:
${systemPromptRaw}`;

        let userContext = referencesContext; 
        contextFiles.forEach(file => {
            if (fs.existsSync(file)) {
                userContext += `\n--- ARQUIVO DO PROJETO: ${path.basename(file)} ---\n${fs.readFileSync(file, 'utf8')}\n`;
            }
        });

        const instruction = userInstruction.trim() !== '' ? `INSTRUÇÃO ADICIONAL DO DESENVOLVEDOR: ${userInstruction}\n\n` : '';
        let finalPrompt = '';

        if (isDev) {
            finalPrompt = `${instruction}ESCREVA O CÓDIGO COMPLETO AGORA SEGUINDO A TASK LIST. 
CONTEXTO:\n${userContext}`;
        } else {
            finalPrompt = `${instruction}GERE O ARQUIVO MD COMPLETO. 
CONTEXTO:\n${userContext}`;
        }

        if (chatResponse) { chatResponse.progress('IA trabalhando na sua solicitação...'); }

        const fullText = await AIClient.sendPrompt(systemPrompt, finalPrompt, outputChannel, (chunk) => {
            if (chatResponse) { chatResponse.markdown(chunk); }
        });

        if (isDev) {
            const filesCreated = extractAndSaveFiles(fullText, rootPath, outputChannel);
            if (filesCreated > 0 && chatResponse) { 
                chatResponse.markdown(`\n\n🚀 **Implementação Finalizada!** ${filesCreated} arquivos foram atualizados no seu workspace.`); 
            }
        } else {
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
