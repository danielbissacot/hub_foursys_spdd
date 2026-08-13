# Chat Message

Componente que representa o balão de texto do Consultor/Assistente/BIA e do cliente

# Uso do Web Component

O Chat Message web component possui vários componentes utilitários que o criam.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-chat-message-container | Componente | Sim | Não | Agrupa as mensagens. |
| brad-chat-message | Componente | Sim | Não | Cria o conteúdo principal da mensagem. |
| brad-chat-message-bubble | Sub-componente | Sim | Sim | Cria o balão da mensagem. |
| brad-chat-message-hint | Sub-componente | Não | Sim | Cria o texto complementar. |
| brad-chat-message-action | Sub-componente | Não | Não | Cria a mensagem do tipo action buttons. |
| brad-chat-message-file | Sub-componente | Não | Sim | Cria a mensagem do tipo file. |
| brad-chat-message-file-preview | Sub-componente | Não | Sim | Cria a mensagem do tipo file and preview |
| brad-chat-message-file-preview-image | Sub-componente | Não | Sim | Cria a área da imagem da mensagem do tipo file and preview |
| brad-chat-message-file-preview-info | Sub-componente | Não | Sim | Cria a área de texto informativo da mensagem do tipo file and preview |

# Propriedades
## brad-chat-message-container

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-num-lines | number | 6 | Número de linhas para o texto ser minimizado de maneira automática ao inserir a mensagem |

# brad-chat-message

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-type | 'outbound', 'inbound', 'bot | "inbound" | Escolha do tipo de mensagem |

# Uso do HTML
Default Message
```
<brad-chat-message-container>
  <brad-chat-message>
        <brad-chat-message-bubble>
          <p class="message-text">Exemplo</p>
        </brad-chat-message-bubble>
  </brad-chat-message>
</brad-chat-message-container>
```
Action Buttons Message
```
<brad-chat-message-container>
    <brad-chat-message>
      <brad-chat-message-bubble>
        <p class="message-text">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Morbi
          turpis nisl, euismod vitae malesuada at, consectetur id justo.
        </p>
      </brad-chat-message-bubble>

      <brad-chat-message-action>
        <button class="brad-btn brad-btn-tertiary">Button</button>
        <button class="brad-btn brad-btn-tertiary">Button</button>
      </brad-chat-message-action>

      <brad-chat-message-hint>
        <p>16:50 Nome do consultor</p>
      </brad-chat-message-hint>
    </brad-chat-message>

</brad-chat-message-container>
```
File Message
```
<brad-chat-message-container>
    <brad-chat-message>
      <brad-chat-message-bubble>
        <brad-chat-message-file>
          <em
            class="i message-icon icon-filetype-image brad-icon-size-sm"
          ></em>

          <p class="file-text">Archive without preview</p>
        </brad-chat-message-file>
      </brad-chat-message-bubble>

      <brad-chat-message-hint>
        <p>16:52</p>
      </brad-chat-message-hint>
    </brad-chat-message>

</brad-chat-message-container>
```
File Preview Message
```
<brad-chat-message-container>
  <brad-chat-message>
      <brad-chat-message-bubble>
        <brad-chat-message-file-preview>
          <brad-chat-message-file-preview-image>
            <img
              src="https://banco.bradesco/assets/classic/img/home/destaque-3-ativo.webp"
              alt=""
            />
          </brad-chat-message-file-preview-image>

          <brad-chat-message-file-preview-info>
            <em
              class="i message-icon icon-filetype-image brad-icon-size-sm"
            ></em>

            <p class="file-text">Archive with preview</p>
          </brad-chat-message-file-preview-info>
        </brad-chat-message-file-preview>
      </brad-chat-message-bubble>

      <brad-chat-message-hint>
        <p>16:52</p>
      </brad-chat-message-hint>
    </brad-chat-message>

</brad-chat-message-container>
```
## Comportamento Javascript

Para utilizar a instância do componente, utilize o método document.querySelector('brad-chat-message') no elemento desejado, a partir do elemento de mensagem, acessando seu service, você acessará o mesmo serviço de todos os elementos do container em que ele está, portanto é necessário apenas um elemento e uma instância para acessar o serviço do container que ele se apresenta. Abaixo segue uma lista de exemplos de uso de scripts com o componente:



