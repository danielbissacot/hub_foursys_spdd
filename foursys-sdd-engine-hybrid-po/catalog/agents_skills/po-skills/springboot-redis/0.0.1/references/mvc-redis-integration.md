# Integração Redis em Spring Boot com Arquitetura MVC

Este documento é uma referência para agentes de código que precisam integrar **Redis** em projetos **Spring Boot 3.5.x** com **Java 21 LTS** seguindo a **arquitetura MVC padronizada pelo Bradesco**. O objetivo não é apenas mostrar a configuração, mas explicar **por que** cada decisão existe: isolamento de camadas, controle de dependências, segurança operacional em ARO e uso correto de cache no serviço.

> **Conteúdo comum**: pré-requisitos, dependências Maven, configuração de segredos (CSI Driver, `values.yaml`, `application.yml`), perfis de ambiente, estratégia de chaves, TTL, resiliência e checklist de segurança estão centralizados no **[SKILL.md](../SKILL.md)**. Esta referência cobre apenas o delta específico da arquitetura MVC.

## 1. Quando usar este guia

Use esta referência quando o projeto precisar de:

- cache de leitura com Redis em aplicações MVC;
- implementação alinhada à regra de que **controllers não conhecem Redis**;
- organização compatível com o padrão Bradesco para camadas, nomes, injeção por construtor e uso de mappers;
- separação rígida entre **modelo de domínio**, **DTOs HTTP** e **configuração de infraestrutura**.

> Regra central: em MVC Bradesco, as anotações `@Cacheable`, `@CachePut` e `@CacheEvict` ficam na **camada `service/`**, nunca na `controller/`, `repository/`, `client/` ou `producer/`.

---

## 2. Estrutura de pacotes alinhada ao padrão MVC DUPE

Para Redis em MVC, a adaptação recomendada fica assim:

```text
br.com.bradesco.{sigla}.srv.mvc/
├── Application.java
├── controller/
│   ├── ProdutoController.java
│   ├── dto/
│   │   ├── request/
│   │   │   └── ProdutoRequest.java
│   │   └── response/
│   │       └── ProdutoResponse.java
│   └── mapper/
│       └── ProdutoControllerMapper.java
├── service/
│   ├── ProdutoService.java
│   └── ProdutoServiceImpl.java
├── repository/
│   ├── ProdutoRepository.java
│   ├── entity/
│   │   └── ProdutoEntity.java
│   └── mapper/
│       └── ProdutoRepositoryMapper.java
├── model/
│   └── Produto.java
├── mapper/
│   └── ProdutoMapper.java
├── config/
│   └── CacheConfiguration.java
├── handler/
│   └── CustomCacheErrorHandler.java
└── exception/
```

### 2 Regras arquiteturais que impactam Redis

1. **Pureza de `model/`**: classes em `model/` devem ser Java puro. **Não use Lombok, Jackson ou anotações externas**.
2. **DTOs ficam em `controller/dto/request` e `controller/dto/response`**. Não coloque DTO HTTP em `model/`.
3. **Controller depende apenas de Service e Mapper**. Nunca injete `RedisTemplate`, `CacheManager`, `Repository`, `Client` ou `Producer` em controller.
4. **Service pode depender de Repository, Client, Producer e outros Services**. É aqui que o cache é coordenado.
5. **Não pode haver dependência cruzada entre Consumer, Producer, Repository e Client**.
6. Use os sufixos: `Controller`, `Service`, `Repository`, `Client`, `Producer`, `Consumer`, `Exception`, `Request`, `Response`.
7. Use sempre **injeção por construtor**.
8. Sempre implemente **interfaces para services e repositories**.
9. Sempre use **mappers** para conversão entre camadas.

---

## 3. Onde as anotações de cache devem ficar — e por quê

### Regra obrigatória

As anotações abaixo devem ficar na **camada `service/`**:

- `@Cacheable`
- `@CachePut`
- `@CacheEvict`
- `@Caching`

### Motivo arquitetural

A camada de serviço é responsável por **orquestrar** o caso de uso:

- decide quando consultar a fonte primária;
- decide quando aproveitar dados já materializados em cache;
- decide quando invalidar ou atualizar cache após escrita;
- coordena mapeamentos entre `model`, `entity` e DTOs.

A controller não deve conter essa lógica porque sua responsabilidade é apenas receber a requisição HTTP, validar entrada, chamar o serviço e devolver resposta.

O repository também não deve ter anotações de cache porque ele deve representar o acesso ao armazenamento primário. Misturar cache no repository cria confusão entre persistência primária e otimização de leitura.

