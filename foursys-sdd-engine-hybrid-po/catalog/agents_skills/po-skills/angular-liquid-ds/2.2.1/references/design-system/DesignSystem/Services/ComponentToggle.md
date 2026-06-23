# ComponentToggle

O serviço Component Toggle é um recurso integrado no Liquid, projetado para facilitar a troca dinâmica entre dois componentes pré-definidos com base no breakpoint configurado. Ele permite uma transição suave e responsiva entre diferentes layouts de componentes, mantendo o conteúdo interno intacto durante a mudança de tamanho da janela.

# Componentes Suportados

Nota: Esta lista não é exaustiva. Nem todos os componentes da biblioteca estão disponíveis para troca dinâmica.

O serviço suporta componentes que implementam um padrão de sobreposição com funcionalidades de abertura e fechamento, e que se comportam como cascas, sem conteúdo interno fixo. Atualmente, os componentes compatíveis incluem:

# bottom-sheet
modal
side-sheet
## Observação Importante

Para que o serviço funcione corretamente, é necessário incluir o container do componente que está sendo utilizado, sem o seu conteúdo interno. No exemplo abaixo, foram incluídos os containers do bottom-sheet e do modal. Caso queira utilizar o side-sheet, seria necessário o container correspondente.

Além disso, essa abordagem se aplica a qualquer novo componente que seja disponibilizado no futuro, desde que siga o padrão de sobreposição com funcionalidades de abertura e fechamento.

# Uso do HTML

Se você optar por usar o bottom-Sheet e o modal, o HTML será semelhante ao seguinte:

```
<section id="brad-dymaic-component-toggle" class="brad-dymaic-component-toggle brad-rating-form">
  <div id="primary-service" class="brad-bottom-sheet" aria-modal="true" tabindex="-1"></div>
  <div id="secondary-service" class="brad-modal" role="dialog" aria-modal="true" tabindex="-1"></div>
</section>
Copy
```

Caso queira utilizar o side-sheet, seria necessário o container dele, conforme mostrado abaixo:

```
<section id="brad-dymaic-component-toggle" class="brad-dymaic-component-toggle brad-rating-form">
  <div id="primary-service" class="brad-bottom-sheet" aria-modal="true" tabindex="-1"></div>
  <div id="secondary-service" class="brad-side-sheet brad-side-sheet--default above-the-overlay"></div>
</section>
Copy
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do serviço

```
const options = {
  targetSelector: `brad-dymaic-component-toggle`,
  primaryComponentService: new BradBottomSheetService({
    targetSelector: `#primary-service`,
    state: "modal",
  }),
  secondaryComponentService: new BradModalService({
    targetSelector: `#secondary-service`,
  }),
  content: /* HTML */ `<div>Conteúdo inicial aqui.</div>`,
};

const service = LiquidCorp.BradComponentToggleService.getInstance(options);
Copy
```

Se for usar o side-sheet, seria necessário instanciar o serviço correspondente:

```
const options = {
  targetSelector: `brad-component-toggle`,
  primaryComponentService: new BradBottomSheetService({
    targetSelector: `#primary-service`,
    state: "modal",
  }),
  secondaryComponentService: new BradSideSheetService({
    targetSelector: `#secondary-service`,
    state: "default",
  }),
  content: /* HTML */ `<div>Conteúdo inicial aqui.</div>`,
};

const service = LiquidCorp.BradComponentToggleService.getInstance(options);
Copy
```
## Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID ou .classe vinculado ao HTML do componente |
| primaryComponentService | BradBottomSheetService, BradModalService, BradSideSheetService | Não tem valor default, é mandatório escolhe um dos tipos. | Clase do componente que será exibido em primeiro (no menor breakpoint) |
| secondaryComponentService | BradBottomSheetService, BradModalService, BradSideSheetService | Não tem valor default, é mandatório escolhe um dos tipos. | Clase do componente que será exibido em segundo (no maior breakpoint) |
| content | string | "" | É o primeiro conteúdo que será mostrado dentro do componente exibido |
| breakpoint | number | 599 | Valor número que determina breakpoint para troca de componentes |

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| open | N/A | Abre |
| close | N/A | Fecha |
| destroy | N/A | Faz o encerramento de todos os listeners que existem vinculados ao componente instanciado |
| updateContent | N/A | Atualiza o conteúdo interno do componente, normalmente usado para fazer fluxos dentro do conteúdo, e ficar alterando o conteúdo, por exemplo após um botão de próximo |
| resetContent | N/A | Faz o reset do conteúdo interno do componente, voltando para o primeiro conteúdo passado na instância do serviço |

# EventListeners

Lembrando que para o uso dos listeners é necessário passar pelo processo de e :


| Elemento | Método | Evento | Descrição |
| --- | --- | --- | --- |
| service.eContainer | addEventListener | "open" | É disparado sempre que o serviço abre o componente atual |
| service.eContainer | addEventListener | "close" | É disparado sempre que o serviço fecha o componente atual |
| service.eContainer | addEventListener | "componentChange" | É disparado sempre que o serviço mudar de um componente para o outro, conforme o resize da janela |

# Observação Adicional

Assim como no caso dos containers HTML, a abordagem de inicialização do serviço via JavaScript se aplica a qualquer novo componente que seja disponibilizado no futuro. Basta criar uma instância do serviço correspondente ao novo componente.

```
<button
  class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
  onclick="window.LiquidCorp.BradComponentToggleService.open()"
>
  <em><em class="fab-icon i icon-ui-placeholder"></em></em>
</button>

<section id="is-151" class="brad-component-toggle">
   <div
    id="primary-395"
    class="brad-bottom-sheet brad-component-toggle__template"
    aria-modal="true"
    tabindex="-1"
  ></div> <div
    id="secondary-238"
    class="brad-modal brad-component-toggle__template"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  ></div>
</section>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| primaryComponentService | string | - | Choose option... BradBottomSheetService BradModalService BradSideSheetService |
| secondaryComponentService | string | - | Choose option... BradBottomSheetService BradModalService BradSideSheetService |