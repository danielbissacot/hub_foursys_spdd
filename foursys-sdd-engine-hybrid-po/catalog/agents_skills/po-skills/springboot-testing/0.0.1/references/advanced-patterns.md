# Padrões Avançados de Teste

Padrões avançados e técnicas para cenários de teste sofisticados em aplicações Spring Boot.

## Testes Parametrizados

Teste múltiplos cenários com diferentes entradas usando um único método de teste.

### Value Source

```java
@ParameterizedTest
@ValueSource(strings = {"000.000.000-00", "111.111.111-11", "999.999.999-99"})
@DisplayName("Should reject known invalid CPFs")
void shouldRejectInvalidCpfs(String invalidCpf) {
    assertThrows(InvalidCpfException.class, () -> new Cpf(invalidCpf));
}

@ParameterizedTest
@ValueSource(ints = {-1, -100, -999})
@DisplayName("Should reject negative ages")
void shouldRejectNegativeAge(int age) {
    assertThrows(IllegalArgumentException.class, 
        () -> Customer.withAge(age));
}
```

### CSV Source

```java
@ParameterizedTest
@CsvSource({
    "REGULAR, 500.00,   500.00",
    "REGULAR, 1500.00,  1425.00",  // 5% discount
    "VIP,     1000.00,  900.00",   // 10% discount
    "VIP,     10000.00, 8500.00"   // Max 15% discount
})
@DisplayName("Should calculate correct discount for customer tier and amount")
void shouldCalculateDiscount(
        CustomerTier tier, 
        BigDecimal amount, 
        BigDecimal expected) {
    
    var customer = customerWithTier(tier);
    var result = calculator.calculateFinalPrice(customer, amount);
    
    assertThat(result).isEqualByComparingTo(expected);
}
```

### CSV File Source

```java
// Create resources/test-data/discounts.csv
// tier,amount,expected
// REGULAR,500.00,500.00
// VIP,1000.00,900.00

@ParameterizedTest
@CsvFileSource(resources = "/test-data/discounts.csv", numLinesToSkip = 1)
@DisplayName("Should apply discounts according to CSV data")
void shouldApplyDiscountsFromFile(
        CustomerTier tier, 
        BigDecimal amount, 
        BigDecimal expected) {
    
    var customer = customerWithTier(tier);
    var result = calculator.calculateFinalPrice(customer, amount);
    
    assertThat(result).isEqualByComparingTo(expected);
}
```

### Method Source

```java
@ParameterizedTest
@MethodSource("invalidPaymentScenarios")
@DisplayName("Should reject invalid payment scenarios")
void shouldRejectInvalidPayments(Payment payment, Class<? extends Exception> expected) {
    assertThrows(expected, () -> useCase.process(payment));
}

static Stream<Arguments> invalidPaymentScenarios() {
    return Stream.of(
        Arguments.of(paymentWithNullAccount(), IllegalArgumentException.class),
        Arguments.of(paymentWithNegativeAmount(), InvalidAmountException.class),
        Arguments.of(paymentWithZeroAmount(), InvalidAmountException.class),
        Arguments.of(paymentWithExcessiveAmount(), PaymentLimitExceededException.class)
    );
}
```

### Enum Source

```java
@ParameterizedTest
@EnumSource(PaymentStatus.class)
@DisplayName("Should handle all payment statuses")
void shouldHandleAllStatuses(PaymentStatus status) {
    var payment = paymentWithStatus(status);
    
    assertDoesNotThrow(() -> processor.process(payment));
}

@ParameterizedTest
@EnumSource(value = CustomerTier.class, names = {"VIP", "PREMIUM"})
@DisplayName("Should apply special processing for premium tiers")
void shouldApplyPremiumProcessing(CustomerTier tier) {
    var customer = customerWithTier(tier);
    
    processor.process(customer);
    
    verify(premiumService).applySpecialTreatment(customer);
}
```

### Arguments Provider

```java
@ParameterizedTest
@ArgumentsSource(ComplexPaymentProvider.class)
@DisplayName("Should handle complex payment scenarios")
void shouldHandleComplexScenarios(Payment payment, Account account, boolean shouldSucceed) {
    when(accountPort.find(payment.getAccountId())).thenReturn(Optional.of(account));
    
    if (shouldSucceed) {
        assertDoesNotThrow(() -> useCase.process(payment));
    } else {
        assertThrows(PaymentProcessingException.class, 
            () -> useCase.process(payment));
    }
}

static class ComplexPaymentProvider implements ArgumentsProvider {
    @Override
    public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
        return Stream.of(
            Arguments.of(smallPayment(), activeAccount(), true),
            Arguments.of(largePayment(), activeAccount(), true),
            Arguments.of(anyPayment(), inactiveAccount(), false),
            Arguments.of(excessivePayment(), activeAccount(), false)
        );
    }
}
```

