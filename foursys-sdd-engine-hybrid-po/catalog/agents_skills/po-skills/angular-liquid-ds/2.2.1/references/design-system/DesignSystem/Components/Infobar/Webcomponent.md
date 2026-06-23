# Infobar

O infobar é um componente feito para exibir mensagens de status em todo o aplicativo, fica na parte superior, logo após o header, É um componente altamente visível para os usuários, mas não são intrusivos. Existem algumas variações de cores e elementos para indicar facilmente o tipo de mensagem exibida, podendo conter uma frase, ícone, botão de fechar ou botão de hiperlink.

# Uso do Web Component

O Accordion web component possui vários componentes utilitários que ajudam a construir vários casos de uso.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-infobar | Componente | Sim | Não | Agrupa todos os outros componentes do Infobar |
| brad-infobar-icon | Sub-componente | Sim | Não | O icone padrão do componente ou um a sua escolha. |
| brad-infobar-text | Sub-componente | Sim | Não | Texto do corpo de componente |

# Propriedades
## brad-infobar

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-type | "info", "success", "warning", "error", "none" | none | Controla a variação de estilo da Infobar. |

# Acessibilidade

O comportamento da acessibilidade segue o mesmo do componente HTML, para ver a documentação completa clique aqui.

# Exemplos
## Tipos via controle

Use a story única InfobarTypes para visualizar e alterar dinamicamente todas as variações através do control type do Storybook:

# info
success
warning
error
default (sem cor e ícone específico)
## Infobar

Para utilizar o componente com um ícone e um background personalizados, basta não passar o atributo brad-type e personalizá-lo da maneira que preferir com as classes e os icones do liquid.

# Info

Para utilizar o componente com um ícone e cor "Info" basta passar o atributo brad-type="info";

```
<brad-infobar brad-type="info" brad-text="Esta é uma mensagem informativa importante." >
</brad-infobar>
```
## Success

Para utilizar o componente com um ícone e cor "Success" basta passar o atributo brad-type="success";

```
<brad-infobar brad-type="success" brad-text="Operação realizada com sucesso!" >
</brad-infobar>
```
## Warning

Para utilizar o componente com um ícone e cor "Warning" basta passar o atributo brad-type="warning";

```
<brad-infobar brad-type="warning" brad-text="Atenção: revise as informações antes de continuar." >
</brad-infobar>
```
## Error

Para utilizar o componente com um ícone e cor "Error" basta passar o atributo brad-type="error";

```
<brad-infobar brad-type="error" brad-text="Erro: não foi possível processar a solicitação." >
</brad-infobar>
```