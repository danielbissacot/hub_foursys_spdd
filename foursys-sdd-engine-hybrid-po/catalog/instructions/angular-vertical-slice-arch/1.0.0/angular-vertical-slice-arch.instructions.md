---
name: 'angular-vertical-slice-arch'
description: "Regras de arquitetura Angular v20+ sempre-ativas para o GitHub Copilot. Instaladas em .github/copilot-instructions.md do workspace, garantem que o Copilot siga os padrões modernos (Standalone, Signals, httpResource, OnPush, inject()) em qualquer contexto — sem necessidade de rodar uma fase SDD."
metadata:
  version: "1.0.0"
applyTo: "**/*.ts, **/*.html, **/*.scss"
---

# Arquitetura Angular v20+ — Regras Foursys SDD

Estas instruções são aplicadas automaticamente pelo GitHub Copilot em qualquer workspace Angular identificado.

---

## Stack Obrigatória

- **Framework:** Angular v20+
- **Componentes:** Standalone Components — `NgModule` é proibido
- **Reatividade:** Signals (`signal()`, `computed()`, `effect()`, `linkedSignal()`) como primitivos principais
- **HTTP:** `httpResource()` ou `resource()` como primeira opção — `toSignal(http.get())` é desencorajado
- **Change Detection:** `OnPush` obrigatório em todos os componentes
- **Injeção de Dependência:** `inject()` pattern obrigatório — proibido `constructor(private service: Service)`
- **Control Flow:** `@if`, `@for` com `track` obrigatório, `@switch` — proibido `*ngIf`, `*ngFor`, `*ngSwitch`
- **Visibilidade:** `protected` para membros acessados no template — proibido `private`
- **Testes:** Vitest preferido (v21+); Jasmine aceito em projetos existentes

---

## Estrutura de Arquivos

```
src/
├── app/
│   ├── app.config.ts          ← providers globais (routes, interceptors, etc.)
│   ├── app.routes.ts          ← rotas lazy-loaded com loadComponent
│   ├── [feature]/             ← pasta por domínio/feature
│   │   ├── [feature].component.ts
│   │   ├── [feature].service.ts
│   │   ├── [feature].routes.ts
│   │   └── models/
│   └── shared/                ← componentes e serviços reutilizáveis
│       ├── components/
│       ├── services/
│       └── models/
```

Para projetos com 3+ domínios distintos → usar Vertical Slice (DUPE pattern): cada domínio em pasta isolada com `data-access/api/`, `data-access/services/`, `data-access/state/`.

---

## Padrões de Código

### Signals (primitivos de estado)

```typescript
// ✅ Correto
readonly count = signal(0);
readonly doubled = computed(() => this.count() * 2);
readonly items = linkedSignal(() => this.filteredData());

// ❌ Errado — não use BehaviorSubject para estado local
private count$ = new BehaviorSubject(0);
```

### HTTP com httpResource

```typescript
// ✅ Correto — httpResource como primeira opção
readonly user = httpResource<User>(() => `/api/users/${this.userId()}`);

// Uso no template: user.value(), user.isLoading(), user.error()

// ❌ Desencorajado para novos componentes
readonly user$ = this.http.get<User>(`/api/users/${id}`);
```

### Injeção de Dependência

```typescript
// ✅ Correto
export class MyComponent {
  private readonly service = inject(MyService);
}

// ❌ Proibido
export class MyComponent {
  constructor(private service: MyService) {}
}
```

### Standalone Component

```typescript
// ✅ Correto
@Component({
  selector: 'app-my',
  standalone: true,            // obrigatório
  changeDetection: ChangeDetectionStrategy.OnPush,  // obrigatório
  imports: [CommonModule, RouterLink],
  template: `...`
})
export class MyComponent {}

// ❌ Proibido
@NgModule({ declarations: [MyComponent] })
export class MyModule {}
```

### Control Flow moderno

```html
<!-- ✅ Correto -->
@if (user()) {
  <span>{{ user()!.name }}</span>
}

@for (item of items(); track item.id) {
  <li>{{ item.name }}</li>
}

<!-- ❌ Proibido -->
<span *ngIf="user">{{ user.name }}</span>
<li *ngFor="let item of items">{{ item.name }}</li>
```

---

## Roteamento

```typescript
// app.routes.ts — lazy loading obrigatório para features
export const routes: Routes = [
  {
    path: 'pagamentos',
    loadComponent: () => import('./pagamentos/pagamentos.component')
      .then(m => m.PagamentosComponent)
  }
];
```

---

## Acessibilidade (WCAG AA)

- Todos os elementos interativos devem ter `aria-label` ou texto visível
- Imagens devem ter `alt` descritivo
- Formulários devem ter `<label>` associado a cada `<input>`
- Contraste de cores mínimo 4.5:1 (normal) e 3:1 (large)

---

## Qualidade e Testes

- Cobertura mínima: **90%**
- Padrão: AAA (Arrange, Act, Assert)
- Signals em testes: usar `fixture.detectChanges()` após `component.signal.set(value)`
- HTTP em testes: `HttpTestingController` com `provideHttpClientTesting()`
- Vitest preferido: `vi.fn()` para mocks

---

## Regras de Ouro

1. **Siga o Plano:** Não invente componentes ou serviços fora da task list
2. **FILEPATH:** Todo arquivo gerado deve ter `// FILEPATH:` no topo
3. **Standalone obrigatório:** Nunca gere `NgModule`
4. **Signals primeiro:** Prefira `signal()` a `BehaviorSubject` para estado local
5. **httpResource primeiro:** Prefira `httpResource()` a `http.get()` direto
6. **OnPush sempre:** Todo componente deve ter `changeDetection: ChangeDetectionStrategy.OnPush`
7. **inject() pattern:** Nunca use parâmetros no construtor para DI
8. **Acessibilidade:** Aplique WCAG AA em todos os elementos interativos
