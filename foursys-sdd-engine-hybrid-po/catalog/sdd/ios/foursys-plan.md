# Plan iOS BNJ — Foursys SDD

Com base na User Story e especificação técnica, gere o **Plano de Implementação Técnico** para esta feature iOS BNJ.

## Estrutura Obrigatória do Plano

### 1. Tabela de Impactos Sistêmicos

Liste TODOS os arquivos globais que serão criados ou modificados:

| Arquivo | Impacto | Ação |
|---|---|---|
| `Info.plist` | Nova permissão (se aplicável) | Modificar |
| `Domain/InMemoryRepositoryInterface.swift` | Nova propriedade cross-screen | Modificar |
| `Data/InMemoryRepository.swift` | Nova propriedade implementada | Modificar |
| `Router/MainRouterManager.swift` | Nova extension para {Feature}RouterInterface | Modificar |
| `Public/BNJ{Nome}JourneyRoute.swift` | Novo case (se novo entry point) | Modificar |
| `Public/BNJ{Nome}Launcher.swift` | Novo RouterManager no routerFactories | Modificar |

### 2. Arquivos a Criar

Liste os novos arquivos por camada:

**Data:**
- `Data/{Feature}DTO.swift` (somente com rede)
- `Data/{Feature}Repository.swift`

**Domain:**
- `Domain/{Feature}Model.swift`
- `Domain/{Feature}RepositoryInterface.swift`
- `Domain/{Feature}UseCaseInterface.swift`
- `Domain/{Feature}UseCase.swift`

**Presentation:**
- `Presentation/Analytics/{Feature}AnalyticsInterface.swift`
- `Presentation/Analytics/{Feature}Analytics.swift`
- `Presentation/View/{Feature}ViewData.swift`
- `Presentation/View/{Feature}RouterInterface.swift`
- `Presentation/View/{Feature}Screen.swift` ou `{Feature}View.swift`
- `Presentation/View/Custom/{Feature}LoadingView.swift`
- `Presentation/View/Custom/{Feature}SuccessView.swift`
- `Presentation/View/Custom/{Feature}EmptyView.swift` (se aplicável)
- `Presentation/ViewModel/{Feature}ViewModel.swift`
- `Presentation/View/{Feature}ViewController.swift`

**Tests:**
- `Tests/{Feature}ViewModelTests.swift`
- `Tests/{Feature}UseCaseTests.swift`

### 3. Dependências e Permissões

- [ ] Nova permissão no `Info.plist`? (câmera, localização, etc.)
- [ ] Nova propriedade no `InMemoryRepositoryInterface`? (dados cross-screen)
- [ ] Novo case no `JourneyRoute`? (se novo entry point do módulo)
- [ ] Novo `RouterManager` herdado? (se subfluxo separado)
- [ ] Nova dependência Swift Package? (nome e URL)

### 4. Skills a Consultar

- `SKILL_IOS_FEATURE_SCAFFOLD_BNJ` — processo completo com checklist de 15 arquivos
- `SKILL_IOS_VIEWMODEL_BNJ` — BaseViewModel, ViewState, Task management, execute()
- `SKILL_IOS_ROUTER_BNJ` — RouterInterface, RouterManager, JourneyRoute, Launcher
- `SKILL_IOS_USECASE_BNJ` — BaseUseCase, InMemoryRepository, interfaces
- `SKILL_IOS_VIEWDATA_DTO` — DTO (Decodable+Sendable) e ViewData (Equatable)
- `SKILL_IOS_ANALYTICS_BNJ` — BNSAnalytics, prefixo track, Strings enum
- `SKILL_IOS_SWIFTUI_COMPONENTS` — seção BNJ Screen Pattern
- `SKILL_IOS_TESTING` — testes XCTest para ViewModel e UseCase

### 5. Critérios de Aceitação Técnica

- [ ] RouterManager instancia toda a cadeia: Repository + UseCase + Analytics + ViewModel + ViewController
- [ ] ViewModel usa `BaseViewModel<AnalyticsInterface, UseCaseInterface>` + `@MainActor` + `ObservableObject`
- [ ] ViewState cobre todos os estados necessários da tela (idle, loading, success, failure, empty)
- [ ] Tasks gerenciadas: `private var task: Task?` + `deinit { task?.cancel() }`
- [ ] `CancellationError` tratado separadamente
- [ ] Analytics implementado: screenView + ações principais
- [ ] RouterInterface com `@MainActor + AnyObject` e métodos `on*`
- [ ] InMemoryRepository atualizado (se dados passados entre telas)
- [ ] Sem strings literais — `Strings.{Feature}.*`
- [ ] Cobertura de testes ≥80% no ViewModel e UseCase
- [ ] Tela funciona em portrait e landscape
- [ ] Acessibilidade implementada nos componentes principais
