---
name: explorar-feature
description: |
  Conduz exploração técnica estruturada de uma feature do Jira antes do refinamento formal.
  Valida viabilidade, captura gaps de requisitos, discute opções de arquitetura, surfaceia
  riscos e produz o documento exploracao.md que alimenta o refinar-feature. Use sempre que
  uma feature precisar de exploração técnica antes do refinamento, ao iniciar o pipeline
  de refinamento de uma nova demanda, ou quando o Tech Lead precisar discutir abordagens
  antes de decidir. Invoque ao ver pedidos como "explorar feature", "discutir abordagens",
  "validar viabilidade", "preciso entender a feature antes de refinar" — ou quando o
  comando explorar-feature for chamado. Esta skill é conversacional: trabalha perguntando
  ao usuário, não lendo código.
metadata:
  version: "0.0.1"
---

# Exploração Técnica de Features

## Por que esta skill existe

Refinar uma feature sem exploração prévia gera retrabalho: o refinamento segue uma
abordagem que depois precisa ser descartada, gaps de requisitos só aparecem no meio do
documento técnico, e riscos óbvios ficam sem mitigação. Esta skill resolve isso com uma
conversa estruturada que precede o refinamento — ela é leve em contexto (sem código,
sem READMEs), focada em decisões de alto nível.

O produto desta skill é o `exploracao.md` — um documento intermediário que o
`refinar-feature` consome para evitar retrabalho em classificação, gaps e abordagens.

## Entradas esperadas

- **FEATURE_CONTEXT** — nome, descrição, regras de negócio, requisitos, critérios de aceite
- **JIRA_KEY** — chave do épico/feature (ex: DUPE-1234)
- **CLASSIFICACAO** — `nova-funcionalidade` ou `alteracao` (pode ser inferida do contexto)
- **DOC_PATH** — caminho base para salvar artefatos (padrão: `docs/EPIC-<JIRA_KEY>/`)

## Passo 1: Confirmar entendimento

Apresente ao usuário um resumo conciso do que entendeu:

```
## Entendimento da Feature

**[JIRA_KEY]** — [Nome da Feature]

**Classificação:** Nova funcionalidade | Alteração de funcionalidade existente

**Resumo:** [2-3 frases: o que faz, para quem, qual problema resolve]

**Regras de negócio principais:**
- [regra 1]
- [regra 2]

**Critérios de aceite:**
- [critério 1]
- [critério 2]

Esse entendimento está correto? Quer ajustar algo antes de prosseguirmos?
```

Aguarde confirmação. Corrija o entendimento se necessário antes de avançar — prosseguir
com um entendimento incorreto invalida toda a exploração.

## Passo 2: Exploração por dimensões

Percorra as dimensões abaixo, uma pergunta por vez, adaptando-se ao fluxo da conversa.
Se uma resposta abrir uma thread mais importante, siga-a antes de voltar ao checklist.

| # | Dimensão | O que explorar | Quando pular |
|---|----------|----------------|-------------|
| 1 | **Completude de requisitos** | Cenários não cobertos, edge cases, regras implícitas, ambiguidades nos critérios de aceite | Nunca |
| 2 | **Viabilidade técnica** | A arquitetura atual suporta? Precisa de novos patterns, infra, serviços? Há limites de performance, volumetria, latência? | Nunca |
| 3 | **Opções de arquitetura** | Propor 2-3 abordagens macro com trade-offs; discutir e obter escolha | Quando a abordagem for óbvia sem alternativas razoáveis |
| 4 | **Dependências e integrações** | Serviços externos, APIs de terceiros, contratos, dados necessários, ordem de implementação | Se a feature é isolada em um único serviço |
| 5 | **Riscos técnicos** | Complexidade oculta, débitos que bloqueiam, performance, segurança, compliance bancário | Nunca |
| 6 | **Impacto em serviços** | Visão inicial de quais repositórios/serviços são afetados e por quê | Nunca — acelera o refinar-feature |
| 7 | **Perguntas pendentes** | O que precisa ser validado com PO, arquiteto ou outros times antes de refinar | Quando todas as questões foram resolvidas |

### Como conduzir

