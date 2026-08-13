---
name: angular-liquid-ds
description: >
  Guia completo para uso do Design System Liquid do Bradesco (versão 3.1.0).
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
---

# Design System Liquid — Bradesco

O Liquid fornece Web Components (`brad-*`), classes CSS utilitárias e serviços JavaScript para interfaces consistentes em todos os segmentos do banco.

## Conceitos fundamentais

**Temas** — todo componente deve estar dentro de um container com a classe de tema que controla a paleta de cores do segmento: `brad-theme-classic` (Varejo, padrão), `brad-theme-corporate`, `brad-theme-empresas`, `brad-theme-exclusive`, `brad-theme-prime`, `brad-theme-private`, `brad-theme-next`, `brad-theme-expresso`, `brad-theme-agora`, `brad-theme-afluentes`.

**Dois modelos de componente — preferência por Web Components:**
- **Web Components** ⭐ **PREFERENCIAL** — tags `<brad-*>` com encapsulamento, atributos HTML e métodos via `.service`. Sempre usar quando o componente tiver versão Web Component disponível.
- **Classes CSS** — fallback para elementos que não possuem Web Component (ex: Button, Badge, Checkbox, RadioButton, Switch, Overlay).

**Prefixo `brad-`** — todas as tags e classes do Liquid usam este prefixo.

**Acesso JS** — Web Components expõem `.service` com métodos comuns: `open()`, `close()`, `toggle()`, `destroy()`. Eventos via `element.addEventListener('open', handler)`. Serviço global: `window.LiquidCorp.instances`.

Para detalhes sobre HTML vs Web Components, leia `references/HTML x Web Components.md`.
Para configuração inicial, leia `references/Como começar.md`.

---

## Setup Angular — verificar `index.html`

Antes de implementar qualquer componente em um projeto Angular, **verificar se o `index.html` está configurado** com os CDN do Liquid. O arquivo deve conter:

**No `<head>`** — folhas de estilo (nesta ordem):
```
https://static.bradesco.com.br/dsysliquid/dist/design-system-3.1.0/reset.bundle.min.css
https://static.bradesco.com.br/dsysliquid/dist/design-system-3.1.0/design-system.bundle.min.css
```

**No `<body>`, antes de `</body>`** — script com integrity:
```
https://static.bradesco.com.br/dsysliquid/dist/design-system-3.1.0/design-system.bundle.min.js
integrity="sha256-hVMmY5YOT5dlwD1SdTZ+N1mpURocC7oarSg7BEwHIiE=" crossorigin="anonymous"
```

**Tag `<body>`** — deve ter a classe do tema do segmento:
```
<body class="brad-theme-classic">
```
> ⚠️ Em Angular use `class`, não `className` (que é sintaxe JSX).

**Uso de serviços Liquid em TypeScript** — declarar `LiquidCorp` antes da classe do componente:
```ts
declare let LiquidCorp: any;
```

Se o `index.html` não estiver configurado, adicionar os CDN antes de prosseguir com a implementação.

---

## Descobrindo componentes disponíveis

Para listar os componentes disponíveis, leia `references/ListComponents.md` — contém todos os componentes com seus paths de referência.

Alternativamente, liste os diretórios diretamente:
- Componentes: `references/Components/`
- Templates: `references/Templates/`
- Imagens/ícones: `references/Images/`

---

## Onde encontrar a documentação

Toda documentação de referência está em `references/`. Paths relativos à pasta da skill:

### Componentes — `references/Components/<Nome>/`

Cada componente tem `WebComponent.md` e/ou `HTML.md`. Alguns têm subpastas por variante.

| Categoria | Componentes |
|---|---|
| Layout | Accordion, Card, Carousel, Table, Tabs |
| Feedback | Alert, Badge, Infobar, Snackbar, Tag |
| Sobreposição | BottomSheet, BottomSheetExpansive, Modal, Overlay, Popover, SideSheet |
| Formulários | Forms/Checkbox, Forms/Chip, Forms/FormField/TextField, Forms/FormField/TextFieldSearch, Forms/FormField/TextFieldSelect, Forms/FormField/TextFieldCode, Forms/FormField/TextFieldNumber, Forms/FormField/TextFieldPrompt, Forms/FormField/TextFieldQuantity, Forms/InputUploader, Forms/RadioButton, Forms/Slider, Forms/Switch, Dropdown, Filter |
| Ação | Button, TextLink, Quickbutton |
| Navegação/Progresso | Breadcrumbs, Navbar, Pagination, PaginationBullets, Progress, ProgressStepper, Timeline, TimelineStepper |
| Outros | Calendar, Charts, Chat, ContentLoaders, DragAndDrop, DotsSequencer, HideText, ListItem, Rating |

### Serviços JS — `references/Services/`

- `BodyScrollManager.md` — controle de scroll do body (ex: bloquear ao abrir modal)
- `ComponentToggle.md` — utilitário para abrir/fechar componentes por seletor
- `Instances.md` — `window.LiquidCorp.instances`: acesso a instâncias registradas
- `ContentLoaders/InfiniteScroll.md` — scroll infinito

### Utilitários JS — `references/Utils/`

- `Async.md` — `wait()`, retries

### Classes CSS utilitárias — `references/Utilities/Classes/`

Border, ColorCombinations, Colors, Elevation, Flex, Glassmorphism, Gradients, Loader, Opacity, PreventSelect, Scrollbar, SkeletonLoader, Spacing, Typography, Waves, zIndex

### Templates — `references/Templates/`

Padrões de composição prontos: AccordionSelectableHeader, CalendarTemplate, Cards (IconTitleDescriptionColors, IconTitleDescriptionThemes), Conclusion, ContactDDIList, DragAndDrop (BottomSheet, Collapse, Modal, SideSheet), Feedback, FilterSheetFlow, PopoverTutorial, Rating

### Imagens — `references/Images/`

- `Icons.md` — catálogo de ícones (`icon-*`)
- `Flags.md` — bandeiras de países
- `Logos.md` — logotipos Bradesco
- `Illustration.md` — ilustrações
- `Animation.md` — animações Lottie

---

## Acessibilidade

- `aria-label` em modais, bottom-sheets e campos de formulário
- `aria-controls` / `aria-labelledby` em tabs para vincular abas aos painéis
- `aria-expanded` em accordions — gerenciado automaticamente pelo Web Component
- `brad-aria-hidden-placer` para esconder conteúdo atrás de overlays do leitor de tela
- `tabindex="0"` em cards interativos e elementos que devem receber foco
- `aria-invalid="true"` e `aria-errormessage` em campos com erro
- Navegação por teclado (Tab, Enter, Espaço, setas) já implementada nos Web Components
