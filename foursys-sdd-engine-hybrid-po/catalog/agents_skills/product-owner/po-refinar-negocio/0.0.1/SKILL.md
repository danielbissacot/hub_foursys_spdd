---
name: 'po-refinar-negocio'
description: "Consolida a Fase B do po-refiner quando existe discovery aprovado e o objetivo é transformar esse entendimento em um PRD de negócio revisável e em um handoff funcional claro para o tl-refiner. Use esta skill para fechar problema, objetivo, escopo, regras, dependências e critérios BDD, parando antes de arquitetura, ADR, RFC, plano técnico ou execução."
metadata:
  version: "0.0.1"
---

# Refinamento de negócio — fase B

Consolida um PRD business-first e o contrato de handoff funcional da feature.

> **Pipeline:** `po-iniciar-discovery → po-refinar-negocio → po-gerar-user-story`

## Quando usar

Use esta skill quando houver necessidade de:
- transformar um `discovery.md` **aprovado** em um `prd.md` Jira-ready e revisável;
- consolidar problema, objetivos, escopo, regras de negócio, dependências e critérios BDD da feature;
- preparar um handoff funcional claro para o `tl-refiner` no workspace compartilhado;
- fechar a Fase B sem antecipar solução técnica.

## Quando não usar

Não use esta skill para:
- iniciar discovery do zero ou trabalhar com discovery ainda não aprovado;
- discutir arquitetura, viabilidade técnica profunda, ADR, RFC, APIs, modelo de dados ou desenho de solução;
- gerar plano de implementação, tarefas técnicas ou execução de desenvolvimento;
- substituir `po-gerar-user-story` quando o objetivo já for decompor backlog de negócio.

## Fronteira obrigatória da skill

<HARD-GATE>
Mantenha toda a fase em linguagem business-first. Não proponha arquitetura, ADR,
RFC, solução técnica, plano de implementação, contrato de API, modelo de dados
ou tarefas de engenharia. Se surgir uma dúvida técnica necessária para continuar,
registre-a como pendência para validação técnica no handoff e pare no limite do
po-refiner.
</HARD-GATE>

## Regra obrigatória: rodadas interativas de perguntas

<HARD-GATE>
O refinamento de negócio é um processo conversacional. Rodadas interativas de
perguntas com o usuário são **sempre obrigatórias**, independentemente da
quantidade de contexto já disponível no discovery aprovado ou fornecido pelo
usuário.

Mesmo quando o discovery for completo e o usuário fornecer contexto adicional:
1. **Analise** o discovery aprovado e todo contexto adicional contra o template do PRD.
2. **Identifique** gaps entre o discovery e o que o PRD exige: detalhes de regras
   de negócio, critérios de aceite, priorização de requisitos, dependências não
   mapeadas, métricas sem baseline, exceções não cobertas, etc.
3. **Formule perguntas interativas** usando a tool `ask_user` para cada bloco com
   lacunas, antes de preencher a seção correspondente do PRD.
4. **Nunca gere o PRD com `[PENDENTE: ...]`** em informações que poderiam ter sido
   obtidas perguntando ao usuário.

Use `[PENDENTE: ...]` **somente** quando o usuário explicitamente declarar que não
possui a informação naquele momento ou quando a resposta depender de terceiros
ausentes da conversa.

**Proibido:** gerar o prd.md e handoff completos de uma vez e depois listar
pendências para o usuário resolver. O processo correto é perguntar → receber →
consolidar → perguntar o próximo bloco → repetir até atingir a completude mínima.
</HARD-GATE>

## Pré-condições obrigatórias

### Pré-condição funcional
Esta skill só pode começar quando existir discovery aprovado da mesma demanda.
O estado esperado é `discovery_approved`.

### Evidências mínimas da pré-condição
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/discovery.md` existe.
- O `discovery.md` explicita problema, valor, limites de escopo, cenários prioritários e pendências.
- A aprovação funcional do discovery está registrada de forma explícita.
- A raiz do doc repo compartilhado `<centro-de-custo>-doc-<projeto>/` está resolvida com segurança.

Se o discovery estiver ausente, incompleto ou ainda não aprovado, não inicie a Fase B: mantenha a demanda em `blocked`.

## Pré-requisitos operacionais

- O artefato final **não** deve ser salvo dentro deste repositório do plugin.
- O workspace precisa permitir escrever em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/`.
- Se a raiz do doc repo não puder ser localizada com segurança, a execução deve ficar `blocked`.

## Entradas aceitas

