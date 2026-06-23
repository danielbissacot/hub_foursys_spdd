---
name: 'bpmn-markdown'
description: |
  Padroniza como referenciar artefatos BPMN em documentos Markdown
  business-first do po-refiner e do doc repo compartilhado. Use esta skill sempre
  que o usuário quiser inserir uma referência a um fluxo BPMN em `.md`, revisar links relativos
  para `_intermediarios/discovery.md`, `prd/prd.md`, `handoff/tl-refiner-input.md`
  ou `user-stories/*.md`, ou uniformizar seções de processo e links BPMN em
  writeups Jira/Confluence-friendly.
metadata:
  version: "0.0.2"
  category: "documentation"
  audience:
    - "product-owner"
    - "business-analyst"
    - "discovery-facilitator"
---

# BPMN em Markdown business-first

## Missão

Ajudar o agente a manter um padrão simples e rastreável para documentação de processos:
o `.bpmn` é a fonte canônica e o único artefato gerado; o Markdown aponta para ele via
link relativo, permitindo que o PO navegue até o arquivo e o importe no seu editor de diagramas.

<HARD-GATE>
Nunca cole BPMN XML dentro do Markdown.
Nunca embuta imagem `.svg` no Markdown — o PO não dispõe de ferramentas para gerar SVG a partir do BPMN.
Nunca trate o diagrama como lugar para esconder arquitetura, APIs, filas, tabelas, payloads
ou plano de implementação.
Use BPMN apenas para explicar fluxo, decisão, exceção e responsabilidade de negócio.
</HARD-GATE>

## Quando usar

Use esta skill quando precisar:
- referenciar um BPMN em `.md` via link relativo;
- padronizar seção de fluxo, processo ou jornada em documentos do doc repo compartilhado;
- manter links relativos corretos entre `_intermediarios/bpmn/`, `prd/`, `handoff/` e `user-stories/`;
- deixar o mesmo conteúdo copiável para writeups Jira/Confluence-friendly.

Use esta skill **depois** que a escolha por BPMN já estiver clara. Se um fluxo simples ainda
puder ser resolvido com Mermaid, mantenha `mermaid-generator` como opção principal.

## Quando não usar

Não use esta skill para:
- modelar o processo do zero ou desenhar a BPMN;
- forçar BPMN quando Mermaid simples ou texto bastarem;
- publicar automações, macros ou fluxos técnicos de distribuição para Jira/Confluence;
- documentar solução técnica dentro do diagrama;
- substituir narrativa de negócio por um desenho sem contexto.

## Convenção principal

Use esta convenção como padrão no doc repo compartilhado:
1. Guarde BPMNs de discovery em `<epic>/_intermediarios/bpmn/`.
2. Guarde o BPMN TO-BE aprovado em `<epic>/prd/`.
3. Em `discovery.md`, use caminhos relativos `./bpmn/...`.
4. Em `prd/prd.md`, use `./processo-negocio-to-be...`.
5. Em `handoff/tl-refiner-input.md` e `user-stories/*.md`, aponte para `../prd/processo-negocio-to-be...`.
6. Em Markdown, **sempre** referencie apenas o arquivo `.bpmn` via link relativo — nunca embuta `.svg`.
7. Use links relativos, nunca caminhos absolutos do filesystem.

## Padrão Markdown preferido

Use este bloco em qualquer documento que precise referenciar um processo BPMN:

```md
## Fluxo de negócio de referência

Este fluxo resume o processo de negócio aprovado. Para visualizá-lo, abra o arquivo abaixo
no seu editor de diagramas (ex.: bpmn.io, Camunda Modeler, Bizagi).

[Abrir diagrama BPMN](./processo-negocio-to-be.bpmn)

- Início do processo: ...
- Decisão principal: ...
- Resultado esperado: ...
```

Para discovery, troque o path conforme o artefato:

```md
[Abrir diagrama BPMN — processo atual AS-IS](./bpmn/processo-atual-as-is.bpmn)
```

```md
[Abrir diagrama BPMN — processo alvo TO-BE draft](./bpmn/processo-alvo-to-be-draft.bpmn)
```

