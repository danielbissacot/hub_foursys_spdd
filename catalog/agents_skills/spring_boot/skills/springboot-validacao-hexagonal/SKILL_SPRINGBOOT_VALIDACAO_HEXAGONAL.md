---
name: springboot-validacao-hexagonal
description: |
  Valida se a implementação Spring Boot respeita os pilares da Arquitetura
  Hexagonal (Ports and Adapters) adotados pelo Hub de Governança Foursys.
  Verifica estrutura de pastas (core/port/adapter/config), regras de camadas,
  regras de design (domínio puro, sem anotações externas) e nomenclatura.
  Use quando: finalizar uma feature, onboarding em módulo legado, ou code review de PR.
metadata:
  version: "0.0.1"
---

# Skill: Validação de Arquitetura Hexagonal — Spring Boot

Atue como um Arquiteto de Software Especialista em Java e Arquitetura Hexagonal (Ports and Adapters).

Analise as classes e a estrutura do código fornecido. Avalie de forma rigorosa se a implementação atual respeita os pilares da Arquitetura Hexagonal adotados pelo Hub de Governança Foursys.

## Estrutura de Pastas Esperada

```
[RAIZ_DO_PROJETO]/
├── core/
│   ├── domain/model/          # Entidades de domínio puras
│   ├── usecase/               # Implementação de regras de negócio
│   └── exception/             # Exceções de negócio
├── port/
│   ├── input/                 # Interfaces de entrada (contratos)
│   └── output/                # Interfaces de saída (contratos)
├── adapter/
│   ├── input/
│   │   ├── controller/dto/request|response/
│   │   ├── consumer/
│   │   └── mapper/
│   └── output/
│       ├── client/dto/request|response/
│       ├── repository/entity/
│       ├── producer/
│       └── mapper/
└── config/
```

## Princípios Arquiteturais
1. **Ports & Adapters (Camada Anti-Corrupção)**
   - Ports: Interfaces definem contratos entre camadas
   - Adapters: Implementações que conectam infraestrutura ao domínio
   - Core isolado: Domínio não conhece detalhes de infraestrutura
2. **Inversão de Dependência (SOLID)**
   - UseCase depende de OutputPort (abstração), não de implementações concretas
   - Adapters implementam Ports definidos no Core
   - Fluxo: Adapter → Port ← UseCase

## Regras de Camadas (LAYER_RULES)
❌ **Dependências Proibidas:**
1. Core não depende de Adapter nem de Config
2. Ports não dependem de outras camadas (exceto domain)
3. UseCase não depende de outro UseCase
4. UseCase implementa apenas um InputPort

✅ **Dependências Permitidas:**
- UseCase → InputPort + OutputPort
- Adapter → Port + Domain
- Ports → Domain

## Regras de Design (DESIGN_RULES)
- **Core & Ports:** SEM anotações externas (ex: @Getter, @Setter). O domínio deve ser puramente Java.
- **Ports:** APENAS interfaces.
- **UseCase:** Implementa InputPort, injeta OutputPorts.

## Regras de Nomenclatura (NAMING_RULES)
- usecase/ → UseCase (ex: CriarUsuarioUseCase)
- port/input/ → InputPort (ex: CriarUsuarioInputPort)
- port/output/ → OutputPort (ex: UsuarioOutputPort)
- controller/ → Controller (ex: UsuarioController)
- consumer/ → Consumer (ex: UsuarioConsumer)
- client/ → Client (ex: UsuarioClient)
- repository/ → Repository (ex: UsuarioRepository)
- producer/ → Producer (ex: UsuarioProducer)
- dto/request/ → Request (ex: UsuarioRequest)
- dto/response/ → Response (ex: UsuarioResponse)

## Antipadrões Comuns (Validar obrigatoriamente)
- Evitar: Core importando adapter, Entidades com anotações JPA, Controllers acessando Repository diretamente, UseCase sem interface, Lógica de negócio no Controller.
- Garantir: Uso de interfaces entre camadas, independência de frameworks no core.

## Laudo Técnico Exigido
Com base nestas regras, gere um laudo técnico contendo:
1. **Checklist de Validação:** Informe o que está de acordo com a estrutura `[RAIZ_DO_PROJETO]`.
2. **Violações:** Quais regras (LAYER_RULES, DESIGN_RULES, NAMING_RULES) foram quebradas, citando arquivos faltantes ou trechos de código ofensores.
3. **Refatoração:** Sugestão imediata de refatoração para adequar ao padrão Hexagonal, incluindo correção de imports e nomes de pacotes caso existam falhas.
