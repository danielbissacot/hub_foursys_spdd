# Intersection Observer

### Lazy Load Directive

```typescript
@Directive({
  selector: '[appLazyLoad]',
})
export class LazyLoadDirective implements OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private observer: IntersectionObserver | null = null;
  
  src = input.required<string>({ alias: 'appLazyLoad' });
  placeholder = input('/assets/placeholder.png');
  
  loaded = output<void>();
  
  constructor() {
    afterNextRender(() => {
      this.setupObserver();
    });
  }
  
  private setupObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage();
            this.observer?.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );
    
    this.observer.observe(this.el.nativeElement);
    
    // Set placeholder
    if (this.el.nativeElement instanceof HTMLImageElement) {
      this.el.nativeElement.src = this.placeholder();
    }
  }
  
  private loadImage() {
    const element = this.el.nativeElement;
    
    if (element instanceof HTMLImageElement) {
      element.src = this.src();
      element.onload = () => this.loaded.emit();
    } else {
      element.style.backgroundImage = `url(${this.src()})`;
      this.loaded.emit();
    }
  }
  
  ngOnDestroy() {
    this.observer?.disconnect();
  }
}

// Uso: <img [appLazyLoad]="imageUrl" alt="Imagem carregada sob demanda" />
```

### Infinite Scroll

```typescript
@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective implements OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private observer: IntersectionObserver | null = null;
  
  threshold = input(0.1);
  disabled = input(false);
  
  scrolled = output<void>();
  
  constructor() {
    afterNextRender(() => {
      this.setupObserver();
    });
    
    effect(() => {
      if (this.disabled()) {
        this.observer?.disconnect();
      } else {
        this.setupObserver();
      }
    });
  }
  
  private setupObserver() {
    this.observer?.disconnect();
    
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.disabled()) {
          this.scrolled.emit();
        }
      },
      { threshold: this.threshold() }
    );
    
    this.observer.observe(this.el.nativeElement);
  }
  
  ngOnDestroy() {
    this.observer?.disconnect();
  }
}

// Uso:
// <div class="list">
//   @for (item of items(); track item.id) {
//     <div>{{ item.name }}</div>
//   }
//   <div appInfiniteScroll (scrolled)="loadMore()" [disabled]="isLoading()">
//     Carregando...
//   </div>
// </div>
```

