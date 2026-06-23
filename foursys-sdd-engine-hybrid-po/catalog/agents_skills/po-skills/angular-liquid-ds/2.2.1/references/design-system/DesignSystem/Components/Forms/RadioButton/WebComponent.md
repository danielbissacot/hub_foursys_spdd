# RadioButton

É um componente que permite a seleção de um único item em uma lista.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do Web Component

O RadioButton (web component) possui apenas um componente utilitário obrigatório para a utilização do radio button.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-radio | Componente | Sim | Sim | Gera um radio único com todas as propriedades e funcionalidades do radio nativo, porém com o visual personalizado. |

# Propriedades
## brad-radio

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Identificador único. |
| brad-on-color | boolean | false | Define a cor de destaque do radio quando selecionado. |
| name | string | undefined | Nome do grupo de radios, permitindo seleção única entre opções com o mesmo nome. |
| value | string | undefined | Valor associado ao radio, enviado em formulários quando selecionado. |
| checked | boolean | false | Define se o radio está selecionado. |
| disabled | boolean | false | Desabilita o radio, impedindo interação do usuário. |

# Uso do HTML
```
<brad-radio class="brad-flex-row brad-flex-row brad-flex-align-items-start brad-m-sm-b" name="group" value="1">Label 1</brad-radio>
<brad-radio class="brad-flex-row brad-flex-row brad-flex-align-items-start brad-m-sm-b" name="group" value="2">Label 2</brad-radio>
<brad-radio class="brad-flex-row brad-flex-row brad-flex-align-items-start brad-m-sm-b" name="group" value="3">Label 3</brad-radio>
```
Comportamento Javascript
## Inicialização

# Inicialização não é necessária

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| change | brad-radio | Evento disparado quando o valor do radio é alterado. |

# Acessibilidade

O componente radio-button do Design System Liquid foi desenvolvido usando HTML semântico, assegurando a interpretação correta do leitor de tela e permitindo a navegação com o teclado, além da navegação com swipe nos dispositivos móveis.

Certifique-se de adicionar a tag name em cada custom element brad-radio-button com um valor idêntico para todos os brad-radio-button dentro do mesmo grupo. Isso permite que os radio-buttons sejam associados corretamente, facilitando a comunicação com leitores de tela e outras tecnologias assistivas.

# Exemplos
Default
```
<form id="myForm">
    <brad-radio
      id="radio-66-1"
      class="brad-flex-row brad-flex-row brad-flex-align-items-start brad-m-sm-b"
      name="group"
      value="1"
      checked
      
      
    >1. Este é um texto fictício usado como preenchimento em projetos de design. Serve para simular o conteúdo de um site ou documento, ajudando a visualizar o layout final. Embora pareça um texto com significado, não possui sentido real.

O objetivo é focar no aspecto visual do projeto, sem distrações causadas por conteúdos definitivos. Continue utilizando este texto sempre que precisar de um exemplo de parágrafo genérico.
    </brad-radio>
  
    <brad-radio
      id="radio-66-2"
      class="brad-flex-row brad-flex-row brad-flex-align-items-start brad-m-sm-b"
      name="group"
      value="2"
      
      
      
    >2. Este é um texto fictício usado como preenchimento em projetos de design. Serve para simular o conteúdo de um site ou documento, ajudando a visualizar o layout final. Embora pareça um texto com significado, não possui sentido real.

O objetivo é focar no aspecto visual do projeto, sem distrações causadas por conteúdos definitivos. Continue utilizando este texto sempre que precisar de um exemplo de parágrafo genérico.
    </brad-radio>
  
    <brad-radio
      id="radio-66-3"
      class="brad-flex-row brad-flex-row brad-flex-align-items-start brad-m-sm-b"
      name="group"
      value="3"
      
      
      
    >3. Este é um texto fictício usado como preenchimento em projetos de design. Serve para simular o conteúdo de um site ou documento, ajudando a visualizar o layout final. Embora pareça um texto com significado, não possui sentido real.

O objetivo é focar no aspecto visual do projeto, sem distrações causadas por conteúdos definitivos. Continue utilizando este texto sempre que precisar de um exemplo de parágrafo genérico.
    </brad-radio>
  
    <brad-radio
      id="radio-66-4"
      class="brad-flex-row brad-flex-row brad-flex-align-items-start brad-m-sm-b"
      name="group"
      value="4"
      
      
      
    >4. Este é um texto fictício usado como preenchimento em projetos de design. Serve para simular o conteúdo de um site ou documento, ajudando a visualizar o layout final. Embora pareça um texto com significado, não possui sentido real.

O objetivo é focar no aspecto visual do projeto, sem distrações causadas por conteúdos definitivos. Continue utilizando este texto sempre que precisar de um exemplo de parágrafo genérico.
    </brad-radio>
  </form>
```