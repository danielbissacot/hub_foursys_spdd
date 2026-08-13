# Cores

Classes, tokens CSS e valores computados das cores disponibilizadas conforme os padrões do Liquid.

# Aplicação
## Classes CSS

As classes seguem o padrão [prefixo]-color-[variante], onde a variante pode incluir modificadores de luminosidade:


| Variante base | Modificadores disponíveis |
| --- | --- |
| primary | (sem modificador), -light, -dark, -xlight, -xdark |
| secondary | (sem modificador), -light, -dark, -xlight, -xdark |
| extended-[nome] | (sem modificador), -light, -dark, -xlight, -xdark |
| neutral-[nome] | (sem modificador), -light, -dark, -xlight, -xdark |

# Tokens CSS

O token CSS de cada cor pode ser utilizado diretamente em propriedades customizadas:

```
color: var(--brad-color-primary);
background-color: var(--brad-color-secondary-light);
border-color: var(--brad-color-neutral-gray);
```
## Informações disponíveis por cor

Cada card exibe as seguintes informações, todas copiáveis ao clicar:

# Classes

| Prefixo | Uso |
| --- | --- |
| brad-bg-color-[variante] | Cor de fundo |
| brad-text-color-[variante] | Cor de texto |
| brad-border-color-[variante] | Cor de borda |

# Token CSS
```
background-color: var(--brad-color-primary);
```
Observações
## Como copiar classe ou valor

Passe o mouse por cima de qualquer item nos cards abaixo e clique para copiar o valor para a área de transferência.

# Listagem de cores
```
<section
  id="accordion-35"
  class="brad-theme-classic brad-color-doc brad-flex brad-flex-wrap brad-flex-justify-content-center brad-colors-inner--js"
></section>
```
## Copy code