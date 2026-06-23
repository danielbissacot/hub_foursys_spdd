#!/bin/bash

# Script to convert Markdown syntax to Jira text syntax
# Usage: ./convert-md-to-jira.sh <input-file.md> [output-file.txt]
# If output file is not specified, it will print to stdout

INPUT_FILE="$1"
OUTPUT_FILE="$2"

if [ -z "$INPUT_FILE" ]; then
    echo "Usage: $0 <input-file.md> [output-file.txt]"
    echo "Example: $0 user-story.md user-story-jira.txt"
    exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file '$INPUT_FILE' not found"
    exit 1
fi

# Create a temporary file for intermediate processing
TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT

# Copy input to temp file
cp "$INPUT_FILE" "$TEMP_FILE"

# Step 1: Convert code blocks with language specification
awk '
BEGIN { in_code = 0; lang = ""; }
{
    line = $0;
    if (line ~ /^```/) {
        if (in_code == 0) {
            # Starting code block
            in_code = 1;
            match(line, /^```(.*)$/, arr);
            lang = arr[1];
            if (lang == "") {
                print "{code}";
            } else {
                print "{code:" lang "}";
            }
        } else {
            # Ending code block
            in_code = 0;
            print "{code}";
        }
    } else {
        print line;
    }
}
' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"

# Step 2: Convert inline code from `code` to {{code}}
sed -E 's/`([^`]+)`/{{\1}}/g' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"

# Step 3: Convert links from [text](url) to [text|url]
sed -E 's/\[([^\]]+)\]\(([^)]+)\)/[\1|\2]/g' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"

# Step 4: Convert bold from **text** to *text*
sed -E 's/\*\*([^*]+)\*\*/*\1*/g' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"

# Step 5: Convert tables - detect separator line and convert previous line's pipes
awk '
BEGIN { prev = ""; first = 1; }
{
    line = $0;
    if (line ~ /^[|][-: |]+[|]$/) {
        # This is a table separator, previous line was header
        if (prev != "") {
            # Convert all | to || for header
            gsub(/[|]/, "||", prev);
            print prev;
        }
        # Skip the separator line
        prev = "";
        first = 0;
        next;
    }
    
    # Print previous line if exists
    if (!first) {
        print prev;
    }
    first = 0;
    
    # Save current line
    prev = line;
}
END {
    if (prev != "") {
        print prev;
    }
}
' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"

# Step 6: Convert checkboxes (must be before general list conversion)
sed -E 's/^[[:space:]]*-[[:space:]]*\[x\][[:space:]]/* [x] /g' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"
sed -E 's/^[[:space:]]*-[[:space:]]*\[[[:space:]]\][[:space:]]/* [ ] /g' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"

# Step 7: Convert unordered lists from - to *
sed -E 's/^[[:space:]]*-[[:space:]]+/* /g' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"

# Step 8: Convert headers (must be done in order from largest to smallest to avoid conflicts)
sed -E 's/^######[[:space:]]+(.+)$/h6. \1/' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"
sed -E 's/^#####[[:space:]]+(.+)$/h5. \1/' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"
sed -E 's/^####[[:space:]]+(.+)$/h4. \1/' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"
sed -E 's/^###[[:space:]]+(.+)$/h3. \1/' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"
sed -E 's/^##[[:space:]]+(.+)$/h2. \1/' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"
sed -E 's/^#[[:space:]]+(.+)$/h1. \1/' "$TEMP_FILE" > "$TEMP_FILE.tmp" && mv "$TEMP_FILE.tmp" "$TEMP_FILE"

# Output result
if [ -z "$OUTPUT_FILE" ]; then
    cat "$TEMP_FILE"
else
    cp "$TEMP_FILE" "$OUTPUT_FILE"
    echo "Converted file saved to: $OUTPUT_FILE"
fi
