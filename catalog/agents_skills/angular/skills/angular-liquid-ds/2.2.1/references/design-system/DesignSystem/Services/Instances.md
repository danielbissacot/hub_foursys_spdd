# InstancesService

É um serviço de gestão de instâncias que permite registrar, buscar e remover componentes ou objetos da aplicação de forma centralizada.

Todos os componentes da Liquid que herdam de BradBaseComponentService já se registram automaticamente no window.LiquidCorp.instances no momento em que são instanciados.

# Índice
## Acesso ao Serviço

Importante: O InstancesService não deve ser importado diretamente. Todo o acesso é feito através do namespace global window.LiquidCorp.instances.

```
const InstancesService = window.LiquidCorp.instances;
```
Uso do Javascript
```
const InstancesService = window.LiquidCorp.instances;

/**

- Exemplo de criação e registro de uma instância manualmente.
*/
class BradMyComponent {}

/**

- Registra uma instância de BradMyComponent associada ao seletor '#my-component'.
*/
InstancesService.register("#my-component", new BradMyComponent());

/**

- Recupera a instância registrada anteriormente.
*/
const instance = InstancesService.getByTargetSelector("#my-component");

/**

- Retorna todas as instâncias registradas no serviço.
*/
const allInstances = InstancesService.getAll();

/**

- Remove uma instância específica usando o seletor.
*/
InstancesService.unregister("#my-component");

/**

- Remove todas as instâncias registradas.
*/
InstancesService.unregisterAll();
```
## Comportamento do Serviço

O InstancesService armazena as instâncias em uma estrutura Map, onde cada item contém informações sobre a instância registrada.

# Métodos Disponíveis

| Método | Descrição |
| --- | --- |
| register(selector, instance) | Registra uma nova instância usando um identificador único |
| getAll() | Retorna todas as instâncias registradas |
| getByTargetSelector(selector) | Retorna uma instância específica |
| unregister(selector) | Remove uma instância específica |
| unregisterAll() | Remove todas as instâncias |

## Resultado de getAll() e getByTargetSelector()

Quando você chama getAll() ou getByTargetSelector(selector), o retorno é um objeto com a seguinte estrutura:

```
{
id: string,             // Seletor usado no registro
instance: object,        // Instância da classe/componente
name: string,            // Nome da classe da instância
createdAt: Date          // Data e hora do registro
}
```

| Campo | Tipo | Descrição |
| --- | --- | --- |
| id | string | Identificador único usado no registro |
| instance | object | O objeto instanciado (classe/componente) |
| name | string | Nome da classe da instância |
| createdAt | Date | Data e hora do registro da instância |

# Gerenciamento de Ciclo de Vida

Atenção: O InstancesService não gerencia automaticamente a exclusão de instâncias.

Ao alterar a página, navegar ou remover elementos do DOM, é necessário desregistrar manualmente as instâncias para evitar vazamentos de memória.

Se você utilizar BradBaseComponentService, o gerenciamento de destruição já estará automatizado — bastando chamar o método destroy() corretamente.

```
const InstancesService = window.LiquidCorp.instances;

/**

- Exemplo de criação e destruição manual de uma instância.
*/
class BradMyComponent {}

const myService = new BradMyComponent();

/**

- Após terminar o uso da instância, desregistrar manualmente.
*/
InstancesService.unregister("#my-component");
```
## Cenários de Uso

| Cenário | O que fazer |
| --- | --- |
| Componente removido do DOM | Chamar destroy() ou unregister(selector) |
| Troca de páginas / views | Destruir manualmente todas as instâncias antigas |

## Registro Automático via BradBaseComponentService

Todos os componentes que herdam de BradBaseComponentService se registram automaticamente no window.LiquidCorp.instances no momento em que são instanciados.

Além disso, ao chamar o método destroy(), a instância é removida automaticamente do serviço.

```
import { BradBaseComponentService } from "../../services/base/brad-base-component.service.js";

/**

- Exemplo de componente que registra automaticamente sua instância
- e depois remove no método destroy.
*/
class BradMyComponent extends BradBaseComponentService {
constructor() {
super("#my-component");
}

/**

- Método para destruir o componente e desregistrar sua instância.
*/
destroy() {
super.destroy();
}
}

/**

- Criar uma instância do componente.
*/
const instance = new BradMyComponent();

/**

- Depois, para remover corretamente a instância:
*/
instance.destroy();
```