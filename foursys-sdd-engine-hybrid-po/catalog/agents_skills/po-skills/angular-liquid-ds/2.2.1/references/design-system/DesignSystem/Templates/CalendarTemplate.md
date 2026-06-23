# CalendarTemplate

Template com a utilização do componente de input juntamente com o componente calendar.
.

## Template de apenas um input para escolha da data

# Uso do HTML

## Classe css obrigatória: "brad-input-calendar"

```
<div class="brad-input-calendar">
  <!--INPUT TEXT-->
  <label id="text-field0" class="brad-text-field  brad-m-md-b">
    <input aria-label="Campo de texto" class="" type="text" value="" maxlength="10" placeholder="dd/mm/yyyy" />
    <small aria-hidden="true" class="placeholder-label-field">Label text</small>
    <em class="validation-icon complements"></em>
    <button aria-label="Aria label" class="trailing-icon-interactive complements">
      <em class="icon-ui-calendar"></em>
    </button>
    <span class="helper-text">Helper text</span>
    <div class="brad-text-field--background"></div>
  </label>

  <!--CALENDARIO DENTRO DO CARD-->
  <div class="brad-card brad-card--default brad-p-lg">
    <div class="brad-calendar brad-calendar--day" id="calendar-template">
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
  </div>
</div>
Copy
```


# Comportamento Javascript
```
let service = LiquidCorp.BradCalendarService.getInstance({
  targetSelector: "#calendar-template",
  date: new Date(2023, 11),
  type: "day",
  calendarDayWithInterval: false,
  disableCalendarTypeChange: false,
  addClickEventOnCell: clickEventCalendar.bind(this),
});
service.buildCalendar();

let inputDate = document.querySelector("#text-field0 input");

inputDate.addEventListener("input", (event) => {
  if (event.inputType == "insertText") {
    let input = event.target;
    insertLogicInput(input);
  }
});

function insertLogicInput(input) {
  let old = input.selectionEnd;
  let onlyNumbers = input.value.replace(/\D/g, "");
  let valueArray = Array.from(onlyNumbers);

  input.value = maskDate(input.value);

  if (old < valueArray.length) {
    input.selectionEnd = old;
  }
  if (valueArray.length == 8) {
    let array = input.value.split("/");
    let date = new Date(array[2], array[1] - 1, array[0]);
    service.setType("day");
    service.setSelectedDates([date]);
    service.refreshToDate(date);
  }
}

function clickEventCalendar(e) {
  let inputDate = document.querySelector("#text-field0 input");
  inputDate.value = service.getSelectedDates()[0].toLocaleDateString("pt-br");
}

function maskDate(v) {
  v = v.replace(/\D/g, "");
  v = v.replace(/(\d{2})(\d)/, "$1/$2");
  v = v.replace(/(\d{2})(\d)/, "$1/$2");

  v = v.replace(/(\d{2})(\d{2})$/, "$1$2");
  return v;
}
Copy
```

## Template de apenas dois inputs para definição de intervalo

# Uso do HTML

## Classe css obrigatória: "brad-input-calendar"

Classe css opcional: "brad-inputs-align" serve apenas para alinhar os dois inputs

Data attribute para lógica para saber se é início ou final do intervalo "data-order" no input, valores "first" e "second".

```
<div class="brad-inputs-align">
  <div class="brad-input-calendar">
    <!--INPUT TEXT-->
    <label id="text-field1" class="brad-text-field  brad-m-md-b">
      <input id="input1" aria-label="Campo de texto" class="" type="text" value="" maxlength="10" placeholder="dd/mm/yyyy" data-order="first" />
      <small aria-hidden="true" class="placeholder-label-field">Label text</small>
      <em class="validation-icon complements"></em>
      <button aria-label="Aria label" class="trailing-icon-interactive complements">
        <em class="icon-ui-calendar"></em>
      </button>
      <span class="helper-text">Helper text</span>
      <div class="brad-text-field--background"></div>
    </label>

    <!--CALENDARIO DENTRO DO CARD-->
    <div class="brad-card brad-card--default brad-p-lg">
      <div class="brad-calendar brad-calendar--day" id="template-calendar">
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
    </div>
  </div>

  <div class="brad-input-calendar">
    <!--INPUT TEXT-->
    <label id="text-field2" class="brad-text-field  brad-m-md-b">
      <input aria-label="Campo de texto" class="" type="text" value="" maxlength="10" placeholder="dd/mm/yyyy" data-order="second" />
      <small aria-hidden="true" class="placeholder-label-field">Label text</small>
      <em class="validation-icon complements"></em>
      <button aria-label="Aria label" class="trailing-icon-interactive complements">
        <em class="icon-ui-calendar"></em>
      </button>
      <span class="helper-text">Helper text</span>
      <div class="brad-text-field--background"></div>
    </label>
  </div>
</div>
Copy
```


