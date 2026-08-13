# Drag And Drop Collapse

Este é um template de exemplo que demonstra como utilizar o componente brad-drag-and-drop em modo collapse para organização de favoritos e serviços. O template implementa duas seções independentes com suporte a reordenação em tempo real e animações suaves.

O componente brad-drag-and-drop é flexível e pode ser adaptado para diversas necessidades de interface, incluindo:

## Organização de favoritos com múltiplas seções

## Personalização de serviços por usuário

## Reordenação de listas com feedback visual

## Drag and drop com animações morphing

## Multi-container com sincronização automática

# Implementação
HTML
```
<section>
<div>
  <h1 class="brad-font-title-lg">Personalize seus Favoritos</h1>
  <p class="brad-font-paragraph-md brad-text-color-neutral-60 brad-m-sm-b">
    Arraste e organize seus serviços favoritos na ordem que preferir.
  </p>
</div>

<div id="dragAndDropId" class="brad-drag-and-drop">
  <p class="brad-font-title-md brad-m-xs-b">Principais</p>
  <div
    name="Principais"
    class="brad-drag-and-drop__container brad-flex brad-flex-column"
    data-draggable="true"
  >
    <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
      <div
        name="Serviço 1"
        class="brad-drag-and-drop__content"
        id="card-1"
      >
        <!-- Content Collapsed -->
        <div
          class="brad-drag-and-drop__content-collapsed brad-card brad-card--default brad-p-lg brad-rounded-md"
        >
          <div
            class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center"
          >
            <p class="brad-font-title-md">Serviço 1</p>
            <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
          </div>
        </div>

        <!-- Content Expanded -->
        <div
          class="brad-drag-and-drop__content-expanded brad-card brad-card--default brad-p-lg brad-rounded-md"
        >
          <p class="brad-font-title-md brad-m-xs-b">Serviço 1</p>
          <p class="brad-font-paragraph-sm">
            Descrição do serviço com detalhes completos...
          </p>
        </div>
      </div>
    </div>
  </div>

  <p class="brad-font-title-md brad-m-xs-b">Outros Serviços</p>
  <div
    name="Outros Serviços"
    class="brad-drag-and-drop__container brad-flex brad-flex-column"
    data-draggable="true"
  >
    <!-- Mais cards aqui -->
  </div>
</div>
</section>
```
JavaScript
```
const options = {
  targetSelector: '#dragAndDropId',
  useModeCollapse: true,
  dropCallback: (e) => {
    service.moveFromTo(e.coordDragging, e.coordSelected);
  },
};

const service = BradDragAndDropService.getInstance(options);
```
## Comportamento Javascript

O template utiliza o serviço BradDragAndDropService para gerenciar o ciclo completo de drag and drop. O modo collapse ativa automaticamente:

## Long Press (300ms): Inicia o ciclo com ripple visual
Colapso: Todos os cards (exceto o arrastado) colapsam suavemente
Arrasto: Card segue o mouse com sombra elevada
Live Preview: Cards são reordenados em tempo real conforme o movimento
Drop: Card retorna à posição final com animação
Expansão: Cards expandem suavemente com transição morphing
Estados Visuais
brad-drag-and-drop__content-collapsed: Exibido durante o arrasto (apenas título + ícone)
brad-drag-and-drop__content-expanded: Estado padrão (título + descrição)
## Sincronização Multi-Container

Quando elementos são movidos entre diferentes containers, a sincronização de slots é essencial. Este código gerencia a limpeza de slots vazios e garante que um slot vazio sempre exista ao final de cada container:

```
const syncContainerSlots = (ci) => {
  const containerArr = service.containers[ci];
  const containerEl = document
    .querySelector(targetSelector)
    .querySelectorAll('.brad-drag-and-drop__container')[ci];

  while (
    containerArr.length > 0 &&
    containerArr[containerArr.length - 1] === null
  ) {
    containerArr.pop();
  }
  containerArr.push(null);

  const allSlots = Array.from(
    containerEl.querySelectorAll('.brad-drag-and-drop__slot')
  );

  allSlots.slice(containerArr.length).forEach((slot) => slot.remove());

  if (allSlots.length < containerArr.length) {
    const sentinel = document.createElement('div');
    sentinel.className =
      'brad-drag-and-drop__slot brad-rounded-md brad-m-xs';
    containerEl.appendChild(sentinel);
  }

  Array.from(
    containerEl.querySelectorAll('.brad-drag-and-drop__slot')
  ).forEach((slot, si) => {
    slot.dataset.index = si;
    if (!containerArr[si]) {
      slot.style.width = null;
      slot.style.height = null;
      slot.style.minWidth = null;
      slot.style.minHeight = null;
      slot.classList.remove('brad-drag-and-drop__slot--ghost');
    }
  });
};

const options = {
  targetSelector,
  useModeCollapse: true,
  dropCallback: (e) => {
    const fromIdx = Number(e.coordDragging.indexContainer);
    const toIdx = Number(e.coordSelected.indexContainer);

    service.moveFromTo(e.coordDragging, e.coordSelected);

    if (fromIdx !== toIdx) {
      setTimeout(() => {
        syncContainerSlots(fromIdx);
        syncContainerSlots(toIdx);
      }, 900);
    }
  },
};

service = BradDragAndDropService.getInstance(options);
```
Exemplo
```
<section>
  <div>
    <h1 class="brad-font-title-lg">Personalize seus Favoritos</h1>
    <p
      class="brad-font-paragraph-md brad-text-color-neutral-60 brad-m-sm-b"
    >
      Arraste e organize seus serviços favoritos na ordem que preferir.
    </p>
  </div>

  <div id="dragAndDrop-collapse-template-264" class="brad-drag-and-drop">
    <p class="brad-font-title-md brad-m-xs-b">Principais</p>
    <div
      name="Principais"
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
    <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"></div>
    </div>

    <p class="brad-font-title-md brad-m-xs-b">Outros Serviços</p>
    <div
      name="Outros Serviços"
      class="brad-drag-and-drop__container brad-flex brad-flex-column"
      data-draggable="true"
    >
      
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
    <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs"></div>
    </div>
  </div>
</section>
```
Classes Principais
Componente
brad-drag-and-drop: Elemento raiz do componente
brad-drag-and-drop__container: Container de um grupo de cards (suporta múltiplos)
brad-drag-and-drop__slot: Espaço individual para cada card
brad-drag-and-drop__content: Wrapper do conteúdo do card
brad-drag-and-drop__content-collapsed: Conteúdo na visualização colapsada
brad-drag-and-drop__content-expanded: Conteúdo na visualização expandida
## Design System

## Utilize classes do design system para estilizar o container:

## brad-font-title-lg: Título principal
brad-font-paragraph-md: Descrição/parágrafo
brad-text-color-neutral-60: Cor de texto secundária
brad-m-sm-b: Margem inferior pequena
brad-m-xs-b: Margem inferior extra pequena
brad-card: Card padrão
brad-p-lg: Padding grande
brad-rounded-md: Border radius médio
brad-flex, brad-flex-column: Flexbox utilities
## Multi-Container

O template suporta múltiplos containers independentes. Cada container:

## Pode receber cards de outros containers via drag
Sincroniza automaticamente seus ghost slots
Remove slots vazios desnecessários
Adiciona um slot vazio ao final quando necessário
Personalização
## Estrutura do Card

Customize o conteúdo editando os elementos content-collapsed e content-expanded:

```
<!-- Visualização colapsada: essencial -->
<div class="brad-drag-and-drop__content-collapsed">
<p class="brad-font-title-md">Título</p>
<em class="icon-ui-drag"></em>
</div>

<!-- Visualização expandida: conteúdo completo -->
<div class="brad-drag-and-drop__content-expanded">
<p class="brad-font-title-md">Título</p>
<p class="brad-font-paragraph-sm">Descrição com detalhes...</p>
</div>
```
## Classes do Design System

Combine classes do design system para ajustar o layout e espaçamento:

```
<section>
<div>
  <h1 class="brad-font-title-lg">Título</h1>
  <p class="brad-font-paragraph-md brad-text-color-neutral-60 brad-m-sm-b">
    Descrição
  </p>
</div>
</section>
```