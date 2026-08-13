# BottomSheetExpansive

Superfície fixada na parte inferior da tela que sobrepõe todos os demais elementos da tela e, pode disponibilizar ao usuário ações ou informações complementares ao contexto atual. Essa é uma versão expansível que permanece presente na base da tela, fechado ou aberto. Este modelo tem o comportamento do toque que abre e fecha totalmente o BottomSheet.

## Atenção: o componente já esta fixado no fim desta página ⚠️

# Uso do Web Component

O Accordion web component possui vários componentes utilitários que ajudam a construir vários casos de uso.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-bs-expansive | Componente | Sim | Sim | Agrupa todos os outros componentes do bottom-sheet |
| brad-bs-expansive-header | Sub-componente | Sim | Sim | Cabeçalho do bottom-sheet |
| brad-bs-expansive-title | Sub-componente | Sim | Sim | Título do bottom-sheet. |
| brad-bs-expansive-content | Sub-componente | Sim | Sim | Conteúdo do bottom-sheet. |

# Propriedades
## brad-bs

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | "" | Id necessário para o funcionamento |
| brad-state | "tap", "drag" | "tap" | Tipo do componente |
| brad-max-height | number | 100 | Altura máxima que o componente pode abrir - permitido valor entre 0 e 100 |
| brad-overlay-opacity-class | string | "brad-bg-overlay-40" | Altera intensidade do overlay conforma a documentação do overlay |
| brad-disable-click-outside-close | boolean | false | Desativa o método de fechar o componente ao clicar no overlay |
| brad-enable-body-scroll | boolean | false | Determina que ao abrir o overlay terá rolagem na página |
| brad-is-leaving-screen-mode | boolean | false | Nesse modo, o componente ficará totalmente escondido enquanto estiver com o conteúdo fechado |

# brad-bs-expansive-header

O brad-bs-expansive-title deve estar dentro do brad-bs-expansive-header

# Comportamento Javascript

O comportamento do javascript segue o mesmo do componente HTML, para ver a documentação completa:

BottomSheet Expansive - Tap.

BottomSheet Expansive - Drag.

```
<script>
  const bsExpansive = document.getElementById('bs-id');

  bsExpansive.addEventListener("opened", () => {
    console.log("Bottom-sheet aberto");
  });

  bsExpansive.addEventListener("closed", () => {
    console.log("Bottom-sheet fechado");
  });

  bsExpansive.service.eOverlay.addEventListener("open", () => {
    console.log("Overlay aberto");
  });

  bsExpansive.service.eOverlay.addEventListener("close", () => {
    console.log("Overlay fechado");
  });
</script>

<brad-bs-expansive id="bs-id" brad-state="tap" brad-max-height="80" brad-overlay-opacity-class="brad-bg-overlay-40">
  <brad-bs-expansive-header aria-label="Expansive label">
    <h1 brad-bs-expansive-title class="brad-font-subtitle-sm">Título</h1>
  </brad-bs-expansive-header>

  <brad-bs-expansive-content>
    Conteúdo
  </brad-bs-expansive-content>
</brad-bs-expansive>
```
## Acessibilidade

O comportamento da acessibilidade segue o mesmo do componente HTML, para ver a documentação completa:

BottomSheet Expansive - Tap.

BottomSheet Expansive - Drag.

# Exemplo

Para o uso do bottom-sheet é importante seguir a logica de implementação do código, inserir todas as tags obrigatorias na ordem conforme o exemplo.

```
<brad-bs-expansive
  id="bs-50"
  brad-state="tap"
  brad-max-height="80"
  brad-overlay-opacity-class="brad-bg-overlay-40"
>
  <brad-bs-expansive-header aria-label="Expansive label">
    <h1 brad-bs-expansive-title class="brad-font-subtitle-sm">Header Title</h1>
  </brad-bs-expansive-header>

  <brad-bs-expansive-content> 
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a orci
    bibendum, tristique nisl efficitur, accumsan velit. Ut vel mi accumsan,
    semper quam quis, mollis lectus. Phasellus eu ipsum posuere, varius elit
    a, tincidunt tortor. Aenean eleifend libero nec risus efficitur, id semper
    ex vestibulum. Curabitur ac aliquet leo. Ut non porta lacus, eu hendrerit
    neque. Maecenas ac lacinia enim. Aenean eu vestibulum massa. In quam arcu,
    porta at justo ac, mattis pulvinar ipsum. Lorem ipsum dolor sit amet,
    consectetur adipiscing elit. Nullam a orci bibendum, tristique nisl
    efficitur, accumsan velit. Ut vel mi accumsan, semper quam quis, mollis
    lectus. Phasellus eu ipsum posuere, varius elit a, tincidunt tortor.
    Aenean eleifend libero nec risus efficitur, id semper ex vestibulum.
    Curabitur ac aliquet leo. Ut non porta lacus, eu hendrerit neque. Maecenas
    ac lacinia enim. Aenean eu vestibulum massa. In quam arcu, porta at justo
    ac, mattis pulvinar ipsum. Lorem ipsum dolor sit amet, consectetur
    adipiscing elit. Nullam a orci bibendum, tristique nisl efficitur,
    accumsan velit. Ut vel mi accumsan, semper quam quis, mollis lectus.
    Phasellus eu ipsum posuere, varius elit a, tincidunt tortor. Aenean
    eleifend libero nec risus efficitur, id semper ex vestibulum. Curabitur ac
    aliquet leo. Ut non porta lacus, eu hendrerit neque. Maecenas ac lacinia
    enim. Aenean eu vestibulum massa. In quam arcu, porta at justo ac, mattis
    pulvinar ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nullam a orci bibendum, tristique nisl efficitur, accumsan velit. Ut vel
    mi accumsan, semper quam quis, mollis lectus. Phasellus eu ipsum posuere,
    varius elit a, tincidunt tortor. Aenean eleifend libero nec risus
    efficitur, id semper ex vestibulum. Curabitur ac aliquet leo. Ut non porta
    lacus, eu hendrerit neque. Maecenas ac lacinia enim. Aenean eu vestibulum
    massa. In quam arcu, porta at justo ac, mattis pulvinar ipsum. Lorem ipsum
    dolor sit amet, consectetur adipiscing elit. Nullam a orci bibendum,
    tristique nisl efficitur, accumsan velit. Ut vel mi accumsan, semper quam
    quis, mollis lectus. Phasellus eu ipsum posuere, varius elit a, tincidunt
    tortor. Aenean eleifend libero nec risus efficitur, id semper ex
    vestibulum. Curabitur ac aliquet leo. Ut non porta lacus, eu hendrerit
    neque. Maecenas ac lacinia enim. Aenean eu vestibulum massa. In quam arcu,
    porta at justo ac, mattis pulvinar ipsum.
   </brad-bs-expansive-content>
</brad-bs-expansive>
```