# Testes de Modelos de Domínio

Guia abrangente para testar modelos de domínio, entidades, value objects e lógica de domínio em Arquitetura Hexagonal.

## O que testar em Modelos de Domínio

### ✅ Deve testar

- Regras de validação e invariantes
- Comportamento de domínio e lógica de negócio
- Transições de estado
- Igualdade e identidade (`equals`/`hashCode`)
- Imutabilidade de value objects
- Emissão de domain events

### ❌ Não deve testar

- Getters/setters simples sem lógica
- Construtores padrão
- Transfer objects puros sem comportamento

## Testando Value Objects

Value objects são objetos imutáveis definidos por seus atributos, não por identidade.

### Exemplo: Value Object CPF

```java
@Nested
@DisplayName("CPF Value Object - Validation")
class CpfValidationTest {
    
    @Test
    @DisplayName("Should accept valid CPF")
    void shouldAcceptValidCpf() {
        assertDoesNotThrow(() -> new Cpf("111.444.777-35"));
    }
    
    @Test
    @DisplayName("Should reject CPF with invalid format")
    void shouldRejectInvalidFormat() {
        var exception = assertThrows(InvalidCpfException.class,
            () -> new Cpf("123.456.789-00"));
        
        assertThat(exception.getMessage())
            .contains("Invalid CPF");
    }
    
    @ParameterizedTest
    @ValueSource(strings = {
        "000.000.000-00",
        "111.111.111-11",
        "999.999.999-99"
    })
    @DisplayName("Should reject known invalid CPFs")
    void shouldRejectKnownInvalidCpfs(String invalidCpf) {
        assertThrows(InvalidCpfException.class, () -> new Cpf(invalidCpf));
    }
    
    @Test
    @DisplayName("Should format CPF correctly")
    void shouldFormatCpf() {
        var cpf = new Cpf("11144477735");
        assertThat(cpf.getFormatted()).isEqualTo("111.444.777-35");
    }
    
    @Test
    @DisplayName("Should compare CPFs by value, not reference")
    void shouldCompareByValue() {
        var cpf1 = new Cpf("111.444.777-35");
        var cpf2 = new Cpf("111.444.777-35");
        
        assertThat(cpf1).isEqualTo(cpf2);
        assertThat(cpf1.hashCode()).isEqualTo(cpf2.hashCode());
    }
}
```

### Exemplo: Value Object Money

```java
@Nested
@DisplayName("Money Value Object")
class MoneyTest {
    
    @Test
    @DisplayName("Should reject negative amounts")
    void shouldRejectNegativeAmount() {
        assertThrows(IllegalArgumentException.class,
            () -> Money.of(new BigDecimal("-10.00")));
    }
    
    @Test
    @DisplayName("Should add two money values correctly")
    void shouldAddMoney() {
        var money1 = Money.of(new BigDecimal("100.00"));
        var money2 = Money.of(new BigDecimal("50.50"));
        
        var result = money1.add(money2);
        
        assertThat(result.getAmount())
            .isEqualByComparingTo(new BigDecimal("150.50"));
    }
    
    @Test
    @DisplayName("Should maintain scale of 2 decimal places")
    void shouldMaintainScale() {
        var money = Money.of(new BigDecimal("100.1"));
        
        assertThat(money.getAmount())
            .hasScale(2)
            .isEqualByComparingTo(new BigDecimal("100.10"));
    }
    
    @Test
    @DisplayName("Should calculate percentage correctly")
    void shouldCalculatePercentage() {
        var money = Money.of(new BigDecimal("100.00"));
        
        var result = money.percentage(10); // 10%
        
        assertThat(result.getAmount())
            .isEqualByComparingTo(new BigDecimal("10.00"));
    }
}
```

## Testando Entidades

Entidades têm identidade e ciclo de vida. Teste comportamento, transições de estado e invariantes.

### Exemplo: Entidade Account

