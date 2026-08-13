# Conclusion

A tela de conclusão é utilizada no final de jornadas, com ações de compartilhamento ou saída.

# Uso do template
```
<div class="brad-conclusion-screen">
  <div class="brad-conclusion-screen__container brad-flex brad-flex-column">
    <div class="brad-conclusion-screen__content">
      <div
        class="brad-conclusion-screen__slot brad-flex brad-flex-justify-content-center"
      >
        <img
          class="brad-illustration__content brad-illustration__content--pagamentos-suc-pagamento-concluido"
        />
      </div>

      <div class="brad-flex brad-flex-column brad-flex-align-items-center">
        <h2
          class="brad-conclusion-screen__title brad-font-title-md brad-text-color-neutral-0 brad-m-xs-t"
        >
          Title
        </h2>

        <p
          class="brad-conclusion-screen__description brad-font-paragraph-sm brad-text-color-neutral-0 brad-m-xs-t"
        >
          Description
        </p>
      </div>
    </div>
  </div>

  <div
    id="bsEl"
    class="brad-bottom-sheet brad-p-xxl-x brad-p-xl-y"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="brad-list-item brad-list-item--line-bottom brad-p-md-y brad-flex brad-flex-align-items-center"
    >
      <div class="brad-conclusion-screen__btn-icon brad-m-xs-r">
        <em
          class="icon-ui-share brad-text-color-primary brad-icon-size-sm"
        ></em>
      </div>

      <p class="brad-font-title-md brad-color-neutral-100">Botão 1</p>

      <div class="brad-conclusion-screen__btn-action brad-m-xs-l">
        <em
          class="icon-ui-chevron-right brad-text-color-alert-info brad-icon-size-sm"
        ></em>
      </div>
    </div>
  </div>
</div>
Copy
```
Comportamento Javascript
```
const bottomSheetId = `bs-${GenericUtils.getMaxRandom(1000)}`;

const service = BradBottomSheetService.getInstance({
  targetSelector: `#${bottomSheetId}`,
  state: "fixed",
});

service.open();
Copy
```
## Script para conteúdo com scroll

Em caso do conteúdo ultrapassar o limite da tela, pode ser aplicada esta lógica em JavaScript para garantir que o conteúdo apresente barra de rolagem e seja visível.

```
function handlePageContentPadding(bottomEl, container) {
  bottomEl = bottomEl.getBoundingClientRect().height;
  container.style.paddingBottom = `${bottomEl + 50}px`;
}

function resetPageContentPadding(container) {
  container.style.paddingBottom = "0px";
}

function validateIfTextUnderneath(container, bottomEl) {
  container = container.getBoundingClientRect().bottom;
  bottomEl = bottomEl.getBoundingClientRect().top;
  const calcDiff = container - bottomEl;

  if (calcDiff <= 0 && calcDiff > -10) {
    return true;
  }

  return container > bottomEl;
}

function updateElementScroll() {
  const bottomButtons = document.getElementById(bottomSheetId);
  const topElement = document.querySelector(".brad-conclusion-screen__content");

  resetPageContentPadding(topElement);

  if (validateIfTextUnderneath(topElement, bottomButtons)) {
    handlePageContentPadding(bottomButtons, topElement);
  } else {
    resetPageContentPadding(topElement);
  }
}

window.addEventListener("resize", () => updateElementScroll());
Copy
```

Combinado com o bottomSheet poderia ser usado da seguinte maneira:

```
const bottomSheetId = `bs-${GenericUtils.getMaxRandom(1000)}`;

function handlePageContentPadding(bottomEl, container) {
  bottomEl = bottomEl.getBoundingClientRect().height;
  container.style.paddingBottom = `${bottomEl + 50}px`;
}

function resetPageContentPadding(container) {
  container.style.paddingBottom = "0px";
}

