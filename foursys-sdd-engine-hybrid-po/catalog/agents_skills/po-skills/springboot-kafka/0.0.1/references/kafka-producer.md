# Kafka Producer - Arquitetura Hexagonal

Este documento demonstra como implementar um **Kafka Producer** seguindo arquitetura hexagonal, com envio de eventos para tópicos Kafka usando Confluent Cloud.

## 1. Estrutura do Projeto

```
br.com.bradesco.contacorrente/
├── core/
│   ├── domain/model/
│   │   └── Account.java
│   └── usecase/
│       └── CreateAccountUseCase.java
├── port/
│   ├── input/
│   │   └── CreateAccountInputPort.java
│   └── output/
│       └── AccountCreatedEventPort.java
└── adapter/
    ├── input/
    │   └── controller/
    │       ├── AccountController.java
    │       ├── dto/
    │       │   ├── request/
    │       │   │   └── CreateAccountRequest.java
    │       │   └── response/
    │       │       └── AccountResponse.java
    │       └── mapper/
    │           └── AccountControllerMapper.java
    └── output/
        ├── kafka/
        │   └── producer/
        │       ├── AccountCreatedEventProducer.java
        │       ├── dto/
        │       │   └── AccountCreatedMessage.java
        │       └── mapper/
        │           └── AccountEventMapper.java
        └── config/
            └── KafkaConfig.java
```

## 2. Domain Model

```java
package br.com.bradesco.contacorrente.core.domain.model;

/**
 * Entidade de domínio - SEM anotações externas
 */
public class Account {
    private String id;
    private String name;
    private String accountNumber;
    private String cpf;
    
    public Account(String id, String name, String accountNumber, String cpf) {
        this.id = id;
        this.name = name;
        this.accountNumber = accountNumber;
        this.cpf = cpf;
    }
    
    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getAccountNumber() { return accountNumber; }
    public String getCpf() { return cpf; }
}
```

## 3. Ports

### Input Port

```java
package br.com.bradesco.contacorrente.port.input;

import br.com.bradesco.contacorrente.core.domain.model.Account;

/**
 * Contrato de entrada - define o que o UseCase faz
 */
public interface CreateAccountInputPort {
    
    /**
     * Cria uma nova conta corrente
     * @param name Nome do titular
     * @param cpf CPF do titular
     * @return Account criada
     */
    Account execute(String name, String cpf);
}
```

### Output Port (Event)

```java
package br.com.bradesco.contacorrente.port.output;

import br.com.bradesco.contacorrente.core.domain.model.Account;

/**
 * Contrato de saída - define como publicar eventos
 * Interface em linguagem de domínio (não menciona Kafka)
 */
public interface AccountCreatedEventPort {
    
    /**
     * Publica evento de conta criada
     * @param account Conta criada
     */
    void publishAccountCreated(Account account);
}
```

## 4. UseCase

```java
package br.com.bradesco.contacorrente.core.usecase;

import br.com.bradesco.contacorrente.core.domain.model.Account;
import br.com.bradesco.contacorrente.port.input.CreateAccountInputPort;
import br.com.bradesco.contacorrente.port.output.AccountCreatedEventPort;

import java.util.UUID;

/**
 * UseCase - implementa regra de negócio
 * NÃO conhece detalhes de infraestrutura (Kafka)
 */
public class CreateAccountUseCase implements CreateAccountInputPort {
    
    private final AccountCreatedEventPort accountCreatedEventPort;
    
    public CreateAccountUseCase(AccountCreatedEventPort accountCreatedEventPort) {
        this.accountCreatedEventPort = accountCreatedEventPort;
    }
    
    @Override
    public Account execute(String name, String cpf) {
        // 1. Validações de negócio
        validateName(name);
        validateCpf(cpf);
        
        // 2. Gerar número da conta
        String accountNumber = generateAccountNumber();
        
        // 3. Criar entidade de domínio
        Account account = new Account(
            UUID.randomUUID().toString(),
            name,
            accountNumber,
            cpf
        );
        
        // 4. Publicar evento (via OutputPort)
        accountCreatedEventPort.publishAccountCreated(account);
        
        return account;
    }
    
    private void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Nome não pode ser vazio");
        }
    }
    
    private void validateCpf(String cpf) {
        if (cpf == null || cpf.length() != 11) {
            throw new IllegalArgumentException("CPF inválido");
        }
    }
    
    private String generateAccountNumber() {
        // Lógica de geração de número de conta
        return String.format("%08d", (int) (Math.random() * 100000000));
    }
}
```

## 5. Adapter Layer

### Event DTO (Mensagem Kafka)

