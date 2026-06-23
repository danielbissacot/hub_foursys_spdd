# Timeline

O componente timeline é usado para exibir eventos em uma ordem cronológica, atrelados a datas específicas. Ele permite visualizar uma série de eventos de maneira intuitiva, navegar e compreender as informações ocorridas nestes eventos, cada um com seu estado correspondente.

# Uso do WebComponent
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-timeline | Componente | Sim | Sim | Componente principal da timeline, agrupa todos os outros elementos da timeline de acordo com os atributos definidos. |

# Propriedades

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-is-segmented | boolean | false | Define se o tipo da timeline é "Segmentado" |
| brad-events | {state: string, custom?: string}[] | [] | É um array que para cada valor dele corresponde ao evento (item) na sequência do HTML, ou seja, o primeiro state vai alterar o primeiro evento (item) no HTML e assim por diante. Caso o array tenha menos objetos que a quantidade de eventos (itens) no HTML, os que sobrarem obterão o estado inicial (enabled). |
| brad-timeline-data | {elementIndex?: number, groupIndex?: number, custom?: string, timelineContent: string, timelineInfo: string, state: string}[] | [] | Define os elementos iniciais que serão inseridos no HTML. Obs: Caso exista um "event" com valores de state e custom diferentes no mesmo índice do elemento HTML, será priorizado os valores presentes no event ao renderizar o elemento. |

## Valores disponíveis para state e custom

| Nome | Valores |
| --- | --- |
| state | "positive", "negative","pending","disabled","enabled", |
| custom | "EXTENDED_BLUE_DARK", "EXTENDED_PURPLE","EXTENDED_PURPLE_DARK","EXTENDED_VIOLET", "EXTENDED_VIOLET_DARK","EXTENDED_SALMON_DARK","EXTENDED_RED_DARK", "NEUTRAL_40","NEUTRAL_50","NEUTRAL_60","NEUTRAL_100", |

```
<brad-timeline id="brad-timeline"></brad-timeline>
```
Comportamento Javascript
## Inicialização

A inicialização do serviço do Timeline não é necessária, pois o web component já o instancia nativamente. Porém, será necessário acessar o serviço criado por ele para realizar a chamada dos métodos necessários. Exemplo de como referenciar o serviço instanciado pelo web component:

```
const eTimeline = document.getElementById([ID_DO_TIMELINE]);
const service = eTimeline.service;
```
## Tratamento de Atributos com Objetos ou Arrays

Alguns atributos do componente podem receber objetos ou arrays como valores. No entanto, valores não-escapados podem causar erros ou comportamentos inesperados ao serem inseridos diretamente no HTML. Para garantir a correta passagem desses valores, é necessário convertê-los em uma string JSON escapada. O método LiquidCorp.defineAttribute(object) foi implementado para facilitar esse processo:

# Exemplo de uso
```
const events = [
    {
      state: "custom",
      custom: "EXTENDED_RED_DARK",
    },
  ];
const timelineData = [{
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
    }];
```
```
<brad-timeline
id="[ID_DO_TIMELINE]"
brad-timeline-data="${LiquidCorp.defineAttribute(timelineData)}"
brad-events="${LiquidCorp.defineAttribute(events)}"
></brad-timeline>
```

Alternativamente, caso deseje alterar os atributos utilizando a função setAttribute, podemos fazer da seguinte forma:

```
const eTimeline = document.getElementById([ID_DA_TIMELINE]);
eTimeline.setAttribute("brad-timeline-data", JSON.stringify(timelineData));
eTimeline.setAttribute("brad-events", JSON.stringify(events));
```
## Tratamento de dados utilizando método setter

Também é possível alterar os dados de timelineData e events do webcomponent utilizando um método setter. Dessa forma, evita-se uma visualização poluída do HTML ao trabalhar com um grande volume de dados.

