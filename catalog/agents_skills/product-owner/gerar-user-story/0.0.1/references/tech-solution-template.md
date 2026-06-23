# Tech Solution — <JIRA_KEY>

**Feature:** [nome da feature]
**Épico Jira:** [JIRA_KEY]
**Documento de referência:** [caminho do ADR/RFC]

## Objetivo

Preparar a infraestrutura técnica compartilhada que habilita a implementação
paralela das User Stories funcionais.

## Artefatos Compartilhados

### Models / DTOs

| Artefato | Serviço(s) | Usado por USs | Path esperado |
|----------|-----------|---------------|---------------|
| `PropostaDTO` | `dupe-srv-opt` | consulta-saldo, envio-proposta | `src/main/.../dto/PropostaDTO.java` |

#### PropostaDTO

```java
public record PropostaDTO(
    String id,
    BigDecimal valor,
    LocalDate dataCriacao,
    StatusProposta status
) {}
```

### Interfaces / Contratos

| Interface | Serviço(s) | Usado por USs | Path esperado |
|-----------|-----------|---------------|---------------|
| ... | ... | ... | ... |

### Infraestrutura

| Recurso | Tipo | Serviço(s) | Usado por USs |
|---------|------|-----------|---------------|
| `proposta-events` | Kafka topic | `dupe-srv-opt` | envio-proposta, notificacao |

## Dependências

Todas as User Stories funcionais que referenciam artefatos listados acima
dependem deste Tech Solution estar concluído antes de iniciar.

## Impacto no DAG de Execução

```
         ┌──────────────┐
         │ Tech Solution │
         └──────┬───────┘
        ┌───────┼───────┐
        ▼       ▼       ▼
     [US-1]  [US-2]  [US-3]  ← 100% paralelas
```