```java
package br.com.bradesco.contacorrente.adapter.output.kafka.producer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO que representa a mensagem enviada ao Kafka
 * Record class (Java 14+) - imutável por padrão
 */
public record AccountCreatedMessage(
    
    @JsonProperty("id")
    String id,
    
    @JsonProperty("name")
    String name,
    
    @JsonProperty("account_number")
    String accountNumber,
    
    @JsonProperty("cpf")
    String cpf,
    
    @JsonProperty("created_at")
    String createdAt
) {
}
```

### Event Mapper

```java
package br.com.bradesco.contacorrente.adapter.output.kafka.producer.mapper;

import br.com.bradesco.contacorrente.adapter.output.kafka.producer.dto.AccountCreatedMessage;
import br.com.bradesco.contacorrente.core.domain.model.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.time.Instant;

/**
 * Mapper que traduz entidade de domínio para mensagem Kafka
 * Protege o domínio de mudanças no formato da mensagem
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AccountEventMapper {
    
    /**
     * Converte Account para mensagem Kafka
     * Adiciona timestamp de criação
     */
    @Mapping(target = "createdAt", expression = "java(getCurrentTimestamp())")
    AccountCreatedMessage toMessage(Account account);
    
    /**
     * Retorna timestamp atual em formato ISO-8601
     */
    default String getCurrentTimestamp() {
        return Instant.now().toString();
    }
}
```

### Kafka Configuration

```java
package br.com.bradesco.contacorrente.adapter.output.config;

import br.com.bradesco.contacorrente.adapter.output.kafka.producer.dto.AccountCreatedMessage;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;

/**
 * Configuração do Kafka Producer
 */
@Configuration
public class KafkaConfig {
    
    /**
     * KafkaTemplate para enviar mensagens AccountCreatedMessage
     * Genéricos: <Chave, Valor>
     * - Chave: String (ID da conta)
     * - Valor: AccountCreatedMessage (evento)
     */
    @Bean
    public KafkaTemplate<String, AccountCreatedMessage> accountCreatedKafkaTemplate(
            KafkaProperties kafkaProperties,
            SslBundles sslBundles) {
        
        var producerProperties = kafkaProperties.buildProducerProperties(sslBundles);
        var producerFactory = new DefaultKafkaProducerFactory<String, AccountCreatedMessage>(producerProperties);
        
        return new KafkaTemplate<>(producerFactory);
    }
}
```

### Kafka Producer (Implementação do OutputPort)

```java
package br.com.bradesco.contacorrente.adapter.output.kafka.producer;

import br.com.bradesco.contacorrente.adapter.output.kafka.producer.dto.AccountCreatedMessage;
import br.com.bradesco.contacorrente.adapter.output.kafka.producer.mapper.AccountEventMapper;
import br.com.bradesco.contacorrente.core.domain.model.Account;
import br.com.bradesco.contacorrente.port.output.AccountCreatedEventPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

/**
 * Producer Kafka que implementa o OutputPort
 * Envia eventos de conta criada para tópico Kafka
 */
@Component
public class AccountCreatedEventProducer implements AccountCreatedEventPort {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(AccountCreatedEventProducer.class);
    
    private final KafkaTemplate<String, AccountCreatedMessage> kafkaTemplate;
    private final AccountEventMapper mapper;
    
    @Value("${spring.kafka.topics.account-created.name}")
    private String topicName;
    
    public AccountCreatedEventProducer(
            KafkaTemplate<String, AccountCreatedMessage> kafkaTemplate,
            AccountEventMapper mapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.mapper = mapper;
    }
    
    @Override
    public void publishAccountCreated(Account account) {
        // 1. Converter domínio para mensagem Kafka
        AccountCreatedMessage message = mapper.toMessage(account);
        
        // 2. Construir mensagem com headers
        final Message<AccountCreatedMessage> kafkaMessage = MessageBuilder
                .withPayload(message)
                .setHeader(KafkaHeaders.TOPIC, topicName)
                .build();
        
        LOGGER.info("Sending account created event - accountId: {} - topic: {}", 
                    account.getId(), topicName);
        
        // 3. Enviar mensagem (assíncrono)
        CompletableFuture<SendResult<String, AccountCreatedMessage>> result = 
                kafkaTemplate.send(kafkaMessage);
        
        // 4. Callback de sucesso/erro
        result.whenComplete((success, ex) -> {
            if (ex != null) {
                LOGGER.error("Error sending account created event - accountId: {} - error: {}", 
                            account.getId(), ex.getMessage(), ex);
                // Pode lançar exceção customizada ou implementar retry manual
            } else {
                LOGGER.info("Account created event sent successfully - accountId: {} - partition: {} - offset: {}", 
                            account.getId(), 
                            success.getRecordMetadata().partition(),
                            success.getRecordMetadata().offset());
            }
        });
    }
}
```

