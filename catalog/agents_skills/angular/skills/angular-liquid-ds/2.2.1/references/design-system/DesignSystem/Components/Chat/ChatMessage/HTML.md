# Chat Message

Componente que representa o balão de texto do Consultor/Assistente/BIA e do cliente.

# Uso do HTML
## Uso básico

O componente oferece três variações principais: Inbound (Consultor), Outbound (Cliente) e Bot (Assistente/BIA).

# Inbound (Consultor)
```
<div class="brad-chat-container brad-chat-container-0">
<div id="inbound" class="brad-message brad-message--inbound">
  <div class="message-content">
    <div class="brad-message__bubble" aria-live="polite">
      <p class="message-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus eligendi velit, aperiam corporis obcaecati aut! Distinctio fugit consectetur natus voluptatibus molestias? Voluptate veniam quisquam non perspiciatis animi quia.</p>
    </div>

    <div class="brad-message__hint" aria-live="polite">
      <p>16:50 Nome do consultor</p>
    </div>
  </div>

</div>
</div>
```
Outbound (Cliente)
```
<div class="brad-chat-container brad-chat-container-0">
<div id="outbound" class="brad-message brad-message--outbound">
  <div class="message-content">
    <div class="brad-message__bubble" aria-live="polite">
      <p class="message-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
    </div>

    <div class="brad-message__hint" aria-live="polite">
      <p>
        16:56
        <em role="img" aria-label="Mensagem enviada" class="i icon-component-received brad-text-color-cta brad-icon-size-sm"></em>
      </p>
    </div>
  </div>

</div>
</div>
```
Bot (Assistente / BIA)
```
<div class="brad-chat-container brad-chat-container-0">
<div id="bot" class="brad-message brad-message--bot">
  <div class="message-content">
    <div class="brad-message__bubble" aria-live="polite">
      <p class="message-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus eligendi</p>
    </div>

    <div class="brad-message__hint" aria-live="polite">
      <p>16:55</p>
    </div>
  </div>

</div>
</div>
```
Comportamento Javascript
## Inicialização

A inicialização é necessária para configurar o gerenciamento das mensagens de chat, incluindo estados de status, reenvio e visualização de imagens.

```
function resend(e) {
console.log(e.messageId);
}

const targetSelector = ".brad-chat-container-1";
const options = { targetSelector, resendHandler: resend };
const service = LiquidCorp.BradChatMessageService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instância de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parâmetro um array de objetos [Object {}], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| resendHandler | function | - | (Para o modo error status) A função que você deseja chamar quando for clicado botão de reenvio de mensagem, e o evento retorna "messageId" |
| numLines | number | 6 | Número de linhas que devem ser ultrapassados para ativar o botão ver mais. |

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| removeMessageErrorStatus | messageId | Por meio do id informado no parâmetro, remove o status de erro do balão da mensagem |
| addMessageErrorStatus | messageId, newMessage, callbackResend | Por meio do id informado no parâmetro, adiciona o status de erro ao balão da mensagem, no parâmetro newMessage, é setado o valor do texto de status do balão. Opcionalmente pode receber uma função callbackResend para tratar o reenvio |
| addMessageSendingStatus | messageId, newMessage | Por meio do id informado no parâmetro, adiciona o status de enviando ao balão da mensagem, no parâmetro newMessage, é setado o valor do texto de status do balão |
| addMessageSendedStatus | messageId, newMessage | Por meio do id informado no parâmetro, adiciona o status de enviado ao balão da mensagem, no parâmetro newMessage, é setado o valor do texto de status do balão |
| showHiddenPreviewImage | messageId | Por meio do id informado no parâmetro, busca o container de preview da imagem e desabilita o efeito blur, tornando a imagem de preview visível |
| handleMinimizeText | element | Processa a minimização de texto para um elemento de mensagem específico, aplicando a funcionalidade "Ver mais" quando necessário |
| setTypingIndicator | options: {actor?, show?, onHide?} | Controla o indicador de digitação. actor: 'bot' \| 'inbound' \| 'outbound' ('bot' padrão) - define o tipo de mensagem. show: boolean (true padrão) - exibe/oculta o indicador. onHide: function (opcional) - callback executado ao ocultar |

# Uso básico
```
const service = LiquidCorp.BradChatMessageService.getInstance(options);

