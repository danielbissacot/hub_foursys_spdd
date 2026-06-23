---
name: analyze-project
description: Analisa a estrutura de um projeto de software, identificando stack, componentes, padrões arquiteturais, dependências e integrações externas. Gera saída padronizada para consumo em pipelines do Tech Lead Toolkit.
metadata:
  version: "0.0.1"
---

## Objetivo

Analisar a estrutura de um projeto e gerar documentação padronizada identificando stack tecnológica, estrutura de diretórios, componentes principais, padrões arquiteturais, pontos de entrada e integrações externas.

## Quando Usar

- Antes de gerar documentação técnica (PRD, TRD)
- Para entender a arquitetura de um repositório existente
- Para identificar pontos de integração entre sistemas
- Para mapear dependências internas e externas
- Como primeira etapa em pipelines de enriquecimento de User Stories

## Processo

### 1. Identificar Stack Tecnológica

Verificar arquivos raiz para determinar linguagem e framework:

| Arquivo | Stack |
|---------|-------|
| `package.json` | Node.js / TypeScript |
| `angular.json` | Angular |
| `requirements.txt` / `pyproject.toml` | Python |
| `go.mod` | Go |
| `Cargo.toml` | Rust |
| `pom.xml` / `build.gradle` | Java / Spring Boot |
| `Gemfile` | Ruby |
| `composer.json` | PHP |

Identificar também:
- Banco de dados (via dependências ou arquivos de configuração)
- Cache (Redis, Memcached)
- Message brokers (Kafka, RabbitMQ, Service Bus)
- Ferramentas de build e CI/CD

### 2. Mapear Estrutura de Diretórios

Identificar e anotar a responsabilidade de cada diretório principal:

```
src/              → Código fonte principal
  modules/        → Módulos/features do domínio
  shared/         → Código compartilhado entre módulos
  config/         → Configurações da aplicação
  domain/         → Entidades e regras de domínio
  infrastructure/ → Implementações de infraestrutura
  application/    → Casos de uso / serviços de aplicação
test/             → Testes automatizados
docs/             → Documentação
scripts/          → Scripts auxiliares
```

### 3. Identificar Entry Points

Buscar pontos de entrada da aplicação:
- `src/main.ts`, `src/index.ts` (Node.js)
- `src/app.module.ts` (NestJS)
- `src/App.tsx` (React)
- `main.py`, `app.py` (Python)
- `cmd/main.go` (Go)
- `Application.java` (Spring Boot)
- Controllers e Handlers que expõem APIs

### 4. Mapear Dependências

Analisar:
- Imports entre módulos internos
- Dependências externas (package.json, pom.xml, etc.)
- Injeção de dependências (providers, beans, etc.)
- Padrões de comunicação entre componentes

### 5. Identificar Padrões Arquiteturais

Padrões comuns a identificar:
- MVC / Clean Architecture / Hexagonal
- Modular (NestJS style)
- Layered (Controller → Service → Repository)
- Event-Driven / CQRS
- Microservices / Monolith
- Domain-Driven Design (DDD)

### 6. Mapear Integrações Externas

Para cada integração identificar:
- Nome do serviço externo
- Protocolo (REST, gRPC, Kafka, Service Bus, WebSocket)
- Tipo de comunicação (síncrona/assíncrona)
- Configuração de resiliência (retry, circuit breaker, timeout)

## Formato de Saída

A saída DEVE seguir exatamente estas seções para garantir compatibilidade com skills downstream no pipeline:

```markdown
## Análise Estrutural: [Nome do Projeto]

### Resumo da Stack

| Aspecto | Tecnologia |
|---------|-----------|
| Linguagem | [ex: TypeScript 5.x] |
| Framework | [ex: NestJS 10] |
| Banco de Dados | [ex: PostgreSQL 15 + Prisma] |
| Cache | [ex: Redis 7] |
| Message Broker | [ex: Apache Kafka] |
| Build | [ex: npm / Webpack] |
| CI/CD | [ex: GitHub Actions] |

### Estrutura de Diretórios

\`\`\`
src/
├── modules/
│   ├── auth/           # Autenticação e autorização
│   ├── users/          # Gestão de usuários
│   └── payments/       # Processamento de pagamentos
├── shared/
│   ├── decorators/     # Decorators customizados
│   └── filters/        # Filtros de exceção
└── config/             # Configurações da aplicação
\`\`\`

### Tabela de Componentes

| Componente | Tipo | Responsabilidade | Dependências |
|------------|------|-----------------|--------------|
| AuthModule | Módulo | JWT, sessões | UsersModule, Redis |
| UsersService | Serviço | CRUD de usuários | Prisma |
| PaymentsController | Controller | API de pagamentos | PaymentsService |

### Padrões Arquiteturais

- **[Padrão]**: [Descrição de como é aplicado no projeto]
- **[Padrão]**: [Descrição]

### Pontos de Entrada

| Entry Point | Tipo | Descrição |
|-------------|------|-----------|
| `src/main.ts` | Bootstrap | Inicialização da aplicação |
| `POST /api/v1/orders` | Endpoint | Criação de pedidos |
| `KafkaConsumer.onMessage` | Consumer | Processamento de eventos |

### Integrações Externas

| Serviço | Protocolo | Tipo | Resiliência |
|---------|-----------|------|-------------|
| Payment Gateway | REST/HTTPS | Síncrono | Retry 3x, timeout 5s |
| Notification Service | Kafka | Assíncrono | DLQ configurado |
| Auth Provider | OAuth2 | Síncrono | Circuit breaker |

### Observações

- [Pontos de atenção identificados]
- [Riscos técnicos observados]
- [Sugestões de melhoria]
```

## Exemplo de Uso

```
> Analise a estrutura deste projeto
> Identifique os componentes principais e suas responsabilidades
> Mapeie as integrações externas e padrões arquiteturais
```
