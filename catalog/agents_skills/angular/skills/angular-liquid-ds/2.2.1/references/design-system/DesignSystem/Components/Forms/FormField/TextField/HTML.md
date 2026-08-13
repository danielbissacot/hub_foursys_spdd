# TextField

O text-field é um componente de campo que utiliza funcionalidades nativas com estilização no padrão Liquid.

# Uso do HTML
```
<label class="brad-text-field">
<input
  aria-label="Campo de texto"
  type="text"
  value="Typing text"
  placeholder="Hint text"
/>
<small aria-hidden="true" class="placeholder-label-field">Label text</small>
<em class="validation-icon complements"></em>
<div class="brad-text-field--background"></div>
</label>
```

# Label text



# Estilos
Com trailing-icon-interactive
```
<label class="brad-text-field">
<input
  aria-label="Campo de texto"
  type="text"
  value="Typing text"
  placeholder="Hint text"
/>
<small aria-hidden="true" class="placeholder-label-field">Label text</small>
<em class="validation-icon complements"></em>
<button
  aria-label="Aria label"
  className="trailing-icon-interactive complements"
>
  <em class="icon-ui-placeholder"></em>
</button>
<div class="brad-text-field--background"></div>
</label>
```

# Label text

# Com button info
```
<label class="brad-text-field">
<input
  aria-label="Campo de texto"
  type="text"
  value="Typing text"
  placeholder="Hint text"
/>
<small aria-hidden="true" class="placeholder-label-field">Label text</small>
<em class="validation-icon complements"></em>
<button
  class="trailing-button-info complements brad-btn brad-btn-info i icon-component-question-mark"
></button>
<div class="brad-text-field--background"></div>
</label>
```

# Label text

# Com button text
```
<label class="brad-text-field brad-m-md-b">
<input
  aria-label="Campo de texto"
  type="text"
  value="Typing text"
  placeholder="Hint text"
/>
<small aria-hidden="true" class="placeholder-label-field">Label text</small>
<em class="validation-icon complements"></em>
<button
  class="trailing-button-text complements brad-btn brad-btn-text brad-btn-text--no-bg"
>
  Action
</button>
<span class="helper-text">Helper text</span>
<div class="brad-text-field--background"></div>
</label>
```

# Label text

# Action

# Helper text
Com complementos
```
<label class="brad-text-field brad-m-md-b">
<input
  aria-label="Campo de texto"
  type="text"
  value="Typing text"
  placeholder="Hint text"
/>
<em
  aria-hidden="true"
  class="leading-icon i icon-ui-placeholder complements"
></em>
<small aria-hidden="true" class="placeholder-label-field">Label text</small>
<span class="prefix">PREFIX</span>
<span class="suffix">SUFFIX</span>
<em class="validation-icon complements"></em>
<span class="helper-text">Helper text</span>
<div class="brad-text-field--background"></div>
</label>
```

# Label text

# PREFIX
SUFFIX
Helper text
## Modo OnColor

Adicione a classe brad-text-field--on-color na mesma hierarquia da classe brad-text-field

```
<label class="brad-text-field brad-text-field--on-color brad-m-md-b">
<input
  aria-label="Campo de texto"
  type="text"
  value="Typing text"
  placeholder="Hint text"
/>
<em
  aria-hidden="true"
  class="leading-icon i icon-ui-placeholder complements"
></em>
<small aria-hidden="true" class="placeholder-label-field">Label text</small>
<span class="prefix">PREFIX</span>
<span class="suffix">SUFFIX</span>
<em class="validation-icon complements"></em>
<span class="helper-text">Helper text</span>
<div class="brad-text-field--background"></div>
</label>
```
Expander
```
<label id="text-field-textarea" class="brad-text-field brad-m-md-b">
<textarea
  type="text"
  placeholder="Hint text"
  rows="1"
  data-textarea-expander
></textarea>
<small aria-hidden="true" class="placeholder-label-field">Label text</small>
<span class="helper-text">Helper text</span>
<div class="brad-text-field--background"></div>
</label>
```

# Label text

# Helper text
## Atributos

Ao adicionar o atributo data-textarea-expander em um textarea com a estrutura HTML acima, ele terá o seguinte comportamento: (lembrando que é necessário seguir o para que funcione essa funcionalidade).

