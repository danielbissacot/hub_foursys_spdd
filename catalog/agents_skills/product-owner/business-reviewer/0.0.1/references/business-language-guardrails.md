# Guardrails de Linguagem de Negócio

## Regra-mãe
Artefatos do PO descrevem **problema, ator, condição, regra, resultado, métrica e limite de escopo**. Eles não devem depender de arquitetura, stack, automação interna ou decisões de implementação para serem entendidos.

## Uso obrigatório
Aplique estes guardrails antes de qualquer checklist de discovery, PRD ou User Story.

## Padrões permitidos

| Finalidade | Padrão permitido | Exemplo preferido |
|---|---|---|
| Explicar necessidade | `[ator] precisa [ação/capacidade] para [resultado]` | `O analista precisa consultar o status do contrato para decidir o próximo atendimento.` |
| Descrever comportamento | `Quando [condição], o sistema deve [resultado observável]` | `Quando houver contrato vencido, o sistema deve impedir nova aprovação e informar o motivo.` |
| Delimitar escopo | `Inclui ...` / `Não inclui ...` | `Inclui consulta e bloqueio. Não inclui renegociação.` |
| Registrar regra | `Se [condição], então [regra/decisão]` | `Se o cliente estiver inadimplente, então a solicitação segue para análise manual.` |
| Definir métrica | `Reduzir [indicador] de [baseline] para [meta] em [janela]` | `Reduzir retrabalho manual de 30% para 10% em 60 dias.` |
| Registrar dependência | `Depende de [time/sistema/processo] para [impacto]` | `Depende do time de Compliance para validar o novo fluxo de aprovação.` |
| Registrar pendência | `Pendente: [decisão]. Impacto: [efeito]. Próximo passo: [ação].` | `Pendente: definir política para contrato vencido. Impacto: bloqueia exceções do fluxo.` |
| Nomear impacto de sistema | `[sistema/canal] participa como [papel funcional]` | `O Portal PJ participa como canal de solicitação do cliente.` |

## Representações visuais permitidas

- **Mermaid**: jornada simples, mapa de escopo, fluxo curto ou dependência leve.
- **BPMN**: processo de negócio com múltiplos atores, aprovações, gateways, esperas, exceções ou handoffs relevantes.
- Em BPMN, descreva **atores, etapas, decisões, esperas, exceções e handoffs do negócio**; não desenhe arquitetura, serviços, APIs ou componentes.
- No Markdown, o `.svg` é a representação embutida e deve apontar para o `.bpmn`, que continua sendo a fonte de verdade.

## Padrões desencorajados

| Evite | Problema | Reescrita preferida |
|---|---|---|
| `implementar`, `codificar`, `subir`, `deployar` | Foco em construção, não em comportamento de negócio | Descrever o resultado esperado para usuário/operação |
| `criar endpoint`, `integrar via API`, `persistir em tabela`, `publicar evento`, `rodar batch`, `usar fila` | Solutioning oculto | Descrever troca de informação, atualização, notificação ou prazo percebido |
| `front-end`, `back-end`, `DTO`, `payload`, `schema`, `microserviço`, `cache`, `webhook`, `job`, `thread`, `bucket` | Jargão técnico desnecessário | Usar `canal`, `sistema`, `informação`, `fonte externa`, `processo automatizado`, `arquivo`, `rotina` |
| `melhorar experiência`, `fluxo intuitivo`, `processo simples`, `resposta rápida`, `tratamento adequado` | Requisito vago | Informar condição, limite e resultado observável |
| `quando necessário`, `quando aplicável`, `automaticamente`, `em tempo real` | Condição ausente ou imprecisa | Declarar gatilho e prazo exato ou observável |
| `fácil de usar`, `sem fricção`, `robusto`, `resiliente`, `eficiente` | Critério não testável | Informar comportamento verificável, meta ou regra objetiva |
| `o sistema deve validar tudo` | Escopo indefinido | Explicitar quais validações, em qual momento e com qual resultado |
| `seguir regra atual` | Referência implícita e não rastreável | Nomear a regra, política, documento ou decisão aplicável |

