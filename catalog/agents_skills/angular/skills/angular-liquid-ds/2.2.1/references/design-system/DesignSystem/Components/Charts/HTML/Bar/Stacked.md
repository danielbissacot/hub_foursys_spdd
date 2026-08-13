# Bar Chart Stacked
## Breaking Change

O componente charts passou por uma mudança significativa. Para melhorar a performance e reduzir o tamanho do bundle da biblioteca Liquid, removemos todos os bundles externos, incluindo o do chart.js, que é usado internamente pelo charts. Agora, adotamos técnicas de code splitting e lazy loading, fazendo com que o chart.js só seja carregado na primeira vez que o componente for instanciado na navegação.




Por conta disso, o carregamento do chart.js é assíncrono. Isso significa que o uso do componente charts agora requer o uso de Promise ou async/await para garantir que o carregamento e a inicialização estejam completos antes da utilização.




Recomendamos a leitura detalhada da documentação abaixo para entender as novas formas de uso e garantir a correta implementação.

Gráfico de barras empilhadas, ideal para mostrar a composição de diferentes categorias em relação a um total. Disponível nas orientações vertical e horizontal.

# Uso do HTML

O Chart Bar Stacked é construído através de elementos HTML que trabalham em conjunto para criar a visualização de dados empilhados.

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
const labels = ["Janeiro", "Fevereiro", "Março"];
const itens = [
{
  barValueLabel: "DataSet1",
  supportingText: "Gastos referentes a DataSet1",
  value: [150, 200, 100],
  color: "brad-color-extended-blue",
},
{
  barValueLabel: "DataSet2",
  supportingText: "Gastos referentes ao DataSet2",
  value: [750, 500, 300],
  color: "brad-color-extended-red",
},
{
  barValueLabel: "DataSet3",
  supportingText: "Gastos referentes ao DataSet3",
  value: [200, 650, 150],
  color: "brad-color-extended-green",
}
];

const options = {
labels: labels,
targetSelector: "#chart",
itens: itens,
type: "vertical-bar-chart-stacked",
showLegendPercentage: false,
moneyInTooltip: true,
}

const service = await LiquidCorp.BradChartsService.getInstance(options);
```
Usando Promise
```
const labels = ["Janeiro", "Fevereiro", "Março"];
const itens = [
{
  barValueLabel: "DataSet1",
  supportingText: "Gastos referentes a DataSet1",
  value: [150, 200, 100],
  color: "brad-color-extended-blue",
},
{
  barValueLabel: "DataSet2",
  supportingText: "Gastos referentes ao DataSet2",
  value: [750, 500, 300],
  color: "brad-color-extended-red",
},
{
  barValueLabel: "DataSet3",
  supportingText: "Gastos referentes ao DataSet3",
  value: [200, 650, 150],
  color: "brad-color-extended-green",
}
];

const options = {
labels: labels,
targetSelector: "#chart",
itens: itens,
type: "vertical-bar-chart-stacked",
showLegendPercentage: false,
moneyInTooltip: true,
}

