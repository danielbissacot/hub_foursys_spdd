---
name: cobol-transpilacao-java
description: |
  Converte a lógica de negócio de um programa COBOL para Java,
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

Sua tarefa é converter o programa COBOL fornecido para Java, mantendo a lógica de negócios rigorosamente intacta.

### 📜 Diretrizes de Tradução
1. **Mapeamento de Dados:** Explique como a `DATA DIVISION` foi mapeada (ex: Classes DTO / Records em Java). `record` exige Java 16+ e `sealed` exige 17 — se você não confirmou a versão do Java do projeto-alvo, use classe comum e sinalize "trocar por record se o projeto for Java 16+".
2. **Precisão numérica:** campo `COMP-3` ou `PIC ...V...` que represente valor monetário vira `BigDecimal`, NUNCA `double`/`float`. Preserve a escala (casas decimais) do PIC original. `PIC S9(n)` sem decimais e sem sinal de dinheiro pode virar `int`/`long` conforme o tamanho.
3. **Lógica de Controle:** Converta PERFORMs e CALLs em métodos equivalentes.
4. **Nomenclatura:** classe/método/campo que represente conceito de negócio usa o termo em português da regra extraída — ex.: `calcularJuros`, não `calculateInterest`. Sufixos técnicos (Dto, Service, UseCase) continuam em inglês.
5. **Comentários:** Inclua comentários no código traduzido apontando as diferenças de sintaxe e como o comportamento original foi preservado.

### ✅ O que deve constar na resposta
- O código Java transformado.
- Explicação dos principais desafios de mapeamento encontrados.

> **Nota:** O resultado é um ponto de partida lógico para revisão técnica. Para uma proposta completa de microserviço com Arquitetura Hexagonal, utilize a skill `cobol-reversa-completa`.
