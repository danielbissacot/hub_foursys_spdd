# Workflow determinístico de modelagem BPMN

## Objetivo

Reduzir subjetividade e manter o diagrama em nível de negócio, com passos replicáveis para qualquer processo do po-refiner.

## Passo 1 — Enquadrar o pedido

Defina antes de desenhar:

- qual pergunta o diagrama precisa responder;
- se o estado é `AS-IS`, `TO-BE` ou ambos;
- qual é o gatilho que inicia o processo;
- qual é o resultado final esperado;
- quem são os atores e áreas relevantes.

Se o pedido for pequeno demais para BPMN, volte para `mermaid-generator`.

## Passo 2 — Escrever a narrativa funcional

Resuma o processo em 5 a 10 linhas, cobrindo:

1. evento inicial;
2. participantes;
3. etapas centrais;
4. decisões ou aprovações;
5. esperas e exceções;
6. resultados possíveis.

Só depois transforme essa narrativa em diagrama.

## Passo 3 — Definir participants e lanes

- Use **pool** quando houver fronteira clara entre organização/ator externo e processo principal.
- Use **lanes** para áreas, papéis ou responsabilidades dentro do processo.
- Se um ator só envia ou recebe algo, considere mantê-lo como participant externo com message flow.
- Não crie lanes por sistema, tela ou canal técnico.

## Passo 4 — Montar o esqueleto do processo

Construa primeiro:

1. `Start Event`
2. sequência principal de tasks
3. gateways centrais
4. `End Event(s)`

Depois acrescente:

- message flows entre participants;
- eventos de espera ou timeout;
- exceções e retornos importantes;
- annotations com regras de negócio indispensáveis.

## Passo 5 — Separar AS-IS e TO-BE

- Modele **AS-IS** e **TO-BE** em arquivos diferentes.
- Use o AS-IS para mostrar o processo atual e suas dores, gargalos, retornos ou dependências.
- Use o TO-BE para mostrar o processo futuro pretendido, já alinhado ao PRD.
- Evite um único diagrama com cores, notas ou bifurcações misturando "antes" e "depois".

## Passo 6 — Aplicar o filtro business-first

Antes de fechar, revise cada rótulo:

- alguém do negócio entende sem traduzir para tecnologia?
- a lane representa um papel/área ou um sistema?
- a task descreve valor funcional ou implementação?
- a decisão está clara como pergunta objetiva?
- a espera ou exceção muda mesmo a leitura do processo?

Se a resposta não for boa, simplifique.

## Passo 7 — Preparar os artefatos

1. Salve o BPMN em `.bpmn`.
2. Posicione o arquivo seguindo `references/file-conventions.md`.
3. Referencie o `.bpmn` no Markdown com link relativo e texto descritivo do processo.

## Checklist final

Use este checklist antes de considerar o diagrama pronto:

- [ ] o processo tem começo e fim explícitos;
- [ ] cada lane representa responsabilidade de negócio;
- [ ] cada task está em linguagem funcional;
- [ ] gateways têm condição clara;
- [ ] exceções relevantes aparecem;
- [ ] não há API, tabela, fila, tópico ou serviço no desenho;
- [ ] o `.bpmn` foi gerado e posicionado no caminho correto;
- [ ] o `.bpmn` pode ser tratado como fonte de verdade;
- [ ] o Markdown referencia o `.bpmn` com link relativo e texto descritivo.
