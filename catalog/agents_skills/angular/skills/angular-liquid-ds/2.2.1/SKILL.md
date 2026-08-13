---
name: angular-liquid-ds
description: >
  Guia completo para uso do Design System Liquid do Bradesco (versão 2.2.1).
  Ajuda a construir interfaces usando os Web Components, classes CSS utilitárias,
  serviços JavaScript e padrões de acessibilidade do Liquid. Use esta skill sempre
  que o usuário precisar criar, modificar ou entender componentes de interface
  seguindo o Design System Liquid — incluindo botões, modais, formulários, cards,
  tabs, accordions, alerts, bottom-sheets, tabelas, dropdowns, carrosséis ou
  qualquer outro componente do Liquid. Também use quando o usuário mencionar
  classes brad-*, temas do Bradesco (classic, corporate, prime, private, next,
  etc.), espaçamento, tipografia, cores, elevação ou qualquer utilitário CSS
  do Liquid, mesmo que não use o termo "Liquid" explicitamente. Se o usuário
  estiver trabalhando em um projeto Bradesco e precisar de HTML/CSS/JS para
  componentes de UI, esta skill é a referência correta.
metadata:
  version: "2.2.1"
---


# Design System Liquid — Bradesco

O Liquid é o Design System do Bradesco. Ele fornece Web Components customizados (tags `brad-*`), classes CSS utilitárias e serviços JavaScript para construir interfaces consistentes em todos os segmentos do banco.

## Conceitos fundamentais

### Temas

Todo componente Liquid deve estar dentro de um container com a classe de tema. O tema controla a paleta de cores do segmento:

```html
<div class="brad-theme-classic">
  <!-- Componentes Liquid aqui -->
</div>
```

Temas disponíveis:
- `brad-theme-classic` — Varejo (padrão)
- `brad-theme-corporate` — Corporate
- `brad-theme-empresas` — Empresas
- `brad-theme-exclusive` — Exclusive
- `brad-theme-prime` — Prime
- `brad-theme-private` — Private
- `brad-theme-next` — Next
- `brad-theme-expresso` — Expresso
- `brad-theme-agora` — Agora
- `brad-theme-afluentes` — Afluentes

### Dois modelos de componente

O Liquid oferece componentes em dois formatos:

1. **Web Components** — Tags customizadas como `<brad-modal>`, `<brad-tabs>`, `<brad-accordion>`. Possuem encapsulamento, propriedades via atributos HTML e métodos JavaScript acessíveis via `.service`. Preferir este formato quando disponível.

2. **Classes CSS** — Componentes baseados em classes como `brad-btn brad-btn-primary`. Usados para elementos mais simples (botões, utilitários).

### Prefixo `brad-`

Todas as classes CSS e tags customizadas do Liquid usam o prefixo `brad-`. Ao ver este prefixo, trata-se de um elemento do Design System.

---

## Referência rápida de componentes

Abaixo está a lista de componentes disponíveis. Para cada componente, a documentação completa (propriedades, exemplos, acessibilidade, eventos) está em `references/design-system/DesignSystem/Components/<NomeDoComponente>/`.

Quando precisar de detalhes sobre um componente específico, leia o arquivo correspondente na pasta de referência. Componentes que possuem versão Web Component e HTML terão arquivos separados (`WebComponent.md` e `HTML.md`).

### Layout e estrutura

| Componente | Tag/Classe | Uso |
|---|---|---|
| **Card** | `<brad-card>` | Container de conteúdo flexível. Tipos: default, dragged, interactive, ribbon |
| **Accordion** | `<brad-accordion>` | Seções expansíveis para conteúdo secundário |
| **Tabs** | `<brad-tabs>` | Navegação entre seções de conteúdo |
| **Carousel** | `<brad-carousel>` | Exibição rotativa de conteúdo |
| **Table** | Classes `brad-table-*` | Tabelas de dados |

### Feedback e notificação

