# ContactDDIList

Template para utilização do componente gatilho e input para contato com escolha de paises.

# Uso do HTML

Dentro do brad-text-field foi inserido um botão e adicionado uma nova classe chamada left-arrow para trazer o botão para esquerda e dentro do botão as classes que ajustam a bandeira selecionada.

Antes da classe brad-text-field-search foi adicionado uma nova div pai com a classe brad-text-field-search--container, a partir dela as novas classes irão conversar para que o layout fique conforme desenhado.

A div que possui a classe brad-text-field-search--container-header controla o cabeçalho do mobile, onde possui o titulo e o botão de fechar.

No elemento que possui a classe search-view-options foi adicionada mais uma classe search-view-options--flag responsável pelos ajustes do tamanho e posicionamento da caixa de opções.

Existem também as classes search-view-options--flag, brad-list-item--ddi-flag e brad-list-item--ddi-country que são responsáveis pelo layout dos resultados.

As classes que iniciam com brad-flag- e o nome do país, são as classes que possuem as bandeiras dentro do design system.

```
<div class="brad-text-field ">
      <button
        data-btn-type="text-field-search"
        id="search-ddi-button"
        aria-label="Procurar ddi"
        aria-haspopup="listbox"
        class="i icon-ui-placeholder arrow left-arrow complements"
      >
        <span id="flags-image" class="brad-flag-select"> </span>
      </button>

      <input aria-label="Campo de texto" type="text" value="" placeholder="Telefone" />

      <small aria-hidden="true" class="placeholder-label-field">Telefone</small>
      <span class="prefix"></span>
      <em class="validation-icon complements"></em>
      <span class="helper-text">DDD + Telefone</span>
      <div class="brad-text-field--background"></div>
    </div>

    <div class="brad-text-field-search--container">
      <div id="contact-ddi-list" data-search="gatilho" class="brad-text-field-search brad-text-field-search--view brad-text-field-search--gatilho-off no-content">
        <div class="brad-text-field-search--container-header">
          <h1 class="brad-font-title-md">Selecione o país</h1>
          <button aria-label="Fechar busca" class="brad-popover__close-icon cancel"></button>
        </div>
        <div class="search-container">
          <label class="brad-text-field">
            <input aria-label="Campo de texto" class="" type="text" placeholder="Digite o nome ou o DDI do país" value="" />
            <em aria-hidden="true" class="leading-icon i icon-ui-search complements"></em>
            <small aria-hidden="true" class="placeholder-label-field">Buscar</small>

            <button aria-label="Deletar texto" class="delete trailing-button-text complements"></button>
            <div class="brad-text-field--background"></div>
          </label>
        </div>

        <p id="id-search-result" aria-live="polite" style="opacity: 0; position: absolute"></p>

        <div class="search-view-options brad-scrollbar search-view-options--flag" role="listbox" id="ss_elem_list" tabindex="0">
            <div
        id="ss_elem_list_3760"
        data-search-value="Andorra +376"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Andorra DDI +376"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-andorra-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Andorra</span>
                    <span class="code"> +376</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_931"
        data-search-value="Afeganistão +93"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Afeganistão DDI +93"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-afghanistan-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Afeganistão</span>
                    <span class="code"> +93</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_272"
        data-search-value="África do Sul +27"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="África do Sul DDI +27"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-south-africa-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> África do Sul</span>
                    <span class="code"> +27</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_3553"
        data-search-value="Albânia +355"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Albânia DDI +355"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-albania-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Albânia</span>
                    <span class="code"> +355</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_494"
        data-search-value="Germany +49"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Germany DDI +49"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-germany-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Germany</span>
                    <span class="code"> +49</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_2445"
        data-search-value="Angola +244"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Angola DDI +244"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-angola-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Angola</span>
                    <span class="code"> +244</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_9666"
        data-search-value="Arábia Saudita +966"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Arábia Saudita DDI +966"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-saudi-arabia-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Arábia Saudita</span>
                    <span class="code"> +966</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_2137"
        data-search-value="Argélia +213"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Argélia DDI +213"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-algeria-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Argélia</span>
                    <span class="code"> +213</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_548"
        data-search-value="Argentina +54"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Argentina DDI +54"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-argentina-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Argentina</span>
                    <span class="code"> +54</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_3749"
        data-search-value="Armênia +374"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Armênia DDI +374"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-armenia-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Armênia</span>
                    <span class="code"> +374</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_6110"
        data-search-value="Austrália +61"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Austrália DDI +61"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-australia-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Austrália</span>
                    <span class="code"> +61</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_4311"
        data-search-value="Áustria +43"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Áustria DDI +43"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-austria-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Áustria</span>
                    <span class="code"> +43</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_88014"
        data-search-value="Bangladesh +880"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Bangladesh DDI +880"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-bangladesh-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Bangladesh</span>
                    <span class="code"> +880</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_3217"
        data-search-value="Bélgica +32"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Bélgica DDI +32"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-belgium-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Bélgica</span>
                    <span class="code"> +32</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_59120"
        data-search-value="Bolívia +591"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Bolívia DDI +591"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-bolivia-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Bolívia</span>
                    <span class="code"> +591</span>
                  </div>
            </div>
            <div
        id="ss_elem_list_5523"
        data-search-value="Brasil +55"
        class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
        style="display: flex"
        role="option"
        aria-label="Brasil DDI +55"
        tabindex="-1"
      >
                  <span class="brad-list-item--ddi-flag brad-flag-brazil-default"></span>
                  <div class="brad-list-item--ddi-country brad-m-xs-l">
                    <span> Brasil</span>
                    <span class="code"> +55</span>
                  </div>
            </div>


          <div
      class="brad-text-field-search--not-found brad-font-title-sm brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      role="option"
      id="ss_elem_list_nf"
    >
             Não há resultados para sua busca
          </div>
        </div>
        <div class="brad-text-field-search--actions">
          <button type="button" class="brad-btn brad-btn-text cancel">
            Fechar
          </button>
          <button type="button" class="brad-btn brad-btn-primary confirm">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
Copy
```
Comportamento Javascript
```
const id = `contact-ddi-list`;
let name = "";
let services;
let dataSelected = "Brasil +55";
let prefix = "+55";
let buttonSearch = document.getElementById("search-ddi-button");

services = LiquidCorp.BradTextFieldSearchService.getInstance({
  targetSelector: `#${id}`,
  textFieldContact: true,
});
somethingChanged(dataSelected);

