# Calendário

Componente de calendário que permite a seleção de datas, intervalos e modos de exibição configuráveis.

# Uso do Web Component

O componente de calendário possui os seguintes elementos principais:


| Nome | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| brad-calendar | Componente | Sim | Componente principal do calendário. |

# Propriedades
## brad-calendar

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | auto | ID único do componente (gerado automaticamente se não fornecido). |
| brad-type | string | "day" | Define o tipo de exibição: "day", "month" ou "year". |
| brad-initial-view-period | string | hoje | Define a data inicial exibida no calendário. |
| brad-has-interval | boolean | false | Indica se o calendário permite seleção de intervalos de datas. |
| brad-allowed-periods | string |  | JSON string de períodos permitidos para seleção (formato: array de objetos). |
| brad-selected-dates | string |  | JSON string de datas selecionadas no calendário (formato: array de objetos). |
| brad-disable-calendar-type-change | boolean | false | Desabilita a troca de tipo de exibição do calendário. |
| brad-is-list-mode | boolean | false | Ativa o modo de lista para exibição de anos. |
| brad-list-mode-start-year | number | 1999 | Define o ano inicial no modo de lista. |
| brad-list-mode-total-years | number | 300 | Define o total de anos exibidos no modo de lista. |
| brad-on-cell-click-callback | string |  | Nome da função callback executada ao clicar em uma célula do calendário. |
| brad-language | string | "pt-br" | Idioma do calendário. Valores suportados: pt-br, en-us, es-es, ou custom. |
| brad-custom-months | string |  | JSON string com array de 12 nomes de meses (usado com brad-language="custom"). |
| brad-custom-weekdays | string |  | JSON string com array de 7 nomes de dias da semana (usado com brad-language="custom"). |
| brad-custom-labels | string |  | JSON string com objeto de labels customizadas (usado com brad-language="custom"). |

# Propriedades de Componente

As propriedades abaixo possuem valores mais complexos (objetos) e podem ser alteradas diretamente via variável do componente, além do uso de setAttribute. Isso é útil porque os valores não precisam ser tratados antes de serem enviados.


| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | auto | ID único do componente (gerado automaticamente se não fornecido). |
| bradType | "day", "month", "year" | "day" | Define o tipo de exibição: "day", "month" ou "year". |
| bradInitialViewPeriod | string ou Date | hoje | Define a data inicial exibida no calendário. |
| bradHasInterval | boolean | false | Indica se o calendário permite seleção de intervalos de datas. |
| bradSelectedDates | Array<Object> ou string | [] | Define as datas selecionadas no calendário. Aceita array de objetos ou JSON string. |
| bradAllowedPeriods | Array<Object> ou string | [] | Define os períodos permitidos para seleção. Aceita array de objetos ou JSON string. |
| bradDisableCalendarTypeChange | boolean | false | Desabilita a troca de tipo de exibição do calendário. |
| bradIsListMode | boolean | false | Ativa o modo de lista para exibição de anos. |
| bradListModeStartYear | number | 1999 | Define o ano inicial no modo de lista. |
| bradListModeTotalYears | number | 300 | Define o total de anos exibidos no modo de lista. |
| bradCellClickCallback | Function | undefined | Função callback executada ao clicar em uma célula do calendário. |
| bradLanguage | "pt-br", "en-us", "es-es", "custom" | "pt-br" | Idioma do calendário. |
| bradCustomMonths | Array<string> ou null | null | Array com 12 nomes de meses. Usado apenas quando brad-language="custom". |
| bradCustomWeekdays | Array<string> ou null | null | Array com 7 nomes de dias da semana. Usado apenas quando brad-language="custom". |
| bradCustomLabels | Object ou null | null | Objeto com as chaves e valores (strings ou funções) para os labels. Usado apenas quando brad-language="custom". |

```
const customLabels = {
yearSelected: ({ year }) =>  `Année  ${year} sélectionnée... `,
yearListRange: ({ start, end }) =>  `Liste des années de  ${start} à  ${end} `,
monthSelected: ({ month }) =>  `Mois  ${month} sélectionné... `,
monthListRange: "Liste des mois de janvier à décembre",
prevYearList: ({ start, end }) =>  `Aller à la liste précédente...  ${start} à  ${end} `,
nextYearList: ({ start, end }) =>  `Aller à la prochaine liste...  ${start} à  ${end} `,
dayLabel: ({ day, month, year }) =>  `Jour  ${day}  ${month}  ${year} `,
rangeFirst: "première date...",
rangeStart: "début de la plage",
rangeEnd: "fin de la plage",
rangeBetween: "dans la plage",
};
```
Exemplo de Alteração
```
// Exemplo 1: Alterando datas selecionadas
const calendar = document.getElementById("calendar-123");

// Usando formato de objetos com propriedades day, month, year
calendar.bradSelectedDates = [
{ day: 10, month: 8, year: 2023 }, // 10 de setembro de 2023
{ day: 15, month: 8, year: 2023 } // 15 de setembro de 2023
];

// Exemplo 2: Definindo períodos permitidos
calendar.bradAllowedPeriods = [
{
start: { day: 1, month: 8, year: 2023 }, // 1º de setembro
end: { day: 20, month: 8, year: 2023 } // 20 de setembro
}
];

// Exemplo 3: Mudando o tipo de exibição
calendar.bradType = "month"; // ou "day" ou "year"

// Exemplo 4: Configurando modo de lista
calendar.bradIsListMode = true;
calendar.bradListModeStartYear = 2000;
calendar.bradListModeTotalYears = 50;

// Exemplo 5: Definindo callback para clique
calendar.bradCellClickCallback = (params) => {
console.log("Célula clicada:", params);
};
```