LiquidCorp.BradChartsService.getInstance(options)
.then(service => { console.log('Chart inicializado:', service); })
.catch(error => { console.error('Erro ao inicializar chart:', error); });
```
## Metódos

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
| labels | array | - | Obrigatório. Array de strings com as categorias do eixo principal. Ver |
| itens | array | - | Obrigatório. Array de datasets com os dados. Ver |
| type | string | - | Obrigatório. Tipo: "vertical-bar-chart-stacked" ou "horizontal-bar-chart-stacked" |
| legendType | string | - | Posicionamento da legenda. Ver |
| showLegendPercentage | boolean | true | Determina se exibe ou não a porcentagem junto a legenda |
| moneyInTooltip | boolean | false | Auxiliar para converter valor para dinheiro (R$) no tooltip |
| customYAxisLabelAlign | boolean | false | Posição customizada da label do eixo Y, ficando acima do próprio eixo na forma horizontal |
| axisLabelAlign | string | 'center' | Alinhamento das label's dos eixos X e Y, podendo ser 'start', 'center' ou 'end' |
| xAxisLabel | string | - | Nome da label do eixo X |
| yAxisLabel | string | - | Nome da label do eixo Y |
| xGridline | string | - | Gridline a partir do eixo X, podendo ser 'dash' ou 'normal' |
| yGridline | string | - | Gridline a partir do eixo Y, podendo ser 'dash' ou 'normal' |
| barWidth | number | 48 | Largura da barra empilhada (pixels) |
| barRadius | number | - | Arredondamento das bordas superiores da barra em pixel |
| pagination | object | - | Objeto de configuração da paginação. Ver |

# Estrutura de Dados

O gráfico Bar Stacked usa uma estrutura específica com arrays de valores e labels separados.

# Axis Labels

Array que contém todos o títulos do agrupamento das barras.

```
const labels = ["Janeiro", "Fevereiro", "Março"];
```
## Itens

Cada item do array itens representa um dataset (segmento empilhado):


| Nome | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| barValueLabel | string | Sim | Nome/rótulo do dataset na legenda |
| value | Array<number> | Sim | Array de valores numéricos (um por label, mesmo tamanho do ) |
| color | string | Sim | Classe de cor do dataset. Ver |
| supportingText | string | Não | Texto adicional exibido na legenda (embaixo do barValueLabel) |

```
const labels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"];

const itens = [
{
barValueLabel: "Receita Operacional",
supportingText: "Receita de operações",
value: [150, 200, 100, 250, 300],
color: "brad-color-extended-blue",
},
{
barValueLabel: "Receita Financeira",
supportingText: "Receita de investimentos",
value: [750, 500, 300, 450, 200],
color: "brad-color-extended-red",
},
{
barValueLabel: "Outras Receitas",
supportingText: "Receitas diversas",
value: [200, 650, 150, 500, 100],
color: "brad-color-extended-green",
}
];
```

⚠️ Importante: O tamanho do array value de cada item deve corresponder ao tamanho do array labels.

# Cores Disponíveis

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
| datasPerView | number | - | Quantidade de categorias que serão mostradas por página |
| movesPerView | number | - | Quantidade de categorias que serão movidas a cada troca de página |
| startAt | number | - | Index da categoria que iniciará aparecendo (primeira posição visível) |

# Paginação

Para situações de muitos dados no gráfico pode se optar para a paginação do gráfico. Para a implementação é necessário adicionar a estrutura HTML abaixo.

```
<div id="chart" class="brad-chart">
<div class="brad-chart-wrap">
  <div class="chart-container">
    <canvas></canvas>
  </div>

  <div class="brad-flex brad-m-xs-y">
    <button
      class="brad-btn brad-btn-icon brad-btn-icon--on-color left"
      onclick="prevChartPagination()"
    >
      <em class="btn-icon i icon-ui-chevron-left"></em>
    </button>
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

No javascript teremos o seguinte parâmetro no options chamado "pagination" nele é passado um objeto com as seguintes chaves:

datasPerView : determina a quantidade de dados que será mostrado por página
movesPerView : determina quantos dados será movimentado a cada troca de página
startAt: determina o index do dado que iniciará mostrando
```
const labels = ["Janeiro", "Fevereiro", "Março"];
const itens = [
{
  barValueLabel: "DataSet1",
  supportingText: "Gastos referentes a DataSet1",
  value: [150, 200, 100],
  color: "brad-color-extended-blue",
},
{
  barValueLabel: "DataSet2",
  supportingText: "Gastos referentes ao DataSet2",
  value: [750, 500, 300],
  color: "brad-color-extended-red",
},
{
  barValueLabel: "DataSet3",
  supportingText: "Gastos referentes ao DataSet3",
  value: [200, 650, 150],
  color: "brad-color-extended-green",
}
];

const options = {
labels: labels,
targetSelector: "#chart",
itens: itens,
type: "vertical-bar-chart-stacked",
showLegendPercentage: false,
moneyInTooltip: true,
pagination: { datasPerView: 3, movesPerView: 1, startAt: 0 },
}

const service = await LiquidCorp.BradChartsService.getInstance(options);

function nextChartPagination() {
service.nextPagination();
}

function prevChartPagination() {
service.prevPagination();
}
```
## Responsividade automática quando utilizado barWidth