## Inserir e remover elementos message por scripts
```
const container = document.querySelector('brad-chat-message-container');
  const defaultContainer = 'brad-container';
  chatContainer = document.querySelector('brad-chat-message-container#brad-container');

function insertMessage() {

    const message = document.createElement("brad-chat-message");

     message.innerHTML = `
        <brad-chat-message-bubble>
          <p class="message-text">
            Exemplo
          </p>
        </brad-chat-message-bubble>`;

  chatContainer.appendChild(message);
  message.minimizeText();

}

function removeMessage(id) {
const MessageService = chatContainer.querySelectorAll("brad-chat-message")[0];
MessageService.removeMessage(id);
}
```
Troca de status de mensagem
```
bradMessageService = document.querySelector('brad-chat-message').service;
bradMessageService.addMessageErrorStatus(idElemento, "16:50");
```
Troca de status de mensagem para erro com evento de click resend

O status erro, exibe um ícone (refresh) que ao ser clicado, chama uma função única e específica para cada resend através do addMessageErrorStatus.

```
bradMessageService = document.querySelector('brad-chat-message').service;
bradMessageService.addMessageErrorStatus(
    idElemento,
    "16:59",
    resendHandler
);
let resendHandler = (e) => {
  bradMessageService.addMessageSendingStatus(
    e.messageId,
    "Enviando mensagem"
  );

  setTimeout(() => {
    bradMessageService.addMessageSendedStatus(e.messageId, "16:59");
  }, 2000);

};
```
Exibição de preview de imagem
```
bradMessageService = document.querySelector('brad-chat-message').service;
bradMessageService.showHiddenPreviewImage(preview.id);
```
## Metódos brad-chat-message

Para usa-los é necessário acessar o elemento brad-chat-message.


| Nome | Parâmetros | Descrição |
| --- | --- | --- |
| minimizeText |  | Lida se é necessário ou não minimizar o texto de um elemento, necessário ao adicionar um novo chat-message via script (chatMessage.minimizeText()) |
| removeMessage | id | Remove uma mensagem pelo id informado |

## Metódos brad-chat-message service

Para usa-los é necessário acessar o elemento brad-chat-message e acessar o service dentro dele chatMessage.service.


| Nome | Parâmetros | Descrição |
| --- | --- | --- |
| addMessageErrorStatus | id: string, hintText: string, resendHandler: function (opcional) | Adiciona o status erro na mensagem |
| removeMessageErrorStatus | id: string | Por meio do id informado no parâmetro, remove o status de erro do balão da mensagem |
| addMessageSendingStatus | id: string, hintText: string | Adiciona o status enviando na mensagem |
| addMessageSendedStatus | id: string, hintText: string | Adiciona o status enviado na mensagem |
| showHiddenPreviewImage | id: string | Mostra a imagem oculta no modo file-preview |

# Acessibilidade

As tags padrões são inseridas automaticamente pelo script do web component, assim o funcionamento da acessibilidade é garantido.
O comportamento da acessibilidade segue o mesmo do componente HTML, para ver a documentação completa clique aqui.

# Exemplos

Obs: Use o botão show code abaixo do exemplo para ver o HTML.

