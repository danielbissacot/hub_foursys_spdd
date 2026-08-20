import * as vscode from 'vscode';
import { calculateCredits } from './model-pricing';

// Modelos por tipo de fase — evita Claude Opus 4.8 e GPT-5.5 (mais caros/Auto).
// 'light'     → constitution, plan, tasks (Haiku: leve, contexto grande)
// 'mini'      → specify (Haiku ou GPT-5 mini: mais leve ainda)
// 'implement' → codificação (Haiku primeiro: Sonnet 4.6 tem cota corporativa muito mais
//               apertada e combinado com prompt grande de workspace batia rate limit direto;
//               Sonnet vira fallback em vez de 1ª tentativa)
// 'standard'  → QA e demais fases (geração de texto/markdown, não código — fallback usa
//               GPT-5 mini em vez de um modelo especializado em código como o Codex)
const PHASE_MODELS: Record<string, string[]> = {
    light:     ['claude-haiku-4-5', 'gpt-5-mini'],
    mini:      ['claude-haiku-4-5', 'gpt-5-mini'],
    implement: ['claude-haiku-4-5', 'claude-sonnet-4-6'],
    standard:  ['claude-haiku-4-5', 'gpt-5-mini'],
    'qa-html': ['claude-haiku-4-5', 'gpt-5-mini'],
};

/** Cap de saida por fase, para respeitar cota empresarial. */
const MAX_TOKENS_PADRAO = 3500;

/** `qa-coverage` e `qa-report` pedem DOIS documentos numa resposta so: o Markdown mais uma versao
 *  HTML executiva completa, com o CSS do template copiado inteiro. Medido em 20/08/2026 no
 *  Angular: o Markdown sozinho saiu com 5.109 bytes (~1.400 tokens) e o template de HTML a
 *  reproduzir tem 5.779 bytes (~1.600) — juntos raspam os 3.500 do teto, e a IA cortou a secao do
 *  HTML sem avisar. O arquivo .html simplesmente nao era criado, e nada sinalizava a falta.
 *  Nenhuma outra fase produz dois artefatos numa chamada, entao o teto maior fica so nestas duas. */
const MAX_TOKENS_QA_HTML = 8000;

export interface SendPromptResult {
    text: string;
    totalTokens: number;
    /** Estimativa (ver model-pricing.ts) — undefined se o modelo usado não estiver na tabela de preços. */
    credits?: number;
}

/** Imagem anexada ao prompt (mockup de tela). Ver PHASES_NEEDING_MOCKUP em extension.ts. */
export interface PromptImage {
    data: Uint8Array;
    /** `image/png`, `image/jpeg` ou `image/webp` — o que LanguageModelDataPart.image aceita. */
    mime: string;
    name: string;
}

// Erros transitórios do provedor (limite de taxa) valem retry/fallback; outros erros (recusa,
// permissão, resposta inválida) não se resolvem sozinhos e devem propagar na hora.
function isRateLimitError(error: any): boolean {
    return /rate limit|too many requests|429/i.test(error?.message ?? String(error));
}

// Erros levantados pela nossa própria validação de saída (_sendToModel), não pela API. Reenviar
// sem a imagem não resolveria nenhum dos dois — serve para não gastar uma segunda chamada à toa.
function isValidacaoDeSaida(error: any): boolean {
    return /IA recusou a solicitação|Resposta da IA muito curta/i.test(error?.message ?? String(error));
}

