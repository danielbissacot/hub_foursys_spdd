# SideSheet

Superfície fixada na parte lateral da tela que sobrepoõe todos os demais elementos da tela, com exceção do header, Pode disponibilizar ao usuário ações ou informações complementares ao contexto atual.

O SideSheet permanece estático na tela enquanto o usuário pode iteragir com outros elementos que podem vir em sua interface. Seu uso complementa o conteúdo da tela principal e agrupa informações ou ações de maneira sempre acessível. O componente Side Sheet ocupa o máximo de 80% de preenchimento da tela, ajustando de acordo com o tamanho de seu conteúdo.

# Uso do Web Component

O Side Sheet web component possui vários componentes utilitários que ajudam a construir vários casos de uso.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-ss | Componente | Sim | Sim | Agrupa todos os outros componentes do side-sheet |
| brad-ss-close | Sub-componente | Não | Sim | Botão de fechar do side-sheet. |
| brad-ss-content | Sub-componente | Sim | Sim | Conteúdo do side-sheet. |

# Propriedades
## brad-ss

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string |  | Id necessário para o funcionamento |
| brad-from | "left", "right" | "left" | Indica a direção que o Side-Sheet irá se posicionar |
| brad-close-gesture | boolean | true | Determina se é possível fechar o side-sheet ao arrastar a tela |

# Comportamento Javascript

## Para instanciar o service do WebComponent é simples:

```
const sideSheet = document.getElementById(ID_DO_SIDE_SHEET);
const service = sideSheet.service
```

A partir disso, todos os métodos que existem no HTML também estarão disponíveis no WebComponent

# Métodos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| bsIsOpen | brad-ss | Indica se o side-sheet está aberto ou fechado. |
| open | brad-ss | Abre o side-sheet. |
| close | brad-ss | Fecha o side-sheet. |
| toggle | brad-ss | Alterna o estado do side-sheet. |
| destroy | brad-ss | Destrói o side-sheet. |

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| "open" | brad-ss | Evento disparado ao abrir o side-sheet |
| "close" | brad-ss | Evento disparado ao fechar o side-sheet. |

# Observações
Atributos
Ao clicar em qualquer elemento que tenha o atributodata-ss-open com o id do SideSheet respectivo, ele será aberto;
Ao clicar em qualquer elemento que tenha o atributodata-ss-close com o id do SideSheet respectivo, ele será fechado.
## Comportamento

É possível fechar o SideSheet (mobile) ao arrasta-lo da direita para esquerda.

# Acessibilidade

Caso opte por não utilizar o sub-componente brad-ss-close, certifique-se de adicionar um button com o atributo aria-label='Fechar SideSheet'. Em seguida, adicione também um atributo data-ss-close='id-do-sidesheet' para que ele consiga fechar o sidesheet. Adicione também um atributo class='i icon-component-close-delete' para que apareça um botão de fechar.

Certifique-se de adicionar um parágrafo <p></p> com id=id-sidesheet-result e aria-live=polite, que serve para o leitor de tela ler esse elemento sempre que ele for alterado. Adicione também um atributo style="opacity: 0; position: absolute" para que esse parágrafo não apareça nem ocupe espaço na DOM.

Monitore um evento do serviço chamado open, que dispara sempre que ele abre o sidesheet, e adicione ao parágrafo o conteúdo de 'sidesheet aberto'. Monitore também do serviço um evento chamado close, que dispara sempre que o sidesheet é fechado, e no callback deste ouvinte, atualize o conteúdo do parágrafo para 'sidesheet fechado'.

As tags padrões são inseridas automaticamente pelo script do web component.

# brad-ss-content

| tag | value | Descrição |
| --- | --- | --- |
| tabindex | 0 | Torna esse elemento focável |

```
<button
  aria-label="Abrir SideSheet"
  data-ss-open="ss-id"
  class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
>
  <em class="fab-icon i icon-ui-placeholder"></em>
</button>

<p
  id="id-sidesheet-result"
  aria-live="polite"
  style="opacity: 0; position: absolute;"
></p>

<brad-ss id="ss-id" brad-from="left">
  <brad-ss-close aria-label="Fechar SideSheet"></brad-ss-close>
  <brad-ss-content> Conteúdo </brad-ss-content>
</brad-ss>
```

Exemplo de monitoramento dos eventos "open" e "close".

