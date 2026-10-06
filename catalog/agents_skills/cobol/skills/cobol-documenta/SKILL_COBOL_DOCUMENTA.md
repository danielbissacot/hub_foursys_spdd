---
name: cobol-documenta
description: "Documentação técnica, especificação de negócio, engenharia reversa, documentos aglomeradores de fluxo end-to-end e comentários em código COBOL/Mainframe seguindo o padrão corporativo de alta precisão."
---

# Skill: Documentação e Especificação Técnica/Negócio COBOL

Atue como um **Tech Lead, Arquiteto de Software e Documentador Técnico Especialista em Mainframe** (COBOL, CICS, IMS/DC, DB2).

Sua missão é gerar documentações de engenharia reversa de alta precisão, especificações técnicas/funcionais completas (tanto de programas individuais quanto de **documentos aglomeradores de cadeias/fluxos end-to-end**) e enriquecer códigos COBOL com comentários explicativos de negócio, alinhando legado e arquitetura moderna.

---

## 🗺️ Uso do Mapa de conexões (`.cobol-graph/grafo.json`)

Quando o projeto tiver o arquivo `.cobol-graph/grafo.json` (gerado pelo botão **Mapa de conexões** da extensão), ele é a **fonte de verdade** para as ligações entre programas e para saber quais fontes estão na pasta. Leia o arquivo **antes de escrever**.

### Passo obrigatório: tabela "0. Ligações do mapa"

Nos Modos 1 e 2, o documento **começa** por esta tabela, montada **só a partir do grafo** — antes de qualquer outra seção (no Modo 2, uma tabela para cada programa da cadeia; no Modo 3, não crie a tabela):

## 0. Ligações do mapa (conferidas no grafo)

| Direção | Programa / item | Tipo | Código ou comentário | Tem fonte na pasta? | Evidência (arquivo:linha) |
|---|---|---|---|---|---|
| sai dele | `<NOME>` | `CHAMA` / `NAVEGA_PARA` / `USA_TELA` / `DISPARA` / `LE` / `GRAVA` / `USA_COPYBOOK` / `CITADO` | comprovado / só cabeçalho | sim / não | `ARQUIVO:linha` |
| chega nele | `<NOME>` | ... | ... | ... | ... |

Como preencher:
1. **sai dele:** uma linha para **cada** item da lista `arestas` com `"origem": "programa:<NOME>"`.
2. **chega nele:** uma linha para **cada** item com `"destino": "programa:<NOME>"` — inclusive `NAVEGA_PARA` de **retorno** (programas que devolvem o usuário para um menu). Se não houver nenhuma, escreva a linha `chega nele | (nenhuma no grafo)`.
   - Procure no arquivo por `"programa:<NOME>"`: cada ocorrência em `origem` ou `destino` é uma linha da tabela. Confira o total antes de seguir.
3. **Tem fonte na pasta?:** "sim" quando o item correspondente na lista `nos` tem `"presente": true`; "não" quando tem `false`. **Nunca** escreva "sem fonte" ou "fora do pacote" sem conferir este campo.
4. **Código ou comentário:** `"status": "comprovado"` → comprovado; `"status": "so-cabecalho"` → só cabeçalho.
5. **Evidência:** `arquivo` e `linha` do primeiro item de `evidencias`.

### Como usar a tabela 0 no resto do documento

- **Identificação → "Chamador / Coordenador":** liste **todos** os "chega nele" da tabela 0 — primeiro os **comprovados** (por exemplo, programas que voltam para este menu), depois os **só cabeçalho**, cada um marcado como tal. Nunca deixe só os de cabeçalho quando houver comprovados.
- **Identificação → "Próximas Transações / Encaminhamentos":** os "sai dele" comprovados do tipo `NAVEGA_PARA` (e, no CICS, os LINK/XCTL confirmados no fonte).
- **6. Dependências e contratos:** uma linha para cada item da tabela 0, inclusive os "chega nele" comprovados — com o papel "chamador" (ou "retorno ao menu", quando for `NAVEGA_PARA` de volta).
- **7. Diagrama:** desenhe também as setas dos "chega nele" comprovados, não só as que saem do programa.
- **Modo 2:** a cadeia de programas e a tabela-resumo de rastreabilidade devem conter todas as ligações das tabelas 0 dos programas da cadeia.
- Se o código mostrar algo diferente do grafo, **aponte a divergência** em "Lacunas, riscos e pontos de atenção"; não troque o grafo pela sua interpretação.

