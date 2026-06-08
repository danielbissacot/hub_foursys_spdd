# PrimeNG Design System

PrimeNG is a rich UI component library for Angular with over 90 components, built by PrimeTek.

## 🎨 Foundations

### Theming
- **PrimeNG v17+** uses CSS Layer (`@layer primeng`) and design tokens via `theme.preset`.
- Built-in presets: `Aura`, `Lara`, `Nora`.
- Configure in `app.config.ts`:
```typescript
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.dark-mode' } } })
  ]
};
```

### Typography
- No custom font by default; inherits from the application.
- Spacing and sizing via CSS variables: `--p-spacing-*`, `--p-font-size-*`.

---

## 🧱 Key Components

### Buttons
```html
<p-button label="Confirmar" icon="pi pi-check" severity="success" />
<p-button label="Cancelar" severity="secondary" outlined />
<p-button icon="pi pi-trash" severity="danger" [rounded]="true" />
```

### Form Fields & Inputs
```html
<p-inputgroup>
  <p-inputgroup-addon><i class="pi pi-user"></i></p-inputgroup-addon>
  <input pInputText placeholder="Nome" [(ngModel)]="name" />
</p-inputgroup>

<p-floatlabel>
  <input pInputText id="nome" [(ngModel)]="name" />
  <label for="nome">Nome</label>
</p-floatlabel>
```

### Select / Dropdown
```html
<p-select [options]="items" [(ngModel)]="selected"
          optionLabel="label" optionValue="value"
          placeholder="Selecione..." />
```

### Dialog (Modal)
```html
<p-dialog header="Título" [(visible)]="visible" [modal]="true" [draggable]="false">
  <ng-template pTemplate="content">Conteúdo aqui</ng-template>
  <ng-template pTemplate="footer">
    <p-button label="Fechar" (onClick)="visible=false" />
  </ng-template>
</p-dialog>
```

### Table
```html
<p-table [value]="items" [paginator]="true" [rows]="10" [sortable]="true">
  <ng-template pTemplate="header">
    <tr>
      <th pSortableColumn="name">Nome <p-sortIcon field="name"/></th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-item>
    <tr><td>{{ item.name }}</td></tr>
  </ng-template>
</p-table>
```

### Toast (Notifications)
```typescript
constructor(private messageService: MessageService) {}

notify() {
  this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Operação realizada.' });
}
```
```html
<!-- in template -->
<p-toast />
```

---

## 🛠️ Usage Guidelines
- **Standalone components:** Import each `PrimeNG` component directly in `imports[]`.
- **Icons:** Use `primeicons` package; prefix all icons with `pi pi-*`.
- **Reactive Forms:** PrimeNG inputs work with `formControlName` — wrap in `<form [formGroup]="form">`.
- **Overlay ZIndex:** Configure globally via `providePrimeNG({ zIndex: { ... } })`.
