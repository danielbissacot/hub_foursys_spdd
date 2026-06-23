#!/bin/bash
# jira-sprint-report.sh — Relatório do estado atual de uma sprint (Agile API)
# Exibe issues agrupadas por status, com resumo de contagem e responsáveis.
#
# Usage: jira-sprint-report.sh --sprint <SPRINT_ID> [--fields <fields>] [--max-results <n>]
#
# Examples:
#   ./scripts/jira-sprint-report.sh --sprint 233767
#   ./scripts/jira-sprint-report.sh --sprint 233767 --fields summary,status,assignee,issuetype,priority
#   ./scripts/jira-sprint-report.sh --sprint 233767 --max-results 200
#
# Output: JSON com a sprint info e issues agrupadas por status.

SCRIPT_DIR="$(dirname "$0")"
source "${SCRIPT_DIR}/common.sh"
require_jira_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
SPRINT_ID=""
FIELDS="summary,status,assignee,issuetype,priority,customfield_10016"
MAX_RESULTS="100"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --sprint)
            SPRINT_ID="$2"
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
        --help|-h)
            echo "Usage: $(basename "$0") --sprint <SPRINT_ID> [--fields <fields>] [--max-results <n>]"
            echo ""
            echo "Generates a sprint status report with issues grouped by status."
            echo ""
            echo "Options:"
            echo "  --sprint <id>        Sprint ID (required). Use jira-list-sprints.sh to find it."
            echo "  --fields <fields>    Comma-separated issue fields to return"
            echo "                       Default: summary,status,assignee,issuetype,priority,customfield_10016"
            echo "  --max-results <n>    Maximum number of issues to fetch (default: 100)"
            echo "  --help, -h           Show this help message"
            echo ""
            echo "Output JSON structure:"
            echo "  {"
            echo "    sprint: { id, name, state, startDate, endDate, goal },"
            echo "    summary: { total, byStatus: { '<status>': <count> } },"
            echo "    issuesByStatus: [ { status, total, issues: [...] } ]"
            echo "  }"
            echo ""
            echo "Examples:"
            echo "  $(basename "$0") --sprint 233767"
            echo "  $(basename "$0") --sprint 233767 --max-results 200"
            echo ""
            echo "Workflow:"
            echo "  1. Use jira-list-boards.sh to find your board ID"
            echo "  2. Use jira-list-sprints.sh --board <ID> --state active to find the sprint ID"
            echo "  3. Use this script with the sprint ID to get the full report"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [[ -z "$SPRINT_ID" ]]; then
    log_error "--sprint is required."
    echo "Usage: $(basename "$0") --sprint <SPRINT_ID> [--fields <fields>] [--max-results <n>]" >&2
    exit 1
fi

# ─────────────────────────────────────────────
# Step 1: Fetch sprint metadata
# ─────────────────────────────────────────────
log_info "Fetching sprint ${SPRINT_ID} metadata..."

SPRINT_URL="${JIRA_BASE_URL}/rest/agile/1.0/sprint/${SPRINT_ID}"
if ! SPRINT_DATA=$(atlassian_get "$SPRINT_URL"); then
    log_error "Failed to fetch sprint ${SPRINT_ID}."
    exit 1
fi

SPRINT_INFO=$(echo "$SPRINT_DATA" | jq '{
    id: .id,
    name: .name,
    state: .state,
    startDate: .startDate,
    endDate: .endDate,
    goal: .goal
}')

SPRINT_NAME=$(echo "$SPRINT_INFO" | jq -r '.name')
log_info "Sprint: ${SPRINT_NAME}"

# ─────────────────────────────────────────────
# Step 2: Fetch all issues with pagination
# ─────────────────────────────────────────────
log_info "Fetching sprint issues (fields: ${FIELDS})..."

ALL_ISSUES="[]"
START_AT=0
TOTAL=0
FETCHED=0

while true; do
    ISSUES_URL="${JIRA_BASE_URL}/rest/agile/1.0/sprint/${SPRINT_ID}/issue?maxResults=${MAX_RESULTS}&startAt=${START_AT}&fields=${FIELDS}"
    if ! RESPONSE=$(atlassian_get "$ISSUES_URL"); then
        log_error "Failed to fetch issues at startAt=${START_AT}."
        exit 1
    fi

    TOTAL=$(echo "$RESPONSE" | jq '.total')
    PAGE_ISSUES=$(echo "$RESPONSE" | jq '.issues')
    PAGE_COUNT=$(echo "$PAGE_ISSUES" | jq 'length')
    FETCHED=$((FETCHED + PAGE_COUNT))

    ALL_ISSUES=$(echo "$ALL_ISSUES" "$PAGE_ISSUES" | jq -s '.[0] + .[1]')

    log_info "Fetched ${FETCHED}/${TOTAL} issues..."

    if [[ $FETCHED -ge $TOTAL ]]; then
        break
    fi

    START_AT=$FETCHED
done

# ─────────────────────────────────────────────
# Step 3: Build grouped report
# ─────────────────────────────────────────────
log_info "Building report..."

REPORT=$(echo "$ALL_ISSUES" | jq --argjson sprint "$SPRINT_INFO" '
    group_by(.fields.status.name) |
    map({
        status: .[0].fields.status.name,
        total: length,
        issues: map({
            key: .key,
            type: .fields.issuetype.name,
            summary: .fields.summary,
            assignee: (.fields.assignee.displayName // "Não atribuído"),
            priority: (.fields.priority.name // null),
            storyPoints: (.fields.customfield_10016 // null)
        })
    }) |
    sort_by(-.total) |
    {
        sprint: $sprint,
        summary: {
            total: (map(.total) | add),
            byStatus: (map({(.status): .total}) | add)
        },
        issuesByStatus: .
    }
')

echo "$REPORT"
