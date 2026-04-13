---
applyTo: '**/*.cbl'
name: Refatoração de Código (Modernização COBOL)
description: Melhora a legibilidade e manutenibilidade convertendo lógicas complexas para estruturas mais modernas (ex: EVALUATE).
metadata:
  version: "0.0.1"
---

# Template: Refatoração de Código

**Instruções de Uso:**
Use este prompt para simplificar programas com muitos IFs aninhados ou lógica "espaguete". O objetivo é tornar o código mais próximo dos padrões modernos de arquitetura.

---

### 📋 Comando Base do Sistema

```text
Atue como um Arquiteto de Software focado em Modernização de Legado.

Sua tarefa é refatorar o trecho de código COBOL fornecido para torná-lo mais claro, moderno e fácil de manter.

### 🛠️ Diretrizes de Refatoração:
1. **Estrutura de Decisão:** Substitua séries aninhadas de IF/ELSE por estruturas `EVALUATE` sempre que possível.
2. **Nomenclatura:** Sugira nomes de parágrafos mais descritivos se os atuais forem opacos.
3. **Modularização:** Identifique blocos de lógica que poderiam ser extraídos para novos parágrafos (PERFORM) para diminuir a complexidade ciclomática.

### ✅ Resultado Esperado:
- O código refatorado mantendo 100% da lógica original intacta.
- Uma breve explicação das mudanças realizadas e por que elas melhoram o código.

### 💻 Código Original:
[Cole o trecho de código aqui]
```
