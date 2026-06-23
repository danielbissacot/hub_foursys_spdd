# BottomSheet - Fixed

Superfície fixada na parte inferior da tela que sobrepõe todos os demais elementos da tela e, pode disponibilizar ao usuário ações ou informações complementares ao contexto atual. Versão do componente que permanece estática na tela enquanto o usuário pode interagir com outros elementos da interface fora do bottom sheet. Este formato complementa o conteúdo da tela e agrupa informações ou ações de maneira sempre acessível.

# Uso do HTML
```
<button class="brad-btn brad-btn-primary" onclick="toggleBottomSheet()">TOGGLE BOTTOM SHEET!</button>

<div id="bs-fixed" class="brad-bottom-sheet" role="dialog" aria-modal="true" tabindex="-1">
<div class="brad-bottom-sheet__header">
  <h2 class="brad-bottom-sheet__title brad-font-title-md">Title</h2>
  <button class="brad-bottom-sheet__btn-close i icon-component-close-delete" aria-label="Fechar dialog" role="button" onclick="closeBottomSheet()"></button>
</div>
<div class="brad-bottom-sheet__content brad-scrollbar">Conteúdo aqui 😊</div>
</div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do bottom-sheet

```
const targetSelector = "#bs-fixed";
const state = "fixed";
const options = { targetSelector, state };

const service = LiquidCorp.BradBottomSheetService.getInstance(options);

function toggleBottomSheet() {
service.toggle();
}

function closeBottomSheet() {
service.close();
}
```
## getInstances

O método getInstances deve ser usado quando há necessidade de criar mais de uma instância de um componente. Ele retorna um array de instâncias para cada elemento. Basta passar no parâmetro um array de objetos [Object ], por exemplo: [{targetSelector: "#idBottomSheet1"}, {targetSelector: "#idBottomSheet2"}, {targetSelector: "#idBottomSheet3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| state | "fixed", "modal" | "fixed" | Tipo do componente |


Agora é possível controlar o HTML do componente pelo targetSelector: (#bs-fixed)

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

# Uso Básico
```
const service = LiquidCorp.BradBottomSheetService.getInstance({
targetSelector: "#bs-fixed",
state: "fixed",
});

service.eBottomSheet.addEventListener("opened", (e) => {
// lógica ao abrir
});

service.eBottomSheet.addEventListener("closed", (e) => {
// lógica ao fechar
});

service.toggle();
service.destroy();
```
Observações
## Responsividade

O bottom sheet é um componente para uso em smartphones, mas caso seja necessário, pode também ser utilizado em tablets. Em desktop o bottom sheet deverá ser substituído por outros componentes mais adequados.

# Acessibilidade

O componente bottom sheet já apresenta alguns atributos de acessibilidade no exemplo disponível.

É importante se atentar para a informação que o usuário deve receber, e aos tipos de elementos que serão abertos. A primeira tag do componente possui os atributos role="dialog", aria-modal="true" e tabindex="-1". O tabindex remove o elemento do fluxo de navegação padrão mas permite que ele receba foco programático, ou seja, o foco pode ser definido para esse elemento a partir de um script. O role="dialog" e aria-modal="true" identificam para o leitor de telas que está sendo aberta uma caixa de diálogo.

```
<div id="bs-fixed" class="brad-bottom-sheet" role="dialog" aria-modal="true" tabindex="-1"></div>
```

Como boa prática de acessibilidade, recomendamos que em caso de conteúdo extenso no bottom-sheet, onde a ação de fechar esteja disponível apenas no início, seja implementado algum recurso para fechar o componente no final do seu conteúdo, evitando que o usuário tenha que navegar por todo o componente novamente para conseguir fechá-lo.

# Exemplos
```
<button
  class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
  onclick="bottomSheet.toggle()"
>
  <em><em class="fab-icon i icon-ui-placeholder"></em></em>
</button>

<div id="bs-309" class="brad-bottom-sheet" aria-modal="true" tabindex="-1">
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