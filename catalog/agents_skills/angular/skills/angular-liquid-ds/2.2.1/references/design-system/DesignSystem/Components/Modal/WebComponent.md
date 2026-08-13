# Modal — default e dialog

É um componente que, quando acionado, sobrepõe o conteúdo da página exigindo interação imediata.
Apresenta ainda a variação de diálogo, que diferente do modal padrão, o dialog possui uma estrutura com seções para cabeçalho, parágrafo descritivo, conteúdo principal e rodapé.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do Web Component

O componente principal é o <brad-slider>, que encapsula a label.

## Estrutura obrigatória para os dois tipos do componente

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-modal | Componente | Sim | Sim | Container principal do modal. Gerencia abertura, fechamento e acessibilidade |
| brad-modal-content | Componente | Não | Sim | Área de conteúdo principal do modal |

# Default

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-modal-close | Componente | Não | Sim | Botão de fechamento. Cria automaticamente um ícone se não houver conteúdo |

# Dialog

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-modal-dialog-top | Componente | Não | Sim | Seção superior do modal-dialog (contém header e paragraph) |
| brad-modal-dialog-header | Componente | Não | Sim | Cabeçalho do modal-dialog (título principal) |
| brad-modal-dialog-paragraph | Componente | Não | Sim | Parágrafo descritivo do modal-dialog (subtítulo ou descrição) |
| brad-modal-dialog-footer | Componente | Não | Sim | Rodapé do modal-dialog (área para botões de ação) |

# Propriedades
## brad-modal (comum para os dois tipos de modal)

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-type | "default", "dialog" | modal | Define o tipo do modal. Valores: modal ou modal-dialog |

## brad-modal (específico para modal-dialog)

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-dialog-position | string | center | Posição do modal-dialog. Valores: center, top-left, top-right, bottom-left, bottom-right |
| brad-dialog-max-width | string | md | Largura máxima do modal-dialog. Valores: sm, md, lg, xl |

# brad-modal-dialog-footer

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-buttons-preset | boolean | false | Aplica layout flexbox automático para botões (justify-end) |

# Uso do HTML
Default
```
<brad-modal
  brad-type="default"
  aria-label="Modal"
  >
  <brad-modal-close></brad-modal-close>

  <brad-modal-content>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget
      aliquet massa. Fusce vestibulum feugiat massa ac ornare. Mauris ut neque
      congue, rutrum purus in, mattis ligula. Ut leo sapien, pulvinar et sodales
      non, rutrum nec ipsum.
    </p>
  </brad-modal-content>

</brad-modal>
```
Dialog
```
<brad-modal
  brad-type="modal-dialog"
  brad-dialog-position="center"
  brad-dialog-max-width="md"
  aria-label="Modal">
  <brad-modal-dialog-top>
    <brad-modal-dialog-header>
      <h2>Title</h2>
    </brad-modal-dialog-header>

    <brad-modal-dialog-paragraph>
      <p>Paragraph</p>
    </brad-modal-dialog-paragraph>
  </brad-modal-dialog-top>

  <brad-modal-content class="brad-p-lg">
    <p>
      Content
    </p>
  </brad-modal-content>

  <brad-modal-dialog-footer brad-buttons-preset>
    <button class="brad-btn brad-btn-text brad-btn--auto brad-m-md-r">Secondary</button>
    <button class="brad-btn brad-btn-primary brad-btn--auto">Action</button>
  </brad-modal-dialog-footer>

</brad-modal>
```
Comportamento Javascript
## Inicialização

A inicialização é automática ao inserir o componente no DOM. Não é necessário chamar funções JS manualmente.

# Métodos

| Método | Elemento | Parâmetro | Descrição |
| --- | --- | --- | --- |
| open() | brad-modal | - | Abre o modal |
| close() | brad-modal | - | Fecha o modal |
| toggle() | brad-modal | - | Alterna entre abrir e fechar o modal |
| isOpen() | brad-modal | - | Retorna true se o modal estiver aberto |

# Exemplo de uso
```
const component = document.querySelector('brad-modal');
component.open();
component.close();
component.toggle();
```
## Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| open | brad-modal | Disparado quando o modal é aberto |
| close | brad-modal | Disparado quando o modal é fechado |


Como escutar eventos: Todos os eventos devem ser escutados usando addEventListener no component. A estrutura de uso é sempre a mesma, mudando apenas o nome do evento e a propriedade acessada em event.detail.

