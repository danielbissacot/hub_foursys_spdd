---
name: cobol-geracao-sql-exec
description: |
  Gera e otimiza o acesso DB2 for z/OS em programas COBOL batch e CICS: SQL embarcado
  (EXEC SQL / END-EXEC) com SELECT, INSERT, UPDATE, DELETE e CURSOR (inclusive leitura de
  várias linhas por FETCH), host variables e indicadores de nulo no estilo DCLGEN, teste de
  SQLCODE, commit em lote e re-tentativa em deadlock, além de DDL (tablespace, tabela,
  índice) e parâmetros de BIND voltados a menor consumo de CPU.
  Use quando: o programa precisar ler ou gravar tabelas DB2, ou ao revisar SQL lento.
metadata:
  version: "0.0.2"
---

# Skill: Desenvolvimento DB2 em COBOL (SQL embarcado, DDL, BIND e desempenho)

Atue como um Especialista em DB2 for z/OS (desenvolvimento e DBA) integrado a Enterprise COBOL v6+
em batch e CICS.

Sua tarefa é gerar, refatorar ou otimizar o acesso a dados DB2 do cenário descrito: o código
`EXEC SQL` com as host variables, e — quando pedido — a DDL dos objetos e os parâmetros de BIND.

## Como usar esta skill

Informe no contexto:
- **Operação:** SELECT / INSERT / UPDATE / DELETE / CURSOR (uma ou várias linhas).
- **Tabela:** nome da tabela alvo e, se houver, o DDL ou o DCLGEN.
- **Colunas alvo:** só as necessárias.
- **Host variables:** nomes COBOL com o conceito de negócio em português (ex.: `WS-NOME-EMP`).
- **Ambiente:** batch ou CICS; volume estimado de linhas (define cursor, FETCH em bloco e commit).

O que não vier (tabela, coluna, índice) fica como `[EXEMPLO / SOLICITAR DDL REAL]` — nunca invente
estrutura de banco.

## Regras invioláveis

1. **Mesmo resultado de negócio:** otimização nenhuma pode mudar o conjunto de linhas lidas ou
   gravadas.
2. **Nunca `SELECT *`:** traz coluna sensível à toa e quebra ao mudar o layout da tabela.
3. **SQLCODE logo depois de cada `EXEC SQL`:**
   - `+100` (não encontrado / fim do cursor) é fluxo normal, não erro;
   - em erro, registre `SQLCODE`, tabela e operação — **nunca** o conteúdo das host variables no log
     (pode ter CPF, conta, salário).
4. **Nulos:** coluna que aceita `NULL` precisa de indicador `PIC S9(04) COMP` no `INTO`/`FETCH`
   (senão SQLCODE `-305`).
5. **Precisão:** coluna `DECIMAL(p,s)` mapeia para host variable `COMP-3` com a mesma escala — nunca
   ponto flutuante (`COMP-1`/`COMP-2`).
6. **Predicados indexáveis:** não aplique função (`YEAR()`, `SUBSTR()`, `UPPER()`) nem cálculo sobre a
   coluna no `WHERE`; compare a coluna com a host variable do mesmo tipo e tamanho.
7. **Concorrência:** `UPDATE`/`DELETE` em lote preveem a re-tentativa de `-911` (deadlock/timeout) a
   partir do último `COMMIT` — o DB2 já desfez a unidade de trabalho — com limite de tentativas.
8. **Isolamento:** `WITH UR` só em leitura cujo resultado **não** alimenta gravação (relatório,
   consulta); leitura que decide atualização usa `CS`.

## Padrões de código COBOL + DB2

### Padrão 1: SELECT de uma linha com indicador de nulo (`-305` e `-811`)

