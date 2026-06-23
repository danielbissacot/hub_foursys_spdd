# InputUploader

Upload é o processo de publicar um arquivo ou informação (texto, imagem, vídeo, etc...) em um servidor remoto através da página da web ou da ferramenta de upload

# Uso do HTML
```
<div id="brad-input-uploader" class="brad-input-uploader">
  <div class="brad-input-uploader__description">
    <p
      tabindex="1"
      class="brad-input-uploader__description-paragraph brad-font-subtitle-sm"
    >
      Arquivo válidos: JPG ou PDF, com tamanho máximo de até 20mb.
    </p>
  </div>

  <div class="brad-input-uploader__content">
    <label
      class="brad-input-uploader__content-label--disabled"
      draggable="true"
    >
      <em
        aria-hidden="true"
        class="brad-input-uploader__content-label-icon i icon-component-export"
      ></em>
      <span class="brad-input-uploader__content-label-text-information">
        <em
          title="Selecione o arquivo ou arraste e solte aqui"
          class="brad-input-uploader__content-label-text-information-select brad-font-title-md desktop-text"
        >
          Selecione o arquivo ou arraste e solte aqui
        </em>
        <em
          class="brad-input-uploader__content-label-text-information-select brad-font-title-md mobile-text"
        >
          Selecione o arquivo
        </em>
        <em
          class="brad-input-uploader__content-label-text-information-required--required brad-font-subtitle-xs"
        >
          <b class="brad-font-subtitle-xs">Obrigatório</b>: Nome do Arquivo
        </em>
      </span>
      <span
        role="button"
        tabindex="1"
        class="brad-input-uploader__content-label-button brad-btn brad-btn-secondary"
      >
        Selecionar o arquivo
      </span>
      <input
        class="brad-input-uploader__content-label-input"
        type="file"
        name="brad-input-uploader"
        disabled
        required
        multiple
      />
    </label>
  </div>
</div>
```
Atributos do Componente <input> (.brad-input-uploader__content-label-input)

O componente <input> possui três atributos importantes que controlam seu comportamento e validação. A seguir, estão as descrições detalhadas de cada um deles:

# disabled

Descrição: Quando o atributo disabled é adicionado, o componente se torna desabilitado, impedindo que o usuário interaja com ele (não será possível selecionar arquivos para upload). Além disso, é necessário adicionar a classe brad-input-uploader__content-label--disabled no lugar de brad-input-uploader__content-label para garantir que o estilo de desabilitado seja aplicado corretamente.
Uso: Utilize este atributo caso queira bloquear o uso do componente temporariamente.
Exemplo:
```
<label class="brad-input-uploader__content-label--disabled" draggable="true"></label>
```
```
<input type="file" name="brad-input-uploader" class="brad-input-uploader__content-label-input" disabled/>
```



# required

Descrição: Quando o atributo required é adicionado, o campo se torna obrigatório, ou seja, o usuário não poderá enviar o formulário sem selecionar um arquivo. Além disso, é necessário substituir a classe brad-input-uploader__content-label-text-information-required por brad-input-uploader__content-label-text-information-required--required para garantir que o estilo de "obrigatório" seja aplicado corretamente.

Uso: Utilize este atributo se for necessário garantir que o usuário faça o upload de um arquivo antes de enviar o formulário.

# Exemplo:

```
<em class="brad-input-uploader__content-label-text-information-required--required brad-font-subtitle-xs">
<b class="brad-font-subtitle-xs">Obrigatório</b>: Nome do Arquivo
</em>
```
```
<input type="file" name="brad-input-uploader" class="brad-input-uploader__content-label-input" required/>
```



# multiple

Descrição: Quando o atributo multiple é adicionado, permite que o usuário selecione mais de um arquivo para upload ao mesmo tempo. Além disso, é necessário passar a variável isMultipleFiles como true para o serviço para que ele reconheça que múltiplos arquivos serão carregados.

Uso: Utilize este atributo quando você deseja permitir a seleção de múltiplos arquivos.

# Exemplo:

```
<input type="file" name="brad-input-uploader" class="brad-input-uploader__content-label-input" multiple/>
```

