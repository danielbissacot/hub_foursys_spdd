---
name: springboot-certificado-impl
description: |
  Implementações completas do client HTTP com ensc-lib-autogestao-certificadopub:
  RestTemplate, FeignClient Default, FeignClient OkHttp, FeignClient Apache HC5,
  WebClient e RestClient. Inclui classe de configuração, hot-reload (BundleConfig)
  e adapter com @HandleInvalidPublicCertificate (lib >= 1.7.0) ou recarregamento manual
  (lib < 1.7.0 / RestClient) para cada variante, com a separação obrigatória entre
  erro de negócio e erro técnico de conectividade.
  Use quando: já respondeu as perguntas do /skill springboot-certificado e precisa
  do código completo para o client HTTP escolhido.
metadata:
  version: "1.1.0"
---

# Skill: Certificado SSL — Implementações por Client HTTP

Informe qual client HTTP o projeto usa e a versão da lib (`/skill springboot-certificado`, Passo 0) e
gere o código completo para aquele client.

Cada implementação requer **3 artefatos**:
1. **Classe de configuração** — cria o bean com SSL bundle
2. **Classe de hot-reload** em `config/certificado/` — registra handler de renovação
3. **Adapter/service** — recarregamento do certificado, pelo Caminho A ou B abaixo

> ⚠️ **`@HandleInvalidPublicCertificate`/`@HandleReactiveInvalidPublicCertificate` não impedem a
> exceção de propagar.** O advice é `@AfterThrowing` — reage à falha (dispara a renovação, que só
> beneficia a **próxima** chamada) mas nunca substitui a exceção original, que sempre propaga ao
> chamador do método anotado. Se a chamada for best-effort, proteger com `try/catch` em **quem invoca**
> o método anotado — a anotação sozinha não isola isso.

**Escolher o caminho de recarregamento conforme a versão da lib no pom.xml do projeto:**
- **Lib `>= 1.7.0`, RestTemplate/Feign/WebClient → Caminho A (anotação).** Mais simples, mecanismo oficial.
- **Lib `< 1.7.0`, ou a anotação não compila/resolve → Caminho B (manual).**
- **RestClient → sempre Caminho B** — a lib não cobre RestClient em nenhuma versão.

Em **todos** os caminhos manuais (Caminho B), a regra é a mesma: separar erro de negócio (resposta HTTP
de erro vinda da própria SRV — nunca aciona renovação) de erro técnico/conectividade (timeout, DNS,
SSLHandshakeException — aciona `recarregar()`/`renewCertificate()`). Implementações reais que capturam
essa distinção de forma ampla demais acabaram acionando renovação até em erro de negócio — não repetir
esse erro.

---

## RestTemplate (padrão oficial)

### RestTemplateConfig

```java
import org.springframework.boot.ssl.SslBundles;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean("restBean")
    public RestTemplate construirRestTemplate(RestTemplateBuilder builder, SslBundles sslBundles) {
        return builder
                .setSslBundle(sslBundles.getBundle("sslBundle1"))
                .build();
    }
}
```

### BundleRestConfig (hot-reload) — `config/certificado/BundleRestConfig.java`

```java
import br.com.bradesco.lib.autogestao.service.singleton.ClientSSLCertificado;
import br.com.bradesco.lib.autogestao.service.singleton.ControleAcessoSSLBundle;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class BundleRestConfig {

    private final ControleAcessoSSLBundle estadoInstance = ControleAcessoSSLBundle.getInstance();
    private final ConcurrentHashMap<String, Object> client = ClientSSLCertificado.getInstance();
    private static final String BUNDLE_ARO = "sslBundle1";
    private static final String BEAN_NAME = "restBean";

    private final SslBundles sslBundles;
    private final RestTemplateBuilder builder;

    public BundleRestConfig(SslBundles sslBundles, RestTemplateBuilder builder) {
        this.sslBundles = sslBundles;
        this.builder = builder;
    }

    @PostConstruct
    public void initRest() {
        sslBundles.addBundleUpdateHandler(BUNDLE_ARO, bundle -> {
            client.compute(BEAN_NAME, (k, v) -> new RestTemplateConfig().construirRestTemplate(builder, sslBundles));
            estadoInstance.setAtualizarCertificado(Boolean.TRUE);
        });
    }
}
```

