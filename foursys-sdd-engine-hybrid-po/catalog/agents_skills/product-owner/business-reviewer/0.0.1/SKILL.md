---
name: 'business-reviewer'
description: "Revisa discovery.md, prd.md e user stories de negócio usando os checklists e guardrails locais como fonte de verdade. Use esta skill sempre que uma fase do po-refiner estiver pronta para gate, quando houver dúvida sobre clareza, completude, escopo, BDD, rastreabilidade, pendências ou consistência business-first, e sempre que um artefato começar a escorregar para jargão técnico, ambiguidade, critérios não testáveis ou solutioning oculto. Não use para revisar código, scripts ou automações; nesses casos use code-review."
metadata:
  version: "0.0.1"
---

# Revisão de artefatos de negócio

## Missão

Atuar como reviewer funcional do po-refiner, decidindo se um artefato de negócio
está claro, completo, rastreável, verificável e pronto para avançar de fase sem
depender de interpretação técnica adicional.

<HARD-GATE>
Use os checklists locais e `references/business-language-guardrails.md` como fonte
de verdade. Não aprove por sensação. Não substitua critérios do checklist por
opinião pessoal. Não invente requisito, regra ou dependência ausente. Se houver
lacuna crítica, mantenha o gate fechado.
</HARD-GATE>

## Quando usar

Use esta skill quando precisar:
- revisar `discovery.md` antes de avançar para PRD;
- revisar `prd.md` antes de aprovação formal e handoff ao `tl-refiner`;
- revisar uma ou mais user stories antes de backlog grooming ou publicação no Jira;
- validar clareza, cobertura funcional, BDD, escopo, regras, riscos, dependências
  e pendências;
- verificar presença e coerência de BPMN de negócio quando a complexidade do processo justificar esse mapa;
- sinalizar deriva para jargão técnico ou solução prematura em artefatos
  business-facing.

## Quando não usar

Não use esta skill para:
- revisar código, scripts, automações ou integrações;
- julgar arquitetura, viabilidade técnica, desenho de API, banco de dados,
  eventos, filas ou implementação;
- substituir o `tl-refiner` em refinamento técnico;
- reescrever o artefato inteiro quando o que falta é revisão objetiva.

Se o problema for código ou automação, acione `code-review`. Se o problema for
conteúdo funcional, clareza de negócio ou gate documental, use `business-reviewer`.

## Fonte de verdade por modo

Sempre carregue `references/business-language-guardrails.md` primeiro e depois
exatamente um checklist principal:

| Modo | Quando aplicar | Checklist principal | Status válidos |
|---|---|---|---|
| `discovery` | revisar `discovery.md` ou equivalente antes do PRD | `references/discovery-review-checklist.md` | `Aprovado para PRD` \| `Revisar discovery` \| `Bloqueado` |
| `prd` | revisar `prd.md` ou feature doc funcional antes do handoff | `references/prd-review-checklist.md` | `Aprovado para handoff` \| `Revisar PRD` \| `Bloqueado` |
| `user-story` | revisar uma US isolada ou um lote de user stories | `references/user-story-review-checklist.md` | `Pronta para backlog grooming` \| `Revisar User Story` \| `Bloqueada` |

Se houver conflito entre instrução genérica e checklist, o checklist vence.

## Seleção determinística do modo

1. Se o chamador informar o modo, use o modo informado.
2. Se não informar:
   - use `discovery` quando o arquivo for `discovery.md` ou contiver blocos como
     `Visão da Feature`, `É / NÃO É / FAZ / NÃO FAZ`, `Personas Impactadas`;
   - use `prd` quando o arquivo for `prd.md` ou contiver `Problema`, `Objetivos`,
     `Escopo`, `Requisitos Funcionais`, `Critérios de Aceite (BDD)`;
   - use `user-story` quando o arquivo estiver em `user-stories/` ou contiver
     `EU COMO`, `QUERO QUE`, `PARA`, `CRITÉRIOS DE ACEITE`.
3. Se ainda assim o modo não puder ser inferido, retorne revisão `Bloqueado(a)`
   por falta de enquadramento e peça o tipo de artefato explicitamente.

## Entradas esperadas

Receba, quando disponíveis:
- caminho do artefato ou texto do artefato;
- modo (`discovery`, `prd` ou `user-story`);
- identificador da demanda (`JIRA_KEY`, épico ou issue);
- links ou referências para discovery, PRD ou US de origem;
- links ou referências para Mermaid/BPMN de apoio quando o processo tiver mapa visual;
- contexto de fase: antes do PRD, antes do handoff ou antes do grooming.

Para lote de user stories, revise cada história individualmente e depois consolide
os achados comuns de cobertura, duplicidade, lacunas e rastreabilidade.

## Fronteira com `code-review`

- `business-reviewer` avalia **conteúdo funcional**: problema, valor, escopo,
  regras, critérios, rastreabilidade, linguagem e prontidão de fase.
- `code-review` avalia **código e automação**: corretude técnica, segurança,
  performance, design e compliance de implementação.
- Se um artefato de negócio trouxer solução técnica oculta, sinalize isso aqui
  como achado de negócio; só acione `code-review` quando existir código, script ou
  automação real para revisar.

## Processo de revisão

### 1. Enquadrar o artefato

Confirme:
- qual artefato está sendo revisado;
- em qual fase do workflow ele está;
- qual modo se aplica;
- qual próximo gate depende desta revisão.

Mapeamento padrão de gates:
- `discovery` → `HARD-GATE: discovery-review-approved`
- `prd` → `HARD-GATE: prd-handoff-valid`
- `user-story` → `HARD-GATE: business-review-passed`

### 2. Carregar apenas o necessário

