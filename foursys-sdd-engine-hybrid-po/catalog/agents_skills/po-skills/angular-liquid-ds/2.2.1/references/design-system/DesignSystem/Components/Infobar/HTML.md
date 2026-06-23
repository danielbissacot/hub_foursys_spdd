# Infobar

O infobar é um componente feito para exibir mensagens de status em todo o aplicativo, fica na parte superior, logo após o header, É um componente altamente visível para os usuários, mas não são intrusivos. Existem algumas variações de cores e elementos para indicar facilmente o tipo de mensagem exibida, podendo conter uma frase, ícone, botão de fechar ou botão de hiperlink.

# Uso do HTML
```
<div
class="brad-infobar brad-bg-color-neutral-10 brad-flex brad-flex-align-items-center"
>
<em class="brad-infobar__icon i icon-ui-placeholder brad-m-xs-r"></em>
<p class="brad-font-subtitle-xs brad-text-color-neutral-60">
  Lorem ipsum dolor sit amet consectetur adipisicing elit.
</p>
</div>
```
## Acessibilidade

Certifique-se de adicionar tabindex="0" ao parágrafo, <p>, que contem o texto do infobar. Esse atributo com valor "0" faz com que esse elemento seja focável por meio da navegação pelo teclado (como a tecla Tab) na ordem em que aparece no código HTML; possibilitando a identificação pelo leitor de tela.

```
<div
class="brad-infobar brad-infobar--warning brad-flex brad-flex-align-items-center"
>
<em class="brad-infobar__icon brad-m-xs-r"></em>
<p class="brad-font-subtitle-xs brad-text-color-neutral-60" tabindex="0">
  Texto_do_componente
</p>
</div>
```
Estilos
Info
```
<div
class="brad-infobar brad-infobar--info brad-flex brad-flex-align-items-center"
>
<em class="brad-infobar__icon brad-m-xs-r"></em>
<p class="brad-font-subtitle-xs brad-text-color-neutral-60">
  Lorem ipsum dolor sit amet consectetur adipisicing elit.
</p>
</div>
```
Success
```
<div
class="brad-infobar brad-infobar--success brad-flex brad-flex-align-items-center"
>
<em class="brad-infobar__icon brad-m-xs-r"></em>
<p class="brad-font-subtitle-xs brad-text-color-neutral-60">
  Lorem ipsum dolor sit amet consectetur adipisicing elit.
</p>
</div>
```
Warning
```
<div
class="brad-infobar brad-infobar--warning brad-flex brad-flex-align-items-center"
>
<em class="brad-infobar__icon brad-m-xs-r"></em>
<p class="brad-font-subtitle-xs brad-text-color-neutral-60">
  Lorem ipsum dolor sit amet consectetur adipisicing elit.
</p>
</div>
```
Error
```
<div
class="brad-infobar brad-infobar--error brad-flex brad-flex-align-items-center"
>
<em class="brad-infobar__icon brad-m-xs-r"></em>
<p class="brad-font-subtitle-xs brad-text-color-neutral-60">
  Lorem ipsum dolor sit amet consectetur adipisicing elit.
</p>
</div>
```
Comportamento Javascript
## Inicialização

## Inicialização não é necessária (componente nativo)

# Obervações
## Comportamento

Apenas no infobar default que é permitido fazer a alteração do ícone

# Responsividade

Largura do componente se adaptará com 100% da tela disponível

# Exemplo