Para que as barras empilhadas não fiquem sobrepostas foi criado um método que reorganiza as barras. Para que isso funcione a funcionalidade autoResponsive deve ser ativada.

# Com Paginação

O componente verifica ao carregar se as barras estão com a distância mínima entre as labels, se não estiver ele reorganiza os elementos e a paginação de forma que as barras não fiquem sobrepostas, mas mantendo o tamanho do barWidth.

# Sem Paginação

O componente verifica se o gráfico está com uma distância minima entre as labels, se não estiver ele ativa o modo flex nas barras, ou seja, elas irão ajustar seus tamanhos automaticamente ignorando o barWidth passado.

# Acessibilidade

A acessibilidade do gráfico para os leitores de tela são implementadas automáticamente, permitindo a leitura individual por cada barra do gráfico e informando a quantidade atual com relação ao total exibido.

O botões de navegação (setas direita e esquerda) possuem o aria-label que podem ser customizados.

O botões de paginação (pagination bullets) são implementadas automáticamente para que os leitores de tela informem as páginas e o total.

# Exemplos
## Bar Chart Stacked Vertical

## Exemplo básico de gráfico de barras empilhadas vertical:

```
<div id="brad-chart-123" class="brad-chart">
      <div class="brad-chart-wrap">
        <div class="chart-container" style="height:400px;">
          <canvas></canvas>
        </div>
        <div
          class="brad-flex brad-flex-justify-content-start brad-m-xs-y"
        >
          <button
      tabindex="3"
      aria-label="Ir para página anterior do gráfico"
      class="brad-btn brad-btn-icon brad-btn-icon--on-color left"
      onclick="window['serviceChart_142'].prevPagination()"
    >
      <em class="btn-icon i icon-ui-chevron-left"></em>
    </button>
<div class="brad-pagination"></div>
<button
      tabindex="3"
      aria-label="Ir para próxima página do gráfico"
      class="brad-btn brad-btn-icon brad-btn-icon--on-color right"
      onclick="window['serviceChart_142'].nextPagination()"
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
const labels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"];

const itens = [
{
barValueLabel: "Receita Operacional",
supportingText: "Receita de operações",
value: [150, 200, 100, 250, 300],
color: "brad-color-extended-blue",
},
{
barValueLabel: "Receita Financeira",
supportingText: "Receita de investimentos",
value: [750, 500, 300, 450, 200],
color: "brad-color-extended-red",
},
{
barValueLabel: "Outras Receitas",
supportingText: "Receitas diversas",
value: [200, 650, 150, 500, 100],
color: "brad-color-extended-green",
}
];

const service = await LiquidCorp.BradChartsService.getInstance({
labels: labels,
targetSelector: "#chart",
itens: itens,
type: "vertical-bar-chart-stacked",
showLegendPercentage: false,
moneyInTooltip: true,
});
```
## Bar Chart Stacked Horizontal

Para orientação horizontal, troque o tipo para horizontal-bar-chart-stacked:

```
<div id="brad-chart-405" class="brad-chart">
      <div class="brad-chart-wrap">
        <div class="chart-container" style="height:400px;">
          <canvas></canvas>
        </div>
        <div
          class="brad-flex brad-flex-justify-content-start brad-m-xs-y"
        >
          


        </div>
      </div>
    </div>
```
```
const service = await LiquidCorp.BradChartsService.getInstance({
labels: labels,
targetSelector: "#chart",
itens: itens,
type: "horizontal-bar-chart-stacked",
xAxisLabel: "Receita Total (R$)",
yAxisLabel: "Meses",
moneyInTooltip: true,
});
```
## Bar Chart Stacked com Paginação

## Útil quando há muitas categorias para exibir de uma só vez:

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
labels: labels,
targetSelector: "#chart",
itens: itens,
type: "vertical-bar-chart-stacked",
pagination: {
  datasPerView: 3,
  movesPerView: 1,
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