O texto corre horizontalmente para a direita e conforme ultrapassar o limite lateral, há quebra de linha na caixa de texto, o que aumenta a altura do textarea, apagar a nova linha diminui a altura responsivamente. Esta altura pode chegar a até 3 linhas, então a altura é bloqueada e o conteúdo se comporta como no modo textarea normal (com rolamento vertical).

#####Observação é de suma importância construir o HTML do componente com a sequência de elementos (complementos) corretamente, que é:

1 - input - obrigatório 2 - leading-icon 3 - placeholder-label-field - obrigatório 4 - prefix 5 - suffix 6 - validation-icon - obrigatório 7 - trailing-icon 8 - trailing-button-text 9 - helper-text 10 - brad-text-field--background - obrigatório

# Comportamento Javascript
## Inicialização

## Inicializar elementos do TextArea Expander

```
/** É necessário inicializar o componente passando o id ou classe da seguinte maneira: { targetSelector: '#id ou .classe' }, que esteja na mesma
* hierarquia do .brad-text-field, caso não passe o { targetSelector: '#id ou .classe' }, todos os componentes criados
* com o HTML do TextArea Expander acima serão inicializados. */
const targetSelector = "#text-field-textarea";
const options = { targetSelector };

LiquidCorp.BradTextFieldService.getInstance(options);
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

# Acessibilidade

Para acessibilidade é importante adicionar algumas tags para o funcionamento correto do componente:

Adicionar a tag aria-label no input sendo seu valor o nome da label. Como sugestão não use o placeholder como rótulos/labels, pois as tecnologias assistivas, como leitores de tela não o entendem dessa forma e sim que ele seja uma breve descrição do valor esperado ou um exemplo desse valor. Se o aria-label e o placeholder conter o mesmo valor o leitor de telas irá repetir o valor duas vezes.

```
<label class="brad-text-field brad-m-md-b">
<input
  aria-label="Label Text"
  class=""
  type="text"
  value="Typing text"
  placeholder="Hint text"
/>
<small aria-hidden="true" class="placeholder-label-field">Label text</small>
<em class="validation-icon complements"></em>
<span class="helper-text">Helper text</span>
<div class="brad-text-field--background"></div>
</label>
```

Para campos inválidos onde há mensagem de erro é importante inserir tag aria-invalid="true" e apontar para onde está descrito o erro utilizando a tag aria-errormessage, quando o campo estiver válido é só remover as tags. Os erros devem ser atualizados assim que forem encontrados, dessa forma serão lidos após o usuário sair do input utilizando a tecla tab. A utilização da tag role="alert" vem para informar o usuário sempre que um erro é encontrado em um input. É importante que os erros estejam claros e especifique qual o campo está com o erro.

Quando houver edição em um campo com erro é importante limpar os erros e reescrevê-los, pois, assim as tecnologias assistivas entendem que devem anunciar o erro novamente.

```
<label class="brad-text-field invalid brad-m-md-b">
<input
  aria-label="Label Text"
  class=""
  type="text"
  value="Typing text"
  placeholder="Hint text"
  aria-invalid="true"
  aria-errormessage="err"
/>
<small aria-hidden="true" class="placeholder-label-field">Label text</small>
<em class="validation-icon complements"></em>
<span class="helper-text" id="err" role="alert">Helper text</span>
<div class="brad-text-field--background"></div>
</label>
```

Em campos que contenha um helper text que contenha uma instrução de preenchimento é necessário utilizar a tag aria-describedby apontando para instrução, assim o leitor de telas além de ler a label irá ler as instruções. Quando houver prefixo ou sufixo o mesmo deve ser inserido juntamente com a aria-label do input.

```
<label class="brad-text-field brad-m-md-b">
<input
  aria-label="Label text Prefixo R$"
  class=""
  type="text"
  value=""
  placeholder="Hint text"
  aria-describedby="helperTeste"
/>

<small aria-hidden="true" class="placeholder-label-field">
Label text
</small>
<span class="prefix">R$</span>
<em class="validation-icon complements"></em>

<!-- SEM BUTTON LINK -->

