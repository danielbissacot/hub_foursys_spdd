# Popover Stepper

O popover stepper funciona como os outros, mas com um caráter de navegação. Sendo utilizado principalmente no template de tutorial. Diferente dos outros que apenas possuem a ação de fechar, o popover tour possui dois links que podem ser usados de diferentes formas para avançar ou regredir na navegação. O usuário também pode cancelar o tutorial a qualquer momento com o link "fechar tutorial" que fica na parte superior do componente.

# Uso do HTML
```
<section>
<div
  class="brad-flex brad-flex-justify-content-center brad-font-paragraph-md "
>
  <a
    id="target-345"
    class="brad-text-link brad-p-sm"
    onclick="openPopover('target-345');"
    role="button"
  >
    Step 1</a
  >
</div>
<div id="target-2" class="brad-card brad-card--default brad-p-lg">
  <div>
    <h1>Step 2</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
      erat a ante.
    </p>
  </div>
</div>
<button id="target-3" class="brad-btn brad-btn-primary brad-m-xl-t brad-p-sm">
  Step 3
</button>
<!--Popover stepper start-->
<div
  class="brad-popover brad-popover-stepper brad-zindex--1020"
  id="popover-151"
  role="dialog"
>
  <em class="brad-popover__triangle"></em>
  <div
    class="brad-popover__content brad-popover-stepper__content"
    role="document"
  >
    <p
      class="brad-popover__text brad-font-subtitle-xs"
      role="paragraph"
      aria-label
    ></p>
  </div>
  <div
    class="brad-flex brad-flex-justify-content-between brad-popover-stepper__actions brad-m-sm-t"
  >
    <div
      id="next-button"
      class="brad-flex brad-flex-align-items-center bps-next"
      onclick="next();"
      role="button"
    >
      <a class="brad-font-link-sm">Próximo</a>
      <span class="icon-ui-chevron-right bps-icon"></span>
    </div>

    <div
      id="prev-button"
      class="brad-flex brad-flex-align-items-center bps-prev bps-hidden"
      onclick="prev();"
      role="button"
    >
      <span class="icon-ui-chevron-left bps-icon"></span>
      <a class="brad-font-link-sm"> Anterior</a>
    </div>

    <div class="brad-flex bps-finish">
      <span></span>
      <a
        id="close-button"
        class="brad-flex bps-close icon-close"
        onclick="closePopover();"
        role="button"
        aria-label="Fechar tutorial"
        ><em class="icon-ui-close"> </em>
      </a>
    </div>
  </div>

</div>
<!--Popover stepper end-->
</section>
```

Por padrão utilizar a classe brad-zindex--1020 para definir o empilhamento correto do elemento na página.

# Comportamento Javascript
## Inicialização

O PopoverSteeper funciona em um popover normal porem com um serviço Javascript para controlar uma lista passada como parâmetro.

O getInstance tem como parametro padrão o Object {}, por exemplo {id: "#idElemento"}.

