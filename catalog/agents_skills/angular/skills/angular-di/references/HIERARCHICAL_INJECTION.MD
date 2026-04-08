# Injeção Hierárquica

## Injeção na Árvore de Componentes

```typescript
// Pai fornece serviço
@Component({
  selector: 'app-form-container',
  providers: [FormStateService],
  template: `
    <app-form-header />
    <app-form-body />
    <app-form-footer />
  `,
})
export class FormContainerComponent {
  private formState = inject(FormStateService);
}

// Filhos compartilham a mesma instância
@Component({
  selector: 'app-form-body',
  template: `...`,
})
export class FormBodyComponent {
  // Obtém a mesma instância do pai
  private formState = inject(FormStateService);
}

// Netos também compartilham
@Component({
  selector: 'app-form-field',
  template: `...`,
})
export class FormFieldComponent {
  // Obtém a mesma instância do ancestral
  private formState = inject(FormStateService);
}
```

## viewProviders vs providers

```typescript
@Component({
  selector: 'app-tabs',
  // providers: Disponível para componente E filhos de conteúdo
  providers: [TabsService],
  
  // viewProviders: Disponível apenas para componente E filhos de view
  // NÃO disponível para filhos de conteúdo (<ng-content>)
  viewProviders: [InternalTabsService],
  
  template: `
    <div class="tabs">
      <ng-content /> <!-- Filhos de conteúdo não podem acessar viewProviders -->
    </div>
  `,
})
export class TabsComponent {}
```

