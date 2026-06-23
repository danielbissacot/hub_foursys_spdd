#!/bin/bash
# jira-list-sprints.sh — Listar sprints de um board Jira (Agile API)
# Usage: jira-list-sprints.sh --board <BOARD_ID> [--state <active|future|closed>] [--max-results <n>]
#
# Examples:
#   ./scripts/jira-list-sprints.sh --board 140191
#   ./scripts/jira-list-sprints.sh --board 140191 --state active
#   ./scripts/jira-list-sprints.sh --board 140191 --state closed --max-results 5

SCRIPT_DIR="$(dirname "$0")"
source "${SCRIPT_DIR}/common.sh"
require_jira_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
BOARD_ID=""
SPRINT_STATE=""
MAX_RESULTS="50"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --board)
            BOARD_ID="$2"
            shift 2
            ;;
        --state)
            SPRINT_STATE="$2"
            shift 2
            ;;
        --max-results)
            MAX_RESULTS="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") --board <BOARD_ID> [--state <active|future|closed>] [--max-results <n>]"
            echo ""
            echo "Options:"
            echo "  --board <id>         Board ID (required). Use jira-list-boards.sh to find it."
            echo "  --state <state>      Filter by sprint state: active, future, closed"
            echo "                       Can be comma-separated: active,future"
            echo "  --max-results <n>    Maximum number of results (default: 50)"
            echo "  --help, -h           Show this help message"
            echo ""
            echo "Examples:"
            echo "  $(basename "$0") --board 140191"
            echo "  $(basename "$0") --board 140191 --state active"
            echo "  $(basename "$0") --board 140191 --state active,future"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [[ -z "$BOARD_ID" ]]; then
    log_error "--board is required."
    echo "Usage: $(basename "$0") --board <BOARD_ID> [--state <active|future|closed>] [--max-results <n>]" >&2
    exit 1
fi

# ─────────────────────────────────────────────
# Build URL with query parameters
# ─────────────────────────────────────────────
URL="${JIRA_BASE_URL}/rest/agile/1.0/board/${BOARD_ID}/sprint"

QUERY_PARTS=("maxResults=${MAX_RESULTS}")

if [[ -n "$SPRINT_STATE" ]]; then
    QUERY_PARTS+=("state=${SPRINT_STATE}")
fi

QUERY_STRING=$(IFS='&'; echo "${QUERY_PARTS[*]}")
URL="${URL}?${QUERY_STRING}"

# ─────────────────────────────────────────────
# Execute request
# ─────────────────────────────────────────────
log_info "Listing sprints for board ${BOARD_ID}"

atlassian_get "$URL"
