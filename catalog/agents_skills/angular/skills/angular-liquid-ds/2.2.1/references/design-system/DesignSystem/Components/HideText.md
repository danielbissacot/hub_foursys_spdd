# HideText

O componente Hide Text ou Ocultar Texto é usado para ocultar ou mostrar valores monetários da sua conta, da sua fatura de cartão de crédito, investimentos, entre outros. O componente é apresentado acompanhado de um ícone ou botão para mostrar ou esconder a visualização dos valores.

# Sumário
Uso do HTML
```
<section class="brad-flex">
  <div class="brad-flex brad-flex-align-items-center">
    Lorem ipsum:

    <!-- START: Componente hide-text -->
    <span id="hide-text" class="brad-hide-text brad-m-xs-l">
      <strong>Lorem ipsum</strong>
    </span>
    <!-- END: Componente hide-text -->

  </div>

  <button class="brad-m-sm-l" onclick="toggleHideText();">
    <span class="icon-component-eye-hidden brad-icon-size-sm brad-text-color-cta"></span>
  </button>
</section>
```
Comportamento Javascript
Inicialização
```
const targetSelector = "#hide-text";
const options = { targetSelector };
const service = LiquidCorp.BradHideTextService.getInstance(options);

function toggleHideText() {
  service.toggle(toggleEyeIcon);
}

function toggleEyeIcon() {
  const iconEyeElement = document.querySelector(".icon-component");

  if (iconEyeElement.classList.contains("icon-component-eye-hidden")) {
    iconEyeElement.classList.replace("icon-component-eye-hidden", "icon-component-eye-visible");
  } else {
    iconEyeElement.classList.replace("icon-component-eye-visible", "icon-component-eye-hidden");
  }
}
```
## Métodos

| Métodos | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| toggle | callback? () => {} | Alterna a exibição do texto com base nas configurações do HTML. Executa o callback após alternar o estado. |
| isHidden | boolean | Retorna um booleano indicando se o texto está atualmente oculto. |

# Acessibilidade

O componente já inclui atributos de acessibilidade como aria-hidden e aria-label para garantir compatibilidade com leitores de tela. O botão altera seu estado visual e textual de acordo com a ação.

```
<section class="brad-flex">
  <div class="brad-flex brad-flex-align-items-center">
    Lorem ipsum:

    <span id="hide-text" class="brad-hide-text brad-m-xs-l">
      <strong>Lorem ipsum</strong>
    </span>
  </div>

  <button class="brad-m-sm-l" aria-label="Esconder texto." onclick="toggleHideText();">
    <span class="icon-component-eye-hidden brad-icon-size-sm brad-text-color-cta"></span>
  </button>
</section>
```
```
function toggleHideText() {
  service.toggle(toggleEyeIcon);
}

function toggleEyeIcon() {
  const icon = document.querySelector(".icon-component");
  const button = document.querySelector("#hide-text");

  if (icon.classList.contains("icon-component-eye-hidden")) {
    icon.classList.replace("icon-component-eye-hidden", "icon-component-eye-visible");
    button.setAttribute("aria-label", "Mostrar texto escondido.");
  } else {
    icon.classList.replace("icon-component-eye-visible", "icon-component-eye-hidden");
    button.setAttribute("aria-label", "Esconder texto.");
  }
}
```
Exemplos
Default
```
<section class="brad-flex brad-flex-align-items-center">
  <div class="brad-flex brad-flex-align-items-center">
    Lorem ipsum:
    <!--Inicio do componente hide-text-->
    <span
      id="hide-87"
      class="brad-hide-text brad-hide-text--hide brad-m-xs-l brad-prevent-select"
    >
      <strong>Lorem ipsum</strong>
    </span>
    <!--Fim do componente hide-text-->
  </div>

  <button
    class="brad-m-sm-l"
    onclick="LiquidCorp.BradHideTextService.getInstance({ targetSelector: '#hide-87' }).toggle(toggleEyeIcon);"
  >
    <span
      class="brad-hide-text__icon icon-component-eye-visible brad-icon-size-sm brad-text-color-cta"
    ></span>
  </button>
</section>
```
O texto está oculto por padrão
```
<section class="brad-m-sm-b">
  <div class="brad-m-sm-b">
    Lorem ipsum:
    <!--Inicio do componente hide-text-->
    <span id="hide-326" class="brad-hide-text brad-m-xs-l">
      <strong>Lorem ipsum</strong>
    </span>
    <!--Fim do componente hide-text-->
  </div>

  <a
    class="brad-text-link brad-prevent-select"
    onclick="LiquidCorp.BradHideTextService.getInstance({ targetSelector: '#hide-326' }).toggle();"
    >Mostrar/Ocultar</a
  >
</section>
```
O texto é alternado com um único botão
```
<section>
  <div class="brad-m-sm-b">
    Lorem ipsum:
    <!--Inicio do componente hide-text-->
    <span id="hide-198" class="brad-hide-text brad-m-xs-l">
      <strong>Lorem ipsum</strong>
    </span>
    <!--Fim do componente hide-text-->
  </div>

  <button
    class="brad-btn brad-btn-primary"
    onclick="LiquidCorp.BradHideTextService.getInstance({ targetSelector: '#hide-198' }).toggle();"
  >
    Mostrar/Ocultar
  </button>
</section>
```
O texto é alternado com botões separados para mostrar e esconder

Se precisar apenas mostrar ou esconder elementos no DOM, sem alternar entre os dois estados (como o toggle() faz), as funções show() e hide() são alternativas simples e diretas.

```
<section>
  <div class="brad-m-sm-b">
    Lorem ipsum:
    <!--Inicio do componente hide-text-->
    <span id="hide-304" class="brad-hide-text brad-m-xxs-l">
      <strong>Lorem ipsum</strong>
    </span>
    <!--Fim do componente hide-text-->
  </div>

  <div class="brad-flex brad-flex-row">
    <button
      class="brad-btn brad-btn-primary brad-m-sm-r"
      onclick="LiquidCorp.BradHideTextService.getInstance({ targetSelector: '#hide-304' }).show();"
    >
      Mostrar
    </button>
    <button
      class="brad-btn brad-btn-primary"
      onclick="LiquidCorp.BradHideTextService.getInstance({ targetSelector: '#hide-304' }).hide();"
    >
      Ocultar
    </button>
  </div>
</section>
```