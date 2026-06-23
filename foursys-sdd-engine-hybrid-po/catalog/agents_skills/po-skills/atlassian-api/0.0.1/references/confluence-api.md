# Confluence REST API — Referência Rápida

> Referência dos endpoints utilizados pelos scripts desta skill.
> Base URL: `${CONFLUENCE_BASE_URL}/rest/api`
> Autenticação: Bearer Token (`ATLASSIAN_TOKEN`)

---

## GET Space

Retorna detalhes de um espaço Confluence.

```
GET /rest/api/space/{spaceKey}
```

**Parâmetros de Query:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `expand` | string | Campos a expandir (ex: `description.plain`, `homepage`) |

**Exemplo:**

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "$CONFLUENCE_BASE_URL/rest/api/space/MYSPACE?expand=description.plain"
```

**Resposta (200):**

```json
{
  "id": 12345,
  "key": "MYSPACE",
  "name": "My Space",
  "type": "global",
  "description": {
    "plain": {
      "value": "Descrição do espaço",
      "representation": "plain"
    }
  },
  "_links": {
    "webui": "/display/MYSPACE",
    "self": "https://confluence.example.com/rest/api/space/MYSPACE"
  }
}
```

---

## GET Content in Space

Lista páginas e conteúdos dentro de um espaço, com suporte a paginação.

```
GET /rest/api/space/{spaceKey}/content
```

**Parâmetros de Query:**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `expand` | string | — | Campos a expandir (ex: `history`, `body.view`) |
| `limit` | int | 25 | Máximo de resultados por página |
| `start` | int | 0 | Índice inicial para paginação |

**Exemplo:**

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "$CONFLUENCE_BASE_URL/rest/api/space/MYSPACE/content?expand=history&limit=10&start=0"
```

**Resposta (200):**

```json
{
  "page": {
    "results": [
      {
        "id": "2476340340",
        "type": "page",
        "status": "current",
        "title": "Minha Página",
        "history": {
          "createdDate": "2024-01-15T10:30:00.000Z",
          "lastUpdated": {
            "when": "2024-06-20T14:00:00.000Z"
          }
        }
      }
    ],
    "start": 0,
    "limit": 10,
    "size": 1
  }
}
```

---

## GET Content by ID

Retorna o conteúdo completo de uma página pelo seu ID.

```
GET /rest/api/content/{id}
```

**Parâmetros de Query:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `expand` | string | Campos a expandir. Usar `body.view` para HTML renderizado ou `body.storage` para Storage Format (XHTML) |

**Exemplo:**

```bash
# Obter HTML renderizado
curl -s -H "Authorization: Bearer $TOKEN" \
  "$CONFLUENCE_BASE_URL/rest/api/content/2476340340?expand=body.view,version,space"

# Obter Storage Format (XHTML)
curl -s -H "Authorization: Bearer $TOKEN" \
  "$CONFLUENCE_BASE_URL/rest/api/content/2476340340?expand=body.storage,version,space"
```

**Resposta (200):**

```json
{
  "id": "2476340340",
  "type": "page",
  "status": "current",
  "title": "Minha Página",
  "space": {
    "key": "MYSPACE"
  },
  "version": {
    "number": 5
  },
  "body": {
    "view": {
      "value": "<h1>Título</h1><p>Conteúdo renderizado...</p>",
      "representation": "view"
    }
  },
  "_links": {
    "webui": "/display/MYSPACE/Minha+P%C3%A1gina",
    "self": "https://confluence.example.com/rest/api/content/2476340340"
  }
}
```

---

## GET Content by Title

Busca uma página por título dentro de um espaço.

```
GET /rest/api/content
```

**Parâmetros de Query:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `spaceKey` | string | Key do espaço |
| `title` | string | Título exato da página |
| `expand` | string | Campos a expandir |

