# Progress Bar

Os indicadores de progresso fornecem feedback ao usuário sobre a porcentagem de conclusão de uma tarefa, fluxo de trabalho ou jornada.

# Uso do HTML
Estilos
Default
```
<div id="progress-bar" class="brad-progress-bar brad-progress-bar--sm">
<em class="brad-progress-bar__growth"></em>
</div>
```
## OnColor

O modo OnColor é uma solução para obter maior contraste para elementos visuais e componentes aplicados em fundo escuro e colorido. Este modo torna possível atender ao contraste mínimo recomendado pela WCAG.

```
<div id="progress-bar" class="brad-progress-bar brad-progress-bar--on-color brad-progress-bar--sm">
<em class="brad-progress-bar__growth"></em>
</div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do progress-bar

```
const targetSelector = `#progress-bar`;
const options = { targetSelector };

const service = LiquidCorp.BradProgressBarService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object {}], por exemplo [{targetSelector: "#idProgress1"}, {targetSelector: "#idProgress2"}, {targetSelector: "#idProgress3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID ou .classe vinculado ao HTML do componente |
| currentProgress | string | 0 | Valor dado para o estado inicial da barra de progresso |
| withTransition | string | true | É utilizado para determinar se ao alterar o currentProgress haverá efeito na transição da barra |


Agora é possível controlar o HTML do componente pelo seletor: (#progress-bar)

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao ID passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao ID passado no options |
| setCurrentProgress | currentProgress: number | Altera o valor atual da barra de progresso |
| getCurrentProgress | - | Obtém o valor atual da barra de progresso |

# Uso básico
```
const service = LiquidCorp.BradProgressBarService.getInstance({
targetSelector: "#progress-bar",
});

service.setCurrentProgress(50);
```
Observações
OnColor: Não é possível alterar a cor do ProgressBar quando estiver com o modo OnColor ativo
## Acessibilidade

Certifique-se de adicionar no elemento em de classe brad-progress-bar__growth os atributos: role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0", que auxiliam na acessibilidade do progresso.

Para emitir os eventos de troca de valores para as ferramentas de acessibilidade, é criada uma div com a classe accessibility_feedback que será usada como transmissor de mudanças de valores. Por padrão, caso não realizado a implementação dessa div, o serviço realiza a criação dessa div com um texto genérico como o exemplo: "Barra de progresso 50% preenchida".

A jornada pode implementar sua própria div, desde que mantenha as classes informadas acima. Lembre-se de adicionar nessa div, os atributos role="alert", aria-live="assertive" e aria-atomic="true".

Na classe do elemento há ainda um evento personalizado (progressChangeEvent) que pode ser usado para captar eventos de alteração no valor, com esse evento, pode se disparar alterações no textContent notificando o usuário, como nos exemplos a seguir:

```
<div id="id" class="brad-progress-bar">
<em
  role="progressbar"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="0"
  class="brad-progress-bar__growth"
></em>
<div
  class="accessibility_feedback"
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
></div>
</div>
```
```
const progressData = LiquidCorp.BradProgressBarService.getInstance({
targetSelector: "#id",
currentProgress: 50,
});

const progressBar = document.getElementById(id);
const progressElement = document
.getElementById(id)
.querySelector(".brad-progress-bar__growth");
const accessibilityFeedback = progressBar.querySelector(
".accessibility_feedback"
);

function createAccessibilityMessageFeedback(percentageValue) {
progressElement.setAttribute("aria-valuenow", percentageValue);
accessibilityFeedback.textContent = `Barra de progresso ${percentageValue}% preenchida.`;
}

createAccessibilityMessageFeedback(progressData.currentProgress);
progressBar.addEventListener("progressChangeEvent", (event) => {
createAccessibilityMessageFeedback(event.data);
});
```
Exemplo
```
<div id="pb-245" class="brad-progress-bar brad-progress-bar--sm">
  <em
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="0"
    class="brad-progress-bar__growth "
  ></em>
</div>
```