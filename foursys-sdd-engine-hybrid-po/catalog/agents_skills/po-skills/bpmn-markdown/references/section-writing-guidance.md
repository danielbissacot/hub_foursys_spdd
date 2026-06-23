# Guia de escrita de seções BPMN em documentos de negócio

## Princípio

O diagrama não substitui a narrativa. Use a BPMN para tornar o processo mais fácil de visualizar e o texto para explicar por que ele importa para o negócio.

## Estrutura recomendada da seção

1. **Título claro**
   - `## Fluxo atual do processo`
   - `## Fluxo de negócio de referência`
   - `## Fluxo funcional que deve ser preservado`
2. **Parágrafo de abertura**
   - Diga o que o fluxo mostra.
   - Diga se é `AS-IS`, `TO-BE` ou recorte de exceção.
   - Diga por que o leitor deve olhar para ele.
3. **Link para o BPMN**
   - Referencie o `.bpmn` com link relativo e texto descritivo.
   - Oriente o leitor a abrir o arquivo no seu editor de diagramas (ex.: bpmn.io, Camunda Modeler, Bizagi).
4. **Bullets de leitura**
   - início do processo;
   - principal decisão;
   - exceção importante;
   - resultado esperado.

## Guia por artefato

### `discovery.md`

**Objetivo da seção:** explicitar o processo atual, a dor e a etapa onde o negócio percebe atrito.

**Onde encaixar:** perto de cenários e comportamentos, ou logo depois deles.

**Perguntas que a narrativa deve responder:**
- Como o processo funciona hoje?
- Onde a dor aparece?
- Qual decisão ou aprovação é mais crítica?

### `prd/prd.md`

**Objetivo da seção:** apoiar escopo, fluxo prioritário e entendimento do que muda para o negócio.

**Onde encaixar:** como subseção curta perto de impactos, escopo ou anexos e links.

**Perguntas que a narrativa deve responder:**
- Qual fluxo prioritário o PRD está preservando?
- O que muda no processo para cliente, operação ou área?
- Que regra de negócio fica mais clara com o diagrama?

### `handoff/tl-refiner-input.md`

**Objetivo da seção:** mostrar ao `tl-refiner` o processo que precisa ser preservado funcionalmente.

**Onde encaixar:** antes de materiais relacionados ou junto do resumo executivo, sem competir com regras e BDD.

**Perguntas que a narrativa deve responder:**
- Que parte do processo é inegociável do ponto de vista de negócio?
- Qual decisão ou exceção não pode ser descaracterizada?
- Qual resultado o fluxo precisa manter?

### `user-stories/index.md` ou coverage docs

**Objetivo da seção:** servir como mapa de contexto para o backlog, não como duplicação integral de todos os fluxos.

**Onde encaixar:** abertura do índice ou seção de contexto compartilhado.

**Perguntas que a narrativa deve responder:**
- Que histórias se conectam a qual trecho do processo?
- Onde começa e termina a cobertura desta rodada?
- Existe exceção relevante que mereça história própria?

## Linguagem recomendada

Prefira termos de negócio:
- `cliente solicita`
- `área aprova`
- `operação valida`
- `parceiro confirma`
- `resultado é comunicado`

Evite solutioning:
- `API consulta`
- `microserviço publica evento`
- `job consolida dados`
- `fila dispara processamento`

## Exemplo de texto bom

`O fluxo abaixo mostra como a confirmação de pagamento percorre atendimento e operação até o retorno ao cliente. Ele é útil aqui porque destaca a validação que condiciona a comunicação do resultado.`

## Exemplo de texto ruim

`A BPMN mostra a API de pagamentos chamando um serviço assíncrono que publica em fila para o worker.`

## Checklist rápido antes de fechar

- O texto explica o processo em linguagem de negócio?
- O documento referencia o `.bpmn` com link relativo e texto descritivo?
- O caminho é relativo à pasta do `.md` atual?
- O fluxo ajuda a entender problema, escopo ou handoff?
- O diagrama evita esconder solução técnica?
