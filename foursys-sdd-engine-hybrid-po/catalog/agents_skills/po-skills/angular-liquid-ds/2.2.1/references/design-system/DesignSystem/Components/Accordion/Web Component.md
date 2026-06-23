# Accordion

Os Accordion (Expansíveis) são soluções utilizadas para suprimir informações secundárias quando determinada tela possui muito conteúdo.

# Uso do Web Component

O Accordion web component possui vários componentes utilitários que ajudam a construir vários casos de uso.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-accordion | Componente | Sim | Não | Agrupa todos os outros componentes do accordion |
| brad-accordion-header | Sub-componente | Sim | Não | Cabeçalho do accordion que expande e recolhe o conteúdo quando clicado. |
| brad-accordion-title | Sub-componente | Sim | Sim | Conteúdo do cabeçalho. |
| brad-accordion-title-icon | Sub-componente | Não | Sim | Ícone do conteúdo do cabeçalho. |
| brad-accordion-content | Sub-componente | Sim | Sim | Agrupa o conteúdo do accordion. |
| brad-accordion-footer | Sub-componente | Não | Sim | Agrupa o conteúdo que fica abaixo do accordion. |

# Propriedades
## brad-accordion

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-on-color | boolean | false | Estado de mudança de cor para fundos escuros. |
| brad-border | "default", "without-border-top", "without-border-bottom", "without-both" | "default" | Controle de remoção de bordas. |
| brad-no-icon | boolean | false | Remove o ícone de expansão padrão do accordion. |
| disabled | boolean | false | Desabilita o accordion impedindo sua expansão/contração. |

# brad-accordion-title-icon

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-icon | string | "icon-ui-placeholder" | Inserir um ícone valido do Liquid |
| brad-icon-size | "xxs", "sm", "md" | "xxs" | Controla o tamanho do ícone. |

# Uso do HTML
```
<brad-accordion brad-on-color="false" brad-border="default">
    <brad-accordion-header>
      <brad-accordion-title >
        <brad-accordion-title-icon brad-icon="icon-ui-placeholder" brad-icon-size="xxs">
        </brad-accordion-title-icon>
        <h2>Title</h2>
      </brad-accordion-title>
    </brad-accordion-header>

    <brad-accordion-content >

      <p>
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book.
      </p>

    </brad-accordion-content>

  </brad-accordion>
```
## Comportamento Javascript

## Para instanciar o web component do Accordion é simples:

```
const accordionElement = document.getElementById([ID_DO_ACCORDION]]);
const service = accordionElement.service;
```

A partir disso todos os metódos que existem no HTML também estarão disponíveis no web component.

Obs: O metódo toggle já está inserido dentro web component não precisa chamá-lo novamente ao clicar no header veja o .

## Métodos de Instância vs Métodos Estáticos

Os métodos como open, close e toggle funcionam em uma instância específica do accordion:

```
const accordionElement = document.getElementById('meu-accordion');
const service = accordionElement.service;

service.open();
service.close();
service.toggle();
```

Para métodos que afetam todos os accordions da página (como "fechar todos"), você precisa acessar o construtor da classe:

```
// Para métodos estáticos, use o construtor da classe
const accordionElement = document.getElementById('meu-accordion');
const AccordionService = accordionElement.service.constructor;

// Métodos estáticos disponíveis:
AccordionService.closeAll();
```

# Exemplo prático completo:

```
// 1. Para operações em instância específica
const accordionElement = document.getElementById('meu-accordion');
const service = accordionElement.service;
service.open();

// 2. Para operações globais, use o construtor
const AccordionService = service.constructor;
AccordionService.closeAll();
```
## EventListeners

Lembrando que para o uso dos listeners é necessário passar pelo processo de e :


| Elemento | Método | Evento | Descrição |
| --- | --- | --- | --- |
| service.eAccordion | addEventListener | "open" | É disparado sempre que o serviço abre o componente atual |
| service.eAccordion | addEventListener | "close" | É disparado sempre que o serviço fecha o componente atual |
| service.eHeader | addEventListener | "click" | É disparado sempre que clica no header para abrir o accordion |

# Acessibilidade

As tags padrões são inseridas automaticamente pelo script do web component, assim o funcionamento da acessibilidade é garantido.

# brad-accordion-header

| tag | value | Descrição |
| --- | --- | --- |
| id | ID_DO_ACCORDION-header | É inserida automaticamente seguindo o padrão ID_DO_ACCORDION-header |
| role | button | Indica que essa tag é um botão |
| aria-expanded | false | Indica se o accordion está expandido, quando accordion é expandido utilizando o o botão o valor muda automaticamente para true. Se utizar um seviço externo para expandir o accordion deve-se criar um script para fazer a alteração |
| aria-controls | ID_DO_ACCORDION-content | Indica onde está o conteúdo que controlado pelo botão. |
| tabindex | 0 | Marca esse elemento como focável. |

# brad-accordion-content

| tag | value | Descrição |
| --- | --- | --- |
| id | ID_DO_ACCORDION-content | É inserida automaticamente seguindo o padrão ID_DO_ACCORDION-content |
| aria-hidden | true | Quando o accordion está escondido Indica que para acessibilidade que o conteúdo não está exposto, muda automaticamente para false quando accordion está aberto |
| role | region | Indica para acessibilidade que essa é uma area importantedo conteúdo |


O comportamento da acessibilidade segue o mesmo do componente HTML, para ver a documentação completa clique aqui.

# Exemplos

