#!/bin/bash
# generate-rfc.sh - Gera estrutura inicial de RFC
# Uso: ./generate-rfc.sh "Nome da Feature" [output_dir]

set -e

FEATURE_NAME="${1:-Nova Feature}"
OUTPUT_DIR="${2:-docs/rfc}"
DATE=$(date +%Y-%m-%d)

# Criar diretório se não existir
mkdir -p "$OUTPUT_DIR"

# Gerar número do RFC
LAST_RFC=$(ls -1 "$OUTPUT_DIR"/RFC-*.md 2>/dev/null | tail -1 | sed 's/.*RFC-\([0-9]*\).*/\1/' || echo "000")
NEXT_RFC=$(printf "%03d" $((10#$LAST_RFC + 1)))

# Nome do arquivo
SLUG=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
FILENAME="RFC-${NEXT_RFC}-${SLUG}.md"
FILEPATH="${OUTPUT_DIR}/${FILENAME}"

# Gerar arquivo
cat > "$FILEPATH" << EOF
# RFC: ${FEATURE_NAME}

**Status:** Draft
**Autor(es):** $(git config user.name || echo "TBD")
**Data:** ${DATE}
**Reviewers:** TBD

---

## Resumo Executivo

[2-3 frases explicando a proposta de forma clara]

---

## Contexto

### Situacao Atual
[Como funciona hoje? Qual o problema?]

### Por que agora?
[O que motivou esta proposta?]

### Restricoes
[Limitacoes tecnicas, de tempo, de recursos]

---

## Problema

### Descricao
[Detalhe o problema que estamos resolvendo]

### Impacto
[Quem e afetado? Qual a severidade?]

### Metricas
[Como medimos o problema hoje?]

---

## Proposta

### Visao Geral
[Descricao da solucao proposta]

### Arquitetura

\`\`\`mermaid
flowchart LR
    A[Componente A] --> B[Componente B]
    B --> C[Componente C]
\`\`\`

### Detalhes de Implementacao
[Como sera implementado]

### Mudancas Necessarias
- [ ] [Mudanca 1]
- [ ] [Mudanca 2]

---

## Alternativas Consideradas

### Alternativa 1: [Nome]

**Descricao:** [Como funcionaria]

**Pros:**
- [Vantagem 1]
- [Vantagem 2]

**Cons:**
- [Desvantagem 1]
- [Desvantagem 2]

### Alternativa 2: [Nome]

**Descricao:** [Como funcionaria]

**Pros:**
- [Vantagem 1]

**Cons:**
- [Desvantagem 1]

### Alternativa 3: Nao fazer nada

**Descricao:** Manter como esta

**Cons:**
- [Por que nao e aceitavel]

---

## Trade-offs

| Aspecto | Proposta | Alt 1 | Alt 2 |
|---------|----------|-------|-------|
| Performance | [avaliacao] | [avaliacao] | [avaliacao] |
| Complexidade | [avaliacao] | [avaliacao] | [avaliacao] |
| Custo | [avaliacao] | [avaliacao] | [avaliacao] |
| Time to Market | [avaliacao] | [avaliacao] | [avaliacao] |
| Manutencao | [avaliacao] | [avaliacao] | [avaliacao] |

---

## Riscos

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|--------------|---------|-----------|
| [Descricao] | Alta/Media/Baixa | Alto/Medio/Baixo | [Como mitigar] |

---

## Plano de Migracao (se aplicavel)

### Fase 1: [Nome]
[Descricao]

### Fase 2: [Nome]
[Descricao]

### Rollback
[Como reverter se der errado]

---

## Decisao Recomendada

**Recomendacao:** [Qual alternativa recomendamos]

**Justificativa:**
[Por que esta e a melhor opcao considerando os trade-offs]

---

## Questoes em Aberto

- [ ] [Questao que precisa ser respondida]
- [ ] [Outra questao]

---

## Referencias

- [Link para doc relacionado]
- [Link para RFC anterior]

---

## Changelog

| Data | Autor | Mudanca |
|------|-------|---------|
| YYYY-MM-DD | [Nome] | Versao inicial |
EOF

echo "✅ RFC criado: $FILEPATH"
echo ""
echo "Próximos passos:"
echo "  1. Preencha as seções do RFC"
echo "  2. Envie para revisão"
echo "  3. Discuta no canal apropriado"