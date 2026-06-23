# HTML

É um componente que permite agrupar e organizar verticalmente itens de conteúdo relacionado.
.

# Uso do HTML
```
<div id="list-100" class="brad-list-item brad-font-title-md brad-p-lg-y brad-p-sm-x">
  <p>Text goes here.</p>
</div>
Copy
```
Comportamento Javascript
## Inicialização

Inicialização não é necessária (componente nativo), porém para facilitar adição das classes que determinam os estados recomenda-se o seguinte:

```
const item = document.getElementById("list-100");
item.classList.addClass("brad-list-item--selected");
// Abaixo a tabela mostra todos as classes e estados que o item pode ter
Copy
```
## Classes (estados)

| Classes (estados) | Descrição |
| --- | --- |
| brad-list-item--on-color | Variação para fundos coloridos |
| brad-list-item--selected | Seleciona o item |
| brad-list-item--disabled | Desativa o item (impedindo interações) |
| brad-list-item--line-top | Atribui linha no top do item |
| brad-list-item--line-bottom | Atribui linha no bottom do item |

# Obervações
## Responsividade

A largura do componente é 100% do elemento pai, ou seja, caso queira modificar o tamanho, só determinar no container que o componete estiver.
Caso queira que o componente tenha o tamanho do seu texto, é só colocar display: flex; no container que o componete estiver.

# Acessibilidade

Certifique-se de adicionar tabindex="0" na <div>, que contem o texto do item do list-item. Esse atributo com valor "0" faz com que esse elemento seja focável por meio da navegação pelo teclado (como a tecla Tab) na ordem em que aparece no código HTML; possibilitando a identificação pelo leitor de tela. E adicione um atributo aria-label com o texto a ser lido ja contendo a posição e a quantidade da lista, logo abaixo segue um script de exemplo.


```
<div id="list-100" class="brad-list-item brad-font-title-md brad-p-lg-y brad-p-sm-x">
  <p tabindex="0" aria-label="Texto do item 1 de 3">Texto do item 1.</p>
  <p tabindex="0" aria-label="Texto do item 2 de 3">Texto do item 2.</p>
  <p tabindex="0" aria-label="Texto do item 3 de 3">Texto do item 3.</p>
</div>
Copy
```



Script que exemplifica uma de várias forma de gerar o aria-label dinamicamente em cada item da lista de items.

```
function addAriaLabels(listId) {
  const list = document.getElementById(listId);
  const items = list.querySelectorAll('p[tabindex="0"]');
  const totalItems = items.length;

  items.forEach((item, index) => {
    const position = index + 1;
    const ariaLabel = `Texto do item ${position} de ${totalItems}`;
    item.setAttribute("aria-label", ariaLabel);
  });
}

// Exemplo de uso: adicionando aria-labels à lista com id "list-100"
addAriaLabels("list-100");
Copy
```
Exemplo
```
<div class="examples">
  <div
    class="brad-list-item brad-font-title-md brad-p-lg-y brad-p-sm-x"
    tabindex="0"
  >
    <p>Text goes here.</p>
  </div>

  <div
    class="brad-list-item brad-font-title-md brad-p-lg-y brad-p-sm-x"
    tabindex="0"
  >
    <p>Text goes here.</p>
  </div>

  <div
    class="brad-list-item brad-font-title-md brad-p-lg-y brad-p-sm-x"
    tabindex="0"
  >
    <p>Text goes here.</p>
  </div>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| backgroundColor | Altera cor de fundo string |  | Choose option... no-background-color brad-bg-color-primary brad-bg-color-secondary brad-bg-color-institucional |
| onColor | Estado de mudança de cor para fundos escuros. Obs: Ativando o modo on-color é recomendado alterar a cor do backgroundColor para primary, secondary ou gradient. boolean |  | FalseTrue |
| selected | Adiciona classe que seleciona o item: brad-list-item--selected boolean |  | FalseTrue |
| disabled | Adiciona classe que desativa o item: brad-list-item--disabled boolean |  | FalseTrue |
| lineTop | Adiciona classe que atribui linha no top do item: brad-list-item--line-top boolean |  | FalseTrue |
| lineBottom | Adiciona classe que atribui linha no bottom do item: brad-list-item--line-bottom boolean |  | FalseTrue |
| content | Conteúdo do componente string |  |  |