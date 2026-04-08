# Estratégias de Cache

## Cache Simples em Memória

```typescript
@Injectable({ providedIn: 'root' })
export class CachedUserService {
  private http = inject(HttpClient);
  private cache = new Map<string, { data: User; timestamp: number }>();
  private cacheDuration = 5 * 60 * 1000; // 5 minutos
  
  getUser(id: string): Observable<User> {
    const cached = this.cache.get(id);
    
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return of(cached.data);
    }
    
    return this.http.get<User>(`/api/users/${id}`).pipe(
      tap(user => {
        this.cache.set(id, { data: user, timestamp: Date.now() });
      })
    );
  }
  
  invalidateCache(id?: string) {
    if (id) {
      this.cache.delete(id);
    } else {
      this.cache.clear();
    }
  }
}
```

## Cache baseado em Signal

```typescript
@Injectable({ providedIn: 'root' })
export class UserCacheService {
  private http = inject(HttpClient);
  
  // Cache como signal
  private usersCache = signal<Map<string, User>>(new Map());
  
  // Computed para acesso conveniente
  users = computed(() => Array.from(this.usersCache().values()));
  
  getUser(id: string): User | undefined {
    return this.usersCache().get(id);
  }
  
  async fetchUser(id: string): Promise<User> {
    const cached = this.getUser(id);
    if (cached) return cached;
    
    const user = await firstValueFrom(
      this.http.get<User>(`/api/users/${id}`)
    );
    
    this.usersCache.update(cache => {
      const newCache = new Map(cache);
      newCache.set(id, user);
      return newCache;
    });
    
    return user;
  }
}
```

