---
name: code-review
description: Realiza code review sistemático cobrindo qualidade, design, performance, segurança, compliance bancário (LGPD, PCI-DSS, BACEN), validações de transações financeiras, segregação de ambientes e auditoria. Gera relatório estruturado com classificação de severidade e veredicto de aprovação.
metadata:
  version: "0.0.1"
---

## Objetivo

Realizar code review sistemático e abrangente, cobrindo sete dimensões: Corretude, Design, Performance, Segurança, Compliance, Testes e Documentação. Cada achado é classificado por severidade para priorização de correções.

## Quando Usar

- Após escrever ou modificar código
- Antes de merge de Pull Requests
- Para auditar código legado
- Para verificar conformidade com regulamentações bancárias
- Como parte do pipeline do Tech Lead Toolkit

## Processo de Review

### 1. Corretude

- [ ] Lógica está correta para o caso de uso?
- [ ] Edge cases estão cobertos?
- [ ] Erros são tratados adequadamente?
- [ ] Null/undefined são verificados?
- [ ] Concorrência tratada corretamente?
- [ ] Valores de retorno estão corretos?

### 2. Design

- [ ] Single Responsibility Principle respeitado?
- [ ] Código duplicado eliminado?
- [ ] Nomes claros e descritivos?
- [ ] Funções com tamanho adequado (<50 linhas)?
- [ ] Arquivos com tamanho adequado (<800 linhas)?
- [ ] Abstrações no nível correto?
- [ ] Nesting depth ≤ 4 níveis?
- [ ] Padrões de imutabilidade utilizados?

### 3. Performance

- [ ] Queries otimizadas (sem N+1)?
- [ ] Uso adequado de cache?
- [ ] Operações assíncronas onde apropriado?
- [ ] Memory leaks potenciais identificados?
- [ ] Algoritmos eficientes (sem O(n²) em hot paths)?
- [ ] Bundle size considerado?
- [ ] Memoization aplicada onde necessário?

### 4. Segurança

- [ ] Credenciais hardcoded (API keys, passwords, tokens)?
- [ ] SQL/NoSQL injection protegido?
- [ ] XSS protegido?
- [ ] CSRF protegido?
- [ ] Input validado e sanitizado?
- [ ] Path traversal protegido?
- [ ] Autenticação/autorização corretas?
- [ ] Dependências vulneráveis?
- [ ] Authentication bypass possível?

### 5. Compliance Bancário

#### LGPD/GDPR
- [ ] Dados pessoais tratados com consentimento?
- [ ] Direito ao esquecimento implementado?
- [ ] Minimização de dados aplicada?
- [ ] Dados sensíveis (CPF, email, telefone) com proteção adequada?

#### PCI-DSS
- [ ] Dados de cartão (PAN, CVV, validade) tokenizados/criptografados?
- [ ] Nenhum armazenamento em texto plano de campos sensíveis de cartão?
- [ ] Criptografia em repouso e em trânsito (AES-256, TLS 1.2+)?

#### BACEN/CVM
- [ ] Audit trail para operações financeiras?
- [ ] Capacidade de reporting regulatório?
- [ ] Conformidade com normas BACEN e CVM?

### 6. Validações de Transações Financeiras

- [ ] **ACID**: Transações financeiras são atômicas com rollback em caso de falha?
- [ ] **Idempotência**: Operações de pagamento/transferência são idempotentes?
- [ ] **Consistência de saldo**: Débito + crédito = 0 (partida dobrada)?
- [ ] **Concorrência**: Locks otimistas/pessimistas para evitar race conditions?
- [ ] **Reversão**: Todo débito possui possibilidade de estorno/reversão?
- [ ] **Limites**: Validação de limites operacionais (diários, por transação)?
- [ ] **Valores monetários**: Tipos Decimal/BigDecimal (nunca Float)?
- [ ] **Horários**: Janelas operacionais e D+0/D+1 validados corretamente?
- [ ] **Rate limiting**: APIs financeiras com limitação de taxa e proteção contra fraude?
- [ ] **Timeouts**: Transações não ficam em estado pendente indefinidamente?
- [ ] **Conciliação**: Mecanismos de conciliação entre sistemas implementados?

