# Card

Um card é um container de conteúdo flexível e extensível. Ele tem opções para cabeçalhos e rodapés, uma larga variedade de conteúdo, cores de background contextuais e opções de display.

# Uso do WebComponent
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-card | Componente | Sim | Sim | Componente principal do card, define a estrutura do card e usa atributos para o tipo, seleção, e ribbon quando o tipo for ribbon. |
| brad-card-ribbon-icon | Componente | Não | Não | Componente utilizado para adicionar um ícone ao ribbon quando o tipo do card for "ribbon". |

# Propriedades

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-type | "default", "dragged", "interactive", "ribbon" | "default" | Define o tipo de card, o qual afeta a aparência visual e seus comportamentos. Os tipos disponíveis são "default", "dragged", "interactive" e "ribbon". |
| selected | boolean | false | Seleciona o card, adicionando uma borda cta em volta. |
| brad-has-opacity | boolean | false | Adiciona opacidade no background do card. |
| brad-ribbon-color | background-theme[0], background-theme-xlight[0], extended-red[0], extended-red-dark[0], extended-red-xlight[0], extended-green[0], extended-green-dark[0], extended-green-xlight[0], extended-blue[0], extended-blue-dark[0], extended-blue-xlight[0], extended-yellow[0], extended-yellow-dark[0], extended-yellow-xlight[0], extended-purple[0], extended-purple-dark[0], extended-purple-xlight[0], extended-violet[0], extended-violet-dark[0], extended-violet-xlight[0], extended-salmon[0], extended-salmon-dark[0], extended-salmon-xlight[0] (apenas com brad-type="ribbon") | "primary" | Define a cor do ribbon (etiqueta). |

Propriedades que refletem apenas ao usar o brad-type como "ribbon"

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-ribbon-color | background-theme[0], background-theme-xlight[0], extended-red[0], extended-red-dark[0], extended-red-xlight[0], extended-green[0], extended-green-dark[0], extended-green-xlight[0], extended-blue[0], extended-blue-dark[0], extended-blue-xlight[0], extended-yellow[0], extended-yellow-dark[0], extended-yellow-xlight[0], extended-purple[0], extended-purple-dark[0], extended-purple-xlight[0], extended-violet[0], extended-violet-dark[0], extended-violet-xlight[0], extended-salmon[0], extended-salmon-dark[0], extended-salmon-xlight[0] (apenas com brad-type="ribbon") | "primary" | Define a cor do ribbon (etiqueta). |

## Propriedades do brad-card-ribbon-icon

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-ribbon-icon | string | "" | Define o ícone a ser exibido no ribbon. |


Acesse a documentação de ícones para verificar os valores disponíveis e utilizá-los no atributo brad-ribbon-icon. | brad-ribbon-icon | string | "" | Adiciona o ícone jundo do ribbon. |

Acesse a documentação de ícones para verificar os valores disponíveis e utilizá-los na classe brad-ribbon-icon.

# Acessibilidade

Cards podem ser usados para uma variedade de cenários e possuem diferentes tipos de conteúdos. Por ser um componente flexível, o tratamento de acessibilidade adequado irá depender da sua finalidade. Pode ser apropriado implementar tabindex neste elemento, se quiser que ele seja clicável.
Caso o card seja o elemento principal de interação pode-se usar tabindex="0"; porém se o componente não fizer parte do fluxo, mas ainda assim puder receber foco, então usar tabindex="-1".
Se o card for apenas decorativo não é necessário aplicar tabindex. É importante salientar que mesmo o card sendo estático, todo seu conteúdo precisar ser verbalizado pelo leitor de tela e elementos acionáveis devem receber foco do leitor de tela e do teclado.

# Card do tipo interactive:
É comumente usado para levar o usuário a outra página, se comportando como um link, por tanto precisa receber alguns atributos de acessibilidade como role="link" e tabindex="0".

# Card com o atributo selected:
É importante informar para os usuários que utilizam tecnologia assistiva o estado de seleção do ao usar esse atributo, isso pode ser feito através do atributo aria-selected, seu valor deve ser alterado dinamicamente entre "true" e "false". Incluir também a propriedade role="option".

