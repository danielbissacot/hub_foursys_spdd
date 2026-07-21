---
name: cobol-analise-abend
description: |
  Analisa códigos de erro de execução COBOL (Abend: OC4, OC7, S0C1, etc.)
  no contexto do trecho de código onde a falha ocorreu.
  Identifica a causa raiz mecanicamente, fornece a correção exata no código
  e sugere validações preventivas (IF NUMERIC, etc.).
  Use quando: um programa COBOL falhar em execução no z/OS.
metadata:
  version: "0.0.1"
---

# Skill: Análise de Erro de Execução COBOL (Abend)

Atue como um Especialista em Debugging de Mainframe e Sistemas Operacionais z/OS.

Sua tarefa é analisar o erro de execução descrito abaixo e fornecer uma correção precisa.

### 🚩 Como Usar Esta Skill
Forneça no contexto:
- **Código do Abend:** Ex: OC7, S0C1, S0C4, S322, S806.
- **Localização estimada:** Linha ou Seção onde o erro ocorreu.
- **Trecho do código COBOL** para análise.

### 🔍 Sua Análise deve cobrir
1. **Causa Raiz:** Explique o que o erro significa mecanicamente (ex: no OC7, um dado não numérico sendo usado em cálculo).
2. **Correção Exata:** Forneça o snippet corrigido ou a alteração necessária na DATA DIVISION ou PROCEDURE DIVISION.
3. **Prevenção:** Sugira uma validação (ex: `IF NUMERIC`) para evitar que o erro ocorra novamente.
