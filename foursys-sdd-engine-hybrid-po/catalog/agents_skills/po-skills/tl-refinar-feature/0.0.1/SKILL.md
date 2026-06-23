---
name: 'tl-refinar-feature'
description: |
  Analisa uma feature Jira, mapeia serviços impactados, propõe abordagens técnicas
  com trade-offs, gera documentação formal (ADR para novas funcionalidades, RFC para
  alterações) e conduz revisão. Invoque ao ver "refinar feature", "gerar ADR",
  "gerar RFC", "refinamento técnico", "mapear impacto de feature".
metadata:
  version: "0.0.1"
---

# Refinamento técnico de features

Analisa uma feature do Jira, mapeia serviços impactados, propõe abordagens técnicas, gera documentação (ADR ou RFC), conduz revisão multi-agente e oferece a transição para o planejamento de implementação.

> 💡 **Pipeline recomendado:** `tl-iniciar-exploracao` (opcional) → `tl-refinar-feature` → `gerar-user-story` → `tl-gerar-plano` → `tl-executar-implementacao`. Se a exploração foi executada previamente, este comando consome o `exploracao.md` para evitar retrabalho em classificação, gaps e abordagens.

<HARD-GATE>
Não gere o ADR ou RFC sem antes apresentar ao usuário 2-3 abordagens técnicas com trade-offs e obter a aprovação explícita da abordagem escolhida. Este gate se aplica a toda feature, independentemente da percepção de simplicidade.
</HARD-GATE>

<CONTEXT-BUDGET>
Este comando usa o padrão **lean-orchestrator**: o agente principal orquestra o fluxo e mantém apenas resumos e referências a arquivos. Todo trabalho pesado é delegado a sub-agentes.

**O contexto principal NUNCA deve conter:**
- Conteúdo bruto de código-fonte dos serviços (delegue análise a sub-agentes)
- Conteúdo completo de README.md dos repositórios (delegue leitura a sub-agentes)

**O contexto principal DEVE conter apenas:**
- Resumo da feature do Jira (nome, descrição, regras, critérios de aceite)
- Tabela de mapeamento de serviços (repositório, tipo, motivo — sem README completo)
- Abordagem técnica escolhida (1 parágrafo + decisões-chave)
- Caminhos dos arquivos gerados (ADR/RFC, análises, mapeamentos)
- Resumos ≤20 linhas retornados por sub-agentes
- Feedbacks da revisão multi-agente (≤500 palavras por revisor)

**Artefatos intermediários** são escritos em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/` e servem como handoff entre fases:
```
<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/
├── _intermediarios/
│   ├── exploracao.md            # Exploração técnica prévia (gerado pelo tl-iniciar-exploracao, opcional)
│   ├── feature-impact.md        # Serviços impactados por esta feature (Passo 2)
│   ├── analise/                # Análise de código por serviço (Passo 3)
│   │   ├── <servico-1>.md
│   │   └── <servico-2>.md
│   └── padroes-aplicaveis.md   # Padrões de código relevantes (Passo 3)
├── adr/
├── rfc/
├── user-stories/
└── usecases/

