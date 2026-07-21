---
name: android-di-custom
description: |
  Skill para injeção de dependência customizada do projeto BNJOpenAccount (Bradesco).
  Cobre setSingleton, setFactory, transferContainer.get, os 3 blocos obrigatórios em
  AppModule.kt (Repositories → UseCases → ViewModels) e o padrão remember { transferContainer.get<VM>() }
  no RouterManager. Use em projetos que NÃO usam Hilt mas sim o container customizado.
metadata:
  version: "0.1.0"
---

# Android DI Customizada — setSingleton + setFactory + transferContainer

Injeção de dependência do projeto BNJOpenAccount. Não usa Hilt.

## Contrato do container

```
setSingleton<Interface> { Implementação() }   → uma instância reutilizada
setFactory<Interface>   { Implementação() }   → nova instância a cada get()
transferContainer.get<T>()                    → resolve dependência pelo tipo
```

## 1. Registrar em AppModule.kt

Sempre 3 blocos na ordem: **Repositories → UseCases → ViewModels**.

### Sem chamadas de rede

```kotlin
// AppModule.kt

// --- Repositories ---
setSingleton<{Feature}RepositoryInterface> {
    {Feature}Repository()
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

### Com chamadas de rede

```kotlin
// AppModule.kt

// --- Repositories ---
setSingleton<{Feature}RepositoryInterface> {
    {Feature}Repository(api = get())      // get() resolve ApiRemoteDataSource ou similar
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

## 2. Resolver no RouterManager.kt

```kotlin
// RouterManager.kt
composable<Routes.{Feature}> {
    val viewModel = remember { transferContainer.get<{Feature}ViewModel>() }
    LaunchedEffect(Unit) { viewModel.initialize() }
    {Feature}Screen(
        viewModel = viewModel,
        onBackPress = { navController.popBackStack() }
    ).Start()
}
```

`remember { ... }` é obrigatório para evitar recriação do ViewModel a cada recomposição.

## 3. Verificação antes de implementar

**Leia estes arquivos antes de alterar:**

```
router/Routes.kt          → verificar se rota já existe
router/RouterManager.kt   → verificar se composable já existe
launcher/AppModule.kt     → verificar se registros já existem
```

## 4. Interfaces de domínio

O container registra pela interface, não pela implementação:

```kotlin
// domain/repository/{Feature}RepositoryInterface.kt
interface {Feature}RepositoryInterface {
    suspend fun get{Feature}(): {DomainModel}
}

// domain/usecase/{Feature}UseCaseInterface.kt
interface {Feature}UseCaseInterface {
    suspend fun get{Feature}(): Result<{DomainModel}>
}
```

## Regras

| Regra | Detalhe |
|---|---|
| Ordem dos blocos | Repositories → UseCases → ViewModels (nunca inverter) |
| `setSingleton` | Repository — uma instância compartilhada |
| `setFactory` | UseCase e ViewModel — nova instância por uso |
| `get()` | Resolve dependência pelo tipo genérico |
| `remember { transferContainer.get<VM>() }` | SEMPRE no RouterManager, nunca no Composable direto |
| Sem `@HiltViewModel` | Projeto não usa Hilt |

## Proibições

| Proibido | Alternativa |
|---|---|
| `@HiltViewModel` / `@Inject constructor` | `setFactory { ViewModel(useCase = get()) }` |
| `hiltViewModel()` no Composable | `remember { transferContainer.get<ViewModel>() }` |
| Criar singleton manual (`companion object`) | `setSingleton<Interface> { Impl() }` |
| Registrar pela classe concreta sem interface | Sempre `setSingleton<Interface>` / `setFactory<Interface>` |
