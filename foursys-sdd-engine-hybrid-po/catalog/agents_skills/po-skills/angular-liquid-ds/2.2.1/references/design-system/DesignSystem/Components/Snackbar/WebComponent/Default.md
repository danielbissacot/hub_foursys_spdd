# Snackbar

O Snackbar é um componente flutuante e interativo, que fornece um feedback breve que informa ou solicita ação ao usúario.

# Uso do Web Component

O Snackbar (web component) possui dois componentes utilitários obrigatórios para a utilização.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-snackbar | Componente | Sim | Sim | Agrupa todos os outros componentes do dropdown. |
| brad-snackbar-icon | Sub-componente | Não | Não | ícone (opcional) se o tipo não for default, o ícone será automático, caso incluído. |
| brad-snackbar-x | Sub-componente | Não | Não | Botão (x) para fechar componente. |
| brad-snackbar-content | Sub-componente | Sim | Sim | Conteúdo interno do dropdown quando ele estiver aberto. |

# Propriedades
## brad-snackbar

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | random(uid) | Obrigatório para funcionamento. Caso não seja informado, um valor aleatório será gerado automaticamente. |
| brad-type | "default", "info", "success", "warning", "error" | "default" | Define o estilo visual que o componente irá adotar. |
| brad-vertical-position | "top", "bottom" | "bottom" | Configura a posição vertical que o componente vai abrir. |
| brad-align | "left", "center", "right" | "right" | Configura a posição horizontal que o componente vai abrir. |
| brad-ttl | number | 0 | Configura o tempo de vida (TTL) do componente, determinando após quanto tempo ele será fechado automaticamente após a abertura. Caso seja <= 0, ele não fechará automaticamente |

# Comportamento Javascript
## Inicialização

Inicialização não é necessária.

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| open | N/A | Abre o componente. |
| close | N/A | Fecha o componente. |
| toggle | N/A | Alterna entre abrir e fechar o componente. |

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| closed | brad-snackbar | Evento disparado ao fechar snackbar. |
| opened | brad-snackbar | Evento disparado ao abrir snackbar. |

# Acessibilidade

Para garantir que o snackbar seja acessível para usuários de leitores de tela e navegação por teclado, é necessário adicionar os atributos ARIA nos eventos de abertura e fechamento:

# Ao abrir o snackbar:

aria-live="assertive" - Anuncia imediatamente para leitores de tela
role="alert" - Identifica como alerta
aria-atomic="true" - Lê o conteúdo completo
tabindex="0" - Permite foco via teclado
## .focus() - Move foco para o snackbar

# Ao fechar o snackbar:

## Remove atributos ARIA temporários
tabindex="-1" - Remove da ordem de tabulação
Retorna foco para o elemento que acionou
Implementação
1. Selecionar os elementos
```
const component = document.querySelector("#snackbar");
const trigger = document.querySelector("[data-sb-open='snackbar']");
```
2. Criar funções de acessibilidade
Função para configurar ao abrir
```
function setupAccessibilityOnOpen(snackbar) {
snackbar.setAttribute("aria-live", "assertive");
snackbar.setAttribute("role", "alert");
snackbar.setAttribute("aria-atomic", "true");
snackbar.setAttribute("tabindex", "0");
snackbar.focus();
}
```
Função para configurar ao fechar
```
function setupAccessibilityOnClose(snackbar, originElement) {
snackbar.removeAttribute("aria-live");
snackbar.removeAttribute("role");
snackbar.removeAttribute("aria-atomic");
snackbar.setAttribute("tabindex", "-1");
originElement?.focus();
}
```
3. Adicionar event listeners
Listener ao abrir
```
component.addEventListener("opened", () => {
setupAccessibilityOnOpen(component);
});
```
Listener ao fechar
```
component.addEventListener("closed", () => {
setupAccessibilityOnClose(component, trigger);
});
```
Exemplos
Default
```
<button
  data-sb-open="snackbar-376"
  class="brad-btn brad-btn-fab-icon brad-btn-floating brad-btn-fab-icon--not-active"
  aria-label="Abrir snackbar"
>
  <em class="fab-icon i icon-ui-placeholder"></em>
</button>

<brad-snackbar
  id="snackbar-376"
  brad-type="default"
  brad-vertical-position="bottom"
  brad-align="right"
  brad-ttl="0"
>
  <brad-snackbar-icon class='icon-ui-placeholder brad-text-color-neutral-0'></brad-snackbar-icon>
  <brad-snackbar-x aria-label="Fechar snackbar"></brad-snackbar-x>
  <brad-snackbar-content>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</brad-snackbar-content>
</brad-snackbar>
```