# HTML

Os links são usados como elementos de navegação e podem ser usados sozinhos, acompanhados de ícones ou alinhados com o texto. Eles fornecem uma opção leve para navegação, mas devemos evitar muitos links em um curto espaço para não sobrecarregar a página / app.
.

# Uso do HTML
```
<div class=" brad-font-paragraph-md">
  <a href="" target="_blank" class="brad-text-link">Enabled</a>
</div>
Copy
```
Comportamento Javascript
## Inicialização

## Inicialização não é necessária (componente nativo)

# Acessibilidade

O componente TextLink do Design System Liquid é construído de forma semântica, com a tag nativa do HTML <a>, contendo todas as features de acessibilidade por padrão.
Caso não seja possível utilizar HTML semântico, é necessário incluir JavaScript Event Listeners e atributos de acessibilidade como tabindex="0" para que o Textlink receba foco e role="link" para que o leitor de tela anuncie o elemento como um link.

# Exemplo
```
<div class="brad-font-paragraph-md brad-flex brad-flex-align-items-center">
  <a
    href=""
    target="_blank"
    class="brad-text-link  "
  >
    Enabled<em
      class="i icon-ui-placeholder   brad-p-xs-l"
    ></em
  ></a>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| backgroundColor | Altera cor de fundo string |  | Choose option... no-background-color brad-bg-color-primary brad-bg-color-secondary brad-bg-color-institucional |
| onColor | Estado de mudança de cor para fundos escuros. Obs: Ativando o modo on-color é recomendado alterar a cor do background do storybook para on-color no ícone de galeria no canto superior esquerdo. boolean |  | FalseTrue |
| content | Conteúdo do text-link string |  |  |
| disabled | Estado de desabilitado boolean |  | FalseTrue |