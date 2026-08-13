---
name: 'springboot-testing'
description: "Cria testes unitários significativos em Java 21 + Spring Boot com JUnit 5, Mockito e AssertJ. Cobre teste por camada hexagonal (Domain, UseCase, Adapter), padrão AAA com @Nested/@DisplayName, escolha entre teste de estado e de interação, metas de cobertura (linha ≥ 95%, branch ≥ 90%) medidas com JaCoCo, e os test smells que reprovam em review. Use quando a história exigir testes novos, correção de teste frágil ou aumento de cobertura para o gate do Sonar."
metadata:
  version: "0.1.0"
---

# Skill: springboot-testing

Guia para escrever testes **significativos** — focados em comportamento, não em implementação — em projetos Java 21 + Spring Boot 3.x com Arquitetura Hexagonal.

> **Invocado por:** `foursys-constitution.md` e `foursys-specify-tech.md` Spring Boot sempre que a história gerar código novo (todo código novo exige teste) ou quando a cobertura precisar subir para o gate do Sonar.

## Quando usar

- Escrever testes para código novo (Domain, UseCase, Adapter)
- Aumentar cobertura para atingir o mínimo de 95% de linha
- Corrigir teste frágil, lento ou instável (flaky)
- Revisar se os testes existentes realmente validam regra de negócio

## Quando não usar

- Teste de contrato entre serviços (use Pact/Spring Cloud Contract)
- Teste de carga/performance (use Gatling/JMeter)
- Teste end-to-end de jornada (fora do escopo unitário)

## Princípio central: comportamento, não implementação

Cobertura de 95% é **necessária, mas não suficiente**. Um teste só vale se:

1. Valida regra de negócio real
2. Cobre caminho de sucesso **e** de falha
3. Cobre casos de borda relevantes
4. Tem nome descritivo em estilo BDD
5. É independente e determinístico
6. Falha pelo motivo certo
7. Serve como documentação viva

**❌ Não teste:** getters/setters, código de framework, chamada de método sem asserção de resultado.

**✅ Teste:** regras de negócio, cenários de erro, mudanças de estado, integração entre componentes.

## Organização (padrão obrigatório)

Padrão **AAA** (Arrange, Act, Assert), com classes aninhadas e nomes descritivos:

```java
@DisplayName("Processar Ingestão de Boleto - UseCase")
class ProcessarIngestaoBoletoServiceTest {

    @Nested
    @DisplayName("Cenários de Sucesso")
    class CenariosDeSucesso {
        @Test
        @DisplayName("Deve atualizar data de alteração para operação de BAIXA")
        void deveAtualizarDataParaOperacaoBaixa() {
            // Arrange
            // Act
            // Assert
        }
    }

    @Nested
    @DisplayName("Falhas de Validação")
    class FalhasDeValidacao {
        @Test
        @DisplayName("Deve rejeitar boleto sem identificador")
        void deveRejeitarBoletoSemIdentificador() { }
    }
}
```

## Teste por camada hexagonal

### Domain (model, entity, common)
Invariantes, validação de value object, transição de estado, `equals`/`hashCode`.
Sem mock — domínio é puro, testa direto.

### UseCase / Service
Orquestração, tratamento de erro, colaboração com as ports.
Mock **apenas das ports** (`OutputPort`), nunca de objeto de domínio.

### Adapter de entrada (Controller)
Todos os status HTTP, validação de request, estrutura da response, respostas de erro,
query params e path variables. Use `@WebMvcTest` + `MockMvc`.

### Adapter de saída (Repository, Client)
Mapeamento de DTO, CRUD, queries customizadas, retry e timeout.
Cliente externo: testar resposta de sucesso **e** de erro.

## Mocking — regras

- Mock só de dependência externa: port, repository, API
- **Nunca** mock de objeto de domínio ou value object
- Over-mocking (mockar tudo) = testar nada
- `ArgumentCaptor` para verificação complexa
- Prefira teste **baseado em estado** ao baseado em interação
- Mais de 3 mocks num teste é sinal de alerta

## Asserções

- AssertJ fluente (`assertThat`) pela legibilidade
- `assertAll()` para múltiplas asserções relacionadas
- Verifique **valor exato**, não apenas `isNotNull()`
- Mensagem de falha descritiva

## Metas de cobertura

| Métrica | Mínimo | Alvo | Excelente |
|---------|--------|------|-----------|
| Cobertura de Linha | 80% | **95%** | 98% |
| Cobertura de Branch | 70% | **90%** | 95% |
| Cobertura de Método | 85% | **95%** | 98% |
| Mutation Score | 60% | 80% | 90% |

⚠️ A Constituição Foursys exige **linha ≥ 95%** — é o piso do gate do Sonar, não uma meta opcional.

## Metas de performance

| Tipo | Tempo alvo |
|------|-----------|
| Teste unitário (único) | < 100 ms |
| Suite unitária completa | < 5 s |
| Teste de integração | < 500 ms |

## Comandos

```bash
# Rodar todos os testes
mvn test

# Rodar uma classe específica
mvn test -Dtest=ProcessarIngestaoBoletoServiceTest

# Rodar com cobertura e gerar o relatório JaCoCo
mvn clean test jacoco:report

# Relatório legível
#   target/site/jacoco/index.html   (navegador)
#   target/site/jacoco/jacoco.csv   (para somar linhas cobertas/não cobertas)

# Mutation testing
mvn org.pitest:pitest-maven:mutationCoverage
```

## Configuração do JaCoCo — diagnóstico obrigatório

