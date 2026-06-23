---
name: springboot-blob-storage
description: Implementa integração com Azure Blob Storage em projetos Spring Boot para armazenamento de arquivos binários na nuvem. Use quando precisar fazer upload, download ou gerenciar documentos e arquivos não estruturados seguindo arquitetura hexagonal e autenticação via Service Principal.
metadata:
  version: "0.0.1"
---

# Spring Boot Azure Blob Storage

Este skill fornece instruções detalhadas para implementar integração com Azure Blob Storage em projetos Spring Boot seguindo arquitetura hexagonal, utilizando Service Principal para autenticação segura.

## Quando usar este skill

Use este skill quando:
- Precisar armazenar documentos ou arquivos binários na nuvem
- Fazer upload de arquivos para Azure Blob Storage
- Fazer download de arquivos do Azure Blob Storage
- Gerenciar containers e blobs programaticamente
- Implementar armazenamento de dados não estruturados (PDFs, imagens, XMLs, etc)
- Seguir arquitetura hexagonal com isolamento de infraestrutura

## O que é Azure Blob Storage

O armazenamento de blobs da Azure é a solução de armazenamento de objetos da Microsoft para a Cloud. Esse armazenamento é otimizado para armazenar grandes quantidades de dados não estruturados. Dados não estruturados são dados que não estão de acordo com uma definição ou um modelo de dados específico, como texto ou dados binários.

## Pré-Requisitos

- **JDK 17** ou superior
- **Maven**
- **Spring Boot 3.x.x**
- **Azure Storage Account** provisionado (DEV, HML, PRD)
- **Service Principal** configurada no Azure Key Vault

## Dependências necessárias

Adicione as seguintes dependências no `pom.xml`:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-storage-blob</artifactId>
</dependency>

<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-sdk-bom</artifactId>
            <version>1.2.29</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

> ⚠️ **Nota**: Versão utilizada apenas como exemplo. Consultar a versão recomendada no **Catálogo de Bibliotecas e Versões Recomendadas**.

## Estrutura na Arquitetura Hexagonal

Para implementação de Azure Blob Storage em arquitetura hexagonal, siga os princípios de isolamento entre camadas:

- **OutputPort** (`port/output/`): Define contratos em linguagem de domínio (ex: `DocumentoPort`)
- **Adapter** (`adapter/output/blobstorage/`): Implementa OutputPort usando Azure SDK
- **Config** (`config/`): Configuração do `BlobServiceClient` e autenticação

### Estrutura de Diretórios

```
src/main/java/br/com/bradesco/projeto/
├── port/
│   └── output/
│       └── DocumentoPort.java
├── adapter/
│   └── output/
│       └── blobstorage/
│           └── BlobStorageAdapter.java
└── config/
    └── BlobStorageConfig.java
```

## Passo 1: Provisionar Recurso na Azure

Para desenvolvimento nos ambientes (DEV, HML, PRD), será necessário o pedido de criação do recurso na Azure. A solicitação deve ser feita via **BEX**, e a responsabilidade de fazer o pedido da oferta é do **Tech Lead**.

> 📞 **Em caso de dúvidas sobre provisionamento**, entrar em contato com o **engenheiro de infraestrutura cloud** do seu domínio/tribo.

## Passo 2: Configuração de Segredos no Azure Key Vault

Para garantir as boas práticas e segurança da sua aplicação, deve-se utilizar o **Azure Key Vault** para armazenamento de segredos (ClientID + ClientSecret da Service Principal ou a String de conexão com o StorageAccount/BlobStorage) pois são dados sensíveis.

### O que é Service Principal

Service Principal é uma identidade que permite que aplicações se autentiquem no Azure de forma segura sem usar credenciais de usuário. É composto por:
- **Client ID**: Identificador único da aplicação
- **Client Secret**: Senha/chave secreta da aplicação
- **Tenant ID**: Identificador do diretório Azure AD

## Passo 3: Configuração no Deployment

Configure as variáveis de ambiente no arquivo `config.yaml` (projetos Bitbucket) ou `values.yaml` (projetos Github):

```yaml
deploy:
  configmap:
    BLOB_CONTAINER: mycontainer
    AZ_CLIENT_ID: ${YOUR_AZ_CLIENT_ID}
    AZ_CLIENT_SECRET: ${YOUR_AZ_CLIENT_SECRET}
    AZ_TENANT_ID: ${YOUR_AZ_TENANT_ID}
    AZ_STORAGE_ENDPOINT: ${YOUR_AZ_STORAGE_ENDPOINT}
 
  azurekv:
    tenant_id: YOUR_TENANT_ID
    key_vault:
      name: YOUR_KEY_VAULT_NAME
      objects:
        - name: YOUR_AZ_CLIENT_ID
          type: secret
          version: null
        - name: YOUR_AZ_CLIENT_SECRET
          type: secret
          version: null
        - name: YOUR_AZ_TENANT_ID
          type: secret
          version: null
        - name: YOUR_AZ_STORAGE_ENDPOINT
          type: secret
          version: null
```

