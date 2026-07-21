---
name: ios-usecase-bnj
description: |
  Skill para criar UseCases e InMemoryRepository no projeto BNJ (Bradesco iOS) usando JourneyCore.
  Cobre BaseUseCase<RepositoryInterface>, UseCaseInterface (@MainActor + async throws),
  InMemoryRepository (cross-screen data), RepositoryInterface (async throws) e as regras de
  o que pode e não pode estar no UseCase. Use ao criar a camada de domain do projeto BNJ iOS.
metadata:
  version: "0.1.0"
---

# iOS UseCase BNJ — BaseUseCase + InMemoryRepository

Padrão de UseCase do projeto BNJ com JourneyCore.

## 1. UseCaseInterface

```swift
// Domain/{Feature}UseCaseInterface.swift
import Foundation

@MainActor
protocol {Feature}UseCaseInterface {
    func get{Feature}() async throws -> {Feature}Model
    func save{Item}(with model: {Item}Model) async throws
}
```

Regras:
- `@MainActor` — obrigatório
- Métodos com `async throws` para operações assíncronas
- Recebe e retorna apenas Domain Models (nunca DTO, nunca ViewData)

## 2. RepositoryInterface

```swift
// Domain/{Feature}RepositoryInterface.swift
import Foundation

protocol {Feature}RepositoryInterface {
    func get{Feature}() async throws -> {Feature}Model
}
```

## 3. InMemoryRepositoryInterface

```swift
// Domain/InMemoryRepositoryInterface.swift
import Foundation

protocol InMemoryRepositoryInterface {
    var selectedContact: ContactModel? { get set }
    var selectedKey: KeyModel? { get set }
    var selectedLimit: LimitModel? { get set }
    // adicione propriedades conforme novos dados inter-tela forem necessários
}
```

Atualizar `InMemoryRepositoryInterface` sempre que uma nova feature precisar passar dados para a próxima tela.

## 4. UseCase — Padrão sem rede

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
        // recuperar do inMemoryRepository (dados vindos de tela anterior)
        inMemoryRepository.selected{Feature}?.{property} ?? {Feature}Model()
    }

    func save{Item}(with model: {Item}Model) {
        inMemoryRepository.selected{Item} = model
    }
}
```

## 5. UseCase — Padrão com rede

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

## 6. InMemoryRepository (implementação)

```swift
// Data/InMemoryRepository.swift
import Foundation

final class InMemoryRepository: InMemoryRepositoryInterface {
    var selectedContact: ContactModel?
    var selectedKey: KeyModel?
    var selectedLimit: LimitModel?
    // adicione propriedades conforme novos dados forem necessários
}
```

Regras:
- `final class` — não struct (precisa ser referência compartilhada)
- Uma única instância criada no `RouterManager` e passada para todos os UseCases do fluxo
- Propriedades opcionais (`var`, não `let`)

## Regras do UseCase

| Regra | Detalhe |
|---|---|
| `final class` | UseCase não é herdável |
| `BaseUseCase<Interface>` | Herança JourneyCore — dá acesso a `repository` |
| `private var inMemoryRepository` | Recebido no `init`, não instanciado internamente |
| `try await repository?.method()` | Sempre opcional `?.` pois repository pode ser nil |
| Só Domain Models | UseCase não conhece DTO, ViewData, nem tipos de UI |
| Sem lógica de UI | Datas, moedas, strings formatadas → ViewModel |
| `@MainActor` na interface | Garante execução na main thread quando chamado pelo ViewModel |

## Proibições

| Proibido | Alternativa |
|---|---|
| Instanciar Repository diretamente | Receber via `init` (protocolo) |
| Retornar DTO | Mapear no Repository, retornar Model |
| Acessar `InMemoryRepository` sem injeção | Injetar no `init` via protocolo |
| Múltiplos UseCases em um ViewModel | Um ViewModel acessa um único UseCase |
| Lógica de formatação | ViewModel (strings para tela, datas humanizadas) |
