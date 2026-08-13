# Rating

O componente Rating permite que os respondentes avaliem uma afirmação com uma escala visual de estrelas + label.

# Uso do Web Component

O Rating web component permite construir interfaces de avaliação de forma simples e acessível.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-rating | Componente | Sim | Sim | Componente principal que gerencia as avaliações |

# Propriedades
## brad-rating

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Identificador único necessário para o funcionamento do componente |
| brad-ratings | string[] | ["Muito insatisfeito", "Insatisfeito", "Neutro", "Satisfeito", "Muito satisfeito"] | Lista de strings com as avaliações. Para cada string, um novo botão de rating será criado. A quantidade de botões é determinada pela quantidade de strings na lista |
| brad-current-value | number | undefined | Valor atual da avaliação selecionada |
| brad-show-text | boolean | true | Define se o texto de rating será exibido. Quando false, o texto fica invisível |
| brad-accessibility | string[] | [] | Array de strings que complementa a etiqueta aria-label padrão de cada elemento. Cada item do array corresponde ao item de ratings com o mesmo índice, fornecendo informações adicionais para melhorar a acessibilidade do elemento correspondente. Essa abordagem garante uma experiência de usuário mais abrangente e adaptável |
| brad-disabled | boolean | false | Define se o componente está habilitado ou desabilitado |

# Comportamento Javascript
## Inicialização

A inicialização não é necessária. Porém, para atribuir ou alterar atributos com objetos ou arrays, é necessário utilizar um método de tratamento, como no caso de brad-ratings e brad-accessibility.

# Por que isso é necessário?

Ao passar objetos ou arrays diretamente como valores de atributo no HTML, a ausência de escape adequado pode gerar problemas de parsing no navegador. Esse tratamento evita esses problemas, garantindo que os dados sejam interpretados corretamente.

Lembre-se de sempre usar o método LiquidCorp.defineAttribute(object) ao lidar com atributos que precisam receber objetos ou arrays como valores.

## Tratamento de Atributos com Objetos ou Arrays

Alguns atributos do componente podem receber objetos ou arrays como valores. No entanto, valores não escapados podem causar erros ou comportamentos inesperados ao serem inseridos diretamente no HTML.

Para garantir a correta passagem desses valores, é necessário convertê-los em uma string JSON escapada. O método LiquidCorp.defineAttribute(object) foi implementado para facilitar esse processo:

# Exemplo de Uso
```
const accessibility = ["Excelente", "Bom", "Razoável"];
```
```
<brad-rating
id="rating"
brad-accessibility="${LiquidCorp.defineAttribute(accessibility)}"
></brad-rating>
```

Se preferir escrever diretamente no HTML, use aspas duplas para strings dentro do array e aspas simples em volta de todo o array:

```
<brad-rating id="rating" brad-ratings='["Excelente", "Bom", "Razoável"]'></brad-rating>
```

Ou altere via JavaScript usando getters/setters dos atributos em camelCase.

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| rated | brad-rating | Evento disparado ao interagir com as estrelas. |

# Acessibilidade

O componente Rating do Design System Liquid foi desenvolvido de forma que seu service o torna dinâmico e adaptável às necessidades do usuário e às demandas do contexto de uso. Além disso, o padrão de acessibilidade está integrado desde o início, garantindo uma experiência inclusiva e acessível.

Para assegurar a acessibilidade, cada rating é composto por um conjunto de elementos que seguem um padrão não personalizável de aria-label, estruturado da seguinte forma: "Botão [botão atual] de [quantidade total de botões], [label do rating], [estado do rating], [estado da avaliação], [ação para interagir].

O [botão atual] de [quantidade total de botões] representa a posição atual do botão dentro do conjunto total de botões.

A [label do rating] descreve a classificação associada ao rating, como por exemplo, Muito insatisfeito.

O [estado do rating] indica se o rating está selecionado ou não. Caso não esteja selecionado, exibe "não selecionado".

O [estado da avaliação] indica se há uma avaliação selecionada atualmente. Se não houver nenhuma avaliação, exibe nenhuma avaliação selecionada.

A [ação para interagir] sugere a ação necessária para interagir com o rating, como clique duas vezes para selecionar.

Esse padrão varia de acordo com o botão atual, a quantidade total de botões, a label do rating, o estado do rating, o estado da avaliação e a ação para interagir.

O atributo accessibility do componente pode conter um complemento para cada rating, oferecendo informações adicionais para melhorar a acessibilidade e a compreensão do usuário.

# Exemplos
Default
```
<brad-rating
  brad-ratings="[&quot;Muito insatisfeito&quot;,&quot;Insatisfeito&quot;,&quot;Neutro&quot;,&quot;Satisfeito&quot;,&quot;Muito satisfeito&quot;]"
  
  brad-size="lg"
   brad-show-text
  brad-accessibility="[&quot;&quot;]"
  
></brad-rating>
```