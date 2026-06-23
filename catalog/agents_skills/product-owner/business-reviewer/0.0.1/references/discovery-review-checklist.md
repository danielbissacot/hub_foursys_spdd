# Checklist de Revisão — Discovery de Negócio

## Papel deste checklist
Use este checklist antes de promover `discovery.md` para PRD. O discovery só avança quando o problema, os limites da feature e as incertezas críticas estão explícitos em linguagem de negócio.

## Procedimento determinístico
1. Confirme a presença de `Identificação rápida` e das `Atividades 1` a `5` do template, incluindo os subblocos obrigatórios da `Atividade 5`.
2. Aplique `business-language-guardrails.md` em todo o texto.
3. Percorra os blocos abaixo na ordem apresentada.
4. Registre cada falha como:
   - `BLOQUEADOR` — impede avanço para PRD.
   - `AJUSTE NECESSÁRIO` — precisa correção antes de aprovação final.
   - `OBSERVAÇÃO` — melhoria útil, mas não impeditiva.
5. Emita um único veredicto:
   - `Aprovado para PRD`
   - `Revisar discovery`
   - `Bloqueado`

## Gate de presença mínima
- [ ] `Identificação rápida` contém Epic/iniciativa, contexto relacionado, responsável pelo discovery e data da última atualização.
- [ ] `Atividade 1 — Visão da Feature` contém problema ou oportunidade, público mais impactado, benefício esperado para a pessoa usuária, benefício esperado para o negócio, cenário atual, urgência e frase de visão.
- [ ] `Atividade 2 — A Feature É / NÃO É / FAZ / NÃO FAZ` está preenchida sem lacunas nos limites centrais.
- [ ] `Atividade 3 — Personas Impactadas` identifica ao menos a persona principal, o que ela precisa conseguir fazer e sua maior frustração atual.
- [ ] `Atividade 4 — Cenários e Comportamentos` traz cenários essenciais com gatilho, o que precisa acontecer, resultado esperado e regras de negócio relacionadas.
- [ ] `Atividade 4 — Cenários e Comportamentos` registra exceções ou variações importantes, condições prévias relevantes e `Dependências externas de negócio, processo ou aprovação`.
- [ ] Quando o processo envolver múltiplos atores, aprovações, gateways, esperas, exceções ou handoffs relevantes, `Atividade 4 — Mapa opcional do processo de negócio` referencia BPMN AS-IS e TO-BE draft em `./bpmn/` *(isto é, na pasta canônica `_intermediarios/bpmn/`)* ou justifica por que BPMN ainda não é necessário.
- [ ] `Atividade 5 — Priorização de Escopo` separa claramente `Essencial nesta entrega`, `Incremental ou posterior` e `Fora desta entrega por agora`.
- [ ] `Atividade 5 — Priorização de Escopo` contém os blocos `Regras de negócio prioritárias`, `Métricas e sinais de sucesso`, `Riscos de negócio`, `Hipóteses e premissas` e `Perguntas em aberto`.

## 1. Clareza do problema e do valor
- [ ] O problema de negócio está descrito de forma direta, sem exigir interpretação técnica.
- [ ] A persona principal está identificada como pessoa, perfil ou área real de negócio.
- [ ] O benefício esperado está explícito do ponto de vista do negócio ou da pessoa usuária.
- [ ] O texto explica por que a iniciativa importa agora e como a situação é tratada hoje.
- [ ] A visão da feature descreve necessidade e resultado; não começa pela solução.

## 2. Completude específica do discovery
- [ ] Os limites `É / NÃO É / FAZ / NÃO FAZ` reduzem ambiguidade real e não repetem a mesma ideia em colunas diferentes.
- [ ] Há cenários suficientes para cobrir o fluxo principal e as exceções críticas já conhecidas.
- [ ] Quando houver complexidade de processo, a escolha entre Mermaid e BPMN está explícita e não esconde detalhes relevantes do negócio.
- [ ] A priorização separa o que é obrigatório nesta entrega do que pode ficar para depois ou sair do escopo atual.
- [ ] `Regras de negócio prioritárias` explicitam decisões, validações ou exceções que mudam o comportamento da feature.
- [ ] Hipóteses relevantes em `Hipóteses e premissas` estão explicitadas quando ainda não há certeza sobre comportamento, valor ou adesão.
- [ ] Métricas ou sinais de sucesso existem para o resultado esperado ou há plano explícito para coletá-los.
- [ ] Riscos de negócio, dependências externas e perguntas em aberto registram impacto e encaminhamento.

