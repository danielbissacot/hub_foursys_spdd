# ChipSingle

Este modelo de Chip oferece um seletor de escolha única ao usuário, onde apenas uma opção pode ser selecionada dentre todas as disponíveis.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do HTML
```
<div class="brad-chip brad-chip--md brad-flex" aria-label="Label" role="radio" aria-checked="false" aria-disabled="false">
<input id="chip-single" type="radio" name="group" aria-hidden="true" />
<label for="chip-single" class="checkmark">Label 1</label>
</div>
```
Seguindo o padrão acima, para variar do modo multi ao single, basta alterar o tipo do input:

Quando o input for do tipo checkbox terá comportamento de multi-select Quando o input for do tipo radio terá comportamento de single-select

# Estilos
## OnColor

O modo OnColor é uma solução para obter maior contraste para elementos visuais e componentes aplicados em fundo escuro e colorido. Este modo torna possível atender ao contraste mínimo recomendado pela WCAG.

```
<div class="brad-chip brad-chip--on-color brad-chip--md brad-flex" aria-label="Label" role="radio" aria-checked="false" aria-disabled="false">
<input id="chip-single" type="radio" name="group" aria-hidden="true" />
<label for="chip-single" class="checkmark">Label 1</label>
</div>
```
Comportamento Javascript
## Inicialização

## Inicialização não é necessária (componente nativo)

# Acessibilidade

Certifique-se de adicionar tabindex="0" ao elemento de controle para que a leitura seja relizada corretamente. É necessário também, incluir o atributo aria-label="" no elemento de input e aria-hidden="true" no elemento label.

```
<div class="examples">
<div class="brad-chip brad-chip--md brad-m-sm-b brad-flex" tabindex="0">
  <input id="chip-1" type="radio" role="radio" name="group" aria-label="Label 1"/>
  <label for="chip-1" class="checkmark" aria-hidden="true">Label 1</label>
</div>
<div class="brad-chip brad-chip--md brad-flex" tabindex="0">
  <input id="chip-1-shadow" type="radio" role="radio" name="group" aria-label="Label 2"/>
  <label for="chip-1-shadow" class="checkmark" aria-hidden="true">Label 2</label>
</div>
</div>
```
Exemplo
```
<section class="brad-m-lg-b">
  <div class="examples">
    <div
      class="brad-chip brad-chip--md brad-m-sm-b brad-flex"
    >
      <input
        id="chip-379"
        type="radio"
        role="radio"
        name="group"
        
        
      />
      <label for="chip-379" class="checkmark" aria-hidden="true"
        >Label 1</label
      >
    </div>
    <div class="brad-chip brad-chip--md brad-flex">
      <input
        id="chip-379-shadow"
        type="radio"
        role="radio"
        name="group"
        
        
      />
      <label for="chip-379-shadow" class="checkmark" aria-hidden="true"
        >Label 2</label
      >
    </div>
  </div>
</section>
```