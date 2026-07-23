---
name: springboot-certificado
description: |
  Configura a lib ensc-lib-autogestao-certificadopub em projetos Spring Boot 3.x
  para resolver erros PKIX path building failed ao chamar serviços HTTPS internos Bradesco.
  Faz download automático do Root CA e registra como Spring SSL Bundle com hot-reload.
  Use quando: a aplicação precisar fazer chamadas HTTPS a serviços Bradesco e receber erro PKIX.
  Para implementações detalhadas por client HTTP: use /skill springboot-certificado-impl
metadata:
  version: "1.1.0"
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
│       └── se o .crt AINDA NÃO existe no caminho configurado:
│           ├── conecta no domínio, lê a cadeia via SSLSocket
│           ├── valida o issuer contra a allow-list de application-cert.yml
│           │   (issuer fora da lista/lista vazia → CertificateIssuerNotValid)
│           └── grava o Root CA no caminho configurado
│       (se o .crt já existe — ex. pré-provisionado via ConfigMap/Secret — pula tudo isso)
│
├── spring.ssl.bundle.pem.sslBundle1 (reload-on-update: true)
│   └── Spring monitora o arquivo .crt (FileWatcher)
│       └── quando aparece/muda → carrega/recarrega o bundle
│
└── RestTemplate / FeignClient / WebClient configurado com sslBundle1
    └── usa o certificado corporativo → SSL funciona ✅
```

## Pré-requisitos

- Spring Boot 3.2+
- `ensc-lib-autogestao-certificadopub` disponível no nexus/kit LEAP
- Acesso à rede Bradesco (VPN em dev local, rede corporativa em HOM/PRD)
- Liberação de firewall/rede para o hostname alvo (responsabilidade da equipe de projeto)
- Se o projeto usa FeignClient: mapear **todos** os `@FeignClient` existentes antes de iniciar
  (`grep -r "@FeignClient" src/main/java`) — a partir de `@EnableAutoGestaoCertificado`, a lib exige
  `configuration` não vazia em **todo** `@FeignClient` de `br.com.bradesco`, mesmo os sem relação com o
  domínio sendo integrado agora. Ver "Feign: exigências ocultas" em `/skill springboot-certificado-impl`.

---

## Passo 0 — Confirmar estas informações ANTES de gerar código

**Não subentenda nenhuma resposta. Pergunte ao usuário:**

1. **Qual é a URL do serviço HTTPS que a aplicação precisa chamar?**
   (A lib se conecta aqui para baixar o Root CA. Pode ser qualquer serviço HTTPS da rede corporativa
   Bradesco ao qual a aplicação precise se conectar.)

   > **Não assuma uma URL.** Cada projeto chama serviços diferentes. A URL não é necessariamente um
   > autorizador — esse é só um caso específico de projetos que usam autorização transacional.

2. **Como nomear o servidor no yaml?**
   Será usado em `ssl-certificados.servidores.[nome-servidor]`.
   Exemplo: `servidor-pagamentos`, `servidor-extrato`, `servidor-cambio`.

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

5. **Qual versão da `ensc-lib-autogestao-certificadopub` o projeto usa (pom.xml)?**

   Define qual mecanismo de recarregamento usar (ver `/skill springboot-certificado-impl`):

   | Client | Versão da lib | Mecanismo |
   |---|---|---|
   | RestTemplate / Feign / WebClient | `>= 1.7.0` | Anotação (`@HandleInvalidPublicCertificate` / `@HandleReactiveInvalidPublicCertificate`) |
   | RestTemplate / Feign / WebClient | `< 1.7.0` | Manual (`RenovacaoCertificadoPublicoService` / `ReactiveRenewalCertificateService`) |
   | RestClient | qualquer versão | Manual — a lib não cobre RestClient em nenhuma versão |

   > Se o projeto estiver em `>= 1.7.0` mas a anotação não compilar/resolver (import não encontrado),
   > tratar como se estivesse em versão antiga e usar o caminho manual.

   > A versão da lib também decide **qual chave usar em `application-cert.yml`** (corte diferente:
   > `1.3.1`, não `1.7.0`) — ver Passo 4. São duas decisões independentes que dependem da mesma versão
   > do pom.xml.

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
allow-list:
  seguranca:
    - CN=Bradesco Corporate Root SHA2
    - CN=Bradesco Corporate Issuing 01 SHA256,DC=corpp,DC=bradesco,DC=com,DC=br
    - CN=GlobalSign RSA OV SSL CA 2018,O=GlobalSign nv-sa,C=BE
    - CN=Bradesco Root CA SHA2
    - CN=Bradesco Issuing 02 CA SHA2,DC=corp,DC=bradesco,DC=com,DC=br
```

