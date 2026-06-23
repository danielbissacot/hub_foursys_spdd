# Jira REST API — Referência Rápida

> Referência dos endpoints utilizados pela skill `jira-python`.
> Base URL: `${JIRA_BASE_URL}/rest/api/latest`
> Agile API: `${JIRA_BASE_URL}/rest/agile/1.0`
> Autenticação: Bearer Token (`ATLASSIAN_TOKEN`)

---

## Table of Contents

1. [GET Issue](#get-issue)
2. [POST Search (JQL)](#post-search-jql)
3. [POST Issue (Create)](#post-issue-create)
4. [PUT Issue (Update)](#put-issue-update)
5. [GET Transitions](#get-transitions)
6. [POST Transitions (Change Status)](#post-transitions-change-status)
7. [GET Boards (Agile)](#get-boards-agile)
8. [GET Sprints (Agile)](#get-sprints-agile)
9. [GET Sprint Issues (Agile)](#get-sprint-issues-agile)
10. [Error Codes](#error-codes)

---

## GET Issue

```
GET /rest/api/latest/issue/{issueKey}
```

| Query Param | Type | Description |
|-------------|------|-------------|
| `fields` | string | Comma-separated field names |
| `expand` | string | Fields to expand (e.g., `renderedFields`, `changelog`) |

**Default fields:** summary, description, status, assignee

---

## POST Search (JQL)

```
POST /rest/api/latest/search
```

**Body:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `jql` | string | — | JQL query |
| `fields` | array | all | Fields to return |
| `maxResults` | int | 50 | Page size |
| `startAt` | int | 0 | Offset |

**JQL Examples:**

| JQL | Description |
|-----|-------------|
| `project = PROJ` | All issues in project |
| `project = PROJ AND status = "In Progress"` | In-progress issues |
| `assignee = currentUser()` | My issues |
| `project = PROJ AND type = Story AND sprint in openSprints()` | Stories in current sprint |
| `text ~ "keyword" AND project = PROJ` | Full-text search |

---

## POST Issue (Create)

```
POST /rest/api/latest/issue
```

**Body:**
```json
{
  "fields": {
    "project": {"key": "PROJ"},
    "issuetype": {"name": "Story"},
    "summary": "Title",
    "description": "Description in Wiki Markup"
  }
}
```

For subtasks, add `"parent": {"key": "PROJ-123"}`.

**Response (201):** `{"id": "10002", "key": "PROJ-456", "self": "..."}`

---

## PUT Issue (Update)

```
PUT /rest/api/latest/issue/{issueKey}
```

**Body:**
```json
{"fields": {"description": "New description"}}
```

**Response:** `204 No Content`

---

## GET Transitions

```
GET /rest/api/latest/issue/{issueKey}/transitions
```

Returns available transitions with `id`, `name`, and target `to` status.

---

## POST Transitions (Change Status)

```
POST /rest/api/latest/issue/{issueKey}/transitions
```

**Body:** `{"transition": {"id": "21"}}`

First GET transitions to find the ID, then POST to execute.

**Response:** `204 No Content`

---

## GET Boards (Agile)

```
GET /rest/agile/1.0/board
```

| Query Param | Type | Description |
|-------------|------|-------------|
| `type` | string | `scrum` or `kanban` |
| `projectKeyOrId` | string | Filter by project |
| `maxResults` | int | Page size |
| `startAt` | int | Offset |

---

## GET Sprints (Agile)

```
GET /rest/agile/1.0/board/{boardId}/sprint
```

| Query Param | Type | Description |
|-------------|------|-------------|
| `state` | string | `active`, `future`, `closed` |
| `maxResults` | int | Page size |
| `startAt` | int | Offset |

---

## GET Sprint Issues (Agile)

```
GET /rest/agile/1.0/sprint/{sprintId}/issue
```

| Query Param | Type | Description |
|-------------|------|-------------|
| `fields` | string | Comma-separated fields |
| `maxResults` | int | Page size |
| `startAt` | int | Offset |

---

## Error Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 400 | Bad Request | Invalid JQL, missing required fields |
| 401 | Unauthorized | Invalid or expired token |
| 403 | Forbidden | No permission for project/operation |
| 404 | Not Found | Invalid issue key |
| 429 | Too Many Requests | Rate limiting |