⚠️ **Antes de reportar qualquer percentual, confira se o JaCoCo está configurado certo.**
Kits corporativos costumam vir com um defeito que faz o relatório local mostrar cobertura
**menor** que a real — e o time escreve teste atrás de um número que já estava atingido.

### Sintoma

O relatório local (`target/site/jacoco/index.html`) mostra um percentual bem abaixo do que o
Sonar reporta para o mesmo commit.

### Causa

```xml
<!-- ❌ ERRADO — o exclude nunca é aplicado -->
<excludes>
    <exclude>${sonar.coverage.exclusions}</exclude>
</excludes>
```

Dois defeitos nessa forma:

1. O JaCoCo exige **uma tag `<exclude>` por padrão** — não aceita lista separada por vírgula
2. O JaCoCo casa contra **caminho de classe** (`**/*.class`), não contra caminho de fonte
   (`src/main/java/**/*.java`) como o Sonar

Resultado: boilerplate que o Sonar ignora (exceções, `*Config`, DTOs, `Application`) entra na
conta local e derruba o número.

### Correção

Traduza cada padrão do `sonar.coverage.exclusions` para uma tag própria, em caminho de classe:

| `sonar.coverage.exclusions` (fonte) | `<exclude>` do JaCoCo (classe) |
|---|---|
| `src/main/java/**/config/*Config.java` | `**/config/*Config.class` |
| `src/main/java/**/domain/exception/*Exception.java` | `**/domain/exception/*Exception.class` |
| `src/main/java/**/adapter/**/dto/*DTO.java` | `**/adapter/**/dto/*DTO.class` |
| `src/main/java/**/Application.java` | `**/Application.class` |

```xml
<!-- ✅ CORRETO — uma tag por padrão, extensão .class -->
<excludes>
    <exclude>**/config/*Config.class</exclude>
    <exclude>**/domain/exception/*Exception.class</exclude>
    <exclude>**/adapter/**/dto/*DTO.class</exclude>
    <exclude>**/Application.class</exclude>
</excludes>
```

**Regra:** o `<excludes>` do JaCoCo deve espelhar exatamente o `sonar.coverage.exclusions`.
Se divergirem, você mede uma coisa e o gate cobra outra.

### Barrar cobertura baixa antes do Sonar

Sem o goal `check`, o build passa com qualquer cobertura e o erro só aparece no pipeline:

```xml
<execution>
    <id>check</id>
    <phase>verify</phase>
    <goals><goal>check</goal></goals>
    <configuration>
        <rules>
            <rule>
                <element>BUNDLE</element>
                <limits>
                    <limit>
                        <counter>LINE</counter>
                        <value>COVEREDRATIO</value>
                        <minimum>0.95</minimum>
                    </limit>
                </limits>
            </rule>
        </rules>
    </configuration>
</execution>
```

⚠️ Só proponha o `check` **depois** de corrigir os `<excludes>` e de confirmar que o projeto
já atinge o mínimo. Ligado antes, o build quebra na hora, em código que ninguém escreveu agora.

### Medir de verdade

Nunca afirme "cobertura ≥ 95%" sem ter medido. O procedimento:

```bash
mvn -o clean test          # jacoco:report roda junto na fase test
```

Leia `target/site/jacoco/jacoco.csv` (uma linha por classe) e some:

```
cobertura de linha = LINE_COVERED / (LINE_COVERED + LINE_MISSED)
```

Reporte o **número real**. Se ficar abaixo de 95%, liste as classes com maior `LINE_MISSED`
e escreva mais teste — não conclua a tarefa.

## Test smells que reprovam em review

**Ação imediata:**
- ⛔ Teste que sempre passa, mesmo com a implementação quebrada
- ⛔ Teste flaky (passa às vezes)
- ⛔ Teste unitário levando > 5 s
- ⛔ Teste unitário que exige banco de dados
- ⛔ `Thread.sleep()`

**Alta prioridade:**
- 🚨 Loop ou condicional dentro do teste
- 🚨 Nome vago (`test1`, `testMethod`)
- 🚨 Um teste validando várias coisas ao mesmo tempo

**Média prioridade:**
- ⚠️ Mais de 5 mocks ou mais de 10 asserções
- ⚠️ Teste com mais de 50 linhas
- ⚠️ Setup duplicado entre testes (extraia helper)

## Segurança PII nos testes

- Nunca use CPF/CNPJ/cartão reais como massa de teste
- Não logue payload de teste com dado sensível
- Ao testar log de auditoria, verifique que o dado saiu **mascarado**

## Checklist de Implementação

- [ ] Padrão AAA (Arrange, Act, Assert) em todos os testes
- [ ] `@Nested` + `@DisplayName` agrupando sucesso e falha
- [ ] Nome de teste em estilo BDD, descrevendo o comportamento
- [ ] Caminho de sucesso E caminho de falha cobertos
- [ ] Casos de borda e condições de contorno cobertos
- [ ] Mock apenas de ports/dependências externas
- [ ] Asserções AssertJ com valor exato, não só `isNotNull()`
- [ ] Nenhum teste de getter/setter ou de código de framework
- [ ] Testes independentes, determinísticos e sem `Thread.sleep()`
- [ ] Suite unitária rodando em menos de 5 s
- [ ] Nenhum dado PII real na massa de teste
- [ ] `<excludes>` do JaCoCo conferido: uma tag por padrão, extensão `.class`, espelhando o `sonar.coverage.exclusions`
- [ ] `mvn -o clean test` executado de fato (não presumido)
- [ ] Cobertura lida do `jacoco.csv` e **reportada com o número real**
- [ ] Cobertura de linha ≥ 95% e de branch ≥ 90% atingidas — se não, mais testes antes de concluir
