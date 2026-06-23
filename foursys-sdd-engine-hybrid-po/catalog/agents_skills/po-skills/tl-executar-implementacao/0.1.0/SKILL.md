---
name: 'tl-executar-implementacao'
description: |
  Executa planos de implementação orquestrando worktrees isolados, subagentes com
  TDD, verificação e code review para delivery automatizado. Invoque ao ver
  "executar plano", "implementar", "executar implementação", "rodar o plano".
metadata:
  version: "0.1.0"
---

# Execução de planos de implementação

Orquestra a execução de planos gerados pelo `tl-gerar-plano`, delegando cada etapa às skills especializadas.

> 💡 **Pipeline:** `tl-iniciar-exploracao` (opcional) → `tl-refinar-feature` → `gerar-user-story` → `tl-gerar-plano` → **`tl-executar-implementacao`**

**Anuncie ao iniciar:** "Estou usando o prompt `tl-executar-implementacao` para executar o(s) plano(s) de implementação."

<HARD-GATE>
Nunca inicie implementação em branch `main` ou `master` sem consentimento explícito do usuário. Toda execução ocorre em worktrees isolados com branches de feature.
</HARD-GATE>

<CONTEXT-BUDGET>
Este comando usa o padrão **lean-orchestrator**: coordena o fluxo e mantém apenas resumos de status. Todo código é escrito por subagents com contexto isolado. O contexto principal NUNCA deve conter código-fonte, conteúdo completo de planos ou output de testes — apenas metadata, status e resumos ≤20 linhas.
</CONTEXT-BUDGET>

## Skills Orquestradas

| Skill | Passo | Propósito |
|-------|-------|-----------|
| `git-worktrees` | 2 | Workspace isolado por serviço/branch |
| `desenvolvimento-subagentes` | 3, 4 | Executor: 1 subagent/task + 2-stage review |
| `despachar-agentes-paralelos` | 3, 4 | Paralelizar entre serviços e USs |
| `tdd` | 3, 4 | Disciplina Red-Green-Refactor |
| `verificacao-pre-conclusao` | 5 | Evidência antes de claims |
| `finalizar-branch` | 6 | Merge/PR/keep/discard |
| `solicitar-code-review` | 7 | Despachar reviewer |
| `receber-code-review` | 7 | Tratar feedback |
| `executar-planos` | fallback | Quando subagents indisponíveis |

## Modos de operação

| Modo | Invocação | Descrição |
|------|-----------|-----------|
| **Single US** | `tl-executar-implementacao <US-slug>` | Executa plano de **uma** US a partir de `specs/<US-slug>/` em cada service repo impactado. Paraleliza por serviço. |
| **Batch** | `tl-executar-implementacao <indice-path> --all` | Lê `<doc-repo>/specs/EPIC-<JIRA_KEY>/_indice-planos.md`, executa Tech Solution primeiro e depois USs em paralelo nos service repos. |

Se o usuário não especificar modo, pergunte qual prefere.

## Pré-requisitos

- Plano(s) nos repositórios dos serviços impactados (gerados pelo `tl-gerar-plano`):
  - `../<service-repo>/specs/<US-slug>/intents.md`
  - `../<service-repo>/specs/<US-slug>/bdd-scenarios.md`
  - `../<service-repo>/specs/<US-slug>/tasks/task-NN-*.md`
  - `../<service-repo>/specs/tech-solution/intents.md` (quando aplicável)
  - `../<service-repo>/specs/tech-solution/bdd-scenarios.md` (quando aplicável)
  - `../<service-repo>/specs/tech-solution/tasks/task-NN-*.md` (quando aplicável)
- Índice mestre (batch): `<centro-de-custo>-doc-<projeto>/specs/EPIC-<JIRA_KEY>/_indice-planos.md`
- Repositórios acessíveis no workspace (padrão: `../<nome-repositorio>`)
- ADR/RFC aprovado e User Stories geradas
- Git configurado com acesso push

## Processo

### Passo 0: Detectar modo

