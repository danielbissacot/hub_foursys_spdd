---
name: jira-api
description: Integração com Jira self-hosted (Data Center) via Python puro. Permite consultar, criar, editar, transicionar e exportar issues Jira, gerenciar sprints e boards, e converter entre Markdown e Jira Wiki Markup — tudo sem dependências externas. Use esta skill sempre que o usuário precisar interagir com o Jira (issues, sprints, boards, JQL queries, relatórios de sprint), criar ou editar issues, exportar conteúdo para Markdown, converter formatos de texto, ou automatizar qualquer operação Jira via API REST. Também use quando o usuário mencionar backlog, kanban, scrum, story points, ou qualquer termo relacionado a gestão ágil no Jira.
metadata:
  version: "0.0.1"
---

# Jira Python

Skill para interação com Jira Data Center via API REST, implementada em Python puro (sem dependências externas).

## Pré-requisitos

### Variáveis de Ambiente

```bash
# Personal Access Token (Bearer) — obrigatório
export ATLASSIAN_TOKEN="seu-personal-access-token"

# Proxy
export no_proxy="jira.bradesco.com.br:8443${no_proxy:+,$no_proxy}"
export NO_PROXY="jira.bradesco.com.br:8443${NO_PROXY:+,$NO_PROXY}"

# Base URL — opcional, sobrescreve o padrão
# export JIRA_BASE_URL="https://jira.bradesco.com.br:8443"  # padrão
```

### Dependências

- Python 3.8+
- Nenhuma dependência externa — usa apenas `urllib`, `json`, `ssl` da stdlib

## Como Usar

Existem duas formas de utilizar os scripts:

### 1. Via CLI (linha de comando)

O `jira_cli.py` oferece subcomandos para todas as operações:

```bash
# Consultar uma issue
python scripts/jira_cli.py get-issue --key PROJ-123

# Buscar issues via JQL
python scripts/jira_cli.py search --jql "project = PROJ AND status = 'In Progress'"

# Criar issue
python scripts/jira_cli.py create-issue --project PROJ --type Story --summary "Nova feature"

# Atualizar descrição
python scripts/jira_cli.py update-issue --key PROJ-123 --description "Nova descrição"

# Transicionar issue (mudar status)
python scripts/jira_cli.py transition --key PROJ-123 --status "In Progress"

# Exportar issue como Markdown
python scripts/jira_cli.py export-issue --key PROJ-123

# Listar boards
python scripts/jira_cli.py list-boards --type scrum --project PROJ

# Listar sprints
python scripts/jira_cli.py list-sprints --board 140191 --state active

# Relatório de sprint
python scripts/jira_cli.py sprint-report --sprint 233767
```

### 2. Via import no Python (para automações)

```python
from scripts.jira_client import JiraClient

client = JiraClient()  # usa ATLASSIAN_TOKEN e JIRA_BASE_URL do ambiente

# Buscar issues
results = client.search("project = PROJ AND status = 'In Progress'")
for issue in results["issues"]:
    print(f"{issue['key']}: {issue['fields']['summary']}")

# Criar issue
new_issue = client.create_issue(
    project="PROJ",
    issue_type="Story",
    summary="Nova feature",
    description="Descrição da story"
)

# Sprint report
report = client.sprint_report(sprint_id=233767)
print(f"Sprint: {report['sprint']['name']}")
print(f"Total issues: {report['summary']['total']}")
```

## Scripts Disponíveis

### `scripts/jira_client.py` — Classe principal

A classe `JiraClient` encapsula todas as operações da Jira REST API:

| Método | Descrição |
|--------|-----------|
| `get_issue(key, fields, expand)` | Consultar issue por key |
| `search(jql, fields, max_results, start_at)` | Buscar issues via JQL (uma página) |
| `search_all(jql, fields, page_size)` | Buscar **todas** as issues via JQL com paginação automática |
| `create_issue(project, issue_type, summary, ...)` | Criar issue/subtask |
| `update_issue(key, fields)` | Atualizar campos de issue |
| `transition_issue(key, status)` | Mudar status de issue |
| `export_issue_markdown(key)` | Exportar issue para Markdown |
| `export_issues_markdown(keys)` | Exportar múltiplas issues para Markdown (batch, evita N+1 API calls) |
| `list_boards(board_type, project)` | Listar boards acessíveis |
| `list_sprints(board_id, state)` | Listar sprints de um board |
| `sprint_report(sprint_id, fields)` | Relatório completo de sprint |

### `scripts/jira_cli.py` — Interface de linha de comando

Subcomandos argparse que chamam os métodos do `JiraClient`. Cada subcomando aceita `--help` para ver as opções disponíveis.

### `scripts/converters.py` — Conversão de formatos

| Função | Entrada | Saída |
|--------|---------|-------|
| `jira_wiki_to_markdown(text)` | Jira Wiki Markup | Markdown |
| `markdown_to_jira_wiki(text)` | Markdown | Jira Wiki Markup |

## Workflow Típico para Tech Leads

```bash
# 1. Encontrar o board do seu projeto
python scripts/jira_cli.py list-boards --type scrum --project SPJJOR
# → Use o ID do board retornado em values[0].id para o próximo passo

# 2. Listar sprints ativas (substitua BOARD_ID pelo ID obtido no passo 1)
python scripts/jira_cli.py list-sprints --board BOARD_ID --state active
# → Use o ID da sprint retornado em values[0].id para o próximo passo

# 3. Gerar relatório da sprint (substitua SPRINT_ID pelo ID obtido no passo 2)
python scripts/jira_cli.py sprint-report --sprint SPRINT_ID
```

> **⚠️ Atenção:** `list_boards` e `list_sprints` podem retornar `values` vazio se não
> houver boards/sprints correspondentes. Sempre verifique se `len(values) > 0` antes
> de acessar `values[0]`. Em Python:
>
> ```python
> boards = client.list_boards(board_type="scrum", project="SPJJOR")
> if not boards.get("values"):
>     print("Nenhum board encontrado para este projeto.")
> else:
>     board_id = boards["values"][0]["id"]
> ```

## Operações Não Cobertas

Quando o usuário solicitar uma operação que não possui método no `JiraClient`, consulte a especificação OpenAPI em [assets/jira-oapi.json](assets/jira-oapi.json) para localizar o endpoint correto e construir a chamada usando o método genérico `_request()` do client:

```python
from scripts.jira_client import JiraClient

client = JiraClient()

# Exemplo: adicionar label a uma issue (não tem método dedicado)
response = client._request(
    "PUT",
    f"/rest/api/latest/issue/PROJ-123",
    body={"update": {"labels": [{"add": "minha-label"}]}}
)
```

## Referências

- **Jira REST API**: [references/jira-api.md](references/jira-api.md) — endpoints, parâmetros e exemplos
- **OpenAPI Spec**: [assets/jira-oapi.json](assets/jira-oapi.json) — contrato completo da API

## Limitações Conhecidas

- Apenas instâncias self-hosted / Data Center (não Atlassian Cloud)
- Autenticação exclusivamente via Personal Access Token (Bearer)
- Conversão Wiki Markup ↔ Markdown cobre ~80% dos casos (headers, listas, links, code blocks, tabelas)
- Operações de administração (criação de projetos, gerenciamento de usuários) não suportadas
- SSL verification desabilitada por padrão para instâncias self-hosted com certificados internos. Defina `JIRA_SSL_VERIFY=true` para habilitar.
