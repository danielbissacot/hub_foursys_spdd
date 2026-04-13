---
applyTo: '**/*.cbl, **/*.ccp'
name: Análise de Erro de Execução (Abend)
description: Analisa códigos de erro (OC4, OC7, etc.) e sugere correções baseadas no contexto do código COBOL.
metadata:
  version: "0.0.1"
---

# Template: Análise de Erro de Execução (Abend)

**Instruções de Uso:**
Use este prompt quando um programa falhar em execução. Forneça o código do erro (Abend Code) e o trecho de código onde a falha ocorreu.

---

### 📋 Comando Base do Sistema

```text
Atue como um Especialista em Debugging de Mainframe e Sistemas Operacionais z/OS.

Sua tarefa é analisar o erro de execução descrito abaixo e fornecer uma correção precisa.

### 🚩 Contexto do Erro:
- **Código do Abend:** O programa está resultando em um [Código do Abend, ex: OC7].
- **Localização:** Linha ou Seção estimada: [Linha/Seção].

### 🔍 Sua Análise deve cobrir:
1. **Causa Raiz:** Explique o que o erro significa mecanicamente (ex: no OC7, um dado não numérico sendo usado em cálculo).
2. **Correção Exata:** Forneça o snippet corrigido ou a alteração necessária na DATA DIVISION ou PROCEDURE DIVISION.
3. **Prevenção:** Sugira uma validação (ex: IF NUMERIC) para evitar que o erro ocorra novamente.

### 💻 Código para Análise:
[Cole o trecho de código COBOL aqui]
```
