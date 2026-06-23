# Quando usar BPMN vs Mermaid

## Regra-base do po-refiner

- **Mermaid continua sendo o padrão** para jornadas, fluxos simples, mapas rápidos e apoio visual leve.
- **BPMN entra quando a semântica de processo importa**: responsabilidades, gateways, espera, exceções, paralelismo e handoffs entre áreas.

## Matriz de decisão

| Sinal da demanda | Use | Por quê |
|---|---|---|
| Fluxo curto, linear, com um ator principal | Mermaid | É mais rápido e suficiente para entendimento |
| Jornada, mapa de escopo ou dependências funcionais | Mermaid | O objetivo é visual leve, não semântica formal |
| Várias áreas ou atores fazendo handoff | BPMN | Pools e lanes deixam responsabilidade explícita |
| Aprovação, rejeição, reprocesso ou alçada | BPMN | Gateways e caminhos alternativos precisam ficar preservados |
| Espera, prazo, SLA, timeout ou evento externo | BPMN | Eventos intermediários tornam o comportamento observável |
| Happy path simples + exceções críticas | BPMN | O processo precisa mostrar mais de um desfecho |
| Pedido explícito por BPMN ou BPMN 2.0 | BPMN | A expectativa já é de modelagem formal |

## Heurísticas rápidas

### Prefira BPMN quando

- o diagrama precisa responder **quem faz o quê e em qual sequência**;
- o processo cruza fronteiras entre áreas, parceiros ou times;
- uma decisão muda o caminho de forma relevante para negócio;
- esconder exceções faria o time esquecer regra, prazo ou dependência;
- será útil guardar um **AS-IS** e um **TO-BE** rastreáveis.

### Prefira Mermaid quando

- o principal valor está em explicar rapidamente uma ideia;
- o diagrama pode ser lido em poucos blocos sem perda de entendimento;
- não existe necessidade de preservar formalmente esperas, gateways ou responsabilidades por lane;
- o pedido é mais próximo de "me mostre um resumo" do que de "modele o processo".

## Casos de borda

- Se o usuário pedir "desenha o fluxo" e mencionar **aprovação, áreas, SLA, espera, fila humana ou exceção**, trate isso como forte candidato a BPMN.
- Se o usuário pedir "BPMN" mas o conteúdo for arquitetura, integração, API ou solução técnica, **não** use esta skill como desculpa para modelar implementação.
- Se houver dúvida entre um Mermaid grande e um BPMN simples, escolha **BPMN** quando a manutenção futura do processo importar.

## Exemplos de prompt

- **BPMN:** "Preciso mapear o processo atual de aprovação de crédito entre agência, backoffice e compliance, com devoluções e prazo de resposta."
- **BPMN:** "Formalize o TO-BE do fluxo de contestação com alçada, espera por documentos e retorno ao cliente."
- **Mermaid:** "Crie uma jornada simples do cliente desde a contratação até a confirmação."
- **Mermaid:** "Mostre num flowchart curto o escopo da fase 1 e o que fica de fora."
