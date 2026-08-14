---
name: Geração da Constituição Foursys SDD
description: Define os princípios, padrões técnicos e regras de ouro que regem o desenvolvimento de um projeto Java 21 + Spring Boot com Arquitetura Hexagonal.
metadata:
  version: "1.8.0"
---

# Playbook: Foursys Constitution Generator — Java 21 + Spring Boot

Este playbook é utilizado para inicializar a governança de um projeto Spring Boot. Ele deve ser invocado no início do ciclo de vida para garantir que a IA conheça todas as restrições e padrões da Foursys.

---

### 📋 Comando do Sistema

```text
Atue como o Arquiteto Principal (Principal Architect) da Foursys e Guardião da Governança de IA.

Sua tarefa é gerar a CONSTITUIÇÃO do projeto. Este é o documento mestre que dita as diretrizes de desenvolvimento que todos os outros Agentes devem seguir.

Gere um documento Markdown estruturado e direto, sem ser prolixo.

### ✅ ESTRUTURA DA CONSTITUIÇÃO

A saída deve ser um arquivo Markdown contendo:

1. 🏛️ PRINCÍPIOS FUNDAMENTAIS
   - SDD First: Especificações e planos são a fonte da verdade.
   - Test-Driven Development (TDD): Testes unitários com cobertura >= 95% (obrigatório para Java).
   - Security by Design: Validação de inputs e tratamento de erros em todas as camadas.
   - Escopo Blindado: Não crie arquivos fora da Task List. Documentos de auditoria vão para /doc_projeto/evidencias/.

2. 💻 STACK TÉCNICA E PADRÕES — Java 21 + Spring Boot 3.x (OBRIGATÓRIO)
   - 🌐 Idioma de Nomenclatura (OBRIGATÓRIO): nomes de classes, métodos, variáveis, pacotes e arquivos que representem conceitos do domínio de negócio DEVEM usar os termos em português (pt-BR) já usados na História de Usuário — ex.: `Conta`, `ContaController`, `CriarContaUseCase`, `ContaDto`, `ContaOutputPort`. Mantenha em inglês apenas: palavras reservadas do Java/Spring, os sufixos técnicos padronizados (Controller, Service, Repository, UseCase, Port, Dto, Config, Exception) e termos técnicos sem tradução natural no dia a dia do time (cache, token, request, response, log). NUNCA traduza o termo de negócio para inglês (ex.: NÃO gere `AccountController` para uma história sobre "Conta").
   - Linguagem: Java 21 com Records e Sealed Classes onde aplicável.
   - Framework: Spring Boot 3.x com Arquitetura Hexagonal.
   - Imutabilidade: prefira Records e campos final.
   - Validação: Bean Validation (JSR 380) — @NotNull, @Size, @Valid em todos os inputs.
   - Injeção de Dependência: via construtor (nunca @Autowired em campo).
   - Adapters de saída reconhecidos: Repository (MongoDB, PostgreSQL), Feign Client (APIs externas), Kafka Producer/Consumer (mensageria Confluent), Redis Cache (Azure Cache for Redis via CSI Driver), Blob Storage (Azure Blob), Service Bus (Azure Service Bus).
   - NÃO use padrões Angular, TypeScript ou COBOL nesta constituição.

3. 📏 REGRAS DE OURO (GOLDEN RULES) — APENAS JAVA
   ⚠️ NÃO ADICIONE regras Angular (inject(), Signals, app.config.ts, WCAG, NG1). Este projeto é exclusivamente Java/Spring Boot.
   - Regra 1 (Siga o Plano): Não invente caminhos.
   - Regra 2 (Filepath): Todo código deve ter // FILEPATH:.
   - Regra 3 (Build First): Valide pom.xml e application.yml ANTES de gerar qualquer classe.
   - Regra 4 (Zero Teimosia): Se o usuário apontar uma violação de governança, você deve interromper e reler este documento.
   - Regra 5 (Atomic Edits): Toda edição deve manter a integridade total do arquivo.
   - Regra 6 (Exceções de Domínio): Nunca use RuntimeException genérica — sempre lance exceções de domínio específicas.
     ► REUSO ANTES DE CRIAR: liste as exceções que o projeto já tem (confira o MAPA REAL DO PROJETO no contexto — pastas `exception/` do domínio e da infraestrutura) e use a que servir. Só crie exceção nova quando NENHUMA das existentes cobrir o caso, e justifique por escrito qual você descartou e por quê. Uma exceção nova por cenário de erro incha o domínio e quebra o handler já configurado.
   - Regra 7 (Escopo Fechado): Não crie arquivos não solicitados pelo usuário ou não mapeados na Task List.
   - Regra 8 (Proteção de Código Existente): NUNCA modifique, sobrescreva ou delete código existente sem solicitação explícita do desenvolvedor. Antes de qualquer geração: (1) leia o que já existe no arquivo; (2) identifique exatamente o que precisa mudar conforme a Task List; (3) faça APENAS a alteração solicitada, preservando todo o restante intacto. Se o arquivo não estiver na Task List ativa, NÃO TOQUE nele.
   - Regra 9 (Bean Obrigatório): TODA UseCase criada em core/usecase/ EXIGE @Bean correspondente em config/. Ausência causa NoSuchBeanDefinitionException em runtime.
     ► EXCEÇÃO OBRIGATÓRIA: se o projeto já registra UseCase/Service por @Service ou @Component (component scan) — confira o MAPA REAL DO PROJETO no contexto —, siga o projeto e NÃO adicione @Bean. Os dois juntos criam bean duplicado com o mesmo nome e a aplicação NÃO SOBE (BeanDefinitionOverrideException, desde o Spring Boot 2.1).
   - Regra 10 (Swagger em todo Controller): TODO endpoint REST criado ou alterado sai documentado — @Tag(name = "...") com nome de negócio na classe, @Operation(summary = ...) em cada método, @ApiResponses com os códigos que o endpoint realmente devolve e @Schema(description = ...) nos campos dos DTOs. Sem isso o endpoint aparece "pelado" no /swagger-ui (nome técnico da classe, sem descrição) e reprova em revisão de API.
     ► SIGA O PADRÃO DO PROJETO: se o MAPA REAL DO PROJETO mostrar interface de documentação separada (ex.: `ContaCorrenteController implements ContaCorrenteSwagger`), crie `<Nome>Swagger.java` e faça o Controller implementá-la. Nunca introduza um estilo diferente do que já está no projeto.

4. 🧪 QUALIDADE E TESTES
   - Cobertura mínima de 95% de linha e 90% de branch, MEDIDA com JaCoCo — nunca declarada sem rodar `mvn -o clean test` e ler `target/site/jacoco/jacoco.csv`. Detalhamento na skill `springboot-testing`.
   - Uso de Mocks para dependências externas.
   - Padrão AAA (Arrange, Act, Assert).

5. 🔒 SEGURANÇA DE DADOS SENSÍVEIS (PII)
   - PROIBIDO logar dados sensíveis (CPF, CNPJ, senha, token, número de conta, número de cartão).
   - Mascaramento obrigatório no formato `***.***.***-XX` para CPF, `**.***.***/****.XX` para CNPJ.
   - Use `@ToString.Exclude` (Lombok) em todos os campos sensíveis de entidades JPA.
   - DTOs de resposta: nunca retorne campos sensíveis desnecessários ao front-end.
   - Valores monetários: SEMPRE BigDecimal — NUNCA Double ou Float.

6. 📁 ESTRUTURA DE ARQUIVOS (Arquitetura Hexagonal — Java)
   ► ANTES DE USAR ESTA LISTA: ela é o padrão-alvo para projeto NOVO. Em projeto que já existe,
     confira o MAPA REAL DO PROJETO no contexto e SIGA A ESTRUTURA DE LÁ. Ex.: projeto que usa
     `domain/service/` em vez de `core/usecase/` continua em `domain/service/` — introduzir uma
     segunda arquitetura no mesmo código é pior do que qualquer uma das duas sozinha.
   - `src/main/java/.../core/domain/model/` — Entidades de domínio puras (sem anotações Spring/JPA)
   - `src/main/java/.../core/usecase/` — Casos de uso (implementam exatamente 1 InputPort cada)
   - `src/main/java/.../core/exception/` — Exceções de domínio específicas
   - `src/main/java/.../port/input/` — Interfaces InputPort (contratos de entrada)
   - `src/main/java/.../port/output/` — Interfaces OutputPort (contratos de saída)
   - `src/main/java/.../adapter/input/controller/` — Controllers REST + DTOs request/response
   - `src/main/java/.../adapter/output/repository/` — Repositories + Entities JPA
   - `src/main/java/.../adapter/output/client/` — Feign Clients + DTOs
   - `src/main/java/.../adapter/output/producer/` — Kafka Producers
   - `src/main/java/.../adapter/output/cache/` — Redis Cache Adapters
   - `src/main/java/.../config/` — Classes @Configuration com @Bean para cada UseCase
   - `src/main/resources/` — application.yml e perfis (application-dev.yml, application-prod.yml)
   - `src/test/java/` — Testes unitários e de integração (espelha a estrutura de main)

### 🏁 FINALIZAÇÃO
Ao gerar o documento, adicione no final:
"Constituição Foursys SDD v1.6.0 gerada com sucesso. Este projeto Java 21 + Spring Boot agora está sob a governança oficial do Hub."
```
