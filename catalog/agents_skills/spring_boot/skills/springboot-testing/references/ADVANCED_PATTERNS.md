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
```

### CSV Source

```java
@ParameterizedTest
@CsvSource({
    "REGULAR, 500.00,   500.00",
    "REGULAR, 1500.00,  1425.00",  // 5% discount
    "VIP,     1000.00,  900.00"    // 10% discount
})
@DisplayName("Should calculate correct discount for customer tier and amount")
void shouldCalculateDiscount(CustomerTier tier, BigDecimal amount, BigDecimal expected) {
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
        Arguments.of(paymentWithNegativeAmount(), InvalidAmountException.class)
    );
}
```

## Testes de Exceção

### Teste de Causa de Exceção

```java
@Test
@DisplayName("Should wrap external exception with context")
void shouldWrapExternalException() {
    when(externalService.call()).thenThrow(new IOException("Network error"));
    
    var exception = assertThrows(ServiceUnavailableException.class,
        () -> adapter.callExternalService());
    
    assertAll(
        () -> assertThat(exception.getMessage()).contains("External service unavailable"),
        () -> assertThat(exception.getCause()).isInstanceOf(IOException.class)
    );
}
```

## Builders de Dados de Teste (Object Mother)

Centralize a criação de dados de teste para evitar repetição.

```java
public class PaymentMother {
    public static Payment validPayment() {
        return Payment.builder()
            .accountId("ACC-12345")
            .amount(new BigDecimal("100.00"))
            .description("Valid payment")
            .build();
    }
}
```

## Recursos Avançados do AssertJ

### Soft Assertions

```java
@Test
void shouldValidateAllCustomerProperties() {
    var customer = service.findById("CUST-001");
    
    SoftAssertions.assertSoftly(softly -> {
        softly.assertThat(customer.getName()).isEqualTo("João Silva");
        softly.assertThat(customer.getAge()).isGreaterThan(18);
        softly.assertThat(customer.isActive()).isTrue();
    });
}
```

---
> [!TIP]
> **Testes Parametrizados**: Use-os sempre que tiver uma lógica que precisa ser validada com diversos inputs (ex: validadores de CPF, calculadoras de taxas). Isso reduz drasticamente a quantidade de código de teste repetido.

