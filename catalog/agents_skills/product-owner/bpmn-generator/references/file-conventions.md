# Convenções de arquivos e naming

## Fonte de verdade e artefato gerado

- **`.bpmn` é a fonte de verdade** e o único artefato gerado.
- Não gere arquivos `.svg` — o PO não dispõe de ferramentas para exportar SVG a partir do BPMN.
- Em Markdown, referencie o `.bpmn` via link relativo com texto descritivo para que o PO abra no seu editor de diagramas.

## Estratégia recomendada no workspace compartilhado

### AS-IS

Guarde o processo atual em `_intermediarios/bpmn/`, porque ele serve como material de descoberta e comparação:

```text
<DOC_ROOT>/EPIC-<JIRA_KEY>/_intermediarios/bpmn/processo-atual-as-is.bpmn
```

### TO-BE

Guarde o processo futuro aprovado ao lado do PRD, para facilitar referência e revisão:

```text
<DOC_ROOT>/EPIC-<JIRA_KEY>/prd/processo-negocio-to-be.bpmn
```

## Regra de naming

- use nomes em **kebab-case**;
- use um slug funcional curto, como `aprovacao-reembolso`, `contestacao-cobranca`, `analise-manual`;
- feche com o estado do processo:
  - `-as-is` para situação atual;
  - `-to-be` para situação futura.

### Padrão determinístico

| Tipo | Diretório padrão | Nome sugerido |
|---|---|---|
| processo atual genérico | `_intermediarios/bpmn/` | `processo-atual-as-is` |
| processo futuro principal | `prd/` | `processo-negocio-to-be` |
| recorte específico AS-IS | `_intermediarios/bpmn/` | `<slug>-as-is` |
| recorte específico TO-BE | `prd/` | `<slug>-to-be` |

## Exemplos completos

```text
<DOC_ROOT>/EPIC-<JIRA_KEY>/_intermediarios/bpmn/processo-atual-as-is.bpmn
<DOC_ROOT>/EPIC-<JIRA_KEY>/prd/processo-negocio-to-be.bpmn
```

```text
<DOC_ROOT>/EPIC-COBR-2147/_intermediarios/bpmn/aprovacao-reembolso-as-is.bpmn
<DOC_ROOT>/EPIC-COBR-2147/prd/aprovacao-reembolso-to-be.bpmn
```

## Como referenciar em Markdown

### Link TO-BE dentro de `prd/prd.md`

```md
## Processo de negócio TO-BE

Para visualizar o processo aprovado, abra o arquivo abaixo no seu editor de diagramas
(ex.: bpmn.io, Camunda Modeler, Bizagi).

[Abrir diagrama BPMN — processo de negócio aprovado](./processo-negocio-to-be.bpmn)
```

### Referência ao AS-IS a partir de `prd/prd.md`

```md
## Processo atual AS-IS (referência comparativa)

[Abrir diagrama BPMN — processo atual AS-IS](../_intermediarios/bpmn/processo-atual-as-is.bpmn)
```

## Regras práticas

- Não misture versões de estado no mesmo nome de arquivo.
- Se houver vários diagramas no mesmo épico, mantenha o slug base consistente.
- Se um diagrama ainda estiver em construção e não puder ser tratado como definitivo, mantenha-o em `_intermediarios/bpmn/` até consolidar o TO-BE final.
