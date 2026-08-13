# Drag and Drop

É uma componente que disponibiliza a funcionalidade de manipular diretamente elementos da interface. Ela pode ser aplicada em uma variedade de casos de uso, como por exemplo: Cards em grade, itens em uma lista ou arrastar e soltar um arquivo para fazer upload. A função drag and drop é pegar um item, arrastá-lo para outro local e soltá-lo.

# Uso do WebComponent
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-drag-and-drop | Componente | Sim | Sim | Componente principal do drag-and-drop, define a estrutura e usa atributos para os callbacks |
| brad-drag-and-drop-container | Sub-Componente | Sim | Sim | Container responsável por agrupar os itens pertinentes ao mesmo grupo de drag-and-drop |
| brad-drag-and-drop-slot | Sub-Componente | Sim | Sim | Componente responsável pelo espaço disponível onde será arrastado o item (content) do drag-and-drop. |
| brad-drag-and-drop-content | Sub-Componente | Sim | Sim | Componente responsável pelo conteúdo que será arrastável dentro do drag-and-drop |
| brad-drag-and-drop-content-collapsed | Sub-Componente | Não | Sim | Componente que define o conteúdo exibido quando o card está colapsado (durante o drag). Deve conter apenas as informações essenciais, como título e ícone. Utilizado exclusivamente com brad-use-mode-collapse. |
| brad-drag-and-drop-content-expanded | Sub-Componente | Não | Sim | Componente que define o conteúdo exibido no estado expandido (padrão). Deve conter o conteúdo completo do card. Utilizado exclusivamente com brad-use-mode-collapse. |
| brad-drag-and-drop-accessibility | Sub-Componente | Não | Não | Componente de acessibilidade do drag-and-drop, já define a estrutura necessária para os leitores de tela. Cria dois elementos internos <p>, um com a classe intro-a11y (utilizado para leitura introdutória do drag-and-drop), e outro com classe info-a11y (utilizado pelo serviço para notificar leitores de tela sobre mudanças realizadas no drag-and-drop). |

# Propriedades
## brad-drag-and-drop

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Identificador do elemento HTML que será utilizado para instânciar o serviço |
| brad-on-drop-callback | function |  | Callback executado ao soltar um "content" (desktop e mobile) |
| brad-on-click-callback | function |  | Callback executado ao clicar em um "content" |
| brad-on-touch-start-callback | function |  | [Mobile] Callback acionado ao iniciar o toque em um content. |
| brad-on-touch-move-callback | function |  | [Mobile] Callback acionado ao mover o dedo durante o toque (evento global). Utilizado para cancelar behaviours como timers de long press |
| brad-on-touch-end-callback | function |  | [Mobile] Callback acionado ao soltar o toque (evento global). Utilizado para resetar estados e limpeza de timers |
| brad-use-mode-collapse | boolean | false | Ativa a variante de colapso com long press (300ms), ripple feedback, colapso animado e reordenação em tempo real. Funciona em desktop e mobile. |

# brad-drag-and-drop-content

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Identificador do elemento HTML que será utilizado como referência para o serviço |

## brad-drag-and-drop-accessibility

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-intro | string |  | Texto que será inserido no elemento <p class="intro-a11y"></p> gerado nativamente. Esse texto é utilizado para leitores de tela e deve ser introdutório a respeito das ações que podem ser realizadas pelo usuário |

```
<brad-drag-and-drop id="drag1">
<brad-drag-and-drop-container
  name="Container exemplo"
  data-draggable="true"
>
<brad-drag-and-drop-accessibility brad-intro="Texto introdutório/explicativo para leitores de tela em acessibilidade">
</brad-drag-and-drop-accessibility>
  <brad-drag-and-drop-slot class="brad-rounded-xs brad-m-xs">
    <brad-drag-and-drop-content
      name="Loren exemplo 1"
      id="content1"
    >
      <div class="brad-card brad-card--default brad-p-lg">
        <p><b>1-</b>Lorem ipsum dolor sit amet,</p>
      </div>
    </brad-drag-and-drop-content>
  </brad-drag-and-drop-slot>
  <brad-drag-and-drop-slot class="brad-rounded-xs brad-m-xs">
    <brad-drag-and-drop-content
      name="Loren exemplo 2"
      id="content2"
    >
      <div class="brad-card brad-card--default brad-p-lg">
        <p><b>2-</b>Lorem ipsum dolor sit amet,</p>
      </div>
    </brad-drag-and-drop-content>
  </brad-drag-and-drop-slot>
  <brad-drag-and-drop-slot class="brad-rounded-xs brad-m-xs">
    <brad-drag-and-drop-content
      name="Loren exemplo 3"
      id="content3"
    >
      <div class="brad-card brad-card--default brad-p-lg">
        <p><b>3-</b>Lorem ipsum dolor sit amet,</p>
      </div>
    </brad-drag-and-drop-content>
  </brad-drag-and-drop-slot>
</brad-drag-and-drop-container>
</brad-drag-and-drop>
```
Comportamento Javascript
## Inicialização

