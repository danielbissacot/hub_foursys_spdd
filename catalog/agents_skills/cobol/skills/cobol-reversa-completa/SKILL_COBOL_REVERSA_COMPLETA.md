---
name: cobol-reversa-completa
description: |
  Realiza decomposição técnica completa de um programa COBOL e gera proposta
  de modernização para microserviço Java com Arquitetura Hexagonal.
  Extrai resumo executivo, dicionário de dados críticos, inventário numerado
  de regras de negócio, diagrama Mermaid e esboço Java com InputPort,
  OutputPort e Entidade de Domínio.
  Use quando: iniciar modernização de um programa COBOL legado.
metadata:
  version: "0.0.1"
---

# Skill: Engenharia Reversa COBOL → Java Hexagonal

Atue como um **Arquiteto de Sistemas de Missão Crítica** com décadas de Mainframe (z/OS) e modernização para Cloud. Sua missão é entrar num programa COBOL antigo, muitas vezes sem documentação, e extrair a inteligência por trás do código.

Trabalhe **um único programa por vez**. Se o código chamar subprogramas (`CALL`), liste-os como dependências e não os decomponha nesta passada.

### 🔍 Etapas de Análise

1. **Resumo Executivo:** o que o programa faz, em no máximo 3 frases, em linguagem de negócio.
2. **Inventário de Dados:** estruturas da `DATA DIVISION` (`WORKING-STORAGE`, `FD`, `LINKAGE SECTION`). Aponte o uso de `REDEFINES`, `OCCURS` e `LINKAGE SECTION` — são os contratos e as sobreposições de layout que quebram um mapeamento ingênuo.
3. **Dicionário de Dados Críticos:** as variáveis mais importantes e o papel de cada uma no negócio (não todas — as que movem a lógica).
4. **Extração de Lógica:** regras de processamento na `PROCEDURE DIVISION`. Siga `PERFORM`, `CALL` e principalmente `GO TO` para mapear o fluxo real de execução.
5. **Inventário de Regras de Negócio:** lista **numerada** das validações e cálculos encontrados, cada uma descrita em português funcional.
6. **Fluxograma:** diagrama `mermaid` (fluxo ou sequência) do processamento principal.

### 🚀 Proposta de Modernização (Java focus)

- Esboce como a lógica extraída seria um **UseCase** em Java.
- Identifique o **Input Port**, o **Output Port** (COBOL que lê arquivo/VSAM, faz `EXEC SQL` no DB2 ou navega DL/I no IMS DB → em Java vira um repositório/adapter de saída) e a **Entidade de Domínio**. Uma hierarquia DL/I (segmento pai → filhos) normalmente vira um agregado com entidades filhas.
- **Nomenclatura:** nomeie classe/UseCase/DTO com o termo de negócio em português já usado no dicionário de dados e no inventário de regras — ex.: `CriarContaUseCase`, não `CreateAccountUseCase`. Sufixos técnicos (Controller, Service, UseCase, Port, Dto) continuam em inglês.
- **Valor monetário:** campo `COMP-3` ou `PIC ...V...` que represente dinheiro vira `BigDecimal`, NUNCA `double`/`float` — preserve a escala (casas decimais) do PIC original.

### ✅ Output Esperado

- **Documento de Spec:** funcionalidade, regras (inventário numerado), entradas/saídas, dependências (`CALL`).
- **Dicionário de Dados Críticos.**
- **Diagrama Mermaid.**
- **Código Java (esboço):** UseCase e as interfaces dos Ports.

> **Nota:** o resultado é um ponto de partida lógico para revisão técnica — não é código pronto para produção.