Essas alterações são refletidas automaticamente na interface do usuário, sem a necessidade de manipulação adicional.

# Formato de Dados
## Estrutura de Datas

O componente utiliza objetos com a seguinte estrutura para representar datas:

```
// Formato de data individual
{
day: 15,    // Dia do mês (1-31)
month: 8,   // Mês (0-11, onde 0 = Janeiro)
year: 2023  // Ano completo
}
```
## Estrutura de Períodos

## Para definir períodos permitidos, use a seguinte estrutura:

```
// Formato de período
{
start: {
  day: 1,
  month: 8,   // Setembro (0-based)
  year: 2023
},
end: {
  day: 30,
  month: 8,   // Setembro
  year: 2023
}
}
```
## Conversão entre Formatos

Para converter entre Date nativo do JavaScript e o formato do componente:

```
// Converter Date para formato do componente
function dateToCalendarFormat(date) {
return {
  day: date.getDate(),
  month: date.getMonth(),
  year: date.getFullYear()
};
}

// Converter formato do componente para Date
function calendarFormatToDate(calendarDate) {
return new Date(calendarDate.year, calendarDate.month, calendarDate.day);
}

// Exemplo de uso
const hoje = new Date();
const calendarDate = dateToCalendarFormat(hoje);
console.log(calendarDate); // { day: 18, month: 8, year: 2025 }

const jsDate = calendarFormatToDate(calendarDate);
console.log(jsDate); // Date object
```
Comportamento Javascript
## Inicialização

O Web Component não requer uma instanciação explícita em JavaScript, pois a própria tag HTML se encarrega de inicializá-lo e tratá-lo por trás dos panos.

Além disso, todos os atributos do componente são reativos. Isso significa que, para gerenciar o comportamento ou atualizar o estado do componente, basta obter sua referência no DOM e manipular os valores dos seus atributos.

# Exemplo de Uso
```
const alloweds = [new Date(2023, 8, 10), new Date(2023, 8, 15)];
const range = [{ start: new Date(2023, 8, 1), end: new Date(2023, 8, 20) }];
```
```
<brad-calendar id="calendar" brad-allowed-periods="${LiquidCorp.defineAttribute(
alloweds
)}" brad-selected-dates="${LiquidCorp.defineAttribute(
range
)}"></brad-calendar>
```
## Adicionando Callback

O componente brad-calendar permite a adição de callbacks para eventos específicos, como o clique em uma célula do calendário. Para isso, é necessário registrar o callback utilizando o método LiquidCorp.addCallbacks.

# Exemplo de Adição de Callback
```
const onCellClickCallback = (params) => {
  alert(
    `Calendário foi clicado 👆🏽
Calendário do tipo: ${params.type}
Datas selecionadas: ${params.values.join(", ")}.`
  );
};

LiquidCorp.addCallbacks(
"Calendar",
"OnCellClickCallback",
onCellClickCallback
);
```

Após registrar o callback, ele pode ser associado ao componente utilizando o atributo brad-on-cell-click-callback:

```
<brad-calendar
  id="calendar"
  brad-on-cell-click-callback="Calendar.OnCellClickCallback"
></brad-calendar>
```
## Eventos

O componente brad-calendar emite eventos customizados que permitem reagir a mudanças de estado:


| Evento | Elemento | Descrição | Dados do Evento |
| --- | --- | --- | --- |
| bradSelectedDatesChange | brad-calendar | Disparado quando as datas selecionadas mudam. | { selectedDates: Array } |
| bradTypeChange | brad-calendar | Disparado quando o tipo de exibição muda. | { type: string } |

# Exemplo de Uso
```
const calendar = document.getElementById("calendar");

// Escuta mudanças nas datas selecionadas
calendar.addEventListener("bradSelectedDatesChange", (event) => {
const { selectedDates } = event.detail;
console.log("Datas selecionadas mudaram:", selectedDates);
});

// Escuta mudanças no tipo de exibição
calendar.addEventListener("bradTypeChange", (event) => {
const { type } = event.detail;
console.log("Tipo de calendário mudou:", type);
});

// Eventos internos também podem ser utilizados
calendar.addEventListener("datesChanged", (event) => {
const { selectedDates } = event.detail;
console.log("Evento interno - datas mudaram:", selectedDates);
});
```
## Linguagem

