# TextFieldNumber

Componente de campo númerico utilizando funcionalidades nativas com estilização no padrão Liquid.

# Uso do HTML
```
<label id="text-field-number" class="brad-text-field brad-m-md-b">
<input aria-label="Campo númerico" class="" type="number" inputmode="numeric" step="1" min="0" max="25" value="0" placeholder="Hint text" />
<small aria-hidden="true" class="placeholder-label-field">Label text</small>
<em class="validation-icon complements"></em>
<button aria-label="Subtrair 2" class="minus complements"></button>
<button aria-label="Somar 2" class="plus complements"></button>
<span class="helper-text"></span>
<div class="brad-text-field--background"></div>
</label>
```
```
<label id="text-field-number" className="brad-text-field brad-m-md-b">
<input aria-label="Campo númerico" className="" type="number" inputmode="numeric" step="1" min="0" max="25" value="0" placeholder="Hint text" >
<small aria-hidden="true" className="placeholder-label-field">Label text</small>
<em className="validation-icon complements"></em>
<button aria-label="Subtrair 2" className="minus complements"></button>
<button aria-label="Somar 2" className="plus complements"></button>
<span className="helper-text"></span>
<div className="brad-text-field--background"></div>
</label>
```
Estilos
Com complementos
```
<label id="text-field-number" class="brad-text-field brad-m-md-b">
<input aria-label="Campo númerico" class="" type="number" inputmode="numeric" step="1" min="0" max="25" value="0" placeholder="Hint text" />
<small aria-hidden="true" class="placeholder-label-field">Label text</small>
<span class="prefix complements">PREFIX</span>
<span class="suffix">SUFFIX</span>
<em class="validation-icon complements"></em>
<button aria-label="Subtrair 2" class="minus complements"></button>
<button aria-label="Somar 2" class="plus complements"></button>
<span class="helper-text">Helper text</span>
<div class="brad-text-field--background"></div>
</label>
```
```
<label id="text-field-number" className="brad-text-field brad-m-md-b">
<input aria-label="Campo númerico" className="" type="number" inputmode="numeric" step="1" min="0" max="25" value="0" placeholder="Hint text" >
<small aria-hidden="true" className="placeholder-label-field">Label text</small>
<span className="prefix complements">PREFIX</span>
<span className="suffix">SUFFIX</span>
<em className="validation-icon complements"></em>
<button aria-label="Subtrair 2" className="minus complements"></button>
<button aria-label="Somar 2" className="plus complements"></button>
<span className="helper-text">Helper text</span>
<div className="brad-text-field--background"></div>
</label>
```
## Modo OnColor

Adicione a classe text-field-number--on-color na mesma hierarquia da classe text-field-number

```
<label id="text-field-number text-field-number--on-color" class="brad-text-field brad-m-md-b">
<input aria-label="Campo númerico" class="" type="number" inputmode="numeric" step="1" min="0" max="25" value="0" placeholder="Hint text" />
<small aria-hidden="true" class="placeholder-label-field">Label text</small>
<span class="prefix complements">PREFIX</span>
<span class="suffix">SUFFIX</span>
<em class="validation-icon complements"></em>
<button aria-label="Subtrair 2" class="minus complements"></button>
<button aria-label="Somar 2" class="plus complements"></button>
<span class="helper-text">Helper text</span>
<div class="brad-text-field--background"></div>
</label>
```
## Observação

É de suma importância construir o HTML do componente com a sequência de elementos (complementos) corretamente, que é:

# input - obrigatório

## placeholder-label-field - obrigatório

# prefix

# suffix

# validation-icon - obrigatório

helper-text - obrigatório (caso não tenha texto, deixar vazio)

## brad-text-field--background - obrigatório

# Comportamento Javascript
## Inicialização

## Inicializar elementos do TextField