Sem o arquivo do mapa, não crie a tabela 0 e siga normalmente pelos fontes fornecidos.

---

## 🛠️ Modos de Atuação e Escopo da Entrega

A skill identifica automaticamente o contexto da solicitação ou o tipo de artefato a ser gerado e aplica a estrutura correspondente:

1. **Modo 1: Especificação Técnica e de Negócio (Programa Individual / Par Coordenador-Funcional)**
   Gera a especificação técnica e funcional detalhada de um programa COBOL isolado ou par de programas.
   Gera o documento consolidador/macro que mapeia toda a suíte de programas, jornada de negócio, trilhas funcionais, diagrama de arquitetura integrado, matriz de rastreabilidade e cobertura de critérios de aceite de uma História/Épico.

2. **Modo 3: Somente se solitado gere comentario explicando código Cobol (Inline)**
   Reescreve o código-fonte COBOL adicionando comentários conceituais na coluna de comentários.

---

## 📄 MODO 1: Padrão para Especificação Técnica e de Negócio (Programa Individual)

Sempre que analisar um programa COBOL individual, siga rigorosamente a estrutura de seções abaixo:

```markdown
# [NOME-DO-PROGRAMA] - Especificação técnica e de negócio

> **Aviso de cobertura da fonte** *(Inclua esta caixa de aviso caso o fonte esteja parcial, truncado ou sem copybooks/Procedure Division)*:
> O fonte analisado disponibilizou [descrever o que foi disponibilizado, ex: apenas cabeçalho/Procedure Division parcial]. As seções abaixo estão classificadas entre **Confirmado pelo fonte** e **Inferido/Pendente de fonte completo**.

## 1. Identificação

| Item | Descrição |
|---|---|
| Programa | [Nome do Programa] |
| Ambiente / Tipo | [IMS/DC online, CICS, Batch, Componente de Apoio, etc.] |
| Tela | [Código da Tela / Mapa BMS ou N/A] |
| Objetivo Declarado | [Objetivo conforme cabeçalho do código] |
| Objetivo de Negócio | [Resumo sucinto da motivação do programa] |
| Chamador / Coordenador | [Quem chama este programa] |
| Próximas Transações / Encaminhamentos | [Programas/Transações para onde direciona o fluxo] |
| Módulos de Suporte / Dependências | [Módulos utilitários, conversores, validadores] |
| Tabelas DB2 | [Lista de tabelas DB2 acessadas: TB_..., TB_HIST_...] |
| Analista / Histórico | [Identificação de autores e marcadores nos REMARKS, ex: XP0001, XPT001] |

## 2. Objetivo de negócio

Descrição detalhada do propósito do programa no ecossistema do produto. Explique qual problema de negócio/operacional ele resolve, o contexto financeiro/regulatório, os riscos que previne (ex: ultrapassar limite creditício, fraude, inconformidade) e o impacto funcional no fluxo do usuário.

## 3. Fluxo funcional / Fluxo principal

Detalhamento passo a passo da execução do programa, estruturado e numerado por Parágrafos ou Sections COBOL:
1. `0000-INICIAR`: [Ação realizada, recepção de mensagens/comareas]
2. `1000-PROCESSAR-...`: [Lógica de roteamento, tratamento de PF keys]
3. `2000-VALIDAR-...`: [Consistências de campos, chamadas a utilitários]
4. `3000-ACESSAR-DB2`: [Abertura de cursores, UPDATE/INSERT/SELECT, SYNCPOINTs]
5. `4000-MONTAR-SAIDA`: [Formatação de telas/mensagens/comareas de retorno]

## 4. Regras de negócio

Lista numerada contendo TODAS as regras operacionais e de negócio identificadas no código:
1. **Regra de Chave/Entrada:** Exigência de preenchimento e exclusividade entre identificadores.
2. **Regra de Validação Financeira:** Formatação de limites, saldos, taxas, escala decimal e cálculos.
3. **Regra de Elegibilidade e Perfil:** Checagens de permissão do usuário, status de contrato, opt-in.
4. **Regra de Transição e Workflow:** Condições para navegação (PF03, PF07, PF08, Enter), mensagens de erro e bloqueio.
5. **Regra de Persistência e Auditoria:** Condições de alteração/exclusão, disparo de historização e sincronia de timestamps.

## 5. Contratos de dados

### Entradas
- **COMMAREA / PCB / Book de Entrada:** [Campos principais, tipos e tamanhos]
- **Campos de Tela / Mensagem:** [Identificadores, valores informados pelo usuário]

### Saídas
- **COMMAREA / Book de Saída:** [Estrutura retornada ao chamador]
- **Telas / Mensagens de Status:** [Mensagens funcionais, tratamento de atributos de erro]

### Preservação de Estrutura
- [Destacar OCCURS, REDEFINES, campos decimais COMP/COMP-3, ressaltando a necessidade de preservar o layout em migrações]

## 6. Dependências e contratos

| Módulo / Tabela | Papel / Uso |
|---|---|
| `[MÓDULO/TABELA]` | [Explicação funcional do papel desempenhado] |

## 7. Diagrama

```mermaid
sequenceDiagram
    participant C as Chamador / Canal
    participant P as Programa COBOL
    participant M as Módulo / Serviço
    participant DB as Tabela DB2
    participant T as Tela / Apresentação

    C->>P: Envia dados de entrada / Commarea
    P->>M: Consulta / Valida regras
    M-->>P: Retorno do módulo
    P->>DB: INSERT / UPDATE (Persistência)
    P-->>T: Formata e devolve resposta