### Anti-patterns que devem ser evitados

#### ❌ `@Cacheable` na controller

Problemas:

- acopla transporte HTTP à estratégia de cache;
- dificulta reuso do caso de uso por outros pontos de entrada;
- força a controller a conhecer decisão de infraestrutura;
- viola a regra de que controller depende apenas de service e mapper.

#### ❌ Controller injetando `RedisTemplate` ou `CacheManager`

Problemas:

- quebra a fronteira arquitetural;
- permite bypass do fluxo de negócio;
- espalha regras de invalidação pela aplicação;
- torna testes mais frágeis e menos previsíveis.

#### ❌ Cache no repository como regra geral

Problemas:

- mistura persistência primária com otimização transitória;
- dificulta definição semântica de invalidação após regras de negócio;
- gera acoplamento entre tecnologia de cache e contrato de repositório.

#### ❌ Colocar objetos HTTP/Jackson/Lombok dentro de `model/`

Problemas:

- viola pureza do modelo;
- contamina negócio com detalhe de framework;
- dificulta reuso em outras integrações.

---

## 4. `CacheConfiguration` em `config/`

A configuração abaixo cria o `RedisCacheManager`, registra serialização JSON, TTL padrão, TTLs específicos e o `CacheErrorHandler` customizado.

```java
package br.com.bradesco.{sigla}.srv.mvc.config;

import br.com.bradesco.{sigla}.srv.mvc.handler.CustomCacheErrorHandler;
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

### 4.1. Decisões importantes dessa configuração

- `@EnableCaching`: habilita interceptação das anotações de cache.
- `@ConditionalOnBooleanProperty(...enabled)`: permite ligar/desligar cache por ambiente sem alterar código.
- `GenericJackson2JsonRedisSerializer` + `JavaTimeModule`: serializa objetos com suporte adequado a tipos de data/hora.
- `StringRedisSerializer` para chave: mantém chaves legíveis e previsíveis.
- `disableCachingNullValues()`: evita poluir Redis com ausência de dados.
- `ReadFrom.REPLICA_PREFERRED`: otimiza leituras em cenários com réplicas, quando suportado.
- `overrides`: permite TTL por nome de cache, essencial para adequar retenção à natureza do dado.

> Observação: `@EnableRedisRepositories` aparece no exemplo-base. Use apenas quando o projeto realmente utilizar repositórios Redis. Para cache com `CacheManager`, o ponto principal é a configuração do cache, não transformar Redis no repositório primário do domínio.

---

## 5. Tratamento de erro com `CustomCacheErrorHandler`

Coloque o handler em um pacote auxiliar, por exemplo `handler/`.

```java
package br.com.bradesco.{sigla}.srv.mvc.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.RedisConnectionFailureException;

public record CustomCacheErrorHandler(boolean isRequired) implements CacheErrorHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(CustomCacheErrorHandler.class);

    @Override
    public void handleCacheGetError(RuntimeException ex, Cache cache, Object key) {
        handle(ex, "get", cache.getName(), String.valueOf(key));
    }

    @Override
    public void handleCachePutError(RuntimeException ex, Cache cache, Object key, Object value) {
        handle(ex, "put", cache.getName(), String.valueOf(key));
    }

    @Override
    public void handleCacheEvictError(RuntimeException ex, Cache cache, Object key) {
        handle(ex, "evict", cache.getName(), String.valueOf(key));
    }

    @Override
    public void handleCacheClearError(RuntimeException ex, Cache cache) {
        handle(ex, "clear", cache.getName(), "*");
    }

    private void handle(RuntimeException ex, String op, String cache, String key) {
        String msg = "Cache '{}' failed on operation '{}' (key: {}): {}";
        if (ex instanceof RedisConnectionFailureException || ex instanceof DataAccessException) {
            LOGGER.warn(msg, cache, op, key, ex.getMessage());
        } else {
            LOGGER.error(msg, cache, op, key, ex.getMessage(), ex);
        }
        if (isRequired) throw ex;
    }
}
```

### 5.1. Por que esse handler é importante

No contexto MVC deste catálogo, o handler mantém a decisão de falha encapsulada na infraestrutura de cache, sem introduzir exceções de domínio artificiais. O comportamento é simples e explícito:

- **`required=false`**: falha no Redis não derruba a aplicação; faz log e segue para a fonte primária.
- **`required=true`**: a falha é propagada porque o cache foi tratado como requisito do fluxo.

Essa abordagem preserva a separação entre regra de negócio e preocupação operacional.

---

## 6. Implementação MVC adaptada ao padrão DUPE

Abaixo está um exemplo completo de organização por camadas, mantendo a regra de que `model/` é puro e DTOs HTTP ficam em `controller/dto/`.

### 6.1. Modelo de domínio puro em `model/`

```java
package br.com.bradesco.{sigla}.srv.mvc.model;

