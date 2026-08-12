---
name: 'springboot-blob-storage'
description: "Implementa upload, download e gerenciamento de arquivos no Azure Blob Storage no padrão Hexagonal. Cobre BlobServiceClient, geração de SAS token, presigned URLs, streaming de arquivos grandes e adapter de armazenamento como OutputPort. Use quando a história precisar persistir ou servir arquivos binários (PDFs, imagens, documentos, exports)."
metadata:
  version: "0.1.0"
---

# Skill: springboot-blob-storage

Guia completo para implementar **armazenamento de arquivos no Azure Blob Storage** em projetos Java 21 + Spring Boot 3.x com Arquitetura Hexagonal.

> **Invocado por:** `foursys-specify-tech.md` Spring Boot quando a história requer persistência ou servição de arquivos binários.

---

## Quando usar

- Upload de documentos por usuários (PDFs, imagens, planilhas).
- Geração e armazenamento de relatórios, extratos, comprovantes.
- Exports de dados em arquivos para download.
- Armazenamento de evidências e arquivos de auditoria.

## Quando não usar

- Armazenamento de dados estruturados → use MongoDB ou PostgreSQL.
- Arquivos temporários de processamento em memória → use `byte[]` ou `InputStream` diretamente.

---

## Estrutura de Arquivos (Hexagonal)

```
adapter/output/storage/
└── AzureBlobStorageAdapter.java        ← Implementa ArquivoStorageOutputPort

config/
└── BlobStorageConfig.java              ← Configura BlobServiceClient
```

---

## Implementação

### 1. Dependência (pom.xml)

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-storage-blob</artifactId>
    <version>12.26.0</version>
</dependency>
```

---

### 2. Configuração (application.yml)

```yaml
azure:
  storage:
    blob:
      connection-string: ${AZURE_STORAGE_CONNECTION_STRING}
      container-name: ${AZURE_STORAGE_CONTAINER:foursys-documentos}
      sas-token-expiry-hours: ${AZURE_STORAGE_SAS_EXPIRY_HOURS:1}
```

---

### 3. Configuração do Client (BlobStorageConfig)

```java
// FILEPATH: config/BlobStorageConfig.java
@Configuration
public class BlobStorageConfig {

    @Value("${azure.storage.blob.connection-string}")
    private String connectionString;

    @Value("${azure.storage.blob.container-name}")
    private String containerName;

    @Bean
    public BlobServiceClient blobServiceClient() {
        return new BlobServiceClientBuilder()
            .connectionString(connectionString)
            .buildClient();
    }

    @Bean
    public BlobContainerClient blobContainerClient(BlobServiceClient blobServiceClient) {
        var container = blobServiceClient.getBlobContainerClient(containerName);
        if (!container.exists()) {
            container.create();
        }
        return container;
    }
}
```

---

### 4. OutputPort (Interface de Domínio)

```java
// FILEPATH: port/output/ArquivoStorageOutputPort.java
public interface ArquivoStorageOutputPort {
    String upload(String nomeArquivo, InputStream conteudo, long tamanho, String contentType);
    InputStream download(String nomeArquivo);
    String gerarUrlTemporaria(String nomeArquivo, Duration validade);
    void excluir(String nomeArquivo);
}
```

---

### 5. Adapter (OutputPort)

```java
// FILEPATH: adapter/output/storage/AzureBlobStorageAdapter.java
@Component
@RequiredArgsConstructor
@Slf4j
public class AzureBlobStorageAdapter implements ArquivoStorageOutputPort {

    private final BlobContainerClient containerClient;

    @Value("${azure.storage.blob.sas-token-expiry-hours}")
    private int sasExpiryHours;

    @Override
    public String upload(String nomeArquivo, InputStream conteudo, long tamanho, String contentType) {
        var blobClient = containerClient.getBlobClient(nomeArquivo);
        blobClient.upload(conteudo, tamanho, true); // overwrite = true
        log.info("Arquivo enviado para Blob Storage. nome={} tamanho={}bytes", nomeArquivo, tamanho);
        return blobClient.getBlobUrl();
    }

    @Override
    public InputStream download(String nomeArquivo) {
        var blobClient = containerClient.getBlobClient(nomeArquivo);
        if (!blobClient.exists()) {
            throw new ArquivoNaoEncontradoException("Arquivo não encontrado: " + nomeArquivo);
        }
        return blobClient.openInputStream();
    }

    @Override
    public String gerarUrlTemporaria(String nomeArquivo, Duration validade) {
        var blobClient = containerClient.getBlobClient(nomeArquivo);
        var expiry = OffsetDateTime.now().plus(validade);
        var permission = new BlobSasPermission().setReadPermission(true);
        var sasValues = new BlobServiceSasSignatureValues(expiry, permission);
        return blobClient.getBlobUrl() + "?" + blobClient.generateSas(sasValues);
    }

    @Override
    public void excluir(String nomeArquivo) {
        var blobClient = containerClient.getBlobClient(nomeArquivo);
        blobClient.deleteIfExists();
        log.info("Arquivo excluído do Blob Storage. nome={}", nomeArquivo);
    }
}
```

---

### 6. Padrão de Nomenclatura de Arquivos

```java
// Use prefixos para organizar por domínio/tenant:
String nomeArquivo = String.format("%s/%s/%s_%s.%s",
    centroDeCusto,          // ex: "financeiro"
    codigoOperacao,         // ex: "OP-2024-001"
    tipo,                   // ex: "comprovante"
    UUID.randomUUID(),      // evita colisão
    extensao                // ex: "pdf"
);
// Resultado: "financeiro/OP-2024-001/comprovante_uuid.pdf"
```

---

## Segurança

- **NUNCA** exponha a `connection-string` completa em logs ou respostas de API.
- URLs temporárias (SAS) devem ter validade mínima necessária (padrão: 1h).
- Use **Managed Identity** (MSI) em produção em vez de connection string quando possível.
- Valide tipo MIME e tamanho máximo antes do upload no UseCase.

---

## Checklist de Implementação

- [ ] Dependência `azure-storage-blob` adicionada ao `pom.xml`
- [ ] `AZURE_STORAGE_CONNECTION_STRING` como variável de ambiente (nunca hardcoded)
- [ ] `BlobServiceClient` e `BlobContainerClient` configurados como `@Bean`
- [ ] `ArquivoStorageOutputPort` definida na camada de porta
- [ ] Adapter implementando a `OutputPort` com `BlobContainerClient`
- [ ] Nomenclatura de arquivos com prefixo de domínio + UUID
- [ ] SAS token com validade configurável via `application.yml`
- [ ] `@Bean` do Adapter registrado em `config/`
- [ ] Validação de tipo MIME e tamanho no UseCase (não no Adapter)
- [ ] Testes unitários com mock do `BlobContainerClient` (cobertura ≥ 95%)
