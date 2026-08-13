# Carousel

É um elemento com diversas possibilidades que pode ser utilizado em diferentes formatos para diferentes contextos. Em resumo ele permite a navegação de um conteúdo de forma horizontal.

# Uso do Web Component

O brad-carousel (web component) possui vários componentes utilitários obrigatórios para a utilização do carrossel.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-carousel | Componente | Sim | Sim | Agrupa todos os outros componentes do carrossel. |
| brad-carousel-slide | Sub-componente | Sim | Sim | Define um slide do carrossel. |
| brad-carousel-pagination | Sub-componente | Não | Não | Componente de paginação do carrossel. |
| brad-carousel-navigation-container | Sub-componente | Não | Não | Contêiner para botões de navegação do carrossel. |

# Propriedades
## brad-carousel

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Id necessário para o funcionamento. |
| brad-initial-slide | number | 0 | Define o slide inicial do carrossel. |
| brad-navigation-next-el | string |  | Define o seletor do botão de navegação para o próximo slide. |
| brad-navigation-prev-el | string |  | Define o seletor do botão de navegação para o slide anterior. |
| brad-pagination-el | string |  | Define o seletor do elemento de paginação. |
| brad-pagination-clickable | boolean | false | Define se a paginação é clicável. |
| brad-direction | string |  | Define a direção do carrossel. |
| brad-one-way-movement | boolean | false | Define se o movimento é unidirecional. |
| brad-touch-events-target | string |  | Define o alvo dos eventos de toque. |
| brad-speed | number |  | Define a velocidade da transição dos slides. |
| brad-css-mode | boolean | false | Define se o carrossel usa CSS mode. |
| brad-update-on-window-resize | boolean | true | Define se o carrossel atualiza ao redimensionar a janela. |
| brad-enabled | boolean | true | Define se o carrossel está habilitado. |
| brad-focusable-elements | string |  | Define os elementos focáveis no carrossel. |
| brad-width | number |  | Define a largura do carrossel. |
| brad-height | number |  | Define a altura do carrossel. |
| brad-prevent-interaction-on-transition | boolean | false | Define se previne interação durante a transição. |
| brad-edge-swipe-detection | boolean | false | Define se detecta swipe na borda. |
| brad-edge-swipe-threshold | number |  | Define o limite de swipe na borda. |
| brad-auto-height | boolean | false | Define se a altura é automática. |
| brad-set-wrapper-size | boolean | false | Define se define o tamanho do wrapper. |
| brad-virtual-translate | boolean | false | Define se usa tradução virtual. |
| brad-effect | string |  | Define o efeito de transição. |
| brad-space-between | number |  | Define o espaço entre os slides. |
| brad-slides-per-view | number | 1 | Define o número de slides visíveis por vez. |
| brad-slides-per-group | number |  | Define o número de slides por grupo. |
| brad-slides-per-group-skip | number |  | Define o número de slides a pular por grupo. |
| brad-slides-per-group-auto | boolean | false | Define se os slides por grupo são automáticos. |
| brad-centered-slides | boolean | false | Define se os slides devem ser centralizados. |
| brad-centered-slides-bounds | boolean | false | Define se os slides centralizados devem respeitar os limites. |
| brad-follow-finger | boolean | true | Define se segue o dedo no swipe. |
| brad-allow-touch-move | boolean | true | Define se permite movimento por toque. |
| brad-grab-cursor | boolean | false | Define se usa cursor de agarrar. |
| brad-prevent-clicks | boolean | true | Define se previne cliques. |
| brad-prevent-clicks-propagation | boolean | true | Define se previne propagação de cliques. |
| brad-slide-to-clicked-slide | boolean | false | Define se desliza para o slide clicado. |
| brad-loop | boolean | false | Define se o carrossel é em loop. |
| brad-allow-slide-prev | boolean | true | Define se permite deslizar para o slide anterior. |
| brad-allow-slide-next | boolean | true | Define se permite deslizar para o próximo slide. |
| brad-no-swiping | boolean | false | Define se desativa o swipe. |
| brad-autoplay-enabled | boolean | false | Define se o autoplay está habilitado. |
| brad-autoplay-delay | number |  | Define o atraso do autoplay. |
| brad-autoplay-wait-for-transition | boolean | true | Define se o autoplay espera pela transição. |
| brad-autoplay-disable-on-interaction | boolean | true | Define se desativa o autoplay na interação. |
| brad-autoplay-stop-on-last-slide | boolean | false | Define se para o autoplay no último slide. |
| brad-autoplay-reverse-direction | boolean | false | Define se reverte a direção do autoplay. |
| brad-autoplay-pause-on-mouse-enter | boolean | false | Define se pausa o autoplay ao entrar com o mouse. |
| brad-a11y-enabled | boolean | true | Define se a acessibilidade está habilitada. |
| brad-a11y-notification-class | string |  | Define a classe de notificação de acessibilidade. |
| brad-a11y-prev-slide-message | string |  | Define a mensagem de acessibilidade para o slide anterior. |
| brad-a11y-next-slide-message | string |  | Define a mensagem de acessibilidade para o próximo slide. |
| brad-a11y-first-slide-message | string |  | Define a mensagem de acessibilidade para o primeiro slide. |
| brad-a11y-last-slide-message | string |  | Define a mensagem de acessibilidade para o último slide. |
| brad-a11y-pagination-bullet-message | string |  | Define a mensagem de acessibilidade para a paginação. |
| brad-a11y-slide-label-message | string |  | Define a mensagem de acessibilidade para o rótulo do slide. |
| brad-a11y-container-message | string |  | Define a mensagem de acessibilidade para o contêiner. |
| brad-a11y-container-role-description-message | string |  | Define a descrição de função de acessibilidade para o contêiner. |
| brad-a11y-item-role-description-message | string |  | Define a descrição de função de acessibilidade para o item. |
| brad-a11y-slide-role | string |  | Define o papel de acessibilidade para o slide. |

