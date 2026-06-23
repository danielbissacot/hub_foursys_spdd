# BottomSheet - Modal

Superfície fixada na parte inferior da tela que sobrepõe todos os demais elementos da tela e, pode disponibilizar ao usuário ações ou informações complementares ao contexto atual. Versão do componente que bloqueia a interação com o restante da interface enquanto está aberto. Este formato complementa o conteúdo da tela e agrupa informações ou ações de maneira sempre acessível.

# Uso do HTML
```
<button id="button-open-modal" class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active" brad-aria-hidden-placer onclick="openBottomSheet()">
<em><em class="fab-icon i icon-ui-placeholder"></em></em>
</button>

<div id="bs-modal" class="brad-bottom-sheet" role="dialog">
<div class="brad-bottom-sheet__header">
  <h2 id="first-read-element" class="brad-bottom-sheet__title brad-font-title-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
  <button class="brad-bottom-sheet__btn-close i icon-component-close-delete" aria-label="Fechar dialog" role="button" onclick="closeBottomSheet()"></button>
</div>

<div class="brad-bottom-sheet__content brad-scrollbar">
  <p>Conteúdo aqui 😊</p>
</div>
</div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do bottom-sheet

```
const targetSelector = "#bs-modal";
const state = "modal";
const options = { targetSelector, state };

const service = LiquidCorp.BradBottomSheetService.getInstance(options);

function openBottomSheet() {
service.open();
const firstReadElement = document.querySelector(targetSelector + " #first-read-element");
if (firstReadElement) {
  firstReadElement.focus();
}
}

function closeBottomSheet() {
service.close();
const btOpenModal = document.querySelector("#button-open-modal");
if (btOpenModal) {
  btOpenModal.focus();
}
}
```
## getInstances

O método getInstances deve ser usado quando há necessidade de criar mais de uma instância de um componente. Ele retorna um array de instâncias para cada elemento. Basta passar no parâmetro um array de objetos [Object ], por exemplo: [{targetSelector: "#idBottomSheet1"}, {targetSelector: "#idBottomSheet2"}, {targetSelector: "#idBottomSheet3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| state | "fixed", "modal" | "fixed" | Tipo do componente |


Agora é possível controlar o HTML do componente pelo id: (bs-modal)

# Métodos

Para o uso dos métodos, é necessário seguir os processos de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| open | N/A | Abre |
| close | N/A | Fecha |
| toggle | N/A | Alterna entre abrir e fechar |
| destroy | N/A | Encerra todos os listeners vinculados ao componente instanciado |

# EventListeners

Para o uso dos listeners, é necessário seguir os processos de e :


| Elemento | Método | Evento | Descrição |
| --- | --- | --- | --- |
| service.eBottomSheet | addEventListener | "opened" | É disparado sempre que o serviço abre o componente atual |
| service.eBottomSheet | addEventListener | "closed" | É disparado sempre que o serviço fecha o componente atual |

# Observações
## Responsividade

O bottom sheet é um componente para uso em smartphones, mas caso seja necessário, pode também ser utilizado em tablets. Em desktop o bottom sheet deverá ser substituído por outros componentes mais adequados.

# Acessibilidade

O componente bottom sheet já apresenta alguns atributos de acessibilidade no exemplo disponível.

Para evitar que o leitor de tela leia os conteúdos que estão atrás do modal, basta adicionar o atributo brad-aria-hidden-placer nos elementos que não devem ser lidos. No exemplo desta documentação está colocado no botão de abrir o modal.

Importante: como o aria-hidden é propagado do pai para os filhos, é importante deixar o bottom-sheet fora de qualquer pai que terá aria-hidden. Para mais detalhes sobre brad-aria-hidden-placer.

É importante se atentar para a informação que o usuário deve receber, e aos tipos de elementos que serão abertos. A primeira tag do componente possui o atributo role="dialog" que identifica para o leitor de telas que está sendo aberta uma caixa de diálogo.

```
<div id="bs-modal" class="brad-bottom-sheet" role="dialog"></div>
```

O botão de fechar deve ter o atributo aria-label e, caso não utilize a tag <button>, incluir também role="button".

```
<button class="brad-bottom-sheet__btn-close i icon-component-close-delete" aria-label="Fechar dialog" role="button" onclick="closeBottomSheet()"></button>
```

Ao abrir o bottom-sheet, é necessário iniciar o foco no primeiro elemento legível. Ao fechar, o foco deve retornar ao elemento que o abriu.

```
function openBottomSheet() {
service.open();
const firstReadElement = document.querySelector("#bs-modal #first-read-element");
if (firstReadElement) {
  firstReadElement.focus();
}
}