public class Produto {

    private Long id;
    private String nome;
    private String descricao;

    public Produto(Long id, String nome, String descricao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getDescricao() {
        return descricao;
    }
}
```

> Repare que `model/` não usa Lombok, Jackson nem anotações HTTP. Isso preserva a pureza do domínio.

### 6.2. DTOs de entrada e saída em `controller/dto/`

```java
package br.com.bradesco.{sigla}.srv.mvc.controller.dto.request;

import java.io.Serializable;

public record ProdutoRequest(Long id, String nome, String descricao) implements Serializable {}
```

```java
package br.com.bradesco.{sigla}.srv.mvc.controller.dto.response;

import java.io.Serializable;

public record ProdutoResponse(Long id, String nome, String descricao) implements Serializable {}
```

### 6.3. Interface do serviço em `service/`

```java
package br.com.bradesco.{sigla}.srv.mvc.service;

import br.com.bradesco.{sigla}.srv.mvc.model.Produto;

import java.util.List;

public interface ProdutoService {
    Produto buscarPorId(Long id);
    List<Produto> listarTodos();
    Produto salvar(Produto produto);
    void remover(Long id);
}
```

### 6.4. Interface do repositório em `repository/`

```java
package br.com.bradesco.{sigla}.srv.mvc.repository;

import br.com.bradesco.{sigla}.srv.mvc.repository.entity.ProdutoEntity;

import java.util.List;
import java.util.Optional;

public interface ProdutoRepository {
    Optional<ProdutoEntity> findById(Long id);
    List<ProdutoEntity> findAll();
    ProdutoEntity save(ProdutoEntity entity);
    void deleteById(Long id);
}
```

### 6.5. Implementação do serviço com cache em `service/`

```java
package br.com.bradesco.{sigla}.srv.mvc.service;

import br.com.bradesco.{sigla}.srv.mvc.model.Produto;
import br.com.bradesco.{sigla}.srv.mvc.repository.ProdutoRepository;
import br.com.bradesco.{sigla}.srv.mvc.repository.mapper.ProdutoRepositoryMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Validated
@Service
public class ProdutoServiceImpl implements ProdutoService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProdutoServiceImpl.class);

    private static final String CACHE_PRODUTO = "ProdutoCache";
    private static final String CACHE_PRODUTO_LIST = "ProdutoListCache";

    private final ProdutoRepository repository;
    private final ProdutoRepositoryMapper repositoryMapper;

    public ProdutoServiceImpl(
            ProdutoRepository repository,
            ProdutoRepositoryMapper repositoryMapper) {
        this.repository = repository;
        this.repositoryMapper = repositoryMapper;
    }

    @Override
    @Cacheable(value = CACHE_PRODUTO, key = "#id", unless = "#result == null")
    public Produto buscarPorId(Long id) {
        LOGGER.info("Cache miss — buscando produto <{}> no repositório.", id);
        return repository.findById(id)
                .map(repositoryMapper::toModel)
                .orElse(null);
    }

    @Override
    @Cacheable(value = CACHE_PRODUTO_LIST, unless = "#result.isEmpty()")
    public List<Produto> listarTodos() {
        return repository.findAll().stream()
                .map(repositoryMapper::toModel)
                .toList();
    }

    @Override
    @Caching(
        put = @CachePut(value = CACHE_PRODUTO, key = "#result.id"),
        evict = @CacheEvict(value = CACHE_PRODUTO_LIST, allEntries = true)
    )
    public Produto salvar(Produto produto) {
        var entity = repositoryMapper.toEntity(produto);
        var saved = repository.save(entity);
        return repositoryMapper.toModel(saved);
    }

    @Override
    @Caching(evict = {
        @CacheEvict(value = CACHE_PRODUTO, key = "#id"),
        @CacheEvict(value = CACHE_PRODUTO_LIST, allEntries = true)
    })
    public void remover(Long id) {
        repository.deleteById(id);
    }
}
```

### 6.6. Controller sem conhecimento de Redis

```java
package br.com.bradesco.{sigla}.srv.mvc.controller;

