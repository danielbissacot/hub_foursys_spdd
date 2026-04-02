# Estrutura de Integração Feign em Arquitetura MVC

Em projetos seguindo o padrão MVC ou arquitetura em camadas, a integração com Feign Client deve ser organizada para manter a separação de responsabilidades.

## Estrutura de Pastas Sugerida

```text
src/main/java/com/empresa/projeto/
├── client/                 # Interfaces Feign e DTOs de integração
│   ├── dto/                # Objetos de Entrada/Saída da API externa
│   │   ├── request/
│   │   └── response/
│   ├── fallback/           # Implementações de fallback (opcional)
│   └── UsuarioClient.java  # Interface @FeignClient
├── service/                # Lógica de negócio que consome o Client
└── config/                 # Configurações do Feign
```

## Exemplo de Fluxo

1. **Client**: Define o contrato com a API externa.
2. **Service**: Injeta o `UsuarioClient` e trata os dados antes de enviar para o Controller ou persistir.
3. **DTOs**: Devem refletir exatamente o JSON da API externa, usando `@JsonProperty` para mapeamento de campos.

---
> [!TIP]
> Use esta estrutura para projetos legados ou microserviços de baixa complexidade onde o isolamento total do domínio não é o requisito primário.
