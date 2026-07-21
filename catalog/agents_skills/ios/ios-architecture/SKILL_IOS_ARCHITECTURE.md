---
name: ios-architecture
description: |
  Skill para implementar MVVM com @Observable e Clean Architecture em projetos iOS 17+.
  Use ao criar novas features, organizar camadas do projeto (domain, data, presentation),
  configurar injeção de dependência via @Environment e estruturar ViewModels com
  Swift 6 Concurrency. Garante separação de responsabilidades e testabilidade.
metadata:
  version: "0.0.1"
---

# iOS Architecture — MVVM com @Observable

Orientação para estruturar features iOS com MVVM moderno, Clean Architecture e injeção de dependência via `@Environment`.

## Estrutura de Pastas por Feature

```
Features/
└── Produto/
    ├── Domain/
    │   ├── Produto.swift              # Entidade
    │   ├── ProdutoRepository.swift    # Protocolo (interface)
    │   └── BuscarProdutosUseCase.swift
    ├── Data/
    │   ├── ProdutoRepositoryImpl.swift
    │   └── ProdutoDTO.swift
    └── Presentation/
        ├── ListaProdutosView.swift
        └── ListaProdutosViewModel.swift
```

## ViewModel com `@Observable`

```swift
import Observation

@MainActor
@Observable
final class ListaProdutosViewModel {

    // Estado da UI — acesso direto pelo @Observable (sem @Published)
    var produtos: [Produto] = []
    var isCarregando = false
    var erro: String?

    private let buscarProdutos: BuscarProdutosUseCase

    init(buscarProdutos: BuscarProdutosUseCase) {
        self.buscarProdutos = buscarProdutos
    }

    func carregarProdutos() async {
        isCarregando = true
        erro = nil
        do {
            produtos = try await buscarProdutos.executar()
        } catch {
            self.erro = error.localizedDescription
        }
        isCarregando = false
    }
}
```

**Regras do ViewModel:**
- **`@MainActor`**: obrigatório para ViewModels que atualizam UI.
- **`@Observable`**: substitui `ObservableObject` + `@Published`. NUNCA use o padrão antigo.
- Recebe dependências pelo **inicializador** (testável).
- Nunca importa `SwiftUI` — só `Foundation` e `Observation`.

## UseCase

```swift
final class BuscarProdutosUseCase {
    private let repository: ProdutoRepository

    init(repository: ProdutoRepository) {
        self.repository = repository
    }

    func executar() async throws -> [Produto] {
        return try await repository.listar()
    }
}
```

## Protocolo de Repositório (Domínio)

```swift
// Domain — sem dependência de framework externo
protocol ProdutoRepository {
    func listar() async throws -> [Produto]
    func buscarPorId(_ id: UUID) async throws -> Produto?
    func salvar(_ produto: Produto) async throws
}
```

## Implementação de Repositório (Data)

```swift
final class ProdutoRepositoryImpl: ProdutoRepository {
    private let service: ProdutoAPIService

    init(service: ProdutoAPIService) {
        self.service = service
    }

    func listar() async throws -> [Produto] {
        let dtos = try await service.fetchProdutos()
        return dtos.map { $0.toDomain() }
    }
}
```

## Injeção de Dependência via `@Environment`

```swift
// App entry point — registra dependências
@main
struct MeuApp: App {
    // Cria as dependências uma única vez
    private let repository: ProdutoRepository = ProdutoRepositoryImpl(
        service: ProdutoAPIServiceImpl()
    )

    var body: some Scene {
        WindowGroup {
            ListaProdutosView()
                .environment(repository) // injeta no ambiente
        }
    }
}

// View — recebe do ambiente e cria o ViewModel
struct ListaProdutosView: View {
    @Environment(ProdutoRepository.self) private var repository
    @State private var viewModel: ListaProdutosViewModel?

    var body: some View {
        Group {
            if let vm = viewModel {
                ConteudoListaView(viewModel: vm)
            } else {
                ProgressView()
            }
        }
        .task {
            let useCase = BuscarProdutosUseCase(repository: repository)
            let vm = ListaProdutosViewModel(buscarProdutos: useCase)
            viewModel = vm
            await vm.carregarProdutos()
        }
    }
}
```

## Regras de Camada

| Camada | Pode importar | Proibido importar |
|---|---|---|
| `Domain` | `Foundation` | `SwiftUI`, `UIKit`, `SwiftData`, `Alamofire` |
| `Data` | `Foundation`, `SwiftData` | `SwiftUI`, `UIKit` |
| `Presentation` | `SwiftUI`, `Observation`, `Domain` | Implementações de `Data` diretamente |

## Entidade de Domínio

```swift
struct Produto: Identifiable, Hashable, Sendable {
    let id: UUID
    var nome: String
    var preco: Double
    var categoria: Categoria

    enum Categoria: String, CaseIterable, Sendable {
        case eletronicos, roupas, alimentos
    }
}
```

- `Identifiable`: necessário para `List` e `ForEach` no SwiftUI.
- `Hashable`: necessário para `NavigationStack(path:)`.
- `Sendable`: necessário para Swift 6 concurrency sem warnings.