<centro-de-custo>-doc-<projeto>/workspace-mapping.md        # Mapeamento compartilhado de serviços (reutilizável entre features)
```
</CONTEXT-BUDGET>

## Padrões de código

Ao precisar incluir snippets de código nas abordagens técnicas ou no projeto da solução (ADR/RFC), consulte as skills de padrões relevantes por tecnologias:

- prefixo `springboot`
- prefixo `angular`
- prefixo `cobol`

**Instrução para consultar skills de padrões:**
- Receba o contexto técnico específico (ex: "integração via Kafka entre srv-A e srv-B", "componente Angular com formulário reativo")
- Carregue APENAS a(s) skill(s) relevante(s) para esse contexto (ex: se envolve Kafka, carregue apenas `springboot-kafka`)

## Regras de saída

Todos os arquivos gerados devem ser escritos no repositório de documentação na pasta `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>`, seguindo a estrutura definida acima no CONTEXT-BUDGET.

> Os arquivos em `_intermediarios/` são artefatos de trabalho do processo de refinamento. Podem ser consultados para debugging ou reutilizados em futuras iterações.

## Processo

### Passo 1: Coletar contexto da feature

Carregue a skill `jira-api` com os seguintes parâmetros:
- OPERACAO: `get-issue`
- JIRA_KEY: chave da feature fornecida (ex: DUPE-1234)

```bash
python skills/jira-api/scripts/jira_cli.py get-issue --key ${{jira-key}}
```

Extraia: **nome**, **descrição**, **regras de negócio**, **requisitos** e **critérios de aceite**.
3. Verifique se existe `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/exploracao.md`:

   **Se a exploração existe:**
   - Leia o documento de exploração
   - Use a **classificação** (nova funcionalidade vs alteração) da exploração
   - Considere os **gaps de requisitos** já resolvidos — não repergunte o que já foi respondido
   - Use a **abordagem técnica escolhida** como ponto de partida para o Passo 3.0
   - Considere a **visão inicial de impacto** em serviços como input para o Passo 2
   - Verifique se há **perguntas pendentes** — se houver, pergunte ao usuário antes de prosseguir
   - Informe ao usuário: "Usando exploração técnica prévia. Classificação, gaps e abordagem já discutidos."

   **Se a exploração NÃO existe (fallback):**
   - Classifique a feature como **nova funcionalidade** ou **alteração de funcionalidade existente**
   - Se as informações estiverem incompletas ou ambíguas, pergunte ao usuário **uma lacuna por vez** — aguarde a resposta antes de fazer a próxima pergunta. Priorize nesta ordem: critérios de aceite → regras de negócio → requisitos → descrição. **NUNCA invente informações**.

> 💡 **Recomendação:** Para features complexas, execute `tl-iniciar-exploracao <JIRA_KEY>` antes deste comando para garantir que viabilidade, gaps e abordagem foram discutidos previamente.

### Passo 2: Mapear serviços impactados

> ⚡ **Context-budget**: se a exploração foi executada, o mapeamento já existe em disco. Senão, delega a sub-agente via skill `service-mapper`.

1. Verifique se existe `<centro-de-custo>-doc-<projeto>/workspace-mapping.md` **e** `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/feature-impact.md`:

   **Se ambos existem (exploração prévia):**
   - Leia `<centro-de-custo>-doc-<projeto>/workspace-mapping.md` (mapeamento compartilhado) e `feature-impact.md` (impacto desta feature)
   - Extraia a tabela de serviços impactados e os service briefs relevantes
   - Informe ao usuário: "Usando mapeamento de serviços da exploração prévia."

   **Se faltam (fallback):**
   - Carregue a skill `service-mapper` com os seguintes parâmetros:
     - JIRA_KEY: chave da feature (ex: DUPE-1234)
     - FEATURE_CONTEXT: resumo extraído no Passo 1 (nome, descrição, regras, critérios de aceite)
     - WORKSPACE_PATH: caminho do workspace com os repositórios

2. Apresente o mapeamento ao usuário e aguarde confirmação antes de avançar. Corrija qualquer serviço que o usuário indique estar errado ou faltando.

### Passo 3: Análise técnica

A partir da feature do Jira e do mapeamento de serviços, analise os impactos técnicos e proponha abordagens antes de gerar o documento.

#### Passo 3.0 — Propor abordagens técnicas

**Se a exploração existe e contém abordagem escolhida:**

1. Apresente ao usuário a abordagem escolhida na exploração.
2. Valide se a abordagem ainda faz sentido considerando o mapeamento detalhado de serviços (Passo 2). A visão de impacto da exploração era preliminar — o mapeamento real pode revelar novos serviços ou descartar outros.
3. Se o usuário confirmar → prossiga direto para 3.1 ou 3.2 (conforme classificação da exploração).
4. Se o mapeamento revelou mudanças relevantes ou o usuário quiser reconsiderar → proponha abordagens como no fluxo abaixo.

**Se a exploração NÃO existe (fallback):**

Antes de gerar qualquer documento, proponha **2 a 3 abordagens técnicas** para implementar a feature. Para cada abordagem, apresente:

- **Descrição** da solução
- **Trade-offs** (vantagens e desvantagens)
- **Impacto em cada serviço** identificado no Passo 2

Para visualizar arquitetura ou fluxos comparativos entre abordagens, use a skill `mermaid-generator` para gerar diagramas que facilitem a escolha pelo usuário.

Conclua com uma **recomendação justificada**. Aguarde o usuário escolher ou adaptar uma das abordagens. Só prossiga após a aprovação explícita.

Em seguida, siga o caminho adequado conforme o tipo de feature (determinado pela exploração ou pela classificação do Passo 1):

- **Feature nova** → Passo 3.1
- **Alteração de funcionalidade existente** → Passo 3.2

#### Passo 3.1 — Nova funcionalidade

> ⚡ **Context-budget**: a análise de código de cada serviço é delegada a sub-agentes. O agente principal recebe apenas resumos e usa-os para projetar a solução.

1. **Para cada serviço impactado, despache um sub-agente** com a seguinte tarefa:
   - Analisar o código do serviço para entender: entry points relevantes, contratos (DTOs, eventos, APIs), padrões de comunicação com outros serviços
   - Consultar as skills de padrões relevantes ao tipo do serviço (conforme seção **Padrões de código**)
   - Escrever a análise completa em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/analise/<nome-servico>.md`
   - **Retornar ao agente principal APENAS** um resumo de ≤20 linhas contendo: entry points encontrados, contratos-chave, integrações mapeadas, padrões de código aplicáveis