| Componente | Tag/Classe | Uso |
|---|---|---|
| **Alert** | `<brad-alert>` | Notificações urgentes. Tipos: info, success, warning, error |
| **Snackbar** | `<brad-snackbar>` | Mensagens temporárias de feedback |
| **Infobar** | `<brad-infobar>` | Barra informativa fixa |
| **Badge** | Classes `brad-badge-*` | Indicadores numéricos em ícones |
| **Tag** | `<brad-tag>` | Rótulos categorizadores |

### Sobreposição

| Componente | Tag/Classe | Uso |
|---|---|---|
| **Modal** | `<brad-modal>` | Sobreposição exigindo interação. Tipos: default, dialog |
| **BottomSheet** | `<brad-bs>` | Superfície fixada na parte inferior |
| **SideSheet** | `<brad-side-sheet>` | Painel lateral |
| **Overlay** | Classes `brad-overlay-*` | Camada de sobreposição |
| **Popover** | `<brad-popover>` | Balão de informação contextual |

### Formulários

| Componente | Tag/Classe | Uso |
|---|---|---|
| **TextField** | `<brad-text-field>` | Campo de texto com label, validação, ícones |
| **TextFieldSelect** | `<brad-text-field-select>` | Campo com seleção dropdown |
| **TextFieldSearch** | `<brad-text-field-search>` | Campo de busca |
| **Checkbox** | Classes `brad-checkbox-*` | Caixa de seleção |
| **RadioButton** | Classes `brad-radio-*` | Botão de opção |
| **Switch** | Classes `brad-switch-*` | Alternador on/off |
| **Slider** | `<brad-slider>` | Controle deslizante |
| **Chip** | `<brad-chip>` | Filtros selecionáveis |
| **Dropdown** | `<brad-dropdown>` | Lista suspensa de opções |

### Ação

| Componente | Tag/Classe | Uso |
|---|---|---|
| **Button** | `brad-btn brad-btn-primary` | Botão de ação. Hierarquias: primary, secondary, tertiary |
| **Button Icon** | `brad-btn brad-btn-fab-icon` | Botão com ícone |
| **Button FAB** | `brad-btn brad-btn-fab-label` | Botão flutuante com label |
| **TextLink** | `<brad-text-link>` | Link textual estilizado |
| **Quickbutton** | Classes `brad-quickbutton-*` | Botão de ação rápida |

### Navegação e progresso

| Componente | Tag/Classe | Uso |
|---|---|---|
| **Navbar** | `<brad-navbar>` | Barra de navegação |
| **Breadcrumbs** | `<brad-breadcrumbs>` | Trilha de navegação |
| **Pagination** | `<brad-pagination>` | Paginação numérica |
| **Progress** | `<brad-progress>` | Barra de progresso |
| **ProgressStepper** | `<brad-progress-stepper>` | Indicador de etapas |
| **Timeline** | `<brad-timeline>` | Linha do tempo de eventos |

---

## Exemplos de uso dos componentes mais comuns

### Button

```html
<!-- Primary -->
<button class="brad-btn brad-btn-primary">Confirmar</button>

<!-- Secondary -->
<button class="brad-btn brad-btn-secondary">Cancelar</button>

<!-- Tertiary -->
<button class="brad-btn brad-btn-tertiary">Saiba mais</button>

<!-- Tamanho médio -->
<button class="brad-btn brad-btn-primary brad-btn-primary--md">Ação</button>

<!-- Desabilitado -->
<button class="brad-btn brad-btn-primary" disabled>Indisponível</button>

<!-- Largura automática -->
<button class="brad-btn brad-btn-primary brad-btn--auto">Auto</button>
```

### Modal

