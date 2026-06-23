# Checklist de Testes

Checklist abrangente para garantir qualidade dos testes antes de marcar como completos.

## Antes de Escrever Testes

### Compreensão

- [ ] Entender o requisito de negócio sendo implementado
- [ ] Identificar as regras de negócio que devem ser validadas
- [ ] Listar cenários de sucesso (happy path)
- [ ] Listar cenários de falha (unhappy path)
- [ ] Identificar casos de borda e condições de contorno
- [ ] Saber qual camada está sendo testada (Domain, UseCase, Adapter)

### Planejamento de Testes

- [ ] Decidir quais padrões de teste usar (state vs interaction)
- [ ] Identificar dependências que precisam de mocking
- [ ] Planejar requisitos de dados de teste
- [ ] Determinar se testes parametrizados são apropriados
- [ ] Considerar se builders/fixtures de teste são necessários

## Durante a Escrita de Testes

### Estrutura de Teste

- [ ] Seguir padrão Arrange-Act-Assert (AAA)
- [ ] Usar nomes descritivos no estilo BDD
- [ ] Agrupar testes relacionados com classes `@Nested`
- [ ] Adicionar `@DisplayName` para clareza
- [ ] Manter cada teste focado em um comportamento

### Qualidade de Teste

- [ ] Teste valida comportamento de negócio real, não implementação
- [ ] Teste sobreviveria a refatoração
- [ ] Teste tem asserções claras com mensagens significativas
- [ ] Teste é independente de outros testes
- [ ] Teste é determinístico (sem valores aleatórios, sem dependências de tempo)
- [ ] Teste limpa após si mesmo se necessário

### Asserções

- [ ] Usar asserções fluentes do AssertJ para legibilidade
- [ ] Usar `assertAll()` para múltiplas asserções relacionadas
- [ ] Incluir mensagens descritivas de falha
- [ ] Verificar valores exatos, não apenas "não nulo"
- [ ] Verificar todas as propriedades importantes dos objetos resultantes

### Mocking

- [ ] Fazer mock apenas de dependências externas (ports, repositories, APIs)
- [ ] Não fazer mock de objetos de domínio ou value objects
- [ ] Não fazer over-mocking (mocking de tudo = testar nada)
- [ ] Verificar interações importantes quando efeitos colaterais importam
- [ ] Usar ArgumentCaptor para verificação complexa
- [ ] Preferir testes baseados em estado sobre testes baseados em interação

## Cobertura de Testes

### Cobertura de Cenários

- [ ] Todos os caminhos de sucesso testados
- [ ] Todos os caminhos de falha testados
- [ ] Todas as regras de validação testadas
- [ ] Todos os casos de borda testados
- [ ] Todas as condições de contorno testadas
- [ ] Todas as mensagens de erro verificadas

### Cobertura de Código

- [ ] Cobertura de linha ≥ 95%
- [ ] Cobertura de branch ≥ 90%
- [ ] Cobertura de método ≥ 95%
- [ ] Nenhum bloco significativo de código deixado sem teste
- [ ] Cobertura verificada com relatório JaCoCo

### Camada de Domain

- [ ] Validação de value objects testada
- [ ] Transições de estado de entidades testadas
- [ ] Invariantes de domínio testadas
- [ ] Equals/hashCode testados para value objects
- [ ] Emissão de domain events testada
- [ ] Lógica de negócio de domain services testada

### Camada de UseCase

- [ ] Orquestração de happy path testada
- [ ] Todos os cenários de erro testados
- [ ] Colaboração de ports testada
- [ ] Validação de entrada testada
- [ ] Aplicação de regras de negócio testada
- [ ] Limites de transação testados (se aplicável)

### Camada de Adapter

**REST Controllers:**
- [ ] Todos os códigos de status HTTP testados
- [ ] Validação de requisições testada
- [ ] Estrutura de resposta testada
- [ ] Respostas de erro testadas
- [ ] Parâmetros de query testados
- [ ] Variáveis de path testadas

**Repositories:**
- [ ] Operações CRUD testadas
- [ ] Queries customizadas testadas
- [ ] Optimistic locking testado (se aplicável)
- [ ] Operações em cascata testadas (se aplicável)

