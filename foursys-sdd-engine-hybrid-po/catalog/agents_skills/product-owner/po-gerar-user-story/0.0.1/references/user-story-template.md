# [US-<NNN>] — [Título da User Story]

> **Caminho de saída:** `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/user-stories/US-<NNN>-<slug>.md`
> **Gerado por:** `po-gerar-user-story` → capacidade compartilhada `gerar-user-story`
>
> Use este template para registrar uma única história em `user-stories/US-<NNN>-<slug>.md`.
> Cada arquivo deve representar uma história independente, compreensível isoladamente e escrita em linguagem de negócio.
> Se faltar informação, escreva `[PENDENTE: descrever o que falta]`.
> Se algo não se aplicar, escreva `[NÃO SE APLICA]`.
> Não inclua `REGRAS TÉCNICAS`, solução, arquitetura ou detalhes de implementação.
> Escreva `APOIO APF` no formato ➡️ de `apf-rules` para tornar funcionalidades visíveis em linguagem de negócio, sem contagem, pontuação, pesos, fórmulas ou FI.
> Esta estrutura já é a adaptação local do po-refiner sobre a base compartilhada `user-story-business-template.md`.

## 📌 IDENTIFICAÇÃO
- ID da história: [US-<NNN>]
- Epic / iniciativa relacionada: [PENDENTE: informar chave e nome]
- Responsável de negócio: [PENDENTE: informar nome ou área]
- Status: Draft | In Review | Approved
- Prioridade de negócio: P0 | P1 | P2
- Data da última atualização: [PENDENTE: informar data]
- Arquivo: `user-stories/US-<NNN>-<slug>.md`

## 📌 APOIO APF
> Liste cada funcionalidade distinta de negócio com ➡️, seguindo o formato de `apf-rules`.
> Inclua ALIs como "Agrupamento de dados de negócio" e AIEs como "Sistema referenciado".
> Inclua browsers/plataformas somente quando o PRD ou canal indicar explicitamente.
> Não inclua contagem, pesos, PF, FI, fórmulas ou termos técnicos.

➡️ Funcionalidade de [verbo de negócio] + [objeto de negócio] + [contexto]. [PENDENTE]
➡️ Agrupamento de dados de negócio: [nome da entidade/coleção] ([novo|alterado]). [PENDENTE]
➡️ Sistema referenciado: [nome do sistema externo] — [uso funcional]. [PENDENTE]
➡️ Realização de testes no browser [nome do browser]. [PENDENTE: incluir apenas se indicado no PRD]

## 👤 NARRATIVA
EU COMO [PENDENTE: papel real, perfil ou área — nunca "sistema X" ou nome de aplicação]
QUERO QUE [PENDENTE: capacidade desejada em linguagem de negócio, mencionando naturalmente os processos-chave do APOIO APF]
PARA [PENDENTE: benefício ou resultado de negócio esperado]

## 🌍 CONTEXTO DE NEGÓCIO
- Situação atual ou problema percebido: [PENDENTE: descrever]
- Quem é impactado e como sente a dor: [PENDENTE: descrever]
- Valor esperado para a pessoa usuária ou área: [PENDENTE: descrever]
- Valor esperado para o negócio: [PENDENTE: descrever]
- Evidência, gatilho ou oportunidade que justifica esta história: [PENDENTE: descrever]

## 🧭 NOTAS DE ESCOPO
### Incluído nesta história
- [PENDENTE: item incluído]

### Observações de fatiamento e independência
- O que esta história entrega sozinha: [PENDENTE: descrever]
- O que depende de outra história, aprovação ou processo: [PENDENTE: descrever]
- O que deve seguir em história separada: [PENDENTE: descrever]

## 🔗 DEPENDÊNCIAS
> Registre apenas dependências reais que influenciam a ordem, a validação ou o resultado de negócio.

| Dependência | Tipo | Responsável | Status | Observação |
|-------------|------|-------------|--------|------------|
| [PENDENTE] | Outra história / Área / Processo / Aprovação / Fornecedor | [PENDENTE] | Pendente / Em andamento / Concluído | [PENDENTE] |

## 📋 REGRAS DE NEGÓCIO
> Descreva comportamento esperado, limites e exceções em linguagem de negócio.
> Cada RN deve descrever naturalmente um processo elementar distinto (ação + objeto de dados + fonte/destino).
> Cada funcionalidade do APOIO APF deve ter pelo menos uma RN correspondente.

**RN1 — [PENDENTE: título da regra]**
- [PENDENTE: descrever regra]

**RN2 — [PENDENTE: título da regra]**
- [PENDENTE: descrever regra]

*(Adicione quantas regras forem necessárias.)*

## ✅ CRITÉRIOS DE ACEITE (BDD)
> Todo critério deve explicitar DADO / QUANDO / ENTÃO de forma verificável e em linguagem de negócio.
> Cada funcionalidade do APOIO APF deve ter pelo menos um CA correspondente.

**CA1 — [PENDENTE: título do cenário]**
- **DADO QUE** [PENDENTE: contexto inicial ou pré-condição]
- **QUANDO** [PENDENTE: ação, evento ou decisão]
- **ENTÃO** [PENDENTE: resultado esperado]

**CA2 — [PENDENTE: título do cenário]**
- **DADO QUE** [PENDENTE: contexto inicial ou pré-condição]
- **QUANDO** [PENDENTE: ação, evento ou decisão]
- **ENTÃO** [PENDENTE: resultado esperado]

*(Adicione quantos critérios forem necessários; cada cenário deve poder ser validado isoladamente.)*

## 🧪 NOTAS DE VALIDAÇÃO
> Registre como o negócio confirmará que a história foi atendida.

- Evidência esperada na validação: [PENDENTE: descrever]
- Quem precisa validar ou aprovar: [PENDENTE: descrever]
- Dados, documentos ou confirmações que sustentam a validação: [PENDENTE: descrever]
- Exceções ou cenários negativos que merecem atenção: [PENDENTE: descrever]
- Sinal claro de que a história está pronta para o negócio: [PENDENTE: descrever]

## 🚫 FORA DE ESCOPO
- [PENDENTE: item fora de escopo]
- [PENDENTE: item fora de escopo]

## ⚠️ RISCOS
> Registre riscos que possam comprometer valor, prazo, adesão ou validação de negócio.

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| [PENDENTE] | Alta / Média / Baixa | Alto / Médio / Baixo | [PENDENTE] |

## 🗂️ MATERIAIS RELACIONADOS
> Inclua apenas materiais que ajudem a entender, validar ou priorizar a história.

| Material | Tipo | Link ou referência | Observação |
|----------|------|--------------------|------------|
| [PENDENTE] | Jira / Discovery / PRD / Pesquisa / Regra / Fluxo | [PENDENTE] | [PENDENTE] |
