# Flex

Gerencie rapidamente o layout, alinhamento e dimensionamento de linhas e colunas com flex-box.

```
<div class="brad-theme-classic">
  <section class="brad-m-lg-b">
    <div class="brad-flex brad-flex-row">
      <div
        class="brad-flex brad-flex-justify-content-start brad-flex-align-items-stretch brad-card brad-border-thick brad-rounded-none brad-shadow-0 brad-p-md"
      >
        <span class="brad-flex-align-self-stretch brad-border-thick-dash brad-p-xs"
          >1.1</span
        >
        <span class="brad-flex-align-self-stretch brad-border-thick-dash brad-p-md"
          >1.2</span
        >
      </div>
      <div
        class="brad-flex brad-flex-justify-content-start brad-flex-align-items-stretch brad-card brad-border-thick brad-rounded-none brad-shadow-0 brad-p-md"
      >
        <span class="brad-flex-align-self-stretch brad-border-thick-dash brad-p-xs"
          >2.1</span
        >
        <span class="brad-flex-align-self-stretch brad-border-thick-dash brad-p-md"
          >2.2</span
        >
      </div>
      <div
        class="brad-flex brad-flex-justify-content-start brad-flex-align-items-stretch brad-card brad-border-thick brad-rounded-none brad-shadow-0 brad-p-md"
      >
        <span class="brad-flex-align-self-stretch brad-border-thick-dash brad-p-xs"
          >3.1</span
        >
        <span class="brad-flex-align-self-stretch brad-border-thick-dash brad-p-md"
          >3.2</span
        >
      </div>
    </div>
  </section>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| flexDirection | Define a direção dos flex itens. Por padrão ele é row (linha), por isso quando o display: flex; é adicionado, os elementos ficam em linha, um do lado do outro. string |  | Choose option... row row-reverse column column-reverse wrap |
| justifyContent | Alinha os itens flex no container de acordo com a direção. A propriedade só funciona se os itens atuais não ocuparem todo o container. string |  | Choose option... start end center between around evenly |
| alignItems | O align-items alinha os flex itens de acordo com o eixo do container. O alinhamento é diferente para quando os itens estão em colunas ou linhas. string |  | Choose option... start end center baseline stretch |
| alignSelf | O align-self serve para definirmos o alinhamento específico de um único flex item dentro do nosso container. Caso um valor seja atribuído, ele passara por cima do que for atribuído no align-items do container. string |  | Choose option... start end center baseline stretch |