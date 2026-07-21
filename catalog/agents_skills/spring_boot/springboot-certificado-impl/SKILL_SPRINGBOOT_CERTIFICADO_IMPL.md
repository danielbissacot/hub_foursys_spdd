---
name: springboot-certificado-impl
description: |
  Implementações completas do client HTTP com ensc-lib-autogestao-certificadopub:
  RestTemplate, FeignClient Default, FeignClient OkHttp, FeignClient Apache HC5,
  WebClient e RestClient. Inclui classe de configuração, hot-reload (BundleConfig)
  e adapter com @HandleInvalidPublicCertificate para cada variante.
  Use quando: já respondeu as perguntas do /skill springboot-certificado e precisa
  do código completo para o client HTTP escolhido.
metadata:
  version: "1.0.0"
---

# Skill: Certificado SSL — Implementações por Client HTTP

Informe qual client HTTP o projeto usa e gere o código completo para aquele client.

Cada implementação requer **3 artefatos**:
1. **Classe de configuração** — cria o bean com SSL bundle
2. **Classe de hot-reload** em `config/certificado/` — registra handler de renovação
3. **Adapter/service** com `@HandleInvalidPublicCertificate` — recarregamento automático

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

### Adapter com hot-reload

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

    private final ConcurrentHashMap<String, Client> clients = ClientFeignSSLCertificado.getInstance();

    @Bean("feignBeanConfig")
    public Client configClient(final SslBundles sslBundles) {
        clients.putIfAbsent("feignBeanConfig", getClientFeign(sslBundles.getBundle("sslBundle1")));
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
    private final ConcurrentHashMap<String, Client> client = ClientFeignSSLCertificado.getInstance();
    private static final String BUNDLE_SSL = "sslBundle1";
    private static final String FEIGN_SSL_BEAN = "feignBeanConfig";

    private final SslBundles sslBundles;

    public SSLBundleConfig(SslBundles sslBundles) {
        this.sslBundles = sslBundles;
    }

    @PostConstruct
    public void init() {
        sslBundles.addBundleUpdateHandler(BUNDLE_SSL, bundle -> {
            client.compute(FEIGN_SSL_BEAN, (k, v) -> FeignConfigSSL.getClientFeign(bundle));
            estadoInstance.setAtualizarCertificado(Boolean.TRUE);
        });
    }
}
```

### Interface FeignClient e Adapter

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

@Service
public class ExternalServiceImpl {

    private static final String SERVIDOR_ABC = "servidor-abc";
    private final ClientXYZ client;

    @HandleInvalidPublicCertificate(template = {SERVIDOR_ABC})
    public void callService() {
        client.execute();
    }
}
```

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

    private final ConcurrentHashMap<String, Client> clients = ClientFeignSSLCertificado.getInstance();

    @Bean("feignBeanConfig")
    public Client configClient(final SslBundles sslBundles, OkHttpClient okhttp) {
        clients.putIfAbsent("feignBeanConfig", getClientFeign(sslBundles.getBundle("sslBundle1"), okhttp));
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

### SSLBundleConfig (hot-reload — OkHttp)

```java
@Component
public class SSLBundleConfig {

    private final ControleAcessoSSLBundle estadoInstance = ControleAcessoSSLBundle.getInstance();
    private final ConcurrentHashMap<String, Client> client = ClientFeignSSLCertificado.getInstance();
    private static final String BUNDLE_SSL = "sslBundle1";
    private static final String FEIGN_SSL_BEAN = "feignBeanConfig";

    private final okhttp3.OkHttpClient okhttp;
    private final SslBundles sslBundles;

    public SSLBundleConfig(SslBundles sslBundles, okhttp3.OkHttpClient okhttp) {
        this.sslBundles = sslBundles;
        this.okhttp = okhttp;
    }

    @PostConstruct
    public void init() {
        sslBundles.addBundleUpdateHandler(BUNDLE_SSL, bundle -> {
            client.compute(FEIGN_SSL_BEAN, (k, v) -> FeignConfigSSL.getClientFeign(bundle, okhttp));
            estadoInstance.setAtualizarCertificado(Boolean.TRUE);
        });
    }
}
```

Interface `@FeignClient` e adapter com `@HandleInvalidPublicCertificate` seguem o mesmo padrão do Client Default.

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

    private final ConcurrentHashMap<String, Client> clients = ClientFeignSSLCertificado.getInstance();

    @Bean("feignBeanConfig")
    public Client configClient(final SslBundles sslBundles, FeignHttpClientProperties httpClientProperties) {
        clients.putIfAbsent("feignBeanConfig", getClientFeign(sslBundles.getBundle("sslBundle1"), httpClientProperties));
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
    private final ConcurrentHashMap<String, Client> client = ClientFeignSSLCertificado.getInstance();
    private static final String BUNDLE_SSL = "sslBundle1";
    private static final String FEIGN_SSL_BEAN = "feignBeanConfig";

    private final FeignHttpClientProperties httpClientProperties;
    private final SslBundles sslBundles;

    public SSLBundleConfig(SslBundles sslBundles, FeignHttpClientProperties httpClientProperties) {
        this.sslBundles = sslBundles;
        this.httpClientProperties = httpClientProperties;
    }

    @PostConstruct
    public void init() {
        sslBundles.addBundleUpdateHandler(BUNDLE_SSL, bundle -> {
            client.compute(FEIGN_SSL_BEAN, (k, v) -> FeignConfigSSL.getClientFeign(bundle, httpClientProperties));
            estadoInstance.setAtualizarCertificado(Boolean.TRUE);
        });
    }
}
```

Interface `@FeignClient` e adapter com `@HandleInvalidPublicCertificate` seguem o mesmo padrão do Client Default.

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

### Adapter (3 opções de hot-reload — usar apenas uma)

```java
import br.com.bradesco.lib.autogestao.service.ReactiveRenewalCertificateService;
import br.com.bradesco.lib.autogestao.service.WebClientSSLCertificadoService;
import br.com.bradesco.lib.autogestao.anotation.HandleReactiveInvalidPublicCertificate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class ExternalServiceImpl {

    private static final String SERVIDOR_ABC = "servidor-abc";

    private final WebClientSSLCertificadoService client;
    private final ReactiveRenewalCertificateService renewal;

    // Opção 1: anotação (mais simples)
    @HandleReactiveInvalidPublicCertificate(template = {SERVIDOR_ABC})
    public Mono<String> callOption1() {
        return client.provedorWebClient("webClientWithSSL")
                .get().uri("https://exemplo.com/recurso")
                .retrieve().bodyToMono(String.class);
    }

    // Opção 2: onErrorResume (preferir quando já há tratamento de erro na pipe)
    public Mono<String> callOption2() {
        return client.provedorWebClient("webClientWithSSL")
                .get().uri("https://exemplo.com/recurso")
                .retrieve().bodyToMono(String.class)
                .onErrorResume(e -> {
                    renewal.renewCertificate(SERVIDOR_ABC, e);
                    return Mono.just("[]");
                });
    }
}
```

---

## RestClient (Spring Boot 3.2+ — não oficial)

> ⚠️ Hot-reload após rotação de cert exige restart do pod. Para hot-reload completo, usar RestTemplate ou FeignClient.

### RestClientConfig

```java
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
            // RestClient não é recriado — restart do pod necessário para hot-reload completo
        });
    }
}
```

---

## Ambientes e paths

| Ambiente | Path do cert | Imagem base |
|---|---|---|
| Dev local (Windows + VPN) | `C:\Users\...\cert-data\` (definir em `CERTIFICADO_CAMINHO` local) | — |
| HOM/PRD (pod ubi8) | `/home/jboss/cert-data/` | `ubi8_custom` |
| HOM/PRD (pod ubi9) | `/home/default/cert-data/` | `ubi9_custom` |

> VPN obrigatória para dev local — a lib precisa de conectividade com o serviço alvo para baixar o cert.
