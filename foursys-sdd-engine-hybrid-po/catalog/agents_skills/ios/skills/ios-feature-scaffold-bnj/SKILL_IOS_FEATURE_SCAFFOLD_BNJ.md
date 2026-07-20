---
name: ios-feature-scaffold-bnj
description: |
  Skill de scaffold completo para criar uma nova feature iOS no projeto BNJ (Bradesco iOS).
  Segue o fluxo: 3 perguntas obrigatórias → leitura dos arquivos globais → geração de 15 arquivos
  em ordem (Data → Domain → Presentation → Router → Public). Padrão JourneyCore com BaseViewModel,
  BaseUseCase, RouterManager, ViewState enum, BNSCommunication e Analytics.
  Use este skill sempre que adicionar uma feature nova do zero.
metadata:
  version: "0.1.0"
---

# iOS Feature Scaffold BNJ — Scaffold Completo

Processo completo para criar uma feature do zero no projeto BNJ. Não pule etapas.

---

## PASSO 0 — Perguntas Obrigatórias (Faça ANTES de gerar código)

**1. Essa feature usa UIKit ou SwiftUI?**
- UIKit → `BaseViewController` + `<Nome>View: LiquidView` + `BaseViewController<VM, Router, View>`
- SwiftUI → `BaseSwiftUIViewController` + `<Nome>Screen` (@MainActor + BaseScreen)
- Híbrido → ambos

**2. Essa feature faz chamadas de rede (API)?**
- Sim → criar `<Nome>DTO.swift` + `Repository` com `BNSCommunication` + mapper
- Não → `Repository` com dados locais ou de `InMemoryRepository`

**3. Essa feature precisa passar dados para a próxima tela?**
- Sim → adicionar propriedade no `InMemoryRepositoryInterface` e `InMemoryRepository`

---

## PASSO 1 — Ler Antes de Escrever

Leia estes arquivos antes de gerar qualquer código:

```
Domain/InMemoryRepositoryInterface.swift     → verificar propriedades existentes
Data/InMemoryRepository.swift               → verificar implementação atual
Router/MainRouterManager.swift              → verificar RouterInterfaces implementados
Public/BNJ{Nome}JourneyRoute.swift          → verificar se novo entry point é necessário
```

---

## PASSO 2 — Checklist de Arquivos por Camada

| # | Camada | Arquivo | Quando |
|---|---|---|---|
| 1 | Data | `{Feature}DTO.swift` | Só com rede |
| 2 | Data | `{Feature}Repository.swift` | Sempre |
| 3 | Data | `InMemoryRepository.swift` (atualizar) | Se passar dados para próxima tela |
| 4 | Domain | `{Feature}Model.swift` | Sempre |
| 5 | Domain | `{Feature}RepositoryInterface.swift` | Sempre |
| 6 | Domain | `InMemoryRepositoryInterface.swift` (atualizar) | Se passar dados para próxima tela |
| 7 | Domain | `{Feature}UseCaseInterface.swift` | Sempre |
| 8 | Domain | `{Feature}UseCase.swift` | Sempre |
| 9 | Presentation | `{Feature}AnalyticsInterface.swift` | Sempre |
| 10 | Presentation | `{Feature}Analytics.swift` | Sempre |
| 11 | Presentation | `{Feature}ViewData.swift` | Sempre |
| 12 | Presentation | `{Feature}ViewModel.swift` | Sempre |
| 13 | Presentation | `{Feature}RouterInterface.swift` | Sempre |
| 14 | Presentation | `{Feature}Screen.swift` ou `{Feature}View.swift` + ViewController | Sempre |
| 15 | Router | `MainRouterManager.swift` — adicionar extension | Sempre |
| 16 | Public | `BNJ{Nome}JourneyRoute.swift` — adicionar case | Se novo entry point |

---

## Templates por Arquivo

### 1. {Feature}DTO.swift (somente com rede)

```swift
// Data/{Feature}DTO.swift
struct {Feature}DTO: Decodable, Sendable {
    let id: String
    // propriedades com CodingKeys se JSON usa snake_case
}
```

### 2. {Feature}Repository.swift

#### Sem rede
```swift
// Data/{Feature}Repository.swift
import JourneyCore

final class {Feature}Repository: {Feature}RepositoryInterface {
    func get{Feature}() async throws -> {Feature}Model {
        {Feature}Model(/* dados locais */)
    }
}
```

