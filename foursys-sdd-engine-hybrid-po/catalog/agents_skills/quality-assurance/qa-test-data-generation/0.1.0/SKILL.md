---
name: 'qa-test-data-generation'
description: "Orienta geração de dados de teste realistas e seguros para cada stack tecnológica. Cobre padrões por stack: Java (ObjectMother + Builder), Angular (TypeScript fixtures), Node/NestJS (Faker.js factories) e COBOL (datasets JCL sintéticos). Garante dados sem PII real, cobertura de casos felizes e negativos e consistência entre testes."
metadata:
  version: "0.1.0"
---

# Skill: qa-test-data-generation

Guia para **geração de dados de teste realistas** por stack — sem PII real, com padrões reutilizáveis.

> Dados de teste ruins causam falsos positivos e testes frágeis. Use estes padrões para garantir consistência, segurança e cobertura real.

---

## Princípios gerais

1. **Nunca use dados reais de produção** — CPF, contas, nomes reais são PII.
2. **Gere dados determinísticos para testes unitários** — facilita reprodução de falhas.
3. **Use dados aleatórios apenas em testes de carga ou smoke amplo** — com semente fixa.
4. **Cubra sempre:** caminho feliz + negativo + edge case + vazio/null.
5. **Nomeie os fixtures com intenção:** `pagamentoPendente()`, `contaBloqueada()` — não `data1`, `data2`.

---

## Java — ObjectMother + Builder Pattern

### ObjectMother (dados prontos por cenário)

```java
// FILEPATH: test/fixture/PagamentoMother.java
public final class PagamentoMother {

    public static Pagamento pendente() {
        return new Pagamento(
            "id-test-001",
            "OP-TEST-001",
            new BigDecimal("150.00"),
            "001-12345",
            "001-67890",
            StatusPagamento.PENDENTE,
            LocalDateTime.of(2026, 1, 15, 10, 0)
        );
    }

    public static Pagamento aprovado() {
        return pendente().withStatus(StatusPagamento.APROVADO);
    }

    public static Pagamento comValorZero() {
        return new Pagamento(
            "id-test-zero",
            "OP-TEST-ZERO",
            BigDecimal.ZERO,
            "001-12345",
            "001-67890",
            StatusPagamento.PENDENTE,
            LocalDateTime.now()
        );
    }

    public static Pagamento invalido() {
        return new Pagamento(null, null, null, null, null, null, null);
    }
}
```

### Builder para variações

```java
// FILEPATH: test/fixture/PagamentoBuilder.java
public class PagamentoBuilder {
    private String id = "id-default";
    private BigDecimal valor = new BigDecimal("100.00");
    private StatusPagamento status = StatusPagamento.PENDENTE;

    public static PagamentoBuilder padrao() { return new PagamentoBuilder(); }

    public PagamentoBuilder comValor(BigDecimal valor) { this.valor = valor; return this; }
    public PagamentoBuilder comStatus(StatusPagamento status) { this.status = status; return this; }
    public PagamentoBuilder comId(String id) { this.id = id; return this; }

    public Pagamento build() {
        return new Pagamento(id, "OP-TEST", valor, "conta-orig", "conta-dest", status, LocalDateTime.now());
    }
}

// Uso nos testes:
var pagamento = PagamentoBuilder.padrao()
    .comValor(new BigDecimal("500.00"))
    .comStatus(StatusPagamento.BLOQUEADO)
    .build();
```

### Dados especiais para edge cases Java

```java
// Valores monetários críticos
new BigDecimal("0.01")            // mínimo aceitável
new BigDecimal("999999999.99")    // máximo representável
BigDecimal.ZERO                   // zero — testar validação
new BigDecimal("0.001")          // escala errada — testar arredondamento

// Datas críticas
LocalDate.of(2000, 2, 29)         // ano bissexto
LocalDate.of(2100, 1, 1)          // data futura extrema
LocalDateTime.MIN                  // data mínima Java
```

---

## Angular — TypeScript Fixtures