### Exemplo de Endpoint

```
AZ_STORAGE_ENDPOINT=https://mystorage.blob.core.windows.net
```

## Passo 4: Criar Classe de Configuração

Crie a classe `BlobStorageConfig.java` em `config/`:

```java
package br.com.bradesco.projeto.config;

import com.azure.core.credential.TokenCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BlobStorageConfig {

    @Value("${AZ_CLIENT_ID}")
    private String clientId;

    @Value("${AZ_CLIENT_SECRET}")
    private String clientSecret;

    @Value("${AZ_TENANT_ID}")
    private String tenantId;

    @Value("${AZ_STORAGE_ENDPOINT}")
    private String storageEndpoint;

    @Bean
    public BlobServiceClient blobServiceClient() {
        return new BlobServiceClientBuilder()
                .credential(getAzureClientCredentials())
                .endpoint(storageEndpoint)
                .buildClient();
    }

    private TokenCredential getAzureClientCredentials() {
        return new ClientSecretCredentialBuilder()
                .clientId(clientId)
                .clientSecret(clientSecret)
                .tenantId(tenantId)
                .build();
    }
}
```

### Explicação da Configuração

- **BlobServiceClient**: Cliente principal para interagir com o Blob Storage
- **TokenCredential**: Credencial baseada em token OAuth2 usando Service Principal
- **ClientSecretCredentialBuilder**: Constrói credencial a partir de Client ID, Secret e Tenant
- **Endpoint**: URL base do Storage Account (ex: `https://mystorage.blob.core.windows.net`)

## Passo 5: Definir Port de Saída

Crie a interface `DocumentoPort.java` em `port/output/`:

```java
package br.com.bradesco.projeto.port.output;

/**
 * Port de saída para operações com documentos
 * Define o contrato em linguagem de domínio
 */
public interface DocumentoPort {
    
    /**
     * Envia um documento para o storage
     * 
     * @param content Conteúdo do documento em bytes
     * @param fileName Nome do arquivo
     */
    void enviarDocumento(byte[] content, String fileName);
    
    /**
     * Obtém um documento do storage
     * 
     * @param fileName Nome do arquivo
     * @return Conteúdo do documento em bytes
     */
    byte[] obterDocumento(String fileName);
}
```

## Passo 6: Implementar Adapter

Crie a classe `BlobStorageAdapter.java` em `adapter/output/blobstorage/`:

```java
package br.com.bradesco.projeto.adapter.output.blobstorage;

import br.com.bradesco.kit.srv.domain.exception.NaoEncontradoException;
import br.com.bradesco.projeto.port.output.DocumentoPort;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobErrorCode;
import com.azure.storage.blob.models.BlobStorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;

/**
 * Adapter que implementa operações de documento usando Azure Blob Storage
 * Isolamento completo da infraestrutura Azure do domínio
 */
@Component
public class BlobStorageAdapter implements DocumentoPort {

    private static final Logger LOGGER = LoggerFactory.getLogger(BlobStorageAdapter.class);

    private final BlobServiceClient blobServiceClient;
    
    @Value("${BLOB_CONTAINER:mycontainer}")
    private String containerName;

    public BlobStorageAdapter(BlobServiceClient blobServiceClient) {
        this.blobServiceClient = blobServiceClient;
    }

    @Override
    public void enviarDocumento(byte[] content, String fileName) {
        LOGGER.info("Enviando documento: {} para container: {}", fileName, containerName);
        
        // Cria o container se não existir
        blobServiceClient.createBlobContainerIfNotExists(containerName);
        
        BlobContainerClient blobContainerClient = blobServiceClient.getBlobContainerClient(containerName);
        var blobClient = blobContainerClient.getBlobClient(fileName);

        // Sobrescreve o blob se já existir (overwrite=true)
        blobClient.upload(new ByteArrayInputStream(content), content.length, true);
        
        LOGGER.info("Documento enviado com sucesso: {}", fileName);
    }

    @Override
    public byte[] obterDocumento(String fileName) {
        LOGGER.info("Obtendo documento: {} do container: {}", fileName, containerName);
        
        BlobContainerClient blobContainerClient = blobServiceClient.getBlobContainerClient(containerName);
        var blobClient = blobContainerClient.getBlobClient(fileName);

        try {
            byte[] content = blobClient.downloadContent().toBytes();
            LOGGER.info("Documento obtido com sucesso: {}", fileName);
            return content;
            
        } catch (BlobStorageException ex) {
            LOGGER.error("Erro ao obter documento: {}", fileName, ex);

            if (BlobErrorCode.BLOB_NOT_FOUND.equals(ex.getErrorCode())) {
                throw new NaoEncontradoException(
                    HttpStatus.NOT_FOUND.toString(), 
                    "Documento não encontrado: " + fileName
                );
            }
            throw ex;
        }
    }
}
```

