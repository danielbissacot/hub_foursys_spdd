# Drag And Drop — Side Sheet

Template que demonstra o uso do componente brad-drag-and-drop no modo padrão dentro de um brad-side-sheet. Cenário ideal para painéis laterais onde o usuário pode reordenar itens enquanto mantém visibilidade do conteúdo principal.

O Side Sheet não utiliza CSS transform para posicionamento, portanto o drag and drop funciona sem necessidade de containingBlockSelector.

# Implementação
HTML
```
<button
class="brad-btn brad-btn-primary"
onclick="openSideSheet()"
brad-aria-hidden-placer
>
Ordenar benefícios
</button>

<p
id="ss-result"
aria-live="polite"
style="opacity: 0; position: absolute;"
></p>

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
const sideSheetService = BradSideSheetService.getInstance({
targetSelector: '#brad-side-sheet',
});

const dndService = BradDragAndDropService.getInstance({
targetSelector: '#dragAndDropId',
dropCallback: (e) => {
  dndService.moveFromTo(e.coordDragging, e.coordSelected);
},
});

function openSideSheet() {
sideSheetService.open();
}
```
## Comportamento Javascript

O Side Sheet usa position: fixed com left/right e transições CSS, sem transform no estado aberto. Isso significa que o drag and drop funciona nativamente sem compensação de offset.

# O fluxo de interação segue:

## Botão abre o Side Sheet via sideSheetService.open()
Dentro do painel lateral, o drag and drop permite reordenação arrastando os cards diretamente
Botão de fechar ou gesto de swipe encerra o Side Sheet
Exemplo
```
<button
  class="brad-btn brad-btn-primary brad-m-md"
  onclick="window['openSsDnd_ss-dnd-18']()"
  brad-aria-hidden-placer
>
  Ordenar benefícios
</button>

<p
  id="ss-dnd-18-result"
  aria-live="polite"
  style="opacity: 0; position: absolute;"
></p>

<div
  id="ss-dnd-18"
  class="brad-side-sheet brad-side-sheet--default above-the-overlay"
>
  <button
    aria-label="Fechar SideSheet"
    role="button"
    data-ss-close="ss-dnd-18"
    class="i icon-component-close-delete brad-side-sheet__close"
  ></button>

  <div class="brad-side-sheet__content" tabindex="0">
    <div class="brad-p-md">
      <h2 class="brad-font-title-lg brad-m-xs-b">
        Ordene os benefícios do nível com as setas
      </h2>
      <p
        class="brad-font-paragraph-md brad-text-color-neutral-60 brad-m-sm-b"
      >
        A ordem definida é exibida para o cliente.
      </p>

      <div id="drag-ss-415" class="brad-drag-and-drop">
        <div
          name="Benefícios"
          class="brad-drag-and-drop__container brad-flex brad-flex-column"
          data-draggable="true"
        >
          
<div class="brad-drag-and-drop__slot brad-rounded-md brad-m-xs">
  <div
    name="Cesta de serviço"
    class="brad-drag-and-drop__content"
    id="ss-card-1"
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
    id="ss-card-2"
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
    id="ss-card-3"
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
    id="ss-card-4"
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
    id="ss-card-5"
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
    id="ss-card-6"
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