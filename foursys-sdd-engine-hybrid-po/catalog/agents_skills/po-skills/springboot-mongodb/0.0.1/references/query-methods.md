# Query Methods - JSON Queries e SpEL

Este documento cobre query methods customizadas usando @Query com JSON MongoDB e expressões SpEL.

## 1. Query Methods Derivadas (Sem @Query)

### 1.1. Queries Básicas

```java
public interface AccountRepository extends MongoRepository<AccountDocument, String> {
    
    // Busca por campo único
    Optional<AccountDocument> findByAccountNumber(String accountNumber);
    
    // Busca com múltiplos campos (AND)
    List<AccountDocument> findByStatusAndType(String status, String type);
    
    // Busca com OR
    List<AccountDocument> findByStatusOrType(String status, String type);
    
    // Busca com comparação
    List<AccountDocument> findByBalanceGreaterThan(BigDecimal balance);
    List<AccountDocument> findByBalanceLessThanEqual(BigDecimal balance);
    List<AccountDocument> findByBalanceBetween(BigDecimal min, BigDecimal max);
    
    // Busca com ordenação
    List<AccountDocument> findByStatusOrderByBalanceDesc(String status);
    
    // Busca com Like (contains)
    List<AccountDocument> findByNameContaining(String namePart);
    List<AccountDocument> findByNameStartingWith(String prefix);
    List<AccountDocument> findByNameEndingWith(String suffix);
    
    // Busca com data
    List<AccountDocument> findByCreatedAtAfter(LocalDateTime date);
    List<AccountDocument> findByCreatedAtBefore(LocalDateTime date);
    
    // Verificação de existência
    boolean existsByAccountNumber(String accountNumber);
    
    // Contagem
    long countByStatus(String status);
    
    // Deleção
    void deleteByAccountNumber(String accountNumber);
    
    // Limitação de resultados
    List<AccountDocument> findTop10ByStatusOrderByBalanceDesc(String status);
    AccountDocument findFirstByOrderByCreatedAtDesc();
}
```

## 2. JSON Queries com @Query

### 2.1. Queries Simples

```java
// Query JSON básica
@Query("{ 'status': ?0 }")
List<AccountDocument> findByStatus(String status);

// Query com múltiplos parâmetros
@Query("{ 'status': ?0, 'type': ?1 }")
List<AccountDocument> findByStatusAndType(String status, String type);

// Query com operadores de comparação
// ⚠️ ÍNDICE NECESSÁRIO: db.accounts.createIndex({ "balance": 1 })
@Query("{ 'balance': { $gte: ?0 } }")
List<AccountDocument> findByMinBalance(BigDecimal minBalance);

@Query("{ 'balance': { $gte: ?0, $lte: ?1 } }")
List<AccountDocument> findByBalanceRange(BigDecimal min, BigDecimal max);

// Query com operador $in
@Query("{ 'status': { $in: ?0 } }")
List<AccountDocument> findByStatusIn(List<String> statuses);

// Query com $or
// ⚠️ ÍNDICE NECESSÁRIO: db.accounts.createIndex({ "status": 1 })
// ⚠️ ÍNDICE NECESSÁRIO: db.accounts.createIndex({ "type": 1 })
@Query("{ $or: [ { 'status': ?0 }, { 'type': ?1 } ] }")
List<AccountDocument> findByStatusOrType(String status, String type);

// Query com $and
@Query("{ $and: [ { 'balance': { $gte: ?0 } }, { 'status': ?1 } ] }")
List<AccountDocument> findActiveWithMinBalance(BigDecimal minBalance, String status);
```

### 2.2. Queries com Datas

```java
// Query com data
@Query("{ 'createdAt': { $gte: ?0, $lte: ?1 } }")
List<AccountDocument> findByDateRange(LocalDateTime start, LocalDateTime end);

// Query com $exists
@Query("{ 'closedAt': { $exists: true } }")
List<AccountDocument> findClosedAccounts();

@Query("{ 'closedAt': { $exists: false } }")
List<AccountDocument> findOpenAccounts();

// Query com regex para busca textual
@Query("{ 'name': { $regex: ?0, $options: 'i' } }")
List<AccountDocument> findByNameRegex(String pattern);
```

### 2.3. Queries Complexas

