---
name: ios-testing
description: |
  Skill para criar testes unitários e de UI em projetos iOS 17+ usando XCTest e
  XCUITest. Use ao implementar testes de ViewModels, UseCases, repositórios e
  fluxos de tela completos. Orienta criação de mocks via protocolo, testes assíncronos
  com async/await e cobertura mínima de 80%. Sem dependências externas de mocking.
metadata:
  version: "0.0.1"
---

# iOS Testing — XCTest + XCUITest

Orientação para criar testes unitários e de UI em iOS 17+, sem frameworks externos.

## Princípios

- **Teste comportamento**, não implementação interna.
- **Mocks via protocolo** — sem frameworks de mocking externos (MockoloIO, Cuckoo são opcionais).
- **`async/await`** para testes de código concorrente.
- **Cobertura mínima: 80%** para camadas de domínio e ViewModel.

## Mock via Protocolo

```swift
// Protocolo (domínio)
protocol ProdutoRepository {
    func listar() async throws -> [Produto]
    func salvar(_ produto: Produto) async throws
}

// Mock para testes
final class ProdutoRepositoryMock: ProdutoRepository {
    var produtosParaRetornar: [Produto] = []
    var erroParaLancar: Error?
    var salvarChamado = false

    func listar() async throws -> [Produto] {
        if let erro = erroParaLancar { throw erro }
        return produtosParaRetornar
    }

    func salvar(_ produto: Produto) async throws {
        salvarChamado = true
        if let erro = erroParaLancar { throw erro }
    }
}
```

## Teste de UseCase

```swift
import XCTest

final class BuscarProdutosUseCaseTests: XCTestCase {
    var sut: BuscarProdutosUseCase!
    var repositoryMock: ProdutoRepositoryMock!

    override func setUp() {
        super.setUp()
        repositoryMock = ProdutoRepositoryMock()
        sut = BuscarProdutosUseCase(repository: repositoryMock)
    }

    override func tearDown() {
        sut = nil
        repositoryMock = nil
        super.tearDown()
    }

    func testExecutar_DeveRetornarProdutosDoRepositorio() async throws {
        // Arrange
        let produtosEsperados = [Produto.preview, Produto.preview]
        repositoryMock.produtosParaRetornar = produtosEsperados

        // Act
        let resultado = try await sut.executar()

        // Assert
        XCTAssertEqual(resultado.count, produtosEsperados.count)
    }

    func testExecutar_QuandoRepositorioLancaErro_DevePropagar() async {
        // Arrange
        repositoryMock.erroParaLancar = NetworkError.semConexao

        // Act & Assert
        do {
            _ = try await sut.executar()
            XCTFail("Deveria ter lançado erro")
        } catch {
            XCTAssertTrue(error is NetworkError)
        }
    }
}
```

## Teste de ViewModel

```swift
@MainActor
final class ListaProdutosViewModelTests: XCTestCase {
    var sut: ListaProdutosViewModel!
    var repositoryMock: ProdutoRepositoryMock!

    override func setUp() {
        super.setUp()
        repositoryMock = ProdutoRepositoryMock()
        let useCase = BuscarProdutosUseCase(repository: repositoryMock)
        sut = ListaProdutosViewModel(buscarProdutos: useCase)
    }

    func testCarregarProdutos_DeveDefinirProdutosAposSucesso() async {
        // Arrange
        repositoryMock.produtosParaRetornar = [.preview]

        // Act
        await sut.carregarProdutos()

        // Assert
        XCTAssertFalse(sut.isCarregando)
        XCTAssertEqual(sut.produtos.count, 1)
        XCTAssertNil(sut.erro)
    }

    func testCarregarProdutos_QuandoHaErro_DeveDefinirMensagemErro() async {
        // Arrange
        repositoryMock.erroParaLancar = NetworkError.semConexao

        // Act
        await sut.carregarProdutos()

        // Assert
        XCTAssertFalse(sut.isCarregando)
        XCTAssertTrue(sut.produtos.isEmpty)
        XCTAssertNotNil(sut.erro)
    }

    func testCarregarProdutos_DuranteCarregamento_IsCarregandoDeveSerTrue() async {
        // Arrange
        let expectativa = expectation(description: "isCarregando = true durante fetch")
        repositoryMock.produtosParaRetornar = [.preview]

        // Act
        let task = Task {
            await sut.carregarProdutos()
        }

        // Verifica estado imediato
        if sut.isCarregando { expectativa.fulfill() }
        await task.value
        await fulfillment(of: [expectativa], timeout: 1.0)
    }
}
```

## XCUITest — Teste de UI

```swift
final class ListaProdutosUITests: XCTestCase {
    var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launchArguments = ["UI_TESTING"] // flag para usar dados mock
        app.launch()
    }

    func testListaProdutos_DeveExibirItemsAposCarregamento() {
        let lista = app.collectionViews["lista_produtos"]
        XCTAssertTrue(lista.waitForExistence(timeout: 3))
        XCTAssertGreaterThan(lista.cells.count, 0)
    }

    func testNavegacao_AoTocarItem_DeveAbrirDetalhe() {
        let primeiroItem = app.collectionViews["lista_produtos"].cells.firstMatch
        XCTAssertTrue(primeiroItem.waitForExistence(timeout: 3))
        primeiroItem.tap()

        let titulo = app.navigationBars["Detalhe do Produto"]
        XCTAssertTrue(titulo.waitForExistence(timeout: 2))
    }
}
```

## Boas Práticas

| Prática | Detalhe |
|---|---|
| Nomenclatura | `test[Método]_[Cenário]_[ResultadoEsperado]()` |
| Arrange/Act/Assert | Sempre separe as 3 fases com comentários |
| `@MainActor` | Obrigatório em testes de ViewModel |
| Dados de teste | Use extensão `static var preview` nas entidades |
| Isolamento | Cada teste cria seu próprio `sut` e mocks no `setUp` |
| UI Testing | Use `accessibilityIdentifier` nos elementos testados |
