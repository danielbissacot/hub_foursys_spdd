# Slider

Componente que possibilita escolher dentre um série de números através do arrastar de um botão, facilitando a experiência do usuário.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do Web Component

O componente principal é o <brad-slider>, que encapsula a label.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-slider | Componente | Sim | Sim | Container principal que gera o slider. |
| brad-slider-label | Componente | Não | Sim | Componente interno da label do slider. |

# Propriedades
## brad-slider

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | - | Identificador único do componente, caso não passado, será inserido um único e automático. |
| brad-disabled | boolean | false | Desabilita todos os campos. |
| brad-on-color | boolean | false | Usa versão para fundo escuro. |
| brad-type | string | "single" | Tipo do slider ("single" ou "range"). |
| brad-step | number | 1 | Determina o incremento do slider. |
| brad-min | number | 0 | Valor mínimo do slider. |
| brad-max | number | 100 | Valor máximo do slider. |
| brad-first-value | number | 0 | Representa o valor do primeiro ponto do slider. |
| brad-second-value | number | 100 | Representa o valor do segundo ponto do slider (range). |

# Uso do HTML
```
<brad-slider
  id='slider'
  brad-disabled="false"
  brad-on-color="false"
  brad-type="range"
  brad-step="1"
  brad-min="0"
  brad-max="100"
  brad-first-value="50"
  brad-second-value="75"
  >
  <brad-slider-label aria-label="Label, valor mínimo 0 e valor máximo 100">
    <p>Label</p>
  </brad-slider-label>
</brad-slider>
```
Comportamento Javascript
## Inicialização

A inicialização é automática ao inserir o componente no DOM. Não é necessário chamar funções JS manualmente.

# Métodos

| Evento | Elemento | Parâmetro | Descrição |
| --- | --- | --- | --- |
| getFirstValue | brad-slider | - | Obtém valor do primeiro slider |
| getSecondValue | brad-slider | - | Obtém valor do segundo slider |
| changeFirstValue | brad-slider | number | Atribui um valor ao primeiro slider |
| changeSecondValue | brad-slider | number | Atribui um valor ao segundo slider |
| setCustomMinimumSupportText | brad-slider | string | Atribui um texto de suporte personalizado ao mínimo |
| setCustomMaximumSupportText | brad-slider | string | Atribui um texto de suporte personalizado ao máximo |
| setMonetaryFormatOnPopover | brad-slider | Intl.NumberFormat | Atribui um formato monetário ao popover |


Como utilizar o setMonetaryFormatOnPopover: Você deve criar uma instância de Intl.NumberFormat com o formato desejado e passar como parâmetro para o método setMonetaryFormatOnPopover.

```
slider = document.querySelector("brad-slider");
let monetaryFormat = Intl.NumberFormat("pt-BR", {
   style: "currency",
   currency: "BRL",
   minimumFractionDigits: 2,
 });
slider.setMonetaryFormatOnPopover(monetaryFormat);
```
## Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| setOnChange | brad-slider | Disparado quando o valor do slider é alterado pelo usuário. |


Como escutar eventos: É possível acessar por meio do serviço o evento setOnChange onde podemos escutar as alterações no valor do slider.

# Como usar o evento?
```
const slider = document.querySelector("brad-slider");
slider.service.setOnChange((payload: any) => {
  console.log("Valores do slider:", payload.values);
  console.log("Elemento disparador:", payload.target);
});
```
## Acessibilidade

O componente foi desenvolvido com HTML semântico. Certifique-se de adicionar o atributo aria-label na div que engloba a label do slider para garantir a acessibilidade.

```
<brad-slider-label aria-label="Label, valor mínimo 0 e valor máximo 100">
  <p>Label</p>
</brad-slider-label>
```

Para emitir os eventos de troca de valores para as ferramentas de acessibilidade, pode ser criada uma div com a classe accessibility_feedback que será usada como transmissor de mudanças de valores, com ela pode se criar um método na jornada em que através do textContent possa se personalizar uma mensagem e atualizar o valor conforme valores de input do usuário. Lembre-se de adicionar nessa div, os atributos role="alert", aria-live="assertive" e aria-atomic="true".

```
class BradSlider {
  constructor() {
    this.createAccessibilityElement(document.body);
    const slider = document.querySelector("brad-slider");
    slider.service.setOnChange((payload) => {
      this.setSliderAccessibilityText(payload.values);
    });
  }

  createAccessibilityElement(parent) {
    const feedbackDiv = document.createElement('div');

    feedbackDiv.className = 'accessibility_feedback';
    feedbackDiv.setAttribute('role', 'alert');
    feedbackDiv.setAttribute('aria-live', 'assertive');
    feedbackDiv.setAttribute('aria-atomic', 'true');

    parent.appendChild(feedbackDiv);
    this.accessibilityElement = feedbackDiv;
  }

  setSliderAccessibilityText(values) {
    const first = typeof values === 'object' ? Number(values[0]) : Number(values);
    const second = typeof values === 'object' ? Number(values[1]) : undefined;

    const rangeText = `Mínimo ${this.selectedOptionMin} e máximo ${this.selectedOptionMax},
    valor atual: slider um ${first} e slider dois ${second}`;

    const singleText = `Mínimo ${this.selectedOptionMin} e máximo ${this.selectedOptionMax},
    valor atual: ${first}`;

    const textAccessibility = this.selectedOption === 'range' ? rangeText : singleText;

    if (this.accessibilityElement) {
      this.accessibilityElement.textContent = textAccessibility;
    }
  }
}
```
Exemplos
Slider
```
<brad-slider
  id=slider-39
  brad-disabled=false
  brad-on-color=false
  brad-type=single
  brad-step=1
  brad-min="0"
  brad-max="100"
  brad-first-value="6"
  brad-second-value="75"
>
  <brad-slider-label
    aria-label="Slider, valor mínimo 0 e valor máximo 100"
  >
    <p>Slider</p>
  </brad-slider-label>
</brad-slider>
```