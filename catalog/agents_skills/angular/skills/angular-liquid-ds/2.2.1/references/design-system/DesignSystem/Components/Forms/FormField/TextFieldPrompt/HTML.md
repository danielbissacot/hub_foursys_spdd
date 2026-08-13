# HTML

## Componente de pesquisa integrado a um card animado
.

# Uso do HTML
```
<div id="prompt-field" class="brad-text-field--prompt">
  <div class="brad-text-field--prompt-input" data-acessibility>
    <label class="brad-text-field">
      <input aria-label="Campo de texto" type="text" value="" placeholder="Texto de entrada" class="brad-font-title-sm" />

      <div class="leading-icon bia complements">
        <em aria-hidden="true" class="i icon-component-chat-bia"></em>
      </div>

      <button aria-label="Deletar texto" class="delete brad-input-prompt-icon trailing-button-text complements"></button>

      <button aria-label="Pesquisar" class="search brad-input-prompt-icon trailing-button-text complements"></button>

      <span class="helper-text">Helper text</span>
      <div class="brad-text-field--background"></div>
    </label>

    <button data-acessibility class="brad-btn brad-btn-icon btn-prompt" aria-label="Usar microfone">
      <em class="btn-icon i icon-component-audio-mic"></em>
    </button>
  </div>

  <div class="brad-text-field--prompt__card" role="dialog">
    <div class="brad-text-field--prompt__card-icon--logo bia">
      <em aria-hidden="true" class="i icon-component-chat-bia"></em>
    </div>

    <div class="brad-text-field--prompt__card-content">
      <span class="brad-text-field--prompt__card-content--placeholder" data-acessibility>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>

      <div class="brad-text-field--prompt__card-container">
        <p class="brad-text-field--prompt__card-content--text hidden" data-acessibility>Falta pouco! A proposta do seu cartão de crédito vence em 2 dias. Que tal concluir agora?</p>

        <div class="visually-hidden" aria-live="assertive" aria-atomic="true"></div>
      </div>

      <a href="#" target="_blank" class="brad-text-link action-link hidden"> Concluir contratação </a>
    </div>

    <div class="brad-text-field--prompt__card-icon--close hidden">
      <button aria-label="Fechar card Bia" class="i icon-component-close-delete brad-text-color-cta"></button>
    </div>
  </div>
</div>
Copy
```


# Comportamento Javascript
## Inicialização

## Inicializar elementos do TextFieldPrompt

```
const targetSelector = "#prompt-card";
const options = {
  targetSelector: `#${idPrompt}`,
  typeCharacterSpeed: 20,
  promptCardType: "overlap",
};
const service = LiquidCorp.BradTextFieldPromptService.getInstance(options);
Copy
```
## Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| typeCharacterSpeed | number | 70 | Tempo em milissegundos para a animação de escrita da mensagem |
| promptCardType | string | 'overlap' | Tipo do comportamento do prompt card, tendo duas opções: 'overlap' quando o card abre seu conteúdo sobre os próximos elementos ou 'push' quando o card abre seu conteúdo empurrando os próximos elementos |

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| showPromptCard | - | Exibe o prompt card no estágio inicial 'digitando' com a animação nas 'dots' |
| showMessageInCard | - | Remove as 'dots' e começa a escrever a mensagem e o conteúdo no prompt card |
| closePromptCard | - | Fecha o prompt card |
| setPromptCardMessage | messageText: string | Seta o texto da mensagem via script (*É necessário deixar a div da mensagem vazia no código) |
| setPromptCardActionLink | messageLinkProps: {link: string, text: string} | Seta o texto e o link do botão de ação via script (*É necessário deixar a tag button do botão de ação vazia no código) |

# EventListeners

| Elemento | Método | Evento | Descrição |
| --- | --- | --- | --- |
| service.promptCard | addEventListener | "opened" | É disparado sempre que o promptCard é aberto |
| service.promptCard | addEventListener | "closed" | É disparado sempre que o promptCard é fechado |

# Uso básico
No exemplo a seguir a lógica da jornada é setada para que abra o prompt card após 2 segundos em que o usuário não tenha tido interação com o input de texto.

Como ilustração, a segunda etapa da escrita da mensagem começa após 3 segundos do prompt aberto, podendo ser personalizado de acordo com a necessidade da jornada.

No exemplo, se houver a interação do usuário com o input, o prompt card não é aberto.
```
const idPrompt = "prompt-field";
const timerToShowPromptCard = 2000;
let timer;

