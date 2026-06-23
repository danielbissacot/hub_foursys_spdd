#!/bin/bash
# confluence-get-content.sh — Listar conteúdos de um espaço Confluence
# Usage: confluence-get-content.sh --space <SPACE_KEY> [--expand <fields>] [--limit <n>] [--start <n>]
#
# Examples:
#   ./scripts/confluence-get-content.sh --space MYSPACE
#   ./scripts/confluence-get-content.sh --space MYSPACE --expand history --limit 10 --start 0

source "$(dirname "$0")/common.sh"
require_confluence_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
SPACE_KEY=""
EXPAND=""
LIMIT=""
START=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --space)
            SPACE_KEY="$2"
            shift 2
            ;;
        --expand)
            EXPAND="$2"
            shift 2
            ;;
        --limit)
            LIMIT="$2"
            shift 2
            ;;
        --start)
            START="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") --space <SPACE_KEY> [--expand <fields>] [--limit <n>] [--start <n>]"
            echo ""
            echo "Options:"
            echo "  --space <key>      The key of the Confluence space (required)"
            echo "  --expand <fields>  Comma-separated fields to expand (e.g., history, body.view)"
            echo "  --limit <n>        Maximum number of results (default: 25)"
            echo "  --start <n>        Starting index for pagination (default: 0)"
            echo "  --help, -h         Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [[ -z "$SPACE_KEY" ]]; then
    log_error "--space is required."
    echo "Usage: $(basename "$0") --space <SPACE_KEY> [--expand <fields>] [--limit <n>] [--start <n>]" >&2
    exit 1
fi

# ─────────────────────────────────────────────
# Build URL with query parameters
# ─────────────────────────────────────────────
URL="${CONFLUENCE_BASE_URL}/rest/api/space/${SPACE_KEY}/content"

QUERY_PARTS=()
[[ -n "$EXPAND" ]] && QUERY_PARTS+=("expand=${EXPAND}")
[[ -n "$LIMIT" ]]  && QUERY_PARTS+=("limit=${LIMIT}")
[[ -n "$START" ]]  && QUERY_PARTS+=("start=${START}")

if [[ ${#QUERY_PARTS[@]} -gt 0 ]]; then
    QUERY_STRING=$(IFS='&'; echo "${QUERY_PARTS[*]}")
    URL="${URL}?${QUERY_STRING}"
fi

# ─────────────────────────────────────────────
# Execute request
# ─────────────────────────────────────────────
atlassian_get "$URL"
