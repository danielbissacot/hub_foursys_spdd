---
name: ios-viewmodel-bnj
description: |
  Skill para criar ViewModels no projeto BNJ (Bradesco iOS) usando JourneyCore.
  Cobre BaseViewModel<Analytics, UseCase>, @MainActor, ObservableObject, @Published ViewState,
  RouteEvent para SwiftUI, gerenciamento de Task (manual e via execute()), deinit obrigatório,
  mapper Model→ViewData e chamada de analytics. Use sempre ao criar ou atualizar um ViewModel BNJ.
metadata:
  version: "0.1.0"
---

# iOS ViewModel BNJ — BaseViewModel + ViewState + Task Management

Padrão obrigatório para ViewModels no projeto BNJ.

## Declaração e Herança

```swift
import JourneyCore

@MainActor
final class {Feature}ViewModel: BaseViewModel<{Feature}AnalyticsInterface, {Feature}UseCaseInterface>, ObservableObject {
    // ...
}
```

- `BaseViewModel<AnalyticsInterface, UseCaseInterface>` — herança obrigatória
- `@MainActor` — annotation obrigatória
- `ObservableObject` — quando usar telas SwiftUI
- `import JourneyCore` — import obrigatório

## ViewState — Enum de Estados

```swift
extension {Feature}ViewModel {
    enum ViewState {
        case idle
        case loading
        case success({Feature}ViewData)
        case failure
    }

    // Para SwiftUI — eventos de navegação
    enum RouteEvent {
        case onNavigateToNextScreen
        case onGoBack
    }
}
```

## Published Properties

```swift
@Published var state: ViewState = .idle
@Published var routeEvent: RouteEvent?   // apenas SwiftUI
```

## Gerenciamento de Task — Opção 1: Manual

```swift
private var fetchTask: Task<Void, Never>?

deinit {
    fetchTask?.cancel()
}

func load{Feature}() {
    state = .loading
    fetchTask?.cancel()
    fetchTask = Task { [weak self] in
        defer { self?.fetchTask = nil }

        do {
            guard let data = try await self?.useCase?.get{Feature}() else {
                self?.state = .failure
                return
            }
            let viewData = self?.map(data)
            self?.state = .success(viewData ?? {Feature}ViewData())
            self?.analytics?.trackGet{Feature}()

        } catch is CancellationError {
            return   // cancelamento não é erro de API

        } catch {
            self?.state = .failure
        }
    }
}
```

## Gerenciamento de Task — Opção 2: via `execute()` (JourneyCore)

```swift
private var fetchTask: Task<Void, Never>?

deinit {
    fetchTask?.cancel()
}

func load{Feature}() {
    state = .loading
    execute(
        task: \.fetchTask,
        operation: { [weak self] () async throws -> {Feature}Model? in
            try await self?.useCase?.get{Feature}()
        },
        onSuccess: { [weak self] model in
            guard let model else {
                self?.state = .failure
                return
            }
            let viewData = self?.map(model)
            self?.state = .success(viewData ?? {Feature}ViewData())
            self?.analytics?.trackGet{Feature}()
        },
        onError: { [weak self] _ in
            self?.state = .failure
        }
    )
}
```

## Mapper Model → ViewData (no ViewModel)

```swift
private func map(_ model: {Feature}Model) -> {Feature}ViewData {
    {Feature}ViewData(
        items: model.items.map { item in
            {Feature}ItemViewData(
                id: item.id,
                displayTitle: item.name,
                displayValue: item.value
            )
        }
    )
}
```

## Métodos de Ação (chamados pela View/ViewController)

```swift
func onAppear() {
    analytics?.track{Feature}ScreenView()
    load{Feature}()
}

func save{Feature}(with index: Int) {
    // ação do usuário — nova Task se necessário
}

func retryLastAction() {
    load{Feature}()
}

// SwiftUI — reset do routeEvent após navegação
func resetRouteEventAndRestoreState() {
    routeEvent = nil
}
```

## Regras

| Regra | Detalhe |
|---|---|
| `BaseViewModel<A, U>` | Herança obrigatória — dá acesso a `useCase` e `analytics` |
| `@MainActor` | Garante atualização de UI na main thread |
| `ObservableObject` | Necessário para SwiftUI — `@ObservedObject` na Screen |
| `deinit` | SEMPRE cancelar tasks pendentes |
| `CancellationError` | SEMPRE tratar separado dos outros erros |
| `[weak self]` | SEMPRE dentro de Tasks para evitar retain cycle |
| `defer { self?.task = nil }` | Limpar referência após conclusão (gerenciamento manual) |
| Analytics | Chamados no ViewModel, não na View |
| Mapper | Model → ViewData no ViewModel, nunca na View |

## Proibições

| Proibido | Alternativa |
|---|---|
| `async func` exposto à View | `func` síncrono que inicia uma `Task` internamente |
| Lógica de negócio no ViewModel | UseCase |
| ViewData com dados não formatados | Formatar no ViewModel antes de criar ViewData |
| `@Observable` | `ObservableObject` + `@Published` |
| Sem `deinit` | Task deve sempre ser cancelada ao desalocar |
| Navegar no ViewModel (UIKit) | Chamar router na ViewController |
| Navegar no ViewModel (SwiftUI) | `routeEvent = .onNavigateToNextScreen` |
