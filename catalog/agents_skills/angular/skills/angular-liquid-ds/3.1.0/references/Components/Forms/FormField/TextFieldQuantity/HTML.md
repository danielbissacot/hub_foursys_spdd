# TextFieldQuantity

Campo numérico com botões de adição e subtração utilizado para valores pequenos.

# Uso do HTML
```
<label
  id="text-field-quantity"
  class="brad-text-field brad-m-md-b brad-text-field-quantity"
>
  <input
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

  <span class="helper-text error-message">Digite um valor válido</span>
  <div class="brad-text-field--background"></div>
</label>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do Template

```
const targetSelector = "#text-field-quantity";
const options = { targetSelector };

LiquidCorp.BradTextFieldQuantityService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |

# Métodos

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
const targetSelector = "#text-field-quantity";
const options = { targetSelector };

const service = LiquidCorp.BradTextFieldQuantityService.getInstance(options);
service.getValue();
```
## Observações

A validação e exibição de erros no campo ficam a cargo da jornada, a seguir um exemplo de uso:

```
const MIN = 1;
const MAX = 5;

const VALIDATION_MESSAGES = {
  showClass: 'show-message',
  valid: {
    inputClass: 'brad-text-field-quantity__valid',
    feedbackClass: 'success-message',
    message: 'Sucesso',
  },
  invalid: {
    inputClass: 'brad-text-field-quantity__invalid',
    feedbackClass: 'error-message',
    message: (min, max) => `Digite um valor entre ${min} e ${max}`,
  },
};

function createFeedback(id) {
  const service = LiquidCorp.BradTextFieldQuantityService.getInstance({
    targetSelector: `#${id}`,
  });
  const helperTextElement = document.querySelector(`#${id} .helper-text`);

  if (!helperTextElement) return;

  const inputElement = service.eTextFieldQuantityContainer;
  const feedback = {
    dispatch: [
      { condition: () => feedback.isInvalidValue(), type: 'invalid' },
      {
        condition: () => service.getValue() >= MIN && service.getValue() <= MAX,
        type: 'valid',
      },
    ],

    show(validationType) {
      const config = VALIDATION_MESSAGES[validationType];
      const message = typeof config.message === 'function'
        ? config.message(MIN, MAX)
        : config.message;
      inputElement.classList.add(config.inputClass);
      helperTextElement.classList.add(config.feedbackClass);
      helperTextElement.innerHTML = message;
      helperTextElement.setAttribute('aria-hidden', 'false');
      helperTextElement.setAttribute('tabindex', '1');
      helperTextElement.classList.add(VALIDATION_MESSAGES.showClass);
    },

    hide() {
      if (!helperTextElement.classList.contains(VALIDATION_MESSAGES.showClass)) return;

      inputElement.classList.remove(
        VALIDATION_MESSAGES.invalid.inputClass,
        VALIDATION_MESSAGES.valid.inputClass
      );
      helperTextElement.classList.remove(
        VALIDATION_MESSAGES.valid.feedbackClass,
        VALIDATION_MESSAGES.invalid.feedbackClass,
        VALIDATION_MESSAGES.showClass
      );
      helperTextElement.setAttribute('aria-hidden', 'true');
    },

    isInvalidValue() {
      return service.verifyValueBiggerMax() || service.verifyValueLessMin();
    },

    apply() {
      const match = feedback.dispatch.find(({ condition }) => condition());
      if (match) feedback.show(match.type);
    },

    setup() {
      inputElement.addEventListener('valueChanges', () => {
        feedback.hide();
        feedback.apply();
      });
    },
  };

  feedback.setup();
}

createFeedback('text-field-quantity');
```
```
<div class="brad-flex brad-flex-justify-content-center">
  <label
    style="width: 200px"
    id="text-field-quantity"
    class="brad-text-field brad-m-md-b brad-text-field-quantity"
  >
    <input
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

    <span class="helper-text" aria-hidden="true"></span>
    <div class="brad-text-field--background"></div>
  </label>
</div>
```
## Acessibilidade

Para que seja verbalizado em tempo real ao usuário quando houver alteração de valor atráves de interação com os botões de adição e subtração, adicione o atributo aria-live="polite" no elemento input. Com o uso desse atributo pode ocorrer leitura duplicada do valor quando alterado por digitação, cabendo à jornada, juntamente com a equipe de acessibilidade responsável, determinar a experiência desejada.

É necessário incluir o atributo aria-hidden="true" no elemento de feedback de sucesso e erro (helper-text) para que não sejam lidos quando não estiverem visíveis em tela e, alterar via js em seu projeto, para aria-hidden="false" e adicionar tabindex="1" quando a mensagem estiver visível, para que ela seja verbalizada ao usuário.

```
<div class="brad-flex brad-flex-justify-content-center">
  <label
    style="width: 200px"
    id="text-field-quantity"
    class="brad-text-field brad-m-md-b brad-text-field-quantity"
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

    <span id="feedback" class="helper-text" aria-hidden="true"></span>
    <div class="brad-text-field--background"></div>
  </label>
</div>
```
Exemplos
Default
```
<label
  id="Z661332874136"
  class="brad-text-field brad-m-md-b brad-text-field-quantity "
>
  <input
    aria-describedby="feedback"
    aria-live="polite"
    aria-label="Campo númerico"
    class=""
    type="number"
    step="1"
    min="1"
    max="5"
    value="0"
    placeholder=""
    
  />
  <button aria-label="Subtrair" class="minus complements left"></button>
  <button aria-label="Somar" class="plus complements right"></button>
  <span
    id="feedback"
    class="helper-text "
    aria-hidden="true"
    ></span
  >
  <div class="brad-text-field--background"></div>
</label>
```
## Copy code