```
/** É necessário inicializar o componente passando o id ou classe da seguinte maneira: { targetSelector: '#id ou .classe' }, que esteja na mesma
* hierarquia do .brad-text-field, caso não passe o { targetSelector: '#id ou .classe' }, todos os componentes criados
* com o HTML do TextFieldNumber acima serão inicializados. */
const targetSelector = "#text-field-number";
const options = { targetSelector };

LiquidCorp.BradTextFieldNumberService.getInstance(options);
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo [{targetSelector: "#targetSelector1"}, {targetSelector: "#targetSelector2"}, {targetSelector: "#targetSelector3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | #ID ou .classe vinculado ao HTML do componente |

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetro | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getValue | options: { targetSelector: '#id ou .classe' } ou passar vazio que vai ser o da instância | Obtém o valor digitado no campo |

# Uso básico
```
// Uso básico dos métodos
const targetSelector = "#text-field-number";
const options = { targetSelector };

const instance = LiquidCorp.BradTextFieldNumberService.getInstance(options);
instance.getValue(); // Caso queira obter o valor do campo específico da instância, passe o param vazio, senão passe o seletor.
```
## Acessibilidade

Para que seja verbalizado em tempo real ao usuário quando houver alteração de valor atráves de interação com os botões de soma e subtração, adicione o atributo aria-live="polite" no elemento input. Com o uso desse atributo pode ocorrer leitura duplicada do valor quando alterado por digitação, cabendo à jornada, juntamente com a equipe de acessibilidade responsável, determinar a experiência desejada.




Adicione o atributo aria-label ao element input, nele deve conter as informações de placeholder e helper text, além das informações sobre o text-field. Também é necessário incluir o atributo aria-hidden="true" para o elemento de place holder.




O atributo aria-label, também deve ser adicionado aos botões de soma e subtração.




Para a leitura correta do PREFIX e SUFFIX do componente, devemos adicionar os atributos tabindex="0" e aria-label no elemento span que contém a informação.




É necessário incluir o atributo aria-hidden="true" no elemento de helper-text para que não sejam lidos quando não estiverem visíveis em tela e, alterar via js em seu projeto, para aria-hidden="false" e adicionar tabindex="1" quando a mensagem estiver visível, para que ela seja verbalizada ao usuário.



```
<div class="brad-theme-classic">
<label id="input-4193" class="brad-text-field  brad-m-md-b">
  <input aria-label="Campo númerico, placeholder, helper text" class="" type="number" inputmode="numeric" step="1" min="0" max="25" value="0" placeholder="Hint text" aria-live="polite">
  <small aria-hidden="true" class="placeholder-label-field">Label text</small>
  <span class="prefix complements" aria-label="prefix" tabindex="0">PREFIX</span>
  <span class="suffix" aria-label="suffix" tabindex="0">SUFFIX</span>
  <em class="validation-icon complements"></em>
  <button aria-label="Subtrair 1" class="minus complements"></button>
  <button aria-label="Somar 1" class="plus complements"></button>
  <span class="helper-text" aria-hidden="true">Helper text</span>
  <div class="brad-text-field--background"></div>
</label>
</div>
```
Exemplos
Default
```
<div class="brad-theme-classic">
  <label
    id="input-1226"
    class="brad-text-field  brad-m-md-b"
  >
    <input
      aria-label="Campo númerico"
      class=""
      inputmode="numeric"
      type="number"
      step="1"
      min="0"
      max="25"
      value="0"
      placeholder="Hint text"
      
    />
    <small aria-hidden="true" class="placeholder-label-field"
      >Label text</small
    >
    <span class="prefix complements">PREFIX</span> <span class="suffix">SUFFIX</span>
    <em class="validation-icon complements"></em>
    <button aria-label="Subtrair 1" class="minus complements"></button>
    <button aria-label="Somar 1" class="plus complements"></button>
    <span class="helper-text">Helper text</span>
    <div class="brad-text-field--background"></div>
  </label>
</div>
```