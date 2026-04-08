# FormBuilder Patterns

## FormGroups Aninhados

```typescript
@Component({
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Nome" />
      
      <div formGroupName="address">
        <input formControlName="street" placeholder="Rua" />
        <input formControlName="city" placeholder="Cidade" />
        <input formControlName="zip" placeholder="CEP" />
      </div>
      
      <button type="submit">Enviar</button>
    </form>
  `,
})
export class ProfileComponent {
  private fb = inject(NonNullableFormBuilder);
  
  form = this.fb.group({
    name: ['', Validators.required],
    address: this.fb.group({
      street: [''],
      city: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    }),
  });
}
```
