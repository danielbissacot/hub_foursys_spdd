---
name: springboot-rest-client
description: Implementa chamadas HTTP síncronas usando RestClient em projetos Spring Boot. Use quando precisar realizar chamadas REST imperativas, configurar timeouts, interceptors, e tratamento de erros seguindo as melhores práticas do Bradesco.
metadata:
  version: "0.0.1"
---

# Spring Boot RestClient

Este skill fornece instruções detalhadas para implementar chamadas HTTP síncronas usando RestClient, a API moderna e fluente do Spring Boot que substitui o RestTemplate.

## Quando usar este skill

Use este skill quando:
- Precisar realizar chamadas HTTP síncronas em aplicações não-reativas
- Migrar de RestTemplate para a API moderna RestClient
- Configurar pool de conexões e timeouts otimizados
- Implementar interceptors para logs e tratamento de erros
- Seguir padrões de resiliência e boas práticas do Bradesco

**⚠️ IMPORTANTE**: 
- Para aplicações **reativas**, use `WebClient` ao invés de `RestClient`
- Para **integrações declarativas** com APIs externas, considere usar o [springboot-feign-client skill](../springboot-feign-client/SKILL.md)

## Comparação: RestClient vs Feign Client

| Aspecto | RestClient | Feign Client |
|---------|-----------|--------------|
| **Estilo** | Programático/Fluente | Declarativo/Anotações |
| **Uso recomendado** | Chamadas HTTP flexíveis e ad-hoc | Integrações estruturadas com APIs |
| **Configuração** | Por instância (builder) | Global + por client |
| **Circuit Breaker** | Manual (Resilience4j) | Integrado (fallback nativo) |
| **Código** | Mais verboso | Menos código |
| **Flexibilidade** | Muito alta | Média |

**Escolha RestClient quando**: Precisa de controle fino sobre requisições, URLs dinâmicas, ou chamadas pontuais.
**Escolha Feign quando**: Integração bem definida, contrato de API estável, múltiplos endpoints da mesma API.

## Dependências necessárias

RestClient está disponível no Spring Boot 3.2+. Adicione as dependências no `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Cliente HTTP recomendado: Apache HttpClient 5 -->
<dependency>
    <groupId>org.apache.httpcomponents.client5</groupId>
    <artifactId>httpclient5</artifactId>
</dependency>

<!-- Opcional: para métricas e observabilidade -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- Opcional: para Circuit Breaker -->
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
    <version>2.1.0</version>
</dependency>
```

## Estrutura recomendada

### Arquitetura Hexagonal (Recomendada)

```
br.com.bradesco.projeto/
├── core/
│   ├── domain/model/
│   │   └── Usuario.java                     # Entidade de domínio
│   └── usecase/
│       └── BuscarUsuarioPorCpfUseCase.java  # Lógica de negócio
├── port/
│   ├── input/
│   │   └── BuscarUsuarioPorCpfInputPort.java    # Contrato de entrada
│   └── output/
│       └── UsuarioApiOutputPort.java            # Contrato de saída
└── adapter/
    ├── input/
    │   └── controller/
    │       ├── UsuarioController.java
    │       ├── mapper/
    │       │   └── UsuarioControllerMapper.java # Mapper controller
    │       └── dto/
    │           └── response/
    │               └── UsuarioControllerResponse.java
    └── output/
        ├── client/
        │   ├── UsuarioApiClient.java            # Implementa OutputPort
        │   ├── dto/
        │   │   ├── request/
        │   │   │   └── UsuarioApiRequest.java   # DTO da API externa
        │   │   └── response/
        │   │       └── UsuarioApiResponse.java  # DTO da API externa
        │   └── mapper/
        │       └── UsuarioApiMapper.java        # ACL - Anti-Corruption Layer
        └── config/
            └── RestClientConfig.java            # Configuração do RestClient
```

## Passo 1: Configuração do RestClient

### Configuração Base com Pool de Conexões

Crie a classe de configuração em `adapter/config/`:

