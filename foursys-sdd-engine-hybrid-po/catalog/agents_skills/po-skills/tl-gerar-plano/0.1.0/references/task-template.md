---
task-id: task-01
service: <nome-do-repositorio>
service-type: <srv|bff|fed|fun|lib>
order: 1
depends-on:
  - <task-id-anterior> # omitir se não houver
spec-links:
  - ../bdd-scenarios.md#scn-01--titulo-curto
---

# Task 01 — [Título curto]

**Serviço:** `<nome-do-repositorio>` (`<tipo>`)

**Objetivo:** [resultado concreto e verificável desta task — o que o executor deve entregar]

## Contexto de referência

- Intents: `../intents.md`
- Cenários BDD cobertos: `../bdd-scenarios.md#scn-01--titulo-curto`

## Serviço e arquivos impactados

| Ação | Caminho | Descrição |
|------|---------|-----------|
| Criar | `src/caminho/do/Arquivo.java` | [classe/função principal a criar] |
| Modificar | `src/caminho/do/Existente.java` | [mudança necessária] |
| Teste | `src/test/caminho/do/ArquivoTest.java` | [teste a criar/adaptar] |

## Pré-requisitos

- [ ] [task anterior ou artefato externo que deve estar pronto antes desta task]
- [ ] [ex.: contrato OpenAPI publicado, tabela criada, serviço dependente disponível]

## Comportamento esperado (SHALL)

> Extraído de `../bdd-scenarios.md` — repetido aqui para contexto do executor.

**SHALL:** [enunciado do requisito funcional que esta task implementa]

| Cenário | GIVEN | WHEN | THEN |
|---------|-------|------|------|
| [nome do cenário happy path] | [estado inicial] | [ação disparada] | [resultado esperado] |
| [cenário de erro/edge case] | [estado inicial] | [ação disparada] | [resultado esperado] |

## Instruções de implementação (TDD)

### RED — Escrever teste que falha

Escrever um teste para o comportamento descrito no SHALL acima.
O teste deve falhar porque a implementação ainda não existe.

- Classe de teste: `<NomeDaClasseTest>`
- Método sugerido: `deve<ComportamentoEsperado>Quando<Condicao>`
- Verificar: teste **falha** pelo motivo esperado (não erro de compilação)

> Use exemplo de estrutura de teste apenas se o padrão do serviço não for óbvio:
> `// arrange → act → assert` com código mínimo ilustrativo.

### GREEN — Implementação mínima

Implementar o código mais simples que faz o teste passar.
Seguir os padrões do serviço `<service-type>` (extraídos da skill de padrões correspondente).

Pontos de atenção para esta task:
- [regra de negócio específica que deve ser respeitada]
- [integração ou dependência que deve ser usada]
- [validação ou tratamento de erro obrigatório]

### REFACTOR

Após verde:
- [ajuste de nomenclatura ou extração de helper esperado, se aplicável]
- Manter testes verdes; não adicionar comportamento.

### Commit

```
feat(<JIRA_KEY>): <descrição objetiva do que foi implementado>
```

Incluir no commit: arquivo(s) de produção + arquivo(s) de teste.
