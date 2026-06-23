# Carousel
Importante
Este componente é construído sobre a biblioteca Swiper, utilizando a versão 11.2.10 como base para renderização e manipulação de slides.

Para compreender todas as funcionalidades oferecidas pela biblioteca, recomendamos a consulta à documentação oficial do Swiper.

Embora o Swiper ofereça uma ampla gama de recursos, este componente não implementa necessariamente todas as funcionalidades da biblioteca. Para entender mais sobre as funcionalidades desse componente, consulte a seção Comportamento Javascript desta documentação. Recursos não mencionados nessa seção podem não estar disponíveis no componente, mesmo que existam na biblioteca original (Swiper).
## Breaking Change

O componente carousel passou por uma mudança significativa. Para melhorar a performance e reduzir o tamanho do bundle da biblioteca Liquid, removemos todos os bundles externos, incluindo o do Swiper, que é usado internamente pelo carousel. Agora, adotamos técnicas de code splitting e lazy loading, fazendo com que o Swiper só seja carregado na primeira vez que o componente for instanciado na navegação.




Por conta disso, o carregamento do Swiper é assíncrono. Isso significa que o uso do componente carousel agora requer o uso de Promise ou async/await para garantir que o carregamento e a inicialização estejam completos antes da utilização.




Recomendamos a leitura detalhada da documentação abaixo para entender as novas formas de uso e garantir a correta implementação.

# Observações Importantes

Foi identificado um problema no componente em que, ao clicar de forma muito rápida e repetida nos elementos de paginação, esses controles poderiam desaparecer ou se deslocar incorretamente para o lado esquerdo da tela. Esse comportamento foi corrigido e, a partir desta versão, uma nova estrutura HTML foi adotada com elementos de paginação fora do container de swiper, para garantir o funcionamento adequado. Ao utilizar navigation e/ou pagination, é obrigatório declarar os respectivos objetos (navigation e/ou pagination) na configuração do componente.

É um elemento com diversas possibilidades que pode ser utilizado em diferentes formatos para diferentes contextos. Em resumo ele permite a navegação de um conteúdo de forma horizontal.

# Pré-requisitos
Certifique-se de que o elemento HTML pai do componente esteja totalmente carregado antes da inicialização.
Como o serviço utiliza targetSelector, garanta que o componente esteja renderizado e carregado antes de instanciar.
O correto funcionamento depende da presença completa da estrutura HTML do Carousel no DOM.
Caso utilize paginação (pagination) ou navegação (navigation), os elementos de paginação e os botões de navegação (previous/next) também devem estar presentes e carregados no DOM antes de instanciar o serviço.
Uso do HTML
```
<div class="brad-carousel">
<div id="myCarousel">
  <button
    id="prev1"
    aria-label="Ir para o slide anterior"
    class="brad-btn brad-btn-icon swiper-button-prev"
  >
    <em class="btn-icon i icon-ui-chevron-left"></em>
  </button>

  <div class="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <div class="brad-card brad-card--default brad-p-lg">
          <p tabindex="-1">Lorem ipsum dolor sit amet 1</p>
        </div>
      </div>

      <div class="swiper-slide">
        <div class="brad-card brad-card--default brad-p-lg">
          <p tabindex="-1">Lorem ipsum dolor sit amet 2</p>
        </div>
      </div>

      <div class="swiper-slide">
        <div class="brad-card brad-card--default brad-p-lg">
          <p tabindex="-1">Lorem ipsum dolor sit amet 3</p>
        </div>
      </div>

      <div class="swiper-slide">
        <div class="brad-card brad-card--default brad-p-lg">
          <p tabindex="-1">Lorem ipsum dolor sit amet 4</p>
        </div>
      </div>

      <div class="swiper-slide">
        <div class="brad-card brad-card--default brad-p-lg">
          <p tabindex="-1">Lorem ipsum dolor sit amet 5</p>
        </div>
      </div>

      <div class="swiper-slide">
        <div class="brad-card brad-card--default brad-p-lg">
          <p tabindex="-1">Lorem ipsum dolor sit amet 6</p>
        </div>
      </div>

      <div class="swiper-slide">
        <div class="brad-card brad-card--default brad-p-lg">
          <p tabindex="-1">Lorem ipsum dolor sit amet 7</p>
        </div>
      </div>
    </div>
  </div>

  <button
    id="next1"
    aria-label="Ir para o próximo slide"
    class="brad-btn brad-btn-icon swiper-button-next"
  >
    <em class="btn-icon i icon-ui-chevron-right"></em>
  </button>

</div>

<div id="myCarousel_pagination" class="brad-pagination"></div>
</div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do Carousel

# Usando async/await
```
const options = {
targetSelector: "#myCarousel",
config: {
  centeredSlides: false,
  slidesPerView: 3,
  initialSlide: 0,
  loop: false,
  navigation: { nextEl: "#next1", prevEl: "#prev1" },
  pagination: { el: "#myCarousel_pagination", clickable: true },
},
};