## No serviço, você também deve configurar:

isMultipleFiles: true ao iniciar serviço.



Esses atributos permitem configurar a interação do usuário com o campo de upload de arquivos, controlando se ele pode ser desabilitado, se o upload é obrigatório ou se múltiplos arquivos podem ser selecionados.

# Comportamento Javascript
## Inicialização

## Inicializar elementos do Input Uploader

```
const id = "brad-input-uploader";
  const options = {
    targetSelector: `#${id}`,
    disable: false,
    required: false,
    allowedExtensions: ["jpeg", "pdf"],
    isMultipleFiles: false,
    maximumSize: 20000000,
    callbackAfterAddFile: handleFileAddition,
  };

  const service = LiquidCorp.BradInputUploaderService.getInstance(options);

  /**
   * Função que lida com a adição de arquivos ao serviço de upload.
   *
   * Essa função configura o evento de clique no botão de ação do uploader para permitir
   * a remoção de arquivos e inclui uma lógica para o upload de arquivos e adição (a ser implementada).
   *
   * @param {Object} uploaderProgressService - O serviço que gerencia o progresso de upload e as interações do uploader.
   * Esse objeto deve ter o método `addClickEventOnActionButton` para associar um evento de clique ao botão de ação (x) ou (lixeira).
   *
   * @returns {void} - Não retorna nenhum valor.
   */
  function handleFileAddition(uploaderProgressService) {
    const files = service.getFiles();
    const lastFile = files[files.length - 1];
    uploaderProgressService.addClickEventOnActionButton(handleDiscard);

  if (!validateFileUpload(uploaderProgressService, lastFile)) return;
    /* TODO: Adicionar integração com upload do arquivo, e lógica de adição. */
    /* Exemplos de implementações: (implementadas na sessão de 'Exemplo de Função para o Chamar no Método handleFileAddition') */
    /* exampleFileUploadProgress(uploaderProgressService); */
    /* exampleFileUploadSuccess(uploaderProgressService); */
    /* exampleFileSizeError(uploaderProgressService); */
    /* exampleFileExtensionCheck(uploaderProgressService); */
  }

  /**
   * Função que lida com o evento de seleção de arquivo no uploader.
   *
   * Quando acionada, a função cancela a seleção anterior de arquivo (chamando `handleDiscard`),
   * e em seguida simula um clique no botão de seleção de arquivo.
   *
   * @param {Event} event - O evento disparado ao tentar selecionar um arquivo. Esse evento
   *                         é passado para a função `handleDiscard` para realizar a lógica de descartar
   *                         a seleção anterior, se necessário.
   *
   * @returns {void} - Não retorna nenhum valor.
   */
  function handleSelectFile(event) {
    const eSelectFileButton = document.querySelector(
    `#${id} .brad-input-uploader**content .brad-input-uploader**content-label-button`
    );
    handleDiscard(event);
    eSelectFileButton.click();
  }
  /**
   * Função que lida com a remoção de arquivos do uploader ao clicar no ícone de (x) ou (lixeira).
   *
   * Se o uploader permitir múltiplos arquivos, o arquivo será removido diretamente do DOM.
   * Caso contrário, o arquivo será removido e a área de upload será reexibida.
   *
   * @param {Event} event - O evento disparado ao tentar descartar o arquivo, utilizado para
   * identificar e remover o arquivo correspondente ao ícone clicado.
   *
   * @returns {void} - Não retorna nenhum valor.
   */
  function handleDiscard(event) {
    const isMultipleFiles = service.getIsMultipleFiles() === "multiple";

    if (isMultipleFiles) {
      event.target.parentNode.parentNode.remove();
    } else {
      event.target.parentNode.parentNode.parentNode.remove();
      document.querySelector(
        `#${id} .brad-input-uploader__content`
      ).style.display = "block";
    }
  }

*/

