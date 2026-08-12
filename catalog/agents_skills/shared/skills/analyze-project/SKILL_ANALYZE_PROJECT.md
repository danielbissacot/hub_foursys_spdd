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

### Passo 4 — Levantar Estrutura Real Já Existente (OBRIGATÓRIO)

Depois de identificar a stack, procure de verdade no projeto (não infira) por pacotes, módulos, classes, componentes ou domínios já existentes com nome relacionado ao que será trabalhado na sessão. Isso é diferente do Passo 1-3 (que só identificam a stack/framework) — aqui o objetivo é listar caminhos reais que já existem no repositório, pra evitar que fases seguintes (Plan/Tasks) inventem nome de pacote/módulo novo quando já existe um real.

```
Java: extraia o pacote base REAL de uma destas fontes, nesta ordem — nunca invente, nunca herde de exemplo de skill:
  1. Tag <groupId> do pom.xml (ou "group =" do build.gradle)
  2. Se não conclusivo, a declaração "package ..." do topo de uma classe já existente em src/main/java/
Depois liste as subpastas de domínio já presentes dentro desse pacote base.

Angular / Node.js: extraia o nome/scope REAL do pacote npm (campo "name" do package.json, ex: "@empresa/app") — nunca invente, nunca herde de exemplo de skill.
  Depois liste os domínios/componentes/módulos/controllers/services já existentes em src/app/ (ou src/app/domains/ se Vertical Slice) ou src/.

Android: extraia o applicationId/namespace REAL do app/build.gradle.kts (ou pacote do AndroidManifest.xml).
iOS: extraia o Bundle Identifier REAL do Info.plist/configurações do target.
COBOL: identifique o prefixo/código REAL usado nos PROGRAM-ID já existentes.
```

**Checagem obrigatória (qualquer stack)**: compare o identificador encontrado (pacote Java, scope npm, applicationId, Bundle ID, prefixo COBOL...) com o nome da empresa/cliente dona do projeto. Se o identificador extraído da fonte real não bater com "foursys" (ou qualquer outro nome usado como exemplo em alguma skill), **use o identificador real encontrado — nunca o nome de exemplo**. Se não for possível determinar (projeto sem nenhum arquivo de configuração/código ainda), pergunte ao usuário qual é o identificador base antes de prosseguir — nunca assuma um nome de empresa.

Se o projeto estiver vazio (feature realmente nova, sem nada relacionado ainda), diga isso explicitamente — não é erro, só não invente um caminho como se já existisse.

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

## Estrutura Real Já Existente

> Esta lista — não a tabela acima — é a referência de nomenclatura pra fases seguintes (Plan/Tasks). Nunca use um pacote/componente de exemplo de alguma skill como se fosse o pacote real do projeto.

- Identificador base real: `<groupId/scope npm/applicationId/Bundle ID/prefixo COBOL — o que for aplicável à stack>` (ou "não identificado — perguntei ao usuário" / "projeto sem domínios relacionados ainda")
- Fonte usada pra confirmar: `pom.xml <groupId>` | `build.gradle` | `package.json <name>` | `AndroidManifest.xml` | `Info.plist` | `classe/arquivo existente: <caminho>` | `perguntado ao usuário`
- Domínios/módulos existentes relacionados: `<caminho real 1>`, `<caminho real 2>`, ...

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