/** Evento disparado ao selecionar um elemento*/
services.eInput.addEventListener("selected", (value) => {
  dataSelected = value.detail.input.value;
  somethingChanged(value.detail.input.value);
});

/** Evento disparado ao digitar no campo de busca*/
services.eInput.addEventListener("typing", (element) => {
  const emptyImput = element.target.value === "";
  readSearchResult(emptyImput);
});

/** Evento disparado ao clicar no botão de fechar*/
services.cancelButton.addEventListener("click", () => {
  markCurrentSelect();
  buttonSearch?.focus();

  if (window.innerWidth < 768) {
    removeMobileFocusLoop();
    calcHeightSearchContainer("remove");
  }
});

/** Evento disparado ao clicar no botão de limpar busca*/
services.deleteButton.addEventListener("click", () => {
  services.eInput.value = "";
});

/** Evento disparado ao clicar no botão que abre a busca pelo DDI */
buttonSearch.addEventListener("click", () => {
  if (window.innerWidth >= 768) {
    services.eInput.focus();
  } else {
    let headerTitle = document.querySelector(".brad-text-field-search--container-header h1");

    headerTitle.setAttribute("tabindex", "-1");
    headerTitle.focus();

    let dialogNode = document.querySelector("#" + id);
    setMobileFocusLoop(dialogNode);
  }
});

/** Evento disparado ao clicar no botão de confirmar seleção*/
services.confirmButton.addEventListener("click", () => {
  buttonSearch.focus();
  if (window.innerWidth < 768) {
    removeMobileFocusLoop();
    calcHeightSearchContainer("remove");
  }
});

/**Função para Modificar a bandeira e o prefixo do DDI */
const somethingChanged = (country = "Brasil") => {
  if (!!country) {
    const splitName = country.split("+");
    name = splitName[0].trim();
    let flagSelect = countries.filter((value) => value.nome_pais === name)[0];
    if (flagSelect) {
      prefix = "+" + splitName[1];
      document.querySelector(".prefix").innerHTML = prefix;
      const flagImage = document.querySelector("#flags-image");
      flagImage.className = "brad-flag-select " + flagSelect.flag;
    }
  }
};

/** Função para resetar o ultimo valor selecionado */
function markCurrentSelect() {
  let currentSelect = services.eTextFieldSearch.querySelector(".search-view-options").querySelector('[data-search-value="' + dataSelected + '"]');

  services.markSelectedOption(currentSelect);
}

/** Função de acessibilidade para ficar lendo a quantidade de resultados encontrados*/
function readSearchResult(emptyImput) {
  let divDropdown = document.getElementById("ss_elem_list");
  let searchResult = document.getElementById("id-search-result");

  if (divDropdown) {
    const elementsWithFlexDisplay = divDropdown.querySelectorAll('[style="display: flex;"]');

    if (searchResult) {
      if (emptyImput) {
        searchResult.textContent = "";
        return;
      }
      searchResult.textContent = `Foram encontrados ${elementsWithFlexDisplay.length} resutados`;
    }
  }
}

/** Função de acessibilidade para manter o foco dentro do modal aberto na versão mobile*/
function setMobileFocusLoop(el) {
  const { body } = document;
  let currentEl = el;
  do {
    const siblings = currentEl.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (sibling !== currentEl && sibling.setAttribute) {
        sibling.setAttribute("data-old-aria-hidden", sibling.ariaHidden || "null");
        sibling.setAttribute("aria-hidden", "true");
      }
    }
    currentEl = currentEl.parentNode;
  } while (currentEl !== body);
}

/** Função para remover o foco do mobile quando há acessibilidade*/
function removeMobileFocusLoop() {
  const elsToReset = document.querySelectorAll("[data-old-aria-hidden]");
  for (let i = 0; i < elsToReset.length; i++) {
    const el = elsToReset[i];
    const ariaHiddenVal = el.getAttribute("data-old-aria-hidden");
    if (ariaHiddenVal === "null") {
      el.removeAttribute("aria-hidden");
    } else {
      el.setAttribute("aria-hidden", ariaHiddenVal);
    }
    el.removeAttribute("data-old-aria-hidden");
  }
}

/** Função para calcular a altura do container no mobile onde possui as opções de paises */
function calcHeightSearchContainer(type) {
  const searchViewElement = services.eTextFieldSearch.querySelector("#ss_elem_list");
  if (type === "remove") {
    searchViewElement.style.removeProperty("height");
  } else {
    const searchActionsHeight = services.eTextFieldSearch.querySelector(".brad-text-field-search--actions").offsetHeight;

    const searchContainerHeight = services.eTextFieldSearch.querySelector(".search-container").offsetHeight;

    searchViewElement.style.height = Math.floor(searchViewElement.offsetHeight - searchContainerHeight - searchActionsHeight) + "px";
  }
}
Copy
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object {}], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| textFieldContact | boolean | false | Marca se o gatilho será usado como contato |

