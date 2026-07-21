---
name: 'po-technical-bridge'
description: "Auxilia o PO a revisar e refinar o tl-refiner-input.md (handoff técnico) garantindo que o documento seja compreensível para o time técnico sem inserir soluções técnicas indevidas. Traduz linguagem de negócio para termos que o Tech Lead entende, verifica completude e identifica lacunas antes do handoff. Use antes de enviar o handoff para o TL."
metadata:
  version: "0.1.0"
---

# Skill: po-technical-bridge

Ponte PO → TL — revisa o documento `tl-refiner-input.md` garantindo que o handoff funcional seja **compreensível pelo time técnico** sem violar a regra de não inserir soluções técnicas.

---

## Quando usar

- Antes de enviar o `tl-refiner-input.md` para o Tech Lead.
- Quando o PO não tem certeza se o handoff tem informação suficiente para o TL começar.
- Para verificar se alguma regra de negócio está ambígua ou incompleta.
- Para garantir que o documento não tem jargão técnico de solução (viola o papel do PO).

## Quando NÃO usar

- Como substituto do `po-refinar-negocio` — este skill só revisa, não gera o PRD.
- Para inserir decisões técnicas no documento — o PO não decide arquitetura.

---

## Como usar

1. Execute `po-refinar-negocio` para gerar `tl-refiner-input.md`.
2. Invoque esta skill com o conteúdo do handoff.
3. Esta skill realiza a auditoria abaixo e retorna um relatório de gaps.
4. Corrija os gaps apontados e reenvie para aprovação.

---

## O que esta skill verifica

### 1. Completude obrigatória

Verifica se todos os campos obrigatórios estão preenchidos (não `[PENDENTE]`):

| Campo | Verificação |
|---|---|
| Resumo executivo | Problema, objetivo, fluxo prioritário, resultado esperado — todos preenchidos? |
| Escopo IN/OUT | Pelo menos 2 itens IN e 1 item OUT definidos? |
| Regras de negócio | Pelo menos 1 RN inegociável identificada? |
| Critérios BDD | Pelo menos 2 cenários (C1 e C2) com DADO/QUANDO/ENTÃO completos? |
| Dependências | Tabela preenchida ou "Nenhuma dependência identificada" explícito? |
| Perguntas em aberto | Tabela preenchida ou "Nenhuma pergunta em aberto" explícito? |

### 2. Clareza técnica (sem solutioning)

Verifica se o documento usa linguagem que o TL entende **sem propor solução**:

**Linguagem de negócio correta:**
- "O sistema deve enviar uma notificação ao cliente" ✅
- "O processo deve calcular o limite de crédito baseado no histórico" ✅

**Solutioning proibido (sinais de alerta):**
- "Usar Kafka para publicar evento X" ❌ → reescreva como comportamento esperado
- "API REST POST /v1/pagamentos" ❌ → reescreva como necessidade funcional
- "Tabela no PostgreSQL com coluna Y" ❌ → reescreva como entidade de negócio

### 3. Rastreabilidade

- PRD de referência apontado? (`../prd/prd.md`)
- Discovery de origem apontado? (`../_intermediarios/discovery.md`)
- User stories relacionadas listadas (ou "NÃO EXISTEM AINDA" explícito)?

### 4. Teste de entendimento (pergunta ao PO)

Esta skill faz as seguintes perguntas para validar o entendimento:

1. **"O TL consegue entender o que precisa ser preservado para o negócio sem reler o discovery?"**
2. **"O escopo IN/OUT evita interpretações adicionais pelo TL?"**
3. **"Regras, dependências e perguntas abertas estão explícitas com impacto descrito?"**

---

## Relatório de Saída

```markdown
# Relatório po-technical-bridge

**Handoff auditado:** tl-refiner-input.md
**Data da auditoria:** YYYY-MM-DD
**Status:** ✅ Pronto para handoff | ⚠️ Requer correções | ❌ Incompleto

---

## Gaps identificados

| Campo | Status | Correção necessária |
|---|---|---|
| Resumo executivo | ✅ / ⚠️ / ❌ | [Descrição se houver gap] |
| Escopo IN/OUT | ✅ / ⚠️ / ❌ | [Descrição se houver gap] |
| Regras de negócio | ✅ / ⚠️ / ❌ | [Descrição se houver gap] |
| Critérios BDD | ✅ / ⚠️ / ❌ | [Descrição se houver gap] |
| Dependências | ✅ / ⚠️ / ❌ | [Descrição se houver gap] |
| Perguntas em aberto | ✅ / ⚠️ / ❌ | [Descrição se houver gap] |
| Rastreabilidade | ✅ / ⚠️ / ❌ | [Descrição se houver gap] |

---

## Linguagem técnica indevida detectada

[Lista de trechos que precisam ser reescritos em linguagem de negócio]

---

## Sugestões de melhoria

[Pontos que não são blockers mas melhorariam a clareza para o TL]

---

## Próximo passo

[Pronto para handoff / Corrigir X pontos e re-auditar]
```

---

## Checklist rápido (PO pode usar sozinho antes de chamar esta skill)

- [ ] Resumo executivo tem: problema + objetivo + fluxo prioritário + resultado esperado
- [ ] Escopo IN tem pelo menos 2 itens concretos (não "a definir")
- [ ] Escopo OUT tem pelo menos 1 item explícito fora do escopo
- [ ] Pelo menos 1 RN inegociável identificada com impacto se descumprida
- [ ] Pelo menos 2 cenários BDD completos (DADO/QUANDO/ENTÃO)
- [ ] Nenhum trecho usa terminologia de arquitetura, banco de dados ou código
- [ ] Links para PRD e Discovery estão corretos e os arquivos existem
- [ ] Dependências e perguntas abertas têm "próximo responsável" definido
