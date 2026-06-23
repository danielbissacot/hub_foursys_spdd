# Paginação Eficiente no MongoDB

Este documento cobre estratégias de paginação eficiente com Spring Data MongoDB.

## 1. Tipos de Paginação

### 1.1. Offset-based Pagination (Tradicional)

✅ **Vantagens:**
- Fácil de implementar
- Permite navegar para qualquer página
- Interface familiar (página 1, 2, 3...)

❌ **Desvantagens:**
- Performance degrada com offset alto
- Skip é operação custosa no MongoDB
- Resultados inconsistentes se dados mudarem

### 1.2. Cursor-based Pagination (Recomendado)

✅ **Vantagens:**
- Performance constante independente da posição
- Consistente mesmo com mudanças nos dados
- Ideal para infinite scroll

❌ **Desvantagens:**
- Não permite pular para página específica
- Requer campo único e ordenado (geralmente _id)

## 2. Offset-based Pagination

### 2.1. Com MongoRepository

```java
public interface AccountRepository extends MongoRepository<AccountDocument, String> {
    
    // Paginação básica
    // ⚠️ ÍNDICE: db.accounts.createIndex({ "status": 1, "createdAt": -1 })
    Page<AccountDocument> findByStatus(String status, Pageable pageable);
    
    // Paginação com ordenação customizada
    Page<AccountDocument> findByStatusAndBalanceGreaterThan(
        String status, 
        BigDecimal minBalance,
        Pageable pageable
    );
}
```

### 2.2. Uso Básico

```java
@Service
public class AccountService {
    
    private final AccountRepository accountRepository;
    
    /**
     * Busca paginada básica
     */
    public Page<AccountDTO> getAccounts(int page, int size) {
        // Criar Pageable
        Pageable pageable = PageRequest.of(page, size);
        
        // Buscar
        Page<AccountDocument> accountPage = accountRepository.findAll(pageable);
        
        // Converter para DTO
        return accountPage.map(this::toDTO);
    }
    
    /**
     * Busca paginada com ordenação
     */
    public Page<AccountDTO> getAccountsSorted(int page, int size, String sortBy, String direction) {
        // Sort
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;
        
        Sort sort = Sort.by(sortDirection, sortBy);
        
        // Pageable com sort
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return accountRepository.findAll(pageable)
            .map(this::toDTO);
    }
    
    /**
     * Busca paginada com múltiplas ordenações
     */
    public Page<AccountDTO> getAccountsMultiSort(int page, int size) {
        // Sort por múltiplos campos
        Sort sort = Sort.by(Sort.Direction.DESC, "balance")
                       .and(Sort.by(Sort.Direction.ASC, "name"));
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return accountRepository.findByStatus("ACTIVE", pageable)
            .map(this::toDTO);
    }
}
```

### 2.3. REST Controller com Paginação

```java
@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {
    
    private final AccountService accountService;
    
    /**
     * Endpoint com paginação
     * GET /api/v1/accounts?page=0&size=20&sort=balance,desc
     */
    @GetMapping
    public ResponseEntity<PageResponse<AccountDTO>> getAccounts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String direction
    ) {
        Page<AccountDTO> accountPage = accountService.getAccountsSorted(
            page, size, sortBy, direction
        );
        
        PageResponse<AccountDTO> response = new PageResponse<>(
            accountPage.getContent(),
            accountPage.getNumber(),
            accountPage.getSize(),
            accountPage.getTotalElements(),
            accountPage.getTotalPages(),
            accountPage.isFirst(),
            accountPage.isLast()
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint com Pageable automático do Spring
     */
    @GetMapping("/auto")
    public ResponseEntity<Page<AccountDTO>> getAccountsAuto(
        @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) 
        Pageable pageable
    ) {
        Page<AccountDTO> accountPage = accountService.getAccounts(
            pageable.getPageNumber(),
            pageable.getPageSize()
        );
        
        return ResponseEntity.ok(accountPage);
    }
}

/**
 * DTO de resposta paginada
 */
public record PageResponse<T>(
    List<T> content,
    int currentPage,
    int pageSize,
    long totalElements,
    int totalPages,
    boolean first,
    boolean last
) {}
```