A inicialização do serviço não é necessária (componente nativo). Para acessar os , é necessário referenciar o serviço da seguinte forma:

```
const eDragAndDrop = document.getElementById([ID_DRAG_AND_DROP])
const service = eDragAndDrop.service
```
## Métodos do serviço

| Nome | Parâmetros | Descrição |
| --- | --- | --- |
| moveFromTo | (coord1, coord2) | Recebe por parâmetro dois objetos de coordenada (Ex. {indexContainer:0, index:0}), primeiro é o elemento origem e o segundo o destino. O comportamento do movimento é de pilha, onde o elemento empurra os outros elemento para entrar no lugar. |
| swap | (coord1, coord2) | Como no moveFromTo recebe dois objetos de coordenada, primeiro é o elemento origem e o segundo o destino. O comportamento é apenas de troca de lugar entre dois elementos. |
| findCoordinate | (element) | Função muito útil para converter o elemento html retornando um objeto coordenada, desde que o elemento faça parte do content. |
| updateIds | (array) | Função para atualizar os posicionamentos dos elementos pelo "id". Por parâmetro é um array de arrays onde o primeiro são os containers e o outro são os ids (ver eventos de callback "result", e exemplo que usa dropCallback). Após a utilização da função chamar a função "animate()" para refletir no front |
| getResult |  | Função que retorna um array com as ordens dos ids dos contents atual. Por exemplo, "e.result[0][2]", o primeiro index é do container, e o segundo index é o elemento. Com isso ele retorna o "id" do elemento, caso vir "null" quer dizer que nessa posição o slot esta vazio. |
| getFirstSlotEmptyIndex | (index) | Função que retorna o index do primeiro slot vazio, caso não exista slot vazio retornará -1. No parâmetro é passado o index do container em que ele buscará por slots vazios. |
| markDrag |  | Função apenas para atualizar a marcação de drag no objeto que esta atualmente agarrado. |
| clickMode | (event, string) | Função que permite clicar para selecionar o elemento e depois clicar para soltar, não precisando arrastar. O primeiro o parâmetro é o evento vindo do "clickCallback", e o segundo parâmetro é o modo de mudança de posição que pode ser "moveFromTo" ou "swap". |

# Customização

No brad-drag-and-drop-container você poderá estilizar de como ficará a disposição dos elementos. No exemplo abaixo através do flex ficará em forma de grid:

```
<brad-drag-and-drop-container
class="brad-flex brad-flex-justify-content-between brad-flex-wrap"
></brad-drag-and-drop-container>
```

## Para forma de lista é apenas remover o flex:

```
<brad-drag-and-drop-container id="drag1"></brad-drag-and-drop-container>
```

No brad-drag-and-drop-slot é possível customizar a margem, os arredondamentos das bordas e até tamanho. No html abaixo foram colocados classes para customizar a margem e arredondamento das bordas.

```
<brad-drag-and-drop-slot class="brad-rounded-xs brad-m-xs"></brad-drag-and-drop-slot>
```
Data attributes
data-draggable(valores true ou false): É utilizado no Container, ele define se ativa ou desativa a função de drag and drop. A ausência deste data attribute fica como ativado o drag and drop.
data-drag-event(valor true): É utilizado para determinar a interação de drag em um elemento especifico dentro do conteúdo, por exemplo em um botão dentro do card. Na ausência dele o evento drag é colocado em todos contents. Ver exemplo .
## Atributos de callback

O componente brad-drag-and-drop fornece diferentes opções de callback para serem utilizadas. Para o correto funcionamento, deve ser feito conforme os exemplos a seguir:

# Adicionando o callback

Antes de modificar os atributos do componente, é necessário adicionar/registrar a função que será utilizada como callback através do método LiquidCorp.addCallbacks, como mostra o exemplo abaixo:

```
let myDropCallback = (e) => {
service.moveFromTo(e.coordDragging, e.coordSelected);
};

LiquidCorp.addCallbacks("DragAndDrop", "DropCallback", myDropCallback);

const eDragAndDrop = document.getElementById([ID_DRAG_AND_DROP]);
eDragAndDrop.setAttribute("brad-on-drop-callback", "DragAndDrop.DropCallback");

const service = eDragAndDrop.service;
```
## Alterar o callback do componente

Após o registro do callback, é possível informá-lo ao componente de duas formas: diretamente pelo HTML através do atributo de callback correspondente, ou através do método setAttribute do javascript.

# Exemplo callback via HTML
```
<brad-drag-and-drop id="[ID_DRAG_AND_DROP]"
brad-on-drop-callback="DragAndDrop.DropCallback"
></brad-drag-and-drop>
```
Exemplo callback via Javascript
```
const eDragAndDrop = document.getElementById([ID_DRAG_AND_DROP]);
eDragAndDrop.setAttribute("brad-on-drop-callback", "DragAndDrop.DropCallback");
```
## Evento callback

## O evento retorna um objeto com os seguintes dados:

