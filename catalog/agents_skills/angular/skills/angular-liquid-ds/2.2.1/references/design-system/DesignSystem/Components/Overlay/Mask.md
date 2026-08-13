# Overlay Mask

Componente de destaque visual utilizado para criar tutoriais passo a passo, evidenciando elementos específicos da interface por meio de uma máscara sobreposta.

# Pré-requisitos
Todos os elementos que serão destacados pela máscara precisam estar completamente carregados no DOM antes de instanciar e iniciar a animação.
Como o serviço utiliza id e idTarget para posicionamento e cálculo da área destacada, garanta que esses elementos existam e estejam renderizados antes da inicialização.
O canvas do overlay (<canvas id="myCanvas" class="brad-overlay">) também deve estar presente no DOM e carregado.
## Templates

O componente Overlay Mask é flexível e pode ser usado com diferentes composições. Confira o template disponível:

# Popover Tutorial
## Documentação

# Exemplo de uso
```
<section class="brad-flex brad-flex-column " brad-aria-hidden-placer>
<button class="brad-btn brad-btn-primary brad-m-sm-r" onclick="LiquidCorp.BradOverlayService.open('target')">Iniciar</button>
<div class="brad-flex brad-flex-justify-content-center brad-m-xl">
  <button class="brad-btn brad-btn-icon " id="target">
    <em class="btn-icon i icon-navigation-home"></em>
  </button>

  <button class="brad-btn brad-btn-icon" id="target2">
    <em class="btn-icon i icon-navigation-home"></em>
  </button>

</div>
<div class="brad-flex">
  <!-- Adicionar classes de z-index alto nos botões-->
  <button class="brad-btn brad-btn-primary brad-m-sm" onclick="LiquidCorp.BradOverlayService.updateTarget('target2')">Próximo</button>
  <button class="brad-btn brad-btn-tertiary brad-m-sm" onclick="LiquidCorp.BradOverlayService.close()">Fechar</button>
</div>
</section>
<canvas id="myCanvas" class="brad-overlay hidden"></canvas>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do overlay

O getInstance tem como parametro padrão o Object , por exemplo {id: "idElemento"}.

OBS: Ao chamar o getInstance novamente pelo mesmo id retornará a mesma instância, sem criar uma nova.

Recomendado chamar removeInstance(id) no momento que for destruido o overlay.

```
const overlayService = LiquidCorp.BradOverlayService.getInstance({
id: "myCanvas",
});
function open(target) {
overlayService.open(target);
}

function updateTarget(target) {
overlayService.updateTarget(target);
}

function close() {
overlayService.close();
}
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo:

[{id: "#idEl1"}, {id: "#idEl2"}, {id: "#idEl3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | "" | ID ou classe do elemento canvas para criar o overlay |
| color | "brad-bg-overlay-40", "brad-bg-overlay-60", "brad-bg-overlay-80" | "brad-bg-overlay-40" | Determina intensidade da cor do overlay |

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao ID do overlay no options, caso a instância já exista ela retornará a mesma instância |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao ID do popopover e do Target passado no options |
| removeInstance | id string | Remove uma instância já criada pelo id especificado, exemplo: "LiquidCorp.BradOverlayService.removeInstance("myId")" |
| updateTarget | idTarget string | Muda o alvo da mascara |
| open | idTarget string | Abrir o overlay |
| close | N/A | Fecha o overlay |
| startProcess | N/A | Força o início do processamento do overlay para atualizar o desenho na tela, pode ser usado na chamada do evento de scroll de um determinado container. |
| destroy | N/A | Remove os event listeners |

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| onOpen | service | Disparado quando o overlay é aberto. Retorna um objeto com target (ID do elemento) e targetElement (referência do elemento DOM). |
| onAnimationComplete | service | Disparado quando a animação de abertura do overlay é concluída. Retorna um objeto com target (ID do elemento) e rect (objeto com propriedades left, top, width, height do highlight). |
| onClose | service | Disparado quando o overlay é fechado. Retorna um objeto com target (ID do último elemento que estava em destaque). |


Como escutar eventos: Todos os eventos devem ser utilizados via callback disponível no serviço. A estrutura de uso é sempre a mesma, mudando apenas o nome do evento e os dados retornados no parâmetro data.

## Exemplo de como usar o callback dos eventos:
```
serviceOverlay = BradOverlayService.getInstance({
    id: "myCanvas",
    color: "brad-bg-overlay-40",
  });

  serviceOverlay
    .onOpen((data) => {
      console.log("Overlay opened:", data);
      // data: { target: string, targetElement: HTMLElement }
      // target: ID do elemento alvo
      // targetElement: Referência do elemento DOM
    })
    .onAnimationComplete((data) => {
      console.log("Overlay animation complete:", data);
      // data: { target: string, rect: { left: number, top: number, width: number, height: number } }
      // target: ID do elemento alvo
      // rect: Objeto com as coordenadas e dimensões do highlight
    })
    .onClose((data) => {
      console.log("Overlay closed:", data);
      // data: { target: string }
      // target: ID do último elemento que estava em destaque
    });
```
## Acessibilidade

Para que o leitor de tela não leia os conteúdos por trás do overlay, basta acrescentar o atributo brad-aria-hidden-placer aos elementos que não devem ser lidos.

No momento que o overlay aparecer, os elementos com o atributo brad-aria-hidden-placer, terão automaticamente aria-hidden="true" assim bloqueando a leitura desses elementos.

E quando overlay desaparecer é removido automaticamente o aria-hidden desses elementos, retornando possibilidade da leitura desses elementos.

OBS: não é necessário colocar o "brad-aria-hidden-placer" em todos os elementos do HTML (pais e filhos), coloque apenas nos pais pricipais, que você achar relevante, e assim todos os filhos desse pai não serão lidos.

# Exemplo
```
<section class="brad-flex brad-flex-column " brad-aria-hidden-placer>
  <button
    class="brad-btn brad-btn-primary brad-m-sm-r"
    onclick="LiquidCorp.BradOverlayService.open('target1-20')"
  >
    Iniciar
  </button>
  <div class="brad-flex brad-flex-justify-content-center brad-m-xl">
    <button class="brad-btn brad-btn-icon brad-m-xs" id="target1-20">
      <em class="btn-icon i icon-navigation-home"></em>
    </button>

    <button class="brad-btn brad-btn-icon brad-m-xs" id="target2-285">
      <em class="btn-icon i icon-navigation-home"></em>
    </button>
  </div>

  <div class="brad-flex">
    <!-- O inline-style é apenas para critério de exemplo no storybook: -->
    <button
      class="brad-btn brad-btn-primary brad-m-sm"
      style="z-index:999; position:relative;"
      onclick="LiquidCorp.BradOverlayService.updateTarget('target2-285')"
    >
      Próximo
    </button>
    <button
      class="brad-btn brad-btn-tertiary brad-m-sm"
      style="z-index:999; position:relative"
      onclick="LiquidCorp.BradOverlayService.close()"
    >
      Fechar
    </button>
  </div>
</section>

<canvas id="bs-115" class="brad-overlay hidden"></canvas>
```