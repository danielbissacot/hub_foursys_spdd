---
name: springboot-autorizador
description: |
  Implementa o fluxo de introspecção do Autorizador Corporativo (gacb-lib-authz-transacao)
  em endpoints Spring Boot. Cobre DTO, injeção do serviço, lógica de validação JWE
  e 4 cenários de teste JUnit 5.
  Use quando: adicionar autorização transacional em um endpoint PUT/POST que requer
  validação do token JWE antes de efetivar uma operação sensível.
metadata:
  version: "1.0.0"
---

# Skill: Autorizador Corporativo — Introspecção no Controller

Guia completo para implementar o Autorizador Corporativo em um endpoint Spring Boot.

## Fluxo de autorização

```
Frontend              BFF (este projeto)         Autorizador
   |                       |                          |
   |--[tokenJWE]---------->|                          |
   |                       |--[Leap + tokenJWE]------>|
   |                       |<--[IntrospectResponse]---|
   |                       |                          |
   |                       |--[se active && efetivar]->
   |                       |      chama use case      |
```

1. Frontend envia `tokenJWE` no corpo da requisição
2. BFF recebe o `Authorization` (token Leap) pelo header via API Gateway
3. A lib chama o endpoint de introspecção com ambos os tokens
4. Se `active=true` e `acao=efetivar`, prossegue com a transação

---

## Pré-requisitos (já atendidos neste projeto)

- Dependência `gacb-lib-authz-transacao:2.0.0` no `pom.xml` ✅
- `OkHttpConfig` configurado em `br.com.bradesco.mya.cartoes.config` ✅
- Variável de ambiente `ENV_AUTORIZADOR_INTROSPECT_URL` configurada no ambiente ✅

---

## Passo 1 — Adicionar `tokenJWE` ao DTO/Request

```java
public record MeuRequestDTO(

    @NotNull(message = "O campo idXxx nao pode ser nulo")
    Integer idXxx,

    // ... demais campos existentes ...

    @NotNull(message = "O campo tokenJWE nao pode ser nulo")
    String tokenJWE
) {}
```

> O `tokenJWE` é o token gerado pelo frontend após o usuário confirmar a operação. Deve vir no corpo da requisição junto com os dados da transação.

---

## Passo 2 — Injetar `IntrospectAutorizacaoService` no Controller

```java
import br.com.gacb.lib.authz.transacao.entity.AcaoAutorizacao;
import br.com.gacb.lib.authz.transacao.entity.IntrospectResponse;
import br.com.gacb.lib.authz.transacao.exception.AuthzIntrospectException;
import br.com.gacb.lib.authz.transacao.service.IntrospectAutorizacaoService;

@RestController
@RequestMapping("/api/meu-recurso")
@AllArgsConstructor
public class MeuController {

    private static final Logger log = LoggerFactory.getLogger(MeuController.class);

    private final IntrospectAutorizacaoService autorizacaoService;  // <- ADICIONAR
    private final MeuInputPort meuUseCase;
}
```

---

## Passo 3 — Implementar introspecção no método do endpoint

**Regra obrigatória**: introspecção **antes** de chamar qualquer use case.

```java
@PutMapping
public ResponseEntity<MeuResponseDTO> alterar(
        @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization,
        @RequestConta Conta conta,
        @RequestCliente Cliente cliente,
        @Valid @RequestBody MeuRequestDTO request) {

    log.info("Requisicao alterar recebida para: {}", request.idXxx());

    try {
        final IntrospectResponse introspectResponse =
            autorizacaoService.verificaTokenAutorizacao(authorization, request.tokenJWE());

        if (!introspectResponse.active() || !AcaoAutorizacao.efetivar.equals(introspectResponse.acao())) {
            log.info("Operacao nao autorizada - id: {} - introspect: {}", request.idXxx(), introspectResponse);
            throw new MinhaException("Cliente nao autorizado a realizar esta operacao");
        }

        log.info("Token de autorizacao verificado com sucesso - id: {}", request.idXxx());

    } catch (AuthzIntrospectException e) {
        log.error("Falha na verificacao do token de autorizacao: {} - {}", e.getErrCode(), e.getErrMsg());
        throw new MinhaException(e.getErrMsg(), e);
    }

    var response = meuUseCase.executar(request, authorization);

    log.info("Operacao realizada com sucesso para id: {}", request.idXxx());

    return ResponseEntity.ok(response);
}
```

### Regras críticas

| Regra | Motivo |
|-------|--------|
| `verificaTokenAutorizacao(authorization, tokenJWE)` — nessa ordem | `authorization` = Leap token (header); `tokenJWE` = token do frontend (body) |
| Verificar `active() && efetivar` **antes** de chamar o use case | Evitar efetivação sem autorização válida |
| Usar `AcaoAutorizacao.efetivar` (minúsculo) | Valor real do enum na lib v2.0.0 |
| Capturar `AuthzIntrospectException` e relançar como exception de negócio | Encapsular erros de infra como erros de domínio |

### IntrospectResponse — atributos principais

| Campo | Tipo | Descrição |
|---|---|---|
| `active()` | boolean | `true` se o token é válido e não expirou |
| `acao()` | enum | `efetivar`, `represar`, etc. |
| `sub()` | String | CPF do usuário (ex: `cpf#11122233399`) |
| `idTransacao()` | String | ID da transação autorizada |
| `exp()` | long | Timestamp de expiração |

