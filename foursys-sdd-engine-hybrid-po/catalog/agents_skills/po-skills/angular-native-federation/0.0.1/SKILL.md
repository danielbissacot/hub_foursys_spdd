---
name: angular-native-federation
description: Build Angular Micro Frontend (MFE) architectures using @angular-architects/native-federation with browser-native ESM and Import Maps. Use when setting up a shell (host) application, creating remote MFEs, configuring shared dependencies, loading remotes via routes initializing federation bootstrap, writing federation.config.js, creating federation manifests, migrating from webpack Module Federation, or implementing any Angular MFE architecture with Native Federation. Also use when encountering shared package errors, version mismatches, or CommonJS compatibility issues in federated Angular apps.
metadata:
  version: "0.0.1"
---

# Angular Native Federation

Build Micro Frontend architectures with `@angular-architects/native-federation` — a browser-native
implementation using ESM and Import Maps that integrates with Angular's esbuild ApplicationBuilder.

## Mental Model

- **Host (Shell):** Loads remotes on demand via lazy loading. Doesn't know remotes at compile time.
- **Remote (MFE):** Separately built/deployed app that exposes ESM modules.
- **Shared Dependencies:** Downloaded once, shared at runtime (e.g., Angular, RxJS).
- **Version Mismatch:** Configurable strategies — fallback, semver compat, or error.

## Quick Setup

### 1. Install

```
npm i @angular-architects/native-federation -D
```

### 2. Initialize Projects

**Shell (host):**
```
ng g @angular-architects/native-federation:init --project shell --port 4200 --type dynamic-host
```

**Remote (MFE):**
```
ng g @angular-architects/native-federation:init --project mfe1 --port 4201 --type remote
```

### 3. Configure Remote — `federation.config.js`

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'mfe1',
  exposes: {
    './Component': './projects/mfe1/src/app/app.component.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],
});
```

### 4. Configure Host — `federation.config.js`

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'my-host',
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
  skip: ['rxjs/ajax', 'rxjs/fetch', 'rxjs/testing', 'rxjs/webSocket'],
});
```

### 5. Bootstrap — `main.ts`

**Host:**
```typescript
import { initFederation } from '@angular-architects/native-federation';

initFederation('/assets/federation.manifest.json')
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
```

**Remote:**
```typescript
import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
```

### 6. Federation Manifest — `src/assets/federation.manifest.json`

```json
{
  "mfe1": "http://localhost:4201/remoteEntry.json"
}
```

### 7. Load Remote via Route

```typescript
import { loadRemoteModule } from '@angular-architects/native-federation';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'flights',
    loadComponent: () =>
      loadRemoteModule('mfe1', './Component').then((m) => m.AppComponent),
  },
  { path: '**', component: NotFoundComponent },
];
```

## Version Matching

Match `@angular-architects/native-federation` version to Angular version:
- Angular 18.x → `native-federation@18.x`
- Angular 19.x → `native-federation@19.x`
- Angular 20.x → `native-federation@20.x`
- Angular 21.x → `native-federation@21.x`

## Workflow: Adding a New Remote

1. Create new Angular app or use existing project
2. Run schematic: `ng g @angular-architects/native-federation:init --project <name> --port <port> --type remote`
3. Configure `exposes` in `federation.config.js`
4. Add remote entry to shell's `federation.manifest.json`
5. Add lazy route with `loadRemoteModule` in shell's routes
6. Start remote first, then shell

## Workflow: Migrating from webpack Module Federation

1. Install: `npm i @angular-architects/native-federation -D`
2. Run init schematic per project
3. Replace all imports from `@angular-architects/module-federation` → `@angular-architects/native-federation`
4. Do NOT mix the two packages

## Detailed References

- **Shell (host) setup**: See [references/shell-setup.md](references/shell-setup.md) for host configuration, manifest loading, dynamic service-based manifests, monorepo shared mappings
- **Remote (MFE) setup**: See [references/remote-setup.md](references/remote-setup.md) for remote configuration, exposing components/routes, multiple entry points
- **Advanced patterns**: See [references/advanced-patterns.md](references/advanced-patterns.md) for SSR, I18N, localization, troubleshooting, CommonJS handling, migration guide
