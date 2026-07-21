---
name: android-compose
description: |
  Skill para criar telas e componentes com Jetpack Compose em projetos Android.
  Use ao criar Composables, gerenciar estado com remember/State, construir listas
  com LazyColumn, aplicar temas Material 3 e implementar navegação com
  Navigation Compose. Proibido criar XML layouts em projetos novos.
metadata:
  version: "0.0.1"
---

# Jetpack Compose — UI Android Moderna

Orientação para criar interfaces Android modernas com Jetpack Compose e Material 3.

## Estrutura Padrão de um Composable

```kotlin
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.foundation.layout.*

@Composable
fun ProdutoCard(
    produto: Produto,
    onTap: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        onClick = onTap,
        modifier = modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = produto.nome,
                style = MaterialTheme.typography.titleMedium
            )
            Text(
                text = "R$ %.2f".format(produto.preco),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
```

## Gerenciamento de Estado

```kotlin
// Estado local simples
@Composable
fun ContadorView() {
    var contador by remember { mutableStateOf(0) }

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Valor: $contador", style = MaterialTheme.typography.headlineMedium)
        Button(onClick = { contador++ }) {
            Text("Incrementar")
        }
    }
}

// Estado derivado
@Composable
fun FormularioBusca(viewModel: BuscaViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Column {
        OutlinedTextField(
            value = uiState.termoBusca,
            onValueChange = viewModel::onTermoMudou,
            label = { Text("Buscar produtos") },
            modifier = Modifier.fillMaxWidth()
        )

        if (uiState.isCarregando) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        }
    }
}
```

## LazyColumn — Listas Performáticas

```kotlin
@Composable
fun ListaProdutosScreen(
    viewModel: ListaProdutosViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    when {
        uiState.isCarregando -> {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        }
        uiState.erro != null -> {
            ErroView(
                mensagem = uiState.erro,
                onRetry = viewModel::carregarProdutos
            )
        }
        else -> {
            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(
                    items = uiState.produtos,
                    key = { it.id }      // key obrigatório para animações e performance
                ) { produto ->
                    ProdutoCard(
                        produto = produto,
                        onTap = { viewModel.selecionarProduto(produto) }
                    )
                }
            }
        }
    }
}
```

## Tema Material 3

```kotlin
// Theme.kt
@Composable
fun MeuAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) darkColorScheme() else lightColorScheme()

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography(),
        content = content
    )
}

// MainActivity.kt
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MeuAppTheme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    NavGraph()
                }
            }
        }
    }
}
```

## Navegação com Navigation Compose

```kotlin
// NavGraph.kt
@Composable
fun NavGraph(navController: NavHostController = rememberNavController()) {
    NavHost(navController = navController, startDestination = "lista") {
        composable("lista") {
            ListaProdutosScreen(
                onProdutoClick = { id -> navController.navigate("detalhe/$id") }
            )
        }
        composable(
            route = "detalhe/{produtoId}",
            arguments = listOf(navArgument("produtoId") { type = NavType.StringType })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getString("produtoId") ?: return@composable
            DetalheProdutoScreen(produtoId = id)
        }
    }
}
```

## Boas Práticas

| Prática | Detalhe |
|---|---|
| `modifier: Modifier = Modifier` | Todo Composable público deve aceitar Modifier |
| `key` em `items()` | Obrigatório para evitar recomposições desnecessárias |
| `collectAsStateWithLifecycle()` | Preferível a `collectAsState()` — respeita lifecycle |
| Previews | Use `@Preview` com dados fake para cada Composable |
| Separação | Composables não chamam ViewModel diretamente — recebem lambdas |
