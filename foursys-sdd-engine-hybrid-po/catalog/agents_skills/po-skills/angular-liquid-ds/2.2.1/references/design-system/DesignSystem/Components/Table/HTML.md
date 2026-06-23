# Table
## Breaking Change

O componente table passou por uma mudança significativa. Para melhorar a performance e reduzir o tamanho do bundle da biblioteca Liquid, removemos todos os bundles externos, incluindo o do Tabulator, que é usado internamente pelo table. Agora, adotamos técnicas de code splitting e lazy loading, fazendo com que o Tabulator só seja carregado na primeira vez que o componente for instanciado na navegação.




Por conta disso, o carregamento do Tabulator é assíncrono. Isso significa que o uso do componente table agora requer o uso de Promise ou async/await para garantir que o carregamento e a inicialização estejam completos antes da utilização.




Recomendamos a leitura detalhada da documentação abaixo para entender as novas formas de uso e garantir a correta implementação.

# Importante
Este componente é construído sobre a biblioteca Tabulator, utilizando a versão 5.4 como base para renderização e manipulação de dados tabulares.

Para compreender todas as funcionalidades oferecidas pela biblioteca, recomendamos a consulta à documentação oficial do Tabulator.

Atenção: Embora o Tabulator ofereça uma ampla gama de recursos, este componente não implementa necessariamente todas as funcionalidades da biblioteca. Para entender mais sobre as funcionalidades desse componente, consulte a seção Comportamento Javascript desta documentação. Recursos não mencionados nessa seção podem não estar disponíveis no componente, mesmo que existam na biblioteca original (Tabulator).

O componente table tem por objetivo em apresentar as informações de forma clara e precisa, facilitando ao usuário a encontrar e compreender os dados.

# Uso do HTML
```
<div id="[ID_DA_TABELA]" class="brad-table"></div>
```
Comportamento Javascript
Inicialização
## Estrutura de dados

## Primeiro, defina os dados que serão exibidos na tabela:

```
let handleIconClick = (e) => {
alert("Name: " + e.currentTarget.rowInfo.name);
};

const tableData = [
{
id: "1",
name: "Oli Bob",
statusIcon: { icon: "icon-feedback-check-box", label: "Ok" },
gender: "male",
download: {
icon: "icon-ui-download",
href: "",
},
col: "red",
btn: { icon: "icon-ui-placeholder", clickCallback: handleIconClick },
},
{
id: "2",
name: "Mary May",
statusIcon: { icon: "icon-feedback-view-on", label: "Error" },
gender: "female",
download: {
icon: "icon-ui-download",
href: "",
},
col: "blue",
btn: { icon: "icon-ui-placeholder", clickCallback: handleIconClick },
},
{
id: "3",
name: "Christine Lobowski",
statusIcon: { icon: "icon-feedback-view-off", label: "Warning" },
gender: "female",
download: {
icon: "icon-ui-download",
href: "",
},
col: "green",
btn: { icon: "icon-ui-placeholder", clickCallback: handleIconClick },
},
{
id: "4",
name: "Brendon Philips",
statusIcon: { icon: "icon-feedback-check-box", label: "Ok" },
gender: "male",
download: {
icon: "icon-ui-download",
href: "",
},
col: "orange",
btn: { icon: "icon-ui-placeholder", clickCallback: handleIconClick },
},
{
id: "5",
name: "Margret Marmajuke",
statusIcon: { icon: "icon-feedback-check-box", label: "Ok" },
gender: "female",
download: {
icon: "icon-ui-download",
href: "",
},
col: "yellow",
btn: { icon: "icon-ui-placeholder", clickCallback: handleIconClick },
},
{
id: "6",
name: "Frank Harbours",
statusIcon: { icon: "icon-feedback-check-box", label: "Ok" },
gender: "male",
download: {
icon: "icon-ui-download",
href: "",
},
col: "red",
btn: { icon: "icon-ui-placeholder", clickCallback: handleIconClick },
},
];
```
## Configuração da tabela

## Configure as opções e colunas da tabela:

```
const tableConfiguration = {
data: tableData,
layout: "fitColumns",
columns: [
  { column: "name", dir: "asc" },
  { column: "gender", dir: "asc" },
],
responsiveLayout: "collapse",
responsiveLayoutCollapseFormatter: LiquidCorp.BradTableService.customCollapse,
isStripedRows: true,
columns: [
  {
    field: "collapse",
    formatter: LiquidCorp.BradTableService.customResponsiveCollapseFormatter,
    width: 55,
    minWidth: 55,
    resizable: false,
    headerSort: false,
  },
  {
    title: "Name complete",
    field: "name",
    formatter: "textarea",
    minWidth: "145px",
    titleFormatter: LiquidCorp.BradTableService.buttonPopoverHeader,
    vertAlign: "center",
    titleFormatterParams: {
      titlePopover: "Titulo popover.",
      textPopover: "O texto do popover.",
    },
    resizable: false,
  },
  {
    title: "Status",
    field: "statusIcon",
    formatter: LiquidCorp.BradTableService.iconLabel,
    sorter: "string",
    vertAlign: "center",
    minWidth: "120px",
    resizable: false,
    headerSort: false,
  },
  {
    title: "Gender",
    field: "gender",
    responsive: 2,
    vertAlign: "center",
    minWidth: "100px",
    resizable: false,
  },
  {
    title: "Favourite Color",
    field: "col",
    vertAlign: "center",
    headerWordWrap: true,
    minWidth: "130px",
    hozAlign: "right",
    resizable: false,
  },
  {
    title: "Download",
    field: "download",
    hozAlign: "left",
    formatter: LiquidCorp.BradTableService.iconLink,
    vertAlign: "center",
    headerSort: false,
    minWidth: "150px",
    resizable: false,
  },
  {
    title: "Button icon",
    field: "btn",
    hozAlign: "center",
    formatter: LiquidCorp.BradTableService.buttonIcon,
    vertAlign: "center",
    headerSort: false,
    headerHozAlign: "center",
    headerWordWrap: true,
    minWidth: "160px",
    resizable: false,
  },
],
};
```
## getInstance

Para criar uma única instância da tabela, use o método getInstance que retorna uma Promise:

```
const options = {
targetSelector: "#minha-tabela",
table: tableConfiguration,
initialSort: [{ column: "name", dir: "asc" }]
};

LiquidCorp.BradTableService.getInstance(options)
.then((service) => {
console.log("Tabela inicializada:", service);
// Use service.tableTabulator para manipular a tabela
})
.catch((error) => {
console.error("Erro:", error);
});
```

⚠️ Importante: O método getInstance é assíncrono e retorna uma Promise.

# getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna uma Promise que resolve com um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object {}], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

```
const multipleOptions = [
{ targetSelector: "#tabela1", table: tableConfiguration1 },
{ targetSelector: "#tabela2", table: tableConfiguration2 },
{ targetSelector: "#tabela3", table: tableConfiguration3 }
];

LiquidCorp.BradTableService.getInstances(multipleOptions)
.then((services) => {
console.log("Tabelas inicializadas:", services);
services.forEach((service, index) => {
console.log("Tabela " + (index + 1) + ":", service);
});
})
.catch((error) => {
console.error("Erro:", error);
});
```

⚠️ Importante: O método getInstances é assíncrono e retorna uma Promise que resolve com um array de instâncias.

# Promise e Async/Await

O BradTableService utiliza operações assíncronas que retornam Promises. Você pode trabalhar com elas de duas formas:

# Usando Promises (.then/.catch)
```
LiquidCorp.BradTableService.getInstance(options)
.then((service) => {
  console.log("Tabela inicializada com sucesso:", service);

})
.catch((error) => {
console.error("Erro ao inicializar tabela:", error);
});

LiquidCorp.BradTableService.getInstances(multipleOptions)
.then((services) => {
console.log("Todas as tabelas inicializadas:", services);

services.forEach((service, index) => {
console.log("Tabela " + (index + 1) + " inicializada:", service);
});
})
.catch((error) => {
console.error("Erro ao inicializar tabelas:", error);
});
```
Usando Async/Await
```
async function initializeTable() {
try {
  const service = await LiquidCorp.BradTableService.getInstance(options);
  console.log("Tabela inicializada com sucesso:", service);
  // Aqui você pode usar o service.tableTabulator
} catch (error) {
  console.error("Erro ao inicializar tabela:", error);
}
}

async function initializeMultipleTables() {
try {
const services = await LiquidCorp.BradTableService.getInstances(multipleOptions);
console.log("Todas as tabelas inicializadas:", services);

  // Processar cada serviço
  services.forEach((service, index) => {
    console.log("Tabela " + (index + 1) + " inicializada:", service);
  });

} catch (error) {
console.error("Erro ao inicializar tabelas:", error);
}
}

initializeTable();
initializeMultipleTables();
```
## Vantagens de cada abordagem

