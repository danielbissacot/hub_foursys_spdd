# Spring Boot MongoDB: MongoTemplate Reference

Este guia fornece padrões e exemplos de uso do `MongoTemplate` para operações avançadas no MongoDB com Spring Boot.

## 1. Configuração Básica

O `MongoTemplate` é o motor principal para consultas complexas que vão além das capacidades do `MongoRepository`.

```java
@Autowired
private MongoTemplate mongoTemplate;
```

## 2. Consultas (Queries)

### Busca Simples com Critérios
```java
Query query = new Query();
query.addCriteria(Criteria.where("status").is("ACTIVE"));
List<User> activeUsers = mongoTemplate.find(query, User.class);
```

### Busca com Operadores Lógicos (AND/OR)
```java
Query query = new Query();
query.addCriteria(
    new Criteria().orOperator(
        Criteria.where("role").is("ADMIN"),
        Criteria.where("permissions").in("ALL_ACCESS")
    )
);
List<User> privilegedUsers = mongoTemplate.find(query, User.class);
```

### Busca com Regex (Like)
```java
Query query = new Query();
query.addCriteria(Criteria.where("name").regex("^Antigravity", "i"));
List<User> filteredUsers = mongoTemplate.find(query, User.class);
```

## 3. Atualizações (Updates)

### Atualização Parcial de Documento
```java
Query query = new Query(Criteria.where("id").is(userId));
Update update = new Update();
update.set("lastLogin", LocalDateTime.now());
update.inc("loginCount", 1);

mongoTemplate.updateFirst(query, update, User.class);
```

### Upsert (Update or Insert)
```java
mongoTemplate.upsert(query, update, User.class);
```

## 4. Agregações (Aggregations)

O `MongoTemplate` brilha em operações de agregação.

```java
Aggregation aggregation = Aggregation.newAggregation(
    Aggregation.match(Criteria.where("type").is("SALE")),
    Aggregation.group("category").sum("amount").as("totalSales"),
    Aggregation.sort(Sort.Direction.DESC, "totalSales")
);

AggregationResults<CategorySales> results = mongoTemplate.aggregate(
    aggregation, "transactions", CategorySales.class
);
```

## 5. Paginação e Ordenação

```java
Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());
Query query = new Query().with(pageable);

List<User> pagedUsers = mongoTemplate.find(query, User.class);
long total = mongoTemplate.count(query.skip(-1).limit(-1), User.class);
```

---
> [!TIP]
> Use `MongoTemplate` quando precisar de consultas dinâmicas, agregações complexas ou atualizações atômicas de campos específicos. Para CRUDs simples, prefira `MongoRepository`.
