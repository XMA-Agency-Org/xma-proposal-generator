# Animated Proposal — XMA / XMA Media

Create a highly personalized animated proposal website for an XMA or XMA Media prospect. Proposals live at `https://xma-proposal-generator.vercel.app/animated/<token>` once approved by admin.

## Prerequisites

The `xma-proposals` MCP server must be registered in Claude Code:

```bash
claude mcp add xma-proposals -- bun run /abs/path/mcp-server/src/index.ts
```

Add `MCP_DEFAULT_AUTHOR_ID` to `.env.local` (set it to your Supabase user UUID).

## Quick Start

1. Paste the discovery call transcript when asked.
2. Claude fetches packages, T&C, and snippets via MCP tools — no manual research needed.
3. Review the drafted content. Correct any numbers or details.
4. Claude submits with one tool call. You get a draft URL and any warnings.
5. Admin approves before the link goes live.

## Full Workflow

### Step 1: Gather context from rep

Ask the rep for:
- Full transcript (paste directly)
- Brand: **XMA** or **XMA Media** (default: XMA Media)
- Confirmed total investment (AED or USD)
- Whether there's a monthly retainer
- Their own name (provider name)

### Step 2: Ground in catalog

Call MCP tools to load structured context before drafting:

```
list_packages({ brand })          → find candidate package by price/features
get_package({ id })               → read features array for scope/solution grounding
list_tos_templates({ brand })     → list available T&C templates
get_tos_template({ id })          → load full clauses → use mapped_clauses as terms[]
list_snippets({ category })       → load problem/solution/guarantee copy bank
```

Pick the closest standard package. If nothing fits → `package_id: null` (custom).
Pick the T&C template that matches brand + payment type. Load its `mapped_clauses` directly as the `terms[]` array — then customize Clause 03 (Client Obligations) with the specific assets/access discussed on the call.

### Step 3: Draft the 30 variables

Every piece of content must come from the transcript, snippets, or package features — zero invention.

| Variable | Source |
|---|---|
| `client_first_name` | Transcript |
| `client_full_name` | Transcript |
| `company_name` | Transcript |
| `project_title` | 4-8 word descriptive title |
| `provider_name` | Rep's name |
| `agency_name` | "XMA Media" or "XMA Agency" |
| `intro_paragraph` | 2-3 sentences, refs specific call details |
| `challenge_intro` | 1 sentence, lead with dollar or opportunity impact |
| `problems[3]` | 3 pain points, {title, desc, icon_key} — draw from snippets |
| `solution_intro` | 1 sentence connecting solution to their specific problem |
| `solutions[3]` | 3 solutions mirroring problems, {title, desc, icon_key} — draw from snippets |
| `scope_phase_name` | "Phase 1: Foundation" or similar |
| `scope_subtitle` | One-line phase description |
| `scope_items[]` | 8-16 deliverables from call |
| `timeline_nodes[]` | 3-5 phases {label, days, desc} |
| `retainer_bullets[]` | Ongoing services (if retainer agreed) |
| `total_price_cents` | Investment in cents (AED 15,000 = 1500000) |
| `milestone_cents` | 50% of total (or agreed upfront amount) |
| `retainer_price_cents` | Monthly retainer in cents (if applicable) |
| `total_days` | Project duration in business days |
| `guarantee_text` | From snippets — customize if specific metrics agreed |
| `terms[]` | From `get_tos_template().mapped_clauses` — customize clause 03 |
| `package_id` | UUID from `list_packages`, or null |
| `tos_template_id` | UUID from `list_tos_templates` |

**Slug format:** `{first-name-lowercase}-{company-slug}-{mon}{year}` → e.g., `sarah-bloomforge-apr2026`

**Icon keys** (pick best match):
`time_loss`, `money_bleed`, `inefficiency`, `manual_ops`, `low_conversion`, `lead_leakage`, `growth`, `automation`, `speed`, `personalization`, `revenue`, `visibility`, `strategy`, `integration`, `analytics`

### Step 4: Show draft to rep

Present the full payload as JSON. Ask rep to confirm details — especially:
- Price, currency, total_days
- Client name spelling
- Scope items completeness

### Step 5: Submit with one tool call

```
create_animated_proposal({ payload })
```

Returns:
- `draft_url` — public URL (inactive until admin approves)
- `admin_url` — for admin approval
- `warnings[]` — soft issues to review (price deviation, brand mismatch, etc.)

If warnings appear, review with rep. Re-call with `override_warnings: true` if rep confirms to proceed anyway.

### Step 6: Notify

Tell rep:
- Admin must approve before sharing the link
- Admin URL: shown in tool output
- Public link: shown in tool output (share once approved)

## Content Fidelity Rule

**Zero invention.** Every dollar figure, pain point, and scope item must come from what the prospect said on the call or from the approved snippet library. If something wasn't discussed, leave it out.

## Common Mistakes

- Don't invent $ figures — use only what was mentioned.
- Don't generalize problems — name the specific process/tool the prospect mentioned.
- `problems` and `solutions` must each be exactly 3 items.
- `slug` must match `^[a-z0-9-]+$`.
- `total_price_cents` must be integer (no decimal).
- If using a T&C template, use `mapped_clauses` from `get_tos_template` as-is and customize only Clause 03.