coordDragging e coordSelected: é um objeto coordenada que possui duas chaves "indexContainer" que é para saber em qual container pertence, e "index" para o content.
willChangeContainer: retorna true ou false, indica se nesse drop terá mudança de container do elemento arrastado(coordDragging) em relação ao elemento destino(coordSelected).
willChangePosition: retorna true ou false, indica se nesse drop o usuário tentou trocar para qualquer slot diferente do inicial.
result: retorna um array com as ordens dos ids dos contents atual. O mesmo retorno da função "getResult()".
target: retorna o DOM do elemento clicado, o mesmo utilizado no eventos de click.
Exemplo de código para ter o click para mudança entre containers utilizando clickCallback
```
function mycallDrop(e) {
service.moveFromTo(e.coordDragging, e.coordSelected);
// ou service.swap(e.coordDragging, e.coordSelected);
}

function myClick(e) {
changeContainer(e);
}

function changeContainer(e) {
// coordenada do elemento clicado
let coordinateTarget = service.findCoordinate(e.target);
// coordenada do destino, irá para o primeiro container no começo da lista
let coordinateTo = { indexContainer: 0, index: 0 };

// irá ao um container diferente do target
if (coordinateTo.indexContainer == coordinateTarget.indexContainer) {
coordinateTo.indexContainer = 1;
}

// funcao com a lógica de mudar o destino do elemento para o primeiro slot disponível, e caso não exista slots diponíveis, troca com o primeiro elemento.
firstEmptySlot(coordinateTo);

// efetua a mudança
service.moveFromTo(coordinateTarget, coordinateTo);
//ou service.swap(coordinateTarget, coordinateTo);

// faz a transição
service.animate();
}

function firstEmptySlot(coord) {
// pega o array dos posicionamentos dos elementos
let result = service.getResult();

// pega o index do primeiro slot vazio do container especificado no parâmetro
let indexFirstEmptySlot = service.getFirstSlotEmptyIndex(
result[coord.indexContainer]
);

// caso o index do slot vazio for -1 quer dizer que não existe slots vazios, caso isso ocorra deixamos 0.
indexFirstEmptySlot = indexFirstEmptySlot != -1 ? indexFirstEmptySlot : 0;

// atualiza o index da coordenada
coord.index = indexFirstEmptySlot;
}

LiquidCorp.addCallbacks("DragAndDrop", "ClickCallback", myClick.bind(this));
LiquidCorp.addCallbacks("DragAndDrop", "DropCallback", mycallDrop.bind(this));

const eDragAndDrop = document.getElementById([ID_DRAG_AND_DROP]);
eDragAndDrop.setAttribute("brad-on-drop-callback", "DragAndDrop.DropCallback");
eDragAndDrop.setAttribute("brad-on-click-callback", "DragAndDrop.ClickCallback");

const service = eDragAndDrop.service;
```
Exemplo de código por manipulação de array de ids, usando dropCallback
```
let myCallback = (e) => {
let ids = e.result;
// ou pode pegar os ids quando quiser pela função getResult()
// let ids = service.getResult();

// com ids vc pode mudar como quiser, abaixo o exemplo trocando o primeiro elemento com segundo
let primeiro = ids[0][0];
ids[0][0] = ids[0][1];
ids[0][1] = primeiro;

// atualiza a ordem dos elementos
service.updateByIds(ids);
service.animate();
};

LiquidCorp.addCallbacks("DragAndDrop", "DropCallback", myCallback);

const eDragAndDrop = document.getElementById([ID_DRAG_AND_DROP]);
eDragAndDrop.setAttribute("brad-on-drop-callback", "DragAndDrop.DropCallback");

const service = eDragAndDrop.service;
```
## Scroll durante o drag

Com classe css "brad-drag-and-drop-scroll" vai permitir realizar o scroll durante o arraste do elemento. No exemplo desta documentação, a classe foi colocada na tag "html", ou seja, ao realizar o drag de um elemento e arrastar no começo ou no final da tela a página principal realizará o scroll. A classe pode ser colocada também em outros elementos como div's desde que estes elementos sejam responáveis pelo scroll.

## Limitar área em que pode arrastar o elemento

Com classe css "brad-drag-and-drop-limit" restringirá a área em que o elemento será arrastado. Poderá ser colocado no elemento pai do componente drag-and-drop ou superior a ele.

# Collapse Mode

O modo colapso é uma variante do Drag and Drop que oferece uma experiência visual aprimorada durante o arraste. Ao iniciar o drag, todos os cards do container são colapsados animadamente, revelando os slots disponíveis e facilitando a visualização do destino. Conforme o card arrastado passa pelos demais, a lista se reorganiza em tempo real. Ao soltar, todos os cards se expandem de volta ao tamanho original com animação suave.

# Características:

Long press (300ms): o drag é iniciado apenas após segurar o elemento, evitando arrastes acidentais em listas com scroll.
Ripple: um feedback visual é exibido durante o long press para sinalizar que o arraste será iniciado.
Efeito de collapse animado: os cards do container (exceto o arrastado) colapsam ao iniciar o drag, ampliando a área visível de destino.
Reordenação em tempo real: os cards se reorganizam com animação FLIP enquanto o elemento arrastado passa pelos slots.
Expansão após drop: ao soltar, todos os cards voltam ao tamanho original com animação de expansão.

