# ListItem

É um componente que permite agrupar e organizar verticalmente itens de conteúdo relacionado.

# Uso do Web Component

O List-item web component possui um componente utilitário.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-list-item | Componente | Sim | Sim | Cria o componente List Item |

# Propriedades
## brad-list-item

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-on-color | boolean | false | Atributo para ativar o modo on color |
| brad-selected | boolean | false | Atributo para ativar o modo selecionado |
| brad-disabled | boolean | false | Atributo para ativar o modo desabilitado |
| brad-line-top | boolean | false | Atributo para ativar a linha do topo |
| brad-line-bottom | boolean | false | Atributo para ativar a linha de baixo |

# Acessibilidade

O comportamento da acessibilidade segue o mesmo do componente HTML, para ver a documentação completa:

ListItem.

# Exemplos

Para o uso do list-item é importante seguir a logica de implementação do código, inserir todas as tags obrigatorias na ordem conforme o exemplo.

```
<div>
  <brad-list-item
    class="brad-font-title-md brad-p-lg-y brad-p-sm-x"
    
    tabindex="0"
  >
    <p>Text goes here.</p>
  </brad-list-item>

  <brad-list-item
    class="brad-font-title-md brad-p-lg-y brad-p-sm-x"
    
    tabindex="0"
  >
    <p>Text goes here.</p>
  </brad-list-item>

  <brad-list-item
    class="brad-font-title-md brad-p-lg-y brad-p-sm-x"
    
    tabindex="0"
  >
    <p>Text goes here.</p>
  </brad-list-item>
</div>
```