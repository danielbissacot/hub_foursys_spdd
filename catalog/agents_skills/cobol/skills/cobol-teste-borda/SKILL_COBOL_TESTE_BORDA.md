---
name: cobol-teste-borda
description: |
  Gera no mínimo 5 casos de teste de borda (edge cases) para rotinas COBOL de cálculo ou
  validação, com a massa de dados de entrada e a saída esperada prontas para o teste unitário:
  limites de PIC, estouro de campo, dado não numérico (S0C7), índice de OCCURS (S0C4), divisão
  por zero, arredondamento e retornos simulados de VSAM, DB2 e CICS.
  Use quando: garantir a cobertura de testes de uma rotina COBOL nova ou alterada.
metadata:
  version: "0.0.2"
---

# Skill: Casos de Teste de Borda e Massa de Teste Unitário (COBOL)

Atue como um Especialista em QA e Testes Unitários de Mainframe (Enterprise COBOL v6+).

Sua tarefa é analisar o código ou a especificação COBOL fornecida e gerar a **matriz de casos de
teste de borda** — no mínimo 5 — junto com a **massa de dados de entrada** e a **saída esperada** de
cada caso.

## Como usar esta skill

Informe no contexto:
- **Campo / registro:** o que está sendo testado (ex.: `WS-VL-RENDA`).
- **Tipo de dado:** o PIC do campo (ex.: `PIC S9(9)V99 COMP-3`).
- **Contexto:** a regra de negócio aplicada (ex.: cálculo de IR).
- **Trecho do código** da rotina.

## O que analisar

### 1. Limites de PIC e capacidade
- **Mínimo:** zero, espaços (se `PIC X`), o menor negativo permitido em campo com sinal.
- **Máximo:** o teto do PIC (ex.: `9999999.99` para `PIC 9(07)V99`).
- **Estouro:** valor maior que o PIC de destino, para testar `ON SIZE ERROR` ou truncamento.

### 2. Tipo e integridade de memória (S0C7 / S0C4)
- **Campo não inicializado:** `SPACES` ou `LOW-VALUES` em `PIC 9` sem `VALUE`.
- **Caractere em campo numérico:** ex.: `'123A5'` — confirme que o teste `IS NUMERIC` barra antes do
  abend S0C7.
- **Índice de `OCCURS`:** índice 0, índice igual ao limite e índice acima (ex.: 101 para
  `OCCURS 100`), que leva ao S0C4.

### 3. Escala, arredondamento e precisão
- **Decimal implícito (`V`):** entrada com mais casas que o destino — com e sem `ROUNDED`; confirme
  que a escala do resultado bate com o PIC de destino (dinheiro não perde centavo).
- **Divisão por zero:** divisor zero, para testar a proteção contra o abend S0C9.
- **Negativo em campo sem sinal.**

### 4. Retornos simulados de integração
- **FILE STATUS / VSAM:** `00` (ok), `23` (chave não encontrada), `35` (arquivo não encontrado),
  `92` (erro de lógica).
- **SQLCODE DB2:** `0`, `+100` (não encontrado), `-803` (chave duplicada), `-911` (deadlock/timeout).
- **EIBRESP CICS:** `NORMAL`, `NOTFND`, `DUPREC`, `LENGERR`.

## Formato da resposta

### 1. Resumo da cobertura
Os cenários de borda identificados para a rotina.

### 2. Matriz de casos de teste

| ID | Cenário / objetivo | Campo foco | Massa de entrada | Resultado esperado | Técnica |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CT-TU-001** | valor máximo do PIC | `WS-VL-TRANS PIC 9(07)V99` | `9999999.99` | processado; `WS-STATUS = 0` | teto do PIC |
| **CT-TU-002** | caractere em campo numérico | `WS-VL-TRANS PIC 9(07)V99` | `'12345A789'` | rejeitado pela validação; `WS-STATUS = 9` | integridade / S0C7 |
| **CT-TU-003** | divisor zero | `WS-QT-PARCELAS PIC 9(02)` | `00` | erro tratado; mensagem "QTD INVALIDA" | divisão por zero |

### 3. Massa de teste pronta

#### A. Atribuição na WORKING-STORAGE (rotina de teste em COBOL, formato fixo)

```cobol
      *----------------------------------------------------------------*
      * CT-TU-001: VALOR LIMITE MAXIMO                                 *
      *----------------------------------------------------------------*
           INITIALIZE REG-ENTRADA
           MOVE '11122233344'          TO REG-CPF-CLIENTE
           MOVE 9999999.99             TO REG-VL-SOLICITADO
           PERFORM 2000-PROCESSAR-CALCULO
      *    ESPERADO: WS-COD-RETORNO = 00 E REG-VL-FINAL CONFORME A REGRA
      *----------------------------------------------------------------*
      * CT-TU-002: CARACTERE EM CAMPO NUMERICO                         *
      *----------------------------------------------------------------*
           INITIALIZE REG-ENTRADA
           MOVE '11122233344'          TO REG-CPF-CLIENTE
           MOVE '12345A789'            TO REG-VL-SOLICITADO-X
           PERFORM 2000-PROCESSAR-CALCULO
      *    ESPERADO: WS-COD-RETORNO = 99 (BARRADO PELO IS NUMERIC)
```

Com `DECIMAL-POINT IS COMMA` no programa, escreva o literal com vírgula (`9999999,99`).

#### B. Registros do arquivo de entrada (layout fixo)

```text
* CT-TU-001: REGISTRO COM VALOR LIMITE MAXIMO
1112223334499999999920261015
* CT-TU-002: REGISTRO COM CARACTERE NO CAMPO NUMERICO
1112223334412345A78920261015
```

### 4. Proteções recomendadas no código
As instruções COBOL que blindam a rotina contra os cenários encontrados (ex.: `ON SIZE ERROR`,
`IF ... IS NUMERIC`, teste de limite do índice, `NOT AT END`).

## Regras
- **Dados fictícios sempre:** nunca CPF, nome, conta ou cartão reais. Use sequências claramente
  inválidas (ex.: CPF `111.222.333-44`).
- No mínimo 5 casos de teste; cada um com cenário, entrada e resultado esperado.
- Exemplos de código no formato fixo (indicador na coluna 7, código entre as colunas 8 e 72).