<span class="helper-text" id="helperTeste">Deve conter somente numeros.</span>
<div class="brad-text-field--background"></div>
</label>
```
Observações
## Placeholder

Para que o comportamento da label seja exibido corretamente, é necessário que o atributo placeholder esteja presente no elemento input. Mesmo que não deseje exibir um placeholder visível, utilize placeholder=" " (um espaço em branco). Isso garante que a label suba apenas quando o campo estiver em foco ou contiver um valor digitado.

Segue demonstração do uso sem placeholder=" " (um espaço em branco):

```
<label class="brad-text-field brad-m-xl-b">
  <input aria-label="Campo de texto" type="text" />
  <em
    aria-hidden="true"
    class="leading-icon i icon-ui-placeholder complements"
  ></em>
  <small aria-hidden="true" class="placeholder-label-field"
    >Label text</small
  >
  <span class="suffix">SUFFIX</span>
  <em class="validation-icon complements"></em>
  <button
    aria-label="Aria label"
    class="trailing-icon-interactive complements"
  >
    <em class="icon-ui-placeholder"></em>
  </button> <!-- SEM BUTTON LINK -->
  <span class="helper-text"
    >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
    bibendum, ex sit amet faucibus ultricies, sem sem vehicula sapien, ac
    ullamcorper risus nulla at eros.</span
  >
  <div class="brad-text-field--background"></div>
</label>
<div></div>
```
## Exemplos

Obs: Use o botão show code abaixo do exemplo para ver o HTML.

# Default

Para o uso do TextField é importante seguir a logica de implementação do código, inserir todas as tags obrigatorias na ordem conforme o exemplo.

```
<label
  class="brad-text-field  brad-m-xl-b"
>
  <input
    aria-label="Campo de texto"
    class=""
    type="text"
    value="Typing text"
    placeholder="Hint text"
    
  />
  <em
    aria-hidden="true"
    class="leading-icon i icon-ui-placeholder complements"
  ></em>
  <small aria-hidden="true" class="placeholder-label-field"
    >Label text</small
  >
  <span class="prefix">PREFIX</span> <span class="suffix">SUFFIX</span>
  <em class="validation-icon complements"></em>
  <button
    aria-label="Aria label"
    class="trailing-icon-interactive complements"
  >
    <em class="icon-ui-placeholder"></em>
  </button> <!-- SEM BUTTON LINK -->
  <span class="helper-text"
    >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
    bibendum, ex sit amet faucibus ultricies, sem sem vehicula sapien, ac
    ullamcorper risus nulla at eros.</span
  >
  <div class="brad-text-field--background"></div>
</label>
<div></div>
```
WithoutHelperText
```
<label class="brad-text-field ">
  <input
    aria-label="Campo de texto"
    class=""
    type="text"
    value="Typing text"
    placeholder="Hint text"
    
  />
  <em
    aria-hidden="true"
    class="leading-icon i icon-ui-placeholder complements"
  ></em> <span class="prefix">PREFIX</span> <span class="suffix">SUFFIX</span>
  <em class="validation-icon complements"></em>
  <small class="placeholder-label-field">Label text</small>
  <div class="brad-text-field--background"></div>
</label>
```
TextArea
```
<label
      class="brad-text-field  brad-m-md-b "
    >
      <textarea
        aria-label="Campo de texto"
        type="text"
        placeholder="Hint text"
        rows="3"
        
      >
Typing text</textarea
      >
      <small
        aria-hidden="true"
        aria-hidden="true"
        class="placeholder-label-field"
        >Label text</small
      >
      <em class="validation-icon complements"></em>
      <span class="helper-text"
        >Helper text <small class="count">11</small></span
      >
      <div class="brad-text-field--background"></div>
    </label>
```
Expander
```
<label
      id="brad-text-field--text-area"
      class="brad-text-field brad-m-md-b "
    >
      <textarea
        aria-label="Campo de texto"
        type="text"
        placeholder="Hint text"
        rows="1"
        data-textarea-expander
        
      >
Lorem Ipsum, Lorem Ipsum, Lorem Ipsum, Lorem Ipsum, Lorem Ipsum, Lorem Ipsum, Lorem Ipsum, Lorem Ipsum, Lorem Ipsum, Lorem Ipsum, Lorem Ipsum, Lorem Ipsum, Lorem Ipsum.</textarea
      >
      <small aria-hidden="true" class="placeholder-label-field"
        >Label text</small
      >
      <span class="helper-text">Helper text</span>
      <div class="brad-text-field--background"></div>
    </label>
```