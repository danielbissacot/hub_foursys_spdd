# Default

É um componente que comunica ações que o usuário pode realizar. Seus diferentes tipos, usados em conjunto, hierarquizam uma ação em detrimento de outra(s).
.

# Uso do HTML
Estilos
Positive
```
<!-- Uso padrão -->
<button class="brad-btn brad-btn brad-btn--alert-positive">Button</button>
Copy
```
## Button




# Estilos
Secondary
```
<!-- Uso secondário -->
<button class="brad-btn brad-btn-secondary">Button</button>
Copy
```
## Button




# Tertiary
```
<!-- Uso terciário -->
<button class="brad-btn brad-btn-tertiary">Button</button>
Copy
```
## Button




# Tamanho [default | md]
Variações
hierarchy: [primary | secondary | tertiary]
size: [default | md]
## classes:

## .brad-btn-[hierarchy] .brad-btn-[hierarchy]--[size]


# Observações:

Caso queira utilizar o tamanho default, não precisa adicionar nenhuma classe de size

```
<!-- Uso default com tamanho md -->
<button class="brad-btn brad-btn-primary brad-btn-primary--md">Button</button>
Copy
```
## Button


# Acessibilidade

O componente Button do Design System Liquid é construído de forma semântica, com a tag nativa do HTML <button>, contendo todas as features de acessibilidade por padrão.
Caso não seja possível utilizar HTML semântico, é necessário incluir JavaScript Event Listeners e atributos de acessibilidade como tabindex="0" para que o botão receba foco e role="button" para que o leitor de tela anuncie o elemento como um botão.



# Exemplo
```
<button
  class="brad-btn brad-btn-primary "
  
>
   Button
</button>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| backgroundColor | Altera cor de fundo string |  | Choose option... no-background-color brad-bg-color-primary brad-bg-color-secondary brad-bg-color-institucional |
| onColor | Estado de mudança de cor para fundos escuros. Obs: Ativando o modo on-color é recomendado alterar a cor do backgroundColor para primary, secondary ou gradient. boolean |  | FalseTrue |
| label | Texto do botão string |  |  |
| type | Tipo do botão string |  | Choose option... brad-btn-primary brad-btn-secondary brad-btn-tertiary |
| hasFloating | Adicionar sombra ao botão (floating) boolean |  | FalseTrue |
| size | Tamanho do botão string |  | Choose option... default md sm |
| disabled | Estado desabilitado boolean |  | FalseTrue |
| widthAuto | Define a largura do componente boolean |  | FalseTrue |
| hasIcon | Adiciona ícone ao botão boolean |  | FalseTrue |
| iconName | Filtre ícone pelo nome da classe string | - |  |