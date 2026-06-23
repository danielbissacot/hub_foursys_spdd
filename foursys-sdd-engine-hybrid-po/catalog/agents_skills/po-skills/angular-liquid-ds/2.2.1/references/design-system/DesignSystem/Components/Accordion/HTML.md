# Accordion

Os Accordion (Expansíveis) são soluções utilizadas para suprimir informações secundárias quando determinada tela possui muito conteúdo.

# Templates

O componente accordion base é flexível e pode ser usado com diferentes composições. Confira os templates disponíveis:

Accordion Selectable Header - Template com elementos selecionáveis (checkbox/radio) no cabeçalho
## Documentação

# Uso do HTML
```
<div id="accordion" class="brad-accordion brad-bg-color-neutral-0">
<button role="button" class="brad-accordion__header brad-font-title-md" onclick="toggleAccordion()">
  <div class="brad-accordion__title">
    <h2 class="brad-font-title-md">Title</h2>
  </div>

  <em class="brad-accordion__icon"></em>

</button>

<div class="brad-accordion__content brad-font-paragraph-sm" aria-hidden="true">
  <p>Accordion body text goes here.</p>
</div>
</div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do accordion

```
const targetSelector = "#accordion";
const options = { targetSelector };

const service = LiquidCorp.BradAccordionService.getInstance(options);
// LiquidCorp.BradAccordionService.closeAll(); // Caso queria fechar todos os accordions (método estático)

function toggleAccordion() {
service.toggle();
}
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo:

