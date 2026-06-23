# Template — Handoff funcional para tl-refiner

## Objetivo

Use este template para gerar `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/handoff/tl-refiner-input.md`.

O documento deve funcionar como **contrato funcional de transição** entre `po-refinar-negocio` e `tl-refiner`: contexto suficiente para iniciar o refinamento técnico sem reabrir discovery, sem reescrever o PRD e sem reinterpretar escopo, regras ou critérios de aceite do negócio.

## Regras de preenchimento

1. Escreva em **pt-BR** e em linguagem **business-first**.
2. **Todos os campos obrigatórios** devem aparecer no arquivo final. Quando faltar informação, use `[PENDENTE: descrever o que falta]`.
3. **Campos opcionais** podem ser removidos se não ajudarem o entendimento. Se preferir mantê-los, use `[NÃO SE APLICA]`.
4. Se as user stories ainda não existirem, registre exatamente: `User stories relacionadas: [NÃO EXISTEM AINDA]`.
5. Sistemas, canais e processos devem aparecer apenas pelo seu **papel funcional na jornada**, nunca como desenho técnico.
6. Quando existir BPMN aprovado, aponte para o `.svg` em Markdown e explicite o `.bpmn` como fonte de verdade.
7. Dependências, riscos e perguntas abertas devem ser descritos como contexto para validação posterior, **sem propor solução técnica**.
8. Não incluir arquitetura, ADR, RFC, plano de implementação, APIs, modelo de dados, filas, jobs, payloads, tabelas ou qualquer outro detalhamento de solução.

## Campos do contrato

| Campo / seção | Tipo | Como preencher |
|---|---|---|
| `Status`, `Origem`, `Data`, `Jira / Epic`, `Iniciativa / Feature` | Obrigatório | Identificação canônica do handoff |
| `Responsável de negócio` | Obrigatório | Nome, área ou papel de referência |
| `PRD de referência` e `Discovery de origem` | Obrigatório | Links relativos para os artefatos canônicos |
| `BPMN aprovado de referência` | Obrigatório quando existir | Link relativo para o `.svg` e indicação do `.bpmn` fonte |
| `Resumo executivo` | Obrigatório | Problema, objetivo, fluxo prioritário e resultado esperado |
| `Escopo consolidado` (`IN` / `OUT`) | Obrigatório | Fronteira funcional sem ambiguidades |
| `Regras de negócio inegociáveis` | Obrigatório | Decisões que o tl-refiner não deve descaracterizar |
| `Critérios BDD obrigatórios` | Obrigatório | Cenários de negócio que precisam ser preservados |
| `Dependências e riscos que condicionam a continuidade` | Obrigatório | Item, tipo, impacto, dono/área e encaminhamento atual |
| `Perguntas em aberto para validação técnica` | Obrigatório | Pontos ainda não respondidos e impacto da lacuna |
| `Sistemas, canais e processos citados` | Obrigatório | Papel funcional e mudança percebida pelo negócio |
| `Materiais relacionados` | Obrigatório | Links para discovery, PRD, user stories, Jira, Confluence e anexos relevantes |
| `Premissas de negócio` | Opcional | Hipóteses já assumidas e que condicionam entendimento ou continuidade |
| `Stakeholders / áreas para acompanhamento` | Opcional | Áreas, fóruns ou responsáveis que precisam acompanhar a evolução |
| `Indicadores de sucesso de referência` | Opcional | Métricas do PRD úteis para preservar o objetivo do negócio |

## Estrutura do handoff

