# PRD Workflow — Lean Inception para Features

## Objetivo

Conduzir uma sessão estruturada baseada em Lean Inception adaptada para **escopo de feature** (não de produto inteiro) para descobrir e refinar os requisitos **antes** de gerar o PRD. Faça as atividades em ordem, aguardando as respostas do usuário antes de avançar. Se uma resposta estiver vaga ou incompleta, faça perguntas de acompanhamento.

---

## Atividade 1: Visão da Feature

Construa com o usuário uma descrição clara e objetiva da feature:

> "A feature **[nome]** permite que **[persona/ator]** consiga **[ação/capacidade]** para **[benefício/resultado esperado]**, dentro do contexto de **[produto/sistema existente]**."

Perguntas de apoio:
- Qual é o problema específico que esta feature resolve?
- Como o usuário resolve isso hoje (workaround, processo manual, outro sistema)?
- Por que agora? Qual é o motivador ou urgência desta feature?

---

## Atividade 2: A Feature É / NÃO É / FAZ / NÃO FAZ

Esclareça os limites da feature para evitar escopo ambíguo:

| É | NÃO É |
|---|-------|
| (o que a feature é) | (o que não é) |

| FAZ | NÃO FAZ |
|-----|---------|
| (o que a feature faz) | (o que não faz) |

Perguntas de apoio:
- Há comportamentos que parecem óbvios mas estão **fora** do escopo desta entrega?
- Há confusão com funcionalidades existentes no sistema que vale esclarecer?
- Há expectativas do stakeholder que você quer explicitamente descartar?

---

## Atividade 3: Personas impactadas

Identifique quem é impactado por esta feature dentro do sistema existente:
- Quem é o **usuário principal** desta feature?
- Há outros perfis de usuário que serão **impactados direta ou indiretamente**? (ex: admin que configura, outro time que consome os dados)
- Há personas com **necessidades conflitantes** que precisam ser balanceadas nesta feature?

Para cada persona relevante, capture: perfil, o que precisa fazer e qual a maior frustração atual.

---

## Atividade 4: Cenários e Comportamentos

Mapeie os cenários de uso da feature (não a jornada inteira do produto):
- Quais são os **cenários principais** (happy path) da feature?
- Quais são os **cenários alternativos e de exceção**? (erros, edge cases, permissões)
- Há comportamentos que dependem de **estado do sistema ou de dados pré-existentes**?

Para cada cenário, capture: gatilho, ação esperada, resultado esperado.

---

## Atividade 5: Priorização de escopo

Com os cenários mapeados, priorize o que entra nesta entrega:
- Quais cenários são **essenciais** (sem eles a feature não entrega valor)?
- Quais são **incrementais** (agregam valor mas podem vir em uma iteração posterior)?
- Há **dependências técnicas ou de negócio** que impactam a sequência?

Questione cenários que pareçam essenciais mas possam ser postergados:
> "Este cenário é realmente necessário para a primeira entrega, ou podemos entregar valor sem ele?"

---

## Ao final da sessão

Com todas as atividades concluídas, gere o PRD usando `references/prd-template.md`, preenchendo cada seção com as informações coletadas.
