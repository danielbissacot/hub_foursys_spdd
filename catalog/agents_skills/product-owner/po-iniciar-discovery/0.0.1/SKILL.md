---
name: 'po-iniciar-discovery'
description: "Inicia a Fase A do po-refiner quando existe apenas um briefing, oportunidade ou issue Jira ainda pouco estruturada e o objetivo é esclarecer problema, valor, personas, limites e cenários antes do PRD. Use esta skill para orquestrar o discovery de negócio, acionar discovery-facilitator de forma progressiva, gravar discovery.md no workspace compartilhado e parar antes de refinamento técnico, arquitetura ou planejamento."
metadata:
  version: "0.0.1"
---

# Discovery de negócio — fase A

Conduz o discovery inicial de uma feature ou épico pela lente do negócio.

> **Pipeline:** `po-iniciar-discovery → po-refinar-negocio → po-gerar-user-story`

## Quando usar

Use esta skill quando houver necessidade de:
- transformar um contexto inicial ainda cru em um `discovery.md` revisável;
- esclarecer problema, valor, personas, cenários e limites da entrega;
- conduzir conversas ou oficinas leves de discovery com Product Owner e stakeholders;
- preparar a base funcional da fase seguinte sem entrar em solução técnica.

## Quando não usar

Não use esta skill para:
- discutir viabilidade técnica, arquitetura, APIs, banco de dados, eventos ou integrações em detalhe;
- estimar implementação, montar plano técnico ou decompor tarefas de desenvolvimento;
- substituir `po-refinar-negocio` quando já existe discovery aprovado;
- substituir o `tl-refiner` em qualquer tema de refinamento técnico.

## Fronteira obrigatória da skill

<HARD-GATE>
Mantenha a conversa em linguagem business-first. Se surgirem temas técnicos,
registre apenas o impacto de negócio, a dependência ou a pendência correspondente.
Não desenhe solução, não proponha arquitetura e não avance para planejamento.
</HARD-GATE>

## Regra obrigatória: rodadas interativas de perguntas

<HARD-GATE>
O discovery é um processo conversacional. Rodadas interativas de perguntas com o
usuário são **sempre obrigatórias**, independentemente da quantidade de contexto
fornecido inicialmente.

Mesmo quando o usuário fornecer um contexto rico e detalhado:
1. **Analise** todo o contexto recebido contra o template do discovery.
2. **Identifique** gaps, ambiguidades, contradições, informações implícitas que
   precisam de confirmação e detalhes ausentes.
3. **Formule perguntas interativas** usando a tool `ask_user` para cada bloco com
   lacunas, antes de preencher qualquer seção do documento.
4. **Nunca gere o documento final com `[PENDENTE: ...]`** em informações que
   poderiam ter sido obtidas perguntando ao usuário.

Use `[PENDENTE: ...]` **somente** quando o usuário explicitamente declarar que não
possui a informação naquele momento ou quando a resposta depender de terceiros
ausentes da conversa.

**Proibido:** gerar o discovery.md completo de uma vez e depois listar pendências
para o usuário resolver. O processo correto é perguntar → receber → consolidar →
perguntar o próximo bloco → repetir até atingir a completude mínima.
</HARD-GATE>

## Pré-requisitos operacionais

- O workspace deve conter o doc repo compartilhado no padrão `<centro-de-custo>-doc-<projeto>/`.
- O artefato final **não** deve ser salvo dentro deste repositório do plugin.
- Se a raiz do doc repo não puder ser resolvida com segurança, a execução deve ficar `blocked`.

## Entradas aceitas

Receba, quando disponíveis:
- `JIRA_KEY` da demanda;
- nome da iniciativa, épico ou resumo executivo;
- descrição do problema ou oportunidade;
- contexto de negócio inicial, processo ou jornada impactada;
- personas, stakeholders, métricas, evidências, decisões anteriores e restrições de negócio;
- caminho explícito do doc repo compartilhado, se já conhecido.

### Contrato mínimo de entrada

