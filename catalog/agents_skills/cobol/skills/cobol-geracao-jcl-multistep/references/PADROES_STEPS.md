# Padrões de STEP para JCL Multi-STEP

## Bibliotecas padrão (JOBLIB)

- `AC.BIBGERAL`
- `DB2A1.R2.DSNLOAD`
- `SYS1.CEE.SCEERUN`

## Padrão de cabeçalho esperado

```jcl
//JOBX0000 JOB 'JOBX,4510,PR31','B460076',MSGCLASS=Z,SCHENV=BATCH
//JOBLIB   DD DSN=AC.BIBGERAL,DISP=SHR
//         DD DSN=DB2A1.R2.DSNLOAD,DISP=SHR
//         DD DSN=SYS1.CEE.SCEERUN,DISP=SHR
//*
//* ***           FREQUENCIA : [FREQUENCIA]
//* ***    [DESCRICAO DO JOB]
//*
```

`JOBX0000` é apenas um placeholder — `JOBX` são as 4 primeiras letras do nome real do job.

## Padrão para passo de ordenação (SORTD)

```jcl
//STEPn    EXEC SORTD
//*
//* ***    [DESCRICAO DA CLASSIFICACAO OU FORMATACAO]
//*
//SORTIN   DD DSN=[ARQUIVO-ENTRADA],
//       DISP=SHR
//SORTOUT  DD DSN=[ARQUIVO-SAIDA](+1),
//       DISP=(,CATLG,DELETE),
//       UNIT=DISCO,
//       SPACE=(TRK,(20000,8000),RLSE),
//       DCB=(AC.A,LRECL=[LRECL],RECFM=FB)
//SYSOUT   DD SYSOUT=*
//SYSUDUMP DD SYSOUT=Y
//SYSIN    DD *
 SORT FIELDS=([CAMPOS-DE-ORDENACAO]),FORMAT=[BI/PD/CH]
 [OUTREC/INREC/OMIT/INCLUDE, SE NECESSARIO]
 END
//*
```

## Padrão para chamada de programa aplicativo

```jcl
//STEPn    EXEC PGM=[PROGRAMA]
//*
//* ***    [DESCRICAO DO PROGRAMA]
//* ***    ////// ATUALIZA A TABELA [TABELA] //////
//*
//[DDENTR] DD DSN=*.STEPx.SORT.SORTOUT,
//       DISP=SHR
//[DDSAIDA] DD DSN=[ARQUIVO-SAIDA](+1),
//       DISP=(,CATLG,DELETE),
//       UNIT=DISCO,
//       SPACE=(TRK,(20000,8000),RLSE),
//       DCB=(AC.A,LRECL=[LRECL],RECFM=FB)
//SYSOUT   DD SYSOUT=*
//SYSUDUMP DD SYSOUT=Y
//*
```

## Padrão para unload DB2 com HPU

```jcl
//STEPn    EXEC DB2A1HPU
//*
//* ***    UNLOAD DA TABELA [TABELA] - [DESCRICAO]
//*
//SYSPUNCH DD DSN=[ARQUIVO-SYSPUNCH](+1),
//       DISP=(,CATLG,DELETE),
//       UNIT=DISCO,
//       SPACE=(TRK,(20000,8000),RLSE),
//       DCB=(AC.A)
//SYSREC00 DD DSN=[ARQUIVO-UNLOAD](+1),
//       DISP=(,CATLG,DELETE),
//       UNIT=DISCO,
//       SPACE=(TRK,(20000,8000),RLSE),
//       DCB=(AC.A,LRECL=[LRECL],RECFM=FB)
//SYSTSIN  DD DSN=DB2A1.R2.SYSIN(DSNTIAUL),
//       DISP=SHR
//SYSIN    DD *
 UNLOAD TABLESPACE [DATABASE].[TABLESPACE]
 DB2 NO
 QUIESCE YES
 SELECT [COLUNAS]
 FROM DB2PRD.[TABELA]
 WHERE [CONDICOES]
 OUTDDN ( SYSREC00 )
 LOADDDN SYSPUNCH
 FORMAT DSNTIAUL
//SYSTSPRT DD SYSOUT=*
//SYSPRINT DD SYSOUT=*
//LISTING  DD SYSOUT=*
//SYSUDUMP DD SYSOUT=Y
//SYSOUT   DD SYSOUT=*
//*
```

## Regras estruturais obrigatórias

1. Iniciar com JOB card e JOBLIB.
2. Usar comentários `//*` para separar blocos.
3. Documentar a frequência e o objetivo geral do job no cabeçalho.
4. Para cada STEP, incluir comentário explicando a finalidade do processamento.
5. Nomear passos sequencialmente como `STEP1`, `STEP2`, `STEP3`, etc.
6. Quando houver ordenação ou formatação de arquivo, usar `EXEC SORTD`.
7. Quando houver execução de programa aplicativo, usar `EXEC PGM=NNNNNNNN`.
8. Quando houver unload DB2, usar `EXEC DB2A1HPU`.
9. Encadear saídas de passos anteriores usando referências JCL no padrão
   `DSN=*.STEPx.SORT.SORTOUT`, `DSN=*.STEPx.HPU.SYSREC00` ou `DSN=*.STEPx.NOMEDD`, conforme aplicável.
10. Incluir `SYSOUT DD SYSOUT=*` e `SYSUDUMP DD SYSOUT=Y` nos passos batch, salvo quando houver
    padrão específico.
11. Para arquivos de saída catalogados, usar `DISP=(,CATLG,DELETE)`, `UNIT=DISCO`,
    `SPACE=(TRK,(20000,8000),RLSE)`, `DCB=(AC.A,LRECL=nnnn,RECFM=FB)`.
12. Para arquivos de entrada existentes, usar `DISP=SHR`, exceto quando o passo exigir `DISP=OLD`.
