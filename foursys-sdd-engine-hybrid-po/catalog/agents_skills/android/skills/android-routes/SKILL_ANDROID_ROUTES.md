---
name: android-routes
description: |
  Skill para criar e registrar rotas de navegação no projeto BNJOpenAccount (Bradesco).
  Cobre a sealed class Routes com @Serializable, data object (sem parâmetros) e data class
  (com parâmetros), composable<Routes.Feature> no RouterManager e backStackEntry.toRoute<>()
  para extração de parâmetros. Use sempre que adicionar uma nova tela ao projeto.
metadata:
  version: "0.1.0"
---

# Android Routes — @Serializable sealed class + RouterManager

Padrão de navegação do projeto BNJOpenAccount com Navigation Compose tipado.

## 1. Adicionar rota em Routes.kt

```kotlin
// router/Routes.kt
@Serializable
sealed class Routes() {

    // Tela sem parâmetros
    @Serializable
    data object {Feature} : Routes()

    // Tela com parâmetros
    @Serializable
    data class {Feature}(val {paramName}: {ParamType}) : Routes()
}
```

### Exemplos reais

```kotlin
@Serializable
sealed class Routes() {

    @Serializable
    data object Home : Routes()

    @Serializable
    data object OpenAccount : Routes()

    @Serializable
    data class AccountDetails(val accountId: String) : Routes()

    @Serializable
    data class Payment(val amount: Double, val recipientId: String) : Routes()
}
```

## 2. Registrar composable no RouterManager.kt

### Tela sem parâmetros

```kotlin
// router/RouterManager.kt
composable<Routes.{Feature}> {
    val viewModel = remember { transferContainer.get<{Feature}ViewModel>() }
    LaunchedEffect(Unit) { viewModel.initialize() }
    {Feature}Screen(
        viewModel = viewModel,
        onBackPress = { navController.popBackStack() }
    ).Start()
}
```

### Tela com parâmetros

```kotlin
// router/RouterManager.kt
composable<Routes.{Feature}> { backStackEntry ->
    val route = backStackEntry.toRoute<Routes.{Feature}>()
    val viewModel = remember { transferContainer.get<{Feature}ViewModel>() }
    LaunchedEffect(Unit) { viewModel.initialize(route.{paramName}) }
    {Feature}Screen(
        viewModel = viewModel,
        onBackPress = { navController.popBackStack() }
    ).Start()
}
```

## 3. Navegar para a tela

```kotlin
// No processEffect da Screen que origina a navegação:
override fun processEffect(effect: {PreviousFeature}Effect) {
    when (effect) {
        // Sem parâmetros
        is {PreviousFeature}Effect.NavigateTo{Feature} ->
            navController.navigate(Routes.{Feature})

        // Com parâmetros
        is {PreviousFeature}Effect.NavigateTo{Feature} ->
            navController.navigate(Routes.{Feature}(
                {paramName} = effect.{paramName}
            ))
    }
}
```

## 4. Verificação antes de implementar

**Leia estes arquivos antes de alterar:**

```
router/Routes.kt        → verificar se rota já existe (evitar duplicatas)
router/RouterManager.kt → verificar se composable já existe
launcher/AppModule.kt   → confirmar que o ViewModel está registrado
```

## Regras

| Regra | Detalhe |
|---|---|
| `@Serializable` em toda subclasse | Navigation Compose exige para rotas tipadas |
| `data object` | Rota sem parâmetros |
| `data class` | Rota com parâmetros |
| `backStackEntry.toRoute<Routes.X>()` | Extração de parâmetros tipada |
| `remember { transferContainer.get<VM>() }` | SEMPRE ao resolver o ViewModel |
| `LaunchedEffect(Unit) { vm.initialize() }` | Inicializa após composição |

## Proibições

| Proibido | Alternativa |
|---|---|
| `navController.navigate("rota_string")` | `navController.navigate(Routes.{Feature})` |
| `NavType.StringType` manual | `@Serializable data class` com o tipo nativo |
| `arguments["param"]?.getString(...)` | `backStackEntry.toRoute<Routes.X>().param` |
| ViewModel instanciado diretamente no composable | `remember { transferContainer.get<VM>() }` |
