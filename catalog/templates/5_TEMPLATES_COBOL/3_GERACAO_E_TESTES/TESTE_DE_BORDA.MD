---
applyTo: '**/*.cbl, **/*.cpy'
name: Geração de Casos de Teste de Borda (Edge Cases)
description: Cria cenários de teste extremos para validar a robustez de rotinas de cálculo ou validação em COBOL.
metadata:
  version: "0.0.1"
---

# Template: Geração de Casos de Teste de Borda

**Instruções de Uso:**
Use este prompt para garantir a cobertura de testes de uma nova funcionalidade. Descreva o campo ou registro que está sendo processado.

---

### 📋 Comando Base do Sistema

```text
Atue como um Especialista em QA e Testes para Sistemas de Missão Crítica.

Sua tarefa é gerar no mínimo 5 casos de teste de borda (edge cases) para a rotina COBOL fornecida.

### 🎯 Alvo da Análise:
- **Campo/Registro:** [Nome do Campo, ex: INCOME-VALUE].
- **Tipo Dados:** [PIC, ex: PIC 9(9)V99].
- **Contexto:** [Regra de negócio, ex: Cálculo de IR].

### 🛠️ O que gerar:
1. **Valores Limite:** Mínimo (zero/vazio) e Máximo permitido pelo PIC.
2. **Dados Inválidos:** Caracteres em campo numérico ou sinais inesperados.
3. **Cenários de Exceção:** Valores negativos (se o campo não for assinado) ou arredondamentos complexos.

### ✅ Resultado Esperado:
- Descrição do Cenário.
- Valor de Entrada sugerido.
- Resultado Esperado (Sucesso/Erro previsto).

### 💻 Código da Rotina:
[Cole o trecho de código aqui]
```