```java
@DisplayName("Account Entity")
class AccountTest {
    
    @Nested
    @DisplayName("Account Creation")
    class AccountCreation {
        
        @Test
        @DisplayName("Should create new account with PENDING status")
        void shouldCreateAccountWithPendingStatus() {
            var account = Account.newAccount("João Silva", "12345");
            
            assertAll(
                () -> assertThat(account.getId()).isNotNull(),
                () -> assertThat(account.getStatus()).isEqualTo(AccountStatus.PENDING),
                () -> assertThat(account.getBalance()).isEqualByComparingTo(BigDecimal.ZERO)
            );
        }
        
        @Test
        @DisplayName("Should reject account creation with empty owner name")
        void shouldRejectEmptyOwnerName() {
            assertThrows(IllegalArgumentException.class,
                () -> Account.newAccount("", "12345"));
        }
    }
    
    @Nested
    @DisplayName("Account Activation")
    class AccountActivation {
        
        @Test
        @DisplayName("Should activate account after email confirmation")
        void shouldActivateAfterEmailConfirmation() {
            var account = Account.newAccount("João Silva", "12345");
            
            account.confirmEmail();
            
            assertThat(account.getStatus()).isEqualTo(AccountStatus.ACTIVE);
        }
        
        @Test
        @DisplayName("Should reject activation of already active account")
        void shouldRejectReactivation() {
            var account = Account.newAccount("João Silva", "12345");
            account.confirmEmail();
            
            assertThrows(AccountAlreadyActiveException.class,
                () -> account.confirmEmail());
        }
    }
    
    @Nested
    @DisplayName("Balance Operations")
    class BalanceOperations {
        
        private Account account;
        
        @BeforeEach
        void setup() {
            account = Account.newAccount("João Silva", "12345");
            account.confirmEmail();
        }
        
        @Test
        @DisplayName("Should increase balance on deposit")
        void shouldIncreaseBalanceOnDeposit() {
            var depositAmount = new BigDecimal("100.00");
            
            account.deposit(depositAmount);
            
            assertThat(account.getBalance())
                .isEqualByComparingTo(depositAmount);
        }
        
        @Test
        @DisplayName("Should decrease balance on withdrawal")
        void shouldDecreaseBalanceOnWithdrawal() {
            account.deposit(new BigDecimal("200.00"));
            
            account.withdraw(new BigDecimal("50.00"));
            
            assertThat(account.getBalance())
                .isEqualByComparingTo(new BigDecimal("150.00"));
        }
        
        @Test
        @DisplayName("Should reject withdrawal when balance is insufficient")
        void shouldRejectWithdrawalWhenInsufficientBalance() {
            account.deposit(new BigDecimal("50.00"));
            
            assertThrows(InsufficientBalanceException.class,
                () -> account.withdraw(new BigDecimal("100.00")));
        }
        
        @Test
        @DisplayName("Should reject deposit of negative amount")
        void shouldRejectNegativeDeposit() {
            assertThrows(IllegalArgumentException.class,
                () -> account.deposit(new BigDecimal("-10.00")));
        }
        
        @Test
        @DisplayName("Should reject operations on inactive account")
        void shouldRejectOperationsOnInactiveAccount() {
            var inactiveAccount = Account.newAccount("Maria", "54321");
            
            assertThrows(AccountNotActiveException.class,
                () -> inactiveAccount.deposit(new BigDecimal("100.00")));
        }
    }
}
```

## Testando Aggregates

Aggregates garantem limites de consistência. Teste invariantes dentro do aggregate.

### Exemplo: Order Aggregate