// Gerenciamento de status de mensagem
service.removeMessageErrorStatus("messageId");
service.addMessageErrorStatus("messageId", "Erro ao enviar mensagem", resendCallback);
service.addMessageSendingStatus("messageId", "Enviando mensagem");
service.addMessageSendedStatus("messageId", "16:50");

// Preview de imagem
service.showHiddenPreviewImage("messageId");

// Minimização de texto
const messageElement = document.getElementById("messageId");
service.handleMinimizeText(messageElement);

// Indicador de digitação
service.setTypingIndicator({
actor: 'bot', // 'bot', 'inbound' ou 'outbound'
show: true,
onHide: () => console.log('Indicador ocultado')
});

// Exemplos com diferentes tipos de actor
service.setTypingIndicator({ actor: 'bot' }); // Assistente/BIA
service.setTypingIndicator({ actor: 'inbound' }); // Consultor
service.setTypingIndicator({ actor: 'outbound' }); // Cliente
service.setTypingIndicator({
show: false,
onHide: () => console.log('Indicador removido')
});
```
## Acessibilidade

Segue as seguintes configurações e setups dos atributos dos elementos, para que os leitores de tela passem as informações completas e da forma coerente.

O botão de "Ver mais" é preciso ter o atributo "role" do tipo button para que ele seja alcançável na navegação.

O botão de reenvio de mensagem é necessário os atributos de "aria-label" e "role" do tipo button, para que possa ser alcançável e informado.

Apenas para mensagens com status de enviado, e como não existe texto para informar se a mensagem foi enviada, é necessário adicionar ao ícone o atributo "role" do tipo img e um "aria-label" informando "Mensagem enviada".

Caso exista atualização de status é recomendado a utilização do "aria-live" polite, para que o leitor leia as mudanças. Recomendado utilizar o "aria-live" nos elementos que possuem a classe "brad-messagebubble" e "brad-messagehint".

Para mensagens que possuem imagem, nesse caso é importante definir o "aria-label" dos elementos que possuem a classe "file-preview". Quando a imagem está escondida, o "aria-label" será "Visualizar imagem", e quando clicado e aparecer a imagem o "aria-label" deverá ser alterado com a descrição da imagem.

# Exemplos
Default
```
<div id="brad-message-326" class="brad-chat-container">
  <div
    id="brad-message-4120"
    class="brad-message brad-message--inbound"
    aria-live="polite"
  >
    <div class="message-content">
      <div class="brad-message__bubble">
        <p class="message-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
      </div>

      <div class="brad-message__hint" aria-live="polite">
        <p>16:50</p>
      </div>
    </div>
  </div>
</div>
```
Indicador de digitação
```
<div id="brad-message-819" class="brad-chat-container">
  <div
    id="brad-message-4121"
    class="brad-message brad-message--bot"
    aria-live="polite"
  >
    <div class="message-content">
      <div class="brad-message__bubble">
        <p class="message-text">Olá! Como posso te ajudar hoje?</p>
      </div>

      <div class="brad-message__hint" aria-live="polite">
        <p>16:45</p>
      </div>
    </div>
  </div>

  <div
    id="brad-message-2694"
    class="brad-message brad-message--outbound"
  >
    <div class="message-content">
      <div class="brad-message__bubble">
        <p class="message-text">Tenho uma dúvida sobre minha conta.</p>
      </div>

      <div class="brad-message__hint">
        <p>
          16:46
          <div role="img" aria-label="Mensagem enviada" alt="Mensagem enviada" class="i icon-component-received brad-text-color-cta brad-icon-size-xxs"></div>
        </p>
      </div>
    </div>
  </div>
