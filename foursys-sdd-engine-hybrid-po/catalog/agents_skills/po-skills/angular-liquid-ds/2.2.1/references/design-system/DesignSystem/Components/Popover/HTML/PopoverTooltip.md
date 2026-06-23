# PopoverTooltip

O componente brad-popover-tooltip demonstra informações adicionais a partir de Hover e Focus. A informação deve ser contextual, auxiliar e não essencial.

Pode aparecer a partir de três tipos de gatilhos: elemento customizado, componente button-info ou componente text-link;

# Pré-requisitos

Certifique-se de que o elemento HTML pai do componente esteja totalmente carregado antes da inicialização.

Os elementos referenciados pelas propriedades id (tooltip) e idTarget (alvo/disparador) devem estar presentes e renderizados no DOM antes de instanciar o serviço.

Caso utilize botões de interação (ex: fechar, abrir/toggle), eles também devem estar carregados no DOM antes da inicialização.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do HTML
```
<!--TARGET: Substituir por elemento customizado ou componente button-info, caso necessário -->
<div class="brad-flex brad-font-paragraph-md">
<a id="target" class="brad-text-link" aria-expanded="false" aria-describedby="tooltip" onmouseover="openTooltip()" onclick="openTooltip()" onmouseout="closeTooltip()"> OPEN TOOLTIP! </a>
</div>

<!--TOOLTIP-->

<div
class="brad-popover brad-popover-tooltip brad-zindex--1020"
id="tooltip"
role="dialog"
>
<em class="brad-popover__triangle"></em>
<div class="brad-popover__content" role="document">
  <em
    aria-label="Fechar tooltip"
    class="hidden-close-btn"
    role="button"
    tabindex="-1"
    onclick="closeTooltip()"
  ></em>
  <p class="brad-popover__text" role="document">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
    mollitia laboriosam, eius tempore necessitatibus odit aliquid quo minima
    repellendus nemo id deserunt recusandae tempora corporis fugit eum alias
    aliquam accusamus?
  </p>
</div>
</div>
```

Por padrão utilizar a classe brad-zindex--1020 para definir o empilhamento correto do elemento na página.

# Comportamento Javascript
## Inicialização

Inicializar elementos do popover-tooltip: O getInstance tem como parâmetro padrão o Object , por exemplo {id: "#idElemento"}.

```
const id = `tooltip`;
const idTarget = `target`;
const options = { id, idTarget, direction: "bottom" /* ou 'top' **/ };

const service = LiquidCorp.BradPopoverService.getInstance(options);

function openTooltip() {
service.open();
}

function closeTooltip() {
service.close();
}
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parâmetro um array de objetos [Object ], por exemplo [{id: "#idElemento1"}, {id: "#idElemento2"}, {id: "#idElemento3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | "" | ID vinculado ao HTMLElement do popover-tooltip |
| idTarget | string | "" | ID vinculado ao HTMLElement do alvo que foi clicado para abrir popover-tooltip |
| direction | "bottom" ou "top" | "bottom" | É utilizado para determinar direção que o popover vai abrir |


Agora é possível controlar o HTML do componente pelos ids: (tooltip, target)

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao ID do popover e do Target passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao ID do popover e do Target passado no options |
| open | N/A | Abre |
| close | N/A | Fecha |
| toggle | N/A | Alterna entre abrir e fechar |
| initTooltip | N/A | Cria os event listeners de hover e focus para o tooltip |
| destroy | N/A | Faz o encerramento de todos os listeners que existem vinculados ao componente instanciado |

# Posicionamento
Ao abrir o popover é priorizado a direção de abertura definida pelo usuário.
No entanto, se o espaço for insuficiente, ele se reposicionará para a melhor alternativa visível.
## Acessibilidade

Para uso da acessibilidade adicione a role="dialog" em div.brad-popover;

O uso do atributo role="dialog" em acessibilidade é importante para indicar que o elemento é um diálogo permitindo que os leitores de tela e outros assistentes comuniquem a informação aos usuários, você está contribuindo para uma experiência de usuário mais consistente e previsível. Isso garante que entendam como navegar nele de maneira eficiente. Em resumo, o uso de role="dialog" ajuda a tornar mais acessível e fácil de usar para todos os usuários.

Para uso da acessibilidade adicione a aria-label em elementos importantes para a navegação do popover; Como no caso exemplificado a seguir:

```
<em aria-label="Fechar tooltip" class="hidden-close-btn" role="button" tabindex="-1" onclick="closeTooltip()"></em>
```

O uso do atributo aria-label na acessibilidade é importante para fornecer uma descrição ou propósito do elemento para usuários que dependem de tecnologias assistivas. Quando você fornece um aria-label, está garantindo que os usuários possam entender completamente aquele elemento, mesmo que não possam ver seu conteúdo.

Há um botão para fechamento de tooltip invisível para o usuário com disponibilidade para os leitores de tela, muito importante no fluxo da leitura, estando presente na classe hidden-close-btn dentro de brad-popover__content exemplificado a seguir:

```
<div class="brad-popover brad-popover-tooltip brad-zindex--1020" id="id" role="dialog">
<em class="brad-popover__triangle"></em>
<div class="brad-popover__content" role="document">
  <em aria-label="Fechar tooltip" class="hidden-close-btn" role="button" tabindex="-1" onclick="closeTooltip()"></em>
  <p class="brad-popover__text" role="document">Lorem Ipsum</p>
