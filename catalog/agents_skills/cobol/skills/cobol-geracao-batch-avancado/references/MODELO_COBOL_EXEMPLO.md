# Modelo de Código COBOL — Programa de Exemplo (Fictício)

> Programa fictício `SIST8243` usado apenas para ilustrar formatação e estrutura.
> Nomes de sistema, projeto, tabela e objetivo são genéricos — não copie a lógica de
> negócio, apenas o padrão estrutural. Substitua todos os identificadores (programa,
> arquivos, books, tabelas, campos, textos e acumuladores) pelas informações reais
> coletadas do usuário antes de gerar o programa definitivo.

### Cabecalho e Divisoes Iniciais

```cobol
      *================================================================*
       IDENTIFICATION                  DIVISION.
      *================================================================*

       PROGRAM-ID. SIST8243.
       AUTHOR.     NOME DO ANALISTA.

      *================================================================*
      *                         F O U R S Y S                          *
      *----------------------------------------------------------------*
      *    PROGRAMA....:  SIST8243                                     *
      *    ANALISTA....:  NOME DO ANALISTA                  - FOURSYS  *
      *    DATA........:  21/05/2026                                   *
      *----------------------------------------------------------------*
      *    PROJETO.....:  PROJETO EXEMPLO                             *
      *    OBJETIVO....:  OBTER DADOS DO REGISTRO PRINCIPAL E DADOS    *
      *                   COMPLEMENTARES PARA FORMATACAO DO ARQUIVO    *
      *                   DE SAIDA.                                    *
      *----------------------------------------------------------------*
      *    TABELAS.....:  DB2PRD.TABELA_SECUNDARIA_EX      - TERCB008 *
      *----------------------------------------------------------------*
      *    ARQUIVOS....:  DDNAME    I/O  BOOK/LAYOUT                   *
      *                   EPARMENT   I    SISTW204                     *
      *                   EDETENT   I    SISTW011                     *
      *                   SSAIDA01   O    SISTW201                     *
      *                   SRELCTRL   O    RELATORIO DE EXECUCAO        *
      *----------------------------------------------------------------*
      *    BOOK'S......:                                               *
      *    I#FRWKGE - BOOK DE COMUNICACAO COM FRWK2999                 *
      *    I#FRWKAR - BOOK PARA TRATAMENTO DE ERROS DE ARQUIVOS        *
      *    I#FRWKDB - BOOK PARA TRATAMENTO DE ERROS DE DB2             *
      *    I#FRWKLI - BOOK PARA TRATAMENTO DE ERROS LIVRES             *
      *----------------------------------------------------------------*
      *    MODULOS.....:                                               *
      *    POOL7600 - OBTER DATA E HORA ATUAIS                         *
      *    BRAD0450 - PROVOCAR ABEND COM OU SEM DUMP                   *
      *    FRWK2999 - GRAVAR LOG DE ERRO P/ BATCH                      *
      *================================================================*

      *================================================================*
       ENVIRONMENT                     DIVISION.
      *================================================================*

      *----------------------------------------------------------------*
       CONFIGURATION                   SECTION.
      *----------------------------------------------------------------*

       SPECIAL-NAMES.
         DECIMAL-POINT               IS   COMMA.

      *----------------------------------------------------------------*
       INPUT-OUTPUT                    SECTION.
      *----------------------------------------------------------------*

       FILE-CONTROL.

         SELECT EPARMENT ASSIGN      TO   UT-S-EPARMENT
            FILE STATUS          IS   WRK-FS-EPARMENT.

         SELECT SSAIDA01 ASSIGN      TO   UT-S-SSAIDA01
            FILE STATUS          IS   WRK-FS-SSAIDA01.

         SELECT SRELCTRL ASSIGN      TO   UT-S-SRELCTRL
            FILE STATUS          IS   WRK-FS-SRELCTRL.
```

### FILE SECTION