```java
package br.com.bradesco.projeto.adapter.config;

/**
 * Configuração do RestClient com pool de conexões otimizado
 * Baseado nas diretrizes de performance do Bradesco
 */
@Slf4j
@Configuration
public class RestClientConfig {

    @Value("${app.http.client.connect-timeout:5000}")
    private int connectTimeout;

    @Value("${app.http.client.read-timeout:30000}")
    private int readTimeout;

    @Value("${app.http.client.pool.max-total:200}")
    private int maxTotal;

    @Value("${app.http.client.pool.max-per-route:50}")
    private int maxPerRoute;

    /**
     * Cria ClientHttpRequestFactory com Apache HttpClient 5 e pool de conexões
     */
    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory() {
        // Pool de conexões HTTP
        PoolingHttpClientConnectionManager connectionManager =
            PoolingHttpClientConnectionManagerBuilder.create()
                .setMaxConnTotal(maxTotal)
                .setMaxConnPerRoute(maxPerRoute)
                .setDefaultSocketConfig(SocketConfig.custom()
                    .setSoTimeout(Timeout.ofMilliseconds(readTimeout))
                    .build())
                .build();

        // Cliente HTTP 5 com configurações avançadas
        CloseableHttpClient httpClient = HttpClients.custom()
            .setConnectionManager(connectionManager)
            .setDefaultRequestConfig(RequestConfig.custom()
                .setConnectTimeout(Timeout.ofMilliseconds(connectTimeout))
                .setResponseTimeout(Timeout.ofMilliseconds(readTimeout))
                .setConnectionRequestTimeout(Timeout.ofMilliseconds(2000))
                .build())
            .evictIdleConnections(Timeout.ofMinutes(5))
            .build();

        return new HttpComponentsClientHttpRequestFactory(httpClient);
    }

    /**
     * RestClient.Builder default para injeção
     * Este builder pode ser injetado em services para criar múltiplos RestClients
     */
    @Bean
    public RestClient.Builder restClientBuilder(ClientHttpRequestFactory requestFactory) {
        return RestClient.builder()
            .requestFactory(requestFactory)
            .requestInterceptor((request, body, execution) -> {
                log.info("RestClient request: {} {}", request.getMethod(), request.getURI());
                long start = System.currentTimeMillis();
                var response = execution.execute(request, body);
                long duration = System.currentTimeMillis() - start;
                log.info("RestClient response: {} in {}ms", response.getStatusCode(), duration);
                return response;
            });
    }
}
```

### Configuração Alternativa: Usando Spring Boot Auto-Configuration

Para configurações mais simples, você pode usar a auto-configuração do Spring Boot:

```java
package br.com.bradesco.projeto.adapter.config;

/**
 * Configuração simplificada usando auto-configuration do Spring Boot
 */
@Configuration
public class SimpleRestClientConfig {

    /**
     * Customizador global aplicado a todos os RestClient.Builder
     */
    @Bean
    public RestClientCustomizer restClientCustomizer() {
        return restClientBuilder -> restClientBuilder
            .requestInterceptor(loggingInterceptor());
    }

    private ClientHttpRequestInterceptor loggingInterceptor() {
        return (request, body, execution) -> {
            log.info("Request: {} {}", request.getMethod(), request.getURI());
            var response = execution.execute(request, body);
            log.info("Response: {}", response.getStatusCode());
            return response;
        };
    }
}
```

## Passo 2: Configurações por Ambiente

As configurações devem ser ajustadas conforme o ambiente:

### Desenvolvimento / Teste (`application-dev.yml`)

```yaml
app:
  http:
    client:
      connect-timeout: 15000
      read-timeout: 60000
      pool:
        max-total: 50
        max-per-route: 10

# Configuração alternativa usando propriedades do Spring Boot
spring:
  http:
    clients:
      connect-timeout: 15s
      read-timeout: 60s

logging:
  level:
    org.springframework.web.client: DEBUG
    org.apache.hc.client5: DEBUG
```

### Teste de Carga (`application-loadtest.yml`)

```yaml
app:
  http:
    client:
      connect-timeout: 5000
      read-timeout: 30000
      pool:
        max-total: 200
        max-per-route: 50

spring:
  http:
    clients:
      connect-timeout: 5s
      read-timeout: 30s

logging:
  level:
    org.springframework.web.client: INFO
```

### Produção (`application-prod.yml`)

```yaml
app:
  http:
    client:
      connect-timeout: 3000
      read-timeout: 15000
      pool:
        max-total: 500
        max-per-route: 100

spring:
  http:
    clients:
      connect-timeout: 3s
      read-timeout: 15s
      redirects: follow

# Configurações de resiliência
resilience4j:
  circuitbreaker:
    instances:
      usuario-api:
        registerHealthIndicator: true
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        failureRateThreshold: 50
        waitDurationInOpenState: 10s
  retry:
    instances:
      usuario-api:
        maxAttempts: 3
        waitDuration: 500ms
        exponentialBackoffMultiplier: 2

logging:
  level:
    org.springframework.web.client: WARN
```

