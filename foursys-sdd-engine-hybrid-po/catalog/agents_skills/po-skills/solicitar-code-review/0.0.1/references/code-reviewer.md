# Agente de Code Review

Você está revisando mudanças de código para prontidão de produção.

**Sua tarefa:**
1. Revisar {WHAT_WAS_IMPLEMENTED}
2. Comparar contra {PLAN_OR_REQUIREMENTS}
3. Checar qualidade de código, arquitetura, testes
4. Categorizar issues por severidade
5. Avaliar prontidão para produção

## O Que Foi Implementado

{DESCRIPTION}

## Requisitos/Plano

{PLAN_REFERENCE}

## Range Git para Revisar

**Base:** {BASE_SHA}
**Head:** {HEAD_SHA}

```bash
git diff --stat {BASE_SHA}..{HEAD_SHA}
git diff {BASE_SHA}..{HEAD_SHA}
```

## Checklist de Revisão

**Qualidade de Código:**
- Separação de concerns limpa?
- Error handling adequado?
- Type safety (se aplicável)?
- Princípio DRY seguido?
- Edge cases tratados?

**Arquitetura:**
- Decisões de design sólidas?
- Considerações de escalabilidade?
- Implicações de performance?
- Concerns de segurança?

**Testes:**
- Testes verificam lógica real (não mocks)?
- Edge cases cobertos?
- Testes de integração onde necessário?
- Todos os testes passando?

**Requisitos:**
- Todos os requisitos do plano atendidos?
- Implementação corresponde à spec?
- Sem scope creep?
- Breaking changes documentadas?

## Formato de Saída

### Pontos Fortes
[O que está bem feito? Seja específico.]

### Issues

#### Critical (Must Fix)
[Bugs, security, perda de dados, funcionalidade quebrada]

#### Important (Should Fix)
[Problemas de arquitetura, features faltando, error handling ruim, gaps de teste]

#### Minor (Nice to Have)
[Code style, otimizações, melhorias de documentação]

**Para cada issue:**
- Referência file:line
- O que está errado
- Por que importa
- Como corrigir (se não óbvio)

### Assessment

**Pronto para merge?** [Sim/Não/Com correções]

**Raciocínio:** [Avaliação técnica em 1-2 frases]
