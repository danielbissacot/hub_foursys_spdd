# Calendário

Componente de calendário que permite a seleção de datas, intervalos e modos de exibição configuráveis.

# Uso do HTML
```
<div class="brad-calendar" id="calendar1">
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
<hr class="brad-calendar__dividing-line brad-shadow-10" />
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
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do Calendar

```
const options = { targetSelector: "#calendar1", date: new Date(), type: "day" };
const service = LiquidCorp.BradCalendarService.getInstance(options).buildCalendar();
```
## Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| date | Date | - | Qual período será mostrado o calendário ao incializar |
| type | string(day/month/year) | day | Seleção do tipo de calendário |
| calendarDayWithInterval | boolean | true | Permitir seleção de intervalo no calendário do tipo dia |
| allowedPeriods | Array(objetos) | [] | Períodos permitidos no calendário |
| selectedDates | Array(Dates) | [] | Data(s) pré-selecionada(s) |
| disableCalendarTypeChange | boolean | false | Desabilitar mudança de tipo de calendario |
| addClickEventOnCell | função | - | Callback pela função especificada, retornando o evento e a data, mes ou ano clicado |
| manualSelection | boolean | false | Recomendado para marcações customizáveis: Ver uso em template |
| listMode | boolean | false | Recomendado para uso em mobile, onde as datas são mostrados em forma de lista de um ano |
| startYear | number | 1900 | Apenas em listMode, o inicio da listagem dos anos |
| totalYears | number | 300 | Apenas em listMode, quantos anos serão listados a partir do startYear |
| language | string | 'pt-br' | Idioma do calendário. Valores suportados: pt-br, en-us, es-es, ou custom para uso com customLabels. |
| customLabels | Objeto | - | Objeto de rótulos personalizados para o idioma quando language="custom". Deve seguir o formato de labels, meses e dias da semana. |

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| setSelectedDates | [Dates] | Determina as datas selecionadas no calendário |
| getSelectedDates | - | Retorna a(s) data(s) que o usuário selecionou |
| addClickEventOnCell | Object | Adiciona um função de callback, quando for executado um click em uma célula do calendário |
| refreshToDate | Date | Atualiza em qual período será mostrado o calendário Ver uso em template |
| setInitialInterval | Date | Determina a data inicial de um intervalo, se sucesso retorna true, caso contrário retorna false (Recomendado deixar calendarDayWithInterval true) Ver uso em template |
| setEndInterval | Date | Determina a data final de um intervalo, se sucesso retorna true, caso contrário retorna false (Recomendado deixar calendarDayWithInterval true) Ver uso em template |

# Uso básico
```
let clickEventOnCell = (e) => {
  //console.log("Click Event On Cell:", e);
};

let start = new Date(2021, 0, 1);
let end = new Date();
let selectedDate = new Date();
let selctedDate2 = new Date(selectedDate.getFullYear(), 0, 1);

const options = {
  targetSelector: "#calendar1",
  date: new Date(),
  allowedPeriods: [
    {
      start: start,
      end: end,
    },
  ],
  type: "day",
  selectedDates: [selectedDate, selectedDate2],
  calendarDayWithInterval: true,
  disableCalendarTypeChange: false,
  addClickEventOnCell: clickEventOnCell,
};

const service = LiquidCorp.BradCalendarService.getInstance(options).buildCalendar();
```
## Linguagem

Para utilizar idiomas diferentes, é necessário passar o parâmetro language com o valor desejado (pt-br ou pt para português, en-us ou en para inglês, es-es ou es para espanhol) ou custom para usar o objeto customLabels com os rótulos personalizados.

# Exemplo de linguagem em en:
```
const options = {
  targetSelector: "#calendar1",
  date: new Date(),
  allowedPeriods: [
    {
      start: start,
      end: end,
    },
  ],
  type: "day",
  selectedDates: [selectedDate, selectedDate2],
  calendarDayWithInterval: true,
  disableCalendarTypeChange: false,
  language: "en",
};

