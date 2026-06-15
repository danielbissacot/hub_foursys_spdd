---
name: android-liquid
description: |
  Liquid Design System para Android Jetpack Compose no projeto BNJ (BancoNext Journey / Bradesco).
  Use ao criar Screens, layouts, cabeçalhos e componentes visuais em Compose.
  Aplica LiquidLayout, LiquidHeader, LiquidLabel, tokens de cor/espaçamento e componentes
  de estado (LoadingScreen, ErrorScreen) seguindo o padrão mandatório do projeto.
metadata:
  version: "0.0.1"
---

# Liquid Design System — Android BNJ

Design System obrigatório no projeto BNJ (Bradesco / BancoNext Journey) para Android. Todos os componentes visuais devem usar os equivalentes do Liquid — nunca criar componentes de cor, espaçamento ou tipografia do zero.

## Importação

```kotlin
import br.com.bradesco.liquid.compose.*
// ou conforme o pacote do módulo Liquid do projeto
```

---

## LiquidLayout — Container Principal de Tela

Toda Screen BNJ usa `LiquidLayout` como container externo:

```kotlin
@Composable
fun FeatureSuccessView(
    data: FeatureViewData,
    onConfirm: () -> Unit
) {
    LiquidLayout {
        LiquidHeader(
            title = stringResource(R.string.feature_title),
            onBackClick = { /* gerenciado pelo BaseScreen via routeEvent */ }
        )
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = LiquidSpacing.md)
        ) {
            // conteúdo da tela
            LiquidLabel(
                text = data.description,
                style = LiquidTextStyle.body
            )
            Spacer(modifier = Modifier.height(LiquidSpacing.lg))
            LiquidButton(
                text = stringResource(R.string.feature_confirm),
                onClick = onConfirm
            )
        }
    }
}
```

---

## LiquidHeader — Cabeçalho de Tela

```kotlin
LiquidHeader(
    title = stringResource(R.string.feature_title),
    onBackClick = { viewModel.onBackPressed() }
)

// Com ícone à direita:
LiquidHeader(
    title = stringResource(R.string.feature_title),
    onBackClick = { viewModel.onBackPressed() },
    actions = {
        IconButton(onClick = { viewModel.onHelpTapped() }) {
            Icon(
                imageVector = Icons.Default.Help,
                contentDescription = null,
                tint = LiquidColors.brandPrimary
            )
        }
    }
)
```

---

## LiquidLabel / LiquidText — Tipografia

```kotlin
// Estilos disponíveis:
LiquidLabel(text = "Título", style = LiquidTextStyle.heading1)
LiquidLabel(text = "Subtítulo", style = LiquidTextStyle.heading2)
LiquidLabel(text = "Corpo", style = LiquidTextStyle.body)
LiquidLabel(text = "Destaque", style = LiquidTextStyle.bodyBold)
LiquidLabel(text = "Legenda", style = LiquidTextStyle.caption)

// Com cor customizada (usar apenas tokens):
LiquidLabel(
    text = data.value,
    style = LiquidTextStyle.bodyBold,
    color = LiquidColors.textPrimary
)
```

---

## LiquidButton — Botões

```kotlin
// Botão primário (CTA principal) — ocupa largura total por padrão
LiquidButton(
    text = stringResource(R.string.feature_confirm),
    onClick = onConfirm,
    modifier = Modifier.fillMaxWidth()
)

// Botão secundário
LiquidButton(
    text = stringResource(R.string.feature_cancel),
    onClick = onCancel,
    style = LiquidButtonStyle.secondary
)

// Botão desabilitado
LiquidButton(
    text = stringResource(R.string.feature_submit),
    onClick = {},
    enabled = state.isFormValid
)

// Botão com loading inline
LiquidButton(
    text = stringResource(R.string.feature_send),
    onClick = onSend,
    isLoading = state.isLoading
)
```

---

## Tokens de Cor — LiquidColors

