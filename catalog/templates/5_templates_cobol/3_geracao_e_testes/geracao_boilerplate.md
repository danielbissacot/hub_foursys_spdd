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
- **Fluxo Principal:** Ler de um [INPUT-FILE] com RECORD-LENGTH [XX] e gravar em um [OUTPUT-FILE] com RECORD-LENGTH [YY].
- **Divisões Obrigatórias:** IDENTIFICATION, ENVIRONMENT (com INPUT-OUTPUT SECTION), DATA (com FILE e WORKING-STORAGE) e PROCEDURE.
- **Logística:** Incluir lógica básica de OPEN, ciclos de READ, escrita via WRITE e CLOSE final.
- **Padrão:** Use o formato fixo de 80 colunas (Margem A e Margem B).

### ✅ O código gerado deve ser:
- Limpo, comentado e pronto para ser preenchido com a lógica de negócio.
- Compatível com a sintaxe de Enterprise COBOL.

### 💻 Especificações Adicionais:
[Adicione aqui outros detalhes, como acesso a DB2 ou CICS se necessário]
```