1. Argumento é um `<US-slug>` (sem path completo) ou path terminando em `specs/<slug>/` → **Single US**: localizar `specs/<US-slug>/` em cada service repo do workspace
2. Path de `_indice-planos.md` com `--all` → **Batch**: ler índice no doc repo em `specs/EPIC-<JIRA_KEY>/_indice-planos.md`
3. Sem flag → listar slugs de planos disponíveis nos service repos e perguntar

### Passo 1: Carregar e Validar

1. **Single US:** para cada service repo identificado no workspace, localizar `specs/<US-slug>/intents.md` para extrair metadata (serviços, JIRA key, dependências, pré-requisitos), ler `specs/<US-slug>/bdd-scenarios.md` para cobertura de aceitação e listar `specs/<US-slug>/tasks/` para obter as task files
2. **Batch:** ler `<doc-repo>/specs/EPIC-<JIRA_KEY>/_indice-planos.md` para descobrir os service repos e slugs; para cada service repo, ler `specs/<US-slug>/intents.md` e extrair metadata essencial antes da execução
3. Validar estrutura mínima em cada service repo:
   - `specs/<US-slug>/intents.md` existe
   - `specs/<US-slug>/bdd-scenarios.md` existe
   - `specs/<US-slug>/tasks/` existe e contém ao menos um `task-NN-*.md`
   - cada `task-NN.md` possui steps com `- [ ]` e code blocks completos
4. Verificar existência dos repositórios (`ls -d ../<nome-repo>`)
5. Revisar criticamente — levantar concerns com o usuário se houver
6. Se ok → criar TodoWrite e prosseguir

> 📋 **Marcação de progresso:** Ao concluir cada task, marque `- [ ]` → `- [x]` diretamente no arquivo `task-NN.md` correspondente dentro da pasta `tasks/`. Cada task tem seu próprio arquivo de rastreamento.

### Passo 2: Preparar Workspaces

Carregar skill `git-worktrees` para **cada repositório** no plano:
- **JIRA_KEY:** chave do épico
- **SLUG:** `tech-solution` ou slug da US
- **BRANCH_BASE:** `main` para Tech Solution; branch do Tech Solution para USs

A skill cria worktrees isolados, instala dependências e verifica baseline de testes.

Reportar tabela consolidada de worktrees preparados antes de prosseguir.

### Passo 3: Executar Tech Solution (Batch only)

> Pular se não houver Tech Solution ou se Single US.

> ⚡ **Pré-requisito:** Ative `/fleet` antes de despachar agentes paralelos. Monitore com `/tasks`.

Carregar skill `despachar-agentes-paralelos` para executar em paralelo **por serviço**:
- Em cada service repo, listar `specs/tech-solution/tasks/` e ordenar arquivos por nome (`task-01`, `task-02`, ...)
- Agrupar tasks por serviço usando o prefixo presente no filename (`task-NN-<service>-*.md`)
- Despachar 1 agente por serviço independente
- Cada agente usa skill `desenvolvimento-subagentes` e executa **uma task file por vez**, sempre na ordem dos filenames:
  - para cada `task-NN.md`, fornecer ao subagent:
    - conteúdo completo de `specs/tech-solution/intents.md`
    - conteúdo completo de `specs/tech-solution/bdd-scenarios.md`
    - conteúdo completo do `specs/tech-solution/tasks/task-NN-*.md` específico
  - 1 subagent implementador por task file (TDD obrigatório via skill `tdd`)
  - 2-stage review após cada task (spec + quality)
  - `verificacao-pre-conclusao` antes de marcar done
  - **Ao concluir cada task file:** marcar `- [ ]` → `- [x]` no `task-NN.md` correspondente
- Serviços com dependência entre si: sequencial (respeitar DAG)
- Após conclusão: rodar testes em cada worktree para confirmar

### Passo 4: Executar USs

> ⚡ **Pré-requisito:** Confirme que `/fleet` está ativo para paralelismo. Use `/tasks` para acompanhar.

