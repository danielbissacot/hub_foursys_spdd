# Progress

Os indicadores de progresso fornecem feedback ao usuário sobre a porcentagem de conclusão de uma tarefa, fluxo de trabalho ou jornada. Componente customizável podendo assumir a forma linear ou circular em barra.

# Uso do WebComponent

O Progress possuí diversos componentes utilitários que facilitam a construir diversos cenários de uso.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-progress | Componente | Sim | Sim | Componente principal responsável pela criação dos sub-componentes de acordo com as propriedades informadas |
| brad-progress-bar | Sub-Componente | Não | Sim | Componente inserido pelo brad-progress caso o tipo informado seja bar |
| brad-progress-circle | Sub-Componente | Não | Sim | Componente inserido pelo brad-progress caso o tipo informado seja circle |

# Propriedades
## brad-progress

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Id necessário para o funcionamento |
| brad-color | "primary", "primary-light", "primary-dark", "primary-xlight", "extended-red", "extended-red-dark", "extended-red-xlight", "extended-green", "extended-green-dark", "extended-green-xlight", "extended-blue", "extended-blue-dark", "extended-blue-xlight", "extended-yellow", "extended-yellow-dark", "extended-yellow-xlight", "extended-purple", "extended-purple-dark", "extended-purple-xlight", "extended-violet", "extended-violet-dark", "extended-violet-xlight", "extended-salmon", "extended-salmon-dark", "extended-salmon-xlight", "alert-info", "alert-info-xlight", "alert-info-dark", "alert-success", "alert-success-xlight", "alert-success-dark", "alert-warning", "alert-warning-xlight", "alert-warning-dark", "alert-error", "alert-error-xlight", "alert-error-dark" | "" | Cor da barra de progresso |
| brad-type | "bar", "circle" | "bar" | Tipos de exibição da barra de progresso |
| brad-size | "sm", "md", "lg", "xl" | "sm" | Tamanho da barra de progresso. Obs: para o tipo bar somente os valores "sm" e "xl" possuem efeito |
| brad-on-color | boolean | false | Estado de mudança de cor para fundos escuros. |
| brad-with-transition | boolean | true | Define se haverá animação de transição de um valor para outro ao alterar o currentProgress da barra |
| brad-current-progress | number | 0 | Valor atual da barra de progresso |
| brad-max-value | number | 100 | Valor que será atribuido para a propriedade aria-valuemax para indicar o valor máximo da barra |
| brad-circle-content | "default", "icon", "percentage" | "default" | Indica o que será exibido dentro da barra do tipo circle. Obs: valor default indica que não terá conteúdo |
| brad-circle-icon | string |  | Ícone para ser exibido dentro da barra de progresso do tipo circle. |


Acesse a documentação de ícones para verificar os valores disponíveis e utilizá-los na propriedade brad-circle-icon.

# Comportamento JavaScript
## Inicialização

O Web Component não requer uma instanciação explícita em JavaScript, pois a própria tag HTML se encarrega de inicializá-lo e tratá-lo por trás dos panos.

Além disso, todos os atributos do componente são reativos. Isso significa que, para gerenciar o comportamento ou atualizar o estado do componente, basta obter sua referência no DOM e manipular os valores dos seus atributos.

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| progressChangeEvent | brad-progress | Evento disparado ao alterar o progresso atual da barra. |

# Exemplo de uso
```
<brad-progress id="progress"></brad-progress>
```
## Acessibilidade

Para emitir os eventos de troca de valores para as ferramentas de acessibilidade, é criada uma div com a classe accessibility_feedback (para barras do tipo bar) ou brad-progress-circle--accessibility_feedback (para barras do tipo circle) que será usada como transmissor de mudanças de valores. Por padrão, caso não realizado a implementação dessa div, o WebComponent realiza a criação dessa div com um texto genérico como o exemplo: "Barra de progresso 50% preenchida".

A jornada pode implementar sua própria div, desde que mantenha as classes informadas acima. Lembre-se de adicionar nessa div, os atributos role="alert", aria-live="assertive" e aria-atomic="true". Abaixo segue exemplo de implementação customizada da div:

```
<brad-progress id="progress-bar">
<div class="accessibility_feedback" role="alert" aria-live="assertive" aria-atomic="true"></div>
</brad-progress>
```
```
const component = document.getElementById("progress-bar");
const accessibilityFeedback = component.querySelector(".accessibility_feedback");

function createAccessibilityMessageFeedback(percentageValue) {
accessibilityFeedback.textContent = `Barra de progresso ${percentageValue}% preenchida.`;
}

component.addEventListener("progressChangeEvent", (event) => {
createAccessibilityMessageFeedback(event.data);
});
```
Exemplo
Bar
```
<div class="brad-flex-wrap">
    <p class="brad-p-sm-b">Use esses botões para definir rapidamente o valor de 'component.bradCurrentProgress':</p>

    <div class="brad-flex">

    <button
      class="brad-btn brad-btn-fab-label brad-font-button brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
      onclick="window.component['pb-219'].bradCurrentProgress = 0"
    >
      <div class="fab-text">0%</div>
    </button>

    <button
      class="brad-btn brad-btn-fab-label brad-font-button brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
       onclick="window.component['pb-219'].bradCurrentProgress = 25"
    >
      <div class="fab-text">25%</div>
    </button>

    <button
      class="brad-btn brad-btn-fab-label brad-font-button brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
       onclick="window.component['pb-219'].bradCurrentProgress = 50"
    >
      <div class="fab-text">50%</div>
    </button>

    <button
      class="brad-btn brad-btn-fab-label brad-font-button brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
       onclick="window.component['pb-219'].bradCurrentProgress = 75"
    >
      <div class="fab-text">75%</div>
    </button>

    <button
      class="brad-btn brad-btn-fab-label brad-font-button brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
       onclick="window.component['pb-219'].bradCurrentProgress = 100"
    >
      <div class="fab-text">100%</div>
    </button>
    </div>
  </div>
</div>

<div class="brad-m-lg-t">
  <brad-progress
    id="pb-219"
    brad-on-color="false"
    
    brad-size=sm
    brad-type=bar
    brad-max-value=100
    brad-current-progress=0
    brad-circle-content=default
    brad-circle-icon=icon-ui-placeholder
    brad-with-transition=true
  >
  </brad-progress>
</div>
```
Circle
```
<div class="brad-flex-wrap">
    <p class="brad-p-sm-b">Use esses botões para definir rapidamente o valor de 'component.bradCurrentProgress':</p>

    <div class="brad-flex">

    <button
      class="brad-btn brad-btn-fab-label brad-font-button brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
      onclick="window.component['pb-419'].bradCurrentProgress = 0"
    >
      <div class="fab-text">0%</div>
    </button>

    <button
      class="brad-btn brad-btn-fab-label brad-font-button brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
       onclick="window.component['pb-419'].bradCurrentProgress = 25"
    >
      <div class="fab-text">25%</div>
    </button>

    <button
      class="brad-btn brad-btn-fab-label brad-font-button brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
       onclick="window.component['pb-419'].bradCurrentProgress = 50"
    >
      <div class="fab-text">50%</div>
    </button>

    <button
      class="brad-btn brad-btn-fab-label brad-font-button brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
       onclick="window.component['pb-419'].bradCurrentProgress = 75"
    >
      <div class="fab-text">75%</div>
    </button>

    <button
      class="brad-btn brad-btn-fab-label brad-font-button brad-btn--floating brad-btn-fab-label--on-color brad-m-xs-r brad-m-xs-b"
       onclick="window.component['pb-419'].bradCurrentProgress = 100"
    >
      <div class="fab-text">100%</div>
    </button>
    </div>
  </div>
</div>

<div class="brad-m-lg-t">
  <brad-progress
    id="pb-419"
    brad-on-color="false"
    
    brad-size=sm
    brad-type=circle
    brad-max-value=100
    brad-current-progress=0
    brad-circle-content=default
    brad-circle-icon=icon-ui-placeholder
    brad-with-transition=true
  >
  </brad-progress>
</div>
```