### Adapter — Caminho A (anotação, lib `>= 1.7.0`)

```java
import br.com.bradesco.lib.autogestao.anotation.HandleInvalidPublicCertificate;
import br.com.bradesco.lib.autogestao.service.RestTemplateSSLCertificadoService;
import org.springframework.stereotype.Service;

@Service
public class ExternalServiceImpl {

    private static final String SERVIDOR_ABC = "servidor-abc"; // casar com application.yml

    private final RestTemplateSSLCertificadoService restTemplateSSLCertificadoService;

    public ExternalServiceImpl(RestTemplateSSLCertificadoService restTemplateSSLCertificadoService) {
        this.restTemplateSSLCertificadoService = restTemplateSSLCertificadoService;
    }

    @HandleInvalidPublicCertificate(template = SERVIDOR_ABC)
    public String call() {
        return restTemplateSSLCertificadoService
                .provedorRestTemplate("restBean")
                .getForObject("https://exemplo.com/recurso", String.class);
    }
}
```

### Adapter — Caminho B (manual, lib `< 1.7.0`)

`HttpStatusCodeException` deve ser capturado **antes** de `RestClientException` — é subtipo dela.

```java
import br.com.bradesco.lib.autogestao.service.RenovacaoCertificadoPublicoService;
import br.com.bradesco.lib.autogestao.service.RestTemplateSSLCertificadoService;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class ExternalServiceImpl {

    private static final String SERVIDOR_ABC = "servidor-abc"; // casar com application.yml

    private final RestTemplateSSLCertificadoService restTemplateSSLCertificadoService;
    private final RenovacaoCertificadoPublicoService renovacaoCertificadoService;

    public ExternalServiceImpl(RestTemplateSSLCertificadoService restTemplateSSLCertificadoService,
                                RenovacaoCertificadoPublicoService renovacaoCertificadoService) {
        this.restTemplateSSLCertificadoService = restTemplateSSLCertificadoService;
        this.renovacaoCertificadoService = renovacaoCertificadoService;
    }

    public String call() {
        RestTemplate restTemplate = restTemplateSSLCertificadoService.provedorRestTemplate("restBean");
        try {
            return restTemplate.getForObject("https://exemplo.com/recurso", String.class);
        } catch (HttpStatusCodeException e) {
            // 4xx ou 5xx retornado pela própria SRV = erro de negócio, nunca aciona renovação de cert
            throw e;
        } catch (RestClientException e) {
            // Falha antes de obter resposta HTTP (timeout, DNS, SSLHandshakeException) = erro técnico
            renovacaoCertificadoService.recarregar(e, SERVIDOR_ABC);
            throw e;
        }
    }
}
```

> Se o projeto tiver mais de um Adapter repetindo esse mesmo `try/catch`, extrair só a chamada de
> `recarregar()` para um método compartilhado — sem misturar com mapeamento de erro de negócio para
> exceção de domínio (decisão de arquitetura de erros da API, não faz parte da integração com a lib).

---

## FeignClient — Client Default (javax.net.ssl)

### FeignConfigSSL

```java
import br.com.bradesco.lib.autogestao.service.client.feign.ClientDefaultSSLCertificado;
import br.com.bradesco.lib.autogestao.service.singleton.ClientFeignSSLCertificado;
import feign.Client;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class FeignConfigSSL {

    public static final String BUNDLE_SSL = "sslBundle1";
    public static final String FEIGN_SSL_BEAN = "feignBeanConfig";

    private final ConcurrentHashMap<String, Client> clients = ClientFeignSSLCertificado.getInstance();

    @Bean(FEIGN_SSL_BEAN)
    public Client configClient(final SslBundles sslBundles) {
        // computeIfAbsent, não putIfAbsent: só reconstrói o client se a chave ainda não existir —
        // putIfAbsent sempre construiria o client SSL antes de checar, descartando-o se já existisse.
        clients.computeIfAbsent(FEIGN_SSL_BEAN, k -> getClientFeign(sslBundles.getBundle(BUNDLE_SSL)));
        return new ClientDefaultSSLCertificado();
    }

    public static Client getClientFeign(SslBundle bundle) {
        return new Client.Default(
                bundle.createSslContext().getSocketFactory(),
                SSLConnectionSocketFactory.getDefaultHostnameVerifier()
        );
    }
}
```

