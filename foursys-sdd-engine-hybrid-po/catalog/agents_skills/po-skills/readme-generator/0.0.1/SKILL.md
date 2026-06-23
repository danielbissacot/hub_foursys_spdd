---
name: readme-generator
description: Gera README.md padronizado para repositórios de microsserviços, BFFs, frontends e bibliotecas. Analisa código fonte, dependências, estrutura de diretórios e integrações para produzir documentação completa. Use quando um repositório não possuir README.md ou quando a documentação existente estiver incompleta, desatualizada ou insuficiente para entender a responsabilidade do serviço.
metadata:
  version: "0.0.1"
---

## Objetivo

Gerar um README.md completo e padronizado para um repositório, analisando o código fonte para extrair informações sobre stack, arquitetura, APIs, integrações e instruções de execução.

## Processo

### 1. Identificar Tipo de Repositório

Determinar o tipo do repositório pela nomenclatura e arquivos de configuração:

| Tipo   | Indicadores                                      |
|--------|--------------------------------------------------|
| `bff`  | Prefixo `bff-`, gateway patterns, API aggregation |
| `srv`  | Prefixo `srv-`, domain services, business logic   |
| `fed`  | Prefixo `fed-`, `angular.json`, frontend assets   |
| `fun`  | Prefixo `fun-`, serverless functions              |
| `lib`  | Prefixo `lib-`, package exports, shared modules   |
| `doc`  | Prefixo `doc-`, documentação                      |

### 2. Analisar Stack Tecnológica

Verificar arquivos raiz para determinar linguagem, framework e dependências:

- `pom.xml` / `build.gradle` → Java / Spring Boot
- `package.json` → Node.js / Angular / NestJS
- `angular.json` → Angular
- `requirements.txt` / `pyproject.toml` → Python
- `go.mod` → Go

Identificar também: banco de dados, cache, message brokers, ferramentas de CI/CD.

### 3. Mapear Estrutura e Componentes

1. Listar estrutura de diretórios principal com responsabilidades.
2. Identificar entry points (controllers, handlers, consumers).
3. Mapear APIs expostas (endpoints REST, GraphQL, gRPC).
4. Identificar integrações externas (HTTP clients, Kafka producers/consumers, filas).
5. Identificar variáveis de ambiente e configurações necessárias.

### 4. Gerar README.md

Produzir o README seguindo o formato de saída abaixo. Todas as informações devem ser extraídas do código — **NUNCA inventar informações**.

Se alguma seção não puder ser preenchida com dados do código, indicar com `<!-- TODO: completar -->`.

## Formato de Saída

```markdown
# [Nome do Repositório]

[Descrição curta: O que o serviço faz e qual problema resolve]

## Stack Tecnológica

| Aspecto         | Tecnologia              |
|-----------------|------------------------|
| Linguagem       | [ex: Java 17]          |
| Framework       | [ex: Spring Boot 3.x]  |
| Banco de Dados  | [ex: MongoDB]          |
| Message Broker  | [ex: Kafka / Service Bus] |
| Build           | [ex: Maven / npm]      |

## Arquitetura

[Breve descrição do padrão arquitetural utilizado: Hexagonal, Layered, MVC, etc.]

\`\`\`
src/
├── controllers/    # Endpoints REST
├── services/       # Lógica de negócio
├── repositories/   # Acesso a dados
├── models/         # Entidades e DTOs
├── config/         # Configurações
└── integrations/   # Clientes HTTP, producers/consumers
\`\`\`

## APIs

### Endpoints Expostos

| Método | Path                  | Descrição                |
|--------|-----------------------|--------------------------|
| GET    | /api/v1/resource      | Lista recursos           |
| POST   | /api/v1/resource      | Cria recurso             |

### Eventos Consumidos / Produzidos

| Tópico/Fila         | Tipo      | Descrição                |
|----------------------|-----------|--------------------------|
| order.created        | Produtor  | Evento de pedido criado  |
| payment.confirmed    | Consumidor| Confirmação de pagamento |

## Integrações Externas

| Serviço           | Protocolo | Tipo        |
|-------------------|-----------|-------------|
| [nome-serviço]    | REST      | Síncrono    |
| [nome-serviço]    | Kafka     | Assíncrono  |

## Configuração

### Variáveis de Ambiente

| Variável              | Descrição               | Obrigatória |
|-----------------------|-------------------------|-------------|
| DATABASE_URL          | Connection string do BD | Sim         |
| KAFKA_BOOTSTRAP       | Endereço do Kafka       | Sim         |

## Execução Local

\`\`\`bash
# Instalar dependências
[comando de instalação]

# Executar
[comando de execução]

# Testes
[comando de testes]
\`\`\`
```

## Regras

1. Extrair informações exclusivamente do código fonte — não inventar dados.
2. Manter linguagem objetiva e técnica.
3. Adaptar as seções ao tipo de repositório (ex: frontend não terá seção de Kafka).
4. Omitir seções que não se aplicam ao repositório, em vez de deixar vazias.
5. Se o repositório já possuir um README.md parcial, preservar informações corretas e complementar as lacunas.
