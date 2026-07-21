# Configuração de Proxy

## Proxy de Desenvolvimento

```json
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  },
  "/auth": {
    "target": "http://localhost:4000",
    "secure": false,
    "pathRewrite": {
      "^/auth": ""
    }
  }
}
```

## Configurar no angular.json

```json
{
  "serve": {
    "options": {
      "proxyConfig": "proxy.conf.json"
    }
  }
}
```

## Ou via CLI

```bash
ng serve --proxy-config proxy.conf.json
```
