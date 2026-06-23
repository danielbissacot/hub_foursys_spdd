# RFC Workflow — Validação da Proposta

## Objetivo

Garantir que a mudança proposta resolve o problema correto, que alternativas foram consideradas e que há um plano de rollout seguro antes de registrar o RFC.

---

## Etapa 1: Validar o problema

Antes de falar sobre a solução, entenda profundamente o problema. Se a descrição estiver vaga, faça perguntas de acompanhamento até que esteja clara.

- "Por que essa mudança é necessária agora? O que motivou este momento?"
- "O que acontece se **não** fizermos essa mudança?"
- "O problema está ocorrendo hoje em produção ou é preventivo/proativo?"
- "Quem é afetado pelo problema atual? (usuários, outros times, sistemas)"

---

## Etapa 2: Alternativas não consideradas

Com base no problema descrito, **sugira 1-2 alternativas** à abordagem proposta. Considere soluções mais simples, abordagens incrementais ou mudanças de menor risco.

Para cada alternativa sugerida, pergunte:
> "Você considerou [alternativa X]? Quais seriam as vantagens e desvantagens no seu contexto?"

Explore também:
> "Há uma solução mais simples que resolveria 80% do problema sem a complexidade desta proposta?"

Registre as alternativas discutidas no RFC mesmo que descartadas — elas têm valor histórico para quem revisar a decisão depois.

---

## Etapa 3: Estratégia de rollout e rollback

Explore o plano de deploy e os riscos operacionais:

**Rollout:**
- "Como será feito o rollout? Será gradual (feature flag, canary release, blue-green) ou big-bang?"
- "Há necessidade de comunicação prévia para outros times ou sistemas dependentes?"

**Migração de dados:**
- "Esta mudança exige migração de dados? Se sim, qual é a estratégia? (migração online vs. offline, backward compatibility)"

**Rollback:**
- "Qual é o plano de rollback se algo der errado após o deploy?"
- "A mudança é reversível sem impacto nos dados já produzidos?"

---

## Ao final da sessão

Com todas as informações coletadas, gere o RFC usando `references/rfc-template.md`, garantindo que:
- O problema está claramente separado da solução proposta
- As alternativas discutidas estão registradas com justificativas de descarte
- A estratégia de rollout e rollback está documentada