#### Com rede (BNSCommunication)
```swift
// Data/{Feature}Repository.swift
import BNSCommunication

final class {Feature}Repository: {Feature}RepositoryInterface {
    func get{Feature}() async throws -> {Feature}Model {
        // BNSCommunication faz a chamada HTTP
        // mapper converte DTO → Model
    }

    private func map(_ dto: {Feature}DTO) -> {Feature}Model {
        {Feature}Model(id: dto.id /* ... */)
    }
}
```

### 3. {Feature}Model.swift

```swift
// Domain/{Feature}Model.swift
struct {Feature}Model: Sendable {
    let id: String
    // propriedades em inglês, sem dependências de UI
}
```

### 4. {Feature}RepositoryInterface.swift

```swift
// Domain/{Feature}RepositoryInterface.swift
protocol {Feature}RepositoryInterface {
    func get{Feature}() async throws -> {Feature}Model
}
```

### 5. {Feature}UseCaseInterface.swift

```swift
// Domain/{Feature}UseCaseInterface.swift
@MainActor
protocol {Feature}UseCaseInterface {
    func get{Feature}() async throws -> {Feature}Model
    func save{Item}(with model: {Item}Model)
}
```

### 6. {Feature}UseCase.swift

```swift
// Domain/{Feature}UseCase.swift
import JourneyCore

final class {Feature}UseCase: BaseUseCase<{Feature}RepositoryInterface>, {Feature}UseCaseInterface {
    private var inMemoryRepository: InMemoryRepositoryInterface

    init(repository: {Feature}RepositoryInterface?,
         inMemoryRepository: InMemoryRepositoryInterface) {
        self.inMemoryRepository = inMemoryRepository
        super.init(repository: repository)
    }

    func get{Feature}() async throws -> {Feature}Model {
        try await repository?.get{Feature}() ?? {Feature}Model()
    }

    func save{Item}(with model: {Item}Model) {
        inMemoryRepository.selected{Item} = model
    }
}
```

### 7. {Feature}AnalyticsInterface.swift

```swift
// Presentation/Analytics/{Feature}AnalyticsInterface.swift
protocol {Feature}AnalyticsInterface {
    func track{Feature}ScreenView()
    func trackGet{Feature}()
    func trackSave{Item}()
}
```

### 8. {Feature}Analytics.swift

```swift
// Presentation/Analytics/{Feature}Analytics.swift
import BNSAnalyticsPOCContracts

final class {Feature}Analytics: {Feature}AnalyticsInterface {
    private let bnsAnalytics: BNSAnalyticsPOCContract?

    init(bnsAnalytics: BNSAnalyticsPOCContract?) {
        self.bnsAnalytics = bnsAnalytics
    }

    func track{Feature}ScreenView() {
        bnsAnalytics?.log(event: .screenData,
                          parameters: [Analytics.Events.screenName.value: Strings.{Feature}.Analytics.screenName])
    }

    func trackGet{Feature}() {
        bnsAnalytics?.log(event: .eventData,
                          parameters: [Analytics.Events.buttonClicked.value: Strings.{Feature}.Analytics.get{Feature}])
    }

    func trackSave{Item}() {
        bnsAnalytics?.log(event: .eventData,
                          parameters: [Analytics.Events.buttonClicked.value: Strings.{Feature}.Analytics.save{Item}])
    }
}
```

### 9. {Feature}ViewData.swift

```swift
// Presentation/View/{Feature}ViewData.swift
struct {Feature}ViewData: Equatable {
    let items: [{Feature}ItemViewData]
}

struct {Feature}ItemViewData: Equatable {
    let id: String
    let displayTitle: String
    let displayValue: String
}
```

### 10. {Feature}ViewModel.swift