Contrato funcional mínimo:
- identificador da demanda (`JIRA_KEY`);
- descrição do problema ou oportunidade;
- contexto inicial de negócio.

Pré-condição operacional adicional:
- a raiz `<centro-de-custo>-doc-<projeto>/` precisa estar disponível ou resolvível.

Se o contrato mínimo não for atendido, não invente lacunas: registre pendências e bloqueie a execução quando elas impedirem o discovery.

## Saídas esperadas

### Saída obrigatória
- `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/discovery.md`

### Conteúdo mínimo do `discovery.md`
O documento deve seguir `skills/po-iniciar-discovery/references/discovery-template.md` e consolidar:
- identificação rápida;
- visão da feature;
- quadro `É / NÃO É / FAZ / NÃO FAZ`;
- personas impactadas;
- cenários e comportamentos;
- priorização de escopo;
- regras de negócio prioritárias;
- métricas, riscos, hipóteses, dependências e perguntas em aberto.

### Saídas opcionais
- diagrama Mermaid simples de jornada ou fluxo funcional, **somente** se um fluxo curto resolver o entendimento de negócio;
- quando o processo tiver múltiplos atores, aprovações, gateways, esperas, exceções ou handoffs relevantes, artefatos BPMN em:
  - `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/bpmn/processo-atual-as-is.bpmn`
  - `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/bpmn/processo-atual-as-is.svg`
  - `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/bpmn/processo-alvo-to-be-draft.bpmn`
  - `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/bpmn/processo-alvo-to-be-draft.svg`
- síntese final com confirmados, hipóteses, pendências e próximo passo recomendado.

### Regra visual: BPMN vs Mermaid

- use `mermaid-generator` para jornada simples, mapa de escopo ou fluxo curto;
- use `bpmn-generator` + `bpmn-markdown` quando o entendimento do negócio depender de múltiplos atores, aprovações, gateways, esperas, exceções ou handoffs;
- em BPMN, a fonte de verdade é o `.bpmn`; o Markdown deve apontar para o `.svg` com link explícito para o `.bpmn`;
- nenhuma representação visual desta fase pode virar desenho técnico.

## Carregamento progressivo de contexto

Não carregue todo o contexto de uma vez. Trabalhe nesta ordem:

1. **Entrada do usuário e contrato mínimo**  
   Comece apenas pelo que foi informado sobre a demanda.
2. **Convenções do plugin, se necessário**  
   Consulte `.claude-plugin/plugin.json` e `CLAUDE.md` apenas para confirmar naming, workspace compartilhado, fase atual ou guardrails.
3. **Template do artefato**  
   Carregue `skills/po-iniciar-discovery/references/discovery-template.md` para estruturar o `discovery.md`.
4. **Contexto complementar sob demanda**  
   Se houver só o `JIRA_KEY` ou um briefing insuficiente, use `jira-api` para buscar resumo e descrição da issue. Não busque mais do que o necessário para abrir a conversa.
5. **Facilitação seletiva**  
    Acione `discovery-facilitator` com as lacunas atuais. Deixe a skill de apoio puxar apenas os blocos relevantes de `skills/discovery-facilitator/references/discovery-prompts.md`.
6. **Visualização funcional apenas quando fizer sentido**  
   Use `mermaid-generator` somente para fluxos leves. Se o processo tiver múltiplos atores, aprovações, gateways, esperas, exceções ou handoffs relevantes, use `bpmn-generator` + `bpmn-markdown` para produzir os arquivos em `_intermediarios/bpmn/`.
7. **Oficina estruturada apenas quando fizer sentido**  
   Só carregue `skills/discovery-facilitator/references/lean-inception-lite.md` quando o discovery pedir uma dinâmica mais estruturada ou uma sessão guiada.
8. **Revisão apenas no momento certo**  
   Chame `business-reviewer` somente depois que o rascunho do `discovery.md` atingir a completude mínima.

## Fluxo de orquestração

### Passo 1 — Enquadrar a demanda

