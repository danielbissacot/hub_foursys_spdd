# TextFieldCode

O text-field-code é um componente utilizado para receber códigos de verificação de acesso, como senhas temporárias recebidas por sms, e-mail ou tokens físicos.

# Uso do HTML
```
<div id="code-first" class="brad-text-field-code-container">
<div class="brad-text-field-code" aria-label="Campo de código" role="textbox">
  <input id="code-1-first" />
  <input id="code-2-first" />
  <input id="code-3-first" />
  <input id="code-4-first" />
  <input id="code-5-first" />
</div>
</div>
```
Estilos
Com Complementos
```
<div id="code-second" class="brad-text-field-code-container">
<label class="placeholder-label-field-code" aria-hidden="true">Label</label>

<div class="brad-text-field-code" aria-label="Campo de código" role="textbox">
<input id="code-1-second" />
<input id="code-2-second" />
<input id="code-3-second" />
<input id="code-4-second" />
<input id="code-5-second" />
</div>

<span class="helper-text">Helper text</span>
</div>
```
## Modo OnColor

Adicione a classe brad-text-field-code-container--on-color na mesma hierarquia da classe brad-text-field-code-container

```
<div
id="code-second"
class="brad-text-field-code-container brad-text-field-code-container--on-color"
>
<label class="placeholder-label-field-code" aria-hidden="true">Label</label>

<div class="brad-text-field-code" aria-label="Campo de código" role="textbox">
<input id="code-1-second" />
<input id="code-2-second" />
<input id="code-3-second" />
<input id="code-4-second" />
<input id="code-5-second" />
</div>

<span class="helper-text">Helper text</span>
</div>
```
## Observação

é de suma importância construir o HTML do componente com a sequência de elementos (complementos) corretamente, que é:

## 1 - placeholder-label-field-code

## 2 - div.brad-text-field-code > inputs - obrigatório

# 3 - helper-text

# Comportamento Javascript
## Inicialização

## Inicializar elementos do TextFieldCode

```
/** É necessário inicializar o componente passando o id ou classe da seguinte maneira: { targetSelector: '#id ou .classe' }, que esteja na mesma
* hierarquia do .brad-text-field-code-container, caso não passe o { targetSelector: '#id ou .classe' }, todos os componentes criados
* com o HTML do TextFieldCode acima serão inicializados. */
const targetSelector = "#code-first";
const options = { targetSelector };

LiquidCorp.BradTextFieldCodeService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo [{targetSelector: "#targetSelector1"}, {targetSelector: "#targetSelector2"}, {targetSelector: "#targetSelector3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID ou .classe vinculado ao HTML do componente |

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetro | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| enable | N/A | Ativa todos os inputs dentro de div.brad-text-field-code-container ou apenas o do seletor passado por parâmetro |
| disable | N/A | Desativa todos os inputs dentro de div.brad-text-field-code-container ou apenas o do seletor passado por parâmetro |
| getValue | N/A | É retornado valor digitado nos campos como um único valor (é uma promise) |
| setValue | value: string | Atualiza o valor dos campos de código com o valor passado por parâmetro. |
| isFieldFilled | N/A | É retardo true, caso todos os campos de código tenham sido preenchidos, e falso caso não tenham ou apenas o do seletor passado por parâmetro |

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| change | .brad-text-field-code-container | Disparado quando o valor do código é alterado pelo usuário. |
| filled | .brad-text-field-code-container | Disparado quando todos os campos estiverem preenchidos. |


Como escutar eventos: Todos os eventos devem ser escutados usando addEventListener no service.component.

# Como usar os eventos?
```
const service = LiquidCorp.BradTextFieldCodeService.getInstance(options);

service.component.addEventListener('change', (e) => {
const currentValue = e.detail.value; // valor atual do código
});

service.component.addEventListener('filled', (e) => {
const value = e.detail.value; // valor preenchido
});
```
Uso básico
```
const targetSelector = "#code-first";
const options = { targetSelector };
const eCodesContainer = document.querySelector(`#${targetSelector}`);

const service = LiquidCorp.BradTextFieldCodeService.getInstance(options);

function enableTextFieldCode() {
service.enable();
}

function disableTextFieldCode() {
service.disable();
}

service.getValue(); // ex: retornará 123456
service.isFieldFilled(); // ex: retornará true
// Caso você tenha inicializado o componente sem passar um seletor, será necessário passar o seletor nesses métodos acima como param