```
const list = [
{
  id: "1",
  text: "1 Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.",
  target: "target-345",
  direction: "bottom", // opcional, caso não especificar, será definido pelo getInstance
},
{
  id: "2",
  text: "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.",
  target: "target-2",
},
{
  id: "3",
  text: "3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.",
  target: "target-3",
  direction: "top",
},
];
const popoverService = LiquidCorp.BradPopoverService.getInstance({
id: "popover-151",
idTarget: "target-345",
list: list,
currentItem: list[0],
direction: "bottom",
hiddenCloseButton: false,
});
function openPopover(idTarget) {
popoverService.open();
popoverService.resetStepper(idTarget);
}
function closePopover() {
popoverService.close();
}
function prev() {
popoverService.prevStepper();
}
function next() {
popoverService.nextStepper();
}
/* eventListener customizado, usado para obter informações do popover atual (apenas para uso no popover-stepper) */
function addListenerNext(service) {
service.ePopover.addEventListener("nextStep", (e) => {
  //console.log(e.detail, "next");
});
}
function addListenerPrev(service) {
service.ePopover.addEventListener("prevStep", (e) => {
  //console.log(e.detail, "prev");
});
}
function addListenerFinish(service) {
service.ePopover.addEventListener("finishStep", (e) => {
  //console.log(e.detail, "finish");
});
}
addListenerNext(popoverService);
addListenerPrev(popoverService);
addListenerFinish(popoverService);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object {}], por exemplo **[{id: "#idElemento1"}, {id: "#idElemento2"}, {id: "#idElemento3"}, ...]**.

## Options popover específicos para o popover stepper

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | "" | ID vinculado ao HTML do componente |
| idTarget | string | "" | ID vinculado ao HTML do target |
| list | [] | "" | Lista de passos |
| currentItem | Object(id,text,target) | "" | Passo atual |
| direction | string | "bottom" | Posição vertical do popover |
| overlay | objeto | "" | Opcional, mas caso use juntamente com overlay é passado o objeto do serviço de overlay |
| hiddenCloseButton | boolean | false | Opcional, quando ativado esconde o botão de fechar no último passo. |

## Metódos popover específicos para o popover stepper

| Método | Parâmetros | Descrição |
| --- | --- | --- |
| nextStepper | N/A | Passa para o proximo item da lista e troca o valor do currentItem |
| prevStepper | N/A | Volta para o item anterior da lista e troca o valor do currentItem |
| resetStepper | idTarget string | Atualiza os valores para nova inicialização de steps |

# Posicionamento
Ao abrir o popover é priorizado a direção de abertura definida pelo usuário.
No entanto, se o espaço for insuficiente, ele se reposicionará para a melhor alternativa visível.
## Acessibilidade

A maior parte da acessibilidade do Popover Stepper é controlada automaticamente pelo serviço BradPopoverStepperService. Isso inclui a ordem de foco dos elementos, o controle dos atributos tabindex, aria-hidden, e a visibilidade dos botões conforme o contexto de cada passo.

O container do popover utiliza o atributo role="tooltip", indicando ao leitor de tela que se trata de um conteúdo flutuante.
O conteúdo principal fica em um <p class="brad-popover__text">.

O serviço do Popover Stepper controla a ordem de foco dos elementos interativos para proporcionar uma navegação lógica e previsível via teclado:

Texto do Passo: O foco inicial é direcionado ao texto explicativo do passo atual, permitindo que leitores de tela anunciem o conteúdo imediatamente.
Botão "Anterior": Se disponível, o foco segue para o botão de voltar ao passo anterior.
Botão "Próximo": Em seguida, o foco vai para o botão de avançar para o próximo passo.
Botão "Fechar Tutorial": Por fim, o foco é direcionado ao botão de fechar o tutorial.

Essa ordem garante que o usuário percorra todos os elementos relevantes do popover antes de sair do fluxo do tutorial.

## Como nos casos exemplificados a seguir:

```
<div
  class="brad-flex brad-flex-justify-content-center brad-font-paragraph-md "
>
  <a
    id="[ID_DO_TARGET]"
    class="brad-text-link brad-p-sm"
    onclick=" servico.open(); servico.resetStepper('[ID_DO_TARGET]');"
    role="button"
    aria-label="Primeiro passo  Abrir popover stepper"
    tabindex="0"
    aria-expanded="false"
  >
    Step 1
  </a>
</div>

<div id="target-2" class="brad-card brad-card--default brad-p-lg">
  <div>
    x
    <h1>Step 2</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
      posuere erat a ante.
    </p>
  </div>
</div>

<button
  id="target-3"
  class="brad-btn brad-btn-primary brad-m-xl-t brad-p-sm"
>
  Step 3
</button>

<!--Popover stepper start-->
<div
  class="brad-popover brad-popover-stepper brad-zindex--1020"
  id="[ID_DO_POPOVER]"
  role="tooltip"