### 7. Segregação de Ambientes

- [ ] Variáveis de ambiente diferentes para dev/homolog/prod?
- [ ] Dados de teste nunca usam dados reais de produção?
- [ ] Secrets não expostos em código-fonte ou logs?
- [ ] Dados bancários (número de conta, CPF, saldo) nunca logados?

### 8. Auditoria e Observabilidade

- [ ] Logs de auditoria imutáveis para operações críticas?
- [ ] Histórico completo de alterações (audit trail) para entidades financeiras?
- [ ] Mecanismos de conciliação entre sistemas?
- [ ] Segregação de funções (aprovação ≠ execução)?

### 9. Testes

- [ ] Cobertura adequada para lógica crítica?
- [ ] Testes unitários presentes?
- [ ] Mocks apropriados?
- [ ] Casos de erro testados?
- [ ] Testes de integração para fluxos financeiros?

### 10. Documentação

- [ ] Funções complexas documentadas?
- [ ] API documentada (Swagger/OpenAPI)?
- [ ] README atualizado se necessário?
- [ ] JSDoc/Javadoc para APIs públicas?

## Classificação de Severidade

| Nível | Significado | Ação Requerida |
|-------|-------------|----------------|
| 🔴 CRITICAL | Bug, vulnerabilidade de segurança, perda de dados, violação de compliance | Bloqueia merge |
| 🟠 MAJOR | Problema significativo de design, performance ou qualidade | Deve corrigir antes do merge |
| 🟡 MINOR | Melhoria importante mas não bloqueante | Deveria corrigir |
| 💬 NITPICK | Estilo, preferência pessoal, melhoria opcional | Opcional |

## Formato de Saída

```markdown
## Code Review: [Nome do PR/Arquivo/Branch]

### Resumo
[Visão geral do que foi revisado e impressão inicial]

### Achados

#### 🔴 CRITICAL — Bloqueia merge

**[Arquivo:Linha]** [Título do achado]

**Problema:**
\`\`\`[linguagem]
// código com problema
\`\`\`

**Sugestão:**
\`\`\`[linguagem]
// código corrigido
\`\`\`

**Justificativa:** [Por que isso é crítico e qual o risco]

---

#### 🟠 MAJOR — Deve corrigir

**[Arquivo:Linha]** [Título do achado]

**Problema / Sugestão / Justificativa**

---

#### 🟡 MINOR — Deveria corrigir

**[Arquivo:Linha]** [Título do achado]

[Descrição e sugestão]

---

#### 💬 NITPICK — Opcional

**[Arquivo:Linha]** [Título do achado]

[Descrição e sugestão]

---

### Pontos Positivos
- [O que foi bem feito]
- [Boas práticas identificadas]

### Métricas do Review

| Dimensão | Status |
|----------|--------|
| Corretude | ✅/⚠️/❌ |
| Design | ✅/⚠️/❌ |
| Performance | ✅/⚠️/❌ |
| Segurança | ✅/⚠️/❌ |
| Compliance | ✅/⚠️/❌ |
| Testes | ✅/⚠️/❌ |
| Documentação | ✅/⚠️/❌ |

### Veredicto

- **Aprovado** ✅: Sem achados CRITICAL ou MAJOR
- **Aviso** ⚠️: Apenas achados MINOR ou NITPICK
- **Bloqueado** ❌: Um ou mais achados CRITICAL ou MAJOR

**Veredicto: [Aprovado/Aviso/Bloqueado]**

**Justificativa:** [Resumo dos motivos do veredicto]
```

## Exemplo de Uso

```
> Faça code review do arquivo src/services/payment.service.ts
> Foque em segurança e compliance bancário
```

```
> Revise o PR #123 — foco em corretude da lógica de pagamentos
```

```
> Faça review completo da branch feature/order-cancellation
> Aplique o checklist completo incluindo validações bancárias
```
