---
applyTo: '**/*.cbl,**/*.cpy'
name: Geração de SQL Embarcado (EXEC SQL)
description: Cria a sintaxe de acesso a dados DB2 (SELECT, INSERT, CURSOR) para ser embutida em programas COBOL.
metadata:
  version: "0.0.1"
---

# Template: Geração de SQL Embarcado

**Instruções de Uso:**
Use este prompt para quando o programa precisar interagir com tabelas DB2. Defina as colunas e a tabela alvo.

---

### 📋 Comando Base do Sistema

```text
Atue como um Especialista em Bancos de Dados Relacionais e DB2 para Mainframe.

Sua tarefa é gerar o código SQL embarcado (`EXEC SQL`) necessário para a operação abaixo:

### ⚙️ Especificação Técnica:
- **Operação:** [SELECT / INSERT / UPDATE / CURSOR].
- **Tabela:** [Nome da Tabela, ex: `EMPREGADOS`].
- **Colunas Alvo:** só as necessárias (nunca `SELECT *`).
- **Variáveis Host:** conceito de negócio em português [ex: `WS-NOME-EMP`, `WS-SAL-EMP`].

### 🛠️ Requisitos de Geração:
1. **Sintaxe:** Incluir os delimitadores `EXEC SQL` e `END-EXEC`.
2. **Tratamento de Erro:** verificar o `SQLCODE` após cada execução. Em erro, registre `SQLCODE`/tabela/operação — nunca o conteúdo das host variables (CPF, conta, salário) no log. `SQLCODE = +100` é fluxo, não erro.
3. **Cursores:** Se for solicitado múltiplos registros, gere o `DECLARE`, `OPEN`, `FETCH` e `CLOSE`.
4. **Precisão:** coluna monetária/decimal → host variable `COMP-3` com a mesma escala da tabela; nunca ponto flutuante.

### ✅ Resultado Esperado:
- O bloco SQL pronto para ser copiado para a PROCEDURE DIVISION.
- Definição das variáveis Host necessárias para a WORKING-STORAGE (DCLGEN style).
```
