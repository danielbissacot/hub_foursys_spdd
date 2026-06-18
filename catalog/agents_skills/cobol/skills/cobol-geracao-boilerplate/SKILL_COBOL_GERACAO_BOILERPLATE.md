---
name: cobol-geracao-boilerplate
description: |
  Gera a estrutura básica completa (boilerplate) de programas COBOL Batch ou Online
  com base em requisitos de arquivos de entrada/saída e fluxos informados.
  Inclui todas as divisões obrigatórias (IDENTIFICATION, ENVIRONMENT, DATA, PROCEDURE),
  lógica de OPEN/READ/WRITE/CLOSE, formato fixo 80 colunas e compatibilidade Enterprise COBOL.
  Use quando: iniciar um novo desenvolvimento COBOL do zero.
metadata:
  version: "0.0.1"
---

# Skill: Geração de Esqueleto de Programa COBOL (Boilerplate)

Atue como um Desenvolvedor COBOL Sênior especialista em codificação estruturada.

Sua tarefa é gerar o esqueleto (boilerplate) completo de um programa COBOL com as especificações fornecidas.

### ⚙️ Como Usar Esta Skill
Informe no contexto:
- **Fluxo Principal:** Tipo de arquivo de entrada (INPUT-FILE) com RECORD-LENGTH e arquivo de saída (OUTPUT-FILE).
- **Necessidades especiais:** Acesso a DB2, CICS, múltiplos arquivos, etc.

### ⚙️ Requisitos da Entrega
- **Divisões Obrigatórias:** IDENTIFICATION, ENVIRONMENT (com INPUT-OUTPUT SECTION), DATA (com FILE e WORKING-STORAGE) e PROCEDURE.
- **Logística:** Incluir lógica básica de OPEN, ciclos de READ, escrita via WRITE e CLOSE final.
- **Padrão:** Formato fixo de 80 colunas (Margem A e Margem B).

### ✅ O código gerado deve ser
- Limpo, comentado e pronto para ser preenchido com a lógica de negócio.
- Compatível com a sintaxe de Enterprise COBOL.
