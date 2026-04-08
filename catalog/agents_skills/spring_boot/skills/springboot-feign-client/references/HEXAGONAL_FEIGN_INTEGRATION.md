# Exemplo Completo: Integração com API de CEP (Arquitetura Hexagonal)

Este exemplo demonstra como implementar uma integração com a API ViaCEP usando Feign Client, seguindo rigorosamente os princípios da arquitetura hexagonal e mantendo o domínio isolado.

## 1. Estrutura do Projeto

```text
com.empresa.projeto.endereco/
├── core/
│   ├── domain/model/
│   │   └── Endereco.java
│   └── usecase/
│       └── BuscarEnderecoPorCepUseCase.java
├── port/
│   ├── input/
│   │   └── BuscarEnderecoPorCepInputPort.java
│   └── output/
│       └── CepApiOutputPort.java
└── adapter/
    ├── input/
    │   └── controller/
    │       ├── EnderecoController.java
    │       ├── mapper/
    │       │   └── EnderecoControllerMapper.java
    │       └── dto/
    │           └── response/
    │               └── EnderecoResponse.java
    └── output/
        ├── client/
        │   ├── CepApiClient.java
        │   ├── ViaCepFeignClient.java
        │   ├── dto/
        │   │   └── response/
        │   │       └── ViaCepResponse.java
        │   └── mapper/
        │       └── CepApiMapper.java
        └── config/
            └── FeignClientConfig.java
```

## 2. Domain Model

```java
package com.empresa.projeto.endereco.core.domain.model;

/**
 * Entidade de domínio - SEM anotações externas (JPA, Lombok, Jackson)
 * Representa a verdade do negócio.
 */
public class Endereco {
    private String cep;
    private String logradouro;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf;
    
    // Getters e setters
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    
    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }
    
    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
    
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    
    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    
    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }
}
```

## 3. Ports

### Input Port (Entry Point)

```java
package com.empresa.projeto.endereco.port.input;

import com.empresa.projeto.endereco.core.domain.model.Endereco;

/**
 * Contrato de entrada - define o que o UseCase faz para o mundo externo
 */
public interface BuscarEnderecoPorCepInputPort {
    Endereco executar(String cep);
}
```

### Output Port (Infrastructure Contract)

```java
package com.empresa.projeto.endereco.port.output;

import com.empresa.projeto.endereco.core.domain.model.Endereco;

/**
 * Contrato de saída - define como o sistema busca dados externos
 * Interface em linguagem de domínio.
 */
public interface CepApiOutputPort {
    Endereco consultarCep(String cep);
}
```

## 4. UseCase (Lógica de Negócio)

```java
package com.empresa.projeto.endereco.core.usecase;

import com.empresa.projeto.endereco.core.domain.model.Endereco;
import com.empresa.projeto.endereco.port.input.BuscarEnderecoPorCepInputPort;
import com.empresa.projeto.endereco.port.output.CepApiOutputPort;

/**
 * UseCase - Orquestrador da regra de negócio
 * NÃO conhece detalhes de infraestrutura (Feign, HTTP, etc)
 */
public class BuscarEnderecoPorCepUseCase implements BuscarEnderecoPorCepInputPort {
    
    private final CepApiOutputPort cepApi;
    
    public BuscarEnderecoPorCepUseCase(CepApiOutputPort cepApi) {
        this.cepApi = cepApi;
    }
    
    @Override
    public Endereco executar(String cep) {
        if (cep == null || cep.isBlank()) {
            throw new IllegalArgumentException("CEP não pode ser vazio");
        }
        
        String cepLimpo = cep.replaceAll("[^0-9]", "");
        
        if (cepLimpo.length() != 8) {
            throw new IllegalArgumentException("CEP deve ter 8 dígitos");
        }
        
        Endereco endereco = cepApi.consultarCep(cepLimpo);
        
        if (endereco == null) {
            throw new RuntimeException("CEP não encontrado: " + cep);
        }
        
        return endereco;
    }
}
```

## 5. Adapter Layer (Implementação)

### DTO da API Externa (ViaCEP)

```java
package com.empresa.projeto.adapter.output.client.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que espelha o contrato da API ViaCEP
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ViaCepResponse {
    
    @JsonProperty("cep")
    private String cep;
    
    @JsonProperty("logradouro")
    private String logradouro;
    
    @JsonProperty("localidade")  // Nome diferente no domínio (cidade)
    private String localidade;
    
    @JsonProperty("uf")
    private String uf;
    
    @JsonProperty("erro")
    private Boolean erro;
}
```

### Mapper (Anti-Corruption Layer)

```java
package com.empresa.projeto.adapter.output.client.mapper;

import com.empresa.projeto.adapter.output.client.dto.response.ViaCepResponse;
import com.empresa.projeto.core.domain.model.Endereco;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CepApiMapper {
    
    @Mapping(source = "localidade", target = "cidade")
    Endereco toDomain(ViaCepResponse response);
}
```

### Feign Client Interface

```java
package com.empresa.projeto.adapter.output.client;

import com.empresa.projeto.adapter.output.client.dto.response.ViaCepResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
    name = "viacep-api",
    url = "${app.viacep.api.url:https://viacep.com.br}"
)
public interface ViaCepFeignClient {
    
    @GetMapping("/ws/{cep}/json/")
    ViaCepResponse consultarCep(@PathVariable("cep") String cep);
}
```

### Adapter (Implementação do OutputPort)

```java
package com.empresa.projeto.adapter.output.client;

import com.empresa.projeto.adapter.output.client.dto.response.ViaCepResponse;
import com.empresa.projeto.adapter.output.client.mapper.CepApiMapper;
import com.empresa.projeto.core.domain.model.Endereco;
import com.empresa.projeto.port.output.CepApiOutputPort;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CepApiClient implements CepApiOutputPort {
    
    private final ViaCepFeignClient feignClient;
    private final CepApiMapper mapper;
    
    public CepApiClient(ViaCepFeignClient feignClient, CepApiMapper mapper) {
        this.feignClient = feignClient;
        this.mapper = mapper;
    }
    
    @Override
    public Endereco consultarCep(String cep) {
        try {
            log.info("Consultando CEP: {}", cep);
            ViaCepResponse response = feignClient.consultarCep(cep);
            
            if (response == null || (response.getErro() != null && response.getErro())) {
                return null;
            }
            
            return mapper.toDomain(response);
        } catch (FeignException e) {
            log.error("Erro na integração com ViaCEP: {}", e.getMessage());
            throw new RuntimeException("Erro ao buscar CEP externo");
        }
    }
}
```

---
> [!TIP]
> Observe como o **Core** (Domain/UseCase) nunca importa nada do `feign` ou `jackson`. Toda a "sujeira" da API externa fica contida no `adapter/output/client`.

