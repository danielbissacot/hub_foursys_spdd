---
name: 'po-quick-prd'
description: "Gera um rascunho estruturado de PRD a partir de qualquer insumo informal (email, reunião, post-it, slack) sem passar pelo Discovery completo. Produz documento com as seções mínimas (problema, objetivo, escopo IN/OUT, BDD preliminar) marcadas como RASCUNHO para aprovação executiva ou início de conversa com o time. Não substitui o fluxo completo po-iniciar-discovery → po-refinar-negocio."
metadata:
  version: "0.1.0"
---

# Skill: po-quick-prd

Gera um **rascunho inicial de PRD** a partir de qualquer insumo informal. Use quando precisar de um documento estruturado rapidamente para aprovação de orçamento, alinhamento executivo ou abertura de épico — sem ter passado pelo Discovery completo.

> ⚠️ **RASCUNHO:** Este documento é um ponto de partida, não um PRD final. Use `po-iniciar-discovery` → `po-refinar-negocio` para o fluxo completo antes de passar para o time técnico.

---

## Quando usar

- Apresentação para aprovação de budget/orçamento antes do Discovery.
- Alinhamento executivo inicial ("de que se trata esta demanda?").
- Abertura de épico no Jira como placeholder — sem bloquear o squad.
- Demos, pitches ou exploração de viabilidade de negócio.

## Quando NÃO usar

- Para iniciar refinamento técnico → use o fluxo completo (`po-iniciar-discovery` → `po-refinar-negocio`).
- Quando o time técnico precisa de critérios de aceite validados → use `po-refinar-negocio`.
- Quando há stakeholders com expectativas alinhadas ao documento — o rascunho pode ser mal interpretado como PRD aprovado.

---

## Insumos aceitos

- Email ou mensagem de Slack com o pedido
- Notas de reunião
- Post-it / bulleted list de requisitos
- Briefing verbal transcrito
- Título do épico + contexto mínimo

---

## Instruções de uso

1. Forneça o insumo informal (cole o email, as notas, o briefing).
2. Informe: **nome do produto/jornada**, **responsável de negócio**, **prazo estimado** (se houver).
3. Esta skill gera o rascunho de PRD com as seções mínimas e campos `[PENDENTE]` explícitos.
4. Revise o rascunho, complete os `[PENDENTE]` e aprove internamente antes de compartilhar.

---

## Template de Saída

```markdown
# PRD RASCUNHO — [Nome da Feature]

> ⚠️ STATUS: RASCUNHO — documento gerado a partir de insumo informal. Requer validação com stakeholders antes de uso em refinamento técnico.

**Responsável de negócio:** [PENDENTE: confirmar]
**Data do rascunho:** YYYY-MM-DD
**Jira / Épico:** [PENDENTE: criar épico]
**Produto / Jornada:** [PENDENTE: confirmar]

---

## 1. Problema ou oportunidade (2-3 frases)

[Derivado do insumo: descreva a dor ou oportunidade principal identificada]

**Por que agora:** [PENDENTE: validar urgência com stakeholder]

---

## 2. Objetivo de negócio

[Resultado esperado derivado do insumo]

**Indicador mínimo de sucesso:** [PENDENTE: definir com stakeholder]

---

## 3. Escopo (primeira leitura)

### IN (o que parece estar incluído)
- [Derivado do insumo]
- [PENDENTE: validar com stakeholder]

### OUT (o que parece estar fora)
- [PENDENTE: definir com stakeholder]

---

## 4. Personas impactadas (identificadas no insumo)

| Persona | Necessidade identificada |
|---|---|
| [Derivado do insumo] | [Derivado do insumo] |
| [PENDENTE: validar] | [PENDENTE] |

---

## 5. BDD preliminar (1-3 cenários)

> Cenários de negócio extraídos do insumo — NÃO são critérios de aceite finais.

**C1 — [Cenário principal]**

**DADO QUE** [contexto do insumo]
**QUANDO** [ação identificada]
**ENTÃO** [resultado esperado]

**C2 — [PENDENTE: cenário alternativo ou negativo]**

---

## 6. Riscos e dependências (primeiro olhar)

| Item | Tipo | Observação |
|---|---|---|
| [Derivado do insumo] | Risco / Dependência | [PENDENTE: validar] |

---

## 7. Próximos passos

- [ ] Validar este rascunho com o responsável de negócio
- [ ] Criar épico no Jira com este rascunho como insumo
- [ ] Executar `po-iniciar-discovery` para Discovery completo
- [ ] Após Discovery, executar `po-refinar-negocio` para PRD oficial
```

---

## Limitações deste documento

- Gerado a partir de insumo informal — pode ter premissas incorretas
- BDD é preliminar — não pode ser usado como critério de aceite sem validação
- Escopo IN/OUT é exploratório — pode mudar completamente após Discovery
- Não inclui: APF, regras de negócio detalhadas, handoff técnico

---

## Diferença po-quick-prd vs po-refinar-negocio

| Aspecto | po-quick-prd | po-refinar-negocio |
|---|---|---|
| Pré-requisito | Qualquer insumo informal | Discovery aprovado |
| Saída | Rascunho com campos PENDENTE | PRD oficial pronto para handoff técnico |
| BDD | Preliminar (exploratório) | Validado com stakeholders |
| APF | ❌ Não inclui | ✅ Inclui APOIO APF |
| Handoff TL | ❌ Não gerar ainda | ✅ Gera tl-refiner-input.md |
| Uso | Alinhamento executivo, budget | Início de refinamento técnico |
