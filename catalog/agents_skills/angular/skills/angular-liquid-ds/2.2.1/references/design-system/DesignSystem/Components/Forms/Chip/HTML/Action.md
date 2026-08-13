# ChipAction

O componente ChipAction é projetado para acionar uma função específica após um toque ou clique, sempre de forma contextual. Ele é utilizado para executar ações como "Inserir valores em um campo de texto" ou "Adicionar ao calendário", garantindo uma interação mais fluida e intuitiva.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do HTML

Abaixo está um exemplo de uso básico do componente ChipAction com HTML:

```
<div class="brad-chip brad-chip--action brad-chip--md ">
  <input id="chip-action" type="button" aria-label="Label"  />

  <label for="chip-action" class="checkmark">
    <em class="i icon-ui-placeholder"></em>
    Label
  </label>
</div>
```
## Classes Variáveis

O componente ChipAction possui diferentes classes que modificam seu comportamento e estilo. Abaixo estão descritas essas variações e como aplicá-las.

# Variações de Estado

| Classe | Descrição |
| --- | --- |
| brad-chip--sm | Altera as medidas do componente para pequeno. |
| brad-chip--md | Altera as medidas do componente para médio. |
| brad-chip--lg | Altera as medidas do componente para grande. |

# Comportamento Javascript
## Inicialização

## Inicialização não é necessária (componente nativo)

# Acessibilidade

Certifique-se de adicionar tabindex="0" ao elemento de controle para que a leitura seja relizada corretamente. É necessário também, incluir o atributo aria-label="" no elemento de input e aria-hidden="true" no elemento label.

# Exemplos

Obs: Use o botão Show Code abaixo do exemplo para ver o HTML.

Para o uso do ChipAction é importante seguir a logica de implementação do código, e inserir as classes conforme os exemplos.

# Default
```
<div class="brad-chip brad-chip--action brad-chip--md ">
  <input id="chip-106" type="button" aria-label="Label"  />

  <label for="chip-106" class="checkmark">
    <em class="i icon-ui-placeholder"></em>
    Label
  </label>
</div>
```
Field
```
<div class="brad-theme-classic">
  <label id="text-field-number-action" class="brad-text-field brad-m-md-b">
    <input
      aria-label="Campo númerico"
      class=""
      type="number"
      step="1"
      min="0"
      placeholder="R$ 10,00"
    />
    <small aria-hidden="true" class="placeholder-label-field">Valor</small>
    <span class="prefix complements">R$</span>
    <em class="validation-icon complements"></em>
    <button aria-label="Subtrair 1" class="minus complements"></button>
    <button aria-label="Somar 1" class="plus complements"></button>
    <span class="helper-text"></span>
    <div class="brad-text-field--background"></div>
  </label>
</div>

<div class="brad-flex">
  <div class="brad-chip brad-chip--action brad-chip--md brad-m-xs-r">
    <input
      id="chip-1"
      type="button"
      aria-label="Somar mais R$ 1"
      value="1"
      onclick="sum(this)"
    />

    <label for="chip-1" class="checkmark">
      <em class="i icon-ui-plus"></em>
      R$ 1
    </label>
  </div>

  <div class="brad-chip brad-chip--action brad-chip--md brad-m-xs-r">
    <input
      id="chip-10"
      type="button"
      aria-label="Somar mais R$ 10"
      value="10"
      onclick="sum(this)"
    />

    <label for="chip-10" class="checkmark">
      <em class="i icon-ui-plus"></em>
      R$ 10
    </label>
  </div>

  <div class="brad-chip brad-chip--action brad-chip--md brad-m-xs-r">
    <input
      id="chip-50"
      type="button"
      aria-label="Somar mais R$ 50"
      value="50"
      onclick="sum(this)"
    />

    <label for="chip-50" class="checkmark">
      <em class="i icon-ui-plus"></em>
      R$ 50
    </label>
  </div>

  <div class="brad-chip brad-chip--action brad-chip--md">
    <input
      id="chip-100"
      type="button"
      aria-label="Somar mais R$ 100"
      value="100"
      onclick="sum(this)"
    />

    <label for="chip-100" class="checkmark">
      <em class="i icon-ui-plus"></em>
      R$ 100
    </label>
  </div>
</div>
```
```
const targetSelector = "#text-field-number-action";
  const options = { targetSelector };

  LiquidCorp.BradTextFieldNumberService.getInstance(options);

function sum = (event) => {
const eInput = document.querySelector("#text-field-number-action > input");
const newValue = (eInput.value ? +eInput.value : 0) + +event.value;

  eInput.value = newValue;

};
```