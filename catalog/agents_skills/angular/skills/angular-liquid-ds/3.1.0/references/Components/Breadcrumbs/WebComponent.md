# Breadcrumbs

Breadcrumbs são um padrão de navegação secundária que permite ao usuário visualizar sua posição atual na hierarquia do site e navegar por ela.

# Sumário
## Uso do Web Component

O Breadcrumbs web component possui vários componentes utilitários que ajudam a construir vários casos de uso.

# Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-breadcrumbs | Componente | Sim | Não | Agrupa todos os outros componentes do breadcrumbs. |
| brad-breadcrumbs-list | Sub-componente | Sim | Não | Lista que contém os itens de navegação do breadcrumbs. |
| brad-breadcrumbs-item | Sub-componente | Sim | Não | Item individual de navegação do breadcrumbs. |
| a | HTMLElement | Sim | Não | Link de navegação dentro de cada item. |

# Propriedades
## brad-breadcrumbs

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-on-color | boolean | false | Aplica variação visual para uso em fundos escuros. |
| brad-mode | "full", "condensed", "breakline" | "full" | Define o modo de exibição dos itens de navegação. Veja . |
| brad-current-page | number | 1 | Define a página ativa no breadcrumb. Atualiza o atributo aria-current="page" no link correspondente. |

# Uso do HTML
```
<brad-breadcrumbs
id="breadcrumbs"
brad-on-color="false"
brad-mode="condensed"
brad-current-page="1"
>
<brad-breadcrumbs-list>
  <brad-breadcrumbs-item><a href="#">Página 1</a></brad-breadcrumbs-item>
  <brad-breadcrumbs-item><a href="#">Página 2</a></brad-breadcrumbs-item>
  <brad-breadcrumbs-item><a href="#">Página 3</a></brad-breadcrumbs-item>
  <brad-breadcrumbs-item><a href="#">Página 4</a></brad-breadcrumbs-item>
  <brad-breadcrumbs-item><a href="#">Página 5</a></brad-breadcrumbs-item>
  <brad-breadcrumbs-item><a href="#">Página 6</a></brad-breadcrumbs-item>
  <brad-breadcrumbs-item><a href="#">Página 7</a></brad-breadcrumbs-item>
  <brad-breadcrumbs-item>
    <a href="#">Página 8</a>
  </brad-breadcrumbs-item>
</brad-breadcrumbs-list>
</brad-breadcrumbs>
```
## Comportamento Javascript

O Web Component não requer uma instanciação explícita em JavaScript, pois a própria tag HTML se encarrega de inicializá-lo automaticamente.

Todos os atributos do componente são reativos. Para gerenciar o comportamento ou atualizar o estado do componente, basta obter sua referência no DOM e manipular os valores dos seus atributos:

```
const breadcrumbs = document.querySelector("brad-breadcrumbs");
breadcrumbs.setAttribute("brad-mode", "full");
breadcrumbs.setAttribute("brad-current-page", "3");
```
Parâmetros
## brad-mode

O atributo brad-mode define como o componente gerencia a exibição dos itens de navegação. Aceita três valores:

full (padrão): Exibe todos os itens do breadcrumb, incluindo os posteriores à página ativa. Quando o espaço não é suficiente, os itens excedentes são agrupados automaticamente em um dropdown acessível.

```
<brad-breadcrumbs brad-mode="full" brad-current-page="4">
...
</brad-breadcrumbs>
```

condensed: Oculta as páginas posteriores à página ativa, exibindo apenas as anteriores e a página atual como último item visível. Quando o espaço não é suficiente, os itens anteriores são agrupados em dropdown.

```
<brad-breadcrumbs brad-mode="condensed" brad-current-page="4">
...
</brad-breadcrumbs>
```

breakline: Exibe todos os itens com quebra de linha (flex-wrap). Não utiliza dropdown. Os itens são dispostos em múltiplas linhas quando não cabem no container.

```
<brad-breadcrumbs brad-mode="breakline" brad-current-page="6">
...
</brad-breadcrumbs>
```
## Métodos

Para acessar os métodos, obtenha a referência do componente no DOM:

```
const breadcrumbs = document.querySelector("brad-breadcrumbs");
```

| Método | Parâmetros | Descrição |
| --- | --- | --- |
| hasContent | - | Retorna true se o breadcrumb contém itens de navegação. |
| setAttribute | name, value | Atualiza reativamente qualquer atributo (brad-mode, brad-current-page, brad-on-color). O componente se reconfigura automaticamente. |

# Acessibilidade

O componente Breadcrumbs do Design System Liquid foi desenvolvido usando HTML semântico, assegurando a interpretação correta do leitor de tela, inclusive informando a quantidade de itens, e permitindo a navegação com o teclado.

A propriedade aria-current="page" no item ativo indica a página atual dentro do conjunto de elementos.
Quando houver truncamento, o botão de dropdown recebe aria-label indicando a existência de mais itens, e o atributo aria-expanded alterna entre "true" e "false" para informar ao leitor de tela se o dropdown está expandido ou recolhido.

Os seguintes atributos ARIA são inseridos automaticamente pelo componente:

# brad-breadcrumbs

| Atributo | Valor | Descrição |
| --- | --- | --- |
| role | navigation | Identifica que existe um grupo de navegação |

# brad-breadcrumbs-list

| Atributo | Valor | Descrição |
| --- | --- | --- |
| role | list | Identifica que existe uma lista de itens |

# brad-breadcrumbs-item

| Atributo | Valor | Descrição |
| --- | --- | --- |
| role | listitem | Identifica que é um item de uma lista |

# Observações
O modo breakline não utiliza dropdown. Os itens são dispostos em múltiplas linhas quando não cabem no container.
No modo condensed, itens posteriores à página ativa não são visíveis. Se o cenário exige que o usuário visualize caminhos futuros na hierarquia, utilize o modo full.
O componente inicializa o serviço automaticamente assim que os elementos <a> são detectados dentro dos itens (via MutationObserver). Garanta que os links estejam presentes na estrutura HTML.
Ao alterar o atributo brad-mode em tempo de execução, o serviço é recriado com a nova configuração. A troca de modo é totalmente reativa.
## Exemplos

Obs: Utilize o playground interativo acima para testar os diferentes modos e navegação entre páginas.

# Condensed

No modo condensed, apenas as páginas anteriores à página ativa e a própria página ativa são exibidas. As páginas posteriores ficam ocultas.

```
<brad-breadcrumbs
  id="breadcrumbs-CondensedDocsOnly"
  brad-on-color="false"
  brad-mode="condensed"
  brad-current-page="3"
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
Copy code
## Full

No modo full, todas as páginas são exibidas, incluindo as posteriores à página ativa. Quando não há espaço suficiente, os itens são agrupados em um dropdown.

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
Copy code
## BreakLine

No modo breakline, os itens são dispostos em múltiplas linhas quando não cabem no container. Para indicar a página atual, o componente aplica aria-current="page" automaticamente com base no atributo brad-current-page.

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
## Copy code