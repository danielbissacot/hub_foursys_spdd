# Chart Bar
## Breaking Change

O componente charts passou por uma mudança significativa. Para melhorar a performance e reduzir o tamanho do bundle da biblioteca Liquid, removemos todos os bundles externos, incluindo o do chart.js, que é usado internamente pelo charts. Agora, adotamos técnicas de code splitting e lazy loading, fazendo com que o chart.js só seja carregado na primeira vez que o componente for instanciado na navegação.




Por conta disso, o carregamento do chart.js é assíncrono. Isso significa que o uso do componente charts agora requer o uso de Promise ou async/await para garantir que o carregamento e a inicialização estejam completos antes da utilização.




Recomendamos a leitura detalhada da documentação abaixo para entender as novas formas de uso e garantir a correta implementação.

Gráfico de barras simples, disponível nas orientações vertical e horizontal. Ideal para comparar valores entre categorias com suporte a paginação e responsividade automática.

# Uso do HTML

O Chart Bar é construído através de elementos HTML que trabalham em conjunto para criar a visualização de dados.

# Estrutura

| Nome | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| .brad-chart | Container | Sim | Container principal que gerencia o gráfico |
| .chart-container | Container | Sim | Container para o canvas do Chart.js |
| .brad-chart-wrap | Container | Não | Container para paginação (quando utilizada) |

```
<div id="chart" class="brad-chart">
<div class="chart-container">
  <canvas></canvas>
</div>
</div>
```
Comportamento Javascript
Inicialização
Usando async/await
```
const itens = [
{
  valueLabel: "Cheque especial",
  supportingText: "R$ 15.000,00",
  value: 15000,
  color: "brad-color-extended-violet",
},
{
  valueLabel: "Limite de crédito pessoal",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-red",
},
{
  valueLabel: "Cartão de crédito",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-purple",
},
{
  valueLabel: "Outros",
  supportingText: "R$ 2.500,00",
  value: 2500,
  color: "brad-color-extended-violet",
},
];
const options = {
targetSelector: "#chart",
itens: itens,
type: "vertical-bar",
showLegendPercentage: false,
moneyInTooltip: true,
}

const service = await LiquidCorp.BradChartsService.getInstance(options);
```
Usando Promise
```
const itens = [
{
  valueLabel: "Cheque especial",
  supportingText: "R$ 15.000,00",
  value: 15000,
  color: "brad-color-extended-violet",
},
{
  valueLabel: "Limite de crédito pessoal",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-red",
},
{
  valueLabel: "Cartão de crédito",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-purple",
},
{
  valueLabel: "Outros",
  supportingText: "R$ 2.500,00",
  value: 2500,
  color: "brad-color-extended-violet",
},
];
const options = {
targetSelector: "#chart",
itens: itens,
type: "vertical-bar",
showLegendPercentage: false,
moneyInTooltip: true,
}

LiquidCorp.BradChartsService.getInstance(options).then(service => { console.log('Chart inicializado:', service); })
.catch(error => { console.error('Erro ao inicializar chart:', error); });
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos

[Object {}], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| destroy |  | Destrói a instância do serviço selecionado, removendo seu event listener e limpando referências. |
| destroyAllGlobalChartListeners |  | Destrói todos os event listeners e referências da página. |

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | Obrigatório. #ID ou .classe vinculado ao HTML do componente |
| itens | array | - | Obrigatório. Array de objetos com os dados. Ver |
| type | string | - | Obrigatório. Tipo de gráfico: "vertical-bar" ou "horizontal-bar" |
| legendType | string | - | Posicionamento da legenda. Ver |
| showLegendPercentage | boolean | true | Determina se exibe ou não a porcentagem junto a legenda |
| moneyInTooltip | boolean | false | Auxiliar para converter valor para dinheiro (R$) no tooltip |
| customYAxisLabelAlign | boolean | false | Posição customizada da label do eixo Y, ficando acima do próprio eixo na forma horizontal |
| axisLabelAlign | string | 'center' | Alinhamento das label's dos eixos X e Y, podendo ser 'start', 'center' ou 'end' |
| xAxisLabel | string | - | Nome da label do eixo X |
| yAxisLabel | string | - | Nome da label do eixo Y |
| xGridline | string | - | Gridline a partir do eixo X, podendo ser 'dash' ou 'normal' |
| yGridline | string | - | Gridline a partir do eixo Y, podendo ser 'dash' ou 'normal' |
| barWidth | number | 48 | Largura da barra em pixel |
| barRadius | number | - | Arredondamento das bordas superiores da barra em pixel |
| pagination | object | - | Objeto de configuração da paginação. Ver |

# Estrutura de Dados

## Cada item do array itens deve conter:

# Itens

| Nome | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| valueLabel | string | Sim | Nome/rótulo da barra no gráfico |
| value | number | Sim | Valor numérico da barra |
| color | string | Sim | Classe de cor da barra. Ver |
| supportingText | string | Não | Texto adicional exibido na legenda (embaixo do valueLabel) |

```
const itens = [
{
  valueLabel: "Janeiro",
  supportingText: "R$ 15.000,00",
  value: 15000,
  color: "brad-color-extended-violet"
},
{
  valueLabel: "Fevereiro",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-red"
},
{
  valueLabel: "Março",
  supportingText: "R$ 8.500,00",
  value: 8500,
  color: "brad-color-extended-purple"
}
];
```
## Cores Disponíveis

| Cor | Valor | Visualização |
| --- | --- | --- |
| Violet (Cor Primária) | "brad-color-extended-violet" |  |
| Red | "brad-color-extended-red" |  |
| Purple | "brad-color-extended-purple" |  |
| Orange | "brad-color-extended-orange" |  |
| Yellow | "brad-color-extended-yellow" |  |
| Blue | "brad-color-extended-blue" |  |
| Green | "brad-color-extended-green" |  |

# Posicionamento de Legenda

| Valor | Descrição |
| --- | --- |
| horizontal-top | Legenda horizontal posicionada acima do gráfico |
| vertical-top | Legenda vertical posicionada acima do gráfico |
| horizontal-right | Legenda horizontal posicionada à direita |
| vertical-right | Legenda vertical posicionada à direita |
| horizontal-bottom | Legenda horizontal posicionada abaixo do gráfico |
| vertical-bottom | Legenda vertical posicionada abaixo do gráfico |
| horizontal-left | Legenda horizontal posicionada à esquerda |
| vertical-left | Legenda vertical posicionada à esquerda |

# Pagination

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| datasPerView | number | - | Quantidade de dados que serão mostrados por página |
| movesPerView | number | - | Quantidade de dados que serão movidos a cada troca de página |
| startAt | number | - | Index do dado que iniciará aparecendo (primeira posição visível) |

# Paginação

Para situações de muitos dados no gráfico pode se optar para a paginação do gráfico. Para a implementação é necessário adicionar a estrutura HTML abaixo. Ele pode ser posicionado antes do "chart-container" ou depois como no exemplo abaixo. OBS: é necessário ter o "brad-chart-wrap" que ajudará a separar os elementos da paginação em as regras de posicionamento das legendas.

```
<div id="chart" class="brad-chart">
<!--Necessário o wrap-->
<div class="brad-chart-wrap">
  <div class="chart-container">
    <canvas></canvas>
  </div>

  <!-- Navegação e paginação-->
  <div class="brad-flex brad-m-xs-y">
    <button
      class="brad-btn brad-btn-icon brad-btn-icon--on-color left"
      onclick="prevChartPagination()"
    >
      <em class="btn-icon i icon-ui-chevron-left"></em>
    </button>
    <!--Pagination é opcional-->
    <div class="brad-pagination"></div>

    <button
      class="brad-btn brad-btn-icon brad-btn-icon--on-color right"
      onclick="nextChartPagination()"
    >
      <em class="btn-icon i icon-ui-chevron-right"></em>
    </button>
  </div>

