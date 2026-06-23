# Otimização de Build

## Configuração de Budgets

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kB",
      "maximumError": "1MB"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "4kB",
      "maximumError": "8kB"
    },
    {
      "type": "anyScript",
      "maximumWarning": "100kB",
      "maximumError": "200kB"
    }
  ]
}
```

## Carregamento Diferencial

Automático no v20+ — compilações para navegadores modernos por padrão.

```json
// .browserslistrc
last 2 Chrome versions
last 2 Firefox versions
last 2 Safari versions
last 2 Edge versions
```

## Divisão de Código

```typescript
// Lazy load routes for automatic code splitting
export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent),
  },
];
```

## Tree Shaking

Assegure imports adequados para permitir tree shaking:

```typescript
// Good - tree shakeable
import { map, filter } from 'rxjs';

// Avoid - imports entire library
import * as rxjs from 'rxjs';
```

## Estratégia de Preload

```typescript
// app.config.ts
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
};
```