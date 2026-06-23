---
jira-key: <JIRA_KEY>
plan-slug: <tech-solution-ou-us-slug>
plan-type: <tech-solution|user-story>
doc-referencia: <caminho-do-adr-ou-rfc>
source-story: <caminho-da-us> # omitir para tech-solution
tech-solution: ../tech-solution/ # omitir se esta pasta for o próprio tech-solution
servicos:
  - nome: <nome-do-repositorio>
    tipo: <srv|bff|fed|fun|lib>
    repo: ../<nome-do-repositorio>
    independente: true
---

# [Título da US ou Tech Solution] — Intents

## Objetivo

[Explique o resultado de negócio/técnico esperado e o porquê desta implementação existir.]

## Escopo

### In scope
- [Item de escopo real]

### Out of scope
- [Limite explícito do que não será implementado]

## Serviços impactados

| Serviço | Tipo | Papel nesta entrega |
|---------|------|---------------------|
| `<nome-do-repositorio>` | `srv` | [responsabilidade específica] |

## Artefatos compartilhados disponíveis

> Omitir se não houver Tech Solution aplicável.

| Artefato | Serviço | Path | Como será usado |
|----------|---------|------|-----------------|
| `PropostaDTO` | `dupe-srv-opt` | `src/main/.../dto/PropostaDTO.java` | [uso real nesta pasta] |

## Pré-requisitos

- [ ] [Pré-requisito real e verificável]

## Dependências e sequencing

- [Dependência entre serviços, contratos ou ordem de execução]
