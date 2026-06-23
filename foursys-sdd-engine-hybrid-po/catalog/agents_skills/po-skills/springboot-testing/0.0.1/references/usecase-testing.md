# Testes de UseCase

Guia abrangente para testar UseCases (Application Services) em Arquitetura Hexagonal. UseCases orquestram a lógica de domínio e coordenam interações entre ports.

## O que testar em UseCases

### ✅ Deve testar

- Orquestração da lógica de negócio
- Colaboração entre ports (entrada/saída)
- Tratamento de erros e cenários excepcionais
- Regras de validação
- Limites de transação
- Edge cases
  
### ❌ Não deve testar

- Implementações de ports (teste essas separadamente)
- Código específico de framework
- Delegação simples sem lógica

## Estrutura de teste de UseCase

```java
@ExtendWith(MockitoExtension.class)
@DisplayName("Process Payment - UseCase")
class ProcessPaymentUseCaseTest {
    
    @Mock
    private FindAccountPort findAccountPort;
    
    @Mock
    private ValidateBalancePort validateBalancePort;
    
    @Mock
    private ExecuteTransferPort executeTransferPort;
    
    @Mock
    private NotifyCustomerPort notifyCustomerPort;
    
    @InjectMocks
    private ProcessPaymentUseCase useCase;
    
    // Tests go here
}
```

## Cenários de sucesso (Happy Path)

Teste o fluxo principal quando tudo funciona corretamente.

```java
@Nested
@DisplayName("Success Scenarios")
class SuccessScenarios {
    
    @Test
    @DisplayName("Should process payment successfully with valid account and balance")
    void shouldProcessPaymentSuccessfully() {
        // Arrange
        var payment = validPayment();
        var account = accountWithBalance(new BigDecimal("1000.00"));
        var transfer = successfulTransfer();
        
        when(findAccountPort.findById(payment.getAccountId()))
            .thenReturn(Optional.of(account));
        when(validateBalancePort.validate(account, payment.getAmount()))
            .thenReturn(true);
        when(executeTransferPort.execute(any(TransferRequest.class)))
            .thenReturn(transfer);
        
        // Act
        var result = useCase.process(payment);
        
        // Assert
        assertAll(
            () -> assertThat(result.getStatus()).isEqualTo(PaymentStatus.APPROVED),
            () -> assertThat(result.getTransactionId()).isEqualTo(transfer.getId()),
            () -> verify(notifyCustomerPort).notifySuccess(any(PaymentNotification.class)),
            () -> verify(executeTransferPort).execute(argThat(req -> 
                req.getAmount().equals(payment.getAmount()) &&
                req.getSourceAccount().equals(account.getId())
            ))
        );
    }
    
    @Test
    @DisplayName("Should process payment and emit domain event")
    void shouldEmitPaymentProcessedEvent() {
        // Arrange
        var payment = validPayment();
        setupSuccessfulPaymentMocks();
        
        // Act
        var result = useCase.process(payment);
        
        // Assert
        assertThat(result.getDomainEvents())
            .hasSize(1)
            .first()
            .isInstanceOf(PaymentProcessedEvent.class)
            .hasFieldOrPropertyWithValue("paymentId", result.getId())
            .hasFieldOrPropertyWithValue("amount", payment.getAmount());
    }
}
```

## Cenários de falha (Unhappy Path)

Teste condições de erro e casos excepcionais.

```java
@Nested
@DisplayName("Failure Scenarios")
class FailureScenarios {
    
    @Test
    @DisplayName("Should reject payment when account not found")
    void shouldRejectPaymentWhenAccountNotFound() {
        // Arrange
        var payment = validPayment();
        when(findAccountPort.findById(payment.getAccountId()))
            .thenReturn(Optional.empty());
        
        // Act & Assert
        assertThrows(AccountNotFoundException.class,
            () -> useCase.process(payment),
            "Payment should fail when account doesn't exist");
        
        // Verify no further processing happened
        verifyNoInteractions(validateBalancePort, executeTransferPort, notifyCustomerPort);
    }
    
    @Test
    @DisplayName("Should reject payment when balance is insufficient")
    void shouldRejectPaymentWhenInsufficientBalance() {
        // Arrange
        var payment = paymentOf(new BigDecimal("1000.00"));
        var account = accountWithBalance(new BigDecimal("50.00"));
        
        when(findAccountPort.findById(payment.getAccountId()))
            .thenReturn(Optional.of(account));
        when(validateBalancePort.validate(account, payment.getAmount()))
            .thenReturn(false);
        
        // Act
        var exception = assertThrows(InsufficientBalanceException.class,
            () -> useCase.process(payment));
        
        // Assert
        assertAll(
            () -> assertThat(exception.getMessage())
                .contains("Insufficient balance"),
            () -> verify(executeTransferPort, never()).execute(any()),
            () -> verify(notifyCustomerPort).notifyFailure(any())
        );
    }
    
    @Test
    @DisplayName("Should handle transfer failure gracefully")
    void shouldHandleTransferFailure() {
        // Arrange
        var payment = validPayment();
        setupValidAccountAndBalance();
        when(executeTransferPort.execute(any()))
            .thenThrow(new TransferFailedException("External service unavailable"));
        
        // Act
        var exception = assertThrows(PaymentProcessingException.class,
            () -> useCase.process(payment));
        
        // Assert
        assertAll(
            () -> assertThat(exception.getMessage())
                .contains("Failed to process payment"),
            () -> assertThat(exception.getCause())
                .isInstanceOf(TransferFailedException.class),
            () -> verify(notifyCustomerPort).notifyError(any())
        );
    }
}
```

