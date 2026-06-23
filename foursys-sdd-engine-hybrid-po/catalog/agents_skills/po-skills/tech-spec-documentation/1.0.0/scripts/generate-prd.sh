#!/bin/bash
# generate-prd.sh - Gera estrutura inicial de PRD
# Uso: ./generate-prd.sh "Nome da Feature" [output_dir]

set -e

FEATURE_NAME="${1:-Nova Feature}"
OUTPUT_DIR="${2:-docs/prd}"
DATE=$(date +%Y-%m-%d)

# Criar diretório se não existir
mkdir -p "$OUTPUT_DIR"

# Gerar número do PRD
if ls "$OUTPUT_DIR"/PRD-*.md >/dev/null 2>&1; then
  LAST_PRD=$(ls -1 "$OUTPUT_DIR"/PRD-*.md | tail -1 | sed 's/.*PRD-\([0-9]*\).*/\1/')
else
  LAST_PRD="000"
fi
NEXT_PRD=$(printf "%03d" $((10#$LAST_PRD + 1)))

# Nome do arquivo
SLUG=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
FILENAME="PRD-${NEXT_PRD}-${SLUG}.md"
FILEPATH="${OUTPUT_DIR}/${FILENAME}"

# Gerar arquivo
cat > "$FILEPATH" << EOF
# PRD: ${FEATURE_NAME}

**Status:** Draft
**Autor:** $(git config user.name || echo "TBD")
**Data:** ${DATE}
**Card Jira:** #TBD

---

## 1. Problema

### Qual dor estamos resolvendo?
[Descreva o problema]

### Quem sente essa dor?
[Persona afetada]

### Dados que comprovam
[Métricas, feedback]

---

## 2. Objetivos

| Métrica | Baseline | Meta | Como medir |
|---------|----------|------|------------|
| [Nome] | [Atual] | [Desejado] | [Instrumentação] |

---

## 3. Escopo

### IN (faremos)
- [ ] Item 1
- [ ] Item 2

### OUT (não faremos)
- Item 1 (motivo)

---

## 4. Requisitos Funcionais

| ID | Requisito | Critério de Aceite | Prioridade |
|----|-----------|-------------------|------------|
| RF-001 | [Descrição] | [Como testar] | P0 |

---

## 5. Requisitos Não-Funcionais

| Aspecto | Requisito | Limite |
|---------|-----------|--------|
| Performance | Latência p95 | < 200ms |

---

## 6. Riscos e Dependências

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| [Descrição] | Alta/Média/Baixa | Alto/Médio/Baixo | [Ação] |

---

## Aprovações

| Papel | Nome | Data | Status |
|-------|------|------|--------|
| Product | - | - | Pendente |
| Tech Lead | - | - | Pendente |
EOF

echo "✅ PRD criado: $FILEPATH"
echo ""
echo "Próximos passos:"
echo "  1. Preencha as seções do PRD"
echo "  2. Vincule ao card do Jira"
echo "  3. Solicite review"