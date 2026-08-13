# Border

Classes de border e radius disponibilizadas para uso conforme os padrões do Liquid.
.

# Uso do HTML
Border
```
<!-- Utilização de classes border -->
<div class="brad-card brad-p-md brad-border-thick">.brad-border-thick</div>
Copy
```
Rounded (radius)
```
<!-- Utilização de classes rounded (radius) -->
<div class="brad-card brad-p-md brad-border-thick">.brad-border-thick</div>
Copy
```
## Como determinar propriedade

| Propriedade | Descrição | Aplicação das classes |
| --- | --- | --- |
| border | Para as classes que definem border | brad-border-[variação] |
| rounded | Para as classes que definem border-radius | brad-rounded-[variação] |

# Como determinar border

| Variação | Descrição | Exemplo |
| --- | --- | --- |
| none | Não exibe borda | none |
| hairline | Exibe uma linha única em todos os cantos com 1px de espessura | hairline |
| hairline-t | Exibe uma linha única em cima com 1px de espessura | hairline-t |
| hairline-l | Exibe uma linha única no canto esquerdo com 1px de espessura | hairline-l |
| hairline-r | Exibe uma linha única no canto direito com 1px de espessura | hairline-r |
| hairline-b | Exibe uma linha única embaixo com 1px de espessura | hairline-b |
| thin | Exibe uma linha única em todos os cantos com 1,4px de espessura | thin |
| thin-t | Exibe uma linha única em cima com 1,4px de espessura | thin-t |
| thin-l | Exibe uma linha única no canto esquerdo com 1,4px de espessura | thin-l |
| thin-r | Exibe uma linha única no canto direito com 1,4px de espessura | thin-r |
| thin-b | Exibe uma linha única embaixo com 1,4px de espessura | thin-b |
| thick | Exibe uma linha única em todos os cantos com 2px de espessura | thick |
| thick-t | Exibe uma linha única em cima com 2px de espessura | thick-t |
| thick-l | Exibe uma linha única no canto esquerdo com 2px de espessura | thick-l |
| thick-r | Exibe uma linha única no canto direito com 2px de espessura | thick-r |
| thick-b | Exibe uma linha única embaixo com 2px de espessura | thick-b |
| thick-dash | Exibe uma série de traços curtos em todos os cantos com 2px de espessura | thick-dash |
| thick-dash-t | Exibe uma série de traços curtos em cima com 2px de espessura | thick-dash-t |
| thick-dash-l | Exibe uma série de traços curtos no canto esquerdo com 2px de espessura | thick-dash-l |
| thick-dash-r | Exibe uma série de traços curtos no canto direito com 2px de espessura | thick-dash-r |
| thick-dash-b | Exibe uma série de traços curtos única embaixo com 2px de espessura | thick-dash-b |


É possível utilizar mais de uma variação no mesmo elemento, por exemplo, em cima e na esquerda, da seguinte maneira:

```
<div class="brad-card brad-p-md brad-border-thick-t brad-border-thick-l">.brad-border-thick-t && .brad-border-thick-l</div>
Copy
```
## Como determinar rounded (radius)

| Variação | Tamanho | Exemplo |
| --- | --- | --- |
| none | 0px | none |
| xxs | 2px | xxs |
| xs | 4px | xs |
| sm | 8px | sm |
| md | 12px | md |
| lg | 16px | lg |
| pill | 999px (pílula) | pill |

# Exemplo
```
<div class="brad-theme-classic">
  <section class="brad-m-lg-b">
    <div class="examples">
      <div class="brad-card brad-p-md brad-m-xs-b brad-border-none brad-border-color-primary">
        brad-border-none
      </div>
      <div class="brad-card brad-p-md brad-rounded-none">brad-rounded-none</div>
    </div>
  </section>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| border | Altera borda string |  | Choose option... brad-border-none brad-border-hairline brad-border-hairline-t brad-border-hairline-l brad-border-hairline-r brad-border-hairline-b brad-border-thin brad-border-thin-t brad-border-thin-l brad-border-thin-r brad-border-thin-b brad-border-thick brad-border-thick-t brad-border-thick-l brad-border-thick-r brad-border-thick-b brad-border-thick-dash brad-border-thick-dash-t brad-border-thick-dash-l brad-border-thick-dash-r brad-border-thick-dash-b |
| borderColor | Altera cor da borda string |  | Choose option... brad-border-color- brad-border-color-on-bg-primary brad-border-color-on-bg-secondary brad-border-color-primary brad-border-color-primary-light brad-border-color-primary-xlight brad-border-color-primary-dark brad-border-color-secondary brad-border-color-secondary-light brad-border-color-secondary-xlight brad-border-color-secondary-dark brad-border-color-institucional brad-border-color-institucional-light brad-border-color-institucional-xlight brad-border-color-institucional-dark brad-border-color-tertiary brad-border-color-cta brad-border-color-cta-light brad-border-color-cta-xlight brad-border-color-cta-dark brad-border-color-extended-green brad-border-color-extended-green-xlight brad-border-color-extended-green-dark brad-border-color-extended-blue brad-border-color-extended-blue-xlight brad-border-color-extended-blue-dark brad-border-color-extended-purple brad-border-color-extended-purple-xlight brad-border-color-extended-purple-dark brad-border-color-extended-violet brad-border-color-extended-violet-xlight brad-border-color-extended-violet-dark brad-border-color-extended-salmon brad-border-color-extended-salmon-xlight brad-border-color-extended-salmon-dark brad-border-color-extended-red brad-border-color-extended-red-xlight brad-border-color-extended-red-dark brad-border-color-extended-yellow brad-border-color-extended-yellow-xlight brad-border-color-extended-yellow-dark brad-border-color-alert-info brad-border-color-alert-info-light brad-border-color-alert-info-xlight brad-border-color-alert-info-dark brad-border-color-alert-success brad-border-color-alert-success-light brad-border-color-alert-success-xlight brad-border-color-alert-success-dark brad-border-color-alert-warning brad-border-color-alert-warning-light brad-border-color-alert-warning-xlight brad-border-color-alert-warning-dark brad-border-color-alert-error brad-border-color-alert-error-light brad-border-color-alert-error-xlight brad-border-color-alert-error-dark brad-border-color-neutral-100 brad-border-color-neutral-60 brad-border-color-neutral-50 brad-border-color-neutral-40 brad-border-color-neutral-30 brad-border-color-neutral-20 brad-border-color-neutral-10 brad-border-color-neutral-05 brad-border-color-neutral-0 |
| radius | Altera arredondamento string |  | Choose option... brad-rounded-none brad-rounded-xxs brad-rounded-xs brad-rounded-sm brad-rounded-md brad-rounded-lg brad-rounded-pill |

# STORIES
Border
```
<div class="brad-theme-classic">
  <section class="brad-m-lg-b">
    <div class="examples">
      <div class="brad-card brad-p-md brad-m-xs-b brad-border-none brad-border-color-primary">
        brad-border-none
      </div>
      <div class="brad-card brad-p-md brad-rounded-none">brad-rounded-none</div>
    </div>
  </section>
</div>
```
Border Top Left
```
<div class="brad-theme-classic">
  <div
    class="brad-card brad-p-md brad-border-thick-t brad-border-thick-l brad-border-color-cta"
  >
    .brad-border-thick-t && .brad-border-thick-l
  </div>
</div>
```
Border Right Bottom
```
<div class="brad-theme-classic">
  <div
    class="brad-card brad-p-md brad-border-thick-r brad-border-thick-b brad-border-color-cta"
  >
    .brad-border-thick-r && .brad-border-thick-b
  </div>
</div>
```