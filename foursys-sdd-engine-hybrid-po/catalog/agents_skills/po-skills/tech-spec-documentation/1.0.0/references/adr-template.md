## Objetivo

ADRs (Architecture Decision Records) documentam decisoes JA TOMADAS. Sao imutaveis apos aprovacao - se a decisao mudar, crie um novo ADR que supersede o anterior.

## Instrucoes

1. ADR é para REGISTRAR decisão, nao para propor (use RFC para propostas)
2. Seja conciso mas completo
3. Documente o contexto para quem ler no futuro
4. Nunca edite um ADR aprovado - crie um novo se necessario

## Estrutura do ADR

```markdown
# ADR-XXX: [Titulo da Decisao]

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-YYY
**Data:** YYYY-MM-DD
**Decisores:** [Nomes]

---

## Contexto

[Situacao que exigiu esta decisao. Inclua:]
- O que estava acontecendo
- Qual problema precisava ser resolvido
- Quais restricoes existiam

---

## Decisao

[O que foi decidido, de forma clara e direta]

**Escolha:** [Nome da opcao escolhida]

**Detalhes:**
- [Detalhe 1]
- [Detalhe 2]

---

## Alternativas Consideradas

### Alternativa 1: [Nome]
- **Por que rejeitada:** [Motivo]

### Alternativa 2: [Nome]
- **Por que rejeitada:** [Motivo]

---

## Consequencias

### Positivas
- [Beneficio 1]
- [Beneficio 2]

### Negativas
- [Trade-off 1]
- [Trade-off 2]

### Neutras
- [Mudanca que nao e boa nem ruim]

---

## Compliance

### Padroes Atendidos
- [Padrao 1]
- [Padrao 2]

### Riscos Aceitos
- [Risco aceito e justificativa]

---

## Referencias

- RFC-XXX: [Link para RFC que originou esta decisao]
- [Outros links relevantes]

---

## Notas

[Qualquer informacao adicional relevante para o futuro]
```

## Exemplo de Uso

```
> Baseado na RFC aprovada, registre a decisao em ADR
> Decisao: usar WebSocket com Socket.io + Redis adapter
```

## Fluxo RFC → ADR

```
RFC (Proposta) → Review → Aprovado → ADR (Registro)
                  ↓
               Rejeitado → Arquivar RFC com status Rejected
```