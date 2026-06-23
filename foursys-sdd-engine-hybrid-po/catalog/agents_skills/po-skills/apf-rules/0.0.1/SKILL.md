---
name: apf-rules
description: >
  Cria e otimiza User Stories e Features seguindo as regras de APF (Análise de Pontos de Função) do Bradesco,
  maximizando a pontuação de pontos de função. Use esta skill sempre que precisar escrever, revisar ou otimizar
  user stories, features, requisitos funcionais, cards ágeis ou qualquer documentação de requisitos que será
  medida por pontos de função. Também use quando o usuário mencionar APF, pontos de função, medição de software,
  dimensionamento de demandas, SFP, contagem de pontos, decomposição funcional, ou quando quiser entender como
  estruturar requisitos para obter a melhor pontuação APF possível — mesmo que não use esses termos exatos.
metadata:
  version: "0.0.1"
---

# Bradesco APF Writer — Escrita de User Stories Otimizadas para Pontos de Função

## Por que esta skill existe

No Bradesco, toda demanda de software é medida por **Análise de Pontos de Função (APF)** para dimensionar
esforço, custo e principalmente o valor entregue. A forma como uma User Story é escrita impacta diretamente na quantidade de pontos de função
que podem ser contados. Uma US mal escrita pode "esconder" funcionalidades legítimas, resultando em menos
pontos. Uma US bem escrita torna cada funcionalidade explícita e mensurável.

O objetivo desta skill é guiar a escrita de User Stories que **tornam visível todo o trabalho real** de
desenvolvimento, permitindo a contagem máxima e legítima de pontos de função.

---

## Conceitos Fundamentais

### O que é medido na APF

A APF conta dois tipos de componentes funcionais:

**Funções de Dados** — representam dados que o sistema armazena ou referencia:

| Tipo | Sigla | Descrição | Peso (PF) |
|------|-------|-----------|-----------|
| Arquivo Lógico Interno | ALI | Dados mantidos dentro da aplicação | 7,21 |
| Arquivo de Interface Externa | AIE | Dados apenas consultados de outro sistema | 6,21 |

**Funções Transacionais** — representam processos que o usuário executa:

| Tipo | Sigla | Descrição | Peso (PF) |
|------|-------|-----------|-----------|
| Entrada Externa | EE | Processo que altera dados internos (incluir, alterar, excluir) | 4,70 |
| Saída Externa | SE | Processo que gera informação derivada/calculada para o usuário | 5,52 |
| Consulta Externa | CE | Processo que recupera dados sem cálculo/derivação | 3,95 |
| Microsserviço | MS | Funções transacionais expostas como microsserviço | 1,33 |

### Nomenclatura Ágil Bradesco

No contexto ágil, o Bradesco usa termos simplificados:

| Termo Padrão APF | Termo Ágil Bradesco |
|-------------------|---------------------|
| ALI | Agrupamento de dados de negócio |
| AIE | Sistema referenciado |
| EE, SE, CE | Funcionalidade |
| Peso unificado de Funcionalidade | 5,52 PF |

### Fatores de Impacto (Projetos de Melhoria)

Quando a US altera funcionalidades já existentes, aplica-se um Fator de Impacto (FI):

| Tipo de Manutenção | FI |
|---------------------|----|
| Função nova (incluída) | 1,00 |
| Função de conversão | 1,00 |
| Função de dados alterada | 0,42 |
| Função transacional alterada | 0,60 |
| Função excluída | 0,30 |
| Função transacional com alteração cosmética | 0,25 |

**Fórmula:** `PFM = PF × FI`

> Para regras detalhadas, incluindo cenários especiais (cosméticos, NFR, multi-browser, batch, BPM),
> consulte `references/regras-apf.md` e `references/cenarios-especiais.md`.

---

## Processo de Escrita de User Stories Otimizadas

Ao receber um pedido para criar ou otimizar uma User Story, siga este processo:

### Passo 1 — Entender o Escopo

Identifique:
- **Tipo de projeto:** Desenvolvimento novo ou Melhoria/Evolução?
- **Funcionalidade principal:** O que o sistema deve fazer?
- **Dados envolvidos:** Quais entidades/coleções são criadas, alteradas ou consultadas?
- **Integrações:** Quais sistemas externos são consumidos ou alimentados?
- **Canais de entrega:** Web (quais browsers?), Mobile (quais plataformas?), API?
- **Documentação técnica disponível:** Há TRD, ADR, RFC ou Feature descrita? Ler integralmente para extrair detalhes.

