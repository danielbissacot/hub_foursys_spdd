# RELEASE NOTES

Acompanhe as últimas versões para atualizações em seu projeto.

# Publicada em 15/04/2026

# Versão 2.2.1
Correções
Serviços
Ajustamos um problema na exportação de serviços, garantindo que BradComponentToggleService e BradAnimationService passem a ser exportados e consumidos corretamente.
Animation
Ajustamos a URL base utilizada na importação do arquivo JSON de animação, garantindo o carregamento correto dos recursos.

# Publicada em 24/03/2026

# Versão 2.2.0
Visualizar documentação
Correções
Accordion
Corrigida a abertura de accordions no template Accordion Selectable Header (template de exemplo com elementos selecionáveis no cabeçalho).
TextFieldSelect
Problema: Ao filtrar opções digitando no campo e selecionar um item, o dropdown mantinha o estado de filtro anterior quando reaberto, exibindo apenas os itens filtrados ao invés da lista completa.
Solução: O estado de filtro agora é corretamente resetado após a seleção de um item, garantindo que todas as opções sejam exibidas ao reabrir o dropdown.
Impacto: Melhora a experiência do usuário ao permitir navegação completa pelas opções em múltiplas interações com o componente.
Novos Recursos
Web Components
Estamos disponibilizando a versão Web Component para todos os componentes do design system que fazem sentido nesta arquitetura. Esta melhoria traz maior flexibilidade, encapsulamento e interoperabilidade para aplicações que utilizam o Liquid Design System.
O que isso significa? Os componentes agora podem ser utilizados como Custom Elements nativos, seguindo o padrão Web Components, permitindo:
Encapsulamento nativo: Shadow DOM para isolamento de estilos e comportamento
Compatibilidade cross-framework: Funciona em qualquer framework ou aplicação vanilla
API declarativa: Configuração via atributos HTML padrão
Ciclo de vida nativo: Uso de callbacks do navegador (connectedCallback, attributeChangedCallback, etc.)
Tipagem completa: Definições TypeScript para todos os componentes
Melhorias
Tipagem completa via NPM
Os seguintes componentes agora possuem tipagem completa via NPM, garantindo melhor integração com TypeScript, maior segurança de tipos e suporte aprimorado para ferramentas de desenvolvimento:
PaginationBullets
Tipos disponibilizados: BradPaginationBulletsService, BradPaginationBulletsServiceOptions e PageChangesEventDetail
Breadcrumbs
Tipos disponibilizados: BradBreadcrumbsService, BradBreadcrumbsServiceOptions, BradBreadcrumbsTypeEnum e BradBreadcrumbsTypeEnum
DotsSequencer
Tipos disponibilizados: BradDotsSequencerService e BradDotsSequencerServiceOptions
BottomSheet
Tipos disponibilizados: BradBottomSheetService, BradBottomSheetServiceOptions e BradBottomSheetState
OverlayDefault
Tipos disponibilizados: BradOverlayServiceDefault, BradOverlayDefaultOptions e OverlayOpacityType
BottomSheetExpansive
Tipos disponibilizados: BradBottomSheetExpansiveService, BradBottomSheetExpansiveOptions, BradBottomSheetExpansiveStateEnum
DragAndDrop
Adicionado o modo collapse como uma variante opcional do componente. Esse modo oferece uma experiência visual aprimorada durante o arraste, com animações de morphing e reordenação dos itens em tempo real.
Ícones
Novos ícones:
icon-filetype-ID
icon-miscellaneous-servico-assinatura
icon-filetype-document-nfe
icon-filetype-document-cte
icon-filetype-document-nfce
icon-filetype-document-nfse
Ícones alterados:
## icon-filetype-document-NF

# Publicada em 13/03/2026

# Versão 2.1.0
Visualizar documentação
Chat
Adicionada animação de entrada no balão de digitação do componente Chat
Adicionada a funcionalidade de balão de digitação ao componente Chat, permitindo indicar visualmente quando um usuário está digitando.
DotsSequencer
Novo componente para animação de bolinhas em estados de carregamento, processamento ou digitação.
Badge
O componente Badge agora possui tipagem completa via NPM, garantindo melhor integração com TypeScript, maior segurança de tipos e suporte aprimorado para ferramentas de desenvolvimento.
Tipos disponibilizados: BradBadgeService, BradBadgeServiceOptions e BradBadgeTypeEnum
HideText
O componente HideText agora possui tipagem completa via NPM, garantindo melhor integração com TypeScript, maior segurança de tipos e suporte aprimorado para ferramentas de desenvolvimento.
Tipos disponibilizados: BradHideTextService e BradHideTextServiceOptions
Rating
Implementação de tipagem completa com interfaces BradRatingServiceOptions, BradCurrentRatingResult e BradRatingSizeType.
TextField
Ajustes de estilos (cores e espaçamentos) conforme documentação atualizada de UI/UX.
Modal e Dialog
Revisão da documentação dos componentes, com foco em clareza e melhor compreensão da implementação.
Chart (donut)
Adicionado novo parâmetro `showPercentage` para controlar exibição de porcentagens (padrão: true) no gráfico do tipo donut.
Adicionado novos ícones
'filetype-document-NF'
'financial-credito-consignado'
'financial-crypto-currency'
'investimento-carrinho
'miscellaneous-ai'
'miscellaneous-barco-yacths'
## 'miscellaneous-bem-estar'

# Publicada em 04/03/2026

# Versão 2.0.6
Visualizar documentação
Ilustrações
Ajuste de regra no consumo de ilustrações para atender um número maior de donínios de projetos.

# Publicada em 10/02/2026

# Versão 2.0.5
Visualizar documentação
Ilustrações
Adiciona nova regra de domínio.

# Publicada em 02/02/2026

# Versão 2.0.4
Visualizar documentação
BradOverlayMask
Melhorias na documentação e criação de novos eventos de callback para melhor funcionamento em ações do overlay (abrir, finalizar animação e fechar).
BradPopover
Remoção de métodos redundantes que causavam bugs e melhorias gerais no código.
BradTextFieldQuantity
Implementação de MutationObserver para sincronizar o atributo `value` com o funcionamento de frameworks externos.
BradSlider
Inclusão de controles para os atributos do componente Slider no Storybook.
BradBreadcrumbs
Ajuste na cor da seta exibida após o botão de overflow no componente Breadcrumbs quando utilizado no modo on-color, garantindo melhor contraste e consistência visual.
BradTextFieldSelect
Correção no método `setSelectValueMethod` para evitar alteração em múltiplas instâncias simultaneamente.
BradFilter
A interface (API) do serviço foi atualizada.
**Impacto**: Será necessário revisar a documentação existente para garantir que o componente seja implementado corretamente com a nova API.
Adição de um template de combinação utilizando Filter + Bottom Sheet, servindo como exemplo de uso integrado para facilitar a adoção do padrão.
BradTextFieldSearch
Novos tipos de busca: `prefix`, `contains` e `custom` (via callback) para personalizar a lógica de comparação.
Novos modos: `auto` (dispara ao digitar) e `manual` (dispara apenas via botão ou método `.search()`).
Suporte ao atributo `bradCustomCallback` para definir como o texto de entrada é comparado com cada opção.
No modo manual, o botão aciona `service.search()` ou `.search()`, permitindo buscas pontuais sem execução a cada tecla pressionada.
Documentação aprimorada e maior clareza nos pré-requisitos dos componentes, garantindo que possam ser inicializados corretamente:
brad-breadcrumbs
brad-carousel
brad-dropdown
brad-navbar
brad-overlay-mask
brad-popover
brad-tabs
BradTabs
Ajuste no comportamento para permitir o funcionamento correto de tabs aninhadas (tabs dentro de outras tabs).

# Publicada em 04/11/2025

# Versão 2.0.0
Visualizar documentação
Serviços e utilitários
Criado serviços e utilitários para viabilizar lazy loading de componentes que utilizam bibliotecas externas
Breaking Change - Lazy Loading no Carousel
Implementamos lazy loading no componente de carousel para melhorar a performance e reduzir o tamanho da biblioteca. O componente agora é assíncrono, gerando um breaking change na sua utilização. É necessário consultar a documentação e atualizar a implementação para a nova API
Ação obrigatória: Atualize sua implementação conforme a nova documentação
Breaking Change - Lazy Loading na Table
Implementamos lazy loading no componente de tabela para melhorar a performance e reduzir o tamanho da biblioteca. O componente agora é assíncrono, gerando um breaking change na sua utilização. É necessário consultar a documentação e atualizar a implementação para a nova API
Ação obrigatória: Atualize sua implementação conforme a nova documentação
Breaking Change - Lazy Loading no serviço de Animations
Implementamos lazy loading no serviço de animations para melhorar a performance e reduzir o tamanho da biblioteca. O serviço agora é assíncrono, gerando um breaking change na sua utilização. É necessário consultar a documentação e atualizar a implementação para a nova API
Ação obrigatória: Atualize sua implementação conforme a nova documentação
Breaking Change - Lazy Loading no serviço de Charts
Implementamos lazy loading no serviço de charts para melhorar a performance e reduzir o tamanho da biblioteca. O serviço agora é assíncrono, gerando um breaking change na sua utilização. É necessário consultar a documentação e atualizar a implementação para a nova API
Ação obrigatória: Atualize sua implementação conforme a nova documentação
Suporte
Atualização da página de Suporte no Storybook
Melhorias na documentação e informações de contato
Atualização de links e recursos disponíveis
Table
Alteração para somente uma tabela no storybook com as opções de ActionBar para seleção
Criação do parâmetro initialSort para ordenação automática das colunas
Atualização da documentação do componente table
Ajustes gerais de funcionalidades do componente table
Separação do subcomponente ActionBar
Calendar
Corrigido problema de acessibilidade para os dias da semana onde era verbalizado "undefined" em vez do dia da semana respectivo
Melhoria na experiência para usuários de leitores de tela
Correção de erro ao limpar seleção (cleanInput) no componente TextFieldSelect
Corrigido bug que causava erro ao executar o método cleanInput
Melhoria na validação de estados antes da limpeza
Adicionada verificação de instância válida antes da execução
Ilustrações animadas adicionadas
`brad-animation-misc-suc-avaliacao-experiencia`
`brad-animation-misc-suc-conclusao-avaliacao-exp-dark`
`brad-animation-misc-suc-conclusao-avaliacao-exp-light`
Remoção do bundle de remodelagem de classes legadas (legacy.bundle)
O bundle responsável pela conversão de classes legadas foi removido.
A funcionalidade de parse da classe brad para liquid-brad foi descontinuada.
Icones que não serão mais redirecionados automaticamente (antigo -> novo):
`.icon-cartao-segunda-via-boleto` -> `.icon-transacional-boleto`
`.icon-feedback-calendar-check` -> `.icon-transacional-calendar-check`
`.icon-transacional-livelo-mais-beneficios` -> `.icon-transacional-mais-beneficios`
`.icon-cartao-debito-credito-rotativo` -> `.icon-transacional-pagamento-rotativo`
`.icon-miscellaneous-lock` -> `.icon-token-lock`
`.icon-financial-shield-diamond` -> `.icon-seguro-diamond`
`.icon-financial-protecao-preco` -> `.icon-seguro-protecao-preco`
`.icon-seguro-bagagem` -> `.icon-seguro-viagem-1`
`.icon-category-star` -> `.icon-miscellaneous-star`
`.icon-miscellaneous-wireless-2` -> `.icon-ui-wifi`
`.icon-financial-payment-cancel` -> `.icon-financial-cancel`
`.icon-cartao-check-money` -> `.icon-financial-dolar-check`
`.icon-miscellaneous-handshake` -> `.icon-financial-relationship`
`.icon-financial-clipboard-edit` -> `.icon-filetype-clipboard-edit`
`.icon-ui-chat` -> `.icon-contact-chat`
`.icon-miscellaneous-people-meeting` -> `.icon-contact-people-meeting`
`.icon-token-sms` -> `.icon-contact-sms`
`.icon-transacional-livelo-beneficios` -> `.icon-category-pontos-beneficios`
`.icon-transacional-livelo-tranferencia-pontos` -> `.icon-cartao-troca-milhas-pontos`
`.icon-transacional-livelo-capitalizacao` -> `.icon-capitalizacao-money`
`.icon-atm-transferencia-corretores` -> `.icon-cambio-compra`
`.icon-atm-moeda-alternar` -> `.icon-cambio-compra-moeda`
`.icon-atm-conversao` -> `.icon-cambio-saque`
`.icon-financial-money-withdraw` -> `.icon-atm-saque`
`.icon-financial-money` -> `.icon-financial-hand-money`
`.icon-category-work` -> `.icon-miscellaneous-bag`
`.icon-cartao-uso-exterior` -> `.icon-cartao-exterior`
`.icon-category-home` -> `.icon-category-house`
`.icon-financial-account-manager` -> `.icon-financial-manager`
`.icon-financial-person-money` -> `.icon-financial-manager`
`.icon-financial-throw` -> `.icon-miscellaneous-hammer-law`
`.icon-miscellaneous-law` -> `.icon-transacional-boleto-protesto`
`.icon-transacional-livelo-sorteio` -> `.icon-transacional-raffle`
`.icon-extrato-hourglass` -> `.icon-miscellaneous-hourglass`
`.icon-financial-hourglass` -> `.icon-miscellaneous-hourglass`
`.icon-cambio-global` -> `.icon-miscellaneous-global`
Icones antigos que permanecem na biblioteca:
`icon-transacional-livelo-sorteio`
`icon-financial-account-manager`
`icon-financial-money-lock`
`icon-financial-person-money`
`icon-financial-throw`
`icon-cambio-global`
`icon-category-home`
`icon-category-work`
`icon-cartao-uso-exterior`
`icon-seguro-bagagem`
Adicionado novos ícones:
`icon-miscellaneous-vallet-estacionamento`
`icon-miscellaneous-avaliacao`
`icon-feedback-internet-off`
`icon-feedback-internet-on`
`icon-feedback-internet-vpn-off`
`icon-feedback-internet-vpn-on`
## Alteração no ícone `icon-navigation-arrow-launch`

