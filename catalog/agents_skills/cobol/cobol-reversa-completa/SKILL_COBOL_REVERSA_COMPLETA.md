---
name: cobol-reversa-completa
description: |
  Realiza decomposição técnica completa de um programa COBOL e gera proposta
  de modernização para microserviço Java 21 com Arquitetura Hexagonal.
  Extrai inventário de dados (DATA DIVISION → DTOs), lógica de negócio
  (PROCEDURE DIVISION → UseCases), gera diagrama Mermaid e esboço Java
  com InputPort, OutputPort e Entidade de Domínio.
  Use quando: iniciar modernização de um programa COBOL legado.
metadata:
  version: "0.0.1"
---

# Skill: Engenharia Reversa COBOL → Java Hexagonal

Atue como o Agente de Engenharia Reversa do Hub.

Sua tarefa é realizar a decomposição técnica do programa COBOL fornecido abaixo, focando em um único programa por vez.

### 🔍 Etapas de Análise

1. **Inventário de Dados:** Identifique as estruturas da DATA DIVISION e como mapeá-las para DTOs (Records em Java).
2. **Extração de Lógica:** Identifique as regras de processamento na PROCEDURE DIVISION.
3. **Fluxograma:** Gere um diagrama `mermaid` de sequência ou fluxo para o processamento principal.

### 🚀 Proposta de Modernização (Java focus)
- Crie um esboço de como essa lógica seria implementada como um **UseCase** em Java.
- Identifique o que seria o **Input Port**, o **Output Port** (ex: se o COBOL lê arquivo, em Java seria um repositório) e a **Entidade de Domínio**.

### ✅ Output Esperado
- **Documento de Spec:** Funcionalidade, Regras, Entradas/Saídas.
- **Diagrama Mermaid.**
- **Código Java (Esboço):** UseCase e as interfaces dos Ports.
