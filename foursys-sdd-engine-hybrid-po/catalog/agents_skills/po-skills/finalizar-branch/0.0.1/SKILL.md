---
name: finalizar-branch
description: |
  Guia a conclusão do trabalho em uma branch de desenvolvimento: verifica testes,
  apresenta opções estruturadas (merge, PR, manter, descartar) e executa a escolha.
  Use quando implementação está completa e precisa decidir como integrar o trabalho.
  Invoque ao ver "finalizar branch", "criar PR", "merge", "concluir implementação",
  "integrar trabalho" — esta skill garante verificação antes de qualquer integração.
metadata:
  version: "0.0.1"
---

# Finalizar Branch

## Por que esta skill existe

Após implementação concluída, o fluxo de finalização precisa ser consistente:
verificar testes → apresentar opções → executar escolha → limpar.

**Princípio:** Verificar testes → Apresentar opções → Executar escolha → Limpar.

**Anuncie ao iniciar:** "Estou usando a skill `finalizar-branch` para concluir este trabalho."

## Processo

### Passo 1: Verificar Testes

```bash
# Rodar suite de testes do projeto
./mvn test    # Java
npm test       # Node.js
pytest         # Python
```

**Se testes falham:** PARE. Não prossiga para opções.

**Se testes passam:** Continue para Passo 2.

### Passo 2: Apresentar Opções

Apresentar exatamente 4 opções:

```
Implementação completa. O que deseja fazer?

1. Merge back to <base-branch> localmente
2. Push e criar Pull Request
3. Manter a branch como está (eu resolvo depois)
4. Descartar este trabalho

Qual opção?
```

### Passo 3: Executar Escolha

**Opção 1 — Merge local:**
```bash
git checkout <base-branch>
git pull
git merge <feature-branch>
# Verificar testes no resultado do merge
git branch -d <feature-branch>
```

**Opção 2 — Push + PR:**
```bash
git push -u origin <feature-branch>
gh pr create --title "<título>" --body "<sumário>"
```

**Opção 3 — Manter:** Reportar path da branch e worktree. Não limpar.

**Opção 4 — Descartar:** Exigir confirmação ("descartar"). Deletar branch e worktree.

### Passo 4: Limpar Worktree

Para opções 1, 2 e 4:
```bash
git worktree remove <worktree-path>
```

Para opção 3: manter worktree.

## Modo Batch (Multi-Repo)

Quando finalizando múltiplas branches em múltiplos repositórios:

1. Perguntar ao usuário: "Aplicar a mesma opção para todos os repositórios, ou decidir um por um?"
2. **Se mesma opção:** executar para todos
3. **Se individual:** apresentar opções por repo

## Red Flags

**Nunca:**
- Prosseguir com testes falhando
- Merge sem verificar testes no resultado
- Deletar trabalho sem confirmação
- Force-push sem pedido explícito

## Integração

**Invocada por:**
- `executar-implementacao` (Passo 6)
- `desenvolvimento-subagentes` — após todas as tasks
- `executar-planos` — após todas as tasks

**Complementa:**
- `git-worktrees` — limpa worktrees criados por essa skill
- `solicitar-code-review` — se opção 2 (PR) escolhida
