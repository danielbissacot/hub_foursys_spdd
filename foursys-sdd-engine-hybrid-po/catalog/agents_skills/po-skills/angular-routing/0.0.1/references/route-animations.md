# Animações de rota

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'home', component: HomeComponent, data: { animation: 'HomePage' } },
  { path: 'about', component: AboutComponent, data: { animation: 'AboutPage' } },
];

// app.component.ts
@Component({
  imports: [RouterOutlet],
  template: `
    <div [@routeAnimations]="getRouteAnimationData()">
      <router-outlet />
    </div>
  `,
  animations: [
    trigger('routeAnimations', [
      transition('HomePage <=> AboutPage', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }),
        ]),
        query(':enter', [style({ left: '-100%' })]),
        query(':leave', animateChild()),
        group([
          query(':leave', [animate('300ms ease-out', style({ left: '100%' }))]),
          query(':enter', [animate('300ms ease-out', style({ left: '0%' }))]),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent {
  getRouteAnimationData() {
    return this.route.firstChild?.snapshot.data['animation'];
  }
}
```