Leia nesta ordem:
1. `references/business-language-guardrails.md`
2. checklist do modo selecionado
3. artefato sob revisão
4. discovery/PRD de origem apenas se a rastreabilidade estiver em dúvida
5. Mermaid ou BPMN de apoio apenas quando o checklist indicar complexidade de processo ou quando o artefato o referenciar

Não carregue material técnico irrelevante para a revisão funcional.

### 3. Validar presença mínima antes de discutir nuance

Comece pelo **gate de presença mínima** do checklist do modo. Ausência de seção
obrigatória, de identificação mínima ou de estrutura verificável é forte sinal de
`BLOQUEADOR`.

### 4. Executar o checklist na ordem

Percorra os blocos do checklist em sequência. Para cada falha:
- classifique como `BLOQUEADOR`, `AJUSTE NECESSÁRIO` ou `OBSERVAÇÃO`;
- cite a seção do checklist ou guardrail que fundamenta o achado;
- explique o impacto para o negócio;
- indique o ajuste esperado em linguagem funcional.

### 5. Fazer as cinco detecções obrigatórias

Mesmo que o checklist já cubra isso, sempre faça varredura explícita para:
1. **jargão técnico indevido**;
2. **ambiguidade ou vagueza**;
3. **rastreabilidade ausente ou fraca**;
4. **critério não testável**;
5. **solutioning oculto**.

Quando houver múltiplos atores, aprovações, gateways, esperas, exceções ou handoffs,
faça também a checagem adicional:
- existe BPMN de negócio ou justificativa explícita para não usá-lo?;
- o mapa visual está coerente com o texto do artefato?;
- Mermaid não foi usado para esconder complexidade que o negócio precisa enxergar?

Nunca encerre a revisão sem dizer explicitamente se cada uma dessas cinco classes
foi encontrada ou não.

### 6. Manter o tom de reviewer de negócio

- Seja direto, objetivo e acionável.
- Evite elogio performático, humor ou tom de code review.
- Não peça implementação; peça clareza funcional, evidência, regra, condição,
  métrica, limite de escopo ou ligação com a origem.
- Quando útil, proponha micro-reescrita de uma frase problemática, não uma
  reautoria completa do documento.

### 7. Decidir o gate

Feche com um único veredicto compatível com o modo:
- `Aprovado para PRD`, `Revisar discovery` ou `Bloqueado`
- `Aprovado para handoff`, `Revisar PRD` ou `Bloqueado`
- `Pronta para backlog grooming`, `Revisar User Story` ou `Bloqueada`

Se existir ao menos um `BLOQUEADOR`, o gate não passa.

## Formato obrigatório de saída

Use sempre esta estrutura:

```md
# Revisão de negócio
Artefato: [nome ou caminho]
Modo: [discovery | prd | user-story]
Checklist base: [arquivo de referência]
Guardrail aplicado: references/business-language-guardrails.md
Status: [status válido do modo]

## Resumo executivo
- Decisão: [1 frase objetiva]
- Principal motivo: [lacuna mais relevante]
- Próxima ação recomendada: [passo funcional]

## Achados
### Bloqueadores
- [Categoria] [Referência] Evidência: "[trecho ou ausência]". Impacto: [efeito no negócio ou no gate]. Ajuste esperado: [correção funcional].

### Ajustes necessários
- ...

### Observações
- ...

## Origem / rastreabilidade
- Origem declarada do artefato: [discovery, PRD, épico, issue, história ou caminho relevante]
- Rastreabilidade confirmada ou faltante: [como o reviewer conecta o artefato à origem, ou o que não pôde ser rastreado]

## Sinais obrigatórios
- Jargão técnico indevido: [Nenhum | lista objetiva]
- Ambiguidade/vagueza: [Nenhuma | lista objetiva]
- Rastreabilidade faltante: [Nenhuma | lista objetiva]
- Critérios não testáveis: [Nenhum | lista objetiva]
- Solutioning oculto: [Nenhum | lista objetiva]

## Pendências para a próxima fase
- [item]

## Gate
- Pode avançar de fase? [Sim | Não]
- Próximo gate ou destino: [discovery-review-approved | prd-handoff-valid | business-review-passed | revisar artefato]
```

Regras do formato:
- Se uma seção não tiver itens, escreva `- Nenhum.` ou `- Nenhuma.`.
- Cada achado deve apontar evidência e ajuste esperado.
- Em `Origem / rastreabilidade`, cite a origem funcional do artefato; em `user-story`, aponte explicitamente o PRD, requisito, regra ou critério que sustenta a história quando essa informação estiver disponível.
- Prefira linguagem que um PO, BA ou stakeholder consiga consumir sem mediação
  técnica.

## Heurísticas de decisão

### Marque como `BLOQUEADOR` quando
- faltar seção obrigatória do checklist;
- o problema, objetivo, escopo ou benefício não puder ser entendido;
- houver contradição de escopo ou regra central;
- critérios de aceite não forem verificáveis;
- a origem da informação não puder ser rastreada quando ela é essencial;
- o texto estiver dominado por linguagem de solução técnica.

### Marque como `AJUSTE NECESSÁRIO` quando
- o artefato estiver majoritariamente correto, mas com lacunas que ainda impedem
  aprovação final;
- faltar precisão em regra, exceção, dependência, métrica ou responsabilidade;
- houver ambiguidade localizada que altere interpretação do requisito.

### Marque como `OBSERVAÇÃO` quando
- a melhoria aumentar clareza ou manutenção do artefato, mas não bloquear o gate.

## Referências carregáveis

- `references/business-language-guardrails.md`
- `references/discovery-review-checklist.md`
- `references/prd-review-checklist.md`
- `references/user-story-review-checklist.md`
- `CLAUDE.md`