```
const eTimeline = document.getElementById([ID_DA_TIMELINE]);
eTimeline.timelineData = timelineData;
eTimeline.events = events;
```
## Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| updateEvents | [{state: string, custom?: string}] | Utilizado para alterar estados de cada evento (item) sequencialmente. Caso o array tenha menos objetos que a quantidade de eventos (itens) no HTML, os que sobrarem obterão o estado inicial (enabled). |
| appendTimelineElement | [{object: object}] ou {object: object} | Adiciona um elemento timeline na última posição, seguir o modelo abaixo* |
| addTimelineElement | {object: object} | Adiciona um elemento timeline na posiçao escolhida |
| updateState | index, state, custom | Altera o status do elemento, deve ser passado sua posição, o novo status e se for do tipo custom, passar o valor de custom |
| updateSegmentedState | groupIndex,elementIndex, state, custom | Altera o status do elemento na variação segmentado, deve ser passado a posiçao do grupo, a posição do elemento timeline, o novo status e se for do tipo custom, passar o valor de custom |
| removeTimelineElement | elementIndex, groupIndex | Remove elementos de timeline, se estiver utilizando o segmentado, passar a posição do elemento e do grupo deste elemento, no modelo default apenas utilizar o primeiro parâmetro com a posição do elemento |
| removeSegmentedGroup | groupIndex | Remove o grupo inteiro no modo segmentado |

