# Info

O componente ButtonInfo é um tipo de botão com contexto de uso bem específico. Ele é utilizado quando é necessário abrir algum conteúdo informativo através de Popover, Modal, Bottom Sheet e até uma nova tela.
Para mudar o ícone basta selecionar uma das classes disponíveis: icon-component-question-mark e icon-component-question-mark.
.

# Uso do HTML
```
<div class="brad-flex brad-flex-align-items-center">
  <button class="brad-btn brad-btn-info i icon-component-question-mark"></button>
</div>
Copy
```


# Estilos
OnColor
```
<div class="brad-flex brad-flex-align-items-center">
  <button class="brad-btn brad-btn-info brad-btn-info--on-color i icon-component-info-mark"></button>
</div>
Copy
```


# Disabled
```
<div class="brad-flex brad-flex-align-items-center">
  <button class="brad-btn brad-btn-info i icon-component-question-mark" disabled></button>
</div>
Copy
```


# Acessibilidade

O componente Button do Design System Liquid é construído de forma semântica, com a tag nativa do HTML <button>, contendo todas as features de acessibilidade por padrão. Para o Button Info deve-se acrescentar o atributo aria-label no elemento <button> informando a ação que esse botão irá executar.
Caso não seja possível utilizar HTML semântico, é necessário incluir JavaScript Event Listeners e atributos de acessibilidade como tabindex="0" para que o botão receba foco e role=button para que o leitor de tela anuncie o elemento como um botão.



# Exemplo
```
<div class="brad-flex brad-flex-align-items-center">
  <button
    class="brad-btn brad-btn-info  i icon-component-question-mark"
    
  ></button>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| backgroundColor | Altera cor de fundo string |  | Choose option... no-background-color brad-bg-color-primary brad-bg-color-secondary brad-bg-color-institucional |
| onColor | Estado de mudança de cor para fundos escuros. Obs: Ativando o modo on-color é recomendado alterar a cor do backgroundColor para primary, secondary ou gradient. boolean |  | FalseTrue |
| changeIcon | Essa opção alterna entre as duas opções de ícone disponíveis para o componente: icon-component-question-mark e icon-component-info-mark string | - | Choose option... icon-component-question-mark icon-component-info-mark |
| disabled | Estado de desabilitado boolean | - | FalseTrue |