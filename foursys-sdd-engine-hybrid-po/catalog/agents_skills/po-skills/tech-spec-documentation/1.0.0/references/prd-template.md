## Objetivo

Quando solicitado a criar um PRD (Product Requirements Document), siga esta estrutura padronizada.

## Instrucoes

1. Sempre preencha todas as secoes
2. Use dados concretos quando disponiveis
3. Seja especifico nos criterios de aceite
4. Priorize requisitos (P0 = critico, P1 = importante, P2 = nice-to-have)

## Estrutura do PRD

```markdown
# PRD: [Nome da Feature]

**Status:** Draft | In Review | Approved
**Autor:** [Nome]
**Data:** YYYY-MM-DD
**Issue:** #[numero]

---

## 1. Problema

### Qual dor estamos resolvendo?
[Descreva o problema de forma clara e objetiva]

### Quem sente essa dor?
[Persona afetada - role, contexto, frequencia]

### Dados que comprovam
[Metricas, feedback, tickets de suporte]

---

## 2. Objetivos

| Metrica | Baseline | Meta | Como medir |
|---------|----------|------|------------|
| [Nome] | [Atual] | [Desejado] | [Instrumentacao] |

---

## 3. Escopo

### IN (faremos)
- [ ] Item 1
- [ ] Item 2

### OUT (nao faremos)
- Item 1 (motivo)
- Item 2 (motivo)

---

## 4. Requisitos Funcionais

| ID | Requisito | Criterio de Aceite | Prioridade |
|----|-----------|-------------------|------------|
| RF-001 | [Descricao] | [Como testar] | P0 |
| RF-002 | [Descricao] | [Como testar] | P1 |

---

## 5. Requisitos Nao-Funcionais

| Aspecto | Requisito | Limite |
|---------|-----------|--------|
| Performance | Latencia p95 | < 200ms |
| Disponibilidade | Uptime | 99.9% |
| Seguranca | [Requisito] | [Limite] |

---

## 6. Riscos e Dependencias

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|--------------|---------|-----------|
| [Descricao] | Alta/Media/Baixa | Alto/Medio/Baixo | [Acao] |

### Dependencias
- [ ] [Descricao da dependencia]

---

## 7. Timeline (Opcional)

| Fase | Entregavel | Estimativa |
|------|-----------|------------|
| Discovery | PRD aprovado | - |
| Design | TRD + Prototipos | - |
| Implementacao | MVP | - |
| Rollout | GA | - |
```

## Exemplo de Uso```
> Crie um PRD para sistema de notificacoes real-time
> Contexto: App SaaS B2B, 10k usuarios, canais in-app/push/email
```