# Chip

Componente projetado para acionar uma função específica após um toque ou clique (de acordo com o tipo escolhido), sempre de forma contextual.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do Web Component

O BradChip possui apenas um componente obrigatório para a utilização do chips.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-chip | Componente | Sim | Sim | Componente principal do chip, define a estrutura do alerta e usa atributos para o tipo e fundo. |

# Propriedades
## brad-chip

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Necessário informar para o bom funcionamento do componente. Será utilizado para atribuir identificadores para os elementos criados internamente. |
| value | string, boolean | undefined | Valor do chip. |
| name | string | undefined | Necessário informar para chips do tipo single, visto que possuem inputs internos do tipo radio. Utilizado para agrupamento de chips. |
| checked | boolean | false | Determina se o chip deve inicializar marcado. Utilizado nos chips de tipo confirmation, multi e single. |
| disabled | boolean | false | Utilizado para desabilitar o chip. |
| brad-on-color | boolean | false | Estado de mudança de cor para fundos escuros. |
| brad-type | "action", "confirmation", "delete", "multi", "single" | "action" | Tipo do chip. |
| brad-aria-label | string |  | Propriedade que será incluída no input gerado internamente como aria-label, para realizar a acessibilidade. |
| brad-size | "sm", "md", "lg" | "md" | Tamanho do chip. |

# Uso do HTML
```
<brad-chip
  id="[ID_DO_CHIP]"
  name="chip-name"
  value="Valor do chip"
  brad-type="confirmation"
  brad-aria-label="Label"
  brad-type="confirmation"
  brad-size="lg"
  >Label</brad-chip>
```
Comportamento Javascript
## Inicialização

## Inicialização não é necessária (componente nativo)

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| change | brad-chip | Disparado em chips do tipo confirmation, multi e single. |

# Exemplo de uso
```
const component = document.getElementById([ID_DO_CHIP]);

component.addEventListener("change", (event) => {
  console.log(event);
});
```
## Acessibilidade

Caso a propriedade brad-aria-label seja omitida, leitores de tela utilizarão do conteúdo de texto inserido dentro do brad-chip para leitura. Caso isso não seja desejado, basta incluir o atributo brad-aria-label="Texto de leitura desejado aqui" no web component para que a leitura de tela seja realizada corretamente.

## Exclusivo para chips do tipo delete

Para que haja feedback da ação ao deletar o Chip, precisamos utilizar o atributo de acessibilidade aria-live para que o leitor verbalize que o Chip foi removido das opções. O aria-live precisa ser adicionado a um span juntamente com um id para que seja possível haver o feedback da exclusão do Chip. Após adicionar o id e o aria-live, precisamos implementar uma função que fará a remoção desse chip ao ser clicado, como o método removeChip(), exemplificado abaixo.

Além disso, precisamos adicionar uma classe ao span que realiza o feedback da exclusão para que a mensagem de feedback não seja mostrada na tela, apenas seja lida pelo leitor de tela.

```
<div class="brad-theme-classic">
  <div class="brad-chips brad-flex">
    <span class="accessibility_info" id="delete-info" aria-live="polite"></span>
    <brad-chip id="chip-delete-1" brad-type="delete" brad-aria-label="Label 1, botão 1 de 3, clique para deletar a opção" onclick="removeChip(this)">
    </brad-chip>

    <brad-chip id="chip-delete-2" brad-type="delete" brad-aria-label="Label 2, botão 2 de 3, clique para deletar a opção" onclick="removeChip(this)">
    </brad-chip>

    <brad-chip id="chip-delete-3" brad-type="delete" brad-aria-label="Label 3, botão 3 de 3, clique para deletar a opção" onclick="removeChip(this)">
    </brad-chip>
  </div>

</div>
```
```
function removeChip(eChip) {
const isDisabled = eChip.disabled;
if (isDisabled === false) {
  eChip.classList.add("brad-chip--hide");
  document.getElementById('delete-info').textContent = `${eChip.querySelector('label').textContent} removido`;
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
## Exemplos

Obs: Use o botão Show Code abaixo do exemplo para ver o HTML.

# Default
```
<div class="brad-chips brad-flex brad-flex-wrap">
  <brad-chip
    class="brad-m-sm-r"
    id="chip-0"
    name="chip-0"
    brad-on-color="false"
    brad-type="action"
    brad-size="md"
    value="1"
     checked
    
    
    onclick="window.onClickDefault(this)"
    >1. Label</brad-chip
  ><brad-chip
    class="brad-m-sm-r"
    id="chip-1"
    name="chip-1"
    brad-on-color="false"
    brad-type="action"
    brad-size="md"
    value="2"
    
    
    
    onclick="window.onClickDefault(this)"
    >2. Label</brad-chip
  ><brad-chip
    class="brad-m-sm-r"
    id="chip-2"
    name="chip-2"
    brad-on-color="false"
    brad-type="action"
    brad-size="md"
    value="3"
    
    
    
    onclick="window.onClickDefault(this)"
    >3. Label</brad-chip
  >
