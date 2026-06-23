# Injeção de Dependência em Componentes

Use a função `inject()` em vez de injeção no construtor:

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `...`,
})
export class DashboardComponent {
  private router = inject(Router);
  private userService = inject(UserService);
  private config = inject(APP_CONFIG);
  
  // Injeção opcional
  private analytics = inject(AnalyticsService, { optional: true });
  
  // Injeção apenas local
  private localService = inject(LocalService, { self: true });
  
  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
```