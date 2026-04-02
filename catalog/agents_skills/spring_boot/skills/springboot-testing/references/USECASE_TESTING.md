# Testes de UseCase

Guia abrangente para testar UseCases (Application Services) em Arquitetura Hexagonal. UseCases orquestram a lógica de domínio e coordenam interações entre ports.

## O que testar em UseCases

### ✅ Deve testar
- Orquestração da lógica de negócio.
- Colaboração entre ports (entrada/saída).
- Tratamento de erros e cenários excepcionais.
- Regras de validação e limites de transação.

### ❌ Não deve testar
- Implementações reais de ports (use Mocks).
- Código específico de framework (Spring, JPA).

## Estrutura de teste de UseCase (Mockito)

```java
@ExtendWith(MockitoExtension.class)
@DisplayName("Process Payment - UseCase")
class ProcessPaymentUseCaseTest {
    
    @Mock
    private FindAccountPort findAccountPort;
    
    @Mock
    private ExecuteTransferPort executeTransferPort;
    
    @InjectMocks
    private ProcessPaymentUseCase useCase;

    @Test
    @DisplayName("Should process payment successfully")
    void shouldProcessPaymentSuccessfully() {
        // Arrange
        var payment = validPayment();
        when(findAccountPort.findById(any())).thenReturn(Optional.of(validAccount()));
        
        // Act
        var result = useCase.process(payment);
        
        // Assert
        assertThat(result.getStatus()).isEqualTo(PaymentStatus.APPROVED);
        verify(executeTransferPort).execute(any());
    }
}
```

## Cenários de Falha (Unhappy Path)

```java
@Test
@DisplayName("Should reject payment when account not found")
void shouldRejectPaymentWhenAccountNotFound() {
    // Arrange
    when(findAccountPort.findById(any())).thenReturn(Optional.empty());
    
    // Act & Assert
    assertThrows(AccountNotFoundException.class, () -> useCase.process(validPayment()));
    
    // Verify no further processing happened
    verifyNoInteractions(executeTransferPort);
}
```

---
> [!TIP]
> **Mock apenas de Ports**: Nunca faça mock de suas entidades de domínio ou value objects. Use os objetos reais para garantir que a lógica de domínio interna também seja validada durante o teste do UseCase.
