---
name: 'angular-design-system'
description: "Orienta integração de Design Systems em projetos Angular v20+ (Angular Material v18+, PrimeNG v17+, ou DS customizado). Cobre instalação, theming com tokens, componentes standalone, acessibilidade WCAG AA, customização via CSS Custom Properties e boas práticas para não acoplar o componente ao DS. Use ao iniciar ou padronizar uso de DS em projetos Angular."
metadata:
  version: "0.1.0"
---

# Skill: angular-design-system

Guia para integrar e usar **Design Systems** em projetos Angular v20+ standalone.

---

## Quando usar

- Ao configurar um novo projeto Angular com DS corporativo ou open-source.
- Ao adicionar componentes do DS a features existentes.
- Para garantir theming consistente via tokens (sem hardcoded colors/sizes).
- Para verificar conformidade WCAG AA nos componentes do DS.

---

## Opções de Design System

### Angular Material (Google — default)

**Quando usar:** Projetos sem DS corporativo, aplicações internas, prototipação rápida.

```bash
ng add @angular/material
```

```typescript
// app.config.ts — provideAnimationsAsync para Material
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideRouter(routes)
  ]
};
```

Uso standalone:
```typescript
import { MatButtonModule, MatInputModule, MatFormFieldModule } from '@angular/material';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  template: `
    <mat-form-field>
      <mat-label>Nome</mat-label>
      <input matInput [formControl]="nome" />
      @if (nome.hasError('required')) {
        <mat-error>Nome é obrigatório</mat-error>
      }
    </mat-form-field>
    <button mat-raised-button color="primary" (click)="salvar()">Salvar</button>
  `
})
export class FormularioComponent {
  protected readonly nome = new FormControl('', { nonNullable: true, validators: [Validators.required] });
}
```

---

### PrimeNG (Primetek)

**Quando usar:** Aplicações corporativas com tabelas complexas, dashboards, DataGrid.

```bash
npm install primeng @primeng/themes
```

```typescript
// app.config.ts
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),
    provideRouter(routes)
  ]
};
```

Uso standalone:
```typescript
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [TableModule, ButtonModule],
  template: `
    <p-table [value]="produtos()" [paginator]="true" [rows]="10">
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="nome">Nome <p-sortIcon field="nome" /></th>
          <th>Valor</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-produto>
        <tr>
          <td>{{ produto.nome }}</td>
          <td>{{ produto.valor | currency:'BRL' }}</td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class TabelaProdutosComponent {
  protected readonly produtos = signal<Produto[]>([]);
}
```

---

## Theming com CSS Custom Properties (tokens)

```scss
// styles.scss — definição de tokens de design
:root {
  // Cores primárias
  --color-primary-500: #1976d2;
  --color-primary-600: #1565c0;
  --color-primary-on: #ffffff;

  // Tipografia
  --font-size-body: 1rem;
  --font-size-heading-1: 2rem;
  --font-size-label: 0.875rem;

  // Espaçamento
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  // Bordas
  --border-radius-sm: 4px;
  --border-radius-md: 8px;

  // Sombras
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.1);
}

// Tema escuro
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary-500: #90caf9;
    --color-primary-on: #000000;
  }
}
```

Uso nos componentes:
```scss
// produto-card.component.scss
.produto-card {
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-md);

  h2 {
    font-size: var(--font-size-heading-1);
    color: var(--color-primary-500);
  }
}
```

---

## Acessibilidade WCAG AA obrigatória

### Contraste
- Texto normal: mínimo **4.5:1** contra o fundo
- Texto grande (18pt+): mínimo **3:1**
- Componentes interativos: mínimo **3:1** para a borda/indicador de foco

### Keyboard Navigation
```typescript
// Componentes interativos devem ser acessíveis por teclado
@Component({
  template: `
    <!-- ✅ Correto — botão nativo tem foco e Enter/Space -->
    <button type="button" (click)="acao()">Ação</button>

    <!-- ❌ Evitar — div sem foco nativo -->
    <div (click)="acao()">Ação</div>

    <!-- ✅ Se precisar usar div, adicionar role e tabindex -->
    <div role="button" tabindex="0"
         (click)="acao()"
         (keydown.enter)="acao()"
         (keydown.space)="$event.preventDefault(); acao()">
      Ação
    </div>
  `
})
```

### ARIA Labels
```html
<!-- Ícones sem texto visível devem ter aria-label -->
<button mat-icon-button aria-label="Fechar modal" (click)="fechar()">
  <mat-icon>close</mat-icon>
</button>

<!-- Campos de formulário -->
<input id="busca" type="search" aria-label="Buscar produtos" [formControl]="termoBusca" />

<!-- Status dinâmico -->
<div role="status" aria-live="polite">
  @if (carregando()) { Carregando... }
  @if (erro()) { Erro ao carregar produtos }
</div>
```

---

## Isolando o componente do DS (evitar lock-in)

Para reduzir acoplamento com o DS, crie wrappers na pasta `shared/components/`:

```typescript
// shared/components/button/button.component.ts
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <button
      mat-raised-button
      [color]="color()"
      [disabled]="disabled()"
      [type]="type()"
      (click)="clicked.emit()">
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  protected readonly color = input<'primary' | 'accent' | 'warn'>('primary');
  protected readonly disabled = input(false);
  protected readonly type = input<'button' | 'submit'>('button');
  readonly clicked = output<void>();
}
```

Assim, trocar `MatButtonModule` por `ButtonModule` (PrimeNG) afeta apenas o wrapper — não todos os componentes do projeto.

---

## Checklist de Implementação

- [ ] DS instalado e configurado em `app.config.ts`
- [ ] Tokens de design definidos em `:root` via CSS Custom Properties
- [ ] Componentes DS importados individualmente nos `@Component({ imports: [...] })`
- [ ] Sem import de `NgModule` do DS — apenas imports standalone
- [ ] Contraste WCAG AA verificado para textos e componentes interativos
- [ ] `aria-label` em todos os botões de ícone
- [ ] `role="status" aria-live="polite"` em estados dinâmicos de carregamento/erro
- [ ] Wrappers em `shared/components/` para componentes DS usados amplamente
- [ ] `ChangeDetectionStrategy.OnPush` em todos os componentes que usam DS
