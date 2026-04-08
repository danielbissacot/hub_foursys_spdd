# Path Aliases

## Configurar tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@app/*": ["src/app/*"],
      "@env/*": ["src/environments/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@core/*": ["src/app/core/*"]
    }
  }
}
```

## Uso

```typescript
// Ao invés de imports relativos
import { UserService } from '../../../core/services/user.service';

// Use path alias
import { UserService } from '@core/services/user.service';
```
