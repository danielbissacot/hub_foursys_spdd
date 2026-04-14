# Error Display Pattern

```typescript
@Component({
  template: `
    <input formControlName="email" />
    
    @if (form.controls.email.invalid && form.controls.email.touched) {
      <div class="errors">
        @if (form.controls.email.errors?.['required']) {
          <span>Email é obrigatório</span>
        }
        @if (form.controls.email.errors?.['email']) {
          <span>Formato de email inválido</span>
        }
      </div>
    }
  `,
})
export class FormComponent {
  // Helper para templates mais limpos
  hasError(controlName: string, errorKey: string): boolean {
    const control = this.form.get(controlName);
    return control?.hasError(errorKey) && control?.touched || false;
  }
}
```
