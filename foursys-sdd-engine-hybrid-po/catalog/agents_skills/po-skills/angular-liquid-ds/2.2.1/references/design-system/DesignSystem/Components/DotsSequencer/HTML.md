# Dots Sequencer

É um componente que anima uma sequência de dots (bolinhas) de forma automática e responsiva, ideal para indicadores de carregamento, apresentações ou elementos visuais dinâmicos.

# Uso do HTML
## Estrutura básica

O componente requer uma estrutura HTML simples com um container principal e elementos dots internos:

```
<div id="brad-dots-sequencer" class="brad-dots"></div>
```
## Geração automática de dots

O componente pode gerar automaticamente os dots com base na propriedade count nas opções de inicialização, dispensando a criação manual dos elementos HTML.

# Responsividade

O componente utiliza IntersectionObserver para pausar/retomar a animação automaticamente quando sai/entra na viewport, otimizando a performance e respeitando as preferências de movimento reduzido do usuário (prefers-reduced-motion).

# Comportamento Javascript
## Inicialização

A inicialização é necessária para configurar o sequenciamento dos dots e suas animações. O componente oferece diferentes opções para controlar o comportamento da animação.

```
const targetSelector = "#brad-dots-sequencer";
const options = {
targetSelector,
count: 5,
sequence: [3, 2, 3, 1, 3, 1, 2],
autoStart: true,
useObserver: true,
resumeFromLastStep: true
};
const service = LiquidCorp.BradDotsSequencerService.getInstance(options);
```
## Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| count | number | 3 | Quantidade de dots gerados automaticamente |
| sequence | number[] | [3,2,3,1,3,1,2] | Sequência 1-based dos dots a serem animados |
| autoStart | boolean | true | Inicia automaticamente se o componente estiver visível |
| useObserver | boolean | true | Pausa/retoma animação quando fora/dentro da viewport via IntersectionObserver |
| resumeFromLastStep | boolean | true | Retoma do último passo ao voltar a ficar visível |

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| start | - | Inicia a animação da sequência de dots |
| stop | - | Para a animação e reseta o estado dos dots |
| destroy | - | Destroi a instância, removendo listeners e limpando referências |

# Acessibilidade

O componente respeita automaticamente as preferências de movimento reduzido do usuário (prefers-reduced-motion: reduce), pausando todas as animações quando essa configuração está ativa. Para melhor acessibilidade, considere adicionar atributos ARIA apropriados ao contexto de uso:

```
<div
id="loading-dots"
class="brad-dots"
aria-label="Carregando conteúdo"
role="status"
aria-live="polite">
</div>
```
Exemplo
```
<div id="S619303706382" class="brad-dots"></div>
```