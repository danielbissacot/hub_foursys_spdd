---
name: android-architecture
description: |
  Skill para implementar MVVM com Clean Architecture em projetos Android usando
  Hilt para injeção de dependência, ViewModel com StateFlow e UiState, e
  separação em camadas domain/data/presentation. Use ao criar novas features,
  organizar módulos e configurar Hilt. Proibido usar singletons manuais ou LiveData.
metadata:
  version: "0.0.1"
---

# Android Architecture — MVVM + Clean Architecture + Hilt

Orientação para estruturar projetos Android modernos com separação de responsabilidades.

## Estrutura de Módulos por Feature

```
app/src/main/java/com/empresa/app/
├── di/
│   └── AppModule.kt              # Módulo Hilt da aplicação
├── feature/
│   └── produto/
│       ├── domain/
│       │   ├── model/
│       │   │   └── Produto.kt
│       │   ├── repository/
│       │   │   └── ProdutoRepository.kt   # interface
│       │   └── usecase/
│       │       └── BuscarProdutosUseCase.kt
│       ├── data/
│       │   ├── repository/
│       │   │   └── ProdutoRepositoryImpl.kt
│       │   ├── remote/
│       │   │   ├── ProdutoApiService.kt
│       │   │   └── ProdutoDto.kt
│       │   └── local/
│       │       └── ProdutoDao.kt
│       └── presentation/
│           ├── ListaProdutosScreen.kt
│           ├── ListaProdutosViewModel.kt
│           └── ListaProdutosUiState.kt
```

## UiState — Sealed Class

```kotlin
data class ListaProdutosUiState(
    val produtos: List<Produto> = emptyList(),
    val isCarregando: Boolean = false,
    val erro: String? = null
)
```

## ViewModel

```kotlin
@HiltViewModel
class ListaProdutosViewModel @Inject constructor(
    private val buscarProdutos: BuscarProdutosUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(ListaProdutosUiState())
    val uiState: StateFlow<ListaProdutosUiState> = _uiState.asStateFlow()

    init {
        carregarProdutos()
    }

    fun carregarProdutos() {
        viewModelScope.launch {
            _uiState.update { it.copy(isCarregando = true, erro = null) }
            buscarProdutos()
                .onSuccess { produtos ->
                    _uiState.update { it.copy(produtos = produtos, isCarregando = false) }
                }
                .onFailure { erro ->
                    _uiState.update { it.copy(erro = erro.message, isCarregando = false) }
                }
        }
    }

    fun selecionarProduto(produto: Produto) {
        // navegação ou evento de UI
    }
}
```

## UseCase

```kotlin
class BuscarProdutosUseCase @Inject constructor(
    private val repository: ProdutoRepository
) {
    suspend operator fun invoke(): Result<List<Produto>> = runCatching {
        repository.listar()
    }
}
```

## Interface de Repositório (Domínio)

```kotlin
// Sem dependências Android — só Kotlin puro
interface ProdutoRepository {
    suspend fun listar(): List<Produto>
    suspend fun buscarPorId(id: String): Produto?
    suspend fun salvar(produto: Produto)
    suspend fun deletar(id: String)
}
```

## Implementação de Repositório (Data)

```kotlin
class ProdutoRepositoryImpl @Inject constructor(
    private val apiService: ProdutoApiService,
    private val dao: ProdutoDao
) : ProdutoRepository {

    override suspend fun listar(): List<Produto> {
        return try {
            val remotos = apiService.fetchProdutos()
            val dominio = remotos.map { it.toDomain() }
            dao.inserirTodos(dominio.map { it.toEntity() })
            dominio
        } catch (e: Exception) {
            // Fallback para cache local
            dao.listarTodos().map { it.toDomain() }
        }
    }
}
```

## Hilt — Configuração

```kotlin
// Application
@HiltAndroidApp
class MeuApplication : Application()

// MainActivity
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { MeuAppTheme { NavGraph() } }
    }
}

// Módulo de DI
@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideProdutoRepository(
        apiService: ProdutoApiService,
        dao: ProdutoDao
    ): ProdutoRepository = ProdutoRepositoryImpl(apiService, dao)

    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl("https://api.exemplo.com/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    @Provides
    @Singleton
    fun provideProdutoApiService(retrofit: Retrofit): ProdutoApiService =
        retrofit.create(ProdutoApiService::class.java)
}
```

## Regras de Camada

| Camada | Pode depender de | Proibido depender de |
|---|---|---|
| `domain` | Kotlin stdlib | Android SDK, Room, Retrofit, Hilt |
| `data` | `domain`, Room, Retrofit, Hilt | `presentation` |
| `presentation` | `domain`, Hilt, Compose | Implementações de `data` diretamente |

## Entidade de Domínio

```kotlin
data class Produto(
    val id: String,
    val nome: String,
    val preco: Double,
    val categoria: Categoria
) {
    enum class Categoria { ELETRONICOS, ROUPAS, ALIMENTOS }
}
```
