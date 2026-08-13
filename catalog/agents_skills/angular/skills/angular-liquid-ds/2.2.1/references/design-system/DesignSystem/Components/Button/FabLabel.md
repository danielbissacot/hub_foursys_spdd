# FabLabel

O button-fab-label sempre inicia no formato apenas com label e pode receber um gatilho para expandir sua forma horizontalmente e apresentar um ícone (o padding lateral também é alterado).
Para mudar o ícone basta alterar a classe icon-ui-placeholder da tag span e colocar outro ícone da biblioteca.
O gatilho para expandir sua forma horizontamente é remover a classe brad-btn-fab-label--not-active.
.

# Uso do HTML
```
<button class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--not-active">
  <em class="fab-icon i"><em class="fab-icon i icon-ui-placeholder"></em></em>
  <div class="fab-text">FAB-LABEL</div>
</button>
Copy
```
## FAB-LABEL


# Estilos
OnColor
```
<button class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--on-color brad-btn-fab-label--not-active">
  <em class="fab-icon i"><em class="fab-icon i icon-ui-placeholder "></em></em>
  <div class="fab-text">FAB-LABEL</div>
</button>
Copy
```
## FAB-LABEL


# Active
```
<button class="brad-btn brad-btn-fab-label brad-btn--floating">
  <em class="fab-icon i fab-icon--active fab-icon--active-opacity"><em class="fab-icon i fab-icon--active fab-icon--active-opacity icon-ui-placeholder "></em></em>
  <div class="fab-text fab-text--active">FAB-LABEL</div>
</button>
Copy
```
## FAB-LABEL


# Disabled
```
<button class="brad-btn brad-btn-fab-label brad-btn--floating brad-btn-fab-label--not-active" disabled>
  <em class="fab-icon i"><em class="fab-icon i icon-ui-placeholder "></em></em>
  <div class="fab-text">FAB-LABEL</div>
</button>
Copy
```
## FAB-LABEL


# Acessibilidade

O componente Button do Design System Liquid é construído de forma semântica, com a tag nativa do HTML <button>, contendo todas as features de acessibilidade por padrão.
Caso não seja possível utilizar HTML semântico, é necessário incluir JavaScript Event Listeners e atributos de acessibilidade como tabindex="0" para que o botão receba foco e role="button" para que o leitor de tela anuncie o elemento como um botão.



# Exemplo
```
<button
  class="brad-btn brad-btn-fab-label brad-btn--floating   brad-btn-fab-label--not-active"
  
>
  <em class="fab-icon i "><em
    class="fab-icon i  icon-ui-placeholder "
  ></em></em>
  <div class="fab-text ">FAB-LABEL</div>
</button>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| backgroundColor | Altera cor de fundo string |  | Choose option... no-background-color brad-bg-color-primary brad-bg-color-secondary brad-bg-color-institucional |
| onColor | Estado de mudança de cor para fundos escuros. Obs: Ativando o modo on-color é recomendado alterar a cor do backgroundColor para primary, secondary ou gradient. boolean |  | FalseTrue |
| changeIcon | Ao mudar o ícone no componente só adicionar a propriedade ${eChangeIcon} na tag (em). E visualmente só adicionar o (nome do ícone) desejado no campo do storybook. string | - |  |
| active | Estado de ativo boolean |  | FalseTrue |
| disabled | Estado de desabilitado boolean |  | FalseTrue |