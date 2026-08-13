# TimelineStepperVertical

O componente Timeline Stepper visualiza um conjunto de etapas relacionadas ou a sequência de um processo definida por marcos do usuários, e é utilizada para sinalizarem qual marco o usuário está em um conjunto de etapas relacionadas, assim como quais etapas já foram cumpridas e quais ainda faltam.

# Uso do HTML
```
<div
  id="timeline"
  class="brad-timeline-stepper"
>
  <div
    class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
  >
    <div class="brad-timeline-stepper__point">
      <span aria-hidden="true" class="brad-timeline-stepper__line__pointer"
        >1</span
      >
      <em
        aria-hidden="true"
        class="brad-timeline-stepper__line__connecting"
      ></em>
    </div>

    <div class="brad-timeline-stepper__content">
      Lorem ipsum dolor sit amet, <br />
      consectetur 1
    </div>
  </div>

  <div
    class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
  >
    <div class="brad-timeline-stepper__point">
      <span aria-hidden="true" class="brad-timeline-stepper__line__pointer"
        >2</span
      >
      <em
        aria-hidden="true"
        class="brad-timeline-stepper__line__connecting"
      ></em>
    </div>

    <div class="brad-timeline-stepper__content">
      Lorem ipsum dolor <br />
      sit amet, <br />
      consectetur 2
    </div>
  </div>
</div>
```
Estilos
## Dot

O tipo dot é determinado pela classe brad-timeline-stepper--dot no container do componente.

```
<div
id="timeline"
class="brad-timeline-stepper brad-timeline-stepper--dot"
>
```
## Reverse

O tipo reverse é determinado pela classe brad-timeline-stepper--reverse no container do componente.

```
<div
id="timeline"
class="brad-timeline-stepper brad-timeline-stepper--reverse"
>
```
## Alternate

O tipo alternate é determinado pela classe brad-timeline-stepper--alternate no container do componente, porém é necessário alguns cuidados específicos ao montar esse estilo. Segue explicação de como aplicar estilo:

```
<div
id="timeline"
class="brad-timeline-stepper brad-timeline-stepper--alternate"
>
```
## OnColor

O tipo dot é determinado pela classe brad-timeline-stepper--on-color no container do componente.

```
<div
id="timeline"
class="brad-timeline-stepper brad-timeline-stepper--on-color"
>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do TimelineStepperVertical

```
const targetSelector = "#timeline";
const options = {
targetSelector,
steps: [{ state: "complete" }, { state: "active" }],
};
const service = LiquidCorp.BradTimelineStepperService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| steps | [{state: string}] | [] | É um array que para cada valor dele corresponde ao step na sequência do HTML, ou seja, o primeiro state vai alterar o primeiro step no HTML e assim por diante. Caso o array tenha menos objetos que a quantidade de steps no HTML, os que sobrarem obterão o estado inicial (inactive). |

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetro(s) | Tipo | Descrição |
| --- | --- | --- | --- |
| getInstance | Options |  | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options. |
| getInstances | [Options] |  | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options. |
| appendStep | [{htmlElement: string, state: string}] ou htmlElement: string, state: string | Array<{htmlElement: string, state: string}> | Este método adiciona um ou mais steps ao final da sequência. Se um array de objetos for fornecido, ele adiciona múltiplos steps, cada um com seu htmlElement e state especificados. Se dois parâmetros forem fornecidos (um para htmlElement e outro para state), ele adiciona um único passo ao final com os valores fornecidos. |
| addStep | htmlContent, index, state | string, number, string | Este método adiciona um novo step com base no índice. |
| removeStep | index | number | Este método remove o passo na posição indicada pelo índice. |
| update | state | Array<string> | Utilizado para alterar estados de cada step sequencialmente. Caso o array tenha menos objetos que a quantidade de steps no HTML, os que sobrarem obterão o estado inicial (inactive). |

# Values

| Nome | Values |
| --- | --- |
| state | "complete", "active", "error", "inactive" |