```markdown
# Handoff funcional para tl-refiner — EPIC-<JIRA_KEY>

**Status:** Draft | In Review | Ready for tl-refiner
**Origem:** po-refinar-negocio
**Data:** YYYY-MM-DD
**Jira / Epic:** [PENDENTE: chave ou link]
**Iniciativa / Feature:** [PENDENTE: nome funcional]
**Responsável de negócio:** [PENDENTE: nome, área ou papel]
**PRD de referência:** ../prd/prd.md
**Discovery de origem:** ../_intermediarios/discovery.md
**BPMN aprovado de referência:** [NÃO SE APLICA] ou ../prd/processo-negocio-to-be.svg *(fonte: ../prd/processo-negocio-to-be.bpmn)*

## 1. Resumo executivo
- **Problema de negócio:** [PENDENTE: síntese objetiva da dor ou oportunidade]
- **Objetivo de negócio:** [PENDENTE: resultado esperado]
- **Fluxo prioritário:** [PENDENTE: jornada ou cenário principal]
- **Resultado esperado para o negócio:** [PENDENTE: ganho esperado para cliente, operação ou negócio]

## 2. Escopo consolidado
### IN
- [PENDENTE: item incluído]

### OUT
- [PENDENTE: item fora do escopo]

## 3. Regras de negócio inegociáveis
- **RN-01:** [PENDENTE: regra mandatória]
- **RN-02:** [PENDENTE: exceção ou restrição relevante]

## 4. Critérios BDD obrigatórios
**C1 — [PENDENTE: nome do cenário]**

**DADO QUE** [PENDENTE: contexto inicial]  
**QUANDO** [PENDENTE: ação, evento ou decisão]  
**ENTÃO** [PENDENTE: resultado esperado percebido pelo negócio]

**C2 — [PENDENTE: nome do cenário]**

**DADO QUE** [PENDENTE]  
**QUANDO** [PENDENTE]  
**ENTÃO** [PENDENTE]

## 5. Dependências e riscos que condicionam a continuidade
| Item | Tipo | Impacto no negócio | Dono / área | Encaminhamento atual |
|---|---|---|---|---|
| [PENDENTE] | Dependência / Risco | [PENDENTE] | [PENDENTE] | [PENDENTE] |

## 6. Perguntas em aberto para validação técnica
| Pergunta ou ponto aberto | Por que ainda está aberto | Impacto se permanecer aberto | Próximo responsável |
|---|---|---|---|
| [PENDENTE] | [PENDENTE] | [PENDENTE] | [PENDENTE] |

## 7. Sistemas, canais e processos citados
| Item | Tipo | Papel funcional na jornada | Mudança percebida pelo negócio |
|---|---|---|---|
| [PENDENTE] | Sistema / Canal / Processo / Área | [PENDENTE] | [PENDENTE] |

## 8. Premissas de negócio *(opcional)*
- [NÃO SE APLICA]

## 9. Stakeholders / áreas para acompanhamento *(opcional)*
| Área / papel | Motivo do acompanhamento | Observações |
|---|---|---|
| [NÃO SE APLICA] | [NÃO SE APLICA] | [NÃO SE APLICA] |

## 10. Indicadores de sucesso de referência *(opcional)*
| Indicador | Situação atual / baseline | Meta ou sinal esperado | Observações |
|---|---|---|---|
| [NÃO SE APLICA] | [NÃO SE APLICA] | [NÃO SE APLICA] | [NÃO SE APLICA] |

## 11. Materiais relacionados
- **PRD:** ../prd/prd.md
- **Discovery:** ../_intermediarios/discovery.md
- **BPMN de negócio aprovado:** [NÃO SE APLICA] ou ../prd/processo-negocio-to-be.svg *(fonte: ../prd/processo-negocio-to-be.bpmn)*
- **User stories relacionadas:** [NÃO EXISTEM AINDA] ou lista de caminhos relativos
- **Jira / Confluence / anexos:** [PENDENTE: links relevantes]
```

## Checklist rápido antes de aprovar

- O `tl-refiner` consegue entender **o que precisa ser preservado para o negócio** sem reler todo o discovery?
- O escopo `IN / OUT` evita interpretações adicionais?
- Regras, dependências, riscos e perguntas abertas estão explícitos e com impacto descrito?
- Se o processo for complexo, o BPMN aprovado está apontado com `.svg` + `.bpmn`?
- Sistemas, canais e processos aparecem em **alto nível funcional**, sem solutioning?
- Há links rastreáveis para `discovery.md`, `prd.md` e `user-stories/` quando existirem?
