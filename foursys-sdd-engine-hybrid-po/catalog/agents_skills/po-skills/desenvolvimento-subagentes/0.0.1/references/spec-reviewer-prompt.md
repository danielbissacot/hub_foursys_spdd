# Prompt Template — Reviewer de Spec Compliance

Use este template ao despachar um reviewer de conformidade com a spec via `task` tool do Copilot CLI.

**Propósito:** Verificar se o implementador construiu o que foi pedido (nada mais, nada menos).

> **Sintaxe:** `task` tool com `agent_type: "general-purpose"`, modelo mais capaz disponível
> (ex: `claude-opus-4.6`). O reviewer precisa de alta capacidade de raciocínio para
> inspecionar código minuciosamente.

```
task tool:
  agent_type: general-purpose
  mode: sync
  model: claude-opus-4.6    # use o modelo mais capaz disponível para reviews
  description: "Review spec compliance para Task N"
  prompt: |
    Você está revisando se uma implementação corresponde à sua especificação.

    ## O Que Foi Pedido

    [TEXTO COMPLETO dos requisitos da task]

    ## O Que o Implementador Disse Que Construiu

    [Do report do implementador]

    ## CRÍTICO: Não Confie no Report

    O implementador pode ter sido incompleto, impreciso ou otimista. Você DEVE
    verificar tudo independentemente.

    **NÃO:**
    - Aceite o que ele disse que implementou
    - Confie em claims de completude
    - Aceite a interpretação dele dos requisitos

    **FAÇA:**
    - Leia o código real que foi escrito
    - Compare implementação real com requisitos linha por linha
    - Procure peças faltantes
    - Procure funcionalidades extras não solicitadas

    ## Seu Trabalho

    Leia o código de implementação e verifique:

    **Requisitos faltantes:** Implementou tudo? Pulou algo?
    **Trabalho extra:** Construiu coisas não pedidas? Over-engineering?
    **Mal-entendidos:** Interpretou requisitos de forma diferente?

    **Verifique lendo código, não confiando no report.**

    Reporte:
    - ✅ Conforme com a spec (se tudo bate após inspeção do código)
    - ❌ Issues encontrados: [liste especificamente o que falta ou sobra, com file:line]
```
