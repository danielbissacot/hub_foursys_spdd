---
name: angular-di
description: Implemente injeção de dependência no Angular v20+ usando inject(), tokens de injeção e configuração de providers. Use para arquitetura de serviços, fornecendo dependências em diferentes níveis, criando tokens injetáveis e gerenciando serviços singleton vs scoped. Aciona na criação de serviços, configuração de providers, uso de tokens de injeção ou compreensão da hierarquia DI.
metadata:
  version: "0.0.1"
---

# Injeção de Dependência Angular

Configure e use injeção de dependência no Angular v20+ com `inject()` e providers.

## Injeção Básica

### Usando inject()

Prefira `inject()` sobre injeção no construtor:

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-list',
  template: `...`,
})
export class UserListComponent {
  // Injetar dependências
  private http = inject(HttpClient);
  private userService = inject(UserService);
  
  // Pode usar imediatamente
  users = this.userService.getUsers();
}
```

### Serviços Injetáveis

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root', // Singleton at root level
})
export class UserService {
  private http = inject(HttpClient);
  
  private users = signal<User[]>([]);
  readonly users$ = this.users.asReadonly();
  
  async loadUsers() {
    const users = await firstValueFrom(
      this.http.get<User[]>('/api/users')
    );
    this.users.set(users);
  }
}
```

## Escopos de Providers

### Nível Raiz (Singleton)

```typescript
// Recomendado: providedIn
@Injectable({
  providedIn: 'root',
})
export class AuthService {}

// Alternativa: em app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    AuthService,
  ],
};
```

### Nível de Componente (Instância por Componente)

```typescript
@Component({
  selector: 'app-editor',
  providers: [EditorStateService], // Nova instância para cada componente
  template: `...`,
})
export class EditorComponent {
  private editorState = inject(EditorStateService);
}
```

### Nível de Rota

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    providers: [AdminService], // Compartilhado dentro desta árvore de rotas
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
    ],
  },
];
```

## Tokens de Injeção

### Criando Tokens

```typescript
import { InjectionToken } from '@angular/core';

// Token de valor simples
export const API_URL = new InjectionToken<string>('API_URL');

// Token de objeto
export interface AppConfig {
  apiUrl: string;
  features: {
    darkMode: boolean;
    analytics: boolean;
  };
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

// Token com factory (auto-fornecido)
export const WINDOW = new InjectionToken<Window>('Window', {
  providedIn: 'root',
  factory: () => window,
});

export const LOCAL_STORAGE = new InjectionToken<Storage>('LocalStorage', {
  providedIn: 'root',
  factory: () => localStorage,
});
```

### Fornecendo Valores de Tokens

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_URL, useValue: 'https://api.example.com' },
    {
      provide: APP_CONFIG,
      useValue: {
        apiUrl: 'https://api.example.com',
        features: { darkMode: true, analytics: true },
      },
    },
  ],
};
```

### Injetando Tokens

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = inject(API_URL);
  private config = inject(APP_CONFIG);
  private window = inject(WINDOW);
  
  getBaseUrl(): string {
    return this.apiUrl;
  }
}
```

## Tipos de Providers

### useClass

```typescript
// Fornecer implementação
{ provide: LoggerService, useClass: ConsoleLoggerService }

// Implementação condicional
{
  provide: LoggerService,
  useClass: environment.production 
    ? ProductionLoggerService 
    : ConsoleLoggerService,
}
```

### useValue

```typescript
// Valores estáticos
{ provide: API_URL, useValue: 'https://api.example.com' }

// Objetos de configuração
{ provide: APP_CONFIG, useValue: { theme: 'dark', language: 'en' } }
```

### useFactory

```typescript
// Factory com dependências
{
  provide: UserService,
  useFactory: (http: HttpClient, config: AppConfig) => {
    return new UserService(http, config.apiUrl);
  },
  deps: [HttpClient, APP_CONFIG],
}

// Factory assíncrona (não recomendado - use APP_INITIALIZER)
{
  provide: CONFIG,
  useFactory: () => fetch('/config.json').then(r => r.json()),
}
```

### useExisting

```typescript
// Alias para provider existente
{ provide: AbstractLogger, useExisting: ConsoleLoggerService }