```
setTimeout(() => {
  const sideSheet = document.getElementById(ID_DO_SIDE_SHEET);

  sideSheet.addEventListener("open", () => {
    const eParagraphResult = document.getElementById("id-sidesheet-result");

    if (eParagraphResult) {
      eParagraphResult.textContent = "";
      eParagraphResult.textContent = "SideSheet aberto.";
    }
  });

  sideSheet.addEventListener("close", () => {
    const eParagraphResult = document.getElementById("id-sidesheet-result");

    if (eParagraphResult) {
      eParagraphResult.textContent = "";
      eParagraphResult.textContent = "SideSheet fechado.";
    }
  });

}, 400);
```
## Exemplos

Para o uso do side-sheet é importante seguir a logica de implementação do código, inserir todas as tags obrigatorias na ordem conforme o exemplo.

```
<button
  aria-label="Abrir SideSheet"
  data-ss-open="ss-71"
  class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
>
  <em class="fab-icon i icon-ui-placeholder"></em>
</button>

<p
  id="id-sidesheet-result"
  aria-live="polite"
  style="opacity: 0; position: absolute;"
></p>

<brad-ss
  id="ss-71"
  brad-from=left
  brad-close-gesture=true
>
<brad-ss-close aria-label="Fechar SideSheet"></brad-ss-close>
<brad-ss-content class="brad-m-md-t"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel feugiat ex. Aliquam erat volutpat.
  Pellentesque iaculis quis nisi sed volutpat. Pellentesque pretium sit amet risus id ullamcorper. Nulla finibus a nisl nec sagittis.
  Integer venenatis iaculis ipsum, vitae lobortis diam suscipit ut. Pellentesque ut purus non erat porttitor cursus a a enim. Cras nec mauris nisl.
  Nam commodo eros sit amet viverra vulputate. Nunc rhoncus imperdiet elit quis lobortis. Curabitur rhoncus scelerisque semper.
  Vivamus et porta nulla, at viverra tortor. Sed condimentum, magna in dictum volutpat, sapien nisi varius lectus, vitae vestibulum leo sem eget purus.
  Nunc lorem libero, vulputate eget finibus vitae, dictum eget nulla. Nullam turpis dolor, imperdiet eget arcu vitae, pretium tempus urna.
  Curabitur sit amet lacus ut eros iaculis condimentum sit amet a diam. Cras bibendum nulla quis urna dictum tincidunt.
  Sed semper sapien in tellus feugiat sodales. Sed ullamcorper tempus ex, pellentesque dictum justo semper ac. Donec scelerisque velit sit amet mi pharetra lobortis.
  Mauris dictum mauris id ipsum iaculis blandit. Nulla id faucibus massa. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
  Donec sit amet purus sit amet augue iaculis varius. Nam in iaculis mauris. Phasellus sodales egestas velit nec hendrerit. Vivamus quis congue magna, nec dictum quam.
  Aliquam eget ornare nibh. Vivamus aliquam accumsan felis. Praesent et risus efficitur, blandit turpis eget, rhoncus sapien. Suspendisse sodales tincidunt massa, eu rhoncus purus venenatis nec.
  Integer venenatis facilisis tellus, a bibendum tortor. Proin tincidunt nunc vel massa hendrerit consectetur. Aliquam lacinia fringilla imperdiet. Donec non velit orci.
  Morbi blandit tempus consequat. Sed libero justo, molestie vitae imperdiet ut, feugiat eu metus. Quisque commodo tincidunt dignissim. Duis laoreet scelerisque pretium. Sed congue blandit porttitor.
  Donec porta tellus volutpat massa interdum, quis bibendum lorem faucibus. Nunc est elit, blandit at pellentesque in, sagittis non massa.
  Donec sapien ipsum, sollicitudin vel cursus sed, blandit vel quam. In sit amet cursus lorem. Pellentesque eget ex id est tincidunt ultrices sed sed elit.
  Ut in est quis nunc porta venenatis. Proin in sapien lobortis elit cursus vehicula. Quisque ut lorem pellentesque, aliquam nulla fermentum, sollicitudin nisi.
  Donec tempor enim ipsum, quis scelerisque leo dignissim in. Aenean purus tellus, pellentesque vitae erat at, volutpat porta neque. </brad-ss-content>
</brad-ss>
```