# Promises (.then/.catch):

## Mais direta para operações simples
Melhor para encadeamento de operações
## Compatível com versões mais antigas do JavaScript

# Async/Await:

# Código mais limpo e legível
Melhor tratamento de erros com try/catch
Facilita o debug e manutenção
Recomendado para operações complexas
## Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância assíncrona do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options. Retorna uma Promise. |
| getInstances | [Options] | Cria uma instância assíncrona para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options. Retorna uma Promise que resolve com um array de instâncias. |

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| table | object | - | Um objeto para as opções de configuração da tabela e os dados para serem visualizados na tabela. (Veja em Configuração da tabela) |
| initialSort | object | - | Ordenação inicial. Ver seção Ordenação inicial (initialSort). |

# Configuração da tabela

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| data | array | [] | Array de objetos que definirão todos os valores do conteúdo da tabela. |
| layout | string | "fitData" | String que pode receber os seguintes valores: -fitData - que redimensionará as colunas das tabelas para ajustar os dados contidos em cada coluna, a menos que você especifique um width ou minWidth no construtor de colunas. Se a largura de todas as colunas exceder a largura do elemento que a contém, aparecerá uma barra de rolagem. -fitDataFill - modo de layout funciona da mesma forma que o fitData, mas garante que as linhas tenham sempre pelo menos a largura total da tabela. -fitDataStretch - irá definir as larguras das colunas da mesma forma que o fitData, mas também redimensionará a largura da tabela para corresponder à largura total das colunas. -fitColumns - modo de layout para fazer com que redimensione as colunas para que caibam perfeitamente na largura da tabela disponível. |
| height | string | - | Define uma altura pra tabela. Caso o conteúdo da tabela for maior aparecerá o scroll vertical. |
| responsiveLayout | string | - | Define o tipo de responsividade. Em modo "hide" esconderá as colunas que não cabem na tela. Em modo "collapse" as colunas que não cabem na tela irão para dentro de um exepnsível da linha em que pertence da tabela. . |
| responsiveLayoutCollapseFormatter | function | - | Define a customização do layout em modo 'collapse', recomendado utilizar a formatação definida pelo Design System. (LiquidCorp.BradTableService.customResponsiveCollapseFormatter) . |
| columns | array | - | Define a configuração de cada coluna. Ver abaixo a configuração de coluna. . |
| isStripedRows | boolean | false | Ativa linhas zebradas em tabelas. São usadas para melhorar a legibilidade, organização e identificação de dados, alternando as cores de fundo das linhas para facilitar a leitura e o acompanhamento das informações. |
| validationMode | string | "highlight" | Se estiver usando o modo com edição de campos é necessário incluir o validationMode. highlight (recomendado): Quando um usuário inserir um valor inválido, um destaque de erro será aplicado à célula. blocking O usuário só irá conseguir sair da célula de edição quando inserir um valor valido. |

# Configuração das colunas

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| title | string | - | Obrigatório Este é o título que será exibido no cabeçalho desta coluna. |
| field | string | - | Obrigatório esta é a key referência para receber o valor do array de dados. |
| width | string | - | Define a largura da coluna. |
| minWidth | string | - | Define a largura mínima da coluna. Obs: Ao definir um tamanho minimo testar o modo colapse nas menores resoluções |
| maxWidth | string | - | Define a largura máxima da coluna. |
| formatter | string | - | Defina como você gostaria que os dados fossem formatados. (Customizar) |
| headerWordWrap | string | false | Permite a quebra de linha. |
| hozAlign | string | - | Alinhamento horizontal do texto. (left, center, right) |
| vertAlign | string | - | Alinhamento vertical do texto. (top, middle, bottom) |
| resizable | boolean | true | Determina se a coluna pode ser redimensionada pelo usuario. |
| headerSort | boolean | true | Determina se a coluna pode ordenar ao clicar no header. |
| headerHozAlign | string | left | Alinhamento horizontal do texto do header. (left, center, right) |