>
  <em class="brad-popover__triangle"></em>

  <div
    class="brad-popover__content brad-popover-stepper__content"
    aria-label
  >
    <p
      class="brad-popover__text brad-font-subtitle-xs"
      role="paragraph"
    ></p>
  </div>
  <div
    class="brad-flex brad-flex-justify-content-between brad-popover-stepper__actions brad-m-sm-t"
  >
    <div
      id="prev-button"
      class="brad-flex brad-flex-align-items-center bps-prev bps-hidden"
      onclick="servico.prevStepper();"
      role="button"
      aria-label="Passo anterior"
    >
      <span class="icon-ui-chevron-left bps-icon"></span>
      <a> Anterior</a>
    </div>

    <div
      id="next-button"
      class="brad-flex brad-flex-align-items-center bps-next"
      onclick="servico.nextStepper();"
      role="button"
      aria-label="Próximo passo"
    >
      <a> Próximo</a>
      <span class="icon-ui-chevron-right bps-icon"></span>
    </div>

    <div class="brad-flex bps-finish">
      <span></span>
      <a
        id="close-button"
        class="brad-flex bps-close"
        onclick="servico.close();"
        role="button"
        aria-label="Fechar tutorial"
        >Fechar tutorial</a
      >
    </div>
  </div>
</div>
<!--Popover stepper end-->
```

Porém, é fundamental garantir que o atributo aria-label do botão "Próximo" (.bps-next) esteja sempre atualizado. O serviço já faz essa atualização automaticamente, mudando, por exemplo, para "Concluir" no último passo, mas a atualização dos passos anteriores devem ser programadas.

```
function eventsPopover(service) {
service.ePopover.addEventListener("nextStep", (e) => {
  action("nextStep")(e);
  updateAriaExpanded(service.idTarget, true);
  resetNextButtonLabelIfNotLast(e);
});
service.ePopover.addEventListener("prevStep", (e) => {
  action("prevStep")(e);
  resetNextButtonLabelIfNotLast(e);
});
service.ePopover.addEventListener("finishStep", (e) => {
  action("finishStep")(e);
  updateAriaExpanded(service.idTarget, false);
  resetNextButtonLabelIfNotLast(e);
});
}
/**
* Atualiza o atributo aria-expanded do botão de disparo.
* @param {string} idTarget
* @param {boolean} expanded
*/
function updateAriaExpanded(idTarget, expanded) {
const btn = document.getElementById(idTarget);
if (btn) {
  btn.setAttribute("aria-expanded", String(expanded));
}
}
/**
* Reseta o label do botão "Próximo" se não for o último passo ou se for o primeiro passo.
*  @param {CustomEvent} e
* @param {string} label
*/
function resetNextButtonLabelIfNotLast(e, label = "Próximo passo") {
if (e.detail.status !== "last" || e.detail.currentIndex === 0) {
  e.target.querySelector("#next-button")
    .setAttribute("aria-label", label);
}
}
```
Exemplos
Popover Stepper
```
<section>
  <div
    class="brad-flex brad-flex-justify-content-center brad-font-paragraph-md "
  >
    <a
      id="popover-281"
      class="brad-text-link brad-p-sm"
      onclick=" window['popover-281'].open(); window['popover-281'].resetStepper('popover-281');"
      role="button"
      aria-label="Primeiro passo Abrir popover stepper"
      tabindex="0"
      aria-expanded="false"
    >
      Step 1
    </a>
  </div>

  <div id="target-2" class="brad-card brad-card--default brad-p-lg">
    <div>
      <h1>Step 2</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
        posuere erat a ante.
      </p>
    </div>
  </div>

  <button
    id="target-3"
    class="brad-btn brad-btn-primary brad-m-xl-t brad-p-sm"
  >
    Step 3
  </button>

  <!--Popover stepper start-->
  <div
    class="brad-popover brad-popover-stepper brad-zindex--1020 "
    id="popover-151"
    role="tooltip"
  >
    <em class="brad-popover__triangle"></em>

    <div class="brad-popover__content brad-popover-stepper__content">
      <p
        class="brad-popover__text brad-font-subtitle-xs"
        role="paragraph"
      ></p>
    </div>
    <div
      class="brad-flex brad-flex-justify-content-between brad-popover-stepper__actions brad-m-sm-t"
    >
      <div
        id="prev-button"
        class="brad-flex brad-flex-align-items-center bps-prev bps-hidden"
        onclick="window['popover-281'].prevStepper();"
        role="button"
        aria-label="Passo anterior"
      >
        <span class="icon-ui-chevron-left bps-icon"></span>
        <a class="brad-font-link-sm"> Anterior</a>
      </div>

      <div
        id="next-button"
        class="brad-flex brad-flex-align-items-center bps-next"
        onclick="window['popover-281'].nextStepper();"
        role="button"
        aria-label="Próximo passo"
      >
        <a class="brad-font-link-sm"> Próximo</a>
        <span class="icon-ui-chevron-right bps-icon"></span>
      </div>

      <div class="brad-flex bps-finish">
        <span></span>
        <a
          id="close-button"
          class="brad-flex bps-close brad-font-link-sm"
          onclick="window['popover-281'].close();"
          role="button"
          aria-label="Fechar tutorial"
          >Fechar tutorial</a
        >
      </div>
    </div>
  </div>
  <!--Popover stepper end-->