export class AIClient {
    static async sendPrompt(
        systemPrompt: string,
        userPrompt: string,
        outputChannel: vscode.OutputChannel,
        token: vscode.CancellationToken,
        onChunk?: (chunk: string) => void,
        phaseType: 'light' | 'mini' | 'implement' | 'standard' | 'qa-html' = 'standard',
        images?: PromptImage[]
    ): Promise<SendPromptResult> {
        outputChannel.appendLine(`[IA] Enviando prompt para o modelo de IA...`);

        try {
            // Respeita override manual do dev (Ctrl+, → "Foursys: Modelo Preferido")
            const override = vscode.workspace.getConfiguration('foursys').get<string>('modelOverride', '').trim();
            const families = override ? [override] : (PHASE_MODELS[phaseType] ?? PHASE_MODELS.standard);

            // Monta a lista de modelos candidatos (1 por família preferida disponível).
            const candidates: vscode.LanguageModelChat[] = [];
            for (const family of families) {
                const found = await vscode.lm.selectChatModels({ vendor: 'copilot', family });
                if (found.length > 0) { candidates.push(found[0]); }
            }
            // Fallback de disponibilidade e de limite de taxa: acrescenta qualquer outro modelo
            // Copilot ativo (não incluído nas famílias preferidas) ao final da lista. Cobre tanto
            // o caso de nenhuma família preferida estar disponível quanto o caso de todas elas
            // (ex: Haiku e Codex) baterem rate limit — o retry abaixo cai pra essa próxima opção.
            const anyModels = await vscode.lm.selectChatModels({ vendor: 'copilot' });
            for (const m of anyModels) {
                if (!candidates.some(c => c.id === m.id)) { candidates.push(m); }
            }
            if (candidates.length === 0) {
                throw new Error('Nenhum modelo de IA disponível. Verifique se o GitHub Copilot está ativo.');
            }

            // Padrão User/Assistant simula system message (vscode.lm não expõe role System).
            // O modelo trata a resposta prévia do assistente como "compromisso" com as instruções,
            // reduzindo drasticamente desvios e alucinações.
            //
            // O mockup vai como IMAGEM de verdade (LanguageModelDataPart.image), não como caminho
            // de arquivo. Em 18/08/2026 medimos que o texto "existe um mockup em tal pasta" não faz
            // o modelo abrir o arquivo: rodamos o Specify com e sem o mockup na pasta certa e o
            // INVEST deu 68% nas duas, sem uma única menção à tela. O ponteiro não chega, a imagem chega.
            const contextoTexto = `EXECUTAR AGORA SOBRE ESTE CONTEXTO:\n${userPrompt}`;
            const temImagem = !!images && images.length > 0;
            const montarMensagens = (comImagem: boolean): vscode.LanguageModelChatMessage[] => [
                vscode.LanguageModelChatMessage.User(systemPrompt),
                vscode.LanguageModelChatMessage.Assistant(
                    'Entendido. Seguirei estritamente o playbook.'
                ),
                comImagem
                    ? vscode.LanguageModelChatMessage.User([
                        new vscode.LanguageModelTextPart(contextoTexto),
                        ...images!.map(img => vscode.LanguageModelDataPart.image(img.data, img.mime))
                    ])
                    : vscode.LanguageModelChatMessage.User(contextoTexto)
            ];
            const messages = montarMensagens(temImagem);

            // Rate limit costuma ser rajada de requisições da conta (não cota por modelo) — repetir
            // o MESMO modelo várias vezes só empilha mais pedidos na mesma rajada e piora o throttle.
            // Por isso: no máximo 2 tentativas no total, cada uma num modelo candidato diferente,
            // com uma pausa entre elas em vez de martelar em sequência.
            const MAX_TOTAL_ATTEMPTS = 2;
            const capSaida = phaseType === 'qa-html' ? MAX_TOKENS_QA_HTML : MAX_TOKENS_PADRAO;

            let lastError: any;
            for (let i = 0; i < candidates.length && i < MAX_TOTAL_ATTEMPTS; i++) {
                const model = candidates[i];
                try {
                    return await AIClient._sendToModel(model, messages, outputChannel, token, onChunk, capSaida);
                } catch (error: any) {
                    lastError = error;
                    // Nem todo modelo do Copilot aceita parte de imagem, e quem não aceita falha na
                    // própria chamada. Refaz UMA vez sem a imagem para que anexar um mockup nunca
                    // quebre uma fase que já funcionava sem ele — o pior caso volta a ser o de hoje.
                    if (temImagem && !isRateLimitError(error) && !isValidacaoDeSaida(error)) {
                        outputChannel.appendLine(`[IA] ${model.family} não aceitou o mockup como imagem — refazendo sem a imagem.`);
                        return await AIClient._sendToModel(model, montarMensagens(false), outputChannel, token, onChunk, capSaida);
                    }
                    if (!isRateLimitError(error)) { throw error; } // erro definitivo — não adianta retry

                    const hasNext = i + 1 < candidates.length && i + 1 < MAX_TOTAL_ATTEMPTS;
                    if (hasNext) {
                        outputChannel.appendLine(`[IA] ${model.family} com limite de taxa. Aguardando antes de tentar modelo alternativo...`);
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }
                }
            }

            throw lastError;
        } catch (error: any) {
            outputChannel.appendLine(`[IA ERRO] ${error.message || error}`);
            vscode.window.showErrorMessage(`❌ Erro na comunicação com a IA: ${error.message}`);
            throw error;
        }
    }

    private static async _sendToModel(
        model: vscode.LanguageModelChat,
        messages: vscode.LanguageModelChatMessage[],
        outputChannel: vscode.OutputChannel,
        token: vscode.CancellationToken,
        onChunk?: (chunk: string) => void,
        capSaida: number = MAX_TOKENS_PADRAO
    ): Promise<SendPromptResult> {
        // Conta tokens de entrada — falha silenciosa se modelo não suportar countTokens
        let inputTokens = 0;
        try {
            const counts = await Promise.all(messages.map(m => model.countTokens(m, token)));
            inputTokens = counts.reduce((a, b) => a + b, 0);
        } catch { /* countTokens não disponível — ignora */ }

        // Temperatura 0.1: determinístico. maxTokens: cap de saída para respeitar cota empresarial.
        const response = await model.sendRequest(
            messages,
            { modelOptions: { temperature: 0.1, maxTokens: capSaida } },
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

        // Conta tokens de saída — falha silenciosa
        let outputTokens = 0;
        try {
            outputTokens = await model.countTokens(
                vscode.LanguageModelChatMessage.Assistant(fullResponse), token
            );
        } catch { /* ignora */ }

        const totalTokens = inputTokens + outputTokens;
        const maxTokens = model.maxInputTokens ?? 0;
        const pct = maxTokens > 0 ? Math.round((totalTokens / maxTokens) * 100) : 0;
        const modelLabel = `${model.family} (${model.vendor})`;
        const credits = calculateCredits(model.family, inputTokens, outputTokens);
        const creditsLabel = credits !== undefined ? ` — ≈${credits.toFixed(3)} créditos (estimado)` : '';
        outputChannel.appendLine(
            `[IA] ${modelLabel} | Capacidade: ${maxTokens} tokens | Consumiu: ${totalTokens} (${pct}%)${creditsLabel}`
        );

        return { text: fullResponse, totalTokens, credits };
    }
}
