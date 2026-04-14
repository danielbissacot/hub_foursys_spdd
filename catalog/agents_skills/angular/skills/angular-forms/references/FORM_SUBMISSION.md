# Form Submission Pattern

```typescript
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <!-- campos -->
      <button type="submit" [disabled]="form.invalid || isSubmitting">
        {{ isSubmitting ? 'Enviando...' : 'Enviar' }}
      </button>
    </form>
  `,
})
export class FormComponent {
  isSubmitting = false;
  
  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    try {
      await this.api.submit(this.form.getRawValue());
      this.form.reset();
    } catch (error) {
      // Tratar erro
    } finally {
      this.isSubmitting = false;
    }
  }
}
```
