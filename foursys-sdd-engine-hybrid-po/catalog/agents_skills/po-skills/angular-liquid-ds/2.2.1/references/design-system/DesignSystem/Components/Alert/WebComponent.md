# Alert

A função do alerta é notificar o usuário sobre informações urgentes que exigem atenção imediata e quando ele for realizar ações Irreversíveis.
.

# Uso do WebComponent
## Tags

| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-alert | Componente | Sim | Não | Componente principal do alerta, define a estrutura do alerta e usa atributos para o tipo e fundo. |
| brad-alert-icon | Sub-componente | Sim | Não | Ícone do alerta, que pode variar conforme o tipo de alerta. |
| brad-alert-content | Sub-componente | Sim | Não | Contêiner principal para o conteúdo do alerta. |
| brad-alert-title | Sub-componente | Não | Sim | Título do alerta. Pode conter conteúdo dinâmico, como um texto personalizado. |
| brad-alert-body | Sub-componente | Sim | Sim | Corpo do alerta, que inclui a seção central e o botão. |
| brad-alert-body-middle | Sub-componente | Não | Sim | Seção central do corpo do alerta onde o conteúdo principal é exibido. |
| brad-alert-button | Sub-componente | Não | Sim | Botão associado ao alerta. O texto do botão pode ser dinâmico. |

# Propriedades

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-type | "info", "success", "warning", "error" | "info" | Define o tipo de alerta, o qual afeta o fundo e a aparência do indicador visual. Os tipos disponíveis são "info", "success", "warning" e "error". |
| brad-no-background | boolean | false | Se ativado, torna o fundo transparente. O tipo de alerta ainda afeta o ícone exibido. |

# Acessibilidade

As cores de cada Alert são apenas indicadores visuais e não serão informadas aos leitores de telas, por isso é necessário que as informações passadas pela cor estejam obvias no próprio conteúdo ou sejam incluídas através de texto oculto adicional.

Caso haja um elemento que receba alguma ação dentro do Alert, esse deve ter um tabindex="0" para possibilitar o acesso com teclado.

# Exemplos
```
<brad-alert
  brad-type="info"
  
>
  <brad-alert-icon></brad-alert-icon>

  <brad-alert-content>
    <brad-alert-title>
    <h1>Title</h1>
  </brad-alert-title>

    <brad-alert-body><brad-alert-body-middle>
    <p>Alert body text goes here.</p>
  </brad-alert-body-middle><brad-alert-button>
    <button
      class="brad-btn brad-btn-text brad-btn-text--no-bg brad-btn--auto"
    >
      <span>Link</span>
    </button>
  </brad-alert-button></brad-alert-body>
  </brad-alert-content>
</brad-alert>
```