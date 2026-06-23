# Exemplo Completo: Integração com API de CEP

Este exemplo demonstra como implementar uma integração com a API ViaCEP usando Feign Client seguindo arquitetura hexagonal.

## 1. Estrutura do Projeto

```
br.com.bradesco.endereco/
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
package br.com.bradesco.endereco.core.domain.model;

/**
 * Entidade de domínio - SEM anotações externas
 */
public class Endereco {
    private String cep;
    private String logradouro;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf;
    
    // Getters e setters manuais
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

### Input Port

```java
package br.com.bradesco.endereco.port.input;

import br.com.bradesco.endereco.core.domain.model.Endereco;

/**
 * Contrato de entrada - define o que o UseCase faz
 */
public interface BuscarEnderecoPorCepInputPort {
    
    /**
     * Busca endereço completo por CEP
     * @param cep CEP no formato 12345678 ou 12345-678
     * @return Endereco encontrado
     * @throws IllegalArgumentException se CEP inválido
     * @throws RuntimeException se CEP não encontrado
     */
    Endereco executar(String cep);
}
```

### Output Port

```java
package br.com.bradesco.endereco.port.output;

import br.com.bradesco.endereco.core.domain.model.Endereco;

/**
 * Contrato de saída - define como buscar endereços
 * Interface em linguagem de domínio (não menciona API externa)
 */
public interface CepApiOutputPort {
    
    /**
     * Consulta endereço por CEP
     * @param cep CEP formatado (apenas números)
     * @return Endereco ou null se não encontrado
     */
    Endereco consultarCep(String cep);
}
```

## 4. UseCase

```java
package br.com.bradesco.endereco.core.usecase;

import br.com.bradesco.endereco.core.domain.model.Endereco;
import br.com.bradesco.endereco.port.input.BuscarEnderecoPorCepInputPort;
import br.com.bradesco.endereco.port.output.CepApiOutputPort;

/**
 * UseCase - implementa regra de negócio
 * NÃO conhece detalhes de infraestrutura
 */
public class BuscarEnderecoPorCepUseCase implements BuscarEnderecoPorCepInputPort {
    
    private final CepApiOutputPort cepApi;
    
    public BuscarEnderecoPorCepUseCase(CepApiOutputPort cepApi) {
        this.cepApi = cepApi;
    }
    
    @Override
    public Endereco executar(String cep) {
        // 1. Validação de negócio
        validarCep(cep);
        
        // 2. Normalizar CEP (remover formatação)
        String cepLimpo = cep.replaceAll("[^0-9]", "");
        
        // 3. Consultar via OutputPort
        Endereco endereco = cepApi.consultarCep(cepLimpo);
        
        // 4. Validar resultado
        if (endereco == null) {
            throw new RuntimeException("CEP não encontrado: " + cep);
        }
        
        // 5. Aplicar regras de negócio (exemplo)
        if (endereco.getUf() == null || endereco.getUf().isEmpty()) {
            throw new RuntimeException("Endereço incompleto");
        }
        
        return endereco;
    }
    
    private void validarCep(String cep) {
        if (cep == null || cep.isBlank()) {
            throw new IllegalArgumentException("CEP não pode ser vazio");
        }
        
        String cepLimpo = cep.replaceAll("[^0-9]", "");
        
        if (cepLimpo.length() != 8) {
            throw new IllegalArgumentException("CEP deve ter 8 dígitos");
        }
    }
}
```

## 5. Adapter Layer

### DTO da API Externa (ViaCEP)

```java
package br.com.bradesco.endereco.adapter.output.client.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que espelha o contrato da API ViaCEP
 * Pode usar anotações externas (Lombok, Jackson)
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
    
    @JsonProperty("complemento")
    private String complemento;
    
    @JsonProperty("bairro")
    private String bairro;
    
    @JsonProperty("localidade")  // Nome diferente no domínio!
    private String localidade;
    
    @JsonProperty("uf")
    private String uf;
    
    @JsonProperty("erro")  // Campo de erro da API
    private Boolean erro;
}
```

### Mapper (Anti-Corruption Layer)

```java
package br.com.bradesco.endereco.adapter.output.client.mapper;

import br.com.bradesco.endereco.adapter.output.client.dto.response.ViaCepResponse;
import br.com.bradesco.endereco.core.domain.model.Endereco;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.Named;

/**
 * Mapper - ACL que traduz entre API externa e domínio usando MapStruct
 * Protege o domínio de mudanças na API
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CepApiMapper {
    
    /**
     * Converte response da ViaCEP para entidade de domínio
     * MapStruct mapeia automaticamente campos com mesmo nome
     * @Mapping para campos com nomes diferentes e transformações customizadas
     */
    @Mapping(source = "localidade", target = "cidade")
    @Mapping(source = "cep", target = "cep", qualifiedByName = "formatarCep")
    Endereco toDomain(ViaCepResponse response);
    
    /**
     * Formata CEP: 12345678 → 12345-678
     * Método auxiliar usado pelo MapStruct
     */
    @Named("formatarCep")
    default String formatarCep(String cep) {
        if (cep == null || cep.length() != 8) {
            return cep;
        }
        return cep.substring(0, 5) + "-" + cep.substring(5);
    }
}
```

### Feign Client Interface

```java
package br.com.bradesco.endereco.adapter.output.client;

