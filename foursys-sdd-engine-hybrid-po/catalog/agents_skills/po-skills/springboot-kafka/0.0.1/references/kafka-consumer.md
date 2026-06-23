# Kafka Consumer - Arquitetura Hexagonal

Este documento demonstra como implementar um **Kafka Consumer** seguindo arquitetura hexagonal, com consumo de eventos de tópicos Kafka usando Confluent Cloud.

## 1. Estrutura do Projeto

```
br.com.bradesco.validation/
├── core/
│   ├── domain/model/
│   │   └── AccountValidation.java
│   └── usecase/
│       └── ValidateAccountUseCase.java
├── port/
│   ├── input/
│   │   └── ValidateAccountInputPort.java
│   └── output/
│       └── ValidationResultEventPort.java
└── adapter/
    ├── input/
    │   └── kafka/
    │       └── consumer/
    │           ├── AccountCheckResultConsumer.java
    │           ├── dto/
    │           │   └── AccountCheckMessage.java
    │           └── mapper/
    │               └── AccountCheckMapper.java
    └── output/
        └── config/
            └── KafkaConfig.java
```

## 2. Domain Model

```java
package br.com.bradesco.validation.core.domain.model;

/**
 * Entidade de domínio - SEM anotações externas
 */
public class AccountValidation {
    private String accountId;
    private String accountNumber;
    private boolean isValid;
    private String validationStatus;
    private String reason;
    
    public AccountValidation(String accountId, String accountNumber, 
                           boolean isValid, String validationStatus, String reason) {
        this.accountId = accountId;
        this.accountNumber = accountNumber;
        this.isValid = isValid;
        this.validationStatus = validationStatus;
        this.reason = reason;
    }
    
    // Getters
    public String getAccountId() { return accountId; }
    public String getAccountNumber() { return accountNumber; }
    public boolean isValid() { return isValid; }
    public String getValidationStatus() { return validationStatus; }
    public String getReason() { return reason; }
}
```

## 3. Ports

### Input Port

```java
package br.com.bradesco.validation.port.input;

import br.com.bradesco.validation.core.domain.model.AccountValidation;

/**
 * Contrato de entrada - define o caso de uso de validação
 */
public interface ValidateAccountInputPort {
    
    /**
     * Processa resultado da validação de conta
     * @param accountId ID da conta
     * @param accountNumber Número da conta
     * @param isValid Se a conta é válida
     * @param validationStatus Status da validação
     */
    void execute(String accountId, String accountNumber, 
                boolean isValid, String validationStatus);
}
```

### Output Port (Opcional - para publicar resultado)

```java
package br.com.bradesco.validation.port.output;

import br.com.bradesco.validation.core.domain.model.AccountValidation;

/**
 * Contrato de saída - pode publicar resultado da validação
 * Exemplo: enviar para outro tópico, persistir em banco, etc.
 */
public interface ValidationResultEventPort {
    
    /**
     * Publica resultado da validação processada
     * @param validation Resultado da validação
     */
    void publishValidationResult(AccountValidation validation);
}
```

## 4. UseCase

