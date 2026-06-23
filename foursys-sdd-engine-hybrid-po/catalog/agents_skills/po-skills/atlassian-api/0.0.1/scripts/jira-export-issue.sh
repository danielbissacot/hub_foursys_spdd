#!/bin/bash
# jira-export-issue.sh — Exportar issue Jira para Markdown
# Usage: jira-export-issue.sh --key <ISSUE_KEY> [--output <DIR>] [--include-subtasks]
#
# Fetches the issue via API, converts description from Wiki Markup → Markdown
# via convert-jira-to-md.sh, and saves to docs/jira/{KEY}.md with YAML frontmatter.
#
# Examples:
#   ./scripts/jira-export-issue.sh --key SPJJOR-4196
#   ./scripts/jira-export-issue.sh --key SPJJOR-4196 --output docs/custom/
#   ./scripts/jira-export-issue.sh --key SPJJOR-4196 --include-subtasks

SCRIPT_DIR="$(dirname "$0")"
source "${SCRIPT_DIR}/common.sh"
require_jira_env

# ─────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────
ISSUE_KEY=""
OUTPUT_DIR="docs/jira"
INCLUDE_SUBTASKS=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --key)
            ISSUE_KEY="$2"
            shift 2
            ;;
        --output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --include-subtasks)
            INCLUDE_SUBTASKS=true
            shift
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") --key <ISSUE_KEY> [--output <DIR>] [--include-subtasks]"
            echo ""
            echo "Options:"
            echo "  --key <key>            Issue key, e.g., SPJJOR-4196 (required)"
            echo "  --output <dir>         Output directory (default: docs/jira)"
            echo "  --include-subtasks     Include a Subtasks section listing child issues"
            echo "  --help, -h             Show this help message"
            echo ""
            echo "Output: <dir>/<ISSUE_KEY>.md with YAML frontmatter"
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
    exit 1
fi

# ─────────────────────────────────────────────
# Check converter is available
# ─────────────────────────────────────────────
CONVERTER="${SCRIPT_DIR}/convert-jira-to-md.sh"
if [[ ! -x "$CONVERTER" ]]; then
    log_error "Converter not found or not executable: $CONVERTER"
    log_error "Ensure convert-jira-to-md.sh exists in the scripts directory."
    exit 1
fi

# ─────────────────────────────────────────────
# Fetch issue from Jira
# ─────────────────────────────────────────────
log_info "Fetching issue ${ISSUE_KEY} from Jira..."

FIELDS="summary,description,status,assignee,subtasks"
if ! RESPONSE=$(atlassian_get "${JIRA_BASE_URL}/rest/api/latest/issue/${ISSUE_KEY}?fields=${FIELDS}"); then
    log_error "Failed to fetch issue ${ISSUE_KEY}."
    exit 1
fi

# Extract fields
SUMMARY=$(echo "$RESPONSE" | jq -r '.fields.summary // ""')
DESCRIPTION=$(echo "$RESPONSE" | jq -r '.fields.description // ""')
STATUS=$(echo "$RESPONSE" | jq -r '.fields.status.name // ""')
ASSIGNEE=$(echo "$RESPONSE" | jq -r '.fields.assignee.displayName // "Unassigned"')

if [[ -z "$SUMMARY" || "$SUMMARY" == "null" ]]; then
    log_error "Could not extract issue summary from response."
    exit 1
fi

# Build source URL
SOURCE_URL="${JIRA_BASE_URL}/browse/${ISSUE_KEY}"

# ─────────────────────────────────────────────
# Convert description Wiki Markup → Markdown
# ─────────────────────────────────────────────
MD_DESCRIPTION=""
if [[ -n "$DESCRIPTION" && "$DESCRIPTION" != "null" ]]; then
    log_info "Converting Wiki Markup description to Markdown..."
    if ! MD_DESCRIPTION=$(echo "$DESCRIPTION" | "${CONVERTER}"); then
        log_warn "Failed to convert description to Markdown. Using raw text."
        MD_DESCRIPTION="$DESCRIPTION"
    fi
fi

# ─────────────────────────────────────────────
# Build subtasks section if requested
# ─────────────────────────────────────────────
SUBTASKS_SECTION=""
if [[ "$INCLUDE_SUBTASKS" == true ]]; then
    SUBTASK_COUNT=$(echo "$RESPONSE" | jq '.fields.subtasks | length')
    if [[ "$SUBTASK_COUNT" -gt 0 ]]; then
        SUBTASKS_SECTION=$(echo "$RESPONSE" | jq -r '
            "\n## Subtasks\n\n" +
            (.fields.subtasks | map(
                "- **\(.key)**: \(.fields.summary) [\(.fields.status.name)]"
            ) | join("\n"))
        ')
    fi
fi

# ─────────────────────────────────────────────
# Build output file with frontmatter
# ─────────────────────────────────────────────
EXPORTED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Create output directory if needed
mkdir -p "$OUTPUT_DIR"

OUTPUT_FILE="${OUTPUT_DIR}/${ISSUE_KEY}.md"

{
    echo "---"
    echo "key: \"${ISSUE_KEY}\""
    echo "summary: \"${SUMMARY}\""
    echo "status: \"${STATUS}\""
    echo "assignee: \"${ASSIGNEE}\""
    echo "source_url: \"${SOURCE_URL}\""
    echo "exported_at: \"${EXPORTED_AT}\""
    echo "---"
    echo ""
    echo "# ${SUMMARY}"
    echo ""
    if [[ -n "$MD_DESCRIPTION" ]]; then
        echo "$MD_DESCRIPTION"
    fi
    if [[ -n "$SUBTASKS_SECTION" ]]; then
        echo "$SUBTASKS_SECTION"
    fi
} > "$OUTPUT_FILE"

log_info "Exported to: ${OUTPUT_FILE}"

# Output file content to stdout for automated consumers (e.g., Copilot agent)
cat "$OUTPUT_FILE"
