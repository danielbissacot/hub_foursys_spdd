---
name: springboot-blob-storage
description: Implementa upload, download e remoção de arquivos no Azure Blob Storage em Spring Boot com Arquitetura Hexagonal. Use para features de gestão de documentos, imagens, arquivos de lote ou qualquer armazenamento de objetos em nuvem.
metadata:
  version: "0.0.1"
---

# Spring Boot — Azure Blob Storage

Implemente armazenamento de arquivos no Azure Blob Storage seguindo Arquitetura Hexagonal. Credenciais via variável de ambiente ou CSI Driver — nunca hardcoded.

## Regras Críticas

- **Credenciais via ambiente**: connection string ou SAS token via variável de ambiente ou CSI Driver.
- **Nomes de arquivo**: sanitize nomes antes de armazenar (sem path traversal: `../`, `/` no nome).
- **Content-Type**: sempre definir explicitamente — nunca deixar como `application/octet-stream` padrão.
- **Tamanho máximo**: valide no controller antes de enviar ao blob (não confie no Azure como única validação).

## Dependência (pom.xml)

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-storage-blob</artifactId>
    <version>12.25.0</version>
</dependency>
```

## Configuração

```yaml
azure:
  storage:
    blob:
      connection-string: ${AZURE_STORAGE_CONNECTION_STRING}
      container-name: ${AZURE_STORAGE_CONTAINER_NAME}
```

```java
@Configuration
public class BlobStorageConfig {

    @Value("${azure.storage.blob.connection-string}")
    private String connectionString;

    @Value("${azure.storage.blob.container-name}")
    private String containerName;

    @Bean
    public BlobContainerClient blobContainerClient() {
        return new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient()
                .getBlobContainerClient(containerName);
    }
}
```

## OutputPort (Hexagonal)

```java
// port/output/ArmazenamentoOutputPort.java
public interface ArmazenamentoOutputPort {
    String armazenar(byte[] conteudo, String nomeArquivo, String contentType);
    byte[] recuperar(String identificador);
    void remover(String identificador);
    String gerarUrlTemporaria(String identificador, Duration validade);
}
```

## Adapter de Implementação

```java
// adapter/output/blob/BlobStorageAdapter.java
@Component
@RequiredArgsConstructor
@Slf4j
public class BlobStorageAdapter implements ArmazenamentoOutputPort {

    private final BlobContainerClient containerClient;

    @Override
    public String armazenar(byte[] conteudo, String nomeArquivo, String contentType) {
        String identificador = UUID.randomUUID() + "-" + sanitizar(nomeArquivo);
        BlobClient blobClient = containerClient.getBlobClient(identificador);

        BlobHttpHeaders headers = new BlobHttpHeaders().setContentType(contentType);
        blobClient.upload(BinaryData.fromBytes(conteudo), true);
        blobClient.setHttpHeaders(headers);

        log.info("Arquivo armazenado: identificador={}, tamanho={}bytes", identificador, conteudo.length);
        return identificador;
    }

    @Override
    public byte[] recuperar(String identificador) {
        BlobClient blobClient = containerClient.getBlobClient(identificador);
        if (!blobClient.exists()) {
            throw new ArquivoNaoEncontradoException("Arquivo não encontrado: " + identificador);
        }
        return blobClient.downloadContent().toBytes();
    }

    @Override
    public void remover(String identificador) {
        containerClient.getBlobClient(identificador).deleteIfExists();
        log.info("Arquivo removido: identificador={}", identificador);
    }

    @Override
    public String gerarUrlTemporaria(String identificador, Duration validade) {
        BlobSasPermission permission = new BlobSasPermission().setReadPermission(true);
        BlobServiceSasSignatureValues values = new BlobServiceSasSignatureValues(
                OffsetDateTime.now().plus(validade), permission);
        return containerClient.getBlobClient(identificador).generateSas(values);
    }

    private String sanitizar(String nomeArquivo) {
        return nomeArquivo.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
```

## Controller (Adapter de Entrada)

```java
// adapter/input/controller/ArquivoController.java
@RestController
@RequestMapping("/v1/arquivos")
@RequiredArgsConstructor
public class ArquivoController {

    private final UploadArquivoInputPort uploadArquivoUseCase;
    private final DownloadArquivoInputPort downloadArquivoUseCase;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ArquivoResponse upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) throw new ArquivoInvalidoException("Arquivo vazio");
        if (file.getSize() > 10 * 1024 * 1024) throw new ArquivoInvalidoException("Tamanho máximo: 10MB");

        return uploadArquivoUseCase.executar(new UploadArquivoCommand(
                file.getOriginalFilename(),
                file.getContentType(),
                unchecked(file::getBytes)
        ));
    }

    @GetMapping("/{identificador}")
    public ResponseEntity<byte[]> download(@PathVariable String identificador) {
        byte[] conteudo = downloadArquivoUseCase.executar(identificador);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + identificador + "\"")
                .body(conteudo);
    }
}
```
