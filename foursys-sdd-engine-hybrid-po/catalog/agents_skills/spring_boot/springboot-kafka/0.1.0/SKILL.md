---
name: 'springboot-kafka'
description: "Implementa produtores e consumidores Kafka no padrão Hexagonal. Cobre KafkaTemplate para produção, @KafkaListener para consumo, Dead Letter Queue (DLQ), idempotência com chave de mensagem, retry policy e configuração completa via application.yml. Use quando a história precisar de mensageria assíncrona event-driven com Kafka/Confluent."
metadata:
  version: "0.1.0"
---

# Skill: springboot-kafka

Guia completo para implementar **produtores e consumidores Kafka** em projetos Java 21 + Spring Boot 3.x com Arquitetura Hexagonal.

> **Invocado por:** `foursys-specify-tech.md` Spring Boot quando a história requer mensageria assíncrona via Kafka.

---

## Quando usar

- A história precisa publicar eventos de domínio de forma assíncrona (fire-and-forget ou event-driven).
- A história precisa consumir eventos de outros serviços ou do barramento corporativo.
- Integração com **Confluent Kafka** (on-prem ou Azure Event Hubs com protocolo Kafka).

## Quando não usar

- Chamadas síncronas com resposta imediata → use `springboot-feign-client` ou `springboot-rest-client`.
- Notificações/alertas pontuais via mensageria Azure → use `springboot-service-bus`.

---

## Estrutura de Arquivos (Hexagonal)

```
adapter/output/producer/
├── <Dominio>EventProducer.java         ← Implementa OutputPort de publicação
└── dto/
    └── <Dominio>Event.java             ← Record do evento (payload)

adapter/input/consumer/
├── <Dominio>EventConsumer.java         ← @KafkaListener — aciona UseCase via InputPort
└── dto/
    └── <Dominio>EventPayload.java      ← Record de deserialização
```

---

## Implementação

### 1. Dependência (pom.xml)

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

---

### 2. Configuração (application.yml)

```yaml
spring:
  kafka:
    bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
      acks: all
      retries: 3
      properties:
        enable.idempotence: true
        max.in.flight.requests.per.connection: 1
    consumer:
      group-id: ${KAFKA_CONSUMER_GROUP:foursys-service}
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "br.com.foursys.*"
    listener:
      ack-mode: MANUAL_IMMEDIATE

topics:
  pagamento:
    criado: ${TOPIC_PAGAMENTO_CRIADO:pagamento.criado.v1}
    processado: ${TOPIC_PAGAMENTO_PROCESSADO:pagamento.processado.v1}
    dlq: ${TOPIC_PAGAMENTO_DLQ:pagamento.dlq.v1}
```

---

### 3. Evento (Record Java 21)

```java
// FILEPATH: adapter/output/producer/dto/PagamentoCriadoEvent.java
public record PagamentoCriadoEvent(
    String eventId,            // UUID para idempotência
    String codigoOperacao,
    BigDecimal valor,          // SEMPRE BigDecimal
    String contaOrigem,
    LocalDateTime ocorridoEm
) {
    public static PagamentoCriadoEvent of(Pagamento pagamento) {
        return new PagamentoCriadoEvent(
            UUID.randomUUID().toString(),
            pagamento.codigoOperacao(),
            pagamento.valor(),
            pagamento.contaOrigem(),
            LocalDateTime.now()
        );
    }
}
```

---

### 4. Producer (OutputPort)

