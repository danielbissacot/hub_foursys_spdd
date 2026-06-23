# TextFieldSearch

A pesquisa é um método intuitivo de descoberta, que oferece aos usuários uma forma de explorar um site ou aplicativo por meio de palavras-chave. Nesse tipo de interação, ao tocar no campo de busca e começar a digitar, os resultados podem aparecer logo abaixo, em um menu suspenso (dropdown), ou o usuário pode ser direcionado para uma visualização em tela cheia.

Ao tocar no campo de busca e começar a digitar os resultados aparecem em um dropdown, o redirecionamento do usuário ao clicar em algum resultado fica a cargo da jornada:

# Suporte por dispositivo

| DEVICE | FUNCIONAL EM | RECOMENDADO |
| --- | --- | --- |
| Mobile <=767px | Dropdown, Static, Trigger e View | Sim |
| Tablet | Dropdown e Static | Sim |
| Desktop | Dropdown e Static | Sim |

# Uso do WebComponent

O componente principal é o <brad-text-field-search-filter>, que pode conter internamente elementos como <input>, além de subcomponentes opcionais para ícone, prefixo, sufixo, ação, validação e texto auxiliar, com funcionalidades específicas de seleção.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-text-field-search-filter | Componente | Sim | Sim | Container principal do componente. Envolve o container de busca e de lista de resultados. |
| brad-text-field-search-container | Componente | Sim | Sim | Container secundário do campo de busca. |
| brad-text-field-search | Componente | Sim | Sim | Container terciário do campo de busca. Envolve o input onde serão filtrados os resultados, bem como textos auxiliares e fundo colorido |
| input | Elemento | Sim | Sim | Campo de entrada de dados. |
| brad-text-field-search-listbox | Componente | Sim | Sim | Componente onde serão informados os itens a serem filtrados. |
| brad-text-field-search-listbox-item | Componente | Sim | Sim | Componente representando um item da lista. |
| brad-text-field-search-label | Componente | Não | Sim | Componente de label para exibir ao interagir com o input |
| brad-text-field-search-helper-text | Componente | Não | Sim | Texto auxiliar abaixo do campo. |

# Propriedades
## brad-text-field-search-filter

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Identificador único para o componente, caso não seja informado, um aleatório será gerado. |
| brad-type | "dropdown", "static", "trigger", "view" | "dropdown" | Variação do componente a ser utilizada. |
| data-oncolor-bg | string | "brad-bg-color-primary" | Variação do fundo para utilizar no modo trigger e view. Será aplicado na janela que sobrepõe o conteúdo. |

# brad-text-field-search

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-on-color | boolean | false | Aplica o modo para fundo escuro (classe CSS). |

## brad-text-field-search-listbox-item

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| data-search-value | string |  | Valor que será utilizado para ser filtrado na lista de resultados. |

# Uso do HTML
```
<brad-text-field-search-filter
    id="[ID_TEXT_FIELD]"
    brad-type="dropdown"
  >
    <brad-text-field-search-container>
      <brad-text-field-search
      >
          <input
            aria-label="Campo de texto"
            autocomplete="off"
            type="text"
            value=""
            placeholder="Busque por produtos ou serviços"
          />
          <brad-text-field-search-label aria-hidden="true"
            >Produtos e serviços</brad-text-field-search-label
          >
          <button
            aria-label="Deletar texto"
            class="delete trailing-button-text complements"
          ></button>
      </brad-text-field-search>

        <brad-text-field-search-listbox> /* <- Localização da lista caso o tipo seja "dropdown" */
          <brad-text-field-search-listbox-item
                role="option"
                data-search-value="Brasil"
                class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
              >
                <p>Brasil</p>
              </brad-text-field-search-listbox-item>
              <brad-text-field-search-listbox-item
                role="option"
                data-search-value="Argentina"
                class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
              >
                <p>Argentina</p>
              </brad-text-field-search-listbox-item>
        </brad-text-field-search-listbox>
        <button
          aria-label="Cancelar"
          class="trailing-button-text cancel"
        >
          Cancelar
        </button>
    </brad-text-field-search-container>

        <brad-text-field-search-listbox> /* <- Localização da lista caso o tipo seja "static", "trigger" ou "view" */
        </brad-text-field-search-listbox>
  </brad-text-field-search-filter>
```
Comportamento Javascript
## Inicialização