## Sinais obrigatórios de revisão

### 1. Jargão técnico indevido
Sinalize quando o texto usar termos de engenharia sem tradução funcional, por exemplo:
- `API`, `endpoint`, `payload`, `DTO`, `microserviço`, `fila`, `broker`, `schema`, `feature flag`, `deploy`, `job`, `batch`, `cache`, `front-end`, `back-end`, `banco`, `tabela`.

**Ação:** reescrever a frase para papel funcional, canal, processo, informação ou prazo percebido.

### 2. Solutioning oculto
Sinalize quando o texto disser **como implementar** antes de dizer **qual comportamento precisa existir**, por exemplo:
- `criar uma tela para...`
- `integrar via webhook...`
- `persistir os dados...`
- `usar fila para...`
- `mover para o backend...`

**Ação:** reescrever para comportamento observável por usuário, operação ou processo.

### 3. Requisito vago
Sinalize quando a frase depende de adjetivo ou intenção genérica, por exemplo:
- `rápido`
- `simples`
- `intuitivo`
- `adequado`
- `otimizado`
- `conveniente`
- `melhorar`

**Ação:** substituir por gatilho, regra, prazo, métrica ou resultado verificável.

### 4. Critério não testável
Sinalize quando não for possível decidir aceite/rejeição observando comportamento ou dado, por exemplo:
- `experiência agradável`
- `sem impacto para o usuário`
- `alta performance`
- `processo eficiente`
- `comunicação clara` sem conteúdo esperado

**Ação:** converter em evidência observável, critério BDD, métrica ou condição de negócio.

## Reescritas rápidas

| Em vez de | Use |
|---|---|
| `Criar endpoint para consultar limite.` | `Permitir que o analista consulte o limite vigente do cliente.` |
| `Integrar via batch noturno.` | `Atualizar a informação até o início do próximo dia útil.` |
| `Tela intuitiva para aprovação.` | `O aprovador consegue concluir a decisão sem buscar informação fora do fluxo.` |
| `Validar no backend se o cadastro está correto.` | `Impedir conclusão do cadastro quando faltar informação obrigatória e informar o motivo.` |
| `Publicar evento para outro microserviço.` | `Notificar o processo responsável pela próxima etapa após a aprovação.` |
| `Melhorar a performance da consulta.` | `Reduzir o tempo para apresentar o resultado ao usuário de 3 minutos para 30 segundos.` |

## Exceções permitidas
- **Nome próprio de sistema, canal, área, documento ou regulação** pode ser usado quando for necessário para contexto. Exemplo: `Sistema Legado X`, `LGPD`, `Portal PJ`.
- **Termo técnico inevitável** só é aceito se vier acompanhado do papel funcional. Exemplo: `API do bureau externo, usada como fonte oficial de consulta de crédito`.
- **Nomes de browser** só são aceitáveis em `APOIO APF` ou contexto de validação; nunca como solução de produto.
- **Medições técnicas** só são aceitáveis se forem a forma oficial de um compromisso de negócio e estiverem traduzidas para impacto funcional percebido.

## Regras específicas para artefatos PO-facing
- Discovery, PRD e User Story devem poder ser lidos por PO e stakeholders sem interpretação de engenharia.
- `APOIO APF` deve permanecer descritivo; não introduza `ALI`, `AIE`, `EE`, `CE`, `SE`, `SNAP` ou estratégia de maximização APF em artefato de negócio.
- Handoff para o `tl-refiner` deve manter contexto funcional, não antecipar ADR/RFC nem decisão arquitetural.

## Teste final de linguagem
Antes de aprovar, responda `sim` para todas:
- O texto diz **o que muda para o negócio** antes de dizer **como será feito**?
- Um stakeholder consegue validar o comportamento esperado sem ajuda do time técnico?
- Cada frase relevante tem ator, condição, regra, resultado, métrica ou limite de escopo?
- Se um termo técnico permanecer, seu papel funcional está explícito?

Se alguma resposta for `não`, reescreva antes de aprovar.
