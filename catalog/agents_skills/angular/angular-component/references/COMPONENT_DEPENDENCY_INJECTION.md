# Injeção de Dependência em Componentes

O Angular moderno (v16+) recomenda o uso da função **`inject()`** em vez da injeção tradicional via construtor. Isso torna o código mais limpo, facilita a herança de classes e melhora a tipagem de serviços opcionais.

## Padrão Recomendado: Função inject()

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { APP_CONFIG } from './app.config';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <nav>
      <button (click)="navigateToProfile()">Perfil</button>
    </nav>
  `,
})
export class DashboardComponent {
  // Injeção de serviços e tokens
  private router = inject(Router);
  private userService = inject(UserService);
  private config = inject(APP_CONFIG);
  
  // Injeção opcional (não quebra se o serviço não existir)
  private analytics = inject(AnalyticsService, { optional: true });
  
  // Injeção com restrição de visibilidade (busca apenas no injetor deste componente)
  private localLogger = inject(LocalLoggerService, { self: true });
  
  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
```

## Vantagens do inject()

1.  **Herança Simplificada**: Não é necessário passar dependências para o `super()` em classes filhas.
2.  **Escopo**: Pode ser usado em funções utilitárias fora de classes (desde que chamadas no contexto de injeção).
3.  **Clean Code**: Evita construtores gigantes e poluição visual na definição da classe.

---
> [!IMPORTANT]
> **Contexto de Injeção**: A função `inject()` só pode ser utilizada durante a construção do componente (na definição de campos da classe ou no construtor). Não tente utilizá-la dentro de métodos disparados por eventos (ex: `onClick`).

