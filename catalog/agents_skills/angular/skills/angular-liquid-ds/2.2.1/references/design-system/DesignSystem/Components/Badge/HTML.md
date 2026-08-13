# Badge

É um componente que sinaliza que uma ou mais informações estão disponíveis dentro de um certo grupo, como por exemplo: notificações.

# Uso do HTML
## Estilos predefinidos

# brad-cc-extended-red--[0]

# 9

# brad-cc-extended-red-dark--[0]

# 9

## brad-cc-extended-red-xlight--[0]

# 9

# brad-cc-extended-green--[0]

# 9

## brad-cc-extended-green-dark--[0]

# 9

## brad-cc-extended-green-xlight--[0]

# 9

# brad-cc-extended-blue--[0]

# 9

## brad-cc-extended-blue-dark--[0]

# 9

## brad-cc-extended-blue-xlight--[0]

# 9

# brad-cc-extended-yellow--[0]

# 9

## brad-cc-extended-yellow-dark--[0]

# 9

## brad-cc-extended-yellow-xlight--[0]

# 9

# brad-cc-extended-purple--[0]

# 9

## brad-cc-extended-purple-dark--[0]

# 9

## brad-cc-extended-purple-xlight--[0]

# 9

# brad-cc-extended-violet--[0]

# 9

## brad-cc-extended-violet-dark--[0]

# 9

## brad-cc-extended-violet-xlight--[0]

# 9

# brad-cc-extended-salmon--[0]

# 9

## brad-cc-extended-salmon-dark--[0]

# 9

## brad-cc-extended-salmon-xlight--[0]

# 9
## Dot

É um componente que sinaliza informações disponíveis dentro de um certo grupo, esse tipo (dot) não determina a quantidade de informações, apenas sinaliza. Normalmente utilizado para sinalizar notificações.

```
<div
  id=R407472133338
  class="
  brad-badge
  brad-badge--dot
  brad-cc-extended-red--[0]"
></div>
```
## Como modificar cores

Utilize as classes dos na div que contém a classe brad-badge.

# Number

É um componente que da destaque a uma informação de texto, utilizado para sinalizar algo importante ou categorizar itens ou agrupamentos dentro de um contexto.

```
<div
  id=C395480744502
  class="
  brad-badge
  brad-badge--number
  brad-cc-extended-red--[0]"
  aria-label="99+"
  role="text"
>
  <label aria-hidden="true" id="label">99</label>
</div>
```
## Responsividade

A largura do componente é 100% do elemento pai, ou seja, caso queira modificar o tamanho, só determinar no container que o componente estiver.

Caso queira que o componente tenha o tamanho do seu texto, é só colocar display: flex; no container que o componente estiver.

# Borda

A borda é por padrão da cor brad-color-neutral-0 caso queira retirar a borda utilize a classe brad-badge--without-border.

# Comportamento Javascript
## Inicialização

A inicialização é necessária apenas para uso da badge tipo number com limitação de caracteres. Conforme documentado em design, o valor máximo atribuído à badge não deve exceder 3 caracteres numéricos e o símbolo "+". Caso a option maxValue receba valor com mais de 3 caracteres, ele será automaticamente substituído por 999 para atender ao documentado.

```
const targetSelector = "#my-badge";
const value = 22;
const maxValue = 100;
const options = { targetSelector, value, maxValue };
const service = LiquidCorp.BradBadgeService.getInstance(options);
```
## Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| value | number | - | valor inicial do componente |
| maxValue | number | 999 | valor máximo atribuído ao componente |

# Metódos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| updateValue | number | Atualiza o valor da badge |

# Acessibilidade

O componente já tem em seu exemplo HTML os atributos de acessibilidade aria-hidden="true" e role="text" que devem ser mantidos para que o leitor de telas leia corretamente o atributo aria-label, também já incluso no exemplo. O uso do tabindex pode ser necessário, avalie em sua jornada.

```
<div
class="
  brad-badge
  brad-badge--number
  brad-cc-extended-red--[0]"
"
aria-label="9 notificações"
role="text"
tabindex="0"></div>
```
```
<label aria-hidden="true">9</label>
```
Exemplos
Dot
```
<div
  id=R407472133338
  class="
  brad-badge
  brad-badge--dot
  brad-cc-extended-red--[0]"
></div>
```
Number
```
<div
  id=C395480744502
  class="
  brad-badge
  brad-badge--number
  brad-cc-extended-red--[0]"
  aria-label="99+"
  role="text"
>
  <label aria-hidden="true" id="label">99</label>
</div>
```