```kotlin
// Textos
LiquidColors.textPrimary       // cor principal de texto
LiquidColors.textSecondary     // cor secundária / legendas
LiquidColors.textDisabled      // texto desabilitado

// Superfícies
LiquidColors.backgroundPrimary     // fundo principal da tela
LiquidColors.backgroundSecondary   // fundo de cards/células
LiquidColors.surface               // superfície elevada

// Marca
LiquidColors.brandPrimary      // vermelho Bradesco
LiquidColors.brandSecondary

// Feedback
LiquidColors.success
LiquidColors.warning
LiquidColors.error
LiquidColors.info
```

---

## Tokens de Espaçamento — LiquidSpacing

```kotlin
LiquidSpacing.xs   // 4.dp
LiquidSpacing.sm   // 8.dp
LiquidSpacing.md   // 16.dp
LiquidSpacing.lg   // 24.dp
LiquidSpacing.xl   // 32.dp
LiquidSpacing.xxl  // 48.dp

// Uso:
Modifier.padding(horizontal = LiquidSpacing.md, vertical = LiquidSpacing.sm)
Spacer(modifier = Modifier.height(LiquidSpacing.lg))
```

---

## Estados de Tela — Loading, Error, Empty

Usar os composables prontos do Liquid — integrados ao padrão MVI BaseScreen:

```kotlin
@Composable
fun FeatureScreen(viewModel: FeatureViewModel) {
    val state by viewModel.uiState.collectAsState()

    when (state) {
        is FeatureUIState.Loading -> LiquidLoadingScreen()
        is FeatureUIState.Success -> FeatureSuccessView(
            data = (state as FeatureUIState.Success).data,
            onConfirm = { viewModel.onConfirmTapped() }
        )
        is FeatureUIState.Error -> LiquidErrorScreen(
            message = (state as FeatureUIState.Error).message,
            onRetry = { viewModel.onRetryTapped() }
        )
        is FeatureUIState.Empty -> LiquidEmptyScreen(
            title = stringResource(R.string.feature_empty_title),
            subtitle = stringResource(R.string.feature_empty_subtitle)
        )
        else -> Unit
    }
}
```

---

## BackHandler integrado ao MVI

O `BackHandler` deve chamar o ViewModel via evento, não navegar diretamente:

```kotlin
@Composable
fun FeatureSuccessView(
    data: FeatureViewData,
    onBack: () -> Unit,
    onConfirm: () -> Unit
) {
    BackHandler(onBack = onBack)  // ViewModel.onEvent(BackPressed)

    LiquidLayout {
        LiquidHeader(
            title = stringResource(R.string.feature_title),
            onBackClick = onBack
        )
        // ... conteúdo
    }
}
```

No BaseScreen ou ViewController do fluxo:

```kotlin
FeatureSuccessView(
    data = data,
    onBack = { viewModel.onEvent(FeatureViewEvent.BackPressed) },
    onConfirm = { viewModel.onEvent(FeatureViewEvent.ConfirmTapped) }
)
```

---

## LiquidCard — Cards e Células de Lista

```kotlin
LiquidCard(
    modifier = Modifier.fillMaxWidth(),
    onClick = { onItemSelected(item) }
) {
    Row(
        modifier = Modifier.padding(LiquidSpacing.md),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        LiquidLabel(text = item.title, style = LiquidTextStyle.bodyBold)
        LiquidLabel(text = item.value, style = LiquidTextStyle.body)
    }
}
```

---

## Regras obrigatórias

| Regra | Detalhe |
|-------|---------|
| `LiquidLayout` | Container externo de toda Screen BNJ |
| `LiquidHeader` | Cabeçalho — não criar toolbar manual |
| `LiquidLabel` | Tipografia — não `Text()` com `fontSize` manual |
| `LiquidButton` | Botões — não `Button { }` com cor manual |
| `LiquidColors.*` | Cores — nunca `Color(0xFF...)` ou `Color.Red` |
| `LiquidSpacing.*` | Espaçamentos — nunca valores mágicos como `16.dp` |
| `LiquidLoadingScreen()` | Estado de carregamento — não `CircularProgressIndicator()` solto |
| `LiquidErrorScreen()` | Estado de erro — não criar componente de erro manual |
| `BackHandler` via ViewModel | Nunca navegar diretamente no composable |
