# Tag

É um componente que dá destaque a uma informação de texto, utilizado para sinalizar algo importante ou categorizar itens ou agrupamentos dentro de um contexto.

# Uso do WebComponent
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-tag | Componente | Sim | Sim | Componente principal da tag, define a estrutura e usa atributos para personalização. |

# Propriedades

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-size | sm, md | "sm" | Define o tamanho da tag. |
| brad-color | extended-red[0], extended-red-dark[0], extended-red-xlight[0], extended-green[0], extended-green-dark[0], extended-green-xlight[0], extended-blue[0], extended-blue-dark[0], extended-blue-xlight[0], extended-yellow[0], extended-yellow-dark[0], extended-yellow-xlight[0], extended-purple[0], extended-purple-dark[0], extended-purple-xlight[0], extended-violet[0], extended-violet-dark[0], extended-violet-xlight[0], extended-salmon[0], extended-salmon-dark[0], extended-salmon-xlight[0] | "extended-red[0]" | Define a cor da tag. |

# Acessibilidade

O comportamento da acessibilidade segue o mesmo do componente HTML, para ver a documentação completa:

Tag - Acessibilidade HTML.

# Exemplo
```
<brad-tag brad-size="sm" brad-color="extended-red[0]">Tag label</brad-tag>
```