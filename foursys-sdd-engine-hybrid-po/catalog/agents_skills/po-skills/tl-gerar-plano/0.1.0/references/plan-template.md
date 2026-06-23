# Plan Template — guia da nova estrutura por serviço

## Estrutura esperada

Cada US gera uma pasta `specs/<us-slug>/` dentro de **cada repositório de serviço impactado**:

```text
../dupe-srv-opt/specs/consultar-limite-disponivel/
├── intents.md
├── bdd-scenarios.md
└── tasks/
    ├── task-01-dupe-srv-opt-setup.md
    └── task-02-dupe-srv-opt-publicar-contrato-limite.md

../dupe-bff-itr-opt/specs/consultar-limite-disponivel/
├── intents.md
├── bdd-scenarios.md
└── tasks/
    └── task-03-dupe-bff-itr-opt-consumir-endpoint-limite.md

../dupe-fed-opt/specs/consultar-limite-disponivel/
├── intents.md
├── bdd-scenarios.md
└── tasks/
    └── task-04-dupe-fed-opt-exibir-limite-disponivel.md
```

Cada service repo recebe o **plano completo** (intents + bdd-scenarios) mais apenas as tasks daquele serviço.

## Papel de cada arquivo

| Arquivo | Objetivo | Template de referência |
|---|---|---|
| `intents.md` | Definir contexto, escopo, pré-requisitos e serviços impactados da US. | [`intents-template.md`](./intents-template.md) |
| `bdd-scenarios.md` | Converter critérios de aceite em requisitos SHALL com cenários GIVEN/WHEN/THEN. | [`bdd-scenarios-template.md`](./bdd-scenarios-template.md) |
| `tasks/task-NN-<service>-<descricao>.md` | Guiar a implementação task a task, com disciplina TDD e passos executáveis. | [`task-template.md`](./task-template.md) |

## Fluxo recomendado de geração

1. Para cada serviço impactado, criar a pasta `../<service-repo>/specs/<us-slug>/`.
2. Em cada service repo, gerar `intents.md` para alinhar objetivo, escopo e dependências.
3. Em cada service repo, gerar `bdd-scenarios.md` a partir dos critérios de aceite da US.
4. Em cada service repo, criar uma task por unidade de trabalho executável em `tasks/`, contendo apenas as tasks daquele serviço.
5. Garantir que toda task referencie o contexto (`intents.md`) e os cenários BDD relevantes.

## Regras de qualidade

- Escrever em pt-BR.
- Ser específico o suficiente para um agente executar sem contexto adicional.
- Manter TDD explícito nas tasks: descrever comportamento esperado, passos Red-Green-Refactor e commit — sem escrever o código de produção no plano.
- Usar exemplos realistas de serviços, como `dupe-srv-opt`, `dupe-bff-itr-opt` e `dupe-fed-opt`.
- Separar claramente dependências paralelas e sequenciais entre serviços.

## Referência de formato BDD (inspirado em OpenSpec)

Use requisitos em estilo SHALL e cenários GIVEN/WHEN/THEN:

```markdown
## Cenário: Consultar limite com cliente elegível

**SHALL:** O sistema deverá retornar o limite disponível quando o cliente estiver elegível para consulta.

### Happy Path

- **GIVEN** um cliente autenticado com contrato ativo
- **WHEN** o BFF solicitar o limite disponível
- **THEN** o serviço deverá responder com saldo e status `AVAILABLE`
```

## Ordem de leitura para subagentes

1. `intents.md`
2. `bdd-scenarios.md`
3. `tasks/task-NN-...md`

> O `intents.md` é o north star da pasta. Nenhuma task deve contradizer seu escopo.
