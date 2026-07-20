---
name: android-networking
description: |
  Skill para implementar chamadas de API REST em Android usando Retrofit com
  Coroutines (suspend fun). Use ao criar ApiServices, interceptors de autenticação,
  tratamento de erros de rede, DTOs com serialização e integração com Hilt.
  Proibido usar Call<T> com enqueue() ou RxJava em código novo.
metadata:
  version: "0.0.1"
---

# Android Networking — Retrofit + Coroutines

Orientação para implementar a camada de rede com Retrofit, OkHttp e Coroutines.

## Dependências (build.gradle.kts)

```kotlin
dependencies {
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    // Alternativa moderna com kotlinx.serialization:
    // implementation("com.jakewharton.retrofit:retrofit2-kotlinx-serialization-converter:1.0.0")
}
```

## DTO com Gson

```kotlin
import com.google.gson.annotations.SerializedName

data class ProdutoDto(
    @SerializedName("id") val id: String,
    @SerializedName("nome_completo") val nomeCompleto: String,
    @SerializedName("preco_centavos") val precoCentavos: Int,
    @SerializedName("categoria_id") val categoriaId: Int
) {
    fun toDomain() = Produto(
        id = id,
        nome = nomeCompleto,
        preco = precoCentavos / 100.0,
        categoria = Produto.Categoria.ELETRONICOS
    )
}
```

## ApiService com suspend fun

```kotlin
import retrofit2.http.*

interface ProdutoApiService {

    @GET("produtos")
    suspend fun fetchProdutos(): List<ProdutoDto>

    @GET("produtos/{id}")
    suspend fun fetchProduto(@Path("id") id: String): ProdutoDto

    @POST("produtos")
    suspend fun criarProduto(@Body dto: ProdutoDto): ProdutoDto

    @PUT("produtos/{id}")
    suspend fun atualizarProduto(
        @Path("id") id: String,
        @Body dto: ProdutoDto
    ): ProdutoDto

    @DELETE("produtos/{id}")
    suspend fun deletarProduto(@Path("id") id: String)
}
```

## Configuração com OkHttp + Hilt

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideOkHttpClient(
        @ApplicationContext context: Context
    ): OkHttpClient = OkHttpClient.Builder()
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG)
                HttpLoggingInterceptor.Level.BODY
            else
                HttpLoggingInterceptor.Level.NONE
        })
        .addInterceptor(AuthInterceptor())
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit = Retrofit.Builder()
        .baseUrl(BuildConfig.BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    @Provides
    @Singleton
    fun provideProdutoApiService(retrofit: Retrofit): ProdutoApiService =
        retrofit.create(ProdutoApiService::class.java)
}
```

## Interceptor de Autenticação

```kotlin
class AuthInterceptor @Inject constructor(
    private val tokenProvider: TokenProvider
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val token = tokenProvider.getToken() ?: return chain.proceed(chain.request())

        val request = chain.request().newBuilder()
            .addHeader("Authorization", "Bearer $token")
            .addHeader("Accept", "application/json")
            .build()

        val response = chain.proceed(request)

        if (response.code == 401) {
            tokenProvider.clearToken()
        }

        return response
    }
}
```

## Tratamento de Erros

```kotlin
sealed class NetworkResult<out T> {
    data class Success<T>(val data: T) : NetworkResult<T>()
    data class Error(val code: Int, val message: String) : NetworkResult<Nothing>()
    data object Loading : NetworkResult<Nothing>()
}

// Extensão helper para uso no repositório
suspend fun <T> safeApiCall(call: suspend () -> T): Result<T> = runCatching {
    withContext(Dispatchers.IO) { call() }
}.onFailure { throwable ->
    when (throwable) {
        is HttpException -> throw NetworkException.HttpError(throwable.code(), throwable.message())
        is IOException -> throw NetworkException.NoConnection
        else -> throw NetworkException.Unknown(throwable.message ?: "Erro desconhecido")
    }
}

// Uso no repositório
override suspend fun listar(): List<Produto> {
    return safeApiCall { apiService.fetchProdutos() }
        .getOrThrow()
        .map { it.toDomain() }
}
```

## Exceções de Rede

```kotlin
sealed class NetworkException(message: String) : Exception(message) {
    data class HttpError(val code: Int, override val message: String) : NetworkException(message)
    data object NoConnection : NetworkException("Sem conexão com a internet")
    data class Unknown(override val message: String) : NetworkException(message)
}
```

## Boas Práticas

- **NUNCA** use `Call<T>` com `enqueue()` — use `suspend fun` e Coroutines.
- **NUNCA** faça chamadas de rede na thread principal — use `Dispatchers.IO`.
- **NUNCA** logue dados sensíveis — configure logging apenas para DEBUG.
- **SEMPRE** trate `IOException` (sem internet) separado de `HttpException` (erro servidor).
- Use `BuildConfig.BASE_URL` para a URL base — nunca hardcode.
