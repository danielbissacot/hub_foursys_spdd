# Padrões de Comunicação entre Componentes

## Pai para Filho (Inputs)

```typescript
// Pai
@Component({
  template: `<app-child [data]="parentData()" [config]="config" />`,
})
export class ParentComponent {
  parentData = signal({ name: 'Test' });
  config = { theme: 'dark' };
}

// Filho
@Component({ selector: 'app-child' })
export class ChildComponent {
  data = input.required<Data>();
  config = input<Config>();
}
```

## Filho para Pai (Outputs)

```typescript
// Filho
@Component({
  selector: 'app-child',
  template: `<button (click)="save()">Salvar</button>`,
})
export class ChildComponent {
  saved = output<Data>();
  
  save() {
    this.saved.emit({ id: 1, name: 'Item' });
  }
}

// Pai
@Component({
  template: `<app-child (saved)="onSave($event)" />`,
})
export class ParentComponent {
  onSave(data: Data) {
    console.log('Saved:', data);
  }
}
```

## Padrão de Serviço Compartilhado

```typescript
// Serviço de estado compartilhado
@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);
  
  readonly items$ = this.items.asReadonly();
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

// Componente A
@Component({ template: `<button (click)="add()">Adicionar</button>` })
export class ProductComponent {
  private cart = inject(CartService);
  product = input.required<Product>();
  
  add() {
    this.cart.addItem({ ...this.product(), quantity: 1 });
  }
}

// Componente B
@Component({ template: `<span>Total: {{ cart.total() }}</span>` })
export class CartSummaryComponent {
  cart = inject(CartService);
}
```