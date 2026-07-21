---
name: 'springboot-mongodb'
description: "Implementa persistência NoSQL com MongoDB no padrão Hexagonal. Cobre @Document entities, MongoRepository, índices, aggregations, TTL automático e mapeamento entre entidades de domínio e documentos MongoDB. Use quando a história requer armazenamento de documentos flexíveis, dados não-estruturados ou coleções com esquema variável."
metadata:
  version: "0.1.0"
---

# Skill: springboot-mongodb

Guia completo para implementar **persistência MongoDB** em projetos Java 21 + Spring Boot 3.x com Arquitetura Hexagonal.

> **Invocado por:** `foursys-specify-tech.md` Spring Boot quando a história requer armazenamento em MongoDB.

---

## Quando usar

- A história persiste dados com estrutura variável ou hierárquica (documentos aninhados).
- Alta taxa de leitura/escrita com flexibilidade de esquema.
- Dados de auditoria, logs de eventos, catálogos, configurações dinâmicas.

## Quando não usar

- Transações complexas com múltiplas coleções e integridade ACID forte → considere PostgreSQL.
- Dados altamente relacionais com JOINs frequentes.

---

## Estrutura de Arquivos (Hexagonal)

```
adapter/output/repository/
├── <Dominio>MongoRepositoryAdapter.java   ← Implementa OutputPort
├── <Dominio>MongoRepository.java          ← Interface MongoRepository (Spring Data)
└── entity/
    └── <Dominio>Document.java             ← @Document (entidade MongoDB)
```

---

## Implementação

### 1. Dependência (pom.xml)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

---

### 2. Configuração (application.yml)

```yaml
spring:
  data:
    mongodb:
      uri: ${MONGODB_URI:mongodb://localhost:27017/foursys}
      database: ${MONGODB_DATABASE:foursys}
      auto-index-creation: false  # índices gerenciados via @Document
```

---

### 3. Entidade (Document)

```java
// FILEPATH: adapter/output/repository/entity/PagamentoDocument.java
@Document(collection = "pagamentos")
@TypeAlias("pagamento")
@CompoundIndex(name = "idx_conta_data", def = "{'contaOrigem': 1, 'criadoEm': -1}")
public record PagamentoDocument(

    @Id
    String id,

    @Indexed(unique = true)
    String codigoOperacao,

    BigDecimal valor,

    @Indexed
    String contaOrigem,

    @ToString.Exclude  // PII — nunca logue
    String contaDestino,

    String status,

    @CreatedDate
    LocalDateTime criadoEm,

    @LastModifiedDate
    LocalDateTime atualizadoEm
) {}
```

Habilitar auditoria:
```java
@Configuration
@EnableMongoAuditing
public class MongoConfig {}
```

---

### 4. Repository Interface (Spring Data)

```java
// FILEPATH: adapter/output/repository/PagamentoMongoRepository.java
public interface PagamentoMongoRepository extends MongoRepository<PagamentoDocument, String> {

    Optional<PagamentoDocument> findByCodigoOperacao(String codigoOperacao);

    List<PagamentoDocument> findByContaOrigemAndStatusOrderByCriadoEmDesc(
        String contaOrigem, String status
    );

    @Query("{ 'contaOrigem': ?0, 'valor': { $gte: ?1 } }")
    List<PagamentoDocument> buscarPorContaEValorMinimo(String contaOrigem, BigDecimal valorMinimo);
}
```

---

### 5. Adapter (OutputPort)

```java
// FILEPATH: adapter/output/repository/PagamentoMongoRepositoryAdapter.java
@Component
@RequiredArgsConstructor
public class PagamentoMongoRepositoryAdapter implements PagamentoRepositoryOutputPort {

    private final PagamentoMongoRepository repository;

    @Override
    public Pagamento salvar(Pagamento pagamento) {
        var document = toDocument(pagamento);
        var salvo = repository.save(document);
        return toDomain(salvo);
    }

    @Override
    public Optional<Pagamento> buscarPorCodigoOperacao(String codigoOperacao) {
        return repository.findByCodigoOperacao(codigoOperacao).map(this::toDomain);
    }

    private PagamentoDocument toDocument(Pagamento pagamento) {
        return new PagamentoDocument(
            pagamento.id(),
            pagamento.codigoOperacao(),
            pagamento.valor(),
            pagamento.contaOrigem(),
            pagamento.contaDestino(),
            pagamento.status().name(),
            pagamento.criadoEm(),
            null
        );
    }

    private Pagamento toDomain(PagamentoDocument doc) {
        return new Pagamento(
            doc.id(),
            doc.codigoOperacao(),
            doc.valor(),
            doc.contaOrigem(),
            doc.contaDestino(),
            StatusPagamento.valueOf(doc.status()),
            doc.criadoEm()
        );
    }
}
```

---

### 6. TTL Automático (documentos com expiração)

```java
// Para documentos que expiram automaticamente (ex: tokens, sessões, filas temporárias):
@Document(collection = "tokens_temporarios")
public record TokenTemporarioDocument(
    @Id String id,
    String token,
    @Indexed(expireAfterSeconds = 0)   // TTL controlado pelo campo abaixo
    LocalDateTime expiraEm
) {}
```

---

### 7. Aggregation Pipeline

```java
// FILEPATH: adapter/output/repository/PagamentoMongoRepositoryAdapter.java (método adicional)
public Map<String, BigDecimal> totalPorStatus() {
    var aggregation = Aggregation.newAggregation(
        Aggregation.group("status").sum("valor").as("total"),
        Aggregation.project("total").and("_id").as("status")
    );
    return mongoTemplate.aggregate(aggregation, "pagamentos", StatusTotalResult.class)
        .getMappedResults()
        .stream()
        .collect(Collectors.toMap(StatusTotalResult::status, StatusTotalResult::total));
}
```

---

## Segurança PII

- Use `@ToString.Exclude` nos campos sensíveis (conta, CPF, token).
- Nunca retorne documentos completos diretamente no controller — use DTOs de resposta.
- Coleções com dados PII devem ter TTL configurado quando aplicável.

---

## Checklist de Implementação

- [ ] Dependência `spring-boot-starter-data-mongodb` adicionada
- [ ] URI configurada como variável de ambiente
- [ ] `@Document` com `@CompoundIndex` para queries principais
- [ ] `@CreatedDate` e `@LastModifiedDate` com `@EnableMongoAuditing`
- [ ] `auto-index-creation: false` (índices via código)
- [ ] Adapter implementando `OutputPort` com mapeamento domain ↔ document
- [ ] `@Bean` do Adapter registrado em `config/`
- [ ] Nenhum campo PII exposto em `@ToString` ou logs
- [ ] Testes unitários com `@DataMongoTest` (cobertura ≥ 95%)