> Se o projeto tiver chamadas HTTP (sem SSL), criar uma classe separada:
> ```java
> @Configuration
> public class FeignConfigDefault {
>     @Bean("feignClient")
>     public Client createDefaultClient() throws NoSuchAlgorithmException {
>         SSLContext sslContext = SSLContext.getDefault();
>         return new Client.Default(sslContext.getSocketFactory(), new NoopHostnameVerifier());
>     }
> }
> ```

### SSLBundleConfig (hot-reload) — `config/certificado/SSLBundleConfig.java`

```java
import br.com.bradesco.lib.autogestao.service.singleton.ClientFeignSSLCertificado;
import br.com.bradesco.lib.autogestao.service.singleton.ControleAcessoSSLBundle;
import feign.Client;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SSLBundleConfig {

    private final ControleAcessoSSLBundle estadoInstance = ControleAcessoSSLBundle.getInstance();
    private final ConcurrentHashMap<String, Client> clients = ClientFeignSSLCertificado.getInstance();

    private final SslBundles sslBundles;

    public SSLBundleConfig(SslBundles sslBundles) {
        this.sslBundles = sslBundles;
    }

    @PostConstruct
    public void init() {
        // Constantes vêm de FeignConfigSSL — não redeclarar aqui.
        sslBundles.addBundleUpdateHandler(FeignConfigSSL.BUNDLE_SSL, bundle -> {
            clients.compute(FeignConfigSSL.FEIGN_SSL_BEAN, (k, v) -> FeignConfigSSL.getClientFeign(bundle));
            estadoInstance.setAtualizarCertificado(Boolean.TRUE);
        });
    }
}
```

### Interface FeignClient

```java
@FeignClient(
        configuration = FeignConfigSSL.class,
        value = "nome-do-cliente",
        url = "https://URL-DO-SERVICO-HTTPS"
)
public interface ClientXYZ {
    @GetMapping("/algum-recurso")
    String execute();
}
```

### Adapter — Caminho A (anotação, lib `>= 1.7.0`)

```java
import br.com.bradesco.lib.autogestao.anotation.HandleInvalidPublicCertificate;
import org.springframework.stereotype.Service;

@Service
public class ExternalServiceImpl {

    private static final String SERVIDOR_ABC = "servidor-abc"; // casar com application.yml

    private final ClientXYZ client;

    public ExternalServiceImpl(ClientXYZ client) {
        this.client = client;
    }

    @HandleInvalidPublicCertificate(template = {SERVIDOR_ABC})
    public void callService() {
        client.execute();
    }
}
```

### Adapter — Caminho B (manual, lib `< 1.7.0`)

`RetryableException` deve ser capturada **antes** de `FeignException` — é subtipo dela.

```java
import br.com.bradesco.lib.autogestao.service.RenovacaoCertificadoPublicoService;
import feign.FeignException;
import feign.RetryableException;
import org.springframework.stereotype.Service;

@Service
public class ExternalServiceImpl {

    private static final String SERVIDOR_ABC = "servidor-abc"; // casar com application.yml

    private final ClientXYZ client;
    private final RenovacaoCertificadoPublicoService renovacaoCertificadoService;

    public ExternalServiceImpl(ClientXYZ client, RenovacaoCertificadoPublicoService renovacaoCertificadoService) {
        this.client = client;
        this.renovacaoCertificadoService = renovacaoCertificadoService;
    }

    public void callService() {
        try {
            client.execute();
        } catch (RetryableException e) {
            // Falha antes de obter resposta HTTP (timeout, DNS, SSL) = erro técnico
            renovacaoCertificadoService.recarregar(e, SERVIDOR_ABC);
            throw e;
        } catch (FeignException e) {
            // Resposta HTTP de erro 4xx/5xx da SRV = erro de negócio, nunca aciona renovação
            throw e; // mapear para exceção de domínio se necessário
        }
    }
}
```

