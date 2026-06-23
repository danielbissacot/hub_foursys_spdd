---
name: mermaid-generator
description: |
  Gera diagramas Mermaid (flowcharts, sequência, ERD, state, C4) a partir de análise de
  código e documentação técnica. Use sempre que precisar de diagramas de arquitetura,
  fluxos de request/response, modelos de dados, ciclos de vida de entidades ou visões C4.
  Invoque ao ver pedidos como "gere um diagrama", "visualize o fluxo", "mostre a
  arquitetura", "crie um ERD", "diagrama de sequência" — ou quando o contexto se beneficiar
  de representação visual de estrutura ou processo, mesmo que o usuário não use esses
  termos exatos.
metadata:
  version: "0.1.0"
---

## Objetivo

Gerar diagramas Mermaid precisos a partir de análise de código ou documentação técnica,
com sintaxe validada e nomes que reflitam a realidade do projeto.

## Tipos de Diagramas

### 1. Flowchart - Arquitetura de Componentes

```mermaid
flowchart TB
    subgraph Clients
        WEB[React App]
        MOB[Mobile App]
    end
    subgraph Backend
        API[API Gateway]
        AUTH[Auth Service]
        BIZ[Business Service]
    end
    subgraph Data
        DB[(PostgreSQL)]
        CACHE[(Redis)]
    end
    
    WEB --> API
    MOB --> API
    API --> AUTH
    API --> BIZ
    AUTH --> DB
    BIZ --> DB
    BIZ --> CACHE
```

**Quando usar:** Visao geral da arquitetura, componentes e suas conexoes.

### 2. Sequence Diagram - Fluxos de Request

```mermaid
sequenceDiagram
    participant U as Usuario
    participant A as API
    participant S as Service
    participant D as Database
    
    U->>A: POST /resource
    A->>A: Validate
    A->>S: process()
    S->>D: INSERT
    D-->>S: OK
    S-->>A: Result
    A-->>U: 201 Created
```

**Quando usar:** Fluxos de request/response, integrações, debugging.

### 3. ERD - Modelo de Dados

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER_ITEM }|--|| PRODUCT : references
    
    USER {
        uuid id PK
        string email UK
        string name
        timestamp created_at
    }
    ORDER {
        uuid id PK
        uuid user_id FK
        decimal total
        string status
    }
    PRODUCT {
        uuid id PK
        string name
        decimal price
    }
```

**Quando usar:** Documentar schema do banco, relacoes entre entidades.

### 4. State Diagram - Ciclo de Vida

```mermaid
stateDiagram-v2
    [*] --> Created
    Created --> Pending: submit
    Pending --> Approved: approve
    Pending --> Rejected: reject
    Approved --> Completed: complete
    Rejected --> [*]
    Completed --> [*]
```

**Quando usar:** Estados de uma entidade, maquinas de estado.

### 5. C4 Context - Visao de Sistema

```mermaid
C4Context
    title Sistema - Diagrama de Contexto
    
    Person(user, "Usuario", "Usa o sistema")
    System(system, "Sistema Principal", "Core do negocio")
    System_Ext(ext, "Sistema Externo", "Integracao")
    
    Rel(user, system, "Usa", "HTTPS")
    Rel(system, ext, "Integra", "API")
```

**Quando usar:** Documentacao C4 Model, visao de alto nivel.

## Regras de Geracao

Use nomes reais (classes, módulos, tabelas do código) — nomes genéricos tornam o diagrama
inútil para quem precisa navegar na codebase. Mantenha diagramas focados (máx 10-15
componentes) para que o leitor absorva a informação sem ter que decifrar um mapa mental.

1. **Nomes devem corresponder ao codigo real**
   - Use nomes de classes, modulos, tabelas reais
   - Nao invente nomes genericos

2. **Mantenha simplicidade**
   - Max 10-15 componentes por diagrama
   - Divida em multiplos diagramas se necessario

3. **Valide sintaxe**
   - Verifique a sintaxe antes de entregar — um diagrama com erro de sintaxe não renderiza
     e não tem valor para o leitor
   - Evite caracteres especiais em labels

4. **Inclua legenda quando necessario**
   - Cores, formas, linhas devem ser explicadas

## Estilo Padrao

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {
  'primaryColor': '#0066cc',
  'primaryTextColor': '#ffffff',
  'lineColor': '#2c3e50'
}}}%%
```

## Exemplo de Uso

```
> Gere um diagrama de arquitetura para este projeto
> Tipo: flowchart
> Inclua: frontend, backend, banco de dados, servicos externos
```

```
> Gere um diagrama de sequencia para o fluxo de checkout
> Participantes: usuario, frontend, API, payment service, Stripe
```

```
> Gere um ERD baseado nos schemas Prisma do projeto
```