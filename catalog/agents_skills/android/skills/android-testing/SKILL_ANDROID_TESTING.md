---
name: android-testing
description: |
  Skill para criar testes unitários e instrumentados em Android usando JUnit4/5,
  Mockk para mocks, Turbine para testar Flows e Espresso/Compose UI para testes
  de interface. Use ao testar ViewModels, UseCases, repositórios e telas Compose.
  Cobertura mínima esperada de 80% nas camadas domain e presentation.
metadata:
  version: "0.0.1"
---

# Android Testing — JUnit + Mockk + Turbine

Orientação para testes unitários e de UI em Android moderno.

## Dependências (build.gradle.kts)

```kotlin
dependencies {
    // Unit tests
    testImplementation("junit:junit:4.13.2")
    testImplementation("io.mockk:mockk:1.13.10")
    testImplementation("app.cash.turbine:turbine:1.1.0")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.8.0")
    testImplementation("com.google.truth:truth:1.4.2")

    // Instrumented tests
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    androidTestImplementation("com.google.dagger:hilt-android-testing:2.51.1")
    kspAndroidTest("com.google.dagger:hilt-android-compiler:2.51.1")
}
```

## Teste de UseCase

```kotlin
class BuscarProdutosUseCaseTest {

    private val repository: ProdutoRepository = mockk()
    private lateinit var sut: BuscarProdutosUseCase

    @Before
    fun setUp() {
        sut = BuscarProdutosUseCase(repository)
    }

    @Test
    fun `invoke deve retornar produtos do repositorio com sucesso`() = runTest {
        // Arrange
        val produtosEsperados = listOf(Produto.fake())
        coEvery { repository.listar() } returns produtosEsperados

        // Act
        val resultado = sut()

        // Assert
        assertThat(resultado.isSuccess).isTrue()
        assertThat(resultado.getOrNull()).isEqualTo(produtosEsperados)
        coVerify(exactly = 1) { repository.listar() }
    }

    @Test
    fun `invoke quando repositorio lanca excecao deve retornar failure`() = runTest {
        // Arrange
        coEvery { repository.listar() } throws NetworkException.NoConnection

        // Act
        val resultado = sut()

        // Assert
        assertThat(resultado.isFailure).isTrue()
        assertThat(resultado.exceptionOrNull()).isInstanceOf(NetworkException.NoConnection::class.java)
    }
}
```

## Teste de ViewModel com Turbine

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class ListaProdutosViewModelTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private val buscarProdutos: BuscarProdutosUseCase = mockk()
    private lateinit var sut: ListaProdutosViewModel

    @Before
    fun setUp() {
        sut = ListaProdutosViewModel(buscarProdutos)
    }

    @Test
    fun `carregarProdutos emite loading depois success com produtos`() = runTest {
        // Arrange
        val produtos = listOf(Produto.fake())
        coEvery { buscarProdutos() } returns Result.success(produtos)

        sut.uiState.test {
            // Estado inicial
            assertThat(awaitItem().isCarregando).isFalse()

            // Act
            sut.carregarProdutos()

            // Loading
            assertThat(awaitItem().isCarregando).isTrue()

            // Success
            val estado = awaitItem()
            assertThat(estado.isCarregando).isFalse()
            assertThat(estado.produtos).isEqualTo(produtos)
            assertThat(estado.erro).isNull()

            cancelAndIgnoreRemainingEvents()
        }
    }

    @Test
    fun `carregarProdutos quando falha emite erro`() = runTest {
        // Arrange
        coEvery { buscarProdutos() } returns Result.failure(NetworkException.NoConnection)

        sut.uiState.test {
            awaitItem() // estado inicial

            sut.carregarProdutos()
            awaitItem() // loading

            val estadoErro = awaitItem()
            assertThat(estadoErro.erro).isNotNull()
            assertThat(estadoErro.produtos).isEmpty()

            cancelAndIgnoreRemainingEvents()
        }
    }
}
```

## MainDispatcherRule (Infraestrutura de Teste)

```kotlin
class MainDispatcherRule(
    private val dispatcher: TestCoroutineDispatcher = TestCoroutineDispatcher()
) : TestWatcher() {

    override fun starting(description: Description) {
        Dispatchers.setMain(dispatcher)
    }

    override fun finished(description: Description) {
        Dispatchers.resetMain()
        dispatcher.cleanupTestCoroutines()
    }
}
```

---

## Testes com Robolectric (projetos enterprise/legados)

Use este padrão em projetos como BNJOpenAccount que exigem Robolectric em vez de MainDispatcherRule.

### Dependências adicionais

```kotlin
// build.gradle.kts
testImplementation("org.robolectric:robolectric:4.12.2")
```

### Template de ViewModelTest com Robolectric

```kotlin
@RunWith(RobolectricTestRunner::class)
@Config(manifest = Config.NONE)
class {Feature}ViewModelTest {

    private val testDispatcher = StandardTestDispatcher()   // não usar TestCoroutineDispatcher (deprecado)
    private val {feature}UseCase: {Feature}UseCaseInterface = mockk()
    private lateinit var viewModel: {Feature}ViewModel

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        viewModel = {Feature}ViewModel({feature}UseCase)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    // --- 6 casos obrigatórios ---