</section>
```
Popover Stepper With Close Button Icon
```
<section>
  <div
    class="brad-flex brad-flex-justify-content-center brad-font-paragraph-md "
  >
    <a
      id="target-346"
      class="brad-text-link brad-p-sm"
      onclick="LiquidCorp.BradPopoverService.open();LiquidCorp.BradPopoverService.resetStepper('target-346');"
      role="button"
      aria-label="Primeiro passo  Abrir popover stepper"
      tabindex="0"
      aria-expanded="false"
    >
      Step 1
    </a>
  </div>

  <div id="target-20" class="brad-card brad-card--default brad-p-lg">
    <div>
      <h1>Step 2</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
        posuere erat a ante.
      </p>
    </div>
  </div>

  <button
    id="target-30"
    class="brad-btn brad-btn-primary brad-m-xl-t brad-p-sm"
  >
    Step 3
  </button>
  <!--Popover stepper start-->
  <div
    class="brad-popover brad-popover-stepper brad-zindex--1020 "
    id="popover-123"
    role="tootip"
  >
    <em class="brad-popover__triangle"></em>

    <div class="brad-popover__content brad-popover-stepper__content">
      <p class="brad-popover__text brad-font-subtitle-xs"></p>
    </div>
    <div
      class="brad-flex brad-flex-justify-content-between brad-popover-stepper__actions brad-m-sm-t"
    >
      <div
        id="prev-button"
        class="brad-flex brad-flex-align-items-center bps-prev bps-hidden"
        onclick="LiquidCorp.BradPopoverService.prevStepper();"
        role="button"
        aria-label="Passo anterior"
      >
        <span class="icon-ui-chevron-left bps-icon"></span>
        <a class="brad-font-link-sm"> Anterior</a>
      </div>

      <div
        id="next-button"
        class="brad-flex brad-flex-align-items-center bps-next"
        onclick="LiquidCorp.BradPopoverService.nextStepper();"
        role="button"
        aria-label="Próximo passo"
      >
        <a class="brad-font-link-sm"> Próximo</a>
        <span class="icon-ui-chevron-right bps-icon"></span>
      </div>

      <div class="brad-flex bps-finish">
        <span></span>
        <a
          id="close-button"
          class="brad-flex bps-close icon-close"
          onclick="LiquidCorp.BradPopoverService.close();"
          role="button"
          aria-label="Fechar tutorial"
          ><em class="icon-ui-close"> </em>
        </a>
      </div>
    </div>
  </div>
  <!--Popover stepper end-->
</section>
```