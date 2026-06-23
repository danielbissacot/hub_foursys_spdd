# Input Uploader

Componente utilizado para upload de arquivos, permitindo configurações como extensões permitidas, tamanho máximo e múltiplos arquivos.

# Uso do Web Component

O componente de input-uploader possui os seguintes elementos principais:


| Nome | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| brad-input-uploader | Componente | Sim | Componente principal do uploader. |
| brad-input-uploader-description | Componente | Não | Exibe a descrição do uploader, como extensões permitidas e tamanho máximo. |
| brad-input-uploader-content | Componente | Sim | Contém os elementos principais do uploader, como botões e informações. |
| brad-input-uploader-content-information | Componente | Não | Exibe informações adicionais sobre o arquivo selecionado. |
| brad-input-uploader-content-information-required | Componente | Não | Indica se o campo é obrigatório, mas só é exibido o texto, se o atributo brad-required estiver aplicado. |
| brad-input-uploader-select | Componente | Não | Botão para selecionar arquivos. |

# Propriedades
## brad-input-uploader

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| id | string | Random() | ID necessário para o funcionamento do componente. |
| brad-type | string | single | Define se o componente permite seleção única ('single') ou múltipla ('multi') de arquivos. Reflete automaticamente no <input>. |
| brad-allowed-extensions | string[] | * | Lista de extensões de arquivo permitidas para upload. Reflete automaticamente no <input>. |
| brad-maximum-size | number | - | Tamanho máximo permitido para upload, em bytes. Não é automático, necessário usar service.checkMaximumSize(file) para validar tamanho do arquivo. |
| brad-on-after-add-file-callback | function | - | Callback executado após a adição de um arquivo. Recebe um objeto do tipo BradUploaderProgressService como parâmetro, mas usando o Liquid.addCallbacks. |
| brad-disabled | boolean | false | Desabilita o componente. Reflete automaticamente no <input>. |
| brad-required | boolean | false | Define se o campo é obrigatório. Reflete automaticamente no <input>. |

## brad-input-uploader-content-information

| Nome | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| brad-text-desktop | string | "Selecione o arquivo ou arraste e solte aqui" | Texto exibido para desktops no componente. |
| brad-text-mobile | string | "Selecione o arquivo" | Texto exibido para dispositivos móveis no componente. |


Importante: Estas propriedades devem ser aplicadas ao elemento brad-input-uploader-content-information-text, não ao brad-input-uploader-content-information.

# Uso do HTML
```
<brad-input-uploader
  id="input-uploader"
  brad-type="single"
  brad-allowed-extensions="[&quot;.jpg&quot;,&quot;.png&quot;,&quot;.pdf&quot;]"
  brad-maximum-size="20971520"
  brad-on-after-add-file-callback="InputUploader.OnAfterAddFileCallback"
>
  <brad-input-uploader-description>
    Arquivo(s) válido(s): .jpg, .png e .pdf, com
    tamanho máximo de até 20,00mb.
  </brad-input-uploader-description>

  <brad-input-uploader-content>
    <brad-input-uploader-content-information>
      <brad-input-uploader-content-information-text
        brad-text-desktop="Selecione o arquivo ou arraste e solte aqui"
        brad-text-mobile="Selecione o arquivo"
      ></brad-input-uploader-content-information-text>

      <brad-input-uploader-content-information-required>
        nome_do_arquivo.png
      </brad-input-uploader-content-information-required>
    </brad-input-uploader-content-information>

    <brad-input-uploader-select
      >Selecionar o arquivo</brad-input-uploader-select
    >

    <input type="file" name="brad-input-uploader" />
  </brad-input-uploader-content>
</brad-input-uploader>
```
## Requisitos para Utilização

Para utilizar o componente brad-input-uploader corretamente, são necessários:

# Obrigatórios:
ID único: Cada instância do componente deve ter um id único
Aguardar inicialização: Usar whenInitialized() para acessar o serviço
Elemento <input>: Deve estar presente dentro de brad-input-uploader-content
Opcionais:
Callbacks: Registrar via LiquidCorp.addCallbacks se precisar de funcionalidades customizadas
Validações: Implementar validações de arquivo usando os métodos do service
Event listeners: Adicionar listeners para eventos personalizados
StorybookUtils: Para aguardar componentes em ambiente dinâmico (opcional, usado principalmente em desenvolvimento)
Helper utilitários: Para formatação de extensões e conversão de bytes para MB
Comportamento Javascript
## Inicialização

