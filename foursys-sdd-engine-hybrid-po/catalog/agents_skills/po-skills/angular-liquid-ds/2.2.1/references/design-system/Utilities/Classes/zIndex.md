# zIndex

O Z-index é uma propriedade CSS que controla a ordem de empilhamento dos elementos em uma página web.

Z-index é uma parte importante de como nossos componentes serão sobrepostos dos outros, com essa importância, vimos a necessidade de padronizar os valores de alguns componentes, para possuirmos um controle melhor dos nossos layouts.

Não incentivamos a personalização desses valores; se você mudar um, você provavelmente precisará mudar todos os outros.

# Uso do HTML
```
<!-- Utilização de classes border -->
<div class="brad-card brad-zindex--1000">.brad-zindex--1000</div>
```

| Classes | Valor | Aplicação das classes |
| --- | --- | --- |
| brad-zindex--1000 | 1000 | Valor fixo do zIndex |
| brad-zindex--1020 | 1020 | Valor normalmente utilizado em dropdown e popover |
| brad-zindex--1040 | 1040 | Valor normalmente utilizado no overlay |
| brad-zindex--1060 | 1060 | Valor normalmente utilizado no bottom sheet |
| brad-zindex--1080 | 1080 | Valor normalmente utilizado no modal |
| brad-zindex--2000 | 2000 | Valor que sobrepõe o modal e o bottom sheet |
| brad-zindex--2020 | 2020 | Valor normalmente utilizado no snackbar |
| brad-zindex--2040 | 2040 | Valor normalmente utilizado no side sheet |

```
<div class="brad-card brad-card--default brad-p-lg brad-zindex--1000">.brad-zindex--1000 </div>
```