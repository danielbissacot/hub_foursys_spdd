# Snippets copiáveis para BPMN em Markdown

> **Nota:** Não gere nem embuta arquivos `.svg`. O PO não dispõe de ferramentas para exportar SVG
> a partir do BPMN. Referencie sempre o arquivo `.bpmn` via link relativo.

## 1. `_intermediarios/discovery.md` — processo atual AS-IS

```md
## Fluxo atual do processo

O fluxo abaixo ajuda a visualizar como o problema acontece hoje e onde estão as principais dores do processo.
Para visualizá-lo, abra o arquivo no seu editor de diagramas (ex.: bpmn.io, Camunda Modeler, Bizagi).

[Abrir diagrama BPMN — processo atual AS-IS](./bpmn/processo-atual-as-is.bpmn)

- Etapa com maior atrito: a validação manual pela operação.
- Decisão crítica: confirmar ou não a conciliação do pagamento.
- Dor observada: o cliente precisa acionar a central para obter retorno.
```

## 2. `_intermediarios/discovery.md` — processo alvo preliminar TO-BE draft

```md
## Hipótese de fluxo alvo

O fluxo abaixo resume a hipótese inicial de mudança ainda em validação no discovery.
Para visualizá-lo, abra o arquivo no seu editor de diagramas (ex.: bpmn.io, Camunda Modeler, Bizagi).

[Abrir diagrama BPMN — processo alvo TO-BE draft](./bpmn/processo-alvo-to-be-draft.bpmn)

- Mudança principal: o cliente passa a receber retorno no canal digital.
- Regra em validação: quais estados podem ser informados sem análise manual adicional.
- Resultado esperado: reduzir contatos na central mantendo clareza sobre exceções.
```

## 3. `prd/prd.md`

```md
## Fluxo de negócio de referência

Este fluxo mostra a jornada prioritária que o PRD precisa preservar em termos de experiência e operação.
Para visualizá-lo, abra o arquivo no seu editor de diagramas (ex.: bpmn.io, Camunda Modeler, Bizagi).

[Abrir diagrama BPMN — processo de negócio aprovado](./processo-negocio-to-be.bpmn)

- Escopo enfatizado pelo fluxo: confirmação de pagamento já realizado.
- Regra de negócio destacada: só comunicar sucesso após conciliação válida.
- Resultado esperado: reduzir contato manual e aumentar autonomia do cliente.
```

## 4. `handoff/tl-refiner-input.md`

```md
## Fluxo funcional que deve ser preservado

O diagrama abaixo resume o fluxo de negócio aprovado que o refinamento técnico não deve descaracterizar.
Para visualizá-lo, abra o arquivo no seu editor de diagramas (ex.: bpmn.io, Camunda Modeler, Bizagi).

[Abrir diagrama BPMN — processo de negócio aprovado](../prd/processo-negocio-to-be.bpmn)

- Gatilho: solicitação de confirmação feita pelo cliente.
- Validação indispensável: confirmar o status do pagamento antes da resposta.
- Resultado de negócio: retorno claro ao cliente e menor dependência do atendimento humano.
```

## 5. `user-stories/index.md`

```md
## Processo relacionado ao backlog

O fluxo abaixo serve como contexto compartilhado para as histórias deste épico.
Para visualizá-lo, abra o arquivo no seu editor de diagramas (ex.: bpmn.io, Camunda Modeler, Bizagi).

[Abrir diagrama BPMN — processo de negócio aprovado](../prd/processo-negocio-to-be.bpmn)

- História mais ligada ao início do fluxo: US-001.
- História mais ligada à decisão operacional: US-002.
- História mais ligada à comunicação do resultado: US-003.
```

## 6. User story individual: link contextual em materiais relacionados

```md
## 🗂️ MATERIAIS RELACIONADOS
| Material | Tipo | Link ou referência | Observação |
|----------|------|--------------------|------------|
| Fluxo BPMN do processo de negócio aprovado | Fluxo | [Abrir diagrama](../prd/processo-negocio-to-be.bpmn) | Usar como contexto para entender a regra RN1 |
```

## 7. Jira/Confluence-friendly, sem depender de renderização inline

```md
## Fluxo de negócio de referência

Processo usado como apoio para explicar a jornada de negócio aprovada para confirmação de pagamento.

- Fonte canônica: `prd/processo-negocio-to-be.bpmn`
- Para visualizar: importe o arquivo `.bpmn` no seu editor de diagramas (ex.: bpmn.io, Camunda Modeler, Bizagi).
- Leitura do fluxo: começa com a solicitação do cliente, passa pela validação operacional e termina com a comunicação do resultado.
```
