---
name: springboot-certificado
description: |
  Configura a lib ensc-lib-autogestao-certificadopub em projetos Spring Boot 3.x
  para resolver erros PKIX path building failed ao chamar serviços HTTPS internos Bradesco.
  Faz download automático do Root CA e registra como Spring SSL Bundle com hot-reload.
  Use quando: a aplicação precisar fazer chamadas HTTPS a serviços Bradesco e receber erro PKIX.
  Para implementações detalhadas por client HTTP: use /skill springboot-certificado-impl
metadata:
  version: "1.0.0"
---

# Skill: Certificado SSL Corporativo Bradesco

## Contexto do Problema

```
PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException:
unable to find valid certification path to requested target
```

**Causa:** A JVM não encontra o Root CA Bradesco (`BradescoCorporateRootSHA2`) na truststore padrão.
**Solução:** A lib `ensc-lib-autogestao-certificadopub` faz o download automático do certificado e o registra como Spring SSL Bundle com hot-reload.

## Como a lib funciona

```
Pod Kubernetes sobe
│
├── @EnableAutoGestaoCertificado na classe Application
│   └── lib detecta domínio em ssl-certificados.servidores.*
│       └── faz download do Root CA → caminho configurado
│
├── spring.ssl.bundle.pem.sslBundle1 (reload-on-update: true)
│   └── Spring monitora o arquivo .crt (FileWatcher)
│       └── quando aparece/muda → carrega/recarrega o bundle
│
└── RestTemplate / FeignClient / WebClient configurado com sslBundle1
    └── usa o certificado corporativo → SSL funciona ✅
```

---

## Passo 0 — Confirmar estas informações ANTES de gerar código

**Não subentenda nenhuma resposta. Pergunte ao usuário:**

1. **Qual é a URL do serviço HTTPS que a aplicação precisa chamar?**
   (A lib se conecta aqui para baixar o Root CA. Pode ser qualquer serviço HTTPS Bradesco.)

2. **Como nomear o servidor no yaml?**
   Será usado em `ssl-certificados.servidores.[nome-servidor]`.
   Exemplo: `servidor-pagamentos`, `servidor-extrato`.

3. **Qual client HTTP o projeto utiliza?**

   | Opção | Quando escolher |
   |---|---|
   | FeignClient — Client Default | OpenFeign com client padrão (javax.net.ssl) |
   | FeignClient — OkHttp | OpenFeign + feign-okhttp |
   | FeignClient — Apache HC5 | OpenFeign + feign-hc5 |
   | RestTemplate | Spring Web RestTemplate |
   | WebClient | Spring WebFlux |
   | RestClient | Spring Boot 3.2+ — ⚠️ hot-reload limitado |

4. **Qual é a imagem base Docker do projeto?**

   | Imagem | Path do cert-data |
   |---|---|
   | `ubi8_custom` | `/home/jboss/cert-data/` |
   | `ubi9_custom` | `/home/default/cert-data/` |

   > Se não souber, verificar o `FROM` no Dockerfile do projeto.

---

## Passo 1 — pom.xml

### Dependência base (obrigatória para todos os clients)

```xml
<dependency>
    <groupId>br.com.bradesco</groupId>
    <artifactId>ensc-lib-autogestao-certificadopub</artifactId>
    <version>1.7.0</version>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-crypto</artifactId>
        </exclusion>
        <exclusion>
            <groupId>org.bouncycastle</groupId>
            <artifactId>bcprov-jdk18on</artifactId>
        </exclusion>
        <exclusion>
            <groupId>org.bouncycastle</groupId>
            <artifactId>bcpkix-jdk18on</artifactId>
        </exclusion>
        <exclusion>
            <groupId>org.bouncycastle</groupId>
            <artifactId>bcutil-jdk18on</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

### Dependências adicionais por client

```xml
<!-- FeignClient (qualquer variante): -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>

<!-- FeignClient + OkHttp (além do openfeign): -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-okhttp</artifactId>
</dependency>

<!-- FeignClient + Apache HC5 (além do openfeign): -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-hc5</artifactId>
</dependency>

<!-- RestClient: -->
<dependency>
    <groupId>org.apache.httpcomponents.client5</groupId>
    <artifactId>httpclient5</artifactId>
</dependency>

<!-- RestTemplate e WebClient: sem dependência adicional -->
```

---

## Passo 2 — Dockerfile (stage runtime)

```dockerfile
# Adicionar antes do ENTRYPOINT, após os COPYs

# Imagem base ubi8 (home = /home/jboss):
RUN mkdir -p /home/jboss/cert-data
RUN chmod 777 /home/jboss/cert-data

# Imagem base ubi9 (home = /home/default):
# RUN mkdir -p /home/default/cert-data
# RUN chmod 777 /home/default/cert-data

ENTRYPOINT ...
```

> O path criado aqui deve ser igual ao `CERTIFICADO_CAMINHO` no values.yaml.

---

## Passo 3 — application.yml

### 3a. Adicionar `gestor` e `tech-lead` em `info.app` (obrigatório para governança)

```yaml
info:
  app:
    name: '@project.name@'
    gestor: "NOME-DO-GESTOR"
    tech-lead: "NOME-DO-TL"
