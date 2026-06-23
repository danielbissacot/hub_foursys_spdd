---
name: cobol-cr-cnpj
description: >
  Realiza code review das alterações de CNPJ alfanumérico em programas COBOL de qualquer projeto/centro de custo.
  Verifica se MOVEs antigos foram comentados, se TODOS os novos MOVEs usam campos com sufixo -ST ou _ST,
  se o cabeçalho de alteração está presente (REMARKS opcional - gera aviso), e se 100% dos MOVEs de CNPJ/CPF 
  foram migrados (validação crítica R5). Gera relatório Markdown com status OK/Não OK por programa. 
  Aciona em pedidos como "fazer code review CNPJ", "analisar alterações CNPJ alfanumerico",
  "revisar programa COBOL CNPJ", "code review COBOL", "auditar alterações CNPJ ALPHA NUMERICO".
metadata:
  version: "0.0.1"
---

# COBOL Code Review — CNPJ Alfanumérico

Este skill realiza code review das alterações de adequação ao **CNPJ Alfanumérico** em programas COBOL
de qualquer projeto ou centro de custo, validando se as regras de codificação foram seguidas corretamente.

---

## ⛔ REGRAS DE EXECUÇÃO OBRIGATÓRIAS (NÃO NEGOCIÁVEIS)

O agente DEVE seguir estritamente as regras abaixo. **Qualquer desvio invalida o code review e o relatório deve ser descartado.**

### Proibições Absolutas

1. **PROIBIDO criar, sugerir, propor ou executar scripts de qualquer linguagem** (PowerShell, Python, Bash, Node, AWK, SED, regex automatizado em lote, pipelines de shell, etc.) para realizar a análise, contagem, filtragem ou pré-processamento dos programas. A validação é **exclusivamente** feita pelo LLM lendo o conteúdo de cada arquivo via `read_file`.
   - ❌ Não escreva `.ps1`, `.py`, `.sh`, `.bat` para "acelerar" a análise.
   - ❌ Não use `run_in_terminal` com `Select-String`, `grep`, `findstr`, `awk`, `sed`, `rg` para validar regras.
   - ❌ Não proponha ao usuário rodar um script "para ganhar tempo".
2. **PROIBIDO resumir, amostrar, agrupar ou pular programas.** Se foram identificados N programas, **os N programas devem ser lidos integralmente e validados individualmente pelo LLM — um por um, sem exceção.**
   - ❌ Não diga "analisei uma amostra representativa".
   - ❌ Não diga "os demais seguem o mesmo padrão".
   - ❌ Não pare em 10, 20, 50 programas alegando limite de contexto — continue até o último.
3. **PROIBIDO consolidar análises entre programas** (ex: "os programas X, Y e Z seguem o mesmo padrão, portanto têm o mesmo status"). Cada programa é analisado de forma **totalmente independente**, com leitura própria e veredito próprio na tabela final.
4. **PROIBIDO inferir resultados** a partir de nomes de arquivos, tamanho, prefixo, similaridade com outros programas ou conhecimento prévio. O status (🟢/🔴) de cada programa **deve vir exclusivamente da leitura real do seu conteúdo** nesta execução.
5. **PROIBIDO usar ferramentas de busca em massa** (`grep_search` global no workspace, `file_search` para conteúdo, etc.) como substituto da leitura completa do programa. Buscas pontuais **dentro de um único arquivo já aberto** são permitidas como apoio, nunca como substituição da análise LLM linha-a-linha.
6. **PROIBIDO encerrar a tarefa antes de processar todos os arquivos.** Não há atalho. Não peça ao usuário para "confirmar se deve continuar" — apenas continue.

### Obrigações Absolutas

