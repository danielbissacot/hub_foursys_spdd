---
name: tech-spec-documentation
description: |
  Gera documentação técnica padronizada (PRD, TRD, RFC, ADR) seguindo templates definidos
  e boas práticas de engenharia. Suporta dois modos: interativo (sessão de perguntas com o
  usuário) e direto (recebe contexto completo de um orquestrador como tl-refinar-feature).
  Use quando precisar criar ADR para registrar uma decisão arquitetural, RFC para propor
  uma mudança técnica, ou PRD/TRD para detalhar requisitos ou solução técnica. Invoque ao
  ver pedidos como "gerar ADR", "criar RFC", "documentar a decisão", "escrever TRD",
  "criar PRD" — ou quando um comando do pipeline (tl-refinar-feature, tl-gerar-plano)
  precisar produzir um documento técnico formal.
metadata:
  version: "1.0.0"
---

## Modos de execução

### 1. Determinar o modo

**Modo interativo** — quando o usuário solicita diretamente a criação de um documento (ex: "crie um ADR para..."). Neste modo, conduzir o workflow interativo correspondente **antes** de gerar o documento.

**Modo direto** — quando um agente orquestrador (ex: `tl-refinar-feature`) invoca esta skill passando contexto completo (feature, decisões, alternativas, trade-offs). Neste modo, pular o workflow interativo e gerar o documento diretamente a partir do contexto recebido.

> **Como distinguir:** se o chamador fornece um bloco estruturado de contexto com seções preenchidas (problema, alternativas, decisão, consequências), usar modo direto. Se o chamador fornece apenas uma descrição breve ou um pedido genérico, usar modo interativo.

### 2. Executar

| Tipo | Workflow interativo | Template |
|------|---------------------|----------|
| **PRD** | `references/prd-workflow.md` | `references/prd-template.md` |
| **TRD** | `references/trd-workflow.md` | `references/trd-template.md` |
| **ADR** | `references/adr-workflow.md` | `references/adr-template.md` |
| **RFC** | `references/rfc-workflow.md` | `references/rfc-template.md` |

- **Modo interativo:** ler o workflow correspondente → conduzir sessão de perguntas → ler o template → gerar o documento
- **Modo direto:** ler o template correspondente → gerar o documento a partir do contexto recebido

### 3. Regras de geração (ambos os modos)

- Marcar seções sem informação suficiente como `[PENDENTE: descrição do que falta]` — nunca inventar dados
- Salvar no caminho fornecido pelo orquestrador ou solicitado pelo usuário
- Retornar: caminho do arquivo + uma linha descrevendo o documento (tipo + feature + data)