# Kafka Consumer - Arquitetura Hexagonal

Este documento demonstra como implementar um **Kafka Consumer** seguindo arquitetura hexagonal, com consumo de eventos de tópicos Kafka usando Confluent Cloud.

## 1. Estrutura do Projeto

```
com.empresa.projeto.validation/
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
package com.empresa.projeto.validation.core.domain.model;

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
package com.empresa.projeto.validation.port.input;

/**
 * Contrato de entrada - define o caso de uso de validação
 */
public interface ValidateAccountInputPort {
    void execute(String accountId, String accountNumber, 
                boolean isValid, String validationStatus);
}
```

## 4. UseCase (Lógica de Negócio)

```java
package com.empresa.projeto.validation.core.usecase;

import com.empresa.projeto.validation.port.input.ValidateAccountInputPort;
import com.empresa.projeto.validation.port.output.ValidationResultEventPort;

public class ValidateAccountUseCase implements ValidateAccountInputPort {
    
    private final ValidationResultEventPort validationResultEventPort;
    
    public ValidateAccountUseCase(ValidationResultEventPort validationResultEventPort) {
        this.validationResultEventPort = validationResultEventPort;
    }
    
    @Override
    public void execute(String accountId, String accountNumber, 
                       boolean isValid, String validationStatus) {
        // Lógica de negócio aqui...
    }
}
```

## 5. Adapter Layer (Kafka Consumer)

### Event DTO (Record Java 21)

```java
package com.empresa.projeto.validation.adapter.input.kafka.consumer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AccountCheckMessage(
    @JsonProperty("account_id") String accountId,
    @JsonProperty("account_number") String accountNumber,
    @JsonProperty("is_valid") Boolean isValid,
    @JsonProperty("validation_status") String validationStatus
) {}
```

### Kafka Consumer com Retry e DLT

```java
package com.empresa.projeto.validation.adapter.input.kafka.consumer;

import org.springframework.kafka.annotation.DltHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Component;

@Component
public class AccountCheckResultConsumer {
    
    private final ValidateAccountInputPort validateAccountInputPort;
    private final AccountCheckMapper mapper;
    
    public AccountCheckResultConsumer(ValidateAccountInputPort validateAccountInputPort, AccountCheckMapper mapper) {
        this.validateAccountInputPort = validateAccountInputPort;
        this.mapper = mapper;
    }
    
    @KafkaListener(
        topics = "${spring.kafka.topics.account-check-result.name}",
        groupId = "${info.app.name}",
        containerFactory = "kafkaListenerContainerFactory"
    )
    @RetryableTopic(
        backoff = @Backoff(value = 3000L),
        attempts = "5",
        autoCreateTopics = "false",
        include = {RuntimeException.class}
    )
    public void listen(AccountCheckMessage message) {
        // Mapeamento e Execução do UseCase
        validateAccountInputPort.execute(
            message.accountId(), 
            message.accountNumber(), 
            message.isValid(), 
            message.validationStatus()
        );
    }
    
    @DltHandler
    public void handleDlt(AccountCheckMessage message) {
        // Lógica para mensagens que falharam após todas as tentativas
    }
}
```

## 6. Configuração (application.yml)

```yaml
spring:
  kafka:
    consumer:
      key-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
      properties:
        spring.json.trusted.packages: 'com.empresa.projeto.*'
```

---
> [!IMPORTANT]
> **Resiliência**: Sempre utilize `@RetryableTopic` para garantir que falhas temporárias não causem perda de dados. Mensagens que falham permanentemente devem ser analisadas no tópico de **DLT** (Dead-Letter Topic).