```java
@DisplayName("Order Aggregate")
class OrderTest {
    
    @Test
    @DisplayName("Should create order with initial items")
    void shouldCreateOrderWithItems() {
        var items = List.of(
            OrderItem.of("Product A", 2, new BigDecimal("50.00")),
            OrderItem.of("Product B", 1, new BigDecimal("30.00"))
        );
        
        var order = Order.create(customerId(), items);
        
        assertAll(
            () -> assertThat(order.getItems()).hasSize(2),
            () -> assertThat(order.getTotal())
                .isEqualByComparingTo(new BigDecimal("130.00")),
            () -> assertThat(order.getStatus()).isEqualTo(OrderStatus.DRAFT)
        );
    }
    
    @Test
    @DisplayName("Should recalculate total when adding item")
    void shouldRecalculateTotalWhenAddingItem() {
        var order = Order.create(customerId(), List.of(
            OrderItem.of("Product A", 1, new BigDecimal("100.00"))
        ));
        
        order.addItem(OrderItem.of("Product B", 2, new BigDecimal("50.00")));
        
        assertThat(order.getTotal())
            .isEqualByComparingTo(new BigDecimal("200.00"));
    }
    
    @Test
    @DisplayName("Should reject order submission without items")
    void shouldRejectEmptyOrderSubmission() {
        var order = Order.create(customerId(), List.of());
        
        assertThrows(EmptyOrderException.class, () -> order.submit());
    }
    
    @Test
    @DisplayName("Should transition to SUBMITTED status on submission")
    void shouldTransitionToSubmittedStatus() {
        var order = orderWithItems();
        
        order.submit();
        
        assertThat(order.getStatus()).isEqualTo(OrderStatus.SUBMITTED);
    }
    
    @Test
    @DisplayName("Should reject item addition after submission")
    void shouldRejectItemAdditionAfterSubmission() {
        var order = orderWithItems();
        order.submit();
        
        assertThrows(OrderAlreadySubmittedException.class,
            () -> order.addItem(OrderItem.of("Product C", 1, new BigDecimal("10.00"))));
    }
    
    @Test
    @DisplayName("Should apply discount only to draft orders")
    void shouldApplyDiscountOnlyToDraftOrders() {
        var order = orderWithItems();
        order.submit();
        
        assertThrows(OrderNotEditableException.class,
            () -> order.applyDiscount(new BigDecimal("10.00")));
    }
}
```

## Testando Domain Services

Domain services contêm lógica de negócio que não cabe naturalmente em uma única entidade.

### Exemplo: Price Calculator Service

```java
@DisplayName("Price Calculator Service")
class PriceCalculatorServiceTest {
    
    private PriceCalculatorService calculator;
    
    @BeforeEach
    void setup() {
        calculator = new PriceCalculatorService();
    }
    
    @Nested
    @DisplayName("Regular Customer Pricing")
    class RegularCustomerPricing {
        
        @Test
        @DisplayName("Should apply no discount for orders under R$1000")
        void shouldApplyNoDiscountForSmallOrders() {
            var customer = regularCustomer();
            var orderValue = new BigDecimal("500.00");
            
            var finalPrice = calculator.calculateFinalPrice(customer, orderValue);
            
            assertThat(finalPrice).isEqualByComparingTo(orderValue);
        }
        
        @Test
        @DisplayName("Should apply 5% discount for orders over R$1000")
        void shouldApply5PercentDiscount() {
            var customer = regularCustomer();
            var orderValue = new BigDecimal("1500.00");
            
            var finalPrice = calculator.calculateFinalPrice(customer, orderValue);
            
            assertThat(finalPrice)
                .isEqualByComparingTo(new BigDecimal("1425.00")); // 5% off
        }
    }
    
    @Nested
    @DisplayName("VIP Customer Pricing")
    class VipCustomerPricing {
        
        @Test
        @DisplayName("Should apply 10% discount for VIP customers")
        void shouldApply10PercentDiscountForVip() {
            var customer = vipCustomer();
            var orderValue = new BigDecimal("1000.00");
            
            var finalPrice = calculator.calculateFinalPrice(customer, orderValue);
            
            assertThat(finalPrice)
                .isEqualByComparingTo(new BigDecimal("900.00")); // 10% off
        }
        
        @Test
        @DisplayName("Should apply maximum 15% discount for VIP on large orders")
        void shouldCapDiscountAt15Percent() {
            var customer = vipCustomer();
            var orderValue = new BigDecimal("10000.00");
            
            var finalPrice = calculator.calculateFinalPrice(customer, orderValue);
            
            assertThat(finalPrice)
                .isEqualByComparingTo(new BigDecimal("8500.00")); // Max 15% off
        }
    }
    
    @ParameterizedTest
    @CsvSource({
        "REGULAR, 500.00,   500.00",
        "REGULAR, 1500.00,  1425.00",
        "VIP,     1000.00,  900.00",
        "VIP,     10000.00, 8500.00"
    })
    @DisplayName("Should calculate correct final price for customer tier and amount")
    void shouldCalculateCorrectPriceForTierAndAmount(
            CustomerTier tier, 
            BigDecimal orderValue, 
            BigDecimal expectedPrice) {
        
        var customer = customerWithTier(tier);
        
        var finalPrice = calculator.calculateFinalPrice(customer, orderValue);
        
        assertThat(finalPrice).isEqualByComparingTo(expectedPrice);
    }
}
```

