# IconTitleDescriptionColors

Esse template foi idealizado para exemplificar o uso do card em contexto de ofertas e comunicações tendo seu padrão visual definido pelo time de design do liquid. Os elementos que caracterizam esse exemplo são:


O título - este elemento possuí limitação de caracteres, podendo ser exibido com o máximo de 2 linhas e alinhado ao topo para esse cenário ou uma linha e nesse caso ficará centralizado ao ícone.


O ícone - um elemento padrão desse modelo, que pode receber qualquer imagem disponível na biblioteca, sendo este item obrigatório.


A descrição - também é um elemento obrigatório, podendo ter variação com suporte de até 3 linhas para o caso de cards que não possuem botão de interação.


O botão de interação - é o único elemento opcional e pode ser utilizado de acordo com a necessidade do protótipo.


Caso seu protótipo precise de flexibilidade utilize o componente card.


.

# Uso do HTML
```
<div class="brad-card-icon-title-description brad-flex brad-theme-classic">
  <div class="brad-card brad-card--default brad-card--limit-card brad-p-xl-y brad-p-xxl-x brad-shadow-0 brad-color-extended-blue-gradient-135">
    <div class="brad-card-icon-title-description__top-content brad-flex">
      <div class="brad-m-xs-r brad-card-icon-title-description__icon">
        <em class="icon-ui-placeholder brad-text-color-on-bg-primary brad-icon-size-lg"></em>
      </div>

      <div class="brad-flex brad-card-icon-title-description__title-area">
        <h2 class="brad-card-icon-title-description__title-area--title brad-font-title-lg brad-text-color-on-bg-primary">Lorem ipsum</h2>
      </div>
    </div>

    <div class="brad-card-icon-title-description__bottom-content">
      <p class="brad-font-paragraph-sm brad-card-icon-title-description__bottom-content--description brad-text-color-on-bg-primary brad-p-sm-t brad-p-md-b">Description - Lorem ipsum dolor sit.</p>

      <button class="brad-btn brad-btn-secondary brad-btn-secondary--md brad-btn-secondary--on-color brad-btn--auto">Button</button>
    </div>
  </div>
</div>
Copy
```


Posicionamento do título e ajuste no padding de variação com botão ou sem
Título com no máximo 2 linhas e alinhado ao topo do ícone. Aprox. 38 caracteres.
Título com 1 linha e alinhado ao centro do ícone. Aprox. 15 caracteres.


Para utilizar essa lógica pode ser usado o seguinte método de exemplo, passando como parâmetro o conjunto de cards:

```
function alignTitleAndSetPadding(cards) {
  cards.forEach((card) => {
    const titleArea = card.querySelector(".brad-card-icon-title-description__title-area");
    const title = titleArea.querySelector(".brad-card-icon-title-description__title-area--title");
    const button = card.querySelector(".brad-card-icon-title-description__bottom-content button");

    if (!button) {
      card.classList.remove("brad-p-xl-y");
      card.classList.add("no-button");
    }

    const lineHeight = parseFloat(window.getComputedStyle(title).lineHeight);
    const titleHeight = title.offsetHeight;
    const lines = Math.round(titleHeight / lineHeight);

    const alignClass = lines > 1 ? "brad-flex-align-items-top" : "brad-flex-align-items-center";
    titleArea.classList.add(alignClass);
  });
}

const cards = document.querySelectorAll(".brad-card-icon-title-description .brad-card");
alignTitleAndSetPadding(cards);
Copy
```


# Uso de variações de cores

A classe da cor deve ser adicionada na div do card substituindo o ${color} do exemplo a seguir: <div class="brad-card brad-card--default brad-card--limit-card brad-p-xl-y brad-p-xxl-x brad-shadow-0 ${color}">



# Exemplo
```
<div class="brad-card-icon-title-description brad-flex brad-theme-classic">
  <div class="brad-card brad-card--default brad-card--limit-card brad-p-xl-y brad-p-xxl-x brad-shadow-0 brad-color-extended-blue-gradient-135">
    <div class="brad-card-icon-title-description__top-content brad-flex">
      <div class="brad-m-xs-r brad-card-icon-title-description__icon">
        <em class="icon-ui-placeholder brad-text-color-on-bg-primary brad-icon-size-lg"></em>
      </div>

      <div class="brad-flex brad-card-icon-title-description__title-area">
        <h2 class="brad-card-icon-title-description__title-area--title brad-font-title-lg brad-text-color-on-bg-primary">Lorem ipsum</h2>
      </div>
    </div>

    <div class="brad-card-icon-title-description__bottom-content">
      <p class="brad-font-paragraph-sm brad-card-icon-title-description__bottom-content--description brad-text-color-on-bg-primary brad-p-sm-t brad-p-md-b">
        Description - Lorem ipsum dolor sit.
      </p>

      <button class="brad-btn brad-btn-secondary brad-btn-secondary--md brad-btn-secondary--on-color brad-btn--auto">
        Button
      </button>
    </div>
  </div>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| color | Altera cor do fundo com classe de cores dos utilitários string |  | Choose option... brad-color-extended-blue-gradient-135 brad-color-extended-green-gradient-135 brad-color-extended-red-gradient-135 brad-color-extended-violet-gradient-135 brad-color-extended-purple-gradient-135 brad-color-extended-salmon-gradient-135 brad-bg-color-extended-green-dark brad-bg-color-extended-blue-dark brad-bg-color-extended-purple-dark brad-bg-color-extended-violet-dark brad-bg-color-extended-salmon-dark brad-bg-color-extended-red-dark brad-bg-color-extended-yellow-dark |
| showButton | Altera segmento dos estilos boolean |  | Choose option... true false |