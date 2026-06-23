# CalendarMobile

Template para seleção de datas através do uso do modal, que será usado para mobile. Componentes utilizados são o text-field, modal, calendar(em modo lista) e botão.
.

# Uso do HTML
```
<!--Text field-->
<label id="text-field0" class="brad-text-field  brad-m-md-b">
  <input aria-label="Campo de texto" class="" type="text" value="" maxlength="10" placeholder="Escolha a data" />
  <small aria-hidden="true" class="placeholder-label-field">Label text</small>
  <em class="validation-icon complements"></em>
  <button aria-label="Clique para escolher a data" class="trailing-icon-interactive complements" onclick="openCalendarModal()">
    <em class="icon-ui-calendar"></em>
  </button>
  <span class="helper-text">Campo de data</span>
  <div class="brad-text-field--background"></div>
</label>
<!--Modal-->
<div id="modal" class="brad-modal brad-calendar-mobile brad-calendar-mobile--extra-info brad-p-none" role="dialog" aria-modal="true" tabindex="-1">
  <div class="brad-flex brad-flex-justify-content-between brad-p-xl-t brad-p-xxl-x">
    <p tabindex="0" class="brad-font-title-lg">Title</p>
    <em class="brad-modal__close" onclick="closeCalendarModal();" aria-label="Fechar modal" role="button" tabindex="0"></em>
  </div>

  <p tabindex="0" class="brad-calendar-mobile__subtitle brad-font-paragraph-md brad-p-xxl-x">Subtitle</p>

  <!--Calendar-->
  <div class="brad-calendar brad-calendar--modal" id="calendar1">
    <div class="brad-calendar__ui-select">
      <button class="brad-btn brad-btn-text brad-calendar__btn-year">
        <span>Button</span>
        <em class="brad-btn--icons-right i icon-ui-chevron-down"></em>
      </button>
      <button class="brad-btn brad-btn-text brad-calendar__btn-month">
        <span>Button</span>
        <em class="brad-btn--icons-right i icon-ui-chevron-down"></em>
      </button>
    </div>
    <hr class="brad-calendar__dividing-line brad-shadow-10" aria-hidden="true" />
    <div class="brad-calendar__content">
      <div class="brad-calendar__weekdays brad-calendar__row" aria-hidden="true">
        <div class="brad-calendar__cell">D</div>
        <div class="brad-calendar__cell">S</div>
        <div class="brad-calendar__cell">T</div>
        <div class="brad-calendar__cell">Q</div>
        <div class="brad-calendar__cell">Q</div>
        <div class="brad-calendar__cell">S</div>
        <div class="brad-calendar__cell">S</div>
      </div>
      <div class="brad-calendar__sheets"></div>
    </div>
    <div class="brad-calendar__ui-nav">
      <button class="brad-btn brad-btn-icon brad-btn-icon--on-color brad-calendar__btn-prev">
        <em class="btn-icon i icon-ui-chevron-left"></em>
      </button>
      <button class="brad-btn brad-btn-icon brad-btn-icon--on-color brad-calendar__btn-next">
        <em class="btn-icon i icon-ui-chevron-right"></em>
      </button>
    </div>
  </div>

  <!--Footer do modal-->
  <div class="footer brad-p-xxl brad-shadow-0">
    <div class="info brad-m-md-b">
      <p tabindex="0" class="brad-font-paragraph-md brad-text-color-neutral-60 brad-m-xs-b">Data(s) selecionada(s)</p>
      <p tabindex="0" class="brad-font-title-md brad-text-color-neutral-60"><span class="brad-text-color-neutral-100">00/00/0000</span> a <span class="brad-text-color-neutral-100">00/00/0000</span></p>
    </div>
    <div class="brad-flex brad-flex-justify-content-end brad-flex-align-items-center">
      <button class="clear-bt brad-btn brad-btn-text brad-m-xs-r">Limpar seleção</button>
      <button class="confirm-bt brad-btn brad-btn-primary brad-btn-primary--md">Confirmar seleção</button>
    </div>
  </div>
</div>
Copy
```