Para ativar, adicione o atributo brad-use-mode-collapse ao componente:

## Estrutura HTML do content no modo colapso:

Cada brad-drag-and-drop-content deve conter dois sub-componentes com papéis distintos:

brad-drag-and-drop-content-collapsed: exibido quando o card está colapsado (durante o drag dos demais cards). Deve conter apenas as informações essenciais de identificação.
brad-drag-and-drop-content-expanded: exibido no estado expandido (inicial), com o conteúdo completo do card.
```
<brad-drag-and-drop id="drag1" brad-use-mode-collapse>
<brad-drag-and-drop-container name="Favoritos" data-draggable="true">
  <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs">
    <brad-drag-and-drop-content name="Card 1" id="card-1">
      <brad-drag-and-drop-content-collapsed class="brad-card brad-card--default brad-p-lg brad-rounded-md">
        <div class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center">
          <p class="brad-font-title-md">Card 1</p>
          <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
        </div>
      </brad-drag-and-drop-content-collapsed>

      <brad-drag-and-drop-content-expanded class="brad-card brad-card--default brad-p-lg brad-rounded-md">
        <p class="brad-font-title-md brad-m-xs-b">Card 1</p>
        <p class="brad-font-paragraph-sm">Descrição completa do card...</p>
      </brad-drag-and-drop-content-expanded>
    </brad-drag-and-drop-content>
  </brad-drag-and-drop-slot>
</brad-drag-and-drop-container>
</brad-drag-and-drop>
```

Múltiplos containers: o modo colapso suporta arrastar entre containers distintos (ex.: Seção A → Seção B). Todos os cards de todos os containers colapsam ao iniciar o drag e expandem após o drop. A reordenação visual em tempo real (FLIP) acontece apenas dentro do container de origem — ao entrar no container destino, o card simplesmente é solto na posição escolhida sem prévia de reordenação, o que é o comportamento esperado para movimentações entre seções.

# Acessibilidade

Por padrão, o elemento brad-drag-and-drop-accessibility já define a estrutura correta para ser utilizada. Mas ainda é possível criar manualmente caso necessário. Basta seguir os passos abaixo:

Elemento de explicação do drag and drop .intro-a11y, nele poderá customizar o texto introdutório que será falado nos leitores de tela.

```
<p tabindex="1" class="intro-a11y">
Nos itens a seguir, pressione para selecionar o item que deseja mover, em
seguida escolha o destino, e pressione para finalizar mudança.
</p>
```

Elemento de fala dinâmica do drag and drop .info-a11y, ele é responsável pela fala dos leitores quando há movimentos e mudanças do componente.

```
<p class="info-a11y" aria-live="assertive"></p>
```

Para identificar quais elementos estão sendo movidos para serem ditos pelos leitores de telas é necessário colocar o atributo name para os seguintes elementos do drag-and-drop:

brad-drag-and-drop-container que é um determinado grupo de elementos
## brad-drag-and-drop-content que é o conteúdo em si

Utilize qualquer nome que achar coerente para ser dito pelos leitores. No exemplo abaixo, o container chama "Favoritos", e um dos contents se chama "Conteúdo 1". Então quando o leitor entrar em ação ele falará por exemplo: "Conteúdo 1" movido para posição X em "Favoritos".

```
<brad-drag-and-drop id="[ID_DO_DRAG_AND_DROP]">
<brad-drag-and-drop-accessibility brad-intro="Nos itens a seguir, pressione para selecionar o item que deseja mover, em
  seguida escolha o destino, e pressione para finalizar mudança."></brad-drag-and-drop-accessibility>
<p>Favoritos</p>
<brad-drag-and-drop-container
  name="Favoritos"
  class="brad-flex brad-flex-justify-content-start  brad-flex-wrap"
  data-draggable="true"
>
  <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs">
    <brad-drag-and-drop-content name="Conteúdo 1" class="brad-drag-and-drop__content" id="pix-12">
      ...
    </brad-drag-and-drop-content>
  </brad-drag-and-drop-slot>
</brad-drag-and-drop-container>
</brad-drag-and-drop>
```

Para que seja possível a acessibilidade em desktop, utilizar o modo click. Caso para uso exclusivo para mobile, não é obrigatório o uso do modo click. Apenas mude a frase do intro-a11y para: "Pressione 2 vezes e segure para arrastar os elementos a seguir".

Exemplo completo de acessibilidade e o modo click em funcionamento, .

