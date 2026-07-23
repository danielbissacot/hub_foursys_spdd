// Preços oficiais do GitHub Copilot (US$ por 1 milhão de tokens), só para os modelos
// que a extensão realmente pode usar (ver PHASE_MODELS em ai-client.ts).
// Fonte: https://docs.github.com/pt/copilot/reference/copilot-billing/models-and-pricing
// 1 AI credit = US$ 0,01. Consultado em 2026-07-06 — a GitHub pode alterar preços a qualquer momento.
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
    'claude-haiku-4-5':  { input: 1.00, output: 5.00 },
    'claude-sonnet-4-6': { input: 3.00, output: 15.00 },
    'gpt-5.3-codex':     { input: 1.75, output: 14.00 },
    'gpt-5-mini':        { input: 0.25, output: 2.00 },
};

const USD_PER_CREDIT = 0.01;

/**
 * Estimativa de créditos consumidos — NÃO é o valor exato de cobrança da conta.
 * Depende de (1) contagem de tokens já ser uma estimativa client-side (model.countTokens)
 * e (2) o modelo realmente usado estar nesta tabela. Se não estiver (ex: fallback pra
 * "qualquer modelo ativo" quando nenhum da lista preferida está disponível), retorna
 * undefined em vez de arriscar um número errado.
 */
export function calculateCredits(modelFamily: string, inputTokens: number, outputTokens: number): number | undefined {
    const pricing = MODEL_PRICING[modelFamily];
    if (!pricing) { return undefined; }
    const costUsd = (inputTokens / 1_000_000) * pricing.input + (outputTokens / 1_000_000) * pricing.output;
    return costUsd / USD_PER_CREDIT;
}