Inicialização não é necessária. (componente nativo).

# Observações

Para a utilização do componente, deve-se utilizar o atributo data-search-value nas opções disponíveis assim como no exemplo de uso do HTML.

Devido a variação da estrutura HTML a depender do tipo informado, o componente recria a brad-text-field-search-listbox (e seus elementos internos) e o posiciona no devido lugar sempre que ocorrer uma mudança de tipo.

## Elemento necessário para funcionamento do tipo trigger

Para o funcionamento correto do brad-text-field-search-filter no modo trigger, é necessário que exista um elemento com a propriedade data-btn-type="text-field-search". Esse elemento servirá como "ativador" do componente. Abaixo segue um exemplo de elemento:

```
<button
      data-btn-type="text-field-search"
      class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
    >
      <em><em class="fab-icon i icon-ui-search"></em></em>
    </button>
```
## Eventos

| Evento | Elemento | Detalhes |
| --- | --- | --- |
| typing | brad-text-field-search-filter | Disparado enquanto o usuário digita. event.detail.visibleOptions contém as opções filtradas. |
| selected | brad-text-field-search-filter | Disparado ao selecionar uma opção. event.detail.selectedOption contém o item selecionado. |
| listChanged | brad-text-field-search-filter | Disparado ao recriar o elemento brad-text-field-search-listbox. |


Como escutar eventos: Todos os eventos devem ser escutados usando addEventListener no brad-text-field-search-filter. A estrutura de uso é sempre a mesma, mudando apenas o nome do evento e a propriedade acessada em event.detail.

## Exemplo genérico de como escutar o evento
```
const target = document.querySelector('brad-text-field-search-filter')
target.addEventListener("nome-do-evento", (event) => {
const dados = event.detail;
console.log("Evento recebido:", dados);
});
```

Substitua "nome-do-evento" por typing, selected, etc., conforme a tabela acima.

# Acessibilidade

Certifique-se de adicionar o atributo autocomplete="off" ao elemento <input>. Esse atributo impede que o navegador exiba sugestões de preenchimento automático nativas, garantindo uma experiência personalizada.

Crie uma tag <p> como elemento irmão da <brad-text-field-search-listbox> que envolve as opções do dropdown. Esta tag deve conter um atributo id, que será utilizado pela função JavaScript para atualizar seu conteúdo com o resultado da busca. No exemplo abaixo, usamos id-search-result, mas você pode definir outro valor, se preferir. Além disso, adicione os seguintes atributos à tag <p>:

aria-live="polite": permite que leitores de tela anunciem automaticamente qualquer alteração no conteúdo.

style="opacity: 0; position: absolute;": garante que o elemento permaneça invisível e fora do fluxo visual da página, sem interferir no layout.

