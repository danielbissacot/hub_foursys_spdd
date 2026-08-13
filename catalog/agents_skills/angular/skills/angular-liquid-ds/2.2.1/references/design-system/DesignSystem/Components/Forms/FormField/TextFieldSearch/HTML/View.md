# TextFieldSearch View
## Alterações nos valores de data-search

O valor "view" é a nova funcionalidade que substitui o antigo "search-view", que foi depreciado. Ambos ativam a visualização em tela cheia a partir do campo de busca.




O valor "trigger" substitui o antigo "gatilho", que também foi depreciado, e ambos ativam a visualização em tela cheia a partir de um elemento de gatilho externo.

A pesquisa é um método intuitivo de descoberta, que oferece aos usuários uma forma de explorar um site ou aplicativo por meio de palavras-chave. Nesse tipo de interação, ao tocar no campo de busca e começar a digitar, os resultados podem aparecer logo abaixo, em um menu suspenso (dropdown), ou o usuário pode ser direcionado para uma visualização em tela cheia.

Ao tocar no campo de busca o usuário é direcionado para uma visualização em tela cheia.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile <=767px | Sim | Sim |
| Tablet | Não | Não |
| Desktop | Não | Não |

# Uso do HTML
```
<div
id="filter"
data-search="view"
class="brad-text-field-search brad-text-field-search--view brad-m-md-b no-content"
>
<div class="search-container">
  <label class="brad-text-field  brad-m-md-b">
    <input
      aria-label="Campo de texto"
      class=""
      type="text"
      value=""
      placeholder="Buscar por produto ou serviço"
    />
    <small aria-hidden="true" class="placeholder-label-field"
      >Produtos e serviços</small
    >

    <button
      aria-label="Deletar texto"
      class="trailing-button-text complements delete"
    ></button>
    <button
      aria-label="Pesquisar"
      class="search trailing-button-text complements"
    ></button>

    <span class="helper-text"></span>
    <div class="brad-text-field--background"></div>
  </label>

  <button aria-label="Cancelar" class="trailing-button-text cancel">
    Cancelar
  </button>

</div>

<section
  class="search-view-options search-view-options__hide brad-p-lg-x brad-p-xl-b"
>
  <button
    role="option"
    data-search-value="Apple Pay"
    class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
  >
    <em
      class="i icon-transacional-conta-salario brad-icon-size-sm brad-m-xs-r"
    ></em>
    <p>Apple Pay</p>
  </button>

  <button
    role="option"
    data-search-value="Cartão virtual"
    class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
  >
    <em
      class="i icon-cartao-debito-credito brad-icon-size-sm brad-m-xs-r"
    ></em>
    <p>Cartão virtual</p>
  </button>

  <button
    role="option"
    data-search-value="Click to Pay"
    class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
  >
    <em
      class="i icon-transacional-conta-salario brad-icon-size-sm brad-m-xs-r"
    ></em>
    <p>Click to Pay</p>
  </button>

  <button
    role="option"
    data-search-value="Aviso de viagem"
    class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
  >
    <em class="i icon-category-plain brad-icon-size-sm brad-m-xs-r"></em>
    <p>Aviso de viagem</p>
  </button>

</section>
</div>
```
Como data-search, a estrutura HTML e as classes definem o comportamento do componente

A forma como o componente é instanciado pelo serviço BradTextFieldSearchService não depende apenas do valor do atributo data-search. O serviço avalia uma combinação de elementos para determinar automaticamente o tipo de comportamento a ser aplicado. Essa combinação inclui:

O atributo data-search Define qual tipo de busca será utilizado. Os tipos disponíveis são:

"dropdown": os resultados filtrados são exibidos em um menu suspenso (dropdown) abaixo do campo de busca. Esse conteúdo é sobreposto aos demais elementos da interface e não afeta o layout da página.
"static": os resultados da busca não estão visíveis inicialmente. À medida que o usuário digita, os itens filtrados aparecem logo abaixo do campo de busca, empurrando o conteúdo da página para baixo. Não há sobreposição visual (como dropdowns ou modais). É um comportamento totalmente embutido na estrutura da página.
"trigger" NEW: semelhante ao view, porém a view em tela cheia é ativada por um elemento de gatilho externo (como um botão, ícone ou qualquer outro elemento definido como acionador). A seleção de uma opção também fecha a view e retorna à tela anterior.
"gatilho" @DEPRECATED: semelhante ao view, porém a view em tela cheia é ativada por um elemento de gatilho externo (como um botão, ícone ou qualquer outro elemento definido como acionador). A seleção de uma opção também fecha a view e retorna à tela anterior.
"view" NEW: ao focar no campo de busca, uma view em tela cheia é exibida, cobrindo todo o conteúdo da aplicação (como um modal que ocupa 100% da tela). O campo de texto é fixado no topo e os resultados aparecem logo abaixo. Ao selecionar uma opção, a view é fechada e o usuário retorna ao estado anterior.
"search-view" @DEPRECATED: ao focar no campo de busca, uma view em tela cheia é exibida, cobrindo todo o conteúdo da aplicação (como um modal que ocupa 100% da tela). O campo de texto é fixado no topo e os resultados aparecem logo abaixo. Ao selecionar uma opção, a view é fechada e o usuário retorna ao estado anterior.