</div>
</div>
```

# Funções para a navegação:

# prevPagination()
## nextPagination()

# Exemplo:

```
const itens = [
{
  valueLabel: "Cheque especial",
  supportingText: "R$ 15.000,00",
  value: 15000,
  color: "brad-color-extended-violet",
},
{
  valueLabel: "Limite de crédito pessoal",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-red",
},
{
  valueLabel: "Cartão de crédito",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-purple",
},
{
  valueLabel: "Outros",
  supportingText: "R$ 2.500,00",
  value: 2500,
  color: "brad-color-extended-violet",
},
];
const service = await LiquidCorp.BradChartsService.getInstance(
{
  targetSelector: "#chart",
  itens: itens,
  type: "vertical-bar",
  showLegendPercentage: false,
  moneyInTooltip: true,
  pagination: { datasPerView: 3, movesPerView: 1, startAt: 0 },
}
);
function nextChartPagination() {
service.nextPagination();
}
function prevChartPagination() {
service.prevPagination();
}
```
## Responsividade automática quando utilizado barWidth

Para que as barras não fiquem sobrepostas uma sobre a outra foi criada um método que reorganiza as barras. Isso acontece de duas formas quando o gráfico possui paginação e que não possui. Para que isso funcione a funcionalidade autoResponsive deve ser ativada.

O código abaixo cria um observable que a cada mudança de tamanho do componente canvas do gráfico reorganiza as barras.

```
function resizeGraph() {
/** Busca o elemento do grafico*/
const element = document.querySelector("canvas");
let timer;
let attributeName;
/*_ Verifica se é um grafico horizontal ou vertical_*/
if (type == "vertical-bar") {
  attributeName = "width";
} else {
  attributeName = "height";
}
/*_ Cria um observable, que fica verificando alteração de tamanho do grafico_*/
var observer = new MutationObserver((mutations) => {
if (timer) clearTimeout(timer);

  timer = setTimeout(() => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === attributeName
      ) {
        /** Chama a função que recalcula as barras*/
        window[serviceName].calcThickness(datasPerView);
      }
    });
  }, 200);

});
if (element)
observer.observe(element, {
attributes: true,
attributeOldValue: true,
attributeFilter: [attributeName],
});
}
```
## Com Paginação

O componente verifica ao carregar se as barras estão com a distância mínima entre elas, se não estiver ele reorganiza os elementos e a paginação de forma que as barras não fiquem sobrepostas, mas mantendo o tamanho do barWidth.

# Sem Paginação

O componente verifica se as barras estão com a distância mínima entre elas, se não estiver ele ativa o modo flex nas barras, ou seja, elas irão ajustar seus tamanhos automaticamente ignorando o barWidth passado.

_ Obs: Esse método não substitui as telas criadas pelos designers. Caso o modelo de responsividade criado não esteja igual do automático o desenvolvedor deverá criar a sua própria e não utilizar este modelo._

# Acessibilidade

A acessibilidade do gráfico para os leitores de tela são implementadas automáticamente, permitindo a leitura individual por cada barra do gráfico e informando a quantidade atual com relação ao total exibido.

O botões de navegação (setas direita e esquerda) possuem o aria-label que podem ser customizados.

O botões de paginação (pagination bullets) são implementadas automáticamente para que os leitores de tela informem as páginas e o total.

# Exemplos
## Bar Chart Vertical

## Exemplo básico de gráfico de barras vertical:

```
<div id="brad-chart-411" class="brad-chart">
    <div class="brad-chart-wrap">
      <div class="chart-container" style="height:300px;">
        <canvas></canvas>
      </div>
      <div
        class="brad-flex brad-flex-justify-content-start brad-m-xs-y"
      >
        <button
      tabindex="3"
      aria-label="Ir para página anterior do gráfico"
      class="brad-btn brad-btn-icon brad-btn-icon--on-color left"
      onclick="window['serviceChart_32'].prevPagination()"
    >
      <em class="btn-icon i icon-ui-chevron-left"></em>
    </button>
