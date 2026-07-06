---
name: 'springboot-hexagonal-arch'
description: "Regras de arquitetura Java 21 + Spring Boot Hexagonal sempre-ativas para o GitHub Copilot. Instaladas em .github/copilot-instructions.md do workspace, garantem que o Copilot siga Hexagonal Architecture, TDD, PII safety e padrões Java 21 em qualquer contexto — sem necessidade de rodar uma fase SDD."
metadata:
  version: "1.0.0"
applyTo: "**/*.java, **/pom.xml, **/application.yml, **/application.properties"
---

# Arquitetura Java 21 + Spring Boot Hexagonal — Regras Foursys SDD

Estas instruções são aplicadas automaticamente pelo GitHub Copilot em qualquer workspace Spring Boot identificado.

---

## Stack Obrigatória

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
│   ├── input/
│   │   └── controller/        ← Controllers REST + DTOs request/response
│   └── output/
│       ├── repository/        ← Repositories + Entities JPA/MongoDB
│       ├── client/            ← Feign Clients + DTOs
│       ├── producer/          ← Kafka Producers
│       ├── consumer/          ← Kafka Consumers
│       ├── cache/             ← Redis Cache Adapters
│       └── storage/           ← Blob Storage Adapters
└── config/                    ← Classes @Configuration com @Bean para cada UseCase
```

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
