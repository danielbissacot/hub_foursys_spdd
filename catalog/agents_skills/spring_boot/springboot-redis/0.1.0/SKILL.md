---
name: 'springboot-redis'
description: "Implementa cache distribuído com Azure Cache for Redis (via CSI Driver) no padrão Hexagonal. Cobre @Cacheable, @CacheEvict, @CachePut, TTL por natureza dos dados (estático 24h / semi-estático 1h / transacional 5min), degradação graceful (required: false) e adapter de cache. Use quando a história precisar de cache para reduzir latência ou carga em banco/APIs externas."
metadata:
  version: "0.1.0"
---

# Skill: springboot-redis

Guia completo para implementar **cache distribuído Redis** em projetos Java 21 + Spring Boot 3.x com Arquitetura Hexagonal — Azure Cache for Redis via CSI Driver.

> **Invocado por:** `foursys-specify-tech.md` Spring Boot quando a história especifica TTL de cache por natureza dos dados.

---

## Quando usar

- Dados consultados frequentemente com baixa taxa de mudança (tabelas de domínio, parâmetros).
- Redução de latência em APIs externas com SLA alto.
- Rate limiting ou controle de idempotência temporária.

## Quando não usar

- Dados que precisam de consistência forte e imediata após escrita.
- Cache de sessão de usuário → use Spring Session com Redis separadamente.

---

## TTL por Natureza dos Dados

| Natureza | TTL | Exemplo |
|---|---|---|
| **Estático** | 24h | Parâmetros de sistema, tabelas de domínio, configurações |
| **Semi-estático** | 1h | Limites de crédito, taxas, dados de cadastro |
| **Transacional** | 5min | Consultas recentes, saldos, estados de workflow |
| **Idempotência** | 24h | IDs de eventos já processados (Kafka DLQ) |

---

## Estrutura de Arquivos (Hexagonal)

```
adapter/output/cache/
└── <Dominio>CacheAdapter.java          ← Implementa OutputPort de cache (opcional)

config/
└── CacheConfig.java                    ← Configuração TTLs, serialização, nomes de cache
```

---

## Implementação

### 1. Dependências (pom.xml)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

---

### 2. Configuração (application.yml)

```yaml
spring:
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      ssl:
        enabled: ${REDIS_SSL_ENABLED:false}
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0

cache:
  ttl:
    estatico: 86400      # 24h em segundos
    semi-estatico: 3600  # 1h em segundos
    transacional: 300    # 5min em segundos
```

---

### 3. Configuração de Cache (CacheConfig)

```java
// FILEPATH: config/CacheConfig.java
@Configuration
@EnableCaching
public class CacheConfig {

    @Value("${cache.ttl.estatico}")
    private long ttlEstatico;

    @Value("${cache.ttl.semi-estatico}")
    private long ttlSemiEstatico;

    @Value("${cache.ttl.transacional}")
    private long ttlTransacional;

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        var defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        return RedisCacheManager.builder(factory)
            .withCacheConfiguration("parametros",
                defaultConfig.entryTtl(Duration.ofSeconds(ttlEstatico)))
            .withCacheConfiguration("limites-credito",
                defaultConfig.entryTtl(Duration.ofSeconds(ttlSemiEstatico)))
            .withCacheConfiguration("saldos",
                defaultConfig.entryTtl(Duration.ofSeconds(ttlTransacional)))
            .build();
    }
}
```

---

### 4. Uso com Anotações no UseCase ou Service

```java
// FILEPATH: core/usecase/ConsultarParametroUseCase.java
@Component
@RequiredArgsConstructor
public class ConsultarParametroUseCase implements ConsultarParametroInputPort {

    private final ParametroRepositoryOutputPort parametroRepository;

    @Override
    @Cacheable(value = "parametros", key = "#codigoParametro", unless = "#result == null")
    public Parametro consultar(String codigoParametro) {
        return parametroRepository.buscarPorCodigo(codigoParametro)
            .orElseThrow(() -> new ParametroNaoEncontradoException(codigoParametro));
    }

    @CacheEvict(value = "parametros", key = "#parametro.codigo")
    public void invalidarCache(Parametro parametro) {
        // chamado após atualização
    }
}
```

---

### 5. Degradação Graceful (required = false)

Para cache não-crítico — se o Redis estiver indisponível, continua sem cache:

```java
@Cacheable(value = "saldos", key = "#conta", sync = true)
public Saldo consultarSaldo(String conta) {
    return saldoApiOutputPort.buscar(conta);
}

// Em CacheConfig, configure comportamento graceful:
@Bean
public CacheErrorHandler cacheErrorHandler() {
    return new SimpleCacheErrorHandler() {
        @Override
        public void handleCacheGetError(RuntimeException e, Cache cache, Object key) {
            log.warn("Redis indisponível — continuando sem cache. cache={} key={}", cache.getName(), key);
        }
    };
}
```

---

### 6. Adapter de Cache para Idempotência

```java
// FILEPATH: adapter/output/cache/IdempotenciaCacheAdapter.java
@Component
@RequiredArgsConstructor
public class IdempotenciaCacheAdapter implements IdempotenciaOutputPort {

    private final RedisTemplate<String, String> redisTemplate;

    private static final Duration TTL_IDEMPOTENCIA = Duration.ofHours(24);
    private static final String PREFIX = "idempotencia:";

    @Override
    public boolean jaProcessado(String eventId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(PREFIX + eventId));
    }

    @Override
    public void registrarProcessado(String eventId) {
        redisTemplate.opsForValue().set(PREFIX + eventId, "1", TTL_IDEMPOTENCIA);
    }
}
```

---

## Segurança PII

- **NUNCA** armazene dados PII (CPF, senha, token, conta) diretamente no Redis sem criptografia.
- Use a chave de cache de forma que não exponha dados sensíveis: `"saldo:" + hash(conta)`.
- Configure `requirepass` no Redis e trafegue apenas via SSL em produção.

---

## Checklist de Implementação

- [ ] Dependências `spring-boot-starter-data-redis` e `spring-boot-starter-cache` adicionadas
- [ ] `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` como variáveis de ambiente
- [ ] `@EnableCaching` em `CacheConfig`
- [ ] TTLs definidos por natureza: estático (24h), semi-estático (1h), transacional (5min)
- [ ] `RedisCacheManager` configurado com TTL por nome de cache
- [ ] `CacheErrorHandler` para degradação graceful
- [ ] `@Cacheable` / `@CacheEvict` / `@CachePut` nos pontos corretos
- [ ] Adapter de idempotência criado se necessário
- [ ] `@Bean` dos adapters registrado em `config/`
- [ ] Nenhum dado PII em chaves ou valores de cache
- [ ] Testes com `@EmbeddedRedis` ou mock do `RedisTemplate` (cobertura ≥ 95%)
