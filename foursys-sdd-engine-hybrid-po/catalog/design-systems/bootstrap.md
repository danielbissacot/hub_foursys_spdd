# Bootstrap + ng-bootstrap Design System

Bootstrap is the most popular CSS framework; ng-bootstrap provides Angular-native components built on top of Bootstrap CSS without jQuery.

## 🎨 Foundations

### Setup
```typescript
// app.config.ts
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// In component imports or AppModule:
// imports: [NgbModule]
```

### Colors (Bootstrap 5 Semantic Colors)
- `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`.
- Usage: `class="btn btn-primary"`, `class="text-success"`, `class="bg-danger"`.
- Custom CSS variables: `--bs-primary`, `--bs-secondary`, etc.

### Typography
- Base: `$font-family-sans-serif: system-ui, -apple-system, Roboto, sans-serif`.
- Scale: `.fs-1` (2.5rem) through `.fs-6` (1rem).
- Utilities: `.fw-bold`, `.fw-semibold`, `.text-muted`, `.text-truncate`.

### Spacing (Bootstrap 5 Utilities)
- Margin/Padding: `m-{0-5}`, `p-{0-5}`, `mt-3`, `px-2`, `gap-2`.
- Breakpoints: `sm` (576px), `md` (768px), `lg` (992px), `xl` (1200px), `xxl` (1400px).

---

## 🧱 Key Components

### Buttons
```html
<button type="button" class="btn btn-primary">Primário</button>
<button type="button" class="btn btn-outline-secondary">Outline</button>
<button type="button" class="btn btn-sm btn-danger">Pequeno</button>
```

### Forms
```html
<div class="mb-3">
  <label for="name" class="form-label">Nome</label>
  <input type="text" class="form-control" id="name" [(ngModel)]="name">
  <div class="form-text">Texto auxiliar.</div>
</div>

<select class="form-select" [(ngModel)]="selected">
  <option *ngFor="let opt of options" [value]="opt.value">{{ opt.label }}</option>
</select>
```

### Modal (ng-bootstrap)
```html
<!-- trigger -->
<button class="btn btn-primary" (click)="openModal(content)">Abrir</button>

<!-- modal template -->
<ng-template #content let-modal>
  <div class="modal-header">
    <h4 class="modal-title">Título</h4>
    <button type="button" class="btn-close" (click)="modal.dismiss()"></button>
  </div>
  <div class="modal-body">Conteúdo</div>
  <div class="modal-footer">
    <button class="btn btn-primary" (click)="modal.close('ok')">Confirmar</button>
  </div>
</ng-template>
```
```typescript
constructor(private modalService: NgbModal) {}

openModal(content: TemplateRef<any>) {
  this.modalService.open(content, { centered: true });
}
```

### Toast (ng-bootstrap)
```html
<ngb-toast [autohide]="true" [delay]="3000" (hidden)="show=false">
  Operação realizada com sucesso!
</ngb-toast>
```

### Grid
```html
<div class="container-fluid">
  <div class="row g-3">
    <div class="col-md-6 col-lg-4">Coluna 1</div>
    <div class="col-md-6 col-lg-4">Coluna 2</div>
  </div>
</div>
```

---

## 🛠️ Usage Guidelines
- **Angular integration:** Prefer `ng-bootstrap` over Bootstrap's JavaScript plugins — avoids jQuery dependency.
- **CSS only:** Use Bootstrap utility classes for layout; reserve ng-bootstrap components for interactive widgets.
- **Reactive Forms:** Use `formControlName` with Bootstrap's `form-control` class — apply `.is-invalid` class based on control validation state.
- **Custom theme:** Override `$primary`, `$secondary` SCSS variables before importing Bootstrap.
