#!/bin/bash
# convert-html-to-md.sh — Convert Confluence HTML / Storage Format to Markdown
# Usage: cat page.html | ./convert-html-to-md.sh
#        ./convert-html-to-md.sh --file page.html
#
# Handles: headers, lists, links, code blocks, bold/italic, tables,
#          Confluence macros (ac:structured-macro), and layout divs.

set -euo pipefail

# ─────────────────────────────────────────────
# Input handling: stdin or --file
# ─────────────────────────────────────────────
INPUT=""

if [[ "${1:-}" == "--file" ]]; then
    if [[ -z "${2:-}" || ! -f "$2" ]]; then
        echo "Error: File not found: ${2:-}" >&2
        exit 1
    fi
    INPUT=$(cat "$2")
elif [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    echo "Usage: $(basename "$0") [--file <html_file>]"
    echo "       cat page.html | $(basename "$0")"
    echo ""
    echo "Converts Confluence HTML / Storage Format to Markdown."
    echo "Accepts input from stdin or --file argument."
    exit 0
elif [[ $# -eq 0 ]] || [[ "$1" == "-" ]]; then
    INPUT=$(cat)
else
    # Treat positional arg as file
    if [[ -f "$1" ]]; then
        INPUT=$(cat "$1")
    else
        echo "Error: File not found: $1" >&2
        exit 1
    fi
fi

if [[ -z "$INPUT" ]]; then
    exit 0
fi

TEMP_FILE=$(mktemp)
trap "rm -f '$TEMP_FILE' '${TEMP_FILE}.tmp'" EXIT

echo "$INPUT" > "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 1: Handle Confluence code macros FIRST
# Convert <ac:structured-macro ac:name="code"> blocks to ```lang ... ```
# ─────────────────────────────────────────────
awk '
BEGIN { in_macro = 0; lang = "" }
{
    line = $0

    # Detect code macro start
    if (line ~ /ac:structured-macro[^>]*ac:name="code"/) {
        in_macro = 1
        lang = ""
        # Try to extract language from same line or parameter
        if (match(line, /ac:name="language"[^>]*>([^<]+)</, arr)) {
            lang = arr[1]
        }
        next
    }

    # Extract language parameter inside macro
    if (in_macro && line ~ /ac:name="language"/) {
        if (match(line, />([^<]+)</, arr)) {
            lang = arr[1]
        }
        next
    }

    # Skip other macro parameters
    if (in_macro && line ~ /ac:parameter/) { next }

    # Detect CDATA start — begin code block output
    if (in_macro && line ~ /CDATA\[/) {
        printf "```%s\n", lang
        # Extract content after CDATA[
        sub(/.*CDATA\[/, "", line)
        # Check if ]]> is on same line
        if (line ~ /\]\]>/) {
            sub(/\]\]>.*/, "", line)
            print line
            print "```"
            in_macro = 0
        } else {
            if (line != "") print line
        }
        next
    }

    # Detect CDATA end
    if (in_macro && line ~ /\]\]>/) {
        sub(/\]\]>.*/, "", line)
        if (line != "") print line
        print "```"
        in_macro = 0
        next
    }

    # Inside CDATA — pass through as-is
    if (in_macro && line !~ /ac:plain-text-body|ac:structured-macro/) {
        print line
        next
    }

    # End of macro
    if (in_macro && line ~ /\/ac:structured-macro/) {
        in_macro = 0
        next
    }

    # Skip macro wrapper tags
    if (in_macro) { next }

    # Normal line
    print line
}
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 2: Convert <pre><code> blocks (non-macro)
# ─────────────────────────────────────────────
awk '
BEGIN { in_pre = 0 }
{
    line = $0
    if (line ~ /<pre[^>]*><code[^>]*>/) {
        in_pre = 1
        lang = ""
        if (match(line, /class="[^"]*language-([^"[:space:]]+)/, arr)) {
            lang = arr[1]
        }
        printf "```%s\n", lang
        sub(/.*<pre[^>]*><code[^>]*>/, "", line)
        if (line ~ /<\/code><\/pre>/) {
            sub(/<\/code><\/pre>.*/, "", line)
            if (line != "") print line
            print "```"
            in_pre = 0
        } else {
            if (line != "") print line
        }
        next
    }
    if (in_pre && line ~ /<\/code><\/pre>/) {
        sub(/<\/code><\/pre>.*/, "", line)
        if (line != "") print line
        print "```"
        in_pre = 0
        next
    }
    print line
}
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 3: Remove Confluence layout divs & wrappers
# ─────────────────────────────────────────────
sed -E '
    s/<ac:layout[^>]*>//g
    s/<\/ac:layout>//g
    s/<ac:layout-section[^>]*>//g
    s/<\/ac:layout-section>//g
    s/<ac:layout-cell[^>]*>//g
    s/<\/ac:layout-cell>//g
    s/<div[^>]*class="[^"]*contentLayout2[^"]*"[^>]*>//g
    s/<div[^>]*class="[^"]*columnLayout[^"]*"[^>]*>//g
    s/<div[^>]*>//g
    s/<\/div>//g
    s/<span[^>]*>//g
    s/<\/span>//g
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 4: Convert headers <h1-6> → # markdown
# ─────────────────────────────────────────────
sed -E '
    s/<h1[^>]*>(.*)<\/h1>/# \1/g
    s/<h2[^>]*>(.*)<\/h2>/## \1/g
    s/<h3[^>]*>(.*)<\/h3>/### \1/g
    s/<h4[^>]*>(.*)<\/h4>/#### \1/g
    s/<h5[^>]*>(.*)<\/h5>/##### \1/g
    s/<h6[^>]*>(.*)<\/h6>/###### \1/g
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 5: Convert links <a href="url">text</a> → [text](url)
# ─────────────────────────────────────────────
sed -E 's/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/[\2](\1)/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 6: Convert inline formatting
# ─────────────────────────────────────────────
sed -E '
    s/<strong>([^<]*)<\/strong>/**\1**/g
    s/<b>([^<]*)<\/b>/**\1**/g
    s/<em>([^<]*)<\/em>/*\1*/g
    s/<i>([^<]*)<\/i>/*\1*/g
    s/<code>([^<]*)<\/code>/`\1`/g
    s/<del>([^<]*)<\/del>/~~\1~~/g
    s/<s>([^<]*)<\/s>/~~\1~~/g
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 7: Convert lists
# ─────────────────────────────────────────────
# Replace list tags with markers, then clean up
sed -E '
    s/<ul[^>]*>/\n/g
    s/<\/ul>/\n/g
    s/<ol[^>]*>/\n/g
    s/<\/ol>/\n/g
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# Convert <li> to list items (unordered by default since we lost ul/ol context)
sed -E 's/<li[^>]*>(.*)<\/li>/- \1/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 8: Convert tables
# ─────────────────────────────────────────────
awk '
BEGIN { in_table = 0; in_thead = 0; col_count = 0 }
{
    line = $0

    if (line ~ /<table/) { in_table = 1; next }
    if (line ~ /<\/table/) { in_table = 0; next }
    if (line ~ /<thead/) { in_thead = 1; next }
    if (line ~ /<\/thead/) {
        in_thead = 0
        # Print separator after header
        if (col_count > 0) {
            sep = "|"
            for (i = 1; i <= col_count; i++) sep = sep " --- |"
            print sep
        }
        next
    }
    if (line ~ /<tbody/) { next }
    if (line ~ /<\/tbody/) { next }

    if (line ~ /<tr/) {
        row = "| "
        col_count_row = 0
        next
    }
    if (line ~ /<\/tr/) {
        printf "%s\n", row
        if (col_count == 0) col_count = col_count_row
        next
    }

    if (line ~ /<th[^>]*>/) {
        # Extract cell content
        gsub(/<th[^>]*>/, "", line)
        gsub(/<\/th>/, "", line)
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", line)
        row = row line " | "
        col_count_row++
        next
    }
    if (line ~ /<td[^>]*>/) {
        gsub(/<td[^>]*>/, "", line)
        gsub(/<\/td>/, "", line)
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", line)
        row = row line " | "
        col_count_row++
        next
    }

    print line
}
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 9: Convert paragraphs and line breaks
# ─────────────────────────────────────────────
sed -E '
    s/<p[^>]*>/\n/g
    s/<\/p>/\n/g
    s/<br[[:space:]]*\/?>/\n/g
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 10: Convert horizontal rules
# ─────────────────────────────────────────────
sed -E 's/<hr[^>]*>/\n---\n/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 11: Convert images
# ─────────────────────────────────────────────
sed -E 's/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/![\2](\1)/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"
sed -E 's/<img[^>]*src="([^"]*)"[^>]*\/?>/![](\1)/g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 12: Strip remaining HTML tags
# ─────────────────────────────────────────────
sed -E 's/<[^>]+>//g' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 13: Decode HTML entities
# ─────────────────────────────────────────────
sed -E '
    s/&amp;/\&/g
    s/&lt;/</g
    s/&gt;/>/g
    s/&quot;/"/g
    s/&#39;/'"'"'/g
    s/&nbsp;/ /g
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Step 14: Clean up extra blank lines (max 2 consecutive)
# ─────────────────────────────────────────────
awk '
/^[[:space:]]*$/ { blank++; if (blank <= 2) print ""; next }
{ blank = 0; print }
' "$TEMP_FILE" > "${TEMP_FILE}.tmp" && mv "${TEMP_FILE}.tmp" "$TEMP_FILE"

# ─────────────────────────────────────────────
# Output
# ─────────────────────────────────────────────
cat "$TEMP_FILE"
