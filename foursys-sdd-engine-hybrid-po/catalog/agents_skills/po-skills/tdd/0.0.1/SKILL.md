---
name: tdd
description: |
  Disciplina de Test-Driven Development (Red-Green-Refactor) para implementação de
  features e bugfixes. Use SEMPRE que for implementar código — não há exceção.
  Invoque ao ver "implementar", "escrever código", "desenvolver feature", "corrigir bug",
  "TDD", "test-driven", "escrever teste primeiro" — esta skill é obrigatória para todo
  código de produção gerado no pipeline.
metadata:
  version: "0.0.1"
---

# TDD — Test-Driven Development

## Por que esta skill existe

Código sem teste que falhou primeiro não prova nada. TDD garante que cada linha de
produção existe porque um teste exigiu.

**Lei de ferro:**

```
NENHUM CÓDIGO DE PRODUÇÃO SEM TESTE FALHANDO PRIMEIRO
```

**Violar a letra da regra é violar o espírito da regra.**

## Ciclo Red-Green-Refactor

### RED — Escrever teste que falha

Um teste mínimo mostrando o comportamento esperado.

**Requisitos:**
- Um comportamento por teste
- Nome descritivo (descreve o que deve acontecer)
- Código real (mocks apenas se inevitável)

### Verificar RED — Assistir falhar

**OBRIGATÓRIO. Nunca pule.**

```bash
# Java/Spring Boot
./mvn test -Dtest=NomeDaClasse#nomeDoMetodo

# Node.js
npm test -- --grep "nome do teste"

# Python
pytest tests/path/test.py::test_nome -v
```

Confirmar:
- Teste **falha** (não erro de compilação)
- Mensagem de falha é a esperada
- Falha porque feature não existe (não por typo)

### GREEN — Código mínimo

Escrever o código **mais simples** que faz o teste passar. Nada além.

### Verificar GREEN — Assistir passar

**OBRIGATÓRIO.**

```bash
# Mesmo comando de antes
```

Confirmar:
- Teste passa
- Outros testes continuam passando
- Zero warnings críticos

### REFACTOR — Limpar

Após green apenas:
- Remover duplicação
- Melhorar nomes
- Extrair helpers

Manter testes verdes. Não adicionar comportamento.

### Repetir

Próximo teste que falha para próxima feature.

## Racionalizações Comuns

| Desculpa | Realidade |
|----------|-----------|
| "Muito simples para testar" | Código simples quebra. Teste leva 30 segundos. |
| "Vou testar depois" | Teste que passa de primeira não prova nada. |
| "Já testei manualmente" | Ad-hoc ≠ sistemático. Sem registro, sem re-execução. |
| "Deletar X horas é desperdício" | Sunk cost fallacy. Manter código não verificado é dívida técnica. |
| "TDD vai me atrasar" | TDD é mais rápido que debugging. |

## Checklist de Verificação

Antes de marcar trabalho como completo:

- [ ] Toda função/método novo tem teste
- [ ] Assistiu cada teste falhar antes de implementar
- [ ] Cada teste falhou pelo motivo esperado
- [ ] Escreveu código mínimo para cada teste passar
- [ ] Todos os testes passam
- [ ] Output limpo (sem erros, sem warnings)
- [ ] Testes usam código real (mocks apenas se inevitável)
- [ ] Edge cases e erros cobertos

## Anti-Patterns de Teste

**Nunca:**
- Testar comportamento de mock (teste o código real)
- Adicionar métodos test-only em classes de produção (use test utilities)
- Mockar sem entender dependências (entenda side effects primeiro)
- Criar mocks parciais (espelhe a estrutura real completa)

## Red Flags — PARE e Recomece

- Código antes de teste
- Teste que passa de primeira
- Não sabe explicar por que teste falhou
- Racionalizando "só dessa vez"

**Todos significam: delete o código. Recomece com TDD.**

## Integração

**Usada por:**
- `desenvolvimento-subagentes` — subagents implementadores seguem TDD
- `executar-planos` — cada task segue TDD

**Regra final:**
```
Código de produção → teste existe e falhou primeiro
Caso contrário → não é TDD
```

Sem exceções sem permissão explícita do usuário.
