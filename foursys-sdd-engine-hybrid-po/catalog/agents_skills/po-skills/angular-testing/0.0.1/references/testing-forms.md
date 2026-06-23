# Testando Formulários

## Formulários com Signals

```typescript
import { form, FormField, required, email } from '@angular/forms/signals';

@Component({
  imports: [FormField],
  template: `
    <form (submit)="onSubmit($event)">
      <input [formField]="loginForm.email" />
      <input [formField]="loginForm.password" type="password" />
      <button type="submit" [disabled]="loginForm().invalid()">Submit</button>
    </form>
  `,
})
export class LoginComponent {
  model = signal({ email: '', password: '' });
  loginForm = form(this.model, (schemaPath) => {
    required(schemaPath.email);
    email(schemaPath.email);
    required(schemaPath.password);
  });
  
  submitted = signal(false);
  
  onSubmit(event: Event) {
    event.preventDefault();
    if (this.loginForm().valid()) {
      this.submitted.set(true);
    }
  }
}

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
    }).compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should be invalid when empty', () => {
    expect(component.loginForm().invalid()).toBeTrue();
  });
  
  it('should be valid with correct data', () => {
    component.model.set({
      email: 'test@example.com',
      password: 'password123',
    });
    
    expect(component.loginForm().valid()).toBeTrue();
  });
  
  it('should show email error for invalid email', () => {
    component.loginForm.email().value.set('invalid');
    fixture.detectChanges();
    
    expect(component.loginForm.email().invalid()).toBeTrue();
    expect(component.loginForm.email().errors().some(e => e.kind === 'email')).toBeTrue();
  });
  
  it('should disable submit button when invalid', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();
  });
});
```

## Testing Reactive Forms

```typescript
describe('ReactiveFormComponent', () => {
  it('should validate form', () => {
    const fixture = TestBed.createComponent(ProfileFormComponent);
    const component = fixture.componentInstance;
    
    expect(component.form.valid).toBeFalse();
    
    component.form.patchValue({
      name: 'John',
      email: 'john@example.com',
    });
    
    expect(component.form.valid).toBeTrue();
  });
  
  it('should show validation errors', () => {
    const fixture = TestBed.createComponent(ProfileFormComponent);
    fixture.detectChanges();
    
    const emailControl = fixture.componentInstance.form.controls.email;
    emailControl.setValue('invalid');
    emailControl.markAsTouched();
    fixture.detectChanges();
    
    const errorElement = fixture.nativeElement.querySelector('.error');
    expect(errorElement.textContent).toContain('Invalid email');
  });
});
```
