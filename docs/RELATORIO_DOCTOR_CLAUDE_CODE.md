# Relatório /doctor — Saúde do ambiente Claude Code

**Data:** 2026-08-11
**Modo:** somente análise — nenhuma alteração foi aplicada.
**Janela analisada:** 50 sessões mais recentes, de 8 projetos diferentes, cobrindo 2026-07-23 a 2026-08-11 (19 dias).

---

## Resumo em 3 frases

O ambiente está **enxuto**: não há CLAUDE.md, MCP servers (conexões com ferramentas externas) ou plugins configurados, e as únicas Skills (arquivos de instrução para tarefas específicas) em uso são as nativas do Claude Code — nada instalado manualmente pra remover. Os dois pontos de melhoria reais são: (1) o modo de permissão "auto" (um classificador de segurança aprova ações rotineiras sem perguntar a cada uma) não está ativado como padrão, e (2) a extensão instalada no editor está desatualizada frente à versão mais recente publicada. Nenhuma das 18 negações de comando registradas na janela é candidata a pré-aprovação — todas tinham efeito colateral real (instalação, escrita, gravação de arquivo).

| Componente | Tipo | Escopo | Usos totais (desde instalação) | Usado na janela? | Tokens residentes (est.) | Veredito |
|---|---|---|---|---|---|---|
| artifact-design | Skill nativa | global | 11 | Sim (6x) | ~250 | manter |
| dataviz | Skill nativa | global | 4 | Sim (3x) | ~350 | manter |
| brainstorming | Skill nativa | global | 3 | Sim (3x, via `/brainstorming`) | ~150 | manter |
| find-skills | Skill nativa | global | 1 | Sim (1x, via `/find-skills`) | ~150 | manter |
| doctor | Skill nativa | global | 1 | Sim (esta sessão) | ~150 | manter |
| claude-api | Skill nativa | global | 1 | Sim (1x) | ~200 | manter |
| run | Skill nativa | global | 2 | Não (último uso 2026-06-19, fora da janela) | ~200 | manter (nativa) |
| validar-ccb-bradesco | Skill nativa (outro projeto) | global | 1 | Sim (1x) | ~150 | manter |
| writing-plans | Skill interna (modo Plan) | global | n/a (sem contador) | Sim (1x) | ~100 | manter (interna) |
| MCP servers | — | — | n/a (nenhum configurado) | — | 0 | n/a |
| Plugins | — | — | n/a (nenhum instalado) | — | 0 | n/a |
| CLAUDE.md (qualquer escopo) | — | — | n/a | — | 0 | n/a |

Nenhuma dessas Skills foi instalada manualmente pelo usuário (`~/.claude/skills` está vazio, o projeto não tem `.claude/skills`) — são todas nativas/empacotadas do Claude Code, então **não são candidatas a remoção** por definição.

---

## Detalhamento por checagem

### Check 0 — Saúde da instalação

- O Claude Code aqui roda como **extensão do editor** (`anthropic.claude-code`, versão **2.1.144**, instalada nas extensões do Cursor), não como instalação standalone via terminal/npm/nativo. Por isso as checagens de "instalação duplicada" e "PATH" do `claude doctor` de terminal não se aplicam a este ambiente.
- Todos os arquivos de configuração testados (`~/.claude/settings.json`, `.claude/settings.local.json` do projeto, `~/.claude.json`) passaram no teste de parse — nenhum corrompido.
- Não existem definições de Agentes customizados nem no projeto (`.claude/agents/`) nem no usuário (`~/.claude/agents/`) — os únicos Agentes disponíveis são os nativos (`claude`, `claude-code-guide`, `Explore`, `general-purpose`, `Plan`, `statusline-setup`). Nada para corrigir aqui.
- Não há política gerenciada (managed policy) configurada nesta máquina.

**Achados:** nenhum problema de instalação.

### Check 1 — Skills, MCP servers e Plugins não usados

- **Skills:** ver tabela acima. Zero Skills instaladas manualmente (nem em `~/.claude/skills`, nem em `.claude/skills` do projeto) — só as nativas do produto, que a política do doctor não permite propor remover.
- **MCP servers:** nenhum configurado em nenhum escopo (nem `.mcp.json` do projeto, nem `mcpServers` em `~/.claude.json`).
- **Plugins:** nenhum instalado (`enabledPlugins` vazio, `pluginUsage` vazio).

**Achados:** nada a remover — não há extensões instaladas pelo usuário além do produto nativo.

### Check 2 — Duplicação em CLAUDE.md locais

Não existe nenhum `CLAUDE.md` ou `CLAUDE.local.md` em nenhum escopo (nem `~/.claude/CLAUDE.md`, nem no projeto, nem em pastas ancestrais).

