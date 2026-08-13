# Icon

O button-icon sempre inicia com ícone e uma label vinculada.
Para mudar o ícone basta alterar a classe icon-ui-placeholder da tag span e colocar outro ícone da biblioteca.
.

# Uso do HTML
```
<div class="brad-flex brad-flex-align-items-center">
  <button class="brad-btn brad-btn-icon">
    <em class="btn-icon i icon-ui-placeholder"></em>
  </button>
  <p class="brad-label">Button</p>
</div>
Copy
```

# Button



# Estilos
OnColor
```
<div class="brad-flex brad-flex-align-items-center">
  <button class="brad-btn brad-btn-icon brad-btn-icon--on-color">
    <em class="btn-icon i icon-ui-placeholder"></em>
  </button>
  <p class="brad-label">Button</p>
</div>
Copy
```

# Button



# Glass Light
```
<div class="brad-flex brad-flex-align-items-center">
  <button class="brad-btn brad-btn-icon brad-btn-icon--glass-light">
    <em class="btn-icon i icon-ui-placeholder"></em>
  </button>
  <p class="brad-label">Button</p>
</div>
Copy
```

# Button



# Glass Dark
```
<div class="brad-flex brad-flex-align-items-center">
  <button class="brad-btn brad-btn-icon brad-btn-icon--glass-dark">
    <em class="btn-icon i icon-ui-placeholder"></em>
  </button>
  <p class="brad-label">Button</p>
</div>
Copy
```

# Button



# Disabled
```
<div class="brad-flex brad-flex-align-items-center">
  <button class="brad-btn brad-btn-icon" disabled>
    <em class="btn-icon i icon-ui-placeholder"></em>
  </button>
  <p class="brad-label">Button</p>
</div>
Copy
```

# Button



# Acessibilidade

O componente Button do Design System Liquid é construído de forma semântica, com a tag nativa do HTML <button>, contendo todas as features de acessibilidade por padrão. É importante relacionar a label com o botão, para isso pode-se usar o atributo aria-labelledby na tag <button> seu valor é o id da tag <p>.

```
<button class="brad-btn brad-btn-icon" aria-labelledby="label">
  <em class="btn-icon i icon-ui-placeholder"></em>
</button>
<p id="label" class="brad-label">Button</p>
Copy
```

Caso o Button Icon não tenha uma label visível, então é importante acrescentar o atributo aria-label no elemento <button> informando a ação que esse botão irá executar.

```
<button class="brad-btn brad-btn-icon" aria-label="Button">
  <em class="btn-icon i icon-ui-placeholder"></em>
</button>
Copy
```

Não sendo possível utilizar HTML semântico, é necessário incluir JavaScript Event Listeners e atributos de acessibilidade como tabindex="0" para que o botão receba foco e role="button" para que o leitor de tela anuncie o elemento como um botão.



# Exemplo
```
<div class="brad-flex brad-flex-align-items-center">
  <button
    class="brad-btn brad-btn-icon  "
    
  >
    <em class="btn-icon i icon-ui-placeholder brad-btn-icon__size-xxs"></em>
  </button>

  <p class="brad-label">Button</p>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| backgroundColor | Altera cor de fundo string |  | Choose option... no-background-color brad-bg-color-primary brad-bg-color-secondary brad-bg-color-institucional |
| onColor | Estado de mudança de cor para fundos escuros. Obs: Ativando o modo on-color é recomendado alterar a cor do backgroundColor para primary, secondary ou gradient boolean |  | FalseTrue |
| label | Texto do botão string | - |  |
| changeIcon | Ao mudar o ícone no componente só adicionar a propriedade ${eChangeIcon} na tag (em). E visualmente só adicionar o (nome do ícone) desejado no campo do storybook. string | - |  |
| iconSize | Altera tamanho do ícone string |  | Choose option... brad-icon-size-xxs brad-icon-size-sm brad-icon-size-md brad-icon-size-lg brad-icon-size-xl brad-icon-size-xxl |
| glass | Estado com glassmorphism aplicado ao botão string |  | Choose option... none light dark |
| disabled | Estado de desabilitado boolean | - | FalseTrue |