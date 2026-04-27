# XMA Proposals MCP Server

Local MCP server that gives Claude Code structured access to the XMA proposal catalog — packages, T&C templates, content snippets — and lets it create proposals in one shot.

## What it does

| Tool | Purpose |
|---|---|
| `list_packages` | List active packages filtered by brand |
| `get_package` | Full package details (price, features) |
| `list_tos_templates` | List T&C templates filtered by brand |
| `get_tos_template` | Full clauses, pre-mapped to `{clause_no, title, body}` format |
| `list_snippets` | Index of problem/solution/guarantee snippets |
| `get_snippet` | Full snippet content by slug |
| `create_animated_proposal` | Validate + insert proposal, return draft URL + warnings |

## Setup

### 1. Install deps

```bash
cd mcp-server
bun install
```

### 2. Add env var

In `.env.local` (project root), add:

```
MCP_DEFAULT_AUTHOR_ID=<your-supabase-user-uuid>
```

Get your UUID: open Supabase dashboard → Authentication → Users.

### 3. Apply DB migration

```bash
bun supabase db push
# or paste supabase/migrations/20260427_proposal_guardrails.sql into the dashboard SQL editor
```

### 4. Register with Claude Code

```bash
claude mcp add xma-proposals -- bun run /absolute/path/to/mcp-server/src/index.ts
```

Replace `/absolute/path/to/` with the actual path to this project.

Restart Claude Code. Run `/mcp` to confirm `xma-proposals` shows 7 tools.

### 5. Use the skill

In Claude Code:
```
/animated-proposal-xma
```

Paste the discovery call transcript and follow the prompts.

## Local development

```bash
cd mcp-server
bun run dev
```

The `--watch` flag restarts on file changes. Test tools via `claude mcp dev` or by running the skill.
