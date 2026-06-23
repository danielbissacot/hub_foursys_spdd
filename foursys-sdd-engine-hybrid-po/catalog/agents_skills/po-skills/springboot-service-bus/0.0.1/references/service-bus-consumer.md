# Azure Service Bus Consumer - Arquitetura Hexagonal

Este documento demonstra como implementar um **Azure Service Bus Consumer** seguindo arquitetura hexagonal, com consumo de mensagens de filas do Azure Service Bus usando Azure Java SDK.

## 1. Estrutura do Projeto

```
br.com.bradesco.notification/
├── core/
│   ├── domain/model/
│   │   └── AccountNotification.java
│   └── usecase/
│       └── ProcessAccountNotificationUseCase.java
├── port/
│   ├── input/
│   │   └── ProcessAccountNotificationInputPort.java
│   └── output/
│       └── NotificationOutputPort.java
└── adapter/
    ├── input/
    │   └── servicebus/
    │       └── consumer/
    │           ├── BaseConsumer.java
    │           ├── AccountNotificationConsumer.java
    │           ├── dto/
    │           │   └── AccountNotificationMessage.java
    │           └── mapper/
    │               └── AccountNotificationMapper.java
    └── output/
        └── config/
            └── MessagingConfig.java
```

## 2. Domain Model

```java
package br.com.bradesco.notification.core.domain.model;

/**
 * Entidade de domínio - SEM anotações externas
 */
public class AccountNotification {
    private String accountId;
    private String accountNumber;
    private String notificationType;
    private String message;
    private String recipient;
    
    public AccountNotification(String accountId, String accountNumber,
                              String notificationType, String message, String recipient) {
        this.accountId = accountId;
        this.accountNumber = accountNumber;
        this.notificationType = notificationType;
        this.message = message;
        this.recipient = recipient;
    }
    
    // Getters
    public String getAccountId() { return accountId; }
    public String getAccountNumber() { return accountNumber; }
    public String getNotificationType() { return notificationType; }
    public String getMessage() { return message; }
    public String getRecipient() { return recipient; }
}
```

## 3. Ports

### Input Port

```java
package br.com.bradesco.notification.port.input;

import br.com.bradesco.notification.core.domain.model.AccountNotification;

/**
 * Contrato de entrada - define o caso de uso de processamento de notificação
 */
public interface ProcessAccountNotificationInputPort {
    
    /**
     * Processa notificação de conta
     * @param accountId ID da conta
     * @param accountNumber Número da conta
     * @param notificationType Tipo de notificação
     * @param message Mensagem
     * @param recipient Destinatário
     */
    void execute(String accountId, String accountNumber, String notificationType,
                String message, String recipient);
}
```

### Output Port (Opcional)

```java
package br.com.bradesco.notification.port.output;

import br.com.bradesco.notification.core.domain.model.AccountNotification;

/**
 * Contrato de saída - pode enviar notificação (email, SMS, push, etc.)
 */
public interface NotificationOutputPort {
    
    /**
     * Envia notificação processada
     * @param notification Notificação a ser enviada
     */
    void send(AccountNotification notification);
}
```

## 4. UseCase

```java
package br.com.bradesco.notification.core.usecase;

import br.com.bradesco.notification.core.domain.model.AccountNotification;
import br.com.bradesco.notification.port.input.ProcessAccountNotificationInputPort;
import br.com.bradesco.notification.port.output.NotificationOutputPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * UseCase - implementa regra de negócio
 * NÃO conhece detalhes de infraestrutura (Service Bus)
 */
public class ProcessAccountNotificationUseCase implements ProcessAccountNotificationInputPort {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(ProcessAccountNotificationUseCase.class);
    
    private final NotificationOutputPort notificationOutputPort;
    
    public ProcessAccountNotificationUseCase(NotificationOutputPort notificationOutputPort) {
        this.notificationOutputPort = notificationOutputPort;
    }
    
    @Override
    public void execute(String accountId, String accountNumber, String notificationType,
                       String message, String recipient) {
        
        LOGGER.info("Processing account notification - accountId: {} - type: {}", 
                   accountId, notificationType);
        
        // 1. Validações de negócio
        validateInputs(accountId, accountNumber, notificationType, recipient);
        
        // 2. Criar entidade de domínio
        AccountNotification notification = new AccountNotification(
            accountId,
            accountNumber,
            notificationType,
            message,
            recipient
        );
        
        // 3. Aplicar regras de negócio específicas
        if ("URGENT".equals(notificationType)) {
            LOGGER.warn("Urgent notification - accountId: {} - prioritizing", accountId);
            // Pode acionar processamento prioritário
        }
        
        // 4. Enviar notificação
        notificationOutputPort.send(notification);
        
        LOGGER.info("Account notification processed successfully - accountId: {}", accountId);
    }
    
    private void validateInputs(String accountId, String accountNumber,
                               String notificationType, String recipient) {
        if (accountId == null || accountId.isBlank()) {
            throw new IllegalArgumentException("AccountId não pode ser vazio");
        }
        if (accountNumber == null || accountNumber.isBlank()) {
            throw new IllegalArgumentException("AccountNumber não pode ser vazio");
        }
        if (notificationType == null || notificationType.isBlank()) {
            throw new IllegalArgumentException("NotificationType não pode ser vazio");
        }
        if (recipient == null || recipient.isBlank()) {
            throw new IllegalArgumentException("Recipient não pode ser vazio");
        }
    }
}
```

