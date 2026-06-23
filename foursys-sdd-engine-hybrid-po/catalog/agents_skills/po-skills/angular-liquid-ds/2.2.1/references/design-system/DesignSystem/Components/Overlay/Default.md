# Overlay Default

Overlay é um recurso visual utilizado para separar o fundo de uma tela com algum conteúdo em primeiro plano, como um Modal.

# Documentação

Defina o valor de opacidade de um elemento usando .brad-opacity-{value}.


| Classes | Exemplo |
| --- | --- |
| brad-bg-overlay-40 | <div class="brad-bg-overlay-40 brad-text-color-neutral-0 brad-p-sm">40</div> |
| brad-bg-overlay-60 | <div class="brad-bg-overlay-60 brad-text-color-neutral-0 brad-p-sm">60</div> |
| brad-bg-overlay-80 | <div class="brad-bg-overlay-80 brad-text-color-neutral-0 brad-p-sm">80</div> |

# Exemplo de uso
HTML
```
<div id="overlayId"></div>
```
Comportamento Javascript
## Inicialização

Inicializar elementos do overlay.

O getInstance tem como parâmetro padrão o Object {}, por exemplo { targetSelector: "#idElemento" }.

```
const overlayService = LiquidCorp.BradOverlayServiceDefault.getInstance({
overlayOpacityClass: "brad-bg-overlay-80",
clickOutsideClose: true,
targetSelector: "overlayId",
removeBodyScroll: true,
});

function open() {
overlayService.open();
}

function isOverlayOpen() {
overlayService.isOpen();
}

function close() {
overlayService.close();
}

function destroy() {
overlayService.destroy();
}

let overlayElement = "";
function getElementOverlay() {
overlayElement = overlayService.getElementEvent();
}

overlayElement.addEventListener("open", function () {});

overlayElement.addEventListener("close", function () {
destroy();
});
```
## Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| overlayOpacityClass | "brad-bg-overlay-40", "brad-bg-overlay-60", "brad-bg-overlay-80" | "brad-bg-overlay-80" | Determina intensidade da cor do overlay |
| clickOutsideClose | boolean | true | Determina se ao clicar no overlay se ele será fechado |
| targetSelector | string | "" | ID do elemento que será vinculado ao overlay criado |
| removeBodyScroll | boolean | true | Determina se ao abrir o overlay não terá rolagem na página |

# Métodos

| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao ID passado no options |
| createOverlay | N/A | Cria ou identifica um overlay já criado |
| open | N/A | Abre o overlay |
| isOpen | N/A | Retorna boolean se está aberto ou não o overlay |
| close | N/A | Fecha o overlay |
| destroy | N/A | Remove o elemento overlay do HTML |
| getElementEvent | N/A | Retorna o elemento overlay do HTML |

# Acessibilidade

Para que o leitor de tela não leia os conteúdos por traz do overlay, basta acrescentar o atributo brad-aria-hidden-placer aos elementos que não devem ser lidos.

No momento que o overlay aparecer, os elementos com o atributo brad-aria-hidden-placer terão automaticamente aria-hidden="true", bloqueando a leitura desses elementos.

E quando o overlay desaparecer é removido automaticamente o aria-hidden, retornando a possibilidade de leitura desses elementos.

OBS: não é necessário colocar o brad-aria-hidden-placer em todos os elementos do HTML (pais e filhos). Coloque apenas nos pais principais que você achar relevante, e assim todos os filhos desse pai não serão lidos.

```
<div brad-aria-hidden-placer>
<p>Conteúdo para não ser lido quando o overlay estiver aberto</p>
</div>
```
Exemplo
```
<button onclick="handleOverlay()" class="brad-btn brad-btn-text">
  Show Overlay
</button>

<script>
  function handleOverlay() {
    LiquidCorp.BradOverlayServiceDefault.open();
  }
</script>
```