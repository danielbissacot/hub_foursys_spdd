# TextField Prompt

O brad-text-field-prompt é um componente de campo de texto com prompt card integrado do Design System Bradesco. Ele combina um campo de entrada com um card animado que exibe mensagens e sugestões ao usuário, ideal para assistentes virtuais e suporte contextual. É compatível com frameworks reativos como Angular e React.

# Recursos de Auto-geração:

## O background é gerado automaticamente dentro do label

## O card de prompt é gerado automaticamente pelo componente

## Use componentes auxiliares simplificados para label e ícones

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do Web Component

O componente principal é o <brad-text-field-prompt>, que encapsula um campo de texto e um card de prompt animado. O componente gera automaticamente o background e o card. Use os componentes auxiliares para simplificar o uso.

# Componentes

| Nome | Tipo | Obrigatório | Auto-gerado | Descrição |
| --- | --- | --- | --- | --- |
| brad-text-field-prompt | Componente | Sim | Não | Container principal do campo de texto com prompt. |
| brad-text-field-prompt-input | Componente | Sim | Não | Container do input e botão de microfone. |
| brad-text-field-prompt-label | Componente | Sim | Não | Label que adiciona automaticamente classe CSS. |
| brad-text-field-prompt-icon | Componente | Não | Não | Ícone customizável (BIA por padrão). |
| input | Elemento | Sim | Não | Campo de entrada de dados (gerenciado pela jornada). |
| brad-text-field-prompt-helper-text | Componente | Não | Não | Texto auxiliar/helper text. |
| brad-text-field-prompt-background | Componente | Sim | Sim | Background gerado automaticamente. |
| brad-text-field-prompt-card | Componente | Sim | Sim | Card de prompt gerado automaticamente. |
| brad-text-field-prompt-card-icon-logo | Componente | Sim | Sim | Ícone BIA no card (auto-gerado). |
| brad-text-field-prompt-card-content | Componente | Sim | Sim | Conteúdo do card (auto-gerado). |
| brad-text-field-prompt-card-placeholder | Componente | Sim | Sim | Dots animados (auto-gerado). |
| brad-text-field-prompt-card-container | Componente | Sim | Sim | Container da mensagem (auto-gerado). |
| brad-text-field-prompt-card-text | Componente | Sim | Sim | Texto da mensagem (auto-gerado). |
| brad-text-field-prompt-card-icon-close | Componente | Sim | Sim | Botão de fechar (auto-gerado). |

# Propriedades
## brad-text-field-prompt

| Atributo | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | auto | Identificador único do componente (gerado automaticamente se não fornecido). |
| brad-on-color | boolean | false | Aplica modo para fundos escuros. |
| brad-align | string | "left" | Alinhamento do texto ("left" ou "right"). |
| valid | boolean | false | Aplica estado visual de sucesso. |
| invalid | boolean | false | Aplica estado visual de erro. |
| brad-type-character-speed | number | 70 | Velocidade do efeito de digitação em milissegundos. |
| brad-prompt-card-type | string | "overlap" | Tipo de exibição: "overlap" (sobrepõe) ou "push" (empurra para cima). |
| brad-prompt-message | string | "" | Mensagem a ser exibida no card de prompt. |
| brad-action-link-text | string | "" | Texto do link de ação exibido no card. |
| brad-action-link-href | string | "#" | URL do link de ação. |

# brad-text-field-prompt-icon

| Atributo | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-icon | string | "icon-component-chat-bia" | Classe do ícone a ser exibido. |
| brad-position | string | "leading" | Posição do ícone: "leading" (esquerda) ou "trailing" (direita). |


# Importante:

O componente não encapsula o <input>. A jornada é responsável por gerenciar todos os atributos do input (type, value, placeholder, disabled, etc.).
O background e o card são gerados automaticamente - não é necessário incluí-los manualmente.
Use brad-prompt-message, brad-action-link-text e brad-action-link-href como atributos no componente principal.
O componente possui observers que detectam mudanças nos atributos, ideal para frameworks reativos.
## Uso do HTML

# Estrutura simplificada:

Use <brad-text-field-prompt-label> que adiciona automaticamente a classe brad-text-field.
Use <brad-text-field-prompt-icon> para ícones (BIA por padrão).
O <input> deve estar dentro do <brad-text-field-prompt-label>.
Não inclua manualmente <brad-text-field-prompt-background> - é gerado automaticamente.
Não inclua manualmente <brad-text-field-prompt-card> - é gerado automaticamente.
Use atributos no componente principal para configurar mensagem e link.
```
<brad-text-field-prompt
id="meu-prompt"
brad-type-character-speed="70"
brad-prompt-card-type="overlap"
brad-prompt-message="Falta pouco! A proposta do seu cartão vence em 2 dias."
brad-action-link-text="Concluir contratação"
brad-action-link-href="#"
>
<brad-text-field-prompt-input>
  <brad-text-field-prompt-label>
    <input
      aria-label="Campo de texto"
      type="text"
      placeholder="Digite sua busca"
      class="brad-font-title-sm"
    />

    <!-- Ícone BIA (padrão - pode omitir ou customizar) -->
    <brad-text-field-prompt-icon></brad-text-field-prompt-icon>

    <!-- Ou customizar o ícone -->
    <!-- <brad-text-field-prompt-icon brad-icon="icon-search" brad-position="trailing"></brad-text-field-prompt-icon> -->

    <button
      aria-label="Deletar texto"
      class="delete brad-input-prompt-icon trailing-button-text complements"
    ></button>

    <button
      aria-label="Pesquisar"
      class="search brad-input-prompt-icon trailing-button-text complements"
    ></button>

    <brad-text-field-prompt-helper-text>Texto auxiliar</brad-text-field-prompt-helper-text>
  </brad-text-field-prompt-label>

  <button class="brad-btn brad-btn-icon btn-prompt" aria-label="Usar microfone">
    <em class="btn-icon i icon-component-audio-mic"></em>
  </button>

</brad-text-field-prompt-input>
</brad-text-field-prompt>
```
Comportamento Javascript
## Inicialização

