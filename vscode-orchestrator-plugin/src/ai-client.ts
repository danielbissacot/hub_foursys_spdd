import * as vscode from 'vscode';

export class AIClient {
    /**
     * Interage nativamente com a API de Language Model do VS Code (GitHub Copilot Enterprise).
     */
    public static async sendPromptToCopilot(agentName: string, context: string, globalRules: string, projectContext: string = "", hasMockup: boolean = false, onChunk?: (chunk: string) => Promise<void>): Promise<string> {
        try {
            // Seleciona QUALQUER modelo provido no VS Code (Copilot, Gemini, etc)
            const models = await vscode.lm.selectChatModels();
            
            if (!models || models.length === 0) {
                throw new Error("Nenhum provedor de IA encontrado no VS Code. Instale/autentique o Copilot ou o Gemini.");
            }

            // Pega o primeiro modelo disponível que tenha suporte (geralmente a LLM ativa)
            const model = models[0];

            // Monta o prompt combinando a governança corporativa e a tarefa do agente
            const systemPrompt = `Você é o ${agentName} do AI Governance Hub da Foursys. 
Siga estritamente as regras de governança corporativa abaixo:
---
${globalRules}
---
[CONTEXTO TÉCNICO DO PROJETO ATUAL]
${projectContext || "Projeto novo ou tecnologia não identificada."}
---
${hasMockup ? "IMPORTANTE: Existe um arquivo 'ui_mockup.png' na pasta. Siga fielmente o layout visual descrito na história e contido na imagem de referência." : ""}`;

            let personaAction = "execute sua tarefa de forma detalhada.";
            if (agentName.includes("REFINAMENTO")) {
                personaAction = "Você deve atuar como Analista de Requisitos. Leia o documento de contexto fornecido, extraia as regras de negócio e crie Critérios de Aceite técnicos no formato BDD (Given, When, Then).";
            } else if (agentName.includes("ARQUITETO")) {
                personaAction = "Você deve atuar como Arquiteto de Software. Avalie o refinamento fornecido e desenhe uma proposta de arquitetura técnica em tópicos, especificando componentes, APIs e padrões a serem adotados.";
            } else if (agentName.includes("JAVA") || agentName.includes("ANGULAR") || agentName.includes("SPRING")) {
                personaAction = "Você deve atuar como Engenheiro de Software Sênior. Gere o código-fonte final baseado no contexto fornecido, aplicando estritamente as regras de Clean Code e a arquitetura definida. Retorne apenas código funcional e completo.";
            }

            const userPrompt = `Baseado no documento fornecido e no contexto técnico do projeto, ${personaAction}\n\n[CONTEÚDO DO DOCUMENTO]\n${context}`;

            // Prepara as mensagens usando a API nativa
            const messages = [
                vscode.LanguageModelChatMessage.User(systemPrompt),
                vscode.LanguageModelChatMessage.User(userPrompt)
            ];

            // Envia a requisição usando a licença do usuário
            const chatResponse = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);
            
            let fullResponse = '';
            for await (const chunk of chatResponse.text) {
                fullResponse += chunk;
                if (onChunk) {
                    await onChunk(chunk);
                }
            }

            return fullResponse;
        } catch (error: any) {
            throw new Error(`Falha na API de Inteligência Artificial nativa do VS Code: ${error.message}`);
        }
    }
}
