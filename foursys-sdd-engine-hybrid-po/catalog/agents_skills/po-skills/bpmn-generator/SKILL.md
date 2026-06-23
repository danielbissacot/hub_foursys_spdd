---
name: 'bpmn-generator'
description: |
  Modele processos de negócio em BPMN 2.0 para o po-refiner. Use esta skill sempre que o usuário quiser mapear um processo, fluxo operacional, jornada entre áreas, aprovação, exceção, espera, handoff ou pedir BPMN explicitamente — mesmo que ele diga apenas "desenha o fluxo", "mostra quem faz o quê", "formaliza o processo atual" ou "compara AS-IS e TO-BE". Prefira esta skill a `mermaid-generator` quando houver múltiplos atores, gateways, estados de espera, paralelismo ou trilhas de exceção que precisem de semântica formal de processo. Não use para arquitetura, APIs, filas, tabelas, microserviços ou implementação técnica.
metadata:
  version: "0.0.1"
  category: "support"
  audience:
    - "product-owner"
    - "business-analyst"
    - "discovery-facilitator"
  notation: "bpmn-2.0"
---

# bpmn-generator

## Missão

Modelar processos de negócio em **BPMN 2.0** com foco estritamente funcional, ajudando Product Owners e áreas parceiras a explicitar **quem faz o quê, quando, por qual regra, com quais esperas, exceções e handoffs**.

<HARD-GATE>
Mantenha o diagrama em linguagem business-first. Use apenas atores, áreas, eventos, decisões, tarefas e trocas relevantes para o negócio. Se o conteúdo começar a citar API, endpoint, tabela, fila, tópico, serviço, microserviço, payload, job, banco, classe, componente ou detalhe de implementação, pare, remova a deriva técnica e volte para o nível funcional do po-refiner.
</HARD-GATE>

## Quando usar BPMN vs Mermaid

### Use `bpmn-generator` quando existir pelo menos um destes sinais

- múltiplos atores, áreas ou handoffs que precisam ficar visíveis;
- aprovações, recusas, alçadas ou decisões com caminhos alternativos;
- estados de espera, SLA, prazo, timeout ou evento externo relevante;
- exceções de negócio que não devem ficar escondidas em texto corrido;
- necessidade de comparar **AS-IS** e **TO-BE** com semântica de processo;
- pedido explícito por BPMN, BPMN 2.0, processo, workflow ou swimlanes formais.

### Mantenha `mermaid-generator` como padrão quando

- o visual for apenas uma jornada simples, fluxo curto ou mapa rápido de escopo;
- um único ator e poucas decisões já resolvem o entendimento;
- o objetivo for comunicação leve, não modelagem formal de processo;
- uma lista de passos ou um flowchart simples bastarem.

Consulte `references/decision-matrix.md` sempre que houver dúvida.

## Elementos permitidos no po-refiner

Use apenas o subconjunto BPMN descrito em `references/business-bpmn-elements.md`:

- **pools / participants** para atores externos ou grandes domínios organizacionais;
- **lanes** para áreas, papéis ou responsabilidades de negócio;
- **tasks** e **subprocesses** em linguagem funcional;
- **start, intermediate e end events** quando o gatilho, a espera ou o desfecho forem relevantes para o negócio;
- **gateways** para decisões, paralelismo ou caminhos opcionais;
- **sequence flows**, **message flows** e **text annotations** apenas para clareza do processo.

Tudo fora desse subconjunto é considerado fora de escopo até orientação explícita do repositório.

## Deriva técnica proibida

Não use BPMN do po-refiner para:

- descrever arquitetura, topologia, integrações ou contratos entre sistemas;
- modelar APIs, tabelas, filas, eventos técnicos, jobs, schedulers ou payloads;
- nomear lanes por sistemas em vez de áreas ou papéis de negócio;
- trocar tarefas de negócio por ações técnicas como "chamar serviço", "persistir em banco", "publicar no Kafka";
- embutir desenho técnico em annotations, labels ou nomes de arquivos.