# Comportamento Javascript
## Inicialização

⚠️ Importante: o Web Component brad-carousel possui comportamento assíncrono. Para acessar o component.service, é obrigatório aguardar a inicialização do componente utilizando whenInitialized(), que retorna uma Promise.

Para garantir que o serviço esteja disponível, use o padrão abaixo:

```
const id = "carousel";
const component = document.getElementById(id);

component.whenInitialized().then((service) => {
service.appendSlide(
`<brad-carousel-slide>
<brad-card brad-type="default" class="brad-auto-w brad-p-lg">
Lorem ipsum dolor [appendSlide].
</brad-card>
</brad-carousel-slide>`
);
});
```
## Métodos

⚠️ Antes de utilizar qualquer método, certifique-se de aguardar component.whenInitialized() O serviço (component.service) não estará disponível imediatamente após a renderização do componente.

Lembrando que para o uso dos métodos é necessário passar pelo processo de :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| component.service.appendSlide(slides) | HTMLElement | Adiciona novos slides ao final do Swiper. |
| component.service.prependSlide(slides) | HTMLElement | Adiciona novos slides ao início do Swiper. |
| component.service.removeSlide(indexes) | [number] | Remove um ou mais slides, especificados pelo índice (ou um array de índices). |
| component.service.removeAllSlides() |  | Remove todos os slides do Swiper. |
| component.service.update() |  | Atualiza o Swiper após manipulações nos slides, recalculando tamanhos, posição e outros parâmetros. |

