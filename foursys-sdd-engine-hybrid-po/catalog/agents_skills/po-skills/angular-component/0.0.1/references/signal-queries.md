# Signal Queries

## View Queries

Consultar elementos e componentes no template:

```typescript
import { Component, viewChild, viewChildren, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  template: `
    <div #container class="gallery">
      @for (image of images(); track image.id) {
        <app-image-card [image]="image" />
      }
    </div>
  `,
})
export class GalleryComponent implements AfterViewInit {
  images = input.required<Image[]>();
  
  // Consultar um único elemento
  container = viewChild.required<ElementRef<HTMLDivElement>>('container');
  
  // Consultar um único componente (opcional)
  firstCard = viewChild(ImageCardComponent);
  
  // Consultar todos os componentes correspondentes
  allCards = viewChildren(ImageCardComponent);
  
  ngAfterViewInit() {
    console.log('Container:', this.container().nativeElement);
    console.log('Cards:', this.allCards().length);
  }
}
```

## Content Queries

Consultar conteúdo projetado:

```typescript
import { Component, contentChild, contentChildren, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tab-headers">
      @for (tab of tabs(); track tab.label()) {
        <button 
          [class.active]="tab === activeTab()"
          (click)="selectTab(tab)"
        >
          {{ tab.label() }}
        </button>
      }
    </div>
    <div class="tab-content">
      <ng-content />
    </div>
  `,
})
export class TabsComponent implements AfterContentInit {
  // Consultar todos os filhos projetados do tipo TabComponent
  tabs = contentChildren(TabComponent);

  // Consultar um único elemento projetado
  header = contentChild('tabHeader');

  activeTab = signal<TabComponent | undefined>(undefined);

  ngAfterContentInit() {
    // Define a primeira aba como ativa
    const firstTab = this.tabs()[0];
    if (firstTab) {
      this.activeTab.set(firstTab);
    }
  }
  
  selectTab(tab: TabComponent) {
    this.activeTab.set(tab);
  }
}

@Component({
  selector: 'app-tab',
  template: `<ng-content />`,
  host: {
    '[class.active]': 'isActive()',
    '[style.display]': 'isActive() ? "block" : "none"',
  },
})
export class TabComponent {
  label = input.required<string>();
  isActive = input(false);
}
```