## Testes de Exceção

Padrões avançados para testar cenários de exceção.

### Teste Básico de Exceção

```java
@Test
@DisplayName("Should throw specific exception with correct message")
void shouldThrowWithMessage() {
    var exception = assertThrows(InsufficientBalanceException.class,
        () -> account.withdraw(new BigDecimal("1000.00")));
    
    assertThat(exception.getMessage())
        .contains("Insufficient balance")
        .contains("Available: R$ 500.00")
        .contains("Required: R$ 1000.00");
}
```

### Teste de Causa de Exceção

```java
@Test
@DisplayName("Should wrap external exception with context")
void shouldWrapExternalException() {
    when(externalService.call()).thenThrow(new IOException("Network error"));
    
    var exception = assertThrows(ServiceUnavailableException.class,
        () -> adapter.callExternalService());
    
    assertAll(
        () -> assertThat(exception.getMessage())
            .contains("External service unavailable"),
        () -> assertThat(exception.getCause())
            .isInstanceOf(IOException.class)
            .hasMessageContaining("Network error")
    );
}
```

### Múltiplos Tipos de Exceção

```java
@ParameterizedTest
@MethodSource("exceptionScenarios")
@DisplayName("Should throw appropriate exception for each error scenario")
void shouldThrowAppropriateException(
        Payment payment, 
        Class<? extends Exception> expectedException,
        String expectedMessage) {
    
    var exception = assertThrows(expectedException, 
        () -> useCase.process(payment));
    
    assertThat(exception.getMessage()).contains(expectedMessage);
}

static Stream<Arguments> exceptionScenarios() {
    return Stream.of(
        Arguments.of(
            paymentWithNullAccount(), 
            IllegalArgumentException.class, 
            "Account ID cannot be null"
        ),
        Arguments.of(
            paymentWithNegativeAmount(), 
            InvalidAmountException.class, 
            "Amount must be positive"
        )
    );
}
```

### Exceção com Campos Personalizados

```java
@Test
@DisplayName("Should include error details in custom exception")
void shouldIncludeErrorDetails() {
    var payment = paymentOf(new BigDecimal("1000.00"));
    var account = accountWithBalance(new BigDecimal("500.00"));
    
    when(findAccountPort.findById(any())).thenReturn(Optional.of(account));
    
    var exception = assertThrows(InsufficientBalanceException.class,
        () -> useCase.process(payment));
    
    assertAll(
        () -> assertThat(exception.getAccountId()).isEqualTo(account.getId()),
        () -> assertThat(exception.getAvailableBalance())
            .isEqualByComparingTo(new BigDecimal("500.00")),
        () -> assertThat(exception.getRequiredAmount())
            .isEqualByComparingTo(new BigDecimal("1000.00")),
        () -> assertThat(exception.getErrorCode()).isEqualTo("INSUFFICIENT_BALANCE")
    );
}
```

## Builders de Dados de Teste

Crie dados de teste fluentes e legíveis com padrão builder.

### Builder Simples

```java
public class CustomerTestBuilder {
    private String name = "Default Customer";
    private String cpf = "111.444.777-35";
    private int age = 25;
    private CustomerTier tier = CustomerTier.REGULAR;
    
    public static CustomerTestBuilder aCustomer() {
        return new CustomerTestBuilder();
    }
    
    public CustomerTestBuilder withName(String name) {
        this.name = name;
        return this;
    }
    
    public CustomerTestBuilder withCpf(String cpf) {
        this.cpf = cpf;
        return this;
    }
    
    public CustomerTestBuilder withAge(int age) {
        this.age = age;
        return this;
    }
    
    public CustomerTestBuilder vip() {
        this.tier = CustomerTier.VIP;
        return this;
    }
    
    public CustomerTestBuilder premium() {
        this.tier = CustomerTier.PREMIUM;
        return this;
    }
    
    public Customer build() {
        return Customer.builder()
            .name(name)
            .cpf(new Cpf(cpf))
            .birthDate(LocalDate.now().minusYears(age))
            .tier(tier)
            .build();
    }
}

// Usage
@Test
void testVipCustomer() {
    var customer = aCustomer()
        .withName("João Silva")
        .withAge(30)
        .vip()
        .build();
    
    // ... test logic
}
```

### Builder Complexo com Padrões

