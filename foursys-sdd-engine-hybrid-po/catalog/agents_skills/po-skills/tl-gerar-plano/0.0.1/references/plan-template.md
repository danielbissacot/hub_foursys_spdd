---
jira-key: <JIRA_KEY>
us-slug: <slug-da-us>
doc-referencia: <caminho-do-adr-ou-rfc>
tech-solution: plano-tech-solution.md  # omitir se não existe
servicos:
  - nome: <nome-do-repositorio>
    tipo: <srv|bff|fed|fun|lib>
    repo: ../<nome-do-repositorio>
    independente: true
  - nome: <nome-do-repositorio-2>
    tipo: <srv|bff|fed|fun|lib>
    repo: ../<nome-do-repositorio-2>
    independente: false
    aguarda: <nome-do-repositorio>
---

# [Título da US] — Plano de Implementação

> **Para agentes:** use skill `desenvolvimento-subagentes` (recomendado) ou `executar-planos` para implementar task-by-task. Use `despachar-agentes-paralelos` para serviços independentes. Steps usam sintaxe de checkbox (`- [ ]`) para rastreamento.

**User Story:** [slug] ([link Jira se disponível])
**Feature Jira:** [JIRA_KEY]
**Documento de referência:** [caminho do ADR ou RFC]

**Objetivo:** [uma frase descrevendo o que será implementado nesta US]

**Pré-requisitos:**
- [ ] Tech Solution concluído ([plano-tech-solution.md](./plano-tech-solution.md)) _(omitir se Tech Solution não existe)_

**Artefatos do Tech Solution disponíveis:**
| Artefato | Serviço | Path |
|----------|---------|------|
| `PropostaDTO` | `dupe-srv-opt` | `src/main/.../dto/PropostaDTO.java` |

> Omitir esta tabela se o Tech Solution não existe ou se esta US não usa nenhum artefato compartilhado.

**Serviços impactados nesta US:**
| Serviço | Tipo | Execução paralela |
|---------|------|-------------------|
| `dupe-srv-opt` | srv | ✅ Independente |
| `dupe-bff-itr-opt` | bff | ⚠️ Aguarda `dupe-srv-opt` publicar contrato |

---

## Serviço: `<nome-do-repositorio>` ([tipo])

> Execução: ✅ Independente / ⚠️ Aguarda: `<dependência>`

### Task 0 — Setup & Baseline

> Esta task é obrigatória como primeira task de cada serviço. Garante que o ambiente está pronto e os testes passam antes de qualquer implementação.

**Arquivos:** Nenhum (setup only)

- [ ] **Step 1: Instalar dependências**

```bash
# Java/Spring Boot
./mvn install -DskipTests -q

# Node.js/Angular
npm install --silent

# Python
pip install -r requirements.txt -q
```

- [ ] **Step 2: Rodar testes para confirmar baseline limpo**

```bash
# Java/Spring Boot
./mvn test -q

# Node.js/Angular
npm test

# Python
pytest
```

Esperado: TODOS os testes passam. Registrar a quantidade de testes como baseline.

### Task 1 — [Descrição curta]

**Arquivos:**
- Criar: `caminho/exato/do/arquivo`
- Modificar: `caminho/exato/do/arquivo:linha-inicio-linha-fim`
- Teste: `caminho/exato/do/teste`

- [ ] **Step 1: Escrever o teste com falha**

```java
@Test
void deveFazerAlgo() {
    // arrange
    var input = ...;
    // act
    var result = service.fazAlgo(input);
    // assert
    assertThat(result).isEqualTo(expected);
}
```

- [ ] **Step 2: Executar o teste para confirmar a falha**

Comando: `./mvn test -Dtest=NomeDoTeste#deveFazerAlgo`
Esperado: FALHA com "NoSuchMethodError" ou similar

- [ ] **Step 3: Implementar o mínimo necessário**

```java
public Resultado fazAlgo(Input input) {
    // implementação mínima
}
```

- [ ] **Step 4: Executar o teste para confirmar aprovação**

Comando: `./mvn test -Dtest=NomeDoTeste#deveFazerAlgo`
Esperado: PASS

- [ ] **Step 5: Commit**

```bash
git add caminho/exato/do/arquivo caminho/exato/do/teste
git commit -m "feat(JIRA_KEY): descrição do que foi implementado"
```

### Task 2 — ...