    @Test
    fun `initial uiState should have default values`() {
        val state = viewModel.uiState.value
        assertTrue(state.isLoading)
        assertFalse(state.isError)
        assertNull(state.data)
    }

    @Test
    fun `uiState should be a StateFlow`() {
        assertNotNull(viewModel.uiState)
    }

    @Test
    fun `initialize should update uiState on success`() = runTest {
        val expected = {Feature}(id = "1")
        coEvery { {feature}UseCase.get{Feature}() } returns Result.success(expected)

        viewModel.initialize()
        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value
        assertFalse(state.isLoading)
        assertFalse(state.isError)
        assertEquals(expected, state.data)
    }

    @Test
    fun `initialize should update uiState with error on failure`() = runTest {
        coEvery { {feature}UseCase.get{Feature}() } returns Result.failure(Exception("error"))

        viewModel.initialize()
        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value
        assertFalse(state.isLoading)
        assertTrue(state.isError)
    }

    @Test
    fun `processEvent OnBackPressed should emit BackPress effect`() = runTest {
        viewModel.processEvent({Feature}Event.OnBackPressed)
        testDispatcher.scheduler.advanceUntilIdle()
        // verificar efeito emitido
    }

    @Test
    fun `{Feature}UIState copy should create new instance with updated values`() {
        val original = {Feature}UIState(isLoading = true, isError = false)
        val updated = original.copy(isLoading = false, data = {Feature}(id = "1"))

        assertFalse(updated.isLoading)
        assertNotNull(updated.data)
    }
}
```

### Template de UseCaseTest (3 casos obrigatórios)

```kotlin
class {Feature}UseCaseTest {

    private val repository: {Feature}RepositoryInterface = mockk()
    private lateinit var useCase: {Feature}UseCase

    @Before
    fun setUp() {
        useCase = {Feature}UseCase(repository)
    }

    @Test
    fun `get{Feature} should call repository`() = runTest {
        coEvery { repository.get{Feature}() } returns {Feature}(id = "1")
        useCase.get{Feature}()
        coVerify(exactly = 1) { repository.get{Feature}() }
    }

    @Test
    fun `get{Feature} should return result from repository`() = runTest {
        val expected = {Feature}(id = "1")
        coEvery { repository.get{Feature}() } returns expected

        val result = useCase.get{Feature}()

        assertTrue(result.isSuccess)
        assertEquals(expected, result.getOrNull())
    }

    @Test
    fun `get{Feature} should propagate exception from repository`() = runTest {
        coEvery { repository.get{Feature}() } throws Exception("network error")

        val result = useCase.get{Feature}()

        assertTrue(result.isFailure)
    }
}
```

### Diferenças vs. abordagem genérica

| Ponto | Genérico (MVVM/Hilt) | BNJOpenAccount (MVI/Robolectric) |
|---|---|---|
| Runner | `@RunWith(AndroidJUnit4::class)` | `@RunWith(RobolectricTestRunner::class)` |
| Config | — | `@Config(manifest = Config.NONE)` |
| Dispatcher | `TestCoroutineDispatcher` (deprecado) | `StandardTestDispatcher()` |
| Setup | `MainDispatcherRule` | `@Before` / `@After` manual |
| Avançar tempo | `runCurrent()` | `testDispatcher.scheduler.advanceUntilIdle()` |

## Teste de Composable (Compose UI Test)

```kotlin
@HiltAndroidTest
class ListaProdutosScreenTest {

    @get:Rule(order = 0)
    val hiltRule = HiltAndroidRule(this)

    @get:Rule(order = 1)
    val composeRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun listaExibeProdutosAposCarregamento() {
        composeRule.onNodeWithTag("lista_produtos")
            .assertIsDisplayed()

        composeRule.onAllNodesWithTag("produto_card")
            .assertCountEquals(3) // conforme dados injetados pelo @TestModule
    }

    @Test
    fun clicarNoProdutoAbreDetalhe() {
        composeRule.onAllNodesWithTag("produto_card")
            .onFirst()
            .performClick()

        composeRule.onNodeWithTag("tela_detalhe")
            .assertIsDisplayed()
    }
}
```

## Dados de Teste (Fake Factory)

```kotlin
object ProdutoFake {
    fun criar(
        id: String = UUID.randomUUID().toString(),
        nome: String = "Produto Teste",
        preco: Double = 99.90,
        categoria: Produto.Categoria = Produto.Categoria.ELETRONICOS
    ) = Produto(id = id, nome = nome, preco = preco, categoria = categoria)

    fun lista(tamanho: Int = 3) = (1..tamanho).map {
        criar(nome = "Produto $it", preco = it * 10.0)
    }
}

// Extensão para uso nos testes
fun Produto.Companion.fake() = ProdutoFake.criar()
```

## Boas Práticas

| Prática | Detalhe |
|---|---|
| Nomenclatura | Backtick: `` `método quando condição deve resultado`() `` |
| `runTest` | Obrigatório para testes com Coroutines/Flows |
| `coEvery` / `coVerify` | Versões suspend do Mockk para funções suspend |
| `MainDispatcherRule` | Sempre use em testes de ViewModel |
| `@TestModule` | Substitua módulos Hilt em testes instrumentados |
| `cancelAndIgnoreRemainingEvents()` | Finalize Turbine corretamente |