```java
public class OrderTestBuilder {
    private String customerId = "CUST-001";
    private List<OrderItem> items = new ArrayList<>();
    private OrderStatus status = OrderStatus.DRAFT;
    private BigDecimal discount = BigDecimal.ZERO;
    
    public static OrderTestBuilder anOrder() {
        return new OrderTestBuilder()
            .withItem("Product A", 1, new BigDecimal("100.00"));
    }
    
    public OrderTestBuilder withCustomerId(String customerId) {
        this.customerId = customerId;
        return this;
    }
    
    public OrderTestBuilder withItem(String product, int quantity, BigDecimal price) {
        items.add(OrderItem.of(product, quantity, price));
        return this;
    }
    
    public OrderTestBuilder withItems(OrderItem... items) {
        this.items = Arrays.asList(items);
        return this;
    }
    
    public OrderTestBuilder submitted() {
        this.status = OrderStatus.SUBMITTED;
        return this;
    }
    
    public OrderTestBuilder withDiscount(BigDecimal discount) {
        this.discount = discount;
        return this;
    }
    
    public Order build() {
        var order = Order.create(customerId, items);
        if (status == OrderStatus.SUBMITTED) {
            order.submit();
        }
        if (discount.compareTo(BigDecimal.ZERO) > 0) {
            order.applyDiscount(discount);
        }
        return order;
    }
}

// Usage
@Test
void testOrderProcessing() {
    var order = anOrder()
        .withItem("Product B", 2, new BigDecimal("50.00"))
        .withDiscount(new BigDecimal("10.00"))
        .submitted()
        .build();
    
    // ... test logic
}
```

### Padrão Object Mother

```java
public class PaymentMother {
    
    public static Payment validPayment() {
        return Payment.builder()
            .accountId("ACC-12345")
            .amount(new BigDecimal("100.00"))
            .description("Valid payment")
            .build();
    }
    
    public static Payment largePayment() {
        return Payment.builder()
            .accountId("ACC-12345")
            .amount(new BigDecimal("10000.00"))
            .description("Large payment")
            .build();
    }
    
    public static Payment invalidPayment() {
        return Payment.builder()
            .accountId(null)
            .amount(new BigDecimal("-100.00"))
            .description("")
            .build();
    }
    
    public static Payment paymentFor(Account account, BigDecimal amount) {
        return Payment.builder()
            .accountId(account.getId())
            .amount(amount)
            .description("Payment for " + account.getOwner())
            .build();
    }
}

// Usage
@Test
void testPayment() {
    var payment = PaymentMother.validPayment();
    // ... test logic
}
```

## Testes Dinâmicos

Gere testes em tempo de execução baseados em dados ou condições.

### Test Factory

```java
@TestFactory
@DisplayName("Discount calculation for different customer tiers")
Stream<DynamicTest> discountCalculationTests() {
    return Stream.of(
        tuple(CustomerTier.REGULAR, new BigDecimal("500.00"), new BigDecimal("500.00")),
        tuple(CustomerTier.REGULAR, new BigDecimal("1500.00"), new BigDecimal("1425.00")),
        tuple(CustomerTier.VIP, new BigDecimal("1000.00"), new BigDecimal("900.00"))
    ).map(data -> DynamicTest.dynamicTest(
        String.format("%s customer with R$ %s should pay R$ %s", 
            data.v1, data.v2, data.v3),
        () -> {
            var customer = customerWithTier(data.v1);
            var result = calculator.calculateFinalPrice(customer, data.v2);
            assertThat(result).isEqualByComparingTo(data.v3);
        }
    ));
}
```

### Container Tests

```java
@TestFactory
@DisplayName("Payment validation rules")
Collection<DynamicContainer> paymentValidationTests() {
    return Arrays.asList(
        DynamicContainer.dynamicContainer("Amount validation", Arrays.asList(
            DynamicTest.dynamicTest("Negative amount", 
                () -> assertThrows(InvalidAmountException.class, 
                    () -> validator.validate(paymentWithAmount(new BigDecimal("-10"))))),
            DynamicTest.dynamicTest("Zero amount", 
                () -> assertThrows(InvalidAmountException.class, 
                    () -> validator.validate(paymentWithAmount(BigDecimal.ZERO))))
        )),
        DynamicContainer.dynamicContainer("Account validation", Arrays.asList(
            DynamicTest.dynamicTest("Null account", 
                () -> assertThrows(IllegalArgumentException.class, 
                    () -> validator.validate(paymentWithAccount(null)))),
            DynamicTest.dynamicTest("Empty account", 
                () -> assertThrows(IllegalArgumentException.class, 
                    () -> validator.validate(paymentWithAccount(""))))
        ))
    );
}
```

## Testes Condicionais

Execute testes apenas sob condições específicas.

### Testes Específicos de OS

```java
@Test
@EnabledOnOs(OS.LINUX)
@DisplayName("Should run only on Linux")
void linuxSpecificTest() {
    // Linux-specific logic
}

@Test
@DisabledOnOs(OS.WINDOWS)
@DisplayName("Should not run on Windows")
void nonWindowsTest() {
    // Non-Windows logic
}
```

### Testes Específicos de JRE

