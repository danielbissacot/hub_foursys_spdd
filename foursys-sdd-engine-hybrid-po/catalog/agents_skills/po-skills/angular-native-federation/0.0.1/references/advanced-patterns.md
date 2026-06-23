## Table of Contents
- [SSR and Incremental Hydration](#ssr-and-incremental-hydration)
- [Angular I18N](#angular-i18n)
- [Angular Localization](#angular-localization)
- [Auto Shell Reloading (DX)](#auto-shell-reloading-dx)
- [Combining Native Federation with Module Federation](#combining-native-federation-with-module-federation)
- [Manual Package Entry Points](#manual-package-entry-points)
- [Troubleshooting](#troubleshooting)
  - [Shared Package Preparation Errors](#shared-package-preparation-errors)
  - [CommonJS Packages](#commonjs-packages)
  - [Build Cache](#build-cache)
  - [Version Mismatch Strategies](#version-mismatch-strategies)
- [Migration from webpack Module Federation](#migration-from-webpack-module-federation)

## SSR and Incremental Hydration
- Use this starting with `18@latest`.
- Configure SSR and hydration in `angular.json`.
- Point `federation.manifest.json` to SSR-compatible remote entries.

```json
{
  "projects": {
    "shell": {
      "architect": {
        "build": {
          "options": {
            "ssr": true,
            "outputMode": "server"
          }
        }
      }
    }
  }
}
```

```json
{
  "mfe1": "http://localhost:4201/remoteEntry.json"
}
```

## Angular I18N
- Use this starting with `19.0.13`.
- Add `@angular/localize` to shell and every remote.
- Configure I18N in `angular.json`. Do **not** rely on CLI parameters; the Native Federation Builder does not forward them.
- In production, map `federation.manifest.json` to the correct localized remote for each language.

```bash
ng add @angular/localize --project shell
ng add @angular/localize --project mfe1
```

```json
{
  "projects": {
    "shell": {
      "i18n": {
        "sourceLocale": "en-US",
        "locales": {
          "de": "src/locale/messages.de.xlf",
          "fr": "src/locale/messages.fr.xlf"
        }
      }
    }
  }
}
```

```json
{
  "mfe1": "https://cdn.example.com/de/mfe1/remoteEntry.json"
}
```

## Angular Localization
Use built-in localization support from `20.0.6` onward with `ignoreUnusedDeps`.

```javascript
features: {
  ignoreUnusedDeps: true,
}
```

Use explicit locale sharing on older versions.

```javascript
shared: {
  ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  ...shareAngularLocales(['en', 'de', 'fr']),
}
```

## Auto Shell Reloading (DX)
- Enable Native Federation dev flow.
- Start shell and remotes in watch mode.
- Let the shell reload automatically when a remote finishes rebuilding.
- Stop doing manual browser refreshes during local development.

```bash
npm run start:shell
npm run start:mfe1
```

## Combining Native Federation with Module Federation
- Use the bridging solution to load webpack Module Federation remotes into a Native Federation host.
- Migrate incrementally from webpack to esbuild.
- Keep shared dependencies aligned across both federation types.

```typescript
await initFederation('/assets/federation.manifest.json');
const routes: Routes = [
  {
    path: 'legacy',
    loadChildren: () => loadRemoteModule('legacyApp', './Module').then(m => m.RemoteModule),
  },
];
```

## Manual Package Entry Points
Declare package metadata manually when a package does not expose a standard entry point.

```javascript
shared: {
  ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  'test-pkg': {
    packageInfo: {
      entryPoint: '/path/to/test-pkg/entry.mjs',
      version: '1.0.0',
      esm: true,
    },
  },
},
```

## Troubleshooting

### Shared Package Preparation Errors
- Move Node-only packages to `devDependencies`.
- Add problematic packages to `skip` in `federation.config.js`.
- Delete `node_modules/.cache` to force package preparation again.

```javascript
module.exports = withNativeFederation({
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
  skip: ['ws', 'node-fetch'],
});
```

### CommonJS Packages
- Let Native Federation auto-convert CommonJS to ESM first.
- Expect Angular Package Format libraries to work out of the box; Angular CLI builds them as ESM.
- Add manual package entry points for older CommonJS packages when auto-detection fails.

### Build Cache
- Reuse `node_modules/.cache` across CI builds.
- Delete it to force a clean rebuild.

```bash
rm -rf node_modules/.cache
```

### Version Mismatch Strategies
- Set `singleton: true` to load one shared version and prefer the highest compatible version.
- Set `strictVersion: true` to fail fast on incompatible versions.
- Set `requiredVersion: 'auto'` to read versions from `package.json`.

```javascript
shared: {
  '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
}
```

## Migration from webpack Module Federation
1. Install: `npm i @angular-architects/native-federation -D`
2. Run the schematic for each project: `ng g @angular-architects/native-federation:init --project <name> --type <remote|dynamic-host>`
3. Replace imports from `@angular-architects/module-federation` with `@angular-architects/native-federation`.
4. Do not mix the two packages in the same project.
5. Update `angular.json` to use the new builder.

```json
{
  "builder": "@angular-architects/native-federation:build"
}
```
