# PopoverDefault
Observações
O PopoverDefault utiliza position: absolute; tornando seu comportamento dependente do primeiro contêiner pai com position: relative;.

## Esse comportamento é caracterizado por:
- Respeitar os limites do contêiner pai.
- Se estiver dentro de um contêiner como um side-sheet ou modal, ele não ultrapassará os limites desse contêiner.
- O posicionamento é relativo ao contêiner pai, permitindo maior controle sobre espaçamentos e alinhamentos.
- Ideal para cenários onde o conteúdo precisa ser delimitado pelo espaço do contêiner.

É um componente que aparece sobre todos os outros elementos em uma página e exibe informações secundárias através da interação com outro elemento.

# Pré-requisitos

Certifique-se de que o elemento HTML pai do componente esteja totalmente carregado antes da inicialização.

Os elementos referenciados pelas propriedades id (popover) e idTarget (alvo/disparador) devem estar presentes e renderizados no DOM antes de instanciar o serviço.

Caso utilize botões de interação (ex: fechar, abrir/toggle), eles também devem estar carregados no DOM antes da inicialização.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do HTML
```
<div id="brad-popover-container" class="brad-relative-full-w">
  <div class="brad-flex brad-flex-justify-content-center brad-m-xl-t brad-font-paragraph-md">
    <button
      id="target-popover"
      class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
      onclick="popoverDefaultService.toggle();"
    >
      <em class="fab-icon i icon-ui-placeholder"></em>
    </button>
  </div>
  <div
    id="popover"
    class="brad-popover-default   brad-zindex--1020"
  >
    <em class="brad-popover-default__triangle"></em>

    <div class="brad-popover-default__content">
      <p
      class="brad-popover-default__title brad-font-title-sm"
    >
      Title content
    </p>
      <p
        class="brad-popover-default__text brad-font-subtitle-xs"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.
      </p>
    </div>

    <button
      class="brad-popover-default__close-icon"
      onclick="popoverDefaultService.close()"
      aria-label="Fechar popover"
    >
    </button>
  </div>
</div>
```

Para o popover aparecer embaixo do target basta remover a classe brad-popover-default--open__top. Por padrão utilizar a classe brad-zindex--1020 para definir o empilhamento correto do elemento na página.

# Comportamento Javascript
## Inicialização

## Inicializar elementos do popover:
O getInstance tem como parâmetro padrão o Object , por exemplo {id: "#idElemento"}.

```
const id = `popover`;
const idTarget = `target-popover`;
const options = { id, idTarget };
const service = LiquidCorp.BradPopoverDefaultService.getInstance(options);
//Opcional: listeners para os eventos de open e close do popover, para casos do uso do toggle para rastrear quando abriu ou fechou.
service.ePopoverDefault.addEventListener("open", (e) => {
//console.log(e.detail, "open");
});
service.ePopoverDefault.addEventListener("close", (e) => {
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

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parâmetro um array de objetos [Object ], por exemplo [{id: "#idElemento1"}, {id: "#idElemento2"}, {id: "#idElemento3"}, ...]

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | "" | ID vinculado ao HTMLElement do popover |
| idTarget | string | "" | ID vinculado ao HTMLElement do alvo que foi clicado para abrir popover |


Agora é possível controlar o HTML do componente pelos ids: (popover, target-popover)

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
## Alternativas de uso no HTML

O popover ele pode ser colocado em qualquer container no HTML, desde que seu pai seja position: relative, facilitamos com a criação da classe: brad-relative-full-w.

```
<div class="brad-relative-full-w">
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
    explicabo magni reiciendis odio non aut officiis ab optio. Rem magni
    neque numquam iure aliquam,
    <button
      id="target-popover"
      class="brad-btn brad-btn-info i icon-component-question-mark"
      onclick="popoverDefaultService.toggle();"
    ></button>
    obcaecati quasi blanditiis? Excepturi, quam nisi. Lorem ipsum dolor
    sit amet, consectetur adipisicing elit. Et nisi, harum veritatis quod
    reprehenderit natus quia nesciunt animi! Nihil soluta consectetur unde
    ipsa minus quaerat qui cum? Perspiciatis, nobis saepe?
  </p>
  <div id="popover" class="brad-popover-default brad-zindex--1020">
    <em class="brad-popover-default__triangle"></em>

    <div class="brad-popover-default__content">
      <h4
        class="brad-popover-default__title brad-font-title-sm"
      >
        Title content
      </h4>

      <p
        class="brad-popover-default__text brad-font-subtitle-xs"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor
        aliquam mauris non, vehicula eleifend nisl.
      </p>
    </div>

    <em
      class="brad-popover-default__close-icon"
      onclick="popoverDefaultService.close()"
      role="button"
      aria-label="Fechar popover"
      tabindex="0"
    >
    </em>
  </div>
