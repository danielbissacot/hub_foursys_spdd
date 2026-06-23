#!/bin/bash
# jira-create-issue.sh — Criar nova issue no Jira
# Usage: jira-create-issue.sh --project <KEY> --type <TYPE> --summary <TEXT> [--description <TEXT> | --description-file <MD>] [--parent <KEY>]
#
# Examples:
#   ./scripts/jira-create-issue.sh --project SPJJOR --type Story --summary "Nova funcionalidade" --description "Descrição da story"
#   ./scripts/jira-create-issue.sh --project SPJJOR --type Task --summary "Task" --description-file docs/task.md
#   ./scripts/jira-create-issue.sh --project SPJJOR --type Sub-task --parent SPJJOR-4196 --summary "Subtask 1"

SCRIPT_DIR="$(dirname "$0")"
source "${SCRIPT_DIR}/common.sh"
require_jira_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
PROJECT=""
ISSUE_TYPE=""
SUMMARY=""
DESCRIPTION=""
DESCRIPTION_FILE=""
PARENT_KEY=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --project)
            PROJECT="$2"
            shift 2
            ;;
        --type)
            ISSUE_TYPE="$2"
            shift 2
            ;;
        --summary)
            SUMMARY="$2"
            shift 2
            ;;
        --description)
            DESCRIPTION="$2"
            shift 2
            ;;
        --description-file)
            DESCRIPTION_FILE="$2"
            shift 2
            ;;
        --parent)
            PARENT_KEY="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") --project <KEY> --type <TYPE> --summary <TEXT> [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --project <key>            Jira project key (required)"
            echo "  --type <type>              Issue type: Story, Task, Bug, Sub-task, etc. (required)"
            echo "  --summary <text>           Issue summary/title (required)"
            echo "  --description <text>       Description in Jira Wiki Markup"
            echo "  --description-file <path>  Markdown file to convert to Jira Wiki Markup"
            echo "  --parent <key>             Parent issue key (for Sub-task type)"
            echo "  --help, -h                 Show this help message"
            echo ""
            echo "Provide either --description or --description-file, not both."
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
if [[ -z "$PROJECT" ]]; then
    log_error "--project is required."
    exit 1
fi

if [[ -z "$ISSUE_TYPE" ]]; then
    log_error "--type is required."
    exit 1
fi

if [[ -z "$SUMMARY" ]]; then
    log_error "--summary is required."
    exit 1
fi

if [[ -n "$DESCRIPTION" && -n "$DESCRIPTION_FILE" ]]; then
    log_error "Provide either --description or --description-file, not both."
    exit 1
fi

# ─────────────────────────────────────────────
# If --description-file provided, convert Markdown → Wiki Markup
# ─────────────────────────────────────────────
if [[ -n "$DESCRIPTION_FILE" ]]; then
    if [[ ! -f "$DESCRIPTION_FILE" ]]; then
        log_error "File not found: $DESCRIPTION_FILE"
        exit 1
    fi

    CONVERTER="${SCRIPT_DIR}/convert-md-to-wiki.sh"
    if [[ ! -x "$CONVERTER" ]]; then
        log_error "Converter not found or not executable: $CONVERTER"
        log_error "Ensure convert-md-to-wiki.sh exists in the scripts directory."
        exit 1
    fi

    if ! DESCRIPTION=$("${CONVERTER}" "$DESCRIPTION_FILE"); then
        log_error "Failed to convert Markdown file to Jira Wiki Markup."
        exit 1
    fi
fi

# ─────────────────────────────────────────────
# Build JSON payload
# ─────────────────────────────────────────────
# Write description to a temp file and use jq --rawfile to avoid
# shell variable expansion corrupting large or multibyte content.
# Then write the full payload to a second temp file and pass it
# to curl via -d @file, bypassing all shell escaping issues.
TMP_DESC=$(mktemp)
TMP_PAYLOAD=$(mktemp)
trap "rm -f '$TMP_DESC' '$TMP_PAYLOAD'" EXIT

printf '%s' "${DESCRIPTION:-}" > "$TMP_DESC"

jq -n \
    --arg project "$PROJECT" \
    --arg issueType "$ISSUE_TYPE" \
    --arg summary "$SUMMARY" \
    --rawfile description "$TMP_DESC" \
    --arg parentKey "${PARENT_KEY:-}" \
    '{
        fields: {
            project: { key: $project },
            issuetype: { name: $issueType },
            summary: $summary
        }
    }
    | if ($description | ltrimstr("\n") | length) > 0 then .fields.description = $description else . end
    | if $parentKey != "" then .fields.parent = { key: $parentKey } else . end' > "$TMP_PAYLOAD"

# ─────────────────────────────────────────────
# Execute request
# ─────────────────────────────────────────────
URL="${JIRA_BASE_URL}/rest/api/latest/issue"

if ! RESPONSE=$(atlassian_post "$URL" -d "@${TMP_PAYLOAD}"); then
    exit 1
fi

# Display the created issue info
ISSUE_KEY=$(echo "$RESPONSE" | jq -r '.key')
log_info "Issue created: ${ISSUE_KEY}"
echo "$RESPONSE"
