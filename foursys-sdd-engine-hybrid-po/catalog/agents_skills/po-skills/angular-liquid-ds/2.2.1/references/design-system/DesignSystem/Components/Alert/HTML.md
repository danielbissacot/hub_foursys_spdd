# Alert

A função do alerta é notificar o usuário sobre informações urgentes que exigem atenção imediata e quando ele for realizar ações Irreversíveis.

# Uso do HTML
Estilos
Info
```
<div class="brad-alert brad-alert--info">
<div class="brad-alert__icon">
  <em class="icon-feedback-alert-orientation d-flex"></em>
</div>

<div class="brad-alert__content">
  <h1 class="brad-alert__title brad-font-title-md">Title</h1>

  <div class="brad-alert__body">
    <div class="brad-alert__body__middle brad-font-paragraph-sm">
      Alert body text goes here.
    </div>

    <button
      class="brad-alert__link brad-btn brad-btn-text brad-btn-text--no-bg brad-btn--auto"
    >
      <span>Link</span>
    </button>
  </div>

</div>
</div>
```
Success
```
<div class="brad-alert brad-alert--success">
<div class="brad-alert__icon">
  <em class="icon-feedback-alert-success d-flex"></em>
</div>

<div class="brad-alert__content">
  <h1 class="brad-alert__title brad-font-title-md">Title</h1>

  <div class="brad-alert__body">
    <div class="brad-alert__body__middle brad-font-paragraph-sm">
      Alert body text goes here.
    </div>

    <button
      class="brad-alert__link brad-btn brad-btn-text brad-btn-text--no-bg brad-btn--auto"
    >
      <span>Link</span>
    </button>
  </div>

</div>
</div>
```
Warning
```
<div class="brad-alert brad-alert--warning">
<div class="brad-alert__icon">
  <em class="icon-feedback-alert-warning d-flex"></em>
</div>

<div class="brad-alert__content">
  <h1 class="brad-alert__title brad-font-title-md">Title</h1>

  <div class="brad-alert__body">
    <div class="brad-alert__body__middle brad-font-paragraph-sm">
      Alert body text goes here.
    </div>

    <button
      class="brad-alert__link brad-btn brad-btn-text brad-btn-text--no-bg brad-btn--auto"
    >
      <span>Link</span>
    </button>
  </div>

</div>
</div>
```
Error
```
<div class="brad-alert brad-alert--error">
<div class="brad-alert__icon">
  <em class="icon-feedback-alert-error d-flex"></em>
</div>

<div class="brad-alert__content">
  <h1 class="brad-alert__title brad-font-title-md">Title</h1>

  <div class="brad-alert__body">
    <div class="brad-alert__body__middle brad-font-paragraph-sm">
      Alert body text goes here.
    </div>

    <button
      class="brad-alert__link brad-btn brad-btn-text brad-btn-text--no-bg brad-btn--auto"
    >
      <span>Link</span>
    </button>
  </div>

</div>
</div>
```
## Tipos de alerta

| Classe do background | Classe do ícone |
| --- | --- |
| brad-alert--info | icon-feedback-alert-orientation |
| brad-alert--success | icon-feedback-alert-sucess |
| brad-alert--warning | icon-feedback-alert-warning |
| brad-alert--error | icon-feedback-alert-error |

# Obervações

Caso não indicar nenhuma classe de tipo [brad-alert--info, brad-alert--success, brad-alert--warning, brad-alert--error], o alerta ficará transparente esperando alguma classe de background-color.

# Acessibilidade

As cores de cada Alert são apenas indicadores visuais e não serão informadas aos leitores de telas, por isso é necessário que as informações passadas pela cor estejam obvias no próprio conteúdo ou sejam incluídas através de texto oculto adicional.

Caso haja um elemento que receba alguma ação dentro do Alert, esse deve ter um tabindex="0" para possibilitar o acesso com teclado.

# Exemplos
Default
```
<div class="brad-alert brad-alert--info">
  <div class="brad-alert__icon">
    <em class="icon-feedback-alert-orientation d-flex"></em>
  </div>

  <div class="brad-alert__content">
    <h1 class="brad-alert__title brad-font-title-md">
    Title
  </h1>
    <div class="brad-alert__body">
      <div class="brad-alert__body__middle brad-font-paragraph-sm">
        Alert body text goes here.
      </div>
      <button
    class="brad-alert__link brad-btn brad-btn-text brad-btn-text--no-bg brad-btn--auto"
  >
    <span>Link</span>
  </button>
    </div>
  </div>
</div>
```
No Link
```
<div class="brad-alert brad-alert--success">
  <div class="brad-alert__icon">
    <em class="icon-feedback-alert-success d-flex"></em>
  </div>

  <div class="brad-alert__content">
    <h1 class="brad-alert__title brad-font-title-md">Title</h1>

    <div class="brad-alert__body">
      <div class="brad-alert__body__middle brad-font-paragraph-sm no-link">
        Alert body text goes here.
      </div>
    </div>
  </div>
</div>
```
No Body
```
<div class="brad-alert brad-alert--warning">
  <div class="brad-alert__icon">
    <em class="icon-feedback-alert-warning d-flex"></em>
  </div>

  <h1 class="brad-alert__title brad-font-title-md no-content">Title</h1>
  <div></div>
</div>
```
No Title
```
<div class="brad-alert brad-alert--error">
  <div class="brad-alert__icon">
    <em class="icon-feedback-alert-error d-flex"></em>
  </div>

  <div class="brad-alert__content">
    <div class="brad-alert__body">
      <div class="brad-alert__body__middle brad-font-paragraph-sm no-link">
        Alert body text goes here.
      </div>
    </div>
  </div>
</div>
```
Transparent Background
```
<div class="brad-alert">
  <div class="brad-alert__icon">
    <em class="icon-feedback-alert-orientation d-flex"></em>
  </div>

  <div class="brad-alert__content">
    <h1 class="brad-alert__title brad-font-title-md">Title</h1>
    <div class="brad-alert__body">
      <div class="brad-alert__body__middle brad-font-paragraph-sm">
        Alert body text goes here.
      </div>

      <button
        class="brad-alert__link brad-btn brad-btn-text brad-btn-text--no-bg brad-btn--auto"
      >
        <span>Link</span>
      </button>
    </div>
  </div>
</div>
```