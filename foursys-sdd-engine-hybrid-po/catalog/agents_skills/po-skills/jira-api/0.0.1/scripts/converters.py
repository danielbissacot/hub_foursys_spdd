#!/usr/bin/env python3
"""
converters.py — Bidirectional conversion between Jira Wiki Markup and Markdown.

Handles the most common formatting elements (~80% coverage):
- Headers, bold, italic, strikethrough
- Ordered and unordered lists
- Links, images
- Code blocks (inline and multi-line)
- Tables
- Blockquotes / panels

Limitations:
- Complex Jira macros ({color}, {anchor}, etc.) are stripped or simplified
- Nested tables are not supported
- Some edge cases with mixed formatting may not convert perfectly
"""

import re
from typing import List


# ───────────────────────────────────────────
# Jira Wiki Markup → Markdown
# ───────────────────────────────────────────

def jira_wiki_to_markdown(text: str) -> str:
    """Convert Jira Wiki Markup to Markdown.

    Args:
        text: Jira Wiki Markup string.

    Returns:
        Markdown string.
    """
    if not text:
        return ""

    lines = text.split("\n")
    result: List[str] = []
    in_code_block = False
    code_lang = ""
    in_noformat = False
    in_panel = False

    i = 0
    while i < len(lines):
        line = lines[i]

        # Code blocks: {code:language} ... {code}
        if not in_code_block and re.match(r"\{code(?::([^}]*))?\}", line):
            lang_match = re.search(r"\{code:(\w+)\}", line)
            code_lang = lang_match.group(1) if lang_match else ""
            in_code_block = True
            result.append(f"```{code_lang}")
            i += 1
            continue

        if in_code_block:
            if "{code}" in line:
                in_code_block = False
                code_lang = ""
                result.append("```")
            else:
                result.append(line)
            i += 1
            continue

        # Noformat blocks: {noformat} ... {noformat}
        if not in_noformat and line.strip().startswith("{noformat}"):
            in_noformat = True
            result.append("```")
            i += 1
            continue

        if in_noformat:
            if "{noformat}" in line:
                in_noformat = False
                result.append("```")
            else:
                result.append(line)
            i += 1
            continue

        # Panel blocks: {panel:title=...} → blockquote
        if line.strip().startswith("{panel"):
            in_panel = True
            title_match = re.search(r"title=([^|}]+)", line)
            if title_match:
                result.append(f"> **{title_match.group(1).strip()}**")
                result.append(">")
            i += 1
            continue

        if in_panel and "{panel}" in line:
            in_panel = False
            i += 1
            continue

        # Convert the line
        converted = _convert_wiki_line(line)
        if in_panel:
            converted = f"> {converted}"
        result.append(converted)
        i += 1

    return "\n".join(result)


def _convert_wiki_line(line: str) -> str:
    """Convert a single line of Jira Wiki Markup to Markdown."""
    # Headers: h1. → #, h2. → ##, etc.
    header_match = re.match(r"^h([1-6])\.\s*(.*)", line)
    if header_match:
        level = int(header_match.group(1))
        return "#" * level + " " + header_match.group(2)

    # Horizontal rule
    if line.strip() == "----":
        return "---"

    # Blockquote: bq.
    if line.startswith("bq. "):
        return "> " + line[4:]

    # Unordered lists: * → -, ** → (indented) -
    list_match = re.match(r"^(\*+)\s+(.*)", line)
    if list_match:
        depth = len(list_match.group(1)) - 1
        return "  " * depth + "- " + _convert_inline_wiki(list_match.group(2))

    # Ordered lists: # → 1., ## → (indented) 1.
    olist_match = re.match(r"^(#+)\s+(.*)", line)
    if olist_match:
        depth = len(olist_match.group(1)) - 1
        return "  " * depth + "1. " + _convert_inline_wiki(olist_match.group(2))

    # Table rows: || header || or | cell |
    if line.startswith("||"):
        # Header row
        cells = [c.strip() for c in line.split("||") if c.strip()]
        header = "| " + " | ".join(f"**{c}**" for c in cells) + " |"
        separator = "| " + " | ".join("---" for _ in cells) + " |"
        return header + "\n" + separator

    if line.startswith("|") and not line.startswith("||"):
        cells = [c.strip() for c in line.split("|") if c.strip()]
        return "| " + " | ".join(cells) + " |"

    return _convert_inline_wiki(line)