```cobol
      *================================================================*
       DATA                            DIVISION.
      *================================================================*

      *----------------------------------------------------------------*
       FILE                            SECTION.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
      *   INPUT:   PARM DO JOB COM TIPO E DATA PROCESSAMENTO           *
      *            ORG. SEQUENCIAL     -   LRECL   =  009              *
      *----------------------------------------------------------------*
       FD  EPARMENT
         RECORDING MODE IS F
         LABEL RECORD IS STANDARD
         BLOCK CONTAINS 0 RECORDS.
       01  FD-EPARMENT                 PIC  X(009).

      *----------------------------------------------------------------*
      *   OUTPUT:  REGISTROS COMPLEMENTADOS DA SISTB008                *
      *            ORG. SEQUENCIAL     -   LRECL   =  217              *
      *----------------------------------------------------------------*
       FD  SSAIDA01
         RECORDING MODE IS F
         LABEL RECORD IS STANDARD
         BLOCK CONTAINS 0 RECORDS.
       01  FD-SSAIDA01                 PIC  X(217).

      *----------------------------------------------------------------*
      *   OUTPUT:  RELATORIO DE CONTROLE DA EXECUCAO                   *
      *            ORG. SEQUENCIAL     -   LRECL   =  080              *
      *----------------------------------------------------------------*
       FD  SRELCTRL
         RECORDING MODE IS F
         LABEL RECORD IS STANDARD
         BLOCK CONTAINS 0 RECORDS.
       01  FD-SRELCTRL                 PIC  X(080).
```

### WORKING-STORAGE Essencial

```cobol
      *----------------------------------------------------------------*
       WORKING-STORAGE                 SECTION.
      *----------------------------------------------------------------*

      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
       77  FILLER                      PIC  X(050)         VALUE
         '*** AREA DE ACUMULADORES                       ***'.
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *

       77  ACU-LIDOS-EPARMENT          PIC 9(009) COMP-3   VALUE ZEROS.
       77  ACU-GRAVA-SSAIDA01          PIC 9(009) COMP-3   VALUE ZEROS.
       77  ACU-LIDOS-SISTB008          PIC 9(009) COMP-3   VALUE ZEROS.
       77  ACU-N-ENCONTR-SISTB008      PIC 9(009) COMP-3   VALUE ZEROS.

      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
       77  FILLER                      PIC  X(050)         VALUE
         '*** AREA DE TESTE DE FILE-STATUS               ***'.
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *

       77  WRK-FS-EPARMENT             PIC X(002)          VALUE SPACES.
       77  WRK-FS-SSAIDA01             PIC X(002)          VALUE SPACES.
       77  WRK-FS-SRELCTRL             PIC X(002)          VALUE SPACES.

      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
       77  FILLER                      PIC  X(050)         VALUE
         '*** AREA DE AUXILIARES                         ***'.
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *

       77  WRK-FIM-EDETENT            PIC X(001)          VALUE 'N'.

       01  WRK-SQLCODE-AUX             PIC S9(009)         VALUE ZEROS.
       01  FILLER                      REDEFINES WRK-SQLCODE-AUX.
         05 FILLER                   PIC  9(006).
         05 WRK-SQLCODE-9-3          PIC S9(003).

      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
       01  FILLER                      PIC  X(050)         VALUE
         '*** AREA DE ENTRADA EPARMENT                   ***'.
      *- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *

       COPY 'SISTW204'.

      *----------------------------------------------------------------*
       01  FILLER                      PIC  X(035)         VALUE
         'AREA PARA POOL7600'.
      *----------------------------------------------------------------*

       01  WRK-DATA-HORA.
         05 WRK-DATA-JULIANA         PIC  9(005) COMP-3  VALUE ZEROS.
         05 WRK-DATA-AAMMDD          PIC  9(007) COMP-3  VALUE ZEROS.
         05 WRK-DATA-AAAAMMDD        PIC  9(009) COMP-3  VALUE ZEROS.
         05 WRK-HORA-HHMMSS          PIC  9(007) COMP-3  VALUE ZEROS.
         05 WRK-DATA-HHMMSSMMMM      PIC  9(013) COMP-3  VALUE ZEROS.
         05 WRK-TIMESTAMP.
          10 WRK-ANO-7600          PIC  9(004)         VALUE ZEROS.
          10 WRK-MES-7600          PIC  9(002)         VALUE ZEROS.
          10 WRK-DIA-7600          PIC  9(002)         VALUE ZEROS.
          10 WRK-HOR-7600          PIC  9(002)         VALUE ZEROS.
          10 WRK-MIN-7600          PIC  9(002)         VALUE ZEROS.
          10 WRK-SEG-7600          PIC  9(002)         VALUE ZEROS.
          10 WRK-MIL-7600          PIC  9(006)         VALUE ZEROS.
```

