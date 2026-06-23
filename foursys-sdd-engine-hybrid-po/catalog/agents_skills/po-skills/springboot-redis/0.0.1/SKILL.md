---
name: springboot-redis
description: Implementa cache Redis em projetos Spring Boot no Bradesco. Use quando precisar adicionar cache a uma aplicação, configurar TTL por entidade, tratar falhas de cache de forma resiliente, ou entender onde as anotações @Cacheable/@CachePut/@CacheEvict devem ser aplicadas em cada arquitetura.
metadata:
  version: "0.0.1"
---

# Spring Boot Redis — Cache no Bradesco

Esta skill fornece instruções detalhadas para integrar o Azure Cache for Redis em projetos Spring Boot no ambiente Bradesco, seguindo os padrões arquiteturais oficiais e a estratégia de segredos via CSI Driver.

## Quando usar esta skill

Use esta skill quando:
- Precisar adicionar cache a operações de leitura custosas (queries pesadas, chamadas a APIs externas)
- Quiser reduzir latência e carga no banco de dados com cache-aside
- Precisar configurar TTL por tipo de entidade
- Implementar invalidação de cache consistente após mutações (escrita/remoção)
- Tratar falhas de Redis de forma resiliente (degradação graciosa)
- Configurar segredos Redis via CSI Driver (padrão Bradesco/ARO)

## Quando NÃO usar Redis como cache

- **Dados transacionais ou financeiros**: nunca armazene saldo, transações ou dados sensíveis em cache
- **Dados que mudam a cada requisição**: o overhead de cache supera o benefício
- **Dados que exigem consistência forte**: o cache-aside aceita eventual consistency — se isso for inaceitável, não use cache

## Pré-requisitos

| Requisito | Versão/Detalhe |
|-----------|---------------|
| Java | 21 (LTS) |
| Spring Boot | 3.5.x |
| Azure Cache for Redis | Provisionado via BEX Catálogo |
| Azure Key Vault | Provisionado pelo BEX com segredos da instância |
| Cluster ARO | CSI Driver habilitado + volume `/mnt/secrets-store/` montado |

## Dependências Maven

Adicione ao `pom.xml`:

```xml
<!-- Spring Cache — habilita @Cacheable, @CachePut, @CacheEvict (JSR-107/JCache) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>

<!-- Spring Data Redis — cliente Lettuce com TLS nativo -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
    <exclusions>
        <exclusion>
            <!-- CVE-2022-24735, CVE-2025-46817/18/19, CVE-2025-49844 -->
            <groupId>redis.clients.authentication</groupId>
            <artifactId>redis-authx-core</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<!-- commons-pool2 — pool de conexões Lettuce em modo Cluster -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```

> **Não adicione** `spring-cloud-azure-starter-keyvault-secrets`. No ambiente ARO, os segredos chegam via CSI Driver como arquivos montados no pod — sem SDK Azure.

## Segredos Redis via CSI Driver

No ARO (Azure Red Hat OpenShift), a aplicação **não acessa o Key Vault diretamente**. O fluxo correto é:

1. Pipeline declara em `values.yaml` quais segredos devem ser montados
2. CSI Driver busca os segredos no Key Vault
3. Cada segredo vira um arquivo em `/mnt/secrets-store/`
4. Spring Boot usa `configtree` para transformar cada arquivo em propriedade Spring

Esse modelo existe para separar responsabilidades: a infraestrutura obtém os segredos, enquanto a aplicação apenas consome propriedades já resolvidas. Com isso, elimina-se SDK de segredo no código de negócio e reduz-se o risco de exposição acidental em logs, source code ou stack traces.

### Taxonomia dos segredos

Os nomes seguem a convenção:

`redis + <centro-custo> + <domínio> + <ambiente> + <aplicação>`

| Tipo | Secret no Key Vault | Conteúdo |
|------|---------------------|----------|
| Endpoint | `{instancia}-endpoint` | Hostname do Azure Cache for Redis |
| Chave primária | `{instancia}-primary-access-key` | Senha/chave primária |
| Chave secundária | `{instancia}-secondary-access-key` | Chave de fallback |