## Como usar os métodos de Manipulation?
```
component.whenInitialized().then(() => {
component.service.appendSlide('<div class="swiper-slide">Novo Slide 1</div>');
component.service.prependSlide('<div class="swiper-slide">Novo Slide 2</div>');
component.service.removeSlide([0, 2]);
component.service.removeAllSlides();
component.service.update();
});
```
## Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| activeIndexChange | Evento disparado quando o índice ativo muda. |  |
| afterInit | Evento disparado logo após a inicialização. |  |
| beforeDestroy | Evento disparado antes do Carousel ser destruído. |  |
| beforeInit | Evento disparado antes da inicialização. |  |
| beforeLoopFix | Evento disparado antes do ajuste de loop. |  |
| beforeResize | Evento disparado antes do redimensionamento. |  |
| beforeSlideChangeStart | Evento disparado antes da transição de mudança de slide começar. |  |
| beforeTransitionStart | Evento disparado antes do início da transição. |  |
| breakpoint | Evento disparado na mudança de breakpoint. |  |
| changeDirection | Evento disparado quando a direção muda. |  |
| click | Evento disparado quando o usuário clica no Carousel. Recebe o evento pointerup. |  |
| destroy | Evento disparado quando o Carousel é destruído. |  |
| doubleClick | Evento disparado quando o usuário dá um duplo clique no Carousel. |  |
| doubleTap | Evento disparado quando o usuário dá um duplo toque no contêiner do Carousel. Recebe o evento pointerup. |  |
| fromEdge | Evento disparado quando o Carousel sai da posição inicial ou final. |  |
| init | Evento disparado após a inicialização do Carousel. |  |
| lock | Evento disparado quando o Carousel é bloqueado (com watchOverflow ativado). |  |
| loopFix | Evento disparado após o ajuste de loop. |  |
| momentumBounce | Evento disparado durante o "momentum bounce". |  |
| observerUpdate | Evento disparado se o observador detecta mudanças no DOM. |  |
| orientationchange | Evento disparado na mudança de orientação (e.g., paisagem para retrato). |  |
| progress | Evento disparado quando o progresso do Carousel muda. O progresso vai de 0 a 1. |  |
| reachBeginning | Evento disparado quando o Carousel atinge o início. |  |
| reachEnd | Evento disparado quando o Carousel atinge o último slide. |  |
| realIndexChange | Evento disparado quando o índice real muda. |  |
| resize | Evento disparado ao redimensionar a janela. |  |
| setTransition | Evento disparado ao iniciar uma animação. Recebe a duração da transição (em ms). |  |
| setTranslate | Evento disparado ao alterar a posição do wrapper do Carousel. Recebe o valor do translate. |  |
| slideChange | Evento disparado quando o slide ativo atual muda. |  |
| slideChangeTransitionEnd | Evento disparado após a animação de mudança de slide (próximo ou anterior). |  |
| slideChangeTransitionStart | Evento disparado no início da animação de mudança de slide (próximo ou anterior). |  |
| slideNextTransitionEnd | Igual ao slideChangeTransitionEnd, mas apenas para a direção "próxima". |  |
| slideNextTransitionStart | Igual ao slideChangeTransitionStart, mas apenas para a direção "próxima". |  |
| slidePrevTransitionEnd | Igual ao slideChangeTransitionEnd, mas apenas para a direção "anterior". |  |
| slidePrevTransitionStart | Igual ao slideChangeTransitionStart, mas apenas para a direção "anterior". |  |
| slideResetTransitionEnd | Evento disparado no final da animação para redefinir o slide atual. |  |
| slideResetTransitionStart | Evento disparado no início da animação para redefinir o slide atual. |  |
| sliderFirstMove | Evento disparado no primeiro movimento de toque ou arraste. |  |
| sliderMove | Evento disparado quando o usuário toca e move o dedo no Carousel. Recebe o evento pointermove. |  |
| slidesGridLengthChange | Evento disparado quando a grade de slides muda. |  |
| slidesLengthChange | Evento disparado quando o número de slides muda. |  |
| slidesUpdated | Evento disparado após o cálculo e atualização dos slides. |  |
| snapGridLengthChange | Evento disparado quando a grade de "snap" muda. |  |
| snapIndexChange | Evento disparado quando o índice de "snap" muda. |  |
| tap | Evento disparado quando o usuário clica no Carousel. Recebe o evento pointerup. |  |
| toEdge | Evento disparado quando o Carousel vai para a posição inicial ou final. |  |
| touchEnd | Evento disparado quando o usuário solta o Carousel. Recebe o evento pointerup. |  |
| touchMove | Evento disparado quando o usuário move o dedo sobre o Carousel. Recebe o evento pointermove. |  |
| touchMoveOpposite | Evento disparado quando o movimento do dedo é na direção oposta à configurada no Carousel. Recebe o evento pointermove. |  |
| touchStart | Evento disparado quando o usuário toca no Carousel. Recebe o evento pointerdown. |  |
| transitionEnd | Evento disparado após a transição. |  |
| transitionStart | Evento disparado no início da transição. |  |
| unlock | Evento disparado quando o Carousel é desbloqueado (com watchOverflow ativado). |  |
| update | Evento disparado após a chamada do método component.service.update(). |  |