### Areas de Relatorio, Framework de Erro e DB2

```cobol
      *----------------------------------------------------------------*
       01  FILLER                      PIC  X(035)         VALUE
         'DEFINICOES DE CABECALHOS - SRELCTRL'.
      *----------------------------------------------------------------*

       01  WRK-CABEC1-REL1.
         05  FILLER                  PIC  X(001)         VALUE SPACES.
         05  FILLER                  PIC  X(017)         VALUE
           'BRADESCO'.
         05  FILLER                  PIC  X(052)         VALUE
           'SISTEMA EXEMPLO DE NEGOCIO'.
         05  FILLER                  PIC  X(010)         VALUE
           'FOL. UNICA'.

       01  WRK-CABEC2-REL1.
         05  FILLER                  PIC  X(001)         VALUE SPACES.
         05  FILLER                  PIC  X(008)         VALUE
           'SIST8243'.
         05  FILLER                  PIC  X(004)         VALUE SPACES.
         05  FILLER                  PIC  X(057)         VALUE
           'CONSULTA DE REGISTROS PRINCIPAIS E COMPLEMENTARES'.
         05  WRK-CB2-REL1-DIA        PIC  99             VALUE ZEROS.
         05  FILLER                  PIC  X(001)         VALUE '/'.
         05  WRK-CB2-REL1-MES        PIC  99             VALUE ZEROS.
         05  FILLER                  PIC  X(001)         VALUE '/'.
         05  WRK-CB2-REL1-ANO        PIC  9999           VALUE ZEROS.

       01  WRK-CABEC3-REL1.
         05  FILLER                  PIC  X(001)         VALUE SPACES.
         05  FILLER                  PIC  X(029)         VALUE SPACES.
         05  FILLER                  PIC  X(020)         VALUE
           'CONTROLE OPERACIONAL'.

       01  WRK-LINDET1-REL1.
         03  WRK-LD1-REL1-CTRL       PIC X(01)           VALUE SPACES.
         03  FILLER                  PIC X(12)           VALUE SPACES.
         03  WRK-LD1-REL1-TEXTO      PIC X(36)           VALUE SPACES.
         03  WRK-LD1-REL1-VALOR      PIC ZZZ.ZZZ.ZZ9     VALUE ZEROS.

       01  WRK-FRWK2999                PIC  X(008)         VALUE
         'FRWK2999'.

       01  WRK-AREA-ERRO.
         COPY 'I#FRWKGE'.
         05 WRK-BLOCO-INFO-ERRO.
          10 WRK-CHAR-INFO-ERRO    PIC  X(001) OCCURS 0 TO 526
                       TIMES DEPENDING ON
                       FRWKGHEA-TAM-DADOS.

       01  WRK-AREA-ERRO-ARQUIVO.
         COPY 'I#FRWKAR'.

       01  WRK-AREA-ERRO-LIVRE.
         COPY 'I#FRWKLI'.

       01  WRK-AREA-ERRO-DB2.
         COPY 'I#FRWKDB'.

       01  WRK-AREA-BRAD0450.
         05 WRK-0450-ABEND-BAT       PIC S9(004)  COMP   VALUE +1111.
         05 WRK-0450-DUMP-BAT        PIC  X(001)         VALUE 'S'.

         EXEC SQL
          INCLUDE SQLCA
         END-EXEC.

         EXEC SQL
          INCLUDE SISTB008
         END-EXEC.
```

