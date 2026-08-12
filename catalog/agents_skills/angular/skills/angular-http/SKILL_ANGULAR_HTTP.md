---
name: angular-http
description: Implemente busca de dados HTTP no Angular v20+ usando resource(), httpResource() e HttpClient. Cobre declaração reativa, request builder com parâmetros dinâmicos, refresh, abort, tratamento de erros tipados, o HttpClient tradicional (mutações POST/PUT/DELETE) e interceptors. Use httpResource() como primeira opção para GET em componentes; HttpClient em services para mutações e lógica RxJS complexa.
metadata:
  version: "0.2.0"
---

# Angular HTTP e Busca de Dados

Busque dados no Angular usando `httpResource()`/`resource()` baseados em signals, e o `HttpClient` tradicional para mutações e lógica RxJS complexa.

> `httpResource()` é a **primeira opção** para HTTP em componentes Angular. Use `HttpClient` diretamente em services para mutações (POST/PUT/DELETE) ou lógica com múltiplos operadores RxJS.

---

## Quando usar cada um

- **`httpResource()`**: buscar dados (GET) a partir de um componente, especialmente com parâmetros reativos (IDs, filtros, queries que mudam).
- **`resource()`**: mesma ideia, para fontes assíncronas não-HTTP.
- **`HttpClient`** (em service, via `inject()`): mutações do usuário (POST/PUT/DELETE), lógica com `switchMap`/`combineLatest`/retry customizado.

---

## httpResource() — busca simples

```typescript
import { httpResource } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (produto.isLoading()) { <span>Carregando...</span> }
    @if (produto.error()) { <span>Erro ao carregar produto</span> }
    @if (produto.value(); as p) {
      <h1>{{ p.nome }}</h1>
      <p>R$ {{ p.preco | currency:'BRL' }}</p>
    }
  `
})
export class ProdutoComponent {
  readonly produtoId = input.required<number>();

  // Reativo: re-busca automaticamente quando produtoId muda
  protected readonly produto = httpResource<Produto>(
    () => `/api/produtos/${this.produtoId()}`
  );
}
```

### httpResource() com parâmetros, headers e cancelamento condicional

```typescript
// Request builder completo
protected readonly pedidos = httpResource<Pedido[]>(() => ({
  url: '/api/pedidos',
  params: {
    status: this.filtroStatus(),
    page: this.pagina(),
    size: 20
  },
  headers: {
    'X-Correlation-Id': crypto.randomUUID()
  }
}));

// Condicional — undefined cancela a requisição (não busca se filtro vazio)
protected readonly busca = httpResource<Produto[]>(() =>
  this.termo().length >= 3
    ? `/api/produtos/busca?q=${this.termo()}`
    : undefined
);
```

### Refresh manual

```typescript
protected readonly usuario = httpResource<Usuario>(() => `/api/me`);

protected atualizar() {
  this.usuario.reload();
}
```

### Tipos de Estado

| Propriedade | Tipo | Descrição |
|---|---|---|
| `.value()` | `T \| undefined` | Dado retornado (undefined enquanto carrega ou em erro) |
| `.isLoading()` | `boolean` | `true` durante requisição em andamento |
| `.error()` | `unknown` | Erro lançado pelo loader (null se nenhum) |
| `.status()` | `ResourceStatus` | `Idle`, `Loading`, `Refreshing`, `Resolved`, `Error`, `Local` |
| `.hasValue()` | `boolean` | Possui valor resolvido |

### Padrão com valor inicial (evitar undefined)

```typescript
protected readonly itens = httpResource<Produto[]>({
  request: () => `/api/produtos`,
  defaultValue: []  // valor antes do carregamento — itens.value() nunca é undefined
});
```

### Integração com Formulário Reativo / busca com debounce

```typescript
@Component({...})
export class BuscaComponent {
  protected readonly termo = signal('');
  private readonly termoBusca = computed(() => this.termo());

  protected readonly resultados = httpResource<Produto[]>(() =>
    this.termoBusca().length >= 3
      ? `/api/produtos/busca?q=${encodeURIComponent(this.termoBusca())}`
      : undefined
  );

  protected onInput(event: Event) {
    this.termo.set((event.target as HTMLInputElement).value);
  }
}
```

## resource() — Dados Assíncronos Genéricos (não-HTTP)

Para operações assíncronas que não são HTTP ou fetch personalizado:

```typescript
import { resource, signal } from '@angular/core';

@Component({...})
export class SearchComponent {
  query = signal('');

  searchResource = resource({
    // Params reativos — dispara reload quando mudam
    params: () => ({ q: this.query() }),

    // Função loader assíncrona: recebe { params, abortSignal }
    loader: async ({ params, abortSignal }) => {
      if (!params.q) return [];
      const response = await fetch(`/api/search?q=${params.q}`, {
        signal: abortSignal,
      });
      return response.json() as Promise<SearchResult[]>;
    },
  });
}
```

### resource() com valor padrão e carregamento condicional

```typescript
todosResource = resource({
  defaultValue: [] as Todo[],
  params: () => ({ filter: this.filter() }),
  loader: async ({ params }) => {
    const res = await fetch(`/api/todos?filter=${params.filter}`);
    return res.json();
  },
});
// value() retorna Todo[] (nunca undefined)

const userId = signal<string | null>(null);

