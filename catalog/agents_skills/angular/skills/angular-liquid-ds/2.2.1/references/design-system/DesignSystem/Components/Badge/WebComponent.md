# Badge

É um componente que sinaliza que uma ou mais informações estão disponíveis dentro de um certo grupo, como por exemplo: notificações.

# Uso do WebComponent
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-badge | Componente | Sim | Não | Componente principal da badge, define a estrutura do badge e usa atributos para o tipo, cores, borda e valor. |

# Propriedades

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-type | "number", "dot" | "number" | O (number) é utilizado para sinalizar algo importante ou categorizar itens ou agrupamentos dentro de um contexto. E o (dot) não determina a quantidade de informações, apenas sinaliza. |
| brad-color | "extended-red[0]", "extended-red-xlight[0]", "extended-green[0]", "extended-green-dark[0]", "extended-green-xlight[0]", "extended-blue-dark[0]", "extended-blue-xlight[0]", "extended-yellow[0]", "extended-yellow-xlight[0]", "extended-purple[0]", "extended-purple-xlight[0]", "extended-violet[0]", "extended-salmon[0]" | "extended-red[0]" | Define o tipo de badge, o qual afeta as cores de background e foreground. |
| brad-without-border | boolean | false | Se ativado, torna a borda transparente. |
| brad-value | number | 0 | Valor que aparece dentro da badge. |

# Exemplos
Default
```
<brad-badge
  id=O16480714068
  brad-type="number"
  brad-color="extended-red[0]"
  
  brad-max-value="0"
  brad-value="1"
></brad-badge>
```