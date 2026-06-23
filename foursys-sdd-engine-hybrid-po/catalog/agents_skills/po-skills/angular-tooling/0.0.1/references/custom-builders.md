# Custom Builders

## Usando esbuild (padrão no v20+)

```json
{
  "architect": {
    "build": {
      "builder": "@angular-devkit/build-angular:application",
      "options": {
        "browser": "src/main.ts"
      }
    }
  }
}
```

# Configuração SSR

```bash
# Add SSR
ng add @angular/ssr
```

```json
{
  "architect": {
    "build": {
      "options": {
        "server": "src/main.server.ts",
        "prerender": true,
        "ssr": {
          "entry": "server.ts"
        }
      }
    }
  }
}
```