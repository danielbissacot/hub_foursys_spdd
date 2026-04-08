# Component Harnesses

Use `Angular CDK component harnesses` para tornar os testes mais fáceis de manter.

## Criando um Harness

```typescript
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

export class CounterHarness extends ComponentHarness {
  static hostSelector = 'app-counter';
  
  // Locators
  private getIncrementButton = this.locatorFor('button.increment');
  private getDecrementButton = this.locatorFor('button.decrement');
  private getCountDisplay = this.locatorFor('.count');
  
  // Actions
  async increment(): Promise<void> {
    const button = await this.getIncrementButton();
    await button.click();
  }
  
  async decrement(): Promise<void> {
    const button = await this.getDecrementButton();
    await button.click();
  }
  
  // Queries
  async getCount(): Promise<number> {
    const display = await this.getCountDisplay();
    const text = await display.text();
    return parseInt(text, 10);
  }
  
  // Filter factory
  static with(options: { count?: number } = {}): HarnessPredicate<CounterHarness> {
    return new HarnessPredicate(CounterHarness, options)
      .addOption('count', options.count, async (harness, count) => {
        return (await harness.getCount()) === count;
      });
  }
}
```

## Usando Harnesses em testes

```typescript
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('CounterComponent with Harness', () => {
  let loader: HarnessLoader;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent],
    }).compileComponents();
    
    const fixture = TestBed.createComponent(CounterComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });
  
  it('should increment count', async () => {
    const counter = await loader.getHarness(CounterHarness);
    
    expect(await counter.getCount()).toBe(0);
    
    await counter.increment();
    expect(await counter.getCount()).toBe(1);
    
    await counter.increment();
    expect(await counter.getCount()).toBe(2);
  });
  
  it('should find counter with specific count', async () => {
    const counter = await loader.getHarness(CounterHarness);
    await counter.increment();
    await counter.increment();
    
    // Find counter with count of 2
    const counterWith2 = await loader.getHarness(CounterHarness.with({ count: 2 }));
    expect(counterWith2).toBeTruthy();
  });
});
```

