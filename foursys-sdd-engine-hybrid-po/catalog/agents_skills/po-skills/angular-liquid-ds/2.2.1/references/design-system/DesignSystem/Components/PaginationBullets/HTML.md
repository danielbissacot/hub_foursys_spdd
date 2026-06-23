# PaginationBullets

Componente de navegação que indica a posição atual do usuário em um carrossel ou sequência de conteúdo, permitindo visualizar e controlar o progresso por meio de botões em formato de bullets.

# Uso do HTML
```
<nav id="pagination-bullets" aria-label="Paginação"></nav>
```
## Classes (estados)

| Classes (estados) | Descrição |
| --- | --- |
| brad-pagination-bullets-container--on-color | Estado de mudança de cor para fundos escuros. |

# Comportamento Javascript
## Inicialização

## Inicializar elementos do pagination-bullets

# getInstances

Utilize getInstances quando precisar criar múltiplas instâncias do componente. Retorna um array de instâncias, sendo uma para cada configuração fornecida. Passe como parâmetro um array de objetos com as opções, por exemplo: [{targetSelector: "#pagination1"}, {targetSelector: "#pagination2"}, {targetSelector: "#pagination3"}].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | "" | ID vinculado ao HTML do componente |
| totalPages | number | 1 | Número total de páginas disponíveis para navegação |
| currentPage | number | 1 | Número da página atual selecionada (baseado em 1) |


A partir da instância criada, é possível controlar o componente utilizando o targetSelector configurado (exemplo: #pagination-bullets).

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço para gerenciar o componente vinculado ao seletor especificado nas opções. |
| getInstances | [Options] | Cria múltiplas instâncias do serviço, uma para cada objeto de opções fornecido no array. |
| setPage | number | Define qual página deve ser exibida como ativa. |
| updateTotalPages | number | Atualiza o número total de páginas. Se a página atual exceder o novo total, ajusta automaticamente para a última página disponível. |

# EventListeners

Lembrando que para o uso dos listeners é necessário passar pelo processo de e :


| Elemento | Método | Evento | Descrição |
| --- | --- | --- | --- |
| service.component | addEventListener | "pageChanges" | Evento disparado ao alterar brad-current-page. |

# Uso básico
```
const id = "pagination-bullets";
const service = BradPaginationBulletsService.getInstance({
  targetSelector: `#${id}`,
  totalPages,
  currentPage: initialPage,
});

/* eventListener customizado, usado para obter informações do bottom-sheet */
service.component.addEventListener("pageChanges", (e) =>
  console.log({ detail: e.detail })
);
```
## Acessibilidade

Este componente foi desenvolvido seguindo as melhores práticas de acessibilidade, garantindo uma experiência inclusiva para todos os usuários. Nenhuma configuração adicional é necessária.

# Exemplos
Default
```
<nav id="pb-81" aria-label="Paginação" class=""></nav>
```