// Múltiplos tokens apontando para a mesma instância
providers: [
  ConsoleLoggerService,
  { provide: Logger, useExisting: ConsoleLoggerService },
  { provide: ErrorLogger, useExisting: ConsoleLoggerService },
]
```

## Opções de Injeção

### Injeção Opcional

```typescript
@Component({...})
export class MyComponent {
  // Retorna null se não fornecido
  private analytics = inject(AnalyticsService, { optional: true });
  
  trackEvent(name: string) {
    this.analytics?.track(name);
  }
}
```

### Self, SkipSelf, Host

```typescript
@Component({
  providers: [LocalService],
})
export class ParentComponent {
  // Apenas procurar no injetor deste componente
  private local = inject(LocalService, { self: true });
}

@Component({...})
export class ChildComponent {
  // Pular este componente, procurar no pai
  private parentService = inject(ParentService, { skipSelf: true });
  
  // Apenas procurar até o componente host
  private hostService = inject(HostService, { host: true });
}
```

## Multi Providers

Colete múltiplos valores para o mesmo token:

```typescript
// Token para múltiplos validadores
export const VALIDATORS = new InjectionToken<Validator[]>('Validators');

// Fornecer múltiplos valores
providers: [
  { provide: VALIDATORS, useClass: RequiredValidator, multi: true },
  { provide: VALIDATORS, useClass: EmailValidator, multi: true },
  { provide: VALIDATORS, useClass: MinLengthValidator, multi: true },
]

// Injetar como array
@Injectable()
export class ValidationService {
  private validators = inject(VALIDATORS); // Validator[]
  
  validate(value: string): ValidationError[] {
    return this.validators
      .map(v => v.validate(value))
      .filter(Boolean);
  }
}
```

### Interceptadores HTTP (Multi Provider)

```typescript
// Interceptadores usam multi providers internamente
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loggingInterceptor,
        errorInterceptor,
      ])
    ),
  ],
};
```

## APP_INITIALIZER

Execute código assíncrono antes do app iniciar:

```typescript
import { APP_INITIALIZER } from '@angular/core';

function initializeApp(configService: ConfigService): () => Promise<void> {
  return () => configService.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true,
    },
  ],
};
```

### Múltiplos Inicializadores

```typescript
providers: [
  {
    provide: APP_INITIALIZER,
    useFactory: (config: ConfigService) => () => config.load(),
    deps: [ConfigService],
    multi: true,
  },
  {
    provide: APP_INITIALIZER,
    useFactory: (auth: AuthService) => () => auth.checkSession(),
    deps: [AuthService],
    multi: true,
  },
]
```

## Injetor de Ambiente

Crie injetores programaticamente:

```typescript
import { createEnvironmentInjector, EnvironmentInjector, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PluginService {
  private parentInjector = inject(EnvironmentInjector);
  
  loadPlugin(providers: Provider[]): EnvironmentInjector {
    return createEnvironmentInjector(providers, this.parentInjector);
  }
}
```

## runInInjectionContext

Execute código com contexto de injeção:

```typescript
import { runInInjectionContext, EnvironmentInjector, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilityService {
  private injector = inject(EnvironmentInjector);
  
  executeWithDI<T>(fn: () => T): T {
    return runInInjectionContext(this.injector, fn);
  }
}

// Uso
utilityService.executeWithDI(() => {
  const http = inject(HttpClient);
  // Usar http...
});
```

Para padrões detalhados, veja:

- [Service Patterns](references/service-patterns.MD)
- [Abstract Classes as Tokens](references/abstract-classes-as-tokens.MD)
- [Hierarchical Injection](references/hierarchical-injection.MD)
- [Dynamic Providers](references/dynamic-providers.MD)
- [Testing with DI](references/testing-with-di.MD)
- [DestroyRef and Cleanup](references/destroyref-and-cleanup.MD)
- [Injection Context Utilities](references/injection-context-utilities.MD)

