# 🏗️ Fase 5 — Modernização de Legado (COBOL / Mainframe)

Esta pasta centraliza os playbooks de governança para desenvolvimento e manutenção de sistemas Mainframe. O objetivo é que o desenvolvedor use o **Zowe Explorer** no VS Code e, com o contexto destes playbooks, capacite a IA a fazer intervenções seguras e padronizadas em COBOL, JCL e DB2.

> Estes playbooks são o par "Fase 5" das skills COBOL avulsas em `catalog/agents_skills/cobol/skills/`.
> O conteúdo é equivalente — muda a porta de entrada: aqui é o fluxo de modernização; lá é a chamada direta no chat do Copilot.

---

## 📂 Categorias e playbooks

### 1. [Compreensão e Documentação](./1_compreensao_documentacao)

"Traduzir" código legado em explicação lógica e documentação em português.

- `EXPLICA_LOGICA_VARIAVEIS.md` — analisa fluxo de controle e o propósito de variáveis num bloco COBOL.
- `FASE5_DOCUMENTA_COBOL.md` — adiciona comentários e gera resumo técnico (input / output / negócio).
- `FASE5_REVERSA_COMPLETA_COBOL.md` — engenharia reversa completa de um programa, com proposta de microsserviço Java Hexagonal.

### 2. [Depuração e Otimização](./2_depuracao_otimizacao)

- `ANALISE_ERRO_ABEND.md` — analisa códigos de erro (OC4, OC7, S0C7…) e sugere correção pelo contexto do código.
- `OTIMIZACAO_PERFORMANCE.md` — identifica gargalos em loops, acesso a tabelas e I/O (ex.: `SEARCH ALL`).

### 3. [Geração e Testes](./3_geracao_e_testes)

- `GERACAO_BOILERPLATE.md` — gera o esqueleto de um programa COBOL (batch ou online) a partir dos requisitos de arquivos e fluxos.
- `TESTE_DE_BORDA.md` — cria cenários de teste extremos para rotinas de cálculo/validação.

### 4. [Modernização e Integração](./4_modernizacao_integracao)

- `REFATORACAO_CODIGO.md` — melhora legibilidade/manutenibilidade (ex.: IF aninhado → `EVALUATE`), mantendo 100% da lógica.
- `TRANSPILACAO_LINGUAGEM.md` — traduz a lógica de negócio de COBOL para linguagem moderna (Java/Python) como ponto de partida.

### 5. [Ferramentas Mainframe / DB](./5_ferramentas_mainframe_db)

- `GERACAO_JCL.md` — cria JCL completo (compile, link-edit, execução) para z/OS.
- `GERACAO_SQL_EXEC.md` — gera sintaxe de acesso DB2 (`EXEC SQL … END-EXEC`) para embutir no programa.

---

## 📜 Como usar

Estes playbooks **não** são acionados pelo gatilho `#` (no Copilot Chat, `#` só referencia arquivo — `#file:` — e não invoca nada).

1. **Pela sidebar do Hub:** aba **Catálogo → PlayBooks**, clique no playbook. O Hub monta a chamada para você.
2. **Direto no chat:** `@foursys_sdd_po /playbook fase5_modernizacao_legado/<pasta>/<ARQUIVO>` — ex.:
   `@foursys_sdd_po /playbook fase5_modernizacao_legado/2_depuracao_otimizacao/ANALISE_ERRO_ABEND`

> [!TIP]
> Abra o fonte legado pelo Zowe, selecione o trecho relevante e chame o playbook — a seleção entra como contexto.