# Publicada em 22/09/2025

# Versão 1.33.8
Visualizar documentação
Popover
Seta do popover com extremidades limitadas a 4px
HideText
Permitir copy quando conteúdo estiver visível
Snackbar
Foi adicionada feature de posicionamento para o topo
Icons
Exibir icones com prefixo "component"
TextFieldSelect
Correção TextFieldSelect Multi mobile perdendo selecionados ao fechar modal
Alterada cor do TextFieldSelect de acordo com documentação do design system

# Publicada em 25/08/2025

# Versão 1.33.6
Visualizar documentação
Calendário
Correção no componente calendário para apresentar posição correta (scroll) referente a data selecionada.
Implementação de focus personalizado no componente calendário
Contributting
Aprimoramento contributting
Text Link
Implementação de focus personalizado no componente Text Link
Breadcrumbs
Implementação de focus personalizado no componente Breadcrumbs
Accordion
Correção de vazamentos de memória com implementação adequada do ciclo de vida.
Gestão e observação de mudanças no DOM.
Overlay
Ajuste método destroy para remover instâncias
Table
Ajustes no componente table para aceitar tabelas sem checkbox obrigatórios.
TextFieldSearch
## Ajuste no background documentação do storybook

# Publicada em 01/08/2025

# Versão 1.33.5
Visualizar documentação
TextField Search
Adicionado modo onColor nas variações trigger e view
Ratings
Implementado focus visible nas estrelas
Ajustado problema de focus no template
Atualizado na documentação do template a classe de tamanho
TextField
Variação input/textarea
Adicionamento automático de botões +/- no input tipo number
Corrigido bug de não exibição de ícones de validação
TextField Quantity
Corrigido comportamento valid e invalid
Corrigido bug de validação modo oncolor brad-bg-color-primary afluentes.
Ajustes no exemplo do storybook no textField Search
Adicionado novos ícones e bandeiras
bradseg-residencial-linha-branca
bradseg-residencial-provisoria
bradseg-residencial-quadros
bradseg-residencial-raio
bradseg-residencial-reparo
bradseg-residencial-restaurante
capitalizacao-bradseg-cap-sorteados
bradseg-dental-atendimento
bradseg-dental-cirurgia
bradseg-dental-dentedeleite
bradseg-dental-dentista
bradseg-dental-endodontia
bradseg-dental-ideal
bradseg-dental-junior
bradseg-dental-odontopediatria
bradseg-dental-pais
bradseg-dental-periodontia
bradseg-dental-plano-dental
bradseg-dental-prevencao
bradseg-dental-radiologia
Bandeiras default e rounded
flag-saint-helena
flag-macau
flag-gibraltar
flag-falkland-islands
flag-bermuda
## flag-aruba

# Publicada em 27/06/2025

# Versão 1.33.4
Visualizar documentação
Correção de Layout Shift em Componentes com Overflow
Foi implementado um novo serviço para corrigir o layout shift causado por componentes que utilizam overflow: hidden no body, resultando na remoção das barras de rolagem vertical e horizontal.

## Essa melhoria foi aplicada aos seguintes componentes:
- brad-modal
- brad-drag-and-drop
- brad-bottom-sheet
## - brad-side-sheet

Com a adoção desse serviço, foi resolvido o problema de deslocamento inesperado do conteúdo da página ao interagir com esses componentes.

Para aplicar essa correção em outros componentes, importe e utilize o BodyScrollManagerService, conforme descrito na documentação.
Popover e Popover Default
Ajustes na acessibilidade dos exemplos do Popover no Storybook
Atualização da documentação no topico de acessibilidade do componente
BodyScrollManager
Inclusão de novo serviço para correção de layout shift de componentes que utilizam overflow (modal, drag and drop, bottomSheet e sideSheet).
BradTextFieldSelect
Corrigido preenchimento da label/input mesmo sem seleção
Corrigido inconsistência na lógica de seleção múltipla com opção 'Todos' no modo intermitente
Ratings
Ajustada acessibilidade do componente para padrões de mercado
Depreciada uso da tag de acessibilidade brad-rating\_\_accessibility
Popover Stepper
Atualização da Documentação de acessibildade
Modificação na ordem e no modo de leitura
Inclusão de novos ícones:
icon-brad-seg-auto-auto-lista
icon-brad-seg-auto-cnh-check
icon-brad-seg-auto-cnh-frente
icon-brad-seg-auto-cnh-verso
icon-brad-seg-auto-colisao
icon-brad-seg-auto-crv-frente
icon-brad-seg-auto-crv-verso
icon-brad-seg-auto-incendio-alagamento
icon-brad-seg-auto-oficina-credenciada
icon-brad-seg-auto-pneu-furou
icon-bradseg-atend-passageiro
icon-bradseg-auto-cobertura-colisao
icon-bradseg-auto-equipamentos-carro
icon-bradseg-auto-equipamentos-moto
icon-bradseg-auto-lanterna
icon-bradseg-auto-rastreador
icon-bradseg-auto-servico-reparo
icon-bradseg-auto-troca-vidro
icon-bradseg-cobertura-carroceria
icon-bradseg-cobertura-equipamentos
icon-bradseg-cobertura-kit-gas
icon-bradseg-vida-veiculos-roubados
icon-bradseg-auto-app-seguro
icon-bradseg-auto-coberturas-adicionais
icon-bradseg-auto-assistencia
icon-bradseg-auto-sinistro
icon-bradseg-auto-personalizado
icon-cartao-viagem-disney
Inclusão de Bandeiras:
brad-flag-cayman-islands-default
brad-flag-cayman-islands-rounded
brad-flag-hong-kong-default
brad-flag-hong-kong-rounded
TextField Search
## Adicionado modo onColor nas variações trigger e view

# Publicada em 13/06/2025

# Versão 1.33.3
Visualizar documentação
TextFieldSelect
Ajustada a funcionalidade de responsividade do TextFieldSelect: agora, ao alterar a resolução durante a execução, o comportamento do carregamento inicial é mantido corretamente.
Ajustada funcionalidades de acessibilidade (principalmente problemas na definição do item 'checked')
Ajustada funcionalidades de navegação por setas
Ajustado regras de seleção para o tipo [multi]
RadioButton
Atualizada e padronizada documentação
PaginationBullets
Inclusão de :focus-visible personalizado
Pagination
Inclusão de :focus-visible personalizado
Switch
Inclusão de :focus-visible personalizado
Button
Inclusão de :focus-visible personalizado no componente
Chips
Inclusão de :focus-visible personalizado no componente Chips
Button Text
Inclusão de :focus-visible personalizado no componente
TextFieldSearch
Ajustada funcionalidades de navegação por setas
Popover
Ajustes no componente, alteração de posicionamento e abertura do Popover default, Popover, Popover Tooltip e Popover Stepper.
ProgressCircle
Alterado cor de porcentagem.
Info button
## Inclusão de :focus-visible personalizado no componente

# Publicada em 29/05/2025

# Versão 1.33.2
Visualizar documentação
Alteração na estrutura HTML do carousel
Foi identificado um problema no componente em que os controles poderiam desaparecer ou se deslocar incorretamente.

Esse comportamento foi corrigido e, a partir desta versão, uma nova estrutura HTML foi adotada com elementos de paginação fora do container de swiper.
Calendar
Adicionada nova funcionalidade para mudança de linguagem (pt-br, en, es, custom);
Carousel
Ajustes na documentação e correção do bug em que os controles poderiam desaparecer ou se deslocar incorretamente para o lado esquerdo da tela.
Incluído logs de erro nos componentes para auxiliar depuração
Accordion
Inclusão de :focus-visible personalizado no componente
TextFieldSearch
A regra de filtros do componente foi atualizada. Anteriormente, a pesquisa utilizava includes, exibindo ocorrências na lista filtrada ao incluir qualquer letra correspondente. Agora, a filtragem utiliza startsWith, exibindo apenas os resultados que começam com a sequência exata informada.
Inclusão de novos ícones
bradseg-auto-app-seguro
bradseg-auto-assistencia
bradseg-auto-autoridades
bradseg-auto-avaliacao-risco
bradseg-auto-cambio
bradseg-auto-coberturas-adicionais
bradseg-auto-completo
bradseg-auto-condutor
bradseg-auto-corretores
bradseg-auto-onibus
bradseg-auto-personalizado
bradseg-auto-portas
bradseg-auto-posto
bradseg-auto-protecao
bradseg-auto-sinistro
bradseg-category-pet-tombstone
bradseg-saude-anesthesia
bradseg-saude-doctor
bradseg-saude-emergency
bradseg-saude-hospitalization
bradseg-saude-medical-exam
bradseg-saude-medical-heart
bradseg-saude-surgery
bradseg-saude-surgical-material
cartao-scan
miscellaneous-contactless-payment-disabled
miscellaneous-contactless-payment
pix-objection
Alteração dos ícones
Mundaça de ícone seguro-carro
Mundaça de ícone financial-car
Mundaça de ícone miscellaneous-car-security
Mundaça de ícone miscellaneous-car-selection
Mundaça de ícone miscellaneous-car-search
TextFieldNumber
Correção de exibição do teclado virtual em aparelhos iOS.
Alteração na Segmentação
Implementado refatoração no visual dos componentes para retirar o padrão segmentado do tema private para proposta corporativa.
Implementado refatoração no visual dos componentes para retirar o padrão segmentado do tema exclusive para proposta corporativa.
Implementado refatoração no visual dos componentes para retirar o padrão segmentado do tema prime para proposta corporativa.
Implementado refatoração no visual dos componentes para retirar o padrão segmentado do tema corporate para proposta corporativa.
Modificação no token
Criado token brad-color-component-primary para facilitar o controle de cores dos componentes
Adicionado InstancesService
Novo serviço global window.LiquidCorp.instances para registrar, buscar e remover instâncias de componentes.
Suporte a registro automático para todos nossos componentes.
Novo serviço global window.version que retorna a última versão do Liquid carrega na aplicação corrente.
TextFieldSearch
Atualizada a documentação para os 4 tipos: dropdown, static, view e trigger.
Comportamento aprimorado para melhor experiência do usuário.
Adicionados métodos `close` e `open`.
Depreciações:
O tipo `gatilho` foi depreciado e substituído por `trigger`.
O tipo `search-view` foi depreciado e substituído por `view`.
TextFieldSearch
Ajustada funcionalidades de navegação por setas
Charts
Correção do tooltip nos componentes de gráficos, novo código com correção de posicionamento e exibição