---

### ⚠️ Feign: exigências ocultas com `@EnableAutoGestaoCertificado`

Aplica-se às três variantes abaixo (Client Default, OkHttp, Apache HC5). Só quebra em
`spring-boot:run`/pod real — `mvn test` (mockado) não pega.

**1. Todo `@FeignClient` de `br.com.bradesco` precisa de `configuration` não vazia.** A lib varre o
classpath inteiro no startup (não só o microsserviço atual); qualquer `@FeignClient` sem `configuration`
lança `PropiedadeConfigurationFeignNaoEncontradaException` e derruba a aplicação. Antes de ativar a lib,
rodar `grep -r "@FeignClient" src/main/java` e cobrir os que não têm SSL com uma config genérica
reaproveitável (variante OkHttp; adaptar client conforme a seção correspondente):

```java
@Configuration
public class FeignConfigDefault {

    @Bean("feignClient")
    public Client createClient(OkHttpClient okHttpClient) {
        return new feign.okhttp.OkHttpClient(okHttpClient);
    }
}
```

**2. O `@Bean` dentro de `configuration =` precisa de nome explícito, exatamente um por classe.** Zero ou
mais de um método `@Bean` (`ConfiguracaoSemBeanConfiguradoException`/`ExisteMaisDeUmMetodoAnotadoComBeanException`)
ou `@Bean` sem `value()` também derruba a app. Vale para qualquer classe usada em `configuration =`,
incluindo interceptors que já existiam no projeto. Não nomeie o bean como a versão decapitalizada da
própria classe se ela também for `@Configuration`/`@Component` — colide com o bean-padrão dela
(`factory-bean reference points back to the same bean definition`). Use um sufixo, ex.:
`meuInterceptorRequestInterceptor`.

---

## FeignClient — OkHttp

### pom.xml adicional

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-okhttp</artifactId>
</dependency>
```

### application.yml adicional

```yaml
spring:
  cloud:
    openfeign:
      okhttp:
        enabled: true
      httpclient:
        maxConnections: ${OPENFEIGN_HTTPCLIENT_MAX_CONNECTIONS:300}
        maxConnectionsPerRoute: ${OPENFEIGN_HTTPCLIENT_MAX_CONNECTIONS_PER_ROUTE:50}
        timeToLive: ${OPENFEIGN_TIME_TO_LIVE:500}
        connectionTimeout: ${OPENFEIGN_HTTPCLIENT_CONNECTION_TIMEOUT:2000}
        connectionTimerRepeat: ${OPENFEIGN_HTTPCLIENT_CONNECTION_TIMER_REPEAT:3000}
      client:
        config:
          default:
            connectTimeout: ${OPENFEIGN_HTTPCLIENT_CONNECT_TIMEOUT:6000}
            readTimeout: ${OPENFEIGN_HTTPCLIENT_READ_TIMEOUT:6000}
```

### FeignConfigSSL (OkHttp)

```java
import br.com.bradesco.lib.autogestao.service.client.feign.ClientDefaultSSLCertificado;
import br.com.bradesco.lib.autogestao.service.singleton.ClientFeignSSLCertificado;
import br.com.bradesco.lib.autogestao.util.X509Utils;
import feign.Client;
import okhttp3.OkHttpClient;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class FeignConfigSSL {

    public static final String BUNDLE_SSL = "sslBundle1";
    public static final String FEIGN_SSL_BEAN = "feignBeanConfig";

    private final ConcurrentHashMap<String, Client> clients = ClientFeignSSLCertificado.getInstance();

    @Bean(FEIGN_SSL_BEAN)
    public Client configClient(final SslBundles sslBundles, OkHttpClient okhttp) {
        // computeIfAbsent, não putIfAbsent: só reconstrói o client se a chave ainda não existir.
        clients.computeIfAbsent(FEIGN_SSL_BEAN, k -> getClientFeign(sslBundles.getBundle(BUNDLE_SSL), okhttp));
        return new ClientDefaultSSLCertificado();
    }

    public static Client getClientFeign(SslBundle bundle, OkHttpClient okHttpClient) {
        OkHttpClient built = okHttpClient.newBuilder()
                .sslSocketFactory(
                        bundle.createSslContext().getSocketFactory(),
                        X509Utils.converter(bundle)
                ).build();
        return new feign.okhttp.OkHttpClient(built);
    }
}
```

> Bean para chamadas HTTP (sem SSL) com OkHttp:
> ```java
> @Configuration
> public class FeignNoSSLConfig {
>     @Bean("feignClient")
>     public Client createClient(okhttp3.OkHttpClient okHttpClient) {
>         return new feign.okhttp.OkHttpClient(okHttpClient);
>     }
> }
> ```

### SSLBundleConfig (hot-reload — OkHttp)

```java
@Component
public class SSLBundleConfig {

