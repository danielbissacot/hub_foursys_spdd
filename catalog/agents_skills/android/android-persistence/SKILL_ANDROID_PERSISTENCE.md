---
name: android-persistence
description: |
  Skill para implementar persistência local em Android usando Room para dados
  estruturados e DataStore Preferences para configurações. Use ao criar entidades,
  DAOs, migrações de banco de dados e armazenamento de preferências do usuário.
  Proibido usar SharedPreferences e SQLite direto em código novo.
metadata:
  version: "0.0.1"
---

# Android Persistence — Room + DataStore

Orientação para persistência local em Android com Room e DataStore Preferences.

## Dependências (build.gradle.kts)

```kotlin
dependencies {
    // Room
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")

    // DataStore
    implementation("androidx.datastore:datastore-preferences:1.1.1")
}
```

## Room — Entidade

```kotlin
import androidx.room.*

@Entity(tableName = "produtos")
data class ProdutoEntity(
    @PrimaryKey val id: String,
    @ColumnInfo(name = "nome") val nome: String,
    @ColumnInfo(name = "preco") val preco: Double,
    @ColumnInfo(name = "categoria") val categoria: String,
    @ColumnInfo(name = "data_criacao") val dataCriacao: Long = System.currentTimeMillis()
) {
    fun toDomain() = Produto(
        id = id,
        nome = nome,
        preco = preco,
        categoria = Produto.Categoria.valueOf(categoria)
    )
}

fun Produto.toEntity() = ProdutoEntity(
    id = id,
    nome = nome,
    preco = preco,
    categoria = categoria.name
)
```

## Room — DAO

```kotlin
@Dao
interface ProdutoDao {

    @Query("SELECT * FROM produtos ORDER BY data_criacao DESC")
    fun listarTodos(): Flow<List<ProdutoEntity>>   // Flow para reatividade

    @Query("SELECT * FROM produtos WHERE id = :id")
    suspend fun buscarPorId(id: String): ProdutoEntity?

    @Query("SELECT * FROM produtos WHERE nome LIKE '%' || :termo || '%'")
    fun buscarPorNome(termo: String): Flow<List<ProdutoEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun inserir(produto: ProdutoEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun inserirTodos(produtos: List<ProdutoEntity>)

    @Update
    suspend fun atualizar(produto: ProdutoEntity)

    @Delete
    suspend fun deletar(produto: ProdutoEntity)

    @Query("DELETE FROM produtos WHERE id = :id")
    suspend fun deletarPorId(id: String)

    @Query("DELETE FROM produtos")
    suspend fun limparTodos()
}
```

## Room — Database

```kotlin
@Database(
    entities = [ProdutoEntity::class],
    version = 1,
    exportSchema = false   // true em produção com migrations automáticas
)
@TypeConverters(Conversores::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun produtoDao(): ProdutoDao
}

// TypeConverters para tipos não suportados nativamente
class Conversores {
    @TypeConverter
    fun deListaParaString(lista: List<String>): String = lista.joinToString(",")

    @TypeConverter
    fun deStringParaLista(valor: String): List<String> =
        if (valor.isBlank()) emptyList() else valor.split(",")
}
```

## Room — Hilt Module

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideAppDatabase(
        @ApplicationContext context: Context
    ): AppDatabase = Room.databaseBuilder(
        context,
        AppDatabase::class.java,
        "app_database"
    )
    .fallbackToDestructiveMigration()   // use migrations explícitas em produção
    .build()

    @Provides
    fun provideProdutoDao(database: AppDatabase): ProdutoDao = database.produtoDao()
}
```

## Migrations (Produção)

```kotlin
val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL("ALTER TABLE produtos ADD COLUMN descricao TEXT DEFAULT ''")
    }
}

// Na configuração do database:
Room.databaseBuilder(context, AppDatabase::class.java, "app_database")
    .addMigrations(MIGRATION_1_2)
    .build()
```

## DataStore Preferences — Para Configurações

```kotlin
// DataStore module
@Module
@InstallIn(SingletonComponent::class)
object DataStoreModule {
    @Provides
    @Singleton
    fun provideDataStore(
        @ApplicationContext context: Context
    ): DataStore<Preferences> = PreferenceDataStoreFactory.create {
        context.preferencesDataStoreFile("preferencias_usuario")
    }
}

// Repository de preferências
class PreferenciasRepository @Inject constructor(
    private val dataStore: DataStore<Preferences>
) {
    private object Keys {
        val TEMA_ESCURO = booleanPreferencesKey("tema_escuro")
        val IDIOMA = stringPreferencesKey("idioma")
        val PRIMEIRA_ABERTURA = booleanPreferencesKey("primeira_abertura")
    }

    val temaEscuro: Flow<Boolean> = dataStore.data.map { prefs ->
        prefs[Keys.TEMA_ESCURO] ?: false
    }

    suspend fun setTemaEscuro(ativo: Boolean) {
        dataStore.edit { prefs -> prefs[Keys.TEMA_ESCURO] = ativo }
    }

    val idioma: Flow<String> = dataStore.data.map { prefs ->
        prefs[Keys.IDIOMA] ?: "pt-BR"
    }

    suspend fun setIdioma(idioma: String) {
        dataStore.edit { prefs -> prefs[Keys.IDIOMA] = idioma }
    }
}
```

## Quando Usar Cada Solução

| Dado | Solução |
|---|---|
| Listas, entidades, relacionamentos | Room |
| Preferências do usuário (tema, idioma) | DataStore Preferences |
| Dados estruturados complexos | DataStore Proto (Protobuf) |
| Tokens, senhas | EncryptedSharedPreferences ou Keystore |
| Cache de imagens | Coil / Glide (gerenciam automaticamente) |
| Arquivos grandes | FileProvider + Internal Storage |

**NUNCA use `SharedPreferences` em código novo** — use DataStore.
