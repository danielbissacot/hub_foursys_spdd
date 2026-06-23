# Tabs

Componente responsável por organizar e controlar a navegação entre diferentes seções de conteúdo da plataforma, permitindo ao usuário alternar entre múltiplas visualizações de forma intuitiva e acessível.

# Uso do Web Component

O componente Tabs é construído através de uma arquitetura modular que combina múltiplos elementos web components. Cada elemento tem uma responsabilidade específica, permitindo flexibilidade na construção de diferentes layouts de abas.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-tabs | Componente | Sim | Não | Container principal que gerencia o estado e comportamento das abas |
| brad-tab-list | Sub-componente | Sim | Não | Lista de navegação que contém os botões das abas |
| brad-tab | Sub-componente | Sim | Sim | Botão individual de navegação entre as seções |
| brad-tab-icon | Sub-componente | Não | Não | Elemento de ícone para representação visual da aba |
| brad-tab-panels | Sub-componente | Não | Sim | Container que agrupa todos os painéis de conteúdo |
| brad-tab-panel | Sub-componente | Sim | Sim | Painel individual contendo o conteúdo de cada aba |

# Propriedades
## brad-tabs

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-indicator | "bottom", "top" | "bottom" | Define a posição do indicador visual que destaca a aba ativa |
| brad-on-color | boolean | false | Ativa o modo de contraste para uso em fundos escuros ou coloridos |

# brad-tab

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| selected | boolean | false | Define se a aba está atualmente selecionada e visível |
| disabled | boolean | false | Desabilita a interação com a aba, impedindo sua seleção |

# brad-tab-icon

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-icon | string | "icon-ui-placeholder" | Define o ícone que será exibido na aba usando classes de ícone CSS |


Posicionamento: O ícone pode ser posicionado à esquerda ou à direita do texto da aba. Para isso, coloque o elemento <brad-tab-icon> antes ou depois do texto dentro de <brad-tab>.

# Uso do HTML
```
<brad-tabs id="tabs" brad-on-color="false" brad-indicator="bottom">
<brad-tab-list class="brad-scrollbar">
  <brad-tab id="tab-1" selected="true" disabled="false" aria-controls="tabpanel-1">
    <brad-tab-icon brad-icon="icon-navigation-home"></brad-tab-icon>
    Home
  </brad-tab>
  <brad-tab id="tab-2" selected="false" disabled="false" aria-controls="tabpanel-2">
    <brad-tab-icon brad-icon="icon-account-person"></brad-tab-icon>
    Profile
  </brad-tab>
  <brad-tab id="tab-3" selected="false" disabled="false" aria-controls="tabpanel-3">
    <brad-tab-icon brad-icon="icon-ui-menu-settings"></brad-tab-icon>
    Settings
  </brad-tab>
</brad-tab-list>
<brad-tab-panels>
  <brad-tab-panel id="tabpanel-1" class="brad-p-xxl" aria-labelledby="tab-1" style="max-height: 200px;">
    <div style="min-height: 600px;">Conteúdo da Home aqui 😊</div>
  </brad-tab-panel>
  <brad-tab-panel id="tabpanel-2" class="brad-p-xxl" aria-labelledby="tab-2" style="max-height: 200px;">
    <div style="min-height: 600px;">Conteúdo da Profile aqui 😊</div>
  </brad-tab-panel>
  <brad-tab-panel id="tabpanel-3" class="brad-p-xxl" aria-labelledby="tab-3" style="max-height: 200px;">
    <div style="min-height: 600px;">Conteúdo da Settings aqui 😊</div>
  </brad-tab-panel>
</brad-tab-panels>
</brad-tabs>
```
## Comportamento Javascript

O componente funciona de forma nativa sem necessidade de inicialização manual. Todos os comportamentos de navegação, acessibilidade e eventos são gerenciados automaticamente pelo web component.

# Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| changes | brad-tabs | Disparado sempre que uma nova aba é selecionada. O event.detail contém informações sobre a aba atual selecionada. |


Como escutar eventos: Todos os eventos devem ser capturados usando addEventListener no elemento brad-tabs. A estrutura de uso é sempre a mesma, mudando apenas o nome do evento e a propriedade acessada em event.detail.

## Exemplo genérico de como escutar o evento:
```
service.component.addEventListener("nome-do-evento", (event) => {
  const dados = event.detail;
  console.log("Evento recebido:", dados);
});
Copy
```

