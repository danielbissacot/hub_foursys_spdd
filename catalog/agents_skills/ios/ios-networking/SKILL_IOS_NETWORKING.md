---
name: ios-networking
description: |
  Skill para implementar camada de rede em projetos iOS 17+ usando URLSession com
  async/await e Codable. Use ao criar chamadas de API REST, upload/download de arquivos,
  tratamento de erros de rede e retry automático. Proibido usar Alamofire sem
  justificativa técnica — URLSession nativo cobre todos os casos de uso modernos.
metadata:
  version: "0.0.1"
---

# iOS Networking — URLSession + async/await

Orientação para implementar a camada de rede com `URLSession`, `Codable` e Swift Concurrency.

## Cliente HTTP Genérico

```swift
import Foundation

enum NetworkError: LocalizedError {
    case urlInvalida
    case respostaInvalida(statusCode: Int)
    case decodificacaoFalhou(Error)
    case semConexao

    var errorDescription: String? {
        switch self {
        case .urlInvalida: return "URL inválida."
        case .respostaInvalida(let code): return "Erro do servidor: \(code)."
        case .decodificacaoFalhou: return "Não foi possível processar a resposta."
        case .semConexao: return "Sem conexão com a internet."
        }
    }
}

final class HTTPClient {
    static let shared = HTTPClient()
    private let session: URLSession

    init(session: URLSession = .shared) {
        self.session = session
    }

    func get<T: Decodable>(_ url: URL, as type: T.Type) async throws -> T {
        let (data, response) = try await session.data(from: url)
        try validarResposta(response)
        return try decodificar(data, as: type)
    }

    func post<Body: Encodable, Response: Decodable>(
        _ url: URL,
        body: Body,
        as type: Response.Type
    ) async throws -> Response {
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(body)

        let (data, response) = try await session.data(for: request)
        try validarResposta(response)
        return try decodificar(data, as: type)
    }

    private func validarResposta(_ response: URLResponse) throws {
        guard let http = response as? HTTPURLResponse else {
            throw NetworkError.respostaInvalida(statusCode: -1)
        }
        guard (200..<300).contains(http.statusCode) else {
            throw NetworkError.respostaInvalida(statusCode: http.statusCode)
        }
    }

    private func decodificar<T: Decodable>(_ data: Data, as type: T.Type) throws -> T {
        do {
            let decoder = JSONDecoder()
            decoder.keyDecodingStrategy = .convertFromSnakeCase
            decoder.dateDecodingStrategy = .iso8601
            return try decoder.decode(type, from: data)
        } catch {
            throw NetworkError.decodificacaoFalhou(error)
        }
    }
}
```

## DTO com Codable

```swift
struct ProdutoDTO: Decodable {
    let id: String
    let nomeCompleto: String    // snake_case "nome_completo" → convertFromSnakeCase
    let precoCentavos: Int
    let categoriaId: Int

    func toDomain() -> Produto {
        Produto(
            id: UUID(uuidString: id) ?? UUID(),
            nome: nomeCompleto,
            preco: Double(precoCentavos) / 100,
            categoria: .eletronicos
        )
    }
}
```

## Service de API

```swift
final class ProdutoAPIServiceImpl: ProdutoAPIService {
    private let client: HTTPClient
    private let baseURL = URL(string: "https://api.exemplo.com/v1")!

    init(client: HTTPClient = .shared) {
        self.client = client
    }

    func fetchProdutos() async throws -> [ProdutoDTO] {
        let url = baseURL.appendingPathComponent("produtos")
        return try await client.get(url, as: [ProdutoDTO].self)
    }

    func fetchProduto(id: UUID) async throws -> ProdutoDTO {
        let url = baseURL.appendingPathComponent("produtos/\(id.uuidString)")
        return try await client.get(url, as: ProdutoDTO.self)
    }
}
```

## Autenticação com Bearer Token

```swift
final class AuthenticatedHTTPClient: HTTPClient {
    private let tokenProvider: () async throws -> String

    init(tokenProvider: @escaping () async throws -> String) {
        self.tokenProvider = tokenProvider
        super.init()
    }

    override func get<T: Decodable>(_ url: URL, as type: T.Type) async throws -> T {
        let token = try await tokenProvider()
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        let (data, response) = try await URLSession.shared.data(for: request)
        try validarResposta(response)
        return try decodificar(data, as: type)
    }
}
```

## Tratamento de Erro no ViewModel

```swift
func carregarProdutos() async {
    isCarregando = true
    defer { isCarregando = false }

    do {
        produtos = try await buscarProdutos.executar()
    } catch let networkError as NetworkError {
        self.mensagemErro = networkError.localizedDescription
    } catch {
        self.mensagemErro = "Erro inesperado. Tente novamente."
    }
}
```

## Retry com Backoff Exponencial

```swift
func comRetry<T>(
    tentativas: Int = 3,
    delay: Duration = .seconds(1),
    operacao: () async throws -> T
) async throws -> T {
    var ultimoErro: Error?
    for tentativa in 1...tentativas {
        do {
            return try await operacao()
        } catch {
            ultimoErro = error
            if tentativa < tentativas {
                try await Task.sleep(for: delay * Double(tentativa))
            }
        }
    }
    throw ultimoErro!
}
```

## Boas Práticas

- **NUNCA** faça chamadas de rede em `init()` de Views ou ViewModels — use `.task {}`.
- **SEMPRE** cancele tasks quando a View desaparecer (`.task {}` cancela automaticamente).
- **NUNCA** armazene tokens em `UserDefaults` — use Keychain.
- Use `URLSession.shared` para chamadas simples; crie sessão customizada para configurações de timeout.