eCodesContainer.addEventListener("onChange", async () => {
// Evento customizado do componente para obter todas as mudanças de valores no OTP
const currentValue = await service.getValue();
// console.log(currentValue);
});
```
## Acessibilidade

Certifique-se de adicionar o tabindex="0" no elemento Label, para que faça a leitura do placeholder. E o aria-label, com a descrição de seu text-field, e o role="textbox" à div principal.

É necessário incluir o atributo "tabindex= 1" no elemento helper text, possibilitando ao usuário que utiliza o leitor de tela, a leitura do conteúdo.

```
<div
id="code-first"
class="brad-text-field-code-container"
>
<label class="placeholder-label-field-code">Label</label>
<div class="brad-text-field-code" aria-label="Campo de código" role="textbox">
  <input id="code-first-1" />
  <input id="code-first-2" />
  <input id="code-first-3" />
  <input id="code-first-4" />
  <input id="code-first-5" />
</div>
<span class="helper-text">Helper text</span>
</div>
```
## Exemplos

Obs: Use o botão show code abaixo do exemplo para ver o HTML.

# Default

Para o uso do TextFieldCode é importante seguir a logica de implementação do código, inserir todas as tags obrigatorias na ordem conforme o exemplo.

```
<div class="brad-theme-classic">
  <div
    id="code-first-4"
    class="brad-text-field-code-container "
  >
    <label class="placeholder-label-field-code" tabindex="0">Label</label>
    <div
      class="brad-text-field-code"
      aria-label="Campo de código"
      role="textbox"
    >
      <input id="code-first-1-first-ex" />
      <input id="code-first-2-first-ex" />
      <input id="code-first-3-first-ex" />
      <input id="code-first-4-first-ex" />
      <input id="code-first-5-first-ex" />
    </div>
    <span class="helper-text" tabindex="1">Helper text</span>
  </div>
</div>
```
Filled
```
<div id="code-339" class="brad-text-field-code-container ">
  <label
    class="placeholder-label-field-code"
    aria-label="Label"
    tabindex="0"
    >Label</label
  >

  <div class="brad-text-field-code" role="textbox">
    <input id="code-1-second" value="1" />
    <input id="code-2-second" value="2" />
    <input id="code-3-second" value="3" />
    <input id="code-4-second" value="4" />
    <input id="code-5-second" value="5" />
    <input id="code-6-second" value="6" />
    <input id="code-7-second" value="7" />
    <input id="code-8-second" value="8" />
  </div>

  <span class="helper-text">Helper text</span>
</div>

<div class="brad-flex brad-flex-justify-content-end">
  <button
    class="brad-btn brad-btn-primary brad-btn--auto brad-m-sm-t brad-m-xs-r"
    onclick="enableTextFieldCode()"
  >
    Habilitar
  </button>
  <button
    class="brad-btn brad-btn-secondary brad-btn--auto brad-m-sm-t"
    onclick="disableTextFieldCode()"
  >
    Desabilitar
  </button>
</div>
```
Password
```
<div
  id="code-container-password"
  class="brad-text-field-code-container brad-m-md-b"
>
  <label class="placeholder-label-field-code" aria-label="Label"
    >Label</label
  >

  <div class="brad-text-field-code" role="textbox">
    <input id="code-1-third" value="1" type="password" />
    <input id="code-2-third" value="2" type="password" />
    <input id="code-3-third" value="3" type="password" />
    <input id="code-4-third" value="4" type="password" />
    <input id="code-5-third" value="5" type="password" />
    <input id="code-6-third" value="6" type="password" />
    <input id="code-7-third" value="7" type="password" />
    <input id="code-8-third" value="8" type="password" />
  </div>

  <span class="helper-text">Helper text</span>
</div>

<div class="just-show-when-load">
  Value:
  <span id="value-code"></span>
  <!-- para atualizar o valor é necessário o seguinte código:
  const service = new BradTextFieldCodeService();
  service.getValue("code-container-password").then((value) => {
    document.getElementById("value-code").innerText = value;
  }).catch((error) => {});
-->
</div>

<div class="just-show-when-load">
  Filled:
  <span id="value-code-filled"></span>
  <!-- para atualizar o valor é necessário o seguinte código:
  const service = new BradTextFieldCodeService();
  document.getElementById("value-code-filled").innerText = service.isFieldFilled("code-container-password");
-->
</div>
```