# Drag and Drop

É uma funcionalidade que permite aos usuários manipular diretamente elementos da interface. Ela pode ser aplicada em uma variedade de casos de uso, como por exemplo: Cards em grade, itens em uma lista ou arrastar e soltar um arquivo para fazer upload. A função drag and drop é pegar um item, arrastá-lo para outro local e soltá-lo.

# Uso do HTML
```
<div id="drag1" class="brad-drag-and-drop">
<p tabindex="1" class="intro-a11y">
  Nos itens a seguir, pressione para selecionar o item que deseja mover, em
  seguida escolha o destino, e pressione para finalizar mudança.
</p>
<p class="info-a11y" aria-live="assertive"></p>
<div
  name="Container exemplo"
  class="brad-drag-and-drop__container"
  data-draggable="true"
>
  <div class="brad-drag-and-drop__slot brad-rounded-xs brad-m-xs">
    <div
      name="Loren exemplo 1"
      class="brad-drag-and-drop__content"
      id="content1"
    >
      <div class="brad-card brad-card--default brad-p-lg">
        <p><b>1-</b>Lorem ipsum dolor sit amet,</p>
      </div>
    </div>
  </div>
  <div class="brad-drag-and-drop__slot brad-rounded-xs brad-m-xs">
    <div
      name="Loren exemplo 2"
      class="brad-drag-and-drop__content"
      id="content2"
    >
      <div class="brad-card brad-card--default brad-p-lg">
        <p><b>2-</b>Lorem ipsum dolor sit amet,</p>
      </div>
    </div>
  </div>
  <div class="brad-drag-and-drop__slot brad-rounded-xs brad-m-xs">
    <div
      name="Loren exemplo 3"
      class="brad-drag-and-drop__content"
      id="content3"
    >
      <div class="brad-card brad-card--default brad-p-lg">
        <p><b>3-</b>Lorem ipsum dolor sit amet,</p>
      </div>
    </div>
  </div>
</div>
</div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do Drag and Drop

```
const targetSelector = "#drag1"; // ou .classe
const options = { targetSelector };
const service = LiquidCorp.BradDragAndDropService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| dropCallback(opcional) | function | - | A função que será chamada toda vez que o usuário soltar um elemento (desktop e mobile) |
| touchstartCallback(opcional) | function | - | [Mobile] Função acionada ao iniciar o toque em um content. |
| touchmoveCallback(opcional) | function | - | [Mobile] Função acionada ao mover o dedo durante o toque (evento global no document). Utilizada para cancelar behaviours como timers de long press |
| touchendCallback(opcional) | function | - | [Mobile] Função acionada ao soltar o toque (evento global no document). Utilizada para resetar estados e limpeza de timers |
| useModeCollapse(opcional) | boolean | false | Ativa a variante de colapso com long press (300ms), ripple feedback, colapso animado e reordenação em tempo real. Funciona em desktop e mobile. |

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetro | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |

# Estrutura HTML

O componente é composto por 5 elementos obrigatórios.

intro-a11y e info-a11y elementos utilizados pelos leitores de tela em acessibilidade, são invisíveis,
Container que é o pai de um grupo de slots, representado pela classe css brad-drag-and-drop__container.
Slot, visualmente ele é a área cinza por traz do conteúdo, é o elemento responsável pra definir os lugares podem ter o um conteúdo, possuindo a classe brad-drag-and-drop__slot.
Nele você tem a liberdade de definir os estilos de margem, tamanho e border-radius.
Importante em casos de slot vazio (sem "content") se ele não possuir um width e height ou min-width e min-height ficará invisível.
Content, é neste elemento em que será colocado o conteúdo, no html abaixo dentro dele tem um card. Durante o drag and drop é o content que vai mudando de slots com os outros contents.
Possui a classe brad-drag-and-drop__content.

Importante: é essêncial criar o "id" no content para facilitar o controle.

# Abaixo segue a hierarquia:

```
<div id="drag1" class="brad-drag-and-drop">
<p tabindex="1" class="intro-a11y">
  Texto introdutório/explicativo para leitores de tela em acessibilidade
</p>
<p class="info-a11y" aria-live="assertive"></p>
<div
  name="Container exemplo"
  class="brad-drag-and-drop__container"
  data-draggable="true"
>
  <div class="brad-drag-and-drop__slot">
    <div
      name="Conteúdo exemplo"
      class="brad-drag-and-drop__content"
      id="anyId"
    >
      <div class="brad-card brad-card--default brad-p-lg">
        <p><b>1-</b>Lorem ipsum dolor sit amet,</p>
      </div>
    </div>
  </div>
</div>
</div>
```
## Customização

No container você poderá estilizar de como ficará a disposição dos elementos. No exemplo abaixo através do flex ficará em forma de grid:

```
<div
class="brad-drag-and-drop__container brad-flex brad-flex-justify-content-between brad-flex-wrap"
></div>
```

## Para forma de lista é apenas remover o flex:

```
<div id="drag1" class="brad-drag-and-drop__container"></div>
```

No Slot é possível customizar a margem, os arredondamentos das bordas e até tamanho. No html abaixo foram colocados classes para customizar a margem e arredondamento das bordas.

```
<div class="brad-drag-and-drop__slot brad-rounded-xs brad-m-xs"></div>
```
Data attributes
data-draggable(valores true ou false): É utilizado no Container, ele define se ativa ou desativa a função de drag and drop. A ausência deste data attribute fica como ativado o drag and drop.
data-drag-event(valor true): É utilizado para determinar a interação de drag em um elemento especifico dentro do conteúdo, por exemplo em um botão dentro do card. Na ausência dele o evento drag é colocado em todos contents. Ver exemplo Drag And Drop Icon.
Javascript
clickCallback (opcional): você poderá customizar o tratamento do click.
touchstartCallback (opcional): uso mais restrito para este
touchmoveCallback (opcional): uso mais restrito para este
touchendCallback (opcional): uso mais restrito para este
dropCallback (opcional): você poderá customizar o tratamento drop, que é quando usuário solta o elemento que ele agarrou e moveu.

# Segue um exemplo de código:

```
let myDropCallback = (e) => {
// a biblioteca oferece dois tipos de mudança de elementos "moveFromTo" e "swap"
service.moveFromTo(e.coordDragging, e.coordSelected);
// service.swap(e.coordDragging, e.coordSelected);
};

const options = { targetSelector: "#drag1", dropCallback: myDropCallback };
const service = LiquidCorp.BradDragAndDropService.getInstance(options);
```
## Funções

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

# Evento callback

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

const options = {
targetSelector: "#drag1",
clickCallback: myClick.bind(this),
dropCallback: mycallDrop.bind(this),
};
const service = LiquidCorp.BradDragAndDropService.getInstance(options);
```
```
<div id="drag1" class="brad-drag-and-drop">
<p>Favoritos</p>
<div
  class="brad-drag-and-drop__container brad-flex brad-flex-justify-content-start  brad-flex-wrap"
  data-draggable="true"
>
  <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
    <div class="brad-drag-and-drop__content" id="content1">
      <div class="brad-card brad-card--default brad-p-lg">
        <p><b>1-</b>Lorem ipsum dolor sit amet,</p>
        <button class="brad-btn brad-btn-primary brad-btn-primary--md">
          Change
        </button>
      </div>
    </div>
  </div>
  <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
    <div class="brad-drag-and-drop__content" id="content2">
      <div class="brad-card brad-card--default brad-p-lg">
        <p><b>2-</b>Lorem ipsum dolor sit amet,</p>
        <button class="brad-btn brad-btn-primary brad-btn-primary--md">
          Change
        </button>
      </div>
    </div>
  </div>
  <div
    class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"
  ></div>
</div>

<p>Serviços</p>
<div
  class="brad-drag-and-drop__container brad-flex brad-flex-justify-content-start  brad-flex-wrap"
  data-draggable="true"
>
  <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
    <div class="brad-drag-and-drop__content" id="content5">
      <div class="brad-card brad-card--default brad-p-lg">
        <p><b>5-</b>Lorem ipsum dolor sit amet,</p>
        <button class="brad-btn brad-btn-primary brad-btn-primary--md">
          Change
        </button>
      </div>
    </div>
  </div>
  <div
    class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"
  ></div>
  <div
    class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"
  ></div>