7. **OBRIGATÓRIO ler 100% do conteúdo** de cada programa antes de emitir o veredito. Use `read_file` com faixas amplas (idealmente o arquivo inteiro em uma única leitura; múltiplas leituras sequenciais se o arquivo for grande até cobrir todas as linhas).
8. **OBRIGATÓRIO processar TODOS os programas** identificados, mesmo que sejam dezenas, centenas ou milhares. **Sem limite máximo.** Prossiga sequencialmente, um programa por vez, até concluir o último da lista.
9. **OBRIGATÓRIO um veredito independente por programa** na tabela final — **uma linha por arquivo**, com Tag, Status, Regras Violadas e Avisos próprios derivados da leitura individual.
10. **OBRIGATÓRIO que a contagem de linhas da tabela final seja igual à contagem de arquivos identificados no Passo 1.** Antes de entregar o relatório, conte: se `linhas_da_tabela != total_de_arquivos`, o relatório está incompleto e você deve voltar a ler os arquivos faltantes.

### Auto-verificação Obrigatória Antes de Entregar

Antes de emitir o relatório final, o agente DEVE confirmar internamente:

- [ ] Listei todos os arquivos no Passo 1? Quantos? → **N**
- [ ] Chamei `read_file` para cada um dos **N** arquivos? 
- [ ] A tabela final contém exatamente **N** linhas (uma por programa)?
- [ ] Nenhum script foi criado ou executado para a análise?
- [ ] Nenhum programa foi marcado por inferência/similaridade (todos por leitura real)?

Se qualquer item falhar, **NÃO entregue o relatório** — retorne ao passo pendente e complete.

---

## Contexto do Projeto

Qualquer projeto/centro de custo COBOL que precise suportar o novo formato de CNPJ alfanumérico (letras + números)
deve seguir o padrão de alteração abaixo. A mudança principal consiste em:

1. **Comentar** os MOVEs antigos que usavam campos numéricos de CNPJ/CPF.
2. **Substituir** por novos MOVEs que utilizam os campos com sufixo `-ST` ou `_ST` de todos os campos de CNPJ/CPF (variantes alfanuméricas).
3. **Documentar** a alteração com um cabeçalho padrão tagueado com a **tag do responsável** (colunas 1–6).

### Padrão de Tags nas Colunas 1–8

Cada time/fábrica/centro de custo usa uma **tag própria** de até 6 caracteres nas colunas 1–6 para identificar
suas linhas. A coluna 7 define se a linha é ativa ou comentada.

> A tag é um identificador de até 6 caracteres usado pelo time responsável pela alteração.

> **Identificação automática da tag:** Ao analisar um arquivo, detecte qual(is) tag(s) aparecem
> repetidamente nas colunas 1–6 em linhas relacionadas a CNPJ/CPF (ativas e comentadas). Essas são as
> **tags de alteração do projeto**. Não presuma uma tag fixa — ela varia por centro de custo.

> **Regra geral de comentário COBOL:** `*` na **coluna 7** indica linha de comentário,
> independentemente da tag usada nas colunas 1–6.
>
> - `TAG___*` (cols 1–6 = tag, col 7 = `*`) → linha **comentada** pelo responsável da tag.
> - `TAG___ ` (cols 1–6 = tag, col 7 = ` `) → linha **ativa** inserida pelo responsável da tag.

### Campos de CNPJ/CPF Monitorados

Os campos que pertencem ao domínio CNPJ/CPF e devem ter suas referências revisadas:

| Padrão de Campo | Exemplos |
|-----------------|---------|
| `CCGC-CPF` | `CCGC-CPF`, `WRK-CCGC-CPF`, `XFER-CCGC-CPF` |
| `CFLIAL-CGC` | `CFLIAL-CGC`, `WRK-CFLIAL-CGC` |
| `CCTRL-CPF-CGC` | `CCTRL-CPF-CGC`, `CCTRL-CGC-CPF` |
| `CNPJ` | `WRK-CNPJ`, `TPO-CNPJ` |
| `CGC` (isolado) | `TPO-CGC`, `WRK-CGC` — apenas quando o campo claramente representa CNPJ |
| `qualquer campo com "CPF" ou "CNPJ" no nome` | `WRK-CPF`, `TPO-CPF`, `WRK-CNPJ-ALT` |