```java
// Query com nested objects
@Query("{ 'address.city': ?0 }")
List<AccountDocument> findByCity(String city);

// Query com array contains
@Query("{ 'tags': ?0 }")
List<AccountDocument> findByTag(String tag);

// Query com $elemMatch (busca em array de objetos)
// ⚠️ ÍNDICE NECESSÁRIO: db.accounts.createIndex({ "transactions.type": 1 })
@Query("{ 'transactions': { $elemMatch: { 'type': ?0, 'amount': { $gte: ?1 } } } }")
List<AccountDocument> findByTransactionTypeAndMinAmount(String type, BigDecimal minAmount);

// Query com aggregation operators
@Query("{ $expr: { $gt: [ '$balance', '$creditLimit' ] } }")
List<AccountDocument> findAccountsOverCreditLimit();
```

## 3. SpEL (Spring Expression Language) com @Query

### 3.1. SpEL Básico

```java
// Referência por índice com SpEL
@Query("{ 'status': ?#{[0]}, 'balance': { $gte: ?#{[1]} } }")
List<AccountDocument> findByStatusAndMinBalance(String status, BigDecimal minBalance);

// Referência por nome de parâmetro
@Query("{ 'status': ?#{#status}, 'balance': { $gte: ?#{#minBalance} } }")
List<AccountDocument> findByStatusAndMinBalance(
    @Param("status") String status, 
    @Param("minBalance") BigDecimal minBalance
);

// Expressões dentro do SpEL
@Query("{ 'createdAt': { $gte: ?#{#startDate}, $lte: ?#{#endDate} } }")
List<AccountDocument> findByDateRange(
    @Param("startDate") LocalDateTime startDate,
    @Param("endDate") LocalDateTime endDate
);
```

### 3.2. SpEL com Condicionais

```java
// Condição ternária
@Query("{ 'status': ?#{#status != null ? #status : 'ACTIVE'} }")
List<AccountDocument> findByOptionalStatus(@Param("status") String status);

// Null-safe navigation
@Query("{ 'name': ?#{#filter?.name} }")
List<AccountDocument> findByFilter(@Param("filter") AccountFilter filter);

// Múltiplas condições
@Query("""
    {
        $and: [
            ?#{#status != null ? { 'status': #status } : {} },
            ?#{#minBalance != null ? { 'balance': { $gte: #minBalance } } : {} }
        ]
    }
""")
List<AccountDocument> findByDynamicFilter(
    @Param("status") String status,
    @Param("minBalance") BigDecimal minBalance
);
```

### 3.3. SpEL com Listas e Collections

```java
// Verificar se lista não está vazia
@Query("{ 'status': { $in: ?#{#statuses.isEmpty() ? ['ACTIVE'] : #statuses} } }")
List<AccountDocument> findByStatuses(@Param("statuses") List<String> statuses);

// Transformação de lista
@Query("{ 'tags': { $all: ?#{#tags} } }")
List<AccountDocument> findByAllTags(@Param("tags") List<String> tags);
```

### 3.4. SpEL com Segurança (Principal)

```java
// Usar informações do usuário logado
@Query("{ 'userId': ?#{principal.username} }")
List<AccountDocument> findCurrentUserAccounts();

// Com Spring Security
@Query("{ 'userId': ?#{authentication.name} }")
List<AccountDocument> findAuthenticatedUserAccounts();
```

## 4. Projeções com @Query

### 4.1. Projeção de Campos Específicos

```java
// Incluir apenas campos específicos
@Query(value = "{ 'status': ?0 }", fields = "{ 'accountNumber': 1, 'name': 1, 'balance': 1 }")
List<AccountDocument> findAccountSummaryByStatus(String status);

// Excluir campos específicos
@Query(value = "{ 'status': ?0 }", fields = "{ 'internalNotes': 0, 'auditLog': 0 }")
List<AccountDocument> findByStatusWithoutSensitiveData(String status);

// Projeção com nested fields
@Query(value = "{}", fields = "{ 'accountNumber': 1, 'address.city': 1, 'address.state': 1 }")
List<AccountDocument> findAllAddressSummary();
```

### 4.2. Projeções com Interface

```java
// Interface de projeção
public interface AccountSummary {
    String getAccountNumber();
    String getName();
    BigDecimal getBalance();
}

// Repository com projeção
public interface AccountRepository extends MongoRepository<AccountDocument, String> {
    
    @Query("{ 'status': ?0 }")
    List<AccountSummary> findSummaryByStatus(String status);
}
```

## 5. Ordenação e Paginação com @Query

### 5.1. Ordenação Estática

```java
// Ordenação no JSON
@Query(value = "{ 'status': ?0 }", sort = "{ 'balance': -1, 'createdAt': -1 }")
List<AccountDocument> findByStatusOrderedByBalance(String status);
```