### Fluxo Principal, Inicializacao e File Status

```cobol
      *================================================================*
       PROCEDURE                       DIVISION.
      *================================================================*

      *----------------------------------------------------------------*
       0000-ROTINA-PRINCIPAL           SECTION.
      *----------------------------------------------------------------*

         PERFORM 1000-INICIALIZAR.

         PERFORM 2000-VERIFICAR-VAZIO.

         PERFORM 3000-PROCESSAR.

         PERFORM 4000-FINALIZAR.

      *----------------------------------------------------------------*
       0000-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       1000-INICIALIZAR                SECTION.
      *----------------------------------------------------------------*

         MOVE '1000-INICIALIZAR'     TO FRWKGHEA-IDEN-PARAGRAFO.

         INITIALIZE FRWKGHEA-REGISTRO
              FRWKGLIV-REGISTRO
              FRWKGARQ-REGISTRO
              FRWKGDB2-REGISTRO.

         OPEN INPUT  EPARMENT
          OUTPUT SSAIDA01
               SRELCTRL.

         SET ARQ-OPEN                TO   TRUE.

         PERFORM 1100-TESTAR-FILE-STATUS.

      *----------------------------------------------------------------*
       1000-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       1100-TESTAR-FILE-STATUS         SECTION.
      *----------------------------------------------------------------*

         PERFORM 1110-TESTAR-FS-EPARMENT.

         PERFORM 1140-TESTAR-FS-SSAIDA01.

         PERFORM 1170-TESTAR-FS-SRELCTRL.

      *----------------------------------------------------------------*
       1100-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       1110-TESTAR-FS-EPARMENT         SECTION.
      *----------------------------------------------------------------*

         IF  WRK-FS-EPARMENT         NOT EQUAL '00' AND '10'
           MOVE 'EPARMENT'         TO FRWKGARQ-NOME-ARQUIVO
           MOVE WRK-FS-EPARMENT    TO FRWKGARQ-FILE-STATUS
           PERFORM 9100-FORMATAR-ERRO-ARQUIVO
         END-IF.

      *----------------------------------------------------------------*
       1110-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       1140-TESTAR-FS-SSAIDA01         SECTION.
      *----------------------------------------------------------------*

         IF  WRK-FS-SSAIDA01         NOT EQUAL '00'
           MOVE 'SSAIDA01'         TO FRWKGARQ-NOME-ARQUIVO
           MOVE WRK-FS-SSAIDA01    TO FRWKGARQ-FILE-STATUS
           PERFORM 9100-FORMATAR-ERRO-ARQUIVO
         END-IF.

      *----------------------------------------------------------------*
       1140-99-FIM.                    EXIT.
      *----------------------------------------------------------------*
```

### Leitura, Parametro e Arquivo Vazio

```cobol
      *----------------------------------------------------------------*
       2000-VERIFICAR-VAZIO            SECTION.
      *----------------------------------------------------------------*

         PERFORM 2100-LER-EPARMENT.

         IF (ACU-LIDOS-EPARMENT      EQUAL     ZEROS)
           DISPLAY '************ SIST8243 ************'
           DISPLAY '*                                *'
           DISPLAY '*     ARQUIVO EPARMENT VAZIO     *'
           DISPLAY '*       PROGRAMA ENCERRADO       *'
           DISPLAY '*                                *'
           DISPLAY '************ SIST8243 ************'
           PERFORM 4000-FINALIZAR
         END-IF.

      *----------------------------------------------------------------*
       2000-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       2100-LER-EPARMENT               SECTION.
      *----------------------------------------------------------------*

         MOVE '2100-LER-EPARMENT'    TO FRWKGHEA-IDEN-PARAGRAFO.

         READ EPARMENT               INTO SISTW204-PARM.

         IF (WRK-FS-EPARMENT         EQUAL '10')
           CONTINUE
         ELSE
           SET ARQ-READ            TO TRUE
           PERFORM 1110-TESTAR-FS-EPARMENT
           ADD  1                  TO ACU-LIDOS-EPARMENT

           PERFORM 2110-CONSISTIR-PARAMETRO
         END-IF.

      *----------------------------------------------------------------*
       2100-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       2110-CONSISTIR-PARAMETRO        SECTION.
      *----------------------------------------------------------------*

         IF (SISTW204-TPO-PROC       NOT EQUAL 'D' AND 'R' AND 'E')
           MOVE 'TIPO DE PROCESSAMENTO DEVE SER D, R OU E'
                       TO FRWKGLIV-PARAMETROS
           PERFORM 9200-FORMATAR-ERRO-LIVRE
         END-IF.

         IF (SISTW204-DT-PROC        NOT NUMERIC)
           MOVE 'DATA DO PARAM DEVE SER NUMERICA'
                       TO FRWKGLIV-PARAMETROS
           PERFORM 9200-FORMATAR-ERRO-LIVRE
         END-IF.

      *----------------------------------------------------------------*
       2110-99-FIM.                    EXIT.
      *----------------------------------------------------------------*
```

