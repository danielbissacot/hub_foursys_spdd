# Cenários Especiais de Medição APF — Bradesco

## Índice

1. [Alterações Cosméticas](#1-alterações-cosméticas)
2. [Adaptação por Requisitos Não-Funcionais (NFR)](#2-adaptação-por-requisitos-não-funcionais)
3. [Desenvolvimento em Múltiplos Browsers](#3-desenvolvimento-em-múltiplos-browsers)
4. [Desenvolvimento em Múltiplas Plataformas](#4-desenvolvimento-em-múltiplas-plataformas)
5. [Processos Batch Complexos](#5-processos-batch-complexos)
6. [Soluções BPM e Workflow](#6-soluções-bpm-e-workflow)

---

## 1. Alterações Cosméticas

### O que são

Alterações exclusivamente visuais/textuais, sem impacto funcional:

- Alterações de interface: fontes, cores, logos, botões, posição de campos
- Alterações de textos de mensagem: erro, validação, alerta, confirmação
- Alterações de conteúdo estático: texto de email, texto de help, dados hardcoded

### Fator de Impacto

**FI = 0,25** para Funções Transacionais alteradas por manutenção cosmética.

### Como Escrever na US

Na seção APOIO APF, identifique cada funcionalidade impactada pela alteração cosmética:

```markdown
## 📌 APOIO APF

➡️ Funcionalidade de alteração cosmética na tela de inclusão de parceiro (alteração de banner).
➡️ Funcionalidade de alteração cosmética na tela de detalhe de parceiro (alteração de banner).
➡️ Realização de testes no browser Google Chrome.
➡️ Realização de testes no browser Microsoft Edge.
```

### Regras

- Modais de confirmação, navegação e mensagens de erro NÃO são medidos separadamente — fazem parte da funcionalidade que os contém
- A medição de alteração cosmética já engloba TODOS os browsers/plataformas/canais
- Somente fases de Projeto Físico são associadas no roadmap

---

## 2. Adaptação por Requisitos Não-Funcionais

### O que são

Modificações em funcionalidades existentes motivadas EXCLUSIVAMENTE por Requisitos Não-Funcionais (RNF):

- **Performance:** Melhoria de tempo de resposta
- **Usabilidade:** Melhoria na experiência do usuário
- **Segurança:** Adequação a novas políticas de segurança
- **Disponibilidade:** Aumento de disponibilidade
- **Manutenibilidade:** Melhorias de manutenção do código

### Fator de Impacto

**FI = 0,60** para Funções Transacionais alteradas por adequação de RNF.

### Regra Importante

Se a funcionalidade é impactada por AMBOS requisitos funcionais E não-funcionais, este cenário NÃO se aplica.
Nesse caso, usar as regras padrão de alteração.

### Como Escrever na US

```markdown
## 📌 APOIO APF

➡️ Funcionalidade de adequação de performance na consulta de pagamentos (tempo de resposta de 1 min para 3 seg).
➡️ Funcionalidade de adequação de usabilidade na exclusão de cards (seleção múltipla em vez de unitária).
➡️ Realização de testes no browser Google Chrome.
➡️ Realização de testes no browser Microsoft Edge.
```

### Regras

- Cada Função Transacional é medida UMA VEZ, independente da quantidade de tipos de RNF tratados
- Vincular apenas atividades de Projeto Físico no roadmap

---

## 3. Desenvolvimento em Múltiplos Browsers

### O que é

Funcionalidades entregues/testadas em mais de um navegador web.

### Browsers Reconhecidos

| Browser | Observação |
|---------|------------|
| Google Chrome | — |
| Mozilla Firefox | — |
| Microsoft Edge | Medido junto com IE (evolução do IE) |
| Opera | — |
| Safari | — |

### Como Gera Pontos

Para cada funcionalidade transacional entregue em um browser adicional além do principal,
a função transacional é **replicada** na medição.

### Como Escrever na US

**Sempre** inclua as linhas de teste de browser no APOIO APF quando a aplicação é web:

```markdown
## 📌 APOIO APF

➡️ Funcionalidade de inclusão de proposta de crédito.
➡️ Funcionalidade de consulta de proposta de crédito.
➡️ Funcionalidade de listagem de propostas de crédito.
➡️ Realização de testes no browser Google Chrome.
➡️ Realização de testes no browser Microsoft Edge.
```

### Regras

- NÃO se aplica a diferentes versões do MESMO browser — conte a funcionalidade apenas uma vez
- NÃO se aplica a Bradesco Apps (aplicativos mobile)
- Microsoft Edge é contado junto com Internet Explorer
- Vincular apenas atividades de teste de compatibilidade de browser no roadmap

---

## 4. Desenvolvimento em Múltiplas Plataformas

### O que é

Mesma funcionalidade disponibilizada em mais de uma plataforma computacional (ex.: Android + iOS).

### Plataformas Reconhecidas

- **Mobile:** Android, iOS, Windows Phone
- **Desktop:** Windows, macOS, Linux
- **Canais:** Web, App Nativo, URA (Fone Fácil, RH, ATA)

### Como Gera Pontos

Para cada funcionalidade transacional entregue em uma plataforma adicional,
a função transacional é **replicada** na medição.

### Como Escrever na US

```markdown
## 📌 APOIO APF

➡️ Funcionalidade de simulação de consórcio auto (plataforma Android).
➡️ Funcionalidade de simulação de consórcio auto (plataforma iOS).
➡️ Realização de testes no browser Google Chrome.
➡️ Realização de testes no browser Microsoft Edge.
```

### Regras

- A **primeira plataforma** é medida com regras padrão de APF completas
- Plataformas **adicionais** são medidas separadamente com apenas atividades de Projeto Físico
- Cada plataforma pode ter produtividade diferente
- Recomendação: cada medição deve conter funcionalidades de uma mesma plataforma

---

## 5. Processos Batch Complexos

### O que são

Processos batch que geram arquivos em formato predefinido (ex.: envio de dados ao Banco Central)
onde a complexidade de dados excede a correlação típica esforço-pontos-de-função.

### Quando Aplicar

Quando há grande volume de coleta/preparação de dados para geração de arquivos batch,
com esforço desproporcional aos pontos de função padrão.

### Cálculo SNAP Adaptado

| Nível de Complexidade | Critério | Fórmula |
|----------------------|----------|---------|
| Baixo | 1-3 ALRs | PS = 4 × nº DER |
| Médio | 4-9 ALRs | PS = 6 × nº DER |
| Alto | 10+ ALRs | PS = 10 × nº DER |

**Conversão para PF:** `PF = PS × 0,10`

A constante 0,10 representa a correlação entre tamanho não-funcional e funcional,
derivada de análise estatística interna do Bradesco.

### Exemplo

**Batch para envio de aplicações financeiras ao Banco Central:**
- Arquivos lógicos envolvidos: 3 (Poupança, CDB, Tesouro Direto)
- DERs impactados: 60
- Complexidade: Baixa (1-3 arquivos lógicos)
- PS = 4 × 60 = 240
- PF = 240 × 0,10 = **24 PF**

**Registro na medição (APF Simplificada):**
- Peso CE = 3,95 PF
- Quantidade = 24 ÷ 3,95 = 6 funcionalidades
- Registrar: 1 CE principal + 6 CEs "Batch Complexo"

### Como Escrever na US

```markdown
## 📌 APOIO APF

➡️ Funcionalidade de geração de arquivo batch de aplicações financeiras para Banco Central.
➡️ Funcionalidade de geração de arquivo batch de aplicações financeiras - Batch Complexo 01.
➡️ Funcionalidade de geração de arquivo batch de aplicações financeiras - Batch Complexo 02.
➡️ Funcionalidade de geração de arquivo batch de aplicações financeiras - Batch Complexo 03.
➡️ Funcionalidade de geração de arquivo batch de aplicações financeiras - Batch Complexo 04.
➡️ Funcionalidade de geração de arquivo batch de aplicações financeiras - Batch Complexo 05.
➡️ Funcionalidade de geração de arquivo batch de aplicações financeiras - Batch Complexo 06.
```

### Regras para Alteração de Batch

Na alteração de um batch existente, conte apenas os DERs impactados (incluídos + alterados + excluídos):

```
PF = (Fórmula SNAP com DERs impactados) × 0,10
```

---

## 6. Soluções BPM e Workflow

### O que é

Projetos que utilizam soluções de Business Process Management e workflow.

### Conceitos Chave

- **Tarefa de negócio** no BPM = processo elementar na APF
- **Fronteira da aplicação** = produto BPM Process Server
- Por convenção: dados de negócio no BPM = 1 ALI único na fronteira do BPM
- Tarefas automáticas podem ou não ser PEs independentes — avaliar caso a caso

### Como Identificar Funções

| Tipo de Tarefa BPM | Tipo APF Provável | Lógica |
|---------------------|--------------------|--------|
| Tarefa de entrada de opinião/análise | EE | Usuário insere informação que altera estado |
| Tarefa de aprovação | EE | Usuário insere decisão de aprovação |
| Consulta de status do processo | CE ou SE | Informação cruza fronteira do BPM |
| Relatório de indicadores | SE | Dados derivados/calculados |
| Integração com sistema externo | SE ou CE | Depende da intenção primária |

### Regras

- Funcionalidades providas pelo produto BPM (lista de tarefas, relatório de indicadores) NÃO são contadas
- Avaliar se atributos do modelo conceitual são suficientes ou se atributos adicionais são necessários
- Serviços de suporte que complementam entrada de dados humana contam como funções

### Como Escrever na US

```markdown
## 📌 APOIO APF

➡️ Funcionalidade de análise de proposta pelo analista (entrada de parecer).
➡️ Funcionalidade de aprovação de proposta pelo gestor (entrada de decisão).
➡️ Funcionalidade de consulta de status da proposta no workflow.
➡️ Funcionalidade de envio de notificação ao cliente sobre decisão.
```