```java
// FILEPATH: adapter/output/producer/PagamentoEventProducer.java
@Component
@RequiredArgsConstructor
@Slf4j
public class PagamentoEventProducer implements PagamentoPublicacaoOutputPort {

    private final KafkaTemplate<String, PagamentoCriadoEvent> kafkaTemplate;

    @Value("${topics.pagamento.criado}")
    private String topicoPagamentoCriado;

    @Override
    public void publicarPagamentoCriado(Pagamento pagamento) {
        var evento = PagamentoCriadoEvent.of(pagamento);
        kafkaTemplate.send(topicoPagamentoCriado, evento.codigoOperacao(), evento)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Falha ao publicar evento pagamento criado. operacao={}", evento.codigoOperacao());
                    throw new EventoPublicacaoException("Falha ao publicar evento de pagamento criado");
                }
                log.info("Evento pagamento criado publicado. operacao={} offset={}",
                    evento.codigoOperacao(), result.getRecordMetadata().offset());
            });
    }
}
```

---

### 5. Consumer com DLQ

```java
// FILEPATH: adapter/input/consumer/PagamentoEventConsumer.java
@Component
@RequiredArgsConstructor
@Slf4j
public class PagamentoEventConsumer {

    private final ProcessarPagamentoInputPort processarPagamentoUseCase;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${topics.pagamento.dlq}")
    private String topicoDlq;

    @KafkaListener(topics = "${topics.pagamento.processado}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumir(
            @Payload PagamentoEventPayload payload,
            @Header(KafkaHeaders.RECEIVED_KEY) String chave,
            Acknowledgment ack) {
        try {
            log.info("Evento recebido. operacao={}", payload.codigoOperacao());
            processarPagamentoUseCase.processar(payload.codigoOperacao(), payload.protocolo());
            ack.acknowledge();
        } catch (PagamentoInvalidoException ex) {
            log.error("Evento inválido — enviando para DLQ. operacao={}", payload.codigoOperacao());
            kafkaTemplate.send(topicoDlq, chave, payload);
            ack.acknowledge(); // não reprocessar
        } catch (Exception ex) {
            log.error("Erro temporário — não confirmando para retry. operacao={}", payload.codigoOperacao());
            // não faz ack → Kafka reprocessa
        }
    }
}
```

---

### 6. Configuração de Retry + DLQ (KafkaConfig)

```java
// FILEPATH: config/KafkaConsumerConfig.java
@Configuration
public class KafkaConsumerConfig {

    @Bean
    public DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> kafkaTemplate) {
        var dlqPublisher = new DeadLetterPublishingRecoverer(kafkaTemplate);
        var backoff = new FixedBackOff(1000L, 3L); // 3 tentativas, 1s entre cada
        return new DefaultErrorHandler(dlqPublisher, backoff);
    }
}
```

---

## Idempotência

- Sempre inclua `eventId` (UUID) no payload do evento.
- O consumer deve verificar se o `eventId` já foi processado antes de executar o UseCase.
- Armazene IDs processados em Redis (TTL = 24h) ou tabela de controle de idempotência.

```java
// Exemplo de verificação de idempotência
if (idempotenciaPort.jaProcessado(payload.eventId())) {
    log.warn("Evento duplicado ignorado. eventId={}", payload.eventId());
    ack.acknowledge();
    return;
}
```

---

## Segurança PII

- **NUNCA** logue conteúdo completo do payload se contiver dados sensíveis.
- Use chaves de correlação (operação, protocolo) nos logs — nunca CPF, conta, valor.

---

## Checklist de Implementação

- [ ] Dependência `spring-kafka` adicionada ao `pom.xml`
- [ ] Tópicos configurados como variáveis de ambiente em `application.yml`
- [ ] `enable.idempotence: true` no producer
- [ ] Evento como Record Java 21 com `eventId` UUID
- [ ] Producer implementando `OutputPort` via `KafkaTemplate`
- [ ] Consumer com `@KafkaListener` + `Acknowledgment` manual
- [ ] Lógica de DLQ para erros irrecuperáveis
- [ ] `DefaultErrorHandler` com retry e `DeadLetterPublishingRecoverer`
- [ ] Verificação de idempotência no consumer
- [ ] `@Bean` dos adapters registrado em `config/`
- [ ] Testes unitários com `@EmbeddedKafka` (cobertura ≥ 95%)
- [ ] Nenhum dado PII logado
