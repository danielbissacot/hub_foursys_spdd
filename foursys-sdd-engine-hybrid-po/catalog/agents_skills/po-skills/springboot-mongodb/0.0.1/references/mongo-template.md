# MongoTemplate - Queries Complexas

Este documento cobre o uso de MongoTemplate para operações complexas que não são possíveis com MongoDB Repository.

## Quando usar MongoTemplate

⚠️ **Use MongoTemplate APENAS quando:**
- Agregações complexas
- Operações bulk customizadas
- Queries dinâmicas construídas em runtime
- Updates complexos
- Operações que MongoRepository não suporta

✅ **Para operações simples, prefira MongoRepository!**

## 1. Configuração Básica

### 1.1. MongoTemplate já vem configurado

```java
// MongoTemplate é auto-configurado pelo Spring Boot
// Basta injetar onde necessário
@Component
public class CustomAccountRepository {
    
    private final MongoTemplate mongoTemplate;
    
    public CustomAccountRepository(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
}
```

## 2. Operações CRUD Básicas

### 2.1. Insert

```java
@Component
public class AccountTemplateRepository {
    
    private final MongoTemplate mongoTemplate;
    
    // Inserir um documento
    public AccountDocument save(AccountDocument account) {
        return mongoTemplate.save(account);
    }
    
    // Inserir (falha se já existe)
    public AccountDocument insert(AccountDocument account) {
        return mongoTemplate.insert(account);
    }
    
    // Inserir múltiplos (bulk)
    public Collection<AccountDocument> insertAll(List<AccountDocument> accounts) {
        return mongoTemplate.insert(accounts, AccountDocument.class);
    }
}
```

### 2.2. Find/Query

```java
// Buscar por ID
public AccountDocument findById(String id) {
    return mongoTemplate.findById(id, AccountDocument.class);
}

// Buscar com Query
public List<AccountDocument> findByStatus(String status) {
    Query query = Query.query(Criteria.where("status").is(status));
    return mongoTemplate.find(query, AccountDocument.class);
}

// Buscar um único documento
public AccountDocument findOneByAccountNumber(String accountNumber) {
    Query query = Query.query(Criteria.where("accountNumber").is(accountNumber));
    return mongoTemplate.findOne(query, AccountDocument.class);
}

// Buscar todos
public List<AccountDocument> findAll() {
    return mongoTemplate.findAll(AccountDocument.class);
}

// Verificar se existe
public boolean exists(String id) {
    Query query = Query.query(Criteria.where("_id").is(id));
    return mongoTemplate.exists(query, AccountDocument.class);
}

// Contar documentos
public long count(String status) {
    Query query = Query.query(Criteria.where("status").is(status));
    return mongoTemplate.count(query, AccountDocument.class);
}
```

### 2.3. Update

```java
// Update simples
public void updateAccountStatus(String accountId, String newStatus) {
    Query query = Query.query(Criteria.where("_id").is(accountId));
    Update update = Update.update("status", newStatus)
                          .set("updatedAt", LocalDateTime.now());
    
    mongoTemplate.updateFirst(query, update, AccountDocument.class);
}

// Update múltiplos documentos
public void updateAllAccountsByStatus(String oldStatus, String newStatus) {
    Query query = Query.query(Criteria.where("status").is(oldStatus));
    Update update = Update.update("status", newStatus)
                          .set("updatedAt", LocalDateTime.now());
    
    mongoTemplate.updateMulti(query, update, AccountDocument.class);
}

// Upsert (update ou insert)
public void upsertAccount(AccountDocument account) {
    Query query = Query.query(Criteria.where("accountNumber").is(account.getAccountNumber()));
    Update update = new Update()
        .set("name", account.getName())
        .set("balance", account.getBalance())
        .set("status", account.getStatus())
        .set("updatedAt", LocalDateTime.now());
    
    mongoTemplate.upsert(query, update, AccountDocument.class);
}

// Update com incremento
public void incrementBalance(String accountId, BigDecimal amount) {
    Query query = Query.query(Criteria.where("_id").is(accountId));
    Update update = new Update()
        .inc("balance", amount)
        .set("updatedAt", LocalDateTime.now());
    
    mongoTemplate.updateFirst(query, update, AccountDocument.class);
}

// Update com array operations
public void addTag(String accountId, String tag) {
    Query query = Query.query(Criteria.where("_id").is(accountId));
    Update update = new Update().addToSet("tags", tag);
    
    mongoTemplate.updateFirst(query, update, AccountDocument.class);
}

public void removeTag(String accountId, String tag) {
    Query query = Query.query(Criteria.where("_id").is(accountId));
    Update update = new Update().pull("tags", tag);
    
    mongoTemplate.updateFirst(query, update, AccountDocument.class);
}
```