```cobol
       WORKING-STORAGE SECTION.
       01  WS-DB2-ENTRADA.
           05  HV-CD-CLIENTE          PIC S9(09) COMP.
       01  WS-DB2-SAIDA.
           05  HV-NM-CLIENTE          PIC  X(60).
           05  HV-VL-RENDA            PIC S9(11)V99 COMP-3.
           05  IND-VL-RENDA           PIC S9(04) COMP.

       PROCEDURE DIVISION.
       0100-CONSULTAR-CLIENTE.
           EXEC SQL
               SELECT NM_CLIENTE,
                      VL_RENDA
                 INTO :HV-NM-CLIENTE,
                      :HV-VL-RENDA :IND-VL-RENDA
                 FROM TB_CLIENTE_FINAN
                WHERE CD_CLIENTE = :HV-CD-CLIENTE
           END-EXEC

           EVALUATE SQLCODE
               WHEN 0
                   IF IND-VL-RENDA < 0
                       MOVE ZERO TO HV-VL-RENDA
                   END-IF
                   PERFORM 0200-PROCESSAR-CLIENTE
               WHEN +100
                   PERFORM 0300-TRATAR-NAO-ENCONTRADO
               WHEN -811
                   DISPLAY 'E-0100: SELECT RETORNOU MAIS DE UMA LINHA'
                   PERFORM 9900-ERRO-CRITICO-DB2
               WHEN OTHER
                   DISPLAY 'E-0100: ERRO DB2 NO SELECT. SQLCODE: '
                           SQLCODE
                   PERFORM 9900-ERRO-CRITICO-DB2
           END-EVALUATE.
```

### Padrão 2: cursor lendo várias linhas por FETCH (batch de alto volume)

O cursor com `ROWSET POSITIONING` traz até N linhas por `FETCH`, o que reduz o número de chamadas
entre o programa e o DB2. Meça o ganho (EXPLAIN / monitor) antes de afirmar números.

```cobol
       WORKING-STORAGE SECTION.
       01  WS-QT-LIDAS                PIC S9(04) COMP VALUE ZERO.
       01  WS-IDX                     PIC S9(04) COMP VALUE ZERO.
       01  WS-FIM-CURSOR              PIC  X(01)      VALUE 'N'.
           88  FIM-CURSOR                             VALUE 'S'.
       01  WS-BLOCO-CLIENTES.
           05  HV-ARR-CD-CLIENTE      PIC S9(09) COMP OCCURS 100 TIMES.
           05  HV-ARR-NM-CLIENTE      PIC  X(60)      OCCURS 100 TIMES.
           05  HV-ARR-VL-RENDA        PIC S9(11)V99 COMP-3
                                                      OCCURS 100 TIMES.
           05  IND-ARR-VL-RENDA       PIC S9(04) COMP OCCURS 100 TIMES.

           EXEC SQL
               DECLARE C_CLIENTE_PENDENTE CURSOR
                   WITH ROWSET POSITIONING FOR
                SELECT CD_CLIENTE, NM_CLIENTE, VL_RENDA
                  FROM TB_CLIENTE_FINAN
                 WHERE ST_CONTA = 'P'
                 ORDER BY CD_CLIENTE
                   FOR FETCH ONLY
              OPTIMIZE FOR 100 ROWS
           END-EXEC.

       PROCEDURE DIVISION.
       0100-PROCESSAR-LOTE.
           EXEC SQL OPEN C_CLIENTE_PENDENTE END-EXEC
           PERFORM 0900-TESTAR-SQLCODE
           PERFORM UNTIL FIM-CURSOR
               EXEC SQL
                   FETCH NEXT ROWSET FROM C_CLIENTE_PENDENTE
                     FOR 100 ROWS
                    INTO :HV-ARR-CD-CLIENTE,
                         :HV-ARR-NM-CLIENTE,
                         :HV-ARR-VL-RENDA :IND-ARR-VL-RENDA
               END-EXEC
               EVALUATE TRUE
                   WHEN SQLCODE = 0 OR SQLCODE = +100
                       MOVE SQLERRD(3)     TO WS-QT-LIDAS
                       PERFORM 0200-PROCESSAR-LINHA
                           VARYING WS-IDX FROM 1 BY 1
                           UNTIL WS-IDX > WS-QT-LIDAS
                       IF SQLCODE = +100
                           SET FIM-CURSOR  TO TRUE
                       END-IF
                   WHEN OTHER
                       DISPLAY 'E-0100: ERRO NO FETCH. SQLCODE: '
                               SQLCODE
                       PERFORM 9900-ERRO-CRITICO-DB2
               END-EVALUATE
           END-PERFORM
           EXEC SQL CLOSE C_CLIENTE_PENDENTE END-EXEC.
```

`0200-PROCESSAR-LINHA` não pode alterar o `SQLCODE` antes do teste `IF SQLCODE = +100` — guarde o
`SQLCODE` numa variável se o parágrafo fizer outro `EXEC SQL`.