## 5. Adapter Layer

### Message DTO (Mensagem Service Bus)

```java
package br.com.bradesco.notification.adapter.input.servicebus.consumer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO que representa a mensagem recebida do Service Bus
 * Record class (Java 14+) - imutável por padrão
 */
public record AccountNotificationMessage(
    
    @JsonProperty("account_id")
    String accountId,
    
    @JsonProperty("account_number")
    String accountNumber,
    
    @JsonProperty("notification_type")
    String notificationType,
    
    @JsonProperty("message")
    String message,
    
    @JsonProperty("recipient")
    String recipient,
    
    @JsonProperty("created_at")
    String createdAt
) {
}
```

### Message Mapper

```java
package br.com.bradesco.notification.adapter.input.servicebus.consumer.mapper;

import br.com.bradesco.notification.adapter.input.servicebus.consumer.dto.AccountNotificationMessage;
import org.springframework.stereotype.Component;

/**
 * Mapper que traduz mensagem Service Bus para parâmetros do caso de uso
 * Valida e transforma dados antes de passar para o domínio
 */
@Component
public class AccountNotificationMapper {
    
    public String toAccountId(AccountNotificationMessage message) {
        if (message.accountId() == null || message.accountId().isBlank()) {
            throw new IllegalArgumentException("accountId inválido na mensagem");
        }
        return message.accountId();
    }
    
    public String toAccountNumber(AccountNotificationMessage message) {
        if (message.accountNumber() == null || message.accountNumber().isBlank()) {
            throw new IllegalArgumentException("accountNumber inválido na mensagem");
        }
        return message.accountNumber();
    }
    
    public String toNotificationType(AccountNotificationMessage message) {
        if (message.notificationType() == null || message.notificationType().isBlank()) {
            throw new IllegalArgumentException("notificationType inválido na mensagem");
        }
        return message.notificationType();
    }
    
    public String toMessage(AccountNotificationMessage message) {
        return message.message() != null ? message.message() : "";
    }
    
    public String toRecipient(AccountNotificationMessage message) {
        if (message.recipient() == null || message.recipient().isBlank()) {
            throw new IllegalArgumentException("recipient inválido na mensagem");
        }
        return message.recipient();
    }
}
```

## 6. Messaging Configuration

```java
package br.com.bradesco.notification.adapter.output.config;

import br.com.bradesco.notification.adapter.input.servicebus.consumer.AccountNotificationConsumer;
import com.azure.messaging.servicebus.ServiceBusClientBuilder;
import com.azure.messaging.servicebus.ServiceBusProcessorClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração do Azure Service Bus Consumer
 */
@Configuration
public class MessagingConfig {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(MessagingConfig.class);
    
    @Value("${servicebus.connectionString}")
    private String connectionString;
    
    @Value("${servicebus.queueName}")
    private String queueName;
    
    private final AccountNotificationConsumer consumer;
    
    public MessagingConfig(AccountNotificationConsumer consumer) {
        this.consumer = consumer;
    }
    
    /**
     * ServiceBusClientBuilder para criar clientes Service Bus
     */
    @Bean
    public ServiceBusClientBuilder serviceBusClientBuilder() {
        LOGGER.info("Configuring Service Bus client builder");
        return new ServiceBusClientBuilder()
                .connectionString(connectionString);
    }
    
    /**
     * ServiceBusProcessorClient para processar mensagens
     * Configurado com callbacks para processamento e erro
     */
    @Bean
    public ServiceBusProcessorClient serviceBusProcessorClient(ServiceBusClientBuilder builder) {
        LOGGER.info("Creating Service Bus processor client for queue: {}", queueName);
        
        return builder
                .processor()
                .queueName(queueName)
                .processMessage(consumer::onMessage)
                .processError(consumer::onError)
                .buildProcessorClient();
    }
}
```

