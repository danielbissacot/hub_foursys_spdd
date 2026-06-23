# SideSheet

Superfície fixada na parte lateral da tela que sobrepoõe todos os demais elementos da tela, com exceção do header, Pode disponibilizar ao usuário ações ou informações complementares ao contexto atual. O SideSheet permanece estático na tela enquanto o usuário pode iteragir com outros elementos que podem vir em sua interface. Seu uso complementa o conteúdo da tela principal e agrupa informações ou ações de maneira sempre acessível. O componente Side Sheet ocupa o máximo de 80% de preenchimento da tela, ajustando de acordo com o tamanho de seu conteúdo.

# Uso do HTML
```
<button data-ss-open="brad-side-sheet" aria-label="Abrir SideSheet." role="button" class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active">
<em class="fab-icon i icon-ui-placeholder"></em>
</button>

<div id="brad-side-sheet" class="brad-side-sheet brad-side-sheet--default">
<button
  aria-label="Fechar SideSheet"
  role="button"
  data-ss-close="brad-side-sheet"
  class="i icon-component-close-delete brad-side-sheet__close"
></button>
<div class="brad-side-sheet__content">Conteúdo do SideSheet aqui 😃</div>
</div>
```
## Atributos

Você pode abrir ou fechar o SideSheet conforme será ensinado abaixo em ou adicionando atributos personalizados do componente nos alvos de clique dentro do HTML, por exemplo:

Ao clicar em qualquer elemento que tenha o atributodata-ss-open com o id do SideSheet respectivo, ele será aberto;
Ao clicar em qualquer elemento que tenha o atributodata-ss-close com o id do SideSheet respectivo, ele será fechado.
Comportamento Javascript
## Inicialização

## Inicializar elementos do SideSheet

```
const targetSelector = "#brad-side-sheet";
const options = { targetSelector };
const service = LiquidCorp.BradSideSheetService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| hasCloseWithGesture | boolean | true | Adiciona funcionalidade de fechar componente ao arrastar da direita para esquerda |
| from | string | 'left' | Indica se de qual posição o componente irá abrir. Tendo as opções 'left' (Abre da esquerda para a direita) e 'right' (Abre da direita para a esquerda) |

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| open | N/A | Abre |
| close | N/A | Fecha |
| toggle | N/A | Alterna entre abrir e fechar |
| destroy | N/A | Faz o encerramento de todos os listeners que existem vinculados ao componente instanciado |

# Uso básico
```
const service = LiquidCorp.BradSideSheetService.getInstance(options);
service.open();
```
Observações
## Comportamento

É possível fechar o SideSheet (mobile) ao arrasta-lo da direita para esquerda.

# Acessibilidade

Certifique-se de adicionar um button com o atributo aria-label='Fechar SideSheet'. Em seguida, adicione também um atributo data-ss-close='id-do-sidesheet' para que ele consiga fechar o sidesheet. Adicione também um atributo class='i icon-component-close-delete' para que apareça um botão de fechar. Certifique-se também de adicionar, nesta mesma classe, uma validação que verifica de qual lado o sidesheet irá abrir, que é definido com o atributo from, e se ele for do lado direito, adicione a classe: brad-side-sheet__close-right; porém, se for do lado esquerdo, adicione esta classe: brad-side-sheet__close-left. Assim, o botão vai se posicionar no local correto.

Certifique-se de adicionar um parágrafo <p></p> com id=id-sidesheet-result e aria-live=polite, que serve para o leitor de tela ler esse elemento sempre que ele for alterado. Adicione também um atributo style="opacity: 0; position: absolute" para que esse parágrafo não apareça nem ocupe espaço na DOM.

Certifique-se de adicionar tabindex=0 na div onde fica o conteúdo, para que ele consiga navegar.

Monitore um evento do serviço chamado open, que dispara sempre que ele abre o sidesheet, e adicione ao parágrafo o conteúdo de 'sidesheet aberto'. Monitore também do serviço um evento chamado close, que dispara sempre que o sidesheet é fechado, e no callback deste ouvinte, atualize o conteúdo do parágrafo para 'sidesheet fechado'.

```
<button aria-label="Abrir SideSheet" role="button" data-ss-open="${id}" class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active">
<em class="fab-icon i icon-ui-placeholder"></em>
</button>

<p
id="id-sidesheet-result"
aria-live="polite"
style="opacity: 0; position: absolute;"
></p>

<div id="brad-side-sheet" class="brad-side-sheet brad-side-sheet--default above-the-overlay">
<button aria-label="Fechar SideSheet" data-ss-close="brad-side-sheet" class="i icon-component-close-delete brad-side-sheet__close"></button>

