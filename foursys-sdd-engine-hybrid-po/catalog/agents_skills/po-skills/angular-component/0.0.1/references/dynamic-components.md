# Componentes Dinâmicos

Usando `@defer` para lazy loading da UI:

```typescript
@Component({
  template: `
    @defer (on viewport) {
      <app-heavy-chart [data]="chartData()" />
    } @placeholder {
      <div class="chart-placeholder">Carregando gráfico...</div>
    } @loading (minimum 500ms) {
      <app-spinner />
    } @error {
      <p>Falha ao carregar gráfico</p>
    }
  `,
})
export class DashboardComponent {
  chartData = input.required<ChartData>();
}
```

Defer triggers:
- `on viewport` - Quando o elemento entra na viewport
- `on idle` - Quando o navegador está em idle
- `on interaction` - Na interação do usuário (clique, foco)
- `on hover` - No hover do mouse
- `on immediate` - Imediatamente após o conteúdo não diferido
- `on timer(500ms)` - Após o atraso especificado
- `when condition` - Quando a expressão se torna verdadeira

```typescript
@Component({
  template: `
    @defer (on interaction; prefetch on idle) {
      <app-comments [postId]="postId()" />
    } @placeholder {
      <button>Carregar Comentários</button>
    }
  `,
})
export class PostComponent {
  postId = input.required<string>();
}
```