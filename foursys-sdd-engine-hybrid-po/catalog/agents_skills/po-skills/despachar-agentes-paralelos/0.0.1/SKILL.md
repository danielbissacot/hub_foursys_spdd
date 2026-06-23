---
name: despachar-agentes-paralelos
description: |
  Despacha subagentes em paralelo para tarefas independentes. Use quando houver 2+
  tarefas que podem ser trabalhadas sem estado compartilhado ou dependências sequenciais.
  Invoque ao ver "paralelo por serviço", "executar independente", "despachar agentes",
  "múltiplos serviços simultâneos", "paralelizar tarefas" — esta skill coordena a
  delegação e integração de resultados de múltiplos agentes concorrentes.
metadata:
  version: "0.0.1"
---

# Despachar Agentes Paralelos

## Por que esta skill existe

Investigar ou implementar múltiplos domínios independentes sequencialmente desperdiça
tempo. Cada domínio pode ser trabalhado em paralelo por um agente com contexto isolado.

**Princípio:** Um agente por domínio independente. Deixe-os trabalhar concorrentemente.

## Quando Usar

**Use quando:**
- 2+ serviços podem ser implementados simultaneamente
- Cada domínio pode ser entendido sem contexto dos outros
- Sem estado compartilhado entre investigações
- Tasks não editam os mesmos arquivos

**Não use quando:**
- Falhas são relacionadas (corrigir uma pode corrigir outras)
- Agentes interfeririam entre si (editando mesmos arquivos)
- Precisa entender estado global do sistema primeiro

## Pré-requisito: Fleet Mode

Para executar subagentes em paralelo no GitHub Copilot CLI, **fleet mode deve estar ativo**:

```
/fleet
```

Ative antes de despachar múltiplos agentes. Monitore os agentes em execução com:

```
/tasks
```

> Sem `/fleet`, os agentes são despachados sequencialmente. Use `/fleet` sempre que
> houver 2+ domínios independentes para trabalhar em paralelo.

## O Padrão

### 1. Identificar domínios independentes

Agrupar por escopo isolado. No contexto multi-repo:

```
Serviço A (dupe-srv-opt): Tasks 1-3 do plano
Serviço B (dupe-bff-itr-opt): Tasks 4-5 do plano
Serviço C (dupe-fed-opt): Tasks 6-8 do plano
```

Cada serviço tem seu próprio worktree — zero chance de conflito.

### 2. Criar prompts focados por agente

Cada agente recebe:
- **Escopo específico:** Um serviço ou subsistema
- **Objetivo claro:** Quais tasks executar
- **Constraints:** Não alterar código fora do escopo
- **Contexto completo:** Texto das tasks (não path do arquivo), padrões do serviço
- **Output esperado:** Resumo do que fez e resultado

### 3. Despachar em paralelo

Use a `task` tool com `mode: "background"` para cada agente (requer `/fleet` ativo):

```
Agente 1 → Serviço A (worktree A) → Tasks 1-3
Agente 2 → Serviço B (worktree B) → Tasks 4-5
Agente 3 → Serviço C (worktree C) → Tasks 6-8
```

Acompanhe o progresso com `/tasks`. Aguarde todos concluírem antes de integrar.

### 4. Revisar e integrar

Quando agentes retornam:
- Ler cada resumo
- Verificar que fixes não conflitam
- Rodar testes em cada worktree
- Consolidar resultado

## Dois Níveis de Paralelismo

No contexto de execução de planos:

```
Nível 1: Paralelo por US (batch)
  └── Nível 2: Paralelo por serviço (dentro de cada US)
```

**Nível 1** — Cada US é um agente independente
**Nível 2** — Dentro de cada US, cada serviço é um agente independente

## Erros Comuns

**❌ Escopo amplo demais:** "Implemente tudo" — agente se perde
**✅ Específico:** "Execute Tasks 1-3 no dupe-srv-opt" — escopo focado

**❌ Sem contexto:** "Corrija o problema" — agente não sabe onde
**✅ Com contexto:** Texto completo das tasks + mensagens de erro

**❌ Sem constraints:** Agente pode refatorar tudo
**✅ Com constraints:** "Não altere código fora do escopo das tasks"

## Verificação Pós-Agentes

Após todos retornarem:
1. **Ler cada resumo** — entender o que mudou
2. **Checar conflitos** — agentes editaram mesmo código?
3. **Rodar testes completos** — verificar que tudo funciona junto
4. **Spot check** — agentes podem cometer erros sistemáticos

## Integração

**Invocada por:**
- `executar-implementacao` (Passos 3 e 4) — paralelo por serviço e por US

**Usa:**
- `desenvolvimento-subagentes` — cada agente executa tasks usando esta skill
- `verificacao-pre-conclusao` — após integração de resultados
