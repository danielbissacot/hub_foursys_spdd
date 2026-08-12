---
name: 'springboot-service-bus'
description: "Implementa mensageria corporativa com Azure Service Bus no padrão Hexagonal. Cobre ServiceBusSenderClient para envio, @ServiceBusListener para recebimento, filas, tópicos/assinaturas, Dead Letter Queue, sessões e retry automático. Use quando a história precisar de mensageria confiável com garantias de entrega, ordem ou sessão — distinto do Kafka para streaming de alto volume."
metadata:
  version: "0.1.0"
---

# Skill: springboot-service-bus

Guia completo para implementar **mensageria com Azure Service Bus** em projetos Java 21 + Spring Boot 3.x com Arquitetura Hexagonal.

> **Invocado por:** `foursys-specify-tech.md` Spring Boot quando a história requer mensageria corporativa com garantias de entrega via Azure Service Bus.

---

## Quando usar

- Integração entre serviços com garantias de entrega (at-least-once).
- Processamento ordenado por sessão (ex: eventos de um mesmo cliente em sequência).
- Filas com prazo de vida (TTL), agendamento de mensagens, Dead Letter Queue nativa.
- Quando o barramento corporativo Azure é o padrão da empresa (vs Kafka para streaming de volume).

## Quando não usar

- Streaming de alto volume e baixa latência → use `springboot-kafka`.
- Comunicação síncrona → use `springboot-feign-client` ou `springboot-rest-client`.

---

## Estrutura de Arquivos (Hexagonal)

```
adapter/output/servicebus/
├── <Dominio>ServiceBusSenderAdapter.java   ← Implementa OutputPort de envio
└── dto/
    └── <Dominio>Message.java               ← Record da mensagem

adapter/input/servicebus/
└── <Dominio>ServiceBusConsumer.java        ← @ServiceBusListener — aciona UseCase
```

---

## Implementação

### 1. Dependência (pom.xml)

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-servicebus-jms</artifactId>
</dependency>
<!-- Ou para uso direto do SDK sem JMS: -->
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-starter-servicebus</artifactId>
</dependency>
```

---

### 2. Configuração (application.yml)

```yaml
spring:
  cloud:
    azure:
      servicebus:
        connection-string: ${AZURE_SERVICEBUS_CONNECTION_STRING}
        entity-type: queue  # ou topic

servicebus:
  queues:
    pagamento-entrada: ${SERVICEBUS_QUEUE_PAGAMENTO_ENTRADA:pagamento-entrada}
    pagamento-saida: ${SERVICEBUS_QUEUE_PAGAMENTO_SAIDA:pagamento-saida}
    dlq-suffix: "$DeadLetterQueue"
  max-concurrent-calls: 1
  max-auto-lock-renew-duration: 5m
```

---

### 3. Mensagem (Record Java 21)

```java
// FILEPATH: adapter/output/servicebus/dto/PagamentoMessage.java
public record PagamentoMessage(
    String messageId,          // UUID para correlação e idempotência
    String codigoOperacao,
    BigDecimal valor,          // SEMPRE BigDecimal
    String contaOrigem,
    String tipo,               // CREDITO | DEBITO
    LocalDateTime enviadoEm
) {
    public static PagamentoMessage of(Pagamento pagamento) {
        return new PagamentoMessage(
            UUID.randomUUID().toString(),
            pagamento.codigoOperacao(),
            pagamento.valor(),
            pagamento.contaOrigem(),
            pagamento.tipo().name(),
            LocalDateTime.now()
        );
    }
}
```

---

### 4. Sender (OutputPort)

```java
// FILEPATH: adapter/output/servicebus/PagamentoServiceBusSenderAdapter.java
@Component
@RequiredArgsConstructor
@Slf4j
public class PagamentoServiceBusSenderAdapter implements PagamentoEnvioOutputPort {

    private final ServiceBusSenderClient senderClient;

    @Value("${servicebus.queues.pagamento-saida}")
    private String filaDestino;

