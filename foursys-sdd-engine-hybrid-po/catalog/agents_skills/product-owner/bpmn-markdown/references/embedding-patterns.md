# Padrões de referência BPMN em Markdown

## Regra canônica

- Use `_intermediarios/bpmn/` para BPMNs de discovery (`AS-IS` e `TO-BE draft`).
- Use `prd/` para o BPMN `TO-BE` aprovado.
- O `.bpmn` é a fonte canônica e o único artefato gerado.
- Não gere nem embuta `.svg` — o PO não dispõe de ferramentas para exportar SVG a partir do BPMN.
- Em Markdown, referencie sempre o `.bpmn` via link relativo com texto descritivo.
- Nunca cole XML BPMN inline em `.md`.

## Estrutura sugerida do doc repo compartilhado

```text
EPIC-<JIRA_KEY>/
├── _intermediarios/
│   ├── discovery.md
│   └── bpmn/
│       ├── processo-atual-as-is.bpmn
│       └── processo-alvo-to-be-draft.bpmn
├── prd/
│   ├── prd.md
│   └── processo-negocio-to-be.bpmn
├── handoff/
│   └── tl-refiner-input.md
└── user-stories/
    ├── index.md
    └── US-001-exemplo.md
```

## Matriz de links relativos

| Documento `.md` | BPMN canônico | Link Markdown |
|---|---|---|
| `_intermediarios/discovery.md` | `AS-IS` | `[Abrir diagrama BPMN — processo atual AS-IS](./bpmn/processo-atual-as-is.bpmn)` |
| `_intermediarios/discovery.md` | `TO-BE draft` | `[Abrir diagrama BPMN — processo alvo TO-BE draft](./bpmn/processo-alvo-to-be-draft.bpmn)` |
| `prd/prd.md` | `TO-BE aprovado` | `[Abrir diagrama BPMN — processo de negócio aprovado](./processo-negocio-to-be.bpmn)` |
| `handoff/tl-refiner-input.md` | `TO-BE aprovado` | `[Abrir diagrama BPMN — processo de negócio aprovado](../prd/processo-negocio-to-be.bpmn)` |
| `user-stories/index.md` | `TO-BE aprovado` | `[Abrir diagrama BPMN — processo de negócio aprovado](../prd/processo-negocio-to-be.bpmn)` |
| `user-stories/US-001-exemplo.md` | `TO-BE aprovado` | `[Abrir diagrama BPMN — processo de negócio aprovado](../prd/processo-negocio-to-be.bpmn)` |

## Padrão de bloco Markdown

Use este padrão em qualquer documento:

```md
## Fluxo de negócio de referência

Para visualizar o processo, abra o arquivo abaixo no seu editor de diagramas
(ex.: bpmn.io, Camunda Modeler, Bizagi).

[Abrir diagrama BPMN](./processo-negocio-to-be.bpmn)

- Início do processo: ...
- Decisão principal: ...
- Resultado esperado: ...
```

Ajuste o path relativo conforme o artefato e a pasta do documento.

## Regras rápidas de naming

- Use nomes em **kebab-case**.
- Use um slug funcional curto, como `aprovacao-reembolso`, `contestacao-cobranca`, `analise-manual`.
- Feche com o estado do processo:
  - `-as-is` para situação atual;
  - `-to-be` para situação futura.
- Quando houver mais de um recorte, deixe o recorte explícito no nome do arquivo.
- Evite nomes vagos ou não canônicos, como `diagrama-final`, `novo-processo` ou `v2-definitivo`.
