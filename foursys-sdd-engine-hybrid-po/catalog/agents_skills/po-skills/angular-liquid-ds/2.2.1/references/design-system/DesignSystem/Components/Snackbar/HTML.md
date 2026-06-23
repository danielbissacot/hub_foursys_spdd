# Snackbar

O Snackbar é um componente flutuante e interativo, que fornece um feedback breve que informa ou solicita ação ao usúario.

# Uso do HTML
```
<div
id="snackbar-123"
class="brad-snackbar brad-snackbar--info brad-snackbar--right"
>
<em
  class="brad-snackbar__close"
  data-sb-close="snackbar-123"
  role="button"
></em>

<div class="brad-snackbar__content">
  <p>Text goes here.</p>
</div>
</div>
```
Posição Vertical
Top
```
<div
id="snackbar-123"
class="brad-snackbar brad-snackbar--info brad-snackbar--top brad-snackbar--right"
>
<em
  class="brad-snackbar__close"
  data-sb-close="snackbar-123"
  role="button"
></em>

<div class="brad-snackbar__content">
  <p>Text goes here.</p>
</div>
</div>
```

Adicione a classe brad-snackbar--top no container do componente, caso queira que o posicionamento vertical seja no topo.

# Atributos

Você pode abrir ou fechar o snackbar conforme será ensinado abaixo em ou adicionando atributos personalizados do componente nos alvos de clique dentro do HTML, por exemplo:

Ao clicar em qualquer elemento que tenha o atributodata-sb-open com o id do snackbar respectivo, ele será aberto:

```
<button class="brad-btn brad-btn-primary" data-sb-open="snackbar-123">
  TOGGLE SNACKBAR!
</button>
```

Ao clicar em qualquer elemento que tenha o atributodata-sb-close com o id do snackbar respectivo, ele será fechado:

```
<em
  class="brad-snackbar__close"
  data-sb-close="snackbar-123"
  role="button"
></em>
```
## Ícones

O ícone de fechar será default de todos os estilos ao adicionar no HTML do componente o seguinte:

```
<em
  class="brad-snackbar__close"
  data-sb-close="snackbar-123"
  role="button"
></em>
```

O ícone da esquerda de cada estilo será default ao adicionar no HTML do componente o seguinte:

```
<!-- Caso queria alterar o ícone default, você pode adicionar alguma classe de ícone da nossa biblioteca -->
<em class="brad-snackbar__icon i i-pegar-icone-na-documentacao"></em>
```

Escolha algum ícone da nossa documentação de ícones.

# Estilos
Info
```
<div id="snackbar-123" class="brad-snackbar brad-snackbar--info brad-snackbar--right">
  <em
    class="brad-snackbar__close"
    data-sb-close="snackbar-123"
    role="button"
  ></em>
  <em class="brad-snackbar__icon"></em>

  <div class="brad-snackbar__content">Text goes here.</div>
</div>
```
Success
```
<div id="snackbar-123" class="brad-snackbar brad-snackbar--success brad-snackbar--right">
  <em
    class="brad-snackbar__close"
    data-sb-close="snackbar-123"
    role="button"
  ></em>
  <em class="brad-snackbar__icon"></em>

  <div class="brad-snackbar__content">Text goes here.</div>
</div>
```
Warning
```
<div id="snackbar-123" class="brad-snackbar brad-snackbar--warning brad-snackbar--right">
  <em
    class="brad-snackbar__close"
    data-sb-close="snackbar-123"
    role="button"
  ></em>
  <em class="brad-snackbar__icon"></em>

  <div class="brad-snackbar__content">Text goes here.</div>
</div>
```
Error
```
<div id="snackbar-123" class="brad-snackbar brad-snackbar--error brad-snackbar--right">
  <em
    class="brad-snackbar__close"
    data-sb-close="snackbar-123"
    role="button"
  ></em>
  <em class="brad-snackbar__icon"></em>

  <div class="brad-snackbar__content">Text goes here.</div>
</div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do Snackbar

```
const targetSelector = "#snackbar";
const ttl = 3;
const options = { targetSelector, ttl };

