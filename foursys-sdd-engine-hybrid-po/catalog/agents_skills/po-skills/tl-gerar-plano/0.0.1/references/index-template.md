# Planos de Implementação — <JIRA_KEY>

**Feature Jira:** [JIRA_KEY]
**Documento de referência:** [caminho do ADR ou RFC]
**Total de planos:** N (1 Tech Solution + M User Stories)

## DAG de Execução

```
         ┌──────────────┐
         │ Tech Solution │
         └──────┬───────┘
        ┌───────┼───────┐
        ▼       ▼       ▼
     [US-1]  [US-2]  [US-3]  ← paralelas
```

## Planos

| Plano | US/Tech Solution | Serviços | Tasks | Ordem |
|-------|-----------------|----------|-------|-------|
| [plano-tech-solution.md](./plano-tech-solution.md) | Tech Solution | srv, bff | 3 | 1º (sequencial) |
| [plano-consulta-saldo.md](./plano-consulta-saldo.md) | Consulta de saldo | srv, bff | 5 | 2º (paralelo) |
| [plano-envio-proposta.md](./plano-envio-proposta.md) | Envio de proposta | srv, fed | 4 | 2º (paralelo) |

## Serviços x User Stories

| Serviço | Tipo | Tech Solution | US-1 | US-2 | US-3 |
|---------|------|--------------|------|------|------|
| `dupe-srv-opt` | srv | ✅ | ✅ | ✅ | — |
| `dupe-bff-itr-opt` | bff | ✅ | ✅ | — | — |
| `dupe-fed-opt` | fed | — | — | — | ✅ |
