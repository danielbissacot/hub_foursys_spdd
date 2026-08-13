# Timeline

O componente timeline é usado para exibir eventos em uma ordem cronológica, atrelados a datas específicas. Ele permite visualizar uma série de eventos de maneira intuitiva, navegar e compreender as informações ocorridas nestes eventos, cada um com seu estado correspondente.

# Uso do HTML
```
<div id="brad-timeline" class="brad-timeline">
<div class="brad-timeline__group">
  <div class="brad-timeline__group__item">
    <div class="brad-timeline__info">
      <div aria-label="Dia 31 de dezembro" class="brad-timeline__date">
        <p aria-hidden="true" class="brad-font-title-xl">31</p>
        <small aria-hidden="true" class="brad-font-title-sm">Dez</small>
      </div>
    </div>

    <div class="brad-timeline__line">
      <div class="brad-timeline__line__dot"></div>
      <div class="brad-timeline__line__connecting"></div>
    </div>

    <div class="brad-timeline__content">
      <div class="brad-flex brad-flex-row brad-flex-align-items-end">
        <div class="brad-flex brad-flex-column">
          <h3 class="brad-font-title-sm brad-m-xs-b">Primary Label</h3>
          <p class="brad-font-paragraph-sm">Supporting text</p>
        </div>

        <small
          class="brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l"
          >R$ 00,00</small
        >
      </div>
    </div>
  </div>

</div>
</div>
```
Estilos
Segmentado
```
<div id="timeline" class="brad-timeline brad-timeline--segmented">
  <div class="brad-timeline__group">
    <div
      class="brad-timeline__group__item brad-timeline__group__item--positive">
      <div class="brad-timeline__info">
        <div
          aria-label="Dia 28 de dezembro"
          role="text"
          class="brad-timeline__date"
        >
          <p aria-hidden="true" class="brad-font-title-xl">28</p>
          <small aria-hidden="true" class="brad-font-title-sm">Dez</small>
        </div>
      </div>

      <div class="brad-timeline__line">
        <div class="brad-timeline__line__dot"></div>
        <div class="brad-timeline__line__connecting"></div>
      </div>

      <div class="brad-timeline__content">
        <h3 class="brad-font-title-sm brad-m-xs-b">Primary Label</h3>
        <p class="brad-font-paragraph-sm">
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text.
        </p>
      </div>
    </div>

    <div class="brad-timeline__group__item brad-timeline__group__item">
      <div class="brad-timeline__info">
        <div aria-label="Dia 27 de dezembro" class="brad-timeline__date">
          <p aria-hidden="true" class="brad-font-title-xl">27</p>
          <small aria-hidden="true" class="brad-font-title-sm">Dez</small>
        </div>
      </div>

      <div class="brad-timeline__line">
        <div class="brad-timeline__line__dot"></div>
        <div class="brad-timeline__line__connecting"></div>
      </div>

      <div class="brad-timeline__content">
        <h3 class="brad-font-title-sm brad-m-xs-b">Primary Label</h3>
        <p class="brad-font-paragraph-sm">
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text.
        </p>
      </div>
    </div>
  </div>

  <div class="brad-timeline__group">
    <div
      class="brad-timeline__group__item brad-timeline__group__item--negative"
    >
      <div class="brad-timeline__info">
        <div aria-label="Dia 26 de dezembro" class="brad-timeline__date">
          <p aria-hidden="true" class="brad-font-title-xl">26</p>
          <small aria-hidden="true" class="brad-font-title-sm">Dez</small>
        </div>
      </div>

      <div class="brad-timeline__line">
        <div class="brad-timeline__line__dot"></div>
        <div class="brad-timeline__line__connecting"></div>
      </div>

      <div class="brad-timeline__content">
        <h3 class="brad-font-title-sm brad-m-xs-b">Primary Label</h3>
        <p class="brad-font-paragraph-sm">Supporting text</p>
      </div>
    </div>

    <div
      class="brad-timeline__group__item brad-timeline__group__item--pending"
    >
      <div class="brad-timeline__info">
        <div class="brad-timeline__date">
          <p class="brad-font-title-xl"></p>
          <small class="brad-font-title-sm"></small>
        </div>
      </div>

      <div class="brad-timeline__line">
        <div class="brad-timeline__line__dot"></div>
        <div class="brad-timeline__line__connecting"></div>
      </div>

      <div class="brad-timeline__content">
        <h3 class="brad-font-title-sm brad-m-xs-b">Primary Label</h3>
        <p class="brad-font-paragraph-sm">Supporting text</p>
      </div>
    </div>
  </div>
</div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do Timeline

```
const targetSelector = "#id";
const options = { targetSelector, events: [{ state: "custom", custom: "EXTENDED_PURPLE_DARK" }, { state: "pending" }, { state: "custom", custom: "EXTENDED_SALMON_DARK" }] };
const service = LiquidCorp.BradTimelineService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| events | [{state: string, custom?: string}] | - | É um array que para cada valor dele corresponde ao evento (item) na sequência do HTML, ou seja, o primeiro state vai alterar o primeiro evento (item) no HTML e assim por diante. Caso o array tenha menos objetos que a quantidade de eventos (itens) no HTML, os que sobrarem obterão o estado inicial (enabled). |

