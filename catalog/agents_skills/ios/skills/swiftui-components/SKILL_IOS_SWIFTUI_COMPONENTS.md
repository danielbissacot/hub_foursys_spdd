---
name: ios-swiftui-components
description: |
  Skill para criar Views e componentes SwiftUI modernos em projetos iOS 17+.
  Use ao criar telas, componentes reutilizáveis, formulários, listas e navegação
  com SwiftUI. Aplica @State, @Binding, @Environment, Control Flow nativo e
  ViewModifiers seguindo as melhores práticas Apple.
metadata:
  version: "0.0.1"
---

# SwiftUI Components

Orientação para criar Views e componentes SwiftUI modernos, reutilizáveis e acessíveis em projetos iOS 17+.

## Princípios Centrais

### Estrutura Padrão de uma View

```swift
import SwiftUI

struct ProdutoCardView: View {
    let produto: Produto
    var onTap: () -> Void = {}

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(produto.nome)
                .font(.headline)
            Text(produto.preco, format: .currency(code: "BRL"))
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .onTapGesture { onTap() }
    }
}
```

### Gerenciamento de Estado

| Propriedade | Quando usar |
|---|---|
| `@State` | Estado local da própria View (campo de texto, toggle, loading) |
| `@Binding` | Estado recebido do pai — a View filha pode ler e escrever |
| `@Environment` | Serviços globais injetados (repositórios, temas, configurações) |
| `@Bindable` | Acessa propriedades de um `@Observable` como binding |

```swift
// Estado local
struct FormularioBuscaView: View {
    @State private var termoBusca = ""
    @State private var isCarregando = false

    var body: some View {
        VStack {
            TextField("Buscar...", text: $termoBusca)
                .textFieldStyle(.roundedBorder)

            if isCarregando {
                ProgressView()
            }
        }
    }
}
```

### Binding entre Views pai e filho

```swift
// View pai
struct TelaPrincipalView: View {
    @State private var mostrarDetalhes = false

    var body: some View {
        BotaoToggleView(ativo: $mostrarDetalhes)
    }
}

// View filho
struct BotaoToggleView: View {
    @Binding var ativo: Bool

    var body: some View {
        Button(ativo ? "Ocultar" : "Mostrar") {
            ativo.toggle()
        }
    }
}
```

## Control Flow Nativo (iOS 16+)

**SEMPRE** use control flow nativo. **PROIBIDO** usar `if let` inline com `AnyView`.

```swift
// ✅ Correto — control flow nativo
var body: some View {
    if produtos.isEmpty {
        ContentUnavailableView("Sem produtos", systemImage: "cart")
    } else {
        List(produtos) { produto in
            ProdutoCardView(produto: produto)
        }
    }
}

// ❌ Errado — converte para AnyView e perde type safety
var body: some View {
    Group {
        if produtos.isEmpty { AnyView(Text("Vazio")) }
        else { AnyView(List(produtos) { ... }) }
    }
}
```

## Listas e Navegação

```swift
struct ListaProdutosView: View {
    @Environment(ProdutoRepository.self) private var repository
    @State private var produtoSelecionado: Produto?

    var body: some View {
        NavigationStack {
            List(repository.produtos) { produto in
                NavigationLink(value: produto) {
                    ProdutoCardView(produto: produto)
                }
            }
            .navigationTitle("Produtos")
            .navigationDestination(for: Produto.self) { produto in
                DetalheProdutoView(produto: produto)
            }
        }
    }
}
```

## ViewModifiers Customizados

Encapsule estilos repetitivos em ViewModifiers para garantir consistência:

```swift
struct CartaoEstilo: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(.regularMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .shadow(radius: 4)
    }
}

extension View {
    func estiloCartao() -> some View {
        modifier(CartaoEstilo())
    }
}

// Uso
Text("Olá").estiloCartao()
```

## Acessibilidade (Obrigatória)

```swift
Image(systemName: "heart.fill")
    .accessibilityLabel("Favorito")
    .accessibilityHint("Toque duas vezes para remover dos favoritos")

Button("Comprar") { ... }
    .accessibilityIdentifier("btn_comprar") // para UI tests
```

## Previews

Sempre forneça previews com dados de exemplo:

```swift
#Preview {
    ProdutoCardView(produto: .preview)
        .padding()
}

extension Produto {
    static var preview: Produto {
        Produto(id: UUID(), nome: "Produto Exemplo", preco: 99.90)
    }
}
```

---

## BNJ Screen Pattern (Projeto Bradesco/BNJ)

Para o projeto BNJ, as telas SwiftUI seguem o padrão `BaseScreen` com JourneyCore.

### Estrutura de uma Screen BNJ

```swift
import SwiftUI
import JourneyCore

@MainActor
struct {Feature}Screen: BaseScreen {
    @ObservedObject var viewModel: {Feature}ViewModel
    let router: {Feature}RouterInterface

    var body: some View {
        view
            .onAppear { viewModel.onAppear() }   // síncrono
            .task { await viewModel.loadAsync() } // assíncrono
            .onChange(of: viewModel.routeEvent) { event in
                handleRouteEvent(event)
            }
    }

    @ViewBuilder
    var view: some View {
        switch viewModel.state {
        case .idle:      EmptyView()
        case .loading:   {Feature}LoadingView()
        case .success(let data): {Feature}SuccessView(data: data)
        case .failure:   ErrorView { viewModel.retryLastAction() }
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

### Views auxiliares por estado (arquivos separados na pasta Custom)

```swift
// Custom/{Feature}LoadingView.swift
struct {Feature}LoadingView: View {
    var body: some View {
        ProgressView()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// Custom/{Feature}SuccessView.swift
struct {Feature}SuccessView: View {
    let data: {Feature}ViewData
    var onSelect: (Int) -> Void = { _ in }

    var body: some View {
        // conteúdo da tela de sucesso
    }
}
```

### Preview BNJ (mock em arquivo separado com #if DEBUG)

```swift
// {Feature}PreviewMock.swift
#if DEBUG
struct {Feature}PreviewMock {
    func viewModel(for state: {Feature}ViewModel.ViewState) -> {Feature}ViewModel {
        let vm = {Feature}ViewModel(analytics: nil, useCase: nil)
        vm.state = state
        return vm
    }
}
#endif

// No arquivo da Screen:
#Preview {
    let mock = {Feature}PreviewMock()
    {Feature}Screen(
        viewModel: mock.viewModel(for: .success({Feature}ViewData(items: []))),
        router: {Feature}RouterManagerMock()
    )
}
```

### Regras BNJ para SwiftUI

| Regra | Detalhe |
|---|---|
| `BaseScreen` | Toda Screen BNJ deve se conformar |
| `@ObservedObject var viewModel` | Não `@StateObject` nem `@Observable` |
| `let router: RouterInterface` | Router injetado no construtor |
| `.onAppear` | Só métodos síncronos |
| `.task` | Só métodos async |
| `.onChange(of: viewModel.routeEvent)` | Navegação via routeEvent |
| Views auxiliares em Custom/ | Loading, Success, Empty, Failure em arquivos separados |
| Preview mock em arquivo separado | `{Feature}PreviewMock` dentro de `#if DEBUG` |
