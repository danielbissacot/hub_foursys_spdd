# Dialog

O Dialog é uma variação do componente Modal que apresenta conteúdo em formato de diálogo estruturado. Diferente do modal padrão, o Modal Dialog possui uma estrutura pré-definida com seções específicas para cabeçalho, parágrafo descritivo, conteúdo principal e rodapé.

# Uso do HTML
```
<button
class="brad-btn brad-btn-primary"
onclick="open()"
brad-aria-hidden-placer
>
INTERAJA (CLIQUE) PARA REVELAR COMPONENTE 👆🏽
</button>

<div
id="dialog"
class="brad-modal brad-modal--dialog brad-modal--dialog__md brad-modal--dialog--center"
role="dialog"
aria-modal="true"
tabindex="-1"
>
<div class="brad-modal--dialog__top">
  <div class="brad-modal--dialog__header">
    <h2>Title-Lorem ipsum dolor sit</h2>
  </div>

  <div class="brad-modal--dialog__paragraph">
    <p>
      Paragraph-Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Nullam eget aliquet massa. Fusce vestibulum feugiat massa ac ornare.
    </p>
  </div>

</div>

<div class="brad-modal--dialog__content brad-p-lg">
<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget aliquet
  massa. Fusce vestibulum feugiat massa ac ornare. Mauris ut neque congue,
  rutrum purus in, mattis ligula. Ut leo sapien, pulvinar et sodales non,
  rutrum nec ipsum. Vestibulum ullamcorper orci sit amet nisl ultricies
  ullamcorper sed id purus. Proin id mauris bibendum, vestibulum mi sed,
  scelerisque leo. Nam faucibus finibus tortor sed cursus.
</p>
</div>

<div
  class="brad-modal--dialog__footer brad-flex brad-flex-row brad-flex-justify-content-end brad-flex-align-items-center"
>
  <button
    class="brad-btn brad-btn-text brad-btn--auto brad-m-md-r"
    onclick="close()"
  >
    Secondary
  </button>
  <button
    class="brad-btn brad-btn-primary brad-btn--auto"
    onclick="close()"
  >
    Action
  </button>
</div>
</div>
```
Comportamento Javascript
Inicialização
1. Definindo o targetSelector e options
```
const targetSelector = "#dialog";
const options = { targetSelector };
```
2. Obtendo a instância do serviço
```
const service = LiquidCorp.BradModalService.getInstance(options);
```
3. Funções para abrir e fechar o modal
3.1 Função para abrir o modal
```
function open() {
service.open();
}
```
3.2 Função para fechar o modal
```
function close() {
service.close();
}
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo [{targetSelector: "#idModal1"}, {targetSelector: "#idModal2"}, {targetSelector: "#idModal3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID ou .classe vinculado ao HTML do componente |
| clickOutsideClose | boolean | true | Define se o modal deve fechar ao clicar fora dele |


O campo clickOutsideClose é utilizado pelo componente Overlay, responsável por detectar cliques fora do modal e determinar se ele deve ser fechado nessas situações.

# Métodos

| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| open | N/A | Abre |
| close | N/A | Fecha |
| toggle | N/A | Alterna entre abrir e fechar |
| destroy | N/A | Faz o encerramento de todos os listeners que existem vinculados ao componente instanciado |

# Acessibilidade

Para evitar que o leitor de tela leia os conteúdos que estão atrás do modal, basta adicionar o atributo brad-aria-hidden-placer nos elementos que não devem ser lidos. No exemplo desta documentação esta colocado no botão de abrir o modal.

Importante: como o aria-hidden ele propagado do pai para os filhos, é importante deixar o bottom-sheet fora de qualquer pai que terá aria-hidden. Para mais detalhes sobre brad-aria-hidden-placer.

Para uso da acessibilidade adicione a role="dialog" em div.brad-modal;

O uso do atributo role="dialog" em acessibilidade é importante para indicar que o elemento é um modal permitindo que os leitores de tela e outros assistentes comuniquem a informação aos usuários, você está contribuindo para uma experiência de usuário mais consistente e previsível. Isso garante que entendam como navegar nele de maneira eficiente. Em resumo, o uso de role="dialog" ajuda a tornar o modal mais acessível e fácil de usar para todos os usuários.

Para uso da acessibilidade adicione a aria-label em div.brad-modal;

O uso do atributo aria-label na acessibilidade é importante para fornecer uma descrição ou propósito do modal para usuários que dependem de tecnologias assistivas. Quando você fornece um aria-label, está garantindo que os usuários possam entender completamente o que está dentro do modal, mesmo que não possam ver seu conteúdo, isso ajuda os usuários a entenderem imediatamente por que o modal foi aberto e o que eles podem esperar encontrar dentro dele.

Caso necessite bloquear a leitura dos itens atrás do modal (quando estiver aberto). Será necessário desenvolver uma lógica para o bloqueio da leitura, um atributo de acessibilidade bom para fazer isso é o aria-hidden="true", que é recomendado adicionar no conteúdo de trás do modal ao abrir o modal, e remover esse atributo ao fechar o modal.

Se necessário retornar o foco para algum elemento em específico após fechar o modal, utilizar o event listener de "close" e dentro de seu retorno utilizar o elemento para focar através de focus().

A variável previouslyFocusedElement do componente modal se refere ao último elemento clicado, também servindo de opção para o focus, como no exemplo a seguir:

```
const targetSelector = "#dialog";
const options = { targetSelector };
const service = LiquidCorp.BradModalService.getInstance(options);
const modalElement = service.eModal;

modalElement.addEventListener("close", () => {
service.previouslyFocusedElement.focus();
});
```
Exemplo
Modal dialog
```
<button
  role="button"
  title="Botão abertura de modal"
  class="brad-btn brad-btn-primary"
  onclick="LiquidCorp.BradModalService.open()"
  brad-aria-hidden-placer
>
  INTERAJA (CLIQUE) PARA REVELAR COMPONENTE 👆🏽
</button>

<div
  aria-label="Modal teste para acessibilidade"
  id="modal-150"
  class="brad-modal brad-modal--dialog brad-modal--dialog__md brad-modal--dialog--center"
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
  <div class="brad-modal--dialog__top">
    <div class="brad-modal--dialog__header">
      <h2>Title-Lorem ipsum dolor sit</h2>
    </div>

    <div class="brad-modal--dialog__paragraph">
      <p>Paragraph-Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget
    aliquet massa. Fusce vestibulum feugiat massa ac ornare.</p>
    </div>
  </div>

  <div class="brad-modal--dialog__content brad-p-lg">
    <p><p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget
  aliquet massa. Fusce vestibulum feugiat massa ac ornare. Mauris ut neque
  congue, rutrum purus in, mattis ligula. Ut leo sapien, pulvinar et sodales
  non, rutrum nec ipsum.
</p></p>
  </div>

  <div
    class="brad-modal--dialog__footer brad-flex brad-flex-row brad-flex-justify-content-end brad-flex-align-items-center"
  >
    <button
      title="Botão um de fechamento do modal"
      role="button"
      class="brad-btn brad-btn-text brad-btn--auto brad-m-md-r"
      onclick="LiquidCorp.BradModalService.close()"
    >
      Secondary
    </button>

    <button
      title="Botão dois de fechamento do modal"
      role="button"
      class="brad-btn brad-btn-primary brad-btn--auto"
      onclick="LiquidCorp.BradModalService.close()"
    >
      Action
    </button>
  </div>
</div>
```