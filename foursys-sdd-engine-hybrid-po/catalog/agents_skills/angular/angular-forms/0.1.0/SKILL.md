---
name: 'angular-forms'
description: "Guia completo para formulários Angular v20+ com Reactive Forms e Signal-based Forms (v21+). Cobre FormControl com Signals, FormGroup, validadores síncronos e assíncronos, tipagem estrita, formulários dinâmicos, feedback de erros ao usuário e acessibilidade WCAG AA. Use para qualquer formulário em componentes Angular standalone."
metadata:
  version: "0.1.0"
---

# Skill: angular-forms

Guia completo para **formulários Angular v20+** com Reactive Forms e Signal-based Forms.

---

## Quando usar

- Qualquer formulário com validação de negócio.
- Formulários com campos dinâmicos ou condicionais.
- Validação assíncrona (ex: verificar disponibilidade no backend).

## Quando não usar

- Template-driven forms com `[(ngModel)]` — proibido em projetos Foursys SDD.
- Formulários de uma única entrada simples → use `signal()` direto sem FormControl.

---

## Reactive Forms com Tipagem Estrita

```typescript
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label for="nome">Nome *</label>
      <input id="nome" formControlName="nome" aria-describedby="nome-erro" />
      @if (form.controls.nome.invalid && form.controls.nome.touched) {
        <span id="nome-erro" role="alert">
          @if (form.controls.nome.hasError('required')) { Nome é obrigatório }
          @if (form.controls.nome.hasError('minlength')) { Mínimo 3 caracteres }
        </span>
      }

      <button type="submit" [disabled]="form.invalid">Salvar</button>
    </form>
  `
})
export class CadastroProdutoComponent {
  protected readonly form = new FormGroup({
    nome:  new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    valor: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0.01)] }),
    ativo: new FormControl(true, { nonNullable: true })
  });

  protected onSubmit() {
    if (this.form.invalid) return;
    const dados = this.form.getRawValue(); // tipado com inferência correta
    // ...
  }
}
```

---

## Signal-based Forms (Angular v21+ experimental)

```typescript
// Forma nativa com Signals (experimental — verificar disponibilidade)
import { signalForm, requiredValidator } from '@angular/forms/signals';

protected readonly form = signalForm({
  nome: signalField('', [requiredValidator()]),
  email: signalField('', [requiredValidator(), emailValidator()])
});

// form.nome.value() — Signal<string>
// form.nome.errors() — Signal<ValidationErrors | null>
// form.valid() — Signal<boolean>
```

---

## Validadores Customizados

```typescript
// Validador síncrono
function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = control.value?.replace(/\D/g, '');
    if (!cpf || cpf.length !== 11) return { cpfInvalido: true };
    return null;
  };
}

// Validador assíncrono (verificar no backend)
function emailDisponivel(service: UsuarioService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(400).pipe(  // debounce de 400ms
      switchMap(() => service.verificarEmail(control.value)),
      map(disponivel => disponivel ? null : { emailIndisponivel: true }),
      catchError(() => of(null))
    );
  };
}
```

Uso:
```typescript
email: new FormControl('', {
  validators: [Validators.required, Validators.email],
  asyncValidators: [emailDisponivel(this.usuarioService)],
  updateOn: 'blur'  // validar ao sair do campo
})
```

---

## FormArray para campos dinâmicos

```typescript
protected readonly form = new FormGroup({
  nome: new FormControl('', { nonNullable: true }),
  telefones: new FormArray<FormControl<string>>([])
});

get telefones() {
  return this.form.controls.telefones;
}

adicionarTelefone() {
  this.telefones.push(
    new FormControl('', { nonNullable: true, validators: [Validators.pattern(/^\d{10,11}$/)] })
  );
}

removerTelefone(index: number) {
  this.telefones.removeAt(index);
}
```

Template:
```html
<div formArrayName="telefones">
  @for (ctrl of telefones.controls; track $index; let i = $index) {
    <input [formControlName]="i" placeholder="Telefone {{ i + 1 }}" />
    <button type="button" (click)="removerTelefone(i)" aria-label="Remover telefone {{ i + 1 }}">-</button>
  }
  <button type="button" (click)="adicionarTelefone()">+ Adicionar telefone</button>
</div>
```

---

## Acessibilidade WCAG AA Obrigatória

```html
<!-- ✅ label associado via for/id + aria-describedby no erro -->
<label for="valor">Valor *</label>
<input
  id="valor"
  type="number"
  formControlName="valor"
  aria-describedby="valor-erro"
  [attr.aria-invalid]="form.controls.valor.invalid && form.controls.valor.touched"
/>
@if (form.controls.valor.invalid && form.controls.valor.touched) {
  <span id="valor-erro" role="alert" aria-live="polite">
    Valor é obrigatório e deve ser maior que zero
  </span>
}
```

---

## Integração com Signals (toSignal)

```typescript
// Observar mudanças no formulário como Signal
protected readonly formValue = toSignal(this.form.valueChanges, {
  initialValue: this.form.getRawValue()
});

// Status do formulário como Signal
protected readonly isValid = toSignal(
  this.form.statusChanges.pipe(map(s => s === 'VALID')),
  { initialValue: false }
);
```

---

## Checklist de Uso

- [ ] `nonNullable: true` em `FormControl` quando o campo não pode ser `null`
- [ ] Validadores síncronos definidos na criação do `FormControl`
- [ ] Validadores assíncronos com debounce de 400ms (`timer(400).pipe(switchMap(...))`)
- [ ] `updateOn: 'blur'` para validação assíncrona custosa
- [ ] Verificar `form.invalid` antes de processar submit
- [ ] `getRawValue()` (não `value`) para obter todos os campos tipados
- [ ] `aria-describedby` apontando para span de erro
- [ ] `role="alert"` e `aria-live="polite"` nas mensagens de erro
- [ ] `[attr.aria-invalid]` no input quando inválido e tocado
- [ ] `ChangeDetectionStrategy.OnPush` no componente
