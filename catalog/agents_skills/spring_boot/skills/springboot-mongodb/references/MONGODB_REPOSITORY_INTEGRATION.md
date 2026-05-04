# MongoDB Repository - Arquitetura Hexagonal

Este documento demonstra como implementar **MongoDB Repository** seguindo arquitetura hexagonal, com persistência de dados usando Spring Data MongoDB.

## 1. Estrutura do Projeto

```
com.empresa.contacorrente/
├── core/
│   ├── domain/model/
│   │   └── Account.java
│   └── usecase/
│       ├── CreateAccountUseCase.java
│       └── FindAccountUseCase.java
├── port/
│   ├── input/
│   │   ├── CreateAccountInputPort.java
│   │   └── FindAccountInputPort.java
│   └── output/
│       └── AccountPersistencePort.java
└── adapter/
    ├── input/
    │   └── controller/
    │       ├── AccountController.java
    │       └── dto/
    │           ├── request/
    │           │   └── CreateAccountRequest.java
    │           └── response/
    │               └── AccountResponse.java
    └── output/
        ├── mongodb/
        │   ├── repository/
        │   │   ├── AccountRepositoryAdapter.java
        │   │   └── AccountMongoRepository.java
        │   ├── entity/
        │   │   └── AccountDocument.java
        │   └── mapper/
        │       └── AccountDocumentMapper.java
        └── config/
            └── MongoConfig.java
```

## 2. Domain Model

```java
package com.empresa.contacorrente.core.domain.model;

/**
 * Entidade de domínio - SEM anotações externas (MongoDB, JPA, etc)
 * Representa o conceito puro de Conta no domínio
 */
public class Account {
    private String id;
    private String accountNumber;
    private String name;
    private String cpf;
    private BigDecimal balance;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Account(String id, String accountNumber, String name, String cpf, 
                   BigDecimal balance, String status, LocalDateTime createdAt) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.name = name;
        this.cpf = cpf;
        this.balance = balance;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Business methods
    public void credit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        this.balance = this.balance.add(amount);
        this.updatedAt = LocalDateTime.now();
    }
    
    public void debit(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (this.balance.compareTo(amount) < 0) {
            throw new IllegalStateException("Insufficient balance");
        }
        this.balance = this.balance.subtract(amount);
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isActive() {
        return "ACTIVE".equals(this.status);
    }
    
    // Getters
    public String getId() { return id; }
    public String getAccountNumber() { return accountNumber; }
    public String getName() { return name; }
    public String getCpf() { return cpf; }
    public BigDecimal getBalance() { return balance; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
```

## 3. Ports

### Output Port (Persistência)

```java
package com.empresa.contacorrente.port.output;

/**
 * Contrato de saída - define operações de persistência
 * Interface em linguagem de domínio (não menciona MongoDB)
 */
public interface AccountPersistencePort {
    
    /**
     * Salva ou atualiza uma conta
     * @param account Conta a ser persistida
     * @return Conta persistida
     */
    Account save(Account account);
    
    /**
     * Busca conta por ID
     * @param id ID da conta
     * @return Optional com conta encontrada
     */
    Optional<Account> findById(String id);
    
    /**
     * Busca conta por número
     * @param accountNumber Número da conta
     * @return Optional com conta encontrada
     */
    Optional<Account> findByAccountNumber(String accountNumber);
    
    /**
     * Busca todas as contas por CPF
     * @param cpf CPF do titular
     * @return Lista de contas
     */
    List<Account> findByCpf(String cpf);
    
    /**
     * Busca contas ativas com saldo mínimo
     * @param minBalance Saldo mínimo
     * @return Lista de contas
     */
    List<Account> findActiveAccountsWithMinimumBalance(BigDecimal minBalance);
    
    /**
     * Verifica se existe conta com número específico
     * @param accountNumber Número da conta
     * @return true se existe
     */
    boolean existsByAccountNumber(String accountNumber);
    
    /**
     * Deleta conta por ID
     * @param id ID da conta
     */
    void deleteById(String id);
}
```

### Input Port

```java
package com.empresa.contacorrente.port.input;

import com.empresa.contacorrente.core.domain.model.Account;

/**
 * Contrato de entrada - define caso de uso
 */
public interface CreateAccountInputPort {
    Account execute(String name, String cpf, BigDecimal initialBalance);
}
```

## 4. UseCase

```java
package com.empresa.contacorrente.core.usecase;

/**
 * UseCase - implementa regra de negócio
 * NÃO conhece detalhes de infraestrutura (MongoDB)
 */
public class CreateAccountUseCase implements CreateAccountInputPort {
    
    private final AccountPersistencePort accountPersistencePort;
    
    public CreateAccountUseCase(AccountPersistencePort accountPersistencePort) {
        this.accountPersistencePort = accountPersistencePort;
    }
    
    @Override
    public Account execute(String name, String cpf, BigDecimal initialBalance) {
        // 1. Validações de negócio
        validateName(name);
        validateCpf(cpf);
        validateInitialBalance(initialBalance);
        
        // 2. Verificar se já existe conta
        String accountNumber = generateAccountNumber();
        while (accountPersistencePort.existsByAccountNumber(accountNumber)) {
            accountNumber = generateAccountNumber();
        }
        
        // 3. Criar entidade de domínio
        Account account = new Account(
            UUID.randomUUID().toString(),
            accountNumber,
            name,
            cpf,
            initialBalance,
            "ACTIVE",
            LocalDateTime.now()
        );
        
        // 4. Persistir (via OutputPort)
        return accountPersistencePort.save(account);
    }
}
```

