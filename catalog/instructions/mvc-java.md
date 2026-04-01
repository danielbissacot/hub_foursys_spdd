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
- Use apenas Old Java (POJO) puro com getters, setters e construtores manuais declarados para que o modelo central sobreviva a qualquer troca de framework no futuro.

### 📦 DTOs e Isolamento
- Payloads de Entrada obrigatoriamente residem em `dto/request/`.
- Payloads de Saída obrigatoriamente residem em `dto/response/`.
- A manipulação e conversão entre `DTOs`, `Entities` do banco e `Models` puros DEVE sempre ocorrer em classes especialistas categorizadas como `Mappers`. Não misture casting dentro de controllers.

## 3. Direção das Dependências (Layer Topologies)

A direção da dependência é UNILATERAL. Aborte a criação se houver violação nas cordas abaixo:

- **Controllers:** ✅ Só enxergam `Services` e `Mappers`. ❌ JAMAIS enxergam `Repositories`, `Clients` ou `Producers` (você não expõe a base para a Request API).
- **Inibição Cruzada (Infra):** `Consumers`, `Producers`, `Repositories` e `Clients` ❌ JAMAIS podem ter dependências puxadas entre si.
- **Service (O Maestro):** ✅ Orquestra o domínio. Enxerga `Repositories`, `Clients`, `Producers` e outros `Services`. ❌ JAMAIS enxergam `Controllers` ou `Consumers` (A camada de regra de negócios fica cega pra internet).

*Regra Dourada:* Todo roteamento de injeção de dependência deve ser construído via construtor de classe. Injeções sorrateiras via campos `@Autowired` são proibidas.

## 4. Padronização Obrigatória (Naming Rules)

Toda classe nasce com sufixo atrelado à responsabilidade da sua gaveta parental:

| Pasta Hospedeira | Sufixo da Classe | Exemplo Restrito |
|--------|-------------------|---------|
| `controller/` | Controller | `UsuarioController` |
| `consumer/` | Consumer | `UsuarioConsumer` |
| `client/` | Client | `UsuarioClient` |
| `repository/` | Repository | `UsuarioRepository` |
| `producer/` | Producer | `UsuarioProducer` |
| `service/` | Service | `UsuarioService` |
| `exception/` | Exception | `UsuarioNotFoundException` |
| `dto/request` ou `response/` | Request / Response | `CriarUsuarioRequest` |

## 5. Anti-Patterns Severamente Proibidos

Ao inspecionar código entregue por humanos, denuncie e bloqueie imediatamente PULL REQUESTS se houver:
- Lógica financeira/de negócios socada dentro de um `Controller`.
- Dependências circulares entre camadas `Service`.
- Controllers chamando interfaces de JPA Diretamente sem proxy do negócio.
