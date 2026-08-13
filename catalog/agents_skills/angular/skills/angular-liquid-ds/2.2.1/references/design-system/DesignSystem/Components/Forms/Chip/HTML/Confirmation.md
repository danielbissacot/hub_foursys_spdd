# ChipConfirmation

O componente ChipConfirmation permite ao usuário realizar ações como favoritar, salvar ou curtir, com uma confirmação visual discreta, sem interferir no conteúdo principal.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do HTML

Abaixo está um exemplo de uso básico do componente ChipConfirmation com HTML:

```
<div class="brad-chip brad-chip--confirmation brad-chip--md">
  <input
    id="chip-confirmation"
    type="checkbox"
    aria-label="Label"
    name="group"
  />

  <label for="chip-confirmation" class="checkmark">
    <em class="i icon-ui-placeholder"></em>
    Label
  </label>
</div>
```
## Classes Variáveis

O componente ButtonAlert possui diferentes classes que modificam seu comportamento e estilo. Abaixo estão descritas essas variações e como aplicá-las.

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

Para o uso do ChipConfirmation é importante seguir a logica de implementação do código, e inserir as classes conforme os exemplos.

# Default
```
<div class="brad-chip brad-chip--confirmation brad-chip--md ">
  <input
    id="chip-331"
    type="checkbox"
    aria-label="Label"
    
    
  />

  <label for="chip-331" class="checkmark">
    <em class="i icon-ui-placeholder"></em>
    Label
  </label>
</div>
```
Save
```
<div class="brad-chip brad-chip--confirmation brad-chip--md">
  <input id="chip-225" type="checkbox" aria-label="Salvar" name="group" />

  <label for="chip-225" class="checkmark">
    <em class="i icon-category-heart"></em>
    Salvar
  </label>
</div>
```
```
function toggleSaveState(
  elementId,
  savedLabel = "Salvo",
  saveLabel = "Salvar"
) {
    const button = document.getElementById(elementId);
    const label = document.querySelector('label[for="'.concat(elementId, '"]'));

    button.addEventListener("click", () => {
      const isSaving = button.getAttribute("aria-label") === saveLabel;

      button.setAttribute("aria-label", isSaving ? savedLabel : saveLabel);
      label.lastChild.textContent = isSaving ? savedLabel : saveLabel;
    });
  }

  toggleSaveState("chip-save");
```