# Default Messages
```
<button class="brad-btn brad-btn-primary" id="add-message">
  Adicionar mensagem
</button>

<br />

<button class="brad-btn brad-btn-primary" id="remove-message">
  Remover mensagem 4
</button>

<brad-chat-message-container brad-num-lines="6" id="brad-container-201">
  <brad-chat-message id="m1">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>
  </brad-chat-message>

  <brad-chat-message id="m2" brad-type="outbound">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:50</p>
    </brad-chat-message-hint>
  </brad-chat-message>

  <brad-chat-message id="m3">
    <brad-chat-message-bubble>
      <p class="message-text">
        Morbi aliquam, mi et rhoncus viverra, elit nisi luctus magna, eu
        volutpat dolor sapien id sapien. Vestibulum odio ligula, aliquet at
        luctus nec, volutpat vitae nibh. Pellentesque id ligula sem. Quisque
        facilisis eget metus at consequat. Morbi sollicitudin nisl efficitur
        ante hendrerit sollicitudin. Morbi placerat dignissim lobortis.
        Etiam dignissim est ante, in dignissim orci malesuada ac. Sed at
        orci eu magna imperdiet interdum vitae sit amet tellus. Aliquam
        vitae nisl lacus. Class aptent taciti sociosqu ad litora torquent
        per conubia nostra, per inceptos himenaeos. Suspendisse potenti.
        Duis justo lacus, varius at consectetur nec, vulputate eu nunc.
        Aenean ac tempus nisl. Curabitur lacinia felis ac iaculis pretium.
        Donec et ullamcorper dolor. Nunc eu nulla et est efficitur dapibus
        eu at tortor. Morbi nec ex vitae diam pellentesque auctor. Morbi
        accumsan sodales nisl ac pulvinar. Nullam massa risus, tincidunt ac
        luctus at, sollicitudin non tellus. Suspendisse consectetur semper
        sem vitae faucibus. Ut consequat nisi quam, eget blandit mi aliquam
        quis. Donec mollis semper sodales. Quisque nec arcu nec elit
        facilisis dictum vel non lectus. Duis vehicula viverra ex ut
        sagittis.
      </p>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:50 Nome do consultor</p>
    </brad-chat-message-hint>
  </brad-chat-message>

  <brad-chat-message id="m32">
    <brad-chat-message-bubble>
      <p class="message-text">
        Morbi aliquam, mi et rhoncus viverra, elit nisi luctus magna, eu
        volutpat dolor sapien id sapien. Vestibulum odio ligula, aliquet at
        luctus nec, volutpat vitae nibh. Pellentesque id ligula sem. Quisque
        facilisis eget metus at consequat. Morbi sollicitudin nisl efficitur
        ante hendrerit sollicitudin. Morbi placerat dignissim lobortis.
        Etiam dignissim est ante, in dignissim orci malesuada ac. Sed at
        orci eu magna imperdiet interdum vitae sit amet tellus. Aliquam
        vitae nisl lacus. Class aptent taciti sociosqu ad litora torquent
        per conubia nostra, per inceptos himenaeos. Suspendisse potenti.
        Duis justo lacus, varius at consectetur nec, vulputate eu nunc.
        Aenean ac tempus nisl. Curabitur lacinia felis ac iaculis pretium.
        Donec et ullamcorper dolor. Nunc eu nulla et est efficitur dapibus
        eu at tortor. Morbi nec ex vitae diam pellentesque auctor. Morbi
        accumsan sodales nisl ac pulvinar. Nullam massa risus, tincidunt ac
        luctus at, sollicitudin non tellus. Suspendisse consectetur semper
        sem vitae faucibus. Ut consequat nisi quam, eget blandit mi aliquam
        quis. Donec mollis semper sodales. Quisque nec arcu nec elit
        facilisis dictum vel non lectus. Duis vehicula viverra ex ut
        sagittis.
      </p>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:50 Nome do consultor</p>
    </brad-chat-message-hint>
  </brad-chat-message>

  <brad-chat-message id="m7" brad-type="bot">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>
  </brad-chat-message>
</brad-chat-message-container>
```
Status Messages
```
<brad-chat-message-container>
  <brad-chat-message id="brad-message-77" brad-type="outbound">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:50</p>
    </brad-chat-message-hint>
  </brad-chat-message>

  <brad-chat-message id="brad-message-321">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:50</p>
    </brad-chat-message-hint>
  </brad-chat-message>
</brad-chat-message-container>
```
## Multiple Messages

De maneira automática o componente já vai identificar se contém múltiplos de seu tipo ou não.

