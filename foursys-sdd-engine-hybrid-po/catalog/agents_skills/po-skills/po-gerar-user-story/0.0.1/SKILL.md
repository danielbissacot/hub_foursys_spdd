---
name: 'po-gerar-user-story'
description: "Decompõe um PRD aprovado em user stories de negócio prontas para backlog grooming, usando gerar-user-story como capacidade compartilhada em modo thin-wrapper e aplicando template business-first com escrita APF-otimizada (via apf-rules), guardrails de linguagem, checagem de cobertura e revisão funcional antes de qualquer publicação. Use também quando precisar gerar user stories que tornem funcionalidades visíveis para contagem legítima de pontos de função, sem incluir contagem numérica, pesos ou fórmulas."
metadata:
  version: "0.0.1"
---

# Geração de user stories de negócio — fase C

Decompõe um `prd/prd.md` aprovado em um backlog de negócio claro, rastreável e pronto para backlog grooming.

> **Pipeline:** `po-iniciar-discovery → po-refinar-negocio → po-gerar-user-story`

## Quando usar

Use esta skill quando houver necessidade de:
- transformar um PRD aprovado em histórias menores, independentes quando possível e orientadas a valor;
- quebrar a feature por fluxo de usuário, resultado de negócio, regra relevante ou exceção crítica;
- gerar arquivos em `user-stories/` usando o template business-first local;
- revisar cobertura, duplicidade, dependências e clareza antes de publicar ou levar para grooming.

## Quando não usar

Não use esta skill para:
- iniciar a decomposição sem `prd.md` aprovado;
- discutir arquitetura, APIs, banco de dados, eventos, integrações detalhadas ou plano de implementação;
- criar `REGRAS TÉCNICAS`, Tech Solution, DAG de execução ou tarefas técnicas;
- substituir o `tl-refiner` em refinamento técnico, planejamento ou execução.

## Decisão explícita de thin-wrapper

`po-gerar-user-story` é um **wrapper fino** sobre a capacidade compartilhada `gerar-user-story`.
O reuso é **transparente para quem opera o plugin**: o comando continua sendo `po-gerar-user-story`.
A skill compartilhada **não é local deste repositório**; aqui o wrapper documenta como especializar a capacidade genérica para o contexto business-first do po-refiner.

### O que o wrapper reaproveita
- disciplina de decomposição em histórias rastreáveis;
- convenção de saída determinística em `user-stories/`;
- preocupação com cobertura do artefato de origem antes de encerrar a fase;
- revisão antes de publicação opcional em Jira/Atlassian.

### O que o wrapper especializa para o po-refiner

| Elemento | Capacidade compartilhada `gerar-user-story` | `po-gerar-user-story` |
|---|---|---|
| Documento de origem | ADR/RFC aprovado | `prd/prd.md` aprovado |
| Lente de decomposição | serviço, canal, paralelismo técnico, shared concerns | fluxo de usuário, resultado de negócio, regra ou exceção funcional |
| Template principal | estrutura com foco técnico/APF | `skills/po-gerar-user-story/references/user-story-template.md` |
| Escrita APF | lógica completa de APF (contagem, pesos, REGRAS TÉCNICAS) | apenas o subconjunto de negócio de `apf-rules`: formato APOIO APF com ➡️, visibilidade funcional, persona e linguagem de RN |
| Guardrails obrigatórios | escrita orientada ao ecossistema técnico | `business-language-guardrails.md` + checklist funcional + guardrails APF sem contagem |
| Saídas | USs + artefatos técnicos opcionais | apenas user stories de negócio + artefatos leves de cobertura/dependência |
| Limite da fase | pode seguir para Tech Solution/Jira/planejamento | para em backlog de negócio revisado; sem seção técnica nem planejamento |

