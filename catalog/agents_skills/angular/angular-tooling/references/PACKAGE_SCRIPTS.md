# Scripts do Package

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "build:prod": "ng build -c production",
    "test": "ng test",
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless --code-coverage",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "analyze": "ng build -c production --stats-json && npx webpack-bundle-analyzer dist/my-app/browser/stats.json",
    "update": "ng update"
  }
}
```
