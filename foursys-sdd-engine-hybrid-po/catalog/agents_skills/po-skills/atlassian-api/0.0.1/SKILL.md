---
name: atlassian-api
description: Integração com Jira e Confluence self-hosted via API REST. Permite consultar, criar, editar e exportar páginas Confluence e issues Jira, com conversão bidirecional Markdown ↔ Wiki Markup e Markdown ↔ Confluence Storage Format. Use quando o usuário precisar interagir com Jira (issues, sprints, boards, JQL) ou Confluence (páginas, espaços, busca CQL), criar/editar conteúdo, exportar para Markdown, ou converter entre formatos (Markdown, Wiki Markup, Confluence Storage Format).
metadata:
  version: "0.0.1"
---

# Atlassian API

## Pré-requisitos

### Variáveis de Ambiente

Configure as seguintes variáveis antes de usar os scripts:

```bash
# Personal Access Token (Bearer)
export ATLASSIAN_TOKEN="seu-personal-access-token"

# Base URLs — opcionais, sobrescrevem os padrões abaixo
# export CONFLUENCE_BASE_URL="https://confluence.bradesco.com.br:8443"  # padrão
# export JIRA_BASE_URL="https://jira.bradesco.com.br:8443"              # padrão
```

### Dependências

- `bash` 4+
- `curl`
- `jq`
- `sed` / `awk` (GNU)

O script `common.sh` verifica automaticamente se `curl` e `jq` estão disponíveis.

## Scripts Disponíveis

### Confluence — Leitura

| Script | Descrição | Exemplo |
|--------|-----------|---------|
| `confluence-get-space.sh` | Consultar detalhes de um espaço | `./scripts/confluence-get-space.sh --space MYSPACE` |
| `confluence-get-content.sh` | Listar conteúdos de um espaço | `./scripts/confluence-get-content.sh --space MYSPACE --limit 10` |
| `confluence-get-page.sh` | Ler corpo de uma página | `./scripts/confluence-get-page.sh --id 12345 --format view` |
| `confluence-search.sh` | Buscar páginas por termo (CQL) | `./scripts/confluence-search.sh --query "deploy" --space MYSPACE` |

### Confluence — Escrita

| Script | Descrição | Exemplo |
|--------|-----------|---------|
| `confluence-create-page.sh` | Criar nova página | `./scripts/confluence-create-page.sh --space MYSPACE --title "Página" --file doc.md` |
| `confluence-update-page.sh` | Editar página existente | `./scripts/confluence-update-page.sh --id 12345 --file doc.md` |

### Confluence — Exportação

| Script | Descrição | Exemplo |
|--------|-----------|---------|
| `confluence-export-page.sh` | Exportar página para Markdown | `./scripts/confluence-export-page.sh --id 12345` |

### Jira — Leitura

| Script | Descrição | Exemplo |
|--------|-----------|---------|
| `jira-get-issue.sh` | Consultar issue por key | `./scripts/jira-get-issue.sh --key PROJ-123 --fields summary,status` |
| `jira-search.sh` | Buscar issues via JQL | `./scripts/jira-search.sh --jql "project = PROJ AND status = Open"` |

### Jira — Sprints & Boards (Agile API)

| Script | Descrição | Exemplo |
|--------|-----------|---------|
| `jira-list-boards.sh` | Listar boards acessíveis | `./scripts/jira-list-boards.sh --type scrum --project PROJ` |
| `jira-list-sprints.sh` | Listar sprints de um board | `./scripts/jira-list-sprints.sh --board 140191 --state active` |
| `jira-sprint-report.sh` | Relatório completo da sprint | `./scripts/jira-sprint-report.sh --sprint 233767` |

**Workflow típico para Tech Leads:**

```bash
# 1. Encontrar o board do seu projeto
./scripts/jira-list-boards.sh --type scrum --project SPJJOR

# 2. Listar sprints ativas do board
./scripts/jira-list-sprints.sh --board 140191 --state active

# 3. Gerar relatório da sprint (issues agrupadas por status)
./scripts/jira-sprint-report.sh --sprint 233767
```

O `jira-sprint-report.sh` retorna um JSON estruturado com:
- **sprint**: metadados (nome, datas, goal)
- **summary**: contagem total e por status
- **issuesByStatus**: issues agrupadas por status com tipo, responsável e story points

### Jira — Escrita

| Script | Descrição | Exemplo |
|--------|-----------|---------|
| `jira-create-issue.sh` | Criar issue/subtask | `./scripts/jira-create-issue.sh --project PROJ --type Story --summary "Nova feature"` |
| `jira-update-issue.sh` | Editar descrição de issue | `./scripts/jira-update-issue.sh --key PROJ-123 --description-file desc.md` |
| `jira-transition-issue.sh` | Mudar status de issue | `./scripts/jira-transition-issue.sh --key PROJ-123 --status "In Progress"` |

### Jira — Exportação

| Script | Descrição | Exemplo |
|--------|-----------|---------|
| `jira-export-issue.sh` | Exportar issue para Markdown | `./scripts/jira-export-issue.sh --key PROJ-123` |

### Conversão de Formatos

| Script | Entrada | Saída | Uso |
|--------|---------|-------|-----|
| `convert-html-to-md.sh` | Confluence HTML / Storage Format | Markdown | `cat page.html \| ./scripts/convert-html-to-md.sh` |
| `convert-md-to-wiki.sh` | Markdown | Confluence Wiki Markup | `./scripts/convert-md-to-wiki.sh input.md` |
| `convert-md-to-confluence.sh` | Markdown | Confluence Storage Format (XHTML) | `./scripts/convert-md-to-confluence.sh input.md` |
| `convert-jira-to-md.sh` | Jira Wiki Markup | Markdown | `./scripts/convert-jira-to-md.sh input.txt` |

