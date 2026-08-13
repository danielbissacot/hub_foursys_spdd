---
name: 'springboot-hexagonal-arch'
description: "Regras de arquitetura Java + Spring Boot Hexagonal sempre-ativas para o GitHub Copilot. Instaladas pelo Hub em .github/instructions/ do workspace, fazem o Copilot seguir Hexagonal, TDD, PII safety e padrões Java em qualquer contexto — sem precisar rodar uma fase SDD. A versão fica na pasta (1.0.0/), não no frontmatter: instructions do Copilot só aceitam name, description e applyTo."
applyTo: "**/*.java,**/pom.xml,**/application.yml,**/application.properties"
---

# Arquitetura Java 21 + Spring Boot Hexagonal — Regras Foursys SDD

Estas instruções são aplicadas automaticamente pelo GitHub Copilot em qualquer workspace Spring Boot identificado.

---

## ⚠️ ANTES DE TUDO: calibre pelo projeto real

**Confira o `pom.xml`/`build.gradle` (versão do Java e do Spring Boot) e a estrutura de pacotes
que já existe antes de aplicar qualquer regra abaixo.**

Este documento descreve o padrão-alvo da Foursys. Num projeto que já existe, ele não autoriza
reescrever o que está lá.

| Situação do projeto | Faça |
|---|---|
| **Java 21 + Spring Boot 3.x, já hexagonal** | Aplique todas as regras abaixo |
| **Java 17 ou Spring Boot 2.x** | Mantenha a versão do projeto. Records e Sealed Classes só se a versão suportar. Não proponha upgrade |
| **Arquitetura em camadas (MVC), não hexagonal** | **Siga a arquitetura que já está no projeto.** Não introduza `core/`, `port/`, `adapter/` num projeto MVC — isso cria duas arquiteturas concorrentes no mesmo código |

Regras que valem em **qualquer** projeto: `BigDecimal` para dinheiro, sem PII em log, validação
de input, injeção por construtor.

**Nunca proponha migrar versão de Java/Spring, trocar a arquitetura, nem reescrever código que já
funciona só para atender a este documento.** Migração é decisão do time do projeto. Na dúvida entre
o padrão daqui e o que já está no código, **siga o do projeto** e comente a diferença em vez de impor.

---

## Stack Obrigatória (projetos novos ou já hexagonais)

- **Linguagem:** Java 21 com Records e Sealed Classes onde aplicável
- **Framework:** Spring Boot 3.x
- **Arquitetura:** Hexagonal (Ports & Adapters)
- **Validação:** Bean Validation (JSR 380) — `@NotNull`, `@Size`, `@Valid` em todos os inputs
- **Injeção de Dependência:** via construtor — proibido `@Autowired` em campo
- **Testes:** JUnit 5 + Mockito + AssertJ, cobertura mínima **95%**
- **Valores Monetários:** `BigDecimal` obrigatório — proibido `Double` ou `Float`

---

## Estrutura de Pacotes (Hexagonal)

```
src/main/java/...
├── core/
│   ├── domain/model/          ← Entidades de domínio puras (sem anotações Spring/JPA)
│   ├── usecase/               ← Casos de uso (implementam exatamente 1 InputPort cada)
│   └── exception/             ← Exceções de domínio específicas (nunca RuntimeException genérica)
├── port/
│   ├── input/                 ← Interfaces InputPort (contratos de entrada)
│   └── output/                ← Interfaces OutputPort (contratos de saída)
├── adapter/
│   ├── input/                 ← Quem CHAMA a aplicação (driving)
│   │   ├── controller/        ← Controllers REST + DTOs request/response
│   │   ├── consumer/          ← Kafka Consumers (recebem mensagem = entram na aplicação)
│   │   └── mapper/            ← Conversão DTO ↔ domínio na borda de entrada
│   └── output/                ← Quem a aplicação CHAMA (driven)
│       ├── repository/        ← Repositories + Entities JPA/MongoDB
│       ├── client/            ← Feign Clients + DTOs
│       ├── producer/          ← Kafka Producers (a aplicação publica = sai dela)
│       ├── cache/             ← Redis Cache Adapters
│       └── storage/           ← Blob Storage Adapters
└── config/                    ← Classes @Configuration com @Bean para cada UseCase
```

> **Consumer é entrada, Producer é saída.** O Consumer recebe mensagem de fora e aciona um
> UseCase — mesmo papel de um Controller REST, por isso fica em `adapter/input/`. O Producer é
> acionado pela aplicação para publicar — por isso fica em `adapter/output/`. Inverter isso quebra
> a regra de dependência do hexagonal.

---

## Padrões de Código

### Entidade de Domínio (Record Java 21)

```java
// ✅ Correto — Record imutável sem anotações Spring/JPA
public record Pagamento(
    String id,
    String codigoOperacao,
    BigDecimal valor,          // SEMPRE BigDecimal
    String contaOrigem,
    StatusPagamento status,
    LocalDateTime criadoEm
) {}

// ❌ Proibido na camada de domínio
@Entity
@Table(name = "pagamentos")
public class Pagamento { ... }
```

