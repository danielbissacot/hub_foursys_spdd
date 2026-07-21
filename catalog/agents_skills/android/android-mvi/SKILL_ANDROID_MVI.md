---
name: android-mvi
description: |
  Skill para implementar o padrão MVI (Model-View-Intent) usando a biblioteca journeycore
  do projeto BNJOpenAccount (Bradesco). Cobre BaseViewModel, BaseScreen, Event (BaseViewEvent),
  Effect (BaseViewEffect), UIState com isLoading/isError, BackHandler e o ciclo completo
  Composable → processEvent → runTask → emitEffect → processEffect.
  Use este skill em projetos que herdam de BaseViewModel<Event, Effect>.
metadata:
  version: "0.1.0"
---

# Android MVI — BaseViewModel + BaseScreen (journeycore)

Padrão MVI para o projeto BNJOpenAccount. Toda feature segue este contrato obrigatório.

## Ciclo MVI

```
Composable
  └─ viewModel.processEvent(Event.AlgumaAcao)
        └─ BaseViewModel.processEvent()
              └─ runTask { useCase.execute() }
                    ├─ onSuccess → _uiState.update { ... }
                    └─ onFailure → emitEffect(Effect.ShowError) ou _uiState.update { isError = true }
                          └─ BaseScreen.processEffect(effect)
                                └─ navController.navigate(...) / showToast / popBackStack
```

## 1. UIState

```kotlin
data class {Feature}UIState(
    val isLoading: Boolean = true,
    val isError: Boolean = false,
    val data: {DomainModel}? = null
)
```

Regras:
- `isLoading = true` por padrão (tela começa carregando)
- `isError: Boolean` — nunca `String?`
- Todos os campos em inglês

## 2. Event e Effect

```kotlin
// {Feature}Action.kt
sealed interface {Feature}Event : BaseViewEvent {
    data object Initialize : {Feature}Event
    data object OnBackPressed : {Feature}Event
    data class OnItemClicked(val id: String) : {Feature}Event
    // adicione eventos de acordo com interações da tela
}

sealed interface {Feature}Effect : BaseViewEffect {
    data object NavigateBack : {Feature}Effect
    data class NavigateTo{NextFeature}(val id: String) : {Feature}Effect
    data object ShowGenericError : {Feature}Effect
}
```

## 3. ViewModel

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
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        isError = false,
                        data = data
                    )
                }
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
            is {Feature}Event.OnItemClicked -> emitEffect(
                {Feature}Effect.NavigateTo{NextFeature}(event.id)
            )
        }
    }
}
```

## 4. Screen (BaseScreen)

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
            else -> {Feature}Content(
                data = uiState.data,
                onItemClick = { id ->
                    viewModel.processEvent({Feature}Event.OnItemClicked(id))
                }
            )
        }
    }

    override fun processEffect(effect: {Feature}Effect) {
        when (effect) {
            is {Feature}Effect.NavigateBack -> onBackPress()
            is {Feature}Effect.NavigateTo{NextFeature} -> {
                // navegação via parâmetro recebido no construtor
            }
            is {Feature}Effect.ShowGenericError -> {
                // mostrar snackbar ou dialog
            }
        }
    }
}
```

## 5. Composable de conteúdo (separado do Screen)

```kotlin
@Composable
private fun {Feature}Content(
    data: {DomainModel}?,
    onItemClick: (String) -> Unit
) {
    LiquidLayout(
        header = {
            LiquidHeader(title = "{Título da Tela}")
        }
    ) {
        // conteúdo da tela
    }
}
```

## Regras do padrão

| Regra | Detalhe |
|---|---|
| `isLoading = true` | Estado inicial é sempre loading |
| Events = intenções | Cliques, navegação, ações — NUNCA lógica |
| Effects = efeitos únicos | Navegar, mostrar toast — disparados uma vez |
| `processEffect` na Screen | NUNCA no ViewModel |
| `BackHandler` | SEMPRE via `processEvent(Event.OnBackPressed)` |
| `LoadingScreen()` | Componente Liquid — não criar loading customizado |
| `ErrorScreen()` | Componente Liquid — não criar error customizado |

## Proibições

| Proibido | Alternativa |
|---|---|
| `viewModel.someMethod()` diretamente na UI | `viewModel.processEvent(Event.X)` |
| Lógica de negócio no `processEffect` | Mover para `processEvent` → `runTask` |
| `String?` para representar erro | `isError: Boolean` |
| `isLoading = false` como padrão | `isLoading = true` — tela começa carregando |
| Campos em português no UIState | Inglês obrigatório |