> ⚠️ **A chave do yaml depende da versão da lib — confirmado via `javap` em 4 jars** (`1.1.7`, `1.3.1`,
> `1.5.2`, `1.7.0`):
>
> | Versão da lib | Chave yaml correta | Classe (`@ConfigurationProperties`) real |
> |---|---|---|
> | `<= 1.1.7` | `certificado-projeto.identidade` | `IdentidadeCertificadoPublicoProperties` (prefix `certificado-projeto`, campo `identidade`) — é a classe que `DownloadCertificadoPublicoServiceImpl` injeta nessa versão. |
> | `>= 1.3.1` (inclui `1.5.2` e `1.7.0`) | `allow-list.seguranca` | `IdentidadeCertificadoPublicoProperties` foi **removida do jar** a partir da `1.3.1`. `DownloadCertificadoPublicoServiceImpl` passa a injetar `IdentidadeCertificadoSegurancaProperties` (prefix `allow-list`, campo `seguranca`). |
>
> **Não copiar a chave de um projeto de referência sem checar a versão dele primeiro** — foi exatamente
> isso que gerou uma allow-list vazia em um projeto real na `1.7.0` que ainda usava
> `certificado-projeto.identidade` (chave stale, herdada de um projeto em versão antiga). Se a allow-list
> ficar vazia e a lib tentar baixar o certificado ao vivo (isto é, o `.crt` ainda não existe no `caminho`
> configurado), o resultado é `CertificateIssuerNotValid` em toda tentativa. Se o certificado já vem
> pré-provisionado no pod (ex.: montado via ConfigMap/Secret do Helm), essa validação não roda — o que
> pode mascarar uma chave stale por um tempo, mesmo em lib `>= 1.3.1`.
>
> **Recomendação:** confirmar a versão da lib no `pom.xml` (Passo 0, item 5) antes de escrever este
> arquivo e usar a chave correspondente da tabela acima. Em caso de dúvida sobre uma versão não coberta
> nesta tabela, contatar Leandro Augusto Merlo (time Cyber & Certificados) ou inspecionar o jar da versão
> exata via `javap` antes de assumir.

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

Com as informações coletadas no Passo 0 (client escolhido e versão da lib), implemente conforme o client.

Para o código completo de cada variante (RestTemplate, FeignClient Default, OkHttp, Apache HC5, WebClient,
RestClient) com hot-reload, beans de configuração e adapters — incluindo o caminho manual de
recarregamento para lib `< 1.7.0` e a separação obrigatória entre erro de negócio e erro técnico:

> Use `/skill springboot-certificado-impl` e informe o client escolhido e a versão da lib.

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

> Esse teste não precisa de `application-cert.yml`/allow-list configurada: como o `root.crt` já existe no
> `caminho` antes do contexto subir, a lib nunca entra no fluxo de download+validação de issuer — só o
> `FileWatcher`/hot-reload é exercitado.

---

## Diferença entre ambientes

| Ambiente | Path do cert | Imagem base |
|---|---|---|
| Dev local (Windows + VPN) | `C:\Users\...\cert-data\` ou `C:\data\` (definir em `CERTIFICADO_CAMINHO` local) | — |
| HOM/PRD (pod ubi8) | `/home/jboss/cert-data/` | `ubi8_custom` |
| HOM/PRD (pod ubi9) | `/home/default/cert-data/` | `ubi9_custom` |

> VPN é obrigatória para dev local — sem ela o download falha mesmo com toda a configuração correta.

> **`application-{profile}.yml` precisa do próprio bloco `ssl-certificados.servidores.*` — não herda de
> `application.yml`.** Sem isso, um `${VAR}` sem valor-padrão (correto em prod, onde a env var é sempre
> injetada) fica sem resolver quando o perfil sobe sem essa env var, e o texto **literal** `${VAR}` vira o
> "domínio" usado pela lib (sintoma: `Conectando no host: null e port: 443` — ver tabela de erros abaixo),
> derrubando a aplicação. **Correção:** espelhar o bloco com `${VAR:valor-padrão-de-dev}`, mesmo domínio do
> client HTTP, path do SO local (não o path de produção) em `caminho` — e o diretório precisa existir
> previamente, a lib não o cria.

---

## Verificação Pós-Implementação

> ⚠️ **`mvn test` verde não é critério de aceite.** Testes mockados não sobem o `ApplicationContext`
> completo, então não exercitam os `@PostConstruct` da lib. **Critério real: `spring-boot:run` chegar a
> `Started Application`.**

```bash
# 1. Build deve compilar sem erros
mvn clean package -DskipTests

# 2. Subir o contexto Spring completo (VPN ativa) — não só mvn test:
mvn spring-boot:run -Dspring-boot.run.profiles=local
# Esperado: "Started Application", sem BeanCreationException.
# Se falhar sem causa raiz no log (comum com LogCloud/log estruturado): extrair a classe suspeita do jar
# em cache (~/.m2/repository/br/com/bradesco/ensc-lib-autogestao-certificadopub/<versão>/...jar) e rodar
# javap -p -c NomeDaClasse.class para ver qual validação está falhando.