## 3. Ambiguidade, jargão e solutioning oculto
- [ ] Não há jargão técnico indevido no corpo do discovery, como `API`, `endpoint`, `DTO`, `microserviço`, `batch`, `fila`, `payload`, `schema`, `cache` ou termos equivalentes sem tradução funcional.
- [ ] Não há solutioning oculto, como `implementar`, `criar endpoint`, `persistir em tabela`, `alterar backend`, `subir job`, `publicar evento`, `criar tela`, quando o texto deveria descrever comportamento de negócio.
- [ ] Termos vagos como `melhorar`, `otimizar`, `facilitar`, `intuitivo`, `rápido`, `adequado`, `quando necessário` ou `automaticamente` só aparecem se vierem acompanhados de condição e resultado observável.
- [ ] Não há critérios não testáveis, como `experiência amigável`, `processo eficiente`, `sem impacto perceptível` ou `funcionamento ideal`.
- [ ] Quando um sistema, canal ou processo é citado, o impacto funcional fica claro para o leitor de negócio.

## 4. Fronteiras de escopo
- [ ] O que entra nesta entrega é coerente com os cenários priorizados como essenciais.
- [ ] O que fica fora está explicitado e não contradiz o benefício prometido.
- [ ] Não existem itens essenciais escondidos como `pergunta em aberto` para evitar decisão de escopo.
- [ ] Dependências externas não estão sendo usadas para mascarar falta de definição sobre a feature.
- [ ] O discovery não mistura objetivo desta entrega com roadmap futuro sem separação clara.

## 5. Rastreabilidade interna
- [ ] Cada cenário principal pode ser conectado ao problema declarado e a pelo menos uma persona impactada.
- [ ] Quando existir BPMN draft, seus atores, gateways, exceções e handoffs estão coerentes com cenários, regras e limites de escopo.
- [ ] Cada regra de negócio prioritária pode ser conectada a pelo menos um cenário, limite de escopo ou exceção relevante.
- [ ] Cada hipótese informa como será validada e qual evidência a confirmaria ou refutaria.
- [ ] Cada métrica de sucesso mede um resultado relevante para o problema descrito.
- [ ] Cada risco de negócio, dependência externa ou pergunta em aberto aponta impacto, responsável ou próximo passo.
- [ ] A priorização de escopo é coerente com os benefícios e métricas definidos na visão da feature.

## 6. Verificabilidade
- [ ] Os cenários descrevem gatilho, ação esperada e resultado observável.
- [ ] As regras de negócio prioritárias podem ser verificadas por condição e efeito observável.
- [ ] As hipóteses podem ser validadas por pesquisa, experimento, dado operacional ou feedback objetivo.
- [ ] As métricas têm baseline/meta/janela de medição ou registram claramente a lacuna de medição como pendência.
- [ ] As perguntas em aberto descrevem o que falta decidir, por que importa e quem ou o que destrava a decisão.
- [ ] Um reviewer consegue dizer, sem inventar detalhes técnicos, se o discovery está pronto para virar PRD.

## Bloqueadores típicos
Marque como `BLOQUEADOR` quando houver pelo menos um destes casos:
- Problema, persona principal ou benefício esperado ausente.
- Limites `É / NÃO É / FAZ / NÃO FAZ` contraditórios ou genéricos demais para delimitar a feature.
- Cenário essencial sem gatilho, ação ou resultado esperado.
- Regra de negócio prioritária ausente ou contraditória em uma decisão central do fluxo.
- Hipótese relevante sem forma de validação.
- Dependência crítica ou pergunta em aberto sem impacto ou encaminhamento.
- Escopo essencial indefinido ou escondido em perguntas em aberto.
- Texto dominado por solução técnica em vez de linguagem de negócio.

## Formato mínimo de saída da revisão
```md
Status: Aprovado para PRD | Revisar discovery | Bloqueado

Bloqueadores
- [item]

Ajustes necessários
- [item]

Observações
- [item]

Pendências para a próxima fase
- [item]
```
