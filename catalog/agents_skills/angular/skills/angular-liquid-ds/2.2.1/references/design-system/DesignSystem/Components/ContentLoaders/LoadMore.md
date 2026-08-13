# LoadMore

Botões em que o usuário pode clicar para ver além do conjunto inicial de resultado exibidos.
O componente "Load More" pode ser utilizado em diversas situações, e dependendo da quantidade de conteúdo, podendo ter o auxílio de um ícone para indicar a possibilidade de esconder o conteúdo.
.

# Uso do HTML
```
<!-- START: Conteúdo HTML utilizado apenas para uma demonstração de uso do componente -->
<section id="load-more-your-content-here" class="your-content-here"></section>
<!-- END: Conteúdo HTML utilizado apenas para uma demonstração de uso do componente -->

<!-- START: Componente -->
<div id="load-more" class="brad-load-more" onclick="generateItems()"></div>
<!-- END: Componente -->
Copy
```
Estilos
OnColor
```
<!-- START: Conteúdo HTML utilizado apenas para uma demonstração de uso do componente -->
<section id="load-more-your-content-here" class="your-content-here"></section>
<!-- END: Conteúdo HTML utilizado apenas para uma demonstração de uso do componente -->

<!-- START: Componente -->
<div id="load-more" class="brad-load-more brad-load-more--on-color" onclick="generateItems()"></div>
<!-- END: Componente -->
Copy
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do LoadMore

```
const targetSelector = "#load-more";
const options = { targetSelector, showText: "Show", hideText: "Hide", icon: "right" };
const service = LiquidCorp.BradLoadMoreService.getInstance(options);

/** Exemplo de uso para criação do conteúdo dinâmica conforme clica no botão do componente "Load More" */
function generateItems() {
  const eContent = document.querySelector(`#load-more-your-content-here`);
  const totalChildrenCount = eContent.childElementCount;
  const count = totalChildrenCount + 1;
  const max = 6;
  const quantityPerPage = 3;

  if (count <= max) {
    add();
  } else {
    remove();
  }

  function remove() {
    eContent.innerHTML = "";
    service.toggle();
  }

  function add() {
    const total = count + quantityPerPage;

    for (let i = count; i < total; i++) {
      const eItem = document.createElement("div");
      eItem.classList.add("brad-list-item", "brad-font-title-md", "brad-p-lg-y", "brad-p-sm-x");

      const eParagraph = document.createElement("p");
      eParagraph.classList.add("brad-text-color-neutral-60");
      eParagraph.textContent = `Text goes here ${i}`;
      eItem.appendChild(eParagraph);

      eContent.appendChild(eItem);

      if (eContent.childElementCount >= max) {
        service.toggle();
      }
    }
  }
}
Copy
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object {}], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| showText | string | "Show" | Texto que será exibido quando o isShowText for true |
| hideText | string | "Hide" | Texto que será exibido quando o isShowText for false |
| icon | string | "left", "right" | Caso passe vazio, não aparecerá o ícon de seta, caso passe left ou right, aparecerá o ícone do lado respectivo |
| isShowText | string | true | É usado para determinar se aparecerá showText ou hideText |

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| showMode | boolean | Caso seja true, mostrará o showText, caso seja false, mostrará o hideText |
| toggle | - | Alterna entre showText e hideText |

# Obervações

O componente é apenas visual, toda lógica de aparecer e desaparecer com o conteúdo será responsabilidade da jornada,
caso queira um exemplo de uso: .

# Acessibilidade

Certifique-se de adicionar tabindex=0 em cada elemento que corresponde a um item dentro do loadmore. Esse atributo serve para indicar que esse elemento deve ser incluído na ordem padrão de tabulação da página, seguindo a ordem normal em que os elementos aparecem no código HTML.

É necessário incluir o atributo aria-label em cada elemento que corresponde a um item dentro do loadmore, cujo valor deve ser o título do item seguido da posição e depois o total de intens existente, possibilitando ao usuário, que utiliza o leitor de tela, saber em que item ele está de quantos.



Exemplo de código listado acima na inicialização adaptado para aplicar acessibilidade:

```
function generateItems() {
  const eContent = document.querySelector(`#${id}-your-content-here`);
  eContent.innerHTML = "";
  const totalChildrenCount = eContent.childElementCount;
  const count = totalChildrenCount + 1;
  const max = 6;

  if (count <= max) {
    add();
  } else {
    remove();
  }

  function remove() {
    LiquidCorp.BradLoadMoreService.toggle();
  }

  function add() {
    const total = count + 3;
    const currentElementFocus = total - 3;

    for (let i = 1; i < total; i++) {
      const eItem = document.createElement("div");
      const ariaLabel = `Text goes here ${i} de ${total - 1}`;
      eItem.setAttribute("tabindex", "0");
      eItem.setAttribute("aria-label", ariaLabel);
      eItem.classList.add("brad-list-item", "brad-font-title-md", "brad-p-lg-y", "brad-p-sm-x");

      const eParagraph = document.createElement("p");

      eParagraph.classList.add("brad-text-color-neutral-60");
      eParagraph.setAttribute("aria-hidden", "true");
      eParagraph.textContent = `Text goes here ${i}`;

      eItem.appendChild(eParagraph);

      eContent.appendChild(eItem);

      if (currentElementFocus == i) {
        eItem.focus();
      }

      if (eContent.childElementCount >= max) {
        LiquidCorp.BradLoadMoreService.toggle();
      }
    }
  }
}
Copy
```
Exemplo
```
<div class="examples">
  <section id="bs-143-your-content-here" class="your-content-here"></section>
  <div
    id="bs-143"
    class="brad-load-more"
    onclick="generateItems()"
  ></div>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| backgroundColor | Altera cor de fundo string |  | Choose option... no-background-color brad-bg-color-primary brad-bg-color-secondary brad-bg-color-institucional |
| onColor | Estado de mudança de cor para fundos escuros. Obs: Ativando o modo on-color é recomendado alterar a cor do background do storybook para on-color no ícone de galeria no canto superior esquerdo. boolean |  | FalseTrue |
| showText | Texto que aparecerá quando o isShowText for 'true'. string |  |  |
| hideText | Texto que aparecerá quando o isShowText for 'false'. string |  |  |
| icon | Determina em que lado o ícone de seta aparecerá, caso não passe nenhum lado left \| right, o ícone não aparecerá. string |  | Choose option... left right |
| isShowText | Determina qual texto vai aparecer, se for true, aparecerá o showText, se for false, aparecerá o hideText. boolean |  | FalseTrue |