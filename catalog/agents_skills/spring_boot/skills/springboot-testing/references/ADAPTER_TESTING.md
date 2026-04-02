# Testes de Adapter

Guia para testar Input e Output Adapters em Arquitetura Hexagonal, incluindo REST controllers, repositories e clientes externos.

## Testes de REST Controller (Input Adapter)

Teste preocupações da camada HTTP: mapeamento de requisições, validação, formatação de resposta, códigos de status.

### Configuração Básica de Teste de Controller

```java
@WebMvcTest(PaymentController.class)
@DisplayName("Payment REST Controller")
class PaymentControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private ProcessPaymentUseCase processPaymentUseCase;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Tests go here
}
```

### Testando Respostas de Sucesso

```java
@Nested
@DisplayName("POST /api/v1/payments - Success Scenarios")
class CreatePaymentSuccess {
    
    @Test
    @DisplayName("Should return 201 Created with payment details")
    void shouldReturn201OnSuccessfulPayment() throws Exception {
        // Arrange
        var request = new CreatePaymentRequest(
            "ACC-12345",
            new BigDecimal("100.00"),
            "Payment for services"
        );
        
        var payment = approvedPayment(request);
        when(processPaymentUseCase.process(any())).thenReturn(payment);
        
        // Act & Assert
        mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(header().exists("Location"))
            .andExpect(header().string("Location", 
                containsString("/api/v1/payments/" + payment.getId())))
            .andExpect(jsonPath("$.id").value(payment.getId()))
            .andExpect(jsonPath("$.status").value("APPROVED"))
            .andExpect(jsonPath("$.amount").value(100.00))
            .andExpect(jsonPath("$.transactionId").exists());
    }
    
    @Test
    @DisplayName("Should return correct response structure")
    void shouldReturnCorrectResponseStructure() throws Exception {
        var request = validPaymentRequest();
        when(processPaymentUseCase.process(any()))
            .thenReturn(approvedPayment(request));
        
        mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$").isMap())
            .andExpect(jsonPath("$.id").isString())
            .andExpect(jsonPath("$.status").isString())
            .andExpect(jsonPath("$.amount").isNumber())
            .andExpect(jsonPath("$.createdAt").isString())
            .andExpect(jsonPath("$.transactionId").isString());
    }
}
```

### Testando Erros de Validação

```java
@Nested
@DisplayName("POST /api/v1/payments - Validation Errors")
class CreatePaymentValidation {
    
    @Test
    @DisplayName("Should return 400 when account ID is null")
    void shouldReturn400WhenAccountIdIsNull() throws Exception {
        var request = """
            {
                "accountId": null,
                "amount": 100.00,
                "description": "Test"
            }
            """;
        
        mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors").isArray())
            .andExpect(jsonPath("$.errors[0].field").value("accountId"))
            .andExpect(jsonPath("$.errors[0].message")
                .value(containsString("must not be null")));
    }
    
    @Test
    @DisplayName("Should return 400 when amount is negative")
    void shouldReturn400WhenAmountIsNegative() throws Exception {
        var request = new CreatePaymentRequest(
            "ACC-12345",
            new BigDecimal("-50.00"),
            "Invalid payment"
        );
        
        mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors[*].field").value(hasItem("amount")))
            .andExpect(jsonPath("$.errors[*].message")
                .value(hasItem(containsString("must be positive"))));
    }
}
```

### Testando Erros de Lógica de Negócio

```java
@Nested
@DisplayName("POST /api/v1/payments - Business Errors")
class CreatePaymentBusinessErrors {
    
    @Test
    @DisplayName("Should return 404 when account not found")
    void shouldReturn404WhenAccountNotFound() throws Exception {
        var request = validPaymentRequest();
        when(processPaymentUseCase.process(any()))
            .thenThrow(new AccountNotFoundException("Account ACC-99999 not found"));
        
        mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message")
                .value(containsString("Account ACC-99999 not found")));
    }
}
```

## Testes de Repository (Output Adapter)

Teste implementações de JPA repository e interações com banco de dados.

### Configuração de Teste de JPA Repository

```java
@DataJpaTest
@DisplayName("Payment Repository")
class PaymentRepositoryTest {
    
    @Autowired
    private PaymentRepository repository;
    
    @Autowired
    private TestEntityManager entityManager;
    
    // Tests go here
}
```

## Testes de HTTP Client (Output Adapter)

Teste clientes de API externa usando MockRestServiceServer ou WireMock.

### Teste de Client com MockRestServiceServer

```java
@RestClientTest(ExternalGatewayClient.class)
@DisplayName("External Gateway Client")
class ExternalGatewayClientTest {
    
    @Autowired
    private ExternalGatewayClient client;
    
    @Autowired
    private MockRestServiceServer mockServer;
    
    @Test
    @DisplayName("Should process successfully via external API")
    void shouldProcessSuccessfully() {
        mockServer.expect(requestTo("https://api.gateway.com/v1/payments"))
            .andExpect(method(HttpMethod.POST))
            .andRespond(withSuccess("{\"id\": \"123\"}", MediaType.APPLICATION_JSON));
        
        var response = client.execute(new Request());
        
        assertThat(response.getId()).isEqualTo("123");
    }
}
```

---
> [!IMPORTANT]
> **Camada de Adapters**: O foco aqui é validar a fronteira do sistema. Garanta que o JSON que entra e sai está correto e que as integrações externas respondem como esperado aos erros.
