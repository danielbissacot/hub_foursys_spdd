# Providers Dinâmicos

## Flags de Funcionalidades

```typescript
export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('FeatureFlags');

interface FeatureFlags {
  newDashboard: boolean;
  betaFeatures: boolean;
  experimentalApi: boolean;
}

// Carregar da API
{
  provide: FEATURE_FLAGS,
  useFactory: async () => {
    const response = await fetch('/api/features');
    return response.json();
  },
}

// Usar em componentes
@Component({...})
export class DashboardComponent {
  private features = inject(FEATURE_FLAGS);
  
  showNewDashboard = this.features.newDashboard;
}
```

## Serviços Específicos da Plataforma

```typescript
export abstract class StorageService {
  abstract get(key: string): string | null;
  abstract set(key: string, value: string): void;
  abstract remove(key: string): void;
}

@Injectable()
export class BrowserStorageService extends StorageService {
  get(key: string) { return localStorage.getItem(key); }
  set(key: string, value: string) { localStorage.setItem(key, value); }
  remove(key: string) { localStorage.removeItem(key); }
}

@Injectable()
export class ServerStorageService extends StorageService {
  private store = new Map<string, string>();
  
  get(key: string) { return this.store.get(key) ?? null; }
  set(key: string, value: string) { this.store.set(key, value); }
  remove(key: string) { this.store.delete(key); }
}

// Fornecer baseado na plataforma
import { PLATFORM_ID, isPlatformBrowser } from '@angular/common';

{
  provide: StorageService,
  useFactory: (platformId: object) => {
    return isPlatformBrowser(platformId)
      ? new BrowserStorageService()
      : new ServerStorageService();
  },
  deps: [PLATFORM_ID],
}
```

