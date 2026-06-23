#!/bin/bash
# confluence-get-space.sh — Consultar detalhes de um espaço Confluence
# Usage: confluence-get-space.sh --space <SPACE_KEY> [--expand <fields>]
#
# Examples:
#   ./scripts/confluence-get-space.sh --space MYSPACE
#   ./scripts/confluence-get-space.sh --space MYSPACE --expand description.plain

source "$(dirname "$0")/common.sh"
require_confluence_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
SPACE_KEY=""
EXPAND=""

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
        --help|-h)
            echo "Usage: $(basename "$0") --space <SPACE_KEY> [--expand <fields>]"
            echo ""
            echo "Options:"
            echo "  --space <key>      The key of the Confluence space (required)"
            echo "  --expand <fields>  Comma-separated fields to expand (e.g., description.plain,homepage)"
            echo "  --help, -h         Show this help message"
            echo ""
            echo "Examples:"
            echo "  $(basename "$0") --space MYSPACE"
            echo "  $(basename "$0") --space MYSPACE --expand description.plain"
            exit 0
            ;;
        -*)
            log_error "Unknown option: $1"
            exit 1
            ;;
        *)
            # Backward compat: accept positional argument as space key
            if [[ -z "$SPACE_KEY" ]]; then
                SPACE_KEY="$1"
            else
                log_error "Unexpected argument: $1"
                exit 1
            fi
            shift
            ;;
    esac
done

if [[ -z "$SPACE_KEY" ]]; then
    log_error "--space is required."
    echo "Usage: $(basename "$0") --space <SPACE_KEY> [--expand <fields>]" >&2
    exit 1
fi

# ─────────────────────────────────────────────
# Build URL with query parameters
# ─────────────────────────────────────────────
URL="${CONFLUENCE_BASE_URL}/rest/api/space/${SPACE_KEY}"

QUERY_PARAMS=""
if [[ -n "$EXPAND" ]]; then
    QUERY_PARAMS="expand=${EXPAND}"
fi

if [[ -n "$QUERY_PARAMS" ]]; then
    URL="${URL}?${QUERY_PARAMS}"
fi

# ─────────────────────────────────────────────
# Execute request
# ─────────────────────────────────────────────
atlassian_get "$URL"