# Publicada em 16/05/2025

# Versão 1.33.1
Visualizar documentação
Checkbox e RadioButon
Implementada funcionalidade de acessibilidade que destaca exclusivamente os componentes ao serem focados via teclado.
Inclusão dos ícones
account-people-meeting-check
miscellaneous-weight-scale
category-chameleon
category-fish
category-rabbit
category-turtle
miscellaneous-remedy
feedback-circle-warning-disabled
Substituição dos ícones
category-cat
category-dog
category-rodent
Inclusão de novas bandeiras
antigua-and-barbuda
azerbaijan
burundi
cameroon
cape-verde
central-african-republic
chad
comoros
congo-democratic-republic
congo-republic
djibouti
equatorial-guinea
eritrea
eswatini
ethiopia
fiji
gabon
gambia
ghana
guinea
guinea-bissau
kenya
kiribati
lesotho
liberia
libya
madagascar
malawi
mali
marshall-islands
mauritania
mauritius
micronesia
morocco
mozambique
namibia
nauru
niger
nigeria
palau
palestine
papua-new-guinea
rwanda
samoa
sao-tome-and-principe
senegal
seychelles
sierra-leone
solomon-islands
somalia
south-sudan
sudan
tanzania
togo
tonga
tunisia
tuvalu
uganda
vanuatu
zambia
zimbabwe
Ajuste no nome das bandeiras
Kazakhstan
Saint Vincent and the Grenadines
Atualizações na regra de exibição do :focus-visible para auxílio de acessibilidade
Em dispositivos móveis, o estilo outline não será mais aplicado ao utilizar :focus-visible, considerando que a navegação por toque não depende de um indicador visual de foco. Além disso, tecnologias assistivas nesses dispositivos já aplicam automaticamente um contorno (outline) quando necessário.
Os componentes text-field dos tipos text, number e textarea não exibirão mais o contorno de acessibilidade (outline) tanto no desktop quanto no mobile, uma vez que já possuem elementos visuais que indicam foco de forma adequada.
Ajuste no componente Navbar quando estiver em estado de disable

# Publicada em 29/04/2025

# Versão 1.33.0
Visualizar documentação
ColorCombination
Implementado novas funcionalidades ao utilitário color combination
TimelineStepper
Melhoria no serviço para atualizar os "steps" ao adicionar/remover elementos através dos métodos do serviço
Bottom-Sheet
Ajuste em função de acessibilidade para correto funcionamento da opção "first-read-element".
Tabs
Ajuste do scroll horizontal para funcionar corretamente no mobile
InputUploader
Ajustado problema de subir arquivo após cancelar um upload anterior
Melhoria na documentação e como implementar
Ajuste na implementação de cancelar upload (clicar no X)
Ínclusão de novos ícones
miscellaneous-global
miscellaneous-hourglass
Mudança de ícone miscellaneous-bag
Mudança de ícone miscellaneous-hammer-law
Redirecionamento de ícones
icon-ui-chat para icon-contact-chat
icon-feedback-calendar-check para icon-transacional-calendar-check
financial-clipboard-edit para filetype-clipboard-edit
financial-payment-cancel para financial-cancel
token-sms para contact-sms
category-star para miscellaneous-star
miscellaneous-wireless-2 para ui-wifi
miscellaneous-lock para token-lock
miscellaneous-law para transacional-boleto-protesto
miscellaneous-people-meeting para contact-people-meeting
miscellaneous-handshake pra financial-relationship
cartao-debito-credito-rotativo para transacional-pagamento-rotativo
cartao-check-money para financial-dolar-check
cartao-segunda-via-boleto para transacional-boleto
financial-hourglass para miscellaneous-hourglass
extrato-hourglass para miscellaneous-hourglass
financial-protecao-preco para seguro-protecao-preco
financial-shield-diamond para seguro-diamond
financial-money para financial-hand-money
atm-conversao para cambio-saque
financial-money-withdraw para atm-saque
atm-transferencia-corretores para cambio-compra
atm-moeda-alternar para cambio-compra-moeda
category-home para category-house
financial-person-money para financial-manager
financial-account-manager para financial-manager
seguro-bagagem para seguro-viagem-1
category-work para miscellaneous-bag
cambio-global para miscellaneous-global
cartao-uso-exterior para cartao-exterior
## financial-throw para miscellaneous-hammer-law

# Publicada em 07/04/2025

# Versão 1.32.9
Visualizar documentação
Pagination
Atualizado documentação do componente para o padrão da biblioteca
Timeline
Novos métodos criados, appendTimelineElement, addTimelineElement, updateSegmentedState, updateState, removeTimelineElement para lidar com a modificação do componente em tempo de execução.
Atualização da variável de "events" conforme eventos são alterados na timeline.
Disponibilização de tokens para tecnologias nativas
Foi disponibilizado um arquivo JSON com os principais tokens e utilitarios do design system
Table
Mudança para novo formato da documentação
Acrescentando a informação de validationMode no tópico de configuração da tabela e no código de edição de linhas
Ajustado o tamanho mínimo do campo Name para 145px para que não quebre nos exemplos.
Acrescentado observação para uso do minWidth na configuração das colunas
Modificação da fonte dos títulos de MD para SM
Modificação da fonte dos status de MD para SM
Analytics
Adicionado analytics nos itens de menu e pesquisa do storybook
Modal
Atualizada a documentação do modal
Modificado o display de block para flex (Assim quando o conteúdo ultrapassar o tamanho máximo do modal o scroll será habilitado)
Ínclusão de novos ícones
cartao-codigo-cvv
cartao-instantaneo
investimento-fund-comparisons
investment-risk-high
investment-risk-low
investment-risk-medium
investment-risk-very-high
investment-risk-very-low
pix-chave-adicionar
seguro-atendimento-medico-digital
seguro-bagagem
seguro-dental
seguro-global-saude-1
seguro-protecao-compras
seguro-protecao-pessoal
transacional-boleto-protesto
transacional-pagamento-aproximacao
transacional-raffle
transacional-transferencia-interna
transacional-valor-pix
miscellaneous-padlock
category-house
miscellaneous-hammer-law
cartao-exterior
financial-manager
financial-monetary-identification
miscellaneous-padlock-open
Inclusão de ilustração animada
nao-correntista-suc-cartoes-light
Snackbar
Ajustado documentação do Snackbar e os controles do Storybook
Pagination
Ajuste no erro de exibição e ocultação da paginação quando o totalPages é igual ou menor que o countNumbersStart
Carousel
Ajustado não funcionamento dos controles da paginação e navegação.

# Publicada em 28/02/2025

# Versão 1.32.7
Visualizar documentação
Navbar
Ajuste na documentação do Navbar, posíção da linha do componente estava errada (erro apenas no Storybook).
Chips
Ajustado no Chips Confirmation e Chips Multi o estado hover no mobile
Acessibilidade
Foi removido outline azul de acessibilidade nos componentes de input e textarea apenas em dispositivos mobile.
PopoverDefault
Melhoria de posicionamento do componente, quando colocado dentro de um outro componente overlay, por exemplo side-sheet e modal.
Adicionado exemplos de uso do componente em cenários diferentes, inclusive incluído dentro do side-sheet.
Adicionado serviço para monitoramento do uso da lib
Aparecerá um log no devtools (de warning ou danger) automaticamente se for indentificado que a CDN do Liquid foi carregada mais de uma vez no mesmo site ou aplicativo.
Warning: Caso todas as versões indentificadas sejam a mesma.
Danger: Caso algumas das versões seja diferente.
Snackbar
Adicionada feature de exibiçao de múltiplos snackbars no modo stacked (empilhado).
Breadcrumbs
Responsividade aprimorada: O componente agora adapta-se melhor a diferentes tamanhos de tela, garantindo uma experiência mais fluida para os usuários.
Semântica revisada: Melhorias na estrutura e na montagem do componente para maior acessibilidade e conformidade com padrões web.
Novas variações de exibição: Adicionadas duas opções de visualização dos itens do componente:
full: Exibe todas as páginas, incluindo aquelas posteriores à página ativa.
condensed: Oculta as páginas posteriores à ativa, exibindo apenas as anteriores e destacando a página ativa como última.
Substituição de ícones
Criação do script para localizar e substituir os ícones
Inserção do CROSSORIGIN na tag link (Chance de erro de CORS se não inserir)
transacional-livelo-beneficios substituido por category-pontos-beneficios
transacional-livelo-mais-beneficios substituido por transacional-mais-beneficios
transacional-livelo-sorteio substituido por transacional-raffle (novo ícone)
transacional-livelo-capitalizacao substituido por capitalizacao-money
transacional-livelo-tranferencia-pontos substituido por cartao-troca-milhas-pontos
Side Sheet
Atualizado documentação do componente HTML para o padrão da biblioteca.
Timeline Stepper
Simplificado o serviço do Timeline Stepper
Foi criado os métodos addStep, removeStep e appendStep para lidar com a modificação do componente em tempo de execução
Dropdown
Foi realizado uma melhoria de posicionamento automatico no componente, no qual, agora ele se posiciona na tela conforme o espaço, ou seja, se for para abrir para cima, mas não houver espaço, ele abrirá para baixo, e vice versa, a mesma coisa verticalmente
Ínclusão de um novo ícone
## transacional-operacoes-lote 1

# Publicada em 24/01/2025

# Versão 1.32.4
Visualizar documentação
Correção dos estilos duplicados, atualização do sass para 1.83.0 e troca de @import para @use.
TextFieldCode
Adicionado feature de copiar e colar código nos campos.
TextField
Atualizada documentação do TextField com observações de como utilizar o placeholder corretamente, e assim, não gerar problemas na exibição da label.
Rating
Atualizado documentação do componente HTML para o padrão da biblioteca
Side Sheet (Antes -> Depois)
Ajuste no tamanho do icone de fechar (16px -> 24px)
Ajuste no Padding top (24px -> 20px)
Ajuste no Padding Bottom (24px - 0px)
Ajuste no posicionamento do icone de fechar para ficar de acordo com a documentação de design
Ajuste na documentação do Storybook para ter o botão de fechar

# Publicada em 17/01/2025

# Versão 1.32.3
Visualizar documentação
PaginationBullets
Ajuste na documentação do componente em HTML para padrões do Liquid
Adiciona serviço no componente HTML para facilitar uso e entregar mais valor
Hide Text
Ajuste na documentação e evolução do service para implementar a função de hide/show

# Publicada em 03/01/2025

