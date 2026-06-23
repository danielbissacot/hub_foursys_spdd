# TextFieldSelect

O select permite que o usuário selecione uma ou várias opções de um menu dropdown que é exibido depois de clicar ou tocar no campo, ou no Chevron Button, Além do dropdown o usuário também pode digitar e conforme digita os resultados vão sendo filtrados automaticamente.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do Web Component

O componente principal é o <brad-text-field-select>, que pode conter internamente elementos como <input>, além de subcomponentes opcionais para ícone, prefixo, sufixo, ação, validação e texto auxiliar, com funcionalidades específicas de seleção.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-text-field-select | Componente | Sim | Sim | Container principal do campo de seleção. |
| brad-text-field-select-fieldset | Componente | Sim | Sim | Container do fieldset do campo de seleção. |
| input | Elemento | Sim | Sim | Campo de entrada de dados (readonly para seleção). |
| brad-text-field-select-label | Componente | Não | Sim | Rótulo do campo (pode ser texto simples ou componente). |
| brad-text-field-select-leading-icon | Componente | Não | Sem conteúdo | Ícone à esquerda do campo. |
| brad-text-field-select-prefix | Componente | Não | Sim | Prefixo exibido antes do valor. |
| brad-text-field-select-suffix | Componente | Não | Sim | Sufixo exibido após o valor. |
| brad-text-field-select-action | Componente | Não | Sim (caso name for text) | Botão de ação à direita do campo. |
| brad-text-field-select-validation | Componente | Não | Sem conteúdo | Ícone de validação (erro/sucesso). |
| brad-text-field-select-helper-text | Componente | Não | Sim | Texto auxiliar abaixo do campo. |

# Propriedades
## brad-text-field-select

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-text-field-select | tag |  | Tag principal do componente. |
| brad-type | string | "single" | Tipo de seleção: "single" (única), "multi" (múltipla) ou "indeterminate" (indeterminado). |
| brad-options | array | [] | Array de opções para seleção (JSON stringificado). |
| brad-modal-title | string | "" | Título do modal de seleção. |
| brad-modal-subtitle | string | "" | Subtítulo do modal de seleção. |
| brad-dropdown-max-height | string | "300" | Altura máxima do dropdown em pixels. |
| brad-btn-primary-text | string | "Confirmar" | Texto do botão primário no modal. |
| brad-btn-primary-text-disabled | boolean | true | Estado desabilitado do botão primário quando nenhuma opção selecionada. |
| brad-btn-secondary-text | string | "Cancelar" | Texto do botão secundário no modal. |
| brad-on-color | boolean | false | Aplica o modo para fundo escuro (classe CSS). |
| brad-align | string | "left" | Alinhamento do texto: "left" ou "right". |
| valid | boolean | false | Aplica estado visual de sucesso. |
| invalid | boolean | false | Aplica estado visual de erro. |

# Estrutura do brad-options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| text | string | "" | Texto exibido para a opção. |
| value | string | "" | Valor da opção. |
| icon | string | "" | Classe do ícone da opção (opcional). |
| selected | boolean | false | Define se a opção está selecionada. |

## <brad-text-field-select-action>

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| name | string | "text" | Define o tipo de ação: "text", "info" ou uma classe de ícone personalizada. |

# Uso do HTML

## Ordem recomendada dos elementos:

O <input> deve ser o primeiro elemento dentro do <brad-text-field-select-fieldset>.
Caso utilize <brad-text-field-select-leading-icon>, o <brad-text-field-select-label> deve ser colocado obrigatoriamente logo após ele.
Todos os outros subcomponentes (prefix, suffix, action, validation, etc.) devem ser posicionados depois do <brad-text-field-select-label>.
O <brad-text-field-select-helper-text>, se utilizado, deve ser sempre o último filho dentro do <brad-text-field-select-fieldset>.

Atenção: Caso a sequência acima não seja respeitada, poderão ocorrer quebras visuais no componente.

