---
name: certificado-ssl-local
description: |
  Guia passo a passo para confiar (trust) localmente no certificado SSL de um endpoint
  HTTPS interno ainda não reconhecido pela JVM, evitando erros de handshake TLS
  (ex.: "PKIX path building failed: unable to find valid certification path") ao rodar
  o projeto no IntelliJ via Git Bash. Use quando uma chamada HTTP para um serviço interno
  falhar localmente por certificado não confiável — nunca em produção/homologação.
metadata:
  version: "0.1.0"
---

# Skill: Certificado SSL Local (Git Bash + IntelliJ)

Passo a passo para exportar o certificado de um endpoint HTTPS interno, empacotar num
truststore JKS e apontar o IntelliJ pra ele — resolve erros de handshake TLS quando a
JVM local ainda não conhece o certificado do serviço.

---

## Quando usar

- Uma chamada HTTP síncrona (RestClient/Feign/WebClient) pra um endpoint interno HTTPS
  falha **apenas em ambiente local**, com erro de `PKIX path building failed` ou
  `unable to find valid certification path`.
- O certificado do serviço ainda não está no `cacerts` padrão da JVM usada pelo IntelliJ.

## Quando não usar

- Em produção ou homologação — nesses ambientes o certificado deve estar na cadeia de
  confiança oficial da infraestrutura, não num truststore local versionado no projeto.
- Se o projeto já tem um truststore compartilhado do time — confira antes de gerar um
  novo, pra não duplicar configuração.

---

## ⚠️ Segurança — antes de começar

- **Nunca use uma senha fraca/óbvia** (ex.: `senha123`) no truststore, nem em ambiente
  local — trate como segredo real.
- **NUNCA commite** o `.pem`/`.jks` gerado nem a senha do truststore. Adicione ao
  `.gitignore` do projeto **antes** do passo 3:

```gitignore
# FILEPATH: .gitignore
src/main/resources/cacerts/*.pem
src/main/resources/cacerts/*.jks
```

- No passo 2, confira se o `subject`/`issuer` retornado batem com o serviço esperado
  antes de confiar nele — não aceite um certificado às cegas só porque o comando rodou
  sem erro.

---

## 1) Exportar o certificado do endpoint (PEM)

Substitua `<HOST>` e `<PORTA>` pelo endpoint real (ex.: `meu-servico.apps.exemplo.com.br` e `443`), e `<DIR_DOWNLOAD>` por onde quer salvar o `.pem`:

```bash
openssl s_client -connect <HOST>:<PORTA> -servername <HOST> -showcerts </dev/null \
  | sed -ne '/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/p' \
  > /c/<DIR_DOWNLOAD>/cert.pem
```

## 2) Validar se o PEM foi gerado e confirmar a identidade do certificado

```bash
openssl x509 -in /c/<DIR_DOWNLOAD>/cert.pem -noout -subject -issuer -dates
```

Confira se `subject`/`issuer` correspondem ao serviço esperado antes de seguir.

## 3) Copiar o PEM para o projeto

Substitua `<DIR_PROJETO>` pelo caminho raiz do seu projeto:

```bash
mkdir -p /c/<DIR_PROJETO>/src/main/resources/cacerts
cp /c/<DIR_DOWNLOAD>/cert.pem /c/<DIR_PROJETO>/src/main/resources/cacerts/cert.pem
```

> Confirme que o `.gitignore` do passo de Segurança já está em vigor antes de rodar
> este comando, pra não deixar o certificado exposto no diff.

## 4) Criar o truststore JKS no projeto

Troque `<SUA_SENHA>` por uma senha real (não a do exemplo) e trate-a como segredo:

```bash
keytool -importcert \
  -alias <alias-do-servico> \
  -file /c/<DIR_PROJETO>/src/main/resources/cacerts/cert.pem \
  -keystore /c/<DIR_PROJETO>/src/main/resources/cacerts/trusted-local.jks \
  -storepass <SUA_SENHA> \
  -noprompt
```

## 5) Validar o conteúdo do JKS

```bash
keytool -list \
  -keystore /c/<DIR_PROJETO>/src/main/resources/cacerts/trusted-local.jks \
  -storepass <SUA_SENHA>
```

## 6) Ativar no IntelliJ

Em **Run/Debug Configuration** → **VM options**:

```text
-Djavax.net.ssl.trustStore=C:\<DIR_PROJETO>\src\main\resources\cacerts\trusted-local.jks -Djavax.net.ssl.trustStorePassword=<SUA_SENHA>
```

---

## Checklist

- [ ] `subject`/`issuer` do certificado (passo 2) conferem com o serviço esperado
- [ ] `.gitignore` do projeto ignora `src/main/resources/cacerts/*.pem` e `*.jks`
- [ ] Senha do truststore não é um valor fraco/óbvio e não foi commitada em nenhum arquivo
- [ ] VM options do IntelliJ configuradas e a chamada HTTP local funciona sem erro de PKIX
- [ ] Truststore local usado **apenas** em desenvolvimento — não referenciado em config de produção/homologação
