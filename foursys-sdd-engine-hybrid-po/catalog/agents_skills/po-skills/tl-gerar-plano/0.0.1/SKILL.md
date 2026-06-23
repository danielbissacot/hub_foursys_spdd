---
name: 'tl-gerar-plano'
description: |
  Gera planos de implementação detalhados a partir de ADR/RFC + User Stories,
  organizados por US com tasks TDD bite-sized e commits frequentes. Suporta
  planejamento individual ou batch com sub-agentes paralelos. Invoque ao ver
  "gerar plano", "planejar implementação", "criar plano de implementação".
metadata:
  version: "0.0.1"
---

# Planejamento de implementação técnica

Transforma um ADR ou RFC aprovado em planos de implementação detalhados, **decompostos por User Story**. Cada US produz um plano independente — o que permite planejamento e execução paralelos via sub-agentes.

> **Audiência do plano:** o plano será executado por um agente (ou desenvolvedor) que tem **zero contexto** sobre a codebase e o domínio de negócio. Documente tudo: paths exatos, código completo, comandos com output esperado. Assuma competência técnica geral, mas nenhum conhecimento prévio do projeto.

> **Invocado pelo prompt:** `tl-refinar-feature` (Passo 5.2) ou `gerar-user-story` (Passo 7)

**Anuncie ao iniciar:** "Estou usando o prompt `tl-gerar-plano` para criar o(s) plano(s) de implementação."

## Modos de operação

| Modo | Invocação | Descrição |
|------|-----------|-----------|
| **Single US** | `tl-gerar-plano <rfc-path> --us <us-path>` | Gera plano para **uma** User Story. Ideal para planejamento incremental ou replanejamento de uma US específica. |
| **Batch** | `tl-gerar-plano <rfc-path> --all-us` | Despacha **um sub-agente por US** em paralelo. Cada sub-agente executa o modo Single US. O orquestrador gera primeiro o plano do Tech Solution (se existir) e depois consolida tudo num índice mestre. |

Se o usuário não especificar modo, pergunte qual prefere antes de prosseguir.

## Pré-requisitos

- ADR ou RFC aprovado pelo usuário
- User Stories geradas em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/user-stories/` (obrigatório — geradas pelo `gerar-user-story`)
- Tech Solution em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/tech-solution/tech-solution.md` (opcional — gerado automaticamente pelo `gerar-user-story` quando há shared concerns)
- Lista de serviços impactados com tipos e motivos (fornecida pelo `tl-refinar-feature`)
- Chave Jira da feature

## Padrões de código

Antes de escrever qualquer código em um step do plano, consulte as skills de padrões do catálogo correspondentes ao tipo do serviço:

| Tipo de serviço | Skills a consultar |
|----------------|--------------------|
| `fed` (Angular) | `angular-component`, `angular-di`, `angular-forms`, `angular-http`, `angular-routing`, `angular-signals`, `angular-testing`, `angular-tooling`, `angular-directives` |
| `bff` / `srv` / `fun` (Spring Boot) | `springboot-feign-client`, `springboot-kafka`, `springboot-mongodb`, `springboot-rest-client`, `springboot-blob-storage`, `springboot-service-bus`, `springboot-testing` |

Não é necessário consultar todas as skills — identifique quais são relevantes para o que está sendo implementado naquela task (ex: se a task envolve integração via Feign, consulte `springboot-feign-client`; se envolve testes, consulte `springboot-testing` ou `angular-testing`).

> **Este requisito se aplica a todos os steps com code blocks.** Skills de padrão garantem que o código gerado segue as convenções do projeto antes de chegar ao desenvolvedor.

## Regras de saída