### 2.4. Delete

```java
// Delete por ID
public void deleteById(String id) {
    Query query = Query.query(Criteria.where("_id").is(id));
    mongoTemplate.remove(query, AccountDocument.class);
}

// Delete com query
public void deleteByStatus(String status) {
    Query query = Query.query(Criteria.where("status").is(status));
    mongoTemplate.remove(query, AccountDocument.class);
}

// Delete all
public void deleteAll() {
    mongoTemplate.remove(new Query(), AccountDocument.class);
}
```

## 3. Queries Complexas com Criteria

### 3.1. Criteria Básico

```java
@Component
public class AccountQueryRepository {
    
    private final MongoTemplate mongoTemplate;
    
    // Query com AND
    // ⚠️ ÍNDICE: db.accounts.createIndex({ "status": 1, "balance": 1 })
    public List<AccountDocument> findByStatusAndMinBalance(String status, BigDecimal minBalance) {
        Query query = Query.query(
            Criteria.where("status").is(status)
                   .and("balance").gte(minBalance)
        );
        return mongoTemplate.find(query, AccountDocument.class);
    }
    
    // Query com OR
    // ⚠️ ÍNDICE: db.accounts.createIndex({ "status": 1 })
    // ⚠️ ÍNDICE: db.accounts.createIndex({ "type": 1 })
    public List<AccountDocument> findByStatusOrType(String status, String type) {
        Query query = Query.query(
            new Criteria().orOperator(
                Criteria.where("status").is(status),
                Criteria.where("type").is(type)
            )
        );
        return mongoTemplate.find(query, AccountDocument.class);
    }
    
    // Query com IN
    public List<AccountDocument> findByStatusIn(List<String> statuses) {
        Query query = Query.query(Criteria.where("status").in(statuses));
        return mongoTemplate.find(query, AccountDocument.class);
    }
    
    // Query com comparadores
    public List<AccountDocument> findByBalanceRange(BigDecimal min, BigDecimal max) {
        Query query = Query.query(
            Criteria.where("balance").gte(min).lte(max)
        );
        return mongoTemplate.find(query, AccountDocument.class);
    }
    
    // Query com regex
    public List<AccountDocument> findByNamePattern(String pattern) {
        Query query = Query.query(
            Criteria.where("name").regex(pattern, "i") // case-insensitive
        );
        return mongoTemplate.find(query, AccountDocument.class);
    }
    
    // Query com exists
    public List<AccountDocument> findClosedAccounts() {
        Query query = Query.query(
            Criteria.where("closedAt").exists(true)
        );
        return mongoTemplate.find(query, AccountDocument.class);
    }
}
```

### 3.2. Queries Dinâmicas

```java
/**
 * Query builder dinâmico
 * Adiciona critérios apenas se parâmetros não forem nulos
 */
public List<AccountDocument> findByDynamicCriteria(
    String status,
    String type,
    BigDecimal minBalance,
    BigDecimal maxBalance,
    LocalDateTime createdAfter
) {
    Criteria criteria = new Criteria();
    List<Criteria> criteriaList = new ArrayList<>();
    
    if (status != null) {
        criteriaList.add(Criteria.where("status").is(status));
    }
    
    if (type != null) {
        criteriaList.add(Criteria.where("type").is(type));
    }
    
    if (minBalance != null) {
        criteriaList.add(Criteria.where("balance").gte(minBalance));
    }
    
    if (maxBalance != null) {
        criteriaList.add(Criteria.where("balance").lte(maxBalance));
    }
    
    if (createdAfter != null) {
        criteriaList.add(Criteria.where("createdAt").gte(createdAfter));
    }
    
    if (!criteriaList.isEmpty()) {
        criteria.andOperator(criteriaList.toArray(new Criteria[0]));
    }
    
    Query query = Query.query(criteria);
    return mongoTemplate.find(query, AccountDocument.class);
}
```

## 4. Paginação e Ordenação

### 4.1. Paginação com MongoTemplate

