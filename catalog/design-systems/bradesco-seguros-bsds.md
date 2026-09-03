# Design System Bradesco Seguros — BSDS (`@bsds-lib-component`)

Extraído do índice oficial do Storybook em 03/09/2026:
`https://static.bradescoseguros.com.br/@bsds-lib-component/storybook/`

> **Este documento lista os nomes REAIS de componente.** Se um `bsds-*` não estiver aqui,
> provavelmente não existe — confirme no Storybook antes de usar. **Não invente componente por
> analogia** com o Liquid (`brad-*`) nem com Material/PrimeNG: são bibliotecas diferentes.
>
> ⚠️ **BSDS ≠ Liquid.** O Liquid Bradesco é baseado em **classes CSS** (`brad-btn-primary`).
> O BSDS é baseado em **Web Components** (`<bsds-button>`). Não misture os dois no mesmo projeto
> sem confirmar com o time — e nunca aplique classe `brad-*` num componente `bsds-*`.

## Integração

A biblioteca é distribuída pelo **Nexus Corporativo** (não é pacote público do npm).
Confirme com o time a URL do registry e a versão antes de instalar — não presuma.

O Storybook documenta três caminhos de instalação:

| Caminho | Onde está documentado |
|---|---|
| **Angular — Standalone** | `Documentação / Como usar / Angular / Standalone` |
| **Angular — NgModule** | `Documentação / Como usar / Angular / Modules` |
| **React** | `Documentação / Como usar / React / Instalação` |
| **CDN / pacotes** | `Documentação / Como usar / Pacotes e CDN` |

Como são Web Components, o Angular exige `CUSTOM_ELEMENTS_SCHEMA` no módulo (ou no componente
standalone) que os utiliza. Confirme a forma exata na página de instalação do Storybook.

---

## 🎨 Temas

O BSDS tem **múltiplos temas**, não apenas um. Confirme qual o projeto usa antes de escrever CSS:

- **Tema Padrão** · **Tema Padrão Antigo**
- **Tema BSC** · **Tema BSC Antigo**
- **Tema Concierge**
- **Tema Saúde**

Personalização acontece por **variáveis CSS** e por **Shadow Parts CSS** (`::part()`), documentados
em `Documentação / Tema`. Como os componentes usam Shadow DOM, **CSS externo não atravessa o
componente** — estilizar por seletor de descendente não funciona; use `::part()` ou as variáveis.

## 📐 Tokens

Categorias de token documentadas (valores exatos no Storybook, em `Documentação / Tokens`):

`border-radius` · `espessura da borda` · `estilo da borda` · `margin` · `padding` · `sombra`

Tipografia tem seção própria, com importações CSS específicas (`Documentação / Tipografia`).

## 🧰 Utilitários CSS

O BSDS traz utilitários próprios, documentados em `Documentação / Utilitários CSS`:

`breakpoints` · `display` · `utilitários flex` · `elementos flutuantes` · `dimensionamento` ·
`modificadores de texto` · `alinhamento vertical` · `espaçamentos`

---

## 🧩 Componentes (lista completa e real)

### Botão — 9 variantes distintas
| Componente | Uso |
|---|---|
| `bsds-button` | Botão padrão. Suporta cores múltiplas, `fill`, estado de **loading**, e slots no início/fim |
| `bsds-round-button` | Botão redondo — tem `fill` e tamanhos |
| `bsds-floating-button` | FAB. Variantes com/sem ícone, com QR Code, hover, conteúdo longo |
| `bsds-navigation-button` | Navegação — cores múltiplas e modo link |
| `bsds-category-nav-button` | Navegação por categoria — modo link e listagem |
| `bsds-contact-button` | Contato — cores múltiplas, variantes de `fill`, modo link |
| `bsds-service-button` | Serviço — badge, badge com pin, ícones, âncora, acessibilidade |
| `bsds-enterprise-button` | Empresarial — estados "não contratado", resumo, acessibilidade |
| `bsds-wallet-button` | Carteira — modo sistema, expandir, ação |

