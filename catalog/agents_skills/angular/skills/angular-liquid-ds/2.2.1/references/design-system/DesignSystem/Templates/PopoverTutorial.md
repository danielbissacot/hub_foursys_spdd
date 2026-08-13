# Popover Tutorial

É um template que usa os componentes overlay, popover e o serviço popover stepper.

# Uso do HTML
```
<!--Overlay start-->
<canvas
id="myCanvas"
class="brad-overlay hidden"
onclick="closeTutorial();"
></canvas>
<!--Overlay end-->
<section>
<div
  class="brad-flex brad-flex-justify-content-center brad-font-paragraph-md"
>
  <a
    id="target-345"
    class="brad-text-link brad-p-sm"
    onclick="openTutorial('target-345');"
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
  class="brad-popover brad-popover-stepper brad-zindex--1020 "
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
      onclick="nextTutorial();"
      role="button"
    >
      <a class="brad-font-link-sm">Próximo</a>
      <span class="icon-ui-chevron-right bps-icon"></span>
    </div>

    <div
      id="prev-button"
      class="brad-flex brad-flex-align-items-center bps-prev bps-hidden"
      onclick="prevTutorial();"
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
        onclick="closeTutorial();"
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

O getInstance tem como parametro padrão o Object {}, por exemplo {id: "idElemento"}.

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
const overlayServices = LiquidCorp.BradOverlayService.getInstance({
id: "myCanvas",
});
const popoverService = LiquidCorp.BradPopoverService.getInstance({
id: "popover-151",
idTarget: "target-345",
list: list,
currentItem: list[0],
direction: "bottom",
idOverlay: "myCanvas",
});
function closeTutorial() {
overlayServices.close();
popoverService.close();
}
function openTutorial(idTarget) {
popoverService.open();
popoverService.resetStepper(idTarget);
overlayServices.open(idTarget);
}
function prevTutorial() {
popoverService.prevStepper();
overlayServices.updateTarget(popoverService.stepper.currentItem.target);
}
function nextTutorial() {
popoverService.nextStepper();
overlayServices.updateTarget(popoverService.stepper.currentItem.target);
}
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object {}], por exemplo **[{id: "idElemento1"}, {id: "idElemento2"}, {id: "idElemento3"}, ...]**.

# Documentação stepper

## Clique para ver as informações do popover stepper

# Documentação overlay

## Clique para ver as informações do overlay

# Exemplos
Popover Tutorial
```
<!--Overlay start-->
<canvas
  id="myCanvas"
  class="brad-overlay hidden"
  onclick="closeTutorial()"
></canvas>
<!--Overlay end-->

<section>
  <div
    class="brad-flex brad-flex-justify-content-center brad-font-paragraph-md "
  >
    <a
      id="target-345"
      class="brad-text-link brad-p-sm"
      onclick="openTutorial('target-345')"
      role="button"
      tabindex="0"
      aria-label="Iniciar tutorial"
      aria-expanded="false"
      aria-controls="popover-151"
    >
      Step 1</a
    >
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
      <p class="brad-popover__text brad-font-subtitle-xs"></p>
    </div>
    <div
      class="brad-flex brad-flex-justify-content-between brad-popover-stepper__actions brad-m-sm-t"
    >
      <div
        id="prev-button"
        class="brad-flex brad-flex-align-items-center bps-prev bps-hidden"
        onclick="prevTutorial()"
        role="button"
      >
        <span class="icon-ui-chevron-left bps-icon"></span>
        <a class="brad-font-link-sm"> Anterior</a>
      </div>

      <div
        id="next-button"
        class="brad-flex brad-flex-align-items-center bps-next"
        onclick="nextTutorial()"
        role="button"
      >
        <a class="brad-font-link-sm"> Próximo</a>
        <span class="icon-ui-chevron-right bps-icon"></span>
      </div>

      <div class="brad-flex bps-finish">
        <span></span>
        <a
          id="close-button"
          class="brad-flex bps-close icon-close"
          onclick="closeTutorial()"
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