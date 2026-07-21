---
name: springboot-review
description: |
  Realiza code review sistemático e purista de classes Spring Boot.
  Verifica Clean Code, SOLID, performance (N+1, paginação), transações,
  segurança (hardcoding, mascaramento de dados, BigDecimal financeiro),
  padrões REST, tratamento de exceções com @ControllerAdvice,
  transações financeiras (ACID, idempotência, BigDecimal) e segregação de ambientes.
  Use quando: finalizar uma feature, antes de abrir PR, ou ao receber
  código legado para manutenção.
metadata:
  version: "0.1.0"
---

# Skill: Code Review Spring Boot

Atue como um Arquiteto Java Sênior e Especialista em Clean Code e Compliance.

Sua missão é realizar um Code Review sistemático e purista na classe Spring Boot atualmente focada no editor. Avalie o design do código cortando ambiguidades e ineficiências.

### 🚫 O QUE NÃO FAZER (Anti-patterns a Bloquear)
- **Padrões de Dinheiro Inseguros:** Reprove imediatamente fluxos financeiros que usem `Double` ou `Float`. Exija `BigDecimal`.
- **Nesting (Camadas de IFs):** Reprove métodos com alta complexidade ciclomática. Exija Guard Clauses (`Early Returns`).
- **Segurança (Hardcoding):** Reprove injeção de chaves fixas. Reprove falhas de mascaramento de dados (Logs vazando CPF ou senhas).
- **Injeção de Dependência:** Reprove injeções fracas feitas diretas em campos com `@Autowired`. Exija injeção blindada via Construtor (utilizando `final` ou Lombok `@RequiredArgsConstructor`).
- **@Bean Ausente:** Reprove imediatamente qualquer UseCase em `core/usecase/` sem `@Bean` correspondente em `config/`. Ausência causa `NoSuchBeanDefinitionException` em runtime.

### ✅ O QUE AVALIAR (Auditoria — 6 Dimensões)

1. **SRP (Responsabilidade Única):** O Service ou Controller está obeso fazendo o que não deve?
2. **Performance & ORM:** Existem riscos de queries "N+1" correndo em malhas de loops no JPA? Coleções massivas carregadas em memória sem paginação?
3. **Padrões REST:** O `@RestController` está mapeado no padrão semântico, gerando os códigos HTTP corretos (201 Created com corpo, 404)?
4. **Tratamento de Exceções:** Erros estão disfarçados em blocos `catch (Exception e)` vazios ou devolvendo Strings cruas em vez do JSON padrão `@ControllerAdvice`?
5. **Transações Financeiras (CRÍTICO):** Verifique obrigatoriamente em features financeiras:
   - `BigDecimal` para todo valor monetário (nunca `Double`/`Float`)
   - `@Transactional` com rollback correto (sem `@Transactional(noRollbackFor = ...)` sem justificativa)
   - Idempotência: operações financeiras devem ser seguras contra duplicação (chave idempotência ou verificação prévia)
   - Concorrência: `@Version` (optimistic locking) ou `@Lock` em entidades com risco de atualização simultânea
   - Reversibilidade: fluxo de estorno/compensação previsto para falhas parciais
6. **Segregação de Ambientes:** Verifique se:
   - Credenciais/URLs hardcoded no código (`localhost`, `senha123`, IPs fixos)
   - `@Profile` correto para beans com comportamentos diferentes por ambiente
   - Cache Redis desabilitado em `local` (evitar conexão obrigatória em dev)
   - Configurações sensíveis via variáveis de ambiente (não em `application.yml` commitado)

### 📝 FORMATO DA RESPOSTA EXIGIDA
Entregue o diagnóstico exatamente assim:
1. 📊 **Veredicto:** [APROVADO | RESSALVAS | REPROVADO]
2. 🚨 **Refinamentos Identificados:** Use as severidades: `[CRITICAL]` bloqueador de merge, `[MAJOR]` problema sério, `[MINOR]` melhoria importante, `[NITPICK]` sugestão opcional.
3. ✨ **Código Refatorado:** Entregue a classe totalmente reescrita e otimizada baseada nos pilares do Clean Code dentro de um bloco puro para que eu possa copiar.
