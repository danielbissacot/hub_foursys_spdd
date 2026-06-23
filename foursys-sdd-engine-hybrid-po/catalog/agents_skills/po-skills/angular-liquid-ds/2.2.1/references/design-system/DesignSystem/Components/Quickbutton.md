# Quickbutton

O botão quickbutton sempre inicia em tela no formato do botão primário padrão, mas ao dar foco a um input do formulário, ele sobe junto ao teclado, assumindo sua forma que se estende até as laterais da tela e sem arredondamento na base.
⚠️Atenção: Este componente possui algumas limitações técnicas:
1- O componente utiliza para seu posicionamento o "visualViewport" - https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport, tendo compatibilidade a partir do iOS 14 em diante.
2- Não é possível utiliza-lo através de um iframe.

.

# Uso do HTML
```
<div class="brad-flex brad-flex-column">
  <!-- START: Faz parte de um exemplo de uso do componente, mas não é o componente. -->
  <label class="brad-text-field brad-m-md-b" onclick="startQuickbutton()">
    <input aria-label="Campo de texto" class="" type="text" placeholder="Hint text" />
    <em aria-hidden="true" class="leading-icon i icon-ui-search complements"></em>
    <small aria-hidden="true" class="placeholder-label-field">Label text</small>
    <span class="prefix">R$</span>
    <span class="suffix">/100</span>
    <em class="validation-icon complements"></em>
    <em class="icon-navigation-arrow-return trailing-icon complements"></em>
    <button class="trailing-button-text complements brad-btn brad-btn-text brad-font-link">Link</button>
    <span class="helper-text">Helper text</span>
    <div class="brad-text-field--background"></div>
  </label>
  <!-- END: Faz parte de um exemplo de uso do componente, mas não é o componente. -->

  <!-- START: Componente quickbutton -->
  <button id="quickbutton" class="brad-btn brad-btn-primary brad-quickbutton">Button</button>
  <!-- END: Componente quickbutton -->
</div>
Copy
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do quickbutton

```
function startQuickbutton() {
  /* LiquidCorp.BradQuickbuttonService.getInstance([id1], [id2], [id3]);
     Inicializará e retornará uma instância para cada id **/
  LiquidCorp.BradQuickbuttonService.getInstance({
    targetSelector: "#quickbutton",
  });
}
Copy
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object {}], por exemplo [{id: "#idQuickbutton1"}, {id: "#idQuickbutton2"}, {id: "#idQuickbutton3"}, ...].

Agora é possível controlar o HTML do componente pelo id: (#quickbutton)

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID ou .classe vinculado ao HTML do componente |

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| destroy | N/A | Faz o encerramento de todos os listeners que existem vinculados ao componente instanciado |

# Uso básico
```
const service = LiquidCorp.BradQuickbuttonService.getInstance({
  targetSelector: "#quickbutton",
});
service.destroy();
Copy
```
## Obervações

Esse componente não funciona no Storybook, apenas em aplicações web reais e seu teste deve ser feito em aparelhos reais, não emulado. O quickbutton é compatível iOS v13 ou superior, para versões anteriores ele não aparecerá ao subir o teclado.

# Acessibilidade

Esse componente utiliza elementos nativos do <button> assim contem todas as features de acessibilidade por padrão.

É importante relacionar a label com o botão, para isso pode-se usar o atributo aria-label na tag <button>.

```
<button class="brad-btn brad-btn-icon" aria-label="Button Example">
  <em class="btn-icon i icon-ui-placeholder"></em>
</button>
Copy
```

Não sendo possível utilizar HTML semântico, é necessário incluir JavaScript Event Listeners e atributos de acessibilidade como tabindex="0" para que o botão receba foco e role="button" para que o leitor de tela anuncie o elemento como um botão.

É importante ele ser o último código HTML da página, para que seja o último item lido pelo leitor de telas.

# Exemplo
```
<div class="brad-flex brad-flex-column">
  <label class="brad-text-field brad-m-md-b">
    <input
      aria-label="Campo de texto"
      class=""
      type="text"
      placeholder="Hint text"
    />
    <em
      aria-hidden="true"
      class="leading-icon i icon-ui-search complements"
    ></em>
    <small aria-hidden="true" class="placeholder-label-field"
      >Label text</small
    >
    <span class="prefix">R$</span>
    <span class="suffix">/100</span>
    <em class="validation-icon complements"></em>
    <em class="icon-navigation-arrow-return trailing-icon complements"></em>
    <button
      class="trailing-button-text complements brad-btn brad-btn-text brad-font-link"
    >
      $Link
    </button>
    <span class="helper-text">Helper text</span>
    <div class="brad-text-field--background"></div>
  </label>

  <button
    id="modal-273"
    class="brad-btn brad-btn-primary brad-quickbutton"
    
  >
     Button
  </button>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| backgroundColor | Altera cor de fundo string |  | Choose option... no-background-color brad-bg-color-primary brad-bg-color-secondary brad-bg-color-institucional |
| onColor | Estado de mudança de cor para fundos escuros. Obs: Ativando o modo on-color é recomendado alterar a cor do background do storybook para on-color no ícone de galeria no canto superior esquerdo. boolean |  | FalseTrue |
| label | Texto do botão string |  |  |
| disabled | Estado de desabilitado boolean |  | FalseTrue |
| active | Classe ativada automaticamente quando o teclado nativo aparece. boolean |  | FalseTrue |
| hasIcon | Adiciona ícone ao botão boolean |  | FalseTrue |
| iconName | Filtre ícone pelo nome da classe string | - |  |