## Ordenação inicial (initialSort)

## A ordenação inicial pode ser definida:

## Dentro de tableConfiguration: initialSort
Como parâmetro no getInstance: initialSort: ... (prioriza sobre a de table)

## Deve ser enviada como um array. Exemplo:

Array: [ column: "status", dir: "desc" , column: "name", dir: "asc" ]

# Direções: "asc" | "desc"

# Exemplo ao instanciar:

```
LiquidCorp.BradTableService.getInstance({
targetSelector: "#my-table",
table: {
  data,
  columns
},
initialSort: [
    { column: "gender", dir: "desc" },
    { column: "name", dir: "asc" },
  ],
});
```
## Manipulação da tabela

A instância de BradTableService fornece o objeto da tabela em si chamado tableTabulator. Através dele é possível fazer manipulações da tabela.

## Atualizações dos dados da tabela
replaceData: utilizado para atualizar todos os dados da tabela
```
LiquidCorp.BradTableService.getInstance(options)
.then((service) => {
  service.tableTabulator.replaceData([
    {
      id: "3",
      name: "Christine Lobowski",
      statusIcon: { icon: "icon-feedback-view-off", label: "Warning" },
      gender: "female",
      download: {
        icon: "icon-ui-download",
        href: "",
      },
      col: "green",
      btn: { icon: "icon-ui-placeholder" },
    },
  ]);
})
.catch((error) => {
  console.error("Erro ao inicializar tabela:", error);
});
```
updateData: atualiza apenas algumas partes da tabela
```
LiquidCorp.BradTableService.getInstance(options)
.then((service) => {
  service.tableTabulator.updateData([
    { id: "1", name: "Bob", gender: "male" },
    { id: "2", name: "Marcus", gender: "male" },
  ]);
})
.catch((error) => {
  console.error("Erro ao inicializar tabela:", error);
});
```
addData: adiciona dados à tabela. O primeiro parâmetro corresponde aos dados que devem ser inseridos, enquanto o segundo é um valor booleano que define a posição de inserção: true insere os dados no topo da tabela, false insere no final. Por padrão, os dados são adicionados ao final.
```
LiquidCorp.BradTableService.getInstance(options)
.then((service) => {
  service.tableTabulator.addData(
    [
      {
        id: "7",
        name: "New Bob",
        statusIcon: { icon: "icon-feedback-check-box", label: "Ok" },
        gender: "male",
        download: {
          icon: "icon-ui-download",
          href: "",
        },
        col: "red",
        btn: { icon: "icon-ui-placeholder", clickCallback: handleIconClick },
      },
    ],
    true
  );
})
.catch((error) => {
  console.error("Erro ao inicializar tabela:", error);
});
```
clearData: esvazia a tabela
```
LiquidCorp.BradTableService.getInstance(options)
.then((service) => {
  service.tableTabulator.clearData();
})
.catch((error) => {
  console.error("Erro ao inicializar tabela:", error);
});
```
## Formatters

O service do brad-table já possui alguns formatadores prontos, mas também é possível criar o seu próprio formatter. Veja aqui a documentação do tabulator para Custom Formatters

## Os formatters prontos do brad-table são:

LiquidCorp.BradTableService.iconLink cria uma âncora como ícone. Para utilizar é necessário colocar a classe do ícone e o href. Logo abaixo um exemplo de utilização para download.

```
let tableData = [
{
  download: {
    icon: "icon-ui-download",
    href: "url1",
  },
},
{
  download: {
    icon: "icon-ui-download",
    href: "url2",
  },
},
];
let tableConfiguration = {
data: tableData,
columns: [
  {
    title: "Download",
    field: "download",
    hozAlign: "center",
    vertAlign: "center",
    formatter: LiquidCorp.BradTableService.iconLink,
  },
],
};
```

LiquidCorp.BradTableService.buttonPopoverHeader cria o botão popover para ser utilizado no header. Esse formatador deve ser utilizado no parâmetro "titleFormatter". Para definir o conteúdo do popover basta passar o objeto com os seguintes parâmetros '{titlePopover: "Titulo", textPopover: "Texto conteúdo"}' no "titleFormatterParams".

