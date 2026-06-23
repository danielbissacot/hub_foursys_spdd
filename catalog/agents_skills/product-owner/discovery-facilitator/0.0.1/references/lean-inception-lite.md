# Lean Inception Lite para discovery de negócio

Roteiro enxuto para Product Owner conduzir uma sessão de discovery focada em valor,
escopo e alinhamento de negócio antes do PRD.

## Quando usar

Use este fluxo quando houver contexto inicial suficiente para discutir a demanda, mas
ainda existirem dúvidas relevantes sobre problema, público, limites, regras ou
prioridades. Ele é ideal para sessões de 45 a 75 minutos.

## Objetivo da oficina

Sair da conversa com base suficiente para preencher ou evoluir o `discovery.md`,
registrando:
- visão da feature;
- personas impactadas;
- limites `É / NÃO É / FAZ / NÃO FAZ`;
- cenários essenciais e incrementais;
- regras, métricas, riscos, dependências e perguntas em aberto.

## Preparação rápida

Antes da sessão, tente reunir:
- briefing, issue Jira ou resumo do problema;
- participantes que conheçam valor, processo e impacto no negócio;
- métricas ou evidências já disponíveis;
- decisões anteriores que não devem ser reabertas.

## Agenda sugerida

| Etapa | Duração | Resultado esperado |
|---|---:|---|
| 1. Abertura e objetivo | 5 min | todos entendem o problema que será discutido |
| 2. Visão da feature e valor | 10 min | declaração simples de problema, público e benefício |
| 3. Limites da entrega | 10 min | quadro `É / NÃO É / FAZ / NÃO FAZ` preenchido |
| 4. Personas e cenários | 10 a 15 min | perfis impactados e cenários prioritários identificados |
| 5. Regras, métricas, riscos e dependências | 10 a 20 min | condicionantes de negócio e pontos de atenção mapeados |
| 6. Fechamento e próximos passos | 5 a 10 min | pendências, responsáveis e decisão de avanço |

## Passo a passo

### 1. Abertura e objetivo

Alinhe em uma frase:
- qual problema será explorado;
- para quem;
- qual decisão de negócio a sessão precisa destravar.

**Facilitação:** comece simples. Se a discussão abrir temas paralelos, traga de volta
para a pergunta central.

### 2. Visão da feature e valor

Construa uma frase de visão:

> "Esta feature permite que **[persona]** consiga **[capacidade]** para
> **[benefício]**, no contexto de **[produto/processo]**."

Pergunte:
- qual dor ou oportunidade motivou a demanda;
- qual mudança de resultado é esperada;
- por que agora.

### 3. Limites da entrega

Preencha rapidamente o quadro:

| É | NÃO É |
|---|---|
| o que a feature representa | o que ela não pretende resolver |

| FAZ | NÃO FAZ |
|---|---|
| comportamentos que entram nesta entrega | comportamentos explicitamente fora |

**Objetivo:** evitar ambiguidade e cortar escopo implícito cedo.

### 4. Personas e cenários

Identifique:
- persona principal;
- perfis impactados ou aprovadores;
- cenários essenciais;
- cenários incrementais ou de exceção.

Para cada cenário, capture de forma leve:
- gatilho;
- ação esperada;
- resultado esperado do ponto de vista do negócio.

### 5. Regras, métricas, riscos e dependências

Consolide:
- regras de negócio críticas;
- critérios de sucesso e métricas;
- riscos, hipóteses e incertezas;
- dependências de áreas, processos, aprovações ou sistemas em nível de negócio.

**Importante:** trate dependências técnicas apenas como impacto no negócio. Exemplo:
`depende de integração com sistema legado` é suficiente nesta etapa.

### 6. Fechamento e próximos passos

Encerre registrando:
- o que ficou confirmado;
- o que é hipótese;
- o que continua em aberto;
- quem precisa responder cada pendência;
- se já há material suficiente para avançar no discovery ou seguir para o PRD.

## Estacionamento técnico

Se surgirem temas como arquitetura, APIs, banco de dados, eventos, estimativas ou
decomposição técnica:
1. registre no parking lot técnico;
2. descreva apenas o impacto ou dependência de negócio;
3. retorne imediatamente para a decisão de produto em discussão.

## Checklist de saída

Ao final, confirme se a oficina deixou claro:
- qual problema está sendo resolvido;
- quem recebe valor;
- o que entra e o que fica fora;
- quais cenários são essenciais;
- quais regras de negócio não podem ser omitidas;
- como o sucesso será percebido;
- quais riscos, dependências e pendências ainda exigem validação.

Se algum item continuar indefinido, não invente. Registre como pergunta em aberto.