</div>
</div>
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

const options = { targetSelector: "#drag1", dropCallback: myCallback };
const service = LiquidCorp.BradDragAndDropService.getInstance(options);
```
```
<div id="drag1" class="brad-drag-and-drop">
<div
  class="brad-drag-and-drop__container brad-flex brad-flex-justify-content-start  brad-flex-wrap"
  data-draggable="true"
>
  <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
    <div class="brad-drag-and-drop__content" id="content1">
      <div class="brad-card brad-card--default brad-p-lg">
        <p><b>1-</b>Lorem ipsum dolor sit amet,</p>
      </div>
    </div>
  </div>
  <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
    <div class="brad-drag-and-drop__content" id="content2">
      <div class="brad-card brad-card--default brad-p-lg">
        <p><b>2-</b>Lorem ipsum dolor sit amet,</p>
      </div>
    </div>
  </div>
  <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"></div>
</div>
</div>
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

## Para ativar, adicione useModeCollapse: true nas options:

```
const options = {
targetSelector: "#drag1",
useModeCollapse: true,
};
const service = LiquidCorp.BradDragAndDropService.getInstance(options);
```

## Estrutura HTML do content no modo colapso:

Cada brad-drag-and-drop__content deve conter dois elementos filhos com papéis distintos:

brad-drag-and-drop__content-collapsed: exibido quando o card está colapsado (durante o drag dos demais cards). Deve conter apenas as informações essenciais de identificação do card, como título e tags, já que o espaço disponível é reduzido.
brad-drag-and-drop__content-expanded: exibido no estado expandido (inicial), com o conteúdo completo do card.
```
<div class="brad-drag-and-drop__content" id="card-1">
<!-- Exibido quando colapsado (durante o drag) -->
<div class="brad-drag-and-drop__content-preview brad-card brad-card--default brad-p-lg">
  <p>Título do card</p>
</div>

<!-- Exibido no estado padrão (inicial) -->
<div class="brad-drag-and-drop__content-default brad-card brad-card--default brad-p-lg">
  <p>Título do card</p>
  <p>Descrição completa com mais detalhes e informações do card.</p>
</div>
</div>
```

Importante: A classe brad-drag-and-drop--collapse-mode é aplicada automaticamente ao elemento principal pelo serviço. A alternância entre content-collapsed e content-expanded é gerenciada pelo CSS com base nessa classe.

Múltiplos containers: o modo colapso suporta arrastar entre containers distintos (ex.: Seção A → Seção B). Todos os cards de todos os containers colapsam ao iniciar o drag e expandem após o drop. A reordenação visual em tempo real (FLIP) acontece apenas dentro do container de origem — ao entrar no container destino, o card simplesmente é solto na posição escolhida sem prévia de reordenação, o que é o comportamento esperado para movimentações entre seções. Para um exemplo completo com múltiplos containers, consulte o template Drag And Drop Collapse.

# Acessibilidade

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

brad-drag-and-drop__container que é um determinado grupo de elementos
## brad-drag-and-drop__content que é o conteúdo em si

Utilize qualquer nome que achar coerente para ser dito pelos leitores. No exemplo abaixo, o container chama "Favoritos", e um dos contents se chamar "Conteúdo 1". Então quando o leitor entrar em ação ele falará por exemplo: "Conteúdo 1" movido para posição X em "Favoritos".

```
<div id="drag1" class="brad-drag-and-drop">
<p tabindex="1" class="intro-a11y">
  Nos itens a seguir, pressione para selecionar o item que deseja mover, em
  seguida escolha o destino, e pressione para finalizar mudança.
</p>
<p class="info-a11y" aria-live="assertive"></p>
<p>Favoritos</p>
<div
  name="Favoritos"
  class="brad-drag-and-drop__container brad-flex brad-flex-justify-content-start  brad-flex-wrap"
  data-draggable="true"
>
  <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
    <div name="Conteúdo 1" class="brad-drag-and-drop__content" id="pix-12">
      ...
    </div>
  </div>
</div>
</div>
```