```java
// Paginação básica
// ⚠️ ÍNDICE: db.accounts.createIndex({ "status": 1, "createdAt": -1 })
public Page<AccountDocument> findByStatusPaginated(String status, Pageable pageable) {
    Query query = Query.query(Criteria.where("status").is(status))
                       .with(pageable);
    
    List<AccountDocument> accounts = mongoTemplate.find(query, AccountDocument.class);
    long total = mongoTemplate.count(
        Query.query(Criteria.where("status").is(status)), 
        AccountDocument.class
    );
    
    return new PageImpl<>(accounts, pageable, total);
}

// Paginação com ordenação
public List<AccountDocument> findTopAccountsByBalance(int limit) {
    Query query = new Query()
        .with(Sort.by(Sort.Direction.DESC, "balance"))
        .limit(limit);
    
    return mongoTemplate.find(query, AccountDocument.class);
}

// Cursor-based pagination (mais eficiente)
// ⚠️ ÍNDICE: db.accounts.createIndex({ "_id": 1, "status": 1 })
public List<AccountDocument> findByStatusAfterCursor(
    String status, 
    String lastId, 
    int limit
) {
    Criteria criteria = Criteria.where("status").is(status);
    
    if (lastId != null) {
        criteria.and("_id").gt(lastId);
    }
    
    Query query = Query.query(criteria)
                       .with(Sort.by(Sort.Direction.ASC, "_id"))
                       .limit(limit);
    
    return mongoTemplate.find(query, AccountDocument.class);
}
```

### 4.2. Projeções

```java
// Incluir apenas campos específicos
public List<AccountDocument> findAccountSummaries(String status) {
    Query query = Query.query(Criteria.where("status").is(status));
    query.fields()
         .include("accountNumber")
         .include("name")
         .include("balance");
    
    return mongoTemplate.find(query, AccountDocument.class);
}

// Excluir campos sensíveis
public List<AccountDocument> findAccountsWithoutSensitiveData() {
    Query query = new Query();
    query.fields()
         .exclude("internalNotes")
         .exclude("auditLog");
    
    return mongoTemplate.find(query, AccountDocument.class);
}
```

## 5. Agregações (Aggregation Framework)

### 5.1. Agregações Simples

```java
@Component
public class AccountAggregationRepository {
    
    private final MongoTemplate mongoTemplate;
    
    /**
     * Somar total de saldo por status
     * ⚠️ ÍNDICE: db.accounts.createIndex({ "status": 1, "balance": 1 })
     */
    public Map<String, BigDecimal> getTotalBalanceByStatus() {
        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.group("status")
                      .sum("balance").as("totalBalance"),
            Aggregation.sort(Sort.Direction.DESC, "totalBalance")
        );
        
        AggregationResults<Document> results = mongoTemplate.aggregate(
            aggregation, 
            "accounts", 
            Document.class
        );
        
        Map<String, BigDecimal> resultMap = new HashMap<>();
        for (Document doc : results.getMappedResults()) {
            String status = doc.getString("_id");
            BigDecimal total = new BigDecimal(doc.get("totalBalance").toString());
            resultMap.put(status, total);
        }
        
        return resultMap;
    }
    
    /**
     * Média de saldo por tipo de conta
     */
    public Map<String, BigDecimal> getAverageBalanceByType() {
        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.match(Criteria.where("status").is("ACTIVE")),
            Aggregation.group("type")
                      .avg("balance").as("averageBalance"),
            Aggregation.sort(Sort.Direction.DESC, "averageBalance")
        );
        
        AggregationResults<Document> results = mongoTemplate.aggregate(
            aggregation, 
            "accounts", 
            Document.class
        );
        
        Map<String, BigDecimal> resultMap = new HashMap<>();
        for (Document doc : results.getMappedResults()) {
            String type = doc.getString("_id");
            BigDecimal avg = new BigDecimal(doc.get("averageBalance").toString());
            resultMap.put(type, avg);
        }
        
        return resultMap;
    }
}
```

### 5.2. Agregações Complexas