```java
package br.com.bradesco.validation.core.usecase;

import br.com.bradesco.validation.core.domain.model.AccountValidation;
import br.com.bradesco.validation.port.input.ValidateAccountInputPort;
import br.com.bradesco.validation.port.output.ValidationResultEventPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * UseCase - implementa regra de negócio
 * NÃO conhece detalhes de infraestrutura (Kafka)
 */
public class ValidateAccountUseCase implements ValidateAccountInputPort {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(ValidateAccountUseCase.class);
    
    private final ValidationResultEventPort validationResultEventPort;
    
    public ValidateAccountUseCase(ValidationResultEventPort validationResultEventPort) {
        this.validationResultEventPort = validationResultEventPort;
    }
    
    @Override
    public void execute(String accountId, String accountNumber, 
                       boolean isValid, String validationStatus) {
        
        LOGGER.info("Processing account validation - accountId: {} - isValid: {}", 
                   accountId, isValid);
        
        // 1. Validações de negócio
        validateInputs(accountId, accountNumber);
        
        // 2. Criar entidade de domínio
        String reason = determineReason(isValid, validationStatus);
        AccountValidation validation = new AccountValidation(
            accountId,
            accountNumber,
            isValid,
            validationStatus,
            reason
        );
        
        // 3. Aplicar regras de negócio específicas
        if (!isValid) {
            LOGGER.warn("Account validation failed - accountId: {} - reason: {}", 
                       accountId, reason);
            // Pode acionar outras ações (notificação, alerta, etc.)
        } else {
            LOGGER.info("Account validation succeeded - accountId: {}", accountId);
        }
        
        // 4. Publicar resultado (opcional)
        validationResultEventPort.publishValidationResult(validation);
    }
    
    private void validateInputs(String accountId, String accountNumber) {
        if (accountId == null || accountId.isBlank()) {
            throw new IllegalArgumentException("AccountId não pode ser vazio");
        }
        if (accountNumber == null || accountNumber.isBlank()) {
            throw new IllegalArgumentException("AccountNumber não pode ser vazio");
        }
    }
    
    private String determineReason(boolean isValid, String status) {
        if (isValid) {
            return "Conta validada com sucesso";
        }
        return switch (status) {
            case "BLOCKED" -> "Conta bloqueada";
            case "INACTIVE" -> "Conta inativa";
            case "INVALID_DATA" -> "Dados inválidos";
            default -> "Validação falhou";
        };
    }
}
```

## 5. Adapter Layer

### Event DTO (Mensagem Kafka)

```java
package br.com.bradesco.validation.adapter.input.kafka.consumer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO que representa a mensagem recebida do Kafka
 * Record class (Java 14+) - imutável por padrão
 */
public record AccountCheckMessage(
    
    @JsonProperty("account_id")
    String accountId,
    
    @JsonProperty("account_number")
    String accountNumber,
    
    @JsonProperty("is_valid")
    Boolean isValid,
    
    @JsonProperty("validation_status")
    String validationStatus,
    
    @JsonProperty("checked_at")
    String checkedAt
) {
}
```

### Event Mapper

```java
package br.com.bradesco.validation.adapter.input.kafka.consumer.mapper;

import br.com.bradesco.validation.adapter.input.kafka.consumer.dto.AccountCheckMessage;
import org.springframework.stereotype.Component;

/**
 * Mapper que traduz mensagem Kafka para parâmetros do caso de uso
 * Valida e transforma dados antes de passar para o domínio
 */
@Component
public class AccountCheckMapper {
    
    /**
     * Valida e extrai accountId da mensagem
     */
    public String toAccountId(AccountCheckMessage message) {
        if (message.accountId() == null || message.accountId().isBlank()) {
            throw new IllegalArgumentException("accountId inválido na mensagem");
        }
        return message.accountId();
    }
    
    /**
     * Valida e extrai accountNumber da mensagem
     */
    public String toAccountNumber(AccountCheckMessage message) {
        if (message.accountNumber() == null || message.accountNumber().isBlank()) {
            throw new IllegalArgumentException("accountNumber inválido na mensagem");
        }
        return message.accountNumber();
    }
    
    /**
     * Valida e extrai isValid da mensagem
     */
    public boolean toIsValid(AccountCheckMessage message) {
        if (message.isValid() == null) {
            throw new IllegalArgumentException("isValid não pode ser nulo");
        }
        return message.isValid();
    }
    
    /**
     * Extrai validationStatus da mensagem
     */
    public String toValidationStatus(AccountCheckMessage message) {
        return message.validationStatus() != null 
            ? message.validationStatus() 
            : "UNKNOWN";
    }
}
```

## 6. Kafka Configuration

