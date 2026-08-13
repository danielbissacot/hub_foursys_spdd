# PaginationBullets

Componente de navegação que indica a posição atual do usuário em um carrossel ou sequência de conteúdo, permitindo visualizar e controlar o progresso por meio de botões em formato de bullets.

# Uso do WebComponent
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-pagination-bullets | Componente | Sim | Não | Componente principal do pagination-bullets, define a estrutura do componente e usa atributos para a quantidade de páginas, página atual, e on-color. |

# Propriedades

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-total-pages | "number" | 1 | Define o número total de páginas disponíveis para navegação. |
| brad-current-page | "number" | 1 | Define qual página está ativa no momento (baseado em 1). |
| brad-on-color | boolean | false | Alterna as cores do componente para uso sobre fundos escuros ou variados. |

# Comportamento Javascript
## Inicialização

## Inicialização não é necessária (componente nativo)

# Eventos

| Elemento | Método | Evento | Descrição |
| --- | --- | --- | --- |
| brad-pagination-bullets | addEventListener | "pageChanges" | Evento disparado ao alterar brad-current-page. |

# Acessibilidade

Este componente foi desenvolvido seguindo as melhores práticas de acessibilidade, garantindo uma experiência inclusiva para todos os usuários. Nenhuma configuração adicional é necessária.

# Exemplo
Default
```
<brad-pagination-bullets
  id="pb-41"
  brad-total-pages="7"
  brad-current-page="3"
  
></brad-pagination-bullets>
```