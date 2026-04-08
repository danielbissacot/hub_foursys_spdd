# Form State Management

## Propriedades de Estado

```typescript
// Verificar estados
form.valid      // Todas as validações passaram
form.invalid    // Possui erros de validação
form.pending    // Validação assíncrona em progresso
form.dirty      // Valor alterado pelo usuário
form.pristine   // Valor não alterado
form.touched    // Controle foi focado
form.untouched  // Controle nunca foi focado

// Atualizar valores
form.setValue({ name: 'John', email: 'john@example.com' }); // Deve incluir todos os campos
form.patchValue({ name: 'John' }); // Atualização parcial

// Reset
form.reset();
form.reset({ name: 'Default' });

// Desabilitar/Habilitar
form.disable();
form.enable();
form.controls.email.disable();

// Marcar estados
form.markAllAsTouched(); // Exibe todos os erros
form.markAsPristine();
form.markAsDirty();
```

## Observable de Mudanças de Valor

```typescript
// Subscribe em mudanças de valor
form.valueChanges.subscribe(value => {
  console.log('Valor do formulário:', value);
});

// Controle único com debounce
form.controls.email.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged()
).subscribe(email => {
  this.validateEmail(email);
});

// Mudanças de status
form.statusChanges.subscribe(status => {
  console.log('Status do formulário:', status); // VALID, INVALID, PENDING
});
```

## Eventos Unificados (Angular v21+)

```typescript
import { 
  ValueChangeEvent, StatusChangeEvent, 
  FormSubmittedEvent, FormResetEvent 
} from '@angular/forms';

form.events.subscribe(event => {
  if (event instanceof ValueChangeEvent) {
    console.log('Valor alterado:', event.value);
  }
  if (event instanceof StatusChangeEvent) {
    console.log('Status alterado:', event.status);
  }
  if (event instanceof FormSubmittedEvent) {
    console.log('Formulário submetido');
  }
  if (event instanceof FormResetEvent) {
    console.log('Formulário resetado');
  }
});
```
