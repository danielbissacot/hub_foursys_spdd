---
name: solicitar-code-review
description: |
  Despacha subagente reviewer de código para verificar qualidade antes de integração.
  Use após completar tasks, implementar features, ou antes de merge. Invoque ao ver
  "code review", "revisar código", "verificar antes de merge", "pedir review" — esta
  skill garante que mudanças são revisadas sistematicamente antes de avançar.
metadata:
  version: "0.0.1"
---

# Solicitar Code Review

## Por que esta skill existe

Review sistemático pega problemas antes que se propaguem. O reviewer recebe contexto
precisamente construído — nunca o histórico da sessão.

**Princípio:** Revisar cedo, revisar frequentemente.

## Quando Solicitar

**Obrigatório:**
- Após cada task no `desenvolvimento-subagentes`
- Após completar feature
- Antes de merge to main

**Opcional mas valioso:**
- Quando travado (perspectiva fresca)
- Antes de refactoring (baseline check)
- Após corrigir bug complexo

## Como Solicitar

### 1. Obter git SHAs

```bash
BASE_SHA=$(git rev-parse HEAD~1)  # ou origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

### 2. Despachar subagente reviewer

Usar template em `./references/code-reviewer.md` com:
- `{WHAT_WAS_IMPLEMENTED}` — o que foi construído
- `{PLAN_OR_REQUIREMENTS}` — o que deveria fazer
- `{BASE_SHA}` — commit inicial
- `{HEAD_SHA}` — commit final
- `{DESCRIPTION}` — resumo breve

### 3. Agir no feedback

- **Critical:** corrigir imediatamente
- **Important:** corrigir antes de prosseguir
- **Minor:** anotar para depois
- **Reviewer errado:** push back com raciocínio técnico

## Integração

**Invocada por:**
- `desenvolvimento-subagentes` — review após cada task
- `executar-planos` — review após cada batch
- `executar-implementacao` (Passo 7) — review de PRs

**Complementa:**
- `receber-code-review` — como tratar feedback recebido

Ver template em: `solicitar-code-review/references/code-reviewer.md`
