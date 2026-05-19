import * as vscode from 'vscode';

export class AIClient {
    static async sendPrompt(
        systemPrompt: string,
        userPrompt: string,
        outputChannel: vscode.OutputChannel,
        token: vscode.CancellationToken,
        onChunk?: (chunk: string) => void
    ): Promise<string> {
        outputChannel.appendLine(`[IA] Enviando prompt para o modelo de IA...`);

        try {
            let models = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' });
            if (models.length === 0) {
                models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
            }
            if (models.length === 0) {
                throw new Error('Nenhum modelo de IA disponível. Verifique se o GitHub Copilot está ativo.');
            }

            const model = models[0];

            // Padrão User/Assistant simula system message (vscode.lm não expõe role System).
            // O modelo trata a resposta prévia do assistente como "compromisso" com as instruções,
            // reduzindo drasticamente desvios e alucinações.
            const messages = [
                vscode.LanguageModelChatMessage.User(systemPrompt),
                vscode.LanguageModelChatMessage.Assistant(
                    'Entendido. Sou o Agente Foursys SDD. Seguirei estritamente o playbook e gerarei apenas o conteúdo técnico solicitado, sem introduções ou perguntas.'
                ),
                vscode.LanguageModelChatMessage.User(`EXECUTAR AGORA SOBRE ESTE CONTEXTO:\n${userPrompt}`)
            ];

            // Temperatura 0.1: modelo determinístico, segue instruções — reduz invenção de código/arquivos.
            const response = await model.sendRequest(
                messages,
                { modelOptions: { temperature: 0.1 } },
                token
            );

            let fullResponse = '';
            outputChannel.appendLine('------------------------------------------------------------');
            for await (const chunk of response.text) {
                fullResponse += chunk;
                if (onChunk) { onChunk(chunk); }
                outputChannel.append(chunk);
            }
            outputChannel.appendLine('\n------------------------------------------------------------');

            // Validação mínima de saída: rejeita recusas e respostas vazias antes de salvar arquivo.
            const refusalKeywords = ["i'm sorry", "i cannot", "não posso", "não é possível", "desculpe, não"];
            const lowerResponse = fullResponse.toLowerCase();
            if (refusalKeywords.some(k => lowerResponse.startsWith(k))) {
                throw new Error(`IA recusou a solicitação: ${fullResponse.substring(0, 200)}`);
            }
            if (fullResponse.trim().length < 50) {
                throw new Error('Resposta da IA muito curta ou vazia. Tente novamente.');
            }

            outputChannel.appendLine('[IA] Resposta recebida e validada com sucesso. ✅');
            return fullResponse;
        } catch (error: any) {
            outputChannel.appendLine(`[IA ERRO] ${error.message || error}`);
            vscode.window.showErrorMessage(`❌ Erro na comunicação com a IA: ${error.message}`);
            throw error;
        }
    }
}
