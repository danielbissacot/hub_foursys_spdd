# FabIcon

O button-fab-icon sempre inicia no formato apenas com ícone e pode receber um gatilho para expandir sua forma horizontalmente e apresentar uma Label (o padding lateral também é alterado).
Para mudar o ícone basta alterar a classe icon-ui-placeholder da tag span e colocar outro ícone da biblioteca.
O gatilho para expandir sua forma horizontamente é remover a classe brad-btn-fab-icon--not-active.
.

# Uso do HTML
```
<button class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active">
  <em><em class="fab-icon i icon-ui-placeholder"></em></em>
  <div class="fab-text ">FAB-ICON</div>
</button>
Copy
```
## FAB-ICON


# Estilos
OnColor
```
<button class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--on-color brad-btn-fab-icon--not-active">
  <em><em class="fab-icon i icon-ui-placeholder"></em></em>
  <div class="fab-text ">FAB-ICON</div>
</button>
Copy
```
## FAB-ICON


# Active
```
<button class="brad-btn brad-btn-fab-icon brad-btn-floating">
  <em><em class="fab-icon i icon-ui-placeholder"></em></em>
  <div class="fab-text fab-text--active fab-text--active-opacity">FAB-ICON</div>
</button>
Copy
```
## FAB-ICON


# Disabled
```
<button class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active" disabled>
  <em><em class="fab-icon i icon-ui-placeholder"></em></em>
  <div class="fab-text">FAB-ICON</div>
</button>
Copy
```
## FAB-ICON


# Acessibilidade

O componente Button do Design System Liquid é construído de forma semântica, com a tag nativa do HTML <button>, contendo todas as features de acessibilidade por padrão.
Caso não seja possível utilizar HTML semântico, é necessário incluir JavaScript Event Listeners e atributos de acessibilidade como tabindex="0" para que o botão receba foco e role="button" para que o leitor de tela anuncie o elemento como um botão.



# Exemplo
```
<button
  class=" brad-btn brad-btn-fab-icon brad-btn-floating  brad-btn-fab-icon--not-active"
  
>
  <em><em class="fab-icon i icon-ui-placeholder"></em></em>
  <div class="fab-text ">FAB-ICON</div>
</button>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| backgroundColor | Altera cor de fundo string |  | Choose option... no-background-color brad-bg-color-primary brad-bg-color-secondary brad-bg-color-institucional |
| onColor | Estado de mudança de cor para fundos escuros. Obs: Ativando o modo on-color é recomendado alterar a cor do backgroundColor para primary, secondary ou gradient. boolean | - | FalseTrue |
| active | Estado de ativo boolean | - | FalseTrue |
| disabled | Estado de desabilitado boolean | - | FalseTrue |
| changeIcon | Ao mudar o ícone no componente só adicionar a propriedade ${eChangeIcon} na tag (em). E visualmente só adicionar o (nome do ícone) desejado no campo do storybook. string | - |  |