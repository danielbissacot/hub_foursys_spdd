# Tabs

Componente que controla a navegação entre diferentes seções de conteúdo da plataforma.

# Pré-requisitos
Certifique-se de que o elemento HTML pai do componente esteja totalmente carregado antes da inicialização.
Como o serviço utiliza targetSelector, garanta que o componente esteja renderizado e carregado antes de instanciar.
O correto funcionamento depende da presença completa da estrutura HTML das tabs no DOM.
Uso do HTML
```
<div id="tabs" class="brad-tab brad-tab--indicator-bottom">
<div role="tablist" aria-labelledby="tablist-1">
  <button
    id="tab-1"
    type="button"
    role="tab"
    aria-selected="true"
    aria-controls="tabpanel-1"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-navigation-home"></em> Title
      1</span
    >
  </button>

  <button
    id="tab-2"
    type="button"
    role="tab"
    aria-selected="false"
    aria-controls="tabpanel-2"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-navigation-home"></em> Title
      2</span
    >
  </button>

</div>

<div
id="tabpanel-1"
role="tabpanel"
aria-labelledby="tab-1"
class="brad-tab__content brad-p-xxl"
>
<h2>Conteúdo da TAB 1 aqui 😊</h2>
</div>

<div
  id="tabpanel-2"
  role="tabpanel"
  aria-labelledby="tab-2"
  class="brad-tab__content brad-p-xxl brad-tabs__is-hidden--js"
>
  <h2>Conteúdo da TAB 2 aqui 😊</h2>
</div>
</div>
```
Comportamento Javascript
Inicialização
```
const id = "#tabs";
const options = { targetSelector: id };
const service = LiquidCorp.BradTabsService.getInstance(options);
```
## Options

| Attrs/(element) | Funcionalidades |
| --- | --- |
| tablist/(div) | Isso é definido como atributo de função no elemento Tab que descreve a função real do elemento |
| tabpanel/(div) | Isso é definido como atributo de função para o conteúdo da guia que descreve a função para visualizar o conteúdo ativo. |
| aria-selected/(button) | Indica o estado de seleção dos itens da guia. Active Tab é definido como verdadeiro para este atributo. |
| aria-hidden | Indica o elemento oculto da Tab. |
| aria-controls/(button) | Indica o Tabpanel associado ao cabeçalho. |
| aria-labelledby/(div) | Indica o cabeçalho da guia associado ao conteúdo. |

# Metódos

| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| setSelectedTab | currentTab | Define programaticamente qual tab deve estar ativa. Recebe o elemento DOM da tab como parâmetro |
| selectTabById | tabId | Seleciona uma tab específica pelo seu ID. Retorna true se a tab foi encontrada e selecionada, false caso contrário |
| setTabDisabled | tabId, disabled | Habilita ou desabilita uma tab específica. Recebe o ID da tab e um boolean (true para desabilitar, false para habilitar) |

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| changes | .brad-tab | Evento disparado ao alterar as tabs atuais |

## Exemplos do uso de eventos na jornada
```
const id = "#tabs";
const options = { targetSelector: id };
const service = LiquidCorp.BradTabsService.getInstance(options);

// Escutando mudanças de tabs
service.eTabContainer.addEventListener("changes", ({ detail }) => {
console.log('Tab ativa:', detail.currentTab.id);
});

// Selecionando uma tab por ID
const sucesso = service.selectTabById('tab-2');
console.log('Tab selecionada:', sucesso);

// Desabilitando/habilitando uma tab
service.setTabDisabled('tab-3', true); // Desabilita a tab-3
service.setTabDisabled('tab-3', false); // Habilita a tab-3

// Selecionando uma tab diretamente pelo elemento DOM
const tabElement = document.getElementById('tab-1');
service.setSelectedTab(tabElement);
```
Container e tabs
Active indicator: O indicador de aba ativa fica acima de todos os outros elementos e indica qual aba está selecionada, sua largura é determinada pela aba ativa atual.
Divisory line: Alinha da divisória fica acima das tabs e dentro do container e tem a função de separar visualmente a aba do conteúdo que vem abaixo e determina a área que ela ocupa. Tab Content: É o conteúdo da aba, que pode ser composto por uma combinação de ícone e texto.
Tab Container: É o container de conteúdo da tab e seu tamanho é determinado pelo conteúdo + padding, na maioria dos estados o container e transparente com excessão do estado HOVERED.
Container: O container é a área que abriga as tabs, sua altura se adapta ao conteúdo e a largura definida manualmente.
Exemplo: Largura de 100% da resolução da tela.
## Interação