## Testando Domain Events

Verifique que domain events são emitidos corretamente quando o estado do domínio muda.

```java
@DisplayName("Order Domain Events")
class OrderEventsTest {
    
    @Test
    @DisplayName("Should emit OrderSubmittedEvent when order is submitted")
    void shouldEmitOrderSubmittedEvent() {
        var order = orderWithItems();
        
        order.submit();
        
        assertThat(order.getDomainEvents())
            .hasSize(1)
            .first()
            .isInstanceOf(OrderSubmittedEvent.class)
            .extracting("orderId", "customerId", "total")
            .containsExactly(
                order.getId(), 
                order.getCustomerId(), 
                order.getTotal()
            );
    }
    
    @Test
    @DisplayName("Should emit OrderCancelledEvent with cancellation reason")
    void shouldEmitOrderCancelledEvent() {
        var order = submittedOrder();
        var reason = "Customer requested cancellation";
        
        order.cancel(reason);
        
        assertThat(order.getDomainEvents())
            .filteredOn(event -> event instanceof OrderCancelledEvent)
            .first()
            .extracting("reason")
            .isEqualTo(reason);
    }
    
    @Test
    @DisplayName("Should clear domain events after retrieval")
    void shouldClearEventsAfterRetrieval() {
        var order = orderWithItems();
        order.submit();
        
        order.getDomainEvents(); // First retrieval
        var eventsAfterClear = order.getDomainEvents();
        
        assertThat(eventsAfterClear).isEmpty();
    }
}
```

## Helpers e Test Data Builders

Crie builders reutilizáveis para objetos de domínio complexos:

```java
// Test helper class
class CustomerTestBuilder {
    private String name = "Default Customer";
    private Cpf cpf = new Cpf("111.444.777-35");
    private LocalDate birthDate = LocalDate.now().minusYears(25);
    private CustomerTier tier = CustomerTier.REGULAR;
    
    public static CustomerTestBuilder aCustomer() {
        return new CustomerTestBuilder();
    }
    
    public CustomerTestBuilder withName(String name) {
        this.name = name;
        return this;
    }
    
    public CustomerTestBuilder withCpf(String cpf) {
        this.cpf = new Cpf(cpf);
        return this;
    }
    
    public CustomerTestBuilder withAge(int years) {
        this.birthDate = LocalDate.now().minusYears(years);
        return this;
    }
    
    public CustomerTestBuilder vip() {
        this.tier = CustomerTier.VIP;
        return this;
    }
    
    public Customer build() {
        return Customer.builder()
            .name(name)
            .cpf(cpf)
            .birthDate(birthDate)
            .tier(tier)
            .build();
    }
}

// Usage in tests
@Test
void testVipCustomerDiscount() {
    var customer = aCustomer()
        .withName("João Silva")
        .withAge(30)
        .vip()
        .build();
    
    // ... test logic
}
```

## Principais pontos

1. **Value Objects**: Teste validação, formatação e igualdade por valor
2. **Entidades**: Teste identidade, transições de estado e ciclo de vida
3. **Aggregates**: Teste limites de consistência e invariantes
4. **Domain Services**: Teste regras de negócio complexas e cálculos
5. **Domain Events**: Verifique que eventos são emitidos nas mudanças de estado
6. **Use Builders**: Crie dados de teste legíveis com builder pattern
7. **Teste invariantes**: Garanta que regras do domínio não possam ser violadas
8. **Imutabilidade**: Verifique que value objects são realmente imutáveis
