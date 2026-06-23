# Slider

Componente que possibilita escolher dentre um série de números através do arrastar de um botão, facilitando a experiência do usuário.

# Uso do HTML
```
<div id="slider1" class="brad-slider-container ">
<div class="brad-slider-container__popover__container">
  <div class="brad-slider-container__popover__ballon" aria-hidden="true">
    <span class="brad-slider-container__popover__texto"></span>
  </div>
  <div
    class="brad-slider-container__popover__indicator"
    aria-hidden="true"
  ></div>
</div>
<div class="brad-slider-container__slider__container">
  <div class="brad-slider-container__content-title brad-font-subtitle-xs">
    <p>Label 1</p>
  </div>
  <input
    type="range"
    name="slider1"
    step="1"
    min="0"
    max="1000"
    value="100"
    class="brad-slider-container__input-range"
  />
  <input
    type="range"
    name="slider2"
    step="1"
    min="0"
    max="1000"
    value="150"
    class="brad-slider-container__input-range"
  />
</div>
<div class="brad-slider-container-information">
  <div
    class="brad-slider-container-information__content-minimum brad-font-subtitle-xs"
  >
    <p class="brad-slider-container-information__text-mininum"></p>
  </div>
  <div
    class="brad-slider-container-information__content-maximum brad-font-subtitle-xs"
  >
    <p class="brad-slider-container-information__text-maximum"></p>
  </div>
</div>
</div>

<div id="slider2" class="brad-slider-container ">
<div class="brad-slider-container__popover__container">
  <div class="brad-slider-container__popover__ballon" aria-hidden="true">
    <span class="brad-slider-container__popover__texto"></span>
  </div>
  <div
    class="brad-slider-container__popover__indicator"
    aria-hidden="true"
  ></div>
</div>
<div class="brad-slider-container__slider__container">
  <div class="brad-slider-container__content-title brad-font-subtitle-xs">
    <p>Label 2</p>
  </div>
  <input
    type="range"
    name="slider1"
    step="1"
    min="0"
    max="500"
    value="100"
    class="brad-slider-container__input-range"
  />
</div>
<div class="brad-slider-container-information">
  <div class="brad-slider-container-information__content-minimum brad-font-subtitle-xs">
    <p class="brad-slider-container-information__text-mininum"></p>
  </div>
  <div class="brad-slider-container-information__content-maximum brad-font-subtitle-xs">
    <p class="brad-slider-container-information__text-maximum"></p>
  </div>
</div>
</div>
```
Estilos
## OnColor

O modo OnColor é uma solução para obter maior contraste para elementos visuais e componentes aplicados em fundo escuro e colorido. Este modo torna possível atender ao contraste mínimo recomendado pela WCAG.

```
<div id="slider1" class="brad-slider-container brad-slider-container--on-color">
<div class="brad-slider-container__popover__container">
  <div class="brad-slider-container__popover__ballon" aria-hidden="true">
    <span class="brad-slider-container__popover__texto"></span>
  </div>
  <div
    class="brad-slider-container__popover__indicator"
    aria-hidden="true"
  ></div>
</div>
<div class="brad-slider-container__slider__container">
  <div class="brad-slider-container__content-title brad-font-subtitle-xs">
    <p>Label 1</p>
  </div>
  <input
    type="range"
    name="slider1"
    step="1"
    min="0"
    max="1000"
    value="100"
    class="brad-slider-container__input-range"
  />
  <input
    type="range"
    name="slider2"
    step="1"
    min="0"
    max="1000"
    value="150"
    class="brad-slider-container__input-range"
  />
</div>
<div class="brad-slider-container-information">
  <div
    class="brad-slider-container-information__content-minimum brad-font-subtitle-xs"
  >
    <p class="brad-slider-container-information__text-mininum"></p>
  </div>
  <div
    class="brad-slider-container-information__content-maximum brad-font-subtitle-xs"
  >
    <p class="brad-slider-container-information__text-maximum"></p>
  </div>
</div>
</div>

<div id="slider2" class="brad-slider-container brad-slider-container--on-color">
<div class="brad-slider-container__popover__container">
  <div class="brad-slider-container__popover__ballon" aria-hidden="true">
    <span class="brad-slider-container__popover__texto"></span>
  </div>
  <div
    class="brad-slider-container__popover__indicator"
    aria-hidden="true"
  ></div>
</div>
<div class="brad-slider-container__slider__container">
  <div class="brad-slider-container__content-title brad-font-subtitle-xs">
    <p>Label 2</p>
  </div>
  <input
    type="range"
    name="slider1"
    step="1"
    min="0"
    max="500"
    value="100"
    class="brad-slider-container__input-range"
  />
</div>
<div class="brad-slider-container-information">
  <div class="brad-slider-container-information__content-minimum brad-font-subtitle-xs">
    <p class="brad-slider-container-information__text-mininum"></p>
  </div>
  <div class="brad-slider-container-information__content-maximum brad-font-subtitle-xs">
    <p class="brad-slider-container-information__text-maximum"></p>
  </div>
</div>
</div>
```
Comportamento Javascript
## Inicialização

