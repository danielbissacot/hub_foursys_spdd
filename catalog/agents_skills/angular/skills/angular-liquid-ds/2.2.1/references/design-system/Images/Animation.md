# Animation
## Breaking Change

O serviço animations passou por uma mudança significativa. Para melhorar a performance e reduzir o tamanho do bundle da biblioteca Liquid, removemos todos os bundles externos, incluindo o do Lottie, que é usado internamente pelas animações. Agora, adotamos técnicas de code splitting e lazy loading, fazendo com que o Lottie só seja carregado na primeira vez que o serviço for instanciado na navegação.




Por conta disso, o carregamento do Lottie é assíncrono. Isso significa que o uso do serviço animations agora requer o uso de Promise ou async/await para garantir que o carregamento e a inicialização estejam completos antes da utilização.




Recomendamos a leitura detalhada da documentação abaixo para entender as novas formas de uso e garantir a correta implementação.

Animações em JSON de elementos integrados por meio do Lottie, para seu uso, copiar o id ao clicar em cada animação, adicionar no id do elemento html que queira fazer aparecer a animação e utilizar no parâmetro animationName do serviço.

# Uso do HTML
```
<div id="brad-animation-loader_validacao_animado_v3"></div>
```
Comportamento Javascript
## Inicialização

## Inicializar elementos do Animation

```
const options = {
targetSelector: `#brad-animation-loader_validacao_animado_v3`,
animationName: "loader_validacao_animado_v3",
loop: true,
autoplay: true,
};

LiquidCorp.BradAnimationService.getInstance(options).then((service) => console.log(service))
```
## getInstances

O getInstances será usado quando tem a necessidade de criar mais de uma instancia de um componente, ele retorna um array de instâncias para cada elemento. Basta passar no parametro um array de objetos [Object ], por exemplo [{targetSelector: "#id1"}, {targetSelector: "#id2"}, {targetSelector: "#id3"}, ...].

# Options

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | string | - | #ID ou .classe vinculado ao HTML do componente |
| animationName | string | - | Nome da animação que será utilizada, seguindo as opções disponibilizadas no enum ANIMATIONS_OPTIONS |
| loop | boolean | true | Determina se a animação rodará em loop |
| autoplay | boolean | true | Determina se a animação rodará automaticamente |

# Métodos

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| playAnimation | - | Inicia a animação |
| pauseAnimation | - | Pausa a animação |
| stopAnimation | - | Para a animação |
| setAnimationSpeed | speed: number | Altera a velocidade da animação |
| setAnimationDirection | direction: number | Altera a direção da animação, sendo 1 para a direção original e -1 para ao contrário |
| destroyAnimation | - | Remove a animação |
| setAnimationLoop | active: boolean | Altera se a animação rodará em loop ou não |
| toggleAnimationPlay | - | Alterna entre play e pause dependendo do ultimo estado da execução da animação |
| resizeAnimation | - | Alterna a proporção da animação de acordo com a tela |
| getIfAnimationIsPlaying | - | Retorno se a animação está rodando ou não |
| hideAnimation | - | Esconde a animação |
| showAnimation | - | Exibe a animação |

# Uso básico
```
const options = {
targetSelector: `#brad-animation-item`,
animationName: "loader_validacao_animado_v3",
loop: true,
autoplay: true,
};