A área de toque de cada aba é toda área do container de seu conteúdo. O componente deve sempre iniciar com a primeira aba à esquerda selecionada, com expressões determinadas pela regra de negócio especifica do projeto. Abas podem aparecer com status DISABLED e inacessíveis ao usuário. Isso pode ocorrer pela falta de conteúdo, falta de permissão de acesso ou falta de requisitos preenchidos para habilitar a seleção da aba.

# Acessibilidade

Para o uso da acessibilidade adicione a role="tablist" na div filho da principal (.brad-tab). A acessibilidade do conteúdo da tab deve ser feita de acordo com as regras de acessibilidade do mesmo.

Pode adicionar aria-labelledby="ID_REFERENCE" na mesma divque contém o role="tablist" para descrever a finalidade do conjuntos de tabs.

Utilize a tag <button> para as funções de tab e adicione role="tab". Todos os elementos tab que estiverem aria-selected="false", esses elementos são acessíveis pelas setas do teclado e tem seu foco ativado apertando a tecla enter.

No conteúdo da tab colocaremos role="tabpanel" para indicar que é o conteúdo das guias, deve ser inserido também a aria-labelledby="ID_TAB" que referencia a guia desse conteúdo. Para que o conteúdo seja acessível via tecla tab é inserido tabindex="0", conteúdos escondidos recebem a classe brad-tabs__is-hidden--js e não são acessíveis se a sua guia não estiver com foco.

```
<div id="tabs-example" class="brad-tab brad-tab--indicator-bottom">
<h3 id="tablist-1">Finalidade das Tabs</h3>
<div role="tablist" aria-labelledby="tablist-1">
  <button
    id="tab-1"
    type="button"
    role="tab"
    aria-selected="true"
    aria-controls="tabpanel-1"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-navigation-home"></em> Title
      1</span
    >
  </button>

  <button
    id="tab-2"
    type="button"
    role="tab"
    aria-selected="false"
    aria-controls="tabpanel-2"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-navigation-home"></em> Title
      2</span
    >
  </button>

</div>

<div
id="tabpanel-1"
role="tabpanel"
aria-labelledby="tab-1"
class="brad-tab__content brad-p-xxl"
tabindex="0"
>
<h4>Conteúdo da TAB 1 aqui 😊</h4>
</div>

<div
  id="tabpanel-2"
  role="tabpanel"
  aria-labelledby="tab-2"
  class="brad-tab__content brad-p-xxl brad-tabs__is-hidden--js"
  tabindex="0"
>
  <h4>Conteúdo da TAB 2 aqui 😊</h4>
</div>
</div>
```
Observações
## Scroll no conteúdo

Caso você queira adicionar scroll no conteúdo será necessário adicionar uma altura máxima nos elementos com a classe brad-tab__content, e uma altura fixa no filho direto dele, no nosso exemplo é o <h2>Conteúdo da TAB [número] aqui 😊</h2>.

# Indicator em baixo

Quando utilizasse a classe brad-tab junto ao brad-tab--indicator-bottom que determinará o indicator em baixo, recomenda-se que altere a sequência do HTML conforme o exemplo IndicatorBottom.

# Indicator no topo

Quando utilizasse a classe brad-tab junto ao brad-tab--indicator-top que determinará o indicator no topo, recomenda-se que altere a sequência do HTML conforme o exemplo IndicatorTop.

## Controle personalizado sem tabpanel

Em cenários avançados onde você precisa de controle total sobre o comportamento das tabs e não deseja usar os elementos tabpanel tradicionais, é possível implementar o comportamento personalizado usando apenas o evento changes do serviço.

