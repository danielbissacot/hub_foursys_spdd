# ChipMulti

Este modelo de Chip oferece um seletor de múltipla escolha ao usuário, de comum uso em telas de filtros ou seleção de categorias de conteúdo.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do HTML
```
<div class="brad-chip brad-chip--md brad-flex" aria-label="Label" role="checkbox" aria-checked="false" aria-disabled="false">
<input id="chip-multi" type="checkbox" name="group" aria-hidden="true" />
<label for="chip-multi" class="checkmark">Label 1</label>
</div>
```
Seguindo o padrão acima, para variar do modo multi ao single, basta alterar o tipo do input:

Quando o input for do tipo checkbox terá comportamento de multi-select Quando o input for do tipo radio terá comportamento de single-select

# Estilos
## Plus

Opta por ter o ícone de plus no modo não selecionado.

```
<div class="brad-chip brad-chip--md brad-chip--plus-add brad-flex" aria-label="Label" role="checkbox" aria-checked="false" aria-disabled="false">
<input id="chip-multi" type="checkbox" name="group" aria-hidden="true" />
<label for="chip-multi" class="checkmark">Label 1</label>
</div>
```
## OnColor

O modo OnColor é uma solução para obter maior contraste para elementos visuais e componentes aplicados em fundo escuro e colorido. Este modo torna possível atender ao contraste mínimo recomendado pela WCAG.

```
<div class="brad-chip brad-chip--on-color brad-chip--md brad-flex" aria-label="Label" role="checkbox" aria-checked="false" aria-disabled="false">
<input id="chip-multi" type="checkbox" name="group" aria-hidden="true" />
<label for="chip-multi" class="checkmark">Label 1</label>
</div>
```
Comportamento Javascript
## Inicialização

## Inicialização não é necessária (componente nativo)

# Acessibilidade

Certifique-se de adicionar tabindex="0" a div principal, aria-label="" ao input e aria-hidden="true" para a label, assim o componente fará a leitura correta das informações.

```
<div class="brad-chip brad-chip--md brad-m-sm-b brad-flex" tabindex="0">
<input id="id" type="checkbox" aria-label="Label 1" name="group"/>
<label for="id" class="checkmark" aria-hidden="true">Label 1</label>
</div>
```
Exemplo
```
<section class="brad-m-lg-b">
  <div class="examples">
    <div class="brad-chip brad-chip--md brad-m-sm-b brad-flex">
      <input id="chip-165" type="checkbox" aria-label="Label" name="group" />
      <label for="chip-165" class="checkmark">Label 1</label>
    </div>
  </div>
  <div class="brad-chip brad-chip--md brad-flex">
      <input id="chip-165-shadow" type="checkbox" aria-label="Label" name="group" />
      <label for="chip-165-shadow" class="checkmark">Label 2</label>
    </div>
  </div>
</section>
```