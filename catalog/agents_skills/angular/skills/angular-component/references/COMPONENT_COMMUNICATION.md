# Padrões de Comunicação entre Componentes

Este guia detalha as formas modernas de comunicação no Angular v18+, priorizando a reatividade nativa com **Signals** e a injeção de dependência moderna.

## 1. Pai para Filho (Inputs baseados em Signals)

O uso de `input.required()` e `input()` garante que os dados sejam reativos e tipados de forma mais precisa que o decorador `@Input` legado.

```typescript
// Componente Pai
@Component({
  standalone: true,
  imports: [ChildComponent],
  template: `<app-child [data]="parentData()" [config]="config" />`,
})
export class ParentComponent {
  parentData = signal({ name: 'Exemplo de Dados' });
  config = { theme: 'dark' };
}

// Componente Filho
@Component({ 
  selector: 'app-child',
  standalone: true 
})
export class ChildComponent {
  // Input obrigatório (reativo)
  data = input.required<Data>();
  
  // Input opcional com valor default
  config = input<Config>({ theme: 'light' });
}
```

## 2. Filho para Pai (Signal-based Outputs)

A nova API de `output()` substitui o `EventEmitter` de forma mais leve e integrada com o ecossistema de Signals.

```typescript
// Componente Filho
@Component({
  selector: 'app-child',
  standalone: true,
  template: `<button (click)="save()">Salvar Alterações</button>`,
})
export class ChildComponent {
  saved = output<Data>();
  
  save() {
    this.saved.emit({ id: 1, name: 'Item Processado' });
  }
}

// Componente Pai
@Component({
  standalone: true,
  imports: [ChildComponent],
  template: `<app-child (saved)="onSave($event)" />`,
})
export class ParentComponent {
  onSave(data: Data) {
    console.log('Dados recebidos do filho:', data);
  }
}
```

## 3. Padrão de Serviço Compartilhado (Estado Reativo)

Para comunicação entre componentes distantes ou gerenciamento de estado global, utilize serviços com **Signals**.

```typescript
import { Injectable, signal, computed, inject } from '@angular/core';

// Serviço de estado compartilhado (Cart)
@Injectable({ providedIn: 'root' })
export class CartService {
  // Privado para controle de escrita
  private items = signal<CartItem[]>([]);
  
  // Público apenas para leitura (ReadOnly)
  readonly items$ = this.items.asReadonly();
  
  // Estado computado reativo
  readonly total = computed(() => 
    this.items().reduce((sum, item) => sum + item.price, 0)
  );
  
  addItem(item: CartItem) {
    this.items.update(items => [...items, item]);
  }
  
  removeItem(id: string) {
    this.items.update(items => items.filter(i => i.id !== id));
  }
}

// Exemplo de Injeção Moderna com inject()
@Component({ 
  selector: 'app-cart-summary',
  standalone: true,
  template: `<span>Total do Carrinho: {{ cart.total() | currency }}</span>` 
})
export class CartSummaryComponent {
  // Uso do inject() em vez do construtor
  protected cart = inject(CartService);
}
```

---
> [!TIP]
> **Performance**: Ao utilizar `asReadonly()` em serviços de estado, você garante que os componentes consumidores não manipulem o estado diretamente, forçando o uso de métodos do serviço (`addItem`, `removeItem`) e mantendo a previsibilidade do fluxo de dados (Unidirectional Data Flow).