# Versão 1.32.2
Visualizar documentação
Versão Descontinuada
Foi identificada uma inconsistência no componente Text Field Select nesta versão. Sendo descontinuada, esta versão não deve ser utilizada.
A versão seguinte contempla todas as atualizações listadas abaixo.
Alterado o espaçamento interno do componente dropdown
Atualizado a documentação do Dropdown
Ajuste na margem do dropdown para o botão
Criação do Chart Bar Clustered
Atualização da doc do Chart Bar para o novo padrão
Ajustado funcionalidades de seleção do componente Rating, e adicionado animação ao toque.
Corrigido espaçamentos e largura mínima do componente brad-text-field-code.
Criação do Chart Bar Stacked
Ajuste comportamento visual do componente list item
Ajustes da fase 4 de apontamentos do Sonar
Melhoria de acessibilidade no componente Overlay
Popover Stepper
Ajuste no Padding direito
Resolvido Problema que Popover ficava acima mesmo depois de fechado
Adicionado funcionalidade que esconde o botão de fechar no ultimo step
Atualizado a documentação do Popover Stepper e Tutorial
Criado CSS para botão fechar com icone
Melhoria na documentação do componente Drag and Drop
Ajuste de acessibilidade e eventos do Tabs
Waves
Ajuste no exemplo dos stories para aparecer corretamente no storybook
Inclusão de novos ícones
category-glasses
category-wine-bottle
seguro-veiculo-locadora
Calendar
Ajuste na lógica de troca de mês para garantir que seja redirecionado corretamente.
Popover
Ajuste ao abrir popover pela primeira vez, cálculo está sendo feito de forma incorreta, e abrindo fora do centro.
Carousel
Atualizada documentação do carousel com todos os eventos disponíveis;
Atualizada documentação do carousel para padrão da biblioteca;
Adicionado módulo de manipulação (Manipulation) do carousel, agora é permitido adicionar, remover e modificar slides dinamicamente.

# Publicada em 06/12/2024

# Versão 1.31.7
Visualizar documentação
Ajustes no componente text-field-prompt, adição de temas e backgrounds, correção tema afluentes
Ajuste visual no modo desativado do componente brad-chip-delete
Criado componente HTML ChipAction e ChipConfirmation.
Ajuste visual no componente timeline-stepper para os temas Next e Afluentes
Ajustes no componente Badge
Implementar novas variações de cores no componente badge HTML
Modificação e modernização documentação do componente Badge para conter as novas classes de cores
Ajustes na brad-navbar
Centralização dos itens: Agora, os itens da brad-navbar são posicionados no centro do container e podem crescer até uma largura máxima de 576px.
Line-height da label: O espaçamento vertical das labels foi ajustado para um line-height de 16px, melhorando a legibilidade e adequação de UX.
Espessura da linha indicadora: A linha indicadora foi ajustada para 4px, seguindo recomendações de UX para maior visibilidade.
Adicionado padrão do focus nos componentes para evoluir a acessibilidade do Design system
Automatizar a composição de cores utilizadas em componentes como o card ribbon ou o badge.
Inclusão de novos ícones
miscellaneous-term-app
miscellaneous-term-bia
miscellaneous-doc-locked
financial-cashback-analysis
miscellaneous-mic-locked
category-voleiball
category-tv
category-sports
category-shoes
category-mug
category-instrument-guitar
category-electroportable
category-children
category-basketball
category-air-ventilation
Corrigido exemplo do Dropdown no storybook, não estava exebindo corretamente.
Ajustes visuais dos componentes HTML Chips.
Ajustes na ordenação do menu do Storybook.
Ajuste visual no ícone de X do componente Chips Delete.
## Ajuste no componente table

# Publicada em 01/11/2024

# Versão 1.31.4
Visualizar documentação
Ajustes no componente tab
Ajuste no indicador top que agora mostra qual tab esta selecionada
Ajuste no componente oncolor do afluentes para que somente o topo fique com fundo brando e o conteudo transparente
Criação do modo oncolor secondary do afluentes para que o topo fique com a cor de fundo primaria
Adicionando a borda quando os itens no modo oncolor estao desabilitados
Ajuste na nomeclatura do token de cor quando componente esta em hover
Habilitando os controles de color e size do componente progress bar no storybook
Habilitando os controles de color e contentCenter do componente progress circle no storybook
Melhoria de acessibilidade do componente brad-table
Alterado o tamanho do ícone aplicado no componente button tex
Implementar melhoria nos componentes Bottom Sheet em relação ao scroll
Scroll agora é no conteúdo
Header fica fixo quando for rolado o scroll do conteúdo
Paddings ajustados
FormField Select
Colocado modo readonly no input do mobile
Adicionada funcionalidade de maxHeight nas opções do select multi e fixando botão de confirmar no footer das opções
Colocando overflow auto quando maxHeight for menor que a quantidade de opções
Adicionada funcionalidade de maxHeight e action para acompanhar os eventos em todos os exemplos do select no storybook
Nova página Release Log - Changelog
Ajustes na documentação do storybook
Ajustes na rotação da seta do accordion
Melhoria nos controles de background dos componentes
Correção visual do padrão de carregamento para o componente brad-timeline-stepper no segmento afluentes.
Ajustes da classe de acessibilidade do componente progress circle
Ajuste nos valores da página de tipografia
Ajustes no componente Timeline
Quando desabilitado agora modifica a cor do primary label também
Removida função que calculava a largura da info de dia/mês. Agora é o valor fixo (De acordo com a doc)
Modificando a cor do support text(brad-font-paragraph-sm) para neutral-40
Inserindo opções de modificação de dia / Mês e Valor no exemplo do storybook. (Com isso deixando a opção de aumentar a quantidade de dados)
Ajuste do indicador de enable para o tamanho fixo
Criação do componente HTML button-alert.
Inclusão de ícones:
cartao-service
atm-comprovante
miscellaneous-heritage-house
miscellaneous-celebration-fill
miscellaneous-celebration
Melhoria nos controles de background dos componentes
Alterações e melhorias no template de conclusão
Ajuste no componente popover.

# Publicada em 04/10/2024

# Versão 1.31.3
Visualizar documentação
Construção do template da tela de conclusão
Incluído controles de temas e cores de fundo na documentação dos seguintes componentes:
brad-waves
brad-button
brad-button-fab
brad-button-info
brad-button-text
brad-button-icon
brad-popover
brad-popover-default
brad-popover-tutorial
brad-list-item
brad-accordion
brad-text-field
brad-text-field-quantity
brad-text-field-code
brad-filter
brad-quickbutton
brad-checkbox
brad-radio-button
brad-pagination
brad-switch
Progress circle
Progress bar
Breadcrumbs
text-link
Load more
brad-chip
brad-chip-delete
brad-chip-multi
brad-chip-single
brad-tabs
brad-pagination-bullets
brad-pagination-bullets-multiple
brad-timeline-stepper
brad-timeline-stepper-horizontal
brad-timeline-stepper-vertical
brad-progress-stepper
brad-progress-stepper-with-buttons
Melhoria no componente brad-carousel
Ajuste de posição do componente carousel ao clicar nos bullets.
Ajuste no componente pagination
Foi alterado do botão de paginação o padding de 24px para 0px, entrando assim em conformidade com a documentação do design system
Ajuste no componente brad-pagination
Ajustado padding, entrando assim em conformidade com a documentação do design system.
Ajuste do espaço entre as opções das bandeiras e a opção de confirmar no modo mobile
Ajuste do espaço entre as opções das bandeiras e a opção de confirmar no modo mobile
Novo componente Text Field Prompt
Revisar componentes com quebra visual devido a troca da lógica de segmentação
Progress Stepper Ajustes do fundo do afluentes
Progress Circle Ajustes do fundo do afluentes
Progress Bar - Ajustes do fundo do afluentes
brad-carousel
Melhorias de acessibilidade, adicionado customização de verbalização para as setas.
brad-side-sheet
Melhorias de acessibilidade, e correção de abertura do componente, projetando-se corretamente para direita ou esquerda.
Novo componente Text Field Prompt
Revisar componentes com quebra visual devido a troca da lógica de segmentação
Progress Stepper Ajustes do fundo do afluentes
Progress Circle Ajustes do fundo do afluentes
Progress Bar - Ajustes do fundo do afluentes
brad-carousel
Melhorias de acessibilidade, adicionado customização de verbalização para as setas.
brad-side-sheet
Melhorias de acessibilidade, e correção de abertura do componente, projetando-se corretamente para direita ou esquerda.
FormField Select
Colocado modo readonly no input do mobile
Adicionando funcionalidade de maxHeight nas opções do select multi e fixando botão de confirmar no footer das opções
Colocando overflow auto quando maxHeight for menor que a quantidade de opções
Adicionando funcionalidade de maxHeight e action para acompanhar os eventos em todos os exemplos do select no storybook
Alterar a documentação da página de tipografia incluindo uma coluna com o nome apresentado no figma
Incluir uma nova escala tipografica para o link
Inclusão de icons
icon-brand-open-finance
icon-brand-open-finance-custom
icon-transacional-tranferencia-openfinace
icon-transacional-boleto-time
icon-transacional-download-boleto
Inclusão de ilustrações
Sucesso (suc)
contatos-suc-telefone.svg
cartao-suc-next_1.svg
cap-bradesco-suc-recompra.svg
adesao-suc-transferencia-documento.svg
next-suc-redirecionar-badesco-invest-us.svg
nao-correntista-suc-cielo-conclusao.svg
nao-correntista-suc-cielo-beneficos.svg
nao-correntista-suc-gamer.svg
misc-suc-entender-necessidades.svg
biometria-suc-chave-de-seguranca.svg
biometria-suc-reconhecimento-facial.svg
misc-suc-redirecionamento-next.svg
misc-suc-conclusao-encerrar.svg
open-finance-suc-credito.svg
Alerta (ale)
cartao-ale-exclusao.svg
previdencia-ale-prev-jovem.svg
open-finance-ale-atualizando.svg
Erro (err)
consorcios-err-veiculo-com-restricao.svg
cadastro-err-documentos.svg
Alerta (ale)
cartao-ale-exclusao.svg
previdencia-ale-prev-jovem.svg
open-finance-ale-atualizando.svg
Erro (err)
consorcios-err-veiculo-com-restricao.svg
## cadastro-err-documentos.svg

# Publicada em 18/09/2024

# Versão 1.31.1
Visualizar documentação
Chat Message
Mudança na regra que faz aparecer o ver mais, agora é contato por linhas e não mais por caracteres
Nova variável que define a partir de quantas linhas o ver mais deve aparecer
Inclusão de template cards-icon-title-description
Ajuste nos componentes fab-button e fab-icon
Foram alterados os paddings laterais de 20px e 24px, entrando assim em conformidade com a documentação do design system
Ajuste do componente dropdown
Foram alteradas as direções que o dropdown abre, invertendo da esquerda para direita, e direita para esquerda, entrando assim em conformidade com a documentação do design system
Ajuste na documentação do componente overlay-mask:
Foi corrigido um problema na documentação do Storybook, onde o overlay-mask não funcionava corretamente em algumas ocasiões, exigindo a atualização da página
Ajuste na cor de fundo na movimentação do card
Ao realizar a movimentação dos cards o fundo dever aparecer como cinza.
Novos ícones
atm-withid-numeric (Alteração)
atm-bradesco-expresso (Alteração)
brand-tag-bradesco (Alteração)
brand-tag-bradesco-colar (Alteração)
category-gender (Alteração)
brand-clube-de-vantagens (Alteração)
transacional-livelo-tranferencia-pontos
miscellaneous-24-hours
transacional-credito-investiment
transacional-credito-auto
transacional-credito-imovel
component-chat-bia
component-chat-bia-oncolor
Novas Ilustrações
credito-suc-imobiliario-amortizacao
credito-suc-imobiliario-quitacao
adesao-suc-autorizacao-instituicao
chave-de-seguranca-suc-generica
misc-suc-desk-aprovado
boleto-suc-foto-boleto
beneficios-suc-mimos_1
beneficios-suc-carregando-dados
beneficios-suc-carregando
Ilustrações animadas
brad-animation-beneficios-suc-carregando-dados-dark
brad-animation-beneficios-suc-carregando-dados-light
brad-animation-beneficios-suc-carregando-dark
brad-animation-beneficios-suc-carregando-light
brad-animation-chave-de-seguranca-suc-generica-dark
## brad-animation-chave-de-seguranca-suc-generica-light