    @Override
    public void enviarPagamento(Pagamento pagamento) {
        var mensagem = PagamentoMessage.of(pagamento);
        var serviceBusMessage = new ServiceBusMessage(serializarJson(mensagem))
            .setMessageId(mensagem.messageId())
            .setCorrelationId(mensagem.codigoOperacao())
            .setContentType("application/json");

        senderClient.sendMessage(serviceBusMessage);
        log.info("Mensagem enviada ao Service Bus. operacao={} messageId={}",
            mensagem.codigoOperacao(), mensagem.messageId());
    }

    private String serializarJson(Object objeto) {
        try {
            return new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .writeValueAsString(objeto);
        } catch (JsonProcessingException ex) {
            throw new SerializacaoException("Falha ao serializar mensagem", ex);
        }
    }
}
```

---

### 5. Consumer com @ServiceBusListener

```java
// FILEPATH: adapter/input/servicebus/PagamentoServiceBusConsumer.java
@Component
@RequiredArgsConstructor
@Slf4j
public class PagamentoServiceBusConsumer {

    private final ProcessarPagamentoInputPort processarPagamentoUseCase;

    @ServiceBusListener(
        destination = "${servicebus.queues.pagamento-entrada}",
        concurrency = "${servicebus.max-concurrent-calls}"
    )
    public void processar(ServiceBusReceivedMessageContext context) {
        var mensagem = context.getMessage();
        try {
            var payload = deserializarJson(mensagem.getBody().toString(), PagamentoMessage.class);
            log.info("Mensagem recebida. operacao={} messageId={}", payload.codigoOperacao(), payload.messageId());

            processarPagamentoUseCase.processar(payload.codigoOperacao(), payload.valor());
            context.complete();

        } catch (PagamentoInvalidoException ex) {
            log.error("Mensagem inválida — enviando para DLQ. messageId={}", mensagem.getMessageId());
            context.deadLetter(new DeadLetterOptions()
                .setDeadLetterReason("PAYLOAD_INVALIDO")
                .setDeadLetterErrorDescription(ex.getMessage()));

        } catch (Exception ex) {
            log.error("Erro temporário — abandonando para retry. messageId={}", mensagem.getMessageId());
            context.abandon();
        }
    }
}
```

---

### 6. Configuração do Client (Bean)

```java
// FILEPATH: config/ServiceBusConfig.java
@Configuration
public class ServiceBusConfig {

    @Value("${spring.cloud.azure.servicebus.connection-string}")
    private String connectionString;

    @Value("${servicebus.queues.pagamento-saida}")
    private String filaPagamentoSaida;

    @Bean
    public ServiceBusSenderClient pagamentoSenderClient() {
        return new ServiceBusClientBuilder()
            .connectionString(connectionString)
            .sender()
            .queueName(filaPagamentoSaida)
            .buildClient();
    }
}
```

---

## Sessões (Processamento Ordenado)

Para garantir ordem por cliente/conta:
```java
serviceBusMessage.setSessionId(pagamento.contaOrigem()); // agrupa por conta
```

O consumer deve habilitar `sessionEnabled = true` para processar sessões em ordem.

---

## Segurança

- **NUNCA** exponha a `connection-string` em logs.
- Use **Managed Identity** em produção.
- Valide o `messageId` para idempotência antes de acionar o UseCase.

---

## Checklist de Implementação

- [ ] Dependência `spring-cloud-azure-starter-servicebus` adicionada
- [ ] `AZURE_SERVICEBUS_CONNECTION_STRING` como variável de ambiente
- [ ] Nomes de filas/tópicos configurados como variáveis de ambiente
- [ ] Mensagem como Record Java 21 com `messageId` UUID
- [ ] Adapter sender implementando `OutputPort`
- [ ] Consumer com `@ServiceBusListener` e tratamento de DLQ
- [ ] `@Bean` do `ServiceBusSenderClient` em `config/`
- [ ] `@Bean` do Adapter registrado em `config/`
- [ ] Idempotência via `messageId` antes de acionar UseCase
- [ ] Testes unitários com mock do `ServiceBusSenderClient` (cobertura ≥ 95%)
- [ ] Nenhum dado PII em logs de mensagem
