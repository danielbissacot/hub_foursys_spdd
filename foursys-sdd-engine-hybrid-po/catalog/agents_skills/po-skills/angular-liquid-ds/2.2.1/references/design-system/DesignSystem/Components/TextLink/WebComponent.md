# TextLink

Os links são usados como elementos de navegação e podem ser usados sozinhos, acompanhados de ícones ou alinhados com o texto. Eles fornecem uma opção leve para navegação, mas devemos evitar muitos links em um curto espaço para não sobrecarregar a página/app.

# Uso do WebComponent
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-text-link | Componente | Sim | Sim | Componente principal do TextLink, define a estrutura do TextLink e usa atributos para o onColor e disabled. |
| a | Componente | Sim | Sim | Componente link padrão HTML. |
| em | Componente | Não | Sim | Componente icone padrão LiQUID. |

# Propriedades

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-on-color | boolean | false | Estado de mudança de cor para fundos escuros. |
| brad-disabled | boolean | false | Desabilita o component. |

# Acessibilidade

O comportamento da acessibilidade segue o mesmo do componente HTML, para ver a documentação completa clique aqui

# Exemplos
Default
```
<brad-text-link
      class="brad-font-paragraph-md brad-flex brad-flex-align-items-center"
      brad-on-color="false"
      brad-disabled="false">
    <a href="#" target="_blank">Link content</a>
</brad-text-link>
```
Com ícone
```
<brad-text-link
      class="brad-font-paragraph-md brad-flex brad-flex-align-items-center"
      brad-on-color="false"
      brad-disabled="false">
    <a href="#" target="_blank">Link content<em class="i icon-ui-placeholder brad-p-xs-l"></em></a>
</brad-text-link>
```