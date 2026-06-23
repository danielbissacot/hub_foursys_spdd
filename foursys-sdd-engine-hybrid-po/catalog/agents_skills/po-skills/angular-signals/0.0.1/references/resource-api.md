# Resource API

A API `resource()` trata de fetch assíncrono de dados com signals:

```typescript
import { resource, signal, computed } from '@angular/core';

@Component({...})
export class UserProfileComponent {
  userId = signal<string>('');
  
  // Resource busca dados quando os parâmetros mudam
  userResource = resource({
    params: () => ({ id: this.userId() }),
    loader: async ({ params, abortSignal }) => {
      const response = await fetch(`/api/users/${params.id}`, {
        signal: abortSignal,
      });
      return response.json() as Promise<User>;
    },
  });
  
  // Acessa o estado do resource
  user = computed(() => this.userResource.value());
  isLoading = computed(() => this.userResource.isLoading());
  error = computed(() => this.userResource.error());
}
```

### Status do Resource

```typescript
const userResource = resource({});

// Signals de status
userResource.value();      // Valor atual ou undefined
userResource.hasValue();   // Boolean - possui valor resolvido
userResource.error();      // Erro ou undefined
userResource.isLoading();  // Boolean - está carregando
userResource.status();     // 'idle' | 'loading' | 'reloading' | 'resolved' | 'error' | 'local'

// Reload manual
userResource.reload();

// Atualizações locais
userResource.set(newValue);
userResource.update(current => ({ ...current, name: 'Updated' }));
```

### Resource com valor padrão

```typescript
const todosResource = resource({
  defaultValue: [] as Todo[],
  params: () => ({ filter: this.filter() }),
  loader: async ({ params }) => {
    const response = await fetch(`/api/todos?filter=${params.filter}`);
    return response.json();
  },
});

// value() retorna Todo[] (nunca undefined devido a defaultValue)
```

### Carregamento condicional

```typescript
const userId = signal<string | null>(null);

const userResource = resource({
  params: () => {
    const id = userId();
    // Retorna undefined para pular o carregamento
    return id ? { id } : undefined;
  },
  loader: async ({ params }) => {
    return fetch(`/api/users/${params.id}`).then(r => r.json());
  },
});
// Status é 'idle' quando params retorna undefined
```
