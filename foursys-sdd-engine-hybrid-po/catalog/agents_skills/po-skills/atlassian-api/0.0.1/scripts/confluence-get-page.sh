#!/bin/bash
# confluence-get-page.sh — Ler conteúdo de uma página Confluence
# Usage: confluence-get-page.sh --id <PAGE_ID> [--format <view|storage>]
#        confluence-get-page.sh --space <SPACE_KEY> --title <TITLE> [--format <view|storage>]
#
# Examples:
#   ./scripts/confluence-get-page.sh --id 2476340340 --format view
#   ./scripts/confluence-get-page.sh --space MYSPACE --title "Conteúdo Squad"
#   ./scripts/confluence-get-page.sh --id 2476340340 --format storage

source "$(dirname "$0")/common.sh"
require_confluence_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
PAGE_ID=""
SPACE_KEY=""
TITLE=""
FORMAT="view"  # Default: rendered HTML (body.view)

while [[ $# -gt 0 ]]; do
    case "$1" in
        --id)
            PAGE_ID="$2"
            shift 2
            ;;
        --space)
            SPACE_KEY="$2"
            shift 2
            ;;
        --title)
            TITLE="$2"
            shift 2
            ;;
        --format)
            FORMAT="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") --id <PAGE_ID> [--format <view|storage>]"
            echo "       $(basename "$0") --space <SPACE_KEY> --title <TITLE> [--format <view|storage>]"
            echo ""
            echo "Options:"
            echo "  --id <id>          Page ID to retrieve"
            echo "  --space <key>      Space key (used with --title)"
            echo "  --title <title>    Page title to search within space"
            echo "  --format <fmt>     Body format: 'view' (rendered HTML) or 'storage' (XHTML). Default: view"
            echo "  --help, -h         Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate format
if [[ "$FORMAT" != "view" && "$FORMAT" != "storage" ]]; then
    log_error "Invalid format: $FORMAT. Use 'view' or 'storage'."
    exit 1
fi

# Validate: must have --id OR (--space + --title)
if [[ -z "$PAGE_ID" && ( -z "$SPACE_KEY" || -z "$TITLE" ) ]]; then
    log_error "Provide --id <PAGE_ID> or --space <SPACE_KEY> --title <TITLE>."
    echo "Usage: $(basename "$0") --id <ID> [--format <view|storage>]" >&2
    echo "       $(basename "$0") --space <KEY> --title <TITLE> [--format <view|storage>]" >&2
    exit 1
fi

# ─────────────────────────────────────────────
# Fetch by ID
# ─────────────────────────────────────────────
if [[ -n "$PAGE_ID" ]]; then
    URL="${CONFLUENCE_BASE_URL}/rest/api/content/${PAGE_ID}?expand=body.${FORMAT},version,space"
    atlassian_get "$URL"
    exit $?
fi

# ─────────────────────────────────────────────
# Fetch by space + title
# ─────────────────────────────────────────────
# URL-encode the title for the query parameter
ENCODED_TITLE=$(printf '%s' "$TITLE" | jq -sRr @uri)

URL="${CONFLUENCE_BASE_URL}/rest/api/content?spaceKey=${SPACE_KEY}&title=${ENCODED_TITLE}&expand=body.${FORMAT},version,space"

if ! RESPONSE=$(atlassian_get "$URL"); then
    exit 1
fi

# Check if results were found
RESULT_COUNT=$(echo "$RESPONSE" | jq '.results | length')

if [[ "$RESULT_COUNT" -eq 0 ]]; then
    log_error "No page found with title \"${TITLE}\" in space \"${SPACE_KEY}\"."
    exit 1
fi

# Return the first matching page
echo "$RESPONSE" | jq '.results[0]'
