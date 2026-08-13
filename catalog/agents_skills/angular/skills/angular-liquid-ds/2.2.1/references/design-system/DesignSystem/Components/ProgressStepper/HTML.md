# Progress Stepper

A barra de progresso é um indicador que mostra o progresso da conclusão, ou seja, tarefa ou tempo. Use-o com porcentagens, etapas e outras opções..

# Uso do HTML
Estilos
Default
```
<div id="ps-changes" class="brad-progress-stepper">
<div class="brad-progress-stepper__bar">
  <div class="brad-progress-stepper__bar__growth"></div>
</div>

<div class="brad-progress-stepper__steps">
  <em
    class="brad-progress-stepper__bar__circle brad-progress-stepper__bar__circle--js"
  ></em>
</div>
</div>

<div class="brad-progress-stepper--text brad-flex brad-flex-justify-content-end">
<p class="brad-font-subtitle-xxs brad-p-xs-t">Passo 2 de 3</p>
</div>
```
## OnColor

O modo OnColor é uma solução para obter maior contraste para elementos visuais e componentes aplicados em fundo escuro e colorido. Este modo torna possível atender ao contraste mínimo recomendado pela WCAG.

```
<div
id="ps-changes"
class="brad-progress-stepper brad-progress-stepper--on-color"
>
<div class="brad-progress-stepper__bar">
  <div class="brad-progress-stepper__bar__growth"></div>
</div>

<div class="brad-progress-stepper__steps">
  <em
    class="brad-progress-stepper__bar__circle brad-progress-stepper__bar__circle--js"
  ></em>
</div>
</div>

<div class="brad-progress-stepper--text brad-flex brad-flex-justify-content-end">
<p class="brad-font-subtitle-xxs brad-p-xs-t">Passo 2 de 3</p>
</div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do progress-stepper

```
const targetSelector = `#ps-changes`;
const currentStep = 0;
const amountOfSteps = 3;
const options = { targetSelector, currentStep, amountOfSteps };

const service = LiquidCorp.BradProgressStepperService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object {}], por exemplo [{targetSelector: "#idModalDialog1"}, {targetSelector: "#idModalDialog2"}, {targetSelector: "#idModalDialog3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID ou .classe vinculado ao HTML do componente |
| currentStep | number | 0 | Passo atual que se encontra |
| amountOfSteps | number | 1 | Quantidade total de passos |

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao ID passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao ID passado no options |
| goToStep | number | Usado para alterar passo atual e ir para o passo passado por parâmetro (quantiade de passo concluídos) |
| getCurrentStep | N/A | Obtém posição do passo atual |
| getAmountOfSteps | N/A | Obtém quantidade total de passos |

# Uso básico
```
const service = LiquidCorp.BradProgressStepperService.getInstance({
targetSelector: "#ps-changes",
currentStep: 0,
amountOfSteps: 6,
});

service.goToStep(2); // Movimenta o progresso até o passo 2; (2 passos concluídos)
```
## Acessibilidade

Caso haja um paragrafo visível informando o passo que está e a quantidade total de passos do progess stepper, certifique-se de adicionar um tabindex=0 neste paragrafo.

Caso não haja um paragrafo visível informando o passo que está e a quantidade total de passos do progress stepper, então crie um paragrafo com id="read-result e adicione o atibuto style="opacity: 0; position: absolute;" para que não seja visualizado na tela nem ocupe espaço na DOM, também adicione um atributo aria-label="polite" para ser lido sempre que for modificado, e crie uma função que modifique sempre que houver mudança no progress steper.

Exemplo da função que muda o conteúdo do paragrafo e altera a posição do progress stepper:

```
function readResult(step) {
const paragraph = document.getElementById("read-result");
if (paragraph) {
paragraph.textContent = "";
paragraph.textContent = `Passo ${step} de 6`;
}

window.LiquidCorp.BradProgressStepperService.getInstance({
targetSelector: "#ps-changes",
currentStep: 0,
amountOfSteps: 6,
}).goToStep(step);
}
```

# Exemplo do html:

```
<div id="[ID_DO_PROGRESS_STEPPER]" class="brad-progress-stepper brad-progress-stepper--on-color">
<div class="brad-progress-stepper__bar">
  <div class="brad-progress-stepper__bar__growth"></div>
</div>

<div class="brad-progress-stepper__steps">
<em
  class="brad-progress-stepper__bar__circle brad-progress-stepper__bar__circle--js"
  aria-live="polite"
  aria-label="leia isso aqui"
></em>
</div>

<p
  id="read-result"
  style="opacity: 0; position: absolute;"
  aria-live="polite"
></p>
</div>

<div class="brad-flex brad-m-lg-t brad-flex-wrap">
<button
  class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
  onclick="readResult(0)"
>
  <div class="fab-text">GO TO 0</div>
</button>

<button
class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
onclick="readResult(1)"
>
<p class="fab-text">GO TO 1</p>
</button>

<button
class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
onclick="readResult(2)"
>
<div class="fab-text">GO TO 2</div>
</button>

<button
class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
onclick="readResult(3)"
>
<div class="fab-text">GO TO 3</div>
</button>

<button
class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
onclick="readResult(4)"
>
<div class="fab-text">GO TO 4</div>
</button>

<button
class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
onclick="readResult(5)"
>
<div class="fab-text">GO TO 5</div>
</button>

<button
  class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
  onclick="readResult(6)"
>
  <div class="fab-text">GO TO 6</div>
</button>
</div>
```
Exemplo
```
<div id="ps-changes" class="brad-progress-stepper">
  <div class="brad-progress-stepper__bar">
    <div class="brad-progress-stepper__bar__growth"></div>
  </div>

  <div class="brad-progress-stepper__steps">
    <em
      class="brad-progress-stepper__bar__circle brad-progress-stepper__bar__circle--js"
      aria-live="polite"
      aria-label="leita isso aqui"
    ></em>
  </div>

  <p
    id="read-result"
    style="opacity: 0; position: absolute;"
    aria-live="polite"
  >
    Passo 1 de 3
  </p>
</div>

<div class="brad-flex brad-m-lg-t brad-flex-wrap">
  <button
    class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
    onclick="readResult(0)"
  >
    <div class="fab-text">GO TO 0</div>
  </button>

  <button
    class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
    onclick="readResult(1)"
  >
    <p class="fab-text">GO TO 1</p>
  </button>

  <button
    class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
    onclick="readResult(2)"
  >
    <div class="fab-text">GO TO 2</div>
  </button>

  <button
    class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
    onclick="readResult(3)"
  >
    <div class="fab-text">GO TO 3</div>
  </button>

  <button
    class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
    onclick="readResult(4)"
  >
    <div class="fab-text">GO TO 4</div>
  </button>

  <button
    class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
    onclick="readResult(5)"
  >
    <div class="fab-text">GO TO 5</div>
  </button>

  <button
    class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
    onclick="readResult(6)"
  >
    <div class="fab-text">GO TO 6</div>
  </button>
</div>
```