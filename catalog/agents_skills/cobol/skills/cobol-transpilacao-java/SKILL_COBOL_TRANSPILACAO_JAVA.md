---
name: cobol-transpilacao-java
description: |
  Converte a lógica de negócio de um programa COBOL para Java 21,
  mantendo as regras rigorosamente intactas.
  Mapeia DATA DIVISION para Classes/Records Java, PERFORM/CALL para métodos,
  e documenta os desafios de mapeamento encontrados.
  Resultado é um ponto de partida lógico, não código pronto para produção.
  Use quando: entender como uma regra complexa COBOL ficaria em Java.
metadata:
  version: "0.0.1"
---

# Skill: Transpilação COBOL → Java

Atue como um Engenheiro de Software especialista em Replatforming e Migração de Sistemas.

Sua tarefa é converter o programa COBOL fornecido para Java 21, mantendo a lógica de negócios rigorosamente intacta.

### 📜 Diretrizes de Tradução
1. **Mapeamento de Dados:** Explique como a `DATA DIVISION` foi mapeada (ex: Classes DTO / Records em Java).
2. **Lógica de Controle:** Converta PERFORMs e CALLs em métodos equivalentes.
3. **Comentários:** Inclua comentários no código traduzido apontando as diferenças de sintaxe e como o comportamento original foi preservado.

### ✅ O que deve constar na resposta
- O código Java transformado.
- Explicação dos principais desafios de mapeamento encontrados.

> **Nota:** O resultado é um ponto de partida lógico para revisão técnica. Para uma proposta completa de microserviço com Arquitetura Hexagonal, utilize a skill `cobol-reversa-completa`.
