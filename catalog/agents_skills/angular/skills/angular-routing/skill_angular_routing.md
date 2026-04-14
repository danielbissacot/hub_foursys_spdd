---
name: angular-routing
description: Implementa routing em aplicações Angular v20+ com lazy loading, functional guards, resolvers e route parameters. Use para configurar navegação, rotas protegidas, carregamento de dados por rota e roteamento aninhado. Use em configuração de rotas, adição de authentication guards, implementação de lazy loading ou leitura de route parameters com signals.
metadata:
  version: "0.0.1"
---

# Angular Routing

Configura o roteamento em Angular v20+ com lazy loading, functional guards e route parameters baseados em signals.

## Configuração básica

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: NotFoundComponent },
];

// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
  ],
};

// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a routerLink="/home" routerLinkActive="active">Home</a>
      <a routerLink="/about" routerLinkActive="active">About</a>
    </nav>
    <router-outlet />
  `,
})
export class AppComponent {}
```

## Lazy Loading

Carrega feature modules sob demanda:

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  
  // Lazy load entire feature
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
  },
  
  // Lazy load single component
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
  },
];

// admin/admin.routes.ts
export const adminRoutes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: AdminUsersComponent },
  { path: 'settings', component: AdminSettingsComponent },
];
```

## Route Parameters

### Com Signal Inputs (Recomendado)

```typescript
// Route config
{ path: 'users/:id', component: UserDetailComponent }

// Component - use input() for route params
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  template: `
    <h1>User {{ id() }}</h1>
  `,
})
export class UserDetailComponent {
  // Route param as signal input
  id = input.required<string>();
  
  // Computed based on route param
  userId = computed(() => parseInt(this.id(), 10));
}
```

Habilite com `withComponentInputBinding()`:

```typescript
// app.config.ts
import { provideRouter, withComponentInputBinding } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
  ],
};
```

### Query Parameters

```typescript
// Route: /search?q=angular&page=1

@Component({...})
export class SearchComponent {
  // Query params as inputs
  q = input<string>('');
  page = input<string>('1');
  
  currentPage = computed(() => parseInt(this.page(), 10));
}
```

### Usando ActivatedRoute (Alternativa)

```typescript
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({...})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  
  // Convert route params to signal
  id = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id'))),
    { initialValue: null }
  );
  
  // Query params
  query = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('q'))),
    { initialValue: '' }
  );
}
```

## Functional Guards

### Auth Guard

```typescript
// guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Redirect to login with return URL
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

// Usage in routes
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard],
}
```

### Role Guard

```typescript
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    const userRole = authService.currentUser()?.role;
    
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }
    
    return router.createUrlTree(['/unauthorized']);
  };
};

// Usage
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard, roleGuard(['admin', 'superadmin'])],
}
```

### Can Deactivate Guard

```typescript
export interface CanDeactivateComponent {
  canDeactivate: () => boolean | Promise<boolean>;
}

export const unsavedChangesGuard: CanDeactivateFn<CanDeactivateComponent> = (component) => {
  if (component.canDeactivate()) {
    return true;
  }
  
  return confirm('You have unsaved changes. Leave anyway?');
};

// Component implementation
@Component({...})
export class EditComponent implements CanDeactivateComponent {
  form = inject(FormBuilder).group({...});
  
  canDeactivate(): boolean {
    return !this.form.dirty;
  }
}

// Route
{
  path: 'edit/:id',
  component: EditComponent,
  canDeactivate: [unsavedChangesGuard],
}
```

## Resolvers

Pré-carrega dados antes da ativação da rota:

```typescript
// resolvers/user.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

export const userResolver: ResolveFn<User> = (route) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id')!;
  return userService.getById(id);
};

// Route config
{
  path: 'users/:id',
  component: UserDetailComponent,
  resolve: { user: userResolver },
}

// Component - access resolved data via input
@Component({...})
export class UserDetailComponent {
  user = input.required<User>();
}
```

## Rotas aninhadas

```typescript
// Parent route with children
export const routes: Routes = [
  {
    path: 'products',
    component: ProductsLayoutComponent,
    children: [
      { path: '', component: ProductListComponent },
      { path: ':id', component: ProductDetailComponent },
      { path: ':id/edit', component: ProductEditComponent },
    ],
  },
];

// ProductsLayoutComponent
@Component({
  imports: [RouterOutlet],
  template: `
    <h1>Products</h1>
    <router-outlet /> <!-- Child routes render here -->
  `,
})
export class ProductsLayoutComponent {}
```

## Navegação programática

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({...})
export class ProductComponent {
  private router = inject(Router);
  
  // Navigate to route
  goToProducts() {
    this.router.navigate(['/products']);
  }
  
  // Navigate with params
  goToProduct(id: string) {
    this.router.navigate(['/products', id]);
  }
  
  // Navigate with query params
  search(query: string) {
    this.router.navigate(['/search'], {
      queryParams: { q: query, page: 1 },
    });
  }
  
  // Navigate relative to current route
  goToEdit() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
  
  // Replace current history entry
  replaceUrl() {
    this.router.navigate(['/new-page'], { replaceUrl: true });
  }
}
```

## Route Data

```typescript
// Static route data
{
  path: 'admin',
  component: AdminComponent,
  data: {
    title: 'Admin Dashboard',
    roles: ['admin'],
  },
}

// Access in component
@Component({...})
export class AdminComponent {
  title = input<string>(); // From route data
  roles = input<string[]>(); // From route data
}

// Or via ActivatedRoute
private route = inject(ActivatedRoute);
data = toSignal(this.route.data);
```

## Router Events

```typescript
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({...})
export class AppComponent {
  private router = inject(Router);
  
  isNavigating = signal(false);
  
  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart || e instanceof NavigationEnd)
    ).subscribe(event => {
      this.isNavigating.set(event instanceof NavigationStart);
    });
  }
}
```

Para padrões avançados, veja:

- [Route Configuration Options](references/route-configuration-options.MD)
- [Authentication Flow](references/authentication-flow.MD)
- [Breadcrumbs](references/breadcrumbs.MD)
- [Tab Navigation](references/tab-navigation.MD)
- [Modal Routes](references/modal-routes.MD)
- [Preloading Strategies](references/preloading-strategies.MD)
- [Route Animations](references/route-animations.MD)
- [Scroll Position Restoration](references/scroll-position-restoration.MD)