const service = await LiquidCorp.BradCarouselService.getInstance(options);
```
Usando Promise
```
const options = {
targetSelector: "#myCarousel",
config: {
  centeredSlides: false,
  slidesPerView: 3,
  initialSlide: 0,
  loop: false,
  navigation: { nextEl: "#next1", prevEl: "#prev1" },
  pagination: { el: "#myCarousel_pagination", clickable: true },
},
};

LiquidCorp.BradCarouselService.getInstance(options)
.then(service => {

console.log('Carousel inicializado:', service);
})
.catch(error => {
console.error('Erro ao inicializar carousel:', error);
});
```
## getInstances

O getInstances será usado quando se tem a necessidade de criar mais de uma instância de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

```
const options = [
{ targetSelector: "#carousel1", config: { slidesPerView: 2 } },
{ targetSelector: "#carousel2", config: { slidesPerView: 3 } },
{ targetSelector: "#carousel3", config: { slidesPerView: 1 } }
];

const services = await LiquidCorp.BradCarouselService.getInstances(options);

LiquidCorp.BradCarouselService.getInstances(options)
.then(services => {
console.log('Carousels inicializados:', services);
})
.catch(error => {
console.error('Erro ao inicializar carousels:', error);
});
```
## Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| config | objeto | - | É um objeto que conterá atributos de configurações do carrossel, segue os atributos na tabela abaixo |

# Configs

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| centeredSlides | boolean | true | Se verdadeiro centraliza horizontalmente os slides. |
| slidesPerView | number | 1 | Defini a quantidade de slide a serem mostrados. |
| initialSlide | number | 0 | Determina em qual slide começara selecionado. |
| loop | boolean | false | Se verdadeiro o carrossel volta pro começo quando passa do fim, e vice versa. Importante: Devido a lógica de reposicionamento dos slides, o total de slides deve ser >= slidesPerView * 2 |
| breakpoints | objeto | - | Para responsividade, permite reconfigurar o carrossel de acordo com a resolução. |
| autoplay | objeto | false | Parametros de "delay", "disableOnInteraction", "pauseOnMouseEnter", "reverseDirection", "stopOnLastSlide" |
| navigation | objeto | - | As chaves "nextEl" para o botão de próximo, e "prevEl" para o botão anterior, pode ser passado o id, classe ou ambas combinadas. |
| pagination | objeto | - | As chave "el" que é referência ao elemento em que ficará a paginação, pode ser por id ou classe. E "clickable" determinará se serão clicáveis por "true" ou "false" |
| a11y | prevSlideMessage: string, nextSlideMessage: string, lastSlideMessage: string | prevSlideMessage: "Slide anterior", nextSlideMessage: "Próximo slide", lastSlideMessage: "Último slide" | prevSlideMessage Define a mensagem que será anunciada quando o usuário retroceder para o slide anterior. nextSlideMessage Define a mensagem que será anunciada ao avançar para o próximo slide. lastSlideMessage Define a mensagem anunciada quando o usuário alcançar o último slide da sequência. |

# Observações Importantes
1. Ao utilizar as funcionalidades navigation e/ou pagination, é obrigatório declarar os respectivos objetos (navigation e/ou pagination) na configuração.
2. A estrutura HTML deve ser seguida, conforme apresentada na documentação oficial desta página: os elementos de navegação e/ou paginação precisam estar posicionados fora do container principal do Swiper.
3. O descumprimento dessas orientações pode comprometer o funcionamento correto da navegação ou da paginação.
## Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Descrição |  |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| service.swiper.appendSlide(slides) | HTMLElement | Adiciona novos slides ao final do Swiper. |
| service.swiper.prependSlide(slides) | HTMLElement | Adiciona novos slides ao início do Swiper. |
| service.swiper.removeSlide(indexes) | [number] | Remove um ou mais slides, especificados pelo índice (ou um array de índices). |
| service.swiper.removeAllSlides() |  | Remove todos os slides do Swiper. |
| service.swiper.update() |  | Atualiza o Swiper após manipulações nos slides, recalculando tamanhos, posição e outros parâmetros. |

## Como usar os métodos de Manipulation?

## Métodos básicos de manipulação:

```
const service = await LiquidCorp.BradCarouselService.getInstance(options);

