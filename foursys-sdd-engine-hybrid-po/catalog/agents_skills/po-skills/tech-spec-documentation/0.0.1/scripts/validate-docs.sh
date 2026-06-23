#!/bin/bash
# validate-docs.sh - Valida documentação técnica
# Uso: ./validate-docs.sh [docs_dir]

DOCS_DIR="${1:-docs}"
ERRORS=0
WARNINGS=0

echo "🔍 Validando documentação em: $DOCS_DIR"
echo ""

# Função para validar arquivo
validate_file() {
    local file=$1
    local type=$2
    
    # Verificar se tem Status
    if ! grep -qi "Status:" "$file"; then
        echo "  ❌ Campo 'Status' obrigatório não encontrado"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Verificar se tem Data
    if ! grep -qi "Data:" "$file"; then
        echo "  ⚠️  Campo 'Data' não encontrado"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Verificar Mermaid válido (se existir)
    if grep -q '```mermaid' "$file"; then
        mermaid_count=$(grep -c '```mermaid' "$file")
        echo "  📊 $mermaid_count diagrama(s) Mermaid encontrado(s)"
    fi
    
    echo "  ✅ Arquivo validado"
}

# Função para validar arquivo MD de User Story
validate_md_file() {
    local file=$1
    
    # Verificar se tem Solução proposta
    if ! grep -qi "Solução proposta:" "$file"; then
        echo "  ❌ Campo 'Solução proposta' obrigatório não encontrado"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Verificar se tem Regras Técnicas
    if ! grep -qi "### Regras Técnicas" "$file"; then
        echo "  ❌ Seção 'Regras Técnicas' obrigatória não encontrada"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Verificar se tem Análise de Impacto
    if ! grep -qi "### Análise de Impacto" "$file"; then
        echo "  ❌ Seção 'Análise de Impacto' obrigatória não encontrada"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Verificar se tem Critérios de Aceite
    if ! grep -qi "###.*Critérios de Aceite" "$file"; then
        echo "  ❌ Seção 'Critérios de Aceite' obrigatória não encontrada"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Verificar se tem Repositório
    if ! grep -qi "###.*Repositório" "$file"; then
        echo "  ⚠️  Seção 'Repositório' não encontrada"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    echo "  ✅ Arquivo MD validado"
}

# Função para validar arquivo JIRA de User Story
validate_jira_file() {
    local file=$1
    
    # Verificar se tem h2. Solução proposta
    if ! grep -qi "h2. Solução proposta:" "$file"; then
        echo "  ❌ Campo 'Solução proposta' obrigatório não encontrado"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Verificar se tem h3. Regras Técnicas
    if ! grep -qi "h3. Regras Técnicas" "$file"; then
        echo "  ❌ Seção 'Regras Técnicas' obrigatória não encontrada"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Verificar se tem h3. Critérios de Aceite
    if ! grep -qi "h3. Critérios de Aceite" "$file"; then
        echo "  ❌ Seção 'Critérios de Aceite' obrigatória não encontrada"
        ERRORS=$((ERRORS + 1))
    fi
    
    echo "  ✅ Arquivo JIRA validado"
}

# Validar PRDs
echo "📋 PRDs:"
for file in "$DOCS_DIR"/prd/PRD-*.md; do
    if [ -f "$file" ]; then
        echo "  Validando: $(basename "$file")"
        validate_file "$file" "PRD"
    fi
done
echo ""

# Validar User Stories
echo "📖 User Stories:"
for file in "$DOCS_DIR"/stories/*.md; do
    if [ -f "$file" ] && [[ ! "$file" == *"-JIRA.md" ]]; then
        echo "  Validando MD: $(basename "$file")"
        validate_md_file "$file"
        
        # Verificar se arquivo JIRA correspondente existe
        jira_file="${file%.md}-JIRA.md"
        if [ ! -f "$jira_file" ]; then
            echo "  ❌ Arquivo JIRA correspondente não encontrado: $(basename "$jira_file")"
            ERRORS=$((ERRORS + 1))
        else
            echo "  Validando JIRA: $(basename "$jira_file")"
            validate_jira_file "$jira_file"
        fi
    fi
done
echo ""

# Validar TRDs
echo "📐 TRDs:"
for file in "$DOCS_DIR"/trd/TRD-*.md; do
    if [ -f "$file" ]; then
        echo "  Validando: $(basename "$file")"
        validate_file "$file" "TRD"
    fi
done
echo ""

# Validar RFCs
echo "💬 RFCs:"
for file in "$DOCS_DIR"/rfc/RFC-*.md; do
    if [ -f "$file" ]; then
        echo "  Validando: $(basename "$file")"
        validate_file "$file" "RFC"
    fi
done
echo ""

# Validar ADRs
echo "📝 ADRs:"
for file in "$DOCS_DIR"/adr/ADR-*.md; do
    if [ -f "$file" ]; then
        echo "  Validando: $(basename "$file")"
        validate_file "$file" "ADR"
    fi
done
echo ""

# Resumo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Resumo da Validação"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Erros: $ERRORS"
echo "  Avisos: $WARNINGS"

if [ $ERRORS -gt 0 ]; then
    echo ""
    echo "❌ Validação falhou com $ERRORS erro(s)"
    exit 1
else
    echo ""
    echo "✅ Validação concluída com sucesso"
    exit 0
fi