Para que seja possível a acessibilidade em desktop, utilizar o modo click. Caso para uso exclusivo para mobile, não é obrigatório o uso do modo click. Apenas mude a frase do intro-a11y para: "Pressione 2 vezes e segure para arrastar os elementos a seguir".

Exemplo completo de acessibilidade e o modo click em funcionamento, .

# Exemplos
Default
```
<section>
  <div id="dragAndDrop-7" class="brad-drag-and-drop ">
    <p tabindex="1" class="intro-a11y">
      Nos itens a seguir, pressione para selecionar o item que deseja mover,
      em seguida escolha o destino, e pressione para finalizar mudança.
    </p>
    <p class="info-a11y" aria-live="assertive"></p>
    <div
      name="Favoritos"
      class="brad-drag-and-drop__container brad-flex brad-flex-justify-content-start  brad-flex-wrap"
      data-draggable="true"
    >
      <div
        class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"
      >
        <div
          name="Lorem exemplo 1"
          class="brad-drag-and-drop__content"
          id="content-1"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>1-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"
      >
        <div
          name="Lorem exemplo 2"
          class="brad-drag-and-drop__content"
          id="content-2"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>2-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"
      >
        <div
          name="Lorem exemplo 3"
          class="brad-drag-and-drop__content"
          id="content-3"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>3-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"
      >
        <div
          name="Lorem exemplo 4"
          class="brad-drag-and-drop__content"
          id="content-4"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>4-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"
      >
        <div
          name="Lorem exemplo 5"
          class="brad-drag-and-drop__content"
          id="content-5"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>5-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"
      >
        <div
          name="Lorem exemplo 6"
          class="brad-drag-and-drop__content"
          id="content-6"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>6-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"
      >
        <div
          name="Lorem exemplo 7"
          class="brad-drag-and-drop__content"
          id="content-7"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>7-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"
      >
        <div
          name="Lorem exemplo 8"
          class="brad-drag-and-drop__content"
          id="content-8"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>8-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"
      >
        <div
          name="Lorem exemplo 9"
          class="brad-drag-and-drop__content"
          id="content-9"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>9-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
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

const options = {
targetSelector: "#drag1", // olhe se o id está correto
touchstartCallback: mycallTouchstart,
touchmoveCallback: mycallTouchmove,
touchendCallback: mycallTouchend,
};
const service = LiquidCorp.BradDragAndDropService.getInstance(options);
```
```
<section>
  <div id="dragAndDrop-9" class="brad-drag-and-drop">
    <p>Favoritos</p>
    <div
      name="Favoritos"
      class="brad-drag-and-drop__container favourites brad-flex brad-flex-justify-content-start  brad-flex-wrap"
      data-draggable="false"
    >
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="pix-1">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>1-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="poupanca-2">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>2-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="creditos-3">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>3-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="cartoes-4">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>4-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="transferencias-5">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>5-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="extrato-6">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>6-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="saldo-7">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>7-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="beneficios-8">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>8-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="mimos-9">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>9-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      ></div>
    </div>
    <p>Serviços</p>
    <div
      name="Serviços"
      class="brad-drag-and-drop__container services brad-flex brad-flex-justify-content-start  brad-flex-wrap"
      data-draggable="false"
    >
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="openfinance-10">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>10-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="IR-11">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>11-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="inss-12">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>12-</b>Lorem ipsum dolor sit amet,</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      ></div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      ></div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      ></div>
    </div>
  </div>
</section>
```
## Icon

É possível restringir a área de arraste para um ícone, por exemplo:

## Interação apenas pelo ícone é utlizado o data attribute:
data-drag-event="true"
Ícones disponíveis para o componente:
icon-component-drag-arrow-vertical
icon-component-drag-crossed-arrow
```
<section>
  <div id="drag2" class="brad-drag-and-drop">
    <div class="brad-drag-and-drop__container" name="Container Icons">
      <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
        <div class="brad-drag-and-drop__content">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
          >
            <p><b>1-</b>Lorem ipsum dolor sit amet,</p>
            <em
              class="icon-component-drag-arrow-vertical brad-text-color-cta"
              data-drag-event="true"
            ></em>
          </div>
        </div>
      </div>
      <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
        <div class="brad-drag-and-drop__content">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
          >
            <p><b>2-</b>Lorem ipsum dolor sit amet,</p>
            <em
              class="icon-component-drag-arrow-vertical brad-text-color-cta"
              data-drag-event="true"
            ></em>
          </div>
        </div>
      </div>
      <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
        <div class="brad-drag-and-drop__content">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
          >
            <p><b>3-</b>Lorem ipsum dolor sit amet,</p>
            <em
              class="icon-component-drag-arrow-vertical brad-text-color-cta"
              data-drag-event="true"
            ></em>
          </div>
        </div>
      </div>
      <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
        <div class="brad-drag-and-drop__content">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
          >
            <p><b>4-</b>Lorem ipsum dolor sit amet,</p>
            <em
              class="icon-component-drag-arrow-vertical brad-text-color-cta"
              data-drag-event="true"
            ></em>
          </div>
        </div>
      </div>
      <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
        <div class="brad-drag-and-drop__content">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
          >
            <p><b>5-</b>Lorem ipsum dolor sit amet,</p>
            <em
              class="icon-component-drag-arrow-vertical brad-text-color-cta"
              data-drag-event="true"
            ></em>
          </div>
        </div>
      </div>
      <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
        <div class="brad-drag-and-drop__content">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
          >
            <p><b>6-</b>Lorem ipsum dolor sit amet,</p>
            <em
              class="icon-component-drag-arrow-vertical brad-text-color-cta"
              data-drag-event="true"
            ></em>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```
Click
```
<section>
  <div id="dragAndDrop-184" class="brad-drag-and-drop">
    <div
      role="application"
      tabindex="-1"
      class="info-a11y"
      aria-live="assertive"
    >
      Pressione duas vezes e segure para arrastar nos elementos a seguir
    </div>
    <p>Favoritos</p>
    <div
      name="Favoritos"
      class="brad-drag-and-drop__container favourites brad-flex brad-flex-justify-content-start  brad-flex-wrap"
      data-draggable="true"
    >
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="pix-1">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>1-</b>Lorem ipsum dolor sit amet,</p>
            <button class="brad-btn brad-btn-primary brad-btn-primary--md">
              change
            </button>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="poupanca-2">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>2-</b>Lorem ipsum dolor sit amet,</p>
            <button class="brad-btn brad-btn-primary brad-btn-primary--md">
              change
            </button>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="creditos-3">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>3-</b>Lorem ipsum dolor sit amet,</p>
            <button class="brad-btn brad-btn-primary brad-btn-primary--md">
              change
            </button>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="cartoes-4">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>4-</b>Lorem ipsum dolor sit amet,</p>
            <button class="brad-btn brad-btn-primary brad-btn-primary--md">
              change
            </button>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="transferencias-5">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>5-</b>Lorem ipsum dolor sit amet,</p>
            <button class="brad-btn brad-btn-primary brad-btn-primary--md">
              change
            </button>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="extrato-6">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>6-</b>Lorem ipsum dolor sit amet,</p>
            <button class="brad-btn brad-btn-primary brad-btn-primary--md">
              change
            </button>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="saldo-7">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>7-</b>Lorem ipsum dolor sit amet,</p>
            <button class="brad-btn brad-btn-primary brad-btn-primary--md">
              change
            </button>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="beneficios-8">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>8-</b>Lorem ipsum dolor sit amet,</p>
            <button class="brad-btn brad-btn-primary brad-btn-primary--md">
              change
            </button>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="mimos-9">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>9-</b>Lorem ipsum dolor sit amet,</p>
            <button class="brad-btn brad-btn-primary brad-btn-primary--md">
              change
            </button>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      ></div>
    </div>
    <p>Serviços</p>
    <div
      name="Serviços"
      class="brad-drag-and-drop__container services brad-flex brad-flex-justify-content-start  brad-flex-wrap"
      data-draggable="true"
    >
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="openfinance-10">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>10-</b>Lorem ipsum dolor sit amet,</p>
            <button class="brad-btn brad-btn-primary brad-btn-primary--md">
              change
            </button>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="IR-11">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>11-</b>Lorem ipsum dolor sit amet,</p>
            <button class="brad-btn brad-btn-primary brad-btn-primary--md">
              change
            </button>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div class="brad-drag-and-drop__content" id="inss-12">
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p><b>12-</b>Lorem ipsum dolor sit amet,</p>
            <button class="brad-btn brad-btn-primary brad-btn-primary--md">
              change
            </button>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      ></div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      ></div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      ></div>
    </div>
  </div>
</section>
```
## Click Mode

