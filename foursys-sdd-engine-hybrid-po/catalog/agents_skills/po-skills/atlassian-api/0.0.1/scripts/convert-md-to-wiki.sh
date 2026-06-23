#!/bin/bash
# convert-md-to-wiki.sh — Convert Markdown to Confluence Wiki Markup
# Usage: ./convert-md-to-wiki.sh <input.md> [output.txt]
#        cat input.md | ./convert-md-to-wiki.sh
#
# Based on the same patterns as convert-md-to-jira.sh (Jira and Confluence
# Wiki Markup share the same notation).

set -euo pipefail

# ─────────────────────────────────────────────
# Input handling
# ─────────────────────────────────────────────
INPUT_FILE=""
OUTPUT_FILE=""

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    echo "Usage: $(basename "$0") <input.md> [output.txt]"
    echo "       cat input.md | $(basename "$0")"
    echo ""
    echo "Converts Markdown to Confluence Wiki Markup notation."
    echo "If output file is not specified, prints to stdout."
    exit 0
fi

TEMP_FILE=$(mktemp)
trap "rm -f '$TEMP_FILE' '${TEMP_FILE}.tmp'" EXIT

if [[ -n "${1:-}" && -f "$1" ]]; then
    INPUT_FILE="$1"
    OUTPUT_FILE="${2:-}"
    cp "$INPUT_FILE" "$TEMP_FILE"
elif [[ -n "${1:-}" && "$1" != "-" && ! -f "$1" ]]; then
    echo "Error: File not found: $1" >&2
    exit 1
else
    # Read from stdin
    cat > "$TEMP_FILE"
fi

# ─────────────────────────────────────────────
# Step 1: Convert code blocks with language specification
# ─────────────────────────────────────────────
awk '
BEGIN { in_code = 0 }
{
    line = $0
    if (line ~ /^```/) {
        if (in_code == 0) {
            in_code = 1
            match(line, /^```(.*)$/, arr)
            lang = arr[1]
            if (lang == "") {
                print "{code}"
            } else {
                print "{code:" lang "}"
            }
        } else {
            in_code = 0
            print "{code}"
        }
    } else {
        print line
    }
}
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 2: Convert inline code `code` → {{code}}
# ─────────────────────────────────────────────
sed -E 's/`([^`]+)`/{{\1}}/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 3: Convert links [text](url) → [text|url]
# ─────────────────────────────────────────────
sed -E 's/\[([^\]]+)\]\(([^)]+)\)/[\1|\2]/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 4: Convert bold **text** → *text*
# ─────────────────────────────────────────────
sed -E 's/\*\*([^*]+)\*\*/*\1*/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 5: Convert italic _text_ → _text_ (same in wiki markup)
# Markdown *text* already handled by bold step above
# ─────────────────────────────────────────────

# ─────────────────────────────────────────────
# Step 6: Convert strikethrough ~~text~~ → -text-
# ─────────────────────────────────────────────
sed -E 's/~~([^~]+)~~/-\1-/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 7: Convert tables — separator line → header with ||
# ─────────────────────────────────────────────
awk '
BEGIN { prev = ""; first = 1 }
{
    line = $0
    if (line ~ /^[|][-: |]+[|]$/) {
        # This is a table separator — previous line was header
        if (prev != "") {
            # Convert | to || for header row
            gsub(/[|]/, "||", prev)
            print prev
        }
        # Skip the separator line
        prev = ""
        first = 0
        next
    }

    if (!first) {
        print prev
    }
    first = 0
    prev = line
}
END {
    if (prev != "") print prev
}
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 8: Convert checkboxes (before general list conversion)
# ─────────────────────────────────────────────
sed -E 's/^[[:space:]]*-[[:space:]]*\[x\][[:space:]]/* (/) /g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
sed -E 's/^[[:space:]]*-[[:space:]]*\[[[:space:]]\][[:space:]]/* ( ) /g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 9: Convert unordered lists - item → * item
# ─────────────────────────────────────────────
sed -E 's/^[[:space:]]*-[[:space:]]+/* /g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 10: Convert ordered lists 1. item → # item
# ─────────────────────────────────────────────
sed -E 's/^[[:space:]]*[0-9]+\.[[:space:]]+/# /g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 11: Convert headers (largest to smallest)
# ─────────────────────────────────────────────
sed -E 's/^######[[:space:]]+(.+)$/h6. \1/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
sed -E 's/^#####[[:space:]]+(.+)$/h5. \1/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
sed -E 's/^####[[:space:]]+(.+)$/h4. \1/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
sed -E 's/^###[[:space:]]+(.+)$/h3. \1/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
sed -E 's/^##[[:space:]]+(.+)$/h2. \1/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
sed -E 's/^#[[:space:]]+(.+)$/h1. \1/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 12: Convert horizontal rules --- → ----
# ─────────────────────────────────────────────
sed -E 's/^---+$/----/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 13: Convert images ![alt](url) → !url!
# ─────────────────────────────────────────────
sed -E 's/!\[([^\]]*)\]\(([^)]+)\)/!\2!/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Output
# ─────────────────────────────────────────────
if [[ -z "$OUTPUT_FILE" ]]; then
    cat "$TEMP_FILE"
else
    cp "$TEMP_FILE" "$OUTPUT_FILE"
    echo "Converted file saved to: $OUTPUT_FILE" >&2
fi