```
<brad-chat-message-container>
  <brad-chat-message id="m11">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>
  </brad-chat-message>

  <brad-chat-message id="m12">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>
  </brad-chat-message>

  <brad-chat-message id="m22">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>
  </brad-chat-message>

  <brad-chat-message id="m3">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:50</p>
    </brad-chat-message-hint>
  </brad-chat-message>

  <brad-chat-message id="m41" brad-type="outbound">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>
  </brad-chat-message>

  <brad-chat-message id="m5" brad-type="outbound">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>
  </brad-chat-message>

  <brad-chat-message id="m6" brad-type="outbound">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:50</p>
    </brad-chat-message-hint>
  </brad-chat-message>

  <brad-chat-message id="m71" brad-type="bot">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>
  </brad-chat-message>

  <brad-chat-message id="m8" brad-type="bot">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>
  </brad-chat-message>

  <brad-chat-message id="m9" brad-type="bot">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:50</p>
    </brad-chat-message-hint>
  </brad-chat-message>

  <brad-chat-message id="m7" brad-type="inbound">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:50</p>
    </brad-chat-message-hint>
  </brad-chat-message>

  <brad-chat-message id="m9" brad-type="outbound">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:50</p>
    </brad-chat-message-hint>
  </brad-chat-message>

  <brad-chat-message id="m8" brad-type="bot">
    <brad-chat-message-bubble>
      <p class="message-text">Exemplo</p>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:50</p>
    </brad-chat-message-hint>
  </brad-chat-message>
</brad-chat-message-container>
```
Action Button Messages
```
<button class="brad-btn brad-btn-primary" id="add-action-message">
  Adicionar mensagem
</button>

<brad-chat-message-container id="brad-container-185">
  <brad-chat-message id="m_0">
    <brad-chat-message-bubble>
      <p class="message-text">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Morbi
        turpis nisl, euismod vitae malesuada at, consectetur id justo.
      </p>
    </brad-chat-message-bubble>

    <brad-chat-message-action>
      <button class="brad-btn brad-btn-tertiary">Button</button>
      <button class="brad-btn brad-btn-tertiary">Button</button>
    </brad-chat-message-action>

    <brad-chat-message-hint>
      <p>16:50 Nome do consultor</p>
    </brad-chat-message-hint>
  </brad-chat-message>

  <brad-chat-message id="m_2" brad-type="bot">
    <brad-chat-message-bubble>
      <p class="message-text">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Morbi
        turpis nisl, euismod vitae malesuada at, consectetur id justo.
      </p>
    </brad-chat-message-bubble>

    <brad-chat-message-action>
      <button class="brad-btn brad-btn-tertiary">Button</button>
      <button class="brad-btn brad-btn-tertiary">Button</button>
    </brad-chat-message-action>

    <brad-chat-message-hint>
      <p>16:52 Nome do consultor</p>
    </brad-chat-message-hint>
  </brad-chat-message>
</brad-chat-message-container>
```
File Messages
```
<button class="brad-btn brad-btn-primary" id="add-file-message">
  Adicionar mensagem
</button>

<brad-chat-message-container id="brad-container-369">
  <brad-chat-message id="m_file">
    <brad-chat-message-bubble>
      <brad-chat-message-file>
        <em
          class="i message-icon icon-filetype-image brad-icon-size-sm"
        ></em>

        <p class="file-text">Archive without preview</p>
      </brad-chat-message-file>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:52</p>
    </brad-chat-message-hint>
  </brad-chat-message>

  <brad-chat-message id="m_file_2" brad-type="bot">
    <brad-chat-message-bubble>
      <brad-chat-message-file>
        <em
          class="i message-icon icon-filetype-image brad-icon-size-sm"
        ></em>

        <p class="file-text">Archive without preview</p>
      </brad-chat-message-file>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:52</p>
    </brad-chat-message-hint>
  </brad-chat-message>

  <brad-chat-message id="m_file_3" brad-type="outbound">
    <brad-chat-message-bubble>
      <brad-chat-message-file>
        <em
          class="i message-icon icon-filetype-image brad-icon-size-sm"
        ></em>

        <p class="file-text">Archive without preview</p>
      </brad-chat-message-file>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:52</p>
    </brad-chat-message-hint>
  </brad-chat-message>
</brad-chat-message-container>
```
File Messages with Preview
```
<button class="brad-btn brad-btn-primary" id="add-preview">
  Adicionar mensagem
</button>

<brad-chat-message-container id="brad-container-381">
  <brad-chat-message id="brad-m1-1">
    <brad-chat-message-bubble>
      <brad-chat-message-file-preview>
        <brad-chat-message-file-preview-image>
          <img
            src="https://banco.bradesco/assets/classic/img/home/destaque-3-ativo.webp"
            alt=""
          />
        </brad-chat-message-file-preview-image>

        <brad-chat-message-file-preview-info>
          <em
            class="i message-icon icon-filetype-image brad-icon-size-sm"
          ></em>

          <p class="file-text">Archive with preview</p>
        </brad-chat-message-file-preview-info>
      </brad-chat-message-file-preview>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:52</p>
    </brad-chat-message-hint>
  </brad-chat-message>

  <brad-chat-message id="brad-m2-14" brad-type="bot">
    <brad-chat-message-bubble>
      <brad-chat-message-file-preview>
        <brad-chat-message-file-preview-image>
          <img
            src="https://banco.bradesco/assets/classic/img/home/destaque-3-ativo.webp"
            alt=""
          />
        </brad-chat-message-file-preview-image>

        <brad-chat-message-file-preview-info>
          <em
            class="i message-icon icon-filetype-image brad-icon-size-sm"
          ></em>

          <p class="file-text">Archive with preview</p>
        </brad-chat-message-file-preview-info>
      </brad-chat-message-file-preview>
    </brad-chat-message-bubble>

    <brad-chat-message-hint>
      <p>16:52</p>
    </brad-chat-message-hint>
  </brad-chat-message>
</brad-chat-message-container>
```