</div>
```
## Limitações

Se o target tiver um pai com scroll, e o popover não ser filho desse mesmo pai, o popover não acompanhará o target quando ocorrer o scroll.

# Acessibilidade
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
const service = LiquidCorp.BradPopoverService.getInstance(options);
createEventListener(service);
/**
* Cria ouvintes de eventos para abrir e fechar o popover, atualizando o conteúdo de um elemento de leitura.
* @param {BradPopoverService} popoverInstance
*/
function createEventListener(popoverInstance) {
const { ePopoverDefault, idTarget } = popoverInstance;
ePopoverDefault.addEventListener("open", (e) => {
  action("open")(e);
  updateAriaExpanded(idTarget, true);
  setTimeout(() => {
    handlePopoverFocus(popoverInstance);
  }, 100);
});
ePopoverDefault.addEventListener("close", (e) => {
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
const title = popoverInstance.ePopoverDefault.querySelector(
  ".brad-popover-default__title"
);
if (title) {
  title.focus();
  return;
}
const text = popoverInstance.ePopoverDefault.querySelector(
  ".brad-popover-default__text"
);
text.focus();
}
/**
* Move o foco para o conteúdo do popover (desktop).
* @param {BradPopoverService} popoverInstance
*/
function focusPopoverContent(popoverInstance) {
const content = popoverInstance.ePopoverDefault.querySelector(
  ".brad-popover-default__content"
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
<div class="brad-flex brad-flex-justify-content-center brad-m-xl-t brad-font-paragraph-md">
  <button
    id="[ID_TARGET_POPOVER]"
    class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
    onclick="popoverDefaultService.toggle();"
    aria-expanded="false">
    <em class="fab-icon i icon-ui-placeholder"></em>
  </button>
</div>

<div
  id="[ID_DO_POPOVER]"
  class="brad-popover-default brad-zindex--1020"
  role="tooltip"
  aria-hidden="false">
  <em class="brad-popover-default__triangle"></em>

  <div
    class="brad-popover-default__content">
    <h1 class="brad-popover-default__title brad-font-title-sm">
      Title content
    </h1>
    <p class="brad-popover-default__text brad-font-subtitle-xs">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.
    </p>
  </div>
  <button
    class="brad-popover-default__close-icon"
    onclick="popoverDefaultService.close()"
    aria-label="Fechar popover">
  </button>
</div>
```
Recomendações
Sempre utilize elementos semânticos (<h1>, <p>, <button>) para garantir melhor suporte em leitores de tela.
Atualize os atributos ARIA dinamicamente conforme o estado do popover.
Garanta que o foco seja gerenciado corretamente ao abrir e fechar o popover.
## Exemplos

Lembre-se de adicionar em volta do popover uma div com position: relative; + width: 100%; ou a classe brad-relative-full-w, pois só assim o popover terá o comportamente desejado em seu posicionamento e limitadores.