### Processamento, Acesso DB2 e Tratamento de Nulos

```cobol
      *----------------------------------------------------------------*
       3000-PROCESSAR                  SECTION.
      *----------------------------------------------------------------*

         PERFORM UNTIL WRK-FIM-EDETENT
                       EQUAL 'S'

           PERFORM 3200-OBTER-CONTRATO-SISTB008

           IF (SQLCODE             EQUAL ZEROS)
             PERFORM 3300-OBTER-CLIENTE-TERCB008
           END-IF

           IF (SQLCODE             EQUAL ZEROS)
             PERFORM 3500-GRAVAR-SSAIDA01
           END-IF

           PERFORM 2300-LER-EDETENT

         END-PERFORM.

      *----------------------------------------------------------------*
       3000-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       3200-OBTER-CONTRATO-SISTB008    SECTION.
      *----------------------------------------------------------------*

         MOVE '3200-OBTER-CONTRATO-SISTB008'
                       TO FRWKGHEA-IDEN-PARAGRAFO.

         MOVE SISTW011-CPRODT-BDSCO  TO CPRODT-BDSCO     OF SISTB008.
         MOVE SISTW011-CFAML-CONTR   TO CFAML-CONTR      OF SISTB008.
         MOVE SISTW011-CCONTR        TO CCONTR           OF SISTB008.

         EXEC SQL
         SELECT  CCGC_CPF_ST
            ,CCTA_CORR
            ,CFLIAL_CGC_ST
           INTO :SISTB008.CCGC-CPF-ST
             ,:SISTB008.CCTA-CORR
             ,:SISTB008.CFLIAL-CGC-ST
               :WRK-CFLIAL-CGC-ST-NL
           FROM DB2PRD.TABELA_PRINCIPAL_EX
          WHERE CPRODT_BDSCO = :SISTB008.CPRODT-BDSCO
          AND CFAML_CONTR  = :SISTB008.CFAML-CONTR
          AND CCONTR       = :SISTB008.CCONTR
         END-EXEC.

         IF (SQLCODE                 NOT EQUAL ZEROS AND +100) OR
          (SQLWARN0                EQUAL 'W')
           SET DB2-SELECT          TO TRUE
           MOVE 'TABELA-PRINCIPAL-EX'
                       TO FRWKGDB2-NOME-TABELA
           PERFORM 9300-FORMATAR-ERRO-DB2
         END-IF.

         IF (SQLCODE                 NOT EQUAL +100)
           ADD 1                   TO ACU-LIDOS-SISTB008
           PERFORM 3210-TRATAR-NULOS
         ELSE
           ADD 1                   TO ACU-N-ENCONTR-SISTB008
           MOVE 'REGISTRO NAO ENCONTRADO NA SISTB008'
                       TO SISTW202-MOTVO-INCON
           PERFORM 3600-GRAVAR-SSAINCON
         END-IF.

      *----------------------------------------------------------------*
       3200-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       3210-TRATAR-NULOS               SECTION.
      *----------------------------------------------------------------*

         IF (WRK-CFLIAL-CGC-ST-NL    LESS ZEROS)
           MOVE SPACES             TO CFLIAL-CGC-ST    OF SISTB008
         END-IF.

      *----------------------------------------------------------------*
       3210-99-FIM.                    EXIT.
      *----------------------------------------------------------------*
```

