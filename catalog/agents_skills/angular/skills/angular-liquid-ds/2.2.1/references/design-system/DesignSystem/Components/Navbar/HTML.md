# Navbar

É um componente fixado na parte inferior da tela, que contém de 3 a 5 opções de ações que podem ser representadas por um ícone + texto. Ao tocar em alguma das opções o usuário é direcionado para tela correspodente.

# Súmario
Pré-requisitos
Certifique-se de que o elemento HTML pai do componente esteja totalmente carregado antes da inicialização.
Como o serviço utiliza targetSelector, garanta que o componente esteja renderizado e carregado antes de instanciar.
O correto funcionamento depende da presença completa da estrutura HTML da Navbar no DOM.
Uso do HTML
```
<div id="navbar" class="brad-navbar brad-navbar--line" >
  <div class="brad-navbar__indicator"></div>
  <div role="tablist" aria-labelledby="navbarlist-1">
    <button
      class="show-static-indicator"
      id="item-1"
      type="button"
      role="tab"
      aria-selected="true"
    >
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>

    <button
      id="item-2"
      type="button"
      role="tab"
      aria-selected="false"
    >
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>

    <button
      id="item-3"
      type="button"
      role="tab"
      aria-selected="false"
    >
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>

    <button
      id="item-4"
      type="button"
      role="tab"
      aria-selected="false"
    >
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>

    <button
      id="item-5"
      type="button"
      role="tab"
      aria-selected="false"
    >
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>
  </div>
</div>
```
## Classes Variáveis

O componente Navbar possui diferentes classes que modificam seu comportamento e estilo. Abaixo estão descritas essas variações e como aplicá-las.

# Variações de Estado

| Classe | Descrição |
| --- | --- |
| brad-navbar--line | É um componente que facilita na navegação, é acessível e pode ser usada em aplicações de dispositivos móveis como celulares e tablets. |
| brad-navbar--bubble | Da mesma forma que o line, a bubble é um componente que facilita na navegação, é acessível e pode ser usada em aplicações de dispositivos móveis como celulares e tablets. |

# Comportamento Javascript
## Inicialização

# Inicializar a Navbar

O getInstance tem como parametro padrão o Object , por exemplo {id: "#idElemento"}.

```
const options = { targetSelector: "#navbar" };
const service = LiquidCorp.BradNavbarService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo [{targetSelector: "#idNavbar1"}, {targetSelector: "#idNavbar2"}, {targetSelector: "#idNavbar3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID ou .classe vinculado ao HTML do componente |

# Metódos

| Método | Tipo | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| setSelectedItem | HTMLElement | Ativa a tab correspondente ao item passado como parâmetro. |
| updateIndicatorPosition | N/A | Atualiza a posição do indicador ativo. |



# Interação

O componente se comporta como um seletor, onde apenas uma aba pode ativar a qualqer momento e deve refletir o resultado da seleção no conteúdo da tela.

# Animação

Ao selecionar uma aba, o ACTIVE INDICATOR desliza de uma aba para a outra alternando para o estado ativo selecionado.A label e o ícone também transiciona para a cor correta de cada estado.

# Posicionamento

O componente se mantém fixo na parte de baixo da pégina. Ao dar scroll vertical, o componente permanece fixo em relação à altura da tela e o conteúdo da página passa por trás dele.

# Acessibilidade

Para o uso da acessibilidade adicione a role="tablist" na div filho da principal (.brad-navbar). A acessibilidade do conteúdo da nav bar deve ser feita de acordo com as regras de acessibilidade do mesmo. Caso necessite de bloquear a leitura dos itens atrás da nav bar.

Para que o leitor telas também comunique que a aba não está não selecionada deve-se seguir o exemplo abaixo:

```
LiquidCorp.BradNavbarService.getInstance({ targetSelector: "#navbar" });
let navbar = document.querySelector("#navbar");
let rolebar = navbar?.querySelectorAll("[role=tab]");
changeDescription(rolebar);
  navbar?.addEventListener("click", () => {
  changeDescription(rolebar);
});
function changeDescription(rolebar) {
  rolebar?.forEach((item) => {
    if (item.getAttribute("aria-selected") === "true") {
      item.removeAttribute("aria-description");
    } else {
      item.setAttribute("aria-description", "não selecionado");
    }
  });
}
```
## Atributos de Acessibilidade

| Atributos | Funcionalidades |
| --- | --- |
| role="tablist" | Regra que identifica o elemento que serve como contêiner para um conjunto de tabs. |
| role="tab" | Regra ARIA que indica um elemento interativo dentro de um tablist. |
| aria-selected | Indica o estado de seleção dos itens da guia. Active nav bar é definido como verdadeiro para este atributo. |
| aria-labelledby | Indica o cabeçalho da guia associado ao conteúdo. |

# Exemplos

Obs: Use o botão Show Code abaixo do exemplo para ver o HTML.

Para o uso do ButtonAlert é importante seguir a logica de implementação do código, e inserir as classes conforme os exemplos.

# Line
```
<div class="brad-navbar brad-navbar--line" id="navbar-313">
  <div class="brad-navbar__indicator"></div>
  <div role="tablist" aria-labelledby="navbarlist-1">
    <button
      class="show-static-indicator"
      id="item-1"
      type="button"
      role="tab"
      aria-selected="true"
    >
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>

    <button id="item-2" type="button" role="tab" aria-selected="false">
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>

    <button id="item-3" type="button" role="tab" aria-selected="false">
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>

    <button id="item-4" type="button" role="tab" aria-selected="false">
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>

    <button id="item-5" type="button" role="tab" aria-selected="false">
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>
  </div>
</div>
```
Bubble
```
<div class="brad-navbar brad-navbar--bubble" id="navbar-381">
  <div class="brad-navbar__indicator"></div>
  <div role="tablist" aria-labelledby="navbarlist-1">
    <button
      class="show-static-indicator"
      id="item-1"
      type="button"
      role="tab"
      aria-selected="true"
    >
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>

    <button id="item-2" type="button" role="tab" aria-selected="false">
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>

    <button id="item-3" type="button" role="tab" aria-selected="false">
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>

    <button id="item-4" type="button" role="tab" aria-selected="false">
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>

    <button id="item-5" type="button" role="tab" aria-selected="false">
      <span class="brad-navbar__btn-icon i icon-ui-placeholder"></span>
      <span class="brad-navbar__label">Label</span>
    </button>
  </div>
</div>
```