---
name: angular-directives
description: Criar diretivas customizadas no Angular v20+ para manipulação do DOM e extensão de comportamento. Use para attribute directives que modificam o comportamento/aparência do elemento, structural directives para portals/overlays e host directives para composição. Indicado para criar comportamentos reutilizáveis do DOM, estender funcionalidade de elementos ou compor comportamentos entre componentes. Observação - use native `@if`/`@for`/`@switch` para control flow, não crie structural directives customizadas.
metadata:
  version: "0.0.1"
---

# Angular Directives

Criar diretivas customizadas para manipulação reutilizável do DOM e seu comportamento no Angular v20+.

## Diretivas de Atributo

Modificar a aparência ou o comportamento de um elemento:

```typescript
import { Directive, input, effect, inject, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private el = inject(ElementRef<HTMLElement>);
  
  // Input com alias correspondente ao selector
  color = input('yellow', { alias: 'appHighlight' });
  
  constructor() {
    effect(() => {
      this.el.nativeElement.style.backgroundColor = this.color();
    });
  }
}

// Uso: <p appHighlight="lightblue">Texto destacado</p>
// Uso: <p appHighlight>Highlight padrão amarelo</p>
```

### Usando a propriedade `host`

Prefira `host` em vez de `@HostBinding`/`@HostListener`:

```typescript
@Directive({
  selector: '[appTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '[attr.aria-describedby]': 'tooltipId',
  },
})
export class TooltipDirective {
  text = input.required<string>({ alias: 'appTooltip' });
  position = input<'top' | 'bottom' | 'left' | 'right'>('top');
  
  tooltipId = `tooltip-${crypto.randomUUID()}`;
  private tooltipEl: HTMLElement | null = null;
  private el = inject(ElementRef<HTMLElement>);
  
  show() {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.id = this.tooltipId;
    this.tooltipEl.className = `tooltip tooltip-${this.position()}`;
    this.tooltipEl.textContent = this.text();
    this.tooltipEl.setAttribute('role', 'tooltip');
    document.body.appendChild(this.tooltipEl);
    this.positionTooltip();
  }
  
  hide() {
    this.tooltipEl?.remove();
    this.tooltipEl = null;
  }
  
  private positionTooltip() {
    // Lógica de posicionamento baseada em this.position() e this.el
  }
}

// Uso: <button appTooltip="Click to save" position="bottom">Salvar</button>
```

### Manipulação de Classes e Estilos

```typescript
@Directive({
  selector: '[appButton]',
  host: {
    'class': 'btn',
    '[class.btn-primary]': 'variant() === "primary"',
    '[class.btn-secondary]': 'variant() === "secondary"',
    '[class.btn-sm]': 'size() === "small"',
    '[class.btn-lg]': 'size() === "large"',
    '[class.disabled]': 'disabled()',
    '[attr.disabled]': 'disabled() || null',
  },
})
export class ButtonDirective {
  variant = input<'primary' | 'secondary'>('primary');
  size = input<'small' | 'medium' | 'large'>('medium');
  disabled = input(false, { transform: booleanAttribute });
}

// Uso: <button appButton variant="primary" size="large">Clique</button>
```

### Manipulação de Eventos

```typescript
@Directive({
  selector: '[appClickOutside]',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class ClickOutsideDirective {
  private el = inject(ElementRef<HTMLElement>);
  
  clickOutside = output<void>();
  
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.clickOutside.emit();
    }
  }
}

// Uso: <div appClickOutside (clickOutside)="closeMenu()">...</div>
```

### Atalhos de Teclado

```typescript
@Directive({
  selector: '[appShortcut]',
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class ShortcutDirective {
  key = input.required<string>({ alias: 'appShortcut' });
  ctrl = input(false, { transform: booleanAttribute });
  shift = input(false, { transform: booleanAttribute });
  alt = input(false, { transform: booleanAttribute });
  
  triggered = output<KeyboardEvent>();
  
  onKeydown(event: KeyboardEvent) {
    const keyMatch = event.key.toLowerCase() === this.key().toLowerCase();
    const ctrlMatch = this.ctrl() ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
    const shiftMatch = this.shift() ? event.shiftKey : !event.shiftKey;
    const altMatch = this.alt() ? event.altKey : !event.altKey;
    
    if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
      event.preventDefault();
      this.triggered.emit(event);
    }
  }
}

// Uso: <button appShortcut="s" ctrl (triggered)="save()">Salvar (Ctrl+S)</button>
```

## Diretivas Estruturais

Use diretivas estruturais para manipulação do DOM além do control flow (portals, overlays, pontos de inserção dinâmicos). Para condicionais e loops, use native `@if`, `@for`, `@switch`.

### Portal Directive

Renderizar conteúdo em um local diferente do DOM:

```typescript
import { Directive, inject, TemplateRef, ViewContainerRef, OnInit, OnDestroy, input } from '@angular/core';

@Directive({
  selector: '[appPortal]',
})
export class PortalDirective implements OnInit, OnDestroy {
  private templateRef = inject(TemplateRef<any>);
  private viewContainerRef = inject(ViewContainerRef);
  private viewRef: EmbeddedViewRef<any> | null = null;
  
  // Seletor ou elemento do container alvo
  target = input<string | HTMLElement>('body', { alias: 'appPortal' });
  
  ngOnInit() {
    const container = this.getContainer();
    if (container) {
      this.viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.viewRef.rootNodes.forEach(node => container.appendChild(node));
    }
  }
  
  ngOnDestroy() {
    this.viewRef?.destroy();
  }
  
  private getContainer(): HTMLElement | null {
    const target = this.target();
    if (typeof target === 'string') {
      return document.querySelector(target);
    }
    return target;
  }
}

// Uso: Renderizar modal no nível do body
// <div *appPortal="'body'">
//   <div class="modal">Conteúdo do modal</div>
// </div>
```