# Uso básico
```
const targetSelector = "#timeline";
const options = {
targetSelector,
steps: [{ state: "complete" }, { state: "active" }],
};

const service = LiquidCorp.BradTimelineStepperService.getInstance(options);
const newSteps = [{ state: "active", state: "inactive" }];

/** eventListener customizado, usado para obter informações do timeline-stepper **/
function addListenerUpdate(service) {
service.eTimeline.addEventListener("updated", (e) => console.log(e.detail));
}

addListenerUpdate(service);
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
## Responsividade

No modo alternado ao chegar em um resolução com largura de 359px, a disposição atual será automaticamente trocado para o modo default do componente.

# Exemplos
Default
```
<div
  id="timeline-26"
  class="brad-timeline-stepper"
>
  <div
    class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
  >
    <div class="brad-timeline-stepper__point">
      <span aria-hidden="true" class="brad-timeline-stepper__line__pointer"
        >1</span
      >
      <em
        aria-hidden="true"
        class="brad-timeline-stepper__line__connecting"
      ></em>
    </div>

    <div class="brad-timeline-stepper__content">
      Lorem ipsum dolor sit amet, <br />
      consectetur 1
    </div>
  </div>

  <div
    class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
  >
    <div class="brad-timeline-stepper__point">
      <span aria-hidden="true" class="brad-timeline-stepper__line__pointer"
        >2</span
      >
      <em
        aria-hidden="true"
        class="brad-timeline-stepper__line__connecting"
      ></em>
    </div>

    <div class="brad-timeline-stepper__content">
      Lorem ipsum dolor <br />
      sit amet, <br />
      consectetur 2
    </div>
  </div>

  <div
    class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
  >
    <div class="brad-timeline-stepper__point">
      <span aria-hidden="true" class="brad-timeline-stepper__line__pointer"
        >3</span
      >
      <em
        aria-hidden="true"
        class="brad-timeline-stepper__line__connecting"
      ></em>
    </div>

    <div class="brad-timeline-stepper__content">
      Lorem ipsum dolor sit amet, <br />
      consectetur 3
    </div>
  </div>

  <div
    class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
  >
    <div class="brad-timeline-stepper__point">
      <span aria-hidden="true" class="brad-timeline-stepper__line__pointer"
        >4</span
      >
      <em
        aria-hidden="true"
        class="brad-timeline-stepper__line__connecting"
      ></em>
    </div>

    <div class="brad-timeline-stepper__content">
      Lorem ipsum dolor sit amet, <br />
      consectetur 4
    </div>
  </div>

  <div
    class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
  >
    <div class="brad-timeline-stepper__point">
      <span aria-hidden="true" class="brad-timeline-stepper__line__pointer"
        >5</span
      >
      <em
        aria-hidden="true"
        class="brad-timeline-stepper__line__connecting"
      ></em>
    </div>

    <div class="brad-timeline-stepper__content">
      Lorem ipsum dolor sit amet, <br />
      consectetur 5
    </div>
  </div>
</div>
```
Dot
```
<div class="brad-theme-classic">
  <div
    id="timeline-415"
    class="brad-timeline-stepper brad-timeline-stepper--dot "
  >
    <div
      class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
    >
      <div class="brad-timeline-stepper__point">
        <span
          aria-hidden="true"
          class="brad-timeline-stepper__line__pointer"
          >1</span
        >
        <em
          aria-hidden="true"
          class="brad-timeline-stepper__line__connecting"
        ></em>
      </div>

      <div class="brad-timeline-stepper__content">
        Lorem ipsum dolor sit amet, <br />
        consectetur
      </div>
    </div>

    <div
      class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
    >
      <div class="brad-timeline-stepper__point">
        <span
          aria-hidden="true"
          class="brad-timeline-stepper__line__pointer"
          >2</span
        >
        <em
          aria-hidden="true"
          class="brad-timeline-stepper__line__connecting"
        ></em>
      </div>

      <div class="brad-timeline-stepper__content">
        Lorem ipsum dolor <br />
        sit amet, <br />
        consectetur
      </div>
    </div>

    <div
      class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
    >
      <div class="brad-timeline-stepper__point">
        <span
          aria-hidden="true"
          class="brad-timeline-stepper__line__pointer"
          >3</span
        >
        <em
          aria-hidden="true"
          class="brad-timeline-stepper__line__connecting"
        ></em>
      </div>

      <div class="brad-timeline-stepper__content">
        Lorem ipsum dolor sit amet, <br />
        consectetur
      </div>
    </div>
  </div>
