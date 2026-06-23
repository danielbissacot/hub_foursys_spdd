# Integração Redis em Spring Boot com Arquitetura Hexagonal

Este documento ensina como integrar **Redis** em projetos **Spring Boot 3.5.x / Java 21** seguindo **Arquitetura Hexagonal (Ports and Adapters)** no padrão DUPE.

O objetivo não é apenas “fazer o cache funcionar”, mas posicionar Redis no lugar certo da arquitetura para que o domínio continue limpo, testável e desacoplado de infraestrutura.

> **Conteúdo comum**: pré-requisitos, dependências Maven, configuração de segredos (CSI Driver, `values.yaml`, `application.yml`), perfis de ambiente, estratégia de chaves, TTL, resiliência e checklist de segurança estão centralizados no **[SKILL.md](../SKILL.md)**. Esta referência cobre apenas o delta específico da arquitetura hexagonal.

---

## 1. Objetivo arquitetural

Em arquitetura hexagonal, Redis é **infraestrutura**. Isso significa que:

- o **domínio** não conhece Redis;
- as **ports** continuam sendo contratos puros;
- os **adapters** e a **configuração** encapsulam detalhes técnicos;
- o **UseCase** decide **quando** cachear, invalidar ou revalidar, porque isso afeta o comportamento do caso de uso.

A decisão central deste padrão é:

> **`@Cacheable`, `@CachePut` e `@CacheEvict` ficam no `core/usecase/`, nunca no domínio e nunca no controller.**

Isso preserva a regra de que o **caso de uso é a porta de entrada do comportamento da aplicação**. Cache não é só detalhe técnico; ele altera leitura, escrita e invalidação. Portanto, a decisão de cache pertence ao fluxo do caso de uso.

---

## 2. Estrutura de pacotes correta no padrão hexagonal DUPE

```text
br.com.bradesco.{projeto}/
├── core/
│   ├── domain/
│   │   └── model/
│   │       └── Produto.java
│   ├── exception/
│   │   ├── BaseException.java
│   │   ├── InfrastructureException.java
│   │   └── ServiceUnavailableException.java
│   └── usecase/
│       └── ProdutoUseCase.java
├── port/
│   ├── input/
│   │   └── ProdutoInputPort.java
│   └── output/
│       └── ProdutoOutputPort.java
├── adapter/
│   ├── input/
│   │   ├── controller/
│   │   │   ├── ProdutoController.java
│   │   │   └── dto/
│   │   │       ├── request/
│   │   │       └── response/
│   │   └── mapper/
│   └── output/
│       ├── cache/
│       │   └── redis/
│       │       └── handler/
│       │           └── CustomCacheErrorHandler.java
│       ├── repository/
│       │   ├── entity/
│       │   └── ProdutoRepository.java
│       └── mapper/
└── config/
    └── CacheConfiguration.java
```

### Regras obrigatórias

- `core` **não depende** de `adapter` nem de `config`;
- `port/input` e `port/output` contêm **apenas interfaces**;
- `core/usecase` implementa **uma InputPort** e injeta **OutputPorts**;
- adapters implementam ports;
- entidades em `core/domain/model` são **Java puro**: **sem Lombok, sem Spring, sem Jackson**;
- siga convenções de nome:
  - `UseCase`
  - `InputPort`
  - `OutputPort`
  - `Controller`
  - `Repository`

### Mapeamento do material de origem para o padrão atual

| Origem | Padrão atual |
|---|---|
| `application/model/` | `core/domain/model/` |
| `application/port/in/` | `port/input/` |
| `application/port/out/` | `port/output/` |
| `application/usecase/` | `core/usecase/` |
| `application/exception/` | `core/exception/` |
| `adapter/in/rest/` | `adapter/input/controller/` |
| `adapter/out/cache/redis/config/` | `config/` |
| `adapter/out/cache/redis/handler/` | `adapter/output/cache/redis/handler/` |

---

## 3. Onde ficam as anotações de cache — decisão arquitetural principal

