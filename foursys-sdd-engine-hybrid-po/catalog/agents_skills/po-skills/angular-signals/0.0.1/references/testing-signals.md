# Testing Signals

```typescript
describe('CounterComponent', () => {
  it('deve incrementar o count', () => {
    const component = new CounterComponent();
    
    expect(component.count()).toBe(0);
    
    component.increment();
    expect(component.count()).toBe(1);
    
    component.increment();
    expect(component.count()).toBe(2);
  });
  
  it('deve computar o valor dobrado', () => {
    const component = new CounterComponent();
    
    expect(component.doubled()).toBe(0);
    
    component.count.set(5);
    expect(component.doubled()).toBe(10);
  });
});

describe('ProductStore', () => {
  let store: ProductStore;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductStore],
      imports: [HttpClientTestingModule],
    });
    
    store = TestBed.inject(ProductStore);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('deve filtrar produtos', () => {
    // Define o estado inicial
    store['state'].set({
      products: [
        { id: '1', name: 'Apple' },
        { id: '2', name: 'Banana' },
      ],
      selectedId: null,
      filter: '',
      loading: false,
      error: null,
    });
    
    expect(store.filteredProducts().length).toBe(2);
    
    store.setFilter('app');
    expect(store.filteredProducts().length).toBe(1);
    expect(store.filteredProducts()[0].name).toBe('Apple');
  });
});
```

## Debugging de Signals

```typescript
// Effect para debugar e logar mudanças de signal
effect(() => {
  console.log('State changed:', {
    count: this.count(),
    items: this.items(),
    filter: this.filter(),
  });
});

// Debug condicional
const DEBUG = signal(false);

effect(() => {
  if (untracked(() => DEBUG())) {
    console.log('Debug:', this.state());
  }
});
```