# Publicada em 22/08/2024

# Versão 1.30.9
Visualizar documentação
Ajuste na documentação dos componentes TextField Select Multi e Icon
Button Default
ajuste no estado disabled nos temas expresso e next
Ajuste nos eventos do bottom sheet
Disparado do evento closed quando modal é fechado clicando no overlay.
Inserido na documentação a tabela com os eventos disponíveis no componente.
Inserido action no storybook para mostrar quando os eventos são disparados.
Table, melhorias na acessibilidade.
Novas Ilustrações
beneficios-suc-conta
beneficios-suc-experiencia
cadastro-suc-conta-cartao
cadastro-suc-mudanca-conta
cadastro-suc-nova-conta
misc-suc-ilustracao-conclusao
Novos ícones
seguro-seguros (Alteração)
component-audio-mic (Alteração)
atm-bradesco-expresso (Alteração)
miscellaneous-night
miscellaneous-day
brand-beneficios-afluentes
category-heart-fill
Ilustrações animadas
brad-animation-biometria-suc-chave-de-seguranca-dark.json
brad-animation-biometria-suc-facial-dark.json
brad-animation-biometria-suc-facial-light.json
brad-animation-biometria-suc-reconhecimento-facial-dark.json
brad-animation-contratos-e-certificados-ale-validacao-pagamento-dark.json
brad-animation-contratos-e-certificados-ale-validacao-pagamento-light.json
brad-animation-ir-ale-ir-dark.json
brad-animation-nao-correntista-suc-cielo-carregamento-dark.json
brad-animation-shopping-next-suc-ofertas-dark.json
brad-animation-adesao-suc-biometria-facial-aprovada-dark.json
brad-animation-adesao-suc-biometria-facial-aprovada-light.json
brad-animation-misc-suc-corban-bradesco-expresso-dark.json
brad-animation-misc-suc-corban-bradesco-expresso-light.json
brad-animation-misc-suc-viagem-dos-sonhos-dark.json
brad-animation-misc-suc-viagem-dos-sonhos-light.json
brad-animation-nao-correntista-suc-cielo-tap-maquininha-dark.json
brad-animation-nao-correntista-suc-cielo-tap-maquininha-light.json
brad-animation-misc-suc-ilustracao-conclusao-dark
brad-animation-misc-suc-ilustracao-conclusao-light
Ajuste na função Update do Pagination.

# Publicada em 12/08/2024

# Versão 1.30.6
Visualizar documentação
Table, refinamento da acessibilidade
Ajuste no componente e doc do Search view no storybook para não cortar o helper text.
Ajustando tamanho do minus no componente Quantity
Evolução no componente Pagination para permitir alteração dinâmica do total de páginas.
Card Default
Ajuste de estilo (overflow) para funcionar com text-field-select
Melhoria no componente Bottom Sheet para não acionar a função close mais de um vez quando clicado no botão fechar.
Evolução no componente Calendário para permitir duas datas iguais em um intervalo.
Novos ícones
component-circle-error-oncolor
component-circle-info-oncolor
component-circle-success-oncolor
component-circle-warning-oncolor
brand-benecicios-afluentes
pix-cancel-favorite
pix-favorite
ui-expand
ui-mouse
ui-mouse-scroll
ui-navegation
## ui-scroll- screen

# Publicada em 22/07/2024

# Versão 1.30.5
Visualizar documentação
Tutorial da inclusão de ícones, ilustrações e animações
Calendar, adicionada a documentação de acessibilidade
Correção de bug no badge no seu estado dot
Estrutura de templates (ComponentToggle)
Evolução do template de Feedback
Novo template Rating/Review
Overlay melhoria de processamento
Template popover tutorial, documentação atualizada
Ajuste do storybook de acordo com o Sonar(index.html e iframe.html)
Inclusão de acessibilidade do componente Text Field Select (brad-text-field-select)
Documentação de acessibilidade do componente Popover (brad-popover)
Chat message, refinamento e documentação de acessibilidade
Overlay default, ajuste do componente que estava sendo criado no html, agora será no body.
Bottomsheet, acessibilidade autofocus ao abrir
Adição de validação para múltiplos arquivos
Funcionalidade Hover em telas menores altera background
Correção do nome da bandeira da Bósnia e Herzegovina
Input uploader, ajuste do isMultipleFiles false ao dar o drop de 2 ou mais arquivos será considerado apenas 1 arquivo
Novas ilustrações:
adesao-suc-carregando-dados-idbra
adesao-suc-confirmacao-dados-idbra
adesao-suc-confirmado-dados-idbra
adesao-suc-dados-idbra-validacao
adesao-suc-idbra-digital
adesao-suc-mudanca-conta
adesao-suc-tranferencia-documento
beneficios-suc-presente-ganho
contratos-e-certificados-ale-certificado-conclusao
contratos-e-certificados-suc-certificado-conclusao
misc-suc-servico-concierge
saque-cambio-ale-transferencia-internacional
seguro-suc-despesas-essenciais (update)
senha-suc-mesma-senha
Novas ilustrações animadas:
brad-animation-nao-correntista-suc-cielo-tap-maquininha-dark
brad-animation-nao-correntista-suc-cielo-tap-maquininha-light
Ajuste das ilustrações animadas:
brad-animation-misc-suc-viagem-dos-sonhos-dark
brad-animation-misc-suc-viagem-dos-sonhos-light
Novos ícones:
seguro-assistencia-empresarial(update)
miscellaneous-lock(update)
miscellaneous-idbra
financial-report
category-prime-shopping
## Ajuste no padding do componente Botton Sheet Modal

# Publicada em 01/07/2024

# Versão 1.30.2
Visualizar documentação
Table, adicionado métodos de atualização da tabela
Ajuste da documentação de acessibilidade do componente Timeline
Melhoria na acessibilidade do carousel
Button Text On Color
Foi atualizada as cores do On Color (Label e ícone ) em todos os estados (Enable, Hover, Pressed e Disabled) de acordo com a documentação do XD
Foi atualizado para inserir o Underline em todas as tags que não possuem a classe de ícone e não somente na tag span (Na doc o underline aparece em todos os estados)
Documentar acessibilidade do componente Forms - Text-Field (brad-text-field)
Ajuste de performance e correção de componentes no segmento afluentes
Novas ilustrações adicionadas:
Novas ilustrações animadas adicionadas:
adesao-suc-documento-pdf-pj
adesao-suc-confirmacao-abertura-conta
adesao-suc-doc-analizado
adesao-suc-tempo
adesao-ale-refazer-video-selfie
adesao-ale-reenviar-documento
beneficios-suc-presente
misc-suc-viagem-presente
pagamentos-suc-carteira-digital-samsung-wallet
private-ale-cliente-prime
invest-facil-suc-perfil
seguro-suc-despesas-essenciais
prime-digital-ale-atualize-app-prime (substituição)
prime-digital-ale-cliente-prime (substituição)
prime-digital-ale-conta-empresarial-prime (substituição)
prime-digital-ale-conta-encerrada-prime (substituição)
prime-digital-ale-nao-houve-alteracao-na-conta (substituição)
prime-digital-ale-quer-ser-prime-digital (substituição)
private-ale-atualize-app-prime (substituição)
private-ale-cliente-prime (substituição)
private-ale-conta-empresarial-prime (substituição)
private-ale-conta-encerrada-prime (substituição)
private-ale-nao-houve-alteracao-na-conta (substituição)
Novas animações adicionadas:
brad-animation-carregando-abertura-conta-dark
brad-animation-carregando-abertura-conta-light
brad-animation-misc-suc-viagem-dos-sonhos-dark
brad-animation-misc-suc-viagem-dos-sonhos-light
Novos ícones:
icon-seguro-assistencia-empresarial
Ajuste de posição do helper-text no componente text-field-quantity
Ajustes nas nomeclaturas do ícones
Chart bar, adicionada a documentação de acessibilidade
Aplicar o text-bg-on-color nos bgs secundary
Chart donut, implementação da leitura da porcentagem, refinamento da leitura da legenda, atualização da documentação.
Overlay, ajuste/alteração de acessibilidade para o bloqueio de leitura do conteúdo atrás

# Publicada em 21/06/2024

# Versão 1.29.9
Visualizar documentação
Ajustar novo segmento com aplicação de cores primary-light ou primary-dark
Ajustes nos parametros do storybook componente Ribbon.
Invertida a compilação do tema Agora para antes do default.
Calendar:
adcionado breakpoint para resoluções abaixo de 360px
ajustes de espaçamento no modo list
ajuste acessibilidade do modo list
Text-field, ajuste da cor do ícone
Calendar mobile, novo template de calendário voltado para mobile
Snackbar, refinamento e documentação de acessibilidade
Adicionado grid bootstrap para uso interno no storybook
Novas ilustrações adicionadas:
boleto-suc-debito-automatico
adesao-suc-documento-pdf-pj
adesao-suc-data-aprovada
biometria-suc-facial
misc-suc-viagem-compras
adesao-suc-confirmacao-valor
misc-suc-viagem-dos-sonhos
adesao-suc-confirmacao
Novos ícones adicionados:
ui-search (substituição)
feedback-thumbs-up (substituição)
feedback-thumbs-down (substituição)
feedback-thumbs-up-filled
feedback-thumbs-down-filled
brand-livelo
transacional-livelo-mais-beneficios
Novas ilustrações animadas adicionadas:
misc-suc-viagem-dos-sonhos-dark
misc-suc-viagem-dos-sonhos-light
Documentar acessibilidade do componente Pagination
Documentação de acessibilidade do componente SideSheet
Documentar acessibilidade do componente Tabs
Documentar acessibilidade do componente Tag
Drag and drop, ajuste da documentação e exemplo no storybook
Adicionada documentação e funcionalidade de acessibilidade aos componentes:
timeline-stepper-vertical
## timeline-stepper-horizontal

# Publicada em 12/06/2024

# Versão 1.29.8
Visualizar documentação
Funcionalidade para que as barras do gráfico não se sobreponha.
Documentar acessibilidade do componente Text Link
Inclusão de novo tema.
Ajuste nos exemplos de uso no Storybook dos componentes:
text-field,
text-field-search,
## timeline-stepper horizontal e vertical

# Publicada em 31/05/2024

# Versão 1.29.6
Visualizar documentação
Carrossel, ajuste do bug de acessibilidade com a mudança do uso do componente e atualizado esse novo padrão de uso na documentação.
Documentação de acessibilidade do componente Quickbutton
Evoluir documentação do Sidesheet
Implementação da abertura da direita para esquerda
Nova classe para ter uma largura maxima
Ajustes do paddings
Documentação de acessibilidade do componente Progress Stepper,
Ajuste no problema do texto do button na versão oncolor
Progress-bar refinamento da acessibilidade e documentação
Progress circle refinamento da acessibilidade e documentação
Novas ilustrações adicionadas:
misc-suc-viagem-dos-sonhos
Novos ícones adicionados:
navigation-arrow-turn-right
navigation-arrow-turn-left
miscellaneous-office-manager
Atualização da documentação do componente Card Ribbon.
## Chat, revisão e atualização dos balões de mensagem

# Publicada em 03/05/2024

