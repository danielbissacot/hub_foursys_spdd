# Angular Native Federation Remote Setup

## Table of Contents
- [Schematic Setup](#schematic-setup)
- [federation.config.js (Remote)](#federationconfigjs-remote)
- [main.ts (Remote Bootstrap)](#maints-remote-bootstrap)
- [bootstrap.ts](#bootstrapts)
- [Exposing a Standalone Component](#exposing-a-standalone-component)
- [Exposing Routes](#exposing-routes)
- [Exposing Multiple Entry Points](#exposing-multiple-entry-points)
- [Running the Remote Standalone](#running-the-remote-standalone)
- [remoteEntry.json](#remoteentryjson)
- [Version Matching](#version-matching)

## Schematic Setup
```bash
ng g @angular-architects/native-federation:init --project mfe1 --port 4201 --type remote
```

Use `--type remote` to configure the application as a micro frontend provider.
Use a unique `--port` for every remote so the host can resolve each app without collisions.

## federation.config.js (Remote)
```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'mfe1',
  exposes: {
    './Component': './projects/mfe1/src/app/app.component.ts',
    './Routes': './projects/mfe1/src/app/app.routes.ts',
  },
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

Set each option explicitly:

- `name`: Define the remote name. Match this name in the host manifest or host remote configuration.
- `exposes`: Map short public entry-point names to source files. The host imports these keys, not the raw file paths.
- `shared`: Share framework and library dependencies across host and remotes.
- `shareAll(...)`: Start by sharing all package dependencies. Tighten this later if needed.
- `singleton: true`: Force one instance of shared packages such as Angular.
- `strictVersion: true`: Reject incompatible shared versions at runtime.
- `requiredVersion: 'auto'`: Read the required version from `package.json`.
- `skip`: Exclude packages that should not be bundled into the federation metadata.

Use `exposes` to publish stable contracts:

```javascript
exposes: {
  './Component': './projects/mfe1/src/app/app.component.ts',
  './Routes': './projects/mfe1/src/app/app.routes.ts',
  './Widget': './projects/mfe1/src/app/widget/widget.component.ts',
}
```

Expose common entry points like this:

- Standalone component: `./Component -> ./projects/mfe1/src/app/app.component.ts`
- Routes array for `loadChildren`: `./Routes -> ./projects/mfe1/src/app/app.routes.ts`
- Multiple entry points: add more keys such as `./Widget`, `./Header`, or `./FeatureShell`

Keep keys short and stable. Treat them as the public API of the remote.

## main.ts (Remote Bootstrap)
```typescript
import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
```

Call `initFederation()` without arguments in a remote. Do not pass a manifest.
Run it before Angular bootstrap so shared dependencies and exposed metadata are initialized first.

## bootstrap.ts
Use standard Angular bootstrap code. Keep the same bootstrap pattern as the host.

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
```

## Exposing a Standalone Component
```typescript
// app.component.ts - exposed as './Component'
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<h1>MFE1 works!</h1><router-outlet />`,
})
export class AppComponent {}
```

Expose a standalone component when the host will load a single UI entry point with `loadComponent`.

```typescript
{
  path: 'mfe1-component',
  loadComponent: () => import('mfe1/Component').then((m) => m.AppComponent),
}
```

Export the actual symbol the host will consume.

## Exposing Routes
```typescript
// app.routes.ts - exposed as './Routes'
import { Routes } from '@angular/router';

export const MFE1_ROUTES: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'details/:id', component: DetailComponent },
];
```

Expose a routes array when the host should mount a remote feature area with `loadChildren`.

```typescript
{
  path: 'mfe1',
  loadChildren: () => import('mfe1/Routes').then((m) => m.MFE1_ROUTES),
}
```

Export `Routes`, not a module. Keep the remote root route at `path: ''` so the host controls the mount path.

## Exposing Multiple Entry Points
```javascript
exposes: {
  './Component': './projects/mfe1/src/app/app.component.ts',
  './Routes': './projects/mfe1/src/app/app.routes.ts',
  './Widget': './projects/mfe1/src/app/widget/widget.component.ts',
},
```

Expose multiple contracts from one remote when the host needs different integration modes.
Use separate entry points for shell component, feature routes, and reusable widgets.
Avoid exposing deep internal files that are not intended for host consumption.

## Running the Remote Standalone
Remotes are full Angular applications. Run and validate them independently during development.

```bash
ng serve mfe1 -o
```

Start the remote standalone first when debugging remote-only issues.
Then connect it to the host to validate federation integration.

## remoteEntry.json
Do not author this file manually.
Generate it during build.
It contains metadata about:

- exposed modules
- shared dependencies
- remote name and entry points

The host reads `remoteEntry.json` to discover what the remote provides and how to load it.

## Version Matching
Match `@angular-architects/native-federation` to the Angular major version:

- Angular 18.x → native-federation 18.x
- Angular 19.x → native-federation 19.x
- Angular 20.x → native-federation 20.x
- Angular 21.x → native-federation 21.x

Do not mix majors. Upgrade Angular and `@angular-architects/native-federation` together.
