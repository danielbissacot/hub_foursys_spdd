# Estrutura, Convenções e Checklist do Programa COBOL

> Consulte também `MODELO_COBOL_EXEMPLO.md` para ver a estrutura descrita aqui em código.

## Estrutura Obrigatoria do Programa

Replique a organizacao do `SIST8243` na ordem e formatacao:

### 1. Cabecalho de Identificacao

- Bloco `IDENTIFICATION DIVISION` com `PROGRAM-ID` e `AUTHOR`.
- Cabecalho comentado padrao Foursys/Bradesco contendo:
  - `PROGRAMA`, `ANALISTA`, `DATA`.
  - `PROJETO`, `OBJETIVO`.
  - Lista de `TABELAS` (nome DB2 e DCLGEN).
  - Lista de `ARQUIVOS` com `DDNAME`, `I/O` e `BOOK/LAYOUT`.
  - Lista de `BOOKS` de framework.
  - Lista de `MODULOS` chamados.

### 2. ENVIRONMENT DIVISION

- `CONFIGURATION SECTION` com `DECIMAL-POINT IS COMMA`.
- `INPUT-OUTPUT SECTION` com `FILE-CONTROL` declarando `SELECT ... ASSIGN TO UT-S-<DDNAME> FILE STATUS IS WRK-FS-<DDNAME>`.

### 3. DATA DIVISION

- `FILE SECTION` com um `FD` por arquivo, sempre `RECORDING MODE IS F`, `LABEL RECORD IS STANDARD`, `BLOCK CONTAINS 0 RECORDS` e registro `01 FD-<nome> PIC X(nnn)`. Comentar com o proposito, organizacao e LRECL.
- `WORKING-STORAGE SECTION` organizada por blocos delimitados por linhas `* - - -` e titulos em `FILLER PIC X(050) VALUE '*** ... ***'`:
  - Acumuladores (`ACU-LIDOS-*`, `ACU-GRAVA-*`, `ACU-N-ENCONTR-*`).
  - Indicadores de nulidade (`WRK-*-NL PIC S9(004) COMP`).
  - File-status (`WRK-FS-<DDNAME>`).
  - Auxiliares (flags `WRK-FIM-*`, mascaras, datas).
  - `WRK-SQLCODE-AUX` com redefinicao para `WRK-SQLCODE-9-3`.
  - Areas de copybooks de entrada/saida (`COPY '<NOME>'`).
  - Area `WRK-DATA-HORA` para chamada do `POOL7600`.
  - Cabecalhos do relatorio `SRELCTRL` (`WRK-CABEC1-REL1`, `WRK-CABEC2-REL1`, `WRK-CABEC3-REL1`, `WRK-LINDET1-REL1`).
  - Area de framework de erro: `WRK-AREA-ERRO` com `COPY 'I#FRWKGE'` e `WRK-BLOCO-INFO-ERRO` ocorrendo de 0 a 526 com `DEPENDING ON FRWKGHEA-TAM-DADOS`.
  - Areas `I#FRWKAR`, `I#FRWKLI`, `I#FRWKDB`.
  - Area do `BRAD0450` com `WRK-0450-ABEND-BAT` e `WRK-0450-DUMP-BAT`.
  - Bloco `EXEC SQL INCLUDE SQLCA / <DCLGENs> END-EXEC` para todas as tabelas usadas.
  - Declarar somente variaveis utilizadas no programa; remover qualquer variavel sem referencia na PROCEDURE DIVISION, FILE SECTION ou areas chamadas.

### 4. PROCEDURE DIVISION

Use SECTIONs nomeadas com sufixo de paragrafo de fim `-99-FIM. EXIT.` e numeracao hierarquica:

