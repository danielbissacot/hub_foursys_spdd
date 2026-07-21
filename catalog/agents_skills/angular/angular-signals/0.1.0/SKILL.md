---
name: 'angular-signals'
description: "Guia completo para uso de Signals como primitivos de reatividade em Angular v20+. Cobre signal(), computed(), effect(), linkedSignal(), toSignal(), afterNextRender() e integração com httpResource(). Use quando precisar de estado local reativo, derivações computadas ou efeitos colaterais em componentes Angular v17+."
metadata:
  version: "0.1.0"
---

# Skill: angular-signals

Guia completo para **Signals** como primitivos de reatividade em Angular v17+ (estável v20+).

---

## Quando usar

- Gerenciar estado local de um componente (substituir `BehaviorSubject` / propriedades mutáveis).
- Derivar valores de outros sinais sem subscriptions manuais (`computed()`).
- Reagir a mudanças de sinais com efeitos colaterais (`effect()`).
- Integrar com `httpResource()` e dados assíncronos.

## Quando não usar

- Estado global compartilhado entre componentes não relacionados → use serviço com `signal()` injetável ou NgRx.
- Streams RxJS complexos com `mergeMap`, `switchMap`, etc. — mantenha RxJS para esses casos e converta no final com `toSignal()`.

---

## API de Signals

### signal() — estado mutável

```typescript
// Criação
readonly count = signal(0);
readonly usuario = signal<Usuario | null>(null);

// Leitura (sempre chamar como função)
console.log(this.count()); // 0

// Atualização
this.count.set(1);             // substituição total
this.count.update(v => v + 1); // baseado no valor anterior

// Uso no template
// {{ count() }}
```

---

### computed() — valor derivado (somente leitura)

```typescript
readonly total = computed(() => this.itens().reduce((s, i) => s + i.valor, 0));
readonly hasItens = computed(() => this.itens().length > 0);
readonly nomeCompleto = computed(() => `${this.nome()} ${this.sobrenome()}`);

// NUNCA chame set/update em computed — é readonly
```

---

### effect() — efeitos colaterais

```typescript
constructor() {
  effect(() => {
    // rastreia automaticamente os sinais lidos aqui
    console.log('count mudou para:', this.count());
    this.salvarPreferencia(this.count());
  });
}

// Para limpeza de recursos:
effect((onCleanup) => {
  const timer = setInterval(() => this.refresh(), 5000);
  onCleanup(() => clearInterval(timer));
});
```

---

### linkedSignal() — estado derivado mas mutável (Angular v19+)

```typescript
// Caso de uso: dado filtrado pelo usuário, mas que reseteia quando a lista muda
readonly items = signal<Item[]>([]);
readonly selectedItem = linkedSignal(() => this.items()[0] ?? null);

// Usuário pode mudar selectedItem manualmente
this.selectedItem.set(items[2]);
// Mas quando items() mudar, selectedItem reseta para items()[0]
```

---

### toSignal() — converter Observable em Signal

```typescript
// Para Observables que não se encaixam em httpResource:
readonly isDark = toSignal(this.themeService.isDark$, { initialValue: false });

// Com requireSync para observables que emitem imediatamente:
readonly locale = toSignal(this.i18n.locale$, { requireSync: true });
```

---

### afterNextRender() / afterRender() — efeitos após renderização

```typescript
constructor() {
  afterNextRender(() => {
    // seguro para acessar DOM após renderização
    this.chart = new Chart(this.canvasRef.nativeElement, this.chartConfig());
  });
}
```

---

## Integração com httpResource()

```typescript
// httpResource() retorna um Signal com estado loading/error/value
readonly userId = signal(1);
readonly user = httpResource<Usuario>(() => `/api/users/${this.userId()}`);

// No template:
// @if (user.isLoading()) { <span>Carregando...</span> }
// @if (user.error()) { <span>Erro: {{ user.error()?.message }}</span> }
// @if (user.value()) { <span>{{ user.value()!.nome }}</span> }
```

---

## Regras de Visibilidade

```typescript
@Component({...})
export class MeuComponent {
  // ✅ Correto — protected para template acesso
  protected readonly count = signal(0);
  protected readonly total = computed(() => this.count() * 2);

  // ❌ Errado — private não é acessível no template
  private readonly count = signal(0);
}
```

---

## Padrão Completo: Componente com Signals

```typescript
@Component({
  selector: 'app-carrinho',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <p>Total: {{ total() | currency:'BRL' }}</p>
    <button (click)="adicionarItem()">Adicionar</button>
    @for (item of itens(); track item.id) {
      <li>{{ item.nome }} — {{ item.valor | currency:'BRL' }}</li>
    }
  `
})
export class CarrinhoComponent {
  protected readonly itens = signal<Item[]>([]);
  protected readonly total = computed(() =>
    this.itens().reduce((soma, item) => soma + item.valor, 0)
  );

  constructor() {
    effect(() => {
      sessionStorage.setItem('carrinho', JSON.stringify(this.itens()));
    });
  }

  protected adicionarItem() {
    this.itens.update(atual => [...atual, { id: Date.now(), nome: 'Novo Item', valor: 10 }]);
  }
}
```

---

## Checklist de Uso

- [ ] `signal()` para estado local (não `BehaviorSubject`)
- [ ] `computed()` para derivações (não recalcular no template)
- [ ] `effect()` para efeitos colaterais (não `ngOnChanges` simples)
- [ ] `linkedSignal()` para estado derivado mutável (Angular v19+)
- [ ] `toSignal()` apenas para Observables existentes
- [ ] Visibilidade `protected` nos signals usados no template
- [ ] `ChangeDetectionStrategy.OnPush` obrigatório no componente