### Lazy Render Directive

Adiar renderização até que a condição seja satisfeita (uma única vez):

```typescript
@Directive({
  selector: '[appLazyRender]',
})
export class LazyRenderDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private rendered = false;
  
  condition = input.required<boolean>({ alias: 'appLazyRender' });
  
  constructor() {
    effect(() => {
      // Renderiza apenas uma vez quando a condição se tornar true
      if (this.condition() && !this.rendered) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.rendered = true;
      }
    });
  }
}

// Uso: Renderizar componente pesado apenas quando a aba for ativada pela primeira vez
// <div *appLazyRender="activeTab() === 'reports'">
//   <app-heavy-reports />
// </div>
```

### Template Outlet com Contexto

```typescript
interface TemplateContext<T> {
  $implicit: T;
  item: T;
  index: number;
}

@Directive({
  selector: '[appTemplateOutlet]',
})
export class TemplateOutletDirective<T> {
  private viewContainer = inject(ViewContainerRef);
  private currentView: EmbeddedViewRef<TemplateContext<T>> | null = null;
  
  template = input.required<TemplateRef<TemplateContext<T>>>({ alias: 'appTemplateOutlet' });
  context = input.required<T>({ alias: 'appTemplateOutletContext' });
  index = input(0, { alias: 'appTemplateOutletIndex' });
  
  constructor() {
    effect(() => {
      const template = this.template();
      const context = this.context();
      const index = this.index();
      
      if (this.currentView) {
        this.currentView.context.$implicit = context;
        this.currentView.context.item = context;
        this.currentView.context.index = index;
        this.currentView.markForCheck();
      } else {
        this.currentView = this.viewContainer.createEmbeddedView(template, {
          $implicit: context,
          item: context,
          index,
        });
      }
    });
  }
}

// Uso: Lista customizada com template
// <ng-template #itemTemplate let-item let-i="index">
//   <div>{{ i }}: {{ item.name }}</div>
// </ng-template>
// <ng-container 
//   *appTemplateOutlet="itemTemplate; context: item; index: i"
// />
```

## Host Directives

Compor diretivas em componentes ou outras diretivas:

```typescript
// Diretivas de comportamento reutilizáveis
@Directive({
  selector: '[focusable]',
  host: {
    'tabindex': '0',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '[class.focused]': 'isFocused()',
  },
})
export class FocusableDirective {
  isFocused = signal(false);
  
  onFocus() { this.isFocused.set(true); }
  onBlur() { this.isFocused.set(false); }
}

@Directive({
  selector: '[disableable]',
  host: {
    '[class.disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled()',
  },
})
export class DisableableDirective {
  disabled = input(false, { transform: booleanAttribute });
}

  // Componente usando host directives
@Component({
  selector: 'app-custom-button',
  hostDirectives: [
    FocusableDirective,
    {
      directive: DisableableDirective,
      inputs: ['disabled'],
    },
  ],
  host: {
    'role': 'button',
    '(click)': 'onClick($event)',
    '(keydown.enter)': 'onClick($event)',
    '(keydown.space)': 'onClick($event)',
  },
  template: `<ng-content />`,
})
export class CustomButtonComponent {
  private disableable = inject(DisableableDirective);
  
  clicked = output<void>();
  
  onClick(event: Event) {
    if (!this.disableable.disabled()) {
      this.clicked.emit();
    }
  }
}

// Uso: <app-custom-button disabled>Clique em mim</app-custom-button>
```

### Expondo Outputs de Host Directive

```typescript
@Directive({
  selector: '[hoverable]',
  host: {
    '(mouseenter)': 'onEnter()',
    '(mouseleave)': 'onLeave()',
    '[class.hovered]': 'isHovered()',
  },
})
export class HoverableDirective {
  isHovered = signal(false);
  
  hoverChange = output<boolean>();
  
  onEnter() {
    this.isHovered.set(true);
    this.hoverChange.emit(true);
  }
  
  onLeave() {
    this.isHovered.set(false);
    this.hoverChange.emit(false);
  }
}

@Component({
  selector: 'app-card',
  hostDirectives: [
    {
      directive: HoverableDirective,
      outputs: ['hoverChange'],
    },
  ],
  template: `<ng-content />`,
})
export class CardComponent {}

// Uso: <app-card (hoverChange)="onHover($event)">...</app-card>
```
## Directive Composition API

Combine multiple behaviors:

```typescript
// Base directives
@Directive({ selector: '[withRipple]' })
export class RippleDirective {
  // Ripple effect implementation
}

@Directive({ selector: '[withElevation]' })
export class ElevationDirective {
  elevation = input(2);
}

// Composed component
@Component({
  selector: 'app-material-button',
  hostDirectives: [
    RippleDirective,
    {
      directive: ElevationDirective,
      inputs: ['elevation'],
    },
    {
      directive: DisableableDirective,
      inputs: ['disabled'],
    },
  ],
  template: `<ng-content />`,
})
export class MaterialButtonComponent {}
```

For detailed directive patterns, see:

- [DOM Manipulation](references/dom-manipulation.MD)
- [Form Directives](references/form-directives.MD)
- [Intersection Observer](references/intersection-observer.MD)
- [Resize Observer](references/resize-observer.MD)
- [Drag and Drop](references/drag-and-drop.MD)
- [Permission Directive](references/permission-directive.MD)
- [Export Directive Reference](references/export-directive-reference.MD)

