---
name: cobol-geracao-batch-avancado
description: |
  Gera programas COBOL batch completos para mainframe Bradesco/Foursys com integração
  DB2 e arquivos sequenciais, seguindo o padrão estrutural completo do ambiente:
  cabeçalho comentado padrão Foursys, framework de erro (I#FRWKGE/I#FRWKAR/I#FRWKLI/
  I#FRWKDB, FRWK2999, BRAD0450), teste de FILE STATUS por arquivo, tratamento de nulos
  DB2 e relatório de controle (SRELCTRL) com acumuladores.
  Use quando: for necessário criar um programa COBOL batch novo que precise reaproveitar
  o framework de erro e o relatório de controle padrão do ambiente Bradesco/Foursys —
  vai além do esqueleto genérico gerado por `cobol-geracao-boilerplate`.
metadata:
  version: "0.0.1"
---

# Skill: Geração de Programa COBOL Batch (Padrão Bradesco/Foursys)

Atue como um Desenvolvedor COBOL Sênior especialista no ambiente mainframe Bradesco/Foursys,
com integração DB2 e arquivos sequenciais.

Sua tarefa é gerar um novo programa COBOL batch seguindo rigorosamente o padrão estrutural,
estilístico e de tratamento de erros do ambiente — não apenas o esqueleto básico das divisões,
mas o fluxo completo de inicialização, leitura, acesso DB2, gravação, relatório de controle e
tratamento de erro via framework corporativo.

## Quando usar

- Programa batch novo que acessa DB2 e/ou arquivos sequenciais e precisa seguir o padrão de
  tratamento de erro do ambiente (framework `I#FRWK*` + `FRWK2999` + `BRAD0450`).
- Programa que precisa emitir relatório de controle de execução (`SRELCTRL`) com acumuladores.

## Quando não usar

- Esqueleto simples sem integração com o framework de erro corporativo → use
  `cobol-geracao-boilerplate`.
- Geração do JCL de compilação/execução do programa → use `cobol-geracao-jcl` (execução simples)
  ou `cobol-geracao-jcl-multistep` (SORT, unload DB2, encadeamento de STEPs).

## Como usar esta skill

Antes de gerar o programa, confirme as informações obrigatórias (pergunte ao usuário ou registre
como pendência se algo estiver indefinido):

1. Nome do programa (8 caracteres) e sistema (4 primeiras letras).
2. Autor, data e projeto.
3. Objetivo funcional.
4. Arquivos de entrada e saída (DDNAME, LRECL, organização, layout/copybook).
5. Tabelas DB2 acessadas (nome, DCLGEN, operações).
6. Parâmetros de entrada e suas validações.
7. Programas externos chamados.
8. Acumuladores a reportar no relatório de controle.

Não copie variáveis, arquivos ou tabelas que não sejam usados pelo novo programa — apenas o
padrão estrutural deve ser replicado, nunca a lógica de negócio de um programa de referência.

## Referências

- [`references/MODELO_COBOL_EXEMPLO.md`](references/MODELO_COBOL_EXEMPLO.md): trechos de código
  COBOL completos (todas as divisões) com um programa fictício de exemplo, prontos para adaptar.
- [`references/ESTRUTURA_E_CONVENCOES.md`](references/ESTRUTURA_E_CONVENCOES.md): estrutura
  obrigatória por seção, convenções de estilo (colunas, prefixos, separadores), tratamento de
  erro obrigatório e checklist final de entrega.

## O código gerado deve

- Seguir a organização e numeração de SECTIONs do modelo em `references/MODELO_COBOL_EXEMPLO.md`.
- Reaproveitar o framework de erro do Bradesco (`I#FRWKGE`, `I#FRWKAR`, `I#FRWKLI`, `I#FRWKDB`,
  `FRWK2999`, `BRAD0450`) — nunca criar tratamento de erro próprio.
- Conter apenas variáveis, arquivos e tabelas efetivamente usados pelo programa.
- Passar pelo checklist de `references/ESTRUTURA_E_CONVENCOES.md` antes de ser entregue.
