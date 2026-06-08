# Tailwind CSS Design System

Tailwind CSS is a utility-first CSS framework that enables rapid UI development by composing low-level utility classes directly in templates.

## 🎨 Foundations

### Setup (Angular)
```typescript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#ff6b00', light: '#ff8c33', dark: '#cc5500' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### Color System
- Semantic colors: `text-{color}-{shade}`, `bg-{color}-{shade}`, `border-{color}-{shade}`.
- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.
- State variants: `hover:bg-blue-600`, `focus:ring-2`, `disabled:opacity-50`.

### Spacing
- Scale based on 4px grid: `p-1`=4px, `p-2`=8px, `p-4`=16px, `p-8`=32px.
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`.

### Typography
- Size: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`...`text-9xl`.
- Weight: `font-normal`, `font-medium`, `font-semibold`, `font-bold`.
- Color: `text-gray-900`, `text-gray-500`, `text-white`.

---

## 🧱 Common Patterns

### Buttons
```html
<!-- Primary -->
<button class="bg-primary text-white px-4 py-2 rounded-md font-medium
               hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary
               disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
  Confirmar
</button>

<!-- Secondary/Outline -->
<button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md
               hover:bg-gray-50 transition-colors">
  Cancelar
</button>
```

### Form Fields
```html
<div class="flex flex-col gap-1">
  <label class="text-sm font-medium text-gray-700">Nome</label>
  <input type="text"
         class="border border-gray-300 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                invalid:border-red-500"
         [(ngModel)]="name">
  <span class="text-xs text-red-500">Mensagem de erro</span>
</div>
```

### Card
```html
<div class="bg-white rounded-lg shadow-md p-6 border border-gray-100">
  <h3 class="text-lg font-semibold text-gray-900 mb-2">Título</h3>
  <p class="text-sm text-gray-500">Conteúdo do card.</p>
  <div class="mt-4 flex justify-end gap-2">
    <button class="btn-secondary">Cancelar</button>
    <button class="btn-primary">Confirmar</button>
  </div>
</div>
```

### Modal (headless + Tailwind)
```html
<!-- overlay -->
<div *ngIf="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
    <h2 class="text-xl font-semibold mb-4">Título</h2>
    <p class="text-gray-600 mb-6">Conteúdo aqui.</p>
    <div class="flex justify-end gap-3">
      <button (click)="isOpen=false" class="px-4 py-2 text-sm border rounded-md hover:bg-gray-50">
        Fechar
      </button>
    </div>
  </div>
</div>
```

### Grid / Layout
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="bg-white rounded-lg p-4 shadow-sm">Item 1</div>
  <div class="bg-white rounded-lg p-4 shadow-sm">Item 2</div>
</div>

<!-- Flex layout -->
<div class="flex items-center justify-between gap-4 flex-wrap">
  <h2 class="text-xl font-bold">Título da Página</h2>
  <button class="...">Ação</button>
</div>
```

---

## 🛠️ Usage Guidelines
- **@apply:** Use `@apply` in SCSS/CSS files to create reusable component classes, avoiding repeated utility strings in templates.
- **Angular integration:** Install `tailwindcss`, `postcss`, `autoprefixer`; add `tailwind.config.js`; update `styles.css` with `@tailwind` directives.
- **Dark mode:** Use `dark:` variant with `darkMode: 'class'` in config; toggle `dark` class on `<html>`.
- **Avoid `!important`:** Prefer specificity through proper class ordering; use `!` modifier (`!bg-red-500`) only when necessary.
- **Component extraction:** For repeated patterns, extract to Angular components rather than duplicating class lists.
