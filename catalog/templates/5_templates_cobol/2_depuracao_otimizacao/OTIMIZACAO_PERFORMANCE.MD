---
applyTo: '**/*.cbl'
name: Otimização de Performance (COBOL)
description: Identifica gargalos em loops, acessos a tabelas e I/O, sugerindo alternativas mais eficientes (ex: SEARCH ALL).
metadata:
  version: "0.0.1"
---

# Template: Otimização de Performance

**Instruções de Uso:**
Use este prompt para revisar rotinas críticas e intensivas em processamento. Foque em trechos com loops aninhados ou buscas em tabelas internas.

---

### 📋 Comando Base do Sistema

```text
Atue como um Especialista em Performance Tuning de Mainframe.

Sua tarefa é analisar o loop ou rotina COBOL abaixo e sugerir melhorias de performance significativas.

### 🚀 Áreas de Foco:
1. **Manipulação de Tabelas:** Verifique se um `SEARCH ALL` (busca binária) deve ser usado em vez de um `SEARCH` sequencial.
2. **Uso de I/O:** Identifique se há acessos excessivos a arquivos ou DB2 dentro de loops que poderiam ser otimizados (ex: uso de buffers ou cursores).
3. **Estrutura de Controle:** Sugira o uso de `PERFORM` mais eficientes ou remoção de lógicas redundantes.

### ✅ Resultado Esperado:
- Identificação do ponto de ineficiência.
- Explicação do ganho de performance estimado.
- Código sugerido com a otimização aplicada.

### 💻 Código para Otimização:
[Cole o trecho de código COBOL aqui]
```
