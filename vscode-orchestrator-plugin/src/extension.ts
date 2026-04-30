import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { HubSidebarProvider } from './sidebar-provider';
import { AIClient } from './ai-client';

export function activate(context: vscode.ExtensionContext) {
    const sidebarProvider = new HubSidebarProvider(context);
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
        
        const projectContext = detectProjectContext(rootPath);
        const agentName = projectContext.includes("Angular") ? "AGENTE_DESENVOLVEDOR_ANGULAR" : "AGENTE_DESENVOLVEDOR_JAVA";
        const inputContext = "output_agente_arquiteto_foursys.md";
        const ext = projectContext.includes("Angular") ? ".ts" : ".java";

        await executePhase(agentName, inputContext, "Fase 3: Desenvolvimento", ext, context);
    });

    let disposable4 = vscode.commands.registerCommand('hub.runPhase4', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) return;
        const rootPath = workspaceFolders[0].uri.fsPath;

        const projectContext = detectProjectContext(rootPath);
        const agentName = projectContext.includes("Angular") ? "AGENTE_DESENVOLVEDOR_ANGULAR" : "AGENTE_DESENVOLVEDOR_JAVA";
        const inputContext = "output_agente_arquiteto_foursys.md";
        const ext = projectContext.includes("Angular") ? ".spec.ts" : "Test.java";
        await executePhase(agentName, inputContext, "Fase 4: Garantia de Qualidade", ext, context);
    });

    context.subscriptions.push(disposable1, disposable2, disposable3, disposable4);
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
            const template = `# História de Usuário / Requisito\n\n**Título:** [Insira o título aqui]\n\n**Descrição:**\nComo um [ator],\nEu quero [ação],\nPara que [valor].\n\n**Critérios de Aceite:**\n- [ ] Critério 1\n\n> 💡 **Dica Frontend:** Se este requisito for uma Tela/Interface, descreva os componentes visuais acima e salve um print com o nome \`ui_mockup.png\` na pasta do projeto para usarmos no final!\n`;
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

    let welcomeMsg = `Arquivo '${inputContextFile}' aberto. Certifique-se de SALVAR (Ctrl+S) antes de continuar.`;
    const ready = await vscode.window.showInformationMessage(welcomeMsg, "Estou Pronto!", "Cancelar");
    if (ready !== "Estou Pronto!") return;

    const contextContent = fs.readFileSync(inputPath, 'utf8');
    const projectContext = detectProjectContext(rootPath);
    const hasMockup = fs.existsSync(path.join(rootPath, 'ui_mockup.png'));

    let rulePath = "";
    let instructionPath = ""; // Instructions complementares por tecnologia
    if (phaseName.includes("Fase 1")) {
        rulePath = path.join(globalStoragePath, "agentes_foursys", "catalog", "playbook", "fase1_refinamento_negocio", "FASE1_REFINAMENTO_NEGOCIO.md");
    } else if (phaseName.includes("Fase 2")) {
        rulePath = path.join(globalStoragePath, "agentes_foursys", "catalog", "playbook", "fase2_desenho_tecnico", "FASE2_ESPECIFICACAO_TECNICA.md");
    } else {
        // Fase 3 e 4: carrega o Skill do Agente + Instruction da Tecnologia
        let skillFile = "spring_boot/AGENTE_SPRING_FOURSYS.md";
        if (agentName === "AGENTE_DESENVOLVEDOR_ANGULAR") skillFile = "angular/AGENTE_ANGULAR_FOURSYS.md";
        rulePath = path.join(globalStoragePath, "agentes_foursys", "catalog", "agents_skills", skillFile);

        // Seleciona a Instruction complementar
        if (phaseName.includes("Fase 4")) {
            instructionPath = path.join(globalStoragePath, "agentes_foursys", "catalog", "instructions", "TESTING_PATTERNS.md");
        } else if (agentName === "AGENTE_DESENVOLVEDOR_ANGULAR") {
            instructionPath = path.join(globalStoragePath, "agentes_foursys", "catalog", "instructions", "ANGULAR_FRONTEND.md");
        } else {
            instructionPath = path.join(globalStoragePath, "agentes_foursys", "catalog", "instructions", "HEXAGONAL_JAVA.md");
        }
    }

    let globalRules = "Siga o Clean Code e melhores práticas corporativas.";
    try {
        if (fs.existsSync(rulePath)) {
            let rules = fs.readFileSync(rulePath, 'utf8');
            // Remove a saudação obrigatória e o modo tutor que forçam a IA a falar em vez de programar
            rules = rules.replace(/>\s*\[!IMPORTANT\][\s\S]*?COMPORTAMENTO DE INÍCIO DE TURNO[\s\S]*?".*?"/g, "");
            rules = rules.replace(/>\s*\*.*?\*: Você é um (tutor|mentor)[\s\S]*?\./g, "");
            rules = rules.replace(/Deseja que eu divida esta entrega técnica em Sub-Tarefas[\s\S]*?\?/g, "");
            globalRules = rules;
        }
        // Concatena a Instruction complementar (se existir)
        if (instructionPath && fs.existsSync(instructionPath)) {
            globalRules += "\n\n---\n[INSTRUÇÃO COMPLEMENTAR DE GOVERNANÇA]\n" + fs.readFileSync(instructionPath, 'utf8');
        }
    } catch (e) {
        console.error(e);
    }

    let extraInstruction = "";
    if (phaseName.includes("Fase 1")) {
        extraInstruction = "\n\nIMPORTANTE: Defina claramente as Interfaces/Modelos de Dados necessários para este requisito.";
    } else if (phaseName.includes("Fase 2")) {
        extraInstruction = "\n\nIMPORTANTE: Detalhe as propriedades de cada Interface/Classe necessária para a arquitetura.";
    } else if (phaseName.includes("Fase 3")) {
        const isAngular = projectContext.includes("Angular");
        if (isAngular) {
            extraInstruction = "\n\n⚠️ REGRAS CRÍTICAS DE SOBREVIVÊNCIA (FASE 3 - ANGULAR):\n" +
                "1. ARQUIVO ÚNICO: Gere ABSOLUTAMENTE TUDO (template, styles, interfaces, lógica) dentro de `src/app/app.component.ts`.\n" +
                "2. NO LIBRARIES: NÃO use Chart.js, Bootstrap ou qualquer lib externa. Use CSS puro e SVG para gráficos.\n" +
                "3. FILEPATH OBRIGATÓRIO: A primeira linha do bloco de código deve ser `// FILEPATH: src/app/app.component.ts`.\n" +
                "4. SINTAXE MODERNA: Use `@if`, `@for (item of list; track item.id)`, `signal()`, e `standalone: true`.\n" +
                "5. SEM IMPORTS EXTERNOS: Não importe componentes de pastas que não existem. Se precisar de um componente, defina-o como classe no mesmo arquivo.\n" +
                "6. API CALLS: NÃO use `HttpClient`. Use `fetch()` nativo ou dados mockados para evitar erros de Provider.";
        } else {
            extraInstruction = "\n\n⚠️ REGRAS OBRIGATÓRIAS (FASE 3 - JAVA):\n" +
                "REGRA 1: A PRIMEIRA LINHA dentro de cada bloco de código DEVE ser: `// FILEPATH: caminho/do/arquivo.java`\n" +
                "REGRA 2: Siga a estrutura Hexagonal (core/port/adapter).\n" +
                "REGRA 3: Gere todos os arquivos necessários (Controller, UseCase, Port, DTO).";
        }
    } else if (phaseName.includes("Fase 4")) {
        const tech = projectContext.includes("Angular") ? "Jasmine/Karma" : "JUnit/Mockito";
        extraInstruction = `\n\n🧪 INSTRUÇÃO FASE 4 (TESTES): Atue como Engenheiro de QA. Baseado na arquitetura, gere APENAS os testes unitários utilizando ${tech}. Inicie cada arquivo com \`// FILEPATH: caminho/do/arquivo\`. Não explique o código, apenas gere os testes.`;
    }

    const outputChannel = vscode.window.createOutputChannel("AI Governance Hub");
    outputChannel.show(true);
    outputChannel.appendLine(`[Iniciando ${agentName}...]`);
    outputChannel.appendLine(`[Regras Carregadas de: ${path.basename(rulePath)}]`);
    outputChannel.appendLine(`[Início das Regras: ${globalRules.substring(0, 100).replace(/\n/g, ' ')}...]`);
    if (instructionPath) outputChannel.appendLine(`[Instrução Carregada de: ${path.basename(instructionPath)}]`);
    outputChannel.appendLine(`---`);

    const globalSafetyRule = "\n\n🚨 REGRA DE OURO ABSOLUTA:\n" +
        "1. NÃO use bibliotecas externas (Chart.js, Bootstrap, etc.). Use APENAS CSS/SVG.\n" +
        "2. Gere UM ÚNICO ARQUIVO `src/app/app.component.ts`.\n" +
        (hasMockup ? "3. 🖼️ MOCKUP DETECTADO: O arquivo 'ui_mockup.png' está anexado. SIGA O DESIGN E AS CORES DO MOCKUP FIELMENTE.\n" : "");
    
    // Prioridade máxima: Instruções de Sobrevivência e Regras de Governança no TOPO
    const finalRules = globalSafetyRule + "\n\n" + globalRules;
    const finalPrompt = "[DIRETIVAS OBRIGATÓRIAS]\n" + extraInstruction + globalSafetyRule + "\n\n[CONTEÚDO PARA PROCESSAR]\n" + contextContent;

    try {
        const generatedContent = await AIClient.sendPromptToCopilot(
            agentName, 
            finalPrompt, 
            finalRules, 
            projectContext, 
            hasMockup,
            async (chunk) => {
                outputChannel.append(chunk);
            }
        );

        outputChannel.appendLine("\n\n[Finalizado. Salvando arquivo...]");

        let savedFiles: string[] = [];
        
        if (phaseName.includes("Fase 3") || phaseName.includes("Fase 4")) {
            // Regex procura por blocos de código e tenta capturar o comentário FILEPATH na primeira linha
            const codeBlockRegex = /```[\w]*\n(?:(?:\/\/|\/\*|<!--)?\s*(?:FILEPATH|PATH|Arquivo):\s*([^\n]+)\n)?([\s\S]*?)```/gi;
            let match;
            let fileCount = 0;
            
            while ((match = codeBlockRegex.exec(generatedContent)) !== null) {
                let filePath = match[1] ? match[1].trim() : `src/generated/output_codigo_${fileCount}${expectedOutputExtension}`;
                // Remove qualquer comentário que possa ter sobrado no final da linha (ex: --> ou */)
                filePath = filePath.replace(/(-->|\*\/)$/, '').trim();
                
                let codeContent = match[2].trim();
                // Sanitizador: corrige erros comuns da IA antes de salvar
                codeContent = sanitizeGeneratedCode(codeContent);
                
                const fullPath = path.join(rootPath, filePath);
                const dirPath = path.dirname(fullPath);
                
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }
                
                fs.writeFileSync(fullPath, codeContent);
                savedFiles.push(fullPath);
                fileCount++;
            }
            
            // Fallback inteligente: salva no arquivo principal da tecnologia
            if (savedFiles.length === 0) {
                let fallbackPath: string;
                if (projectContext.includes("Angular")) {
                    fallbackPath = path.join(rootPath, 'src/app/app.component.ts');
                } else {
                    fallbackPath = path.join(rootPath, `src/generated/output_${agentName.toLowerCase()}${expectedOutputExtension}`);
                }
                const dirPath = path.dirname(fallbackPath);
                if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
                // Extrai apenas o código do bloco markdown, sem as crases
                let codeOnly = generatedContent.replace(/```[\w]*\n/g, '').replace(/```/g, '').trim();
                codeOnly = sanitizeGeneratedCode(codeOnly);
                fs.writeFileSync(fallbackPath, codeOnly);
                savedFiles.push(fallbackPath);
            }
        } else {
            const outputPath = path.join(rootPath, `output_${agentName.toLowerCase()}${expectedOutputExtension}`);
            // Limpa frases conversacionais que a IA insiste em colocar no final (com ou sem Markdown)
            let cleanContent = generatedContent;
            cleanContent = cleanContent.replace(/---\s*\n[*_]*Próximo passo:[\s\S]*$/gim, "");
            cleanContent = cleanContent.replace(/[*_]*Próximo passo:.*$/gim, "");
            cleanContent = cleanContent.replace(/[*_]*(Você gostaria|Deseja que eu|Precisa de mais|Posso ajudar|Alguma dúvida|Quer que eu).*\?[*_]*/gim, "");
            cleanContent = cleanContent.replace(/---\s*$/gm, "");
            cleanContent = cleanContent.trim();
            fs.writeFileSync(outputPath, cleanContent);
            savedFiles.push(outputPath);
        }

        // Pós-processamento: remove imports de arquivos que não existem no disco
        if (phaseName.includes("Fase 3") || phaseName.includes("Fase 4")) {
            for (const file of savedFiles) {
                if (file.endsWith('.ts')) {
                    removeDeadImports(file, rootPath);
                }
            }
        }

        for (const file of savedFiles) {
            const outDoc = await vscode.workspace.openTextDocument(file);
            await vscode.window.showTextDocument(outDoc, { preview: false, viewColumn: vscode.ViewColumn.Active });
        }

        let successMsg = `✨ ${phaseName} concluída! Verifique o arquivo gerado.`;
        if (phaseName.includes("Fase 1")) {
            successMsg = `✨ Fase 1 concluída! O refinamento foi salvo em '${path.basename(savedFiles[0])}'. Próximo passo: Clique em 'Fase 2: Desenho Técnico'.`;
        } else if (phaseName.includes("Fase 2")) {
            successMsg = `🏗️ Fase 2 concluída! A arquitetura foi salva em '${path.basename(savedFiles[0])}'. Próximo passo: Clique em 'Fase 3: Desenvolvimento'.`;
        } else if (phaseName.includes("Fase 3")) {
            const runCmd = projectContext.includes("Angular") ? "npm start" : "mvnw spring-boot:run";
            successMsg = `🛡️ Fase 3 concluída! O código foi injetado. Rode '${runCmd}' para validar e depois clique em 'Fase 4: Garantia de Qualidade'.`;
        } else if (phaseName.includes("Fase 4")) {
            const runCmd = projectContext.includes("Angular") ? "npm start" : "mvnw spring-boot:run";
            successMsg = `🧪 Fase 4 concluída! Os testes foram gerados. Agora você pode rodar a aplicação com: ${runCmd}`;
        }

        vscode.window.showInformationMessage(successMsg);

        // Opção C: Dispara o Chat Lateral para dar o efeito "Wow" da PoC
        const mainGeneratedFile = savedFiles.length > 0 ? savedFiles[0] : `output_${agentName.toLowerCase()}${expectedOutputExtension}`;
        const filename = path.basename(mainGeneratedFile);
        let chatQuery = `@workspace Acabei de gerar o arquivo \`${filename}\` através do AI Governance Hub Foursys (${phaseName}). Faça um resumo rápido (máximo 3 bullets) sobre o que foi gerado neste arquivo.`;
        
        if (phaseName.includes("Fase 3") && projectContext.includes("Angular")) {
            chatQuery += `\n\n💡 *Dica:* Se você tem o print/Figma da tela, arraste a imagem para dentro desta caixa de Chat agora e peça: "Gere o HTML/CSS igual a esta imagem!"`;
        }

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

