# Navbar

É um componente fixado na parte inferior da tela, que contém de 3 a 5 opções de ações que podem ser representadas por um ícone + texto. Ao tocar em alguma das opções o usuário é direcionado para tela correspodente.

# Uso do Web Component

O Navbar web component possui vários componentes utilitários que ajudam a construir vários casos de uso.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-navbar | Componente | Sim | Não | Agrupa todos os outros componentes do navbar |
| brad-navbar-list | Sub-componente | Sim | Sim | Agrupa todos as tabs da navegação. |
| brad-navbar-tab | Sub-componente | Sim | Sim | Itens do Navbar. |

# Propriedades
## brad-navbar

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-type | "line", "bubble" | "line" | Controle do tipo do navbar |

# brad-navbar-tab

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-icon | string | "icon-ui-placeholder" | Inserir um ícone valido do Liquid |
| disabled | boolean | "false" | Indica que esse item está desabilitado |

# Uso do HTML
```
<brad-navbar id="[ID_DO_NAVBAR]" brad-type="line">
<brad-navbar-list>
  <brad-navbar-tab
    id="item-1"
    selected="true"
    brad-icon="icon-ui-placeholder"
    disabled="false"
  >
    Item 1
  </brad-navbar-tab>
  <brad-navbar-tab
    id="item-2"
    selected="false"
    brad-icon="icon-ui-placeholder"
    disabled="false"
  >
    Item 2
  </brad-navbar-tab>
  <brad-navbar-tab
    id="item-3"
    selected="false"
    brad-icon="icon-ui-placeholder"
    disabled="false"
  >
    Item 3
  </brad-navbar-tab>
  <brad-navbar-tab
    id="item-4"
    selected="false"
    brad-icon="icon-ui-placeholder"
    disabled="false"
  >
    Item 4
  </brad-navbar-tab>
  <brad-navbar-tab
    id="item-5"
    selected="false"
    brad-icon="icon-ui-placeholder"
    disabled="false"
  >
    Item 5
  </brad-navbar-tab>
</brad-navbar-list>
</brad-navbar>
```
## Comportamento Javascript

O Web Component não requer uma instanciação explícita em JavaScript, pois a própria tag HTML se encarrega de inicializá-lo e tratá-lo por trás dos panos.

Além disso, todos os atributos do componente são reativos. Isso significa que, para gerenciar o comportamento ou atualizar o estado do componente, basta obter sua referência no DOM e manipular os valores dos seus atributos.

# Acessibilidade

Algumas tags são inseridas automaticamente pelo script do web component, assim o funcionamento da acessibilidade é garantido. O comportamento da acessibilidade segue o mesmo do componente HTML, para ver a documentação completa clique aqui.

# Exemplos

Obs: Use o botão show code abaixo do exemplo para ver o HTML.

# Line
```
<brad-navbar id="navbar-145" brad-type="line">
  <brad-navbar-list>
    <brad-navbar-tab
      id="item-1"
      selected="true"
      brad-icon="icon-ui-placeholder"
      disabled="false"
    >
      Label
    </brad-navbar-tab>

    <brad-navbar-tab
      id="item-2"
      selected="false"
      brad-icon="icon-ui-placeholder"
      disabled="false"
    >
      Label
    </brad-navbar-tab>

    <brad-navbar-tab
      id="item-3"
      selected="false"
      brad-icon="icon-ui-placeholder"
      disabled="false"
    >
      Label
    </brad-navbar-tab>

    <brad-navbar-tab
      id="item-4"
      selected="false"
      brad-icon="icon-ui-placeholder"
      disabled="false"
    >
      Label
    </brad-navbar-tab>

    <brad-navbar-tab
      id="item-5"
      selected="false"
      brad-icon="icon-ui-placeholder"
      disabled="false"
    >
      Label
    </brad-navbar-tab>
  </brad-navbar-list>
</brad-navbar>
```
Bubble
```
<brad-navbar id="navbar-346" brad-type="bubble">
  <brad-navbar-list>
    <brad-navbar-tab
      id="item-1"
      selected="true"
      brad-icon="icon-ui-placeholder"
      disabled="false"
    >
      Label
    </brad-navbar-tab>

    <brad-navbar-tab
      id="item-2"
      selected="false"
      brad-icon="icon-ui-placeholder"
      disabled="false"
    >
      Label
    </brad-navbar-tab>

    <brad-navbar-tab
      id="item-3"
      selected="false"
      brad-icon="icon-ui-placeholder"
      disabled="false"
    >
      Label
    </brad-navbar-tab>

    <brad-navbar-tab
      id="item-4"
      selected="false"
      brad-icon="icon-ui-placeholder"
      disabled="false"
    >
      Label
    </brad-navbar-tab>

    <brad-navbar-tab
      id="item-5"
      selected="false"
      brad-icon="icon-ui-placeholder"
      disabled="false"
    >
      Label
    </brad-navbar-tab>
  </brad-navbar-list>
</brad-navbar>
```