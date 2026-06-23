# TextField

O brad-text-field é um componente de campo de texto do Design System Bradesco, utilizado para entrada de dados em formulários, como textos, números, senhas, entre outros. Suporta diferentes variações, ícones, prefixos, sufixos, validação, ação customizada e acessibilidade.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do Web Component

O componente principal é o <brad-text-field>, que pode conter internamente elementos como <input> ou <textarea>, além de subcomponentes opcionais para ícone, prefixo, sufixo, ação, validação e texto auxiliar.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-text-field | Componente | Sim | Sim | Container principal do campo de texto. |
| input/textarea | Elemento | Sim | Sim | Campo de entrada de dados. |
| brad-text-field-label | Componente | Não | Sim | Rótulo do campo (pode ser texto simples ou componente). |
| brad-text-field-leading-icon | Componente | Não | Sem conteúdo | Ícone à esquerda do campo. |
| brad-text-field-prefix | Componente | Não | Sim | Prefixo exibido antes do valor. |
| brad-text-field-suffix | Componente | Não | Sim | Sufixo exibido após o valor. |
| brad-text-field-action | Componente | Não | Sim (caso name for text) | Botão de ação à direita do campo. |
| brad-text-field-validation | Componente | Não | Sem conteúdo | Ícone de validação (erro/sucesso). |
| brad-text-field-helper-text | Componente | Não | Sim | Texto auxiliar abaixo do campo. |

# Propriedades
## brad-text-field

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-text-field | tag |  | Tag principal do componente. |
| brad-text-field--on-color | boolean | false | Aplica o modo para fundo escuro (classe CSS). |
| valid | boolean | false | Aplica estado visual de sucesso. |
| invalid | boolean | false | Aplica estado visual de erro. |

## <textarea> (usado dentro do brad-text-field)

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| rows | number | N/A | Número de linhas visíveis do textarea. |
| data-textarea-expander | boolean | false | Expande automaticamente a altura do textarea conforme o texto - se for usado, o rows não pode ser maior que 2. |


O <textarea> (assim como o <input>) pode receber qualquer atributo nativo do HTML, como placeholder, maxlength, disabled, etc.

# <brad-text-field-action>

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| name | string | "text" | Define o tipo de ação: "text", "info" ou uma classe de ícone personalizada. |


Se o <input> for do tipo number, o componente gera automaticamente botões de incremento (+) e decremento (–) ao lado do campo, respeitando o valor do atributo step.

# Uso do HTML

## Ordem recomendada dos elementos:

Caso utilize <brad-text-field-leading-icon>, o <brad-text-field-label> deve ser colocado obrigatoriamente logo após ele.
Todos os outros subcomponentes (prefix, suffix, action, validation, etc.) devem ser posicionados depois do <brad-text-field-label>.
O <brad-text-field-helper-text>, se utilizado, deve ser sempre o último filho dentro do <brad-text-field>.

Atenção: Caso a sequência acima não seja respeitada, poderão ocorrer quebras visuais no componente.

Nota: Se o <brad-text-field-validation> não for incluído, o ícone de check ou erro não será exibido quando os atributos valid ou invalid estiverem ativos — apenas a cor do componente será alterada para a cor de validação correspondente.

```
<brad-text-field id="meu-campo">
<input aria-label="Campo de texto" type="text" />
<brad-text-field-leading-icon class="icon-ui-placeholder"></brad-text-field-leading-icon>
<brad-text-field-label>Nome</brad-text-field-label>
<brad-text-field-prefix>R$</brad-text-field-prefix>
<brad-text-field-suffix>BRL</brad-text-field-suffix>
<brad-text-field-validation></brad-text-field-validation>
<brad-text-field-action name="text">Ação</brad-text-field-action>
<brad-text-field-helper-text>Texto auxiliar</brad-text-field-helper-text>
</brad-text-field>
```
Comportamento Javascript
## Inicialização

A inicialização é automática ao inserir o componente no DOM. Não é necessário chamar funções JS manualmente.

# Eventos

O componente <brad-text-field> não emite eventos customizados. Todos os eventos de interação (como input, change, focus, blur, etc.) são disparados diretamente pelo <input> ou <textarea> interno, permitindo o uso dos eventos nativos normalmente, assim como em um campo HTML padrão.

# Acessibilidade

Para acessibilidade é importante adicionar algumas tags para o funcionamento correto do componente, caso veja necessidade:

Adicionar a tag aria-label no input sendo seu valor o nome da label. Como sugestão não use o placeholder como rótulos/labels, pois as tecnologias assistivas, como leitores de tela não o entendem dessa forma e sim que ele seja uma breve descrição do valor esperado ou um exemplo desse valor. Se o aria-label e o placeholder conter o mesmo valor o leitor de telas irá repetir o valor duas vezes.

Para campos inválidos onde há mensagem de erro é importante inserir tag aria-invalid="true" e apontar para onde está descrito o erro utilizando a tag aria-errormessage, quando o campo estiver válido é só remover as tags. Os erros devem ser atualizados assim que forem encontrados, dessa forma serão lidos após o usuário sair do input utilizando a tecla tab. A utilização da tag role="alert" vem para informar o usuário sempre que um erro é encontrado em um input. É importante que os erros estejam claros e especifique qual o campo está com o erro.

Quando houver edição em um campo com erro é importante limpar os erros e reescrevê-los, pois, assim as tecnologias assistivas entendem que devem anunciar o erro novamente.

Em campos que contenha um helper text que contenha uma instrução de preenchimento é necessário utilizar a tag aria-describedby apontando para instrução, assim o leitor de telas além de ler a label irá ler as instruções. Quando houver prefixo ou sufixo o mesmo deve ser inserido juntamente com a aria-label do input.

# Exemplos
Default
```
<brad-text-field
  id="text-field-96"
  
>
  <input aria-label="Campo de texto" type="text" value="Valor do campo" />
  <brad-text-field-leading-icon class="icon-ui-placeholder"></brad-text-field-leading-icon>
  <brad-text-field-label>Label</brad-text-field-label>
  <brad-text-field-prefix>R$</brad-text-field-prefix>
  <brad-text-field-suffix>BRL</brad-text-field-suffix>
  <brad-text-field-validation></brad-text-field-validation>
  <brad-text-field-action name="icon-ui-placeholder"></brad-text-field-action>
  <brad-text-field-helper-text>Texto auxiliar</brad-text-field-helper-text>
</brad-text-field>
```