```java
/**
 * Estatísticas de contas por faixa de saldo
 * ⚠️ ÍNDICE: db.accounts.createIndex({ "balance": 1, "status": 1 })
 */
public List<BalanceRangeStats> getAccountStatsByBalanceRange() {
    Aggregation aggregation = Aggregation.newAggregation(
        // 1. Filtrar apenas contas ativas
        Aggregation.match(Criteria.where("status").is("ACTIVE")),
        
        // 2. Adicionar campo de faixa de saldo
        Aggregation.project("balance", "accountNumber")
                  .and(ConditionalOperators.switchCases(
                      CaseOperator.when(Criteria.where("balance").lte(1000))
                                  .then("0-1000"),
                      CaseOperator.when(Criteria.where("balance").lte(10000))
                                  .then("1001-10000"),
                      CaseOperator.when(Criteria.where("balance").lte(100000))
                                  .then("10001-100000")
                  ).defaultTo("100000+"))
                  .as("balanceRange"),
        
        // 3. Agrupar por faixa
        Aggregation.group("balanceRange")
                  .count().as("accountCount")
                  .sum("balance").as("totalBalance")
                  .avg("balance").as("averageBalance"),
        
        // 4. Ordenar
        Aggregation.sort(Sort.Direction.ASC, "_id")
    );
    
    AggregationResults<BalanceRangeStats> results = mongoTemplate.aggregate(
        aggregation,
        "accounts",
        BalanceRangeStats.class
    );
    
    return results.getMappedResults();
}

/**
 * Top N contas por saldo com detalhes
 */
public List<TopAccountInfo> getTopAccountsByBalance(int limit) {
    Aggregation aggregation = Aggregation.newAggregation(
        Aggregation.match(Criteria.where("status").is("ACTIVE")),
        Aggregation.sort(Sort.Direction.DESC, "balance"),
        Aggregation.limit(limit),
        Aggregation.project()
                  .and("accountNumber").as("accountNumber")
                  .and("name").as("name")
                  .and("balance").as("balance")
                  .and("type").as("type")
    );
    
    return mongoTemplate.aggregate(
        aggregation,
        "accounts",
        TopAccountInfo.class
    ).getMappedResults();
}

/**
 * Lookup (JOIN) com outra coleção
 */
public List<AccountWithTransactions> getAccountsWithRecentTransactions() {
    Aggregation aggregation = Aggregation.newAggregation(
        Aggregation.match(Criteria.where("status").is("ACTIVE")),
        Aggregation.lookup(
            "transactions",           // collection to join
            "_id",                    // local field
            "accountId",              // foreign field
            "transactions"            // output array field
        ),
        Aggregation.project()
                  .and("accountNumber").as("accountNumber")
                  .and("name").as("name")
                  .and("balance").as("balance")
                  .and("transactions").as("recentTransactions")
    );
    
    return mongoTemplate.aggregate(
        aggregation,
        "accounts",
        AccountWithTransactions.class
    ).getMappedResults();
}
```

## 6. Operações Bulk

### 6.1. Bulk Write Operations

```java
/**
 * Operações em lote para melhor performance
 */
public void bulkUpdateAccounts(List<AccountUpdate> updates) {
    BulkOperations bulkOps = mongoTemplate.bulkOps(
        BulkOperations.BulkMode.UNORDERED,
        AccountDocument.class
    );
    
    for (AccountUpdate update : updates) {
        Query query = Query.query(Criteria.where("_id").is(update.getId()));
        Update updateOp = new Update()
            .set("balance", update.getNewBalance())
            .set("updatedAt", LocalDateTime.now());
        
        bulkOps.updateOne(query, updateOp);
    }
    
    BulkWriteResult result = bulkOps.execute();
    
    logger.info("Bulk update: {} modified", result.getModifiedCount());
}

/**
 * Bulk insert
 */
public void bulkInsertAccounts(List<AccountDocument> accounts) {
    BulkOperations bulkOps = mongoTemplate.bulkOps(
        BulkOperations.BulkMode.UNORDERED,
        AccountDocument.class
    );
    
    bulkOps.insert(accounts);
    BulkWriteResult result = bulkOps.execute();
    
    logger.info("Bulk insert: {} inserted", result.getInsertedCount());
}
```

## 7. Operações com Transações

```java
@Component
public class TransactionalAccountRepository {
    
    private final MongoTemplate mongoTemplate;
    
    /**
     * Transferência com transação usando MongoTemplate
     */
    @Transactional
    public void transferFunds(String fromId, String toId, BigDecimal amount) {
        // 1. Debitar origem
        Query fromQuery = Query.query(Criteria.where("_id").is(fromId));
        Update debitUpdate = new Update()
            .inc("balance", amount.negate())
            .set("updatedAt", LocalDateTime.now());
        mongoTemplate.updateFirst(fromQuery, debitUpdate, AccountDocument.class);
        
        // 2. Creditar destino
        Query toQuery = Query.query(Criteria.where("_id").is(toId));
        Update creditUpdate = new Update()
            .inc("balance", amount)
            .set("updatedAt", LocalDateTime.now());
        mongoTemplate.updateFirst(toQuery, creditUpdate, AccountDocument.class);
    }
}
```

