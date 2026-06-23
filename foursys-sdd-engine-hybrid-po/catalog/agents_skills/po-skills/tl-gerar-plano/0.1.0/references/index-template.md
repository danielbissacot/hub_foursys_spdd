# Planos de Implementação — <JIRA_KEY>

**Feature Jira:** [<JIRA_KEY>]
**Documento de referência:** [caminho do ADR ou RFC]
**Total de pastas:** N (0 ou 1 Tech Solution + M User Stories)

## DAG de Execução

```
         ┌───────────────┐
         │ Tech Solution │
         └──────┬────────┘
        ┌───────┼────────┐
        ▼       ▼        ▼
     [US-1]  [US-2]   [US-3]  ← paralelas
```

## Planos por User Story

| US / Tech Solution | Serviços impactados | Tasks | Ordem |
|--------------------|---------------------|-------|-------|
| Tech Solution | `<srv-1>`, `<bff-1>` | 3 | 1º (sequencial, opcional) |
| <US-1-nome> (`<us-1-slug>`) | `<srv-1>`, `<bff-1>` | 5 | 2º (paralelo) |
| <US-2-nome> (`<us-2-slug>`) | `<srv-1>`, `<fed-1>` | 4 | 2º (paralelo) |

## Localização dos planos por serviço

| Serviço | US / Tech Solution | Path |
|---------|--------------------|------|
| `<srv-1>` | Tech Solution | `../<srv-1>/specs/tech-solution/` |
| `<bff-1>` | Tech Solution | `../<bff-1>/specs/tech-solution/` |
| `<srv-1>` | <us-1-slug> | `../<srv-1>/specs/<us-1-slug>/` |
| `<bff-1>` | <us-1-slug> | `../<bff-1>/specs/<us-1-slug>/` |
| `<srv-1>` | <us-2-slug> | `../<srv-1>/specs/<us-2-slug>/` |
| `<fed-1>` | <us-2-slug> | `../<fed-1>/specs/<us-2-slug>/` |

## Artefatos por Pasta (consolidado)

| Serviço | Pasta | intents.md | bdd-scenarios.md | Tasks | Status |
|---------|-------|------------|------------------|-------|--------|
| `<srv-1>` | `specs/tech-solution/` | ✅ | ✅ | 2 files | [ ] Pendente |
| `<bff-1>` | `specs/tech-solution/` | ✅ | ✅ | 1 file | [ ] Pendente |
| `<srv-1>` | `specs/<us-1-slug>/` | ✅ | ✅ | 3 files | [ ] Pendente |
| `<bff-1>` | `specs/<us-1-slug>/` | ✅ | ✅ | 2 files | [ ] Pendente |
| `<srv-1>` | `specs/<us-2-slug>/` | ✅ | ✅ | 2 files | [ ] Pendente |
| `<fed-1>` | `specs/<us-2-slug>/` | ✅ | ✅ | 2 files | [ ] Pendente |

## Serviços x User Stories

| Serviço | Tipo | Tech Solution | US-1 | US-2 | US-3 |
|---------|------|---------------|------|------|------|
| `<srv-1>` | srv | ✅ | ✅ | ✅ | — |
| `<bff-1>` | bff | ✅ | ✅ | — | — |
| `<fed-1>` | fed | — | — | ✅ | ✅ |
