# SkeletonLoader

O skeleton é utilizado para fornecer feedback visual aos usuários enquanto o conteúdo real como textos ou imagens ainda não foi carregado completamente, ou seja ele representa uma prévia do que será exibido. Seu objetivo é melhorar a experiência do usuário e reduzir a sensação de que o tempo de espera é muito longo e deve representar com simplicidade o conteúdo que será exibido.
É fundamental que sua estrutura seja semelhante ao conteúdo real para que os usuários possam entender como será a aparência final da página.
.


| Sizes | Value |
| --- | --- |
| xxs | 1rem (16px) |
| xs | 1.5rem (24px) |
| sm | 2rem (32px) |
| md | 2.5rem (40px) |
| lg | 3rem (48px) |
| xl | 3.5rem (56px) |
| xxl | 8rem (128px) |

# Exemplo
```
<div class="brad-theme-classic brad-bg-color-neutral-0 brad-p-lg">
  <em class="
    brad-skeleton
    
    brad-skeleton-sm--circle"
  ></em>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| onColor | Estado de mudança de cor para fundos escuros. Obs: Ativando o modo on-color é recomendado alterar a cor do background do storybook para on-color no ícone de galeria no canto superior esquerdo. boolean |  | FalseTrue |
| size | Altera a altura do elemento string | sm | Choose option... xxs xs sm md lg xl xxl |
| shape | Altera a forma do elemento string | circle | Choose option... circle pill rounded flat |