    private final ControleAcessoSSLBundle estadoInstance = ControleAcessoSSLBundle.getInstance();
    private final ConcurrentHashMap<String, Client> clients = ClientFeignSSLCertificado.getInstance();

    private final okhttp3.OkHttpClient okhttp;
    private final SslBundles sslBundles;

    public SSLBundleConfig(SslBundles sslBundles, okhttp3.OkHttpClient okhttp) {
        this.sslBundles = sslBundles;
        this.okhttp = okhttp;
    }

    @PostConstruct
    public void init() {
        // Constantes vêm de FeignConfigSSL — não redeclarar (ver variante Client Default).
        sslBundles.addBundleUpdateHandler(FeignConfigSSL.BUNDLE_SSL, bundle -> {
            clients.compute(FeignConfigSSL.FEIGN_SSL_BEAN, (k, v) -> FeignConfigSSL.getClientFeign(bundle, okhttp));
            estadoInstance.setAtualizarCertificado(Boolean.TRUE);
        });
    }
}
```

Interface `@FeignClient` e adapter (Caminho A ou B) seguem o mesmo padrão do Client Default.

---

## FeignClient — Apache HC5

### pom.xml adicional

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-hc5</artifactId>
</dependency>
```

### application.yml adicional

```yaml
spring:
  cloud:
    openfeign:
      httpclient:
        maxConnections: ${OPENFEIGN_HTTPCLIENT_MAX_CONNECTIONS:200}
        maxConnectionsPerRoute: ${OPENFEIGN_HTTPCLIENT_MAX_CONNECTIONS_PER_ROUTE:50}
        timeToLive: ${OPENFEIGN_TIME_TO_LIVE:900}
        connectionTimeout: ${OPENFEIGN_HTTPCLIENT_CONNECTION_TIMEOUT:2000}
        connectionTimerRepeat: ${OPENFEIGN_HTTPCLIENT_CONNECTION_TIMER_REPEAT:3000}
        hc5:
          connectionRequestTimeout: ${HC5_CONNECTION_REQUEST_TIMEOUT_POOL:3}
      client:
        config:
          default:
            connectTimeout: ${OPENFEIGN_HTTPCLIENT_CONNECT_TIMEOUT:6000}
            readTimeout: ${OPENFEIGN_HTTPCLIENT_READ_TIMEOUT:6000}
```

### FeignConfigSSL (Apache HC5)

