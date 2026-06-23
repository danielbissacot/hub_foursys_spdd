---
name: usecase-analyzer
description: Analisa serviços impactados por uma feature e mapeia os casos de uso atuais, documentando fluxos end-to-end entre múltiplos microsserviços. Gera documentação de como funcionalidades existentes são implementadas, incluindo contratos de API, eventos, filas e integrações entre serviços. Use quando precisar entender o funcionamento atual de uma funcionalidade antes de propor alterações, durante refinamento técnico de features que alteram funcionalidades existentes, ou para mapear fluxos de negócio distribuídos entre microsserviços.
metadata:
  version: "0.0.2"
---

## Objetivo

Analisar o código fonte de múltiplos serviços impactados por uma feature para mapear e documentar os casos de uso atuais, gerando uma visão end-to-end de como a funcionalidade existente é implementada.

## Processo

### 1. Receber Contexto da Feature

Receber como entrada:
- Descrição da feature ou funcionalidade a ser analisada
- Lista de repositórios/serviços impactados (com seus tipos: bff, srv, fed, etc.)
- Regras de negócio ou requisitos relevantes

### 2. Analisar Cada Serviço

Para cada serviço impactado:

1. **Identificar entry points relevantes** — controllers, handlers, consumers que se relacionam com a funcionalidade.
2. **Rastrear fluxo de execução** — seguir o código desde o entry point até a persistência/resposta:
   - Controller → Service → Repository/Client
   - Consumer → Handler → Service → Producer
3. **Mapear contratos**:
   - DTOs de entrada e saída (request/response)
   - Schemas de eventos publicados/consumidos
   - Modelos de dados (entidades, collections, tabelas)
4. **Identificar regras de negócio** implementadas no código (validações, transformações, condições).
5. **Mapear tratamento de erros** e cenários alternativos.

### 3. Mapear Integrações Entre Serviços

Após analisar cada serviço individualmente:

1. Conectar os fluxos entre serviços — qual endpoint do serviço A chama qual endpoint do serviço B.
2. Mapear comunicação assíncrona — quais eventos/mensagens conectam os serviços.
3. Identificar dependências de dados — quais dados um serviço precisa de outro.
4. Documentar a sequência temporal — ordem de execução do fluxo end-to-end.

### 4. Gerar Documentação

Produzir documentação seguindo o formato de saída abaixo. Toda informação deve ser extraída do código — **NUNCA inventar dados**.

Para os diagramas de sequência no formato de saída, use a skill `mermaid-generator` para garantir sintaxe válida e formatação consistente.

## Formato de Saída

```markdown
## Análise de Caso de Uso: [Nome da Funcionalidade]

### Resumo

[Descrição do que a funcionalidade faz do ponto de vista do usuário]

### Serviços Envolvidos

| Serviço | Tipo | Responsabilidade no Fluxo |
|---------|------|---------------------------|
| [repo]  | bff  | Recebe requisição, orquestra chamadas |
| [repo]  | srv  | Processa regras de negócio |
| [repo]  | srv  | Persiste dados e publica eventos |

### Fluxo End-to-End

#### Diagrama de Sequência

\`\`\`mermaid
sequenceDiagram
    participant U as Usuário
    participant BFF as bff-service
    participant SRV1 as srv-service-1
    participant SRV2 as srv-service-2
    participant DB as Database
    participant K as Kafka

    U->>BFF: POST /api/v1/resource
    activate BFF
    BFF->>SRV1: POST /internal/resource
    activate SRV1
    SRV1->>DB: INSERT resource
    SRV1->>K: publish("resource.created")
    SRV1-->>BFF: 201 Created
    deactivate SRV1
    BFF-->>U: 201 Created
    deactivate BFF
    K->>SRV2: consume("resource.created")
    activate SRV2
    SRV2->>DB: UPDATE related_data
    deactivate SRV2
\`\`\`

#### Descrição dos Passos

1. [Passo com detalhes de implementação]
2. [Passo com detalhes de implementação]

### Contratos

#### APIs REST

| Serviço | Método | Path | Request Body | Response |
|---------|--------|------|-------------|----------|
| [repo]  | POST   | /api/v1/resource | `ResourceDTO` | `ResourceResponse` |

#### Eventos/Mensagens

| Tópico/Fila | Produtor | Consumidor | Payload Schema |
|-------------|----------|------------|----------------|
| resource.created | srv-1 | srv-2 | `ResourceCreatedEvent` |

### Modelo de Dados

Para cada serviço, documentar entidades relevantes:

| Serviço | Entidade/Collection | Campos Principais | Índices |
|---------|--------------------|--------------------|---------|
| [repo]  | resources          | id, name, status   | id, status |

### Regras de Negócio Identificadas

| # | Regra | Implementação | Serviço |
|---|-------|---------------|---------|
| 1 | [Descrição da regra] | [Classe/método onde está implementada] | [repo] |

### Cenários Alternativos e Erros

| Cenário | Trigger | Comportamento | Serviço |
|---------|---------|---------------|---------|
| Recurso duplicado | ID já existe | Retorna 409 Conflict | srv-1 |
| Serviço indisponível | Timeout na chamada | Retry 3x + fallback | bff |

### Observações

- [Pontos de atenção encontrados no código]
- [Débitos técnicos identificados]
- [Acoplamentos ou dependências implícitas]
```

## Regras

1. Extrair informações exclusivamente do código fonte — não inventar dados.
2. Usar nomes reais de classes, métodos, endpoints e entidades do código.
3. Se não for possível determinar algum detalhe pelo código, indicar com `[TODO: verificar]`.
4. Priorizar fluxos diretamente relacionados à feature em análise.
5. Quando um serviço externo não está no workspace, documentar apenas o contrato visível (URL, payload) e indicar que a implementação interna não foi analisada.