Nota: Se o <brad-text-field-select-validation> não for incluído, o ícone de check ou erro não será exibido quando os atributos valid ou invalid estiverem ativos — apenas a cor do componente será alterada para a cor de validação correspondente.

```
<brad-text-field-select
id="text-field-select"
brad-type="single"
brad-options='[
  {"text": "Opção 1", "value": "opcao1", "icon": "icon-ui-placeholder", "selected": false},
  {"text": "Opção 2", "value": "opcao2", "icon": "icon-ui-placeholder", "selected": true},
  {"text": "Opção 3", "value": "opcao3", "icon": "icon-ui-placeholder", "selected": false}
]'
brad-modal-title="Selecionar Opção"
brad-modal-subtitle="Escolha uma das opções disponíveis"
brad-dropdown-max-height="300"
brad-btn-primary-text="Confirmar"
brad-btn-secondary-text="Cancelar"
>
<brad-text-field-select-fieldset>
  <input aria-label="Campo de seleção" type="text" readonly />
  <brad-text-field-select-leading-icon class="icon-ui-placeholder"></brad-text-field-select-leading-icon>
  <brad-text-field-select-label>Selecionar</brad-text-field-select-label>
  <brad-text-field-select-prefix>R$</brad-text-field-select-prefix>
  <brad-text-field-select-suffix>BRL</brad-text-field-select-suffix>
  <brad-text-field-select-validation></brad-text-field-select-validation>
  <brad-text-field-select-action name="text">Ação</brad-text-field-select-action>
  <brad-text-field-select-helper-text>Texto auxiliar</brad-text-field-select-helper-text>
</brad-text-field-select-fieldset>
</brad-text-field-select>
```
Comportamento Javascript
## Inicialização

A inicialização é automática ao inserir o componente no DOM. O componente automaticamente inicializa o serviço BradTextFieldSelectService com base nas propriedades configuradas.

# Eventos

O componente <brad-text-field-select> emite eventos customizados para interação com as seleções:


| Evento | Descrição | Detalhe |
| --- | --- | --- |
| selected | Disparado quando uma ou mais opções são selecionadas, mesmo que ainda não tenham sido confirmadas — como nos casos de seleção múltipla, seleção indeterminada ou com uso de modal. | event.detail contém as opções selecionadas |
| confirmed | Disparado quando o usuário confirma a seleção, seja via modal ou nos casos de type="multi" ou type="indeterminate". | event.detail contém as opções selecionadas |
| canceled | Disparado quando o usuário cancela a seleção, seja via modal ou nos casos de type="multi" ou type="indeterminate". | event.detail contém as opções selecionadas |

# Como usar os eventos?
```
const component = document.querySelector("#text-field-select");

component.addEventListener("selected", (event) => {
console.log("Opções selecionadas:", event.detail);
console.log("Todas as opções:", component.bradOptions);
});

component.addEventListener("confirmed", (event) => {
console.log("Seleção confirmada:", event.detail);
console.log("Todas as opções:", component.bradOptions);
});

component.addEventListener("canceled", (event) => {
console.log("Seleção cancelada:", event.detail);
console.log("Todas as opções:", component.bradOptions);
});
```
## Propriedades Javascript

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| bradOptions | Array | Array de opções atual, incluindo estados de seleção |
| bradType | String | Tipo de seleção atual ("single", "multi" ou "indeterminate") |
| bradModalTitle | String | Título do modal de seleção |
| bradModalSubtitle | String | Subtítulo do modal de seleção |
| bradDropdownMaxHeight | String | Altura máxima do dropdown em pixels |
| bradBtnPrimaryText | String | Texto do botão primário no modal |
| bradBtnPrimaryTextDisabled | Boolean | Estado desabilitado do botão primário quando nenhuma opção selecionada |
| bradBtnSecondaryText | String | Texto do botão secundário no modal |
| bradOnColor | Boolean | Aplica o modo para fundo escuro |
| bradAlign | String | Alinhamento do texto: "left" ou "right" |
| valid | Boolean | Aplica estado visual de sucesso |
| invalid | Boolean | Aplica estado visual de erro |
| service | Object | Instância do serviço BradTextFieldSelectService |
| service | Object | Instância do serviço BradTextFieldSelectService |

