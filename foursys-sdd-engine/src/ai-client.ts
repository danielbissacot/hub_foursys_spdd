import * as vscode from 'vscode';

export class AIClient {
    static async sendPrompt(
        systemPrompt: string,
        userPrompt: string,
        outputChannel: vscode.OutputChannel,
        onChunk?: (chunk: string) => void
    ): Promise<string> {
        outputChannel.appendLine(`[IA] Enviando prompt para o modelo de IA...`);

        try {
            const models = await vscode.lm.selectChatModels({
                vendor: 'copilot',
                family: 'gpt-4o'
            });

            if (models.length === 0) {
                throw new Error('Nenhum modelo de IA disponível. Verifique se o GitHub Copilot está ativo.');
            }

            const model = models[0];
            
            const instructionsPrefix = `VOCÊ É O AGENTE DE ENGENHARIA FOURSYS SDD. 
Siga estritamente as regras da CONSTITUIÇÃO e do PLAYBOOK fornecidos abaixo. 
NÃO faça perguntas, NÃO seja educado, NÃO ofereça ajuda adicional. 
GERE APENAS O CONTEÚDO TÉCNICO SOLICITADO NO FORMATO ESPECIFICADO.

PLAYBOOK / INSTRUÇÕES:
${systemPrompt}`;

            const messages = [
                vscode.LanguageModelChatMessage.User(instructionsPrefix),
                vscode.LanguageModelChatMessage.User(`EXECUTAR AGORA SOBRE ESTE CONTEXTO:\n${userPrompt}`)
            ];

            const response = await model.sendRequest(messages, {}, new vscode.CancellationTokenSource().token);

            let fullResponse = '';
            outputChannel.appendLine('------------------------------------------------------------');
            for await (const chunk of response.text) {
                fullResponse += chunk;
                if (onChunk) { onChunk(chunk); }
                outputChannel.append(chunk); // Mostra no output em tempo real
            }
            outputChannel.appendLine('\n------------------------------------------------------------');

            outputChannel.appendLine('[IA] Resposta recebida com sucesso. ✅');
            outputChannel.appendLine('[IA] Analisando conteúdo para extração...');
            return fullResponse;
        } catch (error: any) {
            outputChannel.appendLine(`[IA ERRO] ${error.message || error}`);
            vscode.window.showErrorMessage(`❌ Erro na comunicação com a IA: ${error.message}`);
            throw error;
        }
    }
}