const service = LiquidCorp.BradCalendarService.getInstance(options).buildCalendar();
```
Exemplo de linguagem em es:
```
const options = {
  targetSelector: "#calendar1",
  date: new Date(),
  allowedPeriods: [
    {
      start: start,
      end: end,
    },
  ],
  type: "day",
  selectedDates: [selectedDate, selectedDate2],
  calendarDayWithInterval: true,
  disableCalendarTypeChange: false,
  language: "es",
};

const service = LiquidCorp.BradCalendarService.getInstance(options).buildCalendar();
```

Para utilizar o padrão ("pt-br"), não é necessário passar o parâmetro language.

## Exemplo de linguagem em custom (para o idioma francês):
```
const customLocale = {
  months: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  weekdays: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  labels: {
    yearSelected: (year) =>`Année ${year} sélectionnée, appuyez pour choisir dans une liste.`,
    yearListRange: (start, end) => `Liste des années de ${start} à ${end}`,
    monthSelected: (month) =>
      `Mois ${month} sélectionné, appuyez pour choisir dans une liste.`,
    monthListRange: "Liste des mois de janvier à décembre",
    prevYearList: (start, end) =>
      `Aller à la liste précédente des années, liste actuelle de ${start} à ${end}`,
    nextYearList: (start, end) =>
      `Aller à la prochaine liste des années, liste actuelle de ${start} à ${end}`,
    dayLabel: (day, monthStr, year) => `Jour ${day} ${monthStr} ${year}`,
    rangeFirst:
      "première date de la plage, choisissez-en une autre pour la fermer",
    rangeStart: "début de la plage",
    rangeEnd: "fin de la plage",
    rangeBetween: "dans la plage",
  },
};

  const options = {
    targetSelector: "#calendar1",
    date: new Date(),
    allowedPeriods: [
      {
        start: start,
        end: end,
      },
    ],
    type: "day",
    selectedDates: [selectedDate, selectedDate2],
    calendarDayWithInterval: true,
    disableCalendarTypeChange: false,
    language: "custom",
    customLabels: customLocale,
  };

  const service = LiquidCorp.BradCalendarService.getInstance(options).buildCalendar();
```

Sempre utilize a estrutura a seguir de customLabels para conseguir utilizar o idioma customizado:

```
const customLocale = {
  months: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  weekdays: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  labels: {
    yearSelected: (year) =>
      `Ano ${year} selecionado, pressione para selecionar em uma lista.`,
    yearListRange: (start, end) => `Lista de anos de ${start} a ${end}`,
    monthSelected: (month) =>
      `Mês ${month} selecionado, pressione para selecionar em uma lista.`,
    monthListRange: "Lista de meses de Janeiro a Dezembro",
    prevYearList: (start, end) =>
      `Vai para a lista de anos anterior, lista atual ${start} a ${end}`,
    nextYearList: (start, end) =>
      `Vai para a próxima lista de anos, a lista atual ${start} a ${end}`,
    dayLabel: (day, monthStr, year) => `Dia ${day} de ${monthStr} de ${year}`,
    rangeFirst:
      "primeira data do intervalo, escolha mais um para fechar o intervalo",
    rangeStart: "inicio da data do intervalo",
    rangeEnd: "fim da data do intervalo",
    rangeBetween: "dentro do intervalo",
  },
};
```
## Acessibilidade

A implementação para a leitura dos leitores de tela é feita automáticamente.

A leitura segue a ordem padrão de cima para baixo e da esquerda para direita, que pode ser navegado tanto por tab quanto pelas setas, e no caso mobile pelo gesto swipe.

Ao navegar pelas datas é informado a data completa (dia, mês e ano), além de informar se foi selecionado ou não. E caso de marcações de intervalo entre duas datas, é informado se marcou a primeira data e que ainda falta marcar a segunda data, e também informa a marcação da segunda data do intervalo.

No listMode a leitura das datas estão restritas apenas para o mês selecionado, apesar de exibir uma lista dos 12 meses, para não deixar longa a navegação do usuário em percorrer em 365 dias no pior cenário.

# Exemplo
```
<div
  id="calendar-151"
  class="brad-calendar brad-calendar--day"
  style="height: 400px;"
>
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

  <hr class="brad-calendar__dividing-line brad-shadow-10" />

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
```