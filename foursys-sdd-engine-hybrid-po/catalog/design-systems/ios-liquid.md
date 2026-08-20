---
name: ios-liquid
description: |
  Liquid Design System para iOS no projeto BNJ (BancoNext Journey / Bradesco).
  Use ao criar Views, layouts, cabeçalhos e componentes visuais em UIKit ou SwiftUI.
  Aplica LiquidView, LiquidLayout, LiquidHeader, tokens de cor/tipografia e componentes
  de estado (LoadingView, ErrorView) seguindo o padrão mandatório do projeto.
metadata:
  version: "0.0.1"
---

# Liquid Design System — iOS BNJ

Design System obrigatório no projeto BNJ (Bradesco / BancoNext Journey). **Proibido** usar `import UIKit` diretamente quando o Liquid fornece o componente equivalente.

## Importação

```swift
import Liquid
// NÃO: import UIKit   ← proibido quando Liquid cobre o componente
// NÃO: import SwiftUI ← separado; usar apenas em arquivos SwiftUI puros
```

---

## LiquidView — Base para Views UIKit

Toda View UIKit personalizada herda de `LiquidView` (não de `UIView`):

```swift
import Liquid

final class ContaItemView: LiquidView {

    private let titleLabel = LiquidLabel(style: .bodyBold)
    private let valueLabel = LiquidLabel(style: .body)

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupView()
    }

    private func setupView() {
        addSubview(titleLabel)
        addSubview(valueLabel)
        // constraints via NSLayoutConstraint ou LiquidLayout helpers
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        valueLabel.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: topAnchor, constant: LiquidSpacing.sm),
            titleLabel.leadingAnchor.constraint(equalTo: leadingAnchor, constant: LiquidSpacing.md),
            valueLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: LiquidSpacing.xs),
            valueLabel.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor),
            valueLabel.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -LiquidSpacing.sm)
        ])
    }
}
```

---

## LiquidLabel — Tipografia

```swift
// Estilos disponíveis:
let titulo = LiquidLabel(style: .heading1)    // H1
let subtitulo = LiquidLabel(style: .heading2) // H2
let corpo = LiquidLabel(style: .body)         // Corpo
let destaque = LiquidLabel(style: .bodyBold)  // Corpo negrito
let auxiliar = LiquidLabel(style: .caption)   // Legenda/auxiliar

titulo.text = Strings.Feature.title   // sem string literal
titulo.textColor = LiquidColors.textPrimary
```

---

## LiquidHeader — Cabeçalho de Tela

```swift
import Liquid

final class FeatureViewController: BaseViewController<FeatureViewModel, FeatureRouterInterface, FeatureView> {

    private let header = LiquidHeader()

    override func viewDidLoad() {
        super.viewDidLoad()
        setupHeader()
    }

    private func setupHeader() {
        header.title = Strings.Feature.headerTitle
        header.onBackTapped = { [weak self] in
            self?.router?.onFeatureFinished()
        }
        view.addSubview(header)
        header.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            header.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            header.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            header.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        ])
    }
}
```

---

## LiquidButton — Botões

```swift
// Botão primário (CTA principal)
let primaryBtn = LiquidButton(style: .primary)
primaryBtn.setTitle(Strings.Feature.confirmButton, for: .normal)
primaryBtn.addTarget(self, action: #selector(onConfirmTapped), for: .touchUpInside)

// Botão secundário
let secondaryBtn = LiquidButton(style: .secondary)

// Botão destrutivo
let destructiveBtn = LiquidButton(style: .destructive)

// Estado desabilitado
primaryBtn.isEnabled = false  // estilo visual automático
```

---

## Tokens de Cor — LiquidColors

```swift
// Textos
LiquidColors.textPrimary      // cor principal de texto
LiquidColors.textSecondary    // cor secundária / legendas
LiquidColors.textDisabled     // texto desabilitado

// Superfícies
LiquidColors.backgroundPrimary    // fundo principal da tela
LiquidColors.backgroundSecondary  // fundo de cards/células
LiquidColors.surface              // superfície elevada

// Marca
LiquidColors.brandPrimary     // vermelho Bradesco
LiquidColors.brandSecondary

// Feedback
LiquidColors.success
LiquidColors.warning
LiquidColors.error
LiquidColors.info
```

---

## Tokens de Espaçamento — LiquidSpacing

```swift
LiquidSpacing.xs   // 4pt
LiquidSpacing.sm   // 8pt
LiquidSpacing.md   // 16pt
LiquidSpacing.lg   // 24pt
LiquidSpacing.xl   // 32pt
LiquidSpacing.xxl  // 48pt
```

---

## Estados de Tela — Loading, Error, Empty

Usar os componentes prontos do Liquid — não criar do zero:

```swift
// Loading
func showLoading() {
    let loading = LiquidLoadingView()
    loading.message = Strings.Feature.loading
    view.addSubview(loading)
    loading.pinToEdges(of: view)  // helper Liquid
}

// Error
func showError(onRetry: @escaping () -> Void) {
    let error = LiquidErrorView()
    error.onRetryTapped = onRetry
    view.addSubview(error)
    error.pinToEdges(of: view)
}

// Empty state
func showEmpty() {
    let empty = LiquidEmptyView()
    empty.title = Strings.Feature.emptyTitle
    empty.subtitle = Strings.Feature.emptySubtitle
    view.addSubview(empty)
    empty.pinToEdges(of: view)
}
```

---

## Usando Liquid dentro de SwiftUI (UIViewRepresentable)

Para componentes UIKit Liquid dentro de uma tela SwiftUI BNJ:

```swift
import SwiftUI
import Liquid

struct LiquidButtonRepresentable: UIViewRepresentable {
    let title: String
    var onTap: () -> Void

    func makeUIView(context: Context) -> LiquidButton {
        let button = LiquidButton(style: .primary)
        button.setTitle(title, for: .normal)
        button.addTarget(context.coordinator, action: #selector(Coordinator.tapped), for: .touchUpInside)
        return button
    }

    func updateUIView(_ uiView: LiquidButton, context: Context) {
        uiView.setTitle(title, for: .normal)
    }

    func makeCoordinator() -> Coordinator { Coordinator(onTap: onTap) }

    final class Coordinator: NSObject {
        let onTap: () -> Void
        init(onTap: @escaping () -> Void) { self.onTap = onTap }
        @objc func tapped() { onTap() }
    }
}

// Uso dentro de uma BaseScreen BNJ:
struct FeatureSuccessView: View {
    var onConfirm: () -> Void

    var body: some View {
        VStack(spacing: 24) {
            // conteúdo SwiftUI
            Text(Strings.Feature.successMessage)
            // botão Liquid via representable
            LiquidButtonRepresentable(title: Strings.Feature.confirmButton, onTap: onConfirm)
                .frame(height: 48)
                .padding(.horizontal, 16)
        }
    }
}
```

---

## Regras obrigatórias

| Regra | Detalhe |
|-------|---------|
| `import Liquid` | Sempre — nunca `import UIKit` quando Liquid cobre |
| Herdar `LiquidView` | Views UIKit personalizadas — não `UIView` |
| `LiquidLabel(style:)` | Tipografia — não `UILabel` com font manual |
| `LiquidButton(style:)` | Botões — não `UIButton` com cor manual |
| `LiquidColors.*` | Cores — nunca `UIColor(hex:)` ou `.red` |
| `LiquidSpacing.*` | Espaçamentos — nunca valores mágicos como `16.0` |
| `LiquidHeader` | Cabeçalho — não `UINavigationBar` personalizado |
| `LiquidLoadingView` | Estado de carregamento — não `UIActivityIndicatorView` |