# Exemplos
Default
```
<brad-drag-and-drop id="drag-and-drop-214" class="">
  <brad-drag-and-drop-accessibility
    brad-intro="Nos itens a seguir, pressione para selecionar o item que deseja mover,
      em seguida escolha o destino, e pressione para finalizar mudança."
  ></brad-drag-and-drop-accessibility>
  <brad-drag-and-drop-container
    name="Favoritos"
    class="brad-flex brad-flex-justify-content-start  brad-flex-wrap brad-gap-xs"
    data-draggable="true"
  >
    
            <brad-drag-and-drop-slot class="brad-rounded-md">
              <brad-drag-and-drop-content name="Lorem exemplo 1" id="content-1">
                <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
                  <p><b>1-</b>Lorem ipsum dolor sit amet</p>
                </div>
              </brad-drag-and-drop-content>
            </brad-drag-and-drop-slot>
            <brad-drag-and-drop-slot class="brad-rounded-md">
              <brad-drag-and-drop-content name="Lorem exemplo 2" id="content-2">
                <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
                  <p><b>2-</b>Lorem ipsum dolor sit amet</p>
                </div>
              </brad-drag-and-drop-content>
            </brad-drag-and-drop-slot>
            <brad-drag-and-drop-slot class="brad-rounded-md">
              <brad-drag-and-drop-content name="Lorem exemplo 3" id="content-3">
                <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
                  <p><b>3-</b>Lorem ipsum dolor sit amet</p>
                </div>
              </brad-drag-and-drop-content>
            </brad-drag-and-drop-slot>
            <brad-drag-and-drop-slot class="brad-rounded-md">
              <brad-drag-and-drop-content name="Lorem exemplo 4" id="content-4">
                <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
                  <p><b>4-</b>Lorem ipsum dolor sit amet</p>
                </div>
              </brad-drag-and-drop-content>
            </brad-drag-and-drop-slot>
            <brad-drag-and-drop-slot class="brad-rounded-md">
              <brad-drag-and-drop-content name="Lorem exemplo 5" id="content-5">
                <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
                  <p><b>5-</b>Lorem ipsum dolor sit amet</p>
                </div>
              </brad-drag-and-drop-content>
            </brad-drag-and-drop-slot>
            <brad-drag-and-drop-slot class="brad-rounded-md">
              <brad-drag-and-drop-content name="Lorem exemplo 6" id="content-6">
                <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
                  <p><b>6-</b>Lorem ipsum dolor sit amet</p>
                </div>
              </brad-drag-and-drop-content>
            </brad-drag-and-drop-slot>
            <brad-drag-and-drop-slot class="brad-rounded-md">
              <brad-drag-and-drop-content name="Lorem exemplo 7" id="content-7">
                <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
                  <p><b>7-</b>Lorem ipsum dolor sit amet</p>
                </div>
              </brad-drag-and-drop-content>
            </brad-drag-and-drop-slot>
            <brad-drag-and-drop-slot class="brad-rounded-md">
              <brad-drag-and-drop-content name="Lorem exemplo 8" id="content-8">
                <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
                  <p><b>8-</b>Lorem ipsum dolor sit amet</p>
                </div>
              </brad-drag-and-drop-content>
            </brad-drag-and-drop-slot>
            <brad-drag-and-drop-slot class="brad-rounded-md">
              <brad-drag-and-drop-content name="Lorem exemplo 9" id="content-9">
                <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
                  <p><b>9-</b>Lorem ipsum dolor sit amet</p>
                </div>
              </brad-drag-and-drop-content>
            </brad-drag-and-drop-slot>
  </brad-drag-and-drop-container>
</brad-drag-and-drop>
```
## Mobile

Código para hold, onde o usuário tem que segurar por um tempo para iniciar o drag (apenas para mobile).

```
let timeoutDrag = null;
let mycallTouchstart = (e) => {
timeoutDrag = setTimeout(() => {
  e.container.dataset.draggable = true;
  s.markDrag();
}, 700);
};

let mycallTouchmove = (e) => {
if (timeoutDrag) {
clearTimeout(timeoutDrag);
timeoutDrag = null;
}
};

let mycallTouchend = (e) => {
if (timeoutDrag) {
clearTimeout(timeoutDrag);
timeoutDrag = null;
}
if (e.container) {
e.container.dataset.draggable = false;
}
};

LiquidCorp.addCallbacks("DragAndDropMobile", "TouchendCallback", mycallTouchend);
LiquidCorp.addCallbacks("DragAndDropMobile", "TouchstartCallback", mycallTouchstart);
LiquidCorp.addCallbacks("DragAndDropMobile", "TouchmoveCallback", mycallTouchmove);

const eDragAndDrop = document.getElementById([ID_DRAG_AND_DROP]);
eDragAndDrop.setAttribute("brad-on-touch-end-callback", "DragAndDropMobile.TouchendCallback");
eDragAndDrop.setAttribute("brad-on-touch-move-callback", "DragAndDropMobile.TouchmoveCallback");
eDragAndDrop.setAttribute("brad-on-touch-start-callback", "DragAndDropMobile.TouchstartCallback");

const service = eDragAndDrop.service;
```
```
<brad-drag-and-drop id="drag-and-drop-184">
  <h2 class="brad-m-sm-b">Favoritos</h2>

  <brad-drag-and-drop-container
    name="Favoritos"
    class=" favourites brad-flex brad-flex-justify-content-start  brad-flex-wrap brad-gap-xs"
    data-draggable="false"
  >
    
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-1">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p><b>1-</b>Lorem ipsum dolor sit amet</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-2">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p><b>2-</b>Lorem ipsum dolor sit amet</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-3">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p><b>3-</b>Lorem ipsum dolor sit amet</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-4">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p><b>4-</b>Lorem ipsum dolor sit amet</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-5">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p><b>5-</b>Lorem ipsum dolor sit amet</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-6">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p><b>6-</b>Lorem ipsum dolor sit amet</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-7">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p><b>7-</b>Lorem ipsum dolor sit amet</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-8">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p><b>8-</b>Lorem ipsum dolor sit amet</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-9">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p><b>9-</b>Lorem ipsum dolor sit amet</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
  </brad-drag-and-drop-container>
</brad-drag-and-drop>
```
## Icon

