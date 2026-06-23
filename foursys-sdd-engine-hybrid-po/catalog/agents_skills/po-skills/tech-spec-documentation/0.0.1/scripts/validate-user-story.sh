#!/bin/bash
# validate-user-story.sh - Valida user stories técnicas
# Uso: ./validate-user-story.sh [stories_dir]

STORIES_DIR="${1:-stories}"
ERRORS=0
WARNINGS=0

echo "🔍 Validando user stories em: $STORIES_DIR"
echo ""

# Função para validar arquivo MD
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
    if ! grep -qi "### Critérios de Aceite" "$file"; then
        echo "  ❌ Seção 'Critérios de Aceite' obrigatória não encontrada"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Verificar se tem Repositório
    if ! grep -qi "### Repositório" "$file"; then
        echo "  ⚠️  Seção 'Repositório' não encontrada"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    echo "  ✅ Arquivo MD validado"
}

# Função para validar arquivo JIRA
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

# Validar user stories
echo "📖 User Stories:"
for file in "$STORIES_DIR"/*.md; do
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

# Resumo
echo "📊 Resumo da validação:"
echo "  Erros: $ERRORS"
echo "  Avisos: $WARNINGS"

if [ $ERRORS -gt 0 ]; then
    echo "❌ Validação falhou com $ERRORS erro(s)"
    exit 1
else
    echo "✅ Validação passou"
fi