## 8. Índices com MongoTemplate

```java
@Component
public class MongoIndexManager {
    
    private final MongoTemplate mongoTemplate;
    
    /**
     * Criar índices programaticamente
     */
    @PostConstruct
    public void createIndexes() {
        IndexOperations indexOps = mongoTemplate.indexOps(AccountDocument.class);
        
        // Índice simples
        Index accountNumberIndex = new Index()
            .on("accountNumber", Sort.Direction.ASC)
            .unique();
        indexOps.ensureIndex(accountNumberIndex);
        
        // Índice composto
        Index statusBalanceIndex = new Index()
            .on("status", Sort.Direction.ASC)
            .on("balance", Sort.Direction.DESC);
        indexOps.ensureIndex(statusBalanceIndex);
        
        // Índice com TTL (expira documentos)
        Index ttlIndex = new Index()
            .on("createdAt", Sort.Direction.ASC)
            .expire(Duration.ofDays(90)); // Documentos expiram em 90 dias
        indexOps.ensureIndex(ttlIndex);
        
        // Índice de texto
        TextIndexDefinition textIndex = new TextIndexDefinitionBuilder()
            .onField("name")
            .onField("description")
            .build();
        indexOps.ensureIndex(textIndex);
    }
    
    /**
     * Listar índices existentes
     */
    public List<IndexInfo> listIndexes() {
        IndexOperations indexOps = mongoTemplate.indexOps(AccountDocument.class);
        return indexOps.getIndexInfo();
    }
    
    /**
     * Remover índice
     */
    public void dropIndex(String indexName) {
        IndexOperations indexOps = mongoTemplate.indexOps(AccountDocument.class);
        indexOps.dropIndex(indexName);
    }
}
```

## 9. Boas Práticas MongoTemplate

### ✅ Faça

```java
// ✅ Use criteria builders para queries complexas
Query query = Query.query(
    Criteria.where("status").is("ACTIVE")
           .and("balance").gte(minBalance)
);

// ✅ Use projeções para reduzir dados
query.fields().include("accountNumber", "name", "balance");

// ✅ Use agregações para cálculos no banco
Aggregation aggregation = Aggregation.newAggregation(
    Aggregation.match(criteria),
    Aggregation.group("status").sum("balance").as("total")
);

// ✅ Use bulk operations para múltiplas escritas
BulkOperations bulkOps = mongoTemplate.bulkOps(
    BulkOperations.BulkMode.UNORDERED,
    AccountDocument.class
);
```

### ❌ Não Faça

```java
// ❌ Não buscar todos os documentos sem paginação
List<AccountDocument> all = mongoTemplate.findAll(AccountDocument.class);

// ❌ Não fazer múltiplos updates em loop (use bulk)
for (Account account : accounts) {
    mongoTemplate.save(account); // ❌ Lento!
}

// ✅ Use bulk insert
mongoTemplate.insert(accounts, AccountDocument.class);

// ❌ Não fazer processamento que pode ser feito no banco
List<AccountDocument> accounts = mongoTemplate.findAll(AccountDocument.class);
BigDecimal total = accounts.stream()
    .map(AccountDocument::getBalance)
    .reduce(BigDecimal.ZERO, BigDecimal::add); // ❌ Processar no código

// ✅ Use agregação
Aggregation aggregation = Aggregation.newAggregation(
    Aggregation.group().sum("balance").as("total")
);
```

## 10. Quando usar MongoTemplate vs Repository

| Cenário | Use Repository | Use MongoTemplate |
|---------|---------------|-------------------|
| CRUD simples | ✅ | ❌ |
| Query by method name | ✅ | ❌ |
| Paginação básica | ✅ | ❌ |
| Updates complexos | ❌ | ✅ |
| Agregações | ❌ | ✅ |
| Bulk operations | ❌ | ✅ |
| Queries dinâmicas | ❌ | ✅ |
| Índices programáticos | ❌ | ✅ |

## Resumo

**MongoTemplate** é poderoso mas deve ser usado com moderação:
- Prefira **MongoRepository** para 80% dos casos
- Use **MongoTemplate** apenas quando Repository não for suficiente
- Sempre crie **índices** para queries complexas
- Use **agregações** para cálculos no banco
- Use **bulk operations** para múltiplas escritas

🎯 **Regra de ouro**: Se puder fazer com Repository, faça com Repository!
