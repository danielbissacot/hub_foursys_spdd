# HTML

## Componente de envio de mensagens de texto
.

# Uso do HTML
```
<div id="brad-sendbox-container" class="brad-chat-sendbox">
  <div class="text-container">
    <label class="brad-text-field">
      <textarea aria-label="Campo de texto" type="text" placeholder="" rows="1" data-textarea-expander>Label</textarea>
      <div class="brad-text-field--background"></div>
    </label>
  </div>

  <button class="btn-action brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active">
    <em class="fab-icon i icon-ui-chevron-right"></em>
    <div class="fab-text">Enviar</div>
  </button>
</div>
Copy
```


# Comportamento Javascript
## Inicialização

## Inicializar elementos do Template

```
const targetSelector = "#brad-sendbox-container";
const options = { targetSelector };
const service = LiquidCorp.BradChatSendBoxService.getInstance(options);
Copy
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object {}], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |

# Eventos

| Evento | Descrição |
| --- | --- |
| clickActionButton | Evento que capta o click no botão de ação ao lado do campo de texto |
| clickSendboxIconArea | Evento que capta o click no botão de ícone que fica no início dentro do campo de texto |

## Exemplos do uso de eventos na jornada
```
const micButton = document.querySelector("#brad-sendbox-container2 .btn-action");
const sendboxIconArea = document.querySelector("#brad-sendbox-container2 .brad-chat-sendbox__icon-area");

micButton.addEventListener("clickActionButton", (e) => {});
sendboxIconArea.addEventListener("clickSendboxIconArea", (e) => {});
Copy
```
Exemplo
```
<div id="brad-sendbox-container-365" class="brad-chat-sendbox ">
      <div class="text-container">
        <label class="brad-text-field">
          <textarea
            
            aria-label="Campo de texto"
            type="text"
            placeholder=""
            rows="1"
            data-textarea-expander
          >
Label</textarea
          >
          <div class="brad-text-field--background"></div>
        </label>
      </div>

      <button
        class="btn-action brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
      >
        <em class="fab-icon i icon-component-send"></em>
        <div class="fab-text">Enviar</div>
      </button>
    </div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| disabled | boolean |  | FalseTrue |

# STORIES
Default
```
<div id="brad-sendbox-container-365" class="brad-chat-sendbox ">
      <div class="text-container">
        <label class="brad-text-field">
          <textarea
            
            aria-label="Campo de texto"
            type="text"
            placeholder=""
            rows="1"
            data-textarea-expander
          >
Label</textarea
          >
          <div class="brad-text-field--background"></div>
        </label>
      </div>

      <button
        class="btn-action brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
      >
        <em class="fab-icon i icon-component-send"></em>
        <div class="fab-text">Enviar</div>
      </button>
    </div>
```
With Add Option
```
<div
      id="brad-sendbox-container2"
      class="brad-chat-sendbox brad-chat-sendbox--add-option "
    >
      <div class="text-container">
        <label class="brad-text-field">
          <textarea
            
            aria-label="Campo de texto"
            type="text"
            placeholder=""
            rows="1"
            data-textarea-expander
          >
Label</textarea
          >
          <div class="brad-text-field--background"></div>

          <div class="brad-chat-sendbox__icon-area">
            <em
              class="i icon-component-plus-add brad-icon-size-sm brad-text-color-cta"
            ></em>
          </div>
        </label>
      </div>

      <button
        class="btn-action brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
      >
        <em class="fab-icon i icon-component-send"></em>
        <div class="fab-text">Enviar</div>
      </button>
    </div>
```
With Error
```
<div
      id="brad-sendbox-container4"
      class="brad-chat-sendbox brad-chat-sendbox--helper-text brad-chat-sendbox--error "
    >
      <div class="text-container">
        <label class="brad-text-field">
          <textarea
            
            aria-label="Campo de texto"
            type="text"
            placeholder=""
            rows="1"
            data-textarea-expander
          >
Label</textarea
          >
          <div class="brad-text-field--background"></div>

          <div class="brad-chat-sendbox__helper">
            <p>Limite de caracteres atingido</p>
          </div>
        </label>
      </div>

      <button
        class="btn-action brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
      >
        <em class="fab-icon i icon-component-send"></em>
        <div class="fab-text">Enviar</div>
      </button>
    </div>
```
With Helper Text
```
<div
      id="brad-sendbox-container5"
      class="brad-chat-sendbox brad-chat-sendbox--helper-text "
    >
      <div class="text-container">
        <label class="brad-text-field">
          <textarea
            
            aria-label="Campo de texto"
            type="text"
            placeholder=""
            rows="1"
            data-textarea-expander
          >
Label</textarea
          >
          <div class="brad-text-field--background"></div>

          <div class="brad-chat-sendbox__helper">
            <p>Helper text</p>
          </div>
        </label>
      </div>

      <button
        class="btn-action brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
      >
        <em class="fab-icon i icon-component-send"></em>
        <div class="fab-text">Enviar</div>
      </button>
    </div>
```
With Mic Option
```
<div
  id="brad-sendbox-container6"
  class="brad-chat-sendbox brad-chat-sendbox--add-option "
>
  <div class="text-container">
    <label class="brad-text-field">
      <textarea
        
        aria-label="Campo de texto"
        type="text"
        placeholder=""
        rows="1"
        data-textarea-expander
      ></textarea>
      <div class="brad-text-field--background"></div>

      <div class="brad-chat-sendbox__icon-area">
        <em
          class="i icon-component-plus-add brad-icon-size-sm brad-text-color-cta"
        ></em>
      </div>
    </label>
  </div>

  <button
    class="btn-action brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
  >
    <em class="fab-icon i icon-component-audio-mic"></em>
    <div class="fab-text">Enviar</div>
  </button>
</div>
```