**Clientes Externos:**
- [ ] Respostas de sucesso testadas
- [ ] Respostas de erro testadas
- [ ] Lógica de retry testada
- [ ] Tratamento de timeout testado

## Após Escrever Testes

### Execução

- [ ] Todos os testes passam localmente
- [ ] Testes passam quando executados em isolamento
- [ ] Testes passam quando executados em qualquer ordem
- [ ] Testes passam repetidamente (sem flakiness)
- [ ] Testes executam em tempo razoável (< 5s para testes unitários)

### Validação de Qualidade

- [ ] Executar mutation testing (PIT) - alvo ≥ 80% mutation score
- [ ] Revisar nomes de testes para clareza
- [ ] Verificar ausência de testes triviais (testes de getter/setter)
- [ ] Garantir ausência de design damage induzido por testes
- [ ] Verificar ausência de test smells (veja abaixo)

### Documentação

- [ ] Lógica complexa de teste está comentada
- [ ] Builders de dados de teste estão documentados se complexos
- [ ] Métodos helper têm nomes claros
- [ ] README atualizado se novos padrões de teste foram introduzidos

## Test Smells Comuns a Evitar

### Code Smells

- [ ] **Mystery Guest**: Teste depende de dados externos não visíveis no teste
- [ ] **Eager Test**: Teste valida muitas coisas de uma vez
- [ ] **Assertion Roulette**: Múltiplas asserções sem contexto
- [ ] **Test Code Duplication**: Mesmo setup repetido em testes
- [ ] **Indirect Testing**: Testar através de outros componentes
- [ ] **Over-Specification**: Teste sabe demais sobre implementação

### Behavior Smells

- [ ] **Fragile Tests**: Quebram em mudanças irrelevantes
- [ ] **Erratic Tests**: Às vezes passam, às vezes falham
- [ ] **Slow Tests**: Testes unitários levando > 5 segundos
- [ ] **Test Logic**: Condicionais ou loops em testes
- [ ] **Manual Intervention**: Testes requerendo ação humana

### Maintenance Smells

- [ ] **Obscure Tests**: Difícil entender o que está sendo testado
- [ ] **High Test Maintenance**: Testes requerem atualizações frequentes
- [ ] **Dead Tests**: Testes que nunca falham
- [ ] **Duplicate Tests**: Múltiplos testes testando a mesma coisa

## Critérios de Qualidade de Teste

### Para Cada Teste, Responda:

#### ✅ Valor de Negócio

**Pergunta:** Este teste valida uma regra de negócio ou comportamento importante?

- **SIM** → Bom teste
- **NÃO** → Considere remover

#### ✅ Segurança de Refatoração

**Pergunta:** Este teste quebraria se eu mudasse implementação mas mantivesse comportamento?

- **SIM** → Teste muito acoplado à implementação (ruim)
- **NÃO** → Teste adequadamente focado em comportamento (bom)

#### ✅ Clareza

**Pergunta:** Alguém não familiarizado com o código pode entender o que está sendo testado?

- **SIM** → Teste é claro
- **NÃO** → Melhorar nomeação e estrutura

#### ✅ Confiabilidade

**Pergunta:** Este teste sempre falha pela mesma razão?

- **SIM** → Teste é confiável
- **NÃO** → Teste é flaky, precisa conserto

#### ✅ Independência

**Pergunta:** Este teste pode executar em isolamento sem depender de outros testes?

- **SIM** → Teste é independente
- **NÃO** → Remover estado compartilhado

## Metas de Métricas

### Métricas de Cobertura

| Métrica | Mínimo | Alvo | Excelente |
|---------|--------|------|-----------|
| Cobertura de Linha | 80% | 95% | 98% |
| Cobertura de Branch | 70% | 90% | 95% |
| Cobertura de Método | 85% | 95% | 98% |
| Mutation Score | 60% | 80% | 90% |

### Métricas de Performance

| Tipo de Teste | Tempo Alvo |
|---------------|------------|
| Teste Unitário (único) | < 100ms |
| Suite de Testes Unitários | < 5s |
| Teste de Integração | < 500ms |
| Suite de Testes de Integração | < 30s |

