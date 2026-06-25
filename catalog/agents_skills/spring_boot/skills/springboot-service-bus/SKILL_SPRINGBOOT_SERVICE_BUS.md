---
name: springboot-service-bus
description: Implementa mensageria assíncrona com Azure Service Bus em Spring Boot com Arquitetura Hexagonal. Use como alternativa ao Kafka para mensageria point-to-point (Queue) ou publish-subscribe (Topic), com suporte a DLQ e retry automático.
metadata:
  version: "0.0.1"
---

# Spring Boot — Azure Service Bus

Implemente mensageria assíncrona com Azure Service Bus seguindo Arquitetura Hexagonal. Ideal para integração com sistemas Azure nativos ou quando Kafka não está disponível.

## Quando Usar Service Bus vs Kafka

| Critério | Service Bus | Kafka |
|----------|-------------|-------|
| Volume | Moderado (< 1M msg/dia) | Alto (> 1M msg/dia) |
| Retenção | Até 14 dias | Longo prazo configurável |
| Entidade | Queue (point-to-point) / Topic (pub-sub) | Topic (sempre pub-sub) |
| Gerenciamento | Fully managed Azure | Confluent Cloud / self-managed |

## Dependência (pom.xml)

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-servicebus</artifactId>
</dependency>
```

## Configuração

```yaml
spring:
  cloud:
    azure:
      servicebus:
        connection-string: ${SERVICEBUS_CONNECTION_STRING}
        entity-name: ${SERVICEBUS_QUEUE_NAME}
        entity-type: queue  # ou topic

# Retry automático
spring.cloud.azure.servicebus.producer.retry.max-retries: 3
spring.cloud.azure.servicebus.consumer.max-concurrent-calls: 10
```

## OutputPort (Hexagonal)

```java
// port/output/MensageriaOutputPort.java
public interface MensageriaOutputPort {
    void publicar(Object evento);
    void publicarComDelay(Object evento, Duration delay);
}
```

## Producer Adapter

```java
// adapter/output/servicebus/ServiceBusProducerAdapter.java
@Component
@RequiredArgsConstructor
@Slf4j
public class ServiceBusProducerAdapter implements MensageriaOutputPort {

    private final ServiceBusSenderClient senderClient;
    private final ObjectMapper objectMapper;

    @Override
    public void publicar(Object evento) {
        try {
            String payload = objectMapper.writeValueAsString(evento);
            ServiceBusMessage message = new ServiceBusMessage(payload)
                    .setContentType("application/json")
                    .setMessageId(UUID.randomUUID().toString());

            senderClient.sendMessage(message);
            log.info("Mensagem publicada: tipo={}, id={}", evento.getClass().getSimpleName(), message.getMessageId());
        } catch (JsonProcessingException e) {
            throw new MensageriaException("Falha ao serializar evento: " + e.getMessage(), e);
        }
    }

    @Override
    public void publicarComDelay(Object evento, Duration delay) {
        try {
            String payload = objectMapper.writeValueAsString(evento);
            ServiceBusMessage message = new ServiceBusMessage(payload)
                    .setScheduledEnqueueTime(OffsetDateTime.now().plus(delay));
            senderClient.scheduleMessage(message, message.getScheduledEnqueueTime());
        } catch (JsonProcessingException e) {
            throw new MensageriaException("Falha ao serializar evento com delay", e);
        }
    }
}
```

## Consumer (InputPort via @ServiceBusListener)

```java
// adapter/input/consumer/PedidoCriadoConsumer.java
@Component
@RequiredArgsConstructor
@Slf4j
public class PedidoCriadoConsumer {

    private final ProcessarPedidoInputPort processarPedidoUseCase;
    private final ObjectMapper objectMapper;

    @ServiceBusListener(destination = "${servicebus.queue.pedidos}")
    public void consumir(ServiceBusReceivedMessageContext context) {
        ServiceBusReceivedMessage message = context.getMessage();
        try {
            PedidoCriadoEvent evento = objectMapper.readValue(
                    message.getBody().toString(), PedidoCriadoEvent.class);

            log.info("Mensagem recebida: id={}, tipo=PedidoCriadoEvent", message.getMessageId());
            processarPedidoUseCase.executar(evento);
            context.complete();

        } catch (Exception e) {
            log.error("Falha ao processar mensagem id={}: {}", message.getMessageId(), e.getMessage());
            context.abandon();  // Devolve para fila — retry automático até maxDeliveryCount
        }
    }
}
```

## Dead Letter Queue (DLQ)

```java
// Mensagens que ultrapassam maxDeliveryCount vão para DLQ automaticamente.
// Consumer dedicado para DLQ:
@ServiceBusListener(destination = "${servicebus.queue.pedidos}/$deadletterqueue")
public void consumirDLQ(ServiceBusReceivedMessageContext context) {
    ServiceBusReceivedMessage message = context.getMessage();
    log.error("DLQ: mensagem não processada após {} tentativas. id={}",
            message.getDeliveryCount(), message.getMessageId());
    // Registrar no banco de dados para análise manual
    dlqRegistroOutputPort.registrar(message.getMessageId(), message.getBody().toString(),
            message.getDeadLetterReason());
    context.complete();
}
```

## Bean Configuration

```java
@Configuration
public class ServiceBusConfig {

    @Value("${spring.cloud.azure.servicebus.connection-string}")
    private String connectionString;

    @Value("${spring.cloud.azure.servicebus.entity-name}")
    private String entityName;

    @Bean
    public ServiceBusSenderClient serviceBusSenderClient() {
        return new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .sender()
                .queueName(entityName)
                .buildClient();
    }
}
```
