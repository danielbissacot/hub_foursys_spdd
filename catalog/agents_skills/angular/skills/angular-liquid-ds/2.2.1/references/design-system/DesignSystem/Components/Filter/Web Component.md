# Filter

O brad-filter é utilizado para filtrar, ordenar e selecionar conteúdos.

# Uso do Web Component

O Filter web component possui vários componentes que ajudam a construir seu caso de uso. A maior parte dele é construido automaticamente a partir da tag brad-filter.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-filter | Componente | Sim | Não | Agrupa todos os outros componentes do filter |


O Web Component Filter Multi utiliza o badge web component.

# Propriedades
## brad-filter

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | — | Identificador único do filtro. |
| brad-type | "single", "multi" | "single" | Define o modo de funcionamento visual do componente: "single" exibe como se apenas um item estivesse selecionado; "multi" exibe múltiplas seleções e um badge com a contagem. Não realiza seleção real de itens, apenas altera o estado visual. |
| brad-size | "sm", "md", "lg" | "md" | Controla o tamanho do filtro |
| brad-count | number | — | Define o valor exibido no badge do filtro. No tipo "multi", exibe a quantidade de itens selecionados. No tipo "single", se maior que zero, o filtro é considerado selecionado. |
| brad-on-color | boolean | false | Estado de mudança de cor para fundos escuros. |

# Uso do HTML
```
<brad-filter
id="filter"
brad-type="single"
brad-size="md"
brad-count="0"
brad-on-color="false"
>
Filtro
</brad-filter>
```
## Acessibilidade

O comportamento da acessibilidade segue o mesmo do componente HTML, para ver a documentação completa:

# HTML

# Exemplos
Single [sem filtro]
```
<brad-filter
  brad-type="single"
  brad-size="md"
  brad-count="0"
  brad-on-color="false"
  
>
  Label
</brad-filter>
```
Single [com filtro]
```
<brad-filter
  brad-type="single"
  brad-size="md"
  brad-count="1"
  brad-on-color="false"
  
>
  Filter
</brad-filter>
```
Multiple [sem filtros]
```
<brad-filter
  brad-type="multi"
  brad-size="md"
  brad-count="0"
  brad-on-color="false"
  
>
  Filter
</brad-filter>
```
Multiple [com filtros]
```
<brad-filter
  brad-type="multi"
  brad-size="md"
  brad-count="3"
  brad-on-color="false"
  
>
  Filter
</brad-filter>
```