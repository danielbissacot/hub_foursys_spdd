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
    
    @Test
    @DisplayName("Should return 400 when amount is zero")
    void shouldReturn400WhenAmountIsZero() throws Exception {
        var request = paymentRequestWithAmount(BigDecimal.ZERO);
        
        mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors[?(@.field=='amount')].message")
                .value(hasItem("Amount must be greater than zero")));
    }
    
    @Test
    @DisplayName("Should return 400 with multiple validation errors")
    void shouldReturn400WithMultipleErrors() throws Exception {
        var request = """
            {
                "accountId": "",
                "amount": -10,
                "description": ""
            }
            """;
        
        mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors").isArray())
            .andExpect(jsonPath("$.errors.length()").value(greaterThanOrEqualTo(3)))
            .andExpect(jsonPath("$.errors[*].field")
                .value(hasItems("accountId", "amount", "description")));
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
                .value(containsString("Account ACC-99999 not found")))
            .andExpect(jsonPath("$.timestamp").exists())
            .andExpect(jsonPath("$.path").value("/api/v1/payments"));
    }
    
    @Test
    @DisplayName("Should return 422 when insufficient balance")
    void shouldReturn422WhenInsufficientBalance() throws Exception {
        var request = validPaymentRequest();
        when(processPaymentUseCase.process(any()))
            .thenThrow(new InsufficientBalanceException(
                "Available: R$ 50.00, Required: R$ 100.00"));
        
        mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnprocessableEntity())
            .andExpect(jsonPath("$.error").value("INSUFFICIENT_BALANCE"))
            .andExpect(jsonPath("$.message")
                .value(containsString("Available: R$ 50.00")));
    }
    
    @Test
    @DisplayName("Should return 409 when duplicate payment detected")
    void shouldReturn409OnDuplicatePayment() throws Exception {
        var request = validPaymentRequest();
        when(processPaymentUseCase.process(any()))
            .thenThrow(new DuplicatePaymentException("Payment already processed"));
        
        mockMvc.perform(post("/api/v1/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.error").value("DUPLICATE_PAYMENT"));
    }
}
```

### Testando Endpoints GET

```java
@Nested
@DisplayName("GET /api/v1/payments/{id}")
class GetPaymentById {
    
    @MockBean
    private FindPaymentUseCase findPaymentUseCase;
    