### Métricas de Qualidade

| Métrica | Alvo |
|---------|------|
| Testes por classe de produção | 1-3 classes de teste |
| Linhas de teste por linhas de código | 1.5 : 1 |
| Asserções por teste | 1-5 |
| Mocks por teste | 0-3 |

## Definition of Done para Testes

Testes são considerados completos quando:

- [ ] **Todos os itens do checklist acima estão ✅**
- [ ] **Metas de cobertura alcançadas**
- [ ] **Mutation testing passou (≥80%)**
- [ ] **Todos os testes passam localmente**
- [ ] **Testes passam no pipeline CI/CD**
- [ ] **Code review aprovado**
- [ ] **Nenhum test smell detectado**
- [ ] **Testes servem como documentação viva**

## Comandos de Referência Rápida

### Executar Testes

```bash
# Executar todos os testes
mvn test

# Executar classe de teste específica
mvn test -Dtest=PaymentControllerTest

# Executar testes com cobertura
mvn clean test jacoco:report

# Executar mutation testing
mvn org.pitest:pitest-maven:mutationCoverage
```

### Verificar Cobertura

```bash
# Gerar relatório JaCoCo
mvn clean test jacoco:report

# Ver relatório
open target/site/jacoco/index.html
```

### Analisar Qualidade de Teste

```bash
# Executar Checkstyle nos testes
mvn checkstyle:check

# Executar PMD nos testes
mvn pmd:check

# Executar todas as verificações de qualidade
mvn clean verify
```

## Bandeiras Vermelhas - Quando Refatorar Testes

### Ação Imediata Necessária

- ⛔ **Teste sempre passa** - Mesmo quando implementação está quebrada
- ⛔ **Teste é flaky** - Passa às vezes, falha outras
- ⛔ **Teste leva > 5s** - Teste unitário deve ser rápido
- ⛔ **Teste requer banco de dados** - Deve ser teste de integração
- ⛔ **Teste requer passos manuais** - Deve ser totalmente automatizado

### Refatoração de Alta Prioridade

- 🚨 **Teste tem loops ou condicionais** - Lógica de teste muito complexa
- 🚨 **Nome de teste é pouco claro** - "test1", "testMethod"
- 🚨 **Teste testa múltiplas coisas** - Dividir em testes focados
- 🚨 **Teste é frágil** - Quebra na refatoração
- 🚨 **Teste usa Thread.sleep()** - Flaky e lento

### Refatoração de Média Prioridade

- ⚠️ **Teste tem muitos mocks** (>5) - Possivelmente over-mocked
- ⚠️ **Teste tem muitas asserções** (>10) - Muito amplo
- ⚠️ **Teste duplica setup** - Extrair para helper
- ⚠️ **Teste é > 50 linhas** - Muito complexo
- ⚠️ **Teste faz mock de objetos de domínio** - Abstração errada

## Resumo de Melhores Práticas

### Faça ✅

1. Teste comportamento, não implementação
2. Use nomes descritivos no estilo BDD
3. Mantenha testes focados e simples
4. Torne testes independentes
5. Use asserções fluentes do AssertJ
6. Organize testes com @Nested
7. Teste casos de borda e erros
8. Use builders para dados de teste complexos
9. Prefira testes baseados em estado
10. Mantenha testes rápidos

### Não Faça ❌

1. Teste getters/setters
2. Faça mock de tudo
3. Escreva testes após desenvolvimento
4. Ignore testes falhando
5. Teste código de framework
6. Compartilhe estado mutável entre testes
7. Use Thread.sleep()
8. Hard-code valores mágicos
9. Escreva testes apenas para cobertura
10. Pule casos de borda

## Verificação Final

Antes de commitar:

- [ ] Todos os testes passam ✅
- [ ] Cobertura ≥ 95% ✅
- [ ] Mutation score ≥ 80% ✅
- [ ] Nenhum test smell ✅
- [ ] Testes são significativos ✅
- [ ] Pronto para code review ✅

**Lembre-se:** Qualidade sobre quantidade. Um bom teste vale mais que dez testes triviais.