## Exemplo genérico de como escutar o evento:
```
const component = document.querySelector("brad-modal");
component.addEventListener("nome-do-evento", (event) => {
const data = event.detail;
console.log("Evento recebido:", data);
});
```

Substitua "nome-do-evento" pelo nome do evento conforme a tabela acima.

# Acessibilidade

Para evitar que o leitor de tela leia os conteúdos que estão atrás do modal, basta adicionar o atributo brad-aria-hidden-placer nos elementos que não devem ser lidos. No exemplo desta documentação esta colocado no botão de abrir o modal.

Importante: como o aria-hidden ele propagado do pai para os filhos, é importante deixar o bottom-sheet fora de qualquer pai que terá aria-hidden. Para mais detalhes sobre brad-aria-hidden-placer.

Para uso da acessibilidade adicione a aria-label em brad-modal;

O uso do atributo aria-label na acessibilidade é importante para fornecer uma descrição ou propósito do modal para usuários que dependem de tecnologias assistivas. Quando você fornece um aria-label, está garantindo que os usuários possam entender completamente o que está dentro do modal, mesmo que não possam ver seu conteúdo, isso ajuda os usuários a entenderem imediatamente por que o modal foi aberto e o que eles podem esperar encontrar dentro dele.

Caso necessite bloquear a leitura dos itens atrás do modal (quando estiver aberto). Será necessário desenvolver uma lógica para o bloqueio da leitura, um atributo de acessibilidade bom para fazer isso é o aria-hidden="true", que é recomendado adicionar no conteúdo de trás do modal ao abrir o modal, e remover esse atributo ao fechar o modal.

Se necessário retornar o foco para algum elemento em específico após fechar o modal, utilizar o event listener de "close" e dentro de seu retorno utilizar o elemento para focar através de focus().

A variável previouslyFocusedElement do componente modal se refere ao último elemento clicado, também servindo de opção para o focus, como no exemplo a seguir:

```
const component = document.querySelector('brad-modal');

component.addEventListener("close", () => {
  modal.service.previouslyFocusedElement.focus();
});
```
Exemplos
Default
```
<button
  id=btn-open-96
  class="brad-btn brad-btn-primary"
  brad-aria-hidden-placer=""
  title="Botão abertura de modal"
>
  INTERAJA (CLIQUE) PARA REVELAR COMPONENTE 👆🏽
</button>

<brad-modal
  id="modal-92"
  brad-type="default"
  brad-dialog-position="center"
  brad-dialog-max-width="md"
  aria-label="Modal"
>
  <brad-modal-close></brad-modal-close>

  

  <brad-modal-content class="brad-p-lg"><p>
  Content-Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
  eget aliquet massa. Fusce vestibulum feugiat massa ac ornare. Mauris ut
  neque congue, rutrum purus in, mattis ligula. Ut leo sapien, pulvinar et
  sodales non, rutrum nec ipsum.
</p></brad-modal-content>

  
</brad-modal>
```
Dialog
```
<button
  id=btn-open-397
  class="brad-btn brad-btn-primary"
  brad-aria-hidden-placer=""
  title="Botão abertura de modal"
>
  INTERAJA (CLIQUE) PARA REVELAR COMPONENTE 👆🏽
</button>

<brad-modal
  id="modal-269"
  brad-type="dialog"
  brad-dialog-position="center"
  brad-dialog-max-width="md"
  aria-label="Modal"
>
  <brad-modal-close></brad-modal-close>

  
        <brad-modal-dialog-top>
          <brad-modal-dialog-header>
            <h2>Title-Lorem ipsum dolor sit</h2>
          </brad-modal-dialog-header>

          <brad-modal-dialog-paragraph>
            <p>Paragraph-Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget
    aliquet massa. Fusce vestibulum feugiat massa ac ornare.</p>
          </brad-modal-dialog-paragraph>
        </brad-modal-dialog-top>
      

  <brad-modal-content class="brad-p-lg"><p>
  Content-Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
  eget aliquet massa. Fusce vestibulum feugiat massa ac ornare. Mauris ut
  neque congue, rutrum purus in, mattis ligula. Ut leo sapien, pulvinar et
  sodales non, rutrum nec ipsum.
</p></brad-modal-content>

  
        <brad-modal-dialog-footer brad-buttons-preset>
          <button class="brad-btn brad-btn-text brad-btn--auto brad-m-md-r">
            Secondary [Close]
          </button>

          <button class="brad-btn brad-btn-primary brad-btn--auto">
            Primary [Action]
          </button>
        </brad-modal-dialog-footer>
      
</brad-modal>
```