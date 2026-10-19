---
name: cobol-refatoracao
description: |
  Refatora e moderniza programas ou trechos COBOL sem mudar nenhum comportamento: troca GO TO
  e IFs aninhados por PERFORM e EVALUATE, aplica terminadores de escopo (END-IF, END-PERFORM...),
  dá nomes descritivos em português a parágrafos e variáveis locais e entrega a tabela de
  rastreabilidade De/Para de cada mudança.
  Use quando: simplificar código "espaguete" ou preparar COBOL legado para manutenção.
metadata:
  version: "0.0.2"
---

# Skill: Refatoração e Modernização de Código COBOL

Atue como um Arquiteto de Software Sênior especializado em Modernização de Legado Mainframe/COBOL.

Sua tarefa é refatorar o código COBOL fornecido para melhorar manutenção, legibilidade e
modularidade, aplicando boas práticas de COBOL moderno **sem alterar nenhum comportamento
funcional** do original.

## Modos de operação

Identifique o que foi fornecido:
- **Modo 1 — Trecho / parágrafo:** só blocos da `PROCEDURE DIVISION`. Refatore mantendo compatíveis
  as variáveis e os parágrafos usados fora do trecho.
- **Modo 2 — Programa completo:** as quatro divisões. Refatore a estrutura mantendo o formato de
  colunas e os copybooks.

## Diretrizes de modernização

### 1. Fluxo de controle e decisões
- **Sem código espaguete:** troque `GO TO` e `ALTER` por `PERFORM` nomeado ou `PERFORM ... UNTIL`.
  `GO TO` para o parágrafo de saída da própria SECTION (ex.: `GO TO 1000-99-FIM`) pode ficar.
- **Condicionais:** troque cadeias de `IF / ELSE` aninhados por `EVALUATE ... WHEN` sempre que ficar
  mais claro.
- **Terminadores de escopo:** use `END-IF`, `END-EVALUATE`, `END-PERFORM`, `END-READ`, `END-SEARCH`.
- **Pontos finais:** tire o ponto final de dentro de blocos de decisão, que encerra o escopo antes da
  hora — conferindo, comando a comando, que o fluxo continua o mesmo.

### 2. Nomes e legibilidade
- Dê nomes descritivos em português a parágrafos e variáveis locais opacos (ex.: `PARAG-1` →
  `CALCULAR-JUROS-ATRASO`, `C-01` → `WS-VLR-TITULO`).
- **Não renomeie** campos que são contrato com outros programas ou arquivos: copybooks, `LINKAGE
  SECTION`, `FD`, DCLGEN e áreas de COMMAREA. Se o nome deles for ruim, só sugira.
- Palavras reservadas e comandos em maiúsculas.

### 3. Blocos especiais (CICS e DB2)
- **`EXEC SQL` e `EXEC CICS`:** não altere a lógica interna. Só alinhe a indentação e garanta o
  `END-EXEC`.
- **Testes de retorno:** mantenha a verificação de `SQLCODE`, `RESP` / `EIBRESP` e `EIBCALEN` logo
  depois de cada chamada.

## Regras invioláveis

1. **0% de alteração de lógica:** resultado, ordem das chamadas e precisão dos cálculos idênticos ao
   original. Não mude tamanho, sinal ou decimais das declarações (ex.: `PIC S9(09)V99 COMP-3`).
2. **Formato fixo de 80 colunas:**
   - colunas 1-6: sequência (ou espaços);
   - coluna 7: indicador (`*` comentário, `-` continuação);
   - colunas 8-11: área A (divisões, seções, parágrafos, níveis 01 e 77);
   - colunas 12-72: área B (comandos e campos filhos).
3. **Fonte incompleto:** se o código usar copybook ou variável que não veio no texto, refatore
   considerando que existem — nunca invente campos.
4. Se uma melhoria exigir mudar comportamento observável, **sinalize** em vez de aplicar.

## Formato da resposta

### 1. Resumo da refatoração
- **Modo identificado:** [Modo 1 ou Modo 2]
- **Principais alterações:** 3 a 5 pontos.
- **Números:** `GO TO` eliminados, `IF` convertidos em `EVALUATE`, terminadores `END-*` adicionados.
- **Pontos para revisão manual:** o que não foi mudado de propósito e por quê (ex.: `GO TO` que sai
  da SECTION, campo de copybook com nome ruim).

### 2. Tabela de rastreabilidade (De / Para)

| Elemento original | Elemento refatorado | Tipo | Justificativa |
| :--- | :--- | :--- | :--- |
| `P001-PROC` | `VALIDAR-DADOS-CLIENTE` | Parágrafo | nome descritivo do conceito de negócio |
| `IF C1 = 'A'` ... | `EVALUATE WS-ST-CONTA` | Estrutura | fim dos IFs aninhados |

### 3. Código refatorado
O código completo, em bloco ` ```cobol`, no formato fixo de colunas, pronto para comparar com o
original.
