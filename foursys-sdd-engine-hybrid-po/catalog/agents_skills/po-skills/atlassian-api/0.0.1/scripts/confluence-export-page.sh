#!/bin/bash
# confluence-export-page.sh — Exportar página Confluence para Markdown
# Usage: confluence-export-page.sh --id <PAGE_ID> [--output <DIR>]
#
# Fetches the page via API, converts HTML → Markdown via convert-html-to-md.sh,
# and saves to docs/confluence/<slug>.md with YAML frontmatter.
#
# Examples:
#   ./scripts/confluence-export-page.sh --id 2476340340
#   ./scripts/confluence-export-page.sh --id 2476340340 --output docs/custom/

SCRIPT_DIR="$(dirname "$0")"
source "${SCRIPT_DIR}/common.sh"
require_confluence_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
PAGE_ID=""
OUTPUT_DIR="docs/confluence"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --id)
            PAGE_ID="$2"
            shift 2
            ;;
        --output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") --id <PAGE_ID> [--output <DIR>]"
            echo ""
            echo "Options:"
            echo "  --id <id>          Page ID to export (required)"
            echo "  --output <dir>     Output directory (default: docs/confluence)"
            echo "  --help, -h         Show this help message"
            echo ""
            echo "Output: <dir>/<page-title-slug>.md with YAML frontmatter"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [[ -z "$PAGE_ID" ]]; then
    log_error "--id is required."
    exit 1
fi

# ─────────────────────────────────────────────
# Check converter is available
# ─────────────────────────────────────────────
CONVERTER="${SCRIPT_DIR}/convert-html-to-md.sh"
if [[ ! -x "$CONVERTER" ]]; then
    log_error "Converter not found or not executable: $CONVERTER"
    log_error "Ensure convert-html-to-md.sh exists in the scripts directory."
    exit 1
fi

# ─────────────────────────────────────────────
# Fetch page from Confluence
# ─────────────────────────────────────────────
log_info "Fetching page ${PAGE_ID} from Confluence..."

if ! RESPONSE=$(atlassian_get "${CONFLUENCE_BASE_URL}/rest/api/content/${PAGE_ID}?expand=body.storage,version,space"); then
    log_error "Failed to fetch page ${PAGE_ID}."
    exit 1
fi

# Extract fields
PAGE_TITLE=$(echo "$RESPONSE" | jq -r '.title')
PAGE_SPACE=$(echo "$RESPONSE" | jq -r '.space.key')
PAGE_BODY=$(echo "$RESPONSE" | jq -r '.body.storage.value')
PAGE_WEBUI=$(echo "$RESPONSE" | jq -r '._links.webui // ""')

if [[ -z "$PAGE_TITLE" || "$PAGE_TITLE" == "null" ]]; then
    log_error "Could not extract page title from response."
    exit 1
fi

# Build source URL
SOURCE_URL="${CONFLUENCE_BASE_URL}${PAGE_WEBUI}"

# ─────────────────────────────────────────────
# Convert HTML → Markdown
# ─────────────────────────────────────────────
log_info "Converting HTML to Markdown..."

if ! MD_CONTENT=$(echo "$PAGE_BODY" | "${CONVERTER}"); then
    log_error "Failed to convert page content to Markdown."
    exit 1
fi

# ─────────────────────────────────────────────
# Build output file with frontmatter
# ─────────────────────────────────────────────
SLUG=$(slugify "$PAGE_TITLE")
EXPORTED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Create output directory if needed
mkdir -p "$OUTPUT_DIR"

OUTPUT_FILE="${OUTPUT_DIR}/${SLUG}.md"

{
    echo "---"
    echo "title: \"${PAGE_TITLE}\""
    echo "source_id: \"${PAGE_ID}\""
    echo "source_url: \"${SOURCE_URL}\""
    echo "exported_at: \"${EXPORTED_AT}\""
    echo "space: \"${PAGE_SPACE}\""
    echo "---"
    echo ""
    echo "$MD_CONTENT"
} > "$OUTPUT_FILE"

log_info "Exported to: ${OUTPUT_FILE}"

# Output file content to stdout for automated consumers (e.g., Copilot agent)
cat "$OUTPUT_FILE"
