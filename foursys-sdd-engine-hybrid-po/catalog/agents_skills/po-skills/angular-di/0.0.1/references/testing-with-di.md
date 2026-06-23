# Testando com DI

## Mockando Serviços

```typescript
describe('UserComponent', () => {
  let userServiceSpy: jasmine.SpyObj<UserService>;
  
  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser', 'updateUser']);
    userServiceSpy.getUser.and.returnValue(of({ id: '1', name: 'Test' }));
    
    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();
  });
  
  it('deve carregar usuário', () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    
    expect(userServiceSpy.getUser).toHaveBeenCalled();
  });
});
```

## Substituindo Providers

```typescript
describe('com configuração diferente', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    })
    .overrideProvider(APP_CONFIG, {
      useValue: { apiUrl: 'http://test-api.com' },
    })
    .compileComponents();
  });
});
```

## Testando Tokens de Injeção

```typescript
describe('API_URL token', () => {
  it('deve fornecer URL correta', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: API_URL, useValue: 'https://api.test.com' },
      ],
    });
    
    const apiUrl = TestBed.inject(API_URL);
    expect(apiUrl).toBe('https://api.test.com');
  });
});
```
