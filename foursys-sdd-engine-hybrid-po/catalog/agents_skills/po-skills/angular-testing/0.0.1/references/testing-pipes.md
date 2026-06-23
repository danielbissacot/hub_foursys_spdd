# Testando Pipes

```typescript
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, length: number = 50): string {
    if (value.length <= length) return value;
    return value.substring(0, length) + '...';
  }
}

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;
  
  beforeEach(() => {
    pipe = new TruncatePipe();
  });
  
  it('should not truncate short strings', () => {
    expect(pipe.transform('Hello', 10)).toBe('Hello');
  });
  
  it('should truncate long strings', () => {
    expect(pipe.transform('Hello World', 5)).toBe('Hello...');
  });
  
  it('should use default length', () => {
    const longString = 'a'.repeat(60);
    const result = pipe.transform(longString);
    expect(result.length).toBe(53); // 50 + '...'
  });
});
```