service.swiper.appendSlide('<div class="swiper-slide">Novo Slide 1</div>');
service.swiper.prependSlide('<div class="swiper-slide">Novo Slide 2</div>');
service.swiper.removeSlide([0, 2]);
service.swiper.removeAllSlides();
service.swiper.update();
```

## Exemplo completo com tratamento de erro:

```
async function manipulateCarousel() {
try {
const service = await LiquidCorp.BradCarouselService.getInstance(options);

  service.swiper.appendSlide('<div class="swiper-slide">Novo Slide</div>');
  service.swiper.update();

} catch (error) {
console.error('Erro ao manipular carousel:', error);
}
}
```
## Eventos

| Nome do Evento | Descrição |
| --- | --- |
| activeIndexChange | Evento disparado quando o índice ativo muda. |
| afterInit | Evento disparado logo após a inicialização. |
| beforeDestroy | Evento disparado antes do Carousel ser destruído. |
| beforeInit | Evento disparado antes da inicialização. |
| beforeLoopFix | Evento disparado antes do ajuste de loop. |
| beforeResize | Evento disparado antes do redimensionamento. |
| beforeSlideChangeStart | Evento disparado antes da transição de mudança de slide começar. |
| beforeTransitionStart | Evento disparado antes do início da transição. |
| breakpoint | Evento disparado na mudança de breakpoint. |
| changeDirection | Evento disparado quando a direção muda. |
| click | Evento disparado quando o usuário clica no Carousel. Recebe o evento pointerup. |
| destroy | Evento disparado quando o Carousel é destruído. |
| doubleClick | Evento disparado quando o usuário dá um duplo clique no Carousel. |
| doubleTap | Evento disparado quando o usuário dá um duplo toque no contêiner do Carousel. Recebe o evento pointerup. |
| fromEdge | Evento disparado quando o Carousel sai da posição inicial ou final. |
| init | Evento disparado após a inicialização do Carousel. |
| lock | Evento disparado quando o Carousel é bloqueado (com watchOverflow ativado). |
| loopFix | Evento disparado após o ajuste de loop. |
| momentumBounce | Evento disparado durante o "momentum bounce". |
| observerUpdate | Evento disparado se o observador detecta mudanças no DOM. |
| orientationchange | Evento disparado na mudança de orientação (e.g., paisagem para retrato). |
| progress | Evento disparado quando o progresso do Carousel muda. O progresso vai de 0 a 1. |
| reachBeginning | Evento disparado quando o Carousel atinge o início. |
| reachEnd | Evento disparado quando o Carousel atinge o último slide. |
| realIndexChange | Evento disparado quando o índice real muda. |
| resize | Evento disparado ao redimensionar a janela. |
| setTransition | Evento disparado ao iniciar uma animação. Recebe a duração da transição (em ms). |
| setTranslate | Evento disparado ao alterar a posição do wrapper do Carousel. Recebe o valor do translate. |
| slideChange | Evento disparado quando o slide ativo atual muda. |
| slideChangeTransitionEnd | Evento disparado após a animação de mudança de slide (próximo ou anterior). |
| slideChangeTransitionStart | Evento disparado no início da animação de mudança de slide (próximo ou anterior). |
| slideNextTransitionEnd | Igual ao slideChangeTransitionEnd, mas apenas para a direção "próxima". |
| slideNextTransitionStart | Igual ao slideChangeTransitionStart, mas apenas para a direção "próxima". |
| slidePrevTransitionEnd | Igual ao slideChangeTransitionEnd, mas apenas para a direção "anterior". |
| slidePrevTransitionStart | Igual ao slideChangeTransitionStart, mas apenas para a direção "anterior". |
| slideResetTransitionEnd | Evento disparado no final da animação para redefinir o slide atual. |
| slideResetTransitionStart | Evento disparado no início da animação para redefinir o slide atual. |
| sliderFirstMove | Evento disparado no primeiro movimento de toque ou arraste. |
| sliderMove | Evento disparado quando o usuário toca e move o dedo no Carousel. Recebe o evento pointermove. |
| slidesGridLengthChange | Evento disparado quando a grade de slides muda. |
| slidesLengthChange | Evento disparado quando o número de slides muda. |
| slidesUpdated | Evento disparado após o cálculo e atualização dos slides. |
| snapGridLengthChange | Evento disparado quando a grade de "snap" muda. |
| snapIndexChange | Evento disparado quando o índice de "snap" muda. |
| tap | Evento disparado quando o usuário clica no Carousel. Recebe o evento pointerup. |
| toEdge | Evento disparado quando o Carousel vai para a posição inicial ou final. |
| touchEnd | Evento disparado quando o usuário solta o Carousel. Recebe o evento pointerup. |
| touchMove | Evento disparado quando o usuário move o dedo sobre o Carousel. Recebe o evento pointermove. |
| touchMoveOpposite | Evento disparado quando o movimento do dedo é na direção oposta à configurada no Carousel. Recebe o evento pointermove. |
| touchStart | Evento disparado quando o usuário toca no Carousel. Recebe o evento pointerdown. |
| transitionEnd | Evento disparado após a transição. |
| transitionStart | Evento disparado no início da transição. |
| unlock | Evento disparado quando o Carousel é desbloqueado (com watchOverflow ativado). |
| update | Evento disparado após a chamada do método service.swiper.update(). |

# Como usar os eventos?

## Registrando eventos após inicialização:

```
const service = await LiquidCorp.BradCarouselService.getInstance(options);