```java
package br.com.bradesco.validation.adapter.output.config;

import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

/**
 * Configuração do Kafka Consumer
 */
@Configuration
public class KafkaConfig {
    
    /**
     * Factory para criar listeners de mensagens Kafka
     * Configuração genérica: <Chave, Valor> = <String, String>
     * Desserialização JSON é feita automaticamente pelo ErrorHandlingDeserializer
     */
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory(
            KafkaProperties kafkaProperties,
            SslBundles sslBundles) {
        
        ConcurrentKafkaListenerContainerFactory<String, String> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        
        factory.setConsumerFactory(consumerFactory(kafkaProperties, sslBundles));
        
        // Configurações adicionais
        factory.setConcurrency(3);  // Número de threads consumidoras
        factory.getContainerProperties().setPollTimeout(3000);
        
        return factory;
    }
    
    private ConsumerFactory<String, String> consumerFactory(
            KafkaProperties kafkaProperties,
            SslBundles sslBundles) {
        
        var consumerProperties = kafkaProperties.buildConsumerProperties(sslBundles);
        return new DefaultKafkaConsumerFactory<>(consumerProperties);
    }
}
```

## 7. Kafka Consumer (Input Adapter)

### Consumer Básico

```java
package br.com.bradesco.validation.adapter.input.kafka.consumer;

import br.com.bradesco.validation.adapter.input.kafka.consumer.dto.AccountCheckMessage;
import br.com.bradesco.validation.adapter.input.kafka.consumer.mapper.AccountCheckMapper;
import br.com.bradesco.validation.port.input.ValidateAccountInputPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Consumer Kafka que escuta tópico de validação de contas
 * Implementa Input Adapter na arquitetura hexagonal
 */
@Component
public class AccountCheckResultConsumer {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(AccountCheckResultConsumer.class);
    
    private final ValidateAccountInputPort validateAccountInputPort;
    private final AccountCheckMapper mapper;
    
    public AccountCheckResultConsumer(
            ValidateAccountInputPort validateAccountInputPort,
            AccountCheckMapper mapper) {
        this.validateAccountInputPort = validateAccountInputPort;
        this.mapper = mapper;
    }
    
    /**
     * Escuta mensagens do tópico account-check-result
     * Desserialização automática para AccountCheckMessage
     */
    @KafkaListener(
        topics = "${spring.kafka.topics.account-check-result.name}",
        groupId = "${info.app.name}",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void listen(AccountCheckMessage message) {
        LOGGER.info("Received account check result - accountId: {} - isValid: {}", 
                   message.accountId(), message.isValid());
        
        try {
            // 1. Mapear mensagem para parâmetros do UseCase
            String accountId = mapper.toAccountId(message);
            String accountNumber = mapper.toAccountNumber(message);
            boolean isValid = mapper.toIsValid(message);
            String validationStatus = mapper.toValidationStatus(message);
            
            // 2. Executar caso de uso
            validateAccountInputPort.execute(accountId, accountNumber, isValid, validationStatus);
            
            LOGGER.info("Account check processed successfully - accountId: {}", accountId);
            
        } catch (IllegalArgumentException e) {
            LOGGER.error("Invalid message format - accountId: {} - error: {}", 
                        message.accountId(), e.getMessage());
            throw e;  // Será tratado pelo error handler
        } catch (Exception e) {
            LOGGER.error("Error processing account check - accountId: {} - error: {}", 
                        message.accountId(), e.getMessage(), e);
            throw e;
        }
    }
}
```

### Consumer com Retry e DLT