import br.com.bradesco.{sigla}.srv.mvc.controller.dto.request.ProdutoRequest;
import br.com.bradesco.{sigla}.srv.mvc.controller.dto.response.ProdutoResponse;
import br.com.bradesco.{sigla}.srv.mvc.controller.mapper.ProdutoControllerMapper;
import br.com.bradesco.{sigla}.srv.mvc.service.ProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;
    private final ProdutoControllerMapper controllerMapper;

    public ProdutoController(
            ProdutoService produtoService,
            ProdutoControllerMapper controllerMapper) {
        this.produtoService = produtoService;
        this.controllerMapper = controllerMapper;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponse> buscarPorId(@PathVariable Long id) {
        var produto = produtoService.buscarPorId(id);
        return produto != null
                ? ResponseEntity.ok(controllerMapper.toResponse(produto))
                : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<ProdutoResponse>> listarTodos() {
        return ResponseEntity.ok(produtoService.listarTodos().stream()
                .map(controllerMapper::toResponse)
                .toList());
    }

    @PostMapping
    public ResponseEntity<ProdutoResponse> salvar(@RequestBody ProdutoRequest request) {
        var produto = produtoService.salvar(controllerMapper.toModel(request));
        return ResponseEntity.ok(controllerMapper.toResponse(produto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        produtoService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 6.7. O que este exemplo ensina

- a controller fala somente com `ProdutoService` e `ProdutoControllerMapper`;
- o service concentra o comportamento de cache;
- o repository continua responsável pela fonte primária;
- o model permanece puro;
- DTOs HTTP ficam fora do domínio;
- o cache segue o caso de uso, não o endpoint.

---

## 7. Estratégia de cache usada no serviço

### 7.1. `@Cacheable`

Use em leituras repetitivas quando o custo de buscar no repositório for relevante.

Exemplo:

```java
@Cacheable(value = CACHE_PRODUTO, key = "#id", unless = "#result == null")
```

Isso implementa o padrão **cache-aside** no contexto MVC: o `service` continua dono do caso de uso e só consulta a fonte primária quando não encontra uma entrada reutilizável.

### 7.2. `@CachePut`

Use após gravação quando o retorno representa o estado novo que deve ficar imediatamente disponível.

Exemplo:

```java
@CachePut(value = CACHE_PRODUTO, key = "#result.id")
```

No padrão MVC, isso evita que a controller precise conhecer sincronização de cache após escrita. A atualização continua encapsulada no `service`.

### 7.3. `@CacheEvict`

Use para remover entradas obsoletas após escrita ou remoção.

Exemplo:

```java
@CacheEvict(value = CACHE_PRODUTO_LIST, allEntries = true)
```

Quando uma lista é derivada de múltiplos registros, normalmente é mais seguro invalidá-la inteira do que tentar recalcular incrementalmente fora da camada de serviço.

### 7.4. `@Caching`

Use quando a operação exige múltiplas ações de cache, por exemplo:

- atualizar a entrada individual;
- invalidar a lista agregada.

O ponto arquitetural é: mesmo quando a operação combina leitura, escrita e invalidação, a coordenação permanece no `service`.

---

## 8. Regras práticas para agentes de código

Ao integrar Redis em um projeto MVC Bradesco, siga esta sequência:

1. consulte o **[SKILL.md](../SKILL.md)** para setup comum de dependências, segredos, perfis e TTL;
2. crie `CacheConfiguration` em `config/` com package MVC (`br.com.bradesco.{sigla}.srv.mvc.config`);
3. crie `CustomCacheErrorHandler` em pacote auxiliar (`handler/`);
4. mantenha `model/` puro, sem Lombok/Jackson;
5. mantenha DTOs HTTP em `controller/dto/request` e `controller/dto/response`;
6. garanta interfaces para `service/` e `repository/`;
7. aplique `@Cacheable`, `@CachePut` e `@CacheEvict` **somente** na implementação de `service/`;
8. use mappers entre controller, model e entity;
9. impeça que controllers injetem dependências de Redis diretamente.

---

## 9. Resumo decisório

### Faça

- coloque cache na camada `service/`;
- trate Redis como otimização de aplicação, não como detalhe de controller;
- mantenha `model/` livre de anotações e tipos de transporte;
- use `CacheConfiguration` em `config/` e `CustomCacheErrorHandler` em `handler/`;
- invalide listas quando uma escrita puder torná-las obsoletas.

### Não faça

- não coloque `@Cacheable` em controller;
- não injete `RedisTemplate` em controller;
- não use DTO HTTP dentro de `model/`;
- não trate cache como substituto da persistência primária;
- não espalhe regras de invalidação fora da camada de serviço.
