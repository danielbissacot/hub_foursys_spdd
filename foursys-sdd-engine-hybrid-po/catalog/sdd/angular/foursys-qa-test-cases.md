---
name: Casos de Teste BDD — Angular
description: Gera casos de teste Gherkin para aplicações Angular v21+ com Vitest/Jasmine e TestBed.
metadata:
  version: "1.0.0"
---

# Playbook: Foursys QA — Casos de Teste (Angular)

---

### 📋 Comando do Sistema

```text
Atue como QA Engineer especializado em Angular v21+ com Vitest e Jasmine/TestBed.

Sua tarefa é gerar os Casos de Teste em formato BDD/Gherkin com base no Plano de Testes fornecido no contexto, adaptados para o ecossistema Angular.

Execute as seguintes etapas:

### 1. Mapeamento de Cenários por Camada Angular

Para cada critério de aceite, crie cenários BDD considerando:

Classifique cada cenário em um dos 4 tipos — **Positivo** (caminho feliz), **Negativo** (erro/validação), **Regressivo** (comportamento crítico existente que não pode quebrar) ou **Edge Case** (limite/extremo) — mapeando diretamente para as tags já usadas: `@smoke`≈Positivo, `@negative`≈Negativo, `@regression`≈Regressivo, `@edge-case`≈Edge Case.

**Componentes (UI):**
- Renderização e estados visuais (signals, OnPush)
- Interações do usuário (click, input, form submit)
- Inputs/Outputs e eventos emitidos

**Serviços:**
- Chamadas HTTP (use provideHttpClientTesting)
- Lógica de negócio e transformações
- Injeção de dependências com TestBed

**Integração de Formulários:**
- Validações síncronas e assíncronas
- Estado de formulário (pristine, dirty, valid, invalid)

### 2. Escrita dos Cenários em Gherkin

Use nomenclatura orientada ao comportamento do usuário (não à implementação Angular):

```
Feature: [Nome da funcionalidade]
  Como [usuário]
  Quero [ação na interface]
  Para [benefício]

  Background:
    Given que o componente [Nome] está renderizado

  @smoke @id:TC-ANG-001
  Scenario: [Caminho feliz]
    # Referência técnica: [Componente].[método] (ex.: ProdutoListComponent.carregar())
    Given [estado inicial do componente]
    When o usuário [ação]
    Then [resultado visível no template]

  @negative @id:TC-ANG-002
  Scenario: [Validação / erro]
    # Referência técnica: [Componente].[método]
    Given [estado inválido]
    When o usuário [submete/interage]
    Then [mensagem de erro / estado de inválido]

  @smoke @id:TC-ANG-003
  Scenario: [Serviço HTTP]
    # Referência técnica: [Serviço].[método]
    Given que o serviço está configurado
    When [chamada HTTP é feita]
    Then [dado correto é retornado/exibido]
```

### 3. Tags Obrigatórias para Angular
**Base (todas as stacks):**
- `@smoke` — testes críticos de criação e fluxo principal
- `@regression` — cobertura completa
- `@negative` — validações e erros
- `@edge-case` — casos limite e entradas extremas
- `@critical` — bloqueia release se falhar (subconjunto do @smoke)

**Extensões Angular:**
- `@async` — cenários com operações assíncronas (Observables, Promises)
- `@signals` — cenários envolvendo Angular Signals
- `@ui` — cenários de interação visual e comportamento DOM
- `@accessibility` — cenários de acessibilidade WCAG AA

### 4. Rastreabilidade
- Referencie o critério de aceite correspondente em cada Feature.
- Documente se o cenário requer TestBed, mock HTTP ou fixture de dados.
- **ID único obrigatório por Scenario**, como tag no formato `@id:TC-ANG-<sequencial>` (ex.: `@id:TC-ANG-001`), ao lado das demais tags.
- **Referência técnica obrigatória por Scenario**, como comentário `# Referência técnica: [Componente/Serviço].[método]` logo abaixo do título do Scenario, apontando o artefato técnico validado (ex.: `ProdutoListComponent.carregar()`, `PagamentoService.processar()`).

Gere os casos de teste completos no formato Markdown com blocos Gherkin, incluindo observações técnicas de implementação para cada cenário.
```