Receba, quando disponíveis:
- `JIRA_KEY` da demanda;
- caminho do `discovery.md` aprovado;
- nome da iniciativa, épico ou resumo executivo;
- informações complementares do PO sobre contexto, métricas, políticas, restrições e stakeholders;
- links Jira/Confluence, materiais de apoio e evidências adicionais;
- confirmação da raiz do doc repo compartilhado.

### Contrato mínimo de entrada

Contrato funcional mínimo:
- `JIRA_KEY`;
- `discovery.md` aprovado em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/discovery.md`;
- delimitação inicial de escopo derivada do discovery;
- regras de negócio prioritárias ou cenários prioritários já identificados no discovery.

Pré-condição operacional adicional:
- raiz `<centro-de-custo>-doc-<projeto>/` resolvida.

Informação complementar pode enriquecer o PRD, mas **não** substitui o discovery aprovado.

## Saídas esperadas

### Saídas obrigatórias
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/prd/prd.md`
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/handoff/tl-refiner-input.md`

### Diretórios de destino
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/prd/`
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/handoff/`

### Saídas recomendadas quando o processo for complexo
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/prd/processo-negocio-to-be.bpmn`
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/prd/processo-negocio-to-be.svg`

### Conteúdo mínimo do `prd.md`
O documento deve seguir `skills/po-refinar-negocio/references/prd-template.md` e consolidar, no mínimo:
- problema ou oportunidade, contexto, urgência e evidências;
- objetivo de negócio, indicadores, baseline, meta e forma de acompanhamento;
- personas e atores impactados;
- escopo `IN` e `OUT`;
- premissas e restrições de negócio;
- sistemas, canais e processos impactados em **alto nível funcional**;
- referência ao processo TO-BE aprovado, em BPMN quando o fluxo tiver múltiplos atores, aprovações, gateways, esperas, exceções ou handoffs relevantes;
- requisitos funcionais com IDs, aplicabilidade, resultado esperado e prioridade;
- regras de negócio objetivas;
- expectativas operacionais e de experiência em linguagem observável;
- dependências, riscos, critérios BDD, resultados mensuráveis, anexos, perguntas em aberto e resumo executivo para handoff.

### Estrutura mínima do `handoff/tl-refiner-input.md`

Use `skills/po-refinar-negocio/references/handoff-template.md` como estrutura obrigatória do handoff.

No arquivo final:
- mantenha todos os campos obrigatórios do template;
- só omita campos opcionais quando realmente não ajudarem o entendimento;
- use `[PENDENTE: ...]` para lacunas reais e `[NÃO EXISTEM AINDA]` quando as user stories ainda não tiverem sido geradas.

Regras do handoff:
- manter apenas contexto funcional consumível pelo `tl-refiner`;
- apontar o BPMN aprovado quando ele existir, usando o `.svg` com link para o `.bpmn`;
- apontar pendências para validação técnica sem propor solução;
- usar `[PENDENTE: ...]` para lacunas reais e `[NÃO EXISTEM AINDA]` quando as user stories ainda não tiverem sido geradas;
- não incluir arquitetura, ADR, RFC, estratégia de implementação ou desenho técnico.

## Carregamento progressivo de contexto

Não carregue todo o contexto de uma vez. Trabalhe nesta ordem:

1. **Entrada do usuário e discovery aprovado**  
   Comece por `JIRA_KEY`, caminho do discovery e confirmação do status `discovery_approved`.
2. **Convenções do plugin, se necessário**  
   Consulte `.claude-plugin/plugin.json` e `CLAUDE.md` apenas para confirmar naming, guardrails e workspace compartilhado.
3. **Template do PRD**  
   Carregue `skills/po-refinar-negocio/references/prd-template.md` como esqueleto principal.
4. **Critérios de review**  
    Carregue `skills/business-reviewer/references/prd-review-checklist.md` e `skills/business-reviewer/references/business-language-guardrails.md` antes de fechar a revisão.
5. **Contexto complementar sob demanda**  
    Use `jira-api` ou `atlassian-api` apenas para recuperar links, descrição oficial ou materiais que complementem o discovery aprovado.
6. **Visualização funcional opcional**  
    Use `mermaid-generator` apenas quando um fluxo funcional simples ajudar a explicar escopo ou handoff. Se o processo tiver múltiplos atores, aprovações, gateways, esperas, exceções ou handoffs relevantes, use `bpmn-generator` + `bpmn-markdown` e grave o TO-BE aprovado em `prd/processo-negocio-to-be.*`.

## Fluxo de orquestração

### Passo 1 — Validar a pré-condição e preparar caminhos

Confirme ou obtenha:
- `JIRA_KEY` e nome da iniciativa;
- caminho do `discovery.md` aprovado;
- raiz do doc repo compartilhado;
- existência dos diretórios de saída `prd/` e `handoff/`.

Monte os caminhos finais exatamente como:
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/prd/prd.md`
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/handoff/tl-refiner-input.md`

Se o discovery não passar na pré-condição, não tente “completar” a fase B com inferência: devolva a necessidade para a Fase A ou marque `blocked`.

### Passo 2 — Analisar gaps e conduzir rodada interativa obrigatória

Antes de começar a consolidar o PRD, compare o discovery aprovado e qualquer
contexto adicional com o template do PRD (`references/prd-template.md`).

Classifique as lacunas por bloco:
1. problema, objetivo, indicadores e evidências;
2. escopo `IN/OUT`, personas e fronteiras;
3. requisitos funcionais e regras de negócio;
4. dependências, riscos e restrições;
5. critérios BDD e cenários de exceção;
6. métricas, baseline, meta e forma de acompanhamento.

**Mesmo que o discovery seja completo**, haverá sempre detalhes que o PRD exige e
que o discovery não cobre com profundidade suficiente. Identifique-os e formule
perguntas interativas usando `ask_user`.

Conduza as perguntas por bloco, priorizando os blocos com maior impacto para o
PRD. Não avance para o Passo 3 sem ter feito pelo menos uma rodada de perguntas
interativas com o usuário.

Exemplo de gaps típicos mesmo com discovery completo:
- Discovery descreve o problema, mas não define **indicador** com baseline e meta → pergunte.
- Discovery lista personas, mas não detalha **como cada uma é impactada** → pergunte.
- Discovery menciona regras, mas sem **exceções** e **critérios de validação** → pergunte.
- Discovery cita dependências, mas sem **dono, status e prazo** → pergunte.
- Discovery tem cenários, mas faltam **critérios BDD verificáveis** → pergunte.

### Passo 3 — Consolidar problema, objetivo e evidências

Transforme o discovery aprovado e as respostas das rodadas interativas em framing
funcional claro:
- síntese do problema ou oportunidade;
- contexto, urgência e evidências relevantes;
- objetivo de negócio, indicador principal, baseline e meta;
- resultado esperado para negócio e operação.

Quando faltar informação após as rodadas de perguntas, use `[PENDENTE: ...]` em
vez de inventar — mas somente para itens que o usuário confirmou não ter resposta.

### Passo 4 — Fechar escopo, atores e fronteiras

Converta o discovery em fronteira explícita de feature:
- derive `IN` e `OUT` a partir de `É / NÃO É / FAZ / NÃO FAZ` e da priorização do discovery;
- consolide personas e atores impactados;
- registre premissas e restrições de negócio;
- liste sistemas, canais e processos citados apenas pelo seu **papel funcional**.

Nenhum item fora do escopo deve reaparecer depois como requisito, regra ou cenário BDD.

### Passo 5 — Consolidar requisitos, regras, dependências e riscos

Use os cenários e as decisões do discovery para montar o contrato funcional:
- transforme comportamentos prioritários em requisitos funcionais com IDs únicos;
- registre regras de negócio mandatórias e exceções relevantes;
- detalhe dependências com dono, status e observações;
- registre riscos com impacto de negócio e mitigação ou contingência;
- se o processo justificar, consolide o BPMN TO-BE aprovado a partir do draft de discovery ou gere-o nesta fase;
- mantenha foco em comportamento esperado e impacto percebido, nunca em implementação.

### Passo 6 — Escrever critérios de aceite em BDD

Converta fluxos prioritários e exceções críticas em critérios `DADO / QUANDO / ENTÃO`.

Regras para os cenários:
- cada cenário deve ser verificável pelo negócio;
- cada cenário deve estar ligado a pelo menos um requisito funcional ou regra de negócio;
- cubra happy path e exceções críticas já conhecidas;
- evite adjetivos vagos, jargão técnico e critérios não testáveis;
- se um detalhe ainda estiver aberto, marque o trecho específico com `[PENDENTE: ...]`.

### Passo 7 — Montar o `prd.md`

Use `skills/po-refinar-negocio/references/prd-template.md` como estrutura obrigatória.

Durante o preenchimento:
- preserve todas as seções do template local;
- mantenha rastreabilidade entre problema, objetivo, escopo, requisitos, regras, BDD e dependências;
- destaque o que muda para o negócio antes de qualquer impacto em sistema ou processo;
- se houver BPMN aprovado, referencie o `.svg` e o `.bpmn` na seção apropriada do PRD;
- trate impactos em sistemas/canais/processos apenas em alto nível funcional;
- isole perguntas em aberto sem deixar implícito que estejam resolvidas.

### Passo 8 — Montar o `handoff/tl-refiner-input.md`

Use `skills/po-refinar-negocio/references/handoff-template.md` como estrutura obrigatória.

Sintetize o que o `tl-refiner` precisa receber sem reescrever o PRD inteiro:
- identificação da feature;
- problema e objetivo de negócio;
- escopo consolidado `IN/OUT`;
- regras de negócio inegociáveis;
- critérios BDD obrigatórios;
- referência ao BPMN TO-BE aprovado quando ele existir;
- dependências, riscos e pendências para validação técnica;
- sistemas, canais e processos citados em alto nível funcional;
- links para `prd.md`, `discovery.md` e user stories, quando existirem.

Se a Fase C ainda não tiver sido executada, deixe explícito no handoff: `User stories relacionadas: [NÃO EXISTEM AINDA]`.

### Passo 9 — Revisar com `business-reviewer`

Submeta `prd.md` e `handoff/tl-refiner-input.md` à revisão funcional.

Use como base obrigatória:
- `skills/business-reviewer/references/prd-review-checklist.md`
- `skills/business-reviewer/references/business-language-guardrails.md`

Se a support skill `business-reviewer` ainda não estiver operacional, aplique manualmente os mesmos critérios antes de aprovar.

### Passo 10 — Aplicar os gates finais

- Quando o `prd.md` atingir a completude mínima, mova a fase para `prd_review`.
- Só conclua em `prd_approved` quando o PRD estiver consistente **e** o handoff estiver válido para consumo do `tl-refiner`.
- Se houver contradição crítica, ausência de contexto essencial, dependência bloqueadora sem encaminhamento ou deriva técnica, mantenha `blocked`.

## Fluxo de revisão com `business-reviewer`

A revisão funcional deve verificar clareza, completude, verificabilidade e aderência à linguagem de negócio.

### Referências obrigatórias da revisão
- `skills/business-reviewer/references/prd-review-checklist.md`
- `skills/business-reviewer/references/business-language-guardrails.md`
- `skills/po-refinar-negocio/references/prd-template.md`
- `skills/po-refinar-negocio/references/handoff-template.md`
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/discovery.md`
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/prd/prd.md`
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/handoff/tl-refiner-input.md`