## Passo 3: Criar DTOs

Crie os DTOs em `adapter/output/client/dto/`:

```java
package br.com.bradesco.projeto.adapter.output.client.dto.response;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponse {
    
    @JsonProperty("id")
    private Long id;
    
    @JsonProperty("cpf")
    private String cpf;
    
    @JsonProperty("nome")
    private String nome;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("ativo")
    private Boolean ativo;
}
```

```java
package br.com.bradesco.projeto.adapter.output.client.dto.request;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequest {
    
    @NotBlank
    @JsonProperty("cpf")
    private String cpf;
    
    @NotBlank
    @JsonProperty("nome")
    private String nome;
    
    @Email
    @JsonProperty("email")
    private String email;
}
```

## Passo 4: Criar Client que Encapsula RestClient

Crie um client em `adapter/output/client/`:

```java
package br.com.bradesco.projeto.adapter.output.client;

/**
 * Client para API de usuários usando RestClient
 */
@Slf4j
@Component
public class UsuarioApiClient {

    private final RestClient restClient;

    public UsuarioApiClient(
            RestClient.Builder restClientBuilder,
            @Value("${app.usuario-api.url}") String baseUrl) {
        
        this.restClient = restClientBuilder
            .baseUrl(baseUrl)
            .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader("Accept", MediaType.APPLICATION_JSON_VALUE)
            .build();
    }

    /**
     * Busca usuário por CPF
     */
    public UsuarioResponse buscarPorCpf(String cpf) {
        log.info("Buscando usuário por CPF: {}", cpf);
        
        return restClient.get()
            .uri("/api/v1/usuarios/{cpf}", cpf)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                log.error("Erro 4xx ao buscar usuário: {} - {}", 
                    response.getStatusCode(), response.getStatusText());
                throw new RuntimeException("Usuário não encontrado: " + cpf);
            })
            .body(UsuarioResponse.class);
    }

    /**
     * Lista todos os usuários ativos
     */
    public List<UsuarioResponse> listarAtivos() {
        log.info("Listando usuários ativos");
        
        return restClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/api/v1/usuarios")
                .queryParam("ativo", true)
                .build())
            .retrieve()
            .body(new ParameterizedTypeReference<List<UsuarioResponse>>() {});
    }

    /**
     * Cria novo usuário
     */
    public UsuarioResponse criar(UsuarioRequest request) {
        log.info("Criando usuário: {}", request.getCpf());
        
        ResponseEntity<UsuarioResponse> response = restClient.post()
            .uri("/api/v1/usuarios")
            .contentType(MediaType.APPLICATION_JSON)
            .body(request)
            .retrieve()
            .toEntity(UsuarioResponse.class);
        
        log.info("Usuário criado com sucesso. Location: {}", 
            response.getHeaders().getLocation());
        
        return response.getBody();
    }

    /**
     * Atualiza usuário existente
     */
    public void atualizar(String cpf, UsuarioRequest request) {
        log.info("Atualizando usuário: {}", cpf);
        
        restClient.put()
            .uri("/api/v1/usuarios/{cpf}", cpf)
            .body(request)
            .retrieve()
            .toBodilessEntity();
    }

    /**
     * Deleta usuário
     */
    public void deletar(String cpf) {
        log.info("Deletando usuário: {}", cpf);
        
        restClient.delete()
            .uri("/api/v1/usuarios/{cpf}", cpf)
            .retrieve()
            .toBodilessEntity();
    }

    /**
     * Exemplo: método com headers customizados e resposta completa
     */
    public ResponseEntity<UsuarioResponse> buscarComHeaders(String cpf, String token) {
        return restClient.get()
            .uri("/api/v1/usuarios/{cpf}", cpf)
            .header("Authorization", "Bearer " + token)
            .header("X-Request-ID", java.util.UUID.randomUUID().toString())
            .retrieve()
            .toEntity(UsuarioResponse.class);
    }
}
```

## Passo 5: Usar o Client em Services

```java
package br.com.bradesco.projeto.application.service;

/**
 * Service que usa UsuarioApiClient para integração
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class IntegracaoService {

    private final UsuarioApiClient usuarioApiClient;

    public UsuarioResponse buscarUsuario(String cpf) {
        try {
            return usuarioApiClient.buscarPorCpf(cpf);
        } catch (Exception e) {
            log.error("Erro ao buscar usuário: {}", cpf, e);
            throw new RuntimeException("Falha na integração com API de usuários", e);
        }
    }

    public UsuarioResponse criarUsuario(UsuarioRequest request) {
        return usuarioApiClient.criar(request);
    }
}
```

