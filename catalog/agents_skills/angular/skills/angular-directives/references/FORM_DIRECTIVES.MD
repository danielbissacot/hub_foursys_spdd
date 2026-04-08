# Form Directives

### Trim Input

```typescript
@Directive({
  selector: 'input[appTrim], textarea[appTrim]',
  host: {
    '(blur)': 'onBlur()',
  },
})
export class TrimDirective {
  private el = inject(ElementRef<HTMLInputElement | HTMLTextAreaElement>);
  private ngControl = inject(NgControl, { optional: true, self: true });
  
  onBlur() {
    const value = this.el.nativeElement.value;
    const trimmed = value.trim();
    
    if (value !== trimmed) {
      this.el.nativeElement.value = trimmed;
      this.ngControl?.control?.setValue(trimmed);
    }
  }
}

// Uso: <input appTrim formControlName="name" />
```

### Input Mask

```typescript
@Directive({
  selector: '[appMask]',
  host: {
    '(input)': 'onInput($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class MaskDirective {
  private el = inject(ElementRef<HTMLInputElement>);
  
  // Mask pattern: 9 = digit, A = letter, * = any
  mask = input.required<string>({ alias: 'appMask' });
  
  onInput(event: InputEvent) {
    const input = this.el.nativeElement;
    const value = input.value;
    const masked = this.applyMask(value);
    
    if (value !== masked) {
      input.value = masked;
    }
  }
  
  onKeydown(event: KeyboardEvent) {
    // Allow navigation keys
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
      return;
    }
    
    const input = this.el.nativeElement;
    const position = input.selectionStart ?? 0;
    const maskChar = this.mask()[position];
    
    if (!maskChar) {
      event.preventDefault();
      return;
    }
    
    if (!this.isValidChar(event.key, maskChar)) {
      event.preventDefault();
    }
  }
  
  private applyMask(value: string): string {
    const mask = this.mask();
    let result = '';
    let valueIndex = 0;
    
    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
      const maskChar = mask[i];
      const inputChar = value[valueIndex];
      
      if (maskChar === '9' || maskChar === 'A' || maskChar === '*') {
        if (this.isValidChar(inputChar, maskChar)) {
          result += inputChar;
          valueIndex++;
        } else {
          valueIndex++;
          i--;
        }
      } else {
        result += maskChar;
        if (inputChar === maskChar) {
          valueIndex++;
        }
      }
    }
    
    return result;
  }
  
  private isValidChar(char: string, maskChar: string): boolean {
    switch (maskChar) {
      case '9': return /\d/.test(char);
      case 'A': return /[a-zA-Z]/.test(char);
      case '*': return /[a-zA-Z0-9]/.test(char);
      default: return char === maskChar;
    }
  }
}

// Uso: <input appMask="(999) 999-9999" placeholder="(555) 123-4567" />
```

### Character Counter

```typescript
@Directive({
  selector: '[appCharCount]',
})
export class CharCountDirective {
  private el = inject(ElementRef<HTMLInputElement | HTMLTextAreaElement>);
  
  maxLength = input.required<number>({ alias: 'appCharCount' });
  
  currentLength = signal(0);
  remaining = computed(() => this.maxLength() - this.currentLength());
  isOverLimit = computed(() => this.remaining() < 0);
  
  constructor() {
    effect(() => {
      this.currentLength.set(this.el.nativeElement.value.length);
    });
    
    // Listen for input changes
    afterNextRender(() => {
      this.el.nativeElement.addEventListener('input', () => {
        this.currentLength.set(this.el.nativeElement.value.length);
      });
    });
  }
}

// Uso com template:
// <textarea appCharCount="500" #counter="appCharCount"></textarea>
// <span>{{ counter.remaining() }} caracteres restantes</span>
```