O componente suporta múltiplos idiomas através do atributo brad-language. Os idiomas suportados são:

## pt-br ou pt - Português (Brasil) - padrão
en-us ou en - Inglês (Estados Unidos)
es-es ou es - Espanhol (Espanha)
custom - Localização personalizada
## Idiomas Pré-definidos

Para utilizar idiomas pré-definidos, simplesmente defina o atributo brad-language:

```
<!-- Inglês -->
<brad-calendar brad-language="en-us"></brad-calendar>

<!-- Espanhol -->

<brad-calendar brad-language="es-es"></brad-calendar>

<!-- Português (padrão - não precisa especificar) -->

<brad-calendar></brad-calendar>
```
## Localização Personalizada

Para criar uma localização personalizada, use brad-language="custom" junto com os atributos de customização:

# Atributos de Customização

| Atributo | Descrição | Formato |
| --- | --- | --- |
| brad-custom-months | Nomes dos 12 meses do ano | JSON string com array |
| brad-custom-weekdays | Nomes dos 7 dias da semana (começando pelo domingo) | JSON string com array |
| brad-custom-labels | Labels e mensagens da interface | JSON string com objeto |

## Exemplo Completo de Localização Personalizada
```
<brad-calendar
id="calendar-custom"
brad-language="custom"
brad-custom-months='["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]'
brad-custom-weekdays='["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"]'
brad-custom-labels='{"yearSelected":"Ano {year} selecionado","monthSelected":"Mês {month} selecionado"}'
></brad-calendar>
```
## Configuração via JavaScript

Alternativamente, você pode configurar a localização via JavaScript:

```
const calendar = document.getElementById("calendar-custom");

// Definir idioma personalizado
calendar.bradLanguage = "custom";

// Configurar meses (francês como exemplo)
calendar.bradCustomMonths = [
"Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
"Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

// Configurar dias da semana (francês)
calendar.bradCustomWeekdays = [
"Dimanche", "Lundi", "Mardi", "Mercredi",
"Jeudi", "Vendredi", "Samedi"
];

// Configurar labels personalizadas
calendar.bradCustomLabels = {
yearSelected: (year) => `Année ${year} sélectionnée...`,
yearListRange: (start, end) => `Liste des années de ${start} à ${end}`,
monthSelected: (month) => `Mois ${month} sélectionné...`,
monthListRange: "Liste des mois de janvier à décembre",
prevYearList: (start, end) => `Aller à la liste précédente... ${start} à ${end}`,
nextYearList: (start, end) => `Aller à la prochaine liste... ${start} à ${end}`,
dayLabel: (day, month, year) => `Jour ${day} ${month} ${year}`,
rangeFirst: "première date...",
rangeStart: "début de la plage",
rangeEnd: "fin de la plage",
rangeBetween: "dans la plage"
};
```
Exemplos
Default
```
<brad-calendar
  id="calendar-130"
  brad-type="day"
  brad-has-interval="true"
  brad-allowed-periods="[{&quot;start&quot;:&quot;1899-12-31T03:06:28.000Z&quot;,&quot;end&quot;:&quot;2026-06-03T03:00:00.000Z&quot;}]"
  brad-selected-dates="[&quot;2026-05-04T03:00:00.000Z&quot;]"
  brad-disable-calendar-type-change="false"
  brad-is-list-mode="false"
  brad-list-mode-start-year="1999"
  brad-list-mode-total-years="300"
  brad-is-manual-selection="false"
  brad-language="pt-br"
  brad-custom-months="[&quot;Janvier&quot;,&quot;Février&quot;,&quot;Mars&quot;,&quot;Avril&quot;,&quot;Mai&quot;,&quot;Juin&quot;,&quot;Juillet&quot;,&quot;Août&quot;,&quot;Septembre&quot;,&quot;Octobre&quot;,&quot;Novembre&quot;,&quot;Décembre&quot;]"
  brad-custom-weekdays="[&quot;Dimanche&quot;,&quot;Lundi&quot;,&quot;Mardi&quot;,&quot;Mercredi&quot;,&quot;Jeudi&quot;,&quot;Vendredi&quot;,&quot;Samedi&quot;]"
  brad-custom-labels="{&quot;monthListRange&quot;:&quot;Liste des mois de janvier à décembre&quot;,&quot;rangeFirst&quot;:&quot;première date...&quot;,&quot;rangeStart&quot;:&quot;début de la plage&quot;,&quot;rangeEnd&quot;:&quot;fin de la plage&quot;,&quot;rangeBetween&quot;:&quot;dans la plage&quot;}"
></brad-calendar>
```