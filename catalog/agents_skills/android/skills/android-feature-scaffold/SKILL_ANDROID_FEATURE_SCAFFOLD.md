---
name: android-feature-scaffold
description: |
  Skill de scaffold completo para criar uma nova feature Android no projeto BNJOpenAccount (Bradesco).
  Segue o fluxo: 3 perguntas obrigatórias → leitura dos arquivos globais → geração de 13 arquivos
  em ordem (domain → data → presentation → router → DI → testes). Padrão MVI com BaseViewModel,
  DI customizada com setSingleton/setFactory, Routes @Serializable e Robolectric tests.
  Use este skill sempre que adicionar uma feature nova do zero.
metadata:
  version: "0.1.0"
---

# Android Feature Scaffold — BNJOpenAccount (Bradesco)

Processo completo para criar uma feature do zero. Não pule etapas.

---

## PASSO 0 — Perguntas Obrigatórias (Faça ANTES de gerar código)

Antes de qualquer implementação, faça as 3 perguntas ao desenvolvedor:

**1. Essa feature faz chamadas de rede (API)?**
- Sim → criar `{Feature}Response.kt` + registrar `{Feature}Repository(api = get())`
- Não → repositório local/memória, sem Response DTO

**2. Qual o nome do domain model principal?**
- Exemplo: `PaymentDetails`, `AccountSummary`, `UserProfile`
- Este nome define `{DomainModel}` em todos os arquivos

**3. Essa tela precisa de parâmetros na rota?**
- Sim → `data class {Feature}(val {param}: {Type}) : Routes()`
- Não → `data object {Feature} : Routes()`

---

## PASSO 1 — Ler Antes de Escrever

Leia estes 3 arquivos antes de gerar qualquer código:

```
router/Routes.kt          → verificar rotas existentes (evitar duplicatas)
router/RouterManager.kt   → verificar composables existentes
launcher/AppModule.kt     → verificar registros de DI existentes
```

---

## PASSO 2 — Gerar Arquivos por Camada

### Checklist de arquivos (substituir `{Feature}` pelo nome real)

| # | Camada | Arquivo | Gerar quando |
|---|---|---|---|
| 1 | Domain | `domain/model/{Feature}.kt` | Sempre |
| 2 | Domain | `domain/repository/{Feature}RepositoryInterface.kt` | Sempre |
| 3 | Domain | `domain/usecase/{Feature}UseCaseInterface.kt` | Sempre |
| 4 | Domain | `domain/usecase/{Feature}UseCase.kt` | Sempre |
| 5 | Data | `data/repository/{Feature}Repository.kt` | Sempre |
| 6 | Data | `data/model/{Feature}Response.kt` | Só se tiver rede |
| 7 | Presentation | `presentation/model/{Feature}UIState.kt` | Sempre |
| 8 | Presentation | `presentation/model/{Feature}Action.kt` | Sempre |
| 9 | Presentation | `presentation/viewmodel/{Feature}ViewModel.kt` | Sempre |
| 10 | Presentation | `presentation/view/{Feature}Screen.kt` | Sempre |
| 11 | Router | `router/Routes.kt` — adicionar rota | Sempre |
| 12 | Router | `router/RouterManager.kt` — adicionar composable | Sempre |
| 13 | DI | `launcher/AppModule.kt` — 3 registros | Sempre |

---

## Templates por arquivo

### 1. domain/model/{Feature}.kt

```kotlin
data class {Feature}(
    val id: String,
    // campos do domain model
)
```

### 2. domain/repository/{Feature}RepositoryInterface.kt

```kotlin
interface {Feature}RepositoryInterface {
    suspend fun get{Feature}(): {Feature}
}
```

### 3. domain/usecase/{Feature}UseCaseInterface.kt

```kotlin
interface {Feature}UseCaseInterface {
    suspend fun get{Feature}(): Result<{Feature}>
}
```

### 4. domain/usecase/{Feature}UseCase.kt

```kotlin
class {Feature}UseCase(
    private val repository: {Feature}RepositoryInterface
) : {Feature}UseCaseInterface {

    override suspend fun get{Feature}(): Result<{Feature}> = runCatching {
        repository.get{Feature}()
    }
}
```

### 5. data/repository/{Feature}Repository.kt

#### Sem rede

```kotlin
class {Feature}Repository : {Feature}RepositoryInterface {

    override suspend fun get{Feature}(): {Feature} {
        return {Feature}(id = "mock", /* campos */)
    }
}
```

#### Com rede

```kotlin
class {Feature}Repository(
    private val api: ApiRemoteDataSource
) : {Feature}RepositoryInterface {

    override suspend fun get{Feature}(): {Feature} {
        val response = api.executeRequestWithJsonResponse<{Feature}Response>(
            path = "/{endpoint}"
        )
        return response.toDomain()
    }
}
```

### 6. data/model/{Feature}Response.kt (somente com rede)

