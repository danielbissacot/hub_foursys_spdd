# Diretivas de Atributo em Componentes

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

// Uso em componente
@Component({
  imports: [HighlightDirective],
  template: `<app-card appHighlight="lightblue" />`,
})
export class PageComponent {}
```