# Angular Material Design System

Angular Material is Google's official UI component library for Angular, implementing the Material Design specification.

## 🎨 Foundations

### Theming
- Uses CSS custom properties via `@angular/material` theming API.
- Define palette with `mat.define-theme()` (Angular Material 3) or `mat.define-light-theme()` (Material 2).
- Primary, secondary, error, neutral, neutral-variant color roles.

### Typography
- Uses `mat.define-typography-config()` to define scales.
- Key roles: `display-large`, `headline-large`, `title-large`, `body-large`, `label-large`.
- Base font: `Roboto, sans-serif`.

---

## 🧱 Key Components

### Buttons
```html
<button mat-button>Text</button>
<button mat-raised-button color="primary">Raised</button>
<button mat-stroked-button>Stroked</button>
<button mat-flat-button color="accent">Flat</button>
<button mat-icon-button><mat-icon>edit</mat-icon></button>
<button mat-fab color="primary"><mat-icon>add</mat-icon></button>
```

### Form Fields & Inputs
```html
<mat-form-field appearance="outline">
  <mat-label>Label</mat-label>
  <input matInput placeholder="Placeholder" [(ngModel)]="value">
  <mat-error>Mensagem de erro</mat-error>
  <mat-hint>Texto auxiliar</mat-hint>
</mat-form-field>
```

### Select
```html
<mat-form-field>
  <mat-label>Opção</mat-label>
  <mat-select [(ngModel)]="selected">
    <mat-option *ngFor="let item of items" [value]="item.value">{{ item.label }}</mat-option>
  </mat-select>
</mat-form-field>
```

### Dialog (Modal)
```typescript
constructor(private dialog: MatDialog) {}

openDialog() {
  this.dialog.open(MyDialogComponent, {
    width: '400px',
    data: { title: 'Título', message: 'Mensagem' }
  });
}
```

### Table
```html
<table mat-table [dataSource]="dataSource">
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Nome</th>
    <td mat-cell *matCellDef="let row">{{ row.name }}</td>
  </ng-container>
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
<mat-paginator [pageSize]="10" showFirstLastButtons></mat-paginator>
```

### Snackbar (Toast)
```typescript
constructor(private snackBar: MatSnackBar) {}

notify(msg: string) {
  this.snackBar.open(msg, 'Fechar', { duration: 3000 });
}
```

---

## 🛠️ Usage Guidelines
- **Imports:** Use standalone imports — import each `MatXxxModule` in `imports[]` of the component.
- **Accessibility:** All components follow WAI-ARIA; use `aria-label` on icon-only buttons.
- **Angular Signals:** Prefer signal-based state management; avoid `[(ngModel)]` in favor of `formControl` with reactive forms.
- **Angular Material 3:** Prefer `mat.define-theme()` over legacy `define-light-theme()`/`define-dark-theme()`.
