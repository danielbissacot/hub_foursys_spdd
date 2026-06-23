#!/bin/bash
# jira-transition-issue.sh — Transicionar status de uma issue Jira
# Usage: jira-transition-issue.sh --key <KEY> (--status <NAME> | --transition-id <ID> | --list)
#
# Examples:
#   ./scripts/jira-transition-issue.sh --key SPJJOR-4196 --list
#   ./scripts/jira-transition-issue.sh --key SPJJOR-4196 --status "In Progress"
#   ./scripts/jira-transition-issue.sh --key SPJJOR-4196 --transition-id 21

SCRIPT_DIR="$(dirname "$0")"
source "${SCRIPT_DIR}/common.sh"
require_jira_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
ISSUE_KEY=""
STATUS_NAME=""
TRANSITION_ID=""
LIST_TRANSITIONS=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --key)
            ISSUE_KEY="$2"
            shift 2
            ;;
        --status)
            STATUS_NAME="$2"
            shift 2
            ;;
        --transition-id)
            TRANSITION_ID="$2"
            shift 2
            ;;
        --list)
            LIST_TRANSITIONS=true
            shift
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") --key <KEY> (--status <NAME> | --transition-id <ID> | --list)"
            echo ""
            echo "Options:"
            echo "  --key <key>              Issue key, e.g., SPJJOR-4196 (required)"
            echo "  --status <name>          Target status name (e.g., 'In Progress', 'Done')"
            echo "  --transition-id <id>     Direct transition ID to execute"
            echo "  --list                   List available transitions and exit"
            echo "  --help, -h               Show this help message"
            echo ""
            echo "Provide one of: --status, --transition-id, or --list."
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# ─────────────────────────────────────────────
# Validation
# ─────────────────────────────────────────────
if [[ -z "$ISSUE_KEY" ]]; then
    log_error "--key is required."
    exit 1
fi

if [[ "$LIST_TRANSITIONS" == false && -z "$STATUS_NAME" && -z "$TRANSITION_ID" ]]; then
    log_error "Provide --status <NAME>, --transition-id <ID>, or --list."
    exit 1
fi

# ─────────────────────────────────────────────
# Fetch available transitions
# ─────────────────────────────────────────────
TRANSITIONS_URL="${JIRA_BASE_URL}/rest/api/latest/issue/${ISSUE_KEY}/transitions"

if ! TRANSITIONS_RESPONSE=$(atlassian_get "$TRANSITIONS_URL"); then
    log_error "Failed to fetch transitions for ${ISSUE_KEY}."
    exit 1
fi

# ─────────────────────────────────────────────
# --list: display available transitions and exit
# ─────────────────────────────────────────────
if [[ "$LIST_TRANSITIONS" == true ]]; then
    log_info "Available transitions for ${ISSUE_KEY}:"
    echo "$TRANSITIONS_RESPONSE" | jq -r '.transitions[] | "  ID: \(.id)  Name: \(.name)  → \(.to.name)"'
    exit 0
fi

# ─────────────────────────────────────────────
# Resolve transition ID from status name if needed
# ─────────────────────────────────────────────
if [[ -n "$STATUS_NAME" ]]; then
    # Search for a transition whose target status matches (case-insensitive)
    TRANSITION_ID=$(echo "$TRANSITIONS_RESPONSE" | jq -r \
        --arg status "$STATUS_NAME" \
        '.transitions[] | select(.to.name | ascii_downcase == ($status | ascii_downcase)) | .id' \
        | head -1)

    if [[ -z "$TRANSITION_ID" ]]; then
        log_error "No transition found to status '${STATUS_NAME}'."
        log_error "Available transitions:"
        echo "$TRANSITIONS_RESPONSE" | jq -r '.transitions[] | "  ID: \(.id)  Name: \(.name)  → \(.to.name)"' >&2
        exit 1
    fi

    log_info "Found transition ID ${TRANSITION_ID} for status '${STATUS_NAME}'"
fi

# ─────────────────────────────────────────────
# Execute transition
# ─────────────────────────────────────────────
PAYLOAD=$(jq -n --arg id "$TRANSITION_ID" '{ transition: { id: $id } }')

if atlassian_post "$TRANSITIONS_URL" -d "$PAYLOAD"; then
    log_info "Issue ${ISSUE_KEY} transitioned successfully (transition ID: ${TRANSITION_ID})."
else
    exit 1
fi
