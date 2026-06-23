#!/bin/bash
# jira-list-boards.sh — Listar boards Jira acessíveis pelo usuário (Agile API)
# Usage: jira-list-boards.sh [--type <scrum|kanban>] [--project <KEY>] [--name <filter>] [--max-results <n>]
#
# Examples:
#   ./scripts/jira-list-boards.sh
#   ./scripts/jira-list-boards.sh --type scrum
#   ./scripts/jira-list-boards.sh --project SPJJOR
#   ./scripts/jira-list-boards.sh --name "Task Board"

SCRIPT_DIR="$(dirname "$0")"
source "${SCRIPT_DIR}/common.sh"
require_jira_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
BOARD_TYPE=""
PROJECT_KEY=""
NAME_FILTER=""
MAX_RESULTS="50"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --type)
            BOARD_TYPE="$2"
            shift 2
            ;;
        --project)
            PROJECT_KEY="$2"
            shift 2
            ;;
        --name)
            NAME_FILTER="$2"
            shift 2
            ;;
        --max-results)
            MAX_RESULTS="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") [--type <scrum|kanban>] [--project <KEY>] [--name <filter>] [--max-results <n>]"
            echo ""
            echo "Options:"
            echo "  --type <type>        Filter by board type: scrum or kanban"
            echo "  --project <key>      Filter by project key (e.g., SPJJOR)"
            echo "  --name <filter>      Filter boards by name (substring match)"
            echo "  --max-results <n>    Maximum number of results (default: 50)"
            echo "  --help, -h           Show this help message"
            echo ""
            echo "Examples:"
            echo "  $(basename "$0")"
            echo "  $(basename "$0") --type scrum"
            echo "  $(basename "$0") --project SPJJOR"
            echo "  $(basename "$0") --name \"Task Board\""
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# ─────────────────────────────────────────────
# Build URL with query parameters
# ─────────────────────────────────────────────
URL="${JIRA_BASE_URL}/rest/agile/1.0/board"

QUERY_PARTS=("maxResults=${MAX_RESULTS}")

if [[ -n "$BOARD_TYPE" ]]; then
    QUERY_PARTS+=("type=${BOARD_TYPE}")
fi

if [[ -n "$PROJECT_KEY" ]]; then
    QUERY_PARTS+=("projectKeyOrId=${PROJECT_KEY}")
fi

if [[ -n "$NAME_FILTER" ]]; then
    QUERY_PARTS+=("name=${NAME_FILTER}")
fi

QUERY_STRING=$(IFS='&'; echo "${QUERY_PARTS[*]}")
URL="${URL}?${QUERY_STRING}"

# ─────────────────────────────────────────────
# Execute request
# ─────────────────────────────────────────────
log_info "Listing boards from ${JIRA_BASE_URL}"

atlassian_get "$URL"
