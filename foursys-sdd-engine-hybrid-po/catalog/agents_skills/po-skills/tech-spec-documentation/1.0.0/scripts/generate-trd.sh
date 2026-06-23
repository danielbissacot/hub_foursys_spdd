#!/bin/bash
# generate-trd.sh - Gera estrutura inicial de TRD
# Uso: ./generate-trd.sh "Nome da Feature" [output_dir]

set -e

FEATURE_NAME="${1:-Nova Feature}"
OUTPUT_DIR="${2:-docs/trd}"
DATE=$(date +%Y-%m-%d)

# Criar diretório se não existir
mkdir -p "$OUTPUT_DIR"

# Gerar número do TRD
LAST_TRD=$(ls -1 "$OUTPUT_DIR"/TRD-*.md 2>/dev/null | tail -1 | sed 's/.*TRD-\([0-9]*\).*/\1/' || echo "000")
NEXT_TRD=$(printf "%03d" $((10#$LAST_TRD + 1)))

# Nome do arquivo
SLUG=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
FILENAME="TRD-${NEXT_TRD}-${SLUG}.md"
FILEPATH="${OUTPUT_DIR}/${FILENAME}"

# Gerar arquivo
cat > "$FILEPATH" << EOF
# TRD: ${FEATURE_NAME}

**Status:** Draft
**PRD:** PRD-XXX
**Autor:** $(git config user.name || echo "TBD")
**Data:** ${DATE}

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
EOF

echo "✅ TRD criado: $FILEPATH"
echo ""
echo "Próximos passos:"
echo "  1. Vincule ao PRD relacionado"
echo "  2. Preencha as seções do TRD"
echo "  3. Solicite review"