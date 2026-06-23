#!/bin/bash
# convert-jira-to-md.sh — Convert Jira Wiki Markup to Markdown
# Usage: ./convert-jira-to-md.sh <input.txt> [output.md]
#        cat input.txt | ./convert-jira-to-md.sh
#
# Comprehensive converter supporting:
#   Code blocks, noformat, headings, lists (nested/mixed), tables,
#   links, images, bold/italic/strikethrough/underline/super/subscript,
#   macros (info/tip/note/warning/quote/panel/expand),
#   inline code, blockquotes, horizontal rules, task lists,
#   emoticons/symbols, status macro, color stripping, line breaks.

set -euo pipefail

# ─────────────────────────────────────────────
# Input handling
# ─────────────────────────────────────────────
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    echo "Usage: $(basename "$0") <input.txt> [output.md]"
    echo "       cat input.txt | $(basename "$0")"
    echo ""
    echo "Converts Jira Wiki Markup to Markdown."
    echo "If output file is not specified, prints to stdout."
    exit 0
fi

TEMP_FILE=$(mktemp)
trap "rm -f '$TEMP_FILE' '${TEMP_FILE}.out'" EXIT

INPUT_FILE=""
OUTPUT_FILE=""

if [[ -n "${1:-}" && -f "$1" ]]; then
    INPUT_FILE="$1"
    OUTPUT_FILE="${2:-}"
    cp "$INPUT_FILE" "$TEMP_FILE"
elif [[ -n "${1:-}" && "$1" != "-" && ! -f "$1" ]]; then
    echo "Error: File not found: $1" >&2
    exit 1
else
    cat > "$TEMP_FILE"
fi

# ─────────────────────────────────────────────
# Main conversion — comprehensive single-pass awk
# ─────────────────────────────────────────────
awk '
# ─────────────────────────────────────────────
# Utility functions
# ─────────────────────────────────────────────
function ltrim(s) { sub(/^[[:space:]]+/, "", s); return s }
function rtrim(s) { sub(/[[:space:]]+$/, "", s); return s }
function trim(s)  { return rtrim(ltrim(s)) }

# Smart cell splitter: respects {}, [], and {{}} boundaries
# so that | inside macros/links is not treated as a cell delimiter.
function split_cells(row, cells,    _n, _i, _ch, _db, _dk, _cc) {
    _n = 0; _cc = ""; _db = 0; _dk = 0
    for (_i = 1; _i <= length(row); _i++) {
        _ch = substr(row, _i, 1)
        if (_ch == "{") _db++
        else if (_ch == "}") { if (_db > 0) _db-- }
        else if (_ch == "[") _dk++
        else if (_ch == "]") { if (_dk > 0) _dk-- }
        if (_ch == "|" && _db == 0 && _dk == 0) {
            _n++; cells[_n] = _cc; _cc = ""
        } else {
            _cc = _cc _ch
        }
    }
    if (_cc != "") { _n++; cells[_n] = _cc }
    return _n
}

