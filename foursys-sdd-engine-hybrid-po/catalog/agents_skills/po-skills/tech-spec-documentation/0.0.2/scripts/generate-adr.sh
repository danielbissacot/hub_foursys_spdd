#!/bin/bash
# generate-adr.sh - Gera estrutura inicial de ADR
# Uso: ./generate-adr.sh "Nome da Decisao" [output_dir]

set -e

FEATURE_NAME="${1:-Nova Decisao}"
OUTPUT_DIR="${2:-docs/adr}"
DATE=$(date +%Y-%m-%d)

# Criar diretório se não existir
mkdir -p "$OUTPUT_DIR"

# Gerar número do ADR
LAST_ADR=$(ls -1 "$OUTPUT_DIR"/ADR-*.md 2>/dev/null | tail -1 | sed 's/.*ADR-\([0-9]*\).*/\1/' || echo "000")
NEXT_ADR=$(printf "%03d" $((10#$LAST_ADR + 1)))

# Nome do arquivo
SLUG=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
FILENAME="ADR-${NEXT_ADR}-${SLUG}.md"
FILEPATH="${OUTPUT_DIR}/${FILENAME}"

# Gerar arquivo
cat > "$FILEPATH" << EOF
# ADR: ${FEATURE_NAME}

**Status:** Proposed
**Data:** ${DATE}
**Decisores:** [Nomes]

---

## Contexto

[Situacao que exigiu esta decisao. Inclua:]
- O que estava acontecendo
- Qual problema precisava ser resolvido
- Quais restricoes existiam

---

## Decisao

[O que foi decidido, de forma clara e direta]

**Escolha:** [Nome da opcao escolhida]

**Detalhes:**
- [Detalhe 1]
- [Detalhe 2]

---

## Alternativas Consideradas

### Alternativa 1: [Nome]
- **Por que rejeitada:** [Motivo]

### Alternativa 2: [Nome]
- **Por que rejeitada:** [Motivo]

---

## Consequencias

### Positivas
- [Beneficio 1]
- [Beneficio 2]

### Negativas
- [Trade-off 1]
- [Trade-off 2]

### Neutras
- [Mudanca que nao e boa nem ruim]

---

## Compliance

### Padroes Atendidos
- [Padrao 1]
- [Padrao 2]

### Riscos Aceitos
- [Risco aceito e justificativa]

---

## Referencias

- RFC-XXX: [Link para RFC que originou esta decisao]
- [Outros links relevantes]

---

## Notas

[Qualquer informacao adicional relevante para o futuro]
EOF

echo "✅ ADR criado: $FILEPATH"
echo ""
echo "Próximos passos:"
echo "  1. Preencha as seções do ADR"
echo "  2. Compartilhe com os decisores para aprovação"
echo "  3. Armazene em local acessível para futuras consultas"