---
name: springboot-validacao-mvc
description: |
  Valida se a implementação Spring Boot respeita os pilares da Arquitetura MVC
  adotados pelo Hub de Governança Foursys.
  Verifica estrutura de pastas (controller/service/repository/client/producer/model),
  regras de camadas (sem dependências cruzadas), regras de design (Model puro,
  injeção via construtor, Mappers obrigatórios) e nomenclatura.
  Use quando: finalizar uma feature MVC, ao receber código legado, ou code review de PR.
metadata:
  version: "0.0.1"
---

# Skill: Validação de Arquitetura MVC — Spring Boot

Atue como um Arquiteto de Software Especialista em Java e Arquitetura MVC (Spring Boot).

Analise as classes e a estrutura do código fornecido. Avalie de forma rigorosa se a implementação atual respeita os pilares da Arquitetura MVC adotados pelo Hub de Governança Foursys.

## Estrutura de Pastas Esperada

```
[RAIZ_DO_PROJETO]/
├── controller/
│   ├── mapper/
│   └── dto/
│       ├── request/
│       └── response/
├── consumer/
├── service/
├── repository/
│   ├── mapper/
│   └── entity/
├── client/
│   ├── mapper/
│   └── dto/
│       ├── request/
│       └── response/
├── producer/
├── model/
├── mapper/
├── exception/
└── config/
```

## Regras de Camadas (LAYER_RULES)
❌ **Dependências Proibidas:**
1. Controllers não dependem de Repositories, Clients ou Producers
2. Consumers, Producers, Repositories e Clients não possuem dependências cruzadas entre si
3. Services não dependem de Controllers ou Consumers
4. Nenhuma camada possui dependências circulares

✅ **Dependências Permitidas:**
- Controller → Service + Mapper
- Consumer → Service + Mapper
- Client → Service + Mapper
- Repository → Service + Mapper
- Service → Repository + Client + Producer + outros Services

## Regras de Design (DESIGN_RULES)
- **Pureza do Model:** Classes em `model/` NÃO podem ter anotações externas (ex: @Getter, @Setter, @Entity, @JsonProperty). Use apenas POJO puro com getters/setters/construtores manuais.
- **DTOs:** Classes Request DEVEM estar em `dto/request/`, classes Response em `dto/response/`.
- **Injeção:** Toda injeção de dependência DEVE ser via construtor (nunca `@Autowired` em campo).
- **Mappers:** Conversões entre DTO, Entity e Model DEVEM ocorrer em classes Mapper — nunca dentro de Controllers ou Services.

## Regras de Nomenclatura (NAMING_RULES)
- controller/ → Controller (ex: UsuarioController)
- consumer/ → Consumer (ex: UsuarioConsumer)
- client/ → Client (ex: UsuarioClient)
- repository/ → Repository (ex: UsuarioRepository)
- producer/ → Producer (ex: UsuarioProducer)
- service/ → Service (ex: UsuarioService)
- exception/ → Exception (ex: UsuarioNotFoundException)
- dto/request/ → Request (ex: CriarUsuarioRequest)
- dto/response/ → Response (ex: UsuarioResponse)
- Classes com @RestController ou @Controller DEVEM terminar com Controller

## Antipadrões Comuns (Validar obrigatoriamente)
- Evitar: Lógica de negócio em Controllers, Controllers acessando Repository diretamente, Model com anotações de infraestrutura, field injection com @Autowired, dependências circulares entre Services.
- Garantir: Injeção via construtor, Mappers para todas as conversões de camada, Model puramente Java.

## Validação Final
Após a análise, oriente o desenvolvedor a executar:
- `mvn clean verify` — build completo com todas as validações
- Verifique no `pom.xml` se há plugin de validação arquitetural configurado (ex: ArchUnit, Checkstyle customizado).

## Laudo Técnico Exigido
Com base nestas regras, gere um laudo técnico contendo:
1. **Checklist de Validação:** Informe o que está de acordo com a estrutura `[RAIZ_DO_PROJETO]`.
2. **Violações:** Quais regras (LAYER_RULES, DESIGN_RULES, NAMING_RULES) foram quebradas, citando arquivos faltantes ou trechos de código ofensores.
3. **Refatoração:** Sugestão imediata de refatoração para adequar ao padrão MVC, incluindo correção de imports e nomes de pacotes caso existam falhas.