Os planos gerados devem ser salvos em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/planos/`:

```
<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/planos/
├── _indice-planos.md              # Índice mestre com DAG de dependências (batch only)
├── plano-tech-solution.md         # Plano do Tech Solution (se existir)
├── plano-<US-1-slug>.md           # Plano da US 1
├── plano-<US-2-slug>.md           # Plano da US 2
└── ...
```

**Single US:** gera apenas `plano-<US-slug>.md`.

**Batch:** gera todos os planos + `_indice-planos.md`.

**Dentro de cada plano:** as tasks de cada serviço são agrupadas e independentes entre si, permitindo execução paralela por serviço via `dispatching-parallel-agents`.

## Verificação de escopo

Antes de começar, verifique se o ADR/RFC cobre múltiplos subsistemas independentes que poderiam ser refinamentos separados. Se sim, sugira dividir em planos separados — um por subsistema. Cada plano deve produzir software funcional e testável por conta própria.

## Estrutura de arquivos

Antes de definir as tasks, mapeie os arquivos que serão criados ou modificados em cada serviço. Esta é a etapa onde as decisões de decomposição são consolidadas.

- Cada arquivo deve ter uma responsabilidade clara e bem definida. Prefira arquivos menores e focados — edições são mais confiáveis quando o arquivo inteiro cabe no contexto.
- Arquivos que mudam juntos devem ficar juntos. Divida por responsabilidade, não por camada técnica.
- Em codebases existentes, siga os padrões estabelecidos. Se um arquivo que você vai modificar cresceu demais, incluir um split como task separada é razoável desde que sirva ao objetivo atual.

Esta estrutura informa a decomposição das tasks. Cada task deve produzir mudanças autocontidas que façam sentido de forma independente.

## Granularidade das tasks

**Cada step é uma ação (2-5 minutos):**
- "Escrever o teste com falha" — step
- "Executar para confirmar que falha" — step
- "Implementar o mínimo para o teste passar" — step
- "Executar para confirmar que passa" — step
- "Commit" — step

## Sem placeholders

Todo step deve conter o conteúdo real que o desenvolvedor precisa. Estas são **falhas de plano** — nunca escreva:
- "TBD", "TODO", "implementar depois", "preencher detalhes"
- "Adicionar tratamento de erro adequado" / "adicionar validação" / "tratar edge cases"
- "Escrever testes para o acima" (sem o código de teste real)
- "Similar à Task N" (repita o código — o desenvolvedor pode estar lendo tasks fora de ordem)
- Steps que descrevem o que fazer sem mostrar como (code blocks são obrigatórios em steps de código)
- Referências a tipos, funções ou métodos não definidos em nenhuma task

## Processo

### Passo 0: Detectar modo de operação

1. Se o argumento inclui `--us <caminho>` → **Modo Single US**. Prossiga com o Passo 1.
2. Se o argumento inclui `--all-us` → **Modo Batch**. Prossiga com o Passo 1.
3. Se recebeu apenas o caminho do ADR/RFC sem flag → pergunte ao usuário:

> "Como deseja planejar a implementação?
>
> **1. Todas as USs em paralelo (recomendado)** — despacho um sub-agente por US
>
> **2. Uma US específica** — informe o caminho da US"

### Passo 1: Ler e entender o contexto

1. Leia o ADR ou RFC fornecido na íntegra.
2. Verifique se existe `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/tech-solution/tech-solution.md`. Se sim, leia-o — ele define os artefatos compartilhados que estarão disponíveis para as USs.
3. **Single US:** leia a User Story fornecida e extraia os requisitos, regras de negócio, regras técnicas e critérios de aceite específicos desta US.
4. **Batch:** liste todos os arquivos em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/user-stories/` e leia cada US para construir o panorama completo.
5. Liste os requisitos e decisões técnicas extraídas.
6. Aplique a verificação de escopo (seção acima).
7. Se houver ambiguidades que impeçam o planejamento, pergunte ao usuário **uma de cada vez** antes de prosseguir.

### Passo 2: Mapear arquivos e pontos de mudança

Para cada serviço impactado **pela US em questão** (Single US) ou **pelo Tech Solution** (Batch, primeiro), identifique:

- Arquivos a **criar** (com path exato)
- Arquivos a **modificar** (com path exato e linha aproximada quando possível, ex: `src/Foo.java:45-80`)
- Arquivos de **teste** correspondentes
- **Dependências entre serviços:** se um serviço precisa de contrato publicado por outro, registre essa dependência explicitamente
- **Artefatos do Tech Solution disponíveis:** para cada arquivo, anote quais artefatos do Tech Solution ele utiliza (ex: "usa `PropostaDTO` criado no Tech Solution")

> **Single US:** mapeie apenas os arquivos relevantes para esta US. Artefatos do Tech Solution são referenciados como pré-existentes (já terão sido implementados).
>
> **Batch:** mapeie primeiro os arquivos do Tech Solution, depois os de cada US. O mapeamento de cada US deve explicitar o que usa do Tech Solution.

### Passo 2.5: Gerar plano do Tech Solution (Batch only)

Se o Tech Solution existe (`<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/tech-solution/tech-solution.md`):

1. Consulte as skills de padrões correspondentes aos tipos dos serviços envolvidos (seção **Padrões de código**).
2. Gere `plano-tech-solution.md` com tasks para criar cada artefato compartilhado.
3. O plano segue a mesma estrutura de steps (TDD, código real, commits frequentes).
4. Tasks organizadas por serviço.
5. Este plano será executado **primeiro**, antes de qualquer plano de US.

### Passo 3: Gerar plano(s) de implementação das USs

> Antes de escrever os steps com código de cada serviço, consulte as skills de padrões correspondentes ao tipo do serviço conforme a seção **Padrões de código** acima.

#### Modo Single US

Gere `plano-<US-slug>.md` seguindo o template abaixo. O escopo é limitado à US fornecida — não inclua tasks de outras USs.

#### Modo Batch

> ⚡ **Pré-requisito:** Ative `/fleet` antes de despachar sub-agentes em paralelo. Monitore com `/tasks`.