Exemplo com a instância `redisazuhobrabexadqemp250`:

- `redisazuhobrabexadqemp250-endpoint` → `/mnt/secrets-store/redisazuhobrabexadqemp250-endpoint`
- `redisazuhobrabexadqemp250-primary-access-key` → `/mnt/secrets-store/redisazuhobrabexadqemp250-primary-access-key`

### `values.yaml` no repositório de configuração da pipeline

```yaml
azurekv:
  enabled: true
  tenant_id: <tenant-id-corporativo>  # fornecido pela infraestrutura
  key_vault:
    name: "kvazuhobrabexadqemp250"
    objects:
      - name: "redisazuhobrabexadqemp250-endpoint"
        type: "secret"
      - name: "redisazuhobrabexadqemp250-primary-access-key"
        type: "secret"
      - name: "redisazuhobrabexadqemp250-secondary-access-key"
        type: "secret"
```

> Se o secret não for declarado aqui, **não será montado no pod**. As propriedades Redis ficarão vazias ou usarão o default local.

## Configuração da aplicação

### `application.yml` — base (todos os perfis)

```yaml
spring:
  config:
    # configtree: cada arquivo em /mnt/secrets-store/ vira uma propriedade Spring
    import: "optional:configtree:/mnt/secrets-store/"

  data:
    redis:
      host: ${redisazuhobrabexadqemp250-endpoint:localhost}
      port: ${REDIS_PORT:6379}
      username: ${REDIS_USER:}
      password: ${redisazuhobrabexadqemp250-primary-access-key:}
      timeout: ${REDIS_TIMEOUT:2000ms}
      connect-timeout: ${REDIS_CONNECT_TIMEOUT:2000ms}

bradesco.starter.caching:
  enabled: true
  required: false  # false = falha de cache apenas logada (não derruba a aplicação)
  defaults:
    ttl: ${APP_CACHING_DEFAULT_TTL_SECONDS:30s}
  overrides:        # TTL por cache — deve corresponder aos nomes em @Cacheable
    ProdutoCache:
      ttl: ${APP_CACHING_PRODUTO_TTL_SECONDS:5m}
    ProdutoListCache:
      ttl: ${APP_CACHING_PRODUTO_LIST_TTL_SECONDS:2m}
```

> **Nunca versione host real, senha ou endpoint no `application.yml`**. Os valores chegam via `configtree` em runtime.

O `required: false` indica que falhas do Redis são apenas logadas e não propagadas. Se Redis cair, a aplicação continua atendendo via fonte primária. Use `required: true` apenas quando o cache for absolutamente crítico e a indisponibilidade do Redis realmente deva parar o serviço.

### `application-default.yml` — perfil local (Docker)

```yaml
bradesco.starter:
  caching:
    enabled: false  # desabilitado localmente por padrão

spring:
  data:
    redis:
      host: localhost
      port: 6379
      username: ""
      password: ""
      database: 0
```

> Para desligar o cache localmente: `bradesco.starter.caching.enabled: false`. Isso reduz atrito no desenvolvimento e evita dependência de infraestrutura local.

No starter Hexagonal o perfil local se chama `default` e é ativado sem variáveis adicionais. No MVC o perfil também se chama `default`, mas normalmente aparece com `enabled: false` explícito.

### Perfil cloud/ARO — modo Cluster

```yaml
spring:
  data:
    redis:
      client-name: ${info.app.name}
      database: 0
      connect-timeout: ${REDIS_CONNECT_TIMEOUT:60s}
      timeout: ${REDIS_READ_TIMEOUT:2s}

      cluster:
        max-redirects: 3
        nodes: ${REDIS_NODES:}  # lista: ip1:port,ip2:port,...

      lettuce:
        cluster:
          refresh:
            adaptive: true
            dynamic-refresh-sources: true
            period: 60s
        pool:
          enabled: true
          max-active: ${REDIS_POOL_MAX_ACTIVE:64}
          min-idle: ${REDIS_POOL_MIN_IDLE:4}
          max-idle: ${REDIS_POOL_MAX_IDLE:16}
          max-wait: ${REDIS_POOL_MAX_WAIT:500ms}
          time-between-eviction-runs: ${REDIS_POOL_REFRESH:60s}
          shutdown-timeout: 50ms
```