### 5.2. Ordenação Dinâmica

```java
// Aceitar Sort como parâmetro
// ⚠️ ÍNDICE NECESSÁRIO: db.accounts.createIndex({ "status": 1, "balance": -1 })
@Query("{ 'status': ?0 }")
List<AccountDocument> findByStatus(String status, Sort sort);

// Uso:
Sort sort = Sort.by(Sort.Direction.DESC, "balance")
               .and(Sort.by(Sort.Direction.ASC, "name"));
List<AccountDocument> accounts = repository.findByStatus("ACTIVE", sort);
```

### 5.3. Paginação

```java
// Query com paginação
// ⚠️ ÍNDICE NECESSÁRIO: db.accounts.createIndex({ "status": 1, "balance": -1 })
@Query("{ 'status': ?0 }")
Page<AccountDocument> findByStatus(String status, Pageable pageable);

// Uso:
Pageable pageable = PageRequest.of(0, 20, Sort.by("balance").descending());
Page<AccountDocument> page = repository.findByStatus("ACTIVE", pageable);
```

## 6. Delete e Update com @Query

### 6.1. Delete Queries

```java
// Delete simples
@Query(value = "{ 'status': ?0 }", delete = true)
void deleteByStatus(String status);

// Delete com múltiplos critérios
@Query(value = "{ 'status': ?0, 'balance': 0 }", delete = true)
long deleteClosedAccountsWithZeroBalance(String status);
```

### 6.2. Update Queries (Não suportado diretamente)

⚠️ **Spring Data MongoDB não suporta @Query para updates. Use MongoTemplate:**

```java
@Component
public class AccountRepositoryCustom {
    
    private final MongoTemplate mongoTemplate;
    
    public void updateAccountStatus(String accountId, String newStatus) {
        Query query = Query.query(Criteria.where("_id").is(accountId));
        Update update = Update.update("status", newStatus)
                              .set("updatedAt", LocalDateTime.now());
        
        mongoTemplate.updateFirst(query, update, AccountDocument.class);
    }
}
```

## 7. Count e Exists com @Query

```java
// Count com query
@Query(value = "{ 'status': ?0, 'balance': { $gte: ?1 } }", count = true)
long countByStatusAndMinBalance(String status, BigDecimal minBalance);

// Exists com query
@Query(value = "{ 'accountNumber': ?0 }", exists = true)
boolean existsByAccountNumber(String accountNumber);
```

## 8. Queries com Text Search

### 8.1. Configurar Índice de Texto

```java
@Document(collection = "accounts")
@TextIndexed
public class AccountDocument {
    
    @Id
    private String id;
    
    @TextIndexed(weight = 2.0f) // Peso maior para nome
    private String name;
    
    @TextIndexed
    private String description;
}
```

### 8.2. Text Search Query

```java
// Full-text search
// ⚠️ ÍNDICE NECESSÁRIO: db.accounts.createIndex({ "name": "text", "description": "text" })
@Query("{ $text: { $search: ?0 } }")
List<AccountDocument> searchByText(String searchText);

// Text search com score
@Query(value = "{ $text: { $search: ?0 } }", 
       fields = "{ score: { $meta: 'textScore' } }",
       sort = "{ score: { $meta: 'textScore' } }")
List<AccountDocument> searchByTextOrderedByScore(String searchText);
```

## 9. Exemplos Práticos Completos

### 9.1. Busca Avançada de Contas

```java
public interface AccountRepository extends MongoRepository<AccountDocument, String> {
    
    /**
     * Busca contas ativas com saldo mínimo e tipo específico
     * ⚠️ ÍNDICE NECESSÁRIO: db.accounts.createIndex({ "status": 1, "type": 1, "balance": 1 })
     */
    @Query("""
        {
            $and: [
                { 'status': 'ACTIVE' },
                { 'type': ?0 },
                { 'balance': { $gte: ?1 } }
            ]
        }
    """)
    List<AccountDocument> findActiveAccountsByTypeAndMinBalance(
        String type, 
        BigDecimal minBalance,
        Pageable pageable
    );
    
    /**
     * Busca contas criadas em período com filtros opcionais
     * ⚠️ ÍNDICE NECESSÁRIO: db.accounts.createIndex({ "createdAt": -1, "status": 1 })
     */
    @Query("""
        {
            $and: [
                { 'createdAt': { $gte: ?#{#startDate}, $lte: ?#{#endDate} } },
                ?#{#status != null ? { 'status': #status } : {} },
                ?#{#minBalance != null ? { 'balance': { $gte: #minBalance } } : {} }
            ]
        }
    """)
    List<AccountDocument> findByDateRangeWithOptionalFilters(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("status") String status,
        @Param("minBalance") BigDecimal minBalance
    );
    
    /**
     * Busca contas VIP (saldo alto) com transações recentes
     * ⚠️ ÍNDICE NECESSÁRIO: db.accounts.createIndex({ "balance": -1, "lastTransactionAt": -1 })
     */
    @Query("""
        {
            'balance': { $gte: 100000 },
            'lastTransactionAt': { $gte: ?0 }
        }
    """)
    List<AccountDocument> findVipAccountsWithRecentActivity(
        LocalDateTime since,
        Pageable pageable
    );
}
```

