# ChipDelete

Este modelo de Chip oferece a possibilidade do usuário remover o chip da tela, geralmente ele ocorre depois de um filtro que o usuário realiza.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do HTML
```
<div class="brad-chips brad-flex" style="overflow-x: auto;">
<div class="brad-chip brad-chip--delete brad-chip--md brad-m-sm-r" onclick="removeChip(this)">
  <input id="chip-1" type="button" />
  <label for="chip-1" class="checkmark" >Label 1</label>
</div>

<div
class="brad-chip brad-chip--delete brad-chip--md brad-m-sm-r"
onclick="removeChip(this)"
>
<input id="chip-2" type="button" />
<label for="chip-2" class="checkmark">
  Label 2
</label>
</div>

<div class="brad-chip brad-chip--delete brad-chip--md brad-m-sm-r" onclick="removeChip(this)">
  <input id="chip-3" type="button" />
  <label for="chip-3" class="checkmark" >Label 3</label>
</div>
</div>
```
Comportamento Javascript
Inicialização
Uso básico
```
let currentLabelCont = 4;

function removeChip(eChip) {
const isDisabled = eChip.querySelector("input").disabled;

if (isDisabled === false) {
eChip.classList.add("brad-chip--hide");

  setTimeout(() => {
    eChip.remove();
  }, 600);

}
}

function addChip() {
const eChip = createElementChip(currentLabelCont);
const eInput = createElementInput(currentLabelCont);
const eLabel = createElementLabel(eInput, currentLabelCont);

eChip.appendChild(eInput);
eChip.appendChild(eLabel);

currentLabelCont = currentLabelCont + 1;

const eChips = document.querySelector(".brad-chips");
eChips.appendChild(eChip);
}

function createElementChip(currentLabelCont) {
const eChip = document.createElement("div");
eChip.className = `brad-chip brad-chip--delete brad-m-sm-r`;
eChip.addEventListener("click", () => removeChip(eChip));

return eChip;
}

function createElementInput(currentLabelCont) {
const eInput = document.createElement("input");
eInput.id = `chip-${currentLabelCont}`;
eInput.setAttribute("aria-label", `Label ${currentLabelCont}`);
if (disabled) eInput.setAttribute("disabled", true);

return eInput;
}

function createElementLabel(eInput, currentLabelCont) {
const eLabel = document.createElement("label");
eLabel.htmlFor = eInput.id;
eLabel.className = "checkmark";
eLabel.innerHTML = `Label ${currentLabelCont}`;

return eLabel;
}
```
## Acessibilidade

Certifique-se de adicionar aria-label, ao input para que a leitura seja realizada corretamente.

Para que haja feedback da ação ao deletar o Chip, precisamos utilizar o atributo de acessibilidade aria-live para que o leitor verbalize que o Chip foi removido das opções. O aria-live precisa ser adicionado a um span juntamente com um id para que seja possível haver o feedback da exclusão do Chip. Após adicionar o id e o aria-live, precisamos adicionar algumas condições a função removeChip(), como mostrado abaixo.

Além disso, precisamos adicionar uma classe ao span que realiza o feedback da exclusão para que a mensagem de feedback não seja mostrada na tela, apenas seja lida pelo leitor de tela. O css referente a essa classe deverá ser adicionado ao projeto.

```
<div class="brad-theme-classic">
  <div class="brad-chips brad-flex" style="overflow-x: auto;">
    <span class="accessibility_info" id="delete-info" aria-live="polite"></span>
    <div class="brad-chip brad-chip--delete brad-chip--md brad-m-sm-r" onclick="removeChip(this)" tabindex="0">
      <input id="chip-1" type="button" aria-label="Label 1, botão 1 de 3, clique para deletar a opção"/>
      <label for="chip-1" class="checkmark" >Label 1</label>
    </div>

    <div class="brad-chip brad-chip--delete brad-chip--md brad-m-sm-r" onclick="removeChip(this)" tabindex="0">
      <input id="chip-2" type="button" aria-label="Label 2, botão 2 de 3, clique para deletar a opção"/>
      <label for="chip-2" class="checkmark" >Label 2</label>
    </div>

    <div class="brad-chip brad-chip--delete brad-chip--md brad-m-sm-r" onclick="removeChip(this)" tabindex="0">
      <input id="chip-3" type="button" aria-label="Label 3, botão 3 de 3, clique para deletar a opção"/>
      <label for="chip-3" class="checkmark" >${label} 3</label>
    </div>
  </div>

</div>
```

Ajustes na função removeChip() para dar o feedback da exclusão do Chip:

```
function removeChip(eChip) {
const isDisabled = eChip.querySelector("input").disabled;
const eNextSibling = eChip.nextSibling.nextElementSibling
if (isDisabled === false) {
  eChip.classList.add("brad-chip--hide");
  document.getElementById('delete-info').textContent = `${eChip.querySelector('label').textContent} removido`;
  eNextSibling.tabIndex = "-1";
  eNextSibling.focus();
  setTimeout(() => {
    eChip.remove();
  }, 600);
}
}
```

Exemplo de css para esconder na tela a mensagem de feedback da exclusão do Chip, deixando a informação apenas para o leitor de tela:

```
.accessibility_info {
position: absolute;
left: 0px;
top: -500px;
width: 1px;
height: 1px;
overflow: hidden;
}
```
## Exemplo

Obs: Use o botão Show Code abaixo do exemplo para ver o HTML.

Para o uso do ChipDelete é importante seguir a logica de implementação do código, e inserir as classes conforme os exemplos.

```
<div class="brad-chips brad-flex brad-flex-wrap">
  <div
    class="brad-chip brad-chip--delete brad-chip--md  brad-m-sm-r"
    onclick="removeChip(this)"
  >
    <input id="chip-304" type="button"  />
    <label for="chip-304" class="checkmark">Label 1</label>
  </div>

  <div
    class="brad-chip brad-chip--delete brad-chip--md  brad-m-sm-r"
    onclick="removeChip(this)"
  >
    <input id="chip-354" type="button"  />
    <label for="chip-354" class="checkmark">Label 2</label>
  </div>

  <div
    class="brad-chip brad-chip--delete brad-chip--md  brad-m-sm-r"
    onclick="removeChip(this)"
  >
    <input id="chip-78" type="button"  />
    <label for="chip-78" class="checkmark">Label 3</label>
  </div>
</div>

<button
  class="brad-btn brad-btn-primary brad-m-md-t"
  onclick="addChip()"
>
  ADD CHIP
</button>
```