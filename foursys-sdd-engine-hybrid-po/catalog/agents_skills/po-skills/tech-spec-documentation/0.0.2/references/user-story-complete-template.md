## Objetivo

Quando solicitado a criar uma User Story completa (negócio + técnico, para o Tech Lead), siga esta estrutura padronizada.
O fluxo esperado é:
1. **PO** cria a User Story de negócio (`user-story-business-template.md`) com o auxílio da IA generativa.
2. **Tech Lead** parte dessa história e, com a IA conectada aos repositórios de código, expande os aspectos técnicos
   para produzir esta User Story completa — pronta para refinamento e desenvolvimento.

## Instruções

1. Baseie-se obrigatoriamente na User Story de negócio já criada pelo PO.
2. Mantenha todas as seções de negócio intactas e acrescente as seções técnicas.
3. Cada Regra Técnica deve referenciar sua respectiva Regra de Negócio quando aplicável.
4. Detalhe endpoints REST (URL, método, payload de entrada e saída) conforme o padrão do projeto.
5. Detalhe mapeamentos de Collections MongoDB (Nome Lógico × Nome Físico) quando houver persistência.
6. Documente integrações com outros microsserviços usando o padrão de Data Mapping Origem × Destino.
7. Siga a arquitetura hexagonal adotada no Bradesco.
8. Utilize as exceções padrão do projeto: `BusinessException`, `NotFoundException`, `IntegrationException`.

## Estrutura da User Story Completa

```markdown
# [US-XXXX] — [Título da User Story]

**Status:** Draft | In Review | Approved  
**Autor (PO):** [Nome]  
**Autor Técnico (TL):** [Nome]  
**Data:** YYYY-MM-DD  
**Sprint:** [Número ou Nome da Sprint]  
**Story Points:** [Estimativa]  
**Issue/Épico:** #[número]  
**Repositório:** [Link do repositório]

---

## 📌 APOIO APF

➡️ Funcionalidade de [descreva a funcionalidade de negócio de alto nível].
➡️ Realização de testes no browser Google Chrome.
➡️ Realização de testes no browser Microsoft Edge.

---

## 📌 IDENTIFICAÇÃO

EU COMO [papel/perfil do usuário ou área]
QUERO QUE [descreva o que o sistema/funcionalidade deve fazer]
PARA [descreva o benefício de negócio esperado]

---

## ✅ CRITÉRIOS DE ACEITE

> Descreva os critérios no formato BDD: DADO / QUANDO / ENTÃO.

**C1 — [Título do cenário]**

DADO QUE [contexto inicial / pré-condição]
QUANDO [ação realizada pelo usuário ou sistema]
ENTÃO [resultado esperado / comportamento do sistema]

**C2 — [Título do cenário]**

DADO QUE [contexto inicial / pré-condição]
QUANDO [ação realizada pelo usuário ou sistema]
ENTÃO [resultado esperado / comportamento do sistema]

*(Adicione quantos critérios forem necessários)*

---

## ✅ CENÁRIOS DE TESTE (Opcional)

- Cenário 1: [Descrição]
- Cenário 2: [Descrição]

---

## 📋 REGRAS DE NEGÓCIO

**Regra de Negócio 1 — [Título da Regra]**

[Descreva a regra de negócio de forma clara e objetiva.]

**Regra de Negócio 2 — [Título da Regra]**

[Descreva a regra de negócio de forma clara e objetiva.]

*(Adicione quantas regras forem necessárias)*

---

## ⚙️ REGRAS TÉCNICAS

### Objetivo

[Descreva o objetivo técnico da implementação em 2-3 linhas.]

### Solução Técnica

[Descreva a abordagem de alto nível: quais camadas serão criadas/alteradas,
quais integrações serão realizadas, qual padrão será seguido.]

---

### Regra Técnica 1 — Mapeamento do Recurso REST

> Referencie a Regra de Negócio correspondente quando aplicável.

**Item 1.1 — Recurso REST**

Mapear o seguinte Recurso REST.

URL: `[MÉTODO] /api/v1/[recurso]`

**Item 1.2 — Payload de Entrada (Request)**

➡️ Criar o seguinte mapeamento no payload do recurso.

| Campo | Tipo | Obrigatório | Domínio | Objetivo |
|-------|------|-------------|---------|----------|
| [campo] | String | Sim / Não | [valores permitidos] | [descrição do campo] |
| [campo] | String | Sim / Não | [valores permitidos] | [descrição do campo] |

**Item 1.3 — Payload de Saída (Response)**

Mapear os seguintes campos de saída.

| Campo | Tipo | Domínio | Obs |
|-------|------|---------|-----|
| codigoRetorno | String | | Ex: DUPE-XXXX-0001 |
| mensagem | String | | Mensagem da Operação |
| objetoRetorno | Object | | Contém a resposta do Endpoint |
| erros[].campo | String | | Apenas em caso de erro |
| erros[].erro | String | | Apenas em caso de erro |

**Exemplo de Sucesso**

```json
{
  "codigoRetorno": "DUPE-XXXX-0001",
  "mensagem": "Operação Efetuada Com Sucesso.",
  "objetoRetorno": {}
}
```

**Exemplo de Erro**

```json
{
  "codigoRetorno": "DUPE-XXXX-0002",
  "mensagem": "[Descrição do erro]",
  "erros": [
    {
      "campo": "[nomeDoCampo]",
      "erro": "[Descrição do problema de validação]"
    }
  ]
}
```

---

### Regra Técnica 2 — Persistência de Dados

> Utilize o Nome Lógico na classe de modelagem e a anotação MongoDB com o Nome Físico.

Collection: `[NomeLogicoDaCollection]` | Nome Físico: `[nFisicoCollection]`

| Nome Lógico | Nome Físico | Tipo | Domínio | Obs |
|-------------|-------------|------|---------|-----|
| [campo] | [campoFísico] | String | | |
| [campo] | [campoFísico] | Date | | |
| [campo] | [campoFísico] | Boolean | | |

---

### Regra Técnica 3 — Integração com Microsserviço Externo

**Item 3.1 — Recurso**

Recurso: `[MÉTODO] /api/v1/[recurso-externo]`

URL: Via SVC `[nome-do-serviço]`

**Item 3.2 — Data Mapping**

Utilizar o seguinte Data Mapping:

| Origem | Destino |
|--------|---------|
| [campo origem] | [campo destino] |
| [campo origem] | [campo destino] |

---

### Regra Técnica 4 — Mapeamento de Erros

| Item | Link |
|------|------|
| Casos de Erros Mapeados | [Link para o Confluence do time] |
| Tabela de Erros | [Link para a tabela de erros] |

> Durante o desenvolvimento, caso seja identificado algum cenário não contemplado na tabela de erros existente,
> avaliar a inclusão de novos erros e mapeá-los no Confluence seguindo o padrão existente.

**HTTP Codes esperados:**

| HTTP Code | Objetivo |
|-----------|----------|
| 400 | Problema no Request (conversão de domínio, validação de campos) |
| 412 | Regras de Negócio violadas |
| 500 | Erros de Integração que pausam o fluxo. Sem Fallback previsto. |

**Exceções a utilizar:**

| Exceção | Objetivo |
|---------|----------|
| BusinessException | Regras de Negócio |
| NotFoundException | Recurso não encontrado |
| IntegrationException | Integração com erro |

---

## 🔖 Informações Técnicas Adicionais

### Arquitetura Hexagonal

Seguir a arquitetura hexagonal utilizada no Bradesco.

Apoio: [Link para documentação de arquitetura hexagonal do time no Confluence]

### Configurações, Dependências e Documentações

- Configurar o repositório de Config do Serviço.
- Realizar logs dos fluxos.
- Documentar o Endpoint com exemplos de Request e Response.
- Colocar logs nas requisições conforme necessário para fins de debug (não logar token JWT).
  - Caso necessário logar o token JWT para debug, garantir que esteja logando apenas nos profiles de DEV e HML.

### Base de Dados

| Ambiente | KeyVault | Base |
|----------|----------|------|
| DEV | [kvazudv...] | [base-dev] |
| HML | [kvazuho...] | [base-hml] |
| PRD | [kvazupr...] | [base-prd] |

**Secrets:**

| Secret | Objetivo |
|--------|----------|
| [nome-do-secret] | URL de conexão para a base de dados |
| [nome-do-secret] | URL de conexão no ServiceBus |

### Mensageria (Opcional)

| Fila | Objetivo |
|------|----------|
| [nome-da-fila] | [descrição do uso] |

### Repositórios

| Repositório | Link |
|-------------|------|
| SRV | [link] |

---

## 🚫 FORA DE ESCOPO (Opcional)

- [Item fora de escopo 1]
- [Item fora de escopo 2]

---

## ⚠️ RISCOS

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| [Descrição] | Alta / Média / Baixa | Alto / Médio / Baixo | [Ação de mitigação] |

---

## 🔗 DEPENDÊNCIAS

| Dependência | Tipo | Responsável | Status |
|-------------|------|-------------|--------|
| [Descrição] | Sistema / Time / Aprovação / US | [Nome] | Pendente / Em andamento / Concluído |

---

## 🗂️ MATERIAL ADICIONAL

| Item | Link |
|------|------|
| Inventário de Componentes | [Link Confluence] |
| Service Bus + Filas | [Link Confluence] |
| Arquitetura Hexagonal | [Link Confluence] |
| [Outro item] | [URL] |
```

