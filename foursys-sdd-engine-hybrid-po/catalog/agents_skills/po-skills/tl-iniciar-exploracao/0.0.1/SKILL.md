---
name: 'tl-iniciar-exploracao'
description: |
  Conduz exploração técnica estruturada de uma feature Jira antes do refinamento
  formal. Valida viabilidade, captura gaps de requisitos e discute opções de
  arquitetura. Invoque ao ver "explorar feature", "validar viabilidade", "discutir
  abordagens", "entender a feature antes de refinar".
metadata:
  version: "0.0.1"
---

# Exploração técnica de features

Conduz uma exploração técnica estruturada de uma feature do Jira antes do refinamento.

> 💡 **Pipeline:** `tl-iniciar-exploracao` (opcional) → `tl-refinar-feature` → `gerar-user-story` → `tl-gerar-plano` → `tl-executar-implementacao`

<HARD-GATE>
Não consolide a exploração em documento final sem antes ter explorado todas as dimensões relevantes com o usuário e obtido respostas para as questões críticas. Não invente informações.
</HARD-GATE>

## Pré-requisitos

O workspace deve conter o repositório de documentação (`<centro-de-custo>-doc-<projeto>`) e os repositórios dos micro serviços e frontends na mesma pasta pai.

A nomenclatura dos repositórios segue o padrão: `<centro-de-custo>-<tipo>-<nome-serviço>`.

Exemplo do workspace:

workspace
├── bff — Backend for Frontend         (ex: dupe-bff-itr-opt)
├── doc — Repositório de documentação  (ex: dupe-doc-opt)
├── fun — Function serverless          (ex: dupe-fun-bole)
├── lib — Biblioteca compartilhada     (ex: dupe-lib-opt-dominios)
├── srv — Micro serviço backend        (ex: dupe-srv-duple-opt)
├── srv — Microfrontend                (ex: dupe-fed-shell)
└── fed — Microfrontend                (ex: dupe-fed-opt)

> Se o repositório de documentação não existir no workspace, pergunte ao usuário o caminho correto antes de prosseguir ou se ele precisa de ajuda para configurar.

## Processo

### Passo 1: Buscar feature no Jira

Carregue a skill `jira-api` com os seguintes parâmetros:
- OPERACAO: `get-issue`
- JIRA_KEY: chave da feature fornecida (ex: DUPE-1234)

```bash
python skills/jira-api/scripts/jira_cli.py get-issue --key ${{jira-key}}
```

Extraia: **nome**, **descrição**, **regras de negócio**, **requisitos** e **critérios de aceite**.

### Passo 2: Mapear serviços do workspace

Carregue a skill `service-mapper` com os seguintes parâmetros:
- JIRA_KEY: chave da feature
- FEATURE_CONTEXT: resumo extraído no Passo 1 (nome, descrição, regras, critérios de aceite)
- WORKSPACE_PATH: caminho do workspace com os repositórios

A skill retornará a tabela de serviços e os service briefs. Salva:
- Mapeamento compartilhado: `<centro-de-custo>-doc-<projeto>/workspace-mapping.md` (reutilizável entre features)
- Impacto na feature: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/feature-impact.md`

### Passo 3: Conduzir exploração

Carregue a skill `explorar-feature` com os seguintes parâmetros:
- JIRA_KEY: chave da feature
- FEATURE_CONTEXT: contexto completo extraído no Passo 1 (nome, descrição, regras, critérios de aceite)
- CLASSIFICACAO: infira `nova-funcionalidade` ou `alteracao` pelo contexto da feature
- DOC_PATH: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/`
- SERVICE_MAPPING: tabela resumo de serviços e impacto retornada pelo Passo 2

A skill conduz a exploração conversacional e salva o resultado em
`<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/exploracao.md`.

### Passo 4: Terminal State

Após a skill concluir, apresente:

```
## ✅ Exploração concluída

**Artefatos gerados:**
- Mapeamento de serviços: `<centro-de-custo>-doc-<projeto>/workspace-mapping.md`
- Impacto na feature: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/feature-impact.md`
- Exploração técnica: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/exploracao.md`

### Próximos passos
1. **Resolver pendências** — [N] perguntas pendentes (se houver)
2. **Refinar a feature (em nova sessão):**
   `tl-refinar-feature <JIRA_KEY>`
```

**NÃO invoque automaticamente** `tl-refinar-feature` nesta sessão. Apresente o comando para o usuário invocar separadamente, garantindo contexto limpo.