### Sufixos da Variante Alfanumérica

- `-ST` → ex: `CCGC-CPF-ST`, `CFLIAL-CGC-ST`, `CCTRL-CPF-CGC-ST`
- `_ST` → ex: `CCGC_CPF_ST` (variante com underscore)

> Campos terminados em `-ST-NULL` são **indicadores de nulo** (tipo COMP) e **não** são campos de movimentação — ignorar nesta análise.

---

## Regras de Validação

### R1 — Cabeçalho de Alteração Presente

O programa deve conter um bloco de cabeçalho de alteração tagueado (com a tag do responsável nas colunas 1–6),
contendo obrigatoriamente:

```cobol
TAGXXX*================================================================*
.     *                      A L T E R A C A O                         *
.     *================================================================*
.     * DATA.......: DD.MM.AAAA                                        *
.     * RESPONSAVEL: <nome>                                            *
.     * OBJETIVO...: FORMATO DO CNPJ PASSARA A ACEITAR LETRAS E NUMEROS*
.     * REMARKS....: <tag>                                             *
TAGXXX*================================================================*
```

Onde `TAGXXX` é a tag usada pelo time responsável (qualquer identificador de até 6 caracteres).

**Critério de aprovação (OBRIGATÓRIOS):**
- Ao menos um bloco delimitado por `TAG___*===*` (qualquer tag de 1–6 chars + `*===`), E
- Ao menos uma linha com `DATA.......`, E
- Ao menos uma linha com `RESPONSAVEL`, E
- Ao menos uma linha com `OBJETIVO` mencionando CNPJ ou letras/alfanumerico

**Campo OPCIONAL (gera ⚠️ aviso se ausente, mas não reprova):**
- `REMARKS` - Se ausente, programa continua OK mas com aviso: `⚠️ REMARKS ausente no cabeçalho`

**Violação (reprova):** Nenhum cabeçalho de alteração CNPJ encontrado **OU** campos obrigatórios ausentes (DATA/RESPONSAVEL/OBJETIVO).

**Aviso (não reprova):** Cabeçalho presente com campos obrigatórios, mas sem REMARKS.

---

### R2 — MOVEs Antigos de Campos CNPJ/CPF Estão Comentados

Quando um campo de CNPJ/CPF (sem sufixo `-ST`/`_ST`) **estava** sendo movimentado, a linha original deve
ter sido **comentada** — coluna 7 = `*` — e a tag do responsável deve aparecer nas colunas 1–6.

**Critério de aprovação:**  
Não deve existir nenhuma linha **ativa** (coluna 7 ≠ `*`) com instrução `MOVE` cujo source **ou** destination
seja um campo de CNPJ/CPF **sem** o sufixo `-ST` ou `_ST`.

**Violação exemplo:**
```cobol
           MOVE CCGC-CPF    OF WRK-AREA TO TPO-CCGC.    ← ATIVO sem -ST: VIOLAÇÃO
```

**Correto (comentado + substituído):**
```cobol
TAGXXX*   XMOVE CCGC-CPF      OF WRK-AREA TO TPO-CCGC.     ← comentado pela tag do time
TAGXXX     MOVE CCGC-CPF-ST   OF WRK-AREA TO TPO-CCGC-CHAR. ← novo com -ST
```

> **Exceção:** MOVEs em que o campo sem `-ST` está sendo movido **para** uma variável de trabalho
> intermediária numérica (ex: comparação IS NUMERIC) podem ser aceitáveis se contextualizados.
> Marcar como **aviso** (`⚠️`) em vez de violação, descrevendo o contexto.

---

### R3 — Novos MOVEs Usam a Variante -ST ou _ST

Para cada MOVE comentado (coluna 7 = `*`) com tag do responsável que envolvia um campo CNPJ/CPF,
deve existir um MOVE ativo correspondente usando o campo com sufixo `-ST` ou `_ST`.

