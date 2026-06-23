#!/bin/bash
# convert-md-to-confluence.sh — Convert Markdown to Confluence Storage Format (XHTML)
# Usage: ./convert-md-to-confluence.sh <input.md>
#        cat input.md | ./convert-md-to-confluence.sh
#
# Produces XHTML suitable for Confluence REST API body.storage.value

set -euo pipefail

# ─────────────────────────────────────────────
# Input handling
# ─────────────────────────────────────────────
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    echo "Usage: $(basename "$0") <input.md>"
    echo "       cat input.md | $(basename "$0")"
    echo ""
    echo "Converts Markdown to Confluence Storage Format (XHTML)."
    echo "Output is suitable for the Confluence REST API body.storage.value."
    exit 0
fi

TEMP_FILE=$(mktemp)
trap "rm -f '$TEMP_FILE' '${TEMP_FILE}.tmp'" EXIT

if [[ -n "${1:-}" && -f "$1" ]]; then
    cp "$1" "$TEMP_FILE"
elif [[ -n "${1:-}" && "$1" != "-" && ! -f "$1" ]]; then
    echo "Error: File not found: $1" >&2
    exit 1
else
    cat > "$TEMP_FILE"
fi

# ─────────────────────────────────────────────
# Step 1: Convert code blocks ``` → <ac:structured-macro>
# Must be done first to protect content inside code blocks
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
            print "<ac:structured-macro ac:name=\"code\">"
            if (lang != "") {
                print "<ac:parameter ac:name=\"language\">" lang "</ac:parameter>"
            }
            print "<ac:plain-text-body><![CDATA["
        } else {
            in_code = 0
            print "]]></ac:plain-text-body>"
            print "</ac:structured-macro>"
        }
    } else {
        print line
    }
}
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 2: Escape HTML entities (outside CDATA blocks)
# ─────────────────────────────────────────────
awk '
BEGIN { in_cdata = 0 }
{
    if ($0 ~ /CDATA\[/) { in_cdata = 1 }
    if (in_cdata) {
        print $0
        if ($0 ~ /\]\]>/) { in_cdata = 0 }
    } else {
        gsub(/&/, "\\&amp;")
        # Dont double-escape entities we create later — we apply conversions after
        print $0
    }
}
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 3: Convert inline code `code` → <code>code</code>
# ─────────────────────────────────────────────
sed -E 's/`([^`]+)`/<code>\1<\/code>/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 4: Convert images ![alt](url) → <ac:image><ri:url ri:value="url"/></ac:image>
# ─────────────────────────────────────────────
sed -E 's/!\[([^\]]*)\]\(([^)]+)\)/<ac:image ac:alt="\1"><ri:url ri:value="\2"\/><\/ac:image>/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 5: Convert links [text](url) → <a href="url">text</a>
# ─────────────────────────────────────────────
sed -E 's/\[([^\]]+)\]\(([^)]+)\)/<a href="\2">\1<\/a>/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 6: Convert bold **text** → <strong>text</strong>
# ─────────────────────────────────────────────
sed -E 's/\*\*([^*]+)\*\*/<strong>\1<\/strong>/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 7: Convert italic *text* or _text_ → <em>text</em>
# ─────────────────────────────────────────────
sed -E 's/\*([^*]+)\*/<em>\1<\/em>/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
sed -E 's/_([^_]+)_/<em>\1<\/em>/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 8: Convert strikethrough ~~text~~ → <del>text</del>
# ─────────────────────────────────────────────
sed -E 's/~~([^~]+)~~/<del>\1<\/del>/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 9: Convert headers # → <h1> through <h6>
# ─────────────────────────────────────────────
sed -E 's/^######[[:space:]]+(.+)$/<h6>\1<\/h6>/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
sed -E 's/^#####[[:space:]]+(.+)$/<h5>\1<\/h5>/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
sed -E 's/^####[[:space:]]+(.+)$/<h4>\1<\/h4>/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
sed -E 's/^###[[:space:]]+(.+)$/<h3>\1<\/h3>/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
sed -E 's/^##[[:space:]]+(.+)$/<h2>\1<\/h2>/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
sed -E 's/^#[[:space:]]+(.+)$/<h1>\1<\/h1>/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 10: Convert horizontal rules --- → <hr/>
# ─────────────────────────────────────────────
sed -E 's/^---+$/<hr\/>/' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 11: Convert lists
# Process unordered (- item) and ordered (1. item) lists
# ─────────────────────────────────────────────
awk '
BEGIN { in_ul = 0; in_ol = 0; in_cdata = 0 }
{
    line = $0

    # Skip conversion inside CDATA blocks
    if (line ~ /CDATA\[/) { in_cdata = 1 }
    if (in_cdata) {
        print line
        if (line ~ /\]\]>/) { in_cdata = 0 }
        next
    }

    # Unordered list item
    if (line ~ /^[[:space:]]*- /) {
        if (!in_ul) { print "<ul>"; in_ul = 1 }
        sub(/^[[:space:]]*- /, "", line)
        print "<li>" line "</li>"
        next
    } else if (in_ul) {
        print "</ul>"
        in_ul = 0
    }

    # Ordered list item
    if (line ~ /^[[:space:]]*[0-9]+\. /) {
        if (!in_ol) { print "<ol>"; in_ol = 1 }
        sub(/^[[:space:]]*[0-9]+\. /, "", line)
        print "<li>" line "</li>"
        next
    } else if (in_ol) {
        print "</ol>"
        in_ol = 0
    }

    print line
}
END {
    if (in_ul) print "</ul>"
    if (in_ol) print "</ol>"
}
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 12: Convert tables
# ─────────────────────────────────────────────
awk '
BEGIN { in_table = 0; is_header = 1 }
{
    line = $0

    # Detect table row (starts with |)
    if (line ~ /^\|/) {
        # Skip separator line (| --- | --- |)
        if (line ~ /^[|][-: |]+[|]$/) {
            is_header = 0
            next
        }

        if (!in_table) {
            print "<table>"
            in_table = 1
            is_header = 1
        }

        print "<tr>"
        # Split cells by |
        n = split(line, cells, "|")
        for (i = 2; i < n; i++) {
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", cells[i])
            if (is_header) {
                print "<th>" cells[i] "</th>"
            } else {
                print "<td>" cells[i] "</td>"
            }
        }
        print "</tr>"
        next
    }

    # End of table
    if (in_table) {
        print "</table>"
        in_table = 0
        is_header = 1
    }

    print line
}
END {
    if (in_table) print "</table>"
}
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 13: Wrap remaining plain text lines in <p> tags
# Skip lines that are already HTML, blank, or inside macros
# ─────────────────────────────────────────────
awk '
BEGIN { in_cdata = 0; in_macro = 0 }
{
    line = $0
    if (line ~ /CDATA\[/) { in_cdata = 1 }
    if (line ~ /\]\]>/) { in_cdata = 0; print line; next }
    if (in_cdata) { print line; next }
    if (line ~ /^</) { print line; next }
    if (line ~ /^[[:space:]]*$/) { print line; next }
    # Wrap in paragraph
    print "<p>" line "</p>"
}
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 14: Remove empty lines for cleaner output
# ─────────────────────────────────────────────
sed '/^[[:space:]]*$/d' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Output
# ─────────────────────────────────────────────
cat "$TEMP_FILE"
