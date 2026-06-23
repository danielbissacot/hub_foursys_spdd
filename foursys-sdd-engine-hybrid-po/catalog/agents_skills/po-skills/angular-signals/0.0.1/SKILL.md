---
name: angular-signals
description: Implement signal-based reactive state management in Angular v20+. Use for creating reactive state with signal(), derived state with computed(), dependent state with linkedSignal(), and side effects with effect(). Triggers on state management questions, converting from BehaviorSubject/Observable patterns to signals, or implementing reactive data flows.
metadata:
  version: "0.0.1"
---
 
# Angular Signals

Signals são o primitivo reativo do Angular para gerenciamento de estado. Eles fornecem reatividade síncrona e de granularidade fina.

## APIs principais de Signals

### `signal()` - Estado gravável

```typescript
import { signal } from '@angular/core';

// Create writable signal
const count = signal(0);

// Read value
console.log(count()); // 0

// Set new value
count.set(5);

// Update based on current value
count.update(c => c + 1);

// With explicit type
const user = signal<User | null>(null);
user.set({ id: 1, name: 'Alice' });
```

### `computed()` - Estado derivado

```typescript
import { signal, computed } from '@angular/core';

const firstName = signal('John');
const lastName = signal('Doe');

// Derived signal - automatically updates when dependencies change
const fullName = computed(() => `${firstName()} ${lastName()}`);

console.log(fullName()); // "John Doe"
firstName.set('Jane');
console.log(fullName()); // "Jane Doe"

// Computed with complex logic
const items = signal<Item[]>([]);
const filter = signal('');

const filteredItems = computed(() => {
  const query = filter().toLowerCase();
  return items().filter(item => 
    item.name.toLowerCase().includes(query)
  );
});

const totalPrice = computed(() => 
  filteredItems().reduce((sum, item) => sum + item.price, 0)
);
```

### `linkedSignal()` - Estado dependente com reset

```typescript
import { signal, linkedSignal } from '@angular/core';

const options = signal(['A', 'B', 'C']);

// Reseta para a primeira opção quando `options` muda
const selected = linkedSignal(() => options()[0]);

console.log(selected()); // "A"
selected.set('B');       // Usuário seleciona B
console.log(selected()); // "B"
options.set(['X', 'Y']); // Options mudou
console.log(selected()); // "X" - reset automático para a primeira

// Com acesso ao valor anterior
const items = signal<Item[]>([]);

const selectedItem = linkedSignal<Item[], Item | null>({
  source: () => items(),
  computation: (newItems, previous) => {
    // Tenta preservar a seleção se o item ainda existir
    const prevItem = previous?.value;
    if (prevItem && newItems.some(i => i.id === prevItem.id)) {
      return prevItem;
    }
    return newItems[0] ?? null;
  },
});
```

### `effect()` - Efeitos colaterais

```typescript
import { signal, effect, inject, DestroyRef } from '@angular/core';

@Component({...})
export class SearchComponent {
  query = signal('');
  
  constructor() {
    // Effect executa quando `query` muda
    effect(() => {
      console.log('Search query:', this.query());
    });
    
    // Effect com cleanup
    effect((onCleanup) => {
      const timer = setInterval(() => {
        console.log('Current query:', this.query());
      }, 1000);
      
      onCleanup(() => clearInterval(timer));
    });
  }
}
```

**Regras de `effect`:**
- Não pode escrever em signals por padrão (use `allowSignalWrites` se necessário)
- Executa em contexto de injeção (construtor ou com `runInInjectionContext`)
- É automaticamente limpo quando o componente é destruído

```typescript
// Escrita em signals dentro de effects (use com cautela)
effect(() => {
  if (this.query().length > 0) {
    this.hasSearched.set(true);
  }
}, { allowSignalWrites: true });
```

## Padrão de Estado no Componente