### Regra

As anotações abaixo devem ficar **na implementação do caso de uso em `core/usecase/`**:

- `@Cacheable`
- `@CachePut`
- `@CacheEvict`
- `@Caching`

### Por quê?

Porque essas anotações mudam o **comportamento observável** do caso de uso:

- uma leitura pode ser servida sem consultar a fonte principal;
- uma escrita pode revalidar o cache;
- uma remoção pode invalidar coleções e itens individuais.

Essas decisões pertencem ao **orquestrador da regra de negócio**, que é o UseCase.

### O que não fazer

- **não colocar no domínio**: `core/domain/model/` deve permanecer puro;
- **não colocar em `port/input` ou `port/output`**: ports são contratos, não pontos de infraestrutura;
- **não colocar no controller**: política de cache não pode depender do canal HTTP;
- **não esconder no repository adapter**: a política de invalidação perde a visão do caso de uso completo.

Se existir uma classe auxiliar dentro de `core/usecase/`, ela deve continuar **sem dependência de infraestrutura**. O ponto canônico das anotações continua sendo o **UseCase que implementa a InputPort**.

---

## 4. Configuração de cache no pacote `config/`

No padrão atual, a configuração fica em `config/CacheConfiguration.java`, não em adapter.

### Por que em `config/`?

Porque essa classe define **wiring de infraestrutura do Spring**: beans, propriedades, serializers, `CacheManager` e customizadores do cliente Redis. Ela não representa regra de negócio nem adapter de canal; ela compõe a aplicação.

```java
package br.com.bradesco.{projeto}.config;

import br.com.bradesco.{projeto}.adapter.output.cache.redis.handler.CustomCacheErrorHandler;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.lettuce.core.ReadFrom;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.time.DurationMin;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBooleanProperty;
import org.springframework.boot.autoconfigure.data.redis.LettuceClientConfigurationBuilderCustomizer;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.lang.Nullable;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;
import java.util.Map;

import static java.util.Optional.ofNullable;
import static org.springframework.data.redis.serializer.RedisSerializationContext.SerializationPair.fromSerializer;

@EnableCaching
@Configuration(proxyBeanMethods = false)
@ConditionalOnBooleanProperty(CacheConfiguration.PROPERTIES_PREFIX + ".enabled")
@EnableConfigurationProperties(CacheConfiguration.CachingProperties.class)
public class CacheConfiguration {

    static final String PROPERTIES_PREFIX = "bradesco.starter.caching";
    static final Duration DEFAULT_TTL = Duration.ofSeconds(30);

    @Configuration(proxyBeanMethods = false)
    @ConditionalOnBooleanProperty(CacheConfiguration.PROPERTIES_PREFIX + ".enabled")
    public static class CustomCachingConfigurer implements CachingConfigurer {

        private final CachingProperties properties;

        public CustomCachingConfigurer(CachingProperties properties) {
            this.properties = properties;
        }

        @Override
        public CacheErrorHandler errorHandler() {
            return new CustomCacheErrorHandler(properties.required());
        }
    }

    @EnableRedisRepositories
    @Configuration(proxyBeanMethods = false)
    @ConditionalOnBooleanProperty(CacheConfiguration.PROPERTIES_PREFIX + ".enabled")
    public static class RedisConfiguration {

        @Bean
        public LettuceClientConfigurationBuilderCustomizer lettuceReadFromReplica() {
            return builder -> builder.readFrom(ReadFrom.REPLICA_PREFERRED);
        }

        @Bean
        public CacheManager cacheManager(
                CachingProperties props,
                RedisConnectionFactory connectionFactory) {

            final var jsonSerializer = new GenericJackson2JsonRedisSerializer();
            jsonSerializer.configure(c -> c.registerModule(new JavaTimeModule()));

            final var keyPair = fromSerializer(new StringRedisSerializer());
            final var valuePair = fromSerializer(jsonSerializer);

            final var builder = RedisCacheManager.builder(connectionFactory)
                    .cacheDefaults(RedisCacheConfiguration.defaultCacheConfig()
                            .entryTtl(ofNullable(props.defaults())
                                    .map(CachingConfigProperties::ttl)
                                    .orElse(DEFAULT_TTL))
                            .disableCachingNullValues()
                            .serializeKeysWith(keyPair)
                            .serializeValuesWith(valuePair));

            ofNullable(props.overrides()).ifPresent(overrides ->
                    overrides.forEach((name, cfg) ->
                            builder.withCacheConfiguration(name,
                                    RedisCacheConfiguration.defaultCacheConfig()
                                            .entryTtl(cfg.ttl())
                                            .serializeKeysWith(keyPair)
                                            .serializeValuesWith(valuePair))));

            return builder.build();
        }
    }

    @Validated
    @ConfigurationProperties(prefix = PROPERTIES_PREFIX)
    public record CachingProperties(
            @NotNull boolean enabled,
            @DefaultValue("false") boolean required,
            @Valid @Nullable CachingConfigProperties defaults,
            @Nullable Map<@NotBlank String, @Valid CachingConfigProperties> overrides
    ) {}

    public record CachingConfigProperties(
            @NotNull @DurationMin(seconds = 0) Duration ttl
    ) {}
}
```

