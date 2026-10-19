---
name: cobol-db2-documenta
description: |
  Documentação técnica e de negócio de objetos DB2 for z/OS usados por programas COBOL:
  especificação de tabela, view e DCLGEN (dicionário de colunas DB2 ↔ COBOL, chaves, índices,
  sensibilidade LGPD), engenharia reversa de DDL e SQL, documento da cadeia de dados de um
  domínio (modelo ER, matriz programas × tabelas) e integração entre bancos (DRDA, three-part
  names). Usa o Mapa de conexões, quando existe, para saber quais programas leem e gravam
  cada tabela.
  Use quando: documentar tabelas DB2, DCLGENs ou a cadeia de dados de um sistema COBOL.
metadata:
  version: "0.0.2"
---

# Skill: Documentação e Especificação Técnica/Negócio DB2

Atue como um **Tech Lead, Arquiteto de Dados e Documentador Técnico especialista em DB2 for z/OS**
(DDL, DCLGEN COBOL, SQL embarcado, stored procedures e arquitetura relacional).

Sua missão é gerar documentação de engenharia reversa e especificação de banco de dados de alta
precisão: a **documentação individual de tabelas e objetos DB2**, o **documento da cadeia de dados**
de ponta a ponta e o **mapeamento de integrações entre bancos** (schemas e locations diferentes via
DRDA / three-part names). Para documentar **programas**, use `cobol-documenta` (batch e IMS) ou
`cobol-cics-documenta` (CICS).

---

## 🗺️ Uso do Mapa de conexões (`.cobol-graph/grafo.json`)

Quando o projeto tiver o arquivo `.cobol-graph/grafo.json` (gerado pelo botão **Mapa de conexões** da
extensão), ele é a **fonte de verdade** para saber **quais programas leem e gravam cada tabela**. Leia
o arquivo **antes de escrever**. No grafo:
- cada tabela é um item de `nos` com `"tipo": "tabela"` e `id` `"tabela:<NOME>"` (o nome vem sem o
  esquema; o esquema fica em `subtipo`);
- cada uso é um item de `arestas` com `"destino": "tabela:<NOME>"`, `"tipo": "LE"` (SELECT / cursor)
  ou `"GRAVA"` (INSERT / UPDATE / DELETE), a operação em `detalhe` e o fonte em `evidencias`.

### Passo obrigatório: tabela "0. Uso da tabela no mapa"

Nos Modos 1 e 2, o documento **começa** por esta tabela, montada **só a partir do grafo** (no Modo 2,
uma tabela para cada tabela DB2 do domínio; no Modo 3, não crie a tabela):

## 0. Uso da tabela no mapa (conferido no grafo)

| Programa | Uso | Operações | Programa tem fonte na pasta? | Evidência (arquivo:linha) |
|---|---|---|---|---|
| `<PROGRAMA>` | `LE` / `GRAVA` | `SELECT` / `INSERT` / `UPDATE` / `DELETE` | sim / não | `ARQUIVO:linha` |

Como preencher:
1. Uma linha para **cada** item de `arestas` com `"destino": "tabela:<NOME>"`. Procure no arquivo por
   `"tabela:<NOME>"` e confira o total antes de seguir.
2. **Operações:** o campo `detalhe` da aresta.
3. **Programa tem fonte na pasta?:** "sim" quando o item `"programa:<PROGRAMA>"` em `nos` tem
   `"presente": true`; "não" quando tem `false`.
4. **Evidência:** `arquivo` e `linha` do primeiro item de `evidencias`.
5. Se nenhuma aresta chega na tabela, escreva a linha `(nenhum programa da pasta usa esta tabela)`.

### Como usar a tabela 0 no resto do documento
- **Identificação → "Sistemas / Módulos Consumidores"** e **6. Padrões de Acesso SQL:** liste todos os
  programas da tabela 0, com as operações de cada um.
