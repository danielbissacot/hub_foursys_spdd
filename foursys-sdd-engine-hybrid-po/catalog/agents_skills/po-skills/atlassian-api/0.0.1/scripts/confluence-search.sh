#!/bin/bash
# confluence-search.sh — Buscar páginas no Confluence via CQL
# Usage: confluence-search.sh --query <TERM> [--space <SPACE_KEY>] [--limit <n>]
#
# Examples:
#   ./scripts/confluence-search.sh --query "arquitetura" --space MYSPACE
#   ./scripts/confluence-search.sh --query "deploy" --limit 5

source "$(dirname "$0")/common.sh"
require_confluence_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
QUERY=""
SPACE_KEY=""
LIMIT=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --query)
            QUERY="$2"
            shift 2
            ;;
        --space)
            SPACE_KEY="$2"
            shift 2
            ;;
        --limit)
            LIMIT="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") --query <TERM> [--space <SPACE_KEY>] [--limit <n>]"
            echo ""
            echo "Options:"
            echo "  --query <term>     Search term (used in CQL text ~ \"term\") (required)"
            echo "  --space <key>      Restrict search to a specific space"
            echo "  --limit <n>        Maximum number of results (default: 25)"
            echo "  --help, -h         Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [[ -z "$QUERY" ]]; then
    log_error "--query is required."
    echo "Usage: $(basename "$0") --query <TERM> [--space <SPACE_KEY>] [--limit <n>]" >&2
    exit 1
fi

# ─────────────────────────────────────────────
# Build CQL query
# ─────────────────────────────────────────────
CQL="text ~ \"${QUERY}\""

if [[ -n "$SPACE_KEY" ]]; then
    CQL="${CQL} AND space = \"${SPACE_KEY}\""
fi

# ─────────────────────────────────────────────
# Build URL with query parameters
# ─────────────────────────────────────────────
# URL-encode the CQL via --data-urlencode in curl
URL="${CONFLUENCE_BASE_URL}/rest/api/content/search"

QUERY_PARTS=()
[[ -n "$LIMIT" ]] && QUERY_PARTS+=("limit=${LIMIT}")

if [[ ${#QUERY_PARTS[@]} -gt 0 ]]; then
    QUERY_STRING=$(IFS='&'; echo "${QUERY_PARTS[*]}")
    URL="${URL}?${QUERY_STRING}"
fi

# ─────────────────────────────────────────────
# Execute request (use --data-urlencode for CQL)
# ─────────────────────────────────────────────
atlassian_get "$URL" --data-urlencode "cql=${CQL}" -G