# Acessibilidade

A função readSearchResult segue a implementação do Dropdown Search, para ficar lendo a quantidade de resultados encontrados.

As funções setMobileFocusLoop e removeMobileFocusLoop são implementadas para que o conteúdo atrás do modal de busca não seja lido quando ele esteja aberto. Sendo o setMobileFocusLoop trava o leitor dentro do conteudo exibido e a removeMobileFocusLoop remove esse looping quando o modal é fechado.

A role="listbox" indica para os leitores de tela que aquela div é uma lista de opções e a role="option" indica as opções dessa lista. É importante inserir a tag aria-label nas opções para que o leitor leia corretamente o conteúdo delas. Inserir também o tabindex="-1" para que o leitor de telas consiga ler corretamente as opções na versão mobile.

```
<div class="brad-theme-classic">
  <div class="brad-text-field ">
    <button
      data-btn-type="text-field-search"
      id="search-ddi-button"
      aria-label="Procurar ddi"
      aria-haspopup="listbox"
      class="i icon-ui-placeholder arrow left-arrow complements"
    >
      <span id="flags-image" class="brad-flag-select"> </span>
    </button>

    <input
      aria-label="Campo de texto"
      type="text"
      value=""
      placeholder="Telefone"
    />

    <small aria-hidden="true" class="placeholder-label-field">Telefone</small>
    <span class="prefix"></span>
    <em class="validation-icon complements"></em>
    <span class="helper-text">DDD + Telefone</span>
    <div class="brad-text-field--background"></div>
  </div>

  <div class="brad-text-field-search--container">
    <div
      id="contact-ddi-list-289"
      data-search="gatilho"
      class="brad-text-field-search brad-text-field-search--view brad-text-field-search--gatilho-off no-content"
    >
      <div class="brad-text-field-search--container-header">
        <h1 class="brad-font-title-md">Selecione o país</h1>
        <button
          aria-label="Fechar busca"
          class="brad-popover__close-icon cancel"
        ></button>
      </div>
      <div class="search-container">
        <label class="brad-text-field">
          <input
            aria-label="Campo de texto"
            class=""
            type="text"
            placeholder="Digite o nome ou o DDI do país"
            value=""
          />
          <em
            aria-hidden="true"
            class="leading-icon i icon-ui-search complements"
          ></em>
          <small aria-hidden="true" class="placeholder-label-field"
            >Buscar</small
          >

          <button
            aria-label="Deletar texto"
            class="delete trailing-button-text complements"
          ></button>
          <div class="brad-text-field--background"></div>
        </label>
      </div>

      <p
        id="id-search-result"
        aria-live="polite"
        style="opacity: 0; position: absolute"
      ></p>

      <div
        class="search-view-options brad-scrollbar search-view-options--flag"
        role="listbox"
        id="ss_elem_list"
        tabindex="0"
      >
        <div
      id="ss_elem_list_3760"
      data-search-value="Andorra +376"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Andorra DDI +376"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-andorra-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Andorra</span>
        <span class="code">+376</span>
      </div>
    </div><div
      id="ss_elem_list_931"
      data-search-value="Afeganistão +93"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Afeganistão DDI +93"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-afghanistan-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Afeganistão</span>
        <span class="code">+93</span>
      </div>
    </div><div
      id="ss_elem_list_272"
      data-search-value="África do Sul +27"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="África do Sul DDI +27"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-south-africa-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>África do Sul</span>
        <span class="code">+27</span>
      </div>
    </div><div
      id="ss_elem_list_3553"
      data-search-value="Albânia +355"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Albânia DDI +355"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-albania-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Albânia</span>
        <span class="code">+355</span>
      </div>
    </div><div
      id="ss_elem_list_494"
      data-search-value="Alemanha +49"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Alemanha DDI +49"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-germany-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Alemanha</span>
        <span class="code">+49</span>
      </div>
    </div><div
      id="ss_elem_list_2445"
      data-search-value="Angola +244"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Angola DDI +244"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-angola-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Angola</span>
        <span class="code">+244</span>
      </div>
    </div><div
      id="ss_elem_list_9666"
      data-search-value="Arábia Saudita +966"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Arábia Saudita DDI +966"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-saudi-arabia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Arábia Saudita</span>
        <span class="code">+966</span>
      </div>
    </div><div
      id="ss_elem_list_2137"
      data-search-value="Argélia +213"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Argélia DDI +213"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-algeria-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Argélia</span>
        <span class="code">+213</span>
      </div>
    </div><div
      id="ss_elem_list_548"
      data-search-value="Argentina +54"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Argentina DDI +54"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-argentina-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Argentina</span>
        <span class="code">+54</span>
      </div>
    </div><div
      id="ss_elem_list_3749"
      data-search-value="Armênia +374"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Armênia DDI +374"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-armenia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Armênia</span>
        <span class="code">+374</span>
      </div>
    </div><div
      id="ss_elem_list_6110"
      data-search-value="Austrália +61"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Austrália DDI +61"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-australia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Austrália</span>
        <span class="code">+61</span>
      </div>
    </div><div
      id="ss_elem_list_4311"
      data-search-value="Áustria +43"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Áustria DDI +43"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-austria-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Áustria</span>
        <span class="code">+43</span>
      </div>
    </div><div
      id="ss_elem_list_112"
      data-search-value="Bahamas +1"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Bahamas DDI +1"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-bahamas-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Bahamas</span>
        <span class="code">+1</span>
      </div>
    </div><div
      id="ss_elem_list_97313"
      data-search-value="Bahrein +973"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Bahrein DDI +973"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-bahrain-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Bahrein</span>
        <span class="code">+973</span>
      </div>
    </div><div
      id="ss_elem_list_88014"
      data-search-value="Bangladesh +880"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Bangladesh DDI +880"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-bangladesh-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Bangladesh</span>
        <span class="code">+880</span>
      </div>
    </div><div
      id="ss_elem_list_115"
      data-search-value="Barbados +1"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Barbados DDI +1"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-barbados-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Barbados</span>
        <span class="code">+1</span>
      </div>
    </div><div
      id="ss_elem_list_37516"
      data-search-value="Belarus +375"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Belarus DDI +375"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-belarus-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Belarus</span>
        <span class="code">+375</span>
      </div>
    </div><div
      id="ss_elem_list_3217"
      data-search-value="Bélgica +32"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Bélgica DDI +32"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-belgium-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Bélgica</span>
        <span class="code">+32</span>
      </div>
    </div><div
      id="ss_elem_list_50118"
      data-search-value="Belize +501"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Belize DDI +501"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-belize-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Belize</span>
        <span class="code">+501</span>
      </div>
    </div><div
      id="ss_elem_list_22919"
      data-search-value="Benin +229"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Benin DDI +229"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-benin-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Benin</span>
        <span class="code">+229</span>
      </div>
    </div><div
      id="ss_elem_list_59120"
      data-search-value="Bolívia +591"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Bolívia DDI +591"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-bolivia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Bolívia</span>
        <span class="code">+591</span>
      </div>
    </div><div
      id="ss_elem_list_38721"
      data-search-value="Bósnia e Herzegovina +387"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Bósnia e Herzegovina DDI +387"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-bosnia-and-herzegovina-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Bósnia e Herzegovina</span>
        <span class="code">+387</span>
      </div>
    </div><div
      id="ss_elem_list_26722"
      data-search-value="Botsuana +267"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Botsuana DDI +267"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-botswana-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Botsuana</span>
        <span class="code">+267</span>
      </div>
    </div><div
      id="ss_elem_list_5523"
      data-search-value="Brasil +55"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Brasil DDI +55"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-brazil-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Brasil</span>
        <span class="code">+55</span>
      </div>
    </div><div
      id="ss_elem_list_67324"
      data-search-value="Brunei +673"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Brunei DDI +673"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-brunei-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Brunei</span>
        <span class="code">+673</span>
      </div>
    </div><div
      id="ss_elem_list_35925"
      data-search-value="Bulgária +359"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Bulgária DDI +359"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-bulgaria-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Bulgária</span>
        <span class="code">+359</span>
      </div>
    </div><div
      id="ss_elem_list_22626"
      data-search-value="Burkina Fasso +226"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Burkina Fasso DDI +226"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-burkina-faso-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Burkina Fasso</span>
        <span class="code">+226</span>
      </div>
    </div><div
      id="ss_elem_list_97527"
      data-search-value="Butão +975"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Butão DDI +975"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-bhutan-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Butão</span>
        <span class="code">+975</span>
      </div>
    </div><div
      id="ss_elem_list_85528"
      data-search-value="Camboja +855"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Camboja DDI +855"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-cambodia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Camboja</span>
        <span class="code">+855</span>
      </div>
    </div><div
      id="ss_elem_list_129"
      data-search-value="Canadá +1"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Canadá DDI +1"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-canada-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Canadá</span>
        <span class="code">+1</span>
      </div>
    </div><div
      id="ss_elem_list_730"
      data-search-value="Cazaquistão +7"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Cazaquistão DDI +7"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-kazakstan-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Cazaquistão</span>
        <span class="code">+7</span>
      </div>
    </div><div
      id="ss_elem_list_5631"
      data-search-value="Chile +56"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Chile DDI +56"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-chile-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Chile</span>
        <span class="code">+56</span>
      </div>
    </div><div
      id="ss_elem_list_8632"
      data-search-value="China +86"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="China DDI +86"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-china-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>China</span>
        <span class="code">+86</span>
      </div>
    </div><div
      id="ss_elem_list_35733"
      data-search-value="Chipre +357"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Chipre DDI +357"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-cyprus-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Chipre</span>
        <span class="code">+357</span>
      </div>
    </div><div
      id="ss_elem_list_6534"
      data-search-value="Cingapura +65"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Cingapura DDI +65"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-singapore-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Cingapura</span>
        <span class="code">+65</span>
      </div>
    </div><div
      id="ss_elem_list_5735"
      data-search-value="Colômbia +57"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Colômbia DDI +57"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-colombia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Colômbia</span>
        <span class="code">+57</span>
      </div>
    </div><div
      id="ss_elem_list_85036"
      data-search-value="Coréia do Norte +850"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Coréia do Norte DDI +850"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-north-korea-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Coréia do Norte</span>
        <span class="code">+850</span>
      </div>
    </div><div
      id="ss_elem_list_8237"
      data-search-value="Coréia do Sul +82"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Coréia do Sul DDI +82"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-south-korea-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Coréia do Sul</span>
        <span class="code">+82</span>
      </div>
    </div><div
      id="ss_elem_list_50638"
      data-search-value="Costa Rica +506"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Costa Rica DDI +506"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-costa-rica-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Costa Rica</span>
        <span class="code">+506</span>
      </div>
    </div><div
      id="ss_elem_list_38539"
      data-search-value="Croácia +385"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Croácia DDI +385"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-croatia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Croácia</span>
        <span class="code">+385</span>
      </div>
    </div><div
      id="ss_elem_list_5340"
      data-search-value="Cuba +53"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Cuba DDI +53"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-cuba-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Cuba</span>
        <span class="code">+53</span>
      </div>
    </div><div
      id="ss_elem_list_4541"
      data-search-value="Dinamarca +45"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Dinamarca DDI +45"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-denmark-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Dinamarca</span>
        <span class="code">+45</span>
      </div>
    </div><div
      id="ss_elem_list_142"
      data-search-value="Dominica +1"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Dominica DDI +1"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-dominica-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Dominica</span>
        <span class="code">+1</span>
      </div>
    </div><div
      id="ss_elem_list_2043"
      data-search-value="Egito +20"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Egito DDI +20"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-egypt-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Egito</span>
        <span class="code">+20</span>
      </div>
    </div><div
      id="ss_elem_list_50344"
      data-search-value="El Salvador +503"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="El Salvador DDI +503"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-el-salvador-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>El Salvador</span>
        <span class="code">+503</span>
      </div>
    </div><div
      id="ss_elem_list_97145"
      data-search-value="Emirados Árabes Unidos +971"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Emirados Árabes Unidos DDI +971"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-united-arab-emirates-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Emirados Árabes Unidos</span>
        <span class="code">+971</span>
      </div>
    </div><div
      id="ss_elem_list_59346"
      data-search-value="Equador +593"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Equador DDI +593"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-ecuador-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Equador</span>
        <span class="code">+593</span>
      </div>
    </div><div
      id="ss_elem_list_4447"
      data-search-value="Escócia +44"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Escócia DDI +44"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-scotland-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Escócia</span>
        <span class="code">+44</span>
      </div>
    </div><div
      id="ss_elem_list_42148"
      data-search-value="Eslováquia +421"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Eslováquia DDI +421"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-slovakia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Eslováquia</span>
        <span class="code">+421</span>
      </div>
    </div><div
      id="ss_elem_list_38649"
      data-search-value="Eslovênia +386"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Eslovênia DDI +386"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-slovenia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Eslovênia</span>
        <span class="code">+386</span>
      </div>
    </div><div
      id="ss_elem_list_3450"
      data-search-value="Espanha +34"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Espanha DDI +34"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-spain-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Espanha</span>
        <span class="code">+34</span>
      </div>
    </div><div
      id="ss_elem_list_151"
      data-search-value="Estados Unidos +1"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Estados Unidos DDI +1"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-united-states-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Estados Unidos</span>
        <span class="code">+1</span>
      </div>
    </div><div
      id="ss_elem_list_37252"
      data-search-value="Estônia +372"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Estônia DDI +372"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-stonia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Estônia</span>
        <span class="code">+372</span>
      </div>
    </div><div
      id="ss_elem_list_6353"
      data-search-value="Filipinas +63"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Filipinas DDI +63"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-philippines-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Filipinas</span>
        <span class="code">+63</span>
      </div>
    </div><div
      id="ss_elem_list_35854"
      data-search-value="Finlândia +358"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Finlândia DDI +358"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-finland-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Finlândia</span>
        <span class="code">+358</span>
      </div>
    </div><div
      id="ss_elem_list_3355"
      data-search-value="França +33"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="França DDI +33"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-france-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>França</span>
        <span class="code">+33</span>
      </div>
    </div><div
      id="ss_elem_list_99556"
      data-search-value="Geórgia +995"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Geórgia DDI +995"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-georgia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Geórgia</span>
        <span class="code">+995</span>
      </div>
    </div><div
      id="ss_elem_list_4457"
      data-search-value="Grã-Bretanha (Reino Unido, UK) +44"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Grã-Bretanha (Reino Unido, UK) DDI +44"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-united-kingdom-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Grã-Bretanha (Reino Unido, UK)</span>
        <span class="code">+44</span>
      </div>
    </div><div
      id="ss_elem_list_158"
      data-search-value="Granada +1"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Granada DDI +1"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-grenada-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Granada</span>
        <span class="code">+1</span>
      </div>
    </div><div
      id="ss_elem_list_3059"
      data-search-value="Grécia +30"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Grécia DDI +30"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-greece-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Grécia</span>
        <span class="code">+30</span>
      </div>
    </div><div
      id="ss_elem_list_29960"
      data-search-value="Groelândia +299"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Groelândia DDI +299"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-greenland-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Groelândia</span>
        <span class="code">+299</span>
      </div>
    </div><div
      id="ss_elem_list_50261"
      data-search-value="Guatemala +502"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Guatemala DDI +502"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-guatemala-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Guatemala</span>
        <span class="code">+502</span>
      </div>
    </div><div
      id="ss_elem_list_59262"
      data-search-value="Guiana +592"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Guiana DDI +592"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-guyana-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Guiana</span>
        <span class="code">+592</span>
      </div>
    </div><div
      id="ss_elem_list_59463"
      data-search-value="Guiana Francesa +594"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Guiana Francesa DDI +594"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-french-guiana-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Guiana Francesa</span>
        <span class="code">+594</span>
      </div>
    </div><div
      id="ss_elem_list_50964"
      data-search-value="Haiti +509"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Haiti DDI +509"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-haiti-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Haiti</span>
        <span class="code">+509</span>
      </div>
    </div><div
      id="ss_elem_list_3165"
      data-search-value="Holanda +31"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Holanda DDI +31"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-netherlands-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Holanda</span>
        <span class="code">+31</span>
      </div>
    </div><div
      id="ss_elem_list_50466"
      data-search-value="Honduras +504"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Honduras DDI +504"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-honduras-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Honduras</span>
        <span class="code">+504</span>
      </div>
    </div><div
      id="ss_elem_list_3667"
      data-search-value="Hungria +36"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Hungria DDI +36"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-hungary-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Hungria</span>
        <span class="code">+36</span>
      </div>
    </div><div
      id="ss_elem_list_96768"
      data-search-value="Iêmen +967"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Iêmen DDI +967"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-yemen-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Iêmen</span>
        <span class="code">+967</span>
      </div>
    </div><div
      id="ss_elem_list_9169"
      data-search-value="Índia +91"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Índia DDI +91"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-india-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Índia</span>
        <span class="code">+91</span>
      </div>
    </div><div
      id="ss_elem_list_6270"
      data-search-value="Indonésia +62"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Indonésia DDI +62"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-indonesia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Indonésia</span>
        <span class="code">+62</span>
      </div>
    </div><div
      id="ss_elem_list_4471"
      data-search-value="Inglaterra +44"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Inglaterra DDI +44"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-england-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Inglaterra</span>
        <span class="code">+44</span>
      </div>
    </div><div
      id="ss_elem_list_9872"
      data-search-value="Irã +98"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Irã DDI +98"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-iran-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Irã</span>
        <span class="code">+98</span>
      </div>
    </div><div
      id="ss_elem_list_96473"
      data-search-value="Iraque +964"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Iraque DDI +964"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-iraq-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Iraque</span>
        <span class="code">+964</span>
      </div>
    </div><div
      id="ss_elem_list_35374"
      data-search-value="Irlanda +353"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Irlanda DDI +353"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-ireland-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Irlanda</span>
        <span class="code">+353</span>
      </div>
    </div><div
      id="ss_elem_list_4475"
      data-search-value="Irlanda do Norte +44"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Irlanda do Norte DDI +44"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-northern-ireland-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Irlanda do Norte</span>
        <span class="code">+44</span>
      </div>
    </div><div
      id="ss_elem_list_35476"
      data-search-value="Islândia +354"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Islândia DDI +354"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-iceland-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Islândia</span>
        <span class="code">+354</span>
      </div>
    </div><div
      id="ss_elem_list_97277"
      data-search-value="Israel +972"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Israel DDI +972"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-israel-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Israel</span>
        <span class="code">+972</span>
      </div>
    </div><div
      id="ss_elem_list_3978"
      data-search-value="Itália +39"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Itália DDI +39"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-italy-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Itália</span>
        <span class="code">+39</span>
      </div>
    </div><div
      id="ss_elem_list_179"
      data-search-value="Jamaica +1"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Jamaica DDI +1"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-jamaica-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Jamaica</span>
        <span class="code">+1</span>
      </div>
    </div><div
      id="ss_elem_list_8180"
      data-search-value="Japão +81"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Japão DDI +81"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-japan-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Japão</span>
        <span class="code">+81</span>
      </div>
    </div><div
      id="ss_elem_list_96281"
      data-search-value="Jordânia +962"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Jordânia DDI +962"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-jordan-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Jordânia</span>
        <span class="code">+962</span>
      </div>
    </div><div
      id="ss_elem_list_96582"
      data-search-value="Kuait +965"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Kuait DDI +965"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-kuwait-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Kuait</span>
        <span class="code">+965</span>
      </div>
    </div><div
      id="ss_elem_list_85683"
      data-search-value="Laos +856"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Laos DDI +856"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-laos-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Laos</span>
        <span class="code">+856</span>
      </div>
    </div><div
      id="ss_elem_list_37184"
      data-search-value="Letônia +371"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Letônia DDI +371"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-latvia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Letônia</span>
        <span class="code">+371</span>
      </div>
    </div><div
      id="ss_elem_list_96185"
      data-search-value="Líbano +961"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Líbano DDI +961"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-lebanon-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Líbano</span>
        <span class="code">+961</span>
      </div>
    </div><div
      id="ss_elem_list_42386"
      data-search-value="Liechtenstein +423"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Liechtenstein DDI +423"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-liechtenstein-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Liechtenstein</span>
        <span class="code">+423</span>
      </div>
    </div><div
      id="ss_elem_list_37087"
      data-search-value="Lituânia +370"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Lituânia DDI +370"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-lithuania-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Lituânia</span>
        <span class="code">+370</span>
      </div>
    </div><div
      id="ss_elem_list_35288"
      data-search-value="Luxemburgo +352"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Luxemburgo DDI +352"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-luxembourg-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Luxemburgo</span>
        <span class="code">+352</span>
      </div>
    </div><div
      id="ss_elem_list_6089"
      data-search-value="Malásia +60"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Malásia DDI +60"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-malaysia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Malásia</span>
        <span class="code">+60</span>
      </div>
    </div><div
      id="ss_elem_list_96090"
      data-search-value="Maldivas +960"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Maldivas DDI +960"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-maldives-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Maldivas</span>
        <span class="code">+960</span>
      </div>
    </div><div
      id="ss_elem_list_38991"
      data-search-value="Macedônia +389"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Macedônia DDI +389"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-macedonia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Macedônia</span>
        <span class="code">+389</span>
      </div>
    </div><div
      id="ss_elem_list_35692"
      data-search-value="Malta +356"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Malta DDI +356"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-malta-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Malta</span>
        <span class="code">+356</span>
      </div>
    </div><div
      id="ss_elem_list_5293"
      data-search-value="México +52"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="México DDI +52"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-mexico-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>México</span>
        <span class="code">+52</span>
      </div>
    </div><div
      id="ss_elem_list_37394"
      data-search-value="Moldova +373"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Moldova DDI +373"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-moldova-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Moldova</span>
        <span class="code">+373</span>
      </div>
    </div><div
      id="ss_elem_list_37795"
      data-search-value="Mônaco +377"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Mônaco DDI +377"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-monaco-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Mônaco</span>
        <span class="code">+377</span>
      </div>
    </div><div
      id="ss_elem_list_97696"
      data-search-value="Mongólia +976"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Mongólia DDI +976"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-mongolia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Mongólia</span>
        <span class="code">+976</span>
      </div>
    </div><div
      id="ss_elem_list_38297"
      data-search-value="Montenegro +382"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Montenegro DDI +382"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-montenegro-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Montenegro</span>
        <span class="code">+382</span>
      </div>
    </div><div
      id="ss_elem_list_9598"
      data-search-value="Myanma +95"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Myanma DDI +95"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-myanmar-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Myanma</span>
        <span class="code">+95</span>
      </div>
    </div><div
      id="ss_elem_list_97799"
      data-search-value="Nepal +977"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Nepal DDI +977"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-nepal-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Nepal</span>
        <span class="code">+977</span>
      </div>
    </div><div
      id="ss_elem_list_505100"
      data-search-value="Nicarágua +505"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Nicarágua DDI +505"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-nicaragua-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Nicarágua</span>
        <span class="code">+505</span>
      </div>
    </div><div
      id="ss_elem_list_47101"
      data-search-value="Noruega +47"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Noruega DDI +47"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-norway-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Noruega</span>
        <span class="code">+47</span>
      </div>
    </div><div
      id="ss_elem_list_64102"
      data-search-value="Nova Zelândia +64"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Nova Zelândia DDI +64"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-new-zeland-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Nova Zelândia</span>
        <span class="code">+64</span>
      </div>
    </div><div
      id="ss_elem_list_968103"
      data-search-value="Omã +968"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Omã DDI +968"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-oma-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Omã</span>
        <span class="code">+968</span>
      </div>
    </div><div
      id="ss_elem_list_507104"
      data-search-value="Panamá +507"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Panamá DDI +507"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-panama-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Panamá</span>
        <span class="code">+507</span>
      </div>
    </div><div
      id="ss_elem_list_92105"
      data-search-value="Paquistão +92"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Paquistão DDI +92"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-pakistan-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Paquistão</span>
        <span class="code">+92</span>
      </div>
    </div><div
      id="ss_elem_list_595106"
      data-search-value="Paraguai +595"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Paraguai DDI +595"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-paraguay-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Paraguai</span>
        <span class="code">+595</span>
      </div>
    </div><div
      id="ss_elem_list_51107"
      data-search-value="Peru +51"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Peru DDI +51"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-peru-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Peru</span>
        <span class="code">+51</span>
      </div>
    </div><div
      id="ss_elem_list_48108"
      data-search-value="Polônia +48"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Polônia DDI +48"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-poland-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Polônia</span>
        <span class="code">+48</span>
      </div>
    </div><div
      id="ss_elem_list_351109"
      data-search-value="Portugal +351"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Portugal DDI +351"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-portugal-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Portugal</span>
        <span class="code">+351</span>
      </div>
    </div><div
      id="ss_elem_list_974110"
      data-search-value="Qatar +974"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Qatar DDI +974"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-qatar-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Qatar</span>
        <span class="code">+974</span>
      </div>
    </div><div
      id="ss_elem_list_996111"
      data-search-value="Quirguistão +996"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Quirguistão DDI +996"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-kyrgyzstan-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Quirguistão</span>
        <span class="code">+996</span>
      </div>
    </div><div
      id="ss_elem_list_1112"
      data-search-value="República Dominicana +1"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="República Dominicana DDI +1"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-dominican-republic-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>República Dominicana</span>
        <span class="code">+1</span>
      </div>
    </div><div
      id="ss_elem_list_420113"
      data-search-value="República Tcheca +420"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="República Tcheca DDI +420"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-czech-republic-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>República Tcheca</span>
        <span class="code">+420</span>
      </div>
    </div><div
      id="ss_elem_list_40114"
      data-search-value="Romênia +40"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Romênia DDI +40"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-romania-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Romênia</span>
        <span class="code">+40</span>
      </div>
    </div><div
      id="ss_elem_list_7115"
      data-search-value="Rússia (antiga URSS) - Federação Russa +7"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Rússia (antiga URSS) - Federação Russa DDI +7"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-russia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Rússia (antiga URSS) - Federação Russa</span>
        <span class="code">+7</span>
      </div>
    </div><div
      id="ss_elem_list_378116"
      data-search-value="San Marino +378"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="San Marino DDI +378"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-san-marino-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>San Marino</span>
        <span class="code">+378</span>
      </div>
    </div><div
      id="ss_elem_list_1117"
      data-search-value="São Cristóvão e Neves +1"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="São Cristóvão e Neves DDI +1"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-saint-kitts-and-nevis-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>São Cristóvão e Neves</span>
        <span class="code">+1</span>
      </div>
    </div><div
      id="ss_elem_list_1118"
      data-search-value="Santa Lúcia +1"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Santa Lúcia DDI +1"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-saint-lucia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Santa Lúcia</span>
        <span class="code">+1</span>
      </div>
    </div><div
      id="ss_elem_list_1119"
      data-search-value="São Vicente e Granadinas +1"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="São Vicente e Granadinas DDI +1"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-saint-vincent-and-the-granadines-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>São Vicente e Granadinas</span>
        <span class="code">+1</span>
      </div>
    </div><div
      id="ss_elem_list_381120"
      data-search-value="Sérvia +381"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Sérvia DDI +381"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-serbia-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Sérvia</span>
        <span class="code">+381</span>
      </div>
    </div><div
      id="ss_elem_list_963121"
      data-search-value="Síria +963"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Síria DDI +963"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-syria-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Síria</span>
        <span class="code">+963</span>
      </div>
    </div><div
      id="ss_elem_list_94122"
      data-search-value="Sri Lanka +94"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Sri Lanka DDI +94"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-sri-lanka-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Sri Lanka</span>
        <span class="code">+94</span>
      </div>
    </div><div
      id="ss_elem_list_46123"
      data-search-value="Suécia +46"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Suécia DDI +46"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-sweden-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Suécia</span>
        <span class="code">+46</span>
      </div>
    </div><div
      id="ss_elem_list_41124"
      data-search-value="Suíça +41"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Suíça DDI +41"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-switzerland-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Suíça</span>
        <span class="code">+41</span>
      </div>
    </div><div
      id="ss_elem_list_597125"
      data-search-value="Suriname +597"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Suriname DDI +597"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-suriname-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Suriname</span>
        <span class="code">+597</span>
      </div>
    </div><div
      id="ss_elem_list_992126"
      data-search-value="Tadjiquistão +992"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Tadjiquistão DDI +992"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-tajikistan-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Tadjiquistão</span>
        <span class="code">+992</span>
      </div>
    </div><div
      id="ss_elem_list_66127"
      data-search-value="Tailândia +66"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Tailândia DDI +66"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-thailand-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Tailândia</span>
        <span class="code">+66</span>
      </div>
    </div><div
      id="ss_elem_list_670128"
      data-search-value="Timor-Leste +670"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Timor-Leste DDI +670"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-east-timor-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Timor-Leste</span>
        <span class="code">+670</span>
      </div>
    </div><div
      id="ss_elem_list_1129"
      data-search-value="Trindade e Tobago +1"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Trindade e Tobago DDI +1"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-trinidad-and-tobago-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Trindade e Tobago</span>
        <span class="code">+1</span>
      </div>
    </div><div
      id="ss_elem_list_993130"
      data-search-value="Turcomenistão +993"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Turcomenistão DDI +993"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-turkmenistan-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Turcomenistão</span>
        <span class="code">+993</span>
      </div>
    </div><div
      id="ss_elem_list_90131"
      data-search-value="Turquia +90"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Turquia DDI +90"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-turkey-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Turquia</span>
        <span class="code">+90</span>
      </div>
    </div><div
      id="ss_elem_list_380132"
      data-search-value="Ucrânia +380"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Ucrânia DDI +380"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-ukraine-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Ucrânia</span>
        <span class="code">+380</span>
      </div>
    </div><div
      id="ss_elem_list_598133"
      data-search-value="Uruguai +598"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Uruguai DDI +598"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-uruguay-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Uruguai</span>
        <span class="code">+598</span>
      </div>
    </div><div
      id="ss_elem_list_998134"
      data-search-value="Uzbequistão +998"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Uzbequistão DDI +998"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-uzbekistan-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Uzbequistão</span>
        <span class="code">+998</span>
      </div>
    </div><div
      id="ss_elem_list_379135"
      data-search-value="Vaticano +379"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Vaticano DDI +379"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-vatican-city-holy-see-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Vaticano</span>
        <span class="code">+379</span>
      </div>
    </div><div
      id="ss_elem_list_58136"
      data-search-value="Venezuela +58"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Venezuela DDI +58"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-venezuela-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Venezuela</span>
        <span class="code">+58</span>
      </div>
    </div><div
      id="ss_elem_list_84137"
      data-search-value="Vietnã +84"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="Vietnã DDI +84"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-vietnam-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>Vietnã</span>
        <span class="code">+84</span>
      </div>
    </div><div
      id="ss_elem_list_44138"
      data-search-value="País de Gales +44"
      class="brad-list-item brad-font-title-sm brad-list-item--line-top brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
      style="display: flex"
      role="option"
      aria-label="País de Gales DDI +44"
      tabindex="-1"
    >
      <span class="brad-list-item--ddi-flag brad-flag-wales-default"></span>
      <div class="brad-list-item--ddi-country brad-m-xs-l">
        <span>País de Gales</span>
        <span class="code">+44</span>
      </div>
    </div>

        <div
          class="brad-text-field-search--not-found brad-font-title-sm brad-list-item--ddi brad-p-lg-r brad-p-lg-l"
          role="option"
          id="ss_elem_list_nf"
        >
          Não há resultados para sua busca
        </div>
      </div>
      <div class="brad-text-field-search--actions">
        <button type="button" class="brad-btn brad-btn-text cancel">
          Fechar
        </button>
        <button type="button" class="brad-btn brad-btn-primary confirm">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| onColor | Estado de mudança de cor para fundos escuros boolean | - | FalseTrue |