import br.com.bradesco.endereco.adapter.output.client.dto.response.ViaCepResponse;
import br.com.bradesco.endereco.adapter.output.config.FeignClientConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Interface declarativa do Feign para ViaCEP
 * Sufixo: FeignClient
 */
@FeignClient(
    name = "viacep-api",
    url = "${app.viacep.api.url:https://viacep.com.br}",
    configuration = FeignClientConfig.class
)
public interface ViaCepFeignClient {
    
    /**
     * Consulta CEP na API ViaCEP
     * GET https://viacep.com.br/ws/01310100/json/
     */
    @GetMapping("/ws/{cep}/json/")
    ViaCepResponse consultarCep(@PathVariable("cep") String cep);
}
```

### Adapter (Implementação do OutputPort)

```java
package br.com.bradesco.endereco.adapter.output.client;

import br.com.bradesco.endereco.adapter.output.client.dto.response.ViaCepResponse;
import br.com.bradesco.endereco.adapter.output.client.mapper.CepApiMapper;
import br.com.bradesco.endereco.core.domain.model.Endereco;
import br.com.bradesco.endereco.port.output.CepApiOutputPort;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Adapter que implementa o OutputPort usando Feign
 * Sufixo: Client
 */
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
            log.info("Consultando CEP na ViaCEP: {}", cep);
            
            ViaCepResponse response = feignClient.consultarCep(cep);
            
            if (response.getErro() != null && response.getErro()) {
                log.warn("CEP não encontrado na ViaCEP: {}", cep);
                return null;
            }
            
            Endereco endereco = mapper.toDomain(response);
            log.info("CEP encontrado: {} - {}", endereco.getCep(), endereco.getCidade());
            
            return endereco;
            
        } catch (FeignException.NotFound e) {
            log.warn("CEP não encontrado (404): {}", cep);
            return null;
            
        } catch (FeignException e) {
            log.error("Erro ao consultar ViaCEP. Status: {}, Mensagem: {}", 
                e.status(), e.getMessage());
            throw new RuntimeException("Erro na consulta de CEP", e);
        }
    }
}
```

## 6. Configuration

### UseCase Config

```java
package br.com.bradesco.endereco.config;

import br.com.bradesco.endereco.core.usecase.BuscarEnderecoPorCepUseCase;
import br.com.bradesco.endereco.port.input.BuscarEnderecoPorCepInputPort;
import br.com.bradesco.endereco.port.output.CepApiOutputPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UseCaseConfig {
    
    @Bean
    public BuscarEnderecoPorCepInputPort buscarEnderecoPorCepInputPort(
            CepApiOutputPort cepApi) {
        return new BuscarEnderecoPorCepUseCase(cepApi);
    }
}
```

## 7. Controller Mapper

```java
package br.com.bradesco.endereco.adapter.input.controller.mapper;

import br.com.bradesco.endereco.adapter.input.controller.dto.response.EnderecoResponse;
import br.com.bradesco.endereco.core.domain.model.Endereco;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

/**
 * Mapper para converter entidade de domínio para DTO de resposta do controller
 * Usa MapStruct para mapeamento automático
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface EnderecoControllerMapper {
    
    /**
     * Converte entidade de domínio para DTO de resposta
     * MapStruct mapeia automaticamente campos com mesmo nome
     */
    EnderecoResponse toResponse(Endereco endereco);
}
```

## 8. Controller

```java
package br.com.bradesco.endereco.adapter.input.controller;

import br.com.bradesco.endereco.adapter.input.controller.dto.response.EnderecoResponse;
import br.com.bradesco.endereco.core.domain.model.Endereco;
import br.com.bradesco.endereco.port.input.BuscarEnderecoPorCepInputPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/enderecos")
public class EnderecoController {
    
    private final BuscarEnderecoPorCepInputPort buscarEnderecoPorCepInputPort;
    private final EnderecoControllerMapper mapper;
    
    public EnderecoController(
            BuscarEnderecoPorCepInputPort buscarEnderecoPorCepInputPort,
            EnderecoControllerMapper mapper) {
        this.buscarEnderecoPorCepInputPort = buscarEnderecoPorCepInputPort;
        this.mapper = mapper;
    }
    
    @GetMapping("/cep/{cep}")
    public ResponseEntity<EnderecoResponse> buscarPorCep(@PathVariable String cep) {
        log.info("Buscando endereço para CEP: {}", cep);
        
        Endereco endereco = buscarEnderecoPorCepInputPort.executar(cep);
        EnderecoResponse response = mapper.toResponse(endereco);
        
        return ResponseEntity.ok(response);
    }
}
```
