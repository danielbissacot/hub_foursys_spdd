# ADR Workflow — Validação da Decisão

## Objetivo

Garantir que a decisão arquitetural está bem fundamentada antes de registrá-la. Um ADR sem alternativas reais e consequências negativas tem pouco valor histórico.

---

## Etapa 1: Entender a decisão

Colete as informações básicas:
- Qual é a decisão tomada?
- Qual é o contexto e as forças que levaram a essa decisão? (pressões técnicas, de prazo, de custo, limitações da equipe)
- Quais alternativas já foram consideradas pelo usuário?

---

## Etapa 2: Questionar as alternativas

Com base no contexto fornecido, **sugira 1-2 alternativas** que o usuário pode não ter considerado explicitamente. Use seu conhecimento técnico para identificar abordagens que fazem sentido para o problema descrito.

Para cada alternativa sugerida, pergunte:
> "Você considerou [alternativa X]? Por que foi descartada?"

Se o usuário não havia considerado a alternativa, explore:
> "Quais seriam as vantagens e desvantagens de [X] no seu contexto?"

**Objetivo:** garantir que o ADR registre alternativas reais e justificativas genuínas — não apenas a opção escolhida.

---

## Etapa 3: Explorar consequências negativas

Pergunte sobre os trade-offs aceitos com a decisão tomada:
- "Quais são as desvantagens ou riscos conhecidos desta abordagem?"
- "Em quais cenários futuro esta decisão poderia precisar ser revisada?"
- "Há débitos técnicos aceitos como consequência desta decisão?"

Não tente mudar a decisão — o objetivo é documentá-la com honestidade. Uma decisão bem registrada inclui suas limitações.

---

## Ao final da sessão

Com todas as informações coletadas, gere o ADR usando `references/adr-template.md`, garantindo que:
- Todas as alternativas discutidas estão registradas com suas justificativas de descarte
- As consequências negativas estão explicitadas, não apenas as positivas
