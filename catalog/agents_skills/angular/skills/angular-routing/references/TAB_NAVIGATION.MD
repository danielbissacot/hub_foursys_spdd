# Navegação por abas

```typescript
// tabs-layout.component.ts
@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="tabs">
      @for (tab of tabs; track tab.path) {
        <a 
          [routerLink]="tab.path" 
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: tab.exact }"
        >
          {{ tab.label }}
        </a>
      }
    </div>
    <div class="tab-content">
      <router-outlet />
    </div>
  `,
})
export class TabsLayoutComponent {
  tabs = [
    { path: './', label: 'Overview', exact: true },
    { path: 'details', label: 'Details', exact: false },
    { path: 'settings', label: 'Settings', exact: false },
  ];
}

// Routes
{
  path: 'account',
  component: TabsLayoutComponent,
  children: [
    { path: '', component: AccountOverviewComponent },
    { path: 'details', component: AccountDetailsComponent },
    { path: 'settings', component: AccountSettingsComponent },
  ],
}
```