- `0000-ROTINA-PRINCIPAL` chamando `1000-INICIALIZAR`, `2000-VERIFICAR-VAZIO`, `3000-PROCESSAR`, `4000-FINALIZAR`.
- `1000-INICIALIZAR`: `INITIALIZE` das areas de framework, `OPEN` dos arquivos, `SET ARQ-OPEN TO TRUE`, `PERFORM 1100-TESTAR-FILE-STATUS`.
- `1100-TESTAR-FILE-STATUS` chamando uma section `11x0-TESTAR-FS-<DDNAME>` por arquivo. Para arquivos de entrada, chamar `9100-FORMATAR-ERRO-ARQUIVO` quando o file status for diferente de `'00'` e `'10'`. Para arquivos de saida, chamar `9100-FORMATAR-ERRO-ARQUIVO` quando o file status for diferente de `'00'`.
- `2000-VERIFICAR-VAZIO`: ler primeiros registros, validar arquivos vazios com `DISPLAY` padronizado em moldura de asteriscos.
- `2100-LER-<DDNAME>`: `READ ... INTO <area>`, tratar fim com `SET FIM-* TO TRUE`, atualizar acumuladores, chamar a section de teste de file status correspondente.
- `2210-CONSISTIR-PARAMETRO`: validar tipo e dominio do parametro, usando `9200-FORMATAR-ERRO-LIVRE` para erros.
- `3000-PROCESSAR`: loop `PERFORM UNTIL` consumindo o arquivo principal, com chamadas a sections `3100`, `3200`, `3300`, `3400`, `3500`, `3600` conforme o fluxo.
- Sections de acesso DB2 (`3xx0-OBTER-*` / `3xx0-INSERIR-*` / `3xx0-ATUALIZAR-*`):
  - `MOVE '<nome-section>' TO FRWKGHEA-IDEN-PARAGRAFO`.
  - `EXEC SQL ... END-EXEC`.
  - Tratamento padrao: `IF SQLCODE NOT EQUAL ZEROS AND +100 OR SQLWARN0 EQUAL 'W'`, `SET DB2-SELECT/INSERT/UPDATE/DELETE TO TRUE`, `MOVE '<TABELA>' TO FRWKGDB2-NOME-TABELA`, `PERFORM 9300-FORMATAR-ERRO-DB2`.
  - Quando `SQLCODE = +100`, gerar gravacao em arquivo de inconsistencia, se aplicavel.
  - Atualizar acumulador `ACU-LIDOS-<TABELA>` ou `ACU-N-ENCONTR-<TABELA>`.
- Section `3xx0-TRATAR-NULOS` para tratar indicadores de nulidade DB2.
- Sections `3xx0-GRAVAR-<DDNAME>`: `INITIALIZE` do registro, `MOVE` dos campos, `WRITE FD-<DDNAME> FROM <area>`, `PERFORM` da section de teste de file status, incremento do acumulador `ACU-GRAVA-*`.
- `4000-FINALIZAR`: `CLOSE` de todos os arquivos, `SET ARQ-CLOSE TO TRUE`, `PERFORM 1100-TESTAR-FILE-STATUS`, `DISPLAY` em moldura, `PERFORM 4100-EMITIR-SRELCTRL`, `STOP RUN`.
- `4100-EMITIR-SRELCTRL`: `CALL 'POOL7600' USING WRK-DATA-HORA`, gravacao de cabecalhos e linhas de detalhe com totais por arquivo e por tabela.
- Sections `9100-FORMATAR-ERRO-ARQUIVO`, `9200-FORMATAR-ERRO-LIVRE`, `9300-FORMATAR-ERRO-DB2`:
  - `SET ERRO-ARQUIVO/ERRO-LIVRE/ERRO-DB2 TO TRUE`.
  - Preencher `FRWKGHEA-TAM-DADOS` com o tamanho do layout correspondente.
  - Mover a area de erro para `WRK-BLOCO-INFO-ERRO (1:FRWKGHEA-TAM-DADOS)`.
  - `PERFORM 9900-TRATAR-ERRO`.
- Section `9900-TRATAR-ERRO`: `MOVE '<PROGRAMA>' TO FRWKGHEA-NOME-PROGRAMA`, `PERFORM 4100-EMITIR-SRELCTRL`, `PERFORM 9990-GRAVAR-LOG-ERRO`, `PERFORM 9999-ABENDAR-PROGRAMA`, `GOBACK`.
- Section `9990-GRAVAR-LOG-ERRO`: `CALL WRK-FRWK2999 USING WRK-AREA-ERRO`.
- Section `9999-ABENDAR-PROGRAMA`: `DISPLAY` e `CALL 'BRAD0450' USING WRK-0450-ABEND-BAT WRK-0450-DUMP-BAT`.

- Inclua somente as sections necessárias para o programa

## Convencoes de Estilo

- Todas as linhas no formato fixo COBOL, coluna 7 reservada e codigo entre colunas 8 e 72.
- Separadores de section/topico:
  - `*================================================================*` para DIVISIONs e blocos principais.
  - `*----------------------------------------------------------------*` para SECTIONs e blocos internos.
  - `*- - - - ... - - - -*` para subgrupos de WORKING-STORAGE.
