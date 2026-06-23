# HTML

Um card é um container de conteúdo flexível e extensível. Ele tem opções para cabeçalhos e rodapés, uma larga variedade de conteúdo, cores de background contextuais e opções de display. .

# Uso do HTML
Estilos
## Card Static

Variação estática do card, apenas agrupa conteúdo visual. Pode conter elementos interativos em seu interior, mas sua área geral não é clicável.

```
<div class="brad-card brad-card--default brad-p-lg">
  <div>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  </div>
</div>
Copy
```


# Card Dragged

Este modelo de card pode ser pressionado e ao segurar, ele será elevado da interface, simulando que ele está sendo arrastado (foi desenvolvido para ser utilizado junto com a feature de drag and drop).

```
<div class="brad-card brad-card--dragged brad-p-lg">
  <div>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  </div>
</div>
Copy
```


# Card Interactive

Card clicável, toda sua área é interativa e quando há interação, ele realiza uma ação. De comum uso para navegação, levando o usuário para outra tela.

```
<div class="brad-card brad-card--interactive brad-p-lg">
  <div>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  </div>
</div>
Copy
```


# Card Selected

Utilizado para seleção, este modelo de card alterna entre o estado Default e Selected. Pode acompanhar componentes auxiliares para demonstrar seu comportamento, como checkbox e radio button.

```
<div class="brad-card brad-card--selected brad-card--selected--active brad-p-lg">
  <div>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
  </div>
</div>
Copy
```


# Card Ribbon

O card pode ter um ribbon (etiqueta) que fica sobreposto, que serve tanto para destacar conteúdos importantes, como também chamar a atenção do usuário. A largura do ribbon vai depender da borda aplicada.

```
<div class="brad-card brad-card--ribbon brad-ribbon-color-primary brad-p-lg">
  <div>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum bibendum diam a iaculis. Donec mauris mi, vehicula quis justo non, scelerisque suscipit felis. Praesent quis massa sed augue tempor molestie. Vestibulum sed dolor in erat finibus imperdiet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin ac maximus orci. Sed semper nibh nec ex ultricies, placerat dictum dolor auctor. Nunc non sollicitudin erat. Curabitur turpis risus, lobortis ac eleifend condimentum, iaculis nec orci. Sed imperdiet imperdiet nibh, eu aliquam purus dictum vel. Duis fermentum tincidunt leo, non varius arcu.</p>
  </div>
</div>
;
Copy
```


# Card Ribbon-Icon

O ribbon pode conter um ícone para complementar quando só a cor não for suficiente e for necessário dar mais destaque ao conteúdo. A cor do container e do ícone podem ser customizaveis dentro do projeto, neste exemplo o ícone está na cor branca brad-text-color-neutral-0.

```
<div class="brad-card brad-card--ribbon brad-card--default brad-p-lg brad-p-xxl-t">
  <div class="brad-card-ribbon-icon">
    <em class="icon-ui-placeholder brad-text-color-neutral-0"></em>
  </div>
  <div>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum bibendum diam a iaculis. Donec mauris mi, vehicula quis justo non, scelerisque suscipit felis. Praesent quis massa sed augue tempor molestie. Vestibulum sed dolor in erat finibus imperdiet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin ac maximus orci. Sed semper nibh nec ex ultricies, placerat dictum dolor auctor. Nunc non sollicitudin erat. Curabitur turpis risus, lobortis ac eleifend condimentum, iaculis nec orci. Sed imperdiet imperdiet nibh, eu aliquam purus dictum vel. Duis fermentum tincidunt leo, non varius arcu.</p>
  </div>
</div>
;
Copy
```


# Acessibilidade

Cards podem ser usados para uma variedade de cenários e possuem diferentes tipos de conteúdos. Por ser um componente flexível, o tratamento de acessibilidade adequado irá depender da sua finalidade.
Pode ser apropriado implementar tabindex neste elemento. Caso o card seja o elemento principal de interação pode-se usar tabindex=“0”; porém se o componente não fizer parte do fluxo, mas ainda assim puder receber foco, então usar tabindex=“-1”. Se o card for apenas decorativo não é necessário aplicar tabindex.
É importante salientar que mesmo o card sendo estático, todo seu conteúdo precisar ser verbalizado pelo leitor de tela e elementos acionáveis devem receber foco do leitor de tela e do teclado.


# Card Interactive

O card do tipo interativo é comumente usado para levar o usuário a outra página, se comportando como um link, por tanto precisa receber alguns atributos de acessibilidade como role=“link”.


# Card Selected