**Critério de aprovação:**  
Para cada linha `TAG___*  MOVE <CAMPO-SEM-ST>` comentada, deve existir nas proximidades (até 10 linhas
abaixo) uma linha `TAG___   MOVE <CAMPO-COM-ST>` ativa.

**Violação:** MOVE antigo comentado mas sem o MOVE com `-ST` correspondente.

**Correto:**
```cobol
 TAGXXX****XMOVE CFLIAL-CGC    OF WRK-AREA TO TPO-CFIL.      ← comentado
 TAGXXX     MOVE CFLIAL-CGC-ST OF WRK-AREA(2:4)               ← novo com -ST
 TAGXXX                                    TO TPO-CFIL-CHAR.
```

---

### R4 — Nenhum MOVE Ativo com Campo CNPJ/CPF Sem -ST Sem Tag de Responsável

Linhas de MOVE **ativas** (coluna 7 ≠ `*`) que envolvam campos CNPJ/CPF devem:
- Usar obrigatoriamente o campo com sufixo `-ST` ou `_ST`, **e**
- Estar tagueadas (qualquer tag de alteração CNPJ detectada no arquivo) nas colunas 1–6.

**Violação:** MOVE ativo, sem nenhuma tag de responsável, usando campo CNPJ/CPF sem `-ST`.

---

### R5 — TODOS os MOVEs de CNPJ/CPF Usam Campos -ST (VALIDAÇÃO CRÍTICA)

**Se o programa possui cabeçalho de alteração CNPJ (R1 aprovado), TODOS os MOVEs envolvendo campos CNPJ/CPF devem usar a variante -ST ou _ST.**

**Critério de aprovação:**
- R1 aprovado (tem cabeçalho de alteração CNPJ) **E**
- **NENHUM** MOVE **ativo** (coluna 7 = espaço) usa campo CNPJ/CPF **sem** sufixo `-ST` ou `_ST`
- **TODOS** os MOVEs ativos com CNPJ/CPF usam obrigatoriamente campos terminados em `-ST` ou `_ST`

**Violação:** Programa tem cabeçalho de alteração CNPJ mas existe pelo menos UM MOVE ativo usando campo CNPJ/CPF sem `-ST`.

**Motivo:** Garante que **100% dos MOVEs** de CNPJ/CPF foram migrados para campos alfanuméricos, não apenas alguns.

**Exemplos de campos -ST válidos:**
- `CCGC-CPF-ST`
- `CFLIAL-CGC-ST`
- `CCTRL-CPF-CGC-ST`
- `WRK-CNPJ-ST`
- `TPO-CPF-ST`
- Qualquer variante com `_ST` (ex: `CCGC_CPF_ST`)

**Campos CNPJ/CPF monitorados (mesma lista de R2):**
- `CCGC-CPF` (e variantes: `WRK-CCGC-CPF`, `XFER-CCGC-CPF`, etc.)
- `CFLIAL-CGC` (e variantes)
- `CCTRL-CPF-CGC` (e variantes)
- `CNPJ` (isolado ou composto: `WRK-CNPJ`, `TPO-CNPJ`)
- `CPF` (isolado ou composto: `WRK-CPF`, `TPO-CPF`)
- `CGC` (quando claramente representa CNPJ)

**Exceção:** Se o programa **NÃO** possui cabeçalho de alteração CNPJ (R1 reprovado), R5 não se aplica.

---

## Procedimento de Code Review

### Passo 1 — Identificar os Arquivos a Revisar

Use os arquivos indicados pelo usuário. Se nenhum foi especificado, liste **TODOS** os arquivos COBOL (`.txt`, `.cbl`, `.cob`)
na pasta indicada ou no workspace atual usando `file_search` ou `list_dir` (**apenas para listagem de nomes, nunca para análise de conteúdo**).

**IMPORTANTE:**
- Processar **TODOS** os arquivos encontrados — **sem amostragem, sem limite, sem agrupamento, sem pular**.
- **Não use scripts** (PowerShell/Python/Bash/etc.) para filtrar, contar, pré-processar ou validar. Apenas listar nomes.
- **Registre o número total N** de arquivos encontrados. Esse N é o número exato de linhas que a tabela final deve ter.
- Se N for grande (50+, 100+, 500+), **continue mesmo assim** — não há atalho permitido.

