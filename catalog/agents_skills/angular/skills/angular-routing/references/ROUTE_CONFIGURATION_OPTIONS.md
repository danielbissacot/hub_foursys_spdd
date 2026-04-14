# Opções de configuração de rota

### Opções completas de rota

```typescript
{
  path: 'users/:id',
  component: UserComponent,
  
  // Lazy loading alternatives
  loadComponent: () => import('./user.component').then(m => m.UserComponent),
  loadChildren: () => import('./user.routes').then(m => m.userRoutes),
  
  // Guards
  canActivate: [authGuard],
  canActivateChild: [authGuard],
  canDeactivate: [unsavedChangesGuard],
  canMatch: [featureFlagGuard],
  
  // Data
  resolve: { user: userResolver },
  data: { title: 'User Profile', animation: 'userPage' },
  
  // Children
  children: [...],
  
  // Outlet
  outlet: 'sidebar',
  
  // Path matching
  pathMatch: 'full', // or 'prefix'
  
  // Title
  title: 'User Profile',
  // Or dynamic title
  title: userTitleResolver,
}
```

# Dynamic Title Resolver

```typescript
export const userTitleResolver: ResolveFn<string> = (route) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id')!;
  return userService.getById(id).pipe(
    map(user => `${user.name} - Profile`)
  );
};
```