/**

- Valida o upload de um arquivo, verificando a extensão e o tamanho do arquivo.
-
- @param {Object} uploaderProgressService - Serviço responsável por gerenciar o progresso do upload.
- @param {File} file - O arquivo a ser validado.
- @returns {boolean} Retorna `true` se o arquivo for válido, `false` caso contrário.
*/
function validateFileUpload(uploaderProgressService, file) {
const validationResults = [
{
isValid: service.checkIfIsAllowedExtension(file),
errorMessage:
"O formato do arquivo não é compatível. Altere para JPEG ou PDF e tente novamente.",
},
{
isValid: service.checkMaximumSize(file),
errorMessage:
"O tamanho do arquivo não é compatível. Altere para um tamanho menor e tente novamente.",
},
];

return validateFileConditions(validationResults, uploaderProgressService);
}
/**

- Valida as condições de um arquivo baseado nos resultados de validação fornecidos.
- @param {Array} validationResults - Lista de resultados de validação (com propriedades `isValid` e `errorMessage`).
- @param {Object} uploaderProgressService - Serviço responsável por gerenciar o progresso do upload.
- @returns {boolean} Retorna `true` se todas as validações passarem, `false` caso contrário.
*/
function validateFileConditions(validationResults, uploaderProgressService) {
let isValid = true;
validationResults.forEach((result) => {
if (!result.isValid) {
handleValidationError(uploaderProgressService, result.errorMessage);
isValid = false; // Marca como inválido caso haja um erro
}
});
return isValid; // Retorna true se todas as validações passarem, false caso contrário
}