## Referências

Para detalhes sobre endpoints, parâmetros e exemplos de resposta:

- **Confluence REST API**: [references/confluence-api.md](references/confluence-api.md) — endpoints, parâmetros e exemplos
- **Jira REST API**: [references/jira-api.md](references/jira-api.md) — endpoints, parâmetros e exemplos
- **CQL (Confluence Query Language)**: [references/cql.md](references/cql.md) — sintaxe e operadores para buscas no Confluence
- **Wiki Markup**: [references/wiki-markup.md](references/wiki-markup.md) — referência de formatação Wiki Markup (Jira/Confluence)

Todos os scripts usam `common.sh` para autenticação, validação e tratamento de erros. Credenciais nunca são impressas em logs.

## Operações Não Cobertas pelos Scripts

Quando o usuário solicitar uma operação que **não possui script disponível** na lista acima, siga este processo:

### 1. Consultar a Especificação OpenAPI

Os contratos completos das APIs estão disponíveis em:

- **Confluence**: [assets/confluence-oapi.json](assets/confluence-oapi.json)
- **Jira**: [assets/jira-oapi.json](assets/jira-oapi.json)

Leia o arquivo OpenAPI correspondente para localizar:
- O **path** do endpoint (ex: `/rest/api/content/{id}/label`)
- O **método HTTP** (`GET`, `POST`, `PUT`, `DELETE`)
- Os **parâmetros obrigatórios e opcionais** (`path`, `query`, `body`)
- O **schema do request body** (quando aplicável)

### 2. Construir o curl Manualmente

Com base nas informações do OpenAPI, monte o `curl` seguindo o padrão de autenticação já estabelecido:

```bash
# Leitura de variáveis de ambiente (mesmas usadas pelos scripts)
BASE_URL="${CONFLUENCE_BASE_URL:-https://confluence.bradesco.com.br:8443}"
TOKEN="${ATLASSIAN_TOKEN}"

# Exemplo genérico — adapte path, método e body conforme o OpenAPI
curl -s -X <METHOD> \
  "${BASE_URL}<path>" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '<json-body>'           # omitir para GET/DELETE sem body
```

Para Jira, substitua `CONFLUENCE_BASE_URL` por `JIRA_BASE_URL`:

```bash
BASE_URL="${JIRA_BASE_URL:-https://jira.bradesco.com.br:8443}"
```

### 3. Regras ao Construir o curl

- **Nunca imprimir** o valor de `$ATLASSIAN_TOKEN` na saída.
- Usar `jq` para formatar a resposta JSON quando útil: `| jq '.'`
- Adicionar `-f` ao `curl` para propagar erros HTTP como exit code não-zero.
- Respeitar os tipos dos parâmetros (string, integer, array) conforme definido no schema OpenAPI.
- Para request bodies complexos, montar o JSON inline com `jq -n` para evitar problemas de escaping:

```bash
BODY=$(jq -n \
  --arg title "Título da Página" \
  --arg spaceKey "MYSPACE" \
  '{title: $title, type: "page", space: {key: $spaceKey}}')

curl -s -X POST "${BASE_URL}/rest/api/content" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${BODY}" | jq '.'
```

## Limitações Conhecidas

- Conversões HTML→Markdown via `sed/awk` cobrem ~80% dos casos (headers, listas, links, code blocks, tabelas). Macros Confluence complexas e layouts avançados podem ser simplificados ou ignorados.
- Apenas instâncias self-hosted / Data Center são suportadas (não Atlassian Cloud).
- Autenticação exclusivamente via Personal Access Token (Bearer Token).
- Operações de administração (criação de espaços, gerenciamento de usuários) não são suportadas.
- Anexos/attachments no Confluence não são suportados.

## Boas Práticas de Encoding

### Nunca passe conteúdo HTML/Markdown grande via variável de shell para `jq --arg`

Passar body de páginas via `--arg body "$BODY"` em `jq` e depois `-d "$PAYLOAD"` em `curl` **causa HTTP 500** quando o conteúdo contém:
- Caracteres multibyte (UTF-8: acentos, ç, ã, →, etc.)
- Múltiplas linhas
- Conteúdo maior que alguns KB

**Padrão correto — use sempre `--rawfile` + `-d @file`:**

```bash
# 1. Escreva o conteúdo em arquivo temporário
TMP_BODY=$(mktemp)
TMP_PAYLOAD=$(mktemp)
trap "rm -f '$TMP_BODY' '$TMP_PAYLOAD'" EXIT

printf '%s' "$BODY" > "$TMP_BODY"

# 2. Use --rawfile para ler o arquivo (não --arg)
jq -n \
    --rawfile body "$TMP_BODY" \
    '{ body: { storage: { value: $body, representation: "storage" } } }' \
    > "$TMP_PAYLOAD"

# 3. Passe o payload via -d @arquivo (não -d "$VARIAVEL")
curl ... -d "@${TMP_PAYLOAD}" "$URL"
```

Essa regra se aplica a todos os scripts que recebem conteúdo de página/descrição via `--body <HTML>` ou `--file <MD>`:
- `confluence-create-page.sh`
- `confluence-update-page.sh`
- `jira-update-issue.sh`