Substitua "nome-do-evento" pelo nome do evento conforme a tabela acima.

# Acessibilidade

O componente implementa automaticamente as práticas de acessibilidade recomendadas pelo WCAG, incluindo navegação por teclado, roles ARIA e estados apropriados. Alguns atributos devem ser configurados manualmente para garantir a associação correta entre abas e painéis.

## Atributos obrigatórios para brad-tab

| Atributo | Tipo | Inserido automaticamente | Descrição |
| --- | --- | --- | --- |
| aria-controls | string | não | Deve referenciar o id do brad-tab-panel correspondente para associação correta |

## Atributos obrigatórios para brad-tab-panel

| Atributo | Tipo | Inserido automaticamente | Descrição |
| --- | --- | --- | --- |
| aria-labelledby | string | não | Deve referenciar o id da brad-tab correspondente para associação correta |

# Navegação por teclado
Tab/Shift+Tab: Navega entre as abas
Seta direita/esquerda: Move o foco entre as abas
Enter/Espaço: Ativa a aba focada
## Home/End: Move para a primeira/última aba

O comportamento da acessibilidade segue as diretrizes WCAG 2.1 para componentes de abas. Para documentação completa sobre acessibilidade, clique aqui.

# Exemplos

Dica: Use o botão "Show code" abaixo de cada exemplo para visualizar o código HTML completo e entender a implementação.

# Tabs com indicador embaixo

Layout padrão com indicador visual posicionado na parte inferior das abas, ideal para a maioria dos casos de uso.

```
<brad-tabs
    id="tabs-304"
    brad-indicator="bottom"
    brad-on-color="false"
  >
    <brad-tab-list class="brad-scrollbar">
  
        <brad-tab
          id="tab-1"
          selected="true"
          disabled="false"
          aria-controls="tabpanel-1"
        >
          <brad-tab-icon brad-icon="icon-navigation-home"></brad-tab-icon>
          Home
        </brad-tab>
      
        <brad-tab
          id="tab-2"
          selected="false"
          disabled="false"
          aria-controls="tabpanel-2"
        >
          <brad-tab-icon brad-icon="icon-account-person"></brad-tab-icon>
          Profile
        </brad-tab>
      
        <brad-tab
          id="tab-3"
          selected="false"
          disabled="false"
          aria-controls="tabpanel-3"
        >
          <brad-tab-icon brad-icon="icon-ui-menu-settings"></brad-tab-icon>
          Settings
        </brad-tab>
      
</brad-tab-list>
    <brad-tab-panels> 
        <brad-tab-panel
          id="tabpanel-1"
          class="brad-p-xxl"
          aria-labelledby="tab-1"
          style="max-height: 200px;"
        >
          <div style="min-height: 600px;">
            <p>Conteúdo da Home aqui 😊</p>
          </div>
        </brad-tab-panel>
      
        <brad-tab-panel
          id="tabpanel-2"
          class="brad-p-xxl"
          aria-labelledby="tab-2"
          style="max-height: 200px;"
        >
          <div style="min-height: 600px;">
            <p>Conteúdo da Profile aqui 😊</p>
          </div>
        </brad-tab-panel>
      
        <brad-tab-panel
          id="tabpanel-3"
          class="brad-p-xxl"
          aria-labelledby="tab-3"
          style="max-height: 200px;"
        >
          <div style="min-height: 600px;">
            <p>Conteúdo da Settings aqui 😊</p>
          </div>
        </brad-tab-panel>
       </brad-tab-panels>
  </brad-tabs>
```
## Tabs com indicador no topo

Variação com indicador posicionado na parte superior das abas, útil quando o conteúdo precisa de maior destaque visual.

