"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const sdd_engine_1 = require("./sdd-engine");
const sidebar_provider_1 = require("./sidebar-provider");
const ai_client_1 = require("./ai-client");
function activate(context) {
    let disposable = vscode.commands.registerCommand('hub.runPipeline', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Abra uma pasta no VS Code para executar a pipeline.');
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        const engine = new sdd_engine_1.SDDEngine(rootPath);
        let config;
        try {
            config = engine.loadConfig();
        }
        catch (e) {
            vscode.window.showErrorMessage(`Erro na Orquestração: ${e.message}`);
            return;
        }
        // Navegação Visual dos Agentes
        const items = config.pipelines.map(p => ({
            label: `$(gear) ${p.name}`,
            description: p.description,
            detail: `ID: ${p.id} | ${p.steps.length} Agentes em Sequência`,
            pipeline: p
        }));
        const selectedOption = await vscode.window.showQuickPick(items, {
            placeHolder: 'Navegue entre os Agentes: Qual fluxo/agente você deseja executar?'
        });
        if (selectedOption) {
            const pipeline = selectedOption.pipeline;
            const globalRules = engine.getGlobalRules();
            await executePipelineWithProgress(pipeline, rootPath, globalRules);
        }
    });
    const sidebarProvider = new sidebar_provider_1.HubSidebarProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(sidebar_provider_1.HubSidebarProvider.viewType, sidebarProvider));
    context.subscriptions.push(disposable);
}
async function executePipelineWithProgress(pipeline, rootPath, globalRules) {
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Hub de Governança: Executando ${pipeline.name}`,
        cancellable: true
    }, async (progress, token) => {
        const totalSteps = pipeline.steps.length;
        for (let i = 0; i < totalSteps; i++) {
            if (token.isCancellationRequested) {
                return;
            }
            const step = pipeline.steps[i];
            const percent = ((i + 1) / totalSteps) * 100;
            progress.report({
                increment: 100 / totalSteps,
                message: `[${i + 1}/${totalSteps}] ${step.agent} trabalhando...`
            });
            // Verifica o arquivo de contexto de entrada
            const inputPath = path.join(rootPath, step.input_context);
            let contextContent = "";
            if (!fs.existsSync(inputPath)) {
                // Arquivo não existe! Vamos auto-criar um template para o usuário.
                const template = `# História de Usuário / Requisito\n\n**Título:** [Insira o título aqui]\n\n**Descrição:**\nComo um [ator],\nEu quero [ação],\nPara que [valor].\n\n**Critérios de Aceite:**\n- [ ] Critério 1\n`;
                fs.writeFileSync(inputPath, template);
                const doc = await vscode.workspace.openTextDocument(inputPath);
                await vscode.window.showTextDocument(doc, { preview: false });
                vscode.window.showWarningMessage(`Contexto ausente! Criei um template para '${step.input_context}'. Preencha e rode a pipeline novamente.`);
                return; // Pausa a execução
            }
            else {
                // Lê o conteúdo real do arquivo para passar para a IA
                contextContent = fs.readFileSync(inputPath, 'utf8');
            }
            // Chama a API do Copilot passando o conteúdo real
            const generatedContent = await ai_client_1.AIClient.sendPromptToCopilot(step.agent, contextContent, globalRules);
            // Simula a escrita de um arquivo em disco
            const outputPath = path.join(rootPath, `output_${step.agent.toLowerCase()}${step.expected_output_extension}`);
            fs.writeFileSync(outputPath, generatedContent);
            if (step.require_human_approval && i < totalSteps - 1) {
                const doc = await vscode.workspace.openTextDocument(outputPath);
                await vscode.window.showTextDocument(doc, { preview: false });
                const approve = await vscode.window.showInformationMessage(`O ${step.agent} gerou o arquivo. Você aprova a continuação para o próximo agente?`, { modal: true }, 'Aprovar', 'Rejeitar');
                if (approve !== 'Aprovar') {
                    vscode.window.showWarningMessage('Fluxo interrompido pelo usuário na fase de aprovação.');
                    return;
                }
            }
        }
        vscode.window.showInformationMessage('✨ Pipeline executada com sucesso! Todos os artefatos foram gerados.');
    });
}
function deactivate() { }
//# sourceMappingURL=extension.js.map