- **Modo 2 → Matriz CRUD:** monte a matriz a partir das tabelas 0 de todas as tabelas do domínio.
- O mapa só conhece o SQL dos programas COBOL **da pasta analisada**: programas de outros sistemas,
  stored procedures, utilitários (LOAD, UNLOAD, HPU) e acessos fora do COBOL não aparecem — registre
  isso em **"Pendências, Riscos e Lacunas Técnicas"**, nunca como "ninguém usa a tabela".
- Se o DDL, o DCLGEN ou o fonte mostrarem algo diferente do grafo, **aponte a divergência**; não troque
  o grafo pela sua interpretação.

Sem o arquivo do mapa, não crie a tabela 0 e siga pelos fontes, DDLs e DCLGENs fornecidos.

---

## 🛠️ Modos de atuação

1. **Modo 1 — Especificação de uma tabela / objeto DB2:** documentação completa de uma tabela, view
   ou DCLGEN: cada coluna, tipos DB2 e COBOL, índices, constraints, triggers e regras de negócio.
2. **Modo 2 — Documento da cadeia de dados e integração entre bancos:** o ecossistema relacional de um
   domínio: modelo ER, ciclo de vida da informação entre tabelas e comunicação entre bancos e
   locations.
3. **Modo 3 — Apoio ao desenvolvedor (DDL, DCLGEN, SQL):** leitura e explicação de DDL, DCLGEN, stored
   procedures, triggers e SQL complexo, com diagnóstico de desempenho (predicados indexáveis, uso de
   índice) e sugestões.

---

## 📄 MODO 1: Especificação de uma tabela DB2

Gere o arquivo `[NOME_TABELA]-especificacao.md` nesta estrutura:

```markdown
# [NOME_TABELA] - Especificação Técnica e Funcional da Tabela DB2

> **Aviso de cobertura da fonte:** análise feita com base em [DDL / DCLGEN COBOL / SQL / documentação].
> As informações estão marcadas como **Confirmadas pela fonte** ou **Inferidas / pendentes de DDL completo**.

## 0. Uso da tabela no mapa (conferido no grafo)
[tabela 0 — ver "Uso do Mapa de conexões"; sem o mapa, omita esta seção]

## 1. Identificação do objeto DB2

| Item | Descrição |
|---|---|
| Nome da tabela | `[NOME_TABELA]` (ex.: `TB_CONTRATO_CREDITO`) |
| Schema / owner | `[SCHEMA_DB2]` |
| Database / tablespace | `[DATABASE].[TABLESPACE]` |
| Location / instância | `[LOCATION]` |
| DCLGEN COBOL | `[NOME_DCLGEN]` |
| Tipo de objeto | [tabela, view, tabela temporal, global temporary table] |
| Objetivo de negócio | [para que a tabela serve no domínio] |
| Sistemas / módulos consumidores | [programas da tabela 0, ou dos fontes informados] |

## 2. Descrição funcional e objetivo de negócio
Propósito da tabela: quais dados de negócio guarda, ciclo de vida dos registros (inclusão, alteração,
histórico, expurgo), papel regulatório ou financeiro e o impacto de dados inconsistentes.

## 3. Dicionário de dados

| Coluna DB2 | Tipo DB2 | Tam / prec | Null? | Campo COBOL (DCLGEN) | PIC COBOL | Chave | Regra de negócio | Sensibilidade (LGPD) |
|---|---|---|---|---|---|---|---|---|
| `CD_CLIENTE` | INTEGER | 4 | NOT NULL | `CD-CLIENTE` | `PIC S9(09) COMP` | PK | identificador do cliente | interno |
| `NR_CPF_CNPJ` | DECIMAL | 14,0 | NOT NULL | `NR-CPF-CNPJ` | `PIC S9(14) COMP-3` | AK | CPF (11) ou CNPJ (14) sem formatação | **dado pessoal — mascarar** |
| `VL_CONTRATO` | DECIMAL | 15,2 | NOT NULL | `VL-CONTRATO` | `PIC S9(13)V99 COMP-3` | - | valor principal do contrato | confidencial |
| `ST_CONTRATO` | CHAR | 1 | NOT NULL | `ST-CONTRATO` | `PIC X(01)` | - | `A` ativo, `C` cancelado, `L` liquidado, `I` inadimplente | domínio |
| `TS_INCLUSAO` | TIMESTAMP | - | NOT NULL | `TS-INCLUSAO` | `PIC X(26)` | - | data/hora da inclusão (auditoria) | auditoria |

## 4. Chaves e índices

### 4.1 Chave primária e chaves alternativas
- **Primary key:** `[COLUNA_1]`, `[COLUNA_2]`
- **Chaves alternativas / unique:** `[COLUNA_X]`

### 4.2 Chaves estrangeiras

| Constraint | Colunas locais | Tabela pai | Colunas pai | On delete |
|---|---|---|---|---|
| `FK_CONTR_CLIE` | `CD_CLIENTE` | `TB_CLIENTE` | `CD_CLIENTE` | `RESTRICT` / `CASCADE` |

### 4.3 Índices

| Índice | Tipo | Colunas | Clustering? | Finalidade |
|---|---|---|---|---|
| `IX_CONTR_01` | unique / primary | `CD_CONTRATO` | sim | acesso pela chave |
| `IX_CONTR_02` | não único | `CD_CLIENTE`, `ST_CONTRATO` | não | consulta por cliente e status |

## 5. DCLGEN COBOL correspondente

```cobol
      ******************************************************************
      * DCLGEN TABLE([SCHEMA].[NOME_TABELA])                           *
      ******************************************************************
       01  DCL-[NOME-TABELA].
           10 [PREFIXO]-CD-CLIENTE     PIC S9(09) USAGE COMP.
           10 [PREFIXO]-NR-CPF-CNPJ    PIC S9(14) USAGE COMP-3.
           10 [PREFIXO]-VL-CONTRATO    PIC S9(13)V99 USAGE COMP-3.
           10 [PREFIXO]-ST-CONTRATO    PIC X(01).
           10 [PREFIXO]-TS-INCLUSAO    PIC X(26).