```swift
// Presentation/ViewModel/{Feature}ViewModel.swift
import JourneyCore

@MainActor
final class {Feature}ViewModel: BaseViewModel<{Feature}AnalyticsInterface, {Feature}UseCaseInterface>, ObservableObject {

    enum ViewState {
        case idle
        case loading
        case success({Feature}ViewData)
        case failure
    }

    enum RouteEvent {          // apenas para SwiftUI
        case onNavigateTo{Next}
    }

    @Published var state: ViewState = .idle
    @Published var routeEvent: RouteEvent?   // apenas para SwiftUI

    private var fetchTask: Task<Void, Never>?

    deinit { fetchTask?.cancel() }

    func onAppear() {
        analytics?.track{Feature}ScreenView()
        load{Feature}()
    }

    private func load{Feature}() {
        state = .loading
        fetchTask?.cancel()
        fetchTask = Task { [weak self] in
            defer { self?.fetchTask = nil }
            do {
                guard let model = try await self?.useCase?.get{Feature}() else {
                    self?.state = .failure
                    return
                }
                self?.state = .success(self?.map(model) ?? {Feature}ViewData(items: []))
                self?.analytics?.trackGet{Feature}()
            } catch is CancellationError {
                return
            } catch {
                self?.state = .failure
            }
        }
    }

    func retryLastAction() { load{Feature}() }

    func resetRouteEventAndRestoreState() { routeEvent = nil }   // apenas SwiftUI

    private func map(_ model: {Feature}Model) -> {Feature}ViewData {
        {Feature}ViewData(items: model.items.map { {Feature}ItemViewData(id: $0.id, displayTitle: $0.name, displayValue: $0.value) })
    }
}
```

### 11. {Feature}RouterInterface.swift

```swift
// Presentation/View/{Feature}RouterInterface.swift
import UIKit

@MainActor
protocol {Feature}RouterInterface: AnyObject {
    func on{Feature}Finished()
    func onNavigateTo{Next}()
}
```

### 12a. {Feature}Screen.swift (SwiftUI)

```swift
// Presentation/View/{Feature}Screen.swift
import SwiftUI
import JourneyCore

@MainActor
struct {Feature}Screen: BaseScreen {
    @ObservedObject var viewModel: {Feature}ViewModel
    let router: {Feature}RouterInterface

    var body: some View {
        view
            .onAppear { viewModel.onAppear() }
            .onChange(of: viewModel.routeEvent) { event in
                handleRouteEvent(event)
            }
    }

    @ViewBuilder
    var view: some View {
        switch viewModel.state {
        case .idle: EmptyView()
        case .loading: {Feature}LoadingView()
        case .success(let data): {Feature}SuccessView(data: data, onSelect: { index in
                viewModel.onItemSelected(index)
            })
        case .failure: ErrorView(retryAction: { viewModel.retryLastAction() })
        }
    }

    private func handleRouteEvent(_ event: {Feature}ViewModel.RouteEvent?) {
        guard let event else { return }
        switch event {
        case .onNavigateTo{Next}: router.onNavigateTo{Next}()
        }
        viewModel.resetRouteEventAndRestoreState()
    }
}
```

### 12b. {Feature}ViewController.swift (SwiftUI host)

```swift
// Presentation/View/{Feature}ViewController.swift
import JourneyCore

final class {Feature}ViewController: BaseSwiftUIViewController<{Feature}ViewModel, {Feature}RouterInterface, {Feature}Screen> {
    override func makeScreen() throws -> {Feature}Screen {
        {Feature}Screen(viewModel: viewModel, router: router)
    }
}
```

### 13. RouterManager — adicionar extension

```swift
// Router/MainRouterManager.swift
extension MainRouterManager: {Feature}RouterInterface {
    func on{Feature}Finished() {
        navigationController?.popViewController(animated: true)
    }

    func onNavigateTo{Next}() {
        let repository = {Next}Repository()
        let useCase = {Next}UseCase(repository: repository, inMemoryRepository: inMemoryRepository)
        let analytics = {Next}Analytics(bnsAnalytics: bnsAnalytics)
        let viewModel = {Next}ViewModel(analytics: analytics, useCase: useCase)
        let controller = {Next}ViewController(viewModel: viewModel, router: self)
        navigationController?.pushViewController(controller, animated: true)
    }
}
```

---

## Skills relacionadas

- `SKILL_IOS_ARCHITECTURE_BNJ` — visão geral das camadas e nomenclaturas
- `SKILL_IOS_VIEWMODEL_BNJ` — detalhes de ViewState, Task management, execute()
- `SKILL_IOS_ROUTER_BNJ` — RouterManager, JourneyRoute, Launcher
- `SKILL_IOS_USECASE_BNJ` — BaseUseCase, InMemoryRepository, interfaces
- `SKILL_IOS_VIEWDATA_DTO` — DTO (Decodable+Sendable) e ViewData (Equatable)
- `SKILL_IOS_ANALYTICS_BNJ` — BNSAnalytics, prefixo track, sem strings literais