</div>
```
Múltiplas mensagens
```
<div class="brad-chat-container brad-chat-container-1">
  <div class="multiple-messages">
    <div
      id="brad-message-3"
      class="brad-message brad-message--outbound"
    >
      <div class="message-content">
        <div class="brad-message__bubble" aria-live="polite">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </div>

    <div
      id="brad-message-1"
      class="brad-message brad-message--outbound"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </div>

    <div
      id="brad-message-42"
      class="brad-message brad-message--outbound"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </div>

    <div
      id="brad-message-22"
      class="brad-message brad-message--outbound"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

        <div class="brad-message__hint" aria-live="polite">
          <p>
            16:50
            <em
              role="img"
              aria-label="Mensagens enviadas"
              class="i icon-component-received brad-text-color-cta brad-icon-size-xxs"
            ></em>
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="multiple-messages">
    <div
      id="brad-message-23"
      class="brad-message brad-message--inbound"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </div>

    <div
      id="brad-message-21"
      class="brad-message brad-message--inbound"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </div>

    <div
      id="brad-message-25"
      class="brad-message brad-message--inbound"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

        <div class="brad-message__hint" aria-live="polite">
          <p>16:50 Nome do consultor</p>
        </div>
      </div>
    </div>
  </div>

  <div class="multiple-messages">
    <div
      id="brad-message-27"
      class="brad-message brad-message--bot"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </div>

    <div
      id="brad-message-12"
      class="brad-message brad-message--bot"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </div>

    <div
      id="brad-message-28"
      class="brad-message brad-message--bot"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

        <div class="brad-message__hint" aria-live="polite">
          <p>16:50</p>
        </div>
      </div>
    </div>
  </div>

  <div class="multiple-messages">
    <div
      id="brad-message-15"
      class="brad-message brad-message--outbound"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </div>

    <div
      id="brad-message-17"
      class="brad-message brad-message--outbound"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

        <div class="brad-message__hint" aria-live="polite">
          <p>
            16:52
            <em
              role="img"
              aria-label="Mensagens enviadas"
              class="i icon-component-received brad-text-color-cta brad-icon-size-xxs"
            ></em>
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="multiple-messages">
    <div
      id="brad-message-21"
      class="brad-message brad-message--inbound"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </div>

    <div
      id="brad-message-15"
      class="brad-message brad-message--inbound"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

        <div class="brad-message__hint" aria-live="polite">
          <p>16:50 Nome do consultor</p>
        </div>
      </div>
    </div>
  </div>

  <div class="multiple-messages">
    <div
      id="brad-message-20"
      class="brad-message brad-message--bot"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </div>

    <div
      id="brad-message-24"
      class="brad-message brad-message--bot"
      aria-live="polite"
    >
      <div class="message-content">
        <div class="brad-message__bubble">
          <p class="message-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

        <div class="brad-message__hint" aria-live="polite">
          <p>16:50</p>
        </div>
      </div>
    </div>
  </div>
</div>
```
Com botões de ação
```
<div class="brad-chat-container brad-chat-container-2">
  <div
    id="brad-message-19"
    class="brad-message brad-message--inbound"
  >
    <div class="message-content">
      <div class="brad-message__bubble" aria-live="polite">
        <p class="message-text">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Morbi
          turpis nisl, euismod vitae malesuada at, consectetur id justo.
        </p>
      </div>

      <div class="message-actions-buttons">
        <button class="brad-btn brad-btn-tertiary">Button</button>
        <button class="brad-btn brad-btn-tertiary">Button</button>
      </div>

      <div class="brad-message__hint" aria-live="polite">
        <p>16:50 Nome do consultor</p>
      </div>
    </div>
  </div>

  <div
    id="brad-message-21"
    class="brad-message brad-message--bot"
  >
    <div class="message-content">
      <div class="brad-message__bubble" aria-live="polite">
        <p class="message-text">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Morbi
          turpis nisl, euismod vitae malesuada at, consectetur id justo.
        </p>
      </div>

      <div class="message-actions-buttons">
        <button class="brad-btn brad-btn-tertiary">Button</button>
        <button class="brad-btn brad-btn-tertiary">Button</button>
      </div>

      <div class="brad-message__hint" aria-live="polite">
        <p>16:50 Nome do consultor</p>
      </div>
    </div>
  </div>
