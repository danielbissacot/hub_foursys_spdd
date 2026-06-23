## Objetivo

Quando solicitado a criar uma User Story com foco em negócio (para o PO), siga esta estrutura padronizada.
O objetivo é que o PO consiga, com o auxílio da IA generativa, criar histórias focando nos aspectos de negócio,
sem necessidade de detalhar aspectos técnicos. Esse documento servirá de insumo para que o Tech Lead expanda
a história com os detalhes técnicos (use `user-story-complete-template.md`).

## Instruções

1. Preencha todas as seções obrigatórias. As seções marcadas como `(Opcional)` só devem ser incluídas quando existir conteúdo relevante.
2. Escreva os Critérios de Aceite no formato BDD (DADO / QUANDO / ENTÃO).
3. Seja específico nas Regras de Negócio — descreva o comportamento esperado, não a implementação.
4. Use a seção `APOIO APF` para descrever as funcionalidades de alto nível e os ambientes de teste.
5. Não detalhe aspectos técnicos neste template — eles fazem parte do template completo.

## Estrutura da User Story — Negócio

```markdown
# [US-XXXX] — [Título da User Story]

**Status:** Draft | In Review | Approved
**Autor (PO):** [Nome]
**Data:** YYYY-MM-DD
**Sprint:** [Número ou Nome da Sprint]
**Story Points:** [Estimativa]
**Issue/Épico:** #[número]

---

## 📌 APOIO APF

➡️ Funcionalidade de [descreva a funcionalidade de negócio de alto nível].
➡️ Realização de testes no browser Google Chrome.
➡️ Realização de testes no browser Microsoft Edge.

---

## 📌 IDENTIFICAÇÃO

EU COMO [papel/perfil do usuário ou área]
QUERO QUE [descreva o que o sistema/funcionalidade deve fazer]
PARA [descreva o benefício de negócio esperado]

---

## ✅ CRITÉRIOS DE ACEITE

> Descreva os critérios no formato BDD: DADO / QUANDO / ENTÃO.
> Cada critério deve ser verificável e independente.

**C1 — [Título do cenário]**

DADO QUE [contexto inicial / pré-condição]
QUANDO [ação realizada pelo usuário ou sistema]
ENTÃO [resultado esperado / comportamento do sistema]

**C2 — [Título do cenário]**

DADO QUE [contexto inicial / pré-condição]
QUANDO [ação realizada pelo usuário ou sistema]
ENTÃO [resultado esperado / comportamento do sistema]

*(Adicione quantos critérios forem necessários)*

---

## ✅ CENÁRIOS DE TESTE (Opcional)

> Liste cenários adicionais de teste que não estão cobertos nos critérios de aceite principais.
> Pode incluir cenários negativos, edge cases ou fluxos alternativos.

- Cenário 1: [Descrição]
- Cenário 2: [Descrição]

---

## 📋 REGRAS DE NEGÓCIO

> Descreva as regras que governam o comportamento da funcionalidade.
> Cada regra deve ser objetiva e verificável.

**Regra de Negócio 1 — [Título da Regra]**

[Descreva a regra de negócio de forma clara e objetiva.]

**Regra de Negócio 2 — [Título da Regra]**

[Descreva a regra de negócio de forma clara e objetiva.]

*(Adicione quantas regras forem necessárias)*

---

## 🚫 FORA DE ESCOPO (Opcional)

> Liste explicitamente o que NÃO será entregue nesta história.

- [Item fora de escopo 1]
- [Item fora de escopo 2]

---

## ⚠️ RISCOS

> Identifique riscos de negócio que podem impactar a entrega ou o resultado esperado.

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| [Descrição] | Alta / Média / Baixa | Alto / Médio / Baixo | [Ação de mitigação] |

---

## 🔗 DEPENDÊNCIAS

> Liste sistemas, times, aprovações ou histórias das quais esta US depende.

| Dependência | Tipo | Responsável | Status |
|-------------|------|-------------|--------|
| [Descrição] | Sistema / Time / Aprovação / US | [Nome] | Pendente / Em andamento / Concluído |

---

## 🗂️ MATERIAL ADICIONAL (Opcional)

> Links para documentos, fluxogramas, protótipos ou referências de negócio.

| Item | Link |
|------|------|
| [Descrição] | [URL ou referência] |
```

## Exemplo de Prompt para Gerar esta User Story

```
Crie uma User Story de negócio (apenas aspectos de negócio, sem detalhes técnicos)
usando o template user-story-business-template.md para:

Funcionalidade: Cadastro de contrato de intermediação
Usuário: Área de Operações PJ
Objetivo: Registrar um novo contrato de intermediação para clientes PJ

Regras de negócio:
- Apenas clientes com CPF/CNPJ válido podem ter contrato cadastrado
- O tipo de pessoa (Física/Jurídica) deve ser informado obrigatoriamente
- O tipo de escrituração (Automática/Processual) deve ser informado
- A vigência do contrato deve ter data de fim informada
- Não é possível cadastrar contrato para cliente que já possua contrato PENDENTE

Critérios de aceite:
- Quando o usuário submeter um CNPJ inválido, o sistema deve exibir mensagem de erro
- Quando o contrato for criado com sucesso, o sistema deve exibir confirmação
- Quando já existir contrato PENDENTE, o sistema deve bloquear o cadastro

Fora de escopo:
- Edição de contratos já cadastrados
- Cancelamento de contratos
```

## O que será gerado

- História no formato padrão EU COMO / QUERO QUE / PARA
- Critérios de aceite no formato BDD (DADO / QUANDO / ENTÃO)
- Regras de negócio objetivas e verificáveis
- Riscos e dependências de negócio identificados
- Pronto para ser utilizado como insumo pelo Tech Lead
