---
name: angular-vertical-slice
description: Implementa Angular Vertical Slice Architecture (padrão DUPE) com estrutura por domínio/feature, camadas data-access/domain obrigatórias e import boundary validável. Use para projetos Angular v20+ com 3 ou mais domínios onde a estrutura por tipo de arquivo (components/, services/) gera acoplamento e dificuldade de manutenção.
metadata:
  version: "0.1.0"
---

# Angular — Vertical Slice Architecture (DUPE)

Organize o projeto Angular por domínio isolado, não por tipo de arquivo. Cada domínio só se comunica com outro via `src/app/shared/`. Algumas organizações validam essa estrutura estaticamente com uma lib de lint dedicada (ex.: um pacote interno tipo `lib-ng-vertical-slice`) — se o projeto já tiver uma, siga as regras dela; as regras abaixo são a linha de base quando não há.

## Quando Aplicar

- Projeto com **3 ou mais domínios** distintos (ex: clientes, pedidos, produtos)
- Features com lógica de negócio própria que não deve vazar para outros módulos
- Times que trabalham em paralelo em domínios diferentes

Para projetos menores (1-2 domínios): estrutura flat tradicional é suficiente.

## Estrutura de Pastas

```text
src/
├── app/
│   ├── <dominio>/                      # kebab-case: ^[a-z0-9-]+$
│   │   ├── feat-<nome>/                # Smart components, rotas, orquestração
│   │   │   ├── pages/                  # Opcional (routed features têm pages/)
│   │   │   ├── models/                 # Opcional
│   │   │   └── data-access/            # Opcional — se existir, precisa de api/services/state
│   │   ├── ui/                         # Componentes presentacionais (dumb)
│   │   ├── data-access/
│   │   │   ├── api/                    # Integração HTTP — trabalha só com DTOs
│   │   │   ├── services/               # Orquestração e mapeamento DTO ↔ Model
│   │   │   ├── state/                  # State management
│   │   │   └── guards/                 # Opcional — guards domain-específicos
│   │   ├── domain/
│   │   │   └── models/
│   │   │       └── dtos/
│   │   ├── utils/                      # Funções utilitárias puras
│   │   ├── pages/                      # Pages do domínio
│   │   └── sub-<nome>/                 # Sub-domínio — mesma estrutura, não aninhável
│   │
│   └── shared/                         # Código compartilhado entre domínios
│       ├── data-access/
│       │   ├── guards/                 # Guards cross-domain (auth, roles, feature flags)
│       │   └── interceptors/           # Interceptors HTTP globais
│       ├── ui/
│       └── utils/
│
└── app.routes.ts                       # Lazy loading por domínio
```

## Nomenclatura de Domínios

Domínios em **kebab-case**: `^[a-z0-9-]+$`.

```text
✅  src/app/product-catalog
✅  src/app/auth
❌  src/app/ProductCatalog
❌  src/app/My_Feature
```

**Nomes proibidos como domínio direto** — evitam que `Core`/`Shared`/`Features`/`Modules` genéricos contornem a Vertical Slice: `features`, `modules`, `core`.

## Regra de Import (Fronteira de Domínio)

```typescript
// PROIBIDO: domínio A importa direto de domínio B
import { ClienteApiService } from '../clientes/data-access/services/cliente.service'; // ❌
// Solução: mover ClienteApiService para src/app/shared/, ou expor via port de domínio

// PROIBIDO: ui/ importa de data-access/ ou feat-*
// ui/ recebe dados via @Input()/input(), nunca busca dados sozinho
```

### Matriz de Dependências

| Camada | Pode importar de |
|---|---|
| `feat-*` | feat, ui, data-access, utils, models |
| `pages` | pages, feat, ui, data-access, utils, models |
| `data-access` | data-access, utils, models |
| `domain` | domain |
| `ui` | ui, utils, models |
| `utils` | utils, models |
| `shared` | shared |

### Visibilidade externa do `data-access/`

| Subpasta | Acessível por | Papel |
|---|---|---|
| `api/` | **Ninguém fora de `data-access/`** | Integração HTTP crua, trabalha só com DTOs |
| `services/` | `feat-*`, `pages/` | Orquestra `api/` + `state/`, mapeia DTO ↔ Model |
| `state/` | `feat-*`, `pages/` | State management, trabalha com domain models |
| `guards/` | `pages/` (via `canActivate`) | Nunca importado por `ui/` nem `feat-*` |
| `interceptors/` | **Ninguém** — registrado via `provideHttpClient(withInterceptors([...]))` | |

## Convenção de Constants (Co-location)

Não crie uma pasta `constants/` solta em domínio ou feature — co-localize pelo escopo real do dado:

1. **1 arquivo isolado** → inline no mesmo arquivo
2. **Vários arquivos dentro de 1 feature** → `feat-<nome>/feat.constants.ts`
3. **Vários arquivos dentro de 1 domínio** → `<dominio>/utils/domain.constants.ts`
4. **Cross-domain** → `shared/utils/app.constants.ts`

## index.ts (API Pública da Feature)

```typescript
// src/app/domains/clientes/features/lista-clientes/index.ts
export { ListaClientesComponent } from './lista-clientes.component';
export type { Cliente } from './lista-clientes.service';
// Não exportar implementações internas (services privados, helpers)
```

## Lazy Loading por Domínio

```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  {
    path: 'clientes',
    loadChildren: () =>
      import('./clientes/feat-lista/lista.routes')
        .then(m => m.LISTA_CLIENTES_ROUTES)
  }
];
```

## Componente com httpResource (v20+)

```typescript
// src/app/clientes/feat-lista/lista-clientes.component.ts
@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (clientes.isLoading()) {
      <p>Carregando...</p>
    } @else if (clientes.error()) {
      <p>Erro ao carregar clientes</p>
    } @else {
      @for (cliente of clientes.value(); track cliente.id) {
        <div>{{ cliente.nome }}</div>
      }
    }
  `
})
export class ListaClientesComponent {
  protected readonly clientes = httpResource<Cliente[]>('/api/v1/clientes');
}
```

## Anti-patterns

```typescript
// PROIBIDO: feature importa de outro domínio
import { ClienteApiService } from '../../clientes/data-access/services/cliente.service'; // ❌

// PROIBIDO: lógica de domínio em shared/
// shared/calcular-desconto.ts com regra de negócio de pedidos ❌

// PROIBIDO: ui/ acessando data-access/ diretamente
// ui/lista-clientes-card.component.ts injetando ClienteApiService ❌

// PROIBIDO: pasta constants/ solta em domínio ou feature
// src/app/clientes/constants/ ❌ — ver seção de co-location acima
```

## Checklist de Conformidade

- [ ] Domínios em kebab-case, nenhum chamado `features`/`modules`/`core`
- [ ] `data-access/` com `api/`, `services/`, `state/` quando presente
- [ ] `domain/models/dtos/` presente quando o domínio tem modelo próprio
- [ ] `ui/` nunca importa de `data-access/` nem `feat-*`
- [ ] Nenhum import cruzado entre domínios (nem entre sub-domínios)
- [ ] Sem pasta `constants/` solta — constantes co-localizadas por escopo