</div>
```
Com arquivo
```
<div class="brad-chat-container brad-chat-container-3">
  <div
    id="brad-message-24"
    class="brad-message brad-message--file-no_preview brad-message--inbound"
  >
    <div class="message-content">
      <div class="brad-message__bubble" aria-live="polite">
        <div role="button" class="file-container">
          <div class="file-details">
            <em
              class="i message-icon icon-filetype-image brad-icon-size-sm"
            ></em>
            <p class="file-text">Archive without preview</p>
          </div>
        </div>
      </div>

      <div class="brad-message__hint" aria-live="polite">
        <p>16:50 Nome do consultor</p>
      </div>
    </div>
  </div>

  <div
    id="brad-message-25"
    class="brad-message brad-message--file-no_preview brad-message--bot"
  >
    <div class="message-content">
      <div class="brad-message__bubble" aria-live="polite">
        <div role="button" class="file-container">
          <div class="file-details">
            <em
              class="i message-icon icon-filetype-image brad-icon-size-sm"
            ></em>
            <p class="file-text">Archive without preview</p>
          </div>
        </div>
      </div>

      <div class="brad-message__hint" aria-live="polite">
        <p>16:50</p>
      </div>
    </div>
  </div>

  <div
    id="brad-message-8"
    class="brad-message brad-message--file-no_preview brad-message--outbound"
  >
    <div class="message-content">
      <div class="brad-message__bubble" aria-live="polite">
        <div role="button" class="file-container">
          <div class="file-details">
            <em
              class="i message-icon icon-filetype-image brad-icon-size-sm"
            ></em>
            <p class="file-text">Archive without preview</p>
          </div>
        </div>
      </div>

      <div class="brad-message__hint" aria-live="polite">
        <p>
          16:50
          <em
            role="img"
            aria-label="Mensagem enviada"
            class="i icon-component-received brad-text-color-cta brad-icon-size-xxs"
          ></em>
        </p>
      </div>
    </div>
  </div>
</div>
```
Com arquivo e preview
```
<div class="brad-chat-container brad-chat-container-4">
  <div
    id="brad-message-78"
    class="brad-message brad-message--file-preview brad-message--inbound"
  >
    <div class="message-content">
      <div class="brad-message__bubble" aria-live="polite">
        <div class="file-container">
          <div
            role="button"
            aria-label="Visualizar imagem"
            data-preview="brad-message-78"
            class="file-preview"
          >
            <img
              src="https://assets.bradesco/content/dam/portal-bradesco/como-usar/assets/img/banner-conheca-bia.png"
              alt=""
            />
          </div>

          <div class="file-details">
            <em
              class="i message-icon icon-filetype-pdf-1 brad-icon-size-sm"
            ></em>
            <p class="file-text">Arquivo de imagem</p>
          </div>
        </div>
      </div>

      <div class="brad-message__hint">
        <p>16:50 Nome do consultor</p>
      </div>
    </div>
  </div>

  <div
    id="brad-message-71"
    class="brad-message brad-message--file-preview brad-message--bot"
  >
    <div class="message-content">
      <div class="brad-message__bubble" aria-live="polite">
        <div class="file-container">
          <div
            role="button"
            aria-label="Visualizar imagem"
            data-preview="brad-message-71"
            class="file-preview"
          >
            <img
              src="https://assets.bradesco/content/dam/portal-bradesco/como-usar/assets/img/banner-conheca-bia.png"
              alt=""
            />
          </div>

          <div class="file-details">
            <em
              class="i message-icon icon-filetype-pdf-1 brad-icon-size-sm"
            ></em>
            <p class="file-text">Arquivo de imagem</p>
          </div>
        </div>
      </div>

      <div class="brad-message__hint">
        <p>16:50 Nome do consultor</p>
      </div>
    </div>
  </div>

  <div
    id="brad-message-300"
    class="brad-message brad-message--file-preview brad-message--outbound"
  >
    <div class="message-content">
      <div class="brad-message__bubble" aria-live="polite">
        <div class="file-container">
          <div
            role="button"
            aria-label="Visualizar imagem"
            data-preview="brad-message-300"
            class="file-preview"
          >
            <img
              src="https://assets.bradesco/content/dam/portal-bradesco/como-usar/assets/img/banner-conheca-bia.png"
              alt=""
            />
          </div>

          <div class="file-details">
            <em
              class="i message-icon icon-filetype-pdf-1 brad-icon-size-sm"
            ></em>
            <p class="file-text">Arquivo de imagem</p>
          </div>
        </div>
      </div>

      <div class="brad-message__hint">
        <p>
          16:50
          <em
            role="img"
            aria-label="Mensagem enviada"
            class="i icon-component-received brad-text-color-cta brad-icon-size-xxs"
          ></em>
        </p>
      </div>
    </div>
  </div>
</div>
```