# ButtonAlert

O componente Button Alert é utilizado para confirmar uma ação do usuário, servindo como um "double-check" para conteúdos importantes, que podem ter consequências futuras. Recomendamos a aplicação do "Positive" e "Negative" em conjunto, sempre respeitando a ordem dos exemplos Vertical e Horizontal

# Uso do HTML

Abaixo está um exemplo de uso básico do componente Button Alert com HTML:

```
<button class="brad-btn brad-btn--alert-positive">
  Label
</button>
```
## Classes Variáveis

O componente ButtonAlert possui diferentes classes que modificam seu comportamento e estilo. Abaixo estão descritas essas variações e como aplicá-las.

# Variações de Estado

| Classe | Descrição |
| --- | --- |
| brad-btn--alert-positive | Aplica um estilo positivo ao botão. |
| brad-btn--alert-negative | Aplica um estilo negativo ao botão. |
| brad-btn--disabled | Desabilita o botão, removendo interações. |
| brad-btn--on-color | Variação on-color para utilização sobre fundos com cor. |

# Exemplos

Obs: Use o botão Show Code abaixo do exemplo para ver o HTML.

Para o uso do ButtonAlert é importante seguir a logica de implementação do código, e inserir as classes conforme os exemplos.

# Positive
```
<button class="brad-btn brad-btn--alert-positive">Texto</button>
```
Negative
```
<button class="brad-btn brad-btn--alert-negative">Texto</button>
```
Vertical
```
<div class="brad-flex brad-flex-column">
  <button class="brad-btn brad-btn--alert-positive brad-m-sm-b">Sim</button>
  <button class="brad-btn brad-btn--alert-negative">Não</button>
</div>
```
Horizontal
```
<div class="brad-flex">
  <button class="brad-btn brad-btn--alert-negative brad-m-sm-r">Não</button>
  <button class="brad-btn brad-btn--alert-positive">Sim</button>
</div>
```