# Comportamento Javascript

## Parâmetros de inicialização utilizado:

# calendarDayWithInterval: true
## manualSelection: true

# Métodos utilizados:

## service.setInitialInterval(date)
service.setEndInterval(date)
```
let service = LiquidCorp.BradCalendarService.getInstance({
  targetSelector: "#template-calendar",
  date: new Date(2023, 11),
  type: "day",
  calendarDayWithInterval: true,
  manualSelection: true,
  disableCalendarTypeChange: false,
  addClickEventOnCell: clickEventCalendar.bind(this),
});

service.buildCalendar();

let calendar = service.getCalendar().parentNode;
let textFieldFirst = document.querySelector("#text-field1");
let textFieldSecond = document.querySelector("#text-field2");

textFieldFirst.querySelctor("input").addEventListener("input", inputHandler.bind(this));
textFieldSecond.queySelector("input").addEventListener("input", inputHandler.bind(this));

textFieldFirst.addEventListener("click", clickHandler.bind(this));
textFieldSecond.addEventListener("click", clickHandler.bind(this));

function clickEventCalendar(e) {
  let types = {
    day: () => {
      let input = calendar.parentNode.querySelector(".brad-text-field input");
      let order = input.dataset.order;
      let firstOrSecond = {
        first: (date) => {
          if (service.setInitialInterval(date)) {
            input.value = e.values[0].toLocaleDateString("pt-br");
          }
        },
        second: (date) => {
          if (service.setEndInterval(date)) {
            input.value = e.values[0].toLocaleDateString("pt-br");
          }
        },
      };
      firstOrSecond[order](e.values[0]);
    },
    month: (e) => {},
    year: (e) => {},
  };
  types[e.type]();
}

function inputHandler(event) {
  if (event.inputType == "insertText") {
    let input = event.target;
    insertLogicInput(input);
  }
}

function clickHandler(e) {
  let textField = e.currentTarget;
  showCalendar(textField);
}

function insertLogicInput(input) {
  let old = input.selectionEnd;
  let onlyNumbers = input.value.replace(/\D/g, "");

  input.value = maskDate(input.value);
  if (old < onlyNumbers.length) {
    input.selectionEnd = old;
  }

  let date = inputValueToDate(input);
  let order = input.dataset.order;
  if (date) {
    let way = {
      first: (date) => {
        service.setInitialInterval(date);
      },
      second: (date) => {
        service.setEndInterval(date);
      },
    };
    way[order](date);
    service.setType("day");
    service.refreshToDate(date);
  }
}

function showCalendar(textField) {
  let input = textField.querySelector("input");
  let date = inputValueToDate(input);

  if (date) {
    service.setType("day");
    service.refreshToDate(date);
  }
  calendar.parentNode.removeChild(calendar);
  input.parentNode.parentNode.appendChild(calendar);
}

function inputValueToDate(input) {
  let onlyNumbers = input.value.replace(/\D/g, "");
  if (onlyNumbers.length == 8) {
    let array = input.value.split("/");
    return new Date(array[2], array[1] - 1, array[0]);
  }
  return null;
}

function maskDate(v) {
  v = v.replace(/\D/g, "");
  v = v.replace(/(\d{2})(\d)/, "$1/$2");
  v = v.replace(/(\d{2})(\d)/, "$1/$2");

  v = v.replace(/(\d{2})(\d{2})$/, "$1$2");
  return v;
}
Copy
```
Exemplos
```
<div class="brad-input-calendar">
  <!--INPUT TEXT-->
  <label class="brad-text-field brad-m-md-b">
    <input
      id="input-199"
      aria-label="Campo de texto"
      type="text"
      maxlength="10"
      placeholder="dd/mm/yyyy"
    />
    <small aria-hidden="true" class="placeholder-label-field"
      >Label text</small
    >
    <em class="validation-icon complements"></em>
    <button
      aria-label="Aria label"
      class="trailing-icon-interactive complements"
    >
      <em class="icon-ui-calendar"></em>
    </button>
    <span class="helper-text">Helper text</span>
    <div class="brad-text-field--background"></div>
  </label>

  <!--CALENDARIO DENTRO DO CARD-->
  <div class="brad-card brad-card--default brad-p-lg">
    <div class="brad-calendar brad-calendar--day" id="template-calendar-368">
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
  </div>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| type | Seleção do tipo de calendário string |  | Choose option... day month year |
| date | Qual período será mostrado o calendário ao incializar object |  | RAW date :{ mes : 0 ano : 2023 } |
| allowedPeriods | Períodos permitidos no calendário array |  | RAW allowedPeriods :[ 0 :{...} 2 keys ] |
| selectedDates | Inicia marcando alguma(s) data(s) array |  | RAW selectedDates :[ ] |
| disableCalendarTypeChange | Desabilitar mudança de tipo de calendario boolean |  | FalseTrue |

# STORIES
Calendar Template
```
<div class="brad-input-calendar">
  <!--INPUT TEXT-->
  <label class="brad-text-field brad-m-md-b">
    <input
      id="input-199"
      aria-label="Campo de texto"
      type="text"
      maxlength="10"
      placeholder="dd/mm/yyyy"
    />
    <small aria-hidden="true" class="placeholder-label-field"
      >Label text</small
    >
    <em class="validation-icon complements"></em>
    <button
      aria-label="Aria label"
      class="trailing-icon-interactive complements"
    >
      <em class="icon-ui-calendar"></em>
    </button>
    <span class="helper-text">Helper text</span>
    <div class="brad-text-field--background"></div>
  </label>

  <!--CALENDARIO DENTRO DO CARD-->
  <div class="brad-card brad-card--default brad-p-lg">
    <div class="brad-calendar brad-calendar--day" id="template-calendar-368">
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
  </div>