```java
import br.com.bradesco.lib.autogestao.service.client.feign.ClientDefaultSSLCertificado;
import br.com.bradesco.lib.autogestao.service.singleton.ClientFeignSSLCertificado;
import br.com.bradesco.lib.autogestao.service.client.feign.apache.ApacheHttpBuilderSSL;
import org.springframework.cloud.openfeign.support.FeignHttpClientProperties;
import feign.Client;
import feign.hc5.ApacheHttp5Client;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.springframework.boot.ssl.SslBundle;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class FeignConfigSSL {

    public static final String BUNDLE_SSL = "sslBundle1";
    public static final String FEIGN_SSL_BEAN = "feignBeanConfig";

    private final ConcurrentHashMap<String, Client> clients = ClientFeignSSLCertificado.getInstance();

    @Bean(FEIGN_SSL_BEAN)
    public Client configClient(final SslBundles sslBundles, FeignHttpClientProperties httpClientProperties) {
        // computeIfAbsent, não putIfAbsent: só reconstrói o client se a chave ainda não existir.
        clients.computeIfAbsent(FEIGN_SSL_BEAN, k -> getClientFeign(sslBundles.getBundle(BUNDLE_SSL), httpClientProperties));
        return new ClientDefaultSSLCertificado();
    }

    public static Client getClientFeign(SslBundle bundle, FeignHttpClientProperties httpClientProperties) {
        HttpClientBuilder httpClientBuilder = new ApacheHttpBuilderSSL(bundle, httpClientProperties)
                .construirApacheHttpClient();
        return new ApacheHttp5Client(httpClientBuilder.build());
    }
}
```

### SSLBundleConfig (hot-reload — Apache HC5)

```java
@Component
public class SSLBundleConfig {

    private final ControleAcessoSSLBundle estadoInstance = ControleAcessoSSLBundle.getInstance();
    private final ConcurrentHashMap<String, Client> clients = ClientFeignSSLCertificado.getInstance();

    private final FeignHttpClientProperties httpClientProperties;
    private final SslBundles sslBundles;

    public SSLBundleConfig(SslBundles sslBundles, FeignHttpClientProperties httpClientProperties) {
        this.sslBundles = sslBundles;
        this.httpClientProperties = httpClientProperties;
    }

    @PostConstruct
    public void init() {
        // Constantes vêm de FeignConfigSSL — não redeclarar (ver variante Client Default).
        sslBundles.addBundleUpdateHandler(FeignConfigSSL.BUNDLE_SSL, bundle -> {
            clients.compute(FeignConfigSSL.FEIGN_SSL_BEAN, (k, v) -> FeignConfigSSL.getClientFeign(bundle, httpClientProperties));
            estadoInstance.setAtualizarCertificado(Boolean.TRUE);
        });
    }
}
```

Interface `@FeignClient` e adapter (Caminho A ou B) seguem o mesmo padrão do Client Default.

---

## WebClient (Spring WebFlux)

### WebClientConfig

```java
import org.springframework.boot.autoconfigure.web.reactive.function.client.WebClientSsl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean("webClientWithSSL")
    public WebClient createWebClientWithSSL(WebClientSsl ssl) {
        return WebClient.builder()
                .apply(ssl.fromBundle("sslBundle1"))
                .build();
    }
}
```

### BundleWebClientConfig (hot-reload) — `config/certificado/BundleWebClientConfig.java`

```java
import br.com.bradesco.lib.autogestao.service.singleton.ClientSSLCertificado;
import br.com.bradesco.lib.autogestao.service.singleton.ControleAcessoSSLBundle;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.autoconfigure.web.reactive.function.client.WebClientSsl;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class BundleWebClientConfig {

    private final ControleAcessoSSLBundle estadoInstance = ControleAcessoSSLBundle.getInstance();
    private final ConcurrentHashMap<String, Object> client = ClientSSLCertificado.getInstance();

    private final SslBundles sslBundles;
    private final WebClientSsl ssl;

    public BundleWebClientConfig(SslBundles sslBundles, WebClientSsl ssl) {
        this.sslBundles = sslBundles;
        this.ssl = ssl;
    }

    @PostConstruct
    public void initWebClient() {
        sslBundles.addBundleUpdateHandler("sslBundle1", bundle -> {
            client.compute("webClientWithSSL", (k, v) -> new WebClientConfig().createWebClientWithSSL(ssl));
            estadoInstance.setAtualizarCertificado(Boolean.TRUE);
        });
    }
}
```

### Adapter — 3 opções de recarregamento (usar apenas uma)

**Lib `>= 1.7.0` → preferir a Opção 1 (Caminho A — anotação)**, mais simples (exceção ainda propaga — ver
nota no topo desta página). **Lib `< 1.7.0`, ou a anotação não compila → Opção 2 ou 3 (Caminho B —
manual)**, de acordo com a lógica da pipe reativa.

