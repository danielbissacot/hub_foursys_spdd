# Utilitários de Contexto de Injeção

## assertInInjectionContext

```typescript
import { assertInInjectionContext, inject } from '@angular/core';

export function injectLogger(): Logger {
  assertInInjectionContext(injectLogger);
  return inject(Logger);
}

// Uso - deve ser chamado em contexto de injeção
@Component({...})
export class MyComponent {
  private logger = injectLogger(); // OK
  
  someMethod() {
    // injectLogger(); // ERRO - não está em um contexto de injeção
  }
}
```

## Funções inject Customizadas

```typescript
// Criar utilitários de injeção reutilizáveis
export function injectRouteParam(param: string): Signal<string | null> {
  assertInInjectionContext(injectRouteParam);
  
  const route = inject(ActivatedRoute);
  return toSignal(
    route.paramMap.pipe(map(params => params.get(param))),
    { initialValue: null }
  );
}

export function injectQueryParam(param: string): Signal<string | null> {
  assertInInjectionContext(injectQueryParam);
  
  const route = inject(ActivatedRoute);
  return toSignal(
    route.queryParamMap.pipe(map(params => params.get(param))),
    { initialValue: null }
  );
}

// Uso
@Component({...})
export class UserComponent {
  userId = injectRouteParam('id');
  tab = injectQueryParam('tab');
}
```

