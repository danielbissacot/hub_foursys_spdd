---
name: cobol-geracao-sql-exec
description: |
  Gera código SQL embarcado (EXEC SQL / END-EXEC) para acesso a dados DB2
  em programas COBOL: SELECT, INSERT, UPDATE, CURSOR com FETCH/CLOSE.
  Inclui verificação de SQLCODE após execução, declaração de variáveis Host
  na WORKING-STORAGE (estilo DCLGEN) e tratamento de múltiplos registros com CURSOR.
  Use quando: o programa precisar interagir com tabelas DB2.
metadata:
  version: "0.0.1"
---

# Skill: Geração de SQL Embarcado COBOL (EXEC SQL / DB2)

Atue como um Especialista em Bancos de Dados Relacionais e DB2 para Mainframe.

Sua tarefa é gerar o código SQL embarcado (`EXEC SQL`) necessário para a operação descrita.

### ⚙️ Como Usar Esta Skill
Informe no contexto:
- **Operação:** SELECT / INSERT / UPDATE / CURSOR.
- **Tabela:** Nome da tabela alvo (ex: `EMPREGADOS`).
- **Colunas Alvo:** só as colunas realmente necessárias (nunca `SELECT *` — traz coluna sensível à toa e quebra ao mudar o layout da tabela).
- **Variáveis Host:** nomes das variáveis COBOL, com conceito de negócio em português (ex: `WS-NOME-EMP`, `WS-SAL-EMP`).

### 🛠️ Requisitos de Geração
1. **Sintaxe:** Incluir os delimitadores `EXEC SQL` e `END-EXEC`.
2. **Tratamento de Erro:** verificar o `SQLCODE` logo após cada execução. Em erro, registre `SQLCODE`, tabela e operação — **nunca** o conteúdo das host variables no log (podem ter CPF, conta, salário). Trate `SQLCODE = +100` (not found) como fluxo, não como erro.
3. **Cursores:** Se for solicitado múltiplos registros, gere o `DECLARE`, `OPEN`, `FETCH` e `CLOSE`.
4. **Precisão:** coluna monetária/decimal mapeia para host variable `COMP-3` com a mesma escala da tabela — nunca campo de ponto flutuante.

### ✅ Resultado Esperado
- O bloco SQL pronto para ser copiado para a PROCEDURE DIVISION.
- Definição das variáveis Host necessárias para a WORKING-STORAGE (DCLGEN style).
