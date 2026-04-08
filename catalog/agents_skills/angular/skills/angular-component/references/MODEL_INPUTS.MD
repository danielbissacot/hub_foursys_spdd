# Model Inputs (Signal-based Two-way Binding)

A partir do Angular v17.2+, a API `model()` simplifica drasticamente a sincronização de dados entre componentes Pai e Filho, fornecendo um mecanismo de **Two-way Binding nativo** baseado em Signals.

## Por que usar Model Inputs?

Diferente do `input()`, que é apenas leitura para o componente filho, o `model()` permite que o filho emita novos valores que atualizam automaticamente a fonte de dados no pai, mantendo ambos em perfeita sincronia sem a necessidade de definir um `output()` manual.

## Exemplo de Implementação

### Componente Filho (Custom Toggle)

```typescript
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-custom-toggle',
  standalone: true,
  template: `
    <button (click)="toggle()">
      Status: {{ checked() ? 'Ativo' : 'Inativo' }}
    </button>
  `,
})
export class CustomToggleComponent {
  // Define o model input (aceita leitura e escrita)
  checked = model(false);

  toggle() {
    // Atualiza o valor. Isso emitirá automaticamente o evento 'checkedChange'
    this.checked.set(!this.checked());
  }
}
```

### Componente Pai

```typescript
import { Component, signal } from '@angular/core';
import { CustomToggleComponent } from './custom-toggle.component';

@Component({
  standalone: true,
  imports: [CustomToggleComponent],
  template: `
    <!-- Uso do Banana-in-a-box [()] com Signals -->
    <app-custom-toggle [(checked)]="isAdmin" />
    
    <p>O administrador está logado? {{ isAdmin() }}</p>
  `,
})
export class ParentComponent {
  isAdmin = signal(false);
}
```

## Configurações e Opções

```typescript
// Model obrigatório
value = model.required<string>();

// Model com alias para o template
quantity = model(0, { alias: 'count' });

// Lendo o valor no filho
console.log(this.quantity());

// Atualizando o valor no filho (notifica o pai)
this.quantity.set(10);
this.quantity.update(q => q + 1);
```

---
> [!IMPORTANT]
> **Sincronia Automática**: Ao usar `value = model()`, o Angular cria por baixo dos panos um input reativo e um output chamado `valueChange`. Isso é o que permite a sintaxe `[(value)]` funcionar perfeitamente com Signals.

