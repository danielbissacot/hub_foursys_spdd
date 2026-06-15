# Specify Tech iOS — Foursys SDD

Com base na User Story validada, aprofunde a especificação técnica para o contexto iOS/Swift.

## Passo 3 — Especificação Técnica iOS

### 3.1 Entidades de Domínio

Defina as entidades Swift que representam os dados da feature:

```swift
struct [NomeDaEntidade]: Identifiable, Hashable, Sendable {
    let id: UUID
    // campos...
}
```

Perguntas a responder:
- Quais campos compõem a entidade?
- A entidade precisa de relações com outras entidades?
- Ela será persistida localmente (SwiftData) ou apenas em memória?

### 3.2 Fluxo de Dados

Descreva o fluxo da feature:

```
[Trigger da UI]
    → ViewModel.acao()
    → UseCase.executar()
    → Repository.buscar/salvar()
    → APIService OU SwiftData
    → Atualiza @Observable ViewModel
    → SwiftUI re-renderiza automaticamente
```

### 3.3 Contrato de API (se aplicável)

| Endpoint | Método | Request Body | Response |
|---|---|---|---|
| `/recurso` | GET | — | `[EntidadeDTO]` |
| `/recurso` | POST | `EntidadeDTO` | `EntidadeDTO` |

### 3.4 Modelo SwiftData (se aplicável)

```swift
@Model
final class [Nome]Model {
    var id: UUID
    // campos...
}
```

### 3.5 Permissões Necessárias (Info.plist)

Liste as permissões que precisam ser adicionadas:

| Chave | Justificativa para o usuário |
|---|---|
| `NSCameraUsageDescription` | "Para fotografar o produto" |
| `NSLocationWhenInUseUsageDescription` | "Para encontrar lojas próximas" |

### 3.6 Critérios de Aceite Técnicos

- [ ] View renderiza corretamente nos simuladores iPhone 15 e iPad
- [ ] Dark Mode suportado via `MaterialTheme` / cores do sistema
- [ ] Acessibilidade: VoiceOver navega corretamente pela tela
- [ ] Sem memory leaks (verificado com Instruments)
- [ ] Build sem warnings de Swift 6 Concurrency
