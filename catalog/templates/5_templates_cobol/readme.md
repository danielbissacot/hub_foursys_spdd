# 🏗️ Templates e Prompts COBOL (Fase 5)

Esta pasta centraliza os ativos de governança para o desenvolvimento e manutenção de sistemas Mainframe. O objetivo é permitir que o desenvolvedor utilize o **Zowe Explorer** no VS Code e, através do contexto destes templates, capacite a IA a realizar intervenções seguras e padronizadas.

---

### 📂 Categorias e Prompts:

#### 1. [Compreensão e Documentação](./1_compreensao_documentacao)
Prompts para "traduzir" código legado em explicações lógicas e documentação comentada em português.
- `EXPLICA_LOGICA_VARIAVEIS.MD`
- `DOCUMENTACAO_COMENTARIOS.MD`

#### 2. [Depuração e Otimização](./2_depuracao_otimizacao)
Focado em identificar causas de Abends (ex: OC7, OC4) e sugerir melhorias de performance (ex: uso de SEARCH ALL).
- `ANALISE_ERRO_ABEND.MD`
- `OTIMIZACAO_PERFORMANCE.MD`

#### 3. [Geração de Código e Testes](./3_geracao_e_testes)
Geração de esqueletos (Boilerplate) de programas Batch/Online e criação de casos de teste de borda.
- `GERACAO_BOILERPLATE.MD`
- `TESTE_DE_BORDA.MD`

#### 4. [Modernização e Integração](./4_modernizacao_integracao)
Refatoração de lógicas complexas (EVALUATE) e transpilação de lógica de negócio para linguagens modernas (Java/Python).
- `REFATORACAO_CODIGO.MD`
- `TRANSPILACAO_LINGUAGEM.MD`

#### 5. [Ferramentas de Mainframe e DB](./5_ferramentas_mainframe_db)
Geração de scripts JCL para execução/compilação e blocos de SQL Embarcado (EXEC SQL) para DB2.
- `GERACAO_JCL.MD`
- `GERACAO_SQL_EXEC.MD`

---

### 📜 Esqueletos de Código:
- **`PROGRAMA_BATCH_BASE.CBL`**: Template de estrutura COBOL Batch padrão.

---
> [!TIP]
> **Dica de Uso:** No VS Code, abra seu arquivo via Zowe, selecione o código e chame o prompt desejado no Chat da IA (ex: `@ANALISE_ERRO_ABEND`).
