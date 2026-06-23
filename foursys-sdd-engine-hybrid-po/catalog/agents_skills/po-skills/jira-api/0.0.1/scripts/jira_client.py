#!/usr/bin/env python3
"""
jira_client.py — Jira REST API client using only Python stdlib.

Provides JiraClient class for interacting with Jira Data Center instances.
Authentication via Bearer PAT (Personal Access Token).

Environment variables:
    ATLASSIAN_TOKEN  — Personal Access Token (required)
    JIRA_BASE_URL    — Base URL (default: https://jira.bradesco.com.br:8443)
    JIRA_SSL_VERIFY  — Set to "true" to enable SSL verification (default: disabled)
"""

import json
import os
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional


class JiraClientError(Exception):
    """Base exception for JiraClient errors."""

    def __init__(self, message: str, status_code: int = 0, response_body: str = ""):
        super().__init__(message)
        self.status_code = status_code
        self.response_body = response_body


class JiraClient:
    """Jira Data Center REST API client.

    Uses only Python stdlib (urllib, json, ssl). No external dependencies.

    Usage:
        client = JiraClient()
        issue = client.get_issue("PROJ-123")
        results = client.search("project = PROJ AND status = 'In Progress'")
    """

    def __init__(
        self,
        base_url: Optional[str] = None,
        token: Optional[str] = None,
        ssl_verify: Optional[bool] = None,
    ):
        self.base_url = (
            base_url
            or os.environ.get("JIRA_BASE_URL", "https://jira.bradesco.com.br:8443")
        ).rstrip("/")

        self.token = token or os.environ.get("ATLASSIAN_TOKEN", "")
        if not self.token:
            raise JiraClientError(
                "ATLASSIAN_TOKEN not set. Export it before using JiraClient:\n"
                '  export ATLASSIAN_TOKEN="your-personal-access-token"'
            )

        if ssl_verify is not None:
            self._ssl_verify = ssl_verify
        else:
            self._ssl_verify = os.environ.get("JIRA_SSL_VERIFY", "false").lower() == "true"

        self._ssl_context = self._create_ssl_context()

    def _create_ssl_context(self) -> ssl.SSLContext:
        """Create SSL context. Disables verification by default for self-hosted instances."""
        if self._ssl_verify:
            return ssl.create_default_context()
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        return ctx

    def _request(
        self,
        method: str,
        path: str,
        body: Optional[Dict] = None,
        query_params: Optional[Dict] = None,
    ) -> Any:
        """Execute an HTTP request against the Jira API.

        Args:
            method: HTTP method (GET, POST, PUT, DELETE).
            path: API path (e.g., /rest/api/latest/issue/PROJ-123).
            body: JSON body for POST/PUT requests.
            query_params: URL query parameters.

        Returns:
            Parsed JSON response, or None for 204 No Content.

        Raises:
            JiraClientError: On HTTP errors or connection failures.
        """
        url = f"{self.base_url}{path}"
        if query_params:
            filtered = {k: v for k, v in query_params.items() if v is not None}
            if filtered:
                url += "?" + urllib.parse.urlencode(filtered)

        data = None
        if body is not None:
            data = json.dumps(body).encode("utf-8")

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

        req = urllib.request.Request(url, data=data, headers=headers, method=method)

        try:
            with urllib.request.urlopen(req, context=self._ssl_context) as resp:
                if resp.status == 204:
                    return None
                raw = resp.read().decode("utf-8")
                return json.loads(raw) if raw.strip() else None
        except urllib.error.HTTPError as e:
            response_body = ""
            try:
                response_body = e.read().decode("utf-8")
            except Exception:
                pass
            error_msg = self._format_http_error(e.code, method, url, response_body)
            raise JiraClientError(error_msg, status_code=e.code, response_body=response_body)
        except urllib.error.URLError as e:
            raise JiraClientError(f"Connection failed to {self.base_url}: {e.reason}")

    @staticmethod
    def _format_http_error(code: int, method: str, url: str, body: str) -> str:
        """Format a human-readable error message for HTTP errors."""
        messages = {
            400: "Bad Request — check your JQL, required fields, or issue type.",
            401: "Authentication failed — check ATLASSIAN_TOKEN.",
            403: "Permission denied — user lacks access to this resource.",
            404: "Resource not found.",
            409: "Conflict — resource may already exist or version mismatch.",
            429: "Rate limited — wait a moment and try again.",
        }
        msg = messages.get(code, f"HTTP {code}")
        detail = ""
        if body:
            try:
                parsed = json.loads(body)
                errors = parsed.get("errorMessages", [])
                field_errors = parsed.get("errors", {})
                if errors:
                    detail = "; ".join(errors)
                if field_errors:
                    detail += (" | " if detail else "") + "; ".join(
                        f"{k}: {v}" for k, v in field_errors.items()
                    )
            except (json.JSONDecodeError, AttributeError):
                detail = body[:200]
        return f"{msg} [{method} {url}]" + (f"\n  Detail: {detail}" if detail else "")

    # ───────────────────────────────────────────
    # Issues — Read
    # ───────────────────────────────────────────

    def get_issue(
        self,
        key: str,
        fields: Optional[str] = None,
        expand: Optional[str] = None,
    ) -> Dict:
        """Get a Jira issue by key.

        Args:
            key: Issue key (e.g., PROJ-123).
            fields: Comma-separated field names (default: summary,description,status,assignee).
            expand: Comma-separated expand values (e.g., renderedFields,changelog).

        Returns:
            Issue dict with id, key, self, fields.
        """
        params = {}
        if fields:
            params["fields"] = fields
        if expand:
            params["expand"] = expand
        return self._request("GET", f"/rest/api/latest/issue/{key}", query_params=params)

    def search(
        self,
        jql: str,
        fields: Optional[List[str]] = None,
        max_results: int = 50,
        start_at: int = 0,
    ) -> Dict:
        """Search issues using JQL.

        Args:
            jql: JQL query string.
            fields: List of field names to return. None returns all fields.
            max_results: Maximum number of results (default: 50).
            start_at: Pagination offset (default: 0).

        Returns:
            Search result dict with startAt, maxResults, total, issues.
        """
        body: Dict[str, Any] = {
            "jql": jql,
            "maxResults": max_results,
            "startAt": start_at,
        }
        if fields:
            body["fields"] = fields
        return self._request("POST", "/rest/api/latest/search", body=body)

    def search_all(
        self,
        jql: str,
        fields: Optional[List[str]] = None,
        page_size: int = 50,
    ) -> List[Dict]:
        """Search all issues matching JQL, handling pagination automatically.

        Args:
            jql: JQL query string.
            fields: List of field names to return.
            page_size: Number of results per page.

        Returns:
            List of all matching issue dicts.
        """
        all_issues: List[Dict] = []
        start_at = 0
        while True:
            result = self.search(jql, fields=fields, max_results=page_size, start_at=start_at)
            issues = result.get("issues", [])
            all_issues.extend(issues)
            total = result.get("total", 0)
            if len(all_issues) >= total or not issues:
                break
            start_at += len(issues)
        return all_issues

    # ───────────────────────────────────────────
    # Issues — Write
    # ───────────────────────────────────────────

    def create_issue(
        self,
        project: str,
        issue_type: str,
        summary: str,
        description: Optional[str] = None,
        parent: Optional[str] = None,
        extra_fields: Optional[Dict] = None,
    ) -> Dict:
        """Create a new Jira issue.

        Args:
            project: Project key (e.g., PROJ).
            issue_type: Issue type name (Story, Task, Bug, Sub-task).
            summary: Issue summary/title.
            description: Issue description in Jira Wiki Markup.
            parent: Parent issue key (for Sub-task type).
            extra_fields: Additional fields dict to merge.

        Returns:
            Created issue dict with id, key, self.
        """
        fields: Dict[str, Any] = {
            "project": {"key": project},
            "issuetype": {"name": issue_type},
            "summary": summary,
        }
        if description:
            fields["description"] = description
        if parent:
            fields["parent"] = {"key": parent}
        if extra_fields:
            fields.update(extra_fields)

        return self._request("POST", "/rest/api/latest/issue", body={"fields": fields})

    def update_issue(self, key: str, fields: Optional[Dict] = None, update: Optional[Dict] = None) -> None:
        """Update an existing Jira issue.

        Args:
            key: Issue key (e.g., PROJ-123).
            fields: Fields to set (e.g., {"description": "new desc"}).
            update: Update operations (e.g., {"labels": [{"add": "my-label"}]}).
        """
        body: Dict[str, Any] = {}
        if fields:
            body["fields"] = fields
        if update:
            body["update"] = update
        if not body:
            raise JiraClientError("Either 'fields' or 'update' must be provided.")
        self._request("PUT", f"/rest/api/latest/issue/{key}", body=body)

    # ───────────────────────────────────────────
    # Issues — Transitions
    # ───────────────────────────────────────────

    def get_transitions(self, key: str) -> List[Dict]:
        """Get available transitions for an issue.

        Args:
            key: Issue key.

        Returns:
            List of transition dicts with id, name, to.
        """
        result = self._request("GET", f"/rest/api/latest/issue/{key}/transitions")
        return result.get("transitions", [])

    def transition_issue(self, key: str, status: str) -> None:
        """Transition an issue to a new status.

        Finds the matching transition by name (case-insensitive) and executes it.

        Args:
            key: Issue key.
            status: Target status name (e.g., "In Progress", "Done").

        Raises:
            JiraClientError: If no matching transition is found.
        """
        transitions = self.get_transitions(key)
        status_lower = status.lower()

        # Match by transition name or target status name
        match = None
        for t in transitions:
            if t["name"].lower() == status_lower:
                match = t
                break
            if t.get("to", {}).get("name", "").lower() == status_lower:
                match = t
                break

        if not match:
            available = ", ".join(
                f"{t['name']} → {t.get('to', {}).get('name', '?')}" for t in transitions
            )
            raise JiraClientError(
                f"No transition to '{status}' found for {key}.\n"
                f"  Available transitions: {available}"
            )

        self._request(
            "POST",
            f"/rest/api/latest/issue/{key}/transitions",
            body={"transition": {"id": match["id"]}},
        )

    # ───────────────────────────────────────────
    # Issues — Export
    # ───────────────────────────────────────────

    def export_issue_markdown(self, key: str, issue_data: Optional[Dict] = None) -> str:
        """Export a Jira issue as Markdown.

        Fetches the issue with common fields and converts to a readable Markdown document.
        If issue_data is provided, skips the API call and uses the pre-fetched data.

        Args:
            key: Issue key.
            issue_data: Optional pre-fetched issue dict (avoids extra API call).

        Returns:
            Markdown string with issue details.
        """
        from scripts.converters import jira_wiki_to_markdown

        if issue_data is None:
            issue_data = self.get_issue(
                key,
                fields="summary,description,status,assignee,issuetype,priority,components,labels,subtasks,created,updated",
            )
        f = issue_data.get("fields", {})

        lines = [f"# {issue_data['key']}: {f.get('summary', 'No summary')}"]
        lines.append("")

        # Metadata table
        lines.append("| Field | Value |")
        lines.append("|-------|-------|")
        lines.append(f"| **Type** | {_nested(f, 'issuetype', 'name') or 'N/A'} |")
        lines.append(f"| **Status** | {_nested(f, 'status', 'name') or 'N/A'} |")
        lines.append(f"| **Priority** | {_nested(f, 'priority', 'name') or 'N/A'} |")
        lines.append(f"| **Assignee** | {_nested(f, 'assignee', 'displayName') or 'Unassigned'} |")

        components = [c["name"] for c in f.get("components", [])]
        if components:
            lines.append(f"| **Components** | {', '.join(components)} |")

        labels = f.get("labels", [])
        if labels:
            lines.append(f"| **Labels** | {', '.join(labels)} |")

        lines.append(f"| **Created** | {f.get('created', 'N/A')} |")
        lines.append(f"| **Updated** | {f.get('updated', 'N/A')} |")
        lines.append("")

        # Description
        desc = f.get("description", "")
        if desc:
            lines.append("## Description")
            lines.append("")
            lines.append(jira_wiki_to_markdown(desc))
            lines.append("")

        # Subtasks
        subtasks = f.get("subtasks", [])
        if subtasks:
            lines.append("## Subtasks")
            lines.append("")
            for st in subtasks:
                st_status = _nested(st, "fields", "status", "name")
                checkbox = "x" if st_status and st_status.lower() == "done" else " "
                lines.append(f"- [{checkbox}] **{st['key']}**: {st['fields']['summary']} ({st_status or 'N/A'})")
            lines.append("")

        return "\n".join(lines)

    def export_issues_markdown(self, keys: List[str]) -> Dict[str, str]:
        """Export multiple Jira issues as Markdown (batch).

        Fetches all issues in a single JQL query, then converts each one.
        Avoids N+1 API calls compared to calling export_issue_markdown per issue.

        Args:
            keys: List of issue keys (e.g., ["PROJ-1", "PROJ-2"]).

        Returns:
            Dict mapping issue key to Markdown string.
        """
        if not keys:
            return {}

        # Fetch all issues in one JQL call
        jql = f"key in ({','.join(keys)})"
        issues = self.search_all(
            jql,
            fields=["summary", "description", "status", "assignee", "issuetype",
                     "priority", "components", "labels", "subtasks", "created", "updated"],
        )

        result: Dict[str, str] = {}
        for issue in issues:
            key = issue["key"]
            result[key] = self.export_issue_markdown(key, issue_data=issue)
        return result

    # ───────────────────────────────────────────
    # Agile — Boards & Sprints
    # ───────────────────────────────────────────

    def list_boards(
        self,
        board_type: Optional[str] = None,
        project: Optional[str] = None,
        max_results: int = 50,
        start_at: int = 0,
    ) -> Dict:
        """List Jira boards.

        Args:
            board_type: Filter by type (scrum, kanban).
            project: Filter by project key.
            max_results: Maximum results.
            start_at: Pagination offset.

        Returns:
            Dict with maxResults, startAt, total, isLast, values (list of boards).
        """
        params: Dict[str, Any] = {
            "maxResults": max_results,
            "startAt": start_at,
        }
        if board_type:
            params["type"] = board_type
        if project:
            params["projectKeyOrId"] = project
        return self._request("GET", "/rest/agile/1.0/board", query_params=params)

    def list_sprints(
        self,
        board_id: int,
        state: Optional[str] = None,
        max_results: int = 50,
        start_at: int = 0,
    ) -> Dict:
        """List sprints for a board.

        Args:
            board_id: Board ID.
            state: Filter by state (active, future, closed).
            max_results: Maximum results.
            start_at: Pagination offset.

        Returns:
            Dict with maxResults, startAt, isLast, values (list of sprints).
        """
        params: Dict[str, Any] = {
            "maxResults": max_results,
            "startAt": start_at,
        }
        if state:
            params["state"] = state
        return self._request(
            "GET", f"/rest/agile/1.0/board/{board_id}/sprint", query_params=params
        )

    _DEFAULT_SPRINT_FIELDS = ["summary", "status", "assignee", "issuetype", "priority", "customfield_10016"]

    def sprint_report(
        self,
        sprint_id: int,
        fields: Optional[List[str]] = None,
        max_results: int = 100,
    ) -> Dict:
        """Generate a sprint status report.

        Fetches sprint metadata and all issues, grouped by status.

        Args:
            sprint_id: Sprint ID.
            fields: List of issue field names (default: summary, status, assignee, issuetype, priority, customfield_10016).
            max_results: Maximum issues per page.

        Returns:
            Dict with sprint (metadata), summary (counts), issuesByStatus (grouped issues).
        """
        fields_str = ",".join(fields or self._DEFAULT_SPRINT_FIELDS)

        # Fetch sprint metadata
        sprint_data = self._request("GET", f"/rest/agile/1.0/sprint/{sprint_id}")
        sprint_info = {
            "id": sprint_data["id"],
            "name": sprint_data["name"],
            "state": sprint_data.get("state"),
            "startDate": sprint_data.get("startDate"),
            "endDate": sprint_data.get("endDate"),
            "goal": sprint_data.get("goal"),
        }

        # Fetch all sprint issues with pagination
        all_issues: List[Dict] = []
        start_at = 0
        while True:
            params = {
                "maxResults": max_results,
                "startAt": start_at,
                "fields": fields_str,
            }
            result = self._request(
                "GET", f"/rest/agile/1.0/sprint/{sprint_id}/issue", query_params=params
            )
            issues = result.get("issues", [])
            all_issues.extend(issues)
            total = result.get("total", 0)
            if len(all_issues) >= total or not issues:
                break
            start_at += len(issues)

        # Group by status
        status_groups: Dict[str, List[Dict]] = {}
        for issue in all_issues:
            f = issue.get("fields", {})
            status_name = _nested(f, "status", "name") or "Unknown"
            if status_name not in status_groups:
                status_groups[status_name] = []
            status_groups[status_name].append({
                "key": issue["key"],
                "type": _nested(f, "issuetype", "name"),
                "summary": f.get("summary"),
                "assignee": _nested(f, "assignee", "displayName") or "Não atribuído",
                "priority": _nested(f, "priority", "name"),
                "storyPoints": f.get("customfield_10016"),
            })

        issues_by_status = sorted(
            [{"status": s, "total": len(items), "issues": items} for s, items in status_groups.items()],
            key=lambda x: -x["total"],
        )

        by_status_summary = {g["status"]: g["total"] for g in issues_by_status}

        return {
            "sprint": sprint_info,
            "summary": {
                "total": len(all_issues),
                "byStatus": by_status_summary,
            },
            "issuesByStatus": issues_by_status,
        }


# ───────────────────────────────────────────
# Helpers
# ───────────────────────────────────────────

def _nested(d: Any, *keys: str) -> Optional[str]:
    """Safely traverse nested dicts, returning None if any key is missing."""
    current = d
    for k in keys:
        if isinstance(current, dict):
            current = current.get(k)
        else:
            return None
    return current
