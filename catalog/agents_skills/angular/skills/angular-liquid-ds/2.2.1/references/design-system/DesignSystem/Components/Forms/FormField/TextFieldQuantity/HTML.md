# HTML

Campo numérico com botões de adição e subtração utilizado para valores pequenos.
.

# Uso do HTML
```
<label id="text-field-quantity" class="brad-text-field brad-m-md-b brad-text-field-quantity">
  <input aria-label="Campo númerico" class="" type="number" step="1" min="0" max="5" value="0" placeholder="" />

  <button aria-label="Subtrair" class="minus complements left"></button>
  <button aria-label="Somar" class="plus complements right"></button>

  <span class="helper-text error-message">Digite um valor válido</span>
  <div class="brad-text-field--background"></div>
</label>
Copy
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do Template

```
const targetSelector: "#text-field-quantity";
const options = { targetSelector };
const service = LiquidCorp.BradTextFieldQuantityService.getInstance(options);
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
| getValue | - | Obtém o valor digitado no campo |
| verifyValueBiggerMax | - | Retorna se o valor digitado é maior que o máximo permitido |
| verifyValueLessMin | - | Retorna se o valor digitado é menor que o mínimo permitido |
| verifyIfValueEqualMax | - | Retorna se o valor digitado é igual ao máximo permitido |
| verifyIfValueEqualMin | - | Retorna se o valor digitado é igual ao mínimo permitido |
| valueChanges | - | Evento que pode ser escutado junto a eTextFieldQuantityContainer que monitora alterações no valor |

# Uso básico
```
const service = LiquidCorp.BradTemplateService.getInstance(options);
service.getValue();
Copy
```
## Observações

A validação e exibição de erros no campo ficam a cargo da jornada, a seguir um exemplo de uso:

```
const quantityService = LiquidCorp.BradTextFieldQuantityService.getInstance({
  targetSelector: "#text-field-quantity",
});
const feedbackElement = document.querySelector("#feedback.helper-text");
const myInput = quantityService.eTextFieldQuantityContainer;
const successMessage = "Sucesso";
const errorMessage = "Digite um valor válido";

function showFeedback(validation) {
  if (validation === "valid") {
    myInput.classList.add("brad-text-field-quantity__valid");
    feedbackElement.classList.add("success-message");
    feedbackElement.innerHTML = successMessage;
  } else if (validation === "invalid") {
    myInput.classList.add("brad-text-field-quantity__invalid");
    feedbackElement.classList.add("error-message");
    feedbackElement.innerHTML = errorMessage;
  }
  feedbackElement.setAttribute("aria-hidden", "false");
  feedbackElement.setAttribute("tabindex", "1");
  feedbackElement.classList.add("show-message");
}

function hideFeedback() {
  if (feedbackElement.classList.contains("show-message")) {
    myInput.classList.remove("brad-text-field-quantity__invalid", "brad-text-field-quantity__valid");
    feedbackElement.classList.remove("success-message", "error-message", "show-message");
    feedbackElement.setAttribute("aria-hidden", "true");
  }
}

myInput.addEventListener("valueChanges", () => {
  hideFeedback();

  if (quantityService.getValue() == 5) {
    showFeedback("valid");
  }

  if (quantityService.verifyValueBiggerMax()) {
    showFeedback("invalid");
  }

  if (quantityService.verifyValueLessMin()) {
    showFeedback("invalid");
  }
});
Copy
```
```
<div class="brad-flex brad-flex-justify-content-center">
  <label style="width: 200px" id="text-field-quantity" class="brad-text-field brad-m-md-b brad-text-field-quantity">
    <input aria-label="Campo númerico" class="" type="number" step="1" min="0" max="5" value="0" placeholder="" />

    <button aria-label="Subtrair" class="minus complements left"></button>
    <button aria-label="Somar" class="plus complements right"></button>

    <span class="helper-text" aria-hidden="true"></span>
    <div class="brad-text-field--background"></div>
  </label>
</div>
Copy
```
## Acessibilidade

Para que seja verbalizado em tempo real ao usuário quando houver alteração de valor atráves de interação com os botões de mais e menos, adicione o atributo aria-live="polite" no elemento input. Com o uso desse atributo pode ocorrer leitura duplicada do valor quando alterado por digitação, cabendo à jornada, juntamente com a equipe de acessibilidade responsável, determinar a experiência desejada.
É necessário incluir o atributo aria-hidden="true" no elemento de feedback de sucesso e erro (helper-text) para que não sejam lidos quando não estiverem visíveis em tela e, alterar via js em seu projeto, para aria-hidden="false" e adicionar tabindex="1" quando a mensagem estiver visível, para que ela seja verbalizada ao usuário.


```
<div class="brad-flex brad-flex-justify-content-center">
  <label style="width: 200px" id="text-field-quantity" class="brad-text-field brad-m-md-b brad-text-field-quantity">
    <input aria-describedby="feedback" aria-live="polite" aria-label="Campo númerico" class="" type="number" step="1" min="0" max="5" value="0" placeholder="" />

    <button aria-label="Subtrair" class="minus complements left"></button>
    <button aria-label="Somar" class="plus complements right"></button>

    <span id="feedback" class="helper-text" aria-hidden="true"></span>
    <div class="brad-text-field--background"></div>
  </label>
</div>
Copy
```
## Exemplo

Obs: Quando algum controle do storybook for modificado o valor do componente será resetado voltando ao seu valor original que é 0.

```
<div class="brad-flex brad-flex-justify-content-center brad-theme-classic">
  <label
    style="width: 200px"
    id="text-field-quantity"
    class="brad-text-field brad-m-md-b brad-text-field-quantity "
  >
    <input
      aria-describedby="feedback"
      aria-live="polite"
      aria-label="Campo númerico"
      class=""
      type="number"
      step="1"
      min="0"
      max="5"
      value="0"
      placeholder=""
      
    />
    <button aria-label="Subtrair" class="minus complements left"></button>
    <button aria-label="Somar" class="plus complements right"></button>
    <span
      id="feedback"
      class="helper-text  "
      aria-hidden="true"
      ></span
    >
    <div class="brad-text-field--background"></div>
  </label>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| backgroundColor | Altera cor de fundo string |  | Choose option... no-background-color brad-bg-color-primary brad-bg-color-secondary brad-bg-color-institucional |
| onColor | Estado de mudança de cor para fundos escuros. Obs: Ativando o modo on-color é recomendado alterar a cor do backgroundColor para primary, secondary ou gradient. boolean |  | FalseTrue |
| validation | string |  | Choose option... non-validation valid invalid |
| disabled | boolean |  | FalseTrue |