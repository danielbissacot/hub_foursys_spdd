# Azure Service Bus Producer - Arquitetura Hexagonal

Este documento demonstra como implementar um **Azure Service Bus Producer** seguindo arquitetura hexagonal, com envio de mensagens para filas do Azure Service Bus usando Azure Java SDK.

## 1. Estrutura do Projeto

```
br.com.bradesco.account/
├── core/
│   ├── domain/model/
│   │   └── AccountStatus.java
│   └── usecase/
│       └── UpdateAccountStatusUseCase.java
├── port/
│   ├── input/
│   │   └── UpdateAccountStatusInputPort.java
│   └── output/
│       └── AccountStatusMessagePort.java
└── adapter/
    ├── input/
    │   └── controller/
    │       ├── AccountController.java
    │       ├── dto/
    │       │   └── request/
    │       │       └── UpdateAccountStatusRequest.java
    │       └── mapper/
    │           └── AccountControllerMapper.java
    └── output/
        ├── servicebus/
        │   └── producer/
        │       ├── AccountStatusMessageProducer.java
        │       ├── dto/
        │       │   └── AccountStatusMessage.java
        │       └── mapper/
        │           └── AccountMessageMapper.java
        └── config/
            └── MessagingConfig.java
```

## 2. Domain Model

```java
package br.com.bradesco.account.core.domain.model;

/**
 * Entidade de domínio - SEM anotações externas
 */
public class AccountStatus {
    private String accountId;
    private String accountNumber;
    private String status;
    private String reason;
    private String updatedBy;
    
    public AccountStatus(String accountId, String accountNumber, String status, 
                        String reason, String updatedBy) {
        this.accountId = accountId;
        this.accountNumber = accountNumber;
        this.status = status;
        this.reason = reason;
        this.updatedBy = updatedBy;
    }
    
    // Getters
    public String getAccountId() { return accountId; }
    public String getAccountNumber() { return accountNumber; }
    public String getStatus() { return status; }
    public String getReason() { return reason; }
    public String getUpdatedBy() { return updatedBy; }
}
```

## 3. Ports

### Input Port

```java
package br.com.bradesco.account.port.input;

import br.com.bradesco.account.core.domain.model.AccountStatus;

/**
 * Contrato de entrada - define o que o UseCase faz
 */
public interface UpdateAccountStatusInputPort {
    
    /**
     * Atualiza status de uma conta
     * @param accountId ID da conta
     * @param newStatus Novo status
     * @param reason Motivo da mudança
     * @param updatedBy Usuário que atualizou
     * @return AccountStatus atualizado
     */
    AccountStatus execute(String accountId, String newStatus, String reason, String updatedBy);
}
```

### Output Port (Message)

```java
package br.com.bradesco.account.port.output;

import br.com.bradesco.account.core.domain.model.AccountStatus;

/**
 * Contrato de saída - define como publicar mensagens
 * Interface em linguagem de domínio (não menciona Service Bus)
 */
public interface AccountStatusMessagePort {
    
    /**
     * Publica mensagem de atualização de status
     * @param accountStatus Status atualizado
     */
    void sendStatusUpdate(AccountStatus accountStatus);
}
```

## 4. UseCase

