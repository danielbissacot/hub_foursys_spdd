# Testes HTTP

## Testando httpResource

```typescript
describe('UserComponent', () => {
  let component: UserComponent;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [provideHttpClientTesting()],
    });
    
    component = TestBed.createComponent(UserComponent).componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should load user', () => {
    component.userId.set('123');
    
    const req = httpMock.expectOne('/api/users/123');
    req.flush({ id: '123', name: 'Test User' });
    
    expect(component.userResource.value()?.name).toBe('Test User');
  });
  
  afterEach(() => {
    httpMock.verify();
  });
});
```

# Testando Services

```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should create user', () => {
    const newUser = { name: 'Test', email: 'test@example.com' };
    
    service.create(newUser).subscribe(user => {
      expect(user.id).toBeDefined();
      expect(user.name).toBe('Test');
    });
    
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    
    req.flush({ id: '1', ...newUser });
  });
});
```
