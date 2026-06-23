---
name: receber-code-review
description: |
  Trata feedback de code review com rigor técnico — sem concordância performática,
  sem implementação cega. Use ao receber feedback de review, antes de implementar
  sugestões. Invoque ao ver "feedback de review", "tratar review", "aplicar sugestões",
  "reviewer pediu mudanças" — esta skill garante avaliação técnica antes de ação.
metadata:
  version: "0.0.1"
---

# Receber Code Review

## Por que esta skill existe

Code review exige avaliação técnica, não performance emocional. Verificar antes
de implementar. Perguntar antes de assumir. Corretude técnica acima de conforto social.

## Padrão de Resposta

```
AO RECEBER feedback de code review:

1. LER: Feedback completo sem reagir
2. ENTENDER: Restatar requisito com suas palavras (ou perguntar)
3. VERIFICAR: Checar contra a realidade do codebase
4. AVALIAR: Tecnicamente correto para ESTE codebase?
5. RESPONDER: Acknowledgment técnico ou pushback fundamentado
6. IMPLEMENTAR: Um item por vez, testar cada
```

## Respostas Proibidas

**NUNCA:**
- "Excelente ponto!" / "Ótima observação!" (performativo)
- "Vou implementar isso agora" (antes de verificar)

**AO INVÉS:**
- Restatar o requisito técnico
- Perguntar para clarificar
- Push back com raciocínio técnico se errado
- Simplesmente corrigir (ações > palavras)

## Tratamento por Fonte

### Do usuário
- **Confiável** — implementar após entender
- **Ainda perguntar** se escopo não claro
- **Sem concordância performática**
- **Pular para ação** ou acknowledgment técnico

### De reviewers externos/subagentes
```
ANTES de implementar:
  1. Tecnicamente correto para ESTE codebase?
  2. Quebra funcionalidade existente?
  3. Razão para implementação atual?
  4. Funciona em todas as plataformas/versões?
  5. Reviewer entende contexto completo?

SE sugestão parece errada:
  Push back com raciocínio técnico

SE conflita com decisões do usuário:
  Parar e discutir com usuário primeiro
```

## Ordem de Implementação

```
PARA feedback multi-item:
  1. Clarificar itens não claros PRIMEIRO
  2. Implementar nesta ordem:
     - Issues bloqueantes (quebras, segurança)
     - Fixes simples (typos, imports)
     - Fixes complexos (refactoring, lógica)
  3. Testar cada fix individualmente
  4. Verificar sem regressões
```

## Quando Fazer Push Back

Push back quando:
- Sugestão quebra funcionalidade existente
- Reviewer não tem contexto completo
- Viola YAGNI (feature não usada)
- Tecnicamente incorreto para esta stack
- Conflita com decisões arquiteturais do usuário

**Como:** Raciocínio técnico, não defensividade.

## Integração

**Invocada por:**
- `executar-implementacao` (Passo 7) — tratando feedback de PRs
- `desenvolvimento-subagentes` — tratando feedback de reviewers

**Complementa:**
- `solicitar-code-review` — solicita o review que esta skill trata
