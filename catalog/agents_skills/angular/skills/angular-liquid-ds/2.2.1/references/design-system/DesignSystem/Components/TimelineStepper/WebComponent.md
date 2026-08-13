# TimelineStepper

O componente Timeline Stepper visualiza um conjunto de etapas relacionadas ou a sequência de um processo definida por marcos do usuários, e é utilizada para sinalizarem qual marco o usuário está em um conjunto de etapas relacionadas, assim como quais etapas já foram cumpridas e quais ainda faltam.

# Uso do WebComponent
```
<brad-timeline-stepper id="[ID_DO_TIMELINE_STEPPER]"></brad-timeline-stepper>
```
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-timeline-stepper | Componente | Sim | Sim | Componente principal do timeline, define a estrutura do do HTML baseado nos atributos informados. |

# Propriedades

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-type | "horizontal", "vertical" | "horizontal" | Define o tipo da timeline, no qual afeta sua exibição e comportamento. |
| brad-init | boolean | true | Define se deve ou não gerar a instância do serviço para o componente. Opção para torná-lo flexível, permitindo que a jornada configure seus atributos antes de inicializá-lo, se desejar. |
| brad-is-dot | boolean | false | Aplica a classe brad-timeline-stepper--dot ao elemento da timeline. Muda o estilo de exibição das etapas para "pontos". |
| brad-on-color | boolean | false | Estado de mudança de cor para fundos escuros. |
| brad-data | [{htmlContent: string, state: string}] | [] | Lista de etapas que serão exibidas na timeline. |

## Valores disponíveis para "state" em brad-data

| Nome | Valores |
| --- | --- |
| state | "complete", "active", "error", "inactive" |

## Propriedades para usar com brad-type no estilo "vertical"

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-is-reverse | boolean | false | Aplica a classe brad-timeline-stepper--reverse ao elemento da timeline. Muda o estilo de exibição das etapas para modo invertido. |
| brad-is-alternate | boolean | false | Aplica a classe brad-timeline-stepper--alternate ao elemento da timeline. Muda o estilo de exibição das etapas para modo alternado. |

# Observações importantes

Após a criação do web component no HTML, ao trocar o valor das propriedades brad-type ou brad-alternate, o conteúdo interno do Timeline Stepper é recriado utilizando como base o que está informado na propriedade brad-data. Isso é necessário pois o serviço do componente cria a estrutura HTML com base nos atributos informados, para que não ocorram quebras visuais.

# Comportamento Javascript
## Inicialização

A inicialização do serviço do Timeline não é necessária, pois o web component já o instancia nativamente. Porém, será necessário acessar o serviço criado por ele para realizar a chamada dos métodos necessários. Exemplo de como referenciar o serviço instanciado pelo web component:

```
const eTimelineStepper = document.getElementById([ID_DO_TIMELINE_STEPPER]);
const service = eTimelineStepper.service;
```
## Tratamento de Atributos com Objetos ou Arrays

Alguns atributos do componente podem receber objetos ou arrays como valores. No entanto, valores não-escapados podem causar erros ou comportamentos inesperados ao serem inseridos diretamente no HTML. Para garantir a correta passagem desses valores, é necessário convertê-los em uma string JSON escapada. O método LiquidCorp.defineAttribute(object) foi implementado para facilitar esse processo:

# Exemplo de uso
```
const timelineData = [
    {
      htmlElement: `Lorem ipsum dolor sit amet, <br />
        consectetur 1`,
      state: "complete",
    },
    {
      htmlElement: `Lorem ipsum dolor sit amet, <br />
        consectetur 2`,
      state: "error",
    },
    {
      htmlElement: `Lorem ipsum dolor sit amet, <br />
        consectetur 3`,
      state: "active",
    },
  ];
```
```
<brad-timeline-stepper
id="[ID_DO_TIMELINE_STEPPER]"
brad-data="${LiquidCorp.defineAttribute(timelineData)}"
></brad-timeline-stepper>
```

Alternativamente, caso deseje alterar os atributos utilizando a função setAttribute, podemos fazer da seguinte forma:

```
const eTimelineStepper = document.getElementById([ID_DA_TIMELINE_STEPPER]);
eTimelineStepper.setAttribute("brad-data", JSON.stringify(timelineData));
```
## Tratamento de dados utilizando método setter