```
let tableConfiguration = {
data: tableData,
columns: [
  {
    title: "Nome completo",
    field: "name",
    vertAlign: "center",
    titleFormatter: LiquidCorp.BradTableService.buttonPopoverHeader,
    titleFormatterParams: {
      titlePopover: "Titulo popover.",
      textPopover: "O texto do popover.",
    },
  },
],
};
```

LiquidCorp.BradTableService.iconLabel cria-se um ícone seguido de um texto. Para utilizar é necessário determinar a classe do ícone e o texto(opcional).

```
var tableData = [
{
  statusIcon: { icon: "icon-feedback-check-box", label: "Ok" },
},
{
  statusIcon: { icon: "icon-feedback-view-on", label: "Erro" },
},
{
  statusIcon: { icon: "icon-feedback-view-off", label: "Atenção" },
},
{
  statusIcon: { icon: "icon-feedback-check-box" },
},
];
let tableConfiguration = {
data: tableData,
columns: [
  {
    title: "Status",
    field: "statusIcon",
    vertAlign: "center",
    formatter: LiquidCorp.BradTableService.iconLabel,
  },
],
};
```

LiquidCorp.BradTableService.buttonIcon cria-se um botão do tipo icon. Para utilizar é necessário determinar a classe do ícone e a função resposável pelo callback do click. No parâmetro do callback é possível capturar todas as informações da linha: "evt.currentTarget.rowInfo".

```
let handleIconClick = (evt) => {
// alert("ID: " + evt.currentTarget.rowInfo.id);
};

let tableData = [
{
id: 1,
btn: { icon: "icon-ui-placeholder", clickCallback: handleIconClick },
},
{
id: 2,
btn: { icon: "icon-ui-placeholder", clickCallback: handleIconClick },
},
];

let tableConfiguration = {
data: tableData,
columns: [
{
title: "Button icon",
field: "btn",
hozAlign: "center",
vertAlign: "center",
formatter: LiquidCorp.BradTableService.buttonIcon,
},
],
};
```

LiquidCorp.BradTableService.addIconExpansiveLineTitle e LiquidCorp.BradTableService.addIconExpansiveLine cria-se um botão com o ícone de seta no título e em cada coluna. LiquidCorp.BradTableService.addExpansiveLine(row) cria-se a linha expansível com conteúdo customizado para cada row da tabela que será expandida através da seta anteriormente criada.

```
let tableData = [
{
id: 1,
btn: { icon: "icon-ui-placeholder", clickCallback: handleIconClick },
expansiveLine: "<h1>Custom content =)</h1>",
},
{
id: 2,
btn: { icon: "icon-ui-placeholder", clickCallback: handleIconClick },
expansiveLine: "<h1>Custom content =)</h1>",
},
];

let tableConfiguration = {
data: tableData,
height: "100%",
maxHeight: "100%",
columns: [
{
title: "marcadores",
field: "checkbox",
formatter: LiquidCorp.BradTableService.addCheckbox,
titleFormatter: LiquidCorp.BradTableService.addCheckbox,
headerHozAlign: "center",
vertAlign: "center",
headerHozAlign: "center",
headerSort: false,
maxWidth: 56,
},
{
title: "Button icon",
field: "btn",
hozAlign: "center",
vertAlign: "center",
formatter: LiquidCorp.BradTableService.buttonIcon,
},
{
field: "expansiveLine",
titleFormatter: LiquidCorp.BradTableService.addIconExpansiveLineTitle,
formatter: LiquidCorp.BradTableService.addIconExpansiveLine,
frozen: true,
hozAlign: "center",
vertAlign: "center",
maxWidth: "64px",
minWidth: "64px",
resizable: false,
headerSort: false,
},
],
rowFormatter: function (row) {
LiquidCorp.BradTableService.addExpansiveLine(row);
},
};
```

LiquidCorp.BradTableService.addCheckbox quando usado no formatter ele cria um checkbox para cada linha da coluna de checkbox e no titleFormatter (opcional)* vai criar um checkbox para o Header tendo o modo indeterminate. Logo abaixo um exemplo de utilização.

