# Plan Android — Foursys SDD

Com base na User Story e especificação técnica, gere o **Plano de Implementação Técnico** para esta feature Android.

## Estrutura Obrigatória do Plano

### 0. Levantamento do Projeto Real (OBRIGATÓRIO, antes de tudo)

Antes de montar o plano, procure no projeto Android aberto se já existem pastas/arquivos em `feature/[nome]/domain`, `data` ou `presentation` relacionados à feature da história (busque por nome de domínio/feature parecido, não só no texto da história). Liste o que encontrar, com caminho real, e use como base — só proponha arquivo novo pra camada/feature que a busca não encontrar.

**Checagem obrigatória do pacote real**: extraia o `applicationId`/`namespace` real do `app/build.gradle.kts` (ou o pacote declarado no `AndroidManifest.xml`). Compare com qualquer pacote citado em exemplo de skill — nunca use um pacote de exemplo como se fosse o real deste projeto. O contexto traz um bloco **MAPA REAL DO PROJETO** (identificador base + pastas existentes) — use ele como fonte da verdade. Se o mapa não vier, NÃO trave a fase: gere normalmente, marcando no topo "⚠️ Estrutura proposta sem confirmação contra o projeto — validar antes de implementar".

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

> Nomes abaixo são os que o Copilot reconhece (slug da skill). Cite-os para o desenvolvedor
> abrir na implementação — nesta fase você não executa skill, apenas referencia.

- `android-feature-scaffold` — scaffold completo (MVI + DI customizada + rotas)
- `android-mvi` — padrão BaseViewModel/BaseScreen/Event/Effect (BNJOpenAccount)
- `android-di-custom` — setSingleton/setFactory/transferContainer (BNJOpenAccount)
- `android-routes` — Routes sealed class + RouterManager
- `android-compose` — para criação da tela (genérico)
- `android-architecture` — para estrutura MVVM (genérico)
- `android-networking` — se houver chamada de API (Retrofit genérico)
- `android-persistence` — se houver dados locais
- `android-testing` — para cobertura de testes (JUnit + Robolectric)

### 5. Critérios de Aceitação Técnica

- [ ] UIState imutável (`data class`) com `isLoading: Boolean = true` e `isError: Boolean = false` (inglês)
- [ ] ViewModel usa `viewModelScope` (genérico) ou `BaseViewModel<Event, Effect>` (MVI/BNJOpenAccount)
- [ ] StateFlow exposto como `asStateFlow()` (imutável para a UI)
- [ ] DI configurada: Hilt (`@HiltViewModel`) OU 3 blocos em `AppModule.kt` (setSingleton/setFactory)
- [ ] Cobertura de testes ≥80% no ViewModel e UseCase
- [ ] Tela funciona em portrait e landscape
- [ ] Dark Mode suportado via MaterialTheme
