# Export Directive Reference

```typescript
@Directive({
  selector: '[appToggle]',
  exportAs: 'appToggle',
})
export class ToggleDirective {
  isOpen = signal(false);
  
  toggle() {
    this.isOpen.update(v => !v);
  }
  
  open() {
    this.isOpen.set(true);
  }
  
  close() {
    this.isOpen.set(false);
  }
}

// Uso:
// <div appToggle #toggle="appToggle">
//   <button (click)="toggle.toggle()">Alternar</button>
//   @if (toggle.isOpen()) {
//     <div>Conteúdo</div>
//   }
// </div>
```
