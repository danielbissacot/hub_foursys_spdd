# Error Boundaries (Resiliência de UI)

Padrões para capturar erros em componentes e prevenir que falhas de renderização ou lógica quebrem a aplicação inteira. No Angular, implementamos isso através de um **Pattern de Componente de Fallback + Global ErrorHandler**.

## 1. Criando um Componente de Error Boundary

Diferente de outras bibliotecas, no Angular criamos um componente que "envolve" áreas críticas e gerencia o estado de erro.

```typescript
import { Component, ErrorHandler, inject, signal } from '@angular/core';

@Component({
  selector: 'app-error-boundary',
  standalone: true,
  template: `
    @if (hasError()) {
      <div class="error-panel">
        <h3>Oops! Algo deu errado.</h3>
        <button (click)="retry()">Tentar Novamente</button>
      </div>
    } @else {
      <ng-content />
    }
  `,
})
export class ErrorBoundaryComponent {
  hasError = signal(false);

  // Método para capturar o erro (pode ser chamado via serviço ou Output)
  handleError(error: any) {
    this.hasError.set(true);
    console.error('Capturado pelo boundary:', error);
  }

  retry() {
    this.hasError.set(false);
  }
}
```

## 2. Global ErrorHandler Customizado

O `ErrorHandler` do Angular captura todos os erros não tratados. Podemos customizá-lo para notificar componentes de boundary.

```typescript
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    
    if (chunkFailedMessage.test(error.message)) {
      window.location.reload();
    }
    
    // Enviar para serviço de log (ex: Sentry)
    console.error('Erro Global:', error);
  }
}

// Registro no app.config.ts
// providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]
```

## 3. Tratamento de Erro em Signals (computed)

Ao usar `computed`, erros dentro da lógica podem ser fatais. Use padrões de guarda:

```typescript
readonly safeData = computed(() => {
  try {
    return this.processData(this.rawData());
  } catch (error) {
    console.error('Erro na computação:', error);
    return null; // Retorna fallback seguro
  }
});
```

---
> [!CAUTION]
> **Loops de Erro**: Ao implementar um `ErrorHandler`, evite disparar ações que resultem em novos erros (como redirecionamentos infinitos), o que pode travar o navegador do usuário. Sempre utilize logs e UIs de fallback simples.

