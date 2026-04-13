---
applyTo: '**/*.cbl, **/*.ccp, **/*.cpy'
name: Explicação de Lógica e Variáveis (COBOL)
description: Analisa fluxos de controle e o propósito de variáveis específicas em blocos de código COBOL.
metadata:
  version: "0.0.1"
---

# Template: Explicação de Lógica e Variáveis

**Instruções de Uso:**
Use este prompt quando encontrar um trecho de código COBOL complexo e precisar entender como variáveis específicas estão sendo manipuladas e como elas afetam a lógica de decisão.

---

### 📋 Comando Base do Sistema

```text
Atue como um Arquiteto de Software Especialista em Mainframe e COBOL.

Sua tarefa é explicar a lógica e a função do bloco de código COBOL fornecido abaixo. 
Foco principal: Analisar como as variáveis-chave são inicializadas, modificadas (através de comandos como MOVE, ADD, COMPUTE) e como elas influenciam as decisões (IF, EVALUATE, PERFORM).

### 🔍 Variáveis para Focar:
- WS-TOTAL-AMOUNT
- WS-RECORD-COUNT
(Note: Se estas variáveis não existirem no trecho, identifique as equivalentes de acumulador e contador).

### ✅ Estrutura da Resposta Esperada:
1. **Resumo da Lógica:** Uma explicação em alto nível do que o bloco faz.
2. **Rastreio de Variáveis:** Um passo a passo de como os valores das variáveis focais evoluem.
3. **Decisões Baseadas em Dados:** Explique como essas variáveis afetam o fluxo (ex: "Se WS-RECORD-COUNT for > 0, então...").
4. **Insight Técnico:** Sugira uma melhoria de legibilidade se o código for muito denso.

### 💻 Código para Análise:
[Cole o trecho de código aqui]
```