userResource = resource({
  params: () => {
    const id = userId();
    return id ? { id } : undefined;  // undefined pula o carregamento
  },
  loader: async ({ params }) => {
    return fetch(`/api/users/${params.id}`).then(r => r.json());
  },
});
// Status é 'idle' quando params retorna undefined
```

> **Atenção à tipagem do `loader`**: o parâmetro é sempre desestruturado como `{ params, abortSignal }` (ou `{ request, abortSignal }` em `httpResource`), nunca como as chaves de domínio direto (ex: nunca `loader: ({ meuCampo }) => ...`). Se `params`/`request` não tiverem um tipo genérico explícito no `resource<T, R>(...)`, declare o tipo do parâmetro do `loader` manualmente para evitar erro de compilação `TS7031` (binding element implicitamente `any`).

## HttpClient — Abordagem Tradicional

Para mutações (POST/PUT/DELETE) ou cenários com operadores Observable:

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({...})
export class UsersComponent {
  private http = inject(HttpClient);

  // Converter Observable para Signal
  users = toSignal(
    this.http.get<User[]>('/api/users'),
    { initialValue: [] }
  );

  // Ou use Observable diretamente
  users$ = this.http.get<User[]>('/api/users');
}
```

### HTTP Methods

```typescript
private http = inject(HttpClient);

// GET
getUser(id: string) {
  return this.http.get<User>(`/api/users/${id}`);
}

// POST
createUser(user: CreateUserDto) {
  return this.http.post<User>('/api/users', user);
}

// PUT
updateUser(id: string, user: UpdateUserDto) {
  return this.http.put<User>(`/api/users/${id}`, user);
}

// PATCH
patchUser(id: string, changes: Partial<User>) {
  return this.http.patch<User>(`/api/users/${id}`, changes);
}

// DELETE
deleteUser(id: string) {
  return this.http.delete<void>(`/api/users/${id}`);
}
```

### Request Options

```typescript
this.http.get<User[]>('/api/users', {
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json',
  },
  params: {
    page: '1',
    limit: '10',
    sort: 'name',
  },
  observe: 'response', // Obter HttpResponse completo
  responseType: 'json',
});
```

## Interceptors

### Interceptor funcional (recomendado)

```typescript
// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};

// error.interceptor.ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        inject(Router).navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

// logging.interceptor.ts
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();
  return next(req).pipe(
    tap({
      next: () => console.log(`${req.method} ${req.url} - ${Date.now() - started}ms`),
      error: (err) => console.error(`${req.method} ${req.url} failed`, err),
    })
  );
};
```

### Registrar interceptors

```typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        loggingInterceptor,
      ])
    ),
  ],
};
```

## Error Handling

### Com `httpResource()`

```typescript
@Component({
  template: `
    @if (produto.error(); as err) {
      @if (isHttpErrorResponse(err) && err.status === 404) {
        <app-empty-state mensagem="Produto não encontrado" />
      } @else {
        <app-error-state mensagem="Erro inesperado" />
      }
    }
  `,
})
export class ProdutoComponent {
  produto = httpResource<Produto>(() => `/api/produtos/${this.produtoId()}`);
}
```

### Com `HttpClient`

```typescript
import { catchError, retry } from 'rxjs';

getUser(id: string) {
  return this.http.get<User>(`/api/users/${id}`).pipe(
    retry(2), // Tentar novamente até 2 vezes
    catchError((error: HttpErrorResponse) => {
      console.error('Erro ao buscar usuário:', error);
      return throwError(() => new Error('Falha ao carregar usuário'));
    })
  );
}
```

## Padrão de estado de carregamento

```typescript
@Component({
  template: `
    @switch (dataResource.status()) {
      @case ('idle') {
        <p>Digite um termo de busca</p>
      }
      @case ('loading') {
        <app-spinner />
      }
      @case ('reloading') {
        <app-data [data]="dataResource.value()" />
        <app-spinner size="small" />
      }
      @case ('resolved') {
        <app-data [data]="dataResource.value()" />
      }
      @case ('error') {
        <app-error
          [error]="dataResource.error()"
          (retry)="dataResource.reload()"
        />
      }
    }
  `,
})
export class DataComponent {
  query = signal('');
  dataResource = httpResource<Data[]>(() =>
    this.query() ? `/api/search?q=${this.query()}` : undefined
  );
}
```

## Checklist de Uso

- [ ] `httpResource()` como primeira opção para GET em componentes
- [ ] Request builder (`() => url` ou `() => ({ url, params, headers })`) para parâmetros reativos
- [ ] `undefined` para cancelar requisição condicionalmente
- [ ] `defaultValue` para evitar `undefined` inicial
- [ ] `.isLoading()`, `.error()`, `.value()` usados no template
- [ ] `.reload()` para refresh manual
- [ ] `resource()` para lógica assíncrona não-HTTP
- [ ] Parâmetro do `loader` sempre `{ params/request, abortSignal }` — nunca desestruturar campo de domínio direto sem tipar
- [ ] `HttpClient` (via `inject()`) para mutações POST/PUT/DELETE
- [ ] `ChangeDetectionStrategy.OnPush` no componente

Para padrões avançados, veja:

- [Service Layer Pattern](references/service-layer.MD)
- [Caching Strategies](references/caching-strategies.MD)
- [Pagination](references/pagination.MD)
- [File Upload](references/file-upload.MD)
- [Request Cancellation](references/request-cancellation.MD)
- [Testing HTTP](references/testing-http.MD)
