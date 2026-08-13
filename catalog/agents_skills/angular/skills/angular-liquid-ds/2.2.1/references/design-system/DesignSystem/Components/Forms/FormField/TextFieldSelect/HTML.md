# TextFieldSelect

O select permite que o usuário selecione uma ou várias opções de um menu dropdown que é exibido depois de clicar ou tocar no campo, ou no Chevron Button, Além do dropdown o usuário também pode digitar e conforme digita os resultados vão sendo filtrados automaticamente.

# Sumário
Uso do HTML
```
<div id="select" class="brad-text-field-select brad-m-lg-b">
<label class="brad-text-field ">
  <input aria-label="Campo de texto" type="text" placeholder="Escolha uma opção" autocomplete="off" />
  <em aria-hidden="true" class="leading-icon i icon-ui-placeholder complements"></em>
  <small aria-hidden="true" class="placeholder-label-field">Label text</small>
  <span class="prefix">PREFIX</span>
  <em class="validation-icon complements"></em>
  <button class="icon-ui-placeholder arrow complements"></button>
  <span class="helper-text">Helper text</span>
  <div class="brad-text-field--background"></div>
</label>
</div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do TextFieldSelect

```
const targetSelector = "#select";
const type = "single";
const optionsSelect = [
{
  text: "Label 1",
  icon: "icon-ui-placeholder",
  value: "Label 1",
  selected: false,
},
];
const buttonPrimary = { text: "Confirmar", disabledNonSelected: true };
const buttonSecondary = { text: "Cancelar" };
const title = "Título do Modal";
const subtitle = "Subtítulo do Modal";