```html
<!-- Modal default -->
<brad-modal brad-type="default" aria-label="Modal de confirmação">
  <brad-modal-close></brad-modal-close>
  <brad-modal-content class="brad-p-lg">
    <p>Conteúdo do modal</p>
  </brad-modal-content>
</brad-modal>

<!-- Modal dialog (com header, paragraph e footer) -->
<brad-modal brad-type="dialog" brad-dialog-position="center" brad-dialog-max-width="md" aria-label="Confirmação">
  <brad-modal-close></brad-modal-close>
  <brad-modal-dialog-top>
    <brad-modal-dialog-header><h2>Título</h2></brad-modal-dialog-header>
    <brad-modal-dialog-paragraph><p>Descrição</p></brad-modal-dialog-paragraph>
  </brad-modal-dialog-top>
  <brad-modal-content class="brad-p-lg"><p>Conteúdo</p></brad-modal-content>
  <brad-modal-dialog-footer brad-buttons-preset>
    <button class="brad-btn brad-btn-text brad-btn--auto brad-m-md-r">Cancelar</button>
    <button class="brad-btn brad-btn-primary brad-btn--auto">Confirmar</button>
  </brad-modal-dialog-footer>
</brad-modal>
```

**JavaScript:**
```js
const modal = document.querySelector('brad-modal');
modal.open();   // Abre
modal.close();  // Fecha
modal.toggle(); // Alterna
```

### TextField (campo de texto)

```html
<brad-text-field>
  <input aria-label="Nome completo" type="text" />
  <brad-text-field-label>Nome completo</brad-text-field-label>
  <brad-text-field-helper-text>Informe seu nome como consta no documento</brad-text-field-helper-text>
</brad-text-field>

<!-- Com validação e ícone -->
<brad-text-field>
  <input aria-label="E-mail" type="email" />
  <brad-text-field-leading-icon class="icon-contact-email"></brad-text-field-leading-icon>
  <brad-text-field-label>E-mail</brad-text-field-label>
  <brad-text-field-validation></brad-text-field-validation>
  <brad-text-field-helper-text>Seu melhor e-mail</brad-text-field-helper-text>
</brad-text-field>
```

Ordem dos elementos dentro de `<brad-text-field>`:
1. `<input>` ou `<textarea>`
2. `<brad-text-field-leading-icon>` (opcional)
3. `<brad-text-field-label>` (logo após o ícone, se houver)
4. `<brad-text-field-prefix>` / `<brad-text-field-suffix>` (opcionais)
5. `<brad-text-field-validation>` (opcional)
6. `<brad-text-field-action>` (opcional)
7. `<brad-text-field-helper-text>` (sempre por último)

### Alert

```html
<brad-alert brad-type="success">
  <brad-alert-icon></brad-alert-icon>
  <brad-alert-content>
    <brad-alert-title><h1>Operação realizada</h1></brad-alert-title>
    <brad-alert-body>
      <brad-alert-body-middle><p>Sua transferência foi concluída.</p></brad-alert-body-middle>
    </brad-alert-body>
  </brad-alert-content>
</brad-alert>
```

Tipos: `info`, `success`, `warning`, `error`.

### Accordion

```html
<brad-accordion id="faq-1" brad-border="default">
  <brad-accordion-header>
    <brad-accordion-title><h2>Como funciona?</h2></brad-accordion-title>
  </brad-accordion-header>
  <brad-accordion-content>
    <p>Explicação detalhada aqui.</p>
  </brad-accordion-content>
</brad-accordion>
```

**JavaScript:**
```js
const accordion = document.getElementById('faq-1');
accordion.service.open();
accordion.service.close();
accordion.service.toggle();
// Fechar todos: accordion.service.constructor.closeAll();
```

### Tabs

```html
<brad-tabs brad-indicator="bottom">
  <brad-tab-list class="brad-scrollbar">
    <brad-tab id="tab-1" selected="true" aria-controls="panel-1">Resumo</brad-tab>
    <brad-tab id="tab-2" aria-controls="panel-2">Detalhes</brad-tab>
  </brad-tab-list>
  <brad-tab-panels>
    <brad-tab-panel id="panel-1" aria-labelledby="tab-1" class="brad-p-xxl">
      <p>Conteúdo do resumo</p>
    </brad-tab-panel>
    <brad-tab-panel id="panel-2" aria-labelledby="tab-2" class="brad-p-xxl">
      <p>Conteúdo dos detalhes</p>
    </brad-tab-panel>
  </brad-tab-panels>
</brad-tabs>
```