### Passo 2 — Detectar a Tag de Alteração do Arquivo

Antes de aplicar as regras, **identifique qual(is) tag(s)** aparecem nas colunas 1–6 em linhas
relacionadas a CNPJ/CPF (tanto ativas quanto comentadas). Essa tag varia por time/centro de custo.
Registre-a no relatório como **"Tag detectada"**.

### Passo 3 — Para Cada Arquivo, Executar as 5 Regras (LLM, um por um)

**IMPORTANTE:**
- Processar **TODOS** os N arquivos identificados no Passo 1, sequencialmente, do primeiro ao último.
- A análise é feita **exclusivamente pelo LLM** lendo o arquivo via `read_file`.
- **Nunca** delegue a validação a scripts, regex em lote, terminal, `grep`, `Select-String` ou ferramentas de busca global.
- **Nunca** pule um arquivo assumindo que "é igual a outro já analisado" — cada um exige leitura própria.
- **Nunca** interrompa a sequência para perguntar ao usuário se deve continuar — apenas continue até o último arquivo.
- Para cada arquivo lido, registre imediatamente um item interno na sua lista de vereditos (Tag, Status, Violações, Avisos) que alimentará a tabela final.

1. **Ler o conteúdo completo** do arquivo via `read_file` (faixa ampla, idealmente o arquivo inteiro).
2. **Aplicar R1:** Verificar presença de bloco de cabeçalho de alteração CNPJ.
   - **Obrigatórios:** Tag + `*===*` + DATA + RESPONSAVEL + OBJETIVO (mencionando CNPJ)
   - **Opcional:** REMARKS (se ausente, registrar aviso ⚠️ mas não reprovar)
   - **Violação R1:** Falta cabeçalho ou campos obrigatórios ausentes
   - **Aviso R1:** Cabeçalho OK mas sem REMARKS
3. **Aplicar R2:** Escanear todas as linhas ativas (coluna 7 ≠ `*`) com `MOVE`.
   - Identificar campos CNPJ/CPF envolvidos.
   - Verificar se possuem sufixo `-ST` ou `_ST`.
   - **Violação R2:** Qualquer MOVE ativo com campo CNPJ/CPF sem `-ST` ou `_ST`.
4. **Aplicar R3:** Para cada MOVE comentado (col 7 = `*`) com campo CNPJ/CPF, verificar se há MOVE ativo com `-ST` nas proximidades (até 10 linhas).
5. **Aplicar R4:** Verificar se MOVEs ativos com campos CNPJ/CPF estão tagueados com a tag detectada.
6. **Aplicar R5 (CRÍTICO):** **SE R1 aprovado (tem cabeçalho CNPJ)**, verificar se **TODOS** os MOVEs de CNPJ/CPF usam campos -ST.
   - Buscar **qualquer** MOVE ativo usando campo CNPJ/CPF **SEM** `-ST` ou `_ST`
   - **Exemplos de violação R5:** 
     - `MOVE CCGC-CPF OF WRK TO ...` (sem -ST)
     - `MOVE ... TO CFLIAL-CGC` (sem -ST)
     - `MOVE WRK-CNPJ TO ...` (sem -ST)
   - **Aprovado R5:** TODOS os MOVEs usam variantes -ST (ex: `MOVE CCGC-CPF-ST ...`)
   - **Exceção:** Se R1 reprovado (sem cabeçalho), R5 não se aplica.
7. **Determinar status:** 
   - 🟢 **OK** - TODAS as regras obrigatórias passaram (pode ter avisos ⚠️)
   - 🔴 **Não OK** - Ao menos uma regra obrigatória violada

### Passo 4 — Gerar o Relatório

