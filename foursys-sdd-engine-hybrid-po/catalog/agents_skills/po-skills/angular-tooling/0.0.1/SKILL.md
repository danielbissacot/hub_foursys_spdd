---
name: angular-tooling
description: Use Angular CLI e ferramentas de desenvolvimento de forma eficaz em projetos Angular v20+. Use para configuração de projeto, geração de código, build, testes e configuração. Acione em criação de novos projetos, geração de componentes/serviços/módulos, configuração de builds, execução de testes ou otimização de builds de produção.
metadata:
  version: "0.0.1"
---

# Angular Tooling

Use Angular CLI e ferramentas de desenvolvimento para desenvolvimento eficiente com Angular v20+.

## Configuração de Projeto

### Criar Novo Projeto

```bash
# Criar novo projeto standalone (padrão no v20+)
ng new my-app

# Com opções específicas
ng new my-app --style=scss --routing --ssr=false

# Pular testes
ng new my-app --skip-tests

# Configuração mínima
ng new my-app --minimal --inline-style --inline-template
```

### Estrutura do Projeto

```
my-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── public/                  # Assets estáticos
├── angular.json             # Configuração do CLI
├── package.json
├── tsconfig.json
└── tsconfig.app.json
```

## Geração de Código

### Componentes

```bash
# Gerar componente
ng generate component features/user-profile
ng g c features/user-profile  # Forma abreviada

# Com opções
ng g c shared/button --inline-template --inline-style
ng g c features/dashboard --skip-tests
ng g c features/settings --change-detection=OnPush

# Flat (sem pasta)
ng g c shared/icon --flat

# Dry run (visualizar)
ng g c features/checkout --dry-run
```

### Services

```bash
# Gerar service (providedIn: 'root' por padrão)
ng g service services/auth
ng g s services/user

# Pular testes
ng g s services/api --skip-tests
```

### Outros Schematics

```bash
# Directive
ng g directive directives/highlight
ng g d directives/tooltip

# Pipe
ng g pipe pipes/truncate
ng g p pipes/date-format

# Guard (funcional por padrão)
ng g guard guards/auth

# Interceptor (funcional por padrão)
ng g interceptor interceptors/auth

# Interface
ng g interface models/user

# Enum
ng g enum models/status

# Class
ng g class models/product
```

### Gerar com Path Alias

```bash
# Componentes em pastas de feature
ng g c @features/products/product-list
ng g c @shared/ui/button
```

## Servidor de Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
ng serve
ng s  # Forma abreviada

# Com opções
ng serve --port 4201
ng serve --open  # Abrir navegador
ng serve --host 0.0.0.0  # Expor na rede

# Modo produção local
ng serve --configuration=production

# Com SSL
ng serve --ssl --ssl-key ./ssl/key.pem --ssl-cert ./ssl/cert.pem
```

## Build

### Build de Desenvolvimento

```bash
ng build
```

### Build de Produção

```bash
ng build --configuration=production
ng build -c production  # Forma abreviada

# Com opções específicas
ng build -c production --source-map=false
ng build -c production --named-chunks
```

### Saída do Build

```
dist/my-app/
├── browser/
│   ├── index.html
│   ├── main-[hash].js
│   ├── polyfills-[hash].js
│   └── styles-[hash].css
└── server/              # Se SSR habilitado
  └── main.js
```

## Testes

### Testes Unitários

```bash
# Executar testes
ng test
ng t  # Forma abreviada

# Execução única (CI)
ng test --watch=false --browsers=ChromeHeadless

# Com cobertura
ng test --code-coverage

# Arquivo específico
ng test --include=**/user.service.spec.ts
```

### Testes E2E

```bash
# Executar e2e (se configurado)
ng e2e
```

## Lint

```bash
# Executar linter
ng lint

# Corrigir problemas auto-corrigíveis
ng lint --fix
```

## Configuração

### Seções principais do angular.json

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/my-app",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": ["{ \"glob\": \"**/*\", \"input\": \"public\" }"],
            "styles": ["src/styles.scss"],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kB",
                  "maximumError": "1MB"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          }
        }
      }
    }
  }
}
```

### Configuração de Ambiente

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
};
```

Configurar no angular.json:

```json
{
  "configurations": {
    "production": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ]
    }
  }
}
```


## Adicionando Bibliotecas

### Bibliotecas Angular

```bash
# Adicionar Angular Material
ng add @angular/material

# Adicionar Angular PWA
ng add @angular/pwa

# Adicionar Angular SSR
ng add @angular/ssr

# Adicionar Angular Localize
ng add @angular/localize
```

### Bibliotecas de Terceiros

```bash
# Instalar e configurar
npm install @ngrx/signals

# Algumas bibliotecas possuem schematics
ng add @ngrx/store
```


## Atualizar Angular

```bash
# Verificar atualizações
ng update

# Atualizar core e CLI do Angular
ng update @angular/core @angular/cli

# Atualizar todos os pacotes
ng update --all

# Forçar atualização (ignorar dependências peer)
ng update @angular/core @angular/cli --force
```


## Análise de Performance

```bash
# Build com estatísticas
ng build -c production --stats-json

# Analisar bundle (instalar webpack-bundle-analyzer)
npx webpack-bundle-analyzer dist/my-app/browser/stats.json
```


## Cache

```bash
# Habilitar cache persistente de build (padrão no v20+)
# Configurado no angular.json:
{
  "cli": {
    "cache": {
      "enabled": true,
      "path": ".angular/cache",
      "environment": "all"
    }
  }
}

# Limpar cache
rm -rf .angular/cache
```

Para configurações avançadas, veja:

- [Custom Schematics](references/custom-schematics.md)
- [Build Optimization](references/build-optimization.md)
- [Multi-Project Workspace](references/multi-project-workspace.md)
- [CI/CD Configuration](references/cicd-configuration.md)
- [Path Aliases](references/path-aliases.md)
- [Proxy Configuration](references/proxy-configuration.md)
- [Custom Builders](references/custom-builders.md)
- [Debugging](references/debugging.md)
- [Package Scripts](references/package-scripts.md)
