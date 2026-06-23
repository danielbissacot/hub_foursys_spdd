# Angular Native Federation Shell (Host) Setup

## Table of Contents
- [Schematic Setup](#schematic-setup)
- [federation.config.js (Host)](#federationconfigjs-host)
- [main.ts (Host Bootstrap)](#maints-host-bootstrap)
- [bootstrap.ts](#bootstrapts)
- [federation.manifest.json](#federationmanifestjson)
- [Loading Remotes via Routes](#loading-remotes-via-routes)
- [Sharing Mapped Paths (Monorepo)](#sharing-mapped-paths-monorepo)
- [Dynamic Manifest Loading (Service-Based)](#dynamic-manifest-loading-service-based)

## Schematic Setup
Run the Native Federation schematic against the shell app:

```bash
ng g @angular-architects/native-federation:init --project shell --port 4200 --type dynamic-host
```

Use `dynamic-host` when the shell must read the remote manifest at runtime. Use `host` when the shell can keep remote configuration static in source control.

- `dynamic-host`: load remotes from `federation.manifest.json` or another runtime source.
- `host`: hard-code remote configuration during build time.

## federation.config.js (Host)
Define the host federation config:

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'my-host',
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },
  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ],
});
```

Use each option as follows:

- `name`: Set the container name for the shell. Keep it unique across the federation.
- `shared`: Declare packages that host and remotes must reuse.
- `shareAll(...)`: Share all detected dependencies instead of enumerating them manually.
- `singleton: true`: Force one shared instance for a package. Use this for Angular framework packages and other stateful libraries.
- `strictVersion: true`: Reject incompatible shared versions instead of silently falling back.
- `requiredVersion: 'auto'`: Read the required version from `package.json` automatically.
- `skip`: Exclude packages from sharing when they are unused, optional, problematic, or should stay local to a build.

## main.ts (Host Bootstrap)
Initialize federation before Angular bootstraps:

```typescript
import { initFederation } from '@angular-architects/native-federation';

initFederation('/assets/federation.manifest.json')
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
```

Call `initFederation` first. Do not import Angular bootstrap code before federation initialization finishes. Change the manifest path per environment if different deployments need different remote URLs.

## bootstrap.ts
Load Angular only after federation initialization succeeds:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

Keep `bootstrap.ts` focused on normal Angular startup. Let `main.ts` own federation initialization.

## federation.manifest.json
Create the runtime manifest in `src/assets/federation.manifest.json`:

```json
{
  "mfe1": "http://localhost:4201/remoteEntry.json",
  "mfe2": "http://localhost:4202/remoteEntry.json"
}
```

Use it as follows:

- Keys are the remote names passed to `loadRemoteModule(...)`.
- Values are URLs to each remote's `remoteEntry.json`.
- Store the file under `src/assets/` so Angular serves it as a static asset.
- Swap the file per deployment environment to point the shell at different remote endpoints.

## Loading Remotes via Routes
Load standalone components or route arrays directly from remotes:

```typescript
import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'flights',
    loadComponent: () =>
      loadRemoteModule('mfe1', './Component').then((m) => m.AppComponent),
  },
  {
    path: 'booking',
    loadChildren: () =>
      loadRemoteModule('mfe2', './Routes').then((m) => m.BOOKING_ROUTES),
  },
  { path: '**', component: NotFoundComponent },
];
```

Use these patterns:

- `loadComponent`: Load one standalone component exposed by a remote.
- `loadChildren`: Load remote route definitions or a lazy route tree.
- `loadRemoteModule('mfe1', './Component')`: Match `'mfe1'` to the manifest key and `'./Component'` or `'./Routes'` to the remote `exposes` entry.
- Put the wildcard route last. Angular matches routes top-down, so `**` must remain the final fallback.

## Sharing Mapped Paths (Monorepo)
Share only selected path-mapped libraries from the workspace:

```javascript
module.exports = withNativeFederation({
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
  sharedMappings: ['@my-org/auth-lib', '@my-org/ui/*'],
  features: {
    mappingVersion: true,
  },
});
```

Use these options intentionally:

- `sharedMappings`: Restrict sharing to specific TypeScript path mappings instead of sharing every mapped library.
- `features.mappingVersion: true`: Add version metadata for shared mapped paths so the runtime can validate compatibility more safely.
- Read mappings from `tsconfig.base.json` or `tsconfig.json`, depending on workspace structure.

## Dynamic Manifest Loading (Service-Based)
Load the manifest from a backend service when remote endpoints change dynamically:

```typescript
import { initFederation } from '@angular-architects/native-federation';

initFederation(fetchManifestFromService())
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));

async function fetchManifestFromService(): Promise<Record<string, string>> {
  const response = await fetch('/api/federation-manifest');
  return response.json();
}
```

Return a `Record<string, string>` shaped like `federation.manifest.json`. Use this pattern when environment files are insufficient or when the backend must decide remote endpoints at runtime.