```java
package br.com.bradesco.account.core.usecase;

import br.com.bradesco.account.core.domain.model.AccountStatus;
import br.com.bradesco.account.port.input.UpdateAccountStatusInputPort;
import br.com.bradesco.account.port.output.AccountStatusMessagePort;

/**
 * UseCase - implementa regra de negócio
 * NÃO conhece detalhes de infraestrutura (Service Bus)
 */
public class UpdateAccountStatusUseCase implements UpdateAccountStatusInputPort {
    
    private final AccountStatusMessagePort messagePort;
    
    public UpdateAccountStatusUseCase(AccountStatusMessagePort messagePort) {
        this.messagePort = messagePort;
    }
    
    @Override
    public AccountStatus execute(String accountId, String newStatus, 
                                 String reason, String updatedBy) {
        // 1. Validações de negócio
        validateAccountId(accountId);
        validateStatus(newStatus);
        validateUpdatedBy(updatedBy);
        
        // 2. Buscar número da conta (exemplo simplificado)
        String accountNumber = fetchAccountNumber(accountId);
        
        // 3. Criar entidade de domínio
        AccountStatus accountStatus = new AccountStatus(
            accountId,
            accountNumber,
            newStatus,
            reason,
            updatedBy
        );
        
        // 4. Publicar mensagem (via OutputPort)
        messagePort.sendStatusUpdate(accountStatus);
        
        return accountStatus;
    }
    
    private void validateAccountId(String accountId) {
        if (accountId == null || accountId.isBlank()) {
            throw new IllegalArgumentException("AccountId não pode ser vazio");
        }
    }
    
    private void validateStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status não pode ser vazio");
        }
        
        // Validar status válidos
        if (!status.matches("ACTIVE|BLOCKED|INACTIVE|SUSPENDED")) {
            throw new IllegalArgumentException("Status inválido: " + status);
        }
    }
    
    private void validateUpdatedBy(String updatedBy) {
        if (updatedBy == null || updatedBy.isBlank()) {
            throw new IllegalArgumentException("UpdatedBy não pode ser vazio");
        }
    }
    
    private String fetchAccountNumber(String accountId) {
        // Lógica para buscar número da conta
        // Pode vir de banco de dados, cache, etc.
        return "ACC-" + accountId;
    }
}
```

## 5. Adapter Layer

### Message DTO (Mensagem Service Bus)

```java
package br.com.bradesco.account.adapter.output.servicebus.producer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO que representa a mensagem enviada ao Service Bus
 * Record class (Java 14+) - imutável por padrão
 */
public record AccountStatusMessage(
    
    @JsonProperty("account_id")
    String accountId,
    
    @JsonProperty("account_number")
    String accountNumber,
    
    @JsonProperty("status")
    String status,
    
    @JsonProperty("reason")
    String reason,
    
    @JsonProperty("updated_by")
    String updatedBy,
    
    @JsonProperty("updated_at")
    String updatedAt
) {
}
```

### Message Mapper

```java
package br.com.bradesco.account.adapter.output.servicebus.producer.mapper;

import br.com.bradesco.account.adapter.output.servicebus.producer.dto.AccountStatusMessage;
import br.com.bradesco.account.core.domain.model.AccountStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

import java.time.Instant;

/**
 * Mapper que traduz entidade de domínio para mensagem Service Bus
 * Protege o domínio de mudanças no formato da mensagem
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AccountMessageMapper {
    
    /**
     * Converte AccountStatus para mensagem Service Bus
     * Adiciona timestamp de atualização
     */
    @Mapping(target = "updatedAt", expression = "java(getCurrentTimestamp())")
    AccountStatusMessage toMessage(AccountStatus accountStatus);
    
    /**
     * Retorna timestamp atual em formato ISO-8601
     */
    default String getCurrentTimestamp() {
        return Instant.now().toString();
    }
}
```

### Messaging Configuration

```java
package br.com.bradesco.account.adapter.output.config;

import com.azure.messaging.servicebus.ServiceBusClientBuilder;
import com.azure.messaging.servicebus.ServiceBusSenderClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração do Azure Service Bus Producer
 */
@Configuration
public class MessagingConfig {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(MessagingConfig.class);
    
    @Value("${servicebus.connectionString}")
    private String connectionString;
    
    @Value("${servicebus.queueName}")
    private String queueName;
    
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
     * ServiceBusSenderClient para enviar mensagens
     * Configurado para a fila específica
     */
    @Bean
    public ServiceBusSenderClient serviceBusSenderClient(ServiceBusClientBuilder builder) {
        LOGGER.info("Creating Service Bus sender client for queue: {}", queueName);
        return builder
                .sender()
                .queueName(queueName)
                .buildClient();
    }
}
```

### Service Bus Producer (Implementação do OutputPort)

