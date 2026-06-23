# Pagination

O Pagination é um componente que tem a função de organizar conteúdo de dados em páginas sequenciais ou exibição gradativa em mesma página, trazendo maior usabilidade durante o consumo da informação pelo usuário.

# Uso do HTML
```
<div id="brad-pagination" class="brad-pagination">
<ul class="brad-pagination__pages brad-flex-justify-content-center"></ul>
</div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do Pagination

```
const currentPage = 1;
const totalPages = 20;
const countNumbersStart = 7;
const isIndeterminate = false;

const service = LiquidCorp.BradPaginationService.getInstance({
targetSelector: "#brad-pagination",
currentPage,
totalPages,
countNumbersStart,
isIndeterminate,
});
```
## Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| currentPage | number | - | Indica qual será a página inicial ativa |
| totalPages | number | - | Indica a quantia total de páginas |
| countNumbersStart | number | - | Indica a quantia de botões que irão aparecer |
| isIndeterminate | boolean | false | Escolhe a versão indeterminada do componente |

## Exemplo utilizando label customizavél na versão compact
```
const service = LiquidCorp.BradPaginationService.getInstance({
targetSelector: "#brad-pagination",
currentPage: 1,
totalPages: 20,
countNumbersStart: 7,
isIndeterminate: false,
});

function updateLabelText(service) {
const labelText = `Página ${service.currentPage} de ${service.totalPages}`;
if (compactLabel) {
service.ePaginationContainer.querySelector("label").innerHTML = labelText;
}
}

function onPageChanges(service) {
service.ePaginationContainer.addEventListener(
"pageChanges",
() => {
updateLabelText(service);
},
false
);
}

/* eventListener customizado, usado para obter informações de página atual, última página acessada e elemento clicado */
function onPageChanges(service) {
service.ePaginationContainer.addEventListener(
"pageChanges",
() => {
console.log(event.detail);
/*
/** Output:
{
previousAccessedPage: Number,
currentPage: Number,
elementClicked: HTMLElement,
}
*/
},
false
);
}

updateLabelText(service);
onPageChanges(service);
```
Exemplo de alteração dinâmica do totalPages
```
function alterarTotalPages() {
/*
  update(paginaAtual,totalPages)
*/
LiquidCorp.BradPaginationService.getInstance(this.optionsExample).update(
  1,
  30
);
}
```
## Acessibilidade

A acessibilidade, neste componente, é disponibilizada pelo serviço, certifique-se de não adicionar tabindex="0" aos elementos na estrutura incial, para não atrair o foco da navegação, e comprometer a leitura correta.

Segue exemplo do uso do HTML.

```
<div id="brad-pagination" class="brad-pagination">
<ul class="brad-pagination__pages brad-flex-justify-content-center"></ul>
</div>
```
Exemplo
```
<div class="examples">
  <div
    id="pagination-359"
    class="brad-pagination   brad-flex-justify-content-center"
  >
    
    <ul class="brad-pagination__pages"></ul>
  </div>
</div>
```