---
name: markdown-to-jira
description: Converte Markdown para Jira Wiki Markup (e vice-versa). Use esta skill sempre que precisar transformar texto Markdown em formato Jira Wiki para colar em descrições, comentários ou campos de issues — e o inverso. Invoque ao ver "formatar para o Jira", "converter para wiki markup", "transformar markdown em jira", "preparar para colar no Jira", ou quando precisar publicar conteúdo de user stories, PRD ou discovery diretamente em campos Jira.
metadata:
  version: "0.0.1"
---

# markdown-to-jira

Skill de conversão bidirecional entre **Markdown** e **Jira Wiki Markup**.

O agente realiza a conversão diretamente, aplicando as regras desta skill.
Não há scripts — o agente lê o conteúdo e produz a saída convertida.

---

## Regras de Conversão: Markdown → Jira Wiki Markup

### Títulos

| Markdown | Jira Wiki Markup |
|---|---|
| `# Título` | `h1. Título` |
| `## Título` | `h2. Título` |
| `### Título` | `h3. Título` |
| `#### Título` | `h4. Título` |

### Ênfase

| Markdown | Jira Wiki Markup |
|---|---|
| `**texto**` | `*texto*` |
| `*texto*` | `_texto_` |
| `~~texto~~` | `-texto-` |
| `` `código` `` | `{{código}}` |

> ⚠️ Converta sempre negrito antes de itálico para evitar colisão de padrões.

### Listas

| Markdown | Jira Wiki Markup |
|---|---|
| `- item` | `* item` |
| `  - subitem` (2 espaços) | `** subitem` |
| `    - sub-subitem` (4 espaços) | `*** sub-subitem` |
| `1. item` | `# item` |
| `  1. subitem` | `## subitem` |

Regra de profundidade: cada nível adicional de indentação (2 espaços) adiciona um `*` ou `#` a mais.

### Blocos de Código

| Markdown | Jira Wiki Markup |
|---|---|
| ` ```python ` … ` ``` ` | `{code:python}` … `{code}` |
| ` ``` ` … ` ``` ` (sem linguagem) | `{noformat}` … `{noformat}` |

### Tabelas

Markdown usa linha separadora (`|---|---|`); Jira usa `||` para cabeçalhos e `|` para células.

**Markdown:**
```
| Campo | Tipo | Obrigatório |
|---|---|---|
| nome | string | sim |
```

**Jira Wiki Markup:**
```
|| Campo || Tipo || Obrigatório ||
| nome | string | sim |
```

Regra: a linha separadora (`|---|`) é descartada; a linha de cabeçalho usa `||` em vez de `|`.

### Links e Imagens

| Markdown | Jira Wiki Markup |
|---|---|
| `[texto](url)` | `[texto\|url]` |
| `![alt](url)` | `!url!` |

> Converta imagens antes de links para não confundir os padrões `[]()` e `![]()`.

### Outros Elementos

| Markdown | Jira Wiki Markup |
|---|---|
| `> citação` | `bq. citação` |
| `---` (linha horizontal) | `----` |

---

## Regras de Conversão: Jira Wiki Markup → Markdown

### Títulos

| Jira Wiki Markup | Markdown |
|---|---|
| `h1. Título` | `# Título` |
| `h2. Título` | `## Título` |
| `h3. Título` | `### Título` |

### Ênfase

| Jira Wiki Markup | Markdown |
|---|---|
| `*texto*` | `**texto**` |
| `_texto_` | `*texto*` |
| `-texto-` | `~~texto~~` |
| `{{código}}` | `` `código` `` |

### Listas

| Jira Wiki Markup | Markdown |
|---|---|
| `* item` | `- item` |
| `** subitem` | `  - subitem` |
| `# item` | `1. item` |
| `## subitem` | `  1. subitem` |

### Blocos de Código

| Jira Wiki Markup | Markdown |
|---|---|
| `{code:python}` … `{code}` | ` ```python ` … ` ``` ` |
| `{noformat}` … `{noformat}` | ` ``` ` … ` ``` ` |

### Tabelas

| Jira Wiki Markup | Markdown |
|---|---|
| `\|\| col1 \|\| col2 \|\|` | `\| col1 \| col2 \|` + linha `\|---|---|` |
| `\| val1 \| val2 \|` | `\| val1 \| val2 \|` |

### Outros

| Jira Wiki Markup | Markdown |
|---|---|
| `bq. texto` | `> texto` |
| `----` | `---` |
| `[texto\|url]` | `[texto](url)` |
| `!url!` | `![url](url)` |
| `{color:...}texto{color}` | `texto` (macro removida, conteúdo preservado) |
| `{panel:title=X}` … `{panel}` | `> **X**` … (bloco citação) |

---

## Espaçamento no Jira Wiki Markup

O renderizador Jira comprime espaços em branco. Para garantir legibilidade:

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

## Exemplo de Request

```json
{ "email": "user@example.com", "password": "secret" }
```

| Campo    | Tipo   | Obrigatório |
|----------|--------|-------------|
| email    | string | sim         |
| password | string | sim         |

> Regra: senha deve ter mínimo 8 caracteres.
```

### Saída (Jira Wiki Markup)

```
h1. Autenticação de Usuário

*Objetivo:* garantir acesso seguro ao sistema.

h2. Critérios de Aceite

* Dado que o usuário acessa a tela de login
** E preenche e-mail e senha válidos
* Quando clica em _Entrar_
* Então é redirecionado para o _dashboard_

h2. Exemplo de Request

{code:json}
{ "email": "user@example.com", "password": "secret" }
{code}

|| Campo || Tipo || Obrigatório ||
| email | string | sim |
| password | string | sim |

bq. Regra: senha deve ter mínimo 8 caracteres.
```

---

## Limitações

- Macros Jira complexas (`{color}`, `{anchor}`, `{jira}`, etc.) são simplificadas: macro removida, conteúdo textual preservado quando possível
- Tabelas aninhadas não são suportadas
- HTML embutido no Markdown não é convertido
- Casos com formatação mista (ex.: negrito dentro de itálico) podem precisar de ajuste manual