```

### 3b. Atualizar `spring.config.import` para lista

```yaml
spring:
  config:
    import:
      - "optional:configtree:/mnt/secrets-store/"
      - "optional:classpath:/application-cert.yml"
      - "optional:classpath:/application-cyber.yml"
```

### 3c. Bloco `spring.ssl.bundle`

```yaml
spring:
  ssl:
    bundle:
      watch:
        file:
          quiet-period: 500
      pem:
        sslBundle1:
          reload-on-update: true
          truststore:
            certificate: ${ssl-certificados.servidores.[nome-servidor].caminho}${ssl-certificados.servidores.[nome-servidor].nome}
```

### 3d. Seção `ssl-certificados`

```yaml
ssl-certificados:
  servidores:
    [nome-servidor]:
      dominio: "https://URL-DO-SERVICO-HTTPS"
      caminho: ${CERTIFICADO_CAMINHO:/home/jboss/cert-data/}
      nome: "NomeDoCertificado.crt"
      porta: 443
```

### 3e. Remover esta linha se existir

```yaml
# REMOVER:
http:
  client:
    disable-ssl-validation: ${HTTP_CLIENT_DISABLE_SSL_VALIDATION:false}
```

---

## Passo 4 — application-cert.yml (NOVO)

Criar em `src/main/resources/application-cert.yml`:

```yaml
certificado-projeto:
  identidade:
    - CN=Bradesco Corporate Root SHA2
    - CN=Bradesco Corporate Issuing 01 SHA256,DC=corpp,DC=bradesco,DC=com,DC=br
    - CN=GlobalSign RSA OV SSL CA 2018,O=GlobalSign nv-sa,C=BE
    - CN=Bradesco Root CA SHA2
    - CN=Bradesco Issuing 02 CA SHA2,DC=corp,DC=bradesco,DC=com,DC=br
```

---

## Passo 5 — Classe Application

A abordagem depende da versão da lib. **Confirmar no pom.xml antes de prosseguir.**

**Versão >= 1.7.0:**

```java
import br.com.bradesco.lib.autogestao.EnableAutoGestaoCertificado;

@SpringBootApplication
@EnableLogCloud
@EnableFeignClients   // apenas se usar OpenFeign
@EnableAutoGestaoCertificado
public class Application implements CommandLineRunner { ... }
```

**Versão < 1.7.0 (ex: 1.1.7):** adicionar `@ComponentScan` na classe de config do client HTTP (Passo 6), **não** na Application.

```java
@Configuration(enforceUniqueMethods = false)
@ComponentScan(basePackages = "br.com.bradesco.lib.autogestao")
public class RestClientConfig { ... }
```

> `@EnableAutoGestaoCertificado` não existe em versões < 1.7.0 — causará erro de compilação.

---

## Passo 6 — Configuração do Client HTTP

Com as informações coletadas no Passo 0, implemente conforme o client escolhido.

Para o código completo de cada variante (RestTemplate, FeignClient Default, OkHttp, Apache HC5, WebClient, RestClient) com hot-reload, beans de configuração e adapters:

> Use `/skill springboot-certificado-impl` e informe o client escolhido.

---

## Passo 7 — values.yaml (config repo)

```yaml
configmap:
  CERTIFICADO_CAMINHO: "/home/jboss/cert-data/"   # ubi8; usar /home/default/cert-data/ para ubi9

  # Remover se existir:
  # HTTP_CLIENT_DISABLE_SSL_VALIDATION: "false"
```

---

## Passo 8 — Teste de integração (opcional)

Criar `src/test/resources/application-test.yml`:

```yaml
ssl-certificados:
  servidores:
    [nome-servidor]:
      dominio: "http://localhost"
      caminho: "src/test/resources/certs/"
      nome: "root.crt"
      porta: 443
```

Criar `src/test/resources/certs/root.crt` com qualquer certificado PEM válido.
Ativar nos testes: `@ActiveProfiles("test")`.

---

## Verificação Pós-Implementação

```bash
# Build deve compilar sem erros
mvn clean package -DskipTests

# Startup local (VPN ativa) — logs esperados:
# "Bundle SSL atualizado: sslBundle1"

# Verificar que erro PKIX não ocorre mais nos endpoints HTTPS
```

## Erros comuns

| Erro | Causa | Solução |
|---|---|---|
| `PKIX path building failed` | Cert não carregado | Verificar se lib baixou o cert, se diretório existe no pod |
| `overriding is disabled` | Bean definition override desabilitado | Adicionar `spring.main.allow-bean-definition-overriding: true` |
| `CertificateIssuerNotValid` | Issuer não listado na lib | Contatar Leandro Augusto Merlo (Cyber & Certificados) |
| `NoSuchBeanDefinitionException: SslBundles` | Bundle não inicializado | Verificar `@EnableAutoGestaoCertificado` e bloco `spring.ssl.bundle.pem` |
| `more than one 'primary' bean found` | `@ComponentScan` muito amplo | Com >= 1.7.0: usar `@EnableAutoGestaoCertificado`. Com < 1.7.0: usar `@ComponentScan("br.com.bradesco.lib.autogestao")` |
| `Cert baixado mas SSL ainda falha` | FileWatcher não detectou | Aumentar `quiet-period` ou verificar permissões do diretório |

> **ATENÇÃO:** Não usar `@Lazy` para beans da lib — não suporta inicialização lazy.