**Antes de gerar**, execute a auto-verificação descrita no topo (seção "Auto-verificação Obrigatória Antes de Entregar"). Confirme que a tabela terá exatamente **N** linhas, onde N é o total identificado no Passo 1.

Gerar um relatório Markdown **SIMPLES E OBJETIVO** com o seguinte formato:

---

## Formato do Relatório de Saída

```markdown
# Code Review — CNPJ Alfanumérico

**Data:** DD/MM/AAAA  
**Pasta:** <pasta analisada>

### Regras Validadas:
- **R1** - Cabeçalho de alteração presente (REMARKS opcional - gera aviso se ausente)
- **R2** - MOVEs antigos de campos CNPJ/CPF estão comentados
- **R3** - Para cada MOVE comentado existe MOVE com -ST correspondente
- **R4** - MOVEs ativos com campos CNPJ/CPF estão tagueados
- **R5** - TODOS os MOVEs de CNPJ/CPF usam campos -ST (100% migração)

| Programa | Tag | Status | Regras Violadas | Avisos |
|----------|-----|--------|----------------|--------|
| PROGRAMA001 | TAG1 | 🟢 OK | - | ⚠️ Sem REMARKS |
| PROGRAMA002 | TAG2 | 🔴 Não OK | R1, R2 | - |
| PROGRAMA003 | TAG1 | 🔴 Não OK | R5 | - |
| PROGRAMA004 | TAG2 | 🟢 OK | - | - |

**Total:** 4 programas | **Aprovados:** 2 | **Reprovados:** 2
```

**Regras do relatório:**
- Uma linha por programa na tabela
- Coluna "Regras Violadas": listar apenas os códigos (R1, R2, R3, R4, R5) separados por vírgula, ou "-" se OK
- Coluna "Avisos": listar avisos não críticos (ex: "⚠️ Sem REMARKS"), ou "-" se sem avisos
- Programa com avisos mas sem violações = 🟢 **OK**
- Programa com ao menos uma violação = 🔴 **Não OK**
- SEM texto adicional, SEM tabelas detalhadas por programa, SEM seções individuais
- Relatório direto e objetivo - apenas a tabela resumo

## Exemplos de Código: Correto vs. Incorreto

### ✅ Correto — MOVE comentado + novo MOVE com -ST

> `TAGXXX` representa a tag do time responsável (qualquer identificador de até 6 caracteres)

```cobol
TAGXXX*   XMOVE CCGC-CPF      OF WRK-AREA TO TPO-CCGC.
TAGXXX     MOVE CCGC-CPF-ST   OF WRK-AREA TO TPO-CCGC-CHAR.

TAGXXX*   XMOVE CFLIAL-CGC    OF WRK-AREA TO TPO-CFIL.
TAGXXX     MOVE CFLIAL-CGC-ST OF WRK-AREA(2:4)
TAGXXX                                    TO TPO-CFIL-CHAR.

TAGXXX*   XMOVE CCTRL-CPF-CGC OF WRK-AREA TO TPO-CTRL.
TAGXXX     MOVE CCTRL-CPF-CGC-ST
TAGXXX                        OF WRK-AREA TO TPO-CTRL.
```

### ❌ Incorreto — MOVE ativo sem -ST (R2/R4 violado)

```cobol
           MOVE CCGC-CPF      OF WRK-AREA TO TPO-CCGC.
```

### ❌ Incorreto — MOVE comentado sem substituto -ST (R3 violado)

```cobol
TAGXXX*   XMOVE CCGC-CPF      OF WRK-AREA TO TPO-CCGC.
* (nenhum MOVE CCGC-CPF-ST nas linhas seguintes)
```

### ❌ Incorreto — Sem cabeçalho de alteração (R1 violado)

```cobol
* (arquivo não contém bloco TAG*===* com DATA/RESPONSAVEL/OBJETIVO)
```

### ⚠️ Correto com Aviso — Cabeçalho sem REMARKS (OK mas com aviso)

