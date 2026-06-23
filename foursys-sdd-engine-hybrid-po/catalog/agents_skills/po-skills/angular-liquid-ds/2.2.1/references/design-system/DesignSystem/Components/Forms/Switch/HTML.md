# Switch

É um componente que permite ao usuário alternar entre duas opções, não necessitando um outro botão para confirmar a concordância ou a discordância.

# Uso do HTML
```
<div
class="brad-switch brad-flex-row brad-flex-align-items-start  brad-font-paragraph-sm"
>
<input id="switch" type="checkbox" />
<label
  for="switch"
  class="interrupter"
  aria-label="aria-label"
  role="checkbox"
  aria-checked="false"
  aria-disabled="false"
></label>
</div>
```
Estilos
## OnColor

O modo OnColor é uma solução para obter maior contraste para elementos visuais e componentes aplicados em fundo escuro e colorido. Este modo torna possível atender ao contraste mínimo recomendado pela WCAG.

```
<div
class="brad-switch brad-switch--on-color brad-flex-row brad-flex-align-items-start  brad-font-paragraph-sm"
>
<input id="switch" type="checkbox" />
<label
  for="switch"
  class="interrupter"
  aria-label="aria-label"
  role="checkbox"
  aria-checked="false"
  aria-disabled="false"
></label>
</div>
```
Comportamento Javascript
## Inicialização

## Inicialização não é necessária (componente nativo)

# Acessibilidade

É necessário incluir os atributos role="switch" e aria-label com as informações contidas no conteúdo do switch, ao elemento de label. Certifique-se também, de adicionar type="checkbox" ao elemento de input. Assim, a leitura será realizada conforme esperado.

```
<div class="brad-theme-classic">
<section class="brad-m-lg-b">
  <div class="examples">
    <div class="brad-switch  brad-flex-row brad-flex-align-items-start ">
      <input id="switch-199" type="checkbox" />
      <label
        for="switch-199"
        class="interrupter"
        aria-label="Conteúdo"
        role="switch"
        aria-checked="false"
        aria-disabled="false"
      >
      </label>
      <p class="brad-switch__label brad-font-paragraph-sm">Conteúdo</p>
    </div>
  </div>
</section>
</div>
```
Exemplo
Switch
```
<section class="brad-m-lg-b">
  <div class="examples">
    <div
      class="brad-switch  brad-flex-row brad-flex-align-items-start "
    >
      <input id="switch-403" type="checkbox"   />
      <label
        for="switch-403"
        class="interrupter"
        aria-label="Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source."
        role="switch"
        aria-checked="false"
        aria-disabled="false"
      >
      </label>
      <p class="brad-switch__label brad-font-paragraph-sm">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</p>
    </div>
  </div>
</section>
```