---
name: tech-spec-documentation
description: Gera documentação técnica padronizada (PRD, TRD, RFC, ADR, User Stories) seguindo templates definidos e boas práticas de engenharia.
metadata:
  version: "0.0.1"
---

## Uso

### Via Prompt

```
> Crie um PRD para [feature] usando o template em .github/skills/tech-spec-documentation/prd-template.md
> Crie um TRD para [feature] usando o template em .github/skills/tech-spec-documentation/trd-template.md
```

### Via Script

```bash
# Gerar PRD
.github/skills/documentation/scripts/generate-prd.sh "Sistema de Notificações" docs/prd/

# Validar documentação
.github/skills/documentation/scripts/validate-docs.sh docs/
```

## Estrutura de Saída Recomendada

```
docs/
├── prd/
│   ├── PRD-001-health-check.md
│   └── PRD-002-notifications.md
├── stories/
│   ├── US-12313.md
│   ├── US-12313-JIRA.md
│   ├── US-1234.md
│   └── US-1234-JIRA.md
├── trd/
│   ├── TRD-001-health-check.md
│   └── TRD-002-notifications.md
├── rfc/
│   └── RFC-002-realtime-protocol.md
├── adr/
│   └── ADR-002-websocket-socketio.md
└── diagrams/
    ├── architecture.mmd
    └── sequence-notifications.mmd
```

## Workflow Completo

```mermaid
flowchart LR
    ISSUE[Issue] --> PRD[PRD]
    PRD --> TRD[TRD]
    TRD --> RFC[RFC]
    RFC --> ADR[ADR]
    ADR --> CODE[Código]
    CODE --> PR[Pull Request]
```

## Integrações

- Use a ferramenta `diagramas_gerar_diagrama` da BIA Tech MCP para a geração dos diagramas.

- Use o `./scripts/convert-md-to-jira` para converter arquivos markdown para a sintaxe do Jira quando necessário.