> **Nome do perfil:** no starter Hexagonal o perfil cloud é `container` (`application-container.yml`); no MVC é `production` (`application-production.yml`). Consulte o arquivo de referência da sua arquitetura.

Essa configuração existe para lidar com topologia distribuída e carga real de produção. `cluster.nodes` informa os nós do Redis Cluster, `refresh.adaptive` e `dynamic-refresh-sources` ajudam o Lettuce a reagir a mudanças de topologia, e o pool de conexões melhora estabilidade e previsibilidade sob carga.

## Onde ficam as anotações de cache?

Esta é a decisão arquitetural mais importante. A resposta depende da arquitetura do projeto:

| Arquitetura | Camada para @Cacheable/@CachePut/@CacheEvict |
|-------------|----------------------------------------------|
| **Hexagonal** | `core/usecase/` — UseCase é o ponto de entrada do domínio |
| **MVC** | `service/` — Service coordena a lógica de negócio |

**Em ambos os casos:**
- ❌ `controller/` (adapter de entrada) não conhece cache
- ❌ `repository/` (infraestrutura de dados) não conhece cache
- ✅ A camada que orquestra o fluxo de negócio é responsável pela política de cache

## Resiliência e tratamento de erros de cache

O `CustomCacheErrorHandler` intercepta falhas de cache antes que elas se tornem exceção para o usuário final. Isso evita que um problema transitório no Redis derrube um fluxo cujo dado ainda pode ser buscado na fonte primária.

- Quando `required: false`, falhas de Redis são apenas logadas e o fluxo continua
- Quando `required: true`, falhas de Redis são propagadas como exceção — use isso apenas quando o cache for fonte primária de verdade
- O handler deve ser configurado via `CacheConfiguration`, que implementa `CachingConfigurer`
- A implementação específica varia por arquitetura — consulte a referência da sua arquitetura para o código Java

## Integração por Arquitetura

### Arquitetura Hexagonal

📖 Consulte [references/hexagonal-redis-integration.md](references/hexagonal-redis-integration.md) para:
- Estrutura completa de pacotes adaptada para `springboot-hexagonal-arch 0.1.1`
- Onde o `CacheConfiguration.java` vive no contexto hexagonal
- `CustomCacheErrorHandler` com exceções de domínio
- Implementação completa do `UseCaseImpl` com anotações de cache
- Configuração de todos os perfis (local, cloud/ARO)

### Arquitetura MVC

📖 Consulte [references/mvc-redis-integration.md](references/mvc-redis-integration.md) para:
- Estrutura completa de pacotes adaptada para `springboot-mvc-arch 0.0.2`
- `CacheConfiguration.java` em `config/`
- `CustomCacheErrorHandler` em `handler/`
- Implementação do `Service` com anotações de cache
- Configuração de todos os perfis

## Estratégia de Chave de Cache

Chaves devem ser previsíveis, legíveis e segmentadas por domínio:

| Padrão | Exemplo |
|--------|---------|
| `{entidade}:{id}` | `produto:42` |
| `{sigla}:{entidade}:{id}` | `catalog:produto:42` |
| `{sigla}:{entidade}:list` | `catalog:produto:list` |
| `{sigla}:{entidade}:{campo}:{valor}` | `catalog:produto:nome:tablet` |

> Prefixe sempre com a sigla do sistema para isolar namespaces, mesmo em instâncias Redis dedicadas.

## TTL por Natureza dos Dados

