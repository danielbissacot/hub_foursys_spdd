# Custom Validators

## Validador síncrono

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenValue(forbidden: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value === forbidden 
      ? { forbiddenValue: { value: control.value } } 
      : null;
  };
}

// Uso
name: ['', [Validators.required, forbiddenValue('admin')]],
```

## Validador entre campos

```typescript
export function passwordMatch(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  };
}

// Uso
form = this.fb.group({
  password: ['', [Validators.required, Validators.minLength(8)]],
  confirmPassword: ['', Validators.required],
}, { validators: passwordMatch() });
```

## Validador assíncrono

```typescript
import { AsyncValidatorFn } from '@angular/forms';
import { map, catchError, of } from 'rxjs';

export function uniqueEmail(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return userService.checkEmail(control.value).pipe(
      map(exists => exists ? { emailTaken: true } : null),
      catchError(() => of(null))
    );
  };
}

// Uso
email: ['', 
  [Validators.required, Validators.email],  // validators síncronos
  [uniqueEmail(this.userService)]            // validators assíncronos
],
```
