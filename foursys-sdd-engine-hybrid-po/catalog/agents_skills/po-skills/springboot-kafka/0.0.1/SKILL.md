---
name: springboot-kafka
description: Use para implementar producers ou consumers do Apache Kafka em projetos Spring Boot usando Confluent Cloud. Use quando precisar implementar streaming de dados, mensageria assíncrona, event-driven architecture, ou integração com tópicos Kafka seguindo padrões de resiliência e retry.
metadata:
  version: "0.0.1"
---

# Spring Boot Kafka

Este skill fornece instruções detalhadas para implementar producers e consumers do Apache Kafka em projetos Spring Boot usando Confluent Cloud seguindo arquitetura hexagonal e padrões de resiliência.

## Quando usar este skill

Use este skill quando:
- Precisar produzir eventos para tópicos Kafka
- Implementar consumidores de mensagens Kafka
- Configurar estratégias de retry e Dead-Letter Topics (DLT)
- Seguir arquitetura hexagonal com event-driven architecture
- Implementar resiliência em processamento de mensagens
- Integrar com Confluent Cloud (plataforma Kafka gerenciada do Bradesco)

## Pré-Requisitos

- **JDK 17** ou superior
- **Maven**
- **Spring Boot 3.x.x**

## Dependências necessárias

Adicione a seguinte dependência no `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

## Estrutura na Arquitetura Hexagonal

Para implementação de Producers e Consumers Kafka em arquitetura hexagonal, siga os princípios de isolamento entre camadas:

### Producer (Output)
- **OutputPort** (`port/output/`): Define contratos em linguagem de domínio para envio de eventos
- **Producer Adapter** (`adapter/output/kafka/producer/`): Implementa OutputPort usando Kafka Producer
- **Event DTOs** (`adapter/output/kafka/producer/dto/`): Estruturas de mensagens Kafka
- **Mapper** (`adapter/output/kafka/producer/mapper/`): Traduz entre domínio e eventos Kafka

**📖 Consulte**: [references/KAFKA_PRODUCER_INTEGRATION.md](references/KAFKA_PRODUCER_INTEGRATION.md) para estrutura detalhada com exemplos

### Consumer (Input)
- **InputPort** (`port/input/`): Define casos de uso que processam mensagens
- **Consumer Adapter** (`adapter/input/kafka/consumer/`): Escuta tópicos e processa mensagens
- **Event DTOs** (`adapter/input/kafka/consumer/dto/`): Estruturas de mensagens recebidas
- **Mapper** (`adapter/input/kafka/consumer/mapper/`): Traduz eventos Kafka para domínio

**📖 Consulte**: [references/KAFKA_CONSUMER_INTEGRATION.md](references/KAFKA_CONSUMER_INTEGRATION.md) para estrutura detalhada com exemplos

## Configuração do Kafka

### Propriedades Comuns (application.yml)

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
```

### Configuração de Tópicos

Defina os tópicos no arquivo de configuração:

```yaml
spring:
  kafka:
    topics:
      account-created:
        name: 'tp-event-account-created'
      account-check-result:
        name: 'tp-event-account-check-result'
```

## Kafka Producer

Para implementar um **Producer Kafka** que envia eventos para tópicos:

**📖 Consulte**: [references/KAFKA_PRODUCER_INTEGRATION.md](references/KAFKA_PRODUCER_INTEGRATION.md)

## Kafka Consumer

Para implementar um **Consumer Kafka** que escuta e processa eventos de tópicos:

**📖 Consulte**: [references/KAFKA_CONSUMER_INTEGRATION.md](references/KAFKA_CONSUMER_INTEGRATION.md)

## Problemas Conhecidos

### Erro: SslAuthenticationException / SSLHandshakeException

**Causa**: Certificado root do Kafka não está no truststore da aplicação.

**Solução**:

1. Obtenha o certificado **ISRG Root X1**:
   ```bash
   openssl s_client -connect ${KAFKA_BOOTSTRAP_SERVER}:443 -showcerts
   ```

2. Importe o certificado no seu `.jks`:
   ```bash
   keytool -trustcacerts -keystore trusted.jks -storepass senha-do-seu-store \
           -importcert -alias ISRGROOTX1Kafka -file isrgrootx1.crt
   ```

3. Rebuild/redeploy do serviço

## Referências Completas

- **[KAFKA_PRODUCER_INTEGRATION.md](references/KAFKA_PRODUCER_INTEGRATION.md)** - Implementação completa de Kafka Producer em arquitetura hexagonal
- **[KAFKA_CONSUMER_INTEGRATION.md](references/KAFKA_CONSUMER_INTEGRATION.md)** - Implementação completa de Kafka Consumer em arquitetura hexagonal