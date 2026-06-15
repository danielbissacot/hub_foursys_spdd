---
name: ios-analytics-bnj
description: |
  Skill para criar a camada de Analytics no projeto BNJ (Bradesco iOS).
  Cobre AnalyticsInterface (métodos com prefixo "track"), Analytics class (import BNSAnalytics,
  bnsAnalytics?.log()), injeção no ViewModel via BaseViewModel<AnalyticsInterface, UseCaseInterface>,
  e a regra de sem strings literais no arquivo de Analytics.
  Use sempre ao adicionar tracking de eventos ou views em uma nova feature.
metadata:
  version: "0.1.0"
---

# iOS Analytics BNJ — BNSAnalytics + AnalyticsInterface

Padrão obrigatório de analytics no projeto BNJ.

## 1. AnalyticsInterface

```swift
// Presentation/Analytics/{Feature}AnalyticsInterface.swift
import Foundation

protocol {Feature}AnalyticsInterface {
    func track{Feature}ScreenView()
    func trackGet{Feature}()
    func trackSave{Item}()
    func track{Feature}Error()
}
```

Regras:
- Todos os métodos com prefixo `track`
- Interface simples — apenas assinaturas, sem implementação
- Nomes descritivos do evento/ação que está sendo rastreada

## 2. Analytics (implementação)

```swift
// Presentation/Analytics/{Feature}Analytics.swift
import BNSAnalyticsPOCContracts

final class {Feature}Analytics: {Feature}AnalyticsInterface {
    private let bnsAnalytics: BNSAnalyticsPOCContract?

    init(bnsAnalytics: BNSAnalyticsPOCContract?) {
        self.bnsAnalytics = bnsAnalytics
    }

    func track{Feature}ScreenView() {
        bnsAnalytics?.log(
            event: .screenData,
            parameters: [Analytics.Events.screenName.value: Strings.{Feature}.Analytics.screenName]
        )
    }

    func trackGet{Feature}() {
        bnsAnalytics?.log(
            event: .eventData,
            parameters: [Analytics.Events.buttonClicked.value: Strings.{Feature}.Analytics.get{Feature}]
        )
    }

    func trackSave{Item}() {
        bnsAnalytics?.log(
            event: .eventData,
            parameters: [Analytics.Events.buttonClicked.value: Strings.{Feature}.Analytics.save{Item}]
        )
    }

    func track{Feature}Error() {
        bnsAnalytics?.log(
            event: .eventData,
            parameters: [Analytics.Events.error.value: Strings.{Feature}.Analytics.error]
        )
    }
}
```

Regras:
- `final class` — sem herança
- `import BNSAnalyticsPOCContracts` — obrigatório
- `private let bnsAnalytics: BNSAnalyticsPOCContract?` — opcional (pode ser nil em testes)
- `event: .screenData` → telas / `event: .eventData` → ações e erros
- **ZERO strings literais** no arquivo — usar `Strings.{Feature}.Analytics.*`

## 3. Injeção no ViewModel

```swift
// Presentation/ViewModel/{Feature}ViewModel.swift
import JourneyCore

@MainActor
final class {Feature}ViewModel: BaseViewModel<{Feature}AnalyticsInterface, {Feature}UseCaseInterface>, ObservableObject {
    // analytics e useCase ficam disponíveis via BaseViewModel
    // não declarar novamente — use self.analytics e self.useCase

    func onAppear() {
        analytics?.track{Feature}ScreenView()
        load{Feature}()
    }
}
```

`BaseViewModel<AnalyticsInterface, UseCaseInterface>` injeta automaticamente `analytics` e `useCase`.

## 4. Instanciação no RouterManager

```swift
// Router/MainRouterManager.swift — ao criar a tela

let analytics = {Feature}Analytics(bnsAnalytics: bnsAnalytics)
let viewModel = {Feature}ViewModel(analytics: analytics, useCase: useCase)
```

`bnsAnalytics` é a propriedade do `RouterManager` recebida via `Dependencies.provider.get()`.

## Regras

| Regra | Detalhe |
|---|---|
| Prefixo `track` | Todos os métodos da interface |
| Sem strings literais | Usar `Strings.{Feature}.Analytics.*` |
| `.screenData` | Para eventos de visualização de tela |
| `.eventData` | Para ações do usuário e erros |
| `optional` bnsAnalytics | Facilita testes (passar `nil` no mock) |
| Chamado no ViewModel | Nunca na View/Screen |

## Proibições

| Proibido | Alternativa |
|---|---|
| Strings hardcoded no arquivo Analytics | `Strings.{Feature}.Analytics.*` |
| Chamar analytics na View/Screen | Chamar no ViewModel |
| Analytics sem interface | Sempre criar `{Feature}AnalyticsInterface` |
| Singleton de analytics | Injetar via construtor no ViewModel |
