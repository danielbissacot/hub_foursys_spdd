## Objetivo

RFCs (Request for Comments) sao propostas tecnicas ANTES da implementacao. Devem ser discutidas pelo time antes de virar ADR.

## Instrucoes

1. RFC e para PROPOR, nao para documentar decisao ja tomada
2. Sempre apresente alternativas com pros/cons
3. Inclua trade-offs claros
4. Deixe espaco para feedback do time

## Estrutura da RFC

```markdown
# RFC-XXX: [Titulo da Proposta]

**Status:** Draft | In Review | Accepted | Rejected | Superseded
**Autor(es):** [Nome(s)]
**Data:** YYYY-MM-DD
**Reviewers:** [Nomes]

---

## Resumo Executivo

[2-3 frases explicando a proposta de forma clara]

---

## Contexto

### Situacao Atual
[Como funciona hoje? Qual o problema?]

### Por que agora?
[O que motivou esta proposta?]

### Restricoes
[Limitacoes tecnicas, de tempo, de recursos]

---

## Problema

### Descricao
[Detalhe o problema que estamos resolvendo]

### Impacto
[Quem e afetado? Qual a severidade?]

### Metricas
[Como medimos o problema hoje?]

---

## Proposta

### Visao Geral
[Descricao da solucao proposta]

### Arquitetura

\`\`\`mermaid
flowchart LR
    A[Componente A] --> B[Componente B]
    B --> C[Componente C]
\`\`\`

### Detalhes de Implementacao
[Como sera implementado]

### Mudancas Necessarias
- [ ] [Mudanca 1]
- [ ] [Mudanca 2]

---

## Alternativas Consideradas

### Alternativa 1: [Nome]

**Descricao:** [Como funcionaria]

**Pros:**
- [Vantagem 1]
- [Vantagem 2]

**Cons:**
- [Desvantagem 1]
- [Desvantagem 2]

### Alternativa 2: [Nome]

**Descricao:** [Como funcionaria]

**Pros:**
- [Vantagem 1]

**Cons:**
- [Desvantagem 1]

### Alternativa 3: Nao fazer nada

**Descricao:** Manter como esta

**Cons:**
- [Por que nao e aceitavel]

---

## Trade-offs

| Aspecto | Proposta | Alt 1 | Alt 2 |
|---------|----------|-------|-------|
| Performance | [avaliacao] | [avaliacao] | [avaliacao] |
| Complexidade | [avaliacao] | [avaliacao] | [avaliacao] |
| Custo | [avaliacao] | [avaliacao] | [avaliacao] |
| Time to Market | [avaliacao] | [avaliacao] | [avaliacao] |
| Manutencao | [avaliacao] | [avaliacao] | [avaliacao] |

---

## Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|--------------|---------|-----------|
| [Descricao] | Alta/Media/Baixa | Alto/Medio/Baixo | [Como mitigar] |

---

## Plano de Migracao (se aplicavel)

### Fase 1: [Nome]
[Descricao]

### Fase 2: [Nome]
[Descricao]

### Rollback
[Como reverter se der errado]

---

## Decisao Recomendada

**Recomendacao:** [Qual alternativa recomendamos]

**Justificativa:**
[Por que esta e a melhor opcao considerando os trade-offs]

---

## Questoes em Aberto

- [ ] [Questao que precisa ser respondida]
- [ ] [Outra questao]

---

## Referencias

- [Link para doc relacionado]
- [Link para RFC anterior]

---

## Changelog

| Data | Autor | Mudanca |
|------|-------|---------|
| YYYY-MM-DD | [Nome] | Versao inicial |
```

## Exemplo de Uso

```
> Crie uma RFC para escolher entre WebSocket e SSE
> para o sistema de notificacoes real-time
> Considere: latencia, escalabilidade, complexidade
```