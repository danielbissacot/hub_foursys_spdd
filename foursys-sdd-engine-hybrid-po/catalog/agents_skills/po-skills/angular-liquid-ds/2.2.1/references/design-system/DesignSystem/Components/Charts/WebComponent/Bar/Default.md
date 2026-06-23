# Chart Bar

Gráfico de barras simples, disponível nas orientações vertical e horizontal. Ideal para comparar valores entre categorias com suporte a paginação e responsividade automática.

# Uso do Web Component

O Chart Bar é construído através de elementos web components que trabalham em conjunto para criar a visualização de dados.

# Estrutura

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-chart | Componente | Sim | Não | Container principal que gerencia o gráfico |
| brad-chart-container | Sub-componente | Sim | Sim | Container para o canvas do Chart.js |

# Propriedades
## brad-chart

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-type | string | - | Obrigatório. Tipo do gráfico: "vertical-bar" ou "horizontal-bar" |
| brad-itens | array | - | Obrigatório. Array de objetos com os dados. Ver |
| brad-legend-type | string | null | Posicionamento da legenda. Ver |
| brad-show-legend-percentage | boolean | false | Exibe porcentagem na legenda |
| brad-money-in-tooltip | boolean | false | Formata valores como moeda (R$) no tooltip |
| brad-x-axis-label | string | null | Título do eixo X |
| brad-y-axis-label | string | null | Título do eixo Y |
| brad-custom-y-axis-label-align | boolean | false | Posiciona o label do eixo Y acima do eixo (horizontal) |
| brad-axis-label-align | string | "center" | Alinhamento dos labels dos eixos: "start", "center", "end" |
| brad-x-gridline | string | "dash" | Estilo das linhas do eixo X: "dash", "normal" |
| brad-y-gridline | string | "dash" | Estilo das linhas do eixo Y: "dash", "normal" |
| brad-bar-width | number | 48 | Largura das barras em pixels |
| brad-bar-radius | number | 0 | Arredondamento das bordas superiores (pixels) |
| brad-auto-responsive | boolean | false | Ajuste automático das barras ao redimensionar |
| brad-pagination-datas-per-view | number | - | Quantidade de itens visíveis por página |
| brad-pagination-moves-per-view | number | - | Quantidade de itens movidos por navegação |
| brad-pagination-start-at | number | - | Índice inicial da paginação |
| brad-pagination-dot-elements | boolean | false | Exibir indicadores de página |
| brad-pagination-position | string | "start" | Posição dos controles: "start", "center", "end" |
| brad-navigation-left-label | string | "Anterior" | Texto do botão de navegação à esquerda |
| brad-navigation-right-label | string | "Próximo" | Texto do botão de navegação à direita |


⚠️ Atenção: Para ativar a paginação, brad-pagination-datas-per-view, brad-pagination-moves-per-view e brad-pagination-start-at são obrigatórios.

Nota: Para converter o array de dados para o formato compatível com o componente, utilize LiquidCorp.defineAttribute(itens).

# Estrutura de Dados

## Cada item do array brad-itens deve conter:


| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| valueLabel | string | Sim | Nome/rótulo da barra |
| value | number | Sim | Valor numérico da barra |
| color | string | Sim | Classe de cor da barra. Ver |
| supportingText | string | Não | Texto adicional exibido na legenda |

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
## Inicialização

O Web Component não requer uma instanciação explícita em JavaScript. A própria tag HTML se encarrega de inicializá-lo automaticamente.

# Conversão de Dados

Para converter o array de dados para o formato compatível com o componente, utilize o método LiquidCorp.defineAttribute():

