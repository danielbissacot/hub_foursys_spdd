# Exemplos de User Stories Otimizadas para APF

## Índice

1. [Exemplo 1 — Desenvolvimento Novo: Cadastro de Contrato](#exemplo-1)
2. [Exemplo 2 — Melhoria: Evolução do Módulo de Consulta de Clientes](#exemplo-2)
3. [Exemplo 3 — Cenários Especiais: Multi-browser + Integrações](#exemplo-3)

---

## Exemplo 1

### Desenvolvimento Novo — Cadastro de Contrato de Intermediação

**Contexto:** Nova funcionalidade para cadastrar contratos de intermediação para clientes PJ.

```markdown
# [US-1234] — Cadastro de Contrato de Intermediação PJ

**Status:** Draft
**Autor (PO):** Draft PO
**Data:** 2025-03-15
**Sprint:** Sprint 42
**Story Points:** 13
**Issue/Épico:** #567

---

## 📌 APOIO APF

➡️ Funcionalidade de inclusão de contrato de intermediação.
➡️ Funcionalidade de alteração de contrato de intermediação.
➡️ Funcionalidade de exclusão lógica de contrato de intermediação.
➡️ Funcionalidade de consulta/detalhe de contrato de intermediação.
➡️ Funcionalidade de listagem de contratos de intermediação por cliente.
➡️ Funcionalidade de consulta de tipos de pessoa para seleção (combo-box).
➡️ Funcionalidade de consulta de tipos de escrituração para seleção (combo-box).
➡️ Funcionalidade de validação de CNPJ do cliente no cadastro.
➡️ Funcionalidade de consulta de contratos pendentes do cliente para verificação de duplicidade.
➡️ Funcionalidade de envio de notificação de novo contrato para o sistema de backoffice.
➡️ Realização de testes no browser Google Chrome.
➡️ Realização de testes no browser Microsoft Edge.

---

## 📌 IDENTIFICAÇÃO

**EU COMO** operador da área de Operações PJ
**QUERO QUE** o sistema permita cadastrar, alterar, consultar e excluir contratos de intermediação para clientes PJ
**PARA** registrar e gerenciar os contratos de intermediação de forma digitalizada e rastreável

---

## 📋 REGRAS DE NEGÓCIO

**Regra de Negócio 1 — Validação de CNPJ**

O CNPJ informado deve ter formato válido (14 dígitos) e dígito verificador correto.
Somente clientes com CNPJ válido podem ter contrato cadastrado.

**Regra de Negócio 2 — Tipo de pessoa obrigatório**

O tipo de pessoa (Física/Jurídica) deve ser informado obrigatoriamente e selecionado via combo-box
com valores pré-definidos.

**Regra de Negócio 3 — Tipo de escrituração obrigatório**

O tipo de escrituração (Automática/Processual) deve ser informado obrigatoriamente e selecionado
via combo-box com valores pré-definidos.

**Regra de Negócio 4 — Vigência com data de fim**

A vigência do contrato deve ter data de início (preenchida automaticamente) e data de fim (obrigatória).
A data de fim não pode ser anterior à data de início.

**Regra de Negócio 5 — Unicidade de contrato pendente**

Não é possível cadastrar novo contrato para cliente que já possua contrato com status PENDENTE.
O sistema deve consultar os contratos existentes antes de permitir novo cadastro.

**Regra de Negócio 6 — Exclusão lógica**

Contratos não podem ser excluídos fisicamente. A exclusão altera o status para CANCELADO.
Apenas contratos com status PENDENTE podem ser cancelados.

**Regra de Negócio 7 — Notificação ao backoffice**

Após a inclusão de um novo contrato, o sistema deve enviar notificação ao sistema de backoffice
com os dados do contrato para acompanhamento.

---

## 🔧 REGRAS TÉCNICAS

**Regra Técnica 1 — API REST de Contratos**

Expor endpoints REST para CRUD de contratos de intermediação:
- `POST /api/v1/contratos` — inclusão
- `PUT /api/v1/contratos/{id}` — alteração
- `DELETE /api/v1/contratos/{id}` — exclusão lógica
- `GET /api/v1/contratos/{id}` — consulta/detalhe
- `GET /api/v1/contratos?cnpj={cnpj}` — listagem por cliente

**Regra Técnica 2 — Integração com backoffice**

Envio de notificação via mensageria assíncrona (tópico Kafka) ao sistema de backoffice após inclusão.

---

## ✅ CRITÉRIOS DE ACEITE

**C1 — Inclusão de contrato com sucesso**

**DADO QUE** o operador está na tela de cadastro de contrato
**QUANDO** preencher todos os campos obrigatórios (CNPJ, tipo de pessoa, tipo de escrituração, vigência) e submeter
**ENTÃO** o sistema deve gravar o contrato com status PENDENTE e exibir mensagem de confirmação

**C2 — Validação de CNPJ inválido**

**DADO QUE** o operador está na tela de cadastro de contrato
**QUANDO** informar um CNPJ com formato ou dígito verificador inválido
**ENTÃO** o sistema deve exibir mensagem de erro "CNPJ inválido" e não permitir o cadastro

**C3 — Bloqueio de contrato duplicado**

**DADO QUE** o cliente já possui um contrato com status PENDENTE
**QUANDO** o operador tentar cadastrar um novo contrato para o mesmo CNPJ
**ENTÃO** o sistema deve bloquear o cadastro e exibir mensagem "Cliente já possui contrato PENDENTE"

**C4 — Listagem de contratos por cliente**

**DADO QUE** o operador acessa a tela de listagem de contratos
**QUANDO** informar o CNPJ do cliente e aplicar o filtro
**ENTÃO** o sistema deve exibir todos os contratos do cliente com número, tipo, status e data de vigência

**C5 — Exclusão lógica de contrato**

**DADO QUE** o operador está no detalhe de um contrato com status PENDENTE
**QUANDO** solicitar a exclusão do contrato
**ENTÃO** o sistema deve marcar o contrato como CANCELADO (exclusão lógica) sem remover o registro

**C6 — Alteração de contrato pendente**

**DADO QUE** o operador está editando um contrato com status PENDENTE
**QUANDO** alterar os campos permitidos (tipo de escrituração, vigência) e salvar
**ENTÃO** o sistema deve atualizar os dados do contrato e exibir confirmação

---

## 🔗 DEPENDÊNCIAS

- Serviço de validação de CNPJ disponível e acessível via rede interna.
- Sistema de backoffice com tópico Kafka configurado para receber notificações de novos contratos.
- Tabela de tipos de pessoa e tipos de escrituração previamente populada no banco de dados.

---

## 🚫 FORA DO ESCOPO

- Aprovação/workflow de contratos (será tratado em US futura).
- Geração de relatório de contratos (será tratado em US separada).
- Integração com sistema de assinatura digital.

---

## ⚠️ RISCOS

- Indisponibilidade do serviço de validação de CNPJ pode bloquear o cadastro.
- Volume alto de notificações ao backoffice pode gerar atraso no processamento.
```

### Análise de Pontos — Exemplo 1

| # | Funcionalidade | Tipo | PF |
|---|----------------|------|----|
| 1 | Inclusão de contrato | EE | 4,70 |
| 2 | Alteração de contrato | EE | 4,70 |
| 3 | Exclusão lógica de contrato | EE | 4,70 |
| 4 | Consulta/detalhe de contrato | CE | 3,95 |
| 5 | Listagem de contratos por cliente | CE | 3,95 |
| 6 | Combo-box tipos de pessoa | CE | 3,95 |
| 7 | Combo-box tipos de escrituração | CE | 3,95 |
| 8 | Validação de CNPJ | EE | 4,70 |
| 9 | Consulta contratos pendentes (duplicidade) | CE | 3,95 |
| 10 | Envio de notificação ao backoffice | SE | 5,52 |
| 11 | ALI - Contrato de Intermediação | ALI | 7,21 |
| — | **TOTAL** | — | **51,28** |

> Note como a decomposição granular transformou uma funcionalidade genérica de "cadastro de contrato"
> em 11 componentes funcionais mensuráveis, totalizando 51,28 PF. Sem a decomposição adequada,
> poderia-se contar apenas 3-4 funções (~20 PF).

---

## Exemplo 2

### Melhoria — Evolução do Módulo de Consulta de Clientes

**Contexto:** Alteração no módulo de consulta de clientes para adicionar novo campo, alterar relatório
existente e remover funcionalidade obsoleta.

```markdown
# [US-2345] — Evolução do Módulo de Consulta de Clientes

**Status:** Draft
**Autor (PO):** Maria Santos
**Data:** 2025-03-20
**Sprint:** Sprint 43
**Story Points:** 8
**Issue/Épico:** #789

---

## 📌 APOIO APF

➡️ Funcionalidade de alteração da coleção de clientes (inclusão do campo "segmento de mercado").
➡️ Funcionalidade de alteração da tela de inclusão de cliente (novo campo "segmento de mercado").
➡️ Funcionalidade de alteração da tela de alteração de cliente (novo campo "segmento de mercado").
➡️ Funcionalidade de alteração da tela de consulta/detalhe de cliente (exibição do campo "segmento de mercado").
➡️ Funcionalidade de inclusão de consulta de segmentos de mercado para seleção (combo-box).
➡️ Funcionalidade de alteração do relatório de clientes por região (inclusão da coluna "segmento de mercado").
➡️ Funcionalidade de exclusão da consulta de clientes inativos (funcionalidade obsoleta).
➡️ Funcionalidade de inclusão de exportação de clientes por segmento em CSV.
➡️ Realização de testes no browser Google Chrome.
➡️ Realização de testes no browser Microsoft Edge.

---

## 📌 IDENTIFICAÇÃO

**EU COMO** analista comercial
**QUERO QUE** o módulo de clientes inclua o campo "segmento de mercado" nas telas de cadastro e consulta,
com um novo relatório de exportação por segmento
**PARA** segmentar a base de clientes e direcionar ações comerciais

---

## 📋 REGRAS DE NEGÓCIO

**Regra de Negócio 1 — Segmento obrigatório para novos clientes**

O campo "segmento de mercado" é obrigatório para novos cadastros.
Para clientes existentes sem segmento, o campo deve exibir "Não classificado".

**Regra de Negócio 2 — Valores de segmento**

Os segmentos válidos são: Varejo, Atacado, Corporate, Private.
A lista é gerenciada centralmente e carregada via combo-box.

**Regra de Negócio 3 — Obsolescência da consulta de inativos**

A consulta de clientes inativos foi substituída pelo relatório geral com filtros.
Deve ser removida completamente do sistema.

---

## 🔧 REGRAS TÉCNICAS

**Regra Técnica 1 — Alteração de schema**

Adicionar campo `segmento_mercado` (VARCHAR 50, NOT NULL DEFAULT 'Não classificado') na coleção de clientes.

**Regra Técnica 2 — Endpoint de exportação**

Novo endpoint `GET /api/v1/clientes/exportar?segmento={segmento}&formato=csv` para exportação filtrada.

---

## ✅ CRITÉRIOS DE ACEITE

**C1 — Novo campo "segmento de mercado" na inclusão**

**DADO QUE** o analista está na tela de inclusão de cliente
**QUANDO** preencher o campo "segmento de mercado" via combo-box de seleção
**ENTÃO** o sistema deve gravar o segmento selecionado junto aos dados do cliente

**C2 — Combo-box de segmentos de mercado**

**DADO QUE** o analista acessa a tela de inclusão ou alteração de cliente
**QUANDO** o campo "segmento de mercado" é renderizado
**ENTÃO** o sistema deve carregar a lista de segmentos disponíveis (Varejo, Atacado, Corporate, Private) via combo-box

**C3 — Relatório alterado com nova coluna**

**DADO QUE** o analista gera o relatório de clientes por região
**QUANDO** o relatório é exibido
**ENTÃO** deve incluir a nova coluna "segmento de mercado" com o valor de cada cliente

**C4 — Remoção da consulta de inativos**

**DADO QUE** a consulta de clientes inativos era acessível no menu
**QUANDO** o analista acessar o módulo de clientes após a implantação
**ENTÃO** a opção de consulta de clientes inativos não deve mais estar disponível

**C5 — Exportação de clientes por segmento**

**DADO QUE** o analista está na tela de listagem de clientes
**QUANDO** selecionar um segmento e clicar em "Exportar CSV"
**ENTÃO** o sistema deve gerar um arquivo CSV com os clientes filtrados pelo segmento selecionado

---

## 🔗 DEPENDÊNCIAS

- Tabela de segmentos de mercado previamente populada (Varejo, Atacado, Corporate, Private).
- Módulo de relatórios existente deve suportar adição de colunas dinâmicas.

---

## 🚫 FORA DO ESCOPO

- Migração retroativa de segmentos para clientes existentes (será tratado em US de migração de dados).
- Criação de novos segmentos pelo usuário (gestão centralizada pela área de negócio).

---

## ⚠️ RISCOS

- Clientes existentes sem segmento podem gerar inconsistências em relatórios filtrados por segmento.
- Remoção da consulta de inativos pode impactar usuários que ainda dependem dessa funcionalidade.
```

### Análise de Pontos — Exemplo 2 (Melhoria)

| # | Funcionalidade | Tipo | PF | Manutenção | FI | PFM |
|---|----------------|------|----|------------|-----|------|
| 1 | Alteração coleção clientes | ALI | 7,21 | Dados alterada | 0,42 | 3,03 |
| 2 | Alteração tela inclusão | EE | 4,70 | Trans. alterada | 0,60 | 2,82 |
| 3 | Alteração tela alteração | EE | 4,70 | Trans. alterada | 0,60 | 2,82 |
| 4 | Alteração tela consulta | CE | 3,95 | Trans. alterada | 0,60 | 2,37 |
| 5 | Combo-box segmentos (novo) | CE | 3,95 | Incluída | 1,00 | 3,95 |
| 6 | Alteração relatório clientes | SE | 5,52 | Trans. alterada | 0,60 | 3,31 |
| 7 | Exclusão consulta inativos | CE | 3,95 | Excluída | 0,30 | 1,19 |
| 8 | Exportação CSV por segmento (nova) | SE | 5,52 | Incluída | 1,00 | 5,52 |
| — | **TOTAL** | — | — | — | — | **25,01** |

> Cálculo: ESFP = ADD(9,47) + CHG(11,32) + DEL(1,19) + CFP(0) = **25,01 PFM**

---

## Exemplo 3

### Cenários Especiais — Multi-browser + Integrações Externas

**Contexto:** Nova funcionalidade de simulação de crédito com consulta a bureau de crédito externo,
entregue em Chrome e Edge, com envio de resultado para sistema de propostas.

```markdown
# [US-3456] — Simulação de Crédito com Consulta de Score

**Status:** Draft
**Autor (PO):** Ana Oliveira
**Data:** 2025-03-25
**Sprint:** Sprint 44
**Story Points:** 21
**Issue/Épico:** #890

---

## 📌 APOIO APF

➡️ Funcionalidade de inclusão de simulação de crédito.
➡️ Funcionalidade de consulta de score de crédito no bureau externo SPC/Serasa.
➡️ Funcionalidade de cálculo de taxa de juros com base no score e prazo.
➡️ Funcionalidade de consulta de tabela de taxas vigentes para seleção de modalidade (combo-box).
➡️ Funcionalidade de consulta de detalhes da simulação realizada.
➡️ Funcionalidade de listagem de simulações do cliente.
➡️ Funcionalidade de geração de relatório resumo da simulação (PDF).
➡️ Funcionalidade de envio de simulação aprovada para o sistema de propostas.
➡️ Funcionalidade de exclusão de simulação expirada.
➡️ Realização de testes no browser Google Chrome.
➡️ Realização de testes no browser Microsoft Edge.

---

## 📌 IDENTIFICAÇÃO

**EU COMO** gerente de relacionamento
**QUERO QUE** o sistema permita realizar simulações de crédito com consulta automática de score
**PARA** oferecer condições personalizadas de crédito ao cliente com agilidade

---

## 📋 REGRAS DE NEGÓCIO

**Regra de Negócio 1 — Consulta de score obrigatória**

Toda simulação deve consultar o score de crédito no bureau externo.
A taxa de juros é calculada com base no score obtido + prazo + modalidade.

**Regra de Negócio 2 — Tabela de taxas**

As taxas são definidas pela área de Pricing e carregadas de tabela interna.
A seleção de modalidade é obrigatória e feita via combo-box.

**Regra de Negócio 3 — Validade da simulação**

Simulações têm validade de 30 dias. Após esse prazo, são marcadas como expiradas.

**Regra de Negócio 4 — Envio para propostas**

Apenas simulações dentro do prazo de validade podem ser enviadas ao sistema de propostas.
O envio gera protocolo de rastreamento.

---

## 🔧 REGRAS TÉCNICAS

**Regra Técnica 1 — Integração com bureau SPC/Serasa**

Consulta REST síncrona ao bureau via `GET /api/bureau/score?documento={cpfCnpj}`.
Timeout de 5s com fallback para score padrão em caso de indisponibilidade.

**Regra Técnica 2 — Envio para sistema de propostas**

Envio assíncrono via mensageria (tópico Kafka `propostas.simulacao.aprovada`) com payload JSON da simulação.

---

## ✅ CRITÉRIOS DE ACEITE

**C1 — Simulação com consulta de score**

**DADO QUE** o gerente está na tela de simulação de crédito
**QUANDO** informar o CPF/CNPJ do cliente, valor e prazo desejados e submeter
**ENTÃO** o sistema deve consultar o score no bureau SPC/Serasa e calcular a taxa de juros personalizada

**C2 — Combo-box de modalidades de crédito**

**DADO QUE** o gerente está na tela de simulação
**QUANDO** o campo "modalidade" é renderizado
**ENTÃO** o sistema deve carregar as modalidades disponíveis da tabela de taxas vigentes via combo-box

**C3 — Geração de relatório PDF**

**DADO QUE** uma simulação foi realizada com sucesso
**QUANDO** o gerente clicar em "Gerar PDF"
**ENTÃO** o sistema deve gerar um relatório em PDF com todos os dados da simulação e condições calculadas

**C4 — Envio para sistema de propostas**

**DADO QUE** o gerente deseja prosseguir com a simulação
**QUANDO** clicar em "Enviar para Proposta"
**ENTÃO** o sistema deve enviar os dados da simulação para o sistema de propostas e confirmar o envio

**C5 — Listagem de simulações**

**DADO QUE** o gerente acessa o histórico de simulações
**QUANDO** informar o período e/ou CPF do cliente
**ENTÃO** o sistema deve listar todas as simulações com data, valor, taxa e status

**C6 — Exclusão de simulação expirada**

**DADO QUE** uma simulação tem mais de 30 dias sem conversão em proposta
**QUANDO** o processo de limpeza executar
**ENTÃO** a simulação deve ser marcada como expirada e removida da listagem ativa

---

## 🔗 DEPENDÊNCIAS

- Bureau SPC/Serasa acessível via API REST na rede interna.
- Tabela de taxas vigentes mantida pela área de Pricing e disponível para consulta.
- Sistema de propostas com tópico Kafka configurado para receber simulações aprovadas.

---

## 🚫 FORA DO ESCOPO

- Análise completa de crédito (esta US cobre apenas simulação).
- Aprovação/rejeição de proposta (tratado no sistema de propostas).
- Histórico de scores do cliente (funcionalidade do bureau).

---

## ⚠️ RISCOS

- Indisponibilidade do bureau SPC/Serasa pode impedir simulações em tempo real.
- Latência na consulta de score pode degradar a experiência do usuário.
- Simulações expiradas não processadas podem acumular no banco de dados.
```

### Análise de Pontos — Exemplo 3

| # | Funcionalidade | Tipo | PF | Observação |
|---|----------------|------|----|------------|
| 1 | Inclusão de simulação | EE | 4,70 | — |
| 2 | Consulta score bureau externo | CE | 3,95 | Integração externa |
| 3 | Cálculo de taxa (score+prazo) | SE | 5,52 | Dados derivados/calculados |
| 4 | Combo-box modalidades | CE | 3,95 | — |
| 5 | Consulta detalhe simulação | CE | 3,95 | — |
| 6 | Listagem de simulações | CE | 3,95 | — |
| 7 | Relatório resumo PDF | SE | 5,52 | Dados formatados/calculados |
| 8 | Envio para sistema de propostas | SE | 5,52 | Integração externa |
| 9 | Exclusão simulação expirada | EE | 4,70 | — |
| 10 | ALI - Simulação de Crédito | ALI | 7,21 | Coleção interna |
| 11 | AIE - Bureau SPC/Serasa | AIE | 6,21 | Sistema externo consultado |
| 12 | AIE - Tabela de Taxas | AIE | 6,21 | Sistema/módulo externo |
| — | **TOTAL** | — | **61,39** |

> Note como as integrações externas geram tanto AIEs (dados referenciados) quanto CEs/SEs
> (funções transacionais para consultar/enviar). Isso maximiza os pontos legitimamente.

---

## Padrões Observados nos Exemplos

### O que maximiza pontos legítimos:

1. **Decomposição CRUD completa** — cada operação é uma função independente
2. **Combo-boxes explícitos** — cada seletor de dados é uma CE
3. **Integrações detalhadas** — geram AIE + CE/SE para cada operação
4. **Relatórios e exportações** — cada formato/visão é uma SE separada
5. **Validações com lógica de negócio** — podem ser EEs quando alteram estado
6. **Entidades de dados** — cada coleção/tabela distinta é um ALI
7. **Sistemas externos** — cada sistema consultado/alimentado é um AIE
8. **Multi-browser** — sempre incluir Chrome + Edge quando web

### O que NÃO gera pontos:

- Modais de confirmação (parte da funcionalidade mãe)
- Mensagens de erro genéricas (parte da funcionalidade mãe)
- Setup de ambiente, deploy, testes de QA
- Correção de bugs existentes
- Requisitos não-funcionais puros (exceto via cenário especial NFR)