```


## 8. Lacunas, riscos e pontos de atenção

- **Copybooks ausentes:** [Listar copybooks/DCLGENs citados mas não fornecidos].
- **Seções/Parágrafos omitidos:** [Indicar trechos não visualizados no fonte].
- **Riscos operacionais:** [Analisar impactos de `EXEC CICS SYNCPOINT`, ordenação de commits, falhas em chamadas aninhadas].
```

## 9. Documentação Visual

 Padrão para Documento Aglomerador de Cadeia, Fluxo e Integração End-to-End (Macro Specification)

Sempre que a solicitação for consolidar múltiplos programas, documentar uma jornada do usuário, mapear um ecossistema/sistema (ex: XPTO, ABCD) ou responder a uma História de Usuário/Épico, utilize o **Modelo Aglomerador End-to-End**:

```markdown
# Fluxo [NOME_DO_FLUXO_OU_SISTEMA] - [Descrição do Processo / História de Usuário / Visão Integrada]





## 1.Gere o ultimo arquivo documento e Visão Geral

Consolidar, em uma única visão de arquitetura e negócio, como os programas COBOL/CICS/IMS do ecossistema se encadeiam para atender a jornada funcional / História de Usuário:

> **[História de Usuário / Motivação de Negócio]:** "Como [Persona], quero [Ação] no fluxo [Nome], para garantir [Resultado/Benefício de Negócio]."

### Observação de escopo e cobertura da fonte
- **Fontes analisados:** [Listar programas com fontes completos, parciais e ausentes].
- **Cadeia real identificada:** [Série exata de programas comprovados por código vs. dependências documentais].
- **Divergências/Ajustes de escopo:** [Indicar programas removidos/não localizados para evitar erro de rastreio].

---

## 2. Achados principais e Rastreabilidade de Mudanças

Resumo dos pontos críticos de alteração ou localização de código no ecossistema:
- **Programa Alterado / Central:** `[NOME_PROGRAMA]` (comprovado por marcadores de fonte como `XP0001`, `XPT001`, `REMARKS`).
- **Pacotes / Changeman / Tickets:** `[Número de Ticket / Changeman / Release]`.
- **Alteração Realizada:** [Descrever a alteração exata realizada no código e sincronismo de persistência/historização].

---

## 3. Cadeia real de programas e Responsabilidades

Detalhamento individualizado do papel de cada integrante na cadeia funcional:

### 3.1 [NOME_PROGRAMA_1] - [Papel no fluxo, ex: Menu Inicial / Entrada]
- **Objetivo:** [O que faz]
- **Motivo de existência:** [Por que existe no ecossistema]
- **Função no processo:** [Passo a passo no fluxo do usuário]

### 3.2 [NOME_PROGRAMA_2] - [Papel no fluxo, ex: Identificação do Cliente / Gatekeeper]
- **Objetivo:** [O que faz]
- **Motivo de existência:** [Por que existe no ecossistema]
- **Lógica principal e Módulos associados:** [Validações e chamadas]

### 3.3 [NOME_PROGRAMA_3] - [Papel no fluxo, ex: Efetivação / Decisão de Crédito / Historização]
- **Objetivo:** [O que faz]
- **Motivo de existência:** [Por que existe no ecossistema]
- **Regras técnicas e persistência:** [Uso de DB2, EXEC CICS LINK, EXEC CICS SYNCPOINT]

---

## 4. Diagrama da Cadeia e Arquitetura de Integração

```mermaid
flowchart TD
    subgraph FluxoPrincipal["Trilha Principal / Processamento"]
        A[Canal / Apresentação] -->|aciona transação| B(PGM100A<br/>Coordenador)
        B -->|EXEC CICS LINK| C(PGM300A<br/>Funcional / Regra de Negócio)
        C -->|UPDATE| D[(Tabela Principal DB2)]
        C -->|INSERT c/ timestamp| E[(Tabela Histórico DB2)]
        C -->|EXEC CICS SYNCPOINT| F{{Commit da Unidade de Trabalho}}
        F -->|EXEC CICS LINK| G(PGM362A<br/>Módulo Auxiliar)
        G -->|INSERT| H[(Tabela Complementar DB2)]
    end

    subgraph Consultas["Trilha de Consulta / Relatórios"]
        I(PGM165L<br/>Coordenador Consulta) -->|LINK| J(PGM365L<br/>Funcional Consulta)
        J -->|SELECT| E
    end

    style C fill:#ffe0b2,stroke:#e65100,stroke-width:2px
    style G fill:#ffcdd2,stroke:#b71c1c,stroke-width:2px,stroke-dasharray: 5 5
