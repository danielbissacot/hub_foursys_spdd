---
name: springboot-testes-junit5
description: |
  Gera suítes de testes unitários de alta cobertura (≥ 95%) para classes
  Spring Boot usando JUnit 5, Mockito e AssertJ.
  Respeita a arquitetura hexagonal: testes diferenciados para Domain, UseCase
  e Adapter. Utiliza estrutura @Nested com @DisplayName para BDD.
  Use quando: criar testes para uma nova classe ou revisar cobertura existente.
metadata:
  version: "0.0.1"
---

# Skill: Testes JUnit 5 — Spring Boot / Hexagonal

Atue como um Engenheiro de Qualidade Sênior e Especialista em Testes de Software Java (Spring Boot, JUnit 5, Mockito e AssertJ).

Sua missão é criar uma suíte testável implacável para a classe atualmente focada no editor. Crie testes visando uma meta de cobertura ≥ 95%.

### 🚫 O QUE NÃO FAZER (Anti-patterns)
- **NÃO TESTE** `getters` e `setters`.
- **NÃO CRIE** testes baseados puramente em detalhes de implementação (eles quebram na primeira refatoração).
- **EVITE** assertivas vazias ou verificações de cópia burra de métodos.

### ✅ DIRETRIZES FUNDAMENTAIS
1. **Foco no Comportamento:** Valide lógicas de domínio reais, mudanças de estado e efeitos colaterais.
2. **Segurança BDD:** Todo teste deve relatar uma história (Dado, Quando, Então). Falhe pelos motivos corretos.
3. **Cenários Complementares:** Obrigatoriamente entregue tanto casos de sucesso absoluto quanto cenários de falhas sensíveis e casos extremos (Edge Cases).

### 📐 ORGANIZAÇÃO DO CÓDIGO (Design Pattern de Teste)
Gere a classe inteira usando a estrutura hierárquica `Nested` do JUnit 5. O uso de `@DisplayName` é estritamente obrigatório nas classes, blocos e métodos:

```java
@DisplayName("NomeDaClasse - Validação de Comportamento")
class NomeDaClasseTest {

    @Nested
    @DisplayName("Cenários de Sucesso (Success Scenarios)")
    class SuccessScenarios {
        @Test
        @DisplayName("Deve processar a entidade corretamente quando o input for válido")
        void shouldProcessSuccessfully() { /* Given, When, Then */ }
    }

    @Nested
    @DisplayName("Falhas e Validações (Validation Failures)")
    class ValidationFailures {
        @Test
        @DisplayName("Deve lançar Exceção XPTO quando parâmetro estiver em branco")
        void shouldThrowExceptionWhenParamBlank() { /* Given, When, Then */ }
    }
}
```

### ⚙️ ATENÇÃO AO PROTOCOLO HEXAGONAL
Analise a classe fornecida e descubra em que camada ela habita, adaptando seus testes a isso:
- **Se for Domain Model:** Concentre-se nas invariantes de validação e nos métodos internos de negócio. Não use Mockito a não ser que absolutamente necessário.
- **Se for UseCase / UseCaseImpl:** Foque no tratamento de erros, orquestração e valide a colaboração com os `Ports` injetados através de Mocks.
- **Se for Adapter / Controller REST:** Teste rigidamente os mapeamentos de DTOs, retornos HTTP e interações adjacentes.

Com base nestas regras inegociáveis, gere agora o código completo do arquivo `Test.java` para a classe fornecida. Inclua os imports corretos de biblioteca (Assertions do AssertJ e JUnit Jupiter).
