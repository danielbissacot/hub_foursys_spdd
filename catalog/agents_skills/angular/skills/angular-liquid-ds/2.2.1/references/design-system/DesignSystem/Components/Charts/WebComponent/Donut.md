# Chart Donut

Gráfico circular tipo donut, ideal para representar partes de um todo com destaque visual e legenda personalizada. Permite visualização clara de proporções com suporte a legenda interna customizável.

# Uso do Web Component

O Chart Donut é construído através de elementos web components que trabalham em conjunto para criar a visualização de dados.

# Estrutura

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-chart | Componente | Sim | Não | Container principal que gerencia o gráfico |
| brad-chart-container | Sub-componente | Sim | Sim | Container para o canvas do Chart.js |
| brad-chart-inside-legend | Sub-componente | Não | Sim | Container para conteúdo personalizado no centro |

# Propriedades
## brad-chart

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-type | string | - | Obrigatório. Tipo do gráfico. Para Donut, usar "donut" |
| brad-itens | array | - | Obrigatório. Array de objetos com os dados. Ver |
| brad-border | boolean | true | Define se há espaçamento entre os setores do donut |
| brad-legend-type | string | null | Posicionamento da legenda. Ver |
| brad-show-legend-percentage | boolean | true | Exibe porcentagem na legenda |
| brad-show-percentage | boolean | true | Exibe a porcentagem no gráfico (sobre cada segmento do donut) |
| brad-money-in-tooltip | boolean | false | Formata valores como moeda (R$) no tooltip |


Nota: Para converter o array de dados para o formato compatível com o componente, utilize LiquidCorp.defineAttribute(itens).

# Estrutura de Dados

## Cada item do array brad-itens deve conter:


| Campo | Tipo | Obrigatório | Descrição |
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

# Comportamento Javascript
## Inicialização

O Web Component não requer uma instanciação explícita em JavaScript. A própria tag HTML se encarrega de inicializá-lo automaticamente.

# Conversão de Dados

Para converter o array de dados para o formato compatível com o componente, utilize o método LiquidCorp.defineAttribute():

```
const itens = [
{
  valueLabel: "Cheque especial",
  supportingText: "R$ 15.000,00",
  value: 15000,
  color: "brad-color-extended-violet"
},
// ... mais itens
];

// Converte para formato JSON compatível com atributos HTML
const itensJSON = LiquidCorp.defineAttribute(itens);
```
## Acessibilidade

A acessibilidade do gráfico para os leitores de tela são implementadas automaticamente, permitindo a leitura individual por cada seção do gráfico, assim informando os valores e a quantidade atual com relação ao total exibido.

A implementação para a leitura da legenda também é gerada automáticamente, inserido o tabindex para que possa navegar em cada informação da legenda.

O botões de navegação (setas direita e esquerda) possuem o aria-label que podem ser customizados.

O botões de paginação (pagination bullets) são implementadas automaticamente para que os leitores de tela informem as páginas e o total.

# Exemplos
## Donut Básico

## Exemplo mais simples, sem legenda externa:

```
<brad-chart
  brad-itens="[{&quot;valueLabel&quot;:&quot;Cheque especial&quot;,&quot;supportingText&quot;:&quot;R$ 15.000,00&quot;,&quot;value&quot;:15000,&quot;color&quot;:&quot;brad-color-extended-violet&quot;},{&quot;valueLabel&quot;:&quot;Limite de crédito pessoal&quot;,&quot;supportingText&quot;:&quot;R$ 7.500,00&quot;,&quot;value&quot;:7500,&quot;color&quot;:&quot;brad-color-extended-red&quot;},{&quot;valueLabel&quot;:&quot;Cartão de crédito&quot;,&quot;supportingText&quot;:&quot;R$ 7.500,00&quot;,&quot;value&quot;:7500,&quot;color&quot;:&quot;brad-color-extended-purple&quot;}]"
  brad-type="donut"
  
  brad-show-legend-percentage="true"
  brad-show-percentage="true"
  brad-money-in-tooltip="true"
  brad-border="true"
>
  <brad-chart-container style="width: 400px;">
    <brad-chart-inside-legend>
      <p class="brad-font-paragraph-sm">Total</p>
      <p class="brad-font-title-sm">R$30.000,00</p>
    </brad-chart-inside-legend>
  </brad-chart-container>
</brad-chart>
```
```
<brad-chart
brad-type="donut"
brad-itens="${itensJSON}">
<brad-chart-container style="width: 400px;"></brad-chart-container>
</brad-chart>
```
## Donut com Legenda Interna

Utilize o componente <brad-chart-inside-legend> para adicionar conteúdo personalizado no centro do donut:

```
<brad-chart
brad-type="donut"
brad-itens="${itensJSON}"
brad-show-percentage="true"
brad-money-in-tooltip="true">
<brad-chart-container style="width: 400px;">
  <brad-chart-inside-legend>
    <p class="brad-font-paragraph-sm">Total Disponível</p>
    <p class="brad-font-title-sm">R$ 30.000,00</p>
    <p class="brad-font-caption">Atualizado em 01/12/2025</p>
  </brad-chart-inside-legend>
</brad-chart-container>
</brad-chart>
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

const itensJSON = LiquidCorp.defineAttribute(itens);
```
## Donut com Legenda Externa

Posicione a legenda ao lado do gráfico usando brad-legend-type:

```
<brad-chart
brad-type="donut"
brad-itens="${itensJSON}"
brad-legend-type="vertical-right"
brad-show-legend-percentage="true">
<brad-chart-container style="width: 500px;"></brad-chart-container>
</brad-chart>
```
## Donut Sem Espaçamento

Para remover o espaçamento entre setores, utilize brad-border="false":

```
<brad-chart
brad-type="donut"
brad-itens="${itensJSON}"
brad-border="false">
<brad-chart-container style="width: 400px;"></brad-chart-container>
</brad-chart>
```