É possível restringir a área de arraste para um ícone, por exemplo:

## Interação apenas pelo ícone é utlizado o data attribute:
data-drag-event="true"
Ícones disponíveis para o componente:
icon-component-drag-arrow-vertical
icon-component-drag-crossed-arrow
```
<brad-drag-and-drop id="drag-and-drop-271">
  <brad-drag-and-drop-container name="Container Icons">
    
        <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs-y">
          <brad-drag-and-drop-content id="icon-1">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-align-items-center brad-flex-justify-content-between">
              <p><b>1-</b>Lorem ipsum dolor sit amet</p>
              <em class="icon-component-drag-arrow-vertical brad-text-color-cta" data-drag-event="true"></em>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs-y">
          <brad-drag-and-drop-content id="icon-2">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-align-items-center brad-flex-justify-content-between">
              <p><b>2-</b>Lorem ipsum dolor sit amet</p>
              <em class="icon-component-drag-arrow-vertical brad-text-color-cta" data-drag-event="true"></em>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs-y">
          <brad-drag-and-drop-content id="icon-3">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-align-items-center brad-flex-justify-content-between">
              <p><b>3-</b>Lorem ipsum dolor sit amet</p>
              <em class="icon-component-drag-arrow-vertical brad-text-color-cta" data-drag-event="true"></em>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs-y">
          <brad-drag-and-drop-content id="icon-4">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-align-items-center brad-flex-justify-content-between">
              <p><b>4-</b>Lorem ipsum dolor sit amet</p>
              <em class="icon-component-drag-arrow-vertical brad-text-color-cta" data-drag-event="true"></em>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs-y">
          <brad-drag-and-drop-content id="icon-5">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-align-items-center brad-flex-justify-content-between">
              <p><b>5-</b>Lorem ipsum dolor sit amet</p>
              <em class="icon-component-drag-arrow-vertical brad-text-color-cta" data-drag-event="true"></em>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs-y">
          <brad-drag-and-drop-content id="icon-6">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-align-items-center brad-flex-justify-content-between">
              <p><b>6-</b>Lorem ipsum dolor sit amet</p>
              <em class="icon-component-drag-arrow-vertical brad-text-color-cta" data-drag-event="true"></em>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
  </brad-drag-and-drop-container>
</brad-drag-and-drop>
```
Click
```
<section class="brad-flex brad-gap-lg">
  <brad-drag-and-drop id="drag-and-drop-278">
    <div
      role="application"
      tabindex="-1"
      class="info-a11y"
      aria-live="assertive"
    >
      Pressione duas vezes e segure para arrastar nos elementos a seguir
    </div>

    <article>
      <h2 class="brad-m-sm-b">Favoritos</h2>
      <brad-drag-and-drop-container
        name="Favoritos"
        class="favourites brad-flex brad-flex-justify-content-start  brad-flex-wrap brad-gap-xs"
        data-draggable="true"
      >
        
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-1">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-column brad-flex-justify-content-between">
              <p><b>1-</b>Lorem ipsum dolor sit amet</p>
              <button class="brad-btn brad-btn-primary brad-btn-primary--md">change</button>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-2">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-column brad-flex-justify-content-between">
              <p><b>2-</b>Lorem ipsum dolor sit amet</p>
              <button class="brad-btn brad-btn-primary brad-btn-primary--md">change</button>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-3">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-column brad-flex-justify-content-between">
              <p><b>3-</b>Lorem ipsum dolor sit amet</p>
              <button class="brad-btn brad-btn-primary brad-btn-primary--md">change</button>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-4">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-column brad-flex-justify-content-between">
              <p><b>4-</b>Lorem ipsum dolor sit amet</p>
              <button class="brad-btn brad-btn-primary brad-btn-primary--md">change</button>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-5">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-column brad-flex-justify-content-between">
              <p><b>5-</b>Lorem ipsum dolor sit amet</p>
              <button class="brad-btn brad-btn-primary brad-btn-primary--md">change</button>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-6">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-column brad-flex-justify-content-between">
              <p><b>6-</b>Lorem ipsum dolor sit amet</p>
              <button class="brad-btn brad-btn-primary brad-btn-primary--md">change</button>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-7">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-column brad-flex-justify-content-between">
              <p><b>7-</b>Lorem ipsum dolor sit amet</p>
              <button class="brad-btn brad-btn-primary brad-btn-primary--md">change</button>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-8">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-column brad-flex-justify-content-between">
              <p><b>8-</b>Lorem ipsum dolor sit amet</p>
              <button class="brad-btn brad-btn-primary brad-btn-primary--md">change</button>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-9">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-column brad-flex-justify-content-between">
              <p><b>9-</b>Lorem ipsum dolor sit amet</p>
              <button class="brad-btn brad-btn-primary brad-btn-primary--md">change</button>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
      </brad-drag-and-drop-container>
    </article>

    <article>
      <h2 class="brad-m-sm-b brad-m-xl-t">Serviços</h2>
      <brad-drag-and-drop-container
        name="Serviços"
        class="services brad-flex brad-flex-justify-content-start  brad-flex-wrap brad-gap-xs"
        data-draggable="true"
      >
        
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-10">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p><b>10-</b>Lorem ipsum dolor sit amet</p>
              <button class="brad-btn brad-btn-primary brad-btn-primary--md">change</button>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-11">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p><b>11-</b>Lorem ipsum dolor sit amet</p>
              <button class="brad-btn brad-btn-primary brad-btn-primary--md">change</button>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content id="content-12">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p><b>12-</b>Lorem ipsum dolor sit amet</p>
              <button class="brad-btn brad-btn-primary brad-btn-primary--md">change</button>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
      </brad-drag-and-drop-container>
    </article>
  </brad-drag-and-drop>
</section>
```
## Click Mode