### Card

```html
<!-- Card padrão -->
<brad-card brad-type="default" class="brad-p-lg">
  <h1 class="brad-font-title-md brad-m-md-b">Título</h1>
  <p>Conteúdo do card</p>
</brad-card>

<!-- Card interativo (clicável) -->
<brad-card brad-type="interactive" class="brad-p-lg" role="link" tabindex="0">
  <h1 class="brad-font-title-md">Ver mais</h1>
</brad-card>
```

### BottomSheet

```html
<brad-bs id="bs-1" brad-state="modal">
  <brad-bs-header>
    <h2 brad-bs-title class="brad-font-title-md">Título</h2>
    <button brad-bs-close aria-label="Fechar bottom-sheet"></button>
  </brad-bs-header>
  <brad-bs-content>Conteúdo aqui</brad-bs-content>
</brad-bs>
```

---

## Classes utilitárias

As classes utilitárias permitem ajustar espaçamento, tipografia, cores, bordas, elevação e layout sem CSS customizado.

### Espaçamento

Formato: `brad-{property}-{size}-{direction}`

- **property**: `m` (margin) ou `p` (padding)
- **direction**: `t` (top), `b` (bottom), `l` (left), `r` (right), `x` (horizontal), `y` (vertical), ou vazio (todos os lados)

**Tamanhos de padding**: none (0px), xxs (2px), xs (4px), sm (8px), md (12px), lg (16px), xl (20px), xxl (24px)
**Tamanhos de margin**: none (0px), xs (8px), sm (16px), md (24px), lg (32px), xl (40px)

```html
<div class="brad-p-md brad-m-sm-b">Padding 12px e margin-bottom 16px</div>
```

### Tipografia

| Classe | Uso |
|---|---|
| `brad-font-title-xl` | Título extra grande (22px, semibold) |
| `brad-font-title-lg` | Título grande (20px, semibold) |
| `brad-font-title-md` | Título médio (16px, semibold) |
| `brad-font-title-sm` | Título pequeno (14px, semibold) |
| `brad-font-paragraph-md` | Parágrafo médio (16px, medium) |
| `brad-font-paragraph-sm` | Parágrafo pequeno (14px, medium) |
| `brad-font-subtitle-sm` | Subtítulo pequeno (14px, semibold) |
| `brad-font-subtitle-xs` | Subtítulo extra pequeno (12px) |
| `brad-font-subtitle-xxs` | Subtítulo mínimo (10px) |
| `brad-font-link-md` | Link médio (16px) |
| `brad-font-link-sm` | Link pequeno (14px) |

Pesos: `brad-font-weight-regular` (400), `brad-font-weight-medium` (500), `brad-font-weight-semibold` (600), `brad-font-weight-bold` (700)

### Cores

- Background: `brad-bg-color-primary`, `brad-bg-color-secondary`, `brad-bg-color-institucional`
- Texto: `brad-text-color-neutral-0` (branco), `brad-text-color-neutral-100` (escuro)
- Bordas: `brad-border-color-primary`, `brad-border-color-cta`, etc.
- Extensões: `brad-bg-color-extended-green`, `brad-bg-color-extended-red`, etc.
- Alertas: `brad-bg-color-alert-info`, `brad-bg-color-alert-success`, etc.
- Neutras: `brad-bg-color-neutral-0` até `brad-bg-color-neutral-100`

### Bordas e arredondamento

```html
<!-- Borda -->
<div class="brad-border-hairline">1px</div>
<div class="brad-border-thin">1.4px</div>
<div class="brad-border-thick">2px</div>
<div class="brad-border-thick-t brad-border-thick-l">Bordas top e left</div>

<!-- Arredondamento -->
<div class="brad-rounded-sm">8px</div>
<div class="brad-rounded-md">12px</div>
<div class="brad-rounded-pill">999px (pílula)</div>
```

