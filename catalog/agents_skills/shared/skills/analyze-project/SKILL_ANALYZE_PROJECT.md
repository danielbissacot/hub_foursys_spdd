---
name: analyze-project
description: Detecta automaticamente stack tecnológica de um projeto (Java Spring Boot, Angular, Node.js) via pom.xml, angular.json, package.json e estrutura de diretórios. Use ao iniciar qualquer assistência em projeto desconhecido para calibrar linguagem, padrões e skills adequadas.
metadata:
  version: "0.0.1"
---

# Skill: Analyze Project Stack

Execute esta skill ao iniciar assistência em um projeto desconhecido. Detecte a stack e configure automaticamente as skills e padrões corretos.

## Algoritmo de Detecção

### Passo 1 — Identificar arquivo raiz

```
Verificar em ordem:
1. pom.xml → Java (Spring Boot)
2. build.gradle → Java (Spring Boot via Gradle)  
3. angular.json → Angular
4. package.json → Node.js / Angular (fallback)
```

### Passo 2 — Identificar versão e framework (por stack)

**Java (pom.xml):**
```xml
<!-- Verificar: -->
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.x.x</version>  ← Spring Boot version
</parent>
<java.version>21</java.version>  ← Java version

<!-- Adapters presentes (verificar <dependencies>): -->
spring-boot-starter-data-jpa     → JPA/Hibernate
spring-kafka                      → Kafka
azure-storage-blob                → Blob Storage
spring-cloud-azure-starter-servicebus → Service Bus
spring-boot-starter-data-redis    → Redis
openfeign / spring-cloud-openfeign → Feign Client
```

**Angular (angular.json):**
```json
// Verificar:
"@angular/core": "^20.x.x"  ← no package.json
// Detectar se usa:
// - httpResource (buscar "httpResource" nos arquivos .ts)
// - Signals (buscar "signal(", "computed(", "effect(")
// - Standalone (verificar se há NgModule — ausência = standalone)
```

**Node.js (package.json):**
```json
// Verificar:
"express" / "fastify" / "nestjs"  ← framework
"prisma" / "typeorm" / "mongoose" ← ORM/ODM
"jest" / "vitest"                  ← test framework
```

### Passo 3 — Identificar arquitetura

**Hexagonal (Java):**
```
Verificar se existe: src/main/java/.../
  ├── core/usecase/       → UseCase layer
  ├── port/input/         → Input ports
  ├── port/output/        → Output ports
  ├── adapter/input/      → Controllers/Consumers
  └── adapter/output/     → Repositories/Adapters
```

**Vertical Slice (Angular):**
```
Verificar se existe: src/app/domains/
  └── [dominio]/
      └── features/       → DUPE pattern detectado
```

## Saída Esperada (Relatório de Stack)

```markdown
## Stack Detectada

| Item | Valor |
|------|-------|
| Linguagem | Java 21 |
| Framework | Spring Boot 3.3.x |
| Arquitetura | Hexagonal |
| Banco | PostgreSQL (JPA) |
| Mensageria | Azure Service Bus |
| Cache | Redis |
| Storage | Azure Blob Storage |
| Testes | JUnit 5 + Mockito |

## Skills Ativas para esta Sessão

- `#SKILL_SPRINGBOOT_REDIS.md` — cache TTL e degradação graceful
- `#SKILL_SPRINGBOOT_BLOB_STORAGE.md` — upload/download de arquivos
- `#SKILL_SPRINGBOOT_SERVICE_BUS.md` — mensageria assíncrona
- `#SKILL_CODE_REVIEW.md` — revisão com 10 dimensões

## Padrões Aplicados Automaticamente

- @Bean obrigatório para toda UseCase em config/
- BigDecimal para valores monetários (nunca Double/Float)
- PII mascaramento em logs (CPF/CNPJ/conta)
- Cobertura mínima: 95%
```

## Calibração por Stack

| Stack detectada | Skills prioritárias | Padrão de código |
|----------------|---------------------|-----------------|
| Java Spring Boot | springboot-redis, blob-storage, service-bus | Hexagonal, @Bean, records |
| Angular v20+ | angular-http, angular-signals, angular-forms | Standalone, OnPush, httpResource |
| Angular < v18 | angular-forms (legado) | NgModule, HttpClient |
| Node.js / NestJS | code-review | DI, módulos NestJS |

## Quando Não Detectar Automaticamente

Se não encontrar nenhum arquivo raiz reconhecível, perguntar ao usuário:

```
Não foi possível detectar a stack automaticamente. Informe:
1. Linguagem/Framework principal (ex: Java Spring Boot 3, Angular 20, Node.js Express)
2. Versão principal (ex: Java 21, Angular 20.x, Node 20)
3. Existem integrações com Redis, Kafka, Azure Service Bus ou Blob Storage?
```