## 7. Base Consumer

```java
package br.com.bradesco.notification.adapter.input.servicebus.consumer;

import com.azure.messaging.servicebus.ServiceBusErrorContext;
import com.azure.messaging.servicebus.ServiceBusReceivedMessageContext;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Classe base abstrata para consumers do Service Bus
 * Fornece funcionalidades comuns de desserialização
 * @param <T> Tipo da mensagem a ser processada
 */
public abstract class BaseConsumer<T> {
    
    protected final ObjectMapper objectMapper;
    
    protected BaseConsumer(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }
    
    /**
     * Converte corpo da mensagem JSON para objeto Java
     * @param messageBody JSON string
     * @param targetClass Classe alvo
     * @return Objeto desserializado
     * @throws RuntimeException se falhar na desserialização
     */
    protected T convertToObject(String messageBody, Class<T> targetClass) {
        try {
            return objectMapper.readValue(messageBody, targetClass);
        } catch (JsonProcessingException ex) {
            throw new RuntimeException("Erro ao desserializar mensagem", ex);
        }
    }
    
    /**
     * Processa mensagem recebida
     * Deve ser implementado pelas classes concretas
     */
    public abstract void onMessage(ServiceBusReceivedMessageContext context);
    
    /**
     * Trata erros no processamento
     * Deve ser implementado pelas classes concretas
     */
    public abstract void onError(ServiceBusErrorContext context);
}
```

## 8. Service Bus Consumer (Input Adapter)

```java
package br.com.bradesco.notification.adapter.input.servicebus.consumer;

import br.com.bradesco.notification.adapter.input.servicebus.consumer.dto.AccountNotificationMessage;
import br.com.bradesco.notification.adapter.input.servicebus.consumer.mapper.AccountNotificationMapper;
import br.com.bradesco.notification.port.input.ProcessAccountNotificationInputPort;
import com.azure.messaging.servicebus.ServiceBusErrorContext;
import com.azure.messaging.servicebus.ServiceBusReceivedMessage;
import com.azure.messaging.servicebus.ServiceBusReceivedMessageContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Consumer Service Bus que escuta fila de notificações
 * Implementa Input Adapter na arquitetura hexagonal
 */
@Component
public class AccountNotificationConsumer extends BaseConsumer<AccountNotificationMessage> {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(AccountNotificationConsumer.class);
    
    private final ProcessAccountNotificationInputPort processNotificationInputPort;
    private final AccountNotificationMapper mapper;
    
    public AccountNotificationConsumer(
            ObjectMapper objectMapper,
            ProcessAccountNotificationInputPort processNotificationInputPort,
            AccountNotificationMapper mapper) {
        super(objectMapper);
        this.processNotificationInputPort = processNotificationInputPort;
        this.mapper = mapper;
    }
    
    /**
     * Processa mensagem recebida do Service Bus
     * Desserializa e delega para o UseCase
     */
    @Override
    public void onMessage(ServiceBusReceivedMessageContext context) {
        ServiceBusReceivedMessage message = context.getMessage();
        
        LOGGER.info("Processing message - MessageId: {} - SequenceNumber: {} - DeliveryCount: {}",
                   message.getMessageId(),
                   message.getSequenceNumber(),
                   message.getDeliveryCount());
        
        try {
            // 1. Desserializar mensagem
            String messageBody = message.getBody().toString();
            AccountNotificationMessage notification = convertToObject(
                messageBody,
                AccountNotificationMessage.class
            );
            
            LOGGER.info("Message deserialized - accountId: {} - type: {}",
                       notification.accountId(), notification.notificationType());
            
            // 2. Mapear para parâmetros do UseCase
            String accountId = mapper.toAccountId(notification);
            String accountNumber = mapper.toAccountNumber(notification);
            String notificationType = mapper.toNotificationType(notification);
            String notificationMessage = mapper.toMessage(notification);
            String recipient = mapper.toRecipient(notification);
            
            // 3. Executar caso de uso
            processNotificationInputPort.execute(
                accountId,
                accountNumber,
                notificationType,
                notificationMessage,
                recipient
            );
            
            LOGGER.info("Message processed successfully - MessageId: {}", message.getMessageId());
            
        } catch (IllegalArgumentException e) {
            LOGGER.error("Invalid message format - MessageId: {} - Error: {}",
                        message.getMessageId(), e.getMessage());
            // Mensagem inválida - será movida para DLQ após max delivery count
            throw e;
            
        } catch (Exception e) {
            LOGGER.error("Error processing message - MessageId: {} - Error: {}",
                        message.getMessageId(), e.getMessage(), e);
            // Erro no processamento - retry será tentado
            throw e;
        }
    }
    
    /**
     * Trata erros no recebimento/processamento de mensagens
     */
    @Override
    public void onError(ServiceBusErrorContext context) {
        LOGGER.error("Error in Service Bus consumer - EntityPath: {} - ErrorSource: {} - Error: {}",
                    context.getEntityPath(),
                    context.getErrorSource(),
                    context.getException().getMessage(),
                    context.getException());
        
        // Implementar lógica de tratamento de erro
        // Exemplo: enviar alerta, registrar em banco de erros, etc.
    }
}
```

