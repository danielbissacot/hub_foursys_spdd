# Breadcrumbs

Breadcrumbs são um padrão de navegação secundária que permite ao usuário visualizar sua posição atual na hierarquia do site e navegar por ela.

# Sumário
Pré-requisitos
Certifique-se de que o elemento HTML pai do componente esteja totalmente carregado antes da inicialização.
Como o serviço utiliza targetSelector, garanta que o componente esteja renderizado e carregado antes de instanciar.
O correto funcionamento depende da presença completa da estrutura HTML do Breadcrumbs no DOM.
Uso do HTML
```
<nav aria-label="Breadcrumbs" id="my-breadcrumb" class="brad-breadcrumbs">
<ul class="brad-breadcrumbs__list">
  <li class="brad-breadcrumbs__item"><a href="#">Página 1</a></li>
  <li class="brad-breadcrumbs__item"><a href="#">Página 2</a></li>
  <li class="brad-breadcrumbs__item"><a href="#">Página 3</a></li>
  <li class="brad-breadcrumbs__item"><a href="#">Página 4</a></li>
  <li class="brad-breadcrumbs__item"><a href="#">Página 5</a></li>
  <li class="brad-breadcrumbs__item"><a href="#">Página 6</a></li>
  <li class="brad-breadcrumbs__item"><a href="#">Página 7</a></li>
  <li class="brad-breadcrumbs__item">
    <a href="#" aria-current="page">Página 8</a>
  </li>
</ul>
</nav>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do Breadcrumbs:

```
const targetSelector = "#my-breadcrumb";
const options = { targetSelector, mode: "condensed" };
const service = LiquidCorp.BradBreadcrumbsService.getInstance(options);
```
## Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| mode | "full" ou "condensed" | "full" | full: Exibe todas as páginas, incluindo as posteriores à página ativa. Itens são agrupados em dropdown quando não cabem no container. condensed: Esconde todas as páginas posteriores à página ativa, exibindo apenas as anteriores e a ativa como última. |

# Parâmetros
## Mode

O parâmetro mode define como o componente gerencia a exibição dos itens de navegação. Aceita dois valores:

full (padrão): Exibe todos os itens do breadcrumb, incluindo os posteriores à página ativa. Quando o espaço não é suficiente, os itens excedentes são agrupados automaticamente em um dropdown acessível.

```
LiquidCorp.BradBreadcrumbsService.getInstance({
targetSelector: "#my-breadcrumb",
mode: "full",
});
```

condensed: Oculta as páginas posteriores à página ativa, exibindo apenas as anteriores e a página atual como último item visível. Quando o espaço não é suficiente, os itens anteriores são agrupados em dropdown.

```
LiquidCorp.BradBreadcrumbsService.getInstance({
targetSelector: "#my-breadcrumb",
mode: "condensed",
});
```
## Métodos

Para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options. |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options. |
| setPage | page: number | Atualiza a página atual. No modo full, mantém todos os itens visíveis. No modo condensed, oculta os itens posteriores à página ativa. |

# Observações
## Uso sem a funcionalidade de truncamento com dropdown

Caso opte por utilizar o Breadcrumbs sem a funcionalidade de truncamento com dropdown (responsivo), basta pular a etapa de inicialização do serviço. Nesse modo, o componente continuará responsivo, mas os elementos serão dispostos em múltiplas linhas conforme o espaço disponível, em vez de serem agrupados em um dropdown.

Nesse cenário, funcionalidades como setPage() não estarão disponíveis. Para definir manualmente a página atual, basta adicionar o atributo aria-current="page" diretamente no elemento <a/> correspondente:

```
<a href="/pagina" aria-current="page">
Página Atual
</a>
```

Esse comportamento é equivalente ao modo breakline do Web Component, ideal para casos onde o uso do dropdown não é necessário e a quebra de linha é aceitável.

# Acessibilidade

O componente Breadcrumbs do Design System Liquid foi desenvolvido usando HTML semântico, assegurando a interpretação correta do leitor de tela, inclusive informando a quantidade de itens, e permitindo a navegação com o teclado.

O atributo aria-label="Breadcrumbs" no elemento <nav> descreve o tipo de navegação.
A propriedade aria-current="page" no item ativo indica a página atual dentro do conjunto de elementos.
Quando houver truncamento, o botão de dropdown recebe aria-label indicando a existência de mais itens, e o atributo aria-expanded alterna entre "true" e "false" para informar ao leitor de tela se o dropdown está expandido ou recolhido.
Observações
O modo breakline (quebra de linhas sem dropdown) não utiliza o serviço. Os itens são dispostos em múltiplas linhas quando não cabem no container.
No modo condensed, itens posteriores à página ativa não são visíveis. Se o cenário exige que o usuário visualize caminhos futuros na hierarquia, utilize o modo full.
O serviço depende do targetSelector para localizar o componente no DOM. Certifique-se de que o elemento esteja renderizado antes da chamada a getInstance.
## Exemplos

Obs: Utilize o playground interativo acima para testar os diferentes modos e navegação entre páginas.

# Condensed

No modo condensed, apenas as páginas anteriores à página ativa e a própria página ativa são exibidas. As páginas posteriores ficam ocultas.

```
<nav
  id="breadcrumb-condensed-167"
  aria-label="Breadcrumbs"
  class="brad-breadcrumbs "
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
Copy code
## Full

No modo full, todas as páginas são exibidas, incluindo as posteriores à página ativa. Quando não há espaço suficiente, os itens são agrupados em um dropdown.

```
<nav
  id="breadcrumb-full-255"
  aria-label="Breadcrumbs"
  class="brad-breadcrumbs "
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
Copy code
## BreakLine

Sem o serviço inicializado, os itens são dispostos em múltiplas linhas quando não cabem no container. Para definir a página atual, utilize aria-current="page" diretamente no link.

```
<nav
  id="my-breadcrumb"
  aria-label="Breadcrumbs"
  class="brad-breadcrumbs "
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
      <a href="#" aria-current="page">Página 8</a>
    </li>
  </ul>
</nav>
```
## Copy code