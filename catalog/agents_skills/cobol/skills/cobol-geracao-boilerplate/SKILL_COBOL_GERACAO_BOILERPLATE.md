---
name: cobol-geracao-boilerplate
description: |
  Gera a estrutura básica completa (boilerplate) de programas COBOL Batch, online CICS
  ou online IMS/DC, com base em requisitos de arquivos de entrada/saída e fluxos informados.
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
- **Nome do programa e prefixo/sistema:** siga a convenção real do projeto — confira o **MAPA REAL DO PROJETO** e os `PROGRAM-ID` existentes. Não foi informado? Registre como pendência; não invente nome.
- **Tipo de programa:** batch, online CICS ou online IMS/DC. Não informado → gere batch e marque a suposição.
- **Fluxo Principal:** arquivo de entrada (ex: `ARQ-ENTRADA`) com RECORD-LENGTH e arquivo de saída (ex: `ARQ-SAIDA`).
- **Necessidades especiais:** acesso a DB2 (`EXEC SQL`), IMS DB / DL-I (`CALL 'CBLTDLI'`), CICS, IMS/DC, múltiplos arquivos, etc.

### ⚙️ Requisitos da Entrega
- **Divisões Obrigatórias:** IDENTIFICATION, ENVIRONMENT (com INPUT-OUTPUT SECTION), DATA (com FILE e WORKING-STORAGE) e PROCEDURE.
- **Esqueleto conforme o tipo:**
  - *Batch*: `OPEN` → ciclo de `READ` (com checagem de `FILE STATUS`) → `WRITE` → `CLOSE`.
  - *Online CICS*: `PROCEDURE DIVISION` sem `STOP RUN` (usa `EXEC CICS RETURN`), `DFHCOMMAREA` na LINKAGE, esqueleto de `EXEC CICS SEND/RECEIVE MAP`.
  - *Online IMS/DC*: `ENTRY 'DLITCBL' USING <io-pcb> <alt-pcb>...`, PCBs na LINKAGE, laço `GU`/`GN` no IO-PCB, `GOBACK` (não `STOP RUN`).
  - **Nunca misture `EXEC CICS` e `CALL 'CBLTDLI'` para TP no mesmo programa.**
- **Nomenclatura:** data-names de conceito de negócio em português (`WS-CONTA`, não `WS-ACCOUNT`), no limite de 8 caracteres úteis do mainframe.
- **Padrão:** Formato fixo de 80 colunas (Margem A e Margem B).

### ✅ O código gerado deve ser
- Limpo, comentado e pronto para ser preenchido com a lógica de negócio.
- Compatível com a sintaxe de Enterprise COBOL.
- Sem `DISPLAY` de campo que possa carregar dado sensível (CPF, conta, cartão) — o esqueleto não expõe PII.
