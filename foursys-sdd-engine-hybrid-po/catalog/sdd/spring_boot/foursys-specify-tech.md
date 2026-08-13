---
name: Especificação Técnica Etapa 3 — Java 21 + Spring Boot (Hexagonal + Azure)
description: Injeção da Etapa 3 do Specify para projetos Java 21 + Spring Boot com Arquitetura Hexagonal e integrações Azure.
metadata:
  version: "1.1.0"
---

### 3. Derivação da História Técnica — Java 21 + Spring Boot 3.x

**ANTES DE PROPOR QUALQUER PACOTE OU CLASSE:** localize no contexto o bloco **MAPA REAL DO
PROJETO** (identificador base + pastas existentes) e use **exatamente** aquela nomenclatura.
Nunca invente pacote nem copie exemplo de skill como se fosse o pacote do projeto. Se o projeto
já usa uma estrutura diferente do padrão-alvo (ex.: `domain/service/` em vez de `core/usecase/`),
**siga a do projeto**. Se o mapa não vier no contexto, diga isso explicitamente e proponha a
estrutura como sugestão, marcando que não foi possível confirmar contra o projeto — não trave.

- Mapeie os componentes técnicos impactados: Use Cases (1 InputPort cada), Adapters REST (Controller), Repositories, Entities/Records, integrações conforme necessidade. Para cada integração que a história exigir, aponte na especificação a skill que o desenvolvedor deve abrir na fase de implementação — e já registre a regra estrutural correspondente:
  - Feign Client → skill `springboot-feign-client` — adapter de SAÍDA, com circuit breaker Resilience4j
  - Kafka → skill `springboot-kafka` — Producer em `adapter/output/producer/`, Consumer em `adapter/input/consumer/` (Consumer aciona UseCase, é adapter de ENTRADA), DLQ obrigatória
  - MongoDB → skill `springboot-mongodb` — adapter de SAÍDA via Spring Data MongoDB
  - Redis Cache → skill `springboot-redis` — adapter de SAÍDA, Azure Cache for Redis via CSI Driver (sem SDK no código)
  - Blob Storage → skill `springboot-blob-storage` — adapter de SAÍDA, Azure Blob Storage
  - Service Bus → skill `springboot-service-bus` — adapter de SAÍDA, Azure Service Bus
  - Testes → skill `springboot-testing` — AAA, cobertura medida com JaCoCo (linha ≥ 95%)

⚠️ Nesta fase você NÃO tem como executar uma skill: cite o nome dela como referência para o
desenvolvedor e escreva aqui a regra estrutural que ela exige. Não escreva "invocando a skill X"
como se tivesse carregado o conteúdo dela.
- Indique os Critérios de Aceite Técnicos: validações Bean Validation (@NotNull, @Valid), mascaramento PII (CPF, senha, token, conta) em logs e respostas, logs de auditoria, cobertura de testes >= 95%, tratamento de exceções de domínio.
- Para features de transação financeira: especificar idempotência, ACID, mecanismo de reversão e tipo BigDecimal para valores monetários.
- Para features de cache: especificar TTL por natureza (estático 24h / semi-estático 1h / transacional 5min) e estratégia de degradação graceful (required: false).
- ⚠️ NÃO USE padrões Angular, TypeScript ou frontend. Este é um projeto Java/Spring Boot com Arquitetura Hexagonal.

Item 5 da saída: ⚙️ **Especificação Técnica Java:** Componentes Spring Boot afetados, camadas hexagonais impactadas, integrações Azure mapeadas, skills a invocar, checklist técnico do desenvolvedor Java.
