# Breadcrumbs

Breadcrumbs são um padrão de navegação secundária que permite ao usuário visualizar sua posição atual na hierarquia do site e navegar por ela.

# Uso do Web Component

O Breadcrumbs web component possui vários componentes utilitários que ajudam a construir vários casos de uso.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-breadcrumbs | Componente | Sim | Não | Agrupa todos os outros componentes do accordion |
| brad-breadcrumbs-list | Sub-componente | Sim | Não | Cabeçalho do accordion que expande e recolhe o conteúdo quando clicado. |
| brad-breadcrumbs-item | Sub-componente | Sim | Não | Conteúdo do cabeçalho. |
| a | HTMLElement | Sim | Não | Link |

# Propriedades
## brad-breadcrumbs

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-on-color | boolean | false | Estado de mudança de cor para fundos escuros. |
| brad-mode | "condensed", "full", "breakline" | full | full: Este modo sempre exibe todas as páginas, incluindo as posteriores à página ativa. condensed: Este modo esconde todas as páginas posteriores à página ativa, mostrando apenas as anteriores e a ativa como última. breakline: Usando o modo BreakLines, o Breadcrumbs irá quebrar as linhas quando não couberem mais no container. |
| brad-current-page | number | 1 | Página atual exibida no Breadcrumbs. |

# Uso do HTML
```
<brad-breadcrumbs
  id="breadcrumbs"
  brad-on-color="false"
  brad-mode="condensed"
  brad-current-page="1"
>
  <brad-breadcrumbs-list>
    <brad-breadcrumbs-item
      ><a href="#">Página 1</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item
      ><a href="#">Página 2</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item>
      <a href="#">Página 3</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 4</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item
      ><a href="#">Página 5</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item
      ><a aria-current="page" href="#">Página 6</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item
      ><a href="#">Página 7</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item>
      <a href="#">Página 8</a>
    </brad-breadcrumbs-item>
  </brad-breadcrumbs-list>
</brad-breadcrumbs>
```
## Comportamento Javascript

O Web Component não requer uma instanciação explícita em JavaScript, pois a própria tag HTML se encarrega de inicializá-lo e tratá-lo por trás dos panos.

Além disso, todos os atributos do componente são reativos. Isso significa que, para gerenciar o comportamento ou atualizar o estado do componente, basta obter sua referência no DOM e manipular os valores dos seus atributos.

# Acessibilidade

O uso do atributo aria-label="breadcrumb" no elemento <brad-breadcrumb> é indicado para descrever o tipo de navegação e a propriedade aria-current="page" no item da lista indica a página atual dentro do conjunto de elementos relacionados.

Alguns atributos são inseridos automaticamente pelo componente:

# brad-breadcrumbs

| tag | value | Descrição |
| --- | --- | --- |
| role | navigation | Identifica que existe um grupo de navegação |

# brad-breadcrumb-list

| tag | value | Descrição |
| --- | --- | --- |
| role | list | Identifica que existe uma lista de itens |

# brad-breadcrumb-item

| tag | value | Descrição |
| --- | --- | --- |
| role | listitem | Identifica que é um item de uma lista |

# Exemplos

Obs: Use o botão show code abaixo do exemplo para ver o HTML.

# Condensed

Usando o modo Condensed, o Breadcrumbs esconde todas as páginas posteriores à página ativa, mostrando apenas as anteriores e a ativa como última.

```
<brad-breadcrumbs
  id="breadcrumbs-CondensedDocsOnly"
  brad-on-color="false"
  brad-mode="condensed"
  aria-label="Breadcrumbs"
>
  <brad-breadcrumbs-list>
    <brad-breadcrumbs-item
      ><a href="#">Página 1</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item
      ><a href="#">Página 2</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item>
      <a href="#">Página 3</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 4</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item
      ><a href="#" aria-current="page">Página 5</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item
      ><a href="#">Página 6</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item
      ><a href="#">Página 7</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item>
      <a href="#">Página 8</a>
    </brad-breadcrumbs-item>
  </brad-breadcrumbs-list>
</brad-breadcrumbs>
```
## Full

Usando o modo Full, o Breadcrumbs sempre exibe todas as páginas, incluindo as posteriores à página ativa.

```
<brad-breadcrumbs
  id="breadcrumbs-FullDocsOnly"
  brad-on-color="false"
  brad-mode="full"
  aria-label="Breadcrumbs"
>
  <brad-breadcrumbs-list>
    <brad-breadcrumbs-item
      ><a href="#">Página 1</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item
      ><a href="#">Página 2</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item>
      <a href="#">Página 3</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 4</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item
      ><a href="#" aria-current="page">Página 5</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item
      ><a href="#">Página 6</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item
      ><a href="#">Página 7</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item>
      <a href="#">Página 8</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 9</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 10</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 11</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 12</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 13</a>
    </brad-breadcrumbs-item>
  </brad-breadcrumbs-list>
</brad-breadcrumbs>
```
## BreakLine

Usando o modo BreakLines, o Breadcrumbs irá quebrar as linhas quando não couberem mais no container.

```
<brad-breadcrumbs
  id="breadcrumbs-BreakLineDocsOnly"
  brad-on-color="false"
  brad-mode="breakline"
  aria-label="Breadcrumbs"
>
  <brad-breadcrumbs-list>
    <brad-breadcrumbs-item
      ><a href="#">Página 1</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item
      ><a href="#">Página 2</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item>
      <a href="#">Página 3</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 4</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item
      ><a href="#">Página 5</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item
      ><a aria-current="page" href="#">Página 6</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item
      ><a href="#">Página 7</a></brad-breadcrumbs-item
    >
    <brad-breadcrumbs-item>
      <a href="#">Página 8</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 9</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 10</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 11</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 12</a>
    </brad-breadcrumbs-item>
    <brad-breadcrumbs-item>
      <a href="#">Página 13</a>
    </brad-breadcrumbs-item>
  </brad-breadcrumbs-list>
</brad-breadcrumbs>
```