</div>
```
Reverse
```
<div class="brad-theme-classic">
  <div
    id="timeline-145"
    class="brad-timeline-stepper brad-timeline-stepper--reverse "
  >
    <div
      class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
    >
      <div class="brad-timeline-stepper__point">
        <span
          aria-hidden="true"
          class="brad-timeline-stepper__line__pointer"
          >1</span
        >
        <em
          aria-hidden="true"
          class="brad-timeline-stepper__line__connecting"
        ></em>
      </div>

      <div class="brad-timeline-stepper__content">
        Lorem ipsum dolor sit amet, <br />
        consectetur 1
      </div>
    </div>

    <div
      class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
    >
      <div class="brad-timeline-stepper__point">
        <span
          aria-hidden="true"
          class="brad-timeline-stepper__line__pointer"
          >2</span
        >
        <em
          aria-hidden="true"
          class="brad-timeline-stepper__line__connecting"
        ></em>
      </div>

      <div class="brad-timeline-stepper__content">
        Lorem ipsum dolor <br />
        sit amet, <br />
        consectetur 2
      </div>
    </div>

    <div
      class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
    >
      <div class="brad-timeline-stepper__point">
        <span
          aria-hidden="true"
          class="brad-timeline-stepper__line__pointer"
          >3</span
        >
        <em
          aria-hidden="true"
          class="brad-timeline-stepper__line__connecting"
        ></em>
      </div>

      <div class="brad-timeline-stepper__content">
        Lorem ipsum dolor <br />
        sit amet, <br />
        consectetur 3
      </div>
    </div>

    <div
      class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
    >
      <div class="brad-timeline-stepper__point">
        <span
          aria-hidden="true"
          class="brad-timeline-stepper__line__pointer"
          >4</span
        >
        <em
          aria-hidden="true"
          class="brad-timeline-stepper__line__connecting"
        ></em>
      </div>

      <div class="brad-timeline-stepper__content">
        Lorem ipsum dolor sit amet, <br />
        consectetur 4
      </div>
    </div>

    <div
      class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
    >
      <div class="brad-timeline-stepper__point">
        <span
          aria-hidden="true"
          class="brad-timeline-stepper__line__pointer"
          >5</span
        >
        <em
          aria-hidden="true"
          class="brad-timeline-stepper__line__connecting"
        ></em>
      </div>

      <div class="brad-timeline-stepper__content">
        Lorem ipsum dolor sit amet, <br />
        consectetur 5
      </div>
    </div>

    <div
      class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
    >
      <div class="brad-timeline-stepper__point">
        <span
          aria-hidden="true"
          class="brad-timeline-stepper__line__pointer"
          >6</span
        >
        <em
          aria-hidden="true"
          class="brad-timeline-stepper__line__connecting"
        ></em>
      </div>

      <div class="brad-timeline-stepper__content">
        Lorem ipsum dolor sit amet, <br />
        consectetur 6
      </div>
    </div>
  </div>
</div>
```
DotReverse
```
<div class="brad-theme-classic">
  <div
    id="timeline-349"
    class="brad-timeline-stepper brad-timeline-stepper--reverse brad-timeline-stepper--dot "
  >
    <div
      class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
    >
      <div class="brad-timeline-stepper__point">
        <span
          aria-hidden="true"
          class="brad-timeline-stepper__line__pointer"
          >1</span
        >
        <em
          aria-hidden="true"
          class="brad-timeline-stepper__line__connecting"
        ></em>
      </div>

      <div class="brad-timeline-stepper__content">
        Lorem ipsum dolor sit amet, <br />
        consectetur
      </div>
    </div>

    <div
      class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
    >
      <div class="brad-timeline-stepper__point">
        <span
          aria-hidden="true"
          class="brad-timeline-stepper__line__pointer"
          >2</span
        >
        <em
          aria-hidden="true"
          class="brad-timeline-stepper__line__connecting"
        ></em>
      </div>

      <div class="brad-timeline-stepper__content">
        Lorem ipsum dolor <br />
        sit amet, <br />
        consectetur
      </div>
    </div>

    <div
      class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
    >
      <div class="brad-timeline-stepper__point">
        <span
          aria-hidden="true"
          class="brad-timeline-stepper__line__pointer"
          >3</span
        >
        <em
          aria-hidden="true"
          class="brad-timeline-stepper__line__connecting"
        ></em>
      </div>

      <div class="brad-timeline-stepper__content">
        Lorem ipsum dolor sit amet, <br />
        consectetur
      </div>
    </div>
  </div>