1. O orquestrador (agente principal) já terá gerado o `plano-tech-solution.md` no Passo 2.5.
2. Para cada US, despache um **sub-agente independente** com o seguinte contexto:
   - Caminho do ADR/RFC
   - Caminho da User Story específica
   - Caminho do Tech Solution (para que o sub-agente saiba quais artefatos já estarão disponíveis)
   - Lista de serviços impactados com tipos
   - Instrução: "Execute o modo Single US do `tl-gerar-plano` para esta US. Gere o plano em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/planos/plano-<US-slug>.md`."
3. Os sub-agentes rodam em paralelo (não há dependência entre planos de USs — o Tech Solution resolve os shared concerns).
4. Aguarde todos os sub-agentes concluírem.

### Template do plano por User Story

O plano gerado (seja no modo Single US ou por sub-agente no Batch) deve seguir o template em `references/plan-template.md`. Leia o template e preencha com dados reais da US.

### Passo 4: Auto-revisão do(s) plano(s)

Antes de despachar o reviewer, faça você mesmo esta checagem rápida:

1. **Cobertura da spec:** releia os requisitos e critérios de aceite da US. Cada um tem uma task correspondente? Liste gaps.
2. **Placeholder scan:** busque por red flags do "Sem placeholders" acima — TBDs, "implementar depois", "similar à Task N", steps sem código. Corrija inline.
3. **Consistência de tipos:** os nomes de tipos, métodos e propriedades usados em tasks posteriores batem com o que foi definido em tasks anteriores? Ex: `clearLayers()` na Task 3 mas `clearFullLayers()` na Task 7 é um bug.

Se encontrar problemas, corrija diretamente no plano antes de avançar.

> **Batch:** cada sub-agente executa esta auto-revisão para o seu próprio plano.

### Passo 5: Revisão por subagente

Despache um subagente que carregue a skill `document-reviewer` com:
- DOCUMENT_PATH: caminho do plano gerado
- DOCUMENT_TYPE: `plano-implementacao`
- REFERENCE_PATHS: caminho do ADR/RFC + caminho da User Story correspondente + Tech Solution (se aplicável)
- REVIEW_CRITERIA_PATH: `references/plan-reviewer-criteria.md` (critérios específicos de planos)

Se o revisor encontrar problemas, corrija-os no plano e informe o usuário antes de prosseguir.

> **Batch:** cada sub-agente despacha seu próprio revisor. O orquestrador coleta os resultados.

### Passo 6: Consolidar índice mestre (Batch only)

Se no modo Batch, gere `_indice-planos.md` seguindo o template em `references/index-template.md`. Preencha com os dados reais dos planos gerados.

### Passo 7: Entregar o(s) plano(s)

#### Modo Single US

1. Salve o plano em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/planos/plano-<US-slug>.md`.
2. Informe ao usuário: caminho do arquivo, serviços impactados e total de tasks.
3. Ofereça as opções de execução:

> "Plano gerado: **N tasks** em **M serviços** — `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/planos/plano-<US-slug>.md`
>
> **Opções de execução:**
>
> **1. Executar automaticamente (recomendado)** — invoco `tl-executar-implementacao` que orquestra worktrees, subagents com TDD, code review e PRs:
> `tl-executar-implementacao <centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/planos/plano-<US-slug>.md`
>
> **2. Executar manualmente** — mantenho os planos para você executar no seu tempo.
>
> Qual prefere?"

Se o usuário escolher a opção 1, invoque o prompt `tl-executar-implementacao` passando o caminho do plano.

#### Modo Batch

1. Salve todos os planos e o índice em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/planos/`.
2. Informe ao usuário: número de planos, total de serviços e total de tasks (consolidado).
3. Ofereça as opções de execução:

> "Planos gerados: **P planos** (**N tasks** totais em **M serviços**)
>
> Índice: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/planos/_indice-planos.md`
>
> **Opções de execução:**
>
> **1. Executar automaticamente (recomendado)** — invoco `tl-executar-implementacao --all` que orquestra: Tech Solution primeiro, depois USs em paralelo, com worktrees isolados, TDD, code review e PRs:
> `tl-executar-implementacao <centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/planos/_indice-planos.md --all`
>
> **2. Executar um plano específico** — escolha qual plano executar:
> `tl-executar-implementacao <centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/planos/plano-<slug>.md`
>
> **3. Executar manualmente** — mantenho os planos para você executar no seu tempo.
>
> Qual prefere?"

Se o usuário escolher a opção 1 ou 2, invoque o prompt `tl-executar-implementacao` passando os argumentos correspondentes.

## Lembre-se

- Paths exatos sempre
- Código completo em todo step que mexe em código — mostre o código, não descreva
- Comandos exatos com output esperado
- DRY, YAGNI, TDD, commits frequentes
- **Escopo da US:** cada plano cobre apenas a US correspondente — nunca inclua tasks de outras USs
- **Tech Solution:** artefatos compartilhados já existem quando a US é implementada — referencie-os, não recrie
- **Batch mode:** sub-agentes são independentes — forneça contexto completo a cada sub-agente (caminho do RFC, da US, do Tech Solution)


