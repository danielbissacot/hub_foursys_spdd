# Dynamic Components (Carregamento e Renderização)

O Angular permite renderizar componentes dinamicamente, o que é essencial para criar dashboards modulares, modais globais ou sistemas de plugins.

## 1. Abordagem Declarativa: ngComponentOutlet

A forma mais simples de renderizar um componente dinâmico diretamente no template.

```typescript
import { Component, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessCmp, ErrorCmp } from './alerts';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngComponentOutlet="selectedComponent()" />
    
    <button (click)="toggle()">Alternar Alerta</button>
  `,
})
export class AlertManagerComponent {
  componentType = signal<Type<any>>(SuccessCmp);

  toggle() {
    this.componentType.set(this.componentType() === SuccessCmp ? ErrorCmp : SuccessCmp);
  }
}
```

## 2. Abordagem Imperativa: ViewContainerRef

Proporciona maior controle sobre a instância do componente, permitindo passar **Signals** e ouvir **Outputs** manualmente.

```typescript
import { Component, ViewChild, ViewContainerRef, inject } from '@angular/core';

@Component({
  template: `<div #container></div>`,
})
export class DynamicHostComponent {
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

  async loadComponent() {
    this.container.clear();
    
    // Lazy Loading do componente
    const { AdminDashboardComponent } = await import('./admin-dashboard.component');
    
    // Criação da instância
    const componentRef = this.container.createComponent(AdminDashboardComponent);
    
    // Interação com a instância
    componentRef.instance.userId = 123;
  }
}
```

## 3. Lazy Loading de Componentes Standalone

A técnica moderna para reduzir o bundle inicial do aplicativo.

```typescript
import { Component, signal } from '@angular/core';

@Component({
  template: `
    @if (showAdmin()) {
      @defer (on interaction) {
        <app-admin-panel />
      } @placeholder {
        <button (click)="showAdmin.set(true)">Carregar Painel Admin</button>
      }
    }
  `,
})
export class HomePage {
  showAdmin = signal(false);
}
```

---
> [!IMPORTANT]
> **Performance**: Sempre priorize o uso de `@defer` (Control Flow) para Lazy Loading de componentes que não são necessários no "First Meaningful Paint". A renderização imperativa via `ViewContainerRef` deve ser reservada para casos onde a lógica de escolha do componente é altamente complexa ou baseada em dados remotos.

