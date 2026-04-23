---
applyTo: '**/*.cbl, **/*.ccp'
name: Engenharia Reversa de COBOL para Java (Hexagonal)
description: Extração profunda de lógica de negócio e geração de proposta de modernização para Microserviço Java.
metadata:
  version: "0.0.1"
---

# Template: Engenharia Reversa Completa

**Instruções de Uso:**
Use este prompt para analisar um programa COBOL legado por completo. Ele irá gerar uma especificação técnica e uma proposta de como esse código seria escrito em **Java 21 com Arquitetura Hexagonal**.

---

### 📋 Comando Base do Sistema

```text
Atue como o Agente de Engenharia Reversa do Hub.

Sua tarefa é realizar a decomposição técnica do programa COBOL fornecido abaixo, focando em um único programa por vez.

### 🔍 Etapas de Análise:
1. **Inventário de Dados:** Identifique as estruturas da DATA DIVISION e como mapeá-las para DTOs (Records em Java).
2. **Extração de Lógica:** Identifique as regras de processamento na PROCEDURE DIVISION.
3. **Fluxograma:** Gere um diagrama `mermaid` de sequência ou fluxo para o processamento principal.

### 🚀 Proposta de Modernização (Java focus):
- Crie um esboço de como essa lógica seria implementada como um **UseCase** em Java.
- Identifique o que seria o **Input Port**, o **Output Port** (ex: se o COBOL lê arquivo, em Java seria um repositório) e a **Entidade de Domínio**.

### ✅ Output Esperado:
- **Documento de Spec:** Funcionalidade, Regras, Entradas/Saídas.
- **Diagrama Mermaid.**
- **Código Java (Esboço):** UseCase e as interfaces dos Ports.

### 💻 Código COBOL para Reversa:
[Cole o código aqui]
```