</div>
</div>
```

Para criar um fluxo com acessibilidade, é necessário a implementação de métodos de abrir e fechar que possam tratar de maneira adequada o tema na jornada como a seguir:

```
popoverContentElement = document.getElementById(id);
popoverContentCloseBtn = popoverContentElement.querySelector(".brad-popover__content .hidden-close-btn");

function openTooltip() {
popoverContentCloseBtn.focus();
popoverContentCloseBtn.setAttribute("tabindex", 0);
document.getElementById(idTarget).setAttribute("aria-expanded", true);

LiquidCorp.BradPopoverService.getInstance({
id: id,
idTarget: idTarget,
direction: direction,
}).open();
}

function closeTooltip() {
document.getElementById(idTarget).setAttribute("aria-expanded", false);
popoverContentCloseBtn.setAttribute("tabindex", -1);

LiquidCorp.BradPopoverService.getInstance({
id: id,
idTarget: idTarget,
direction: direction,
}).close();
}
```

o uso do atributo aria-expanded é usado para indicar o estado expandido ou contraído de um elemento. Ele aceita dois valores: true (verdadeiro) quando o elemento está expandido e false (falso) quando está contraído.

o uso do atributo aria-describedby é usado para fornecer uma descrição acessível para um elemento. Ele aponta para o ID de um elemento que contém a descrição do elemento atual. Quando um leitor de tela encontra esse atributo, ele irá ler o conteúdo associado.

Para a implementação do botão esc para o fechamento do tooltip, é necessária a implementação do método na jornada como no exemplo a seguir:

```
document.addEventListener("keydown", function (e) {
if (e.key == "Escape") {
  if (popoverContentElement.classList.contains("brad-popover--open")) {
    closeTooltip();
  }
}
});
```

Um exemplo de uma jornada responsível do popover-tooltip seria como a seguir:

```
<div class="brad-flex brad-font-paragraph-md">
<a id="target" class="brad-text-link" aria-expanded="false" aria-describedby="popover-tooltip" onmouseover="openTooltip()" onclick="openTooltip()" onmouseout="closeTooltip()"> OPEN TOOLTIP! </a>
</div>

<div
class="brad-popover brad-popover-tooltip brad-zindex--1020"
id="popover-tooltip"
role="dialog"
>
<em class="brad-popover__triangle"></em>
<div class="brad-popover__content" role="document">
  <em
    aria-label="Fechar tooltip"
    class="hidden-close-btn"
    role="button"
    tabindex="-1"
    onclick="closeTooltip()"
  ></em>
  <p class="brad-popover__text" role="document">
    Lorem Ipsum
  </p>
</div>
</div>
```
```
const id = "popover-tooltip";
const idTarget = "target";

const popoverContentElement = document.getElementById(id);
const popoverContentCloseBtn = popoverContentElement.querySelector(".brad-popover__content .hidden-close-btn");

const tooltipService = LiquidCorp.BradPopoverService.getInstance({
id: id,
idTarget: idTarget,
direction: "bottom",
});

document.addEventListener("keydown", function (e) {
if (e.key == "Escape") {
if (popoverContentElement.classList.contains("brad-popover--open")) {
closeTooltip();
}
}
});

function openTooltip() {
popoverContentCloseBtn.focus();
popoverContentCloseBtn.setAttribute("tabindex", 0);
document.getElementById(idTarget).setAttribute("aria-expanded", true);

tooltipService.open();
}

function closeTooltip() {
document.getElementById(idTarget).setAttribute("aria-expanded", false);
popoverContentCloseBtn.setAttribute("tabindex", -1);

tooltipService.close();
}
```
Exemplo
```
<div class="brad-flex brad-flex-justify-content-center brad-font-paragraph-md">
  <a
    id="target-145"
    class="brad-text-link"
    aria-expanded="false"
    aria-describedby="popover-tooltip-35"
    onmouseover="openTooltip()"
    onclick="openTooltip()"
    onmouseout="closeTooltip()"
  >
    OPEN TOOLTIP!
  </a>
</div>

<div
  class="brad-popover brad-popover-tooltip brad-zindex--1020 "
  id="popover-tooltip-35"
  role="dialog"
>
  <em class="brad-popover__triangle"></em>
  <div class="brad-popover__content" role="document">
    <em
      aria-label="Fechar tooltip"
      class="hidden-close-btn"
      role="button"
      tabindex="-1"
      onclick="closeTooltip()"
    ></em>
    <p class="brad-popover__text" role="document">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.</p>
  </div>
</div>
```