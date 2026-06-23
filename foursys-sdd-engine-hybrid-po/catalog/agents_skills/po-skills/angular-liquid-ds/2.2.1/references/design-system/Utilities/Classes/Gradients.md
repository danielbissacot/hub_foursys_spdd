# Gradients

A biblioteca possui classes para o uso dos gradientes de segmentos, e essas classes devem ser combinadas com uma das variáveis de ângulo. .

# Variáveis (deg):
```
45, 90, 135, 180, 225, 270, 315, 360
Copy
```
Classes:
```
.brad-color-primary-gradient-${deg}
.brad-color-secondary-gradient-${deg}
Copy
```
Uso do HTML
```
<div class="brad-color-secondary-gradient-45">.brad-color-secondary-gradient-45</div>
Copy
```



# Exemplo
```
<div class="brad-theme-classic">
  <section class="brad-m-lg-b">
    <div class="examples">
      <div
        class="brad-card brad-p-md
                  brad-color-primary-gradient-45 brad-text-color-neutral-0"
      >
        brad-color-primary-gradient-45
      </div>
    </div>
  </section>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| gradient | string | - | Choose option... brad-color-primary-gradient brad-color-secondary-gradient brad-color-institucional-gradient brad-color-extended-blue-gradient brad-color-extended-yellow-gradient brad-color-extended-green-gradient brad-color-extended-red-gradient brad-color-extended-violet-gradient brad-color-extended-purple-gradient brad-color-extended-salmon-gradient |
| degree | string | - | Choose option... 45 90 135 180 225 270 315 360 |