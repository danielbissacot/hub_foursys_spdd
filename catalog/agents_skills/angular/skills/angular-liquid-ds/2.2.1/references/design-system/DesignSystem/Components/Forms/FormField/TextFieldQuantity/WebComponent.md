# TextFieldQuantity

O brad-text-field-quantity é um componente de campo numérico do Design System Bradesco, utilizado para entrada de quantidades em formulários. Ele oferece botões de incremento (+) e decremento (–), suporte a limites mínimo/máximo, step customizável, validação visual e texto auxiliar, além de acessibilidade aprimorada para uso em diferentes contextos.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do Web Component

O componente principal é o <brad-text-field-quantity>, que deve conter internamente um elemento <input type="number"> para entrada de valores numéricos. Também pode conter o subcomponente <brad-text-field-quantity-helper-text> para mensagens auxiliares.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-text-field-quantity | Componente | Sim | Sim | Container principal do campo de quantidade. |
| input[type=number] | Elemento | Sim | Sim | Campo de entrada numérica. |
| brad-text-field-quantity-helper-text | Componente | Não | Sim | Texto auxiliar abaixo do campo. |

# Propriedades
## brad-text-field-quantity

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | Autogerado | Identificador único do componente. |
| brad-on-color | boolean | false | Aplica o modo para fundo escuro (classe CSS). |
| valid | boolean | false | Aplica estado visual de sucesso e exibe brad-text-field-quantity-helper-text . |
| invalid | boolean | false | Aplica estado visual de erro e exibe brad-text-field-quantity-helper-text . |

# <input type="number">

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| value | number | 0 | Valor inicial do campo. |
| step | number | 1 | Valor do incremento/decremento. |
| min | number | - | Valor mínimo permitido. |
| max | number | - | Valor máximo permitido. |
| aria-label | string | - | Descrição para acessibilidade. |


Além desses, todos os atributos nativos do <input type="number"> do HTML também podem ser utilizados normalmente (ex: placeholder, disabled, readonly, maxlength, etc.).

## <brad-text-field-quantity-helper-text>

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| (conteúdo) | string |  | Texto auxiliar exibido abaixo do campo. |

# Uso do HTML

## Ordem recomendada dos elementos:

O <input type="number"> deve ser o primeiro filho do <brad-text-field-quantity>.
O <brad-text-field-quantity-helper-text>, se utilizado, deve ser sempre o último filho dentro do <brad-text-field-quantity>.

Nota: O background é gerado automaticamente pelo componente, não sendo necessário adicioná-lo manualmente. Os botões de incremento (+) e decremento (–) são gerados automaticamente dentro do componente.

```
<brad-text-field-quantity id="quantidade-produto">
<input aria-label="Quantidade" type="number" min="0" max="10" step="1" value="1" />
<brad-text-field-quantity-helper-text>Informe a quantidade desejada</brad-text-field-quantity-helper-text>
</brad-text-field-quantity>
```
Comportamento Javascript
## Inicialização

A inicialização é automática ao inserir o componente no DOM. Não é necessário chamar funções JS manualmente.

# Eventos

O componente <brad-text-field-quantity> não emite eventos customizados. Todos os eventos de interação (como input, change, focus, blur, etc.) são disparados diretamente pelo <input> interno, permitindo o uso dos eventos nativos normalmente, assim como em um campo HTML padrão.

# Acessibilidade

Para que seja verbalizado em tempo real ao usuário quando houver alteração de valor atráves de interação com os botões de mais e menos, adicione o atributo aria-live="polite" no elemento input. Com o uso desse atributo pode ocorrer leitura duplicada do valor quando alterado por digitação, cabendo à jornada, juntamente com a equipe de acessibilidade responsável, determinar a experiência desejada.

# Exemplos
Default
```
<brad-text-field-quantity >
  <input
    aria-label="Campo númerico de quantidade"
    type="number"
    min="0"
    max="5"
    value="0"
    step="1"
  />
  <brad-text-field-quantity-helper-text>Mensagem baseado na validação</brad-text-field-quantity-helper-text>
</brad-text-field-quantity>
```