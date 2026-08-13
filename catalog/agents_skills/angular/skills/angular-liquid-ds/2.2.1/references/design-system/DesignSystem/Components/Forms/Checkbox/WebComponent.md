# Checkbox

É um componente que pode ser apresentado em conjunto ou sozinho e que permite única ou múltipla seleção.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do Web Component

O Checkbox (web component) possui apenas um componente utilitário obrigatório para a utilização do checkbox.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-checkbox | Componente | Sim | Sim | Gera um checkbox único com todas as propriedades e funcionalidades do checkbox nativo, porém com o visual personalizado. |

# Propriedades
## brad-checkbox

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Identificador único. |
| brad-on-color | boolean | false | Define a cor de destaque do checkbox quando selecionado. |
| name | string | undefined | Nome do grupo que pertence o checkbox |
| value | string | undefined | Valor associado ao checkbox, enviado em formulários quando selecionado. |
| checked | boolean | false | Define se o checkbox está selecionado. |
| indeterminate | boolean | false | Define se o checkbox está no modo parcial/indeterminado. |
| disabled | boolean | false | Desabilita o checkbox, impedindo interação do usuário. |

# Uso do HTML
```
<brad-checkbox class="brad-flex-row brad-flex-align-items-start brad-m-sm-b" name="group" value="1">Label 1</brad-checkbox>
```
Comportamento Javascript
## Inicialização

## Inicialização não é necessária (componente nativo)

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| change | brad-checkbox | Disparado quando o checkbox é alterado. |


# Detalhes do evento

## O evento change expõe o estado atual em event.detail:

# detail.checked (boolean)
## detail.indeterminate (boolean)

Observação: ao ativar indeterminate, o componente força checked = true. Ao desativar checked, o componente limpa indeterminate.

## Exemplo de Listener para Eventos
```
const component = document.getElementById("[ID_DO_CHECKBOX]");

component.addEventListener("change", (event) => {
  console.log(event.detail.checked, event.detail.indeterminate);
});
```
## Acessibilidade

O componente já realiza os tratamentos necessários para acessiblidade, basta informar os atributos corretamente.

# Exemplo
```
<form id="myForm">
        <brad-checkbox
          id="checkbox-145-1"
          class="brad-flex-row brad-flex-row brad-flex-align-items-start brad-m-sm-b"
          name="group"
          value="1"
          checked
          
          
        >
          1. Este é um texto fictício usado como preenchimento em projetos de design. Serve para simular o conteúdo de um site ou documento, ajudando a visualizar o layout final. Embora pareça um texto com significado, não possui sentido real.

O objetivo é focar no aspecto visual do projeto, sem distrações causadas por conteúdos definitivos. Continue utilizando este texto sempre que precisar de um exemplo de parágrafo genérico.
        </brad-checkbox>
      
        <brad-checkbox
          id="checkbox-145-2"
          class="brad-flex-row brad-flex-row brad-flex-align-items-start brad-m-sm-b"
          name="group"
          value="2"
          
          
          
        >
          2. Este é um texto fictício usado como preenchimento em projetos de design. Serve para simular o conteúdo de um site ou documento, ajudando a visualizar o layout final. Embora pareça um texto com significado, não possui sentido real.

O objetivo é focar no aspecto visual do projeto, sem distrações causadas por conteúdos definitivos. Continue utilizando este texto sempre que precisar de um exemplo de parágrafo genérico.
        </brad-checkbox>
      
        <brad-checkbox
          id="checkbox-145-3"
          class="brad-flex-row brad-flex-row brad-flex-align-items-start brad-m-sm-b"
          name="group"
          value="3"
          
          
          
        >
          3. Este é um texto fictício usado como preenchimento em projetos de design. Serve para simular o conteúdo de um site ou documento, ajudando a visualizar o layout final. Embora pareça um texto com significado, não possui sentido real.

O objetivo é focar no aspecto visual do projeto, sem distrações causadas por conteúdos definitivos. Continue utilizando este texto sempre que precisar de um exemplo de parágrafo genérico.
        </brad-checkbox>
      
        <brad-checkbox
          id="checkbox-145-4"
          class="brad-flex-row brad-flex-row brad-flex-align-items-start brad-m-sm-b"
          name="group"
          value="4"
          
          
          
        >
          4. Este é um texto fictício usado como preenchimento em projetos de design. Serve para simular o conteúdo de um site ou documento, ajudando a visualizar o layout final. Embora pareça um texto com significado, não possui sentido real.

O objetivo é focar no aspecto visual do projeto, sem distrações causadas por conteúdos definitivos. Continue utilizando este texto sempre que precisar de um exemplo de parágrafo genérico.
        </brad-checkbox>
      </form>
```