Confirme ou obtenha:
- `JIRA_KEY` e nome da iniciativa;
- problema/oportunidade a ser entendido;
- decisão de negócio que o discovery precisa destravar;
- raiz do doc repo compartilhado.

Se só houver a chave Jira, use `jira-api` para recuperar contexto inicial. Se ainda faltar entendimento básico do problema, siga para facilitação curta em vez de tentar deduzir a demanda.

### Passo 2 — Preparar o artefato de destino

Monte o caminho final exatamente como:

`<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/discovery.md`

Em seguida:
- crie o diretório `_intermediarios/` se necessário;
- se BPMN for necessário, crie também `_intermediarios/bpmn/`;
- use `references/discovery-template.md` como esqueleto inicial;
- preserve o nome do arquivo como `discovery.md`.

### Passo 3 — Mapear lacunas e conduzir rodada interativa obrigatória

Compare **todo** o contexto já conhecido com o template e classifique as lacunas por bloco:
1. visão da feature e valor;
2. limites `É / NÃO É / FAZ / NÃO FAZ`;
3. personas impactadas;
4. cenários e comportamentos;
5. priorização, regras, métricas, riscos, dependências e perguntas em aberto.

**Mesmo que o usuário tenha fornecido contexto extenso**, haverá sempre lacunas,
ambiguidades ou pontos que precisam de confirmação explícita. Identifique-os e
formule perguntas interativas usando `ask_user`.

Conduza as perguntas por bloco, priorizando o bloco com maior impacto para fechar
o discovery. Não avance para o Passo 4 sem ter feito pelo menos uma rodada de
perguntas interativas com o usuário.

Exemplo de análise mesmo com contexto rico:
- O usuário descreveu o problema, mas não deixou claro **para quem** é o problema → pergunte sobre personas.
- O usuário listou funcionalidades, mas não delimitou o que **não** faz parte → pergunte sobre limites.
- O usuário mencionou regras, mas sem detalhar exceções → pergunte sobre cenários de exceção.
- O usuário deu contexto geral, mas não priorizou → pergunte sobre o que é essencial vs incremental.

### Passo 4 — Facilitar rodadas com `discovery-facilitator`

