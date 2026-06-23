---
name: executar-planos
description: |
  Executa planos de implementação de forma sequencial quando subagentes não estão
  disponíveis ou quando execução inline é preferida. Use como fallback do
  desenvolvimento-subagentes, ou quando o usuário preferir execução na sessão atual
  sem despacho de subagentes. Invoque ao ver "executar plano sequencial", "inline",
  "sem subagentes", "executar nesta sessão".
metadata:
  version: "0.0.1"
---

# Executar Planos — Execução Sequencial

## Por que esta skill existe

Fallback para quando subagentes não estão disponíveis ou quando o usuário prefere
execução inline. Carrega o plano, executa task por task na sessão atual.

**Anuncie ao iniciar:** "Estou usando a skill `executar-planos` para implementar este plano."

**Nota:** A qualidade será significativamente melhor com subagentes. Se disponíveis,
use `desenvolvimento-subagentes` ao invés desta skill.

## Processo

### Passo 1: Carregar e Revisar Plano

1. Ler arquivo do plano
2. Revisar criticamente — identificar dúvidas ou concerns
3. Se concerns: levantar com o usuário antes de começar
4. Se ok: criar TodoWrite e prosseguir

### Passo 2: Executar Tasks

Para cada task:
1. Marcar como in_progress
2. Seguir cada step exatamente (plano tem steps bite-sized)
3. Seguir TDD (skill `tdd`): teste primeiro, ver falhar, implementar, ver passar
4. Rodar verificações especificadas
5. Commitar
6. Marcar como completed

### Passo 3: Completar Desenvolvimento

Após todas as tasks completas e verificadas:
- Usar skill `verificacao-pre-conclusao` para confirmar tudo
- Usar skill `finalizar-branch` para opções de merge/PR

## Quando Parar e Pedir Ajuda

**PARE imediatamente quando:**
- Hit blocker (dependência faltando, teste falha, instrução não clara)
- Plano tem gaps críticos
- Não entende uma instrução
- Verificação falha repetidamente

**Pergunte ao invés de adivinhar.**

## Integração

**Alternativa de:**
- `desenvolvimento-subagentes` — usar esta skill quando subagentes não disponíveis

**Usa:**
- `git-worktrees` — setup de workspace antes de iniciar
- `tdd` — seguir TDD em cada task
- `verificacao-pre-conclusao` — antes de clamar conclusão
- `finalizar-branch` — após conclusão
