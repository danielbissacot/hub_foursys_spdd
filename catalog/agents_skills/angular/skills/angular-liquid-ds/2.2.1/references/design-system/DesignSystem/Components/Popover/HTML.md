# Popover
Observações
O Popover utiliza position: fixed para seu posicionamento.

# Isso significa que:
- Ele é posicionado em relação à viewport, ou seja, as dimensões totais da tela do dispositivo.
- Independentemente do contêiner onde o componente esteja inserido (como um side-sheet ou modal), ele não respeitará os limites desse contêiner.
- O limite de posicionamento é a própria viewport, podendo ultrapassar o conteúdo visível em contêineres.
- É mais indicado para cenários onde o posicionamento global é desejado, sem restrições adicionais impostas por contêineres pais.

É um componente que aparece sobre todos os outros elementos em uma página e exibe informações secundárias através da interação com outro elemento.

# Pré-requisitos
Certifique-se de que o elemento HTML pai do componente esteja totalmente carregado antes da inicialização.
Os elementos referenciados pelas propriedades id (popover) e idTarget (alvo/disparador) devem estar presentes e renderizados no DOM antes de instanciar o serviço.
Caso utilize botões de interação (ex: fechar, abrir/toggle), eles também devem estar carregados no DOM antes da inicialização.
## Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do HTML
```
<div class="brad-flex brad-flex-justify-content-center brad-font-paragraph-md">
<a id="[ID_TARGET_POPOVER]" class="brad-text-link" onclick="togglePopover()"> OPEN POPOVER!</a>
</div>

<div
class="brad-popover brad-zindex--1020"
id="[ID_DO_POPOVER]"
role="tooltip"
aria-hidden="true"
>
<em class="brad-popover__triangle"></em>

<div class="brad-popover__content" role="document" tabindex="-1">
  <p class="brad-popover__title brad-font-title-sm" role="heading">
    Title content
  </p>

  <p class="brad-popover__text brad-font-subtitle-xs" role="document">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices
    venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non,
    vehicula eleifend nisl.
  </p>

  <p class="brad-popover__text brad-font-subtitle-xs" role="document">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.</p>

</div>

<em
  role="button"
  aria-label="Fechar popover"
  class="brad-popover__close-icon"
  onclick="closePopover()"
></em>
</div>
```

Por padrão utilizar a classe brad-zindex--1020 para definir o empilhamento correto do elemento na página.

# Comportamento Javascript
## Inicialização

Inicializar elementos do popover-tooltip: O getInstance tem como parâmetro padrão o Object , por exemplo {id: "#idElemento"}.

