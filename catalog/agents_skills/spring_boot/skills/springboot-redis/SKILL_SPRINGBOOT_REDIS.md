---
name: springboot-redis
description: Implementa cache com Azure Cache for Redis em Spring Boot usando @Cacheable/@CachePut/@CacheEvict com CSI Driver (sem SDK no código), TTL por natureza de dado e degradação graceful. Use para features de cache, otimização de performance e redução de latência em leituras repetitivas.
metadata:
  version: "0.0.1"
---

# Spring Boot — Azure Cache for Redis

Implemente cache com Spring Cache abstraction conectado ao Azure Cache for Redis. Segredos gerenciados via CSI Driver — nunca via SDK no código.

## Regras Críticas

- **Segredos via CSI Driver**: `spring.data.redis.password` deve ser lido de arquivo montado (`configtree`), nunca hardcoded.
- **NUNCA cachear** dados financeiros sensíveis (saldo em tempo real, transações pendentes, dados PCI-DSS).
- **Degradação graceful**: configure `required: false` — cache down não pode derrubar o serviço.
- **Desabilitar localmente**: profile `local` sem conexão Redis (use `@Profile("!local")`).
- **BigDecimal**: valores monetários nunca como String em cache — serialize com `GenericJackson2JsonRedisSerializer`.

## TTL por Natureza de Dado

| Natureza | TTL | Exemplos |
|----------|-----|---------|
| Estático | 24h | tabelas de domínio, configurações de produto |
| Semi-estático | 1h | dados de cliente (nome, endereço), limites operacionais |
| Transacional | 5min | cotações, taxas, disponibilidade |

## Configuração (application.yml)

```yaml
spring:
  cache:
    type: redis
  data:
    redis:
      host: ${REDIS_HOST}
      port: 6380
      ssl:
        enabled: true
      password: ${REDIS_PASSWORD}  # injetado via configtree/CSI Driver
      connect-timeout: 2000
      timeout: 1000
  cache:
    redis:
      time-to-live: 3600000  # TTL padrão 1h em ms

# Desabilitar cache em local
---
spring:
  config:
    activate:
      on-profile: local
  cache:
    type: none
```

## Configuração de Bean

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheConfiguration defaultCacheConfig() {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1))
                .disableCachingNullValues()
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                new GenericJackson2JsonRedisSerializer()
                        )
                );
    }

    @Bean
    public RedisCacheManagerBuilderCustomizer cacheManagerCustomizer() {
        return builder -> builder
                .withCacheConfiguration("usuarios",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(Duration.ofHours(1)))
                .withCacheConfiguration("cotacoes",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(Duration.ofMinutes(5)))
                .withCacheConfiguration("configuracoes",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(Duration.ofHours(24)));
    }
}
```

## Padrão de Uso nas Annotations

```java
@Service
public class UsuarioService {

    // Leitura — cacheia o resultado; retorna do cache se já existir
    @Cacheable(value = "usuarios", key = "#id", unless = "#result == null")
    public UsuarioResponse buscarUsuario(String id) {
        return outputPort.buscar(id);
    }

    // Atualização — atualiza o cache com o novo valor
    @CachePut(value = "usuarios", key = "#result.id")
    public UsuarioResponse atualizarUsuario(AtualizarUsuarioCommand cmd) {
        return outputPort.atualizar(cmd);
    }

    // Remoção — invalida a entrada do cache
    @CacheEvict(value = "usuarios", key = "#id")
    public void removerUsuario(String id) {
        outputPort.remover(id);
    }

    // Evict em múltiplas chaves
    @Caching(evict = {
            @CacheEvict(value = "usuarios", key = "#id"),
            @CacheEvict(value = "usuarios-lista", allEntries = true)
    })
    public void removerComLimpeza(String id) {
        outputPort.remover(id);
    }
}
```

## Adapter Hexagonal (OutputPort + Adapter)

```java
// port/output/CacheOutputPort.java
public interface CacheOutputPort {
    void invalidar(String cacheName, String key);
    void invalidarTodos(String cacheName);
}

// adapter/output/cache/RedisCacheAdapter.java
@Component
@RequiredArgsConstructor
public class RedisCacheAdapter implements CacheOutputPort {

    private final CacheManager cacheManager;

    @Override
    public void invalidar(String cacheName, String key) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.evict(key);
        }
    }

    @Override
    public void invalidarTodos(String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        }
    }
}
```

## Degradação Graceful

```java
@Configuration
public class RedisConfig {

    @Bean
    public CacheErrorHandler cacheErrorHandler() {
        return new SimpleCacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException ex, Cache cache, Object key) {
                log.warn("Cache read error [{}:{}] — fallback to source", cache.getName(), key);
            }

            @Override
            public void handleCachePutError(RuntimeException ex, Cache cache, Object key, Object value) {
                log.warn("Cache write error [{}:{}] — continuing without cache", cache.getName(), key);
            }
        };
    }
}
```

## Anti-patterns

```java
// PROIBIDO: cache de dado financeiro sensível
@Cacheable("saldos")  // NUNCA — saldo muda a cada transação
public BigDecimal buscarSaldo(String conta) { ... }

// PROIBIDO: TTL infinito
RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ZERO); // NUNCA

// PROIBIDO: senha hardcoded
spring.data.redis.password=minha-senha-fixa  // NUNCA
```
