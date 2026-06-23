# Resize Observer

```typescript
@Directive({
  selector: '[appResize]',
})
export class ResizeDirective implements OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private observer: ResizeObserver | null = null;
  
  width = signal(0);
  height = signal(0);
  
  resized = output<{ width: number; height: number }>();
  
  constructor() {
    afterNextRender(() => {
      this.observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        const { width, height } = entry.contentRect;
        
        this.width.set(width);
        this.height.set(height);
        this.resized.emit({ width, height });
      });
      
      this.observer.observe(this.el.nativeElement);
    });
  }
  
  ngOnDestroy() {
    this.observer?.disconnect();
  }
}

// Uso:
// <div appResize #resize="appResize">
//   Tamanho: {{ resize.width() }}x{{ resize.height() }}
// </div>
```
