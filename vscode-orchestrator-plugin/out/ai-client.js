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
exports.AIClient = void 0;
const vscode = __importStar(require("vscode"));
class AIClient {
    /**
     * Interage nativamente com a API de Language Model do VS Code (GitHub Copilot Enterprise).
     */
    static async sendPromptToCopilot(agentName, context, globalRules, projectContext = "", hasMockup = false, onChunk) {
        let attempts = 0;
        const maxAttempts = 3; // 1 tentativa normal + 2 retries de segurança
        const isDev = agentName.includes("JAVA") || agentName.includes("ANGULAR") || agentName.includes("SPRING");
        const muzzle = isDev
            ? "DIRETIVA: Retorne apenas blocos de código fonte. Não use saudações."
            : "DIRETIVA: Gere o documento técnico diretamente, sem conversas iniciais.";
        // Monta um único prompt consolidado para evitar confusão no modelo
        const fullPrompt = `Você é o ${agentName} do AI Governance Hub da Foursys.
${muzzle}
---
[REGRAS DE GOVERNANÇA]
${globalRules}
---
[CONTEXTO TÉCNICO]
${projectContext || "Projeto não identificado."}
${hasMockup ? "IMPORTANTE: Existe um arquivo 'ui_mockup.png' na pasta. Siga o layout visual." : ""}
---
[TAREFA]
Baseado no documento fornecido, execute sua fase do ciclo SDD.
[CONTEÚDO DO DOCUMENTO DE ENTRADA]
${context}`;
        while (attempts < maxAttempts) {
            try {
                const models = await vscode.lm.selectChatModels();
                if (!models || models.length === 0) {
                    throw new Error("Provedor de IA não encontrado.");
                }
                const model = models[0];
                const messages = [vscode.LanguageModelChatMessage.User(fullPrompt)];
                const chatResponse = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);
                let fullResponse = '';
                for await (const chunk of chatResponse.text) {
                    fullResponse += chunk;
                    if (onChunk) {
                        await onChunk(chunk);
                    }
                }
                if (!fullResponse || fullResponse.trim().length === 0) {
                    throw new Error("A IA retornou uma resposta vazia.");
                }
                return fullResponse;
            }
            catch (error) {
                attempts++;
                if (attempts >= maxAttempts) {
                    throw new Error(`Falha após ${maxAttempts} tentativas: ${error.message}`);
                }
                await new Promise(res => setTimeout(res, 2000));
            }
        }
        return "";
    }
}
exports.AIClient = AIClient;
//# sourceMappingURL=ai-client.js.map