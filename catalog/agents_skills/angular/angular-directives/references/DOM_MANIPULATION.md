# DOM Manipulation

### Auto-Focus Directive

```typescript
@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective {
  private el = inject(ElementRef<HTMLElement>);
  
  enabled = input(true, { alias: 'appAutoFocus', transform: booleanAttribute });
  delay = input(0);
  
  constructor() {
    afterNextRender(() => {
      if (this.enabled()) {
        setTimeout(() => {
          this.el.nativeElement.focus();
        }, this.delay());
      }
    });
  }
}

// Uso: <input appAutoFocus />
// Uso: <input [appAutoFocus]="shouldFocus()" [delay]="100" />
```

### Text Selection Directive

```typescript
@Directive({
  selector: '[appSelectAll]',
  host: {
    '(focus)': 'onFocus()',
    '(click)': 'onClick($event)',
  },
})
export class SelectAllDirective {
  private el = inject(ElementRef<HTMLInputElement>);
  
  onFocus() {
    // Delay to ensure value is set
    setTimeout(() => this.el.nativeElement.select(), 0);
  }
  
  onClick(event: MouseEvent) {
    // Select all on first click if not already focused
    if (document.activeElement !== this.el.nativeElement) {
      this.el.nativeElement.select();
    }
  }
}

// Uso: <input appSelectAll value="Selecione-me ao focar" />
```

### Copy to Clipboard

```typescript
@Directive({
  selector: '[appCopyToClipboard]',
  host: {
    '(click)': 'copy()',
    '[style.cursor]': '"pointer"',
  },
})
export class CopyToClipboardDirective {
  text = input.required<string>({ alias: 'appCopyToClipboard' });
  
  copied = output<void>();
  error = output<Error>();
  
  async copy() {
    try {
      await navigator.clipboard.writeText(this.text());
      this.copied.emit();
    } catch (err) {
      this.error.emit(err as Error);
    }
  }
}

// Uso: 
// <button [appCopyToClipboard]="textToCopy" (copied)="showToast('Copiado!')">
//   Copiar
// </button>
```

