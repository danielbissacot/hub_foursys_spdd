# DestroyRef e Limpeza

## Limpeza Automática

```typescript
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({...})
export class DataComponent {
  private destroyRef = inject(DestroyRef);
  private dataService = inject(DataService);
  
  constructor() {
    // Auto-unsubscribe quando o componente é destruído
    this.dataService.data$
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        console.log(data);
      });
  }
  
  // Ou usar DestroyRef diretamente
  ngOnInit() {
    const subscription = this.dataService.updates$.subscribe();
    
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      console.log('Cleaned up!');
    });
  }
}
```

## Em Serviços

```typescript
@Injectable()
export class WebSocketService {
  private destroyRef = inject(DestroyRef);
  private socket: WebSocket | null = null;
  
  constructor() {
    this.destroyRef.onDestroy(() => {
      this.socket?.close();
    });
  }
  
  connect(url: string) {
    this.socket = new WebSocket(url);
  }
}
```

## takeUntilDestroyed Fora do Construtor

```typescript
@Component({...})
export class MyComponent {
  private destroyRef = inject(DestroyRef);
  
  loadData() {
    // Passar destroyRef quando usar fora do construtor
    this.http.get('/api/data')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
```
