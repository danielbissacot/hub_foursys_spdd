# Jira REST API — Referência Rápida

> Referência dos endpoints utilizados pelos scripts desta skill.
> Base URL: `${JIRA_BASE_URL}/rest/api/latest`
> Autenticação: Bearer Token (`ATLASSIAN_TOKEN`)

---

## GET Issue

Retorna detalhes de uma issue Jira pela sua key.

```
GET /rest/api/latest/issue/{issueKey}
```

**Parâmetros de Query:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `fields` | string | Campos a retornar separados por vírgula (ex: `summary,description,status,assignee`) |
| `expand` | string | Campos a expandir (ex: `renderedFields`, `changelog`) |

**Exemplo:**

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "$JIRA_BASE_URL/rest/api/latest/issue/PROJ-123?fields=summary,description,status,assignee,subtasks,components"
```

**Resposta (200):**

```json
{
  "id": "10001",
  "key": "PROJ-123",
  "self": "https://jira.example.com/rest/api/latest/issue/10001",
  "fields": {
    "summary": "Implementar integração com API",
    "description": "h2. Contexto\nDescrição em *Wiki Markup*...",
    "status": {
      "name": "In Progress",
      "statusCategory": { "name": "In Progress" }
    },
    "assignee": {
      "displayName": "João Silva",
      "emailAddress": "joao.silva@empresa.com"
    },
    "subtasks": [
      {
        "key": "PROJ-124",
        "fields": {
          "summary": "Subtask 1",
          "status": { "name": "To Do" }
        }
      }
    ],
    "components": [
      { "name": "Backend" }
    ]
  }
}
```

**Campos padrão** (quando `fields` não é especificado):
`summary`, `description`, `status`, `assignee`

---

## POST Search (JQL)

Busca issues usando JQL (Jira Query Language).

```
POST /rest/api/latest/search
```

**Request Body:**

```json
{
  "jql": "project = PROJ AND status = 'In Progress'",
  "fields": ["summary", "status", "assignee"],
  "maxResults": 15,
  "startAt": 0
}
```

**Parâmetros do Body:**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `jql` | string | — | Query JQL |
| `fields` | array | todos | Campos a retornar |
| `maxResults` | int | 50 | Máximo de resultados |
| `startAt` | int | 0 | Índice para paginação |

**Exemplos de JQL:**

| JQL | Descrição |
|-----|-----------|
| `project = PROJ` | Todas as issues de um projeto |
| `project = PROJ AND status = "In Progress"` | Issues em progresso |
| `assignee = currentUser()` | Issues atribuídas ao usuário autenticado |
| `project = PROJ AND type = Story AND sprint in openSprints()` | Stories na sprint atual |
| `text ~ "integração" AND project = PROJ` | Busca por texto em issues |

**Exemplo:**

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jql":"project = PROJ AND status = \"In Progress\"","fields":["summary","status","assignee"],"maxResults":15,"startAt":0}' \
  "$JIRA_BASE_URL/rest/api/latest/search"
```

**Resposta (200):**

```json
{
  "startAt": 0,
  "maxResults": 15,
  "total": 42,
  "issues": [
    {
      "id": "10001",
      "key": "PROJ-123",
      "fields": {
        "summary": "Implementar integração",
        "status": { "name": "In Progress" },
        "assignee": { "displayName": "João Silva" }
      }
    }
  ]
}
```

---

## POST Issue (Create)

Cria uma nova issue no Jira.

```
POST /rest/api/latest/issue
```

**Request Body (Issue):**

```json
{
  "fields": {
    "project": { "key": "PROJ" },
    "issuetype": { "name": "Story" },
    "summary": "Nova funcionalidade",
    "description": "Descrição em Jira Wiki Markup"
  }
}
```

**Request Body (Subtask):**

```json
{
  "fields": {
    "project": { "key": "PROJ" },
    "issuetype": { "name": "Sub-task" },
    "parent": { "key": "PROJ-123" },
    "summary": "Subtask da story",
    "description": "Descrição da subtask"
  }
}
```

**Exemplo:**

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"fields":{"project":{"key":"PROJ"},"issuetype":{"name":"Story"},"summary":"Nova funcionalidade","description":"h2. Contexto\nDescrição..."}}' \
  "$JIRA_BASE_URL/rest/api/latest/issue"
```

**Resposta (201):**

```json
{
  "id": "10002",
  "key": "PROJ-456",
  "self": "https://jira.example.com/rest/api/latest/issue/10002"
}
```

---

## PUT Issue (Update Description)

Atualiza campos de uma issue existente.

```
PUT /rest/api/latest/issue/{issueKey}
```

**Request Body:**

```json
{
  "fields": {
    "description": "Nova descrição em Wiki Markup"
  }
}
```

**Exemplo:**

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  -X PUT \
  -H "Content-Type: application/json" \
  -d '{"fields":{"description":"h2. Contexto atualizado\nNova descrição..."}}' \
  "$JIRA_BASE_URL/rest/api/latest/issue/PROJ-123"
```

**Resposta:** `204 No Content` (sucesso, sem body)

---

## GET Transitions

Lista as transições disponíveis para uma issue (baseado no status atual).

```
GET /rest/api/latest/issue/{issueKey}/transitions
```

**Exemplo:**

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "$JIRA_BASE_URL/rest/api/latest/issue/PROJ-123/transitions"
```

**Resposta (200):**

```json
{
  "transitions": [
    {
      "id": "21",
      "name": "Start Progress",
      "to": {
        "name": "In Progress",
        "statusCategory": { "name": "In Progress" }
      }
    },
    {
      "id": "31",
      "name": "Done",
      "to": {
        "name": "Done",
        "statusCategory": { "name": "Done" }
      }
    }
  ]
}
```

---

## POST Transitions (Change Status)

Executa uma transição para mudar o status de uma issue.

```
POST /rest/api/latest/issue/{issueKey}/transitions
```

**Request Body:**

```json
{
  "transition": {
    "id": "21"
  }
}
```

> Primeiro, use GET transitions para obter os IDs disponíveis. Então, execute POST com o `transition.id` desejado.

**Exemplo:**

```bash
# 1. Listar transições disponíveis
curl -s -H "Authorization: Bearer $TOKEN" \
  "$JIRA_BASE_URL/rest/api/latest/issue/PROJ-123/transitions"

# 2. Executar transição (ex: id "21" = "Start Progress")
curl -s -H "Authorization: Bearer $TOKEN" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"transition":{"id":"21"}}' \
  "$JIRA_BASE_URL/rest/api/latest/issue/PROJ-123/transitions"
```

**Resposta:** `204 No Content` (sucesso, sem body)

---

## Códigos de Erro Comuns

| Código | Significado | Causa Comum |
|--------|-------------|-------------|
| 400 | Bad Request | JQL inválido, campos obrigatórios ausentes, tipo de issue inválido |
| 401 | Unauthorized | Credenciais inválidas ou expiradas |
| 403 | Forbidden | Sem permissão para o projeto ou operação |
| 404 | Not Found | Issue key inexistente |
| 429 | Too Many Requests | Rate limiting atingido |
