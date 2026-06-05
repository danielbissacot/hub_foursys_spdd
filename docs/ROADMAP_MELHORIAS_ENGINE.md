# Roadmap de Melhorias — Engine Hybrid SDD

Rastreamento das melhorias identificadas para o `foursys-sdd-engine-hybrid`. Atualizar ao concluir cada item.

---

## Fase 4 (Tasks) — Granularidade de Tarefas

| # | Ajuste | Arquivo(s) | Status |
|---|--------|-----------|--------|
| 1 | Novo formato de tarefa: campos `Estimativa`, `Critério de conclusão`, `Depende de` + seção separada de testes | `foursys-sdd-engine-hybrid/catalog/sdd/generic/foursys-tasks.md` `catalog/playbook/sdd/foursys-tasks.md` | ✅ Concluído (v1.1.0 / v1.6.0) |
| 2 | Regra de granularidade: tarefa M → quebrar, tarefa L → não aceita (tabela de estimativas) | Mesmo dos acima | ✅ Incluído no Ajuste 1 |
| 3 | Campo `taskPatternExample` por stack em `stack-registry.ts` — guia a IA com a sequência típica de decomposição de cada tecnologia (Angular: interface → service → component → template → teste) | `foursys-sdd-engine-hybrid/src/stack-registry.ts` `foursys-sdd-engine-hybrid/catalog/sdd/generic/foursys-tasks.md` | 🔲 Pendente |

---

## Testes Automatizados

| # | Módulo | Tipo | Status |
|---|--------|------|--------|
| 1 | `stack-registry.ts` — detecção de stack (4 níveis de confiança) | Unit (Mocha + sinon) | 🔲 Pendente |
| 2 | `catalog-loader.ts` — parsing de playbooks, remoção de frontmatter, fallback | Unit (Mocha + sinon) | 🔲 Pendente |
| 3 | `ai-client.ts` — validação de resposta (rejeita recusas, resposta vazia < 50 chars) | Unit (Mocha + sinon) | 🔲 Pendente |
| 4 | Fluxo completo de cada fase SDD no VS Code | Integration (`@vscode/test-electron`) | 🔲 Fase 2 |

---

## Stacks Incompletas

| Stack | O que falta | Status |
|-------|-------------|--------|
| Node.js / NestJS | Expandir skills em `.github/skills/` (hoje só skeleton) | 🔲 Pendente |
| COBOL | Refinamento de playbooks e skills para modernização de legado | 🔲 Pendente |

---

## Mend Advise

| # | Item | Status |
|---|------|--------|
| 1 | Integração na sidebar (install, estado instalando, ver CVEs no Problems panel) | ✅ Concluído — E2E validado manualmente |
| 2 | Fix ID `mend.mend-advise` (era `Mend.mend-advise`), fallback para Problems panel, try/catch no install | ✅ Concluído |
| 3 | Testes automatizados E2E do fluxo de segurança | 🔲 Backlog |

---

## Sincronização de Catálogo

| # | Item | Status |
|---|------|--------|
| 1 | Substituir `git clone` por GitHub API ou blob storage para evitar falhas de rede em ambiente corporativo | 🔲 Backlog |

---

*Legenda: ✅ Concluído · 🔲 Pendente · ⏸ Bloqueado*