| Natureza dos Dados | TTL Sugerido |
|-------------------|-------------|
| Dados estáticos (tabelas de domínio) | 60 min |
| Dados semi-estáticos (catálogos) | 15–30 min |
| Dados de sessão / contexto | 5–10 min |
| Dados de consulta frequente | 1–5 min |
| Dados transacionais / financeiros | ❌ Não cachear |

### Heurística para definir TTL

Antes de definir o TTL, responda:

- Com que frequência o dado muda? (minutos? horas? dias?)
- Qual o custo de estar desatualizado? (impacto no cliente, risco, compliance)
- Qual o custo de recomputar ou rebuscar? (query pesada? API externa cara?)

Regra geral: se o dado muda a cada ~X, comece com TTL entre `X/5` e `X/2`, depois ajuste com observabilidade.

### Alinhamento com RFC 7234

| Diretiva RFC 7234 | Equivalente no starter | Observação |
|-------------------|------------------------|------------|
| `max-age=N` | `bradesco.starter.caching.defaults.ttl: Ns` | TTL global |
| `max-age` por recurso | `bradesco.starter.caching.overrides.<nome>.ttl` | TTL individual por cache name |
| `no-cache` | `@Cacheable(condition = "false")` | Força consulta à fonte primária |
| `no-store` | Não registrar em `overrides` | Dados sensíveis nunca devem ser cacheados |
| `must-revalidate` | `@CachePut` após persistência | Garante que escritas refletem no cache |
| Invalidação (§4.3.5) | `@CacheEvict` | Remove entradas obsoletas após mutações |

Configure os TTLs no `application.yml`:

```yaml
bradesco.starter.caching:
  enabled: true
  required: false
  defaults:
    ttl: 30s
  overrides:
    ProdutoCache:
      ttl: 5m
    ProdutoListCache:
      ttl: 2m
```

## Antipadrões Comuns

❌ **Evitar:**

| Antipadrão | Problema |
|-----------|---------|
| `@Cacheable` no `Controller` | Viola separação de responsabilidades; o adapter de entrada não deve conhecer infraestrutura |
| `@Cacheable` no `Repository` | Mistura persistência com cache; dificulta testes e manutenção |
| Cachear dados financeiros ou PII | Risco de compliance, dados sensíveis expostos no Redis |
| Hardcoded de host/senha no `application.yml` | Violação de segurança; use sempre configtree + variáveis de ambiente |
| Usar `allEntries = true` no `@CacheEvict` sem necessidade | Invalida todo o cache desnecessariamente; prefira invalidação por chave específica |
| Não definir TTL | Dados obsoletos acumulam indefinidamente no Redis |
| Não excluir `redis-authx-core` | Exposição a CVEs mapeados |
| Não implementar `CustomCacheErrorHandler` | Falhas de Redis propagam exceção e derrubam a aplicação |

✅ **Fazer:**

- Sempre definir TTL explícito por cache name em `overrides`
- Usar `required: false` em produção para degradação graciosa
- Implementar `CustomCacheErrorHandler` para logar e não propagar falhas
- Testar o comportamento com Redis indisponível (o handler deve absorver o erro)
- Usar `disableCachingNullValues()` para evitar cache de resultados nulos

## Checklist de Segurança

- [ ] Segredos Redis consumidos via CSI driver + configtree — sem SDK Azure KV
- [ ] `values.yaml` da pipeline declara `endpoint`, `primary-access-key` e `secondary-access-key`
- [ ] `spring.config.import: "optional:configtree:/mnt/secrets-store/"` no `application.yml`
- [ ] Nenhum host, porta ou senha no `application.yml` versionado
- [ ] `bradesco.starter.caching.enabled: false` no perfil local (`application-default.yml`)
- [ ] `bradesco.starter.caching.required: false` em produção
- [ ] `commons-pool2` declarado para pool Lettuce em modo Cluster
- [ ] Exclusão de `redis-authx-core` no `pom.xml`
- [ ] Dados sensíveis (senhas, PII, financeiros) fora do `bradesco.starter.caching.overrides`
- [ ] TTL definido para todas as entradas
- [ ] `disableCachingNullValues()` ativo na `CacheConfiguration`