### Passo 2 — Decompor em Componentes Funcionais

Esta é a etapa mais importante. Cada componente funcional identificado gera pontos.

#### Identificar Funções de Dados (ALI e AIE)

- **ALI:** Cada entidade/coleção/tabela de **dados de negócio** mantida pela aplicação = 1 ALI (7,21 PF)
- **AIE:** Cada sistema externo referenciado para consulta ou envio = 1 AIE (6,21 PF)

Regras práticas:
- Se a US cria, altera ou exclui dados em uma coleção → é ALI
- Se a US apenas consulta dados de outro sistema/serviço → é AIE
- Cada entidade lógica distinta conta separadamente (ex.: Cliente, Contrato e Endereço = 3 ALIs)

⚠️ **O que NÃO é ALI/AIE:**
- Configurações técnicas (credenciais, connection strings, properties) → NÃO é ALI
- Bibliotecas/libs técnicas → NÃO é ALI
- Organização de pastas/diretórios → NÃO é ALI
- Logs e registros de auditoria técnica → NÃO é ALI (são requisitos técnicos, não RFU)

#### Identificar Funções Transacionais (EE, CE, SE)

Cada **processo elementar (PE)** distinto é uma função transacional separada. Um PE deve ser a
**menor unidade significativa para o usuário** que deixa o negócio em **estado consistente**.

- **Incluir** registro = 1 EE (4,70 PF)
- **Alterar** registro = 1 EE (4,70 PF)
- **Excluir** registro = 1 EE (4,70 PF)
- **Consultar/Detalhar** registro = 1 CE (3,95 PF)
- **Listar** registros = 1 CE (3,95 PF)
- **Relatório** com dados calculados/derivados = 1 SE (5,52 PF)
- **Exportar** dados = 1 SE (5,52 PF)
- **Enviar dados** para outro sistema = 1 SE (5,52 PF)
- **Combo-box/Lista de seleção** que busca dados de **outra entidade lógica** = 1 CE (3,95 PF)

⚠️ **O que NÃO é Função Transacional separada (são sub-passos de um PE):**
- Validação de campos de entrada (faz parte do EE que os recebe)
- Validação de CPF/CNPJ, formato de data, obrigatoriedade (parte do PE de entrada)
- Verificação de conectividade (requisito técnico/NFR)
- Verificação de integridade (sub-passo do PE principal)
- Seleções estáticas com valores fixos/hardcoded (checkbox Sim/Não, radio Indeterminado/Personalizado) → são **Dados de Código**, não geram CE
- Geração + envio do mesmo arquivo = 1 PE (não separe se fazem parte do mesmo contexto de negócio)

### Passo 3 — Escrever a Seção APOIO APF

A seção `📌 APOIO APF` deve listar, de forma clara e explícita, todas as funcionalidades de alto nível e os ambientes de teste.

**Formato:**

```markdown
## 📌 APOIO APF

➡️ Funcionalidade de [verbo] + [objeto de negócio] + [contexto].
➡️ Funcionalidade de [verbo] + [objeto de negócio] + [contexto].
➡️ Sistema referenciado: [nome do sistema externo] — [endpoint/API/serviço].
➡️ Agrupamento de dados de negócio: [nome da entidade/coleção] ([novo|alterado]).
➡️ Realização de testes no browser Google Chrome.
➡️ Realização de testes no browser Microsoft Edge.
```

**Regras para APOIO APF:**

1. Cada funcionalidade distinta deve ter sua própria linha com ➡️
2. Use verbos de ação claros: inclusão, alteração, exclusão, consulta, listagem, geração, envio, validação
3. **Incluir ALIs explicitamente** com "Agrupamento de dados de negócio: [nome] ([novo|alterado])"
4. **Incluir AIEs explicitamente** com "Sistema referenciado: [nome] — [contexto de uso]"
5. Sempre inclua as linhas de browser quando a aplicação é web
6. Se houver multi-plataforma (Android, iOS), inclua uma linha para cada plataforma adicional
7. Se houver integrações, explicite cada uma como funcionalidade de "envio" ou "consulta"

