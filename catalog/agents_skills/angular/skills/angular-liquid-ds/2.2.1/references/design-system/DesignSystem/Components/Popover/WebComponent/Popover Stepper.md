# Popover Stepper

O popover stepper funciona como os outros, mas com um caráter de navegação. Sendo utilizado principalmente no template de tutorial. Diferente dos outros que apenas possuem a ação de fechar, o popover tour possui dois links que podem ser usados de diferentes formas para avançar ou regredir na navegação. O usuário também pode cancelar o tutorial a qualquer momento com o link "fechar tutorial" que fica na parte superior do componente.

# Uso do Web Component
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Conteúdo Default | Descrição |
| --- | --- | --- | --- | --- | --- |
| brad-popover-stepper | Componente | Sim | Sim |  | Componente principal do popover stepper, define a estrutura e usa atributos para definir seu comportamento |
| brad-popover-stepper-previous | SubComponente | Sim | Sim | "Anterior" | SubComponente botão que é utilizado para voltar ao passo anterior do componente principal. |
| brad-popover-stepper-next | SubComponente | Sim | Sim | "Próximo" | SubComponente botão que é utilizado para avançar ao próximo passo do componente principal. |
| brad-popover-stepper-close | SubComponente | Sim | Sim | ícone fechar "X" | SubComponente botão que é utilizado para fechar o componente principal. |

# Propriedades
## brad-popover-stepper

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Identificador único para o componente. Necessário informar para o bom funcionamento do componente. |
| brad-id-target | string |  | Identificador do elemento alvo que será clicado/interagido para abrir o popover |
| brad-on-color | boolean | false | Estado de mudança de cor para fundos escuros. |
| brad-direction | "bottom", "top" | "bottom" | Direção na qual será aberta o popover. |
| brad-hidden-close-button | boolean | false | Opcional, quando ativado esconde o botão de fechar no último passo. |
| brad-list | array |  | Lista de passos do popover stepper (JSON stringificado). |

# brad-popover-stepper-previous

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| aria-label | string | "Passo anterior" | Valor que será atribuído ao aria-label do componente interno. Utilizado pelos leitores de tela |

# brad-popover-stepper-next

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| aria-label | string | "Próximo passo" | Valor que será atribuído ao aria-label do componente interno. Utilizado pelos leitores de tela |

# brad-popover-stepper-close

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| aria-label | string | "Fechar tutorial" | Valor que será atribuído ao aria-label do componente interno. Utilizado pelos leitores de tela |

# Uso do HTML
```
<div class="brad-m-xl-t brad-p-xxl-t">
  <section class="brad-m-xl-t brad-p-xxl-t">
    <div
      class="brad-flex brad-flex-justify-content-center brad-font-paragraph-md brad-m-xl-t brad-p-xxl-t"
    >
      <a
        id="target-1"
        class="brad-text-link brad-p-sm"
        role="button"
        aria-label="Primeiro passo Abrir popover stepper"
        tabindex="0"
        aria-expanded="false"
      >
        Step 1
      </a>
    </div>
    <div id="target-2" class="brad-card brad-card--default brad-p-lg">
      <div>
        <h1>Step 2</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          posuere erat a ante.
        </p>
      </div>
    </div>
    <button
      id="target-3"
      class="brad-btn brad-btn-primary brad-m-xl-t brad-p-sm"
    >
      Step 3
    </button>
  </section>

  <brad-popover-stepper
    id="popover-stepper"
    brad-id-target="target-1"
    brad-on-color="false"
    brad-direction="bottom"
    brad-hidden-close-button="false"
    brad-list='[{
      "text": "1 Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.",
      "target": "target-1",
      "direction": "bottom"
    },
    {
      "text": "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.",
      "target": "target-2"
    },
    {
      "text": "3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.",
      "target": "target-3",
      "direction": "top"
    }]'>

<brad-popover-stepper-previous>Anterior</brad-popover-stepper-previous>
<brad-popover-stepper-next>Próximo</brad-popover-stepper-next>
<brad-popover-stepper-close>Fechar</brad-popover-stepper-close>
</brad-popover-stepper>

</div>
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
| currentItemChanged | brad-popover-stepper | Disparado ao alterar (Próximo ou Anterior) entre os passos |

# Como usar os eventos?
```
const component = document.querySelector("#popover-stepper");

