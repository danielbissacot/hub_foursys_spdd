# Progress Stepper

A barra de progresso é um indicador que mostra o progresso da conclusão, ou seja, tarefa ou tempo. Use-o com porcentagens, etapas e outras opções..

# Uso do WebComponent
```
<brad-progress-stepper id="[ID_DO_PROGRESS_STEPPER]"></brad-progress-stepper>
```
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-progress-stepper | Componente | Sim | Sim | Componente principal do Progress Stepper, define a estrutura de acordo com os atributos informados |
| brad-progress-stepper-bar | Sub-Componente | Não | Sim | Inserido automáticamente ao instanciar o brad-progress-stepper, responsável por apresentar a barra de progresso atual |
| brad-progress-stepper-steps | Sub-Componente | Não | Sim | Inserido automáticamente ao instanciar o brad-progress-stepper, responsável por representar o total de etapas presentes |
| brad-progress-stepper-label | Sub-Componente | Não | Sim | Inserido ao informar no brad-progress-stepper a propriedade brad-show-default-label. Será inserido um componente genérico de parágrafo indicando a progressão de etapas. Por exemplo: "<p class="brad-font-subtitle-xxs brad-p-xs-t">Passo 0 de 2</p>" |

# Propriedades
## brad-progress-stepper

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | - | Identificador do elemento alvo para ser utilizado na criação interna do serviço |
| brad-current-step | number | 0 | Indica a etapa atual da barra de progresso |
| brad-amount-of-steps | number | 1 | Indica a quantidade total de etapas |
| brad-on-color | boolean | false | Alterna as cores do componente para uso sobre fundos variados. |

# Eventos

| Nome | Detalhe | Descrição |
| --- | --- | --- |
| brad-step-changed | { currentStep: number, amountOfSteps: number } | Evento disparado sempre que o passo atual (brad-current-step) ou quantidade de passos (brad-amount-of-steps) é alterado |

# Comportamento Javascript
## Inicialização

A inicialização do serviço não é necessária. (componente nativo)

# Acessibilidade
## Uso com Label Padrão

Caso utilize o brad-progress-stepper-label sem conteúdo, ele automaticamente exibirá "Passo X de Y" e já possui tabindex="0" por padrão:

```
<brad-progress-stepper id="ps1" brad-current-step="1" brad-amount-of-steps="3">
<brad-progress-stepper-label></brad-progress-stepper-label>
</brad-progress-stepper>
```
## Uso com Label Customizado

Você pode inserir conteúdo customizado no label, inclusive usando bindings de frameworks:

```
<!-- Conteúdo estático -->
<brad-progress-stepper id="ps2" brad-current-step="1" brad-amount-of-steps="3">
<brad-progress-stepper-label>Etapa 1 de 3 concluída</brad-progress-stepper-label>
</brad-progress-stepper>

<!-- Conteúdo dinâmico em Angular -->

<brad-progress-stepper id="ps3" [brad-current-step]="currentStep" [brad-amount-of-steps]="totalSteps">
<brad-progress-stepper-label>{{currentStep}} de {{totalSteps}}</brad-progress-stepper-label>
</brad-progress-stepper>
```
## Usando Evento para Atualização Dinâmica

O componente dispara o evento brad-step-changed sempre que o passo muda. Você pode escutar esse evento para atualizar conteúdo customizado:

```
const progressStepper = document.getElementById('ps1');
progressStepper.addEventListener('brad-step-changed', (event) => {
console.log('Passo atual:', event.detail.currentStep);
console.log('Total de passos:', event.detail.amountOfSteps);

// Atualize conteúdo customizado aqui
const customLabel = document.querySelector('.meu-label-customizado');
if (customLabel) {
customLabel.textContent = `Progresso: ${event.detail.currentStep}/${event.detail.amountOfSteps}`;
}
});
```
## Label Oculto para Leitores de Tela

Caso não haja um label visível, crie um elemento oculto com aria-live="polite" para acessibilidade:

```
function readResult(step) {
const paragraph = document.getElementById("read-result");
const eProgressStepper = document.getElementById([ID_DO_PROGRESS_STEPPER]);
if (eProgressStepper) {
eProgressStepper.setAttribute("brad-current-step", step);
}
if (paragraph) {
paragraph.textContent = "";
paragraph.textContent = `Passo ${step} de 3`;
}
}
```

# Exemplo do html:

```
<brad-progress-stepper
  id="[ID_DO_PROGRESS_STEPPER]"
  brad-current-step="0"
  brad-amount-of-steps="6"
>
  <p
    id="read-result"
    style="opacity: 0; position: absolute;"
    aria-live="polite"
  ></p>
</brad-progress-stepper>
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
</div>
```
Exemplo
```
<brad-progress-stepper
  id="ps-106"
  brad-current-step="0"
  brad-amount-of-steps="3"
  brad-on-color="false"
>
  <brad-progress-stepper-label></brad-progress-stepper-label>
</brad-progress-stepper>
<div class="brad-flex brad-m-lg-t brad-flex-wrap">
  <button
    class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
    onclick="updateStep(0)"
  >
    <div class="fab-text">GO TO 0</div>
  </button>

  <button
    class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
    onclick="updateStep(1)"
  >
    <p class="fab-text">GO TO 1</p>
  </button>

  <button
    class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
    onclick="updateStep(2)"
  >
    <div class="fab-text">GO TO 2</div>
  </button>

  <button
    class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
    onclick="updateStep(3)"
  >
    <div class="fab-text">GO TO 3</div>
  </button>
</div>
```