## Cenários de validação

Teste validação de entrada e regras de negócio.

```java
@Nested
@DisplayName("Validation Scenarios")
class ValidationScenarios {
    
    @Test
    @DisplayName("Should reject payment with null account ID")
    void shouldRejectNullAccountId() {
        var payment = Payment.builder()
            .accountId(null)
            .amount(new BigDecimal("100.00"))
            .build();
        
        assertThrows(IllegalArgumentException.class,
            () -> useCase.process(payment));
    }
    
    @Test
    @DisplayName("Should reject payment with negative amount")
    void shouldRejectNegativeAmount() {
        var payment = Payment.builder()
            .accountId("12345")
            .amount(new BigDecimal("-50.00"))
            .build();
        
        var exception = assertThrows(InvalidPaymentAmountException.class,
            () -> useCase.process(payment));
        
        assertThat(exception.getMessage())
            .contains("Payment amount must be positive");
    }
    
    @Test
    @DisplayName("Should reject payment with zero amount")
    void shouldRejectZeroAmount() {
        var payment = paymentOf(BigDecimal.ZERO);
        
        assertThrows(InvalidPaymentAmountException.class,
            () -> useCase.process(payment));
    }
    
    @ParameterizedTest
    @ValueSource(strings = {"0.001", "0.01", "99999.99"})
    @DisplayName("Should reject payments with invalid decimal places")
    void shouldRejectInvalidDecimalPlaces(String amount) {
        var payment = paymentOf(new BigDecimal(amount));
        
        // Assuming business rule: only 2 decimal places allowed
        if (new BigDecimal(amount).scale() != 2) {
            assertThrows(InvalidPaymentAmountException.class,
                () -> useCase.process(payment));
        }
    }
}
```

## Edge cases

```java
@Nested
@DisplayName("Edge Cases")
class EdgeCases {
    
    @Test
    @DisplayName("Should process payment when balance exactly matches amount")
    void shouldProcessWhenBalanceExactlyMatches() {
        // Arrange
        var amount = new BigDecimal("100.00");
        var payment = paymentOf(amount);
        var account = accountWithBalance(amount);
        
        setupSuccessfulProcessing(account);
        
        // Act
        var result = useCase.process(payment);
        
        // Assert
        assertThat(result.getStatus()).isEqualTo(PaymentStatus.APPROVED);
    }
    
    @Test
    @DisplayName("Should handle concurrent payment processing")
    void shouldHandleConcurrentProcessing() {
        // Arrange
        var payment = validPayment();
        var account = accountWithBalance(new BigDecimal("1000.00"));
        
        when(findAccountPort.findById(payment.getAccountId()))
            .thenReturn(Optional.of(account));
        when(executeTransferPort.execute(any()))
            .thenThrow(new OptimisticLockException("Account being modified"));
        
        // Act & Assert
        assertThrows(ConcurrentModificationException.class,
            () -> useCase.process(payment));
    }
    
    @Test
    @DisplayName("Should handle maximum allowed payment amount")
    void shouldHandleMaximumPaymentAmount() {
        var maxAmount = new BigDecimal("999999.99");
        var payment = paymentOf(maxAmount);
        var account = accountWithBalance(maxAmount);
        
        setupSuccessfulProcessing(account);
        
        var result = useCase.process(payment);
        
        assertThat(result.getStatus()).isEqualTo(PaymentStatus.APPROVED);
    }
    
    @Test
    @DisplayName("Should reject payment exceeding maximum allowed amount")
    void shouldRejectExcessivePayment() {
        var excessiveAmount = new BigDecimal("1000000.00");
        var payment = paymentOf(excessiveAmount);
        
        assertThrows(PaymentLimitExceededException.class,
            () -> useCase.process(payment));
    }
}
```