component.addEventListener("currentItemChanged", (event) => {
console.log("Passo atual:", event.detail);
});
```
## Acessibilidade

A maior parte da acessibilidade do Popover Stepper é controlada automaticamente pelo próprio componente. Isso inclui a ordem de foco dos elementos, o controle dos atributos tabindex, aria-hidden, e a visibilidade dos botões conforme o contexto de cada passo.

O container do popover utiliza o atributo role="dialog", indicando ao leitor de tela que se trata de uma caixa de dialogo.
O conteúdo principal fica em um <p class="brad-popover__text">.

O componente Popover Stepper controla a ordem de foco dos elementos interativos para proporcionar uma navegação lógica e previsível via teclado:

Texto do Passo: O foco inicial é direcionado ao texto explicativo do passo atual, permitindo que leitores de tela anunciem o conteúdo imediatamente.
Botão "Anterior": Se disponível, o foco segue para o botão de voltar ao passo anterior.
Botão "Próximo": Em seguida, o foco vai para o botão de avançar para o próximo passo.
Botão "Fechar Tutorial": Por fim, o foco é direcionado ao botão de fechar o tutorial.

Essa ordem garante que o usuário percorra todos os elementos relevantes do popover antes de sair do fluxo do tutorial.

# Exemplos
Popover Stepper
```
<div class="brad-m-xl-t brad-p-xxl-t">
  <section class="brad-m-xl-t brad-p-xxl-t">
    <div
      class="brad-flex brad-flex-justify-content-center brad-font-paragraph-md brad-m-xl-t brad-p-xxl-t"
    >
      <a
        id="popover-step-109"
        class="brad-text-link  brad-p-sm"
        role="button"
        aria-label="Primeiro passo Abrir popover stepper"
        tabindex="0"
        aria-expanded="false"
      >
        Step 1
      </a>
    </div>
    <div id="popover-step-367" class="brad-card brad-card--default brad-p-lg">
      <div>
        <h1>Step 2</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          posuere erat a ante.
        </p>
      </div>
    </div>
    <button
      id="popover-step-347"
      class="brad-btn brad-btn-primary  brad-m-xl-t brad-p-sm"
    >
      Step 3
    </button>
  </section>

  <brad-popover-stepper
    id=popover-378
    brad-id-target="popover-step-109"
    brad-on-color="false"
    brad-direction="bottom"
    brad-hidden-close-button="false"
    brad-list="[{&quot;id&quot;:&quot;1&quot;,&quot;text&quot;:&quot;1 Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.&quot;,&quot;target&quot;:&quot;popover-step-109&quot;,&quot;direction&quot;:&quot;bottom&quot;},{&quot;id&quot;:&quot;2&quot;,&quot;text&quot;:&quot;2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.&quot;,&quot;target&quot;:&quot;popover-step-367&quot;},{&quot;id&quot;:&quot;3&quot;,&quot;text&quot;:&quot;3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices venenatis diam a commodo. Maecenas nulla arcu, auctor aliquam mauris non, vehicula eleifend nisl.&quot;,&quot;target&quot;:&quot;popover-step-347&quot;,&quot;direction&quot;:&quot;top&quot;}]"
  >
    <brad-popover-stepper-previous>Anterior</brad-popover-stepper-previous>
    <brad-popover-stepper-next>Próximo</brad-popover-stepper-next>
    <brad-popover-stepper-close>Fechar</brad-popover-stepper-close>
  </brad-popover-stepper>
</div>
```