</div>
```
Calendar Template 2
```
<div class="brad-inputs-align">
  <div class="brad-input-calendar">
    <!--INPUT TEXT-->

    <label id="text-field2" class="brad-text-field  brad-m-md-b">
      <input
        aria-label="Campo de texto"
        class=""
        type="text"
        value=""
        maxlength="10"
        placeholder="dd/mm/yyyy"
        data-order="first"
      />
      <small aria-hidden="true" class="placeholder-label-field"
        >Label text</small
      >
      <em class="validation-icon complements"></em>
      <button
        aria-label="Aria label"
        class="trailing-icon-interactive complements"
      >
        <em class="icon-ui-calendar"></em>
      </button>
      <span class="helper-text">Helper text</span>
      <div class="brad-text-field--background"></div>
    </label>

    <!--CALENDARIO DENTRO DO CARD-->
    <div class="brad-card brad-card--default brad-p-lg">
      <div class="brad-calendar brad-calendar--day" id="template-calendar-13">
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
    </div>
  </div>

  <div class="brad-input-calendar">
    <!--INPUT TEXT-->
    <label id="text-field3" class="brad-text-field  brad-m-md-b">
      <input
        aria-label="Campo de texto"
        class=""
        type="text"
        value=""
        maxlength="10"
        placeholder="dd/mm/yyyy"
        data-order="second"
      />
      <small aria-hidden="true" class="placeholder-label-field"
        >Label text</small
      >
      <em class="validation-icon complements"></em>
      <button
        aria-label="Aria label"
        class="trailing-icon-interactive complements"
      >
        <em class="icon-ui-calendar"></em>
      </button>
      <span class="helper-text">Helper text</span>
      <div class="brad-text-field--background"></div>
    </label>
  </div>
</div>
```