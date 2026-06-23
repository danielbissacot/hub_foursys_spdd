# Checklist de Revisão — PRD de Negócio

## Papel deste checklist
Use este checklist para revisar `prd.md` antes de aprovação formal e antes do handoff para o `tl-refiner`. O PRD deve funcionar como contrato funcional: explicar o problema, delimitar escopo, consolidar regras e permitir verificação sem reinterpretação extensa.

## Procedimento determinístico
1. Confirme a presença das seções obrigatórias do PRD.
2. Aplique `business-language-guardrails.md` em todo o documento.
3. Execute o checklist abaixo na ordem apresentada.
4. Classifique cada falha como `BLOQUEADOR`, `AJUSTE NECESSÁRIO` ou `OBSERVAÇÃO`.
5. Emita um único veredicto:
   - `Aprovado para handoff`
   - `Revisar PRD`
   - `Bloqueado`

## Gate de presença mínima
- [ ] `1. Problema` descreve dor, público afetado e evidências relevantes.
- [ ] `2. Objetivos` traz métricas observáveis, baseline, meta e forma de medição.
- [ ] `3. Escopo` separa `IN` e `OUT` com clareza.
- [ ] `4. Requisitos Funcionais` contém IDs únicos, descrição, critério resumido e prioridade.
- [ ] `5. Critérios de Aceite (BDD)` cobre os fluxos prioritários.
- [ ] `6. Regras de Negócio e Restrições` consolida decisões mandatórias e exceções.
- [ ] `7. Requisitos Operacionais / Experiência` descreve expectativas percebidas pelo negócio.
- [ ] `8. Riscos e Dependências` está preenchida.
- [ ] `9. Sistemas / Processos Impactados` está preenchida em nível funcional.
- [ ] Quando o processo envolver múltiplos atores, aprovações, gateways, esperas, exceções ou handoffs relevantes, a seção `6. Sistemas, canais e processos impactados` referencia `./processo-negocio-to-be.svg` e `./processo-negocio-to-be.bpmn`, ou justifica por que BPMN não é necessário.
- [ ] `11. Materiais Adicionais` referencia discovery e demais insumos relevantes.

## 1. Clareza do contrato funcional
- [ ] O problema é entendível por um leitor de negócio sem traduzir termos técnicos.
- [ ] Os objetivos descrevem resultado de negócio, não intenção genérica.
- [ ] O PRD explica o que precisa acontecer e para quem, sem prescrever arquitetura.
- [ ] Cada requisito funcional descreve comportamento esperado, não tarefa de implementação.
- [ ] As regras de negócio tornam explícitas decisões que não podem ficar implícitas para o time.

## 2. Completude para decisão e handoff
- [ ] O escopo `IN` cobre todo o valor mínimo prometido pela feature.
- [ ] O escopo `OUT` remove interpretações indevidas e expectativa de entrega extra.
- [ ] Requisitos P0 estão completos o bastante para orientar geração de user stories.
- [ ] Critérios BDD cobrem happy path e exceções críticas dos itens prioritários.
- [ ] Riscos e dependências incluem impacto e mitigação ou encaminhamento.
- [ ] Sistemas/processos impactados aparecem em alto nível funcional, sem cair em desenho técnico.
- [ ] Quando houver BPMN aprovado, ele reforça o entendimento do processo sem contradizer requisitos, regras ou BDD.
- [ ] Materiais adicionais permitem localizar discovery, referências externas e contexto complementar.

## 3. Ambiguidade, jargão e solutioning oculto
- [ ] Não há jargão técnico indevido no texto principal, como `endpoint`, `microserviço`, `DTO`, `payload`, `fila`, `job`, `schema`, `webhook`, `cache`, `front-end`, `back-end` ou equivalentes sem explicação funcional.
- [ ] Não há solutioning oculto em requisitos ou critérios, como `implementar`, `integrar via API`, `persistir`, `criar tabela`, `expor serviço`, `usar framework`, `processar em batch`, quando o ponto correto é o comportamento esperado.
- [ ] Não há frases vagas como `melhorar o processo`, `experiência intuitiva`, `resposta rápida`, `comunicação adequada`, `conforme necessário` ou `quando aplicável` sem condição observável.
- [ ] Não há critérios não testáveis, como `sem fricção`, `fácil de usar`, `resiliente`, `robusto`, `ótima experiência`, sem evidência observável.
- [ ] Quando um sistema ou canal é citado, o PRD explica seu papel funcional na jornada.

## 4. Fronteiras de escopo
- [ ] Nenhum requisito funcional introduz item que esteja fora do escopo `IN`.
- [ ] O `OUT` não contradiz cenários BDD, regras de negócio ou impactos declarados.
- [ ] Requisitos futuros ou incrementais estão separados do contrato desta entrega.
- [ ] Dependências externas não escondem decisões obrigatórias de produto.
- [ ] O PRD não tenta resolver, no mesmo texto, discovery aberto, rollout futuro e desenho técnico sem separação.

## 5. Rastreabilidade
- [ ] Cada objetivo pode ser relacionado ao problema e à métrica correspondente.
- [ ] Cada requisito funcional pode ser relacionado a um item do escopo `IN`.
- [ ] Cada cenário BDD referencia pelo menos um requisito funcional ou regra de negócio.
- [ ] Cada regra de negócio sustenta um requisito, um critério ou uma restrição de escopo.
- [ ] Riscos, dependências e impactos citados têm relação clara com requisitos ou fluxos específicos.
- [ ] O PRD referencia o discovery de origem e permite derivar user stories sem reinvenção de contexto.

## 6. Verificabilidade
- [ ] Objetivos podem ser medidos por indicador observável.
- [ ] Critérios de aceite usam `DADO / QUANDO / ENTÃO` com resultado verificável.
- [ ] Requisitos funcionais evitam subjetividade e dizem como validar sucesso de forma funcional.
- [ ] Requisitos operacionais / experiência descrevem efeito percebido pelo usuário ou operação, não atributo técnico abstrato.
- [ ] Um reviewer consegue avaliar aprovação da entrega apenas com o PRD, sem depender de interpretação técnica informal.

## 7. Prontidão para handoff ao tl-refiner
- [ ] O documento permite entender contexto funcional, limites de escopo, regras, critérios e dependências sem reescrita estrutural.
- [ ] Questões abertas estão isoladas e não invalidam o entendimento dos requisitos prioritários.
- [ ] Sistemas/processos impactados estão claros o bastante para orientar refinamento técnico posterior.
- [ ] Se houver BPMN aprovado, o handoff consegue apontar para ele sem ambiguidade entre `.svg` e `.bpmn`.
- [ ] O documento não exige ADR/RFC para explicar o comportamento funcional básico.

## Bloqueadores típicos
Marque como `BLOQUEADOR` quando houver pelo menos um destes casos:
- Problema, objetivo, escopo `IN/OUT` ou requisitos funcionais ausentes.
- Requisitos sem prioridade, sem critério resumido ou sem cenário BDD correspondente.
- Critérios de aceite subjetivos ou impossíveis de testar.
- Regras de negócio contraditórias, implícitas ou insuficientes para decisões centrais.
- Dependências ou impactos omitidos em itens que claramente dependem deles.
- Texto dominado por solução técnica ou por decisões de implementação.

## Formato mínimo de saída da revisão
```md
Status: Aprovado para handoff | Revisar PRD | Bloqueado

Bloqueadores
- [item]

Ajustes necessários
- [item]

Observações
- [item]

Rastreabilidade faltante
- [item]
```