## 9. Application Lifecycle

```java
package br.com.bradesco.notification;

import com.azure.messaging.servicebus.ServiceBusProcessorClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;

import java.util.Arrays;

/**
 * Classe principal da aplicação
 * Gerencia lifecycle do Service Bus Consumer
 */
@SpringBootApplication
public class Application implements CommandLineRunner {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(Application.class);
    
    @Autowired
    private ServiceBusProcessorClient processorClient;
    
    @Autowired
    private Environment environment;
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
    
    @Override
    public void run(String... args) {
        String activeProfile = Arrays.toString(environment.getActiveProfiles());
        LOGGER.info("Application started - Active profiles: {}", activeProfile);
    }
    
    /**
     * Inicia o consumer quando a aplicação estiver pronta
     */
    @EventListener
    public void onApplicationReady(ApplicationReadyEvent event) {
        LOGGER.info("Starting Service Bus consumer...");
        processorClient.start();
        LOGGER.info("Service Bus consumer started successfully");
    }
    
    /**
     * Para o consumer quando o contexto for fechado
     */
    @EventListener
    public void onContextClosed(ContextClosedEvent event) {
        LOGGER.info("Stopping Service Bus consumer...");
        processorClient.close();
        LOGGER.info("Service Bus consumer stopped successfully");
    }
}
```

## 10. Configuration

### UseCase Config

```java
package br.com.bradesco.notification.config;

import br.com.bradesco.notification.core.usecase.ProcessAccountNotificationUseCase;
import br.com.bradesco.notification.port.input.ProcessAccountNotificationInputPort;
import br.com.bradesco.notification.port.output.NotificationOutputPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração de casos de uso
 */
@Configuration
public class UseCaseConfig {
    
    @Bean
    public ProcessAccountNotificationInputPort processAccountNotificationInputPort(
            NotificationOutputPort notificationOutputPort) {
        return new ProcessAccountNotificationUseCase(notificationOutputPort);
    }
}
```

## 11. Application Properties

### application.yml

```yaml
servicebus:
  connectionString: '${MY_SB_CONNECTION_STRING:Endpoint=sb://my-namespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=YOUR_KEY;}'
  queueName: '${MY_QUEUE:account-notification-queue}'

info:
  app:
    name: 'notification-service'

spring:
  application:
    name: notification-service

logging:
  level:
    com.azure.messaging.servicebus: INFO
    br.com.bradesco.notification: DEBUG
```

### application-local.yml (Desenvolvimento Local)

```yaml
servicebus:
  connectionString: 'Endpoint=sb://localhost:5672;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=local;'
  queueName: 'account-notification-queue'
```

## 12. Processamento de Dead-Letter Queue

### DLQ Consumer