## 5. Adapter Layer - MongoDB

### MongoDB Document (Entity)

```java
package com.empresa.contacorrente.adapter.output.mongodb.entity;

/**
 * Documento MongoDB - COM anotações específicas do MongoDB
 * Representa como os dados são armazenados no banco
 */
@Document(collection = "accounts")
@CompoundIndex(name = "status_balance_idx", def = "{'status': 1, 'balance': -1}")
@CompoundIndex(name = "cpf_status_idx", def = "{'cpf': 1, 'status': 1}")
public class AccountDocument {
    
    @Id
    private String id;
    
    @Field("account_number")
    @Indexed(unique = true)
    private String accountNumber;
    
    @Field("name")
    private String name;
    
    @Field("cpf")
    @Indexed
    private String cpf;
    
    @Field("balance")
    private BigDecimal balance;
    
    @Field("status")
    @Indexed
    private String status;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    // Construtores
    public AccountDocument() {
    }
    
    public AccountDocument(String id, String accountNumber, String name, String cpf,
                          BigDecimal balance, String status, LocalDateTime createdAt,
                          LocalDateTime updatedAt) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.name = name;
        this.cpf = cpf;
        this.balance = balance;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
```

### MongoDB Repository Interface

```java
package com.empresa.contacorrente.adapter.output.mongodb.repository;

/**
 * Repository MongoDB - interface Spring Data
 */
@Repository
public interface AccountMongoRepository extends MongoRepository<AccountDocument, String> {
    
    // Query method derivada do nome
    Optional<AccountDocument> findByAccountNumber(String accountNumber);
    
    // Query method derivada do nome
    List<AccountDocument> findByCpf(String cpf);
    
    // Query method derivada do nome
    boolean existsByAccountNumber(String accountNumber);
    
    // Query customizada com @Query (JSON MongoDB)
    // ⚠️ ÍNDICE NECESSÁRIO: db.accounts.createIndex({ "status": 1, "balance": 1 })
    @Query("{ 'status': ?0, 'balance': { $gte: ?1 } }")
    List<AccountDocument> findByStatusAndMinBalance(String status, BigDecimal minBalance);
    
    // Query com projeção (retorna apenas campos específicos)
    @Query(value = "{ 'cpf': ?0 }", fields = "{ 'account_number': 1, 'name': 1, 'balance': 1 }")
    List<AccountDocument> findAccountSummaryByCpf(String cpf);
}
```

### Mapper (Document <-> Domain) com MapStruct

**Mapper com MapStruct:**
```java
package com.empresa.contacorrente.adapter.output.mongodb.mapper;

/**
 * Mapper entre Domain Model e Document MongoDB usando MapStruct
 * Traduz entre a linguagem do domínio e a estrutura do banco
 * 
 * MapStruct gera implementação em tempo de compilação
 */
@Mapper(componentModel = "spring")
public interface AccountDocumentMapper {
    
    AccountDocumentMapper INSTANCE = Mappers.getMapper(AccountDocumentMapper.class);
    
    /**
     * Converte Domain Model -> MongoDB Document
     * MapStruct mapeia automaticamente campos com mesmo nome
     */
    AccountDocument toDocument(Account account);
    
    /**
     * Converte MongoDB Document -> Domain Model
     * 
     * Ignora updatedAt no mapeamento pois Account recalcula no construtor
     */
    @Mapping(target = "updatedAt", ignore = true)
    Account toDomain(AccountDocument document);
}
```

### Repository Adapter (Implementa Output Port)

```java
package com.empresa.contacorrente.adapter.output.mongodb.repository;

/**
 * Adapter que implementa o OutputPort usando MongoDB
 * Traduz operações de domínio em operações MongoDB
 */
@Component
public class AccountRepositoryAdapter implements AccountPersistencePort {
    
    private final AccountMongoRepository mongoRepository;
    private final AccountDocumentMapper mapper;
    
    public AccountRepositoryAdapter(AccountMongoRepository mongoRepository,
                                   AccountDocumentMapper mapper) {
        this.mongoRepository = mongoRepository;
        this.mapper = mapper;
    }
    
    @Override
    public Account save(Account account) {
        AccountDocument document = mapper.toDocument(account);
        AccountDocument saved = mongoRepository.save(document);
        return mapper.toDomain(saved);
    }
    
    // resto da implementação...
}
```

## 6. Resumo do Fluxo

```
1. Controller recebe request HTTP
   ↓
2. Controller chama InputPort (UseCase)
   ↓
3. UseCase executa lógica de negócio
   ↓
4. UseCase chama OutputPort (interface)
   ↓
5. RepositoryAdapter implementa OutputPort
   ↓
6. RepositoryAdapter usa Mapper para converter Domain → Document
   ↓
7. RepositoryAdapter usa MongoRepository para persistir
   ↓
8. MongoRepository persiste no MongoDB
   ↓
9. Dados retornam: Document → Domain → Response
```
