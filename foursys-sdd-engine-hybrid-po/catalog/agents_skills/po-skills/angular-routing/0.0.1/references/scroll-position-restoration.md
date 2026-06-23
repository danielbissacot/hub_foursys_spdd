# Restauração da posição de scroll

```typescript
// app.config.ts
import { 
  provideRouter, 
  withInMemoryScrolling,
  withRouterConfig 
} from '@angular/router';

provideRouter(
  routes,
  withInMemoryScrolling({
    scrollPositionRestoration: 'enabled', // or 'top'
    anchorScrolling: 'enabled',
  }),
  withRouterConfig({
    onSameUrlNavigation: 'reload',
  })
)
```
