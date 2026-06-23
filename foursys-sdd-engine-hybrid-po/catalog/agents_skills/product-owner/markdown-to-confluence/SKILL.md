---
name: markdown-to-confluence
description: Converte Markdown para Confluence Wiki Markup (e vice-versa). Use esta skill sempre que precisar transformar texto Markdown em formato Confluence para colar em páginas, descrições, comentários ou campos do Confluence — e o inverso. Invoque ao ver "formatar para o Confluence", "converter para wiki markup do Confluence", "transformar markdown em confluence", "preparar para publicar no Confluence", "quero publicar isso no Confluence", ou quando precisar publicar conteúdo de user stories, PRD, discovery, atas de reunião ou documentação técnica diretamente em páginas Confluence. Mesmo que o usuário não mencione "markup" explicitamente — se o destino for o Confluence, use esta skill.
metadata:
  version: "0.0.1"
---

# markdown-to-confluence

Skill de conversão bidirecional entre **Markdown** e **Confluence Wiki Markup**.

O agente realiza a conversão diretamente, aplicando as regras desta skill.
Não há scripts — o agente lê o conteúdo e produz a saída convertida.

---

## Regras de Conversão: Markdown → Confluence Wiki Markup

### Títulos

| Markdown | Confluence |
|---|---|
| `# Título` | `h1. Título` |
| `## Título` | `h2. Título` |
| `### Título` | `h3. Título` |
| `#### Título` | `h4. Título` |

### Ênfase

| Markdown | Confluence |
|---|---|
| `**texto**` | `*texto*` |
| `*texto*` | `_texto_` |
| `~~texto~~` | `-texto-` |
| `` `código` `` | `{{código}}` |

> ⚠️ Converta sempre negrito (`**`) antes de itálico (`*`) para evitar colisão de padrões.

### Listas

| Markdown | Confluence |
|---|---|
| `- item` | `* item` |
| `  - subitem` (2 espaços) | `** subitem` |
| `    - sub-subitem` (4 espaços) | `*** sub-subitem` |
| `1. item` | `# item` |
| `  1. subitem` | `## subitem` |

Profundidade: cada nível adicional de indentação (2 espaços) adiciona um `*` ou `#` a mais.

### Task Lists (checklists)

| Markdown | Confluence |
|---|---|
| `- [ ] tarefa pendente` | `[] tarefa pendente` |
| `- [x] tarefa concluída` | `[x] tarefa concluída` |

### Blocos de Código

| Markdown | Confluence |
|---|---|
| ` ```python ` … ` ``` ` | `{code:language=python}` … `{code}` |
| ` ``` ` … ` ``` ` (sem linguagem) | `{noformat}` … `{noformat}` |

Linguagens suportadas: `java`, `javascript`, `python`, `bash`, `sql`, `xml`, `html`, `css`, `json`, `yaml`, `go`, `typescript`, entre outras.

Para adicionar título ao bloco: `{code:language=python|title=exemplo.py}`

### Tabelas

A linha separadora do Markdown (`|---|`) é descartada. A linha de cabeçalho usa `||` em vez de `|`.

**Markdown:**
```
| Campo | Tipo | Obrigatório |
|---|---|---|
| nome | string | sim |
```

**Confluence:**
```
|| Campo || Tipo || Obrigatório ||
| nome | string | sim |
```

### Links e Imagens

| Markdown | Confluence |
|---|---|
| `[texto](url)` | `[texto\|url]` |
| `[texto](url)` (link interno) | `[Título da Página]` ou `[texto\|Título da Página]` |
| `![alt](url)` | `!url\|alt=alt!` |
| `![alt](url)` com dimensões | `!url\|width=300,alt=alt!` |

> Converta imagens antes de links para não confundir os padrões `[]()` e `![]()`.

### Citações e Blocos de Destaque

| Markdown | Confluence |
|---|---|
| `> texto` (linha única) | `bq. texto` |
| `> bloco` (múltiplas linhas) | `{quote}` … `{quote}` |

Para chamadas (callouts) que em Markdown aparecem como blockquotes com prefixo de emoji ou palavra-chave, use as macros Confluence apropriadas:

| Padrão Markdown | Macro Confluence |
|---|---|
| `> ℹ️ ...` ou `> **Note:** ...` | `{info}` … `{info}` |
| `> 💡 ...` ou `> **Tip:** ...` | `{tip}` … `{tip}` |
| `> 📝 ...` ou `> **Note:** ...` | `{note}` … `{note}` |
| `> ⚠️ ...` ou `> **Warning:** ...` | `{warning}` … `{warning}` |

### Elementos Estruturais

| Markdown | Confluence |
|---|---|
| `---` (linha horizontal) | `----` |
| Quebra de linha explícita | `\\` (dois backslashes no final da linha) |

---

## Macros Confluence sem Equivalente Direto no Markdown

Ao produzir Confluence markup, considere usar essas macros quando o conteúdo se beneficiar delas — mesmo que o Markdown de origem não as use explicitamente.

### Painel (`{panel}`)
Use para destacar blocos com título:
```
{panel:title=Título do Painel}
Conteúdo do painel.
{panel}
```