function closeBottomSheet() {
service.close();
const btOpenModal = document.querySelector("#button-open-modal");
if (btOpenModal) {
  btOpenModal.focus();
}
}
```

Se atentem para garantir que todo conteúdo seja apresentado para o leitor de tela. Dúvidas, consulte a equipe de acessibilidade do seu projeto.

# Exemplos
```
<button
  class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
  brad-aria-hidden-placer
  onclick="bottomSheet.open()"
>
  <em><em class="fab-icon i icon-ui-placeholder"></em></em>
</button>

<div id="bs-408" class="brad-bottom-sheet " aria-modal="true" tabindex="-1">
   <div class="brad-bottom-sheet__header">
  <h2 class="brad-bottom-sheet__title brad-font-title-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a orci bibendum, tristique nisl efficitur, accumsan velit.</h2>
  <button
    class="brad-bottom-sheet__btn-close i icon-component-close-delete"
    aria-label="Fechar dialog"
    role="button"
    onclick="bottomSheet.close()"
  ></button>
</div>
  <div class="brad-bottom-sheet__content brad-scrollbar">
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a orci
    bibendum, tristique nisl efficitur, accumsan velit. Ut vel mi accumsan,
    semper quam quis, mollis lectus. Phasellus eu ipsum posuere, varius elit
    a, tincidunt tortor. Aenean eleifend libero nec risus efficitur, id
    semper ex vestibulum. Curabitur ac aliquet leo. Ut non porta lacus, eu
    hendrerit neque. Maecenas ac lacinia enim. Aenean eu vestibulum massa.
    In quam arcu, porta at justo ac, mattis pulvinar ipsum. Lorem ipsum
    dolor sit amet, consectetur adipiscing elit. Nullam a orci bibendum,
    tristique nisl efficitur, accumsan velit. Ut vel mi accumsan, semper
    quam quis, mollis lectus. Phasellus eu ipsum posuere, varius elit a,
    tincidunt tortor. Aenean eleifend libero nec risus efficitur, id semper
    ex vestibulum. Curabitur ac aliquet leo. Ut non porta lacus, eu
    hendrerit neque. Maecenas ac lacinia enim. Aenean eu vestibulum massa.
    In quam arcu, porta at justo ac, mattis pulvinar ipsum. Lorem ipsum
    dolor sit amet, consectetur adipiscing elit. Nullam a orci bibendum,
    tristique nisl efficitur, accumsan velit. Ut vel mi accumsan, semper
    quam quis, mollis lectus. Phasellus eu ipsum posuere, varius elit a,
    tincidunt tortor. Aenean eleifend libero nec risus efficitur, id semper
    ex vestibulum. Curabitur ac aliquet leo. Ut non porta lacus, eu
    hendrerit neque. Maecenas ac lacinia enim. Aenean eu vestibulum massa.
    In quam arcu, porta at justo ac, mattis pulvinar ipsum. Lorem ipsum
    dolor sit amet, consectetur adipiscing elit. Nullam a orci bibendum,
    tristique nisl efficitur, accumsan velit. Ut vel mi accumsan, semper
    quam quis, mollis lectus. Phasellus eu ipsum posuere, varius elit a,
    tincidunt tortor. Aenean eleifend libero nec risus efficitur, id semper
    ex vestibulum. Curabitur ac aliquet leo. Ut non porta lacus, eu
    hendrerit neque. Maecenas ac lacinia enim. Aenean eu vestibulum massa.
    In quam arcu, porta at justo ac, mattis pulvinar ipsum. Lorem ipsum
    dolor sit amet, consectetur adipiscing elit. Nullam a orci bibendum,
    tristique nisl efficitur, accumsan velit. Ut vel mi accumsan, semper
    quam quis, mollis lectus. Phasellus eu ipsum posuere, varius elit a,
    tincidunt tortor. Aenean eleifend libero nec risus efficitur, id semper
    ex vestibulum. Curabitur ac aliquet leo. Ut non porta lacus, eu
    hendrerit neque. Maecenas ac lacinia enim. Aenean eu vestibulum massa.
    In quam arcu, porta at justo ac, mattis pulvinar ipsum.
  </p>
</div>
</div>
```