---
applyTo: '**/*.java'
name: Guia de Arquitetura Hexagonal com Spring Boot
description: Instruções para implementar a arquitetura hexagonal em projetos Spring Boot.
metadata:
  version: "0.0.1"
---

# Template: Validação de Arquitetura Hexagonal

Copie o texto do bloco abaixo e cole no seu assistente de IA preferido, junto com os arquivos ou a árvore de diretórios do seu projeto. O prompt inclui todas as regras obrigatórias de arquitetura do Hub para que a IA faça a validação perfeita.

---

### 📋 Copie o Prompt abaixo

```text
Atue como um Arquiteto de Software Especialista em Java e Arquitetura Hexagonal (Ports and Adapters). 

Por favor, analise as classes e a estrutura do código que vou fornecer a seguir. Quero que você avalie de forma rigorosa se a implementação atual respeita os pilares da Arquitetura Hexagonal adotados pelo nosso Hub de Governança.

Abaixo estão as Regras Obrigatórias que você deve usar como base para a sua validação:

<regras_arquitetura>
## Estrutura de Pastas Esperada
Considere o pacote raiz fornecido no código do usuário como base. A partir dele, exija a seguinte subdivisão estrutural:

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
- usecase/ -> UseCase (ex: CriarUsuarioUseCase)
- port/input/ -> InputPort (ex: CriarUsuarioInputPort)
- port/output/ -> OutputPort (ex: UsuarioOutputPort)
- controller/ -> Controller (ex: UsuarioController)
- consumer/ -> Consumer (ex: UsuarioConsumer)
- client/ -> Client (ex: UsuarioClient)
- repository/ -> Repository (ex: UsuarioRepository)
- producer/ -> Producer (ex: UsuarioProducer)
- dto/request/ -> Request (ex: UsuarioRequest)
- dto/response/ -> Response (ex: UsuarioResponse)

## Antipadrões Comuns (Aja como validador destes pontos)
- Evitar: Core importando adapter, Entidades com anotações JPA, Controllers acessando Repository diretamente, UseCase sem interface, Lógica de negócio no Controller.
- Garantir: Uso de interfaces entre camadas, independência de frameworks no core.
</regras_arquitetura>

Com base nestas regras, gere um laudo técnico contendo:
1. Checklist de Validação: Informe o que está de acordo com a estrutura `[RAIZ_DO_PROJETO]`.
2. Violações: Quais regras (LAYER_RULES, DESIGN_RULES, NAMING_RULES) foram quebradas, citando arquivos faltantes ou trechos de código ofensores.
3. Refatoração: Sugestão imediata de refatoração para adequar ao padrão Hexagonal, incluindo correção de imports e nomes de pacotes caso existam falhas.
```