# Acessibilidade

Para acessibilidade é importante adicionar algumas tags para o funcionamento correto do componente, caso veja necessidade:

Adicionar a tag aria-label no input sendo seu valor o nome da label. Para campos de seleção, é importante que o aria-label seja descritivo sobre a funcionalidade de seleção. Como sugestão não use o placeholder como rótulos/labels, pois as tecnologias assistivas, como leitores de tela não o entendem dessa forma e sim que ele seja uma breve descrição do valor esperado ou um exemplo desse valor.

Para campos inválidos onde há mensagem de erro é importante inserir tag aria-invalid="true" e apontar para onde está descrito o erro utilizando a tag aria-errormessage, quando o campo estiver válido é só remover as tags. Os erros devem ser atualizados assim que forem encontrados, dessa forma serão lidos após o usuário sair do input utilizando a tecla tab. A utilização da tag role="alert" vem para informar o usuário sempre que um erro é encontrado em um input. É importante que os erros estejam claros e especifique qual o campo está com o erro.

Quando houver edição em uma seleção com erro é importante limpar os erros e reescrevê-los, pois, assim as tecnologias assistivas entendem que devem anunciar o erro novamente.

Em campos que contenha um helper text que contenha uma instrução de seleção é necessário utilizar a tag aria-describedby apontando para instrução, assim o leitor de telas além de ler a label irá ler as instruções. Quando houver prefixo ou sufixo o mesmo deve ser inserido juntamente com a aria-label do input.

Para campos de seleção, é recomendado usar aria-expanded para indicar se o dropdown/modal está aberto ou fechado, e aria-haspopup para indicar que o campo possui uma lista de opções.

Para seleção múltipla, é importante usar aria-multiselectable="true" e indicar quantas opções estão selecionadas usando aria-describedby apontando para um elemento que descreva a quantidade de seleções.

# Exemplos
Default
```
<brad-text-field-select
  id="text-field-98"
  brad-type="single"
  brad-options="[{&quot;text&quot;:&quot;Label 1&quot;,&quot;icon&quot;:&quot;icon-ui-placeholder&quot;,&quot;value&quot;:&quot;Label 1&quot;,&quot;selected&quot;:false},{&quot;text&quot;:&quot;Label 2&quot;,&quot;icon&quot;:&quot;icon-ui-placeholder&quot;,&quot;value&quot;:&quot;Label 2&quot;,&quot;selected&quot;:false},{&quot;text&quot;:&quot;Label 3&quot;,&quot;icon&quot;:&quot;icon-ui-placeholder&quot;,&quot;value&quot;:&quot;Label 3&quot;,&quot;selected&quot;:false}]"
  brad-modal-title="Modal Title"
  brad-modal-subtitle="Modal Subtitle"
  brad-dropdown-max-height="300"
  brad-btn-primary-text="Confirmar"
  brad-btn-primary-text-disabled="true"
  brad-btn-secondary-text="Cancelar"
  
>
  <brad-text-field-select-fieldset>
    <input aria-label="Campo de texto" type="text" />
    <brad-text-field-select-leading-icon class="icon-ui-placeholder"></brad-text-field-select-leading-icon>
    <brad-text-field-select-label>Label</brad-text-field-select-label>
    <brad-text-field-select-prefix>R$</brad-text-field-select-prefix>
    <brad-text-field-select-suffix>BRL</brad-text-field-select-suffix>
    <brad-text-field-select-validation></brad-text-field-select-validation>
    <brad-text-field-action name="icon-ui-placeholder"></brad-text-field-action>
    <brad-text-field-select-helper-text>Texto auxiliar</brad-text-field-select-helper-text>
  </brad-text-field-select-fieldset>
</brad-text-field-select>
```