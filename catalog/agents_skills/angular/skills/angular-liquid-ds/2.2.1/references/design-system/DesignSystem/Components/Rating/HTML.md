# Rating
## Alteração na acessibilidade do componente Rating

O seletor ".brad-rating__accessibility" foi depreciado e não deve mais ser utilizado, pois está causando problemas de acessibilidade duplicada e incorreta.




Esse seletor será removido em uma versão futura. Atualize seu código o quanto antes para evitar impactos na experiência de usuários com tecnologias assistivas.

O componente Rating permite que os usuários avaliem uma afirmação utilizando uma escala visual de estrelas com label.

# Uso do HTML
```
<div id="rating" class="brad-rating"></div>
```
Comportamento Javascript
## Inicialização

## Inicialização dos elementos do Rating

```
const targetSelector = "#rating";
const options = {
  targetSelector,
  ratings: [
    "Muito insatisfeito",
    "Insatisfeito",
    "Neutro",
    "Satisfeito",
    "Muito satisfeito",
  ],
  showTextRating: true,
};

const service = LiquidCorp.BradRatingService.getInstance(options);
```
## getInstances

O método getInstances deve ser usado quando há necessidade de criar mais de uma instância de um componente. Ele retorna um array de instâncias para cada elemento. Basta passar no parâmetro um array de objetos [Object ], por exemplo: [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| ratings | string[] | ["Muito insatisfeito", "Insatisfeito", "Neutro", "Satisfeito", "Muito satisfeito"] | Lista de strings com as avaliações. Para cada avaliação, um novo botão de rating será criado. A quantidade de botões é determinada pela quantidade de strings passadas na lista |
| showTextRating | boolean | true | Se 'true', mostrará o texto de rating; caso contrário, o texto ficará invisível |
| accessibility | string[] | [] | Array de strings que complementa a etiqueta aria-label padrão de cada elemento. Cada item desse array corresponde ao item do ratings com o mesmo índice. Isso significa que cada string no array accessibility fornece informações adicionais para melhorar a acessibilidade do elemento correspondente no ratings. Essa abordagem ajuda a garantir uma experiência de usuário mais abrangente e adaptável. |

# Métodos

Para o uso dos métodos, é necessário seguir os processos de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML relacionado ao #ID ou .classe passado no options. |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML relacionado ao #ID ou .classe passado no options. |
| getCurrentRating | - | Obtém objeto com o valor numérico do rating atual e o texto equivalente. |
| setRating | number | Usado como alternativa à interação do usuário para determinar o nível da avaliação selecionada. |
| enabled | boolean | Habilita a interação com o componente. |
| disabled | boolean | Desabilita a interação com o componente. |

# Uso Básico
```
const service = LiquidCorp.BradRatingService.getInstance(options);

/** Exemplo de uso para obter o valor da avaliação logo após ser selecionada **/
service.eRating.addEventListener("rated", (event) => {
const ratingDetail = event.detail;
});
```
## Acessibilidade

O componente Rating do Design System Liquid foi desenvolvido de maneira que seu service o torna dinâmico e adaptável às necessidades do usuário e às demandas do contexto de uso. Além disso, o padrão de acessibilidade está intimamente acoplado a ele, garantindo uma experiência de usuário inclusiva e acessível desde o início.

Para assegurar a acessibilidade, cada rating é composto por um conjunto de elementos que seguem um padrão não personalizável de aria-label, estruturado da seguinte forma: "Botão [botão atual] de [quantidade total de botões], [label do rating], [estado do rating], [estado da avaliação], [ação para interagir]".

O [botão atual] de [quantidade total de botões] representa a posição atual do botão dentro do conjunto total de botões.

A [label do rating] descreve a classificação associada ao rating, como por exemplo Muito insatisfeito.

O [estado do rating] indica se o rating está selecionado ou não. No caso de não estar selecionado, seria "não selecionado".

O [estado da avaliação] indica se há uma avaliação selecionada atualmente. Se não houver nenhuma avaliação selecionada, seria nenhuma avaliação selecionada.

A [ação para interagir] sugere a ação necessária para interagir com o rating, como clique duas vezes para selecionar.

Esse padrão pode variar de acordo com o botão atual, a quantidade total de botões, a label do rating, o estado do rating, o estado da avaliação e a ação para interagir.

O atributo accessibility do componente pode conter um complemento para cada rating, oferecendo informações adicionais para melhorar a acessibilidade e a compreensão do usuário.

# Exemplos
Default
```
<div id="rating-234" class="brad-rating brad-rating--lg"></div>
```