### Consequência prática da decisão
- use a capacidade compartilhada apenas como **base de forma e orquestração**;
- **não** herde a pré-condição de ADR/RFC nem seções técnicas;
- consulte a skill `apf-rules` **apenas como referência de escrita** para APOIO APF e visibilidade funcional, ignorando qualquer orientação técnica, decomposição APF-first, contagem ou otimização numérica;
- se a capacidade compartilhada ou `apf-rules` não estiverem acessíveis na sessão, siga estas instruções locais do mesmo jeito;
- o wrapper deve sempre reforçar template business-first, guardrails de linguagem, checagem de cobertura e convenções de saída do po-refiner.

#### Uso permitido vs. proibido de APF nesta skill

| Uso de APF | Permitido? |
|---|---|
| Tornar funcionalidades visíveis no APOIO APF com ➡️ | ✅ Sim |
| Identificar ALIs e AIEs em linguagem de negócio | ✅ Sim |
| Melhorar clareza de RN/CA com vocabulário funcional APF | ✅ Sim |
| Aplicar regras de persona EU COMO de `apf-rules` | ✅ Sim |
| Separar histórias para maximizar APF | ❌ Não |
| Incluir pontuação, pesos, FI ou fórmulas | ❌ Não |
| Incluir REGRAS TÉCNICAS, DTOs, mappers, configs | ❌ Não |
| Usar APF como critério de decomposição | ❌ Não |

## Fronteira obrigatória da skill

<HARD-GATE>
Só execute esta fase com a demanda em `prd_approved` ou evidência equivalente de aprovação do PRD. Não gere histórias a partir de briefing cru, discovery incompleto ou PRD ainda em revisão.

Toda user story desta fase deve permanecer em linguagem de negócio e **não pode** conter `REGRAS TÉCNICAS`, arquitetura, contrato de API, payload, tabela, fila, job, plano de implementação, checklist de desenvolvimento ou qualquer instrução de execução.
</HARD-GATE>

## Pré-requisitos operacionais

- O workspace compartilhado `<centro-de-custo>-doc-<projeto>/` precisa estar resolvido.
- O PRD de origem deve estar disponível em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/prd/prd.md`.
- O artefato final **não** deve ser salvo dentro deste repositório do plugin.
- Se a raiz do doc repo, o `JIRA_KEY` ou a evidência de aprovação não puderem ser confirmados, a execução deve ficar `blocked`.

## Entradas aceitas

Receba, quando disponíveis:
- `JIRA_KEY` da iniciativa;
- caminho do PRD aprovado (`prd/prd.md`);
- indicação explícita de aprovação do PRD ou status de fase `prd_approved`;
- caminho opcional do BPMN aprovado (`prd/processo-negocio-to-be.bpmn` ou `.svg`);
- critérios de priorização do PO;
- dependências funcionais já conhecidas entre jornadas, áreas, aprovações ou histórias;
- instruções de fatiamento, quando o negócio quiser separar entregas por onda, canal funcional ou marco de valor;
- stories já existentes no diretório, caso a execução complemente um backlog iniciado.

### Contrato mínimo de entrada

Contrato funcional mínimo:
- `JIRA_KEY`;
- `prd/prd.md` aprovado;
- escopo incluído e excluído claro no PRD;
- regras de negócio consolidadas;
- critérios de aceite da feature em nível suficiente para decomposição.

Pré-condição operacional adicional:
- raiz do doc repo compartilhado disponível para gravar `user-stories/`.

Se faltar qualquer item que impeça rastrear a origem, delimitar escopo ou escrever critérios verificáveis, não invente. Registre `[PENDENTE: ...]` quando a lacuna ainda permitir fatiamento seguro; caso contrário, marque `blocked`.

## Saídas esperadas

### Saída obrigatória
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/user-stories/US-001-<slug>.md`