### Mapeamento entre checklist e template local do PRD
Ao aplicar `prd-review-checklist.md`, use a equivalência abaixo para manter coerência com o template local:
- checklist `1. Problema` ↔ seção `1. Resumo do problema ou oportunidade`;
- checklist `2. Objetivos` ↔ seções `2. Objetivo de negócio` e `13. Resultados mensuráveis pós-entrega`;
- checklist `3. Escopo` ↔ seção `4. Escopo`;
- checklist `4. Requisitos Funcionais` ↔ seção `7. Requisitos funcionais`;
- checklist `5. Critérios de Aceite (BDD)` ↔ seção `12. Critérios de aceite da feature (BDD)`;
- checklist `6. Regras de Negócio e Restrições` ↔ seções `5. Premissas e restrições de negócio` e `8. Regras de negócio`;
- checklist `7. Requisitos Operacionais / Experiência` ↔ seção `9. Expectativas operacionais e de experiência`;
- checklist `8. Riscos e Dependências` ↔ seções `10. Dependências` e `11. Riscos`;
- checklist `9. Sistemas / Processos Impactados` ↔ seção `6. Sistemas, canais e processos impactados`;
- checklist `11. Materiais Adicionais` ↔ seção `14. Anexos e links`, incluindo referência explícita ao `discovery.md` e ao handoff.