### Seção com Colunas (`{section}` + `{column}`)
Use para layout em colunas:
```
{section}
{column:width=50%}
Coluna esquerda
{column}
{column:width=50%}
Coluna direita
{column}
{section}
```

### Table of Contents
```
{toc:maxLevel=3}
```
Inclua no início de páginas longas.

### Status
```
{status:colour=Green|title=Concluído}
{status:colour=Yellow|title=Em Andamento}
{status:colour=Red|title=Bloqueado}
```

### Expand (conteúdo recolhível)
```
{expand:title=Clique para ver mais}
Conteúdo oculto.
{expand}
```

---

## Espaçamento no Confluence

O renderizador Confluence comprime espaços em branco. Para garantir legibilidade:

- Adicione **uma linha em branco antes e depois** de títulos (`h1.`–`h6.`)
- Adicione **uma linha em branco antes e depois** de blocos `{code}` e `{noformat}`
- Adicione **uma linha em branco após** linhas horizontais (`----`)
- Evite mais de 2 linhas em branco consecutivas

---

## Exemplo Completo

### Entrada (Markdown)

```markdown
# Autenticação de Usuário

**Objetivo:** garantir acesso seguro ao sistema.

## Critérios de Aceite

- Dado que o usuário acessa a tela de login
  - E preenche e-mail e senha válidos
- Quando clica em *Entrar*
- Então é redirecionado para o *dashboard*

> ⚠️ Regra de negócio: senha deve ter mínimo 8 caracteres.

## Exemplo de Request

```json
{ "email": "user@example.com", "password": "secret" }
```

| Campo    | Tipo   | Obrigatório |
|----------|--------|-------------|
| email    | string | sim         |
| password | string | sim         |

## Tarefas

- [x] Definir critérios de aceite
- [ ] Revisar com o time de segurança
```

### Saída (Confluence Wiki Markup)

```
h1. Autenticação de Usuário

*Objetivo:* garantir acesso seguro ao sistema.

h2. Critérios de Aceite

* Dado que o usuário acessa a tela de login
** E preenche e-mail e senha válidos
* Quando clica em _Entrar_
* Então é redirecionado para o _dashboard_

{warning}
Regra de negócio: senha deve ter mínimo 8 caracteres.
{warning}

h2. Exemplo de Request

{code:language=json}
{ "email": "user@example.com", "password": "secret" }
{code}

|| Campo || Tipo || Obrigatório ||
| email | string | sim |
| password | string | sim |

h2. Tarefas

[x] Definir critérios de aceite
[] Revisar com o time de segurança
```

---

## Regras de Conversão: Confluence → Markdown

### Títulos

| Confluence | Markdown |
|---|---|
| `h1. Título` | `# Título` |
| `h2. Título` | `## Título` |
| `h3. Título` | `### Título` |

### Ênfase

| Confluence | Markdown |
|---|---|
| `*texto*` | `**texto**` |
| `_texto_` | `*texto*` |
| `-texto-` | `~~texto~~` |
| `{{código}}` | `` `código` `` |

### Listas

| Confluence | Markdown |
|---|---|
| `* item` | `- item` |
| `** subitem` | `  - subitem` |
| `# item` | `1. item` |
| `## subitem` | `  1. subitem` |

### Blocos de Código

| Confluence | Markdown |
|---|---|
| `{code:language=python}` … `{code}` | ` ```python ` … ` ``` ` |
| `{code:...}` (qualquer opção) | ` ```lang ` (extrair `language=` se presente) |
| `{noformat}` … `{noformat}` | ` ``` ` … ` ``` ` |

### Tabelas

| Confluence | Markdown |
|---|---|
| `\|\| col1 \|\| col2 \|\|` | `\| col1 \| col2 \|` + linha separadora `\|---|---|` |
| `\| val1 \| val2 \|` | `\| val1 \| val2 \|` |

### Outros

| Confluence | Markdown |
|---|---|
| `bq. texto` | `> texto` |
| `{quote}` … `{quote}` | `> texto` (bloco) |
| `{info}` … `{info}` | `> **ℹ️ Info:** texto` |
| `{tip}` … `{tip}` | `> **💡 Dica:** texto` |
| `{note}` … `{note}` | `> **📝 Nota:** texto` |
| `{warning}` … `{warning}` | `> **⚠️ Atenção:** texto` |
| `{panel:title=X}` … `{panel}` | `> **X**` + bloco |
| `----` | `---` |
| `[texto\|url]` | `[texto](url)` |
| `!url\|alt=desc!` | `![desc](url)` |
| `[] tarefa` | `- [ ] tarefa` |
| `[x] tarefa` | `- [x] tarefa` |
| `{color:...}texto{color}` | `texto` (macro removida, conteúdo preservado) |
| `{status:colour=X\|title=Y}` | `**[Y]**` |

---

## Limitações

- Macros avançadas (`{jira}`, `{children}`, `{recently-updated}`, `{include}`, `{attachments}`) não têm equivalente Markdown — são omitidas ou representadas como comentário `<!-- macro removida -->`
- Tabelas aninhadas não são suportadas
- HTML embutido no Markdown não é convertido
- Layout em colunas (`{section}/{column}`) não tem equivalente direto no Markdown
- Células de tabela mescladas (`||`) são normalizadas para células simples