**Uma pergunta por vez** — respeite o tempo do usuário e permita respostas aprofundadas.
Perguntar tudo de uma vez produz respostas superficiais.

**Multiple choice quando possível** — formule opções quando a pergunta tiver respostas
previsíveis. Perguntas abertas ficam para questões genuinamente exploratórias.

**Questione premissas** — não aceite tudo como verdade. Se algo parece assumido mas não
explícito, pergunte. Premissas não questionadas viram bugs.

**Não se aprofunde em implementação** — a exploração é sobre o "quê" e o "por quê",
não sobre código. Detalhes de implementação (DTOs, endpoints específicos, classes) ficam
para o `refinar-feature`.

**Diagramas ASCII** — use quando ajudar a visualizar arquitetura ou comparar opções.
Texto é mais rápido de produzir e consome menos contexto que diagramas formais.

**Decomposição** — se detectar que a feature é grande demais para um único refinamento,
sugira decomposição antes de continuar. Melhor detectar isso agora.

### Formato para opções de arquitetura

```
## Opções de Arquitetura

### Opção A — [Nome descritivo] (Recomendada)
[1-2 parágrafos descrevendo a abordagem]
- ✅ [vantagem]
- ✅ [vantagem]
- ⚠️ [desvantagem/risco]

### Opção B — [Nome descritivo]
[1-2 parágrafos descrevendo a abordagem]
- ✅ [vantagem]
- ⚠️ [desvantagem/risco]

**Recomendação:** [justificativa para a opção recomendada]

Qual opção prefere? Quer adaptar alguma delas?
```

Aguarde a escolha do usuário. Se quiser adaptar, itere até chegar numa abordagem aceita.

## Passo 3: Consolidar em exploracao.md

Após percorrer as dimensões relevantes, gere o documento. Ele deve ser um **resumo fiel**
das decisões e descobertas da conversa — não adicione informações que não foram discutidas.

Salve em `docs/EPIC-<JIRA_KEY>/_intermediarios/exploracao.md`:

```markdown
# Exploração Técnica — [Nome da Feature]

**Feature Jira:** [JIRA_KEY]
**Data:** [data da exploração]
**Classificação:** Nova funcionalidade | Alteração de funcionalidade existente

## Resumo da Feature

[Resumo conciso validado com o usuário no Passo 1]

## Gaps de Requisitos Identificados

| # | Gap identificado | Resolução | Fonte |
|---|-----------------|-----------|-------|
| 1 | [descrição do gap] | [como foi resolvido] | Decisão do usuário / Inferido / Pendente |

> Se não foram identificados gaps: "Nenhum gap identificado durante a exploração."

## Abordagem Técnica Escolhida

### Opções discutidas

**Opção A — [Nome]:** [1 frase resumo] — [resultado: escolhida/descartada]
**Opção B — [Nome]:** [1 frase resumo] — [resultado: escolhida/descartada]

### Decisão

[Abordagem escolhida com justificativa em 1-2 parágrafos]

> Se a abordagem era óbvia sem alternativas: "Abordagem direta sem alternativas discutidas."

## Riscos Técnicos

| # | Risco | Severidade | Mitigação sugerida |
|---|-------|------------|-------------------|
| 1 | [risco] | Alta/Média/Baixa | [mitigação] |

> Se nenhum risco foi identificado: "Nenhum risco técnico significativo identificado."

## Visão Inicial de Impacto em Serviços

| Repositório | Tipo | Motivo provável do impacto |
|-------------|------|---------------------------|
| [repo] | srv/bff/fed/etc | [por que será impactado] |

## Perguntas Pendentes

| # | Pergunta | Para quem | Impacto se não respondida |
|---|----------|-----------|--------------------------|
| 1 | [pergunta] | PO / Arquiteto / Time X | [impacto] |

> Se todas as questões foram resolvidas: "Todas as questões foram resolvidas durante a exploração."

## Notas para o Refinamento

[Observações para quem executar o refinar-feature: decisões de arquitetura que impactam
o mapeamento de serviços, pontos de atenção na análise de código, etc.]
```

Após salvar, informe o caminho do arquivo e apresente os próximos passos conforme instruído
pelo orquestrador.