```java
package br.com.bradesco.account.adapter.output.servicebus.producer;

import br.com.bradesco.account.adapter.output.servicebus.producer.dto.AccountStatusMessage;
import br.com.bradesco.account.adapter.output.servicebus.producer.mapper.AccountMessageMapper;
import br.com.bradesco.account.core.domain.model.AccountStatus;
import br.com.bradesco.account.port.output.AccountStatusMessagePort;
import com.azure.messaging.servicebus.ServiceBusMessage;
import com.azure.messaging.servicebus.ServiceBusSenderClient;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.UUID;

/**
 * Producer Service Bus que implementa o OutputPort
 * Envia mensagens de status de conta para fila do Service Bus
 */
@Component
public class AccountStatusMessageProducer implements AccountStatusMessagePort {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(AccountStatusMessageProducer.class);
    
    private final ServiceBusSenderClient sender;
    private final AccountMessageMapper mapper;
    private final ObjectMapper objectMapper;
    
    public AccountStatusMessageProducer(
            ServiceBusSenderClient sender,
            AccountMessageMapper mapper,
            ObjectMapper objectMapper) {
        this.sender = sender;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }
    
    @Override
    public void sendStatusUpdate(AccountStatus accountStatus) {
        try {
            // 1. Converter domínio para mensagem Service Bus
            AccountStatusMessage message = mapper.toMessage(accountStatus);
            
            // 2. Serializar para JSON
            String jsonPayload = objectMapper.writeValueAsString(message);
            
            // 3. Criar ServiceBusMessage com propriedades
            ServiceBusMessage serviceBusMessage = new ServiceBusMessage(jsonPayload)
                    .setMessageId(UUID.randomUUID().toString())
                    .setContentType("application/json")
                    .setTimeToLive(Duration.ofHours(24));
            
            // 4. Adicionar propriedades customizadas
            serviceBusMessage.getApplicationProperties().put("accountId", accountStatus.getAccountId());
            serviceBusMessage.getApplicationProperties().put("status", accountStatus.getStatus());
            serviceBusMessage.getApplicationProperties().put("eventType", "AccountStatusUpdated");
            
            LOGGER.info("Sending account status message - accountId: {} - status: {}", 
                       accountStatus.getAccountId(), accountStatus.getStatus());
            
            // 5. Enviar mensagem
            sender.sendMessage(serviceBusMessage);
            
            LOGGER.info("Account status message sent successfully - accountId: {} - messageId: {}", 
                       accountStatus.getAccountId(), serviceBusMessage.getMessageId());
            
        } catch (JsonProcessingException e) {
            LOGGER.error("Error serializing message - accountId: {}", 
                        accountStatus.getAccountId(), e);
            throw new RuntimeException("Falha ao serializar mensagem", e);
            
        } catch (Exception e) {
            LOGGER.error("Error sending message to Service Bus - accountId: {}", 
                        accountStatus.getAccountId(), e);
            throw new RuntimeException("Falha ao enviar mensagem para Service Bus", e);
        }
    }
}
```

### Producer com Batch Send (Opcional)

```java
package br.com.bradesco.account.adapter.output.servicebus.producer;

import com.azure.messaging.servicebus.ServiceBusMessage;
import com.azure.messaging.servicebus.ServiceBusMessageBatch;
import com.azure.messaging.servicebus.ServiceBusSenderClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Producer com suporte a envio em lote
 */
@Component
public class BatchMessageProducer {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(BatchMessageProducer.class);
    
    private final ServiceBusSenderClient sender;
    
    public BatchMessageProducer(ServiceBusSenderClient sender) {
        this.sender = sender;
    }
    
    /**
     * Envia múltiplas mensagens em um único lote
     * Mais eficiente para grandes volumes
     */
    public void sendBatch(List<AccountStatusMessage> messages) {
        try {
            // Criar batch
            ServiceBusMessageBatch batch = sender.createMessageBatch();
            
            int addedCount = 0;
            
            for (AccountStatusMessage message : messages) {
                String json = objectMapper.writeValueAsString(message);
                ServiceBusMessage serviceBusMessage = new ServiceBusMessage(json);
                
                // Tentar adicionar ao batch
                if (batch.tryAddMessage(serviceBusMessage)) {
                    addedCount++;
                } else {
                    // Batch cheio, enviar e criar novo
                    sender.sendMessages(batch);
                    LOGGER.info("Batch sent with {} messages", addedCount);
                    
                    batch = sender.createMessageBatch();
                    batch.tryAddMessage(serviceBusMessage);
                    addedCount = 1;
                }
            }
            
            // Enviar batch final
            if (addedCount > 0) {
                sender.sendMessages(batch);
                LOGGER.info("Final batch sent with {} messages", addedCount);
            }
            
        } catch (Exception e) {
            LOGGER.error("Error sending batch messages", e);
            throw new RuntimeException("Falha ao enviar mensagens em lote", e);
        }
    }
}
```