A inicialização é automática ao inserir o componente no DOM. O serviço BradTextFieldPromptService é criado internamente pelo web component.

Importante: O web component não dispara automaticamente o prompt card. A lógica de quando e como exibir o card deve ser implementada pela jornada usando os métodos públicos.

# Métodos Públicos

O componente expõe métodos públicos que podem ser chamados via JavaScript:


| Método | Parâmetros | Retorno | Descrição |
| --- | --- | --- | --- |
| showPrompt() | - | void | Exibe o prompt card no estágio inicial (dots animados). |
| showMessage() | - | Promise | Inicia o efeito de digitação da mensagem no card. |
| closePrompt() | - | Promise | Fecha o prompt card. |
| getInput() | - | Element | Retorna o elemento input interno. |


## Nota sobre atualização de conteúdo:

Para alterar a mensagem dinamicamente, use os atributos brad-prompt-message, brad-action-link-text e brad-action-link-href.
O componente possui observers que detectam automaticamente mudanças nos atributos e sincronizam com o service.
Exemplo Angular: [bradPromptMessage]="mensagemDinamica"
Exemplo React: bradPromptMessage={mensagemDinamica}
Exemplo de uso
```
// Obter referência do componente
const promptComponent = document.getElementById('meu-prompt');
// Obter o input
const input = promptComponent.getInput();
// Definir timer para exibir o prompt após 2 segundos sem interação
let timer;
const timerToShowPromptCard = 2000;
const showPromptCard = () => {
promptComponent.showPrompt();

// Após 3 segundos, mostrar a mensagem
setTimeout(() => {
promptComponent.showMessage();
}, 3000);
};
const cancelShowPromptCard = () => {
clearTimeout(timer);
};
// Iniciar timer
timer = setTimeout(showPromptCard, timerToShowPromptCard);
// Cancelar se o usuário interagir
input.addEventListener('input', cancelShowPromptCard);
```
## Eventos

O componente emite eventos customizados que podem ser capturados pela jornada:


| Elemento | Evento | Descrição |
| --- | --- | --- |
| brad-text-field-prompt-card | opened | Disparado quando o card é aberto. |
| brad-text-field-prompt-card | closed | Disparado quando o card é fechado. |


Nota: Os eventos são disparados no elemento brad-text-field-prompt-card, não no componente principal. Isso permite compatibilidade com frameworks reativos.

# Como usar os eventos
```
const promptComponent = document.getElementById('meu-prompt');
const promptCard = promptComponent.querySelector('brad-text-field-prompt-card');
// Escutar quando o card abre
promptCard.addEventListener('opened', (event) => {
console.log('Card aberto!', event.detail);
});
// Escutar quando o card fecha
promptCard.addEventListener('closed', (event) => {
console.log('Card fechado!', event.detail);
});
```
## Acessibilidade

Para garantir acessibilidade adequada, siga as recomendações abaixo:

# Input:

Adicione aria-label no input com o nome descritivo do campo.
Não use o mesmo texto no placeholder e aria-label para evitar repetição na leitura.
Para campos com erro, adicione aria-invalid="true" e aria-errormessage apontando para a mensagem de erro.

# Prompt Card (auto-gerado):

O card é gerado automaticamente com role="dialog" indicando que é uma janela de diálogo.
Os elementos com data-acessibility não serão lidos enquanto o card estiver aberto.
A div com aria-live="assertive" garante que a mensagem digitada seja anunciada para leitores de tela.

# Ícone BIA:

Use o componente <brad-text-field-prompt-icon> que adiciona automaticamente aria-hidden="true".
Para on-color, use: <brad-text-field-prompt-icon brad-icon="icon-component-chat-bia-oncolor"></brad-text-field-prompt-icon>
Para temas específicos, customize o ícone conforme necessário.

# Helper text:

Use <brad-text-field-prompt-helper-text> para instruções de preenchimento.
Se necessário, use aria-describedby apontando para o helper text.
Exemplos
Default
```
<brad-text-field-prompt
  id="text-field-prompt-3951"
   brad-prompt-message="Falta pouco! A proposta do seu cartão de crédito vence em 2 dias. Que tal concluir agora?" brad-action-link-text="Concluir contratação" brad-action-link-href="#"
>
  <brad-text-field-prompt-input data-acessibility>
    <brad-text-field-prompt-label>
      <input
        aria-label="Campo de texto"
        type="text"
        value=""
        placeholder="Texto de entrada"
        class="brad-font-title-sm"
        
      />

      <brad-text-field-prompt-icon
        brad-icon="icon-component-chat-bia"
      ></brad-text-field-prompt-icon>

      <button
        aria-label="Deletar texto"
        class="delete brad-input-prompt-icon trailing-button-text complements"
      ></button>

      <button
        aria-label="Pesquisar"
        class="search brad-input-prompt-icon trailing-button-text complements"
      ></button>

      <brad-text-field-prompt-helper-text
        >Helper text</brad-text-field-prompt-helper-text
      >
    </brad-text-field-prompt-label>

    <button
      data-acessibility
      class="brad-btn brad-btn-icon btn-prompt"
      aria-label="Usar microfone"
      
    >
      <em class="btn-icon i icon-component-audio-mic"></em>
    </button>
  </brad-text-field-prompt-input>
</brad-text-field-prompt>
```