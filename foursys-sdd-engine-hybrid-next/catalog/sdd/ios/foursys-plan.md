# Plan iOS — Foursys SDD

Com base na User Story e especificação técnica, gere o **Plano de Implementação Técnico** para esta feature iOS.

## Estrutura Obrigatória do Plano

### 1. Tabela de Impactos Sistêmicos

Liste TODOS os arquivos globais que serão criados ou modificados:

| Arquivo | Impacto | Ação |
|---|---|---|
| `MeuApp.swift` | Registro de nova dependência no `.environment()` | Modificar |
| `Info.plist` | Nova permissão (se aplicável) | Modificar |
| `AppModule.swift` | Novo UseCase/Repository injetado | Modificar |

### 2. Arquivos a Criar

Liste os novos arquivos por camada:

**Domain:**
- `Features/[Nome]/Domain/[Entidade].swift`
- `Features/[Nome]/Domain/[Nome]Repository.swift` (protocol)
- `Features/[Nome]/Domain/[Acao][Nome]UseCase.swift`

**Data:**
- `Features/[Nome]/Data/[Nome]RepositoryImpl.swift`
- `Features/[Nome]/Data/[Nome]APIService.swift`
- `Features/[Nome]/Data/[Nome]DTO.swift`

**Presentation:**
- `Features/[Nome]/Presentation/[Nome]View.swift`
- `Features/[Nome]/Presentation/[Nome]ViewModel.swift`

**Tests:**
- `Tests/[Nome]/[Acao][Nome]UseCaseTests.swift`
- `Tests/[Nome]/[Nome]ViewModelTests.swift`

### 3. Dependências e Permissões

- [ ] Nova entrada em `Info.plist`? (câmera, localização, notificações)
- [ ] Nova dependência Swift Package? (nome e URL)
- [ ] Novo registro em `@Environment` no `App.swift`?
- [ ] Migração SwiftData necessária? (nova versão do `ModelConfiguration`)

### 4. Skills a Consultar

Indique as Skills relevantes para esta feature:

- `SKILL_IOS_SWIFTUI_COMPONENTS` — para criação da View
- `SKILL_IOS_ARCHITECTURE` — para estrutura MVVM
- `SKILL_IOS_NETWORKING` — se houver chamada de API
- `SKILL_IOS_PERSISTENCE` — se houver dados locais
- `SKILL_IOS_TESTING` — para cobertura de testes

### 5. Critérios de Aceitação Técnica

- [ ] ViewModel com `@MainActor @Observable`
- [ ] Operações assíncronas com `async/await`
- [ ] Cobertura de testes ≥80% no ViewModel e UseCase
- [ ] Preview funcional com dados de exemplo
- [ ] Sem uso de `UIKit` direto (salvo justificativa)
- [ ] Acessibilidade implementada nos componentes principais
