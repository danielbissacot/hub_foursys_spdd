# Cancelamento de Requisições

## Com `resource()`

```typescript
// `resource()` já trata cancelamento automaticamente via `abortSignal`
searchResource = resource({
  params: () => ({ q: this.query() }),
  loader: async ({ params, abortSignal }) => {
    const response = await fetch(`/api/search?q=${params.q}`, {
      signal: abortSignal, // Cancela se params mudarem
    });
    return response.json();
  },
});
```

## Com `HttpClient`

```typescript
@Component({...})
export class SearchComponent implements OnDestroy {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  
  query = signal('');
  results = signal<Result[]>([]);
  
  private searchSubscription?: Subscription;
  
  search() {
    // Cancelar requisição anterior
    this.searchSubscription?.unsubscribe();
    
    this.searchSubscription = this.http
      .get<Result[]>(`/api/search?q=${this.query()}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(results => this.results.set(results));
  }
}
```

## Busca com debounce

```typescript
@Component({...})
export class SearchComponent {
  query = signal('');
  
  private http = inject(HttpClient);
  
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
}
```

