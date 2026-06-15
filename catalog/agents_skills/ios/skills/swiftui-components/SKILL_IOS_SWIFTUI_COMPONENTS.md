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
