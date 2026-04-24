---
name: new-work
description: >
  Fetch new Jira work candidates when no outstanding work needs attention.
  Queries current sprint (and optionally backlog) for unassigned tickets
  matching BOT_LABEL, ordered by priority, with full context and repo matching.
when_to_use: >
  Invoke after triage shows all tasks clean and no outstanding work. Triggers on:
  "Priority 2", "new work", "find tickets", "no outstanding work", "all clean".
  Do NOT use during triage or when active tasks need attention.
user-invocable: true
allowed-tools:
  - "Bash(python3 .claude/skills/new-work/new_work.py *)"
  - Read
  - mcp__bot-memory__task_add
  - mcp__bot-memory__task_check_capacity
  - mcp__bot-memory__bot_status_update
  - mcp__mcp-atlassian__jira_get_issue
  - mcp__mcp-atlassian__jira_update_issue
  - mcp__mcp-atlassian__jira_add_comment
  - mcp__mcp-atlassian__jira_get_transitions
  - mcp__mcp-atlassian__jira_transition_issue
  - mcp__mcp-atlassian__jira_create_issue_link
  - mcp__mcp-atlassian__jira_get_sprints_from_board
  - mcp__mcp-atlassian__jira_add_issues_to_sprint
---

Run the new-work script to find candidate tickets:

```bash
python3 .claude/skills/new-work/new_work.py 2>&1
```

The output lists unassigned tickets from the current sprint (and backlog if enabled),
ordered by priority, with full description/comments/links and repo: label matching.

Pick the first candidate with matching `repos:` field. Follow CLAUDE.md Priority 2 rules
for claiming, implementing, and opening PRs.
