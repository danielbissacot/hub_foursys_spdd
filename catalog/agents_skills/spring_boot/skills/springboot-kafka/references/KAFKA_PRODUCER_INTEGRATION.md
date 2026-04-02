# Kafka Producer - Arquitetura Hexagonal

Este documento demonstra como implementar um **Kafka Producer** seguindo arquitetura hexagonal, com envio de eventos para tópicos Kafka usando Confluent Cloud.

## 1. Estrutura do Projeto

```
com.empresa.projeto.contacorrente/
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
package com.empresa.projeto.contacorrente.core.domain.model;

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

### Output Port (Event)

```java
package com.empresa.projeto.contacorrente.port.output;

import com.empresa.projeto.contacorrente.core.domain.model.Account;

/**
 * Contrato de saída - define como publicar eventos
 * Interface em linguagem de domínio (não menciona Kafka)
 */
public interface AccountCreatedEventPort {
    void publishAccountCreated(Account account);
}
```

## 4. Adapter Layer (Kafka Producer)

### Event DTO (Record Java 21)

```java
package com.empresa.projeto.contacorrente.adapter.output.kafka.producer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AccountCreatedMessage(
    @JsonProperty("id") String id,
    @JsonProperty("name") String name,
    @JsonProperty("account_number") String accountNumber,
    @JsonProperty("cpf") String cpf,
    @JsonProperty("created_at") String createdAt
) {}
```

### Kafka Producer (Implementação do OutputPort)

```java
package com.empresa.projeto.contacorrente.adapter.output.kafka.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

@Component
public class AccountCreatedEventProducer implements AccountCreatedEventPort {
    
    private final KafkaTemplate<String, AccountCreatedMessage> kafkaTemplate;
    private final AccountEventMapper mapper;
    
    public AccountCreatedEventProducer(KafkaTemplate<String, AccountCreatedMessage> kafkaTemplate, AccountEventMapper mapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.mapper = mapper;
    }
    
    @Override
    public void publishAccountCreated(Account account) {
        AccountCreatedMessage message = mapper.toMessage(account);
        
        final Message<AccountCreatedMessage> kafkaMessage = MessageBuilder
                .withPayload(message)
                .setHeader(KafkaHeaders.TOPIC, "${spring.kafka.topics.account-created.name}")
                .setHeader(KafkaHeaders.KEY, account.getId())
                .build();
        
        // Envio assíncrono com callback
        kafkaTemplate.send(kafkaMessage).whenComplete((success, ex) -> {
            if (ex != null) {
                // Lógica de erro/retry manual
            }
        });
    }
}
```

## 5. Configuração (application.yml)

```yaml
spring:
  kafka:
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
      acks: all
      properties:
        enable.idempotence: true
```

---
> [!TIP]
> **Idempotência**: Sempre habilite `enable.idempotence=true` no producer para garantir que, em caso de retentativas automáticas do Kafka, a mesma mensagem não seja publicada em duplicidade no tópico.
