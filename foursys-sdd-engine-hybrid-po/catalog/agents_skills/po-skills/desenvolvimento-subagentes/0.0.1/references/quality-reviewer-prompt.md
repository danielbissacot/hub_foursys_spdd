# Prompt Template — Reviewer de Code Quality

Use este template ao despachar um reviewer de qualidade de código via `task` tool do Copilot CLI.

**Propósito:** Verificar se a implementação é bem construída (limpa, testada, manutenível).

**Despachar apenas APÓS spec compliance review passar.**

> **Sintaxe:** `task` tool com `agent_type: "code-review"`, modelo mais capaz disponível
> (ex: `claude-opus-4.6`). O agent_type `code-review` tem acesso às ferramentas de
> investigação de código necessárias para análise de diff e qualidade.

```
task tool:
  agent_type: code-review
  mode: sync
  model: claude-opus-4.6    # use o modelo mais capaz disponível para reviews
  description: "Code quality review para Task N"
  prompt: |
    Use o template em solicitar-code-review/code-reviewer.md

    WHAT_WAS_IMPLEMENTED: [do report do implementador]
    PLAN_OR_REQUIREMENTS: Task N do [plano]
    BASE_SHA: [commit antes da task]
    HEAD_SHA: [commit atual]
    DESCRIPTION: [resumo da task]
```

**Além dos concerns padrão de qualidade, o reviewer deve checar:**
- Cada arquivo tem uma responsabilidade clara com interface bem definida?
- Unidades decompostas para serem entendidas e testadas independentemente?
- Implementação segue a estrutura de arquivos do plano?
- Implementação criou arquivos novos já grandes, ou cresceu significativamente arquivos existentes?

**Reviewer retorna:** Pontos fortes, Issues (Critical/Important/Minor), Assessment
