---
name: Geração da Constituição Foursys SDD
description: Define os princípios, padrões técnicos e regras de ouro que regem o desenvolvimento de um projeto.
metadata:
  version: "1.5.0"
---

# Playbook: Foursys Constitution Generator

Este playbook é utilizado para inicializar a governança de um projeto. Ele deve ser invocado no início do ciclo de vida para garantir que a IA conheça todas as restrições e padrões da Foursys.

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
   - Linguagem: Java 21 com Records e Sealed Classes onde aplicável.
   - Framework: Spring Boot 3.x com Arquitetura Hexagonal.
   - Imutabilidade: prefira Records e campos final.
   - Validação: Bean Validation (JSR 380) — @NotNull, @Size, @Valid em todos os inputs.
   - Injeção de Dependência: via construtor (nunca @Autowired em campo).
   - NÃO use padrões Angular, TypeScript ou COBOL nesta constituição.

3. 📏 REGRAS DE OURO (GOLDEN RULES) — APENAS JAVA
   ⚠️ NÃO ADICIONE regras Angular (inject(), Signals, app.config.ts, WCAG, NG1). Este projeto é exclusivamente Java/Spring Boot.
   - Regra 1 (Siga o Plano): Não invente caminhos.
   - Regra 2 (Filepath): Todo código deve ter // FILEPATH:.
   - Regra 3 (Build First): Valide pom.xml e application.yml ANTES de gerar qualquer classe.
   - Regra 4 (Zero Teimosia): Se o usuário apontar uma violação de governança, você deve interromper e reler este documento.
   - Regra 5 (Atomic Edits): Toda edição deve manter a integridade total do arquivo.
   - Regra 6 (Exceções de Domínio): Nunca use RuntimeException genérica — sempre lance exceções de domínio específicas.
   - Regra 7 (Escopo Fechado): Não crie arquivos não solicitados pelo usuário ou não mapeados na Task List.
   - Regra 8 (Proteção de Código Existente): NUNCA modifique, sobrescreva ou delete código existente sem solicitação explícita do desenvolvedor. Antes de qualquer geração: (1) leia o que já existe no arquivo; (2) identifique exatamente o que precisa mudar conforme a Task List; (3) faça APENAS a alteração solicitada, preservando todo o restante intacto. Se o arquivo não estiver na Task List ativa, NÃO TOQUE nele.

4. 🧪 QUALIDADE E TESTES
   - Cobertura mínima de 95% (alinhado com SKILL_SPRINGBOOT_TESTING).
   - Uso de Mocks para dependências externas.
   - Padrão AAA (Arrange, Act, Assert).

5. 📁 ESTRUTURA DE ARQUIVOS (Arquitetura Hexagonal — Java)
   - `src/main/java/.../domain/` — Entidades, Records, interfaces de porta
   - `src/main/java/.../application/usecase/` — Casos de uso (orquestração)
   - `src/main/java/.../infrastructure/adapter/` — Adapters de entrada (REST) e saída (DB, Kafka, Feign)
   - `src/main/java/.../infrastructure/config/` — Classes @Configuration e @Bean
   - `src/main/resources/` — application.yml e perfis (application-dev.yml, application-prod.yml)
   - `src/test/java/` — Testes unitários e de integração (espelha a estrutura de main)

### 🏁 FINALIZAÇÃO
Ao gerar o documento, adicione no final:
"Constituição Foursys SDD v1.5.0 gerada com sucesso. Este projeto agora está sob a governança oficial do Hub."
```
