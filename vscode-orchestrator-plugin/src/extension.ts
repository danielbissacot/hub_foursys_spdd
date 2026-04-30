import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { HubSidebarProvider } from './sidebar-provider';
import { AIClient } from './ai-client';

export function activate(context: vscode.ExtensionContext) {
    const sidebarProvider = new HubSidebarProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(HubSidebarProvider.viewType, sidebarProvider)
    );

    let disposable1 = vscode.commands.registerCommand('hub.runPhase1', async () => {
        await executePhase("AGENTE_NEGOCIO_FOURSYS", "user_story.md", "Fase 1: Refinamento", ".md", context);
    });

    let disposable2 = vscode.commands.registerCommand('hub.runPhase2', async () => {
        await executePhase("AGENTE_ARQUITETO_FOURSYS", "output_agente_negocio_foursys.md", "Fase 2: Desenho Técnico", ".md", context);
    });

    let disposable3 = vscode.commands.registerCommand('hub.runPhase3', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) return;
        const rootPath = workspaceFolders[0].uri.fsPath;
        
        // Verifica dinamicamente se é Angular (package.json) ou Java (pom.xml)
        const isAngular = fs.existsSync(path.join(rootPath, 'package.json'));
        
        const agentName = isAngular ? "AGENTE_DESENVOLVEDOR_ANGULAR" : "AGENTE_DESENVOLVEDOR_JAVA";
        const inputContext = "output_agente_arquiteto_foursys.md";
        const ext = isAngular ? ".ts" : ".java";

        await executePhase(agentName, inputContext, "Fase 3: Desenvolvimento", ext, context);
    });

    context.subscriptions.push(disposable1, disposable2, disposable3);
}

function detectProjectContext(rootPath: string): string {
    if (fs.existsSync(path.join(rootPath, 'pom.xml'))) {
        return "Java Spring Boot Project";
    } else if (fs.existsSync(path.join(rootPath, 'package.json'))) {
        return "Node/Angular Project";
    } else if (fs.existsSync(path.join(rootPath, 'cobol'))) {
        return "COBOL Legacy System";
    }
    return "Tecnologia não identificada automaticamente.";
}

