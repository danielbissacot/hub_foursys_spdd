---
name: 'springboot-rest-client'
description: "Implementa chamadas HTTP síncronas com RestClient (Spring Boot 3.2+) no padrão Hexagonal. Distinto do Feign Client — use RestClient para chamadas imperativas pontuais sem a cerimônia de uma interface declarativa. Cobre builder pattern, interceptors, error handling e adapter OutputPort."
metadata:
  version: "0.1.0"
---

# Skill: springboot-rest-client

Guia para **`RestClient`** (Spring Boot 3.2+) como cliente HTTP síncrono e imperativo na Arquitetura Hexagonal.

> **Quando escolher RestClient vs Feign:**
> - `RestClient` → chamadas pontuais, scripts, integrações simples sem necessidade de interface declarativa
> - `springboot-feign-client` → múltiplos endpoints do mesmo serviço, circuit breaker, retry automático, equipe grande

> **Invocado por:** `foursys-specify-tech.md` Spring Boot quando a história requer chamada HTTP síncrona sem cerimônia de Feign.

---

## Quando usar

- Integração com 1-2 endpoints de um serviço externo sem necessidade de declaratividade Feign.
- Scripts de migração, tarefas de inicialização ou chamadas administrativas pontuais.
- Projetos que preferem evitar dependência de Spring Cloud OpenFeign.

## Quando não usar

- Múltiplos endpoints do mesmo serviço com necessidade de circuit breaker → use `springboot-feign-client`.
- Chamadas assíncronas ou reativas → use `WebClient`.
- Mensageria → use `springboot-kafka` ou `springboot-service-bus`.

---

## Estrutura de Arquivos (Hexagonal)

```
adapter/output/client/
├── <NomeDoSistema>RestClientAdapter.java   ← Implementa OutputPort
└── dto/
    ├── <Recurso>Request.java               ← Record request
    └── <Recurso>Response.java              ← Record response

config/
└── <NomeDoSistema>RestClientConfig.java    ← Configuração do RestClient
```

---

## Implementação

### 1. Dependência

`RestClient` está incluído no `spring-boot-starter-web` desde Spring Boot 3.2 — sem dependência adicional.

---

### 2. Configuração do RestClient

```java
// FILEPATH: config/PagamentoRestClientConfig.java
@Configuration
public class PagamentoRestClientConfig {

    @Value("${integrations.pagamento.url}")
    private String baseUrl;

    @Value("${integrations.pagamento.api-key}")
    private String apiKey;

    @Bean
    public RestClient pagamentoRestClient() {
        return RestClient.builder()
            .baseUrl(baseUrl)
            .defaultHeader("Authorization", "Bearer " + apiKey)
            .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader("Accept", MediaType.APPLICATION_JSON_VALUE)
            .defaultStatusHandler(HttpStatusCode::isError, (request, response) -> {
                throw new IntegracaoException(
                    "Erro na integração de pagamento: HTTP " + response.getStatusCode()
                );
            })
            .build();
    }
}
```

---

### 3. DTOs (Records Java 21)

```java
// FILEPATH: adapter/output/client/dto/ConsultaSaldoRequest.java
public record ConsultaSaldoRequest(
    @NotBlank String conta,
    @NotBlank String agencia
) {}

// FILEPATH: adapter/output/client/dto/ConsultaSaldoResponse.java
public record ConsultaSaldoResponse(
    BigDecimal saldo,         // SEMPRE BigDecimal para valores monetários
    LocalDateTime consultadoEm
) {}
```

---

### 4. Adapter (OutputPort)

```java
// FILEPATH: adapter/output/client/PagamentoRestClientAdapter.java
@Component
@RequiredArgsConstructor
@Slf4j
public class PagamentoRestClientAdapter implements SaldoConsultaOutputPort {

    private final RestClient pagamentoRestClient;

    @Override
    public Saldo consultarSaldo(String conta, String agencia) {
        log.info("Consultando saldo. conta=**** agencia={}", agencia);

        var request = new ConsultaSaldoRequest(conta, agencia);

        var response = pagamentoRestClient
            .post()
            .uri("/v1/saldos/consulta")
            .body(request)
            .retrieve()
            .body(ConsultaSaldoResponse.class);

        if (response == null) {
            throw new IntegracaoException("Resposta vazia da consulta de saldo");
        }

        return new Saldo(response.saldo(), response.consultadoEm());
    }
}
```

---

### 5. Chamadas GET com parâmetros de query

```java
var response = restClient
    .get()
    .uri(uriBuilder -> uriBuilder
        .path("/v1/produtos")
        .queryParam("status", "ATIVO")
        .queryParam("pagina", 0)
        .queryParam("tamanho", 20)
        .build())
    .retrieve()
    .body(new ParameterizedTypeReference<List<ProdutoResponse>>() {});
```

---

### 6. Tratamento de Erros com onStatus()

```java
var response = restClient
    .get()
    .uri("/v1/clientes/{id}", clienteId)
    .retrieve()
    .onStatus(status -> status.value() == 404,
        (req, res) -> { throw new ClienteNaoEncontradoException(clienteId); })
    .onStatus(status -> status.value() == 422,
        (req, res) -> { throw new ClienteInativoException(clienteId); })
    .body(ClienteResponse.class);
```

---

### 7. application.yml

```yaml
integrations:
  pagamento:
    url: ${PAGAMENTO_SERVICE_URL:http://localhost:8081}
    api-key: ${PAGAMENTO_API_KEY}
    timeout-ms: ${PAGAMENTO_TIMEOUT_MS:5000}
```

---

## Diferenças RestClient vs Feign

| Critério | RestClient | Feign Client |
|---|---|---|
| Estilo | Imperativo (builder) | Declarativo (interface + anotações) |
| Circuit Breaker | Manual (via `@CircuitBreaker`) | Integrado (Resilience4j automático) |
| Retry automático | Manual (via `@Retry`) | Configurável por instância |
| Múltiplos endpoints | Verboso | Natural (método por endpoint) |
| Spring Cloud dep. | Não | Sim |
| Ideal para | 1-3 endpoints pontuais | Serviços com 4+ endpoints |

---

## Segurança PII

- **NUNCA** logue valores de conta, CPF, tokens ou chaves de API.
- Use `****` nos logs para dados sensíveis.
- Não inclua a `api-key` no log de configuração do RestClient.

---

## Checklist de Implementação

- [ ] `RestClient` configurado como `@Bean` em `config/` (não instanciar direto)
- [ ] `baseUrl` e `api-key` como variáveis de ambiente
- [ ] `defaultStatusHandler` para erros HTTP genéricos
- [ ] DTOs como Records Java 21 com Bean Validation
- [ ] Adapter implementando `OutputPort` no `adapter/output/client/`
- [ ] `.onStatus()` para erros de negócio específicos (404, 422)
- [ ] Nenhum dado PII logado
- [ ] Testes unitários com `MockRestServiceServer` (cobertura ≥ 95%)