```kotlin
@Serializable
data class {Feature}Response(
    @SerialName("id") val id: String,
    // campos do response com @SerialName para mapear JSON
) {
    fun toDomain(): {Feature} = {Feature}(
        id = id,
        // mapeamento campos
    )
}
```

### 7. presentation/model/{Feature}UIState.kt

```kotlin
data class {Feature}UIState(
    val isLoading: Boolean = true,
    val isError: Boolean = false,
    val data: {Feature}? = null
)
```

### 8. presentation/model/{Feature}Action.kt

```kotlin
sealed interface {Feature}Event : BaseViewEvent {
    data object Initialize : {Feature}Event
    data object OnBackPressed : {Feature}Event
    // adicione eventos conforme interações da tela
}

sealed interface {Feature}Effect : BaseViewEffect {
    data object NavigateBack : {Feature}Effect
    // adicione efeitos conforme navegação e side-effects
}
```

### 9. presentation/viewmodel/{Feature}ViewModel.kt

```kotlin
class {Feature}ViewModel(
    private val {feature}UseCase: {Feature}UseCaseInterface
) : BaseViewModel<{Feature}Event, {Feature}Effect>() {

    private val _uiState = MutableStateFlow({Feature}UIState())
    val uiState: StateFlow<{Feature}UIState> = _uiState.asStateFlow()

    fun initialize() {
        runTask(
            task = { {feature}UseCase.get{Feature}() },
            onSuccess = { data ->
                _uiState.update { it.copy(isLoading = false, isError = false, data = data) }
            },
            onFailure = {
                _uiState.update { it.copy(isLoading = false, isError = true) }
            }
        )
    }

    override fun processEvent(event: {Feature}Event) {
        when (event) {
            is {Feature}Event.Initialize -> initialize()
            is {Feature}Event.OnBackPressed -> emitEffect({Feature}Effect.NavigateBack)
        }
    }
}
```

### 10. presentation/view/{Feature}Screen.kt

```kotlin
class {Feature}Screen(
    private val viewModel: {Feature}ViewModel,
    private val onBackPress: () -> Unit
) : BaseScreen<{Feature}Event, {Feature}Effect>(viewModel) {

    @Composable
    override fun Content() {
        val uiState by viewModel.uiState.collectAsStateWithLifecycle()

        BackHandler { viewModel.processEvent({Feature}Event.OnBackPressed) }

        when {
            uiState.isLoading -> LoadingScreen()
            uiState.isError   -> ErrorScreen()
            else -> {Feature}Content(data = uiState.data)
        }
    }

    override fun processEffect(effect: {Feature}Effect) {
        when (effect) {
            is {Feature}Effect.NavigateBack -> onBackPress()
        }
    }
}

@Composable
private fun {Feature}Content(data: {Feature}?) {
    LiquidLayout(
        header = { LiquidHeader(title = "{Título da Tela}") }
    ) {
        // conteúdo da tela
    }
}
```

### 11. router/Routes.kt — adicionar rota

```kotlin
// Sem parâmetros:
@Serializable
data object {Feature} : Routes()

// Com parâmetros:
@Serializable
data class {Feature}(val {paramName}: {ParamType}) : Routes()
```

### 12. router/RouterManager.kt — adicionar composable

```kotlin
composable<Routes.{Feature}> {
    val viewModel = remember { transferContainer.get<{Feature}ViewModel>() }
    LaunchedEffect(Unit) { viewModel.initialize() }
    {Feature}Screen(
        viewModel = viewModel,
        onBackPress = { navController.popBackStack() }
    ).Start()
}
```

### 13. launcher/AppModule.kt — registrar DI

```kotlin
// --- Repositories ---
setSingleton<{Feature}RepositoryInterface> {
    {Feature}Repository()                        // sem rede
    // {Feature}Repository(api = get())          // com rede
}

// --- UseCases ---
setFactory<{Feature}UseCaseInterface> {
    {Feature}UseCase(repository = get())
}

// --- ViewModels ---
setFactory {
    {Feature}ViewModel(useCase = get())
}
```

---

## PASSO 3 — Testes

### ViewModelTest (6 casos obrigatórios)

```kotlin
@RunWith(RobolectricTestRunner::class)
@Config(manifest = Config.NONE)
class {Feature}ViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
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
        // verificar emissão de efeito via viewModel.effects (se exposto)
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

### UseCaseTest (3 casos obrigatórios)

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

---

## Skills relacionadas

- `SKILL_ANDROID_MVI` — detalhes do padrão BaseViewModel/BaseScreen/Event/Effect
- `SKILL_ANDROID_DI_CUSTOM` — detalhes de setSingleton/setFactory/transferContainer
- `SKILL_ANDROID_ROUTES` — detalhes de Routes sealed class e RouterManager
- `SKILL_ANDROID_TESTING` — testes com Robolectric e StandardTestDispatcher