### Decisões arquiteturais dessa configuração

- `config/` concentra o **wiring** e preserva `core/` livre de detalhes Spring;
- `CustomCacheErrorHandler` é plugado como componente de infraestrutura, sem contaminar domínio ou ports;
- `GenericJackson2JsonRedisSerializer` + `JavaTimeModule` serializam objetos sem exigir anotações no modelo de domínio;
- `disableCachingNullValues()` evita consolidar ausência transitória como dado de domínio;
- `overrides` por nome de cache permitem que o UseCase continue declarativo e o tuning fique fora da regra de negócio.

---

## 5. Tratamento de falhas do cache

O `CustomCacheErrorHandler` fica em `adapter/output/cache/redis/handler/`.

### Por que em adapter de saída?

Porque ele traduz erros técnicos de Redis/Spring Data para exceções da aplicação e decide entre **degradar** ou **propagar** conforme a configuração.

```java
package br.com.bradesco.{projeto}.adapter.output.cache.redis.handler;

import br.com.bradesco.{projeto}.core.exception.BaseException;
import br.com.bradesco.{projeto}.core.exception.InfrastructureException;
import br.com.bradesco.{projeto}.core.exception.ServiceUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.lang.Nullable;

public record CustomCacheErrorHandler(boolean isRequired) implements CacheErrorHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(CustomCacheErrorHandler.class);

    @Override
    public void handleCacheGetError(RuntimeException ex, Cache cache, Object key) {
        handleError(ex, "cache-get",
                String.format("Cache '%s' failed to get entry with key '%s'", cache.getName(), key));
    }

    @Override
    public void handleCachePutError(RuntimeException ex, Cache cache, Object key, @Nullable Object value) {
        handleError(ex, "cache-put",
                String.format("Cache '%s' failed to store entry with key '%s'", cache.getName(), key));
    }

    @Override
    public void handleCacheEvictError(RuntimeException ex, Cache cache, Object key) {
        handleError(ex, "cache-evict",
                String.format("Cache '%s' failed to remove entry with key '%s'", cache.getName(), key));
    }

    @Override
    public void handleCacheClearError(RuntimeException ex, Cache cache) {
        handleError(ex, "cache-clear",
                String.format("Cache '%s' failed to clear all entries.", cache.getName()));
    }

    private void handleError(RuntimeException ex, String operationName, String message) {
        if (ex instanceof RedisConnectionFailureException) {
            logOrThrow(new ServiceUnavailableException(operationName, message, ex));
        } else if (ex instanceof DataAccessException) {
            logOrThrow(new InfrastructureException(operationName, message, ex));
        } else {
            logOrThrow(new InfrastructureException(operationName, message, ex));
        }
    }

    private void logOrThrow(BaseException ex) {
        if (isRequired()) {
            throw ex;
        }
        LOGGER.warn(ex.getMessage());
        LOGGER.atDebug().setMessage("{}").addArgument(ex.getMessage()).setCause(ex).log();
    }
}
```