### Gravacao de Arquivo de Saida

```cobol
      *----------------------------------------------------------------*
       3500-GRAVAR-SSAIDA01            SECTION.
      *----------------------------------------------------------------*

         MOVE '3500-GRAVAR-SSAIDA01' TO FRWKGHEA-IDEN-PARAGRAFO.

         INITIALIZE SISTW201-REGISTRO.

         MOVE SISTW011-CPRODT-BDSCO  TO SISTW201-CPRODT-BDSCO.
         MOVE SISTW011-CFAML-CONTR   TO SISTW201-CFAML-CONTR.
         MOVE SISTW011-CCONTR        TO SISTW201-CCONTR.
         MOVE DINCL-CONTR            OF SISTB008
                       TO SISTW201-DINCL-CONTR.
         MOVE ICTA-MOVTC             OF TERCB008
                       TO SISTW201-ICTA-MOVTC.

         WRITE FD-SSAIDA01           FROM SISTW201-REGISTRO.

         PERFORM 1140-TESTAR-FS-SSAIDA01.

         ADD 1                       TO ACU-GRAVA-SSAIDA01.

      *----------------------------------------------------------------*
       3500-99-FIM.                    EXIT.
      *----------------------------------------------------------------*
```

### Finalizacao e SRELCTRL

```cobol
      *----------------------------------------------------------------*
       4000-FINALIZAR                  SECTION.
      *----------------------------------------------------------------*

         MOVE '4000-FINALIZAR'       TO FRWKGHEA-IDEN-PARAGRAFO.

         PERFORM 4100-EMITIR-SRELCTRL.

         CLOSE EPARMENT
           SSAIDA01
           SRELCTRL.

         SET ARQ-CLOSE               TO TRUE.

         PERFORM 1100-TESTAR-FILE-STATUS.

         DISPLAY '************ SIST8243 ************'.
         DISPLAY '*                                *'.
         DISPLAY '* PROGRAMA ENCERRADO COM SUCESSO *'.
         DISPLAY '*                                *'.
         DISPLAY '************ SIST8243 ************'.

         STOP RUN.

      *----------------------------------------------------------------*
       4000-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       4100-EMITIR-SRELCTRL            SECTION.
      *----------------------------------------------------------------*

         WRITE FD-SRELCTRL           FROM WRK-CABEC1-REL1.
         PERFORM 1170-TESTAR-FS-SRELCTRL.

         CALL 'POOL7600'             USING WRK-DATA-HORA.

         MOVE WRK-DIA-7600           TO WRK-CB2-REL1-DIA.
         MOVE WRK-MES-7600           TO WRK-CB2-REL1-MES.
         MOVE WRK-ANO-7600           TO WRK-CB2-REL1-ANO.

         WRITE FD-SRELCTRL           FROM WRK-CABEC2-REL1.
         PERFORM 1170-TESTAR-FS-SRELCTRL.

         WRITE FD-SRELCTRL           FROM WRK-CABEC3-REL1.
         PERFORM 1170-TESTAR-FS-SRELCTRL.

         MOVE 'REGISTROS LIDOS       (EPARMENT)..: '
                       TO WRK-LD1-REL1-TEXTO.
         MOVE ACU-LIDOS-EPARMENT     TO WRK-LD1-REL1-VALOR.
         WRITE FD-SRELCTRL           FROM WRK-LINDET1-REL1.
         PERFORM 1170-TESTAR-FS-SRELCTRL.

         MOVE 'REGISTROS GRAVADOS    (SSAIDA01)..: '
                       TO WRK-LD1-REL1-TEXTO.
         MOVE ACU-GRAVA-SSAIDA01     TO WRK-LD1-REL1-VALOR.
         WRITE FD-SRELCTRL           FROM WRK-LINDET1-REL1.
         PERFORM 1170-TESTAR-FS-SRELCTRL.

      *----------------------------------------------------------------*
       4100-99-FIM.                    EXIT.
      *----------------------------------------------------------------*
```