### 2.4. Performance de Offset

⚠️ **Problema com offset alto:**

```java
// ❌ RUIM: Performance degrada com páginas altas
// Página 1: skip(0)  -> Rápido ✅
// Página 100: skip(2000) -> Lento ⚠️
// Página 1000: skip(20000) -> Muito lento ❌

Pageable pageable = PageRequest.of(1000, 20); // Skip 20.000!
Page<AccountDocument> page = accountRepository.findAll(pageable);

// MongoDB precisa escanear 20.000 documentos para chegar na página 1000
```

## 3. Cursor-based Pagination (Recomendado)

### 3.1. Implementação com Repository

```java
public interface AccountRepository extends MongoRepository<AccountDocument, String> {
    
    /**
     * Cursor-based pagination
     * Busca registros após um ID específico
     * ⚠️ ÍNDICE: db.accounts.createIndex({ "_id": 1, "status": 1 })
     */
    @Query("{ '_id': { $gt: ?0 }, 'status': ?1 }")
    List<AccountDocument> findByStatusAfterCursor(
        String lastId,
        String status,
        Pageable pageable
    );
    
    /**
     * Com ordenação por outro campo (ex: createdAt)
     * ⚠️ ÍNDICE: db.accounts.createIndex({ "createdAt": -1, "_id": -1 })
     */
    @Query("{ 'createdAt': { $lt: ?0 }, 'status': ?1 }")
    List<AccountDocument> findByStatusBeforeDate(
        LocalDateTime lastDate,
        String status,
        Pageable pageable
    );
}
```

### 3.2. Service com Cursor Pagination

```java
@Service
public class AccountCursorService {
    
    private final AccountRepository accountRepository;
    
    /**
     * Busca primeira página
     */
    public CursorPage<AccountDTO> getFirstPage(String status, int pageSize) {
        Pageable pageable = PageRequest.of(0, pageSize, Sort.by("_id").ascending());
        
        List<AccountDocument> accounts = accountRepository.findByStatus(status, pageable)
            .getContent();
        
        List<AccountDTO> dtos = accounts.stream()
            .map(this::toDTO)
            .toList();
        
        String nextCursor = accounts.isEmpty() 
            ? null 
            : accounts.get(accounts.size() - 1).getId();
        
        boolean hasNext = accounts.size() == pageSize;
        
        return new CursorPage<>(dtos, nextCursor, hasNext);
    }
    
    /**
     * Busca próxima página usando cursor
     */
    public CursorPage<AccountDTO> getNextPage(
        String status, 
        String cursor, 
        int pageSize
    ) {
        Pageable pageable = PageRequest.of(0, pageSize);
        
        List<AccountDocument> accounts = accountRepository.findByStatusAfterCursor(
            cursor,
            status,
            pageable
        );
        
        List<AccountDTO> dtos = accounts.stream()
            .map(this::toDTO)
            .toList();
        
        String nextCursor = accounts.isEmpty() 
            ? null 
            : accounts.get(accounts.size() - 1).getId();
        
        boolean hasNext = accounts.size() == pageSize;
        
        return new CursorPage<>(dtos, nextCursor, hasNext);
    }
}

/**
 * Resposta com cursor
 */
public record CursorPage<T>(
    List<T> content,
    String nextCursor,
    boolean hasNext
) {}
```

### 3.3. REST Controller com Cursor