const options = { targetSelector, type, optionsSelect, buttonPrimary, buttonSecondary, title, subtitle };
const service = LiquidCorp.BradTextFieldSelectService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object], por exemplo [targetSelector: "#id1", targetSelector: "#id2", targetSelector: "#id3", ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| type | "single", "multi" | "single" | Altera o tipo do select, single para selecionar apenas uma opção, multi para selecionar mais de uma opção |
| optionsSelect | [{ text: string, icon: string, value: any, selected: boolean }] | [{}] | Array de objeto que será usado para popular as opções selecionáveis do componente |
| buttonPrimary | { text: string, disabledNonSelected: boolean } | { text: "Confirmar", disabledNonSelected: false } | Objeto usado para determinar texto e se o botão será desativado, caso nenhuma opção seja selecionada; Esse botão só aparece quando usamos o componente do tipo "single" ou esteja em algum dispositivo mobile |
| buttonSecondary | { text: string } | { text: "" } | Objeto usado para determinar texto do botao secundário, usado para fechar o modal quando estiver em algum dispositivo mobile, caso não passe texto, ele não aparecerá |
| title | string | "" | Objeto usado para determinar qual será o título do modal. |
| subtitle | string | "" | Objeto usado para determinar qual será o subtítulo do modal. |
| dropdownMaxHeight | string | "" | Define a altura máxima, em 'px', do dropdown que contém as opções(DESKTOP) |
| isIndeterminateMode | boolean | false | Define se o Multi terá o modo indeterminate no primeiro checkbox da lista (lembre-se que esse opção é apenas para o type multi) |

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getSelected | - | É usado para retornar as opções que foram selecionadas, comumente utilizado dentro do eventListener customizado "selected" do atributo eInput do componente |
| setDropdownMaxHeight | string | Atualiza a altura máxima, em 'px', do dropdown que contém as opções(DESKTOP) |
| setSelectValueMethod | string[] ou string | Altera o valor do select via script, onde o selectOption são as opções de valores que estarão selecionados, caso passado array serão selecionados mais de uma opção e caso passe uma string, será selecionado apenas um |
| updateOptionsSelect | [{ text: string, icon: string, value: any, selected: boolean }] | Atualiza as optionsSelect com os novos valores passados como parâmetro |
| cleanInput | - | Limpa o input e o(s) valor(es) selecionado(s) |

# Eventos

| Evento | Elemento | Detalhes |
| --- | --- | --- |
| selected | service.component | Disparado ao selecionar uma opção e confirmar - em desktop e no single, ele dispara apenas ao selecionar, porém no multi e no mobile é disparado ao apertar o botão de confirmar. event.detail.options contém todos as opções atualizadas. |
| confirmed | service.component | Disparado ao selecionar uma opção e confirmar - em desktop e no single, ele dispara apenas ao selecionar, porém no multi e no mobile é disparado ao apertar o botão de confirmar. event.detail.options contém todos as opções atualizadas. |
| canceled | service.component | Disparado no multi quando não confirmamos e apertamos em cancelar ou fechamos o dropdown/modal. event.detail.options contém todos as opções atualizadas. |


Como escutar eventos: Todos os eventos devem ser escutados usando addEventListener no service.component. A estrutura de uso é sempre a mesma, mudando apenas o nome do evento e a propriedade acessada em event.detail.

## Exemplo genérico de como escutar o evento
```
service.component.addEventListener("nome-do-evento", (event) => {
const dados = event.detail;
console.log("Evento recebido:", dados);
});
```

Substitua "nome-do-evento" por selected, selected, etc., conforme a tabela acima.

# Uso básico
```
const targetSelector = "#select";
const type = "single";
const optionsSelect = [
{
  text: "Label 1",
  icon: "icon-ui-placeholder",
  value: "Label 1",
  selected: false,
},
{
  text: "Label 2",
  icon: "icon-ui-placeholder",
  value: "Label 2",
  selected: false,
},
{
  text: "Label 3",
  icon: "icon-ui-placeholder",
  value: "Label 3",
  selected: false,
},
];
const buttonPrimary = { text: "Confirmar", disabledNonSelected: true };
const buttonSecondary = { text: "Cancelar" };
const title = "Título do Modal";
const subtitle = "Subtítulo do Modal";
const options = { targetSelector, type, optionsSelect, buttonPrimary, buttonSecondary, title, subtitle };
const service = LiquidCorp.BradTextFieldSelectService.getInstance(options);

/_ eventListener customizado, usado para obter opções selecionadas sempre que houver uma alteração no componente, mesmo que não seja confirmada a operação _/
service.eInput.addEventListener("changed", (e) => {
//console.log(e.detail, "changed");
/_
** Output:
{
"elementChanged": HTMLElement,
"options": [
{
"text": "Todos",
"icon": "icon-ui-placeholder brad-text-color-extended-green-dark",
"value": "Todos",
"selected": false,
"element": {}
},
{
"text": "Label 1",
"icon": "icon-ui-placeholder",
"value": "Label1",
"selected": true,
"element": {}
},
{
"text": "Label 2",
"icon": "brad-text-color-extended-yellow icon-ui-placeholder",
"value": "Label2",
"selected": false,
"element": {}
}
]
}
_/
});

/_ eventListener customizado, usado para obter opções selecionadas sempre que confirmar a operação _/
service.eInput.addEventListener("selected", (e) => {
//console.log(e.detail, "confirmed | selected");
});

/_ eventListener customizado, usado para obter opções selecionadas sempre que cancelar a operação (não confirmar) _/
service.eInput.addEventListener("canceled", (e) => {
//console.log(e.detail, "canceled");
});

/_ setSelectValueMethod(selectOption), altera o valor do select via script, onde o selectOption são as opções de valores que estarão selecionados _/
/_Para múltiplas seleções_/
const selecMultiOptions = ["Label 1", "Label 3"];
service.setSelectValueMethod(selecMultiOptions);

/_Para uma única seleção_/
const selectOption = "Label 1";
service.setSelectValueMethod(selectOption);
```
Uso para modo indeterminate do select multi
```
const targetSelector = "#select";
const type = "multi";
const optionsSelect = [
{
  text: "Todos",
  icon: "icon-ui-placeholder",
  value: "Todos",
  selected: false,
},
{
  text: "Label 1",
  icon: "icon-ui-placeholder",
  value: "Label 1",
  selected: false,
},
{
  text: "Label 2",
  icon: "icon-ui-placeholder",
  value: "Label 2",
  selected: false,
},
];
const buttonPrimary = { text: "Confirmar", disabledNonSelected: true };
const buttonSecondary = { text: "Cancelar" };
const title = "Título do Modal";
const subtitle = "Subtítulo do Modal";
const isIndeterminateMode: true; // <<<
const options = { targetSelector, type, optionsSelect, buttonPrimary, buttonSecondary, title, subtitle, isIndeterminateMode };
const service = LiquidCorp.BradTextFieldSelectService.getInstance(options);
```
## Solução para múltiplos selects na mesma tela

Ao tentar utilizar dois selects na mesma tela, alguns usuários podem encontrar dificuldades devido à necessidade de instanciar o serviço corretamente para cada select. Aqui está uma solução passo a passo:

Identifique os selects: Certifique-se de que cada select na sua página tenha um identificador único (id no HTML). Por exemplo:

```
<div id="select-one" class="brad-text-field-select brad-m-lg-b">
<label class="brad-text-field ">
  <input aria-label="Campo de texto" type="text" placeholder="Escolha as opções" autocomplete="off" />
  <em aria-hidden="true" class="leading-icon i icon-ui-placeholder complements"></em>
  <small aria-hidden="true" class="placeholder-label-field">Label text</small>
  <span class="prefix">PREFIX</span>
  <em class="validation-icon complements"></em>
  <button class="icon-ui-placeholder arrow complements"></button>
  <span class="helper-text">Helper text</span>
  <div class="brad-text-field--background"></div>
</label>
</div>

<div id="select-two" class="brad-text-field-select brad-m-lg-b">
<label class="brad-text-field ">
  <input
    aria-label="Campo de texto"
    type="text"
    placeholder="Escolha as opções"
    autocomplete="off"
  />
  <em
    aria-hidden="true"
    class="leading-icon i icon-ui-placeholder complements"
  ></em>
  <small aria-hidden="true" class="placeholder-label-field">
    Label text
  </small>
  <span class="prefix">PREFIX</span>
  <em class="validation-icon complements"></em>
  <button class="icon-ui-placeholder arrow complements"></button>
  <span class="helper-text">Helper text</span>
  <div class="brad-text-field--background"></div>
</label>
</div>
```

Instancie o serviço para cada select: No seu código JavaScript (ou TypeScript, dependendo da linguagem), você precisa instanciar o serviço uma vez para cada select, passando o targetSelector único de cada um como parâmetro. Por exemplo:

```
const optionsOne = {
targetSelector: "#selectOne",
type: "multi",
optionsSelect: [
  {
    text: "Option 1",
    icon: "icon-ui-placeholder",
    value: "opt1",
    selected: false,
  },
],
// ...
};

const optionsTwo = {
targetSelector: "#selectTwo",
type: "multi",
optionsSelect: [
{
text: "Option 2",
icon: "icon-ui-placeholder",
value: "opt2",
selected: false,
},
],
// ...
};

const serviceOne = LiquidCorp.BradTextFieldSelectService.getInstance(optionsOne);
const serviceTwo = LiquidCorp.BradTextFieldSelectService.getInstance(optionsTwo);
console.log(serviceOne, serviceTwo);
```
```
<div id="select" class="brad-text-field-select brad-m-lg-b">
<label class="brad-text-field brad-text-field--on-color">
  <input aria-label="Campo de texto" type="text" placeholder="Escolha uma opção" autocomplete="off" />
  <em aria-hidden="true" class="leading-icon i icon-ui-placeholder complements"></em>
  <small aria-hidden="true" class="placeholder-label-field">Label text</small>
  <span class="prefix">PREFIX</span>
  <em class="validation-icon complements"></em>
  <button class="i icon-ui-placeholder arrow complements"></button>
  <span class="helper-text">Helper text</span>
  <div class="brad-text-field--background"></div>
</label>
</div>
```
Observações
## Responsividade

Quando estiver em dispositivos desktop o componente abrirá um dropdown com as opções, quando estiver em dispositivos mobile o componente abrirá um modal-dialog 😃

# Acessibilidade

Certifique-se de adicionar autocomplete="off" ao input. Este atributo impede que o navegador abra um autocompletar nativo. Certifique-se de criar um tag <p> como irmã da div de dropdown que envolve as div's de opção, com um atributo id Este atributo será usado na função para alterar o próprio valor e ler o resultado da busca, no exemplo abaixo é usado o valor id-search-result mas fique à vontade para definir o valor do id. Certifique-se também de adicionar o atributo aria-live='polite'. Este atributo faz com que o leitor de tela leia-o sempre que sofrer alteração. Certifique-se também de adicionar o atributo style="opacity: 0; position: absolute;". Este atributo vai impedir o elemento de aparece e ocupar espaço na DOM. Certifique-se de adicionar um atributo id na tag input, na tag small referente ao label text, na tag span referente ao prefix e na tag span referente ao helper text, assim sempre que o focus estiver no input pegamos os respectivos valores e passamos a váriavel que efetua a leitura.

# Exemplo do código html:
```
<div class="theme">
<div id="id-unico" class="brad-text-field-select brad-m-lg-b">
  <p id="id-search-result" aria-live="polite" style="opacity: 0; position: absolute;"></p>
  <label class="brad-text-field">
    <input id="id-input" aria-label="Campo de texto" type="text" placeholder="Escolha uma opção" autocomplete="off" />
    <em aria-hidden="true" class="leading-icon i icon-ui-placeholder complements"></em>
    <small id="id-label-text" aria-hidden="true" class="placeholder-label-field">Label text </small>
    <span id="id-prefix">PREFIX</span>
    <em class="validation-icon complements"></em>
    <button class="icon-ui-placeholder arrow complements"></button>
    <span id="id-helper-text" class="helper-text">Helper text</span>
    <div class="brad-text-field--background"></div>
  </label>
</div>
</div>
```

Certifique-se de adicionar um ouvinte a um evento chamado length-options, que é acionado sempre que há uma alteração na quantidade de opções, que mudam conforme o texto digitado no input. Esse ouvinte chama a função ReadSearchResult passando a quantidade de opções, e sempre que esta quantidade for diferente a função chama a função Reader passando a mensagem a ser lida.

Adicione uma função ReadSearchResult que pega a quantidade de resultados retornado pelo serviço no ouvinte, ao digitar algo no input, e altera o parágrafo <p> de leitura de resultados, atualizando o texto a ser lido pelo leitor de tela que informa a quantidade de items encontrados toda vez que o input sofre alteração.

Adicione uma função Reader que atualiza a o elemento <p> que é lido pelo leitor de tela toda vez que sofre alteração.

# Exemplo do código Javascript:
```
setTimeout(() => {
const service = BradTextFieldSelectService.getInstance(select);
window.LiquidCorp = window.LiquidCorp || {};
window.LiquidCorp.BradTextFieldSelectService = service;

service.eInput.addEventListener("lenght-options", (element) => {
ReadSearchResult(element.detail.length);
});

const meuInput = document.getElementById("my-input");
const helpertext = document.getElementById("helper-text");
const labeltext = document.getElementById("label-text");
const eprefix = document.getElementById("eprefix");

meuInput.addEventListener("focus", function () {
const message = `${helpertext.innerText} ${eprefix.innerText} ${labeltext.innerText}`;
Reader(message);
});
meuInput.addEventListener("blur", function () {
Reader("");
});
}, 1000);

const Reader = (message) => {
let searchResult = document.getElementById("id-search-result");
if (searchResult) {
searchResult.textContent = message;
}
};

const ReadSearchResult = (lenghtOption) => {
let msg = "";
if (lenghtOption == 0) {
msg = "Não existe nenhuma opção";
}
if (lenghtOption == 1) {
msg = `Encontrada ${lenghtOption} opção `;
}
if (lenghtOption > 1) {
msg = `Encontrada ${lenghtOption} opções `;
}
Reader(msg);
};
```

O serviço BradTextFieldSelectService tem um evento lenght-options que é usado para monitorar as alterações de opções do input, esse evento é disparado sempre que o input é alterado e tem todos os efeitos colaterais desta alteração finalizados, por este motivo é indicado o uso dele para chamar a função ReadSearchResult. Garantindo que a função vai trabalhar com as útimas informações utilizadas.

# Exemplos
Default
```
<div>
  <div id="select-206" class="brad-text-field-select brad-m-lg-b">
    <p
      id="id-search-result-select-206"
      aria-live="polite"
      style="opacity: 0; position: absolute;"
    ></p>
    <label class="brad-text-field  ">
      <input
        id="my-input-select-206"
        aria-label="Campo de texto"
        type="text"
        placeholder="Escolha uma opção"
        
        autocomplete="off"
      />
      <em
    aria-hidden="true"
    class="leading-icon i icon-ui-placeholder complements"
  ></em>
      <small id="label-text-select-206" class="placeholder-label-field"
        >Label text</small
      >
      <span id="eprefix-select-206" class="prefix"
    >PREFIX</span
  >
      <em class="validation-icon complements"></em>
      <button class="icon-ui-placeholder arrow complements"></button>
      <span id="helper-text-select-206" class="helper-text">Helper text</span>
      <div class="brad-text-field--background"></div>
    </label>
  </div>
</div>
```
Limpar seleção
```
<div>
    
  <div id="select-95" class="brad-text-field-select brad-m-lg-b">
    <p
      id="id-search-result-select-95"
      aria-live="polite"
      style="opacity: 0; position: absolute;"
    ></p>
    <label class="brad-text-field  ">
      <input
        id="my-input-select-95"
        aria-label="Campo de texto"
        type="text"
        placeholder="Escolha uma opção"
        
        autocomplete="off"
      />
      <em
    aria-hidden="true"
    class="leading-icon i icon-ui-placeholder complements"
  ></em>
      <small id="label-text-select-95" class="placeholder-label-field"
        >Label text</small
      >
      <span id="eprefix-select-95" class="prefix"
    >PREFIX</span
  >
      <em class="validation-icon complements"></em>
      <button class="icon-ui-placeholder arrow complements"></button>
      <span id="helper-text-select-95" class="helper-text">Helper text</span>
      <div class="brad-text-field--background"></div>
    </label>
  </div>


    <button class="brad-btn brad-btn-primary" onClick="clearInput()">
      Limpar seleção
    </button>
  </div>
```
```
function clearInput() {
  service.cleanInput();
}
```
Múltiplos selects com alteração de valores via script
```
<div>
    <h3 class="brad-m-md-b">Primeiro Select</h3>
    
  <div id="select-77" class="brad-text-field-select brad-m-lg-b">
    <p
      id="id-search-result-select-77"
      aria-live="polite"
      style="opacity: 0; position: absolute;"
    ></p>
    <label class="brad-text-field  ">
      <input
        id="my-input-select-77"
        aria-label="Campo de texto"
        type="text"
        placeholder="Escolha uma opção"
        
        autocomplete="off"
      />
      <em
    aria-hidden="true"
    class="leading-icon i icon-ui-placeholder complements"
  ></em>
      <small id="label-text-select-77" class="placeholder-label-field"
        >Label text</small
      >
      <span id="eprefix-select-77" class="prefix"
    >PREFIX</span
  >
      <em class="validation-icon complements"></em>
      <button class="icon-ui-placeholder arrow complements"></button>
      <span id="helper-text-select-77" class="helper-text">Helper text</span>
      <div class="brad-text-field--background"></div>
    </label>
  </div>

    <button
      class="brad-btn brad-btn-primary brad-m-md-b"
      onClick="clickButton1()"
    >
      Setar "Label 2" no Select 1
    </button>

    <h3 class="brad-m-md-b brad-m-xl-t">Segundo Select</h3>
    
  <div id="select-128" class="brad-text-field-select brad-m-lg-b">
    <p
      id="id-search-result-select-128"
      aria-live="polite"
      style="opacity: 0; position: absolute;"
    ></p>
    <label class="brad-text-field  ">
      <input
        id="my-input-select-128"
        aria-label="Campo de texto"
        type="text"
        placeholder="Escolha uma opção"
        
        autocomplete="off"
      />
      <em
    aria-hidden="true"
    class="leading-icon i icon-ui-placeholder complements"
  ></em>
      <small id="label-text-select-128" class="placeholder-label-field"
        >Label text</small
      >
      <span id="eprefix-select-128" class="prefix"
    >PREFIX</span
  >
      <em class="validation-icon complements"></em>
      <button class="icon-ui-placeholder arrow complements"></button>
      <span id="helper-text-select-128" class="helper-text">Helper text</span>
      <div class="brad-text-field--background"></div>
    </label>
  </div>

    <button
      class="brad-btn brad-btn-primary brad-m-md-b"
      onClick="clickButton2()"
    >
      Setar "Label 3" no Select 2
    </button>
  </div>
```