```typescript
// FILEPATH: src/app/tests/fixtures/produto.fixture.ts
export const produtoFixtures = {
  ativo: (): Produto => ({
    id: 1,
    nome: 'Produto Teste Ativo',
    valor: 99.90,
    status: 'ATIVO',
    criadoEm: '2026-01-15T10:00:00'
  }),

  inativo: (): Produto => ({
    ...produtoFixtures.ativo(),
    id: 2,
    nome: 'Produto Teste Inativo',
    status: 'INATIVO'
  }),

  semNome: (): Partial<Produto> => ({
    id: 3,
    nome: '',
    valor: 10.00,
    status: 'ATIVO'
  }),

  lista: (quantidade = 3): Produto[] =>
    Array.from({ length: quantidade }, (_, i) => ({
      ...produtoFixtures.ativo(),
      id: i + 1,
      nome: `Produto ${i + 1}`
    })),

  listaVazia: (): Produto[] => []
};
```

Uso nos testes:
```typescript
it('should exibir produto ativo', () => {
  component.produto.set(produtoFixtures.ativo());
  fixture.detectChanges();
  expect(compiled.querySelector('h1')?.textContent).toContain('Produto Teste Ativo');
});
```

---

## Node/NestJS — Faker.js Factories

```typescript
// FILEPATH: test/factories/cliente.factory.ts
import { faker } from '@faker-js/faker/locale/pt_BR';

// Semente fixa para testes determinísticos
faker.seed(12345);

export const clienteFactory = {
  criar: (overrides: Partial<Cliente> = {}): Cliente => ({
    id: faker.string.uuid(),
    nome: faker.person.fullName(),          // nome fake — não PII real
    email: faker.internet.email(),
    cpf: gerarCpfFake(),                    // algoritmo de CPF válido mas fake
    telefone: faker.phone.number('(11) 9####-####'),
    criadoEm: faker.date.past({ years: 1 }),
    ...overrides
  }),

  criarLista: (n = 5, overrides: Partial<Cliente> = {}): Cliente[] =>
    Array.from({ length: n }, () => clienteFactory.criar(overrides)),

  inativo: (): Cliente => clienteFactory.criar({ status: 'INATIVO' }),
  semEmail: (): Omit<Cliente, 'email'> => {
    const { email, ...rest } = clienteFactory.criar();
    return rest;
  }
};

function gerarCpfFake(): string {
  // Gera CPF com dígitos verificadores corretos mas sem ser CPF real
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  // ... algoritmo de cálculo dos dígitos verificadores
  return `${n.join('')}00`; // simplificado — use biblioteca cpf-cnpj-validator
}
```

---

## COBOL — JCL Datasets Sintéticos

```jcl
//TSTDATA JOB (ACCT),'TEST DATA GEN',CLASS=A,MSGCLASS=X
//* Gerador de dataset de teste para programa PGMPAG01
//STEP01  EXEC PGM=IEBGENER
//SYSPRINT DD SYSOUT=*
//SYSIN    DD DUMMY
//SYSUT1   DD *
00001PENDENTE00000015000001234560016789000000001500000000000002026011510000000
00002APROVADO00000025000001234560026789000000002500000000000002026011511000000
00003BLOQUEADO0000000000001234560036789000000000000000000000002026011512000000
/*
//SYSUT2   DD DSN=QA.PGMPAG01.TESTDATA,
//            DISP=(NEW,CATLG),
//            SPACE=(TRK,(5,1)),
//            RECFM=FB,LRECL=80
```

Campos do registro (layout):
```
Posição 001-005: Número do registro (sequencial)
Posição 006-014: Status pagamento (PENDENTE/APROVADO/BLOQUEADO)
Posição 015-022: Valor principal (8 dígitos, 2 decimais implícitos)
Posição 023-032: Conta origem (10 dígitos)
Posição 033-042: Conta destino (10 dígitos)
```

---

## Checklist de Dados de Teste

- [ ] Nenhum CPF, conta ou email real de produção nos fixtures
- [ ] Fixtures nomeados por cenário de negócio (não `data1`, `test2`)
- [ ] Cobrir: caminho feliz + negativo + null/vazio + edge case numérico
- [ ] Valores monetários Java: `BigDecimal` com 2 casas decimais
- [ ] Faker.js com semente fixa (`faker.seed()`) para testes determinísticos
- [ ] ObjectMother/Factory em arquivo separado de `/test/fixtures/` ou `/test/factories/`
- [ ] Dataset COBOL com pelo menos 3 registros (feliz, alternativo, exceção)