### UseCase (1 InputPort por UseCase)

```java
// ✅ Correto — classe do core SEM anotação de framework.
// Quem registra o bean é a classe @Configuration (ver seção abaixo).
@RequiredArgsConstructor
public class RealizarPagamentoUseCase implements RealizarPagamentoInputPort {

    private final PagamentoRepositoryOutputPort repositorio;
    private final PagamentoClientOutputPort cliente;

    @Override
    public Pagamento realizar(RealizarPagamentoCommand command) {
        // lógica de negócio aqui
    }
}

// ❌ PROIBIDO: @Component (ou @Service) na classe do UseCase.
// Dois motivos:
// 1. Com @Bean em config/, o Spring registraria o MESMO objeto duas vezes, com o mesmo
//    nome (nome da classe x nome do método) → BeanDefinitionOverrideException e a
//    aplicação NÃO SOBE (allow-bean-definition-overriding é false desde o Boot 2.1).
// 2. core/ não pode depender do framework — é a regra do hexagonal. Quem conhece Spring
//    é só a camada de configuração.
@Component
public class RealizarPagamentoUseCase implements RealizarPagamentoInputPort { ... }
```

### @Bean Obrigatório para cada UseCase

É aqui — e **somente** aqui — que o UseCase vira bean. A classe do UseCase permanece sem
anotação de framework (ver seção anterior).

```java
// ✅ Obrigatório — ausência causa NoSuchBeanDefinitionException em runtime
@Configuration
public class PagamentoConfig {

    @Bean
    public RealizarPagamentoInputPort realizarPagamentoUseCase(
            PagamentoRepositoryOutputPort repositorio,
            PagamentoClientOutputPort cliente) {
        return new RealizarPagamentoUseCase(repositorio, cliente);
    }
}
```

> `@RequiredArgsConstructor` não vai na `@Configuration`: os OutputPorts chegam como
> parâmetro do método `@Bean` (o Spring injeta ali), não como campo da classe de config.

### Controller (Adapter de Entrada)

```java
// ✅ Correto
@RestController
@RequestMapping("/v1/pagamentos")
@RequiredArgsConstructor
@Validated
public class PagamentoController {

    private final RealizarPagamentoInputPort realizarPagamentoUseCase;

    @PostMapping
    public ResponseEntity<PagamentoResponse> realizar(
            @RequestBody @Valid RealizarPagamentoRequest request) {
        var pagamento = realizarPagamentoUseCase.realizar(request.toCommand());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(PagamentoResponse.from(pagamento));
    }
}
```

### Exceções de Domínio

**ANTES de escrever `throw`, liste o que já existe em `domain/exception/` (ou pacote
equivalente) e use a que servir.** Inventar nome de exceção é a causa mais comum de código
gerado que não compila: a classe não existe no projeto e o import quebra.

```java
// ✅ Correto — reusa a exceção que o projeto já tem
throw new NaoEncontradoException("Contrato não encontrado para o ID: " + id);

// ❌ Proibido — nome inventado, sem conferir o projeto.
// NegocioException/DomainException/BusinessRuleException "parecem" existir mas
// normalmente não existem: o código não compila.
throw new NegocioException("Contrato não encontrado");

// ❌ Proibido — genérica
throw new RuntimeException("Contrato não encontrado");
```

Só crie exceção nova quando **nenhuma** das existentes cobrir o caso — e aí seguindo a
convenção de nome do próprio projeto (se lá é `...Exception` em português, mantenha):

```java
// ✅ Criar nova só se realmente não houver equivalente
public class PagamentoNaoEncontradoException extends RuntimeException {
    public PagamentoNaoEncontradoException(String codigoOperacao) {
        super("Pagamento não encontrado: " + codigoOperacao);
    }
}
```

---

## Segurança de Dados Sensíveis (PII)

**PROIBIDO logar dados sensíveis:**
- CPF, CNPJ, senha, token, número de conta, número de cartão

**Mascaramento obrigatório:**
```java
// CPF: ***.***.***-XX
// CNPJ: **.***.***/****.XX
```

**Em classe comum (entidade JPA, DTO com Lombok):**
```java
@ToString.Exclude  // Lombok — em todos os campos PII
private String cpf;
private String senha;
```

**Em `record` — `@ToString.Exclude` NÃO funciona:**

Lombok não atua em `record`, e o `toString()` que o Java gera sozinho **imprime todos os
componentes**, PII incluído. Um `log.info("{}", contrato)` vaza CPF no log. Como entidade de
domínio aqui é `record`, isto vale para a maioria dos casos — escolha uma das duas saídas:

```java
// ✅ Opção 1 (preferida): PII não entra no record de domínio.
// Fica só no DTO da borda, que não é logado.
public record Contrato(Long id, String numeroContrato, BigDecimal valor) {}

// ✅ Opção 2: se o PII precisa estar no record, sobrescreva toString() mascarando.
public record Contrato(Long id, String cpfCliente, BigDecimal valor) {
    @Override
    public String toString() {
        return "Contrato{id=" + id + ", cpfCliente='" + mascarar(cpfCliente)
             + "', valor=" + valor + "}";
    }
}

// ❌ PROIBIDO: escrever toString() que imprime o PII em texto puro,
// e igualmente proibido deixar o toString() automático do record quando há PII.
@Override
public String toString() {
    return "Contrato{cpfCliente='" + cpfCliente + "'}";   // vaza CPF em todo log
}
```

**DTOs de resposta:** nunca retorne campos sensíveis desnecessários.

**BigDecimal para valores monetários:**
```java
// ✅ Correto
private BigDecimal valor;

// ❌ Proibido
private Double valor;
private Float valor;
```

---

## Testes (TDD — cobertura ≥ 95%)

```java
// ✅ Padrão AAA (Arrange, Act, Assert)
@ExtendWith(MockitoExtension.class)
class RealizarPagamentoUseCaseTest {

    @Mock
    private PagamentoRepositoryOutputPort repositorio;

    @InjectMocks
    private RealizarPagamentoUseCase useCase;

    @Test
    void shouldRealizarPagamento_whenCommandIsValid() {
        // Arrange
        var command = new RealizarPagamentoCommand("OP-001", new BigDecimal("100.00"), "001", "002");
        var pagamentoSalvo = new Pagamento("id-1", "OP-001", new BigDecimal("100.00"), "001", StatusPagamento.PENDENTE, LocalDateTime.now());
        given(repositorio.salvar(any())).willReturn(pagamentoSalvo);

        // Act
        var resultado = useCase.realizar(command);

        // Assert
        assertThat(resultado.codigoOperacao()).isEqualTo("OP-001");
        assertThat(resultado.status()).isEqualTo(StatusPagamento.PENDENTE);
    }
}
```

### Cobertura se MEDE, não se afirma

`cobertura ≥ 95%` é o piso do gate do Sonar. Nunca escreva que atingiu sem ter medido:

1. **Rode** `mvn -o clean test` (o `jacoco:report` roda junto na fase `test`)
2. **Leia** `target/site/jacoco/jacoco.csv` e calcule
   `LINE_COVERED / (LINE_COVERED + LINE_MISSED)`
3. **Reporte o número real.** Abaixo de 95%: liste as classes com maior `LINE_MISSED`,
   escreva mais teste e meça de novo — não conclua a tarefa
4. Se não conseguir rodar o Maven no ambiente, diga isso explicitamente em vez de
   presumir o percentual

**Antes de confiar no número, confira o `<excludes>` do `jacoco-maven-plugin` no `pom.xml`.**
Se estiver como `<exclude>${sonar.coverage.exclusions}</exclude>`, o exclude **não está sendo
aplicado** — o JaCoCo exige uma tag por padrão e casa contra caminho de classe (`**/*.class`),
não de fonte (`.java`). Nesse estado o relatório local mostra cobertura menor que a real e o
time escreve teste atrás de meta já atingida. Corrija espelhando o `sonar.coverage.exclusions`,
uma tag por padrão.

> Detalhamento, tabela de tradução dos padrões e o XML do `<goal>check</goal>`:
> skill **`springboot-testing`**.

---

## Regras de Ouro

1. **Siga o Plano:** Não invente classes fora da task list
2. **FILEPATH:** Todo arquivo deve ter `// FILEPATH:` no topo
3. **Build First:** Valide `pom.xml` e `application.yml` antes de gerar classes
4. **Zero Teimosia:** Se houver violação de governança apontada, reabra este documento
5. **Atomic Edits:** Toda edição mantém a integridade total do arquivo
6. **Exceções de Domínio:** Nunca use `RuntimeException` genérica — e **antes de criar exceção nova, confira `domain/exception/` e use a que já existe**. Nome inventado não compila
7. **PII nunca em `toString()`:** `record` imprime todos os campos por padrão e `@ToString.Exclude` não funciona nele. Com PII no `record`, sobrescreva `toString()` mascarando — ou deixe o PII fora do domínio
8. **Escopo Fechado:** Não crie arquivos fora da task list
9. **Proteção de Código Existente:** Nunca modifique código existente sem solicitação explícita
10. **Bean Obrigatório:** Toda `UseCase` em `core/usecase/` exige `@Bean` correspondente em `config/` — **salvo se o projeto já registra por `@Service`/component scan; nesse caso siga o projeto e NÃO adicione `@Bean`** (os dois juntos duplicam o bean e a aplicação não sobe)
11. **Core sem framework:** em projeto novo ou já hexagonal puro, a classe do UseCase não leva `@Component`/`@Service` — quem registra é a `@Configuration`
12. **Cobertura medida:** nunca declare `cobertura ≥ 95%` sem ter rodado `mvn -o clean test` e lido o `jacoco.csv`. Número presumido é violação de governança
