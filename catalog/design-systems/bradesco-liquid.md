# Design System Liquid Bradesco — v3.4.0

Extraído do CSS oficial em 20/08/2026:
`https://static.bradesco.com.br/dsysliquid/dist/design-system-3.4.0/design-system.bundle.min.css`

> **Este documento lista os nomes REAIS de classe.** Se um nome não estiver aqui, provavelmente
> não existe — confirme antes de usar. Não deduza variante por analogia com Bootstrap, Tailwind
> ou convenção BEM de outros projetos: o Liquid mistura traço simples (`brad-btn-primary`) e traço
> duplo (`brad-btn--sm`), e cada componente tem o seu.

## Integração (CDN)

```html
<link href="https://static.bradesco.com.br/dsysliquid/dist/design-system-3.4.0/reset.bundle.min.css" rel="stylesheet" />
<link href="https://static.bradesco.com.br/dsysliquid/dist/design-system-3.4.0/design-system.bundle.min.css" rel="stylesheet" />
<script src="https://static.bradesco.com.br/dsysliquid/dist/design-system-3.4.0/design-system.bundle.min.js"></script>
```

**O `<body>` precisa da classe de tema**, senão nenhuma cor é aplicada:
`brad-theme-classic` (padrão), `brad-theme-afluentes`, `brad-theme-agora`, entre outros.

---

## 🎨 Tokens

Cores são variáveis CSS com valor RGB **sem** `rgb()` — use como `rgb(var(--brad-color-primary))`.

**Institucional / marca**
`--brad-color-institucional` (204, 9, 47) · `-light` · `-dark` · `-xlight`
`--brad-color-primary` (204, 9, 47) · `-light` · `-dark` · `-xlight`
`--brad-color-secondary` · `--brad-color-cta` (59, 105, 255) · `--brad-color-focus`

**Alerta**
`--brad-color-alert-info` (59, 105, 255) · `-success` (9, 171, 71) · `-warning` (255, 188, 0) · `-error` (225, 23, 63)
Cada um tem as variantes `-dark`, `-light`, `-xlight`, `-opacity`.

**Neutros** — `--brad-color-neutral-0` (branco) · `-05` · `-10` · `-20` · `-30` · `-40` · `-50` · `-60` · `-100` (preto)

**Estendidas** — `--brad-color-extended-green` · `-blue` · `-purple` · `-violet` · `-salmon` · `-red` · `-yellow`

**Tipografia**
`--brad-font-family-primary`: `"Bradesco", sans-serif`
Tamanhos: `--brad-font-size-xl` (1.375rem) · `-lg` (1.25rem) · `-md` (1rem) · `-sm` (0.875rem) · `-xs` (0.75rem) · `-xxs` (0.625rem)
Pesos: `--brad-font-weight-bold` (700) · `-semibold` (600) · `-medium` (500) · `-regular` (400)

---

## 🔘 Botão

**Base obrigatória:** `brad-btn` — sempre combinada com uma hierarquia.

| Hierarquia | Classe | Observação |
|---|---|---|
| Primário | `brad-btn-primary` | **traço simples** |
| Secundário | `brad-btn-secondary` | |
| Terciário | `brad-btn-tertiary` | |
| Informativo | `brad-btn-info` | |
| Só ícone | `brad-btn-icon` | |
| FAB | `brad-btn-fab-icon` · `brad-btn-fab-label` | |

**Tamanhos (traço duplo):** `brad-btn--sm` · `brad-btn--md`
As hierarquias têm variante própria: `brad-btn-primary--sm`, `brad-btn-primary--md`.

**Modificadores:** `brad-btn--disabled` · `brad-btn--on-color` · `brad-btn--auto` · `brad-btn--w-auto` ·
`brad-btn--floating` · `brad-btn--icons` · `brad-btn--icons-right` · `brad-btn--alert-positive` · `brad-btn--alert-negative`

```html
<button class="brad-btn brad-btn-primary">Ajustar limite</button>
<button class="brad-btn brad-btn-secondary brad-btn--sm">Cancelar</button>
```

> ❌ **Não existe:** `brad-btn--primary`, `brad-btn--block`, `brad-btn--lg`, `brad-button`.

---

## 📱 Bottom Sheet

**Use este componente para painel que sobe de baixo** — é o padrão mobile do Liquid para
oferta, confirmação e decisão. Não use `brad-modal` para isso.

- **Base:** `brad-bottom-sheet` · aberto: `brad-bottom-sheet--opened`
- **Estrutura:** `brad-bottom-sheet__header` · `__content` · `__content-scroll` · `__btn-close` ·
  `__btn-close-accessibility` · `__header-shadow` · `__no-header` · `__no-content`
- **Fundo:** `brad-bottom-sheet-overlay` · `brad-bottom-sheet-overlay__closed`

**Variante expansiva** (arrastável): `brad-bottom-sheet-expansive` com
`--opened` · `--drag` · `--tap` · `--leaving-screen-mode`, e
`__header` · `__title` · `__content` · `__header--grabbing` · `__header--scroll`

---

## 🖼️ Modal

