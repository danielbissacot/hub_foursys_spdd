# Accordion Selectable Header

Este é um template de exemplo que demonstra como usar o componente brad-accordion base com elementos selecionáveis (checkbox ou radio) no cabeçalho.

# Accordion

O brad-accordion é um componente casca projetado para ser flexível e extensível. Ele fornece apenas a estrutura básica de abertura/fechamento e pode receber diferentes tipos de composições dentro dele, incluindo:

## Elementos de seleção (checkbox, radio)
Formulários complexos
Listas de dados
Conteúdo interativo personalizado
## Qualquer HTML válido

Este template específico mostra uma implementação com elementos selecionáveis, mas o componente accordion pode ser adaptado para diversas outras necessidades.

# Implementação
HTML
```
<div
  id="accordion-1"
  class="brad-accordion brad-accordion--selectable-header brad-m-md-b"
>
  <button
    class="brad-accordion__header brad-font-title-md"
    onclick="handleAccordionToggle('accordion-1')"
  >
    <label class="brad-checkbox brad-p-md-x" onclick="event.stopPropagation()">
      <input id="checkbox-accordion-1" type="checkbox" name="group" />
      <p></p>
      <span class="checkmark"></span>
    </label>
    <div class="brad-accordion--selectable-header__right">
      <p>Título do Accordion</p>
      <em class="brad-accordion__icon"></em>
    </div>
  </button>
  <div
    class="brad-accordion__content brad-font-paragraph-sm"
    aria-hidden="true"
  >
    <p>
      Conteúdo do accordion que será exibido/ocultado ao clicar no cabeçalho.
    </p>
  </div>
</div>
```
JavaScript
```
document.addEventListener('DOMContentLoaded', function() {
  const accordionInstance = LiquidCorp.BradAccordionService.getInstance('#accordion-1');
  window.handleAccordionToggle = function(id) {
      accordionInstance.toggle(id);
    };
});
```
## Comportamento Javascript

O componente utiliza o serviço LiquidCorp.BradAccordionService para gerenciar o comportamento de abertura/fechamento dos accordions. A função handleAccordionToggle é responsável por alternar o estado de cada accordion individualmente.

# Exemplo
Checkbox
```
<div
    id="accordion-1"
    class="brad-accordion brad-accordion--selectable-header brad-m-md-b"
  >
    <button
      class="brad-accordion__header brad-font-title-md"
      onclick="window.handleAccordionToggle('accordion-1')"
    >
      <label class="brad-checkbox brad-p-md-x" onclick="event.stopPropagation()">
        <input id="checkbox-accordion-1" type="checkbox" name="group" />
        
        <p></p>
        <span class="checkmark"></span>
      </label>

      <div class="brad-accordion--selectable-header__right">
        <p>Primeiro Item</p>
        <em class="brad-accordion__icon"></em>
      </div>
    </button>

    <div
      class="brad-accordion__content brad-font-paragraph-sm"
      aria-hidden="true"
    >
      <p>Este é o conteúdo do primeiro accordion. Aqui você pode colocar informações detalhadas sobre este item.</p>
      <p class="brad-accordion__content--paragraph"></p>
    </div>
  </div>

  <div
    id="accordion-2"
    class="brad-accordion brad-accordion--selectable-header brad-m-md-b"
  >
    <button
      class="brad-accordion__header brad-font-title-md"
      onclick="window.handleAccordionToggle('accordion-2')"
    >
      <label class="brad-checkbox brad-p-md-x" onclick="event.stopPropagation()">
        <input id="checkbox-accordion-2" type="checkbox" name="group" />
        
        <p></p>
        <span class="checkmark"></span>
      </label>

      <div class="brad-accordion--selectable-header__right">
        <p>Segundo Item</p>
        <em class="brad-accordion__icon"></em>
      </div>
    </button>

    <div
      class="brad-accordion__content brad-font-paragraph-sm"
      aria-hidden="true"
    >
      <p>Este é o conteúdo do segundo accordion. Mais informações podem ser adicionadas aqui para demonstrar a funcionalidade.</p>
      <p class="brad-accordion__content--paragraph"></p>
    </div>
  </div>

  <div
    id="accordion-3"
    class="brad-accordion brad-accordion--selectable-header brad-m-md-b"
  >
    <button
      class="brad-accordion__header brad-font-title-md"
      onclick="window.handleAccordionToggle('accordion-3')"
    >
      <label class="brad-checkbox brad-p-md-x" onclick="event.stopPropagation()">
        <input id="checkbox-accordion-3" type="checkbox" name="group" />
        
        <p></p>
        <span class="checkmark"></span>
      </label>

      <div class="brad-accordion--selectable-header__right">
        <p>Terceiro Item</p>
        <em class="brad-accordion__icon"></em>
      </div>
    </button>

    <div
      class="brad-accordion__content brad-font-paragraph-sm"
      aria-hidden="true"
    >
      <p>Este é o conteúdo do terceiro accordion. Conteúdo adicional para completar o exemplo.</p>
      <p class="brad-accordion__content--paragraph"></p>
    </div>
  </div>
```