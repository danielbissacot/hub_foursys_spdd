---
name: playwright-bdd-feature-generation
description: Skill para gerar arquivos de features Gherkin para projetos Playwright-BDD. Use quando precisar criar arquivos .feature com cenários BDD, converter planos de implementação em sintaxe Gherkin, estruturar features com Background, Scenario Outline, tabelas de dados e exemplos, ou organizar cenários com tags para execução seletiva.
---

# Playwright BDD - Geração de Features

Orientação para criar arquivos `.feature` Gherkin bem estruturados para testes Playwright-BDD.

## Estrutura de Arquivos

```
test/
├── features/
│   ├── auth/
│   │   └── login.feature
│   └── checkout/
│       └── cart.feature
├── steps/
│   ├── auth.steps.ts
│   └── checkout.steps.ts
└── support/
    ├── world.ts
    └── fixtures.ts
```

## Anatomia de um Arquivo Feature

```gherkin
@smoke @auth
Feature: Autenticação de Usuário
  Como um usuário registrado
  Quero fazer login na aplicação
  Para acessar minha conta

  Background:
    Given que a aplicação está disponível
    And o banco de dados está limpo

  Scenario: Login com credenciais válidas
    Given que estou na página de login
    When insiro "usuario@email.com" como e-mail
    And insiro "senha123" como senha
    And clico no botão "Entrar"
    Then devo ser redirecionado para o dashboard
    And devo ver a mensagem "Bem-vindo!"

  Scenario Outline: Login com credenciais inválidas
    Given que estou na página de login
    When insiro "<email>" como e-mail
    And insiro "<senha>" como senha
    And clico no botão "Entrar"
    Then devo ver a mensagem de erro "<mensagem>"

    Examples:
      | email             | senha   | mensagem                  |
      | invalido@email.com| senha   | Credenciais inválidas      |
      | usuario@email.com | errada  | Credenciais inválidas      |
      |                   | senha   | E-mail é obrigatório       |
```

## Princípios BDD para Features

### Linguagem Orientada ao Negócio
- Escreva passos no ponto de vista do usuário, não da implementação
- Use vocabulário do domínio de negócio
- Evite termos técnicos (seletores, IDs, classes CSS)

**❌ Evite:**
```gherkin
When clico no elemento com id "btn-submit"
Then o elemento ".error-message" deve ter texto "Erro"
```

**✅ Use:**
```gherkin
When clico no botão "Enviar"
Then devo ver a mensagem de erro "Campo obrigatório"
```

### Tags para Organização

| Tag | Uso |
|-----|-----|
| `@smoke` | Testes de fumaça – suite rápida de sanidade |
| `@regression` | Suite completa de regressão |
| `@wip` | Work in progress – excluir de CI |
| `@skip` | Ignorar temporariamente com justificativa |
| `@api` | Testes que dependem de chamadas API |
| `@mobile` | Cenários específicos para mobile |

### Regras de Escrita

1. **Um conceito por cenário** – cada cenário testa um único comportamento observável
2. **Independência total** – cenários não dependem da execução de outros
3. **Background para contexto comum** – use para pré-condições compartilhadas, não para lógica de negócio
4. **Scenario Outline para variações de dados** – evite duplicação com tabelas de exemplos
5. **Nomes descritivos** – o título do cenário deve ser autoexplicativo

## Referências

- **Padrões de passos reutilizáveis**: veja [references/step-patterns.md](references/step-patterns.md)
- **Organização por domínio**: veja [references/feature-organization.md](references/feature-organization.md)
