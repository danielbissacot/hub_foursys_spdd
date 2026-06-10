---
applyTo: '**/*.java'
name: Validação de Arquitetura MVC
description: Instruções para validar a arquitetura MVC em projetos Spring Boot.
metadata:
  version: "0.0.2"
---

# Template: Validação de Arquitetura MVC

Copie o texto do bloco abaixo e cole no seu assistente de IA preferido, junto com os arquivos ou a árvore de diretórios do seu projeto. O prompt inclui todas as regras obrigatórias de arquitetura do Hub para que a IA faça a validação perfeita.

---

### 📋 Copie o Prompt abaixo

```text
Atue como um Arquiteto de Software Especialista em Java e Arquitetura MVC (Spring Boot).

Por favor, analise as classes e a estrutura do código que vou fornecer a seguir. Quero que você avalie de forma rigorosa se a implementação atual respeita os pilares da Arquitetura MVC adotados pelo nosso Hub de Governança.

Abaixo estão as Regras Obrigatórias que você deve usar como base para a sua validação:

<regras_arquitetura>
## Estrutura de Pastas Esperada
Considere o pacote raiz fornecido no código do usuário como base. A partir dele, exija a seguinte subdivisão estrutural:

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

## Antipadrões Comuns (Aja como validador destes pontos)
- Evitar: Lógica de negócio em Controllers, Controllers acessando Repository diretamente, Model com anotações de infraestrutura, field injection com @Autowired, dependências circulares entre Services.
- Garantir: Injeção via construtor, Mappers para todas as conversões de camada, Model puramente Java.

## Validação de Arquitetura
Após a análise manual, oriente o desenvolvedor a executar:
- `mvn clean verify` — build completo com todas as validações
- Verifique no `pom.xml` se há um plugin de validação arquitetural configurado (ex: ArchUnit, Checkstyle customizado) e execute-o conforme documentado no projeto.
</regras_arquitetura>

Com base nestas regras, gere um laudo técnico contendo:
1. Checklist de Validação: Informe o que está de acordo com a estrutura `[RAIZ_DO_PROJETO]`.
2. Violações: Quais regras (LAYER_RULES, DESIGN_RULES, NAMING_RULES) foram quebradas, citando arquivos faltantes ou trechos de código ofensores.
3. Refatoração: Sugestão imediata de refatoração para adequar ao padrão MVC, incluindo correção de imports e nomes de pacotes caso existam falhas.
```
