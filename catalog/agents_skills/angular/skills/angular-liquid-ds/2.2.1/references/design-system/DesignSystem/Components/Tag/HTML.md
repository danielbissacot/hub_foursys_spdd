# Tag

É um componente que da destaque a uma informação de texto, utilizado para sinalizar algo importante ou categorizar itens ou agrupamentos dentro de um contexto.

# Uso do HTML
```
<div class="brad-theme-classic brad-flex">
  <div
    class="brad-tag brad-cc-extended-red--[0]"
    role="status"
    aria-label="Tag label"
  >
    <span class="brad-tag__text">Tag label</span>
  </div>
</div>
```
Comportamento Javascript
## Inicialização

## Inicialização não é necessária (componente nativo)

# Acessibilidade

Para garantir a acessibilidade do componente brad-tag, os seguintes aspectos foram implementados:

# Atributos e Elementos
## Uso de role="status":


O atributo role="status" é usado no elemento <div> para indicar que o conteúdo deste componente é uma mensagem de status. Isto informa aos leitores de tela que o conteúdo é importante e deve ser monitorado, pois pode conter informações dinâmicas ou críticas.

# Atributo aria-label:


O aria-label="Tag label" fornece uma descrição textual para o componente. Este rótulo é lido por tecnologias assistivas, como leitores de tela, ajudando usuários a compreender o propósito ou o conteúdo do componente sem precisar visualizá-lo. É importante que o texto do aria-label seja claro e descritivo.

# Observações
## Cores disponíveis

| Nome | Descrição |
| --- | --- |
| brad-cc-extended-red--[0], brad-cc-extended-red-dark--[0], brad-cc-extended-red-xlight--[0], brad-cc-extended-green--[0], brad-cc-extended-green-dark--[0], brad-cc-extended-green-xlight--[0], brad-cc-extended-blue--[0], brad-cc-extended-blue-dark--[0], brad-cc-extended-blue-xlight--[0], brad-cc-extended-yellow--[0], brad-cc-extended-yellow-dark--[0], brad-cc-extended-yellow-xlight--[0], brad-cc-extended-purple--[0], brad-cc-extended-purple-dark--[0], brad-cc-extended-purple-xlight--[0], brad-cc-extended-violet--[0], brad-cc-extended-violet-dark--[0], brad-cc-extended-violet-xlight--[0], brad-cc-extended-salmon--[0], brad-cc-extended-salmon-dark--[0], brad-cc-extended-salmon-xlight--[0] | Define a cor da tag. |

# Responsividade

A largura do componente é 100% do elemento pai, ou seja, caso queira modificar o tamanho, só determinar no container que o componete estiver.
Caso queira que o componente tenha o tamanho do seu texto, é só colocar display: flex; no container que o componete estiver.

# Exemplo
```
<div class="brad-theme-classic brad-flex">
  <div
    class="brad-tag brad-cc-extended-red--[0]"
    role="status"
    aria-label="Tag label"
  >
    <span class="brad-tag__text">Tag label</span>
  </div>
</div>
```