**Exemplo:**

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "$CONFLUENCE_BASE_URL/rest/api/content?spaceKey=MYSPACE&title=Minha%20P%C3%A1gina&expand=body.view,version"
```

**Resposta (200):**

```json
{
  "results": [
    {
      "id": "2476340340",
      "type": "page",
      "title": "Minha Página",
      "body": { "view": { "value": "..." } },
      "version": { "number": 5 }
    }
  ],
  "start": 0,
  "limit": 25,
  "size": 1
}
```

---

## POST Content (Create Page)

Cria uma nova página no Confluence.

```
POST /rest/api/content
```

**Request Body:**

```json
{
  "type": "page",
  "title": "Nova Página",
  "space": {
    "key": "MYSPACE"
  },
  "ancestors": [
    { "id": "PARENT_PAGE_ID" }
  ],
  "body": {
    "storage": {
      "value": "<p>Conteúdo em Storage Format</p>",
      "representation": "storage"
    }
  }
}
```

> O campo `ancestors` é opcional. Se omitido, a página é criada na raiz do espaço.

**Exemplo:**

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"type":"page","title":"Nova Página","space":{"key":"MYSPACE"},"body":{"storage":{"value":"<p>Conteúdo</p>","representation":"storage"}}}' \
  "$CONFLUENCE_BASE_URL/rest/api/content"
```

**Resposta (200):**

```json
{
  "id": "9876543210",
  "type": "page",
  "title": "Nova Página",
  "space": { "key": "MYSPACE" },
  "version": { "number": 1 },
  "_links": {
    "webui": "/display/MYSPACE/Nova+P%C3%A1gina"
  }
}
```

---

## PUT Content (Update Page)

Atualiza o conteúdo de uma página existente. Requer número de versão incrementado.

```
PUT /rest/api/content/{id}
```

**Request Body:**

```json
{
  "type": "page",
  "title": "Título Atualizado",
  "version": {
    "number": 6
  },
  "body": {
    "storage": {
      "value": "<p>Conteúdo atualizado</p>",
      "representation": "storage"
    }
  }
}
```

> O campo `version.number` deve ser o número da versão atual + 1. Obtenha a versão atual via GET antes de atualizar.

**Exemplo:**

```bash
# 1. Obter versão atual
CURRENT_VERSION=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "$CONFLUENCE_BASE_URL/rest/api/content/2476340340?expand=version" | jq '.version.number')

# 2. Atualizar com versão incrementada
curl -s -H "Authorization: Bearer $TOKEN" \
  -X PUT \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"page\",\"title\":\"Título\",\"version\":{\"number\":$((CURRENT_VERSION+1))},\"body\":{\"storage\":{\"value\":\"<p>Novo conteúdo</p>\",\"representation\":\"storage\"}}}" \
  "$CONFLUENCE_BASE_URL/rest/api/content/2476340340"
```

**Resposta (200):**

```json
{
  "id": "2476340340",
  "type": "page",
  "title": "Título Atualizado",
  "version": { "number": 6 },
  "_links": {
    "webui": "/display/MYSPACE/T%C3%ADtulo+Atualizado"
  }
}
```

---

## GET Search (CQL)

Busca conteúdo no Confluence usando CQL (Confluence Query Language).

```
GET /rest/api/content/search
```

**Parâmetros de Query:**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `cql` | string | — | Query CQL (ex: `text ~ "busca" AND space = "MYSPACE"`) |
| `limit` | int | 25 | Máximo de resultados |
| `start` | int | 0 | Índice para paginação |

**Exemplos de CQL:**

| CQL | Descrição |
|-----|-----------|
| `text ~ "deploy"` | Busca por termo em todo conteúdo |
| `text ~ "deploy" AND space = "MYSPACE"` | Busca por termo em espaço específico |
| `title = "Minha Página"` | Busca por título exato |
| `title ~ "arquitetura" AND type = "page"` | Busca por título parcial, apenas páginas |

**Exemplo:**

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  --data-urlencode "cql=text ~ \"deploy\" AND space = \"MYSPACE\"" \
  "$CONFLUENCE_BASE_URL/rest/api/content/search?limit=10"
```

**Resposta (200):**

```json
{
  "results": [
    {
      "id": "2476340340",
      "type": "page",
      "status": "current",
      "title": "Deploy Guide",
      "excerpt": "...trecho com o termo <b>deploy</b>...",
      "space": { "key": "MYSPACE", "name": "My Space" },
      "_links": {
        "webui": "/display/MYSPACE/Deploy+Guide"
      }
    }
  ],
  "start": 0,
  "limit": 10,
  "totalSize": 3
}
```

---

## Códigos de Erro Comuns

| Código | Significado | Causa Comum |
|--------|-------------|-------------|
| 401 | Unauthorized | Credenciais inválidas ou expiradas |
| 403 | Forbidden | Sem permissão para o recurso |
| 404 | Not Found | Espaço, página ou ID inexistente |
| 409 | Conflict | Título duplicado ou conflito de versão |
| 429 | Too Many Requests | Rate limiting atingido |
