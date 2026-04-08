# Operações Assíncronas

### Busca com debounce

```typescript
@Component({...})
export class SearchComponent {
  query = signal('');
  
  private http = inject(HttpClient);
  
  // Busca com debounce usando toObservable
  results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(q => q.length >= 2),
      switchMap(q => this.http.get<Result[]>(`/api/search?q=${q}`)),
      catchError(() => of([]))
    ),
    { initialValue: [] }
  );
  
  // Estado de carregamento
  private searching = signal(false);
  readonly isSearching = this.searching.asReadonly();
  
  constructor() {
    // Controla o estado de carregamento
    effect(() => {
      const q = this.query();
      if (q.length >= 2) {
        this.searching.set(true);
      }
    }, { allowSignalWrites: true });
    
    effect(() => {
      this.results(); // Subscribe em results
      this.searching.set(false);
    }, { allowSignalWrites: true });
  }
}
```

### Optimistic Updates

```typescript
@Injectable({ providedIn: 'root' })
export class TodoService {
  private todos = signal<Todo[]>([]);
  readonly items = this.todos.asReadonly();
  
  private http = inject(HttpClient);
  
  async toggleTodo(id: string): Promise<void> {
    // Optimistic update
    const previousTodos = this.todos();
    this.todos.update(todos =>
      todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
    
    try {
      await firstValueFrom(
        this.http.patch(`/api/todos/${id}/toggle`, {})
      );
    } catch {
      // Rollback em caso de erro
      this.todos.set(previousTodos);
    }
  }
}
```

