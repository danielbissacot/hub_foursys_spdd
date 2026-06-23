---
name: git-worktrees
description: |
  Cria workspaces isolados via git worktree para implementação de features em múltiplos
  repositórios. Use sempre que precisar isolar trabalho em branches de feature antes de
  executar planos de implementação. Invoque antes de qualquer execução de implementação de planos ou ao ver "preparar workspace", "criar worktree",
  "isolar branch", "setup de repositório para implementação" — esta skill gerencia o ciclo
  completo: verificação de .gitignore, criação de worktree, setup de dependências e
  validação de baseline de testes.
metadata:
  version: "0.0.1"
---

# Git Worktrees — Workspaces Isolados para Implementação

## Por que esta skill existe

Implementação de features envolve múltiplos repositórios (srv, bff, fed). Trabalhar
diretamente na branch principal é arriscado. Git worktrees criam workspaces isolados
que compartilham o mesmo repositório, permitindo trabalho paralelo em múltiplas branches
sem `git stash` ou `git switch`.

**Princípio:** Isolamento sistemático + verificação de safety = implementação confiável.

**Anuncie ao iniciar:** "Estou usando a skill `git-worktrees` para preparar workspaces isolados."

## Entradas esperadas

- **REPOSITORIOS** — lista de repositórios a preparar (ex: `../dupe-srv-opt`, `../dupe-bff-itr-opt`)
- **JIRA_KEY** — chave do épico/feature (ex: DUPE-1234)
- **SLUG** — identificador da US ou tech-solution (ex: `consulta-saldo`, `tech-solution`)
- **BRANCH_BASE** — branch de origem (default: `main`; pode ser branch do Tech Solution)

## Processo

### Passo 1: Selecionar diretório de worktrees

Para cada repositório, verificar nesta ordem:

```bash
ls -d .worktrees 2>/dev/null     # Preferido (hidden)
ls -d worktrees 2>/dev/null      # Alternativa
```

- **Se encontrado:** usar esse diretório.
- **Se não encontrado:** criar `.worktrees/`.

### Passo 2: Verificar .gitignore

```bash
git check-ignore -q .worktrees 2>/dev/null
```

**Se NÃO ignorado:** adicionar ao `.gitignore` e commitar antes de criar worktree.

### Passo 3: Criar worktree com branch de feature

```bash
# Naming convention: feature/<JIRA_KEY>-<slug>
BRANCH="feature/${JIRA_KEY}-${SLUG}"

# Se branch base é main/master
git worktree add .worktrees/${BRANCH} -b ${BRANCH}

# Se branch base é outra (ex: branch do Tech Solution)
git worktree add .worktrees/${BRANCH} -b ${BRANCH} ${BRANCH_BASE}
```

### Passo 4: Setup do projeto

```bash
cd .worktrees/${BRANCH}

# Auto-detect
if [ -f pom.xml ]; then ./mvn install -DskipTests -q; fi
if [ -f package.json ]; then npm install --silent; fi
if [ -f requirements.txt ]; then pip install -r requirements.txt -q; fi
if [ -f go.mod ]; then go mod download; fi
```

### Passo 5: Verificar baseline de testes

```bash
# Rodar testes para confirmar worktree limpo
if [ -f pom.xml ]; then ./mvn test -q; fi
if [ -f package.json ]; then npm test; fi
if [ -f requirements.txt ]; then pytest; fi
```

- **Testes passam:** registrar quantidade como baseline ✅
- **Testes falham:** reportar falhas, perguntar ao usuário se deve prosseguir

### Passo 6: Reportar

```
Worktree pronto em <path-completo>
Branch: <nome-da-branch>
Baseline: <N> testes passando
```

## Contexto Multi-Repo

Quando preparando worktrees para múltiplos repositórios:

1. Iterar sobre cada repositório
2. Aplicar Passos 1-5 em cada um
3. Consolidar resultado em tabela:

```
| Serviço | Worktree | Branch | Baseline |
|---------|----------|--------|----------|
| dupe-srv-opt | ../.worktrees/feature-DUPE-1234-cs | feature/DUPE-1234-consulta-saldo | ✅ 47 tests |
| dupe-bff-itr-opt | ../.worktrees/feature-DUPE-1234-cs | feature/DUPE-1234-consulta-saldo | ✅ 32 tests |
```

## Branching para USs com Tech Solution

Quando USs dependem de um Tech Solution já implementado:

- **Branch base das USs** = branch do Tech Solution (não `main`)
- Permite que USs partam do código compartilhado sem esperar merge

```bash
# Tech Solution primeiro (base: main)
git worktree add .worktrees/feature-DUPE-1234-ts -b feature/DUPE-1234-tech-solution

# US (base: branch do Tech Solution)
git worktree add .worktrees/feature-DUPE-1234-cs -b feature/DUPE-1234-consulta-saldo feature/DUPE-1234-tech-solution
```

## Red Flags

**Nunca:**

- Criar worktree sem verificar `.gitignore`
- Pular verificação de baseline de testes
- Prosseguir com testes falhando sem perguntar
- Assumir diretório sem verificar

**Sempre:**

- Prioridade: existente > criar `.worktrees/`
- Verificar `.gitignore` para worktrees project-local
- Rodar setup de dependências
- Verificar baseline de testes

## Integração

**Invocada por:**

- `executar-implementacao` (Passo 2) — preparar workspaces antes de executar planos
- `desenvolvimento-subagentes` — antes de executar qualquer task
- `executar-planos` — antes de executar qualquer task

**Complementa:**

- `finalizar-branch` — limpa worktrees após conclusão do trabalho
