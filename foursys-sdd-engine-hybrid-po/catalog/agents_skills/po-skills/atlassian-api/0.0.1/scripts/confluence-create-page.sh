#!/bin/bash
# confluence-create-page.sh — Criar nova página no Confluence
# Usage: confluence-create-page.sh --space <KEY> --title <TITLE> (--body <HTML> | --file <MD_FILE>) [--parent-id <ID>]
#
# Examples:
#   ./scripts/confluence-create-page.sh --space MYSPACE --title "Nova Página" --body "<p>Conteúdo</p>"
#   ./scripts/confluence-create-page.sh --space MYSPACE --title "Página MD" --file docs/readme.md
#   ./scripts/confluence-create-page.sh --space MYSPACE --title "Sub Página" --parent-id 2476340340 --body "<p>Filho</p>"

SCRIPT_DIR="$(dirname "$0")"
source "${SCRIPT_DIR}/common.sh"
require_confluence_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
SPACE_KEY=""
TITLE=""
BODY=""
FILE=""
PARENT_ID=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --space)
            SPACE_KEY="$2"
            shift 2
            ;;
        --title)
            TITLE="$2"
            shift 2
            ;;
        --body)
            BODY="$2"
            shift 2
            ;;
        --file)
            FILE="$2"
            shift 2
            ;;
        --parent-id)
            PARENT_ID="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") --space <KEY> --title <TITLE> (--body <HTML> | --file <MD_FILE>) [--parent-id <ID>]"
            echo ""
            echo "Options:"
            echo "  --space <key>        Confluence space key (required)"
            echo "  --title <title>      Page title (required)"
            echo "  --body <html>        Page body in Confluence Storage Format (XHTML)"
            echo "  --file <path>        Markdown file to convert to Storage Format"
            echo "  --parent-id <id>     Parent page ID (creates page as child)"
            echo "  --help, -h           Show this help message"
            echo ""
            echo "Provide either --body or --file, not both."
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
if [[ -z "$SPACE_KEY" ]]; then
    log_error "--space is required."
    exit 1
fi

if [[ -z "$TITLE" ]]; then
    log_error "--title is required."
    exit 1
fi

if [[ -z "$BODY" && -z "$FILE" ]]; then
    log_error "Provide --body <HTML> or --file <MD_FILE>."
    exit 1
fi

if [[ -n "$BODY" && -n "$FILE" ]]; then
    log_error "Provide either --body or --file, not both."
    exit 1
fi

# ─────────────────────────────────────────────
# If --file provided, convert Markdown → Storage Format
# ─────────────────────────────────────────────
if [[ -n "$FILE" ]]; then
    if [[ ! -f "$FILE" ]]; then
        log_error "File not found: $FILE"
        exit 1
    fi

    CONVERTER="${SCRIPT_DIR}/convert-md-to-confluence.sh"
    if [[ ! -x "$CONVERTER" ]]; then
        log_error "Converter not found or not executable: $CONVERTER"
        log_error "Ensure convert-md-to-confluence.sh exists in the scripts directory."
        exit 1
    fi

    if ! BODY=$("${CONVERTER}" "$FILE"); then
        log_error "Failed to convert Markdown file to Confluence Storage Format."
        exit 1
    fi
fi

# ─────────────────────────────────────────────
# Build JSON payload
# ─────────────────────────────────────────────
# Write body to a temp file and use jq --rawfile to avoid shell
# variable expansion corrupting large or multibyte HTML content.
# Then write the full payload to a second temp file and pass it
# to curl via -d @file, bypassing all shell escaping issues.
TMP_BODY=$(mktemp)
TMP_PAYLOAD=$(mktemp)
trap "rm -f '$TMP_BODY' '$TMP_PAYLOAD'" EXIT

printf '%s' "$BODY" > "$TMP_BODY"

jq -n \
    --arg type "page" \
    --arg title "$TITLE" \
    --arg spaceKey "$SPACE_KEY" \
    --rawfile body "$TMP_BODY" \
    --arg parentId "$PARENT_ID" \
    '{
        type: $type,
        title: $title,
        space: { key: $spaceKey },
        body: {
            storage: {
                value: $body,
                representation: "storage"
            }
        }
    } + (if $parentId != "" then { ancestors: [{ id: $parentId }] } else {} end)' > "$TMP_PAYLOAD"

# ─────────────────────────────────────────────
# Execute request
# ─────────────────────────────────────────────
URL="${CONFLUENCE_BASE_URL}/rest/api/content"

atlassian_post "$URL" -d "@${TMP_PAYLOAD}"