def _convert_inline_wiki(text: str) -> str:
    """Convert inline Jira Wiki Markup formatting to Markdown."""
    # Bold: *text* → **text**
    text = re.sub(r"(?<!\w)\*([^*\n]+)\*(?!\w)", r"**\1**", text)

    # Italic: _text_ → *text*
    text = re.sub(r"(?<!\w)_([^_\n]+)_(?!\w)", r"*\1*", text)

    # Strikethrough: -text- → ~~text~~
    text = re.sub(r"(?<!\w)-([^\s-][^-\n]*[^\s-])-(?!\w)", r"~~\1~~", text)

    # Monospace: {{text}} → `text`
    text = re.sub(r"\{\{([^}]+)\}\}", r"`\1`", text)

    # Links: [text|url] → [text](url) and [url] → [url](url)
    text = re.sub(r"\[([^|\]]+)\|([^\]]+)\]", r"[\1](\2)", text)
    text = re.sub(r"\[(https?://[^\]]+)\]", r"[\1](\1)", text)

    # Images: !image.png! → ![image](image.png)
    text = re.sub(r"!([^!\s]+)!", r"![\1](\1)", text)

    # Color macros: {color:red}text{color} → text
    text = re.sub(r"\{color:[^}]+\}([^{]*)\{color\}", r"\1", text)

    # Quote macro inline
    text = re.sub(r"\{quote\}", "", text)

    return text


# ───────────────────────────────────────────
# Markdown → Jira Wiki Markup
# ───────────────────────────────────────────

def markdown_to_jira_wiki(text: str) -> str:
    """Convert Markdown to Jira Wiki Markup.

    Args:
        text: Markdown string.

    Returns:
        Jira Wiki Markup string with proper spacing for readability.
    """
    if not text:
        return ""

    lines = text.split("\n")
    result: List[str] = []
    in_code_block = False
    code_lang = ""
    skip_next = False

    for i, line in enumerate(lines):
        if skip_next:
            skip_next = False
            continue

        # Code blocks: ```lang → {code:lang}
        code_match = re.match(r"^```(\w*)", line)
        if code_match and not in_code_block:
            code_lang = code_match.group(1)
            in_code_block = True
            if code_lang:
                result.append(f"{{code:{code_lang}}}")
            else:
                result.append("{noformat}")
            continue

        if in_code_block:
            if line.strip() == "```":
                in_code_block = False
                if code_lang:
                    result.append("{code}")
                else:
                    result.append("{noformat}")
                code_lang = ""
            else:
                result.append(line)
            continue

        converted = _convert_md_line(line)

        # Check if next line is a table separator (skip it)
        if i + 1 < len(lines) and re.match(r"^\|[\s\-:|]+\|$", lines[i + 1]):
            # This is a table header — convert to || format
            cells = [c.strip() for c in line.split("|") if c.strip()]
            result.append("|| " + " || ".join(cells) + " ||")
            skip_next = True
            continue

        result.append(converted)

    output = "\n".join(result)
    return _ensure_jira_spacing(output)