# Exemplos

O card pode ter diversas opções de cores. Consulte as seguintes documentações para conhecer as classes de background disponíveis:

# Documentação de Cores
Documentação de Gradientes
## Documentação de Glassmorfismo

Esses guias oferecem uma visão detalhada das opções que você pode aplicar ao card para personalizar sua aparência.

Obs: Use o botão Show code abaixo do exemplo para ver o HTML.

Para o uso do card é importante seguir a logica de implementação do código, inserir todas as tags obrigatórias na ordem conforme o exemplo.

# Default

Variação estática do card, apenas agrupa conteúdo visual. Pode conter elementos interativos em seu interior, mas sua área geral não é clicável, a não ser que seja implementado.

```
<brad-card
  brad-type="default"
  
  
  
  class="brad-p-lg"
>
   <div>
    <h1 class="brad-m-md-b">Lorem Ipsum</h1>

    <div>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur,
        distinctio asperiores officiis voluptates ducimus saepe, illum maiores
        nisi magnam temporibus possimus? Doloremque earum cum tempora neque
        praesentium, voluptatem voluptas non.
      </p>
    </div>
  </div>
</brad-card>
```
## Dragged

Este modelo de card pode ser pressionado e ao segurar, ele será elevado da interface, simulando que ele está sendo arrastado (foi desenvolvido para ser utilizado junto com a feature de drag and drop, mas não se limita a isso).

```
<brad-card brad-type="dragged" class="brad-p-xl">
  <div>
    <h1 class="brad-m-md-b">Lorem Ipsum</h1>

    <div>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur,
        distinctio asperiores officiis voluptates ducimus saepe, illum maiores
        nisi magnam temporibus possimus? Doloremque earum cum tempora neque
        praesentium, voluptatem voluptas non.
      </p>
    </div>
  </div>
</brad-card>
```
## Interactive

Card clicável, toda sua área é interativa e quando há interação, ele realiza uma ação. De comum uso para navegação, levando o usuário para outra tela.

```
<brad-card brad-type="interactive" class="brad-p-xl">
  <div>
    <h1 class="brad-m-md-b">Lorem Ipsum</h1>

    <div>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur,
        distinctio asperiores officiis voluptates ducimus saepe, illum maiores
        nisi magnam temporibus possimus? Doloremque earum cum tempora neque
        praesentium, voluptatem voluptas non.
      </p>
    </div>
  </div>
</brad-card>
```
## Selected

Este estado indica que o card foi selecionado pelo usuário, aplicando uma borda destacada na cor CTA ao redor do componente. Útil em cenários onde o usuário pode selecionar um ou múltiplos cards, como em formulários de seleção, listas de opções ou galerias interativas. A propriedade selected deve ser usada em conjunto com os atributos ARIA apropriados (role="option" e aria-selected) para garantir a acessibilidade.

```
<brad-card selected class="brad-p-xl">
  <div>
    <h1 class="brad-m-md-b">Lorem Ipsum</h1>

    <div>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur,
        distinctio asperiores officiis voluptates ducimus saepe, illum maiores
        nisi magnam temporibus possimus? Doloremque earum cum tempora neque
        praesentium, voluptatem voluptas non.
      </p>
    </div>
  </div>
</brad-card>
```
## Ribbon

O card pode ter um ribbon (etiqueta) que fica sobreposto, que serve tanto para destacar conteúdos importantes, como também chamar a atenção do usuário. A largura do ribbon vai depender da borda aplicada.

```
<brad-card brad-type="ribbon" class="brad-p-lg">
  <brad-card-ribbon-icon
    brad-icon="icon-ui-placeholder"
  ></brad-card-ribbon-icon>
  <div>
    <h1 class="brad-m-md-b">Lorem Ipsum</h1>

    <div>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur,
        distinctio asperiores officiis voluptates ducimus saepe, illum maiores
        nisi magnam temporibus possimus? Doloremque earum cum tempora neque
        praesentium, voluptatem voluptas non.
      </p>
    </div>
  </div>
</brad-card>
```