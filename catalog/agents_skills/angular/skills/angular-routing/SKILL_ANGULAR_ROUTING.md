---
name: 'angular-routing'
description: "Guia completo para roteamento Angular v20+ com lazy loading, guards baseados em função, resolvers com Signals, parâmetros reativos via input() e navegação programática. Use para configurar rotas com carregamento preguiçoso, proteção de acesso e resolução de dados antes da renderização do componente."
metadata:
  version: "0.1.0"
---

# Skill: angular-routing

Guia completo para **roteamento Angular v20+** com lazy loading, guards funcionais, resolvers e Signals.

---

## Quando usar

- Qualquer feature com múltiplas telas ou views.
- Proteção de rotas baseada em autenticação ou autorização.
- Pré-carregamento de dados antes de renderizar o componente (`resolver`).
- Parâmetros dinâmicos na URL (IDs, slugs, queries).

---

## Configuração de Rotas (app.routes.ts)

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    title: 'Home'
  },
  {
    path: 'produtos',
    loadComponent: () => import('./produtos/produtos.component').then(m => m.ProdutosComponent),
    canActivate: [authGuard],
    title: 'Produtos'
  },
  {
    path: 'produtos/:id',
    loadComponent: () => import('./produtos/produto-detalhe/produto-detalhe.component').then(m => m.ProdutoDetalheComponent),
    resolve: { produto: produtoResolver },
    title: route => `Produto ${route.params['id']}`
  },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Página não encontrada'
  }
];
```

---

## Guards Funcionais (não classes)

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

// Guard de permissão com role
export function permissionGuard(permissao: string): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    return authService.temPermissao(permissao)
      ? true
      : inject(Router).createUrlTree(['/acesso-negado']);
  };
}
```

Uso na rota:
```typescript
{
  path: 'admin',
  loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
  canActivate: [authGuard, permissionGuard('ADMIN')]
}
```

---

## Resolvers com Signals

```typescript
// produto.resolver.ts
export const produtoResolver: ResolveFn<Produto> = (route) => {
  const produtoService = inject(ProdutoService);
  const id = Number(route.paramMap.get('id'));
  return produtoService.buscarPorId(id);
};
```

No componente — receber resolve via input():
```typescript
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (produto(); as p) {
      <h1>{{ p.nome }}</h1>
    }
  `
})
export class ProdutoDetalheComponent {
  // Angular v17.1+ — parâmetros de rota como input Signals via withComponentInputBinding()
  protected readonly produto = input<Produto>();
  protected readonly id = input<string>();  // parâmetro :id da URL
}
```

Habilitar `withComponentInputBinding()` no `app.config.ts`:
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
};
```

---

## Parâmetros de Rota como Signals

```typescript
// Com withComponentInputBinding() habilitado:
@Component({...})
export class ProdutoDetalheComponent {
  // Parâmetro :id vira Signal reativo — re-executa quando muda na URL
  protected readonly id = input.required<string>();

  // httpResource reage ao id Signal automaticamente
  protected readonly produto = httpResource<Produto>(
    () => `/api/produtos/${this.id()}`
  );
}
```

---

## Navegação Programática

```typescript
@Component({...})
export class ListaComponent {
  private readonly router = inject(Router);

  irParaDetalhe(id: number) {
    this.router.navigate(['/produtos', id]);
  }

  buscar(termo: string) {
    this.router.navigate(['/busca'], {
      queryParams: { q: termo },
      queryParamsHandling: 'merge'
    });
  }
}
```

---

## Lazy Loading de Módulo de Rotas (feature routes)

```typescript
// produtos.routes.ts — rotas internas do módulo produtos
export const produtosRoutes: Routes = [
  { path: '', component: ProdutosListaComponent },
  { path: ':id', component: ProdutoDetalheComponent, resolve: { produto: produtoResolver } },
  { path: 'novo', component: ProdutoFormComponent, canActivate: [authGuard] }
];

// app.routes.ts
{
  path: 'produtos',
  loadChildren: () => import('./produtos/produtos.routes').then(m => m.produtosRoutes)
}
```

---

## RouterLink no Template

```html
<!-- Navegação declarativa -->
<a routerLink="/produtos" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
  Produtos
</a>

<!-- Com parâmetro -->
<a [routerLink]="['/produtos', produto().id]">{{ produto().nome }}</a>

<!-- Com query params -->
<a [routerLink]="['/busca']" [queryParams]="{ q: termo() }">Buscar</a>
```

---

## Checklist de Uso

- [ ] `loadComponent` para lazy loading em todas as rotas de feature
- [ ] Guards como funções (`CanActivateFn`) — não classes com `@Injectable`
- [ ] `withComponentInputBinding()` habilitado em `app.config.ts`
- [ ] Parâmetros de rota como `input()` Signals no componente
- [ ] `ResolveFn` para pré-carregamento de dados
- [ ] `title` definido em cada rota (acessibilidade)
- [ ] `redirectTo` na rota raiz `''`
- [ ] Rota `**` para página 404
- [ ] `routerLinkActive` para feedback visual na navegação
