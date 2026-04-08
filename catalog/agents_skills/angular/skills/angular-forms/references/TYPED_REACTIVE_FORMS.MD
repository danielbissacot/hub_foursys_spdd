# Typed Reactive Forms

## FormControl tipado

```typescript
import { FormControl } from '@angular/forms';

// Tipo inferido: FormControl<string | null>
const name = new FormControl('');

// Non-nullable (não permite reset para null)
const email = new FormControl('', { nonNullable: true });
// Tipo: FormControl<string>

// Com validators
const username = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required, Validators.minLength(3)],
});
```

## FormGroup tipado

```typescript
import { FormGroup, FormControl } from '@angular/forms';

interface UserForm {
  name: FormControl<string>;
  email: FormControl<string>;
  age: FormControl<number | null>;
}

const form = new FormGroup<UserForm>({
  name: new FormControl('', { nonNullable: true }),
  email: new FormControl('', { nonNullable: true }),
  age: new FormControl<number | null>(null),
});

// Acesso ao valor tipado
const name: string = form.controls.name.value;
```

## NonNullableFormBuilder

```typescript
import { inject } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';

@Component({...})
export class ProfileComponent {
  private fb = inject(NonNullableFormBuilder);
  
  form = this.fb.group({
    name: ['', Validators.required],           // FormControl<string>
    email: ['', [Validators.required, Validators.email]],
    preferences: this.fb.group({
      newsletter: [false],                      // FormControl<boolean>
      theme: ['light' as 'light' | 'dark'],    // FormControl<'light' | 'dark'>
    }),
  });
}
```