LiquidCorp.BradAnimationService.getInstance(options).then((service) => {
const element = service.eAnimation;

element.addEventListener("end", () => console.log("Ended"));
element.addEventListener("loopEnd", () => console.log("Loop Completed"));

service.playAnimation();
service.pauseAnimation();
})
```
Exemplos
Default
```
<div>
    <h1 class="brad-font-title-md brad-flex brad-flex-align-items-center brad-m-sm-b">
      <span class="brad-m-xs-r">
        Total de animações criadas/filtradas: 48
      </span>
      <em class="icon-ui-search brad-m-xxs-l"></em>
    </h1>

    <div class="brad-flex brad-flex-wrap brad-animation-list">
      
  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-adesao-suc-biometria-facial-aprovada-light-134"></div>
    <p class="brad-font-subtitle-xs">brad-animation-adesao-suc-biometria-facial-aprovada-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-adesao_suc_foto_documento-dark-226"></div>
    <p class="brad-font-subtitle-xs">brad-animation-adesao_suc_foto_documento-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-adesao_suc_foto_documento-light-144"></div>
    <p class="brad-font-subtitle-xs">brad-animation-adesao_suc_foto_documento-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-adesao_suc_foto_documento_frente_verso-dark-126"></div>
    <p class="brad-font-subtitle-xs">brad-animation-adesao_suc_foto_documento_frente_verso-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-adesao_suc_foto_documento_frente_verso-light-196"></div>
    <p class="brad-font-subtitle-xs">brad-animation-adesao_suc_foto_documento_frente_verso-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-adesao_suc_foto_extrato-dark-68"></div>
    <p class="brad-font-subtitle-xs">brad-animation-adesao_suc_foto_extrato-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-adesao_suc_foto_extrato-light-188"></div>
    <p class="brad-font-subtitle-xs">brad-animation-adesao_suc_foto_extrato-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-biometria-suc-chave-de-seguranca-light-198"></div>
    <p class="brad-font-subtitle-xs">brad-animation-biometria-suc-chave-de-seguranca-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-biometria-suc-reconhecimento-facial-light-360"></div>
    <p class="brad-font-subtitle-xs">brad-animation-biometria-suc-reconhecimento-facial-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-contratos-e-certificados-validacao-pagamento-light-270"></div>
    <p class="brad-font-subtitle-xs">brad-animation-contratos-e-certificados-validacao-pagamento-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-ir-ale-ir-light-127"></div>
    <p class="brad-font-subtitle-xs">brad-animation-ir-ale-ir-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-loader_validacao_animado_v3-322"></div>
    <p class="brad-font-subtitle-xs">brad-animation-loader_validacao_animado_v3</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-misc-suc-corban-bradesco-expresso-dark-191"></div>
    <p class="brad-font-subtitle-xs">brad-animation-misc-suc-corban-bradesco-expresso-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-misc-suc-corban-bradesco-expresso-light-302"></div>
    <p class="brad-font-subtitle-xs">brad-animation-misc-suc-corban-bradesco-expresso-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-misc-suc-viagem-dos-sonhos-dark-418"></div>
    <p class="brad-font-subtitle-xs">brad-animation-misc-suc-viagem-dos-sonhos-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-misc-suc-viagem-dos-sonhos-light-135"></div>
    <p class="brad-font-subtitle-xs">brad-animation-misc-suc-viagem-dos-sonhos-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-nao-correntista-suc-cielo-carregamento-light-139"></div>
    <p class="brad-font-subtitle-xs">brad-animation-nao-correntista-suc-cielo-carregamento-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-shopping-next-suc-ofertas-light-170"></div>
    <p class="brad-font-subtitle-xs">brad-animation-shopping-next-suc-ofertas-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-shopping-next-suc-sacola-compras-dark-411"></div>
    <p class="brad-font-subtitle-xs">brad-animation-shopping-next-suc-sacola-compras-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-shopping-next-suc-sacola-compras-light-23"></div>
    <p class="brad-font-subtitle-xs">brad-animation-shopping-next-suc-sacola-compras-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-adesao-ale-carregando-abertura-conta-dark-222"></div>
    <p class="brad-font-subtitle-xs">brad-animation-adesao-ale-carregando-abertura-conta-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-adesao-ale-carregando-abertura-conta-light-233"></div>
    <p class="brad-font-subtitle-xs">brad-animation-adesao-ale-carregando-abertura-conta-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-nao-correntista-suc-cielo-tap-maquininha-light-302"></div>
    <p class="brad-font-subtitle-xs">brad-animation-nao-correntista-suc-cielo-tap-maquininha-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-nao-correntista-suc-cielo-tap-maquininha-dark-126"></div>
    <p class="brad-font-subtitle-xs">brad-animation-nao-correntista-suc-cielo-tap-maquininha-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-45"></div>
    <p class="brad-font-subtitle-xs">brad-animation</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-biometria-suc-chave-de-seguranca-dark-16"></div>
    <p class="brad-font-subtitle-xs">brad-animation-biometria-suc-chave-de-seguranca-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-biometria-suc-facial-dark-45"></div>
    <p class="brad-font-subtitle-xs">brad-animation-biometria-suc-facial-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-biometria-suc-facial-light-209"></div>
    <p class="brad-font-subtitle-xs">brad-animation-biometria-suc-facial-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-biometria-suc-reconhecimento-facial-dark-309"></div>
    <p class="brad-font-subtitle-xs">brad-animation-biometria-suc-reconhecimento-facial-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-contratos-e-certificados-ale-validacao-pagamento-dark-234"></div>
    <p class="brad-font-subtitle-xs">brad-animation-contratos-e-certificados-ale-validacao-pagamento-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-contratos-e-certificados-ale-validacao-pagamento-light-167"></div>
    <p class="brad-font-subtitle-xs">brad-animation-contratos-e-certificados-ale-validacao-pagamento-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-ir-ale-ir-dark-151"></div>
    <p class="brad-font-subtitle-xs">brad-animation-ir-ale-ir-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-nao-correntista-suc-cielo-carregamento-dark-199"></div>
    <p class="brad-font-subtitle-xs">brad-animation-nao-correntista-suc-cielo-carregamento-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-shopping-next-suc-ofertas-dark-321"></div>
    <p class="brad-font-subtitle-xs">brad-animation-shopping-next-suc-ofertas-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-adesao-suc-biometria-facial-aprovada-dark-274"></div>
    <p class="brad-font-subtitle-xs">brad-animation-adesao-suc-biometria-facial-aprovada-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-misc-suc-ilustracao-conclusao-dark-255"></div>
    <p class="brad-font-subtitle-xs">brad-animation-misc-suc-ilustracao-conclusao-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-misc-suc-ilustracao-conclusao-light-403"></div>
    <p class="brad-font-subtitle-xs">brad-animation-misc-suc-ilustracao-conclusao-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-beneficios-suc-carregando-dados-dark-258"></div>
    <p class="brad-font-subtitle-xs">brad-animation-beneficios-suc-carregando-dados-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-beneficios-suc-carregando-dados-light-399"></div>
    <p class="brad-font-subtitle-xs">brad-animation-beneficios-suc-carregando-dados-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-beneficios-suc-carregando-dark-18"></div>
    <p class="brad-font-subtitle-xs">brad-animation-beneficios-suc-carregando-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-beneficios-suc-carregando-light-185"></div>
    <p class="brad-font-subtitle-xs">brad-animation-beneficios-suc-carregando-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-chave-de-seguranca-suc-generica-dark-56"></div>
    <p class="brad-font-subtitle-xs">brad-animation-chave-de-seguranca-suc-generica-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-chave-de-seguranca-suc-generica-light-97"></div>
    <p class="brad-font-subtitle-xs">brad-animation-chave-de-seguranca-suc-generica-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-nao-correntista-suc-cartoes-light-112"></div>
    <p class="brad-font-subtitle-xs">brad-animation-nao-correntista-suc-cartoes-light</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-nao-correntista-suc-cartoes-dark-269"></div>
    <p class="brad-font-subtitle-xs">brad-animation-nao-correntista-suc-cartoes-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-misc-suc-avaliacao-experiencia-272"></div>
    <p class="brad-font-subtitle-xs">brad-animation-misc-suc-avaliacao-experiencia</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-misc-suc-conclusao-avaliacao-exp-dark-377"></div>
    <p class="brad-font-subtitle-xs">brad-animation-misc-suc-conclusao-avaliacao-exp-dark</p>
  </div>

  <div title="Clique para copiar classe 😀" onclick="navigator.clipboard.writeText(this.children[1].innerHTML)" class="brad-card brad-card--default brad-p-lg">
    <div id="brad-animation-misc-suc-conclusao-avaliacao-exp-light-42"></div>
    <p class="brad-font-subtitle-xs">brad-animation-misc-suc-conclusao-avaliacao-exp-light</p>
  </div>

    </div>
  </div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| animations | Filtre a animação pelo nome da classe string |  |  |