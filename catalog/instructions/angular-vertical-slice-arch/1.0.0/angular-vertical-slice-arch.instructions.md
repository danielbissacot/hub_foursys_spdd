---
name: 'angular-vertical-slice-arch'
description: "Regras de arquitetura Angular (v18+) sempre-ativas para o GitHub Copilot. Instaladas pelo Hub em .github/instructions/ do workspace, fazem o Copilot seguir os padrões Foursys (Standalone, Signals, OnPush, inject(), Vertical Slice) em qualquer contexto — sem precisar rodar uma fase SDD. A versão fica na pasta (1.0.0/), não no frontmatter: instructions do Copilot só aceitam name, description e applyTo."
applyTo: "**/*.ts,**/*.html,**/*.scss"
---

# Arquitetura Angular (v18+) — Regras Foursys SDD

Estas instruções são aplicadas automaticamente pelo GitHub Copilot em qualquer workspace Angular identificado.

---

## ⚠️ ANTES DE TUDO: confira a versão do Angular

**Leia `@angular/core` no `package.json` antes de aplicar as regras de HTTP e Forms.**

| Versão do projeto | O que muda |
|---|---|
| **v20 ou superior** | Aplique todas as regras abaixo |
| **v18 ou v19** | Standalone, `inject()`, `signal()` e `@if`/`@for` valem normalmente. **Não use `httpResource()` nem Signal Forms** — não existem nessas versões. Para HTTP use `HttpClient` (com `toSignal()` quando quiser signal); para formulários, Reactive Forms |

Todo o resto do documento vale em qualquer uma dessas versões: OnPush, `protected` no template,
acessibilidade WCAG AA, sem lógica no template, sem `subscribe()` sem descarte.

**Nunca proponha migrar a versão do Angular nem reescrever código que já funciona só para atender
a este documento.** Na dúvida entre o padrão daqui e o que já está no projeto, **siga o do projeto**
e comente a diferença em vez de impor.

---

## Stack Alvo (para código NOVO em projeto v20+)

> **Leia a arquitetura do projeto antes.** Existe `src/app/app.module.ts` e NÃO existe
> `src/app/app.config.ts`? Então o projeto é **NgModule**, isso está correto, e as regras de
> Standalone/Signals abaixo valem apenas como referência para código novo — nunca como motivo para
> recusar mexer no que existe, nem para propor migração.

- **Framework:** Angular v20+
- **Componentes:** Standalone para código novo. **Em projeto que já usa `NgModule`, declare o
  componente novo no módulo da feature, no padrão dos vizinhos** — `NgModule` não é erro, é a
  arquitetura vigente daquele projeto. Standalone e `NgModule` convivem desde a v15.
- **Reatividade:** Signals (`signal()`, `computed()`, `effect()`, `linkedSignal()`) como primitivos principais
- **HTTP:** `httpResource()` ou `resource()` como primeira opção **em v20+**; em v18/v19 use `HttpClient` (+ `toSignal()`), pois `httpResource()` não existe nessas versões
- **Change Detection:** `OnPush` em todo componente **novo**. Em componente existente sem OnPush, não altere só para adequar — mudar estratégia de detecção em código em produção pode quebrar comportamento.
- **Injeção de Dependência:** `inject()` em código novo. Em arquivo existente que já usa constructor injection, siga o padrão do arquivo — misturar os dois estilos na mesma classe é pior que qualquer um deles
- **Control Flow:** `@if`, `@for` com `track`, `@switch` em template novo. Em template existente que usa `*ngIf`/`*ngFor`, siga o padrão dele — não reescreva o arquivo só para trocar de sintaxe
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

### HTTP com httpResource — **somente em projeto v20+**

```typescript
// ✅ Correto EM v20+ — httpResource como primeira opção
readonly user = httpResource<User>(() => `/api/users/${this.userId()}`);

// Uso no template: user.value(), user.isLoading(), user.error()

// ❌ Desencorajado para novos componentes (v20+)
readonly user$ = this.http.get<User>(`/api/users/${id}`);
```

**Em projeto v18 ou v19** `httpResource()` não existe — use `HttpClient`, com `toSignal()` se
quiser um signal:

```typescript
// ✅ Correto em v18/v19
private readonly http = inject(HttpClient);
readonly user = toSignal(this.http.get<User>(`/api/users/${this.userId()}`));
```

### Injeção de Dependência

```typescript
// ✅ Correto
export class MyComponent {
  private readonly service = inject(MyService);
}

// ❌ Evite em código novo (mas mantenha se o arquivo existente já usa este estilo)
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

// ❌ NÃO crie um módulo novo só para declarar um componente novo
@NgModule({ declarations: [MyComponent] })
export class MyModule {}
// (Em projeto que JÁ é NgModule, declarar o componente novo no módulo de feature
//  que já existe é o certo — o errado acima é criar um módulo do zero.)
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

<!-- ❌ Evite em template novo (mantenha se o template existente já usa este estilo) -->
<span *ngIf="user">{{ user.name }}</span>
<li *ngFor="let item of items">{{ item.name }}</li>
```

---

## Roteamento

```typescript
// Arquivo de rotas do projeto (`app.routes.ts` em standalone, `app.routing.module.ts` em NgModule)
// Lazy loading para features
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
3. **Standalone em código novo:** prefira Standalone ao criar do zero. Em projeto `NgModule`, respeite o módulo existente e declare nele — nunca proponha migração de arquitetura sem pedido explícito
4. **Signals primeiro — se o projeto já os usa:** prefira `signal()` a `BehaviorSubject` para estado local. Em base 100% RxJS, não introduza Signals isolados: dois modelos de estado convivendo é pior que um só
5. **httpResource primeiro — só se o projeto for v20+:** confira `@angular/core` antes. Em v18/v19 use `HttpClient` (+ `toSignal()`), porque `httpResource()` não existe nessas versões
6. **OnPush sempre:** Todo componente deve ter `changeDetection: ChangeDetectionStrategy.OnPush`
7. **inject() pattern:** use em código novo; em arquivo que já usa construtor, mantenha o padrão dele
8. **Acessibilidade:** Aplique WCAG AA em todos os elementos interativos
