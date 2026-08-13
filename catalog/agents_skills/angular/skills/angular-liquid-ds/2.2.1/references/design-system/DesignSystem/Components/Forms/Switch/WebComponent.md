# Switch

Os Switch (Botões de Alternância) são utilizados para permitir que o usuário alterne entre dois estados, como ligado/desligado ou ativo/inativo.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do Web Component

O Switch (web component) possui apenas um componente utilitário obrigatório para a utilização do switch.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-switch | Componente | Sim | Sim | Gera um switch único com todas as propriedades e funcionalidades do switch nativo, porém com o visual personalizado. |

# Propriedades
## brad-switch

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Identificador único. |
| brad-input-id | string | random | Identificador único da tag input. |
| brad-on-color | boolean | false | Define a cor de destaque do switch quando ativado. |
| name | string | undefined | Nome do grupo de switches, permitindo seleção única entre opções com o mesmo nome. |
| value | string | undefined | Valor associado ao switch, enviado em formulários quando ativado. |
| checked | boolean | false | Define se o switch está ativado. |
| disabled | boolean | false | Desabilita o switch, impedindo interação do usuário. |
| brad-align | string | "" | Alinhamento do switch dentro do contêiner, pode ser start, center ou end. Insere as classes de alinhamento do componente. |
| brad-direction | string | "" | Direção do layout do switch, pode ser row ou row-reverse. Insere as classes de direção do componente. |
| brad-justified | boolean | false | Define se o switch deve ocupar todo o espaço disponível, distribuindo igualmente os itens. sso significa que os elementos internos, como o texto e o botão do switch, ficarão posicionados nas extremidades opostas do componente, proporcionando um espaçamento uniforme entre eles. |
| brad-aria-label | string | undefined | Rótulo acessível para o switch, usado por tecnologias assistivas. |

# Uso do HTML
## Exemplo padrão de uso (com classes manuais)

Neste modelo, nenhum atributo especial de alinhamento ou direção é utilizado, e o usuário tem total liberdade para definir manualmente as classes CSS que desejar no componente. Isso garante flexibilidade máxima para personalizar o layout conforme a necessidade do seu projeto, sem depender das opções pré-definidas pelos atributos do componente.

Essa abordagem oferece maior liberdade e flexibilidade, permitindo que o usuário personalize completamente o alinhamento e a disposição dos elementos, utilizando qualquer classe ou estratégia de estilização que preferir. Assim, é possível adaptar o componente a diferentes padrões visuais ou integrações específicas do projeto, sem ficar restrito às opções pré-definidas pelos atributos do componente.

```
<brad-switch
  id=[ID_DO_SWITCH]
  onchange="onChangeCallback(this)"
  checked="false"
  class="brad-switch brad-flex-align-items-start brad-flex-row"
>
  <p class="brad-font-paragraph-sm"> Texto do Switch</p>
</brad-switch>
```
## Exemplo de uso com atributos de layout

Os atributos brad-align, brad-direction e brad-justified são opcionais no componente <brad-switch>. Eles servem para facilitar a aplicação de classes de alinhamento e direção do layout diretamente pelo componente, sem a necessidade de adicionar manualmente classes CSS externas.

brad-align: Permite definir rapidamente o alinhamento do switch dentro do contêiner. Aceita os valores start, center ou end, aplicando automaticamente as classes correspondentes para alinhar o componente conforme desejado.

brad-direction: Controla a direção do layout dos elementos internos do switch. Pode ser row ou row-reverse, facilitando a alteração da ordem dos elementos sem precisar editar o CSS manualmente.

O uso desses atributos não é obrigatório, mas torna a personalização do layout mais simples, permitindo ajustes rápidos diretamente no HTML do componente.

```
<brad-switch
  id="[ID_DO_SWITCH]"
  onchange="onChangeCallback(this)"
  checked="false"
  brad-align="center"
  brad-direction="row-reverse"
  brad-justified="true"
>
  <p class="brad-font-paragraph-sm">Switch com várias propriedades</p>
</brad-switch>
```
Comportamento Javascript
## Inicialização

# Inicialização não é necessária

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| change | brad-switch | Disparado quando o estado do switch é alterado. |

# Acessibilidade

O componente switch do Design System Liquid foi desenvolvido usando HTML semântico, assegurando a interpretação correta do leitor de tela e permitindo a navegação com o teclado, além da navegação com swipe nos dispositivos móveis.

O Switch deve ser acessível por teclado e leitores de tela. Utilize o atributo brad-aria-label para fornecer um rótulo descritivo.

Se o atributo brad-aria-label não for informado, o componente <brad-switch> irá criar automaticamente um atributo aria-labelledby que referencia o conteúdo inserido dentro do componente. Assim, o texto ou elementos presentes dentro do switch serão utilizados como rótulo acessível, garantindo que leitores de tela possam identificar corretamente o propósito do componente, mesmo sem um rótulo explícito definido pelo desenvolvedor.

# Exemplos

Obs: Use o botão show code abaixo do exemplo para ver o HTML.

# Switch
```
<brad-switch
  id=switch-225
  onchange="window.onChangeCallback(this)"
  brad-on-color="false"
  class="brad-switch brad-flex-align-items-start brad-flex-row brad-flex-justify-content-between"
>
  <p class="brad-font-paragraph-sm">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</p>
</brad-switch>
```
## Switch com atributos que modificam o layout

Exemplo de uso do switch com os atributos brad-align e brad-direction para modificar o layout do componente.

```
<brad-switch
  id=switch-26
  name=switch-75
  
  brad-on-color="false"
  onchange="window.onChangeCallback(this)"
  brad-align="start"
  brad-direction="row"
  brad-justified="false"
  brad-aria-label="Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source."
  
>
  <p class="brad-font-paragraph-sm">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</p>
</brad-switch>
```