### Passo 4 — Escrever a User Story Completa

Use o template padrão do Bradesco. A estrutura deve conter:

1. **APOIO APF** — Lista de funcionalidades (Passo 3)
2. **IDENTIFICAÇÃO** — **EU COMO** / **QUERO QUE** / **PARA** (keywords em negrito)
3. **REGRAS DE NEGÓCIO** — Cada regra explícita e verificável, em linguagem pura de negócio
4. **REGRAS TÉCNICAS** — Detalhamento técnico completo (DTOs, mappers, configs, error handling, observabilidade)
5. **CRITÉRIOS DE ACEITE** — Formato BDD (**DADO QUE** / **QUANDO** / **ENTÃO**) — um para cada cenário funcional, keywords em negrito
6. **DEPENDÊNCIAS** — Quais dependências estão relacionadas com esta US
7. **FORA DO ESCOPO** — O que não será feito nesta tarefa
8. **RISCOS** — Riscos associados com esta tarefa

#### Regras Críticas por Seção

##### IDENTIFICAÇÃO — Persona correta

A persona **EU COMO** deve ser uma pessoa real ou papel, **nunca** "Como sistema X":

| Tipo de US | Persona correta | Exemplo |
|---|---|---|
| Funcionalidade de negócio com impacto ao cliente | Papel de cliente ou área de negócio | "Cliente PJ", "Analista de Operações", "Gestor de Produto" |
| Funcionalidade técnica pura (infraestrutura, config) | "Tech Lead" | "Tech Lead" |
| Funcionalidade de backoffice/operação | Papel operacional | "Operador da área de Operações" |

❌ `EU COMO sistema Bradesco` / `EU COMO dupe-srv-duple-opt`
✅ `EU COMO Gestor de Produto de Duplicatas Escriturais` / `EU COMO Tech Lead do squad DUPE`

O **QUERO QUE** deve mencionar naturalmente os processos-chave que correspondem às funcionalidades do APOIO APF (ex.: "enviar, registrar protocolo e persistir rastreabilidade").

##### REGRAS DE NEGÓCIO — Linguagem pura de negócio, sem termos técnicos

As regras de negócio devem descrever **O QUE** o sistema faz do ponto de vista do negócio. **NUNCA** incluir termos técnicos como nomes de classes, filas, endpoints, mappers, DTOs, annotations ou frameworks.

❌ **ERRADO** (termos técnicos na RN):
> "O sistema deve consumir a fila `sbqenviooptin001` e chamar `OptInOptOutNucleaClient.enviarOptIn(Dup0515Request)` via Feign"

✅ **CORRETO** (linguagem de negócio):
> "O sistema deve enviar a solicitação de opt-in à registradora Nuclea consumindo a API de inclusão de opt-in (DUP0515) como sistema externo, traduzindo os dados do domínio Bradesco para o formato esperado pela registradora."

**Cada RN deve descrever naturalmente um Processo Elementar distinto**, tornando implícito para o medidor APF qual funcionalidade está sendo descrita:
- Mencionar **ação** (enviar, consultar, registrar, persistir, rotear)
- Mencionar **objeto de dados** (solicitação, protocolo, registro de controle)
- Mencionar **fonte/destino** quando houver integração ("consumindo a API X como fonte externa de dados" → AIE implícito)
- Mencionar **persistência** quando houver ALI ("persistir em registro de controle dedicado" → ALI implícito)

**Cada funcionalidade listada no APOIO APF deve ter pelo menos uma RN correspondente** que descreva o processo de negócio associado. Isso garante rastreabilidade natural entre APOIO APF ↔ RN ↔ CA sem precisar de referências explícitas.

##### REGRAS TÉCNICAS — Detalhamento técnico completo a partir do TRD

As regras técnicas devem ser ricas em detalhes de implementação. Quando houver TRD disponível, extrair e incluir:

| Elemento | O que incluir | Exemplo |
|---|---|---|
| **UseCase** | Passos numerados do fluxo, `@Bean` config completo, ports injetados | `@Bean public XInputPort xUseCase(YOutputPort y) { return new XUseCase(y); }` |
| **DTOs** | Estrutura `record` completa com tipos, tamanhos, obrigatoriedade, records aninhados | `record Dup0515Request(String indicadorTipoTitular, ...)` |
| **Feign Client** | Anotação `@FeignClient` completa com `name`, `url`, `configuration` | `@FeignClient(name="x", url="${...}", configuration=Y.class)` |
| **Mappers** | Tabela campo-a-campo `Origem → Destino → Observação` | Tabela markdown |
| **Resiliência** | YAML completo do Circuit Breaker com `recordExceptions` e `ignoreExceptions` | Bloco YAML |
| **Error Handling** | Tabela `Exceção → Ação → Motivo` | `HTTP 4xx → deadLetter → Falha irrecuperável` |
| **Configuração** | Blocos `application.yml` com env vars | `queue-name: ${ENV_VAR:default}` |
| **Dependências** | Artefatos `pom.xml` necessários | `<dependency>...</dependency>` |
| **Observabilidade** | Tabela de métricas `Nome → Tipo → Tags` + logs estruturados | `optin_envio_total{tipo=OPTIN}` |
| **Testes** | Cenários de cobertura ≥ 95% com casos listados | Cenários: sucesso, erro 4xx, CB aberto... |

##### CRITÉRIOS DE ACEITE — Cobertura completa dos cenários

Cada CA deve cobrir um cenário funcional distinto. Incluir:
- **Cenário de sucesso** (happy path)
- **Cenário de equivalência** (paridade com fluxo existente, quando aplicável)
- **Cenários de erro** (indisponibilidade, erro de negócio, dados inválidos)
- **Cenários de resiliência** (retry, fallback, circuit breaker)

### Passo 5 — Revisar para Maximizar Pontos

Consulte `references/checklist.md` para a lista completa de verificação. Os pontos principais:

**VERIFICAR QUE ESTÁ PRESENTE (maximiza pontos):**
- Cada operação CRUD está descrita separadamente?
- Cada combo-box/lista de seleção **que busca dados de outra entidade** está mencionada?
- Cada relatório/exportação/consulta está como funcionalidade independente?
- As entidades de dados (ALI) estão claramente identificadas **no APOIO APF e naturalmente nas RNs**?
- As integrações externas (AIE) estão documentadas **no APOIO APF e naturalmente nas RNs**?
- Os browsers de teste estão listados?
- Para melhorias: o tipo de alteração (inclusão, alteração, exclusão) está claro?
- **Cada funcionalidade do APOIO APF tem uma RN correspondente?**
- **Cada funcionalidade do APOIO APF tem um CA correspondente?**
- **A IDENTIFICAÇÃO menciona os processos-chave que mapeiam para funcionalidades?**

**VERIFICAR QUE NÃO ESTÁ INFLADO (evita rejeição pelo medidor):**
- Validações de campo NÃO estão contadas como EEs separadas?
- Seleções com valores estáticos/fixos NÃO estão como CEs?
- Configurações técnicas/infraestrutura NÃO estão como ALIs?
- Logs/auditoria técnica NÃO estão como ALIs?
- Sub-passos do mesmo processo NÃO estão separados artificialmente?
- Geração + envio do mesmo artefato NÃO estão como 2 PEs?

**VERIFICAR SEPARAÇÃO NEGÓCIO × TÉCNICO:**
- Regras de Negócio estão em linguagem pura de negócio, sem termos técnicos?
- Regras Técnicas contêm detalhamento completo de implementação (DTOs, configs, mappers)?
- Nenhuma RN menciona nomes de classes, filas, endpoints ou frameworks?

### Passo 6 — Uma US por Objetivo

**NUNCA** combinar dois objetivos em uma única User Story. Mesmo quando duas USs são muito similares (ex.: opt-in e opt-out), cada uma deve ser escrita separadamente com:
- Suas próprias Regras de Negócio
- Suas próprias Regras Técnicas com diferenças explicitadas
- Seus próprios Critérios de Aceite

---

## Técnicas de Decomposição para Maximizar Pontos

### 1. Decomposição CRUD Completa

❌ **Ruim (1 funcionalidade genérica):**
> "Gerenciar cadastro de clientes"

✅ **Bom (4+ funcionalidades distintas):**
> - Funcionalidade de inclusão de cliente
> - Funcionalidade de alteração de cliente
> - Funcionalidade de exclusão de cliente
> - Funcionalidade de consulta/detalhe de cliente
> - Funcionalidade de listagem de clientes

