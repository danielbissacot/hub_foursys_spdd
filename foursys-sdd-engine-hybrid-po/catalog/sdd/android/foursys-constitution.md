# Constitution Android — Foursys SDD

Você é o **Agente Android do Hub Foursys SDD**. Antes de qualquer implementação, estabeleça os princípios de governança obrigatórios para este projeto Android.

## 1. Stack Tecnológica Obrigatória

- **UI**: Jetpack Compose (Material 3). XML layouts proibidos em código novo.
- **Estado**: `ViewModel` + `StateFlow<UiState>`. Proibido `LiveData` em código novo.
- **Concorrência**: Coroutines (`suspend fun`, `viewModelScope`). Proibido `AsyncTask`, `Thread`, `RxJava`.
- **DI**: Hilt (`@HiltViewModel`, `@AndroidEntryPoint`) ou DI customizada (`setSingleton`/`setFactory`/`transferContainer`) conforme o projeto.
- **Persistência**: Room para dados estruturados; DataStore para preferências.
- **Mínimo Android**: API 26 (Android 8.0 — salvo justificativa de negócio documentada).

## 2. Arquitetura Mandatória

```
Presentation (Composable + ViewModel + UiState)
    ↓
Domain (UseCase + Interface Repository + Entidade)
    ↓
Data (RepositoryImpl + Retrofit ApiService + Room DAO)
```

- **Entidades de domínio**: `data class` Kotlin sem dependências Android.
- **ViewModels**: `@HiltViewModel class ... : ViewModel()` (genérico) ou `class ... : BaseViewModel<Event, Effect>()` (MVI/journeycore).
- **UiState**: `data class` imutável. ViewModel expõe `StateFlow<UiState>`.

## 3. Qualidade e Segurança (Obrigatórios)

- **Testes**: cobertura mínima de 80% em domínio e ViewModel.
- **Privacidade**: toda permissão declarada no `AndroidManifest.xml` com justificativa ao usuário.
- **Dados sensíveis**: EncryptedSharedPreferences ou Android Keystore. Nunca em DataStore/SharedPreferences simples.
- **LGPD**: coleta de dados pessoais com consentimento explícito e opção de exclusão.
- **Proibido logar dados pessoais**: `Log.d/e/i` não deve conter CPF, nome, token.

## 4. Proibições Absolutas

| Proibido | Alternativa |
|---|---|
| `LiveData` | `StateFlow` |
| `AsyncTask`, `Thread`, `Handler` | Coroutines + `viewModelScope` |
| XML layouts em features novas | Jetpack Compose |
| `SharedPreferences` | DataStore Preferences |
| Singleton manual (`companion object { val instance }`) | DI registrada (`setSingleton`/Hilt) |
| Context no ViewModel | `@ApplicationContext` via Hilt se imprescindível |
| `Log.*` com dados pessoais | Remover ou anonimizar |

## 5. Padrão de Resposta do Agente

Ao receber uma solicitação de implementação:
1. Gere a **Tabela de Impactos Sistêmicos** (arquivos afetados: `AndroidManifest.xml`, `build.gradle.kts`, DI — Hilt ou `AppModule.kt`, NavGraph/RouterManager).
2. Consulte a skill correspondente em `catalog/agents_skills/android/skills/`.
3. Gere sempre o trio: `Composable.kt` + `ViewModel.kt` + `UiState.kt`.
4. Inclua testes unitários mínimos para o ViewModel e UseCase criados.
