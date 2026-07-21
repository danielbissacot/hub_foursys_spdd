---
name: ios-persistence
description: |
  Skill para implementar persistência local em projetos iOS 17+ usando SwiftData
  como solução principal e UserDefaults/Keychain para dados simples e sensíveis.
  Use ao criar modelos persistidos, consultas, migrações e armazenamento seguro
  de credenciais. CoreData deve ser usado apenas em projetos legados.
metadata:
  version: "0.0.1"
---

# iOS Persistence — SwiftData + UserDefaults + Keychain

Orientação para persistência local em iOS 17+ com SwiftData, UserDefaults e armazenamento seguro.

## SwiftData — Configuração Inicial

```swift
import SwiftData

// Modelo
@Model
final class ProdutoModel {
    var id: UUID
    var nome: String
    var preco: Double
    var dataCriacao: Date
    var categoria: String

    init(id: UUID = UUID(), nome: String, preco: Double, categoria: String) {
        self.id = id
        self.nome = nome
        self.preco = preco
        self.dataCriacao = Date()
        self.categoria = categoria
    }
}
```

```swift
// App entry — configuração do ModelContainer
@main
struct MeuApp: App {
    let container: ModelContainer

    init() {
        do {
            container = try ModelContainer(
                for: ProdutoModel.self,
                configurations: ModelConfiguration(isStoredInMemoryOnly: false)
            )
        } catch {
            fatalError("Falha ao criar ModelContainer: \(error)")
        }
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(container)
    }
}
```

## SwiftData — Repositório

```swift
import SwiftData

final class ProdutoSwiftDataRepository: ProdutoRepository {
    private let modelContext: ModelContext

    init(modelContext: ModelContext) {
        self.modelContext = modelContext
    }

    func listar() async throws -> [Produto] {
        let descriptor = FetchDescriptor<ProdutoModel>(
            sortBy: [SortDescriptor(\.dataCriacao, order: .reverse)]
        )
        let modelos = try modelContext.fetch(descriptor)
        return modelos.map { $0.toDomain() }
    }

    func salvar(_ produto: Produto) async throws {
        let modelo = ProdutoModel(
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            categoria: produto.categoria.rawValue
        )
        modelContext.insert(modelo)
        try modelContext.save()
    }

    func deletar(id: UUID) async throws {
        let descriptor = FetchDescriptor<ProdutoModel>(
            predicate: #Predicate { $0.id == id }
        )
        if let modelo = try modelContext.fetch(descriptor).first {
            modelContext.delete(modelo)
            try modelContext.save()
        }
    }
}
```

## SwiftData — Uso direto na View (para casos simples)

```swift
struct ListaProdutosView: View {
    @Query(sort: \ProdutoModel.dataCriacao, order: .reverse)
    private var produtos: [ProdutoModel]

    @Environment(\.modelContext) private var context

    var body: some View {
        List(produtos) { produto in
            Text(produto.nome)
        }
        .toolbar {
            Button("Adicionar") {
                let novo = ProdutoModel(nome: "Novo", preco: 0, categoria: "eletronicos")
                context.insert(novo)
            }
        }
    }
}
```

## UserDefaults — Para Preferências Simples

```swift
// Wrapper type-safe com @AppStorage (SwiftUI)
struct ConfiguracoesView: View {
    @AppStorage("tema_escuro") private var temaEscuro = false
    @AppStorage("idioma") private var idioma = "pt-BR"

    var body: some View {
        Toggle("Tema Escuro", isOn: $temaEscuro)
    }
}

// Wrapper programático para uso fora de Views
enum Preferencias {
    @AppStorage("notificacoes_ativas") static var notificacoesAtivas = true

    static func resetar() {
        UserDefaults.standard.removeObject(forKey: "notificacoes_ativas")
    }
}
```

**NUNCA armazene no UserDefaults:** tokens, senhas, CPF, dados bancários.

## Keychain — Para Dados Sensíveis

```swift
import Security

enum Keychain {
    static func salvar(chave: String, valor: String) throws {
        let data = Data(valor.utf8)
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: chave,
            kSecValueData as String: data
        ]
        SecItemDelete(query as CFDictionary) // remove se já existe
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw KeychainError.salvarFalhou(status)
        }
    }

    static func ler(chave: String) throws -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: chave,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        var resultado: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &resultado)
        guard status == errSecSuccess, let data = resultado as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }

    static func deletar(chave: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: chave
        ]
        SecItemDelete(query as CFDictionary)
    }

    enum KeychainError: Error {
        case salvarFalhou(OSStatus)
    }
}

// Uso
try Keychain.salvar(chave: "auth_token", valor: token)
let token = try Keychain.ler(chave: "auth_token")
```

## Quando Usar Cada Solução

| Dado | Solução |
|---|---|
| Listas, entidades, dados estruturados | SwiftData |
| Preferências do usuário (tema, idioma) | `@AppStorage` / UserDefaults |
| Tokens de autenticação | Keychain |
| Senhas, CPF, dados bancários | Keychain |
| Cache temporário de imagens | `URLCache` ou `NSCache` |
| Arquivos grandes (documentos, vídeos) | FileManager em Documents/ |
