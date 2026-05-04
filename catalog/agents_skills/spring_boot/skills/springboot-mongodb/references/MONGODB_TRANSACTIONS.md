# MongoDB Transactions - Configuração e Boas Práticas

Este documento cobre configuração e uso de transações MongoDB no Spring Boot com boas práticas.

## Pré-requisitos para Transações

⚠️ **Requisitos MongoDB:**
- MongoDB **4.0+** para transações em replica sets
- MongoDB **4.2+** para transações em sharded clusters
- **Não funciona** em standalone instances (desenvolvimento local)

## 1. Configuração Básica

### 1.1. Configurar MongoTransactionManager

```java
package com.empresa.config;

/**
 * Configuração de transações MongoDB
 */
@Configuration
@EnableTransactionManagement
@EnableMongoRepositories(basePackages = "com.empresa.adapter.output.mongodb")
@EnableMongoAuditing
public class MongoTransactionConfig {
    
    /**
     * Bean obrigatório para suportar @Transactional
     */
    @Bean
    public MongoTransactionManager transactionManager(MongoDatabaseFactory dbFactory) {
        return new MongoTransactionManager(dbFactory);
    }
}
```

## 2. Uso Básico de Transações

### 2.1. Com @Transactional (Recomendado)

```java
package com.empresa.core.usecase;

/**
 * UseCase com transação
 * Todas as operações dentro do método são executadas na mesma transação
 */
public class TransferFundsUseCase {
    
    private final AccountPersistencePort accountPort;
    private final TransactionPersistencePort transactionPort;
    
    public TransferFundsUseCase(AccountPersistencePort accountPort,
                               TransactionPersistencePort transactionPort) {
        this.accountPort = accountPort;
        this.transactionPort = transactionPort;
    }
    
    /**
     * Transferência com transação automática
     * Se qualquer operação falhar, todas são revertidas
     */
    @Transactional
    public Transaction transfer(String fromAccountId, String toAccountId, BigDecimal amount) {
        // 1. Validações
        validateAmount(amount);
        
        // 2. Buscar contas
        Account fromAccount = accountPort.findById(fromAccountId)
            .orElseThrow(() -> new IllegalArgumentException("Conta origem não encontrada"));
        
        Account toAccount = accountPort.findById(toAccountId)
            .orElseThrow(() -> new IllegalArgumentException("Conta destino não encontrada"));
        
        // 3. Validar saldo
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new IllegalStateException("Saldo insuficiente");
        }
        
        // 4. Debitar origem (dentro da transação)
        fromAccount.debit(amount);
        accountPort.save(fromAccount);
        
        // 5. Creditar destino (dentro da transação)
        toAccount.credit(amount);
        accountPort.save(toAccount);
        
        // 6. Registrar histórico (dentro da transação)
        Transaction transaction = new Transaction(
            UUID.randomUUID().toString(),
            fromAccountId,
            toAccountId,
            amount,
            "TRANSFER",
            LocalDateTime.now()
        );
        transactionPort.save(transaction);
        
        // Se chegar aqui sem exceção: COMMIT
        // Se lançar exceção: ROLLBACK automático
        return transaction;
    }
    
    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor inválido");
        }
    }
}
```

### 2.2. Configuração @Transactional

```java
// Timeout de 30 segundos
@Transactional(timeout = 30)
public void operation() { }

// Apenas leitura (otimização)
@Transactional(readOnly = true)
public List<Account> findAll() { }

// Rollback em exceções específicas
@Transactional(rollbackFor = BusinessException.class)
public void operation() { }

// Não fazer rollback em exceções específicas
@Transactional(noRollbackFor = ValidationException.class)
public void operation() { }
```

## 3. Boas Práticas de Transações

### ✅ 3.1. Faça

#### ✅ Use transações apenas quando necessário
```java
// ❌ NÃO precisa de transação (operação única)
@Transactional
public Account save(Account account) {
    return accountRepository.save(account);
}

// ✅ Precisa de transação (múltiplas operações que precisam ser atômicas)
@Transactional
public void transferAndNotify(String from, String to, BigDecimal amount) {
    accountRepository.debit(from, amount);
    accountRepository.credit(to, amount);
    notificationRepository.save(notification);
}
```

#### ✅ Mantenha transações curtas
```java
// ✅ BOM: Transação apenas no necessário
@Transactional
public void processPayment(PaymentRequest request) {
    // Buscar dados (pode ser fora da transação)
    Account account = accountRepository.findById(request.getAccountId());
    
    // Validações (rápido)
    validate(account, request);
    
    // Operações atômicas (dentro da transação)
    account.debit(request.getAmount());
    accountRepository.save(account);
    paymentRepository.save(payment);
}

// ❌ RUIM: Transação muito longa
@Transactional
public void processPaymentSlow(PaymentRequest request) {
    Account account = accountRepository.findById(request.getAccountId());
    
    // ❌ Chamada HTTP dentro de transação (lento!)
    ExternalResponse response = externalApi.call(request);
    
    // ❌ Processamento pesado dentro de transação
    ComplexCalculation calculation = heavyComputation(account, response);
    
    account.debit(calculation.getAmount());
    accountRepository.save(account);
}
```

#### ✅ Use readOnly=true para consultas
```java
// ✅ Otimização: informar que é apenas leitura
@Transactional(readOnly = true)
public List<Account> findAllActive() {
    return accountRepository.findByStatus("ACTIVE");
}
```

#### ✅ Defina timeout apropriado
```java
// ✅ Timeout de segurança
@Transactional(timeout = 10) // 10 segundos
public void operation() {
    // Se demorar mais de 10s, rollback automático
}
```