## Tratamento de Erros

### Handlers de Status Customizados

```java
// Tratamento inline
UsuarioResponse response = restClient.get()
    .uri("/api/usuarios/{id}", id)
    .retrieve()
    .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
        if (response.getStatusCode().value() == 404) {
            throw new UsuarioNaoEncontradoException("Usuário não encontrado");
        }
        throw new ClientErrorException("Erro na requisição: " + response.getStatusCode());
    })
    .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
        throw new ServidorIndisponivelException("Servidor indisponível");
    })
    .body(UsuarioResponse.class);

// Configurar handler global no builder
RestClient restClient = restClientBuilder
    .baseUrl(baseUrl)
    .defaultStatusHandler(HttpStatusCode::isError, (request, response) -> {
        log.error("Erro HTTP: {} - {}", response.getStatusCode(), response.getStatusText());
        // Tratamento centralizado de erros
    })
    .build();
```

### Exceções do RestClient

```java
try {
    // Chamada RestClient
    var response = restClient.get().uri("/api/test").retrieve().body(String.class);
} catch (HttpClientErrorException e) {
    // 4xx - Erro do cliente
    log.error("Erro 4xx: {} - Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
} catch (HttpServerErrorException e) {
    // 5xx - Erro do servidor
    log.error("Erro 5xx: {} - Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
} catch (ResourceAccessException e) {
    // Timeout, conexão recusada, etc.
    log.error("Erro de acesso ao recurso", e);
} catch (RestClientException e) {
    // Outros erros REST
    log.error("Erro REST genérico", e);
}
```

## Resiliência com Resilience4j

### Configurar Circuit Breaker

```java
package br.com.bradesco.projeto.adapter.output.client;

@Slf4j
@Component
public class ResilientUsuarioClient {

    private final UsuarioApiClient usuarioApiClient;

    public ResilientUsuarioClient(UsuarioApiClient usuarioApiClient) {
        this.usuarioApiClient = usuarioApiClient;
    }

    /**
     * Método com Circuit Breaker e Retry
     */
    @CircuitBreaker(name = "usuario-api", fallbackMethod = "buscarUsuarioFallback")
    @Retry(name = "usuario-api")
    public UsuarioResponse buscarUsuarioComResiliencia(String cpf) {
        return usuarioApiClient.buscarPorCpf(cpf);
    }

    /**
     * Método fallback chamado quando circuit breaker abre
     */
    private UsuarioResponse buscarUsuarioFallback(String cpf, Exception e) {
        log.warn("Fallback acionado para buscar usuário: {} - Erro: {}", cpf, e.getMessage());
        
        // Retornar resposta default ou lançar exceção customizada
        return UsuarioResponse.builder()
            .cpf(cpf)
            .nome("Usuário Temporariamente Indisponível")
            .build();
    }
}
```

### Configuração do Resilience4j

Adicione no `application.yml`:

```yaml
resilience4j:
  circuitbreaker:
    instances:
      usuario-api:
        registerHealthIndicator: true
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
        waitDurationInOpenState: 10s
        failureRateThreshold: 50
        eventConsumerBufferSize: 10
        
  retry:
    instances:
      usuario-api:
        maxAttempts: 3
        waitDuration: 500ms
        exponentialBackoffMultiplier: 2
        retryExceptions:
          - org.springframework.web.client.ResourceAccessException
          - org.springframework.web.client.HttpServerErrorException
        ignoreExceptions:
          - org.springframework.web.client.HttpClientErrorException.NotFound

  timelimiter:
    instances:
      usuario-api:
        timeoutDuration: 15s
```

## Recursos Avançados

### 1. Exchange para Controle Total

```java
public UsuarioResponse buscarComExchange(String cpf) {
    return restClient.get()
        .uri("/api/usuarios/{cpf}", cpf)
        .exchange((request, response) -> {
            log.info("Status: {}", response.getStatusCode());
            log.info("Headers: {}", response.getHeaders());
            
            if (response.getStatusCode().is4xxClientError()) {
                // Tratamento customizado
                throw new RuntimeException("Erro 4xx");
            }
            
            // Conversão manual da resposta
            return objectMapper.readValue(response.getBody(), UsuarioResponse.class);
        });
}
```