```java
import br.com.bradesco.lib.autogestao.service.ReactiveRenewalCertificateService;
import br.com.bradesco.lib.autogestao.service.WebClientSSLCertificadoService;
import br.com.bradesco.lib.autogestao.anotation.HandleReactiveInvalidPublicCertificate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
public class ExternalServiceImpl {

    private static final String SERVIDOR_ABC = "servidor-abc"; // casar com application.yml

    private final WebClientSSLCertificadoService client;
    private final ReactiveRenewalCertificateService renewal;

    public ExternalServiceImpl(WebClientSSLCertificadoService client,
                               ReactiveRenewalCertificateService renewal) {
        this.client = client;
        this.renewal = renewal;
    }

    // Opção 1: anotação — adiciona doOnError automaticamente ao final da pipe
    @HandleReactiveInvalidPublicCertificate(template = {SERVIDOR_ABC})
    public Mono<String> callOption1() {
        return client.provedorWebClient("webClientWithSSL")
                .get()
                .uri("https://exemplo.com/recurso")
                .retrieve()
                .bodyToMono(String.class);
    }

    // Opção 2: onErrorResume — preferir quando já existe tratamento de erro na pipe
    public Mono<String> callOption2() {
        return client.provedorWebClient("webClientWithSSL")
                .get()
                .uri("https://exemplo.com/recurso")
                .retrieve()
                .bodyToMono(String.class)
                // WebClientResponseException (4xx/5xx retornado pela própria SRV) = erro de negócio,
                // rethrow imediato, nunca aciona renovação de cert
                .onErrorResume(WebClientResponseException.class, Mono::error)
                // Qualquer outra exceção aqui é técnica/conectividade (ex: WebClientRequestException
                // envolvendo SSLHandshakeException) e deve acionar a renovação
                .onErrorResume(e -> {
                    renewal.renewCertificate(SERVIDOR_ABC, e);
                    return Mono.just("[]");
                });
    }

    // Opção 3: doOnError — mesma distinção da Opção 2 se aplica; filtrar por tipo antes de acionar
    // renewal.renewCertificate, nunca em WebClientResponseException
}
```

> Nas opções 2 e 3, a ordem dos `onErrorResume`/filtro importa: erro de negócio
> (`WebClientResponseException`) precisa ser descartado da renovação antes de qualquer handler genérico.

---

## RestClient (Spring Boot 3.2+ — não oficial)

> ⚠️ O RestClient não é documentado oficialmente pela lib. Funciona para carregar o cert; hot-reload após
> rotação de cert exige restart do pod. Para hot-reload completo, usar RestTemplate ou FeignClient.

### pom.xml adicional

```xml
<dependency>
    <groupId>org.apache.httpcomponents.client5</groupId>
    <artifactId>httpclient5</artifactId>
</dependency>
```

### RestClientConfig

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.http.client.ClientHttpRequestFactoryBuilder;
import org.springframework.boot.http.client.ClientHttpRequestFactorySettings;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import java.time.Duration;

@Configuration(enforceUniqueMethods = false)
public class RestClientConfig {

    private static final Logger log = LoggerFactory.getLogger(RestClientConfig.class);

    @Value("${http.client.connect-timeout:50000}")
    private int connectTimeout;

    @Value("${http.client.read-timeout:50000}")
    private int readTimeout;

    @Bean
    public RestClient restClient(SslBundles sslBundles) {
        ClientHttpRequestFactorySettings settings = ClientHttpRequestFactorySettings.defaults()
                .withSslBundle(sslBundles.getBundle("sslBundle1"))
                .withConnectTimeout(Duration.ofMillis(connectTimeout))
                .withReadTimeout(Duration.ofMillis(readTimeout));

        return RestClient.builder()
                .requestFactory(new BufferingClientHttpRequestFactory(
                        ClientHttpRequestFactoryBuilder.httpComponents().build(settings)))
                .build();
    }
}
```

### SSLBundleConfig (hot-reload parcial)

```java
@Component
public class SSLBundleConfig {