- **Base:** `brad-modal` · aberto: `brad-modal--open` · fechando: `brad-modal--closing`
- **Estrutura:** `brad-modal__content` · `brad-modal__close` · `brad-modal__close--hidden`

**Variante dialog:** `brad-modal--dialog` com
- Posição: `--dialog--center` · `--top-left` · `--top-right` · `--bottom-left` · `--bottom-right`
- Tamanho: `brad-modal--dialog__sm` · `__md` · `__lg` · `__xl`
- Estrutura: `brad-modal--dialog__header` · `__content` · `__footer` · `__close` · `__paragraph` · `__header--scroll`

**Serviço JS:** `LiquidCorp.BradModalService.getInstance({ targetSelector: "#id" })` → `.open()` / `.close()`

---

## 🗂️ Card

`brad-card` com: `--auto` · `--interactive` · `--selected` · `--selected--active` · `--dragged` ·
`--ribbon` · `--overflow-hidden` · `--has-opacity` · `--has-gradient-primary` · `--has-gradient-secondary` · `--limit-card`

Variante pronta: `brad-card-icon-title-description`

---

## ⚠️ Alert e Snackbar

`brad-alert` com tipo: `--info` · `--success` · `--warning` · `--error` · `--no-background`
Estrutura: `brad-alert__title` · `__content` · `__body` · `__icon` · `__link`

`brad-snackbar` com `--center` e demais posições.

---

## 📝 Formulário

- **Campo de texto:** `brad-text-field` com `--background` · `--on-color` · `--prompt` ·
  `__valid` · `__invalid`
- **Código (OTP):** `brad-text-field-code` com `--filled` · `--focused` · `--disabled`
- **Checkbox:** `brad-checkbox` · `brad-checkbox--on-color`
- **Upload:** `brad-input-uploader__content` e derivados
- **Calendário:** `brad-input-calendar`

---

## 🔤 Tipografia (classes utilitárias)

`brad-font-title-xl` · `-lg` · `-md` · `-sm`
`brad-font-subtitle-sm` · `-xs` · `-xxs`
`brad-font-paragraph-md` · `-sm`
`brad-font-link-md` · `-sm`
`brad-font-button` · `brad-font-default`
`brad-font-weight-bold` · `-semibold` · `-medium` · `-regular`

---

## 📐 Espaçamento

Padrão: `brad-{m|p}-{tamanho}[-{direção}]`

- `m` = margin, `p` = padding
- Tamanhos: `none` · `xs` · `sm` · `md` · `lg` · `xl`
- Direções: `t` (top) · `b` (bottom) · `l` (left) · `r` (right) · `x` (horizontal) · `y` (vertical)

Exemplos: `brad-m-md-b` · `brad-p-lg` · `brad-m-none-t` · `brad-p-sm-x`

---

## 🧱 Layout Flex

`brad-flex` · `brad-flex-column` · `brad-flex-column-reverse` · `brad-flex-grow`

**Alinhamento:** `brad-flex-align-items-center` · `-start` · `-end` · `-baseline` · `-stretch`
(e `brad-flex-align-self-*` com os mesmos sufixos)

**Justificação:** `brad-flex-justify-content-center` · `-start` · `-end` · `-between` · `-around`

> ❌ **Atenção:** é `justify-**content**-center`. Não existe `brad-flex-justify-center`.

---

## 🎨 Cor aplicada

- Fundo: `brad-bg-color-primary` · `-secondary` · `-neutral-0` … `-neutral-100`
- Texto: `brad-text-color-primary` · `-cta` · `-neutral-60` · e demais neutros
- Borda: `brad-border-color-*` · Traço: `brad-stroke-color-*`

---

## Regras ao gerar código

1. **Copie o nome exato daqui.** Não adapte para outra convenção.
2. **Traço simples vs duplo não é regra geral** — é por componente. Botão usa `brad-btn-primary`
   (simples) para hierarquia e `brad-btn--sm` (duplo) para tamanho.
3. **Modificador que não está aqui não existe.** Nada de `--block`, `--lg` em botão, `--rounded`.
4. **Painel que sobe de baixo é `brad-bottom-sheet`**, não `brad-modal`.
5. Se precisar de componente que não está neste documento, **diga isso explicitamente** em vez de
   inventar a classe. O DS completo tem ~2.900 classes; este resumo cobre as mais usadas.

### Quando o que você precisa não está aqui

**Classe inventada é pior que classe ausente** — parece que funciona e não funciona, e só aparece
quando alguém abre a tela.

O caso mais comum é ilustração: o Liquid tem **centenas** de `brad-illustration__content--*`
(nomes como `--cartao-suc-limite`, `--barra-de-progresso-ale-aumento-de-limite`) e este documento
não lista nenhuma. Vale o mesmo para ícone, gráfico e variantes raras de componente.

Nesses casos:

1. **Não escreva a classe.** Deixe o elemento sem ela.
2. Acrescente um comentário no HTML dizendo o que era esperado ali:
   `<!-- TODO: ilustração de ajuste de limite — confirmar nome exato da classe com o time de design -->`
3. Registre em **Pendências** do relatório que o nome precisa ser confirmado.
