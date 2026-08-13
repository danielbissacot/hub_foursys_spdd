# Breadcrumbs

Breadcrumbs são um padrão de navegação secundária que permite ao usuário visualizar sua posição atual na hierarquia do site e navegar por ela.

# Súmario
Pré-requisitos
Certifique-se de que o elemento HTML pai do componente esteja totalmente carregado antes da inicialização.
Como o serviço utiliza targetSelector, garanta que o componente esteja renderizado e carregado antes de instanciar.
O correto funcionamento depende da presença completa da estrutura HTML do Breadcrumbs no DOM.
Uso do HTML
```
<nav aria-label="Breadcrumb" id="my-breadcrumb" class="brad-breadcrumbs">
<ul class="brad-breadcrumbs__list">
  <li class="brad-breadcrumbs__item"><a href="#">Página 1</a></li>
  <li class="brad-breadcrumbs__item"><a href="#">Página 2</a></li>
  <li class="brad-breadcrumbs__item"><a href="#">Página 3</a></li>
  <li class="brad-breadcrumbs__item"><a href="#">Página 4</a></li>
  <li class="brad-breadcrumbs__item"><a href="#">Página 5</a></li>
  <li class="brad-breadcrumbs__item"><a href="#">Página 6</a></li>
  <li class="brad-breadcrumbs__item"><a href="#">Página 7</a></li>
  <li class="brad-breadcrumbs__item">
    <p aria-current="Página atual">Página 8</p>
  </li>
</ul>
</nav>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do Breadcrumbs

```
const targetSelector = "#my-breadcrumb";
const options = { targetSelector, mode: "condensed" };
const service = LiquidCorp.BradBreadcrumbsService.getInstance(options);
```
## Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| mode | "full" ou "condensed" | "full" | full: Este modo sempre exibe todas as páginas, incluindo as posteriores à página ativa. condensed: Este modo esconde todas as páginas posteriores à página ativa, mostrando apenas as anteriores e a ativa como última. |

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parámetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| setPage | page: number | Atualiza qual a página atual, e dependendo do mode, se full ou condensed, ele se comportará diferente |

# Obervações
## Uso sem a funcionalidade de truncamento com dropdown:

Caso opte por utilizar o breadcrumbs sem a funcionalidade de truncamento com dropdown (responsivo), basta pular a etapa de inicialização do serviço. Nesse modo, o componente continuará responsivo, mas os elementos serão dispostos em múltiplas linhas conforme o espaço disponível, em vez de serem agrupados em um dropdown.

Nesse cenário, funcionalidades como 'setPage()' não estarão disponíveis. Para definir manualmente a página atual, basta adicionar o atributo 'aria-current="page"' diretamente no elemento <a/> correspondente. Exemplo:

```
<a href="/pagina" aria-current="page">
Página Atual
</a>
```

Esse comportamento é ideal para casos onde o uso do dropdown não é necessário, simplificando a implementação sem comprometer a responsividade.

# Acessibilidade

O componente Breadcrumbs do Design System Liquid foi desenvolvido usando HTML semântico, assegurando a interpretação correta do leitor de tela, inclusive informando a quantidade de itens; e permitindo a navegação com o teclado. O uso do atributo aria-label="breadcrumb" no elemento <nav> é indicado para descrever o tipo de navegação e a propriedade aria-current="page" no último item da lista indica a página atual dentro do conjunto de elementos relacionados.
Quando houver truncamento, o botão recebe o atributo aria-label indicando de forma sucinta que existem mais itens. Além disso, por esse botão abrir um Dropdown o leitor de tela deve informar se o botão está expandido ou recolhido, para isso utilize o atributo aria-expanded e altere o seu valor dinamicamente entre “true” e “false”.

# Exemplos
Truncated
```
<nav
  id="my-breadcrumb"
  aria-label="Breadcrumb"
  class="brad-breadcrumbs "
  aria-label="Breadcrumbs"
>
  <ul class="brad-breadcrumbs__list">
    <li class="brad-breadcrumbs__item"><a href="#">Página 1</a></li>
    <li class="brad-breadcrumbs__item"><a href="#">Página 2</a></li>
    <li class="brad-breadcrumbs__item">
      <a href="#">Página 3</a>
    </li>
    <li class="brad-breadcrumbs__item">
      <a href="#">Página 4</a>
    </li>
    <li class="brad-breadcrumbs__item"><a href="#">Página 5</a></li>
    <li class="brad-breadcrumbs__item"><a href="#">Página 6</a></li>
    <li class="brad-breadcrumbs__item"><a href="#">Página 7</a></li>
    <li class="brad-breadcrumbs__item">
      <a href="#">Página 8</a>
    </li>
  </ul>
</nav>
```