2. Com base nos resumos retornados, projete a solução técnica definindo o que precisa ser feito em cada serviço.
3. Carregue a skill `tech-spec-documentation` com os seguintes parâmetros:
   - TIPO: `adr`
   - FEATURE_CONTEXT: resumo da feature (nome, descrição, regras, critérios de aceite)
   - DECISAO_TECNICA: abordagem aprovada no Passo 3.0
   - CAMINHO_SAIDA: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/adr/`

#### Passo 3.2 — Alteração de funcionalidade existente

> ⚡ **Context-budget**: o usecase-analyzer e a análise de código são delegados a sub-agentes. O agente principal recebe apenas resumos.

1. **Despache um sub-agente** para executar a skill `usecase-analyzer` nos serviços impactados:
   - O sub-agente deve mapear o funcionamento atual dos serviços (casos de uso, implementações, integrações)
   - Consultar as skills de padrões relevantes ao tipo dos serviços (conforme seção **Padrões de código**)
   - Gerar a documentação end-to-end na pasta `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/usecases/`, explicando: casos de uso atuais, como são implementados em cada serviço, como os serviços se integram (contratos, eventos, filas)
   - Escrever análises por serviço em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/analise/<nome-servico>.md`
   - **Retornar ao agente principal APENAS** um resumo de ≤30 linhas contendo: fluxos end-to-end identificados, contratos entre serviços, pontos de mudança necessários, padrões de código aplicáveis
2. Se faltar informação que não pode ser obtida do código (contratos de serviços externos, regras não documentadas, etc.), pergunte ao usuário.
3. Carregue a skill `tech-spec-documentation` com os seguintes parâmetros:
   - TIPO: `rfc`
   - FEATURE_CONTEXT: resumo da feature (nome, descrição, regras, critérios de aceite)
   - ANALISE_USECASE: resumo do usecase-analyzer (fluxos atuais, contratos, pontos de mudança)
   - CAMINHO_SAIDA: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/rfc/`

### Passo 4: Auto-revisão do documento gerado

Carregue a skill `document-reviewer` com os seguintes parâmetros:
- DOCUMENT_PATH: caminho do ADR ou RFC gerado no Passo 3.1 ou 3.2
- DOCUMENT_TYPE: `adr` ou `rfc` (conforme o documento gerado)
- REFERENCE_PATHS: caminho da feature no Jira + exploração técnica (se existir)

Corrija os problemas encontrados diretamente no documento antes de avançar para a revisão pelo usuário.

### Passo 5: Revisão pelo usuário

Após aplicar (ou não) os feedbacks, solicite ao usuário que revise o documento antes de finalizar:

> "Documento atualizado e salvo em `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/`. Por favor, revise e me diga se deseja ajustar algo antes de prosseguirmos."

Aguarde a resposta. Se houver alterações solicitadas, aplique-as e informe o usuário antes de prosseguir. Só avance para o Passo 6 após a aprovação.

### Passo 6: Terminal State

> ⚡ **Context-budget**: este comando encerra aqui. Comandos subsequentes devem ser invocados em sessões separadas para evitar acúmulo de contexto.

Após a aprovação do documento, liste todos os arquivos gerados com seus caminhos completos:

```
## ✅ Refinamento concluído

### Arquivos gerados
- ADR/RFC: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/adr/<arquivo>.md` ou `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/rfc/<arquivo>.md`
- Exploração técnica (se existir): `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/exploracao.md`
- Mapeamento de serviços: `<centro-de-custo>-doc-<projeto>/workspace-mapping.md`
- Impacto na feature: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/feature-impact.md`
- Análises por serviço: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/analise/*.md`
- Padrões aplicáveis: `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/_intermediarios/padroes-aplicaveis.md`
- Use cases (se aplicável): `<centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/usecases/*.md`

### Próximos passos (invoque em uma nova sessão)

1. **Gerar user stories + Tech Solution:**
   `gerar-user-story <JIRA_KEY> <centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/<adr|rfc>/<arquivo>.md`

2. **Gerar plano de implementação (após user stories geradas):**
   - Todas as USs em paralelo (recomendado):
     `tl-gerar-plano <centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/<adr|rfc>/<arquivo>.md --all-us`
   - Uma US específica:
     `tl-gerar-plano <centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/<adr|rfc>/<arquivo>.md --us <centro-de-custo>-doc-<projeto>/<JIRA_KEY>/user-stories/<slug>.md`

3. **Executar implementação (após planos gerados):**
   - Todos os planos (recomendado):
     `tl-executar-implementacao <centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/planos/_indice-planos.md --all`
   - Um plano específico:
     `tl-executar-implementacao <centro-de-custo>-doc-<projeto>/EPIC-<JIRA_KEY>/planos/plano-<slug>.md`
```

**NÃO invoque automaticamente** `gerar-user-story` ou `tl-gerar-plano` nesta sessão. Apresente os comandos acima para o usuário invocar separadamente, garantindo que cada comando inicie com um contexto limpo.
