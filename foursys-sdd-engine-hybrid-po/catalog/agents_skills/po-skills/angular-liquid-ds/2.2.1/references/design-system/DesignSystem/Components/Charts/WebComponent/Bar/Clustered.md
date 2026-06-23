# Chart Bar Clustered

Gráfico de barras agrupadas, ideal para comparar múltiplos datasets entre categorias. Cada categoria exibe múltiplas barras lado a lado, facilitando a comparação visual entre os datasets.

# Uso do Web Component

O Chart Bar Clustered é construído através de elementos web components que trabalham em conjunto para criar a visualização de dados agrupados.

# Estrutura

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-chart | Componente | Sim | Não | Container principal que gerencia o gráfico |
| brad-chart-container | Sub-componente | Sim | Sim | Container para o canvas do Chart.js |

# Propriedades
## brad-chart

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-type | string | - | Obrigatório. Tipo: "vertical-bar-chart-clustered" ou "horizontal-bar-chart-clustered" |
| brad-itens | array | - | Obrigatório. Array de datasets. Ver |
| brad-labels | array | - | Obrigatório. Array de labels (categorias do eixo principal) |
| brad-legend-type | string | null | Posicionamento da legenda. Ver |
| brad-show-legend-percentage | boolean | false | Exibe porcentagem na legenda |
| brad-money-in-tooltip | boolean | false | Formata valores como moeda (R$) no tooltip |
| brad-x-axis-label | string | null | Título do eixo X |
| brad-y-axis-label | string | null | Título do eixo Y |
| brad-custom-y-axis-label-align | boolean | false | Posiciona label do eixo Y acima do eixo (horizontal) |
| brad-axis-label-align | string | "center" | Alinhamento dos labels dos eixos: "start", "center", "end" |
| brad-x-gridline | string | "dash" | Estilo das linhas do eixo X: "dash", "normal" |
| brad-y-gridline | string | "dash" | Estilo das linhas do eixo Y: "dash", "normal" |
| brad-bar-width | number | 48 | Largura de cada barra no cluster (pixels) |
| brad-bar-radius | number | 0 | Arredondamento das bordas superiores (pixels) |
| brad-auto-responsive | boolean | false | Ajuste automático das barras ao redimensionar |
| brad-pagination-datas-per-view | number | - | Categorias visíveis por página |
| brad-pagination-moves-per-view | number | - | Categorias movidas por navegação |
| brad-pagination-start-at | number | - | Índice inicial da paginação |
| brad-pagination-dot-elements | boolean | false | Exibir indicadores de página |
| brad-pagination-position | string | "start" | Posição dos controles de paginação: "start", "center", "end" |
| brad-navigation-left-label | string | "Anterior" | Texto do botão de navegação à esquerda |
| brad-navigation-right-label | string | "Próximo" | Texto do botão de navegação à direita |


⚠️ Atenção: Para ativar a paginação, brad-pagination-datas-per-view, brad-pagination-moves-per-view e brad-pagination-start-at são obrigatórios.

Nota: Para converter o array de dados para o formato compatível com o componente, utilize LiquidCorp.defineAttribute(itens).

# Estrutura de Dados

## Cada item do array brad-itens deve conter:


| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| barValueLabel | string | Sim | Nome/rótulo do dataset |
| value | array | Sim | Array de valores numéricos (um por label) |
| color | string | Sim | Classe de cor. Ver |
| supportingText | string | Não | Texto adicional exibido na legenda |


O gráfico Bar Clustered usa uma estrutura específica com arrays de valores e labels separados:

```
// Labels das categorias (eixo principal)
const labels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"];

// Datasets agrupados
const itens = [
{
barValueLabel: "Vendas Online",
supportingText: "Canal de vendas online", // Opcional
value: [150, 200, 300, 360, 300], // Um valor por label
color: "brad-color-extended-blue"
},
{
barValueLabel: "Vendas Loja Física",
supportingText: "Canal de vendas físico",
value: [750, 500, 700, 150, 200],
color: "brad-color-extended-red"
},
{
barValueLabel: "Vendas Telefone",
supportingText: "Canal de vendas telefônico",
value: [350, 500, 700, 150, 200],
color: "brad-color-extended-green"
}
];

// Converter para formato compatível
const labelsJSON = LiquidCorp.defineAttribute(labels);
const itensJSON = LiquidCorp.defineAttribute(itens);
```

