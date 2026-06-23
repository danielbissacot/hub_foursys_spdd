---
name: service-mapper
description: |
  Mapeia todos os repositórios de um workspace, extrai responsabilidades, APIs e integrações
  de cada serviço, e produz tabela de impacto para uma feature específica. Use sempre que
  precisar identificar quais serviços são afetados por uma feature antes do refinamento
  técnico, ao construir workspace-mapping.md, ou ao analisar impacto em múltiplos
  microsserviços. Invoque ao ver pedidos como "mapear serviços", "quais repos são afetados",
  "mapeamento de workspace", "impacto em serviços" — mesmo que o usuário não use esses
  termos exatos.
metadata:
  version: "0.0.1"
---

# Service Mapper — Mapeamento de Repositórios e Impacto de Feature

## Por que esta skill existe

Antes de explorar ou refinar uma feature, precisamos saber quais serviços existem e o que
fazem. Esta skill produz um **service brief** leve por repositório — propósito de negócio,
casos de uso e integrações — sem gerar documentação completa. Opera em sub-agente,
mantendo o contexto do orquestrador limpo.

## Entradas esperadas

Quem invoca esta skill deve fornecer:

- **JIRA_KEY** — chave do épico/feature (ex: DUPE-1234)
- **FEATURE_CONTEXT** — resumo da feature (nome, descrição, regras, critérios de aceite)
- **WORKSPACE_PATH** — caminho da pasta que contém os repositórios

## Processo

### 1. Listar repositórios

Liste os repositórios no workspace:

```bash
ls <WORKSPACE_PATH>
```

Para cada repositório, infira o tipo pela nomenclatura `<cc>-<tipo>-<nome>`:

| Prefixo    | Tipo | Papel típico                         |
|------------|------|--------------------------------------|
| `*-bff-*`  | bff  | Backend for Frontend, orquestração   |
| `*-srv-*`  | srv  | Lógica de negócio, domínio           |
| `*-fed-*`  | fed  | Microfrontend Angular                |
| `*-fun-*`  | fun  | Serverless, event-driven             |
| `*-lib-*`  | lib  | Código compartilhado                 |
| `*-doc-*`  | doc  | Documentação (pule na análise)       |

### 2. Extrair service brief

Para cada repositório (exceto `*-doc-*`), produza um **service brief** com análise rápida:

1. **Se `README.md` existir:** use-o como fonte primária para extrair as informações abaixo.
2. **Se `README.md` não existir ou estiver incompleto:** analise os arquivos estruturais do projeto para inferir:
   - `pom.xml` / `package.json` / `build.gradle` — dependências e tipo de projeto
   - Entry points principais (`*Controller.java`, `*Module.ts`, `routes/`, `main.*`)
   - Configs de integração (`application.yml`, `kafka`, `feign`, `mongo`)

> **NÃO gere READMEs completos.** O objetivo é um brief rápido, não documentação. Se precisar de README completo, use a skill `readme-generator` separadamente.

3. Extraia para cada serviço:
   - **Propósito de negócio** (1-2 frases — o que este serviço faz no contexto do produto)
   - **Casos de uso principais** (lista dos fluxos mais importantes)
   - **Integrações** (APIs expostas, APIs consumidas, eventos Kafka, filas, bancos de dados)

### 3. Produzir workspace-mapping.md

O workspace-mapping é um artefato **compartilhado entre features** — salve na raiz de `<centro-de-custo>-doc-<projeto>/`:

1. **Se `<centro-de-custo>-doc-<projeto>/workspace-mapping.md` já existir:** leia o conteúdo atual e faça merge incremental — adicione repositórios novos, atualize briefs de repositórios que mudaram, mantenha os existentes.
2. **Se não existir:** crie do zero.

Salve em `<centro-de-custo>-doc-<projeto>/workspace-mapping.md`:

```markdown
# Workspace Mapping

| Repositório | Tipo | Propósito de negócio |
|-------------|------|---------------------|
| ... | ... | ... |

## Service Briefs

### <nome-repositorio> (tipo)

**Propósito:** [1-2 frases]

**Casos de uso principais:**
- [caso 1]
- [caso 2]

**Integrações:**
- Expõe: [APIs REST, eventos publicados]
- Consome: [APIs de outros serviços, eventos, bancos]
```

### 4. Identificar impacto na feature

Com o mapeamento e o FEATURE_CONTEXT, determine quais serviços serão impactados pela
feature. Para cada serviço impactado, documente o motivo — quanto mais específico, melhor
para o refinamento (ex: "exposição de novo endpoint REST", "nova collection MongoDB", "novo
tópico Kafka consumido").

Salve a análise de impacto em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/feature-impact.md`:

```markdown
# Feature Impact — <JIRA_KEY>

| Repositório | Tipo | Motivo do impacto |
|-------------|------|-------------------|
| ... | ... | ... |
```

### 5. Retornar ao orquestrador

Retorne **apenas** as duas tabelas abaixo — os arquivos completos já estão em disco,
não os copie no retorno. O orquestrador só precisa do resumo para tomar decisões.

```markdown
## Tabela de Serviços (todos)

| Repositório | Tipo | Responsabilidade (1 frase) |
|-------------|------|---------------------------|
| ... | ... | ... |

## Serviços Impactados pela Feature

| Repositório | Tipo | Motivo do impacto |
|-------------|------|-------------------|
| ... | ... | ... |

**Arquivos gerados:**
- Mapeamento de serviços: `<centro-de-custo>-doc-<projeto>/workspace-mapping.md`
- Impacto na feature: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/feature-impact.md`
```
