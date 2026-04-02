# Checklist de Testes

Checklist abrangente para garantir a qualidade dos testes antes de marcá-los como concluídos.

## Antes de Escrever Testes

### Compreensão
- [ ] Entender o requisito de negócio sendo implementado.
- [ ] Identificar as regras de negócio que devem ser validadas.
- [ ] Listar cenários de sucesso (happy path).
- [ ] Listar cenários de falha (unhappy path).
- [ ] Identificar casos de borda e condições de contorno.
- [ ] Saber qual camada está sendo testada (Domain, UseCase, Adapter).

### Planejamento
- [ ] Decidir quais padrões de teste usar (State vs Interaction).
- [ ] Identificar dependências que precisam de mocking.
- [ ] Determinar se testes parametrizados são apropriados.

## Durante a Escrita de Testes

### Estrutura (AAA)
- [ ] **Arrange**: Preparação do cenário e mocks está clara?
- [ ] **Act**: A ação sendo testada é única e focada?
- [ ] **Assert**: As asserções validam o resultado esperado com precisão?

### Qualidade
- [ ] O teste valida comportamento real, não detalhes de implementação?
- [ ] O teste sobreviveria a uma refatoração interna?
- [ ] O teste é independente e determinístico (sem flakiness)?

## Metas de Métricas (Alvos Corporativos)

| Métrica | Mínimo | Alvo |
|---------|--------|------|
| Cobertura de Linha | 80% | 95% |
| Cobertura de Branch | 70% | 90% |
| Mutation Score (PIT) | 60% | 80% |

## Definition of Done para Testes

Testes são considerados completos quando:
- [ ] Todos os testes passam localmente e no pipeline.
- [ ] Metas de cobertura foram alcançadas.
- [ ] Nenhum "Test Smell" (como code duplication em testes) foi detectado.
- [ ] O código de teste serve como documentação viva da funcionalidade.

---
> [!IMPORTANT]
> **Refatoração**: Se um teste quebra quando você muda o nome de uma variável interna ou refatora um método privado (sem mudar o resultado final), ele está acoplado demais. Teste **O QUE** o sistema faz, não **COMO** ele faz.