Este modo é uma forma de mudar de posição sem precisar arrastar, precisando apenas duas interações, onde a pessoa clica para escolher o elemento e depois clica para soltar o elemento no local desejado.

Para desktop é obrigatório o uso, pois em acessibilidade é necessário do teclado.
```
function myClick(e) {
service.clickMode(e, "moveFromTo"); /* service.clickMode(e, "swap"); */
}

LiquidCorp.addCallbacks("DragAndDropClickMode", "ClickCallback", myClick.bind(this));

const eDragAndDrop = document.getElementById([ID_DRAG_AND_DROP]);
eDragAndDrop.setAttribute("brad-on-click-callback", "DragAndDropClickMode.ClickCallback");

const service = eDragAndDrop.service;
```
```
<brad-drag-and-drop id="drag-and-drop-33">
  <brad-drag-and-drop-accessibility
    brad-intro="Nos itens a seguir, pressione para selecionar o item que deseja mover,
      em seguida escolha o destino, e pressione para finalizar mudança."
  ></brad-drag-and-drop-accessibility>

  <h2 class="brad-m-sm-b">Favoritos</h2>
  <brad-drag-and-drop-container
    name="Favoritos"
    class="favourites brad-flex brad-flex-justify-content-start brad-flex-wrap brad-gap-sm"
    data-draggable="true"
  >
    
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content name="Conteúdo 1" id="content-1">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p>Conteúdo 1</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content name="Conteúdo 2" id="content-2">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p>Conteúdo 2</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content name="Conteúdo 3" id="content-3">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p>Conteúdo 3</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content name="Conteúdo 4" id="content-4">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p>Conteúdo 4</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content name="Conteúdo 5" id="content-5">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p>Conteúdo 5</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content name="Conteúdo 6" id="content-6">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p>Conteúdo 6</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content name="Conteúdo 7" id="content-7">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p>Conteúdo 7</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content name="Conteúdo 8" id="content-8">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p>Conteúdo 8</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content name="Conteúdo 9" id="content-9">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p>Conteúdo 9</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
  </brad-drag-and-drop-container>

  <h2 class="brad-m-sm-b brad-m-xl-t">Serviços</h2>
  <brad-drag-and-drop-container
    name="Serviços"
    class="brad-drag-and-drop__container services brad-flex brad-flex-justify-content-start brad-flex-wrap brad-gap-sm"
    data-draggable="true"
  >
    
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content name="Conteúdo 10" id="content-10">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p>Conteúdo 10</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content name="Conteúdo 11" id="content-11">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p>Conteúdo 11</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
        <brad-drag-and-drop-slot class="example brad-rounded-md">
          <brad-drag-and-drop-content name="Conteúdo 12" id="content-12">
            <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
              <p>Conteúdo 12</p>
            </div>
          </brad-drag-and-drop-content>
        </brad-drag-and-drop-slot>
      
  </brad-drag-and-drop-container>
</brad-drag-and-drop>
```
## Collapse Mode

Exemplo do modo colapso em funcionamento. Segure um card por aproximadamente 300ms para iniciar o arraste. Os demais cards colapsam para revelar os slots disponíveis.

