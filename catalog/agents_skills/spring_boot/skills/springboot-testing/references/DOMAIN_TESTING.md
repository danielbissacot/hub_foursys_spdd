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

## Testando Value Objects (Imutabilidade e Valor)

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
    @DisplayName("Should compare CPFs by value, not reference")
    void shouldCompareByValue() {
        var cpf1 = new Cpf("111.444.777-35");
        var cpf2 = new Cpf("111.444.777-35");
        
        assertThat(cpf1).isEqualTo(cpf2);
        assertThat(cpf1.hashCode()).isEqualTo(cpf2.hashCode());
    }
}
```

## Testando Entidades (Estado e Ciclo de Vida)

```java
@DisplayName("Account Entity")
class AccountTest {
    
    @Test
    @DisplayName("Should increase balance on deposit")
    void shouldIncreaseBalanceOnDeposit() {
        var account = Account.newAccount("João Silva", "12345");
        account.confirmEmail();
        
        var depositAmount = new BigDecimal("100.00");
        account.deposit(depositAmount);
        
        assertThat(account.getBalance()).isEqualByComparingTo(depositAmount);
    }
}
```

## Testando Aggregates (Consistência)

```java
@DisplayName("Order Aggregate")
class OrderTest {
    
    @Test
    @DisplayName("Should recalculate total when adding item")
    void shouldRecalculateTotalWhenAddingItem() {
        var order = Order.create(customerId(), List.of(
            OrderItem.of("Product A", 1, new BigDecimal("100.00"))
        ));
        
        order.addItem(OrderItem.of("Product B", 2, new BigDecimal("50.00")));
        
        assertThat(order.getTotal()).isEqualByComparingTo(new BigDecimal("200.00"));
    }
}
```

---
> [!TIP]
> **Domain First**: Os testes de domínio devem ser os primeiros a serem escritos. Eles são puramente Java (POJOs), rápidos de executar e não dependem de nenhum framework (Spring, JPA, etc.), o que os torna ideais para TDD.

