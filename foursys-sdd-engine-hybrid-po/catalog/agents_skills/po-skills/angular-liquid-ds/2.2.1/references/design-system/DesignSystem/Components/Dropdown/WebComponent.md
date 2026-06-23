# Dropdown

Superfície fixada na parte inferior da tela que sobrepõe todos os demais elementos da tela e, pode disponibilizar ao usuário ações ou informações complementares ao contexto atual.

Versão do componente que permanece estática na tela enquanto o usuário pode interagir com outros elementos da interface fora do bottom sheet. Este formato complementa o conteúdo da tela e agrupa informações ou ações de maneira sempre acessível.

# Uso do Web Component

O Dropdown (web component) possui apenas dois componentes utilitários obrigatórios para a utilização do dropdown.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-dropdown | Componente | Sim | Sim | Agrupa todos os outros componentes do dropdown. |
| brad-dropdown-content | Sub-componente | Sim | Sim | Conteúdo interno do dropdown quando ele estiver aberto. |

# Propriedades
## brad-dropdown

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | boolean |  | Id necessário para o funcionamento. |
| brad-horizontal-position | string[] | ["Muito Insatisfeito", "Insatisfeito", "Neutro", "Satisfeito", "Muito Satisfeito"] | Configura a posição horizontal que o componente vai abrir. |
| brad-vertical-position | boolean | true | Configura a posição vertical que o componente vai abrir. |
| brad-enabled-outside-click | boolean | false | Flag que ao ser desativada não permitirá que o dropdown seja fechado ao clicar fora de seu conteúdo. |

# Comportamento Javascript
## Inicialização

# Inicialização não é necessária

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| show | N/A | Abre |
| hide | N/A | Fecha |
| toggle | N/A | Alterna entre abrir e fechar |
| isOpen | N/A | É retornado se o dropdown está aberto ou fechado |
| getElementEvent | N/A | Obtém o elemento que retorna os eventos ao usar o addEventListener |

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| hide | brad-dropdown | Evento disparado ao fechar dropdown. |
| show | brad-dropdown | Evento disparado ao abrir dropdown. |

# Acessibilidade
Certifique-se de adicionar aria-expanded ao elemento de controle. Esse atributo identifica se o dropdown está expandido ou não e tem como valores true ou false que devem ser alternados dinamicamente.
Certifique-se de adicionar aria-label ao elemento de controle. Esse atributo identifica o texto a ser lido pelo leitor de tela e tem como valor o próprio texto.
Certifique-se de adicionar aria-hidden ao elemento que você deseja que o leitor de tela ignore.
```
<brad-dropdown
    id="dropdown-263"
    brad-vertical-position="down"
    brad-horizontal-position="center"
    brad-enabled-outside-click
  >
    <button
      class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
      data-toggle="brad-dropdown"
      aria-label="Abrir dropdown"
      tabindex="-1"
    >
      <em class="fab-icon i icon-ui-placeholder"></em>
    </button>

    <brad-dropdown-content>
    <ul class="brad-font-title-md">
      <li class="brad-list-item brad-font-title-md brad-p-lg-y brad-p-lg-x">
        Lorem ipsum 1
      </li>
      <li class="brad-list-item brad-font-title-md brad-p-lg-y brad-p-lg-x">
        Lorem ipsum 2
      </li>
      <li class="brad-list-item brad-font-title-md brad-p-lg-y brad-p-lg-x">
        Lorem ipsum 3
      </li>
    </ul>
  </brad-dropdown-content>
  </brad-dropdown>
```
Exemplos
Dropdown
```
<brad-dropdown
  id="dropdown-339"
  brad-vertical-position="down"
  brad-horizontal-position="center"
  brad-enabled-outside-click
>
  <button
    class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
    data-toggle="brad-dropdown"
    aria-label="Abrir dropdown"
    tabindex="-1"
  >
    <em class="fab-icon i icon-ui-placeholder"></em>
  </button>

  <brad-dropdown-content>
  <ul class="brad-font-title-md">
    <li class="brad-list-item brad-font-title-md brad-p-lg-y brad-p-lg-x">
      Lorem ipsum 1
    </li>
    <li class="brad-list-item brad-font-title-md brad-p-lg-y brad-p-lg-x">
      Lorem ipsum 2
    </li>
    <li class="brad-list-item brad-font-title-md brad-p-lg-y brad-p-lg-x">
      Lorem ipsum 3
    </li>
  </ul>
</brad-dropdown-content>
</brad-dropdown>
```