def _ensure_jira_spacing(text: str) -> str:
    """Add blank lines around structural elements for Jira readability.

    Jira Wiki renderer compresses whitespace, so explicit blank lines
    are needed to visually separate sections (headers, horizontal rules,
    and transitions between different content types).
    """
    lines = text.split("\n")
    result: List[str] = []
    in_code = False

    for i, line in enumerate(lines):
        stripped = line.strip()

        # Track code/noformat blocks — don't touch spacing inside them
        if re.match(r"^\{(code|noformat)", stripped):
            in_code = True
            # Blank line before code block if previous line is not blank
            if result and result[-1].strip():
                result.append("")
            result.append(line)
            continue
        if re.match(r"^\{(code|noformat)\}", stripped) and in_code:
            in_code = False
            result.append(line)
            # Blank line after code block
            result.append("")
            continue
        if in_code:
            result.append(line)
            continue

        is_header = re.match(r"^h[1-6]\.\s", stripped)
        is_rule = stripped == "----"

        # Blank line before headers (if prev line is not blank/start)
        if is_header and result and result[-1].strip():
            result.append("")

        result.append(line)

        # Blank line after headers and horizontal rules
        if is_header or is_rule:
            result.append("")

    # Collapse runs of 3+ blank lines into 2
    cleaned: List[str] = []
    blank_count = 0
    for line in result:
        if not line.strip():
            blank_count += 1
            if blank_count <= 2:
                cleaned.append(line)
        else:
            blank_count = 0
            cleaned.append(line)

    # Strip trailing blank lines
    while cleaned and not cleaned[-1].strip():
        cleaned.pop()

    return "\n".join(cleaned)


def _convert_md_line(line: str) -> str:
    """Convert a single Markdown line to Jira Wiki Markup."""
    # Headers: # → h1., ## → h2., etc.
    header_match = re.match(r"^(#{1,6})\s+(.*)", line)
    if header_match:
        level = len(header_match.group(1))
        return f"h{level}. {header_match.group(2)}"

    # Horizontal rule
    if re.match(r"^-{3,}$", line.strip()):
        return "----"

    # Blockquote
    if line.startswith("> "):
        return "bq. " + line[2:]

    # Unordered lists: - → *, indented → **
    list_match = re.match(r"^(\s*)[-*]\s+(.*)", line)
    if list_match:
        depth = len(list_match.group(1)) // 2 + 1
        return "*" * depth + " " + _convert_inline_md(list_match.group(2))

    # Ordered lists: 1. → #
    olist_match = re.match(r"^(\s*)\d+\.\s+(.*)", line)
    if olist_match:
        depth = len(olist_match.group(1)) // 2 + 1
        return "#" * depth + " " + _convert_inline_md(olist_match.group(2))

    # Table rows: | cell | → | cell |
    if line.startswith("|") and not re.match(r"^\|[\s\-:|]+\|$", line):
        return line  # Tables pass through (separator lines are handled in caller)

    return _convert_inline_md(line)


def _convert_inline_md(text: str) -> str:
    """Convert inline Markdown formatting to Jira Wiki Markup."""
    # Bold: **text** → *text* (use placeholder to avoid italic re-match)
    bold_placeholder = []
    def _bold_replace(m):
        idx = len(bold_placeholder)
        bold_placeholder.append(f"*{m.group(1)}*")
        return f"\x00BOLD{idx}\x00"
    text = re.sub(r"\*\*([^*\n]+)\*\*", _bold_replace, text)

    # Italic: *text* → _text_ (safe now — bold instances are placeholders)
    text = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"_\1_", text)

    # Restore bold placeholders
    for idx, val in enumerate(bold_placeholder):
        text = text.replace(f"\x00BOLD{idx}\x00", val)

    # Strikethrough: ~~text~~ → -text-
    text = re.sub(r"~~([^~\n]+)~~", r"-\1-", text)

    # Inline code: `text` → {{text}}
    text = re.sub(r"`([^`\n]+)`", r"{{\1}}", text)

    # Links: [text](url) → [text|url]
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"[\1|\2]", text)

    # Images: ![alt](url) → !url!
    text = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", r"!\2!", text)

    return text


# ───────────────────────────────────────────
# CLI entry point
# ───────────────────────────────────────────

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 3:
        print("Usage: python converters.py <direction> <file>", file=sys.stderr)
        print("  direction: wiki2md | md2wiki", file=sys.stderr)
        sys.exit(1)

    direction = sys.argv[1]
    filepath = sys.argv[2]

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if direction == "wiki2md":
        print(jira_wiki_to_markdown(content))
    elif direction == "md2wiki":
        print(markdown_to_jira_wiki(content))
    else:
        print(f"Unknown direction: {direction}. Use 'wiki2md' or 'md2wiki'.", file=sys.stderr)
        sys.exit(1)