```
//Dados para popular a tabela.
let tableData = [
{
  download: {
    icon: "icon-ui-download",
    href: "url1",
  },
},
{
  download: {
    icon: "icon-ui-download",
    href: "url2",
  },
},
];
//Configuração da tabela.
let tableConfiguration = {
data: tableData,
columns: [
  {
    field: "checkbox",
    formatter: LiquidCorp.BradTableService.addCheckbox,
    titleFormatter: LiquidCorp.BradTableService.addCheckbox,
    headerHozAlign: "center",
    vertAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    maxWidth: 56,
    cellClick: function (e, cell) {},
  },
  {
    title: "Download",
    field: "download",
    hozAlign: "center",
    vertAlign: "center",
    formatter: LiquidCorp.BradTableService.iconLink,
  },
],
};
```
Edição das linhas
```
let handleClick = (evt) => {
const row = evt;
//console.log(row); // É retornado diversas informações da linha editada
};
// Um exemplo de validação customizada
const custom = function (cell, value, parameters) {
// cell - o componente da célula editada
// value - o novo valor de entrada da célula
// parameters - os parâmetros passados ​​com o validado
return value.length < parameters.custom; // Enquanto retorna true a edição será válida, se retornar false a edição será dada como inválida, e não poderá salvar a edição da linha
};
//Dados para popular a tabela.
let tableData = [
{
  name: "Oli Bob",
  edit: {
    clickCallbackEdit: handleClick, // Callback acionado ao clicar em editar linha
    clickCallbackCancel: handleClick, // Callback acionado ao clicar em cancelar edição
    clickCallbackSave: handleClick, // Callback acionado ao clicar em salvar edição
  },
},
];
//Configuração da tabela.
let tableConfiguration = {
data: tableData,
validationMode: "highlight", //Validador dos campos em edição
columns: [
  {
    field: "checkbox",
    formatter: LiquidCorp.BradTableService.addCheckbox,
    titleFormatter: LiquidCorp.BradTableService.addCheckbox,
    headerHozAlign: "center",
    vertAlign: "center",
    headerHozAlign: "center",
    headerSort: false,
    maxWidth: 56,
    cellClick: function (e, cell) {},
  },
  {
    title: "Name",
    field: "name",
    formatter: "textarea",
    minWidth: "145px",
    titleFormatter: LiquidCorp.BradTableService.buttonPopoverHeader,
    vertAlign: "center",
    titleFormatterParams: {
      titlePopover: "Popover title.",
      textPopover: "Popover content.",
    },
    resizable: false,
    editor: "input", // É obrigatório toda linha de edição ter essa propriedade
    editable: LiquidCorp.BradTableService.isRowEditing, // É obrigatório toda linha de edição ter essa propriedade
    validator: [
      {
        type: "required",
        parameters: {
          name: "required",
        },
        message: "This field is required",
      },
      {
        type: custom,
        parameters: {
          custom: 12,
          name: "custom", // É obrigatório toda validação ter a propriedade name, sem não aparecerá a mensagem de célula inválida
        },
        message: "Custom message error", // Mensagem que aparecerá no tooltip da célula que estiver inválida
      },
    ],
  },
  {
    title: "Edit",
    field: "edit",
    headerHozAlign: "center",
    hozAlign: "center",
    vertAlign: "center",
    formatter: LiquidCorp.BradTableService.addEdit,
    headerSort: false,
    minWidth: "160px",
    resizable: false,
  },
],
};
```
ActionBar com contador de linhas selecionadas
```
<div class="brad-flex brad-flex-column">
<div id="example-table" class="brad-table"></div>
<div
  class="brad-flex brad-flex-wrap brad-flex-justify-content-between brad-flex-align-items-center brad-bg-color-cta brad-p-md"
>
  <p
    id="text-example-table"
    class="brad-font-title-sm brad-text-color-neutral-0 brad-m-xs-r"
  >
    0 itens selecionados
  </p>

  <div class="brad-flex brad-flex-wrap brad-flex-align-items-center">
    <button
      class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active brad-m-xs-r"
    >
      <em><em class="fab-icon i icon-ui-placeholder"></em></em>
    </button>
    <button
      class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active brad-m-xs-r"
    >
      <em><em class="fab-icon i icon-ui-placeholder"></em></em>
    </button>
    <button
      class="brad-btn brad-btn-text brad-btn-text brad-btn--auto brad-btn-text--on-color"
    >
      <span>Aprovar</span>
    </button>
    <button
      class="brad-btn brad-btn-text brad-btn-text brad-btn--auto brad-btn-text--on-color"
    >
      <span>Reprovar</span>
    </button>
  </div>

</div>
</div>
```
```
// Inicialização assíncrona com evento de seleção
LiquidCorp.BradTableService.getInstance({
targetSelector: "#[ID_DA_TABELA]",
table: tableConfiguration,
initialSort: [
    { column: "name", dir: "asc" }
  ],
})
.then((service) => {
// Evento para obter mudanças de seleções das linhas
service.tableTabulator.on(
  "rowSelectionChanged",
  function (data, rows, selected, deselected) {
  // rows - array de componentes de linha para as linhas atualmente selecionadas em ordem de seleção
  // data - array de objetos de dados para as linhas atualmente selecionadas em ordem de seleção
  // selected - array de componentes de linha que foram selecionados na última ação
  // deselected - array de componentes de linha que foram desmarcados na última ação
      const eText = document.querySelector("#text-[ID_DA_TABELA]");
      const totalSelected = data.length;
      eText.innerHTML =
        totalSelected === 0
          ? "0 itens selecionados"
          : totalSelected === 1
          ? "1 item selecionado"
          : totalSelected + " itens selecionados";
  }
);
})
.catch((error) => {
console.error("Erro ao inicializar tabela:", error);
});
```
ResultLine (linha de resultados ou footer)
```
<div id="[ID_DA_TABELA]" class="brad-table"></div>
```
```
let tableData = [
{
  name: "Oli Bob",
},
{
  name: "Mary May",
},
{
  name: "Christine Lobowski",
},
{
  resultLine: true,
  name: "Brendon Philips",
},
];
//Configuração da tabela.
let tableConfiguration = {
...
data: tableData,
columns: [
  {
    title: "Name",
    field: "name",
    formatter: "textarea",
    minWidth: "145px",
    resizable: false,
    sorter: setSorterWithoutSortResultLine,
  },
],
rowFormatter: function (row) {
  LiquidCorp.BradTableService.setResultLineStyle(row); // Adiciona os estilos na linha de resultado ** necessário **
},
};
//Instância assíncrona do serviço.
LiquidCorp.BradTableService.getInstance({
targetSelector: "#[ID_DA_TABELA]",
table: tableConfiguration,
initialSort: [
    { column: "name", dir: "asc" }
  ],
})
.then((service) => {
console.log("Tabela com ResultLine inicializada:", service);
})
.catch((error) => {
console.error("Erro ao inicializar tabela:", error);
});
/**
 * Compara dois valores de células para ordenação, considerando uma linha especial chamada "resultLine".
 * Caso uma das células esteja na "resultLine", ela é movida para o final da ordenação.
 *
 * @param {string} a - Valor da célula A.
 * @param {string} b - Valor da célula B.
 * @param {DataRow} aRow - Objeto representando a linha da célula A.
 * @param {DataRow} bRow - Objeto representando a linha da célula B.
 * @param {string} dir - Direção da ordenação ("asc" para ascendente, "desc" para descendente).
 * @param {string} column - Nome da coluna usada para ordenação (opcional).
 * @returns {number} - Valor de comparação para a ordenação.
 */
function setSorterWithoutSortResultLine(a, b, aRow, bRow, dir, column) {
  // Move a "resultLine" para o final, dependendo da direção
  if (aRow.getData().resultLine === true) {
    return 0;
  } else if (bRow.getData().resultLine === true) {
    return dir === "asc" ? -1 : 1;
  }
  // Se houver uma função de ordenação personalizada, utiliza-a
  if (setCustomSort) return setCustomSort(a, b);
  // Caso contrário, usa a ordenação padrão com base na comparação de strings
  return a.localeCompare(b);
}
/**
 * Função de ordenação personalizada. Pode ser substituída por uma lógica de ordenação específica.
 * Atualmente, utiliza a comparação padrão de strings.
 *
 * @param {string} a - Valor a ser comparado.
 * @param {string} b - Valor a ser comparado.
 * @returns {number} - Valor de comparação para a ordenação.
 */
function setCustomSort(a, b) {
  return a.localeCompare(b);
}
```
## Responsividade