## Comando para instanciar componente

```
const options = { targetSelector: "#slider1" };
const service = LiquidCorp.BradSliderService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo [{targetSelector: "#targetSelector1"}, {targetSelector: "#targetSelector2"}, {targetSelector: "#targetSelector3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID ou .classe vinculado ao HTML do componente |

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetro | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getValue() | - | Obtém valor do primeiro slider |
| getValues() | - | Obtém valores do primeiro e segundo slider |
| setValue(value) | number | Atribui um valor ao primeiro slider |
| setValues(value1, value2) | number, number | Atribui um valor ao primeiro e segundo slider |
| getMinimumValue() | - | Obtém valor minímo do componente |
| getMaximumValue() | - | Obtém valor maxímo do componente slider |
| setSuportTextMinumum(text) | string | Atribui o valor do texto de suporte minímo |
| getSuportTextMinumum() | - | Obtém valor do texto de suporte minímo |
| setSuportTextMaximum(text) | string | Atribui o valor do texto de suporte maxímo |
| getSuportTextMaximum() | - | Obtém valor do texto de suporte maxímo Obtém valor do texto de suporte maxímo |
| setMonetaryFormat(Intl) | Intl | Atribui um valor monetário que será usado no popover |
| setOnChange(callback) | function | Define um callback para ser chamado quando o valor do slider mudar. O callback recebe um objeto payload com 'values' (valor/valores do slider) e 'target' (elemento que disparou o evento) |
| destroy() | - | Destrói a instância do serviço e seus listeners |

## Como usar o método de evento setOnChange?

Para usar o método de evento setOnChange, basta passar uma função que receberá um objeto com os valores do slider e o elemento que disparou o evento.

## O callback recebe um objeto payload contendo:

values: Valor único (slider simples) ou objeto com valores (slider duplo)
target: Elemento HTML que disparou o evento
```
const sliderService = LiquidCorp.BradSliderService.getInstance({
  targetSelector: "#slider1",
});
sliderService.setOnChange((payload) => {
  console.log("Valores do slider:", payload.values);
  console.log("Elemento disparador:", payload.target);
});
```
## Acessibilidade

Certifique-se de adicionar o atributo aria-label na div que engloba a label de seu Slider e o atributo aria-hidden="true" para os pontos que devem esconder a leitura para que não haja duplicidade.

Para emitir os eventos de troca de valores para as ferramentas de acessibilidade, é criada uma div com a classe accessibility_feedback que será usada como transmissor de mudanças de valores, com ela pode se criar um método na jornada em que através do textContent possa se personalizar uma mensagem e atualizar o valor conforme valores de input do usuário. Lembre-se de adicionar nessa div, os atributos role="alert", aria-live="assertive" e aria-atomic="true".

Na classe do Slider há ainda um evento personalizado (accessibilityEvent) que pode ser usado para captar eventos do tipo oninput, onmousedown, ontouchstart, onmouseup, ontouchend, onmouseover e onmouseout do item seletor do slider, com esse evento, pode se disparar alterações da mesma maneira no textContent notificando também o usuário, como nos exemplos a seguir:

```
<div id="id" class="brad-slider-container">
<div class="brad-slider-container__popover__container">
  <div class="brad-slider-container__popover__ballon" aria-hidden="true">
    <span class="brad-slider-container__popover__texto"></span>
  </div>
  <div
    class="brad-slider-container__popover__indicator"
    aria-hidden="true"
  ></div>
