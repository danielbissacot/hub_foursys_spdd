# Snackbar Stacked

O Snackbar Stacked é um componente que gerencia múltiplos snackbars simultaneamente, empilhando-os verticalmente na tela.

# Uso do Web Component

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-snackbar-stacked | Componente | Sim | Não | Container que gerencia múltiplos snackbars empilhados. |

# Propriedades
## brad-snackbar-stacked

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | random(uid) | Obrigatório para funcionamento. Caso não seja informado, um valor aleatório será gerado automaticamente. |
| brad-align | "left", "center", "right" | "right" | Configura a posição horizontal onde os snackbars serão empilhados. |
| brad-vertical-position | "top", "bottom" | "bottom" | Configura a posição vertical onde os snackbars serão empilhados. |
| brad-max-snackbars | number | 5 | Define o número máximo de snackbars que podem ser exibidos simultaneamente. |

# Comportamento Javascript
## Inicialização

Inicialização não é necessária.

# Métodos

Métodos disponíveis através da propriedade service do componente:


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| add | content: string, type?: string, ttl?: number | Adiciona um novo snackbar à pilha. |

# Exemplo de uso
1. Selecionar o componente
```
const stackedComponent = document.querySelector("#snackbar-stacked");
```
2. Adicionar snackbar simples
```
stackedComponent.service.add("Mensagem de exemplo.");
```
3. Adicionar snackbar com tipo e TTL
```
stackedComponent.service.add(
"Operação realizada com sucesso.,",
"success",
5000
);
```
Exemplos
Default
```
<button
  id="button-stacked-52"
  class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
  aria-label="Adicionar snackbar e abrir"
>
  <em class="fab-icon i icon-ui-plus"></em>
</button>

<brad-snackbar-stacked
  id="snackbar-stacked-98"
  brad-vertical-position="bottom"
  brad-align="right"
  brad-max-snackbars="5"
></brad-snackbar-stacked>
```