</div>
```
Action
```
<div class="brad-chips brad-flex brad-flex-wrap"><brad-chip
    class="brad-m-sm-r"
    id="chip-action-0"
    name="chip-action-0"
    brad-type="action"
    brad-on-color="false"
    brad-size="md"
    value="1"
     checked
    
    
    onclick="window.onClickAction(this)"
    >1. Label</brad-chip
  ><brad-chip
    class="brad-m-sm-r"
    id="chip-action-1"
    name="chip-action-1"
    brad-type="action"
    brad-on-color="false"
    brad-size="md"
    value="2"
    
    
    
    onclick="window.onClickAction(this)"
    >2. Label</brad-chip
  ><brad-chip
    class="brad-m-sm-r"
    id="chip-action-2"
    name="chip-action-2"
    brad-type="action"
    brad-on-color="false"
    brad-size="md"
    value="3"
    
    
    
    onclick="window.onClickAction(this)"
    >3. Label</brad-chip
  ></div>
```
Confirmation
```
<div class="brad-chips brad-flex brad-flex-wrap">
  <brad-chip
    class="brad-m-sm-r"
    id="chip-319"
    name="chip-confirmation"
    brad-type="confirmation"
    brad-on-color="false"
    brad-aria-label="Salvar"
    onchange="window.onChangeConfirmation(this)"
    ><em class="i icon-category-heart"></em>Salvar</brad-chip
  >
</div>
```
Delete
```
<div id="brad-chips-container" class="brad-chips brad-flex brad-flex-wrap">
  <span
    class="accessibility_info"
    id="delete-info"
    aria-live="polite"
    style="position: absolute; left: 0px; top: -500px; width: 1px; height: 1px; overflow: hidden;"
  ></span>
  <brad-chip
    class="brad-m-sm-r"
    id="chip-delete-0"
    name="chip-delete-0"
    brad-type="delete"
    brad-on-color="false"
    brad-size="md"
    value="1"
     checked
    
    
    onclick="window.removeChip(this)"
    >1. Label</brad-chip
  ><brad-chip
    class="brad-m-sm-r"
    id="chip-delete-1"
    name="chip-delete-1"
    brad-type="delete"
    brad-on-color="false"
    brad-size="md"
    value="2"
    
    
    
    onclick="window.removeChip(this)"
    >2. Label</brad-chip
  ><brad-chip
    class="brad-m-sm-r"
    id="chip-delete-2"
    name="chip-delete-2"
    brad-type="delete"
    brad-on-color="false"
    brad-size="md"
    value="3"
    
    
    
    onclick="window.removeChip(this)"
    >3. Label</brad-chip
  >
</div>

<button
  class="brad-btn brad-btn-primary brad-m-md-t"
  onclick="addChip()"
>
  ADD CHIP
</button>
```
Multi
```
<div class="brad-chips brad-flex brad-flex-wrap"><brad-chip
    class="brad-m-sm-r"
    id="chip-multi-0"
    name="chip-multi-0"
    brad-type="multi"
    brad-on-color="false"
    brad-size="md"
    value="1"
     checked
    
    
    onchange="window.onChangeMulti(this)"
    >1. Label</brad-chip
  ><brad-chip
    class="brad-m-sm-r"
    id="chip-multi-1"
    name="chip-multi-1"
    brad-type="multi"
    brad-on-color="false"
    brad-size="md"
    value="2"
    
    
    
    onchange="window.onChangeMulti(this)"
    >2. Label</brad-chip
  ><brad-chip
    class="brad-m-sm-r"
    id="chip-multi-2"
    name="chip-multi-2"
    brad-type="multi"
    brad-on-color="false"
    brad-size="md"
    value="3"
    
    
    
    onchange="window.onChangeMulti(this)"
    >3. Label</brad-chip
  ></div>
```
Single
```
<div class="brad-chips brad-flex brad-flex-wrap"><brad-chip
    class="brad-m-sm-r"
    id="chip-single-0"
    name="chip-single"
    brad-type="single"
    brad-on-color="false"
    brad-size="md"
    value="1"
     checked
    
    
    onchange="window.onChangeSingle(this)"
    >1. Label</brad-chip
  ><brad-chip
    class="brad-m-sm-r"
    id="chip-single-1"
    name="chip-single"
    brad-type="single"
    brad-on-color="false"
    brad-size="md"
    value="2"
    
    
    
    onchange="window.onChangeSingle(this)"
    >2. Label</brad-chip
  ><brad-chip
    class="brad-m-sm-r"
    id="chip-single-2"
    name="chip-single"
    brad-type="single"
    brad-on-color="false"
    brad-size="md"
    value="3"
    
    
    
    onchange="window.onChangeSingle(this)"
    >3. Label</brad-chip
  ></div>
```