Este modo é uma forma de mudar de posição sem precisar arrastar, precisando apenas duas interações, onde a pessoa clica para escolher o elemento e depois clica para soltar o elemento no local desejado.

Para desktop é obrigatório o uso, pois em acessibilidade é necessário do teclado.
```
function myClick(e) {
service.clickMode(e, "moveFromTo"); /* service.clickMode(e, "swap"); */
}

const options = { targetSelector: "#drag1", clickCallback: myClick.bind(this) };
const service = LiquidCorp.BradDragAndDropService.getInstance(options);
```
```
<section>
  <div id="dragAndDrop-93" class="brad-drag-and-drop">
    <p tabindex="1" class="intro-a11y">
      Nos itens a seguir, pressione para selecionar o item que deseja mover,
      em seguida escolha o destino, e pressione para finalizar mudança.
    </p>
    <p class="info-a11y" aria-live="assertive"></p>
    <p>Favoritos</p>
    <div
      name="Favoritos"
      class="brad-drag-and-drop__container favourites brad-flex brad-flex-justify-content-start  brad-flex-wrap"
      data-draggable="true"
    >
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div
          name="Conteúdo 1"
          class="brad-drag-and-drop__content"
          id="pix-12"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p>Conteúdo 1</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div
          name="Conteúdo 2"
          class="brad-drag-and-drop__content"
          id="poupanca-22"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p>Conteúdo 2</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div
          name="Conteúdo 3"
          class="brad-drag-and-drop__content"
          id="creditos-32"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p>Conteúdo 3</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div
          name="Conteúdo 4"
          class="brad-drag-and-drop__content"
          id="cartoes-42"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p>Conteúdo 4</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div
          name="Conteúdo 5"
          class="brad-drag-and-drop__content"
          id="transferencias-52"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p>Conteúdo 5</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div
          name="Conteúdo 6"
          class="brad-drag-and-drop__content"
          id="extrato-62"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p>Conteúdo 6</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div
          name="Conteúdo 7"
          class="brad-drag-and-drop__content"
          id="saldo-72"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p>Conteúdo 7</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div
          name="Conteúdo 8"
          class="brad-drag-and-drop__content"
          id="beneficios-82"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p>Conteúdo 8</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div
          name="Conteúdo 9"
          class="brad-drag-and-drop__content"
          id="mimos-92"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p>Conteúdo 9</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      ></div>
    </div>
    <p>Serviços</p>
    <div
      name="Serviços"
      class="brad-drag-and-drop__container services brad-flex brad-flex-justify-content-start  brad-flex-wrap"
      data-draggable="true"
    >
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div
          name="Conteúdo 10"
          class="brad-drag-and-drop__content"
          id="openfinance-102"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p>Conteúdo 10</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div
          name="Conteúdo 11"
          class="brad-drag-and-drop__content"
          id="IR-112"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p>Conteúdo 11</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      >
        <div
          name="Conteúdo 12"
          class="brad-drag-and-drop__content"
          id="inss-122"
        >
          <div
            class="brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p>Conteúdo 12</p>
          </div>
        </div>
      </div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      ></div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      ></div>
      <div
        class="brad-drag-and-drop__slot example brad-rounded-md brad-m-xs"
      ></div>
    </div>
  </div>
</section>
```
## Collapse Mode

Exemplo do modo colapso em funcionamento. Segure um card por aproximadamente 300ms para iniciar o arraste. Os demais cards colapsam para revelar os slots disponíveis e se reorganizam em tempo real conforme o card arrastado avança pela lista.