# Default
```
<div id="brad-popover-container" class="brad-relative-full-w">
  <div class="brad-flex brad-flex-justify-content-center brad-m-xl-t brad-font-paragraph-md">
    <button
      id="target-210"
      class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
      onclick="popoverDefaultService.toggle();"
      aria-expanded="false"
      aria-controls="popover-248"
    >
      <em class="fab-icon i icon-ui-placeholder"></em>
    </button>
  </div>

  <div
    id="popover-248"
    class="brad-popover-default   brad-zindex--1020"
    role="tooltip"
    aria-hidden="true"
  >
    <em class="brad-popover-default__triangle"></em>

    <div class="brad-popover-default__content">
      <h3 class="brad-popover-default__title brad-font-title-sm">
      Title content
    </h3>
      <p
        class="brad-popover-default__text brad-font-subtitle-xs"
        role="paragraph"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.
      </p>
    </div>

    <button
      class="brad-popover-default__close-icon"
      onclick="popoverDefaultService.close()"
      aria-label="Fechar popover"
    ></button>
  </div>
</div>
```
InlineInfo
```
<div class="brad-relative-full-w">
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
    explicabo magni reiciendis odio non aut officiis ab optio. Rem magni
    neque numquam iure aliquam,
    <button
      id="target-41"
      class="brad-btn brad-btn-info i icon-component-question-mark"
      onclick="popoverDefaultService.toggle();"
      tabindex="0"
    ></button>
    obcaecati quasi blanditiis? Excepturi, quam nisi. Lorem ipsum dolor
    sit amet, consectetur adipisicing elit. Et nisi, harum veritatis quod
    reprehenderit natus quia nesciunt animi! Nihil soluta consectetur unde
    ipsa minus quaerat qui cum? Perspiciatis, nobis saepe?
  </p>

  <div id="popover-361" class="brad-popover-default brad-zindex--1020">
    <em class="brad-popover-default__triangle"></em>

    <div class="brad-popover-default__content">
      <h4 class="brad-popover-default__title brad-font-title-sm">
        Title content
      </h4>

      <p class="brad-popover-default__text brad-font-subtitle-xs">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
        ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor
        aliquam mauris non, vehicula eleifend nisl.
      </p>
    </div>

    <button
      class="brad-popover-default__close-icon"
      onclick="popoverDefaultService.close()"
      aria-label="Fechar popover"
    ></button>
  </div>
</div>
```
InOverlayComponent
```
<button
  aria-label="Abrir SideSheet"
  role="button"
  data-ss-open="brad-side-sheet"
  class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
>
  <em class="fab-icon i icon-ui-placeholder"></em>
</button>

<div
  id="brad-side-sheet"
  class="brad-side-sheet brad-side-sheet--default above-the-overlay"
>
  <button
    aria-label="Fechar SideSheet"
    role="button"
    data-ss-close="brad-side-sheet"
    class="i icon-component-close-delete brad-side-sheet__close"
  ></button>

  <div class="brad-side-sheet__content" tabindex="0">
    <div class="brad-relative-full-w">
      <div class="brad-font-paragraph-md">
        <p class="brad-m-lg-b">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Praesentium accusantium asperiores est, architecto obcaecati hic
          velit minima eius assumenda fugiat eligendi repellendus quam
          maxime deserunt impedit quos sit cupiditate facere?
        </p>

        <span
          class="brad-flex brad-flex-align-items-center brad-font-title-md"
          >Saldo disponívelas
          <button
            id="target-329"
            class="brad-btn brad-btn-info i icon-component-info-mark brad-m-xs-l"
            onclick="popoverDefaultService2.toggle();"
          ></button
        ></span>
      </div>

      <span
        id="read-popover"
        class="brad-sr-only"
        aria-live="polite"
        tabindex="-1"
      ></span>

      <div class="brad-popover-default brad-zindex--1020" id="popover-413">
        <em class="brad-popover-default__triangle"></em>
        <div class="brad-popover-default__content">
          <h4 class="brad-popover-default__title brad-font-title-sm">
            Title content
          </h4>

          <p class="brad-popover-default__text brad-font-subtitle-xs">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.
          </p>
        </div>

        <button
          aria-label="Fechar popover"
          class="brad-popover-default__close-icon"
          onclick="popoverDefaultService2.close()"
        ></button>
      </div>
    </div>
  </div>
</div>
```