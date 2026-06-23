# InfiniteScroll

Serviço para quando o usuário rolar até o fim da página/container aparecerá um loader para esperar o carregamento de novos elementos.
.

# Uso do HTML
```
<section id="infinite-scroll" class="your-content-here"></section>
Copy
```
Estilos
Loader OnColor
```
<section id="infinite-scroll" class="your-content-here brad-infinite-scroll--on-color"></section>
Copy
```
Comportamento Javascript
Inicialização
Inicializar elementos do InfiniteScroll para scroll da página inteira
```
const targetSelector = "#infinite-scroll";
const options = { targetSelector, isScrollingInPage: true };
const service = LiquidCorp.BradInfiniteScrollService.getInstance(options);

/** Exemplo de uso para criação do conteúdo dinâmica
 * conforme a barra de rolagem chegue ao final do container */
function generateItems() {
  const eContent = document.querySelector(`#infinite-scroll`);
  const totalChildrenCount = eContent.childElementCount;
  const count = totalChildrenCount + 1;

  add();

  function add() {
    const total = count + 10;

    for (let i = count; i < total; i++) {
      const eItem = document.createElement("div");
      eItem.classList.add("brad-list-item", "brad-font-title-md", "brad-p-lg-y", "brad-p-sm-x");

      const eParagraph = document.createElement("p");
      eParagraph.classList.add("brad-text-color-neutral-60");
      eParagraph.textContent = `Text goes here ${i}`;
      eItem.appendChild(eParagraph);

      eContent.appendChild(eItem);
    }
  }
}

/** Exemplo de uso para fim do carregamendo (loader),
 * usamos o setTimeout de 2 segundos para simular
 * o tempo que carregaria novos elementos na tela e
 * chamamos o método complete() para sumir com o loader */
service.eContainer.addEventListener("bradInfinite", () => {
  setTimeout(() => {
    generateItems();
    service.complete();
  }, 2000);
});
Copy
```
Inicializar elementos do InfiniteScroll para scroll apenas de um container de elementos específico
```
const targetSelector = "#infinite-scroll";
const options = { targetSelector };
const service = LiquidCorp.BradInfiniteScrollService.getInstance(options);

/** Exemplo de uso para criação do conteúdo dinâmica
 * conforme a barra de rolagem chegue ao final do container */
function generateItems() {
  const eContent = document.querySelector(`#infinite-scroll`);
  const totalChildrenCount = eContent.childElementCount;
  const count = totalChildrenCount + 1;

  add();

  function add() {
    const total = count + 10;

    for (let i = count; i < total; i++) {
      const eItem = document.createElement("div");
      eItem.classList.add("brad-list-item", "brad-font-title-md", "brad-p-lg-y", "brad-p-sm-x");

      const eParagraph = document.createElement("p");
      eParagraph.classList.add("brad-text-color-neutral-60");
      eParagraph.textContent = `Text goes here ${i}`;
      eItem.appendChild(eParagraph);

      eContent.appendChild(eItem);
    }
  }
}

/** Exemplo de uso para fim do carregamendo (loader),
 * usamos o setTimeout de 2 segundos para simular
 * o tempo que carregaria novos elementos na tela e
 * chamamos o método complete() para sumir com o loader */
service.eContainer.addEventListener("bradInfinite", () => {
  setTimeout(() => {
    generateItems();
    service.complete();
  }, 2000);
});
Copy
```
## Obervações

Lembre-se que é necessário adicionar a seguinte combinação de estilos no container que o serviço de InfiniteScroll funcionará, pois sem não haverá scroll, mas apenas para o exemplo de um container de elementos específico:

```
.brad-scroll {
  height: 420px;
  overflow: auto;
}
Copy
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object {}], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| complete | boolean | Método utilizado para indicar o carregamento terminou |

# Obervações

Fique ciente que os testes do exemplo Page aqui não serão 100% fieis por limitações do Storybook, para um teste mais eficiente, clique aqui.

# Exemplo
```
<section
  id="is-120"
  class="your-content-here"
  style="height: 420px; overflow: auto;"
></section>
```
STORIES
Elements Container
```
<section
  id="is-120"
  class="your-content-here"
  style="height: 420px; overflow: auto;"
></section>
```
Page
```
<section id="is-381" class="your-content-here"></section>
```