# Javascript
Inicialização e lógica do template
```
let idTextField = "text-field0";
let idModal = "modal";
let idCalendar = "calendar1";
let withInterval = true;
let values = [];
let serviceModal;
let serviceCalendar;
let buttonClear;
let buttonConfirm;
let textField;
let separatorInterval = " - ";

initModal();
initCalendar();
setupTextField();
setupExtraInfo();
setEnabledButton(false, buttonClear);
setEnabledButton(false, buttonConfirm);

buttonClear.onclick = () => {
  setDateCalendar([]);
  clearExtraInfos();
  serviceCalendar.calendarYearButtonElement.focus();
};

buttonConfirm.onclick = () => {
  confirmDate(values);
  serviceModal.close();
};

function initModal() {
  const targetSelector = "#" + idModal;
  const optionsModal = { targetSelector };
  serviceModal = LiquidCorp.BradModalService.getInstance(optionsModal);

  buttonClear = document.querySelector(targetSelector + " .footer .clear-bt");
  buttonConfirm = document.querySelector(targetSelector + " .footer .confirm-bt");
}

function initCalendar() {
  const optionsCalendar = {
    targetSelector: "#" + idCalendar,
    date: new Date(),
    type: "day",
    calendarDayWithInterval: withInterval,
    listMode: true,
    addClickEventOnCell: (e) => {
      if (e.type == "day") {
        clearExtraInfos();
        setExtraInfos(e.values);
      }
    },
  };
  serviceCalendar = LiquidCorp.BradCalendarService.getInstance(optionsCalendar);
  serviceCalendar.buildCalendar();
}

function setupTextField() {
  textField = document.querySelector("#" + idTextField + " input");
  textField.setAttribute("maxlength", withInterval ? 20 + separatorInterval.length : 10);
  textField.addEventListener("input", (event) => {
    if (event.inputType == "insertText") {
      let input = event.target;
      insertLogicInput(input);
    }
  });
}

function setupExtraInfo() {
  const modal = document.querySelector(serviceModal.targetSelector);
  modal.classList.remove("brad-calendar-mobile--extra-info");
  if (withInterval) {
    modal.classList.add("brad-calendar-mobile--extra-info");
  }
}

function setEnabledButton(isEnabled, bt) {
  bt.setAttribute("disabled", true);
  if (isEnabled) {
    bt.removeAttribute("disabled");
  }
}

function openCalendarModal() {
  if (window.innerWidth <= 576) {
    serviceModal.open();
    let fieldText = document.querySelector("#" + idTextField + " input");

    let splitValue = fieldText.value.split(separatorInterval);
    let dates = [];
    splitValue.forEach((value) => {
      const splitDate = value.split("/");
      if (splitDate.length == 3) dates.push(new Date(splitDate[2], splitDate[1] - 1, splitDate[0]));
    });

    setEnabledButton(dates.length !== 0, buttonClear);
    setEnabledButton(dates.length !== 0, buttonConfirm);
    setDateCalendar(dates);
    setExtraInfos(dates);
  }
}

function closeCalendarModal() {
  serviceModal.close();
}

function setDateCalendar(dates) {
  serviceCalendar.setSelectedDates(dates);
  const dateToRefresh = dates.length == 0 ? new Date() : dates[0];
  serviceCalendar.refreshToDate(dateToRefresh);
}

function setExtraInfos(vals) {
  let infos = document.querySelectorAll(serviceModal.targetSelector + " .info span");
  if (infos) {
    values = vals;
    values.forEach((date, index) => {
      infos[index].innerHTML = date.toLocaleDateString("pt-br");
    });

    if (values.length == 1) {
      setEnabledButton(true, buttonClear);
      setEnabledButton(!withInterval, buttonConfirm);
    }
    if (values.length == 2) {
      setEnabledButton(true, buttonClear);
      setEnabledButton(true, buttonConfirm);
    }
  }
}

function clearExtraInfos() {
  values = [];
  let infos = document.querySelectorAll(serviceModal.targetSelector + " .info span");
  if (infos) {
    infos[0].innerHTML = "00/00/0000";
    infos[1].innerHTML = "00/00/0000";
  }
  setEnabledButton(false, buttonClear);
  setEnabledButton(false, buttonConfirm);
}

function confirmDate(v) {
  let fieldText = document.querySelector("#" + idTextField + " input");
  fieldText.value = "";
  v.forEach((date, index) => {
    fieldText.value += index == 1 ? separatorInterval + date.toLocaleDateString("pt-br") : date.toLocaleDateString("pt-br");
  });
}

function insertLogicInput(input) {
  input.value = maskDate(input.value);
}

function maskDate(v) {
  let firstDate = v.substring(0, 10);
  firstDate = firstDate.replace(/\D/g, "");
  firstDate = firstDate.replace(/(\d{2})(\d)/, "$1/$2");
  firstDate = firstDate.replace(/(\d{2})(\d)/, "$1/$2");

  if (firstDate.length == 10 && withInterval) {
    firstDate += separatorInterval;
  }
  let secondDate = v.substring(10);
  secondDate = secondDate.replace(/\D/g, "");
  secondDate = secondDate.replace(/(\d{2})(\d)/, "$1/$2");
  secondDate = secondDate.replace(/(\d{2})(\d)/, "$1/$2");

  let result = "";
  result = firstDate + secondDate;

  return result;
}

window.addEventListener("resize", modalResponsivity);

function modalResponsivity() {
  if (window.innerWidth > 576) {
    serviceModal.close();
  }
}
Copy
```