<div class="brad-side-sheet__content" tabindex="0">Conteúdo do SideSheet aqui 😃</div>
</div>
```

Exemplo de como monitorar evento open e evento close.

```
setTimeout(() => {
const service = LiquidCorp.BradSideSheetService.getInstance(options);

service.eSideSheet.addEventListener("open", () => {
const eParagraphResult = document.getElementById("id-sidesheet-result");

  if (eParagraphResult) {
    eParagraphResult.textContent = "";
    eParagraphResult.textContent = "SideSheet aberto.";
  }

});

service.eSideSheet.addEventListener("close", () => {
const eParagraphResult = document.getElementById("id-sidesheet-result");

  if (eParagraphResult) {
    eParagraphResult.textContent = "";
    eParagraphResult.textContent = "SideSheet fechado.";
  }

});
}, 400);
```
Exemplo
```
<button
  aria-label="Abrir SideSheet"
  role="button"
  data-ss-open="ss-318"
  class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
>
  <em class="fab-icon i icon-ui-placeholder"></em>
</button>

<p
  id="id-sidesheet-result"
  aria-live="polite"
  style="opacity: 0; position: absolute;"
></p>

<div
  id="ss-318"
  class="brad-side-sheet brad-side-sheet--default above-the-overlay"
>
  <button
    aria-label="Fechar SideSheet"
    role="button"
    data-ss-close="ss-318"
    class="i icon-component-close-delete brad-side-sheet__close"
  ></button>

  <div class="brad-side-sheet__content brad-m-md-t" tabindex="0">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel feugiat ex. Aliquam erat volutpat.
  Pellentesque iaculis quis nisi sed volutpat. Pellentesque pretium sit amet risus id ullamcorper. Nulla finibus a nisl nec sagittis.
  Integer venenatis iaculis ipsum, vitae lobortis diam suscipit ut. Pellentesque ut purus non erat porttitor cursus a a enim. Cras nec mauris nisl.
  Nam commodo eros sit amet viverra vulputate. Nunc rhoncus imperdiet elit quis lobortis. Curabitur rhoncus scelerisque semper.
  Vivamus et porta nulla, at viverra tortor. Sed condimentum, magna in dictum volutpat, sapien nisi varius lectus, vitae vestibulum leo sem eget purus.
  Nunc lorem libero, vulputate eget finibus vitae, dictum eget nulla. Nullam turpis dolor, imperdiet eget arcu vitae, pretium tempus urna.
  Curabitur sit amet lacus ut eros iaculis condimentum sit amet a diam. Cras bibendum nulla quis urna dictum tincidunt.
  Sed semper sapien in tellus feugiat sodales. Sed ullamcorper tempus ex, pellentesque dictum justo semper ac. Donec scelerisque velit sit amet mi pharetra lobortis.
  Mauris dictum mauris id ipsum iaculis blandit. Nulla id faucibus massa. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
  Donec sit amet purus sit amet augue iaculis varius. Nam in iaculis mauris. Phasellus sodales egestas velit nec hendrerit. Vivamus quis congue magna, nec dictum quam.
  Aliquam eget ornare nibh. Vivamus aliquam accumsan felis. Praesent et risus efficitur, blandit turpis eget, rhoncus sapien. Suspendisse sodales tincidunt massa, eu rhoncus purus venenatis nec.
  Integer venenatis facilisis tellus, a bibendum tortor. Proin tincidunt nunc vel massa hendrerit consectetur. Aliquam lacinia fringilla imperdiet. Donec non velit orci.
  Morbi blandit tempus consequat. Sed libero justo, molestie vitae imperdiet ut, feugiat eu metus. Quisque commodo tincidunt dignissim. Duis laoreet scelerisque pretium. Sed congue blandit porttitor.
  Donec porta tellus volutpat massa interdum, quis bibendum lorem faucibus. Nunc est elit, blandit at pellentesque in, sagittis non massa.
  Donec sapien ipsum, sollicitudin vel cursus sed, blandit vel quam. In sit amet cursus lorem. Pellentesque eget ex id est tincidunt ultrices sed sed elit.
  Ut in est quis nunc porta venenatis. Proin in sapien lobortis elit cursus vehicula. Quisque ut lorem pellentesque, aliquam nulla fermentum, sollicitudin nisi.
  Donec tempor enim ipsum, quis scelerisque leo dignissim in. Aenean purus tellus, pellentesque vitae erat at, volutpat porta neque.
  </div>
</div>
```