### Formulários
| Componente | Recursos documentados |
|---|---|
| `bsds-input` | `types`, slot de label, botão de limpar, texto de erro, validador, slots início/fim, somente-leitura, slot externo |
| `bsds-input-otp` | Tipo, comprimento, valor, separadores, estados, `pattern` |
| `bsds-input-password-toggle` | Alternar visibilidade de senha |
| `bsds-input-search` | Busca com `labelKey`, ignorar caixa, ignorar acentos, `matchFrom`, limite |
| `bsds-select` | Múltipla escolha, único, interfaces **popover / none / modal**, slots, erro, somente-leitura |
| `bsds-textarea` | Contador de caracteres, `autogrow`, readonly/disabled, erro |
| `bsds-checkbox` | Tamanho pequeno, desabilitado, posicionamento do label, marcado, **indeterminado**, texto de apoio |
| `bsds-radio` / `bsds-radio-group` | Erro, tamanho pequeno, desabilitado, posicionamento do label, validação no grupo |
| `bsds-calendar` | Data mín/máx, desabilitar sábados/domingos/fins de semana, datas desabilitadas, datas habilitadas, erro, somente-leitura |

### Navegação e estrutura
| Componente | Uso |
|---|---|
| `bsds-app` | Contêiner raiz da aplicação |
| `bsds-header` | Cabeçalho — stepper, botão voltar, área inferior, imagem, slot final |
| `bsds-simple-header` | Cabeçalho simples — com texto, responsivo |
| `bsds-breadcrumbs` / `bsds-breadcrumb` | Trilha — com fundo, cores |
| `bsds-pagination` | Paginação — com dica, seta dupla |
| `bsds-segment` + `bsds-segment-button` + `bsds-segment-content` + `bsds-segment-view` | Abas — rolável, com tema, tamanhos |
| `bsds-dropdown-menu` | Menu — interface popover/none, múltiplo, tamanhos, cores |

### Conteúdo e feedback
| Componente | Uso |
|---|---|
| `bsds-accordion` / `bsds-accordion-group` | Expandir, múltiplo, alternar, desabilitado, somente-leitura, menu, com badge, variantes |
| `bsds-modal` | Modal e **sheet** (folha inferior), com imagem, título no header |
| `bsds-alert` | Alerta com variantes |
| `bsds-banner` | Banner |
| `bsds-badge` | Cores múltiplas, versão *soft*, tamanhos |
| `bsds-chip` | Variantes, grupo interativo, tamanhos |
| `bsds-list` / `bsds-item` | Lista e item — `inset`, linhas, slots, remoção de padding |
| `bsds-link` | Link — texto longo, ícones, tamanhos |

### Ícones
Pacote de ícones próprio, com galeria e página de uso (`Pacote de Ícones`).

## 🔌 Integrações de terceiros suportadas

O Storybook documenta integração oficial com: **ApexCharts**, **Chart.js**, **ngx-lottie** e
**SwiperJS**. Prefira esses ao escolher gráfico, animação ou carrossel neste Design System.

---

## ⚠️ Regras ao gerar código com BSDS

1. **Use apenas os `bsds-*` listados acima.** Não invente variante (`bsds-primary-button`,
   `bsds-card`, `bsds-table` não aparecem no índice — não existem).
2. **Shadow DOM:** não tente estilizar por dentro com CSS comum. Use `::part()` ou variáveis CSS.
3. **Angular:** Web Component exige `CUSTOM_ELEMENTS_SCHEMA`. Sem isso o build acusa
   *"is not a known element"*.
4. **Tema:** confirme qual dos seis temas o projeto usa antes de definir cor — não presuma o padrão.
5. **Propriedades exatas:** este documento lista os **recursos** que cada componente tem
   (ex.: `bsds-textarea` tem contador e autogrow), mas **não os nomes exatos de atributo**.
   Confirme no Storybook do componente antes de escrever o atributo — não deduza.
6. **Não misture com o Liquid** (`brad-*`). São bibliotecas distintas, de produtos distintos
   (Bradesco Seguros × Bradesco Banco).
