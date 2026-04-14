# Rotas de Modal

Usando auxiliary outlets para modals:

```typescript
// Routes
export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'product-modal/:id', component: ProductModalComponent, outlet: 'modal' },
];

// App template
@Component({
  template: `
    <router-outlet />
    <router-outlet name="modal" />
  `,
})
export class AppComponent {}

// Open modal
this.router.navigate([{ outlets: { modal: ['product-modal', productId] } }]);

// Close modal
this.router.navigate([{ outlets: { modal: null } }]);

// Link to open modal
<a [routerLink]="[{ outlets: { modal: ['product-modal', product.id] } }]">
  View Details
</a>
```