O componente brad-input-uploader é assíncrono e sua inicialização ocorre automaticamente quando ele é adicionado ao DOM. Para garantir que o componente esteja totalmente carregado e pronto para uso, é necessário utilizar o método whenInitialized().

## Aguardando a Inicialização do Componente

O método whenInitialized() retorna uma Promise que resolve quando o componente estiver completamente inicializado, fornecendo acesso ao serviço (InputUploaderService) associado ao componente.

```
const component = document.getElementById("input-uploader");

component.whenInitialized().then((service) => {
console.log('Componente inicializado:', service);

// Aqui você pode implementar a lógica adicional do componente
// como callbacks, event listeners, etc.
});
```

Importante: Sempre aguarde a inicialização do componente usando whenInitialized() antes de tentar acessar seus métodos ou propriedades, pois o componente é carregado de forma assíncrona.

Métodos (InputUploaderService - fica armazenado na variável service dentro do componente.)

Os métodos disponíveis no serviço associado ao componente são:


| Método | Parâmetros | Descrição |
| --- | --- | --- |
| getFiles() | N/A | Retorna a lista de arquivos adicionados ao componente. |
| checkMaximumSize(file) | File | Retorna true se o tamanho do arquivo é menor que o máximo permitido. |
| checkIfIsAllowedExtension(file) | File | Retorna true se o arquivo tem a extensão permitida. |
| getIsMultipleFiles() | N/A | Retorna 'multiple' se múltiplos arquivos são permitidos, caso contrário retorna outro valor. |

Metódos (UploaderProgressService - fica armazenado no param do callback brad-on-after-add-file-callback)

Esses métodos são idealmente utilizados dentro da função anônima criada no atributo de callback brad-on-after-add-file-callback.


| Método | Tipo | Descrição |
| --- | --- | --- |
| setStatus | info/success/error | Adiciona um estado a barra de progresso |
| setPercentProgressBarLine | Integer | Adiciona um valor percentual a linha da barra de progresso |
| setHelpTextDescription | String | Adiciona um valor ao texto de apoio da barra de progresso |
| setHelpTextProgressStatus | String | Adiciona um valor ao texto de status da barra de progresso |
| addClickEventOnActionButton | Função anônima | Adiciona um evento de callback ao clicar no botão de ação(lixeira ou x) |
| addClickEventOnReplaceFileButton | Função anônima | Adiciona um evento de callback ao clicar no botão de substituir arquivo |

## Adicionando Callback e Simulando Processo de Upload

O componente brad-input-uploader permite a adição de callbacks para eventos específicos, como comportamento após a adição de um arquivo. Para isso, é necessário registrar o callback utilizando o método LiquidCorp.addCallbacks.

Atenção: Este código é uma simulação de um processo de upload de arquivos. Em um cenário real de upload, é necessário chamar métodos repetidamente e atualizar o estado de forma contínua para refletir o progresso real do upload. Por exemplo:

setPercentProgressBarLine deve ser chamado frequentemente para atualizar a barra de progresso conforme o upload avança.
setStatus pode ser usado para mudar o status do upload (como de "info" para "sucesso" ou "erro") conforme o progresso.
setHelpTextDescription deve ser atualizado para mostrar mensagens dinâmicas, como o percentual de progresso ou mensagens de erro.

Essas atualizações são necessárias para garantir que o usuário tenha uma experiência interativa e clara durante o processo de upload.

# Exemplo de Adição de Callback

Para implementar um callback completo, é necessário seguir os seguintes passos:

## Aguardar a inicialização do componente
Registrar o callback no LiquidCorp
Implementar a lógica do callback
Associar o callback ao componente via atributo
## 1. Aguardar a Inicialização do Componente

Primeiro, é necessário obter a referência do componente e aguardar sua inicialização completa:

```
const component = document.getElementById("input-uploader");
let service = null;
component.whenInitialized().then((initializedService) => {
service = initializedService;
console.log('InputUploaderService disponível:', service);
});
```
2. Registrar o Callback no LiquidCorp
## 2.1. Configuração do Callback

O callback deve ser registrado fora da inicialização do componente:

```
LiquidCorp.addCallbacks(
"InputUploader",
"OnAfterAddFileCallback",
(uploaderProgressService) => {
  if (!service) {
    console.error('Service não inicializado ainda');
    return;
  }

  // Implementar a lógica do callback aqui
  // ...

}
);
```
## 2.2. Implementação da Lógica do Callback

## Dentro do callback, implementamos toda a lógica necessária:

```
const files = service.getFiles();
const lastFile = files[files.length - 1];

uploaderProgressService.addClickEventOnActionButton(handleDiscard);

if (!validateFileUpload(uploaderProgressService, lastFile)) return;

simulateFileUploadProgress(uploaderProgressService);
```

Atenção: É fundamental aguardar a inicialização do componente com whenInitialized() antes de tentar utilizar o service, pois ele só fica disponível após a inicialização completa do componente.

## Função Principal: onAfterAddFileCallback
```
const onAfterAddFileCallback = (uploaderProgressService) => {
const files = service.getFiles();
const lastFile = files[files.length - 1];

uploaderProgressService.addClickEventOnActionButton(handleDiscard);

if (!validateFileUpload(uploaderProgressService, lastFile)) return;

simulateFileUploadProgress(uploaderProgressService);
};
```
Validação de Arquivo
```
function validateFileUpload(uploaderProgressService, file) {
const validationResults = [
  {
    isValid: service.checkIfIsAllowedExtension(file),
    errorMessage: `O formato do arquivo não é compatível. Altere para ${formatExtensions(component.bradAllowedExtensions)} e tente novamente.`,
  },
  {
    isValid: service.checkMaximumSize(file),
    errorMessage:
      "O tamanho do arquivo não é compatível. Altere para um tamanho menor e tente novamente.",
  },
];

return validateFileConditions(validationResults, uploaderProgressService);
};
```
Verificação das Condições de Validação
```
function validateFileConditions(validationResults, uploaderProgressService) {
let isValid = true;

validationResults.forEach((result) => {
if (!result.isValid) {
handleValidationError(uploaderProgressService, result.errorMessage);
isValid = false; // Marca como inválido caso haja um erro
}
});

return isValid; // Retorna true se todas as validações passarem, false caso contrário
};
```
Tratamento de Erros de Validação
```
function handleValidationError(uploaderProgressService, message) {
uploaderProgressService
  .setStatus("error")
  .setPercentProgressBarLine(100)
  .setHelpTextDescription(`<p>${message}</p>`)
  .addClickEventOnActionButton(handleDiscard)
  .addClickEventOnReplaceFileButton(handleReplaceFile);

return true; // Indica que houve erro
};
```
Substituição de Arquivo
```
function handleReplaceFile(event) {
const inputLabelSelector = ".brad-input-uploader__content-label";
const eInputLabel = component.querySelector(inputLabelSelector);

handleDiscard(event);
eInputLabel.click();
};
```
Simulação do Progresso do Upload
```
function simulateFileUploadProgress(uploaderProgressService) {
let percent = 0;

const interval = setInterval(() => {
percent += 1;

  handleUpdateProgressPercent(uploaderProgressService, percent, interval);

  if (percent === 100) {
    handleSuccessStatus(uploaderProgressService, percent);
    clearInterval(interval);
  }

}, 300);
};
```
Atualização do Progresso de Upload
```
function handleUpdateProgressPercent(
uploaderProgressService,
percent,
interval
) {
const isUploadInProgress = document.getElementById(
  `${uploaderProgressService.id}`
);

if (not(isUploadInProgress)) return;

uploaderProgressService
.setStatus("info")
.setPercentProgressBarLine(percent)
.setHelpTextProgressStatus(`<p>Carregando: ${percent}%</p>`)
.addClickEventOnActionButton((event) => handleDiscard(event, interval));
};
```
Status de Sucesso do Upload
```
function handleSuccessStatus(uploaderProgressService, percent) {
uploaderProgressService
  .setStatus("success")
  .setPercentProgressBarLine(percent)
  .setHelpTextDescription("<p>Seu arquivo foi carregado</p>")
  .setHelpTextProgressStatus(`<p>Concluído: ${percent}%</p>`)
  .addClickEventOnActionButton(handleDiscard);
};
```
Função de Descarte do Upload
```
function handleDiscard(event, interval) {
const isMultipleFiles = service.getIsMultipleFiles() === "multiple";

if (isMultipleFiles) {
event.target.parentNode.parentNode.remove();
} else {
event.target.parentNode.parentNode.parentNode.remove();
document.querySelector(
`#${id} brad-input-uploader-content`
).style.display = "block";
}

