---
name: angular-http
description: Implemente busca de dados HTTP no Angular v20+ usando resource(), httpResource() e HttpClient. Use para chamadas de API, carregamento de dados com signals, tratamento de requisição/resposta e interceptors. Acione em busca de dados, integração com APIs, estados de carregamento, tratamento de erros ou conversão de HTTP baseado em Observable para padrões baseados em signal.
metadata:
  version: "0.0.1"
---

# Angular HTTP e Busca de Dados

Busque dados no Angular usando `resource()`, `httpResource()` baseado em signals e o tradicional `HttpClient`.

## httpResource() - Signal-Based HTTP

`httpResource()` encapsula o HttpClient com um gerenciamento de estado baseado em signals:

```typescript
import { Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-profile',
  template: `
    @if (userResource.isLoading()) {
      <p>Carregando...</p>
    } @else if (userResource.error()) {
      <p>Erro: {{ userResource.error()?.message }}</p>
      <button (click)="userResource.reload()">Recarregar</button>
    } @else if (userResource.hasValue()) {
      <h1>{{ userResource.value().name }}</h1>
      <p>{{ userResource.value().email }}</p>
    }
  `,
})
export class UserProfileComponent {
  userId = signal('123');
  
  // Recurso HTTP reativo - refaz a requisição quando userId muda
  userResource = httpResource<User>(() => `/api/users/${this.userId()}`);
}
```

### httpResource Options

```typescript
// Requisição GET simples
userResource = httpResource<User>(() => `/api/users/${this.userId()}`);

// Com todos os parametros da requisição
userResource = httpResource<User>(() => ({
  url: `/api/users/${this.userId()}`,
  method: 'GET',
  headers: { 'Authorization': `Bearer ${this.token()}` },
  params: { include: 'profile' },
}));

// Com valor default
usersResource = httpResource<User[]>(() => '/api/users', {
  defaultValue: [],
});

// Pular requisição quando params for undefined
userResource = httpResource<User>(() => {
  const id = this.userId();
  return id ? `/api/users/${id}` : undefined;
});
```

### Resource State

```typescript
// Status signals
userResource.value()      // Valor atual ou undefined
userResource.hasValue()   // Boolean - possui valor resolvido
userResource.error()      // Erro ou undefined
userResource.isLoading()  // Boolean - está carregando
userResource.status()     // 'idle' | 'loading' | 'reloading' | 'resolved' | 'error' | 'local'

// Ações
userResource.reload()     // Disparar reload manualmente
userResource.set(value)   // Definir valor local
userResource.update(fn)   // Atualizar valor local
```

## resource() - Dados Assíncronos Genéricos

Para operações assíncronas não-HTTP ou lógica de fetch personalizada:

```typescript
import { resource, signal } from '@angular/core';

@Component({...})
export class SearchComponent {
  query = signal('');
  
  searchResource = resource({
    // Params reativos - dispara reload quando mudam
    params: () => ({ q: this.query() }),
    
    // Função loader assíncrona
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

### Resource com valor padrão

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
```

### Carregamento Condicional

```typescript
const userId = signal<string | null>(null);

userResource = resource({
  params: () => {
    const id = userId();
    // Retorne undefined para pular o carregamento
    return id ? { id } : undefined;
  },
  loader: async ({ params }) => {
    return fetch(`/api/users/${params.id}`).then(r => r.json());
  },
});
// Status é 'idle' quando params retorna undefined
```

## HttpClient - Abordagem Tradicional

Para cenários complexos ou quando precisar de operadores Observable:

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
    @if (userResource.error(); as error) {
      <div class="error">
        <p>{{ getErrorMessage(error) }}</p>
        <button (click)="userResource.reload()">Recarregar</button>
      </div>
    }
  `,
})
export class UserComponent {
  userResource = httpResource<User>(() => `/api/users/${this.userId()}`);
  
  getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message || `Erro ${error.status}: ${error.statusText}`;
    }
    return 'Ocorreu um erro inesperado';
  }
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

Para padrões avançados, veja:

- [Service Layer Pattern](references/service-layer.md)
- [Caching Strategies](references/caching-strategies.md)
- [Pagination](references/pagination.md)
- [File Upload](references/file-upload.md)
- [Request Cancellation](references/request-cancellation.md)
- [Testing HTTP](references/testing-http.md)
