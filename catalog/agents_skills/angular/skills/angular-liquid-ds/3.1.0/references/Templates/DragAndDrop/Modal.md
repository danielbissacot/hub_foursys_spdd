# Drag And Drop — Modal

Template que demonstra o uso do componente brad-drag-and-drop no modo padrão dentro de um brad-modal. Cenário ideal para desktop onde o usuário reordena itens em uma janela centralizada sobre o conteúdo da página.

O Modal utiliza CSS transform: translate(-50%, -50%) para centralização, o que cria um novo containing block para elementos com position: fixed. Por isso, é obrigatório informar containingBlockSelector apontando para o elemento do modal ao instanciar o drag and drop.

# Implementação
HTML
```
<button
class="brad-btn brad-btn-primary"
onclick="openModal()"
brad-aria-hidden-placer
>
Ordenar benefícios
</button>

<div
id="modal-dnd"
class="brad-modal"
role="dialog"
aria-modal="true"
tabindex="-1"
>
<em
  class="brad-modal__close"
  onclick="closeModal()"
  aria-label="Fechar modal"
  role="button"
></em>

<div class="brad-modal__content">
  <div class="brad-p-md">
    <h2 class="brad-font-title-lg brad-m-xs-b">
      Ordene os benefícios do nível com as setas
    </h2>

    <div id="dragAndDropId" class="brad-drag-and-drop">
      <div
        name="Benefícios"
        class="brad-drag-and-drop__container brad-flex brad-flex-column"
        data-draggable="true"
      >
        <!-- cards aqui -->
      </div>
    </div>
  </div>
</div>
</div>
```
JavaScript
```
const modalService = BradModalService.getInstance({
targetSelector: '#modal-dnd',
});

const dndService = BradDragAndDropService.getInstance({
targetSelector: '#dragAndDropId',
containingBlockSelector: '#modal-dnd',
dropCallback: (e) => {
  dndService.moveFromTo(e.coordDragging, e.coordSelected);
},
});

function openModal() {
modalService.open();
}

function closeModal() {
modalService.close();
}
```
## containingBlockSelector

O brad-modal usa transform: translate(-50%, -50%) para centralização em telas a partir de 577px. Segundo a especificação CSS, ancestrais com transform criam um novo containing block para elementos com position: fixed.

O drag and drop aplica position: fixed nos cards durante o arrasto (classe .dragging) e na animação de retorno (classe .autoMove). Sem a compensação, as coordenadas de viewport ficam deslocadas pelo offset do modal.

A propriedade containingBlockSelector resolve isso informando ao serviço qual elemento usar como referência para o cálculo de offset:

```
BradDragAndDropService.getInstance({
targetSelector: '#dragAndDropId',
containingBlockSelector: '#modal-dnd',
});
```

Quando informado, o serviço desconta automaticamente o getBoundingClientRect() do modal de todos os posicionamentos (followMouse, animate, startMoveContent).

Quando não informado, o comportamento é idêntico ao original (sem compensação) — garantindo retrocompatibilidade com cenários onde o DnD não está dentro de um elemento com transform.

# Comportamento Javascript
Botão abre o Modal via modalService.open()
Dentro do Modal, o drag and drop permite reordenação arrastando os cards diretamente
O containingBlockSelector garante que o posicionamento dos cards durante o arrasto seja correto dentro do modal
O botão de fechar (X) chama modalService.close()
Exemplo
```
<button
  class="brad-btn brad-btn-primary brad-m-md"
  onclick="window['openModalDnd_modal-dnd-182']()"
  brad-aria-hidden-placer
>
  Ordenar benefícios
</button>

<div
  id="modal-dnd-182"
  class="brad-modal"
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
  <em
    class="brad-modal__close"
    onclick="window['closeModalDnd_modal-dnd-182']()"
    aria-label="Fechar modal"
    role="button"
  ></em>

  <div class="brad-modal__content">
    <div class="brad-p-md">
      <h2 class="brad-font-title-lg brad-m-xs-b">
        Ordene os benefícios do nível com as setas
      </h2>
      <p
        class="brad-font-paragraph-md brad-text-color-neutral-60 brad-m-sm-b"
      >
        A ordem definida é exibida para o cliente.
      </p>

      <div id="drag-modal-143" class="brad-drag-and-drop">
        <div
          name="Benefícios"
          class="brad-drag-and-drop__container brad-flex brad-flex-column"
          data-draggable="true"
        >
          
<div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
  <div
    name="Cesta de serviço"
    class="brad-drag-and-drop__content"
    id="modal-card-1"
  >
    <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
      <div class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center">
        <div>
          <p class="brad-font-title-md">Cesta de serviço</p>
          <p class="brad-font-paragraph-sm brad-text-color-neutral-60">50% de isenção. A partir de R$ 75 mil investidos</p>
        </div>
        <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
      </div>
    </div>
  </div>
</div>
<div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
  <div
    name="Cheque especial"
    class="brad-drag-and-drop__content"
    id="modal-card-2"
  >
    <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
      <div class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center">
        <div>
          <p class="brad-font-title-md">Cheque especial</p>
          <p class="brad-font-paragraph-sm brad-text-color-neutral-60">10 dias sem juros. Ao abrir a conta</p>
        </div>
        <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
      </div>
    </div>
  </div>
</div>
<div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
  <div
    name="Veloe"
    class="brad-drag-and-drop__content"
    id="modal-card-3"
  >
    <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
      <div class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center">
        <div>
          <p class="brad-font-title-md">Veloe</p>
          <p class="brad-font-paragraph-sm brad-text-color-neutral-60">1 tag sem mensalidade. Gasto médio nos cartões a partir de 2 mil</p>
        </div>
        <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
      </div>
    </div>
  </div>
</div>
<div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
  <div
    name="Seguro de vida"
    class="brad-drag-and-drop__content"
    id="modal-card-4"
  >
    <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
      <div class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center">
        <div>
          <p class="brad-font-title-md">Seguro de vida</p>
          <p class="brad-font-paragraph-sm brad-text-color-neutral-60">Cobertura completa. Proteção para toda a família</p>
        </div>
        <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
      </div>
    </div>
  </div>
</div>
<div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
  <div
    name="Previdência privada"
    class="brad-drag-and-drop__content"
    id="modal-card-5"
  >
    <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
      <div class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center">
        <div>
          <p class="brad-font-title-md">Previdência privada</p>
          <p class="brad-font-paragraph-sm brad-text-color-neutral-60">Rentabilidade acima do CDI. Plano PGBL e VGBL</p>
        </div>
        <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
      </div>
    </div>
  </div>
</div>
<div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
  <div
    name="Consórcio"
    class="brad-drag-and-drop__content"
    id="modal-card-6"
  >
    <div class="brad-card brad-card--default brad-p-lg brad-rounded-md">
      <div class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center">
        <div>
          <p class="brad-font-title-md">Consórcio</p>
          <p class="brad-font-paragraph-sm brad-text-color-neutral-60">Sem juros, apenas taxa de administração. Contemplação por lance ou sorteio</p>
        </div>
        <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  </div>
</div>
```
## Copy code