### Saídas recomendadas quando úteis para revisão
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/user-stories/index.md`
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/user-stories/coverage-map.md`
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/user-stories/dependencies-map.md`

### Convenções de saída
- use numeração sequencial estável: `US-001`, `US-002`, `US-003`...;
- use `slug` em kebab-case derivado da capacidade de negócio principal;
- cada arquivo representa **uma** história com objetivo principal único;
- o ID dentro do documento deve coincidir com o nome do arquivo;
- se já houver histórias aprovadas, preserve IDs existentes e continue a sequência;
- `index.md`, `coverage-map.md` e `dependencies-map.md` são opcionais, mas devem ser gerados quando ajudarem a tornar a revisão objetiva.

### Observação sobre BPMN nesta fase
- BPMN pode ser usado como **insumo de decomposição**, nunca como saída principal da Fase C.
- Quando existir `prd/processo-negocio-to-be.bpmn`, use-o para entender atores, gateways, esperas, exceções e handoffs do negócio.
- Não gere novo BPMN aqui por padrão; se o mapa de processo ainda precisar ser consolidado, volte para a Fase B.

## Conteúdo mínimo de cada user story

Toda história deve seguir `references/user-story-template.md` e manter, no mínimo:
- `📌 IDENTIFICAÇÃO` com ID, épico, status, prioridade, data e arquivo;
- `📌 APOIO APF` no formato ➡️ de `apf-rules`, listando funcionalidades, ALIs, AIEs e canais de teste em linguagem de negócio — sem contagem, pesos ou fórmulas;
- `👤 NARRATIVA` em `EU COMO / QUERO QUE / PARA` com persona real (nunca "sistema X"), seguindo as regras de persona de `apf-rules`;
- `🌍 CONTEXTO DE NEGÓCIO`;
- `🧭 NOTAS DE ESCOPO` com o que a história entrega sozinha;
- `🔗 DEPENDÊNCIAS`, quando existirem;
- `📋 REGRAS DE NEGÓCIO` em linguagem pura de negócio, onde cada RN descreva naturalmente um processo elementar distinto (ação + objeto de dados + fonte/destino quando aplicável);
- `✅ CRITÉRIOS DE ACEITE (BDD)` com cobertura de cenários de sucesso, erro e exceção;
- `🧪 NOTAS DE VALIDAÇÃO`;
- `🚫 FORA DE ESCOPO`, `⚠️ RISCOS` e `🗂️ MATERIAIS RELACIONADOS`.

Use `[PENDENTE: ...]` para informação ausente e `[NÃO SE APLICA]` quando o bloco não fizer sentido.

## Carregamento progressivo de contexto

Não carregue todo o contexto de uma vez. Trabalhe nesta ordem:

1. **Entrada do usuário e contrato mínimo**  
   Comece por `JIRA_KEY`, aprovação do PRD, critérios de priorização e raiz do doc repo.
2. **Convenções do plugin, se necessário**  
   Consulte `.claude-plugin/plugin.json` e `CLAUDE.md` apenas para confirmar fase, naming, workspace e nota de thin-wrapper.
3. **PRD aprovado**  
   Leia `prd/prd.md` como fonte principal de escopo, regras, critérios e dependências.
4. **BPMN aprovado, quando existir**  
   Leia `prd/processo-negocio-to-be.bpmn` ou `prd/processo-negocio-to-be.svg` como apoio para entender o processo e as costuras de negócio.
5. **Template local da user story**  
   Carregue `skills/po-gerar-user-story/references/user-story-template.md` antes de redigir qualquer história.
6. **Referência APF para escrita**  
   Consulte `skills/apf-rules/SKILL.md` para aplicar o formato ➡️ do APOIO APF, regras de persona e vocabulário funcional. Use apenas o subconjunto de negócio; ignore REGRAS TÉCNICAS, contagem numérica e decomposição APF-first. Para cenários especiais ou dúvidas, consulte `skills/apf-rules/references/checklist.md` e `skills/apf-rules/references/cenarios-especiais.md`.
7. **Guardrails e checklist**  
   Carregue `business-language-guardrails.md` e `user-story-review-checklist.md` antes da revisão.
8. **Referência compartilhada, sob demanda**  
   Consulte `_reference/tl-refiner/skills/gerar-user-story/0.0.1/SKILL.md` apenas para reaproveitar disciplina de decomposição, nunca para copiar seções técnicas.
9. **Publicação opcional**  
   Use `jira-api` ou `atlassian-api` somente depois dos gates de cobertura e revisão aprovados.

## Fluxo de orquestração

### Passo 1 — Confirmar a pré-condição e o destino

Confirme ou obtenha:
- `JIRA_KEY` e raiz do doc repo compartilhado;
- caminho exato do PRD: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/prd/prd.md`;
- evidência de aprovação do PRD;
- diretório de saída: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/user-stories/`.

Se a aprovação do PRD não estiver clara, pare na fase B. Não use esta skill para “adiantar” decomposição em cima de material ainda instável.

### Passo 2 — Extrair o mapa funcional do PRD

Antes de escrever qualquer história, extraia do PRD:
- problema, objetivo e valor esperado;
- escopo IN/OUT;
- requisitos funcionais e regras de negócio;
- critérios BDD da feature;
- jornadas, etapas operacionais, aprovações e exceções relevantes;
- dependências funcionais, riscos e pendências que afetam fatiamento.

Se existir BPMN aprovado em `prd/processo-negocio-to-be.*`, use-o para confirmar:
- atores e raias que realmente importam para o negócio;
- gateways, aprovações e esperas que mudam a costura do backlog;
- exceções e handoffs que precisam aparecer nas histórias ou em suas dependências.

Monte um mapa de candidatos a história sem falar de solução. Cada candidato deve apontar para um trecho rastreável do PRD.

### Passo 3 — Decompor por costuras de negócio, não por costuras técnicas

Aplique esta ordem de decisão:

1. **Resultado de negócio**  
   Separe histórias quando houver benefícios, validações ou prioridades claramente distintos.
2. **Fluxo de usuário ou etapa operacional**  
   Se o resultado ainda estiver grande demais, separe por momento da jornada que faça sentido isoladamente para backlog grooming.
3. **Regra ou exceção funcional relevante**  
   Crie história separada apenas quando a regra ou exceção mudar prioridade, validação, operação ou ordem de entrega.
4. **Dependência funcional real**  
   Registre dependências entre histórias quando uma exigir aprovação, dado, etapa anterior ou decisão de outra história para gerar valor.

### Quando separar histórias
- o PRD mistura onboarding, consulta, atualização, aprovação, comunicação ou tratamento de exceção como se fosse uma única entrega;
- duas personas ou áreas diferentes validam resultados distintos;
- uma exceção crítica merece priorização própria;
- o negócio quer liberar valor em ondas independentes;
- uma dependência real altera a ordem do backlog.

### Quando manter junto
- os passos só fazem sentido combinados para entregar um único resultado de negócio;
- a regra é inseparável da capacidade principal;
- separar criaria história artificial, sem valor compreensível isoladamente.

### Nunca use como critério principal de decomposição
- serviço, microserviço, endpoint, API, tela, tabela, fila, job, evento, camada ou banco de dados;
- tarefas de desenvolvimento, testes técnicos, migração, observabilidade ou infraestrutura;
- maximização de APF ou paralelismo de implementação.

### Passo 4 — Redigir cada história com o template local e escrita APF-otimizada

Para cada história definida:
- use `references/user-story-template.md` como esqueleto obrigatório;
- escreva título e narrativa em linguagem de negócio;
- mantenha uma única intenção principal por arquivo;
- aplique as regras de escrita APF de `apf-rules` conforme descrito abaixo;
- inclua regras e critérios BDD diretamente ligados ao objetivo da história;
- explicite `FORA DE ESCOPO` para evitar expansão indevida;
- registre dependências reais e riscos de negócio;
- use `🗂️ MATERIAIS RELACIONADOS` para apontar ao PRD, regra, discovery ou decisão de origem;
- nunca adicione seção técnica, subtarefa de implementação ou plano de execução.

#### Escrita APF-otimizada (subconjunto de negócio de `apf-rules`)

Ao redigir cada história, consulte `apf-rules` para aplicar apenas estas práticas:

**APOIO APF com ➡️:**
- liste cada funcionalidade distinta de negócio com ➡️ e formato `Funcionalidade de [verbo] + [objeto de negócio] + [contexto]`;
- identifique ALIs como `Agrupamento de dados de negócio: [entidade] ([novo|alterado])`;
- identifique AIEs como `Sistema referenciado: [nome] — [uso funcional]`;
- inclua browsers/plataformas de teste somente quando o PRD, canal da solução ou validação de negócio indicar explicitamente; não invente canais para APF;
- cada funcionalidade distinta deve ter sua própria linha ➡️.

**Persona (EU COMO):**
- use persona real (papel, perfil ou área) — nunca `EU COMO sistema X`;
- o `QUERO QUE` deve mencionar naturalmente os processos-chave que correspondem às funcionalidades do APOIO APF.

**Regras de Negócio:**
- cada RN deve descrever naturalmente um processo elementar distinto: ação + objeto de dados + fonte/destino quando houver integração;
- mencione persistência de forma funcional quando houver ALI implícito (ex.: "persistir em registro de controle dedicado");
- mencione consulta/envio a sistema externo quando houver AIE implícito (ex.: "consumindo a API X como fonte externa de dados");
- cada funcionalidade do APOIO APF deve ter pelo menos uma RN correspondente.

**Critérios de Aceite:**
- cada funcionalidade do APOIO APF deve ter pelo menos um CA correspondente;
- cubra cenários de sucesso, erro e exceção funcional.

**O que NÃO aplicar de `apf-rules`:**
- REGRAS TÉCNICAS (DTOs, mappers, Feign, configs, YAML, testes técnicos, observabilidade);
- contagem numérica, pesos (PF), fórmulas, fatores de impacto (FI);
- termos técnicos (classes, filas, endpoints, frameworks) nas RNs.

### Passo 5 — Validar cobertura, duplicidade e dependências

Antes da revisão final, compare o conjunto de histórias com o PRD e verifique:
- cada requisito, regra ou critério crítico do escopo incluído está coberto por pelo menos uma história;
- nenhuma história contradiz o `FORA DE ESCOPO` do PRD;
- não existem duas histórias com o mesmo objetivo principal disfarçadas por títulos diferentes;
- toda dependência relevante está explícita na história ou em `dependencies-map.md`;
- se houver BPMN aprovado, os principais gateways, handoffs, aprovações e exceções relevantes do processo estão refletidos no fatiamento ou explicitamente adiados;
- a origem de cada história no PRD é explicável por qualquer reviewer de negócio.

Gere `index.md`, `coverage-map.md` e `dependencies-map.md` sempre que o volume de histórias, regras ou dependências tornar essa checagem difícil de sustentar só na leitura direta.

## HARD-GATE: user-stories-coverage-valid

Não avance para revisão final enquanto não estiver explícito, no mínimo, que:
- todo escopo incluído do PRD foi coberto por uma ou mais histórias, ou marcado como futura história fora desta rodada;
- regras e exceções mandatórias estão atribuídas a histórias específicas;
- não há duplicidade material entre histórias;
- dependências reais estão registradas e não escondem trabalho obrigatório da própria história;
- quando houver BPMN aprovado, o lote de histórias permanece coerente com seus atores, gateways, handoffs e exceções relevantes;
- nenhuma história virou épico disfarçado, tarefa técnica disfarçada ou plano de implementação;
- cada APOIO APF usa apenas linguagem funcional de negócio com formato ➡️;
- não há PF, pesos, FI, fórmulas ou contagem numérica em nenhuma história;
- nenhuma história foi separada apenas para maximização de APF;
- cada funcionalidade do APOIO APF tem pelo menos uma RN e um CA correspondente;
- não há `REGRAS TÉCNICAS` ou detalhes de implementação em nenhuma história.

Se o gate falhar, reorganize o fatiamento, ajuste histórias, gere artefatos auxiliares de cobertura/dependência se necessário e só então siga.

### Passo 6 — Submeter à revisão funcional com `business-reviewer`

Quando o gate de cobertura passar, acione `business-reviewer` com:
- o PRD aprovado;
- o conjunto de arquivos em `user-stories/`;
- `skills/business-reviewer/references/user-story-review-checklist.md`;
- `skills/business-reviewer/references/business-language-guardrails.md`.

A revisão deve checar, no mínimo:
- clareza de `EU COMO / QUERO QUE / PARA`;
- critérios BDD verificáveis;
- regras de negócio objetivas;
- ausência de jargão técnico, antecipação de solução e critérios vagos;
- independência e tamanho adequado para backlog grooming;
- rastreabilidade da história para o PRD;
- dependências e riscos suficientes para priorização.

Se a support skill ainda não estiver operacional, aplique manualmente os mesmos arquivos de referência e registre o veredicto da revisão funcional.

## HARD-GATE: business-review-passed

A fase só pode terminar como `done` quando todas as histórias tiverem passado pela revisão funcional sem bloqueadores.

Bloqueie ou revise novamente se houver qualquer um destes casos:
- narrativa sem ator, capacidade ou benefício claros;
- critérios ausentes, fora de BDD ou não testáveis;
- uso de termos técnicos sem papel funcional explícito;
- história escrita como solução, tarefa técnica ou plano de implementação;
- ausência de rastreabilidade para épico/PRD;
- dependência crítica omitida ou escopo ambíguo.

### Passo 7 — Publicação opcional

Somente depois de `business-review-passed`, e apenas se solicitado, use `jira-api` ou `atlassian-api` para publicar ou espelhar as histórias.

Regras:
- o workspace compartilhado continua sendo a fonte de verdade;
- nunca substitua os arquivos do doc repo por texto publicado apenas no Jira/Confluence;
- não publique histórias bloqueadas ou ainda em revisão.

## State machine da fase

- `prd_approved` → `user_stories_in_progress`  
  Trigger: execução de `po-gerar-user-story`.
- `user_stories_in_progress` → `user_stories_review`  
  Trigger: `HARD-GATE: user-stories-coverage-valid` aprovado.
- `user_stories_review` → `done`  
  Trigger: `HARD-GATE: business-review-passed` aprovado.
- `qualquer estado` → `blocked`  
  Quando faltar aprovação do PRD, houver conflito crítico de escopo, dependência impeditiva sem tratamento ou impossibilidade de validar cobertura.

## Terminal state

Ao concluir, apresente de forma objetiva:
- status final: `done` ou `blocked`;
- artefatos gerados em `user-stories/`;
- se `index.md`, `coverage-map.md` ou `dependencies-map.md` foram gerados;
- principais dependências ou pendências ainda abertas;
- próximo passo recomendado: backlog grooming e, quando fizer sentido, handoff ao `tl-refiner` a partir de PRD + histórias aprovadas.

**Não** avance automaticamente para planejamento técnico, ADR/RFC ou execução.

## Referências carregáveis

- `skills/po-gerar-user-story/references/user-story-template.md`
- `skills/apf-rules/SKILL.md` — subconjunto de negócio: formato APOIO APF, persona, vocabulário funcional
- `skills/apf-rules/references/checklist.md` — checklist de revisão APF (usar apenas itens de visibilidade funcional)
- `skills/apf-rules/references/cenarios-especiais.md` — cenários especiais APF (multi-browser, batch, BPM)
- `skills/apf-rules/references/exemplos.md` — exemplos de APOIO APF (usar como referência de formato, ignorar REGRAS TÉCNICAS)
- `skills/business-reviewer/SKILL.md`
- `skills/business-reviewer/references/user-story-review-checklist.md`
- `skills/business-reviewer/references/business-language-guardrails.md`
- `skills/bpmn-markdown/SKILL.md`
- `.claude-plugin/plugin.json`
- `CLAUDE.md`
- `_reference/tl-refiner/skills/gerar-user-story/0.0.1/SKILL.md`
- `_reference/tl-refiner/skills/tech-spec-documentation/0.0.2/references/user-story-business-template.md`
