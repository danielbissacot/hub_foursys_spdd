# Testando Router

## RouterTestingHarness

```typescript
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';

describe('Router Navigation', () => {
  let harness: RouterTestingHarness;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: HomeComponent },
          { path: 'users/:id', component: UserComponent },
        ]),
      ],
    }).compileComponents();
    
    harness = await RouterTestingHarness.create();
  });
  
  it('should navigate to user page', async () => {
    const component = await harness.navigateByUrl('/users/123', UserComponent);
    
    expect(component.id()).toBe('123');
  });
  
  it('should display user name', async () => {
    await harness.navigateByUrl('/users/123');
    
    expect(harness.routeNativeElement?.textContent).toContain('User 123');
  });
});
```

## Testando Guards

```typescript
describe('AuthGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  
  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        provideRouter([
          { path: 'login', component: LoginComponent },
          { 
            path: 'dashboard', 
            component: DashboardComponent,
            canActivate: [authGuard],
          },
        ]),
      ],
    });
  });
  
  it('should allow access when authenticated', async () => {
    authService.isAuthenticated.and.returnValue(true);
    
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard');
    
    expect(harness.routeNativeElement?.textContent).toContain('Dashboard');
  });
  
  it('should redirect to login when not authenticated', async () => {
    authService.isAuthenticated.and.returnValue(false);
    
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard');
    
    expect(TestBed.inject(Router).url).toBe('/login');
  });
});
```