Para garantir a responsividade da tabela em dispositivos com telas menores, é possível ativar o modo collapse, que move automaticamente as colunas que não cabem na tela para uma área expansível em formato de lista. Para habilitar esse comportamento, é necessário configurar os seguintes parâmetros na tabela:

# responsiveLayout: "collapse"
responsiveLayoutCollapseFormatter: LiquidCorp.BradTableService.customCollapse

Além disso, é obrigatório adicionar uma coluna inicial que será responsável por exibir o botão de expansão das informações ocultas.

# Exemplo de utilização:

```
let tableConfiguration = {
...
responsiveLayout: "collapse",
responsiveLayoutCollapseFormatter: LiquidCorp.BradTableService.customCollapse,
columns: [
    {
      field: "collapse",
      formatter:
        LiquidCorp.BradTableService.customResponsiveCollapseFormatter,
      width: 55,
      minWidth: 55,
      resizable: false,
      headerSort: false,
    },
]
};
```
Exemplos
Default
```
<div id="table-180" class="brad-table"></div>
```
Action Bar With Selected Rows Counter
```
<div class="brad-flex brad-flex-column">
  <div id="table-409" class="brad-table"></div>
  <div
    class="brad-flex brad-flex-wrap brad-flex-justify-content-between brad-flex-align-items-center brad-bg-color-cta brad-p-xl"
  >
    <p
      id="text-table-409"
      class="brad-font-title-sm brad-text-color-neutral-0 brad-m-xs-r"
    >
      0 itens selecionados
    </p>
    <div class="brad-flex brad-flex-wrap brad-flex-align-items-center">
      <button
        class="brad-btn brad-btn-text brad-btn--auto brad-btn-text--on-color"
      >
        <span>Aprovar</span>
      </button>
      <button
        class="brad-btn brad-btn-text brad-btn--auto brad-btn-text--on-color"
      >
        <span>Reprovar</span>
      </button>
    </div>
  </div>
</div>
```
Action Bar With Icons
```
<div class="brad-flex brad-flex-column">
  <div id="table-124" class="brad-table"></div>
  <div
    class="brad-flex brad-flex-wrap brad-flex-justify-content-between brad-flex-align-items-center brad-bg-color-cta brad-p-xl"
  >
    <p class="brad-font-title-sm brad-text-color-neutral-0 brad-m-xs-r">
      Label text
    </p>
    <div class="brad-flex brad-flex-wrap brad-flex-align-items-center">
      <button
        class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active brad-m-xs-r"
      >
        <em><em class="fab-icon i icon-ui-placeholder"></em></em>
      </button>
      <button
        class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
      >
        <em><em class="fab-icon i icon-ui-placeholder"></em></em>
      </button>
    </div>
  </div>
</div>
```
Action Bar With Buttons And Icons
```
<div class="brad-flex brad-flex-column">
  <div id="table-158" class="brad-table"></div>
  <div
    class="brad-flex brad-flex-wrap brad-flex-justify-content-between brad-flex-align-items-center brad-bg-color-cta brad-p-xl"
  >
    <p
      id="text-table-158"
      class="brad-font-title-sm brad-text-color-neutral-0 brad-m-xs-r"
    >
      Label Text
    </p>
    <div class="brad-flex brad-flex-wrap brad-flex-align-items-center">
      <button
        class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active brad-m-xs-r"
      >
        <em><em class="fab-icon i icon-ui-placeholder"></em></em>
      </button>
      <button
        class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active brad-m-xs-r"
      >
        <em><em class="fab-icon i icon-ui-placeholder"></em></em>
      </button>
      <button
        class="brad-btn brad-btn-text brad-btn-text brad-btn--auto brad-btn-text--on-color"
      >
        <span>Aprovar</span>
      </button>
      <button
        class="brad-btn brad-btn-text brad-btn-text brad-btn--auto brad-btn-text--on-color"
      >
        <span>Reprovar</span>
      </button>
    </div>
  </div>
</div>
```