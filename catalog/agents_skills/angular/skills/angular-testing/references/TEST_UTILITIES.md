# Utilitários de Teste

## Helpers de teste personalizados

```typescript
// test-utils.ts
export function setSignalInput<T>(
  fixture: ComponentFixture<any>,
  inputName: string,
  value: T
): void {
  fixture.componentRef.setInput(inputName, value);
  fixture.detectChanges();
}

export async function waitForSignal<T>(
  signal: () => T,
  predicate: (value: T) => boolean,
  timeout = 5000
): Promise<T> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const value = signal();
    if (predicate(value)) return value;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  throw new Error('Timeout waiting for signal');
}

// Uso
it('deve carregar dados', async () => {
  const fixture = TestBed.createComponent(DataComponent);
  fixture.detectChanges();
  
  await waitForSignal(
    () => fixture.componentInstance.data(),
    data => data !== undefined
  );
  
  expect(fixture.componentInstance.data()).toBeDefined();
});
```