</div>
<div class="brad-slider-container__slider__container">
  <div
    class="brad-slider-container__content-title brad-font-subtitle-xs"
    aria-label="Label, valor mínimo 0 e valor máximo 1000"
  >
    <p>Label</p>
  </div>
  <input
    type="range"
    name="slider1"
    step="1"
    min="0"
    max="1000"
    value="100"
    class="brad-slider-container__input-range"
    aria-valuemin="0"
    aria-valuemax="1000"
    aria-valuenow="100"
    aria-valuetext="100"
  />
  <input
    type="range"
    name="slider2"
    step="1"
    min="0"
    max="1000"
    value="150"
    class="brad-slider-container__input-range"
    aria-valuemin="0"
    aria-valuemax="1000"
    aria-valuenow="150"
    aria-valuetext="150"
  />
</div>
<div class="brad-slider-container-information">
  <div
    class="brad-slider-container-information__content-minimum brad-font-subtitle-xs"
    aria-hidden="true"
  >
    <p class="brad-slider-container-information__text-mininum"></p>
  </div>
  <div
    class="brad-slider-container-information__content-maximum brad-font-subtitle-xs"
    aria-hidden="true"
  >
    <p class="brad-slider-container-information__text-maximum"></p>
  </div>
</div>
<div
  class="accessibility_feedback"
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
></div>
</div>
```
```
window.bradSliderService = LiquidCorp.BradSliderService.getInstance({
targetSelector: "#" + id1,
});

const sliderContainer = document.getElementById("id");
const sliderElements = sliderContainer.querySelectorAll(
".brad-slider-container__input-range"
);
const sliderAccessibilityFeedback = sliderContainer.querySelector(
".accessibility_feedback"
);

function createFeedbackMessage() {
let minValue = bradSliderService.getMinimumValue();
let maxValue = bradSliderService.getMaximumValue();
let firstSliderValue = bradSliderService.getValues()[0];
let secondSliderValue = bradSliderService.getValues()[1];

sliderAccessibilityFeedback.textContent = `Mínimo ${minValue} e máximo ${maxValue},
valor atual: slider um ${firstSliderValue} e
slider dois ${secondSliderValue}`;
}

sliderElements.forEach((element) => {
element.addEventListener("accessibilityEvent", () => {
createFeedbackMessage();
});
});
```
Exemplos
Slider
```
<div
  id="slider-354"
  class="brad-slider-container "
>
  <div class="brad-slider-container__popover__container">
    <div class="brad-slider-container__popover__ballon" aria-hidden="true">
      <span class="brad-slider-container__popover__texto"></span>
    </div>

    <div
      class="brad-slider-container__popover__indicator"
      aria-hidden="true"
    ></div>
  </div>

  <div class="brad-slider-container__slider__container">
    <div class="brad-slider-container__content-title brad-font-subtitle-xs">
      <p>Slider</p>
    </div>

    <input
      type="range"
      name="slider1"
      step="1"
      min="0"
      max="100"
      value="30"
      class="brad-slider-container__input-range"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow="30"
      aria-valuetext="30"
    />

    
  </div>

  <div class="brad-slider-container-information">
    <div
      class="brad-slider-container-information__content-minimum brad-font-subtitle-xs"
    >
      <p class="brad-slider-container-information__text-mininum"></p>
    </div>

    <div
      class="brad-slider-container-information__content-maximum brad-font-subtitle-xs"
    >
      <p class="brad-slider-container-information__text-maximum"></p>
    </div>
  </div>
</div>
```