```java
package br.com.bradesco.validation.adapter.input.kafka.consumer;

import br.com.bradesco.validation.adapter.input.kafka.consumer.dto.AccountCheckMessage;
import br.com.bradesco.validation.adapter.input.kafka.consumer.mapper.AccountCheckMapper;
import br.com.bradesco.validation.port.input.ValidateAccountInputPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Component;

/**
 * Consumer Kafka com estratégia de retry e DLT
 * Non-Blocking Retry - mensagens com erro vão para tópico de retry
 */
@Component
public class AccountCheckResultConsumer {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(AccountCheckResultConsumer.class);
    
    private final ValidateAccountInputPort validateAccountInputPort;
    private final AccountCheckMapper mapper;
    
    public AccountCheckResultConsumer(
            ValidateAccountInputPort validateAccountInputPort,
            AccountCheckMapper mapper) {
        this.validateAccountInputPort = validateAccountInputPort;
        this.mapper = mapper;
    }
    
    /**
     * Consumer principal com retry configurado
     * 
     * Retry configurado:
     * - 5 tentativas
     * - Backoff de 3000ms entre tentativas
     * - Tópicos -retry e -dlt devem existir
     * - Inclui IllegalArgumentException no retry
     * - Exclui NullPointerException do retry (vai direto para DLT)
     */
    @KafkaListener(
        topics = "${spring.kafka.topics.account-check-result.name}",
        groupId = "${info.app.name}",
        containerFactory = "kafkaListenerContainerFactory"
    )
    @RetryableTopic(
        backoff = @Backoff(value = 3000L),
        attempts = "5",
        autoCreateTopics = "false",
        autoStartDltHandler = "true",
        include = {IllegalArgumentException.class, RuntimeException.class},
        exclude = {NullPointerException.class}
    )
    public void listen(AccountCheckMessage message,
                      @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                      @Header(KafkaHeaders.OFFSET) Long offset) {
        
        LOGGER.info("Processing message - topic: {} - offset: {} - accountId: {}", 
                   topic, offset, message.accountId());
        
        try {
            String accountId = mapper.toAccountId(message);
            String accountNumber = mapper.toAccountNumber(message);
            boolean isValid = mapper.toIsValid(message);
            String validationStatus = mapper.toValidationStatus(message);
            
            validateAccountInputPort.execute(accountId, accountNumber, isValid, validationStatus);
            
            LOGGER.info("Message processed successfully - accountId: {}", accountId);
            
        } catch (Exception e) {
            LOGGER.error("Error processing message - accountId: {} - attempt will retry - error: {}", 
                        message.accountId(), e.getMessage());
            throw e;  // Lança exceção para acionar retry
        }
    }
    
    /**
     * Dead-Letter Topic Handler
     * Chamado quando todas as tentativas de retry falharem
     * 
     * Este método processa mensagens que foram para o DLT
     * Pode implementar lógicas como:
     * - Persistir em banco de erros
     * - Enviar alerta/notificação
     * - Log detalhado para análise
     */
    @DltHandler
    public void handleDlt(AccountCheckMessage message,
                         @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                         @Header(KafkaHeaders.EXCEPTION_MESSAGE) String exceptionMessage) {
        
        LOGGER.error("Message sent to DLT - topic: {} - accountId: {} - error: {}", 
                    topic, message.accountId(), exceptionMessage);
        
        // Implementar lógica de tratamento de mensagens não processadas
        // Exemplo: salvar em banco de dados de erros, enviar alerta, etc.
    }
}
```

## 8. Configuration

### UseCase Config

```java
package br.com.bradesco.validation.config;

import br.com.bradesco.validation.core.usecase.ValidateAccountUseCase;
import br.com.bradesco.validation.port.input.ValidateAccountInputPort;
import br.com.bradesco.validation.port.output.ValidationResultEventPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração de casos de uso
 */
@Configuration
public class UseCaseConfig {
    
    @Bean
    public ValidateAccountInputPort validateAccountInputPort(
            ValidationResultEventPort validationResultEventPort) {
        return new ValidateAccountUseCase(validationResultEventPort);
    }
}
```

