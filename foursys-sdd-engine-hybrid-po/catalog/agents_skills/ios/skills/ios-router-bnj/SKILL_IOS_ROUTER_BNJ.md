---
name: ios-router-bnj
description: |
  Skill para criar e registrar navegação no projeto BNJ (Bradesco iOS).
  Cobre RouterInterface (@MainActor + AnyObject + prefixo "on"), RouterManager (class herdável,
  instancia todas as dependências, implementa RouterInterfaces via extension), JourneyRoute enum,
  JourneyRouterDelegate, Dependencies struct e Launcher com routerFactories.
  Use sempre que adicionar uma nova tela ou fluxo ao projeto BNJ iOS.
metadata:
  version: "0.1.0"
---

# iOS Router BNJ — RouterInterface + RouterManager + Launcher

Padrão de navegação do projeto BNJ. Usa UIKit navigation stack gerenciado pelo RouterManager.

## 1. RouterInterface

```swift
// Presentation/{Feature}/{Feature}RouterInterface.swift
import UIKit

@MainActor
protocol {Feature}RouterInterface: AnyObject {
    func on{Feature}Finished()
    func on{Action}ButtonTapped()
    func onNavigateTo{NextFeature}()
}
```

Regras:
- `@MainActor` — obrigatório
- `: AnyObject` — obrigatório (evita retain cycle)
- Métodos com prefixo `on` — nomenclatura padrão do BNJ
- Sem retorno (navegação é side-effect)

## 2. RouterManager — Classe Principal

```swift
// Router/MainRouterManager.swift
import UIKit
import SwiftUI
import JourneyCore
import BNSAnalyticsPOCContracts
import BNSNavigationContracts

class MainRouterManager: RouterManagerInterface {
    weak var navigationController: BNSNavigationControllerProtocol?
    weak var journeyRouterDelegate: (any BNJ{Nome}JourneyRouterDelegate)?

    let inMemoryRepository = InMemoryRepository()
    var bnsAnalytics: BNSAnalyticsPOCContract?

    func start(with dependencies: BNJ{Nome}Dependencies) throws {
        try store(dependencies)
        let startViewController = getStartViewController()
        navigationController?.pushViewController(startViewController, animated: false)
    }

    private func store(_ dependencies: BNJ{Nome}Dependencies) throws {
        self.bnsAnalytics = try dependencies.provider.get() as BNSAnalyticsPOCContract
        self.navigationController = dependencies.navigationController
        self.journeyRouterDelegate = dependencies.journeyRouterDelegate
    }

    func getStartViewController() -> UIViewController {
        let analytics = HomeAnalytics(bnsAnalytics: bnsAnalytics)
        let viewModel = HomeViewModel(analytics: analytics)
        return HomeViewController(contentView: HomeView(), viewModel: viewModel, router: self)
    }
}
```

Regras:
- `class` (não `final`) — permite herança por SubfluxoRouterManagers
- `weak var navigationController` — evita retain cycle
- `weak var journeyRouterDelegate` — evita retain cycle
- `let inMemoryRepository` — instância única compartilhada entre telas
- `func getStartViewController()` — override em subclasses para entrar em fluxo diferente

## 3. Criar Telas no RouterManager (via extension)

```swift
extension MainRouterManager: {Feature}RouterInterface {
    func on{Feature}Finished() {
        navigationController?.popViewController(animated: true)
    }

    func onNavigateTo{NextFeature}() {
        // Instanciar tudo aqui — Repository, UseCase, Analytics, ViewModel, ViewController
        let repository = {NextFeature}Repository()
        let useCase = {NextFeature}UseCase(repository: repository,
                                            inMemoryRepository: inMemoryRepository)
        let analytics = {NextFeature}Analytics(bnsAnalytics: bnsAnalytics)
        let viewModel = {NextFeature}ViewModel(analytics: analytics, useCase: useCase)

        // UIKit:
        let controller = {NextFeature}ViewController(contentView: {NextFeature}View(),
                                                      viewModel: viewModel, router: self)
        // SwiftUI:
        // let controller = {NextFeature}ViewController(viewModel: viewModel, router: self)

        navigationController?.pushViewController(controller, animated: true)
    }
}
```

