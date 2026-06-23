# ChatAvatar

Imagem que pode representar uma pessoa, a BIA ou um assistente do chat.

# Uso do WebComponent
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-chat-avatar | Componente | Sim | Não | Componente principal do avatar, define a estrutura do avatar e usa atributos para tamanho e ícone. |

# Propriedades

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-size | "small", "medium" | "medium" | Define o tipo o tamanho do avatar. Os tamanhos disponíveis são "small" e "medium". |
| brad-icon | string | "icon-brand-bradesco" | Define o ícone do avatar. |


Acesse a documentação de ícones para verificar os valores disponíveis e utilizá-los no atribugo brad-icon.

# Exemplos

Obs: Use o botão Show code abaixo do exemplo para ver o HTML.

Para o uso do avatar é importante seguir a logica de implementação do código, inserir todas as tags obrigatórias na ordem conforme o exemplo.

# icon-brand-bradesco
Small
```
<brad-chat-avatar
  brad-size="sm"
  brad-icon="icon-brand-bradesco"
></brad-chat-avatar>
```
Medium
```
<brad-chat-avatar
  brad-size="md"
  brad-icon="icon-brand-bradesco"
></brad-chat-avatar>
```
icon-account-person
Small
```
<brad-chat-avatar
  brad-size="sm"
  brad-icon="icon-account-person"
></brad-chat-avatar>
```
Medium
```
<brad-chat-avatar
  brad-size="md"
  brad-icon="icon-account-person"
></brad-chat-avatar>
```