## Testando lógica de negócio complexa

```java
@DisplayName("Customer Registration - UseCase")
@ExtendWith(MockitoExtension.class)
class RegisterCustomerUseCaseTest {
    
    @Mock private ValidateCpfPort validateCpfPort;
    @Mock private CheckDuplicateCustomerPort checkDuplicatePort;
    @Mock private SaveCustomerPort saveCustomerPort;
    @Mock private SendWelcomeEmailPort sendWelcomeEmailPort;
    @Mock private PublishCustomerEventPort publishEventPort;
    
    @InjectMocks
    private RegisterCustomerUseCase useCase;
    
    @Test
    @DisplayName("Should execute complete registration workflow")
    void shouldExecuteCompleteWorkflow() {
        // Arrange
        var customer = validCustomer();
        
        when(validateCpfPort.isValid(customer.getCpf())).thenReturn(true);
        when(checkDuplicatePort.existsByCpf(customer.getCpf())).thenReturn(false);
        when(saveCustomerPort.save(any())).thenReturn(savedCustomer(customer));
        
        // Act
        var result = useCase.register(customer);
        
        // Assert - Verify correct sequence of operations
        var inOrder = inOrder(
            validateCpfPort, 
            checkDuplicatePort, 
            saveCustomerPort, 
            sendWelcomeEmailPort,
            publishEventPort
        );
        
        inOrder.verify(validateCpfPort).isValid(customer.getCpf());
        inOrder.verify(checkDuplicatePort).existsByCpf(customer.getCpf());
        inOrder.verify(saveCustomerPort).save(any());
        inOrder.verify(sendWelcomeEmailPort).send(customer.getEmail());
        inOrder.verify(publishEventPort).publish(any(CustomerRegisteredEvent.class));
        
        assertThat(result.getId()).isNotNull();
    }
    
    @Test
    @DisplayName("Should rollback when email sending fails")
    void shouldRollbackOnEmailFailure() {
        // Arrange
        var customer = validCustomer();
        setupSuccessfulValidation(customer);
        
        doThrow(new EmailSendingException("SMTP error"))
            .when(sendWelcomeEmailPort).send(any());
        
        // Act & Assert
        assertThrows(RegistrationFailedException.class,
            () -> useCase.register(customer));
        
        // Verify rollback occurred
        verify(saveCustomerPort).delete(any());
        verify(publishEventPort, never()).publish(any());
    }
}
```

## Testando com ArgumentCaptor

Capture e verifique argumentos complexos passados para ports:

```java
@Test
@DisplayName("Should build correct transfer request with all required fields")
void shouldBuildCorrectTransferRequest() {
    // Arrange
    var payment = validPayment();
    setupSuccessfulPaymentMocks();
    
    ArgumentCaptor<TransferRequest> transferCaptor = 
        ArgumentCaptor.forClass(TransferRequest.class);
    
    // Act
    useCase.process(payment);
    
    // Assert
    verify(executeTransferPort).execute(transferCaptor.capture());
    
    var capturedRequest = transferCaptor.getValue();
    assertAll(
        () -> assertThat(capturedRequest.getAmount())
            .isEqualByComparingTo(payment.getAmount()),
        () -> assertThat(capturedRequest.getSourceAccount())
            .isEqualTo(payment.getAccountId()),
        () -> assertThat(capturedRequest.getDescription())
            .contains(payment.getDescription()),
        () -> assertThat(capturedRequest.getIdempotencyKey())
            .isNotNull()
    );
}
```

## Testing Conditional Logic

```java
@Nested
@DisplayName("Discount Application Logic")
class DiscountLogic {
    
    @Mock private CalculateDiscountPort calculateDiscountPort;
    @Mock private SaveOrderPort saveOrderPort;
    
    @InjectMocks
    private CreateOrderUseCase useCase;
    
    @Test
    @DisplayName("Should apply discount for VIP customers only")
    void shouldApplyDiscountForVipOnly() {
        // VIP customer - should get discount
        var vipCustomer = vipCustomer();
        var order = orderFor(vipCustomer, new BigDecimal("500.00"));
        
        when(calculateDiscountPort.calculate(vipCustomer, order.getTotal()))
            .thenReturn(new BigDecimal("50.00"));
        
        useCase.create(order);
        
        verify(calculateDiscountPort).calculate(vipCustomer, order.getTotal());
    }
    
    @Test
    @DisplayName("Should not apply discount for regular customers")
    void shouldNotApplyDiscountForRegular() {
        var regularCustomer = regularCustomer();
        var order = orderFor(regularCustomer, new BigDecimal("500.00"));
        
        useCase.create(order);
        
        verifyNoInteractions(calculateDiscountPort);
    }
    
    @ParameterizedTest
    @EnumSource(value = CustomerTier.class, names = {"VIP", "PREMIUM"})
    @DisplayName("Should apply discount for premium tier customers")
    void shouldApplyDiscountForPremiumTiers(CustomerTier tier) {
        var customer = customerWithTier(tier);
        var order = orderFor(customer, new BigDecimal("1000.00"));
        
        useCase.create(order);
        
        verify(calculateDiscountPort).calculate(eq(customer), any());
    }
}
```