Regra: **NUNCA** passar Domain Models como argumento no RouterManager — usar `inMemoryRepository`.

## 4. SubfluxoRouterManager (herança)

```swift
// Router/{SubFluxo}RouterManager.swift
import UIKit
import JourneyCore

class {SubFluxo}RouterManager: MainRouterManager {
    override func getStartViewController() -> UIViewController {
        let repository = {Feature}Repository()
        let useCase = {Feature}UseCase(repository: repository,
                                        inMemoryRepository: inMemoryRepository)
        let analytics = {Feature}Analytics(bnsAnalytics: bnsAnalytics)
        let viewModel = {Feature}ViewModel(analytics: analytics, useCase: useCase)
        return {Feature}ViewController(viewModel: viewModel, router: self)
    }
}
```

Nota: métodos que precisam de `override` não podem ficar em `extension` (limitação do Xcode).

## 5. JourneyRoute

```swift
// Public/BNJ{Nome}JourneyRoute.swift
import BNSNavigationContracts

public enum BNJ{Nome}JourneyRoute: BNSNavigationJourneyRoute, CaseIterable {
    case main
    case {subFluxo1}
    case {subFluxo2}

    public var scope: String { "{nomeJornada}" }
    public var name: String { "{nomeJornada}" }
    public var destination: String { String(describing: self) }

    public static func get(from route: BNSNavigationJourneyRoute) -> BNJ{Nome}JourneyRoute {
        BNJ{Nome}JourneyRoute.allCases.first { $0.destination == route.destination } ?? .main
    }
}
```

## 6. JourneyRouterDelegate

```swift
// Public/BNJ{Nome}JourneyRouterDelegate.swift
import UIKit

@MainActor
public protocol BNJ{Nome}JourneyRouterDelegate: AnyObject {
    func onExit(in viewController: UIViewController?, with value: [String: Any]?)
}
```

## 7. Dependencies

```swift
// Public/BNJ{Nome}Dependencies.swift
import UIKit
import BNSDIContracts
import BNSNavigationContracts

public struct BNJ{Nome}Dependencies {
    let navigationController: BNSNavigationControllerProtocol
    let journeyRouterDelegate: BNJ{Nome}JourneyRouterDelegate
    let provider: BNSDIProviderGet
    let route: BNJ{Nome}JourneyRoute
    let parameters: [String: Any]?

    public init(route: BNJ{Nome}JourneyRoute,
                navigationController: BNSNavigationControllerProtocol,
                journeyRouterDelegate: BNJ{Nome}JourneyRouterDelegate,
                provider: BNSDIProviderGet,
                and parameters: [String: Any]?) {
        self.route = route
        self.navigationController = navigationController
        self.journeyRouterDelegate = journeyRouterDelegate
        self.provider = provider
        self.parameters = parameters
    }
}
```

## 8. Launcher

```swift
// Public/BNJ{Nome}Launcher.swift
import UIKit

@MainActor
public protocol BNJ{Nome}LauncherProtocol {
    func start(with dependencies: BNJ{Nome}Dependencies) throws
}

final public class BNJ{Nome}Launcher: BNJ{Nome}LauncherProtocol {
    private let routerFactories: [BNJ{Nome}JourneyRoute: () -> RouterManagerInterface] = [
        .main: { MainRouterManager() },
        .{subFluxo1}: { {SubFluxo1}RouterManager() },
        .{subFluxo2}: { {SubFluxo2}RouterManager() }
    ]

    public init() {}

    public func start(with dependencies: BNJ{Nome}Dependencies) throws {
        let routerManager = routerFactories[dependencies.route]
        try routerManager?().start(with: dependencies)
    }
}
```

## Regras

| Regra | Detalhe |
|---|---|
| `class` (não `final`) | RouterManager herdável por subfluxos |
| `weak var` navigation + delegate | Evitar retain cycle |
| `let inMemoryRepository` | Uma instância, compartilhada entre telas do fluxo |
| Extensão por RouterInterface | Um `extension MainRouterManager: {Feature}RouterInterface` por tela |
| Sem Domain Models nos parâmetros | Usar `inMemoryRepository` para transferir dados |
| `routerFactories` no Launcher | Todo JourneyRoute deve ter RouterManager mapeado |