```java
@RestController
@RequestMapping("/api/v1/accounts")
public class AccountCursorController {
    
    private final AccountCursorService cursorService;
    
    /**
     * Endpoint com cursor pagination
     * GET /api/v1/accounts/cursor?status=ACTIVE&cursor=abc123&size=20
     */
    @GetMapping("/cursor")
    public ResponseEntity<CursorPage<AccountDTO>> getAccountsCursor(
        @RequestParam(required = false) String cursor,
        @RequestParam(defaultValue = "ACTIVE") String status,
        @RequestParam(defaultValue = "20") int size
    ) {
        CursorPage<AccountDTO> page;
        
        if (cursor == null || cursor.isBlank()) {
            // Primeira página
            page = cursorService.getFirstPage(status, size);
        } else {
            // Próximas páginas
            page = cursorService.getNextPage(status, cursor, size);
        }
        
        return ResponseEntity.ok(page);
    }
}
```

## 4. Cursor Pagination com MongoTemplate

```java
@Component
public class AccountCursorRepository {
    
    private final MongoTemplate mongoTemplate;
    
    /**
     * Cursor pagination com query complexa
     * ⚠️ ÍNDICE: db.accounts.createIndex({ "status": 1, "balance": -1, "_id": 1 })
     */
    public CursorPage<AccountDocument> findByStatusAndBalanceWithCursor(
        String status,
        BigDecimal minBalance,
        String lastId,
        BigDecimal lastBalance,
        int pageSize
    ) {
        Criteria criteria = Criteria.where("status").is(status)
                                   .and("balance").gte(minBalance);
        
        // Cursor condition: (balance < lastBalance) OR (balance = lastBalance AND _id > lastId)
        if (lastId != null && lastBalance != null) {
            criteria.orOperator(
                Criteria.where("balance").lt(lastBalance),
                new Criteria().andOperator(
                    Criteria.where("balance").is(lastBalance),
                    Criteria.where("_id").gt(lastId)
                )
            );
        }
        
        Query query = Query.query(criteria)
                          .with(Sort.by(Sort.Direction.DESC, "balance")
                                   .and(Sort.by(Sort.Direction.ASC, "_id")))
                          .limit(pageSize);
        
        List<AccountDocument> accounts = mongoTemplate.find(query, AccountDocument.class);
        
        boolean hasNext = accounts.size() == pageSize;
        String nextCursor = accounts.isEmpty() 
            ? null 
            : accounts.get(accounts.size() - 1).getId();
        
        return new CursorPage<>(accounts, nextCursor, hasNext);
    }
}
```

## 5. Boas Práticas de Paginação

### ✅ Faça

```java
// ✅ Limite máximo de pageSize
@GetMapping
public Page<AccountDTO> getAccounts(
    @RequestParam(defaultValue = "20") int size
) {
    // Proteger contra requests muito grandes
    int safeSize = Math.min(size, 100);
    
    Pageable pageable = PageRequest.of(0, safeSize);
    return accountService.getAccounts(pageable);
}

// ✅ Use cursor para infinite scroll
@GetMapping("/feed")
public CursorPage<AccountDTO> getFeed(
    @RequestParam(required = false) String cursor,
    @RequestParam(defaultValue = "20") int size
) {
    return accountService.getCursorPage(cursor, size);
}

// ✅ Cache página 1 (mais acessada)
@Cacheable(value = "accounts-page1", key = "#status")
public Page<AccountDTO> getFirstPage(String status) {
    Pageable pageable = PageRequest.of(0, 20);
    return accountRepository.findByStatus(status, pageable)
        .map(this::toDTO);
}

// ✅ Índices para ordenação
// db.accounts.createIndex({ "status": 1, "createdAt": -1 })
@Query("{ 'status': ?0 }")
Page<AccountDocument> findByStatus(
    String status,
    Pageable pageable // Sort: createdAt DESC
);
```

### ❌ Não Faça

