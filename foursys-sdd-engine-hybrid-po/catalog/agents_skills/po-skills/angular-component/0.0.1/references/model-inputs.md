# Model Inputs (Two-Way Binding)

Para binding bidirecional com a sintaxe `[(value)]`:

```typescript
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-slider',
  host: {
    '(input)': 'onInput($event)',
  },
  template: `
    <input 
      type="range" 
      [value]="value()" 
      [min]="min()" 
      [max]="max()" 
    />
    <span>{{ value() }}</span>
  `,
})
export class SliderComponent {
  // Model cria tanto input quanto output
  value = model(0);
  min = input(0);
  max = input(100);
  
  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(Number(target.value));
  }
}

// Uso: <app-slider [(value)]="sliderValue" />
```

Model obrigatório:

```typescript
value = model.required<number>();
```