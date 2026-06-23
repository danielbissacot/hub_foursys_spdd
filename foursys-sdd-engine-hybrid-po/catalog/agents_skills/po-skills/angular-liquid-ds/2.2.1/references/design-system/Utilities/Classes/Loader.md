# Loader

O componente Loader tem o papel de proporcionar feedback de espera para o usuário em momentos em que conteúdos ou itens da página estão sendo carregados.
.

# Uso do HTML
```
<div class="brad-loader">
  <em></em>
  <em></em>
  <em></em>
  <em></em>
  <em></em>
  <em></em>
  <em></em>
  <em></em>
</div>
Copy
```
Comportamento Javascript
## Inicialização

## Inicialização não é necessária (componente nativo)

# Obervações
Para a utilização do loader com texto e loader com overlay deverão ser utilizados os seguintes códigos:
Loader com texto
```
<div class="brad-loader__container">
  <div class="brad-loader">
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
  </div>

  <div class="brad-loader__text">
    <p class="brad-font-paragraph-sm">Lorem Ipsum</p>
  </div>
</div>
Copy
```
Loader com overlay
Para utilizar o loader com overlay deverá ser utilizado a inicialização e métodos do overlay, sendo a exibição dos elementos do loader a cargo da jornada como demonstrado a seguir:
```
<button onclick="handleLoaderWithOverlay()" class="brad-btn brad-btn-text">
  Show
</button>

<div
  id="loaderWithOverlayId"
  class="brad-loader__container brad-loader__overlay brad-loader__overlay--invisible"
>
  <div class="brad-loader">
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
  </div>
</div>
Copy
```
```
const overlayService = LiquidCorp.BradOverlayServiceDefault.getInstance({
  overlayOpacityClass: 'brad-bg-overlay-80',
  clickOutsideClose: true,
  targetSelector: 'loaderWithOverlayId',
});

const loaderWithOverlayElement = overlayService.getElementEvent();
loaderWithOverlayElement.addEventListener('open', function () {
  document
    .getElementById(id)
    .classList.remove('brad-loader__overlay--invisible');
  document.getElementById('loaderWithOverlayId').classList.add('align-center');

  setTimeout(() => {
    overlayService.close();
  }, 2000);
});

loaderWithOverlayElement.addEventListener('close', function () {
  document.getElementById(id).classList.add('brad-loader__overlay--invisible');
  document
    .getElementById('loaderWithOverlayId')
    .classList.remove('align-center');
});

function handleLoaderWithOverlay() {
  overlayService.open();
}
Copy
```
Exemplo
```
<div class="brad-theme-classic brad-flex">
  <div class="brad-loader">
      <em></em>
      <em></em>
      <em></em>
      <em></em>
      <em></em>
      <em></em>
      <em></em>
      <em></em>
  </div>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| onColor | Estado de mudança de cor para fundos escuros. Obs: Ativando o modo on-color é recomendado alterar a cor do background do storybook para on-color no ícone de galeria no canto superior esquerdo. boolean |  | FalseTrue |

# STORIES
Loader
```
<div class="brad-theme-classic brad-flex">
  <div class="brad-loader">
      <em></em>
      <em></em>
      <em></em>
      <em></em>
      <em></em>
      <em></em>
      <em></em>
      <em></em>
  </div>
</div>
```
Loader With Text
```
<div class="brad-theme-classic brad-flex">
  <div class="brad-loader__container">
    <div class="brad-loader">
      <em></em>
      <em></em>
      <em></em>
      <em></em>
      <em></em>
      <em></em>
      <em></em>
      <em></em>
    </div>

    <div class="brad-loader__text">
      <p class="brad-font-paragraph-sm">Lorem Ipsum</p>
    </div>
  </div>
</div>
```
Loader With Overlay And Text
```
<button onclick="handleShowAndDestroy()" class="brad-btn brad-btn-text">
  Show and destroy
</button>

<div
  id="brad-loader-170"
  class="brad-theme-classic brad-loader__container brad-loader__overlay brad-loader__overlay--invisible"
>
  <div class="brad-loader">
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
  </div>

  <div class="brad-loader__text">
    <p class="brad-font-paragraph-sm">Lorem Ipsum</p>
  </div>
</div>

<script>
  function handleShowAndDestroy() {
    LiquidCorp.BradOverlayService.createOverlay();
    getElementEvent();
    setEventListeners();

    LiquidCorp.BradOverlayService.open();
  }
</script>
```
Loader With Overlay
```
<button onclick="handleLoaderWithOverlay()" class="brad-btn brad-btn-text">
  Show
</button>

<div
  id="brad-loader-379"
  class="brad-theme-classic brad-loader__container brad-loader__overlay d-none"
>
  <div class="brad-loader">
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
    <em></em>
  </div>
</div>

<script>
  function handleLoaderWithOverlay() {
    LiquidCorpLoaderWithOverlay.BradLoaderOverlayService.open();
  }
</script>
```