#!/usr/bin/env python3
"""
jira_cli.py — Command-line interface for Jira REST API operations.

Usage:
    python jira_cli.py <subcommand> [options]

Subcommands:
    get-issue       Get a Jira issue by key
    search          Search issues via JQL
    create-issue    Create a new issue
    update-issue    Update an existing issue
    transition      Transition an issue to a new status
    export-issue    Export an issue as Markdown
    list-boards     List Jira boards
    list-sprints    List sprints for a board
    sprint-report   Generate a sprint status report

Environment variables:
    ATLASSIAN_TOKEN  — Personal Access Token (required)
    JIRA_BASE_URL    — Base URL (default: https://jira.bradesco.com.br:8443)
    JIRA_SSL_VERIFY  — Set to "true" to enable SSL verification (default: disabled)
"""

import argparse
import json
import sys
import os

# Allow running from skill root or scripts/ dir
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.jira_client import JiraClient, JiraClientError


def _print_json(data, compact: bool = False):
    """Pretty-print JSON to stdout."""
    if compact:
        print(json.dumps(data, ensure_ascii=False))
    else:
        print(json.dumps(data, indent=2, ensure_ascii=False))


def cmd_get_issue(args, client: JiraClient):
    result = client.get_issue(args.key, fields=args.fields, expand=args.expand)
    _print_json(result)


def cmd_search(args, client: JiraClient):
    result = client.search(
        args.jql,
        fields=args.fields.split(",") if args.fields else None,
        max_results=args.max_results,
        start_at=args.start_at,
    )
    _print_json(result)


def cmd_create_issue(args, client: JiraClient):
    description = args.description
    if args.description_file:
        with open(args.description_file, "r", encoding="utf-8") as f:
            md_content = f.read()
        from scripts.converters import markdown_to_jira_wiki
        description = markdown_to_jira_wiki(md_content)

    result = client.create_issue(
        project=args.project,
        issue_type=args.type,
        summary=args.summary,
        description=description,
        parent=args.parent,
    )
    key = result.get("key", "unknown")
    print(f"Issue created: {key}", file=sys.stderr)
    _print_json(result)


def cmd_update_issue(args, client: JiraClient):
    fields = {}
    if args.description:
        fields["description"] = args.description
    if args.description_file:
        with open(args.description_file, "r", encoding="utf-8") as f:
            md_content = f.read()
        from scripts.converters import markdown_to_jira_wiki
        fields["description"] = markdown_to_jira_wiki(md_content)
    if args.summary:
        fields["summary"] = args.summary

    if not fields:
        print("Error: provide at least one of --description, --description-file, or --summary", file=sys.stderr)
        sys.exit(1)

    client.update_issue(args.key, fields=fields)
    print(f"Issue {args.key} updated.", file=sys.stderr)


def cmd_transition(args, client: JiraClient):
    client.transition_issue(args.key, args.status)
    print(f"Issue {args.key} transitioned to '{args.status}'.", file=sys.stderr)


def cmd_export_issue(args, client: JiraClient):
    markdown = client.export_issue_markdown(args.key)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(markdown)
        print(f"Exported to {args.output}", file=sys.stderr)
    else:
        print(markdown)


def cmd_list_boards(args, client: JiraClient):
    result = client.list_boards(
        board_type=args.type,
        project=args.project,
        max_results=args.max_results,
        start_at=args.start_at,
    )
    _print_json(result)


def cmd_list_sprints(args, client: JiraClient):
    result = client.list_sprints(
        board_id=args.board,
        state=args.state,
        max_results=args.max_results,
        start_at=args.start_at,
    )
    _print_json(result)


def cmd_sprint_report(args, client: JiraClient):
    fields = args.fields.split(",") if args.fields else None
    result = client.sprint_report(
        sprint_id=args.sprint,
        fields=fields,
        max_results=args.max_results,
    )
    _print_json(result)


def main():
    parser = argparse.ArgumentParser(
        description="Jira CLI — interact with Jira Data Center via REST API",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # get-issue
    p = subparsers.add_parser("get-issue", help="Get a Jira issue by key")
    p.add_argument("--key", required=True, help="Issue key (e.g., PROJ-123)")
    p.add_argument("--fields", help="Comma-separated fields to return")
    p.add_argument("--expand", help="Comma-separated fields to expand")

    # search
    p = subparsers.add_parser("search", help="Search issues via JQL")
    p.add_argument("--jql", required=True, help="JQL query string")
    p.add_argument("--fields", help="Comma-separated fields to return")
    p.add_argument("--max-results", type=int, default=50, help="Max results (default: 50)")
    p.add_argument("--start-at", type=int, default=0, help="Pagination offset (default: 0)")

    # create-issue
    p = subparsers.add_parser("create-issue", help="Create a new Jira issue")
    p.add_argument("--project", required=True, help="Project key (e.g., PROJ)")
    p.add_argument("--type", required=True, help="Issue type (Story, Task, Bug, Sub-task)")
    p.add_argument("--summary", required=True, help="Issue summary/title")
    p.add_argument("--description", help="Description in Jira Wiki Markup")
    p.add_argument("--description-file", help="Markdown file to convert and use as description")
    p.add_argument("--parent", help="Parent issue key (for Sub-task)")

    # update-issue
    p = subparsers.add_parser("update-issue", help="Update an existing issue")
    p.add_argument("--key", required=True, help="Issue key")
    p.add_argument("--summary", help="New summary")
    p.add_argument("--description", help="New description in Jira Wiki Markup")
    p.add_argument("--description-file", help="Markdown file to convert and use as description")

    # transition
    p = subparsers.add_parser("transition", help="Transition issue to new status")
    p.add_argument("--key", required=True, help="Issue key")
    p.add_argument("--status", required=True, help="Target status name (e.g., 'In Progress')")

    # export-issue
    p = subparsers.add_parser("export-issue", help="Export issue as Markdown")
    p.add_argument("--key", required=True, help="Issue key")
    p.add_argument("--output", "-o", help="Output file (default: stdout)")

    # list-boards
    p = subparsers.add_parser("list-boards", help="List Jira boards")
    p.add_argument("--type", help="Board type filter (scrum, kanban)")
    p.add_argument("--project", help="Project key filter")
    p.add_argument("--max-results", type=int, default=50)
    p.add_argument("--start-at", type=int, default=0)

    # list-sprints
    p = subparsers.add_parser("list-sprints", help="List sprints for a board")
    p.add_argument("--board", type=int, required=True, help="Board ID")
    p.add_argument("--state", help="Sprint state filter (active, future, closed)")
    p.add_argument("--max-results", type=int, default=50)
    p.add_argument("--start-at", type=int, default=0)

    # sprint-report
    p = subparsers.add_parser("sprint-report", help="Generate sprint status report")
    p.add_argument("--sprint", type=int, required=True, help="Sprint ID")
    p.add_argument("--fields", help="Comma-separated issue fields")
    p.add_argument("--max-results", type=int, default=100)

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        sys.exit(1)

    try:
        client = JiraClient()
    except JiraClientError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    commands = {
        "get-issue": cmd_get_issue,
        "search": cmd_search,
        "create-issue": cmd_create_issue,
        "update-issue": cmd_update_issue,
        "transition": cmd_transition,
        "export-issue": cmd_export_issue,
        "list-boards": cmd_list_boards,
        "list-sprints": cmd_list_sprints,
        "sprint-report": cmd_sprint_report,
    }

    try:
        commands[args.command](args, client)
    except JiraClientError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except KeyboardInterrupt:
        sys.exit(130)


if __name__ == "__main__":
    main()
