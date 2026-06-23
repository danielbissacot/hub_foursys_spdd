---
name: springboot-service-bus
description: Implementa producers e consumers do Azure Service Bus em projetos Spring Boot usando Azure Java SDK. Use quando precisar implementar mensageria assíncrona, processamento de filas, ou integração com Azure Service Bus seguindo padrões de resiliência e arquitetura hexagonal.
metadata:
  version: "0.0.1"
---

# Spring Boot Azure Service Bus

Este skill fornece instruções detalhadas para implementar producers e consumers do Azure Service Bus em projetos Spring Boot usando Azure Java SDK seguindo arquitetura hexagonal e padrões de resiliência.

## Quando usar este skill

Use este skill quando:
- Precisar produzir mensagens para filas do Azure Service Bus
- Implementar consumidores de mensagens do Service Bus
- Configurar estratégias de retry e dead-letter queue
- Seguir arquitetura hexagonal com mensageria assíncrona
- Implementar resiliência em processamento de mensagens
- Integrar com Azure Service Bus (plataforma de mensageria gerenciada da Azure)

## Pré-Requisitos

- **JDK 17** ou superior
- **Maven**
- **Spring Boot 3.x.x**
- **Azure Service Bus** namespace configurado
- **Connection String** do Azure Service Bus

## Dependências necessárias

### Dependency Management (Bill of Materials)

Adicione o Azure SDK BOM no `pom.xml` para gerenciar versões automaticamente:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-sdk-bom</artifactId>
            <version>1.2.29</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### Dependência Principal

Com o dependency management configurado, adicione a dependência (sem especificar versão):

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-messaging-servicebus</artifactId>
</dependency>
```

## Estrutura na Arquitetura Hexagonal

Para implementação de Producers e Consumers do Azure Service Bus em arquitetura hexagonal, siga os princípios de isolamento entre camadas:

### Producer (Output)
- **OutputPort** (`port/output/`): Define contratos em linguagem de domínio para envio de mensagens
- **Producer Adapter** (`adapter/output/servicebus/producer/`): Implementa OutputPort usando Service Bus Sender
- **Message DTOs** (`adapter/output/servicebus/producer/dto/`): Estruturas de mensagens Service Bus
- **Mapper** (`adapter/output/servicebus/producer/mapper/`): Traduz entre domínio e mensagens Service Bus

**📖 Consulte**: [references/SERVICE_BUS_PRODUCER_INTEGRATION.md](references/SERVICE_BUS_PRODUCER_INTEGRATION.md) para estrutura detalhada com exemplos

### Consumer (Input)
- **InputPort** (`port/input/`): Define casos de uso que processam mensagens
- **Consumer Adapter** (`adapter/input/servicebus/consumer/`): Escuta filas e processa mensagens
- **Message DTOs** (`adapter/input/servicebus/consumer/dto/`): Estruturas de mensagens recebidas
- **Mapper** (`adapter/input/servicebus/consumer/mapper/`): Traduz mensagens Service Bus para domínio

**📖 Consulte**: [references/SERVICE_BUS_CONSUMER_INTEGRATION.md](references/SERVICE_BUS_CONSUMER_INTEGRATION.md) para estrutura detalhada com exemplos

## Configuração do Azure Service Bus

### Propriedades Comuns (application.yml)

> **⚠️ IMPORTANTE**: A connection string abaixo é apenas um exemplo. Em produção, use Azure Key Vault para armazenar credenciais.

```yaml
servicebus:
  connectionString: '${MY_SB_CONNECTION_STRING:Endpoint=sb://my-sb-namespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;}'
  queueName: '${MY_QUEUE:queue-name}'
```

### Connection String

A connection string do Azure Service Bus segue o formato:

```
Endpoint=sb://<namespace>.servicebus.windows.net/;SharedAccessKeyName=<keyname>;SharedAccessKey=<keyvalue>;
```

**Como obter**:
1. Acesse o Azure Portal
2. Navegue até seu Service Bus Namespace
3. Em "Shared access policies", selecione a política desejada
4. Copie a "Primary Connection String"

## Service Bus Producer

Para implementar um **Producer** que envia mensagens para filas do Azure Service Bus:

**📖 Consulte**: [references/SERVICE_BUS_PRODUCER_INTEGRATION.md](references/SERVICE_BUS_PRODUCER_INTEGRATION.md)

### Configurações essenciais:

```java
@Bean
public ServiceBusSenderClient sender(ServiceBusClientBuilder builder) {
    return builder
        .connectionString(connectionString)
        .sender()
        .queueName(queueName)
        .buildClient();
}
```

### Componentes principais:

1. **MessagingConfig** - Configuração do `ServiceBusSenderClient`
2. **Message DTO** - Estrutura da mensagem
3. **Producer** - Implementa OutputPort e envia mensagens
4. **ObjectMapper** - Serialização JSON

### Exemplo básico:

```java
@Component
public class AccountMessageProducer implements MessagePort {
    
    private final ServiceBusSenderClient sender;
    private final ObjectMapper objectMapper;
    