---

## Exemplo de Prompt para Gerar esta User Story

```
Com base na User Story de negócio US-XXXX (já criada pelo PO),
expanda para uma User Story completa usando o template user-story-complete-template.md.

Conecte-se ao repositório [nome-do-repositório] para verificar:
- Padrões de nomenclatura existentes
- Collections MongoDB já mapeadas
- Clientes Feign/RestClient já configurados
- Exceções existentes no projeto

Contexto técnico:
- Microsserviço: [nome-do-serviço]
- Stack: Java 21, Spring Boot 3.x, MongoDB, arquitetura hexagonal
- Endpoint a criar: POST /api/v1/[recurso]
- Integração com MS: [nome-do-serviço-externo] via SVC

Regras técnicas a detalhar:
- Mapeamento REST (request/response com exemplos JSON)
- Collection MongoDB: [NomeCollection] / [nomeFisico]
- Integração com MS [nome] usando Feign Client
- Mapeamento de erros seguindo tabela do Confluence
- HTTP Codes: 400 (validação), 412 (regra negócio), 500 (integração)

Informações técnicas adicionais:
- KeyVault DEV: [kvazudv...]
- Secret de conexão: [nome-do-secret]
```

## O que será gerado

- User Story completa com todos os aspectos de negócio preservados
- Mapeamento detalhado do endpoint REST (request/response com exemplos JSON)
- Regras técnicas com Data Mapping Origem × Destino
- Estrutura de Collection MongoDB (Nome Lógico × Nome Físico)
- Mapeamento de erros e HTTP Codes
- Informações de infraestrutura (KeyVault, Secrets, Mensageria)
- Referências para os repositórios e documentação do Confluence
- Pronto para refinamento com o time de desenvolvimento