## 6. Configuration

### UseCase Config

```java
package br.com.bradesco.account.config;

import br.com.bradesco.account.core.usecase.UpdateAccountStatusUseCase;
import br.com.bradesco.account.port.input.UpdateAccountStatusInputPort;
import br.com.bradesco.account.port.output.AccountStatusMessagePort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração de casos de uso
 * Injeta dependências (OutputPorts)
 */
@Configuration
public class UseCaseConfig {
    
    @Bean
    public UpdateAccountStatusInputPort updateAccountStatusInputPort(
            AccountStatusMessagePort messagePort) {
        return new UpdateAccountStatusUseCase(messagePort);
    }
}
```

## 7. Application Properties

### application.yml

```yaml
servicebus:
  connectionString: '${MY_SB_CONNECTION_STRING:Endpoint=sb://my-namespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=YOUR_KEY;}'
  queueName: '${MY_QUEUE:account-status-queue}'

info:
  app:
    name: 'account-service'

logging:
  level:
    com.azure.messaging.servicebus: DEBUG
    br.com.bradesco.account: DEBUG
```

### application-local.yml (Desenvolvimento Local com Azurite)

```yaml
servicebus:
  connectionString: 'UseDevelopmentStorage=true'
  queueName: 'account-status-queue'
```

## 8. Controller (Input Adapter)

```java
package br.com.bradesco.account.adapter.input.controller;

import br.com.bradesco.account.adapter.input.controller.dto.request.UpdateAccountStatusRequest;
import br.com.bradesco.account.adapter.input.controller.dto.response.AccountStatusResponse;
import br.com.bradesco.account.adapter.input.controller.mapper.AccountControllerMapper;
import br.com.bradesco.account.core.domain.model.AccountStatus;
import br.com.bradesco.account.port.input.UpdateAccountStatusInputPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
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
    
    private final UpdateAccountStatusInputPort updateAccountStatusInputPort;
    private final AccountControllerMapper mapper;
    
    public AccountController(
            UpdateAccountStatusInputPort updateAccountStatusInputPort,
            AccountControllerMapper mapper) {
        this.updateAccountStatusInputPort = updateAccountStatusInputPort;
        this.mapper = mapper;
    }
    
    @PutMapping("/{accountId}/status")
    public ResponseEntity<AccountStatusResponse> updateStatus(
            @PathVariable String accountId,
            @RequestBody UpdateAccountStatusRequest request) {
        
        log.info("Updating account status - accountId: {} - newStatus: {}", 
                accountId, request.status());
        
        AccountStatus accountStatus = updateAccountStatusInputPort.execute(
            accountId,
            request.status(),
            request.reason(),
            request.updatedBy()
        );
        
        AccountStatusResponse response = mapper.toResponse(accountStatus);
        
        return ResponseEntity.ok(response);
    }
}
```

## Boas Práticas

1. ✅ **Use MessageId** para rastreabilidade
2. ✅ **Configure TimeToLive** para evitar mensagens antigas
3. ✅ **Adicione Application Properties** para filtros e roteamento
4. ✅ **Use MapStruct** para mapear domínio → mensagem
5. ✅ **Implemente logging** detalhado de sucesso/erro
6. ✅ **Trate exceções** adequadamente
7. ✅ **Isole o domínio** - UseCase não conhece Service Bus
8. ✅ **Use batch send** para grandes volumes
9. ✅ **Configure retry policies** no Service Bus
10. ✅ **Monitore DLQ** regularmente

## Recursos Adicionais

- [Azure Service Bus Java SDK](https://learn.microsoft.com/en-us/java/api/com.azure.messaging.servicebus)
- [Service Bus Best Practices](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-performance-improvements)
- [Message Properties](https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messages-payloads)