    @Test
    @DisplayName("Should return 200 with payment details")
    void shouldReturn200WithPaymentDetails() throws Exception {
        var paymentId = "PAY-12345";
        var payment = existingPayment(paymentId);
        
        when(findPaymentUseCase.findById(paymentId))
            .thenReturn(Optional.of(payment));
        
        mockMvc.perform(get("/api/v1/payments/{id}", paymentId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(paymentId))
            .andExpect(jsonPath("$.amount").value(payment.getAmount().doubleValue()))
            .andExpect(jsonPath("$.status").value(payment.getStatus().name()));
    }
    
    @Test
    @DisplayName("Should return 404 when payment not found")
    void shouldReturn404WhenNotFound() throws Exception {
        var paymentId = "PAY-99999";
        when(findPaymentUseCase.findById(paymentId))
            .thenReturn(Optional.empty());
        
        mockMvc.perform(get("/api/v1/payments/{id}", paymentId))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message")
                .value(containsString("Payment not found")));
    }
}
```

### Testando Parâmetros de Query e Filtros

```java
@Test
@DisplayName("Should filter payments by status and date range")
void shouldFilterPayments() throws Exception {
    var payments = List.of(approvedPayment(), approvedPayment());
    when(findPaymentUseCase.findByFilters(any()))
        .thenReturn(payments);
    
    mockMvc.perform(get("/api/v1/payments")
            .param("status", "APPROVED")
            .param("startDate", "2024-01-01")
            .param("endDate", "2024-12-31")
            .param("page", "0")
            .param("size", "20"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content").isArray())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(jsonPath("$.totalElements").value(2))
        .andExpect(jsonPath("$.size").value(20))
        .andExpect(jsonPath("$.number").value(0));
    
    verify(findPaymentUseCase).findByFilters(argThat(filter ->
        filter.getStatus().equals(PaymentStatus.APPROVED) &&
        filter.getStartDate().equals(LocalDate.of(2024, 1, 1)) &&
        filter.getEndDate().equals(LocalDate.of(2024, 12, 31))
    ));
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

### Testando Operações CRUD

```java
@Test
@DisplayName("Should save payment and generate ID")
void shouldSavePaymentAndGenerateId() {
    // Arrange
    var payment = PaymentEntity.builder()
        .accountId("ACC-12345")
        .amount(new BigDecimal("100.00"))
        .status(PaymentStatus.PENDING)
        .build();
    
    // Act
    var savedPayment = repository.save(payment);
    entityManager.flush();
    
    // Assert
    assertAll(
        () -> assertThat(savedPayment.getId()).isNotNull(),
        () -> assertThat(savedPayment.getCreatedAt()).isNotNull(),
        () -> assertThat(savedPayment.getVersion()).isEqualTo(0L)
    );
}

@Test
@DisplayName("Should find payment by ID")
void shouldFindPaymentById() {
    var payment = createAndPersistPayment();
    
    var found = repository.findById(payment.getId());
    
    assertThat(found)
        .isPresent()
        .get()
        .extracting("accountId", "amount", "status")
        .containsExactly(payment.getAccountId(), payment.getAmount(), payment.getStatus());
}

@Test
@DisplayName("Should update payment status")
void shouldUpdatePaymentStatus() {
    var payment = createAndPersistPayment();
    
    payment.setStatus(PaymentStatus.APPROVED);
    repository.save(payment);
    entityManager.flush();
    entityManager.clear();
    
    var updated = repository.findById(payment.getId()).orElseThrow();
    assertThat(updated.getStatus()).isEqualTo(PaymentStatus.APPROVED);
}

@Test
@DisplayName("Should delete payment")
void shouldDeletePayment() {
    var payment = createAndPersistPayment();
    
    repository.deleteById(payment.getId());
    entityManager.flush();
    
    var found = repository.findById(payment.getId());
    assertThat(found).isEmpty();
}
```

### Testando Queries Customizadas

```java
@Test
@DisplayName("Should find payments by account ID")
void shouldFindByAccountId() {
    var accountId = "ACC-12345";
    createAndPersistPayment(accountId, new BigDecimal("100.00"));
    createAndPersistPayment(accountId, new BigDecimal("200.00"));
    createAndPersistPayment("ACC-99999", new BigDecimal("50.00"));
    
    var payments = repository.findByAccountId(accountId);
    
    assertThat(payments)
        .hasSize(2)
        .allMatch(p -> p.getAccountId().equals(accountId));
}

@Test
@DisplayName("Should find payments by status and date range")
void shouldFindByStatusAndDateRange() {
    var startDate = LocalDate.of(2024, 1, 1).atStartOfDay();
    var endDate = LocalDate.of(2024, 12, 31).atTime(23, 59, 59);
    
    createPaymentWithDate(PaymentStatus.APPROVED, startDate.plusDays(10));
    createPaymentWithDate(PaymentStatus.APPROVED, startDate.plusDays(20));
    createPaymentWithDate(PaymentStatus.REJECTED, startDate.plusDays(15));
    createPaymentWithDate(PaymentStatus.APPROVED, startDate.minusDays(5));
    
    var payments = repository.findByStatusAndCreatedAtBetween(
        PaymentStatus.APPROVED, startDate, endDate);
    
    assertThat(payments)
        .hasSize(2)
        .allMatch(p -> p.getStatus().equals(PaymentStatus.APPROVED))
        .allMatch(p -> p.getCreatedAt().isAfter(startDate) && 
                      p.getCreatedAt().isBefore(endDate));
}
```

### Testando Optimistic Locking

```java
@Test
@DisplayName("Should handle concurrent updates with optimistic locking")
void shouldHandleConcurrentUpdates() {
    var payment = createAndPersistPayment();
    
    // Simulate two concurrent updates
    var payment1 = repository.findById(payment.getId()).orElseThrow();
    var payment2 = repository.findById(payment.getId()).orElseThrow();
    
    payment1.setStatus(PaymentStatus.APPROVED);
    repository.save(payment1);
    entityManager.flush();
    
    payment2.setStatus(PaymentStatus.REJECTED);
    
    assertThrows(OptimisticLockException.class, () -> {
        repository.save(payment2);
        entityManager.flush();
    });
}
```

## Testes de HTTP Client (Output Adapter)

Teste clientes de API externa usando MockRestServiceServer ou WireMock.

### Teste de RestClient com MockRestServiceServer

```java
@SpringBootTest
@DisplayName("External Payment Gateway Client")
class PaymentGatewayClientTest {
    
    @Autowired
    private PaymentGatewayClient client;
    
    @Autowired
    private RestTemplate restTemplate;
    
    private MockRestServiceServer mockServer;
    
    @BeforeEach
    void setup() {
        mockServer = MockRestServiceServer.createServer(restTemplate);
    }
    
    @Test
    @DisplayName("Should process payment successfully via external API")
    void shouldProcessPaymentSuccessfully() {
        // Arrange
        var request = validGatewayRequest();
        var expectedResponse = """
            {
                "transactionId": "TXN-12345",
                "status": "APPROVED",
                "authorizationCode": "AUTH-ABC123"
            }
            """;
        
        mockServer.expect(requestTo("https://api.gateway.com/v1/payments"))
            .andExpect(method(HttpMethod.POST))
            .andExpect(header("Authorization", "Bearer test-token"))
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andRespond(withSuccess(expectedResponse, MediaType.APPLICATION_JSON));
        
        // Act
        var response = client.processPayment(request);
        
        // Assert
        mockServer.verify();
        assertAll(
            () -> assertThat(response.getTransactionId()).isEqualTo("TXN-12345"),
            () -> assertThat(response.getStatus()).isEqualTo("APPROVED"),
            () -> assertThat(response.getAuthorizationCode()).isEqualTo("AUTH-ABC123")
        );
    }
    
    @Test
    @DisplayName("Should handle 4xx errors from external API")
    void shouldHandle4xxErrors() {
        var request = invalidGatewayRequest();
        
        mockServer.expect(requestTo("https://api.gateway.com/v1/payments"))
            .andExpect(method(HttpMethod.POST))
            .andRespond(withBadRequest()
                .body("{\"error\": \"INVALID_CARD\"}")
                .contentType(MediaType.APPLICATION_JSON));
        
        assertThrows(PaymentGatewayException.class, 
            () -> client.processPayment(request));
        
        mockServer.verify();
    }
    
    @Test
    @DisplayName("Should retry on 5xx errors")
    void shouldRetryOn5xxErrors() {
        var request = validGatewayRequest();
        
        mockServer.expect(times(2), requestTo("https://api.gateway.com/v1/payments"))
            .andRespond(withServerError());
        
        mockServer.expect(requestTo("https://api.gateway.com/v1/payments"))
            .andRespond(withSuccess("{\"transactionId\": \"TXN-12345\", \"status\": \"APPROVED\"}", 
                MediaType.APPLICATION_JSON));
        
        var response = client.processPayment(request);
        
        assertThat(response.getTransactionId()).isEqualTo("TXN-12345");
        mockServer.verify();
    }
}
```

## Principais pontos

1. **REST Controllers**: Teste preocupações HTTP, não lógica de negócio
2. **Validation**: Verifique se Bean Validation funciona corretamente
3. **Status Codes**: Garanta códigos HTTP corretos para cada cenário
4. **Error Handling**: Teste mapeamento de exceções para respostas HTTP
5. **Repositories**: Use @DataJpaTest para testes leves de banco de dados
6. **Optimistic Locking**: Teste cenários de modificação concorrente
7. **HTTP Clients**: Faça mock de APIs externas com MockRestServiceServer
8. **Query Methods**: Teste queries customizadas de repository thoroughly
9. **Integration**: Use TestEntityManager para controlar estado do banco de dados
