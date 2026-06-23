## Objetivo

Quando solicitado a criar um PRD de negócio para uma feature, siga esta estrutura padronizada.
O objetivo é consolidar um documento business-first, pronto para Jira ou Confluence, focado em problema,
objetivo, escopo, requisitos, critérios de aceite e impacto de negócio. O resultado deve servir como
fonte funcional para o handoff ao tl-refiner, sem descer para detalhamento técnico.

## Instruções

1. Preencha todas as seções obrigatórias.
2. Sempre que faltar informação, use o marcador explícito `[PENDENTE: descrever o que falta]`.
3. Escreva em linguagem de negócio: dor, oportunidade, processo, comportamento esperado, impacto operacional, métrica e risco.
4. Não descreva desenho técnico, decisões de tecnologia, tarefas de entrega, cronograma ou como a solução será construída.
5. Mantenha frases curtas, bullets objetivos e tabelas simples para facilitar cópia em Jira ou Confluence.
6. Escreva os critérios de aceite da feature em BDD (DADO / QUANDO / ENTÃO), com cenários verificáveis e independentes.
7. Deixe explícito o que entra, o que não entra, quais dependências existem, quais riscos são relevantes e quais perguntas ainda estão abertas.
8. Na seção de impactos, registre apenas sistemas, canais, áreas ou processos afetados em alto nível e o que muda para o negócio.
9. Na seção de expectativas operacionais e de experiência, descreva a percepção esperada pelo usuário ou pela operação, sem detalhar a viabilização.

## Estrutura do PRD — Negócio

