# Reactive Forms (Production-Stable)

Para aplicações em produção que exigem garantias de estabilidade, utilize Reactive Forms:

```typescript
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" />
      @if (form.controls.email.errors?.['required'] && form.controls.email.touched) {
        <span class="error">Email é obrigatório</span>
      }
      
      <input type="password" formControlName="password" />
      
      <button type="submit" [disabled]="form.invalid">Entrar</button>
    </form>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```