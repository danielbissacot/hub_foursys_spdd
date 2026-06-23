# Error Boundaries

```typescript
@Component({
  selector: 'app-error-boundary',
  template: `
    @if (hasError()) {
      <div class="error">
        <h3>Algo deu errado</h3>
        <button (click)="retry()">Tentar Novamente</button>
      </div>
    } @else {
      <ng-content />
    }
  `,
})
export class ErrorBoundaryComponent {
  hasError = signal(false);
  private errorHandler = inject(ErrorHandler);
  
  retry() {
    this.hasError.set(false);
  }
}
```