# ─────────────────────────────────────────────
# Inline element conversion
# Applied to regular text lines, header text, table cells, etc.
# ─────────────────────────────────────────────
function convert_inline(line,    _a) {
    if (line == "") return ""

    # ── Inline code: {{code}} → `code` ──
    while (match(line, /\{\{([^}]+)\}\}/)) {
        line = substr(line, 1, RSTART-1) "`" substr(line, RSTART+2, RLENGTH-4) "`" substr(line, RSTART+RLENGTH)
    }

    # ── Three-part links: [text|url|tooltip] → [text](url "tooltip") ──
    while (match(line, /\[([^]|]+)\|([^]|]+)\|([^]]+)\]/, _a)) {
        line = substr(line, 1, RSTART-1) "[" _a[1] "](" _a[2] " \"" _a[3] "\")" substr(line, RSTART+RLENGTH)
    }

    # ── Two-part links: [text|url] → [text](url) ──
    while (match(line, /\[([^]|]+)\|([^]]+)\]/, _a)) {
        line = substr(line, 1, RSTART-1) "[" _a[1] "](" _a[2] ")" substr(line, RSTART+RLENGTH)
    }

    # Protect already-converted markdown links from plain link conversion
    gsub(/\]\(/, "JIRA2MD_LP", line)

    # ── Plain links: [url] → <url> ──
    while (match(line, /\[([^]]+)\]/)) {
        line = substr(line, 1, RSTART-1) "<" substr(line, RSTART+1, RLENGTH-2) ">" substr(line, RSTART+RLENGTH)
    }

    # Restore markdown link parentheses
    gsub(/JIRA2MD_LP/, "](", line)

    # ── Attachment links: [^file.pdf] → `file.pdf` (attachment) ──
    line = gensub(/\[\^([^]]+)\]/, "`\\1`", "g", line)

    # ── Images with alt text: !file|alt=text! → ![text](file) ──
    line = gensub(/!([^|!\n]+)\|alt=([^!\n]+)!/, "![\\2](\\1)", "g", line)

    # ── Images with other attrs: !file|attrs! → ![](file) ──
    line = gensub(/!([^|!\n]+)\|[^!\n]+!/, "![](\\1)", "g", line)

    # ── Simple images: !file.ext! → ![](file.ext) ──
    # Only match patterns that look like filenames or URLs
    line = gensub(/!([a-zA-Z][a-zA-Z0-9_.:\/%~-]*\.[a-zA-Z]{2,5})!/, "![](\\1)", "g", line)

    # ── Color macro: {color:x}text{color} → text (strip) ──
    gsub(/\{color:[^}]*\}/, "", line)
    gsub(/\{color\}/, "", line)

    # ── Status macro: {status:...title=X...} → **[X]** ──
    line = gensub(/\{status:[^}]*title=([^|}]+)[^}]*\}/, "**[\\1]**", "g", line)

    # ── Jira issue reference: {jira:KEY-123} → **KEY-123** ──
    line = gensub(/\{jira:([^|}]+)(\|[^}]*)?\}/, "**\\1**", "g", line)

    # ── Anchor macro: strip ──
    gsub(/\{anchor:[^}]*\}/, "", line)

    # ── TOC macro: strip ──
    gsub(/\{toc[^}]*\}/, "", line)

    # ── Excerpt macro: strip ──
    gsub(/\{excerpt[^}]*\}/, "", line)

    # ── Bold: *text* → **text** ──
    # Requires non-word boundary before opening * and after closing *
    line = gensub(/(^|[[:space:]({[,;:>])\*([^*\n]+)\*([[:space:])}\],.;:!?]|$)/, "\\1**\\2**\\3", "g", line)

    # ── Italic: _text_ → *text* ──
    # Avoid matching inside identifiers like some_variable_name
    line = gensub(/(^|[^a-zA-Z0-9])_([^_\n]+)_([^a-zA-Z0-9]|$)/, "\\1*\\2*\\3", "g", line)

    # ── Underline: +text+ → <u>text</u> ──
    line = gensub(/(^|[[:space:](])\+([^+\n]+)\+([ \t),.;:!?]|$)/, "\\1<u>\\2</u>\\3", "g", line)

    # ── Superscript: ^text^ → <sup>text</sup> ──
    line = gensub(/\^([^^\n]+)\^/, "<sup>\\1</sup>", "g", line)

    # ── Subscript: ~text~ → <sub>text</sub> ──
    # Must convert BEFORE strikethrough to avoid conflict with ~~
    line = gensub(/(^|[^~])~([^~\n]+)~([^~]|$)/, "\\1<sub>\\2</sub>\\3", "g", line)

    # ── Strikethrough: -text- → ~~text~~ ──
    # Require at least 2 chars, avoid matching dashes in URLs/dates
    line = gensub(/(^|[[:space:](])-([^- \t\n][^-\n]*[^- \t\n])-([ \t),.;:!?]|$)/, "\\1~~\\2~~\\3", "g", line)

    # ── Line breaks: \\ → <br> ──
    gsub(/\\\\/, "<br>", line)

    # ── Emoticons and symbols ──
    gsub(/\(\/\)/, "✅", line)
    gsub(/\(x\)/, "❌", line)
    gsub(/\(!\)/, "⚠️", line)
    gsub(/\(\?\)/, "❓", line)
    gsub(/\(i\)/, "ℹ️", line)
    gsub(/\(y\)/, "👍", line)
    gsub(/\(n\)/, "👎", line)
    gsub(/\(\*\)/, "⭐", line)
    gsub(/\(on\)/, "💡", line)
    gsub(/\(off\)/, "💡", line)
    gsub(/\(\+\)/, "➕", line)
    gsub(/\(-\)/, "➖", line)

    return line
}