/**
 * Sanitizador: corrige erros comuns gerados pela IA antes de salvar o arquivo.
 */
function sanitizeGeneratedCode(code: string): string {
    // Angular: corrige QUALQUER variação de 'component' minúsculo em imports do @angular/core
    code = code.replace(
        /import\s*\{([^}]*)\}\s*from\s*['"]@angular\/core['"]/g,
        (match, imports) => {
            const fixed = imports.replace(/\bcomponent\b/gi, 'Component')
                                 .replace(/\bngmodule\b/gi, 'NgModule')
                                 .replace(/\binput\b/g, 'Input')
                                 .replace(/\boutput\b/g, 'Output')
                                 .replace(/\binjectable\b/gi, 'Injectable')
                                 .replace(/\bsignal\b/g, 'signal');
            return `import {${fixed}} from '@angular/core'`;
        }
    );

    // Angular: corrige decorador com case errado
    code = code.replace(/@component\s*\(/gi, "@Component(");
    code = code.replace(/@ngmodule\s*\(/gi, "@NgModule(");
    code = code.replace(/@injectable\s*\(/gi, "@Injectable(");
    
    // Angular: corrige acesso a $event.target.value para evitar erro de tipo
    code = code.replace(/\(\$event\.target\)\.value/g, "($any($event.target)).value");
    code = code.replace(/\$event\.target\.value/g, "$any($event.target).value");

    // Angular: garante import de ChangeDetectionStrategy se usado
    if (code.includes("ChangeDetectionStrategy.OnPush") && !code.includes("ChangeDetectionStrategy")) {
        code = code.replace(/import\s*\{([^}]*)\}\s*from\s*['"]@angular\/core['"]/, (m, i) => `import {${i}, ChangeDetectionStrategy} from '@angular/core'`);
    }

    // Angular: remove modificador 'private' de propriedades para garantir acesso pelo template
    code = code.replace(/\bprivate\b\s+((?!readonly|async|constructor)\w+)/g, "public $1");
    
    // Angular: corrige @for com 'let' (sintaxe inválida no Angular 18+)
    code = code.replace(/@for\s*\(\s*let\s+(\w+)\s+of\s+/g, "@for ($1 of ");
    
    // Angular: adiciona 'track' apenas se ele REALMENTE estiver ausente
    code = code.replace(/@for\s*\(\s*(\w+)\s+of\s+([^;{]+)\)\s*\{/g, (match, item, list) => {
        const listContent = list.trim();
        if (listContent.includes(';') || listContent.includes('track ')) {
            return match;
        }
        
        let cleanList = listContent;
        if (cleanList.endsWith(')')) {
            const openCount = (match.match(/\(/g) || []).length;
            const closeCount = (match.match(/\)/g) || []).length;
            if (closeCount > openCount) {
                cleanList = cleanList.substring(0, cleanList.length - 1);
            }
        }
        return `@for (${item} of ${cleanList.trim()}; track ${item}) {`;
    });
    
    // Angular: corrige alucinações de diretivas (IA às vezes esquece o 'ng')
    code = code.replace(/\*if="/g, '*ngIf="');
    code = code.replace(/\*for="/g, '*ngFor="');

    // Angular: garante o CommonModule se usar a sintaxe clássica (*ngIf, *ngFor)
    if (code.includes("*ngIf") || code.includes("*ngFor")) {
        if (!code.includes("@angular/common")) {
            code = "import { CommonModule } from '@angular/common';\n" + code;
        }
        if (code.includes("imports: [")) {
            if (!code.includes("CommonModule")) {
                code = code.replace(/imports:\s*\[/, "imports: [CommonModule, ");
            }
        } else {
            code = code.replace(/standalone:\s*true/, "standalone: true,\n  imports: [CommonModule]");
        }
    }

    // Angular: garante FormsModule se usar ngModel
    if (code.includes("ngModel") && !code.includes("FormsModule")) {
        if (!code.includes("@angular/forms")) {
            code = "import { FormsModule } from '@angular/forms';\n" + code;
        }
        if (code.includes("imports: [")) {
            code = code.replace(/imports:\s*\[/, "imports: [FormsModule, ");
        } else {
            code = code.replace(/standalone:\s*true/, "standalone: true,\n  imports: [FormsModule]");
        }
    }

    // Angular/TS: Declara tipos desconhecidos (ex: signal<Vendas>) como any se não estiverem definidos
    const typeMatches = code.match(/<([A-Z]\w+)>/g);
    if (typeMatches) {
        const typesToDeclare = new Set<string>();
        typeMatches.forEach(tag => {
            const typeName = tag.slice(1, -1);
            const defined = new RegExp(`(interface|class|type|enum)\\s+${typeName}\\b`).test(code);
            if (!defined && !['string', 'number', 'boolean', 'any', 'void'].includes(typeName.toLowerCase())) {
                typesToDeclare.add(typeName);
            }
        });
        typesToDeclare.forEach(typeName => {
            code = `type ${typeName} = any;\n` + code;
        });
    }

    // Angular: força a classe a se chamar AppComponent (obrigatório para app.component.ts)
    code = code.replace(/export\s+class\s+\w+Component/g, "export class AppComponent");
    code = code.replace(/selector:\s*'[^']+'/g, "selector: 'app-root'");
    if (!code.includes("standalone")) {
        code = code.replace(/selector:\s*'app-root'/, "selector: 'app-root',\n  standalone: true");
    }

    // Angular: tenta corrigir falta de () em signals no template
    const signalNames: string[] = [];
    const signalRegex = /(?:\w+\s+)?(\w+)\s*=\s*signal/g;
    let match;
    while ((match = signalRegex.exec(code)) !== null) {
        signalNames.push(match[1]);
    }
    
    if (signalNames.length > 0) {
        // Busca o bloco do template
        code = code.replace(/template:\s*`([\s\S]*?)`/g, (templateMatch, content) => {
            let fixedContent = content;
            // 1. Remove 'this.' do template (erro comum da IA)
            fixedContent = fixedContent.replace(/this\./g, "");
            
            signalNames.forEach(name => {
                const r = new RegExp(`\\b${name}\\b(?!\\(|\\.|\\s*:)`, 'g');
                fixedContent = fixedContent.replace(r, `${name}()`);
            });
            return `template: \`${fixedContent}\``;
        });
    }

    // Angular: garante imports de signals se usados
    const signalsToImport = ['signal', 'computed', 'effect', 'untracked'].filter(s => code.includes(s));
    if (signalsToImport.length > 0) {
        code = code.replace(/import\s*\{([^}]*)\}\s*from\s*['"]@angular\/core['"]/, (match, imports) => {
            let fixed = imports;
            signalsToImport.forEach(s => {
                if (!fixed.includes(s)) fixed += `, ${s}`;
            });
            return `import {${fixed}} from '@angular/core'`;
        });
    }

    // Angular/TS: Evita erros de "Cannot find name 'X'" declarando globais comuns como any
    const commonGlobals = ['Chart', 'google', 'FB', 'bootstrap', 'd3'];
    commonGlobals.forEach(global => {
        if (code.toLowerCase().includes(global.toLowerCase()) && !code.includes(`declare var ${global}`)) {
            const importRegex = new RegExp(`import\\s+.*from\\s+['"].*${global}.*['"]\\s*;?`, 'gi');
            code = code.replace(importRegex, `// [Hub] Import de ${global} removido para evitar quebra de build`);
            if (code.includes(`new ${global}`) || code.includes(`${global}.`)) {
                code = `declare var ${global}: any;\n` + code;
            }
        }
    });

    return code;
}

/**
 * Pós-processamento: remove imports de arquivos locais que não existem no disco.
 * Isso evita o erro 'Cannot find module' quando a IA referencia componentes que não foram gerados.
 */
function removeDeadImports(filePath: string, rootPath: string): void {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        // Captura imports relativos (./xxx ou ../xxx)
        const importRegex = /^import\s+\{[^}]+\}\s+from\s+['"](\.\/[^'"]+)['"]\s*;?\s*$/gm;
        content = content.replace(importRegex, (line, importPath) => {
            const resolvedPath = path.resolve(path.dirname(filePath), importPath + '.ts');
            if (!fs.existsSync(resolvedPath)) {
                changed = true;
                return '// [Hub] Import removido: arquivo não encontrado no projeto';
            }
            return line;
        });
        if (changed) {
            // Remove também referências ao componente importado no decorador (imports array)
            content = content.replace(/,?\s*\w+Component\s*(?=[\],])/g, (match) => {
                // Verifica se o componente tem um import válido no arquivo
                const componentName = match.trim().replace(/^,\s*/, '');
                if (content.includes(`// [Hub] Import removido`) && !content.includes(`class ${componentName}`)) {
                    return '';
                }
                return match;
            });
            fs.writeFileSync(filePath, content);
        }
    } catch (e) {
        console.error('[Hub] Erro no pós-processamento:', e);
    }
}

export function deactivate() {}