### O que essa estratégia resolve?

- mantém exceções técnicas dentro da borda de infraestrutura;
- traduz falhas para **linguagem de domínio técnico** da aplicação (`BaseException`, `InfrastructureException`, `ServiceUnavailableException`);
- preserva o UseCase sem dependência de classes específicas do Redis;
- separa a política arquitetural de falha do detalhe operacional do provedor.

---

## 6. Modelo de domínio

O domínio fica em `core/domain/model/` e deve permanecer puro.

```java
package br.com.bradesco.{projeto}.core.domain.model;

import java.io.Serializable;

public record Produto(Long id, String nome, String descricao) implements Serializable {}
```

### Regras do domínio

- sem Lombok;
- sem Spring;
- sem Jackson;
- sem referência a Redis;
- sem `@RedisHash`, `@JsonProperty`, `@Component` ou similares.

### Por que manter assim?

Porque a entidade de domínio deve representar o negócio, não o mecanismo de serialização, transporte ou cache.

---

## 7. Input Port

```java
package br.com.bradesco.{projeto}.port.input;

import br.com.bradesco.{projeto}.core.domain.model.Produto;
import java.util.List;

public interface ProdutoInputPort {
    Produto buscarPorId(Long id);
    List<Produto> listarTodos();
    Produto salvar(Produto produto);
    void remover(Long id);
}
```

### Papel da Input Port

Ela define o que o sistema oferece para fora. Não fala de Redis, Spring, HTTP nem banco.

---

## 8. Output Port

```java
package br.com.bradesco.{projeto}.port.output;

import br.com.bradesco.{projeto}.core.domain.model.Produto;
import java.util.List;
import java.util.Optional;

public interface ProdutoOutputPort {
    Optional<Produto> findById(Long id);
    List<Produto> findAll();
    Produto save(Produto produto);
    void deleteById(Long id);
}
```

### Papel da Output Port

Ela representa a dependência externa que o UseCase precisa. O contrato continua em linguagem de domínio.

---

## 9. UseCase com cache no lugar correto

A implementação abaixo mostra o padrão correto: **UseCase implementa a InputPort e injeta a OutputPort**, com anotações de cache no próprio caso de uso.

```java
package br.com.bradesco.{projeto}.core.usecase;

import br.com.bradesco.{projeto}.core.domain.model.Produto;
import br.com.bradesco.{projeto}.port.input.ProdutoInputPort;
import br.com.bradesco.{projeto}.port.output.ProdutoOutputPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProdutoUseCase implements ProdutoInputPort {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProdutoUseCase.class);

    private static final String CACHE_PRODUTO = "ProdutoCache";
    private static final String CACHE_PRODUTO_LIST = "ProdutoListCache";

    private final ProdutoOutputPort produtoOutputPort;

    public ProdutoUseCase(ProdutoOutputPort produtoOutputPort) {
        this.produtoOutputPort = produtoOutputPort;
    }

    @Override
    @Cacheable(value = CACHE_PRODUTO, key = "#id", unless = "#result == null")
    public Produto buscarPorId(Long id) {
        LOGGER.info("Cache miss — buscando produto <{}> na fonte principal.", id);
        return produtoOutputPort.findById(id).orElse(null);
    }

    @Override
    @Cacheable(value = CACHE_PRODUTO_LIST, unless = "#result.isEmpty()")
    public List<Produto> listarTodos() {
        return produtoOutputPort.findAll();
    }

    @Override
    @Caching(
        put = @CachePut(value = CACHE_PRODUTO, key = "#result.id()"),
        evict = @CacheEvict(value = CACHE_PRODUTO_LIST, allEntries = true)
    )
    public Produto salvar(Produto produto) {
        return produtoOutputPort.save(produto);
    }

    @Override
    @Caching(evict = {
        @CacheEvict(value = CACHE_PRODUTO, key = "#id"),
        @CacheEvict(value = CACHE_PRODUTO_LIST, allEntries = true)
    })
    public void remover(Long id) {
        produtoOutputPort.deleteById(id);
    }
}
```

