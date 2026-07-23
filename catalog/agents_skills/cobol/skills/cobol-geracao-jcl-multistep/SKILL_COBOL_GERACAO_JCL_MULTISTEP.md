---
name: cobol-geracao-jcl-multistep
description: |
  Gera JCL (Job Control Language) multi-STEP para z/OS encadeando SORT (`SORTD`),
  chamadas de programa aplicativo (`EXEC PGM=`) e unload de tabela DB2 via HPU
  (`DB2A1HPU`), com passagem de dataset entre STEPs (`DSN=*.STEPx.DDNAME`).
  Use quando: o job precisar de mais de um STEP encadeado (ordenação, execução de
  programa e/ou unload DB2 no mesmo job) — para compilação/link-edit/execução simples
  de um único programa use `cobol-geracao-jcl`.
metadata:
  version: "0.0.1"
---

# Skill: Geração de JCL Multi-STEP (SORT, Programa, Unload DB2)

Atue como um especialista em mainframe, JCL, DB2 z/OS, SORT e padrões batch do ambiente.

Sua tarefa é gerar um job JCL completo, consistente e pronto para revisão técnica, encadeando
os STEPs necessários — ordenação (`SORTD`), execução de programa aplicativo (`EXEC PGM=`) e/ou
unload de tabela DB2 (`DB2A1HPU`) — seguindo o mesmo estilo de nomenclatura, comentários,
organização de STEPs/DDs/SYSOUTs/SYSUDUMP e alocação de arquivos do ambiente.

## Quando usar

- Job com mais de um STEP que precisa encadear saída de um passo como entrada do próximo
  (`DSN=*.STEPx.DDNAME`).
- Job que ordena/formata arquivo (`SORTD`), ou que faz unload de tabela DB2 (`DB2A1HPU`).

## Quando não usar

- Job de compilação + link-edit + execução de um único programa COBOL → use `cobol-geracao-jcl`.

## Como usar esta skill

Informe no contexto (registre como `[A DEFINIR]` o que não for informado — nunca invente):

- **Objetivo do job** e **frequência** (diária/mensal/eventual/outra).
- **Nome do job** e **JOB card** (ou usar o padrão: `//JOBX0000 JOB 'JOBX,4510,PR31','B460076',MSGCLASS=Z,SCHENV=BATCH`,
  onde `JOBX` são as 4 primeiras letras do nome do job).
- **Entradas conhecidas**: arquivos/datasets, versões, LRECL.
- **Saídas esperadas**: arquivos/datasets, versões, LRECL.
- **Programas a chamar**: STEP, programa, finalidade, DDs de entrada/saída, tabelas atualizadas.
- **Ordenações SORTD necessárias**: STEP, entrada, saída, LRECL, chave (posição, tamanho, tipo, ordem).
- **Unloads HPU necessários**: STEP, tabela (`DB2PRD.TABELA`), tablespace, filtro `WHERE`, saída
  `SYSREC00`, LRECL.

Ver os templates de cada tipo de STEP em [`references/PADROES_STEPS.md`](references/PADROES_STEPS.md).

## Regras de qualidade

1. Não invente programas, tabelas, campos, arquivos ou LRECL quando não forem informados — marque
   como `[A DEFINIR]`.
2. Preserve o alinhamento visual típico de JCL; nomes de DD com até 8 caracteres; continuações com
   `//       `.
3. Garanta que todo arquivo intermediário produzido por um STEP e consumido depois esteja
   referenciado corretamente (`DSN=*.STEPx.SORT.SORTOUT`, `DSN=*.STEPx.HPU.SYSREC00`, etc.).
4. Garanta que cada `SORTD` tenha `SORTIN`, `SORTOUT`, `SYSOUT`, `SYSUDUMP` e `SYSIN`.
5. Garanta que cada `DB2A1HPU` tenha `SYSPUNCH`, `SYSREC00`, `SYSTSIN`, `SYSIN`, `SYSTSPRT`,
   `SYSPRINT`, `LISTING`, `SYSUDUMP` e `SYSOUT`.

## Retorne

1. O JCL completo em bloco ` ```jcl` .
2. Uma seção curta "Validações" com os principais pontos conferidos (regras de qualidade acima).
