---
name: flow-extractor
description: Extrai e documenta fluxos de execução a partir do código fonte, gerando diagramas de sequência Mermaid e documentação padronizada de fluxos para consumo em pipelines do Tech Lead Toolkit.
metadata:
  version: "0.0.1"
---

## Objetivo

Extrair e documentar fluxos de execução a partir do código fonte, gerando diagramas de sequência Mermaid validados e documentação estruturada de fluxos.

## Quando Usar

- Para documentar fluxos de negócio existentes
- Para gerar diagramas de sequência automatizados
- Para entender integrações entre componentes
- Para debugging e troubleshooting de fluxos complexos
- Como etapa em pipelines de análise de repositório

## Processo

### 1. Identificar Fluxo Principal

A partir do entry point:
- Controller/Handler → qual endpoint ou trigger?
- Quais services são chamados?
- Quais repositories/DAOs são acessados?
- Quais integrações externas participam?

### 2. Rastrear Chamadas

Para cada método no fluxo:
1. Identificar parâmetros de entrada
2. Mapear chamadas internas (service → service)
3. Identificar chamadas externas (APIs, DB, message brokers)
4. Mapear tratamento de erros e fallbacks
5. Identificar retorno e transformações de dados

### 3. Identificar Pontos de Decisão

Mapear:
- Condicionais (if/switch) que alteram o fluxo
- Guards e Middlewares
- Validators e pipes de validação
- Error handlers e recovery paths
- Circuit breakers e retry logic

### 4. Documentar Integrações

Para cada integração externa no fluxo:
- Protocolo (HTTP, gRPC, Kafka, WebSocket)
- Autenticação utilizada
- Política de retry
- Timeout configurado
- Circuit breaker (se presente)
- Formato de payload

## Regras de Geração de Diagramas Mermaid

### Regras Obrigatórias

1. **Nomes devem corresponder ao código real** — use nomes de classes, módulos, tabelas e métodos reais do repositório. Nunca invente nomes genéricos.

2. **Limite de componentes** — máximo 10-15 participantes por diagrama. Se o fluxo envolve mais componentes, divida em múltiplos diagramas (visão geral + detalhes).

3. **Validação de sintaxe** — todo diagrama DEVE ser sintaticamente válido para o Mermaid. Evite caracteres especiais em labels. Use aspas para labels com espaços.

4. **Tema padrão** — utilize o tema base com as seguintes variáveis:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {
  'primaryColor': '#0066cc',
  'primaryTextColor': '#ffffff',
  'lineColor': '#2c3e50'
}}}%%
```

5. **Tipos de diagrama suportados**:
   - `sequenceDiagram` — fluxos de request/response (preferencial)
   - `flowchart TB` — arquitetura de componentes
   - `stateDiagram-v2` — ciclo de vida de entidades
   - `erDiagram` — modelo de dados

6. **Incluir legenda** quando usar cores ou formas diferentes para representar tipos distintos de componentes.

### Boas Práticas para Diagramas de Sequência

- Use `participant` com alias curto: `participant OS as OrderService`
- Diferencie chamadas síncronas (`->>`) de respostas (`-->>`)
- Use `activate`/`deactivate` para mostrar tempo de processamento
- Use `alt`/`else` para branches condicionais
- Use `loop` para iterações
- Use `Note` para anotações importantes

## Formato de Saída

```markdown
## Fluxos de Execução: [Nome do Projeto/Feature]

### Fluxo: [Nome do Fluxo]

#### Trigger
[Método HTTP + Path] ou [Evento/Mensagem]

#### Participantes

| # | Componente | Responsabilidade |
|---|-----------|-----------------|
| 1 | API Gateway | Recebe request, valida JWT |
| 2 | OrderService | Lógica de negócio de pedidos |
| 3 | Database | Persistência |
| 4 | KafkaProducer | Publicação de eventos |

#### Diagrama de Sequência

\`\`\`mermaid
sequenceDiagram
    participant C as Client
    participant A as APIGateway
    participant S as OrderService
    participant D as Database
    participant K as KafkaProducer

    C->>A: POST /api/v1/orders
    activate A
    A->>A: Validate JWT
    A->>S: createOrder(data)
    activate S
    S->>D: INSERT order
    D-->>S: OK
    S->>K: publish("order.created")
    K-->>S: ACK
    S-->>A: Order created
    deactivate S
    A-->>C: 201 Created
    deactivate A
\`\`\`

#### Descrição dos Passos

1. Cliente envia POST com payload do pedido
2. Gateway valida token JWT
3. Service valida dados de entrada
4. Service persiste pedido no banco
5. Service publica evento de criação
6. Retorna 201 com pedido criado

#### Tratamento de Erros

| Código | Causa | Ação |
|--------|-------|------|
| 401 | Token inválido | Re-autenticar |
| 400 | Payload inválido | Corrigir dados de entrada |
| 409 | Pedido duplicado | Verificar idempotência |
| 500 | Falha no banco | Retry automático / Suporte |

#### Observabilidade

- **Log**: `order.created` com order_id e correlation_id
- **Métrica**: `order_creation_total`, `order_creation_duration_ms`
- **Trace**: Span completo do fluxo com propagação de contexto
```

## Exemplo de Uso

```
> Extraia o fluxo de criação de pedido começando pelo endpoint POST /orders
> Inclua todas as integrações e tratamento de erros
> Gere diagramas Mermaid para cada fluxo principal
```
