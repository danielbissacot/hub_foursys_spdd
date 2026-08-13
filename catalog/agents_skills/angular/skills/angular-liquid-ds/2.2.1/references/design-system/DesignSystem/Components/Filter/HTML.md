# Filter

O componente brad-filter é, essencialmente, um botão com especificidades visuais e comportamentais voltadas para o contexto de filtragem. No entanto, ele não depende necessariamente de filtros para existir: pode ser utilizado em diferentes cenários onde se deseja um botão com aparência e feedback de filtro, mas que aciona qualquer tipo de conteúdo ou ação.

# Templates

O componente filter base é flexível e pode ser usado com diferentes composições. Confira os templates disponíveis:

## Confira os templates disponíveis:

Filter Sheet Flow - Exemplo de uso do brad-filter como botão de filtro que pode abrir um bottom sheet com qualquer conteúdo, não apenas filtros tradicionais. Demonstra a flexibilidade do componente para diferentes jornadas e composições.
Documentação
Uso do HTML
Single
```
<button id="brad-filter" class="brad-filter brad-filter--md brad-flex brad-flex-align-items-center" aria-label="Label">
<label aria-hidden="true">Label</label>
<div aria-hidden="true" class="brad-filter__icon-area brad-flex">
  <em class="brad-filter__icon brad-filter__icon--single"></em>
</div>
</button>
```
Multi
```
<button
id="brad-filter"
class="brad-filter brad-flex brad-flex-align-items-center"
>
<label>Multi Select</label>
<div aria-hidden="true" class="brad-filter__icon-area brad-flex">
  <em class="brad-filter__icon brad-filter__icon--multi"></em>
</div>

<div aria-hidden="true" class="brad-badge brad-badge--number brad-bg-color-neutral-0" aria-label="99+" role="text">
  <label class="brad-text-color-cta" aria-hidden="true"></label>
</div>
</button>
```
Comportamento Javascript
## Inicialização

## Para inicializar o serviço do filtro:

```
const service = LiquidCorp.BradFilterService.getInstance({
targetSelector: "#brad-filter",
type: "multi",
});
```
## getInstances

Use getInstances para criar múltiplas instâncias, passando um array de opções:

```
const instances = BradFilterService.getInstance(
{ targetSelector: "#id1", type: "single" /* ou "multi" */ },
);
```
## Opções

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| type | string | "single" | Tipo do filtro: "single" ou "multi" |

# Métodos

| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | options | Cria uma instância do serviço |
| getInstances | [options] | Cria múltiplas instâncias |
| destroy | - | Destroi a instância, limpando referências |
| update | value, filtered | Atualiza o filtro. - value: número de selecionados (multi) ou label (single). - filtered: booleano, só para single, indica se está filtrado/selecionado. Para multi, ignore este parâmetro. |
| rotateChevron | isExpanded | Rotaciona o ícone chevron do filtro single |

# Uso básico
Single
```
const service = BradFilterService.getInstance({
targetSelector: "#brad-filter-single",
type: "single"
});

service.rotateChevron(true);
service.update("Filtrado", true);
```
Multi
```
const service = BradFilterService.getInstance({
targetSelector: "#brad-filter",
type: "multi"
});

service.update(2);
```
## Observações

O componente por padrão apresenta o comportamento de troca de label e indicação de número de selecionados, sua implementação lógica deverá ser implementada pelo desenvolvedor em sua respectiva jornada.

# Acessibilidade

Adicione o atributo aria-expanded ao elemento de controle para indicar o estado expandido ou recolhido do filtro. O valor deve ser alternado dinamicamente:

```
<button
aria-label="Multi Select"
aria-expanded="false"
id="brad-filter"
class="brad-filter brad-flex brad-flex-align-items-center"
>
<label>Multi Select</label>
<div aria-hidden="true" class="brad-filter__icon-area brad-flex">
  <em class="brad-filter__icon brad-filter__icon--multi"></em>
</div>
<div aria-hidden="true" class="brad-badge brad-badge--number brad-bg-color-neutral-0" aria-label="99+" role="text">
  <label class="brad-text-color-cta" aria-hidden="true"></label>
</div>
</button>
```

## Exemplo para alternar o valor de aria-expanded:

```
function handleFilter() {
const button = document.getElementById("brad-filter");
const currentAriaExpanded = button.getAttribute("aria-expanded");
const newAriaExpanded = currentAriaExpanded === "false" ? "true" : "false";
button.setAttribute("aria-expanded", newAriaExpanded);
}
```
Exemplos
Single [sem filtro]
```
<button
  id="filter-215"
  class="brad-filter brad-filter--md brad-flex brad-flex-align-items-center"
  aria-label="Label"
  
>
  <label aria-hidden="true">Label</label>

  <div aria-hidden="true" class="brad-filter__icon-area brad-flex">
    <em class="brad-filter__icon brad-filter__icon--single"></em>
  </div>

  
</button>
```
Single [com filtro]
```
<button
  id="filter-52"
  class="brad-filter brad-filter--md brad-flex brad-flex-align-items-center"
  aria-label="Label"
  
>
  <label aria-hidden="true">Label</label>

  <div aria-hidden="true" class="brad-filter__icon-area brad-flex">
    <em class="brad-filter__icon brad-filter__icon--single"></em>
  </div>

  
</button>
```
Multiple [sem filtros]
```
<button
  id="filter-309"
  class="brad-filter brad-filter--md brad-flex brad-flex-align-items-center"
  aria-label="Label"
  
>
  <label aria-hidden="true">Label</label>

  <div aria-hidden="true" class="brad-filter__icon-area brad-flex">
    <em class="brad-filter__icon brad-filter__icon--multi"></em>
  </div>

  <div
    class="brad-badge brad-badge--number brad-bg-color-neutral-0"
    role="text"
    aria-hidden="true"
  >
    <label class="brad-text-color-cta" aria-hidden="true"></label>
  </div>
</button>
```
Multiple [com filtros]
```
<button
  id="filter-3"
  class="brad-filter brad-filter--md brad-flex brad-flex-align-items-center"
  aria-label="Label"
  
>
  <label aria-hidden="true">Label</label>

  <div aria-hidden="true" class="brad-filter__icon-area brad-flex">
    <em class="brad-filter__icon brad-filter__icon--multi"></em>
  </div>

  <div
    class="brad-badge brad-badge--number brad-bg-color-neutral-0"
    role="text"
    aria-hidden="true"
  >
    <label class="brad-text-color-cta" aria-hidden="true"></label>
  </div>
</button>
```