```
const itens = [
{
  valueLabel: "Janeiro",
  supportingText: "R$ 15.000,00",
  value: 15000,
  color: "brad-color-extended-violet"
},
// ... mais itens
];

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
## Barra Vertical

## Exemplo básico de gráfico de barras vertical:

```
<brad-chart
  id="brad-chart-bar-152"
  brad-itens="[{&quot;valueLabel&quot;:&quot;Janeiro&quot;,&quot;supportingText&quot;:&quot;R$ 15.000,00&quot;,&quot;value&quot;:15000,&quot;color&quot;:&quot;brad-color-extended-violet&quot;},{&quot;valueLabel&quot;:&quot;Fevereiro&quot;,&quot;supportingText&quot;:&quot;R$ 7.500,00&quot;,&quot;value&quot;:7500,&quot;color&quot;:&quot;brad-color-extended-red&quot;},{&quot;valueLabel&quot;:&quot;Março&quot;,&quot;supportingText&quot;:&quot;R$ 8.500,00&quot;,&quot;value&quot;:8500,&quot;color&quot;:&quot;brad-color-extended-purple&quot;},{&quot;valueLabel&quot;:&quot;Abril&quot;,&quot;supportingText&quot;:&quot;R$ 9.000,00&quot;,&quot;value&quot;:9000,&quot;color&quot;:&quot;brad-color-extended-salmon&quot;},{&quot;valueLabel&quot;:&quot;Maio&quot;,&quot;supportingText&quot;:&quot;R$ 10.500,00&quot;,&quot;value&quot;:10500,&quot;color&quot;:&quot;brad-color-extended-green&quot;},{&quot;valueLabel&quot;:&quot;Junho&quot;,&quot;supportingText&quot;:&quot;R$ 12.000,00&quot;,&quot;value&quot;:12000,&quot;color&quot;:&quot;brad-color-extended-violet&quot;},{&quot;valueLabel&quot;:&quot;Julho&quot;,&quot;supportingText&quot;:&quot;R$ 11.500,00&quot;,&quot;value&quot;:11500,&quot;color&quot;:&quot;brad-color-extended-red&quot;},{&quot;valueLabel&quot;:&quot;Agosto&quot;,&quot;supportingText&quot;:&quot;R$ 6.500,00&quot;,&quot;value&quot;:6500,&quot;color&quot;:&quot;brad-color-extended-purple&quot;},{&quot;valueLabel&quot;:&quot;Setembro&quot;,&quot;supportingText&quot;:&quot;R$ 6.500,00&quot;,&quot;value&quot;:6500,&quot;color&quot;:&quot;brad-color-extended-green&quot;}]"
  brad-type="horizontal-bar"
  
  brad-show-legend-percentage="true"
  brad-money-in-tooltip="true"
  brad-border="true"
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
brad-type="vertical-bar"
brad-itens="${itensJSON}"
brad-x-axis-label="Meses"
brad-y-axis-label="Valores (R$)"
brad-bar-width="48"
brad-bar-radius="8"
brad-legend-type="vertical-right"
brad-money-in-tooltip="true">
<brad-chart-container style="height: 300px;"></brad-chart-container>
</brad-chart>
```
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

const itensJSON = LiquidCorp.defineAttribute(itens);
```
## Barra Horizontal

Para orientação horizontal, troque o tipo para horizontal-bar:

```
<brad-chart
brad-type="horizontal-bar"
brad-itens="${itensJSON}"
brad-x-axis-label="Valores (R$)"
brad-y-axis-label="Meses"
brad-bar-width="48"
brad-bar-radius="8"
brad-money-in-tooltip="true">
<brad-chart-container style="height: 300px;"></brad-chart-container>
</brad-chart>
```
## Com Paginação

## Útil quando há muitos dados para exibir de uma só vez:

```
<brad-chart
brad-type="vertical-bar"
brad-itens="${itensJSON}"
brad-pagination-datas-per-view="5"
brad-pagination-moves-per-view="2"
brad-pagination-start-at="0"
brad-pagination-dot-elements="true"
brad-pagination-position="center"
brad-navigation-left-label="◄ Anterior"
brad-navigation-right-label="Próximo ►">
<brad-chart-container style="height: 300px;"></brad-chart-container>
</brad-chart>
```