# Como usar os eventos?
```
component.service.on('eventName', /** Substitua eventName pelo evento da tabela acima */ () => {
  const currentCard = component.service.realIndex + 1;
  console.log('Current Card Index:', currentCard);
});
```
## Responsividade

Para configurar a responsividade pode usar os "breakpoints". A responsividade apenas irá variar a quantidade de slides por view. No exemplo abaixo na menor tela que é menor que 320px apresentará apenas 1 slide por vez. No primeiro breakpoint maior e igual a 320px apresentará 2 slides por vez. E no último breakpoint maior e igual a 640px apresentará 4 slides por vez.

```
component.service.params.breakpoints = {
  320: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  480: {
    slidesPerView: 3,
    spaceBetween: 30,
  },
  640: {
    slidesPerView: 4,
    spaceBetween: 40,
  },
};

component.service.update();
```
Acessibilidade
O carroussel já atende a todos os requisitos de acessibilidade.
Exemplos
Default
```
<brad-carousel
  id="carousel-U499981797231"
  brad-initial-slide="0"
  brad-slides-per-view="1"
  brad-centered-slides="false"
  brad-autoplay-enabled="false"
  brad-pagination-clickable="true"
  brad-pagination-el="#pagination-storybook"
  brad-navigation-prev-el="#prev1"
  brad-navigation-next-el="#next1"
>
  <brad-carousel-slide>
    <brad-card brad-type="default" class="brad-auto-w brad-p-lg">
      Lorem ipsum dolor 1.
    </brad-card>
  </brad-carousel-slide>

  <brad-carousel-slide>
    <brad-card brad-type="default" class="brad-auto-w brad-p-lg">
      Lorem ipsum dolor 2.
    </brad-card>
  </brad-carousel-slide>

  <brad-carousel-slide>
    <brad-card brad-type="default" class="brad-auto-w brad-p-lg">
      Lorem ipsum dolor 3.
    </brad-card>
  </brad-carousel-slide>

  <brad-carousel-slide>
    <brad-card brad-type="default" class="brad-auto-w brad-p-lg">
      Lorem ipsum dolor 4.
    </brad-card>
  </brad-carousel-slide>

  <brad-carousel-slide>
    <brad-card brad-type="default" class="brad-auto-w brad-p-lg">
      Lorem ipsum dolor 5.
    </brad-card>
  </brad-carousel-slide>

  <brad-carousel-slide>
    <brad-card brad-type="default" class="brad-auto-w brad-p-lg">
      Lorem ipsum dolor 6.
    </brad-card>
  </brad-carousel-slide>

  
  <brad-carousel-navigation-container>
    <button id='prev1' class='brad-btn brad-btn-icon swiper-button-prev'><em class='btn-icon i icon-ui-chevron-left'></em></button>
    <brad-carousel-pagination id="pagination-storybook"></brad-carousel-pagination>
    <button id='next1' class='brad-btn brad-btn-icon swiper-button-next'><em class='btn-icon i icon-ui-chevron-right'></em></button>
  </brad-carousel-navigation-container>
</brad-carousel>
```