A seção `3. Personas e atores impactados` reforça cobertura funcional e deve permanecer coerente com problema, escopo e requisitos, mesmo não aparecendo isoladamente no checklist.

## HARD-GATE: prd-minimum-complete

Não avance de `prd_in_progress` para `prd_review` enquanto o `prd.md` não deixar explícitos, no mínimo:
- problema ou oportunidade, contexto e evidências relevantes;
- objetivo de negócio com indicador observável, baseline, meta e forma de acompanhamento;
- personas e atores impactados;
- escopo `IN` e `OUT` sem contradições;
- premissas e restrições de negócio relevantes;
- sistemas, canais e processos impactados em alto nível funcional;
- quando o processo justificar, referência ao BPMN TO-BE aprovado ou justificativa para sua ausência;
- requisitos funcionais com ID, aplicabilidade, resultado esperado e prioridade;
- regras de negócio objetivas e verificáveis;
- dependências e riscos com impacto e encaminhamento;
- critérios BDD cobrindo fluxos prioritários e exceções críticas conhecidas;
- anexos e links mínimos, incluindo referência ao `discovery.md`;
- resumo executivo para handoff funcional;
- lacunas reais marcadas com `[PENDENTE: ...]` em vez de inferidas.

Além disso:
- todas as seções do template local devem existir no arquivo final;
- o texto deve passar pelos guardrails de linguagem de negócio;
- nenhum requisito crítico pode depender de interpretação técnica informal para ser entendido.