    @Override
    public void sendMessage(AccountMessage message) {
        String json = objectMapper.writeValueAsString(message);
        sender.sendMessage(new ServiceBusMessage(json));
    }
}
```

## Service Bus Consumer

Para implementar um **Consumer** que escuta e processa mensagens de filas do Azure Service Bus:

**📖 Consulte**: [references/SERVICE_BUS_CONSUMER_INTEGRATION.md](references/SERVICE_BUS_CONSUMER_INTEGRATION.md)

### Configurações essenciais:

```java
@Bean
public ServiceBusProcessorClient processorClient(ServiceBusClientBuilder builder) {
    return builder
        .connectionString(connectionString)
        .processor()
        .queueName(queueName)
        .processMessage(consumer::onMessage)
        .processError(consumer::onError)
        .buildProcessorClient();
}
```

### Componentes principais:

1. **MessagingConfig** - Configuração do `ServiceBusProcessorClient`
2. **BaseConsumer** - Classe abstrata base para consumers
3. **Consumer** - Implementa `onMessage` e `onError`
4. **Lifecycle** - Inicia/para o consumer com `@EventListener`

### Exemplo básico:

```java
@Component
public class AccountConsumer extends BaseConsumer<AccountMessage> {
    
    @Override
    public void onMessage(ServiceBusReceivedMessageContext context) {
        ServiceBusReceivedMessage message = context.getMessage();
        AccountMessage account = convertToObject(message.getBody().toString(), AccountMessage.class);
        
        // Processar mensagem e chamar casos de uso
    }
    
    @Override
    public void onError(ServiceBusErrorContext context) {
        LOGGER.error("Error processing message", context.getException());
    }
}
```

### Inicialização do Consumer

O consumer deve ser iniciado quando a aplicação estiver pronta:

```java
@SpringBootApplication
public class Application {
    
    @Autowired
    private ServiceBusProcessorClient processorClient;
    
    @EventListener
    public void onApplicationReady(ApplicationReadyEvent event) {
        processorClient.start();
    }
    
    @EventListener
    public void onContextClosed(ContextClosedEvent event) {
        processorClient.close();
    }
}
```

## Tratamento de Erros e Dead-Letter Queue

### Dead-Letter Queue (DLQ)

O Azure Service Bus possui suporte nativo para Dead-Letter Queue. Mensagens que falharam após N tentativas são automaticamente movidas para a DLQ.

### Configuração de Retry

As políticas de retry podem ser configuradas no Service Bus Namespace (via Azure Portal):

- **Max Delivery Count**: Número máximo de tentativas (padrão: 10)
- **Lock Duration**: Tempo de lock da mensagem (padrão: 1 minuto)
- **Message Time to Live**: TTL da mensagem

### Processar mensagens da DLQ

Para processar mensagens da Dead-Letter Queue:

```java
@Bean
public ServiceBusProcessorClient dlqProcessorClient(ServiceBusClientBuilder builder) {
    return builder
        .connectionString(connectionString)
        .processor()
        .queueName(queueName)
        .subQueue(SubQueue.DEAD_LETTER_QUEUE)  // Processa DLQ
        .processMessage(dlqConsumer::onMessage)
        .processError(dlqConsumer::onError)
        .buildProcessorClient();
}
```

## Recursos Avançados

### Sessões (Sessions)

Para processamento ordenado de mensagens:

```java
@Bean
public ServiceBusProcessorClient sessionProcessorClient(ServiceBusClientBuilder builder) {
    return builder
        .connectionString(connectionString)
        .sessionProcessor()
        .queueName(queueName)
        .maxConcurrentSessions(5)
        .processMessage(consumer::onMessage)
        .processError(consumer::onError)
        .buildProcessorClient();
}
```

### Batch Send

Para envio em lote:

```java
ServiceBusMessageBatch batch = sender.createMessageBatch();

for (AccountMessage message : messages) {
    batch.tryAddMessage(new ServiceBusMessage(objectMapper.writeValueAsString(message)));
}

sender.sendMessages(batch);
```

### Message Properties

Adicione propriedades customizadas às mensagens:

```java
ServiceBusMessage message = new ServiceBusMessage(json)
    .setMessageId(UUID.randomUUID().toString())
    .setSessionId(accountId)
    .setContentType("application/json")
    .setTimeToLive(Duration.ofHours(24));
    
message.getApplicationProperties().put("priority", "high");
message.getApplicationProperties().put("source", "account-service");

sender.sendMessage(message);
```

### Azure Monitor

Configure Azure Monitor para:
- Alertas de mensagens na DLQ
- Alertas de erros no processamento
- Dashboards de throughput
- Rastreamento de mensagens

## Segurança

### Key Vault Integration

Armazene a connection string no Azure Key Vault:

```yaml
spring:
  cloud:
    azure:
      keyvault:
        secret:
          endpoint: https://my-keyvault.vault.azure.net/

servicebus:
  connectionString: '${MY_SB_CONNECTION_STRING}'
```

## Referências Completas

- **[SERVICE_BUS_PRODUCER_INTEGRATION.md](references/SERVICE_BUS_PRODUCER_INTEGRATION.md)** - Implementação completa de Producer em arquitetura hexagonal
- **[SERVICE_BUS_CONSUMER_INTEGRATION.md](references/SERVICE_BUS_CONSUMER_INTEGRATION.md)** - Implementação completa de Consumer em arquitetura hexagonal

## Recursos Adicionais

- [Azure Service Bus Java SDK](https://learn.microsoft.com/en-us/java/api/com.azure.messaging.servicebus)
- [Azure Service Bus Documentation](https://learn.microsoft.com/en-us/azure/service-bus-messaging/)
- [Exemplo de Código](https://bitbucket.bradesco.com.br:8443/projects/ESCP/repos/ensc-srv-kit-java/browse?at=refs%2Fheads%2Ffeature%2Fservicebus-sdk-example)
