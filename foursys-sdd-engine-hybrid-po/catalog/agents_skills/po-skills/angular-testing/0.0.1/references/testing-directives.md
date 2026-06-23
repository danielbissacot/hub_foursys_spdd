
# Testing Directives

## Attribute Directive

```typescript
@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.backgroundColor]': 'color()',
  },
})
export class HighlightDirective {
  color = input('yellow', { alias: 'appHighlight' });
}

describe('HighlightDirective', () => {
  @Component({
    imports: [HighlightDirective],
    template: `<p appHighlight="lightblue">Test</p>`,
  })
  class TestComponent {}
  
  it('should apply background color', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    
    const p = fixture.nativeElement.querySelector('p');
    expect(p.style.backgroundColor).toBe('lightblue');
  });
});
```

## Structural Directive

```typescript
@Directive({
  selector: '[appIf]',
})
export class IfDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  
  condition = input.required<boolean>({ alias: 'appIf' });
  
  constructor() {
    effect(() => {
      if (this.condition()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}

describe('IfDirective', () => {
  @Component({
    imports: [IfDirective],
    template: `<p *appIf="show()">Visible</p>`,
  })
  class TestComponent {
    show = signal(false);
  }
  
  it('should show content when condition is true', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('p')).toBeNull();
    
    fixture.componentInstance.show.set(true);
    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('p')).toBeTruthy();
  });
});
```
