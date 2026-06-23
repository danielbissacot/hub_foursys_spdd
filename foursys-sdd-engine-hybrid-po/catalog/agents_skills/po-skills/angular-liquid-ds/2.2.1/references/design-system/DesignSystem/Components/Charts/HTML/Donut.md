# Chart Donut
## Breaking Change

O componente charts passou por uma mudança significativa. Para melhorar a performance e reduzir o tamanho do bundle da biblioteca Liquid, removemos todos os bundles externos, incluindo o do chart.js, que é usado internamente pelo charts. Agora, adotamos técnicas de code splitting e lazy loading, fazendo com que o chart.js só seja carregado na primeira vez que o componente for instanciado na navegação.




Por conta disso, o carregamento do chart.js é assíncrono. Isso significa que o uso do componente charts agora requer o uso de Promise ou async/await para garantir que o carregamento e a inicialização estejam completos antes da utilização.




Recomendamos a leitura detalhada da documentação abaixo para entender as novas formas de uso e garantir a correta implementação.

Gráfico circular tipo donut, ideal para representar partes de um todo com destaque visual e legenda personalizada. Permite visualização clara de proporções com suporte a legenda interna customizável.

# Uso do HTML

O Chart Donut é construído através de elementos HTML que trabalham em conjunto para criar a visualização de dados.

# Estrutura

| Nome | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| .brad-chart | Container | Sim | Container principal que gerencia o gráfico |
| .chart-container | Container | Sim | Container para o canvas do Chart.js |
| .inside-legend | Container | Não | Container para conteúdo personalizado no centro |

```
<div id="chart" class="brad-chart">
<div class="chart-container">
  <!--inside-legend é opcional-->
  <div class="inside-legend">
    <p class="brad-font-paragraph-sm">Total</p>
    <p class="brad-font-title-sm">R$30.000,00</p>
  </div>
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
];

const service = await LiquidCorp.BradChartsService.getInstance({
targetSelector: "#chart",
itens: itens,
type: "donut",
border: true,
showLegendPercentage: false,
moneyInTooltip: true,
legendType: "vertical-right",
});
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
];

LiquidCorp.BradChartsService.getInstance({
targetSelector: "#chart",
itens: itens,
type: "donut",
border: true,
showLegendPercentage: false,
moneyInTooltip: true,
legendType: "vertical-right",
})
.then(service => {

console.log('Chart inicializado:', service);
})
.catch(error => {
console.error('Erro ao inicializar chart:', error);
});
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

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
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| itens | array | - | Array de objetos contendo os itens que serão computados no gráfico. Ver . |
| type | string | - | Obrigatório. Tipo do gráfico. Para Donut, usar "donut" |
| border | boolean | true | Define se há espaçamento entre os setores do donut |
| legendType | string | null | Posicionamento da legenda. Ver |
| showLegendPercentage | boolean | true | Determina se exibe ou não a porcentagem junto a legenda |
| showPercentage | boolean | true | Exibe a porcentagem no gráfico (sobre cada segmento do donut) |
| moneyInTooltip | boolean | false | Auxiliar para converter valor para dinheiro (R$) no tooltip |

# Estrutura de Dados

## Cada item do array itens deve conter:

# Itens

| Nome | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| valueLabel | string | Sim | Nome/rótulo do setor |
| value | number | Sim | Valor numérico do setor |
| color | string | Sim | Classe de cor do setor. Ver |
| supportingText | string | Não | Texto adicional exibido na legenda |

```
const itens = [
{
  valueLabel: "Cheque especial",
  supportingText: "R$ 15.000,00",
  value: 15000,
  color: "brad-color-extended-violet"
},
{
  valueLabel: "Limite de crédito pessoal",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-red"
},
{
  valueLabel: "Cartão de crédito",
  supportingText: "R$ 7.500,00",
  value: 7500,
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

# Acessibilidade

A acessibilidade do gráfico para os leitores de tela são implementadas automaticamente, permitindo a leitura individual por cada seção do gráfico, assim informando os valores e a quantidade atual com relação ao total exibido.

A implementação para a leitura da legenda também é gerada automáticamente, inserido o tabindex para que possa navegar em cada informação da legenda.

# Exemplos
## Donut Básico

## Exemplo mais simples, sem legenda externa:

```
<div style="width: 100%;">
  <div id="brad-chart-307" class="brad-chart">
    <div class="chart-container" style="width: 400px;">
      <div class="inside-legend">
            <p class="brad-font-paragraph-sm">Total</p>
            <p class="brad-font-title-sm">R$30.000,00</p>
          </div>

      <canvas></canvas>
    </div>
  </div>
</div>
```
```
const itens = [
{
  valueLabel: "Cheque especial",
  supportingText: "R$ 15.000,00",
  value: 15000,
  color: "brad-color-extended-violet"
},
{
  valueLabel: "Limite de crédito pessoal",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-red"
},
{
  valueLabel: "Cartão de crédito",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-purple"
}
];

const service = await LiquidCorp.BradChartsService.getInstance({
targetSelector: "#chart",
itens: itens,
type: "donut",
showLegendPercentage: false,
showPercentage: true,
moneyInTooltip: true,
});
```
## Donut com Legenda Interna

Utilize o elemento `.inside-legend` para adicionar conteúdo personalizado no centro do donut:

```
<div id="chart" class="brad-chart">
<div class="chart-container">
  <div class="inside-legend">
    <p class="brad-font-paragraph-sm">Total Disponível</p>
    <p class="brad-font-title-sm">R$ 30.000,00</p>
    <p class="brad-font-caption">Atualizado em 01/12/2025</p>
  </div>
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
  color: "brad-color-extended-violet"
},
{
  valueLabel: "Limite de crédito pessoal",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-red"
},
{
  valueLabel: "Cartão de crédito",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-purple"
}
];

const service = await LiquidCorp.BradChartsService.getInstance({
targetSelector: "#chart",
itens: itens,
type: "donut",
border: true,
showLegendPercentage: false,
moneyInTooltip: true,
});
```
## Donut com Legenda Externa

## Posicione a legenda ao lado do gráfico usando `legendType`:

```
const itens = [
{
  valueLabel: "Cheque especial",
  supportingText: "R$ 15.000,00",
  value: 15000,
  color: "brad-color-extended-violet"
},
{
  valueLabel: "Limite de crédito pessoal",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-red"
},
{
  valueLabel: "Cartão de crédito",
  supportingText: "R$ 7.500,00",
  value: 7500,
  color: "brad-color-extended-purple"
}
];

const service = await LiquidCorp.BradChartsService.getInstance({
targetSelector: "#chart",
itens: itens,
type: "donut",
legendType: "vertical-right",
showLegendPercentage: true,
moneyInTooltip: true,
});
```