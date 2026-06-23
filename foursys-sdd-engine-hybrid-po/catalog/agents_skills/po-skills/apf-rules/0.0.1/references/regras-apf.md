# Regras Completas de APF — Bradesco

## Índice

1. [Método Simplificado (APF Simplificada)](#método-simplificado)
2. [Método Ágil (SFP em Ágil)](#método-ágil)
3. [Pesos por Tipo de Função](#pesos-por-tipo-de-função)
4. [Fatores de Impacto para Melhorias](#fatores-de-impacto-para-melhorias)
5. [Fórmulas de Cálculo](#fórmulas-de-cálculo)
6. [Glossário de Termos Essenciais](#glossário)

---

## Método Simplificado

O Bradesco utiliza a **APF Simplificada**, que elimina a necessidade de identificar ALRs (Referências a
Arquivos Lógicos), DERs (Dados Elementares Referenciados) e níveis de complexidade (Baixa/Média/Alta).

Em vez disso, cada tipo de função recebe um **peso fixo automatizado**, simplificando a contagem sem
perder precisão significativa.

### Procedimento em 3 Passos

1. **Identificar** as funcionalidades dentro do escopo da demanda
2. **Classificar** cada componente funcional básico (ALI, AIE, EE, CE, SE ou MS)
3. **Atribuir** os pesos automaticamente conforme tabela

---

## Método Ágil

Para cards ágeis, o Bradesco usa uma nomenclatura ainda mais simplificada:

| Componente Funcional | Termo Ágil | Peso (PF) |
|----------------------|------------|-----------|
| ALI | Agrupamento de dados de negócio | 7,21 |
| AIE | Sistema referenciado (Agrupamento de dados externo) | 6,21 |
| EE, SE, CE | Funcionalidade | 5,52 |
| MS (Microsserviço) | Funcionalidade como Microsserviço | 1,33 |

No método ágil, **todas as funções transacionais** (EE, CE, SE) recebem o mesmo peso de 5,52 PF,
chamado genericamente de "Funcionalidade".

---

## Pesos por Tipo de Função

### APF Simplificada (Método Detalhado)

| Tipo | Sigla | Peso (PF) | Quando Usar |
|------|-------|-----------|-------------|
| Arquivo Lógico Interno | ALI | 7,21 | Entidade/coleção mantida pela própria aplicação |
| Arquivo de Interface Externa | AIE | 6,21 | Dados consultados de sistema externo |
| Entrada Externa | EE | 4,70 | Processo que inclui/altera/exclui dados internos |
| Consulta Externa | CE | 3,95 | Processo que recupera/lista dados sem cálculo |
| Saída Externa | SE | 5,52 | Processo que gera dados calculados/derivados |
| Microsserviço | MS | 1,33 | Função transacional exposta como microsserviço |

### APF Ágil (Método Unificado)

| Tipo | Peso (PF) | Quando Usar |
|------|-----------|-------------|
| Agrupamento de dados de negócio | 7,21 | Entidade/coleção mantida pela aplicação |
| Sistema referenciado | 6,21 | Sistema externo referenciado |
| Funcionalidade | 5,52 | Qualquer processo elementar (entrada, consulta, saída) |
| Funcionalidade como Microsserviço | 1,33 | Microsserviço |

---

## Fatores de Impacto para Melhorias

Em projetos de melhoria (evolução de software existente), aplica-se o Fator de Impacto (FI) ao peso
da função para obter os Pontos de Função de Melhoria (PFM).

### Tabela de Fatores de Impacto

| Tipo de Manutenção | FI | Descrição |
|---------------------|----|-----------|
| Função incluída (nova) | 1,00 | Nova funcionalidade adicionada ao sistema |
| Função de conversão | 1,00 | Migração/conversão de dados para novo formato |
| Função de dados alterada (ALI/AIE) | 0,42 | Alteração em estrutura de dados existente |
| Função transacional alterada (EE/CE/SE) | 0,60 | Alteração em funcionalidade existente |
| Função excluída | 0,30 | Remoção de funcionalidade existente |
| Alteração cosmética em função transacional | 0,25 | Mudança visual/texto sem impacto funcional |

### Exemplos de Cálculo com FI

| Função | Tipo | PF | Manutenção | FI | PFM |
|--------|------|----|------------|-----|------|
| Incluir Cliente (nova) | EE | 4,70 | Incluída | 1,00 | 4,70 |
| Alterar tela de consulta | CE | 3,95 | Alteração transacional | 0,60 | 2,37 |
| Adicionar campo na coleção | ALI | 7,21 | Alteração de dados | 0,42 | 3,03 |
| Remover relatório antigo | SE | 5,52 | Excluída | 0,30 | 1,66 |
| Alterar texto de botão | EE | 4,70 | Cosmética | 0,25 | 1,18 |

---

## Fórmulas de Cálculo

### Projeto de Desenvolvimento Novo

```
DSFP = ADD + CFP
```

- **ADD** = soma dos PF de todas as funções incluídas
- **CFP** = soma dos PF de funções de conversão (migração de dados)

### Projeto de Melhoria

```
ESFP = ADD + CHG + DEL + CFP
```

- **ADD** = soma dos PFM de funções incluídas (PF × 1,00)
- **CHG** = soma dos PFM de funções alteradas (PF × FI correspondente)
- **DEL** = soma dos PFM de funções excluídas (PF × 0,30)
- **CFP** = soma dos PFM de funções de conversão (PF × 1,00)

### Baseline (Tamanho Funcional da Aplicação)

Após desenvolvimento:
```
ASFP = ADD
```

Após melhoria:
```
ASFPA = ASFPB + ADD − DEL
```

- **ASFPB** = baseline anterior
- **ASFPA** = novo baseline

---

## Glossário

### Termos Essenciais para Escrita de US

| Termo | Sigla | Definição |
|-------|-------|-----------|
| Componente Funcional Básico | BFC | Unidade elementar de Requisitos Funcionais do Usuário para medição |
| Fronteira da Aplicação | — | Interface conceitual entre o software e seus usuários |
| Dados de Negócio | — | Informação necessária para armazenamento/recuperação pela área funcional |
| Dados de Código | — | Lista de valores válidos para atributos descritivos (ex.: tabelas de domínio) |
| Processo Elementar | PE | Menor unidade significativa para o usuário; transação completa e auto-contida |
| Requisitos Funcionais do Usuário | RFU | Práticas e procedimentos que o software deve executar |
| Requisitos Não-Funcionais | RNF | Descreve COMO o software executa (performance, segurança, usabilidade) |
| Estado Consistente | — | Ponto onde o processamento é completamente executado |
| SFP | — | Simple Function Points (Pontos de Função Simples) |
| SNAP | — | Software Non-Functional Assessment Process |

### Diferenças Importantes

- **RFU vs RNF:** A APF mede apenas RFU. RNF (performance, segurança) são medidos por SNAP quando aplicável.
- **PE completo:** Um Processo Elementar deve deixar o negócio em estado consistente — não conte subprocessos parciais.
- **Dados de Negócio vs Dados de Código:** Dados de Código (lookup tables, listas de domínio) geralmente não geram ALIs separados, mas podem gerar CEs quando recuperados.

### Tipos de Operação em Projetos de Melhoria

| Operação | Código | Quando Usar |
|----------|--------|-------------|
| Inclusão | ADD | Funcionalidade totalmente nova |
| Alteração | CHG | Modificação em funcionalidade existente |
| Exclusão | DEL | Remoção de funcionalidade do sistema |
| Conversão | CFP | Migração ou conversão de dados existentes |