## 9. Application Properties

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
    consumer:
      key-deserializer: 'org.springframework.kafka.support.serializer.ErrorHandlingDeserializer'
      value-deserializer: 'org.springframework.kafka.support.serializer.ErrorHandlingDeserializer'
      auto-offset-reset: earliest  # Começar do início se não houver offset
      enable-auto-commit: true
      properties:
        spring:
          deserializer:
            key:
              delegate:
                class: org.apache.kafka.common.serialization.StringDeserializer
            value:
              delegate:
                class: org.springframework.kafka.support.serializer.JsonDeserializer
          json:
            trusted:
              packages: 'br.com.bradesco.*'  # Pacotes confiáveis para desserialização
    topics:
      account-check-result:
        name: 'tp-event-account-check-result'

info:
  app:
    name: 'account-validation-service'
```

### application-default.yml (Desenvolvimento Local)

```yaml
spring:
  kafka:
    bootstrap-servers: 'localhost:9092'
    security:
      protocol: PLAINTEXT
    consumer:
      key-deserializer: 'org.springframework.kafka.support.serializer.ErrorHandlingDeserializer'
      value-deserializer: 'org.springframework.kafka.support.serializer.ErrorHandlingDeserializer'
      auto-offset-reset: earliest
      properties:
        spring:
          deserializer:
            key:
              delegate:
                class: org.apache.kafka.common.serialization.StringDeserializer
            value:
              delegate:
                class: org.springframework.kafka.support.serializer.JsonDeserializer
          json:
            trusted:
              packages: 'br.com.bradesco.*'
    topics:
      account-check-result:
        name: 'tp-event-account-check-result'

info:
  app:
    name: 'account-validation-service'
```

## 10. Criação dos Tópicos de Retry e DLT

Para usar `@RetryableTopic`, os seguintes tópicos devem existir:

### Tópicos necessários:

1. **Tópico principal**: `tp-event-account-check-result`
2. **Tópico de retry**: `tp-event-account-check-result-retry`
3. **Tópico DLT**: `tp-event-account-check-result-dlt`

### Solicitação de tópicos:

Acesse o [Portal de Solicitação de Tópicos Kafka](https://bradesco.sharepoint.com/kafka-topics-request) para criar os tópicos necessários.

## 11. Configurações Avançadas

### Custom Error Handler

```java
package br.com.bradesco.validation.adapter.output.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaErrorConfig {
    
    /**
     * Error handler customizado para o consumer
     * Retry 3 vezes com intervalo de 2 segundos
     */
    @Bean
    public DefaultErrorHandler errorHandler() {
        // Retry 3 vezes com 2s de intervalo entre tentativas
        return new DefaultErrorHandler(new FixedBackOff(2000L, 3L));
    }
}
```

### Consumer com Batch Processing

```java
@KafkaListener(
    topics = "${spring.kafka.topics.account-check-result.name}",
    groupId = "${info.app.name}",
    containerFactory = "kafkaListenerContainerFactory"
)
public void listenBatch(List<AccountCheckMessage> messages) {
    LOGGER.info("Received batch of {} messages", messages.size());
    
    messages.forEach(message -> {
        // Processar cada mensagem
    });
}
```

## Boas Práticas

1. ✅ **Use `ErrorHandlingDeserializer`** para tratar erros de desserialização
2. ✅ **Configure `auto-offset-reset`** corretamente (earliest/latest)
3. ✅ **Implemente retry e DLT** para mensagens com erro
4. ✅ **Use mappers** para traduzir eventos → domínio
5. ✅ **Valide mensagens** antes de processar
6. ✅ **Implemente logging** detalhado com topic/partition/offset
7. ✅ **Trate exceções** corretamente (retry vs DLT)
8. ✅ **Isole o domínio** - UseCase não conhece Kafka
9. ✅ **Configure `trusted.packages`** para segurança na desserialização

## Recursos Adicionais

- [Spring Kafka Documentation](https://docs.spring.io/spring-kafka/reference/html/)
- [Kafka Consumer Configuration](https://kafka.apache.org/documentation/#consumerconfigs)
- [Retry Topic Documentation](https://docs.spring.io/spring-kafka/reference/retrytopic.html)
- [Error Handling](https://docs.spring.io/spring-kafka/reference/kafka/annotation-error-handling.html)
