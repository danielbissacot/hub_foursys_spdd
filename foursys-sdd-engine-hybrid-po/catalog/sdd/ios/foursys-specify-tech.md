# Specify Tech iOS BNJ — Foursys SDD

Com base na User Story validada, aprofunde a especificação técnica para o contexto iOS BNJ (JourneyCore / Bradesco).

## Passo 3 — Especificação Técnica iOS BNJ

### 3.1 Entidades de Domínio (Domain Model)

Defina os Models Swift que representam os dados da feature:

```swift
struct {Feature}Model: Sendable {
    let id: String
    // propriedades em inglês, sem dependências de UI
}
```

Perguntas a responder:
- Quais campos compõem o model?
- Ela precisa ser passada para a próxima tela via `InMemoryRepository`?
- Precisa de subtipos (enums aninhados) no mesmo arquivo?

### 3.2 DTO (Data Layer — somente se houver rede)

```swift
struct {Feature}DTO: Decodable, Sendable {
    let id: String
    // somente let, sem init manual
    // CodingKeys se JSON usa snake_case
}
```

### 3.3 ViewData (Presentation Layer)

```swift
struct {Feature}ViewData: Equatable {
    let items: [{Feature}ItemViewData]
    // propriedades já formatadas para a tela
}
```

Mapeamento `Model → ViewData` é responsabilidade do ViewModel.

### 3.4 ViewState (Estados da Tela)

```swift
enum ViewState {
    case idle
    case loading
    case success({Feature}ViewData)
    case failure
    // adicione cases específicos se necessário:
    // case loadingAction({Feature}ViewData)  // para loading parcial com dados visíveis
    // case empty
}
```

### 3.5 Fluxo de Dados

```
RouterManager instancia tudo
    ↓
ViewController → viewModel.onAppear() / viewModel.onAction()
    ↓
ViewModel → Task { useCase?.get{Feature}() }
    ↓
UseCase → repository?.get{Feature}()
    ↓
Repository → BNSCommunication → API → DTO → mapper → Model
    ↓
UseCase retorna Model → ViewModel mapeia → ViewData → @Published state → Screen/View
    ↓
Screen switch state → LoadingView / SuccessView / ErrorView
```

### 3.6 RouterInterface (Eventos de Navegação)

| Método | Quando chamar |
|---|---|
| `on{Feature}Finished()` | Botão Voltar / pop |
| `onNavigateTo{Next}()` | Botão Continuar / seleção de item |

### 3.7 Contrato de API (se aplicável)

| Endpoint | Método | Response DTO | Notes |
|---|---|---|---|
| `/{endpoint}` | GET | `{Feature}DTO` | |
| `/{endpoint}` | POST | `{Feature}DTO` | |

### 3.8 InMemoryRepository (se passar dados entre telas)

Adicionar ao `InMemoryRepositoryInterface`:

```swift
var selected{Feature}: {Feature}Model? { get set }
```

### 3.9 Permissões (Info.plist)

| Chave | Justificativa para o usuário |
|---|---|
| `NSCameraUsageDescription` | "Para fotografar o documento" |
| `NSLocationWhenInUseUsageDescription` | "Para encontrar agências próximas" |

### 3.10 Critérios de Aceite Técnicos

- [ ] RouterManager instancia toda a cadeia de dependências
- [ ] ViewState cobre todos os estados: loading, success, failure, empty (se aplicável)
- [ ] ViewModel gerencia Tasks com `deinit { task?.cancel() }`
- [ ] `CancellationError` tratado separadamente dos outros erros
- [ ] InMemoryRepository atualizado (se dados passados entre telas)
- [ ] Analytics rastreia: screenView + ações principais
- [ ] Sem strings literais no código — usar `Strings.{Feature}.*`
- [ ] Tela funciona em portrait e landscape
- [ ] Acessibilidade: VoiceOver navega corretamente