É importante informar para os usuários que utilizam tecnologia assistiva o estado de seleção do Card Selected, isso pode ser feito através do atributo aria-selected, seu valor deve ser alterado dinamicamente entre “true” e “false”. Incluir também a propriedade role=“option”.



# Exemplo
```
<div class="brad-theme-classic">
  <div
    class="brad-card brad-card--default brad-p-lg brad-card--overflow-hidden brad-card--auto "
  >
     <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
      erat a ante.
    </p>
  </div>
  </div>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |
| state | Altera o estado comportamental do card: default \| selected \| interactive \| dragged \| ribbon string | .card-brad--default | Choose option... default selected interactive dragged ribbon |
| selected | Adiciona classe que seleciona o card (card precisa ser do tipo selected): brad-card--selected--active boolean |  | FalseTrue |
| padding | Altera padding string |  | Choose option... brad-p-sm brad-p-lg brad-p-xxl |
| gradient | Altera cor do fundo com classe gradiente dos utilitários string | "" | Choose option... brad-color-primary-gradient-180 brad-color-secondary-gradient-180 |
| hasOpacity | Adicionar transparência para casos de fundo escuro ou colorido (conteúdo não recebe transparência) boolean | false | FalseTrue |
| ribbonColor | Altera cor da ribbon (e ribbon-icon, caso houver) string |  | Choose option... brad-ribbon-color-primary brad-ribbon-color-primary-light brad-ribbon-color-primary-xlight brad-ribbon-color-primary-dark brad-ribbon-color-secondary brad-ribbon-color-secondary-light brad-ribbon-color-secondary-xlight brad-ribbon-color-secondary-dark brad-ribbon-color-cta brad-ribbon-color-cta-light brad-ribbon-color-cta-xlight brad-ribbon-color-cta-dark brad-ribbon-color-extended-green brad-ribbon-color-extended-green-xlight brad-ribbon-color-extended-green-dark brad-ribbon-color-extended-blue brad-ribbon-color-extended-blue-xlight brad-ribbon-color-extended-blue-dark brad-ribbon-color-extended-purple brad-ribbon-color-extended-purple-xlight brad-ribbon-color-extended-purple-dark brad-ribbon-color-extended-violet brad-ribbon-color-extended-violet-xlight brad-ribbon-color-extended-violet-dark brad-ribbon-color-extended-salmon brad-ribbon-color-extended-salmon-xlight brad-ribbon-color-extended-salmon-dark brad-ribbon-color-extended-red brad-ribbon-color-extended-red-xlight brad-ribbon-color-extended-red-dark brad-ribbon-color-extended-yellow brad-ribbon-color-extended-yellow-xlight brad-ribbon-color-extended-yellow-dark brad-ribbon-color-alert-info brad-ribbon-color-alert-info-xlight brad-ribbon-color-alert-info-dark brad-ribbon-color-alert-success brad-ribbon-color-alert-success-xlight brad-ribbon-color-alert-success-dark brad-ribbon-color-alert-warning brad-ribbon-color-alert-warning-xlight brad-ribbon-color-alert-warning-dark brad-ribbon-color-alert-error brad-ribbon-color-alert-error-xlight brad-ribbon-color-alert-error-dark brad-ribbon-color-neutral-30 |
| hasRibbonIcon | O ribbon pode conter um icone para complementar quando só a cor não for suficiente e for necessário dar mais destaque ao conteúdo. boolean | false | FalseTrue |
| glass | Altera glassmorphism do elemento string |  | Choose option... brad-glass-light-sm brad-glass-light-md brad-glass-light-lg brad-glass-light-xl brad-glass-dark-sm brad-glass-dark-md brad-glass-dark-lg brad-glass-dark-xl |
| content | Utilizado para testar variações no conteúdo interno do componente string |  |  |

# STORIES
Default
```
<div class="brad-theme-classic">
  <div
    class="brad-card brad-card--default brad-p-lg brad-card--overflow-hidden brad-card--auto "
  >
     <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
      erat a ante.
    </p>
  </div>
  </div>
</div>
```
Static
```
<div class="brad-card brad-card--default brad-p-lg">
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
      erat a ante.
    </p>
  </div>
</div>
```
Dragged
```
<div class="brad-card brad-card--dragged brad-p-lg">
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
      posuere erat a ante.
    </p>
  </div>
</div>
```
Interactive
```
<div class="brad-card brad-card--interactive brad-p-lg">
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
      erat a ante.
    </p>
  </div>
</div>
```
Selected
```
<div
  class="brad-card brad-card--selected brad-card--selected--active brad-p-lg"
>
  <div>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
      posuere erat a ante.
    </p>
  </div>
</div>
```