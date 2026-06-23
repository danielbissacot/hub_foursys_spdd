# TextFieldCode

O text-field-code é um componente utilizado para receber códigos de verificação de acesso, como senhas temporárias recebidas por sms, e-mail ou tokens físicos.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do Web Component

O componente principal é o <brad-text-field-code-container>, que encapsula os campos de código. Ele pode conter opcionalmente <brad-text-field-code-label> e <brad-text-field-code-helper-text>.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-text-field-code-container | Componente | Sim | Sim | Container principal que gera os campos de código dinamicamente. |
| brad-text-field-code | Componente | Não | Sim | Componente interno gerado automaticamente para os campos de entrada. |
| brad-text-field-code-label | Componente | Não | Sim | Rótulo opcional para o campo de código. |
| brad-text-field-code-helper-text | Componente | Não | Sim | Texto auxiliar opcional para instruções ou mensagens de ajuda. |

# Propriedades
## brad-text-field-code-container

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Identificador único do componente, caso não passado, será inserido um único e automático. |
| brad-field-count | number | 4 | Quantidade de campos de entrada a serem gerados. |
| brad-on-color | boolean | false | Usa versão para fundo escuro. |
| type | string | "text" | Tipo dos campos de entrada ("text", "number" ou "password"). |
| value | string | null | Valor inicial dos campos (ex: "1234"). |
| name | string |  | Nome associado aos campos, útil para formulários. |
| disabled | boolean | false | Desabilita todos os campos. |
| valid | boolean | false | Aplica estado visual de sucesso. |
| invalid | boolean | false | Aplica estado visual de erro. |

# Uso do HTML
```
<brad-text-field-code-container id="otp" brad-field-count="4" name="otp" type="number">
<brad-text-field-code-label>Digite o código recebido</brad-text-field-code-label>
<brad-text-field-code-helper-text>O código foi enviado para seu e-mail.</brad-text-field-code-helper-text>
</brad-text-field-code-container>
```
Comportamento Javascript
## Inicialização

A inicialização é automática ao inserir o componente no DOM. Não é necessário chamar funções JS manualmente.

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| change | brad-text-field-code-container | Disparado quando o valor do código é alterado pelo usuário. |
| filled | brad-text-field-code-container | Disparado quando todos os campos estiverem preenchidos. |


Como escutar eventos: A estrutura de uso é sempre a mesma, mudando apenas o nome do evento e a propriedade acessada em event.detail.

# Como usar os eventos?
```
const component = document.querySelector('#otp'); // selecione o componente

component.addEventListener('change', (e) => {
const currentValue = e.detail.value; // valor atual do código
});

component.addEventListener('filled', (e) => {
const value = e.detail.value; // valor preenchido
});
```
## Acessibilidade

O componente foi desenvolvido com HTML semântico, permitindo navegação por teclado e leitura por tecnologias assistivas. Certifique-se de definir o atributo name para integração correta com formulários e leitores de tela.

# Exemplos
Default
```
<brad-text-field-code-container
  id="text-field-code-71"
  brad-field-count="5"
  type="text"
  
  
  
>
  <brad-text-field-code-label>Label</brad-text-field-code-label>
  <brad-text-field-code-helper-text
    >Helper text</brad-text-field-code-helper-text
  >
</brad-text-field-code-container>
```