# 3. Verificar que erro PKIX não ocorre mais nos endpoints HTTPS

# 4. Se o .crt está sendo baixado ao vivo (não pré-provisionado no pod), verificar que
#    CertificateIssuerNotValid não ocorre — normalmente sintoma de a chave em application-cert.yml
#    não bater com a versão da lib (ver Passo 4)

# 5. Se o projeto tem outros @FeignClient: confirmar que todos continuam subindo — ver
#    /skill springboot-certificado-impl, "Feign: exigências ocultas"

# 6. Outro perfil de dev (ex. local): confirmar bloco ssl-certificados PRÓPRIO com ${VAR:default} —
#    não herda de application.yml (ver "Diferença entre ambientes" acima)

# 7. Se usou o caminho manual (lib < 1.7.0, ou RestClient): teste unitário obrigatório — simular um
#    erro de negócio (400/404/500) vindo da SRV remota e verificar que a renovação do certificado NÃO
#    é chamada — só deve disparar em falha técnica/conectividade (timeout, DNS, SSLHandshakeException).
```

## Erros conhecidos

| Erro | Causa | Solução |
|---|---|---|
| `PKIX path building failed` | Cert não carregado na truststore | Verificar se lib baixou o cert, se o diretório existe no pod, se `sslBundle1` está no application.yml |
| `overriding is disabled` | Bean definition override desabilitado | Adicionar `spring.main.allow-bean-definition-overriding: true` |
| `CertificateIssuerNotValid` | Issuer não está na allow-list — inclui o caso comum de a chave yaml não bater com a versão da lib (ver Passo 4), o que deixa a lista efetivamente vazia. Só ocorre quando o `.crt` ainda não existe no `caminho` (primeiro download ao vivo). | Confirmar a versão da lib no `pom.xml` e usar a chave correspondente (Passo 4). Se a chave já estiver certa e o issuer real não estiver na lista, contatar Leandro Augusto Merlo (Cyber & Certificados). |
| `NoSuchBeanDefinitionException: SslBundles` | Bundle não inicializado | Verificar `@EnableAutoGestaoCertificado` na classe Application e bloco `spring.ssl.bundle.pem` no application.yml |
| `more than one 'primary' bean found` (LogCloud) | `@ComponentScan("br.com.bradesco")` muito amplo — re-escaneia pacotes do LogCloud | Com `>= 1.7.0`: usar `@EnableAutoGestaoCertificado` (sem `@ComponentScan`). Com `< 1.7.0`: usar `@ComponentScan("br.com.bradesco.lib.autogestao")` em vez de `"br.com.bradesco"` |
| `Cert baixado mas SSL ainda falha` | FileWatcher não detectou o arquivo | Aumentar `quiet-period` ou verificar permissões do diretório |
| Erro de build com `start` / `stop` goals | Plugin spring-boot-maven-plugin tenta iniciar o contexto no build | Remover os goals `start` e `stop` do `spring-boot-maven-plugin` no pom.xml |
| Erro em testes de integração (contexto Spring) | Lib tenta baixar cert real no build | Criar `application-test.yml` em `src/test/resources/` com cert local fake (ver Passo 8) |
| `PropiedadeConfigurationFeignNaoEncontradaException` | `@FeignClient` sem `configuration` (em qualquer lib Bradesco no classpath) | Ver `/skill springboot-certificado-impl`, "Feign: exigências ocultas" |
| `ConfiguracaoSemBeanConfiguradoException` / `ExisteMaisDeUmMetodoAnotadoComBeanException` | Classe em `configuration =` sem `@Bean` nomeado, sem nenhum, ou com mais de um | Ver `/skill springboot-certificado-impl`, "Feign: exigências ocultas" — exatamente um `@Bean("nome")` por classe |
| `factory-bean reference points back to the same bean definition` | `@Bean` nomeado igual à versão decapitalizada da própria classe `@Configuration` | Usar um nome que não colida (ex.: sufixo `RequestInterceptor`) |
| `Conectando no host: null e port: 443` (ou `${VAR}` literal no log) | Placeholder sem valor-padrão não resolvido no perfil ativo | Espelhar `ssl-certificados.servidores.*` com `${VAR:valor-padrão}` — ver "Diferença entre ambientes" |
| `BeanCreationException` sem `Caused by:` no log | Log JSON/LogCloud só expõe o wrapper | Extrair a classe do jar em cache e rodar `javap -p -c` (ver passo 2 da Verificação acima) |

> **ATENÇÃO:** Não usar `@Lazy` para beans da lib — não suporta inicialização lazy.