### ❌ 3.2. Não Faça

#### ❌ Evite chamadas externas dentro de transações
```java
// ❌ RUIM: HTTP call dentro de transação
@Transactional
public void processWithExternalCall() {
    accountRepository.save(account);
    externalApi.notify(account); // ❌ Pode ser lento!
    transactionRepository.save(transaction);
}

// ✅ BOM: Chamada externa fora da transação
@Transactional
public void processAndSaveOnly() {
    accountRepository.save(account);
    transactionRepository.save(transaction);
}

public void processComplete() {
    Account account = processAndSaveOnly();
    // Fora da transação
    externalApi.notify(account);
}
```

#### ❌ Evite transações aninhadas desnecessárias
```java
// ❌ RUIM: Transações aninhadas (pode causar problemas)
@Transactional
public void outerTransaction() {
    innerTransaction(); // ❌ Outro @Transactional
}

@Transactional
public void innerTransaction() {
    // ...
}

// ✅ BOM: Uma transação
@Transactional
public void singleTransaction() {
    operation1();
    operation2();
}

private void operation1() { }
private void operation2() { }
```

#### ❌ Não use transações em operações de leitura simples
```java
// ❌ Desnecessário para leitura única
@Transactional
public Account findById(String id) {
    return accountRepository.findById(id);
}

// ✅ Sem transação (suficiente)
public Account findById(String id) {
    return accountRepository.findById(id);
}
```

## 5. Tratamento de Erros

### 5.1. Rollback Automático

```java
@Transactional
public void operationWithAutoRollback() {
    accountRepository.save(account);
    
    // Qualquer RuntimeException causa rollback automático
    if (invalidCondition) {
        throw new IllegalStateException("Erro"); // Rollback
    }
    
    transactionRepository.save(transaction);
}
```

### 5.2. Rollback Manual

```java
@Transactional
public void operationWithManualRollback() {
    try {
        accountRepository.save(account);
        externalService.call();
    } catch (ExternalServiceException e) {
        // Log do erro
        logger.error("Erro no serviço externo", e);
        
        // Forçar rollback
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
    }
}
```

### 5.3. Exceções Checked (não causam rollback automático)

```java
// ❌ Checked exception NÃO causa rollback por padrão
@Transactional
public void operationWithCheckedException() throws Exception {
    accountRepository.save(account);
    throw new Exception("Erro"); // ❌ NÃO causa rollback!
}

// ✅ Especificar rollback para checked exceptions
@Transactional(rollbackFor = Exception.class)
public void operationWithRollbackOnChecked() throws Exception {
    accountRepository.save(account);
    throw new Exception("Erro"); // ✅ Causa rollback
}
```

## 6. Monitoramento e Debugging

### 6.1. Logs de Transação

```yaml
# application.yml
logging:
  level:
    org.springframework.data.mongodb.core: DEBUG
    org.springframework.transaction: DEBUG
```

## 7. Testes com Transações

### 7.1. Teste com rollback automático

```java
@SpringBootTest
@Transactional // Rollback automático após cada teste
class TransferUseCaseTest {
    
    @Autowired
    private TransferFundsUseCase transferUseCase;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Test
    void shouldTransferFunds() {
        // Arrange
        Account from = createAccount("123", BigDecimal.valueOf(1000));
        Account to = createAccount("456", BigDecimal.valueOf(500));
        
        // Act
        transferUseCase.transfer(from.getId(), to.getId(), BigDecimal.valueOf(100));
        
        // Assert
        Account updatedFrom = accountRepository.findById(from.getId()).orElseThrow();
        Account updatedTo = accountRepository.findById(to.getId()).orElseThrow();
        
        assertEquals(BigDecimal.valueOf(900), updatedFrom.getBalance());
        assertEquals(BigDecimal.valueOf(600), updatedTo.getBalance());
        
        // Rollback automático após teste
    }
}
```

### 7.2. Teste sem rollback (persistir dados)

```java
@SpringBootTest
class TransferUseCaseIntegrationTest {
    
    @Test
    @Commit // Não fazer rollback
    void shouldPersistTransfer() {
        // Dados serão persistidos no banco
    }
}
```

## 8. Performance e Escalabilidade

### 8.1. Impacto de Transações

⚠️ **Transações têm custo:**
- Bloqueiam documentos (write locks)
- Aumentam latência
- Reduzem throughput
- Consomem mais recursos

## 9. Checklist de Transações

✅ **Antes de usar @Transactional, pergunte:**

- [ ] Realmente preciso de atomicidade entre múltiplas operações?
- [ ] A transação será rápida (< 1 segundo)?
- [ ] Não há chamadas HTTP/RPC dentro da transação?
- [ ] Não há processamento pesado dentro da transação?
- [ ] MongoDB está em replica set ou cluster?
- [ ] Defini timeout apropriado?
- [ ] Tratei exceções corretamente?

## 10. Alternativas a Transações

### 10.1. Operações Atômicas MongoDB

```java
// ✅ Operação atômica nativa (sem transação)
@Query("{ $inc: { balance: ?1 } }")
void incrementBalance(String accountId, BigDecimal amount);
```

## Resumo

| Cenário | Use Transação? | Alternativa |
|---------|----------------|-------------|
| Operação única | ❌ Não | Operação simples |
| Múltiplas operações atômicas | ✅ Sim | @Transactional |
| Consulta simples | ❌ Não | Leitura direta |
| Com chamada HTTP | ❌ Não | Eventos/Async |
| Processamento longo | ❌ Não | Job assíncrono |
| Transferência bancária | ✅ Sim | @Transactional |

**Lembre-se:** Transações são ferramentas poderosas, mas use com moderação! 🎯