### Tratamento de Erros, Log e Abend

```cobol
      *----------------------------------------------------------------*
       9100-FORMATAR-ERRO-ARQUIVO      SECTION.
      *----------------------------------------------------------------*

         SET ERRO-ARQUIVO            TO TRUE.

         MOVE FRWKGARQ-TAM-LAYOUT    TO FRWKGHEA-TAM-DADOS.
         MOVE WRK-AREA-ERRO-ARQUIVO  TO WRK-BLOCO-INFO-ERRO
                        (1:FRWKGHEA-TAM-DADOS).

         PERFORM 9900-TRATAR-ERRO.

      *----------------------------------------------------------------*
       9100-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       9200-FORMATAR-ERRO-LIVRE        SECTION.
      *----------------------------------------------------------------*

         SET ERRO-LIVRE              TO   TRUE.

         MOVE 1                      TO   FRWKGLIV-IDIOMA.
         MOVE FRWKGLIV-TAM-LAYOUT    TO   FRWKGHEA-TAM-DADOS.
         MOVE WRK-AREA-ERRO-LIVRE    TO   WRK-BLOCO-INFO-ERRO
                        (1:FRWKGHEA-TAM-DADOS).

         PERFORM 9900-TRATAR-ERRO.

      *----------------------------------------------------------------*
       9200-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       9300-FORMATAR-ERRO-DB2          SECTION.
      *----------------------------------------------------------------*

         SET ERRO-DB2                TO   TRUE.

         MOVE FRWKGDB2-TAM-LAYOUT    TO   FRWKGHEA-TAM-DADOS.
         MOVE FRWKGHEA-IDEN-PARAGRAFO(1:16)
                       TO   FRWKGDB2-LOCAL.
         MOVE SQLSTATE               TO   FRWKGDB2-SQLSTATE.
         MOVE SQLCA                  TO   FRWKGDB2-SQLCA.
         MOVE SQLCODE                TO   WRK-SQLCODE-AUX.
         MOVE WRK-SQLCODE-9-3        TO   FRWKGDB2-SQLCODE2.
         MOVE WRK-AREA-ERRO-DB2      TO   WRK-BLOCO-INFO-ERRO
                           (1:FRWKGHEA-TAM-DADOS).

         PERFORM 9900-TRATAR-ERRO.

      *----------------------------------------------------------------*
       9300-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       9900-TRATAR-ERRO                SECTION.
      *----------------------------------------------------------------*

         MOVE 'SIST8243'             TO FRWKGHEA-NOME-PROGRAMA.

         PERFORM 4100-EMITIR-SRELCTRL.

         PERFORM 9990-GRAVAR-LOG-ERRO.

         PERFORM 9999-ABENDAR-PROGRAMA.

         GOBACK.

      *----------------------------------------------------------------*
       9900-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       9990-GRAVAR-LOG-ERRO            SECTION.
      *----------------------------------------------------------------*

         CALL WRK-FRWK2999           USING WRK-AREA-ERRO.

      *----------------------------------------------------------------*
       9990-99-FIM.                    EXIT.
      *----------------------------------------------------------------*

      *----------------------------------------------------------------*
       9999-ABENDAR-PROGRAMA           SECTION.
      *----------------------------------------------------------------*

         DISPLAY '*** BRAD0450 CHAMADO PARA ABENDAR O PROGRAMA ***'.

         CALL 'BRAD0450'             USING WRK-0450-ABEND-BAT
                         WRK-0450-DUMP-BAT.

      *----------------------------------------------------------------*
       9999-99-FIM.                    EXIT.
      *----------------------------------------------------------------*
```
