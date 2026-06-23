#!/bin/bash
# jira-search.sh — Buscar issues no Jira via JQL
# Usage: jira-search.sh --jql <QUERY> [--fields <fields>] [--max-results <n>] [--start-at <n>]
#
# Examples:
#   ./scripts/jira-search.sh --jql "project = SPJJOR AND status = 'In Progress'" --fields summary,status,assignee
#   ./scripts/jira-search.sh --jql "project = SPJJOR" --max-results 15 --start-at 0
#   ./scripts/jira-search.sh --jql "assignee = currentUser()"

SCRIPT_DIR="$(dirname "$0")"
source "${SCRIPT_DIR}/common.sh"
require_jira_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
JQL=""
FIELDS=""
MAX_RESULTS=""
START_AT=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --jql)
            JQL="$2"
            shift 2
            ;;
        --fields)
            FIELDS="$2"
            shift 2
            ;;
        --max-results)
            MAX_RESULTS="$2"
            shift 2
            ;;
        --start-at)
            START_AT="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") --jql <QUERY> [--fields <fields>] [--max-results <n>] [--start-at <n>]"
            echo ""
            echo "Options:"
            echo "  --jql <query>          JQL query string (required)"
            echo "  --fields <fields>      Comma-separated fields to return (e.g., summary,status,assignee)"
            echo "  --max-results <n>      Maximum number of results (default: 50)"
            echo "  --start-at <n>         Start index for pagination (default: 0)"
            echo "  --help, -h             Show this help message"
            echo ""
            echo "JQL Examples:"
            echo "  \"project = PROJ AND status = 'In Progress'\""
            echo "  \"assignee = currentUser()\""
            echo "  \"text ~ 'search term' AND project = PROJ\""
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [[ -z "$JQL" ]]; then
    log_error "--jql is required."
    echo "Usage: $(basename "$0") --jql <QUERY> [--fields <fields>] [--max-results <n>] [--start-at <n>]" >&2
    exit 1
fi

# ─────────────────────────────────────────────
# Build JSON payload using jq
# ─────────────────────────────────────────────
# Convert comma-separated fields to JSON array
FIELDS_JSON="[]"
if [[ -n "$FIELDS" ]]; then
    FIELDS_JSON=$(echo "$FIELDS" | tr ',' '\n' | jq -R . | jq -s .)
fi

# Write the payload to a temp file and pass it to curl via -d @file,
# bypassing shell escaping issues with special characters in JQL.
TMP_PAYLOAD=$(mktemp)
trap "rm -f '$TMP_PAYLOAD'" EXIT

jq -n \
    --arg jql "$JQL" \
    --argjson fields "$FIELDS_JSON" \
    --arg maxResults "${MAX_RESULTS:-50}" \
    --arg startAt "${START_AT:-0}" \
    '{
        jql: $jql,
        fields: $fields,
        maxResults: ($maxResults | tonumber),
        startAt: ($startAt | tonumber)
    }' > "$TMP_PAYLOAD"

# Remove fields key if empty array (returns all fields)
if [[ -z "$FIELDS" ]]; then
    jq 'del(.fields)' "$TMP_PAYLOAD" > "${TMP_PAYLOAD}.tmp" && mv "${TMP_PAYLOAD}.tmp" "$TMP_PAYLOAD"
fi

# ─────────────────────────────────────────────
# Execute request
# ─────────────────────────────────────────────
URL="${JIRA_BASE_URL}/rest/api/latest/search"

atlassian_post "$URL" -d "@${TMP_PAYLOAD}"
