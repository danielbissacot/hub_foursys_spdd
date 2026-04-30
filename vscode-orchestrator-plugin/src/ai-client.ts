import * as vscode from 'vscode';

export class AIClient {
    /**
     * Interage nativamente com a API de Language Model do VS Code (GitHub Copilot Enterprise).
     */
    public static async sendPromptToCopilot(agentName: string, context: string, globalRules: string, projectContext: string = "", hasMockup: boolean = false, onChunk?: (chunk: string) => Promise<void>): Promise<string> {
        
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
                const messages = [ vscode.LanguageModelChatMessage.User(fullPrompt) ];

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
            } catch (error: any) {
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