⚠️ Importante: O tamanho do array value de cada item deve corresponder ao tamanho do array labels.

# Cores Disponíveis

| Nome | RGBA | Visualização |
| --- | --- | --- |
| brad-color-extended-blue | rgba(59, 105, 255, 1) |  |
| brad-color-extended-purple | rgba(115, 48, 139, 1) |  |
| brad-color-extended-green | rgba(9, 171, 72, 1) |  |
| brad-color-extended-violet | rgba(180, 26, 131, 1) |  |
| brad-color-extended-salmon | rgba(243, 98, 121, 1) |  |
| brad-color-neutral-40 | rgba(109, 110, 113, 1) |  |
| brad-color-extended-red | rgba(225, 23, 63, 1) |  |

# Posicionamento de Legenda

| Valor | Visualização |
| --- | --- |
| horizontal-top | Legenda horizontal no topo |
| vertical-top | Legenda vertical no topo |
| horizontal-right | Legenda horizontal à direita |
| vertical-right | Legenda vertical à direita |
| horizontal-bottom | Legenda horizontal embaixo |
| vertical-bottom | Legenda vertical embaixo |
| horizontal-left | Legenda horizontal à esquerda |
| vertical-left | Legenda vertical à esquerda |

# Comportamento Javascript
## Inicialização

O Web Component não requer uma instanciação explícita em JavaScript. A própria tag HTML se encarrega de inicializá-lo automaticamente.

# Conversão de Dados

Para converter o array de dados para o formato compatível com o componente, utilize o método LiquidCorp.defineAttribute():

```
// Converte para formato JSON compatível com atributos HTML
const itensJSON = LiquidCorp.defineAttribute(itens);
```
## Método whenInitialized

O método whenInitialized() retorna uma Promise que é resolvida quando o componente finaliza sua inicialização. Ele disponibiliza a instância do serviço interno (service) que gerencia o gráfico.

# Uso Básico
```
const chartElement = document.getElementById("my-chart");

chartElement.whenInitialized().then((service) => {
console.log("Gráfico inicializado com sucesso!");
console.log("Serviço disponível:", service);

// O service pode ser armazenado para uso posterior
window.myChartService = service;
});
```
## Detectar Inicialização

Útil quando você precisa executar ações somente após o gráfico estar completamente renderizado:

```
const chartElement = document.getElementById("my-chart");

// Aguardar inicialização antes de executar lógica
chartElement.whenInitialized().then((service) => {
// Agora o gráfico está pronto
console.log("Gráfico pronto para interação");

// Executar ações que dependem do gráfico inicializado
setupCustomInteractions();
loadAdditionalData();
});

function setupCustomInteractions() {
// Sua lógica customizada aqui
}

function loadAdditionalData() {
// Carregar dados adicionais após inicialização
}
```
## Acessibilidade

A acessibilidade do gráfico para os leitores de tela são implementadas automaticamente, permitindo a leitura individual por cada seção do gráfico, assim informando os valores e a quantidade atual com relação ao total exibido.

A implementação para a leitura da legenda também é gerada automáticamente, inserido o tabindex para que possa navegar em cada informação da legenda.

O botões de navegação (setas direita e esquerda) possuem o aria-label que podem ser customizados.

O botões de paginação (pagination bullets) são implementadas automaticamente para que os leitores de tela informem as páginas e o total.

# Exemplos
## Clustered Vertical

## Exemplo básico de gráfico de barras agrupadas vertical:

```
<brad-chart
  id="brad-chart-clustered-353"
  brad-type="vertical-bar-chart-clustered"
  brad-border="true"
  brad-itens="[{&quot;barValueLabel&quot;:&quot;DataSet1&quot;,&quot;supportingText&quot;:&quot;Gastos referentes a DataSet1&quot;,&quot;value&quot;:[150,200,300,360,300],&quot;color&quot;:&quot;brad-color-extended-blue&quot;},{&quot;barValueLabel&quot;:&quot;DataSet2&quot;,&quot;supportingText&quot;:&quot;Gastos referentes ao DataSet2&quot;,&quot;value&quot;:[750,500,700,150,200],&quot;color&quot;:&quot;brad-color-extended-red&quot;},{&quot;barValueLabel&quot;:&quot;DataSet3&quot;,&quot;supportingText&quot;:&quot;Gastos referentes ao DataSet3&quot;,&quot;value&quot;:[350,500,700,150,200],&quot;color&quot;:&quot;brad-color-extended-green&quot;},{&quot;barValueLabel&quot;:&quot;DataSet4&quot;,&quot;supportingText&quot;:&quot;Gastos referentes ao DataSet4&quot;,&quot;value&quot;:[1550,500,700,150,200],&quot;color&quot;:&quot;brad-color-extended-violet&quot;}]"
  brad-labels="[&quot;Janeiro&quot;,&quot;Fevereiro&quot;,&quot;Março&quot;,&quot;Abril&quot;,&quot;Maio&quot;]"
  brad-show-legend-percentage="true"
  brad-money-in-tooltip="true"
  brad-custom-y-axis-label-align="false"
  brad-axis-label-align="center"
  brad-x-axis-label="X Label"
  brad-y-axis-label="Y Label"
  brad-x-gridline="dash"
  brad-y-gridline="dash"
  brad-bar-width="48"
  brad-bar-radius="0"
  brad-auto-responsive="true"
  
  brad-pagination-datas-per-view="3"
  brad-pagination-moves-per-view="1"
  brad-pagination-start-at="0"
  brad-pagination-dot-elements="true"
  brad-pagination-position="start"
  brad-navigation-left-label="Anterior"
  brad-navigation-right-label="Próximo"
  
>
  <brad-chart-container style="height: 300px;"></brad-chart-container>
</brad-chart>
```
```
<brad-chart
brad-type="vertical-bar-chart-clustered"
brad-itens="${itensJSON}"
brad-labels="${labelsJSON}"
brad-x-axis-label="Meses"
brad-y-axis-label="Vendas (R$)"
brad-bar-width="48"
brad-bar-radius="8"
brad-legend-type="horizontal-bottom"
brad-money-in-tooltip="true">
<brad-chart-container style="height: 350px;"></brad-chart-container>
</brad-chart>
```
```
const labels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"];
const itens = [
{
  barValueLabel: "Vendas Online",
  supportingText: "Canal de vendas online",
  value: [150, 200, 300, 360, 300],
  color: "brad-color-extended-blue"
},
{
  barValueLabel: "Vendas Loja Física",
  supportingText: "Canal de vendas físico",
  value: [750, 500, 700, 150, 200],
  color: "brad-color-extended-red"
},
{
  barValueLabel: "Vendas Telefone",
  supportingText: "Canal de vendas telefônico",
  value: [350, 500, 700, 150, 200],
  color: "brad-color-extended-green"
}
];

const labelsJSON = LiquidCorp.defineAttribute(labels);
const itensJSON = LiquidCorp.defineAttribute(itens);
```
## Clustered Horizontal

Para orientação horizontal, troque o tipo para horizontalBarChartClustered:

```
<brad-chart
brad-type="horizontal-bar-chart-clustered"
brad-itens="${itensJSON}"
brad-labels="${labelsJSON}"
brad-x-axis-label="Vendas (R$)"
brad-y-axis-label="Meses"
brad-bar-width="40"
brad-money-in-tooltip="true">
<brad-chart-container style="height: 400px;"></brad-chart-container>
</brad-chart>
```
## Com Paginação

## Útil quando há muitos dados para exibir de uma só vez:

```
<brad-chart
brad-type="vertical-bar-chart-clustered"
brad-itens="${itensJSON}"
brad-labels="${labelsJSON}"
brad-pagination-datas-per-view="3"
brad-pagination-moves-per-view="2"
brad-pagination-start-at="0"
brad-pagination-dot-elements="true"
brad-pagination-position="center"
brad-auto-responsive="true">
<brad-chart-container style="height: 350px;"></brad-chart-container>
</brad-chart>
```