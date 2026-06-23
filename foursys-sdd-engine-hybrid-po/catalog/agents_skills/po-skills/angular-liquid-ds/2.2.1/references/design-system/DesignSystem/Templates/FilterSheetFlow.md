# Filter com Bottom Sheet

Este é um template de exemplo que demonstra como usar o componente brad-filter em conjunto com o brad-bottom-sheet para criar um fluxo de filtragem interativo.

# Flexibilidade do Template

O componente brad-filter é, essencialmente, um botão com especificidades visuais e comportamentais voltadas para o contexto de filtragem. No entanto, ele não depende necessariamente de filtros para existir: pode ser utilizado em diferentes cenários onde se deseja um botão com aparência e feedback de filtro, mas que aciona qualquer tipo de conteúdo ou ação.

## Você pode compor o brad-filter para abrir:

## BottomSheets com filtros ou qualquer outro conteúdo
Menus customizados
Formulários dinâmicos
Listas de seleção
## Qualquer interface interativa

O visual do botão se adapta conforme o estado ou os dados passados para ele, permitindo que o mesmo componente seja reutilizado em múltiplos fluxos, não apenas para filtragem tradicional. O template apresentado demonstra um caso de uso comum, mas serve como base para diversas outras combinações e integrações.

# Implementação
HTML
```
<button
id="filterId"
class="brad-filter brad-filter--md"
onclick="window.handleFilter()"
>
<label aria-hidden="true">Filtragem</label>
<div aria-hidden="true" class="brad-filter__icon-area brad-flex">
  <em class="brad-filter__icon brad-filter__icon--single"></em>
</div>
</button>

<div
id="bottomSheetId"
class="brad-bottom-sheet"
role="dialog"
aria-modal="true"
tabindex="-1"
>
<div class="brad-bottom-sheet__header">
  <h2 class="brad-bottom-sheet__title brad-font-title-md">Filtrar período</h2>
  <button
    class="brad-bottom-sheet__btn-close i icon-component-close-delete"
    aria-label="Fechar dialog"
    role="button"
    onclick="handleCancelFilter()"
  ></button>
</div>
<div class="brad-bottom-sheet__content brad-scrollbar">
  <section class="brad-flex brad-gap-md">
      <div
        class="brad-chip brad-chip--md brad-m-sm-b brad-flex"
      >
        <input
          id="chip-10"
          type="radio"
          role="radio"
          name="group"
        />
        <label for="chip-10" class="checkmark" aria-hidden="true"
          >15 dias</label
        >
      </div>

      <div class="brad-chip brad-chip--md brad-flex">
        <input
          id="chip-30"
          type="radio"
          role="radio"
          name="group"
        />
        <label for="chip-30" class="checkmark" aria-hidden="true"
          >30 dias</label
        >
    </div>

    <div class="brad-chip brad-chip--md brad-flex">
        <input
          id="chip-60"
          type="radio"
          role="radio"
          name="group"
        />
        <label for="chip-60" class="checkmark" aria-hidden="true"
          >60 dias</label
        >
    </div>

    <div class="brad-chip brad-chip--md brad-flex">
        <input
          id="chip-90"
          type="radio"
          role="radio"
          name="group"
        />
        <label for="chip-90" class="checkmark" aria-hidden="true"
          >90 dias</label
        >
    </div>
  </section>

  <button class="brad-btn brad-btn-primary">Filtrar</button>

</div>
</div>
```
JavaScript
```
const filterId = 'filterId';
const bottomSheetId = 'bottomSheetId';
window.handleFilter = window.handleFilter || {};

setupFilterSheetFlow();
});

function setupFilterSheetFlow() {
const filterService = LiquidCorp.BradFilterService.getInstance({
targetSelector: `#${filterId}`,
type: "single",
});

const bottomSheetService = LiquidCorp.BradBottomSheetService.getInstance({
targetSelector: `#${bottomSheetId}`,
state: "modal",
});

window.handleFilter = () => {
filterService.rotateChevron(true);
bottomSheetService.open();
};

window.handleCancelFilter = () => {
filterService.rotateChevron(false);
bottomSheetService.close();
};

onFilterButtonClick(filterService, bottomSheetService);
}

function onFilterButtonClick(filterService, bottomSheetService) {
const confirmFilterElement = document.querySelector(
`#${bottomSheetId} .brad-btn-primary`
);

confirmFilterElement?.addEventListener("click", () => {
const value = getSelectedChipValue();
if (value) filterService.update(value, true);
filterService.rotateChevron(false);
bottomSheetService.close();
});
}

function getSelectedChipValue() {
const checkedInput = document.querySelector(
`#${bottomSheetId} input[type="radio"]:checked`
);

if (!checkedInput) return "";

const label = checkedInput.nextElementSibling;
return label ? label.textContent.trim() : "";
}
```
Exemplo
```
<button
  id="O449849653620"
  class="brad-filter brad-filter--md"
  onclick="window.handleFilter()"
>
  <label aria-hidden="true">Filtragem</label>
  <div aria-hidden="true" class="brad-filter__icon-area brad-flex">
    <em class="brad-filter__icon brad-filter__icon--single"></em>
  </div>
</button>

<div
  id="M688716788336"s
  class="brad-bottom-sheet"
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
  <div class="brad-bottom-sheet__header">
    <h2 class="brad-bottom-sheet__title brad-font-title-md">Filtrar período</h2>
    <button
      class="brad-bottom-sheet__btn-close i icon-component-close-delete"
      aria-label="Fechar dialog"
      role="button"
      onclick="handleCancelFilter()"
    ></button>
  </div>
  <div class="brad-bottom-sheet__content brad-scrollbar">
    <section class="brad-flex brad-gap-md">
        <div
          class="brad-chip brad-chip--md brad-m-sm-b brad-flex"
        >
          <input
            id="chip-10"
            type="radio"
            role="radio"
            name="group"
          />
          <label for="chip-10" class="checkmark" aria-hidden="true"
            >15 dias</label
          >
        </div>

        <div class="brad-chip brad-chip--md brad-flex">
          <input
            id="chip-30"
            type="radio"
            role="radio"
            name="group"
          />
          <label for="chip-30" class="checkmark" aria-hidden="true"
            >30 dias</label
          >
      </div>

      <div class="brad-chip brad-chip--md brad-flex">
          <input
            id="chip-60"
            type="radio"
            role="radio"
            name="group"
          />
          <label for="chip-60" class="checkmark" aria-hidden="true"
            >60 dias</label
          >
      </div>

      <div class="brad-chip brad-chip--md brad-flex">
          <input
            id="chip-90"
            type="radio"
            role="radio"
            name="group"
          />
          <label for="chip-90" class="checkmark" aria-hidden="true"
            >90 dias</label
          >
      </div>
    </section>

    <button class="brad-btn brad-btn-primary">Filtrar</button>
  </div>
</div>
```