/** É necessário inicializar o componente passando o options com as propriedades mostradas acima,

- caso não passe, o componente será executado com erro. */
LiquidCorp.BradSnackbarService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID ou .classe vinculado ao HTML do componente |
| ttl | number | 0 | TimeToLive adiciona limite no perído de tempo (em segundos) que o componente ficará aberto - para que feche sozinho depois do tempo estipulado, precisa ser maior que 0. |

# Metódos

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
const targetSelector = "#snackbar";
const ttl = 3;
const options = { targetSelector, ttl };

// Uso básico dos métodos
const service = LiquidCorp.BradSnackbarService.getInstance(options);

/_ eventListener customizado, usado para obter informações do snackbar atual_/
function addListenerOpen(service) {
service.eSnackbar.addEventListener("opened", (e) => {
//console.log(e.detail, "open");
});
}

function addListenerClose(service) {
service.eSnackbar.addEventListener("closed", (e) => {
//console.log(e.detail, "close");
});
}

addListenerOpen(service);
addListenerClose(service);

service.open();
// ou LiquidCorp.BradSnackbarService.getInstance(options).open();
// ou const service = LiquidCorp.BradSnackbarService.getInstances([options]);
// service[0].close();
```
Observações
## Fechamento

A snackbar pode ser parametrizada para fechar automaticamente em segundos, através do ttl ou persistir em tela até o usuário interagir com o botão fechar ou com um link de ação. O usuário pode também arrastar a snackbar para baixo, para fechá-lo como no exemplo abaixo:

# Responsividade

Em desktop snackbar se comportará com no mínimo 320px de largura e aumentando conforme o conteúdo interno, e em dispositivos mobile ficará sempre 100% largura da tela.

# Acessibilidade

Para utilizar de maneira correta a acessibilidade, é recomendado utilizar os métodos exemplificados a seguir referentes ao fechar o modal com a tecla esc, abrir e fechar do snackbar, por meio delas serão setadas as tags de acessibilidade e dada a leitura correta do fluxo de informações contidas no componente e ao fechar o snackbar, o foco voltará ao trigger da abertura do snackbar, se for desnecessário, apenas deve-se remover:

```
document.querySelector(`[data-sb-open="${triggerSnackbarElementId}"]`).focus();
```
```
<button class="brad-btn brad-btn-primary" data-sb-open="id">
OPEN SNACKBAR!
</button>

<div id="id" class="brad-snackbar" tabindex="-1">
<em
  tabIndex="0"
  class="brad-snackbar__close"
  data-sb-close="id"
  role="button"
  aria-label="Fechar snackbar"
></em>

<div class="brad-snackbar__content">
  <p>content</p>
</div>
</div>
```
```
const id = "id";
const options = { targetSelector: `#${id}`, ttl };
const service = LiquidCorp.BradSnackbarService.getInstance(options);
const elementSnackbar = service.eSnackbar;
service.close();

function openSnackbarAcessibilityEvent(elementSnackbar) {
elementSnackbar.setAttribute("aria-live", "assertive");
elementSnackbar.setAttribute("role", "alert");
elementSnackbar.setAttribute("aria-atomic", "true");
elementSnackbar.setAttribute("tabindex", "0");
elementSnackbar.focus();
}

function closeSnackbarAcessibilityEvent(
elementSnackbar,
triggerSnackbarElementId = null
) {
elementSnackbar.removeAttribute("aria-live");
elementSnackbar.removeAttribute("role");
elementSnackbar.removeAttribute("aria-atomic");
elementSnackbar.setAttribute("tabindex", "-1");

document
.querySelector(`[data-sb-open="${triggerSnackbarElementId}"]`)
.focus();
}

elementSnackbar.addEventListener("opened", () => {
openSnackbarAcessibilityEvent(elementSnackbar);
});

elementSnackbar.addEventListener("closed", () => {
closeSnackbarAcessibilityEvent(elementSnackbar, id);
});