# ─────────────────────────────────────────────
# Macro helpers
# ─────────────────────────────────────────────
function start_macro(type, params,    _title, _a) {
    macro_type = type
    if (type == "quote") {
        # No header, prefix lines with >
    } else if (type == "info") {
        print "> **ℹ️ Info:**"
        print ">"
    } else if (type == "tip") {
        print "> **💡 Tip:**"
        print ">"
    } else if (type == "note") {
        print "> **📝 Note:**"
        print ">"
    } else if (type == "warning") {
        print "> **⚠️ Warning:**"
        print ">"
    } else if (type == "panel") {
        _title = ""
        if (match(params, /title=([^|}]+)/, _a)) {
            _title = _a[1]
        }
        if (_title != "") {
            print "> **" _title "**"
            print ">"
        }
    } else if (type == "expand") {
        _title = "Details"
        if (match(params, /title=([^|}]+)/, _a)) {
            _title = _a[1]
        }
        print "<details>"
        print "<summary>" _title "</summary>"
        print ""
    }
}

function end_macro() {
    if (macro_type == "expand") {
        print ""
        print "</details>"
    }
    macro_type = ""
}

# ─────────────────────────────────────────────
# Initialize state
# ─────────────────────────────────────────────
BEGIN {
    in_code = 0
    in_noformat = 0
    macro_type = ""
    in_table = 0
}

