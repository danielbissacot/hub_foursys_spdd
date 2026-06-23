#!/bin/bash
# jira-update-issue.sh — Atualizar descrição de uma issue Jira
# Usage: jira-update-issue.sh --key <ISSUE_KEY> (--description <TEXT> | --description-file <MD>)
#
# Examples:
#   ./scripts/jira-update-issue.sh --key SPJJOR-4196 --description "Nova descrição em Wiki Markup"
#   ./scripts/jira-update-issue.sh --key SPJJOR-4196 --description-file docs/updated-desc.md

SCRIPT_DIR="$(dirname "$0")"
source "${SCRIPT_DIR}/common.sh"
require_jira_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
ISSUE_KEY=""
DESCRIPTION=""
DESCRIPTION_FILE=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --key)
            ISSUE_KEY="$2"
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
        --help|-h)
            echo "Usage: $(basename "$0") --key <ISSUE_KEY> (--description <TEXT> | --description-file <MD>)"
            echo ""
            echo "Options:"
            echo "  --key <key>                Issue key, e.g., SPJJOR-4196 (required)"
            echo "  --description <text>       New description in Jira Wiki Markup"
            echo "  --description-file <path>  Markdown file to convert to Jira Wiki Markup"
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
if [[ -z "$ISSUE_KEY" ]]; then
    log_error "--key is required."
    exit 1
fi

if [[ -z "$DESCRIPTION" && -z "$DESCRIPTION_FILE" ]]; then
    log_error "Provide --description <TEXT> or --description-file <MD>."
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
TMP_DESC=$(mktemp)
TMP_PAYLOAD=$(mktemp)
trap "rm -f '$TMP_DESC' '$TMP_PAYLOAD'" EXIT

printf '%s' "$DESCRIPTION" > "$TMP_DESC"

jq -n \
    --rawfile description "$TMP_DESC" \
    '{
        fields: {
            description: $description
        }
    }' > "$TMP_PAYLOAD"

# ─────────────────────────────────────────────
# Execute request
# ─────────────────────────────────────────────
URL="${JIRA_BASE_URL}/rest/api/latest/issue/${ISSUE_KEY}"

if atlassian_put "$URL" -d "@${TMP_PAYLOAD}"; then
    log_info "Issue ${ISSUE_KEY} description updated successfully."
else
    exit 1
fi
