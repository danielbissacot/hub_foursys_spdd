# Estado de Formulário com Signals

```typescript
interface FormState<T> {
  value: T;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  errors: string[];
}

function createFormField<T>(
  initialValue: T,
  validators: ((value: T) => string | null)[] = []
) {
  const value = signal(initialValue);
  const touched = signal(false);
  const dirty = signal(false);
  
  const errors = computed(() => {
    return validators
      .map(v => v(value()))
      .filter((e): e is string => e !== null);
  });
  
  const valid = computed(() => errors().length === 0);
  
  return {
    value,
    touched: touched.asReadonly(),
    dirty: dirty.asReadonly(),
    errors,
    valid,
    
    setValue(newValue: T) {
      value.set(newValue);
      dirty.set(true);
    },
    
    markTouched() {
      touched.set(true);
    },
    
    reset() {
      value.set(initialValue);
      touched.set(false);
      dirty.set(false);
    },
  };
}

// Exemplo de uso
@Component({...})
export class SignupComponent {
  email = createFormField('', [
    v => !v ? 'Email é obrigatório' : null,
    v => !v.includes('@') ? 'Email inválido' : null,
  ]);
  
  password = createFormField('', [
    v => !v ? 'Senha é obrigatória' : null,
    v => v.length < 8 ? 'A senha deve ter pelo menos 8 caracteres' : null,
  ]);
  
  formValid = computed(() => 
    this.email.valid() && this.password.valid()
  );
}
```