```markdown
# PRD — [PENDENTE: nome da feature]

**Status:** Draft | In Review | Approved
**Responsável de negócio:** [PENDENTE: nome]
**Data:** YYYY-MM-DD
**Jira:** [PENDENTE: chave ou link]
**Épico / Iniciativa:** [PENDENTE: chave, nome ou N/A]
**Produto / Jornada / Processo:** [PENDENTE: contexto principal]

---

## 1. Resumo do problema ou oportunidade

### Problema ou oportunidade
[PENDENTE: descreva a dor, oportunidade ou necessidade principal]

### Contexto e urgência
[PENDENTE: por que isso importa agora]

### Evidências
- [PENDENTE: métrica, feedback, ticket, incidente, demanda comercial, exigência regulatória ou hipótese]
- [PENDENTE: evidência complementar]

---

## 2. Objetivo de negócio

### Resultado esperado
[PENDENTE: descreva a mudança de negócio esperada]

| Objetivo / indicador | Baseline atual | Meta esperada | Como acompanhar |
|---|---|---|---|
| [PENDENTE: indicador principal] | [PENDENTE] | [PENDENTE] | [PENDENTE] |

---

## 3. Personas e atores impactados

| Persona / ator | Papel no processo | Necessidade principal | Dor atual / risco atual |
|---|---|---|---|
| [PENDENTE] | [PENDENTE] | [PENDENTE] | [PENDENTE] |

---

## 4. Escopo

### IN
- [PENDENTE: entrega ou comportamento incluído]
- [PENDENTE: fluxo prioritário incluído]

### OUT
- [PENDENTE: item fora do escopo e motivo]
- [PENDENTE: item explicitamente adiado ou não coberto]

---

## 5. Premissas e restrições de negócio

### Premissas
- [PENDENTE: hipótese assumida como verdadeira para esta feature]
- [PENDENTE: condição necessária para o valor esperado]

### Restrições de negócio
- [PENDENTE: regra regulatória, política, calendário, canal, público ou operação]
- [PENDENTE: limitação relevante para a entrega]

---

## 6. Sistemas, canais e processos impactados

| Item impactado | Tipo | Impacto de negócio em alto nível | Área / responsável envolvido |
|---|---|---|---|
| [PENDENTE] | Sistema / Canal / Processo / Área | [PENDENTE] | [PENDENTE] |

### Referência visual do processo (opcional recomendado)

> Use BPMN quando o processo tiver múltiplos atores, aprovações, gateways, esperas, exceções ou handoffs relevantes. Mermaid continua reservado a jornadas e fluxos leves.

- Decisão da representação: BPMN | Mermaid | Nenhuma
- Justificativa da escolha: [PENDENTE: explicar por que este nível de detalhe é necessário ou por que não é]
- BPMN TO-BE aprovado (.svg para embed): `./processo-negocio-to-be.svg` ou [NÃO SE APLICA]
- BPMN TO-BE aprovado (.bpmn fonte de verdade): `./processo-negocio-to-be.bpmn` ou [NÃO SE APLICA]
- O que o mapa deixa explícito para o negócio: [PENDENTE: atores, aprovações, exceções, esperas ou handoffs relevantes]

---

## 7. Requisitos funcionais

| ID | Requisito funcional | Para quem / quando se aplica | Resultado esperado | Prioridade |
|---|---|---|---|---|
| RF-01 | [PENDENTE: comportamento ou capacidade esperada] | [PENDENTE] | [PENDENTE] | Must / Should / Could |
| RF-02 | [PENDENTE] | [PENDENTE] | [PENDENTE] | Must / Should / Could |

---

## 8. Regras de negócio

| ID | Regra de negócio | Impacto se não cumprir | Observações |
|---|---|---|---|
| RN-01 | [PENDENTE: regra objetiva e verificável] | [PENDENTE] | [PENDENTE] |
| RN-02 | [PENDENTE] | [PENDENTE] | [PENDENTE] |

---

## 9. Expectativas operacionais e de experiência

> Registre aqui percepções e compromissos de negócio, sem detalhar a solução.

| Aspecto | Expectativa de negócio / experiência | Como o negócio percebe ou valida |
|---|---|---|
| Tempo de resposta percebido | [PENDENTE] | [PENDENTE] |
| Disponibilidade / janela de uso | [PENDENTE] | [PENDENTE] |
| Clareza de comunicação | [PENDENTE] | [PENDENTE] |
| Volume / capacidade esperada | [PENDENTE] | [PENDENTE] |

---

## 10. Dependências

| Dependência | Tipo | Dono / área | Status | Observações |
|---|---|---|---|---|
| [PENDENTE] | Time / Sistema / Fornecedor / Aprovação / Conteúdo | [PENDENTE] | [PENDENTE] | [PENDENTE] |

---

## 11. Riscos

| Risco | Probabilidade | Impacto no negócio | Mitigação / contingência |
|---|---|---|---|
| [PENDENTE] | Alta / Média / Baixa | Alto / Médio / Baixo | [PENDENTE] |

---

## 12. Critérios de aceite da feature (BDD)

> Escreva cenários ponta a ponta, verificáveis pelo negócio e independentes entre si.

**C1 — [PENDENTE: nome do cenário]**

**DADO QUE** [PENDENTE: contexto inicial / pré-condição]  
**QUANDO** [PENDENTE: ação do usuário, sistema ou processo]  
**ENTÃO** [PENDENTE: resultado esperado percebido pelo negócio]

**C2 — [PENDENTE: nome do cenário]**

**DADO QUE** [PENDENTE]  
**QUANDO** [PENDENTE]  
**ENTÃO** [PENDENTE]

*(Adicione quantos cenários forem necessários.)*

---

## 13. Resultados mensuráveis pós-entrega

| Resultado esperado | Indicador | Janela de medição | Responsável pela leitura |
|---|---|---|---|
| [PENDENTE] | [PENDENTE] | [PENDENTE] | [PENDENTE] |

---

## 14. Anexos e links

| Item | Tipo | Link / referência | Observações |
|---|---|---|---|
| [PENDENTE] | Jira / Confluence / Figma / Planilha / Evidência / Outro | [PENDENTE] | [PENDENTE] |

---

## 15. Perguntas em aberto

| Pergunta | Dono | Impacto se permanecer aberta | Data alvo |
|---|---|---|---|
| [PENDENTE] | [PENDENTE] | [PENDENTE] | [PENDENTE] |

---

## 16. Resumo executivo para handoff funcional

- **Fluxo prioritário:** [PENDENTE: principal fluxo que precisa ser preservado ou refinado]
- **Regra inegociável:** [PENDENTE: regra que não pode ser descaracterizada]
- **Dependência crítica:** [PENDENTE: dependência que condiciona a continuidade]
- **Pendência relevante:** [PENDENTE: pergunta ou decisão ainda aberta]
```

## Exemplo de Prompt para Gerar este PRD

```text
Crie um PRD de negócio usando o template prd-template.md para a seguinte feature:

Nome: Confirmação de pagamento por WhatsApp
Contexto: clientes PJ precisam ligar para a central para confirmar o status de um boleto já pago
Objetivo: reduzir contatos no atendimento e aumentar a autonomia do cliente
Personas: cliente PJ, central de atendimento, operações de cobrança
Escopo inicial: confirmação do status do pagamento e envio de mensagem de retorno
Fora do escopo: renegociação, emissão de segunda via, contestação do pagamento
Dependências conhecidas: aprovação de texto jurídico e disponibilidade do canal de WhatsApp
```

## O que será gerado

- Documento de negócio pronto para Jira ou Confluence
- Problema, objetivo, personas, escopo, premissas, requisitos, regras e impactos em alto nível
- Critérios de aceite em BDD no nível da feature
- Dependências, riscos, resultados mensuráveis, anexos e perguntas em aberto
- Insumo funcional claro para handoff ao tl-refiner