Se o pedido real for técnico, registre a necessidade como handoff para o `tl-refiner` em vez de aprofundar aqui.

## Entradas esperadas

Receba, quando disponíveis:

- objetivo do processo e pergunta de negócio a responder;
- estado desejado do diagrama: `AS-IS`, `TO-BE` ou ambos;
- gatilho inicial e resultado final esperado;
- atores, áreas, papéis ou parceiros envolvidos;
- decisões, aprovações, exceções, esperas e handoffs que precisam aparecer;
- `JIRA_KEY` e raiz do doc repo compartilhado quando for preciso salvar artefatos.

### Contrato mínimo

Para gerar um BPMN útil, tente fechar no mínimo:

- nome funcional do processo;
- evento de início;
- resultado final ou estados de término;
- participantes ou lanes principais;
- decisões e exceções relevantes.

Se algo essencial estiver faltando, **não invente**. Explicite a lacuna como `[PENDENTE: ...]` no artefato textual de apoio ou peça o complemento antes de tratar o diagrama como fechado.

## Saídas e convenções obrigatórias

- O arquivo **`.bpmn` é a fonte de verdade** e o único artefato visual gerado.
- Não gere arquivos `.svg` — o PO não dispõe de ferramentas para exportar SVG a partir do BPMN.
- Em Markdown, **referencie o `.bpmn` via link relativo** com texto descritivo para que o PO possa abrir no seu editor de diagramas.
- Para comparar situação atual e futura, gere diagramas separados; não misture AS-IS e TO-BE no mesmo canvas sem necessidade clara.

Use `references/file-conventions.md` como padrão obrigatório de caminhos, nomes e snippets Markdown.

## Workflow determinístico

1. **Decidir a notação**  
   Validar com `references/decision-matrix.md` se o caso pede BPMN ou se Mermaid continua suficiente.

2. **Fixar o recorte**  
   Declarar se o diagrama é `AS-IS`, `TO-BE` ou um par comparável; definir começo, fim e pergunta de negócio.

3. **Escrever a narrativa antes do desenho**  
   Resumir o processo em linguagem simples: gatilho, participantes, etapas centrais, decisões, exceções e resultado.

4. **Mapear participantes e handoffs**  
   Criar pools/lanes por área, papel ou ator de negócio; nunca por componente técnico.

5. **Converter a narrativa em BPMN**  
   Aplicar apenas os elementos permitidos, nomeando cada item em linguagem observável para negócio.

6. **Validar guardrails**  
   Revisar nomes, gateways, esperas, exceções e mensagens para remover solução técnica e ambiguidade.

7. **Salvar o artefato**  
   Persistir `.bpmn` como origem e posicionar o arquivo conforme `references/file-conventions.md`.

8. **Preparar consumo em Markdown**  
   Referenciar o `.bpmn` no documento principal com link relativo e texto descritivo do processo.

O detalhamento operacional do passo a passo está em `references/modeling-workflow.md`.

## Carregamento progressivo de contexto

Leia apenas o necessário, nesta ordem:

1. `references/decision-matrix.md` — decidir BPMN vs Mermaid.
2. `references/modeling-workflow.md` — seguir o fluxo determinístico.
3. `references/business-bpmn-elements.md` — aplicar o subconjunto BPMN permitido.
4. `references/file-conventions.md` — salvar, nomear e referenciar os artefatos.

## Exemplos de acionamento

- "Mapeie em BPMN o fluxo atual de aprovação de reembolso entre operação, financeiro e gestor."
- "Quero um AS-IS e um TO-BE para o processo de contestação, mostrando esperas e exceções."
- "Desenha quem faz o quê no onboarding entre comercial, cadastro e compliance; preciso de algo mais formal que Mermaid."
- "Crie um BPMN 2.0 para o fluxo de análise manual com alçadas de aprovação e retorno ao solicitante."

## Referências locais

- `references/decision-matrix.md`
- `references/modeling-workflow.md`
- `references/business-bpmn-elements.md`
- `references/file-conventions.md`