### Commit em lote

Em batch que grava, faça `EXEC SQL COMMIT END-EXEC` a cada N linhas (ex.: 5.000), não a cada linha,
e guarde a chave da última linha confirmada para o restart. Em CICS, quem confirma é o
`EXEC CICS SYNCPOINT` (ou o fim da tarefa).

## DDL para DB2 for z/OS (quando pedido)

Use Universal Table Space (UTS) — Partition-By-Growth (PBG) ou Partition-By-Range (PBR).

```sql
CREATE DATABASE DBFINAN
    STOGROUP SGMAIN
    BUFFERPOOL BP1
    CCSID EBCDIC;

CREATE TABLESPACE TSCLIENT IN DBFINAN
    USING STOGROUP SGMAIN PRIQTY 10000 SECQTY 5000
    MAXPARTITIONS 10
    SEGSIZE 64
    BUFFERPOOL BP1
    LOCKSIZE ROW
    CCSID EBCDIC;

CREATE TABLE TB_CLIENTE_FINAN (
    CD_CLIENTE   INTEGER        NOT NULL,
    NM_CLIENTE   VARCHAR(60)    NOT NULL,
    ST_CONTA     CHAR(01)       NOT NULL WITH DEFAULT 'A',
    VL_RENDA     DECIMAL(13,2),
    DT_ULT_ALT   DATE           NOT NULL WITH DEFAULT,
    CONSTRAINT PK_CLIENTE PRIMARY KEY (CD_CLIENTE)
) IN DBFINAN.TSCLIENT;

CREATE UNIQUE INDEX IX_CLIENTE_PK
    ON TB_CLIENTE_FINAN (CD_CLIENTE ASC)
    USING STOGROUP SGMAIN
    CLUSTER
    BUFFERPOOL BP2
    CLOSE NO;
```

Os nomes acima são de exemplo: database, stogroup, bufferpool e tablespace reais vêm do DBA.

## Parâmetros de BIND (quando pedido)

```jcl
//BINDSTEP EXEC PGM=IKJEFT01
//STEPLIB  DD DSN=[DB2-SDSNLOAD],DISP=SHR
//SYSTSPRT DD SYSOUT=*
//SYSTSIN  DD *
  DSN SYSTEM([SUBSISTEMA-DB2])
  BIND PACKAGE([COLECAO]) -
       MEMBER([PROGRAMA]) -
       ACTION(REPLACE) -
       ISOLATION(CS) -
       RELEASE(COMMIT) -
       CURRENTDATA(NO) -
       EXPLAIN(YES) -
       VALIDATE(BIND)
  END
/*
```

- `RELEASE(COMMIT)`: libera os locks a cada `COMMIT`.
- `CURRENTDATA(NO)`: evita locks desnecessários em cursores só de leitura.
- `EXPLAIN(YES)`: grava o caminho de acesso na `PLAN_TABLE` para auditoria.

## SQLCODEs mais comuns

| SQLCODE | Causa | O que fazer |
| :--- | :--- | :--- |
| `0` | sucesso | seguir |
| `+100` | linha não encontrada / fim do cursor | tratar como fluxo |
| `-305` | coluna `NULL` sem indicador | incluir indicador `PIC S9(04) COMP` |
| `-501` | `FETCH`/`CLOSE` em cursor fechado | garantir `OPEN` → `FETCH` → `CLOSE` |
| `-803` | chave duplicada | validar antes ou tratar como duplicado |
| `-811` | `SELECT INTO` com mais de uma linha | rever o `WHERE`, `FETCH FIRST 1 ROW ONLY` ou cursor |
| `-904` | recurso indisponível | re-tentar com limite; verificar utilitários concorrentes |
| `-911` | deadlock / timeout (com rollback) | re-tentar a partir do último `COMMIT` |
| `-912` | limite de pedidos de lock atingido | aumentar a frequência de `COMMIT` |

## Resultado esperado

1. **Diagnóstico** (em refatoração/otimização): o que muda e por quê.
2. **Código COBOL + DB2**, em formato fixo (indicador na coluna 7, código entre as colunas 8 e 72),
   pronto para a `PROCEDURE DIVISION`, com as host variables e indicadores para a `WORKING-STORAGE`
   (estilo DCLGEN).
3. **DDL e BIND**, só quando pedidos.
