# Drag And Drop — Bottom Sheet

Template que demonstra o uso do componente brad-drag-and-drop no modo padrão dentro de um brad-bottom-sheet no estado modal. Ideal para cenários mobile-first onde o usuário precisa reordenar itens em uma superfície sobreposta à tela.

O Bottom Sheet não utiliza CSS transform para posicionamento, portanto o drag and drop funciona sem necessidade de containingBlockSelector.

# Implementação
HTML
```
<button
class="brad-btn brad-btn-primary"
onclick="openBottomSheet()"
brad-aria-hidden-placer
>
Ordenar benefícios
</button>

<div id="bs-dnd" class="brad-bottom-sheet" role="dialog">
<div class="brad-bottom-sheet__header">
  <h2 class="brad-bottom-sheet__title brad-font-title-xl">
    Ordene os benefícios do nível com as setas
  </h2>
  <button
    class="brad-bottom-sheet__btn-close i icon-component-close-delete"
    aria-label="Fechar dialog"
    role="button"
    onclick="closeBottomSheet()"
  ></button>
</div>

<div class="brad-bottom-sheet__content brad-scrollbar">
  <p class="brad-font-paragraph-md brad-text-color-neutral-60 brad-m-sm-b">
    A ordem definida é exibida para o cliente.
  </p>

  <div id="dragAndDropId" class="brad-drag-and-drop">
    <div
      name="Benefícios"
      class="brad-drag-and-drop__container brad-flex brad-flex-column"
      data-draggable="true"
    >
      <div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
        <div name="Cesta de serviço" class="brad-drag-and-drop__content" id="card-1">
          <div class="brad-drag-and-drop__content-collapsed brad-card brad-card--default brad-p-lg brad-rounded-md">
            <div class="brad-flex brad-flex-justify-content-between brad-flex-align-items-center">
              <p class="brad-font-title-md">Cesta de serviço</p>
              <em class="icon-ui-drag brad-text-color-cta brad-icon-size-xxs"></em>
            </div>
          </div>
          <div class="brad-drag-and-drop__content-expanded brad-card brad-card--default brad-p-lg brad-rounded-md">
            <p class="brad-font-title-md brad-m-xs-b">Cesta de serviço</p>
            <p class="brad-font-paragraph-sm">50% de isenção.</p>
            <p class="brad-font-paragraph-xs brad-text-color-neutral-60">A partir de R$ 75 mil investidos</p>
          </div>
        </div>
      </div>
      <!-- mais cards ... -->
    </div>
  </div>
</div>
</div>
```
JavaScript
```
const bottomSheetService = BradBottomSheetService.getInstance({
targetSelector: '#bs-dnd',
state: 'modal',
});

const dndService = BradDragAndDropService.getInstance({
targetSelector: '#dragAndDropId',
dropCallback: (e) => {
  dndService.moveFromTo(e.coordDragging, e.coordSelected);
},
});

function openBottomSheet() {
bottomSheetService.open();
}

function closeBottomSheet() {
bottomSheetService.close();
}
```
## Comportamento Javascript

O Bottom Sheet usa position: fixed sem transform, portanto não é necessário informar containingBlockSelector ao instanciar o drag and drop.

# O fluxo de interação segue:

## Botão abre o Bottom Sheet via service.open()
Dentro do Bottom Sheet, o drag and drop permite reordenação arrastando os cards diretamente
Ao finalizar, o botão de fechar chama service.close()
Exemplo
```
<button
  class="brad-btn brad-btn-primary brad-m-md"
  onclick="window['openBsDnd_bs-dnd-387']()"
  brad-aria-hidden-placer
>
  Ordenar benefícios
</button>

<div id="bs-dnd-387" class="brad-bottom-sheet" role="dialog">
  <div class="brad-bottom-sheet__header">
    <h2 class="brad-bottom-sheet__title brad-font-title-xl">
      Ordene os benefícios do nível com as setas
    </h2>
    <button
      class="brad-bottom-sheet__btn-close i icon-component-close-delete"
      aria-label="Fechar dialog"
      role="button"
      onclick="window['closeBsDnd_bs-dnd-387']()"
    ></button>
  </div>

  <div class="brad-bottom-sheet__content brad-scrollbar">
    <p
      class="brad-font-paragraph-md brad-text-color-neutral-60 brad-m-sm-b"
    >
      A ordem definida é exibida para o cliente.
    </p>

    <div id="drag-bs-226" class="brad-drag-and-drop">
      <div
        name="Benefícios"
        class="brad-drag-and-drop__container brad-flex brad-flex-column"
        data-draggable="true"
      >
        
<div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
  <div
    name="Cesta de serviço"
    class="brad-drag-and-drop__content"
    id="bs-card-1"
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
    id="bs-card-2"
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
    id="bs-card-3"
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
    id="bs-card-4"
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
    id="bs-card-5"
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
    id="bs-card-6"
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
```
## Copy code