const targetSelector = idPrompt;
const options = {
  targetSelector: `#${idPrompt}`,
  typeCharacterSpeed: 70,
  promptCardType: "overlap",
};
const service = LiquidCorp.BradTextFieldPromptService.getInstance(options);

const input = document.getElementById(idPrompt).querySelector("input");

const showPromptCard = () => {
  service.showPromptCard();

  setTimeout(() => {
    service.showMessageInCard();
  }, 3000);
};

const cancelShowPromptCard = () => {
  clearTimeout(timer);
};

timer = setTimeout(showPromptCard, timerToShowPromptCard);
input.addEventListener("focus", cancelShowPromptCard);
Copy
```
Obervações
## Acessibilidade

Para ocultar elementos na leitura da abertura do prompt-card utilize a tag data-acessibility em elementos que não devem ser lidos enquanto o card estiver aberto.

# Ícone BIA

Para utilizar os ícones de maneira correta no estado default, utilize a classe icon-component-chat-bia dentro de leading-icon na tag em do input quanto dentro da tag brad-text-field--prompt__card-icon--logo dentro do prompt-card.


Para utilizar os ícones de maneira correta no estado oncolor, utilize a classe icon-component-chat-bia-oncolor dentro de leading-icon na tag em do input e dentro da tag brad-text-field--prompt__card-icon--logo dentro do prompt-card, utilize icon-component-chat-bia.

# Exemplo
```
<div
  id="text-field-prompt-2228"
  class="brad-text-field--prompt "
>
  <div class="brad-text-field--prompt-input" data-acessibility>
    <label
      class="brad-text-field  "
    >
      <input
        aria-label="Campo de texto"
        type="text"
        value=""
        placeholder="Texto de entrada"
        class="brad-font-title-sm"
        
      />

      <div class="leading-icon bia complements">
        <em aria-hidden="true" class="i icon-component-chat-bia"></em>
      </div>

      <button
        aria-label="Deletar texto"
        class="delete brad-input-prompt-icon trailing-button-text complements"
      ></button>

      <button
        aria-label="Pesquisar"
        class="search brad-input-prompt-icon trailing-button-text complements"
      ></button>

      <span class="helper-text">Helper text</span>

      <div class="brad-text-field--background"></div>
    </label>

    <button
      data-acessibility
      class="brad-btn brad-btn-icon btn-prompt"
      aria-label="Usar microfone"
      
    >
      <em class="btn-icon i icon-component-audio-mic"></em>
    </button>
  </div>

  <div class="brad-text-field--prompt__card" role="dialog">
    <div class="brad-text-field--prompt__card-icon--logo bia">
      <em aria-hidden="true" class="i icon-component-chat-bia"></em>
    </div>

    <div class="brad-text-field--prompt__card-content">
      <span
        class="brad-text-field--prompt__card-content--placeholder"
        data-acessibility
      >
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>

      <div class="brad-text-field--prompt__card-container">
        <p
          class="brad-text-field--prompt__card-content--text hidden"
          data-acessibility
        >
          Falta pouco! A proposta do seu cartão de crédito vence em 2 dias.
          Que tal concluir agora?
        </p>

        <div
          class="visually-hidden"
          aria-live="assertive"
          aria-atomic="true"
        ></div>
      </div>

      <a href="#" target="_blank" class="brad-text-link action-link hidden">
        Concluir contratação
      </a>
    </div>

    <div class="brad-text-field--prompt__card-icon--close">
      <button
        aria-label="Fechar card Bia"
        class="i icon-component-close-delete brad-text-color-cta"
      ></button>
    </div>
  </div>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| backgroundColor | Altera cor de fundo string |  | Choose option... no-background-color brad-bg-color-primary brad-bg-color-secondary brad-bg-color-institucional |
| onColor | Estado de mudança de cor para fundos escuros. boolean |  | FalseTrue |
| disabled | boolean |  | FalseTrue |
| validation | string |  | Choose option... non-validation valid invalid |