# Signal Queries (View & Content Queries)

O Angular v17.2+ introduziu as **Signal Queries**, uma alternativa moderna e reativa aos decoradores legados `@ViewChild`, `@ViewChildren`, `@ContentChild` e `@ContentChildren`.

## Vantagens das Signal Queries

1.  **Reatividade Nativa**: O resultado da consulta é um Signal, facilitando o uso com `computed()` e `effect()`.
2.  **Ciclo de Vida Previsível**: Não é necessário esperar pelo `ngAfterViewInit` para acessar os dados com segurança (o sinal é atualizado assim que o elemento está disponível).
3.  **Melhor Tipagem**: Inferência de tipo superior e suporte a consultas obrigatórias (`required`).

## 1. View Queries

Utilizadas para acessar elementos ou componentes dentro do **próprio template**.

```typescript
import { Component, viewChild, viewChildren, ElementRef } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <input #nameInput type="text" />
    <app-custom-item />
    <app-custom-item />
  `,
})
export class SearchComponent {
  // Consulta de elemento DOM (retorna Signal<ElementRef | undefined>)
  nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  // Consulta de Componente (retorna Signal<CustomItemComponent | undefined>)
  firstItem = viewChild(CustomItemComponent);

  // Consulta Múltipla (retorna Signal<readonly CustomItemComponent[]>)
  allItems = viewChildren(CustomItemComponent);

  focusInput() {
    // Acesso seguro via Signal
    this.nameInput()?.nativeElement.focus();
  }
}
```

## 2. Content Queries

Utilizadas para acessar elementos ou componentes projetados via `<ng-content>`.

```typescript
import { Component, contentChild, contentChildren } from '@angular/core';

@Component({
  selector: 'app-list-container',
  template: `<ng-content />`,
})
export class ListContainerComponent {
  // Consulta de conteúdo projetado obrigatório
  header = contentChild.required(HeaderDirective);

  // Consulta de múltiplos itens projetados
  items = contentChildren(ListItemComponent);
}
```

## Opções de Consulta

```typescript
// Consulta obrigatória (lança erro se não encontrar)
input = viewChild.required<ElementRef>('myInput');

// Consulta com leitura de um token específico (ex: ElementRef de um componente)
tabBtn = viewChild('btn', { read: ElementRef });
```

---
> [!TIP]
> **Uso com Computed**: Como as queries agora são Signals, você pode criar estados derivados facilmente:
> `hasItems = computed(() => this.allItems().length > 0);`

