# Popover

É um componente que aparece sobre todos os outros elementos em uma página e exibe informações secundárias através da interação com outro elemento.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do Web Component
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-popover | Componente | Sim | Sim | Componente principal do popover, define a estrutura e usa atributos para definição de tipo |
| brad-popover-content | SubComponente | Sim | Sim | SubComponente responsável pelo conteúdo que será exibido no popover |
| brad-popover-close-btn | SubComponente | Não | Sim | Botão pré-configurado com funcionalidade de fechamento do popover e acessibilidade. |

# Propriedades
## brad-popover

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Necessário informar para o bom funcionamento do componente. Será utilizado para atribuir identificadores para os elementos criados internamente. |
| brad-on-color | boolean | false | Estado de mudança de cor para fundos escuros. |
| brad-type | "popover ou floating", "default ou contained", "tooltip" | "popover" | Tipo do popover. Aliases disponíveis: floating (= popover), contained (= default) |
| brad-id-target | string |  | Identificador do elemento alvo que será clicado/interagido para abrir o popover |
| brad-direction | "bottom", "top" | "bottom" | Direção na qual será aberta o popover. |

# brad-popover-close-btn

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-aria-label | string | "Fechar popover" | Valor que será atribuído ao aria-label do componente interno. Utilizado pelos leitores de tela |

# Atributos identificadores

Visando permitir a variação da estrutura HTML, foram criados atributos customizados para identificação do título e texto inseridos no brad-popover-content, possibilitando à jornada uma maior flexibilidade e autonomia sobre os mesmos.


| Nome | Obrigatório | Descrição |
| --- | --- | --- |
| brad-popover-title | Não | Atributo que deve ser usado no elemento que representa o título do popover. |
| brad-popover-text | Não | Atributo que deve ser usado no elemento que representa o texto do popover |

# Uso do HTML
```
<div class="brad-flex brad-flex-justify-content-center brad-font-paragraph-md">
<button
  id="[ID_TARGET_POPOVER]"
  class="brad-text-link"
  aria-expanded="false"
  aria-controls="[ID_POPOVER]"
>
  OPEN POPOVER!
</button>
</div>

<brad-popover
class="brad-zindex--1020"
id="[ID_POPOVER]"
brad-id-target="[ID_TARGET_POPOVER]">
<brad-popover-content>

<p brad-popover-title>Título do popover</p>
<p brad-popover-text>Conteúdo do popover</p>

</brad-popover-content>
<brad-popover-close-btn></brad-popover-close-btn>

</brad-popover>
```
Comportamento Javascript
## Inicialização

## Inicialização não necessária. (componente nativo)

# Posicionamento
Ao abrir o popover é priorizado a direção de abertura definida pelo usuário.
No entanto, se o espaço for insuficiente, ele se reposicionará para a melhor alternativa visível.
## Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| open | brad-popover | Disparado ao abrir o popover |
| close | brad-popover | Disparado ao fechar o popover |

# Eventos ouvidos internamente

Por padrão, o brad-popover registra listeners no elemento alvo para a realização de abertura/fechamento do popover. Os eventos ouvidos são:


| Evento | Elemento ouvinte | Descrição |
| --- | --- | --- |
| click | brad-popover | Quando ocorre a ação de click no elemento alvo, é realizado a ação de toggle (para popovers do tipo default e popover), ou a ação de abertura (para elementos do tipo tooltip) |
| mouseover | brad-popover | Quando ocorre a ação de mouseover no elemento alvo, é realizado a ação de abertura do popover. (somente para o tipo tooltip) |
| mouseout | brad-popover | Quando ocorre a ação de mouseout no elemento alvo, é realizado a ação de fechamento do popover. (somente para o tipo tooltip) |

## Atualizando o Target Dinamicamente

O brad-popover permite a atualização dinâmica do elemento alvo (target) após a sua inicialização. Isso é útil para cenários onde o popover precisa ser associado a diferentes elementos em tempo de execução.

## Existem três formas de atualizar o target:

# Método 1: Usando setAttribute

A forma mais comum é utilizar o método setAttribute para alterar o atributo brad-id-target:

```
const popover = document.getElementById('meu-popover');
popover.setAttribute('brad-id-target', 'novo-target-id');
```
## Método 2: Atualizando a propriedade diretamente

Também é possível atualizar diretamente a propriedade bradIdTarget do componente:

```
const popover = document.getElementById('meu-popover');
popover.bradIdTarget = 'novo-target-id';
```
## Método 3: Método setTargetElement

Para cenários mais complexos, você pode usar o método setTargetElement para passar a referência direta do elemento HTML:

```
const popover = document.getElementById('meu-popover');
const targetElement = document.getElementById('meu-target');

// Referência direta do elemento
popover.setTargetElement(targetElement);
```
## Acessibilidade

Para melhorar a experiência com leitores de tela, recomendamos que para Popovers do tipo tooltip, a estrutura HTML seja montada de uma forma diferente das demais, abaixo seguem exemplos.

## Estrutura recomendada para popovers do tipo tooltip
```
<div class="brad-flex brad-flex-justify-content-center brad-font-paragraph-md">
<a
  id="[ID_TARGET_POPOVER]"
  class="brad-text-link"
  aria-expanded="false"
  aria-controls="[ID_POPOVER]"
>
  OPEN POPOVER!
</a>
</div>

<brad-popover
class="brad-zindex--1020"
id="[ID_POPOVER]"
brad-type="tooltip"
brad-id-target="[ID_TARGET_POPOVER]">
<brad-popover-content>
<brad-popover-close-btn></brad-popover-close-btn>

<p brad-popover-text>Conteúdo do popover</p>
</brad-popover-content>
</brad-popover>
```
## Foco e Navegação por Teclado

Agora, ao abrir o popover, o foco é direcionado de forma inteligente:

Em dispositivos móveis (largura ≤ 768px): o foco vai para o título do popover (brad-popover-title) se não houver um título o foco deve ser direcionado para o brad-popover-text, facilitando a leitura imediata pelo leitor de tela.

Em desktop: o foco vai para o conteúdo do popover (brad-popover-content), permitindo que leitores de tela anunciem todo o conteúdo de forma eficiente.

# Retorno do foco:

Ao fechar o popover, o foco retorna automaticamente para o elemento que disparou a abertura, mantendo a experiência de navegação por teclado fluida e previsível.

## Atualização dinâmica de aria-expanded:

O atributo aria-expanded do botão/disparador é atualizado automaticamente para refletir o estado aberto/fechado do popover, melhorando a comunicação com tecnologias assistivas.

Ao fechar o popover, o foco retorna para o elemento que disparou a abertura (exemplo: o link que abriu o popover).

# Exemplos
Popover ou floating
```
<div class="brad-theme-classic">
  <div class="examples">
    <div class="brad-flex brad-flex-justify-content-bottom brad-font-paragraph-md">
      
  <button
    id="target-208"
    class="brad-text-link "
    aria-expanded="false"
    aria-controls="popover-37"
  >
    OPEN POPOVER!
  </button>

    </div>
    <brad-popover
      class="brad-zindex--1020"
      id="popover-37"
      brad-id-target="target-208"
      brad-type="popover"
    >
      <brad-popover-content>
        <p brad-popover-title>Title content</p>
        <p brad-popover-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.</p>
      </brad-popover-content>
      <brad-popover-close-btn></brad-popover-close-btn>
    </brad-popover>
  </div>
</div>
```
Default ou contained
```
<div class="brad-theme-classic">
  <div class="examples">
    <div class="brad-flex brad-flex-justify-content-bottom brad-font-paragraph-md">
      
  <button
    id="target-default-361"
    class=" brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
    aria-expanded="false"
    aria-controls="popover-default-87"
  >
    <em class="fab-icon i icon-ui-placeholder"></em>
  </button>

    </div>
    <brad-popover
      class="brad-zindex--1020"
      id="popover-default-87"
      brad-id-target="target-default-361"
      brad-type="default"
    >
      <brad-popover-content>
        <p brad-popover-title>Title content</p>
        <p brad-popover-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.</p>
      </brad-popover-content>
      <brad-popover-close-btn></brad-popover-close-btn>
    </brad-popover>
  </div>
</div>
```
Tooltip
```
<div class="brad-theme-classic">
  <div class="examples">
    <div class="brad-flex brad-flex-justify-content-bottom brad-font-paragraph-md">
      
  <a
    id="target-tooltip-325"
    class="brad-text-link "
    tabindex="0"
    href="#"
    aria-expanded="false"
    aria-controls="popover-tooltip-61"
  >
    OPEN POPOVER!
  </a>

    </div>
    <brad-popover
      class="brad-zindex--1020"
      id="popover-tooltip-61"
      brad-id-target="target-tooltip-325"
      brad-type="tooltip"
    >
      <brad-popover-content>
        <brad-popover-close-btn></brad-popover-close-btn>
        <p brad-popover-title>Title content</p>
        <p brad-popover-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.</p>
      </brad-popover-content>
    </brad-popover>
  </div>
</div>
```