## 6. Configuration

### UseCase Config

```java
package br.com.bradesco.contacorrente.config;

import br.com.bradesco.contacorrente.core.usecase.CreateAccountUseCase;
import br.com.bradesco.contacorrente.port.input.CreateAccountInputPort;
import br.com.bradesco.contacorrente.port.output.AccountCreatedEventPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração de casos de uso
 * Injeta dependências (OutputPorts)
 */
@Configuration
public class UseCaseConfig {
    
    @Bean
    public CreateAccountInputPort createAccountInputPort(
            AccountCreatedEventPort accountCreatedEventPort) {
        return new CreateAccountUseCase(accountCreatedEventPort);
    }
}
```

## 7. Application Properties

### application.yml (Produção / HML)

```yaml
spring:
  kafka:
    bootstrap-servers: '${MY_KAFKA_BOOTSTRAP_SERVERS}'
    security:
      protocol: SASL_SSL
    properties:
      sasl:
        mechanism: PLAIN
        jaas:
          config: 'org.apache.kafka.common.security.plain.PlainLoginModule required username="${MY_KAFKA_USERNAME}" password="${MY_KAFKA_PASSWORD}";'
    producer:
      key-serializer: 'org.apache.kafka.common.serialization.StringSerializer'
      value-serializer: 'org.springframework.kafka.support.serializer.JsonSerializer'
      acks: all  # Garantia de durabilidade
      retries: 3
      properties:
        max.in.flight.requests.per.connection: 5
        enable.idempotence: true  # Evita duplicação de mensagens
    topics:
      account-created:
        name: 'tp-event-account-created'

info:
  app:
    name: 'conta-corrente-service'
```

### application-default.yml (Desenvolvimento Local)

```yaml
spring:
  kafka:
    bootstrap-servers: 'localhost:9092'
    security:
      protocol: PLAINTEXT
    producer:
      key-serializer: 'org.apache.kafka.common.serialization.StringSerializer'
      value-serializer: 'org.springframework.kafka.support.serializer.JsonSerializer'
    topics:
      account-created:
        name: 'tp-event-account-created'
```

## 8. Controller (Input Adapter)

```java
package br.com.bradesco.contacorrente.adapter.input.controller;

import br.com.bradesco.contacorrente.adapter.input.controller.dto.request.CreateAccountRequest;
import br.com.bradesco.contacorrente.adapter.input.controller.dto.response.AccountResponse;
import br.com.bradesco.contacorrente.core.domain.model.Account;
import br.com.bradesco.contacorrente.port.input.CreateAccountInputPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller REST que aciona o caso de uso
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {
    
    private final CreateAccountInputPort createAccountInputPort;
    private final AccountControllerMapper mapper;
    
    public AccountController(
            CreateAccountInputPort createAccountInputPort,
            AccountControllerMapper mapper) {
        this.createAccountInputPort = createAccountInputPort;
        this.mapper = mapper;
    }
    
    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@RequestBody CreateAccountRequest request) {
        log.info("Creating account - name: {} - cpf: {}", request.name(), request.cpf());
        
        Account account = createAccountInputPort.execute(request.name(), request.cpf());
        AccountResponse response = mapper.toResponse(account);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

### Request DTO

```java
package br.com.bradesco.contacorrente.adapter.input.controller.dto.request;

/**
 * DTO de requisição para criar conta
 */
public record CreateAccountRequest(
    String name,
    String cpf
) {
}
```

### Response DTO

```java
package br.com.bradesco.contacorrente.adapter.input.controller.dto.response;

/**
 * DTO de resposta com dados da conta criada
 */
public record AccountResponse(
    String id,
    String name,
    String accountNumber
) {
}
```

## Boas Práticas

1. ✅ **Use chaves (key) nas mensagens** para garantir ordenação e particionamento correto
2. ✅ **Configure `acks=all`** para garantir durabilidade
3. ✅ **Habilite idempotência** (`enable.idempotence=true`) para evitar duplicação
4. ✅ **Use MapStruct** para mapear domínio → evento
5. ✅ **Adicione timestamps** nas mensagens para auditoria
6. ✅ **Implemente logging** detalhado de sucesso/erro
7. ✅ **Trate erros** com callbacks e retry se necessário
8. ✅ **Isole o domínio** - UseCase não conhece Kafka

## Recursos Adicionais

- [Spring Kafka Documentation](https://docs.spring.io/spring-kafka/reference/html/)
- [Confluent Cloud Best Practices](https://docs.confluent.io/cloud/current/best-practices.html)
- [Kafka Producer Configuration](https://kafka.apache.org/documentation/#producerconfigs)