```
<section>
  <p class="info-a11y" aria-live="assertive"></p>
  <brad-drag-and-drop id="drag-and-drop-collapse-397" brad-use-mode-collapse>
    <brad-drag-and-drop-container
      name="Favoritos"
      class="brad-flex brad-flex-column"
      data-draggable="true"
    >
      
    <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs">
      <brad-drag-and-drop-content name="Investimentos" id="collapse-card-1">
        <brad-drag-and-drop-content-collapsed class="brad-card brad-card--default brad-p-lg brad-rounded-md">
          <div
            class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
          >
            <p class="brad-font-title-md">Investimentos</p>
            <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
          </div>
        </brad-drag-and-drop-content-collapsed>

        <brad-drag-and-drop-content-expanded class="brad-card brad-card--default brad-p-lg brad-rounded-md">
          <p class="brad-font-title-md brad-m-xs-b">Investimentos</p>

          <p class="brad-font-paragraph-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </brad-drag-and-drop-content-expanded>
      </brad-drag-and-drop-content>
    </brad-drag-and-drop-slot>
    <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs">
      <brad-drag-and-drop-content name="Cartão de Crédito" id="collapse-card-2">
        <brad-drag-and-drop-content-collapsed class="brad-card brad-card--default brad-p-lg brad-rounded-md">
          <div
            class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
          >
            <p class="brad-font-title-md">Cartão de Crédito</p>
            <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
          </div>
        </brad-drag-and-drop-content-collapsed>

        <brad-drag-and-drop-content-expanded class="brad-card brad-card--default brad-p-lg brad-rounded-md">
          <p class="brad-font-title-md brad-m-xs-b">Cartão de Crédito</p>

          <p class="brad-font-paragraph-sm">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis.</p>
        </brad-drag-and-drop-content-expanded>
      </brad-drag-and-drop-content>
    </brad-drag-and-drop-slot>
    <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs">
      <brad-drag-and-drop-content name="Pix" id="collapse-card-3">
        <brad-drag-and-drop-content-collapsed class="brad-card brad-card--default brad-p-lg brad-rounded-md">
          <div
            class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
          >
            <p class="brad-font-title-md">Pix</p>
            <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
          </div>
        </brad-drag-and-drop-content-collapsed>

        <brad-drag-and-drop-content-expanded class="brad-card brad-card--default brad-p-lg brad-rounded-md">
          <p class="brad-font-title-md brad-m-xs-b">Pix</p>

          <p class="brad-font-paragraph-sm">Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>
        </brad-drag-and-drop-content-expanded>
      </brad-drag-and-drop-content>
    </brad-drag-and-drop-slot>
    <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs">
      <brad-drag-and-drop-content name="Conta Corrente" id="collapse-card-4">
        <brad-drag-and-drop-content-collapsed class="brad-card brad-card--default brad-p-lg brad-rounded-md">
          <div
            class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
          >
            <p class="brad-font-title-md">Conta Corrente</p>
            <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
          </div>
        </brad-drag-and-drop-content-collapsed>

        <brad-drag-and-drop-content-expanded class="brad-card brad-card--default brad-p-lg brad-rounded-md">
          <p class="brad-font-title-md brad-m-xs-b">Conta Corrente</p>

          <p class="brad-font-paragraph-sm">Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut quid ex ea commodi.</p>
        </brad-drag-and-drop-content-expanded>
      </brad-drag-and-drop-content>
    </brad-drag-and-drop-slot>
    <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs">
      <brad-drag-and-drop-content name="Seguro de Vida" id="collapse-card-5">
        <brad-drag-and-drop-content-collapsed class="brad-card brad-card--default brad-p-lg brad-rounded-md">
          <div
            class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
          >
            <p class="brad-font-title-md">Seguro de Vida</p>
            <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
          </div>
        </brad-drag-and-drop-content-collapsed>

        <brad-drag-and-drop-content-expanded class="brad-card brad-card--default brad-p-lg brad-rounded-md">
          <p class="brad-font-title-md brad-m-xs-b">Seguro de Vida</p>

          <p class="brad-font-paragraph-sm">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.</p>
        </brad-drag-and-drop-content-expanded>
      </brad-drag-and-drop-content>
    </brad-drag-and-drop-slot>
    <brad-drag-and-drop-slot class="brad-rounded-md brad-m-xs">
      <brad-drag-and-drop-content name="Empréstimo" id="collapse-card-6">
        <brad-drag-and-drop-content-collapsed class="brad-card brad-card--default brad-p-lg brad-rounded-md">
          <div
            class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
          >
            <p class="brad-font-title-md">Empréstimo</p>
            <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
          </div>
        </brad-drag-and-drop-content-collapsed>

        <brad-drag-and-drop-content-expanded class="brad-card brad-card--default brad-p-lg brad-rounded-md">
          <p class="brad-font-title-md brad-m-xs-b">Empréstimo</p>

          <p class="brad-font-paragraph-sm">Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.</p>
        </brad-drag-and-drop-content-expanded>
      </brad-drag-and-drop-content>
    </brad-drag-and-drop-slot>
    </brad-drag-and-drop-container>
  </brad-drag-and-drop>
</section>
```