## Testing Retry Logic

```java
@Test
@DisplayName("Should retry transfer up to 3 times on transient failure")
void shouldRetryOnTransientFailure() {
    // Arrange
    var payment = validPayment();
    setupSuccessfulValidation();
    
    when(executeTransferPort.execute(any()))
        .thenThrow(new TransientException("Temporary error"))
        .thenThrow(new TransientException("Temporary error"))
        .thenReturn(successfulTransfer()); // Succeeds on 3rd attempt
    
    // Act
    var result = useCase.process(payment);
    
    // Assert
    assertThat(result.getStatus()).isEqualTo(PaymentStatus.APPROVED);
    verify(executeTransferPort, times(3)).execute(any());
}

@Test
@DisplayName("Should fail after maximum retry attempts")
void shouldFailAfterMaxRetries() {
    var payment = validPayment();
    setupSuccessfulValidation();
    
    when(executeTransferPort.execute(any()))
        .thenThrow(new TransientException("Persistent error"));
    
    assertThrows(MaxRetriesExceededException.class,
        () -> useCase.process(payment));
    
    verify(executeTransferPort, times(3)).execute(any());
}
```

## Test Data Builders

Create fluent builders for test data:

```java
class PaymentTestBuilder {
    private String accountId = "ACC-12345";
    private BigDecimal amount = new BigDecimal("100.00");
    private String description = "Test payment";
    
    public static PaymentTestBuilder aPayment() {
        return new PaymentTestBuilder();
    }
    
    public PaymentTestBuilder withAccountId(String accountId) {
        this.accountId = accountId;
        return this;
    }
    
    public PaymentTestBuilder withAmount(BigDecimal amount) {
        this.amount = amount;
        return this;
    }
    
    public PaymentTestBuilder withAmount(String amount) {
        this.amount = new BigDecimal(amount);
        return this;
    }
    
    public PaymentTestBuilder withDescription(String description) {
        this.description = description;
        return this;
    }
    
    public Payment build() {
        return Payment.builder()
            .accountId(accountId)
            .amount(amount)
            .description(description)
            .build();
    }
}

// Usage
@Test
void testPaymentProcessing() {
    var payment = aPayment()
        .withAmount("250.00")
        .withDescription("Monthly subscription")
        .build();
    
    // ... test logic
}
```

## Common Test Utilities

```java
class UseCaseTestUtils {
    
    public static <T> ArgumentMatcher<T> matching(Predicate<T> predicate) {
        return argument -> predicate.test(argument);
    }
    
    public static void setupSuccessfulMocks(
            FindAccountPort findAccountPort,
            ValidateBalancePort validateBalancePort) {
        
        when(findAccountPort.findById(any()))
            .thenReturn(Optional.of(defaultAccount()));
        when(validateBalancePort.validate(any(), any()))
            .thenReturn(true);
    }
    
    public static Account defaultAccount() {
        return Account.builder()
            .id("ACC-12345")
            .balance(new BigDecimal("1000.00"))
            .status(AccountStatus.ACTIVE)
            .build();
    }
}
```

## Principais pontos

1. **Faça mock apenas de ports** - Não faça mock de objetos de domínio
2. **Teste orquestração** - Verifique a coordenação correta entre os ports
3. **Verifique ordem de interação** - Use `inOrder()` quando a sequência importar
4. **Teste todos os caminhos** - Teste caminhos de sucesso, falha, casos de borda e validações
5. **Use ArgumentCaptor** - Verifique argumentos complexos passados aos ports
6. **Teste regras de negócio** - Foque na lógica de domínio, não na infraestrutura
7. **Padrão Builder** - Crie dados de teste legíveis
8. **Nomes descritivos** - Nomes BDD-style explicam o comportamento
9. **Testes independentes** - Não compartilhe estado mutável entre testes
10. **Assertions fail-fast** - Use `assertAll()` para múltiplas verificações