```
const options = {
targetSelector: "#drag1",
useModeCollapse: true,
dropCallback: (e) => {
  service.moveFromTo(e.coordDragging, e.coordSelected);
},
};
const service = LiquidCorp.BradDragAndDropService.getInstance(options);
```
```
<style></style>

<section>
  <p class="info-a11y" aria-live="assertive"></p>
  <div id="dragAndDrop-collapse-415" class="brad-drag-and-drop">
    <div
      name="Collapse Mode"
      class="brad-drag-and-drop__container brad-flex brad-flex-column"
      data-draggable="true"
    >
      
      <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
        <div
          name="Investimentos"
          class="brad-drag-and-drop__content"
          id="collapse-card-1"
        >
          <div
            class="brad-drag-and-drop__content-collapsed brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <div
              class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
            >
              <p class="brad-font-title-md">Investimentos</p>
              <em
                class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"
              ></em>
            </div>
          </div>

          <div
            class="brad-drag-and-drop__content-expanded brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p class="brad-font-title-md brad-m-xs-b">Investimentos</p>

            <p class="brad-font-paragraph-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>
      <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
        <div
          name="Cartão de Crédito"
          class="brad-drag-and-drop__content"
          id="collapse-card-2"
        >
          <div
            class="brad-drag-and-drop__content-collapsed brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <div
              class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
            >
              <p class="brad-font-title-md">Cartão de Crédito</p>
              <em
                class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"
              ></em>
            </div>
          </div>

          <div
            class="brad-drag-and-drop__content-expanded brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p class="brad-font-title-md brad-m-xs-b">Cartão de Crédito</p>

            <p class="brad-font-paragraph-sm">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis.
            </p>
          </div>
        </div>
      </div>
      <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
        <div
          name="Pix"
          class="brad-drag-and-drop__content"
          id="collapse-card-3"
        >
          <div
            class="brad-drag-and-drop__content-collapsed brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <div
              class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
            >
              <p class="brad-font-title-md">Pix</p>
              <em
                class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"
              ></em>
            </div>
          </div>

          <div
            class="brad-drag-and-drop__content-expanded brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p class="brad-font-title-md brad-m-xs-b">Pix</p>

            <p class="brad-font-paragraph-sm">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
            </p>
          </div>
        </div>
      </div>
      <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
        <div
          name="Conta Corrente"
          class="brad-drag-and-drop__content"
          id="collapse-card-4"
        >
          <div
            class="brad-drag-and-drop__content-collapsed brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <div
              class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
            >
              <p class="brad-font-title-md">Conta Corrente</p>
              <em
                class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"
              ></em>
            </div>
          </div>

          <div
            class="brad-drag-and-drop__content-expanded brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p class="brad-font-title-md brad-m-xs-b">Conta Corrente</p>

            <p class="brad-font-paragraph-sm">
              Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut quid ex ea commodi.
            </p>
          </div>
        </div>
      </div>
      <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
        <div
          name="Seguro de Vida"
          class="brad-drag-and-drop__content"
          id="collapse-card-5"
        >
          <div
            class="brad-drag-and-drop__content-collapsed brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <div
              class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
            >
              <p class="brad-font-title-md">Seguro de Vida</p>
              <em
                class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"
              ></em>
            </div>
          </div>

          <div
            class="brad-drag-and-drop__content-expanded brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p class="brad-font-title-md brad-m-xs-b">Seguro de Vida</p>

            <p class="brad-font-paragraph-sm">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.
            </p>
          </div>
        </div>
      </div>
      <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
        <div
          name="Empréstimo"
          class="brad-drag-and-drop__content"
          id="collapse-card-6"
        >
          <div
            class="brad-drag-and-drop__content-collapsed brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <div
              class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
            >
              <p class="brad-font-title-md">Empréstimo</p>
              <em
                class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"
              ></em>
            </div>
          </div>

          <div
            class="brad-drag-and-drop__content-expanded brad-card brad-card--default brad-p-lg brad-rounded-md"
          >
            <p class="brad-font-title-md brad-m-xs-b">Empréstimo</p>

            <p class="brad-font-paragraph-sm">
              Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```
## Collapse Mode - Multi Container

O exemplo completo do modo colapso com múltiplos containers foi movido para a área de templates. Ver template Drag And Drop Collapse.