# Plano de Teste — SDD Angular (19/08/2026)

**Alvo:** `pspj-fed-mcpj-psv-rotat` (pasta local `Projeto Hub`)
**Versão:** `foursys-sdd-engine-hybrid-po-1.2.6.vsix` — 450,83 KB, 154 arquivos
**História:** SPJCPCE-918 — abertura da jornada com contexto de contrato

---

## O que está sendo validado

| # | Correção | Onde foi mexido |
|---|---|---|
| **A** | Mockup chega como imagem real | `ai-client.ts` + `extension.ts` (commit `5c23ae4`) |
| **B** | Cobertura do Angular: mede ou avisa, nunca inventa | `prompt-context.ts` → `lerCoberturaJs` |
| **C** | Persona do Angular respeita projeto legado | `AGENTE_ANGULAR_FOURSYS.md` + guarda em `sidebar-provider.ts` |

---

## Pré-condições

- [ ] Extensão **desinstalada** e reinstalada pelo `.vsix` novo (a versão não mudou, então sem desinstalar o VS Code ignora)
- [ ] **Reload Window** feito depois de instalar
- [ ] **"Sincronizar Skills"** clicado na barra lateral — é o que copia a persona pro global storage
- [ ] Projeto Angular zerado: sem `doc_projeto/`, `src/` limpo
- [ ] Mockup recortado em mãos (só o card branco)

---

## Fase 0 — Constitution

**Rodar:** botão `0 Constitution`

| Verificar | Esperado | Resultado |
|---|---|---|
| Cita `app.config.ts` / `app.routes.ts` | ⚠️ **SIM, e está certo estar errado** — é o item 3, ainda não corrigido | |
| Diz "Vitest preferido" | ⚠️ **SIM** — é o item 4, ainda não corrigido | |

> **Atenção:** esta fase ainda tem os dois defeitos conhecidos. Não é falha do teste — é escopo que ficou para depois. O objetivo aqui é só confirmar que o Plan consegue **corrigir** isso adiante.

---

## Fase 1 — Preparar a história

1. Criar a história pela barra lateral
2. Colar o texto da SPJCPCE-918 no `user_story.md`
3. **Deixar o `technical_spec.md` VAZIO** — sem dica técnica minha, o teste é o Hub sozinho
4. Adicionar o mockup **pelo botão**, com a história já criada

| Verificar | Esperado | Resultado |
|---|---|---|
| Mockup foi para `doc_projeto/<historia>/screens/` | e **não** para `doc_projeto/screens/` | |

> Se cair na pasta errada, o Specify não enxerga. Foi o que aconteceu ontem por adicionar o mockup antes de criar a história.

---

## Fase 2 — Specify (valida a correção A)

**Rodar:** botão `1 Specify`

| Verificar | Esperado | Resultado |
|---|---|---|
| Existe seção de escopo visual | Um bloco tipo "Escopo visual interpretado (mockup)" | |
| Cita o texto do card | "Que tal só ajustar o limite?", "Ajustar limite", "Cancelar cheque empresarial" | |
| Declara a região em escopo | Diz que é o card/modal em primeiro plano | |
| Exclui o que não é escopo | Diz que a tela de fundo está fora | |

**Falha se:** sair genérico, sem citar nada da tela. Significa que a imagem não chegou.

---

## Fase 3 — Plan (valida regressão + correção C)

**Rodar:** botão `2 Plan`

| Verificar | Esperado | Resultado |
|---|---|---|
| Tem "Etapa 0 — Levantamento do Projeto Real" | Sim, com caminhos reais | |
| Os arquivos citados existem mesmo | Conferir um por um — nada inventado | |
| Reconhece NgModule | Diz que é módulo legado e **não** propõe migrar | |
| Não repete o erro da Constitution | Não manda criar `app.config.ts` | |

**Falha se:** propuser pasta nova do zero (tipo `src/app/jornada-abertura/`) em vez de reusar o que existe.

---

## Fase 4 — Tasks

**Rodar:** botão `3 Tasks`

| Verificar | Esperado | Resultado |
|---|---|---|
| Existe tarefa para o card | Uma tarefa explícita de implementar o card/modal | |
| O critério de conclusão cita o mockup | Algo como "conforme mockup" | |
| Reusa componentes existentes | Cita `modal.component`, `erro.component` | |
| Impactos sistêmicos honestos | Ou lista arquivos reais, ou escreve "nenhum impacto" | |

**Falha se:** nenhuma tarefa mencionar a tela. Foi o que aconteceu nas rodadas 1 e 2.

---

## Fase 5 — Implement (valida B e C)

**Rodar:** `/foursys.implementSession1` e depois `Session2`

### C — Persona

| Verificar | Esperado | Resultado |
|---|---|---|
| A instrução pede para invocar a skill | Deve aparecer "invoque a Skill: /agente-angular-foursys" | |
| O Copilot resolve a skill | Se não resolver, a tag aparece mas nada carrega — inofensivo, porém inútil | |
| Respeita NgModule | Declara o componente no módulo existente, **não** cria standalone solto nem reclama do módulo | |
| Não usa `httpResource()` | A versão efetiva é 17 — se aparecer, a correção da persona falhou | |

### B — Cobertura

| Verificar | Esperado | Resultado |
|---|---|---|
| A tarefa de evidência **não** inventa número | Deve trazer o aviso: *"Nenhum relatório de cobertura legível encontrado... NÃO afirme percentual"* | |
| A tarefa fica `[ ]` | Não pode marcar como concluída sem ter medido | |
| O relatório declara o bloqueio | Seção de pendências deve dizer que a suíte não rodou | |

**Falha se:** aparecer qualquer percentual de cobertura. Sem `npm install`, não existe medição possível — qualquer número é invenção.

---

## Regressão do Java — não rodar agora

O fluxo Java foi validado em 18/08 e **não deve ser tocado**. As três correções desta rodada têm bloqueio de stack:

- `lerCoberturaJs` só é chamado para `angular`/`node`
- A guarda da persona exclui `spring_boot`
- O `AGENTE_SPRING_FOURSYS.md` não está no `.vsix`

Diff das correções: **145 inserções, zero remoções**. Nenhuma linha existente alterada.

Se algum dia quiser confirmar na prática, basta rodar a história do boleto com CPF no Kit e conferir que a linha `**Cobertura medida:**` continua saindo preenchida.

---

## Defeitos conhecidos que NÃO estão neste escopo

| Item | Situação |
|---|---|
| Constitution afirma `app.config.ts` / Vitest | Item 3 e 4 — mapeados, não corrigidos |
| Instruction instalada é a de vertical-slice | Diz "NgModule é proibido" num projeto NgModule |
| Design System não chega nas fases | `prompt-context.ts` não lê `activeDesignSystem` |
| Documento gerado sai com cerca ```` ```markdown ```` | Cosmético |
| `npm install` bloqueado | `rolldown` ausente no Nexus + lib do banco presa no Angular 17 |