```typescript
@Component({
  selector: 'app-todo-list',
  template: `
    <input [value]="newTodo()" (input)="newTodo.set($any($event.target).value)" />
    <button (click)="addTodo()" [disabled]="!canAdd()">Add</button>
    
    <ul>
      @for (todo of filteredTodos(); track todo.id) {
        <li [class.done]="todo.done">
          {{ todo.text }}
          <button (click)="toggleTodo(todo.id)">Toggle</button>
        </li>
      }
    </ul>
    
    <p>{{ remaining() }} remaining</p>
  `,
})
export class TodoListComponent {
  // Estado
  todos = signal<Todo[]>([]);
  newTodo = signal('');
  filter = signal<'all' | 'active' | 'done'>('all');
  
  // Estado derivado
  canAdd = computed(() => this.newTodo().trim().length > 0);
  
  filteredTodos = computed(() => {
    const todos = this.todos();
    switch (this.filter()) {
      case 'active': return todos.filter(t => !t.done);
      case 'done': return todos.filter(t => t.done);
      default: return todos;
    }
  });
  
  remaining = computed(() => 
    this.todos().filter(t => !t.done).length
  );
  
  // Ações
  addTodo() {
    const text = this.newTodo().trim();
    if (text) {
      this.todos.update(todos => [
        ...todos,
        { id: crypto.randomUUID(), text, done: false }
      ]);
      this.newTodo.set('');
    }
  }
  
  toggleTodo(id: string) {
    this.todos.update(todos =>
      todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  }
}
```

## Interop com RxJS

### `toSignal()` - Observable para Signal

```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({...})
export class TimerComponent {
  private http = inject(HttpClient);
  
  // De um observable - requer valor inicial ou allowUndefined
  counter = toSignal(interval(1000), { initialValue: 0 });
  
  // De uma chamada HTTP - undefined até carregar
  users = toSignal(this.http.get<User[]>('/api/users'));
  
  // Com requireSync para observables síncronos (BehaviorSubject)
  private user$ = new BehaviorSubject<User | null>(null);
  currentUser = toSignal(this.user$, { requireSync: true });
}
```

### `toObservable()` - Signal para Observable

```typescript
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap, debounceTime } from 'rxjs';

@Component({...})
export class SearchComponent {
  query = signal('');
  
  private http = inject(HttpClient);
  
  // Converte signal para observable para usar operadores RxJS
  results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      switchMap(q => this.http.get<Result[]>(`/api/search?q=${q}`))
    ),
    { initialValue: [] }
  );
}
```

## Igualdade de Signal

```typescript
// Função de igualdade customizada
const user = signal<User>(
  { id: 1, name: 'Alice' },
  { equal: (a, b) => a.id === b.id }
);

// Só dispara atualizações quando o ID mudar
user.set({ id: 1, name: 'Alice Updated' }); // Sem atualização
user.set({ id: 2, name: 'Bob' }); // Dispara atualização
```

## Leituras não rastreadas

```typescript
import { untracked } from '@angular/core';

const a = signal(1);
const b = signal(2);

// Depende somente de 'a', não de 'b'
const result = computed(() => {
  const aVal = a();
  const bVal = untracked(() => b());
  return aVal + bVal;
});
```

## Padrão de Estado em Service

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Estado privado gravável
  private _user = signal<User | null>(null);
  private _loading = signal(false);
  
  // Signals públicos somente leitura
  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  
  private http = inject(HttpClient);
  
  async login(credentials: Credentials): Promise<void> {
    this._loading.set(true);
    try {
      const user = await firstValueFrom(
        this.http.post<User>('/api/login', credentials)
      );
      this._user.set(user);
    } finally {
      this._loading.set(false);
    }
  }
  
  logout(): void {
    this._user.set(null);
  }
}
```

Para padrões avançados incluindo `resource()`, veja:

- [Resource API](references/resource-api.md)
- [Signal Store Pattern](references/signal-store-pattern.md)
- [Form State with Signals](references/form-state.md)
- [Async Operations](references/async-operations.md)
- [Testing Signals](references/testing-signals.md)
