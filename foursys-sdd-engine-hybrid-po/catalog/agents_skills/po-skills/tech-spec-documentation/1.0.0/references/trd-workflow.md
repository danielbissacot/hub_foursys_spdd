# TRD Workflow — Consulta Técnica

## Objetivo

Identificar a stack tecnológica, consultar as skills de padrões correspondentes e conduzir uma sessão de perguntas técnicas antes de gerar o TRD.

---

## Passo 1: Identificar a stack

Pergunte ao usuário:
- Qual é a tecnologia principal envolvida nesta feature? (Angular, SpringBoot, ambos, outra?)
- Há integrações com sistemas externos? (Kafka, MongoDB, Azure Service Bus, Blob Storage, APIs externas via Feign/RestClient)

---

## Passo 2: Carregar skills de padrões

Com base nas respostas, leia as skills correspondentes **antes de continuar**:

| Stack / Integração | Skills a consultar |
|--------------------|--------------------|
| Angular (componentes, formulários) | `angular-component`, `angular-forms` |
| Angular (comunicação HTTP) | `angular-http` |
| Angular (navegação) | `angular-routing` |
| Angular (estado) | `angular-signals` |
| SpringBoot (APIs REST) | `springboot-rest-client` |
| SpringBoot (integrações externas) | `springboot-feign-client` |
| SpringBoot (testes) | `springboot-testing` |
| Kafka | `springboot-kafka` |
| MongoDB | `springboot-mongodb` |
| Azure Service Bus | `springboot-service-bus` |
| Blob Storage | `springboot-blob-storage` |

> Leia apenas as skills relevantes para a feature em questão.

---

## Passo 3: Sessão interativa de arquitetura

Com os padrões das skills carregadas em mente, conduza a sessão:

### Alinhamento de padrões
- A abordagem proposta segue os padrões identificados nas skills? Se diverge em algum ponto, há justificativa?
- Há convenções de nomenclatura, estrutura de pacotes ou organização de módulos que precisam ser respeitadas?

### Contratos e interfaces
- Quais endpoints REST ou eventos Kafka precisam ser criados ou modificados?
- Quais DTOs/schemas estão envolvidos? Há contratos com outros serviços que precisam ser acordados?

### Tratamento de erros e observabilidade
- Qual é a estratégia de tratamento de erros? (ex: exceções customizadas, códigos HTTP padronizados)
- Como será feita a observabilidade? (logs estruturados, métricas, distributed tracing)

### Impacto e dependências
- Esta feature impacta outros serviços ou times? Há dependências de infraestrutura?
- Há necessidade de migração de dados ou mudanças de schema?

Se algum ponto levantar inconsistências com os padrões das skills, aponte explicitamente antes de gerar o documento.

---

## Ao final da sessão

Com todas as informações coletadas, gere o TRD usando `references/trd-template.md`.