document.addEventListener("keydown", (event) => {
if (event.key === "Escape" && service.show) service.close();
});
```
## Stacked

O modo Stacked permite abrir múltiplos snackbars empilhados.

# Uso do HTML
```
<div id="stacked-container"></div>
```
Comportamento Javascript
Inicialização
```
let snackedContainerOptions = {
targetSelector: "stacked-container",
maxSnackbars: 5,
verticalPosition: "bottom",
align: "right",
};

const snackbarStackedManager =
LiquidCorp.BradSnackbarStackedService.getInstance(snackedContainerOptions);

snackbarStackedManager.add("Texto do snackbar", "default", 5);
```
## Options stacked container

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID vinculado ao HTML do componente |
| verticalPosition | "top", "bottom" | "bottom" | Posicionamento vertical dos snackbars |
| maxSnackbars | number | 5 | Número máximo de snackbars que serão abertos, caso ultrapasse o máximo, o primeiro a ser aberto será fechado automaticamente para um novo ser aberto |
| align | "left", "center", "right" | "right" | Posicionamento horizontal dos snackbars |

# Options stacked element

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| content | string | "" | Texto do snackbar |
| state | string | "default" | Estilo do snackbar (info, success, warning, error e default) |
| ttl | number | 0 | TimeToLive adiciona limite no perído de tempo (em segundos) que o componente ficará aberto - para que feche sozinho depois do tempo estipulado, precisa ser maior que 0. |

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| add | content, state, ttl | Cria e abre o snackbar |
| close | snackbarInstance | Fecha um snackbar, deve ser passado uma instância do service snackbar como parâmetro, por padrão o snackbar já tem configurado o close no botão |

# Observações
Exemplo com acessibilidade
```
let actualSnackbar = null;

let snackedContainerOptions = {
targetSelector: "stacked-container",
maxSnackbars: 5,
align: "right",
};

function snackbarAcessibility(snackbar) {
snackbar.setAttribute("aria-live", "assertive");
snackbar.setAttribute("role", "alert");
snackbar.setAttribute("aria-atomic", "true");
snackbar.setAttribute("tabindex", "0");
snackbar.focus();
}

const snackbarStackedManager =
LiquidCorp.BradSnackbarStackedService.getInstance(snackedContainerOptions);

function addNewSnackbar() {
actualSnackbar = snackbarStackedManager.add("Snackbar", "default", 0);
}

document.querySelector("#stack").addEventListener("click", () => {
addNewSnackbar();
snackbarAcessibility(actualSnackbar.eSnackbar);
});

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") {
const container = document.activeElement.parentElement;
const actualElement = document.activeElement;

  if (
    container.classList.contains("brad-snackbar-stacked-container") &&
    actualElement.classList.contains("brad-snackbar")
  ) {
    const selectedSnackbarService = snackbarStackedManager.snackbars.find(
      (snackbar) => snackbar.eSnackbar === actualElement
    );

    selectedSnackbarService.close(selectedSnackbarService);
  }

}
});
```
Exemplos
Default
```
<button
  data-sb-open="snackbar-190"
  class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
  aria-label="Abrir snackbar"
>
  <em class="fab-icon i icon-ui-placeholder"></em>
</button>

<div
  id="snackbar-190"
  class="brad-snackbar brad-snackbar--bottom brad-snackbar--right"
  tabindex="-1"
>
   <em class="brad-snackbar__icon icon-ui-placeholder brad-text-color-neutral-0"></em>
  <em
    tabIndex="0"
    class="brad-snackbar__close"
    data-sb-close="snackbar-190"
    role="button"
    aria-label="Fechar snackbar"
  ></em>
  <div class="brad-snackbar__content">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </div>
</div>
```
Stacked
```
<button
  id="button-stacked-182"
  class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
  aria-label="Adicionar snackbar e abrir"
>
  <em class="fab-icon i icon-ui-plus"></em>
</button>

<div id=snackbar-stacked-128></div>
```