Obs: Use o botão show code abaixo do exemplo para ver o HTML.

# Accordion

Para o uso do accordion é importante seguir a logica de implementação do código, inserir todas as tags obrigatorias na ordem conforme o exemplo.

```
<brad-accordion
  id="accordion-319"
  brad-on-color="false"
  brad-border=default
  
  
>
  <brad-accordion-header>
    <brad-accordion-title >
      <!-- SEM TRAILING ICON -->

      <h2>Title</h2>
    </brad-accordion-title>
  </brad-accordion-header>

  <brad-accordion-content >
    
    <p>
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book.
    </p>

  </brad-accordion-content>
  
</brad-accordion>
```
```
const accordionElement = document.getElementById([ID_DO_ACCORDION]]);
const service = accordionElement.service;
```
## Accordion Card

Para uso do accordion com a customização do card deve ser inserido uma div antes da inicialização do accordion com as classes brad-card brad-card--default.

```
<div class="undefined">
  <div
    class="brad-card brad-card--default brad-card--overflow-hidden brad-card--auto "
  >
     
  <brad-accordion
    id="accordion-223"
    brad-on-color="false"
    brad-border=without-both
    
    
  >
    <brad-accordion-header>
      <brad-accordion-title >
        <!-- SEM TRAILING ICON -->

        <h2>Title</h2>
      </brad-accordion-title>
    </brad-accordion-header>

    <brad-accordion-content >
      
      <p>
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book.
      </p>
  
    </brad-accordion-content>
    
  </brad-accordion>

  </div>
</div>
```
## Múltiplos Accordion

A utilização de múltiplos accordions é simples, apenas multiplique a estrutura mudando os IDs e personalizando o conteúdo de cada como desejar.

```
<brad-accordion
    id="accordion-136"
    brad-on-color="false"
    brad-border=default
    
    class=brad-m-md-b
  >
    <brad-accordion-header>
      <brad-accordion-title >
        <!-- SEM TRAILING ICON -->

        <h2>Title</h2>
      </brad-accordion-title>
    </brad-accordion-header>

    <brad-accordion-content >
      
      <p>
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book.
      </p>
  
    </brad-accordion-content>
    <brad-accordion-footer ><p>Lorem ipsum dolor sit amet</p></brad-accordion-footer>
  </brad-accordion>

    
  <brad-accordion
    id="accordion-345"
    brad-on-color="false"
    brad-border=default
    
    class=brad-m-md-b
  >
    <brad-accordion-header>
      <brad-accordion-title >
        <!-- SEM TRAILING ICON -->

        <h2>Title</h2>
      </brad-accordion-title>
    </brad-accordion-header>

    <brad-accordion-content >
      
      <p>
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book.
      </p>
  
    </brad-accordion-content>
    <brad-accordion-footer ><p>Lorem ipsum dolor sit amet</p></brad-accordion-footer>
  </brad-accordion>

    
  <brad-accordion
    id="accordion-284"
    brad-on-color="false"
    brad-border=default
    
    class=brad-m-md-b
  >
    <brad-accordion-header>
      <brad-accordion-title >
        <!-- SEM TRAILING ICON -->

        <h2>Title</h2>
      </brad-accordion-title>
    </brad-accordion-header>

    <brad-accordion-content >
      
      <p>
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book.
      </p>
  
    </brad-accordion-content>
    <brad-accordion-footer ><p>Lorem ipsum dolor sit amet</p></brad-accordion-footer>
  </brad-accordion>
```
## Accordion Footer

Use a tag brad-accordion-footer para inserir o conteúdo do footer no accordion.

```
<brad-accordion
  id="accordion-395"
  brad-on-color="false"
  brad-border=default
  
  
>
  <brad-accordion-header>
    <brad-accordion-title >
      <!-- SEM TRAILING ICON -->

      <h2>Title</h2>
    </brad-accordion-title>
  </brad-accordion-header>

  <brad-accordion-content >
    
    <p>
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book.
    </p>

  </brad-accordion-content>
  <brad-accordion-footer ><p>Lorem ipsum dolor sit amet</p></brad-accordion-footer>
</brad-accordion>
```
## Accordion Title Icon

Use a tag brad-accordion-title-icon para inserir um ícone no titulo do accordion.

```
<brad-accordion
  id="accordion-113"
  brad-on-color="false"
  brad-border=default
  
  
>
  <brad-accordion-header>
    <brad-accordion-title >
      <brad-accordion-title-icon
      brad-icon="icon-ui-placeholder"
      brad-icon-size="xxs"
    ></brad-accordion-title-icon>

      <h2>Title</h2>
    </brad-accordion-title>
  </brad-accordion-header>

  <brad-accordion-content >
    
    <p>
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book.
    </p>

  </brad-accordion-content>
  
</brad-accordion>
```
## Sem Padding Accordion

Remove os paddings existentes no título e no conteúdo do accordion.

```
<brad-accordion
  id="accordion-35"
  brad-on-color="false"
  brad-border=default
  
  
>
  <brad-accordion-header>
    <brad-accordion-title class=brad-p-none-l>
      <!-- SEM TRAILING ICON -->

      <h2>Title</h2>
    </brad-accordion-title>
  </brad-accordion-header>

  <brad-accordion-content class=brad-p-none-l>
    
    <p>
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book.
    </p>

  </brad-accordion-content>
  <brad-accordion-footer class=brad-p-none-l><p>Lorem ipsum dolor sit amet</p></brad-accordion-footer>
</brad-accordion>
```