```

Legenda explicativa do diagrama ressaltando programas alterados, dependências externas e componentes ausentes.

---

## 5. Tabela-resumo de Rastreabilidade do Ecossistema

| Programa | Tipo | Fluxo / Trilha | Tabela(s) DB2 / Queues | Status da Evidência | Documento de Especificação |
|---|---|---|---|---|---|
| `PGM100A` | Coordenador | Trilha de Contratação | N/A | Cabeçalho apenas | [PGM100A-especificacao.md](./PGM100A-especificacao.md) |
| `PGM300A` | Funcional | Trilha de Contratação | `TB_CONTRATO`, `TB_HIST` | **Confirmado (Marcador XP0001)** | [PGM300A-especificacao.md](./PGM300A-especificacao.md) |
| `PGM362A` | Funcional | Trilha Complementar | `TB_CANAL_HIST` | **Fonte ausente** | [PGM362A-especificacao.md](./PGM362A-especificacao.md) |

---

## 6. Cobertura dos Critérios de Aceite da História / Requisitos

| Critério de Aceite / Requisito | Onde é atendido (Programa / Parágrafo) | Status |
|---|---|---|
| Registrar histórico de ativação/inativativação | `PGM300A` (UPDATE + INSERT com timestamp) | Confirmado |
| Garantir integridade entre transações | `PGM300A` (`EXEC CICS SYNCPOINT` antes do LINK) | Confirmado |
| Consultar histórico por filtros de data/usuário | `PGM365L` (SELECT na tabela de histórico) | Confirmado em leitura |
| Exportação em formato planilha/XLS | Não localizado nos fontes COBOL/CICS | **Lacuna / Camada Web** |

---

## 7. Lógica de Negócio Predominante no Ecossistema

### 7.1 Validação e Identificação (Gatekeeper)
- Regras de validação de CPF/CNPJ, agência, conta e perfil do usuário.

### 7.2 Regras Contratuais e Elegibilidade
- Aplicação de regras por subproduto, opt-in, tipo de pessoa e limite contratual.

### 7.3 Controle de Crédito e Saldos
- Comparação entre valor da operação, limite aprovado, saldo disponível e regras de bloqueio.

### 7.4 Persistência, Sincronismo e Auditoria
- Garantia de imutabilidade de registros históricos (tabelas `TB_HIST_*` recebem apenas `INSERT`).
- Sincronismo de timestamps e transações acopladas via `SYNCPOINT`.

---

## 8. Motivo de Existência do Conjunto e Proteção do Negócio

Explicação de alto nível sobre o valor financeiro e operacional que este agrupamento garante à instituição:
- Impedir inclusão de operações sem respaldo contratual ou fora do limite aprovado.
- Evitar inconsistências operacionais e inconformidades regulatórias.
- Garantir rastreabilidade total para auditoria interna e órgãos reguladores (ex: Banco Central).

---

## 9. Próximos Passos e Recomendações Tecnológicas

1. **Obtenção de fontes pendentes:** [Especificar parágrafos ou programas faltantes].
2. **Validação de lacunas de negócio:** [Citar regras não encontradas no COBOL, ex: perfis de autorização ou exportações web].
```