# Versão 1.29.4
Visualizar documentação
Ajuste do botão terciário quando é utilizado ícones
Atualização da documentação de Suporte
Documentação de acessibilidade do popover default
Novo componente Avatar para o chat
Ajuste da cor do modo oncolor do componente text-field, do ícone e seu background.
Documentação de acessibilidade do componente Pagination
Calendar, ajuste do alinhamento dos anos quando o total não é múltiplo de 3
Calendar, ajuste do espaçamento dos botões de navegação
Ícone pix-logo-outline substituído
Novos ícones adicionados:
brand-tag-bradesco-colar
brand-tag-bradesco
Novas ilustrações adicionadas:
shopping-next-suc-sacola-compras
erro-generico-err-inatividade
saque-cambio-suc-oferta-my-account
saque-cambio-suc-transacao-internacional
nao-correntista-suc-cielo-aproximacao-nfc
biometria-suc-facial
Novas animações adicionadas:
shopping-next-suc-sacola-compras-dark
shopping-next-suc-sacola-compras-light
Incluisão de componente/template input + contato (Bandeira)
Popover stepper, refinamento da acessibilidade
Popover tooltip, refinamento da acessibilidade
Evolução do componente Tab:
Ajustado problema da variável activeTab
Criado evento que é disparado sempre que uma Tab é selecionada

# Publicada em 22/04/2024

# Versão 1.29.1
Visualizar documentação
Alteração no componente Text Field Search
Documentação de acessibilidade do componente Text Field Search
Ajuste na classe de testes do componente Text Field Select
Documentação de acessibilidade do componente Overlay
Inclusão de novas ilustrações:
contatos-ale-bia-whatsapp
misc-ale-pesquisa-dados
misc-suc-instalar-certificado
nao-correntista-suc-tag-veloe-validada
Inclusão de novos ícones:
account-user
category-menu
Atualização dos componentes de chat
## Ajuste do carrossel, relacionado ao focus com autoplay

# Publicada em 16/04/2024

# Versão 1.28.9
Visualizar documentação
Refinamento e revisão de acessibilidade do componente Modal
Alterado gradiente primário e secundário do tema Empresas
Alteração de cores do componente Navbar nos segmentos Classic, Exclusive, Prime e Pivate
Alteração de cor padrão dos ícones nos segmentos Classic, Exclusive, Prime e Pivate
Disponibilização do botão terciário
Novos ícones adicionados:
feedback-thumbs-down
filetype-educacao-financeira
Ícones dos componentes de Chat adicionados:
component-timeout-circle
component-alert-circle
component-audio-mic
component-error-circle
component-pause
component-question-mark-circle
component-received
component-recharge
component-send
Nova animação adicionada:
## shopping-next-suc-ofertas

# Publicada em 11/04/2024

# Versão 1.28.8
Visualizar documentação
Ajuste no modo oncolor do text field
Componente Filter, adicionado o modo oncolor
Documentação de acessibilidade do componente Hide Text
Rating:
Ajustada acessibilidade para desktop e mobile
Melhoria na documentação de suporte
Novos ícones adicionados:
miscellaneous-family-office
ui-crop-rotate
filetype-stop
filetype-rec
filetype-pause
Slider, implementação de eventos para acessibilidade
Drag and Drop:
Implementação de acessibilidade para leitores de tela em iOS, Android e Desktop(NVDA)
Novo modo click, que permite a mudança de posição sem precisar arrastar. Importante para acessibilidade em Desktop(NVDA)
Atualização da documentação, explicação e exemplo para acessibilidade e o modo click
Chip Single:
Ajuste de borda no modo disabled do OnColor
Input Uploader
Documentação de acessibilidade do componente conforme instruído pela equipe de acessibilidade
Remoção do aria-live="polite"
Novas ilustrações adicionadas:
cadastro-ale-conta-encerrada
agora-suc-redirecionamento-bradesco
shopping-next-suc-ofertas
invest-facil-suc-app-documento
Novas animações adicionadas:
brad-animation-adesao_suc_foto_documento_frente_verso-dark
brad-animation-adesao_suc_foto_documento_frente_verso-light
brad-animation-adesao_suc_foto_documento-dark
brad-animation-adesao_suc_foto_documento-light
brad-animation-adesao_suc_foto_extrato-dark
brad-animation-adesao_suc_foto_extrato-light
brad-animation-adesao-suc-biometria-facial-aprovada-light
brad-animation-biometria-suc-chave-de-seguranca-light
brad-animation-biometria-suc-reconhecimento-facial-light
brad-animation-contratos-e-certificados-validacao-pagamento-light
brad-animation-ir-ale-ir-light
brad-animation-misc-suc-corban-bradesco-expresso-dark
brad-animation-misc-suc-corban-bradesco-expresso-light
brad-animation-nao-correntista-suc-cielo-carregamento-light
Storybook, ajustado para o pt-BR
Adicionada documentação de acessibilidade ao componente Slider
Remoção do Bootstrap
Os utilitários disponibilizados para o uso de grid são dependentes do bootstrap e houve uma mudança estratégica onde essa classes foram retiradas do nosso bundle
Otimização na folha de estilos, redução significativa no peso do arquivo css.
Documentação de acessibilidade do componente Navbar
Documentação de acessibilidade do componente Infobar
Documentação de acessibilidade do componente Load More
Documentação de acessibilidade do componente List Item
Refinamento e revisão de acessibilidade do componente Modal Dialog

# Publicada em 20/03/2024

# Versão 1.27.7
Visualizar documentação
Novo componente do chat Sendbox
Adicionada documentação de acessibilidade ao componente Switch
Adicionada documentação de acessibilidade ao componente Text-Field-Number
Adicionado documentação de acessibilidade ao componente radio-button
Revisão do componente Timeline Stepper
Ajuste do onColor do progress-stepper
Carousel:
Ajuste do erro quando usado carrossel sem as setas
Ajuste acessibilidade em modo não centralizado
Ajuste acessibilidade em modo loop
Correção do TextField para helper text que possui mais de uma linha
Alterado o componente Chips para padronizar o uso, e melhorar a experiência do usuario
Adicionado feature de dinamicidade quando o campo já ter valor no componente Text Field Expanded
Novos ícones adicionados:
financial-decreasing-table-sac
transacional-saque-aniversario
financial-table-fixed-price
Alteração na documentação, introduction.stories, para incluir urls dinâmicas de acordo com os ambientes em Institucional e Transacional
Correção na url do config.productions.js para adequar dinamicamente ao ambiente em Institucional e Transacional

# Publicada em 07/03/2024

# Versão 1.27.3
Visualizar documentação
Novo componente Avatar para o chat
Novo componente do chat, Chat-message.
Melhoria no modal e bottom-sheet, garantia do aparecimento
Encontramos problemas relacionados ao desempenho do projeto,
Overlay, melhoria nas chamadas de atualização do canvas
Popover-default, implementado a possibilidade de colocar o popover em qualquer container no HTML.
Popover, retorno da documentação.
Adicionada documentação de acessibilidade do componente text field quantity
Implementação da variação do oncolor no TextField Select
Alteração da cor/opacidade do container do oncolor em todos nos componentes do TextField
Novos ícones adicionados:
ui-crop
ui-rotate
financial-muito-baixo
financial-muito-alto
financial-alto
financial-medio
financial-baixo
Novas ilustrações adicionadas:
cartao-suc-limite
misc-ale-validacao-sms
dental-suc-plano-mais-sorrisos
Adicionada documentação de acessibilidade aos componentes Chip Delete, Chip Multi e Chip Single
Gradiente e wave provisórios adicionados aos segmentos legado classic-old, exclusive-old, prime-old e private-old

# Publicada em 01/03/2024

# Versão 1.27.2
Visualizar documentação
Adicionada documentação de acessibilidade ao componente Text-Field-Code;
Adicionado prefixo .liquid para projetos legados;
Drag-and-drop, ajuste de compatibilidade com zoom em iOS;
Ajuste na hierarquia de classes dos ícones no tema next
Ajuste de cores dos componentes no tema next
Alteração da ordenação de leitura do componente popover stepper para o leitor de telas
Modificação na documentação
Modificação na construção do HTML
Customização do componente Text Field Quantity movida para folha de estilos do tema empresas
Modal e Bottom-sheet, ajuste de bug ao abrir e fechar rapidamente
Text-field-search-view, ajuste na atualização da lista após escolhido uma das opções
## Novo tema do Ágora: brad-theme-agora

# Publicada em 22/02/2024

# Versão 1.27.0
Visualizar documentação
Página de bandeiras adicionada
Ajuste no Zoom do componente Popover.
Ajuste no Drag-and-Drop para permitir o uso de outros elementos html dentro do "container"
Adicionado novo componente Popover Default.
Ajuste de cores do botão secundário no tema next
Ajuste do text-field-select quando inicializado com oção selecionada
Novas ilsutrações adicionadas:
pagamentos-suc-carteira-digital-googlepay
adesao-suc-foto-documento-verso
adesao-suc-foto-documento-frente
adesao-suc-foto-extrato
adesao-suc-foto-documento
pagamentos-suc-carteira-digital-samsungpay
pagamentos-suc-carteira-digital-applepay
## nao-correntista-suc-tag-veloe-menor-validada

# Publicada em 15/02/2024

# Versão 1.26.8
Visualizar documentação
Gráficos
Adicionado novo componente gráfico Donut
Inclusão de novas ilustrações:
perfil-investidor-suc-mapa-de-investimento
saque-cambio-suc-transferencia-moeda-internacional
saque-cambio-ale-cotacao-moeda-internacional
Refatoração do CSS dos componentes Checkbox e Radio-button
misc-suc-bradesco-expresso
misc-suc-corbanpbradesco-expresso
Ajuste de motion no componente Pagination Bullets;
Criado o serviço de animations;
Melhora na acessibilidade e semântica do componente dropdown;
Documentada a acessibilidade do dropdown no storybook;
Inclusão de novos ícones:
financial-arrow-up
financial-arrow-down
transacional-livelo-capitalizacao
Criado a documentação de acessibilidade dos componentes de filtro (Multi Select e Single Select);
Bottom-sheet modal
Ajuste de acessibilidade através de display block/none para evitar leitura quando esta fechado.
Atualização da documentação, acrescentado a lógica de foco quando abrir ou fechar.
Implementação de "footer" estilizado na tabela;
Atualizado versão do Swiper para 11.0.5, onde é corrigido problema de scroll vertical ao estar movimentando o componente carrossel;
Drag-and-drop:
Ajuste do conflito do arrastar do drag com o scroll da tela que ocorre em mobile;
Criado a classe "brad-drag-and-drop-limit", para limitar a área de atuação do arraste dos elementos.
TextFieldSelect:
Adicionado type="button" nos botões
Criado nova função para atualizar as optionsSelect
Criado nova função para limpar os valores selecionados
Removido tag desnecessária de parágrafo quando não há um subtitle
Removido classe --md do botão primary e ajustado seu estilo
Carousel:
Realizados ajustes de acessibilidade para melhorar a experiência do usuário;
Centralizado e ajustado o posicionamento das setas de navegação do carousel, proporcionando uma navegação mais intuitiva e consistente.
Refatoração das fontes de ícone;
Novos ícones adicionados:
miscellaneous-hand-bag
miscellaneous-bed-sideview
miscellaneous-bed-frontview
miscellaneous-flight-to
miscellaneous-flight-back
miscellaneous-backpac
miscellaneous-bag
Refatoração no código do Switch: remoção de chamadas de mixins desnecessárias;
Retirando limitação de altura no Accordion;
Novas ilustrações adicionadas:
beneficios-err-sem-cesta
contatos-err-fone-golpe
misc-suc-beneficios-viagem
misc-suc-passaporte-visto-aprovado
misc-suc-viajem-dos-sonhos
saque-cambio-err-my-account-acima-12-anos
saque-cambio-err-my-account-cpf-cadastrado
Ajuste no Zoom Overlay Mask;
## Adicionado tamanho de fonte 14px para aparelhos com 320px;

# Publicada em 23/01/2024