async function executePhase(agentName: string, inputContextFile: string, phaseName: string, expectedOutputExtension: string, context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('Abra uma pasta no VS Code para executar o Hub.');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const globalStoragePath = context.globalStorageUri.fsPath;
    const inputPath = path.join(rootPath, inputContextFile);

    if (!fs.existsSync(inputPath)) {
        if (phaseName.includes("Fase 1")) {
            const template = `# História de Usuário / Requisito\n\n**Título:** [Insira o título aqui]\n\n**Descrição:**\nComo um [ator],\nEu quero [ação],\nPara que [valor].\n\n**Critérios de Aceite:**\n- [ ] Critério 1\n`;
            fs.writeFileSync(inputPath, template);
            const doc = await vscode.workspace.openTextDocument(inputPath);
            await vscode.window.showTextDocument(doc, { preview: false });
            vscode.window.showWarningMessage(`Criei um template para '${inputContextFile}'. Preencha e clique na Fase 1 novamente.`);
            return;
        } else {
            vscode.window.showErrorMessage(`O arquivo base '${inputContextFile}' não foi encontrado. Você executou a fase anterior?`);
            return;
        }
    }

    const doc = await vscode.workspace.openTextDocument(inputPath);
    await vscode.window.showTextDocument(doc, { preview: false });

    let welcomeMsg = `Arquivo '${inputContextFile}' pronto. Clique em Pronto quando quiser que o Agente atue.`;
    const ready = await vscode.window.showInformationMessage(welcomeMsg, "Estou Pronto!", "Cancelar");
    if (ready !== "Estou Pronto!") return;

    const contextContent = fs.readFileSync(inputPath, 'utf8');
    const projectContext = detectProjectContext(rootPath);
    const hasMockup = fs.existsSync(path.join(rootPath, 'ui_mockup.png'));

    let rulePath = "";
    if (phaseName.includes("Fase 1")) {
        rulePath = path.join(globalStoragePath, "agentes_foursys", "catalog", "playbook", "fase1_refinamento_negocio", "FASE1_REFINAMENTO_NEGOCIO.md");
    } else if (phaseName.includes("Fase 2")) {
        rulePath = path.join(globalStoragePath, "agentes_foursys", "catalog", "playbook", "fase2_desenho_tecnico", "FASE2_ESPECIFICACAO_TECNICA.md");
    } else {
        let skillFile = "spring_boot/AGENTE_SPRING_FOURSYS.md";
        if (agentName === "AGENTE_DESENVOLVEDOR_ANGULAR") skillFile = "angular/AGENTE_ANGULAR_FOURSYS.md";
        rulePath = path.join(globalStoragePath, "agentes_foursys", "catalog", "agents_skills", skillFile);
    }

    let globalRules = "Siga o Clean Code e melhores práticas corporativas.";
    try {
        if (fs.existsSync(rulePath)) {
            globalRules = fs.readFileSync(rulePath, 'utf8');
        }
    } catch (e) {
        console.error(e);
    }

    let extraInstruction = "";
    if (phaseName.includes("Fase 3")) {
        extraInstruction = "\n\nIMPORTANTE PARA A FASE 3: Gere APENAS blocos de código-fonte (sem textos explicativos antes ou depois). Inicie o conteúdo de CADA arquivo com um comentário contendo o caminho relativo de onde ele deve ser salvo no projeto. Exemplo prático: `// FILEPATH: src/main/java/com/foursys/Main.java` ou `// FILEPATH: src/app/login/login.component.ts`. Use a tag Markdown ``` para isolar o código.";
    }

    const finalPrompt = contextContent + extraInstruction;

    const outputChannel = vscode.window.createOutputChannel("AI Governance Hub");
    outputChannel.show(true);
    outputChannel.appendLine(`[Iniciando ${agentName}...]\n`);

    try {
        const generatedContent = await AIClient.sendPromptToCopilot(
            agentName, 
            finalPrompt, 
            globalRules, 
            projectContext, 
            hasMockup,
            async (chunk) => {
                outputChannel.append(chunk);
            }
        );

        outputChannel.appendLine("\n\n[Finalizado. Salvando arquivo...]");

        let savedFiles: string[] = [];
        
        if (phaseName.includes("Fase 3")) {
            // Regex procura por blocos de código e tenta capturar o comentário FILEPATH na primeira linha
            const codeBlockRegex = /```[\w]*\n(?:(?:\/\/|\/\*|<!--)?\s*(?:FILEPATH|PATH|Arquivo):\s*([^\n]+)\n)?([\s\S]*?)```/gi;
            let match;
            let fileCount = 0;
            
            while ((match = codeBlockRegex.exec(generatedContent)) !== null) {
                let filePath = match[1] ? match[1].trim() : `src/generated/output_codigo_${fileCount}${expectedOutputExtension}`;
                // Remove qualquer comentário que possa ter sobrado no final da linha (ex: --> ou */)
                filePath = filePath.replace(/(-->|\*\/)$/, '').trim();
                
                const codeContent = match[2].trim();
                
                const fullPath = path.join(rootPath, filePath);
                const dirPath = path.dirname(fullPath);
                
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }
                
                fs.writeFileSync(fullPath, codeContent);
                savedFiles.push(fullPath);
                fileCount++;
            }
            
            // Fallback se a IA não gerou em blocos mapeáveis
            if (savedFiles.length === 0) {
                const fallbackPath = path.join(rootPath, `src/generated/output_${agentName.toLowerCase()}${expectedOutputExtension}`);
                const dirPath = path.dirname(fallbackPath);
                if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
                fs.writeFileSync(fallbackPath, generatedContent);
                savedFiles.push(fallbackPath);
            }
        } else {
            const outputPath = path.join(rootPath, `output_${agentName.toLowerCase()}${expectedOutputExtension}`);
            fs.writeFileSync(outputPath, generatedContent);
            savedFiles.push(outputPath);
        }

        for (const file of savedFiles) {
            const outDoc = await vscode.workspace.openTextDocument(file);
            await vscode.window.showTextDocument(outDoc, { preview: false, viewColumn: vscode.ViewColumn.Active });
        }

        vscode.window.showInformationMessage(`✨ ${phaseName} concluída! Verifique o arquivo gerado.`);

        // Opção C: Dispara o Chat Lateral para dar o efeito "Wow" da PoC
        const mainGeneratedFile = savedFiles.length > 0 ? savedFiles[0] : `output_${agentName.toLowerCase()}${expectedOutputExtension}`;
        const filename = path.basename(mainGeneratedFile);
        const chatQuery = `@workspace Acabei de gerar o arquivo \`${filename}\` através do AI Governance Hub Foursys (${phaseName}). Faça um resumo rápido (máximo 3 bullets) sobre o que foi gerado neste arquivo.`;
        
        try {
            await vscode.commands.executeCommand('workbench.action.chat.open', { query: chatQuery });
        } catch(chatErr) {
            console.log("Chat panel não pôde ser aberto", chatErr);
        }
    } catch (e: any) {
        outputChannel.appendLine(`\n[AVISO]: ${e.message}`);
        outputChannel.appendLine(`\nComo a Inteligência Artificial atual não permite integração direta, abrindo modo manual...`);
        
        const promptCompleto = `Atue como ${agentName}. Siga as regras corporativas abaixo:
---
${globalRules}
---
[CONTEXTO TÉCNICO: ${projectContext}]
${hasMockup ? "IMPORTANTE: Existe um 'ui_mockup.png'. Siga o layout visual." : ""}

Tarefa: Baseado no documento a seguir, execute sua fase do SDD. Retorne APENAS o conteúdo final (Código puro ou Markdown).

[DOCUMENTO DE ENTRADA]
${contextContent}`;

        try { await vscode.env.clipboard.writeText(promptCompleto); } catch (err) {}
        
        const promptDoc = await vscode.workspace.openTextDocument({
            content: promptCompleto,
            language: "markdown"
        });
        await vscode.window.showTextDocument(promptDoc, { preview: false, viewColumn: vscode.ViewColumn.Beside });

        vscode.window.showWarningMessage(`Automação bloqueada pela LLM atual. Copie o texto da aba ao lado e cole no Chat!`);
    }
}

export function deactivate() {}
