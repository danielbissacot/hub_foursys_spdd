# BottomSheetExpansive - Drag

Superfície fixada na parte inferior da tela que sobrepõe todos os demais elementos da tela e, pode disponibilizar ao usuário ações ou informações complementares ao contexto atual. Essa é uma versão expansível que permanece presente na base da tela, fechado ou aberto. Este modelo tem o comportamento de arrastar que abre e fecha totalmente o BottomSheet.

## Atenção: o componente já esta fixado no fim desta página ⚠️

# Uso do HTML
```
<div id="bse-drag" class="brad-bottom-sheet-expansive" role="dialog">
<div class="brad-bottom-sheet-expansive__header" aria-label="HeaderTitle" role="button">
  <div class="brad-bottom-sheet-expansive__title" aria-hidden="true">
    <h2 class="brad-font-subtitle-sm">Header Title</h2>
  </div>
</div>

<div class="brad-bottom-sheet-expansive__content" tabindex="-1">Conteúdo aqui 😊</div>
</div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do bottom-sheet-expansive

```
const targetSelector = "#bse-drag";
const state = "drag"; // "tap" | "drag"
const maxHeight = 100; // entre 0 ou 100
const options = { targetSelector, state, maxHeight };

const service = LiquidCorp.BradBottomSheetExpansiveService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object {}], por exemplo [{targetSelector: "#idBottomSheet1"}, {targetSelector: "#idBottomSheet2"}, {targetSelector: "#idBottomSheet3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID ou .classe vinculado ao HTML do componente |
| state | "tap", "drag" | "tap" | Tipo do componente |
| maxHeight | number | 100 | Altura máxima que o componente pode abrir - permitido valor entre 0 e 100 |
| overlayOpacityClass | string | "brad-bg-overlay-40" | Altera intensidade do overlay conforma a documentação do overlay |
| clickOutsideClose | boolean | true | Determina se ao clicar no overlay se ele será fechado |
| removeBodyScroll | boolean | true | Determina se ao abrir o overlay não terá rolagem na página |
| isLeavingScreenMode | boolean | false | Nesse modo, o componente ficará totalmente escondido enquanto estiver com o conteúdo fechado |


Agora é possível controlar o HTML do componente pelo seletor: (#bse-drag)

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Nome | Tipo | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| open | N/A | Abre |
| close | N/A | Fecha |
| toggle | N/A | Alterna entre abrir e fechar |
| destroy | N/A | Faz o encerramento de todos os listeners que existem vinculados ao componente instanciado |

# Uso básico
```
// Uso básico dos métodos
const service = LiquidCorp.BradBottomSheetExpansiveService.getInstance({
targetSelector: "#bse-drag",
});

/* eventListener customizado, usado para obter informações do bottom-sheet*/
function addListenersBottomsheet(service) {
service.eBottomSheet.addEventListener("opened", (e) => {
  //console.log(e.detail, "open");
});
service.eBottomSheet.addEventListener("closed", (e) => {
  //console.log(e.detail, "close");
});
}

/* eventListeners customizados do overlay*/
function addListenersOverlay(service) {
service.eOverlay.addEventListener("open", () => {
  //console.log("open");
});

service.eOverlay.addEventListener("close", () => {
  //console.log("close");
});
}

addListenersBottomsheet(service);
addListenersOverlay(service);

service.open();
```
## Acessibilidade

O componente bottom sheet expansive já apresenta alguns atributos de acessibilidade no exemplo disponível.




Para evitar que o leitor de tela leia os conteúdos que estão atrás do bottomsheet, basta adicionar o atributo brad-aria-hidden-placer nos elementos que não devem ser lidos.

Importante: como o aria-hidden ele propagado do pai para os filhos, é importante deixar o bottom-sheet fora de qualquer pai que terá aria-hidden. Para mais detalhes sobre brad-aria-hidden-placer.

# Exemplo:

```
<div brad-aria-hidden-placer>
<p>Conteúdo para não ser lido quando o bottomsheet estiver aberto</p>
</div>
```

É importante se atentar para a informação que o usuário deve receber, e aos tipos de elementos que serão abertos, a primeira tag do componente possui os atributos role="dialog", aria-modal="true" e tabindex="0" o tabindex vai direcionar o foco para o componente o role dialog e modal true identifica para o leitor de telas que está sendo aberta uma caixa de diálogo.

```
<div id="bse-drag" tabindex="0" class="brad-bottom-sheet-expansive" role="dialog" aria-modal="true"></div>
```

A tag abaixo é utilizada para a abertura e fechamento do componente é importante incluir o role="button" e o aria-label com a informação.

```
<div class="brad-bottom-sheet-expansive__header" aria-label="Mais informações" role="button"></div>
```

Se atentem para garantir que todo conteúdo seja apresentado para o leitor de tela, dúvidas consulte a equipe de acessibilidade do seu projeto.
Como boa prática de acessibilidade recomendamos que em caso de conteúdo extenso no bottom-sheet, onde a ação de recolher esteja disponível apenas no início dele, seja implementado algum recurso para recolher o componente no final do seu conteúdo, evitando que o usuário tenha que navegar por todo o componente novamente para conseguir recolhe-lo.

# Exemplo
Observações
## Responsividade

O bottom sheet é um componente para uso em smartphones, mas caso seja necessário, pode também ser utilizado em tablets. Em desktop o bottom sheet deverá ser substituído por outros componentes mais adequados.

```
<div id="bs-278" class="brad-bottom-sheet-expansive" role="dialog">
  <div
    class="brad-bottom-sheet-expansive__header"
    aria-label="HeaderTitle"
    role="button"
  >
    <div class="brad-bottom-sheet-expansive__title" aria-hidden="true">
      <h2 class="brad-font-subtitle-sm">Header Title</h2>
    </div>
  </div>

  <div class="brad-bottom-sheet-expansive__content" tabindex="-1">
    
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