### 2. Componentes de Interface como Funções

Combo-boxes e listas de seleção que buscam dados **de outra entidade lógica ou sistema externo**
são Consultas Externas (CE) independentes.

❌ **Ruim (implícito):**
> "O campo tipo de pessoa deve ser selecionável"

✅ **Bom (explícito como funcionalidade):**
> - Funcionalidade de consulta de tipos de pessoa para seleção (combo-box)

⚠️ **ATENÇÃO — Quando NÃO contar como CE:**
> - Campos com valores fixos/estáticos (Sim/Não, Masculino/Feminino, Ativo/Inativo)
> - Radio buttons com opções hardcoded (Indeterminado/Personalizado)
> - Checkboxes com valores predefinidos que não vêm de outra entidade
> Esses são **Dados de Código** e NÃO geram CE separada.

### 3. Integrações como Funções Independentes

Cada integração com sistema externo gera funções contáveis.

❌ **Ruim (genérico):**
> "Integrar com o sistema de crédito"

✅ **Bom (cada operação explícita):**
> - Funcionalidade de consulta de score de crédito no sistema SPC (CE)
> - Funcionalidade de envio de proposta aprovada para o sistema de crédito (SE)

### 4. Cuidado com Validações

Validações de campos (obrigatoriedade, formato, CPF/CNPJ, datas) fazem PARTE do PE que recebe
os dados — NÃO são EEs separadas. Só conte validação como PE distinto se ela:
- Consulta um sistema externo independente (ex.: consulta CPF na Receita Federal = CE separada)
- Resulta em estado de negócio distinto (ex.: verificar duplicidade antes de incluir = CE separada)

### 5. Relatórios e Exportações

Cada relatório, dashboard ou exportação com dados calculados/derivados é uma SE independente.

❌ **Ruim:**
> "Gerar relatório de vendas"

✅ **Bom:**
> - Funcionalidade de geração de relatório de vendas por período (SE)
> - Funcionalidade de exportação de relatório de vendas em CSV (SE)
> - Funcionalidade de geração de gráfico de tendência de vendas (SE)

### 6. Multi-Browser e Multi-Plataforma

A entrega em múltiplos browsers ou plataformas gera pontos adicionais.

- Cada browser adicional: réplica das funções transacionais na medição
- Cada plataforma adicional (Android, iOS, Windows): réplica das funções transacionais

Sempre inclua no APOIO APF:
```
➡️ Realização de testes no browser Google Chrome.
➡️ Realização de testes no browser Microsoft Edge.
```

> Para detalhes completos sobre cenários especiais, consulte `references/cenarios-especiais.md`.

---

## Exemplos

Para exemplos completos de User Stories otimizadas para APF, consulte `references/exemplos.md`.

Esses exemplos mostram:
- User Story de desenvolvimento novo com decomposição completa
- User Story de melhoria/evolução com fatores de impacto
- User Story com cenários especiais (multi-browser, integrações)

---

## Cards Ágeis — Critérios de Descarte

Nem todo card ágil é mensurável por APF. Não tente contar pontos para:

| Motivo de Descarte | Exemplos |
|---------------------|----------|
| Atividade de desenvolvimento/projeto | Setup de ambiente, homologação, testes, análise de vulnerabilidade |
| Atividade administrativa/técnica | Atividade administrativa, técnica, de desenvolvimento |
| Correção/Incidentes | Correção de bugs, incidentes, sustentação |
| Já dimensionado | Story clonada, já contada em outra US |
| Sem descrição | Card sem descrição ou link para documentação |
| Escopo não identificável | Não é possível identificar o escopo da implementação |

---

## Referências

| Arquivo | Quando Consultar |
|---------|------------------|
| `references/regras-apf.md` | Regras completas de medição, pesos, fórmulas e fatores de impacto |
| `references/cenarios-especiais.md` | Cenários especiais: cosméticos, NFR, multi-browser, multi-plataforma, batch, BPM |
| `references/exemplos.md` | Exemplos completos de User Stories otimizadas para APF (CRUD web + integrações) |
| `references/exemplos-backend.md` | Exemplos de User Stories backend/serviços (integrações API, filas, mensageria, event-driven) |
| `references/checklist.md` | Checklist rápido de revisão para maximizar pontos |