# Uso básico
```
const eTimeline = document.getElementById([ID_DA_TIMELINE]);
const service = eTimeline.service;
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

Abaixo está um exemplo de como ajustar o HTML ao informá-lo para a timeline para incluir essas melhorias de acessibilidade:

```
const timelineData = [{
        state: "positive",
        timelineInfo: `
      <div aria-label="Dia 01 de janeiro" role="text" class="brad-timeline__date">
        <!-- Ajuste recomendado para verbalizar por extenso -> aria-label="Dia 01 de janeiro" -->
        <p aria-hidden="true" class="brad-font-title-xl">01</p>
        <!-- Ajuste recomendado para agrupar -> aria-hidden="true" -->
        <small aria-hidden="true" class="brad-font-title-sm">Jan</small>
        <!-- Ajuste recomendado para agrupar -> aria-hidden="true" -->
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
      }]
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
<brad-timeline
  id="timeline-101"
  brad-events="[{&quot;state&quot;:&quot;custom&quot;,&quot;custom&quot;:&quot;EXTENDED_RED_DARK&quot;}]"
  brad-timeline-data="[{&quot;state&quot;:&quot;custom&quot;,&quot;custom&quot;:&quot;EXTENDED_BLUE_DARK&quot;,&quot;timelineInfo&quot;:&quot;<div aria-label=\&quot;Dia 01 de janeiro\&quot; role=\&quot;text\&quot; class=\&quot;brad-timeline__date\&quot;>\n          <p aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-xl\&quot;>01</p>\n          <small aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-sm\&quot;>Jan</small>\n        </div>&quot;,&quot;timelineContent&quot;:&quot;  <div class=\&quot;brad-flex brad-flex-row brad-flex-align-items-end\&quot;>\n            <div class=\&quot;brad-flex brad-flex-column\&quot;>\n              <h3 class=\&quot;brad-font-title-sm brad-m-xs-b\&quot;>01</h3>\n              <p class=\&quot;brad-font-paragraph-sm\&quot;>01</p>\n            </div>\n\n            <small class=\&quot;brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l\&quot;>\n              R$ 00,00\n            </small>\n          </div>&quot;},{&quot;state&quot;:&quot;custom&quot;,&quot;custom&quot;:&quot;EXTENDED_PURPLE_DARK&quot;,&quot;timelineInfo&quot;:&quot;<div aria-label=\&quot;Dia 01 de janeiro\&quot; role=\&quot;text\&quot; class=\&quot;brad-timeline__date\&quot;>\n          <p aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-xl\&quot;>01</p>\n          <small aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-sm\&quot;>Jan</small>\n        </div>&quot;,&quot;timelineContent&quot;:&quot;  <div class=\&quot;brad-flex brad-flex-row brad-flex-align-items-end\&quot;>\n            <div class=\&quot;brad-flex brad-flex-column\&quot;>\n              <h3 class=\&quot;brad-font-title-sm brad-m-xs-b\&quot;>01</h3>\n              <p class=\&quot;brad-font-paragraph-sm\&quot;>01</p>\n            </div>\n\n            <small class=\&quot;brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l\&quot;>\n              R$ 00,00\n            </small>\n          </div>&quot;},{&quot;state&quot;:&quot;disabled&quot;,&quot;timelineInfo&quot;:&quot;\n          <div aria-label=\&quot;Dia 30 de dezembro\&quot; class=\&quot;brad-timeline__date\&quot;>\n            <p aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-xl\&quot;>30</p>\n            <small aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-sm\&quot;>Dez</small>\n          </div>\n          &quot;,&quot;timelineContent&quot;:&quot;\n          <h3 class=\&quot;brad-font-title-sm brad-m-xs-b brad-timeline__item__status-text\&quot;>\n            Primary 30\n          </h3>\n\n          <p class=\&quot;brad-font-paragraph-sm\&quot;>\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text.\n          </p>\n        &quot;},{&quot;state&quot;:&quot;positive&quot;,&quot;timelineInfo&quot;:&quot;\n        <div aria-label=\&quot;Dia 02 de janeiro\&quot; role=\&quot;text\&quot; class=\&quot;brad-timeline__date\&quot;>\n          <p aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-xl\&quot;>02</p>\n          <small aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-sm\&quot;>Jan</small>\n        </div>\n        &quot;,&quot;timelineContent&quot;:&quot;\n          <div class=\&quot;brad-flex brad-flex-row brad-flex-align-items-end\&quot;>\n            <div class=\&quot;brad-flex brad-flex-column\&quot;>\n              <h3 class=\&quot;brad-font-title-sm brad-m-xs-b\&quot;>02</h3>\n              <p class=\&quot;brad-font-paragraph-sm\&quot;>02</p>\n            </div>\n\n            <small class=\&quot;brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l\&quot;>\n              R$ 00,00\n            </small>\n          </div>\n        &quot;},{&quot;groupIndex&quot;:1,&quot;state&quot;:&quot;positive&quot;,&quot;timelineInfo&quot;:&quot;\n        <div aria-label=\&quot;Dia 03 de janeiro\&quot; role=\&quot;text\&quot; class=\&quot;brad-timeline__date\&quot;>\n          <p aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-xl\&quot;>03</p>\n          <small aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-sm\&quot;>Jan</small>\n        </div>\n        &quot;,&quot;timelineContent&quot;:&quot;\n          <div class=\&quot;brad-flex brad-flex-row brad-flex-align-items-end\&quot;>\n            <div class=\&quot;brad-flex brad-flex-column\&quot;>\n              <h3 class=\&quot;brad-font-title-sm brad-m-xs-b\&quot;>03</h3>\n              <p class=\&quot;brad-font-paragraph-sm\&quot;>03</p>\n            </div>\n\n            <small class=\&quot;brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l\&quot;>\n              R$ 00,00\n            </small>\n          </div>\n        &quot;}]"
></brad-timeline>
```
Timeline Segmented
```
<div class="brad-flex brad-m-sm-b">
  <button id="add_seg" class="brad-btn brad-btn-primary brad-m-xs-r">
    Add in custom position
  </button>

  <button id="remove_seg" class="brad-btn brad-btn-primary brad-m-xs-r">
    Remove
  </button>

  <button id="update_seg" class="brad-btn brad-btn-primary">Update</button>
</div>
<brad-timeline
  id="timeline-273"
  brad-is-segmented
  brad-timeline-data="[{&quot;state&quot;:&quot;custom&quot;,&quot;custom&quot;:&quot;EXTENDED_BLUE_DARK&quot;,&quot;timelineInfo&quot;:&quot;<div aria-label=\&quot;Dia 01 de janeiro\&quot; role=\&quot;text\&quot; class=\&quot;brad-timeline__date\&quot;>\n          <p aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-xl\&quot;>01</p>\n          <small aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-sm\&quot;>Jan</small>\n        </div>&quot;,&quot;timelineContent&quot;:&quot;  <div class=\&quot;brad-flex brad-flex-row brad-flex-align-items-end\&quot;>\n            <div class=\&quot;brad-flex brad-flex-column\&quot;>\n              <h3 class=\&quot;brad-font-title-sm brad-m-xs-b\&quot;>01</h3>\n              <p class=\&quot;brad-font-paragraph-sm\&quot;>01</p>\n            </div>\n\n            <small class=\&quot;brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l\&quot;>\n              R$ 00,00\n            </small>\n          </div>&quot;,&quot;groupIndex&quot;:0},{&quot;state&quot;:&quot;custom&quot;,&quot;custom&quot;:&quot;EXTENDED_PURPLE_DARK&quot;,&quot;timelineInfo&quot;:&quot;<div aria-label=\&quot;Dia 01 de janeiro\&quot; role=\&quot;text\&quot; class=\&quot;brad-timeline__date\&quot;>\n          <p aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-xl\&quot;>01</p>\n          <small aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-sm\&quot;>Jan</small>\n        </div>&quot;,&quot;timelineContent&quot;:&quot;  <div class=\&quot;brad-flex brad-flex-row brad-flex-align-items-end\&quot;>\n            <div class=\&quot;brad-flex brad-flex-column\&quot;>\n              <h3 class=\&quot;brad-font-title-sm brad-m-xs-b\&quot;>01</h3>\n              <p class=\&quot;brad-font-paragraph-sm\&quot;>01</p>\n            </div>\n\n            <small class=\&quot;brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l\&quot;>\n              R$ 00,00\n            </small>\n          </div>&quot;,&quot;groupIndex&quot;:1},{&quot;state&quot;:&quot;disabled&quot;,&quot;timelineInfo&quot;:&quot;\n          <div aria-label=\&quot;Dia 30 de dezembro\&quot; class=\&quot;brad-timeline__date\&quot;>\n            <p aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-xl\&quot;>30</p>\n            <small aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-sm\&quot;>Dez</small>\n          </div>\n          &quot;,&quot;timelineContent&quot;:&quot;\n          <h3 class=\&quot;brad-font-title-sm brad-m-xs-b brad-timeline__item__status-text\&quot;>\n            Primary 30\n          </h3>\n\n          <p class=\&quot;brad-font-paragraph-sm\&quot;>\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text Supporting text Supporting text\n              Supporting text Supporting text.\n          </p>\n        &quot;,&quot;groupIndex&quot;:0},{&quot;state&quot;:&quot;positive&quot;,&quot;timelineInfo&quot;:&quot;\n        <div aria-label=\&quot;Dia 02 de janeiro\&quot; role=\&quot;text\&quot; class=\&quot;brad-timeline__date\&quot;>\n          <p aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-xl\&quot;>02</p>\n          <small aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-sm\&quot;>Jan</small>\n        </div>\n        &quot;,&quot;timelineContent&quot;:&quot;\n          <div class=\&quot;brad-flex brad-flex-row brad-flex-align-items-end\&quot;>\n            <div class=\&quot;brad-flex brad-flex-column\&quot;>\n              <h3 class=\&quot;brad-font-title-sm brad-m-xs-b\&quot;>02</h3>\n              <p class=\&quot;brad-font-paragraph-sm\&quot;>02</p>\n            </div>\n\n            <small class=\&quot;brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l\&quot;>\n              R$ 00,00\n            </small>\n          </div>\n        &quot;,&quot;groupIndex&quot;:1},{&quot;groupIndex&quot;:1,&quot;state&quot;:&quot;positive&quot;,&quot;timelineInfo&quot;:&quot;\n        <div aria-label=\&quot;Dia 03 de janeiro\&quot; role=\&quot;text\&quot; class=\&quot;brad-timeline__date\&quot;>\n          <p aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-xl\&quot;>03</p>\n          <small aria-hidden=\&quot;true\&quot; class=\&quot;brad-font-title-sm\&quot;>Jan</small>\n        </div>\n        &quot;,&quot;timelineContent&quot;:&quot;\n          <div class=\&quot;brad-flex brad-flex-row brad-flex-align-items-end\&quot;>\n            <div class=\&quot;brad-flex brad-flex-column\&quot;>\n              <h3 class=\&quot;brad-font-title-sm brad-m-xs-b\&quot;>03</h3>\n              <p class=\&quot;brad-font-paragraph-sm\&quot;>03</p>\n            </div>\n\n            <small class=\&quot;brad-timeline__item__status-text brad-font-paragraph-sm brad-m-xl-l\&quot;>\n              R$ 00,00\n            </small>\n          </div>\n        &quot;}]"
  brad-events="[{&quot;state&quot;:&quot;custom&quot;,&quot;custom&quot;:&quot;EXTENDED_RED_DARK&quot;}]"
></brad-timeline>
```