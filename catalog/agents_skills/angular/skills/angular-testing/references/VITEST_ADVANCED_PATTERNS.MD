# Padrões Avançados Vitest

## Teste de Snapshot

```typescript
import { describe, it, expect } from 'vitest';

describe('UserCard', () => {
  it('should match snapshot', () => {
    const fixture = TestBed.createComponent(UserCardComponent);
    fixture.componentRef.setInput('user', { id: '1', name: 'John', email: 'john@example.com' });
    fixture.detectChanges();
    
    expect(fixture.nativeElement.innerHTML).toMatchSnapshot();
  });
});
```

## Testes Parametrizados

```typescript
import { describe, it, expect } from 'vitest';

describe('Validator', () => {
  it.each([
    { input: '', expected: false },
    { input: 'test', expected: false },
    { input: 'test@example.com', expected: true },
    { input: 'invalid@', expected: false },
  ])('should validate email "$input" as $expected', ({ input, expected }) => {
    expect(isValidEmail(input)).toBe(expected);
  });
});
```

## Testando com Fake Timers

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Debounced Search', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('should debounce search input', async () => {
    const fixture = TestBed.createComponent(SearchComponent);
    fixture.detectChanges();
    
    fixture.componentInstance.query.set('test');
    
    // Search not called yet
    expect(fixture.componentInstance.results()).toEqual([]);
    
    // Advance timers
    vi.advanceTimersByTime(300);
    await fixture.whenStable();
    fixture.detectChanges();
    
    expect(fixture.componentInstance.results().length).toBeGreaterThan(0);
  });
});
```

## Mocking de Módulos

```typescript
import { describe, it, expect, vi } from 'vitest';

// Mock entire module
vi.mock('./analytics.service', () => ({
  AnalyticsService: class {
    track = vi.fn();
    identify = vi.fn();
  },
}));

describe('with mocked analytics', () => {
  it('should track events', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const analytics = TestBed.inject(AnalyticsService);
    
    fixture.detectChanges();
    
    expect(analytics.track).toHaveBeenCalledWith('dashboard_viewed');
  });
});
```

## Testando Async/Await

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('UserService', () => {
  it('should load user data', async () => {
    const mockUser = { id: '1', name: 'Test' };
    const httpMock = TestBed.inject(HttpTestingController);
    const service = TestBed.inject(UserService);
    
    const userPromise = service.loadUser('1');
    
    httpMock.expectOne('/api/users/1').flush(mockUser);
    
    const user = await userPromise;
    expect(user).toEqual(mockUser);
  });
});
```

## Configuração de Coverage

```typescript
// vite.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test-setup.ts',
        '**/*.spec.ts',
        '**/*.d.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

## Modo UI do Vitest

```bash
# Run with UI
npx vitest --ui

# Open UI at specific port
npx vitest --ui --port 51204
```

## Testes Concorrentes

```typescript
import { describe, it, expect } from 'vitest';

// Run tests in this describe block concurrently
describe.concurrent('API calls', () => {
  it('should fetch users', async () => {
    // ...
  });
  
  it('should fetch products', async () => {
    // ...
  });
  
  it('should fetch orders', async () => {
    // ...
  });
});
```

## Fixtures de Teste

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

// Shared test fixtures
const createTestUser = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});

const createTestProduct = (overrides = {}) => ({
  id: '1',
  name: 'Test Product',
  price: 99.99,
  ...overrides,
});

describe('OrderComponent', () => {
  it('should calculate total', () => {
    const fixture = TestBed.createComponent(OrderComponent);
    fixture.componentRef.setInput('user', createTestUser());
    fixture.componentRef.setInput('products', [
      createTestProduct({ price: 10 }),
      createTestProduct({ id: '2', price: 20 }),
    ]);
    fixture.detectChanges();
    
    expect(fixture.componentInstance.total()).toBe(30);
  });
});
```