# Versão 1.26.1
Visualizar documentação
Adicionado botão de fechar no componente Bottom-sheet "fixed" e "modal"
Inclusão de novas logos e ajuste de documentação e nome das classes.
Adicionado eventListener customizado ao componente Timeline-stepper
Form-field
Adicionado novo componente text-field-quantity
Incompatibilidade em versões antigas dos navegadores
Adicionado e configurado Babel no webpack gerar bundle com os polyfills necessários.
Introduzimos as seguintes bibliotecas para otimizar a compatibilidade:
core-js, @babel/plugin-proposal-decorators, @babel/plugin-syntax-class-properties, @babel/plugin-transform-private-methods, @babel/plugin-syntax-optional-chaining, @babel/plugin-transform-exponentiation-operator, @babel/plugin-transform-runtime.
Resolvemos problemas específicos em versões antigas dos navegadores:
Chrome 49 até 79: funcional;
Firefox 46 até 121: funcional;
Edge 80 até 120: funcional;
Opera 51 até 106: funcional;
Android 7 até 13: funcional.
Essas atualizações visam melhorar a estabilidade e a compatibilidade do aplicativo em diversas plataformas.
Corrigido motion do componente Drag and drop.
Adicionado eventListener customizado aos componentes Bottom-sheet e Bottom-sheet-expansive

# Publicada em 12/01/2024

# Versão 1.25.5
Visualizar documentação
Ajuste do evento customizado do componente Pagination
Retirada de CSS de tema das folhas de estilo dos componentes e inclusão do CSS nas folhas de tema dos seguintes componentes:
Button
FAB Button
Card
Carousel
Chip
Text-Field Code
Navbar
Pagination Bullets
Progress Stepper
Quickbutton
Tab
Tag
Timeline Stepper
Feature na Table:
Adicionado ActionBar
Adicionado evento de linhas selecionadas/desselecionadas
Feature no Calendar:
Adicionado parâmetro listMode, que mostra o calendário em forma de lista em scroll. (Mobile)
Adicionado parâmetros startYear e totalYear, que são configurações para o listMode true.
Adicionado exemplo na documentação a mudança de altura do calendario para o listMode true.
Novos ícones adicionados:
seguro-sem
seguro-cancelado
Correção das cores aplicadas nos estados hovered e pressed do componente Button
Correção das cores do componente Button no modo onColor
Ajustar componente Select:
Fix: Foi removido foco automático no campo do componente ao abrir página que tenha select
Ajuste na documentação do componente Select
Corrigido o select single disparando o evento de confirmação sem o clique do botão no mobile
Corrigido múltiplos disparados do evento de confirmar
Correção na documentação do Input Upload:
Remoção da variável requiredState da doc, que basicamente é usada na implementação do storybook.
Corrigido nome da função callbackAfterAddFile
Correção de text do componente popover-stepper. Ao concluir o tutorial o texto retorna ao estado inicial.
Adicionado eventListener customizado ao componente Snackbar
Corrigido evento "canceled" que não era disparado ao visualizar a modal de seleção e não escolher nada.
Novos ícones adicionados:
category-cat
category-dog
category-bird
category-rodent
Adicionado eventListener customizado ao componente Popover
Adicionado eventListener customizado ao componente Popover-stepper

# Publicada em 28/12/2023

# Versão 1.24.9
Visualizar documentação
Ajuste no exemplo de inicialização na documentação do componente Breadcrumbs
Inclusão de motion no componente Button
Drag and drop:
Incluido a lógica para o componente apresentar um tempo de espera do clique para o arrasto do item.(Mobile), com isso foram adicionados ao componente 3 callbacks de touch, e a função markDRag para atualizar a seleção do item em modo drag.
Incluido a opção de fazer o drag e realizar o scroll da tela, através da inclusão de uma classe css "brad-drag-and-drop-scroll".
Text-field-select:
Adicionar modo indeterminate as checkbox do select
Criar eventos customizados
Adicionado serviço de limitação de caracteres no componente badge
Calendar:
Adicionado parâmetro "manualSelection".
Adicionado métodos "setInitialInterval" e "setEndInterval".
Novo template do Calendar, exemplos com 1 ou 2 text-fields.
Nova ilustração adicionada:
## senha-suc-cadastrada-3

# Publicada em 15/12/2023

# Versão 1.24.5
Visualizar documentação
Novas ilustrações adicionadas:
boleto-err-bloqueio-judicial
boleto-err-conta-de-pagamento
boleto-err-debitos-multas-pendentes
boleto-err-debitos-pendentes
boleto-err-veiculo-detran
boleto-suc-pagamento-veiculos
consorcios-err-renavam
consorcios-err-veiculo-com-restricao
erro-generico-err-bloqueio
misc-ale-atualize-app-next
misc-ale-atualize-apps
misc-suc-agencia-digital
perfil-investidor-err-investimento-nao-concluido
perfil-investidor-err-saldo-insuficiente
Novos ícones adicionados:
financial-objetivo
financial-distribuicao
financial-composicao
Ajuste de código duplicado e bug no componente Calendar
Inclusão da documentação de acessibilidade para o componente Card
Documentação de acessibilidade para o componente Button
Inclusão da documentação de acessibilidade para o componente Breadcrumbs
Inclusão de template feedback
Ajuste de bug no button secondary nos temas -old
Inclusão de motion no componente Card
Text-field-select:
Ajuste, aceita number ao definir o "value" das opções
Adicionado novo parâmetro "dropdownMaxHeight" e o método "setDropdownMaxHeight" para configurar a altura máxima do dropdown com as opções(DESKTOP)
Adicionar modo indeterminate as checkbox do select
Criar eventos customizados
Novas features no componente Table:
Adicionado modo edição de linhas
Adiconado validação das linhas editadas
Alteração do ícone contact-agent-sac
Inclusão da documentação de acessibilidade para o componente Carousel

# Publicada em 29/11/2023

# Versão 1.24.3
Visualizar documentação
Evolução do componente Tag (novo tamanho incluso)
Evolução do componente Tabela:
Adicionado estado hover e pressed nos headers com ordenação
Criada opção de linhas zebradas (StripedRow)
Criada opção de linhas expansíveis (ExpansiveLine)
Criada opção de fixação das colunas (Frozen)
Atualização do componente Calendar:
Adicionado o seletor de mês
Remoção do parâmetro dateStartSelected
Adicionado o parâmetro selectedDates
Atualização da documentação e exemplo no storybook
Ajuste no componente Popover-stepper para que ele não sobrescreva o texto imputado no botão "Próximo"
Ajuste de espaçamento entre a tip e o elemento alvo no componente Popover e suas variações
Novas ilustrações adicionadas:
contatos-suc-email-next
credito-ale-simulador-de-emprestimos-next
Corrigido conflito de overlay quando os componentes brad-bottom-sheet e brad-modal-dialog estão abertos ao mesmo tempo
Evolução do componente Tabela:
Adicionado checkbox e seus estados customizados nas linhas.
Novos ícones adicionados:
transacional-transferencia-bancos
Evolução componente Rating:
Adicionado variações de tamanho sm, md e lg.
Inclusão dos temas: classic-old, exclusive-old, prime-old e private-old

# Publicada em 13/11/2023

# Versão 1.23.0
Visualizar documentação
Adicionado trailing icon interativo, button info e button text no componente text field
Inclusão da documentação de acessibilidade para os componentes BottomSheetExpansive e BottomSheet
Inclusão da documentação de acessibilidade do componente Badge
Inclusão da documentação de acessibilidade do componente Alert
Correção de funcionamento do componente Quickbutton no android e iOS:
Ajuste de erro que ocorre em versão mais antiga no iOS, removendo a atribuição de funções me variáveis no componente Table;
Nova feature no componente Chips:
Criado variação `Delete` do componente Chips:
Onde este modelo de Chip oferece a possibilidade do usuário remover o chip da tela, geralmente ele ocorre depois de um filtro que o usuário realiza.
Inclusão da documentação de acessibilidade do componente Accordion
Ajustes no componente text-field-select:
Novo método para alteração de valores via script dos dados inputados nele
Correção de bugs versão mobile (id duplicado, refatoração de métodos)
Tema empresas adicionado
Features/melhorias no componente table:
Adicionado hover nos headers com ordenação;
Adicionado opção de linhas zebradas;
Adicionado ícone de componente e alterado ícone de ordenação:
.icon-component-ascending;
.icon-component-descending.
Ajustes no componente Modal:
Novo método para fechar modal pelo botão esc
Criado métodos de acessibilidade ao abrir e fechar modal
Criado exemplo na doc de acessibilidade voltando foco ao elemento anterior
Ajustes no Drag and Drop:
Ajuste no mobile que não funcionava o click para troca dos elementos
Adicionado o callback para click
Adicionada novas features relacionadas ao retorno do callback ("willChangePosition" e "target")
Atualizado a documentação no exemplo de código relacionado ao click para mudança de container
Ajustes de motion para o componente Bottom Sheet
Ajuste na documentação do componente Accordion card
Correção de bug que adicionava scroll vertical no título do componente Tabs
Correção de bug que impedia de inicializar o componente Tabs com uma aba ativa que não a primeira
Ajuste de largura do elemento "placeholder-label-field" do componente Text-field

# Publicada em 03/11/2023

# Versão 1.21.6
Visualizar documentação
Ajuste do componente Badge:
Ajuste da borda para thin;
Atualização da documentação das cores disponíveis;
Atualização da documentação das classes das cores, moatrar o extended e neutral;
Nova feature de responsividade (expansivo/collapse) do componente Table;
Alinhamento ao centro do ícone e label do componente Filter;
Adicionado o novo service de Ilustrações Animadas;
Ajustado padding do componente snackbar;
Ajustado onColor do componente pagination bullets no tema next;
Atualizado a documentação da descrição do "loop", ajuste do bug na documentação e removido o botão oncolor;
Ajustada documentação do popover;
Ajuste de largura do modal na versão mobile;
Ajustado alinhamento do titulo header da tabela;
Ajuste do componente slider:
Ajustado o bug do desalinhamento quando o minimo é diferente de zero;
Alterações de cores, tipografias e alinhamentos;
Cores de alerta adicionadas nas opções de cor dos componentes progress-bar e progress-circle;
Alinhamento do texto e ícone do componente text-link no storybook;
Ajuste no alinhamento do componente tabs;
Ajuste no alinhamento do botão e cor da linha no componente Text-Field Search;
Ajuste do componente input uploader:
No storybook foi removido da pasta "forms", ficando agora na raiz dos componentes;
No exemplo do storybook, implementado a barra andando;
Revisado o cancelar e o excluir;
Adicionado motion ao componente Alert;
Ajuste de acessibilidade do componente chip;
Ajuste de acessibilidade do componente switch;
Ajuste de acessibilidade do componente radio e checkbox;
Popover stepper: adicionado o setup do "direction" para cada target da lista;
Ajustes de QA do componente Drag and Drop;
Adicionadas novas ilustrações:
shopping-next-ale-sacola-decompras;
saque-cambio-err-erro;
erro-generico-err-tempo-excedido;
misc-suc-produtos-para-sua-empresa;
boleto-suc-contratacao;
misc-suc-produto-contratado;
Adicionados novos ícones:
extrato-braille;
feedback-circle-warning;
miscellaneous-certification;
miscellaneous-book-open;
pix-scheduled;
miscellaneous-marital-status;
miscellaneous-pin;
financial-bitcoin;
transacional-agency;
Adicionado motion do componente Accordion;
Ajustes de QA do componente Text-Field Number;
Features e especificações novas no BottomSheet e BottomSheetExpansive:
Adicionado o X no canto direito do BottomSheet Modal, que pode ser ocultado, mas por padrão ele vem na documentação do componente;
Adicionada uma especificação de que é possível ocultar a label e apenas o puxador ficar visível no BottomSheetExpansive Drag;
Adicionado modo isLeavingScreenMode em que o BottomSheetExpansive ficará totalmente escondido enquanto estiver com o conteúdo fechado, e será aberto através de uma ação externa;
Ajustado altura máxima do BottomSheetExpansive, onde o componente pode chegar a 100% da tela conforme seu conteúdo, enquanto no BottomSheet acontecerá a mesma coisa porém com uma margem de 48px do topo.
Adicionado modo onColor do componente text-field no tema empresas
Correção de cores estado onColor desabilitado do componente text-field
Melhorias e novas especificações no TextFieldCode:
Adicionado demonstração de (desabilitar/habilitar) com botão nos stories do text-field-code;
Corrigido controlador disabled do stories default, antes apagava o que tinha sido digitado ao desabilitar, impossibilitando testar o comportamento com o campo preenchido.
Removida chamada de font-family icons-component do componente drag and drop
Adicionado novo ícone icon-brand-viva-prime-1-custom
Ajuste no problema da troca intermitente do enconding dos ícones

