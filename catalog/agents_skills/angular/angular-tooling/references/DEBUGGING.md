# Depuração

## Source Maps

```json
{
  "configurations": {
    "development": {
      "sourceMap": true
    },
    "production": {
      "sourceMap": {
        "scripts": true,
        "styles": false,
        "hidden": true,
        "vendor": false
      }
    }
  }
}
```

## Logging Verboso

```bash
ng build --verbose
ng serve --verbose
```

## Depurar Testes

```bash
# Run tests with debugging
ng test --browsers=Chrome

# In Chrome DevTools, open Sources tab and set breakpoints
```
