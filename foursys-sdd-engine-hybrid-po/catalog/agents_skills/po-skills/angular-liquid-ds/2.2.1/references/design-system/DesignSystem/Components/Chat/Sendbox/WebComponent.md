# Chat SendBox

## Componente de envio de mensagens de texto

# Uso do Web Component

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-chat-sendbox | Componente | Sim | Sim | Cria o chat-sendbox |

# Propriedades

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| disabled | boolean | false | Ativa e desativa o campo |
| brad-action-button | boolean | false | Adiciona o botão de ícone auxiliar do campo |
| brad-helper-text | string |  | Determina o texto auxiliar do campo |
| brad-aria-label | string | Campo de texto | Altera o aria-label do campo |
| brad-text | string |  | Altera o valor do texto do campo |

# Uso do HTML
```
<brad-chat-sendbox></brad-chat-sendbox>
```
## Comportamento Javascript

Para usa-los é necessário acessar o elemento brad-chat-sendbox.


| Nome | Parâmetros | Descrição |
| --- | --- | --- |
| setErrorStatus | string (Mensagem de erro) | Altera para status erro. |
| removeErrorStatus | string (Opcional - Mensagem do helper text) | Remove o status de erro, podendo ou não utilizar um helper text após a troca |
| changeButtonStyle | string ('mic', 'pause', 'send'), string (label de acessibilidade) | Altera o ícone do botão da direita |
| changeActionButtonStyle | string ('cancel', 'add'), string (label de acessibilidade) | Altera o ícone do botão da esquerda que acompanha o campo de texto |

# Eventos

| Nome | Descrição |
| --- | --- |
| clickActionButton | Evento que capta o click no botão de ação ao lado do campo de texto |
| clickSendboxIconArea | Evento que capta o click no botão de ícone que fica no início dentro do campo de texto |

## Exemplos do uso de eventos na jornada

Para usá-los é necessário acessar o elemento brad-chat-sendbox.

```
const sendbox = document.querySelector('brad-chat-sendbox');

sendbox.addEventListener('clickActionButton', (event) => {
  console.log('Action button clicked!', event.detail);
});

sendbox.addEventListener('clickSendboxIconArea', (event) => {
  console.log('Icon button clicked!', event.detail);
});
```
Exemplo
SendBox
```
<brad-chat-sendbox
  id="sendbox-267"
  
  
  
  brad-text=""
></brad-chat-sendbox>
```