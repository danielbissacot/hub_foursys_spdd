---
name: 'springboot-feign-client'
description: "Implementa integração com APIs externas via Feign Client declarativo no padrão Hexagonal. Cobre configuração @FeignClient, DTOs de request/response, tratamento de erros com decoder customizado, circuit breaker Resilience4j e retry policy. Use quando a história precisar consumir uma API REST externa como OutputPort da camada de infraestrutura."
metadata:
  version: "0.1.0"
---

# Skill: springboot-feign-client

Guia completo para implementar adapters de saída via **Feign Client** em projetos Java 21 + Spring Boot 3.x com Arquitetura Hexagonal.

> **Invocado por:** `foursys-specify-tech.md` Spring Boot quando a história requer chamada a API externa via Feign.

---

## Quando usar

- A história precisa consumir uma API REST externa (sistema legado, microsserviço, parceiro, gateway).
- A integração é mapeada como **AIE (Arquivo de Interface Externa)** no APOIO APF.
- A chamada é síncrona e declarativa — se for reativa, prefira `RestClient` ou `WebClient`.

## Quando não usar

- Chamadas HTTP simples pontuais sem necessidade de declaratividade → use `springboot-rest-client`.
- Mensageria assíncrona → use `springboot-kafka` ou `springboot-service-bus`.
- Chamadas dentro do mesmo serviço (loop interno).

---

## Estrutura de Arquivos (Hexagonal)

```
adapter/output/client/
├── <NomeDoSistema>Client.java          ← Interface @FeignClient
├── dto/
│   ├── <Recurso>Request.java           ← Record request
│   └── <Recurso>Response.java          ← Record response
└── config/
    └── <NomeDoSistema>FeignConfig.java ← Configuração de autenticação/headers
```

---

## Implementação

### 1. Dependência (pom.xml)

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
</dependency>
```

Habilitar no Spring Boot Application:
```java
@EnableFeignClients
@SpringBootApplication
public class Application {}
```

---

### 2. Interface @FeignClient

```java
// FILEPATH: adapter/output/client/PagamentoClient.java
@FeignClient(
    name = "pagamento-service",
    url = "${integrations.pagamento.url}",
    configuration = PagamentoFeignConfig.class
)
public interface PagamentoClient {

    @PostMapping("/v1/pagamentos")
    PagamentoResponse realizarPagamento(@RequestBody PagamentoRequest request);

    @GetMapping("/v1/pagamentos/{id}")
    PagamentoResponse buscarPagamento(@PathVariable("id") String id);
}
```

---

### 3. DTOs (Records Java 21)

```java
// FILEPATH: adapter/output/client/dto/PagamentoRequest.java
public record PagamentoRequest(
    @NotBlank String codigoOperacao,
    @NotNull BigDecimal valor,        // SEMPRE BigDecimal para valores monetários
    @NotBlank String contaOrigem,
    @NotBlank String contaDestino
) {}

// FILEPATH: adapter/output/client/dto/PagamentoResponse.java
public record PagamentoResponse(
    String protocolo,
    String status,
    LocalDateTime dataProcessamento
) {}
```

---

### 4. Configuração de Autenticação

```java
// FILEPATH: adapter/output/client/config/PagamentoFeignConfig.java
@Configuration
public class PagamentoFeignConfig implements RequestInterceptor {

    @Value("${integrations.pagamento.api-key}")
    private String apiKey;

    @Override
    public void apply(RequestTemplate template) {
        template.header("Authorization", "Bearer " + apiKey);
        template.header("Content-Type", "application/json");
        template.header("X-Correlation-Id", UUID.randomUUID().toString());
    }
}
```

---

### 5. Decoder de Erros

```java
// FILEPATH: adapter/output/client/config/PagamentoFeignConfig.java (adicionar ao bean)
@Bean
public ErrorDecoder errorDecoder() {
    return (methodKey, response) -> switch (response.status()) {
        case 400 -> new PagamentoInvalidoException("Dados inválidos para pagamento");
        case 404 -> new PagamentoNaoEncontradoException("Pagamento não encontrado");
        case 422 -> new PagamentoRecusadoException("Pagamento recusado pela instituição");
        default  -> new IntegracaoException("Erro inesperado na integração de pagamento: " + response.status());
    };
}
```

---

### 6. Circuit Breaker + Retry (application.yml)

```yaml
resilience4j:
  circuitbreaker:
    instances:
      pagamento-service:
        registerHealthIndicator: true
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        permittedNumberOfCallsInHalfOpenState: 3
        waitDurationInOpenState: 5s
        failureRateThreshold: 50
        recordExceptions:
          - feign.FeignException$InternalServerError
          - feign.RetryableException
        ignoreExceptions:
          - br.com.foursys.exception.PagamentoInvalidoException
          - br.com.foursys.exception.PagamentoNaoEncontradoException
  retry:
    instances:
      pagamento-service:
        maxAttempts: 3
        waitDuration: 500ms
        retryExceptions:
          - feign.RetryableException

integrations:
  pagamento:
    url: ${PAGAMENTO_SERVICE_URL:http://localhost:8081}
    api-key: ${PAGAMENTO_API_KEY}
```

---

### 7. Adapter que usa o Feign Client (OutputPort)

```java
// FILEPATH: adapter/output/client/PagamentoClientAdapter.java
@Component
@RequiredArgsConstructor
public class PagamentoClientAdapter implements PagamentoOutputPort {

    private final PagamentoClient pagamentoClient;

    @Override
    @CircuitBreaker(name = "pagamento-service")
    @Retry(name = "pagamento-service")
    public PagamentoResultado realizarPagamento(Pagamento pagamento) {
        var request = new PagamentoRequest(
            pagamento.codigoOperacao(),
            pagamento.valor(),
            pagamento.contaOrigem(),
            pagamento.contaDestino()
        );
        var response = pagamentoClient.realizarPagamento(request);
        return new PagamentoResultado(response.protocolo(), response.status());
    }
}
```

---

## Segurança PII

- **NUNCA** logue `Authorization` headers, tokens, senhas ou chaves de API.
- Use `@ToString.Exclude` em campos sensíveis nos DTOs quando usar Lombok.
- Mascare CPF/conta nos logs: `***.***.***-XX`.

---

## Checklist de Implementação

- [ ] Dependência `spring-cloud-starter-openfeign` adicionada ao `pom.xml`
- [ ] `@EnableFeignClients` na classe principal
- [ ] Interface `@FeignClient` criada em `adapter/output/client/`
- [ ] DTOs como Records Java 21 com Bean Validation
- [ ] `FeignConfig` com interceptor de autenticação
- [ ] `ErrorDecoder` mapeando exceções de domínio
- [ ] Circuit Breaker + Retry configurados em `application.yml`
- [ ] Adapter implementando o `OutputPort` usando o Feign Client
- [ ] `@Bean` do Adapter registrado em `config/`
- [ ] Testes unitários com `@MockBean` do client (cobertura ≥ 95%)
- [ ] Nenhum dado PII logado
