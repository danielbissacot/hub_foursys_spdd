# Checklist de Revisão — User Story de Negócio

## Papel deste checklist
Use este checklist para revisar cada User Story antes de backlog grooming, aprovação do PO ou publicação no Jira. A User Story deve ser pequena o bastante para priorização, clara para negócio e verificável sem detalhamento técnico.

## Procedimento determinístico
1. Confirme a presença das seções obrigatórias da User Story.
2. Aplique `business-language-guardrails.md` em todo o texto.
3. Execute os blocos abaixo em ordem.
4. Classifique cada falha como `BLOQUEADOR`, `AJUSTE NECESSÁRIO` ou `OBSERVAÇÃO`.
5. Emita um único veredicto:
   - `Pronta para backlog grooming`
   - `Revisar User Story`
   - `Bloqueada`

## Gate de presença mínima
- [ ] Cabeçalho contém status, autor, data e issue/épico.
- [ ] `📌 IDENTIFICAÇÃO` contém `EU COMO`, `QUERO QUE` e `PARA`.
- [ ] `✅ CRITÉRIOS DE ACEITE` usa BDD e cobre o objetivo principal.
- [ ] `📋 REGRAS DE NEGÓCIO` está preenchida quando há decisão funcional relevante.
- [ ] `🚫 FORA DE ESCOPO` está explícito quando há risco de interpretação ampla.
- [ ] `⚠️ RISCOS` e `🔗 DEPENDÊNCIAS` estão preenchidos quando impactam priorização.
- [ ] Há referência mínima de origem (`Issue/Épico` e, se houver PRD aprovado, link ou IDs de origem em `🗂️ MATERIAL ADICIONAL` ou no corpo da história).
- [ ] Quando houver BPMN aprovado para a feature e a história depender de um branch, aprovação, exceção ou handoff específico, essa origem está explícita na rastreabilidade da história ou em artefato auxiliar do lote.

## 1. Clareza do objetivo da história
- [ ] `EU COMO` representa pessoa, perfil ou área de negócio real; não sistema, API ou componente.
- [ ] `QUERO QUE` descreve uma capacidade única e compreensível.
- [ ] `PARA` deixa explícito o benefício de negócio esperado.
- [ ] O título e a identificação contam a mesma história, sem conflito de intenção.
- [ ] A User Story descreve comportamento esperado, não tarefas internas de construção.

## 2. Completude para grooming
- [ ] Os critérios de aceite cobrem o fluxo principal e a exceção crítica mais provável, quando aplicável.
- [ ] As regras de negócio tratam restrições, validações e exceções mandatórias.
- [ ] O `FORA DE ESCOPO` evita expansão indevida da história.
- [ ] Riscos e dependências são suficientes para discussão de priorização.
- [ ] Quando houver BPMN aprovado, a história não contradiz atores, gateways, esperas, exceções ou handoffs relevantes do processo.
- [ ] O `APOIO APF`, quando usado, permanece descritivo e funcional; não orienta maximização APF nem adiciona jargão de contagem.

## 3. Ambiguidade, jargão e solutioning oculto
- [ ] Não há jargão técnico indevido, como `endpoint`, `API`, `payload`, `DTO`, `microserviço`, `fila`, `job`, `front-end`, `back-end`, `schema`, `banco`, `cache`, salvo quando traduzidos para papel funcional.
- [ ] Não há solutioning oculto, como `criar tela`, `integrar via API`, `persistir`, `alterar banco`, `implementar serviço`, `subir evento`, quando a história deveria falar de valor ao usuário.
- [ ] Não há frases vagas como `de forma simples`, `fluxo intuitivo`, `resposta rápida`, `quando necessário`, `automaticamente`, `tratamento adequado` sem condição observável.
- [ ] Não há critérios não testáveis, como `fácil de usar`, `sem esforço`, `com boa performance`, `experiência agradável`, sem medida ou comportamento verificável.
- [ ] Se a história citar sistema, aprovação ou canal, o papel funcional fica claro para o leitor de negócio.

## 4. Fronteiras de escopo e independência
- [ ] A história tem um objetivo principal único e pode ser priorizada sem depender de múltiplas entregas não descritas.
- [ ] A história não mistura cadastro, consulta, edição, aprovação, comunicação e exceções extensas como se fossem uma única entrega indivisível.
- [ ] O `FORA DE ESCOPO` remove interpretações sobre extensões óbvias, mas futuras.
- [ ] Dependências não estão sendo usadas para esconder trabalho obrigatório desta própria história.
- [ ] A história não é um épico disfarçado nem uma tarefa técnica disfarçada de User Story.

## 5. Rastreabilidade
- [ ] A User Story pode ser conectada ao épico e, quando houver PRD, a pelo menos um requisito, regra ou critério de origem.
- [ ] Quando houver BPMN aprovado, o reviewer consegue explicar qual etapa, gateway, exceção ou handoff do processo deu origem à história ou por que isso não se aplica.
- [ ] Cada critério de aceite sustenta diretamente o objetivo descrito em `QUERO QUE` e `PARA`.
- [ ] As regras de negócio reforçam os critérios ou tratam exceções relevantes; não ficam soltas.
- [ ] Riscos e dependências citados têm impacto claro sobre esta história, e não sobre a feature inteira de forma genérica.
- [ ] Um reviewer consegue explicar de qual parte do PRD esta história nasceu.

## 6. Verificabilidade
- [ ] Cada critério BDD tem condição inicial, ação e resultado observável.
- [ ] Os critérios permitem teste funcional sem depender de detalhes técnicos ocultos.
- [ ] Regras de negócio são objetivas e não usam adjetivos subjetivos como substituto de regra.
- [ ] A história deixa claro quando está concluída do ponto de vista do usuário ou da operação.
- [ ] A equipe consegue decidir aceite ou rejeição da história com base no texto, sem suposições extras.

## Bloqueadores típicos
Marque como `BLOQUEADOR` quando houver pelo menos um destes casos:
- Falta de persona, capacidade ou benefício em `EU COMO / QUERO QUE / PARA`.
- História com múltiplos objetivos independentes ou grande demais para grooming.
- Critérios de aceite ausentes, fora de BDD ou não testáveis.
- História redigida como tarefa técnica, solução arquitetural ou plano de implementação.
- Ausência de ligação com épico/PRD aprovado.
- Dependência crítica omitida para entendimento ou priorização da história.

## Formato mínimo de saída da revisão
```md
Status: Pronta para backlog grooming | Revisar User Story | Bloqueada

Bloqueadores
- [item]

Ajustes necessários
- [item]

Observações
- [item]

Origem/traceability
- [item]
```