</div>
```
Alternate
```
<div
  id="timeline-108"
  class="brad-timeline-stepper brad-timeline-stepper--alternate"
>
  <div
    class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
  >
    <div class="brad-timeline-stepper__content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
      eleifend lacinia molestie 1
    </div>

    <div class="brad-timeline-stepper__point">
      <span aria-hidden="true" class="brad-timeline-stepper__line__pointer"
        >1</span
      >
      <em
        aria-hidden="true"
        class="brad-timeline-stepper__line__connecting"
      ></em>
    </div>

    <div class="brad-timeline-stepper__content"></div>
  </div>

  <div
    class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
  >
    <div class="brad-timeline-stepper__content"></div>

    <div class="brad-timeline-stepper__point">
      <span aria-hidden="true" class="brad-timeline-stepper__line__pointer"
        >2</span
      >
      <em
        aria-hidden="true"
        class="brad-timeline-stepper__line__connecting"
      ></em>
    </div>

    <div class="brad-timeline-stepper__content" data="1">
      Aenean dictum commodo enim, ac vestibulum dolor elementum a. Donec
      mattis dui et suscipit molestie 2
    </div>
  </div>

  <div
    class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive"
  >
    <div class="brad-timeline-stepper__content">
      Aenean dictum commodo enim, ac vestibulum dolor elementum a. Donec
      mattis dui et suscipit molestie 3
    </div>

    <div class="brad-timeline-stepper__point">
      <span class="brad-timeline-stepper__line__pointer">3</span>
      <em class="brad-timeline-stepper__line__connecting"></em>
    </div>

    <div class="brad-timeline-stepper__content"></div>
  </div>
</div>
```

No modo alternate, os passos da timeline são organizados de forma intercalada, criando um efeito visual onde o conteúdo aparece ora à direita, ora à esquerda.

# Estrutura

Cada step (brad-timeline-stepper__step) contém duas divs com a classe brad-timeline-stepper__content, mas apenas uma delas tem conteúdo, enquanto a outra permanece vazia. Isso permite que os passos fiquem alternados visualmente:

Passos ímpares (1º, 3º, 5º...) possuem o conteúdo na primeira brad-timeline-stepper__content, enquanto a segunda fica vazia.
Passos pares (2º, 4º, 6º...) possuem o conteúdo na segunda brad-timeline-stepper__content, enquanto a primeira fica vazia.

Ao utilizar os métodos de adição addStep e appendStep não precisamos nos preocupar em intercalar, pois o método já faz o tratamento.

Essa estrutura garante que os elementos fiquem distribuídos alternadamente nos lados direito e esquerdo, criando o efeito de zigue-zague.

## Exemplo de Estrutura Alternate:
```
<div class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive">
<div class="brad-timeline-stepper__content">
  <!-- Conteúdo apenas no primeiro elemento para passos ímpares -->
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</div>
<div class="brad-timeline-stepper__point">
  <span class="brad-timeline-stepper__line__pointer">1</span>
  <em class="brad-timeline-stepper__line__connecting"></em>
</div>
<div class="brad-timeline-stepper__content"></div>
<!-- Vazio -->
</div>

<div class="brad-timeline-stepper__step brad-timeline-stepper__step--inactive">
<div class="brad-timeline-stepper__content"></div>
<!-- Vazio -->
<div class="brad-timeline-stepper__point">
  <span class="brad-timeline-stepper__line__pointer">2</span>
  <em class="brad-timeline-stepper__line__connecting"></em>
</div>
<div class="brad-timeline-stepper__content">
  <!-- Conteúdo apenas no segundo elemento para passos pares -->
  Aenean dictum commodo enim, ac vestibulum dolor elementum a.
</div>
</div>
```