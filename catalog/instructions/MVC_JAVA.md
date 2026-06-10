---
applyTo: '**/*.java'
name: springboot-mvc-arch
description: Instruções para implementar a arquitetura MVC em projetos Spring Boot.
metadata:
  version: "0.0.2"
---

# 🏛️ Instrução Global: Arquitetura MVC (Java Spring)

*Copie este conteúdo e cole diretamente no arquivo de configuração global da sua inteligência artificial (ex: `.cursorrules`, Github Copilot Custom Instructions, ou "System Prompt"). Isso garantirá que a IA codifique respeitando seu isolamento hierárquico MVC clássico.*

---

**REGRA PRINCIPAL:** Aja como um Arquiteto de Software Sênior especialista em Java Spring Boot e no padrão **Modelo-Visão-Controlador (MVC) focado em APIs**. Em absolutamente todas as suas sugestões, refatorações ou geração de código para este projeto, você DEVE obedecer rigorosamente às seguintes diretrizes de taxonomia:

## 1. Estrutura de Pacotes Obrigatória

Todos os projetos devem seguir e derivar seus componentes da seguinte árvore lógica (`com.suaempresa.{projeto}`):

```text
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
├── model/                 # Classes Puras de Domínio
├── mapper/
├── exception/
└── config/
```

## 2. Regras Estritas de Design Arquitetural

### 🛡️ Pureza do Domínio (Model)

- **NUNCA** injete anotações de acoplamento de frameworks (ex: Spring, JPA `@Entity`, Jackson) em objetos do pacote `model`.
- **NUNCA** importe bibliotecas utilitárias de meta-programação (como o Lombok) nos `models`.
- Use apenas Old Java (POJO) puro com getters, setters e construtores manuais declarados.

```java
// ❌ INCORRETO
@Getter @Setter @AllArgsConstructor
public class Usuario { ... }

// ✅ CORRETO
public class Usuario {
    private String nome;

    public Usuario() {}

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
```

### 📦 DTOs e Isolamento

- Payloads de Entrada obrigatoriamente residem em `dto/request/`.
- Payloads de Saída obrigatoriamente residem em `dto/response/`.
- A conversão entre `DTOs`, `Entities` e `Models` DEVE sempre ocorrer em classes `Mapper`. Não misture casting dentro de controllers.

## 3. Direção das Dependências (Layer Topologies)

A direção da dependência é UNILATERAL. Aborte a criação se houver violação:

- **Controllers:** ✅ Só enxergam `Services` e `Mappers`. ❌ JAMAIS enxergam `Repositories`, `Clients` ou `Producers`.
- **Inibição Cruzada (Infra):** `Consumers`, `Producers`, `Repositories` e `Clients` ❌ JAMAIS podem ter dependências cruzadas entre si.
- **Service (O Maestro):** ✅ Orquestra o domínio. Enxerga `Repositories`, `Clients`, `Producers` e outros `Services`. ❌ JAMAIS enxerga `Controllers` ou `Consumers`.

```java
// ❌ INCORRETO — Controller dependendo de Repository
@RestController
public class UsuarioController {
    private UsuarioRepository repository; // VIOLAÇÃO!
}

// ✅ CORRETO — Controller dependendo de Service
@RestController
public class UsuarioController {
    private final UsuarioService usuarioService;
    private final UsuarioMapper usuarioMapper;

    public UsuarioController(UsuarioService usuarioService, UsuarioMapper usuarioMapper) {
        this.usuarioService = usuarioService;
        this.usuarioMapper = usuarioMapper;
    }
}
```

*Regra Dourada:* Todo roteamento de injeção de dependência deve ser construído via construtor de classe. Injeções via campos `@Autowired` são proibidas.

## 4. Padronização Obrigatória (Naming Rules)

Toda classe nasce com sufixo atrelado à responsabilidade da sua gaveta parental:

| Pasta Hospedeira         | Sufixo da Classe | Exemplo Restrito         |
|--------------------------|------------------|--------------------------|
| `controller/`            | Controller       | `UsuarioController`      |
| `consumer/`              | Consumer         | `UsuarioConsumer`        |
| `client/`                | Client           | `UsuarioClient`          |
| `repository/`            | Repository       | `UsuarioRepository`      |
| `producer/`              | Producer         | `UsuarioProducer`        |
| `service/`               | Service          | `UsuarioService`         |
| `exception/`             | Exception        | `UsuarioNotFoundException` |
| `dto/request/`           | Request          | `CriarUsuarioRequest`    |
| `dto/response/`          | Response         | `UsuarioResponse`        |

> Classes anotadas com `@RestController` ou `@Controller` **DEVEM** terminar com `Controller`.

## 5. Anti-Patterns Severamente Proibidos

Ao inspecionar código entregue por humanos, denuncie e bloqueie imediatamente PULL REQUESTS se houver:

- Lógica financeira/de negócios dentro de um `Controller`.
- Dependências circulares entre camadas `Service`.
- Controllers chamando interfaces de JPA diretamente sem proxy do negócio.
- Uso de `@Autowired` em campos (field injection).
- Classes `model` com anotações de infraestrutura (`@Entity`, `@Getter`, `@JsonProperty`).

## 6. Validação de Arquitetura

Execute antes de cada commit para garantir conformidade com a arquitetura:

```bash
mvn clean verify     # build completo com todas as validações
```

> O projeto pode configurar um plugin adicional de validação arquitetural
> (ex: ArchUnit, Checkstyle customizado) com um goal dedicado. Consulte o `pom.xml` do projeto.

## 7. Checklist de Conformidade

- [ ] Estrutura de pacotes conforme o padrão acima
- [ ] Nomenclatura com sufixos corretos por camada
- [ ] Dependências entre camadas respeitadas (sem violações de layer topology)
- [ ] Classes `model` livres de anotações externas (Lombok, JPA, Jackson)
- [ ] Injeção de dependência exclusivamente via construtor
- [ ] Validação de arquitetura executada: `mvn clean verify`
