---
name: angular-vertical-slice
description: Scaffold e valide a arquitetura Vertical Slice DUPE em projetos Angular. Use quando precisar criar novos domínios, features, sub-domains, guards/interceptors ou shared seguindo o padrão Vertical Slice, ou quando precisar executar validação arquitetural, resolver violações, ver exemplos de implementação. Aciona em criação de domínios, scaffold de features, guards, interceptors, validação de arquitetura, troubleshooting de erros, ou quando o usuário mencionar vertical slice, scaffold, dupe-vertical-slice.
metadata:
  version: "0.0.1"
---

# Angular Vertical Slice — Scaffold & Validação

Usar esta skill como hub operacional para scaffold, correções rápidas e consulta progressiva de exemplos e troubleshooting.

> Para regras centrais de arquitetura, import boundary, nomenclatura e estrutura obrigatória, consultar a instruction `angular-vertical-slice-arch`.

## Scaffold de Estruturas

### Novo Domínio Completo

```bash
DOMAIN=<nome-kebab-case>
mkdir -p src/app/$DOMAIN/{feat-<feature>/pages,ui,data-access/{api,services,state},domain/models/dtos,utils,pages}
```

### Nova Feature em Domínio Existente

```bash
DOMAIN=<dominio>
FEAT=<nome-kebab-case>
mkdir -p src/app/$DOMAIN/feat-$FEAT/{pages,dtos,mappers}
```

### Nova Feature com data-access próprio

```bash
DOMAIN=<dominio>
FEAT=<nome-kebab-case>
mkdir -p src/app/$DOMAIN/feat-$FEAT/{pages,dtos,mappers,data-access/{api,services,state}}
```

### Novo Sub-domain

```bash
DOMAIN=<dominio>
SUB=<nome-kebab-case>
mkdir -p src/app/$DOMAIN/sub-$SUB/{feat-<feature>/pages,ui,data-access/{api,services,state},domain/models/dtos,utils}
```

### Guards em domínio existente

```bash
DOMAIN=<dominio>
mkdir -p src/app/$DOMAIN/data-access/guards
```

### Guards e Interceptors cross-domain (shared)

```bash
mkdir -p src/app/shared/data-access/{guards,interceptors}
```

### Shared (estrutura global)

```bash
mkdir -p src/app/shared/{data-access,ui,utils}
```

## Correções Rápidas por Código de Erro

| Código | Correção |
|--------|----------|
| `DOMAIN_INVALID_NAME` | `git mv src/app/OldName src/app/old-name` |
| `DOMAIN_DISALLOWED_NAME` | Renomear domínio — `features`, `modules` e `core` são proibidos. Usar nomes de domínio de negócio (ex: `auth`, `products`) |
| `DATA_ACCESS_STRUCTURE` | `mkdir -p <dominio>/data-access/{api,services,state}` |
| `FEAT_DATA_ACCESS_STRUCTURE` | `mkdir -p <dominio>/feat-<nome>/data-access/{api,services,state}` |
| `DOMAIN_FOLDER_STRUCTURE` | `mkdir -p <dominio>/domain/models` |
| `MODELS_STRUCTURE` | `mkdir -p <dominio>/domain/models/dtos` |
| `SHARED_STRUCTURE` | `mkdir -p src/app/shared/{data-access,ui,utils}` |
| `COMPOSABLE_FEAT_MISSING_PAGES` | `mkdir -p <dominio>/pages` (criar `pages/` no nível do domain) |
| `DOMAIN_OUTSIDE_APP` | `git mv src/<dominio> src/app/<dominio>` |
| `IMPORT_BOUNDARY_VIOLATION` | Mover import para camada permitida (ver instruction) |
| `CROSS_DOMAIN_IMPORT` | Mover código compartilhado para `src/app/shared/` |
| `CROSS_SUBDOMAIN_IMPORT` | Mover código para `domain/` do domínio pai |
| `DATA_ACCESS_INTERNAL_BOUNDARY` | Respeitar regras internas: `api/` só acessa `dtos/utils`; `guards/` não acessa `api/`; `interceptors/` não acessa `services/state/` |
| `DATA_ACCESS_VISIBILITY_VIOLATION` | `api/` e `interceptors/` são privados; `guards/` visível apenas para `pages/`; usar `services/` para acesso externo |
| `DATA_ACCESS_DTO_ONLY` | Em `api/`, usar apenas `domain/models/dtos/` |
| `UI_DISALLOWED_SUBFOLDER` | Remover subpastas proibidas de `ui/` (`data-access`, `feat-*`, `models`, `api`) |
| `PAGES_DISALLOWED_SUBFOLDER` | Remover subpastas proibidas de `pages/` (`data-access`, `feat-*`, `models`, `api`) |
| `FEAT_INVALID_SUBFOLDER` | Usar apenas subpastas permitidas em `feat-*` (`pages`, `data-access`, `models`, `dtos`, `mappers`) |

## Checklist de Conformidade

- [ ] Estrutura `src/app/<domínio>/` com kebab-case
- [ ] Nenhum domínio direto chamado `features`, `modules` ou `core`
- [ ] `feat-*` routed usa `pages/`; `feat-*` composável tem cobertura por `pages/` no domínio
- [ ] `data-access/` contém `api/`, `services/`, `state/`
- [ ] `guards/` domain-específicos ficam em `<domain>/data-access/guards/`
- [ ] Interceptors ficam em `shared/data-access/interceptors/`
- [ ] `domain/` contém `models/` com `dtos/`
- [ ] `shared/` contém `data-access/`, `ui/`, `utils/`
- [ ] Nenhuma pasta `constants/`; co-location aplicado corretamente
- [ ] Import boundaries respeitados (matriz de dependências)
- [ ] Nenhum import cruzado entre domínios ou sub-domains
- [ ] `api/` acessível apenas por `services/`
- [ ] `guards/` acessíveis apenas por `pages/`
- [ ] CLI de validação executando sem erros

## Referências Detalhadas

- **Exemplos de implementação**: Consultar [references/examples.md](references/examples.md) para código de Feature, UI, API, Service, Guard e Interceptor.
- **Códigos de validação, CLI e troubleshooting**: Consultar [references/validation-codes.md](references/validation-codes.md) para tabela completa de códigos, instalação, execução e resolução de violações.
