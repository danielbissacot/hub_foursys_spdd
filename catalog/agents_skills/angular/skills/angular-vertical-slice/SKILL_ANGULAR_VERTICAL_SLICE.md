---
name: angular-vertical-slice
description: Implementa Angular Vertical Slice Architecture (padrão DUPE) com estrutura por domínio/feature. Use para projetos Angular v20+ com 3 ou mais domínios onde a estrutura por tipo de arquivo (components/, services/) gera acoplamento e dificuldade de manutenção.
metadata:
  version: "0.0.1"
---

# Angular — Vertical Slice Architecture (DUPE)

Organize o projeto Angular por domínio e feature, não por tipo de arquivo. Cada feature é isolada com seu próprio `index.ts` como API pública.

## Quando Aplicar

- Projeto com **3 ou mais domínios** distintos (ex: clientes, pedidos, produtos)
- Features com lógica de negócio própria que não deve vazar para outros módulos
- Times que trabalham em paralelo em domínios diferentes

Para projetos menores (1-2 domínios): estrutura flat tradicional é suficiente.

## Estrutura DUPE

```
src/
├── app/
│   ├── app.config.ts           ← providers globais
│   ├── app.routes.ts           ← lazy loading por domínio
│   └── domains/
│       ├── clientes/
│       │   ├── features/
│       │   │   ├── lista-clientes/
│       │   │   │   ├── lista-clientes.component.ts
│       │   │   │   ├── lista-clientes.component.html
│       │   │   │   ├── lista-clientes.service.ts
│       │   │   │   ├── lista-clientes.routes.ts
│       │   │   │   └── index.ts              ← PUBLIC API
│       │   │   └── detalhe-cliente/
│       │   │       ├── detalhe-cliente.component.ts
│       │   │       ├── detalhe-cliente.service.ts
│       │   │       └── index.ts
│       │   └── shared/                       ← compartilhado só no domínio
│       │       ├── cliente.model.ts
│       │       └── cliente-api.service.ts
│       └── pedidos/
│           └── features/
│               └── criar-pedido/
│                   └── index.ts
└── shared/                     ← compartilhado entre domínios
    ├── ui/                     ← componentes UI genéricos
    └── utils/                  ← utilitários sem lógica de negócio
```

## Regra de Import (Fronteira de Módulo)

```typescript
// CORRETO: importar pela API pública (index.ts)
import { ListaClientesComponent } from '../lista-clientes';

// PROIBIDO: importar direto de arquivo interno
import { ListaClientesComponent } from '../lista-clientes/lista-clientes.component'; // ❌

// CORRETO: domínio A não importa de domínio B diretamente
// Se precisar compartilhar: mover para src/shared/
```

## index.ts (Public API da Feature)

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
      import('./domains/clientes/features/lista-clientes/lista-clientes.routes')
        .then(m => m.LISTA_CLIENTES_ROUTES)
  },
  {
    path: 'pedidos',
    loadChildren: () =>
      import('./domains/pedidos/features/criar-pedido/criar-pedido.routes')
        .then(m => m.CRIAR_PEDIDO_ROUTES)
  }
];
```

## Routes Locais da Feature

```typescript
// src/app/domains/clientes/features/lista-clientes/lista-clientes.routes.ts
export const LISTA_CLIENTES_ROUTES: Routes = [
  {
    path: '',
    component: ListaClientesComponent
  },
  {
    path: ':id',
    loadComponent: () =>
      import('../detalhe-cliente').then(m => m.DetalheClienteComponent)
  }
];
```

## Componente com httpResource (v20+)

```typescript
// src/app/domains/clientes/features/lista-clientes/lista-clientes.component.ts
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
// Em src/app/domains/pedidos/features/criar-pedido/criar-pedido.component.ts:
import { ClienteApiService } from '../../clientes/features/lista-clientes/lista-clientes.service'; // ❌
// Solução: mover ClienteApiService para src/shared/ ou criar port de domínio

// PROIBIDO: lógica de domínio em src/shared/
// src/shared/calcular-desconto.ts com regra de negócio de pedidos ❌
// Solução: mover para src/app/domains/pedidos/

// PROIBIDO: feature com múltiplas responsabilidades em um único arquivo
// lista-clientes.component.ts com CRUD completo + lógica de filtro + formatação ❌
// Solução: separar em lista, detalhe, criar (features distintas)
```
