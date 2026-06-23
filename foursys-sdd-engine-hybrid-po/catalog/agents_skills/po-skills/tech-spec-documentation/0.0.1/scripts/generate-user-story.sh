#!/bin/bash
# generate-user-story.sh - Gera user story técnica
# Uso: ./generate-user-story.sh "SIGLA-NUMERO" "Título" "Descrição Resumida" [output_dir]

set -e

SIGLA_NUMERO="${1:-ESCRI-12313}"
TITULO="${2:-Título da História}"
DESCRICAO="${3:-Descrição resumida da necessidade}"
OUTPUT_DIR="${4:-stories}"
DATE=$(date +%Y-%m-%d)

# Criar diretório se não existir
mkdir -p "$OUTPUT_DIR"

# Nome dos arquivos
FILENAME="${SIGLA_NUMERO}.md"
JIRA_FILENAME="${SIGLA_NUMERO}-JIRA.md"
FILEPATH="${OUTPUT_DIR}/${FILENAME}"
JIRA_FILEPATH="${OUTPUT_DIR}/${JIRA_FILENAME}"

# Template paths (assumindo que estão no mesmo diretório ou relativo)
TEMPLATE_DIR="$(dirname "$0")/../references"
TEMPLATE_MD="${TEMPLATE_DIR}/user-story-template.md"
TEMPLATE_JIRA="${TEMPLATE_DIR}/user-story-jira-template.md"

# Verificar se templates existem
if [[ ! -f "$TEMPLATE_MD" ]]; then
    echo "Erro: Template $TEMPLATE_MD não encontrado"
    exit 1
fi

if [[ ! -f "$TEMPLATE_JIRA" ]]; then
    echo "Erro: Template $TEMPLATE_JIRA não encontrado"
    exit 1
fi

# Copiar e substituir placeholders no template MD
cp "$TEMPLATE_MD" "$FILEPATH"
sed -i "s/{SIGLA-NUMERO}/$SIGLA_NUMERO/g" "$FILEPATH"
# Adicionar mais substituições se necessário, mas por enquanto placeholders manuais

# Copiar e substituir placeholders no template JIRA
cp "$TEMPLATE_JIRA" "$JIRA_FILEPATH"
sed -i "s/{SIGLA-NUMERO}/$SIGLA_NUMERO/g" "$JIRA_FILEPATH"

echo "User story gerada:"
echo "  $FILEPATH"
echo "  $JIRA_FILEPATH"