Também é possível alterar os dados de timelineData do webcomponent utilizando um método setter. Dessa forma, evita-se uma visualização poluída do HTML ao trabalhar com um grande volume de dados.

```
const eTimelineStepper = document.getElementById([ID_DA_TIMELINE]);
eTimelineStepper.timelineData = timelineData;
```
## Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetro(s) | Tipo | Descrição |
| --- | --- | --- | --- |
| appendStep | [{htmlElement: string, state: string}] ou htmlElement: string, state: string | Array<{htmlElement: string, state: string}> | Este método adiciona um ou mais steps ao final da sequência. Se um array de objetos for fornecido, ele adiciona múltiplos steps, cada um com seu htmlElement e state especificados. Se dois parâmetros forem fornecidos (um para htmlElement e outro para state), ele adiciona um único passo ao final com os valores fornecidos. |
| addStep | htmlContent, index, state | string, number, string | Este método adiciona um novo step com base no índice. |
| removeStep | index | number | Este método remove o passo na posição indicada pelo índice. |
| update | state | Array<string> | Utilizado para alterar estados de cada step sequencialmente. Caso o array tenha menos objetos que a quantidade de steps no HTML, os que sobrarem obterão o estado inicial (inactive). |

# Uso básico
```
const eTimelineStepper = document.getElementById([ID_DA_TIMELINE]);
const service = eTimelineStepper.service;
const newSteps = [{ state: "active", state: "inactive" }];

/** eventListener customizado, usado para obter informações do timeline-stepper **/
function addListenerUpdate() {
eTimeline.addEventListener("updated", (e) => console.log(e.detail));
}

addListenerUpdate();
service.update(newSteps);
```
Uso dos métodos
appendStep
```
service.appendStep([
     {
       htmlElement: "Esse foi inserido pelo [appendStep], <br /> certo? 1",
       state: "complete",
     },
     {
       htmlElement: "Esse foi inserido pelo [appendStep], <br /> certo? 2",
       state: "complete",
     },
     {
       htmlElement: "Esse foi inserido pelo [appendStep], <br /> certo? 3",
       state: "complete",
     },
   ]);
```
addStep
```
service.addStep(
          "Esse foi inserido pelo [addStep], <br /> certo?",
          4,
          "complete"
        ),
```
removeStep
```
service.removeStep(0)
```
## Acessibilidade

Para garantir a acessibilidade do componente brad-timeline-stepper, os seguintes aspectos foram implementados:

# Atributos e Elementos
## Uso de aria-hidden="true:

Elementos brad-timeline-stepper__pointer e brad-timeline-stepper__connecting:
Estes elementos possuem aria-hidden="true" para indicar que são puramente visuais e não devem ser anunciados pelos leitores de tela. Isso evita que informações desnecessárias sejam verbalizadas, focando a atenção do usuário nas partes relevantes do componente.

```
<em aria-hidden="true" class="brad-timeline-stepper__line__connecting"></em>
```
```
<span aria-hidden="true" class="brad-timeline-stepper__line__pointer">1</span>
```
```
<em aria-hidden="true" class="brad-timeline-stepper__line__connecting"></em>
```
Verbalização dos Passos pelo Leitor de Tela:
## Atributo aria-label:

O serviço do componente é responsável por automaticamente adicionar o atributo aria-label a cada passo, seguindo o padrão "Passo X de Y [status]", onde:

X representa o número do passo atual.
Y representa o número total de passos.
status indica o estado do passo, que pode ser "ativo", "completo", "erro" ou "inativo".


Este padrão garante que os usuários sejam informados de sua posição atual na sequência e do estado de cada passo.

# Responsabilidade da Jornada
## Conteúdo dentro de brad-timeline-stepper__content:

A jornada do usuário é responsável por garantir a acessibilidade do conteúdo dentro do elemento brad-timeline-stepper__content, tendo em vista que o conteúdo pode ser qualquer um. Isso inclui:

Utilizar marcação HTML semântica adequada.
Garantir que qualquer informação crítica ou interativa esteja acessível por meio de tecnologias assistivas.
Fornecer descrições claras e contextuais usando atributos ARIA conforme necessário.
```
<div class="brad-timeline-stepper__content">
Lorem ipsum dolor sit amet, <br />
consectetur
</div>
```
Exemplos Horizontal
Default
Dot
Exemplos Vertical
Default
Dot
Reverse
## Alternate