# Publicada em 03/10/2023

# Versão 1.21.1
Visualizar documentação
Adicionado no reset.scss configuração para remover arrows de todos os input:number
Ajustes no componente alert:
Adicionado componente btn-text no lugar da anchor a
Ajustado cor dos ícones em função de contraste
Ajustado centralização do ícone com título
Ajustado documentação
Ajuste de responsividade no componente Input Uploader
Corrigido componente card:
Ajustes de paddings
Ajuste de posicionamento do ícon no card com estado de ribbon
Criado serviço utilitário de Array
Ajustes no componente tab:
Ajustado scroll horizontal
Adicionado funcionalidade para o scroll horizontal acontecer automaticamente ao clicar no botão da tab
Ajuste no componente timeline:
Ajuste de posicionamento do mês com a data na primeira coluna
Alterada documentação de tipografia
Ajuste de documentação do componente List Item
Melhoria no componente tabela:
Adicionado parâmetro headerHozAlign na configuração da coluna, para mudar o alinhamento do título do header da tabela.
Ajuste de espaçamento entre o checkbox e label
Evolução do componente Radio button
Correção do ícone icon-component-delete-trash do componente input-uploader
Arquivos para geração de conte de ícones "icons.json" e "icons-component.json" adicionados em static/icons-json
Inclusão da variação on-color para o componente Accordion e ajuste de tamanho de titulo e ícone
Feature do componente chips:
Adicionado ícon plus (opcional) no modo não selecionado do chips (multi)
Arquivos para geração de fonte de ícones "icons.json" e "icons-component.json" adicionados em static/icons-json
Novas ilustrações adicionadas:
adesao-ale-solicitacao
cap-bradesco-ale-valor-na-data
misc-ale-app-mais-seguro
misc-ale-assinatura
contratos-e-certificados-ale-alteracao-nao-permitida
pets-ale-antipulgas
pets-ale-vacinacao
pets-ale-vermifugos
cap-bradesco-suc-max-conheca-a-capitalizacao
cartao-suc-adicional-ok
cartao-suc-beneficios-credito
cartao-suc-pontos
contatos-suc-notificacoes-habilitadas-next
misc-suc-agencia-localizacao-data-marcada
misc-suc-app-bradesco-redirecionamento-bradesco-bank
misc-suc-assinatura
misc-suc-perfil-agro-adesao
misc-suc-perfil-de-comunidade-PJ
misc-suc-WhatsApp-pay
transferencia-suc-limite-diurno-noturno
transferencia-suc-limite-noturno
transferencia-suc-limite-regras
## Adicionado classes de padding e margin none;

# Publicada em 26/09/2023

# Versão 1.20.3
Visualizar documentação
Alterada as cores de transparent para valor rgba;
Alterado line-height-md de 24px para 20px;
Revisão de margen dos componentes:
bottom-sheet
text-field-search
infobar
modal
popover
side-sheet
snackbar
tabs
Novo componente calendar;
Ajuste no ícone do Text Field Select;
Ajuste no on-color do timeline-stepper;
Ajuste tema next do timeline-stepper;
Alterada rotação ícone brand-open-finance
Removido ícone brand-open-finance-white
Novos ícones adicionados:
brand-open-finance-custom
category-vaccine
filetype-document-IR
ui-click
miscellaneous-flea
miscellaneous-vermifuge
miscellaneous-map
category-shopping-box-notification
category-shopping-box-reload
category-shopping-box-exclude
category-shopping-box-add
category-shopping-box-check
category-shopping-box
feedback-plus-add
feedback-error-delete
Adição do serviço do overlay nos seguintes componentes:
bottom-sheet
bottom-sheet-expansive
modal
side-sheet
Corrigido OnColor do LoadMore;
Adicionado OnColor no brad-btn-text;
Criado componente Rating;
Atualizado font de ícones de componentes;
Adicionado: icon-component-star;
Atualizada documentação do componente SideSheet;
Ajuste na documentação do text-field-select;
Ajuste na posição da label do text-field-select;
Adicionado OnColor PaginationBullets e corrigido OnColor para o tema Next
Ajuste de fonte do component tabs, alterada de 16px para 14px;
Ajustado cor do ícone default e cor das linhas de cada estado do infobar

# Publicada em 12/09/2023

# Versão 1.19.8
Visualizar documentação
Alterada a wave do tema empresas
Corrigido bug que impedia o uso de classes de shadow e border-radius
Corrigido ícone da tabela e espaçamento que fazia com que o ícone ficasse colado à direita
Ajuste na largura do popover tooltip (mobile)
Ajuste de font-size no reset
Novos ícones adicionados:
financial-hand-money
brand-menu-prime
transacional-boleto-pix
ui-copy-paste-1
ui-save
Adicionado modo onColor do componente slider
## Ajuste da documentação do text-field-search

# Publicada em 26/08/2023

# Versão 1.19.3
Visualizar documentação
Nova documentação de ilustrações
Novo serviço infinite scroll
Adicionado modo onColor no componente load more
Ajuste componente Overlay
Adicionados gradientes extended
Novos ícones adicionados:
brand-menu-prime
cartao-instantaneo
cartao-maquininha-aproximacao
feedback-error-disabled
feedback-info-disabled
feedback-success-disabled
financial-information-data
miscellaneous-light-tip-outline
miscellaneous-ticket-percent
miscellaneous-water
transacional-carteira-digital
transacional-notificacao-app
## Adição do SRI integrity automatizado

# Publicada em 18/08/2023

# Versão 1.19.1
Visualizar documentação
Adicionado componente input-uploader
Adicionado componente breadcrumbs
Adicionado componente load-more
Adicionadas novas ilustrações de sucesso, alerta e erro
Adicionados novos ícones:
icon-filetype-funds
icon-miscellaneous-tag-veloe
icon-transacional-perfil-investidor
icon-transacional-recommendation
icon-ui-tranferencia
Alterada classe do ícone icon-ui-icon-list-item para icon-ui-list-item
Alterada classe do ícone icon-ui-icon-placeholder para icon-ui-placeholder
Alterada classe da ilustração open-finance-ale-controne-financas para open-finance-ale-controle-financas
## Ajuste para sepação do reset no projeto

# Publicada em 09/08/2023

# Versão 1.18.9
Visualizar documentação
Adição do componente Timeline
Novas features e refatoração do Drag and Drop
Adequação das cores cta no tema Next
Adicionado o tema next no utilitário waves
Adicionada variação de tamanho -sm, -md e -lg ao componente brad-filter
Adicionada variação glass-dark ao componente btn-icon
Adicionada variação glass-light e glass-dark ao componente btn-text
Adicionado tema empresas para os componentes:
brad-card
brad-button-primary
brad-button-secondary
brad-button-quickbutton
brad-button-icon
brad-button-text
brad-button-fab-icon
brad-button-fab-label
brad-loader
brad-nav-bar-line
brad-nav-bar-bubble
brad-pagination-bullets
brad-progress-stepper
brad-tab
brad-timeline-stepper-vertical
brad-timeline-stepper-horizontal
Atualização do drag-and-drop
Autoplay do carrossel
Gerada uma folha de estilo separada para o reset
Adicionado componente pagination
Atualização do componente modal e modal dialog
Ajuste de borda do componente quickbutton
Inclusão de ícone opcional no button default e quickbutton
Remoção do botão tertiary
Ajuste das bordas do button secondary para 1.4 px
Criação de parametro no button text para retirar background e padding
Mudança no hover do button-text
Adicionado tema empresas para os componentes:
brad-text-field
brad-text-field-code
brad-text-field-number
brad-text-field-search
Alteração de altura do utilitário waves e adicionados os seguintes temas:
corporate
empresas
expresso
Adicionado componente brad-text-field-select
## Adicionado css-minimizer-webpack-plugin

# Publicada em 29/07/2023

# Versão 1.18.7
Visualizar documentação
Novo componente table;
Adição da funcionalidade onColor ao componente Popover (tooltip,stepper e template);
Ajustes icon size - brad-icon-size-xl: 48px, brad-icon-size-xxl: 56px,;
Adição de motion tokens;
Adição do componente skeleton;
Correção na introdução da documentação substituição de defet por defer
Ilustração:
erro-generico-err-desk;
misc-ale-app-e-mobile;
Ícones:
brand-open-finance-white;
filetype-cancel-document;
filetype-delete-document;
financial-money;
miscellaneous-usa-bank-flag;
pix-bring-money;
token-lock-open;
ui-arrow-share-receipt;
Adição do componente Text Field Search;
Melhorias nos componentes: Card e Navbar bubble;
adicionada classe brad-glass-light-xd;
removido propriedades de borda, arredondamento e elevação das classes de glasmorphysm;
adicionado glassmorphysm ao componente brad-navbar-bubble;
alterado cor de ícone do componente brad-navbar-bubble;
alterado cor de label e peso de fonte do componente brad-navbar-bubble;
adicionado glassmorphysm brad-glass-light ao componente brad-btn-icon.
## Adição do tema next;

# Publicada em 05/07/2023

# Versão 1.18.3
Visualizar documentação
Ajuste nas imagens que estavam aparecendo;
## Correção de acessibilidade no text-field-code;

# Publicada em 26/06/2023

# Versão 1.18.1
Visualizar documentação
Ajustes Bug Safari 14;
Ajuste no overlay que aparecia sobre o modal no Safari;
Adicionado ilustração para teste no android 6;
Ajustes do show code do storybook.
Novo componente Timeline steper vertical;
Revisão do Radio button:
Revisão dos estilos do modo selecionado;
Revisão de borda, utilizando brad-border-thin;
Revisão de animação do estado Hovered, alterado para usar fade-in e fade-out de opacidade;
Revisão para que o estado Hovered aconteça ao passar o cursor na Label;
Adicionado borda ribbon no card;
Componente Popover tooltip;
Novos Componentes e utilitários:
Novo componente side-sheet;
Novo utilitário scrollbar;
Novo componente timeline stepper horizontal;
Novo componente filter;
Novo componente Timeline stepper vertical;
## Novo componente drag-and-drop;

# Publicada em 02/06/2023

# Versão 1.17.7
Visualizar documentação
Adicionado cor brad-color-institucional;
Ajuste nas cores secundárias dos segmentos;
O nome da cor brad-color-neutral-60 (#000000) foi alterado para brad-color-neutral-100;
Nova cor brad-color-neutral-60: 38, 38, 38; // #262626;
Adicionado cor xlight nas cores de alert (alert-info-light, alert-success-light, alert-warning-light, alert-error-light);
Alterações no componente hide Text:
Adicionado a classe de prevente select;
Corrigido nome de hide-vale para hide-text;
Exemplos no storybook mais genéricos;
Adicionado color seudárias no tema do Classic (são as mesmas do primário);
Exemplos dos TextFields genéricos;
Alterações componente Chip:
Ajuste na margem entre ícone e label para 4px;
Removido controles de text-color e bg-color do storybook;
Alterações no componente Switch:
Alteração no ajuste da borda, ultilizando token brad-border-thin;