### Cenários possíveis

| Cenário | Comportamento |
|---|---|
| `active=true`, `efetivar` | Prosseguir com a transação ✅ |
| `active=false` | Rejeitar — token expirado ou inválido ❌ |
| `active=true`, `represar` | Aguardar represamento — tratar conforme negócio ⏸ |
| `AuthzIntrospectException` | Comunicação falhou — lançar exception de negócio ❌ |

---

## Passo 4 — Testes Unitários

### Estrutura base

```java
@ExtendWith(MockitoExtension.class)
class MeuControllerTest {

    @Mock
    private IntrospectAutorizacaoService autorizacaoService;  // <- ADICIONAR

    @Mock
    private MeuInputPort meuUseCase;

    @InjectMocks
    private MeuController controller;

    private static final String AUTHORIZATION = "Bearer token123";
    private static final String TOKEN_JWE = "eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZHQ00ifQ...";
}
```

### Cenário 1 — Sucesso (autorizado + efetivar)

```java
@Test
@DisplayName("Dado token válido com ação efetivar, Quando alterar é chamado, Então executa use case e retorna 200")
void dadoTokenValidoComAcaoEfetivar_quandoAlterar_entaoExecutaUseCaseERetorna200() {
    MeuRequestDTO request = new MeuRequestDTO(1, TOKEN_JWE);
    IntrospectResponse introspect = mock(IntrospectResponse.class);
    when(introspect.active()).thenReturn(true);
    when(introspect.acao()).thenReturn(AcaoAutorizacao.efetivar);
    when(autorizacaoService.verificaTokenAutorizacao(AUTHORIZATION, TOKEN_JWE)).thenReturn(introspect);
    when(meuUseCase.executar(request, AUTHORIZATION)).thenReturn(mockResponse);

    ResponseEntity<MeuResponseDTO> result = controller.alterar(AUTHORIZATION, conta, cliente, request);

    assertEquals(HttpStatus.OK, result.getStatusCode());
    verify(autorizacaoService).verificaTokenAutorizacao(AUTHORIZATION, TOKEN_JWE);
    verify(meuUseCase).executar(request, AUTHORIZATION);
}
```

### Cenário 2 — Token ativo mas ação não é efetivar

```java
@Test
@DisplayName("Dado token ativo com ação não efetivar, Quando alterar é chamado, Então lança exception sem chamar use case")
void dadoTokenAtivoComAcaoNaoEfetivar_quandoAlterar_entaoLancaException() {
    IntrospectResponse introspect = mock(IntrospectResponse.class);
    when(introspect.active()).thenReturn(true);
    when(introspect.acao()).thenReturn(null);
    when(autorizacaoService.verificaTokenAutorizacao(AUTHORIZATION, TOKEN_JWE)).thenReturn(introspect);

    assertThrows(MinhaException.class,
        () -> controller.alterar(AUTHORIZATION, conta, cliente, new MeuRequestDTO(1, TOKEN_JWE)));
    verify(meuUseCase, never()).executar(any(), any());
}
```

### Cenário 3 — Token inativo

```java
@Test
@DisplayName("Dado token inativo, Quando alterar é chamado, Então lança exception sem chamar use case")
void dadoTokenInativo_quandoAlterar_entaoLancaException() {
    IntrospectResponse introspect = mock(IntrospectResponse.class);
    when(introspect.active()).thenReturn(false);
    when(autorizacaoService.verificaTokenAutorizacao(AUTHORIZATION, TOKEN_JWE)).thenReturn(introspect);

    assertThrows(MinhaException.class,
        () -> controller.alterar(AUTHORIZATION, conta, cliente, new MeuRequestDTO(1, TOKEN_JWE)));
    verify(meuUseCase, never()).executar(any(), any());
}
```

### Cenário 4 — Falha na comunicação (AuthzIntrospectException)

```java
@Test
@DisplayName("Dado falha no autorizador, Quando alterar é chamado, Então lança exception de negócio")
void dadoFalhaNaIntrospecao_quandoAlterar_entaoLancaExcecaoDeNegocio() {
    AuthzIntrospectException authzException = new AuthzIntrospectException("ERR_001", "Erro de autorizacao");
    when(autorizacaoService.verificaTokenAutorizacao(AUTHORIZATION, TOKEN_JWE)).thenThrow(authzException);

    MinhaException ex = assertThrows(MinhaException.class,
        () -> controller.alterar(AUTHORIZATION, conta, cliente, new MeuRequestDTO(1, TOKEN_JWE)));
    assertEquals("Erro de autorizacao", ex.getMessage());
    assertEquals(authzException, ex.getCause());
    verify(meuUseCase, never()).executar(any(), any());
}
```

---

## Checklist final

- [ ] `tokenJWE` adicionado ao DTO com `@NotNull`
- [ ] `IntrospectAutorizacaoService` declarado como `private final` no controller
- [ ] Introspecção chamada antes do use case
- [ ] Verificação `active() && efetivar` com `AcaoAutorizacao.efetivar` (minúsculo)
- [ ] `AuthzIntrospectException` capturada e relançada como exception de domínio
- [ ] Logs informativos antes e depois da introspecção (sem PII)
- [ ] 4 cenários de teste: sucesso, ação inválida, token inativo, exception
- [ ] Testes existentes do endpoint atualizados para mockar o `autorizacaoService`
