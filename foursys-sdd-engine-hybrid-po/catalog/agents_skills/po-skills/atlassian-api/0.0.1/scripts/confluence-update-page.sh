#!/bin/bash
# confluence-update-page.sh — Editar página existente no Confluence
# Usage: confluence-update-page.sh --id <PAGE_ID> [--title <TITLE>] (--body <HTML> | --file <MD_FILE>)
#
# Automatically fetches the current version and increments it.
#
# Examples:
#   ./scripts/confluence-update-page.sh --id 2476340340 --title "Título Atualizado" --body "<p>Novo conteúdo</p>"
#   ./scripts/confluence-update-page.sh --id 2476340340 --file docs/updated.md

SCRIPT_DIR="$(dirname "$0")"
source "${SCRIPT_DIR}/common.sh"
require_confluence_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
PAGE_ID=""
TITLE=""
BODY=""
FILE=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --id)
            PAGE_ID="$2"
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
        --help|-h)
            echo "Usage: $(basename "$0") --id <PAGE_ID> [--title <TITLE>] (--body <HTML> | --file <MD_FILE>)"
            echo ""
            echo "Options:"
            echo "  --id <id>            Page ID to update (required)"
            echo "  --title <title>      New page title (if omitted, keeps current title)"
            echo "  --body <html>        New body in Confluence Storage Format (XHTML)"
            echo "  --file <path>        Markdown file to convert to Storage Format"
            echo "  --help, -h           Show this help message"
            echo ""
            echo "Provide either --body or --file, not both."
            echo "The version number is automatically fetched and incremented."
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
if [[ -z "$PAGE_ID" ]]; then
    log_error "--id is required."
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
# Fetch current page to get version and title
# ─────────────────────────────────────────────
log_info "Fetching current page version..."

if ! CURRENT_PAGE=$(atlassian_get "${CONFLUENCE_BASE_URL}/rest/api/content/${PAGE_ID}?expand=version"); then
    log_error "Failed to fetch page ${PAGE_ID}. It may not exist."
    exit 1
fi

CURRENT_VERSION=$(echo "$CURRENT_PAGE" | jq -r '.version.number')
CURRENT_TITLE=$(echo "$CURRENT_PAGE" | jq -r '.title')

if [[ -z "$CURRENT_VERSION" || "$CURRENT_VERSION" == "null" ]]; then
    log_error "Could not determine current version for page ${PAGE_ID}."
    exit 1
fi

NEW_VERSION=$((CURRENT_VERSION + 1))

# Use current title if --title not specified
if [[ -z "$TITLE" ]]; then
    TITLE="$CURRENT_TITLE"
fi

log_info "Updating page: version ${CURRENT_VERSION} → ${NEW_VERSION}"

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
    --argjson version "$NEW_VERSION" \
    --rawfile body "$TMP_BODY" \
    '{
        type: $type,
        title: $title,
        version: { number: $version },
        body: {
            storage: {
                value: $body,
                representation: "storage"
            }
        }
    }' > "$TMP_PAYLOAD"

# ─────────────────────────────────────────────
# Execute request
# ─────────────────────────────────────────────
URL="${CONFLUENCE_BASE_URL}/rest/api/content/${PAGE_ID}"

atlassian_put "$URL" -d "@${TMP_PAYLOAD}"
