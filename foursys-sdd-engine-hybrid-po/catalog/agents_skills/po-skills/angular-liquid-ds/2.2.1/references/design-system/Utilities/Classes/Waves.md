# Waves

O utilitário waves tem a opção de exibir o desenho de ondas (brad-waves), visando uma interface mais amigável e com personalidade.
Ele irá compor o cabeçalho da aplicação, sempre colado ao topo e podendo ou não ter elemento(s) interno. O padding interno esta aberto a customização de acordo com necessidade da jornada. .
Atenção: o uso é recomendado apenas para o header expansivo ⚠️



# Uso do HTML

## Uso recomendado quando há header extendido:

```
<div class="brad-theme-classic">
  <div class="brad-waves brad-bg-color-primary">
    <div>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    </div>
  </div>
</div>
Copy
```

## Uso recomendado quando não há header extendido:

```
<div class="brad-theme-classic">
  <div class="brad-waves"></div>
</div>
Copy
```



Atenção: No tema do next, o background do header expansivo deve ser o brad-bg-color-neutral-60 ⚠️



# Exemplo
```
<div class="brad-theme-classic">
  <div class="brad-waves brad-bg-color-primary brad-text-color-on-bg-primary"><div class="content">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur.
    </p>
  </div></div>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| content | Altera o conteúdo do header. string |  |  |