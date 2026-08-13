# Text

O button-fab-icon sempre inicia no formato apenas com ícone e pode receber um gatilho para expandir sua forma horizontalmente e apresentar uma Label (o padding lateral também é alterado).
Para mudar o ícone basta alterar a classe icon-navigation-home da tag span e colocar outro ícone da biblioteca.
O gatilho para expandir sua forma horizontamente é remover a classe brad-btn-fab-icon--not-active.
.

# Uso do HTML
```
<button class="brad-btn brad-btn-text ">Button</button>
Copy
```
## Button


# Estilos
OnColor
```
<button class="brad-btn brad-btn-text brad-btn-text--on-color"><span>Button</span></button>
Copy
```
## Button


# Glass Light
```
<button class="brad-btn brad-btn-text brad-btn-text--glass-light">Button</button>
Copy
```
## Button


# Glass Dark
```
<button class="brad-btn brad-btn-text brad-btn-text--glass-dark">Button</button>
Copy
```
## Button


# Disabled
```
<button class="brad-btn brad-btn-text" disabled>Button</button>
Copy
```
## Button


# Acessibilidade

O componente Button do Design System Liquid é construído de forma semântica, com a tag nativa do HTML <button>, contendo todas as features de acessibilidade por padrão.
Caso não seja possível utilizar HTML semântico, é necessário incluir JavaScript Event Listeners e atributos de acessibilidade como tabindex="0" para que o botão receba foco e role="button" para que o leitor de tela anuncie o elemento como um botão.



# Exemplo
```
<button
  class="brad-btn brad-btn-text    "
  
>
  <!-- SEM TRAILING ICON -->
  <span>Button</span>
  
</button>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| backgroundColor | Altera cor de fundo string |  | Choose option... no-background-color brad-bg-color-primary brad-bg-color-secondary brad-bg-color-institucional |
| onColor | Estado de mudança de cor para fundos escuros. Obs: Ativando o modo on-color é recomendado alterar a cor do backgroundColor para primary, secondary ou gradient. boolean |  | FalseTrue |
| label | Texto do botão string |  |  |
| iconName | Filtre ícone pelo nome da classe string | - |  |
| iconPosition | Posição do ícone ('left' para esquerda, 'right' para direita) string |  | Choose option... left right |
| glass | Estado com glassmorphism aplicado ao botão string |  | Choose option... none light dark |
| disabled | Estado de desabilitado boolean |  | FalseTrue |
| widthAuto | Define a largura do componente boolean |  | FalseTrue |
| noBackground | Retira o background e padding do botão boolean |  | FalseTrue |