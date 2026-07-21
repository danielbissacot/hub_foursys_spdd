---
name: ios-viewdata-dto
description: |
  Skill para criar DTOs e ViewData no projeto BNJ (Bradesco iOS).
  DTO: struct Decodable + Sendable, propriedades let, sem init manual, sufixo DTO, na camada Data.
  ViewData: struct Equatable, propriedades let, sem lógica de negócio, mapeado no ViewModel.
  Use ao criar a camada de dados (DTO) e ao expor dados para a View (ViewData).
metadata:
  version: "0.1.0"
---

# iOS ViewData + DTO BNJ

Dois padrões de dados complementares: DTO (camada Data) e ViewData (camada Presentation).

---

## Parte 1 — DTO (Data Transfer Object)

### Padrão obrigatório

```swift
// Data/{Feature}DTO.swift

struct {Feature}DTO: Decodable, Sendable {
    let id: String
    let description: String
    let value: String
}
```

### Com modelos relacionais (no mesmo arquivo)

```swift
// Data/MyLimitsDTO.swift

struct MyLimitsDTO: Decodable, Sendable {
    let limits: [LimitDataDTO]
}

struct LimitDataDTO: Decodable, Sendable {
    let description: String
    let value: String
}
```

### Com CodingKeys (quando JSON tem chaves diferentes)

```swift
struct {Feature}DTO: Decodable, Sendable {
    let fullName: String
    let totalAmount: Int

    enum CodingKeys: String, CodingKey {
        case fullName = "full_name"
        case totalAmount = "total_amount"
    }
}
```

### Regras do DTO

| Regra | Detalhe |
|---|---|
| `Decodable` | Sempre — desserialização de JSON |
| `Sendable` | Sempre — segurança em concorrência moderna |
| Somente `let` | Imutabilidade obrigatória |
| Sem `init` manual | Compilador gera automaticamente |
| Sufixo `DTO` | `ContactDTO`, `KeysDTO`, `MyLimitsDTO` |
| Sem `Encodable` | DTO é de entrada (API → app), não de saída |
| Sem comportamento | Nenhuma função de negócio, apenas dados |
| Modelos relacionais no mesmo arquivo | `MyLimitsDTO` + `LimitDataDTO` no mesmo arquivo |

### Proibições no DTO

| Proibido | Alternativa |
|---|---|
| `Codable` (= Encodable + Decodable) | `Decodable` apenas |
| `var` properties | `let` obrigatório |
| `init` customizado | Apenas se absolutamente necessário (ex: transformação de tipo) |
| Lógica de negócio | Mover para UseCase ou ViewModel |
| Herança de classe | `struct` sempre |

---

## Parte 2 — ViewData

### Padrão obrigatório

```swift
// Presentation/View/{Feature}ViewData.swift

struct {Feature}ViewData: Equatable {
    let items: [{Feature}ItemViewData]
    let title: String
}

struct {Feature}ItemViewData: Equatable {
    let id: String
    let displayTitle: String
    let displayValue: String
}
```

### Mapeamento no ViewModel (Model → ViewData)

```swift
// {Feature}ViewModel.swift

private func map(_ model: {Feature}Model) -> {Feature}ViewData {
    {Feature}ViewData(
        title: "Título da Tela",
        items: model.items.map { item in
            {Feature}ItemViewData(
                id: item.id,
                displayTitle: item.name,
                displayValue: item.formattedValue
            )
        }
    )
}
```

### Regras do ViewData

| Regra | Detalhe |
|---|---|
| `Equatable` | Sempre — permite comparações na View |
| `struct` | Sempre — sem identidade, apenas valor |
| Somente `let` | Imutabilidade |
| Sem `init` manual | Compilador gera automaticamente |
| Sufixo `ViewData` | `ContactsViewData`, `KeysViewData` |
| Propriedades já formatadas | Strings prontas para exibição (`"R$ 1.200,00"`, não `1200`) |
| Sem dependências de negócio | ViewData não conhece Model nem Repository |
| Mapeamento no ViewModel | NUNCA na View nem no UseCase |
| Modelos relacionais no mesmo arquivo | `{Feature}ViewData` + `{Feature}ItemViewData` no mesmo arquivo |

### Proibições no ViewData

| Proibido | Alternativa |
|---|---|
| `var` properties | `let` obrigatório |
| Lógica de formatação | Formatar no ViewModel antes de criar ViewData |
| Conhecer `{Feature}Model` | ViewData é independente do Domain |
| `Codable`/`Decodable` | ViewData não é serializado |

---

## Diferença entre os três tipos de dados

| Tipo | Camada | Conformance | Criado por | Consumido por |
|---|---|---|---|---|
| `{Feature}DTO` | Data | `Decodable, Sendable` | BNSCommunication (JSON) | Repository (mapper) |
| `{Feature}Model` | Domain | `Sendable` | Repository (mapper) | UseCase, ViewModel |
| `{Feature}ViewData` | Presentation | `Equatable` | ViewModel (mapper) | View/Screen |