function validateIfTextUnderneath(container, bottomEl) {
  container = container.getBoundingClientRect().bottom;
  bottomEl = bottomEl.getBoundingClientRect().top;
  const calcDiff = container - bottomEl;

  if (calcDiff <= 0 && calcDiff > -10) {
    return true;
  }

  return container > bottomEl;
}

function updateElementScroll() {
  const bottomButtons = document.getElementById(bottomSheetId);
  const topElement = document.querySelector(".brad-conclusion-screen__content");

  resetPageContentPadding(topElement);

  if (validateIfTextUnderneath(topElement, bottomButtons)) {
    handlePageContentPadding(bottomButtons, topElement);
  } else {
    resetPageContentPadding(topElement);
  }
}

const service = BradBottomSheetService.getInstance({
  targetSelector: `#${bottomSheetId}`,
  state: "fixed",
});

service.eBottomSheet.addEventListener("opened", (e) => {
  setTimeout(() => {
    updateElementScroll();
  }, 550);
});

service.open();
window.addEventListener("resize", () => updateElementScroll());
Copy
```
Exemplo
```
<div class="brad-conclusion-template">
  <div class="brad-conclusion-template__container brad-flex brad-flex-column">
    <div class="brad-conclusion-template__content">
      <div
        class="brad-conclusion-template__slot brad-flex brad-flex-justify-content-center"
      >
        <img class="brad-illustration__content brad-illustration__content--pagamentos-suc-pagamento-concluido" />
      </div>

      <div class="brad-flex brad-flex-column brad-flex-align-items-center">
        <h2
          class="brad-conclusion-template__title brad-font-title-md brad-text-color-on-bg-primary brad-m-xs-t"
        >
          Pix concluído
        </h2>

        <p
          class="brad-conclusion-template__description brad-font-paragraph-sm brad-text-color-on-bg-primary brad-m-xs-t"
        >
          Deu tudo certo com a transação de R$400.000,00
        </p>
      </div>
    </div>
  </div>

  <div
    id="bs-218"
    class="brad-bottom-sheet brad-p-xxl-x brad-p-xl-y"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="brad-list-item brad-list-item--line-bottom brad-p-md-y brad-flex brad-flex-align-items-center"
    >
      <div class="brad-conclusion-template__btn-icon brad-m-xs-r">
        <em
          class="icon-ui-share brad-text-color-primary brad-icon-size-sm"
        ></em>
      </div>

      <p class="brad-font-title-sm brad-color-neutral-100">
        Compartilhar comprovante
      </p>

      <div class="brad-conclusion-template__btn-action brad-m-xs-l">
        <em
          class="icon-ui-chevron-right brad-text-color-alert-info brad-icon-size-sm"
        ></em>
      </div>
    </div>

    <div
      class="brad-list-item brad-list-item--line-bottom brad-p-md-y brad-flex brad-flex-align-items-center"
    >
      <div class="brad-conclusion-template__btn-icon brad-m-xs-r">
        <em
          class="icon-pix-logo brad-text-color-primary brad-icon-size-sm"
        ></em>
      </div>

      <p class="brad-font-title-sm brad-color-neutral-100">Fazer outro Pix</p>

      <div class="brad-conclusion-template__btn-action brad-m-xs-l">
        <em
          class="icon-ui-chevron-right brad-text-color-alert-info brad-icon-size-sm"
        ></em>
      </div>
    </div>

    <div
      class="brad-list-item brad-p-md-y brad-flex brad-flex-align-items-center"
    >
      <div class="brad-conclusion-template__btn-icon brad-m-xs-r">
        <em
          class="icon-navigation-home brad-text-color-primary brad-icon-size-sm"
        ></em>
      </div>

      <p class="brad-font-title-sm brad-color-neutral-100">Voltar para Home</p>

      <div class="brad-conclusion-template__btn-action brad-m-xs-l">
        <em
          class="icon-ui-chevron-right brad-text-color-alert-info brad-icon-size-sm"
        ></em>
      </div>
    </div>
  </div>
</div>
```