```
<brad-tabs
    id="tabs-77"
    brad-indicator="top"
    brad-on-color="false"
  >
    <brad-tab-list class="brad-scrollbar">
  
        <brad-tab
          id="tab-1"
          selected="true"
          disabled="false"
          aria-controls="tabpanel-1"
        >
          <brad-tab-icon brad-icon="icon-financial-graphic-up"></brad-tab-icon>
          Dashboard
        </brad-tab>
      
        <brad-tab
          id="tab-2"
          selected="false"
          disabled="false"
          aria-controls="tabpanel-2"
        >
          <brad-tab-icon brad-icon="icon-financial-chart-bar"></brad-tab-icon>
          Analytics
        </brad-tab>
      
        <brad-tab
          id="tab-3"
          selected="false"
          disabled="false"
          aria-controls="tabpanel-3"
        >
          <brad-tab-icon brad-icon="icon-contact-email-report"></brad-tab-icon>
          Reports
        </brad-tab>
      
        <brad-tab
          id="tab-4"
          selected="false"
          disabled="true"
          aria-controls="tabpanel-4"
        >
          <brad-tab-icon brad-icon="icon-account-person-hand"></brad-tab-icon>
          Admin
        </brad-tab>
      
</brad-tab-list>
    <brad-tab-panels> 
        <brad-tab-panel
          id="tabpanel-1"
          class="brad-p-xxl"
          aria-labelledby="tab-1"
          style="max-height: 200px;"
        >
          <div style="min-height: 600px;">
            <p>Conteúdo da Dashboard aqui 😊</p>
          </div>
        </brad-tab-panel>
      
        <brad-tab-panel
          id="tabpanel-2"
          class="brad-p-xxl"
          aria-labelledby="tab-2"
          style="max-height: 200px;"
        >
          <div style="min-height: 600px;">
            <p>Conteúdo da Analytics aqui 😊</p>
          </div>
        </brad-tab-panel>
      
        <brad-tab-panel
          id="tabpanel-3"
          class="brad-p-xxl"
          aria-labelledby="tab-3"
          style="max-height: 200px;"
        >
          <div style="min-height: 600px;">
            <p>Conteúdo da Reports aqui 😊</p>
          </div>
        </brad-tab-panel>
      
        <brad-tab-panel
          id="tabpanel-4"
          class="brad-p-xxl"
          aria-labelledby="tab-4"
          style="max-height: 200px;"
        >
          <div style="min-height: 600px;">
            <p>Conteúdo da Admin aqui 😊</p>
          </div>
        </brad-tab-panel>
       </brad-tab-panels>
  </brad-tabs>
```
## Tabs com conteúdo acima da navegação

Layout alternativo onde o painel de conteúdo é posicionado acima dos botões de navegação, oferecendo uma experiência visual diferenciada.

```
<brad-tabs
    id="tabs-220"
    brad-on-color="false"
    brad-indicator="top"
  >
    <brad-tab-panels> 
        <brad-tab-panel
          id="tabpanel-1"
          class="brad-p-xxl brad-tabs__is-hidden--js"
          aria-labelledby="tab-1"
          style="max-height: 200px;"
        >
          <p style="min-height: 600px;">Conteúdo da Details aqui 😊</p>
        </brad-tab-panel>
      
        <brad-tab-panel
          id="tabpanel-2"
          class="brad-p-xxl brad-tabs__is-hidden--js"
          aria-labelledby="tab-2"
          style="max-height: 200px;"
        >
          <p style="min-height: 600px;">Conteúdo da History aqui 😊</p>
        </brad-tab-panel>
      
        <brad-tab-panel
          id="tabpanel-3"
          class="brad-p-xxl brad-tabs__is-hidden--js"
          aria-labelledby="tab-3"
          style="max-height: 200px;"
        >
          <p style="min-height: 600px;">Conteúdo da Settings aqui 😊</p>
        </brad-tab-panel>
      
        <brad-tab-panel
          id="tabpanel-4"
          class="brad-p-xxl brad-tabs__is-hidden--js"
          aria-labelledby="tab-4"
          style="max-height: 200px;"
        >
          <p style="min-height: 600px;">Conteúdo da Help aqui 😊</p>
        </brad-tab-panel>
       </brad-tab-panels>
    <brad-tab-list
  class="brad-scrollbar"
  aria-labelledby="tablist-1"
>
  
        <brad-tab
          id="tab-1"
          selected="false"
          
          aria-controls="tabpanel-1"
        >
          Details
        </brad-tab>
      
        <brad-tab
          id="tab-2"
          selected="false"
          
          aria-controls="tabpanel-2"
        >
          History
        </brad-tab>
      
        <brad-tab
          id="tab-3"
          selected="false"
          aria-disabled="true"
          aria-controls="tabpanel-3"
        >
          Settings
        </brad-tab>
      
        <brad-tab
          id="tab-4"
          selected="false"
          
          aria-controls="tabpanel-4"
        >
          Help
        </brad-tab>
      
</brad-tab-list>
  </brad-tabs>
```