| Método | Parâmetros | Descrição |
| --- | --- | --- |
| initModal | - | Inicia a instancia do modal, serviceModal. |
| initCalendar | - | Inicia a instancia do calendar, serviceCalendar |
| setupExtraInfo | - | Caso withInterval é true, é adicionado o "extra info" que é a informação de início e fim de data no modal, caso contrário ele remove |
| setEnabledButton | bool, html element | Função que permite habilitar ou desabilitar um botão |
| openCalendarModal | - | Abre o modal, caso tiver data preenchida no text-field, iniciará marcado no calendar |
| closeCalendarModal | - | Fecha o modal |
| setExtraInfos | [Date] | Coloca as informações extras dentro do modal, data de inicio e data de fim, no parâmetro pode conter 1 ou 2 instancias de Date no array |
| confirmDate | [Date] | Coloca a informação no text-field a data escolhida, no parâmetro pode conter 1 ou 2 instancias de Date no array |
| modalResponsivity | - | Delimita o aparecimento do modal para resoluções de até 576px |
| setDateCalendar | [Date] | Atualiza o calendar através do array de instancias de Date, podendo ser vazio ou contendo 1 ou 2 Date |
| maskDate | string | Mascara de data, se withInterval é false ficará dd/mm/yyyy, caso contrário ficará dd/mm/yyyy - dd/mm/yyyy |

# Obervações

Para que não tenha o title ou subtitle basta remover as tags "p" html. Mas no caso do title é necessário mudar a classe do pai de "brad-flex-justify-content-between" para "brad-flex-justify-content-end" para o botão fechar ficar alinhado a direita. Pode ser conferido no no final desta documentação.

# Responsividade

Este template é para uso em plataformas mobile, portanto o modal ele aparece apenas em resoluções de até 576px.

# Acessibilidade

Este template já contempla a leitura aos leitores de tela, sendo possível customizar a leitura de alguns elementos como textfield ou modal.

