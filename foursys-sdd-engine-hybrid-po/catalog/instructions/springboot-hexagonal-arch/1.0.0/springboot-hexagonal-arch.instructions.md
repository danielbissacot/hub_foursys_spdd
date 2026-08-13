---
name: 'springboot-hexagonal-arch'
description: "Regras de arquitetura Java + Spring Boot Hexagonal sempre-ativas para o GitHub Copilot. Instaladas pelo Hub em .github/instructions/ do workspace, fazem o Copilot seguir Hexagonal, TDD, PII safety e padrões Java em qualquer contexto — sem precisar rodar uma fase SDD. A versão fica na pasta (1.0.0/), não no frontmatter: instructions do Copilot só aceitam name, description e applyTo."
applyTo: "**/*.java, **/pom.xml, **/application.yml, **/application.properties"
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
// ✅ Correto
@Component
@RequiredArgsConstructor
public class RealizarPagamentoUseCase implements RealizarPagamentoInputPort {

    private final PagamentoRepositoryOutputPort repositorio;
    private final PagamentoClientOutputPort cliente;

    @Override
    public Pagamento realizar(RealizarPagamentoCommand command) {
        // lógica de negócio aqui
    }
}
```

### @Bean Obrigatório para cada UseCase

```java
// ✅ Obrigatório — ausência causa NoSuchBeanDefinitionException em runtime
@Configuration
@RequiredArgsConstructor
public class PagamentoConfig {

    @Bean
    public RealizarPagamentoInputPort realizarPagamentoUseCase(
            PagamentoRepositoryOutputPort repositorio,
            PagamentoClientOutputPort cliente) {
        return new RealizarPagamentoUseCase(repositorio, cliente);
    }
}
```

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

```java
// ✅ Correto — exceções de domínio específicas
public class PagamentoNaoEncontradoException extends RuntimeException {
    public PagamentoNaoEncontradoException(String codigoOperacao) {
        super("Pagamento não encontrado: " + codigoOperacao);
    }
}

// ❌ Proibido
throw new RuntimeException("Pagamento não encontrado");
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

**Anotações obrigatórias:**
```java
@ToString.Exclude  // Lombok — em todos os campos PII em entidades JPA
private String cpf;
private String senha;
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

---

## Regras de Ouro

1. **Siga o Plano:** Não invente classes fora da task list
2. **FILEPATH:** Todo arquivo deve ter `// FILEPATH:` no topo
3. **Build First:** Valide `pom.xml` e `application.yml` antes de gerar classes
4. **Zero Teimosia:** Se houver violação de governança apontada, reabra este documento
5. **Atomic Edits:** Toda edição mantém a integridade total do arquivo
6. **Exceções de Domínio:** Nunca use `RuntimeException` genérica
7. **Escopo Fechado:** Não crie arquivos fora da task list
8. **Proteção de Código Existente:** Nunca modifique código existente sem solicitação explícita
9. **Bean Obrigatório:** Toda `UseCase` em `core/usecase/` exige `@Bean` correspondente em `config/`
