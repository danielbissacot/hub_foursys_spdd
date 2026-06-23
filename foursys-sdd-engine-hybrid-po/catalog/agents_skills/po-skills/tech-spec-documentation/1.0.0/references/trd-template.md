## Objetivo

Quando solicitado a criar um TRD (Technical Reference Document), siga esta estrutura. Sempre inclua diagramas Mermaid.

## Instrucoes

1. Baseie-se no PRD relacionado
2. Inclua diagramas Mermaid para cada secao visual
3. Seja especifico sobre tecnologias e implementacao
4. Documente trade-offs e decisoes tecnicas

## Estrutura do TRD

```markdown
# TRD: [Nome da Feature]

**Status:** Draft | In Review | Approved
**PRD:** PRD-XXX
**Autor:** [Nome]
**Data:** YYYY-MM-DD

---

## 1. Visao Geral

[Resumo da solucao tecnica em 3-5 linhas]

### Objetivo Principal
[O que esta implementacao resolve]

### Decisoes-chave
- [Decisao 1]
- [Decisao 2]

---

## 2. Arquitetura

### Diagrama de Componentes

\`\`\`mermaid
flowchart TB
    subgraph Clients
        WEB[React App]
        MOB[Mobile App]
    end
    subgraph Backend
        API[API Gateway]
        SVC[Service]
    end
    subgraph Data
        DB[(Database)]
        CACHE[(Cache)]
    end

    WEB --> API
    MOB --> API
    API --> SVC
    SVC --> DB
    SVC --> CACHE
\`\`\`

### Componentes

| Componente | Responsabilidade | Tecnologia |
|------------|-----------------|------------|
| [Nome] | [O que faz] | [Stack] |

---

## 3. Modelo de Dados

### Schema

\`\`\`sql
CREATE TABLE example (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### ERD

\`\`\`mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    
    USER {
        uuid id PK
        string email UK
        string name
    }
    ORDER {
        uuid id PK
        uuid user_id FK
        decimal total
    }
\`\`\`

---

## 4. APIs

| Metodo | Path | Descricao | Auth |
|--------|------|-----------|------|
| GET | /resource | Lista recursos | JWT |
| POST | /resource | Cria recurso | JWT |

### Exemplo de Request/Response

\`\`\`json
// POST /resource
{
  "name": "Example"
}

// Response 201
{
  "id": "uuid",
  "name": "Example",
  "createdAt": "2026-01-25T12:00:00Z"
}
\`\`\`

---

## 5. Fluxos Principais

### Fluxo: [Nome do Fluxo]

\`\`\`mermaid
sequenceDiagram
    participant U as Usuario
    participant A as API
    participant S as Service
    participant D as Database

    U->>A: Request
    A->>S: Process
    S->>D: Query
    D-->>S: Result
    S-->>A: Response
    A-->>U: Success
\`\`\`

---

## 6. Trade-offs

| Decisao | Alternativas | Escolha | Justificativa |
|---------|-------------|---------|---------------|
| [O que] | [Opcoes] | [Escolhida] | [Por que] |

---

## 7. Plano de Rollout

| Fase | Descricao | Feature Flag | Rollback |
|------|-----------|--------------|----------|
| Alpha | 1% usuarios | ff_feature_alpha | Desligar flag |
| Beta | 10% usuarios | ff_feature_beta | Reverter % |
| GA | 100% | Remover flag | Hotfix |

---

## 8. Observabilidade

### Metricas
- `feature_requests_total` - Total de requests
- `feature_latency_seconds` - Latencia p50/p95/p99

### Logs
- `INFO`: Operacoes normais
- `WARN`: Situacoes inesperadas
- `ERROR`: Falhas que precisam atencao

### Alertas
| Alerta | Condicao | Severidade |
|--------|----------|------------|
| HighLatency | p95 > 500ms | Warning |
| ErrorRate | > 1% | Critical |
```

## Exemplo de Uso

```
> Baseado no PRD de notificacoes, crie o TRD
> Stack: NestJS, PostgreSQL, Redis, React
```