### O que esse exemplo demonstra?

- **cache-aside** em `buscarPorId`: busca no cache antes da fonte principal;
- cache de lista em `listarTodos`;
- **revalidação** após escrita com `@CachePut`;
- **invalidação** de lista após mutação com `@CacheEvict`;
- o controller continua sem conhecimento de Redis;
- o domínio continua puro;
- a OutputPort continua semanticamente neutra.

---

## 10. Adapter de entrada HTTP sem conhecimento de cache

```java
package br.com.bradesco.{projeto}.adapter.input.controller;

import br.com.bradesco.{projeto}.core.domain.model.Produto;
import br.com.bradesco.{projeto}.port.input.ProdutoInputPort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/produtos")
public class ProdutoController {

    private final ProdutoInputPort produtoInputPort;

    public ProdutoController(ProdutoInputPort produtoInputPort) {
        this.produtoInputPort = produtoInputPort;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        var produto = produtoInputPort.buscarPorId(id);
        return produto != null ? ResponseEntity.ok(produto) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos() {
        return ResponseEntity.ok(produtoInputPort.listarTodos());
    }

    @PostMapping
    public ResponseEntity<Produto> salvar(@RequestBody Produto produto) {
        return ResponseEntity.ok(produtoInputPort.salvar(produto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        produtoInputPort.remover(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Por que o controller não deve conhecer cache?

Porque cache é política do caso de uso, não do protocolo HTTP. O mesmo caso de uso pode ser acionado por controller, consumer ou scheduler e deve manter o mesmo comportamento.

---

## 11. Anti-patterns que devem ser evitados

### 11.1. Colocar anotações de cache no domínio

**Errado:** usar `@Cacheable`, `@RedisHash`, `@JsonProperty` ou anotações equivalentes em `core/domain/model`.

**Problema:** o domínio passa a depender de infraestrutura e frameworks.

### 11.2. Contaminar ports com infraestrutura

**Errado:** adicionar anotações Spring, tipos de Redis ou detalhes de serialização em `port/input` ou `port/output`.

**Problema:** o contrato deixa de ser hexagonal e passa a carregar tecnologia.

### 11.3. Fazer o controller decidir invalidação

**Errado:** aplicar `@CacheEvict` no controller REST.

**Problema:** a política de cache fica presa ao adapter HTTP e não acompanha outros canais de entrada.

### 11.4. Esconder a política de cache no adapter de saída

**Errado:** implementar cache apenas no repository adapter ou em componentes de persistência.

**Problema:** a invalidação perde a visão do caso de uso completo e tende a errar em listas, consultas derivadas e operações compostas.

### 11.5. Acoplar o modelo de domínio ao formato de cache

**Errado:** moldar o objeto de domínio para atender serializer, chave ou estrutura do Redis.

**Problema:** a infraestrutura passa a ditar o desenho do negócio, invertendo a dependência correta.

---

## 12. Resumo prático para agentes de código

Ao integrar Redis neste padrão, siga esta ordem mental:

1. mantenha o **domínio puro** em `core/domain/model/`;
2. defina **contratos puros** em `port/input/` e `port/output/`;
3. implemente a **orquestração** em `core/usecase/`;
4. aplique `@Cacheable/@CachePut/@CacheEvict` **no UseCase**;
5. concentre o **wiring Spring/Redis** em `config/`;
6. trate falhas técnicas na borda `adapter/output/cache/redis/handler/`;
7. mantenha controllers e adapters de entrada **sem política de cache**;
8. não deixe serializer, Redis ou Spring moldarem o domínio.

Se o agente respeitar esses pontos, a integração continuará alinhada com a arquitetura hexagonal do padrão DUPE.