### Elevação (sombras)

```html
<div class="brad-shadow-10">Sombra leve</div>
<div class="brad-shadow-20">Sombra média</div>
<div class="brad-shadow-30">Sombra forte</div>
<div class="brad-shadow-40">Sombra máxima</div>
<!-- Direções: brad-shadow-top-*, brad-shadow-left-*, brad-shadow-right-* -->
```

### Flexbox

```html
<div class="brad-flex brad-flex-row brad-flex-justify-content-between brad-flex-align-items-center">
  <span>Item 1</span>
  <span>Item 2</span>
</div>
```

Direções: `brad-flex-row`, `brad-flex-column`, `brad-flex-row-reverse`, `brad-flex-column-reverse`, `brad-flex-wrap`
Justify: `brad-flex-justify-content-start`, `-end`, `-center`, `-between`, `-around`, `-evenly`
Align: `brad-flex-align-items-start`, `-end`, `-center`, `-baseline`, `-stretch`
Self: `brad-flex-align-self-start`, `-end`, `-center`, `-baseline`, `-stretch`

---

## Padrão de acesso via JavaScript

Os Web Components do Liquid expõem uma propriedade `.service` no elemento DOM que dá acesso aos métodos e eventos:

```js
// Padrão geral para qualquer Web Component
const element = document.querySelector('brad-component-name');
const service = element.service;

// Métodos comuns
service.open();
service.close();
service.toggle();
service.destroy();

// Escutar eventos
element.addEventListener('open', (event) => {
  console.log('Componente aberto', event.detail);
});
```

### Serviço de instâncias global

Todos os componentes que herdam de `BradBaseComponentService` se registram em `window.LiquidCorp.instances`:

```js
const instances = window.LiquidCorp.instances;
const myComponent = instances.getByTargetSelector('#meu-componente');
const all = instances.getAll();
```

---

## Acessibilidade

O Liquid prioriza acessibilidade. Diretrizes gerais:

1. **aria-label**: Adicione em modais, bottom-sheets e campos de formulário para descrever o propósito do componente.
2. **aria-controls / aria-labelledby**: Use em tabs para vincular abas aos seus painéis.
3. **aria-expanded**: Atributo automático em accordions — gerenciado pelo Web Component.
4. **brad-aria-hidden-placer**: Atributo para esconder conteúdo atrás de overlays (modal, bottom-sheet) do leitor de tela.
5. **tabindex**: Use `tabindex="0"` em cards interativos e elementos que devem receber foco.
6. **Validação de formulários**: Use `aria-invalid="true"` e `aria-errormessage` em campos com erro.
7. **Navegação por teclado**: Os Web Components já implementam suporte a Tab, Enter, Espaço e setas.

---

## Onde encontrar a documentação detalhada

Toda a documentação de referência está organizada em `references/design-system/`:

- **Componentes**: `DesignSystem/Components/<NomeDoComponente>/` — Cada componente tem `WebComponent.md` e/ou `HTML.md`
- **Serviços JS**: `DesignSystem/Services/` — BodyScrollManager, ComponentToggle, Instances
- **Utilitários JS**: `DesignSystem/Utils/` — Async (wait, retries)
- **Classes utilitárias CSS**: `Utilities/Classes/` — Border, Colors, Elevation, Flex, Glassmorphism, Gradients, Loader, Opacity, Scrollbar, SkeletonLoader, Spacing, Typography, Waves, zIndex
- **Templates**: `DesignSystem/Templates/` — AccordionSelectableHeader, CalendarTemplate, Cards, Feedback, etc.

Ao implementar um componente, leia o arquivo de referência correspondente para garantir que está usando as propriedades, a estrutura HTML e as boas práticas de acessibilidade corretas.
