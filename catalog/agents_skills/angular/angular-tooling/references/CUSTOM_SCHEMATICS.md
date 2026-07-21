# Schematics Personalizadas

## Gerar Coleção de Schematics

```bash
# Install schematics CLI
npm install -g @angular-devkit/schematics-cli

# Create schematic collection
schematics blank --name=my-schematics
```

# Schematic Simples de Componente

```typescript
// src/my-component/index.ts
import { Rule, SchematicContext, Tree, apply, url, template, move, mergeWith } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

export function myComponent(options: { name: string; path: string }): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const templateSource = apply(url('./files'), [
      template({
        ...options,
        ...strings,
      }),
      move(options.path),
    ]);
    
    return mergeWith(templateSource)(tree, context);
  };
}
```

## Use Custom Schematics

```bash
# Link locally
npm link ./my-schematics

# Use
ng generate my-schematics:my-component --name=test --path=src/app
```
