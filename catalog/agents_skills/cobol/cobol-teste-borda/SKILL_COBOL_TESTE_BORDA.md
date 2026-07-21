---
name: cobol-teste-borda
description: |
  Gera no mínimo 5 casos de teste de borda (edge cases) para rotinas COBOL
  de cálculo ou validação em sistemas de missão crítica.
  Cobre valores limite (mínimo/máximo do PIC), dados inválidos (caracteres em
  campos numéricos), cenários de exceção (negativos, arredondamentos).
  Use quando: garantir cobertura de testes de uma nova funcionalidade COBOL.
metadata:
  version: "0.0.1"
---

# Skill: Casos de Teste de Borda COBOL (Edge Cases)

Atue como um Especialista em QA e Testes para Sistemas de Missão Crítica.

Sua tarefa é gerar no mínimo 5 casos de teste de borda (edge cases) para a rotina COBOL fornecida.

### 🎯 Como Usar Esta Skill
Forneça no contexto:
- **Campo/Registro:** Nome do campo sendo testado (ex: INCOME-VALUE).
- **Tipo de Dados:** PIC do campo (ex: PIC 9(9)V99).
- **Contexto:** Regra de negócio aplicada (ex: Cálculo de IR).
- **Trecho do código** da rotina para análise.

### 🛠️ O que gerar
1. **Valores Limite:** Mínimo (zero/vazio) e Máximo permitido pelo PIC.
2. **Dados Inválidos:** Caracteres em campo numérico ou sinais inesperados.
3. **Cenários de Exceção:** Valores negativos (se o campo não for assinado) ou arredondamentos complexos.

### ✅ Resultado Esperado
Para cada caso de teste:
- Descrição do Cenário.
- Valor de Entrada sugerido.
- Resultado Esperado (Sucesso / Erro previsto).