### 9.2. Queries de Relatório

```java
/**
 * Resumo de contas por status
 * Retorna apenas dados necessários para relatórios
 */
@Query(
    value = "{ 'status': ?0, 'createdAt': { $gte: ?1, $lte: ?2 } }",
    fields = "{ 'accountNumber': 1, 'name': 1, 'balance': 1, 'createdAt': 1 }"
)
List<AccountDocument> findAccountsForReport(
    String status,
    LocalDateTime startDate,
    LocalDateTime endDate
);

/**
 * Top 10 contas por saldo
 * ⚠️ ÍNDICE NECESSÁRIO: db.accounts.createIndex({ "status": 1, "balance": -1 })
 */
@Query(value = "{ 'status': 'ACTIVE' }", sort = "{ 'balance': -1 }")
List<AccountDocument> findTop10ByBalance(Pageable pageable);

// Uso:
List<AccountDocument> top10 = repository.findTop10ByBalance(PageRequest.of(0, 10));
```

## 10. Boas Práticas de Queries

### ✅ Faça

1. **Sempre criar índices para queries frequentes**
```java
// ⚠️ Sempre avisar sobre índices necessários
@Query("{ 'status': ?0, 'balance': { $gte: ?1 } }")
List<AccountDocument> findByStatusAndMinBalance(String status, BigDecimal minBalance);
// ÍNDICE: db.accounts.createIndex({ "status": 1, "balance": 1 })
```

2. **Use projeções para reduzir dados transferidos**
```java
// ✅ BOM: Retornar apenas campos necessários
@Query(value = "{}", fields = "{ 'accountNumber': 1, 'name': 1 }")
List<AccountDocument> findAllSummary();
```

3. **Use paginação para grandes resultados**
```java
// ✅ BOM: Paginar resultados
@Query("{ 'status': ?0 }")
Page<AccountDocument> findByStatus(String status, Pageable pageable);
```

### ❌ Não Faça

1. **Evite queries sem índices**
```java
// ❌ RUIM: Query em campo sem índice
@Query("{ 'description': { $regex: ?0 } }")
List<AccountDocument> findByDescription(String pattern);
```

2. **Evite fetch de todos os documentos**
```java
// ❌ RUIM: Retornar todos os registros
List<AccountDocument> findAll();

// ✅ BOM: Limitar ou paginar
Page<AccountDocument> findAll(Pageable pageable);
```

3. **Evite queries complexas no código**
```java
// ❌ RUIM: Query muito complexa em anotação
@Query("""
    {
        $and: [
            { $or: [...] },
            { $expr: {...} },
            // ... muita lógica ...
        ]
    }
""")

// ✅ BOM: Usar MongoTemplate para queries complexas
```

## 11. Checklist de Query Methods

Antes de criar uma query com @Query:

- [ ] Tentei usar query method derivada (findBy...)?
- [ ] Identifiquei índices necessários?
- [ ] Documentei índices no código?
- [ ] Usei projeção se não preciso de todos os campos?
- [ ] Adicionei paginação se resultado pode ser grande?
- [ ] Testei a query no MongoDB shell primeiro?
- [ ] Verifiquei explain plan da query?

## Recursos

- [Query Methods - Spring Data MongoDB](https://docs.spring.io/spring-data/mongodb/reference/repositories/query-methods-details.html)
- [JSON/SpEL Queries](https://docs.spring.io/spring-data/mongodb/reference/mongodb/repositories/query-methods.html#mongodb.repositories.queries.json-spel)
- [MongoDB Query Operators](https://www.mongodb.com/docs/manual/reference/operator/query/)