```cobol
TAGXXX*================================================================*
TAGXXX*                      A L T E R A C A O                         *
TAGXXX*================================================================*
TAGXXX* DATA.......: 15.01.2024                                        *
TAGXXX* RESPONSAVEL: João Silva                                        *
TAGXXX* OBJETIVO...: FORMATO DO CNPJ PASSARA A ACEITAR LETRAS E NUMEROS*
TAGXXX*================================================================*

      * (sem linha de REMARKS - gera aviso mas NÃO reprova)
      * Status: 🟢 OK | Avisos: ⚠️ Sem REMARKS

           PROCEDURE DIVISION.
      * MOVEs corretos com -ST
TAGXXX     MOVE CCGC-CPF-ST OF WRK TO TPO-CHAR.      ✅ Correto
```

### ❌ Incorreto — Cabeçalho presente mas MOVEs de CNPJ/CPF sem -ST (R5 violado)

```cobol
TAGXXX*================================================================*
TAGXXX*                      A L T E R A C A O                         *
TAGXXX*================================================================*
TAGXXX* DATA.......: 15.01.2024                                        *
TAGXXX* RESPONSAVEL: João Silva                                        *
TAGXXX* OBJETIVO...: FORMATO DO CNPJ PASSARA A ACEITAR LETRAS E NUMEROS*
TAGXXX* REMARKS....: TAGXXX                                            *
TAGXXX*================================================================*

           PROCEDURE DIVISION.
           
      * VIOLAÇÃO R5: Programa tem cabeçalho mas ainda usa campos sem -ST
           MOVE CCGC-CPF OF WRK-AREA TO TPO-CCGC.        ❌ Sem -ST
           MOVE CFLIAL-CGC TO WRK-FILIAL.                ❌ Sem -ST
           MOVE WRK-CNPJ TO XFER-CNPJ.                   ❌ Sem -ST
           
      * (violação: documentou a alteração mas não migrou todos os MOVEs)
```

---

## Dicas de Análise

### Diferença entre Violações e Avisos

**🔴 VIOLAÇÃO (reprova o programa):**
- R1: Cabeçalho ausente **OU** campos obrigatórios faltando (DATA/RESPONSAVEL/OBJETIVO)
- R2: MOVE ativo usando campo CNPJ/CPF sem `-ST` ou `_ST`
- R3: MOVE comentado sem correspondente MOVE com `-ST`
- R4: MOVE ativo sem tag de responsável
- R5: Programa com cabeçalho mas pelo menos UM MOVE sem `-ST`

**⚠️ AVISO (não reprova, apenas alerta):**
- R1: Cabeçalho presente com campos obrigatórios OK, mas **sem REMARKS**
  - Status final: 🟢 OK
  - Coluna Avisos: "⚠️ Sem REMARKS"
  - Programa aprovado mas com ressalva documental

### Estrutura COBOL

- **Posição das colunas COBOL fixo:**
  - Colunas 1–6: Tag do responsável pela alteração (varia por time/centro de custo)
  - Coluna 7: `*` indica linha de comentário; espaço indica linha ativa
  - Colunas 8–72: Área de programa (código COBOL)

- **Detectar a tag do arquivo:** Procure nas linhas envolvendo CNPJ/CPF qual sequência de caracteres aparece repetidamente nas colunas 1–6. Essa é a tag do responsável (qualquer identificador de até 6 caracteres).

- **Linha comentada pelo responsável:** `TAGXXX*` — a tag ocupa cols 1–6, o `*` está na col 7.

- **Linha ativa do responsável:** `TAGXXX ` (espaço na col 7) — é código ativo inserido pelo responsável.

- **Campos `-ST-NULL`** (ex: `WRK-CCGC-CPF-ST-NULL`) são indicadores de nulo em formato `COMP` e **não** representam o campo alfanumérico de movimentação — ignorar nas validações R2/R3/R4/R5.

- Campos em definições de `WORKING-STORAGE` (linhas com `PIC`) **não** são verificados pelas regras R2–R5 — apenas instruções `MOVE` na `PROCEDURE DIVISION`.
