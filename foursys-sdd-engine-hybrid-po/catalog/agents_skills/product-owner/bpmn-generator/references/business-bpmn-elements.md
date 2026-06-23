# Subconjunto BPMN permitido no po-refiner

## Princípio

No po-refiner, BPMN serve para **processo de negócio**, não para desenho técnico. Use apenas o subconjunto abaixo e nomeie tudo em linguagem que um PO, BA ou stakeholder funcional consiga validar.

## Elementos permitidos

| Elemento | Quando usar | Como nomear em linguagem de negócio | Evite |
|---|---|---|---|
| **Pool / Participant** | separar atores externos ou grandes domínios organizacionais | nome da empresa, parceiro, cliente ou macroárea | nome de sistema, produto técnico ou microserviço |
| **Lane** | repartir responsabilidade dentro do mesmo participant | área, papel ou responsabilidade, como `Financeiro`, `Operação`, `Gestor` | `API`, `Banco`, `Fila`, `Batch`, `Portal X` |
| **Task** | representar uma ação funcional observável | verbo + objeto de negócio, como `Validar documentação`, `Aprovar solicitação` | ação técnica, query, endpoint, persistência |
| **Subprocess** | agrupar uma etapa grande sem perder leitura | resultado ou bloco funcional, como `Análise manual da solicitação` | decomposição técnica, workflow interno de sistema |
| **Start Event** | marcar o gatilho do processo | fato de negócio, como `Solicitação recebida` | trigger técnico, webhook, cron |
| **Intermediate Event** | mostrar espera, prazo, resposta externa ou exceção relevante | `Prazo expirado`, `Documentos recebidos`, `Retorno do parceiro` | detalhe de protocolo, mensageria ou evento técnico |
| **End Event** | marcar o resultado final | desfecho observável, como `Solicitação aprovada`, `Pedido recusado` | status interno de sistema sem significado de negócio |
| **Exclusive Gateway** | uma decisão leva a um único caminho | pergunta objetiva, como `Documentação está completa?` | regra implícita ou vaga |
| **Parallel Gateway** | trabalhos acontecem em paralelo e depois sincronizam | normalmente sem label, com contexto nas tasks vizinhas | paralelismo técnico desnecessário |
| **Inclusive Gateway** | uma ou mais saídas opcionais podem ocorrer | pergunta ou condição funcional clara | lógica complexa demais para o nível do PO |
| **Event-based Gateway** | o próximo caminho depende do evento que ocorrer primeiro | contexto de espera por resposta/prazo | competição de eventos técnicos |
| **Sequence Flow** | ligar passos dentro do mesmo processo | sem rótulo na maioria dos casos; rotule apenas desvios relevantes | texto excessivo em todas as setas |
| **Message Flow** | mostrar troca entre participants | nome da troca de negócio, como `Pedido enviado`, `Parecer devolvido` | payload, schema, endpoint |
| **Text Annotation** | registrar regra, premissa ou observação funcional | frase curta com contexto de negócio | explicação de implementação |

## Convenções de linguagem

### Pools e lanes

- Dê nome por **ator, papel, área ou parceiro**.
- Se a mesma área executar passos diferentes, mantenha uma lane só e varie as tasks.
- Não crie lane para cada tela, sistema ou canal técnico.

### Tasks

- Prefira `verbo + objeto`: `Registrar contestação`, `Analisar elegibilidade`, `Notificar solicitante`.
- O nome da task deve fazer sentido mesmo sem o resto do diagrama.
- Uma task deve representar uma ação funcional, não um detalhe de execução invisível ao negócio.

### Gateways

- Nomeie como pergunta quando a condição precisar ficar clara: `Valor excede alçada?`
- Se houver saída default, deixe isso claro pelo fluxo, sem proliferar textos longos.
- Use gateway só quando realmente existir escolha, paralelismo ou combinação de caminhos.

### Events

- Use eventos para o que **acontece** com relevância de negócio.
- Use espera por prazo ou retorno externo apenas quando isso mudar a leitura do processo.
- Se a exceção é importante para regra, evidencie o evento e o caminho alternativo.

## Fora de escopo neste skill

Não introduza elementos além do subconjunto acima. Portanto, evite:

- service task, script task, send task, receive task, business rule task e outros tipos orientados à execução;
- data object, data store, signal, compensation, transaction, choreography e modelagem de execução;
- métricas, logs, retries, filas técnicas, schemas, payloads, tabelas ou contratos de integração.

Se um modelador BPMN exigir um tipo mais específico no XML, mantenha o **significado visual e textual** no nível de tarefa de negócio e não exponha detalhe técnico no diagrama.

## Exemplos de labels bons

- `Cliente envia solicitação`
- `Operação valida documentação`
- `Gestor aprova exceção`
- `Prazo de resposta expirou`
- `Solicitação segue para análise manual`

## Exemplos de labels ruins

- `POST /solicitacoes`
- `Persistir em TB_SOLICITACAO`
- `Publicar evento no tópico`
- `Chamar serviço antifraude`
- `Consumir fila de reprocesso`