Se faltar qualquer item central de problema, escopo, requisito, regra ou BDD, continue em `prd_in_progress` ou marque `blocked`.

## HARD-GATE: prd-handoff-valid

A fase só pode terminar como `prd_approved` quando **todos** os pontos abaixo forem verdadeiros:
- `business-reviewer` aprovou o pacote para handoff, ou a revisão manual equivalente chegou a `Aprovado para handoff`;
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/handoff/tl-refiner-input.md` existe e segue `skills/po-refinar-negocio/references/handoff-template.md`;
- o handoff referencia `../prd/prd.md` e `../_intermediarios/discovery.md`;
- se houver BPMN aprovado, o handoff referencia `../prd/processo-negocio-to-be.svg` e a fonte `../prd/processo-negocio-to-be.bpmn`;
- escopo `IN/OUT`, regras mandatórias, critérios BDD, dependências, riscos e sistemas/processos citados estão consistentes entre discovery, PRD e handoff;
- pendências para validação técnica estão isoladas como pendências, sem tentar resolver a solução;
- se user stories ainda não existirem, o handoff explicita `User stories relacionadas: [NÃO EXISTEM AINDA]`;
- o pacote permite que o `tl-refiner` comece o refinamento técnico **sem reescrever o contexto funcional**;
- não há conteúdo de arquitetura, ADR, RFC, desenho técnico ou plano de implementação dentro do PRD ou do handoff.

Se houver bloqueador na revisão, inconsistência entre artefatos ou handoff incapaz de sustentar a continuidade, não avance para `prd_approved`.

## State machine da fase

- `discovery_approved` → `prd_in_progress`  
  Trigger: execução de `po-refinar-negocio`.
- `prd_in_progress` → `prd_review`  
  Trigger: `HARD-GATE: prd-minimum-complete` aprovado.
- `prd_review` → `prd_approved`  
  Trigger: `HARD-GATE: prd-handoff-valid` aprovado.
- `qualquer estado` → `blocked`  
  Quando faltar discovery aprovado, houver contradição crítica de escopo/regra, dependência bloqueadora sem encaminhamento ou impossibilidade de localizar o doc repo.

## Terminal state

Ao concluir, apresente de forma objetiva:
- status final: `prd_approved` ou `blocked`;
- artefatos gerados:
  - `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/prd/prd.md`
  - `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/handoff/tl-refiner-input.md`
- principais pendências abertas, se existirem;
- próximo passo recomendado:
  - `po-gerar-user-story <JIRA_KEY>` se o backlog de negócio ainda será detalhado no po-refiner;
  - ou handoff imediato ao `tl-refiner` quando a transição técnica já puder começar com o pacote funcional aprovado.

Não invoque automaticamente a próxima fase.

## Referências carregáveis

- `skills/po-refinar-negocio/references/prd-template.md`
- `skills/po-refinar-negocio/references/handoff-template.md`
- `skills/business-reviewer/SKILL.md`
- `skills/business-reviewer/references/prd-review-checklist.md`
- `skills/business-reviewer/references/business-language-guardrails.md`
- `skills/po-iniciar-discovery/references/discovery-template.md`
- `skills/mermaid-generator/SKILL.md`
- `skills/bpmn-generator/SKILL.md`
- `skills/bpmn-markdown/SKILL.md`
- `.claude-plugin/plugin.json`
- `CLAUDE.md`
- `docs/workflows-po-refiner.md`
- `_reference/tl-refiner/skills/tl-refinar-feature/0.0.1/SKILL.md`
- `_reference/tl-refiner/skills/tech-spec-documentation/1.0.0/SKILL.md`
- `_reference/tl-refiner/skills/tech-spec-documentation/1.0.0/references/prd-template.md`
