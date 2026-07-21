# Diretivas de Atributo em Componentes

Aprenda a criar diretivas de atributo modernas utilizando **Signals** e o objeto **host** para manipulação de estilo e comportamento sem a necessidade de decoradores legados.

## Exemplo de Implementação

```typescript
import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true, // Diretivas também são standalone por padrão na v19+
  host: {
    '[style.backgroundColor]': 'color()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HighlightDirective {
  // Signal Input com alias para facilitar o uso no template
  color = input('yellow', { alias: 'appHighlight' });

  onMouseEnter() {
    // Lógica para quando o mouse entra no elemento
  }

  onMouseLeave() {
    // Lógica para quando o mouse sai do elemento
  }
}
```

## Como Usar em um Componente

```typescript
import { Component } from '@angular/core';
import { HighlightDirective } from './highlight.directive';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [HighlightDirective],
  template: `
    <!-- A diretiva é aplicada como um atributo do componente -->
    <app-card appHighlight="lightblue" />
    
    <!-- Ou usando o valor default (yellow) -->
    <section appHighlight>Conteúdo destacado</section>
  `,
})
export class PageComponent {}
```

---
> [!TIP]
> **Performance**: Ao usar diretivas de atributo com `host` bindings baseados em **Signals**, o Angular otimiza a detecção de mudanças, atualizando o DOM apenas quando o sinal de cor realmente mudar.

