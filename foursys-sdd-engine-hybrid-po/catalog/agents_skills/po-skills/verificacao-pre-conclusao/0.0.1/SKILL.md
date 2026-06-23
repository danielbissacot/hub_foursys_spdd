---
name: verificacao-pre-conclusao
description: |
  Gate obrigatório antes de qualquer claim de conclusão: exige evidência de execução
  (output de testes, build, verificação) antes de afirmar que algo está pronto.
  Use SEMPRE antes de dizer "concluído", "pronto", "funcionando", "testes passando"
  ou qualquer variação de sucesso. Invoque ao ver claims de completude sem evidência,
  ou antes de commitar, criar PR ou avançar para próxima task.
metadata:
  version: "0.0.1"
---

# Verificação Pré-Conclusão

## Por que esta skill existe

Afirmar que algo está pronto sem verificação é desonestidade, não eficiência.

**Princípio:** Evidência antes de claims. Sempre.

**Violar a letra desta regra é violar o espírito desta regra.**

## Lei de Ferro

```
NENHUM CLAIM DE CONCLUSÃO SEM EVIDÊNCIA FRESCA DE VERIFICAÇÃO
```

Se não rodou o comando de verificação nesta mensagem, não pode afirmar que passa.

## Função de Gate

```
ANTES de afirmar qualquer status ou expressar satisfação:

1. IDENTIFICAR: Qual comando prova este claim?
2. RODAR: Executar o comando COMPLETO (fresco)
3. LER: Output completo, verificar exit code, contar falhas
4. VERIFICAR: Output confirma o claim?
   - Se NÃO: Declarar status real com evidência
   - Se SIM: Declarar claim COM evidência
5. SÓ ENTÃO: Fazer o claim

Pular qualquer passo = mentir, não verificar
```

## Padrões Comuns

| Claim | Requer | Não é suficiente |
|-------|--------|------------------|
| Testes passam | Output do comando: 0 falhas | Rodada anterior, "deveria passar" |
| Build limpo | Output do build: exit 0 | Linter passando, "parece ok" |
| Bug corrigido | Teste do sintoma original: passa | Código mudou, "deve ter resolvido" |
| Agente concluiu | Diff no VCS mostra mudanças | Agente reporta "sucesso" |
| Requisitos atendidos | Checklist linha por linha | Testes passando |

## Red Flags — PARE

- Usando "deveria", "provavelmente", "parece"
- Expressando satisfação antes de verificação ("Pronto!", "Feito!")
- Prestes a commitar/push/PR sem verificação
- Confiando em report de agente sem verificar
- Pensando "só dessa vez"

## Prevenção de Racionalização

| Desculpa | Realidade |
|----------|-----------|
| "Deveria funcionar agora" | RODE a verificação |
| "Estou confiante" | Confiança ≠ evidência |
| "Só dessa vez" | Sem exceções |
| "Linter passou" | Linter ≠ compilador |
| "Agente disse que deu certo" | Verifique independentemente |
| "Verificação parcial basta" | Parcial não prova nada |

## Integração

**Invocada por:**
- `executar-implementacao` (Passo 5) — verificação final
- `desenvolvimento-subagentes` — após cada task
- `executar-planos` — após cada batch
- `finalizar-branch` — antes de oferecer opções

**Regra final:**
```
Sem atalhos para verificação.
Rode o comando. Leia o output. SÓ ENTÃO declare o resultado.
Isto é inegociável.
```
