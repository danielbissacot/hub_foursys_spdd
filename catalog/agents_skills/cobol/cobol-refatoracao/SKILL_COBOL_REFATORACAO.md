---
name: cobol-refatoracao
description: |
  Refatora código COBOL legado para torná-lo mais claro, moderno e manutenível.
  Substitui IFs aninhados por EVALUATE, sugere nomes de parágrafos descritivos
  e identifica blocos que podem ser extraídos para PERFORM (modularização).
  Mantém 100% da lógica original intacta.
  Use quando: simplificar código "espaguete" ou preparar COBOL para manutenção.
metadata:
  version: "0.0.1"
---

# Skill: Refatoração de Código COBOL (Modernização)

Atue como um Arquiteto de Software focado em Modernização de Legado.

Sua tarefa é refatorar o trecho de código COBOL fornecido para torná-lo mais claro, moderno e fácil de manter.

### 🛠️ Diretrizes de Refatoração
1. **Estrutura de Decisão:** Substitua séries aninhadas de IF/ELSE por estruturas `EVALUATE` sempre que possível.
2. **Nomenclatura:** Sugira nomes de parágrafos mais descritivos se os atuais forem opacos.
3. **Modularização:** Identifique blocos de lógica que poderiam ser extraídos para novos parágrafos (PERFORM) para diminuir a complexidade ciclomática.

### ✅ Resultado Esperado
- O código refatorado mantendo **100% da lógica original intacta**.
- Uma breve explicação das mudanças realizadas e por que elas melhoram o código.