if (interval) clearInterval(interval);
};
```
Adicionando o Callback no Componente
```
LiquidCorp.addCallbacks(
"InputUploader",
"OnAfterAddFileCallback",
onAfterAddFileCallback
);
```

Após registrar o callback, ele pode ser associado ao componente utilizando o atributo brad-on-after-add-file-callback:

```
<brad-input-uploader
  id="input-uploader"
  brad-on-after-add-file-callback="InputUploader.OnAfterAddFileCallback"
></brad-input-uploader>
```
## Funções Utilitárias Necessárias

Para uma implementação completa, você também precisará das seguintes funções utilitárias:

```
// Formatar lista de extensões para exibição amigável
function formatExtensions(allowedExtensions) {
const list = [...allowedExtensions];
if (list.length === 1) return list[0];

const lastItem = list.pop();
const formattedList = list.join(", ");
return `${formattedList} e ${lastItem}`;
}

// Converter bytes para megabytes com formatação brasileira
function convertBytesToMB(bytes) {
let value = (bytes / (1024 * 1024)).toFixed(2);
return value.replace(".", ",");
}

// Função para verificação negativa (equivalente ao 'not' do helper)
function not(value) {
return !value;
}
```
## Eventos

| Evento | Elemento | Descrição |
| --- | --- | --- |
| allowedExtensionsChanged | brad-input-uploader | Disparado quando as extensões permitidas são alteradas. |
| maximumSizeChanged | brad-input-uploader | Disparado quando o tamanho máximo permitido é alterado. |

# Exemplos de Uso
```
const component = document.getElementById("input-uploader");

component.addEventListener("allowedExtensionsChanged", (e) => {
  updateUploaderDescriptionOnExtensionChange(e, component);
});

component.addEventListener("maximumSizeChanged", (e) => {
  updateUploaderDescriptionOnMaximumSizeChange(e, component);
});

function updateUploaderDescriptionOnExtensionChange(e, component) {
  const { detail } = e;
  const { newAllowedExtensions } = detail;
  const eComponentDescription = component.querySelector(
    "brad-input-uploader-description > p"
  );

  eComponentDescription.textContent = `Arquivo(s) válido(s): ${formatExtensions(
    newAllowedExtensions
  )}, com tamanho máximo de até ${convertBytesToMB(
    component.maximumSize
  )}mb.`;
}

function updateUploaderDescriptionOnMaximumSizeChange(e, component) {
  const { detail } = e;
  const { newMaximumSize } = detail;
  const eComponentDescription = component.querySelector(
    "brad-input-uploader-description > p"
  );

  eComponentDescription.textContent = `Arquivo(s) válido(s): ${formatExtensions(
    component.allowedExtensions
  )}, com tamanho máximo de até ${convertBytesToMB(newMaximumSize)}mb.`;
}
```
Exemplos
Default
```
<brad-input-uploader
  id="input-uploader-2"
  brad-type="single"
  brad-allowed-extensions="[&quot;.jpg&quot;,&quot;.png&quot;,&quot;.pdf&quot;]"
  brad-maximum-size="20971520"
  brad-on-after-add-file-callback="InputUploader.OnAfterAddFileCallback"
  
  
>
  <brad-input-uploader-description>
    Arquivo(s) válido(s): .jpg, .png e .pdf, com tamanho máximo de até 20,00mb.
  </brad-input-uploader-description>

  <brad-input-uploader-content>
    <brad-input-uploader-content-information>
      <brad-input-uploader-content-information-text
        brad-text-desktop="Selecione o arquivo ou arraste e solte aqui"
        brad-text-mobile="Selecione o arquivo"
      ></brad-input-uploader-content-information-text>

      <brad-input-uploader-content-information-required>
        nome_do_arquivo.png
      </brad-input-uploader-content-information-required>
    </brad-input-uploader-content-information>

    <brad-input-uploader-select
      >Selecionar o arquivo</brad-input-uploader-select
    >

    <input type="file" name="brad-input-uploader" />
  </brad-input-uploader-content>
</brad-input-uploader>
```