/** Lida com o erro de validação, exibindo mensagens de erro e ajustando o estado do serviço de upload.

-
- @param {Object} uploaderProgressService - Serviço responsável por gerenciar o progresso do upload.
- @param {string} message - Mensagem de erro a ser exibida.
- @returns {boolean} Retorna `true` indicando que houve erro.
*/
function handleValidationError(uploaderProgressService, message) {
uploaderProgressService
.setStatus("error")
.setPercentProgressBarLine(100)
.setHelpTextDescription(`<p>${message}</p>`)
.addClickEventOnActionButton(handleDiscard)
.addClickEventOnReplaceFileButton(handleSelectFile);

return true; // Indica que houve erro
}
```
## Options (InputUploaderService)

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| targetSelector | String | - | #ID ou .classe vinculado ao HTML do componente |
| disabled | Boolean | false | Desabilita o componente |
| allowedExtensions | Array | - | Indica quais extensões de arquivo são permitidas |
| isMultipleFiles | Boolean | false | Habilita multiplos arquivos selecionado |
| maximumSize | Integer | - | Indica qual o tamanho máximo de um arquivo |
| callbackAfterAddFile | BradUploaderProgressService | - | Configura uma função anonima com o primeiro parametro sendo um objeto do tipo BradUploderProgressService, essa função é disparada após a seleção de cada arquivo |

# Metódos (InputUploaderService)

Lembrando que para o uso dos métodos é necessário passar pelo processo de e :


| Método | Tipo | Descrição |
| --- | --- | --- |
| getInstance | Options | Cria uma instância do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getInstances | [Options] | Cria uma instância para cada options (array) do serviço que fará a gestão do HTML que esteja relacionado ao #ID ou .classe passado no options |
| getFiles | N/A | Obtém todos os arquivos selecionados |

# UploaderProgress
## Comportamento Javascript

Este serviço é utilizado em conjunto com Input Uploader Service através de injeção de depedencia.

## Options (UploaderProgressService)

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | - | #ID ou .classe vinculado ao HTML do componente |
| bradInputUploader | BradInputUploaderService | - | Instancia da classe de serviço BradInputUploaderService |

## Metódos(UploaderProgressService)

Esses métodos são idealmente utilizados dentro da função anônima criada no método callbackAfterAddFile do Input Uploader Service.


| Método | Tipo | Descrição |
| --- | --- | --- |
| setStatus | info/success/error | Adiciona um estado a barra de progresso |
| setPercentProgressBarLine | Integer | Adiciona um valor percentual a linha da barra de progresso |
| setHelpTextDescription | String | Adiciona um valor ao texto de apoio da barra de progresso |
| setHelpTextProgressStatus | String | Adiciona um valor ao texto de status da barra de progresso |
| addClickEventOnActionButton | Função anônima | Adiciona um evento de callback ao clicar no botão de ação(lixeira ou x) |
| addClickEventOnReplaceFileButton | Função anônima | Adiciona um evento de callback ao clicar no botão de substituir arquivo |

## Exemplo de Função para o Chamar no Método handleFileAddition
Com Estado de Progresso
```
function exampleFileUploadProgress(uploaderProgressService) {
let percent = 10;

uploaderProgressService
.setStatus("info")
.setPercentProgressBarLine(percent)
.setHelpTextDescription("<p>Seu arquivo está sendo processado</p>")
.setHelpTextProgressStatus(`<p>Carregando: ${percent}%</p>`)
.addClickEventOnActionButton((event) => {

    /* Lógica para o clique no botão de ação (ex: cancelar upload) */
    /* Importante: A lógica abaixo vai sobrescrever a lógica do método handleDiscard,
       pois está sendo adicionada no início da execução do evento de clique. */
    /* console.log("Cancelando o upload..."); */

    /* Caso queira adicionar a lógica do handleDiscard, chame-o dentro dessa função, se necessário. */
    /* handleDiscard(event); */
    /* Descomente a linha de cima, se quiser combinar as duas lógicas. */
  });

}
```
Com Estado de Sucesso
```
function exampleFileUploadSuccess(uploaderProgressService) {
let percent = 100;

uploaderProgressService
.setStatus("success")
.setPercentProgressBarLine(percent)
.setHelpTextDescription(`<p>Seu arquivo foi processado</p>`)
.setHelpTextProgressStatus(`<p>Concluído: ${percent}%</p>`)
.addClickEventOnActionButton((event) => {

    /* Lógica para o clique no botão de ação (ex: cancelar upload) */
    /* Importante: A lógica abaixo vai sobrescrever a lógica do método handleDiscard,
       pois está sendo adicionada no início da execução do evento de clique. */
    /* console.log("Arquivo concluído e pronto para ação..."); */

    /* Caso queira adicionar a lógica do handleDiscard, chame-o dentro dessa função, se necessário. */
    /* handleDiscard(event); */
    /* Descomente a linha de cima, se quiser combinar as duas lógicas. */

});
}
```
Com Estado de Erro e Tamanho Excedido
```
function exampleFileSizeError(uploaderProgressService) {
let files = service.getFiles(); /* Obtém os arquivos atualmente carregados */
let lastIndex = files.length - 1; /* Pega o índice do último arquivo */
let lastFile = files[lastIndex]; /* Pega o último arquivo na lista de arquivos*/

    /* Exibe a mensagem de erro e bloqueia o upload do arquivo */

if (!service.checkMaximumSize(lastFile)) {

  return uploaderProgressService
    .setStatus("error") /* Define o status como "erro" */
    .setPercentProgressBarLine(100) /* Configura a barra de progresso como 100% */
    .setHelpTextDescription(
      `<p>O tamanho do arquivo não é compatível. Altere para um tamanho menor e tente novamente.</p>`
    ) /* Exibe a mensagem de erro */
    .addClickEventOnActionButton((event) => {

    /* Lógica para o clique no botão de ação (ex: cancelar upload) */
    /* Importante: A lógica abaixo vai sobrescrever a lógica do método handleDiscard,
       pois está sendo adicionada no início da execução do evento de clique. */
    /* console.log("Cancelando o upload devido ao erro de tamanho de arquivo."); */

    /* Caso queira adicionar a lógica do handleDiscard, chame-o dentro dessa função, se necessário. */
    /* handleDiscard(event); */
    /* Descomente a linha de cima, se quiser combinar as duas lógicas. */
    })
    .addClickEventOnReplaceFileButton((event) => {
      /* Lógica para substituir o arquivo, se necessário */
      handleSelectFile(event);
    });

}
}
```
Com Estado de Erro e Extensão Não Permitida
```
function exampleFileExtensionCheck(uploaderProgressService) {
let files = service.getFiles(); /* Obtém a lista de arquivos carregados */
let lastIndex = files.length - 1; /* Pega o índice do último arquivo */
let lastFile = files[lastIndex]; /* Obtém o último arquivo na lista */

if (!service.checkIfIsAllowedExtension(lastFile)) {

return uploaderProgressService
.setStatus("error")
.setPercentProgressBarLine(100)
.setHelpTextDescription(
`<p>O formato do arquivo não é compatível. Altere para JPEG ou PDF e tente novamente.</p>`
)
.addClickEventOnActionButton((event) => {

    /* Lógica para o clique no botão de ação (ex: cancelar upload) */
    /* Importante: A lógica abaixo vai sobrescrever a lógica do método handleDiscard,
       pois está sendo adicionada no início da execução do evento de clique. */
    /* console.log("Cancelando o upload devido a formato de arquivo incompatível."); */

    /* Caso queira adicionar a lógica do handleDiscard, chame-o dentro dessa função, se necessário. */
    /* handleDiscard(event); */
    /* Descomente a linha de cima, se quiser combinar as duas lógicas. */
    })
    .addClickEventOnReplaceFileButton((event) => {
      /* Lógica para substituir o arquivo com um formato válido. */
      handleSelectFile(event);
    });

}
}
```
Em um Processo de Upload Real, é Necessário Chamar Métodos Diversos Várias Vezes

Em um cenário real de upload de arquivos, não apenas o setPercentProgressBarLine, mas também outros métodos como setStatus, setHelpTextDescription, entre outros, precisam ser chamados várias vezes para refletir o progresso contínuo e as mudanças de status. Por exemplo:

setPercentProgressBarLine deve ser chamado repetidamente para atualizar a barra de progresso conforme o upload avança.
setStatus pode ser usado para mudar o status do upload (como de "info" para "sucesso" ou "erro") conforme o progresso.
setHelpTextDescription deve ser atualizado para mostrar mensagens dinâmicas, como o percentual de progresso ou mensagens de erro.

Essas atualizações frequentes são necessárias para garantir que o usuário receba feedback em tempo real e tenha uma experiência interativa e clara durante o processo de upload.

# Acessibilidade

O componente já tem em seu exemplo HTML o atributo de acessibilidade aria-hidden no ícone fazendo que o leitor de telas não o leia, também já possui os atributos no botão de selecionar o arquivo e a tag aria-label ou aria-labelledby devem ser configuradas de acordo com a aplicação. Ao executar a ação de upload cada estado tem um comportamento e seus botões, cada botão deve ter a tag aria-label configurada conforme a necessidade.

# Exemplos
Default
```
<div id="brad-input-uploader-396" class="brad-input-uploader">
  <div class="brad-input-uploader__description">
    <p
      tabindex="1"
      class="brad-input-uploader__description-paragraph brad-font-subtitle-sm"
    >
      Arquivo válidos: JPG ou PDF, com tamanho máximo de até 20mb.
    </p>
  </div>

  <div class="brad-input-uploader__content">
    <label
      class="brad-input-uploader__content-label"
      draggable="true"
    >
      <em
        aria-hidden="true"
        class="brad-input-uploader__content-label-icon i icon-component-export"
      ></em>
      <span class="brad-input-uploader__content-label-text-information">
        <em
          title="Selecione o arquivo ou arraste e solte aqui"
          class="brad-input-uploader__content-label-text-information-select brad-font-title-md desktop-text"
        >
          Selecione o arquivo ou arraste e solte aqui
        </em>
        <em
          class="brad-input-uploader__content-label-text-information-select brad-font-title-md mobile-text"
        >
          Selecione o arquivo
        </em>
        <em
          class="brad-input-uploader__content-label-text-information-required brad-font-subtitle-xs"
        >
          <b class="brad-font-subtitle-xs">Obrigatório</b>: Nome do Arquivo
        </em>
      </span>
      <span
        role="button"
        tabindex="1"
        class="brad-input-uploader__content-label-button brad-btn brad-btn-secondary"
      >
        Selecionar o arquivo
      </span>
      <input
        class="brad-input-uploader__content-label-input"
        type="file"
        name="brad-input-uploader"
        
        
        
      />
    </label>
  </div>
</div>
```