# ─────────────────────────────────────────────
# Main processing — line by line
# ─────────────────────────────────────────────
{
    line = $0

    # ═══════════════════════════════════════════════
    # CODE BLOCKS: {code:lang}...{code}
    # Pass through content unchanged
    # ═══════════════════════════════════════════════
    if (in_code) {
        if (line ~ /^\{code(:[^}]*)?\}$/) {
            in_code = 0
            print "```"
        } else {
            print line
        }
        next
    }

    # Opening code block
    if (line ~ /^\{code(:[^}]*)?\}$/) {
        in_code = 1
        lang = ""
        if (match(line, /^\{code:([^}]+)\}$/, arr)) {
            params = arr[1]
            # Shorthand: {code:java}
            if (params !~ /=/) {
                lang = params
            }
            # Named parameter: {code:language=java|title=...}
            else if (match(params, /language=([^|} ]+)/, larr)) {
                lang = larr[1]
            }
        }
        printf "```%s\n", lang
        next
    }

    # ═══════════════════════════════════════════════
    # NOFORMAT BLOCKS: {noformat}...{noformat}
    # ═══════════════════════════════════════════════
    if (in_noformat) {
        if (line == "{noformat}") {
            in_noformat = 0
            print "```"
        } else {
            print line
        }
        next
    }

    if (line == "{noformat}") {
        in_noformat = 1
        print "```"
        next
    }

    # ═══════════════════════════════════════════════
    # MACRO CLOSING — check before opening to handle state
    # ═══════════════════════════════════════════════
    if (macro_type == "quote"   && line == "{quote}")   { end_macro(); next }
    if (macro_type == "info"    && line == "{info}")    { end_macro(); next }
    if (macro_type == "tip"     && line == "{tip}")     { end_macro(); next }
    if (macro_type == "note"    && line == "{note}")    { end_macro(); next }
    if (macro_type == "warning" && line == "{warning}") { end_macro(); next }
    if (macro_type == "panel"   && line == "{panel}")   { end_macro(); next }
    if (macro_type == "expand"  && line == "{expand}")  { end_macro(); next }

    # Inside a macro — prefix or pass through
    if (macro_type != "") {
        if (macro_type == "expand") {
            print convert_inline(line)
        } else {
            if (line == "") {
                print ">"
            } else {
                print "> " convert_inline(line)
            }
        }
        next
    }

    # ═══════════════════════════════════════════════
    # MACRO OPENING
    # ═══════════════════════════════════════════════
    if (line == "{quote}")   { start_macro("quote", "");   next }
    if (line == "{info}")    { start_macro("info", "");    next }
    if (line == "{tip}")     { start_macro("tip", "");     next }
    if (line == "{note}")    { start_macro("note", "");    next }
    if (line == "{warning}") { start_macro("warning", ""); next }

    if (line ~ /^\{panel(:[^}]*)?\}$/) {
        params = ""
        if (match(line, /^\{panel:([^}]*)\}$/, _arr)) params = _arr[1]
        start_macro("panel", params)
        next
    }

    if (line ~ /^\{expand(:[^}]*)?\}$/) {
        params = ""
        if (match(line, /^\{expand:([^}]*)\}$/, _arr)) params = _arr[1]
        start_macro("expand", params)
        next
    }

    # ═══════════════════════════════════════════════
    # HEADINGS: h1.-h6. → # through ######
    # ═══════════════════════════════════════════════
    if (match(line, /^h([1-6])\.[[:space:]]+(.+)$/, arr)) {
        level = arr[1] + 0
        text = arr[2]
        prefix = ""
        for (i = 1; i <= level; i++) prefix = prefix "#"
        print prefix " " convert_inline(text)
        next
    }

    # ═══════════════════════════════════════════════
    # TASK LISTS: [] unchecked, [x] checked
    # ═══════════════════════════════════════════════
    if (match(line, /^\[\][[:space:]]+(.+)$/, arr)) {
        print "- [ ] " convert_inline(arr[1])
        next
    }
    if (match(line, /^\[x\][[:space:]]+(.+)$/, arr)) {
        print "- [x] " convert_inline(arr[1])
        next
    }

    # ═══════════════════════════════════════════════
    # LISTS: *, **, #, ##, mixed (#*, *#, etc.)
    # Each char in prefix = one nesting level
    # Last char determines ordered (#) vs unordered (*)
    # ═══════════════════════════════════════════════
    if (match(line, /^([#*]+)[[:space:]]+(.+)$/, arr)) {
        lprefix = arr[1]
        text = arr[2]
        depth = length(lprefix)
        last_char = substr(lprefix, depth, 1)

        indent = ""
        for (i = 1; i < depth; i++) indent = indent "  "

        if (last_char == "#") {
            print indent "1. " convert_inline(text)
        } else {
            print indent "- " convert_inline(text)
        }
        next
    }

    # ═══════════════════════════════════════════════
    # TABLES
    # ═══════════════════════════════════════════════
    # Table header row: ||col1||col2||
    if (line ~ /^\|\|/) {
        # Replace || delimiters with | , preserving content inside {} and []
        # First, replace only the boundary || (not inside macros)
        tmp = line
        gsub(/\|\|/, "|", tmp)

        # Remove leading/trailing |
        inner = tmp
        sub(/^\|/, "", inner)
        sub(/\|$/, "", inner)

        n = split_cells(inner, cells)

        printf "|"
        for (i = 1; i <= n; i++) {
            printf " %s |", convert_inline(trim(cells[i]))
        }
        printf "\n"

        # Separator row
        printf "|"
        for (i = 1; i <= n; i++) printf " --- |"
        printf "\n"

        in_table = 1
        next
    }

    # Table data row: |cell1|cell2|
    if (line ~ /^\|[^|]/) {
        inner = line
        sub(/^\|/, "", inner)
        sub(/\|$/, "", inner)

        n = split_cells(inner, cells)

        printf "|"
        for (i = 1; i <= n; i++) {
            printf " %s |", convert_inline(trim(cells[i]))
        }
        printf "\n"

        in_table = 1
        next
    }

    # End of table — reset state
    if (in_table && line !~ /^\|/) {
        in_table = 0
    }

    # ═══════════════════════════════════════════════
    # BLOCKQUOTE: bq. text → > text
    # ═══════════════════════════════════════════════
    if (match(line, /^bq\.[[:space:]]+(.+)$/, arr)) {
        print "> " convert_inline(arr[1])
        next
    }

    # ═══════════════════════════════════════════════
    # HORIZONTAL RULE: ---- → ---
    # ═══════════════════════════════════════════════
    if (line ~ /^----+$/) {
        print "---"
        next
    }

    # ═══════════════════════════════════════════════
    # REGULAR LINE — apply inline conversions only
    # ═══════════════════════════════════════════════
    print convert_inline(line)
}
' "$TEMP_FILE" > "${TEMP_FILE}.out"

# ─────────────────────────────────────────────
# Output
# ─────────────────────────────────────────────
if [[ -z "$OUTPUT_FILE" ]]; then
    cat "${TEMP_FILE}.out"
else
    cp "${TEMP_FILE}.out" "$OUTPUT_FILE"
    echo "Converted file saved to: $OUTPUT_FILE" >&2
fi