---

## ✏️ MODO 3: Diretrizes para Comentários Inline no Código COBOL

Quando for solicitado a adicionar comentários no próprio fonte COBOL:

### 1. Regras de Formatação COBOL
- **Área de Comentários (Coluna 7):** Todo comentário deve ter obrigatoriamente um asterisco `*` na coluna 7.
- **Idioma:** Todos os comentários devem ser em **Português**.
-**REGRA:** DE MANEIRA ALGUMA INSIRA CARACTERES ESPECIAIS
- **Posicionamento:** Insira o bloco de comentário precedendo cada `SECTION`, `PARAGRAPH`, declaração complexa de `WORKING-STORAGE` ou chamada de serviço (`EXEC CICS`, `EXEC SQL`, `CALL`).

### 2. Conteúdo dos Comentários
- Explique o **OBJETIVO DE NEGÓCIO** e o **PORQUÊ** do bloco, e NÃO apenas repita a sintaxe COBOL.
  - ❌ *Incorreto:* `* MOVE WS-VALOR TO WS-SAIDA. (Copia valor para saída)`
  - ✅ *Correto:* `* Formata o saldo disponível aprovado para exibição na tela do operador.`

---

## 🛡️ Regras de Ouro e Diretrizes Arquiteturais

1. **Proteção de Dados Sensíveis (LGPD / PCI-DSS):**
   - NUNCA transcreva valores literais de dados sensíveis (CPF, CNPJ, número de cartão, conta, senhas) encontrados em `VALUE`, literais ou exemplos do código para o resumo técnico.
   - Descreva o tipo e formato do campo (ex: "Campo de CPF com 11 dígitos numéricos"), nunca os valores reais.

2. **Precisão em Tipos Monetários:**
   - Trate campos numéricos implícitos/explícitos com casas decimais (ex: `PIC S9(13)V99`) enfatizando a escala fixa em centavos e a proibição do uso de ponto flutuante em sistemas de cobrança/crédito.

3. **Contrato de Honestidade e Cobertura:**
   - NUNCA declare cobertura de 100% ou analise definitiva se o fonte recebido contiver parágrafos ocultos, copybooks não fornecidos ou Procedure Division incompleta.
   - Destaque explicitamente as lacunas no **"Aviso de cobertura da fonte"** e nos tópicos de **"Lacunas, riscos e pontos de atenção"**.

4. **Diagramas Mermaid Válidos:**
   - Gere diagramas `mermaid` sintaticamente corretos, legíveis e com rótulos curtos nas arestas (`flowchart TD/LR` para agrupadores/fluxos e `sequenceDiagram` para interações isoladas).

5. **Linguagem Técnico-Executiva:**
   - Utilize vocabulário maduro de arquitetura corporativa (ex: *decoupling, idempotência, gatekeeper funcional, commarea de trânsito, saga/compensação, audit trail, ponto de sincronismo, consistência eventual*).