```java
// ❌ Permitir pageSize ilimitado
@GetMapping
public Page<AccountDTO> getAccounts(@RequestParam int size) {
    // Usuário pode passar size=1000000 !
    return accountService.getAccounts(PageRequest.of(0, size));
}

// ❌ Offset alto sem aviso
Pageable pageable = PageRequest.of(5000, 20); // Skip 100.000!

// ❌ Ordenação por campo sem índice
// Sem índice em "name"
Sort sort = Sort.by("name"); // Muito lento!

// ❌ Count() em toda paginação
@GetMapping
public Page<AccountDTO> getAccounts(Pageable pageable) {
    // Page.getTotalElements() faz count() toda vez!
    // Para 10 milhões de registros, count() é custoso
    return accountRepository.findAll(pageable);
}

// ✅ Use Slice se não precisa do total
@GetMapping
public Slice<AccountDTO> getAccounts(Pageable pageable) {
    // Slice não faz count()
    Slice<AccountDocument> slice = accountRepository.findAllBy(pageable);
    return slice.map(this::toDTO);
}
```

## 7. Slice vs Page

### 7.1. Page (com count)

```java
// Page: Retorna total de registros
Page<AccountDocument> page = accountRepository.findAll(pageable);

page.getTotalElements(); // Faz count() -> Custoso!
page.getTotalPages();    // Calcula total de páginas
page.hasNext();          // true se tem próxima
```

### 7.2. Slice (sem count)

```java
// Slice: Não faz count() - mais rápido!
Slice<AccountDocument> slice = accountRepository.findAllBy(pageable);

// slice.getTotalElements(); // ❌ Não existe!
// slice.getTotalPages();    // ❌ Não existe!
slice.hasNext();             // ✅ true se tem próxima (busca 1 a mais)
```

**Use Slice quando:**
- Não precisa mostrar total de páginas
- Infinite scroll
- Performance é crítica

## 8. Estratégias por Caso de Uso

| Caso de Uso | Estratégia Recomendada |
|-------------|----------------------|
| **Lista de admin** (paginação tradicional) | Offset-based com Page |
| **Infinite scroll** (feed, timeline) | Cursor-based |
| **Exportação** (todos os dados) | Stream ou batch |
| **API pública** (limite de taxa) | Cursor com rate limiting |
| **Busca com filtros** | Offset limitado (max 100 páginas) |
| **Relatórios** | Agregação + limit |

## 9. Paginação com Stream (Para grandes volumes)

```java
/**
 * Stream para processar grandes volumes sem carregar tudo na memória
 * ⚠️ ÍNDICE: db.accounts.createIndex({ "status": 1 })
 */
@Component
public class AccountStreamProcessor {
    
    private final AccountRepository accountRepository;
    
    /**
     * Processar milhões de registros em lotes
     */
    @Transactional(readOnly = true)
    public void processAllAccounts() {
        try (Stream<AccountDocument> stream = accountRepository.streamByStatus("ACTIVE")) {
            stream.forEach(account -> {
                // Processar cada conta
                processAccount(account);
            });
        }
    }
    
    /**
     * Repository com stream
     */
    public interface AccountRepository extends MongoRepository<AccountDocument, String> {
        
        @Query("{ 'status': ?0 }")
        Stream<AccountDocument> streamByStatus(String status);
    }
}
```

## 10. Checklist de Paginação

Antes de implementar paginação:

- [ ] Identifiquei o caso de uso?
- [ ] Temos índices para campos de ordenação?
- [ ] Defini limite máximo de pageSize?
- [ ] Preciso de totalElements? (Page vs Slice)
- [ ] Para offset > 100 páginas, considerei cursor?
- [ ] Testei performance com dados reais?
- [ ] Documentei índices necessários?

## Resumo

| | Offset | Cursor |
|---|---|---|
| **Performance** | Degrada com páginas altas | Constante |
| **Implementação** | Fácil | Média |
| **Navegação** | Qualquer página | Apenas próxima |
| **Use quando** | Lista com poucas páginas | Infinite scroll, muitos dados |
| **Índice** | Campo de sort | Campo de cursor + sort |

**Recomendação geral:**
- **Offset-based** para < 100 páginas com navegação tradicional
- **Cursor-based** para infinite scroll ou > 100 páginas
- **Slice** quando não precisar de count total
- **Stream** para processar grandes volumes

🎯 **Lembre-se**: Sempre crie índices apropriados! Sem índices, qualquer estratégia será lenta.
