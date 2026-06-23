# BottomSheet

Superfície fixada na parte inferior da tela que sobrepõe todos os demais elementos da tela e, pode disponibilizar ao usuário ações ou informações complementares ao contexto atual.

Versão do componente que permanece estática na tela enquanto o usuário pode interagir com outros elementos da interface fora do bottom sheet. Este formato complementa o conteúdo da tela e agrupa informações ou ações de maneira sempre acessível.

# Uso do Web Component

O Accordion web component possui vários componentes utilitários que ajudam a construir vários casos de uso.


| Nome | Tipo | Obrigatório | Conteúdo Dinâmico | Descrição |
| --- | --- | --- | --- | --- |
| brad-bs | Componente | Sim | Sim | Agrupa todos os outros componentes do bottom-sheet |
| brad-bs-header | Sub-componente | Sim | Sim | Cabeçalho do bottom-sheet |
| brad-bs-title | Sub-componente | Não | Sim | Título do bottom-sheet. |
| brad-bs-close | Sub-componente | Não | Sim | Botão de fechar do bottom-sheet. |
| brad-bs-content | Sub-componente | Não | Sim | Conteúdo do bottom-sheet. |

# Propriedades
## brad-bs

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | boolean |  | Id necessário para o funcionamento |
| brad-state | "fixed", "modal" | "fixed" | Tipo do bottom-sheet |

# Comportamento Javascript

O comportamento do javascript segue o mesmo do componente HTML, para ver a documentação completa:

BottomSheet - Fixed.

BottomSheet - Modal.

```
<script>
  const bottomSheet = document.getElementById('bs-id');
  const btnClose = document.querySelector("[brad-bs-close]");

  btnClose.addEventListener("click", () => {
    bottomSheet.service.close();
  });
</script>

<brad-bs id="bs-id" brad-state="modal">
  <brad-bs-header>
    <h2 brad-bs-title class="brad-font-title-md">Título</h2>

    <button
      brad-bs-close
      aria-label="Fechar bottom-sheet"
    ></button>
  </brad-bs-header>

  <brad-bs-content>Conteúdo</brad-bs-content>
</brad-bs>
```
## Acessibilidade

O comportamento da acessibilidade segue o mesmo do componente HTML, para ver a documentação completa:

BottomSheet - Fixed.

BottomSheet - Modal.

Para o uso do serviço dentro do web component, utilizar como no exemplo:

# Exemplos

Para o uso do bottom-sheet é importante seguir a logica de implementação do código, inserir todas as tags obrigatorias na ordem conforme o exemplo.

```
<button class="brad-btn brad-btn brad-btn-primary bs-124">
  Abrir bottom-sheet
</button>

<brad-bs id="bs-124" brad-state="fixed">
  <brad-bs-header>
    <h2 brad-bs-title class="brad-font-title-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a orci bibendum, tristique nisl efficitur, accumsan velit.</h2>

    
  <button brad-bs-close aria-label="Fechar bottom-sheet"></button>

  </brad-bs-header>

  <brad-bs-content>
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
</brad-bs-content>
</brad-bs>
```