### 2. Suporte a SSL/TLS

```java
@Bean
public RestClient.Builder restClientBuilderWithSsl(RestClientSsl ssl) {
    return RestClient.builder()
        .apply(ssl.fromBundle("my-bundle"));  // Bundle configurado no application.yml
}
```

Configuração SSL no `application.yml`:

```yaml
spring:
  ssl:
    bundle:
      jks:
        my-bundle:
          keystore:
            location: classpath:keystore.jks
            password: changeit
          truststore:
            location: classpath:truststore.jks
            password: changeit
```

### 3. Multipart/Form Data

```java
public void uploadArquivo(String cpf, MultipartFile arquivo) {
    MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
    parts.add("file", arquivo.getResource());
    parts.add("cpf", cpf);

    restClient.post()
        .uri("/api/upload")
        .contentType(MediaType.MULTIPART_FORM_DATA)
        .body(parts)
        .retrieve()
        .toBodilessEntity();
}
```

### 4. Form URL Encoded

```java
public void enviarFormulario(String cpf, String nome) {
    MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
    formData.add("cpf", cpf);
    formData.add("nome", nome);

    restClient.post()
        .uri("/api/form")
        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
        .body(formData)
        .retrieve()
        .toBodilessEntity();
}
```

## Migração do RestTemplate para RestClient

Se você tem código legado usando RestTemplate, siga esta tabela de equivalência:

| RestTemplate | RestClient |
|--------------|------------|
| `getForObject(url, Class)` | `get().uri(url).retrieve().body(Class)` |
| `getForEntity(url, Class)` | `get().uri(url).retrieve().toEntity(Class)` |
| `postForObject(url, body, Class)` | `post().uri(url).body(body).retrieve().body(Class)` |
| `postForEntity(url, body, Class)` | `post().uri(url).body(body).retrieve().toEntity(Class)` |
| `put(url, body)` | `put().uri(url).body(body).retrieve().toBodilessEntity()` |
| `delete(url)` | `delete().uri(url).retrieve().toBodilessEntity()` |
| `exchange(url, method, entity, Class)` | `method(method).uri(url).headers(...).body(...).retrieve().toEntity(Class)` |
| `execute(url, method, callback, extractor)` | `method(method).uri(url).exchange(exchangeFunction)` |

### Exemplo de Migração

**Antes (RestTemplate):**
```java
@Service
public class OldService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public Usuario buscar(String id) {
        return restTemplate.getForObject(
            "https://api.example.com/usuarios/{id}", 
            Usuario.class, 
            id
        );
    }
}
```

**Depois (RestClient):**
```java
@Service
public class NewService {
    
    private final RestClient restClient;
    
    public NewService(RestClient.Builder builder) {
        this.restClient = builder
            .baseUrl("https://api.example.com")
            .build();
    }
    
    public Usuario buscar(String id) {
        return restClient.get()
            .uri("/usuarios/{id}", id)
            .retrieve()
            .body(Usuario.class);
    }
}
```

## Boas Práticas

1. **✅ Use RestClient.Builder injetado**: Aproveite a auto-configuração do Spring Boot
2. **✅ Configure pool de conexões**: Use Apache HttpClient 5 com pool adequado ao ambiente
3. **✅ Implemente timeouts**: Configure connect e read timeouts por ambiente
4. **✅ Adicione logging**: Use interceptors para logs estruturados
5. **✅ Trate erros específicos**: Use `onStatus()` para tratamento granular
6. **✅ Encapsule em clients**: Crie classes client dedicadas, não use RestClient diretamente em services
7. **✅ Use DTOs específicos**: Não use entidades de domínio para comunicação HTTP
8. **✅ Configure resiliência**: Use Resilience4j para retry e circuit breaker quando necessário
9. **✅ Teste com MockRestServiceServer**: Use mocks para testes unitários
10. **⚠️ Evite criar RestClient.create()**: Isso ignora toda configuração centralizada

## Referências

- [Spring Boot RestClient Documentation](https://docs.spring.io/spring-boot/reference/io/rest-client.html#io.rest-client.restclient)
- [Spring Framework RestClient Reference](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html#rest-restclient)
- [Apache HttpClient 5 Documentation](https://hc.apache.org/httpcomponents-client-5.2.x/index.html)
- [Resilience4j Documentation](https://resilience4j.readme.io/docs/getting-started)
- [Spring Boot Feign Client Skill](../springboot-feign-client/SKILL.md) (para comparação)