### Operações Implementadas

#### enviarDocumento()
- Cria o container automaticamente se não existir (`createBlobContainerIfNotExists`)
- Faz upload do arquivo como blob
- Sobrescreve arquivo se já existir (parâmetro `overwrite=true`)
- Usa `ByteArrayInputStream` para enviar conteúdo em memória

#### obterDocumento()
- Faz download do conteúdo do blob
- Converte para array de bytes
- Trata erro `BLOB_NOT_FOUND` com exceção customizada de domínio
- Propaga outros erros para tratamento superior

## Passo 7: Usar o Port no Caso de Uso

## Tratamento de Erros

### Exceções Comuns do Azure Blob Storage

```java
try {
    // operação com blob
} catch (BlobStorageException ex) {
    
    if (BlobErrorCode.BLOB_NOT_FOUND.equals(ex.getErrorCode())) {
        // Blob não existe
    } else if (BlobErrorCode.CONTAINER_NOT_FOUND.equals(ex.getErrorCode())) {
        // Container não existe
    } else if (BlobErrorCode.AUTHENTICATION_FAILED.equals(ex.getErrorCode())) {
        // Falha na autenticação
    } else if (BlobErrorCode.AUTHORIZATION_PERMISSION_MISMATCH.equals(ex.getErrorCode())) {
        // Sem permissão
    }
}
```

### Error Codes Principais

| Error Code | Descrição | HTTP Status |
|------------|-----------|-------------|
| `BLOB_NOT_FOUND` | Blob não encontrado | 404 |
| `CONTAINER_NOT_FOUND` | Container não existe | 404 |
| `AUTHENTICATION_FAILED` | Falha na autenticação | 403 |
| `AUTHORIZATION_PERMISSION_MISMATCH` | Sem permissão | 403 |
| `CONTAINER_ALREADY_EXISTS` | Container já existe | 409 |

## Operações Avançadas

### Listar blobs em um container

```java
public List<String> listarDocumentos() {
    BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
    
    return containerClient.listBlobs()
        .stream()
        .map(blobItem -> blobItem.getName())
        .collect(Collectors.toList());
}
```

### Excluir um blob

```java
public void excluirDocumento(String fileName) {
    BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
    var blobClient = containerClient.getBlobClient(fileName);
    
    blobClient.delete();
    LOGGER.info("Documento excluído: {}", fileName);
}
```

### Verificar se blob existe

```java
public boolean documentoExiste(String fileName) {
    BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
    var blobClient = containerClient.getBlobClient(fileName);
    
    return blobClient.exists();
}
```

### Upload com metadados

```java
public void enviarComMetadados(byte[] content, String fileName, Map<String, String> metadados) {
    BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
    var blobClient = containerClient.getBlobClient(fileName);
    
    BlobHttpHeaders headers = new BlobHttpHeaders()
        .setContentType("application/pdf");
    
    blobClient.uploadWithResponse(
        new ByteArrayInputStream(content),
        content.length,
        headers,
        metadados,
        null, // Tier
        null, // AccessConditions
        Duration.ofMinutes(5),
        Context.NONE
    );
}
```

## Boas Práticas

### 1. Nomenclatura de Containers
- Use nomes descritivos e em minúsculas
- Separe palavras com hífens: `documentos-cliente`, `relatorios-mensais`
- Evite caracteres especiais

### 2. Nomenclatura de Blobs
- Use path-like structure: `2024/12/documento.pdf`
- Inclua identificadores únicos: `cliente-12345-contrato.pdf`
- Considere versionamento: `arquivo-v1.pdf`, `arquivo-v2.pdf`

### 3. Segurança
- **Nunca** exponha credentials no código
- Use sempre **Azure Key Vault** para secrets
- Configure **RBAC** apropriado no Azure
- Valide permissões da Service Principal

### 4. Performance
- Use `BlobClient.upload()` para arquivos pequenos (< 256 MB)
- Para arquivos grandes, use `uploadFromFile()` com block upload
- Configure timeout adequado para uploads grandes

### 5. Observabilidade
- Implemente logs estruturados
- Use correlation IDs
- Monitore exceções e latência
- Configure alertas para falhas

## Exemplo Completo de Implementação

Exemplo de referência:
- **Repositório**: [ensc-srv-kit-java](https://github.com/Bradesco-Core/ensc-srv-kit-java/tree/feature/blobstorage-example)
- **Branch**: `feature/blobstorage-example`

## Recursos Adicionais

- [Documentação Oficial Azure Blob Storage](https://learn.microsoft.com/pt-br/azure/storage/blobs/)
- [Azure SDK for Java](https://learn.microsoft.com/en-us/java/api/overview/azure/storage-blob-readme)
- [Service Principal Authentication](https://learn.microsoft.com/en-us/azure/developer/java/sdk/identity-service-principal-auth)
