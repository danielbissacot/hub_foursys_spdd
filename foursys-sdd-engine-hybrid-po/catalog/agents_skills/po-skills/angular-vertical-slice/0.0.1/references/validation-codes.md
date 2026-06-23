# Validação, CLI e Troubleshooting — Angular Vertical Slice

## Table of Contents
- [CLI Installation & Execution](#cli-installation--execution)
- [CLI Integration](#cli-integration)
- [Optional Configuration](#optional-configuration)
- [Códigos de Validação](#códigos-de-validação)
- [Como Resolver Violações Comuns](#como-resolver-violações-comuns)

## CLI Installation & Execution

```bash
# Instalação
npm install -D @bradesco/dupe-lib-ng-vertical-slice@3.4.0

# Execução
npx @bradesco/dupe-lib-ng-vertical-slice
npx @bradesco/dupe-lib-ng-vertical-slice --cwd ./meu-projeto
npx @bradesco/dupe-lib-ng-vertical-slice --json
npx @bradesco/dupe-lib-ng-vertical-slice --config ./custom-config.json
npx @bradesco/dupe-lib-ng-vertical-slice --help
```

## CLI Integration

```json
{
  "scripts": {
    "lint:structure": "ng-vertical-slice",
    "pretest": "npm run lint:structure"
  }
}
```

```yaml
- name: Validate Angular Structure
  run: npx @bradesco/dupe-lib-ng-vertical-slice
```

## Optional Configuration

```json
// .vertical-slicerc.json
{
  "ignore": ["node_modules/**", "dist/**", ".angular/**", "src/app/legacy/**"],
  "report": { "failOnError": true }
}
```

## Códigos de Validação

| Código | Significado |
|--------|-------------|
| `TOP_LEVEL_MISSING` | Pasta `src/` obrigatória no root |
| `SRC_SUBFOLDER_MISSING` | `src/app/` obrigatória |
| `DOMAIN_INVALID_NAME` | Domínios devem ser kebab-case |
| `DOMAIN_DISALLOWED_NAME` | Domínios não podem usar nomes genéricos: `features`, `modules`, `core` |
| `DOMAIN_INVALID_SUBFOLDER` | Subpastas devem seguir padrões |
| `DATA_ACCESS_STRUCTURE` | `data-access/` deve conter `services/`, `state/` e `api/` |
| `MODELS_STRUCTURE` | `models/` deve conter `dtos/` |
| `DOMAIN_FOLDER_STRUCTURE` | `domain/` deve conter `models/` |
| `SHARED_STRUCTURE` | `shared/` deve conter `data-access/`, `ui/`, `utils/` |
| `DOMAIN_OUTSIDE_APP` | Domínios devem estar dentro de `src/app/` |
| `COMPOSABLE_FEAT_MISSING_PAGES` | Domain com `feat-*` sem `pages/` deve ter `pages/` no domain |
| `FEAT_INVALID_SUBFOLDER` | Subpastas de `feat-*` devem ser permitidas |
| `FEAT_DATA_ACCESS_STRUCTURE` | `data-access/` dentro de `feat-*` deve conter `services/`, `state/` e `api/` |
| `UI_DISALLOWED_SUBFOLDER` | `ui/` não pode conter `data-access`, `feat-*`, `models`, `api` |
| `PAGES_DISALLOWED_SUBFOLDER` | `pages/` não pode conter `data-access`, `feat-*`, `models`, `api` |
| `IMPORT_BOUNDARY_VIOLATION` | Imports devem respeitar matriz de dependências |
| `CROSS_DOMAIN_IMPORT` | Domínios são isolados entre si |
| `CROSS_SUBDOMAIN_IMPORT` | Sub-domains são isolados entre si |
| `DATA_ACCESS_INTERNAL_BOUNDARY` | Subpastas do data-access respeitam regras internas |
| `DATA_ACCESS_DTO_ONLY` | `api/` só pode acessar DTOs |
| `DATA_ACCESS_VISIBILITY_VIOLATION` | Código externo importa de subpasta privada do data-access |

## Como Resolver Violações Comuns

| Violação | Solução |
|----------|---------|
| `ui/` importando de `data-access/` | Mover lógica para `feat-*`. Passar dados via `@Input`/`input()` |
| Domínio A importando de Domínio B | Mover código compartilhado para `src/app/shared/` |
| Código externo importando de `api/` | Importar de `services/` ou `state/` |
| Feature importando `guards/` | Registrar o guard no router em `pages/` |
| Código tentando usar `interceptors/` por import direto | Registrar com `provideHttpClient(withInterceptors([...]))` |
| `api/` importando models genéricos | Usar apenas `domain/models/dtos/` na camada `api/` |
| Uso de pasta `constants/` | Aplicar co-location em `feat.constants.ts`, `domain.constants.ts` ou `app.constants.ts` |
| Sub-domain A importando de Sub-domain B | Mover código para `domain/` do domínio pai |
| Domain com feat composável sem `pages/` | Criar `src/app/<domain>/pages/` para orquestrar as features |
