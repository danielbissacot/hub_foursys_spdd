# Exemplos de User Stories Backend/Serviços — Otimizadas para APF

## Índice

1. [Exemplo 1 — Integração API Externa: Envio de Solicitação](#exemplo-1)
2. [Exemplo 2 — Polling/Consulta de Protocolo com Resiliência](#exemplo-2)
3. [Exemplo 3 — Infraestrutura de Filas (Tech Lead)](#exemplo-3)
4. [Exemplo 4 — Consumer de Filas de Mensageria](#exemplo-4)
5. [Exemplo 5 — Roteamento de Canal por Regra de Negócio](#exemplo-5)
6. [Padrões Observados — Backend vs Frontend](#padrões-backend)

---

## Exemplo 1

### Integração API Externa — Envio de Solicitação com Protocolo

**Contexto:** Enviar solicitação de opt-in à registradora Nuclea via API, registrar protocolo retornado e persistir rastreabilidade. Serviço backend sem interface web.

```markdown
# [ESCRI-17282] Adicionar funcionalidade de solicitação de opt-in via API — Adapter Nuclea

**Status:** Draft
**Serviço:** dupe-srv-duple-adapter-nuclea
**Feature:** ESCRI-12831
**Dependência:** ESCRI-17289 (dupe-lib-opt-dominios), ESCRI-17280 (infraestrutura de filas opt-in)

---

## 📌 APOIO APF

➡️ Funcionalidade de solicitação de opt-in à registradora Nuclea via canal API (DUP0515).
➡️ Funcionalidade de registro de protocolo de solicitação de opt-in retornado pela Nuclea.
➡️ Funcionalidade de persistência do estado de rastreabilidade da solicitação de opt-in.
➡️ Sistema referenciado: API Nuclea — endpoint de solicitação de opt-in (DUP0515).
➡️ Agrupamento de dados de negócio: controle de integração com a Nuclea (opt-in).

---

## 📌 IDENTIFICAÇÃO

**EU COMO** Gestor de Produto de Recebíveis
**QUERO QUE** as solicitações de opt-in elegíveis para o canal API sejam enviadas à registradora Nuclea via integração online, com o protocolo registrado e a rastreabilidade persistida
**PARA** modernizar a jornada de opt-in com processamento online, retorno de protocolo imediato e acompanhamento completo de cada solicitação

---

## 📋 REGRAS DE NEGÓCIO

**RN-01 — Paridade funcional com o canal Batch**

A solicitação de opt-in via API deve aplicar exatamente as mesmas regras de negócio do fluxo atual via Arquivo. Nenhuma regra funcional é alterada — apenas o canal de envio.

**RN-13 — Envio da solicitação de opt-in à registradora via canal API**

O sistema deve enviar a solicitação de opt-in à registradora Nuclea consumindo a API de inclusão de opt-in (DUP0515) como sistema externo, traduzindo os dados do domínio Bradesco para o formato esperado pela registradora.

**RN-14 — Registro do protocolo retornado pela registradora**

Ao enviar a solicitação de opt-in, a registradora retorna um protocolo que identifica univocamente a operação. O sistema deve registrar este protocolo para viabilizar a consulta posterior do resultado do processamento.

**RN-15 — Persistência da rastreabilidade da integração**

Cada solicitação de opt-in enviada via canal API deve ter seu estado de integração persistido em um registro de controle dedicado, contendo a data de envio, o protocolo recebido e o status da operação, permitindo auditoria e acompanhamento operacional.

---

## 🔧 REGRAS TÉCNICAS

**RT-01 — UseCase `EnviarOptInOptOutNucleaUseCase`**

Implementar UseCase (POJO puro, sem `@Service`) responsável por:
1. Receber `IncluirRecebivel` (dupe-lib-opt-dominios) da fila `sbqenviooptin001`
2. Verificar estado do Circuit Breaker antes de chamar a Nuclea
3. Converter `IncluirRecebivel` → `Dup0515Request` via `IncluirRecebivelToDup0515Mapper` (MapStruct)
4. Chamar `OptInOptOutNucleaClient.enviarOptIn(Dup0515Request)` via Feign
5. Persistir protocolo via `ControleIntegracaoNucleaOutputPort`

Registrar via `@Bean` na `UseCaseConfig`:
```java
@Bean
public EnviarOptInOptOutNucleaInputPort enviarOptInOptOutNucleaUseCase(
        EnviarOptInNucleaOutputPort enviarOptInPort,
        PublicarProtocoloOptInOptOutOutputPort publicarProtocoloPort,
        ControleIntegracaoNucleaOutputPort controleIntegracaoPort) {
    return new EnviarOptInOptOutNucleaUseCase(enviarOptInPort, publicarProtocoloPort, controleIntegracaoPort);
}
```

**RT-02 — Feign Client `OptInOptOutNucleaClient`**

```java
@FeignClient(
    name = "optInOptOutNucleaClient",
    url = "${nuclea.duplicata.optin-optout.url}",
    configuration = EscrituradoraFeignConfig.class
)
public interface OptInOptOutNucleaClient {
    @PostMapping("/registradora/optin/incluir")
    ResponseEntity<ProtocoloNucleaResponse> enviarOptIn(@RequestBody Dup0515Request request);
}
```

**RT-03 — DTO de Requisição `Dup0515Request`**

```java
public record Dup0515Request(
    String indicadorTipoTitular,              // (*) SCDR ou TITU — 4 chars
    String cpfOuCnpjSacadorOuTitular,         // (*) 11-14 chars
    String indicadorCnpjBase,                 // S ou N (opcional)
    String datalnicioOptIn,                   // AAAA-MM-DD (opcional)
    String dataFimOptin,                      // AAAA-MM-DD (opcional)
    String numeroDocumentoAutorizacao,         // (*) 1-40 chars
    String dataAutorizacao                     // (*) AAAA-MM-DD
) {}
// (*) obrigatório
```

**RT-04 — Mapeamento `IncluirRecebivel` → `Dup0515Request`**

| Campo IncluirRecebivel | Campo Dup0515Request | Observação |
|---|---|---|
| `scIdentificadorSacadorTitular.cpfCnpj` | `cpfOuCnpjSacadorOuTitular` | 11-14 chars |
| `scIdentificadorSacadorTitular.tipoTitular` | `indicadorTipoTitular` | SCDR/TITU |
| `dtEfetivacaoOperadora` | `dataAutorizacao` | AAAA-MM-DD |
| `scGrupoInformacaoSacador.numDocAutorizacao` | `numeroDocumentoAutorizacao` | 1-40 chars |

**RT-05 — Circuit Breaker `nucleaOptInOptOut`**

```yaml
resilience4j:
  circuitbreaker:
    instances:
      nucleaOptInOptOut:
        slidingWindowSize: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 60s
        recordExceptions:
          - feign.FeignException.InternalServerError
          - java.net.ConnectException
        ignoreExceptions:
          - feign.FeignException.BadRequest
```

**RT-06 — Tratamento de erros de envio**

| Erro | Ação | Motivo |
|---|---|---|
| HTTP 4xx da Nuclea | `context.deadLetter(...)` | Falha de negócio irrecuperável |
| HTTP 5xx da Nuclea | Incrementa CB + `context.abandon()` | Retry automático |
| `CallNotPermittedException` | `context.abandon()` | Nuclea indisponível |

**RT-07 — Observabilidade**

| Métrica | Tipo | Tags |
|---|---|---|
| `optin_optout_envio_total` | Counter | `tipo=OPTIN`, `resultado=SUCESSO\|ERRO` |

---

## ✅ CRITÉRIOS DE ACEITE

**CA-01 — Solicitação de opt-in enviada com sucesso à Nuclea**

**DADO QUE** uma mensagem de solicitação de opt-in válida está na fila de envio
**QUANDO** o sistema processar a mensagem
**ENTÃO** a solicitação deve ser enviada à Nuclea via API e o protocolo retornado deve ser registrado

**CA-02 — Equivalência de validações com o canal Batch**

**DADO QUE** uma solicitação de opt-in é recebida via canal API
**QUANDO** o sistema processar a solicitação
**ENTÃO** as mesmas regras de negócio do canal Batch devem ser aplicadas

**CA-03 — Nuclea indisponível: processamento suspenso sem perda**

**DADO QUE** a API da Nuclea está indisponível
**QUANDO** o sistema tentar enviar uma solicitação
**ENTÃO** a mensagem deve ser mantida na fila para reprocessamento posterior

---

## 🔗 DEPENDÊNCIAS

- **ESCRI-17289:** `dupe-lib-opt-dominios` com `IncluirRecebivel`, `RetornoProtocolo`.
- **ESCRI-17280:** Infraestrutura de filas opt-in configurada.

---

## 🚫 FORA DO ESCOPO

- Envio de opt-**out** via API (DUP0517) — ESCRI-17283.
- Consulta do resultado do protocolo (polling DUP0515RET) — ESCRI-17278.

---

## ⚠️ RISCOS

- **Indisponibilidade prolongada da Nuclea:** Pode acumular mensagens nas filas.
- **Mapeamento incompleto IncluirRecebivel → Dup0515Request:** Campos obrigatórios não mapeados causam rejeição 4xx.
```

### Análise de Pontos — Exemplo 1

| # | Funcionalidade | Tipo | PF | Observação |
|---|----------------|------|----|------------|
| 1 | Solicitação de opt-in à Nuclea via API | SE | 5,52 | Envio de dados para sistema externo |
| 2 | Registro de protocolo retornado | EE | 4,70 | Persistência de dados internos |
| 3 | Persistência de rastreabilidade | EE | 4,70 | Gravação em registro de controle |
| 4 | AIE — API Nuclea (DUP0515) | AIE | 6,21 | Sistema externo referenciado |
| 5 | ALI — Controle de integração Nuclea | ALI | 7,21 | Dados mantidos pela aplicação |
| — | **TOTAL** | — | **28,34** |

> **Padrão observado:** Em integrações backend, o envio a API externa é SE (saída), o protocolo retornado gera EE (persistência), e a rastreabilidade gera outro EE. A API externa é AIE e a collection de controle é ALI.

---

## Exemplo 2

### Polling/Consulta de Protocolo com Resiliência

**Contexto:** Consultar resultado do protocolo na registradora com backoff exponencial e tradução de resposta.

```markdown
## 📌 APOIO APF

➡️ Funcionalidade de consulta do resultado do protocolo de opt-in na registradora Nuclea (DUP0515RET).
➡️ Funcionalidade de tradução do resultado da registradora para o formato de domínio Bradesco.
➡️ Funcionalidade de atualização do registro de integração com o resultado final do processamento.
➡️ Sistema referenciado: API Nuclea — endpoint de retorno de opt-in (DUP0515RET).

## 📌 IDENTIFICAÇÃO

**EU COMO** Analista de Operações de Recebíveis
**QUERO QUE** o sistema consulte automaticamente o resultado do protocolo de opt-in na registradora, traduza a resposta para o formato de domínio Bradesco e atualize o registro de integração
**PARA** acompanhar o ciclo completo da solicitação e reagir rapidamente a aceites ou recusas

## 📋 REGRAS DE NEGÓCIO

**RN-16 — Consulta do resultado do protocolo na registradora**

O sistema deve consultar o resultado do processamento da solicitação de opt-in na registradora, consumindo a API de retorno de opt-in (DUP0515RET) como fonte externa de dados, utilizando o protocolo previamente registrado.

**RN-17 — Tradução do resultado para formato de domínio Bradesco**

A resposta da registradora deve ser traduzida do formato proprietário para o formato de domínio padronizado do Bradesco antes de ser publicada. Os serviços consumidores não devem conhecer formatos proprietários da registradora.

**RN-18 — Atualização do registro de integração com resultado definitivo**

Quando o resultado definitivo for obtido (aceito ou recusado), o sistema deve atualizar o registro de controle de integração com a data de conclusão e o status final.
```

> **Padrão observado:** Polling gera CE (consulta ao sistema externo), a tradução/ACL gera SE (dado derivado), e a atualização final gera EE. O backoff exponencial é detalhe técnico — não conta como funcionalidade separada.

---

## Exemplo 3

### Infraestrutura de Filas (Persona: Tech Lead)

**Contexto:** Configurar publishers e consumers de filas de mensageria. US puramente técnica.

```markdown
## 📌 APOIO APF

➡️ Funcionalidade de recebimento de solicitações de opt-in via fila de mensageria dedicada.
➡️ Funcionalidade de publicação de protocolos de opt-in para verificação posterior.
➡️ Funcionalidade de publicação de notificações e resultados finais de opt-in.
➡️ Agrupamento de dados de negócio: contratos de mensagem padronizados (opt-in).

## 📌 IDENTIFICAÇÃO

**EU COMO** Tech Lead do squad de Recebíveis
**QUERO QUE** a infraestrutura de filas de mensageria para o fluxo de opt-in esteja configurada, incluindo consumers e publishers com os contratos de mensagem padronizados
**PARA** viabilizar a comunicação assíncrona entre o serviço de solicitação e o adapter da Nuclea
```

> **Padrão observado:** USs técnicas usam persona "Tech Lead". Cada fila com direção distinta (consumer/publisher) que serve a um propósito de negócio é uma funcionalidade. A configuração em si não gera pontos — o que gera é o canal de comunicação de negócio que ela viabiliza.

---

## Exemplo 4

### Consumer de Filas de Mensageria

**Contexto:** Implementar consumers que recebem mensagens e delegam ao UseCase.

```markdown
## 📌 APOIO APF

➡️ Funcionalidade de consumo de solicitação de opt-in para envio à registradora.
➡️ Funcionalidade de consumo de solicitação de opt-out para envio à registradora.

## 📌 IDENTIFICAÇÃO

**EU COMO** Tech Lead do squad de Recebíveis
**QUERO QUE** o adapter da Nuclea consuma as mensagens de solicitação de opt-in e opt-out das filas correspondentes e acione o UseCase de envio
**PARA** conectar o serviço de solicitação ao adapter da Nuclea de forma assíncrona e resiliente
```

> **Padrão observado:** Cada consumer que serve a um tipo de operação diferente é uma funcionalidade separada. O tratamento de erros (dead-letter, abandon) é detalhe técnico, não funcionalidade.

---

## Exemplo 5

### Roteamento de Canal por Regra de Negócio

**Contexto:** Decidir canal de envio (API vs Batch) com base em configuração e tipo de aceite.

```markdown
## 📌 APOIO APF

➡️ Funcionalidade de roteamento de solicitação para o canal correto (API ou Arquivo/Batch) com base no tipo de aceite.
➡️ Funcionalidade de envio de solicitação para a fila do canal API.
➡️ Funcionalidade de ativação e desativação de canal por tipo de operação via configuração sem redeploy.
➡️ Funcionalidade de roteamento por CNPJ específico para controle de testes em produção.
➡️ Agrupamento de dados de negócio: documento de recebível registradora (alterado — novo campo de decisão de canal).

## 📌 IDENTIFICAÇÃO

**EU COMO** Gestor de Produto de Recebíveis
**QUERO QUE** o serviço identifique automaticamente o canal de envio correto (API ou Arquivo/Batch) com base no tipo de aceite, e encaminhe a solicitação para a fila correspondente, com possibilidade de ativação/desativação por configuração e override por CNPJ
**PARA** ativar progressivamente o canal online para os tipos elegíveis, sem alterar regras de negócio existentes

## 📋 REGRAS DE NEGÓCIO

**RN-04 — Roteamento de solicitação para o canal correto com base no tipo de aceite**

O canal de processamento é determinado pelo tipo de aceite da solicitação:
- Solicitações de tipo **Massivo** devem ser processadas pelo canal **Arquivo (Batch)**.
- Solicitações de demais tipos devem ser processadas pelo canal **API**.

**RN-05 — Envio da solicitação para a fila do canal API**

Quando o roteamento determinar que a solicitação deve seguir pelo canal API, o sistema deve encaminhar a solicitação para a fila correspondente ao tipo de operação, traduzindo os dados do domínio interno para o formato de contrato da biblioteca compartilhada.

**RN-11 — Ativação e desativação de canal por configuração sem redeploy**

O sistema deve permitir ativar ou desativar o canal API e o canal Batch por tipo de operação através de configuração externa, sem necessidade de redeploy da aplicação.

**RN-12 — Roteamento por CNPJ específico com precedência sobre regra geral**

Quando um CNPJ específico estiver configurado para um canal determinado, essa configuração deve ter precedência sobre a regra geral de tipo de aceite.
```

> **Padrão observado:** Roteamento com múltiplas camadas de decisão gera funcionalidades distintas: a decisão principal (tipo de aceite), o envio para fila, o toggle (ativação/desativação), e o override por CNPJ. Cada uma é um PE que muda o estado ou comportamento do sistema.

---

## Padrões Backend

### Diferenças-chave entre US Frontend e US Backend

| Aspecto | Frontend (Web/Mobile) | Backend (Serviços/Integrações) |
|---|---|---|
| **Persona** | Operador, Analista, Gerente | Gestor de Produto, Analista de Operações, **Tech Lead** (se puramente técnica) |
| **ALI** | Coleções/tabelas de dados de negócio | Collections MongoDB, registros de controle, registros de integração |
| **AIE** | APIs externas consumidas | APIs de registradoras, serviços Feign, sistemas de consulta |
| **EE** | Inclusão/alteração/exclusão via tela | Persistência de protocolo, atualização de status, gravação de rastreabilidade |
| **CE** | Combo-box, listagem, consulta | Polling de resultado, consulta de registro existente |
| **SE** | Relatório, exportação, PDF | Envio para API externa, publicação em fila, tradução/ACL de resposta |
| **Browser** | Chrome + Edge (sempre) | **Não aplicável** — não incluir linhas de browser |

### Como tornar ALI/AIE implícitos na prosa das RNs

Não usar termos APF diretamente. Em vez disso, usar linguagem natural que torna o conceito APF óbvio:

| Conceito APF | Linguagem natural na RN |
|---|---|
| AIE | "consumindo a API de retorno da Nuclea (DUP0515RET) como **fonte externa de dados**" |
| ALI | "persistir em um **registro de controle dedicado**, contendo data de envio, protocolo e status" |
| SE | "enviar a solicitação à registradora, **traduzindo os dados do domínio Bradesco** para o formato esperado" |
| EE | "registrar o protocolo retornado para **viabilizar a consulta posterior**" |
| CE | "consultar o resultado do processamento utilizando o **protocolo previamente registrado**" |

### Regras Técnicas — Nível de detalhe esperado para backend

```
RT-01 — UseCase com @Bean config completo (ports injetados)
RT-02 — @FeignClient com name, url, configuration
RT-03 — DTOs record com tipos, tamanhos, obrigatoriedade
RT-04 — Tabela de mapeamento campo-a-campo
RT-05 — Resilience4j YAML com recordExceptions/ignoreExceptions
RT-06 — Tabela de error handling (Exceção → Ação → Motivo)
RT-07 — application.yml com env vars
RT-08 — pom.xml dependencies
RT-09 — Observabilidade (métricas + logs estruturados)
RT-10 — Cenários de teste ≥ 95%
```