As classes CSS Classes como .brad-dropdown, .brad-text-field-search--static, .brad-search-view, entre outras, reforçam o comportamento visual e funcional esperado pelo serviço.

✅ Nesta documentação, o tipo demonstrado é o view, no qual, ao focar no campo de busca, uma view em tela cheia é exibida, cobrindo todo o conteúdo da página. O campo de texto fica fixado no topo da tela, e os resultados da pesquisa são exibidos logo abaixo. Após a seleção de uma opção, a view se fecha e o usuário retorna ao estado anterior da página.

Essa arquitetura torna o BradTextFieldSearchService flexível e adaptável a diferentes contextos, garantindo que o comportamento de busca seja ativado corretamente apenas com base na estrutura do HTML e nos atributos declarados.

# Comportamento Javascript
## Inicialização

Para inicializar o serviço, é necessário passar um objeto com as opções desejadas. O serviço pode ser inicializado de duas maneiras:

getInstance: Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options.
getInstances: Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options.
```
const targetSelector = "#filter";
const options = {
targetSelector,
};
const service = LiquidCorp.BradTextFieldSearchService.getInstance(options);
```
## Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| search.type | string | "prefix" | Tipo de busca: "prefix", "contains", "custom" |
| search.mode | string | "auto" | Modo de disparo: "auto", "manual" |
| search.customCallback | Function | null | Função customizada para busca quando type é "custom" |

# Custom Search Callback

Quando search.type é definido como "custom", você deve fornecer uma função em search.customCallback. Esta função será chamada para cada opção de busca para determinar se ela corresponde ao texto digitado pelo usuário.

## A função recebe três parâmetros:

text: O valor atual digitado no campo de entrada (string).
comparative: O valor do atributo data-search-value da opção (string).
option: O elemento DOM da opção (HTMLElement).

A função deve retornar true se a opção deve ser exibida (corresponde à busca) ou false caso contrário.

# Exemplo de uso:

```
const options = {
  targetSelector: "#filter",
  search: {
    type: "custom",
    mode: "auto",
    customCallback: (text, comparative, option) => {
      // Lógica customizada de busca
      // Por exemplo, busca insensível a maiúsculas/minúsculas
      return comparative.toLowerCase().includes(text.toLowerCase());
    },
  },
};
const service = BradTextFieldSearchService.getInstance(options);
Copy
```
Tipos de Busca e Modos
Tipos de Busca (search.type)
"prefix" (padrão): A busca verifica se o texto digitado corresponde ao início do valor da opção. Por exemplo, digitando "App" encontrará "Apple Pay" mas não "PayPal".
"contains": A busca verifica se o texto digitado está contido em qualquer parte do valor da opção. Por exemplo, digitando "Pay" encontrará tanto "Apple Pay" quanto "PayPal".
"custom": Permite uma lógica de busca personalizada através da função customCallback.
Modos de Busca (search.mode)
"auto" (padrão): A busca é executada automaticamente a cada alteração no campo de entrada (evento input).
"manual": A busca não é executada automaticamente. Para realizar a busca, chame o método service.search() manualmente.

Quando usar mode: "manual", você pode controlar quando a busca é disparada, por exemplo, após o usuário pressionar Enter ou clicar em um botão de busca.

# Exemplo com modo manual:

```
const options = {
  targetSelector: "#filter",
  search: {
    type: "contains",
    mode: "manual",
  },
};
const service = BradTextFieldSearchService.getInstance(options);

// Para disparar a busca manualmente
service.search();
Copy
```
## Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e [Inicialização]:


| Método | Parâmetro(s) | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| open | N/A | Abre a pesquisa, dropdown/view, dependendo do tipo do componente |
| close | N/A | Fecha a pesquisa, dropdown/view, dependendo do tipo do componente |