# Exemplo
```
<label id="text-field-54" class="brad-text-field  brad-m-md-b">
    <input
      aria-label="Campo de texto"
      class=""
      type="text"
      value=""
      maxlength="10"
      placeholder="Escolha a data"
    />
    <small aria-hidden="true" class="placeholder-label-field"
      >Label text</small
    >
    <em class="validation-icon complements"></em>
    <button
      aria-label="Clique para escolher a data"
      class="trailing-icon-interactive complements"
      onclick="openCalendarModal()"
    >
      <em class="icon-ui-calendar"></em>
    </button>
    <span class="helper-text">Campo de data</span>
    <div class="brad-text-field--background"></div>
  </label>

  <div
    id="modal-35"
    class="brad-modal brad-calendar-mobile brad-calendar-mobile--extra-info brad-p-none"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
  class="brad-flex brad-flex-justify-content-between brad-p-xl-t brad-p-xxl-x"
>
  <p tabindex="0" class="brad-font-title-lg">Title</p>
  <em
    class="brad-modal__close"
    onclick="closeCalendarModal();"
    aria-label="Fechar modal"
    role="button"
    tabindex="0"
  ></em>
</div> <p
      tabindex="0"
      class="brad-calendar-mobile__subtitle brad-font-paragraph-md brad-p-xxl-x"
    >
      Subtitle
    </p>

    <div class="brad-calendar brad-calendar--modal" id="calendar-336">
      <div class="brad-calendar__ui-select">
        <button class="brad-btn brad-btn-text brad-calendar__btn-year">
          <span>Button</span>
          <em class="brad-btn--icons-right i icon-ui-chevron-down"></em>
        </button>
        <button class="brad-btn brad-btn-text brad-calendar__btn-month">
          <span>Button</span>
          <em class="brad-btn--icons-right i icon-ui-chevron-down"></em>
        </button>
      </div>
      <hr
        class="brad-calendar__dividing-line brad-shadow-10"
        aria-hidden="true"
      />
      <div class="brad-calendar__content">
        <div
          class="brad-calendar__weekdays brad-calendar__row"
          aria-hidden="true"
        >
          <div class="brad-calendar__cell">D</div>
          <div class="brad-calendar__cell">S</div>
          <div class="brad-calendar__cell">T</div>
          <div class="brad-calendar__cell">Q</div>
          <div class="brad-calendar__cell">Q</div>
          <div class="brad-calendar__cell">S</div>
          <div class="brad-calendar__cell">S</div>
        </div>
        <div class="brad-calendar__sheets"></div>
      </div>
      <div class="brad-calendar__ui-nav">
        <button
          class="brad-btn brad-btn-icon brad-btn-icon--on-color brad-calendar__btn-prev"
        >
          <em class="btn-icon i icon-ui-chevron-left"></em>
        </button>
        <button
          class="brad-btn brad-btn-icon brad-btn-icon--on-color brad-calendar__btn-next"
        >
          <em class="btn-icon i icon-ui-chevron-right"></em>
        </button>
      </div>
    </div>

    <div class="footer brad-p-xxl brad-shadow-0">
      <div class="info brad-m-md-b">
        <p
          tabindex="0"
          class="brad-font-paragraph-md brad-text-color-neutral-60 brad-m-xs-b"
        >
          Data(s) selecionada(s)
        </p>
        <p tabindex="0" class="brad-font-title-md brad-text-color-neutral-60">
          <span class="brad-text-color-neutral-100">00/00/0000</span> a
          <span class="brad-text-color-neutral-100">00/00/0000</span>
        </p>
      </div>
      <div
        class="brad-flex brad-flex-justify-content-end brad-flex-align-items-center"
      >
        <button class="clear-bt brad-btn brad-btn-text brad-m-xs-r">
          Limpar seleção
        </button>
        <button
          class="confirm-bt brad-btn brad-btn-primary brad-btn-primary--md"
        >
          Confirmar seleção
        </button>
      </div>
    </div>
  </div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| title | Titulo string |  |  |
| subTitle | Subtitulo string |  |  |
| withInterval | Intervalo entre duas datas boolean |  | Choose option... true false |