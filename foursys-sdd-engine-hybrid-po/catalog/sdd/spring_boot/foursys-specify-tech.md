---
name: Especificação Técnica Etapa 3 — Java 21 + Spring Boot (Hexagonal + Azure)
description: Injeção da Etapa 3 do Specify para projetos Java 21 + Spring Boot com Arquitetura Hexagonal e integrações Azure.
metadata:
  version: "1.1.0"
---

### 3. Derivação da História Técnica — Java 21 + Spring Boot 3.x

- Mapeie os componentes técnicos impactados: Use Cases (1 InputPort cada), Adapters REST (Controller), Repositories, Entities/Records, integrações conforme necessidade:
  - Feign Client → invocar `SKILL_SPRINGBOOT_FEIGN_CLIENT.md`
  - Kafka → invocar `SKILL_SPRINGBOOT_KAFKA.md`
  - MongoDB → invocar `SKILL_SPRINGBOOT_MONGODB.md`
  - Redis Cache → invocar `SKILL_SPRINGBOOT_REDIS.md` (Azure Cache for Redis via CSI Driver)
  - Blob Storage → invocar `SKILL_SPRINGBOOT_BLOB_STORAGE.md` (Azure Blob Storage)
  - Service Bus → invocar `SKILL_SPRINGBOOT_SERVICE_BUS.md` (Azure Service Bus)
- Indique os Critérios de Aceite Técnicos: validações Bean Validation (@NotNull, @Valid), mascaramento PII (CPF, senha, token, conta) em logs e respostas, logs de auditoria, cobertura de testes >= 95%, tratamento de exceções de domínio.
- Para features de transação financeira: especificar idempotência, ACID, mecanismo de reversão e tipo BigDecimal para valores monetários.
- Para features de cache: especificar TTL por natureza (estático 24h / semi-estático 1h / transacional 5min) e estratégia de degradação graceful (required: false).
- ⚠️ NÃO USE padrões Angular, TypeScript ou frontend. Este é um projeto Java/Spring Boot com Arquitetura Hexagonal.

Item 5 da saída: ⚙️ **Especificação Técnica Java:** Componentes Spring Boot afetados, camadas hexagonais impactadas, integrações Azure mapeadas, skills a invocar, checklist técnico do desenvolvedor Java.