- Comentarios em maiusculas, sem acentos.
- Identadores alinhados em colunas (PIC, VALUE, clausulas adicionais) seguindo o modelo.
- Nomes de variaveis prefixados: `WRK-`, `ACU-`, `FD-`, `FRWKG*`, conforme o padrao do modelo.
- Acumuladores com `PIC 9(009) COMP-3 VALUE ZEROS`.
- File status com `PIC X(002) VALUE SPACES`.
- Indicadores de nulidade com `PIC S9(004) COMP VALUE ZEROS`.
- Mensagens de `DISPLAY` em moldura de asteriscos com o nome do programa.
- Em comandos `MOVE`, a palavra-chave `TO` deve sempre iniciar na coluna 40. Quando houver `OF`, ele deve iniciar na coluna 60 se couber na mesma linha da variavel; caso contrario, quebrar a linha e posicionar `OF` na coluna 40 da linha seguinte.
- As palavras-chave usadas em comandos `IF` como `EQUAL`, `IS NUMERIC`, `NOT`, `GREATER` e `LESS` devem iniciar na coluna 40. Caso não caiba, quebrar uma linha e inserir na coluna 40 da linha abaixo.

## Tratamento de Erros Obrigatorio

- Arquivos: validar `WRK-FS-*` apos cada `OPEN`, `READ`, `WRITE`, `CLOSE` via section dedicada.
- DB2: validar `SQLCODE` e `SQLWARN0` apos cada `EXEC SQL`.
- Validacoes de regra: usar `FRWKGLIV-PARAMETROS` e `9200-FORMATAR-ERRO-LIVRE`.
- Toda situacao de erro deve passar por `9900-TRATAR-ERRO` e abendar via `BRAD0450` apos gravar log via `FRWK2999`.

## Relatorio de Controle (SRELCTRL)

- Emitir cabecalhos `WRK-CABEC1-REL1`, `WRK-CABEC2-REL1` (com data via `POOL7600`) e `WRK-CABEC3-REL1`.
- Emitir uma linha `WRK-LINDET1-REL1` para cada acumulador relevante: registros lidos por arquivo, registros gravados por arquivo, registros lidos por tabela e registros nao encontrados por tabela.

## Checklist Antes de Entregar o Programa

1. Cabecalho preenchido com programa, analista, data, projeto, objetivo, tabelas, arquivos, books e modulos.
2. Todos os arquivos declarados em `FILE-CONTROL`, `FD` e tratados em sections de file status.
3. Todos os copybooks declarados na WORKING-STORAGE.
4. `EXEC SQL INCLUDE` para `SQLCA` e cada DCLGEN usado.
5. Todas as sections numeradas com paragrafo `-99-FIM. EXIT.` final.
6. `MOVE '<nome>' TO FRWKGHEA-IDEN-PARAGRAFO` no inicio de toda section que acessa arquivo ou DB2.
7. Tratamento de nulos para colunas DB2 anulaveis.
8. `4100-EMITIR-SRELCTRL` cobrindo todos os acumuladores declarados.
9. Sections de erro `9100`, `9200`, `9300`, `9900`, `9990`, `9999` presentes e consistentes.
10. Variaveis nao utilizadas ou usadas apenas como receptoras removidas da WORKING-STORAGE, preservando apenas campos referenciados diretamente ou por copybook/area chamada.
11. `STOP RUN` apenas em `4000-FINALIZAR`; demais saidas de erro via `GOBACK` apos `9900-TRATAR-ERRO`.

## Boas Praticas

- Nao introduza dependencias novas sem justificativa funcional.
- Preserve a nomenclatura local: prefixos de sistema, padroes de DDNAME, prefixos de copybooks `I#FRWK*`.
- Reaproveite o framework de erro do Bradesco; nao crie tratamento proprio.
- Mantenha o programa autocontido: nao misture regras de outros programas.
- Remova variaveis nao utilizadas antes de entregar o programa.
- Diferencie no comentario os campos vindos de arquivo, tabela ou parametro.
- Quando faltar copybook ou DCLGEN, registre a pendencia em vez de inventar layout.

## Comando Mental Antes de Comecar

1. Tenho o nome, sistema, autor, data, projeto e objetivo do programa?
2. Tenho a lista completa de arquivos com DDNAME, LRECL e copybook?
3. Tenho a lista de tabelas DB2 com operacoes e DCLGENs?
4. Tenho a lista de parametros e suas validacoes?
5. Tenho a lista de programas externos a serem chamados?
6. Tenho a lista de acumuladores a serem reportados no SRELCTRL?

Somente apos confirmar esses itens, gere o programa seguindo fielmente o modelo `SIST8243`.