## Valores possíveis para os options

| Nome | Valores |
| --- | --- |
| state | "positive", "negative","pending","disabled","enabled", |
| custom | "EXTENDED_BLUE_DARK", "EXTENDED_PURPLE","EXTENDED_PURPLE_DARK","EXTENDED_VIOLET", "EXTENDED_VIOLET_DARK","EXTENDED_SALMON_DARK","EXTENDED_RED_DARK", "NEUTRAL_40","NEUTRAL_50","NEUTRAL_60","NEUTRAL_100", |

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| updateEvents | [{state: string, custom?: string}] | Utilizado para alterar estados de cada evento (item) sequencialmente. Caso o array tenha menos objetos que a quantidade de eventos (itens) no HTML, os que sobrarem obterão o estado inicial (enabled). |
| appendTimelineElement | [{object: object}] ou {object: object} | Adiciona um elemento timeline na última posição, seguir o modelo abaixo* |
| addTimelineElement | {object: object} | Adiciona um elemento timeline na posiçao escolhida |
| updateState | index, state, custom | Altera o status do elemento, deve ser passado sua posição, o novo status e se for do tipo custom, passar o valor de custom |
| updateSegmentedState | groupIndex,elementIndex, state, custom | Altera o status do elemento na variação segmentado, deve ser passado a posiçao do grupo, a posição do elemento timeline, o novo status e se for do tipo custom, passar o valor de custom |
| removeTimelineElement | elementIndex, groupIndex | Remove elementos de timeline, se estiver utilizando o segmentado, passar a posição do elemento e do grupo deste elemento, no modelo default apenas utilizar o primeiro parâmetro com a posição do elemento |
| removeSegmentedGroup | groupIndex | Remove o grupo inteiro no modo segmentado |