# Eventos

| Evento | Elemento | Detalhes |
| --- | --- | --- |
| typing | service.component | Disparado enquanto o usuário digita. event.detail.visibleOptions contém as opções filtradas. |
| selected | service.component | Disparado ao selecionar uma opção. event.detail.selectedOption contém o item selecionado. |


Como escutar eventos: Todos os eventos devem ser escutados usando addEventListener no service.component. A estrutura de uso é sempre a mesma, mudando apenas o nome do evento e a propriedade acessada em event.detail.

## Exemplo genérico de como escutar o evento
```
service.component.addEventListener("nome-do-evento", (event) => {
const dados = event.detail;
console.log("Evento recebido:", dados);
});
```

Substitua "nome-do-evento" por typing, selected, etc., conforme a tabela acima.

# Observações

Para a utilização do componente, deve-se utilizar o atributo data-search-value nas opções disponíveis assim como no exemplo de uso do HTML.

# Modo OnColor

Por padrão a cor do componente no modo OnColor é brad-bg-color-primary, para utilizar outra cor basta adicionar o atributo data-oncolor-bg com a cor desejada no mesmo elemento que contém o atributo data-search.

# Acessibilidade

Certifique-se de adicionar o atributo autocomplete="off" ao elemento <input>. Esse atributo impede que o navegador exiba sugestões de preenchimento automático nativas, garantindo uma experiência personalizada.

Crie uma tag <p> como elemento irmão da <div> que envolve as opções do dropdown. Esta tag deve conter um atributo id, que será utilizado pela função JavaScript para atualizar seu conteúdo com o resultado da busca. No exemplo abaixo, usamos id-search-result, mas você pode definir outro valor, se preferir. Além disso, adicione os seguintes atributos à tag <p>:

aria-live="polite": permite que leitores de tela anunciem automaticamente qualquer alteração no conteúdo.

style="opacity: 0; position: absolute;": garante que o elemento permaneça invisível e fora do fluxo visual da página, sem interferir no layout.

## Na <div> que envolve todas as opções do dropdown, adicione:

um atributo id (por exemplo, filter) para facilitar a referência;

o atributo role="listbox", que indica ao leitor de tela que se trata de uma lista interativa, permitindo a leitura da posição de cada item (ex.: “Brasil, 1 de 5”).

## Em cada <div> de opção dentro do dropdown, adicione:

o atributo role="option", para que o leitor de tela entenda que o elemento é uma opção dentro da lista;

um atributo id exclusivo, que será usado como valor do atributo aria-activedescendant no input. Isso permite que o leitor de tela destaque corretamente o item ativo durante a navegação.

