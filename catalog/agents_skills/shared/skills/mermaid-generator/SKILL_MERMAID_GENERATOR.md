---
name: mermaid-generator
description: Gera diagramas Mermaid (fluxo, sequência, arquitetura, ER, estados) a partir de descrições textuais ou código. Use para documentar fluxos de negócio, sequências de integração, arquitetura hexagonal e diagramas ER de domínio.
metadata:
  version: "0.0.1"
---

# Mermaid Diagram Generator

Gere diagramas Mermaid validados sintaticamente. Use o tipo de diagrama correto para o contexto.

## Tipos Disponíveis e Quando Usar

| Tipo | Caso de Uso |
|------|------------|
| `flowchart` | Fluxo de negócio, decisões, processos |
| `sequenceDiagram` | Integração entre sistemas, chamadas HTTP/mensageria |
| `graph` | Arquitetura de componentes, dependências |
| `erDiagram` | Modelo de dados, entidades JPA |
| `stateDiagram-v2` | Ciclo de vida de entidade, máquina de estados |

## Flowchart — Fluxo de Negócio

```mermaid
flowchart TD
    A([Início: Solicitação de Crédito]) --> B{Cliente Cadastrado?}
    B -->|Não| C[Cadastrar Cliente]
    C --> D[Validar Documentos]
    B -->|Sim| D
    D --> E{Documentos OK?}
    E -->|Não| F([Fim: Rejeitar Solicitação])
    E -->|Sim| G[Análise de Crédito]
    G --> H{Score >= 600?}
    H -->|Não| F
    H -->|Sim| I[Aprovar Crédito]
    I --> J([Fim: Notificar Cliente])
```

**Regras sintáticas:**
- `TD` = top-down, `LR` = left-right
- `[Retângulo]`, `{Losango}`, `([Oval])`, `((Círculo))`
- Rótulos de seta: `-->|texto|`

## Sequence Diagram — Integração Entre Sistemas

```mermaid
sequenceDiagram
    actor Cliente
    participant API as API Gateway
    participant SVC as PedidoService
    participant DB as PostgreSQL
    participant BUS as Azure Service Bus

    Cliente->>API: POST /v1/pedidos
    API->>SVC: CriarPedidoCommand
    SVC->>DB: INSERT pedido
    DB-->>SVC: pedido salvo (id=123)
    SVC->>BUS: publicar PedidoCriadoEvent
    BUS-->>SVC: ack
    SVC-->>API: PedidoResponse {id: 123}
    API-->>Cliente: 201 Created
```

**Regras sintáticas:**
- `->>` síncrono, `-->>` resposta, `--)` assíncrono
- `actor` para usuário humano, `participant` para sistema
- `Note over A,B:` para anotações

## Graph — Arquitetura Hexagonal

```mermaid
graph LR
    subgraph Entrada
        HTTP[REST Controller]
        CONSUMER[Kafka Consumer]
    end

    subgraph Core
        UC[UseCase]
        PORT_IN[InputPort]
        PORT_OUT[OutputPort]
    end

    subgraph Saída
        REPO[JPA Repository]
        FEIGN[Feign Client]
        CACHE[Redis Cache]
    end

    HTTP --> PORT_IN
    CONSUMER --> PORT_IN
    PORT_IN --> UC
    UC --> PORT_OUT
    PORT_OUT --> REPO
    PORT_OUT --> FEIGN
    PORT_OUT --> CACHE
```

## ER Diagram — Modelo de Dados

```mermaid
erDiagram
    CLIENTE {
        uuid id PK
        string cpf
        string nome
        string email
        datetime criado_em
    }
    PEDIDO {
        uuid id PK
        uuid cliente_id FK
        decimal valor_total
        string status
        datetime criado_em
    }
    ITEM_PEDIDO {
        uuid id PK
        uuid pedido_id FK
        uuid produto_id FK
        int quantidade
        decimal preco_unitario
    }

    CLIENTE ||--o{ PEDIDO : "realiza"
    PEDIDO ||--|{ ITEM_PEDIDO : "contém"
```

## State Diagram — Ciclo de Vida

```mermaid
stateDiagram-v2
    [*] --> Rascunho: criar()
    Rascunho --> EmAnalise: submeter()
    EmAnalise --> Aprovado: aprovar()
    EmAnalise --> Rejeitado: rejeitar()
    Aprovado --> Cancelado: cancelar()
    Rejeitado --> [*]
    Cancelado --> [*]
    Aprovado --> [*]: concluir()
```

## Validação Sintática

Antes de entregar um diagrama, verifique:

1. **Sem espaços em IDs**: `meuNo` não `meu No` (causa parse error)
2. **Rótulos com caracteres especiais**: usar aspas `["texto com : dois pontos"]`
3. **Sequência**: `participant` declarado antes do uso
4. **ER**: tipo de dado em minúsculo (`string`, `int`, `decimal`, `uuid`, `datetime`)
5. **Subgraph**: sempre fechar com `end`

## Anti-patterns

```
# PROIBIDO: ID com espaço
flowchart TD
    meu node --> outro nó  ❌

# CORRETO:
flowchart TD
    meuNode --> outroNo  ✅
    
# PROIBIDO: diagrama sem direção
flowchart
    A --> B  ❌ (falta TD/LR)

# CORRETO:
flowchart LR
    A --> B  ✅
```