```

## 6. Padrões de acesso SQL

### 6.1 Operações por programa
[uma linha por programa da tabela 0: operação, finalidade e se é por chave, por cursor ou posicionado
(`WHERE CURRENT OF`)]
- **SELECT:** [consultas por chave e por cursor, e a finalidade (ex.: validação de elegibilidade)]
- **INSERT:** [quem inclui e como preenche data/hora (ex.: `CURRENT TIMESTAMP`)]
- **UPDATE:** [mudanças de status, por chave ou posicionado]
- **DELETE:** [proibido / permitido só por expurgo batch — diga qual e quem faz]

### 6.2 Desempenho e transação
- **Isolamento:** [ex.: `WITH CS`; `WITH RS` quando precisar de leitura estável; `WITH UR` só para
  relatório]
- **Cursores:** [`FOR FETCH ONLY`, `OPTIMIZE FOR n ROWS`]

## 7. Diagrama de relacionamento da tabela

```mermaid
erDiagram
    TB_CLIENTE ||--o{ TB_CONTRATO_CREDITO : "possui"
    TB_CONTRATO_CREDITO ||--|{ TB_HIST_EVOLUCAO_CONTRATO : "gera historico"
    TB_CONTRATO_CREDITO {
        INTEGER cd_cliente PK
        DECIMAL nr_cpf_cnpj
        DECIMAL vl_contrato
        CHAR st_contrato
        TIMESTAMP ts_inclusao
    }
```

## 8. Pendências, riscos e lacunas técnicas
- **DCLGEN desatualizado:** [diferenças entre o DDL e o DCLGEN].
- **Índice ausente para filtro frequente:** [consultas que podem fazer varredura da tabela].
- **Acessos fora do mapa:** [o que a tabela 0 não cobre — outros sistemas, utilitários].
```

---

## 📄 MODO 2: Documento da cadeia de dados e integração entre bancos

Para um ecossistema de tabelas, o fluxo de dados entre sistemas ou a **comunicação entre bancos de
locations diferentes**, gere `[DOMINIO]-cadeia-db2-completa.md` neste modelo:

```markdown
# Cadeia de dados DB2 e integração entre bancos - [NOME_DO_DOMINIO]

## 1. Visão geral da arquitetura de dados
Topologia relacional do domínio **[NOME_DO_DOMINIO]**: ciclo de vida das informações, distribuição das
tabelas e conexões entre bancos locais e remotos.

### 1.1 Locations e instâncias DB2

| Location | Ambiente | Servidor | Engine DB2 | Schemas principais |
|---|---|---|---|---|
| `DB2PROD_LOCAL` | origem / local | mainframe z/OS (Sysplex A) | DB2 12 z/OS | `DB2XPTO`, `DB2CORE` |
| `DB2CORP_REMOTE` | destino / remoto | mainframe z/OS (Sysplex B) | DB2 12 z/OS | `DB2CORP`, `DB2CADASTRO` |
| `DB2LUW_ANALYTICS` | distribuído | Linux | DB2 LUW 11.5 | `DB2DW` |

## 2. Cadeia de tabelas e fluxo relacional

### 2.1 Entrada e cadastro (bancos locais)
1. `TB_CLIENTE_ENTRADA`: intenção de cadastro vinda dos canais.
2. `TB_CONTRATO_CREDITO`: tabela operacional onde a transação é processada.

### 2.2 Integração entre bancos
1. **Conexão:** three-part names (`LOCATION.SCHEMA.TABELA`) ou aliases, via DRDA / DB2 Connect.
2. **Consulta remota no COBOL:**

     EXEC SQL
       SELECT NM_CLIENTE, ST_RISCO
         INTO :WS-NM-CLIENTE, :WS-ST-RISCO
         FROM DB2CORP_REMOTE.DB2CADASTRO.TB_CLIENTE_CORP
        WHERE CD_CPF_CNPJ = :WS-CPF-CNPJ
     END-EXEC.

3. **Commit em duas fases (2PC):** consistência entre a gravação local em `TB_CONTRATO_CREDITO` e a
   gravação na location remota.

## 3. Modelo entidade-relacionamento integrado

```mermaid
erDiagram
    LOCAL_TB_CLIENTE ||--o{ LOCAL_TB_CONTRATO : "origina"
    LOCAL_TB_CONTRATO ||--|{ LOCAL_TB_HIST_CONTRATO : "historiza"
    LOCAL_TB_CONTRATO }|..|{ REMOTO_TB_CADASTRO_CENTRAL : "valida via three-part name"
    LOCAL_TB_CONTRATO {
        INTEGER cd_contrato PK
        INTEGER cd_cliente FK
        DECIMAL vl_operacao
        CHAR st_processamento
    }
    REMOTO_TB_CADASTRO_CENTRAL {
        DECIMAL cd_cpf_cnpj PK
        VARCHAR nm_cliente
        CHAR st_restricao
    }
```

## 4. Fluxo de dados entre locations

```mermaid
flowchart TD
    subgraph LocationLocal["Location: DB2PROD_LOCAL (Sysplex A)"]
        PGM1["Programa COBOL (CICS / batch)"] -->|"1. SELECT / INSERT"| TBL_LOCAL1[("TB_CONTRATO_CREDITO")]
        PGM1 -->|"2. INSERT de histórico"| TBL_HIST[("TB_HIST_CONTRATO")]
    end
    subgraph LocationRemota["Location: DB2CORP_REMOTE (Sysplex B via DRDA)"]
        TBL_REMOTA[("DB2CADASTRO.TB_CLIENTE_CORP")]
    end
    subgraph LocationLUW["Location: DB2LUW_ANALYTICS"]
        TBL_DW[("DB2DW.TB_FATO_VENDAS")]
    end
    PGM1 -->|"3. Consulta remota"| TBL_REMOTA
    PGM1 -.->|"4. Carga batch / replicação"| TBL_DW
```

## 5. Matriz CRUD: programas × tabelas
[montada a partir das tabelas 0 de cada tabela, quando houver o mapa]

| Programa | Ambiente | `TB_CONTRATO` | `TB_HIST_CONTRATO` | `TB_CLIENTE_CORP` (remoto) | Acesso remoto |
|---|---|---|---|---|---|
| `XPTO0101` | CICS | C, R, U | C | R | three-part name |
| `XPTO0102` | CICS | R | - | - | local |
| `ABCD900B` | batch | R, D | C | R | alias DB2 Connect |

## 6. Transação, integridade e locks
1. **2PC:** em transação online que grava em tabela local e remota, o `EXEC CICS SYNCPOINT` (ou o
   `COMMIT` no batch) coordena as duas fases.
2. **Falha de rede DRDA e contenção:** tratar `SQLCODE -30080` (comunicação) e `-911` / `-913`
   (deadlock / timeout), com rollback da unidade de trabalho quando o banco remoto estiver indisponível.

## 7. Regras de negócio na cadeia de dados
1. **Histórico imutável:** `TB_HIST_CONTRATO` só recebe `INSERT`; `UPDATE` e `DELETE` são proibidos.
2. **Decimais financeiros:** valores entre os bancos mantêm `DECIMAL(15,2)` ↔ `PIC S9(13)V99 COMP-3`,
   sem ponto flutuante.

## 8. Pendências, riscos e lacunas técnicas
[DDLs, DCLGENs, programas ou locations que faltaram]
```

---

## ✏️ MODO 3: Apoio ao desenvolvedor (DDL, DCLGEN e SQL)

1. **Nulos:** confira se toda coluna que aceita `NULL` tem indicador no COBOL (`PIC S9(04) COMP`), ex.:
   `FETCH C1 INTO :WS-VALOR :WS-IND-VALOR`.
2. **Desempenho:**
   - `LIKE '%TEXTO%'` não usa índice;
   - tipo ou tamanho diferente entre a host variable e a coluna no `WHERE` causa conversão e pode
     impedir o uso do índice;
   - função ou cálculo sobre a coluna no `WHERE` também.
3. **Nomes dos arquivos gerados:** `[NOME_TABELA]-especificacao.md` (Modo 1) e
   `[DOMINIO]-cadeia-db2-completa.md` (Modo 2).

---

## 🛡️ Regras de ouro

1. **Dados pessoais (LGPD):** nunca mostre valores reais de colunas sensíveis nos exemplos. Use
   máscaras: CPF `***.***.***-XX`, CNPJ `**.***.***/****-XX`, conta e cartão `****1234`.
2. **Decimais:** registre o tipo DB2 (`DECIMAL(p,s)`) e o equivalente COBOL em ponto fixo (`COMP-3`);
   nunca ponto flutuante (`COMP-1` / `COMP-2`) para saldo e taxa.
3. **Mermaid:** rótulos com `( ) [ ] { } / : ; - , .` entre aspas duplas; nunca use `end`, `graph`,
   `subgraph` ou `class` como nome de nó.
4. **Cobertura honesta:** nunca diga que a documentação está completa se faltou DDL, chave estrangeira,
   índice ou DCLGEN — registre em **"Pendências, Riscos e Lacunas Técnicas"**.
5. **Não invente:** tabela, coluna, índice ou programa que não está na fonte (ou no mapa) fica como
   `[Pendente / não informado na fonte]`.
