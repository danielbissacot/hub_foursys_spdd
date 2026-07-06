---
name: 'angular-httpresource'
description: "Guia completo para httpResource() e resource() como substitutos modernos de HttpClient em Angular v20+. Cobre declaração reativa, estado de loading/error/value, request builder com parâmetros dinâmicos, refresh, abort e tratamento de erros tipados. Use como primeira opção para qualquer chamada HTTP em componentes Angular v19.2+."
metadata:
  version: "0.1.0"
---

# Skill: angular-httpresource

Guia completo para **`httpResource()`** e **`resource()`** — a API de HTTP declarativa e reativa do Angular v19.2+.

> `httpResource()` é a **primeira opção** para HTTP em componentes Angular. Use `HttpClient` diretamente somente em services para lógica complexa com RxJS.

---

## Quando usar

- Buscar dados em uma API REST a partir de um componente.
- Dados que dependem de parâmetros reativos (IDs, filtros, queries que mudam).
- Mostrar estados de carregamento/erro/sucesso de forma declarativa no template.

## Quando não usar

- Chamadas POST/PUT/DELETE que são ações do usuário → use `HttpClient` no service via `inject()`.
- Lógica com múltiplos operadores RxJS (`switchMap`, `combineLatest`, etc.) → mantenha RxJS.
- Chamadas que precisam de retry customizado complexo → use RxJS + `toSignal()`.

---

## httpResource() — busca simples

```typescript
import { httpResource } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (produto.isLoading()) { <span>Carregando...</span> }
    @if (produto.error()) { <span>Erro ao carregar produto</span> }
    @if (produto.value(); as p) {
      <h1>{{ p.nome }}</h1>
      <p>R$ {{ p.preco | currency:'BRL' }}</p>
    }
  `
})
export class ProdutoComponent {
  readonly produtoId = input.required<number>();

  // Reativo: re-busca automaticamente quando produtoId muda
  protected readonly produto = httpResource<Produto>(
    () => `/api/produtos/${this.produtoId()}`
  );
}
```

---

## httpResource() com parâmetros e headers

```typescript
// Request builder completo
protected readonly pedidos = httpResource<Pedido[]>(() => ({
  url: '/api/pedidos',
  params: {
    status: this.filtroStatus(),
    page: this.pagina(),
    size: 20
  },
  headers: {
    'X-Correlation-Id': crypto.randomUUID()
  }
}));

// Condicional — não busca se filtro estiver vazio
protected readonly busca = httpResource<Produto[]>(() =>
  this.termo().length >= 3
    ? `/api/produtos/busca?q=${this.termo()}`
    : undefined  // undefined cancela a requisição
);
```

---

## Refresh manual

```typescript
protected readonly usuario = httpResource<Usuario>(() => `/api/me`);

protected atualizar() {
  this.usuario.reload();
}
```

---

## resource() — para lógica assíncrona customizada (não HTTP)

```typescript
// Quando a fonte não é HTTP mas segue o mesmo padrão reativo:
protected readonly dadosLocalStorage = resource({
  request: () => this.chave(),
  loader: async ({ request: chave, abortSignal }) => {
    await new Promise(r => setTimeout(r, 100));
    return JSON.parse(localStorage.getItem(chave) ?? 'null');
  }
});
```

---

## Tipos de Estado

| Propriedade | Tipo | Descrição |
|---|---|---|
| `.value()` | `T \| undefined` | Dado retornado (undefined enquanto carrega ou em erro) |
| `.isLoading()` | `boolean` | `true` durante requisição em andamento |
| `.error()` | `unknown` | Erro lançado pelo loader (null se nenhum) |
| `.status()` | `ResourceStatus` | `Idle`, `Loading`, `Refreshing`, `Resolved`, `Error`, `Local` |

---

## Tratamento de Erros tipado

```typescript
protected readonly produto = httpResource<Produto>(
  () => `/api/produtos/${this.produtoId()}`
);

// No template:
@if (produto.error(); as err) {
  @if (isHttpErrorResponse(err) && err.status === 404) {
    <app-empty-state mensagem="Produto não encontrado" />
  } @else {
    <app-error-state mensagem="Erro inesperado" />
  }
}
```

---

## Padrão com valor inicial (evitar undefined)

```typescript
protected readonly itens = httpResource<Produto[]>({
  request: () => `/api/produtos`,
  defaultValue: []  // valor antes do carregamento
});

// itens.value() nunca é undefined — começa como []
```

---

## Integração com Formulário Reativo

```typescript
@Component({...})
export class BuscaComponent {
  protected readonly termo = signal('');

  // httpResource rastreia o signal — debounce via computed
  private readonly termoBusca = computed(() => this.termo());

  protected readonly resultados = httpResource<Produto[]>(() =>
    this.termoBusca().length >= 3
      ? `/api/produtos/busca?q=${encodeURIComponent(this.termoBusca())}`
      : undefined
  );

  protected onInput(event: Event) {
    this.termo.set((event.target as HTMLInputElement).value);
  }
}
```

---

## Checklist de Uso

- [ ] `httpResource()` como primeira opção para GET em componentes
- [ ] Request builder (`() => url`) para parâmetros reativos
- [ ] `undefined` para cancelar requisição condicionalmente
- [ ] `defaultValue` para evitar `undefined` inicial
- [ ] `.isLoading()`, `.error()`, `.value()` usados no template
- [ ] `.reload()` para refresh manual
- [ ] `resource()` para lógica assíncrona não-HTTP
- [ ] `ChangeDetectionStrategy.OnPush` no componente