```java
@Test
@EnabledOnJre(JRE.JAVA_17)
@DisplayName("Should run only on Java 17")
void java17SpecificTest() {
    // Java 17 specific features
}

@Test
@EnabledForJreRange(min = JRE.JAVA_17, max = JRE.JAVA_21)
@DisplayName("Should run on Java 17-21")
void modernJavaTest() {
    // Modern Java features
}
```

### Testes Específicos de Ambiente

```java
@Test
@EnabledIfEnvironmentVariable(named = "ENV", matches = "prod")
@DisplayName("Should run only in production environment")
void productionTest() {
    // Production-specific test
}

@Test
@EnabledIfSystemProperty(named = "test.integration", matches = "true")
@DisplayName("Should run only when integration tests are enabled")
void integrationTest() {
    // Integration test logic
}
```

### Condições Personalizadas

```java
@Test
@EnabledIf("customCondition")
@DisplayName("Should run based on custom condition")
void conditionalTest() {
    // Test logic
}

boolean customCondition() {
    return LocalDate.now().getDayOfWeek() == DayOfWeek.FRIDAY;
}
```

## Testes de Timeout

Teste performance e previna testes que travam.

```java
@Test
@Timeout(value = 500, unit = TimeUnit.MILLISECONDS)
@DisplayName("Should complete within 500ms")
void shouldBeF fast() {
    // Fast operation
    useCase.process(payment());
}

@Test
@Timeout(1)
@DisplayName("Should complete within 1 second (default)")
void shouldCompleteQuickly() {
    // Operation that should be quick
}

@ParameterizedTest
@ValueSource(ints = {1, 10, 100, 1000})
@Timeout(2)
@DisplayName("Should handle different batch sizes within 2 seconds")
void shouldHandleBatchSizes(int batchSize) {
    processor.processBatch(createBatch(batchSize));
}
```

## Testes Repetidos

Execute o mesmo teste múltiplas vezes para capturar comportamento instável.

```java
@RepeatedTest(10)
@DisplayName("Should generate unique transaction IDs consistently")
void shouldGenerateUniqueIds(RepetitionInfo repetitionInfo) {
    var id = idGenerator.generate();
    
    assertThat(id)
        .isNotNull()
        .matches("[A-Z0-9]{10}");
    
    System.out.printf("Iteration %d of %d: Generated ID = %s%n",
        repetitionInfo.getCurrentRepetition(),
        repetitionInfo.getTotalRepetitions(),
        id);
}

@RepeatedTest(value = 100, name = "Attempt {currentRepetition}/{totalRepetitions}")
@DisplayName("Should handle concurrent updates without errors")
void shouldHandleConcurrency() {
    // Test concurrent scenario
    CompletableFuture.allOf(
        CompletableFuture.runAsync(() -> service.update(entity1)),
        CompletableFuture.runAsync(() -> service.update(entity2))
    ).join();
}
```

## Recursos Avançados do AssertJ

### Extracting

```java
@Test
void shouldVerifyCustomerProperties() {
    var customers = service.findAll();
    
    assertThat(customers)
        .extracting(Customer::getName, Customer::getTier)
        .contains(
            tuple("João Silva", CustomerTier.VIP),
            tuple("Maria Santos", CustomerTier.REGULAR)
        );
}
```

### Filtering

```java
@Test
void shouldFindVipCustomers() {
    var customers = service.findAll();
    
    assertThat(customers)
        .filteredOn(customer -> customer.getTier() == CustomerTier.VIP)
        .hasSize(5)
        .allMatch(customer -> customer.getDiscount().compareTo(BigDecimal.ZERO) > 0);
}
```

### Soft Assertions

```java
@Test
void shouldValidateAllCustomerProperties() {
    var customer = service.findById("CUST-001");
    
    SoftAssertions.assertSoftly(softly -> {
        softly.assertThat(customer.getName()).isEqualTo("João Silva");
        softly.assertThat(customer.getAge()).isGreaterThan(18);
        softly.assertThat(customer.getTier()).isEqualTo(CustomerTier.VIP);
        softly.assertThat(customer.isActive()).isTrue();
    });
    // All assertions are checked, even if some fail
}
```

## Principais pontos

1. **Parametrized Tests**: Reduza duplicação para cenários similares
2. **Exception Testing**: Verifique tratamento de erro completamente
3. **Test Builders**: Crie dados de teste legíveis fluentemente
4. **Dynamic Tests**: Gere testes em tempo de execução
5. **Conditional Tests**: Execute testes baseados no ambiente
6. **Timeout Tests**: Garanta padrões de performance
7. **Repeated Tests**: Capture comportamento instável
8. **AssertJ**: Use recursos avançados para asserções mais limpas
9. **Soft Assertions**: Verifique múltiplas condições
10. **Object Mother**: Centralize criação de dados de teste
