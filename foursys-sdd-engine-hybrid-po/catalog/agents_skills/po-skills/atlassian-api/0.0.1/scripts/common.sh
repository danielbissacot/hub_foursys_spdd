#!/bin/bash
# common.sh — Shared functions for Atlassian API scripts
# Source this file in other scripts: source "$(dirname "$0")/common.sh"

set -euo pipefail

# ─────────────────────────────────────────────
# Color output helpers
# ─────────────────────────────────────────────
_RED='\033[0;31m'
_GREEN='\033[0;32m'
_YELLOW='\033[0;33m'
_NC='\033[0m' # No Color

# Disable colors when stderr is not a terminal (e.g., piped, run by agent)
if [[ ! -t 2 ]]; then
    _RED='' _GREEN='' _YELLOW='' _NC=''
fi

log_info()  { echo -e "${_GREEN}[INFO]${_NC} $*" >&2; }
log_warn()  { echo -e "${_YELLOW}[WARN]${_NC} $*" >&2; }
log_error() { echo -e "${_RED}[ERROR]${_NC} $*" >&2; }

# ─────────────────────────────────────────────
# Dependency checks
# ─────────────────────────────────────────────
check_dependencies() {
    local missing=()
    for cmd in curl jq; do
        if ! command -v "$cmd" &>/dev/null; then
            missing+=("$cmd")
        fi
    done
    if [[ ${#missing[@]} -gt 0 ]]; then
        log_error "Missing required dependencies: ${missing[*]}"
        log_error "Install them with your package manager:"
        log_error "  macOS:  brew install ${missing[*]}"
        log_error "  Ubuntu: sudo apt-get install ${missing[*]}"
        exit 1
    fi
}

# ─────────────────────────────────────────────
# Environment variable validation
# ─────────────────────────────────────────────

# Validate Confluence-specific env vars
require_confluence_env() {
    # Apply defaults if not overridden
    CONFLUENCE_BASE_URL="${CONFLUENCE_BASE_URL:-https://confluence.bradesco.com.br:8443}"

    local missing=()
    [[ -z "${ATLASSIAN_TOKEN:-}" ]]     && missing+=("ATLASSIAN_TOKEN")
    if [[ ${#missing[@]} -gt 0 ]]; then
        log_error "Missing required environment variables: ${missing[*]}"
        log_error ""
        log_error "Configure them before using Confluence scripts:"
        log_error "  export ATLASSIAN_TOKEN=\"your-personal-access-token\""
        log_error ""
        log_error "Optionally override the default base URL:"
        log_error "  export CONFLUENCE_BASE_URL=\"https://confluence.bradesco.com.br:8443\""
        exit 1
    fi
}

# Validate Jira-specific env vars
require_jira_env() {
    # Apply defaults if not overridden
    JIRA_BASE_URL="${JIRA_BASE_URL:-https://jira.bradesco.com.br:8443}"

    local missing=()
    [[ -z "${ATLASSIAN_TOKEN:-}" ]] && missing+=("ATLASSIAN_TOKEN")
    if [[ ${#missing[@]} -gt 0 ]]; then
        log_error "Missing required environment variables: ${missing[*]}"
        log_error ""
        log_error "Configure them before using Jira scripts:"
        log_error "  export ATLASSIAN_TOKEN=\"your-personal-access-token\""
        log_error ""
        log_error "Optionally override the default base URL:"
        log_error "  export JIRA_BASE_URL=\"https://jira.bradesco.com.br:8443\""
        exit 1
    fi
}

# ─────────────────────────────────────────────
# Authentication — Bearer Token (PAT)
# ─────────────────────────────────────────────
# Returns curl auth flags. Usage:
#   curl $(atlassian_auth) ...
atlassian_auth() {
    # Use -s to suppress progress, bearer token for PAT authentication
    echo "-s -H \"Authorization: Bearer ${ATLASSIAN_TOKEN}\""
}

# ─────────────────────────────────────────────
# HTTP request helper with error handling
# ─────────────────────────────────────────────
# Usage: atlassian_request <method> <url> [curl_extra_args...]
# Performs the HTTP request and handles common error codes.
# Returns the response body on success (exit 0).
# On failure, prints error message and exits with 1.
atlassian_request() {
    local method="$1"
    shift
    local url="$1"
    shift

    local tmp_body
    tmp_body=$(mktemp)
    local tmp_headers
    tmp_headers=$(mktemp)
    trap "rm -f '$tmp_body' '$tmp_headers'" RETURN

    # Execute curl — never print credentials (use -s, avoid -v)
    local http_code
    http_code=$(curl -s \
        -H "Authorization: Bearer ${ATLASSIAN_TOKEN}" \
        -X "$method" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -w "%{http_code}" \
        -o "$tmp_body" \
        -D "$tmp_headers" \
        "$@" \
        "$url" 2>/dev/null)

    # Handle HTTP status codes
    case "$http_code" in
        2[0-9][0-9])
            # Success (200, 201, 204, etc.)
            cat "$tmp_body"
            return 0
            ;;
        401)
            log_error "Authentication failed (401). Check ATLASSIAN_TOKEN."
            return 1
            ;;
        403)
            log_error "Permission denied (403). The user does not have access to this resource."
            return 1
            ;;
        404)
            log_error "Resource not found (404): $url"
            return 1
            ;;
        409)
            log_error "Conflict (409). The resource may already exist or there is a version conflict."
            cat "$tmp_body" >&2
            return 1
            ;;
        429)
            log_error "Rate limited (429). Wait a moment and try again."
            return 1
            ;;
        *)
            log_error "HTTP $http_code from $method $url"
            cat "$tmp_body" >&2
            return 1
            ;;
    esac
}

# Convenience wrappers
atlassian_get() {
    atlassian_request GET "$@"
}

atlassian_post() {
    local url="$1"
    shift
    atlassian_request POST "$url" "$@"
}

atlassian_put() {
    local url="$1"
    shift
    atlassian_request PUT "$url" "$@"
}

# ─────────────────────────────────────────────
# Utility: slugify a string for filenames
# ─────────────────────────────────────────────
slugify() {
    echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g'
}

# ─────────────────────────────────────────────
# Auto-check dependencies on source
# ─────────────────────────────────────────────
check_dependencies
