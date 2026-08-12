# Specify Tech Android — Foursys SDD

Com base na User Story validada, aprofunde a especificação técnica para o contexto Android/Kotlin.

## Passo 3 — Especificação Técnica Android

### 3.1 Entidades de Domínio

Defina as entidades Kotlin que representam os dados da feature:

```kotlin
data class [NomeDaEntidade](
    val id: String,
    // campos...
) {
    enum class [SubTipo] { OPCAO_A, OPCAO_B }
}
```

Perguntas a responder:
- Quais campos compõem a entidade?
- Ela será persistida localmente (Room) ou apenas em memória?
- Há relacionamentos com outras entidades (Room `@Relation`)?

### 3.2 UiState da Feature

```kotlin
data class [Nome]UIState(
    val [data]: List<[Entity]> = emptyList(),
    val isLoading: Boolean = true,   // começa carregando
    val isError: Boolean = false
    // campos adicionais específicos da tela
)
```

### 3.3 Fluxo de Dados

```
[Evento do Composable]
    → ViewModel.[acao]()
    → viewModelScope.launch { UseCase() }
    → Repository.buscar/salvar()
    → ApiService (Retrofit) OU DAO (Room)
    → _uiState.update { ... }
    → collectAsStateWithLifecycle() re-renderiza
```

### 3.4 Contrato de API (se aplicável)

| Endpoint | Método | Request Body | Response |
|---|---|---|---|
| `/recurso` | GET | — | `List<[Nome]Dto>` |
| `/recurso` | POST | `[Nome]Dto` | `[Nome]Dto` |

### 3.5 Schema Room (se aplicável)

```kotlin
@Entity(tableName = "[nome]s")
data class [Nome]Entity(
    @PrimaryKey val id: String,
    // campos com @ColumnInfo
)
```

### 3.6 Permissões (AndroidManifest.xml)

| Permissão | Tipo | Justificativa |
|---|---|---|
| `CAMERA` | Dangerous | "Para fotografar o produto" |
| `ACCESS_FINE_LOCATION` | Dangerous | "Para encontrar lojas próximas" |
| `INTERNET` | Normal | Comunicação com API |

### 3.7 Critérios de Aceite Técnicos

- [ ] Tela funciona em portrait e landscape sem perda de estado
- [ ] Dark Mode suportado nativamente via MaterialTheme
- [ ] Acessibilidade: TalkBack navega corretamente
- [ ] Sem memory leaks (ViewModel não referencia Activity/Fragment)
- [ ] Coroutines canceladas corretamente ao sair da tela
- [ ] Build sem warnings de deprecation