# Implementação:
```
<div id="custom-tabs" class="brad-tab brad-tab--indicator-bottom">
<div class="brad-scrollbar" role="tablist">
  <button id="custom-tab-1" type="button" role="tab" aria-selected="true">
    <span class="brad-tab__focus--js">Tab 1</span>
  </button>
  <button id="custom-tab-2" type="button" role="tab" aria-selected="false">
    <span class="brad-tab__focus--js">Tab 2</span>
  </button>
  <button id="custom-tab-3" type="button" role="tab" aria-selected="false">
    <span class="brad-tab__focus--js">Tab 3</span>
  </button>
</div>

<div id="dynamic-content" class="brad-tab__content brad-p-xxl">
  <div>Conteúdo inicial</div>
</div>
</div>
```
```
const service = LiquidCorp.BradTabsService.getInstance({
    targetSelector: '#custom-tabs'
});

// Controle personalizado via evento changes
document.getElementById('custom-tabs').addEventListener('changes', (event) => {
const currentTabId = event.detail.currentTab.id;
const contentArea = document.getElementById('dynamic-content');

// Implementar lógica personalizada
switch (currentTabId) {
case 'custom-tab-1':
contentArea.innerHTML = '<div>Conteúdo da Tab 1</div>';
break;
case 'custom-tab-2':
contentArea.innerHTML = '<div>Conteúdo da Tab 2</div>';
break;
case 'custom-tab-3':
contentArea.innerHTML = '<div>Conteúdo da Tab 3</div>';
break;
}

contentArea.scrollTop = 0;
});
```
Exemplos
Inidicador em baixo
```
<div id="tabs-358" class="brad-tab brad-tab--indicator-bottom">
    <div
  class="brad-scrollbar"
  role="tablist"
  aria-labelledby="tablist-1"
>
  <button
    id="tab-1"
    type="button"
    role="tab"
    aria-selected="true"
    aria-controls="tabpanel-1"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-ui-placeholder"></em> Title
      1</span
    >
  </button>

  <button
    id="tab-2"
    type="button"
    role="tab"
    aria-selected="false"
    aria-controls="tabpanel-2"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-ui-placeholder"></em> Title
      2</span
    >
  </button>

  <button
    id="tab-3"
    type="button"
    role="tab"
    aria-selected="false"
    aria-controls="tabpanel-3"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-ui-placeholder"></em> Title
      3</span
    >
  </button>

  <button
    id="tab-4"
    type="button"
    role="tab"
    aria-selected="false"
    aria-controls="tabpanel-4"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-ui-placeholder"></em> Title
      4</span
    >
  </button>

  <button
    id="tab-5"
    type="button"
    role="tab"
    aria-selected="false"
    aria-controls="tabpanel-5"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-ui-placeholder"></em> Title
      5</span
    >
  </button>
</div>

    <div
      id="tabpanel-1"
      role="tabpanel"
      aria-labelledby="tab-1"
      class="brad-tab__content brad-p-xxl"
      style="max-height: 200px;"
    >
      <h2 style="min-height: 600px;">Conteúdo da TAB 1 aqui 😊</h2>
    </div>

    <div
      id="tabpanel-2"
      role="tabpanel"
      aria-labelledby="tab-2"
      class="brad-tab__content brad-p-xxl brad-tabs__is-hidden--js"
      style="max-height: 200px;"
    >
      <h2 style="min-height: 600px;">Conteúdo da TAB 2 aqui 😊</h2>
    </div>

    <div
      id="tabpanel-3"
      role="tabpanel"
      aria-labelledby="tab-3"
      class="brad-tab__content brad-p-xxl brad-tabs__is-hidden--js"
      style="max-height: 200px;"
    >
      <h2 style="min-height: 600px;">Conteúdo da TAB 3 aqui 😊</h2>
    </div>

    <div
      id="tabpanel-4"
      role="tabpanel"
      aria-labelledby="tab-4"
      class="brad-tab__content brad-p-xxl brad-tabs__is-hidden--js"
      style="max-height: 200px;"
    >
      <h2 style="min-height: 600px;">Conteúdo da TAB 4 aqui 😊</h2>
    </div>

    <div
      id="tabpanel-5"
      role="tabpanel"
      aria-labelledby="tab-5"
      class="brad-tab__content brad-p-xxl brad-tabs__is-hidden--js"
      style="max-height: 200px;"
    >
      <h2 style="min-height: 600px;">Conteúdo da TAB 5 aqui 😊</h2>
    </div>
  </div>
```
Indicador no topo
```
<div id="tabs-103" class="brad-tab brad-tab--indicator-top">
    <div
      id="tabpanel-1"
      role="tabpanel"
      aria-labelledby="tab-1"
      class="brad-tab__content brad-p-xxl"
      style="max-height: 200px;"
    >
      <h2 style="min-height: 600px;">Conteúdo da TAB 1 aqui 😊</h2>
    </div>

    <div
      id="tabpanel-2"
      role="tabpanel"
      aria-labelledby="tab-2"
      class="brad-tab__content brad-p-xxl brad-tabs__is-hidden--js"
      style="max-height: 200px;"
    >
      <h2 style="min-height: 600px;">Conteúdo da TAB 2 aqui 😊</h2>
    </div>

    <div
      id="tabpanel-3"
      role="tabpanel"
      aria-labelledby="tab-3"
      class="brad-tab__content brad-p-xxl brad-tabs__is-hidden--js"
      style="max-height: 200px;"
    >
      <h2 style="min-height: 600px;">Conteúdo da TAB 3 aqui 😊</h2>
    </div>

    <div
      id="tabpanel-4"
      role="tabpanel"
      aria-labelledby="tab-4"
      class="brad-tab__content brad-p-xxl brad-tabs__is-hidden--js"
      style="max-height: 200px;"
    >
      <h2 style="min-height: 600px;">Conteúdo da TAB 4 aqui 😊</h2>
    </div>

    <div
      id="tabpanel-5"
      role="tabpanel"
      aria-labelledby="tab-5"
      class="brad-tab__content brad-p-xxl brad-tabs__is-hidden--js"
      style="max-height: 200px;"
    >
      <h2 style="min-height: 600px;">Conteúdo da TAB 5 aqui 😊</h2>
    </div>

    <div
  class="brad-scrollbar"
  role="tablist"
  aria-labelledby="tablist-1"
>
  <button
    id="tab-1"
    type="button"
    role="tab"
    aria-selected="true"
    aria-controls="tabpanel-1"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-ui-placeholder"></em> Title
      1</span
    >
  </button>

  <button
    id="tab-2"
    type="button"
    role="tab"
    aria-selected="false"
    aria-controls="tabpanel-2"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-ui-placeholder"></em> Title
      2</span
    >
  </button>

  <button
    id="tab-3"
    type="button"
    role="tab"
    aria-selected="false"
    aria-controls="tabpanel-3"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-ui-placeholder"></em> Title
      3</span
    >
  </button>

  <button
    id="tab-4"
    type="button"
    role="tab"
    aria-selected="false"
    aria-controls="tabpanel-4"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-ui-placeholder"></em> Title
      4</span
    >
  </button>

  <button
    id="tab-5"
    type="button"
    role="tab"
    aria-selected="false"
    aria-controls="tabpanel-5"
  >
    <span class="brad-tab__focus--js"
      ><em class="brad-tab__btn-icon i icon-ui-placeholder"></em> Title
      5</span
    >
  </button>
</div>
  </div>
```
Aninhamento
```
<div id="parent-tabs-156" class="brad-tab brad-tab--indicator-bottom ">
  
  <div
    class="brad-scrollbar"
    role="tablist"
    aria-labelledby="tablist-parent"
  >
    <button
      id="parent-tab-1"
      type="button"
      role="tab"
      aria-selected="true"
      aria-controls="parent-panel-1"
    >
      <span class="brad-tab__focus--js">
        <em class="brad-tab__btn-icon i icon-account-person"></em>
        Conta
      </span>
    </button>

    <button
      id="parent-tab-2"
      type="button"
      role="tab"
      aria-selected="false"
      aria-controls="parent-panel-2"
    >
      <span class="brad-tab__focus--js">
        <em class="brad-tab__btn-icon i icon-financial-money"></em>
        Produtos
      </span>
    </button>

    <button
      id="parent-tab-3"
      type="button"
      role="tab"
      aria-selected="false"
      aria-controls="parent-panel-3"
    >
      <span class="brad-tab__focus--js">
        <em class="brad-tab__btn-icon i icon-ui-menu-settings"></em>
        Configurações
      </span>
    </button>
  </div>
 
  <div
    id="parent-panel-1"
    role="tabpanel"
    aria-labelledby="parent-tab-1"
    class="brad-tab__content brad-p-xxl"
  >
    <h3 class="brad-mb-lg">Informações da Conta</h3>

    <div id="child-tabs-1-382" class="brad-tab brad-tab--indicator-bottom">
      
  <div
    class="brad-scrollbar"
    role="tablist"
    aria-labelledby="tablist-account"
  >
    <button
      id="account-tab-1"
      type="button"
      role="tab"
      aria-selected="true"
      aria-controls="account-panel-1"
    >
      <span class="brad-tab__focus--js">
        <em class="brad-tab__btn-icon i icon-account-details"></em>
        Dados Pessoais
      </span>
    </button>

    <button
      id="account-tab-2"
      type="button"
      role="tab"
      aria-selected="false"
      aria-controls="account-panel-2"
    >
      <span class="brad-tab__focus--js">
        <em class="brad-tab__btn-icon i icon-navigation-pin"></em>
        Endereço
      </span>
    </button>

    <button
      id="account-tab-3"
      type="button"
      role="tab"
      aria-selected="false"
      aria-controls="account-panel-3"
    >
      <span class="brad-tab__focus--js">
        <em class="brad-tab__btn-icon i icon-ui-security"></em>
        Segurança
      </span>
    </button>
  </div>
 
  <div
    id="account-panel-1"
    role="tabpanel"
    aria-labelledby="account-tab-1"
    class="brad-tab__content brad-p-lg"
  >
    <h4>Dados Pessoais</h4>
    <p>Nome: João da Silva</p>
    <p>CPF: 123.456.789-00</p>
    <p>Email: joao.silva@exemplo.com</p>
    <p>Telefone: (11) 98765-4321</p>
  </div>

      
  <div
    id="account-panel-2"
    role="tabpanel"
    aria-labelledby="account-tab-2"
    class="brad-tab__content brad-p-lg brad-tabs__is-hidden--js"
  >
    <h4>Endereço</h4>
    <p>Rua: Av. Paulista, 1000</p>
    <p>Cidade: São Paulo - SP</p>
    <p>CEP: 01310-100</p>
  </div>
 
  <div
    id="account-panel-3"
    role="tabpanel"
    aria-labelledby="account-tab-3"
    class="brad-tab__content brad-p-lg brad-tabs__is-hidden--js"
  >
    <h4>Segurança</h4>
    <p>Último acesso: 10/12/2025 às 14:30</p>
    <p>Autenticação em dois fatores: Ativada</p>
    <p>Senha: ********</p>
  </div>

    </div>
  </div>

  
  <div
    id="parent-panel-2"
    role="tabpanel"
    aria-labelledby="parent-tab-2"
    class="brad-tab__content brad-p-xxl brad-tabs__is-hidden--js"
  >
    <h3 class="brad-mb-lg">Meus Produtos</h3>

    <div id="child-tabs-2-386" class="brad-tab brad-tab--indicator-bottom">
      
  <div
    class="brad-scrollbar"
    role="tablist"
    aria-labelledby="tablist-products"
  >
    <button
      id="product-tab-1"
      type="button"
      role="tab"
      aria-selected="true"
      aria-controls="product-panel-1"
    >
      <span class="brad-tab__focus--js">
        <em class="brad-tab__btn-icon i icon-financial-wallet"></em>
        Conta Corrente
      </span>
    </button>

    <button
      id="product-tab-2"
      type="button"
      role="tab"
      aria-selected="false"
      aria-controls="product-panel-2"
    >
      <span class="brad-tab__focus--js">
        <em class="brad-tab__btn-icon i icon-account-card"></em>
        Cartões
      </span>
    </button>

    <button
      id="product-tab-3"
      type="button"
      role="tab"
      aria-selected="false"
      aria-controls="product-panel-3"
    >
      <span class="brad-tab__focus--js">
        <em class="brad-tab__btn-icon i icon-financial-graphic-up"></em>
        Investimentos
      </span>
    </button>
  </div>
 
  <div
    id="product-panel-1"
    role="tabpanel"
    aria-labelledby="product-tab-1"
    class="brad-tab__content brad-p-lg"
  >
    <h4>Conta Corrente</h4>
    <p>Agência: 1234-5</p>
    <p>Conta: 67890-1</p>
    <p>Saldo: R$ 5.432,10</p>
    <p>Limite disponível: R$ 3.000,00</p>
  </div>

      
  <div
    id="product-panel-2"
    role="tabpanel"
    aria-labelledby="product-tab-2"
    class="brad-tab__content brad-p-lg brad-tabs__is-hidden--js"
  >
    <h4>Cartões</h4>
    <p>Cartão de Crédito: **** **** **** 1234</p>
    <p>Limite: R$ 10.000,00</p>
    <p>Fatura atual: R$ 2.345,67</p>
    <p>Vencimento: 15/12/2025</p>
  </div>
 
  <div
    id="product-panel-3"
    role="tabpanel"
    aria-labelledby="product-tab-3"
    class="brad-tab__content brad-p-lg brad-tabs__is-hidden--js"
  >
    <h4>Investimentos</h4>
    <p>Total investido: R$ 50.000,00</p>
    <p>Rentabilidade: +8,5% ao ano</p>
    <p>Poupança: R$ 15.000,00</p>
    <p>Fundos: R$ 35.000,00</p>
  </div>

    </div>
  </div>
 
  <div
    id="parent-panel-3"
    role="tabpanel"
    aria-labelledby="parent-tab-3"
    class="brad-tab__content brad-p-xxl brad-tabs__is-hidden--js"
  >
    <h3 class="brad-mb-lg">Configurações</h3>

    <div id="child-tabs-3-7" class="brad-tab brad-tab--indicator-bottom">
      
  <div
    class="brad-scrollbar"
    role="tablist"
    aria-labelledby="tablist-settings"
  >
    <button
      id="settings-tab-1"
      type="button"
      role="tab"
      aria-selected="true"
      aria-controls="settings-panel-1"
    >
      <span class="brad-tab__focus--js">
        <em class="brad-tab__btn-icon i icon-ui-notification"></em>
        Notificações
      </span>
    </button>

    <button
      id="settings-tab-2"
      type="button"
      role="tab"
      aria-selected="false"
      aria-controls="settings-panel-2"
    >
      <span class="brad-tab__focus--js">
        <em class="brad-tab__btn-icon i icon-ui-appearance"></em>
        Aparência
      </span>
    </button>

    <button
      id="settings-tab-3"
      type="button"
      role="tab"
      aria-selected="false"
      aria-controls="settings-panel-3"
    >
      <span class="brad-tab__focus--js">
        <em class="brad-tab__btn-icon i icon-ui-language"></em>
        Idioma
      </span>
    </button>
  </div>
 
  <div
    id="settings-panel-1"
    role="tabpanel"
    aria-labelledby="settings-tab-1"
    class="brad-tab__content brad-p-lg"
  >
    <h4>Notificações</h4>
    <p>Notificações push: Ativadas</p>
    <p>Notificações por email: Ativadas</p>
    <p>Notificações SMS: Desativadas</p>
    <p>Avisos de transações: Ativados</p>
  </div>

      
  <div
    id="settings-panel-2"
    role="tabpanel"
    aria-labelledby="settings-tab-2"
    class="brad-tab__content brad-p-lg brad-tabs__is-hidden--js"
  >
    <h4>Aparência</h4>
    <p>Tema: Claro</p>
    <p>Modo escuro automático: Desativado</p>
    <p>Tamanho da fonte: Médio</p>
    <p>Contraste: Normal</p>
  </div>
 
  <div
    id="settings-panel-3"
    role="tabpanel"
    aria-labelledby="settings-tab-3"
    class="brad-tab__content brad-p-lg brad-tabs__is-hidden--js"
  >
    <h4>Idioma e Região</h4>
    <p>Idioma: Português (Brasil)</p>
    <p>Formato de data: DD/MM/AAAA</p>
    <p>Moeda: Real (R$)</p>
    <p>Fuso horário: (UTC-3) Brasília</p>
  </div>

    </div>
  </div>

</div>
```
## Controle personalizado sem tabpanel

Este exemplo demonstra o controle personalizado das tabs sem usar tabpanel, implementando o comportamento de seleção e conteúdo por conta própria através do evento changes.

```
<div id="tabs-custom-296" class="brad-tab brad-tab--indicator-bottom">
  <div class="brad-scrollbar" role="tablist">
    <button id="custom-tab-1" type="button" role="tab" aria-selected="true">
      <span class="brad-tab__focus--js">Tab 1</span>
    </button>

    <button
      id="custom-tab-2"
      type="button"
      role="tab"
      aria-selected="false"
    >
      <span class="brad-tab__focus--js">Tab 2</span>
    </button>

    <button
      id="custom-tab-3"
      type="button"
      role="tab"
      aria-selected="false"
    >
      <span class="brad-tab__focus--js">Tab 3</span>
    </button>
  </div>

  <div
    id="dynamic-content"
    class="brad-tab__content brad-p-xxl"
    style="max-height: 300px; overflow: auto"
  >
    <div style="min-height: 600px;">Conteúdo da TAB 1 aqui 😊</div>
  </div>
</div>
```