```
const id = `popover`;
const idTarget = `target`;
const options = { id, idTarget, direction: "bottom" /* ou 'top' **/ };
const service = LiquidCorp.BradPopoverService.getInstance(options);
//Opcional: listeners para os eventos de open e close do popover, para casos do uso do toggle para rastrear quando abriu ou fechou.
service.ePopover.addEventListener("open", (e) => {
//console.log(e.detail, "open");
});
service.ePopover.addEventListener("close", (e) => {
//console.log(e.detail, "close");
});
//Funções para abrir ou fechar o popover.
function togglePopover() {
service.toggle();
//se não quiser usar o "toggle" pode usar o "open"
//service.open();
}
function closePopover() {
service.close();
}
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parâmetro um array de objetos [Object ], por exemplo [{id: "#idElemento1"}, {id: "#idElemento2"}, {id: "#idElemento3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | "" | ID vinculado ao HTMLElement do popover |
| idTarget | string | "" | ID vinculado ao HTMLElement do alvo que foi clicado para abrir popover |
| direction | "bottom" ou "top" | "bottom" | É utilizado para determinar direção que o popover vai abrir |


Agora é possível controlar o HTML do componente pelos ids: (popover, target)

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao ID do popover e do Target passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao ID do popover e do Target passado no options |
| open | N/A | Abre |
| close | N/A | Fecha |
| toggle | N/A | Alterna entre abrir e fechar |
| destroy | N/A | Faz o encerramento de todos os listeners que existem vinculados ao componente instanciado |

# Posicionamento
Ao abrir o popover é priorizado a direção de abertura definida pelo usuário.
No entanto, se o espaço for insuficiente, ele se reposicionará para a melhor alternativa visível.
Acessibilidade
Estrutura Semântica
O container do popover utiliza o atributo role="tooltip", indicando ao leitor de tela que se trata de um conteúdo flutuante.
O título do popover é marcado com <h3 class="brad-popover__title">, facilitando a navegação por títulos em leitores de tela.
O conteúdo principal fica em um <p class="brad-popover__text">.
## Foco e Navegação por Teclado

Agora, ao abrir o popover, o foco é direcionado de forma inteligente:

Em dispositivos móveis (largura ≤ 768px): o foco vai para o título do popover (.brad-popover__title) se não houver um título o foco deve ser direcionado para o .brad-popover__text, facilitando a leitura imediata pelo leitor de tela.

Em desktop: o foco vai para o conteúdo do popover (.brad-popover__content), permitindo que leitores de tela anunciem todo o conteúdo de forma eficiente.

# Retorno do foco:

Ao fechar o popover, o foco retorna automaticamente para o elemento que disparou a abertura, mantendo a experiência de navegação por teclado fluida e previsível.

## Atualização dinâmica de aria-expanded:

O atributo aria-expanded do botão/disparador é atualizado automaticamente para refletir o estado aberto/fechado do popover, melhorando a comunicação com tecnologias assistivas.
```
const id = "[ID_DO_POPOVER]";
const idTarget = "[ID_TARGET_POPOVER]";
const options = { id, idTarget, direction: "bottom" /* ou 'top' **/ };
const service = LiquidCorp.BradPopoverDefaultService.getInstance(options);
createEventListener(service);
/**
* Cria ouvintes de eventos para abrir e fechar o popover, atualizando o conteúdo de um elemento de leitura.
* @param {BradPopoverService} popoverInstance
*/
function createEventListener(popoverInstance) {
const { ePopover, idTarget } = popoverInstance;
// Ao abrir o popover, atualiza o atributo aria-expanded do botão de disparo e move o foco para o título ou texto do popover.
ePopover.addEventListener("open", (e) => {
  action("open")(e);
  updateAriaExpanded(idTarget, true);
  setTimeout(() => {
    handlePopoverFocus(popoverInstance);
  }, 100);
});
// Ao fechar o popover, atualiza o atributo aria-expanded do botão de disparo e move o foco de volta para o botão de disparo.
ePopover.addEventListener("close", (e) => {
  action("close")(e);
  updateAriaExpanded(idTarget, false);
  focusTriggerButton(idTarget);
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
* Move o foco para o botão de disparo do popover.
* @param {string} idTarget
*/
function focusTriggerButton(idTarget) {
const btn = document.getElementById(idTarget);
if (btn) {
  btn.focus();
}
}
/**
* Gerencia o foco do popover conforme o dispositivo.
* @param {BradPopoverService} popoverInstance
*/
function handlePopoverFocus(popoverInstance) {
if (window.innerWidth <= 768) {
  focusPopoverHeadingOrText(popoverInstance);
} else {
  focusPopoverContent(popoverInstance);
}
}
/**
* Move o foco para o título do popover (mobile).
* @param {BradPopoverService} popoverInstance
* @returns {void}
*/
function focusPopoverHeadingOrText(popoverInstance) {
const title = popoverInstance.ePopover.querySelector(".brad-popover__title");
if (title) {
  title.focus();
  return;
}
const text = popoverInstance.ePopover.querySelector(".brad-popover__text");
text.focus();
}
/**
* Move o foco para o conteúdo do popover (desktop).
* @param {BradPopoverService} popoverInstance
*/
function focusPopoverContent(popoverInstance) {
const content = popoverInstance.ePopover.querySelector(
  ".brad-popover__content"
);
if (content) {
  content.setAttribute("tabindex", 0);
  content.focus();
}
}
```

Ao fechar o popover, o foco retorna para o elemento que disparou a abertura (exemplo: o link que abriu o popover).

# Exemplo de Uso
```
<a
id="[ID_TARGET_POPOVER]"
class="brad-text-link"
onclick="event.preventDefault(); servicePopover.toggle();"
tabindex="0"
href="#"
aria-expanded="false"
>
OPEN POPOVER
</a>

<div id="[ID_DO_POPOVER]" class="brad-popover" role="tooltip">
<em class="brad-popover__triangle"></em>
<div class="brad-popover__content">
  <h3 class="brad-popover__title">Título</h3>
  <p class="brad-popover__text">Conteúdo do popover.</p>
</div>
<button
  role="button"
  aria-label="Fechar popover"
  class="brad-popover__close-icon"
  onclick="servicePopover.close()"
></button>
</div>
```
Recomendações
Sempre utilize elementos semânticos (<h1>, <p>, <button>) para garantir melhor suporte em leitores de tela.
Atualize os atributos ARIA dinamicamente conforme o estado do popover.
Garanta que o foco seja gerenciado corretamente ao abrir e fechar o popover.
Exemplos
Popover
```
<div class="brad-theme-classic">
    <div class="examples">
      <div class="brad-flex brad-flex-justify-content-center brad-font-paragraph-md">
        
  <a
    id="target-352"
    class="brad-text-link "
    onclick="event.preventDefault(); window.servicePopover.toggle();"
    tabindex="0"
    href="#"
    aria-expanded="false"
    aria-controls="popover-52"
  >
    OPEN POPOVER
  </a>

      </div>

      
  <div id="popover-52" class="brad-popover " role="tooltip">
    <em class="brad-popover__triangle"></em>

    <div class="brad-popover__content" aria-label>
      
        <h1 class="brad-popover__title brad-font-title-sm" role="heading">
          Title content
        </h1>
      <p class="brad-popover__text brad-font-subtitle-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.</p>
    </div>

    <button
      role="button"
      aria-label="Fechar popover"
      class="brad-popover__close-icon"
      onclick="window.servicePopover.close()"
    ></button>
  </div>

    </div>
  </div>
```
Popovers
```
<div
    class="brad-flex brad-flex brad-flex-justify-content-between brad-font-paragraph-md"
  >
    
  <a
    id="first-popover-target"
    class="brad-text-link "
    onclick="event.preventDefault(); window.popover1.toggle();"
    tabindex="0"
    href="#"
    aria-expanded="false"
    aria-controls="first-popover"
  >
    OPEN POPOVER 1
  </a>

    
  <div id="first-popover" class="brad-popover " role="tooltip">
    <em class="brad-popover__triangle"></em>

    <div class="brad-popover__content" aria-label>
      
        <h1 class="brad-popover__title brad-font-title-sm" role="heading">
          Title content
        </h1>
      <p class="brad-popover__text brad-font-subtitle-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.</p>
    </div>

    <button
      role="button"
      aria-label="Fechar popover"
      class="brad-popover__close-icon"
      onclick="window.popover1.close()"
    ></button>
  </div>

    
  <a
    id="second-popover-target"
    class="brad-text-link "
    onclick="event.preventDefault(); window.popover2.toggle();"
    tabindex="0"
    href="#"
    aria-expanded="false"
    aria-controls="second-popover"
  >
    OPEN POPOVER 2
  </a>

    
  <div id="second-popover" class="brad-popover " role="tooltip">
    <em class="brad-popover__triangle"></em>

    <div class="brad-popover__content" aria-label>
      
        <h1 class="brad-popover__title brad-font-title-sm" role="heading">
          Title content
        </h1>
      <p class="brad-popover__text brad-font-subtitle-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.</p>
    </div>

    <button
      role="button"
      aria-label="Fechar popover"
      class="brad-popover__close-icon"
      onclick="window.popover2.close()"
    ></button>
  </div>

    
  <a
    id="third-popover-target"
    class="brad-text-link "
    onclick="event.preventDefault(); window.popover3.toggle();"
    tabindex="0"
    href="#"
    aria-expanded="false"
    aria-controls="third-popover"
  >
    OPEN POPOVER 3
  </a>

    
  <div id="third-popover" class="brad-popover " role="tooltip">
    <em class="brad-popover__triangle"></em>

    <div class="brad-popover__content" aria-label>
      
        <h1 class="brad-popover__title brad-font-title-sm" role="heading">
          Title content
        </h1>
      <p class="brad-popover__text brad-font-subtitle-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.</p>
    </div>

    <button
      role="button"
      aria-label="Fechar popover"
      class="brad-popover__close-icon"
      onclick="window.popover3.close()"
    ></button>
  </div>

  </div>
```