# Uso básico
```
const service = LiquidCorp.BradTimelineService.getInstance(options);
service.method();
```
Uso dos métodos
appendTimelineElement Default
```
service.appendTimelineElement(
      {
        state: "custom",
        custom: "EXTENDED_PURPLE_DARK",
        timelineInfo: `
      <div aria-label="Dia 01 de janeiro" role="text" class="brad-timeline__date">
        <p aria-hidden="true" class="brad-font-title-xl">01</p>
        <small aria-hidden="true" class="brad-font-title-sm">Jan</small>
      </div>
      `,
        timelineContent: `
        <div class="brad-flex brad-flex-row brad-flex-align-items-end">
          <div class="brad-flex brad-flex-column">
            <h3 class="brad-font-title-sm brad-m-xs-b">01</h3>
            <p class="brad-font-paragraph-sm">01</p>
          </div>

          <small class="brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l">
            R$ 00,00
          </small>
        </div>
      `,
      }
    );
```
appendTimelineElement Segmented
```
service.appendTimelineElement({
  groupIndex: 0,
  state: "pending",
  timelineInfo: `<div aria-label="Dia 30 de dezembro" class="brad-timeline__date">

  <p aria-hidden="true" class="brad-font-title-xl">30</p>
  <small aria-hidden="true" class="brad-font-title-sm">Dez</small>
  </div>
  `,
  timelineContent: `
  <h3 class="brad-font-title-sm brad-m-xs-b brad-timeline__item__status-text">
    Primary 30
  </h3>

            <p class="brad-font-paragraph-sm">
                Supporting text Supporting text Supporting text Supporting text
                Supporting text Supporting text Supporting text Supporting text
                Supporting text Supporting text Supporting text Supporting text
                Supporting text Supporting text Supporting text Supporting text
                Supporting text Supporting text Supporting text Supporting text
                Supporting text Supporting text Supporting text Supporting text
                Supporting text Supporting text Supporting text Supporting text
                Supporting text Supporting text Supporting text Supporting text
                Supporting text Supporting text Supporting text Supporting text
                Supporting text Supporting text.
            </p>
          `});
```
addTimelineElement Default
```
service.addTimelineElement({
  elementIndex: 2,
  state: "custom",
  custom: "EXTENDED_PURPLE_DARK",
  timelineInfo: `
  <div aria-label="Dia 00 de janeiro" role="text" class="brad-timeline__date">
    <p aria-hidden="true" class="brad-font-title-xl">00</p>
    <small aria-hidden="true" class="brad-font-title-sm">Jan</small>
  </div>
  `,
  timelineContent: `
    <div class="brad-flex brad-flex-row brad-flex-align-items-end">
      <div class="brad-flex brad-flex-column">
        <h3 class="brad-font-title-sm brad-m-xs-b">00</h3>
        <p class="brad-font-paragraph-sm">00</p>
      </div>

      <small class="brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l">
        R$ 00,00
      </small>
    </div>
  `,
});
```
addTimelineElement Segmented
```
service.addTimelineElement({
  groupIndex: 0,
  elementIndex: 1,
  state: "custom",
  custom: "EXTENDED_RED_DARK",
  timelineInfo: `
    <div aria-label="Dia 01 de janeiro" class="brad-timeline__date">
      <p aria-hidden="true" class="brad-font-title-xl">01</p>
      <small aria-hidden="true" class="brad-font-title-sm">Jan</small>
    </div>
    `,
  timelineContent: `
    <h3 class="brad-font-title-sm brad-m-xs-b brad-timeline__item__status-text">
      Primary 01
    </h3>

    <p class="brad-font-paragraph-sm">
        Supporting text Supporting text Supporting text Supporting text
        Supporting text Supporting text Supporting text Supporting text
        Supporting text Supporting text Supporting text Supporting text
        Supporting text Supporting text Supporting text Supporting text
        Supporting text Supporting text Supporting text Supporting text
        Supporting text Supporting text Supporting text Supporting text
        Supporting text Supporting text Supporting text Supporting text
        Supporting text Supporting text Supporting text Supporting text
        Supporting text Supporting text Supporting text Supporting text
        Supporting text Supporting text.
    </p>
  `,
});
```
updateSegmentedState
```
service.updateSegmentedState(0, 1, "custom", "EXTENDED_BLUE_DARK");
```
updateState Default
```
service.updateState(3, "custom", "NEUTRAL_40");
```
removeTimelineElement Default
```
service.removeTimelineElement(1);
```
removeTimelineElement Segmented
```
service.removeTimelineElement(1, 0);
```
## Acessibilidade

Para tornar a timeline mais acessível e melhorar a experiência dos usuários de leitores de tela, podemos sugerir algumas pequenas melhorias conforme a seguir. A principal recomendação é agrupar a data (dia e mês) em um único rótulo acessível utilizando o atributo aria-label para que os leitores de tela leiam a data completa de forma mais natural. Além disso, podemos garantir que os meses estejam por extenso para evitar ambiguidades.

Abaixo está um exemplo de como ajustar o HTML do seu componente timeline para incluir essas melhorias de acessibilidade:

```
<div id="timeline" class="brad-timeline">
<div class="brad-timeline__group">
  <div class="brad-timeline__group__item">
    <div class="brad-timeline__info">
      <div aria-label="Dia 31 de dezembro" class="brad-timeline__date" aria-label="31 de dezembro">
        <!-- Ajuste recomendado para verbalizar por extenso -> aria-label="Dia 31 de dezembro" -->
        <p aria-hidden="true" class="brad-font-title-xl">31</p>
        <!-- Ajuste recomendado para agrupar -> aria-hidden="true" -->
        <small aria-hidden="true" class="brad-font-title-sm">Dez</small>
        <!-- Ajuste recomendado para agrupar -> aria-hidden="true" -->
      </div>
    </div>

    <div class="brad-timeline__line">
      <div class="brad-timeline__line__dot"></div>
      <div class="brad-timeline__line__connecting"></div>
    </div>

    <div class="brad-timeline__content">
      <div class="brad-flex brad-flex-row brad-flex-align-items-end">
        <div class="brad-flex brad-flex-column">
          <h3 class="brad-font-title-sm brad-m-xs-b">Primary Label</h3>
          <p class="brad-font-paragraph-sm">Supporting text</p>
        </div>
        <small class="brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l">R$ 00,00</small>
      </div>
    </div>
  </div>

</div>
</div>
```
## Considerações Adicionais

Meses por extenso: Evitar abreviações nos rótulos acessíveis ajuda na clareza e compreensão para todos os usuários, colocando no aria-label da <div></div> que envolve a data o seguinte padrão aria-label="Dia <dia> de <mês por extenso>". O aria-hidden para agrupamento: O uso do aria-hidden="true" em cada <p></p> e <small></small> de data assegura que os leitores de tela leiam "Dia 31 de dezembro" ao invés de "31" seguido de "Dez".

## Mais detalhes da acessibilidade:

O componente timeline foi desenvolvido com boas práticas de acessibilidade, através de HTML semântico. No entanto, recomendamos ajustes específicos para garantir uma experiência ideal para usuários de leitores de tela.

# Recomendações:

## Agrupar data e verbalizar corretamente:

Utilize o atributo aria-label para verbalizar por extenso o mês, já colocando a data respectiva por extenso no aria-label, garantindo que a data seja lida de forma completa e clara. Utiliza o atributo aria-hidden para agrupar a verbalização colocada no aria-label.

# Exemplo:

```
<div aria-label="31 de dezembro" class="brad-timeline__date">
<p aria-hidden="true" class="brad-font-title-xl">31</p>
<small aria-hidden="true" class="brad-font-title-sm">Dez</small>
</div>
```

Seguindo essas recomendações, você garante que o componente timeline proporciona uma experiência acessível e agradável a todos os usuários, incluindo aqueles que utilizam tecnologias assistivas.

# Observações
Relacionar o status do evento a outros componentes na timeline

Dentro de um evento da timeline, seu status pode ser indicados a outros componentes. Os elementos que podesem receber o status (cor) do evento são:

Texto: Qualquer texto inserido no evento pode receber o status indicado. Só precisa adicionar a clase: brad-timeline__item__status-text no elemento que gostaria que a cor seja alterada;
Exemplos
Timeline
```
<div class="brad-flex brad-m-sm-b">
  <button id="add" class="brad-btn brad-btn-primary brad-m-xs-r">
    Add in custom position
  </button>

  <button id="remove" class="brad-btn brad-btn-primary brad-m-xs-r">
    Remove
  </button>

  <button id="update" class="brad-btn brad-btn-primary">Update</button>
</div>

<div id="timeline-313" class="brad-timeline"><div class="brad-timeline__group">
    <div class="brad-timeline__group__item">
      <div class="brad-timeline__info">
        <div aria-label="Dia 29 de dezembro" class="brad-timeline__date">
          <p aria-hidden="true" class="brad-font-title-xl">29</p>
          <small aria-hidden="true" class="brad-font-title-sm">Dez</small>
        </div>
      </div>

      <div class="brad-timeline__line">
        <div class="brad-timeline__line__dot"></div>
        <div class="brad-timeline__line__connecting"></div>
      </div>

      <div class="brad-timeline__content">
        <div class="brad-flex brad-flex-row brad-flex-align-items-end">
          <div class="brad-flex brad-flex-column">
            <h3 class="brad-font-title-sm brad-m-xs-b">Primary Label</h3>
            <p class="brad-font-paragraph-sm">Supporting text</p>
          </div>

          <small
            class="brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l"
            >R$ 00,00</small
          >
        </div>
      </div>
    </div>
  </div><div class="brad-timeline__group">
    <div class="brad-timeline__group__item">
      <div class="brad-timeline__info">
        <div aria-label="Dia 30 de dezembro" class="brad-timeline__date">
          <p aria-hidden="true" class="brad-font-title-xl">30</p>
          <small aria-hidden="true" class="brad-font-title-sm">Dez</small>
        </div>
      </div>

      <div class="brad-timeline__line">
        <div class="brad-timeline__line__dot"></div>
        <div class="brad-timeline__line__connecting"></div>
      </div>

      <div class="brad-timeline__content">
        <div class="brad-flex brad-flex-row brad-flex-align-items-end">
          <div class="brad-flex brad-flex-column">
            <h3 class="brad-font-title-sm brad-m-xs-b">Primary Label</h3>
            <p class="brad-font-paragraph-sm">Supporting text</p>
          </div>

          <small
            class="brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l"
            >R$ 00,00</small
          >
        </div>
      </div>
    </div>
  </div><div class="brad-timeline__group">
    <div class="brad-timeline__group__item">
      <div class="brad-timeline__info">
        <div aria-label="Dia 31 de dezembro" class="brad-timeline__date">
          <p aria-hidden="true" class="brad-font-title-xl">31</p>
          <small aria-hidden="true" class="brad-font-title-sm">Dez</small>
        </div>
      </div>

      <div class="brad-timeline__line">
        <div class="brad-timeline__line__dot"></div>
        <div class="brad-timeline__line__connecting"></div>
      </div>

      <div class="brad-timeline__content">
        <div class="brad-flex brad-flex-row brad-flex-align-items-end">
          <div class="brad-flex brad-flex-column">
            <h3 class="brad-font-title-sm brad-m-xs-b">Primary Label</h3>
            <p class="brad-font-paragraph-sm">Supporting text</p>
          </div>

          <small
            class="brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l"
            >R$ 00,00</small
          >
        </div>
      </div>
    </div>
  </div></div>
```
Timeline Segmented With Status Modify
```
<div class="brad-flex brad-m-sm-b">
  <button id="add_seg" class="brad-btn brad-btn-primary brad-m-xs-r">
    Add custom position
  </button>

  <button id="remove_seg" class="brad-btn brad-btn-primary brad-m-xs-r">
    Remove
  </button>

  <button id="update_seg" class="brad-btn brad-btn-primary">Update</button>
</div>

<div id="timeline-262" class="brad-timeline brad-timeline--segmented">
  <div class="brad-timeline__group">
    <div
      class="brad-timeline__group__item brad-timeline__group__item--positive"
    >
      <div class="brad-timeline__info">
        <div aria-label="Dia 23 de dezembro" class="brad-timeline__date">
          <p aria-hidden="true" class="brad-font-title-xl">23</p>
          <small aria-hidden="true" class="brad-font-title-sm">Dez</small>
        </div>
      </div>

      <div class="brad-timeline__line">
        <div class="brad-timeline__line__dot"></div>
        <div class="brad-timeline__line__connecting"></div>
      </div>

      <div class="brad-timeline__content">
        <h3 class="brad-font-title-sm brad-m-xs-b">Primary Label</h3>
        <p class="brad-font-paragraph-sm">
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text.
        </p>
      </div>
    </div>

    <div
      class="brad-timeline__group__item brad-timeline__group__item--pending"
    >
      <div class="brad-timeline__info">
        <div aria-label="Dia 22 de dezembro" class="brad-timeline__date">
          <p aria-hidden="true" class="brad-font-title-xl">22</p>
          <small aria-hidden="true" class="brad-font-title-sm">Dez</small>
        </div>
      </div>

      <div class="brad-timeline__line">
        <div class="brad-timeline__line__dot"></div>
        <div class="brad-timeline__line__connecting"></div>
      </div>

      <div class="brad-timeline__content">
        <h3
          class="brad-font-title-sm brad-m-xs-b brad-timeline__item__status-text"
        >
          Primary Label
        </h3>
        <p class="brad-font-paragraph-sm">
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text Supporting text Supporting text
          Supporting text Supporting text.
        </p>
      </div>
    </div>
  </div>
</div>
```