service.swiper.on('slideChange', () => {
const currentCard = service.swiper.realIndex + 1;
console.log('Slide atual:', currentCard);
});
```

## Usando Promise para configurar eventos:

```
LiquidCorp.BradCarouselService.getInstance(options)
.then(service => {
service.swiper.on('slideChange', () => {
const currentCard = service.swiper.realIndex + 1;
console.log('Slide atual:', currentCard);
});
})
.catch(error => {
console.error('Erro ao configurar eventos:', error);
});
```
## Responsividade

Para configurar a responsividade pode usar os "breakpoints". A responsividade apenas irá variar a quantidade de slides por view. No exemplo abaixo na menor tela que é menor que 320px apresentará apenas 1 slide por vez. No primeiro breakpoint maior e igual a 320px apresentará 2 slides por vez. E no último breakpoint maior e igual a 640px apresentará 4 slides por vez.

```
const options = {
targetSelector: "#myCarousel",
config: {
  slidesPerView: 1,
  breakpoints: {

    320: {
      slidesPerView: 2,
    },
    480: {
      slidesPerView: 3,
    },
    640: {
      slidesPerView: 4,
    },
  },

},
};

const service = await LiquidCorp.BradCarouselService.getInstance(options);
```
## Acessibilidade

Como regra geral, o uso do carousel deve ser evitado, especialistas em usabilidade mostram por meio de testes de uso, que o carousel é frequentemente ignorado pelos usuários. Por isso, nenhuma informação importante deve ser aplicada no carousel, quando for desenvolver o protótipo de sua jornada considere o uso de outros componentes mais acessíveis, sempre que possível. A implementação da acessibilidade no carousel pode seguir de maneiras diversas, de acordo com a forma como ele foi prototipado ou necessidade de usabilidade, aqui esta disponibilizado e implementado da seguinte lógica.

Caso não existam o elementos de navigation (setas) e o pagination (bullets), a leitura e navegação passará por todos os conteúdos do carrossel.

Caso exista os elementos de navigation ou pagination ou ambos, com relação ao conteúdo ele fará a leitura dos que estão visíveis, e através dos botões de navegação ou de paginação ele terá acesso a leitura dos conteúdos que estavam ocultos pelo carrossel. Sempre respeitando a ordem da esquerda pra direita e de cima para baixo.

Quando funcionalidade autoplay está ativada o conteúdo não é atualizado automaticamente pois essa atualização traria o foco para o slide ou ficaria lendo conteúdo sempre que os slides fossem atualizados.

# Compatibilidade do Navegador

Este componente foi testado, e é compatível com as seguintes versões de navegadores:

## Google Chrome: versão 51 e superior
## Safari (iOS): versão 13 e superior

| Navegador | Versão Suportada | Observações |
| --- | --- | --- |
| Google Chrome | 55 e superior | Todas funcionalidades documentadas suportadas |
|  | Anteriores a 55 | Arrastar pode não funcionar completamente |
| Firefox | 59 e superior | Todas funcionalidades documentadas suportadas |
|  | Anteriores a 59 | Arrastar pode não funcionar completamente |
| Opera | 42 e superior | Todas funcionalidades documentadas suportadas |
|  | Anteriores a 42 | Arrastar pode não funcionar completamente |
| Safari (iOS) | 13 e superior | Todas funcionalidades documentadas suportadas |
|  | Anteriores a 13 | Arrastar pode não funcionar completamente |
| Android | 7 e superior | Todas funcionalidades documentadas suportadas |
|  | Anteriores a 7 | Arrastar pode não funcionar completamente |

# Exemplos
Default
```
<div class="brad-carousel">
  <div id="carousel-286">
    <button
          id="prev1"
          aria-label="Ir para o slide anterior"
          class="brad-btn brad-btn-icon swiper-button-prev"
        >
          <em class="btn-icon i icon-ui-chevron-left"></em>
        </button>

    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">Lorem ipsum dolor sit amet 1</p>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">Lorem ipsum dolor sit amet 2</p>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">Lorem ipsum dolor sit amet 3</p>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">Lorem ipsum dolor sit amet 4</p>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">Lorem ipsum dolor sit amet 5</p>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">Lorem ipsum dolor sit amet 6</p>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">Lorem ipsum dolor sit amet 7</p>
          </div>
        </div>
      </div>
    </div>

    <button
          id="next1"
          aria-label="Ir para o próximo slide"
          class="brad-btn brad-btn-icon swiper-button-next teste"
        >
          <em class="btn-icon i icon-ui-chevron-right"></em>
        </button>
  </div>

  
        <div id="pag-408" class="brad-pagination"></div>
      
</div>
```
NavigationDown
```
<section class="brad-theme-classic">
  <div class="brad-carousel">
    <div id="mySwiper2" class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Integer posuere erat a ante.
            </p>
          </div>
        </div>

        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Integer posuere erat a ante.
            </p>
          </div>
        </div>

        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Integer posuere erat a ante.
            </p>
          </div>
        </div>

        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Integer posuere erat a ante.
            </p>
          </div>
        </div>

        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Integer posuere erat a ante.
            </p>
          </div>
        </div>

        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Integer posuere erat a ante.
            </p>
          </div>
        </div>

        <div class="swiper-slide">
          <div class="brad-card brad-card--default brad-p-lg">
            <p tabindex="-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Integer posuere erat a ante.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="nav-pagination">
      <button
            id="prev_2"
            class="brad-btn brad-btn-icon swiper-button-prev"
          >
            <em class="btn-icon i icon-ui-chevron-left"></em>
          </button>
      
            <div id="mySwiper2_pagination" class="brad-pagination"></div>
          
      <button
            id="next_2"
            class="brad-btn brad-btn-icon swiper-button-next"
          >
            <em class="btn-icon i icon-ui-chevron-right"></em>
          </button>
    </div>
  </div>
</section>
```