#!/bin/bash
# jira-get-issue.sh — Consultar issue Jira por key
# Usage: jira-get-issue.sh --key <ISSUE_KEY> [--fields <fields>] [--expand <fields>]
#
# Examples:
#   ./scripts/jira-get-issue.sh --key SPJJOR-4196
#   ./scripts/jira-get-issue.sh --key SPJJOR-4196 --fields description,assignee,status,subtasks,components
#   ./scripts/jira-get-issue.sh --key SPJJOR-4196 --expand renderedFields

SCRIPT_DIR="$(dirname "$0")"
source "${SCRIPT_DIR}/common.sh"
require_jira_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
ISSUE_KEY=""
FIELDS=""
EXPAND=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --key)
            ISSUE_KEY="$2"
            shift 2
            ;;
        --fields)
            FIELDS="$2"
            shift 2
            ;;
        --expand)
            EXPAND="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") --key <ISSUE_KEY> [--fields <fields>] [--expand <fields>]"
            echo ""
            echo "Options:"
            echo "  --key <key>          Jira issue key, e.g., SPJJOR-4196 (required)"
            echo "  --fields <fields>    Comma-separated fields to return (e.g., summary,description,status,assignee)"
            echo "                       Default: summary,description,status,assignee"
            echo "  --expand <fields>    Comma-separated fields to expand (e.g., renderedFields,changelog)"
            echo "  --help, -h           Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [[ -z "$ISSUE_KEY" ]]; then
    log_error "--key is required."
    echo "Usage: $(basename "$0") --key <ISSUE_KEY> [--fields <fields>] [--expand <fields>]" >&2
    exit 1
fi

# ─────────────────────────────────────────────
# Build URL with query parameters
# ─────────────────────────────────────────────
URL="${JIRA_BASE_URL}/rest/api/latest/issue/${ISSUE_KEY}"

QUERY_PARTS=()
if [[ -n "$FIELDS" ]]; then
    QUERY_PARTS+=("fields=${FIELDS}")
fi
if [[ -n "$EXPAND" ]]; then
    QUERY_PARTS+=("expand=${EXPAND}")
fi

if [[ ${#QUERY_PARTS[@]} -gt 0 ]]; then
    QUERY_STRING=$(IFS='&'; echo "${QUERY_PARTS[*]}")
    URL="${URL}?${QUERY_STRING}"
fi

# ─────────────────────────────────────────────
# Execute request
# ─────────────────────────────────────────────
atlassian_get "$URL"