**Single US:**
- Em cada service repo impactado, listar `specs/<US-slug>/tasks/`, ordenar por filename e agrupar por serviço usando o prefixo no nome do arquivo
- Mesma lógica do Passo 3: `despachar-agentes-paralelos` por serviço, cada agente usa `desenvolvimento-subagentes`
- Cada subagent recebe sempre: `specs/<US-slug>/intents.md` completo + `specs/<US-slug>/bdd-scenarios.md` completo + **um único** `specs/<US-slug>/tasks/task-NN-*.md`
- **Ao concluir cada task:** marcar `- [ ]` → `- [x]` no `task-NN.md` correspondente

**Batch:**
- Confirmar Passo 3 completo (se aplicável)
- Despachar 1 agente por US via `despachar-agentes-paralelos`
- Cada agente de US executa internamente: leitura de `specs/<US-slug>/intents.md`/`specs/<US-slug>/bdd-scenarios.md` → agrupamento por serviço → `despachar-agentes-paralelos` por serviço → `desenvolvimento-subagentes` por task file em ordem de filename
- USs são independentes entre si
- **Ao concluir cada task de cada US:** marcar `- [ ]` → `- [x]` no `task-NN.md` da US correspondente

Consolidar resultado em tabela de status por US/serviço.

### Passo 5: Verificação Final

Carregar skill `verificacao-pre-conclusao` para cada worktree:
- Rodar suite completa de testes
- Comparar com baseline (nenhum teste quebrou, novos testes adicionados)
- Reportar com evidência (output real, não "deveria funcionar")

**Se testes falham:** NÃO prosseguir. Reportar e resolver.

### Passo 6: Finalizar Branches

Carregar skill `finalizar-branch` para cada repositório com branch modificada:
- Verificar testes → apresentar 4 opções → executar escolha → limpar worktree
- Se múltiplos repos: perguntar se mesma opção para todos ou individual

### Passo 7: Code Review (se PRs criados)

> Pular se o usuário não escolheu criar PRs no Passo 6.

1. Carregar skill `solicitar-code-review` para cada PR:
   - Despachar reviewer subagent com context do plano e diff
2. Carregar skill `receber-code-review` para tratar feedback:
   - Avaliar tecnicamente, sem concordância performática
   - Corrigir Critical/Important → re-verificar → re-push
3. Iterar até aprovação

### Passo 8: Terminal State

```
## ✅ Implementação executada

**Feature Jira:** <JIRA_KEY>
**US executada:** <US-slug>
**Planos executados:** N
**Total de tasks:** M

| Serviço | Repo | Branch | Tasks | Testes | Resultado |
|---------|------|--------|-------|--------|-----------|
| <srv> | ../<service-repo>/specs/<US-slug>/ | feature/<JIRA_KEY>-<slug> | N/N ✅ | X/X pass | PR #Y / Merged / Mantido |
```

## Tratamento de Erros

| Situação | Ação |
|----------|------|
| Subagent **BLOCKED** | Avaliar: contexto → fornecer; task complexa → modelo capaz; plano errado → escalar ao usuário |
| Subagent **NEEDS_CONTEXT** | Buscar informação e redespachar |
| Falha de testes inesperada | Não prosseguir. Investigar: bug → corrigir; flaky → reportar; conflito → pausar |
| Conflito entre agentes | Pausar todos. Reportar ao usuário. Resolver e retomar |

## Lembre-se

- **Nunca em main/master** — sempre worktrees com branches de feature
- **TDD obrigatório** — subagents seguem Red-Green-Refactor (skill `tdd`)
- **Evidência antes de claims** — skill `verificacao-pre-conclusao` antes de qualquer "concluído"
- **2-stage review** — spec compliance primeiro, quality depois (skill `desenvolvimento-subagentes`)
- **Lean orchestrator** — delegar, não inlinar
- **Contexto por task file** — cada execução recebe `specs/<slug>/intents.md` + `specs/<slug>/bdd-scenarios.md` + um único `specs/<slug>/tasks/task-NN-*.md`
- **1 branch por US por repo** — PRs independentes
- **USs baseadas na branch do Tech Solution** — sem esperar merge
- **Marcar checkboxes** — ao concluir cada task, atualizar `- [ ]` → `- [x]` no `task-NN.md` correspondente imediatamente