# Exemplos
Dropdown
```
<section>
  <p class="brad-m-xl-b">
    Os produtos e serviços disponíveis para pesquisa são:
    <em>
      Apple Pay, Cartão virtual, Click to Pay, Aviso de viagem, Bloqueio temporário, Compras por aproximação, Dados do cartão, Ordenar cartões, Opções de fatura, Ver senha, Cartão adicional, Contestação de compras, Promoções, Seguro do cartão</em
    >.
  </p>

  <brad-text-field-search-filter
    id="filter-18"
    brad-type="dropdown"
    class=" brad-m-md-b"
  >
    <brad-text-field-search-container>
      <brad-text-field-search class="brad-text-field">
        <input
          aria-label="Campo de texto"
          autocomplete="off"
          type="text"
          value=""
          placeholder="Buscar por produto ou serviço"
        />
        <brad-text-field-search-label aria-hidden="true"
          >Produtos e serviços</brad-text-field-search-label
        >
        <button
          aria-label="Deletar texto"
          class="delete trailing-button-text complements"
        ></button>
        <button
    aria-label="Pesquisar"
    class="search trailing-button-text complements undefined"
  ></button>
        <brad-text-field-search-helper-text
          >Dica: Filtre por itens presentes na
          lista</brad-text-field-search-helper-text
        >
      </brad-text-field-search>

      <brad-text-field-search-listbox>
        
<brad-text-field-search-listbox-item
        data-search-value="Apple Pay"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Apple Pay</p>
      </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
        data-search-value="Cartão virtual"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Cartão virtual</p>
      </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
        data-search-value="Click to Pay"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Click to Pay</p>
      </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
        data-search-value="Aviso de viagem"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Aviso de viagem</p>
      </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
        data-search-value="Bloqueio temporário"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Bloqueio temporário</p>
      </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
        data-search-value="Compras por aproximação"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Compras por aproximação</p>
      </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
        data-search-value="Dados do cartão"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Dados do cartão</p>
      </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
        data-search-value="Ordenar cartões"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Ordenar cartões</p>
      </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
        data-search-value="Opções de fatura"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Opções de fatura</p>
      </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
        data-search-value="Ver senha"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Ver senha</p>
      </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
        data-search-value="Cartão adicional"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Cartão adicional</p>
      </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
        data-search-value="Contestação de compras"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Contestação de compras</p>
      </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
        data-search-value="Promoções"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Promoções</p>
      </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
        data-search-value="Seguro do cartão"
        class="brad-list-item brad-font-title-md brad-p-sm-x brad-p-lg-y"
      >
        <p>Seguro do cartão</p>
      </brad-text-field-search-listbox-item></brad-text-field-search-listbox
      >
    </brad-text-field-search-container>
  </brad-text-field-search-filter>
  <div class="brad-alert brad-alert--warning">
    <div class="brad-alert__icon">
      <em class="icon-feedback-alert-warning d-flex"></em>
    </div>

    <div class="brad-alert__content">
      <h1 class="brad-alert__title brad-font-title-md">Dica de uso</h1>

      <div class="brad-alert__body">
        <div
          class="brad-alert__body__middle brad-font-paragraph-sm no-link"
        >
          Digite ao menos um caractere para iniciar a busca por um produto
          ou serviço.
        </div>
      </div>
    </div>
  </div>
</section>
```
Static
```
<section>
  <p class="brad-m-xl-b">
    Os produtos e serviços disponíveis para pesquisa são:
    <em>
      Apple Pay, Cartão virtual, Click to Pay, Aviso de viagem, Bloqueio temporário, Compras por aproximação, Dados do cartão, Ordenar cartões, Opções de fatura, Ver senha, Cartão adicional, Contestação de compras, Promoções, Seguro do cartão</em
    >.
  </p>

  <brad-text-field-search-filter id="filter-329" brad-type="static">
    <brad-text-field-search-container>
      <brad-text-field-search
        class="brad-text-field  brad-m-md-b"
      >
        <input
          aria-label="Campo de texto"
          autocomplete="off"
          type="text"
          value=""
          placeholder="Busque por produto ou serviço"
        />
        <brad-text-field-search-label aria-hidden="true"
          >Produtos e serviços</brad-text-field-search-label
        >
        <button
          aria-label="Deletar texto"
          class="delete trailing-button-text complements"
        ></button>
        <button
    aria-label="Pesquisar"
    class="search trailing-button-text complements undefined"
  ></button>
        <brad-text-field-search-helper-text
          >Dica: Filtre por itens presentes na
          lista</brad-text-field-search-helper-text
        >
      </brad-text-field-search>

      <brad-text-field-search-listbox>
        
      <brad-text-field-search-listbox-item
        data-search-value="Apple Pay"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-transacional-conta-salario brad-icon-size-sm brad-m-xs-r"></em>
        <p>Apple Pay</p>
      </brad-text-field-search-listbox-item>
    
      <brad-text-field-search-listbox-item
        data-search-value="Cartão virtual"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-cartao-debito-credito brad-icon-size-sm brad-m-xs-r"></em>
        <p>Cartão virtual</p>
      </brad-text-field-search-listbox-item>
    
      <brad-text-field-search-listbox-item
        data-search-value="Click to Pay"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-transacional-conta-salario brad-icon-size-sm brad-m-xs-r"></em>
        <p>Click to Pay</p>
      </brad-text-field-search-listbox-item>
    
      <brad-text-field-search-listbox-item
        data-search-value="Aviso de viagem"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-category-plain brad-icon-size-sm brad-m-xs-r"></em>
        <p>Aviso de viagem</p>
      </brad-text-field-search-listbox-item>
    
      <brad-text-field-search-listbox-item
        data-search-value="Bloqueio temporário"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-miscellaneous-padlock brad-icon-size-sm brad-m-xs-r"></em>
        <p>Bloqueio temporário</p>
      </brad-text-field-search-listbox-item>
    
      <brad-text-field-search-listbox-item
        data-search-value="Compras por aproximação"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-cartao-service brad-icon-size-sm brad-m-xs-r"></em>
        <p>Compras por aproximação</p>
      </brad-text-field-search-listbox-item>
    
      <brad-text-field-search-listbox-item
        data-search-value="Dados do cartão"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-cartao-codigo-cvv brad-icon-size-sm brad-m-xs-r"></em>
        <p>Dados do cartão</p>
      </brad-text-field-search-listbox-item>
    
      <brad-text-field-search-listbox-item
        data-search-value="Ordenar cartões"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-ui-carousel brad-icon-size-sm brad-m-xs-r"></em>
        <p>Ordenar cartões</p>
      </brad-text-field-search-listbox-item>
    
      <brad-text-field-search-listbox-item
        data-search-value="Opções de fatura"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-cartao-debito-fatura brad-icon-size-sm brad-m-xs-r"></em>
        <p>Opções de fatura</p>
      </brad-text-field-search-listbox-item>
    
      <brad-text-field-search-listbox-item
        data-search-value="Ver senha"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-account-password brad-icon-size-sm brad-m-xs-r"></em>
        <p>Ver senha</p>
      </brad-text-field-search-listbox-item>
    
      <brad-text-field-search-listbox-item
        data-search-value="Cartão adicional"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-cartao-debito-pagamento-outros-bancos brad-icon-size-sm brad-m-xs-r"></em>
        <p>Cartão adicional</p>
      </brad-text-field-search-listbox-item>
    
      <brad-text-field-search-listbox-item
        data-search-value="Contestação de compras"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-financial-hand-alert brad-icon-size-sm brad-m-xs-r"></em>
        <p>Contestação de compras</p>
      </brad-text-field-search-listbox-item>
    
      <brad-text-field-search-listbox-item
        data-search-value="Promoções"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-cartoes-programa-beneficios brad-icon-size-sm brad-m-xs-r"></em>
        <p>Promoções</p>
      </brad-text-field-search-listbox-item>
    
      <brad-text-field-search-listbox-item
        data-search-value="Seguro do cartão"
        class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
      >
        <em class="i icon-seguro-mais-protecao brad-icon-size-sm brad-m-xs-r"></em>
        <p>Seguro do cartão</p>
      </brad-text-field-search-listbox-item>
    </brad-text-field-search-listbox
      >
    </brad-text-field-search-container>
  </brad-text-field-search-filter>
  <div class="brad-alert brad-alert--warning">
    <div class="brad-alert__icon">
      <em class="icon-feedback-alert-warning d-flex"></em>
    </div>

    <div class="brad-alert__content">
      <h1 class="brad-alert__title brad-font-title-md">Dica de uso</h1>

      <div class="brad-alert__body">
        <div
          class="brad-alert__body__middle brad-font-paragraph-sm no-link"
        >
          Digite ao menos um caractere para iniciar a busca por um produto
          ou serviço.
        </div>
      </div>
    </div>
  </div>
</section>
```
Trigger
```
<section>
  <p class="brad-m-xl-b">
    Os produtos e serviços disponíveis para pesquisa são:
    <em>
      Apple Pay, Cartão virtual, Click to Pay, Aviso de viagem, Bloqueio temporário, Compras por aproximação, Dados do cartão, Ordenar cartões, Opções de fatura, Ver senha, Cartão adicional, Contestação de compras, Promoções, Seguro do cartão</em
    >.
  </p>

  <button
    data-btn-type="text-field-search"
    class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
  >
    <em><em class="fab-icon i icon-ui-search"></em></em>
  </button>

  <brad-text-field-search-filter
    id="filter-251"
    brad-type="trigger"
    class=" brad-m-md-b"
  >
    <brad-text-field-search-container>
      <brad-text-field-search
        class="brad-text-field  brad-m-md-b"
      >
        <input
          aria-label="Campo de texto"
          autocomplete="off"
          type="text"
          value=""
          placeholder="Busque por produto ou serviço"
        />
        <brad-text-field-search-label aria-hidden="true"
          >Produtos e serviços</brad-text-field-search-label
        >
        <button
          aria-label="Deletar texto"
          class="delete trailing-button-text complements"
        ></button>
        <button
    aria-label="Pesquisar"
    class="search trailing-button-text complements undefined"
  ></button>
        <brad-text-field-search-helper-text
          >Dica: Filtre por itens presentes na
          lista</brad-text-field-search-helper-text
        >
      </brad-text-field-search>

      <brad-text-field-search-listbox>
        <brad-text-field-search-listbox-item
      data-search-value="Apple Pay"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-transacional-conta-salario brad-icon-size-sm brad-m-xs-r"></em>
      <p>Apple Pay</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Cartão virtual"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-cartao-debito-credito brad-icon-size-sm brad-m-xs-r"></em>
      <p>Cartão virtual</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Click to Pay"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-transacional-conta-salario brad-icon-size-sm brad-m-xs-r"></em>
      <p>Click to Pay</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Aviso de viagem"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-category-plain brad-icon-size-sm brad-m-xs-r"></em>
      <p>Aviso de viagem</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Bloqueio temporário"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-miscellaneous-padlock brad-icon-size-sm brad-m-xs-r"></em>
      <p>Bloqueio temporário</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Compras por aproximação"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-cartao-service brad-icon-size-sm brad-m-xs-r"></em>
      <p>Compras por aproximação</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Dados do cartão"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-cartao-codigo-cvv brad-icon-size-sm brad-m-xs-r"></em>
      <p>Dados do cartão</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Ordenar cartões"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-ui-carousel brad-icon-size-sm brad-m-xs-r"></em>
      <p>Ordenar cartões</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Opções de fatura"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-cartao-debito-fatura brad-icon-size-sm brad-m-xs-r"></em>
      <p>Opções de fatura</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Ver senha"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-account-password brad-icon-size-sm brad-m-xs-r"></em>
      <p>Ver senha</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Cartão adicional"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-cartao-debito-pagamento-outros-bancos brad-icon-size-sm brad-m-xs-r"></em>
      <p>Cartão adicional</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Contestação de compras"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-financial-hand-alert brad-icon-size-sm brad-m-xs-r"></em>
      <p>Contestação de compras</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Promoções"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-cartoes-programa-beneficios brad-icon-size-sm brad-m-xs-r"></em>
      <p>Promoções</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Seguro do cartão"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-seguro-mais-protecao brad-icon-size-sm brad-m-xs-r"></em>
      <p>Seguro do cartão</p>
    </brad-text-field-search-listbox-item></brad-text-field-search-listbox
      >
      <button aria-label="Cancelar" class="trailing-button-text cancel">
        Cancelar
      </button>
    </brad-text-field-search-container>
  </brad-text-field-search-filter>
</section>
```
View
```
<section>
  <p class="brad-m-xl-b">
    Os produtos e serviços disponíveis para pesquisa são:
    <em>
      Apple Pay, Cartão virtual, Click to Pay, Aviso de viagem, Bloqueio temporário, Compras por aproximação, Dados do cartão, Ordenar cartões, Opções de fatura, Ver senha, Cartão adicional, Contestação de compras, Promoções, Seguro do cartão</em
    >.
  </p>

  <brad-text-field-search-filter
    id="filter-229"
    brad-type="view"
    class=" brad-m-md-b"
  >
    <brad-text-field-search-container>
      <brad-text-field-search
        class="brad-text-field  brad-m-md-b"
      >
        <input
          aria-label="Campo de texto"
          autocomplete="off"
          type="text"
          value=""
          placeholder="Busque por produto ou serviço"
        />
        <brad-text-field-search-label aria-hidden="true"
          >Produtos e serviços</brad-text-field-search-label
        >
        <button
          aria-label="Deletar texto"
          class="delete trailing-button-text complements"
        ></button>
        <button
    aria-label="Pesquisar"
    class="search trailing-button-text complements undefined"
  ></button>
        <brad-text-field-search-helper-text
          >Dica: Filtre por itens presentes na
          lista</brad-text-field-search-helper-text
        >
      </brad-text-field-search>

      <brad-text-field-search-listbox>
        <brad-text-field-search-listbox-item
      data-search-value="Apple Pay"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-transacional-conta-salario brad-icon-size-sm brad-m-xs-r"></em>
      <p>Apple Pay</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Cartão virtual"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-cartao-debito-credito brad-icon-size-sm brad-m-xs-r"></em>
      <p>Cartão virtual</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Click to Pay"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-transacional-conta-salario brad-icon-size-sm brad-m-xs-r"></em>
      <p>Click to Pay</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Aviso de viagem"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-category-plain brad-icon-size-sm brad-m-xs-r"></em>
      <p>Aviso de viagem</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Bloqueio temporário"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-miscellaneous-padlock brad-icon-size-sm brad-m-xs-r"></em>
      <p>Bloqueio temporário</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Compras por aproximação"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-cartao-service brad-icon-size-sm brad-m-xs-r"></em>
      <p>Compras por aproximação</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Dados do cartão"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-cartao-codigo-cvv brad-icon-size-sm brad-m-xs-r"></em>
      <p>Dados do cartão</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Ordenar cartões"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-ui-carousel brad-icon-size-sm brad-m-xs-r"></em>
      <p>Ordenar cartões</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Opções de fatura"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-cartao-debito-fatura brad-icon-size-sm brad-m-xs-r"></em>
      <p>Opções de fatura</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Ver senha"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-account-password brad-icon-size-sm brad-m-xs-r"></em>
      <p>Ver senha</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Cartão adicional"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-cartao-debito-pagamento-outros-bancos brad-icon-size-sm brad-m-xs-r"></em>
      <p>Cartão adicional</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Contestação de compras"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-financial-hand-alert brad-icon-size-sm brad-m-xs-r"></em>
      <p>Contestação de compras</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Promoções"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-cartoes-programa-beneficios brad-icon-size-sm brad-m-xs-r"></em>
      <p>Promoções</p>
    </brad-text-field-search-listbox-item><brad-text-field-search-listbox-item
      data-search-value="Seguro do cartão"
      class="brad-list-item brad-rounded-md brad-border-hairline brad-border-color-neutral-20 brad-p-lg-x brad-p-lg-y brad-m-xs-b"
    >
      <em class="i icon-seguro-mais-protecao brad-icon-size-sm brad-m-xs-r"></em>
      <p>Seguro do cartão</p>
    </brad-text-field-search-listbox-item></brad-text-field-search-listbox
      >
      <button aria-label="Cancelar" class="trailing-button-text cancel">
        Cancelar
      </button>
    </brad-text-field-search-container>
  </brad-text-field-search-filter>
  <section class="brad-flex brad-flex-column">
    
          <div class="brad-m-md-b">
            <h2 class="brad-text-md brad-text-bold brad-m-sm-b">
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
            <h2 class="brad-text-md brad-text-bold brad-m-sm-b">
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
            <h2 class="brad-text-md brad-text-bold brad-m-sm-b">
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
</section>
```