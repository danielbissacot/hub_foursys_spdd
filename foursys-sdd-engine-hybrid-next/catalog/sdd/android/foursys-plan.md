# Plan Android — Foursys SDD

Com base na User Story e especificação técnica, gere o **Plano de Implementação Técnico** para esta feature Android.

## Estrutura Obrigatória do Plano

### 1. Tabela de Impactos Sistêmicos

Liste TODOS os arquivos globais que serão criados ou modificados:

| Arquivo | Impacto | Ação |
|---|---|---|
| `AndroidManifest.xml` | Nova permissão (se aplicável) | Modificar |
| `app/build.gradle.kts` | Nova dependência (Retrofit, Room, etc.) | Modificar |
| `NavGraph.kt` | Nova rota de navegação | Modificar |
| `AppModule.kt` / `DatabaseModule.kt` | Novo provider DI (Hilt ou setSingleton/setFactory) | Modificar |

### 2. Arquivos a Criar

Liste os novos arquivos por camada:

**Domain:**
- `feature/[nome]/domain/model/[Entidade].kt`
- `feature/[nome]/domain/repository/[Nome]Repository.kt` (interface)
- `feature/[nome]/domain/usecase/[Acao][Nome]UseCase.kt`

**Data:**
- `feature/[nome]/data/repository/[Nome]RepositoryImpl.kt`
- `feature/[nome]/data/remote/[Nome]ApiService.kt`
- `feature/[nome]/data/remote/[Nome]Dto.kt`
- `feature/[nome]/data/local/[Nome]Entity.kt`
- `feature/[nome]/data/local/[Nome]Dao.kt`

**Presentation:**
- `feature/[nome]/presentation/[Nome]Screen.kt`
- `feature/[nome]/presentation/[Nome]ViewModel.kt`
- `feature/[nome]/presentation/[Nome]UiState.kt`

**Tests:**
- `test/.../[Acao][Nome]UseCaseTest.kt`
- `test/.../[Nome]ViewModelTest.kt`

### 3. Dependências e Permissões

- [ ] Nova permissão no `AndroidManifest.xml`? (CAMERA, LOCATION, etc.)
- [ ] Nova dependência em `build.gradle.kts`? (nome e versão)
- [ ] Nova rota no `NavGraph.kt`?
- [ ] DI atualizada? (novo módulo Hilt `@Module @InstallIn(...)` ou 3 blocos em `AppModule.kt`)
- [ ] Migration do Room necessária? (versão do `@Database` + `Migration`)

### 4. Skills a Consultar

- `SKILL_ANDROID_FEATURE_SCAFFOLD` — scaffold completo (MVI + DI customizada + rotas)
- `SKILL_ANDROID_MVI` — padrão BaseViewModel/BaseScreen/Event/Effect (BNJOpenAccount)
- `SKILL_ANDROID_DI_CUSTOM` — setSingleton/setFactory/transferContainer (BNJOpenAccount)
- `SKILL_ANDROID_ROUTES` — Routes sealed class + RouterManager
- `SKILL_ANDROID_COMPOSE` — para criação da tela (genérico)
- `SKILL_ANDROID_ARCHITECTURE` — para estrutura MVVM (genérico)
- `SKILL_ANDROID_NETWORKING` — se houver chamada de API (Retrofit genérico)
- `SKILL_ANDROID_PERSISTENCE` — se houver dados locais
- `SKILL_ANDROID_TESTING` — para cobertura de testes (JUnit + Robolectric)

### 5. Critérios de Aceitação Técnica

- [ ] UIState imutável (`data class`) com `isLoading: Boolean = true` e `isError: Boolean = false` (inglês)
- [ ] ViewModel usa `viewModelScope` (genérico) ou `BaseViewModel<Event, Effect>` (MVI/BNJOpenAccount)
- [ ] StateFlow exposto como `asStateFlow()` (imutável para a UI)
- [ ] DI configurada: Hilt (`@HiltViewModel`) OU 3 blocos em `AppModule.kt` (setSingleton/setFactory)
- [ ] Cobertura de testes ≥80% no ViewModel e UseCase
- [ ] Tela funciona em portrait e landscape
- [ ] Dark Mode suportado via MaterialTheme
