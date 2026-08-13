# Pagination

O Pagination é um componente que tem a função de organizar conteúdo de dados em páginas sequenciais ou exibição gradativa em mesma página, trazendo maior usabilidade durante o consumo da informação pelo usuário.

# Uso do WebComponent
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-pagination | Componente | Sim | Sim | Componente principal do Pagination, define a estrutura de páginas de acordo com seus atributos |
| brad-pagination-label | Sub-Componente | Não | Sim | Sub-componente que define uma label a ser exibida indicando a página atual e quantas páginas existem |

# Propriedades
## brad-pagination

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | - | Identificador do elemento alvo para ser utilizado na criação interna do serviço |
| brad-current-page | number | 1 | Indica qual será a página inicial ativa |
| brad-total-pages | number | 1 | Indica a quantia total de páginas |
| brad-count-numbers-start | number | 3 | Indica a quantidade de botões que irão aparecer |
| brad-type | "numbered", "compact" | "numbered" | Determina a aparência da paginação exibida |
| brad-is-indeterminate | boolean | false | Escolhe a versão indeterminada do componente |
| brad-on-color | boolean | false | Alterna as cores do componente para uso sobre fundos variados. |

# brad-pagination-label

O subcomponente brad-pagination-label pode ser utilizado para exibir um label informativo da página atual e quantidade total de páginas no formato "Página X de Y".

Este subcomponente não possui atributos configuráveis e funciona de forma automática, atualizando seu conteúdo sempre que a página atual é alterada.

# Exemplo de Uso
Paginação Básica (Numbered)
```
<brad-pagination
  id="pagination-numbered"
  brad-type="numbered"
  brad-current-page="1"
  brad-total-pages="20"
  brad-count-numbers-start="7"
  brad-is-indeterminate="false"
  brad-on-color="false"
>
</brad-pagination>
```
Paginação Compacta com Label
```
<brad-pagination
  id="pagination-compact"
  brad-type="compact"
  brad-current-page="1"
  brad-total-pages="20"
  brad-is-indeterminate="false"
  brad-on-color="false"
>
  <brad-pagination-label></brad-pagination-label>
</brad-pagination>
```
Comportamento Javascript
## Inicialização

A inicialização do serviço não é necessária, porém, ainda é possível acessar a instância do serviço da seguinte forma:

```
const ePagination = document.getElementById(ID_DO_PAGINATION);
const service = ePagination.service;
```
## Eventos

| Elemento | Método | Evento | Descrição |
| --- | --- | --- | --- |
| brad-pagination | addEventListener | "pageChanges" | Evento disparado ao alterar as propriedades de paginação |

# Observações

Ainda é possível utilizar uma label customizada, caso opte por não utilizar o sub-componente brad-pagination-label, abaixo segue um exemplo de como fazê-lo:

## Exemplo utilizando label customizável na versão compact
```
const ePagination = document.getElementById(ID_DO_PAGINATION);

function updateLabelText() {
const labelText = `Página ${ePagination.currentPage} de ${ePagination.totalPages}`;
if (compactLabel) {
ePagination.querySelector("label").innerHTML = labelText;
}
}

function onPageChanges() {
ePagination.addEventListener("pageChanges", () => {
updateLabelText();
},
false
);
}

/* eventListener customizado, usado para obter informações de página atual, última página acessada e elemento clicado */
function onPageChanges() {
ePagination.addEventListener("pageChanges", () => {
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

updateLabelText();
onPageChanges();
```
## Acessibilidade

A acessibilidade, neste componente, é disponibilizada pelo serviço, certifique-se de não adicionar tabindex="0" aos elementos na estrutura incial, para não atrair o foco da navegação, e comprometer a leitura correta.

# Exemplo
```
<div class="examples">
  <brad-pagination
    id="pagination-38"
    brad-type="numbered"
    brad-current-page="1"
    brad-total-pages="20"
    brad-count-numbers-start="7"
    brad-is-indeterminate="false"
    brad-on-color="false"
  >
    
  </brad-pagination>
</div>
```