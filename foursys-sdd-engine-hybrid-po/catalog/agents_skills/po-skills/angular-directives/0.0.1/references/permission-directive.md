# Permission Directive

```typescript
@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);
  private hasView = false;
  
  permission = input.required<string | string[]>({ alias: 'appHasPermission' });
  mode = input<'any' | 'all'>('any');
  
  constructor() {
    effect(() => {
      const hasPermission = this.checkPermission();
      
      if (hasPermission && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!hasPermission && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
  
  private checkPermission(): boolean {
    const required = this.permission();
    const permissions = Array.isArray(required) ? required : [required];
    const userPermissions = this.authService.permissions();
    
    if (this.mode() === 'all') {
      return permissions.every(p => userPermissions.includes(p));
    }
    
    return permissions.some(p => userPermissions.includes(p));
  }
}

// Uso:
// <button *appHasPermission="'admin'">Apenas Admin</button>
// <div *appHasPermission="['edit', 'delete']; mode: 'all'">Editar & Excluir</div>
```
