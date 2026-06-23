# Workspace Multi-Projeto

## Criar Workspace

```bash
# Create empty workspace
ng new my-workspace --create-application=false

cd my-workspace

# Add applications
ng generate application main-app
ng generate application admin-app

# Add library
ng generate library shared-ui
ng generate library data-access
```

## Estrutura do Workspace

```
my-workspace/
├── projects/
│   ├── main-app/
│   │   └── src/
│   ├── admin-app/
│   │   └── src/
│   ├── shared-ui/
│   │   └── src/
│   └── data-access/
│       └── src/
├── angular.json
└── package.json
```

## Build de Projeto Específico

```bash
gn build main-app
ng build shared-ui
ng serve admin-app
```

## Configuração de Library

```json
// projects/shared-ui/ng-package.json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/shared-ui",
  "lib": {
    "entryFile": "src/public-api.ts"
  }
}
```

## Usando a Library na Aplicação

```typescript
// After building library: ng build shared-ui
import { ButtonComponent } from 'shared-ui';

@Component({
  imports: [ButtonComponent],
  template: `<lib-button>Click</lib-button>`,
})
export class AppComponent {}
```