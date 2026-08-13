# Dropdown

O Dropdown é um componente de lista utilizado em menus.

# Súmario
Pré-requisitos
O elemento trigger ([data-toggle]) definido no HTML dentro do container do dropdown deve estar totalmente carregado antes da inicialização do componente.
O correto posicionamento e funcionamento dependem da presença desse elemento no DOM.
Como o serviço utiliza targetSelector, garanta que o componente esteja renderizado e carregado antes de instanciar.
Uso do HTML
```
<div id="dropdown" class="brad-dropdown brad-dropdown--down-center">
<button
  class="brad-btn brad-btn-fab-icon brad-btn-floating  brad-btn-fab-icon--not-active"
  data-toggle="brad-dropdown"
  aria-label="Abrir dropdown"
  aria-dropdown="true"
  tabindex="-1"
>
  <em class="fab-icon i icon-ui-placeholder"></em>
</button>

<div class="brad-dropdown__dropdown-content brad-padding-xs">
  <div class="brad-list-item brad-font-title-md brad-p-md-x brad-p-lg-y">
    Dropdown content text goes here
  </div>
  <div class="brad-list-item brad-font-title-md brad-p-md-x brad-p-lg-y">
    Dropdown content text goes here
  </div>
  <div class="brad-list-item brad-font-title-md brad-p-md-x brad-p-lg-y">
    Dropdown content text goes here
  </div>
</div>
</div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do Dropdown

```
const options = { targetSelector: "#dropdown" };
const service = LiquidCorp.BradDropdownService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo:

[{targetSelector: "#idDropdown1"}, {targetSelector: "#idDropdown2"}, {targetSelector: "#idDropdown3"}, ...]

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID ou .classe vinculado ao HTML do componente |
| enabledOutsideClick | boolean | true | Flag que ao ser desativada não permitirá que o dropdown seja fechado ao clicar fora de seu conteúdo |


Agora é possível controlar o HTML do componente pelo id: (#dropdown)

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| show | N/A | Abre |
| hide | N/A | Fecha |
| toggle | N/A | Alterna entre abrir e fechar |
| isOpen | N/A | É retornado se o dropdown está aberto ou fechado |

# Observações

O data-toggle é um atributo de dados do HTML5 que liga automaticamente o elemento ao tipo correspondente. Pode perceber que através do uso do data-toggle é reafirmado, que o elemento em questão é um dropdown.

O conteúdo do dropdown não possuirá scroll, ou seja, ela possuirá uma altura grande se sua listagem possuir muitos itens, que podem ocorrer problemas de responsividade.

Para criar o scroll dos elementos do dropdown, adicionar a propriedade css max-height na div que contém a classe brad-dropdown__dropdown-content.

O conteúdo do dropdown precisa ter uma largura mínima.

# Posições do Dropdown

Para escolher a posição que o Dropdown deve abrir basta adicionar a classe de posição correspondente na mesma div que possuir a classe brad-dropdown.


| Classe | Descrição |
| --- | --- |
| brad-dropdown--up-center | Dropdown abre para cima no centro |
| brad-dropdown--up-left | Dropdown abre para cima na esquerda |
| brad-dropdown--up-right | Dropdown abre para cima na direita |
| brad-dropdown--down-center | Dropdown abre para baixo no centro |
| brad-dropdown--down-left | Dropdown abre para baixo na esquerda |
| brad-dropdown--down-right | Dropdown abre para baixo na direita |

# Acessibilidade
Certifique-se de adicionar aria-expanded ao elemento de controle. Esse atributo identifica se o dropdown está expandido ou não e tem como valores true ou false que devem ser alternados dinamicamente.
Certifique-se de adicionar aria-label ao elemento de controle. Esse atributo identifica o texto a ser lido pelo leitor de tela e tem como valor o próprio texto.
Certifique-se de adicionar aria-hidden ao elemento que você deseja que o leitor de tela ignore.
```
<div id="brad-dropdown" class="brad-dropdown">
<button
  class="brad-btn brad-btn-fab-icon brad-btn-floating  brad-btn-fab-icon--not-active"
  data-toggle="brad-dropdown"
  aria-label="Abrir dropdown"
  tabindex="-1"
>
  <em class="fab-icon i icon-ui-placeholder"></em>
  <div class="fab-text " aria-hidden="true">FAB-ICON</div>
</button>

<div class="brad-dropdown__dropdown-content brad-padding-xs">
  <ul class="brad-list-item brad-font-title-md brad-p-md-x brad-p-lg-y">
    Lorem Ipsum.
  </ul>

  <ul class="brad-list-item brad-font-title-md brad-p-md-x brad-p-lg-y">
    Lorem Ipsum.
  </ul>

  <ul class="brad-list-item brad-font-title-md brad-p-md-x brad-p-lg-y">
    Lorem Ipsum.
  </ul>

</div>
</div>
```
Exemplos
Dropdown
```
<div id="dropdown-76" class="brad-dropdown brad-dropdown--up-center">
  <button
    class="brad-btn brad-btn-fab-icon brad-btn-floating  brad-btn-fab-icon--not-active"
    data-toggle="brad-dropdown"
    aria-label="Abrir dropdown"
    tabindex="-1"
  >
    <em class="fab-icon i icon-ui-placeholder"></em>
    <div class="fab-text" aria-hidden="true">FAB-ICON</div>
  </button>

  <div class="brad-dropdown__dropdown-content brad-padding-xs">
    <ul class="brad-list-item brad-font-title-md brad-p-md-x brad-p-lg-y">
      <p>Lorem ipsum.</p>
    </ul>

    <ul class="brad-list-item brad-font-title-md brad-p-md-x brad-p-lg-y">
      <p>Lorem ipsum.</p>
    </ul>

    <ul class="brad-list-item brad-font-title-md brad-p-md-x brad-p-lg-y">
      <p>Lorem ipsum.</p>
    </ul>
  </div>
</div>
```
Dropdown Checkbox
```
<div class="brad-theme-classic">
  <div id="dropdown-21" class="brad-dropdown brad-dropdown--up-center">
    <button
      class="brad-btn brad-btn-fab-icon brad-btn-floating  brad-btn-fab-icon--not-active"
      data-toggle="brad-dropdown"
      aria-label="Abrir dropdown"
      aria-dropdown="true"
      tabindex="-1"
    >
      <em class="fab-icon i icon-ui-placeholder"></em>
    </button>

    <div class=" brad-dropdown__dropdown-content brad-padding-xs">
      <div
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <label
          class="brad-checkbox brad-flex-row-reverse brad-flex-align-items-center brad-flex-justify-content-between "
        >
          <input id="checkbox-381" type="checkbox" name="group" />
          <span class="checkmark"></span>
          <p>Lorem ipsum.</p>
        </label>
      </div>

      <div
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <label
          class="brad-checkbox brad-flex-row-reverse brad-flex-align-items-center brad-flex-justify-content-between "
        >
          <input id="checkbox-381" type="checkbox" name="group" />
          <span class="checkmark"></span>
          <p>Lorem ipsum.</p>
        </label>
      </div>

      <div
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <label
          class="brad-checkbox brad-flex-row-reverse brad-flex-align-items-center brad-flex-justify-content-between "
        >
          <input id="checkbox-381" type="checkbox" name="group" />
          <span class="checkmark"></span>
          <p>Lorem ipsum.</p>
        </label>
      </div>
    </div>
  </div>
</div>
```