<div class="brad-pagination"></div>
<button
      tabindex="3"
      aria-label="Ir para próxima página do gráfico"
      class="brad-btn brad-btn-icon brad-btn-icon--on-color right"
      onclick="window['serviceChart_32'].nextPagination()"
    >
      <em class="btn-icon i icon-ui-chevron-right"></em>
    </button>
      </div>
    </div>
  </div>
```
```
<div id="chart" class="brad-chart">
<div class="chart-container">
  <canvas></canvas>
</div>
</div>
```
```
const itens = [
{
  valueLabel: "Cheque especial",
  supportingText: "R$ 15.000,00",
  value: 15000,
  color: "brad-color-extended-violet",
},
{
  valueLabel: "Limite de crédito pessoal",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-red",
},
{
  valueLabel: "Cartão de crédito",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-purple",
},
{
  valueLabel: "Outros",
  supportingText: "R$ 2.500,00",
  value: 2500,
  color: "brad-color-extended-violet",
},
];

const service = await LiquidCorp.BradChartsService.getInstance({
targetSelector: "#chart",
itens: itens,
type: "vertical-bar",
showLegendPercentage: false,
moneyInTooltip: true,
});
```
## Bar Chart Horizontal

Para orientação horizontal, troque o tipo para horizontal-bar:

```
const service = await LiquidCorp.BradChartsService.getInstance({
targetSelector: "#chart",
itens: itens,
type: "horizontal-bar",
xAxisLabel: "Valores (R$)",
yAxisLabel: "Categorias",
moneyInTooltip: true,
});
```
## Bar Chart com Paginação

## Útil quando há muitos dados para exibir de uma só vez:

```
<div id="chart" class="brad-chart">
<div class="brad-chart-wrap">
  <div class="chart-container">
    <canvas></canvas>
  </div>
  <div class="brad-flex brad-m-xs-y">
    <button
      class="brad-btn brad-btn-icon brad-btn-icon--on-color left"
      onclick="prevChartPagination()">
      <em class="btn-icon i icon-ui-chevron-left"></em>
    </button>
    <div class="brad-pagination"></div>
    <button
      class="brad-btn brad-btn-icon brad-btn-icon--on-color right"
      onclick="nextChartPagination()">
      <em class="btn-icon i icon-ui-chevron-right"></em>
    </button>
  </div>
</div>
</div>
```
```
const service = await LiquidCorp.BradChartsService.getInstance({
targetSelector: "#chart",
itens: itens,
type: "vertical-bar",
pagination: {
  datasPerView: 5,
  movesPerView: 2,
  startAt: 0
},
});

function nextChartPagination() {
service.nextPagination();
}

function prevChartPagination() {
service.prevPagination();
}
```