## Convenção de links relativos no shared doc repo

Assuma a estrutura preferida:

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
├── handoff/tl-refiner-input.md
└── user-stories/index.md
```

A partir daí:
- `_intermediarios/discovery.md` → `./bpmn/processo-atual-as-is.bpmn` e `./bpmn/processo-alvo-to-be-draft.bpmn`
- `prd/prd.md` → `./processo-negocio-to-be.bpmn`
- `handoff/tl-refiner-input.md` → `../prd/processo-negocio-to-be.bpmn`
- `user-stories/index.md` e `user-stories/US-*.md` → `../prd/processo-negocio-to-be.bpmn`

Veja `references/embedding-patterns.md` para a matriz completa.

## Como referenciar BPMN por artefato

### `_intermediarios/discovery.md`

Use BPMN para esclarecer o processo atual, dores e decisões críticas do negócio.
Se o discovery já levantar uma hipótese robusta de mudança, referencie também o TO-BE draft em
`./bpmn/processo-alvo-to-be-draft.bpmn`.

### `prd/prd.md`

Use o BPMN TO-BE aprovado em `./processo-negocio-to-be.bpmn` para apoiar escopo e fluxo prioritário.
O melhor lugar costuma ser:
- uma subseção curta próxima de impactos ou fluxo prioritário; e/ou
- a seção `Anexos e links` como referência canônica.

### `handoff/tl-refiner-input.md`

Inclua apenas o fluxo TO-BE aprovado que o `tl-refiner` precisa preservar como intenção de negócio.
O link do diagrama complementa o handoff; ele não substitui resumo executivo, regras e BDD.

### `user-stories/index.md` ou coverage docs

Use o BPMN TO-BE aprovado como mapa de contexto ou rastreabilidade. Em histórias individuais,
prefira link em `🗂️ MATERIAIS RELACIONADOS`; inclua apenas o link para o `.bpmn`.
Não recicle o TO-BE draft do discovery como referência principal da Fase C.

Veja `references/section-writing-guidance.md` para posicionamento e texto de apoio.

## Como escrever ao redor do link do diagrama

Antes do link, explique:
- qual processo o leitor está vendo;
- se é `AS-IS`, `TO-BE draft`, `TO-BE aprovado` ou exceção relevante;
- por que o fluxo importa para a decisão de negócio;
- em qual editor o PO pode abrir o arquivo (ex.: bpmn.io, Camunda Modeler, Bizagi).

Depois do link, registre de 3 a 5 bullets com:
- gatilho de entrada do processo;
- principais atores ou áreas;
- decisão de negócio mais relevante;
- exceção crítica, se houver;
- resultado esperado para cliente, operação ou negócio.

Evite frases como `a API chama`, `o job processa`, `a fila publica`.
Prefira `a solicitação é recebida`, `a área valida`, `o cliente é informado`, `a operação aprova`.

## Jira e Confluence-friendly, na prática

- Mantenha o texto do bloco autocontido para funcionar mesmo fora do repo.
- Inclua o path relativo do arquivo `.bpmn` como texto visível quando o ambiente não renderizar links.
- Não desenhe fluxo de publicação, macro ou automação aqui; foque só no conteúdo que precisa sobreviver à cópia do Markdown.

## Fluxo de trabalho recomendado

1. Confirmar se o arquivo-fonte `.bpmn` já existe no caminho correto.
2. Escolher o path relativo correto conforme a localização do `.md`.
3. Usar o padrão de link com texto descritivo do processo.
4. Escrever um contexto curto antes do link e bullets de leitura depois.
5. Reforçar que o diagrama é de processo de negócio, não de solução técnica.
6. Conferir se o documento está apontando para o estágio correto do processo: discovery em `_intermediarios/bpmn/`; fluxo aprovado em `prd/`.

## Referências carregáveis

- `references/embedding-patterns.md` — matriz de decisão, naming e links relativos.
- `references/copyable-snippets.md` — snippets prontos para discovery, PRD, handoff e backlog docs.
- `references/section-writing-guidance.md` — onde posicionar a seção e como narrar o fluxo em linguagem de negócio.
