---
applyTo: '**/*.cbl'
name: Geração de Esqueleto de Programa (Boilerplate)
description: Gera a estrutura básica de programas COBOL (Batch ou Online) baseada em requisitos de arquivos e fluxos.
metadata:
  version: "0.0.1"
---

# Template: Geração de Esqueleto de Programa

**Instruções de Uso:**
Use este prompt para iniciar um novo desenvolvimento. Forneça o comprimento dos registros e os nomes dos arquivos lógicos.

---

### 📋 Comando Base do Sistema

```text
Atue como um Desenvolvedor COBOL Sênior especialista em codificação estruturada.

Sua tarefa é gerar o esqueleto (boilerplate) completo de um programa COBOL com as seguintes especificações:

### ⚙️ Requisitos da Entrega:
- **Nome e prefixo:** siga a convenção real do projeto (MAPA REAL DO PROJETO / `PROGRAM-ID` existentes). Não informado? Registre como pendência; não invente.
- **Tipo de programa:** batch, online CICS ou online IMS/DC. Não informado → batch, marcando a suposição.
- **Fluxo Principal:** Ler de um [`ARQ-ENTRADA`] com RECORD-LENGTH [XX] e gravar em um [`ARQ-SAIDA`] com RECORD-LENGTH [YY].
- **Divisões Obrigatórias:** IDENTIFICATION, ENVIRONMENT (com INPUT-OUTPUT SECTION), DATA (com FILE e WORKING-STORAGE) e PROCEDURE.
- **Esqueleto conforme o tipo:** Batch = `OPEN`→`READ`(com `FILE STATUS`)→`WRITE`→`CLOSE`. CICS = `DFHCOMMAREA` na LINKAGE, `EXEC CICS SEND/RECEIVE MAP`, `EXEC CICS RETURN` (sem `STOP RUN`). IMS/DC = `ENTRY 'DLITCBL' USING` os PCBs, PCBs na LINKAGE, `GU`/`GN` no IO-PCB, `GOBACK`. Nunca `EXEC CICS` + `CALL 'CBLTDLI'` juntos para TP.
- **Nomenclatura:** data-names de negócio em português (`WS-CONTA`, não `WS-ACCOUNT`), no limite de 8 caracteres úteis.
- **Padrão:** Use o formato fixo de 80 colunas (Margem A e Margem B).

### ✅ O código gerado deve ser:
- Limpo, comentado e pronto para ser preenchido com a lógica de negócio.
- Compatível com a sintaxe de Enterprise COBOL.
- Sem `DISPLAY` de campo que possa carregar dado sensível — o esqueleto não expõe PII.

### 💻 Especificações Adicionais:
[Adicione aqui outros detalhes, como acesso a DB2 ou CICS se necessário]
```