Carregue `discovery-facilitator` informando, no mínimo:
- `JIRA_KEY`;
- contexto já confirmado;
- bloco prioritário do discovery;
- principais lacunas atuais;
- caminho do artefato: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/discovery.md`.

A skill de apoio deve:
- conduzir rodadas curtas de perguntas em linguagem de negócio;
- escolher somente os blocos necessários de `references/discovery-prompts.md`;
- usar `references/lean-inception-lite.md` apenas se a sessão pedir oficina leve;
- diferenciar `Confirmado`, `Hipótese` e `Em aberto` sem inventar respostas.

### Passo 5 — Consolidar o `discovery.md` a cada rodada

Atualize o documento progressivamente, sempre usando a estrutura do template local.

Regras de preenchimento:
- use linguagem clara para PO e stakeholders;
- explicite escopo incluído e excluído;
- mantenha cenários essenciais versus incrementais;
- registre regras, métricas, riscos, dependências e perguntas em aberto;
- quando faltar informação, use `[PENDENTE: ...]`;
- quando algo realmente não se aplicar, use `[NÃO SE APLICA]`.

### Passo 6 — Decidir entre Mermaid e BPMN quando houver visual

Antes de fechar a fase, faça uma decisão explícita:

- se um fluxo simples resolver, use Mermaid curto ou apenas texto;
- se o entendimento exigir múltiplos atores, aprovações, gateways, esperas, exceções ou handoffs, gere:
  - `_intermediarios/bpmn/processo-atual-as-is.bpmn`
  - `_intermediarios/bpmn/processo-atual-as-is.svg`
  - `_intermediarios/bpmn/processo-alvo-to-be-draft.bpmn`
  - `_intermediarios/bpmn/processo-alvo-to-be-draft.svg`
- registre no `discovery.md` por que BPMN foi usado ou por que não foi necessário.

### Passo 7 — Validar a completude mínima do discovery

Antes de considerar a fase pronta, verifique se o `discovery.md` cobre o mínimo necessário para sair de `discovery_in_progress` e entrar em `discovery_review`.

## HARD-GATE: discovery-minimum-complete

Não avance enquanto o `discovery.md` não deixar explícitos, no mínimo:
- identificação da demanda e contexto de negócio;
- visão da feature com problema, público e benefício;
- quadro `É / NÃO É / FAZ / NÃO FAZ`;
- persona principal e demais perfis impactados relevantes;
- cenários essenciais e pelo menos as exceções mais relevantes já conhecidas;
- se o processo tiver múltiplos atores, aprovações, gateways, esperas, exceções ou handoffs relevantes, referência ao BPMN AS-IS e ao TO-BE draft em `_intermediarios/bpmn/`, ou justificativa explícita para não gerar BPMN;
- priorização entre essencial, incremental e fora desta entrega;
- regras de negócio prioritárias;
- métricas ou sinais de sucesso;
- riscos, dependências, hipóteses e perguntas em aberto;
- lacunas críticas marcadas como `[PENDENTE: ...]` em vez de inferidas.

Se faltar qualquer item crítico, continue em discovery ou marque `blocked`.

### Passo 8 — Submeter à revisão funcional

Quando o gate mínimo passar, acione `business-reviewer` para revisar clareza, coerência e cobertura funcional. Se a support skill ainda não estiver operacional, aplique o mesmo checklist manualmente e só conceda aprovação com registro explícito da revisão funcional.

Checklist esperado da revisão:
- problema e valor estão compreensíveis para negócio;
- escopo IN/OUT está explícito;
- cenários e prioridades fazem sentido;
- riscos, dependências e pendências estão visíveis;
- o texto não escorregou para desenho técnico.

## HARD-GATE: discovery-review-approved

A fase só pode terminar como `discovery_approved` quando houver aprovação explícita da revisão funcional.

Se o reviewer encontrar ambiguidade crítica, contradição de escopo, ausência de contexto essencial ou deriva técnica:
- não avance para `po-refinar-negocio`;
- incorpore os ajustes necessários no `discovery.md`;
- repita a revisão até aprovação ou marque `blocked`.

## State machine da fase

- `idle` → `discovery_in_progress`  
  Trigger: execução de `po-iniciar-discovery`.
- `discovery_in_progress` → `discovery_review`  
  Trigger: `HARD-GATE: discovery-minimum-complete` aprovado.
- `discovery_review` → `discovery_approved`  
  Trigger: `HARD-GATE: discovery-review-approved` aprovado.
- `qualquer estado` → `blocked`  
  Quando faltar contexto mínimo, houver conflito de regra de negócio, dependência crítica sem resolução ou impossibilidade de localizar o doc repo.

## Terminal state

Ao concluir, apresente de forma objetiva:
- status final: `discovery_approved` ou `blocked`;
- artefato gerado: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/discovery.md`;
- principais pendências em aberto, se existirem;
- próximo passo recomendado: `po-refinar-negocio <JIRA_KEY>` **somente** se o gate de revisão estiver aprovado.

Não invoque automaticamente a próxima fase.

## Referências carregáveis

- `skills/po-iniciar-discovery/references/discovery-template.md`
- `skills/discovery-facilitator/SKILL.md`
- `skills/discovery-facilitator/references/discovery-prompts.md`
- `skills/discovery-facilitator/references/lean-inception-lite.md`
- `skills/business-reviewer/SKILL.md`
- `skills/mermaid-generator/SKILL.md`
- `skills/bpmn-generator/SKILL.md`
- `skills/bpmn-markdown/SKILL.md`
- `.claude-plugin/plugin.json`
- `CLAUDE.md`
- `_reference/tl-refiner/skills/tl-iniciar-exploracao/0.0.1/SKILL.md`
- `_reference/tl-refiner/skills/tech-spec-documentation/1.0.0/references/prd-workflow.md`
