---
name: desenvolvimento-subagentes
description: |
  Executa planos de implementação despachando um subagente fresco por task, com review
  de duas fases (spec compliance + code quality) após cada uma. Use quando executar um
  plano com tasks independentes na sessão atual. Invoque ao ver "executar plano com
  subagentes", "implementar tasks", "subagent-driven", "despachar implementador" —
  esta skill é o executor principal de planos de implementação.
metadata:
  version: "0.0.1"
---

# Desenvolvimento com Subagentes

## Por que esta skill existe

Subagentes frescos por task evitam poluição de contexto. Cada implementador recebe
exatamente o que precisa e nada mais. Review de duas fases (spec + quality) garante
que o que foi construído é correto E bem-feito.

**Princípio:** Subagente fresco por task + review em duas fases = alta qualidade, iteração rápida.

**Anuncie ao iniciar:** "Estou usando a skill `desenvolvimento-subagentes` para executar este plano."

## Entradas esperadas

- **PLANO** — texto completo do plano (tasks extraídas, não path de arquivo)
- **WORKTREE_PATH** — caminho do worktree onde trabalhar
- **PADROES_SERVICO** — padrões de código do tipo de serviço (extraídos das skills de padrão)

## O Processo

```
INÍCIO: Ler plano → Extrair todas as tasks → Criar TodoWrite

POR TASK:
  1. Despachar subagente implementador (prompt: references/implementador-prompt.md)
  2. Se perguntas → Responder → Redespachar
  3. Se DONE → Despachar spec reviewer (prompt: references/spec-reviewer-prompt.md)
  4. Se spec ❌ → Implementador corrige → Re-review spec
  5. Se spec ✅ → Despachar code quality reviewer (prompt: references/quality-reviewer-prompt.md)
  6. Se quality ❌ → Implementador corrige → Re-review quality
  7. Se quality ✅ → Marcar task completa

APÓS TODAS AS TASKS:
  Despachar reviewer final da implementação inteira
  Usar skill: finalizar-branch
```

## Seleção de Modelo

Use o modelo menos poderoso que dá conta de cada papel. Passe o parâmetro `model` ao
despachar a `task` tool:

| Tipo de task | Categoria | Model ID sugerido |
|-------------|-----------|-------------------|
| Tasks mecânicas (1-2 arquivos, spec clara) | Fast/cheap | `claude-haiku-4.5` ou `gpt-4.1` |
| Tasks de integração (multi-arquivo) | Standard | `claude-sonnet-4.6` ou `gpt-5.2` |
| Reviews (spec, quality) | Mais capaz | `claude-opus-4.6` ou `claude-sonnet-4.6` |
| Review final | Mais capaz | `claude-opus-4.6` ou `claude-opus-4.5` |

> Use `/model` na sessão principal para ver todos os modelos disponíveis no seu ambiente.

## Status do Implementador

| Status | Ação |
|--------|------|
| **DONE** | Prosseguir para spec review |
| **DONE_WITH_CONCERNS** | Ler concerns antes de prosseguir. Se sobre corretude → resolver. Se observação → anotar e prosseguir |
| **NEEDS_CONTEXT** | Fornecer contexto faltante e redespachar |
| **BLOCKED** | Avaliar: problema de contexto → fornecer; task complexa → modelo mais capaz; task grande → quebrar; plano errado → escalar ao usuário |

**Nunca** ignore um escalamento ou force retry sem mudanças.

## Prompts dos Subagentes

- `./references/implementador-prompt.md` — Template para subagente implementador
- `./references/spec-reviewer-prompt.md` — Template para reviewer de spec compliance
- `./references/quality-reviewer-prompt.md` — Template para reviewer de code quality

## Red Flags

**Nunca:**
- Implementar em main/master sem consentimento
- Pular reviews (spec OU quality)
- Prosseguir com issues não corrigidos
- Despachar múltiplos implementadores em paralelo (conflitos)
- Fazer subagente ler arquivo do plano (forneça texto completo)
- Pular context de scene-setting
- Começar quality review antes de spec estar ✅
- Avançar para próxima task com review em aberto

**Se subagente faz perguntas:**
- Responder clara e completamente
- Fornecer contexto adicional se necessário

**Se reviewer encontra issues:**
- Implementador corrige
- Reviewer re-avalia
- Repetir até aprovação

## Integração

**Invocada por:**
- `executar-implementacao` (Passos 3 e 4) — via `despachar-agentes-paralelos`
- `executar-planos` — como alternativa sequencial

**Usa:**
- `tdd` — subagentes implementadores seguem TDD
- `solicitar-code-review` — template para reviewers
- `verificacao-pre-conclusao` — antes de marcar task done
- `finalizar-branch` — após todas as tasks completas