# Exemplos
```
<article>
  <p class="brad-m-xl-b storybook-description-text">
    Os produtos e serviços disponíveis para pesquisa são:
    <i
      >Apple Pay, Cartão virtual, Click to Pay, Aviso de viagem, Bloqueio temporário, Compras por aproximação, Dados do cartão, Ordenar cartões, Opções de fatura, Ver senha, Cartão adicional, Contestação de compras, Promoções, Seguro do cartão</i
    >.
  </p>

  <div
    id="filter-44"
    data-search="view"
    data-oncolor-bg=""
    class="brad-text-field-search brad-text-field-search--view brad-m-md-b no-content"
  >
    <div class="search-container">
      <label class="brad-text-field  brad-m-md-b">
        <input
          aria-label="Campo de texto"
          class=""
          type="text"
          value=""
          placeholder="Buscar por produto ou serviço"
          
        />
        <small aria-hidden="true" class="placeholder-label-field"
          >Produtos e serviços</small
        >

        <button
          aria-label="Deletar texto"
          class="trailing-button-text complements delete"
        ></button>
        <button aria-label="Pesquisar" class="search trailing-button-text complements"></button>

        <span class="helper-text"></span>
        <div class="brad-text-field--background"></div>
      </label>

      <button
        aria-label="Cancelar"
        class="trailing-button-text cancel"
      >
        Cancelar
      </button>
    </div>

    <section
      class="search-view-options search-view-options__hide brad-p-lg-x brad-p-xl-b"
    >
      <button
              role="option"
              data-search-value="Apple Pay"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-transacional-conta-salario brad-icon-size-sm brad-m-xs-r"></em>
              <p>Apple Pay</p>
            </button><button
              role="option"
              data-search-value="Cartão virtual"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-cartao-debito-credito brad-icon-size-sm brad-m-xs-r"></em>
              <p>Cartão virtual</p>
            </button><button
              role="option"
              data-search-value="Click to Pay"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-transacional-conta-salario brad-icon-size-sm brad-m-xs-r"></em>
              <p>Click to Pay</p>
            </button><button
              role="option"
              data-search-value="Aviso de viagem"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-category-plain brad-icon-size-sm brad-m-xs-r"></em>
              <p>Aviso de viagem</p>
            </button><button
              role="option"
              data-search-value="Bloqueio temporário"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-miscellaneous-padlock brad-icon-size-sm brad-m-xs-r"></em>
              <p>Bloqueio temporário</p>
            </button><button
              role="option"
              data-search-value="Compras por aproximação"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-cartao-service brad-icon-size-sm brad-m-xs-r"></em>
              <p>Compras por aproximação</p>
            </button><button
              role="option"
              data-search-value="Dados do cartão"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-cartao-codigo-cvv brad-icon-size-sm brad-m-xs-r"></em>
              <p>Dados do cartão</p>
            </button><button
              role="option"
              data-search-value="Ordenar cartões"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-ui-carousel brad-icon-size-sm brad-m-xs-r"></em>
              <p>Ordenar cartões</p>
            </button><button
              role="option"
              data-search-value="Opções de fatura"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-cartao-debito-fatura brad-icon-size-sm brad-m-xs-r"></em>
              <p>Opções de fatura</p>
            </button><button
              role="option"
              data-search-value="Ver senha"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-account-password brad-icon-size-sm brad-m-xs-r"></em>
              <p>Ver senha</p>
            </button><button
              role="option"
              data-search-value="Cartão adicional"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-cartao-debito-pagamento-outros-bancos brad-icon-size-sm brad-m-xs-r"></em>
              <p>Cartão adicional</p>
            </button><button
              role="option"
              data-search-value="Contestação de compras"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-financial-hand-alert brad-icon-size-sm brad-m-xs-r"></em>
              <p>Contestação de compras</p>
            </button><button
              role="option"
              data-search-value="Promoções"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-cartoes-programa-beneficios brad-icon-size-sm brad-m-xs-r"></em>
              <p>Promoções</p>
            </button><button
              role="option"
              data-search-value="Seguro do cartão"
              class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
            >
              <em class="i icon-seguro-mais-protecao brad-icon-size-sm brad-m-xs-r"></em>
              <p>Seguro do cartão</p>
            </button>
    </section>
  </div>

  <section class="brad-flex brad-flex-column">
    
          <div class="brad-m-md-b">
            <h2
              class="brad-text-md brad-text-bold brad-m-sm-b storybook-description-text"
            >
              Pagamentos digitais
            </h2>

            <div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-transacional-conta-salario brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Apple Pay</p>
                </div><div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-cartao-debito-credito brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Cartão virtual</p>
                </div><div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-transacional-conta-salario brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Click to Pay</p>
                </div>
          </div>
        
          <div class="brad-m-md-b">
            <h2
              class="brad-text-md brad-text-bold brad-m-sm-b storybook-description-text"
            >
              Configurações
            </h2>

            <div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-category-plain brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Aviso de viagem</p>
                </div><div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-miscellaneous-padlock brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Bloqueio temporário</p>
                </div><div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-cartao-service brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Compras por aproximação</p>
                </div><div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-cartao-codigo-cvv brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Dados do cartão</p>
                </div><div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-ui-carousel brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Ordenar cartões</p>
                </div><div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-cartao-debito-fatura brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Opções de fatura</p>
                </div><div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-account-password brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Ver senha</p>
                </div>
          </div>
        
          <div class="brad-m-md-b">
            <h2
              class="brad-text-md brad-text-bold brad-m-sm-b storybook-description-text"
            >
              Mais serviços
            </h2>

            <div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-cartao-debito-pagamento-outros-bancos brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Cartão adicional</p>
                </div><div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-financial-hand-alert brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Contestação de compras</p>
                </div><div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-cartoes-programa-beneficios brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Promoções</p>
                </div><div
                  class="brad-card brad-border-hairline brad-border-color-neutral-20 brad-flex brad-p-lg-x brad-p-lg-y brad-m-xs-b"
                >
                  <em
                    class="i icon-seguro-mais-protecao brad-icon-size-sm brad-m-xs-r"
                  ></em>
                  <p>Seguro do cartão</p>
                </div>
          </div>
        
  </section>
</article>
```