```java
package br.com.bradesco.notification.adapter.input.servicebus.consumer;

import com.azure.messaging.servicebus.ServiceBusErrorContext;
import com.azure.messaging.servicebus.ServiceBusReceivedMessage;
import com.azure.messaging.servicebus.ServiceBusReceivedMessageContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Consumer para processar mensagens da Dead-Letter Queue
 */
@Component
public class DeadLetterQueueConsumer extends BaseConsumer<AccountNotificationMessage> {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(DeadLetterQueueConsumer.class);
    
    public DeadLetterQueueConsumer(ObjectMapper objectMapper) {
        super(objectMapper);
    }
    
    @Override
    public void onMessage(ServiceBusReceivedMessageContext context) {
        ServiceBusReceivedMessage message = context.getMessage();
        
        LOGGER.error("Message in DLQ - MessageId: {} - DeadLetterReason: {} - DeadLetterDescription: {}",
                    message.getMessageId(),
                    message.getDeadLetterReason(),
                    message.getDeadLetterErrorDescription());
        
        try {
            String messageBody = message.getBody().toString();
            AccountNotificationMessage notification = convertToObject(
                messageBody,
                AccountNotificationMessage.class
            );
            
            LOGGER.error("DLQ Message content - accountId: {} - type: {}",
                        notification.accountId(), notification.notificationType());
            
            // Implementar lógica de tratamento de DLQ
            // Exemplo: salvar em banco de erros, enviar alerta, reprocessar manualmente, etc.
            
        } catch (Exception e) {
            LOGGER.error("Error processing DLQ message - MessageId: {}", 
                        message.getMessageId(), e);
        }
    }
    
    @Override
    public void onError(ServiceBusErrorContext context) {
        LOGGER.error("Error in DLQ consumer", context.getException());
    }
}
```

### DLQ Processor Configuration

```java
@Bean
public ServiceBusProcessorClient dlqProcessorClient(
        ServiceBusClientBuilder builder,
        DeadLetterQueueConsumer dlqConsumer) {
    
    return builder
        .processor()
        .queueName(queueName)
        .subQueue(SubQueue.DEAD_LETTER_QUEUE)  // Processa DLQ
        .processMessage(dlqConsumer::onMessage)
        .processError(dlqConsumer::onError)
        .buildProcessorClient();
}
```

## 13. Configurações Avançadas

### Consumer com Sessões

Para processamento ordenado por sessão:

```java
@Bean
public ServiceBusProcessorClient sessionProcessorClient(
        ServiceBusClientBuilder builder,
        AccountNotificationConsumer consumer) {
    
    return builder
        .sessionProcessor()
        .queueName(queueName)
        .maxConcurrentSessions(5)
        .maxConcurrentCalls(1)  // Processa 1 mensagem por sessão por vez
        .processMessage(consumer::onMessage)
        .processError(consumer::onError)
        .buildProcessorClient();
}
```

### Configuração de Concorrência

```java
@Bean
public ServiceBusProcessorClient serviceBusProcessorClient(
        ServiceBusClientBuilder builder,
        AccountNotificationConsumer consumer) {
    
    return builder
        .processor()
        .queueName(queueName)
        .maxConcurrentCalls(10)  // Processa até 10 mensagens simultaneamente
        .prefetchCount(5)  // Pre-fetch 5 mensagens
        .processMessage(consumer::onMessage)
        .processError(consumer::onError)
        .buildProcessorClient();
}
```

## Boas Práticas

1. ✅ **Use BaseConsumer** para reutilização de código
2. ✅ **Valide mensagens** antes de processar
3. ✅ **Implemente logging** detalhado com MessageId/SequenceNumber
4. ✅ **Trate exceções** adequadamente (retry vs DLQ)
5. ✅ **Use mappers** para traduzir mensagens → domínio
6. ✅ **Isole o domínio** - UseCase não conhece Service Bus
7. ✅ **Configure maxConcurrentCalls** conforme capacidade
8. ✅ **Monitore DLQ** regularmente
9. ✅ **Implemente processador de DLQ** para análise de falhas
10. ✅ **Gerencie lifecycle** corretamente (start/stop)

## Recursos Adicionais

- [Azure Service Bus Java SDK](https://learn.microsoft.com/en-us/java/api/com.azure.messaging.servicebus)
- [Message Processing](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-java-how-to-use-queues)
- [Error Handling](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dead-letter-queues)
- [Performance Tips](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-performance-improvements)