    private final ControleAcessoSSLBundle estadoInstance = ControleAcessoSSLBundle.getInstance();

    @Autowired
    SslBundles sslBundles;

    @PostConstruct
    public void initRest() {
        sslBundles.addBundleUpdateHandler("sslBundle1", bundle -> {
            estadoInstance.setAtualizarCertificado(Boolean.TRUE);
            // RestClient não é recriado aqui — restart do pod necessário para hot-reload completo
        });
    }
}
```

### Adapter (obrigatoriamente manual)

O RestClient não tem suporte à anotação `@HandleInvalidPublicCertificate`. A injeção manual de
`RenovacaoCertificadoPublicoService` no Adapter é **obrigatória** aqui:

```java
import br.com.bradesco.lib.autogestao.service.RenovacaoCertificadoPublicoService;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

@Component
public class ExternalRestClientAdapter {

    private static final String SERVIDOR_ABC = "servidor-abc"; // casar com application.yml

    private final RestClient restClient;
    private final RenovacaoCertificadoPublicoService renovacaoCertificadoService;

    public ExternalRestClientAdapter(RestClient restClient,
                                      RenovacaoCertificadoPublicoService renovacaoCertificadoService) {
        this.restClient = restClient;
        this.renovacaoCertificadoService = renovacaoCertificadoService;
    }

    public String call() {
        try {
            return restClient.get()
                    .uri("https://exemplo.com/recurso")
                    .retrieve()
                    .body(String.class);
        } catch (Exception e) {
            // HttpStatusCodeException (4xx/5xx da SRV) = erro de negócio, não é falha de certificado.
            // Qualquer outra exceção aqui é técnica/conectividade (ex: SSLHandshakeException) e deve
            // acionar a renovação.
            if (!(e instanceof HttpStatusCodeException)) {
                renovacaoCertificadoService.recarregar(e, SERVIDOR_ABC);
            }
            throw e;
        }
    }
}
```

> Se o projeto tiver mais de um Adapter RestClient repetindo esse mesmo `if`/`recarregar`, extrair só
> essa decisão para um método compartilhado — não misturar com mapeamento de erro de negócio para
> exceção de domínio.

---

## Ambientes e paths

| Ambiente | Path do cert | Imagem base |
|---|---|---|
| Dev local (Windows + VPN) | `C:\Users\...\cert-data\` (definir em `CERTIFICADO_CAMINHO` local) | — |
| HOM/PRD (pod ubi8) | `/home/jboss/cert-data/` | `ubi8_custom` |
| HOM/PRD (pod ubi9) | `/home/default/cert-data/` | `ubi9_custom` |

> VPN obrigatória para dev local — a lib precisa de conectividade com o serviço alvo para baixar o cert.
> `application-{profile}.yml` precisa do próprio bloco `ssl-certificados.servidores.*` — ver
> `/skill springboot-certificado`, "Diferença entre ambientes".

---

## Projeto modelo

- **RestTemplate (config + hot-reload), lib `1.1.7`, Caminho B (manual):** válido como modelo de
  `RestTemplateConfig`/`SSLBundleConfig` (que não mudam entre Caminho A e B). **Não copiar** o
  `application-cert.yml` desse tipo de projeto sem checar a versão — em lib `<= 1.1.7` a chave é
  `certificado-projeto.identidade`; em `>= 1.3.1`, `allow-list.seguranca` (ver
  `/skill springboot-certificado`, Passo 4). Se o projeto atual estiver em lib `>= 1.7.0`, usar o
  Caminho A (anotação) nas chamadas HTTPS, não o Caminho B desse modelo.
- **FeignClient + OkHttp, lib `1.7.0`, Caminho A (anotação):** origem da seção "Feign: exigências
  ocultas" acima e da nota sobre `application-{profile}.yml` em
  `/skill springboot-certificado` → "Diferença entre ambientes".

> Ao usar qualquer projeto do banco como referência, **confirmar a versão da lib no pom.xml dele
> primeiro** — grande parte dos erros documentados nesta skill vêm de copiar um padrão de uma versão
> para um projeto em outra versão sem ajustar.