[{targetSelector: "#idAccordion1"}, {targetSelector: "#idAccordion2"}, {targetSelector: "#idAccordion3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID ou .classe vinculado ao HTML do componente |


Agora é possível controlar o HTML do componente pelo targetSelector: (#accordion)

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| open | id ou vazio caso tenha feito a instância de algum accordion específico | Abre |
| close | id ou vazio caso tenha feito a instância de algum accordion específico | Fecha |
| toggle | (id ou vazio caso tenha feito a instância de algum accordion específico, boolean) | Alterna entre abrir e fechar, no segundo parâmetro caso passe true, ele fechará todos os outros accordions, deixando aberto apenas o último selecionado |
| closeAll | HTMLElement ou vazio | Fecha todos os accordions exceto o elemento do Accordion que for passado por parâmetro |
| destroy | vazio | Remove todos os event listeners e limpa as referências da instância para evitar vazamentos de memória |

# Uso básico
```
const targetSelector = "#accordion";
const options = { targetSelector };
const service = LiquidCorp.BradAccordionService.getInstance(options);

service.toggle();

// Importante: Chamar destroy quando não precisar mais da instância
// Exemplo: ao navegar para outra página, remover o componente, etc.
service.destroy();
```
## Acessibilidade

Certifique-se de adicionar aria-expanded ao elemento de controle. Esse atributo identifica se o Accordion está expandido ou não e tem como valores true ou false que devem ser alternados dinamicamente.

É necessário incluir o atributo aria-controls no elemento de controle do Accordion, cujo valor deve ser o id do conteúdo, possibilitando ao usuário, que utiliza o leitor de tela, consiga navegar diretamente até o conteúdo.

Caso o elemento que controle o Accordion não seja um botão, por exemplo, uma <div> ou <a>, então é importante incluir o atributo role="button".

```
<button
  id="toggleButton"
  aria-expanded="false"
  aria-controls="accordion-03"
  role="button"
  class="brad-accordion__header brad-p-lg-l brad-font-title-sm"
  onclick="accordionCard()">
</button>
```

Exemplo de código para mudar dinamicamente o valor do atributo aria-expanded:

```
function accordionCard() {
const targetSelector = "#accordion-215";
const options = { targetSelector };
LiquidCorp.BradAccordionService.getInstance(options).toggle();

const button = document.getElementById("toggleButton");
const currentAriaExpanded = button.getAttribute("aria-expanded");
const newAriaExpanded = currentAriaExpanded === "false" ? "true" : "false";
button.setAttribute("aria-expanded", newAriaExpanded);
}
```
## Exemplos

Obs: Use o botão show code abaixo do exemplo para ver o HTML.

# Accordion

Para o uso do accordion é importante seguir a logica de implementação do código, inserir todas as tags obrigatorias na ordem conforme o exemplo.

```
<div
  id="accordion-74"
  class="brad-accordion    "
>
  <button
    role="button"
    class="brad-accordion__header brad-font-title-md"
    onclick="LiquidCorp.BradAccordionService.toggle('#accordion-74')"
  >
    <div class="brad-accordion__title ">
      <!-- SEM TRAILING ICON -->
      <h2>Title</h2>
    </div>
    <em class="brad-accordion__icon"></em>
  </button>

  <div
    class="brad-accordion__content brad-font-paragraph-sm "
    aria-hidden="true"
  >
    <p>
    Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book.
  </p>
    <p class="brad-accordion__content--paragraph"><p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget
    aliquet massa. Fusce vestibulum feugiat massa ac ornare. Mauris ut neque
    congue, rutrum purus in, mattis ligula. Ut leo sapien, pulvinar et sodales
    non, rutrum nec ipsum. Vestibulum ullamcorper orci sit amet nisl ultricies
    ullamcorper sed id purus. Proin id mauris bibendum, vestibulum mi sed,
    scelerisque leo. Nam faucibus finibus tortor sed cursus.
  </p></p>
  </div>

  <div class="brad-accordion__footer brad-font-paragraph-sm">
        <p>Lorem ipsum dolor sit amet</p>
      </div>
</div>
```
## Accordion Card

Para uso do accordion com a customização do card deve ser inserido uma div antes da inicialização do accordion com as classes brad-card brad-card--default.

```
<div class="undefined">
  <div
    class="brad-card brad-card--default brad-card--overflow-hidden brad-card--auto "
  >
     
<div
  id="accordion-259"
  class="brad-accordion  brad-accordion--without-both   "
>
  <button
    role="button"
    class="brad-accordion__header brad-font-title-md"
    onclick="LiquidCorp.BradAccordionService.toggle('#accordion-259')"
  >
    <div class="brad-accordion__title ">
      
      <h2>Title</h2>
    </div>
    <em class="brad-accordion__icon"></em>
  </button>

  <div
    class="brad-accordion__content brad-font-paragraph-sm "
    aria-hidden="true"
  >
    <p>
    Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book.
  </p>
    <p class="brad-accordion__content--paragraph"></p>
  </div>

  
</div>

  </div>
</div>
```
## Múltiplos Accordion

A utilização de múltiplos accordions é simples, apenas multiplique a estrutura mudando os IDs e personalizando o conteúdo de cada como desejar.

```
<div
  id="accordion-54"
  class="brad-accordion    brad-m-md-b"
>
  <button
    role="button"
    class="brad-accordion__header brad-font-title-md"
    onclick="LiquidCorp.BradAccordionService.toggle('#accordion-54')"
  >
    <div class="brad-accordion__title ">
      
      <h2>Title</h2>
    </div>
    <em class="brad-accordion__icon"></em>
  </button>

  <div
    class="brad-accordion__content brad-font-paragraph-sm "
    aria-hidden="true"
  >
    <p>
    Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book.
  </p>
    <p class="brad-accordion__content--paragraph"></p>
  </div>

  <div class="brad-accordion__footer brad-font-paragraph-sm">
        <p>Lorem ipsum dolor sit amet</p>
      </div>
</div>

  
<div
  id="accordion-412"
  class="brad-accordion    brad-m-md-b"
>
  <button
    role="button"
    class="brad-accordion__header brad-font-title-md"
    onclick="LiquidCorp.BradAccordionService.toggle('#accordion-412')"
  >
    <div class="brad-accordion__title ">
      
      <h2>Title</h2>
    </div>
    <em class="brad-accordion__icon"></em>
  </button>

  <div
    class="brad-accordion__content brad-font-paragraph-sm "
    aria-hidden="true"
  >
    <p>
    Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book.
  </p>
    <p class="brad-accordion__content--paragraph"></p>
  </div>

  <div class="brad-accordion__footer brad-font-paragraph-sm">
        <p>Lorem ipsum dolor sit amet</p>
      </div>
</div>

  
<div
  id="accordion-8"
  class="brad-accordion    brad-m-md-b"
>
  <button
    role="button"
    class="brad-accordion__header brad-font-title-md"
    onclick="LiquidCorp.BradAccordionService.toggle('#accordion-8')"
  >
    <div class="brad-accordion__title ">
      
      <h2>Title</h2>
    </div>
    <em class="brad-accordion__icon"></em>
  </button>

  <div
    class="brad-accordion__content brad-font-paragraph-sm "
    aria-hidden="true"
  >
    <p>
    Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book.
  </p>
    <p class="brad-accordion__content--paragraph"></p>
  </div>

  <div class="brad-accordion__footer brad-font-paragraph-sm">
        <p>Lorem ipsum dolor sit amet</p>
      </div>
</div>
```
## Accordion Footer

Use a tag brad-accordion-footer para inserir o conteúdo do footer no accordion.

```
<div
  id="accordion-190"
  class="brad-accordion    "
>
  <button
    role="button"
    class="brad-accordion__header brad-font-title-md"
    onclick="LiquidCorp.BradAccordionService.toggle('#accordion-190')"
  >
    <div class="brad-accordion__title ">
      
      <h2>Title</h2>
    </div>
    <em class="brad-accordion__icon"></em>
  </button>

  <div
    class="brad-accordion__content brad-font-paragraph-sm "
    aria-hidden="true"
  >
    <p>
    Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book.
  </p>
    <p class="brad-accordion__content--paragraph"></p>
  </div>

  <div class="brad-accordion__footer brad-font-paragraph-sm">
        <p>Lorem ipsum dolor sit amet</p>
      </div>
</div>
```
## Sem Padding Accordion

Remove os paddings existentes no título e no conteúdo do accordion.

```
<div
  id="accordion-304"
  class="brad-accordion    "
>
  <button
    role="button"
    class="brad-accordion__header brad-font-title-md"
    onclick="LiquidCorp.BradAccordionService.toggle('#accordion-304')"
  >
    <div class="brad-accordion__title brad-p-none-l">
      
      <h2>Title</h2>
    </div>
    <em class="brad-accordion__icon"></em>
  </button>

  <div
    class="brad-accordion__content brad-font-paragraph-sm brad-p-none-l"
    aria-hidden="true"
  >
    <p>
    Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book.
  </p>
    <p class="brad-accordion__content--paragraph"></p>
  </div>

  <div
        class="brad-accordion__footer brad-font-paragraph-sm brad-p-none-l"
      >
        <p>Lorem ipsum dolor sit amet</p>
      </div>
</div>
```