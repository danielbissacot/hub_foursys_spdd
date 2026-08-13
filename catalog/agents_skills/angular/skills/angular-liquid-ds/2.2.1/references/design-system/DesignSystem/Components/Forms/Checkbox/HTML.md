# Checkbox

É um componente que pode ser apresentado em conjunto ou sozinho e que permite única ou múltipla seleção.

# Suporte por dispositivo

| DEVICE | FUNCIONAL | RECOMENDADO |
| --- | --- | --- |
| Mobile | Sim | Sim |
| Tablet | Sim | Sim |
| Desktop | Sim | Sim |

# Uso do HTML
```
<label class="brad-checkbox brad-flex-row brad-flex-align-items-start  brad-m-lg-b">
<input id="checkbox" type="checkbox" name="group" />
<span class="checkmark"></span>
<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</p>
</label>
```
Estilos
## OnColor

O modo OnColor é uma solução para obter maior contraste para elementos visuais e componentes aplicados em fundo escuro e colorido. Este modo torna possível atender ao contraste mínimo recomendado pela WCAG.

```
<label class="brad-checkbox brad-checkbox--on-color brad-flex-row brad-flex-align-items-start  brad-m-lg-b">
<input id="checkbox" type="checkbox" name="group" />
<span class="checkmark"></span>
<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</p>
</label>
```
Comportamento Javascript
## Inicialização

## Inicialização não é necessária (componente nativo)

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Descrição |
| --- | --- |
| indeterminate | A caixa de seleção está parcialmente marcada ou indeterminada. |

# Uso básico
```
// para ativar/desativar o modo parcial é necessário o seguinte javascript (nativo)
const id = "checkbox";
document.getElementById(id).indeterminate = true; // true (ativar indeterminate) ou false (desativar indeterminate);
```
## Acessibilidade

O checkbox nativo, tem dois estados ("checked", ou "unchecked"), com um estado "indeterminate" configurado via JavaScript (), e da mesma forma, para acessibilidade, temos três valores para o atributo aria-checked que são checked, true, false e mixed.

E para a acessibilidade funcionar corretamente recomendasse que junto ao <input id="checkbox" type="checkbox" name="group" /> adicione a seguinte propriedade/valor role="checkbox".

E por fim, o desenvolvedor é obrigado a alterar o valor do atributo aria-checked dinamicamente quando a caixa de seleção é alterada entre checked/unchecked/indeterminate.

# Atributos

| attr | Descrição |
| --- | --- |
| aria-checked="true" ou aria-checked="checked" | A caixa de seleção está marcada. |
| aria-checked="false" | A caixa de seleção não está marcada. |
| aria-checked="mixed" | A caixa de seleção está parcialmente marcada ou indeterminada. |

# Exemplo
```
<section class="brad-m-lg-b">
  <div class="examples">
    <label
      class="brad-checkbox  brad-flex-row brad-flex-align-items-start  brad-m-sm-b"
    >
      <input
        id="checkbox-395"
        type="checkbox"
        name="group"
        
        
      />
      <span class="checkmark"></span>
      <p>1. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</p>
    </label>

    <label
      class="brad-checkbox  brad-flex-row brad-flex-align-items-start  brad-m-lg-b"
    >
      <input type="checkbox" name="group"  />
      <span class="checkmark"></span>
      <p>2. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</p>
    </label>

    <button
      onclick="window.document.getElementById('checkbox-395').indeterminate = !window.document.getElementById('checkbox-395').indeterminate;"
      class="brad-btn brad-btn-primary"
    >
      CHANGE MODE (PARTIAL)!
    </button>
  </div>
</section>
```