**Achados:** nada a checar — não há arquivo de memória de projeto configurado.

### Check 3 — Conteúdo derivável em CLAUDE.md versionados

Sem arquivos `CLAUDE.md` versionados no repositório, esta checagem não se aplica.

### Check 4 — Migração de conteúdo sempre-carregado para lazy loading

Sem arquivos `CLAUDE.md`, não há conteúdo sempre-carregado para migrar.

### Check 5 — Hooks lentos

Nenhum hook (script automático disparado por eventos) está configurado em nenhum arquivo de settings, e a varredura das 50 transcrições não encontrou nenhum evento de execução de hook (`hook_success`/`hook_error`/`hook_cancelled`) na janela.

**Achados:** nada a reportar.

### Check 6 — Extensões que pesam no contexto

Sem CLAUDE.md, sem MCP servers, sem plugins — o único item que ocupa contexto de forma residente é a listagem de Skills nativas mostrada no início de cada sessão, estimada em ~1.5k caracteres (~370 tokens est.), bem abaixo do orçamento de ~1% da janela de contexto reservado para isso. Use `/context` para a medição exata ao vivo.

**Achados:** ambiente já enxuto, nada a otimizar.

### Check 7 — Versão do Claude Code

- Instalado: extensão `anthropic.claude-code` **2.1.144** (Cursor).
- Canal de atualização: não definido nas settings → padrão `latest`.
- Referência mais recente publicada (pacote npm `@anthropic-ai/claude-code`, tag `latest`): **2.1.228**.

A extensão está **atrasada** frente a essa referência. Atenção: essa é uma comparação indireta — a extensão do editor não é atualizada por `claude update` nem pelo npm, e sim pelo marketplace de extensões do Cursor/VS Code, então o número de versão da extensão pode não acompanhar o pacote npm no mesmo ritmo. Ainda assim, uma diferença de ~84 versões patch sugere que vale checar manualmente.

**Ação recomendada (não aplicada):** no Cursor, abrir o painel de Extensões, localizar "Claude Code" e clicar em atualizar (ou ativar atualização automática de extensões).

### Check 8 — Modo "auto" como padrão de permissão

`permissions.defaultMode` não está definido em nenhum escopo (usuário, projeto ou local) — hoje o Claude Code pergunta a cada ação que não seja auto-aprovada por padrão, em vez de deixar o classificador de segurança do modo "auto" decidir ações rotineiras. Não há bloqueio de política (`disableAutoMode`) nem política gerenciada impedindo isso.

**Ação recomendada (não aplicada):** adicionar `"permissions": {"defaultMode": "auto"}` em `~/.claude/settings.json` (escopo do usuário, vale pra todos os projetos). Reversível a qualquer momento; se o modo "auto" ficar indisponível por algum motivo, o Claude Code volta sozinho pro modo padrão com um aviso.

### Check 9 — Pré-aprovar comandos somente-leitura negados

Na janela de 19 dias / 50 sessões, foram encontradas **18 negações** de uso de ferramenta:

| Ferramenta | Negações | Tipo (motivo) |
|---|---|---|
| Bash | 5 | permission-rule (4) + user-rejected (1) |
| ExitPlanMode | 4 | user-rejected |
| AskUserQuestion | 3 | user-rejected |
| Grep | 3 | user-rejected |
| PowerShell | 1 | permission-rule |
| Edit | 1 | (mistura) |
| Read | 1 | permission-rule |

Analisando cada comando Bash/PowerShell negado individualmente: `node --version && npm --version && npx --version`, `mvn -q compile`, `git add ... && git status --short`, `npm install --no-audit --no-fund`, `pip install pymupdf`, e um script PowerShell que grava e depois apaga um arquivo `.js` temporário. **Nenhum é somente-leitura** — todos instalam pacotes, compilam, alteram o índice do git ou gravam arquivos, então nenhum é candidato a pré-aprovação (mesmo os que negaram por engano do usuário). As negações em Grep/Read/Edit/ExitPlanMode/AskUserQuestion ficam fora do escopo desta checagem (que só cobre comandos Bash e ferramentas MCP).

**Achados:** nenhuma regra de pré-aprovação seria segura de propor nesta janela.

---

## O que fazer a seguir

Nada foi alterado — este é só o diagnóstico pedido. As únicas duas ações que eu recomendaria, se você quiser aplicá-las depois:

1. **Ativar modo "auto" como padrão** (Check 8) — evita interrupções em ações rotineiras, reversível.
2. **Atualizar a extensão Claude Code no Cursor** (Check 7) — via painel de Extensões, já que a versão instalada parece estar atrasada.

Me avise se quiser que eu aplique algum desses pontos.
